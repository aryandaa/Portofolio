import { Star } from "lucide-react";

export default function StarRating({ rating }) {
  const normalized = Math.max(0, Math.min(10, Number(rating) || 0));
  const starsCount = 5;
  const filledStars = Math.round(normalized / 2);

  return (
    <div
      className="neo-btn rounded-lg bg-neo-yellow px-2.5 py-1 text-xs font-black text-black dark:bg-neo-yellow dark:text-black"
      title={`Rating: ${normalized} / 10`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: starsCount }, (_, index) => {
          const isFilled = index < filledStars;
          return (
            <Star
              key={index}
              className={`h-3.5 w-3.5 ${
                isFilled
                  ? "fill-black text-black dark:fill-black dark:text-black"
                  : "text-black/30 dark:text-black/30"
              }`}
            />
          );
        })}
      </div>
      <span className="ml-1 text-xs font-black">{normalized}/10</span>
    </div>
  );
}
