import {
  Github,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { profile } from "../data/portfolio.js";
import ExternalLink from "../components/ExternalLink.jsx";
import PageShell from "../components/PageShell.jsx";
import Panel from "../components/Panel.jsx";
import SectionTitle from "../components/SectionTitle.jsx";

const pageButtons = [
  ["projects", "Technical Projects"],
  ["certifications", "Certifications & Licenses"],
  ["awards", "Honorary and Awards"],
  ["books", "Books Read"],
];

function ContactItem({ icon: Icon, label, value, href }) {
  const content = (
    <span className="min-w-0 break-words text-sm text-slate-200">{value}</span>
  );

  return (
    <div className="flex items-start gap-3 border border-white/10 bg-white/[0.04] p-3">
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
      eyebrow="Digital dossier"
      title={profile.name}
      aside={
        <Panel>
          <div className="relative mb-5 aspect-[4/5] overflow-hidden border border-cyan/30 bg-gradient-to-br from-plasma/30 via-cyan/10 to-danger/20">
            {profile.photo ? (
              <img src={profile.photo} alt={profile.name} className="h-full w-full object-cover" />
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
    >
      <div className="grid gap-6">
        <Panel className="p-6 sm:p-8">
          <p className="mb-4 font-display text-lg font-semibold text-cyan">{profile.title}</p>
          <p className="max-w-3xl text-base leading-8 text-slate-200">{profile.summary}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {pageButtons.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => navigate(id)}
                className="border border-plasma/50 bg-plasma/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan hover:bg-cyan/10 hover:shadow-neon"
              >
                {label}
              </button>
            ))}
          </div>
        </Panel>

        <div className="grid gap-6 xl:grid-cols-2">
          <Panel>
            <SectionTitle kicker="Academic track" title="Education" />
            <div className="space-y-5">
              {profile.education.map((item) => (
                <div key={`${item.school}-${item.period}`} className="flex gap-4">
                  <GraduationCap className="mt-1 h-5 w-5 shrink-0 text-cyan" aria-hidden="true" />
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">{item.school}</h3>
                    <p className="text-sm text-danger">{item.degree} | {item.period}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <SectionTitle kicker="Capability stack" title="Skills" />
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="border border-cyan/30 bg-cyan/10 px-3 py-2 text-sm text-cyan"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Panel>
        </div>

        <Panel>
          <SectionTitle kicker="Field log" title="Experience" />
          <div className="grid gap-4">
            {profile.experience.map((item) => (
              <div key={`${item.role}-${item.period}`} className="border border-white/10 bg-white/[0.04] p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-danger" aria-hidden="true" />
                    <h3 className="font-display text-lg font-bold text-white">{item.role}</h3>
                  </div>
                  <span className="border border-danger/40 bg-danger/10 px-3 py-1 text-xs text-rose-100">
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
        </div>
      </div>
    </PageShell>
  );
}
