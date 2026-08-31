#!/usr/bin/env node
/**
 * 构建后处理 sitemap（由 package.json 的 build 脚本在 docusaurus build 之后调用）：
 *
 * 1. 为每个 <url> 注入 <lastmod>（git 最近提交时间，回退构建时间）。
 *    Docusaurus 默认 sitemap 不含 lastmod，而 Bing / Perplexity / AI 爬虫依赖它判断内容新鲜度。
 * 2. 把 build/en/sitemap.xml 的英文 URL 合并进根 sitemap，并为 zh/en 成对页面注入
 *    <xhtml:link rel="alternate"> hreflang 三元组（zh-CN / en-US / x-default）。
 *    Docusaurus i18n 的根 sitemap 只含默认语言，en 页"可访问但不可发现"。
 *
 * 映射规则：https://memfit.ai/<path> ↔ https://memfit.ai/en/<path>
 */
import {readFileSync, writeFileSync, existsSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';
import {execSync} from 'child_process';

const buildDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'build');
const sitemapPath = join(buildDir, 'sitemap.xml');
const enSitemapPath = join(buildDir, 'en', 'sitemap.xml');

let lastmod;
try {
  lastmod = execSync('git log -1 --format=%cI', {stdio: ['pipe', 'pipe', 'pipe']})
    .toString()
    .trim();
} catch {
  lastmod = new Date().toISOString();
}
if (Number.isNaN(Date.parse(lastmod))) {
  lastmod = new Date().toISOString();
}

let xml;
try {
  xml = readFileSync(sitemapPath, 'utf-8');
} catch (err) {
  console.error(`[patch-sitemap] 无法读取 ${sitemapPath}：`, err.message);
  process.exit(1);
}

const SITE = 'https://memfit.ai';
const zhUrls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m.group ? m.group(1) : m[1]);

// en URL -> zh URL 映射（去掉 /en 前缀）
let enUrls = [];
if (existsSync(enSitemapPath)) {
  const enXml = readFileSync(enSitemapPath, 'utf-8');
  enUrls = [...enXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => (m.group ? m.group(1) : m[1]));
}
const zhSet = new Set(zhUrls);
const enByZh = new Map();
const enOnly = [];
for (const en of enUrls) {
  if (!en.startsWith(`${SITE}/en`)) continue;
  const rest = en.slice(`${SITE}/en`.length) || '/'; // '' -> '/'
  const zh = `${SITE}${rest === '/' ? '/' : rest}`;
  if (zhSet.has(zh)) enByZh.set(zh, en);
  else enOnly.push(en);
}

function alternates(zh, en) {
  return (
    `<xhtml:link rel="alternate" hreflang="zh-CN" href="${zh}"/>` +
    `<xhtml:link rel="alternate" hreflang="en-US" href="${en}"/>` +
    `<xhtml:link rel="alternate" hreflang="x-default" href="${zh}"/>`
  );
}

// en 独有页面（无 zh 对应）：仅声明自身语言
function selfAlternates(url) {
  return `<xhtml:link rel="alternate" hreflang="en-US" href="${url}"/>`;
}

if (!xml.includes('<lastmod>')) {
  xml = xml.replace(
    /(<url>)(<loc>[^<]+<\/loc>)/g,
    `$1$2<lastmod>${lastmod}</lastmod>`,
  );
}

// 为已有 zh 条目注入 hreflang 交替（仅成对页面）
let altCount = 0;
xml = xml.replace(/<url>(<loc>[^<]+<\/loc>)(<lastmod>[^<]+<\/lastmod>)/g, (full, loc, lm) => {
  const zh = loc.slice(5, -6);
  const en = enByZh.get(zh);
  if (!en) return full;
  altCount++;
  return `<url>${loc}${lm}${alternates(zh, en)}`;
});

// 追加 en 条目（成对 + en 独有）
const enEntries = [];
for (const [zh, en] of enByZh) {
  enEntries.push(`<url><loc>${en}</loc><lastmod>${lastmod}</lastmod>${alternates(zh, en)}</url>`);
}
for (const en of enOnly) {
  enEntries.push(`<url><loc>${en}</loc><lastmod>${lastmod}</lastmod>${selfAlternates(en)}</url>`);
}
if (enEntries.length) {
  xml = xml.replace(/<\/urlset>\s*$/, `${enEntries.join('')}</urlset>`);
}

writeFileSync(sitemapPath, xml);
const lastmodCount = xml.split('<lastmod>').length - 1;
console.log(
  `[patch-sitemap] lastmod=${lastmod}（${lastmodCount} 个 URL）；` +
    `hreflang 成对注入 ${altCount} 条；追加 en 条目 ${enEntries.length} 个`,
);
