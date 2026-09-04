import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const excluded = new Set(['.git', 'node_modules', 'dist', 'public', 'scripts', 'src']);

const escapeAttribute = value => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('`', '&#96;');

const decodeHtml = value => String(value)
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&gt;', '>')
    .replaceAll('&lt;', '<')
    .replaceAll('&amp;', '&');

function repairCopyButtons(html) {
    return html.replace(/(<article\b[\s\S]*?<pre\b[\s\S]*?<code>)([\s\S]*?)(<\/code><\/pre>)[\s\S]*?<button\b[\s\S]*?<\/button>/gi, (_, beforeCode, encodedPrompt, afterCode) => {
        const prompt = decodeHtml(encodedPrompt);
        const button = `<button data-copy="${escapeAttribute(prompt)}" @click="navigator.clipboard.writeText($el.dataset.copy).then(() => $el.textContent = 'کپی شد')" class="absolute left-3 top-3 rounded-pill bg-signal-white px-4 py-2 text-xs text-obsidian" aria-label="کپی پرامپت">کپی</button>`;
        return `${beforeCode}${encodedPrompt}${afterCode}${button}`;
    });
}

async function walk(dir) {
    for (const entry of await fs.readdir(dir, {withFileTypes: true})) {
        if (excluded.has(entry.name)) continue;
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await walk(file);
            continue;
        }
        if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
        const html = await fs.readFile(file, 'utf8');
        const repaired = repairCopyButtons(html);
        if (repaired !== html) await fs.writeFile(file, repaired, 'utf8');
    }
}

await walk(root);
console.log('Generated HTML attributes sanitized.');
