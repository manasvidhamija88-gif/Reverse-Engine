from database import SessionLocal
from models import Problem, Article

db = SessionLocal()

problems = db.query(Problem).all()

for problem in problems:
    articles = db.query(Article).filter(Article.problem_id == problem.id).all()
    print(f"\nProblem #{problem.id}: {problem.title}")
    print(f"  -> {len(articles)} article(s) grouped under this problem:")
    for article in articles:
        print(f"     - [{article.source_type}] {article.title}")

db.close()