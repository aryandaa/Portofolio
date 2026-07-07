import { FileSearch, FlaskConical, Hourglass, RadioTower } from "lucide-react";
import PageShell from "../components/PageShell.jsx";
import Panel from "../components/Panel.jsx";

export default function ResearchPage() {
  return (
    <PageShell eyebrow="Research node" title="Research">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Panel className="p-8 sm:p-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center border border-cyan/40 bg-cyan/10 text-cyan shadow-neon">
              <FlaskConical className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <p className="font-display text-xs uppercase tracking-[0.28em] text-danger">
                Publication archive
              </p>
              <h2 className="mt-2 font-display text-4xl font-extrabold text-white text-glow">
                Coming Soon
              </h2>
            </div>
          </div>

          <p className="max-w-3xl text-sm leading-7 text-slate-300">
            Research records, publication notes, paper links, datasets, and presentation materials
            will be placed here once they are ready to be shared.
          </p>
        </Panel>

        <Panel className="p-6">
          <div className="grid gap-4">
            <div className="interactive-row border border-white/10 bg-white/[0.035] p-4">
              <FileSearch className="mb-3 h-6 w-6 text-cyan" aria-hidden="true" />
              <h3 className="font-display text-lg font-bold text-white">Research Data</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Placeholder structure is available in the research data file.
              </p>
            </div>
            <div className="interactive-row border border-white/10 bg-white/[0.035] p-4">
              <RadioTower className="mb-3 h-6 w-6 text-danger" aria-hidden="true" />
              <h3 className="font-display text-lg font-bold text-white">Publication Links</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Paper, DOI, repository, dataset, and presentation links can be added later.
              </p>
            </div>
            <div className="interactive-row border border-white/10 bg-white/[0.035] p-4">
              <Hourglass className="mb-3 h-6 w-6 text-cyan" aria-hidden="true" />
              <h3 className="font-display text-lg font-bold text-white">Status Tracking</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Draft, in progress, under review, presented, and published states are supported.
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
