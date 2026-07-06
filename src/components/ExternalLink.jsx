import { ExternalLink as ExternalLinkIcon } from "lucide-react";

export default function ExternalLink({ href, children, variant = "cyan" }) {
  if (!href) return null;

  const styles =
    variant === "red"
      ? "border-danger/60 bg-danger/10 text-rose-100 hover:bg-danger/20"
      : "border-cyan/60 bg-cyan/10 text-cyan hover:bg-cyan/20";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 border px-4 py-2 text-sm font-semibold transition ${styles}`}
    >
      <span>{children}</span>
      <ExternalLinkIcon className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}
