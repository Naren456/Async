import React, { useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAssignments } from '../hooks/useAssignments';
import { StatCard } from '../components/StatCard';
import { AssignmentsList } from '../components/AssignmentsList';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { BookOpen, CheckCircle, Clock, RefreshCw, LogOut } from 'lucide-react';

export const Dashboard = () => {
  const { logout } = useAuth();
  const { currentUser, authToken } = useApp();
  const { assignments, fetchAssignments, toggleCompletion, loading } = useAssignments();
  const { addToast } = useToast();

  const handleTestNotification = async () => {
    try {
      addToast('Sending test notification...', 'info');
      await api.sendTestNotification(authToken);
      addToast('Signal sent! Notification should appear shortly.', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to send test notification', 'error');
    }
  };

  // Fetch assignments on mount
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = assignments.length;
    const completed = assignments.filter((a) => a.Completed).length;
    const pending = total - completed;

    return { total, completed, pending };
  }, [assignments]);

  const handleRefresh = () => {
    fetchAssignments();
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="h-full flex flex-col animate-fade-in relative z-10">
      {/* Header */}
      <div className="px-6 py-5 flex justify-between items-center backdrop-blur-md bg-primary/30 sticky top-0 z-50 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-blue via-accent-glow to-accent-purple bg-clip-text text-transparent flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-accent-blue" />
            Async
          </h1>
          <p className="text-xs text-gray-400 font-medium tracking-wide">
            {currentUser?.fullName ? `Hey, ${currentUser.fullName.split(' ')[0]}` : 'Welcome back'}
          </p>
        </div>
        <div className="flex items-center gap-2">
           <button
            onClick={handleRefresh}
            className={`p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-accent-blue transition-all duration-300 group border border-white/5 hover:border-accent-blue/30 ${loading ? 'animate-spin' : ''}`}
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all duration-300 border border-white/5 hover:border-red-500/30"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 scroll-smooth">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard icon={<BookOpen className="w-5 h-5" />} value={stats.total} label="Total" color="blue" />
          <StatCard icon={<CheckCircle className="w-5 h-5" />} value={stats.completed} label="Done" color="green" />
          <StatCard icon={<Clock className="w-5 h-5" />} value={stats.pending} label="Left" color="orange" />
        </div>

        {/* Assignments List */}
        <div className="relative">
          <AssignmentsList
            assignments={assignments}
            loading={loading}
            onToggle={toggleCompletion}
          />
        </div>
        
        <div className="py-4 text-center">
           {/* Footer content removed */}
        </div>
      </div>
    </div>
  );
};
