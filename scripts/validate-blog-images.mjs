import { existsSync } from "node:fs";
import { resolve, sep } from "node:path";
import { blogPosts } from "../src/data/blogData.js";

const publicDir = resolve("public");
let errors = 0;
let checked = 0;

for (const post of blogPosts) {
  const expectedPrefix = `/images/blog/${post.slug}/`;
  const references = [
    { type: "Featured", path: post.image },
    ...[...post.content.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)]
      .map((match, index) => ({
        type: `Supporting image ${index + 1}`,
        path: match[1],
      })),
  ];

  for (const reference of references) {
    const { type, path } = reference;

    if (typeof path !== "string" || !path.startsWith(expectedPrefix)) {
      console.error(
        `ERROR: ${post.slug} — ${type} must be inside ${expectedPrefix}`
      );
      errors++;
      continue;
    }

    const filePath = resolve(publicDir, `.${path}`);

    if (
      !filePath.startsWith(publicDir + sep) ||
      !existsSync(filePath)
    ) {
      console.error(`ERROR: ${post.slug} — missing or invalid image: ${path}`);
      errors++;
      continue;
    }

    checked++;
  }
}

if (errors > 0) {
  console.error(`\nImage validation failed: ${errors} error(s).`);
  process.exit(1);
}

console.log(`Image validation passed: ${checked} images checked across ${blogPosts.length} article(s).`);
