export default function SectionTitle({ kicker, title, description, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-[3px] border-black pb-5 dark:border-white">
      <div>
        {kicker && (
          <div className="mb-2">
            <span className="neo-badge rounded-lg bg-neo-green text-black dark:bg-neo-yellow dark:text-black">
              ✦ {kicker}
            </span>
          </div>
        )}
        <h2 className="font-display text-2xl font-black uppercase tracking-tight text-black sm:text-3xl lg:text-4xl dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-300">
            {description}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
