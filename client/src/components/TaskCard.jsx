import React from 'react';

const TaskCard = ({ task, onToggle, onEdit, onDelete }) => {
  const { id, title, description, dueDate, completed, createdAt } = task;

  const isOverdue = () => {
    if (completed || !dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Add time component to prevent timezone shift issues
    const [year, month, day] = dueDate.split('-');
    const due = new Date(year, month - 1, day);
    due.setHours(0, 0, 0, 0);
    
    return due < today;
  };

  const formatDueDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const overdue = isOverdue();

  return (
    <div className={`task-card ${completed ? 'task-completed' : ''} ${overdue ? 'task-overdue' : ''}`}>
      <div className="task-card-header">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={completed}
            onChange={() => onToggle(id)}
            className="task-checkbox"
          />
          <span className="checkmark"></span>
        </label>
        
        <div className="task-title-group">
          <h4 className="task-title">{title}</h4>
          {overdue && <span className="badge badge-overdue">Overdue</span>}
          {completed && <span className="badge badge-completed">Completed</span>}
        </div>

        <div className="task-actions">
          <button className="btn-icon btn-edit" onClick={() => onEdit(task)} title="Edit Task">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width="18"
              height="18"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a0.75 0 0 1-0.343.203l-3.85 1.08a0.375 0 0 1-0.47-.472l1.08-3.85a0.75 0 0 1 .203-0.343l12.03-12.03Z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 1 1-.512-1.348l.051-.01" />
            </svg>
          </button>
          <button className="btn-icon btn-delete" onClick={() => onDelete(id)} title="Delete Task">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width="18"
              height="18"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>

      {description && <p className="task-description">{description}</p>}

      <div className="task-card-footer">
        <div className={`task-date ${overdue ? 'date-overdue' : ''}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            width="14"
            height="14"
            className="calendar-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
          <span>{formatDueDate(dueDate)}</span>
        </div>
        <span className="task-created-at">
          Created {new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
