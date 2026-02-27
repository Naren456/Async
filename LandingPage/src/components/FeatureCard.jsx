const FeatureCard = ({ Icon, title, desc, color }) => {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/20 group-hover:from-blue-500/30 group-hover:to-blue-600/30",
    cyan: "from-cyan-500/20 to-cyan-600/20 group-hover:from-cyan-500/30 group-hover:to-cyan-600/30",
    purple:
      "from-purple-500/20 to-purple-600/20 group-hover:from-purple-500/30 group-hover:to-purple-600/30",
    green:
      "from-green-500/20 to-green-600/20 group-hover:from-green-500/30 group-hover:to-green-600/30",
    pink: "from-pink-500/20 to-pink-600/20 group-hover:from-pink-500/30 group-hover:to-pink-600/30",
    orange:
      "from-orange-500/20 to-orange-600/20 group-hover:from-orange-500/30 group-hover:to-orange-600/30",
  };

  const iconColors = {
    blue: "text-blue-400",
    cyan: "text-cyan-400",
    purple: "text-purple-400",
    green: "text-green-400",
    pink: "text-pink-400",
    orange: "text-orange-400",
  };

  return (
    <div className="group rounded-2xl p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-slate-700/50 hover:border-blue-500/50 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br ${colorClasses[color]} transition-all duration-300`}
      >
        <Icon
          className={`${iconColors[color]} group-hover:scale-110 transition-transform`}
          size={28}
        />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
};

export default FeatureCard;