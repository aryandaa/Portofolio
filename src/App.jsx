import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  ChevronUp,
  Code2,
  Command,
  FileSearch,
  Github,
  Images,
  Instagram,
  Linkedin,
  Mail,
  Menu,
  ShieldCheck,
  Sparkles,
  Terminal,
  User,
  X,
} from "lucide-react";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import CertificationsPage from "./pages/CertificationsPage.jsx";
import AwardsPage from "./pages/AwardsPage.jsx";
import BooksPage from "./pages/BooksPage.jsx";
import ExperiencePage from "./pages/ExperiencePage.jsx";
import ResearchPage from "./pages/ResearchPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ToastProvider, useToast } from "./context/ToastContext.jsx";
import { profile } from "./data/profile.js";

const pages = [
  { id: "profile", label: "Profile", keyNum: "1", icon: User, component: ProfilePage },
  { id: "projects", label: "Projects", keyNum: "2", icon: Code2, component: ProjectsPage },
  { id: "experience", label: "Experience", keyNum: "3", icon: BriefcaseBusiness, component: ExperiencePage },
  { id: "certifications", label: "Certs", keyNum: "4", icon: ShieldCheck, component: CertificationsPage },
  { id: "awards", label: "Awards", keyNum: "5", icon: Award, component: AwardsPage },
  { id: "books", label: "Books", keyNum: "6", icon: BookOpen, component: BooksPage },
  { id: "gallery", label: "Gallery", keyNum: "7", icon: Images, component: GalleryPage },
  { id: "research", label: "Research", keyNum: "8", icon: FileSearch, component: ResearchPage },
];

function getInitialPage() {
  const hash = window.location.hash.replace("#", "");
  return pages.some((page) => page.id === hash) ? hash : "profile";
}

