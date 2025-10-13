import { useMemo } from "react";

/**
 * Formulario de contacto “enchulado” con mini-hero.
 * Compatible 100% con Netlify (build-time detection y envío).
 *
 * - Mantiene name="contact" + hidden input form-name
 * - Incluye honeypot "bot-field"
 * - method="POST" + data-netlify + netlify-honeypot
 * - Redirige a la misma ruta con ?enviado=1 para UX SPA
 */
export default function ContactoForm() {
  // Para generar un id único por campo (accesibilidad)
  const ids = useMemo(
    () => ({
      name: "f-name",
      email: "f-email",
      phone: "f-phone",
      plan: "f-plan",
      message: "f-message",
      consent: "f-consent",
      honeypot: "bot-field",
    }),
    []
  );

  return (
   

    {/* Mini-Hero con fondo agrícola */}
<div
  className="relative text-white overflow-hidden"
  style={{
    backgroundImage: "url('/images/hero-agro.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Capa verde semitransparente */}
  <div className="absolute inset-0 bg-brand-700/70 backdrop-blur-[2px]"></div>

  {/* Contenido hero */}
  <div className="relative container-bd py-16 md:py-20">
    <div className="max-w-3xl">
      <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2 backdrop-blur">
        {/* Icono sobre */}
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.2-.3 7.67 5.19a1.5 1.5 0 0 0 1.66 0L21.2 6.2a1 1 0 0 0-.7-1.7h-15a1 1 0 0 0-.7 1.7ZM21 8.29l-6.86 4.64a3.5 3.5 0 0 1-3.88 0L3.4 8.3v9.2c0 .44.36.8.8.8h15c.44 0 .8-.36.8-.8V8.29Z" />
        </svg>
        <span className="text-sm/5 font-semibold tracking-wide">
          Conversemos de tu campo
        </span>
      </div>

      <h1 className="mt-5 text-3xl md:text-5xl font-extrabold drop-shadow-sm">
        Rentabiliza tu campo con datos e inteligencia
      </h1>

      <p className="mt-3 text-white/90 max-w-2xl leading-relaxed">
        Agenda una consultoría inicial sin costo. 
        Evaluamos tus procesos y te mostramos 
        cómo transformar tus datos en decisiones rentables.
      </p>
    </div>
  </div>
</div>


      {/* Tarjeta de formulario */}
      <div className="container-bd -mt-8 md:-mt-10 pb-16">
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-lg">
          {/* Header de la tarjeta */}
          <div className="border-b border-zinc-100 p-6 md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-zinc-900">
                  Cuéntanos en qué estás
                </h2>
                <p className="text-sm text-zinc-600 mt-1">
                  Usamos ROI como regla: si no genera retorno, no lo
                  implementamos. Los campos marcados con * son obligatorios.
                </p>
              </div>
              {/* Sello simple */}
              <div className="hidden md:flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2 text-brand-700 border border-brand-100">
                <span aria-hidden>📈</span>
                <span className="text-xs font-semibold">ROI-First</span>
              </div>
            </div>
          </div>

          {/* Form (Netlify) */}
          <form
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            action="/contacto?enviado=1"
            className="p-6 md:p-7"
          >
            {/* Netlify needs this hidden input */}
            <input type="hidden" name="form-name" value="contact" />
            {/* Honeypot */}
            <p className="hidden">
              <label>
                No completar:
                <input name="bot-field" id={ids.honeypot} />
              </label>
            </p>

            {/* Grid de inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nombre */}
              <div>
                <label htmlFor={ids.name} className="block text-sm font-medium text-zinc-700">
                  Nombre y apellido *
                </label>
                <input
                  id={ids.name}
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="input mt-1"
                  placeholder="Ej: Ana Campos"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor={ids.email} className="block text-sm font-medium text-zinc-700">
                  Correo electrónico *
                </label>
                <input
                  id={ids.email}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="input mt-1"
                  placeholder="ana@ejemplo.cl"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label htmlFor={ids.phone} className="block text-sm font-medium text-zinc-700">
                  Teléfono
                </label>
                <input
                  id={ids.phone}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="input mt-1"
                  placeholder="+56 9 1234 5678"
                />
              </div>

              {/* Plan de interés */}
              <div>
                <label htmlFor={ids.plan} className="block text-sm font-medium text-zinc-700">
                  Plan de interés
                </label>
                <select id={ids.plan} name="plan" className="input mt-1">
                  <option value="">— Selecciona —</option>
                  <option>Plan Semilla</option>
                  <option>Plan Agro Digital</option>
                  <option>Red de Profesionales</option>
                </select>
              </div>

              {/* Mensaje (ocupa 2 columnas en desktop) */}
              <div className="md:col-span-2">
                <label htmlFor={ids.message} className="block text-sm font-medium text-zinc-700">
                  ¿En qué te ayudamos? *
                </label>
                <textarea
                  id={ids.message}
                  name="message"
                  required
                  rows={5}
                  className="input mt-1"
                  placeholder="Cuéntanos brevemente tu situación, cultivo, región, etc."
                />
              </div>

              {/* Consentimiento */}
              <div className="md:col-span-2">
                <label className="inline-flex items-start gap-3">
                  <input
                    id={ids.consent}
                    name="consent"
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-zinc-300 text-brand-600 focus:ring-brand-500"
                    required
                  />
                  <span className="text-sm text-zinc-600">
                    Acepto ser contactad@ por BData a través de los datos entregados. *
                  </span>
                </label>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="submit" className="btn btn-primary">
                Enviar consulta
              </button>

              <a
                href="https://wa.me/56900000000"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost"
                aria-label="Abrir WhatsApp para hablar con BData"
              >
                ¿Prefieres WhatsApp?
              </a>
            </div>

            {/* Notita de privacidad */}
            <p className="mt-4 text-xs text-zinc-500">
              Cuidamos tus datos. No compartimos información con terceros.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
