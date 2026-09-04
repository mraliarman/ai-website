import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = path.join(root, 'src', 'styles', 'main.css');
const output = path.join(root, 'public', 'assets', 'css', 'style.css');
const cli = path.join(root, 'node_modules', '@tailwindcss', 'cli', 'dist', 'index.mjs');
await fs.mkdir(path.dirname(output), { recursive: true });
await new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [cli, '-i', input, '-o', output, '--minify'], { cwd: root, stdio: 'inherit', windowsHide: true });
  child.once('error', reject);
  child.once('exit', code => code === 0 ? resolve() : reject(new Error(`Tailwind exited with code ${code}`)));
});
console.log(`Tailwind CSS built: ${path.relative(root, output)}`);
