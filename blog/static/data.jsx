// data.jsx — blog content for Xu Wang · Blog
const BIO = {
  name: "Xu Wang",
  nameCn: "王旭",
  seal: "旭",
  role: "Undergraduate student",
  affiliation: "Shandong Jianzhu University",
  greet: "Hi · 你好",
  blurb: "I'm Xu Wang — a student at SDJZU. This is where I write about research and life. Welcome to my corner.",
  blurbCn: "记录科研学习与日常生活 · 欢迎常来",
  links: [
    { label: "wangxu.life", url: "https://wangxu.life" },
    { label: "GitHub", url: "#" },
    { label: "say hi →", url: "#" },
  ],
  highlights: [
    "山东建筑大学",
    "科研 · 生活",
  ],
};

const CATEGORIES = {
  research: { cn: "科研学习", en: "Research",       glyph: "研", color: "var(--pine)",   wash: "var(--pine-wash)"   },
  life:     { cn: "日常生活", en: "Life",           glyph: "日", color: "var(--rust)",   wash: "var(--rust-wash)"   },
};

// 5 visually distinct gifts — different shapes, fills, and colors.
const GIFTS = ["flower", "coffee", "bookmark", "bulb", "applause"];

const POSTS = [
  {
    id: "p001",
    no: "No. 001",
    cat: "life",
    title: "欢迎来到 Blog",
    date: "July 12, 2026",
    readTime: "1 min",
    excerpt: "王旭的博客正式上线了",
    cover: null,
    gifts: { flower: 0, coffee: 1, bookmark: 0, bulb: 0, applause: 0 },
    body: [
      { type: "drop", text: "这是 Blog 的第一篇文章。" },
      { type: "p", text: "这里会记录我的科研学习和生活思考。" },
      { type: "h2", text: "关于这个博客" },
      { type: "p", text: "Blog 是我分享想法的地方，欢迎留言和互动。" },
    ],
  },
  {
    id: "p002",
    no: "No. 002",
    cat: "life",
    title: "我要开始写博客了",
    date: "June 1, 2026",
    readTime: "1 min",
    excerpt: "从今天开始在这里记录生活",
    cover: { motif: "mountain", tint: "rust" },
    gifts: { flower: 0, coffee: 0, bookmark: 0, bulb: 0, applause: 3 },
    body: [{ type: "drop", text: "从今天开始在这里记录生活。" }],
  },
  {
    id: "p003",
    no: "No. 003",
    cat: "life",
    title: "六一快乐",
    date: "June 2, 2026",
    readTime: "1 min",
    excerpt: "希望每天都可以和昭昭这样开心呀",
    cover: { motif: "path", tint: "rust" },
    gifts: { flower: 0, coffee: 0, bookmark: 0, bulb: 0, applause: 5 },
    body: [{ type: "drop", text: "希望每天都可以和昭昭这样开心呀。" }],
  },
  {
    id: "p004",
    no: "No. 004",
    cat: "life",
    title: "去庆祝一下呀",
    date: "June 2, 2026",
    readTime: "1 min",
    excerpt: "完成了一些重要的事情，去汤泉庆祝一下呀",
    cover: { motif: "paper", tint: "rust" },
    gifts: { flower: 0, coffee: 0, bookmark: 0, bulb: 0, applause: 5 },
    body: [{ type: "drop", text: "完成了一些重要的事情，去汤泉庆祝一下呀。" }],
  },
  {
    id: "p005",
    no: "No. 005",
    cat: "life",
    title: "看病日记",
    date: "June 7, 2026",
    readTime: "1 min",
    excerpt: "心情不好去看一下",
    cover: { motif: "attention", tint: "rust" },
    gifts: { flower: 0, coffee: 0, bookmark: 0, bulb: 0, applause: 3 },
    body: [{ type: "drop", text: "心情不好去看一下。" }],
  },
  {
    id: "p006",
    no: "No. 006",
    cat: "life",
    title: "第一次去按摩",
    date: "June 7, 2026",
    readTime: "1 min",
    excerpt: "第一次去 好玩的",
    cover: { motif: "diagram", tint: "rust" },
    gifts: { flower: 0, coffee: 0, bookmark: 0, bulb: 0, applause: 2 },
    body: [{ type: "drop", text: "第一次去，好玩的。" }],
  },
  {
    id: "p007",
    no: "No. 007",
    cat: "life",
    title: "补一下吧",
    date: "June 8, 2026",
    readTime: "1 min",
    excerpt: "去吃捞王猪肚鸡啦",
    cover: { motif: "router", tint: "rust" },
    gifts: { flower: 0, coffee: 0, bookmark: 0, bulb: 0, applause: 2 },
    body: [{ type: "drop", text: "去吃捞王猪肚鸡啦。" }],
  },
  {
    id: "p008",
    no: "No. 008",
    cat: "life",
    title: "在济南呀",
    date: "June 14, 2026",
    readTime: "1 min",
    excerpt: "她来济南找我啦",
    cover: { motif: "code", tint: "rust" },
    gifts: { flower: 0, coffee: 0, bookmark: 0, bulb: 0, applause: 0 },
    body: [{ type: "drop", text: "她来济南找我啦。" }],
  },
  {
    id: "p009",
    no: "No. 009",
    cat: "life",
    title: "趵突泉我们来了",
    date: "June 16, 2026",
    readTime: "1 min",
    excerpt: "趵突泉来了，我们来了",
    cover: { motif: "mountain", tint: "rust" },
    gifts: { flower: 0, coffee: 0, bookmark: 0, bulb: 0, applause: 0 },
    body: [{ type: "drop", text: "趵突泉来了，我们来了。" }],
  },
  {
    id: "p010",
    no: "No. 010",
    cat: "life",
    title: "济南唯三黑珍珠 東渔",
    date: "June 16, 2026",
    readTime: "1 min",
    excerpt: "好吃😋",
    cover: { motif: "path", tint: "rust" },
    gifts: { flower: 0, coffee: 0, bookmark: 0, bulb: 0, applause: 0 },
    body: [{ type: "drop", text: "好吃😋" }],
  },
  {
    id: "p011",
    no: "No. 011",
    cat: "life",
    title: "氛围感！！",
    date: "June 16, 2026",
    readTime: "1 min",
    excerpt: "氛围！！",
    cover: { motif: "paper", tint: "rust" },
    gifts: { flower: 0, coffee: 0, bookmark: 0, bulb: 0, applause: 0 },
    body: [{ type: "drop", text: "氛围！！" }],
  },
];

