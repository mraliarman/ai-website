import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const run = args => new Promise((resolve, reject) => {
    const child = spawn('git', args, { cwd: root, stdio: 'inherit', windowsHide: true });
    child.once('error', reject);
    child.once('exit', code => code === 0 ? resolve() : reject(new Error(`git ${args.join(' ')} exited with code ${code}`)));
});
await run(['submodule', 'sync', '--recursive']);
await run(['submodule', 'update', '--init', '--remote', '--merge', '--', 'public/source/llm-for-humans']);
await run(['submodule', 'status', '--', 'public/source/llm-for-humans']);
await run(['add', 'public/source/llm-for-humans']);
await run(['commit', '-m', 'chore: sync source repository']);
await run(['submodule', 'status', '--', 'public/source/llm-for-humans']);
console.log('Source repository synchronized and the submodule pointer was committed.');
