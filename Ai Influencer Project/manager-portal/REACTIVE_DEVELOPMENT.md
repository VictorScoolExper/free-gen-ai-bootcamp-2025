# Reactive Development Setup

This guide explains how to use the reactive development environment for the AI Influencer Manager Portal, which provides **hot reload** and **live code updates** for both frontend and backend.

## 🚀 Quick Start

### For Windows Users (Recommended)
```bash
# Start reactive development environment with Windows paths
./run.sh dev-win

# Or manually
docker-compose -f docker-compose.dev.windows.yml up --build
```

### For Linux/Mac Users
```bash
# Start reactive development environment
./run.sh dev

# Or manually
docker-compose -f docker-compose.dev.yml up --build
```

## 🔄 What is Reactive Development?

The reactive development setup provides:

- **Hot Reload**: Changes to your code are automatically reflected in the running application
- **Live Updates**: No need to restart containers when you modify code
- **Volume Mounts**: Your local code is mounted into the containers
- **Development Tools**: Full access to development features and debugging

## 📁 File Structure

```
manager-portal/
├── docker-compose.dev.yml              # Linux/Mac reactive setup
├── docker-compose.dev.windows.yml      # Windows reactive setup
├── docker-compose.dev.podman.yml       # Podman reactive setup
├── frontend-react/
│   ├── docker-compose.yml              # Frontend-only reactive setup
│   ├── docker-compose.podman.yml       # Frontend-only Podman setup
│   └── Dockerfile.dev                   # Development Dockerfile
└── backend-flask/
    ├── docker-compose.yml              # Backend-only reactive setup
    └── docker-compose.podman.yml       # Backend-only Podman setup
```

## 🛠️ How It Works

### Volume Mounts
The reactive setup uses Docker volume mounts to sync your local code with the containers:

**Frontend:**
```yaml
volumes:
  - ./frontend-react:/app              # Mount source code
  - /app/node_modules                   # Preserve node_modules in container
```

**Backend:**
```yaml
volumes:
  - ./backend-flask:/app               # Mount source code
```

### Hot Reload Configuration

**Frontend (React):**
- `CHOKIDAR_USEPOLLING=true`: Enables file watching on Windows
- `WATCHPACK_POLLING=true`: Enables webpack polling
- `npm start`: Runs React development server with hot reload

**Backend (Flask):**
- `FLASK_DEBUG=1`: Enables Flask debug mode
- `--reload`: Enables Flask auto-reload
- `FLASK_ENV=development`: Sets development environment

## 🎯 Development Workflow

### 1. Start the Environment
```bash
# Windows
./run.sh dev-win

# Linux/Mac
./run.sh dev

# Podman
./run.sh dev-podman
```

### 2. Make Changes
Edit any file in your local directory:
- **Frontend**: `frontend-react/src/` files
- **Backend**: `backend-flask/` files

### 3. See Changes Instantly
- **Frontend**: Changes appear in browser automatically
- **Backend**: API changes are reflected immediately

### 4. View Logs
```bash
# All services (Docker)
docker-compose -f docker-compose.dev.windows.yml logs -f

# All services (Podman)
podman-compose -f docker-compose.dev.podman.yml logs -f

# Frontend only
docker-compose -f docker-compose.dev.windows.yml logs -f frontend
# or
podman-compose -f docker-compose.dev.podman.yml logs -f frontend

# Backend only
docker-compose -f docker-compose.dev.windows.yml logs -f backend
# or
podman-compose -f docker-compose.dev.podman.yml logs -f backend
```

## 🔧 Individual Service Development

### Frontend Only
```bash
# Docker
cd frontend-react
docker-compose up --build

# Podman
cd frontend-react
podman-compose -f docker-compose.podman.yml up --build
```

### Backend Only
```bash
# Docker
cd backend-flask
docker-compose up --build

# Podman
cd backend-flask
podman-compose -f docker-compose.podman.yml up --build
```

## 📊 Monitoring and Debugging

### Container Status
```bash
# Check running containers
docker ps

# Check container resources
docker stats
```

### Accessing Containers
```bash
# Access frontend container
docker exec -it ai-influencer-frontend-dev sh

# Access backend container
docker exec -it ai-influencer-backend-dev bash
```

### Debugging Commands
```bash
# View frontend logs
docker logs ai-influencer-frontend-dev

# View backend logs
docker logs ai-influencer-backend-dev

# Follow logs in real-time
docker logs -f ai-influencer-frontend-dev
```

## 🐛 Troubleshooting

### Hot Reload Not Working

