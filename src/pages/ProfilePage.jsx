import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Code2,
  Copy,
  Cpu,
  Download,
  ExternalLink as ExternalLinkIcon,
  FileCheck,
  FolderKanban,
  Github,
  Globe,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { profile } from "../data/profile.js";
import { experiences } from "../data/experiences.js";
import { technicalProjects } from "../data/projects.js";
import { certifications } from "../data/certifications.js";
import { awards } from "../data/awards.js";
import { booksRead } from "../data/books.js";
import { researchRecords } from "../data/research.js";
import AssetPreview from "../components/AssetPreview.jsx";
import ExternalLink from "../components/ExternalLink.jsx";
import { useToast } from "../context/ToastContext.jsx";

const techLogos = [
  { name: "React.js", slug: "react", mark: "React" },
  { name: "Laravel", slug: "laravel", mark: "Laravel" },
  { name: "PHP", slug: "php", mark: "PHP" },
  { name: "JavaScript", slug: "javascript", mark: "JS" },
  { name: "Tailwind CSS", slug: "tailwindcss", mark: "Tailwind" },
  { name: "HTML5", slug: "html5", mark: "HTML5" },
  { name: "CSS3", slug: "css3", mark: "CSS3" },
  { name: "Bootstrap", slug: "bootstrap", mark: "Bootstrap" },
  { name: "MySQL", slug: "mysql", mark: "MySQL" },
  { name: "Python", slug: "python", mark: "Python" },
  { name: "Express.js", slug: "express", mark: "Express" },
  { name: "WordPress", slug: "wordpress", mark: "WordPress" },
  { name: "Git", slug: "git", mark: "Git" },
  { name: "GitHub", slug: "github", mark: "GitHub" },
  { name: "GNU Bash", slug: "gnubash", mark: "Bash" },
  { name: "Linux", slug: "linux", mark: "Linux" },
  { name: "Vercel", slug: "vercel", mark: "Vercel" },
  { name: "Figma", slug: "figma", mark: "Figma" },
];

function normalizeSkill(skill) {
  return typeof skill === "string" ? { name: skill } : skill;
}

function getSkillLevelBadge(level) {
  const norm = level?.toLowerCase();
  if (norm === "advanced") {
    return "bg-neo-green text-black border-black dark:border-white";
  }
  if (norm === "intermediate") {
    return "bg-neo-yellow text-black border-black dark:border-white";
  }
  return "bg-neo-sky text-black border-black dark:border-white";
}

