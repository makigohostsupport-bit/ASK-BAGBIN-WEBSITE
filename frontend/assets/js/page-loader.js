(function(){
  const rootPath = () => location.pathname.includes('/pages/') || location.pathname.includes('/forms/') ? '../' : '';
  function build(){
    let loader=document.querySelector('.site-loader');
    if(loader) return loader;
    loader=document.createElement('div');
    loader.className='site-loader';
    loader.setAttribute('aria-hidden','true');
    loader.innerHTML=`
      <div class="ask-loader-shell">
        <div class="ask-loader-orbit orbit-one"></div>
        <div class="ask-loader-orbit orbit-two"></div>
        <div class="ask-loader-logo-wrap">
          <div class="ask-loader-glow"></div>
          <img class="ask-loader-logo" src="${rootPath()}assets/images/logo/logo.png" alt="ASK Bagbin Education Fund">
        </div>
        <div class="ask-loader-brand">ASK BAGBIN <span>EDUCATION FUND</span></div>
        <div class="ask-loader-track"><span></span></div>
        <div class="ask-loader-status"><i></i><span>Loading your experience</span></div>
      </div>`;
    document.body.prepend(loader);
    return loader;
  }
  const loader=build();
  const hide=()=>{ loader.classList.add('is-hidden'); document.documentElement.classList.remove('is-navigating'); };
  const show=()=>{ loader.classList.remove('is-hidden'); document.documentElement.classList.add('is-navigating'); };
  window.addEventListener('load',()=>setTimeout(hide,420),{once:true});
  window.addEventListener('pageshow',hide);
  window.addEventListener('popstate',hide);
  window.addEventListener('pagehide',show);
  document.addEventListener('click',e=>{
    const a=e.target.closest('a');
    if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank'||a.hasAttribute('download')) return;
    const href=a.getAttribute('href');
    if(!href||href==='#'||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')||href.startsWith('javascript:')) return;
    let u; try{u=new URL(a.href,location.href)}catch{return}
    if(u.origin!==location.origin) return;
    show();
  });
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('.mega-link').forEach(a=>a.addEventListener('mouseenter',()=>{
      const box=a.closest('.nav-preview'); if(!box) return;
      const img=box.querySelector('.mega-preview img');
      box.querySelectorAll('.mega-link').forEach(x=>x.classList.remove('active'));
      a.classList.add('active');
      if(img&&a.dataset.image) img.src=a.dataset.image;
    }));
  });
})();