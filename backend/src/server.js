const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');
const db = require('../config/db');
const authRoutes = require('../routes/auth');
const adminRoutes = require('../routes/admin');
const publicRoutes = require('../routes/public');
const uploadRoutes = require('../routes/uploads');
const {securityHeaders} = require('../middleware/security');

const app = express();

async function ensureProductionSchema(){
  const migrations = [
    "ALTER TABLE scholarship_applications ADD COLUMN date_of_birth DATE NULL",
    "ALTER TABLE scholarship_applications ADD COLUMN student_id VARCHAR(120) NULL",
    "ALTER TABLE projects ADD COLUMN impact_summary TEXT NULL",
    "ALTER TABLE projects ADD COLUMN beneficiaries_count INT NULL",
    "ALTER TABLE projects ADD COLUMN start_date DATE NULL",
    "ALTER TABLE projects ADD COLUMN completion_date DATE NULL",
    "ALTER TABLE projects ADD COLUMN before_image_url VARCHAR(500) NULL",
    "ALTER TABLE projects ADD COLUMN after_image_url VARCHAR(500) NULL",
    `CREATE TABLE IF NOT EXISTS audit_logs (id BIGINT AUTO_INCREMENT PRIMARY KEY, admin_id INT NULL, action VARCHAR(80) NOT NULL, resource VARCHAR(80) NOT NULL, record_id INT NULL, details JSON NULL, ip_address VARCHAR(64) NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX idx_audit_created (created_at), INDEX idx_audit_resource (resource))`
  ];
  for (const sql of migrations) { try { await db.query(sql); } catch(e) { if(!/duplicate column|already exists/i.test(String(e.message))) console.warn('Schema migration warning:', e.message); } }
}

const root = path.resolve(__dirname, '../..');
const uploads = path.join(root, 'backend', 'uploads');
const publicImages = path.join(uploads, 'images');
fs.mkdirSync(publicImages, { recursive: true });
fs.mkdirSync(path.join(uploads, 'private-documents'), { recursive: true });

app.disable('x-powered-by');
app.use(securityHeaders);
app.use(cors({origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(v=>v.trim()) : true}));
app.use(express.json({limit:'2mb'}));
app.use(express.urlencoded({extended:true}));
app.use('/uploads/images', express.static(publicImages, {maxAge:'7d'}));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/uploads', uploadRoutes);

app.get('/api/health', async (req,res)=>{
  try { await db.query('SELECT 1'); res.json({ok:true,database:true,message:'ASK Bagbin backend is running.'}); }
  catch(e){ res.status(503).json({ok:false,database:false,message:'Backend is running but database is unavailable.'}); }
});

const adminDir = path.join(root, 'admin');
const frontendDir = path.join(root, 'frontend');
app.use('/admin', express.static(adminDir));
app.use('/frontend', async (req,res,next)=>{
  if (req.method==='GET' && req.path.endsWith('.html')) {
    try { const [[setting]]=await db.query('SELECT website_open FROM settings WHERE id=1'); if(setting && !setting.website_open) return res.status(503).sendFile(path.join(frontendDir,'maintenance.html')); } catch(e) {}
  }
  next();
}, express.static(frontendDir));
app.get('/admin', (req,res)=>res.redirect('/admin/login.html'));
app.get('/maintenance.html', (req,res)=>res.sendFile(path.join(frontendDir,'maintenance.html')));
app.get('/', async (req,res)=>{
  try { const [[setting]]=await db.query('SELECT website_open FROM settings WHERE id=1'); if(setting && !setting.website_open) return res.status(503).sendFile(path.join(frontendDir,'maintenance.html')); } catch(e) {}
  return res.sendFile(path.join(frontendDir,'index.html'));
});
app.get('/robots.txt',(req,res)=>res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: '+(process.env.PUBLIC_SITE_URL||'http://localhost:5000')+'/sitemap.xml\n'));
app.get('/sitemap.xml',(req,res)=>{ const base=process.env.PUBLIC_SITE_URL||'http://localhost:5000'; const pages=['/','/frontend/pages/about.html','/frontend/pages/who-we-are.html','/frontend/pages/founder.html','/frontend/pages/executive-council.html','/frontend/pages/scholarship.html','/frontend/pages/projects.html','/frontend/pages/beneficiaries.html','/frontend/pages/advocacy.html','/frontend/pages/research-reports.html','/frontend/pages/policy-briefs.html','/frontend/pages/partnership.html','/frontend/pages/our-partners.html','/frontend/pages/news.html','/frontend/pages/transparency.html','/frontend/pages/safeguarding.html','/frontend/pages/privacy.html','/frontend/pages/terms.html','/frontend/pages/complaints.html','/frontend/pages/faq.html','/frontend/pages/contact.html']; res.type('application/xml').send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+pages.map(p=>'<url><loc>'+base+p+'</loc></url>').join('')+'</urlset>'); });
app.use((req,res,next)=>{
  if (req.path.startsWith('/api/')) return res.status(404).json({message:'API route not found.'});
  if (req.method === 'GET') return res.status(404).sendFile(path.join(frontendDir,'404.html'));
  next();
});

app.use((err,req,res,next)=>{ console.error(err); res.status(500).json({message:'Unexpected server error.'}); });

ensureProductionSchema().catch(e=>console.error('Schema initialization failed:',e)).finally(()=>app.listen(config.port, ()=>console.log(`ASK Bagbin server running at http://localhost:${config.port}`)));
