export default function PageShell({ title, children, aside, below }) {
  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      {/* Neobrutalist Page Header */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-[3px] border-black bg-white p-4 sm:p-7 shadow-brutal dark:border-white dark:bg-neo-darkcard dark:shadow-brutal-dark">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <span className="h-3 w-3 rounded-full bg-neo-rose border border-black dark:border-white" />
          <span className="h-3 w-3 rounded-full bg-neo-yellow border border-black dark:border-white" />
          <span className="h-3 w-3 rounded-full bg-neo-green border border-black dark:border-white" />
        </div>
        <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-black dark:text-white">
          {title}
        </h1>
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
