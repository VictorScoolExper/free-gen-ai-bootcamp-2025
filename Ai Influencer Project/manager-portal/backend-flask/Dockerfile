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

# For production or Kubernetes, uncomment the next line to copy all app code into the image:
# COPY . .

# (Optional) List files to verify presence of tasks.py during build:
# RUN ls -l /app

# (Optional) Set up Database at build time (not recommended with bind mounts):
# RUN invoke init-db

# Expose the port your Flask app will run on
#EXPOSE 8080
EXPOSE 5000

# Set environment variable for Flask (for development)
ENV FLASK_APP=app.py
ENV FLASK_ENV=development

# For production, you might want to use:
# ENV FLASK_ENV=production

# Command to run the Flask application with built-in auto-reload (for dev)
#CMD ["flask", "run", "--host=0.0.0.0", "--port=8080"]
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]