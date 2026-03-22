/* =============================================================
   blog.js — WordPress REST API integration for Jobdrift

   TO CONFIGURE: set WP_CONFIG.apiUrl to your WordPress URL.
   e.g. 'https://blog.jobdrift.io/wp-json/wp/v2'

   Leave it empty ('') to show demo placeholder content.
============================================================= */
const WP_CONFIG = {
  apiUrl: '', // ← paste your WordPress API URL here
  postsPerPage: 9,
};

// ── Utilities ────────────────────────────────────────────────

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').replace(/\[&hellip;\]/g, '').trim();
}

function getExcerpt(post, maxLen = 130) {
  const text = stripHtml(post.excerpt?.rendered || '');
  return text.length > maxLen ? text.slice(0, maxLen).replace(/\s\S*$/, '') + '…' : text;
}

function getFeaturedImage(post) {
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
}

function getCategories(post) {
  return post._embedded?.['wp:term']?.[0] || [];
}

function postUrl(post) {
  return `blog-post.html?slug=${post.slug}`;
}

// ── Fetch helpers ────────────────────────────────────────────

async function fetchPosts({ perPage = 3, page = 1, categoryId = null, excludeId = null } = {}) {
  if (!WP_CONFIG.apiUrl) {
    let posts = DEMO_POSTS;
    if (categoryId) posts = posts.filter(p => getCategories(p).some(c => c.id === categoryId));
    if (excludeId)  posts = posts.filter(p => p.id !== excludeId);
    const start = (page - 1) * perPage;
    return {
      posts: posts.slice(start, start + perPage),
      total: posts.length,
      totalPages: Math.ceil(posts.length / perPage),
    };
  }
  const params = new URLSearchParams({ per_page: perPage, page, _embed: 1, orderby: 'date', order: 'desc' });
  if (categoryId) params.set('categories', categoryId);
  if (excludeId)  params.set('exclude', excludeId);
  const res = await fetch(`${WP_CONFIG.apiUrl}/posts?${params}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return {
    posts: await res.json(),
    total: parseInt(res.headers.get('X-WP-Total') || '0'),
    totalPages: parseInt(res.headers.get('X-WP-TotalPages') || '1'),
  };
}

async function fetchPostBySlug(slug) {
  if (!WP_CONFIG.apiUrl) return DEMO_POSTS.find(p => p.slug === slug) || DEMO_POSTS[0];
  const res = await fetch(`${WP_CONFIG.apiUrl}/posts?slug=${slug}&_embed=1`);
  if (!res.ok) throw new Error('Post not found');
  const posts = await res.json();
  return posts[0] || null;
}

// ── Card renderer ────────────────────────────────────────────

function renderCard(post) {
  const img  = getFeaturedImage(post);
  const cats = getCategories(post);
  const cat  = cats[0];
  return `
    <article class="blog-card" data-reveal>
      <a href="${postUrl(post)}" class="blog-card-img-wrap" tabindex="-1" aria-hidden="true">
        ${img
          ? `<img src="${img}" alt="${post.title.rendered}" class="blog-card-img" loading="lazy" />`
          : `<div class="blog-card-img blog-card-img-placeholder"></div>`}
        <div class="blog-card-img-overlay"></div>
      </a>
      <div class="blog-card-body">
        ${cat ? `<span class="blog-cat">${cat.name}</span>` : ''}
        <h3 class="blog-card-title">
          <a href="${postUrl(post)}">${post.title.rendered}</a>
        </h3>
        <p class="blog-card-excerpt">${getExcerpt(post)}</p>
        <div class="blog-card-meta">
          <time datetime="${post.date}">${formatDate(post.date)}</time>
          <a href="${postUrl(post)}" class="blog-card-read">Read more →</a>
        </div>
      </div>
    </article>`;
}

// ── Skeleton cards ───────────────────────────────────────────

function skeletonCards(n = 3) {
  return Array.from({ length: n }, () => `
    <div class="blog-card blog-skeleton">
      <div class="blog-card-img-wrap"><div class="blog-card-img skel-block"></div></div>
      <div class="blog-card-body">
        <div class="skel-line" style="width:30%;height:13px;margin-bottom:14px"></div>
        <div class="skel-line" style="width:90%;height:18px;margin-bottom:6px"></div>
        <div class="skel-line" style="width:70%;height:18px;margin-bottom:16px"></div>
        <div class="skel-line" style="width:100%;height:13px;margin-bottom:6px"></div>
        <div class="skel-line" style="width:80%;height:13px;margin-bottom:20px"></div>
        <div class="skel-line" style="width:40%;height:13px"></div>
      </div>
    </div>`).join('');
}

// ── Trigger scroll-reveal on injected cards ──────────────────

function revealCards() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => observer.observe(el));
}

// ── Demo content (shown when WP_CONFIG.apiUrl is empty) ──────

const DEMO_POSTS = [
  {
    id: 1, slug: 'how-to-find-freelance-clients',
    title: { rendered: 'How to Find Your First Freelance Clients in 2026' },
    excerpt: { rendered: '<p>Landing your first freelance client can feel overwhelming. Here are the proven strategies that actually work in today\'s market.</p>' },
    date: '2026-03-10T10:00:00',
    content: { rendered: '<p>Starting your freelance journey is exciting but challenging. The key is to focus on building relationships rather than just sending cold pitches.</p><p>Start with your existing network. Let everyone know you\'re available for freelance work. Former colleagues, classmates, and even friends can be your first clients or refer you to someone who needs your skills.</p><p>Next, pick 2–3 platforms and become excellent on them rather than spreading yourself thin across 10. Whether it\'s Upwork, Toptal, or niche job boards, consistency and a quality profile matter more than quantity.</p><p>Finally, don\'t underestimate the power of content. Writing about your craft — tutorials, case studies, breakdowns — positions you as an expert and brings clients to you.</p>' },
    _embedded: { 'wp:term': [[{ id: 1, name: 'Freelancing Tips', slug: 'freelancing-tips' }]] },
  },
  {
    id: 2, slug: 'setting-freelance-rates',
    title: { rendered: 'Setting Your Freelance Rates: The Complete 2026 Guide' },
    excerpt: { rendered: '<p>Pricing your work is one of the hardest parts of freelancing. Learn how to set rates that reflect your value without scaring away clients.</p>' },
    date: '2026-03-05T10:00:00',
    content: { rendered: '<p>The biggest mistake freelancers make is underpricing their work. This is often driven by fear — fear that clients won\'t pay more, fear of rejection, fear of comparison.</p><p>Here\'s the truth: clients who only care about the lowest price are rarely the best clients. They\'re often the most demanding, slowest to pay, and least satisfying to work with.</p><p>To set your rate, start with your target annual income, divide by billable hours (typically 1,000–1,200 for full-time freelancers), and add 30% for taxes, benefits, and downtime. This gives you your floor rate — what you must charge to survive. Your actual rate should sit above this floor, reflecting your expertise and the value you deliver.</p>' },
    _embedded: { 'wp:term': [[{ id: 1, name: 'Freelancing Tips', slug: 'freelancing-tips' }]] },
  },
  {
    id: 3, slug: 'best-platforms-for-freelancers',
    title: { rendered: 'The Best Job Platforms for Freelancers in 2026' },
    excerpt: { rendered: '<p>Not all freelance platforms are created equal. We\'ve tested dozens so you don\'t have to — here\'s where to spend your time.</p>' },
    date: '2026-02-28T10:00:00',
    content: { rendered: '<p>The freelance job platform landscape has changed dramatically. Some platforms that were gold mines two years ago are now saturated or race-to-the-bottom markets.</p><p>For designers and developers, Toptal and Gun.io focus on quality over volume — harder to get into, but the rates are dramatically better. For writers and marketers, Contently and ClearVoice let you build a portfolio and have brands approach you.</p><p>For general work, Upwork still dominates sheer volume, but success requires a strategic profile and targeted proposals. Filter by project budget and focus on clients who already have review history.</p>' },
    _embedded: { 'wp:term': [[{ id: 2, name: 'Platform Reviews', slug: 'platform-reviews' }]] },
  },
  {
    id: 4, slug: 'freelance-productivity-tips',
    title: { rendered: '10 Productivity Habits Every Freelancer Needs' },
    excerpt: { rendered: '<p>Working for yourself is liberating, but without structure it\'s easy to drift. These habits keep top freelancers productive and profitable.</p>' },
    date: '2026-02-20T10:00:00',
    content: { rendered: '<p>Productivity as a freelancer is fundamentally different from productivity as an employee. Nobody is watching the clock. The only thing that matters is output.</p><p>Time blocking is the single most impactful habit. Dedicate specific blocks to deep work — no notifications, no meetings — and protect them like appointments with your best client.</p><p>Track your time even if you charge project-based fees. Understanding where your hours go reveals what work is actually profitable and what drains your energy without proportional reward.</p>' },
    _embedded: { 'wp:term': [[{ id: 3, name: 'Productivity', slug: 'productivity' }]] },
  },
  {
    id: 5, slug: 'freelance-contract-essentials',
    title: { rendered: 'Freelance Contract Essentials: Protect Yourself in 2026' },
    excerpt: { rendered: '<p>A good contract isn\'t just legal protection — it sets expectations and makes projects run smoothly. Here\'s what every freelance contract needs.</p>' },
    date: '2026-02-12T10:00:00',
    content: { rendered: '<p>Freelancers who skip contracts are playing a dangerous game. Even with trusted clients, a written agreement prevents the misunderstandings that destroy good working relationships.</p><p>At minimum your contract needs: scope of work (detailed, specific), payment terms (amounts, due dates, late fees), revision policy, IP ownership transfer upon final payment, and a termination clause for both parties.</p><p>Don\'t copy a template blindly — customize it to your work. The specifics matter, and vague language always benefits the person who wants to avoid paying.</p>' },
    _embedded: { 'wp:term': [[{ id: 4, name: 'Business & Legal', slug: 'business-legal' }]] },
  },
  {
    id: 6, slug: 'managing-multiple-clients',
    title: { rendered: 'Managing Multiple Freelance Clients Without Burning Out' },
    excerpt: { rendered: '<p>Juggling several clients is the reality of successful freelancing. Learn how to manage capacity, set boundaries, and stay sane.</p>' },
    date: '2026-02-05T10:00:00',
    content: { rendered: '<p>The dream is a full client roster. The reality can be overwhelming. Managing multiple clients requires systems, not just effort.</p><p>Start with a capacity limit. Know your maximum sustainable workload and don\'t exceed it, even for good money. Burnout costs you weeks, not days, and quality suffers before you even notice it.</p><p>Use a simple project tracker — even a spreadsheet — to see all projects, their deadlines, and their status at a glance. When everything is in your head, things fall through the cracks.</p>' },
    _embedded: { 'wp:term': [[{ id: 3, name: 'Productivity', slug: 'productivity' }]] },
  },
];
