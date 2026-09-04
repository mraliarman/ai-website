# Contributing Guide

از مشارکت شما در توسعه پروژه **LLM به زبان آدمیزاد** استقبال می‌کنیم.

این پروژه با هدف ارائه یک مرجع فارسی و قابل‌فهم برای یادگیری مفاهیم مرتبط با LLM، Prompt Engineering و استفاده صحیح از مدل‌های زبانی توسعه داده شده است.

## پیش از شروع

قبل از ایجاد تغییر، ابتدا پروژه را بررسی کنید و مطمئن شوید تغییر پیشنهادی با هدف و ساختار پروژه هماهنگ است.

مراحل دریافت و آماده‌سازی پروژه:

```bash
git clone https://github.com/mraliarman/ai-website.git
cd ai-website
npm install
```

## ساختار پروژه

ساختار کلی پروژه به شکل زیر است:

```text
ai-website/
├── public/
│   └── source/
│       └── llm-for-humans/
├── src/
│   ├── content/
│   ├── scripts/
│   └── styles/
├── scripts/
│   ├── build-site.mjs
│   ├── build-tailwind.mjs
│   ├── enhance-generated.mjs
│   ├── sanitize-generated.mjs
│   ├── seo.mjs
│   └── sync-source.mjs
├── .github/
│   └── workflows/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

فایل‌های داخل `dist/` خروجی Production هستند و به‌صورت خودکار توسط فرآیند Build تولید می‌شوند.

## ایجاد تغییرات

برای هر تغییر، ابتدا یک Branch جداگانه ایجاد کنید:

```bash
git checkout -b feature/my-change
```

نام Branch باید کوتاه و مشخص باشد.

نمونه‌ها:

```text
feature/search-improvement
feature/new-prompt
fix/mobile-navigation
fix/hash-navigation
docs/update-readme
```

از ایجاد تغییر مستقیم روی `main` خودداری کنید.

## توسعه محلی

برای اجرای پروژه در محیط توسعه:

```bash
npm run dev
```

پس از اجرای دستور، Vite Development Server پروژه را اجرا می‌کند.

در زمان توسعه می‌توانید تغییرات HTML، CSS و JavaScript را بررسی و تست کنید.

## تولید Build

برای تولید خروجی کامل Production:

```bash
npm run generate
```

این دستور فرآیند کامل تولید سایت را اجرا می‌کند و خروجی نهایی را در `dist/` قرار می‌دهد.

فرآیند Build شامل مراحل اصلی زیر است:

1. دریافت و پردازش Source
2. تولید محتوای صفحات
3. اعمال تغییرات محتوایی و رابط کاربری
4. پاک‌سازی HTML تولیدشده
5. تولید Metadata و SEO
6. Build کردن Tailwind CSS
7. اجرای Vite Production Build
8. تولید خروجی نهایی در `dist/`

قبل از ارسال Pull Request، اجرای موفق Build الزامی است.

## تست Build

پس از ایجاد تغییرات، حداقل دستور زیر را اجرا کنید:

```bash
npm run generate
```

اطمینان حاصل کنید که:

* Build بدون خطا اجرا شود.
* تمام صفحات موردنیاز تولید شوند.
* لینک‌های داخلی صحیح باشند.
* Navigation و Hash Navigation کار کنند.
* جستجوی سایت بدون خطا کار کند.
* صفحات در Desktop و Mobile به‌درستی نمایش داده شوند.
* فایل‌های SEO به‌درستی تولید شوند.
* خروجی `dist/` قابل انتشار باشد.

## تغییر محتوای Source

محتوای اصلی پروژه از Source پروژه:

```text
public/source/llm-for-humans/
```

پردازش می‌شود.

در صورتی که تغییر مربوط به محتوای اصلی آموزشی است، تا حد امکان تغییر را در Source یا فرآیند تبدیل محتوا اعمال کنید و از ویرایش مستقیم صفحات Generated خودداری کنید.

صفحات Generated ممکن است در Build بعدی مجدداً تولید شوند.

## تغییر ظاهر و UI

کدهای مربوط به Style در مسیر زیر قرار دارند:

```text
src/styles/
```

پروژه از Tailwind CSS استفاده می‌کند.

کلاس‌های موردنیاز باید به شکلی نوشته شوند که توسط فرآیند Tailwind Build قابل شناسایی باشند.

از اضافه کردن CSS غیرضروری و تکراری خودداری کنید.

## تغییر JavaScript

کدهای JavaScript اصلی پروژه در مسیر زیر قرار دارند:

```text
src/scripts/
```

در صورت تغییر رفتار Navigation، Search، Anchorها یا سایر قابلیت‌های عمومی سایت، حتماً صفحات مختلف و حالت‌های مختلف URL را بررسی کنید.

به‌خصوص موارد زیر باید تست شوند:

```text
/page/
#/section
/page/#section
```

## SEO

تولید SEO و Structured Data توسط Script مربوط به SEO انجام می‌شود:

```text
scripts/seo.mjs
```

در صورت اضافه کردن صفحه یا تغییر ساختار URL، موارد زیر را بررسی کنید:

* `title`
* `description`
* Canonical URL
* Open Graph
* Twitter Card
* JSON-LD
* Sitemap
* Robots

از قرار دادن اطلاعات SEO به‌صورت دستی در صفحات Generated تا حد امکان خودداری کنید.

## Commit

پیام Commit باید واضح و مشخص باشد.

ساختار پیشنهادی:

```text
type: description
```

نمونه:

```text
feat: add developer prompt search
fix: resolve hash navigation
fix: correct mobile menu behavior
docs: update contributing guide
refactor: simplify build pipeline
```

انواع متداول:

```text
feat
fix
docs
refactor
style
test
chore
build
```

پیام Commit باید توضیح دهد چه تغییری ایجاد شده است، نه اینکه صرفاً وضعیت را بیان کند.

نامناسب:

```text
update
changes
fix stuff
final
```

مناسب:

```text
fix: prevent generated anchor links from breaking
```

## Pull Request

پس از تکمیل تغییرات:

```bash
git push origin feature/my-change
```

سپس یک Pull Request به Branch `main` ایجاد کنید.

Pull Request باید شامل موارد زیر باشد:

* توضیح کوتاه درباره تغییر
* دلیل انجام تغییر
* فایل‌ها یا بخش‌های اصلی تغییرکرده
* روش تست
* هرگونه تغییر قابل‌توجه در Build یا Deployment

نمونه ساختار:

```text
## What changed

