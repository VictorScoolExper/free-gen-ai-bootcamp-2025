-- Table: messages
-- This table stores all messages exchanged in the system, including sender, recipient, content, and metadata.

CREATE TABLE messages (
    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id TEXT NOT NULL, -- Grouping messages into conversations
    sender_type TEXT NOT NULL, -- 'AI' or 'Subscriber'
    sender_id INTEGER NOT NULL, -- subscriber_id if sender_type = 'Subscriber', or a designated AI_ID
    message_content TEXT NOT NULL,
    timestamp TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now')),
    sentiment TEXT, -- Optional: E.g., 'Positive', 'Neutral', 'Negative'
    topic TEXT, -- Optional: E.g., 'Support', 'Feedback', 'General Chat', etc.
    is_read INTEGER NOT NULL DEFAULT 0, -- 0 for unread, 1 for read
    response_to_message_id INTEGER, -- NULL if new conversation start, otherwise ID of message being replied to
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now'))
);
