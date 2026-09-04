import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const escapeAttribute = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;').replaceAll('`', '&#96;');
function repairCopyHandlers(html) {
	const pattern = /@click="navigator\.clipboard\.writeText\("((?:\\.|[^"\\])*)"\)\.then\(\(\) => \$el\.textContent = 'کپی شد'\)"/gs;
	return html.replace(pattern, (_, prompt) => `data-copy="${escapeAttribute(prompt)}" @click="navigator.clipboard.writeText($el.dataset.copy).then(() => $el.textContent = 'کپی شد')"`);
}
async function walk(dir) {
	for (const entry of await fs.readdir(dir, {withFileTypes: true})) {
		if (entry.name === 'source' || entry.name === 'dist') continue;
		const file = path.join(dir, entry.name);
		if (entry.isDirectory()) await walk(file);
		else if (entry.isFile() && entry.name.endsWith('.html')) {
			const html = await fs.readFile(file, 'utf8');
			const repaired = repairCopyHandlers(html);
			if (repaired !== html) await fs.writeFile(file, repaired);
		}
	}
}
await walk(publicDir);
console.log('Generated HTML attributes sanitized.');
