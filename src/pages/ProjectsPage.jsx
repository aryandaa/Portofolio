import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Code2,
  Copy,
  Cpu,
  ExternalLink as ExternalLinkIcon,
  Filter,
  FolderGit2,
  Grid,
  Layers,
  List,
  Search,
  Sparkles,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { technicalProjects } from "../data/projects.js";
import ExternalLink from "../components/ExternalLink.jsx";
import PageShell from "../components/PageShell.jsx";
import PartnerList from "../components/PartnerList.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("bento"); // 'bento' | 'matrix'
  const [cardTabs, setCardTabs] = useState({}); // { [projectName]: 'overview' | 'features' }
  const { showToast } = useToast();

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    if (selectedProject) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`);
  };

  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return technicalProjects;
    return technicalProjects.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.institution.toLowerCase().includes(q) ||
        (p.stack && p.stack.some((s) => s.toLowerCase().includes(q))) ||
        (p.features && p.features.some((f) => f.toLowerCase().includes(q)))
      );
    });
  }, [searchQuery]);

  const setCardTab = (name, tab) => {
    setCardTabs((prev) => ({ ...prev, [name]: tab }));
  };

  return (
    <>
      <PageShell title="Projects">
        {/* Interactive Filter & View Control Desk */}
        <div className="neo-box rounded-3xl bg-white p-5 sm:p-6 mb-8 dark:bg-neo-darkcard dark:border-white">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 stroke-[2.5] text-black dark:text-neo-yellow" />
              <input
                type="text"
                placeholder="Search projects by title, stack (e.g. React, PHP, Figma), or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border-2 border-black bg-neo-bg py-3 pl-12 pr-4 text-sm font-bold text-black placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-black dark:border-white dark:bg-[#121620] dark:text-white dark:placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg bg-black p-1 text-white hover:bg-slate-800 dark:bg-white dark:text-black"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("bento")}
                className={`neo-btn flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black uppercase ${
                  viewMode === "bento"
                    ? "bg-neo-yellow text-black dark:bg-neo-yellow dark:text-black dark:border-white"
                    : "bg-white text-black dark:bg-[#181b24] dark:text-white"
                }`}
              >
                <Grid className="h-4 w-4" />
                <span>Bento</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("matrix")}
                className={`neo-btn flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black uppercase ${
                  viewMode === "matrix"
                    ? "bg-neo-yellow text-black dark:bg-neo-yellow dark:text-black dark:border-white"
                    : "bg-white text-black dark:bg-[#181b24] dark:text-white"
                }`}
              >
                <List className="h-4 w-4" />
                <span>Matrix</span>
              </button>
            </div>
          </div>
        </div>

        {/* Empty Search Result */}
        {filteredProjects.length === 0 && (
          <div className="neo-box rounded-3xl bg-white p-12 text-center dark:bg-neo-darkcard dark:border-white">
            <p className="font-display text-xl font-black uppercase text-black dark:text-white">
              No matching projects found
            </p>
            <p className="mt-2 text-xs font-bold text-slate-600 dark:text-slate-400">
              Try searching for "React", "Obsidian", "Figma", or reset your filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-5 neo-btn rounded-xl bg-neo-yellow px-4 py-2 text-xs font-black uppercase text-black"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* View Mode 1: Bento Showcase */}
        {viewMode === "bento" && filteredProjects.length > 0 && (
          <div className="space-y-8">
            {/* FEATURED CAPSTONE HERO BENTO (CodeLearn) if visible in filter */}
            {filteredProjects.some((p) => p.name === "CodeLearn") && (
              (() => {
                const codelearn = technicalProjects.find((p) => p.name === "CodeLearn");
                const currentTab = cardTabs[codelearn.name] || "overview";
                return (
                  <div className="neo-box rounded-3xl border-[3px] border-black bg-neo-green/30 p-6 sm:p-10 dark:border-white dark:bg-[#182030] shadow-brutal-lg">
                    {/* Top Ribbon */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b-[2.5px] border-black pb-4 dark:border-white">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="neo-badge rounded-lg bg-neo-yellow text-black font-black">
                          ★ SIGNATURE CAPSTONE SYSTEM
                        </span>
                        <span className="neo-badge rounded-lg bg-neo-rose text-black font-black">
                          100% CLIENT-SIDE RUNTIME
                        </span>
                        <span className="neo-badge rounded-lg bg-white text-black font-mono text-xs dark:bg-black dark:text-white">
                          {codelearn.period}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {codelearn.projectUrl && (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(codelearn.projectUrl, "Live URL")}
                            className="neo-btn rounded-xl bg-white px-2.5 py-1.5 text-xs font-black uppercase text-black dark:bg-[#202533] dark:text-white"
                            title="Copy Live URL"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {codelearn.projectUrl && (
                          <ExternalLink href={codelearn.projectUrl} variant="emerald">
                            Launch Web App
                          </ExternalLink>
                        )}
                        {codelearn.githubUrl && (
                          <ExternalLink href={codelearn.githubUrl} variant="secondary">
                            <FolderGit2 className="h-4 w-4" />
                            GitHub
                          </ExternalLink>
                        )}
                      </div>
                    </div>

                    {/* Main Grid: Left Spec Brief, Right Interactive Tabs */}
                    <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1.3fr]">
                      {/* Left: Identity & Metrics */}
                      <div className="space-y-4">
                        <div>
                          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-black dark:text-white">
                            {codelearn.name}
                          </h2>
                          <p className="mt-1 font-display text-sm font-black uppercase text-neo-forest dark:text-neo-yellow">
                            ROLE: {codelearn.role}
                          </p>
                        </div>

                        {/* Interactive Metric Callouts */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          <div className="neo-box rounded-xl bg-white p-3 text-center dark:bg-[#202533] dark:border-white/50">
                            <span className="block font-display text-xl font-black text-black dark:text-neo-yellow">500+</span>
                            <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300">Obsidian Notes</span>
                          </div>
                          <div className="neo-box rounded-xl bg-white p-3 text-center dark:bg-[#202533] dark:border-white/50">
                            <span className="block font-display text-xl font-black text-black dark:text-neo-sky">108</span>
                            <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300">CySec Tools</span>
                          </div>
                          <div className="neo-box rounded-xl bg-white p-3 text-center dark:bg-[#202533] dark:border-white/50">
                            <span className="block font-display text-xl font-black text-black dark:text-neo-rose">7</span>
                            <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300">Browser Runtimes</span>
                          </div>
                          <div className="neo-box rounded-xl bg-white p-3 text-center dark:bg-[#202533] dark:border-white/50">
                            <span className="block font-display text-xl font-black text-black dark:text-neo-green">8-Stage</span>
                            <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300">Parser Pipeline</span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm font-bold leading-relaxed text-black dark:text-slate-200">
                          {codelearn.outcome}
                        </p>

                        {/* Stack badges */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {codelearn.stack.map((s) => (
                            <span
                              key={s}
                              className="neo-badge rounded-md bg-white text-[11px] font-black text-black dark:bg-[#202533] dark:text-white dark:border-white/30"
                            >
                              {s}
                            </span>
                          ))}
                        </div>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => setSelectedProject(codelearn)}
                            className="neo-btn w-full rounded-2xl bg-neo-yellow py-3 text-center font-display text-xs font-black uppercase tracking-wider text-black hover:bg-yellow-300 dark:bg-neo-yellow dark:text-black dark:border-white"
                          >
                            <span>View Specifications</span>
                            <span className="ml-2">→</span>
                          </button>
                        </div>
                      </div>

                      {/* Right: In-Card Tabbed Viewer */}
                      <div className="neo-box rounded-2xl bg-white p-5 dark:bg-[#121620] dark:border-white flex flex-col justify-between">
                        <div>
                          {/* Tab Navigation */}
                          <div className="flex items-center gap-2 border-b-2 border-black/10 pb-3 dark:border-white/20">
                            <button
                              type="button"
                              onClick={() => setCardTab(codelearn.name, "overview")}
                              className={`neo-btn rounded-lg px-3 py-1 text-xs font-black uppercase tracking-wider ${
                                currentTab === "overview"
                                  ? "bg-neo-yellow text-black dark:bg-neo-yellow dark:text-black"
                                  : "bg-slate-100 text-slate-700 dark:bg-[#202533] dark:text-slate-300"
                              }`}
                            >
                              Overview
                            </button>
                            <button
                              type="button"
                              onClick={() => setCardTab(codelearn.name, "features")}
                              className={`neo-btn rounded-lg px-3 py-1 text-xs font-black uppercase tracking-wider ${
                                currentTab === "features"
                                  ? "bg-neo-sky text-black dark:bg-neo-sky dark:text-black"
                                  : "bg-slate-100 text-slate-700 dark:bg-[#202533] dark:text-slate-300"
                              }`}
                            >
                              Features ({codelearn.features.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setCardTab(codelearn.name, "duties")}
                              className={`neo-btn rounded-lg px-3 py-1 text-xs font-black uppercase tracking-wider ${
                                currentTab === "duties"
                                  ? "bg-neo-rose text-black dark:bg-neo-rose dark:text-black"
                                  : "bg-slate-100 text-slate-700 dark:bg-[#202533] dark:text-slate-300"
                              }`}
                            >
                              Responsibilities
                            </button>
                          </div>

                          {/* Tab Contents */}
                          <div className="mt-4">
                            {currentTab === "overview" && (
                              <div className="space-y-3 text-xs sm:text-sm font-bold leading-relaxed text-slate-800 dark:text-slate-200">
                                <p>
                                  CodeLearn transforms an Obsidian study vault into a static React platform through an 8-stage pipeline:
                                  <span className="font-mono text-neo-forest dark:text-neo-yellow"> SCAN → VALIDATE → INDEX → RESOLVE → RENDER → COPY → WRITE → PUBLISH</span>.
                                </p>
                                <p>
                                  Features zero backend dependencies: client-side Pyodide, php-wasm, and SQLite runtimes execute code directly in browser memory without risk of remote server compromise.
                                </p>
                              </div>
                            )}

                            {currentTab === "features" && (
                              <ul className="space-y-2.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                                {codelearn.features.map((feat, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-neo-forest dark:text-neo-yellow" />
                                    <span>{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {currentTab === "duties" && (
                              <ul className="space-y-2.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                                {codelearn.responsibilities.map((resp, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-neo-rose shrink-0" />
                                    <span>{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}

            {/* SECONDARY PROJECTS ASYMMETRIC GRID */}
            <div className="grid gap-6 md:grid-cols-2">
              {filteredProjects
                .filter((p) => p.name !== "CodeLearn")
                .map((project, idx) => {
                  const currentTab = cardTabs[project.name] || "overview";
                  const accentColor =
                    idx % 3 === 0
                      ? "bg-neo-yellow text-black"
                      : idx % 3 === 1
                      ? "bg-neo-sky text-black"
                      : "bg-neo-rose text-black";

                  return (
                    <div
                      key={project.name}
                      className="neo-box neo-box-hover rounded-3xl bg-white p-6 dark:bg-[#181b24] dark:border-white flex flex-col justify-between"
                    >
                      <div>
                        {/* Top Meta Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b-[2px] border-black pb-3 dark:border-white">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`neo-badge rounded-md ${accentColor} text-[10px] font-black`}>
                              #{String(idx + 2).padStart(2, "0")}
                            </span>
                            <span className="neo-badge rounded-md bg-white text-black text-[10px] dark:bg-[#202533] dark:text-white">
                              {project.period}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {project.projectUrl && (
                              <button
                                type="button"
                                onClick={() => copyToClipboard(project.projectUrl, "Demo URL")}
                                className="neo-btn rounded-lg bg-slate-100 p-1.5 text-black hover:bg-neo-yellow dark:bg-[#202533] dark:text-white"
                                title="Copy Link"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            )}
                            {project.projectUrl && (
                              <a
                                href={project.projectUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="neo-btn rounded-lg bg-neo-green px-2 py-1 text-[11px] font-black uppercase text-black hover:bg-emerald-300 dark:bg-neo-sky dark:text-black"
                              >
                                Demo ↗
                              </a>
                            )}
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="neo-btn rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-black uppercase text-black hover:bg-slate-200 dark:bg-[#202533] dark:text-white"
                              >
                                Git
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Title & Organization */}
                        <div className="mt-3">
                          <h3 className="font-display text-xl font-black uppercase tracking-tight text-black dark:text-white">
                            {project.name}
                          </h3>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-black uppercase">
                            <span className="text-neo-forest dark:text-neo-yellow">{project.role}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-600 dark:text-slate-400">{project.institution}</span>
                          </div>
                        </div>

                        {/* In-Card Interactive Mini-Tabs */}
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setCardTab(project.name, "overview")}
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-black uppercase border border-black dark:border-white transition-all ${
                              currentTab === "overview"
                                ? "bg-black text-white dark:bg-white dark:text-black"
                                : "bg-white text-black dark:bg-[#202533] dark:text-white"
                            }`}
                          >
                            Overview
                          </button>
                          <button
                            type="button"
                            onClick={() => setCardTab(project.name, "features")}
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-black uppercase border border-black dark:border-white transition-all ${
                              currentTab === "features"
                                ? "bg-black text-white dark:bg-white dark:text-black"
                                : "bg-white text-black dark:bg-[#202533] dark:text-white"
                            }`}
                          >
                            Features & Stack
                          </button>
                        </div>

                        {/* Mini-Tab Content */}
                        <div className="mt-3 min-h-[90px]">
                          {currentTab === "overview" ? (
                            <p className="text-xs font-bold leading-relaxed text-slate-800 dark:text-slate-300 line-clamp-4">
                              {project.description}
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {project.features && (
                                <ul className="space-y-1 text-xs font-bold text-slate-800 dark:text-slate-300">
                                  {project.features.slice(0, 3).map((f, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-neo-forest dark:text-neo-yellow shrink-0" />
                                      <span className="line-clamp-2">{f}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Stack pills */}
                        {project.stack && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {project.stack.slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className="rounded-md border border-black/30 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-black dark:border-white/30 dark:bg-[#202533] dark:text-white"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.stack.length > 4 && (
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 self-center">
                                +{project.stack.length - 4} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Partner List */}
                        <PartnerList partners={project.partners} compact />
                      </div>

                      {/* Card Footer Button */}
                      <div className="mt-5 border-t border-black/10 pt-3 dark:border-white/20">
                        <button
                          type="button"
                          onClick={() => setSelectedProject(project)}
                          className="neo-btn flex w-full items-center justify-between rounded-xl bg-neo-yellow px-4 py-2 text-xs font-black uppercase text-black hover:bg-yellow-300 dark:bg-neo-yellow dark:text-black"
                        >
                          <span>View Details</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* View Mode 2: Matrix Dossier (Interactive Ledger) */}
        {viewMode === "matrix" && filteredProjects.length > 0 && (
          <div className="neo-box overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-neo-darkcard dark:border-white">
            <div className="px-4 py-2 border-b border-black/10 dark:border-white/20 sm:hidden bg-neo-yellow/20 text-[11px] font-mono font-bold text-black dark:text-slate-300 flex items-center justify-between">
              <span>← SWIPE TABLE HORIZONTALLY →</span>
              <span>[{filteredProjects.length} RECORDS]</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs font-bold">
                <thead className="border-b-[2.5px] border-black bg-neo-yellow text-black uppercase font-black dark:border-white">
                  <tr>
                    <th className="px-5 py-4">#</th>
                    <th className="px-5 py-4">Project Name</th>
                    <th className="px-5 py-4">Role & Institution</th>
                    <th className="px-5 py-4">Timeline</th>
                    <th className="px-5 py-4">Core Stack</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black/10 dark:divide-white/10 text-black dark:text-white">
                  {filteredProjects.map((p, i) => (
                    <tr
                      key={p.name}
                      onClick={() => setSelectedProject(p)}
                      className="cursor-pointer transition-colors hover:bg-neo-green/20 dark:hover:bg-[#202533]"
                    >
                      <td className="px-5 py-4 font-mono font-black">{String(i + 1).padStart(2, "0")}</td>
                      <td className="px-5 py-4 font-display font-black uppercase">
                        <div className="flex items-center gap-2">
                          <span>{p.name}</span>
                          {i === 0 && (
                            <span className="neo-badge rounded bg-neo-yellow text-[9px] text-black">
                              CAPSTONE
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-neo-forest dark:text-neo-yellow">{p.role}</span>
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400">{p.institution}</span>
                      </td>
                      <td className="px-5 py-4 font-mono">{p.period}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[240px]">
                          {(p.stack || []).slice(0, 3).map((s) => (
                            <span key={s} className="rounded bg-black/10 dark:bg-white/10 px-1.5 py-0.5 text-[10px]">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(p);
                          }}
                          className="neo-btn rounded-lg bg-neo-yellow px-3 py-1 text-[11px] font-black uppercase text-black"
                        >
                          Inspect ↗
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </PageShell>

      {/* FULL ARCHITECTURE DOSSIER MODAL */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedProject(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="neo-box max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl sm:rounded-3xl bg-white p-0 shadow-brutal-lg dark:bg-[#181b24] dark:border-white"
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b-[3px] border-black bg-neo-sky px-4 sm:px-6 py-3 sm:py-4 text-black dark:border-white dark:bg-neo-sky dark:text-black">
              <div className="flex items-center gap-2 sm:gap-3 truncate">
                <span className="rounded-lg border-2 border-black bg-white px-2 py-0.5 text-[11px] font-black uppercase text-black shrink-0">
                  DOSSIER SPEC
                </span>
                <span className="font-display text-xs sm:text-sm font-black uppercase tracking-wider truncate">
                  {selectedProject.institution}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="neo-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neo-rose text-black hover:bg-rose-400 p-0"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 stroke-[3]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white">
                  {selectedProject.name}
                </h2>
                <p className="mt-1 font-display text-sm font-black uppercase text-neo-forest dark:text-neo-yellow">
                  ROLE: {selectedProject.role} • {selectedProject.period}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {selectedProject.projectUrl && (
                  <ExternalLink href={selectedProject.projectUrl} variant="emerald">
                    Launch Web App ↗
                  </ExternalLink>
                )}
                {selectedProject.githubUrl && (
                  <ExternalLink href={selectedProject.githubUrl} variant="secondary">
                    <FolderGit2 className="h-4 w-4" />
                    GitHub Repository
                  </ExternalLink>
                )}
                {selectedProject.projectUrl && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedProject.projectUrl, "Live URL")}
                    className="neo-btn rounded-xl bg-neo-yellow px-3.5 py-2 text-xs font-black uppercase text-black"
                  >
                    <Copy className="h-3.5 w-3.5 inline mr-1" />
                    Copy Project Link
                  </button>
                )}
              </div>

              {/* Comprehensive Description */}
              <div className="rounded-2xl border-2 border-black bg-neo-cream p-5 dark:border-white dark:bg-[#121620]">
                <h4 className="font-display text-xs font-black uppercase text-black dark:text-neo-yellow mb-2">
                  System Architecture & Overview
                </h4>
                <div className="text-xs sm:text-sm font-bold leading-relaxed text-black dark:text-slate-200 whitespace-pre-line">
                  {selectedProject.description}
                </div>
              </div>

              {/* Key Features Breakdown */}
              {selectedProject.features && selectedProject.features.length > 0 && (
                <div>
                  <h4 className="font-display text-sm font-black uppercase text-black dark:text-white mb-3">
                    Architectural Highlights & Capabilities
                  </h4>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {selectedProject.features.map((feat, i) => (
                      <div
                        key={i}
                        className="rounded-xl border-2 border-black bg-white p-3.5 dark:border-white/30 dark:bg-[#202533]"
                      >
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-neo-forest dark:text-neo-yellow" />
                          <span className="text-xs font-bold leading-snug text-black dark:text-slate-200">
                            {feat}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              {selectedProject.responsibilities && selectedProject.responsibilities.length > 0 && (
                <div>
                  <h4 className="font-display text-sm font-black uppercase text-black dark:text-white mb-3">
                    Engineering Scope & Responsibilities
                  </h4>
                  <ul className="space-y-2 rounded-2xl border-2 border-black bg-white p-5 dark:border-white/30 dark:bg-[#202533]">
                    {selectedProject.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs font-bold text-black dark:text-slate-200">
                        <span className="mt-1 h-2 w-2 rounded-sm bg-black dark:bg-neo-yellow shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Stack Arsenal */}
              {selectedProject.stack && (
                <div>
                  <h4 className="font-display text-sm font-black uppercase text-black dark:text-white mb-3">
                    Technology Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.stack.map((s) => (
                      <span
                        key={s}
                        className="neo-btn rounded-xl bg-white px-3 py-1.5 text-xs font-black uppercase text-black dark:bg-[#202533] dark:text-white"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Collaborators */}
              <PartnerList partners={selectedProject.partners} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
