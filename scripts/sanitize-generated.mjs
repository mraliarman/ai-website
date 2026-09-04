import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');

const escapeAttribute = value => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const fixCopyHandlers = html => html.replace(/@click="navigator\.clipboard\.writeText\(([\s\S]*?)\)\.then\(\(\) => \$el\.textContent = 'کپی شد'\)"/g, (_, prompt) => {
    const safePrompt = escapeAttribute(prompt);
    return `@click="navigator.clipboard.writeText(&quot;${safePrompt}&quot;).then(() => $el.textContent = 'کپی شد')"`;
});

async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'source') files.push(...await walk(fullPath));
        else if (entry.isFile() && entry.name.endsWith('.html')) files.push(fullPath);
    }
    return files;
}

const files = await walk(publicDir);
for (const file of files) {
    const original = await fs.readFile(file, 'utf8');
    const fixed = fixCopyHandlers(original);
    if (fixed !== original) await fs.writeFile(file, fixed, 'utf8');
}
console.log(`Sanitized ${files.length} generated HTML file(s).`);
