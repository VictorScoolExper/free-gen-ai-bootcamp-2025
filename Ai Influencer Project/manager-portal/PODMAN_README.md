# AI Influencer Manager Portal - Podman Setup

This guide provides comprehensive instructions for running the AI Influencer Manager Portal using **Podman** and **Podman Compose**.

## 🚀 Quick Start with Podman

### Prerequisites

1. **Install Podman:**
   ```bash
   # Linux (Fedora/RHEL)
   sudo dnf install podman
   
   # Linux (Ubuntu/Debian)
   sudo apt install podman
   
   # macOS
   brew install podman
   
   # Windows
   choco install podman-desktop
   ```

2. **Install Podman Compose:**
   ```bash
   pip install podman-compose
   ```

3. **Verify Installation:**
   ```bash
   podman --version
   podman-compose --version
   ```

### Start the Application

```bash
# Start reactive development environment
./run.sh dev-podman

# Or manually
podman-compose -f docker-compose.dev.podman.yml up --build
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔄 Podman vs Docker

### Key Differences

| Feature | Docker | Podman |
|---------|--------|--------|
| **Root Access** | Requires root/daemon | Rootless by default |
| **Security** | Runs as daemon | Runs as user process |
| **Volume Mounts** | `./app:/app` | `./app:/app:Z` (SELinux) |
| **Networking** | Docker network | Podman network |
| **Compatibility** | Native | Docker-compatible |

### Volume Mount Syntax

**Docker:**
```yaml
volumes:
  - ./frontend-react:/app
```

**Podman (with SELinux support):**
```yaml
volumes:
  - ./frontend-react:/app:Z
```

## 🛠️ Podman-Specific Commands

### Container Management

```bash
# List running containers
podman ps

# List all containers (including stopped)
podman ps -a

# View container logs
podman logs <container_name>

# Follow logs in real-time
podman logs -f <container_name>

# Access container shell
podman exec -it <container_name> bash

# Stop container
podman stop <container_name>

# Remove container
podman rm <container_name>
```

### Image Management

```bash
# List images
podman images

# Build image
podman build -t <image_name> .

# Remove image
podman rmi <image_name>

# Pull image
podman pull <image_name>
```

### System Management

```bash
# View system information
podman system info

# Clean unused resources
podman system prune

# Clean all resources (including images)
podman system prune -a

# View disk usage
podman system df
```

## 📁 Podman Compose Files

### Main Development Setup
- `docker-compose.dev.podman.yml` - Full stack development with Podman

### Individual Services
- `frontend-react/docker-compose.podman.yml` - Frontend only
- `backend-flask/docker-compose.podman.yml` - Backend only

### Usage Examples

```bash
# Full stack development
podman-compose -f docker-compose.dev.podman.yml up --build

# Frontend only
cd frontend-react
podman-compose -f docker-compose.podman.yml up --build

# Backend only
cd backend-flask
podman-compose -f docker-compose.podman.yml up --build
```

## 🔧 Development Workflow

### 1. Start Development Environment

```bash
# Using the run script
./run.sh dev-podman

# Or manually
podman-compose -f docker-compose.dev.podman.yml up --build -d
```

### 2. Monitor Logs

```bash
# All services
podman-compose -f docker-compose.dev.podman.yml logs -f

# Specific service
podman-compose -f docker-compose.dev.podman.yml logs -f frontend
podman-compose -f docker-compose.dev.podman.yml logs -f backend
```

### 3. Make Changes

Edit files in your local directory:
- **Frontend**: `frontend-react/src/` files
- **Backend**: `backend-flask/` files

Changes are automatically reflected due to volume mounts.

### 4. Stop Environment

```bash
# Stop all services
podman-compose -f docker-compose.dev.podman.yml down

# Or using the run script
./run.sh stop
```

## 🐛 Troubleshooting

### Common Podman Issues

#### 1. Permission Denied
```bash
# Error: permission denied while trying to connect to the Docker daemon socket