// Marginalia — comments attached to a highlighted span inside the article body.
const SEED_COMMENTS = [];

// Bottom-of-post comments — top-level, not anchored to any selection.
const SEED_THREAD = {};

Object.assign(window, { BIO, CATEGORIES, GIFTS, POSTS, SEED_COMMENTS, SEED_THREAD });

const staticStore = {
  data: null,
  async load() {
    if (this.data) return this.data;
    const res = await fetch("/blog/data/blog.json", { cache: "no-store" });
    const data = await res.json();
    const localPosts = JSON.parse(localStorage.getItem("blog.local.posts") || "{}");
    const localComments = JSON.parse(localStorage.getItem("blog.local.comments") || "{}");
    data.posts = Object.assign({}, data.posts || {}, localPosts);
    data.comments = Object.assign({}, data.comments || {}, localComments);
    this.data = data;
    return data;
  },
  saveLocalPosts(posts) {
    localStorage.setItem("blog.local.posts", JSON.stringify(posts));
  },
  saveLocalComments(comments) {
    localStorage.setItem("blog.local.comments", JSON.stringify(comments));
  },
};

function sortPosts(posts) {
  return posts.sort((a, b) => {
    const ta = Date.parse(a.publishedAt || a.date || "") || 0;
    const tb = Date.parse(b.publishedAt || b.date || "") || 0;
    return tb - ta;
  });
}

function readTimeFor(blocks) {
  const text = (blocks || []).map(b => b.text || "").join(" ");
  return Math.max(1, Math.ceil(text.length / 500)) + " min";
}

function makeLocalPost(payload, id) {
  const now = new Date();
  return Object.assign({}, payload, {
    id: id || ("local-" + now.getTime().toString(36)),
    no: payload.no || "Local",
    date: payload.date || now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    publishedAt: payload.publishedAt || now.toISOString(),
    readTime: payload.readTime || readTimeFor(payload.body),
    excerpt: payload.excerpt || ((payload.body || []).find(b => b.text)?.text || "").slice(0, 80),
    gifts: payload.gifts || { flower: 0, coffee: 0, bookmark: 0, bulb: 0, applause: 0 },
    status: payload.status || "published",
  });
}

