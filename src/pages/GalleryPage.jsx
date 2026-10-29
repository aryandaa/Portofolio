import { useEffect, useState } from "react";
import {
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileImage,
  Images,
  Sparkles,
  X,
} from "lucide-react";
import AssetPreview, { isPdfAsset } from "../components/AssetPreview.jsx";
import { galleryItems } from "../data/gallery.js";
import PageShell from "../components/PageShell.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function GalleryPage() {
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const { showToast } = useToast();

  const selectedItem =
    selectedItemIndex !== null ? galleryItems[selectedItemIndex] : null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedItemIndex === null) return;
      if (e.key === "Escape") setSelectedItemIndex(null);
      if (e.key === "ArrowRight") {
        setSelectedItemIndex((curr) => (curr + 1) % galleryItems.length);
      }
      if (e.key === "ArrowLeft") {
        setSelectedItemIndex(
          (curr) => (curr - 1 + galleryItems.length) % galleryItems.length
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItemIndex]);

  return (
    <>
      <PageShell title="Gallery">
        {galleryItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item, idx) => {
              const itemIsPdf = isPdfAsset(item.image);
              const rotationClass =
                idx % 3 === 0
                  ? "hover:rotate-1"
                  : idx % 3 === 1
                  ? "hover:-rotate-1"
                  : "hover:rotate-2";

              return (
                <div
                  key={`${item.title}-${item.date}`}
                  className={`neo-box neo-box-hover overflow-hidden rounded-3xl bg-white p-0 dark:bg-[#181b24] dark:border-white transition-all duration-200 ${rotationClass}`}
                >
                  {/* Decorative Washi Tape Accent */}
                  <div className="relative flex justify-center">
                    <span className="absolute -top-3 z-10 rounded-sm bg-neo-yellow/90 px-6 py-1 text-[9px] font-black uppercase tracking-widest text-black shadow-sm border border-black/30 rotate-1">
                      POLAROID #{idx + 1}
                    </span>
                  </div>

                  <div className="aspect-[4/3] overflow-hidden border-b-2 border-black bg-neo-bg dark:border-white dark:bg-[#202533] mt-2">
                    {itemIsPdf ? (
                      <AssetPreview src={item.image} alt={item.title} className="h-full w-full" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedItemIndex(idx)}
                        className="group block h-full w-full cursor-zoom-in"
                        aria-label={`View photo ${item.title}`}
                      >
                        <AssetPreview
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      </button>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="mb-2">
                      <span className="neo-badge rounded-md bg-neo-yellow text-black text-[10px]">
                        <CalendarDays className="h-3 w-3 mr-1 inline" />
                        {item.date}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-black uppercase text-black dark:text-white line-clamp-2">
                      {item.title}
                    </h3>

                    {!itemIsPdf && (
                      <button
                        type="button"
                        onClick={() => setSelectedItemIndex(idx)}
                        className="mt-4 neo-btn rounded-xl bg-neo-green px-3 py-1.5 text-xs font-black uppercase text-black hover:bg-emerald-300 dark:bg-neo-sky dark:text-black"
                      >
                        <Eye className="h-3.5 w-3.5 stroke-[2.5]" />
                        <span>Inspect</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="neo-box rounded-3xl bg-white p-8 sm:p-12 text-center dark:bg-neo-darkcard dark:border-white">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-black bg-neo-yellow text-black dark:border-white dark:bg-neo-yellow dark:text-black">
              <Camera className="h-8 w-8 stroke-[2.5]" />
            </div>
            <h3 className="font-display text-2xl font-black uppercase text-black dark:text-white">
              Visual Archive in Active Curation
            </h3>
            <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
              Photographic documentation and visual artifacts from national CTF tournaments, campus tech events, and developer workshops are being cataloged.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="neo-badge rounded-lg bg-neo-green text-black">
                ★ CTF Tournament Archives
              </span>
              <span className="neo-badge rounded-lg bg-neo-sky text-black">
                ★ Poliban Campus Tech
              </span>
              <span className="neo-badge rounded-lg bg-neo-rose text-black">
                ★ CodingCamp 2026 Showcase
              </span>
            </div>
          </div>
        )}
      </PageShell>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedItemIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl border-[3px] border-black bg-white shadow-brutal-xl overflow-hidden dark:border-white dark:bg-[#181b24]"
          >
            <div className="flex items-center justify-between border-b-[3px] border-black bg-neo-yellow px-6 py-4 dark:border-white dark:bg-neo-yellow dark:text-black">
              <div>
                <span className="neo-badge rounded-md bg-white text-black mb-1 dark:bg-black dark:text-white">
                  PHOTO ARCHIVE [{selectedItemIndex + 1}/{galleryItems.length}]
                </span>
                <h3 className="font-display text-xl font-black uppercase text-black mt-1">
                  {selectedItem.title}
                </h3>
                <p className="text-xs font-bold text-black/80">{selectedItem.date}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItemIndex(null)}
                className="neo-btn h-10 w-10 rounded-xl bg-neo-rose text-black hover:bg-rose-300 dark:bg-neo-rose dark:text-black p-0"
                aria-label="Close photo viewer"
              >
                <X className="h-5 w-5 stroke-[3]" />
              </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center p-4 overflow-auto bg-slate-900">
              <AssetPreview
                src={selectedItem.image}
                alt={selectedItem.title}
                className="max-h-[70vh] w-auto max-w-full rounded-2xl border-2 border-white/20 object-contain shadow-2xl"
              />

              {galleryItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedItemIndex(
                        (curr) => (curr - 1 + galleryItems.length) % galleryItems.length
                      )
                    }
                    className="neo-btn absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-white p-0 text-black hover:bg-neo-yellow"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="h-6 w-6 stroke-[3]" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedItemIndex((curr) => (curr + 1) % galleryItems.length)
                    }
                    className="neo-btn absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-white p-0 text-black hover:bg-neo-yellow"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="h-6 w-6 stroke-[3]" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
