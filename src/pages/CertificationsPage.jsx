import { useState } from "react";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  FileImage,
  Minus,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import { certifications } from "../data/certifications.js";
import PageShell from "../components/PageShell.jsx";
import Panel from "../components/Panel.jsx";

function CertificateImageCarousel({ certificate, onOpen }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = certificate.images;
  const hasMultipleImages = images.length > 1;
  const activeImage = images[activeIndex];

  const showPrevious = () => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const showNext = () => {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="mb-5 overflow-hidden border border-cyan/20 bg-void/75">
      <div className="relative aspect-[16/10]">
        {activeImage ? (
          <button
            type="button"
            onClick={() => onOpen(certificate, activeIndex)}
            className="block h-full w-full"
          >
            <img
              src={activeImage}
              alt={`${certificate.name} certificate ${activeIndex + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ) : (
          <div className="grid h-full place-items-center bg-[linear-gradient(135deg,rgba(34,211,238,.08),rgba(139,92,246,.1),rgba(255,46,99,.08))] p-5 text-center">
            <div>
              <FileImage className="mx-auto mb-3 h-9 w-9 text-cyan" aria-hidden="true" />
              <p className="font-display text-xs uppercase tracking-[0.24em] text-cyan">
                Certificate Image
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Add image files to public/assets/certificates
              </p>
            </div>
          </div>
        )}

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              className="interactive-chip absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center border border-cyan/50 bg-void/80 text-cyan"
              aria-label="Previous certificate image"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={showNext}
              className="interactive-chip absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center border border-cyan/50 bg-void/80 text-cyan"
              aria-label="Next certificate image"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 w-2.5 border ${
                    activeIndex === index
                      ? "border-cyan bg-cyan shadow-neon"
                      : "border-white/30 bg-white/20"
                  }`}
                  aria-label={`Show certificate image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CertificationsPage() {
  const [viewer, setViewer] = useState(null);
  const [zoom, setZoom] = useState(1);

  const openViewer = (certificate, imageIndex = 0) => {
    if (certificate.images.length === 0) return;
    setViewer({ certificate, imageIndex });
    setZoom(1);
  };

  const closeViewer = () => {
    setViewer(null);
    setZoom(1);
  };

  const showPreviousImage = () => {
    setViewer((current) => {
      const lastIndex = current.certificate.images.length - 1;
      return {
        ...current,
        imageIndex: current.imageIndex === 0 ? lastIndex : current.imageIndex - 1,
      };
    });
    setZoom(1);
  };

  const showNextImage = () => {
    setViewer((current) => ({
      ...current,
      imageIndex:
        current.imageIndex === current.certificate.images.length - 1 ? 0 : current.imageIndex + 1,
    }));
    setZoom(1);
  };

  const zoomOut = () => setZoom((current) => Math.max(0.75, Number((current - 0.25).toFixed(2))));
  const zoomIn = () => setZoom((current) => Math.min(2.5, Number((current + 0.25).toFixed(2))));
  const resetZoom = () => setZoom(1);

  return (
    <>
      <PageShell eyebrow="Credential matrix" title="Certifications & Licenses">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {certifications.map((certificate) => (
            <Panel key={`${certificate.name}-${certificate.date}`} className="min-h-[300px] p-6">
              <CertificateImageCarousel certificate={certificate} onOpen={openViewer} />
              <button
                type="button"
                onClick={() => openViewer(certificate, 0)}
                className="block w-full text-left"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <BadgeCheck className="h-7 w-7 shrink-0 text-cyan" aria-hidden="true" />
                  <span className="interactive-chip border border-plasma/50 bg-plasma/10 px-3 py-1 text-xs text-violet-100">
                    {certificate.category}
                  </span>
                </div>
                <h2 className="font-display text-xl font-bold text-white">{certificate.name}</h2>
                <dl className="mt-5 grid gap-3 text-sm">
                  <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                    <dt className="text-slate-500">Type</dt>
                    <dd className="text-right text-slate-200">{certificate.type}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                    <dt className="text-slate-500">Issued</dt>
                    <dd className="text-right text-slate-200">{certificate.date}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Issuer</dt>
                    <dd className="text-right text-slate-200">{certificate.issuer}</dd>
                  </div>
                </dl>
                {certificate.images.length > 0 && (
                  <p className="mt-4 text-xs uppercase tracking-[0.22em] text-cyan">
                    Click card to inspect certificate
                  </p>
                )}
              </button>
              {certificate.images.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-3">
                  {certificate.images.map((image, index) => (
                    <a
                      key={image}
                      href={image}
                      download
                      className="interactive-link inline-flex items-center gap-2 border border-cyan/60 bg-cyan/10 px-4 py-2 text-sm font-semibold text-cyan"
                    >
                      <span>
                        Download {certificate.images.length > 1 ? `#${index + 1}` : "Certificate"}
                      </span>
                      <Download className="h-4 w-4" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              )}
            </Panel>
          ))}
        </div>
      </PageShell>

      {viewer && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-void/88 px-4 py-6 backdrop-blur-lg">
          <div className="neon-border clip-corner flex max-h-[90vh] w-full max-w-7xl flex-col bg-night/95 p-5 shadow-neon">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="font-display text-xs uppercase tracking-[0.28em] text-cyan">
                  Certificate Viewer
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-white">
                  {viewer.certificate.name}
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  {viewer.certificate.issuer} | Image {viewer.imageIndex + 1} of{" "}
                  {viewer.certificate.images.length}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={zoomOut}
                  className="interactive-chip grid h-10 w-10 place-items-center border border-cyan/50 bg-cyan/10 text-cyan"
                  aria-label="Zoom out"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={resetZoom}
                  className="interactive-chip inline-flex h-10 items-center gap-2 border border-cyan/50 bg-cyan/10 px-3 text-sm font-semibold text-cyan"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  <span>{Math.round(zoom * 100)}%</span>
                </button>
                <button
                  type="button"
                  onClick={zoomIn}
                  className="interactive-chip grid h-10 w-10 place-items-center border border-cyan/50 bg-cyan/10 text-cyan"
                  aria-label="Zoom in"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
                <a
                  href={viewer.certificate.images[viewer.imageIndex]}
                  download
                  className="interactive-link inline-flex h-10 items-center gap-2 border border-cyan/60 bg-cyan/10 px-3 text-sm font-semibold text-cyan"
                >
                  <span>Download</span>
                  <Download className="h-4 w-4" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={closeViewer}
                  className="interactive-chip grid h-10 w-10 place-items-center border border-danger/50 bg-danger/10 text-rose-100"
                  aria-label="Close certificate viewer"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="relative min-h-0 flex-1 overflow-auto border border-cyan/20 bg-void/80 p-4">
              {viewer.certificate.images.length > 1 && (
                <div className="sticky top-1/2 z-10 flex -translate-y-1/2 justify-between">
                  <button
                    type="button"
                    onClick={showPreviousImage}
                    className="interactive-chip grid h-11 w-11 place-items-center border border-cyan/50 bg-void/85 text-cyan"
                    aria-label="Previous certificate image"
                  >
                    <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={showNextImage}
                    className="interactive-chip grid h-11 w-11 place-items-center border border-cyan/50 bg-void/85 text-cyan"
                    aria-label="Next certificate image"
                  >
                    <ChevronRight className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              )}

              <div className="flex min-h-full items-center justify-center">
                <img
                  src={viewer.certificate.images[viewer.imageIndex]}
                  alt={`${viewer.certificate.name} certificate enlarged`}
                  className="max-h-none max-w-none origin-center object-contain transition-transform"
                  style={{ width: `${Math.round(900 * zoom)}px` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
