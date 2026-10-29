import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileCheck2,
  FolderOpen,
  Layers,
  Sparkles,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { experiences } from "../data/experiences.js";
import AssetPreview from "../components/AssetPreview.jsx";
import PageShell from "../components/PageShell.jsx";
import PartnerList from "../components/PartnerList.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function ExperiencePage() {
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [activeTabByRole, setActiveTabByRole] = useState({}); // { [roleKey]: 'responsibilities' | 'highlights' | 'overview' }
  const { showToast } = useToast();

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedExperience(null);
    };
    if (selectedExperience) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedExperience]);

  const setRoleTab = (key, tab) => {
    setActiveTabByRole((prev) => ({ ...prev, [key]: tab }));
  };

  return (
    <>
      <PageShell title="Experience">
        {/* Interactive Career Timeline Scrubber Bar */}
        <div className="neo-box rounded-3xl bg-white p-5 sm:p-6 mb-8 dark:bg-neo-darkcard dark:border-white">
          <div className="flex items-center justify-between border-b-2 border-black/10 pb-3 dark:border-white/20">
            <span className="font-display text-xs font-black uppercase text-black dark:text-neo-yellow">
              Career Timeline
            </span>
          </div>

          {/* Interactive Stepper Nodes */}
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {experiences.map((exp, idx) => {
              const key = `${exp.role}-${exp.period}`;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    const el = document.getElementById(`exp-${idx}`);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                    showToast(`Scrolled to milestone #${idx + 1}`);
                  }}
                  className="neo-btn shrink-0 rounded-2xl bg-white p-3 text-left transition-all hover:bg-neo-yellow dark:bg-[#181b24] dark:hover:bg-[#202533] min-w-[190px]"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono font-black text-neo-forest dark:text-neo-yellow mb-1">
                    <span>MILESTONE #{idx + 1}</span>
                    <span>{exp.period.split(" - ")[0]}</span>
                  </div>
                  <div className="font-display text-xs font-black uppercase text-black dark:text-white truncate">
                    {exp.role}
                  </div>
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 truncate">
                    {exp.place.split(" - ")[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Experience Dossier Cards */}
        <div className="space-y-8">
          {experiences.map((item, idx) => {
            const roleKey = `${item.role}-${item.period}`;
            const currentTab = activeTabByRole[roleKey] || "responsibilities";
            const isLatest = idx === 0;

            return (
              <div
                id={`exp-${idx}`}
                key={roleKey}
                className={`neo-box neo-box-hover rounded-3xl p-6 sm:p-8 transition-all ${
                  isLatest
                    ? "bg-neo-yellow/20 dark:bg-[#1a2233] border-[3px]"
                    : "bg-white dark:bg-[#181b24]"
                }`}
              >
                {/* Header Banner */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start border-b-[2.5px] border-black pb-5 dark:border-white">
                  <div className="flex items-start gap-4">
                    <div
                      className={`neo-btn h-14 w-14 shrink-0 rounded-2xl text-black p-0 ${
                        idx % 3 === 0
                          ? "bg-neo-yellow dark:bg-neo-yellow"
                          : idx % 3 === 1
                          ? "bg-neo-sky dark:bg-neo-sky"
                          : "bg-neo-rose dark:bg-neo-rose"
                      }`}
                    >
                      <Building2 className="h-7 w-7 stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {isLatest && (
                          <span className="neo-badge rounded-md bg-neo-green text-black font-black">
                            ✦ PRESENT ROLE
                          </span>
                        )}
                        <span className="neo-badge rounded-md bg-neo-yellow text-black">
                          EXPERIENCE 0{idx + 1}
                        </span>
                        <span className="neo-badge rounded-md bg-white text-black dark:bg-[#202533] dark:text-white">
                          <Calendar className="h-3 w-3 mr-1 inline" />
                          {item.period}
                        </span>
                      </div>

                      <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white">
                        {item.role}
                      </h2>
                      <p className="mt-0.5 text-xs sm:text-sm font-black uppercase text-neo-forest dark:text-neo-yellow">
                        {item.place}
                      </p>
                    </div>
                  </div>

                  {item.evidence && item.evidence.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedExperience(item)}
                      className="neo-btn flex items-center gap-2 rounded-xl bg-neo-sky px-4 py-2 text-xs font-black uppercase text-black hover:bg-sky-300 dark:bg-neo-sky dark:text-black self-start"
                    >
                      <FileCheck2 className="h-4 w-4 stroke-[2.5]" />
                      <span>View Proof & Document ({item.evidence.length})</span>
                    </button>
                  )}
                </div>

                {/* Split Layout: Left Info & Tech, Right In-Card Interactive Tabs */}
                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
                  {/* Left Column: Summary & Technologies */}
                  <div className="space-y-4">
                    <p className="text-xs sm:text-sm font-bold leading-relaxed text-black dark:text-slate-200">
                      {item.description}
                    </p>

                    {item.technologies && item.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="neo-badge rounded-md bg-neo-cream text-[11px] font-black text-black dark:bg-[#202533] dark:text-white dark:border-white/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <PartnerList partners={item.partners} compact />
                  </div>

                  {/* Right Column: In-Card Interactive Tabs */}
                  <div className="neo-box rounded-2xl bg-neo-bg p-5 dark:bg-[#121620] dark:border-white flex flex-col justify-between">
                    <div>
                      {/* Tab buttons */}
                      <div className="flex items-center gap-2 border-b-2 border-black/10 pb-3 dark:border-white/20">
                        <button
                          type="button"
                          onClick={() => setRoleTab(roleKey, "responsibilities")}
                          className={`rounded-lg px-3 py-1 text-xs font-black uppercase border border-black dark:border-white transition-all ${
                            currentTab === "responsibilities"
                              ? "bg-neo-yellow text-black"
                              : "bg-white text-black dark:bg-[#202533] dark:text-white"
                          }`}
                        >
                          Responsibilities ({item.responsibilities?.length || 0})
                        </button>
                        {item.highlights && item.highlights.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setRoleTab(roleKey, "highlights")}
                            className={`rounded-lg px-3 py-1 text-xs font-black uppercase border border-black dark:border-white transition-all ${
                              currentTab === "highlights"
                                ? "bg-neo-sky text-black"
                                : "bg-white text-black dark:bg-[#202533] dark:text-white"
                            }`}
                          >
                            Key Highlights
                          </button>
                        )}
                        {item.overview && (
                          <button
                            type="button"
                            onClick={() => setRoleTab(roleKey, "overview")}
                            className={`rounded-lg px-3 py-1 text-xs font-black uppercase border border-black dark:border-white transition-all ${
                              currentTab === "overview"
                                ? "bg-neo-rose text-black"
                                : "bg-white text-black dark:bg-[#202533] dark:text-white"
                            }`}
                          >
                            Scope
                          </button>
                        )}
                      </div>

                      {/* Content Panels */}
                      <div className="mt-4">
                        {currentTab === "responsibilities" && (
                          <ul className="space-y-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                            {item.responsibilities?.map((resp, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="mt-1 h-2 w-2 rounded-sm bg-neo-forest dark:bg-neo-yellow shrink-0" />
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {currentTab === "highlights" && (
                          <ul className="space-y-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                            {item.highlights?.map((high, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-neo-forest dark:text-neo-yellow shrink-0" />
                                <span>{high}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {currentTab === "overview" && (
                          <p className="text-xs font-bold leading-relaxed text-slate-800 dark:text-slate-200">
                            {item.overview}
                          </p>
                        )}
                      </div>
                    </div>

                    {item.evidence && item.evidence.length > 0 && (
                      <div className="mt-4 border-t border-black/10 pt-3 dark:border-white/20">
                        <button
                          type="button"
                          onClick={() => setSelectedExperience(item)}
                          className="text-xs font-black uppercase text-neo-forest hover:underline dark:text-neo-yellow flex items-center gap-1"
                        >
                          <span>✦ Official verification document attached ({item.evidence[0].title})</span>
                          <span>→</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </PageShell>

      {/* EVIDENCE / CREDENTIAL MODAL */}
      {selectedExperience && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedExperience(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="neo-box max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-0 shadow-brutal-lg dark:bg-[#181b24] dark:border-white"
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b-[3px] border-black bg-neo-yellow px-6 py-4 text-black dark:border-white dark:bg-neo-yellow dark:text-black">
              <div className="flex items-center gap-3">
                <span className="rounded-lg border-2 border-black bg-white px-2.5 py-1 text-xs font-black uppercase text-black">
                  OFFICIAL PROOF
                </span>
                <span className="font-display text-sm font-black uppercase tracking-wider truncate max-w-[280px] sm:max-w-md">
                  {selectedExperience.role}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExperience(null)}
                className="neo-btn flex h-9 w-9 items-center justify-center rounded-xl bg-neo-rose text-black hover:bg-rose-400 p-0"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 stroke-[3]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-display text-2xl font-black uppercase text-black dark:text-white">
                  {selectedExperience.place}
                </h3>
                <p className="mt-1 text-xs font-black uppercase text-neo-forest dark:text-neo-yellow">
                  {selectedExperience.period}
                </p>
              </div>

              {selectedExperience.evidence && selectedExperience.evidence.length > 0 && (
                <div className="space-y-4">
                  {selectedExperience.evidence.map((doc, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border-2 border-black bg-neo-cream p-4 dark:border-white dark:bg-[#121620]"
                    >
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <div>
                          <h4 className="font-display text-sm font-black uppercase text-black dark:text-white">
                            {doc.title}
                          </h4>
                          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                            {doc.description}
                          </p>
                        </div>
                        <a
                          href={doc.url}
                          download
                          className="neo-btn rounded-xl bg-neo-green px-3 py-1.5 text-xs font-black uppercase text-black hover:bg-emerald-300 dark:bg-neo-sky dark:text-black"
                        >
                          <Download className="h-3.5 w-3.5 inline mr-1" />
                          Download
                        </a>
                      </div>

                      <div className="aspect-[16/10] overflow-hidden rounded-xl border-2 border-black bg-white dark:border-white dark:bg-black">
                        <AssetPreview
                          src={doc.url}
                          alt={doc.title}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
