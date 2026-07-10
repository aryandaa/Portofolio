import { useEffect, useState } from "react";
import {
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Github,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { profile } from "../data/profile.js";
import { experiences } from "../data/experiences.js";
import { technicalProjects } from "../data/projects.js";
import { certifications } from "../data/certifications.js";
import { awards } from "../data/awards.js";
import { booksRead } from "../data/books.js";
import ExternalLink from "../components/ExternalLink.jsx";
import PageShell from "../components/PageShell.jsx";
import Panel from "../components/Panel.jsx";
import SectionTitle from "../components/SectionTitle.jsx";

const pageButtons = [
  ["projects", "Technical Projects"],
  ["experience", "Experience Details"],
  ["certifications", "Certifications & Licenses"],
  ["awards", "Honorary and Awards"],
  ["research", "Research"],
  ["books", "Books Read"],
];

const monthMap = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

const monthYearPattern =
  /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/gi;

function createMonthIndex(year, month) {
  return year * 12 + month;
}

function parseMonthYear(match) {
  const month = monthMap[match[1].toLowerCase()];
  const year = Number(match[2]);

  return createMonthIndex(year, month);
}

function getCurrentMonthIndex() {
  const now = new Date();

  return createMonthIndex(now.getFullYear(), now.getMonth());
}

function getExperienceMonthRange(period) {
  const matches = [...period.matchAll(monthYearPattern)];

  if (matches.length === 0) return null;

  const start = parseMonthYear(matches[0]);
  const end = /present/i.test(period) ? getCurrentMonthIndex() : parseMonthYear(matches[1] ?? matches[0]);

  if (end < start) return null;

  return { start, end };
}

function formatExperienceDuration(totalMonths) {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts = [];

  if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? "month" : "months"}`);

  return parts.length > 0 ? parts.join(" ") : "0 months";
}

function getExperienceDuration() {
  const activeMonths = new Set();

  experiences.forEach((item) => {
    const range = getExperienceMonthRange(item.period);

    if (!range) return;

    for (let month = range.start; month <= range.end; month += 1) {
      activeMonths.add(month);
    }
  });

  return formatExperienceDuration(activeMonths.size);
}

function formatProjectDuration(totalMonths, totalDays) {
  const monthsFromDays = Math.floor(totalDays / 30);
  const remainingDays = totalDays % 30;
  const months = totalMonths + monthsFromDays;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const parts = [];

  if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (remainingMonths > 0) {
    parts.push(`${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`);
  }
  if (remainingDays > 0) parts.push(`${remainingDays} ${remainingDays === 1 ? "day" : "days"}`);

  return parts.length > 0 ? parts.join(" ") : "0 days";
}

function getProjectDuration() {
  const activeMonths = new Set();
  let activeDays = 0;

  technicalProjects.forEach((project) => {
    if (project.durationDays) {
      activeDays += project.durationDays;
      return;
    }

    const range = getExperienceMonthRange(project.period);

    if (!range) return;

    for (let month = range.start; month <= range.end; month += 1) {
      activeMonths.add(month);
    }
  });

  return formatProjectDuration(activeMonths.size, activeDays);
}

function PortfolioStats() {
  const stats = [
    {
      label: "Experience Records",
      value: experiences.length,
      detail: `${getExperienceDuration()} active time`,
      icon: BriefcaseBusiness,
      tone: "cyan",
    },
    {
      label: "Technical Projects",
      value: technicalProjects.length,
      detail: `${getProjectDuration()} active time`,
      icon: FolderKanban,
      tone: "pink",
    },
    {
      label: "Certifications",
      value: certifications.length,
      icon: BadgeCheck,
      tone: "yellow",
    },
    {
      label: "Awards",
      value: awards.length,
      icon: Award,
      tone: "green",
    },
    {
      label: "Books Read",
      value: booksRead.length,
      icon: BookOpen,
      tone: "violet",
    },
  ];

  const toneStyles = {
    cyan: "border-cyan/30 bg-cyan/10 text-cyan",
    pink: "border-danger/30 bg-danger/10 text-rose-300",
    yellow: "border-yellow-400/30 bg-yellow-400/10 text-yellow-300",
    green: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    violet: "border-plasma/30 bg-plasma/10 text-violet-200",
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
      {stats.map(({ label, value, detail, icon: Icon, tone }) => (
        <div
          key={label}
          className={`interactive-card neon-border clip-corner p-6 text-center backdrop-blur-md ${toneStyles[tone]}`}
        >
          <Icon className="mx-auto mb-5 h-9 w-9" aria-hidden="true" />
          <p className="font-display text-4xl font-extrabold text-white text-glow">{value}</p>
          {detail && <p className="mt-2 text-sm font-semibold text-cyan">{detail}</p>}
          <p className="mt-3 font-mono text-sm uppercase tracking-[0.18em] text-slate-300">{label}</p>
        </div>
      ))}
    </div>
  );
}

function ProfilePhotoCarousel() {
  const photos = profile.photos?.length > 0 ? profile.photos : profile.photo ? [profile.photo] : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiplePhotos = photos.length > 1;

  useEffect(() => {
    if (!hasMultiplePhotos) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current === photos.length - 1 ? 0 : current + 1));
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [hasMultiplePhotos, photos.length]);

  const showPrevious = () => {
    setActiveIndex((current) => (current === 0 ? photos.length - 1 : current - 1));
  };

  const showNext = () => {
    setActiveIndex((current) => (current === photos.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="relative mb-5 aspect-[4/5] overflow-hidden border border-cyan/30 bg-gradient-to-br from-plasma/30 via-cyan/10 to-danger/20">
      {photos.length > 0 ? (
        <>
          <img
            src={photos[activeIndex]}
            alt={`${profile.name} profile ${activeIndex + 1}`}
            className="h-full w-full object-cover transition-opacity"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(7,9,20,.62))]" />

          {hasMultiplePhotos && (
            <>
              <button
                type="button"
                onClick={showPrevious}
                className="interactive-chip absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center border border-cyan/50 bg-void/80 text-cyan"
                aria-label="Previous profile photo"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={showNext}
                className="interactive-chip absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center border border-cyan/50 bg-void/80 text-cyan"
                aria-label="Next profile photo"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {photos.map((photo, index) => (
                  <button
                    key={photo}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 w-2.5 border ${
                      activeIndex === index
                        ? "border-cyan bg-cyan shadow-neon"
                        : "border-white/30 bg-white/20"
                    }`}
                    aria-label={`Show profile photo ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="grid h-full place-items-center p-8 text-center">
          <div>
            <div className="mx-auto mb-5 grid h-28 w-28 place-items-center rounded-full border border-cyan/50 bg-void/70 font-display text-4xl font-bold text-cyan shadow-neon">
              {profile.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)}
            </div>
            <p className="font-display text-sm uppercase tracking-[0.28em] text-white">
              Profile Photo
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ContactItem({ icon: Icon, label, value, href }) {
  const content = (
    <span className="min-w-0 break-words text-sm text-slate-200">{value}</span>
  );

  return (
    <div className="interactive-row flex items-start gap-3 border border-white/10 bg-white/[0.04] p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-cyan" aria-hidden="true" />
      <div className="min-w-0">
        <p className="mb-1 text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="hover:text-cyan">
            {content}
          </a>
        ) : (
          content
        )}
      </div>
    </div>
  );
}

export default function ProfilePage({ navigate }) {
  return (
    <PageShell
      eyebrow="Technology Enthusiast"
      title={profile.name}
      aside={
        <Panel>
          <ProfilePhotoCarousel />
          <div className="space-y-3">
            <ContactItem icon={MapPin} label="Address" value={profile.location} />
            <ContactItem icon={Phone} label="Phone" value={profile.phone} href={`tel:${profile.phone}`} />
            <ContactItem icon={Mail} label="Email" value={profile.email} href={`mailto:${profile.email}`} />
            <ContactItem icon={Instagram} label="Instagram" value={profile.instagram} href={profile.instagram} />
            <ContactItem icon={Github} label="GitHub" value={profile.github} href={profile.github} />
            <ContactItem icon={Linkedin} label="LinkedIn" value={profile.linkedin} href={profile.linkedin} />
          </div>
        </Panel>
      }
      below={
        <div className="grid gap-6">
          <Panel>
            <SectionTitle kicker="Capability stack" title="Skills" />
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {profile.skills.map((group) => (
                <div key={group.category} className="interactive-row border border-white/10 bg-white/[0.035] p-4">
                  <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-[0.18em] text-cyan">
                    {group.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span
                        key={`${group.category}-${skill}`}
                        className="interactive-chip border border-cyan/30 bg-cyan/10 px-3 py-2 text-sm text-cyan"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <SectionTitle kicker="Field log" title="Experience" />
            <div className="grid gap-4">
              {experiences.map((item) => (
                <div key={`${item.role}-${item.period}`} className="interactive-row border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-danger" aria-hidden="true" />
                      <h3 className="font-display text-lg font-bold text-white">{item.role}</h3>
                    </div>
                    <span className="interactive-chip border border-danger/40 bg-danger/10 px-3 py-1 text-xs text-rose-100">
                      {item.period}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-cyan">{item.place}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>
          </Panel>

          <div className="flex flex-wrap gap-3">
            <ExternalLink href={profile.github}>GitHub</ExternalLink>
            <ExternalLink href={profile.linkedin} variant="red">LinkedIn</ExternalLink>
            <ExternalLink href={profile.cvUrl} download>Download CV</ExternalLink>
          </div>

          <PortfolioStats />
        </div>
      }
    >
      <div className="grid gap-6 lg:flex lg:flex-1 lg:flex-col">
        <Panel className="p-6 sm:p-8">
          <p className="mb-4 font-display text-lg font-semibold text-cyan">{profile.title}</p>
          <p className="max-w-3xl text-base leading-8 text-slate-200">{profile.summary}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {pageButtons.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => navigate(id)}
                className="interactive-chip border border-plasma/50 bg-plasma/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan hover:bg-cyan/10 hover:shadow-neon"
              >
                {label}
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="lg:flex lg:flex-1 lg:flex-col">
          <SectionTitle kicker="Academic track" title="Education" />
          <div className="space-y-5">
            {profile.education.map((item) => (
              <div key={`${item.school}-${item.period}`} className="flex gap-4">
                <GraduationCap className="mt-1 h-5 w-5 shrink-0 text-cyan" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-lg font-bold text-white">{item.school}</h3>
                  <p className="text-sm text-danger">{item.degree} | {item.period}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
                  <div className="mt-3 grid gap-2">
                    {(Array.isArray(item.activity) ? item.activity : [item.activity]).map((activity) => (
                      <span
                        key={`${item.school}-${activity}`}
                        className="interactive-chip inline-flex w-fit border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
