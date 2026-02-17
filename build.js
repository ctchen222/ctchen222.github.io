const fs = require('fs');
const path = require('path');
const fm = require('front-matter');
const { marked } = require('marked');

const config = JSON.parse(fs.readFileSync('site.config.json', 'utf8'));
const DIST = 'dist';

// --- Helpers ---

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function renderNav() {
  return config.nav.map(n => `<a href="${n.url}">${n.label}</a>`).join('\n      ');
}

function renderFooter() {
  return config.footer.map(f => `<a href="${f.url}">${f.label}</a>`).join(' | ');
}

function renderDisqus() {
  if (!config.disqus) return '';
  return `<div id="disqus_thread"></div>
<script>
  var disqus_config = function () {};
  (function() {
    var d = document, s = d.createElement('script');
    s.src = 'https://${config.disqus}.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
  })();
</script>`;
}

function applyTemplate(template, vars) {
  let html = template;
  for (const [key, value] of Object.entries(vars)) {
    html = html.replaceAll(`{{${key}}}`, value);
  }
  return html;
}

function readMarkdownDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf8');
      const { attributes, body } = fm(raw);
      const slug = f.replace(/\.md$/, '');
      return { slug, ...attributes, body };
    });
}

function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

function getExcerpt(body, maxLen = 200) {
  const text = body
    .replace(/^#+\s+.*/gm, '')       // strip markdown headings
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // [text](url) → text
    .replace(/[*_`~]/g, '')           // strip emphasis markers
    .replace(/\n+/g, ' ')            // collapse newlines
    .trim();
  if (!text) return '';
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
}

// --- Load templates ---

const templates = {};
for (const name of ['index', 'post', 'letter', 'letter-index', 'about']) {
  templates[name] = fs.readFileSync(`templates/${name}.html`, 'utf8');
}

const commonVars = {
  title: config.title,
  siteTitle: config.siteTitle,
  author: config.author,
  nav: renderNav(),
  footer: renderFooter(),
  disqus: renderDisqus(),
};

// --- Clean & prepare dist ---

if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });
ensureDir(DIST);

// --- Build posts ---

const posts = readMarkdownDir('content/posts')
  .sort((a, b) => new Date(b.date) - new Date(a.date));

for (const post of posts) {
  const dir = path.join(DIST, 'posts', post.slug);
  ensureDir(dir);
  const html = applyTemplate(templates.post, {
    ...commonVars,
    postTitle: post.title || post.slug,
    date: formatDate(post.date),
    content: marked(post.body),
  });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

// Index page
const postListHtml = posts.map(p => {
  const excerpt = getExcerpt(p.body);
  return `    <div class="post-entry">
      <h2><a href="/posts/${p.slug}/">${p.title || p.slug}</a></h2>
      <div class="post-meta">${config.author} · ${formatDate(p.date)}</div>
      ${excerpt ? `<p class="post-excerpt">${excerpt}</p>` : ''}
      <a class="read-more" href="/posts/${p.slug}/">read more</a>
    </div>`;
}).join('\n');

const indexHtml = applyTemplate(templates.index, {
  ...commonVars,
  postList: postListHtml,
});
fs.writeFileSync(path.join(DIST, 'index.html'), indexHtml);

// --- Build letters ---

const letters = readMarkdownDir('content/letters')
  .sort((a, b) => new Date(b.date) - new Date(a.date));

for (const letter of letters) {
  const dir = path.join(DIST, 'letters', letter.slug);
  ensureDir(dir);
  const html = applyTemplate(templates.letter, {
    ...commonVars,
    postTitle: letter.title || letter.slug,
    date: formatDate(letter.date),
    content: marked(letter.body),
  });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

// Letter index page
const letterListHtml = letters.map(l =>
  `      <li><span class="date">${formatDate(l.date)}</span><a href="/letters/${l.slug}/">${l.title || l.slug}</a></li>`
).join('\n');

ensureDir(path.join(DIST, 'letter'));
const letterIndexHtml = applyTemplate(templates['letter-index'], {
  ...commonVars,
  letterList: letterListHtml,
});
fs.writeFileSync(path.join(DIST, 'letter', 'index.html'), letterIndexHtml);

// --- Build about page ---

const aboutContent = fs.readFileSync('content/pages/about.html', 'utf8');
ensureDir(path.join(DIST, 'about'));
const aboutHtml = applyTemplate(templates.about, {
  ...commonVars,
  content: aboutContent,
});
fs.writeFileSync(path.join(DIST, 'about', 'index.html'), aboutHtml);

// --- Copy static files ---

copyDir('static', DIST);

// --- Copy CNAME ---

if (fs.existsSync('CNAME')) {
  fs.copyFileSync('CNAME', path.join(DIST, 'CNAME'));
}

// --- Generate RSS feed ---

const rssItems = posts.map(p => `    <item>
      <title>${p.title}</title>
      <link>${config.url}/posts/${p.slug}/</link>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[${marked(p.body)}]]></description>
    </item>`).join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${config.siteTitle}</title>
    <link>${config.url}</link>
    <description>${config.siteTitle}</description>
${rssItems}
  </channel>
</rss>`;

fs.writeFileSync(path.join(DIST, 'feed.xml'), rss);

console.log(`Built ${posts.length} posts, ${letters.length} letters → ${DIST}/`);
