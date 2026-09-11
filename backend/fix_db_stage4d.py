import sqlite3

conn = sqlite3.connect("reverse_search.db")
cursor = conn.cursor()

cursor.execute("ALTER TABLE problems ADD COLUMN summary TEXT")

conn.commit()
conn.close()

print("Migration complete: summary added to problems table")