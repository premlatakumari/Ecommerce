// src/pages/AdminDashboard.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import UserTable from '../components/UserTable'; 
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
    Users, 
    UserCheck, 
    UserX, 
    Shield, 
    LogOut, 
    Search,
    RefreshCw,
    BarChart3,
    Settings,
    ChevronDown,
    User as UserIcon
} from 'lucide-react';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: '',
        search: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []); 

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await dashboardService.admin.getAllUsers(filters);
            
            if (response.success) {
                setUsers(response.data.users);
                setPagination(response.data.pagination);
                setError(null);
            }
        } catch (err) {
            console.error("Fetch Users Error:", err);
            const errorMessage = err.message || 'Failed to fetch user data';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await dashboardService.admin.getDashboardStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            console.error("Fetch Stats Error:", err);
            toast.error('Failed to fetch dashboard statistics');
        }
    };
    
    useEffect(() => {
        fetchUsers();
        fetchStats();
    }, [filters]); 

    const handleStatusUpdate = async (userId, newStatus) => {
        try {
            const response = await dashboardService.admin.updateUserStatus(userId, newStatus);
            
            if (response.success) {
                fetchUsers();
                fetchStats();
                toast.success(`User status updated to ${newStatus}`);
            }

        } catch (err) {
            console.error("Status Update Error:", err);
            const errorMessage = err.message || 'Failed to update user status';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: key !== 'page' ? 1 : value
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    if (loading && filters.page === 1) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-8">
                <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border border-slate-200">
                    <RefreshCw className="animate-spin h-16 w-16 text-indigo-600 mx-auto mb-4" />
                    <span className="text-2xl font-bold text-slate-800">Loading Admin Dashboard...</span>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-white p-4 md:p-8">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center mb-2">
                            <Shield className="h-10 w-10 text-indigo-600 mr-3" />
                            Admin Control Panel
                        </h1>
                        <p className="text-lg text-slate-600 font-medium">Manage users and monitor platform statistics</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                className="flex items-center gap-3 bg-linear-to-br from-indigo-50 to-purple-50 px-4 py-3 rounded-xl border border-indigo-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <UserIcon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-indigo-600">{user?.name}</p>
                                    <p className="text-xs text-slate-600">{user?.email}</p>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${showProfileDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {showProfileDropdown && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <button
                                        onClick={() => {
                                            navigate('/admin/profile');
                                            setShowProfileDropdown(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                                    >
                                        <UserIcon className="w-5 h-5" />
                                        <span className="font-medium">View Profile</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate('/admin/settings');
                                            setShowProfileDropdown(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                                    >
                                        <Settings className="w-5 h-5" />
                                        <span className="font-medium">Change Password</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <button onClick={logout} className="flex items-center px-6 py-3 bg-linear-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            <LogOut className="h-5 w-5 mr-2" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-t-4 border-slate-500">
                    <div className="flex items-center justify-center mb-3">
                        <div className="bg-linear-to-br from-slate-400 to-slate-600 p-3 rounded-xl">
                            <Users className="h-7 w-7 text-white" />
                        </div>
                    </div>
                    <div className="text-4xl font-extrabold text-slate-900 mb-1">{stats.totalUsers || 0}</div>
                    <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Users</div>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-t-4 border-emerald-500">
                    <div className="flex items-center justify-center mb-3">
                        <div className="bg-linear-to-br from-emerald-400 to-green-600 p-3 rounded-xl">
                            <UserCheck className="h-7 w-7 text-white" />
                        </div>
                    </div>
                    <div className="text-4xl font-extrabold text-emerald-600 mb-1">{stats.activeUsers || 0}</div>
                    <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Active Users</div>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-t-4 border-red-500">
                    <div className="flex items-center justify-center mb-3">
                        <div className="bg-linear-to-br from-red-400 to-pink-600 p-3 rounded-xl">
                            <UserX className="h-7 w-7 text-white" />
                        </div>
                    </div>
                    <div className="text-4xl font-extrabold text-red-600 mb-1">{stats.inactiveUsers || 0}</div>
                    <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Inactive Users</div>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-t-4 border-blue-500">
                    <div className="flex items-center justify-center mb-3">
                        <div className="bg-linear-to-br from-blue-400 to-blue-600 p-3 rounded-xl">
                            <UserCheck className="h-7 w-7 text-white" />
                        </div>
                    </div>
                    <div className="text-4xl font-extrabold text-blue-600 mb-1">{stats.verifiedUsers || 0}</div>
                    <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Verified Users</div>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-t-4 border-purple-500">
                    <div className="flex items-center justify-center mb-3">
                        <div className="bg-linear-to-br from-purple-400 to-indigo-600 p-3 rounded-xl">
                            <BarChart3 className="h-7 w-7 text-white" />
                        </div>
                    </div>
                    <div className="text-4xl font-extrabold text-purple-600 mb-1">{stats.recentUsers || 0}</div>
                    <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Recent (30d)</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <Settings className="h-7 w-7 mr-3 text-indigo-600" />
                    Filter Users
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="search" className="block text-sm font-semibold text-slate-700 mb-3 flex items-center">
                            <Search className="h-5 w-5 inline mr-2 text-indigo-600" />
                            Search Users
                        </label>
                        <div className="relative">
                            <input
                                id="search"
                                type="text"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                placeholder="Search by name or email..."
                                className="w-full px-5 py-3 pl-12 border-2 border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300"
                            />
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-semibold text-slate-700 mb-3">
                            Filter by Status
                        </label>
                        <select
                            id="status"
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-5 py-3 border-2 border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 font-medium"
                        >
                            <option value="">All Users</option>
                            <option value="active">Active Only</option>
                            <option value="inactive">Inactive Only</option>
                        </select>
                    </div>
                </div>
            </div>
            
            {error && (
                <div className="error-message mb-6">
                    🛑 {error}
                </div>
            )}
            
            {/* Users Table */}
            <UserTable 
                users={users} 
                onStatusChange={handleStatusUpdate}
                loading={loading}
            />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={!pagination.hasPrev}
                                className="flex items-center px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous
                            </button>
                            <button 
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={!pagination.hasNext}
                                className="flex items-center px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
                            >
                                Next
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        <div className="text-sm text-slate-700 font-semibold bg-linear-to-br from-indigo-50 to-purple-50 px-6 py-3 rounded-xl border border-indigo-200">
                            <span className="text-indigo-600">
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>
                            <span className="mx-2 text-slate-400">•</span>
                            <span>
                                {pagination.totalUsers} total users
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;