import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Cpu,
  BriefcaseBusiness,
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
import CyberCursor from "./components/CyberCursor.jsx";
import CodeRain from "./components/CodeRain.jsx";

const pages = [
  { id: "profile", label: "Profile", icon: Home, component: ProfilePage },
  { id: "experience", label: "Experience", icon: BriefcaseBusiness, component: ExperiencePage },
  { id: "projects", label: "Technical Project", icon: Cpu, component: ProjectsPage },
  { id: "certifications", label: "Certifications", icon: IdCard, component: CertificationsPage },
  { id: "awards", label: "Awards", icon: Award, component: AwardsPage },
  { id: "books", label: "Books Read", icon: BookOpen, component: BooksPage },
];

function getInitialPage() {
  const hash = window.location.hash.replace("#", "");
  return pages.some((page) => page.id === hash) ? hash : "profile";
}

export default function App() {
  const [activePage, setActivePage] = useState(getInitialPage);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const syncHash = () => setActivePage(getInitialPage());
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const ActiveComponent = useMemo(
    () => pages.find((page) => page.id === activePage)?.component ?? ProfilePage,
    [activePage],
  );

  const navigate = (pageId) => {
    window.location.hash = pageId;
    setActivePage(pageId);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-void text-ink antialiased">
      <CyberCursor />
      <div className="fixed inset-0 -z-20 bg-[url('/assets/cyberpunk-hero.png')] bg-cover bg-center opacity-28" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,.25),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(255,46,99,.18),transparent_24%),linear-gradient(135deg,rgba(7,9,20,.9),rgba(10,15,35,.76)_48%,rgba(7,9,20,.92))]" />
      <CodeRain />
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid bg-[length:56px_56px] opacity-18" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-scanline bg-[length:100%_4px] opacity-15" />

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
                Portfolio
              </span>
              <span className="block text-xs text-slate-300">Cyber profile grid</span>
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
        <ActiveComponent navigate={navigate} />
      </main>
    </div>
  );
}
