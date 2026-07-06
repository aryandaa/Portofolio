export default function PageShell({ eyebrow, title, children, aside }) {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0">
        <div className="mb-8">
          <p className="mb-3 font-display text-xs uppercase tracking-[0.32em] text-cyan">
            {eyebrow}
          </p>
          <h1 className="max-w-4xl font-display text-4xl font-extrabold leading-tight text-white text-glow sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </div>
        {children}
      </div>
      {aside && <aside className="lg:sticky lg:top-28 lg:self-start">{aside}</aside>}
    </section>
  );
}
