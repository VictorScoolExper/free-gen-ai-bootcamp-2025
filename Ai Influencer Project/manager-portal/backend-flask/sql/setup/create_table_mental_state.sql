CREATE TABLE ai_mental_state (
    state_id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now')),
    current_mood TEXT, -- E.g., "Curious", "Pensive", "Excited", "Calm", "Analytical"
    focus_area TEXT, -- E.g., "Content Generation", "Audience Interaction", "Learning", "Resting"
    energy_level REAL, -- Numeric value, e.g., 0.0 to 1.0 or 0 to 100
    confidence_level REAL, -- Numeric value, e.g., 0.0 to 1.0 or 0 to 100
    current_activity TEXT, -- E.g., "Writing blog post on AI ethics", "Responding to fan mail", "Analyzing market trends"
    recent_input_summary TEXT, -- A brief summary of recent major inputs that might influence its state
    processing_load REAL, -- Optional: CPU/GPU usage, memory, as a percentage or scale
    error_rate REAL, -- Optional: Internal error rate, if applicable, 0.0 to 1.0
    notes TEXT, -- Any specific notes or events related to this state
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now'))
);
