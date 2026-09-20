from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from grouping import group_into_problems, get_problems_with_articles
from auth import create_access_token, get_current_user
from database import SessionLocal, engine
from models import Base, User, Problem
from schemas import UserCreate, UserLogin
from collectors.news import fetch_news
from collectors.hackernews import fetch_hackernews
import os
from google import genai
from dotenv import load_dotenv
import json
import time
import re
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=GEMINI_API_KEY)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        return {"error": "Email already registered"}

    hashed_password = pwd_context.hash(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully", "user_id": new_user.id}


@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        return {"error": "Invalid email or password"}

    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/me")
def read_current_user(current_user: str = Depends(get_current_user)):
    return {"email": current_user}


@app.post("/search")
def search(query: dict, current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    search_term = query["query"]

    news_articles = fetch_news(search_term)
    hn_articles = fetch_hackernews(search_term)

    all_articles = news_articles + hn_articles
    group_into_problems(search_term, db)

    problems = get_problems_with_articles(search_term, db)

    return {
        "query": search_term,
        "status": "ok",
        "problem_count": len(problems),
        "problems": problems
    }

@app.post("/chat")
def chat(
    query: dict,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    message = query.get("message")

    if not message:
        return {"error": "Message is required"}

    history = query.get("history", [])

    conversation_context = ""

    for item in history[-10:]:
        role = "User" if item.get("role") == "user" else "Reverse AI"
        text = item.get("text", "")

        conversation_context += f"{role}: {text}\n"

    problems = (
        db.query(Problem)
        .order_by(Problem.severity_score.desc())
        .limit(15)
        .all()
    )

    problem_context = ""

    for problem in problems:
        problem_context += f"""
Problem: {problem.title}
Severity: {problem.severity_score}
Summary: {problem.summary or "No summary available"}
"""

    prompt = f"""
You are Reverse Engine AI, an AI assistant for discovering and analyzing
real-world problems and startup opportunities.

Use the Reverse Engine database below when relevant.

REVERSE ENGINE PROBLEMS:
{problem_context}

CONVERSATION HISTORY:
{conversation_context}

USER QUESTION:
{message}

Instructions:
- Give a clear, structured answer.
- Use short paragraphs and bullet points where useful.
- Remember the context of the conversation when answering.
- If the user refers to something they said earlier, use the conversation history.
- Do not invent facts about the Reverse Engine database.
- If the database does not contain enough information, say so clearly.
- Keep the answer concise but useful.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        return {
            "response": response.text
        }

    except Exception as e:
        print(f"Chat error: {e}")

        return {
            "error": "AI response failed"
        }
@app.post("/analyze-opportunity")
def analyze_opportunity(
    query: dict,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    problem_id = query.get("problem_id")

    if not problem_id:
        return {"error": "Problem ID is required"}

    problem = db.query(Problem).filter(
        Problem.id == problem_id
    ).first()

    if not problem:
        return {"error": "Problem not found"}

    prompt = f"""
You are Reverse Engine AI's Startup Opportunity Engine.

Analyze this real-world problem and identify a potential startup opportunity.

PROBLEM:
{problem.title}

SEVERITY:
{problem.severity_score}

SUMMARY:
{problem.summary or "No summary available"}

Return ONLY JSON in this exact structure:

{{
    "affected_users": "Who is affected by this problem",
    "existing_solutions": "What types of solutions currently exist",
    "unsolved_gap": "What important gap remains",
    "startup_idea": "A specific startup opportunity",
    "target_users": "Who would use or pay for it",
    "revenue_model": "A possible way the startup could make money",
    "technology": "Technology that could be used",
    "impact": "Potential positive impact"
}}

Rules:
- Return valid JSON only.
- Do not use markdown.
- Do not use ```json.
- Do not invent statistics or specific facts.
- Keep each answer concise.
"""

    # Try Gemini up to 3 times if it temporarily returns 503
    for attempt in range(3):

        try:
            response = client.models.generate_content(
                model="gemini-3.6-flash",
                contents=prompt
            )

            response_text = response.text.strip()

            if response_text.startswith("```"):
                response_text = response_text.replace("```json", "")
                response_text = response_text.replace("```", "")
                response_text = response_text.strip()

            start = response_text.find("{")
            end = response_text.rfind("}")

            if start == -1 or end == -1:
                return {
                    "error": "AI did not return valid JSON"
                }

            response_text = response_text[start:end + 1]

            analysis = json.loads(response_text)

            return {
                "analysis": analysis
            }

        except Exception as e:

            error_message = str(e)

            print(
                f"Opportunity analysis attempt {attempt + 1} failed: "
                f"{error_message}"
            )

            # Gemini temporary overload / unavailable
            if "503" in error_message and attempt < 2:
                time.sleep(3)
                continue

            return {
                "error": error_message
            }

    return {
        "error": "Gemini is temporarily unavailable. Please try again."
    }
@app.post("/assess-novelty")
def assess_novelty(
    query: dict,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    problem_id = query.get("problem_id")

    if not problem_id:
        return {"error": "Problem ID is required"}

    problem = db.query(Problem).filter(
        Problem.id == problem_id
    ).first()

    if not problem:
        return {"error": "Problem not found"}

    prompt = f"""
You are Reverse Engine AI's AI-based Novelty Assessment Engine.

Assess the following real-world problem.

PROBLEM:
{problem.title}

SUMMARY:
{problem.summary or "No summary available"}

Return ONLY valid JSON in exactly this structure:

{{
    "uniqueness": 0,
    "market_gap": 0,
    "existing_overlap": 0,
    "assessment": "..."
}}

Rules:
- Scores must be integers from 0 to 100.
- These are AI-based assessment scores, not scientifically validated measurements.
- Higher uniqueness means the problem appears less commonly addressed by existing approaches.
- Higher market_gap means there appears to be more room for a new solution.
- Higher existing_overlap means the problem appears to have substantial existing solution coverage.
- Do not invent statistics or specific facts.
- Keep the assessment concise.
- Return JSON only.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        response_text = response.text.strip()

        if response_text.startswith("```"):
            response_text = response_text.replace("```json", "")
            response_text = response_text.replace("```", "")
            response_text = response_text.strip()

        start = response_text.find("{")
        end = response_text.rfind("}")

        if start == -1 or end == -1:
            return {"error": "AI did not return valid JSON"}

        response_text = response_text[start:end + 1]

        novelty = json.loads(response_text)

        return {
            "novelty": novelty
        }

    except Exception as e:
        print(f"Novelty assessment error: {e}")

        return {
            "error": str(e)
        }
@app.post("/problem-relationships")
def problem_relationships(
    query: dict,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    problem_id = query.get("problem_id")

    if not problem_id:
        return {"error": "Problem ID is required"}

    current_problem = db.query(Problem).filter(
        Problem.id == problem_id
    ).first()

    if not current_problem:
        return {"error": "Problem not found"}

    stop_words = {
        "the", "and", "for", "with", "from", "that",
        "this", "are", "was", "were", "has", "have",
        "into", "their", "about", "problem", "issues",
        "issue", "using", "used", "through", "between",
        "where", "which", "will", "can", "more", "than"
    }

    def get_words(problem):
        text = f"{problem.title or ''} {problem.summary or ''}"
        words = re.findall(r"[a-zA-Z]{4,}", text.lower())
        return set(word for word in words if word not in stop_words)

    current_words = get_words(current_problem)

    all_problems = db.query(Problem).filter(
        Problem.id != problem_id
    ).all()

    relationships = []

    for problem in all_problems:

        problem_words = get_words(problem)

        if not current_words or not problem_words:
            similarity = 0
        else:
            common_words = current_words.intersection(problem_words)
            total_words = current_words.union(problem_words)

            similarity = len(common_words) / len(total_words)

        # Give a small boost when both problems came from the same query
        if (
            current_problem.query
            and problem.query
            and current_problem.query.lower() == problem.query.lower()
        ):
            similarity += 0.15

        if similarity >= 0.08:

            relationships.append({
                "id": problem.id,
                "title": problem.title,
                "severity": (
                    "High"
                    if problem.severity_score >= 25
                    else "Medium"
                    if problem.severity_score >= 12
                    else "Low"
                ),
                "summary": problem.summary,
                "similarity": round(min(similarity, 1) * 100)
            })

    relationships.sort(
        key=lambda x: x["similarity"],
        reverse=True
    )

    relationships = relationships[:8]

    return {
        "problem": {
            "id": current_problem.id,
            "title": current_problem.title,
            "severity": (
                "High"
                if current_problem.severity_score >= 25
                else "Medium"
                if current_problem.severity_score >= 12
                else "Low"
            ),
            "summary": current_problem.summary
        },
        "relationships": relationships
    }