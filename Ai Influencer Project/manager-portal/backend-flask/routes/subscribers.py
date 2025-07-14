from flask import request, jsonify
from flask_cors import cross_origin
from backend_lib.db import Db

def load(app):
    @app.route('/subscribers', methods=['GET'])
    @cross_origin()
    def get_subscribers():
        try:
            cursor = app.db.cursor()
            cursor.execute('SELECT * FROM subscribers ORDER BY date_created DESC LIMIT 15')
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            subscribers = [dict(zip(columns, row)) for row in rows]
            return jsonify(subscribers)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/subscribers/<int:subscriber_id>', methods=['GET'])
    @cross_origin()
    def get_subscriber(subscriber_id):
        try:
            cursor = app.db.cursor()
            cursor.execute('SELECT * FROM subscribers WHERE id_sub = ?', (subscriber_id,))
            row = cursor.fetchone()
            if row:
                columns = [desc[0] for desc in cursor.description]
                return jsonify(dict(zip(columns, row)))
            else:
                return jsonify({'error': 'Subscriber not found'}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # @app.route('/subscribers/recent-activity', methods=['GET'])
    # @cross_origin()
    # def get_subscribers_recent_activity():
        try:
            cursor = app.db.cursor()
            cursor.execute('''
                SELECT s.*
                FROM subscribers s
                JOIN messages m ON s.id_sub = m.sender_id OR s.id_sub = m.recipient_id
                WHERE m.sender_type = 'Subscriber'
                GROUP BY s.id_sub
                ORDER BY MAX(m.timestamp) DESC
                LIMIT 15
            ''')
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            subscribers = [dict(zip(columns, row)) for row in rows]
            if not subscribers:
                return jsonify({'message': 'No messages'}), 200
            return jsonify(subscribers)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/subscribers', methods=['POST'])
    @cross_origin()
    def add_subscriber():
        try:
            data = request.get_json()
            required_fields = ['username', 'name', 'lastname', 'phonenumber', 'country', 'primary_language']
            if not all(field in data for field in required_fields):
                return jsonify({'error': 'Missing required fields'}), 400

            cursor = app.db.cursor()
            cursor.execute('''
                INSERT INTO subscribers (username, name, lastname, phonenumber, is_active, country, primary_language, notes, subscription_date, date_created, date_modified)
                VALUES (?, ?, ?, ?, 1, ?, ?, ?, datetime('now'), datetime('now'), datetime('now'))
            ''', (
                data['username'],
                data['name'],
                data['lastname'],
                data['phonenumber'],
                data['country'],
                data['primary_language'],
                data.get('notes', '')
            ))
            app.db.commit()
            return jsonify({'message': 'Subscriber added successfully', 'subscriber_id': cursor.lastrowid}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/subscribers/<int:subscriber_id>', methods=['DELETE'])
    @cross_origin()
    def delete_subscriber(subscriber_id):
        """
        Delete a subscriber by ID. For testing purposes only.
        """
        try:
            cursor = app.db.cursor()
            cursor.execute('DELETE FROM subscribers WHERE id_sub = ?', (subscriber_id,))
            app.db.commit()
            if cursor.rowcount:
                return jsonify({'message': f'Subscriber {subscriber_id} deleted successfully'}), 200
            else:
                return jsonify({'error': 'Subscriber not found'}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # Additional CRUD endpoints can be added here

    return app