function PortfolioContent() {
  const [activePage, setActivePage] = useState(getInitialPage);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const syncHash = () => {
      setActivePage(getInitialPage());
      setMobileMenuOpen(false);
    };
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Keyboard shortcut listener (Keys 1-8 for rapid page jumping)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= pages.length) {
        const targetPage = pages[num - 1];
        navigate(targetPage.id);
        showToast(`Navigated to ${targetPage.label} [${num}]`);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showToast]);

  const ActiveComponent = useMemo(
    () => pages.find((page) => page.id === activePage)?.component ?? ProfilePage,
    [activePage],
  );

  const navigate = (pageId) => {
    setMobileMenuOpen(false);
    if (pageId === activePage) return;
    window.location.hash = pageId;
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tickerItems = [
    { text: "M. ARYANDA SANGGADIENNATA", target: "profile" },
    { text: "POLIBAN D3 INFORMATION SYSTEMS (GPA 3.90)", target: "profile" },
    { text: "FULL-STACK WEB DEVELOPER", target: "projects" },
    { text: "CYBERSECURITY RESEARCHER", target: "research" },
    { text: "CODELEARN 500+ NOTES", target: "projects" },
    { text: "PT BANUA SOLUSI SIBER INTERNSHIP", target: "experience" },
    { text: "CISCO & FORTINET CERTIFIED", target: "certifications" },
    { text: "NATIONAL CTF FINALIST", target: "awards" },
  ];

  return (
    <div className="min-h-[100dvh] bg-neo-bg text-black transition-colors duration-200 dark:bg-neo-darkbg dark:text-white flex flex-col justify-between">
      {/* Top Interactive Neobrutalist Marquee Ticker */}
      <div className="group relative overflow-hidden border-b-[3px] border-black bg-neo-green py-2 font-black tracking-wider text-black dark:border-white dark:bg-neo-yellow dark:text-black">
        <div className="neo-ticker-track flex gap-8 text-xs uppercase sm:text-sm group-hover:[animation-play-state:paused]">
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => navigate(item.target)}
              className="flex items-center gap-3 whitespace-nowrap cursor-pointer hover:underline"
            >
              <span className="text-neo-forest dark:text-black">✦</span>
              <span>{item.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Neobrutalist Header */}
      <header className="sticky top-0 z-40 border-b-[3px] border-black bg-white dark:border-white dark:bg-neo-darkcard">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 sm:px-4 lg:px-6 py-2">
          {/* Mobile / Tablet View (< lg): Active Page Indicator Badge */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="neo-btn rounded-xl bg-neo-yellow px-3 py-1.5 text-xs font-black uppercase text-black flex items-center gap-2"
              aria-label="Toggle navigation drawer"
            >
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span>{pages.find((p) => p.id === activePage)?.label || "Menu"}</span>
              <span className="font-mono text-[10px] bg-black text-white px-1 py-0.2 rounded">
                [{pages.find((p) => p.id === activePage)?.keyNum}]
              </span>
            </button>
          </div>

          {/* Desktop Navigation Menu Buttons (lg:flex) */}
          <nav className="hidden lg:flex flex-1 items-center justify-start gap-1 xl:gap-2 overflow-x-auto py-1 scrollbar-none" aria-label="Main Navigation">
            {pages.map(({ id, label, keyNum, icon: Icon }) => {
              const isActive = activePage === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => navigate(id)}
                  title={`Press ${keyNum} to jump to ${label}`}
                  className={`neo-btn shrink-0 flex items-center gap-1.5 rounded-xl px-2.5 xl:px-3 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all duration-150 ${
                    isActive
                      ? "bg-neo-yellow text-black shadow-brutal-sm dark:bg-neo-yellow dark:text-black dark:border-white"
                      : "bg-white text-black hover:bg-neo-palegreen dark:bg-[#1f2430] dark:text-white dark:hover:bg-[#2c3444]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
                  <span>{label}</span>
                  <span className={`text-[10px] px-1 py-0.2 rounded border font-mono ${isActive ? "bg-black text-white border-black" : "bg-black/5 dark:bg-white/10 border-black/20 dark:border-white/20 text-slate-500 dark:text-slate-400"}`}>
                    {keyNum}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Theme Toggle & Hamburger on Mobile */}
          <div className="flex shrink-0 items-center gap-2 pl-1 sm:pl-2">
            <ThemeToggle />

            {/* Mobile / Tablet Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden neo-btn rounded-xl bg-white p-2 text-black hover:bg-neo-yellow dark:bg-[#181b24] dark:text-white dark:hover:bg-neo-yellow dark:hover:text-black transition-colors"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 stroke-[2.5]" />
              ) : (
                <Menu className="h-5 w-5 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Drawer */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 top-[52px] bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <div className="absolute top-full left-0 right-0 z-50 border-b-[3px] border-black bg-white p-4 sm:p-5 shadow-brutal-lg dark:border-white dark:bg-[#181b24] lg:hidden animate-in fade-in slide-in-from-top-2 duration-150 max-h-[calc(100vh-100px)] overflow-y-auto">
              <div className="flex items-center justify-between border-b-2 border-black/10 pb-2.5 mb-3.5 dark:border-white/20">
                <span className="font-mono text-xs font-black uppercase text-black dark:text-neo-yellow flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  <span>Navigation Directory</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  TAP OR PRESS 1-8
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {pages.map(({ id, label, keyNum, icon: Icon }) => {
                  const isActive = activePage === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => navigate(id)}
                      className={`neo-btn flex items-center justify-between rounded-2xl p-3 text-xs font-black uppercase transition-all ${
                        isActive
                          ? "bg-neo-yellow text-black shadow-brutal-sm dark:bg-neo-yellow dark:text-black dark:border-white"
                          : "bg-slate-50 text-black hover:bg-neo-palegreen dark:bg-[#202533] dark:text-white dark:hover:bg-[#2a3042]"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon className="h-4 w-4 stroke-[2.5] shrink-0" />
                        <span className="truncate">{label}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${isActive ? "bg-black text-white border-black" : "bg-black/5 dark:bg-white/10 border-black/20 dark:border-white/20 text-slate-600 dark:text-slate-300"}`}>
                        {keyNum}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/20 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                <span>© {new Date().getFullYear()} {profile.name}</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-black text-neo-forest dark:text-neo-yellow uppercase"
                >
                  Close ✕
                </button>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Main Dynamic View Content */}
      <main className="flex-1 py-5 sm:py-8 lg:py-10">
        <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
          <ActiveComponent navigate={navigate} />
        </div>
      </main>

      {/* Floating Bottom Action Dock */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="neo-btn fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-2xl bg-neo-yellow text-black shadow-brutal hover:bg-yellow-300 dark:bg-neo-yellow dark:text-black dark:border-white"
          aria-label="Scroll to top of page"
          title="Back to Top"
        >
          <ChevronUp className="h-6 w-6 stroke-[3]" />
        </button>
      )}

      {/* Neobrutalist Footer */}
      <footer className="border-t-[3px] border-black bg-white dark:border-white dark:bg-neo-darkcard">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Col 1: Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="neo-btn rounded-xl bg-neo-green px-3 py-2 text-base font-black text-black dark:bg-neo-sky dark:text-black">
                  AS
                </div>
                <span className="font-display text-xl font-black uppercase text-black dark:text-white">
                  {profile.name}
                </span>
              </div>
              <p className="text-xs font-bold leading-relaxed text-black dark:text-slate-300">
                {profile.tagline}
              </p>
              <div className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-neo-green/30 px-3 py-1 text-xs font-black uppercase text-black dark:border-white dark:bg-[#202533] dark:text-neo-yellow">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Available for Roles & Projects
              </div>
            </div>

            {/* Col 2: Fast Track Links */}
            <div>
              <h4 className="font-display text-sm font-black uppercase text-black dark:text-white mb-4 border-b-2 border-black pb-1 dark:border-white/30">
                Fast Navigation [1-8]
              </h4>
              <ul className="space-y-2 text-xs font-bold">
                {pages.slice(0, 4).map((page) => (
                  <li key={page.id}>
                    <button
                      type="button"
                      onClick={() => navigate(page.id)}
                      className="hover:underline text-black dark:text-slate-300 hover:text-neo-forest dark:hover:text-neo-yellow"
                    >
                      → {page.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Competencies */}
            <div>
              <h4 className="font-display text-sm font-black uppercase text-black dark:text-white mb-4 border-b-2 border-black pb-1 dark:border-white/30">
                Core Domains
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {["Cybersecurity", "React & Vite", "Node.js", "Laravel", "CTF / Forensics", "Vulnerability Research"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="neo-badge rounded-md bg-neo-cream text-[11px] text-black dark:bg-[#202533] dark:text-slate-200 dark:border-white/40"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </div>

            {/* Col 4: Social Contacts */}
            <div className="space-y-4">
              <h4 className="font-display text-sm font-black uppercase text-black dark:text-white border-b-2 border-black pb-1 dark:border-white/30">
                Connect Directly
              </h4>
              <div className="flex flex-wrap gap-2">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="neo-btn rounded-xl bg-neo-yellow p-2.5 text-black hover:bg-yellow-300 dark:bg-neo-yellow dark:text-black"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4 stroke-[2.5]" />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="neo-btn rounded-xl bg-neo-sky p-2.5 text-black hover:bg-sky-300 dark:bg-neo-sky dark:text-black"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4 stroke-[2.5]" />
                </a>
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="neo-btn rounded-xl bg-neo-rose p-2.5 text-black hover:bg-rose-300 dark:bg-neo-rose dark:text-black"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4 stroke-[2.5]" />
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="neo-btn rounded-xl bg-neo-green p-2.5 text-black hover:bg-emerald-300 dark:bg-neo-green dark:text-black"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4 stroke-[2.5]" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t-[2.5px] border-black pt-6 text-center text-xs font-black uppercase tracking-wider text-black dark:border-white dark:text-slate-400">
            © {new Date().getFullYear()} {profile.name}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <PortfolioContent />
      </ToastProvider>
    </ThemeProvider>
  );
}
