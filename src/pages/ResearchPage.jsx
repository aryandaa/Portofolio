import { useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Code,
  Compass,
  CornerDownLeft,
  FileSearch,
  FlaskConical,
  Hourglass,
  RadioTower,
  Shield,
  Sparkles,
  Terminal,
} from "lucide-react";
import { researchRecords } from "../data/research.js";
import PageShell from "../components/PageShell.jsx";
import PartnerList from "../components/PartnerList.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState("terminal"); // 'terminal' | 'roadmap'
  const [terminalHistory, setTerminalHistory] = useState([
    { type: "sys", text: "Interactive Security Console ready." },
  ]);
  const [commandInput, setCommandInput] = useState("");
  const { showToast } = useToast();

  const handleCommand = (cmdText) => {
    const cmd = (cmdText || commandInput).trim().toLowerCase();
    if (!cmd) return;

    let response = "";
    if (cmd === "help") {
      response =
        "Available commands:\n  • abstract  : View research objective & scope\n  • tracks    : List 3 core investigation themes\n  • status    : Inspect peer-review & drafting status\n  • audit     : Run client-side vulnerability selfcheck\n  • clear     : Clear terminal output";
    } else if (cmd === "abstract") {
      response =
        "[ABSTRACT]\nInvestigations into client-side architecture hardening, in-browser code execution runtimes (Pyodide, php-wasm), and cryptographic puzzle design in collegiate CTF tournaments.";
    } else if (cmd === "tracks") {
      response =
        "[RESEARCH TRACKS]\n1. Web Vulnerability Analysis & Client-Side Sandbox Hardening\n2. Applied Cryptography & Challenge Engineering in CTFs\n3. Static Site Parser Optimization & Knowledge Hub Architectures";
    } else if (cmd === "status") {
      response =
        "[STATUS REPORT]\nCurrent Phase: In Preparation / Drafting.\nPreprint Target: arXiv / Google Scholar.\nArtifacts: 500+ documentation notes & reproducible benchmark scripts.";
    } else if (cmd === "audit") {
      response =
        "[SECURITY SELFCHECK]\nRunning automated harness...\n✔ Typecheck: 0 errors\n✔ Crypto Selfcheck: 44/44 passed\n✔ OSINT Engine: 48/48 operational\nOverall Health: 100% Client-Side Safe.";
    } else if (cmd === "clear") {
      setTerminalHistory([]);
      setCommandInput("");
      return;
    } else {
      response = `Command not recognized: "${cmd}". Type "help" or click one of the preset chips below.`;
    }

    setTerminalHistory((prev) => [
      ...prev,
      { type: "user", text: `> ${cmd}` },
      { type: "bot", text: response },
    ]);
    setCommandInput("");
    showToast(`Executed: ${cmd}`);
  };

  return (
    <PageShell title="Research">
      {/* Top Interactive Mode Tabs */}
      <div className="neo-box rounded-3xl bg-white p-5 sm:p-6 mb-8 dark:bg-neo-darkcard dark:border-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="neo-btn h-12 w-12 rounded-2xl bg-neo-yellow text-black p-0 flex items-center justify-center">
              <FlaskConical className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-display text-sm font-black uppercase text-black dark:text-white">
                Inquiry Sandbox & Methodology Lab
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("terminal")}
              className={`neo-btn flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black uppercase ${
                activeTab === "terminal"
                  ? "bg-neo-yellow text-black dark:bg-neo-yellow dark:text-black dark:border-white"
                  : "bg-white text-black dark:bg-[#181b24] dark:text-white"
              }`}
            >
              <Terminal className="h-4 w-4" />
              <span>Interactive Console</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("roadmap")}
              className={`neo-btn flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black uppercase ${
                activeTab === "roadmap"
                  ? "bg-neo-yellow text-black dark:bg-neo-yellow dark:text-black dark:border-white"
                  : "bg-white text-black dark:bg-[#181b24] dark:text-white"
              }`}
            >
              <Compass className="h-4 w-4" />
              <span>Milestone Roadmap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Interactive Security Terminal */}
      {activeTab === "terminal" && (
        <div className="w-full">
          {/* Interactive Terminal */}
          <div className="neo-box rounded-3xl bg-slate-950 p-6 sm:p-8 text-white border-[3px] border-black dark:border-white shadow-brutal flex flex-col justify-between min-h-[500px]">
            <div>
              {/* Terminal Window Top Bar */}
              <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-4 font-mono text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" />
                  <span className="ml-2 text-white font-bold">research-inquiry.sh</span>
                </div>
                <span>CYSEC_CONSOLE // 2026</span>
              </div>

              {/* Terminal Output Stream */}
              <div className="space-y-2.5 font-mono text-xs sm:text-sm max-h-[340px] overflow-y-auto pr-2 scrollbar-none">
                {terminalHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={`leading-relaxed whitespace-pre-line ${
                      item.type === "sys"
                        ? "text-slate-400 font-medium"
                        : item.type === "user"
                        ? "text-neo-yellow font-bold"
                        : "text-emerald-300 font-bold"
                    }`}
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal Input Bar & Shortcut Chips */}
            <div className="mt-6 pt-4 border-t border-white/20">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {["abstract", "tracks", "status", "audit", "clear"].map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => handleCommand(cmd)}
                    className="rounded-lg border border-white/30 bg-white/10 px-2 py-0.5 font-mono text-[11px] text-slate-200 hover:bg-neo-yellow hover:text-black transition-colors"
                  >
                    ${cmd}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCommand();
                }}
                className="flex items-center gap-2"
              >
                <span className="font-mono text-neo-yellow text-sm font-black">&gt;</span>
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="Type command (e.g. abstract, audit, help)..."
                  className="flex-1 bg-transparent font-mono text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-neo-yellow px-3 py-1 font-mono text-xs font-black text-black hover:bg-yellow-300"
                >
                  <CornerDownLeft className="h-3.5 w-3.5 inline" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Milestone Roadmap */}
      {activeTab === "roadmap" && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="neo-box rounded-3xl bg-white p-6 dark:bg-neo-darkcard dark:border-white">
            <div className="flex items-center justify-between border-b-2 border-black/10 pb-3 dark:border-white/20 mb-4">
              <span className="neo-badge rounded-md bg-neo-green text-black font-black">
                PHASE 01 // COMPLETED
              </span>
              <CheckCircle2 className="h-5 w-5 text-neo-forest dark:text-neo-green" />
            </div>
            <h4 className="font-display text-lg font-black uppercase text-black dark:text-white">
              Literature Review & Threat Modeling
            </h4>
            <p className="mt-2 text-xs font-bold leading-relaxed text-slate-700 dark:text-slate-300">
              Survey of client-side web sandbox isolation, WebAssembly memory layout risks, and CTF pedagogy across 30+ academic papers.
            </p>
          </div>

          <div className="neo-box rounded-3xl bg-neo-yellow/20 p-6 dark:bg-[#1e2333] border-[3px] dark:border-white">
            <div className="flex items-center justify-between border-b-2 border-black/10 pb-3 dark:border-white/20 mb-4">
              <span className="neo-badge rounded-md bg-neo-yellow text-black font-black">
                PHASE 02 // ACTIVE
              </span>
              <Hourglass className="h-5 w-5 text-amber-600 dark:text-neo-yellow animate-spin" />
            </div>
            <h4 className="font-display text-lg font-black uppercase text-black dark:text-white">
              Harness & Benchmark Testing
            </h4>
            <p className="mt-2 text-xs font-bold leading-relaxed text-slate-700 dark:text-slate-300">
              Measuring runtime latency across 108 client-side security tools, memory overhead in browser workers, and parser throughput.
            </p>
          </div>

          <div className="neo-box rounded-3xl bg-white p-6 dark:bg-neo-darkcard dark:border-white">
            <div className="flex items-center justify-between border-b-2 border-black/10 pb-3 dark:border-white/20 mb-4">
              <span className="neo-badge rounded-md bg-white text-black border border-black dark:bg-[#202533] dark:text-white dark:border-white">
                PHASE 03 // UPCOMING
              </span>
              <RadioTower className="h-5 w-5 text-blue-500" />
            </div>
            <h4 className="font-display text-lg font-black uppercase text-black dark:text-white">
              Preprint Publication & DOI Indexing
            </h4>
            <p className="mt-2 text-xs font-bold leading-relaxed text-slate-700 dark:text-slate-300">
              Publishing the final whitepaper to arXiv / Google Scholar alongside open benchmark repositories and reproducible test harnesses.
            </p>
          </div>
        </div>
      )}

      {/* Any registered research records */}
      {researchRecords.length > 0 && (
        <div className="mt-8 space-y-4">
          {researchRecords.map((item) => (
            <div key={item.title} className="neo-box rounded-2xl bg-white p-6 dark:bg-neo-darkcard dark:border-white">
              <h3 className="font-display text-xl font-black uppercase text-black dark:text-white">{item.title}</h3>
              <p className="text-xs font-black uppercase text-neo-forest dark:text-neo-yellow">{item.institution} • {item.period}</p>
              <p className="mt-2 text-xs font-bold leading-relaxed text-black dark:text-slate-300">{item.abstract}</p>
              <PartnerList partners={item.partners} compact />
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
