import { defineConfig } from 'tsup';
import { readFileSync, writeFileSync } from 'fs';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
  async onSuccess() {
    // tsup/esbuild emits `/* src/.../Foo.module.css */` section comments and
    // leaves `Foo_default = {}` in JS. Without scoping, same class names from
    // different modules collide (e.g. Button and Pagination both have `.button`).
    // Fix: prefix every class with its module name → `.Button__button`,
    // `.Pagination__button`, etc. — in both the CSS and the JS class map.

    const rawCss = readFileSync('dist/index.css', 'utf8');

    // Step 1: build { localName → "Module__localName" } per module by scanning
    // each module's CSS section (delimited by `/* src/...module.css */` comments)
    const moduleClassMap: Record<string, Record<string, string>> = {};
    let currentMod: string | null = null;
    for (const line of rawCss.split('\n')) {
      const cm = line.match(/^\/\* src\/(?:.+?\/)?([\w-]+)\.module\.css \*\//);
      if (cm) {
        currentMod = cm[1];
        if (!moduleClassMap[currentMod]) moduleClassMap[currentMod] = {};
      } else if (currentMod) {
        for (const m of line.matchAll(/\.([a-zA-Z][\w-]*)(?=[\s{:,]|$)/g)) {
          const local = m[1];
          if (!moduleClassMap[currentMod][local])
            moduleClassMap[currentMod][local] = `${currentMod}__${local}`;
        }
      }
    }

    // Step 2: rename class selectors in each module's CSS section independently.
    // Split on the section comment so we only rename within the owning section —
    // this prevents Pagination's `.button` rename from clobbering Button's.
    const COMMENT_RE = /(\/\* src\/[^\n]+\.module\.css \*\/)/;
    const parts = rawCss.split(COMMENT_RE);
    // parts: [pre, comment0, body0, comment1, body1, ...]
    let activeMod: string | null = null;
    const renamedParts = parts.map(part => {
      const cm = part.match(/^\/\* src\/(?:.+?\/)?([\w-]+)\.module\.css \*\/$/);
      if (cm) { activeMod = cm[1]; return part; }
      if (activeMod && moduleClassMap[activeMod]) {
        const map = moduleClassMap[activeMod];
        activeMod = null;
        // Replace every .className that's in this module's map
        return part.replace(/\.([a-zA-Z][\w-]*)/g, (match, cls) =>
          map[cls] ? `.${map[cls]}` : match
        );
      }
      activeMod = null;
      return part;
    });
    const patchedCss = renamedParts.join('');

    // Step 3: patch dist/index.js — replace empty `Foo_default = {}` with the
    // scoped class map so components apply the prefixed class names
    let jsContent = readFileSync('dist/index.js', 'utf8');
    let patched = 0;
    for (const [name, map] of Object.entries(moduleClassMap)) {
      const varName = `${name}_default`;
      const before = `${varName} = {}`;
      const after = `${varName} = ${JSON.stringify(map)}`;
      if (jsContent.includes(before)) { jsContent = jsContent.replace(before, after); patched++; }
    }
    writeFileSync('dist/index.js', jsContent);
    console.log(`  [css-modules] patched ${patched}/${Object.keys(moduleClassMap).length} module(s)`);

    // Step 4: prepend design tokens
    const tokens = readFileSync('src/tokens/tokens.css', 'utf8');
    writeFileSync('dist/index.css', tokens + '\n' + patchedCss);
  },
});
