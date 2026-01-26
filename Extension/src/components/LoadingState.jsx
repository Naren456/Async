export const LoadingState = ({ message = 'Loading assignments...' }) => {
  return (
    <div className="text-center py-16 px-6 animate-pulse-slow">
      <div className="w-12 h-12 border-4 border-white/10 border-t-accent-blue rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-sm font-medium text-gray-400 tracking-wide uppercase">{message}</p>
    </div>
  );
};
