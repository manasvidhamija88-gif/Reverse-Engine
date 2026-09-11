from thefuzz import fuzz
from database import SessionLocal
from models import Article

db = SessionLocal()
articles = db.query(Article).all()
db.close()

SIMILARITY_THRESHOLD = 80  # 0-100, higher = stricter match

print(f"Checking {len(articles)} articles for likely duplicates...\n")

found_any = False

for i in range(len(articles)):
    for j in range(i + 1, len(articles)):
        a1 = articles[i]
        a2 = articles[j]

        score = fuzz.token_sort_ratio(a1.title, a2.title)

        if score >= SIMILARITY_THRESHOLD:
            found_any = True
            print(f"Possible duplicate (similarity: {score}):")
            print(f"  1. [{a1.query}] {a1.title} ({a1.source})")
            print(f"  2. [{a2.query}] {a2.title} ({a2.source})")
            print()

if not found_any:
    print("No likely duplicates found.")