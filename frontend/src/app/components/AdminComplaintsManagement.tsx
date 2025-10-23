'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';


interface Complaint {
  _id: string;
  user: {
    _id: string;
    name?: string;
    email?: string;
  };
  category: string;
  type?: string;
  answer?: string;
  complaint: string;
  status: 'Pending' | 'In-progress' | 'Resolved';
  createdAt: string;
}

interface AdminComplaintsManagementProps {
  className?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const statusColors: Record<Complaint['status'], string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In-progress': 'bg-blue-100 text-blue-800',
  Resolved: 'bg-green-100 text-green-800',
};

const AdminComplaintsManagement: React.FC<AdminComplaintsManagementProps> = ({ className = '' }) => {
  const [complaints, setComplaints] = useState<Complaint[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | Complaint['status']>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const apiCall = useCallback(async <T,>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    const { method = 'GET', body, headers = {} } = options;
    const url = `http://localhost:3000${endpoint}`;
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...headers },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      return { success: res.ok, data: data.data || data, message: data.message };
    } catch (error) {
      console.error('API call failed:', error);
      return { success: false, message: 'Network error' };
    }
  }, []);

  const loadComplaints = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const res = await apiCall<Complaint[]>('/api/complaints', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.success && res.data) setComplaints(res.data);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const handleStatusChange = async (id: string, status: Complaint['status']) => {
  setLoading(true);
  const token = localStorage.getItem('accessToken');
  if (!token) return;

  try {
    const res = await axios.put(
      `http://localhost:3000/api/complaints/${id}/status`,
      { status }, // Axios uses `data` as the 2nd argument
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (res.data?.success) {
       await loadComplaints();
    } else {
      alert(res.data?.message || 'Failed to update status.');
    }
  } catch (err: unknown) {
    console.error(err);
    alert(err.response?.data?.message || 'Failed to update status.');
  } finally {
    setLoading(false);
  }
};
  const filtered = complaints?.filter(c => {
    const statusMatch = statusFilter === 'all' || c.status === statusFilter;
    const searchMatch =
      !searchTerm ||
      c.complaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c._id.includes(searchTerm);
    return statusMatch && searchMatch;
  }) || [];

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Complaints Management</h2>
        <button onClick={loadComplaints} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search by user, complaint, or ID"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded-lg w-full sm:w-1/2"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as unknown)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In-progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No complaints found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
  <tr>
    <th className="px-4 py-3 text-sm font-medium text-gray-600">ID</th>
    <th className="px-4 py-3 text-sm font-medium text-gray-600">User</th>
    <th className="px-4 py-3 text-sm font-medium text-gray-600">Complaint</th>
    <th className="px-4 py-3 text-sm font-medium text-gray-600">Date</th>
    <th className="px-4 py-3 text-sm font-medium text-gray-600">Current Status</th>
    <th className="px-4 py-3 text-sm font-medium text-gray-600 text-center">Change Status</th>
          </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2 text-sm">#{c._id}</td>
                <td className="px-4 py-2 text-sm">{c.user?.name || 'Unknown'}</td>
                <td className="px-4 py-2 text-sm">{c.complaint}</td>
                <td className="px-4 py-2 text-sm">{formatDate(c.createdAt)}</td>
                {/* Current Status Column */}
                <td className={`px-4 py-2 text-sm ${statusColors[c.status]}`}>{c.status}</td>
                {/* Select dropdown for changing status */}
                <td className="px-4 py-2 text-sm text-center">
                  <div className="flex gap-2">
                    {c.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(c._id, 'In-progress')}
                          disabled={loading}
                          className="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-600 disabled:opacity-50"
                        >
                          In Progress
                        </button>
                        <button
                          onClick={() => handleStatusChange(c._id, 'Resolved')}
                          disabled={loading}
                          className="px-3 py-1 text-sm rounded-lg bg-green-600 text-white hover:bg-green-600 disabled:opacity-50"
                        >
                          Resolved
                        </button>
                      </>
                    )}

                    {c.status === 'In-progress' && (
                      <button
                        onClick={() => handleStatusChange(c._id, 'Resolved')}
                        disabled={loading} 
                        className="px-3 py-1 text-sm rounded-lg bg-green-600 text-white hover:bg-green-600 disabled:opacity-50"
                      >
                        Resolved
                      </button>
                    )}

                    {c.status === 'Resolved' && (
                      <button
                        disabled
                        className="px-3 py-1 text-sm rounded-lg bg-red-600 text-white cursor-not-allowed text-center"
                      >
                        Resolved
                      </button>
                    )}
                  </div>
                </td>


              </tr>
            ))}
          </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminComplaintsManagement;
