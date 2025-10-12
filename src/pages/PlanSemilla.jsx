import ImageBanner from "../components/ImageBanner.jsx";
import Section from "../components/Section.jsx";
import CaseCard from "../components/CaseCard.jsx";
import { cases } from "../data/cases.js";
import CTA from "../components/CTA.jsx";


export default function PlanSemilla() {
  const data = cases.filter(c => c.plan === "semilla");

  return (
    <div className="bg-orange-50">
      <ImageBanner
        src="/images/hero-agro.png"
        title="Plan impulsa tu Semilla"
        kicker="Digitalización accesible para pequeños agricultores"
      />

      <Section
        title="Oferta del programa"
        subtitle="Automatizaciones clave, dashboard básico, capacitación práctica y lo que nos caracteriza: acompañamiento profesional, cercano y constante."
      >
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {t:"Co-financiamiento",d:"Alianzas público/privadas para democratizar tecnología en los campos."},
            {t:"Capacitación práctica",d:"Adopción acompañada y soporte remoto constante."},
            {t:"Medición de impacto",d:"Indicadores claros y compromisos absoluto de adopción."},
          ].map(({t,d})=>(
            <div key={t} className="card">
              <h3 className="font-semibold mb-1">{t}</h3>
              <p className="text-sm text-zinc-600">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Casos de éxito">
        <div className="grid md:grid-cols-3 gap-6">
          {data.map(item => <CaseCard key={item.id} item={item} />)}
        </div>
      </Section>
      <CTA
  planLabel="Plan Semilla"
  bullets={[
    "Co-financiamiento y adopción guiada",
    "Capacitación práctica y constante para el equipo",
    "Indicadores simples para decidir mejor"
  ]}
/>

    </div>
  );
}
