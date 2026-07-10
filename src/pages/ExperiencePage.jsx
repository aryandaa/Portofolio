import { useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Download,
  FileImage,
  FolderOpen,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { experiences } from "../data/experiences.js";
import PageShell from "../components/PageShell.jsx";
import Panel from "../components/Panel.jsx";
import PartnerList from "../components/PartnerList.jsx";

function DetailList({ icon: Icon, title, items }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <Icon className="h-5 w-5 text-cyan" aria-hidden="true" />
        <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white">
          {title}
        </h3>
      </div>
      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item} className="interactive-row border border-white/10 bg-white/[0.035] p-3">
            <p className="text-sm leading-6 text-slate-300">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ExperiencePage() {
  const [selectedExperience, setSelectedExperience] = useState(null);

  return (
    <>
      <PageShell
        eyebrow="Field log"
        title="Experience Details"
        below={
          <div className="grid gap-6">
            {experiences.map((item, index) => (
              <Panel key={`${item.role}-${item.period}`} className="p-6">
                <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
                  <div className="border border-cyan/25 bg-cyan/10 p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center border border-cyan/40 bg-void/70 font-display text-sm font-bold text-cyan shadow-neon">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <BriefcaseBusiness className="h-6 w-6 text-danger" aria-hidden="true" />
                    </div>
                    <h2 className="font-display text-xl font-bold text-white">{item.role}</h2>
                    <p className="mt-3 text-sm leading-6 text-cyan">{item.place}</p>
                    <PartnerList partners={item.partners} compact />
                    <p className="mt-4 inline-flex border border-danger/40 bg-danger/10 px-3 py-2 text-xs font-semibold text-rose-100">
                      {item.period}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedExperience(item)}
                      className="interactive-link mt-4 inline-flex w-full items-center justify-center gap-2 border border-cyan/60 bg-cyan/10 px-4 py-2 text-sm font-semibold text-cyan transition hover:bg-cyan/20"
                    >
                      <FolderOpen className="h-4 w-4" aria-hidden="true" />
                      <span>View Evidence</span>
                    </button>
                  </div>

                  <div className="min-w-0 space-y-6">
                    <div>
                      <p className="text-sm leading-7 text-slate-300">{item.overview}</p>
                    </div>

                    <div className="grid gap-6 2xl:grid-cols-2">
                      <DetailList
                        icon={CheckCircle2}
                        title="What I Worked On"
                        items={item.responsibilities}
                      />
                      <DetailList icon={Sparkles} title="Key Impact" items={item.highlights} />
                    </div>

                    <div>
                      <div className="mb-3 flex items-center gap-3">
                        <Wrench className="h-5 w-5 text-cyan" aria-hidden="true" />
                        <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white">
                          Tools & Focus
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.technologies.map((technology) => (
                          <span
                            key={`${item.role}-${technology}`}
                            className="interactive-chip border border-cyan/30 bg-cyan/10 px-3 py-2 text-sm text-cyan"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        }
      />

      {selectedExperience && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-void/82 px-4 py-6 backdrop-blur-lg">
          <div className="neon-border clip-corner max-h-[88vh] w-full max-w-5xl overflow-y-auto bg-night/95 p-5 shadow-neon">
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="font-display text-xs uppercase tracking-[0.28em] text-cyan">
                  Work Evidence
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-white">
                  {selectedExperience.role}
                </h2>
                <p className="mt-2 text-sm text-slate-300">{selectedExperience.place}</p>
                <PartnerList partners={selectedExperience.partners} compact />
              </div>
              <button
                type="button"
                onClick={() => setSelectedExperience(null)}
                className="interactive-chip grid h-11 w-11 shrink-0 place-items-center border border-danger/50 bg-danger/10 text-rose-100"
                aria-label="Close evidence"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {selectedExperience.evidence.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {selectedExperience.evidence.map((item) => (
                  <div key={item.url} className="interactive-row border border-white/10 bg-white/[0.035] p-4">
                    <div className="mb-4 aspect-video overflow-hidden border border-cyan/20 bg-void/80">
                      {item.type === "image" ? (
                        <img src={item.url} alt={item.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full place-items-center text-cyan">
                          <FileImage className="h-12 w-12" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                    <a
                      href={item.url}
                      download
                      className="interactive-link mt-4 inline-flex items-center gap-2 border border-cyan/60 bg-cyan/10 px-4 py-2 text-sm font-semibold text-cyan"
                    >
                      <span>Download Evidence</span>
                      <Download className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-cyan/25 bg-cyan/10 p-6">
                <FileImage className="mb-4 h-8 w-8 text-cyan" aria-hidden="true" />
                <h3 className="font-display text-xl font-bold text-white">Evidence is ready to be added</h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  Add photos, certificates, screenshots, or documents to{" "}
                  <span className="text-cyan">public/assets/evidence/</span>, then register them in the
                  experience evidence list inside <span className="text-cyan">src/data/experiences.js</span>.
                  Each registered file will appear here with a download button.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
