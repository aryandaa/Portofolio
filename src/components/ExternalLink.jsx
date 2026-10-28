import { ExternalLink as ExternalLinkIcon } from "lucide-react";

export default function ExternalLink({
  href,
  children,
  variant = "emerald",
  download = false,
  className = "",
}) {
  if (!href) return null;

  const variantStyles = {
    emerald:
      "bg-neo-green text-black hover:bg-emerald-300 dark:bg-neo-green dark:text-black dark:hover:bg-emerald-400",
    yellow:
      "bg-neo-yellow text-black hover:bg-amber-300 dark:bg-neo-yellow dark:text-black dark:hover:bg-amber-300",
    secondary:
      "bg-white text-black hover:bg-slate-100 dark:bg-[#202530] dark:text-white dark:hover:bg-[#2b3342]",
    red:
      "bg-neo-rose text-black hover:bg-rose-300 dark:bg-neo-rose dark:text-black dark:hover:bg-rose-300",
    cyan:
      "bg-neo-sky text-black hover:bg-sky-300 dark:bg-neo-sky dark:text-black dark:hover:bg-sky-300",
  };

  const selectedVariant = variantStyles[variant] || variantStyles.emerald;

  return (
    <a
      href={href}
      target={download ? undefined : "_blank"}
      rel={download ? undefined : "noreferrer"}
      download={download ? true : undefined}
      className={`neo-btn inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider ${selectedVariant} ${className}`}
    >
      {children}
      {!download && (
        <ExternalLinkIcon className="h-4 w-4 stroke-[2.5] shrink-0" aria-hidden="true" />
      )}
    </a>
  );
}
