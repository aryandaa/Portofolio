import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Eye,
  FileImage,
  FileText,
  Filter,
  Grid,
  List,
  Minus,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { certifications } from "../data/certifications.js";
import AssetPreview, { isPdfAsset } from "../components/AssetPreview.jsx";
import PageShell from "../components/PageShell.jsx";
import { useToast } from "../context/ToastContext.jsx";

function CertificateImageCarousel({ certificate, onOpen }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = certificate.images || [];
  const hasMultipleImages = images.length > 1;
  const activeAsset = images[activeIndex];

  const showPrevious = (e) => {
    e.stopPropagation();
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const showNext = (e) => {
    e.stopPropagation();
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl border-2 border-black bg-neo-bg dark:border-white dark:bg-[#181b24]">
      {activeAsset ? (
        isPdfAsset(activeAsset) ? (
          <button
            type="button"
            onClick={() => onOpen(certificate, activeIndex)}
            className="group flex h-full w-full flex-col items-center justify-center p-4 bg-neo-green/30 text-center cursor-pointer transition-colors hover:bg-neo-green/50 dark:bg-[#202533]"
            title="Click to open official PDF document"
          >
            <div className="neo-btn flex h-12 w-12 items-center justify-center rounded-2xl bg-neo-yellow text-black mb-2 p-0 dark:bg-neo-yellow dark:text-black">
              <FileText className="h-6 w-6 stroke-[2.5]" />
            </div>
            <span className="text-xs font-black uppercase text-black dark:text-white">
              PDF Document
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onOpen(certificate, activeIndex)}
            className="group block h-full w-full cursor-zoom-in"
            title="Click to inspect certificate"
          >
            <AssetPreview
              src={activeAsset}
              alt={`${certificate.name} certificate ${activeIndex + 1}`}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="neo-btn rounded-xl bg-neo-yellow px-3.5 py-1.5 text-xs font-black uppercase text-black">
                <Eye className="h-3.5 w-3.5 stroke-[2.5]" /> INSPECT
              </span>
            </div>
          </button>
        )
      ) : (
        <div className="flex h-full flex-col items-center justify-center p-4 text-center">
          <FileImage className="mb-2 h-8 w-8 text-black dark:text-white" />
          <span className="text-xs font-bold text-black dark:text-white">Certificate asset offline</span>
        </div>
      )}

      {hasMultipleImages && (
        <>
          <button
            type="button"
            onClick={showPrevious}
            className="neo-btn absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg bg-white p-0 text-black hover:bg-neo-yellow dark:bg-[#202533] dark:text-white"
            aria-label="Previous certificate"
          >
            <ChevronLeft className="h-4 w-4 stroke-[3]" />
          </button>
          <button
            type="button"
            onClick={showNext}
            className="neo-btn absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg bg-white p-0 text-black hover:bg-neo-yellow dark:bg-[#202533] dark:text-white"
            aria-label="Next certificate"
          >
            <ChevronRight className="h-4 w-4 stroke-[3]" />
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {images.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 border border-black dark:border-white transition-all ${
                  activeIndex === index ? "w-4 bg-neo-yellow" : "w-1.5 bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function CertificationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("bento"); // 'bento' | 'matrix'
  const [viewer, setViewer] = useState(null);
  const [zoom, setZoom] = useState(1);
  const { showToast } = useToast();

  // Filtered certificates
  const filteredCertificates = useMemo(() => {
    return certifications.filter((cert) => {
      const matchSearch =
        searchQuery === "" ||
        cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cert.date && cert.date.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSearch;
    });
  }, [searchQuery]);

  // Viewer controls
  const openViewer = (certificate, initialIndex = 0) => {
    setViewer({
      certificate,
      activeIndex: initialIndex,
    });
    setZoom(1);
  };

  const closeViewer = () => {
    setViewer(null);
    setZoom(1);
  };

  const nextImage = () => {
    if (!viewer) return;
    const images = viewer.certificate.images || [];
    setViewer((prev) => ({
      ...prev,
      activeIndex: (prev.activeIndex + 1) % images.length,
    }));
    setZoom(1);
  };

  const prevImage = () => {
    if (!viewer) return;
    const images = viewer.certificate.images || [];
    setViewer((prev) => ({
      ...prev,
      activeIndex: (prev.activeIndex - 1 + images.length) % images.length,
    }));
    setZoom(1);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!viewer) return;
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewer]);

  const copyCertInfo = (cert) => {
    navigator.clipboard.writeText(`${cert.name} | ${cert.issuer} (${cert.date})`);
    showToast(`Copied "${cert.name}" info!`);
  };

  return (
    <>
      <PageShell title="Certifications">
        {/* Interactive Control Deck */}
        <div className="neo-box rounded-3xl bg-white p-5 sm:p-6 mb-8 dark:bg-neo-darkcard dark:border-white">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 stroke-[2.5] text-black dark:text-neo-yellow" />
              <input
                type="text"
                placeholder="Search certificate by name, issuer, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border-2 border-black bg-neo-bg py-3 pl-12 pr-4 text-sm font-bold text-black placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-black dark:border-white dark:bg-[#121620] dark:text-white dark:placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg bg-black p-1 text-white hover:bg-slate-800 dark:bg-white dark:text-black"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("bento")}
                className={`neo-btn flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black uppercase ${
                  viewMode === "bento"
                    ? "bg-neo-yellow text-black dark:bg-neo-yellow dark:text-black dark:border-white"
                    : "bg-white text-black dark:bg-[#181b24] dark:text-white"
                }`}
              >
                <Grid className="h-4 w-4" />
                <span>Bento</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("matrix")}
                className={`neo-btn flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black uppercase ${
                  viewMode === "matrix"
                    ? "bg-neo-yellow text-black dark:bg-neo-yellow dark:text-black dark:border-white"
                    : "bg-white text-black dark:bg-[#181b24] dark:text-white"
                }`}
              >
                <List className="h-4 w-4" />
                <span>Matrix</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Mode 1: Bento & Grid */}
        {viewMode === "bento" && (
          <div className="space-y-8">
            {/* Featured Master Spotlight for CodingCamp when matching */}
            {!searchQuery && (
              <div className="neo-box rounded-3xl border-[3px] border-black bg-neo-yellow/20 p-6 sm:p-8 dark:border-white dark:bg-[#1e2538] shadow-brutal">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white">
                      Certificate Of Completion CodingCamp 2026
                    </h2>
                    <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                      Issued by <span className="text-black font-black dark:text-neo-yellow">Dicoding Indonesia & DBS Foundation</span> • July 2026
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => openViewer(certifications[1], 0)}
                      className="neo-btn rounded-xl bg-neo-yellow px-5 py-3 font-display text-xs font-black uppercase text-black hover:bg-yellow-300 dark:bg-neo-yellow dark:text-black"
                    >
                      <Eye className="h-4 w-4 inline mr-1.5" />
                      Inspect Master PDF
                    </button>
                    <a
                      href={certifications[1].images[0]}
                      download
                      className="neo-btn rounded-xl bg-white px-4 py-3 text-xs font-black uppercase text-black hover:bg-slate-100 dark:bg-[#202533] dark:text-white"
                    >
                      <Download className="h-4 w-4 inline mr-1.5" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Grid of all matching certificates */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCertificates.map((cert) => (
                <div
                  key={`${cert.name}-${cert.date}`}
                  className="neo-box neo-box-hover rounded-2xl bg-white p-5 flex flex-col justify-between dark:bg-[#181b24] dark:border-white"
                >
                  <div>
                    <CertificateImageCarousel certificate={cert} onOpen={openViewer} />

                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="neo-badge rounded-md bg-neo-yellow text-[10px] text-black">
                        {cert.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyCertInfo(cert)}
                        className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                        title="Copy Certificate Info"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>

                    <h3 className="font-display text-base font-black uppercase text-black dark:text-white line-clamp-2 mt-1 leading-snug">
                      {cert.name}
                    </h3>

                    <p className="mt-2 text-xs font-black uppercase text-neo-forest dark:text-neo-yellow">
                      {cert.issuer}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      ISSUED: {cert.date}
                    </p>
                  </div>

                  {cert.images && cert.images.length > 0 && (
                    <div className="mt-5 flex items-center justify-between border-t-2 border-black pt-3 dark:border-white">
                      <button
                        type="button"
                        onClick={() => openViewer(cert, 0)}
                        className="neo-btn rounded-lg bg-neo-palegreen px-3 py-1.5 text-xs font-black uppercase text-black hover:bg-neo-green dark:bg-neo-sky dark:text-black"
                      >
                        <Eye className="h-3.5 w-3.5 stroke-[2.5]" />
                        <span>INSPECT</span>
                      </button>

                      <a
                        href={cert.images[0]}
                        download
                        className="neo-btn rounded-lg bg-white px-3 py-1.5 text-xs font-black uppercase text-black hover:bg-slate-100 dark:bg-[#202533] dark:text-white"
                        title="Download certificate file"
                      >
                        <Download className="h-3.5 w-3.5 stroke-[2.5]" />
                        <span>DOWNLOAD</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View Mode 2: Security Audit Ledger */}
        {viewMode === "matrix" && (
          <div className="neo-box overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-neo-darkcard dark:border-white">
            <div className="px-4 py-2 border-b border-black/10 dark:border-white/20 sm:hidden bg-neo-sky/20 text-[11px] font-mono font-bold text-black dark:text-slate-300 flex items-center justify-between">
              <span>← SWIPE TABLE HORIZONTALLY →</span>
              <span>[{filteredCertificates.length} CREDS]</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-xs font-bold">
                <thead className="border-b-[2.5px] border-black bg-neo-sky text-black uppercase font-black dark:border-white">
                  <tr>
                    <th className="px-5 py-4">#</th>
                    <th className="px-5 py-4">Credential Name</th>
                    <th className="px-5 py-4">Accredited Authority</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Timeline</th>
                    <th className="px-5 py-4 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black/10 dark:divide-white/10 text-black dark:text-white">
                  {filteredCertificates.map((c, i) => (
                    <tr
                      key={`${c.name}-${i}`}
                      onClick={() => openViewer(c, 0)}
                      className="cursor-pointer transition-colors hover:bg-neo-yellow/20 dark:hover:bg-[#202533]"
                    >
                      <td className="px-5 py-4 font-mono font-black">{String(i + 1).padStart(2, "0")}</td>
                      <td className="px-5 py-4 font-display font-black uppercase">
                        {c.name}
                      </td>
                      <td className="px-5 py-4 text-neo-forest dark:text-neo-yellow">
                        {c.issuer}
                      </td>
                      <td className="px-5 py-4">
                        <span className="neo-badge rounded bg-neo-cream text-[10px] text-black dark:bg-[#202533] dark:text-white">
                          {c.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-[11px]">{c.date}</td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openViewer(c, 0);
                          }}
                          className="neo-btn rounded-lg bg-neo-yellow px-3 py-1 text-[11px] font-black uppercase text-black"
                        >
                          Verify ↗
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </PageShell>

      {/* FULL CERTIFICATE LIGHTBOX / VIEWER MODAL */}
      {viewer && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeViewer}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="neo-box flex h-full max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-white p-0 shadow-brutal-lg dark:bg-[#181b24] dark:border-white"
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between border-b-[3px] border-black bg-neo-yellow px-4 sm:px-6 py-3 sm:py-4 text-black dark:border-white dark:bg-neo-yellow dark:text-black">
              <div className="flex items-center gap-2 sm:gap-3 truncate">
                <span className="neo-badge rounded-md bg-white text-black font-black text-xs shrink-0">
                  VERIFIED
                </span>
                <span className="font-display text-xs sm:text-sm font-black uppercase tracking-wider truncate">
                  {viewer.certificate.name}
                </span>
              </div>
              <button
                type="button"
                onClick={closeViewer}
                className="neo-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neo-rose text-black hover:bg-rose-400 p-0"
                aria-label="Close viewer"
              >
                <X className="h-5 w-5 stroke-[3]" />
              </button>
            </div>

            {/* Inspector Canvas Area */}
            <div className="relative flex flex-1 items-center justify-center overflow-auto bg-slate-900 p-4">
              {isPdfAsset(viewer.certificate.images[viewer.activeIndex]) ? (
                <iframe
                  src={`${viewer.certificate.images[viewer.activeIndex]}#view=FitH`}
                  title={viewer.certificate.name}
                  className="h-full w-full rounded-xl border-2 border-white/20 bg-white"
                />
              ) : (
                <img
                  src={viewer.certificate.images[viewer.activeIndex]}
                  alt={viewer.certificate.name}
                  style={{ transform: `scale(${zoom})`, transition: "transform 0.15s ease-out" }}
                  className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
                />
              )}

              {/* Multiple Image Carousel Controls */}
              {viewer.certificate.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="neo-btn absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-white p-0 text-black hover:bg-neo-yellow"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6 stroke-[3]" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="neo-btn absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-white p-0 text-black hover:bg-neo-yellow"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6 stroke-[3]" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t-[3px] border-black bg-white px-6 py-3 dark:border-white dark:bg-[#121620]">
              <div className="text-xs font-black uppercase text-black dark:text-white">
                {viewer.certificate.issuer} • {viewer.certificate.date}
              </div>

              <div className="flex items-center gap-2">
                {!isPdfAsset(viewer.certificate.images[viewer.activeIndex]) && (
                  <>
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                      className="neo-btn h-8 w-8 rounded-lg bg-slate-100 p-0 text-black hover:bg-slate-200 dark:bg-[#202533] dark:text-white"
                      title="Zoom Out"
                    >
                      <Minus className="h-4 w-4 stroke-[3]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoom(1)}
                      className="neo-btn px-2.5 py-1 text-xs font-mono font-black rounded-lg bg-slate-100 text-black dark:bg-[#202533] dark:text-white"
                      title="Reset Zoom"
                    >
                      {Math.round(zoom * 100)}%
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
                      className="neo-btn h-8 w-8 rounded-lg bg-slate-100 p-0 text-black hover:bg-slate-200 dark:bg-[#202533] dark:text-white"
                      title="Zoom In"
                    >
                      <Plus className="h-4 w-4 stroke-[3]" />
                    </button>
                  </>
                )}

                <a
                  href={viewer.certificate.images[viewer.activeIndex]}
                  download
                  className="neo-btn rounded-xl bg-neo-green px-4 py-1.5 text-xs font-black uppercase text-black hover:bg-emerald-300 dark:bg-neo-sky dark:text-black"
                >
                  <Download className="h-4 w-4 inline mr-1" />
                  Download File
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
