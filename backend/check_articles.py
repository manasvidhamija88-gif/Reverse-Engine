from database import SessionLocal
from models import Article

db = SessionLocal()
articles = db.query(Article).all()

print(f"Total articles saved: {len(articles)}")
for a in articles:
    print(f"- [{a.query}] {a.title} ({a.source})")

db.close()