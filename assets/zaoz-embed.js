/* Only embedded demos use this bridge. Standalone apps keep their normal lifecycle. */
(() => {
  'use strict';
  if (window.parent === window || new URLSearchParams(location.search).get('embed') !== '1') return;
  const origin = location.origin;
  let active = false, sequence = 0;
  const frames = new Map();
  const request = window.requestAnimationFrame.bind(window);
  const cancel = window.cancelAnimationFrame.bind(window);
  const state = window.ZAOZEmbed = { active: false };
  // Retain each animation's next callback while off screen, without losing app state.
  function schedule(id, frame) {
    frame.nativeId = request(now => {
      frame.nativeId = null;
      if (!active) return;
      frames.delete(id);
      frame.callback(now);
    });
  }
  window.requestAnimationFrame = callback => {
    const id = ++sequence, frame = { callback, nativeId: null };
    frames.set(id, frame);
    if (active) schedule(id, frame);
    return id;
  };
  window.cancelAnimationFrame = id => {
    const frame = frames.get(id);
    if (frame?.nativeId != null) cancel(frame.nativeId);
    frames.delete(id);
  };
  function setActive(next) {
    next = Boolean(next) && !document.hidden;
    if (next === active) return;
    state.active = active = next;
    document.documentElement.classList.toggle('zaoz-embed-paused', !active);
    if (active) frames.forEach((frame, id) => schedule(id, frame));
    else {
      frames.forEach(frame => { if (frame.nativeId != null) cancel(frame.nativeId); frame.nativeId = null; });
      window.dispatchEvent(new Event('blur'));
      if (document.pointerLockElement) document.exitPointerLock();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
    window.dispatchEvent(new CustomEvent('zaoz:embed-visibility', { detail: { active } }));
  }
  let requested = false;
  window.addEventListener('message', event => {
    if (event.source !== parent || event.origin !== origin || event.data?.type !== 'zaoz:embed-state') return;
    requested = Boolean(event.data.active);
    setActive(requested);
  });
  document.addEventListener('visibilitychange', () => setActive(requested));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !document.querySelector('dialog[open]') && !document.pointerLockElement) {
      parent.postMessage({ type: 'zaoz:embed-escape' }, origin);
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('zaoz-embedded', 'zaoz-embed-paused');
    const style = document.createElement('style');
    style.textContent = '.zaoz-embed-paused *, .zaoz-embed-paused *::before, .zaoz-embed-paused *::after{animation-play-state:paused!important}';
    document.head.append(style);
    parent.postMessage({ type: 'zaoz:embed-ready' }, origin);
  });
})();
