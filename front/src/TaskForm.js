import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function TaskForm() {
  const [juniors, setJuniors] = useState([]);
  const [loadingJuniors, setLoadingJuniors] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedJunior, setSelectedJunior] = useState('');
  const [loadingTask, setLoadingTask] = useState(false);
  const [error, setError] = useState('');

  // Load juniors on mount
  useEffect(() => {
    fetch('/api/my-juniors/', { credentials: 'include' })
      .then(res => res.json())
      .then(setJuniors)
      .catch(err => setError('Failed to load team'))
      .finally(() => setLoadingJuniors(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingTask(true);
    setError('');

    try {
      const response = await fetch('/api/tasks/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title,
          description,
          assigned_to: selectedJunior
        })
      });

      if (response.ok) {
        setTitle('');
        setDescription('');
        setSelectedJunior('');
        setError('Task created successfully!');
      } else {
        setError('Failed to create task');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoadingTask(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Task</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
            disabled={loadingTask}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={loadingTask}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Assign to</label>
          {loadingJuniors ? (
            <div className="p-3 bg-gray-100 rounded-lg">Loading team...</div>
          ) : (
            <select
              value={selectedJunior}
              onChange={(e) => setSelectedJunior(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              disabled={loadingTask}
            >
              <option value="">Select junior</option>
              {juniors.map(junior => (
                <option key={junior.id} value={junior.id}>
                  {junior.username} ({junior.role})
                </option>
              ))}
            </select>
          )}
        </div>

        {error && (
          <div className={`p-3 rounded-lg ${
            error.includes('successfully') 
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loadingTask || loadingJuniors}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {loadingTask ? 'Creating...' : 'Create Task'}
        </button>
      </form>
      <div className="mb-6">
      <Link to="/performance" className="text-blue-600 hover:text-blue-800 font-medium">
  ← View Performance
</Link>
    </div>
    </div>
  );
}
