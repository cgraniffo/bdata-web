import CTA from "../components/CTA.jsx";
import ImageBanner from "../components/ImageBanner.jsx";
import Section from "../components/Section.jsx";
import CaseCard from "../components/CaseCard.jsx";
import { cases } from "../data/cases.js";

export default function PlanAgroDigital() {
  const data = cases.filter(c => c.plan === "agro");

  return (
    <div className="bg-orange-50">
      <ImageBanner
        src="/images/bodega-make.png"
        title="Plan Campo Digital"
        kicker="Una Gerencia Digital al alcance de tu presupuesto, uno más de tu equipo"
      />

      <Section
        title="Qué incluye este acompañamiento"
        subtitle="Diagnóstico del grado de digitalización de tu campo, automatizaciones críticas, dashboards de gestión y acompañamiento en tod el proceso (y de manera muy cercana) en implementación."
      >
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {t:"Diagnóstico y roadmap",d:"Mapeamos tus procesos críticos, desarrollamos un plan de acción y te acompañamos de cerca en la implementación, somos parte de tu equipo."},
            {t:"Automatizaciones",d:"Aplicaciones y automatizaciones customizadas para reportes, inventarios, OT y alertas tempranas de variaciones para tomar acción."},
            {t:"Dashboard de gestión de la información",d:"Indicadores de gestión de tu campo con foco claro en ROI al alcance de tu mano."},
          ].map(({t,d})=>(
            <div key={t} className="card">
              <h3 className="font-semibold mb-1">{t}</h3>
              <p className="text-sm text-zinc-600">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Casos de éxito BData" subtitle="Resultados medidos y trazables.">
        <div className="grid md:grid-cols-3 gap-6">
          {data.map(item => <CaseCard key={item.id} item={item} />)}
        </div>
      </Section>
      <CTA
  planLabel="Plan Agro Digital"
  bullets={[
    "Diagnóstico exprés sin costo",
    "Foco en ROI ",
    "Acompañamiento cercano, nos transformamos en uno más de tu equipo"
  ]}
/>

    </div>
  );
}
