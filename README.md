# Productivity Hub — Personal Task Manager

A complete, production-ready Full-Stack Personal Task Manager web application. Built with a Node.js + Express backend storing tasks dynamically in a JSON file database, and a React frontend featuring a sleek glassmorphic dark mode dashboard with fluid transitions, statistics, overdue highlighting, and rich animations.

---

## 🚀 Live Demo & Repository

- **GitHub Repository**: [https://github.com/your-username/task-manager](https://github.com/your-username/task-manager) (Replace with your repo)
- **Frontend (Vercel)**: [https://task-manager-client.vercel.app](https://task-manager-client.vercel.app) (Replace with your deployment link)
- **Backend API (Render)**: [https://task-manager-server.onrender.com](https://task-manager-server.onrender.com) (Replace with your deployment link)

---

## 🛠️ Tech Stack

**Frontend**:
- **React 19** (Scaffolded using **Vite**)
- **Vanilla CSS** (Custom theme built with CSS Custom Properties, Glassmorphism, animations, and keyframes)
- **Feather-like inline SVG icons** for pixel-perfect design

**Backend**:
- **Node.js** + **Express**
- **CORS** for secure cross-origin resource sharing
- **JSON File Database** (`server/tasks.json`) for zero-config persistence

---

## 📂 Folder Structure

```
task-manager/
├── client/                  # React Frontend (Vite)
│   ├── public/              # Static assets
│   ├── src/                 # React source files
│   │   ├── assets/          # Icons & SVG graphics
│   │   ├── components/      # UI Components
│   │   │   ├── EmptyState.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskStats.jsx
│   │   ├── App.jsx          # Main client entrypoint (State & API calls)
│   │   ├── index.css        # Core design system & theme styling
│   │   └── main.jsx         # App bootstrapping
│   ├── index.html           # Main HTML index file with SEO meta tags
│   ├── vite.config.js       # Vite configuration
│   └── package.json         # Frontend dependencies & run scripts
│
├── server/                  # Express REST API (Node.js)
│   ├── server.js            # Main backend entrypoint (Express setup & routes)
│   ├── tasks.json           # File-based database storing task objects
│   └── package.json         # Backend dependencies & run scripts
│
└── README.md                # Project documentation (this file)
```

---

## ⚙️ How to Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v16+ recommended).

### Step 1: Start the Backend Server
Navigate to the `server/` directory, install packages, and start the development server:
```bash
cd server
npm install
npm run dev # Starts the server on port 5000
```

### Step 2: Start the Frontend Client
Open a new terminal window, navigate to the `client/` directory, install packages, and start the Vite dev server:
```bash
cd client
npm install
npm run dev # Starts Vite server on http://localhost:5173
```

Now, open `http://localhost:5173` in your browser to experience the application.

---

## 🔌 API Documentation

All API endpoints are hosted relative to the base URL: `http://localhost:5000`.

### 1. Create Task
* **Endpoint**: `POST /tasks`
* **Content-Type**: `application/json`
* **Request Body**:
  ```json
  {
    "title": "Build UI Mockups",
    "description": "Design glassmorphic dashboard in Figma",
    "dueDate": "2026-06-15"
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "id": "7fbe5c88-e9f0-4541-b2d6-7a13c9dfbf2b",
    "title": "Build UI Mockups",
    "description": "Design glassmorphic dashboard in Figma",
    "dueDate": "2026-06-15",
    "completed": false,
    "createdAt": "2026-06-01T23:30:00.000Z"
  }
  ```

### 2. Get All Tasks
* **Endpoint**: `GET /tasks`
* **Success Response (200 OK)**:
  ```json
  [
    {
      "id": "7fbe5c88-e9f0-4541-b2d6-7a13c9dfbf2b",
      "title": "Build UI Mockups",
      "description": "Design glassmorphic dashboard in Figma",
      "dueDate": "2026-06-15",
      "completed": false,
      "createdAt": "2026-06-01T23:30:00.000Z"
    }
  ]
  ```

### 3. Update Task
* **Endpoint**: `PUT /tasks/:id`
* **Content-Type**: `application/json`
* **Request Body**:
  ```json
  {
    "title": "Build UI Mockups (Updated)",
    "description": "Design dashboard and export code specs",
    "dueDate": "2026-06-18"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "id": "7fbe5c88-e9f0-4541-b2d6-7a13c9dfbf2b",
    "title": "Build UI Mockups (Updated)",
    "description": "Design dashboard and export code specs",
    "dueDate": "2026-06-18",
    "completed": false,
    "createdAt": "2026-06-01T23:30:00.000Z"
  }
  ```

### 4. Toggle Task Completion
* **Endpoint**: `PATCH /tasks/:id/toggle`
* **Success Response (200 OK)**:
  ```json
  {
    "id": "7fbe5c88-e9f0-4541-b2d6-7a13c9dfbf2b",
    "title": "Build UI Mockups (Updated)",
    "description": "Design dashboard and export code specs",
    "dueDate": "2026-06-18",
    "completed": true,
    "createdAt": "2026-06-01T23:30:00.000Z"
  }
  ```

### 5. Delete Task
* **Endpoint**: `DELETE /tasks/:id`
* **Success Response (200 OK)**:
  ```json
  {
    "message": "Task deleted successfully",
    "id": "7fbe5c88-e9f0-4541-b2d6-7a13c9dfbf2b"
  }
  ```

---

## 🔮 Future Improvements

1. **Persistent Database**: Transition from simple JSON file storage to a Mongo database (using Mongoose) or PostgreSQL (using Prisma).
2. **User Authentication**: Add user login, signup, and session handling using JSON Web Tokens (JWT) or Firebase Auth to support multi-user profiles.
3. **Subtasks Checklist**: Introduce a checklist feature within each task card to track smaller milestones.
4. **Categories/Tags**: Enable user-created labels (e.g., "Work", "Personal", "Study") with matching accent color codes.
5. **Drag and Drop**: Build a Kanban Board view utilizing libraries like `react-beautiful-dnd` or `@hello-pangea/dnd`.
