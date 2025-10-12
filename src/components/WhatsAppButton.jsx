export default function WhatsAppButton({ theme }) {
  const numero = "+56944645774"; // Cámbialo por tu número real
  const mensaje = "Hola, quiero saber más sobre BData Agro.";
  const url = `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensaje)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className={`fixed bottom-5 right-5 z-50 rounded-full px-5 py-3 shadow-lg text-white text-sm font-semibold ${theme.btn}`}
    >
      WhatsApp
    </a>
  );
}
