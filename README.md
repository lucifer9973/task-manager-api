# Task Management API

A simple task management system with CRUD operations.

## Features
- Create, read, update, and delete tasks
- Track task status (pending/in-progress/completed)
- Simple React frontend (optional)

## Technologies
- Backend: Node.js, Express, MongoDB
- Frontend: React (optional)

## Setup

### Backend
1. Clone the repository:
```bash
git clone https://github.com/yourusername/task-manager-api.git
```
2. Navigate to the server directory and install dependencies:
```bash
cd task-manager-api/server
npm install
```
3. Create a `.env` file in the `server` directory with the following content:
```
MONGO_URI=your_mongodb_connection_string
```
4. Start the backend server:
```bash
npm start
```

### Frontend (Optional)
1. Navigate to the client directory and install dependencies:
```bash
cd ../client
npm install
```
2. Start the React frontend:
```bash
npm start
```

## API Documentation

See [API.md](API.md) for detailed API endpoint documentation.

## Testing

You can test the API endpoints using curl or PowerShell commands:

- Create a task:
```bash
curl -X POST http://localhost:5000/api/tasks -H "Content-Type: application/json" -d '{"title":"Test Task","description":"Testing API"}'
```

- Get all tasks:
```bash
curl http://localhost:5000/api/tasks
```

- Update a task:
```bash
curl -X PUT http://localhost:5000/api/tasks/{task_id} -H "Content-Type: application/json" -d '{"status":"in-progress"}'
```

- Delete a task:
```bash
curl -X DELETE http://localhost:5000/api/tasks/{task_id}
```

## Deployment Tips
- Use MongoDB Atlas for cloud database.
- Deploy backend to Render, Heroku, or similar.
- Deploy frontend to Netlify, Vercel, or similar.
- Configure environment variables in deployment settings.

## Notes
- Ensure your MongoDB IP whitelist includes your current IP.
- The backend server runs on port 5000 by default.
- The frontend React app proxies API requests to the backend.
