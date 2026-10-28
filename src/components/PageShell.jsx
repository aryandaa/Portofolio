import { Sparkles, Terminal } from "lucide-react";

export default function PageShell({ eyebrow, title, description, children, aside, below }) {
  return (
    <div className="space-y-8">
      {/* Dynamic Neobrutalist Page Header Header Deck */}
      <div className="relative overflow-hidden rounded-3xl border-[3px] border-black bg-white p-6 sm:p-8 shadow-brutal dark:border-white dark:bg-neo-darkcard dark:shadow-brutal-dark">
        {/* Decorative Top Stamp */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black/10 pb-4 dark:border-white/20">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-neo-rose border border-black dark:border-white" />
            <span className="h-3 w-3 rounded-full bg-neo-yellow border border-black dark:border-white" />
            <span className="h-3 w-3 rounded-full bg-neo-green border border-black dark:border-white" />
            {eyebrow && (
              <span className="ml-2 font-mono text-xs font-black uppercase tracking-wider text-neo-forest dark:text-neo-yellow">
                // {eyebrow}
              </span>
            )}
          </div>
          <span className="neo-badge rounded-md bg-neo-yellow text-black text-[10px] font-black uppercase">
            ✦ VERIFIED ARTIFACT
          </span>
        </div>

        {/* Title & Description */}
        <div className="mt-4">
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-black sm:text-4xl lg:text-5xl dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-2.5 max-w-3xl text-xs sm:text-sm font-bold leading-relaxed text-slate-700 dark:text-slate-300">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`grid gap-8 ${aside ? "lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]" : ""}`}>
        <div className="min-w-0 space-y-8">{children}</div>
        {aside && <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">{aside}</aside>}
      </div>

      {below && <div className="pt-4">{below}</div>}
    </div>
  );
}
