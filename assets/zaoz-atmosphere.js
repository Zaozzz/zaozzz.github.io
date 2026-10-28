/* A quiet tidal field. No tracking, external requests or animation framework. */
(() => {
 'use strict';
 const canvas=document.getElementById('zaozAmbient'),art=document.querySelector('.dawn-art');
 if(!canvas||!art)return;
 const ctx=canvas.getContext('2d'),pref=matchMedia('(prefers-reduced-motion: reduce)');if(!ctx)return;
 let width=0,height=0,raf=0,last=0,clock=0,scroll=window.scrollY,hover=false,pointerX=0,pointerY=0;
 const active=()=>!pref.matches&&!document.hidden&&document.body.dataset.dawnMotion!=='paused'&&document.body.dataset.dawnMotion!=='reduced';
 function shape(x,line,time){return height*(.2+line*.15)+Math.sin(x/width*4.6+line*.7+time*.065)*height*.075+Math.sin(x/width*1.8+line)*height*.13-scroll*.035;}
 function draw(time){
  ctx.clearRect(0,0,width,height);const shift=pointerY*8;
  for(let line=0;line<6;line++){
   ctx.beginPath();for(let x=-30;x<=width+30;x+=24){const y=shape(x,line,time)+shift; x===-30?ctx.moveTo(x,y):ctx.lineTo(x,y);}
   ctx.strokeStyle=line%3===0?'rgba(188,95,106,.045)':'rgba(3,75,97,.035)';ctx.lineWidth=.7;ctx.stroke();
   // A short moving highlight, rather than a full-screen glow.
   const u=(time*.013+line*.19)%1,x=u*width,y=shape(x,line,time)+shift;
   ctx.beginPath();ctx.moveTo(x-12,y);ctx.lineTo(x+12,y);ctx.strokeStyle=line%2?'rgba(25,179,177,.17)':'rgba(188,95,106,.13)';ctx.lineWidth=1;ctx.stroke();
  }
  canvas.dataset.frame=String((Number(canvas.dataset.frame)||0)+1);canvas.dataset.motion=active()?'flowing':'still';
 }
 function tick(now){raf=0;if(!active())return;if(now-last>=1000/24){clock+=Math.min((now-last)/1000,.1);last=now;draw(clock);}raf=requestAnimationFrame(tick);}
 function refresh(){if(raf)cancelAnimationFrame(raf);raf=0;last=performance.now();if(!active()){pointerX=pointerY=0;art.style.setProperty('--dawn-x','0px');art.style.setProperty('--dawn-y','0px');art.style.setProperty('--dawn-rx','0deg');art.style.setProperty('--dawn-ry','0deg');}draw(clock);if(active())raf=requestAnimationFrame(tick);}
 function layout(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);refresh();}
 function point(event){if(!active()||event.pointerType==='touch')return;const box=art.getBoundingClientRect();pointerX=Math.max(-.5,Math.min(.5,(event.clientX-box.left)/box.width-.5));pointerY=Math.max(-.5,Math.min(.5,(event.clientY-box.top)/box.height-.5));art.style.setProperty('--dawn-x',(pointerX*15).toFixed(2)+'px');art.style.setProperty('--dawn-y',(pointerY*10).toFixed(2)+'px');art.style.setProperty('--dawn-rx',(-pointerY*5).toFixed(2)+'deg');art.style.setProperty('--dawn-ry',(pointerX*6).toFixed(2)+'deg');art.dataset.hover='true';}
 function leave(){pointerX=pointerY=0;for(const key of ['--dawn-x','--dawn-y','--dawn-rx','--dawn-ry'])art.style.removeProperty(key);art.dataset.hover='false';}
 art.addEventListener('pointermove',point,{passive:true});art.addEventListener('pointerleave',leave,{passive:true});
 addEventListener('scroll',()=>{scroll=window.scrollY;},{passive:true});addEventListener('resize',layout,{passive:true});
 document.addEventListener('visibilitychange',refresh);document.addEventListener('zaoz:motion-preference',refresh);pref.addEventListener('change',refresh);layout();
})();
