from flask import request, jsonify
from flask_cors import cross_origin
from backend_lib.db import Db

def load(app):
    @app.route('/messages', methods=['GET'])
    @cross_origin()
    def get_messages():
        try:
            conversation_id = request.args.get('conversation_id')
            cursor = app.db.cursor()
            if conversation_id:
                cursor.execute('SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp DESC LIMIT 50', (conversation_id,))
            else:
                cursor.execute('SELECT * FROM messages ORDER BY timestamp DESC LIMIT 50')
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            messages = [dict(zip(columns, row)) for row in rows]
            return jsonify(messages)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/messages', methods=['POST'])
    @cross_origin()
    def send_message():
        try:
            data = request.get_json()
            required_fields = ['conversation_id', 'sender_type', 'sender_id', 'message_content']
            if not all(field in data for field in required_fields):
                return jsonify({'error': 'Missing required fields'}), 400
            cursor = app.db.cursor()
            cursor.execute('''
                INSERT INTO messages (conversation_id, sender_type, sender_id, message_content, timestamp, sentiment, topic, is_read, response_to_message_id, created_at)
                VALUES (?, ?, ?, ?, datetime('now'), ?, ?, ?, ?, datetime('now'))
            ''', (
                data['conversation_id'],
                data['sender_type'],
                data['sender_id'],
                data['message_content'],
                data.get('sentiment'),
                data.get('topic'),
                data.get('is_read', 0),
                data.get('response_to_message_id')
            ))
            app.db.commit()
            return jsonify({'message': 'Message added successfully', 'message_id': cursor.lastrowid}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/messages/by-subscriber/<int:subscriber_id>', methods=['GET'])
    @cross_origin()
    def get_messages_by_subscriber(subscriber_id):
        try:
            cursor = app.db.cursor()
            cursor.execute('''
                SELECT * FROM messages
                WHERE sender_id = ? OR response_to_message_id = ?
                ORDER BY timestamp DESC
                LIMIT 50
            ''', (subscriber_id, subscriber_id))
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            messages = [dict(zip(columns, row)) for row in rows]
            return jsonify(messages)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/messages/<int:message_id>', methods=['PUT'])
    @cross_origin()
    def edit_message(message_id):
        try:
            data = request.get_json()
            fields = []
            values = []
            allowed_fields = ['message_content', 'sentiment', 'topic', 'is_read', 'response_to_message_id']
            for field in allowed_fields:
                if field in data:
                    fields.append(f"{field} = ?")
                    values.append(data[field])
            if not fields:
                return jsonify({'error': 'No valid fields to update'}), 400
            values.append(message_id)
            cursor = app.db.cursor()
            cursor.execute(f'''
                UPDATE messages SET {', '.join(fields)}, timestamp = datetime('now')
                WHERE message_id = ?
            ''', tuple(values))
            app.db.commit()
            if cursor.rowcount == 0:
                return jsonify({'error': 'Message not found'}), 404
            return jsonify({'message': 'Message updated successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/messages/<int:message_id>', methods=['DELETE'])
    @cross_origin()
    def delete_message(message_id):
        try:
            cursor = app.db.cursor()
            cursor.execute('DELETE FROM messages WHERE message_id = ?', (message_id,))
            app.db.commit()
            if cursor.rowcount == 0:
                return jsonify({'error': 'Message not found'}), 404
            return jsonify({'message': 'Message deleted successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return app
