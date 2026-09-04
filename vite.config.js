import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

const root = process.cwd();

const collectHtmlEntries = (directory, entries = []) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'public') continue;
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            collectHtmlEntries(fullPath, entries);
            continue;
        }
        if (entry.isFile() && entry.name === 'index.html') {
            entries.push(path.relative(root, fullPath));
        }
    }
    return entries;
};

export default defineConfig({
    server: { host: true, port: 5173 },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: false,
        rollupOptions: {
            input: collectHtmlEntries(root)
        }
    }
});
