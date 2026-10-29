import { useMemo, useState } from "react";
import {
  BookMarked,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Copy,
  Grid,
  List,
  Search,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { booksRead } from "../data/books.js";
import PageShell from "../components/PageShell.jsx";
import StarRating from "../components/StarRating.jsx";
import { useToast } from "../context/ToastContext.jsx";

const commentPreviewLimit = 220;

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("bento"); // 'bento' | 'matrix'
  const [expandedBooks, setExpandedBooks] = useState({});
  const { showToast } = useToast();

  const filteredBooks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return booksRead;
    return booksRead.filter((book) => {
      return (
        book.title.toLowerCase().includes(q) ||
        (book.category && book.category.toLowerCase().includes(q)) ||
        (book.comment && book.comment.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  const toggleExpand = (key) => {
    setExpandedBooks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const copyReflection = (book) => {
    navigator.clipboard.writeText(`"${book.title}" (${book.rating}/5 ★)\n\nKey Reflection: ${book.comment}`);
    showToast(`Copied reflection from "${book.title}"!`);
  };

  const avgRating = (
    booksRead.reduce((acc, b) => acc + (b.rating || 5), 0) / booksRead.length
  ).toFixed(1);

  return (
    <PageShell title="Books Read">
      {/* Interactive Bookshelf Stats & Controls Desk */}
      <div className="neo-box rounded-3xl bg-white p-5 sm:p-6 mb-8 dark:bg-neo-darkcard dark:border-white">
        {/* Top Metric Strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pb-5 border-b-2 border-black/10 dark:border-white/20">
          <div className="neo-box rounded-xl bg-neo-yellow/30 p-3 text-center dark:bg-[#202533]">
            <span className="block font-display text-2xl font-black text-black dark:text-neo-yellow">{booksRead.length}</span>
            <span className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-300">Total Volumes Read</span>
          </div>
          <div className="neo-box rounded-xl bg-neo-sky/30 p-3 text-center dark:bg-[#202533]">
            <span className="block font-display text-2xl font-black text-black dark:text-neo-sky">{avgRating} ★</span>
            <span className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-300">Average Rating</span>
          </div>
          <div className="neo-box rounded-xl bg-neo-green/30 p-3 text-center dark:bg-[#202533]">
            <span className="block font-display text-2xl font-black text-black dark:text-neo-green">100%</span>
            <span className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-300">Completion Status</span>
          </div>
          <div className="neo-box rounded-xl bg-neo-rose/30 p-3 text-center dark:bg-[#202533]">
            <span className="block font-display text-2xl font-black text-black dark:text-neo-rose">{new Set(booksRead.map((b) => b.category)).size}</span>
            <span className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-300">Literary Genres</span>
          </div>
        </div>

        {/* Search & View Mode Controls */}
        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 stroke-[2.5] text-black dark:text-neo-yellow" />
            <input
              type="text"
              placeholder="Search books by title, author, or reflection keywords..."
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

          {/* View Mode Toggle */}
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

      {/* View Mode: Bento Grid */}
      {viewMode === "bento" && (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredBooks.map((book, index) => {
            const bookKey = `${book.title}-${index}`;
            const isExpanded = expandedBooks[bookKey];
            const hasLongComment = book.comment && book.comment.length > commentPreviewLimit;
            const displayComment =
              hasLongComment && !isExpanded
                ? `${book.comment.slice(0, commentPreviewLimit)}...`
                : book.comment;

            return (
              <div
                key={bookKey}
                className="neo-box neo-box-hover rounded-3xl bg-white p-6 sm:p-7 flex flex-col justify-between dark:bg-[#181b24] dark:border-white"
              >
                <div>
                  {/* Header ribbon */}
                  <div className="flex items-start justify-between gap-3 border-b-2 border-black pb-3 dark:border-white">
                    <span className="neo-badge rounded-md bg-neo-yellow text-black text-xs font-black">
                      {book.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <StarRating rating={book.rating} />
                      <button
                        type="button"
                        onClick={() => copyReflection(book)}
                        className="rounded p-1 text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white"
                        title="Copy Key Takeaway"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-black dark:text-white mt-4 leading-tight">
                    {book.title}
                  </h3>

                  {/* Personal Reflection Note */}
                  {book.comment && (
                    <div className="mt-4 rounded-2xl border-2 border-black bg-neo-bg p-4 text-xs sm:text-sm font-bold leading-relaxed text-black dark:border-white/20 dark:bg-[#121620] dark:text-slate-200 whitespace-pre-line">
                      {displayComment}
                    </div>
                  )}
                </div>

                {hasLongComment && (
                  <div className="mt-5 pt-3 border-t border-black/10 dark:border-white/20">
                    <button
                      type="button"
                      onClick={() => toggleExpand(bookKey)}
                      className="neo-btn rounded-xl bg-neo-green px-3.5 py-1.5 text-xs font-black uppercase text-black hover:bg-emerald-300 dark:bg-neo-sky dark:text-black flex items-center gap-1.5"
                    >
                      <span>{isExpanded ? "Show Less" : "Read Full Reflection"}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 stroke-[3]" />
                      ) : (
                        <ChevronDown className="h-4 w-4 stroke-[3]" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* View Mode: High-Density Matrix */}
      {viewMode === "matrix" && (
        <div className="neo-box overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-neo-darkcard dark:border-white">
          <div className="px-4 py-2 border-b border-black/10 dark:border-white/20 sm:hidden bg-neo-sky/20 text-[11px] font-mono font-bold text-black dark:text-slate-300 flex items-center justify-between">
            <span>← SWIPE TABLE HORIZONTALLY →</span>
            <span>[{filteredBooks.length} BOOKS]</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-xs font-bold">
              <thead className="border-b-[2.5px] border-black bg-neo-sky text-black uppercase font-black dark:border-white">
                <tr>
                  <th className="px-5 py-4">#</th>
                  <th className="px-5 py-4">Book Title</th>
                  <th className="px-5 py-4">Genre / Category</th>
                  <th className="px-5 py-4">Rating</th>
                  <th className="px-5 py-4">Key Takeaway</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10 dark:divide-white/10 text-black dark:text-white">
                {filteredBooks.map((b, i) => (
                  <tr
                    key={`${b.title}-${i}`}
                    className="transition-colors hover:bg-neo-yellow/20 dark:hover:bg-[#202533]"
                  >
                    <td className="px-5 py-4 font-mono font-black">{String(i + 1).padStart(2, "0")}</td>
                    <td className="px-5 py-4 font-display font-black uppercase max-w-[240px]">
                      {b.title}
                    </td>
                    <td className="px-5 py-4">
                      <span className="neo-badge rounded bg-neo-yellow text-black text-[10px]">
                        {b.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StarRating rating={b.rating} />
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-slate-700 dark:text-slate-300 max-w-md truncate">
                      {b.comment}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => copyReflection(b)}
                        className="neo-btn rounded-lg bg-white px-3 py-1 text-xs font-black uppercase text-black hover:bg-neo-yellow dark:bg-[#121620] dark:text-white"
                      >
                        Copy
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
  );
}
