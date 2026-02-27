import { useState } from "react";
import { Play } from "lucide-react";

function PreviewSection() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section id="preview" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore the ASync Interface
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Experience the clarity and focus of ASync&apos;s dark theme
          </p>
        </div>

        {/* Combined Thumbnail + Video */}
        <div className="relative max-w-5xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-blue-500/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur flex items-center justify-center transition-all duration-500">
          {!showVideo ? (
            <div
              onClick={() => setShowVideo(true)}
              className="text-center cursor-pointer group"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play className="text-blue-400" size={40} />
              </div>
              <p className="text-slate-400 text-lg">
             Showcasing Async
              </p>
              <p className="text-blue-400 mt-2 text-sm opacity-80">
                Click to watch demo
              </p>
            </div>
          ) : (
            <iframe
              src="https://drive.google.com/file/d/1DWEfB8W5igEUpIqNDGv97bxKVqlaRhlA/preview"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full border-0"
              title="ASync App Demo"
            ></iframe>
          )}
        </div>

       
      </div>
    </section>
  );
}

export default PreviewSection;
