import { BriefcaseBusiness, CheckCircle2, Sparkles, Wrench } from "lucide-react";
import { profile } from "../data/portfolio.js";
import PageShell from "../components/PageShell.jsx";
import Panel from "../components/Panel.jsx";

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
  return (
    <PageShell
      eyebrow="Field log"
      title="Experience Details"
      below={
        <div className="grid gap-6">
          {profile.experience.map((item, index) => (
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
                  <p className="mt-4 inline-flex border border-danger/40 bg-danger/10 px-3 py-2 text-xs font-semibold text-rose-100">
                    {item.period}
                  </p>
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
  );
}
