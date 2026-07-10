import { Users } from "lucide-react";

export default function PartnerList({ partners = [], compact = false }) {
  if (!partners || partners.length === 0) return null;

  return (
    <div className={compact ? "mt-3" : "mt-5"}>
      <div className="mb-2 flex items-center gap-2">
        <Users className="h-4 w-4 text-cyan" aria-hidden="true" />
        <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-cyan">
          Partners
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {partners.map((partner) => (
          <span
            key={partner}
            className="interactive-chip border border-cyan/35 bg-cyan/10 px-3 py-1 text-xs font-semibold text-cyan"
          >
            {partner}
          </span>
        ))}
      </div>
    </div>
  );
}
