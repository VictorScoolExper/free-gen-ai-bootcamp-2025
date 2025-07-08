# Backend Sever Technical Specs

## Business Goal:
A company wants to create an AI Influencer chatbot prototype:
- The system will be operated by an AI manager who will copy and paste chats from social media platforms into the system.
- The system will generate relevant, human-like responses to these chats using advanced AI language models.
- The AI will have access to a diary containing the history and context of the AI character, allowing for more personalized and context-aware responses.
- The solution aims to demonstrate how AI can manage and grow an influencer's online presence by maintaining consistent character, tone, and engagement.
- The platform will serve as a proof-of-concept for automating influencer interactions, reducing manual workload, and increasing engagement quality.
- The system is designed to be extensible for future integration with social media APIs for direct message retrieval and posting.
- The project will showcase the potential for AI-driven brand personas and digital characters in marketing and entertainment.

## Technical Requirements:
- The backend will be developed using Python and Flask.
- The database will be SQLite3.
- The API will always return JSON.
- The application will be containerized using Podman for easy deployment, scalability, and local development. Kubernetes can be used for orchestration in production environments if needed.
- The system will use environment variables for configuration and secrets management.
- The backend will implement authentication and authorization for secure access.
- The codebase will follow best practices for modularity and maintainability.
- Logging and error handling will be implemented for monitoring and debugging.
- The system will include unit and integration tests to ensure reliability.
- The API will be documented using Swagger by smartbear or similar tools.
- The backend will be designed to support future migration to more robust databases (e.g., PostgreSQL).

## Databse Schema
We have the following tables:

- **subscribers**: Stores user information such as username, name, lastname, phone number, status, country, language, notes, and subscription dates.
    - Parameters: `id_sub`, `username`, `name`, `lastname`, `phonenumber`, `is_active`, `last_activity_date`, `country`, `primary_language`, `notes`, `subscription_date`, `date_created`, `date_modified`
- **messages**: Stores all messages exchanged, including conversation ID, sender/recipient info, content, sentiment, topic, read status, and threading.
    - Parameters: `message_id`, `conversation_id`, `sender_type`, `sender_id`, `message_content`, `timestamp`, `sentiment`, `topic`, `is_read`, `response_to_message_id`, `created_at`
- **diaries**: Stores diary entries with title, date, story content, summary, location, themes, keywords, AI mood, model used, visibility, and timestamps.
    - Parameters: `diary_id`, `title`, `adventure_date`, `story_content`, `summary`, `location`, `themes`, `keywords`, `ai_mood_at_time`, `ai_model_used`, `is_public`, `word_count`, `created_at`, `updated_at`
- **ai_personalization_settings**: Stores user-specific AI preferences (tone, greetings, closings, keywords, persona style, etc.) linked to subscribers.
    - Parameters: `setting_id`, `subscriber_id`, `preferred_tone`, `preferred_greetings`, `preferred_closings`, `specific_keywords`, `avoid_keywords`, `ai_persona_style`, `learning_notes`, `last_updated`
- **ai_mental_state**: Tracks the AI's current mood, focus, energy, confidence, activity, recent input, processing load, error rate, notes, and timestamp.
    - Parameters: `state_id`, `timestamp`, `current_mood`, `focus_area`, `energy_level`, `confidence_level`, `current_activity`, `recent_input_summary`, `processing_load`, `error_rate`, `notes`, `created_at`

## API Endpoints

### Dashboard
- `GET /dashboard/recent-chats` — Get the 10 most recent chats from different subscribers
- `GET /dashboard/newest-subscribers` — Get the 10 newest subscribers (non-sensitive info only)
- `GET /dashboard/recent-unread-messages` — Get the 10 most recent unread messages
- `GET /dashboard/current-mood` — Get the current mood (latest entry) of the AI
- `GET /dashboard/total-subscribers` — Get the total number of subscribers
- `GET /dashboard/new-subscribers-today` — Get the number of new subscribers added in the last 24 hours
