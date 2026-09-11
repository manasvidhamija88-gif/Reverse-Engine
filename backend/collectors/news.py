import os
import requests
from dotenv import load_dotenv
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Article

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
NEWS_API_URL = "https://newsapi.org/v2/everything"


def fetch_news(query: str, page_size: int = 5):
    params = {
        "q": query,
        "apiKey": NEWS_API_KEY,
        "pageSize": page_size,
        "language": "en",
        "sortBy": "relevancy",
    }

    response = requests.get(NEWS_API_URL, params=params)
    data = response.json()

    if data.get("status") != "ok":
        print("Error from NewsAPI:", data)
        return []

    articles_raw = data.get("articles", [])
    results = []

    db: Session = SessionLocal()
    try:
        for article in articles_raw:
            article_data = {
                "query": query,
                "title": article.get("title"),
                "description": article.get("description"),
                "source": article.get("source", {}).get("name"),
                "url": article.get("url"),
                "published_at": article.get("publishedAt"),
                "source_type": "newsapi",
            }

            # Skip if this URL is already saved
            existing = db.query(Article).filter(Article.url == article_data["url"]).first()
            if not existing:
                db_article = Article(**article_data)
                db.add(db_article)

            results.append(article_data)

        db.commit()
    finally:
        db.close()

    return results


# Quick manual test — only runs when you run this file directly
if __name__ == "__main__":
    results = fetch_news("agriculture")
    for r in results:
        print(r["title"], "-", r["source"])