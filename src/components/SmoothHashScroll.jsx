// src/components/SmoothHashScroll.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function SmoothHashScroll() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    // espera a que el DOM pinte la vista
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [hash]);

  return null;
}
