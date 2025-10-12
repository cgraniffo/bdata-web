// src/components/Section.jsx
export default function Section({
  title,
  subtitle,
  children,
  className = "",
  compact = false,           // ⬅️ nuevo
}) {
  // densidades
  const py = compact ? "py-6 md:py-8" : "py-12 md:py-16";
  const titleMb = compact ? "mb-2" : "mb-4";
  const subtitleMb = compact ? "mb-6" : "mb-10";

  return (
    <section className={`${py} ${className}`}>
      <div className="container-bd">
        {title && (
          <h2 className={`text-3xl font-bold text-emerald-900 ${titleMb}`}>
            {title}
          </h2>
        )}

        {subtitle && (
          <p className={`text-zinc-700 max-w-3xl ${compact ? "text-sm" : ""} ${subtitleMb}`}>
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </section>
  );
}
