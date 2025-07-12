# AI Influencer Backend Admin (Python/Flask)

Backend that will manage a ai influencer chatbot. Created with Python with the Flask Framework.

## Setup
### To initialize Databse run:
podman compose run init-db

### Then start your app as usual:
podman compose up

### Solution for DB creation
When first creating the app, uncomment the "init-db" in docker-compose.yml file. Once your DB has been created comment "init-db" then run "podman compose up"

### Running API Test endpoints
A tests/ folder and a sample test_api.py file have been created. To use pytest, simply run pytest in your project root (where requirements.txt is). Pytest will automatically discover and run all test files and functions that start with test_.