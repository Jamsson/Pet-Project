import sqlite3

db = sqlite3.connect(
  'data.sqlite3'
)
cursor = db.cursor()

cursor.execute(f"UPDATE rls SET id = ? WHERE id = ?", (
  834377109945319488, 834377109945319488
))
db.commit()
for i in cursor.execute("SELECT * FROM rls "):
  print(i)