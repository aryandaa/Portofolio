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
  ShieldCheck,
  Sparkles,
  User,
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
  const { showToast } = useToast();

  useEffect(() => {
    const syncHash = () => setActivePage(getInitialPage());
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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-3 px-2 sm:px-4 lg:px-6">
          {/* Main Navigation Menu Buttons */}
          <nav className="flex flex-1 items-center justify-start gap-1 sm:gap-1.5 xl:gap-2 overflow-x-auto py-1 scrollbar-none" aria-label="Main Navigation">
            {pages.map(({ id, label, keyNum, icon: Icon }) => {
              const isActive = activePage === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => navigate(id)}
                  title={`Press ${keyNum} to jump to ${label}`}
                  className={`neo-btn shrink-0 flex items-center gap-1.5 rounded-xl px-2 sm:px-2.5 xl:px-3 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all duration-150 ${
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

          {/* Right Controls: Theme Toggle */}
          <div className="flex shrink-0 items-center pl-1 sm:pl-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Dynamic View Content */}
      <main className="flex-1 py-6 sm:py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
