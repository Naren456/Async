import React from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Check, ExternalLink } from 'lucide-react';

export const AssignmentCard = ({ assignment, onToggle }) => {
  const { currentUser } = useApp();
  const { addToast } = useToast();
  const isCompleted = assignment.Completed;

  const playSuccessSound = () => {
    const audio = new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3");
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play failed", e));
  };

  const handleCardClick = () => {
    if (assignment.link) {
      chrome.tabs.create({ url: assignment.link });
    }
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    if (!isCompleted) {
      playSuccessSound();
      addToast('Marked as complete!', 'success');
    }
    onToggle(assignment.id);
  };

  const getDueStatus = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return null;
  };

  const formattedDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const status = getDueStatus(assignment.dueDate);

  return (
    <div
      className={`glass-card p-4 mb-3 transition-all duration-300 hover:bg-white/10 hover:border-accent-blue/40 hover:-translate-y-1 hover:shadow-lg rounded-2xl group relative overflow-hidden ${
        isCompleted ? 'opacity-60 grayscale-[0.5]' : ''
      }`}
    >
      {/* Selection Highlight */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      {/* Subject Badge & Date */}
      <div className="relative z-10 flex justify-between items-start mb-3">
        <div className="inline-flex items-center px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-accent-blue uppercase tracking-wider backdrop-blur-md">
          {assignment.subjectCode}
        </div>
        
        <div className={`text-[10px] font-medium flex items-center px-2 py-0.5 rounded-full border ${
            status === 'Overdue' ? 'bg-red-500/10 text-red-300 border-red-500/20' : 
            status === 'Today' ? 'bg-orange-500/10 text-orange-300 border-orange-500/20' : 
            status === 'Tomorrow' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' :
            'text-gray-400 border-transparent'
          }`}>
          {status ? `${status}, ` : ''}{formattedDate(assignment.dueDate)}
        </div>
      </div>

      <div className="relative z-10 flex gap-3 items-start">
        {/* Checkbox */}
        <button
          onClick={handleCheckboxClick}
          className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 ${
            isCompleted
              ? 'bg-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)] animate-pop'
              : 'border-white/20 hover:border-accent-blue bg-white/5'
          }`}
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {isCompleted && (
            <Check className="w-3.5 h-3.5 text-white animate-check" strokeWidth={3} />
          )}
        </button>

        {/* Title and Link Button */}
        <div className="flex-1 flex justify-between gap-2">
          <h3 className={`text-sm font-medium leading-relaxed text-white transition-all duration-300 ${
            isCompleted ? 'line-through text-gray-500' : 'group-hover:text-blue-100'
          }`}>
            {assignment.title}
          </h3>

          {assignment.link && (
            <button
              onClick={handleCardClick}
              className="flex-shrink-0 w-8 h-8 -mt-1 -mr-1 rounded-xl bg-white/5 hover:bg-accent-blue hover:text-white text-gray-400 transition-all duration-300 border border-white/5 hover:border-accent-blue/50 group/btn flex items-center justify-center transform hover:rotate-12"
              title="Open Assignment Link"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
