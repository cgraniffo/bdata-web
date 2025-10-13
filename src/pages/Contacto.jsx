import { useState } from "react";

export default function ContactoForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "Plan Semilla",
    message: "",
    "bot-field": "", // honeypot
  });
  const [status, setStatus] = useState({ ok: false, error: "" });

  const encode = (data) =>
    new URLSearchParams(Object.entries(data)).toString();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "contact", ...form }),
      });

      if (res.ok) {
        setStatus({ ok: true, error: "" });
        setForm({
          name: "",
          email: "",
          phone: "",
          plan: "Plan Semilla",
          message: "",
          "bot-field": "",
        });
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      setStatus({ ok: false, error: "No se pudo enviar. Intenta de nuevo." });
    }
  }

  return (
    <form
      name="contact"
      method="POST"
      action="/"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* obligatorio para Netlify */}
      <input type="hidden" name="form-name" value="contact" />

      {/* honeypot (oculto) */}
      <p className="hidden">
        <label>
          No completar:
          <input
            name="bot-field"
            value={form["bot-field"]}
            onChange={(e) =>
              setForm((f) => ({ ...f, "bot-field": e.target.value }))
            }
          />
        </label>
      </p>

      <input
        className="input"
        type="text"
        name="name"
        placeholder="Tu nombre"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        required
      />

      <input
        className="input"
        type="email"
        name="email"
        placeholder="tu@correo.cl"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        required
      />

      <input
        className="input"
        type="tel"
        name="phone"
        placeholder="+56 9 1234 5678"
        value={form.phone}
        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
      />

      <select
        className="input"
        name="plan"
        value={form.plan}
        onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))}
      >
        <option>Plan Semilla</option>
        <option>Plan Agro Digital</option>
        <option>Red de Profesionales</option>
      </select>

      <textarea
        className="input"
        name="message"
        rows={5}
        placeholder="¿En qué te ayudamos?"
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
      />

      <button type="submit" className="btn btn-primary">
        Enviar
      </button>

      {status.ok && (
        <p className="text-emerald-700">¡Gracias! Te contactaremos pronto.</p>
      )}
      {status.error && (
        <p className="text-red-600">{status.error}</p>
      )}
    </form>
  );
}
