/* Real, lazy-loaded experiences. Off-screen apps retain their state and stop animating. */
(() => {
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('[data-product-scenes]').forEach(group=>{
  const tabs=[...group.querySelectorAll('[role="tab"]')],stage=group.querySelector('[data-scene-stage]');
  const panels=tabs.map(tab=>document.getElementById(tab.getAttribute('aria-controls')));
  let selected=null,animations=[],generation=0;
  function rail(){const tab=tabs.find(t=>t.getAttribute('aria-selected')==='true');if(tab){group.style.setProperty('--rail-left',tab.offsetLeft+'px');group.style.setProperty('--rail-width',tab.offsetWidth+'px');}}
  function clearMotion(){
   animations.forEach(a=>a.cancel());animations=[];
   panels.forEach(panel=>{
    const active=panel===selected;panel.hidden=!active;panel.inert=!active;
    panel.setAttribute('aria-hidden',String(!active));
    for(const key of ['position','inset','width','pointerEvents'])panel.style[key]='';
   });
   stage.style.height='';stage.style.overflow='';delete stage.dataset.switching;
  }
  function settle(){generation++;clearMotion();}
  stage.addEventListener('zaoz:settle-scene',settle);
  function select(tab,animate=true,focus=false,directionHint=0){
   const index=tabs.indexOf(tab),next=panels[index];if(next===selected){if(focus)tab.focus({preventScroll:true});return;}
   const previous=selected,oldIndex=panels.indexOf(previous),oldHeight=stage.getBoundingClientRect().height,oldLeft=previous?.offsetLeft||0,oldWidth=previous?.offsetWidth||0;
   const fromTransform=previous?getComputedStyle(previous).transform:'none',fromOpacity=previous?getComputedStyle(previous).opacity:'1';
   const existingNext=next&&!next.hidden?{transform:getComputedStyle(next).transform,opacity:getComputedStyle(next).opacity}:null;
   const direction=directionHint||Math.sign(index-oldIndex)||1,current=++generation;
   selected=next;clearMotion();
   tabs.forEach(item=>{const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;});rail();
   stage.dataset.direction=direction>0?'forward':'backward';
   if(previous&&animate&&!reduced.matches){
    const nextHeight=next.getBoundingClientRect().height;
    previous.hidden=false;previous.inert=true;previous.setAttribute('aria-hidden','true');
    previous.style.position='absolute';previous.style.inset='0 auto auto '+oldLeft+'px';previous.style.width=oldWidth+'px';previous.style.pointerEvents='none';
    next.style.pointerEvents='none';stage.style.height=oldHeight+'px';stage.style.overflow='hidden';stage.dataset.switching='true';
    const timing={duration:620,easing:'cubic-bezier(.22,.78,.2,1)'};
    animations=[
     stage.animate([{height:oldHeight+'px'},{height:nextHeight+'px'}],timing),
     previous.animate([{transform:fromTransform,opacity:fromOpacity},{transform:'translateX('+(-direction*100)+'%)',opacity:.28}],timing),
     next.animate([existingNext||{transform:'translateX('+(direction*100)+'%)',opacity:.6},{transform:'translateX(0)',opacity:1}],timing)
    ];
    Promise.all(animations.map(a=>a.finished)).then(()=>{if(generation===current){clearMotion();group.dispatchEvent(new CustomEvent('zaoz:scene-settled',{bubbles:true,detail:{id:next.id}}));}}).catch(()=>{});
   }
   if(focus)tab.focus({preventScroll:true});group.dispatchEvent(new CustomEvent('zaoz:scene-change',{bubbles:true,detail:{id:next.id,previous:previous?.id,direction}}));
  }
  tabs.forEach((tab,index)=>{
   tab.addEventListener('click',()=>select(tab));
   tab.addEventListener('keydown',event=>{let i,direction=0;if(event.key==='ArrowRight'){i=(index+1)%tabs.length;direction=1;}if(event.key==='ArrowLeft'){i=(index-1+tabs.length)%tabs.length;direction=-1;}if(event.key==='Home')i=0;if(event.key==='End')i=tabs.length-1;if(i!==undefined){event.preventDefault();select(tabs[i],true,true,direction);}});
  });
  reduced.addEventListener('change',()=>{if(reduced.matches)settle();});
  const fromHash=()=>tabs.find(t=>'#'+t.dataset.sceneTarget===location.hash);
  select(fromHash()||tabs[0],false);stage.dataset.ready='true';
  window.addEventListener('hashchange',()=>{const tab=fromHash();if(tab){select(tab);requestAnimationFrame(()=>group.scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'}));}});
  document.addEventListener('languagechange',rail);if('ResizeObserver'in window)new ResizeObserver(rail).observe(group.querySelector('.scene-tabs'));
 });
 if('IntersectionObserver'in window){
  const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');reveal.unobserve(entry.target);}}),{threshold:.1});
  document.querySelectorAll('.product-heading,.philosophy-heading,.philosophy-principles,.founder-section').forEach(el=>{el.classList.add('brand-reveal');reveal.observe(el);});
 }
 const demos=[...document.querySelectorAll('[data-demo]')].map(shell=>({shell,frame:null,ready:false,visible:false,failed:false,timer:null}));
 const words={
  en:{idle:'Ready to explore',loading:'Loading…',ready:'Ready',paused:'Paused',failed:'Unable to load',retry:'Try again',expand:'Expand',close:'Close',error:'Unable to load. Try again or open the full app.'},
  zh:{idle:'可直接体验',loading:'正在载入…',ready:'正在体验',paused:'已暂停',failed:'暂时无法载入',retry:'重新载入',expand:'放大',close:'收起',error:'暂时无法载入，可重试或打开完整版。'}
 };
 let expanded=null,inertElements=[],returnFocus=null,musicMounted=false;
 const language=()=>document.documentElement.lang.startsWith('zh')?'zh':'en';
 function labels(demo){
  const w=words[language()],{shell}=demo;
  const state=demo.failed?'failed':!demo.frame?'idle':!demo.ready?'loading':demo.visible&&!demo.shell.closest('[role="tabpanel"]')?.inert&&!document.hidden&&!musicMounted&&(!expanded||expanded===demo)?'ready':'paused';
  shell.dataset.state=state;shell.querySelector('[data-live-state]').textContent=w[state];
  shell.querySelector('[data-loading-label]').textContent=demo.failed?w.error:w.loading;
  shell.querySelector('[data-retry]').textContent=w.retry;shell.querySelector('[data-retry]').hidden=!demo.failed;
  const button=shell.querySelector('[data-expand]');button.querySelector('[data-expand-label]').textContent=expanded===demo?w.close:w.expand;
  button.setAttribute('aria-pressed',String(expanded===demo));button.setAttribute('aria-label',(expanded===demo?w.close:w.expand)+' · '+shell.dataset.title);
 }
 function activate(demo){
  const active=demo.ready&&demo.visible&&!demo.shell.closest('[role="tabpanel"]')?.inert&&!document.hidden&&!musicMounted&&(!expanded||expanded===demo);
  demo.frame?.contentWindow?.postMessage({type:'zaoz:embed-state',active},location.origin);labels(demo);
 }
 function load(demo){
  if(demo.frame)return;demo.failed=demo.ready=false;
  const frame=demo.frame=document.createElement('iframe');frame.title=demo.shell.dataset.title+' · embedded experience';
  frame.allow='fullscreen; autoplay';frame.setAttribute('referrerpolicy','strict-origin-when-cross-origin');frame.src=demo.shell.dataset.src;
  const fail=()=>{if(!demo.ready){demo.failed=true;labels(demo);}};
  frame.addEventListener('error',fail);demo.shell.querySelector('.live-viewport').append(frame);
  demo.timer=setTimeout(fail,30000);labels(demo);
 }
 function restorePage(){inertElements.forEach(el=>{el.inert=false;});inertElements=[];document.body.classList.remove('demo-expanded');}
 function closeExpanded(){
  if(!expanded)return;const demo=expanded;expanded=null;demo.shell.classList.remove('is-expanded');demo.shell.removeAttribute('role');demo.shell.removeAttribute('aria-modal');restorePage();
  if(document.fullscreenElement===demo.shell)document.exitFullscreen().catch(()=>{});
  returnFocus?.focus({preventScroll:true});demos.forEach(activate);
 }
 function fallbackExpand(demo){
  demo.shell.classList.add('is-expanded');demo.shell.setAttribute('role','dialog');demo.shell.setAttribute('aria-modal','true');document.body.classList.add('demo-expanded');
  // Moving a live iframe would reset it, so expand the original node in place.
  let child=demo.shell;
  while(child.parentElement){
   const parent=child.parentElement;
   [...parent.children].forEach(sibling=>{if(sibling!==child&&!sibling.inert){sibling.inert=true;inertElements.push(sibling);}});
   if(parent===document.body)break;child=parent;
  }
  demo.shell.querySelector('[data-expand]').focus();
 }
 async function expand(demo){
  demo.shell.closest('[data-scene-stage]')?.dispatchEvent(new Event('zaoz:settle-scene'));
  if(expanded===demo){closeExpanded();return;}closeExpanded();expanded=demo;returnFocus=document.activeElement;demo.visible=true;load(demo);demos.forEach(activate);
  if(demo.shell.requestFullscreen){try{await demo.shell.requestFullscreen();}catch{fallbackExpand(demo);}}else fallbackExpand(demo);labels(demo);
 }
 const observer='IntersectionObserver'in window?new IntersectionObserver(entries=>{
  entries.forEach(entry=>{const demo=demos.find(item=>item.shell===entry.target);demo.visible=entry.isIntersecting;if(demo.visible)load(demo);activate(demo);});
 },{rootMargin:'0px',threshold:.01}):null;
 demos.forEach(demo=>{
  demo.shell.querySelector('[data-expand]').addEventListener('click',()=>expand(demo));
  demo.shell.querySelector('[data-retry]').addEventListener('click',()=>{clearTimeout(demo.timer);demo.frame?.remove();demo.frame=null;load(demo);});labels(demo);
  if(observer)observer.observe(demo.shell);else{demo.visible=true;load(demo);}
 });
 window.addEventListener('message',event=>{
  if(event.origin!==location.origin)return;const demo=demos.find(item=>item.frame?.contentWindow===event.source);if(!demo)return;
  if(event.data?.type==='zaoz:embed-ready'){demo.ready=true;demo.failed=false;clearTimeout(demo.timer);activate(demo);}
  if(event.data?.type==='zaoz:embed-escape'&&expanded===demo)closeExpanded();
 });
 document.addEventListener('fullscreenchange',()=>{if(expanded&&!document.fullscreenElement&&!expanded.shell.classList.contains('is-expanded'))closeExpanded();});
 document.addEventListener('keydown',event=>{
  if(!expanded)return;if(event.key==='Escape')closeExpanded();
  if(expanded&&event.key==='Tab'&&expanded.shell.classList.contains('is-expanded')){
   const first=expanded.shell.querySelector('[data-expand]'),last=expanded.shell.querySelector('.live-footer a');
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
 });
 document.addEventListener('zaoz:scene-change',()=>demos.forEach(activate));
 document.addEventListener('zaoz:scene-settled',()=>demos.forEach(activate));
 document.addEventListener('zaoz:music-player',event=>{musicMounted=Boolean(event.detail?.mounted);demos.forEach(activate);});
 document.addEventListener('visibilitychange',()=>demos.forEach(activate));document.addEventListener('languagechange',()=>demos.forEach(labels));
})();
