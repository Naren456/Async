import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AssignmentCard } from './AssignmentCard';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
import { Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

export const AssignmentsList = ({ assignments, loading, onToggle }) => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState('upcoming');

  const filteredAssignments = useMemo(() => {
    if (!assignments) return [];

    const now = new Date();
    // Reset time to start of day for accurate day comparison
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return assignments.filter((assignment) => {
      const isCompleted = assignment.Completed;
      const dueDate = new Date(assignment.dueDate);
      
      const diffTime = dueDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const isOverdue = diffDays < 0;

      if (activeTab === 'completed') return isCompleted;
      if (activeTab === 'overdue') return !isCompleted && isOverdue;
      if (activeTab === 'upcoming') return !isCompleted && !isOverdue;
      return true;
    });
  }, [assignments, activeTab]);

  const groupedAssignments = useMemo(() => {
    if (!filteredAssignments || filteredAssignments.length === 0) return {};

    const groups = {};
    const now = new Date();

    filteredAssignments.forEach((assignment) => {
      if (activeTab === 'completed') {
        if (!groups['Completed']) groups['Completed'] = [];
        groups['Completed'].push(assignment);
        return;
      }
      
      if (activeTab === 'overdue') {
        if (!groups['Overdue']) groups['Overdue'] = [];
        groups['Overdue'].push(assignment);
        return;
      }

      // Upcoming logic
      const dueDate = new Date(assignment.dueDate);
      const diffTime = dueDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let groupKey = 'Later';
      if (diffDays === 0) groupKey = 'Today';
      else if (diffDays === 1) groupKey = 'Tomorrow';
      else if (diffDays <= 7) groupKey = 'This Week';

      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(assignment);
    });

    return groups;
  }, [filteredAssignments, activeTab]);

  if (loading) {
    return <LoadingState message="Loading assignments..." />;
  }

  return (
    <div className="pb-4">
      {/* Filter Tabs */}
      <div className="flex p-1 mb-6 bg-white/5 rounded-xl border border-white/5 backdrop-blur-md">
        {['upcoming', 'overdue', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
              activeTab === tab
                ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab === 'upcoming' && <Calendar className="w-4 h-4" />}
            {tab === 'overdue' && <AlertTriangle className="w-4 h-4" />}
            {tab === 'completed' && <CheckCircle className="w-4 h-4" />}
            <span className="capitalize">{tab}</span>
          </button>
        ))}
      </div>

      {(!filteredAssignments || filteredAssignments.length === 0) ? (
        <EmptyState />
      ) : (
        Object.entries(groupedAssignments).map(([groupKey, groupItems]) => {
           if (!groupItems.length) return null;

           return (
            <div key={groupKey} className="mb-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                <h2 className="text-xs font-bold text-accent-blue uppercase tracking-widest pl-1">
                  {groupKey}
                </h2>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5">
                  {groupItems.length}
                </span>
              </div>
              <div className="space-y-3">
                {groupItems.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    onToggle={onToggle}
                  />
                ))}
              </div>
            </div>
           );
        })
      )}
    </div>
  );
};
