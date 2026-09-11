import sqlite3
from database import engine
from models import Base

# Step 1: create any brand-new tables (like "problems") that don't exist yet
Base.metadata.create_all(bind=engine)
print("New tables created (if any were missing).")

# Step 2: manually add the new column to the existing "articles" table
conn = sqlite3.connect("reverse_search.db")
cursor = conn.cursor()

try:
    cursor.execute("ALTER TABLE articles ADD COLUMN problem_id INTEGER")
    conn.commit()
    print("problem_id column added to articles table.")
except sqlite3.OperationalError as e:
    print("Skipped (probably already exists):", e)

conn.close()