const staticAPI = {
  async get(path) {
    const data = await staticStore.load();
    if (path.startsWith("/posts?")) {
      const params = new URLSearchParams(path.split("?")[1] || "");
      const status = params.get("status") || "published";
      const limit = Number(params.get("limit") || 50);
      let items = Object.values(data.posts || {});
      if (status !== "all") items = items.filter(p => (p.status || "published") === status);
      return { items: sortPosts(items).slice(0, limit) };
    }
    const postMatch = path.match(/^\/posts\/([^/?#]+)$/);
    if (postMatch) return (data.posts || {})[decodeURIComponent(postMatch[1])] || {};
    const commentsMatch = path.match(/^\/comments\/([^/?#]+)$/);
    if (commentsMatch) {
      const postId = decodeURIComponent(commentsMatch[1]);
      return { items: (data.comments && data.comments[postId]) || [] };
    }
    if (path === "/config") {
      return { bio: window.BIO || {}, categories: window.CATEGORIES || {} };
    }
    return {};
  },
  async post(path, body, { nickname } = {}) {
    const data = await staticStore.load();
    if (path === "/admin/login") return { ok: true, token: "static-local-admin" };
    if (path === "/posts") {
      const post = makeLocalPost(body);
      const localPosts = JSON.parse(localStorage.getItem("blog.local.posts") || "{}");
      localPosts[post.id] = post;
      staticStore.saveLocalPosts(localPosts);
      data.posts[post.id] = post;
      return post;
    }
    const commentsMatch = path.match(/^\/comments\/([^/?#]+)$/);
    if (commentsMatch) {
      const postId = decodeURIComponent(commentsMatch[1]);
      const comment = {
        id: "c-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        user: nickname || "Reader",
        text: body.text || "",
        replyTo: body.replyTo || null,
        time: "now",
        avatarColor: "pine",
      };
      const localComments = JSON.parse(localStorage.getItem("blog.local.comments") || "{}");
      localComments[postId] = [...(localComments[postId] || []), comment];
      staticStore.saveLocalComments(localComments);
      if (!data.comments) data.comments = {};
      data.comments[postId] = [...(data.comments[postId] || []), comment];
      return comment;
    }
    return { ok: true };
  },
  async patch(path, body) {
    return Object.assign({ ok: true }, body || {});
  },
  async put(path, body) {
    const data = await staticStore.load();
    const postMatch = path.match(/^\/posts\/([^/?#]+)$/);
    if (!postMatch) return { ok: true };
    const id = decodeURIComponent(postMatch[1]);
    const post = makeLocalPost(body, id);
    const localPosts = JSON.parse(localStorage.getItem("blog.local.posts") || "{}");
    localPosts[id] = post;
    staticStore.saveLocalPosts(localPosts);
    data.posts[id] = post;
    return post;
  },
  async del(path) {
    const data = await staticStore.load();
    const postMatch = path.match(/^\/posts\/([^/?#]+)$/);
    if (postMatch) {
      const id = decodeURIComponent(postMatch[1]);
      const localPosts = JSON.parse(localStorage.getItem("blog.local.posts") || "{}");
      localPosts[id] = Object.assign({}, data.posts[id] || {}, { status: "deleted" });
      staticStore.saveLocalPosts(localPosts);
      if (data.posts[id]) data.posts[id].status = "deleted";
    }
    return { json: async () => ({ ok: true }) };
  },
};

const API = {
  get: (path) => window.STATIC_SITE ? staticAPI.get(path) : fetch(window.API_BASE + path).then(r => {
    if (!r.ok) throw new Error("API unavailable");
    return r.json();
  }).catch(() => staticAPI.get(path)),
  post: (path, body, opts = {}) => {
    if (window.STATIC_SITE) return staticAPI.post(path, body, opts);
    const h = { 'Content-Type': 'application/json' };
    if (opts.token) h['Authorization'] = 'Bearer ' + opts.token;
    if (opts.nickname) h['X-Nickname'] = opts.nickname;
    return fetch(window.API_BASE + path, { method: 'POST', headers: h, body: JSON.stringify(body) })
      .then(r => { if (!r.ok) throw new Error("API unavailable"); return r.json(); })
      .catch(() => staticAPI.post(path, body, opts));
  },
  patch: (path, body, opts = {}) => {
    if (window.STATIC_SITE) return staticAPI.patch(path, body, opts);
    const h = { 'Content-Type': 'application/json' };
    if (opts.token) h['Authorization'] = 'Bearer ' + opts.token;
    if (opts.nickname) h['X-Nickname'] = opts.nickname;
    return fetch(window.API_BASE + path, { method: 'PATCH', headers: h, body: JSON.stringify(body) })
      .then(r => { if (!r.ok) throw new Error("API unavailable"); return r.json(); })
      .catch(() => staticAPI.patch(path, body, opts));
  },
  put: (path, body, opts = {}) => {
    if (window.STATIC_SITE) return staticAPI.put(path, body, opts);
    const h = { 'Content-Type': 'application/json' };
    if (opts.token) h['Authorization'] = 'Bearer ' + opts.token;
    if (opts.nickname) h['X-Nickname'] = opts.nickname;
    return fetch(window.API_BASE + path, { method: 'PUT', headers: h, body: JSON.stringify(body) })
      .then(r => { if (!r.ok) throw new Error("API unavailable"); return r.json(); })
      .catch(() => staticAPI.put(path, body, opts));
  },
  del: (path, opts = {}) => {
    if (window.STATIC_SITE) return staticAPI.del(path, opts);
    const h = {};
    if (opts.token) h['Authorization'] = 'Bearer ' + opts.token;
    return fetch(window.API_BASE + path, { method: 'DELETE', headers: h })
      .then(r => { if (!r.ok) throw new Error("API unavailable"); return r; })
      .catch(() => staticAPI.del(path, opts));
  },
};
Object.assign(window, { API });
