# Imperio E

Sitio en Astro preparado para publicarse en Cloudflare Pages y cargar analitica opcional con Google Tag Manager o Google tag.

## Stack actual

- Astro + Preact + Tailwind
- Google Tag Manager o Google tag opcional
- Despliegue estatico apto para Cloudflare Pages

## Variables de entorno

Usa `.env.example` como base.

| Variable | Uso |
| :-- | :-- |
| `PUBLIC_GTM_ID` | Activa Google Tag Manager si existe |
| `PUBLIC_GOOGLE_TAG_ID` | Activa Google tag si no usas GTM |

## Publicacion

Para Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `dist`

El archivo [public/_headers](/c:/Users/lorit/Imperio%20E/public/_headers) ya incluye cabeceras basicas para el despliegue estatico.

## Comandos

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
