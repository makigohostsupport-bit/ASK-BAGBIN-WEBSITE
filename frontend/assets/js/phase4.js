/* ASK Bagbin Education Fund - Phase 4 public API integration */
(function(){
  const API_BASE=window.ASK_API_BASE||'/api';
  const api=(path,opts)=>fetch(API_BASE+'/public'+path,opts).then(async r=>{const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.message||'Request failed');return d;});
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const img=(v,fallback)=>v||fallback;
  const date=v=>v?new Date(v).toLocaleDateString(undefined,{month:'short',year:'numeric'}):'';
  const fallback=(window.ASK_IMAGES&&window.ASK_IMAGES.hero1)||'assets/images/site/hero-1.jpg';
  function renderHome(data){
    const pg=document.querySelector('#projects .project-grid'); if(pg&&data.projects?.length){pg.innerHTML=data.projects.slice(0,6).map(x=>`<article class="project-card"><img src="${esc(img(x.image_url,fallback))}" alt="${esc(x.title)}"><div class="project-overlay"><span>${esc(x.category||'PROJECT')}</span><h3>${esc(x.title)}</h3><p>${esc(x.location||'Ghana')}</p></div></article>`).join('');}
    const ng=document.querySelector('#news .news-grid'); if(ng&&data.news?.length){ng.innerHTML=data.news.slice(0,3).map(x=>`<article class="news-card"><div class="news-image"><img src="${esc(img(x.image_url,fallback))}" alt="${esc(x.title)}"><span class="news-date">${esc(date(x.published_at||x.created_at))}</span></div><div class="news-content"><small>NEWS</small><h3>${esc(x.title)}</h3><p>${esc(x.excerpt||'Read the latest ASK Bagbin Education Fund update.')}</p><a href="pages/news.html#news-${x.id}">READ MORE <i class="fa-solid fa-arrow-right"></i></a></div></article>`).join('');}
    const bg=document.querySelector('#beneficiaries .beneficiary-grid'); if(bg&&data.beneficiaries?.length){bg.innerHTML=data.beneficiaries.slice(0,3).map(x=>`<article class="beneficiary-card"><div class="beneficiary-image"><img src="${esc(img(x.image_url,fallback))}" alt="${esc(x.name)}"></div><div class="beneficiary-content"><span>${esc(x.programme||'BENEFICIARY')}</span><h3>${esc(x.name)}</h3><p>${esc([x.institution,x.level,x.location].filter(Boolean).join(' • ')||'Education support beneficiary')}</p></div></article>`).join('');}
  }
  async function init(){
    try{const [projects,news,beneficiaries,partners,settings]=await Promise.all([api('/projects'),api('/news'),api('/beneficiaries'),api('/partners'),api('/settings')]);
      renderHome({projects,news,beneficiaries});
      if(settings.logo_url) document.querySelectorAll('img[src*="logo/logo.png"]').forEach(i=>i.src=settings.logo_url);
      window.ASKBagbinData={projects,news,beneficiaries,partners,settings};
    }catch(e){console.warn('Phase 4 public content unavailable:',e.message);}
  }
  function bindForm(id,endpoint,build){const f=document.getElementById(id);if(!f)return;const msg=document.createElement('div');msg.className='phase4-form-message';f.appendChild(msg);f.addEventListener('submit',async e=>{e.preventDefault();const b=f.querySelector('button[type="submit"]');if(b)b.disabled=true;msg.textContent='Sending...';try{const d=await api(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(build(f))});msg.textContent=d.message||'Submitted successfully.';msg.className='phase4-form-message success';f.reset();}catch(err){msg.textContent=err.message;msg.className='phase4-form-message error';}finally{if(b)b.disabled=false;}});}
  bindForm('contactForm','/messages',f=>({name:f.querySelector('[name="name"]')?.value.trim()||f.querySelector('input')?.value.trim(),email:f.querySelector('[name="email"]')?.value.trim()||f.querySelector('input[type="email"]')?.value.trim(),subject:f.querySelector('[name="subject"]')?.value.trim()||'',message:f.querySelector('[name="message"]')?.value.trim()||f.querySelector('textarea')?.value.trim()}));
  bindForm('partnershipForm','/partnerships',f=>({organizationName:f.querySelector('[name="organizationName"]')?.value.trim(),contactName:f.querySelector('[name="contactName"]')?.value.trim(),email:f.querySelector('[name="email"]')?.value.trim(),phone:f.querySelector('[name="phone"]')?.value.trim(),message:f.querySelector('[name="message"]')?.value.trim()}));
  bindForm('volunteerForm','/volunteers',f=>({fullName:f.querySelector('[name="fullName"]')?.value.trim(),email:f.querySelector('[name="email"]')?.value.trim(),phone:f.querySelector('[name="phone"]')?.value.trim(),skills:f.querySelector('[name="skills"]')?.value.trim(),message:f.querySelector('[name="message"]')?.value.trim()}));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
