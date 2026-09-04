# LLM به زبان آدمیزاد

وب‌سایت آموزشی فارسی برای یادگیری LLM، پرامپت‌نویسی، RAG، Agent و مهندسی Context. پروژه کاملاً استاتیک است و بدون backend اجرا می‌شود.

## فناوری‌ها

- Vite
- Tailwind CSS v4
- Alpine.js
- Fuse.js
- Markdown + frontmatter

## اجرا

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

در زمان build، README مخزن `3lf/llm-for-humans` دریافت و بر اساس معماری اطلاعات پروژه به صفحات مستقل تبدیل می‌شود. فایل‌های Markdown تولیدشده در `src/content/articles` و پرامپت‌های تولیدشده در `src/content/developer-prompts` قرار می‌گیرند و `public/search-index.json` نیز ساخته می‌شود.

## افزودن مقاله

دسته‌بندی‌ها در `scripts/build-site.mjs` تعریف شده‌اند. برای تغییر منبع یا افزودن دسته جدید، slug، عنوان و marker بخش جدید را در همان فایل اضافه کنید.

## افزودن پرامپت

قالب تولید پرامپت‌ها در `buildPrompts()` قرار دارد. هر پرامپت شامل Role، Goal، Constraints و Output Format است و از placeholderهای `[کروشه]` استفاده می‌کند.

## استقرار

خروجی `dist` روی GitHub Pages، Netlify، Vercel Static یا Cloudflare Pages قابل انتشار است. برای Netlify و Cloudflare Pages فایل `public/_headers` نیز در build خروجی قرار می‌گیرد.

## SEO و امنیت

هر صفحه title و description و canonical دارد و sitemap، robots و search index در build تولید می‌شوند. هدرهای پایه امنیتی در `_headers` مستند شده‌اند. دامنه canonical فعلاً `example.com` است و باید قبل از انتشار نهایی جایگزین شود.
