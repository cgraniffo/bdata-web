import { useState } from "react";

function encode(data) {
  return new URLSearchParams(data).toString();
}

export default function ContactoForm() {
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": form.getAttribute("name"),
          ...Object.fromEntries(formData),
        }),
      });
      setOk(true);
      form.reset();
    } catch (err) {
      setError("Hubo un problema al enviar. Intenta nuevamente.");
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <form
        name="contact"                // 👈 nombre del formulario en Netlify
        method="POST"
        data-netlify="true"           // 👈 activa Netlify Forms
        netlify-honeypot="bot-field"  // 👈 anti-spam simple
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Requerido para envíos programáticos */}
        <input type="hidden" name="form-name" value="contact" />
        {/* Honeypot */}
        <p className="hidden">
          <label>Don’t fill this out: <input name="bot-field" /></label>
        </p>

        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            className="input"
            type="text"
            name="name"
            required
            placeholder="Tu nombre"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="input"
              type="email"
              name="email"
              required
              placeholder="tucorreo@dominio.cl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              className="input"
              type="tel"
              name="phone"
              placeholder="+56 9 ..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Plan</label>
          <select className="input" name="plan" defaultValue="">
            <option value="" disabled>Selecciona una opción</option>
            <option value="Plan Semilla">Plan Semilla</option>
            <option value="Plan Agro Digital">Plan Agro Digital</option>
            <option value="Red de Profesionales">Red de Profesionales</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mensaje</label>
          <textarea
            className="input"
            name="message"
            rows="5"
            placeholder="Cuéntanos brevemente qué necesitas…"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={sending}
            className="btn btn-primary"
          >
            {sending ? "Enviando…" : "Enviar mensaje"}
          </button>
        </div>

        {ok && (
          <p className="text-emerald-700 text-sm">
            ¡Gracias! Recibimos tu mensaje y te contactaremos pronto.
          </p>
        )}
        {error && (
          <p className="text-red-600 text-sm">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
