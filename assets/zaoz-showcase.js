/* One calm presentation language, with intentional, keyboard-accessible switches. */
(() => {
  document.querySelectorAll('[data-showcase]').forEach(group => {
    const tabs=[...group.querySelectorAll('[role="tab"]')];
    function select(tab,focus=false){
      tabs.forEach(item=>{const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;document.getElementById(item.getAttribute('aria-controls')).hidden=!active;});
      if(focus)tab.focus();
    }
    tabs.forEach((tab,index)=>{
      tab.addEventListener('click',()=>select(tab));
      tab.addEventListener('keydown',event=>{
        let next;
        if(event.key==='ArrowRight')next=(index+1)%tabs.length;
        if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;
        if(event.key==='Home')next=0;
        if(event.key==='End')next=tabs.length-1;
        if(next!==undefined){event.preventDefault();select(tabs[next],true);}
      });
    });
  });
})();
