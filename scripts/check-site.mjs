import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://thomasweek.top/';
const errors = [];
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const has = file => fs.existsSync(path.join(root, file));
const assert = (ok, message) => { if (!ok) errors.push(message); };
const getAttr = (tag, attr) => tag.match(new RegExp('\\b' + attr + '\\s*=\\s*["\\x27]([^"\\x27]*)["\\x27]', 'i'))?.[1];
const tagList = (html, name) => [...html.matchAll(new RegExp('<' + name + '\\b[^>]*>', 'gi'))].map(x => x[0]);
const filenameFor = uri => {
  const u = new URL(uri, origin);
  if (u.origin !== new URL(origin).origin) return null;
  const pathname = decodeURIComponent(u.pathname);
  const relative = pathname.endsWith('/') ? pathname.slice(1) + 'index.html' : pathname.slice(1);
  const absolute = path.resolve(root, relative);
  return absolute.startsWith(root + path.sep) ? relative : null;
};

const sitemap = read('sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
assert(urls.length > 0, 'sitemap.xml has no pages');
assert(new Set(urls).size === urls.length, 'sitemap.xml contains duplicate URLs');
assert(read('robots.txt').includes('Sitemap: ' + origin + 'sitemap.xml'), 'robots.txt sitemap URL mismatch');
assert(read('robots.txt').includes('Allow: /'), 'robots.txt does not allow crawling');
assert(read('baidu-urls.txt').trim() === urls.join('\n'), 'baidu-urls.txt and sitemap.xml differ');
const sitePages = JSON.parse(read('content/site-pages.json'));
assert(sitePages.site === origin, 'content/site-pages.json has incorrect site URL');
assert(sitePages.pages.length === urls.length, 'Site page metadata and sitemap count differ');

let checkedLinks = 0;
let checkedStructuredData = 0;
for (const pageUrl of urls) {
  assert(pageUrl.startsWith(origin), 'Unexpected sitemap domain: ' + pageUrl);
  const file = filenameFor(pageUrl);
  if (!file || !has(file)) {
    errors.push('Missing sitemap page: ' + pageUrl);
    continue;
  }
  const html = read(file);
  assert(/<html\b[^>]*\blang=["']zh-CN["']/i.test(html), file + ' missing zh-CN language');
  assert(/<title>[^<]+<\/title>/i.test(html), file + ' missing page title');
  const desc = tagList(html, 'meta').find(tag => getAttr(tag, 'name')?.toLowerCase() === 'description');
  assert(Boolean(desc && getAttr(desc, 'content')), file + ' missing description');
  assert(tagList(html, 'h1').length === 1, file + ' must contain exactly one h1');
  const canonicalTags = tagList(html, 'link').filter(tag => getAttr(tag, 'rel') === 'canonical');
  assert(canonicalTags.length === 1, file + ' missing/duplicate canonical tag');
  assert(canonicalTags.length === 1 && getAttr(canonicalTags[0], 'href') === pageUrl, file + ' canonical URL mismatch');
  assert(!/\bnoindex\b/i.test(tagList(html, 'meta').filter(tag => getAttr(tag, 'name') === 'robots').join(' ')), file + ' accidentally marked noindex');
  assert(!html.includes('yansuansuansuan.github.io/thomasschool/'), file + ' still refers to old canonical domain');
  for (const tag of tagList(html, 'script')) {
    if (getAttr(tag, 'type') !== 'application/ld+json') continue;
    const start = html.indexOf(tag);
    const end = html.indexOf('</script>', start);
    if (end < 0) { errors.push(file + ' JSON-LD script not closed'); continue; }
    try { JSON.parse(html.slice(start + tag.length, end)); checkedStructuredData++; }
    catch (e) { errors.push(file + ' invalid JSON-LD: ' + e.message); }
  }
  for (const tag of html.match(/<(?:a|img|script|link)\b[^>]*>/gi) || []) {
    const value = getAttr(tag, 'href') || getAttr(tag, 'src');
    if (!value || value.startsWith('#')) continue;
    let target;
    try { target = filenameFor(new URL(value.replaceAll('&amp;', '&'), pageUrl)); }
    catch { continue; }
    if (!target) continue;
    checkedLinks++;
    assert(has(target), file + ' has broken local link: ' + value);
  }
}
if (errors.length) {
  console.error('Website audit failed (' + errors.length + '):\n- ' + errors.join('\n- '));
  process.exitCode = 1;
} else {
  console.log('Website audit passed: ' + urls.length + ' pages; ' + checkedLinks +
    ' internal references; ' + checkedStructuredData + ' structured-data blocks.');
}
