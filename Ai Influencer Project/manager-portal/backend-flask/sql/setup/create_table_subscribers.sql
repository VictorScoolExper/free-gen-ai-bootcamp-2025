CREATE TABLE IF NOT EXISTS subscribers (
    id_sub INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    lastname TEXT NOT NULL,
    phonenumber INTEGER UNIQUE NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    last_activity_date TEXT,
    country TEXT,
    primary_language TEXT,
    notes TEXT,
    -- Dates are in ISO 8601 strings ('YYYY-MM-DD HH:MM:SS')
    subscription_date TEXT NOT NULL,
    date_created TEXT NOT NULL,
    date_modified TEXT NOT NULL
)