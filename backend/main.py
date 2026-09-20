from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from grouping import group_into_problems, get_problems_with_articles
from auth import create_access_token, get_current_user
from database import SessionLocal, engine
from models import Base, User, Problem
from schemas import UserCreate, UserLogin
from collectors.news import fetch_news
from collectors.hackernews import fetch_hackernews

import os
import json
import time
import re
import hashlib
import bcrypt

from google import genai
from dotenv import load_dotenv


# =========================================================
# DATABASE
# =========================================================

Base.metadata.create_all(bind=engine)


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI()


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://reverse-engine.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# GEMINI
# =========================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# =========================================================
# DATABASE SESSION
# =========================================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =========================================================
# PASSWORD FUNCTIONS
# =========================================================

def prepare_password(password: str) -> bytes:
    """
    Convert the password into a SHA-256 digest before
    sending it to bcrypt.

    This prevents bcrypt's 72-byte password limitation.
    """

    return hashlib.sha256(
        password.encode("utf-8")
    ).hexdigest().encode("utf-8")


def hash_password(password: str) -> str:
    """
    Hash a password using SHA-256 + bcrypt.
    """

    password_bytes = prepare_password(password)

    hashed = bcrypt.hashpw(
        password_bytes,
        bcrypt.gensalt()
    )

    return hashed.decode("utf-8")


def verify_password(
    password: str,
    stored_hash: str
) -> bool:
    """
    Verify a password against the stored bcrypt hash.

    First checks the new SHA-256 + bcrypt format.

    Then attempts the old direct-bcrypt format so
    previously registered users are not unnecessarily
    locked out.
    """

    # -----------------------------------------------------
    # NEW PASSWORD FORMAT
    # -----------------------------------------------------

    try:
        prepared_password = prepare_password(password)

        if bcrypt.checkpw(
            prepared_password,
            stored_hash.encode("utf-8")
        ):
            return True

    except Exception:
        pass


    # -----------------------------------------------------
    # OLD PASSWORD FORMAT
    # -----------------------------------------------------

    try:
        password_bytes = password.encode("utf-8")

        if len(password_bytes) <= 72:

            if bcrypt.checkpw(
                password_bytes,
                stored_hash.encode("utf-8")
            ):
                return True

    except Exception:
        pass


    return False


# =========================================================
# REGISTER
# =========================================================

@app.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        return {
            "error": "Email already registered"
        }


    try:

        hashed_password = hash_password(
            user.password
        )

    except Exception as e:

        print(
            f"Password hashing error: {e}"
        )

        return {
            "error": "Unable to create account"
        }


    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )


    try:

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

    except Exception as e:

        db.rollback()

        print(
            f"Registration database error: {e}"
        )

        return {
            "error": "Unable to create account"
        }


    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }


# =========================================================
# LOGIN
# =========================================================

@app.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )


    if not db_user:
        return {
            "error": "Invalid email or password"
        }


    if not verify_password(
        user.password,
        db_user.hashed_password
    ):
        return {
            "error": "Invalid email or password"
        }


    access_token = create_access_token(
        data={
            "sub": db_user.email
        }
    )


    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# =========================================================
# CURRENT USER
# =========================================================

@app.get("/me")
def read_current_user(
    current_user: str = Depends(get_current_user)
):

    return {
        "email": current_user
    }


# =========================================================
# SEARCH
# =========================================================

