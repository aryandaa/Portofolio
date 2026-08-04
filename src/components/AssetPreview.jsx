export function isPdfAsset(url = "") {
  return url.toLowerCase().split(/[?#]/, 1)[0].endsWith(".pdf");
}

export default function AssetPreview({ src, alt, className = "", imageClassName = "", style }) {
  if (isPdfAsset(src)) {
    return (
      <iframe
        src={`${src}#view=FitH`}
        title={`PDF preview: ${alt}`}
        className={className}
        style={style}
      >
        <a href={src}>Open {alt}</a>
      </iframe>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${imageClassName}`.trim()}
      style={style}
    />
  );
}
