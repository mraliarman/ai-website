import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const githubUrl = 'https://github.com/mraliarman/ai-website';
const homeHero = `<section class="home-hero"><div class="home-hero__media" aria-hidden="true"></div><div class="home-hero__veil"></div><div class="home-hero__grid"></div><div class="home-hero__frame"></div><div class="home-hero__inner"><div class="home-hero__copy"><span class="home-hero__eyebrow">LLM / راهنمای فارسی</span><h1 class="home-hero__title">هوش مصنوعی را ساده، دقیق و کاربردی یاد بگیر.</h1><p class="home-hero__lead">از مبانی LLM و پرامپت‌نویسی تا RAG، Agent و انتخاب مدل؛ یک مسیر فارسی، منظم و قابل استفاده برای یادگیری واقعی هوش مصنوعی.</p><div class="home-hero__actions"><a href="/fundamentals/">شروع یادگیری</a><a href="/developer-prompts/">پرامپت‌های توسعه‌دهنده</a></div><div class="home-hero__meta"><span>راهنمای فارسی</span><span>محتوای ساختاریافته</span><span>متن‌باز</span></div></div></div></section>`;
const aboutBody = `<section class="site-shell py-16 sm:py-24"><div class="about-card"><span class="font-mono text-xs text-smoke">ABOUT / OPEN SOURCE</span><h1 class="mt-6 max-w-4xl text-[40px] font-normal leading-[1.2] sm:text-[56px] md:text-[68px]">یادگیری LLM به زبان ساده و فارسی.</h1><p class="mt-7 max-w-3xl text-base text-smoke sm:text-lg">این پروژه برای این ساخته شده که یادگیری هوش مصنوعی و مدل‌های زبانی برای فارسی‌زبان‌ها ساده‌تر، منظم‌تر و کاربردی‌تر باشد. مطالب از مباحث پایه شروع می‌شوند و قدم‌به‌قدم به موضوعات حرفه‌ای‌تر می‌رسند.</p><div class="mt-8 flex flex-wrap gap-3"><a href="${githubUrl}" target="_blank" rel="noopener noreferrer" class="rounded-card bg-chalk px-6 py-3 text-sm text-obsidian">پروژه در GitHub</a><a href="${githubUrl}" target="_blank" rel="noopener noreferrer" class="rounded-card border border-signal-indigo px-6 py-3 text-sm text-chalk">⭐ با یک Star حمایت کن</a><a href="/" class="rounded-card border border-signal-white px-6 py-3 text-sm text-chalk">شروع مطالعه</a></div></div><div class="mt-8 grid gap-px bg-graphite md:grid-cols-3"><div class="bg-obsidian p-6 sm:p-8"><span class="font-mono text-xs text-smoke">هدف</span><h2 class="mt-3 text-xl font-normal">یادگیری بدون پیچیده‌گویی</h2><p class="mt-3 text-sm text-smoke">مفاهیم مهم هوش مصنوعی به زبان فارسی و با تمرکز روی استفاده واقعی توضیح داده می‌شوند.</p></div><div class="bg-obsidian p-6 sm:p-8"><span class="font-mono text-xs text-smoke">محتوا</span><h2 class="mt-3 text-xl font-normal">یک مسیر منظم</h2><p class="mt-3 text-sm text-smoke">مطالب دسته‌بندی شده‌اند تا بتوانی از نقطه شروع مناسب خودت وارد مسیر یادگیری شوی.</p></div><div class="bg-obsidian p-6 sm:p-8"><span class="font-mono text-xs text-smoke">حمایت</span><h2 class="mt-3 text-xl font-normal">پروژه را Star کن</h2><p class="mt-3 text-sm text-smoke">اگر این راهنما برایت مفید است، با یک Star در GitHub به ادامه توسعه پروژه کمک کن.</p></div></div><div class="mt-16 max-w-3xl border-t border-graphite pt-10"><span class="font-mono text-xs text-smoke">SOURCE</span><h2 class="mt-4 text-2xl font-normal">منبع آموزشی</h2><p class="mt-4 text-base text-ash">این سایت بر پایه محتوای پروژه متن‌باز LLM به زبان آدمیزاد ساخته شده و برای فارسی‌زبان‌ها تجربه مطالعه‌ای منظم‌تر ارائه می‌دهد.</p></div></section>`;
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
await replaceHome();
await replaceAbout();
console.log('Generated pages enhanced.');
