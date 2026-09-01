const ASK_API = window.ASK_API_BASE || '/api';

function adminToken(){ return localStorage.getItem('askBagbinAdminToken'); }
function authHeaders(extra={}){
  return {'Authorization': `Bearer ${adminToken()}`, ...extra};
}
function logoutAdmin(){
  localStorage.removeItem('askBagbinAdminToken');
  localStorage.removeItem('askBagbinAdmin');
  window.location.replace('login.html');
}
window.logoutAdmin = logoutAdmin;

async function apiFetch(url, options={}){
  const isForm = typeof FormData !== 'undefined' && options.body instanceof FormData; const headers = {...authHeaders(), ...(options.body && !isForm ? {'Content-Type':'application/json'} : {}), ...(options.headers || {})};
  const response = await fetch(`${ASK_API}${url}`, {...options, headers});
  if(response.status === 401){ logoutAdmin(); throw new Error('Session expired.'); }
  const data = await response.json().catch(() => ({}));
  if(!response.ok) throw new Error(data.message || 'Request failed.');
  return data;
}
window.apiFetch = apiFetch;

function renderAdminIdentity(){
  try{
    const admin = JSON.parse(localStorage.getItem('askBagbinAdmin') || '{}');
    const name = admin.name || 'Administrator';
    const role = (admin.role || 'super_admin').replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase());
    document.querySelectorAll('.user-info strong,.profile-details strong').forEach(el=>el.textContent=name);
    document.querySelectorAll('.user-info span,.profile-details span').forEach(el=>el.textContent=role);
    document.querySelectorAll('.user-avatar,.profile-avatar').forEach(el=>el.textContent=name.charAt(0).toUpperCase());
    document.querySelectorAll('[data-admin-name]').forEach(el=>el.textContent=name);
  }catch(e){}
}

function setStatus(id, text){ const el=document.getElementById(id); if(el) el.textContent=text; }

async function loadDashboard(){
  if(!document.getElementById('beneficiariesCount')) return;
  try{
    const data = await apiFetch('/admin/stats');
    setStatus('beneficiariesCount', data.beneficiaries ?? 0);
    setStatus('projectsCount', data.projects ?? 0);
    setStatus('newsCount', data.news ?? 0);
    setStatus('messagesCount', data.messages ?? 0);
    setStatus('scholarshipCount', data.pendingScholarships ?? 0);
    setStatus('partnershipCount', data.newPartnerships ?? 0);
    setStatus('volunteerCount', data.newVolunteers ?? 0);
    setStatus('backendStatus','Connected');
    setStatus('databaseStatus','Connected');
    const dataSource=document.getElementById('dataSourceStatus');
    if(dataSource){dataSource.textContent='Live MySQL database';dataSource.classList.add('health-ok');dataSource.classList.remove('health-bad');}
    document.getElementById('backendStatus')?.classList.add('health-ok');
    document.getElementById('databaseStatus')?.classList.add('health-ok');
    const status=document.querySelector('.status-badge');
    if(status){ status.textContent=data.websiteOpen ? '● Website Open' : '● Website Closed'; status.classList.toggle('health-ok',!!data.websiteOpen); status.classList.toggle('health-bad',!data.websiteOpen); }
    const dot=document.querySelector('.notification-dot');
    if(dot) dot.hidden = !(Number(data.messages||0)+Number(data.pendingScholarships||0)+Number(data.newPartnerships||0)+Number(data.newVolunteers||0));
  }catch(error){
    setStatus('backendStatus','Not Connected'); setStatus('databaseStatus','Not Connected');
    const dataSource=document.getElementById('dataSourceStatus');
    if(dataSource){dataSource.textContent='Database unavailable';dataSource.classList.add('health-bad');dataSource.classList.remove('health-ok');}
    document.getElementById('backendStatus')?.classList.add('health-bad'); document.getElementById('databaseStatus')?.classList.add('health-bad');
  }
  try{
    const activity = await apiFetch('/admin/activity');
    const list=document.querySelector('.activity-list');
    if(list){
      list.innerHTML = activity.length ? activity.map(item => `
        <div class="activity-item"><div class="activity-icon">${item.type==='message'?'✉':item.type==='scholarship'?'🎓':item.type==='partnership'?'🤝':'👤'}</div>
        <div class="activity-content"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.detail||'New activity')}</span></div><time>${formatDate(item.created_at)}</time></div>`).join('') : '<div class="empty-state">No recent activity.</div>';
    }
  }catch(e){}
  try{
    const chart=await apiFetch('/admin/chart-data'); renderPlatformChart(chart.totals); renderScholarshipChart(chart.scholarshipStatus);
  }catch(e){ document.getElementById('platformChart')?.replaceChildren(Object.assign(document.createElement('div'),{className:'empty-state',textContent:'Chart data unavailable.'})); }
  loadNotifications();
}

