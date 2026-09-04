import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const videoUrl = 'https://images.refero.design/styles/refero.design/video/81283453-1408-4ae1-9955-a4a6bba7cbb0.mp4';

const escapeAttribute = value => String(value)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

const fixCopyHandlers = html => html.replace(/@click="navigator\.clipboard\.writeText\(([\s\S]*?)\)\.then\(\(\) => \$el\.textContent = 'کپی شد'\)"/g, (_, prompt) => {
    const safePrompt = escapeAttribute(prompt);
    return `@click="navigator.clipboard.writeText(&quot;${safePrompt}&quot;).then(() => $el.textContent = 'کپی شد')"`;
});

const hero = `<section class="home-hero" aria-labelledby="home-hero-title">
  <div class="home-hero__media" aria-hidden="true">
    <video class="home-hero__video" autoplay muted loop playsinline preload="metadata">
      <source src="${videoUrl}" type="video/mp4">
    </video>
  </div>
  <div class="home-hero__veil" aria-hidden="true"></div>
  <div class="site-shell home-hero__grid">
    <div class="home-hero__copy">
      <span class="home-eyebrow"><span class="home-eyebrow__dot"></span> راهنمای فارسی LLM</span>
      <h1 id="home-hero-title">هوش مصنوعی را ساده، دقیق و کاربردی یاد بگیر.</h1>
      <p>از مبانی LLM و پرامپت‌نویسی تا RAG، Agent، انتخاب مدل و اجرای محلی؛ یک مسیر منظم و کاربردی برای یادگیری و ساختن با مدل‌های زبانی.</p>
      <div class="home-hero__actions">
        <a href="/fundamentals/" class="home-button home-button--primary">شروع یادگیری</a>
        <a href="/developer-prompts/" class="home-button home-button--ghost">پرامپت‌های توسعه‌دهنده</a>
      </div>
    </div>
    <div class="home-visual" aria-hidden="true">
      <div class="home-visual__frame">
        <div class="home-visual__grid"></div>
        <div class="home-visual__hud">
          <div><strong>LLM / HUMAN</strong><span>LEARNING SYSTEM</span></div>
          <div class="home-visual__signal"><i></i>LIVE</div>
        </div>
        <div class="home-visual__coordinates">
          <span>01 / FUNDAMENTALS</span><span>02 / PROMPTING</span><span>03 / CONTEXT</span><span>04 / AGENTS</span>
        </div>
        <div class="home-visual__crosshair">＋</div>
      </div>
    </div>
  </div>
</section>`;

const about = `<section class="site-shell py-20 sm:py-28" aria-labelledby="about-title">
  <div class="about-project">
    <span class="home-eyebrow"><span class="home-eyebrow__dot"></span> درباره پروژه</span>
    <h1 id="about-title">LLM به زبان آدمیزاد</h1>
    <p>این پروژه یک راهنمای فارسی برای یادگیری مدل‌های زبانی بزرگ و استفاده‌ی کاربردی از آن‌هاست؛ از مفاهیم پایه و پرامپت‌نویسی تا RAG، ابزارها و ایجنت‌ها.</p>
    <p>هدف پروژه این است که مسیر یادگیری LLM برای فارسی‌زبان‌ها ساده، منظم و قابل استفاده باشد؛ بدون اینکه برای شروع مجبور باشید بین منابع پراکنده جستجو کنید.</p>
    <div class="about-project__actions">
      <a class="home-button home-button--primary" href="https://github.com/mraliarman/ai-website" target="_blank" rel="noopener noreferrer">مشاهده پروژه در GitHub</a>
      <a class="home-button home-button--ghost" href="https://github.com/mraliarman/ai-website" target="_blank" rel="noopener noreferrer">⭐ Star در GitHub</a>
    </div>
    <div class="about-project__source">
      <span>محتوای آموزشی این سایت بر پایه پروژه متن‌باز</span>
      <a href="https://github.com/3lf/llm-for-humans" target="_blank" rel="noopener noreferrer">LLM for Humans</a>
      <span>است و با حفظ ساختار آموزشی آن، برای مخاطب فارسی‌زبان ارائه شده است.</span>
    </div>
  </div>
</section>`;

async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'source' && entry.name !== 'dist') files.push(...await walk(fullPath));
        else if (entry.isFile() && entry.name.endsWith('.html')) files.push(fullPath);
    }
    return files;
}

const files = await walk(publicDir);
for (const file of files) {
    const relative = path.relative(publicDir, file).replaceAll(path.sep, '/');
    const original = await fs.readFile(file, 'utf8');
    let html = fixCopyHandlers(original);
    if (relative === 'index.html') html = html.replace(/<section class="site-shell pb-24 pt-20 sm:pb-32 sm:pt-28">[\s\S]*?<\/section>/, hero);
    if (relative === 'about/index.html') html = html.replace(/<main>[\s\S]*?<\/main>/, `<main>${about}</main>`);
    if (html !== original) await fs.writeFile(file, html, 'utf8');
}
console.log(`Sanitized ${files.length} generated HTML file(s).`);
