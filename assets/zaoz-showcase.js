/* Real, lazy-loaded experiences. Off-screen apps retain their state and stop animating. */
(() => {
 'use strict';
 const demos=[...document.querySelectorAll('[data-demo]')].map(shell=>({shell,frame:null,ready:false,visible:false,failed:false,timer:null}));
 const words={
  en:{idle:'Interactive demo',loading:'Loading demo…',ready:'Live demo',paused:'Paused',failed:'Demo unavailable',retry:'Try again',expand:'Expand',close:'Close',error:'Unable to load. Try again or open the full app.'},
  zh:{idle:'可直接体验',loading:'正在载入…',ready:'正在体验',paused:'已暂停',failed:'暂时无法载入',retry:'重新载入',expand:'放大',close:'收起',error:'暂时无法载入，可重试或打开完整版。'}
 };
 let expanded=null,inertElements=[],returnFocus=null;
 const language=()=>document.documentElement.lang.startsWith('zh')?'zh':'en';
 function labels(demo){
  const w=words[language()],{shell}=demo;
  const state=demo.failed?'failed':!demo.frame?'idle':!demo.ready?'loading':demo.visible&&!document.hidden&&(!expanded||expanded===demo)?'ready':'paused';
  shell.dataset.state=state;shell.querySelector('[data-live-state]').textContent=w[state];
  shell.querySelector('[data-loading-label]').textContent=demo.failed?w.error:w.loading;
  shell.querySelector('[data-retry]').textContent=w.retry;shell.querySelector('[data-retry]').hidden=!demo.failed;
  const button=shell.querySelector('[data-expand]');button.querySelector('[data-expand-label]').textContent=expanded===demo?w.close:w.expand;
  button.setAttribute('aria-pressed',String(expanded===demo));button.setAttribute('aria-label',(expanded===demo?w.close:w.expand)+' · '+shell.dataset.title);
 }
 function activate(demo){
  const active=demo.ready&&demo.visible&&!document.hidden&&(!expanded||expanded===demo);
  demo.frame?.contentWindow?.postMessage({type:'zaoz:embed-state',active},location.origin);labels(demo);
 }
 function load(demo){
  if(demo.frame)return;demo.failed=demo.ready=false;
  const frame=demo.frame=document.createElement('iframe');frame.title=demo.shell.dataset.title+' · interactive demo';
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
 document.addEventListener('visibilitychange',()=>demos.forEach(activate));document.addEventListener('languagechange',()=>demos.forEach(labels));
})();