function TechLogoIcon({ tech }) {
  const [hasError, setHasError] = useState(false);
  if (hasError) {
    return <span className="font-black text-xs uppercase">{tech.mark}</span>;
  }
  return (
    <img
      src={`https://cdn.simpleicons.org/${tech.slug}/000000`}
      alt={`${tech.name} logo`}
      className="h-5 w-5 object-contain dark:invert"
      draggable="false"
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}

function addPartnerActivities(partnerMap, partners = [], activity) {
  partners.forEach((partner) => {
    const name = String(partner).trim();
    const key = name.toLowerCase();
    if (!name || key === "solo") return;
    const current = partnerMap.get(key) ?? { name, activities: new Set() };
    current.activities.add(activity);
    partnerMap.set(key, current);
  });
}

function getPartnerThanks() {
  const partnerMap = new Map();
  experiences.forEach((item) => {
    addPartnerActivities(partnerMap, item.partners, `Experience: ${item.place}`);
  });
  technicalProjects.forEach((item) => {
    addPartnerActivities(partnerMap, item.partners, `Project: ${item.name}`);
  });
  awards.forEach((item) => {
    addPartnerActivities(partnerMap, item.partners, `Award: ${item.name}`);
  });
  researchRecords.forEach((item) => {
    addPartnerActivities(partnerMap, item.partners, `Research: ${item.title}`);
  });

  return Array.from(partnerMap.values())
    .map((partner) => ({
      ...partner,
      activities: Array.from(partner.activities),
    }))
    .sort((a, b) => b.activities.length - a.activities.length || a.name.localeCompare(b.name));
}

export default function ProfilePage({ navigate = (id) => (window.location.hash = id) }) {
  const [selectedPersona, setSelectedPersona] = useState("fullstack"); // 'fullstack' | 'cybersec' | 'uiux'
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [skillSearch, setSkillSearch] = useState("");
  const [selectedSkillCategory, setSelectedSkillCategory] = useState("All");
  const [expandedPillar, setExpandedPillar] = useState(0);
  const { showToast } = useToast();

  const photos = profile.photos?.length > 0 ? profile.photos : profile.photo ? [profile.photo] : [];
  const hasMultiplePhotos = photos.length > 1;

  useEffect(() => {
    if (!hasMultiplePhotos) return undefined;
    const intervalId = window.setInterval(() => {
      setActivePhotoIndex((current) => (current === photos.length - 1 ? 0 : current + 1));
    }, 4500);
    return () => window.clearInterval(intervalId);
  }, [hasMultiplePhotos, photos.length]);

  const personas = {
    fullstack: {
      title: "Full-Stack Architect",
      stamp: "SYSTEMS & WEB",
      badgeColor: "bg-neo-green text-black",
      headline: "Scalable Web Engines & Client-Side Compilers",
      description:
        "Building production React systems, Laravel Filament management suites, and serverless zero-DB pipelines. Architect of CodeLearn (8-stage Markdown-to-static compiler with 500+ notes & 7 client-side runtimes).",
      tags: ["React 18", "TypeScript", "Node.js", "Laravel Filament", "Tailwind CSS", "Vercel"],
      stats: { primary: "11 Projects", secondary: "8-Stage Pipeline", callout: "0 Server Cost" },
    },
    cybersec: {
      title: "CyberSecurity Researcher",
      stamp: "THREAT & CTF",
      badgeColor: "bg-neo-sky text-black",
      headline: "Client-Side Sandboxing & Applied Cryptography",
      description:
        "Active collegiate CTF competitor and founder of Makat-Xploit. Researching web vulnerability mitigation, browser memory isolation in WASM/Pyodide, and cryptographic challenge engineering.",
      tags: ["Cryptography", "Web Exploitation", "CTF Engineering", "Linux Hardening", "Pyodide Sandbox"],
      stats: { primary: "Top 18 National", secondary: "108 CySec Tools", callout: "44/44 Crypto Tests" },
    },
    uiux: {
      title: "UI/UX Craftsman",
      stamp: "HUMAN EXPERIENCE",
      badgeColor: "bg-neo-rose text-black",
      headline: "Expressive Design Systems & Gamification",
      description:
        "Transforming complex technical platforms into delightful, tactile digital spaces. Winner of 2nd Place UI/UX Poliban Competition 2024 and creator of EduQuestify gamified education platform.",
      tags: ["Figma Systems", "Neobrutalism", "Responsive Architecture", "Micro-Interactions"],
      stats: { primary: "2nd Place Winner", secondary: "Design Systems", callout: "WCAG AAA Ready" },
    },
  };

  const current = personas[selectedPersona];

  const copyText = (val, label) => {
    navigator.clipboard.writeText(val);
    showToast(`Copied ${label} to clipboard!`);
  };

  // Skill search & category filtering
  const skillCategories = useMemo(() => {
    return ["All", ...profile.skills.map((s) => s.category)];
  }, []);

  const filteredSkillGroups = useMemo(() => {
    return profile.skills
      .map((group) => {
        const matchesCategory =
          selectedSkillCategory === "All" || group.category === selectedSkillCategory;
        if (!matchesCategory) return null;

        const q = skillSearch.toLowerCase().trim();
        const matchingItems = group.items.filter((skill) => {
          if (!q) return true;
          const item = normalizeSkill(skill);
          return (
            item.name.toLowerCase().includes(q) ||
            (item.context && item.context.toLowerCase().includes(q))
          );
        });

        if (matchingItems.length === 0) return null;
        return {
          ...group,
          items: matchingItems,
        };
      })
      .filter(Boolean);
  }, [selectedSkillCategory, skillSearch]);

  const codelearn = technicalProjects.find((p) => p.name === "CodeLearn") || technicalProjects[0];

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* =========================================================================
          HERO MASTER: ASYMMETRIC CLEARANCE DOSSIER & COMMAND DECK
          ========================================================================= */}
      <section className="relative">
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* LEFT: EDITORIAL INTRO & INTERACTIVE CONSOLE (Cols 7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Identity Kicker Tape */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="neo-badge rounded-md bg-neo-yellow text-black font-black text-xs -rotate-1">
                ★ POLIBAN STUDENT // D3 INFORMATION SYSTEMS
              </span>
              <span className="neo-badge rounded-md bg-neo-green text-black font-black text-xs rotate-1">
                ⚡ GPA 3.91 / 4.00
              </span>
              <span className="neo-badge rounded-md bg-white text-black font-mono text-xs dark:bg-[#1f2430] dark:text-white">
                📍 BANJARMASIN, ID
              </span>
            </div>

            {/* Giant Punchy Display Typography */}
            <div>
              <h1 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-black dark:text-white leading-[0.95]">
                M. Aryanda Sanggadiennata
              </h1>
              <p className="mt-3 text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300">
                {profile.tagline}
              </p>
            </div>

            {/* Interactive Role Switcher Deck */}
            <div className="neo-box rounded-3xl bg-white p-5 sm:p-6 dark:bg-neo-darkcard dark:border-white shadow-brutal">
              <div className="flex items-center justify-between border-b-2 border-black/10 pb-3 dark:border-white/20 mb-4">
                <span className="text-xs font-black uppercase text-black dark:text-neo-yellow flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  <span>Interactive Role Console</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  CLICK TO SWITCH FOCUS
                </span>
              </div>

              {/* 3 Clickable Persona Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPersona("fullstack");
                    showToast("Switched to Full-Stack Architect view");
                  }}
                  className={`neo-btn rounded-xl py-2 px-1 text-center text-xs font-black uppercase transition-all ${
                    selectedPersona === "fullstack"
                      ? "bg-neo-green text-black shadow-brutal-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-[#1e2330] dark:text-slate-300"
                  }`}
                >
                  ⚡ Full-Stack
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPersona("cybersec");
                    showToast("Switched to CyberSecurity Researcher view");
                  }}
                  className={`neo-btn rounded-xl py-2 px-1 text-center text-xs font-black uppercase transition-all ${
                    selectedPersona === "cybersec"
                      ? "bg-neo-sky text-black shadow-brutal-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-[#1e2330] dark:text-slate-300"
                  }`}
                >
                  🛡️ CyberSec
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPersona("uiux");
                    showToast("Switched to UI/UX Craftsman view");
                  }}
                  className={`neo-btn rounded-xl py-2 px-1 text-center text-xs font-black uppercase transition-all ${
                    selectedPersona === "uiux"
                      ? "bg-neo-rose text-black shadow-brutal-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-[#1e2330] dark:text-slate-300"
                  }`}
                >
                  🎨 UI/UX
                </button>
              </div>

              {/* Dynamic Console Output */}
              <div className="mt-4 rounded-2xl border-2 border-black bg-neo-bg p-4 dark:border-white/30 dark:bg-[#121620] space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`neo-badge rounded text-[10px] font-black ${current.badgeColor}`}>
                    {current.stamp}
                  </span>
                  <span className="font-mono text-xs font-black text-neo-forest dark:text-neo-yellow">
                    {current.stats.callout}
                  </span>
                </div>

                <h3 className="font-display text-base sm:text-lg font-black uppercase text-black dark:text-white leading-snug">
                  {current.headline}
                </h3>

                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {current.description}
                </p>

                {/* Stack Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {current.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-black/30 bg-white px-2 py-0.5 text-[10px] font-black text-black dark:border-white/30 dark:bg-[#202533] dark:text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="mt-5 flex flex-wrap gap-3">
                <ExternalLink href={profile.cvUrl} download variant="yellow">
                  <Download className="h-4 w-4 stroke-[2.5]" />
                  Download Full CV
                </ExternalLink>
                <button
                  type="button"
                  onClick={() => navigate("projects")}
                  className="neo-btn rounded-xl bg-neo-green px-4 py-2 text-xs font-black uppercase text-black hover:bg-emerald-300 dark:bg-neo-sky dark:text-black"
                >
                  <Code2 className="h-4 w-4 stroke-[2.5]" />
                  Explore Projects
                </button>
                <button
                  type="button"
                  onClick={() => copyText(profile.email, "Email")}
                  className="neo-btn rounded-xl bg-white px-3 py-2 text-xs font-black uppercase text-black hover:bg-slate-100 dark:bg-[#202533] dark:text-white"
                  title="Copy Email Address"
                >
                  <Copy className="h-4 w-4 inline mr-1" />
                  Email
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: PHYSICAL CYBER CLEARANCE BADGE (Cols 5) */}
          <div className="lg:col-span-5">
            <div className="relative neo-box rounded-3xl bg-neo-yellow p-6 dark:bg-[#181b24] dark:border-white shadow-brutal-lg">
              {/* Lanyard Top Slot Graphic */}
              <div className="mx-auto mb-4 h-2.5 w-16 rounded-full border-2 border-black bg-black/20 dark:border-white dark:bg-white/20" />

              {/* Clearance Badge Header */}
              <div className="flex items-center justify-between border-b-2 border-black pb-3 dark:border-white mb-4">
                <div>
                  <span className="font-mono text-[9px] font-black uppercase tracking-widest text-black/70 dark:text-slate-400 block">
                    SECURITY CLEARANCE BADGE
                  </span>
                  <span className="font-display text-sm font-black uppercase text-black dark:text-white">
                    POLIBAN // D3-SI // 2026
                  </span>
                </div>
                <span className="neo-badge rounded-md bg-neo-rose text-black text-[10px] font-black animate-pulse">
                  ● ACTIVE
                </span>
              </div>

              {/* High-Contrast Photo Frame with Multiple Photos Toggle */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-[3px] border-black bg-black dark:border-white">
                {photos.length > 0 ? (
                  <>
                    <AssetPreview
                      src={photos[activePhotoIndex]}
                      alt={`${profile.name} clearance photo`}
                      className="h-full w-full object-cover"
                    />

                    {/* Photo Switcher Overlay Controls */}
                    {hasMultiplePhotos && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setActivePhotoIndex((c) => (c === 0 ? photos.length - 1 : c - 1))
                          }
                          className="neo-btn absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-white p-0 text-black hover:bg-neo-yellow"
                          aria-label="Previous photo"
                        >
                          <ChevronLeft className="h-4 w-4 stroke-[3]" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setActivePhotoIndex((c) => (c === photos.length - 1 ? 0 : c + 1))
                          }
                          className="neo-btn absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-white p-0 text-black hover:bg-neo-yellow"
                          aria-label="Next photo"
                        >
                          <ChevronRight className="h-4 w-4 stroke-[3]" />
                        </button>

                        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                          {photos.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActivePhotoIndex(idx)}
                              className={`h-2 border border-black transition-all ${
                                activePhotoIndex === idx
                                  ? "w-5 bg-neo-yellow"
                                  : "w-2 bg-white"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center text-white font-black">
                    NO PHOTO
                  </div>
                )}
              </div>

              {/* Holographic Verification Seal */}
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] font-black uppercase text-slate-700 dark:text-slate-400">
                    ACADEMIC ACCREDITATION
                  </span>
                  <p className="font-display text-2xl font-black text-black dark:text-neo-yellow">
                    GPA 3.91 <span className="text-xs font-mono font-bold">/ 4.00</span>
                  </p>
                </div>
                <div className="rounded-xl border-2 border-black bg-white px-3 py-1.5 text-center dark:bg-black dark:border-white">
                  <span className="block text-[8px] font-mono font-black uppercase text-slate-500">SEAL</span>
                  <span className="text-[10px] font-black text-neo-forest dark:text-neo-yellow">VERIFIED ★</span>
                </div>
              </div>

              {/* Direct Social Links */}
              <div className="mt-4 grid grid-cols-2 gap-2 border-t-2 border-black/15 pt-3 dark:border-white/20">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="neo-btn rounded-xl bg-white py-1.5 text-center text-xs font-black uppercase text-black hover:bg-slate-100 dark:bg-[#202533] dark:text-white"
                >
                  <Github className="h-3.5 w-3.5 inline mr-1" /> GitHub
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="neo-btn rounded-xl bg-white py-1.5 text-center text-xs font-black uppercase text-black hover:bg-slate-100 dark:bg-[#202533] dark:text-white"
                >
                  <Linkedin className="h-3.5 w-3.5 inline mr-1" /> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED CAPSTONE STAGE: CODELEARN (INTERACTIVE WORKSTATION)
          ========================================================================= */}
      <section className="relative">
        <div className="neo-box rounded-3xl border-[3px] border-black bg-neo-green/30 p-6 sm:p-8 dark:border-white dark:bg-[#182030] shadow-brutal-lg">
          {/* Workstation Window Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-4 dark:border-white">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-full border border-black bg-rose-500 dark:border-white" />
              <span className="h-3.5 w-3.5 rounded-full border border-black bg-yellow-500 dark:border-white" />
              <span className="h-3.5 w-3.5 rounded-full border border-black bg-emerald-500 dark:border-white" />
              <span className="ml-3 font-mono text-xs font-black uppercase text-black dark:text-white">
                codelearn.aryanda.dev // 100% Client-Side Engine
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="neo-badge rounded bg-neo-yellow text-black text-[10px] font-black">
                ★ SIGNATURE SYSTEM
              </span>
              {codelearn.projectUrl && (
                <a
                  href={codelearn.projectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="neo-btn rounded-xl bg-black px-3.5 py-1 text-xs font-black uppercase text-white hover:bg-slate-800 dark:bg-white dark:text-black"
                >
                  Launch App ↗
                </a>
              )}
            </div>
          </div>

          {/* Workstation Content Grid */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-4">
              <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white">
                CodeLearn: Personal Knowledge & Security Lab
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                Transforms an Obsidian Vault into an ultra-fast static React web platform using a custom 8-stage compiler pipeline. Zero backend server costs, 108 CySec & OSINT tools, and 7 client-side language runtimes (Pyodide, php-wasm, sql.js) running in browser memory.
              </p>

              {/* 4 Callout Meters */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border-2 border-black bg-white p-3 text-center dark:border-white/30 dark:bg-[#202533]">
                  <span className="block font-display text-xl font-black text-black dark:text-neo-yellow">500+</span>
                  <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400">Obsidian Notes</span>
                </div>
                <div className="rounded-xl border-2 border-black bg-white p-3 text-center dark:border-white/30 dark:bg-[#202533]">
                  <span className="block font-display text-xl font-black text-black dark:text-neo-sky">108</span>
                  <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400">CySec Tools</span>
                </div>
                <div className="rounded-xl border-2 border-black bg-white p-3 text-center dark:border-white/30 dark:bg-[#202533]">
                  <span className="block font-display text-xl font-black text-black dark:text-neo-rose">7</span>
                  <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400">Language Runtimes</span>
                </div>
                <div className="rounded-xl border-2 border-black bg-white p-3 text-center dark:border-white/30 dark:bg-[#202533]">
                  <span className="block font-display text-xl font-black text-black dark:text-neo-green">$0</span>
                  <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400">Database Cost</span>
                </div>
              </div>
            </div>

            {/* Pipeline Stage Visualizer */}
            <div className="rounded-2xl border-2 border-black bg-white p-5 dark:border-white dark:bg-[#121620] flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-black uppercase text-neo-forest dark:text-neo-yellow block mb-2">
                  ✦ 8-STAGE COMPILER PIPELINE
                </span>
                <div className="space-y-1.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-neo-green" />
                    <span>01. SCAN (Obsidian Vault traversal)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-neo-yellow" />
                    <span>02. VALIDATE (Frontmatter & link checks)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-neo-sky" />
                    <span>03. INDEX (Knowledge graph mapping)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-neo-rose" />
                    <span>04. RENDER (Client-side interactive AST)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>05-08. PUBLISH (Automated Vercel deployment)</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/20">
                <button
                  type="button"
                  onClick={() => navigate("projects")}
                  className="neo-btn w-full rounded-xl bg-neo-yellow py-2 text-center text-xs font-black uppercase text-black hover:bg-yellow-300"
                >
                  View All Technical Projects (11) →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ASYMMETRIC CONTROL BOARD: 4 DIVERSE TACTICAL BLOCKS
          ========================================================================= */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <span className="neo-badge rounded-md bg-neo-yellow text-black font-black">
            ★ VERIFIED RECORD VAULTS
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
            QUICK VAULT JUMP
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Experience */}
          <button
            type="button"
            onClick={() => navigate("experience")}
            className="neo-box neo-box-hover rounded-3xl bg-neo-yellow/30 p-6 text-left dark:bg-[#252216] dark:border-white transition-all -rotate-1 hover:rotate-0"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-black bg-white px-2 py-0.5 rounded border border-black dark:bg-black dark:text-white">
                [01] CAREER
              </span>
              <BriefcaseBusiness className="h-5 w-5 text-black dark:text-neo-yellow" />
            </div>
            <p className="text-4xl font-black text-black dark:text-white">
              6 Roles
            </p>
            <p className="mt-1 font-display text-sm font-black uppercase text-black dark:text-white">
              Work & Apprenticeships
            </p>
            <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              Open Synergic Laravel internship & CodingCamp 2026.
            </p>
            <span className="mt-4 inline-block text-xs font-black text-neo-forest dark:text-neo-yellow uppercase">
              View Timeline ↗
            </span>
          </button>

          {/* Card 2: Certifications */}
          <button
            type="button"
            onClick={() => navigate("certifications")}
            className="neo-box neo-box-hover rounded-3xl bg-neo-sky/30 p-6 text-left dark:bg-[#14202c] dark:border-white transition-all rotate-1 hover:rotate-0"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-black bg-white px-2 py-0.5 rounded border border-black dark:bg-black dark:text-white">
                [02] CERTS
              </span>
              <ShieldCheck className="h-5 w-5 text-black dark:text-neo-sky" />
            </div>
            <p className="text-4xl font-black text-black dark:text-white">
              22 Verified
            </p>
            <p className="mt-1 font-display text-sm font-black uppercase text-black dark:text-white">
              Licenses & Credentials
            </p>
            <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              Dicoding Full-Stack, Cisco CyberOps & Fortinet.
            </p>
            <span className="mt-4 inline-block text-xs font-black text-neo-forest dark:text-neo-sky uppercase">
              Inspect Credentials ↗
            </span>
          </button>

          {/* Card 3: Awards Podium */}
          <button
            type="button"
            onClick={() => navigate("awards")}
            className="neo-box neo-box-hover rounded-3xl bg-neo-rose/30 p-6 text-left dark:bg-[#25161e] dark:border-white transition-all -rotate-1 hover:rotate-0"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-black bg-white px-2 py-0.5 rounded border border-black dark:bg-black dark:text-white">
                [03] HONORS
              </span>
              <Trophy className="h-5 w-5 text-black dark:text-neo-rose" />
            </div>
            <p className="text-4xl font-black text-black dark:text-white">
              5 Awards
            </p>
            <p className="mt-1 font-display text-sm font-black uppercase text-black dark:text-white">
              Competitive Tournaments
            </p>
            <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              2nd Place UI/UX & Top 18 National CTF FIT.
            </p>
            <span className="mt-4 inline-block text-xs font-black text-neo-forest dark:text-neo-rose uppercase">
              Trophy Podium ↗
            </span>
          </button>

          {/* Card 4: Books Read */}
          <button
            type="button"
            onClick={() => navigate("books")}
            className="neo-box neo-box-hover rounded-3xl bg-neo-lavender/40 p-6 text-left dark:bg-[#1f1629] dark:border-white transition-all rotate-1 hover:rotate-0"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-black bg-white px-2 py-0.5 rounded border border-black dark:bg-black dark:text-white">
                [04] LITERACY
              </span>
              <BookOpen className="h-5 w-5 text-black dark:text-purple-300" />
            </div>
            <p className="text-4xl font-black text-black dark:text-white">
              31 Books
            </p>
            <p className="mt-1 font-display text-sm font-black uppercase text-black dark:text-white">
              Reflections & Reviews
            </p>
            <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              Average 4.8 ★ across Engineering & Philosophy.
            </p>
            <span className="mt-4 inline-block text-xs font-black text-neo-forest dark:text-purple-300 uppercase">
              Open Bookshelf ↗
            </span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          THREE PILLARS WITH CASE ACCORDION
          ========================================================================= */}
      <section>
        <div className="mb-4">
          <span className="neo-badge rounded-md bg-neo-green text-black font-black">
            ★ ENGINEERING FOUNDATIONS
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white mt-1">
            Three Interconnected Disciplines
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {profile.aboutFocus?.map((item, idx) => {
            const isExpanded = expandedPillar === idx;
            const colors = [
              "bg-neo-green text-black dark:bg-[#15231c] dark:text-white dark:border-white",
              "bg-neo-yellow text-black dark:bg-[#252014] dark:text-white dark:border-white",
              "bg-neo-sky text-black dark:bg-[#14202c] dark:text-white dark:border-white",
            ];
            const realCases = [
              "Engineered in CodeLearn: zero backend runtime, 8-stage compiler, and instant static performance on Vercel.",
              "Proven in Makat-Xploit & FIT CTF: browser WASM sandbox isolation and cryptographic puzzle engineering.",
              "Implemented in EduQuestify & FISIP ULM: gamified user progression, accessible typography, and responsive component libraries.",
            ];

            return (
              <div
                key={item.title}
                className={`neo-box rounded-3xl ${colors[idx % 3]} p-6 flex flex-col justify-between transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-black bg-white px-2.5 py-0.5 rounded border border-black text-black">
                      PILLAR 0{idx + 1}
                    </span>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h3 className="font-display text-xl font-black uppercase text-black dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm font-bold leading-relaxed text-black/90 dark:text-slate-200">
                    {item.description}
                  </p>

                  {isExpanded && (
                    <div className="mt-4 rounded-xl border-2 border-black bg-white/95 p-3 text-xs font-bold text-black dark:bg-black/90 dark:text-white dark:border-white animate-in fade-in">
                      <span className="block font-mono text-[10px] font-black uppercase text-neo-forest dark:text-neo-yellow mb-1">
                        ✦ REAL IMPLEMENTATION CASE:
                      </span>
                      {realCases[idx]}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t-2 border-black/15 dark:border-white/20 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setExpandedPillar(isExpanded ? null : idx)}
                    className="text-xs font-black uppercase hover:underline flex items-center gap-1"
                  >
                    <span>{isExpanded ? "Hide Case" : "Inspect Practical Case"}</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                  <span className="font-mono text-[10px] font-black">VERIFIED ✦</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE SKILLS ARSENAL (SEARCHABLE & COMPACT)
          ========================================================================= */}
      <section>
        <div className="neo-box rounded-3xl bg-white p-6 sm:p-8 dark:bg-neo-darkcard dark:border-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-2 border-black/10 pb-4 dark:border-white/20">
            <div>
              <span className="neo-badge rounded-md bg-neo-yellow text-black font-black">
                ★ TECHNICAL COMPETENCIES
              </span>
              <h2 className="font-display text-2xl font-black uppercase tracking-tight text-black dark:text-white mt-1">
                Skills Catalog & Applied Tools
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-neo-yellow" />
              <input
                type="text"
                placeholder="Search skill (e.g. React, Python)..."
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                className="w-full rounded-xl border-2 border-black bg-neo-bg py-1.5 pl-9 pr-3 text-xs font-bold text-black focus:outline-none dark:border-white dark:bg-[#121620] dark:text-white"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {skillCategories.map((cat) => {
              const active = selectedSkillCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedSkillCategory(cat)}
                  className={`neo-btn rounded-lg px-2.5 py-1 text-xs font-black uppercase ${
                    active
                      ? "bg-neo-yellow text-black dark:bg-neo-yellow dark:text-black dark:border-white"
                      : "bg-white text-black dark:bg-[#181b24] dark:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Skill Groups Grid */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSkillGroups.map((group, groupIdx) => {
              const badgeColors = [
                "bg-neo-yellow text-black",
                "bg-neo-sky text-black",
                "bg-neo-rose text-black",
                "bg-neo-lavender text-black",
                "bg-neo-orange text-black",
                "bg-neo-green text-black",
              ];
              return (
                <div
                  key={group.category}
                  className="rounded-2xl border-2 border-black bg-neo-bg p-4 dark:border-white/30 dark:bg-[#121620]"
                >
                  <div className="flex items-center justify-between border-b border-black/10 pb-2 dark:border-white/20 mb-3">
                    <h3 className="font-display text-sm font-black uppercase text-black dark:text-white">
                      {group.category}
                    </h3>
                    <span className={`font-mono text-[10px] font-black px-1.5 py-0.2 rounded border border-black ${badgeColors[groupIdx % badgeColors.length]}`}>
                      {group.items.length}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((skill) => {
                      const item = normalizeSkill(skill);
                      return (
                        <div
                          key={`${group.category}-${item.name}`}
                          className="group relative rounded-lg border border-black/40 bg-white px-2 py-1 text-xs font-black text-black hover:bg-neo-yellow dark:border-white/30 dark:bg-[#1f2430] dark:text-white dark:hover:bg-neo-yellow dark:hover:text-black cursor-pointer transition-colors"
                        >
                          <span>{item.name}</span>
                          {item.level && (
                            <span
                              className={`ml-1 rounded px-1 text-[9px] font-black uppercase border ${getSkillLevelBadge(
                                item.level,
                              )}`}
                            >
                              {item.level}
                            </span>
                          )}
                          {item.context && (
                            <div className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-0 z-30 hidden w-60 rounded-xl neo-box bg-white p-3 text-left text-[11px] font-bold text-black group-hover:block dark:bg-[#181b24] dark:text-white dark:border-white shadow-brutal">
                              <p className="font-black text-neo-forest dark:text-neo-yellow mb-1">
                                APPLICATION CONTEXT:
                              </p>
                              <p>{item.context}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          COLLABORATORS STICKER BOMB WALL
          ========================================================================= */}
      <section className="neo-box rounded-3xl bg-neo-cream p-6 sm:p-8 dark:bg-[#161a22] dark:border-white">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b-2 border-black pb-3 dark:border-white">
          <div>
            <span className="neo-badge rounded-md bg-neo-rose text-black font-black">
              ✦ SQUAD & NETWORK
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-black dark:text-white mt-1">
              Appreciation to Teammates & Collaborators
            </h2>
          </div>
          <span className="font-mono text-xs font-black bg-white px-3 py-1 rounded-lg border-2 border-black dark:bg-neo-yellow dark:text-black dark:border-white">
            {getPartnerThanks().length} PEERS
          </span>
        </div>

        <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 max-w-2xl mb-5">
          Sincere gratitude to all teammates and competitors across CTF tournament squads, industry internships, and hackathons.
        </p>

        {/* Playful Sticker Bomb Cloud */}
        <div className="flex flex-wrap gap-2">
          {getPartnerThanks().map((partner, idx) => {
            const rotations = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2", "rotate-0"];
            const rot = rotations[idx % rotations.length];
            return (
              <div
                key={partner.name}
                className={`group relative neo-btn rounded-xl bg-white px-3 py-1.5 text-xs font-black uppercase text-black hover:bg-neo-yellow dark:bg-[#202533] dark:text-white dark:hover:bg-neo-yellow dark:hover:text-black transition-all ${rot} hover:rotate-0`}
              >
                <Users className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>{partner.name}</span>
                {partner.activities.length > 1 && (
                  <span className="rounded-full bg-neo-green px-1.5 py-0.2 text-[10px] font-black border border-black dark:text-black">
                    {partner.activities.length}
                  </span>
                )}

                {/* Tooltip */}
                <div className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-0 z-30 hidden w-64 rounded-xl neo-box bg-white p-3 text-left text-[11px] font-bold text-black group-hover:block dark:bg-[#181b24] dark:text-white dark:border-white shadow-brutal">
                  <p className="font-black text-neo-forest dark:text-neo-yellow mb-1">
                    SHARED ACTIVITIES:
                  </p>
                  <ul className="space-y-1">
                    {partner.activities.map((act) => (
                      <li key={act}>• {act}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          PRODUCTION LOGOS RUNNING TICKER
          ========================================================================= */}
      <section className="neo-box rounded-2xl bg-white overflow-hidden dark:bg-[#181b24] dark:border-white">
        <div className="bg-neo-yellow px-6 py-2.5 font-display text-xs sm:text-sm font-black uppercase text-black border-b-2 border-black dark:border-white">
          ✦ PRODUCTION TECHNOLOGIES & TOOLKITS ✦
        </div>
        <div className="py-4 overflow-hidden">
          <div className="neo-ticker-track flex gap-4 px-4">
            {[...techLogos, ...techLogos, ...techLogos].map((tech, idx) => (
              <div
                key={`${tech.name}-${idx}`}
                className="neo-btn rounded-xl bg-neo-bg px-3.5 py-1.5 text-xs font-black uppercase text-black hover:bg-neo-green dark:bg-[#202533] dark:text-white shrink-0"
              >
                <TechLogoIcon tech={tech} />
                <span className="whitespace-nowrap">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
