import React, { useState, useEffect } from 'react';
import TaskStats from './components/TaskStats';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import EmptyState from './components/EmptyState';

const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/tasks` 
  : 'http://localhost:5000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Sync theme to root element
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.body.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Fetch tasks from API on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks from the server.');
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the task server. Make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Create or Update task handler
  const handleFormSubmit = async (formData) => {
    try {
      if (taskToEdit) {
        // Update task
        const response = await fetch(`${API_BASE_URL}/${taskToEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            completed: taskToEdit.completed
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to update task.');
        }

        const updatedTask = await response.json();
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
      } else {
        // Create new task
        const response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to create task.');
        }

        const newTask = await response.json();
        setTasks(prev => [newTask, ...prev]);
      }
      
      handleCloseForm();
    } catch (err) {
      setError(err.message);
    }
  };

  // Toggle complete/incomplete handler
  const handleToggleComplete = async (id) => {
    // Optimistic UI updates
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

    try {
      const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
        method: 'PATCH'
      });

      if (!response.ok) {
        throw new Error('Failed to update task status.');
      }
      
      const updatedTask = await response.json();
      // Sync with server response
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
      setError(err.message);
      // Revert optimistic update
      fetchTasks();
    }
  };

  // Delete task handler
  const handleDeleteTask = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;

    // Optimistic UI update
    const originalTasks = [...tasks];
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete the task.');
      }
    } catch (err) {
      setError(err.message);
      // Revert to original
      setTasks(originalTasks);
    }
  };

  // Modal open controllers
  const handleOpenCreateForm = () => {
    setTaskToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setTaskToEdit(null);
    setIsFormOpen(false);
  };

  // Filter tasks based on query and tab
  const getFilteredTasks = () => {
    return tasks.filter(task => {
      const matchesSearch = 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filter === 'completed') {
        return matchesSearch && task.completed;
      }
      if (filter === 'active') {
        return matchesSearch && !task.completed;
      }
      return matchesSearch;
    });
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-title-group">
          <h1>Productivity Hub</h1>
          <p>Organize, track, and complete your tasks with styling</p>
        </div>
        
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          {/* Light/Dark Mode Switcher */}
          <button
            className="btn btn-secondary btn-theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{ padding: '10px' }}
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.93 4.93l1.59 1.59m10.96 10.96l1.59 1.59M3 12h2.25m13.5 0H21M5.75 12a6.25 6.25 0 1 1 12.5 0 6.25 6.25 0 0 1-12.5 0Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            )}
          </button>

          <button className="btn btn-primary" onClick={handleOpenCreateForm}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              width="18"
              height="18"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Task
          </button>
        </div>
      </header>

      {/* Stats Section */}
      <TaskStats tasks={tasks} />

      {/* Alert Notifications */}
      {error && (
        <div className="error-alert">
          <span>{error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Control Panel: Filters & Search */}
      <div className="controls-bar">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Tasks
          </button>
          <button
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <div className="search-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="search-icon"
            width="18"
            height="18"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z"
            />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Tasks List */}
      <main className="main-content">
        {isLoading ? (
          <div className="skeleton-container">
            {[1, 2, 3].map(n => (
              <div key={n} className="skeleton-card">
                <div>
                  <div className="skeleton-line title"></div>
                  <div className="skeleton-line text"></div>
                  <div className="skeleton-line text-short"></div>
                </div>
                <div className="skeleton-line footer"></div>
              </div>
            ))}
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="tasks-grid">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggleComplete}
                onEdit={handleOpenEditForm}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        ) : (
          <EmptyState filter={filter} onAddTaskClick={handleOpenCreateForm} />
        )}
      </main>

      {/* Form Dialog Modal */}
      {isFormOpen && (
        <TaskForm
          task={taskToEdit}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}

export default App;
