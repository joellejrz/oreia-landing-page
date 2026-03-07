const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const POSTS_DIR = path.join(__dirname, 'content', 'posts');
const BLOG_DIR = path.join(__dirname, 'blog');

marked.setOptions({
  gfm: true,
  breaks: true,
});

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function slugFromFilename(filename) {
  return filename.replace(/\.md$/, '');
}

function readAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  return files.map(file => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { data, content } = matter(raw);
    return {
      slug: slugFromFilename(file),
      title: data.title || 'Untitled',
      description: data.description || '',
      date: data.date || '2026-01-01',
      category: data.category || 'General',
      readingTime: data.readingTime || Math.ceil(content.split(/\s+/).length / 230),
      content,
      html: marked(content),
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function postTemplate(post, allPosts) {
  const related = allPosts
    .filter(p => p.slug !== post.slug && p.category === post.category)
    .slice(0, 2);

  const relatedHTML = related.length > 0 ? `
      <section class="blog-related">
        <h3>Keep reading</h3>
        <div class="blog-related-grid">
          ${related.map(r => `
          <a href="/blog/${r.slug}/" class="blog-related-card">
            <span class="blog-card-category">${r.category}</span>
            <h4>${r.title}</h4>
            <p>${r.description}</p>
          </a>`).join('')}
        </div>
      </section>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title} — Oracle Blog</title>
  <meta name="description" content="${post.description}">
  <meta property="og:title" content="${post.title}">
  <meta property="og:description" content="${post.description}">
  <meta property="og:type" content="article">
  <link rel="icon" href="/assets/logo.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css">
  <link rel="stylesheet" href="/legal.css">
  <link rel="stylesheet" href="/blog.css">
</head>
<body>
  <canvas id="particles"></canvas>

  <nav class="nav scrolled">
    <div class="nav-inner">
      <a href="/" class="nav-brand">
        <img src="/assets/logo.png" alt="Oracle" class="nav-logo">
        <span class="nav-name">Oracle</span>
      </a>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/blog/" class="nav-active">Blog</a>
        <a href="/resources.html">Resources</a>
        <a href="https://app.oraclethejournal.com" class="btn btn-sm" target="_blank" rel="noopener">Open App</a>
      </div>
      <button class="nav-toggle" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <div class="mobile-menu">
    <a href="/">Home</a>
    <a href="/blog/">Blog</a>
    <a href="/resources.html">Resources</a>
    <a href="https://app.oraclethejournal.com" class="btn" target="_blank" rel="noopener">Open App</a>
  </div>

  <main class="legal-page">
    <article class="blog-article">

      <div class="blog-article-header">
        <a href="/blog/" class="blog-back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          All Posts
        </a>
        <span class="blog-card-category">${post.category}</span>
        <h1>${post.title}</h1>
        <div class="blog-article-meta">
          <time>${formatDate(post.date)}</time>
          <span class="meta-sep">&middot;</span>
          <span>${post.readingTime} min read</span>
        </div>
      </div>

      <div class="blog-affiliate-notice">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        This article may contain affiliate links. If you purchase through them, we earn a small commission at no extra cost to you. <a href="/resources.html">Learn more.</a>
      </div>

      <div class="blog-article-body">
        ${post.html}
      </div>

      <div class="blog-newsletter">
        <h3>Subscribe for weekly insights from the unconscious.</h3>
        <p>Dream analysis, shadow work prompts, and archetype deep-dives — delivered to your inbox.</p>
        <form class="blog-newsletter-form" onsubmit="event.preventDefault(); this.querySelector('.blog-newsletter-btn').textContent = 'Coming Soon!'; this.querySelector('.blog-newsletter-btn').disabled = true;">
          <input type="email" placeholder="Your email address" class="blog-newsletter-input" required>
          <button type="submit" class="btn btn-primary blog-newsletter-btn">Subscribe</button>
        </form>
        <p class="blog-newsletter-note">No spam. Unsubscribe anytime. We don't track you (obviously).</p>
      </div>

      ${relatedHTML}

      <div class="blog-cta-box">
        <img src="/assets/logo.png" alt="" class="blog-cta-logo" aria-hidden="true">
        <h3>Ready to start your inner work?</h3>
        <p>Oracle combines CBT, Jungian archetypes, and local AI into a private journal that never leaves your device.</p>
        <a href="https://app.oraclethejournal.com" class="btn btn-primary" target="_blank" rel="noopener">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Get Started with Oracle
        </a>
      </div>

    </article>
  </main>

  <footer class="footer">
    <div class="section-container">
      <div class="footer-bottom">
        <p>&copy; 2026 Oracle The Journal. All rights reserved.</p>
        <p class="footer-privacy-note">We collect zero personal data. <a href="/encryption.html">Verify our claims.</a></p>
      </div>
    </div>
  </footer>

  <script src="/script.js"></script>
</body>
</html>`;
}

function indexTemplate(posts) {
  const categories = ['All', ...new Set(posts.map(p => p.category))];

  const categoryPills = categories.map(cat =>
    `<button class="blog-filter-pill${cat === 'All' ? ' active' : ''}" data-category="${cat}">${cat}</button>`
  ).join('\n          ');

  const postCards = posts.map(post => `
        <a href="/blog/${post.slug}/" class="blog-card" data-category="${post.category}" data-tilt data-tilt-intensity="5">
          <div class="blog-card-inner">
            <span class="blog-card-category">${post.category}</span>
            <h3>${post.title}</h3>
            <p>${post.description}</p>
            <div class="blog-card-footer">
              <time>${formatDate(post.date)}</time>
              <span>${post.readingTime} min read</span>
            </div>
          </div>
        </a>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog — Oracle The Journal</title>
  <meta name="description" content="Insights on shadow work, dream interpretation, Jungian psychology, and building a private AI journal. By Oracle.">
  <link rel="icon" href="/assets/logo.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css">
  <link rel="stylesheet" href="/blog.css">
</head>
<body>
  <canvas id="particles"></canvas>

  <nav class="nav scrolled">
    <div class="nav-inner">
      <a href="/" class="nav-brand">
        <img src="/assets/logo.png" alt="Oracle" class="nav-logo">
        <span class="nav-name">Oracle</span>
      </a>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/blog/" class="nav-active">Blog</a>
        <a href="/resources.html">Resources</a>
        <a href="https://app.oraclethejournal.com" class="btn btn-sm" target="_blank" rel="noopener">Open App</a>
      </div>
      <button class="nav-toggle" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <div class="mobile-menu">
    <a href="/">Home</a>
    <a href="/blog/">Blog</a>
    <a href="/resources.html">Resources</a>
    <a href="https://app.oraclethejournal.com" class="btn" target="_blank" rel="noopener">Open App</a>
  </div>

  <main class="blog-page">
    <div class="blog-container">

      <div class="blog-hero">
        <span class="section-tag">From the Vault</span>
        <h1>A Blog by <span class="gradient-text">Oracle.</span></h1>
        <p class="blog-hero-sub">Shadow work, dream interpretation, Jungian psychology, and the architecture of privacy. Insights from the unconscious.</p>
      </div>

      <div class="blog-filters">
        <div class="blog-filter-pills">
          ${categoryPills}
        </div>
      </div>

      <div class="blog-grid">
        ${postCards}
      </div>

      <div class="blog-index-newsletter">
        <h3>Get insights delivered.</h3>
        <p>Weekly essays on the unconscious, dream patterns, and building a life of self-awareness.</p>
        <form class="blog-newsletter-form" onsubmit="event.preventDefault(); this.querySelector('.blog-newsletter-btn').textContent = 'Coming Soon!'; this.querySelector('.blog-newsletter-btn').disabled = true;">
          <input type="email" placeholder="Your email address" class="blog-newsletter-input" required>
          <button type="submit" class="btn btn-primary blog-newsletter-btn">Subscribe</button>
        </form>
        <p class="blog-newsletter-note">No spam. Unsubscribe anytime. We don't track you (obviously).</p>
      </div>

    </div>
  </main>

  <footer class="footer">
    <div class="section-container">
      <div class="footer-bottom">
        <p>&copy; 2026 Oracle The Journal. All rights reserved.</p>
        <p class="footer-privacy-note">We collect zero personal data. <a href="/encryption.html">Verify our claims.</a></p>
      </div>
    </div>
  </footer>

  <script src="/script.js"></script>
  <script>
    document.querySelectorAll('.blog-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.blog-filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const cat = pill.dataset.category;
        document.querySelectorAll('.blog-card').forEach(card => {
          card.style.display = (cat === 'All' || card.dataset.category === cat) ? '' : 'none';
        });
      });
    });
  </script>
</body>
</html>`;
}

// Build
console.log('Building blog...');
const posts = readAllPosts();
console.log(`Found ${posts.length} posts`);

if (fs.existsSync(BLOG_DIR)) {
  fs.rmSync(BLOG_DIR, { recursive: true });
}
fs.mkdirSync(BLOG_DIR, { recursive: true });

// Generate individual post pages
posts.forEach(post => {
  const postDir = path.join(BLOG_DIR, post.slug);
  fs.mkdirSync(postDir, { recursive: true });
  fs.writeFileSync(path.join(postDir, 'index.html'), postTemplate(post, posts));
  console.log(`  -> blog/${post.slug}/index.html`);
});

// Generate index page
fs.writeFileSync(path.join(BLOG_DIR, 'index.html'), indexTemplate(posts));
console.log('  -> blog/index.html');

console.log('Blog build complete!');
