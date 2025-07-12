import sqlite3
import json
from flask import g

class Db:
    def __init__(self, database='ai_influencer.db'):
        self.database = database
        self.connection = None

    def get(self):
        # Checks in if there is not a db object in global
        if 'db' not in g:
            g.db = sqlite3.connect(self.database)
            g.db.row_factory = sqlite3.Row
        return g.db
    
    # Ensures the commits
    def commit(self):
        self.get().commit()

    def cursor(self):
        # Ensure the connection is valid before getting a cursor
        connection = self.get()
        return connection.cursor()
    
    def close(self):
        db = g.pop('db', None)
        if db is not None:
            db.close()
    
    # Function to load SQL from file
    def sql(self, filepath):
        with open('sql/' + filepath, 'r') as file:
            return file.read()
        
    # Function to load the words from a JSON file
    def load_json(self, filepath):
        with open(filepath, 'r') as file:
            return json.load(file)
        
    def setup_tables(self, cursor):
        # Create subscriber table
        cursor.execute(self.sql('setup/create_table_subscribers.sql'))
        self.get().commit()

        # Create diaries table
        cursor.execute(self.sql('setup/create_table_diaries.sql'))
        self.get().commit()

        # Create Mental State table
        cursor.execute(self.sql('setup/create_table_mental_state.sql'))
        self.get().commit()

        # Create Messages table
        cursor.execute(self.sql('setup/create_table_messages.sql'))
        self.get().commit()

        # Create Subscriber Vocabulary
        cursor.execute(self.sql('setup/create_table_ai_personalization_settings.sql'))
        self.get().commit()

    # Initialize the database with sample data
    def init(self, app):
        with app.app_context():
            cursor = self.cursor()
            self.setup_tables(cursor)

# Create an instance of the Db class
db = Db() 