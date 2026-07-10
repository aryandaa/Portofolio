import { Trophy } from "lucide-react";
import { awards } from "../data/awards.js";
import PageShell from "../components/PageShell.jsx";
import Panel from "../components/Panel.jsx";
import PartnerList from "../components/PartnerList.jsx";

export default function AwardsPage() {
  return (
    <PageShell eyebrow="Achievement signal" title="Honorary and Awards">
      <div className="grid gap-5">
        {awards.map((award) => (
          <Panel key={`${award.name}-${award.date}`} className="p-6">
            <div className="grid gap-5 md:grid-cols-[180px_minmax(0,1fr)]">
              <div className="interactive-row border border-danger/40 bg-danger/10 p-4 text-center">
                <Trophy className="mx-auto mb-3 h-8 w-8 text-danger" aria-hidden="true" />
                <p className="font-display text-lg font-bold text-white">{award.rank}</p>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-white">{award.name}</h2>
                <p className="mt-3 text-sm text-cyan">{award.date}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Published by <span className="text-white">{award.publisher}</span>
                </p>
                <PartnerList partners={award.partners} compact />
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </PageShell>
  );
}
