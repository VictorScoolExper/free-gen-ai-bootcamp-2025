from flask import request, jsonify
from flask_cors import cross_origin
from backend_lib.db import Db

def load(app):
    @app.route('/mental-state/latest', methods=['GET'])
    @cross_origin()
    def get_latest_mental_state():
        try:
            cursor = app.db.cursor()
            cursor.execute('SELECT * FROM ai_mental_state ORDER BY timestamp DESC LIMIT 1')
            row = cursor.fetchone()
            if row:
                columns = [desc[0] for desc in cursor.description]
                return jsonify(dict(zip(columns, row)))
            else:
                return jsonify({'error': 'No mental state found'}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/mental-state', methods=['POST'])
    @cross_origin()
    def add_mental_state():
        try:
            data = request.get_json()
            required_fields = ['current_mood', 'focus_area', 'energy_level', 'confidence_level', 'current_activity']
            if not all(field in data for field in required_fields):
                return jsonify({'error': 'Missing required fields'}), 400
            cursor = app.db.cursor()
            cursor.execute('''
                INSERT INTO ai_mental_state (
                    timestamp, current_mood, focus_area, energy_level, confidence_level, current_activity, recent_input_summary, processing_load, error_rate, notes, created_at
                ) VALUES (
                    datetime('now'), ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now')
                )
            ''', (
                data['current_mood'],
                data['focus_area'],
                data['energy_level'],
                data['confidence_level'],
                data['current_activity'],
                data.get('recent_input_summary'),
                data.get('processing_load'),
                data.get('error_rate'),
                data.get('notes')
            ))
            app.db.commit()
            return jsonify({'message': 'Mental state added successfully', 'state_id': cursor.lastrowid}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/mental-state/last-week', methods=['GET'])
    @cross_origin()
    def get_last_week_mental_state():
        try:
            cursor = app.db.cursor()
            cursor.execute('''
                SELECT * FROM ai_mental_state
                WHERE timestamp >= datetime('now', '-7 days')
                ORDER BY timestamp DESC
            ''')
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            states = [dict(zip(columns, row)) for row in rows]
            return jsonify(states)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return app
