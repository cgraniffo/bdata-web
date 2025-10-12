export default function ImageBanner({ src, title, kicker }) {
  return (
    <div className="relative">
      <img src={src} alt={title} className="w-full h-64 md:h-80 object-cover" />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex items-center">
        <div className="container-bd text-white">
          {kicker && <div className="text-xs uppercase tracking-widest opacity-80 mb-1">{kicker}</div>}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{title}</h1>
        </div>
      </div>
    </div>
  );
}
