/* 托马斯学习馆官网 · 交互与滚动动效（零依赖） */
(function () {
  'use strict';

  /* 渐进增强标记：JS 可用时才启用 reveal 隐藏（无 JS 环境内容始终可见） */
  document.documentElement.classList.add('js');

  /* 顶部滚动进度条 */
  var bar = document.getElementById('scrollbar');
  var head = document.querySelector('.site-head');
  function onScroll() {
    var d = document.documentElement;
    var max = d.scrollHeight - d.clientHeight;
    if (bar) bar.style.width = max > 0 ? (d.scrollTop / max * 100).toFixed(2) + '%' : '0';
    if (head) head.classList.toggle('scrolled', d.scrollTop > 8);
    // 流程竖向进度
    var flow = document.querySelector('.flow');
    if (flow) {
      var rail = flow.querySelector('.flow-rail i');
      var r = flow.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * 0.62 - r.top) / r.height;
      p = Math.max(0, Math.min(1, p));
      if (rail) rail.style.height = (p * 100).toFixed(1) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* 滚动进场（IntersectionObserver 不存在时全部直接显示，且不中断后续功能） */
  var revealEls = document.querySelectorAll('.reveal, .flow-item');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        // 计数器
        var num = e.target.querySelector('[data-count]');
        if (num && !num.dataset.done) {
          num.dataset.done = '1';
          var target = parseFloat(num.getAttribute('data-count'));
          var decimals = (num.getAttribute('data-decimals') | 0);
          var suffix = num.getAttribute('data-suffix') || '';
          var t0 = null;
          function step(ts) {
            if (!t0) t0 = ts;
            var k = Math.min(1, (ts - t0) / 1300);
            var ease = 1 - Math.pow(1 - k, 3);
            num.textContent = (target * ease).toFixed(decimals) + suffix;
            if (k < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }
        io.unobserve(e.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* 移动端菜单 */
  var burger = document.querySelector('.burger');
  var panel = document.querySelector('.mobile-panel');
  if (burger && panel) {
    burger.addEventListener('click', function () { panel.classList.toggle('open'); });
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { panel.classList.remove('open'); });
    });
  }

  /* 复制地址 */
  var copyBtns = document.querySelectorAll('[data-copy]');
  var toast = document.querySelector('.toast');
  copyBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      function done() {
        if (!toast) return;
        toast.textContent = '地址已复制，导航搜索“托马斯学习馆 王家湾 人信汇”';
        toast.classList.add('show');
        setTimeout(function () { toast.classList.remove('show'); }, 2400);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta); done();
      }
    });
  });

  /* 照片点击放大（轻量灯箱） */
  document.querySelectorAll('.shot').forEach(function (shot) {
    shot.addEventListener('click', function () {
      var img = shot.querySelector('img');
      if (!img) return;
      var lb = document.createElement('div');
      lb.style.cssText = 'position:fixed;inset:0;z-index:300;background:rgba(28,21,18,.9);display:flex;align-items:center;justify-content:center;padding:24px;cursor:zoom-out;opacity:0;transition:opacity .25s';
      var big = document.createElement('img');
      big.src = img.src; big.alt = img.alt || '';
      big.style.cssText = 'max-width:min(1080px,94vw);max-height:88vh;border-radius:16px;box-shadow:0 30px 80px rgba(0,0,0,.5)';
      lb.appendChild(big);
      lb.addEventListener('click', function () {
        lb.style.opacity = '0';
        setTimeout(function () { lb.remove(); }, 250);
      });
      document.body.appendChild(lb);
      requestAnimationFrame(function () { lb.style.opacity = '1'; });
    });
  });

  onScroll();
})();
