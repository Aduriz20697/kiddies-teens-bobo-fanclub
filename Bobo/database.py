import sqlite3
from datetime import datetime

def create_database():
    """Create the fan club database and members table"""
    conn = sqlite3.connect('fan_club.db')
    cursor = conn.cursor()
    
    # Create members table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            school_name TEXT NOT NULL,
            grade_level TEXT NOT NULL,
            class_form TEXT,
            parent_phone TEXT,
            join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()
    print("Database created successfully!")

def add_member(name, email, school_name, grade_level, class_form=None, parent_phone=None):
    """Add a new member to the database"""
    conn = sqlite3.connect('fan_club.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO members (name, email, school_name, grade_level, class_form, parent_phone)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (name, email, school_name, grade_level, class_form, parent_phone))
        
        conn.commit()
        member_id = cursor.lastrowid
        print(f"Member added successfully with ID: {member_id}")
        return member_id
    except sqlite3.IntegrityError:
        print("Error: Email already exists!")
        return None
    finally:
        conn.close()

def get_all_members():
    """Retrieve all members from the database"""
    conn = sqlite3.connect('fan_club.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM members ORDER BY join_date DESC')
    members = cursor.fetchall()
    conn.close()
    
    return members

if __name__ == "__main__":
    create_database()