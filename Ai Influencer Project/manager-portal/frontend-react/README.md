# AI Influencer Manager Portal - Frontend

A modern React application for managing AI influencer operations, built with React 18, React Router, and Axios.

## Features

### Dashboard
- Overview of key metrics (unread messages, new subscribers, AI mood, total subscribers)
- Recent chats table with subscriber information
- Newest subscribers table with detailed information
- Real-time data from backend API

### Messages
- Messaging interface similar to popular chat applications
- Sidebar with subscriber list and search functionality
- Conversation panel with message history
- Send and receive messages in real-time
- Message timestamps and status indicators

### Mental State
- Current AI mental state display with mood, energy, and confidence levels
- Mental state history table for the last 7 days
- Add new mental state entries with comprehensive form
- Visual mood indicators and progress tracking

### Subscribers
- Complete subscriber management system
- Search and filter subscribers by name, username, or country
- Add, edit, and delete subscriber information
- Detailed subscriber profiles with all information
- Modal view for subscriber details

### Diaries
- AI diary entries management
- Search diaries by title, summary, or keywords
- Date-based search functionality
- Add, edit, and delete diary entries
- Rich diary content with themes, keywords, and metadata
- Public/private entry management

## Technology Stack

- **React 18** - Modern React with hooks and functional components
- **React Router 6** - Client-side routing
- **Axios** - HTTP client for API communication
- **Lucide React** - Beautiful and consistent icons
- **Date-fns** - Date manipulation and formatting
- **CSS3** - Custom styling with responsive design

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Backend Flask API running on `http://localhost:5000`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend-react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Environment Variables

Create a `.env` file in the frontend directory if you need to customize the API URL:

```
REACT_APP_API_URL=http://localhost:5000
```

## Docker

### Prerequisites

- Docker installed on your system
- Docker Compose (usually included with Docker Desktop)

### Running with Docker

#### Development Mode (with Hot Reload)

1. Navigate to the frontend directory:
   ```bash
   cd frontend-react
   ```

2. Start the development container:
   ```bash
   docker-compose up --build
   ```

3. Open your browser and navigate to `http://localhost:3000`

The development container includes:
- Hot reload for code changes
- Volume mounting for live code updates
- Development server with debugging capabilities

#### Production Mode

1. Build the production image:
   ```bash
   docker build -t ai-influencer-frontend .
   ```

2. Run the production container:
   ```bash
   docker run -p 3000:80 ai-influencer-frontend
   ```

3. Open your browser and navigate to `http://localhost:3000`

#### Using Docker Compose for Full Stack

To run the frontend with the backend together:

1. From the project root directory:
   ```bash
   docker-compose up --build
   ```

This will start both the frontend and backend services together.

### Docker Commands

#### Build the Image
```bash
docker build -t ai-influencer-frontend .
```

#### Run Container
```bash
docker run -p 3000:80 ai-influencer-frontend
```

#### Stop Container
```bash
docker stop $(docker ps -q --filter ancestor=ai-influencer-frontend)
```

#### Remove Container and Image
```bash
docker rmi ai-influencer-frontend
```

#### View Logs
```bash
docker-compose logs -f frontend
```

### Docker Configuration Files

- `Dockerfile` - Production build configuration
- `Dockerfile.dev` - Development build configuration
- `docker-compose.yml` - Local development setup
- `.dockerignore` - Files to exclude from Docker build

### Troubleshooting

#### Port Already in Use
If port 3000 is already in use, you can change the port mapping:
```bash
docker run -p 3001:80 ai-influencer-frontend
```

#### Build Issues
If you encounter build issues, try:
```bash
docker build --no-cache -t ai-influencer-frontend .
```

#### Container Not Starting
Check the logs for errors:
```bash
docker-compose logs frontend
```

## Project Structure

```
frontend-react/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── Messages.js
│   │   ├── MentalState.js
│   │   ├── Subscribers.js
│   │   ├── Diaries.js
│   │   └── *.css
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## API Integration

The frontend communicates with the Flask backend through the API service (`src/services/api.js`). All API calls are organized by feature:

- **Dashboard API** - Metrics and overview data
- **Messages API** - Chat and messaging functionality
- **Mental State API** - AI mental state management
- **Subscribers API** - Subscriber CRUD operations
- **Diaries API** - Diary entries management

## Responsive Design

The application is fully responsive and works on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile devices (up to 767px)

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Style

- Functional components with hooks
- Consistent naming conventions
- Modular CSS files for each component
- Error handling for all API calls
- Loading states for better UX

## Contributing

1. Follow the existing code style and patterns
2. Add error handling for new features
3. Ensure responsive design for new components
4. Test on different screen sizes
5. Update documentation as needed

## License

This project is part of the AI Influencer Manager Portal. 