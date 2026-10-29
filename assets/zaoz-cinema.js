/* A two-chapter product study. Scroll remains native; every scene is readable without motion. */
(() => {
 'use strict';
 const film=document.querySelector('[data-brand-film]');if(!film)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),header=document.querySelector('.brand-header'),scenes=[...film.querySelectorAll('.film-scene')],buttons=[...film.querySelectorAll('[data-film-step]')];
 const copy={
  en:{oneKicker:'01 / DECIDE & ACT',oneTitle:'PersonalOS',oneDescription:'Tasks, projects, learning, money, and health. One personal workspace.',oneLink:'Try PersonalOS',twoKicker:'02 / GAMES & MUSIC',twoTitle:'A little room to play.',twoDescription:'Build an island, explore a small world, or put a record on.',twoLink:'Explore games & music',game:'A Little Island',twoButton:'Games & music',label:'Explore the two sides of ZAOZ'},
  zh:{oneKicker:'01 / 决策与行动',oneTitle:'PersonalOS',oneDescription:'任务、项目、学习、预算与健康，放在同一个个人工作台。',oneLink:'体验 PersonalOS',twoKicker:'02 / 小游戏与音乐',twoTitle:'小游戏与音乐。',twoDescription:'造一座岛，在群岛间走走，或者选一份歌单听。',twoLink:'打开小游戏与音乐',game:'风里的小岛',twoButton:'小游戏与音乐',label:'了解 ZAOZ 的两个方向'}
 };
 let progress=0,raf=0,enabled=false;
 function labels(){const w=copy[document.documentElement.lang.startsWith('zh')?'zh':'en'];film.querySelectorAll('[data-film-copy]').forEach(el=>el.textContent=w[el.dataset.filmCopy]);film.setAttribute('aria-label',w.label);}
 const clamp=x=>Math.max(0,Math.min(1,x));
 const mix=(a,b,t)=>'rgb('+a.map((v,i)=>Math.round(v+(b[i]-v)*t)).join(',')+')';
 function render(){raf=0;if(!enabled)return;const rect=film.getBoundingClientRect(),top=header.getBoundingClientRect().height;film.style.setProperty('--film-top',top+'px');progress=clamp((top-rect.top)/Math.max(1,rect.height-(innerHeight-top)));const p=progress*progress*(3-2*progress);film.style.setProperty('--film-progress',p.toFixed(4));film.style.setProperty('--film-first',(1-clamp((p-.72)/.28)).toFixed(4));film.style.setProperty('--film-second',clamp(p/.32).toFixed(4));film.style.setProperty('--film-copy-first',(1-clamp((p-.2)/.2)).toFixed(4));film.style.setProperty('--film-copy-second',clamp((p-.55)/.2).toFixed(4));film.style.setProperty('--film-bg',mix([240,241,237],[6,47,61],p));film.style.setProperty('--film-text',mix([23,23,23],[246,245,238],p));film.style.setProperty('--film-muted',mix([82,100,108],[187,216,211],p));scenes.forEach((scene,i)=>{scene.inert=(i===0?p>.25:p<.75);});buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===(p<.5?0:1))));}
 function schedule(){if(!raf)raf=requestAnimationFrame(render);}
 function mode(){enabled=!reduced.matches&&document.body.dataset.dawnMotion!=='paused';film.dataset.motion=String(enabled);scenes.forEach(s=>s.inert=false);if(enabled)schedule();else{cancelAnimationFrame(raf);raf=0;film.style.removeProperty('--film-bg');film.style.removeProperty('--film-text');film.style.removeProperty('--film-muted');}}
 buttons.forEach((button,i)=>button.addEventListener('click',()=>{const top=header.getBoundingClientRect().height,start=scrollY+film.getBoundingClientRect().top-top,span=film.offsetHeight-(innerHeight-top);scrollTo({top:start+(i?span:0),behavior:reduced.matches?'instant':'smooth'});}));
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});document.addEventListener('languagechange',labels);reduced.addEventListener('change',mode);new MutationObserver(mode).observe(document.body,{attributes:true,attributeFilter:['data-dawn-motion']});if('ResizeObserver'in window)new ResizeObserver(schedule).observe(header);labels();mode();
})();
