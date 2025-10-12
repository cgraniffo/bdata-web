import { Link } from "react-router-dom";

export default function Planes() {
  return (
    <div className="bg-white text-zinc-800">
      {/* Encabezado principal */}
      <section className="bg-green-700 text-white py-16 text-center">
        <div className="container-bd">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Planes BData
          </h1>
          <p className="max-w-3xl mx-auto text-lg opacity-90">
            Diseñamos soluciones digitales para el agro chileno con un enfoque
            simple: <strong>retorno medible, acompañamiento y decisiones con datos.</strong>
          </p>
        </div>
      </section>

      {/* Introducción general */}
      <section className="py-12">
        <div className="container-bd text-center max-w-4xl mx-auto">
          <p className="text-zinc-700 text-lg leading-relaxed">
            Nuestros planes se adaptan al tamaño y madurez digital de tu campo.
            No se trata de implementar tecnología por moda, sino de hacerlo
            cuando realmente <strong>genera impacto y ahorro.</strong>
          </p>
          <p className="text-sm text-zinc-500 mt-4">
            Todos los planes incluyen acompañamiento, métricas y soporte directo del equipo BData.
          </p>
        </div>
      </section>

      {/* Plan Semilla */}
      <section className="bg-emerald-50 border-y border-emerald-100 py-14">
        <div className="container-bd grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-emerald-900 mb-2">🌱 Plan Semilla</h2>
            <p className="text-zinc-700 mb-4">
              Ideal para quienes están dando los primeros pasos hacia la gestión digital.
              Implementamos herramientas simples de control de costos, reportería y seguimiento mensual.
            </p>
            <ul className="list-disc list-inside text-zinc-600 mb-4">
              <li>Automatización básica con AppSheet o Glide.</li>
              <li>Indicadores financieros y productivos simples.</li>
              <li>Acompañamiento mensual para adopción digital.</li>
              <li><strong>Recomendado para:</strong> pequeños agricultores o cooperativas en etapa inicial.</li>
            </ul>
            <Link
              to="/plan-semilla"
              className="inline-block bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-800 transition"
            >
              Ver detalles del Plan Semilla →
            </Link>
          </div>

          <div className="text-center">
            <img
              src="/images/dashboard.png"
              alt="Plan Semilla BData"
              className="rounded-xl shadow-md mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Plan Agro Digital */}
      <section className="py-14">
        <div className="container-bd grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1 text-center">
            <img
              src="/images/bodega-make.png"
              alt="Plan Agro Digital BData"
              className="rounded-xl shadow-md mx-auto"
            />
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-emerald-900 mb-2">🚜 Plan Agro Digital</h2>
            <p className="text-zinc-700 mb-4">
              Para productores que buscan escalar y controlar mejor sus operaciones.
              Integramos automatizaciones, reportería y dashboards de ROI adaptados a la gestión agrícola real.
            </p>
            <ul className="list-disc list-inside text-zinc-600 mb-4">
              <li>Automatización de OT, bodegas y costos.</li>
              <li>Dashboard de ROI y gestión de faenas en tiempo real.</li>
              <li>Integración con datos ODEPA y sistemas internos.</li>
              <li><strong>Recomendado para:</strong> campos medianos en crecimiento con equipos en terreno.</li>
            </ul>
            <Link
              to="/plan-agro-digital"
              className="inline-block bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-800 transition"
            >
              Ver detalles del Plan Agro Digital →
            </Link>
          </div>
        </div>
      </section>

      {/* Red de Profesionales */}
      <section className="bg-emerald-50 border-t border-emerald-100 py-14">
        <div className="container-bd grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-emerald-900 mb-2">🤝 Red de Profesionales</h2>
            <p className="text-zinc-700 mb-4">
              Accede a un equipo de expertos en agro, datos y operaciones que te
              acompaña en decisiones estratégicas, proyectos de innovación y gestión continua del ROI.
            </p>
            <ul className="list-disc list-inside text-zinc-600 mb-4">
              <li>Asesoría técnica y estratégica por demanda.</li>
              <li>Análisis de datos y simulación de escenarios productivos.</li>
              <li>Soporte directo de especialistas agrícolas y digitales.</li>
              <li><strong>Recomendado para:</strong> empresas agrícolas, cooperativas y asesores técnicos.</li>
            </ul>
            <Link
              to="/red-profesionales"
              className="inline-block bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-800 transition"
            >
              Ver detalles de la Red de Profesionales →
            </Link>
          </div>

          <div className="text-center">
            <img
              src="/images/siembra-appsheet.png"
              alt="Red de Profesionales BData"
              className="rounded-xl shadow-md mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className="py-20 text-center bg-emerald-700 text-white">
        <div className="container-bd max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-4">
            En BData no implementamos por moda, implementamos con sentido.
          </h2>
          <p className="opacity-90 mb-6">
            Cada campo es distinto, pero la meta siempre es la misma:
            que la tecnología se traduzca en <strong>productividad y rentabilidad real</strong>.
          </p>
          <Link
            to="/contacto"
            className="inline-block bg-white text-emerald-700 px-6 py-3 rounded-lg font-semibold text-sm hover:bg-emerald-100 transition"
          >
            Conversar con BData →
          </Link>
        </div>
      </section>
    </div>
  );
}
