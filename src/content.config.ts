import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articles = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.string(),
    category: z.enum(["efemeride", "ensayo", "presente"]),
    tier: z.enum(["gratis", "rodelero", "piquero"]),
    seoDescription: z.string().optional(),
    ogImage: z.string().optional(),
  }),
});

const drops = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/drops" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.string(),
    price: z.string(),
    status: z.enum(["active", "soldout", "comingsoon"]),
    paymentLink: z.string().optional(),
    seoDescription: z.string().optional(),
    ogImage: z.string().optional(),
  }),
});

const rutas = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/rutas" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    intro: z.string(),
    items: z
      .array(
        z.object({
          title: z.string(),
          slug: z.string(),
        })
      )
      .optional(),
    seoDescription: z.string().optional(),
    ogImage: z.string().optional(),
  }),
});

export const collections = { articles, drops, rutas };
