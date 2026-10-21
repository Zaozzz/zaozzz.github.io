/* Site language: authored copy only; no translation service or network requests. */
(() => {
  'use strict';
  const copy = window.ZAOZ_ZH;
  if (!copy) return;
  const root = document.documentElement;
  const normalize = value => value.replace(/\s+/g, ' ').trim();
  const own = (map, key) => Object.prototype.hasOwnProperty.call(map, key);
  const storageKey = 'zaoz-language';
  const normalizeLanguage = value => value === 'zh' || value === 'zh-CN' ? 'zh' : value === 'en' ? 'en' : null;
  const getLanguage = () => {
    const explicit = normalizeLanguage(new URL(location.href).searchParams.get('lang'));
    if (explicit) return explicit;
    try { return normalizeLanguage(localStorage.getItem(storageKey)) || 'en'; }
    catch (_) { return 'en'; }
  };
  const blocks = [];
  document.querySelectorAll('#bio .prose p, .hero h1, .hero .tagline, .section-title, #news .body, .news-item .body').forEach(el => {
    const key = normalize(el.textContent);
    if (own(copy.blocks, key)) {
      blocks.push({ el, en: el.innerHTML, zh: copy.blocks[key] });
      el.dataset.languageBlock = '';
    }
  });
  const texts = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement.closest('script, style, .language-switch, [data-language-block], .pub-title, .pub-authors')) continue;
    const key = normalize(node.nodeValue);
    if (own(copy.text, key)) {
      const leading = node.nodeValue.match(/^\s*/)[0];
      const trailing = node.nodeValue.match(/\s*$/)[0];
      texts.push({ node, en: node.nodeValue, zh: leading + copy.text[key] + trailing });
    }
  }
  const attributes = [];
  document.querySelectorAll('[aria-label], [alt], [title], meta[content]').forEach(el => {
    for (const name of ['aria-label', 'alt', 'title', 'content']) {
      if (!el.hasAttribute(name)) continue;
      const en = el.getAttribute(name);
      const map = name === 'content' ? { ...copy.meta, ...copy.attributes } : copy.attributes;
      if (own(map, en)) attributes.push({ el, name, en, zh: map[en] });
    }
  });
  // English titles remain the bibliographic source; Chinese is a reading aid.
  document.querySelectorAll('.pub-title').forEach(el => {
    const key = normalize(el.textContent);
    if (!own(copy.papers, key)) return;
    el.setAttribute('lang', 'en');
    const subtitle = document.createElement('p');
    subtitle.className = 'pub-title-zh';
    subtitle.lang = 'zh-CN';
    subtitle.textContent = copy.papers[key];
    el.after(subtitle);
  });
  const originalTitle = document.title;
  const chineseTitle = location.pathname.includes('publications') ? '论文发表 · 王旭'
    : location.pathname.includes('/news') ? '近况 · 王旭'
    : location.pathname.includes('/zaoz') ? originalTitle : '王旭 | 个人学术主页';
  const supportedPaths = new Set(['/', '/index.html', '/publications.html', '/news/', '/news/index.html', '/zaoz/', '/zaoz/index.html']);
  const updateLinks = language => {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      const url = new URL(href, location.href);
      if (url.origin !== location.origin || !supportedPaths.has(url.pathname)) return;
      url.searchParams.set('lang', language);
      link.setAttribute('href', url.pathname + url.search + url.hash);
    });
  };
  let current = getLanguage();
  const toggleLabel = expanded => current === 'zh' ? (expanded ? '收起' : '展开更多') : (expanded ? 'Show less' : 'Show more');
  const apply = (language, updateUrl = false) => {
    current = language;
    root.lang = language === 'zh' ? 'zh-CN' : 'en';
    blocks.forEach(item => { item.el.innerHTML = item[language]; });
    texts.forEach(item => { item.node.nodeValue = item[language]; });
    attributes.forEach(item => { item.el.setAttribute(item.name, item[language]); });
    document.title = language === 'zh' ? chineseTitle : originalTitle;
    document.querySelectorAll('.toggle-btn').forEach(button => {
      const label = document.getElementById(button.id + 'Text');
      if (label) label.textContent = toggleLabel(button.getAttribute('aria-expanded') === 'true');
    });
    document.querySelectorAll('[data-set-language]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.setLanguage === language));
    });
    updateLinks(language);
    try { localStorage.setItem(storageKey, language); } catch (_) { /* Private browsing still supports the URL. */ }
    if (updateUrl) {
      const url = new URL(location.href);
      url.searchParams.set('lang', language);
      history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
    document.dispatchEvent(new CustomEvent('languagechange', { detail: { language } }));
  };
  window.SiteLanguage = { toggleLabel };
  document.querySelectorAll('[data-set-language]').forEach(button => {
    button.addEventListener('click', () => {
      // Keep the reader near the same paragraph even when the two languages differ in length.
      const anchors = [...document.querySelectorAll('.section, .zaoz-chapter, .page-head')];
      const anchor = anchors.reverse().find(el => el.getBoundingClientRect().top <= 100);
      const offset = anchor ? anchor.getBoundingClientRect().top : 0;
      apply(button.dataset.setLanguage, true);
      if (anchor) window.scrollTo({ top: window.scrollY + anchor.getBoundingClientRect().top - offset, behavior: 'instant' });
    });
  });
  window.addEventListener('popstate', () => apply(getLanguage()));
  window.addEventListener('pageshow', event => { if (event.persisted) apply(getLanguage()); });
  apply(current);
  document.querySelectorAll('.language-switch').forEach(el => { el.hidden = false; });
})();
