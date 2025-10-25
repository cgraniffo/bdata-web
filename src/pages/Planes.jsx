// /src/pages/Planes.jsx
import React from "react";

/* === Utiles simples (sin librerías) === */
const Pill = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-700">
    {children}
  </span>
);

const Section = ({ id, children, className = "" }) => (
  <section id={id} className={`max-w-6xl mx-auto px-4 sm:px-6 ${className}`}>
    {children}
  </section>
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const H2 = ({ children }) => (
  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900">
    {children}
  </h2>
);

const H3 = ({ children }) => (
  <h3 className="text-xl md:text-2xl font-bold text-zinc-900">{children}</h3>
);

const Bullet = ({ children }) => (
  <li className="flex gap-2">
    <span className="mt-1">✅</span>
    <span>{children}</span>
  </li>
);

/* === CTA Destinos (cambia URLs si quieres) === */
const WA_URL =
  "https://wa.me/56944645774?text=Hola%20BData%2C%20quiero%20sumarme%20a%20la%20red.";
const CALENDLY_URL = "https://calendly.com/tu-calendly/30min"; // reemplaza por tu enlace real

export default function Planes() {
  return (
    <div className="bg-[#f6fbf8]">
      {/* === HERO === */}
      <div className="bg-gradient-to-b from-emerald-50 to-transparent">
        <Section className="py-10 md:py-14">
          <div className="max-w-6xl">
            <H2>Planes BData</H2>
            <p className="mt-3 text-zinc-900">
              Dos estrategias complementarias para la transformación digital agrícola:
              desde la base territorial con asistencia de profesionales senior (adopción real con metodología clara y objetiva) con componente social hasta el acompañamiento 1:1
              con decisiones guiadas por datos y ROI.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill>Red de apoyo digital</Pill>
              <Pill>Acelera tu digitalización</Pill>
              <Pill>ROI medible</Pill>
            </div>
          </div>
        </Section>
      </div>

      {/* === BLOQUE PRINCIPAL DE PLANES === */}
      <Section className="pb-10">
        <div className="max-w-3xl mb-6">
          <H3>Nuestros planes</H3>
          <p className="mt-2 text-zinc-700">
            Dos caminos que se potencian: primero la adopción real en comunidad, luego
            la profundización 1:1 cuando ya existe base digital.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* === Plan Raíz Digital === */}
          <Card id="raiz" className="p-5 md:p-6">
            <div className="flex items-center justify-between">
              <Pill>🤝🏼 Red de apoyo digital</Pill>
            </div>
            <h4 className="mt-3 text-xl md:text-2xl font-bold text-zinc-900">
              Plan Raíz Digital
            </h4>
            <p className="mt-2 text-zinc-700">
              Conecta agricultores y consultores senior en una relación de aprendizaje mutuo.
              BData aporta método y herramientas para que esa relación se convierta en adopción real.
              Resultado: <strong>Redes de Productores Digitales</strong> financiadas por patrocinadores.
            </p>

            {/* Imagen de apoyo (opcional) */}
            <div className="mt-4 rounded-xl overflow-hidden ring-1 ring-emerald-100 bg-emerald-50 h-40 grid place-items-center text-emerald-700 text-sm">
                <img
    src="/images/siembra-appsheet.png"   // <-- AQUI VA LA FOTO
    alt="Red de Productores Digitales en terreno"
    className="w-full h-40 object-cover"
  />
            </div>

            <div className="mt-5 grid gap-5">
              <div>
                <div className="text-sm font-semibold text-zinc-800">Incluye</div>
                <ul className="mt-2 grid gap-2 text-zinc-700">
                  <Bullet>Red de Productores Digitales por territorio.</Bullet>
                  <Bullet>Mentoría senior + método BData.</Bullet>
                  <Bullet>Herramientas digitales para adopción real (sin enredos).</Bullet>
                  <Bullet>Medición de impacto y resultados en CLP.</Bullet>
                </ul>
              </div>

              <div>
                <div className="text-sm font-semibold text-zinc-800">¿Para quién?</div>
                <p className="mt-2 text-zinc-700">
                  Agricultores que inician o retoman su digitalización, organizaciones del
                  territorio y patrocinadores que quieren activar una red con resultados visibles.
                </p>
              </div>

              <div>
                <div className="text-sm font-semibold text-zinc-800">Resultados esperados</div>
                <ul className="mt-2 grid gap-2 text-zinc-700">
                  <Bullet>Adopción real (hábitos + herramientas).</Bullet>
                  <Bullet>Información útil para decidir (no solo “apps”).</Bullet>
                  <Bullet>Base sólida para pasar a Cosecha (1:1).</Bullet>
                </ul>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  className="rounded-xl bg-emerald-600 px-4 py-3 text-white font-semibold hover:bg-emerald-700"
                  href={WA_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Quiero sumarme a la red
                </a>
                <a
                  className="rounded-xl border px-4 py-3 font-semibold text-zinc-800 hover:bg-zinc-50"
                  href="#contacto"
                >
                  Hablar con BData
                </a>
              </div>
            </div>
          </Card>

          {/* === Plan Cosecha === */}
          <Card id="cosecha" className="p-5 md:p-6">
            <div className="flex items-center justify-between">
              <Pill>🌾 Plan Cosecha</Pill>
            </div>
            <h4 className="mt-3 text-xl md:text-2xl font-bold text-zinc-900">Plan Cosecha</h4>
            <p className="mt-2 text-zinc-700">
              Para productores que ya pasaron por la red y quieren avanzar más.
              Acompañamiento personalizado con herramientas BData en versión avanzada
              para decisiones productivas y <strong>gestión con datos</strong>.
            </p>

            {/* Imagen de apoyo (opcional) */}
            <div className="mt-4 rounded-xl overflow-hidden ring-1 ring-emerald-100 bg-emerald-50 h-40 grid place-items-center text-emerald-700 text-sm">
              <img
    src="/images/Whisk_8077ae17360c055bfe249d154992a6bbeg.png"
    alt="Tablero KPI en terreno"
    className="w-full h-40 object-cover"
  />
            </div>

            <div className="mt-5 grid gap-5">
              <div>
                <div className="text-sm font-semibold text-zinc-800">Incluye</div>
                <ul className="mt-2 grid gap-2 text-zinc-700">
                  <Bullet>Implementación personalizada 1:1.</Bullet>
                  <Bullet>KPI y tableros en CLP por cultivo / cuartel.</Bullet>
                  <Bullet>Orquestación de datos y automatizaciones.</Bullet>
                  <Bullet>Rutina de gestión y decisiones con ROI.</Bullet>
                </ul>
              </div>

              <div>
                <div className="text-sm font-semibold text-zinc-800">¿Para quién?</div>
                <p className="mt-2 text-zinc-700">
                  Productores con base digital que quieren profundizar, acelerar decisiones
                  y capturar valor en costos, rendimiento y gestión.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  className="rounded-xl bg-emerald-600 px-4 py-3 text-white font-semibold hover:bg-emerald-700"
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Quiero avanzar 1:1
                </a>
                <a
                  className="rounded-xl border px-4 py-3 font-semibold text-zinc-800 hover:bg-zinc-50"
                  href="#contacto"
                >
                  Hablar con BData
                </a>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* === COMPARATIVA === */}
      <Section className="pb-12">
        <Card className="p-5 md:p-6">
          <H3>Comparativa rápida</H3>
          <p className="mt-2 text-zinc-700">
            Plan Raíz Digital y Cosecha no compiten: se complementan.
            Primero adopción real; luego aceleración 1:1.
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-[680px] w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-sm text-zinc-600">
                  <th className="py-2 pr-4"></th>
                  <th className="py-2 pr-4">Plan Raíz Digital</th>
                  <th className="py-2">Plan Cosecha</th>
                </tr>
              </thead>
              <tbody className="text-sm text-zinc-800">
                {[
                  ["Objetivo", "Adopción real en comunidad", "Aceleración 1:1 con ROI"],
                  ["Quién participa", "Agricultores + consultor senior", "Productor + equipo BData"],
                  ["Herramientas", "Base, simples y útiles", "Avanzadas (KPI/IoT/automatización)"],
                  ["Financiamiento", "Patrocinadores + productores", "Productor (o convenio)"],
                  ["Resultado clave", "Hábitos + base de datos confiable", "Gestión con tableros/KPI y decisiones"]
                ].map((row, idx) => (
                  <tr key={idx} className="bg-white">
                    <td className="py-2 pr-4 font-semibold">{row[0]}</td>
                    <td className="py-2 pr-4">{row[1]}</td>
                    <td className="py-2">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Section>

      {/* === FAQ === */}
      <Section className="pb-16">
        <div className="max-w-3xl">
          <H3>Preguntas frecuentes</H3>
          <div className="mt-4 grid gap-3">
            <Card className="p-4">
              <div className="font-semibold">¿Tengo que partir por Doble Raíz sí o sí?</div>
              <p className="mt-1 text-zinc-700">
                Es lo ideal si aún no tienes base digital o hábitos instalados.
                Si ya los tienes, puedes ir directo a Cosecha.
              </p>
            </Card>
            <Card className="p-4">
              <div className="font-semibold">¿Cómo se mide el retorno?</div>
              <p className="mt-1 text-zinc-700">
                En CLP, con indicadores acordados por cultivo/lote: tiempo, costos,
                rendimiento, mermas y decisiones clave.
              </p>
            </Card>
            <Card className="p-4">
              <div className="font-semibold">¿Puedo combinar ambos?</div>
              <p className="mt-1 text-zinc-700">
                Sí. Muchas redes avanzan y, con los productores más listos, activamos Cosecha.
              </p>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}
