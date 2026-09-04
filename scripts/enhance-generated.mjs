import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const githubUrl = 'https://github.com/mraliarman/ai-website';
const sourceGithubUrl = 'https://github.com/3lf/llm-for-humans';
const homeHero = `<section class="home-hero"><div class="home-hero__media" aria-hidden="true"></div><div class="home-hero__veil"></div><div class="home-hero__grid"></div><div class="home-hero__frame"></div><div class="home-hero__inner"><div class="home-hero__copy"><span class="home-hero__eyebrow">LLM / راهنمای فارسی</span><h1 class="home-hero__title">هوش مصنوعی را ساده، دقیق و کاربردی یاد بگیر.</h1><p class="home-hero__lead">از مبانی LLM و پرامپت‌نویسی تا RAG، Agent و انتخاب مدل؛ یک مسیر فارسی، منظم و قابل استفاده برای یادگیری واقعی هوش مصنوعی.</p><div class="home-hero__actions"><a href="/fundamentals/">شروع یادگیری</a><a href="/developer-prompts/">پرامپت‌های توسعه‌دهنده</a></div><div class="home-hero__meta"><span>راهنمای فارسی</span><span>محتوای ساختاریافته</span><span>متن‌باز</span></div></div></div></section>`;
const aboutBody = `<section class="site-shell py-16 sm:py-24"><div class="about-card"><span class="font-mono text-xs text-smoke">ABOUT / OPEN SOURCE</span><h1 class="mt-6 max-w-4xl text-[40px] font-normal leading-[1.2] sm:text-[56px] md:text-[68px]">LLM به زبان آدمیزاد؛ یک راهنمای فارسی برای یادگیری بهتر.</h1><p class="mt-7 max-w-3xl text-base text-smoke sm:text-lg">این پروژه متعلق به توسعه‌دهنده پروژه <a href="${sourceGithubUrl}" target="_blank" rel="noopener noreferrer" class="text-chalk underline underline-offset-4">LLM for Humans</a> است. من، فرداد آرمان، با استفاده از آن پروژه و محتوای ارزشمندش این وب‌سایت فارسی را ایجاد کردم تا دسترسی به مطالب برای فارسی‌زبان‌ها ساده‌تر و تجربه مطالعه منظم‌تر و کاربردی‌تر باشد.</p><p class="mt-5 max-w-3xl text-base text-smoke sm:text-lg">اگر این نسخه فارسی برایت مفید است، می‌توانی هم از پروژه اصلی حمایت کنی و هم از نسخه‌ای که برای فارسی‌زبان‌ها ساخته شده حمایت کنی.</p><div class="mt-8 flex flex-wrap gap-3"><a href="${sourceGithubUrl}" target="_blank" rel="noopener noreferrer" class="rounded-card border border-iron px-6 py-3 text-sm text-chalk">پروژه اصلی در GitHub</a><a href="${githubUrl}" target="_blank" rel="noopener noreferrer" class="rounded-card bg-chalk px-6 py-3 text-sm text-obsidian">پروژه فرداد آرمان</a><a href="${githubUrl}" target="_blank" rel="noopener noreferrer" class="rounded-card border border-signal-indigo px-6 py-3 text-sm text-chalk">⭐ با یک Star حمایت کن</a></div></div><div class="mt-8 grid gap-px bg-graphite md:grid-cols-3"><div class="bg-obsidian p-6 sm:p-8"><span class="font-mono text-xs text-smoke">منبع</span><h2 class="mt-3 text-xl font-normal">LLM for Humans</h2><p class="mt-3 text-sm text-smoke">مبنای این وب‌سایت پروژه متن‌باز LLM for Humans است که توسط توسعه‌دهنده اصلی آن ایجاد شده است.</p></div><div class="bg-obsidian p-6 sm:p-8"><span class="font-mono text-xs text-smoke">توسعه فارسی</span><h2 class="mt-3 text-xl font-normal">فرداد آرمان</h2><p class="mt-3 text-sm text-smoke">این وب‌سایت با هدف ارائه تجربه‌ای فارسی، منظم و قابل استفاده برای یادگیری ساخته شده است.</p></div><div class="bg-obsidian p-6 sm:p-8"><span class="font-mono text-xs text-smoke">حمایت</span><h2 class="mt-3 text-xl font-normal">پروژه را Star کن</h2><p class="mt-3 text-sm text-smoke">اگر این پروژه برایت مفید است، با یک Star در GitHub به ادامه توسعه آن کمک کن.</p></div></div></section>`;
async function replaceHome() {
    const file = path.join(root, 'index.html');
    let html = await fs.readFile(file, 'utf8');
    html = html.replace(/<section class="site-shell pb-24 pt-20 sm:pb-32 sm:pt-28">[\s\S]*?<\/section>/, homeHero);
    await fs.writeFile(file, html, 'utf8');
}
async function replaceAbout() {
    const file = path.join(root, 'about', 'index.html');
    let html = await fs.readFile(file, 'utf8');
    html = html.replace(/<section class="site-shell py-16 sm:py-24">[\s\S]*?<\/section><\/main>/, `${aboutBody}</main>`);
    await fs.writeFile(file, html, 'utf8');
}
async function fixDeveloperPromptAnchors() {
    const pageFile = path.join(root, 'developer-prompts', 'index.html');
    const indexFile = path.join(root, 'public', 'search-index.json');
    let html = await fs.readFile(pageFile, 'utf8');
    const index = JSON.parse(await fs.readFile(indexFile, 'utf8'));
    const promptItems = index.filter(item => item.url?.startsWith('/developer-prompts/'));
    let articleIndex = 0;
    html = html.replace(/<article\b([^>]*)>/g, (match, attributes) => {
        const item = promptItems[articleIndex++];
        if (!item) return match;
        const withoutId = attributes.replace(/\s+id=(?:"[^"]*"|'[^']*')/i, '');
        return `<article id="${item.id}"${withoutId}>`;
    });
    await fs.writeFile(pageFile, html, 'utf8');
    const updatedIndex = index.map(item => item.url?.startsWith('/developer-prompts/') ? {...item, url: `/developer-prompts/#${item.id}`} : item);
    await fs.writeFile(indexFile, `${JSON.stringify(updatedIndex)}\n`, 'utf8');
}
await replaceHome();
await replaceAbout();
await fixDeveloperPromptAnchors();
console.log('Generated pages enhanced.');
