import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const run = (args, options = {}) => new Promise((resolve, reject) => {
    const child = spawn('git', args, { cwd: root, stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit', windowsHide: true });
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', chunk => { stdout += chunk; });
    child.stderr?.on('data', chunk => { stderr += chunk; });
    child.once('error', reject);
    child.once('exit', code => code === 0 ? resolve({ stdout, stderr }) : reject(new Error(`git ${args.join(' ')} exited with code ${code}\n${stderr}`)));
});
await run(['submodule', 'sync', '--recursive']);
await run(['submodule', 'update', '--init', '--remote', '--merge', '--', 'public/source/llm-for-humans']);
const status = await run(['status', '--porcelain', '--', 'public/source/llm-for-humans'], { capture: true });
if (status.stdout.trim()) {
    await run(['add', 'public/source/llm-for-humans']);
    await run(['commit', '-m', 'chore: sync source repository']);
    console.log('Source repository updated and the submodule pointer was committed.');
} else {
    console.log('Source repository is already up to date.');
}
