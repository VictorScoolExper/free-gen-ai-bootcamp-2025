# Dockerfile
# Use a lightweight Python base image
FROM python:3.9-slim

# Set environment variables for Python

# Set the working directory in the container
WORKDIR /app

# Copy only the requirements file first to leverage build cache
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code (commented out for bind mount dev)
# COPY . .

# List files to verify presence of tasks.py (optional for dev)
# RUN ls -l /app

# Set up Database (optional for dev)
# RUN invoke init-db

# Expose the port your Flask app will run on
EXPOSE 8080

# Set environment variable for Flask (for development)
ENV FLASK_APP=app.py
ENV FLASK_ENV=development

# Command to run the Flask application with built-in auto-reload
CMD ["flask", "run", "--host=0.0.0.0", "--port=8080"]

## Eliminate py-mon dependency 