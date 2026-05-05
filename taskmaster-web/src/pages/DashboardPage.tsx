import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Priority, type Todo, type CreateTodoRequest } from '../types/todo';
import { todoService } from '../services/todoService';
import './Dashboard.css';

const PRIORITY_LABEL: Record<Priority, string> = {
  [Priority.Low]: 'Low',
  [Priority.Medium]: 'Medium',
  [Priority.High]: 'High',
};

const PRIORITY_CLASS: Record<Priority, string> = {
  [Priority.Low]: 'low',
  [Priority.Medium]: 'medium',
  [Priority.High]: 'high',
};

const isOverdue = (todo: Todo) =>
  !todo.isCompleted && !!todo.dueDate && new Date(todo.dueDate) < new Date();

interface FormState {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  category: string;
}

const DEFAULT_FORM: FormState = {
  title: '', description: '', dueDate: '',
  priority: Priority.Medium, category: '',
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FormState>(DEFAULT_FORM);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');

  const username = localStorage.getItem('username') ?? 'User';

  const fetchTodos = async () => {
    try {
      const data = await todoService.getAll();
      setTodos(data);
    } catch {
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTodos(); }, []);

  const stats = useMemo(() => ({
    total: todos.length,
    completed: todos.filter(t => t.isCompleted).length,
    overdue: todos.filter(isOverdue).length,
  }), [todos]);

  const filtered = useMemo(() => todos.filter(todo => {
    const matchSearch = todo.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === 'all' ? true :
      filterStatus === 'active' ? !todo.isCompleted : todo.isCompleted;
    const matchPriority =
      filterPriority === 'all' ? true : todo.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  }), [todos, search, filterStatus, filterPriority]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      const payload: CreateTodoRequest = {
        title: form.title,
        description: form.description || undefined,
        dueDate: form.dueDate || undefined,
        priority: form.priority,
        category: form.category || undefined,
      };
      await todoService.create(payload);
      setForm(DEFAULT_FORM);
      setShowForm(false);
      fetchTodos();
    } catch {
      setError('Failed to add task.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (todo: Todo) => {
    try {
      await todoService.update(todo.id, {
        title: todo.title, description: todo.description,
        dueDate: todo.dueDate, priority: todo.priority,
        category: todo.category, isCompleted: !todo.isCompleted,
      });
      fetchTodos();
    } catch { setError('Failed to update task.'); }
  };

  const handleEditStart = (todo: Todo) => {
    setEditId(todo.id);
    setEditForm({
      title: todo.title,
      description: todo.description ?? '',
      dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
      priority: todo.priority,
      category: todo.category ?? '',
    });
  };

  const handleEditSave = async (todo: Todo) => {
    try {
      await todoService.update(todo.id, {
        title: editForm.title,
        description: editForm.description || undefined,
        dueDate: editForm.dueDate || undefined,
        priority: editForm.priority,
        category: editForm.category || undefined,
        isCompleted: todo.isCompleted,
      });
      setEditId(null);
      fetchTodos();
    } catch { setError('Failed to save changes.'); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await todoService.delete(id);
      fetchTodos();
    } catch { setError('Failed to delete task.'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className="tm-root">

      {/* ── Sidebar ── */}
      <aside className="tm-sidebar">
        <div className="tm-logo">Task<span>Master</span></div>

        <nav className="tm-nav">
          <div className="tm-nav-label">Tasks</div>
          <div
            className={`tm-nav-item ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 3h12v2H2zm0 4h12v2H2zm0 4h8v2H2z"/>
            </svg>
            All Tasks
            <span className="tm-nav-count">{stats.total}</span>
          </div>
          <div
            className={`tm-nav-item ${filterStatus === 'active' ? 'active' : ''}`}
            onClick={() => setFilterStatus('active')}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 2"/>
            </svg>
            Active
            <span className="tm-nav-count">{stats.total - stats.completed}</span>
          </div>
          <div
            className={`tm-nav-item ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 8l4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Completed
            <span className="tm-nav-count">{stats.completed}</span>
          </div>
          {stats.overdue > 0 && (
            <div className="tm-nav-item" style={{ color: '#f56565' }}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 2v5m0 2v1M2 14h12L8 3 2 14z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Overdue
              <span className="tm-nav-count" style={{ background: '#f5656520', color: '#f56565' }}>
                {stats.overdue}
              </span>
            </div>
          )}
        </nav>

        <div className="tm-user-footer">
          <div className="tm-avatar">{initials}</div>
          <div>
            <div className="tm-user-name">{username}</div>
            <div className="tm-user-role">Free plan</div>
          </div>
          <button className="tm-logout-btn" onClick={handleLogout} title="Logout">⏻</button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="tm-main">
        <div className="tm-topbar">
          <div>
            <div className="tm-page-title">My Tasks</div>
            <div className="tm-page-date">{today}</div>
          </div>
          <button className="tm-new-btn" onClick={() => setShowForm(v => !v)}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <path d="M6 1v10M1 6h10" strokeLinecap="round"/>
            </svg>
            {showForm ? 'Cancel' : 'New Task'}
          </button>
        </div>

        <div className="tm-content">

          {error && (
            <div className="tm-alert">
              <span>{error}</span>
              <button onClick={() => setError('')}>✕</button>
            </div>
          )}

          {/* Stats */}
          <div className="tm-stats">
            <div className="tm-stat total">
              <div className="tm-stat-val">{stats.total}</div>
              <div className="tm-stat-label">Total Tasks</div>
            </div>
            <div className="tm-stat done">
              <div className="tm-stat-val">{stats.completed}</div>
              <div className="tm-stat-label">Completed</div>
            </div>
            <div className="tm-stat over">
              <div className="tm-stat-val">{stats.overdue}</div>
              <div className="tm-stat-label">Overdue</div>
            </div>
          </div>

          {/* Add Form */}
          {showForm && (
            <div className="tm-form-card">
              <div className="tm-form-title">New Task</div>
              <form onSubmit={handleAdd}>
                <div style={{ marginBottom: '12px' }}>
                  <label className="tm-field-label">Title *</label>
                  <input
                    className="tm-input"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="What needs to be done?"
                    required autoFocus
                  />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label className="tm-field-label">Description</label>
                  <textarea
                    className="tm-textarea"
                    rows={2}
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Add more details..."
                  />
                </div>
                <div className="tm-form-row">
                  <div>
                    <label className="tm-field-label">Priority</label>
                    <select
                      className="tm-select"
                      value={form.priority}
                      onChange={e => setForm(f => ({ ...f, priority: Number(e.target.value) as Priority }))}
                    >
                      <option value={Priority.Low}>Low</option>
                      <option value={Priority.Medium}>Medium</option>
                      <option value={Priority.High}>High</option>
                    </select>
                  </div>
                  <div>
                    <label className="tm-field-label">Due Date</label>
                    <input
                      type="date" className="tm-input"
                      value={form.dueDate}
                      onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="tm-field-label">Category</label>
                    <input
                      className="tm-input"
                      placeholder="e.g. Work"
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="tm-form-actions">
                  <button type="submit" className="tm-btn-primary" disabled={submitting}>
                    {submitting ? 'Adding...' : 'Add Task'}
                  </button>
                  <button type="button" className="tm-btn-ghost" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Toolbar */}
          <div className="tm-toolbar">
            <input
              className="tm-search"
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="tm-filter-grp">
              {(['all', 'active', 'completed'] as const).map(s => (
                <button
                  key={s}
                  className={`tm-filter-btn ${filterStatus === s ? 'active' : ''}`}
                  onClick={() => setFilterStatus(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <select
              className="tm-priority-sel"
              value={filterPriority}
              onChange={e => setFilterPriority(
                e.target.value === 'all' ? 'all' : Number(e.target.value) as Priority
              )}
            >
              <option value="all">All Priorities</option>
              <option value={Priority.Low}>Low</option>
              <option value={Priority.Medium}>Medium</option>
              <option value={Priority.High}>High</option>
            </select>
          </div>

          {/* Task List */}
          {loading ? (
            <>
              <div className="tm-skeleton" />
              <div className="tm-skeleton" style={{ opacity: 0.7 }} />
              <div className="tm-skeleton" style={{ opacity: 0.4 }} />
            </>
          ) : filtered.length === 0 ? (
            <div className="tm-empty">
              <div className="tm-empty-icon">📋</div>
              <div className="tm-empty-title">
                {todos.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
              </div>
              <div className="tm-empty-sub">
                {todos.length === 0
                  ? 'Click "New Task" to get started'
                  : 'Try adjusting your search or filters'}
              </div>
            </div>
          ) : (
            <div className="tm-task-list">
              {filtered.map(todo => (
                <div
                  key={todo.id}
                  className={`tm-task-card
                    ${isOverdue(todo) ? 'overdue' : ''}
                    ${todo.isCompleted ? 'completed' : ''}`}
                >
                  <input
                    type="checkbox"
                    className="tm-checkbox"
                    checked={todo.isCompleted}
                    onChange={() => handleToggle(todo)}
                  />
                  <div className="tm-task-body">
                    {editId === todo.id ? (
                      <>
                        <input
                          className="tm-input"
                          value={editForm.title}
                          onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                          style={{ marginBottom: '8px' }}
                        />
                        <div className="tm-form-row" style={{ marginBottom: '10px' }}>
                          <select
                            className="tm-select"
                            value={editForm.priority}
                            onChange={e => setEditForm(f => ({ ...f, priority: Number(e.target.value) as Priority }))}
                          >
                            <option value={Priority.Low}>Low</option>
                            <option value={Priority.Medium}>Medium</option>
                            <option value={Priority.High}>High</option>
                          </select>
                          <input
                            type="date" className="tm-input"
                            value={editForm.dueDate}
                            onChange={e => setEditForm(f => ({ ...f, dueDate: e.target.value }))}
                          />
                          <input
                            className="tm-input"
                            placeholder="Category"
                            value={editForm.category}
                            onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                          />
                        </div>
                        <div className="tm-form-actions">
                          <button className="tm-btn-primary" onClick={() => handleEditSave(todo)}>
                            Save
                          </button>
                          <button className="tm-btn-ghost" onClick={() => setEditId(null)}>
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={`tm-task-title ${todo.isCompleted ? 'done' : ''}`}>
                          {todo.title}
                        </div>
                        {todo.description && (
                          <div className="tm-task-desc">{todo.description}</div>
                        )}
                        <div className="tm-task-meta">
                          <span className={`tm-badge ${PRIORITY_CLASS[todo.priority]}`}>
                            {PRIORITY_LABEL[todo.priority]}
                          </span>
                          {todo.category && (
                            <span className="tm-badge category">{todo.category}</span>
                          )}
                          {isOverdue(todo) && (
                            <span className="tm-badge overdue-tag">Overdue</span>
                          )}
                          {todo.dueDate && (
                            <span className="tm-due">
                              Due {new Date(todo.dueDate).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric'
                              })}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  {editId !== todo.id && (
                    <div className="tm-task-actions">
                      <button className="tm-action-btn edit" onClick={() => handleEditStart(todo)}>
                        Edit
                      </button>
                      <button className="tm-action-btn delete" onClick={() => handleDelete(todo.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;