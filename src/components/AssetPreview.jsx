import { useState } from "react";
import { FileText, ImageOff } from "lucide-react";

export function isPdfAsset(url = "") {
  return url.toLowerCase().split(/[?#]/, 1)[0].endsWith(".pdf");
}

export default function AssetPreview({
  src,
  alt = "Asset preview",
  className = "",
  imageClassName = "",
  style,
}) {
  const [hasError, setHasError] = useState(false);

  if (!src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-100 p-4 text-slate-400 dark:bg-slate-900/60 dark:text-slate-500 ${className}`}
        style={style}
      >
        <FileText className="h-8 w-8" />
        <span className="mt-1 text-xs font-bold">No preview</span>
      </div>
    );
  }

  if (isPdfAsset(src)) {
    return (
      <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-900/60 ${className}`} style={style}>
        <iframe
          src={`${src}#view=FitH`}
          title={`PDF preview: ${alt}`}
          className="h-full w-full border-0"
        />
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-100 p-4 text-slate-500 dark:bg-slate-900/60 dark:text-slate-400 ${className}`}
        style={style}
      >
        <ImageOff className="h-7 w-7 mb-1" />
        <span className="text-xs font-bold text-center">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      className={`${className} ${imageClassName}`.trim()}
      style={style}
    />
  );
}
