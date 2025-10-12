import ImageBanner from "../components/ImageBanner.jsx";
import Section from "../components/Section.jsx";
import CaseCard from "../components/CaseCard.jsx";
import { cases } from "../data/cases.js";
import CTA from "../components/CTA.jsx";


export default function RedProfesionales() {
  const data = cases.filter(c => c.plan === "red");

  return (
    <div className="bg-orange-50">
      <ImageBanner
        src="/images/siembra-appsheet.png"
        title="Red de Profesionales On Demand"
        kicker="Consultores senior certificados a tu alcance"
      />

      <Section
        title="Perfiles y calidad"
        subtitle="Profesionales senior del ámbito de gestión y TI al alcance de tu mano te ayudan a impulsar tu campo a través de la planificación e implementación de proyectos que generan valor en tus campos."
      >
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {t:"Negocio y ROI",d:"Gerencia digital externa con foco en resultados."},
            {t:"Operaciones",d:"Estandarización de procesos y trazabilidad."},
            {t:"Datos y BI",d:"Automatización y tableros claros."},
          ].map(({t,d})=>(
            <div key={t} className="card">
              <h3 className="font-semibold mb-1">{t}</h3>
              <p className="text-sm text-zinc-600">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {data.length > 0 && (
        <Section title="Casos de despliegue">
          <div className="grid md:grid-cols-3 gap-6">
            {data.map(item => <CaseCard key={item.id} item={item} />)}
          </div>
        </Section>
      )}

<CTA
  planLabel="Red de Profesionales"
  bullets={[
    "Consultores senior certificados se integran a tu equipo",
    "Despliegue on-demand, según estacionalidad",
    "Foco en resultados medibles (operaciones y ROI)",
    "Inversión muy accesible y con alto impacto en ROI"
  ]}
/>



    </div>
  );
}