# Solution: Podman doesn't need daemon, but check user permissions
podman system connection list
```

#### 2. SELinux Issues
```bash
# Error: permission denied on volume mount

# Solution: Use :Z suffix in volume mounts
volumes:
  - ./app:/app:Z
```

#### 3. Port Already in Use
```bash
# Check what's using the port
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :5000

# Stop conflicting services
podman stop $(podman ps -q)
```

#### 4. Network Issues
```bash
# Check Podman networks
podman network ls

# Create custom network if needed
podman network create ai-influencer-network
```

### Debugging Commands

```bash
# Check container status
podman ps

# View container details
podman inspect <container_name>

# Check container logs
podman logs <container_name>

# Access container for debugging
podman exec -it <container_name> bash

# Check resource usage
podman stats
```

## 🔒 Security Features

### Rootless Containers

Podman runs containers without root privileges by default:

```bash
# Run as regular user (no sudo needed)
podman run hello-world

# Check if running rootless
podman info | grep rootless
```

### SELinux Support

Podman provides better SELinux integration:

```yaml
# Volume mounts with SELinux labels
volumes:
  - ./app:/app:Z  # Z suffix for SELinux
```

### User Namespaces

Podman uses user namespaces for better isolation:

```bash
# Check user namespace
podman run --rm alpine id
```

## 📊 Performance Optimization

### Resource Limits

```yaml
# Set resource limits in compose file
services:
  frontend:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
```

### Storage Optimization

```bash
# Use overlay storage driver
podman system connection add --identity ~/.ssh/id_rsa user@host

# Clean unused images
podman image prune -a
```

## 🔄 Migration from Docker

### Converting Docker Commands

| Docker Command | Podman Equivalent |
|----------------|-------------------|
| `docker ps` | `podman ps` |
| `docker build` | `podman build` |
| `docker run` | `podman run` |
| `docker-compose up` | `podman-compose up` |
| `docker logs` | `podman logs` |
| `docker exec` | `podman exec` |

### Environment Variables

```bash
# Set alias for Docker compatibility
alias docker=podman

# Or use environment variable
export DOCKER_HOST=unix:///tmp/podman.sock
```

## 📚 Additional Resources

- [Podman Documentation](https://docs.podman.io/)
- [Podman Compose Documentation](https://github.com/containers/podman-compose)
- [Podman vs Docker](https://podman.io/whatis.html)
- [Rootless Containers](https://docs.podman.io/en/latest/markdown/podman-run.1.html#rootless-mode)

## 🆘 Getting Help

### Podman Community

- **GitHub**: [containers/podman](https://github.com/containers/podman)
- **Discord**: [Podman Discord](https://discord.gg/containers)
- **Red Hat**: [Podman Support](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/building_running_and_managing_containers/)

### Common Issues

1. **Installation Problems**: Check your distribution's package manager
2. **Permission Issues**: Ensure user is in the correct groups
3. **Network Issues**: Check firewall and SELinux settings
4. **Volume Mounts**: Use `:Z` suffix for SELinux compatibility

### Debugging Steps

1. **Check Podman Status**: `podman system info`
2. **Verify Installation**: `podman --version`
3. **Check Permissions**: `podman unshare id`
4. **View Logs**: `podman logs <container>`
5. **Network Debug**: `podman network ls`

## 🎯 Best Practices

### Development

1. **Use Rootless Mode**: Run containers as regular user
2. **Volume Mounts**: Use `:Z` suffix for SELinux
3. **Resource Limits**: Set appropriate memory/CPU limits
4. **Clean Up**: Regularly prune unused resources

### Production

1. **Security**: Use read-only root filesystems
2. **Networking**: Use custom networks
3. **Monitoring**: Set up proper logging
4. **Updates**: Keep Podman and images updated

---

**Note**: This setup is optimized for development. For production deployment, consider using Kubernetes or OpenShift with Podman. 