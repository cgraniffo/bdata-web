// src/components/ContactoForm.jsx
export default function ContactoForm() {
  const ids = {
    name: "name",
    email: "email",
    phone: "phone",
    plan: "plan",
    message: "message",
    consent: "consent",
    honeypot: "bot-field",
  };

  // helper para convertir FormData a x-www-form-urlencoded
  const encode = (formData) =>
    new URLSearchParams(formData).toString();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Netlify necesita form-name en el payload
    if (!data.get("form-name")) data.set("form-name", form.getAttribute("name"));

    // Honeypot (spam): si está relleno, abortamos en silencio
    if (data.get(ids.honeypot)) return;

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode(data),
    })
      .then(() => {
        // Redirección controlada (prod y localhost)
        window.location.assign("/camino-digital/?ok=1");
      })
      .catch(() => {
        // Si algo falla, quédate en contacto con un flag
        window.location.assign("/contacto?error=1");
      });
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-lg">
      {/* Header */}
      <div className="container-bd mt-6 md:mt-8 lg:mt-10 xl:mt-10 pb-16">
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-lg">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900">
              Cuéntanos en qué estás
            </h2>
            <p className="text-sm text-zinc-600 mt-1">
              Usamos ROI como regla: si no genera retorno, no lo implementamos.
              Los campos marcados con * son obligatorios.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2 text-brand-700 border border-brand-100">
            <span aria-hidden>📈</span>
            <span className="text-xs font-semibold">ROI-First</span>
          </div>
        </div>
      </div>

      {/* === Form (Netlify + JS) === */}
      <form
        name="contact"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={handleSubmit}      // 👈 manejamos el submit, SIN action
        className="p-6 md:p-7"
      >
        {/* Requisito de Netlify */}
        <input type="hidden" name="form-name" value="contact" />

        {/* Honeypot (spam) */}
        <p className="hidden">
          <label>
            No completar:
            <input name={ids.honeypot} id={ids.honeypot} />
          </label>
        </p>

        {/* Campos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
          <button type="submit" className="btn btn-primary">Enviar consulta</button>
          <a
            href="https://wa.me/56944645774"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost"
            aria-label="Abrir WhatsApp para hablar con BData"
          >
            ¿Prefieres WhatsApp?
          </a>
        </div>

        <p className="mt-4 text-xs text-zinc-500">
          Cuidamos tus datos. No compartimos información con terceros.
        </p>
      </form>
    </div>
  );
}
