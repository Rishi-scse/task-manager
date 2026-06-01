import React from 'react';

const TaskStats = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="stat-value">{total}</div>
        <div className="stat-label">Total Tasks</div>
        <div className="stat-bar total-bar"></div>
      </div>
      <div className="stat-card">
        <div className="stat-value text-active">{active}</div>
        <div className="stat-label">Active</div>
        <div className="stat-bar active-bar" style={{ width: total > 0 ? `${(active / total) * 100}%` : '0%' }}></div>
      </div>
      <div className="stat-card">
        <div className="stat-value text-completed">{completed}</div>
        <div className="stat-label">Completed</div>
        <div className="stat-bar completed-bar" style={{ width: `${completionRate}%` }}></div>
      </div>
      <div className="stat-card">
        <div className="stat-value text-progress">{completionRate}%</div>
        <div className="stat-label">Progress</div>
        <div className="progress-ring-container">
          <svg className="progress-ring" width="36" height="36">
            <circle
              className="progress-ring-circle-bg"
              stroke="#e2e8f0"
              strokeWidth="3.5"
              fill="transparent"
              r="15"
              cx="18"
              cy="18"
            />
            <circle
              className="progress-ring-circle"
              stroke="var(--accent)"
              strokeWidth="3.5"
              fill="transparent"
              r="15"
              cx="18"
              cy="18"
              style={{
                strokeDasharray: `${2 * Math.PI * 15}`,
                strokeDashoffset: `${2 * Math.PI * 15 * (1 - completionRate / 100)}`
              }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;
