import { Users } from "lucide-react";

export default function PartnerList({ partners = [], compact = false }) {
  if (!partners || partners.length === 0) return null;

  return (
    <div className={compact ? "mt-4" : "mt-6"}>
      <div className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black dark:text-slate-300">
        <Users className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
        <span>COLLABORATORS & PARTNERS:</span>
      </div>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {partners.map((partner) => (
          <span
            key={partner}
            className="neo-badge rounded-lg bg-neo-yellow text-black dark:bg-neo-yellow dark:text-black text-[10px] sm:text-xs max-w-full truncate"
          >
            ★ {partner}
          </span>
        ))}
      </div>
    </div>
  );
}
