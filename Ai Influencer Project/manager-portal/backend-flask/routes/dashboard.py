from flask import jsonify
from flask_cors import cross_origin
from datetime import datetime, timedelta

def load(app):
    @app.route('/dashboard/recent-chats', methods=['GET'])
    @cross_origin()
    def get_recent_chats():
        try:
            cursor = app.db.cursor()
            cursor.execute('''
                SELECT m.*
                FROM messages m
                INNER JOIN (
                    SELECT sender_id, MAX(timestamp) AS max_time
                    FROM messages
                    WHERE sender_type = 'Subscriber'
                    GROUP BY sender_id
                ) latest ON m.sender_id = latest.sender_id AND m.timestamp = latest.max_time
                WHERE m.sender_type = 'Subscriber'
                ORDER BY m.timestamp DESC
                LIMIT 10
            ''')
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            chats = [dict(zip(columns, row)) for row in rows]
            return jsonify(chats)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/dashboard/newest-subscribers', methods=['GET'])
    @cross_origin()
    def get_newest_subscribers():
        try:
            cursor = app.db.cursor()
            cursor.execute('''
                SELECT id_sub, username, name, lastname, country, primary_language, subscription_date, date_created
                FROM subscribers
                ORDER BY date_created DESC
                LIMIT 10
            ''')
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            subscribers = [dict(zip(columns, row)) for row in rows]
            return jsonify(subscribers)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/dashboard/recent-unread-messages', methods=['GET'])
    @cross_origin()
    def get_recent_unread_messages():
        try:
            cursor = app.db.cursor()
            cursor.execute('''
                SELECT * FROM messages
                WHERE is_read = 0
                ORDER BY timestamp DESC
                LIMIT 10
            ''')
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            messages = [dict(zip(columns, row)) for row in rows]
            return jsonify(messages)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/dashboard/current-mood', methods=['GET'])
    @cross_origin()
    def get_current_mood():
        try:
            cursor = app.db.cursor()
            cursor.execute('''
                SELECT current_mood, timestamp
                FROM ai_mental_state
                ORDER BY timestamp DESC
                LIMIT 1
            ''')
            row = cursor.fetchone()
            if row:
                columns = [desc[0] for desc in cursor.description]
                return jsonify(dict(zip(columns, row)))
            else:
                return jsonify({'error': 'No mood data found'}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/dashboard/total-subscribers', methods=['GET'])
    @cross_origin()
    def get_total_subscribers():
        try:
            cursor = app.db.cursor()
            cursor.execute('SELECT COUNT(*) as total FROM subscribers')
            row = cursor.fetchone()
            return jsonify({'total_subscribers': row[0]})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/dashboard/new-subscribers-today', methods=['GET'])
    @cross_origin()
    def get_new_subscribers_today():
        try:
            cursor = app.db.cursor()
            cursor.execute('''
                SELECT COUNT(*) as new_subscribers
                FROM subscribers
                WHERE date_created >= datetime('now', '-1 day')
            ''')
            row = cursor.fetchone()
            return jsonify({'new_subscribers_last_24hrs': row[0]})
        except Exception as e:
            return jsonify({'error': str(e)}), 500