(() => {
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (header && toggle && mobileNav) {
    const setMenu = open => {
      mobileNav.hidden = !open;
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
    };
    toggle.addEventListener('click', () => setMenu(mobileNav.hidden));
    mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', () => { if (window.innerWidth >= 980 && !mobileNav.hidden) setMenu(false); });
    const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 14);
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
  const copyBtn = document.querySelector('[data-copy-address]');
  const toast = document.getElementById('toast');
  let toastTimer;
  if (copyBtn && toast) copyBtn.addEventListener('click', async () => {
    const address = document.getElementById('school-address')?.textContent.trim() || '武汉市汉阳区龙兴西街人信汇F地块二期7幢1—2层6商号（人信汇二期一号门旁）';
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(address);
      else {
        const field = document.createElement('textarea'); field.value = address;
        field.style.position = 'fixed'; field.style.opacity = '0';
        document.body.append(field); field.select();
        const ok = document.execCommand('copy'); field.remove();
        if (!ok) throw Error('copy failed');
      }
      toast.textContent = '地址已复制，可以粘贴到地图搜索';
    } catch { toast.textContent = '复制失败，请长按地址手动复制'; }
    toast.classList.add('shown'); clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('shown'), 2600);
  });
})();

(() => {
 const form=document.querySelector('.article-search-form');
 const input=document.getElementById('article-query');
 const container=document.getElementById('article-results');
 if(!form||!input||!container)return;
 const cards=[...container.querySelectorAll('.campus-article-card')];
 const filters=[...document.querySelectorAll('[data-article-filter]')];
 const status=document.getElementById('article-result-count');
 const empty=document.getElementById('article-empty');
 let category='all';
 function update(){
   const query=input.value.trim().toLocaleLowerCase('zh-CN');
   let count=0;
   for(const card of cards){
     const subjects=(card.dataset.subjects||'campus').split(' ');
     const text=(card.innerText+' '+(card.dataset.keywords||'')).toLocaleLowerCase('zh-CN');
     const visible=(category==='all'||subjects.includes(category))&&(!query||text.includes(query));
     card.hidden=!visible;if(visible)count++;
   }
   for(const button of filters)button.setAttribute('aria-pressed',String(button.dataset.articleFilter===category));
   status.textContent=query||category!=='all'?`找到 ${count} 篇文章（共 ${cards.length} 篇）`:`共 ${cards.length} 篇文章`;
   empty.hidden=count!==0;
 }
 input.addEventListener('input',update);
 form.addEventListener('submit',event=>{event.preventDefault();update();});
 filters.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.articleFilter;update();}));
 document.getElementById('article-search-reset')?.addEventListener('click',()=>{input.value='';category='all';update();input.focus();});
 update();
})();
