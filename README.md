# LLM به زبان آدمیزاد

وب‌سایت آموزشی فارسی برای یادگیری مدل‌های زبانی بزرگ (LLM)، پرامپت‌نویسی، RAG، Agent، مهندسی Context، ارزیابی، امنیت و انتخاب مدل.

این پروژه یک **ارائه‌دهنده و بازطراحی استاتیک فارسی** برای محتوای متن‌باز پروژه [`3lf/llm-for-humans`](https://github.com/3lf/llm-for-humans) است. منبع اصلی به‌صورت Git submodule در پروژه نگه‌داری می‌شود تا متن و تصاویر آن قابل همگام‌سازی و بازتولید باشند.

---

## فهرست مطالب

- [هدف پروژه](#هدف-پروژه)
- [ویژگی‌ها](#ویژگیها)
- [منبع محتوا](#منبع-محتوا)
- [معماری پروژه](#معماری-پروژه)
- [فناوری‌ها](#فناوریها)
- [راه‌اندازی](#راهاندازی)
- [به‌روزرسانی منبع اصلی](#بهروزرسانی-منبع-اصلی)
- [فرآیند Build](#فرآیند-build)
- [ساختار فایل‌ها](#ساختار-فایلها)
- [مدیریت محتوا](#مدیریت-محتوا)
- [جستجو](#جستجو)
- [طراحی و UX](#طراحی-و-ux)
- [Responsive](#responsive)
- [SEO و امنیت](#seo-و-امنیت)
- [استقرار](#استقرار)
- [رفع اشکال](#رفع-اشکال)
- [مشارکت](#مشارکت)
- [اعتبار و مجوز](#اعتبار-و-مجوز)

---

## هدف پروژه

هدف این پروژه تبدیل یک README بسیار بزرگ و فنی به یک تجربه مطالعه فارسی، منظم و قابل استفاده در موبایل و دسکتاپ است.

اصل معماری این است که **محتوای آموزشی از پروژه منبع می‌آید، اما لایه ارائه مستقل است**. بنابراین طراحی رابط، ساختار صفحات، جستجو، فهرست مطالب، Responsive، SEO و ابزارهای تعاملی در این مخزن کنترل می‌شوند.

---

## ویژگی‌ها

- رابط کاربری کاملاً فارسی و RTL
- طراحی Dark و مینیمال بر پایه Design System پروژه
- ۱۷ بخش آموزشی مستقل
- فهرست مطالب فارسی در ابتدای هر مقاله
- لینک‌های Anchor پایدار مانند `#s-28`
- نمایش تصاویر اصلی پروژه منبع به‌صورت local
- منوی کامل موبایل
- جستجوی سمت کلاینت با Fuse.js
- ۷۰ پرامپت آماده برای توسعه‌دهندگان
- تولید صفحات HTML در زمان Build
- Tailwind CSS v4 بدون CDN
- Alpine.js برای تعاملات سبک
- Vite برای توسعه و Build
- بدون Backend، دیتابیس یا API اختصاصی
- آماده برای GitHub Pages، Netlify، Vercel Static و Cloudflare Pages
- همگام‌سازی منبع اصلی با یک دستور

---

## منبع محتوا

منبع اصلی پروژه:

**https://github.com/3lf/llm-for-humans**

این مخزن به‌عنوان Git submodule در مسیر زیر قرار دارد:

```text
public/source/llm-for-humans/
```

بنابراین README و پوشه `images` پروژه اصلی مستقیماً در ساختار پروژه قابل دسترسی هستند و هنگام Build، تصاویر با مسیرهای محلی سرو می‌شوند.

این روش از وابستگی به URL تصاویر GitHub در زمان اجرای سایت جلوگیری می‌کند.

---

## معماری پروژه

فرآیند کلی به این شکل است:

```text
3lf/llm-for-humans
        │
        │ Git Submodule
        ▼
public/source/llm-for-humans
        │
        ├── README.md
        └── images/
                │
                ▼
scripts/build-site.mjs
        │
        ├── استخراج بخش‌ها
        ├── تبدیل Markdown به HTML
        ├── ساخت TOC و Anchorها
        ├── ساخت Search Index
        ├── ساخت Developer Prompts
        └── ساخت صفحات مستقل
                │
                ▼
scripts/build-tailwind.mjs
        │
        ▼
public/assets/main.css
        │
        ▼
Vite Build
        │
        ▼
dist/
```

### چرا Build-time generation؟

چون سایت کاملاً استاتیک است. هیچ درخواست API یا پردازش سمت سرور برای نمایش مقاله لازم نیست. تمام محتوای موردنیاز قبل از انتشار تولید می‌شود.

---

## فناوری‌ها

| فناوری | کاربرد |
|---|---|
| Vite | Dev Server و Build |
| Tailwind CSS v4 | سیستم طراحی و CSS |
| Alpine.js | تعاملات سبک و منوی موبایل |
| Fuse.js | جستجوی سمت کلاینت |
| Marked | تبدیل Markdown به HTML |
| gray-matter | مدیریت frontmatter محتوا |
| Git Submodule | اتصال به منبع اصلی |
| GitHub Actions | Build خودکار |

---

## راه‌اندازی

### پیش‌نیازها

- Node.js 20 یا جدیدتر
- npm
- Git

### Clone پیشنهادی

برای دریافت هم‌زمان پروژه و منبع اصلی:

```bash
git clone --recurse-submodules https://github.com/mraliarman/ai-website.git
cd ai-website
npm install
```

اگر پروژه را قبلاً بدون submodule clone کرده‌اید:

```bash
git submodule update --init --recursive
npm install
```

### اجرای محیط توسعه

```bash
npm run dev
```

سپس Vite آدرس محیط توسعه را نمایش می‌دهد؛ به‌صورت پیش‌فرض:

```text
http://localhost:5173/
```

---

## به‌روزرسانی منبع اصلی

این پروژه برای همین سناریو طراحی شده است: اگر `3lf/llm-for-humans` تغییر کند، لازم نیست README یا تصاویر را دستی کپی کنید.

فقط اجرا کنید:

```bash
npm run update-source
```

این دستور:

1. تنظیمات submodule را همگام می‌کند.
2. آخرین commit شاخه اصلی منبع را دریافت می‌کند.
3. pointer مربوط به submodule را در پروژه ثبت می‌کند.
4. تمام صفحات، فهرست مطالب، Search Index و CSS را دوباره Build می‌کند.

اگر منبع اصلی تغییر نکرده باشد، commit اضافی ایجاد نمی‌شود.

### روند پیشنهادی برای انتشار آپدیت

```bash
npm run update-source
git push origin main
```

به این ترتیب GitHub Actions نیز نسخه جدید سایت را Build می‌کند.

> نکته: دستور `update-source` برای commit کردن pointer جدید submodule به تنظیمات Git کاربر محلی نیاز دارد.

---

## فرآیند Build

Build کامل:

```bash
npm run build
```

ترتیب اجرا:

```text
build-site.mjs
      ↓
build-tailwind.mjs
      ↓
vite build
```

### چرا Tailwind بعد از تولید HTML اجرا می‌شود؟

چون Tailwind باید کلاس‌هایی را که در HTMLهای تولیدشده استفاده شده‌اند ببیند. بنابراین ابتدا صفحات ساخته می‌شوند و سپس Tailwind CSS نهایی و Minify می‌شود.

---

## ساختار فایل‌ها

```text
ai-website/
├── .github/
│   └── workflows/
│       └── build.yml
├── public/
│   ├── assets/
│   │   └── main.css
│   ├── source/
│   │   └── llm-for-humans/      # Git submodule
│   ├── _headers
│   ├── robots.txt
│   ├── sitemap.xml
│   └── search-index.json
├── scripts/
│   ├── build-site.mjs
│   ├── build-tailwind.mjs
│   └── sync-source.mjs
├── src/
│   ├── content/
│   │   ├── articles/
│   │   └── developer-prompts/
│   ├── data/
│   ├── scripts/
│   │   └── main.js
│   └── styles/
│       └── main.css
├── about/
├── developer-prompts/
├── fundamentals/
├── advanced-techniques/
├── known-issues/
├── ...
├── .gitmodules
├── DESIGN.md
├── CONTRIBUTING.md
├── help.md
├── package.json
└── vite.config.js
```

---

## مدیریت محتوا

### مقالات

مقالات به‌صورت Markdown در این مسیر تولید می‌شوند:

```text
src/content/articles/
```

اما منبع اصلی آن‌ها `public/source/llm-for-humans/README.md` است. فایل‌های تولیدشده را نباید به‌عنوان منبع اصلی ویرایش کرد، چون در Build بعدی دوباره تولید می‌شوند.

### دسته‌بندی‌ها

دسته‌ها در:

```text
scripts/build-site.mjs
```

تعریف شده‌اند و هر دسته یک URL مستقل دارد.

### پرامپت‌های توسعه‌دهنده

پرامپت‌ها در Build ساخته می‌شوند و خروجی آن‌ها در:

```text
src/content/developer-prompts/prompts.json
```

قرار می‌گیرد.

---

## جستجو

جستجو کاملاً سمت کلاینت انجام می‌شود.

در Build فایل زیر ساخته می‌شود:

```text
public/search-index.json
```

سپس Fuse.js روی عنوان، خلاصه، تگ و محتوای صفحات جستجو می‌کند.

هیچ سرور یا API برای Search لازم نیست.

---

## فهرست مطالب و Anchorها

هر صفحه آموزشی، Headingهای سطح ۲ و ۳ را به Anchorهای پایدار تبدیل می‌کند:

```text
#s-0
#s-1
#s-2
...
#s-28
```

فهرست مطالب قبل از متن اصلی مقاله قرار دارد و با کلیک روی هر مورد، مرورگر دقیقاً به همان Heading منتقل می‌شود.

برای جلوگیری از قرار گرفتن Heading زیر Header، برای Headingها `scroll-margin-top` تعریف شده است.

---

## طراحی و UX

Design System پروژه در `DESIGN.md` تعریف شده است.

اصول اصلی:

- پس‌زمینه Obsidian / Carbon
- متن Chalk و Smoke
- Borderهای Graphite و Iron
- بدون Drop Shadow
- Radius محدود و کنترل‌شده
- تایپوگرافی فارسی با Vazirmatn
- فونت Mono برای Metadata و Code
- Gridهای ساده و خطی
- فضای سفید کنترل‌شده
- سلسله‌مراتب واضح برای Headingها
- تمرکز بر خوانایی محتوای طولانی

فایل CSS اصلی:

```text
src/styles/main.css
```

توکن‌های رنگ، فونت، spacing و radius در Tailwind v4 با `@theme` تعریف شده‌اند.

---

## Responsive

سایت Mobile-first طراحی شده است.

در موبایل:

- منوی اصلی به منوی بازشونده تبدیل می‌شود.
- Gridهای چندستونه به یک ستون تبدیل می‌شوند.
- Headingها با `clamp()` مقیاس می‌گیرند.
- جدول‌های عریض داخل خود جدول اسکرول می‌شوند و باعث اسکرول افقی کل صفحه نمی‌شوند.
- تصاویر حداکثر عرض container را می‌گیرند.
- Code blockها فقط داخل خود بلوک امکان اسکرول دارند.
- متن فارسی با `overflow-wrap` و `word-break` از بیرون زدن محتوا جلوگیری می‌کند.

---

## SEO و امنیت

در Build برای صفحات موارد زیر تولید یا تنظیم می‌شوند:

- `title`
- `meta description`
- `canonical`
- Open Graph metadata
- Twitter Card metadata
- `sitemap.xml`
- `robots.txt`
- Content Security Policy
- `X-Content-Type-Options`
- `Referrer-Policy`

دامنه canonical در حال حاضر به‌صورت placeholder روی `example.com` قرار دارد و قبل از انتشار نهایی باید با دامنه واقعی جایگزین شود.

---

## GitHub Actions

Workflow اصلی در:

```text
.github/workflows/build.yml
```

قرار دارد.

Workflow:

1. repository را checkout می‌کند.
2. submodule منبع را نیز دریافت می‌کند.
3. Node.js را راه‌اندازی می‌کند.
4. dependencyها را نصب می‌کند.
5. `npm run build` را اجرا می‌کند.

این فرآیند باعث می‌شود تغییرات خراب در Build قبل از انتشار قابل تشخیص باشند.

---

## استقرار

خروجی نهایی:

```text
dist/
```

قابل انتشار روی سرویس‌های استاتیک است، از جمله:

- GitHub Pages
- Netlify
- Vercel Static
- Cloudflare Pages
- هر وب‌سروری که فایل‌های Static را سرو کند

برای سرویس‌هایی که از `_headers` پشتیبانی می‌کنند، فایل امنیتی `public/_headers` نیز در خروجی قرار می‌گیرد.

---

## رفع اشکال

### خطای `spawn EINVAL` در Windows

Build Tailwind مستقیماً CLI محلی Tailwind را با Node اجرا می‌کند و به `npx` وابسته نیست. بنابراین مشکل رایج `spawn EINVAL` در Windows/Nodeهای جدید حذف شده است.

اگر dependencyها ناقص هستند:

```bash
rm -rf node_modules
npm install
npm run build
```

در PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
npm install
npm run build
```

### تصاویر نمایش داده نمی‌شوند

ابتدا submodule را بررسی کنید:

```bash
git submodule status
```

اگر خالی یا ناقص است:

```bash
git submodule update --init --recursive
npm run build
```

### منبع اصلی تغییر کرده است

از این دستور استفاده کنید:

```bash
npm run update-source
```

---

## مشارکت

قبل از تغییرات، `CONTRIBUTING.md` و `DESIGN.md` را مطالعه کنید.

اصول مهم:

- از تغییرات غیرضروری در معماری خودداری کنید.
- Design Tokenها را به‌صورت پراکنده hardcode نکنید.
- RTL را در تمام تغییرات UI در نظر بگیرید.
- روی موبایل و دسکتاپ تست کنید.
- Build نهایی باید بدون خطا اجرا شود.
- محتوای پروژه منبع را مستقیماً در فایل‌های تولیدشده ویرایش نکنید.
- برای دریافت محتوای جدید از `npm run update-source` استفاده کنید.

---

## اعتبار و مجوز

این پروژه از پروژه متن‌باز زیر استفاده می‌کند:

**3lf/llm-for-humans**

https://github.com/3lf/llm-for-humans

محتوای آموزشی و تصاویر منبع متعلق به پروژه اصلی است. این مخزن لایه ارائه فارسی، معماری صفحات، طراحی رابط، جستجو، دسته‌بندی و تجربه مطالعه را فراهم می‌کند.

پیش از استفاده یا انتشار تجاری، مجوز و شرایط استفاده از پروژه منبع را بررسی کنید.

---

## وضعیت پروژه

این پروژه یک سایت استاتیک آموزشی است و برای توسعه تدریجی طراحی شده است. معماری آن به‌گونه‌ای انتخاب شده که با تغییر منبع اصلی، نیاز به بازنویسی دستی محتوای سایت وجود نداشته باشد.

**نسخه فعلی:** `1.1.0`
