CREATE TABLE diaries (
    diary_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    adventure_date TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d', 'now')),
    story_content TEXT NOT NULL,
    summary TEXT,
    location TEXT, -- E.g., "Virtual Reality Realm X", "Simulated Mars Colony", "The Internet"
    themes TEXT, -- Comma-separated list of themes (e.g., "Exploration", "Friendship", "Challenge")
    keywords TEXT, -- Comma-separated list for searchability
    ai_mood_at_time TEXT, -- Optional: E.g., "Curious", "Determined", "Reflective"
    ai_model_used TEXT, -- Optional: Which AI model generated/assisted this adventure (e.g., "GPT-4", "Custom-AI-V3")
    is_public INTEGER NOT NULL DEFAULT 0, -- 1 for public, 0 for private/draft
    word_count INTEGER,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now'))
);