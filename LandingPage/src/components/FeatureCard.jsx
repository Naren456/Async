import { useInView } from "../hooks/useInView";

const colorMap = {
  blue: {
    bg: "from-blue-500/20 to-blue-600/20 group-hover:from-blue-500/30 group-hover:to-blue-600/30",
    icon: "text-blue-400",
    glow: "shadow-blue-500/10 group-hover:shadow-blue-500/20",
    border: "group-hover:border-blue-500/50",
  },
  cyan: {
    bg: "from-cyan-500/20 to-cyan-600/20 group-hover:from-cyan-500/30 group-hover:to-cyan-600/30",
    icon: "text-cyan-400",
    glow: "shadow-cyan-500/10 group-hover:shadow-cyan-500/20",
    border: "group-hover:border-cyan-500/50",
  },
  purple: {
    bg: "from-purple-500/20 to-purple-600/20 group-hover:from-purple-500/30 group-hover:to-purple-600/30",
    icon: "text-purple-400",
    glow: "shadow-purple-500/10 group-hover:shadow-purple-500/20",
    border: "group-hover:border-purple-500/50",
  },
  green: {
    bg: "from-green-500/20 to-green-600/20 group-hover:from-green-500/30 group-hover:to-green-600/30",
    icon: "text-green-400",
    glow: "shadow-green-500/10 group-hover:shadow-green-500/20",
    border: "group-hover:border-green-500/50",
  },
  pink: {
    bg: "from-pink-500/20 to-pink-600/20 group-hover:from-pink-500/30 group-hover:to-pink-600/30",
    icon: "text-pink-400",
    glow: "shadow-pink-500/10 group-hover:shadow-pink-500/20",
    border: "group-hover:border-pink-500/50",
  },
  orange: {
    bg: "from-orange-500/20 to-orange-600/20 group-hover:from-orange-500/30 group-hover:to-orange-600/30",
    icon: "text-orange-400",
    glow: "shadow-orange-500/10 group-hover:shadow-orange-500/20",
    border: "group-hover:border-orange-500/50",
  },
};

const FeatureCard = ({ Icon, title, desc, color = "blue", index = 0 }) => {
  const [ref, inView] = useInView(0.05);
  const c = colorMap[color] || colorMap.blue;

  return (
    <div
      ref={ref}
      className={`group rounded-2xl p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-slate-700/50 transition-all duration-700 hover:-translate-y-2 hover:shadow-xl ${c.glow} ${c.border} ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br ${c.bg} transition-all duration-300`}
      >
        <Icon
          className={`${c.icon} group-hover:scale-110 transition-transform duration-300`}
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
