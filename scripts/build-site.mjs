import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(root, 'public/source/llm-for-humans');
const sourceReadme = path.join(sourceRoot, 'README.md');
const publicDir = path.join(root, 'public');
const contentDir = path.join(root, 'src/content/articles');
const promptDir = path.join(root, 'src/content/developer-prompts');
const categories = [
    ['fundamentals', 'مبانی LLM', 'مدل‌های زبانی بزرگ (LLM) چی هستن اصلاً؟', 'پایه‌های LLM، توکن، امبدینگ، پیش‌بینی توکن بعدی و معماری‌های پشت صحنه'],
    ['prompting-basics', 'پرامپت‌نویسی پایه', 'پرامپت‌نویسی: یعنی چی؟ چطور به LLM دستور بدیم؟', 'اصول نوشتن دستورهای روشن، محدودیت‌ها و مثال‌های ساده'],
    ['advanced-techniques', 'تکنیک‌های پیشرفته پرامپت‌نویسی', 'چطور پرامپت‌های بهتری بنویسیم؟ (تکنیک‌های پیشرفته‌تر)', 'جداکننده‌ها، خروجی ساختاریافته، لحن، شرط، Few-Shot، CoT و تکرار'],
    ['parameters', 'پارامترهای مدل', 'پارامترهای مهم در کار با LLMها', 'Temperature، Top-p، Penaltyها، Top-k، Max Tokens، Stop و Seed'],
    ['system-prompt', 'سیستم پرامپت', 'سیستم پرامپت (System Prompt)', 'تعریف، ساختار، چندنوبتی و نکات حرفه‌ای System Prompt'],
    ['pro-techniques', 'تکنیک‌های حرفه‌ای پرامپت‌نویسی', 'تکنیک‌های پرامپت‌نویسی', 'Role Prompting، Few-Shot، CoT، ToT، ReAct، Self-Consistency و روش‌های پیشرفته'],
    ['known-issues', 'مشکلات معروف LLMها', 'مشکلات معروف LLMها', 'توهم، Bias، خطای ریاضی، Prompt Injection، Context Window و مشکلات رایج'],
    ['accuracy-security', 'افزایش دقت و امنیت LLM', 'چطور دقت و امنیت LLM رو بالاتر ببریم؟', 'Moderation، Fact-Checking، Tool Integration، Self-Evaluation و Defense in Depth'],
    ['evaluation', 'ارزیابی پرامپت و خروجی', 'ارزیابی پرامپت و خروجی LLM', 'Human Eval، LLM-as-a-Judge، Metrics، Rubric، A/B Test و Observability'],
    ['finetuning-vs-rag', 'معماری و شخصی‌سازی', 'معماری و شخصی‌سازی (Fine-tuning vs RAG)', 'Fine-tuning، LoRA/QLoRA، داده آموزشی و انتخاب بین Fine-tuning و RAG'],
    ['context-engineering', 'مهندسی کانتکست', 'مهندسی کانتکست (Context Engineering)', 'طراحی و مدیریت Context برای سیستم‌های قابل‌اعتماد'],
    ['rag-in-practice', 'RAG در عمل', 'بخش RAG در عمل: زیر کاپوت چه خبره؟', 'معماری RAG، Embedding، Vector DB، Chunking، Retrieval و ارزیابی'],
    ['prompt-builders', 'ابزارهای ساخت پرامپت', 'ابزارهای ساخت و بهبود پرامپت', 'پرامپت‌سازها، کتابخانه‌ها و بهینه‌سازی خودکار'],
    ['model-selection', 'انتخاب مدل و Provider', 'راهبرد انتخاب مدل و ارائه‌دهنده', 'کیفیت، Latency، هزینه، مدل‌های بسته و متن‌باز و مسیر انتخاب'],
    ['free-access', 'دسترسی رایگان و اجرای محلی', 'دسترسی رایگان به API برای استفاده از LLMها', 'سرویس‌های آنلاین، Ollama، LM Studio و سخت‌افزار اجرای محلی'],
    ['tool-use-mcp', 'ابزارها، MCP و ایجنت‌ها', 'ابزارها و خروجی ساختاریافته (Function Calling)', 'Function Calling، MCP، Structured Output، Agents و Multimodal'],
    ['reference', 'مرجع و نمونه‌ها', 'پروژه عملی: ساخت دستیار پرسش‌وپاسخ فارسی', 'پروژه عملی، نمونه پرامپت‌ها، چیت‌شیت، اشتباهات رایج و واژه‌نامه']
];
const promptCategories = [
    ['product-discovery', 'کشف نیاز و برنامه‌ریزی محصول', 'PRD، MVP و Epic/Task'],
    ['software-architecture', 'معماری نرم‌افزار', 'انتخاب استک، دیتابیس، API و ADR'],
    ['scaffolding', 'راه‌اندازی اولیه پروژه', 'اسکلت پروژه، lint، format و CI'],
    ['frontend', 'توسعه فرانت‌اند', 'کامپوننت، state، فرم و a11y'],
    ['backend', 'توسعه بک‌اند', 'endpoint، validation، error handling و auth'],
    ['database', 'دیتابیس و مدل‌سازی داده', 'schema، migration، index و query optimization'],
    ['testing', 'تست‌نویسی', 'Unit، Integration، E2E و test data'],
    ['code-review-debug', 'بازبینی کد و رفع باگ', 'PR review، root cause و refactor'],
    ['security', 'امنیت', 'SQL Injection، XSS، CSRF، secrets، CORS و OWASP'],
    ['performance', 'کارایی و سرعت', 'N+1، bundle، caching و Core Web Vitals'],
    ['seo', 'سئو', 'metadata، JSON-LD، sitemap، robots و ساختار محتوا'],
    ['devops', 'DevOps و استقرار', 'Docker، CI/CD، environment، monitoring و logs'],
    ['documentation', 'مستندسازی', 'README، API docs و CONTRIBUTING'],
    ['pre-launch', 'بازبینی نهایی پیش از انتشار', 'امنیت، سرعت، سئو، تست و آمادگی انتشار']
];
const escapeHtml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const escapeAttr = value => escapeHtml(value).replaceAll("'", '&#39;');
const rewriteImages = value => value.replace(/!\[([^\]]*)\]\((?:\.\/)?images\/([^\s)]+)(?:\s+"([^"]*)")?\)/g, (_, alt, file, title) => `![${alt}](/source/llm-for-humans/images/${file}${title ? ` "${title}"` : ''})`);
const layout = ({title, description, body, active = ''}) => `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escapeAttr(description)}"><link rel="canonical" href="llm.bestjustify.ir${active ? active + '/' : ''}"><meta property="og:type" content="article"><meta property="og:title" content="${escapeAttr(title)}"><meta property="og:description" content="${escapeAttr(description)}"><meta name="twitter:card" content="summary"><link rel="stylesheet" href="/assets/main.css"><title>${escapeHtml(title)} | LLM به زبان آدمیزاد</title></head><body><header class="border-b border-graphite"><nav class="site-shell relative flex min-h-[76px] items-center justify-between gap-4 py-4"><a href="/" class="shrink-0 text-lg text-chalk no-underline md:text-xl">LLM / آدمیزاد</a><div class="hidden items-center gap-6 md:flex"><a href="/" class="text-sm text-smoke transition hover:text-chalk">خانه</a><a href="/developer-prompts/" class="text-sm text-smoke transition hover:text-chalk">پرامپت‌های توسعه‌دهنده</a><a href="/about/" class="text-sm text-smoke transition hover:text-chalk">درباره پروژه</a></div><div class="flex items-center gap-2"><button data-search-trigger @click="$dispatch('search-open')" aria-label="جستجو" class="rounded-pill border border-iron px-4 py-2 text-xs text-chalk transition hover:border-signal-white">جستجو /</button><button @click="mobileOpen = !mobileOpen" :aria-expanded="mobileOpen" aria-controls="mobile-navigation" aria-label="باز کردن منو" class="rounded-card border border-iron px-3 py-2 text-chalk md:hidden"><span class="block h-px w-5 bg-chalk"></span><span class="mt-1.5 block h-px w-5 bg-chalk"></span><span class="mt-1.5 block h-px w-5 bg-chalk"></span></button></div><div id="mobile-navigation" x-data="{ mobileOpen: false }" x-show="mobileOpen" x-transition.origin.top @click.outside="mobileOpen = false" class="absolute inset-x-0 top-full z-40 border-b border-graphite bg-carbon p-4 md:hidden"><div class="grid gap-1"><a @click="mobileOpen = false" href="/" class="border border-transparent px-4 py-3 text-sm text-smoke hover:border-graphite hover:text-chalk">خانه</a><a @click="mobileOpen = false" href="/developer-prompts/" class="border border-transparent px-4 py-3 text-sm text-smoke hover:border-graphite hover:text-chalk">پرامپت‌های توسعه‌دهنده</a><a @click="mobileOpen = false" href="/about/" class="border border-transparent px-4 py-3 text-sm text-smoke hover:border-graphite hover:text-chalk">درباره پروژه</a></div></div></nav></header><main>${body}</main><footer class="mt-32 border-t border-graphite"><div class="site-shell flex flex-col gap-4 py-10 text-sm text-smoke md:flex-row md:items-center md:justify-between"><span>LLM به زبان آدمیزاد</span><a class="text-smoke hover:text-chalk" href="https://github.com/3lf/llm-for-humans" rel="noopener noreferrer">منبع آموزشی در GitHub</a></div></footer><div x-data="searchState()" @search-open.window="show()" x-init="init()" x-cloak data-search-modal><template x-if="open"><div class="fixed inset-0 z-50 overflow-y-auto bg-black/90 p-4" role="dialog" aria-modal="true"><div class="mx-auto mt-8 max-w-3xl border border-graphite bg-carbon p-4 sm:mt-16 sm:p-6"><div class="flex gap-2"><input x-ref="input" x-model="query" @input.debounce.150ms="search()" @keydown.escape="hide()" type="search" aria-label="جستجوی محتوا" placeholder="جستجو در عنوان، خلاصه، تگ و متن..." class="min-w-0 flex-1 border border-graphite bg-obsidian px-4 py-3 text-sm text-chalk outline-none"><button @click="hide()" class="shrink-0 border border-iron px-4 text-smoke" aria-label="بستن">بستن</button></div><div class="mt-6 space-y-3"><template x-for="item in results" :key="item.id"><a :href="item.url" class="block border border-graphite p-4 hover:border-iron"><span class="text-xs text-smoke" x-text="item.category"></span><div class="mt-1 text-lg text-chalk" x-text="item.title"></div><p class="mt-1 text-sm text-smoke" x-text="item.summary"></p></a></template><p x-show="query && !results.length" class="py-10 text-center text-smoke">نتیجه‌ای پیدا نشد.</p></div></div></div></template></div><script type="module" src="/src/scripts/main.js"></script></body></html>`;
const card = (category, count) => `<a href="/${category[0]}/" class="group block border border-graphite p-5 transition hover:border-iron sm:p-6"><div class="mb-8 flex items-center justify-between"><span class="font-mono text-xs text-smoke">${String(count).padStart(2, '0')}</span><span class="text-compass-gold transition group-hover:translate-x-1">＋</span></div><h2 class="text-xl font-normal text-chalk sm:text-2xl">${category[1]}</h2><p class="mt-3 text-sm text-smoke">${category[3]}</p></a>`;
async function fetchSource() {
    try {
        return await fs.readFile(sourceReadme, 'utf8');
    } catch (error) {
        throw new Error('Source repository is not initialized. Run npm run update-source first.');
    }
}
function extractSections(source) {
    const markers = categories.map(([slug, title, start]) => ({ slug, title, start, index: source.indexOf(`# ${start}`) >= 0 ? source.indexOf(`# ${start}`) : source.indexOf(`## ${start}`) }));
    const valid = markers.filter(item => item.index >= 0).sort((a, b) => a.index - b.index);
    return valid.map((item, i) => ({ ...item, raw: source.slice(item.index, valid[i + 1]?.index ?? source.length) }));
}
function buildPrompts() {
    const actions = ['تحلیل و طراحی راه‌حل', 'تولید خروجی اجرایی', 'بازبینی کیفیت', 'یافتن ریسک‌ها و edge caseها', 'ساخت برنامه مرحله‌ای'];
    return promptCategories.flatMap(([category, title, focus]) => actions.map((action, index) => ({
        id: `${category}-${index + 1}`,
        title: `${title} — ${action}`,
        description: `یک پرامپت آماده برای ${focus} با تمرکز بر ${action}.`,
        category,
        categoryTitle: title,
        level: index < 2 ? 'مبتدی' : index < 4 ? 'متوسط' : 'حرفه‌ای',
        prompt: `نقش (Role):\nتو یک مهندس ارشد در حوزه ${title} هستی و در ${focus} تجربه عملی داری.\n\nهدف (Goal):\nبرای [نام پروژه] با مشخصات [شرح پروژه]، ${action} را انجام بده و خروجی قابل استفاده ارائه کن.\n\nقید و محدودیت (Constraints):\n- تکنولوژی‌ها: [زبان/فریم‌ورک/ابزار]\n- محیط اجرا: [محیط]\n- محدودیت‌های کسب‌وکار: [محدودیت‌ها]\n- اگر اطلاعات کافی نیست، ابتدا موارد ضروری را فهرست کن و فرضیات را جداگانه مشخص کن.\n- از تغییرات غیرضروری خارج از محدوده خودداری کن.\n\nفرمت خروجی:\n1. خلاصه تصمیم‌ها\n2. مراحل اجرایی شماره‌گذاری‌شده\n3. کد یا تنظیمات لازم در صورت نیاز\n4. ریسک‌ها و edge caseها\n5. معیار پذیرش (Acceptance Criteria)`,
        tags: [category, title, focus],
        url: `/developer-prompts/#${category}`
    })));
}
function renderMarkdown(markdown) {
    let headingIndex = 0;
    const renderer = new marked.Renderer();
    renderer.heading = ({ tokens, depth }) => {
        const text = marked.Parser.parseInline(tokens);
        const id = `s-${headingIndex++}`;
        return `<h${depth} id="${id}">${text}</h${depth}>`;
    };
    return marked.parse(markdown, { renderer });
}
function buildToc(markdown) {
    return [...markdown.matchAll(/^#{2,3}\s+(.+)$/gm)].map((match, i) => {
        const depth = match[0].startsWith('###') ? 3 : 2;
        return `<a class="${depth === 3 ? 'pr-5' : ''} border-b border-graphite/60 px-4 py-2.5 text-sm text-smoke transition hover:text-chalk" href="#s-${i}">${escapeHtml(match[1].replace(/\s+#+$/, ''))}</a>`;
    }).join('');
}
async function main() {
    await fs.access(sourceRoot);
    await fs.mkdir(contentDir, { recursive: true });
    await fs.mkdir(promptDir, { recursive: true });
    await fs.mkdir(publicDir, { recursive: true });
    const source = await fetchSource();
    const sections = extractSections(source);
    const generated = [];
    for (const category of categories) {
        const found = sections.find(item => item.slug === category[0]);
        const raw = found?.raw || `# ${category[1]}\n\nاین بخش در منبع اصلی پیدا نشد.`;
        const content = rewriteImages(raw.replace(/^<div[^>]*>\s*/i, '').replace(/<\/div>\s*/gi, '\n').trim().replace(/^#\s+[^\n]+\n+/, ''));
        const file = `---\nid: ${category[0]}\ntitle: ${category[1]}\nslug: ${category[0]}\ncategory: ${category[1]}\ntags: [LLM, AI, فارسی]\nsummary: ${category[3]}\nreadingTime: ${Math.max(2, Math.ceil(content.length / 1800))}\norder: ${categories.findIndex(item => item[0] === category[0]) + 1}\n---\n\n${content}\n`;
        await fs.writeFile(path.join(contentDir, `${category[0]}.md`), file, 'utf8');
        generated.push({ ...category, markdown: content, url: `/${category[0]}/` });
    }
    const prompts = buildPrompts();
    await fs.writeFile(path.join(promptDir, 'prompts.json'), JSON.stringify(prompts, null, 2), 'utf8');
    const index = generated.map(item => ({ id: item[0], title: item[1], slug: item[0], category: item[1], tags: ['LLM', 'AI', 'فارسی'], summary: item[3], content: item.markdown, url: item.url }));
    for (const prompt of prompts) index.push({ id: prompt.id, title: prompt.title, slug: prompt.id, category: `پرامپت‌ها / ${prompt.categoryTitle}`, tags: prompt.tags, summary: prompt.description, content: prompt.prompt, url: prompt.url });
    await fs.writeFile(path.join(publicDir, 'search-index.json'), JSON.stringify(index), 'utf8');
    const homeCards = generated.map((item, index) => card(item, index + 1)).join('');
    await fs.writeFile(path.join(root, 'index.html'), layout({ title: 'آموزش LLM و پرامپت‌نویسی', description: 'راهنمای فارسی کار با مدل‌های زبانی بزرگ، پرامپت‌نویسی، RAG و ابزارهای LLM.', body: `<section class="site-shell pb-24 pt-20 sm:pb-32 sm:pt-28"><span class="inline-flex rounded-tag border border-graphite bg-carbon px-3 py-1 text-xs text-smoke"><span class="ml-2 inline-block h-2 w-2 shrink-0 rounded-icon bg-pulse-green"></span>راهنمای فارسی LLM</span><h1 class="mt-7 max-w-5xl text-[38px] font-normal leading-[1.2] sm:text-[52px] md:text-[63px]">هوش مصنوعی را ساده، دقیق و کاربردی یاد بگیر.</h1><p class="mt-7 max-w-2xl text-base text-smoke sm:text-lg">از مبانی LLM و پرامپت‌نویسی تا RAG، Agent، انتخاب مدل و اجرای محلی؛ محتوای مرجع به بخش‌های مستقل و قابل جستجو تبدیل شده است.</p><div class="mt-9 flex flex-wrap gap-3"><a href="/fundamentals/" class="rounded-pill bg-signal-white px-6 py-3 text-sm text-obsidian">شروع یادگیری</a><a href="/developer-prompts/" class="rounded-card border border-signal-white px-6 py-3 text-sm text-chalk">پرامپت‌های توسعه‌دهنده</a></div></section><div class="site-shell border-t border-graphite"></div><section class="site-shell py-24 sm:py-32"><div class="mb-10"><span class="font-mono text-xs text-smoke">CONTENT / 17</span><h2 class="mt-3 text-3xl font-normal sm:text-4xl">مسیر یادگیری</h2></div><div class="grid gap-px bg-graphite sm:grid-cols-2">${homeCards}</div></section>` }));
    for (const item of generated) {
        const html = renderMarkdown(item.markdown);
        const toc = buildToc(item.markdown);
        const body = `<article class="site-shell py-16 sm:py-20"><div class="text-xs text-smoke">خانه / ${item[1]}</div><div class="mt-10 border-b border-graphite pb-10 sm:mt-12"><span class="font-mono text-xs text-smoke">${String(item[0]).toUpperCase()}</span><h1 class="mt-5 max-w-5xl text-[34px] font-normal leading-[1.3] sm:text-[44px]">${item[1]}</h1><p class="mt-5 max-w-3xl text-base text-smoke sm:text-lg">${item[3]}</p></div>${toc ? `<section class="toc mt-8 p-4 sm:p-5" aria-labelledby="toc-title"><div class="mb-3 flex items-center justify-between gap-4"><h2 id="toc-title" class="text-lg font-normal text-chalk">فهرست مطالب</h2><span class="font-mono text-xs text-smoke">${[...item.markdown.matchAll(/^#{2,3}\s+/gm)].length} بخش</span></div><nav class="grid gap-0">${toc}</nav></section>` : ''}<div class="article-layout mt-12"><div class="article-content"><div class="prose-llm">${html}</div></div></div></article>`;
        await fs.mkdir(path.join(root, item[0]), { recursive: true });
        await fs.writeFile(path.join(root, item[0], 'index.html'), layout({ title: item[1], description: item[3], body, active: item[0] }), 'utf8');
    }
    const promptBody = `<section class="site-shell py-16 sm:py-20" x-data="{ sub: 'all', level: 'all' }"><div class="border-b border-graphite pb-10"><span class="font-mono text-xs text-smoke">DEVELOPER / 70</span><h1 class="mt-5 max-w-5xl text-[36px] font-normal leading-[1.25] sm:text-[52px] md:text-[63px]">پرامپت‌های حرفه‌ای برای برنامه‌نویس</h1><p class="mt-5 max-w-3xl text-base text-smoke sm:text-lg">۷۰ پرامپت آماده برای کشف محصول، معماری، توسعه، تست، امنیت، کارایی، سئو و انتشار.</p></div><div class="sticky top-0 z-10 mt-8 border-b border-graphite bg-obsidian/95 py-4 backdrop-blur"><div class="flex flex-col gap-3 sm:flex-row"><select x-model="sub" aria-label="زیر دسته" class="min-w-0 border border-graphite bg-carbon px-3 py-2 text-sm text-chalk"><option value="all">همه زیر‌دسته‌ها</option>${promptCategories.map(item => `<option value="${item[0]}">${item[1]}</option>`).join('')}</select><select x-model="level" aria-label="سطح" class="min-w-0 border border-graphite bg-carbon px-3 py-2 text-sm text-chalk"><option value="all">همه سطوح</option><option value="مبتدی">مبتدی</option><option value="متوسط">متوسط</option><option value="حرفه‌ای">حرفه‌ای</option></select></div></div><div class="mt-8 grid gap-4">${prompts.map(prompt => `<article x-show="(sub === 'all' || sub === '${prompt.category}') && (level === 'all' || level === '${prompt.level}')" class="min-w-0 border border-graphite p-4 sm:p-6"><div class="flex flex-wrap gap-2 text-xs text-smoke"><span>${prompt.categoryTitle}</span><span>·</span><span>${prompt.level}</span></div><h2 class="mt-3 text-xl font-normal text-chalk sm:text-2xl">${escapeHtml(prompt.title)}</h2><p class="mt-2 text-sm text-smoke">${escapeHtml(prompt.description)}</p><div class="relative mt-5 min-w-0"><pre class="text-right max-w-full overflow-auto border border-graphite bg-carbon p-4 text-xs text-ash sm:text-sm" dir="ltr"><code>${escapeHtml(prompt.prompt)}</code></pre><button @click="navigator.clipboard.writeText(${JSON.stringify(prompt.prompt)}).then(() => $el.textContent = 'کپی شد')" class="absolute left-3 top-3 rounded-pill bg-signal-white px-4 py-2 text-xs text-obsidian" aria-label="کپی پرامپت">کپی</button></div></article>`).join('')}</div></section>`;
    await fs.mkdir(path.join(root, 'developer-prompts'), { recursive: true });
    await fs.writeFile(path.join(root, 'developer-prompts', 'index.html'), layout({ title: 'پرامپت‌های حرفه‌ای برنامه‌نویس', description: '۷۰ پرامپت آماده برای توسعه‌دهندگان.', body: promptBody, active: 'developer-prompts' }), 'utf8');
    const aboutBody = `<section class="site-shell py-16 sm:py-24"><div class="relative overflow-hidden border border-graphite bg-carbon p-6 sm:p-10 md:p-14"><div class="absolute left-8 top-8 h-3 w-3 rounded-icon bg-pulse-green"></div><span class="font-mono text-xs text-smoke">ABOUT / OPEN SOURCE</span><h1 class="mt-6 max-w-4xl text-[40px] font-normal leading-[1.2] sm:text-[56px] md:text-[68px]">یک راهنمای فارسی برای فهمیدن LLMها، بدون پیچیده‌گویی.</h1><p class="mt-7 max-w-3xl text-base text-smoke sm:text-lg">این وب‌سایت یک بازطراحی فارسی، استاتیک و قابل جستجو از محتوای پروژه‌ی متن‌باز LLM به زبان آدمیزاد است.</p><div class="mt-8 flex flex-wrap gap-3"><a href="https://github.com/3lf/llm-for-humans" rel="noopener noreferrer" class="rounded-pill bg-signal-white px-6 py-3 text-sm text-obsidian">مشاهده پروژه اصلی</a><a href="/" class="rounded-card border border-signal-white px-6 py-3 text-sm text-chalk">شروع مطالعه</a></div></div><div class="mt-8 grid gap-px bg-graphite md:grid-cols-3"><div class="bg-obsidian p-6 sm:p-8"><span class="font-mono text-xs text-smoke">SOURCE</span><h2 class="mt-3 text-xl font-normal">3lf / llm-for-humans</h2><p class="mt-3 text-sm text-smoke">محتوای آموزشی این سایت از مخزن اصلی متن‌باز دریافت و در زمان build به صفحات مستقل تبدیل می‌شود.</p></div><div class="bg-obsidian p-6 sm:p-8"><span class="font-mono text-xs text-smoke">STACK</span><h2 class="mt-3 text-xl font-normal">Vite + Tailwind + Alpine</h2><p class="mt-3 text-sm text-smoke">ساختار کاملاً استاتیک است و جستجو و تعاملات در سمت مرورگر انجام می‌شوند.</p></div><div class="bg-obsidian p-6 sm:p-8"><span class="font-mono text-xs text-smoke">SYNC</span><h2 class="mt-3 text-xl font-normal">همیشه قابل به‌روزرسانی</h2><p class="mt-3 text-sm text-smoke">مخزن اصلی به‌صورت submodule نگه‌داری می‌شود و با یک دستور می‌توان آخرین محتوا و تصاویر را دریافت و سایت را دوباره build کرد.</p></div></div><div class="mt-16 max-w-3xl border-t border-graphite pt-10"><span class="font-mono text-xs text-smoke">LICENSE / ATTRIBUTION</span><h2 class="mt-4 text-2xl font-normal">اعتبار منبع</h2><p class="mt-4 text-base text-ash">این پروژه از <a class="text-chalk underline underline-offset-4" href="https://github.com/3lf/llm-for-humans" rel="noopener noreferrer">3lf/llm-for-humans</a> استفاده می‌کند. محتوای آموزشی متعلق به پروژه منبع است و این سایت لایه‌ی ارائه، دسته‌بندی، طراحی رابط فارسی و تجربه مطالعه‌ی جدید را فراهم می‌کند.</p></div></section>`;
    await fs.mkdir(path.join(root, 'about'), { recursive: true });
    await fs.writeFile(path.join(root, 'about', 'index.html'), layout({ title: 'درباره پروژه', description: 'درباره LLM به زبان آدمیزاد، منبع اصلی و معماری پروژه.', body: aboutBody, active: 'about' }), 'utf8');
    await fs.writeFile(path.join(publicDir, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://llm.bestjustify.ir/sitemap.xml\n', 'utf8');
    const urls = ['', ...generated.map(item => item[0]), 'developer-prompts', 'about'];
    await fs.writeFile(path.join(publicDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>https://llm.bestjustify.ir/${url}${url ? '/' : ''}</loc></url>`).join('')}</urlset>`, 'utf8');
}
main().catch(error => { console.error(error); process.exit(1); });
