import { X } from "lucide-react";

function MobileMenu({ isOpen, onClose }) {
  const handleNavClick = (e, href) => {
    e.preventDefault();
    onClose();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-slate-900/95 backdrop-blur-xl border-l border-blue-500/20 z-50 transform transition-transform duration-300 ease-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-6">
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col px-6 space-y-5">
          <button
            onClick={(e) => handleNavClick(e, "#features")}
            className="text-left text-xl text-slate-300 hover:text-blue-400 transition-colors font-medium"
          >
            Features
          </button>
          <button
            onClick={(e) => handleNavClick(e, "#preview")}
            className="text-left text-xl text-slate-300 hover:text-blue-400 transition-colors font-medium"
          >
            Preview
          </button>
          <button
            onClick={(e) => handleNavClick(e, "#faq")}
            className="text-left text-xl text-slate-300 hover:text-blue-400 transition-colors font-medium"
          >
            FAQ
          </button>
          <a
            href="https://github.com/Naren456/Async/releases/tag/android"
            className="mt-4 block px-5 py-3 rounded-xl text-center font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200"
          >
            Download
          </a>
        </nav>
      </div>
    </>
  );
}

export default MobileMenu;