**Frontend Issues:**
```bash
# Check if file watching is enabled
docker exec -it ai-influencer-frontend-dev sh
# Inside container: ls -la /app/src
```

**Backend Issues:**
```bash
# Check Flask debug mode
docker exec -it ai-influencer-backend-dev bash
# Inside container: echo $FLASK_DEBUG
```

### Volume Mount Issues

**Windows Path Problems:**
- Use `docker-compose.dev.windows.yml` instead of `docker-compose.dev.yml`
- Ensure Docker Desktop has file sharing enabled for your project directory

**Permission Issues:**
```bash
# Fix file permissions
chmod -R 755 frontend-react/
chmod -R 755 backend-flask/
```

### Port Conflicts
```bash
# Check what's using the ports
lsof -i :3000
lsof -i :5000

# Stop conflicting services
docker-compose down
```

## 🔄 Environment Variables

### Frontend Environment
```bash
REACT_APP_API_URL=http://localhost:5000
CHOKIDAR_USEPOLLING=true
WATCHPACK_POLLING=true
```

### Backend Environment
```bash
FLASK_APP=app.py
FLASK_ENV=development
FLASK_DEBUG=1
```

## 📝 Development Tips

### 1. Use the Run Script
The `run.sh` script provides convenient commands:
```bash
./run.sh dev-win    # Start development
./run.sh stop       # Stop all containers
./run.sh logs       # View logs
./run.sh clean      # Clean everything
```

### 2. Monitor File Changes
```bash
# Watch for file changes in real-time
docker-compose -f docker-compose.dev.windows.yml logs -f
```

### 3. Quick Restarts
```bash
# Restart specific service
docker-compose -f docker-compose.dev.windows.yml restart frontend
docker-compose -f docker-compose.dev.windows.yml restart backend
```

### 4. Database Changes
```bash
# Initialize database
docker-compose -f docker-compose.dev.windows.yml run --rm backend python migrate.py
```

## 🚀 Performance Optimization

### For Better Performance:
1. **Use Windows Paths**: Use `docker-compose.dev.windows.yml` on Windows
2. **Exclude node_modules**: The volume mount preserves container's node_modules
3. **Monitor Resources**: Use `docker stats` to monitor container performance

### File Watching Optimization:
- Frontend uses polling for better Windows compatibility
- Backend uses Flask's built-in reload mechanism
- Both services restart automatically on code changes

## 🐳 Podman Setup

### Installing Podman Compose

**On Linux:**
```bash
# Install Podman
sudo dnf install podman podman-compose  # Fedora/RHEL
sudo apt install podman podman-compose  # Ubuntu/Debian

# Or install podman-compose via pip
pip install podman-compose
```

**On macOS:**
```bash
# Install via Homebrew
brew install podman podman-compose

# Or install podman-compose via pip
pip install podman-compose
```

**On Windows:**
```bash
# Install via Chocolatey
choco install podman-desktop

# Or install podman-compose via pip
pip install podman-compose
```

### Podman vs Docker Differences

**Key Differences:**
- **Rootless**: Podman runs containers without root privileges
- **Volume Mounts**: Uses `:Z` suffix for SELinux compatibility
- **Networking**: Slightly different network handling
- **Compatibility**: Fully compatible with Docker Compose files

**Volume Mount Syntax:**
```yaml
# Docker
volumes:
  - ./app:/app

# Podman (with SELinux support)
volumes:
  - ./app:/app:Z
```

### Podman-Specific Commands

```bash
# Start with Podman
podman-compose -f docker-compose.dev.podman.yml up --build

# View Podman containers
podman ps

# View Podman logs
podman logs <container_name>

# Access Podman container
podman exec -it <container_name> bash

# Clean Podman resources
podman system prune -f
```

## 🔒 Security Notes

**Development Only:**
- This setup is for development only
- Source code is mounted into containers
- Debug mode is enabled
- Do not use in production

**Production:**
- Use `docker-compose.prod.yml` for production
- No volume mounts for security
- Debug mode disabled
- Optimized builds

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [React Development Server](https://create-react-app.dev/docs/available-scripts)
- [Flask Development Server](https://flask.palletsprojects.com/en/2.3.x/quickstart/)
- [Docker Volume Mounts](https://docs.docker.com/storage/volumes/)

## 🆘 Getting Help

If you encounter issues:

1. **Check Logs**: Use `./run.sh logs` or `docker-compose logs`
2. **Restart Services**: Use `./run.sh stop` then `./run.sh dev-win`
3. **Clean Environment**: Use `./run.sh clean` to start fresh
4. **Check Documentation**: Refer to `DOCKER_README.md` for general Docker setup 