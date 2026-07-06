export default function SectionTitle({ kicker, title }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4 border-b border-white/10 pb-3">
      <div>
        {kicker && (
          <p className="font-display text-[11px] uppercase tracking-[0.28em] text-danger">
            {kicker}
          </p>
        )}
        <h2 className="mt-1 font-display text-xl font-bold text-white">{title}</h2>
      </div>
      <span className="h-px w-16 bg-cyan shadow-neon" />
    </div>
  );
}
