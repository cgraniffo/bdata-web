// src/components/NavBar.jsx
import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import logoUrl from "../assets/Logo_Final_Transparente.png";

const homeSections = [
  { hash: "#metodologia", label: "Nuestra metodología" },
  { hash: "#planes",       label: "Nuestros planes" },
  { hash: "#casos",        label: "Casos de éxito" },
  { hash: "#porque",       label: "¿Por qué BData?" },
];

const extraItems = [
  { to: "/contacto", label: "Contacto", type: "route" },
];

// Ítems del menú "Camino Digital"
const caminoItems = [
  { to: "/camino-digital",            label: "Resumen Camino Digital", type: "route" }, // overview
  { to: "/calculadora-roi",           label: "Calculadora ROI",        type: "route" },
  { href: "https://optimizador.bdata.cl", label: "Optimizar fertilización (Beta)", type: "external" },
  // cuando tengas la encuesta:
  // { to: "/encuesta-digitalizacion",   label: "Encuesta de digitalización", type: "route" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const baseLink =
    "text-zinc-800 hover:text-emerald-700 font-medium transition-colors";
  const activeLink =
    "text-emerald-700 font-semibold underline underline-offset-4";

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleHomeAnchor = (hash) => {
    const id = hash.replace("#", "");
    if (pathname === "/") {
      scrollToId(id);
    } else {
      navigate(`/${hash}`);
    }
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <nav className="container-bd flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logoUrl}
            alt="BData"
            className="h-10 w-auto md:h-12"
          />
          <span className="font-semibold text-base md:text-lg text-emerald-700">
            Digitalizando el campo chileno
          </span>
        </Link>

        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-zinc-200 text-zinc-700 hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-emerald-600"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>

        {/* Menú desktop */}
        <ul className="hidden md:flex items-center gap-6">
          {homeSections.map(({ hash, label }) => (
            <li key={hash}>
              <button
                onClick={() => handleHomeAnchor(hash)}
                className={baseLink + " text-sm md:text-base"}
              >
                {label}
              </button>
            </li>
          ))}

          {/* Dropdown Camino Digital (reemplaza a “Herramientas IA”) */}
          <li className="relative group">
            <button className={baseLink + " text-sm md:text-base"}>
              Camino Digital
            </button>
            <div className="absolute left-0 top-full z-10 pt-2">
              <div className="hidden group-hover:block group-focus-within:block bg-white border rounded-md shadow-lg min-w-[14rem]">
                <ul className="py-2">
                  {caminoItems.map((item) => (
                    <li key={item.label}>
                      {item.type === "route" ? (
                        <NavLink
                          to={item.to}
                          className={({ isActive }) =>
                            (isActive ? activeLink : baseLink) + " block px-4 py-2 text-sm"
                          }
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </NavLink>
                      ) : (
                        <a
                          href={item.href}
                          className={baseLink + " block px-4 py-2 text-sm"}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>

          {extraItems.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  (isActive ? activeLink : baseLink) + " text-sm md:text-base"
                }
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Menú móvil */}
      <div className={open ? "md:hidden border-t bg-white" : "hidden"}>
        <ul className="container-bd py-3 space-y-2">
          {homeSections.map(({ hash, label }) => (
            <li key={hash}>
              <button
                onClick={() => handleHomeAnchor(hash)}
                className={baseLink + " block py-2 w-full text-left"}
              >
                {label}
              </button>
            </li>
          ))}

          {/* Sección Camino Digital (móvil) */}
          <li className="pt-2">
            <div className="text-zinc-500 text-xs uppercase px-1">Camino Digital</div>
          </li>
          {caminoItems.map((item) => (
            <li key={item.label}>
              {item.type === "route" ? (
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    (isActive ? activeLink : baseLink) + " block py-2"
                  }
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
              ) : (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={baseLink + " block py-2"}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}

          {extraItems.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  (isActive ? activeLink : baseLink) + " block py-2"
                }
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
