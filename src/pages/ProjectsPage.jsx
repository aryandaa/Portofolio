import { useState } from "react";
import { Cpu, ListChecks, Sparkles, Wrench, X } from "lucide-react";
import { technicalProjects } from "../data/projects.js";
import ExternalLink from "../components/ExternalLink.jsx";
import PageShell from "../components/PageShell.jsx";
import Panel from "../components/Panel.jsx";
import PartnerList from "../components/PartnerList.jsx";

function ProjectDetailList({ icon: Icon, title, items }) {
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

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <>
      <PageShell eyebrow="Build archive" title="Technical Project">
        <div className="grid gap-5">
          {technicalProjects.map((project) => (
            <Panel key={project.name} className="p-6">
              <button
                type="button"
                onClick={() => setSelectedProject(project)}
                className="block w-full text-left"
              >
                <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <Cpu className="h-5 w-5 text-cyan" aria-hidden="true" />
                      <h2 className="font-display text-2xl font-bold text-white">{project.name}</h2>
                    </div>
                    <p className="text-sm text-slate-300">
                      <span className="text-cyan">{project.role}</span> at {project.institution}
                    </p>
                  </div>
                  <span className="interactive-chip border border-danger/40 bg-danger/10 px-3 py-2 text-xs font-semibold text-rose-100">
                    {project.period}
                  </span>
                </div>
                <p className="text-sm leading-7 text-slate-300">{project.description}</p>
                <PartnerList partners={project.partners} compact />
                <p className="mt-4 text-xs uppercase tracking-[0.22em] text-cyan">
                  Click card for more details
                </p>
              </button>
              <div className="mt-6 flex flex-wrap gap-3">
                <ExternalLink href={project.projectUrl}>Open Project</ExternalLink>
                <ExternalLink href={project.githubUrl} variant="red">View GitHub</ExternalLink>
              </div>
            </Panel>
          ))}
        </div>
      </PageShell>

      {selectedProject && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-void/82 px-4 py-6 backdrop-blur-lg">
          <div className="neon-border clip-corner max-h-[88vh] w-full max-w-6xl overflow-y-auto bg-night/95 p-5 shadow-neon">
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="font-display text-xs uppercase tracking-[0.28em] text-cyan">
                  Project Details
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold text-white">
                  {selectedProject.name}
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  <span className="text-cyan">{selectedProject.role}</span> at{" "}
                  {selectedProject.institution} | {selectedProject.period}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="interactive-chip grid h-11 w-11 shrink-0 place-items-center border border-danger/50 bg-danger/10 text-rose-100"
                aria-label="Close project details"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid gap-6">
              <p className="text-sm leading-7 text-slate-300">{selectedProject.description}</p>
              <PartnerList partners={selectedProject.partners} />

              <div className="grid gap-6 xl:grid-cols-3">
                <ProjectDetailList
                  icon={ListChecks}
                  title="Responsibilities"
                  items={selectedProject.responsibilities}
                />
                <ProjectDetailList
                  icon={Sparkles}
                  title="Features"
                  items={selectedProject.features}
                />
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <Wrench className="h-5 w-5 text-cyan" aria-hidden="true" />
                    <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white">
                      Stack & Focus
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.stack.map((item) => (
                      <span
                        key={`${selectedProject.name}-${item}`}
                        className="interactive-chip border border-cyan/30 bg-cyan/10 px-3 py-2 text-sm text-cyan"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 border border-danger/30 bg-danger/10 p-4">
                    <p className="font-display text-xs uppercase tracking-[0.2em] text-rose-100">
                      Outcome
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{selectedProject.outcome}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-white/10 pt-5">
                <ExternalLink href={selectedProject.projectUrl}>Open Project</ExternalLink>
                <ExternalLink href={selectedProject.githubUrl} variant="red">View GitHub</ExternalLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
