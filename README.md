# Task Management Frontend

A responsive React task management application with real-time updates using Socket.IO.

## Features

- Create, edit, and delete tasks
- Real-time updates using Socket.IO
- Status management (To Do ➡️ In Progress ➡️ Completed)
- Responsive design for mobile and desktop
- Filter tasks by status
- Loading states for all actions
- Ant Design UI components

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Socket.IO Implementation Details

The real-time updates are implemented using Socket.IO with the following approach:

```javascript
const socket = io("http://localhost:5000", {
  transports: ["websocket"], 
});

socket.on("taskCreated", (task) => setTasks((prev) => [task, ...prev]));
socket.on("taskUpdated", (updated) => 
  setTasks((prev) => prev.map((t) => t._id === updated._id ? updated : t))
);
socket.on("taskDeleted", ({ id }) => 
  setTasks((prev) => prev.filter((t) => t._id !== id))
);
```

Challenges faced and solutions:
- CORS Issues: Resolved by using WebSocket transport instead of polling
- State Management: Implemented optimistic updates for better UX
- Mobile Responsiveness: Added CSS media queries for adaptable layouts

## Project Structure

```
src/
├── components/
│   ├── TaskFilter.jsx    # Status filtering
│   ├── TaskForm.jsx      # Create/Edit form
│   └── TaskList.jsx      # Task display & actions
├── services/
│   └── api.js           # API configuration
├── App.jsx              # Main component & Socket.IO
└── index.css            # Global styles
```

## Tech Stack

- React + Vite
- Ant Design for UI components
- Socket.IO Client for real-time updates
- Axios for API requests
