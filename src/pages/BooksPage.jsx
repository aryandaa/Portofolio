import { BookMarked } from "lucide-react";
import { booksRead } from "../data/portfolio.js";
import PageShell from "../components/PageShell.jsx";
import Panel from "../components/Panel.jsx";
import StarRating from "../components/StarRating.jsx";

export default function BooksPage() {
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
        {booksRead.map((book) => (
          <Panel key={book.title} className="flex min-h-[260px] flex-col p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <BookMarked className="h-7 w-7 shrink-0 text-cyan" aria-hidden="true" />
              <span className="border border-cyan/40 bg-cyan/10 px-3 py-1 text-xs text-cyan">
                {book.category}
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-white">{book.title}</h2>
            <div className="mt-4">
              <StarRating rating={book.rating} />
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-300">{book.comment}</p>
          </Panel>
        ))}
      </div>
    </PageShell>
  );
}
