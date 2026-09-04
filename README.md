# LLM به زبان آدمیزاد

راهنمای فارسی، کاربردی و ساختاریافته برای یادگیری و استفاده از مدل‌های زبانی بزرگ (LLM).

## ⭐ حمایت از پروژه

اگر این پروژه برای شما مفید است، لطفاً وارد صفحه GitHub پروژه شوید و با زدن **Star ⭐** از ادامه توسعه آن حمایت کنید:

https://github.com/mraliarman/ai-website

## هدف پروژه

این سایت محتوای آموزشی LLM را برای فارسی‌زبان‌ها به یک مسیر منظم، قابل جست‌وجو و مناسب مطالعه تبدیل می‌کند؛ از مبانی و پرامپت‌نویسی تا RAG، انتخاب مدل، ابزارها و ایجنت‌ها.

## منبع محتوا

محتوای آموزشی بر پایه پروژه متن‌باز زیر است:

https://github.com/3lf/llm-for-humans

مخزن منبع به‌صورت Git Submodule در `public/source/llm-for-humans` نگهداری می‌شود تا تصاویر و فایل‌های اصلی در پروژه موجود باشند و به‌روزرسانی منبع ساده بماند.

## راه‌اندازی

```bash
npm install
npm run dev
```

Build تولیدی:

```bash
npm run build
```

## به‌روزرسانی منبع اصلی

برای دریافت آخرین تغییرات منبع و بازسازی سایت:

```bash
npm run update-source
```

این دستور submodule را به آخرین commit شاخه اصلی منبع می‌رساند، pointer آن را commit می‌کند و سپس سایت را build می‌کند. بعد از آن، تغییرات مخزن اصلی را push کنید:

```bash
git push origin main
```

## ساختار کلی

- `public/source/llm-for-humans/` — منبع آموزشی و تصاویر
- `scripts/build-site.mjs` — تولید صفحات از محتوای منبع
- `scripts/build-tailwind.mjs` — ساخت CSS
- `scripts/sanitize-generated.mjs` — جلوگیری از خراب شدن attributeهای HTML تولیدشده
- `scripts/seo.mjs` — تولید meta tags و JSON-LD
- `src/styles/main.css` — طراحی کلی و responsive
- `src/scripts/main.js` — Alpine.js، جستجو و منوی موبایل
- `.github/workflows/build.yml` — بررسی خودکار build

## SEO

متادیتای پایه، canonical، robots، Open Graph، Twitter Card و JSON-LD در زمان build تولید می‌شوند. مقدار `SITE_URL` را در محیط تولید برابر دامنه واقعی سایت قرار دهید تا canonical به URL کامل تبدیل شود.

## توسعه

قبل از commit تغییرات، اجرای زیر توصیه می‌شود:

```bash
npm run build
```

## مجوز و اعتبار

لطفاً شرایط مجوز و attribution پروژه اصلی را بررسی کنید و اعتبار منبع را حفظ کنید.
