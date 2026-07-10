import { useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  BookOpen,
  Cpu,
  BriefcaseBusiness,
  ChevronUp,
  FileSearch,
  Home,
  IdCard,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import CertificationsPage from "./pages/CertificationsPage.jsx";
import AwardsPage from "./pages/AwardsPage.jsx";
import BooksPage from "./pages/BooksPage.jsx";
import ExperiencePage from "./pages/ExperiencePage.jsx";
import ResearchPage from "./pages/ResearchPage.jsx";
import CyberCursor from "./components/CyberCursor.jsx";
import CodeRain from "./components/CodeRain.jsx";

const pages = [
  { id: "profile", label: "Profile", icon: Home, component: ProfilePage },
  { id: "experience", label: "Experience", icon: BriefcaseBusiness, component: ExperiencePage },
  { id: "projects", label: "Technical Project", icon: Cpu, component: ProjectsPage },
  { id: "certifications", label: "Certifications", icon: IdCard, component: CertificationsPage },
  { id: "awards", label: "Awards", icon: Award, component: AwardsPage },
  { id: "research", label: "Research", icon: FileSearch, component: ResearchPage },
  { id: "books", label: "Books Read", icon: BookOpen, component: BooksPage },
];

function getInitialPage() {
  const hash = window.location.hash.replace("#", "");
  return pages.some((page) => page.id === hash) ? hash : "profile";
}

export default function App() {
  const [activePage, setActivePage] = useState(getInitialPage);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPageSwitching, setIsPageSwitching] = useState(false);
  const [scrollState, setScrollState] = useState({ progress: 0, isScrollable: false });
  const didMount = useRef(false);

  useEffect(() => {
    const syncHash = () => setActivePage(getInitialPage());
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return undefined;
    }

    setIsPageSwitching(true);
    const timeoutId = window.setTimeout(() => setIsPageSwitching(false), 620);

    return () => window.clearTimeout(timeoutId);
  }, [activePage]);

  useEffect(() => {
    const updateScrollState = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const isScrollable = maxScroll > 80;
      const progress = isScrollable ? Math.min(window.scrollY / maxScroll, 1) : 0;

      setScrollState({ progress, isScrollable });
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [activePage]);

  const ActiveComponent = useMemo(
    () => pages.find((page) => page.id === activePage)?.component ?? ProfilePage,
    [activePage],
  );

  const navigate = (pageId) => {
    if (pageId === activePage) {
      setIsMenuOpen(false);
      return;
    }

    window.location.hash = pageId;
    setActivePage(pageId);
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-void text-ink antialiased">
      <CyberCursor />
      <div className="fixed inset-0 -z-20 bg-[url('/assets/cyberpunk-hero.png')] bg-cover bg-center opacity-28" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,.25),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(255,46,99,.18),transparent_24%),linear-gradient(135deg,rgba(7,9,20,.9),rgba(10,15,35,.76)_48%,rgba(7,9,20,.92))]" />
      <CodeRain />
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid bg-[length:56px_56px] opacity-18" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-scanline bg-[length:100%_4px] opacity-15" />
      {scrollState.isScrollable ? (
        <div
          className="pointer-events-none fixed left-2 top-1/2 z-20 flex -translate-y-1/2 items-center gap-2 sm:left-3 lg:hidden"
          aria-hidden="true"
        >
          <div className="relative h-44 w-1 overflow-hidden border border-cyan/40 bg-void/70 shadow-[0_0_18px_rgba(34,211,238,0.22)] backdrop-blur">
            <div
              className="absolute left-0 top-0 w-full bg-gradient-to-b from-cyan via-plasma to-danger shadow-[0_0_16px_rgba(34,211,238,0.65)]"
              style={{ height: `${Math.max(scrollState.progress * 100, 8)}%` }}
            />
            <div className="absolute inset-x-[-3px] top-1/3 h-px bg-cyan/70 shadow-neon" />
            <div className="absolute inset-x-[-3px] top-2/3 h-px bg-plasma/70 shadow-[0_0_14px_rgba(255,46,109,0.45)]" />
          </div>
          <div className="grid gap-2">
            <span className="h-1.5 w-1.5 bg-cyan shadow-neon" />
            <span className="h-1.5 w-1.5 bg-plasma shadow-[0_0_12px_rgba(255,46,109,0.75)]" />
            <span className="h-1.5 w-1.5 bg-cyan/70 shadow-neon" />
          </div>
        </div>
      ) : null}
      {scrollState.isScrollable && scrollState.progress > 0.08 ? (
        <button
          type="button"
          onClick={scrollToTop}
          className="interactive-chip fixed bottom-5 right-5 z-30 grid h-12 w-12 place-items-center border border-cyan/50 bg-void/80 text-cyan shadow-[0_0_22px_rgba(34,211,238,0.28)] backdrop-blur transition hover:border-plasma hover:text-white hover:shadow-[0_0_28px_rgba(255,46,109,0.28)] sm:bottom-6 sm:right-6"
          aria-label="Back to top"
        >
          <ChevronUp className="h-5 w-5" aria-hidden="true" />
          <span className="absolute inset-1 border border-plasma/20" aria-hidden="true" />
        </button>
      ) : null}
      <div
        className={`page-switch-overlay pointer-events-none fixed inset-0 z-40 ${
          isPageSwitching ? "is-active" : ""
        }`}
        aria-hidden="true"
      >
        <div className="page-switch-beam" />
        <div className="page-switch-noise" />
        <div className="page-switch-grid" />
      </div>

      <header className="sticky top-0 z-30 border-b border-cyan/20 bg-void/75 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("profile")}
            className="group flex items-center gap-3 text-left transition hover:-translate-y-0.5"
          >
            <span className="interactive-chip grid h-11 w-11 place-items-center border border-cyan/40 bg-cyan/10 shadow-neon">
              <Sparkles className="h-5 w-5 text-cyan" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-display text-sm uppercase tracking-[0.28em] text-cyan">
                Portfolio Aryanda
              </span>
            </span>
          </button>

          <button
            type="button"
            className="interactive-chip grid h-11 w-11 place-items-center border border-plasma/40 bg-plasma/10 text-plasma lg:hidden"
            onClick={() => setIsMenuOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="hidden items-center gap-2 lg:flex">
            {pages.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => navigate(id)}
                className={`interactive-chip group flex items-center gap-2 border px-4 py-2 text-sm transition ${
                  activePage === id
                    ? "border-cyan bg-cyan/15 text-white shadow-neon"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-plasma/70 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </nav>

        {isMenuOpen && (
          <div className="border-t border-white/10 bg-night/95 px-4 py-4 lg:hidden">
            <div className="grid gap-2">
              {pages.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => navigate(id)}
                  className={`interactive-chip flex items-center gap-3 border px-4 py-3 text-left text-sm ${
                    activePage === id
                      ? "border-cyan bg-cyan/15 text-white"
                      : "border-white/10 bg-white/5 text-slate-300"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 mx-auto min-h-[calc(100vh-77px)] max-w-[1800px] px-4 py-8 sm:px-6 lg:px-8">
        <div key={activePage} className="page-enter">
          <ActiveComponent navigate={navigate} />
        </div>
      </main>
    </div>
  );
}
