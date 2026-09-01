const express = require('express');
const db = require('../config/db');
const router = express.Router();
const {rateLimit}=require('../middleware/security');
const writeLimit=rateLimit({windowMs:60000,max:12,keyPrefix:'public-write'});
router.use(async (req,res,next)=>{
  try { const [[setting]]=await db.query('SELECT website_open, maintenance_message FROM settings WHERE id=1'); if(setting && !setting.website_open) return res.status(503).json({message:setting.maintenance_message||'Our website is temporarily unavailable.'}); next(); }
  catch(e){ next(); }
});

router.get('/projects', async (req,res)=>{ const [rows]=await db.query("SELECT * FROM projects WHERE status='Published' ORDER BY created_at DESC"); res.json(rows); });
router.get('/news', async (req,res)=>{ const [rows]=await db.query("SELECT * FROM news WHERE status='Published' ORDER BY COALESCE(published_at,created_at) DESC"); res.json(rows); });
router.get('/beneficiaries', async (req,res)=>{ const [rows]=await db.query("SELECT * FROM beneficiaries WHERE status='Active' ORDER BY created_at DESC"); res.json(rows); });
router.get('/partners', async (req,res)=>{ const [rows]=await db.query("SELECT id,organization_name,contact_name,status,created_at FROM partnerships WHERE status='Approved' ORDER BY created_at DESC"); res.json(rows); });
router.get('/settings', async (req,res)=>{ const [[row]]=await db.query('SELECT website_open, maintenance_message, logo_url FROM settings WHERE id=1'); res.json(row||{}); });

router.post('/scholarships', writeLimit, async (req,res)=>{
  const {fullName,email,phone,programme,institution,level,statement,dateOfBirth,studentId,documentUrl,website}=req.body;
  if(String(website||'').trim()) return res.status(400).json({message:'Unable to submit this application.'});
  if(!fullName||!email) return res.status(400).json({message:'Full name and email are required.'});
  const normalizedEmail=String(email).trim().toLowerCase();
  if(!/^\S+@\S+\.\S+$/.test(normalizedEmail)) return res.status(400).json({message:'Enter a valid email address.'});
  const [result]=await db.query('INSERT INTO scholarship_applications (full_name,email,phone,date_of_birth,student_id,programme,institution,level,statement,document_url) VALUES (?,?,?,?,?,?,?,?,?,?)',[fullName,normalizedEmail,phone,dateOfBirth||null,studentId||null,programme,institution,level,statement,documentUrl||null]);
  res.status(201).json({message:'Scholarship application submitted successfully.',applicationId:result.insertId});
});
router.post('/partnerships', writeLimit, async (req,res)=>{ const {organizationName,contactName,email,phone,message,website}=req.body; if(String(website||'').trim()) return res.status(400).json({message:'Unable to submit this request.'}); if(!organizationName||!email) return res.status(400).json({message:'Organization name and email are required.'}); await db.query('INSERT INTO partnerships (organization_name,contact_name,email,phone,message) VALUES (?,?,?,?,?)',[organizationName,contactName,email,phone,message]); res.status(201).json({message:'Partnership request submitted successfully.'}); });
router.post('/volunteers', writeLimit, async (req,res)=>{ const {fullName,email,phone,skills,message,website}=req.body; if(String(website||'').trim()) return res.status(400).json({message:'Unable to submit this request.'}); if(!fullName||!email) return res.status(400).json({message:'Full name and email are required.'}); await db.query('INSERT INTO volunteers (full_name,email,phone,skills,message) VALUES (?,?,?,?,?)',[fullName,email,phone,skills,message]); res.status(201).json({message:'Volunteer application submitted successfully.'}); });
router.post('/messages', writeLimit, async (req,res)=>{ const {name,email,subject,message,website}=req.body; if(String(website||'').trim()) return res.status(400).json({message:'Unable to send this message.'}); if(!name||!email||!message) return res.status(400).json({message:'Name, email and message are required.'}); await db.query('INSERT INTO messages (name,email,subject,message) VALUES (?,?,?,?)',[name,email,subject,message]); res.status(201).json({message:'Message sent successfully.'}); });


router.get('/scholarships/status', async (req,res)=>{
  try {
    const id=Number(req.query.id); const email=String(req.query.email||'').trim().toLowerCase();
    if(!Number.isInteger(id)||id<1||!email) return res.status(400).json({message:'Application ID and email are required.'});
    const [[row]]=await db.query('SELECT id,full_name,programme,institution,level,status,submitted_at,updated_at FROM scholarship_applications WHERE id=? AND LOWER(email)=? LIMIT 1',[id,email]);
    if(!row)return res.status(404).json({message:'No scholarship application matched those details.'});
    res.json({application:row});
  } catch(e){console.error(e);res.status(500).json({message:'Unable to check application status.'});}
});

module.exports = router;

router.get('/reports', async (req,res)=>{ try { const [rows]=await db.query("SELECT id,title,excerpt,content,author,status,image_url,published_at FROM news WHERE status='Published' ORDER BY COALESCE(published_at,created_at) DESC"); res.json(rows); } catch(e){ res.status(500).json({message:'Unable to load reports.'}); } });
