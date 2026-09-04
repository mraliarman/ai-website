import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const siteUrl = (process.env.SITE_URL || '').replace(/\/$/, '');
const defaultDescription = 'راهنمای فارسی و کاربردی یادگیری مدل‌های زبانی بزرگ، پرامپت‌نویسی، RAG و ساخت سیستم‌های مبتنی بر LLM.';

const escapeHtml = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const stripHtml = value => String(value ?? '').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const routeOf = relative => relative === 'index.html' ? '/' : `/${relative.replaceAll(path.sep,'/').replace(/\/index\.html$/,'/')}`;

async function walk(dir){
  const entries=await fs.readdir(dir,{withFileTypes:true}); const files=[];
  for(const entry of entries){const full=path.join(dir,entry.name); if(entry.isDirectory()&&!['source','dist','assets'].includes(entry.name)) files.push(...await walk(full)); else if(entry.isFile()&&entry.name==='index.html') files.push(full)} return files;
}

const files=await walk(publicDir);
for(const file of files){
  const relative=path.relative(publicDir,file); let html=await fs.readFile(file,'utf8');
  if(html.includes('name="seo-generated"')) continue;
  const route=routeOf(relative); const canonical=siteUrl?`${siteUrl}${route}`:route;
  const title=stripHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]||'LLM به زبان آدمیزاد');
  const description=stripHtml(html.match(/<meta[^>]+name="description"[^>]+content="([\s\S]*?)"/i)?.[1]||defaultDescription).slice(0,160);
  const heading=stripHtml(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]||title);
  const type=relative==='index.html'?'WebSite':relative==='about/index.html'?'AboutPage':'Article';
  const schema=type==='WebSite'?{'@context':'https://schema.org','@type':'WebSite',name:'LLM به زبان آدمیزاد',inLanguage:'fa-IR',url:canonical,description}:{'@context':'https://schema.org','@type':type,name:heading,headline:heading,description,inLanguage:'fa-IR',url:canonical,author:{'@type':'Organization',name:'LLM به زبان آدمیزاد'},isPartOf:{'@type':'WebSite',name:'LLM به زبان آدمیزاد',url:siteUrl||canonical}};
  const head=`<meta name="seo-generated" content="true"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><meta name="author" content="LLM به زبان آدمیزاد"><meta name="language" content="fa"><meta name="theme-color" content="#0a0a0a"><link rel="canonical" href="${escapeHtml(canonical)}"><meta property="og:locale" content="fa_IR"><meta property="og:site_name" content="LLM به زبان آدمیزاد"><meta property="og:type" content="${type==='Article'?'article':'website'}"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${escapeHtml(canonical)}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}"><script type="application/ld+json">${JSON.stringify(schema)}</script>`;
  html=html.replace(/<link rel="canonical"[^>]*>\s*/i,''); html=html.replace('</head>',`${head}</head>`); await fs.writeFile(file,html,'utf8');
}
console.log(`SEO metadata generated for ${files.length} page(s).`);
