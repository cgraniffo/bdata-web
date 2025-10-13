// src/EnfoqueEstrategico.jsx
export default function EnfoqueEstrategico() {
  return (
    <section className="bg-emerald-50 py-12 md:py-4">
      <div className="text-center max-w-5xl mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-900 mb-3">
        Nuestra metodología 🚀
      </h2>

      <p className="text-xl md:text-2xl font-semibold text-emerald-900 leading-snug mb-6">
        Primero entendemos 🧠… Luego optimizamos 🛠️,<br />
        Después (sólo si corresponde) automatizamos y aplicamos IA 🤖.
      </p>

      <p className="text-sm md:text-base text-emerald-700 max-w-4xl mx-auto leading-relaxed">
        No partimos con herramientas, partimos con <strong>propósito</strong>.<br />
        Entramos en tus procesos, medimos, y recién ahí aplicamos tecnología
        cuando tiene sentido y genera retorno real.
      </p>
        {/* Tarjetas */}
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white border border-emerald-100 p-6 shadow-sm">
            <div className="text-2xl">🧠</div>
            <h3 className="text-xl font-semibold text-emerald-800 mt-2">Analizar</h3>
            <p className="text-sm text-zinc-700 mt-2">
              Diagnosticamos tus flujos, tiempos y costos reales.<br /> Sin supuestos ni
              plantillas genéricas identificamos potenciales oportunidades de mejora y eficiencia,
            </p>
          </div>

          <div className="rounded-xl bg-white border border-emerald-100 p-6 shadow-sm">
            <div className="text-2xl">🛠</div>
            <h3 className="text-xl font-semibold text-emerald-800 mt-2">Optimizar</h3>
            <p className="text-sm text-zinc-700 mt-2">
              Mejoramos procesos antes de digitalizar.<br /> Muchas veces la solución no es más
              software, sino menos fricción.
            </p>
          </div>

          <div className="rounded-xl bg-white border border-emerald-100 p-6 shadow-sm">
            <div className="text-2xl">🤖</div>
            <h3 className="text-xl font-semibold text-emerald-800 mt-2">Automatizar</h3>
            <p className="text-sm text-zinc-700 mt-2">
              Cuando el proceso es claro y cumple criterios establecidos, lo hacen candidato a aplicar IA, automatización u otra herramienta tecnológica, siempre con retorno
              medible.<br /> Cada implementación que hacemos tiene ROI medible.
            </p>
          </div>
        </div>

        {/* Nota editorial suave */}
        <p className="text-xs text-emerald-900/70 mt-6 text-center">
          Nuestro enfoque evita el <strong> “brillo por moda”</strong>: primero el proceso, luego la
          herramienta (sólo si es necesario).
        </p>
      </div>
    </section>
  );
}
