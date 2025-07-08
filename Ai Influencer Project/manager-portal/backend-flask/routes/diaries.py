from flask import request, jsonify
from flask_cors import cross_origin

def load(app):
    @app.route('/diaries', methods=['GET'])
    @cross_origin()
    def get_diaries():
        try:
            cursor = app.db.cursor()
            cursor.execute('SELECT * FROM diaries ORDER BY adventure_date DESC, created_at DESC LIMIT 50')
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            diaries = [dict(zip(columns, row)) for row in rows]
            return jsonify(diaries)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/diaries/<int:diary_id>', methods=['GET'])
    @cross_origin()
    def get_diary(diary_id):
        try:
            cursor = app.db.cursor()
            cursor.execute('SELECT * FROM diaries WHERE diary_id = ?', (diary_id,))
            row = cursor.fetchone()
            if row:
                columns = [desc[0] for desc in cursor.description]
                return jsonify(dict(zip(columns, row)))
            else:
                return jsonify({'error': 'Diary not found'}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/diaries', methods=['POST'])
    @cross_origin()
    def add_diary():
        try:
            data = request.get_json()
            required_fields = ['title', 'story_content']
            if not all(field in data for field in required_fields):
                return jsonify({'error': 'Missing required fields'}), 400
            cursor = app.db.cursor()
            cursor.execute('''
                INSERT INTO diaries (
                    title, adventure_date, story_content, summary, location, themes, keywords, ai_mood_at_time, ai_model_used, is_public, word_count, created_at, updated_at
                ) VALUES (
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now')
                )
            ''', (
                data['title'],
                data.get('adventure_date'),
                data['story_content'],
                data.get('summary'),
                data.get('location'),
                data.get('themes'),
                data.get('keywords'),
                data.get('ai_mood_at_time'),
                data.get('ai_model_used'),
                data.get('is_public', 0),
                data.get('word_count')
            ))
            app.db.commit()
            return jsonify({'message': 'Diary entry added successfully', 'diary_id': cursor.lastrowid}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/diaries/<int:diary_id>', methods=['PUT'])
    @cross_origin()
    def update_diary(diary_id):
        try:
            data = request.get_json()
            cursor = app.db.cursor()
            cursor.execute('''
                UPDATE diaries SET
                    title = ?,
                    adventure_date = ?,
                    story_content = ?,
                    summary = ?,
                    location = ?,
                    themes = ?,
                    keywords = ?,
                    ai_mood_at_time = ?,
                    ai_model_used = ?,
                    is_public = ?,
                    word_count = ?,
                    updated_at = datetime('now')
                WHERE diary_id = ?
            ''', (
                data.get('title'),
                data.get('adventure_date'),
                data.get('story_content'),
                data.get('summary'),
                data.get('location'),
                data.get('themes'),
                data.get('keywords'),
                data.get('ai_mood_at_time'),
                data.get('ai_model_used'),
                data.get('is_public', 0),
                data.get('word_count'),
                diary_id
            ))
            app.db.commit()
            return jsonify({'message': 'Diary entry updated successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/diaries/<int:diary_id>', methods=['DELETE'])
    @cross_origin()
    def delete_diary(diary_id):
        try:
            cursor = app.db.cursor()
            cursor.execute('DELETE FROM diaries WHERE diary_id = ?', (diary_id,))
            app.db.commit()
            return jsonify({'message': 'Diary entry deleted successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/diaries/latest', methods=['GET'])
    @cross_origin()
    def get_latest_diaries():
        try:
            cursor = app.db.cursor()
            cursor.execute('SELECT * FROM diaries ORDER BY adventure_date DESC, created_at DESC LIMIT 10')
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            diaries = [dict(zip(columns, row)) for row in rows]
            return jsonify(diaries)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/diaries/search', methods=['GET'])
    @cross_origin()
    def search_diaries_by_date():
        try:
            date = request.args.get('date')
            if not date:
                return jsonify({'error': 'Missing date parameter'}), 400
            cursor = app.db.cursor()
            cursor.execute('SELECT * FROM diaries WHERE adventure_date = ? ORDER BY created_at DESC', (date,))
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            diaries = [dict(zip(columns, row)) for row in rows]
            return jsonify(diaries)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return app
