export const StatCard = ({ icon, value, label, color = 'blue' }) => {
  const colorStyles = {
    blue: 'text-blue-400 group-hover:text-blue-300',
    green: 'text-emerald-400 group-hover:text-emerald-300',
    orange: 'text-orange-400 group-hover:text-orange-300',
  };

  const borderStyles = {
    blue: 'hover:border-blue-500/30 hover:shadow-blue-500/10',
    green: 'hover:border-emerald-500/30 hover:shadow-emerald-500/10',
    orange: 'hover:border-orange-500/30 hover:shadow-orange-500/10',
  };

  return (
    <div className={`glass-card p-4 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group border-white/5 ${borderStyles[color]}`}>
      <div className="text-2xl mb-2 filter drop-shadow-md transform group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-3xl font-bold text-white mb-0.5 tracking-tight">{value}</div>
      <div className={`text-[10px] font-bold uppercase tracking-wider ${colorStyles[color]} opacity-80 group-hover:opacity-100`}>{label}</div>
    </div>
  );
};
