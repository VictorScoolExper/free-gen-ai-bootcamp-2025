# AI Influencer Manager Portal - Docker Setup

This document provides instructions for running the AI Influencer Manager Portal using Docker and Docker Compose.

## Prerequisites

- Docker Engine (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

### 1. Development Environment (Recommended for development)

```bash
# Start the development environment with hot reload
docker-compose -f docker-compose.dev.yml up --build

# Or run in background
docker-compose -f docker-compose.dev.yml up -d --build
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 2. Production Environment

```bash
# Start the production environment
docker-compose -f docker-compose.prod.yml up --build

# Or run in background
docker-compose -f docker-compose.prod.yml up -d --build
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- With Nginx: http://localhost:80

### 3. Default Environment (Basic setup)

```bash
# Start the default environment
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

## Docker Compose Files

### `docker-compose.yml` (Default)
- Basic setup for both frontend and backend
- Good for testing and simple deployments
- Includes database initialization service

### `docker-compose.dev.yml` (Development)
- **Hot reload enabled** for both frontend and backend
- Source code mounted as volumes for live updates
- Development-friendly configuration
- **Recommended for development**

### `docker-compose.prod.yml` (Production)
- Optimized for production deployment
- Uses Gunicorn for the backend
- Includes Nginx reverse proxy
- Minimal volume mounts for security

## Services

### Backend Service
- **Image**: Python 3.9 with Flask
- **Port**: 5000
- **Features**: 
  - RESTful API endpoints
  - SQLite database
  - CORS enabled
  - Auto-reload in development

### Frontend Service
- **Image**: Node.js 18 with React
- **Port**: 3000
- **Features**:
  - React 18 application
  - Modern UI components
  - Responsive design
  - Hot reload in development

### Nginx Service (Production only)
- **Image**: Nginx Alpine
- **Ports**: 80, 443
- **Features**:
  - Reverse proxy
  - Load balancing
  - SSL termination (when configured)

## Database Management

### Initialize Database (First time only)

```bash
# Run database initialization
docker-compose run --rm init-db

# Or with development compose
docker-compose -f docker-compose.dev.yml run --rm backend python migrate.py
```

### Database Persistence

The SQLite database file (`ai_influencer.db`) is persisted using Docker volumes:
- **Development**: Mounted from host directory
- **Production**: Stored in Docker volume `ai_influencer_data`

## Environment Variables

### Frontend Environment Variables
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000)

### Backend Environment Variables
- `FLASK_APP`: Flask application file (default: app.py)
- `FLASK_ENV`: Environment mode (development/production)
- `FLASK_DEBUG`: Debug mode (1 for development)

## Useful Commands

### Development Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down

# Rebuild and start
docker-compose -f docker-compose.dev.yml up --build

# Access backend container
docker-compose -f docker-compose.dev.yml exec backend bash

# Access frontend container
docker-compose -f docker-compose.dev.yml exec frontend sh
```

### Production Commands

```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down

# Update and restart
docker-compose -f docker-compose.prod.yml up -d --build
```

### General Commands

```bash
# View running containers
docker ps

# View container logs
docker logs <container_name>

# Execute commands in running container
docker exec -it <container_name> bash

# Clean up unused resources
docker system prune -a

# Remove all containers and volumes
docker-compose down -v
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   lsof -i :5000
   
   # Stop conflicting services or change ports in docker-compose files
   ```

2. **Database not initialized**
   ```bash
   # Run database initialization
   docker-compose run --rm init-db
   ```

3. **Frontend can't connect to backend**
   - Check if backend is running: `docker ps`
   - Verify API URL in frontend environment
   - Check backend logs: `docker logs ai-influencer-backend`

4. **Hot reload not working**
   - Ensure you're using `docker-compose.dev.yml`
   - Check volume mounts in docker-compose file
   - Verify file permissions

### Logs and Debugging

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f

# View logs with timestamps
docker-compose logs -t
```

## Production Deployment

### 1. Build and Deploy

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### 2. Environment Configuration

Create a `.env` file for production:

```env
FLASK_ENV=production
REACT_APP_API_URL=https://your-domain.com/api
```

### 3. SSL/HTTPS Setup

For production with SSL, update the nginx configuration and add SSL certificates.

### 4. Monitoring

```bash
# Monitor resource usage
docker stats

# Check service health
curl http://localhost/health
```

## Security Considerations

- **Development**: Source code is mounted for hot reload
- **Production**: Only necessary files are copied to containers
- **Database**: SQLite file is persisted in Docker volumes
- **Network**: Services communicate through internal Docker network
- **Ports**: Only necessary ports are exposed to host

## Performance Optimization

### Development
- Use `docker-compose.dev.yml` for hot reload
- Source code mounted as volumes for fast updates

### Production
- Use multi-stage builds for smaller images
- Gunicorn with multiple workers for backend
- Nginx for static file serving and load balancing
- Optimized React build for frontend

## Support

For issues related to:
- **Docker**: Check Docker documentation
- **Application**: Check the main README files in frontend and backend directories
- **API**: Check the backend technical specifications 