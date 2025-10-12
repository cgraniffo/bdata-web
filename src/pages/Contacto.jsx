import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

const initial = {
  nombre: "",
  email: "",
  telefono: "",
  cultivo: "",
  hectareas: "",
  plan: "",
  //presupuesto: "",
  mensaje: "",
  terms: false,
  // honeypot
  website: "",
};

const requiredMsg = "Este campo es requerido";

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPosNumber = (v) => v === "" || (!Number.isNaN(Number(v)) && Number(v) >= 0);

export default function Contacto() {
  const [data, setData] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "idle", msg: "" });
  const formRef = useRef(null);

  // Si defines VITE_WEB3FORMS_KEY en .env, activamos envío real
  const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY?.trim();
  const MODO_DEMO = !ACCESS_KEY;

  const validate = useMemo(
    () => ({
      nombre: (v) => (!v ? requiredMsg : ""),
      email: (v) => (!v ? requiredMsg : !isEmail(v) ? "Email inválido" : ""),
      telefono: (v) => (!v ? requiredMsg : ""),
      cultivo: (v) => "",
      hectareas: (v) => (!isPosNumber(v) ? "Debe ser un número ≥ 0" : ""),
      plan: (v) => (!v ? requiredMsg : ""),
      //presupuesto: (v) => (!isPosNumber(v) ? "Debe ser un número ≥ 0" : ""),
      mensaje: (v) => (!v ? requiredMsg : ""),
      terms: (v) => (!v ? "Debes aceptar las condiciones" : ""),
      website: () => "", // honeypot
    }),
    []
  );

  const runValidation = (payload) => {
    const newErr = {};
    Object.keys(validate).forEach((k) => {
      const e = validate[k](payload[k]);
      if (e) newErr[k] = e;
    });
    return newErr;
  };

  const onChange = (e) => {
    const { name, type, value, checked } = e.target;
    setData((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) {
      setErrors((s) => ({ ...s, [name]: undefined }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "idle", msg: "" });

    // anti-bot simple
    if (data.website) return;

    const newErr = runValidation(data);
    if (Object.keys(newErr).length) {
      setErrors(newErr);
      // mover foco al primer error
      const first = Object.keys(newErr)[0];
      const firstEl = formRef.current?.querySelector(`[name="${first}"]`);
      firstEl?.focus();
      return;
    }

    setStatus({ type: "loading", msg: "" });

    try {
      if (MODO_DEMO) {
        // DEMO: simulamos un envío
        await new Promise((r) => setTimeout(r, 800));
        setStatus({ type: "success", msg: "¡Gracias! Te contactaremos muy pronto." });
      } else {
        const body = new FormData();
        body.append("access_key", ACCESS_KEY);
        body.append("from_name", "Formulario BData.cl");
        Object.entries(data).forEach(([k, v]) => body.append(k, String(v)));

        // Campos útiles para ordenar correos entrantes
        body.append("subject", "Nuevo lead desde bdata.cl");
        body.append("redirect", ""); // qué hacer post-submit (lo manejamos nosotros)

        const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body });
        const json = await res.json();

        if (!json.success) throw new Error(json.message || "Fallo al enviar");
        setStatus({ type: "success", msg: "¡Gracias! Te contactaremos muy pronto." });
      }

      setData(initial);
      formRef.current?.reset();
    } catch (err) {
      setStatus({
        type: "error",
        msg: "No pudimos enviar el formulario. Intenta nuevamente o escríbenos a hola@bdata.cl",
      });
    }
  };

  return (
    <div className="bg-emerald-50/50 py-10 md:py-14">
      <div className="container-bd max-w-4xl">
        <header className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-900">Conversemos 👋</h1>
          <p className="text-zinc-600 max-w-2xl mx-auto mt-2">
            Cuéntanos tu situación y vemos juntos el mejor camino. Preferimos medir y optimizar antes de automatizar.
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            {MODO_DEMO
              ? "Modo DEMO: el envío real se activará cuando agregues VITE_WEB3FORMS_KEY en tu .env"
              : "Envío seguro activado con Web3Forms"}
          </p>
          <div className="mt-3">
            <Link
              to="/calculadora-roi"
              className="inline-block text-sm bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800"
            >
              Calcular mi ROI primero →
            </Link>
          </div>
        </header>

        {/* Alertas */}
        {status.type === "success" && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
            {status.msg}
          </div>
        )}
        {status.type === "error" && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
            {status.msg}
          </div>
        )}

        <form ref={formRef} onSubmit={onSubmit} noValidate className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          {/* honeypot */}
          <input type="text" name="website" value={data.website} onChange={onChange} className="hidden" tabIndex={-1} />

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Nombre y apellido" id="nombre" error={errors.nombre} required>
              <input
                id="nombre"
                name="nombre"
                type="text"
                onChange={onChange}
                aria-invalid={!!errors.nombre}
                aria-describedby={errors.nombre ? "err-nombre" : undefined}
                className="input"
                placeholder="Ej: María Pérez"
              />
            </Field>

            <Field label="Email" id="email" error={errors.email} required>
              <input
                id="email"
                name="email"
                type="email"
                onChange={onChange}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "err-email" : undefined}
                className="input"
                placeholder="tu@correo.cl"
              />
            </Field>

            <Field label="Teléfono" id="telefono" error={errors.telefono} required>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                onChange={onChange}
                aria-invalid={!!errors.telefono}
                aria-describedby={errors.telefono ? "err-telefono" : undefined}
                className="input"
                placeholder="+56 9 1234 5678"
              />
            </Field>

            <Field label="Cultivo (opcional)" id="cultivo" error={errors.cultivo}>
              <input
                id="cultivo"
                name="cultivo"
                type="text"
                onChange={onChange}
                className="input"
                placeholder="Ej: Maíz, Trigo, Hortalizas…"
              />
            </Field>

            <Field label="Hectáreas (opcional)" id="hectareas" error={errors.hectareas}>
              <input
                id="hectareas"
                name="hectareas"
                type="number"
                inputMode="numeric"
                min="0"
                onChange={onChange}
                aria-invalid={!!errors.hectareas}
                aria-describedby={errors.hectareas ? "err-hectareas" : undefined}
                className="input"
                placeholder="Ej: 120"
              />
            </Field>

            <Field label="Plan de interés" id="plan" error={errors.plan} required>
              <select
                id="plan"
                name="plan"
                onChange={onChange}
                aria-invalid={!!errors.plan}
                aria-describedby={errors.plan ? "err-plan" : undefined}
                className="input"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecciona un plan
                </option>
                <option value="semilla">🌱 Plan Semilla</option>
                <option value="agro">🚜 Plan Agro Digital</option>
                <option value="red">🤝 Red de Profesionales</option>
                <option value="otro">No estoy seguro / Otro</option>
              </select>
            </Field>



            <div className="md:col-span-2">
              <Field label="Cuéntanos brevemente tu situación" id="mensaje" error={errors.mensaje} required>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={5}
                  onChange={onChange}
                  aria-invalid={!!errors.mensaje}
                  aria-describedby={errors.mensaje ? "err-mensaje" : undefined}
                  className="input resize-y"
                  placeholder="Qué te gustaría mejorar, optimizar o medir primero…"
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-start gap-3 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  name="terms"
                  onChange={onChange}
                  aria-invalid={!!errors.terms}
                  aria-describedby={errors.terms ? "err-terms" : undefined}
                  className="mt-1 h-4 w-4 rounded border-zinc-300 text-emerald-700 focus:ring-emerald-600"
                />
                <span>
                  Acepto que BData me contacte para evaluar mi caso. Conservamos tu información sólo para este propósito.
                </span>
              </label>
              {errors.terms && (
                <p id="err-terms" className="mt-1 text-xs text-red-600">
                  {errors.terms}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/calculadora-roi"
              className="text-sm text-emerald-800 underline underline-offset-4 hover:text-emerald-900"
            >
              ¿Aún no estás seguro? Calcula primero tu ROI →
            </Link>

            <button
              type="submit"
              disabled={status.type === "loading"}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-white font-semibold hover:bg-emerald-800 disabled:opacity-60"
            >
              {status.type === "loading" ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Enviando…
                </>
              ) : (
                "Enviar consulta"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Subcomponente de campo ---------- */
function Field({ label, id, error, required, children }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-1 text-sm font-medium text-zinc-800">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {error && (
        <p id={`err-${id}`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