توضیح تغییرات

## Why

دلیل انجام تغییر

## Testing

- npm run generate
- بررسی صفحات اصلی
- بررسی Mobile
- بررسی Navigation
```

## تغییرات مربوط به Build

اگر تغییر شما روی یکی از موارد زیر تأثیر می‌گذارد:

```text
Vite
Tailwind
Build Scripts
SEO Generation
Source Synchronization
Generated Pages
Deployment
```

حتماً Build کامل را اجرا و خروجی `dist/` را بررسی کنید.

## Generated Files

فایل‌های Generated را مستقیماً ویرایش نکنید، مگر اینکه تغییر مشخصاً مربوط به فرآیند تولید خروجی باشد.

این فایل‌ها ممکن است در Build بعدی بازنویسی شوند.

به‌جای اصلاح خروجی Generated، منبع یا Script تولیدکننده آن را اصلاح کنید.

## Dependency Changes

در صورت نیاز به اضافه کردن یا تغییر Dependency:

```bash
npm install package-name
```

یا:

```bash
npm install -D package-name
```

از اضافه کردن Dependency غیرضروری خودداری کنید.

هر Dependency جدید باید دلیل مشخصی داشته باشد و با ساختار فعلی پروژه سازگار باشد.

## Issues

در صورت مشاهده Bug، قبل از ایجاد Issue بررسی کنید که مشکل قبلاً گزارش نشده باشد.

Issue باید حداقل شامل موارد زیر باشد:

* شرح مشکل
* مراحل بازتولید
* رفتار مورد انتظار
* رفتار فعلی
* Browser و Environment در صورت مرتبط بودن
* Screenshot در صورت نیاز

نمونه:

```text
## Description

توضیح مشکل

## Steps to reproduce

1. وارد صفحه ...
2. روی ...
3. مشاهده ...

## Expected behavior

رفتار مورد انتظار

## Actual behavior

رفتار فعلی
```

## پیشنهاد قابلیت جدید

برای پیشنهاد قابلیت جدید، ابتدا هدف و کاربرد قابلیت را توضیح دهید.

پیشنهاد باید مشخص کند:

* چه مشکلی را حل می‌کند؟
* چه کاربرانی از آن استفاده می‌کنند؟
* چه تغییری در تجربه کاربری ایجاد می‌کند؟
* آیا با ساختار فعلی پروژه سازگار است؟

## کیفیت کد

هنگام مشارکت در پروژه:

* کد ساده و قابل نگهداری بنویسید.
* از تکرار غیرضروری جلوگیری کنید.
* تغییرات غیرمرتبط را وارد یک Commit نکنید.
* از ایجاد Dependency غیرضروری خودداری کنید.
* ساختار فعلی پروژه را تا حد امکان حفظ کنید.
* قبل از ارسال Pull Request، Build را اجرا کنید.
* تغییرات خود را روی Desktop و Mobile بررسی کنید.

## Attribution

محتوای آموزشی این پروژه بر پایه پروژه متن‌باز:

`3lf/llm-for-humans`

است.

این وب‌سایت توسط **فرداد آرمان** ایجاد و توسعه داده شده و شامل لایه ارائه، طراحی رابط فارسی، ساختار صفحات، جستجو، Build Pipeline و تجربه کاربری اختصاصی این پروژه است.

## License

با مشارکت در این پروژه، موافقت می‌کنید که مشارکت شما تحت همان شرایط مجوزی که برای پروژه اعمال می‌شود، منتشر شود.

لطفاً پیش از ارسال محتوای جدید، حقوق مالکیت معنوی و مجوز Source مورد استفاده را بررسی کنید.

## Code of Conduct

تمام مشارکت‌کنندگان باید در تعاملات خود رفتار حرفه‌ای و محترمانه داشته باشند.

توهین، آزار، تبعیض و رفتار نامناسب در فرآیند توسعه پروژه قابل قبول نیست.

هدف این پروژه ایجاد یک محیط مشارکتی برای بهبود کیفیت محتوای فارسی و تجربه یادگیری درباره مدل‌های زبانی است.
