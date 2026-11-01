/* Reuse existing controls and handlers; never reset or rewrite stored user work. */
(() => {
  'use strict';
  function simplify() {
    const app = document.body.dataset.demoApp;
    if (app === 'wind-island') {
      const actions = document.querySelector('.dock-actions');
      if (actions) ['new-island', 'camera-home'].forEach(id => {
        const control = document.getElementById(id);
        if (control) actions.append(control);
      });
    }
    const labels = {
      aurelia: { start: '开始游戏' },
      'aurelia-v3': { start: '开始游戏' },
      'gravity-echo': { start: '开始游戏', resume: '继续游戏', again: '再玩一次', 'pause-title': '已暂停' },
      'marble-orchestra': { start: '开始演奏' }
    }[app];
    if (labels) Object.entries(labels).forEach(([id, label]) => {
      const control = document.getElementById(id);
      if (control) control.textContent = label;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', simplify, { once: true });
  else simplify();
})();
