import sqlite3

conn = sqlite3.connect("reverse_search.db")
cursor = conn.cursor()

cursor.execute("ALTER TABLE problems ADD COLUMN severity_score INTEGER DEFAULT 0")

conn.commit()
conn.close()

print("Migration complete: severity_score added to problems table")