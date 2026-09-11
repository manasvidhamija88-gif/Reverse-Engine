import os
import json
import math
from dotenv import load_dotenv
load_dotenv()

from thefuzz import fuzz
from datetime import datetime, timezone
from models import Problem, Article
from google import genai

# Set up the Gemini client (reads GEMINI_API_KEY from environment automatically)
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))


def get_embedding(text):
    """Ask Gemini to convert a piece of text into a list of numbers (embedding)."""
    try:
        response = client.models.embed_content(
            model="gemini-embedding-001",
            contents=text
        )
        return response.embeddings[0].values
    except Exception as e:
        print(f"Embedding generation failed for text '{text[:50]}...': {e}")
        return None


def cosine_similarity(vec_a, vec_b):
    """Measures how similar two embeddings are. Returns a number from -1 to 1
    (1 = identical meaning, 0 = unrelated, negative = opposite)."""
    dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
    magnitude_a = math.sqrt(sum(a * a for a in vec_a))
    magnitude_b = math.sqrt(sum(b * b for b in vec_b))

    if magnitude_a == 0 or magnitude_b == 0:
        return 0

    return dot_product / (magnitude_a * magnitude_b)


def generate_summary(problem, articles):
    article_texts = []
    for article in articles:
        piece = f"- {article.title}"
        if article.description:
            piece += f": {article.description}"
        article_texts.append(piece)

    combined = "\n".join(article_texts)

    prompt = (
        "You are summarizing a real-world problem based on news articles. "
        "Write a short, neutral, 2-3 sentence summary of what is actually happening, "
        "based only on the information below. Do not add speculation.\n\n"
        f"Articles:\n{combined}\n\nSummary:"
    )

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print(f"Summary generation failed for problem '{problem.title}': {e}")
        return None


def update_problem_metadata(problem, db):
    articles = db.query(Article).filter(Article.problem_id == problem.id).all()

    dates = []
    sources = set()

    for article in articles:
        if article.source:
            sources.add(article.source)

        if article.published_at:
            try:
                clean_date = article.published_at.replace("Z", "+00:00")
                parsed = datetime.fromisoformat(clean_date)
                dates.append(parsed)
            except ValueError:
                pass  # skip articles with a date we can't parse

    if dates:
        problem.first_seen = min(dates)
        problem.last_seen = max(dates)

    problem.source_count = len(sources)

    # --- Severity score calculation ---
    score = problem.source_count * 10

    if problem.last_seen:
        now = datetime.now(timezone.utc)
        last_seen_utc = problem.last_seen
        if last_seen_utc.tzinfo is None:
            last_seen_utc = last_seen_utc.replace(tzinfo=timezone.utc)

        hours_old = (now - last_seen_utc).total_seconds() / 3600

        if hours_old <= 24:
            score += 20
        elif hours_old <= 72:
            score += 10
        elif hours_old <= 168:  # 1 week
            score += 5
        # older than a week: no bonus

    problem.severity_score = score
    # --- End severity score calculation ---

    # --- Summary generation (only if not already generated) ---
    if not problem.summary and articles:
        summary_text = generate_summary(problem, articles)
        if summary_text:
            problem.summary = summary_text
    # --- End summary generation ---

    db.commit()


def group_into_problems(query, db):
    ungrouped_articles = db.query(Article).filter(
        Article.query == query,
        Article.problem_id == None
    ).all()

    existing_problems = db.query(Problem).filter(Problem.query == query).all()

    for article in ungrouped_articles:
        matched_problem = None

        # --- Step 1: try fast, free fuzzy matching first (unchanged from before) ---
        for problem in existing_problems:
            similarity = fuzz.token_sort_ratio(article.title, problem.title)
            if similarity >= 80:
                matched_problem = problem
                break

        # --- Step 2: if fuzzy matching found nothing, try semantic embeddings ---
        if not matched_problem and existing_problems:
            article_embedding = get_embedding(article.title)

            if article_embedding:
                best_score = 0
                best_problem = None

                for problem in existing_problems:
                    # Make sure this problem has an embedding saved; generate one if missing
                    if not problem.embedding:
                        problem_embedding = get_embedding(problem.title)
                        if problem_embedding:
                            problem.embedding = json.dumps(problem_embedding)
                            db.commit()
                        else:
                            continue
                    else:
                        problem_embedding = json.loads(problem.embedding)

                    score = cosine_similarity(article_embedding, problem_embedding)

                    if score > best_score:
                        best_score = score
                        best_problem = problem

                # 0.85 is a common "same meaning" threshold for embeddings
                if best_problem and best_score >= 0.85:
                    matched_problem = best_problem

        # --- Assign the article to a problem (existing or new) ---
        if matched_problem:
            article.problem_id = matched_problem.id
        else:
            new_problem = Problem(title=article.title, query=query)
            db.add(new_problem)
            db.commit()
            db.refresh(new_problem)

            article.problem_id = new_problem.id
            existing_problems.append(new_problem)

    db.commit()

    for problem in existing_problems:
        update_problem_metadata(problem, db)

    print(f"Grouped {len(ungrouped_articles)} articles into problems for '{query}'")


def get_problems_with_articles(query, db):
    problems = db.query(Problem).filter(Problem.query == query).order_by(Problem.severity_score.desc()).all()

    result = []
    for problem in problems:
        articles = db.query(Article).filter(Article.problem_id == problem.id).all()

        if problem.severity_score >= 25:
            severity_label = "High"
        elif problem.severity_score >= 12:
            severity_label = "Medium"
        else:
            severity_label = "Low"

        result.append({
            "id": problem.id,
            "title": problem.title,
            "article_count": len(articles),
            "severity": severity_label,
            "summary": problem.summary,
            "articles": articles
        })

    return result