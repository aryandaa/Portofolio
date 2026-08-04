import { useState } from "react";
import { CalendarDays, Download, ExternalLink, FileImage, Images, X } from "lucide-react";
import AssetPreview, { isPdfAsset } from "../components/AssetPreview.jsx";
import { galleryItems } from "../data/gallery.js";
import PageShell from "../components/PageShell.jsx";
import Panel from "../components/Panel.jsx";

export default function GalleryPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const selectedIsPdf = isPdfAsset(selectedItem?.image);

  return (
    <>
      <PageShell eyebrow="Memory archive" title="Gallery">
        {galleryItems.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {galleryItems.map((item) => {
              const itemIsPdf = isPdfAsset(item.image);

              return (
                <Panel key={`${item.title}-${item.date}`} className="flex overflow-hidden p-0">
                  <div className="flex w-full flex-col">
                    <div className="aspect-[4/3] overflow-hidden border-b border-cyan/20 bg-void/80">
                      {itemIsPdf ? (
                        <AssetPreview
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedItem(item)}
                          className="block h-full w-full"
                          aria-label={`View ${item.title}`}
                        >
                          <AssetPreview
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full"
                            imageClassName="object-cover transition duration-300 hover:scale-105"
                          />
                        </button>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div className="grid h-10 w-10 shrink-0 place-items-center border border-cyan/40 bg-cyan/10 text-cyan shadow-neon">
                          <Images className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <p className="inline-flex items-center gap-2 border border-danger/40 bg-danger/10 px-3 py-2 text-xs font-semibold text-rose-100">
                          <CalendarDays className="h-4 w-4" aria-hidden="true" />
                          {item.date}
                        </p>
                      </div>
                      <h2 className="font-display text-xl font-bold text-white">{item.title}</h2>
                      <button
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="interactive-link mt-5 inline-flex w-fit items-center gap-2 border border-cyan/60 bg-cyan/10 px-4 py-2 text-sm font-semibold text-cyan"
                      >
                        View {itemIsPdf ? "PDF" : "Photo"}
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </Panel>
              );
            })}
          </div>
        ) : (
          <Panel className="p-8 sm:p-10">
            <FileImage className="mb-5 h-10 w-10 text-cyan" aria-hidden="true" />
            <h2 className="font-display text-2xl font-bold text-white">Gallery is ready for your moments</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Add your photos with notable people to <span className="text-cyan">public/assets/gallery/</span>,
              then register the title, file path, and date in <span className="text-cyan">src/data/gallery.js</span>.
            </p>
          </Panel>
        )}
      </PageShell>

      {selectedItem && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-void/88 p-3 backdrop-blur-lg sm:p-6">
          <div className="neon-border clip-corner flex max-h-[90vh] w-full max-w-6xl flex-col bg-night/95 p-4 shadow-neon sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="font-display text-xs uppercase tracking-[0.28em] text-cyan">Gallery archive</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-white">{selectedItem.title}</h2>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-300">
                  <CalendarDays className="h-4 w-4 text-danger" aria-hidden="true" />
                  {selectedItem.date}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {selectedIsPdf && (
                  <a
                    href={selectedItem.image}
                    target="_blank"
                    rel="noreferrer"
                    className="interactive-link inline-flex h-11 items-center gap-2 border border-cyan/60 bg-cyan/10 px-3 text-sm font-semibold text-cyan"
                  >
                    <span className="hidden sm:inline">Open PDF</span>
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
                <a
                  href={selectedItem.image}
                  download
                  className="interactive-link grid h-11 w-11 place-items-center border border-cyan/60 bg-cyan/10 text-cyan"
                  aria-label="Download gallery asset"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="interactive-chip grid h-11 w-11 place-items-center border border-danger/50 bg-danger/10 text-rose-100"
                  aria-label="Close gallery viewer"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto border border-cyan/20 bg-void/80 p-2 sm:p-4">
              <div className="flex min-h-full items-center justify-center">
                <AssetPreview
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className={selectedIsPdf ? "h-[68vh] w-full" : "max-h-[68vh] max-w-full"}
                  imageClassName="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
