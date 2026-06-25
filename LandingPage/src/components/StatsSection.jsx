import { useState, useEffect } from "react";
import { BookOpen, Users, ClipboardCheck, TrendingUp } from "lucide-react";
import { useInView } from "../hooks/useInView";

function CountUp({ end, suffix = "+", started }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, end]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

const stats = [
  { Icon: BookOpen, value: 50, label: "Subjects Covered", suffix: "+" },
  { Icon: Users, value: 1000, label: "Active Users", suffix: "+" },
  {
    Icon: ClipboardCheck,
    value: 5000,
    label: "Assignments Tracked",
    suffix: "+",
  },
  { Icon: TrendingUp, value: 98, label: "Satisfaction Rate", suffix: "%" },
];

function StatsSection() {
  const [ref, inView] = useInView(0.3);

  return (
    <section className="py-16 md:py-24 relative">
      <div className="container mx-auto px-6">
        <div
          ref={ref}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {stats.map(({ Icon, value, label, suffix }, i) => (
            <div
              key={label}
              className={`text-center p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur border border-slate-700/50 hover:border-blue-500/30 transition-all duration-700 ${
                inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <Icon className="text-blue-400" size={24} />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                <CountUp end={value} suffix={suffix} started={inView} />
              </div>
              <p className="text-slate-400 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
