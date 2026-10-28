/* Pixel light follows the actual dawn silhouette; the academic renderer is separate. */
(() => {
 'use strict';
 const canvas=document.getElementById('zaozPixelPaper');if(!canvas)return;
 const ctx=canvas.getContext('2d'),mask=document.createElement('canvas'),sample=mask.getContext('2d',{willReadFrequently:true});if(!ctx||!sample)return;
 const pref=matchMedia('(prefers-reduced-motion: reduce)'),button=document.getElementById('toggleDawn');
 const back='M0 428c110 0 184-123 278-133 106-11 159 144 266 103 117-46 184-53 356-8v260H0V428Z',front='M0 524c135 5 270-138 451-160 184-22 290 119 449 101v185H0V524Z';
 let points=[],w=0,h=0,raf=0,last=0,frames=0,visible=true,paused=false;
 const reduced=()=>pref.matches||paused;
 function label(){if(!button)return;const zh=document.documentElement.lang.startsWith('zh');button.disabled=pref.matches;button.setAttribute('aria-pressed',String(paused||pref.matches));button.querySelector('[data-motion-label]').textContent=pref.matches?(zh?'已减少动态':'Motion reduced'):paused?(zh?'继续动态':'Resume motion'):(zh?'暂停动态':'Pause motion');button.querySelector('.motion-icon').textContent=paused||pref.matches?'▷':'Ⅱ';}
 function layout(){
  w=canvas.clientWidth;h=canvas.clientHeight;if(!w||!h)return;
  const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  const cell=w<400?5:6,cols=Math.ceil(w/cell),rows=Math.ceil(h/cell),scale=Math.min(w/900,h/650),ox=(w-900*scale)/2,oy=(h-650*scale)/2;
  mask.width=cols;mask.height=rows;sample.setTransform(scale/cell,0,0,scale/cell,ox/cell,oy/cell);
  sample.fillStyle='#ed9d65';sample.beginPath();sample.arc(563,279,153,0,Math.PI*2);sample.fill();sample.fillStyle='#000';sample.fill(new Path2D(back));sample.fill(new Path2D(front));
  sample.strokeStyle='#b7cba1';sample.lineWidth=3;sample.stroke(new Path2D('M0 428c110 0 184-123 278-133 106-11 159 144 266 103 117-46 184-53 356-8'));sample.stroke(new Path2D('M0 524c135 5 270-138 451-160 184-22 290 119 449 101'));
  const pixels=sample.getImageData(0,0,cols,rows).data;points=[];
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const o=(y*cols+x)*4;if(pixels[o+3]<80||pixels[o]+pixels[o+1]<80)continue;const warm=pixels[o]>pixels[o+1]+30;points.push({x:x*cell,y:y*cell,size:cell-1,warm,phase:x*.09+y*.15});}
  canvas.dataset.logoState='ready';canvas.dataset.filledCells=String(points.length);canvas.dataset.cellSize=String(cell);paint(performance.now()/1000);schedule();
 }
 function paint(t){ctx.clearRect(0,0,w,h);const hovering=canvas.closest('.dawn-art')?.matches(':hover');for(const p of points){const front=reduced()?0:Math.pow(Math.max(0,Math.cos(p.phase-t*.45)),24),alpha=front*(hovering?(p.warm?.48:.34):(p.warm?.26:.19));ctx.fillStyle=p.warm?'rgba(245,216,213,'+alpha+')':'rgba(70,214,204,'+alpha+')';ctx.fillRect(p.x,p.y,p.size,p.size);}canvas.dataset.frame=String(++frames);canvas.dataset.motion=reduced()?'reduced':visible&&!document.hidden?'flowing':'paused';}
 function tick(now){raf=0;if(!visible||document.hidden||reduced())return;if(now-last>=1000/24){paint(now/1000);last=now;}schedule();}
 function schedule(){if(!raf&&visible&&!document.hidden&&!reduced()&&points.length)raf=requestAnimationFrame(tick);}
 function refresh(){const state=pref.matches?'reduced':paused?'paused':'running';document.body.dataset.dawnMotion=state;document.dispatchEvent(new CustomEvent('zaoz:motion-preference',{detail:{state}}));if(raf)cancelAnimationFrame(raf);raf=0;last=0;paint(performance.now()/1000);schedule();label();}
 if('ResizeObserver'in window)new ResizeObserver(layout).observe(canvas);else addEventListener('resize',layout,{passive:true});
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;refresh();},{threshold:.01}).observe(canvas);
 document.addEventListener('visibilitychange',refresh);document.addEventListener('languagechange',label);pref.addEventListener('change',refresh);
 button?.addEventListener('click',()=>{paused=!paused;refresh();});layout();label();document.body.dataset.dawnMotion=pref.matches?'reduced':'running';
})();
