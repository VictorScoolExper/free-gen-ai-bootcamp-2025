## Frontend Technical Specs

## Pages

### Dashboard (`/dashboard`)

**Purpose**
Provides a quick overview of key metrics and recent activity in the system for managers or admins.

**Components**
- **Unread Messages Card:**
    - Shows the number of unread messages with a bold number, label, icon, and a "View Messages" button/link.
    - Uses a standout background color, padding, rounded corners, and subtle shadow.
    - On hover, card/button has a visual effect.
- **Recently Added Subscribers Card:**
    - Shows the number of new subscribers in the last 24 hours, with a bold number, label, icon, and a "View Subscribers" button/link.
    - Uses a standout background color, padding, rounded corners, and subtle shadow.
    - On hover, card/button has a visual effect.
- **Current AI Mood Card:**
    - Displays the latest AI mood as a large word, label, icon, and timestamp.
    - Uses a calming/neutral background, padding, rounded corners, and subtle shadow.
- **Total Subscribers Card:**
    - Shows the total number of subscribers, label, and icon.
    - Uses a standout background color, padding, rounded corners, and subtle shadow.
- **Recent Chats Table/List:**
    - Shows the 10 most recent chats from different subscribers: name/username, message preview, timestamp, and optional view link/button.
    - If there are more than 10 chats, implement pagination or infinite scroll to allow users to view additional chats.
- **Newest Subscribers Table/List:**
    - Shows the 10 newest subscribers: username, name, country, language, subscription date, and optional view link/button.
    - If there are more than 10 subscribers, implement pagination or infinite scroll to allow users to view additional subscribers.
- **Error and Loading States:**
    - Show loading indicators while fetching data.
    - Show error messages if API calls fail.
- **Responsiveness & Accessibility:**
    - Ensure layout works on all screen sizes.
    - Use accessible color contrasts and semantic HTML for all cards, tables, and buttons.

**API Endpoints to Use:**
- `GET /dashboard/recent-chats` — 10 most recent chats from different subscribers
- `GET /dashboard/newest-subscribers` — 10 newest subscribers (non-sensitive info only)
- `GET /dashboard/current-mood` — Current mood (latest entry) of the AI
- `GET /dashboard/recent-unread-messages` — 10 most recent unread messages
- `GET /dashboard/total-subscribers` — Total number of subscribers
- `GET /dashboard/new-subscribers-today` — Number of new subscribers in last 24 hours

### Messages (`/messages`)

**Purpose**
Provides a messaging interface for managers/admins to view, search, and respond to conversations with subscribers, similar to popular messaging apps.

**Components**
- **Sidebar (Left Panel):**
    - Vertical list of users (subscribers) with recent message activity, sorted by most recent.
    - Each item: name/username, avatar/icon (optional), message preview, timestamp, unread indicator.
    - Search input at top to filter users by name/username.
    - Fixed width, scrollable if long.
    - Clicking a user loads their conversation in the right panel.
- **Conversation Panel (Right Panel):**
    - Shows full conversation with selected user, messages in chronological order.
    - Each message: sender ("You" or "AI"), content, timestamp, optional status indicator.
    - Input box at bottom for composing/sending new messages.
    - Sent messages appear immediately; panel scrolls to latest message.
- **Responsiveness:**
    - On small screens, sidebar and conversation panel stack vertically or toggle.
- **Styling:**
    - Clear separation between sidebar and conversation panel (border/background).
    - Padding, rounded corners, subtle shadows for modern look.
    - Accent colors for active users, unread badges, send buttons.
- **Error and Loading States:**
    - Show loading indicators while fetching messages/users.
    - Show error messages if API calls fail.
- **API Endpoints to Use:**
    - `GET /messages?conversation_id={id}` — Get messages for a specific conversation
    - `POST /messages` — Send a new message
    - `GET /messages/by-subscriber/<subscriber_id>` — Get messages by subscriber (last 50)
    - `PUT /messages/<message_id>` — Edit a message
    - `DELETE /messages/<message_id>` — Delete a message
    - `GET /dashboard/recent-unread-messages` — 10 most recent unread messages (for badges/indicators)

### Mental State (`/mental-state`)

This page provides a summary and history of the AI's mental state, visualized in a clear and engaging way for managers or admins.

- **Current Mental State Card:**
    - Prominently display the latest AI mental state (from `GET /mental-state/latest`).
    - Show the following fields:
        - **Mood** (e.g., "Curious", "Focused") as a large, bold word with a mood icon.
        - **Focus Area** (e.g., "User Engagement")
        - **Energy Level** (numeric or descriptive, e.g., 7/10 or "High")
        - **Confidence Level** (numeric or descriptive, e.g., 80% or "Moderate")
        - **Current Activity** (e.g., "Analyzing messages")
        - **Timestamp** of the latest entry (smaller text)
        - Optionally, show: recent input summary, processing load, error rate, notes (if available)
    - Use a visually distinct card with a calming or neutral background color, padding, rounded corners, and a subtle shadow.
    - Use icons or color accents to represent mood, energy, and confidence visually.
    - If no data is available, show a friendly empty state message.

- **Mental State History Table/Chart:**
    - Display a table or chart of the AI's mental state over the last 7 days (from `GET /mental-state/last-week`).
    - Each row/point should show: timestamp, mood, energy level, confidence level, and optionally focus area or activity.
    - For charts, use a line or bar chart to visualize trends in energy/confidence over time.
    - Allow toggling between table and chart view if possible.
    - Provide tooltips or details on hover for each entry.

- **Add/Edit Mental State (Admin Only):**
    - If the user is an admin, provide a form to add a new mental state entry (fields: mood, focus area, energy level, confidence level, current activity, notes, etc.).
    - Use `POST /mental-state` to submit new entries.
    - Show success/error messages after submission.

