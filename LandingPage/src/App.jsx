import { useState, useEffect } from "react";
import {
  BookOpenCheck,
  ClipboardList,
  BookOpen,
  Home,
  Shield,
  Users,
  CheckCircle2,
  ArrowRight,
  Menu,
  ArrowUp,
  Smartphone,
  Download,
  GraduationCap,
} from "lucide-react";
import { useInView } from "./hooks/useInView";
import PreviewSection from "./components/PreviewSection";
import FeatureCard from "./components/FeatureCard";
import MobileMenu from "./components/MobileMenu";
import StatsSection from "./components/StatsSection";
import FAQ from "./components/FAQ";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [heroRef, heroInView] = useInView(0.1);
  const [featuresHeaderRef, featuresHeaderInView] = useInView(0.1);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="font-sans bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-slate-100 antialiased min-h-screen">
      {/* Header */}
      <header className="py-4 bg-slate-900/60 backdrop-blur-lg sticky top-0 z-50 border-b border-blue-500/20">
        <nav className="container mx-auto px-6 flex justify-between items-center">
          <a href="#" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-shadow">
              <BookOpen className="text-white" size={22} />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ASync
            </span>
          </a>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-slate-300 hover:text-blue-400 transition-colors duration-200 font-medium text-sm"
            >
              Features
            </a>
            <a
              href="#preview"
              className="text-slate-300 hover:text-blue-400 transition-colors duration-200 font-medium text-sm"
            >
              Preview
            </a>
            <a
              href="#faq"
              className="text-slate-300 hover:text-blue-400 transition-colors duration-200 font-medium text-sm"
            >
              FAQ
            </a>
            <a
              href="https://github.com/Naren456/Async/releases/tag/android"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 hover:scale-105"
            >
              Download
            </a>
          </div>
          <button
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </nav>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Hero Section */}
      <section className="relative py-16 md:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)]" />
        </div>

        <div
          ref={heroRef}
          className="container mx-auto px-6 relative z-10"
        >
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div
              className={`flex-1 text-center lg:text-left transition-all duration-1000 ${
                heroInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                <GraduationCap size={16} />
                Built for Students &amp; Teachers
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                Master Your
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Academic Workflow
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-300 max-w-xl mb-10 leading-relaxed">
                The sleek, intuitive app for students and teachers. Track
                assignments, manage notes, and never miss a deadline — all in
                one organized place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="https://github.com/Naren456/Async/releases/tag/android"
                  className="group px-8 py-4 rounded-xl font-semibold text-base inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
                >
                  <Download className="mr-2" size={20} />
                  Download ASync
                  <ArrowRight
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                    size={18}
                  />
                </a>
                <a
                  href="#preview"
                  className="group px-8 py-4 rounded-xl font-semibold text-base inline-flex items-center justify-center border border-slate-600 text-slate-300 hover:border-blue-500/50 hover:text-white transition-all duration-300"
                >
                  <Smartphone className="mr-2" size={20} />
                  See Preview
                </a>
              </div>
            </div>

            <div
              className={`flex-1 flex justify-center transition-all duration-1000 delay-300 ${
                heroInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              <div className="relative w-56 sm:w-64 h-[460px] sm:h-[520px] rounded-[3rem] border-4 border-slate-600 bg-slate-900 shadow-2xl shadow-blue-500/10 shrink-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-800 rounded-b-2xl z-10" />
                <div className="h-full w-full rounded-[2.6rem] overflow-hidden">
                  <img
                    src="https://github.com/user-attachments/assets/3a525388-579a-492a-819f-589a50d67ca4"
                    alt="ASync Dashboard Screenshot"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 relative">
        <div className="container mx-auto px-6">
          <div
            ref={featuresHeaderRef}
            className={`text-center mb-16 transition-all duration-700 ${
              featuresHeaderInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Organized Power,
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Beautifully Designed
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Everything you need to stay on top of your academic life, crafted
              with care
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              Icon={ClipboardList}
              title="Assignments on Autopilot"
              desc="See all assignments clearly grouped by due date. Teachers can easily manage tasks too."
              color="blue"
              index={0}
            />
            <FeatureCard
              Icon={BookOpenCheck}
              title="Notes, Ready When You Are"
              desc="Access your notes anytime. Filter easily by semester and term."
              color="cyan"
              index={1}
            />
            <FeatureCard
              Icon={Home}
              title="At-a-Glance Dashboard"
              desc="Your personalized home screen shows key stats and upcoming deadlines instantly."
              color="purple"
              index={2}
            />
            <FeatureCard
              Icon={Shield}
              title="Powerful Admin Tools"
              desc="Manage subjects, upload notes, track assignments, and view user statistics efficiently."
              color="green"
              index={3}
            />
            <FeatureCard
              Icon={Users}
              title="Tailored Experience"
              desc="Distinct interfaces optimized for both Students and Teachers."
              color="pink"
              index={4}
            />
            <FeatureCard
              Icon={CheckCircle2}
              title="Never Miss a Deadline"
              desc="Smart notifications and reminders keep you ahead of schedule."
              color="orange"
              index={5}
            />
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <PreviewSection />

      {/* FAQ Section */}
      <FAQ />

      {/* Download CTA Banner */}
      <section className="py-20 md:py-32 relative border-t border-blue-500/20">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/30 to-transparent" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of students and teachers already using ASync to
            simplify their academic life
          </p>
          <a
            href="https://github.com/Naren456/Async/releases/tag/android"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-xl font-semibold text-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
          >
            <Download size={22} />
            Download ASync Free
            <ArrowRight
              className="group-hover:translate-x-1 transition-transform"
              size={20}
            />
          </a>
          <p className="text-slate-500 text-sm mt-4">
            Available on Android. iOS &amp; Web coming soon.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-blue-500/20 bg-slate-900/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                  <BookOpen className="text-white" size={20} />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  ASync
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                The sleek, intuitive app for students and teachers to manage
                academic life.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#preview"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Preview
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="hover:text-blue-400 transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            &copy; 2025 ASync. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-110 ${
          showBackToTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
}

export default App;
