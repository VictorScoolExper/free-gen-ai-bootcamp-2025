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

# Set up Database (Test 1)
RUN invoke init-db

# CMD to set up database (Test 2)
# CMD ["invoke", "init-db"]

# Copy the rest of the application code
COPY . .

# Expose the port your Flask app will run on
EXPOSE 8080

# Set environment variable for Flask (optional, for development)
# ENV FLASK_APP=app.py

# Command to run the Flask application using the built-in Flask server (for development or simple deployments)
CMD ["python", "/app.py"]