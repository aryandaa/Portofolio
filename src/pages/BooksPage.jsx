import { useMemo, useState } from "react";
import {
  BookMarked,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Copy,
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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBooks, setExpandedBooks] = useState({});
  const { showToast } = useToast();

  const categories = useMemo(() => {
    const set = new Set();
    booksRead.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return ["All", ...Array.from(set)];
  }, []);

  const filteredBooks = useMemo(() => {
    return booksRead.filter((book) => {
      const matchCategory =
        selectedCategory === "All" || book.category === selectedCategory;
      const matchRating =
        selectedRating === "All"
          ? true
          : selectedRating === "5"
          ? book.rating === 5
          : book.rating >= 4;
      const matchSearch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.comment && book.comment.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchRating && matchSearch;
    });
  }, [selectedCategory, selectedRating, searchQuery]);

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
    <PageShell
      eyebrow="Literacy & Reflections"
      title="Books Read & Key Takeaways"
      description={`Curated collection of ${booksRead.length} books (Self-Improvement, Fiction, History, Science) featuring personal ratings and reflective insights.`}
    >
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
            <span className="block font-display text-2xl font-black text-black dark:text-neo-rose">{categories.length - 1}</span>
            <span className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-300">Literary Genres</span>
          </div>
        </div>

        {/* Search & Rating Filter Controls */}
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

          {/* Rating filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-black uppercase text-black dark:text-slate-300 mr-1 hidden sm:inline">
              Stars:
            </span>
            <button
              type="button"
              onClick={() => setSelectedRating("All")}
              className={`neo-btn rounded-xl px-3 py-1.5 text-xs font-black uppercase ${
                selectedRating === "All"
                  ? "bg-neo-yellow text-black dark:bg-neo-yellow dark:text-black"
                  : "bg-white text-black dark:bg-[#181b24] dark:text-white"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedRating("5")}
              className={`neo-btn rounded-xl px-3 py-1.5 text-xs font-black uppercase ${
                selectedRating === "5"
                  ? "bg-neo-yellow text-black dark:bg-neo-yellow dark:text-black"
                  : "bg-white text-black dark:bg-[#181b24] dark:text-white"
              }`}
            >
              5 ★ Only
            </button>
            <button
              type="button"
              onClick={() => setSelectedRating("4")}
              className={`neo-btn rounded-xl px-3 py-1.5 text-xs font-black uppercase ${
                selectedRating === "4"
                  ? "bg-neo-yellow text-black dark:bg-neo-yellow dark:text-black"
                  : "bg-white text-black dark:bg-[#181b24] dark:text-white"
              }`}
            >
              4+ ★
            </button>
          </div>
        </div>

        {/* Category Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t-2 border-black/10 pt-4 dark:border-white/20">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            const count =
              cat === "All"
                ? booksRead.length
                : booksRead.filter((b) => b.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`neo-btn flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-black uppercase tracking-wider ${
                  active
                    ? "bg-neo-green text-black dark:bg-neo-yellow dark:text-black dark:border-white"
                    : "bg-white text-black hover:bg-neo-palegreen dark:bg-[#181b24] dark:text-white"
                }`}
              >
                <span>{cat}</span>
                <span className="rounded px-1.5 py-0.2 text-[10px] font-mono bg-black/10 dark:bg-white/10">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Book Grid */}
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
                  <div className="flex items-center gap-2">
                    <span className="neo-badge rounded-md bg-neo-yellow text-black text-xs font-black">
                      {book.category}
                    </span>
                    <span className="neo-badge rounded-md bg-white text-black text-[10px] dark:bg-[#202533] dark:text-white">
                      FINISHED ✓
                    </span>
                  </div>
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
                    <span className="block font-display text-[10px] font-black uppercase text-neo-forest dark:text-neo-yellow mb-1">
                      ✦ Aryanda's Reflection:
                    </span>
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
    </PageShell>
  );
}
