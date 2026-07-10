import { useState } from "react";
import { BookMarked, ChevronDown, ChevronUp } from "lucide-react";
import { booksRead } from "../data/books.js";
import PageShell from "../components/PageShell.jsx";
import Panel from "../components/Panel.jsx";
import StarRating from "../components/StarRating.jsx";

const commentPreviewLimit = 180;

const bookCategoryStyles = {
  novel: {
    card: "border-danger/30 bg-danger/10",
    icon: "text-rose-300",
    badge: "border-danger/50 bg-danger/10 text-rose-100",
    button: "border-danger/50 bg-danger/10 text-rose-100",
  },
  selfImprovement: {
    card: "border-emerald-400/30 bg-emerald-400/10",
    icon: "text-emerald-300",
    badge: "border-emerald-400/50 bg-emerald-400/10 text-emerald-100",
    button: "border-emerald-400/50 bg-emerald-400/10 text-emerald-100",
  },
  learning: {
    card: "border-yellow-400/30 bg-yellow-400/10",
    icon: "text-yellow-300",
    badge: "border-yellow-400/50 bg-yellow-400/10 text-yellow-100",
    button: "border-yellow-400/50 bg-yellow-400/10 text-yellow-100",
  },
  history: {
    card: "border-orange-400/30 bg-orange-400/10",
    icon: "text-orange-300",
    badge: "border-orange-400/50 bg-orange-400/10 text-orange-100",
    button: "border-orange-400/50 bg-orange-400/10 text-orange-100",
  },
  darkFiction: {
    card: "border-fuchsia-400/30 bg-fuchsia-400/10",
    icon: "text-fuchsia-300",
    badge: "border-fuchsia-400/50 bg-fuchsia-400/10 text-fuchsia-100",
    button: "border-fuchsia-400/50 bg-fuchsia-400/10 text-fuchsia-100",
  },
  default: {
    card: "border-cyan/30 bg-cyan/10",
    icon: "text-cyan",
    badge: "border-cyan/40 bg-cyan/10 text-cyan",
    button: "border-cyan/50 bg-cyan/10 text-cyan",
  },
};

function getBookKey(book) {
  return `${book.title}-${book.category}`;
}

function getBookCategoryStyle(category) {
  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory.includes("novel")) return bookCategoryStyles.novel;
  if (
    normalizedCategory.includes("self") ||
    normalizedCategory.includes("improvement") ||
    normalizedCategory.includes("improvment")
  ) {
    return bookCategoryStyles.selfImprovement;
  }
  if (
    normalizedCategory.includes("pelajaran") ||
    normalizedCategory.includes("education") ||
    normalizedCategory.includes("learning") ||
    normalizedCategory.includes("technology") ||
    normalizedCategory.includes("philosophy") ||
    normalizedCategory.includes("programming")
  ) {
    return bookCategoryStyles.learning;
  }
  if (
    normalizedCategory.includes("biography") ||
    normalizedCategory.includes("documentary") ||
    normalizedCategory.includes("history") ||
    normalizedCategory.includes("political")
  ) {
    return bookCategoryStyles.history;
  }
  if (
    normalizedCategory.includes("horror") ||
    normalizedCategory.includes("mystery") ||
    normalizedCategory.includes("thriller")
  ) {
    return bookCategoryStyles.darkFiction;
  }

  return bookCategoryStyles.default;
}

function normalizeComment(comment) {
  return comment
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

function BookComment({ book, isExpanded, onToggle, categoryStyle }) {
  const normalizedComment = normalizeComment(book.comment);
  const shouldTruncate = normalizedComment.length > commentPreviewLimit;
  const visibleComment =
    shouldTruncate && !isExpanded
      ? `${normalizedComment.slice(0, commentPreviewLimit).trim()}...`
      : normalizedComment;

  return (
    <div className="mt-5">
      <p className="whitespace-pre-line text-sm leading-7 text-slate-300">{visibleComment}</p>

      {shouldTruncate && (
        <button
          type="button"
          onClick={onToggle}
          className={`interactive-link mt-4 inline-flex items-center gap-2 border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${categoryStyle.button}`}
        >
          <span>{isExpanded ? "Read Less" : "Read More"}</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}

export default function BooksPage() {
  const [expandedBooks, setExpandedBooks] = useState({});

  const toggleBookComment = (book) => {
    const key = getBookKey(book);
    setExpandedBooks((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <PageShell eyebrow="Reading ledger" title="Books Read">
      {booksRead.length === 0 && (
        <Panel className="p-8">
          <p className="max-w-2xl text-sm leading-7 text-slate-300">
            No book records were listed in the CV yet.
          </p>
        </Panel>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {booksRead.map((book) => {
          const categoryStyle = getBookCategoryStyle(book.category);

          return (
            <Panel
              key={book.title}
              className={`flex min-h-[260px] flex-col p-6 ${categoryStyle.card}`}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <BookMarked className={`h-7 w-7 shrink-0 ${categoryStyle.icon}`} aria-hidden="true" />
                <span className={`interactive-chip border px-3 py-1 text-xs ${categoryStyle.badge}`}>
                  {book.category}
                </span>
              </div>
              <h2 className="font-display text-xl font-bold text-white">{book.title}</h2>
              <div className="mt-4">
                <StarRating rating={book.rating} />
              </div>
              <BookComment
                book={book}
                isExpanded={Boolean(expandedBooks[getBookKey(book)])}
                onToggle={() => toggleBookComment(book)}
                categoryStyle={categoryStyle}
              />
            </Panel>
          );
        })}
      </div>
    </PageShell>
  );
}
