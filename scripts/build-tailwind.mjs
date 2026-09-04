import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = path.join(root, 'src/styles/main.css');
const outputDir = path.join(root, 'public/assets');
const output = path.join(outputDir, 'main.css');
const tailwindCli = path.join(root, 'node_modules', '@tailwindcss', 'cli', 'dist', 'index.mjs');
await fs.mkdir(outputDir, { recursive: true });
await fs.access(tailwindCli);
await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [tailwindCli, '-i', input, '-o', output, '--minify'], {
        cwd: root,
        stdio: 'inherit',
        windowsHide: true
    });
    child.once('error', reject);
    child.once('exit', code => code === 0 ? resolve() : reject(new Error(`Tailwind CLI exited with code ${code}`)));
});
