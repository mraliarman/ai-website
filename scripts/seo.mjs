import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const siteUrl = (process.env.SITE_URL || 'https://example.com').replace(/\/$/, '');
const siteName = 'LLM به زبان آدمیزاد';
const defaultDescription = 'راهنمای فارسی و کاربردی برای یادگیری و استفاده از مدل‌های زبانی بزرگ (LLM).';
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const abs = value => `${siteUrl}${value.startsWith('/') ? value : `/${value}`}`;
const strip = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const extract = (html, pattern, fallback = '') => pattern.exec(html)?.[1] || fallback;
async function walk(dir) {
	const files = [];
	for (const entry of await fs.readdir(dir, {withFileTypes: true})) {
		if (entry.name === 'source' || entry.name === 'dist') continue;
		const file = path.join(dir, entry.name);
		if (entry.isDirectory()) files.push(...await walk(file));
		else if (entry.isFile() && entry.name === 'index.html') files.push(file);
	}
	return files;
}
function routeFromFile(file) {
	const rel = path.relative(publicDir, file).replaceAll(path.sep, '/');
	return rel === 'index.html' ? '/' : `/${rel.slice(0, -11)}`;
}
function imageFromHtml(html) {
	return html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] || '';
}
function organization() {
	return {'@type':'Organization','@id':`${abs('/')}#organization`,'name':siteName,'url':abs('/')};
}
function website() {
	return {'@type':'WebSite','@id':`${abs('/')}#website`,'url':abs('/'),'name':siteName,'description':defaultDescription,'inLanguage':'fa-IR','publisher':{'@id':`${abs('/')}#organization`}};
}
function removeGeneratedSeo(html) {
	return html.replace(/\s*<meta\s+(?:name="(?:robots|author|language|theme-color|twitter:card|twitter:title|twitter:description|twitter:image)"|property="(?:og:[^"]+)"|rel="canonical")[^>]*>/gi, '').replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');
}
const files = await walk(publicDir);
const pages = new Map();
for (const file of files) {
	const html = await fs.readFile(file, 'utf8');
	pages.set(file, {html, image: imageFromHtml(html)});
}
const fallbackImage = [...pages.values()].map(page => page.image).find(Boolean) || '';
for (const file of files) {
	let html = pages.get(file).html;
	const route = routeFromFile(file);
	const title = strip(extract(html, /<title>([\s\S]*?)<\/title>/i, siteName));
	const description = strip(extract(html, /<meta\s+name="description"\s+content="([\s\S]*?)"/i, defaultDescription));
	const imagePath = pages.get(file).image || fallbackImage;
	const image = imagePath ? (imagePath.startsWith('http') ? imagePath : abs(imagePath)) : '';
	const canonical = abs(route);
	const isHome = route === '/';
	const isAbout = route === '/about/';
	const isPromptIndex = route === '/developer-prompts/';
	const pageType = isAbout ? 'AboutPage' : isPromptIndex || isHome ? 'WebPage' : 'Article';
	const page = {'@type':pageType,'@id':`${canonical}#webpage`,'url':canonical,'name':title,'description':description,'inLanguage':'fa-IR','isPartOf':{'@id':`${abs('/')}#website`},'publisher':{'@id':`${abs('/')}#organization`}};
	if (image) page.primaryImageOfPage = {'@type':'ImageObject','url':image};
	const graph = [organization(), website(), page];
	if (!isHome) graph.push({'@type':'BreadcrumbList','@id':`${canonical}#breadcrumb`,'itemListElement':[{'@type':'ListItem','position':1,'name':'خانه','item':abs('/')},{'@type':'ListItem','position':2,'name':title,'item':canonical}]});
	if (pageType === 'Article') {
		const article = {'@type':'Article','@id':`${canonical}#article`,'url':canonical,'headline':title,'name':title,'description':description,'inLanguage':'fa-IR','mainEntityOfPage':{'@id':`${canonical}#webpage`},'isPartOf':{'@id':`${abs('/')}#website`},'author':{'@id':`${abs('/')}#organization`},'publisher':{'@id':`${abs('/')}#organization`}};
		if (image) article.image = [image];
		graph.push(article);
	}
	if (isPromptIndex) graph.push({'@type':'CollectionPage','@id':`${canonical}#collection`,'url':canonical,'name':title,'description':description,'inLanguage':'fa-IR','isPartOf':{'@id':`${abs('/')}#website`}});
	const jsonLd = `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph})}</script>`;
	const meta = `<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><meta name="author" content="${esc(siteName)}"><meta name="language" content="fa-IR"><meta name="theme-color" content="#0a0a0a"><link rel="canonical" href="${esc(canonical)}"><meta property="og:type" content="${isHome || isAbout || isPromptIndex ? 'website' : 'article'}"><meta property="og:locale" content="fa_IR"><meta property="og:site_name" content="${esc(siteName)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}">${image ? `<meta property="og:image" content="${esc(image)}"><meta property="og:image:alt" content="${esc(title)}"><meta name="twitter:image" content="${esc(image)}">` : ''}<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}">${jsonLd}`;
	html = removeGeneratedSeo(html).replace('</head>', `${meta}</head>`);
	await fs.writeFile(file, html, 'utf8');
}
const routes = files.map(routeFromFile).sort();
await fs.writeFile(path.join(publicDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${esc(abs(route))}</loc></url>`).join('')}</urlset>`);
await fs.writeFile(path.join(publicDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${abs('/sitemap.xml')}\n`);
console.log(`SEO metadata generated for ${files.length} pages.`);
