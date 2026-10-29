import { useMemo, useState } from "react";
import {
  Award,
  Calendar,
  CheckCircle2,
  Copy,
  Grid,
  List,
  Medal,
  Search,
  ShieldAlert,
  Sparkles,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { awards } from "../data/awards.js";
import PageShell from "../components/PageShell.jsx";
import PartnerList from "../components/PartnerList.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function AwardsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("bento"); // 'bento' | 'matrix'
  const { showToast } = useToast();

  const getTrack = (award) => {
    const n = award.name.toLowerCase();
    if (n.includes("ctf") || n.includes("capture the flag") || n.includes("kmipn")) return "Cybersecurity CTF";
    return "UI/UX Design";
  };

  const filteredAwards = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return awards;
    return awards.filter((a) => {
      return (
        a.name.toLowerCase().includes(q) ||
        a.rank.toLowerCase().includes(q) ||
        a.publisher.toLowerCase().includes(q) ||
        (a.partners && a.partners.some((p) => p.toLowerCase().includes(q))) ||
        (a.description && a.description.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  const copyAwardRecord = (award) => {
    navigator.clipboard.writeText(`${award.rank} | ${award.name} (${award.publisher}, ${award.date})`);
    showToast(`Copied award record!`);
  };

  // Top podium spotlights
  const kmipnAward = awards.find((a) => a.name.includes("KMIPN"));
  const silverAward = awards.find((a) => a.rank.includes("2nd Place"));
  const top18Award = awards.find((a) => a.name.includes("Top 18") || a.rank.includes("Top 18"));

  return (
    <PageShell title="Awards & Honors">
      {/* Interactive Control Desk */}
      <div className="neo-box rounded-3xl bg-white p-5 sm:p-6 mb-8 dark:bg-neo-darkcard dark:border-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 stroke-[2.5] text-black dark:text-neo-yellow" />
            <input
              type="text"
              placeholder="Search awards by name, rank, organizer, or teammate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border-2 border-black bg-neo-bg py-3 pl-12 pr-4 text-sm font-bold text-black placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-black dark:border-white dark:bg-[#121620] dark:text-white dark:placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg bg-black p-1 text-white hover:bg-slate-800 dark:bg-white dark:text-black"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("bento")}
              className={`neo-btn flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black uppercase ${
                viewMode === "bento"
                  ? "bg-neo-yellow text-black dark:bg-neo-yellow dark:text-black dark:border-white"
                  : "bg-white text-black dark:bg-[#181b24] dark:text-white"
              }`}
            >
              <Grid className="h-4 w-4" />
              <span>Bento</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("matrix")}
              className={`neo-btn flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black uppercase ${
                viewMode === "matrix"
                  ? "bg-neo-yellow text-black dark:bg-neo-yellow dark:text-black dark:border-white"
                  : "bg-white text-black dark:bg-[#181b24] dark:text-white"
              }`}
            >
              <List className="h-4 w-4" />
              <span>Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* View Mode 1: Bento */}
      {viewMode === "bento" && (
        <div className="space-y-8">
          {/* TOURNAMENT PODIUM SPOTLIGHT (When no search query) */}
          {!searchQuery && (
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {/* Podium 1: 3rd Place KMIPN VIII */}
          {kmipnAward && (
            <div className="neo-box rounded-3xl border-[3px] border-black bg-neo-rose/20 p-6 dark:border-white dark:bg-[#25161e] shadow-brutal flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b-2 border-black/15 pb-4 dark:border-white/20">
                  <span className="neo-badge rounded-md bg-neo-rose text-black font-black text-xs">
                    🥉 3RD PLACE NATIONAL
                  </span>
                  <span className="font-mono text-xs font-black text-slate-700 dark:text-slate-300">
                    {kmipnAward.date}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-display text-xl font-black uppercase tracking-tight text-black dark:text-white leading-tight">
                    {kmipnAward.name}
                  </h3>
                  <p className="mt-1 text-xs font-black uppercase text-neo-forest dark:text-neo-yellow">
                    HOSTED BY: {kmipnAward.publisher}
                  </p>
                  <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {kmipnAward.description}
                  </p>
                </div>

                <div className="mt-4 rounded-xl border-2 border-black bg-white p-3 dark:border-white/30 dark:bg-[#121620]">
                  <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-1">
                    Squad Teammates:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {kmipnAward.partners.map((p) => (
                      <span key={p} className="neo-badge rounded bg-neo-cream text-[10px] text-black dark:bg-[#202533] dark:text-white">
                        ✦ {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-black/10 dark:border-white/20 flex justify-end">
                <button
                  type="button"
                  onClick={() => copyAwardRecord(kmipnAward)}
                  className="neo-btn rounded-xl bg-white px-3 py-1.5 text-xs font-black uppercase text-black dark:bg-[#202533] dark:text-white"
                >
                  <Copy className="h-3.5 w-3.5 inline mr-1" />
                  Copy Record
                </button>
              </div>
            </div>
          )}

          {/* Podium 2: 2nd Place Silver Winner UI/UX */}
          {silverAward && (
            <div className="neo-box rounded-3xl border-[3px] border-black bg-neo-yellow/20 p-6 dark:border-white dark:bg-[#1e2333] shadow-brutal flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b-2 border-black/15 pb-4 dark:border-white/20">
                  <span className="neo-badge rounded-md bg-neo-yellow text-black font-black text-xs">
                    🥈 2ND PLACE PODIUM
                  </span>
                  <span className="font-mono text-xs font-black text-slate-700 dark:text-slate-300">
                    {silverAward.date}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-display text-xl font-black uppercase tracking-tight text-black dark:text-white leading-tight">
                    {silverAward.name}
                  </h3>
                  <p className="mt-1 text-xs font-black uppercase text-neo-forest dark:text-neo-yellow">
                    HOSTED BY: {silverAward.publisher}
                  </p>
                  <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {silverAward.description}
                  </p>
                </div>

                <div className="mt-4 rounded-xl border-2 border-black bg-white p-3 dark:border-white/30 dark:bg-[#121620]">
                  <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-1">
                    Squad Teammates:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {silverAward.partners.map((p) => (
                      <span key={p} className="neo-badge rounded bg-neo-cream text-[10px] text-black dark:bg-[#202533] dark:text-white">
                        ✦ {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-black/10 dark:border-white/20 flex justify-end">
                <button
                  type="button"
                  onClick={() => copyAwardRecord(silverAward)}
                  className="neo-btn rounded-xl bg-white px-3 py-1.5 text-xs font-black uppercase text-black dark:bg-[#202533] dark:text-white"
                >
                  <Copy className="h-3.5 w-3.5 inline mr-1" />
                  Copy Record
                </button>
              </div>
            </div>
          )}

          {/* Podium 3: National CTF Top 18 */}
          {top18Award && (
            <div className="neo-box rounded-3xl border-[3px] border-black bg-neo-sky/20 p-6 dark:border-white dark:bg-[#162338] shadow-brutal flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b-2 border-black/15 pb-4 dark:border-white/20">
                  <span className="neo-badge rounded-md bg-neo-sky text-black font-black text-xs">
                    🛡️ TOP 18 NATIONAL CTF
                  </span>
                  <span className="font-mono text-xs font-black text-slate-700 dark:text-slate-300">
                    {top18Award.date}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-display text-xl font-black uppercase tracking-tight text-black dark:text-white leading-tight">
                    {top18Award.name}
                  </h3>
                  <p className="mt-1 text-xs font-black uppercase text-neo-forest dark:text-neo-yellow">
                    HOSTED BY: {top18Award.publisher}
                  </p>
                  <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {top18Award.description}
                  </p>
                </div>

                <div className="mt-4 rounded-xl border-2 border-black bg-white p-3 dark:border-white/30 dark:bg-[#121620]">
                  <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-1">
                    Squad Teammates:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {top18Award.partners.map((p) => (
                      <span key={p} className="neo-badge rounded bg-neo-cream text-[10px] text-black dark:bg-[#202533] dark:text-white">
                        ✦ {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-black/10 dark:border-white/20 flex justify-end">
                <button
                  type="button"
                  onClick={() => copyAwardRecord(top18Award)}
                  className="neo-btn rounded-xl bg-white px-3 py-1.5 text-xs font-black uppercase text-black dark:bg-[#202533] dark:text-white"
                >
                  <Copy className="h-3.5 w-3.5 inline mr-1" />
                  Copy Record
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* All Awards List */}
      <div className="space-y-6">
        {filteredAwards.map((award, idx) => {
          const isCtf = getTrack(award) === "Cybersecurity CTF";
          return (
            <div
              key={`${award.name}-${award.date}`}
              className="neo-box neo-box-hover rounded-3xl bg-white p-6 sm:p-8 dark:bg-[#181b24] dark:border-white"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between border-b-[2.5px] border-black pb-5 dark:border-white">
                <div className="flex items-start gap-4">
                  <div
                    className={`neo-btn h-14 w-14 shrink-0 rounded-2xl text-black p-0 ${
                      isCtf
                        ? "bg-neo-sky dark:bg-neo-sky"
                        : "bg-neo-yellow dark:bg-neo-yellow"
                    }`}
                  >
                    {isCtf ? (
                      <Medal className="h-7 w-7 stroke-[2.5]" />
                    ) : (
                      <Trophy className="h-7 w-7 stroke-[2.5]" />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="neo-badge rounded-md bg-neo-rose text-black font-black">
                        ★ {award.rank}
                      </span>
                      <span className="neo-badge rounded-md bg-white text-black dark:bg-[#202533] dark:text-white">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {award.date}
                      </span>
                      <span className="neo-badge rounded-md bg-neo-cream text-black dark:bg-[#202533] dark:text-white">
                        {isCtf ? "Cybersecurity Track" : "UI/UX Design Track"}
                      </span>
                    </div>

                    <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white">
                      {award.name}
                    </h2>
                    <p className="mt-1 text-xs font-black uppercase text-neo-forest dark:text-neo-yellow">
                      ORGANIZER: {award.publisher}
                    </p>
                    {award.description && (
                      <p className="mt-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                        {award.description}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => copyAwardRecord(award)}
                  className="neo-btn rounded-xl bg-slate-100 p-2 text-black hover:bg-neo-yellow dark:bg-[#202533] dark:text-white self-start"
                  title="Copy award record"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              {/* Teammates List */}
              <PartnerList partners={award.partners} compact />
            </div>
          );
        })}
      </div>
    </div>
  )}

  {/* View Mode 2: High-Density Matrix */}
  {viewMode === "matrix" && (
    <div className="neo-box overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-neo-darkcard dark:border-white">
      <div className="px-4 py-2 border-b border-black/10 dark:border-white/20 sm:hidden bg-neo-sky/20 text-[11px] font-mono font-bold text-black dark:text-slate-300 flex items-center justify-between">
        <span>← SWIPE TABLE HORIZONTALLY →</span>
        <span>[{filteredAwards.length} HONORS]</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-xs font-bold">
          <thead className="border-b-[2.5px] border-black bg-neo-sky text-black uppercase font-black dark:border-white">
            <tr>
              <th className="px-5 py-4">#</th>
              <th className="px-5 py-4">Award & Competition</th>
              <th className="px-5 py-4">Rank / Honor</th>
              <th className="px-5 py-4">Organizer</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Teammates</th>
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black/10 dark:divide-white/10 text-black dark:text-white">
            {filteredAwards.map((a, i) => (
              <tr
                key={`${a.name}-${i}`}
                className="transition-colors hover:bg-neo-yellow/20 dark:hover:bg-[#202533]"
              >
                <td className="px-5 py-4 font-mono font-black">{String(i + 1).padStart(2, "0")}</td>
                <td className="px-5 py-4 font-display font-black uppercase max-w-[260px]">
                  {a.name}
                </td>
                <td className="px-5 py-4">
                  <span className="neo-badge rounded bg-neo-rose text-black text-[10px] font-black whitespace-nowrap">
                    ★ {a.rank}
                  </span>
                </td>
                <td className="px-5 py-4 text-neo-forest dark:text-neo-yellow font-bold">
                  {a.publisher}
                </td>
                <td className="px-5 py-4 font-mono whitespace-nowrap">
                  {a.date}
                </td>
                <td className="px-5 py-4 max-w-[200px]">
                  <div className="flex flex-wrap gap-1">
                    {a.partners.map((p) => (
                      <span key={p} className="neo-badge rounded bg-neo-cream text-[10px] text-black dark:bg-[#202533] dark:text-white">
                        {p}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => copyAwardRecord(a)}
                    className="neo-btn rounded-lg bg-white px-3 py-1 text-xs font-black uppercase text-black hover:bg-neo-yellow dark:bg-[#121620] dark:text-white"
                  >
                    Copy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}
</PageShell>
  );
}
