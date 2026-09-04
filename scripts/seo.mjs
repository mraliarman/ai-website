import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const siteUrl = (process.env.SITE_URL || 'https://example.com').replace(/\/$/, '');
const siteName = 'LLM به زبان آدمیزاد';
const siteDescription = 'راهنمای فارسی و کاربردی برای یادگیری و استفاده از مدل‌های زبانی بزرگ (LLM).';
const authorName = 'تیم LLM به زبان آدمیزاد';
const authorUrl = `${siteUrl}/about/`;
const fallbackImage = `${siteUrl}/assets/og-image.svg`;
const now = () => new Date().toISOString();

const escapeHtml = value => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const absoluteUrl = value => {
    if (!value) return '';
    if (/^https?:\/\//i.test(value)) return value;
    return `${siteUrl}${value.startsWith('/') ? value : `/${value}`}`;
};

const stripHtml = html => String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const extract = (html, pattern, fallback = '') => pattern.exec(html)?.[1]?.trim() || fallback;

function routeFromFile(file) {
    const relative = path.relative(root, file).replaceAll(path.sep, '/');
    return relative === 'index.html' ? '/' : `/${relative.slice(0, -11)}`;
}

async function walk(dir) {
    const files = [];
    for (const entry of await fs.readdir(dir, {withFileTypes: true})) {
        if (['.git', 'node_modules', 'dist', 'public', 'scripts', 'src'].includes(entry.name)) continue;
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) files.push(...await walk(file));
        else if (entry.isFile() && entry.name === 'index.html') files.push(file);
    }
    return files;
}

function imageFromHtml(html) {
    return html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] || '';
}

function imageType(image) {
    const extension = path.extname(new URL(image, siteUrl).pathname).toLowerCase();
    return extension === '.png' ? 'image/png' : extension === '.webp' ? 'image/webp' : extension === '.jpg' || extension === '.jpeg' ? 'image/jpeg' : 'image/svg+xml';
}

function keywordsFromHtml(html, title, description) {
    const headings = [...html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)].map(match => stripHtml(match[1]));
    const source = [title, description, ...headings, 'LLM', 'هوش مصنوعی', 'پرامپت‌نویسی', 'مدل‌های زبانی', 'RAG'].join(',');
    return [...new Set(source.split(/[,،|]/).map(item => stripHtml(item)).filter(item => item.length > 1))].slice(0, 20).join(', ');
}

function removeGeneratedSeo(html) {
    return html
        .replace(/\s*<meta\s+(?:name="(?:robots|author|keywords|language|theme-color|twitter:[^"]+)"|property="(?:og:[^"]+|article:[^"]+)"|rel="canonical")[^>]*>/gi, '')
        .replace(/\s*<link\s+rel="(?:canonical|alternate)"[^>]*>/gi, '')
        .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');
}

function organization() {
    return {
        '@type': 'Organization',
        '@id': `${absoluteUrl('/')}#organization`,
        name: siteName,
        url: absoluteUrl('/'),
        description: siteDescription,
        founder: {'@id': `${authorUrl}#person`},
        sameAs: ['https://github.com/mraliarman/ai-website']
    };
}

function author() {
    return {
        '@type': 'Person',
        '@id': `${authorUrl}#person`,
        name: authorName,
        url: authorUrl,
        worksFor: {'@id': `${absoluteUrl('/')}#organization`}
    };
}

function website() {
    return {
        '@type': 'WebSite',
        '@id': `${absoluteUrl('/')}#website`,
        url: absoluteUrl('/'),
        name: siteName,
        description: siteDescription,
        inLanguage: 'fa-IR',
        publisher: {'@id': `${absoluteUrl('/')}#organization`}
    };
}

function breadcrumb(route, title) {
    return {
        '@type': 'BreadcrumbList',
        '@id': `${absoluteUrl(route)}#breadcrumb`,
        itemListElement: [
            {'@type': 'ListItem', position: 1, name: 'خانه', item: absoluteUrl('/')},
            {'@type': 'ListItem', position: 2, name: title, item: absoluteUrl(route)}
        ]
    };
}

function webPage(route, title, description, image, modified) {
    const isHome = route === '/';
    const isAbout = route === '/about/';
    return {
        '@type': isAbout ? 'AboutPage' : 'WebPage',
        '@id': `${absoluteUrl(route)}#webpage`,
        url: absoluteUrl(route),
        name: title,
        description,
        inLanguage: 'fa-IR',
        isPartOf: {'@id': `${absoluteUrl('/')}#website`},
        about: {'@id': `${absoluteUrl('/')}#organization`},
        author: {'@id': `${authorUrl}#person`},
        publisher: {'@id': `${absoluteUrl('/')}#organization`},
        dateModified: modified,
        ...(isHome ? {} : {breadcrumb: {'@id': `${absoluteUrl(route)}#breadcrumb`}}),
        primaryImageOfPage: {'@type': 'ImageObject', '@id': `${absoluteUrl(route)}#primaryimage`, url: image, contentUrl: image, width: 1200, height: 630}
    };
}

