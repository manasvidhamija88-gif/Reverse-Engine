import sqlite3

conn = sqlite3.connect("reverse_search.db")
cursor = conn.cursor()

cursor.execute("ALTER TABLE problems ADD COLUMN embedding TEXT")

conn.commit()
conn.close()

print("Migration complete: embedding added to problems table")