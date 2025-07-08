CREATE TABLE ai_personalization_settings (
    setting_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscriber_id INTEGER NOT NULL UNIQUE, -- Links to the subscribers table
    preferred_tone TEXT, -- E.g., 'Friendly', 'Formal', 'Informal', 'Playful', 'Analytical'
    preferred_greetings TEXT, -- Comma-separated or JSON array: 'Hey there!', 'Greetings, [Name]!', 'What's up?'
    preferred_closings TEXT, -- Comma-separated or JSON array: 'Talk soon!', 'Best regards,', 'Stay awesome!'
    specific_keywords TEXT, -- JSON array of words/phrases to use often (e.g., ['fantastic', 'journey', 'insightful'])
    avoid_keywords TEXT, -- JSON array of words/phrases to avoid (e.g., ['mundane', 'negative', 'complex jargon'])
    ai_persona_style TEXT, -- E.g., 'Optimistic Visionary', 'Gritty Explorer', 'Wise Mentor', 'Sarcastic Companion'
    learning_notes TEXT, -- Free-form text for AI to store observations about this subscriber's style
    last_updated TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now')),
    FOREIGN KEY (subscriber_id) REFERENCES subscribers(subscriber_id)
);