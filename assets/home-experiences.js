/* Enhance existing, translated catalogs. Original links remain the no-JavaScript fallback. */
(() => {
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const zh=()=>document.documentElement.lang.startsWith('zh');
 const say=(cn,en)=>zh()?cn:en;
 const make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text)el.textContent=text;return el;};
 const button=(cls)=>{const el=make('button',cls);el.type='button';return el;};
 const animate=(node,direction=1)=>{node.getAnimations().forEach(a=>a.cancel());if(!reduced.matches)node.animate([{opacity:.4,transform:`translateX(${direction*18}px)`},{opacity:1,transform:'translateX(0)'}],{duration:360,easing:'cubic-bezier(.25,.8,.25,1)'});};
 let stopMusic=()=>{},stopDemo=()=>{},musicMounted=()=>false;
 const musicSection=document.getElementById('playlists'),source=musicSection?.querySelector('.playlist-list');
 if(source){
  const items=[...source.children].map(row=>({row,id:row.querySelector('a').href.match(/id=(\d+)/)?.[1],a:row.querySelector('a'),img:row.querySelector('img'),plays:row.querySelector('.level'),date:row.querySelector('.playlist-created')})).filter(x=>x.id);
  if(items.length){
   const room=make('div','home-media home-listen');room.dataset.homeMusic='';
   room.innerHTML='<div class="home-record"><div class="home-music-player" id="home-music-player" hidden></div><div class="home-listen-controls"><button type="button" class="home-play-button" aria-expanded="false" aria-controls="home-music-player"></button><a class="home-original" target="_blank" rel="noopener noreferrer"></a></div><p class="home-music-status" role="status" aria-live="polite"></p></div><div class="home-playlist-choices" role="group"></div>';
   const q=s=>room.querySelector(s),choices=q('.home-playlist-choices'),record=q('.home-record'),mount=q('.home-music-player'),open=q('.home-play-button');
   let selected=0,frame=null,timer=0,phase='idle',userClosed=false;
   const buttons=items.map((item,i)=>{const b=button('home-playlist-choice');b.innerHTML='<img alt=""><span class="home-choice-copy"><span class="home-choice-title"></span><span class="home-choice-detail"></span></span><span class="home-choice-dot" aria-hidden="true"></span>';b.querySelector('img').src=item.img.src;b.querySelector('img').loading='lazy';b.addEventListener('click',()=>select(i));b.addEventListener('keydown',e=>{let n;if(['ArrowDown','ArrowRight'].includes(e.key))n=(i+1)%items.length;if(['ArrowUp','ArrowLeft'].includes(e.key))n=(i+items.length-1)%items.length;if(e.key==='Home')n=0;if(e.key==='End')n=items.length-1;if(n!==undefined){e.preventDefault();buttons[n].focus();select(n);}});choices.append(b);return b;});
   function labels(){
    const item=items[selected];room.dataset.playlist=item.id;room.dataset.musicState=phase;
    q('.home-original').href=item.a.href;q('.home-original').textContent=say('网易云 ↗','NetEase ↗');open.textContent=frame?say('关闭播放器','Close player'):say('打开播放器','Open player');open.setAttribute('aria-expanded',String(!!frame));
    const status={idle:say('选择歌单，打开后点击播放。','Choose a playlist, then press play in the player.'),loading:say('正在打开播放器…','Opening player…'),ready:say('请在播放器中点击播放。','Press play in the player.'),closed:say('播放器已关闭。','Player closed.'),error:say('播放器未能载入，可重试或在网易云打开。','Player unavailable. Try again or open NetEase.')};q('.home-music-status').textContent=status[phase];choices.setAttribute('aria-label',say('选择歌单','Choose a playlist'));
    buttons.forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===selected));b.querySelector('.home-choice-title').textContent=items[i].a.textContent;b.querySelector('.home-choice-detail').textContent=items[i].plays.textContent;});if(frame)frame.title=say('网易云歌单 · ','NetEase playlist · ')+item.a.textContent;
   }
   function stop(reason='closed',manual=false){const hadFrame=!!frame;if(manual)userClosed=true;clearTimeout(timer);frame?.remove();frame=null;phase=reason;mount.hidden=true;labels();if(hadFrame)document.dispatchEvent(new Event('home:music-stopped'));}
   function start(){userClosed=false;stop('loading');stopDemo();mount.hidden=false;frame=make('iframe');const current=frame;frame.src=`https://music.163.com/outchain/player?type=0&id=${items[selected].id}&auto=0&height=280`;frame.allow='autoplay; encrypted-media';frame.referrerPolicy='strict-origin-when-cross-origin';frame.addEventListener('load',()=>{if(frame!==current)return;clearTimeout(timer);phase='ready';labels();});frame.addEventListener('error',()=>{if(frame===current)stop('error');});mount.append(frame);timer=setTimeout(()=>{if(frame===current)stop('error');},22000);labels();}
   function select(i){if(i===selected)return;const old=selected;stop('idle');selected=i;labels();animate(record,Math.sign(i-old));start();}
   open.addEventListener('click',()=>frame?stop('closed',true):start());stopMusic=()=>stop('closed',true);musicMounted=()=>!!frame;
   source.before(room);source.hidden=true;labels();document.addEventListener('languagechange',labels);
   new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&!frame&&!userClosed)start();else if(!entries[0].isIntersecting&&frame)stop('idle');},{rootMargin:'180px 0px'}).observe(musicSection);
  }
 }
 // Scale only text inside homepage iframes. Canvas geometry and pointer coordinates stay intact.
 function compactDemo(frame){
  try{
   const doc=frame.contentDocument;if(!doc?.body||doc.location.origin!==location.origin||doc.documentElement.dataset.homeCompact)return;
   doc.documentElement.dataset.homeCompact='1';const root=doc.documentElement,style=doc.createElement('style');
   style.textContent='html.home-compact-text [data-home-font]{font-size:var(--home-font-size)!important}';doc.head.append(style);
   let pending=0,disposed=false;const ignored='script,style,svg,canvas,noscript,template';
   function measure(){if(disposed)return;root.classList.remove('home-compact-text');const elements=new Set();const walker=doc.createTreeWalker(doc.body,NodeFilter.SHOW_TEXT);let text;while((text=walker.nextNode())){const el=text.parentElement;if(el&&!el.closest(ignored)&&text.nodeValue.trim())elements.add(el);}doc.querySelectorAll('button,input,select,textarea').forEach(el=>elements.add(el));const sizes=[...elements].map(el=>[el,parseFloat(frame.contentWindow.getComputedStyle(el).fontSize)]);for(const [el,size]of sizes){if(!Number.isFinite(size))continue;el.dataset.homeFont='';el.style.setProperty('--home-font-size',(size>10?Math.max(10,size*.9):size)+'px');}root.classList.add('home-compact-text');}
   const schedule=()=>{clearTimeout(pending);pending=setTimeout(measure,100);};measure();
   const observer=new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&!n.matches?.(ignored))))schedule();});observer.observe(doc.body,{childList:true,subtree:true});frame.contentWindow.addEventListener('resize',schedule);
   frame.homeCompactCleanup=()=>{disposed=true;clearTimeout(pending);observer.disconnect();frame.contentWindow?.removeEventListener('resize',schedule);};
  }catch{}
 }
 const demoSection=document.getElementById('demos');
 if(demoSection){
  const lists=[...demoSection.querySelectorAll('.demo-list')],groups=lists.map((list,group)=>({source:list.previousElementSibling?.previousElementSibling,items:[...list.querySelectorAll('.demo-row')].map(row=>({a:row.querySelector('a'),note:row.querySelector('.demo-note'),img:row.querySelector('img'),group}))}));
  const items=groups.flatMap(g=>g.items);
  if(items.length){
   const panel=make('div','home-media home-demos');panel.dataset.homeDemos='';
   panel.innerHTML='<div class="home-demo-nav"><div class="home-demo-categories" role="group"></div><span class="home-demo-counter"></span></div><div class="home-demo-window" data-state="idle"><div class="home-demo-toolbar"><span class="home-demo-title"></span><a target="_blank" rel="noopener noreferrer"></a></div><div class="home-demo-viewport"><div class="home-demo-surface"><img class="home-demo-poster" alt=""></div><div class="home-demo-start"><button type="button"></button></div></div><div class="home-demo-bottom"><p class="home-demo-description"></p><div class="home-demo-arrows"><button type="button" data-dir="-1">←</button><button type="button" data-dir="1">→</button></div></div></div><div class="home-demo-choices" role="group"></div><p class="home-demo-status" role="status" aria-live="polite"></p>';
   const q=s=>panel.querySelector(s),surface=q('.home-demo-surface'),win=q('.home-demo-window'),starter=q('.home-demo-start'),poster=q('.home-demo-poster');
   // The small physics sandbox is the initial visual; every original demo remains selectable.
   let selected=items.findIndex(item=>item.a.href.includes('pocket-cosmos'));if(selected<0)selected=0;
   let group=items[selected].group,frame=null,visible=false,timer=0,readyPoll=0,phase='idle';
   const categories=groups.map((g,i)=>{const b=button('home-demo-category');b.addEventListener('click',()=>{if(group!==i)select(items.indexOf(g.items[0]));});q('.home-demo-categories').append(b);return b;});
   const choices=items.map((item,i)=>{const b=button('home-demo-choice');b.innerHTML='<img alt=""><span></span>';b.querySelector('img').src=item.img.src;b.querySelector('img').loading='lazy';b.addEventListener('click',()=>select(i));q('.home-demo-choices').append(b);return b;});
   function labels(){const item=items[selected],within=groups[group].items;
    panel.dataset.demo=new URL(item.a.href).pathname.split('/').pop();win.dataset.state=phase;q('.home-demo-title').textContent=item.a.textContent;q('.home-demo-description').textContent=item.note.textContent;poster.src=item.img.src;poster.alt=item.a.textContent;q('.home-demo-toolbar a').href=item.a.href;q('.home-demo-toolbar a').textContent=say('打开完整版 ↗','Open full demo ↗');q('.home-demo-counter').textContent=String(within.indexOf(item)+1).padStart(2,'0')+' / '+String(within.length).padStart(2,'0');
    q('.home-demo-categories').setAttribute('aria-label',say('演示分类','Demo categories'));q('.home-demo-choices').setAttribute('aria-label',say('选择演示','Choose a demo'));categories.forEach((b,i)=>{b.textContent=groups[i].source.textContent;b.setAttribute('aria-pressed',String(i===group));});choices.forEach((b,i)=>{b.hidden=items[i].group!==group;b.setAttribute('aria-pressed',String(i===selected));b.querySelector('span').textContent=items[i].a.textContent;});
    q('[data-dir="-1"]').setAttribute('aria-label',say('上一个演示','Previous demo'));q('[data-dir="1"]').setAttribute('aria-label',say('下一个演示','Next demo'));
    const status={idle:say('可在这里操作，也可以打开完整版。','Try it here, or open the full demo.'),loading:say('正在载入…','Loading…'),ready:say('正在体验 · 切换时重新载入所选演示。','Live · Switching loads a new demo.'),error:say('暂时无法载入，请重试或打开完整版。','Unable to load. Retry or open the full demo.')};q('.home-demo-status').textContent=status[phase];starter.hidden=phase==='ready';q('.home-demo-start button').disabled=phase==='loading';q('.home-demo-start button').textContent=phase==='loading'?say('正在载入…','Loading…'):phase==='error'?say('重新载入','Try again'):say('开始体验','Try demo');if(frame)frame.title=item.a.textContent;
   }
   function stop(){clearTimeout(timer);clearInterval(readyPoll);frame?.homeCompactCleanup?.();frame?.remove();frame=null;phase='idle';labels();}
   function load(explicit=false){if(frame||document.hidden||(!visible&&!explicit))return;if(musicMounted()){if(!explicit)return;stopMusic();}phase='loading';frame=make('iframe');const current=frame,url=new URL(items[selected].a.href);url.searchParams.set('embed','1');frame.src=url.href;frame.allow='fullscreen; autoplay';frame.referrerPolicy='strict-origin-when-cross-origin';const ready=()=>{if(frame!==current)return;clearTimeout(timer);clearInterval(readyPoll);phase='ready';compactDemo(frame);frame.contentWindow?.postMessage({type:'zaoz:embed-state',active:true},location.origin);labels();};frame.addEventListener('load',ready);readyPoll=setInterval(()=>{try{const doc=current.contentDocument;if(doc?.body&&doc.location.pathname===url.pathname&&doc.readyState!=='loading')ready();}catch{}},120);frame.addEventListener('error',()=>{if(frame!==current)return;stop();phase='error';labels();});surface.prepend(frame);timer=setTimeout(()=>{if(frame!==current)return;stop();phase='error';labels();},25000);labels();}
   function select(i){if(i===selected)return;const direction=Math.sign(i-selected);stop();selected=i;group=items[i].group;labels();animate(surface,direction);load(true);}
   window.addEventListener('message',event=>{if(event.origin===location.origin&&event.source===frame?.contentWindow&&event.data?.type==='zaoz:embed-ready')frame.contentWindow.postMessage({type:'zaoz:embed-state',active:visible&&!document.hidden},location.origin);});
   q('.home-demo-start button').addEventListener('click',()=>load(true));q('.home-demo-arrows').addEventListener('click',e=>{const b=e.target.closest('[data-dir]');if(!b)return;const subset=groups[group].items,current=subset.indexOf(items[selected]),next=(current+Number(b.dataset.dir)+subset.length)%subset.length;select(items.indexOf(subset[next]));});
   q('.home-demo-choices').addEventListener('keydown',e=>{const i=choices.indexOf(e.target);if(i<0)return;const subset=groups[group].items;let n;if(e.key==='ArrowRight'||e.key==='ArrowDown')n=(subset.indexOf(items[i])+1)%subset.length;if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=(subset.indexOf(items[i])+subset.length-1)%subset.length;if(e.key==='Home')n=0;if(e.key==='End')n=subset.length-1;if(n!==undefined){e.preventDefault();const target=items.indexOf(subset[n]);select(target);choices[target].focus({preventScroll:true});}});
   const original=[...demoSection.children].filter(el=>!el.classList.contains('section-head'));original.forEach(el=>el.hidden=true);demoSection.append(panel);labels();document.addEventListener('languagechange',labels);stopDemo=stop;document.addEventListener('home:music-stopped',()=>requestAnimationFrame(()=>{if(visible&&!document.hidden&&!musicMounted())load();}));
   new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)load();else if(frame)stop();},{rootMargin:'100px 0px'}).observe(q('.home-demo-window'));
  }
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stopMusic();stopDemo();}});window.addEventListener('pagehide',()=>{stopMusic();stopDemo();});
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.1});document.querySelectorAll('.section-head,.hero-links,.zaoz-feature').forEach(el=>{el.classList.add('home-reveal');observer.observe(el);});}
 reduced.addEventListener('change',()=>{if(reduced.matches)document.querySelectorAll('.home-media *').forEach(el=>el.getAnimations().forEach(a=>a.cancel()));});
})();
