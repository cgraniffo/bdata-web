import { Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { useMemo } from "react";
import { getThemeForPath } from "./theme.js";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import PlanAgroDigital from "./pages/PlanAgroDigital.jsx";
import PlanSemilla from "./pages/PlanSemilla.jsx";
import RedProfesionales from "./pages/RedProfesionales.jsx";
import Contacto from "./pages/Contacto.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";
import CalculadoraROI from "./pages/CalculadoraROI.jsx";
import Planes from "./pages/Planes.jsx";
import SmoothHashScroll from "./components/SmoothHashScroll.jsx";

export default function App() {
  const { pathname } = useLocation();
  const theme = useMemo(() => getThemeForPath(pathname), [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hace scroll al top cada vez que cambia la ruta */}
      <ScrollToTop />
      <SmoothHashScroll />
      <NavBar theme={theme} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plan-agro-digital" element={<PlanAgroDigital />} />
          <Route path="/plan-semilla" element={<PlanSemilla />} />
          {/* OJO: corrige el path para que coincida con tus links */}
          <Route path="/red-de-profesionales" element={<RedProfesionales />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/calculadora-roi" element={<CalculadoraROI />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <WhatsAppButton theme={theme} />

      <footer className="text-center text-xs text-gray-500 py-6">
        © {new Date().getFullYear()} BData • Junto al campo Chileno 🌾
      </footer>
    </div>
  );
}
