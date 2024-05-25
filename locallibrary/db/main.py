import sqlite3

def create_database():
    # Connect to the SQLite database
    conn = sqlite3.connect('./db/data.db')
    cursor = conn.cursor()

    # Drop existing tables in the reverse order of creation due to foreign key constraints
    cursor.execute('DROP TABLE IF EXISTS BookInstance')
    cursor.execute('DROP TABLE IF EXISTS Book')
    cursor.execute('DROP TABLE IF EXISTS Genre')
    cursor.execute('DROP TABLE IF EXISTS Author')


    # Create the tables
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Author (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        family_name TEXT NOT NULL,
        date_of_birth TEXT,
        date_of_death TEXT,
        image_path TEXT
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Genre (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author INTEGER NOT NULL,
        summary TEXT NOT NULL,
        isbn TEXT NOT NULL,
        genre TEXT NOT NULL,
        FOREIGN KEY (author) REFERENCES Author (id)
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS BookInstance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id INTEGER NOT NULL,
        imprint TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('Available', 'Maintenance', 'Loaned', 'Reserved')),
        due_back TEXT DEFAULT CURRENT_DATE,
        FOREIGN KEY (book_id) REFERENCES Book (id)
    )
    ''')


    # Insert data into tables
    authors = [
        ('George', 'Orwell', '1903-06-25', '1950-01-21', ''),
        ('Jane', 'Austen', '1775-12-16', '1817-07-18', '')
    ]
    cursor.executemany('INSERT INTO Author (first_name, family_name, date_of_birth, date_of_death, image_path) VALUES (?, ?, ?, ?, ?)', authors)

    genres = [
        ('Fiction',),
        ('Science Fiction',)
    ]
    cursor.executemany('INSERT INTO Genre (name) VALUES (?)', genres)

    books = [
        ('1984', 1, 'A dystopian novel.', '978-0451524935', 'Science Fiction'),
        ('Pride and Prejudice', 2, 'A romantic novel.', '978-1503290563', 'Fiction')
    ]
    cursor.executemany('INSERT INTO Book (title, author, summary, isbn, genre) VALUES (?, ?, ?, ?, ?)', books)

    book_instances = [
        (1, 'Random House', 'Available', '2024-12-31'),
        (2, 'Penguin Books', 'Loaned', '2024-11-15')
    ]
    cursor.executemany('INSERT INTO BookInstance (book_id, imprint, status, due_back) VALUES (?, ?, ?, ?)', book_instances)

    conn.commit()
    conn.close()

if __name__ == '__main__':
    create_database()

