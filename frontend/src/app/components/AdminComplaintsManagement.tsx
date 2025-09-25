'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Complaint {
  complaintId: string;
  userId: string;
  complaint: string;
  submittedOn: string;
  status: 'Solved' | 'Pending' | 'In Progress' | 'Rejected';
}

interface AdminComplaintsManagementProps {
  onStatusUpdate?: (complaintId: string, newStatus: Complaint['status']) => Promise<void>;
  onViewComplaint?: (complaint: Complaint) => void;
  className?: string;
  // API integration props
  apiConfig?: {
    baseUrl: string;
    headers?: Record<string, string>;
    timeout?: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}

const AdminComplaintsManagement: React.FC<AdminComplaintsManagementProps> = ({
  onStatusUpdate,
  onViewComplaint,
  className = '',
  apiConfig
}) => {
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      complaintId: '242332',
      userId: 'fahida-hassan',
      complaint: 'WiFi problem in semester-223',
      submittedOn: '28 August, 2024',
      status: 'Solved'
    },
    {
      complaintId: '242333',
      userId: 'sajibul-456',
      complaint: 'Lack of reading food in canteen. The quality should be improved',
      submittedOn: '29 August, 2024',
      status: 'Pending'
    },
    {
      complaintId: '242334',
      userId: 'maria-rodriguez',
      complaint: 'Library computer systems are frequently down during exam periods',
      submittedOn: '30 August, 2024',
      status: 'In Progress'
    },
    {
      complaintId: '242335',
      userId: 'ahmed-hassan',
      complaint: 'Parking space insufficient for students and faculty',
      submittedOn: '1 September, 2024',
      status: 'Rejected'
    }
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | Complaint['status']>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // API utility function for backend integration
  const apiCall = useCallback(async <T,>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      body?: Record<string, unknown>;
      headers?: Record<string, string>;
    } = {}
  ): Promise<ApiResponse<T>> => {
    if (!apiConfig) {
      throw new Error('API configuration not provided');
    }

    const { method = 'GET', body, headers = {} } = options;
    const url = `${apiConfig.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...apiConfig.headers,
        ...headers,
      },
      signal: AbortSignal.timeout(apiConfig.timeout || 10000),
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      return {
        success: response.ok,
        data: data.data || data,
        message: data.message,
        errors: data.errors
      };
    } catch (error) {
      console.error('API call failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Network error occurred');
    }
  }, [apiConfig]);

  const loadComplaints = useCallback(async (): Promise<void> => {
    if (!apiConfig) return;

    setLoading(true);
    try {
      const response = await apiCall<Complaint[]>('/admin/complaints');
      if (response.success && response.data) {
        setComplaints(response.data);
      }
    } catch (error) {
      console.error('Failed to load complaints:', error);
    } finally {
      setLoading(false);
    }
  }, [apiConfig, apiCall]);

  // Load complaints from API on component mount
  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const handleStatusChange = async (complaintId: string, newStatus: Complaint['status']): Promise<void> => {
    setLoading(true);
    try {
      if (onStatusUpdate) {
        await onStatusUpdate(complaintId, newStatus);
      } else if (apiConfig) {
        await apiCall(`/admin/complaints/${complaintId}/status`, {
          method: 'PATCH',
          body: { status: newStatus }
        });
      }

      // Update local state
      setComplaints(prev => 
        prev.map(complaint => 
          complaint.complaintId === complaintId 
            ? { ...complaint, status: newStatus }
            : complaint
        )
      );
    } catch (error) {
      console.error('Failed to update complaint status:', error);
      alert('Failed to update complaint status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewComplaint = (complaint: Complaint): void => {
    setSelectedComplaint(complaint);
    if (onViewComplaint) {
      onViewComplaint(complaint);
    }
  };

  const getStatusColor = (status: Complaint['status']): string => {
    switch (status) {
      case 'Solved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Complaint['status']): string => {
    switch (status) {
      case 'Solved':
        return '✓';
      case 'Pending':
        return '⏳';
      case 'In Progress':
        return '🔄';
      case 'Rejected':
        return '✗';
      default:
        return '?';
    }
  };

  // Filter and search functionality
  const filteredComplaints = complaints.filter(complaint => {
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      complaint.complaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.complaintId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Statistics calculation
  const stats = {
    total: complaints.length,
    solved: complaints.filter(c => c.status === 'Solved').length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    rejected: complaints.filter(c => c.status === 'Rejected').length
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Complaints Management
          </h2>
          <p className="text-gray-600 mt-1">
            Manage and track all student complaints efficiently
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={loadComplaints}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {/* <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total</p>
              <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
            </div>
            <div className="text-blue-500 text-2xl">📊</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Solved</p>
              <p className="text-2xl font-bold text-green-800">{stats.solved}</p>
            </div>
            <div className="text-green-500 text-2xl">✅</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
            </div>
            <div className="text-yellow-500 text-2xl">⏳</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-600 text-sm font-medium">In Progress</p>
              <p className="text-2xl font-bold text-indigo-800">{stats.inProgress}</p>
            </div>
            <div className="text-indigo-500 text-2xl">🔄</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Rejected</p>
              <p className="text-2xl font-bold text-red-800">{stats.rejected}</p>
            </div>
            <div className="text-red-500 text-2xl">❌</div>
          </div>
        </div>
      </div> */}

      {/* Filters and Search */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search */}
          <div className="flex-1 w-full sm:w-auto">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search complaints, users, or IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Filter by Status:
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Solved">Solved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading complaints...</p>
            </div>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No complaints have been submitted yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Complaint
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.complaintId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{complaint.complaintId}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                          {complaint.userId.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-900">{complaint.userId}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 max-w-xs">
                      <div className="text-sm text-gray-900 truncate" title={complaint.complaint}>
                        {complaint.complaint}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(complaint.submittedOn)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <select
                        value={complaint.status}
                        onChange={(e) => handleStatusChange(complaint.complaintId, e.target.value as Complaint['status'])}
                        className={`px-3 py-1 text-xs font-semibold rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${getStatusColor(complaint.status)}`}
                        disabled={loading}
                      >
                        <option value="Pending">⏳ Pending</option>
                        <option value="In Progress">🔄 In Progress</option>
                        <option value="Solved">✅ Solved</option>
                        <option value="Rejected">❌ Rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewComplaint(complaint)}
                        className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results Summary */}
      {!loading && filteredComplaints.length > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Showing {filteredComplaints.length} of {complaints.length} complaints
          {(searchTerm || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="ml-2 text-blue-600 hover:text-blue-700 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Complaint Details</h3>
                <p className="text-gray-600 mt-1">Review and manage complaint information</p>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Complaint ID</label>
                  <p className="text-lg font-mono text-gray-900">#{selectedComplaint.complaintId}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">User ID</label>
                  <p className="text-lg text-gray-900">{selectedComplaint.userId}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Complaint Description</label>
                <p className="text-gray-900 leading-relaxed">{selectedComplaint.complaint}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Submitted On</label>
                  <p className="text-lg text-gray-900">{formatDate(selectedComplaint.submittedOn)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Status</label>
                  <span className={`inline-flex items-center px-3 py-2 text-sm font-semibold rounded-full border ${getStatusColor(selectedComplaint.status)}`}>
                    <span className="mr-2">{getStatusIcon(selectedComplaint.status)}</span>
                    {selectedComplaint.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <select
                  value={selectedComplaint.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as Complaint['status'];
                    handleStatusChange(selectedComplaint.complaintId, newStatus);
                    setSelectedComplaint({ ...selectedComplaint, status: newStatus });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="Pending">⏳ Pending</option>
                  <option value="In Progress">🔄 In Progress</option>
                  <option value="Solved">✅ Solved</option>
                  <option value="Rejected">❌ Rejected</option>
                </select>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaintsManagement;