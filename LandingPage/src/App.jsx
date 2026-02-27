import React from "react";
import {
  BookOpenCheck,
  ClipboardList,
  BookOpen,
  Home,
  Shield,
  Users,
  Play,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import PreviewSection from "./components/PreviewSection";
import FeatureCard from "./components/FeatureCard";
function App() {
  return (
    <div className="font-sans bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-slate-100 antialiased">
      {/* Header */}
      <header className="py-5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 border-b border-blue-500/20">
        <nav className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
              <BookOpen className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ASync
            </span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-slate-300 hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              Features
            </a>
            <a
              href="#preview"
              className="text-slate-300 hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              Preview
            </a>
            <a
              href="https://github.com/Naren456/Async/releases/tag/android"
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 hover:scale-105"
            >
              Download
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-40 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Master Your
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Academic Workflow
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            The sleek, intuitive app for students and teachers. Track
            assignments, manage notes, and never miss a deadline — all in one
            organized place.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <a
              href="https://github.com/Naren456/Async/releases/tag/android"
              className="group px-8 py-4 rounded-xl font-semibold text-lg inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
            >
              Download ASync
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
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
            />
            <FeatureCard
              Icon={BookOpenCheck}
              title="Notes, Ready When You Are"
              desc="Access your notes anytime. Filter easily by semester and term."
              color="cyan"
            />
            <FeatureCard
              Icon={Home}
              title="At-a-Glance Dashboard"
              desc="Your personalized home screen shows key stats and upcoming deadlines instantly."
              color="purple"
            />
            <FeatureCard
              Icon={Shield}
              title="Powerful Admin Tools"
              desc="Manage subjects, upload notes, track assignments, and view user statistics efficiently."
              color="green"
            />
            <FeatureCard
              Icon={Users}
              title="Tailored Experience"
              desc="Distinct interfaces optimized for both Students and Teachers."
              color="pink"
            />
            <FeatureCard
              Icon={CheckCircle2}
              title="Never Miss a Deadline"
              desc="Smart notifications and reminders keep you ahead of schedule."
              color="orange"
            />
          </div>
        </div>
      </section>

      {/* Demo / Preview Section */}
      <section id="preview">
        <PreviewSection />
      </section>

      {/* Footer */}
      <footer
        id="download"
        className="py-20 md:py-32 relative border-t border-blue-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/30 to-transparent"></div>

        <div className="text-center pt-12 border-t border-slate-800">
          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm text-slate-400">
            <a href="#" className="hover:text-blue-400 transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Terms of Service
            </a>
            <span>•</span>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Contact
            </a>
          </div>
          <p className="text-sm text-slate-500">
            &copy; 2025 ASync. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}



export default App;
