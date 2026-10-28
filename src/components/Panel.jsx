export default function Panel({ children, className = "", hover = false, color = "" }) {
  const bgClass =
    color ||
    "bg-white dark:bg-neo-darkcard";

  return (
    <div
      className={`rounded-2xl border-[2.5px] border-black dark:border-white shadow-brutal dark:shadow-brutal-dark ${bgClass} p-6 ${
        hover
          ? "transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
