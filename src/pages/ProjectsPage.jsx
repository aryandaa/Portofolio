import { Cpu, RadioTower } from "lucide-react";
import { technicalProjects } from "../data/portfolio.js";
import ExternalLink from "../components/ExternalLink.jsx";
import PageShell from "../components/PageShell.jsx";
import Panel from "../components/Panel.jsx";

export default function ProjectsPage() {
  return (
    <PageShell
      eyebrow="Build archive"
      title="Technical Project"
      aside={
        <Panel>
          <RadioTower className="mb-4 h-8 w-8 text-danger" aria-hidden="true" />
          <p className="text-sm leading-6 text-slate-300">
            Project records include responsibility, institution, timeline, short scope, and live or repository links.
          </p>
        </Panel>
      }
    >
      <div className="grid gap-5">
        {technicalProjects.map((project) => (
          <Panel key={project.name} className="p-6">
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
            <p className="max-w-4xl text-sm leading-7 text-slate-300">{project.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ExternalLink href={project.projectUrl}>Open Project</ExternalLink>
              <ExternalLink href={project.githubUrl} variant="red">View GitHub</ExternalLink>
            </div>
          </Panel>
        ))}
      </div>
    </PageShell>
  );
}
