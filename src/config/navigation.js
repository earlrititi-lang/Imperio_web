import { withBase } from "../utils/basePath";

export const NAV_ITEMS = [
  { href: withBase("/sobre-nosotros"), label: "Memorial" },
  { href: withBase("/articulos"), label: "Papeles y Tratados" },
  { href: withBase("/biblioteca"), label: "Libreria" },
  { href: withBase("/foro"), label: "Mentidero" },
  { href: withBase("/tienda"), label: "Casa de Mercaderias" },
  { href: withBase("/contacto"), label: "Audiencia" },
];
