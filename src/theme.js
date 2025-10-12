export function getThemeForPath(pathname) {
  if (pathname.startsWith("/plan-semilla")) {
    return {
      brand: "text-blue-600",
      active: "text-blue-700",
      hoverBg: "hover:bg-blue-50",
      btn: "bg-blue-600 hover:bg-blue-700",
    };
  }
  if (pathname.startsWith("/red-profesionales")) {
    return {
      brand: "text-orange-600",
      active: "text-orange-700",
      hoverBg: "hover:bg-orange-50",
      btn: "bg-orange-600 hover:bg-orange-700",
    };
  }
  // Home + Plan Agro Digital (verde por defecto)
  return {
    brand: "text-green-700",
    active: "text-green-700",
    hoverBg: "hover:bg-green-50",
    btn: "bg-green-600 hover:bg-green-700",
  };
}
