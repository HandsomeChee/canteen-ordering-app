import sqlite3

def seed():
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()

    # List of student IDs to insert
    student_ids = ['123', '456', '789']
    for sid in student_ids:
        cur.execute(
            "INSERT INTO orders (studentId, status) VALUES (?, ?)",
            (sid, 'preparing')
        )
        print(f"Seeded order for student {sid}, id = {cur.lastrowid}")

    conn.commit()
    conn.close()

if __name__ == '__main__':
    seed()
