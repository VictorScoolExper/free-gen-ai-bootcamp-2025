from flask import Flask, g
from flask_cors import CORS

from backend_lib.db import Db
from routes import dashboard, subscribers, diaries, messages, mental_state


def create_app(test_config=None):
    app = Flask(__name__)

    if test_config is None:
        app.config.from_mapping(
            DATABASE='ai_influencer.db'
        )
    else:
        app.config.update(test_config)

    # Initialize database connection
    app.db = Db(database=app.config['DATABASE'])

    # Enable CORS for localhost only with specific methods and headers
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:8080", "http://127.0.0.1:8080"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    
    # Register teardown for closing DB connection
    @app.teardown_appcontext
    def close_db(exception):
        app.db.close()

    # Register all routes
    dashboard.load(app)
    subscribers.load(app)
    diaries.load(app)
    messages.load(app)
    mental_state.load(app)

    return app


app = create_app()

if __name__ == '__main__':
    app.run( 
        debug=True,
        use_reloader=True,
        reloader_interval= 1
    )