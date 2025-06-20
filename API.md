# Task Management API Documentation

## Endpoints

### 1. Get All Tasks
- **URL**: `/api/tasks`
- **Method**: `GET`
- **Response**:
```json
[
  {
    "_id": "665f3c8b7c1bb8e5f8d3e7a0",
    "title": "Learn API Development",
    "description": "Complete the API assignment",
    "status": "pending",
    "createdAt": "2025-06-19T12:34:56.789Z"
  }
]
```

### 2. Create New Task
- **URL**: `/api/tasks`
- **Method**: `POST`
- **Body**:
```json
{
  "title": "Task title",
  "description": "Optional description"
}
```
- **Response** (201 Created):
```json
{
  "_id": "665f3d927c1bb8e5f8d3e7a1",
  "title": "Task title",
  "description": "Optional description",
  "status": "pending",
  "createdAt": "2025-06-19T12:38:42.123Z"
}
```

### 3. Update Task
- **URL**: `/api/tasks/:id`
- **Method**: `PUT`
- **Body** (any fields to update):
```json
{
  "status": "completed"
}
```
- **Response**:
```json
{
  "_id": "665f3c8b7c1bb8e5f8d3e7a0",
  "title": "Learn API Development",
  "description": "Complete the API assignment",
  "status": "completed",
  "createdAt": "2025-06-19T12:34:56.789Z"
}
```

### 4. Delete Task
- **URL**: `/api/tasks/:id`
- **Method**: `DELETE`
- **Response**:
```json
{
  "message": "Task deleted"
}
