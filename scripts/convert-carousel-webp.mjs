import sharp from "sharp";
import { resolve } from "node:path";

const root = resolve(process.cwd(), "public", "images", "carousel");
const quality = 75;

const jobs = Array.from({ length: 5 }, (_, index) => {
  const n = index + 1;
  const input = resolve(root, `carousel-${n}.jpg`);
  const output = resolve(root, `carousel-${n}.webp`);
  return sharp(input)
    .webp({ quality, effort: 4 })
    .toFile(output);
});

await Promise.all(jobs);
