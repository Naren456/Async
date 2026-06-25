import { useState } from "react";
import { Play, CheckCircle2, Smartphone, Layers, Bell } from "lucide-react";
import { useInView } from "../hooks/useInView";

const highlights = [
  { Icon: Smartphone, text: "Native Android experience with dark theme" },
  { Icon: Layers, text: "Separate interfaces for Students & Teachers" },
  { Icon: Bell, text: "Smart deadline reminders & notifications" },
  { Icon: CheckCircle2, text: "Offline-ready notes & assignment tracking" },
];

function PreviewSection() {
  const [showVideo, setShowVideo] = useState(false);
  const [ref, inView] = useInView(0.1);

  return (
    <section className="py-20 md:py-32 relative">
      <div className="container mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            See ASync in Action
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            A clean, focused interface designed to keep you productive
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-16">
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="w-52 sm:w-60 h-[420px] sm:h-[480px] rounded-[2rem] border-4 border-slate-600 bg-slate-900 mx-auto shadow-2xl shadow-blue-500/10 overflow-hidden">
              <div className="h-full w-full rounded-[1.6rem] overflow-hidden">
                <img
                  src="https://github.com/user-attachments/assets/3a525388-579a-492a-819f-589a50d67ca4"
                  alt="ASync Dashboard Screen"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="pt-8">
              <div className="w-52 sm:w-60 h-[420px] sm:h-[480px] rounded-[2rem] border-4 border-slate-600 bg-slate-900 mx-auto shadow-2xl shadow-blue-500/10 overflow-hidden">
                <div className="h-full w-full rounded-[1.6rem] overflow-hidden">
                  <img
                    src="https://github.com/user-attachments/assets/35ab4704-c0d4-47a7-81ca-95be4adb8687"
                    alt="ASync Assignments Screen"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-5">
            <h3 className="text-2xl font-semibold text-white">
              Everything at your fingertips
            </h3>
            <p className="text-slate-400 leading-relaxed">
              ASync brings together assignments, notes, and deadlines in a
              beautifully dark interface optimized for focus.
            </p>
            <ul className="space-y-4">
              {highlights.map(({ Icon, text }, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
                    <Icon className="text-blue-400" size={18} />
                  </div>
                  <span className="text-slate-300 pt-1.5">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Watch the Demo
          </h3>
          <p className="text-slate-400">
            See the full app walkthrough
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-blue-500/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur flex items-center justify-center transition-all duration-500">
          {!showVideo ? (
            <button
              onClick={() => setShowVideo(true)}
              className="text-center cursor-pointer group"
              aria-label="Play demo video"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play className="text-blue-400 ml-0.5" size={40} />
              </div>
              <p className="text-slate-400 text-lg">Showcasing ASync</p>
              <p className="text-blue-400 mt-2 text-sm opacity-80">
                Click to watch demo
              </p>
            </button>
          ) : (
            <iframe
              src="https://drive.google.com/file/d/1DWEfB8W5igEUpIqNDGv97bxKVqlaRhlA/preview"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full border-0"
              title="ASync App Demo"
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default PreviewSection;
