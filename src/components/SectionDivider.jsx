// src/components/SectionDivider.jsx
export default function SectionDivider({ variant = "white-to-mint", className = "" }) {
  const base =
    variant === "white-to-mint"
      ? "from-white to-emerald-50"
      : "from-emerald-50 to-white";

  return (
    <div className={`h-6 md:h-8 bg-gradient-to-b ${base} ${className}`} />
  );
}
