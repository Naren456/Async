import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useInView } from "../hooks/useInView";

const faqs = [
  {
    q: "What is ASync?",
    a: "ASync is a comprehensive academic management app designed for both students and teachers. It helps track assignments, manage notes, organize subjects, and never miss deadlines.",
  },
  {
    q: "Is ASync free?",
    a: "Yes! ASync is completely free to use. Download the app and start organizing your academic life today.",
  },
  {
    q: "Who is ASync for?",
    a: "ASync is built for both students and teachers. Students can track assignments and access notes, while teachers have powerful admin tools to manage subjects, upload notes, and monitor progress.",
  },
  {
    q: "What platforms does ASync support?",
    a: "ASync is currently available on Android. An iOS version and web platform are in development for expanded access.",
  },
  {
    q: "How do I get started?",
    a: "Simply download the app, sign up with your email or Google account, and you're ready to go. Students and teachers will see tailored interfaces based on their role.",
  },
  {
    q: "Can teachers manage multiple subjects?",
    a: "Absolutely. Teachers have access to a dedicated admin dashboard where they can manage subjects, upload notes, create assignments, and view student statistics.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [ref, inView] = useInView(0.1);

  return (
    <section id="faq" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Got Questions?
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Everything you need to know about ASync
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="group rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer"
                aria-expanded={openIndex === i}
              >
                <span className="text-base md:text-lg font-medium text-white group-hover:text-blue-400 transition-colors pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`text-slate-400 shrink-0 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  size={20}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-5 md:px-6 pb-5 md:pb-6 text-slate-400 leading-relaxed text-sm md:text-base">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
