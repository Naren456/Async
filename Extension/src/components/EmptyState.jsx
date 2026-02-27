import React from 'react';
import { PartyPopper } from 'lucide-react';

export const EmptyState = () => {
  return (
    <div className="text-center py-12 px-6 animate-fade-in text-gray-400">
      <div className="mb-4 animate-bounce inline-flex p-4 rounded-full bg-white/5 border border-white/5">
        <PartyPopper className="w-12 h-12 text-accent-blue" />
      </div>
      <p className="text-lg font-bold text-white mb-2 tracking-tight">All Caught Up!</p>
      <p className="text-sm opacity-80">No pending assignments. Great job!</p>
    </div>
  );
};
