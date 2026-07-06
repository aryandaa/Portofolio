export default function Panel({ children, className = "" }) {
  return (
    <div className={`neon-border clip-corner bg-night/70 p-5 backdrop-blur-md ${className}`}>
      {children}
    </div>
  );
}
