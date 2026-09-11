import requests
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Article

HN_SEARCH_URL = "https://hn.algolia.com/api/v1/search"


def fetch_hackernews(query: str, page_size: int = 5):
    params = {
        "query": query,
        "tags": "story",
        "hitsPerPage": page_size,
    }

    response = requests.get(HN_SEARCH_URL, params=params)
    data = response.json()

    hits = data.get("hits", [])
    results = []

    db: Session = SessionLocal()
    try:
        for hit in hits:
            article_data = {
                "query": query,
                "title": hit.get("title"),
                "description": None,
                "source": "Hacker News",
                "url": hit.get("url") or f"https://news.ycombinator.com/item?id={hit.get('objectID')}",
                "published_at": hit.get("created_at"),
                "source_type": "hackernews",
            }

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
    results = fetch_hackernews("startup")
    for r in results:
        print(r["title"])