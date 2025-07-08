from flask import Flask, g
from flask_cors import CORS

from lib.db import Db
from routes import dashboard
from routes import subscribers
from routes import diaries  
from routes import messages    
from routes import mental_state

def get_allowed_origins(app):
    try:
        cursor = app.db.cursor()
        # Check course to what is happening here
        cursor.execute('SELECT url FROM study_activities')
        urls = cursor.fetchall()
        # Convert URLs to origins (e.g., https://example.com/app -> https://example.com)
        origins = set()
        for url in urls:
            try:
                from urllib.parse import urlparse
                parsed = urlparse(url['url'])
                origin = f"{parsed.scheme}://{parsed.netloc}"
                origins.add(origin)
            except:
                continue
        return list(origins) if origins else ["*"]
    except:
        return ["*"]  # Fallback to allow all origins if there's an error

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Initialize database connection
    app.db = Db(database=app.config['DATABASE'])

    # Get allowed origins from study_activities table
    allowed_origins = get_allowed_origins(app)

     # In development, add localhost to allowed origins
    if app.debug:
        allowed_origins.extend(["http://localhost:8080", "http://127.0.0.1:8080"])
    
    # Configure CORS with combined origins
    CORS(app, resources={
        r"/*": {
            "origins": allowed_origins,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Close database connection
    @app.teardown_appcontext
    def close_db(exception):
        app.db.close()

    # Register routes
    dashboard.load(app)
    subscribers.load(app)
    diaries.load(app)
    messages.load(app)
    mental_state.load(app)


    return app

app = create_app()
if __name__ == '__main__':
    app.run(debug=True)