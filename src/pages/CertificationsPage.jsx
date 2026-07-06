import { BadgeCheck } from "lucide-react";
import { certifications } from "../data/portfolio.js";
import PageShell from "../components/PageShell.jsx";
import Panel from "../components/Panel.jsx";

export default function CertificationsPage() {
  return (
    <PageShell eyebrow="Credential matrix" title="Certifications & Licenses">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {certifications.map((certificate) => (
          <Panel key={`${certificate.name}-${certificate.date}`} className="min-h-[300px] p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <BadgeCheck className="h-7 w-7 shrink-0 text-cyan" aria-hidden="true" />
              <span className="border border-plasma/50 bg-plasma/10 px-3 py-1 text-xs text-violet-100">
                {certificate.category}
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-white">{certificate.name}</h2>
            <dl className="mt-5 grid gap-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                <dt className="text-slate-500">Type</dt>
                <dd className="text-right text-slate-200">{certificate.type}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                <dt className="text-slate-500">Issued</dt>
                <dd className="text-right text-slate-200">{certificate.date}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Issuer</dt>
                <dd className="text-right text-slate-200">{certificate.issuer}</dd>
              </div>
            </dl>
          </Panel>
        ))}
      </div>
    </PageShell>
  );
}