- **Error and Loading States:**
    - Show loading indicators while fetching or submitting data.
    - Show error messages if API calls fail.

- **Responsiveness & Accessibility:**
    - Ensure the layout works well on all screen sizes.
    - Use accessible color contrasts and semantic HTML for all cards, tables, and forms.

- **API Endpoints to Use:**
    - `GET /mental-state/latest` — Get the latest AI mental state
    - `GET /mental-state/last-week` — Get the AI mental state entries from the last 7 days
    - `POST /mental-state` — Add a new AI mental state entry (admin only)

### Subscribers (`/subscribers`)

**Purpose**
This page allows managers or admins to view, search, and manage subscribers. The design and functionality should be consistent with the Dashboard and Messages sections for a seamless user experience.

**Components**
- **Subscribers List/Table:**
    - Display a table or list of subscribers (from `GET /subscribers`), sorted by most recent.
    - Each row should show:
        - Username
        - Name and Lastname
        - Country
        - Primary Language
        - Phone Number (if available)
        - Subscription Date
        - Status (active/inactive)
        - Optionally, a button/link to view details or edit
    - Use alternating row colors or subtle dividers for readability.
    - Add a search input to filter subscribers by username, name, or country.
    - Allow sorting by columns (e.g., by date, name).
    - Paginate or lazy-load if the list is long.

- **Subscriber Details Panel/Modal:**
    - When a subscriber is selected, show a detailed view (panel or modal) with all available info (from `GET /subscribers/<subscriber_id>`):
        - All fields above, plus notes, activity, and timestamps (created/modified)
        - Optionally, show recent activity (messages, diary entries, etc.)
    - Provide an edit button (admin only) to update subscriber info.

- **Recent Activity:**
    - Show a list of subscribers with recent activity (from `GET /subscribers/recent-activity`).
    - Each entry should display the subscriber's name, username, and last activity timestamp.
    - Optionally, highlight active users or those with unread messages.

- **Add Subscriber (Admin Only):**
    - Provide a form to add a new subscriber (fields: username, name, lastname, phone number, country, primary language, notes).
    - Use `POST /subscribers` to submit new subscribers.
    - Show success/error messages after submission.

- **Error and Loading States:**
    - Show loading indicators while fetching or submitting data.
    - Show error messages if API calls fail.

- **Responsiveness & Accessibility:**
    - Ensure the layout works well on all screen sizes.
    - Use accessible color contrasts and semantic HTML for all tables, forms, and modals.

**API Endpoints to Use:**
- `GET /subscribers` — Get a list of subscribers (latest 15)
- `GET /subscribers/<subscriber_id>` — Get details for a specific subscriber
- `GET /subscribers/recent-activity` — Get subscribers with recent activity
- `POST /subscribers` — Add a new subscriber (admin only)

### Diaries (`/diaries`)

**Purpose**
Allows managers or admins to view, search, add, edit, and manage AI diary entries (stories/adventures). Diaries provide narrative context, insights, and history for the AI's activities and experiences.

**Components**
- **Diaries List/Table:**
    - Display a table or list of diary entries (from `GET /diaries`), sorted by adventure date and creation date (most recent first).
    - Each row should show:
        - Title
        - Adventure Date
        - Summary (or first 30-50 characters of story)
        - Location (if available)
        - Themes/Keywords (if available)
        - AI Mood at Time (if available)
        - Is Public (yes/no)
        - Word Count
        - Optionally, a button/link to view, edit, or delete
    - Use alternating row colors or subtle dividers for readability.
    - Add a search input to filter by title, date, or keyword.
    - Allow sorting by columns (e.g., by date, title).
    - Paginate or lazy-load if the list is long.

- **Diary Details Panel/Modal:**
    - When a diary is selected, show a detailed view (panel or modal) with all available info (from `GET /diaries/<diary_id>`):
        - All fields above, plus full story content, summary, timestamps (created/updated), AI model used, notes, etc.
    - Provide edit and delete buttons (admin only).

- **Add/Edit Diary (Admin Only):**
    - Provide a form to add or edit a diary entry (fields: title, adventure date, story content, summary, location, themes, keywords, AI mood at time, AI model used, is public, word count, notes).
    - Use `POST /diaries` to add and `PUT /diaries/<diary_id>` to update.
    - Show success/error messages after submission.

- **Delete Diary (Admin Only):**
    - Allow deletion of a diary entry (with confirmation) using `DELETE /diaries/<diary_id>`.

- **Latest Diaries:**
    - Show a list of the 10 latest diary entries (from `GET /diaries/latest`).

- **Search Diaries by Date:**
    - Provide a date picker or input to search for diaries by adventure date (from `GET /diaries/search?date=YYYY-MM-DD`).

- **Error and Loading States:**
    - Show loading indicators while fetching or submitting data.
    - Show error messages if API calls fail.

- **Responsiveness & Accessibility:**
    - Ensure the layout works well on all screen sizes.
    - Use accessible color contrasts and semantic HTML for all tables, forms, and modals.

**API Endpoints to Use:**
- `GET /diaries` — Get a list of diary entries (latest 50)
- `GET /diaries/<diary_id>` — Get details for a specific diary entry
- `POST /diaries` — Add a new diary entry (admin only)
- `PUT /diaries/<diary_id>` — Edit a diary entry (admin only)
- `DELETE /diaries/<diary_id>` — Delete a diary entry (admin only)
- `GET /diaries/latest` — Get the 10 latest diary entries
- `GET /diaries/search?date=YYYY-MM-DD` — Search diaries by adventure date