@app.post("/search")
def search(
    query: dict,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    search_term = query["query"]


    news_articles = fetch_news(
        search_term
    )

    hn_articles = fetch_hackernews(
        search_term
    )


    all_articles = (
        news_articles + hn_articles
    )


    group_into_problems(
        search_term,
        db
    )


    problems = get_problems_with_articles(
        search_term,
        db
    )


    return {
        "query": search_term,
        "status": "ok",
        "problem_count": len(problems),
        "problems": problems
    }


# =========================================================
# CHAT
# =========================================================

@app.post("/chat")
def chat(
    query: dict,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    message = query.get(
        "message"
    )


    if not message:
        return {
            "error": "Message is required"
        }


    history = query.get(
        "history",
        []
    )


    conversation_context = ""


    for item in history[-10:]:

        role = (
            "User"
            if item.get("role") == "user"
            else "Reverse AI"
        )

        text = item.get(
            "text",
            ""
        )


        conversation_context += (
            f"{role}: {text}\n"
        )


    problems = (
        db.query(Problem)
        .order_by(
            Problem.severity_score.desc()
        )
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

        print(
            f"Chat error: {e}"
        )


        return {
            "error": "AI response failed"
        }


# =========================================================
# ANALYZE STARTUP OPPORTUNITY
# =========================================================

@app.post("/analyze-opportunity")
def analyze_opportunity(
    query: dict,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    problem_id = query.get(
        "problem_id"
    )


    if not problem_id:

        return {
            "error": "Problem ID is required"
        }


    problem = (
        db.query(Problem)
        .filter(
            Problem.id == problem_id
        )
        .first()
    )


    if not problem:

        return {
            "error": "Problem not found"
        }


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


    # -----------------------------------------------------
    # TRY GEMINI UP TO 3 TIMES
    # -----------------------------------------------------

    for attempt in range(3):

        try:

            response = client.models.generate_content(
                model="gemini-3.6-flash",
                contents=prompt
            )


            response_text = (
                response.text.strip()
            )


            if response_text.startswith("```"):

                response_text = (
                    response_text
                    .replace("```json", "")
                    .replace("```", "")
                    .strip()
                )


            start = response_text.find(
                "{"
            )

            end = response_text.rfind(
                "}"
            )


            if start == -1 or end == -1:

                return {
                    "error": "AI did not return valid JSON"
                }


            response_text = response_text[
                start:end + 1
            ]


            analysis = json.loads(
                response_text
            )


            return {
                "analysis": analysis
            }


        except Exception as e:

            error_message = str(e)


            print(
                f"Opportunity analysis attempt "
                f"{attempt + 1} failed: "
                f"{error_message}"
            )


            if (
                "503" in error_message
                and attempt < 2
            ):

                time.sleep(3)

                continue


            return {
                "error": error_message
            }


    return {
        "error": (
            "Gemini is temporarily unavailable. "
            "Please try again."
        )
    }


# =========================================================
# ASSESS NOVELTY
# =========================================================

@app.post("/assess-novelty")
def assess_novelty(
    query: dict,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    problem_id = query.get(
        "problem_id"
    )


    if not problem_id:

        return {
            "error": "Problem ID is required"
        }


    problem = (
        db.query(Problem)
        .filter(
            Problem.id == problem_id
        )
        .first()
    )


    if not problem:

        return {
            "error": "Problem not found"
        }


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


        response_text = (
            response.text.strip()
        )


        if response_text.startswith("```"):

            response_text = (
                response_text
                .replace("```json", "")
                .replace("```", "")
                .strip()
            )


        start = response_text.find(
            "{"
        )

        end = response_text.rfind(
            "}"
        )


        if start == -1 or end == -1:

            return {
                "error": "AI did not return valid JSON"
            }


        response_text = response_text[
            start:end + 1
        ]


        novelty = json.loads(
            response_text
        )


        return {
            "novelty": novelty
        }


    except Exception as e:

        print(
            f"Novelty assessment error: {e}"
        )


        return {
            "error": str(e)
        }


# =========================================================
# PROBLEM RELATIONSHIP MAP
# =========================================================

@app.post("/problem-relationships")
def problem_relationships(
    query: dict,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    problem_id = query.get(
        "problem_id"
    )


    if not problem_id:

        return {
            "error": "Problem ID is required"
        }


    current_problem = (
        db.query(Problem)
        .filter(
            Problem.id == problem_id
        )
        .first()
    )


    if not current_problem:

        return {
            "error": "Problem not found"
        }


    stop_words = {
        "the",
        "and",
        "for",
        "with",
        "from",
        "that",
        "this",
        "are",
        "was",
        "were",
        "has",
        "have",
        "into",
        "their",
        "about",
        "problem",
        "issues",
        "issue",
        "using",
        "used",
        "through",
        "between",
        "where",
        "which",
        "will",
        "can",
        "more",
        "than"
    }


    def get_words(problem):

        text = (
            f"{problem.title or ''} "
            f"{problem.summary or ''}"
        )


        words = re.findall(
            r"[a-zA-Z]{4,}",
            text.lower()
        )


        return set(
            word
            for word in words
            if word not in stop_words
        )


    current_words = get_words(
        current_problem
    )


    all_problems = (
        db.query(Problem)
        .filter(
            Problem.id != problem_id
        )
        .all()
    )


    relationships = []


    for problem in all_problems:

        problem_words = get_words(
            problem
        )


        if (
            not current_words
            or not problem_words
        ):

            similarity = 0

        else:

            common_words = (
                current_words
                .intersection(
                    problem_words
                )
            )


            total_words = (
                current_words
                .union(
                    problem_words
                )
            )


            similarity = (
                len(common_words)
                / len(total_words)
            )


        # Same-query boost

        if (
            current_problem.query
            and problem.query
            and current_problem.query.lower()
            == problem.query.lower()
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

                "similarity": round(
                    min(similarity, 1) * 100
                )

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