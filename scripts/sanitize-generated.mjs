import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');

const escapeAttribute = value => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const fixCopyHandlers = html => {
    const marker = '@click="navigator.clipboard.writeText("';
    const suffix = '").then(() => $el.textContent = \'کپی شد\')"';
    let output = html;
    let cursor = 0;

    while (true) {
        const start = output.indexOf(marker, cursor);
        if (start < 0) break;
        const promptStart = start + marker.length;
        const end = output.indexOf(suffix, promptStart);
        if (end < 0) break;
        const prompt = output.slice(promptStart, end);
        const safePrompt = escapeAttribute(prompt);
        const replacement = `@click="navigator.clipboard.writeText(&quot;${safePrompt}&quot;).then(() => $el.textContent = 'کپی شد')"`;
        output = output.slice(0, start) + replacement + output.slice(end + suffix.length);
        cursor = start + replacement.length;
    }
    return output;
};

const hero = `<section class="home-hero">
    <div class="site-shell home-hero__grid">
        <div class="home-hero__copy">
            <span class="home-eyebrow"><span class="home-eyebrow__dot"></span> راهنمای فارسی LLM</span>
            <h1>هوش مصنوعی را ساده، دقیق و کاربردی یاد بگیر.</h1>
            <p>از مبانی LLM و پرامپت‌نویسی تا RAG، Agent، انتخاب مدل و اجرای محلی؛ یک مسیر منظم و کاربردی برای یادگیری و ساختن با مدل‌های زبانی.</p>
            <div class="home-hero__actions">
                <a href="/fundamentals/" class="home-button home-button--primary">شروع یادگیری</a>
                <a href="/developer-prompts/" class="home-button home-button--ghost">پرامپت‌های توسعه‌دهنده</a>
            </div>
        </div>
        <div class="home-dashboard" aria-label="پیش‌نمایش ساختار یادگیری LLM">
            <div class="home-dashboard__bar">
                <div class="home-dashboard__dots"><i></i><i></i><i></i></div>
                <span>LLM / LEARNING MAP</span>
                <span class="home-dashboard__status"><b></b> LIVE</span>
            </div>
            <div class="home-dashboard__body">
                <div class="home-dashboard__sidebar"><span class="is-active">01</span><span>02</span><span>03</span><span>04</span><span>05</span></div>
                <div class="home-dashboard__main">
                    <div class="home-dashboard__title"><span>LEARNING PATH</span><strong>17 MODULES</strong></div>
                    <div class="home-dashboard__chart"><i style="--h:28%"></i><i style="--h:44%"></i><i style="--h:38%"></i><i style="--h:62%"></i><i style="--h:54%"></i><i style="--h:78%"></i><i style="--h:68%"></i><i style="--h:92%"></i><i style="--h:84%"></i><i style="--h:100%"></i></div>
                    <div class="home-dashboard__rows"><div><span>01</span><b>مبانی LLM</b><em>COMPLETE</em></div><div><span>02</span><b>پرامپت‌نویسی</b><em>ACTIVE</em></div><div><span>03</span><b>RAG و Context</b><em>NEXT</em></div></div>
                </div>
            </div>
        </div>
    </div>
</section>`;

async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) files.push(...await walk(fullPath));
        else if (entry.isFile() && entry.name.endsWith('.html')) files.push(fullPath);
    }
    return files;
}

const files = await walk(publicDir);
for (const file of files) {
    const original = await fs.readFile(file, 'utf8');
    let html = fixCopyHandlers(original);
    const relative = path.relative(publicDir, file).replaceAll(path.sep, '/');
    if (relative === 'index.html') html = html.replace(/<section class="site-shell pb-24 pt-20 sm:pb-32 sm:pt-28">[\s\S]*?<\/section>/, hero);
    if (html !== original) await fs.writeFile(file, html, 'utf8');
}
console.log(`Sanitized ${files.length} generated HTML file(s).`);
