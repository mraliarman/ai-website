import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');

const escapeAttribute = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;').replaceAll('`', '&#96;');

function repairCopyHandlers(html) {
	const prefix = '@click="navigator.clipboard.writeText("';
	const suffix = '").then(() => $el.textContent = \'کپی شد\')"';
	let cursor = 0;
	let output = '';
	while (true) {
		const start = html.indexOf(prefix, cursor);
		if (start === -1) {
			output += html.slice(cursor);
			break;
		}
		output += html.slice(cursor, start);
		const promptStart = start + prefix.length;
		const end = html.indexOf(suffix, promptStart);
		if (end === -1) {
			output += html.slice(start);
			break;
		}
		const prompt = html.slice(promptStart, end);
		output += `@click="navigator.clipboard.writeText(&quot;${escapeAttribute(prompt)}&quot;).then(() => $el.textContent = 'کپی شد')"`;
		cursor = end + suffix.length;
	}
	return output;
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
