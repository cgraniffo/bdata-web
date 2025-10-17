// src/data/cases.js
// NOTA: KPIs son EJEMPLOS. Ajusta con tus cifras reales.
// Para fuentes externas usa siempre links completos y confiables.

export const cases = [
  // --- PLAN AGRO DIGITAL (verde) ---
  {
    id: "trigo-ot-appsheet",
    plan: "agro",
    title: "Órdenes de trabajo móviles en siembras de trigo",
    crop: "Trigo",
    region: "Región del Maule",
    client_size: "200–300 ha",
    kpis: {
      productividad: 0.14,        // +14% (ejemplo)
      ahorro_insumos: 0.10,       // +10% (ejemplo)
      costo_anual: 2_400_000,     // CLP ejemplo
    },
    stack: ["AppSheet", "Make", "Sheets"],
    image: "/images/Generated Image September 14, 2025 - 8_05PM.png",
    summary: "OT estandarizadas, reportería en terreno y tablero diario por lote.",
    source_label: "AppSheet — Automatización sin código (referencia de producto)",
    source_url: "https://workspace.google.com/products/appsheet/",
  },
  {
    id: "bodega-fertilizantes",
    plan: "agro",
    title: "Control de bodega y trazabilidad de fertilizantes",
    crop: "Maíz",
    region: "Región del Biobío",
    client_size: "100–150 ha",
    
    kpis: {
      merma: -0.18,                // -18% (ejemplo)
      rotura_stock: -0.35,         // -35% (ejemplo)
      costo_anual: 1_800_000,      // CLP ejemplo
    },
    stack: ["Make", "AppSheet", "Drive"],
    image: "/images/Whisk_8077ae17360c055bfe249d154992a6bbeg.png",
    summary: "Ingreso guiado, QR por pallet y alertas de stock mínimo.",
    source_label: "FAO — Trazabilidad y buenas prácticas",
    source_url: "https://www.fao.org/food-safety/areas-of-work/traceability/en",
  },

  // --- PLAN SEMILLA (azul) ---
  {
    id: "dashboard-pbi",
    plan: "semilla",
    title: "Dashboard de costos por cultivo, acompañamiento y seguimiento mensual",
    crop: "Hortalizas",
    region: "Región de O'higgins",
    client_size: "Pequeño agricultor",
    kpis: {
      visibilidad_costos: 1.0,     // 100% (cualitativo)
      ahorro_compra: 0.08,         // 8% (ejemplo)
      costo_anual: 1_200_000,      // CLP ejemplo
    },
    stack: ["Appsheet", "Looker"],
    image: "/images/bodega-make.png",
    summary: "Indicadores de gestión, variaciones mensuales y alertas de sobreconsumo.",
    source_label: "BData",
    source_url: "Caso interno cliente",
  },
  {
    id: "cooperativa-capacitacion",
    plan: "semilla",
    title: "Capacitación y adopción digital en cooperativa",
    crop: "Trigo",
    region: "Región de la Araucanía",
    client_size: "Cooperativa",
    kpis: {
      productividad: 0.10,         // +10% (ejemplo)
      costo_anual: 900_000,        // CLP ejemplo
    },
    stack: ["Glide", "Sheets"],
    image: "/images/siembra-appsheet.png",
    summary: "Registro digital de labores, costos y salidas con tablero de gestión.",
    source_label: "FIA — Fundación para la Innovación Agraria (referencia)",
    source_url: "https://www.fia.cl",
  },

  // --- RED DE PROFESIONALES (naranjo) ---
  {
    id: "asistencia-tecnica-on-demand",
    plan: "red",
    title: "Asistencia técnica on-demand con foco en ROI",
    crop: "Varios",
    region: "Varias regiones",
    client_size: "Medianos",
    kpis: {
      productividad: 0.06,         // +6% (ejemplo)
      ahorro_insumos: 0.05,        // +5% (ejemplo)
      costo_anual: 1_500_000,      // CLP ejemplo
    },
    stack: ["Experto negocio", "Operaciones", "Datos/BI"],
    image: "/images/Whisk_12cf7c21394cea0980748d2f19696faceg.jpeg",
    summary: "Equipo senior certificado en negocio, operaciones y datos/BI.",
    source_label: "Casos de éxito BDATA",   // interna: sin link
    source_url: "",                          // dejar vacío para no renderizar link
  },
  {
    id: "datos-mercado-odepa",
    plan: "agro",
    title: "Integración de datos de mercado (series públicas ODEPA)",
    crop: "Varios",
    region: "Chile",
    client_size: "Productores y cooperativas",
    kpis: {
      visibilidad_costos: 1.0,
      costo_anual: 600_000,        // CLP ejemplo
    },
    stack: ["Sheets", "Power BI"],
    image: "/images/Whisk_5829b13a5d38fb28ab240e8646b44de6eg.jpeg",
    summary: "Precios y series oficiales integradas al tablero para decisiones informadas.",
    source_label: "ODEPA — Oficina de Estudios y Políticas Agrarias (Gob. de Chile)",
    source_url: "https://www.odepa.gob.cl",
  },
];
