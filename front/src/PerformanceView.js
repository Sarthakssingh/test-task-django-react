import { useState, useEffect } from 'react';

export default function PerformanceView({ onLogout }) {
  const [performance, setPerformance] = useState(null);
  const [treePerformance, setTreePerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPerformance = async () => {
      setLoading(true);
      setError('');

      try {
        const [perfRes, treeRes] = await Promise.all([
          fetch('/me/performance/', { credentials: 'include' }),
          fetch('/me/tree-performance/', { credentials: 'include' })
        ]);

        if (perfRes.ok) {
          setPerformance(await perfRes.json());
        }
        
        if (treeRes.ok) {
          setTreePerformance(await treeRes.json());
        } else {
          setTreePerformance(null); 
        }
      } catch (err) {
        setError('Failed to load performance data');
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header with logout */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Performance</h1>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-medium"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="text-lg text-gray-600">Loading performance...</div>
        </div>
      ) : error ? (
        <div className="p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          {/* Personal Performance */}
          <div className="bg-white p-8 rounded-xl shadow-sm border">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">My Performance</h2>
            <div className="grid md:grid-cols-2 gap-6 text-center p-8 bg-gray-50 rounded-lg">
              <div>
                <div className="text-3xl font-bold text-blue-600">{performance?.tasks_completed || 0}</div>
                <div className="text-gray-600 mt-1">Tasks Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{performance?.on_time_percentage || 0}%</div>
                <div className="text-gray-600 mt-1">On Time</div>
              </div>
            </div>
          </div>

          {/* Team Performance (if exists) */}
          {treePerformance && (
            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Team Performance</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tasks Done</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">On Time %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {treePerformance.map((member, idx) => (
                      <tr key={idx} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{member.username}</td>
                        <td className="px-6 py-4 text-gray-600">{member.role}</td>
                        <td className="px-6 py-4">{member.tasks_completed}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {member.on_time_percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
