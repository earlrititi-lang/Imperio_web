import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "../config/site";

const staticRoutes = [
  "/",
  "/manifiesto",
  "/precios",
  "/biblioteca",
  "/efemerides",
  "/ensayos",
  "/presente",
  "/rutas",
  "/tienda",
  "/comunidad",
  "/cuenta",
  "/login",
  "/registro",
  "/perfil",
  "/suscripcion",
  "/contacto",
  "/legal",
  "/privacidad",
  "/cookies",
];

const toUrl = (path: string) => new URL(path, SITE.url).toString();

export const GET: APIRoute = async () => {
  const articles = await getCollection("articles");
  const drops = await getCollection("drops");
  const rutas = await getCollection("rutas");

  const urls = [
    ...staticRoutes.map(toUrl),
    ...articles.map((entry) => toUrl(`/biblioteca/${entry.id}`)),
    ...drops.map((entry) => toUrl(`/tienda/${entry.id}`)),
    ...rutas.map((entry) => toUrl(`/rutas/${entry.id}`)),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=UTF-8",
    },
  });
};
