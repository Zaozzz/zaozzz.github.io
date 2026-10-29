/* The user's selected playlists, played only through NetEase's official embed. */
(() => {
  'use strict';
  const room = document.querySelector('[data-music]');
  if (!room) return;
  const catalog = [
    { id: '2804037354', key: 'live', zh: '高考结束后，一起去看场 Live 吧', en: "Let's go to a live concert after the Gaokao", created: '2019.05.18', category: { zh: '现场与乐队', en: 'Live & bands' } },
    { id: '2721877134', key: 'poetry', zh: '人间不值得，黄诗扶值得', en: "If life isn't worth it, Huang Shifu is.", created: '2019.03.23', category: { zh: '黄诗扶', en: 'Huang Shifu' } },
    { id: '2984639566', key: 'summer', zh: '2018 年的夏天，除了热，一切都好', en: "Summer '18: perfect in every way but the heat", created: '2019.09.14', category: { zh: '夏日旧歌', en: 'Summer memories' } }
  ];
  const words = {
    zh: { heading: '听一会儿。', intro: '从我整理的歌单里，选了这三份。', eyebrow: '音乐', selection: '精选歌单', original: '在网易云打开', open: '打开播放器', close: '收起播放器', initial: '使用网易云官方播放器。打开后，点击播放即可。', loading: '正在打开网易云播放器…', loaded: '播放器已打开，请点击播放。', stopped: '播放器已收起。', away: '已停止。重新打开播放器即可听。', failed: '播放器暂未响应，可以重试或在网易云打开。', note: '部分曲目可能需要网易云登录或会员，播放范围由平台决定。', created: '创建于', cover: '歌单封面', frame: '网易云音乐歌单播放器', player: '官方播放器', retry: '重新打开播放器' },
    en: { heading: 'Put a record on.', intro: 'Three selections from my own playlists.', eyebrow: 'Music', selection: 'Selected playlists', original: 'Open in NetEase', open: 'Open player', close: 'Close player', initial: 'Uses the official NetEase player. Open it, then press play.', loading: 'Opening the NetEase player…', loaded: 'Player opened. Press play to listen.', stopped: 'Player closed.', away: 'Stopped. Open the player to listen again.', failed: 'The player has not responded. Retry or open in NetEase.', note: 'Some tracks may require a NetEase account or membership. Availability is set by the platform.', created: 'Created', cover: 'playlist cover', frame: 'NetEase Music playlist player', player: 'Official player', retry: 'Reopen player' }
  };
  const pick = selector => room.querySelector(selector);
  const buttons = [...room.querySelectorAll('[data-music-pick]')];
  const mount = pick('[data-music-player]');
  const cover = pick('[data-music-cover]');
  const record = pick('.music-record');
  record.prepend(mount);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const open = pick('[data-music-open]');
  let selected = catalog[0], frame = null, timer = null, phase = 'initial', swapAnimation = null, manuallyClosed = false;
  const lang = () => document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
  const title = item => item[lang()];
  const href = item => 'https://music.163.com/#/playlist?id=' + item.id;

  function labels() {
    const locale = lang(), w = words[locale];
    room.dataset.musicPhase = phase;
    room.querySelectorAll('[data-music-copy]').forEach(el => { el.textContent = w[el.dataset.musicCopy] || ''; });
    pick('[data-music-title]').textContent = title(selected);
    pick('[data-music-category]').textContent = selected.category[locale];
    pick('[data-music-date]').textContent = w.created + ' ' + selected.created;
    cover.alt = title(selected) + ' · ' + w.cover;
    pick('[data-music-original]').href = href(selected);
    pick('[data-music-status]').textContent = w[phase];
    open.querySelector('[data-music-open-label]').textContent = frame ? w.close : (phase === 'failed' ? w.retry : w.open);
    open.setAttribute('aria-expanded', String(Boolean(frame)));
    buttons.forEach((button, i) => {
      const item = catalog[i];
      button.setAttribute('aria-pressed', String(item.id === selected.id));
      button.querySelector('[data-music-list-title]').textContent = title(item);
      button.querySelector('[data-music-list-kind]').textContent = item.category[locale];
      button.querySelector('img').alt = '';
      button.querySelector('img').setAttribute('aria-hidden', 'true');
    });
    if (frame) frame.title = w.frame + ' · ' + title(selected);
  }
  function stop(reason = 'stopped') {
    clearTimeout(timer);
    const hadFrame = Boolean(frame);
    frame?.remove();
    frame = null;
    mount.hidden = true;
    room.dataset.musicState = 'closed';
    phase = reason;
    labels();
    if (hadFrame) room.dispatchEvent(new CustomEvent('zaoz:music-player', { bubbles: true, detail: { mounted: false, playlist: selected.id, reason } }));
  }
  function select(id) {
    const item = catalog.find(entry => entry.id === id || entry.key === id);
    if (!item || item === selected) return;
    stop('initial');
    selected = item;
    cover.src = '/assets/optimized/playlists/' + item.id + '.jpg';
    room.dataset.musicSelection = item.key;
    labels();
    swapAnimation?.cancel();
    if (!reduced.matches && record.animate) {
      swapAnimation = record.animate([{ opacity: .22 }, { opacity: 1 }], { duration: 280, easing: 'ease-out' });
    }
    manuallyClosed = false;
    load(false);
    room.dispatchEvent(new CustomEvent('zaoz:music-change', { bubbles: true, detail: { playlist: item.id } }));
  }
  function load(reveal = true) {
    if (frame) { stop(); return; }
    const w = words[lang()];
    phase = 'loading';
    mount.hidden = false;
    room.dataset.musicState = 'loading';
    frame = document.createElement('iframe');
    frame.src = 'https://music.163.com/outchain/player?type=0&id=' + selected.id + '&auto=0&height=430';
    frame.title = w.frame + ' · ' + title(selected);
    frame.allow = 'autoplay; encrypted-media';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.setAttribute('loading', 'eager');
    const current = frame;
    frame.addEventListener('load', () => {
      if (current !== frame) return;
      clearTimeout(timer);
      phase = 'loaded';
      room.dataset.musicState = 'open';
      labels();
    });
    frame.addEventListener('error', () => {
      if (current === frame) stop('failed');
    });
    mount.append(frame);
    requestAnimationFrame(() => {
      if (reveal !== false && current === frame) mount.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
    timer = setTimeout(() => { if (current === frame) stop('failed'); }, 22000);
    labels();
    room.dispatchEvent(new CustomEvent('zaoz:music-player', { bubbles: true, detail: { mounted: true, playlist: selected.id } }));
  }
  buttons.forEach((button, i) => {
    button.addEventListener('click', () => select(catalog[i].id));
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (i + 1) % buttons.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (i - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next !== undefined) { event.preventDefault(); buttons[next].focus(); select(catalog[next].id); }
    });
  });
  open.addEventListener('click', () => { manuallyClosed = Boolean(frame); load(); });
  document.addEventListener('languagechange', labels);
  reduced.addEventListener('change', () => { if (reduced.matches) swapAnimation?.cancel(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && frame) stop('away'); });
  window.addEventListener('pagehide', () => stop('away'));
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement && !room.contains(document.fullscreenElement) && frame) stop('away');
  });
  // The site's fallback expansion is not a native fullscreen event.
  document.addEventListener('click', event => {
    if (frame && event.target.closest('[data-expand]')) stop('away');
  }, true);
  // Observe the whole room, including the open player, so scrolling to its controls
  // never removes the player. It is removed only after the entire room leaves view.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !frame && !manuallyClosed && !document.hidden) load(false);
      else if (!entries[0].isIntersecting && frame) stop('away');
    }, { threshold: 0, rootMargin: '180px 0px' });
    observer.observe(room);
  }
  window.ZAOZMusic = Object.freeze({
    pauseAll: () => stop('away'),
    select,
    getState: () => ({ playlist: selected.id, mounted: Boolean(frame), phase })
  });
  labels();
})();
