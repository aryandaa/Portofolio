export default function StarRating({ rating }) {
  const normalized = Math.max(0, Math.min(10, Number(rating) || 0));
  const filled = Math.round(normalized / 2);

  return (
    <div className="flex items-center gap-3">
      <div className="text-lg leading-none text-cyan" aria-label={`${normalized} out of 10`}>
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className={index < filled ? "text-cyan" : "text-slate-600"}>
            ★
          </span>
        ))}
      </div>
      <span className="font-display text-sm text-white">{normalized}/10</span>
    </div>
  );
}