function renderPlatformChart(totals){
  const el=document.getElementById('platformChart'); if(!el)return;
  const items=[['Beneficiaries',totals.beneficiaries],['Projects',totals.projects],['Messages',totals.messages],['Scholarships',totals.scholarships],['Partnerships',totals.partnerships],['Volunteers',totals.volunteers]];
  const max=Math.max(1,...items.map(x=>Number(x[1])||0));
  el.innerHTML=items.map(([label,value])=>`<div class="bar-row"><span>${escapeHtml(label)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.round((Number(value)||0)/max*100)}%"></div></div><strong class="bar-value">${Number(value)||0}</strong></div>`).join('');
}
function renderScholarshipChart(items){
  const el=document.getElementById('scholarshipChart'); if(!el)return;
  if(!items?.length){el.innerHTML='<div class="empty-state">No applications yet.</div>';return;}
  el.innerHTML=items.map(x=>`<div class="donut-row"><span>${escapeHtml(x.label)}</span><strong>${Number(x.value)||0}</strong></div>`).join('');
}
async function loadNotifications(){
  const panel=document.getElementById('notificationPanel'); const list=document.getElementById('notificationList'); if(!panel||!list)return;
  try{ const rows=await apiFetch('/admin/notifications'); list.innerHTML=rows.length?rows.map(x=>`<div class="notification-item ${Number(x.unread)?'unread':''}"><div class="notification-icon">${x.type==='message'?'✉':x.type==='scholarship'?'🎓':x.type==='partnership'?'🤝':'👤'}</div><div><strong>${escapeHtml(x.title)}</strong><span>${escapeHtml(x.detail||'New activity')}</span><time>${formatDate(x.created_at)}</time></div></div>`).join(''):'<div class="empty-state">No notifications.</div>'; }catch(e){list.innerHTML='<div class="empty-state">Notifications unavailable.</div>';}
}
function initNotifications(){
  const btn=document.querySelector('.notification-btn'), panel=document.getElementById('notificationPanel'), close=document.getElementById('closeNotifications');
  if(!btn||!panel)return;
  btn.addEventListener('click',()=>{panel.hidden=!panel.hidden;if(!panel.hidden)loadNotifications();});
  close?.addEventListener('click',()=>panel.hidden=true);
}

function formatDate(value){
  if(!value) return '—';
  const date=new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString(undefined,{day:'2-digit',month:'short'});
}
function escapeHtml(value){
  return String(value ?? '').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
window.escapeHtml = escapeHtml;

function initAdminShell(){
  if(!adminToken() && !location.pathname.endsWith('/login.html')){ window.location.replace('login.html'); return; }
  const sidebar=document.getElementById('sidebar');
  const menuBtn=document.getElementById('menuBtn');
  const closeSidebar=document.getElementById('closeSidebar');
  const overlay=document.getElementById('sidebarOverlay');
  const close=()=>sidebar&&sidebar.classList.remove('show');
  if(menuBtn) menuBtn.addEventListener('click',()=>sidebar&&sidebar.classList.add('show'));
  if(closeSidebar) closeSidebar.addEventListener('click',close);
  if(overlay) overlay.addEventListener('click',close);
  renderAdminIdentity();
  loadDashboard();
  initNotifications();
}

document.addEventListener('DOMContentLoaded', initAdminShell);
