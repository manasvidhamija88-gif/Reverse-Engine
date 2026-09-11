import sqlite3

conn = sqlite3.connect("reverse_search.db")
cursor = conn.cursor()

# Add the 3 new columns to the existing 'problems' table
cursor.execute("ALTER TABLE problems ADD COLUMN first_seen DATETIME")
cursor.execute("ALTER TABLE problems ADD COLUMN last_seen DATETIME")
cursor.execute("ALTER TABLE problems ADD COLUMN source_count INTEGER DEFAULT 0")

conn.commit()
conn.close()

print("Migration complete: first_seen, last_seen, source_count added to problems table")