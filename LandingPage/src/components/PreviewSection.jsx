import { useState } from "react";
import { Play, CheckCircle2, Smartphone, Layers, Bell } from "lucide-react";
import { useInView } from "../hooks/useInView";

const highlights = [
  { Icon: Smartphone, text: "A focused, native mobile experience" },
  { Icon: Layers, text: "Purpose-built spaces for students and teachers" },
  { Icon: Bell, text: "Assignment reminders that keep deadlines visible" },
  { Icon: CheckCircle2, text: "Notes and coursework organized by semester and term" },
];

// These are the product screenshots maintained in the repository README.
const studentScreens = [
  { src: "https://github.com/user-attachments/assets/3a525388-579a-492a-819f-589a50d67ca4", alt: "ASync student dashboard", label: "Student dashboard" },
  { src: "https://github.com/user-attachments/assets/35ab4704-c0d4-47a7-81ca-95be4adb8687", alt: "ASync assignment tracker", label: "Assignment tracker" },
  { src: "https://github.com/user-attachments/assets/835832eb-5f5c-4b8c-99d9-831c19932af7", alt: "ASync notes screen", label: "Course notes" },
];

const teacherScreens = [
  { src: "https://github.com/user-attachments/assets/506dc18d-f487-40f3-84e0-3a714c836359", alt: "ASync teacher dashboard", label: "Teacher dashboard" },
  { src: "https://github.com/user-attachments/assets/d47b169f-0a64-4541-9cb4-72019e718d28", alt: "ASync teacher subject management", label: "Subject management" },
  { src: "https://github.com/user-attachments/assets/5dcb5ab0-176a-4b75-b9cb-72a0d4551e62", alt: "ASync teacher assignment management", label: "Assignment management" },
];

function ScreenGallery({ title, description, screens }) {
  return (
    <div className="rounded-3xl border border-slate-700/70 bg-slate-900/40 p-5 sm:p-7">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-5">
        {screens.map(({ src, alt, label }) => (
          <figure key={src} className="min-w-0">
            <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-xl shadow-blue-950/20">
              <img src={src} alt={alt} loading="lazy" className="aspect-[9/19.5] w-full object-cover object-top transition-transform duration-300 hover:scale-105" />
            </div>
            <figcaption className="mt-2 text-center text-xs text-slate-400">{label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function PreviewSection() {
  const [showVideo, setShowVideo] = useState(false);
  const [ref, inView] = useInView(0.1);

  return (
    <section id="preview" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-6">
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">ASync, in the hands of your campus</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">Real screens from ASync show how students stay on top of their work and teachers keep courses moving.</p>
        </div>

        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-16 items-center mb-16">
          <div className="space-y-5">
            <h3 className="text-2xl font-semibold text-white">One place for the everyday academic loop</h3>
            <p className="text-slate-400 leading-relaxed">From the morning dashboard to an uploaded course note, every interaction is designed to reduce the mental overhead of keeping up with college.</p>
            <ul className="space-y-4">
              {highlights.map(({ Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center shrink-0"><Icon className="text-blue-400" size={18} /></div>
                  <span className="text-slate-300 pt-1.5">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <ScreenGallery title="For students" description="See deadlines, assignments, and notes without jumping between tools." screens={studentScreens} />
        </div>

        <ScreenGallery title="For teachers" description="Publish resources and manage the course work students rely on." screens={teacherScreens} />

        <div className="text-center mt-20 mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Watch the Demo</h3>
          <p className="text-slate-400">See the full app walkthrough</p>
        </div>

        <div className="relative max-w-5xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-blue-500/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur flex items-center justify-center transition-all duration-500">
          {!showVideo ? (
            <button onClick={() => setShowVideo(true)} className="text-center cursor-pointer group" aria-label="Play demo video">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"><Play className="text-blue-400 ml-0.5" size={40} /></div>
              <p className="text-slate-400 text-lg">Showcasing ASync</p>
              <p className="text-blue-400 mt-2 text-sm opacity-80">Click to watch demo</p>
            </button>
          ) : (
            <iframe src="https://drive.google.com/file/d/1DWEfB8W5igEUpIqNDGv97bxKVqlaRhlA/preview" allow="autoplay; encrypted-media" allowFullScreen className="w-full h-full border-0" title="ASync App Demo" />
          )}
        </div>
      </div>
    </section>
  );
}

export default PreviewSection;