function article(route, title, description, image, modified, keywords, body) {
    return {
        '@type': 'Article',
        '@id': `${absoluteUrl(route)}#article`,
        url: absoluteUrl(route),
        headline: title,
        name: title,
        description,
        articleSection: keywords.split(', ').slice(0, 3),
        keywords,
        inLanguage: 'fa-IR',
        articleBody: body,
        datePublished: modified,
        dateModified: modified,
        author: {'@id': `${authorUrl}#person`},
        publisher: {'@id': `${absoluteUrl('/')}#organization`},
        mainEntityOfPage: {'@id': `${absoluteUrl(route)}#webpage`},
        image: [image]
    };
}

const files = await walk(root);
const pages = [];
for (const file of files) {
    const html = await fs.readFile(file, 'utf8');
    const stat = await fs.stat(file);
    pages.push({file, html, route: routeFromFile(file), image: imageFromHtml(html), modified: stat.mtime.toISOString()});
}

for (const pageData of pages) {
    const {file, route, modified} = pageData;
    let html = pageData.html;
    const title = stripHtml(extract(html, /<title>([\s\S]*?)<\/title>/i, siteName)).replace(/\s*\|\s*LLM به زبان آدمیزاد$/, '');
    const description = stripHtml(extract(html, /<meta\s+name="description"\s+content="([\s\S]*?)"/i, siteDescription));
    const image = absoluteUrl(imageFromHtml(html) || fallbackImage);
    const canonical = absoluteUrl(route);
    const keywords = keywordsFromHtml(html, title, description);
    const body = stripHtml(html).slice(0, 12000);
    const type = route === '/' || route === '/about/' || route === '/developer-prompts/' ? 'website' : 'article';
    const graph = [organization(), author(), website(), webPage(route, title, description, image, modified)];

    if (route !== '/') graph.push(breadcrumb(route, title));
    if (type === 'article') graph.push(article(route, title, description, image, modified, keywords, body));
    if (route === '/developer-prompts/') {
        graph.push({
            '@type': 'CollectionPage',
            '@id': `${canonical}#collection`,
            url: canonical,
            name: title,
            description,
            inLanguage: 'fa-IR',
            isPartOf: {'@id': `${absoluteUrl('/')}#website`},
            author: {'@id': `${authorUrl}#person`},
            publisher: {'@id': `${absoluteUrl('/')}#organization`},
            image
        });
    }

    const imageMeta = `<meta property="og:image" content="${escapeHtml(image)}"><meta property="og:image:secure_url" content="${escapeHtml(image)}"><meta property="og:image:type" content="${imageType(image)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${escapeHtml(title)}"><meta name="twitter:image" content="${escapeHtml(image)}"><meta name="twitter:image:alt" content="${escapeHtml(title)}">`;
    const meta = [
        `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">`,
        `<meta name="author" content="${escapeHtml(authorName)}">`,
        `<meta name="keywords" content="${escapeHtml(keywords)}">`,
        `<meta name="language" content="fa-IR">`,
        `<meta name="theme-color" content="#0a0a0a">`,
        `<link rel="canonical" href="${escapeHtml(canonical)}">`,
        `<link rel="alternate" hreflang="fa-IR" href="${escapeHtml(canonical)}">`,
        `<link rel="alternate" hreflang="x-default" href="${escapeHtml(canonical)}">`,
        `<meta property="og:locale" content="fa_IR">`,
        `<meta property="og:type" content="${type}">`,
        `<meta property="og:title" content="${escapeHtml(title)}">`,
        `<meta property="og:description" content="${escapeHtml(description)}">`,
        `<meta property="og:url" content="${escapeHtml(canonical)}">`,
        `<meta property="og:site_name" content="${escapeHtml(siteName)}">`,
        `<meta property="article:author" content="${escapeHtml(authorUrl)}">`,
        `<meta property="article:published_time" content="${escapeHtml(modified)}">`,
        `<meta property="article:modified_time" content="${escapeHtml(modified)}">`,
        imageMeta,
        `<meta name="twitter:card" content="summary_large_image">`,
        `<meta name="twitter:title" content="${escapeHtml(title)}">`,
        `<meta name="twitter:description" content="${escapeHtml(description)}">`,
        `<meta name="twitter:creator" content="@mraliarman">`,
        `<meta name="twitter:site" content="${escapeHtml(siteUrl)}">`,
        `<meta name="twitter:label1" content="نوشته‌شده بدست">`,
        `<meta name="twitter:data1" content="${escapeHtml(authorName)}">`,
        `<script type="application/ld+json">${JSON.stringify({'@context': 'https://schema.org', '@graph': graph})}</script>`
    ].join('');

    html = removeGeneratedSeo(html).replace('</head>', `${meta}</head>`);
    await fs.writeFile(file, html, 'utf8');
}

const routes = pages.map(page => page.route).sort();
const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${escapeHtml(absoluteUrl(route))}</loc></url>`).join('')}</urlset>`;
await fs.writeFile(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
await fs.writeFile(path.join(publicDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`, 'utf8');
console.log(`SEO metadata generated for ${pages.length} pages.`);
