# LLM به زبان آدمیزاد

یک وب‌سایت فارسی، استاتیک و قابل جست‌وجو برای آموزش مدل‌های زبانی بزرگ (LLM)، پرامپت‌نویسی و موضوعات مرتبط با توسعه نرم‌افزار و هوش مصنوعی.

این پروژه محتوای آموزشی پروژه متن‌باز [3lf/llm-for-humans](https://github.com/3lf/llm-for-humans) را دریافت می‌کند و آن را به یک وب‌سایت فارسی با ساختار موضوعی، فهرست مطالب، جست‌وجو، پرامپت‌های آماده، SEO و خروجی مناسب برای هاست اشتراکی تبدیل می‌کند.

## پروژه اصلی و اعتبار

منبع محتوای آموزشی این پروژه:

https://github.com/3lf/llm-for-humans

وب‌سایت حاضر توسط فرداد آرمان توسعه داده شده است:

https://github.com/mraliarman/ai-website

محتوای آموزشی متعلق به پروژه منبع است و این مخزن لایه ارائه، دسته‌بندی، طراحی رابط فارسی، جست‌وجو و تجربه مطالعه را فراهم می‌کند.

## ویژگی‌ها

- وب‌سایت کاملاً استاتیک و مناسب cPanel و هاست اشتراکی
- تولید خودکار صفحات آموزشی از محتوای منبع
- دسته‌بندی مطالب LLM و مباحث مرتبط
- فهرست مطالب و لینک مستقیم به بخش‌های هر صفحه
- جست‌وجوی سمت مرورگر با Fuse.js
- ۷۰ پرامپت آماده برای توسعه‌دهندگان
- فیلتر پرامپت‌ها بر اساس دسته‌بندی و سطح
- دکمه کپی پرامپت‌ها
- رابط کاربری RTL و فارسی
- طراحی Responsive با Tailwind CSS
- تعاملات سمت مرورگر با Alpine.js
- تولید CSS با Tailwind CSS CLI
- تولید خودکار Metadata، Open Graph، Twitter Card و JSON-LD
- تولید sitemap.xml و robots.txt
- پشتیبانی از تصاویر موجود در منبع اصلی
- اجرای کامل فرایند تولید از طریق npm scripts
- CI برای بررسی build پروژه

## تکنولوژی‌ها

- HTML5
- JavaScript / ES Modules
- Node.js
- Vite
- Tailwind CSS 4
- Alpine.js
- Fuse.js
- Marked
- Gray Matter
- Git Submodule

## ساختار پروژه

```text
ai-website/
├── .github/
│   └── workflows/
│       └── build.yml
├── public/
│   ├── source/
│   │   └── llm-for-humans/
│   └── search-index.json
├── scripts/
│   ├── build-site.mjs
│   ├── build-tailwind.mjs
│   ├── enhance-generated.mjs
│   ├── sanitize-generated.mjs
│   ├── seo.mjs
│   └── sync-source.mjs
├── src/
│   ├── content/
│   │   ├── articles/
│   │   └── developer-prompts/
│   ├── scripts/
│   │   └── main.js
│   └── styles/
│       └── main.css
├── about/
│   └── index.html
├── developer-prompts/
│   └── index.html
├── <article-slug>/
│   └── index.html
├── index.html
├── vite.config.js
└── package.json
```

## پیش‌نیازها

- Node.js نسخه LTS
- npm
- Git
- دسترسی به GitHub برای دریافت repository اصلی و submodule

## نصب

```bash
npm install
```

## منبع آموزشی

محتوای اصلی در مسیر زیر نگهداری می‌شود:

```text
public/source/llm-for-humans/
```

این مسیر به‌صورت Git Submodule به پروژه اصلی متصل است.

برای دریافت و به‌روزرسانی منبع:

```bash
npm run update-source
```

این دستور منبع را به‌روزرسانی کرده و سپس build کامل سایت را اجرا می‌کند.

## اجرای محیط توسعه

برای مشاهده سایت در محیط توسعه:

```bash
npm run dev
```

این دستور ابتدا صفحات را از منبع تولید می‌کند، تغییرات اختصاصی پروژه را اعمال می‌کند، HTML را sanitize می‌کند، SEO را تولید می‌کند، CSS را می‌سازد و در نهایت Vite Dev Server را اجرا می‌کند.

خروجی این حالت برای توسعه است و نباید مستقیماً به‌عنوان فایل‌های نهایی cPanel در نظر گرفته شود.

## تولید خروجی نهایی برای cPanel

برای ساخت نسخه قابل انتشار:

```bash
npm run generate
```

دستور `generate` تمام مراحل تولید را اجرا کرده و در پایان `vite build` را اجرا می‌کند. خروجی نهایی در مسیر زیر قرار می‌گیرد:

```text
dist/
```

ساختار صفحات در `dist` حفظ می‌شود، بنابراین مسیرهایی مانند زیر به‌صورت مستقل تولید می‌شوند:

```text
dist/
├── index.html
├── about/
│   └── index.html
├── developer-prompts/
│   └── index.html
├── fundamentals/
│   └── index.html
├── prompting-basics/
│   └── index.html
└── ...
```

### انتقال به cPanel

پس از اجرای:

```bash
npm run generate
```

محتویات داخل `dist/` را به `public_html/` یا Document Root دامنه در cPanel منتقل کنید.

فایل‌ها و پوشه‌های داخل `dist` باید مستقیماً در ریشه سایت قرار بگیرند؛ خود پوشه `dist` را داخل `public_html` قرار ندهید.

مثال:

```text
dist/index.html                 → public_html/index.html
dist/about/index.html           → public_html/about/index.html
dist/developer-prompts/...      → public_html/developer-prompts/...
dist/assets/...                 → public_html/assets/...
```

در cPanel برای این پروژه نیازی به Node.js، npm یا اجرای Vite در زمان سرویس‌دهی سایت نیست؛ سرور فقط فایل‌های استاتیک خروجی `dist` را ارائه می‌کند.

## تفاوت npm run dev، build و generate

### توسعه

```bash
npm run dev
```

سرور توسعه Vite را اجرا می‌کند و برای توسعه و بررسی سریع تغییرات استفاده می‌شود.

### Build

```bash
npm run build
```

نسخه production را تولید می‌کند و خروجی آن در `dist/` قرار می‌گیرد.

### Generate

```bash
npm run generate
```

فرایند تولید محتوای پروژه و build نهایی را یکجا اجرا می‌کند و برای آماده‌سازی نسخه قابل انتقال به cPanel در نظر گرفته شده است.

## روند تولید سایت

فرایند اصلی به این شکل است:

```text
Source Repository
       ↓
npm run update-source
       ↓
build-site.mjs
       ↓
enhance-generated.mjs
       ↓
sanitize-generated.mjs
       ↓
seo.mjs
       ↓
build-tailwind.mjs
       ↓
vite build
       ↓
dist/
       ↓
cPanel / Static Hosting
```

### build-site.mjs

محتوای منبع را پردازش می‌کند و صفحات، دسته‌بندی‌ها، پرامپت‌ها، search index، sitemap و فایل‌های اولیه سایت را تولید می‌کند.

### enhance-generated.mjs

تغییرات اختصاصی پروژه را روی صفحات تولیدشده اعمال می‌کند؛ از جمله محتوای اختصاصی صفحه اصلی، صفحه درباره پروژه و anchorهای پرامپت‌ها.

### sanitize-generated.mjs

HTML تولیدشده را بررسی و اصلاح می‌کند تا attributeهای Alpine.js و HTMLهای تولیدشده با داده‌های متنی باعث خراب شدن markup نشوند.

### seo.mjs

Metadata و داده‌های ساختاریافته صفحات را تولید می‌کند، از جمله:

- Title
- Description
- Canonical
- Robots
- Open Graph
- Twitter Card
- JSON-LD
- WebPage / AboutPage
- Article
- BreadcrumbList
- Organization
- Person
- WebSite
- ImageObject

### build-tailwind.mjs

CSS نهایی Tailwind را تولید می‌کند و خروجی اصلی آن در مسیر زیر قرار می‌گیرد:

```text
public/assets/main.css
```

### vite build

تمام صفحات `index.html` موجود در پروژه را به‌عنوان ورودی build شناسایی می‌کند و نسخه نهایی را در `dist/` قرار می‌دهد.

## تنظیم دامنه برای SEO

دامنه پیش‌فرض پروژه:

```text
https://llm.bestjustify.ir
```

برای build با دامنه دیگر می‌توان مقدار `SITE_URL` را تعیین کرد:

```bash
SITE_URL=https://example.com npm run generate
```

در Windows PowerShell:

```powershell
$env:SITE_URL="https://example.com"; npm run generate
```

این مقدار برای canonical، Open Graph، JSON-LD، sitemap و سایر URLهای مطلق SEO استفاده می‌شود.

## توسعه و تغییر محتوا

اگر محتوای آموزشی منبع اصلی تغییر کرده است:

```bash
npm run update-source
```

اگر فقط کد یا طراحی همین پروژه تغییر کرده است:

```bash
npm run build
```

برای انتشار روی cPanel در هر دو حالت، خروجی نهایی `dist/` را منتقل کنید.

## Git و Submodule

پس از به‌روزرسانی submodule ممکن است pointer آن در Git تغییر کند. تغییرات پروژه را بررسی کنید:

```bash
git status
```

و سپس commit کنید:

```bash
git add .
git commit -m "Update source and generated site"
git push origin main
```

## تست قبل از انتشار

قبل از انتقال به cPanel:

```bash
npm run generate
```

سپس وجود این موارد را در `dist/` بررسی کنید:

```text
dist/index.html
dist/about/index.html
dist/developer-prompts/index.html
dist/assets/main.css
dist/search-index.json
dist/sitemap.xml
dist/robots.txt
```

همچنین صفحات داخلی، جست‌وجو، فهرست مطالب، لینک‌های anchor و دکمه‌های کپی پرامپت‌ها باید در نسخه production بررسی شوند.

## CI

Workflow موجود در:

```text
.github/workflows/build.yml
```

برای بررسی خودکار build پروژه استفاده می‌شود.

## مجوز و Attribution

این پروژه بر پایه محتوای پروژه متن‌باز زیر ساخته شده است:

https://github.com/3lf/llm-for-humans

قبل از استفاده مجدد یا انتشار محتوای منبع، شرایط مجوز و الزامات attribution پروژه اصلی را بررسی کنید.

برای مشاهده کد وب‌سایت:

https://github.com/mraliarman/ai-website
