import { useMemo, useState } from "react";
import {
  Award,
  Calendar,
  CheckCircle2,
  Copy,
  Medal,
  ShieldAlert,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { awards } from "../data/awards.js";
import PageShell from "../components/PageShell.jsx";
import PartnerList from "../components/PartnerList.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function AwardsPage() {
  const [selectedTrack, setSelectedTrack] = useState("All");
  const { showToast } = useToast();

  const getTrack = (award) => {
    const n = award.name.toLowerCase();
    if (n.includes("ctf") || n.includes("capture the flag")) return "Cybersecurity CTF";
    return "UI/UX Design";
  };

  const tracks = ["All", "Cybersecurity CTF", "UI/UX Design"];

  const filteredAwards = useMemo(() => {
    if (selectedTrack === "All") return awards;
    return awards.filter((a) => getTrack(a) === selectedTrack);
  }, [selectedTrack]);

  const copyAwardRecord = (award) => {
    navigator.clipboard.writeText(`${award.rank} — ${award.name} (${award.publisher}, ${award.date})`);
    showToast(`Copied award record!`);
  };

  // Find 2nd place award for the spotlight
  const silverAward = awards.find((a) => a.rank.includes("2nd Place"));
  const top18Award = awards.find((a) => a.rank.includes("Top 18"));

  return (
    <PageShell
      eyebrow="Competitions & Honors"
      title="Honors & Competitive Awards"
      description="Competitive track record across collegiate and national Cybersecurity tournaments (Capture The Flag / CTF) and UI/UX design competitions."
    >
      {/* Interactive Control & Track Switcher */}
      <div className="neo-box rounded-3xl bg-white p-5 sm:p-6 mb-8 dark:bg-neo-darkcard dark:border-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="neo-btn h-12 w-12 rounded-2xl bg-neo-yellow text-black p-0 flex items-center justify-center">
              <Trophy className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-display text-sm font-black uppercase text-black dark:text-white">
                Hall of Competitive Achievements
              </span>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                5 Collegiate & National Tournament Honors
              </p>
            </div>
          </div>

          {/* Track Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {tracks.map((track) => {
              const active = selectedTrack === track;
              const count =
                track === "All"
                  ? awards.length
                  : awards.filter((a) => getTrack(a) === track).length;
              return (
                <button
                  key={track}
                  type="button"
                  onClick={() => setSelectedTrack(track)}
                  className={`neo-btn flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-black uppercase tracking-wider ${
                    active
                      ? "bg-neo-yellow text-black dark:bg-neo-yellow dark:text-black dark:border-white"
                      : "bg-white text-black hover:bg-neo-palegreen dark:bg-[#181b24] dark:text-white"
                  }`}
                >
                  <span>{track}</span>
                  <span className="rounded px-1.5 py-0.2 text-[10px] font-mono bg-black/10 dark:bg-white/10">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TOURNAMENT PODIUM SPOTLIGHT (When All tracks selected) */}
      {selectedTrack === "All" && (
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          {/* Podium 1: 2nd Place Silver Winner */}
          {silverAward && (
            <div className="neo-box rounded-3xl border-[3px] border-black bg-neo-yellow/20 p-6 sm:p-8 dark:border-white dark:bg-[#1e2333] shadow-brutal flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b-2 border-black/15 pb-4 dark:border-white/20">
                  <span className="neo-badge rounded-md bg-neo-yellow text-black font-black text-xs">
                    🥈 2ND PLACE PODIUM WINNER
                  </span>
                  <span className="font-mono text-xs font-black text-slate-700 dark:text-slate-300">
                    {silverAward.date}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-display text-2xl font-black uppercase tracking-tight text-black dark:text-white">
                    {silverAward.name}
                  </h3>
                  <p className="mt-1 text-xs font-black uppercase text-neo-forest dark:text-neo-yellow">
                    HOSTED BY: {silverAward.publisher}
                  </p>
                </div>

                <div className="mt-4 rounded-xl border-2 border-black bg-white p-3.5 dark:border-white/30 dark:bg-[#121620]">
                  <span className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-1">
                    Squad Teammates:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {silverAward.partners.map((p) => (
                      <span key={p} className="neo-badge rounded bg-neo-cream text-[11px] text-black dark:bg-[#202533] dark:text-white">
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

          {/* Podium 2: National CTF Top 18 */}
          {top18Award && (
            <div className="neo-box rounded-3xl border-[3px] border-black bg-neo-sky/20 p-6 sm:p-8 dark:border-white dark:bg-[#162338] shadow-brutal flex flex-col justify-between">
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
                  <h3 className="font-display text-2xl font-black uppercase tracking-tight text-black dark:text-white">
                    {top18Award.name}
                  </h3>
                  <p className="mt-1 text-xs font-black uppercase text-neo-forest dark:text-neo-yellow">
                    HOSTED BY: {top18Award.publisher}
                  </p>
                </div>

                <div className="mt-4 rounded-xl border-2 border-black bg-white p-3.5 dark:border-white/30 dark:bg-[#121620]">
                  <span className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-1">
                    Squad Teammates:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {top18Award.partners.map((p) => (
                      <span key={p} className="neo-badge rounded bg-neo-cream text-[11px] text-black dark:bg-[#202533] dark:text-white">
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
    </PageShell>
  );
}
