import { useState } from "react";
import { Play, CheckCircle2, Smartphone, Layers, Bell } from "lucide-react";
import { useInView } from "../hooks/useInView";

const highlights = [
  { Icon: Smartphone, text: "Native Android experience with dark theme" },
  { Icon: Layers, text: "Separate interfaces for Students & Teachers" },
  { Icon: Bell, text: "Smart deadline reminders & notifications" },
  { Icon: CheckCircle2, text: "Offline-ready notes & assignment tracking" },
];

const StatusBar = () => (
  <>
    {/* Dynamic Island */}
    <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-black rounded-full z-30 flex items-center justify-end px-2.5 shadow-sm">
      <div className="w-3.5 h-3.5 rounded-full bg-[#111] shadow-[inset_0_0_2px_rgba(255,255,255,0.15)] flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[#080808]" />
      </div>
    </div>
    {/* Status Bar */}
    <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-6 pt-[14px] pb-1 text-white text-[12px] font-semibold tracking-wide">
      <span>9:41</span>
      <div className="flex items-center gap-[5px] opacity-90">
        <svg width="15" height="11" viewBox="0 0 16 10" fill="currentColor">
          <rect x="0" y="6" width="3" height="4" rx="1" />
          <rect x="4.5" y="4" width="3" height="6" rx="1" />
          <rect x="9" y="2" width="3" height="8" rx="1" />
          <rect x="13.5" y="0" width="3" height="10" rx="1" />
        </svg>
        <svg width="14" height="11" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 12C9.1 12 10 11.1 10 10C10 8.9 9.1 8 8 8C6.9 8 6 8.9 6 10C6 11.1 6.9 12 8 12Z" />
          <path d="M11.5 6.5C10.5 5.5 9.3 5 8 5C6.7 5 5.5 5.5 4.5 6.5C4.2 6.8 3.8 6.8 3.5 6.5C3.2 6.2 3.2 5.8 3.5 5.5C4.8 4.3 6.3 3.6 8 3.6C9.7 3.6 11.2 4.3 12.5 5.5C12.8 5.8 12.8 6.2 12.5 6.5C12.2 6.8 11.8 6.8 11.5 6.5Z" />
          <path d="M15 3C13.1 1.1 10.6 0 8 0C5.4 0 2.9 1.1 1 3C0.7 3.3 0.7 3.7 1 4C1.3 4.3 1.7 4.3 2 4C3.6 2.4 5.7 1.5 8 1.5C10.3 1.5 12.4 2.4 14 4C14.3 4.3 14.7 4.3 15 4C15.3 3.7 15.3 3.3 15 3Z" />
        </svg>
        <svg width="19" height="11" viewBox="0 0 18 10" fill="none" className="ml-0.5">
          <rect x="0.5" y="0.5" width="14" height="9" rx="2.5" stroke="currentColor" strokeWidth="1" />
          <rect x="1.5" y="1.5" width="9" height="7" rx="1.5" fill="currentColor" />
          <path d="M15.5 3.5V6.5C16.5 6.5 17 6 17 5C17 4 16.5 3.5 15.5 3.5Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  </>
);

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
            <div className="relative w-60 sm:w-72 h-[480px] sm:h-[560px] shrink-0 mx-auto">
              <div className="absolute -left-[2px] top-4 w-[2px] h-5 rounded-l-sm bg-gradient-to-r from-slate-400 to-slate-500 z-30" />
              <div className="absolute -left-[2px] top-12 w-[2px] h-5 rounded-l-sm bg-gradient-to-r from-slate-400 to-slate-500 z-30" />
              <div className="absolute -right-[2px] top-8 w-[2px] h-7 rounded-r-sm bg-gradient-to-l from-slate-400 to-slate-500 z-30" />
              <div className="relative w-full h-full rounded-[2.8rem] bg-gradient-to-b from-slate-400 via-slate-500 to-slate-600 p-[3px] shadow-2xl shadow-blue-500/10">
                <StatusBar />
                <div className="w-full h-full rounded-[2.6rem] overflow-hidden bg-black p-0.5 relative">
                  <div className="h-full w-full rounded-[2.4rem] overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 p-3 pt-16 flex flex-col">
                    <div className="bg-blue-900/40 rounded-xl p-3 mb-3">
                      <p className="text-white text-[13px] font-semibold mb-0.5">Dashboard</p>
                      <p className="text-blue-200/70 text-[9px]">Good morning! 2 tasks due today</p>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <div className="flex-1 bg-cyan-900/40 rounded-xl p-2.5">
                        <p className="text-cyan-400 text-base font-bold">3</p>
                        <p className="text-slate-400 text-[9px] mt-0.5">Assignments</p>
                      </div>
                      <div className="flex-1 bg-purple-900/40 rounded-xl p-2.5">
                        <p className="text-purple-300 text-base font-bold">12</p>
                        <p className="text-slate-400 text-[9px] mt-0.5">Notes</p>
                      </div>
                      <div className="flex-1 bg-orange-900/40 rounded-xl p-2.5">
                        <p className="text-orange-300 text-base font-bold">4.8</p>
                        <p className="text-slate-400 text-[9px] mt-0.5">CGPA</p>
                      </div>
                    </div>
                    <p className="text-white text-[11px] font-semibold mb-2">Upcoming</p>
                    <div className="flex-1 space-y-2 overflow-hidden">
                      {[
                        { label: "Math Assignment", sub: "Due Tomorrow", dot: "bg-blue-400" },
                        { label: "Physics Lab", sub: "Due in 3 days", dot: "bg-cyan-400" },
                        { label: "Chemistry Quiz", sub: "Next Week", dot: "bg-purple-400" },
                      ].map((item, i) => (
                        <div key={i} className="bg-slate-800/60 rounded-xl p-2 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-slate-700/60 flex items-center justify-center">
                            <div className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                          </div>
                          <div>
                            <p className="text-white text-[10px] font-medium">{item.label}</p>
                            <p className="text-slate-500 text-[8px]">{item.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-8">
              <div className="relative w-60 sm:w-72 h-[480px] sm:h-[560px] shrink-0 mx-auto">
                <div className="absolute -left-[2px] top-4 w-[2px] h-5 rounded-l-sm bg-gradient-to-r from-slate-400 to-slate-500 z-30" />
                <div className="absolute -left-[2px] top-12 w-[2px] h-5 rounded-l-sm bg-gradient-to-r from-slate-400 to-slate-500 z-30" />
                <div className="absolute -right-[2px] top-8 w-[2px] h-7 rounded-r-sm bg-gradient-to-l from-slate-400 to-slate-500 z-30" />
                <div className="relative w-full h-full rounded-[2.8rem] bg-gradient-to-b from-slate-400 via-slate-500 to-slate-600 p-[3px] shadow-2xl shadow-blue-500/10">
                  <StatusBar />
                  <div className="w-full h-full rounded-[2.6rem] overflow-hidden bg-black p-0.5 relative">
                  <div className="h-full w-full rounded-[2.4rem] overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 p-3 pt-16 flex flex-col">
                    <div className="bg-purple-900/40 rounded-xl p-3 mb-3">
                      <p className="text-white text-[13px] font-semibold mb-0.5">Assignments</p>
                      <p className="text-purple-200/70 text-[9px]">5 total • 3 pending</p>
                    </div>
                    <div className="flex-1 space-y-2 overflow-hidden">
                      {[
                        { title: "Data Structures", course: "DS Week 8", due: "Tomorrow", border: "border-l-2 border-blue-400" },
                        { title: "DBMS Lab Report", course: "DBMS Week 4", due: "In 2 days", border: "" },
                        { title: "OS Assignment 3", course: "Operating Systems", due: "Next Fri", border: "" },
                        { title: "Linear Algebra", course: "MATH F112", due: "Completed", border: "", done: true },
                      ].map((item, i) => (
                        <div key={i} className={`bg-slate-800/60 rounded-xl p-2.5 ${item.border}`}>
                          <p className={`text-white text-[10px] font-medium ${item.done ? 'line-through text-slate-500' : ''}`}>{item.title}</p>
                          <p className="text-slate-400 text-[8px]">{item.course}</p>
                          <p className={`text-[8px] mt-0.5 ${item.done ? 'text-green-400' : 'text-orange-300'}`}>{item.due}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  </div>
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
