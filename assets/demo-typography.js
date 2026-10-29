/* Font-only sizing for demo interfaces; rendering and input coordinates stay unchanged. */
(()=>{
'use strict';
const origin=location.origin;
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

const start=()=>compactDemo({contentDocument:document,contentWindow:window});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
