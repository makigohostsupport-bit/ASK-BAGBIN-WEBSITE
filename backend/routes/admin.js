const express = require('express');
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();
router.use(requireAuth);

const resources = {
  beneficiaries: {table:'beneficiaries', order:'created_at DESC', writable:['name','programme','institution','level','location','status','image_url']},
  projects: {table:'projects', order:'created_at DESC', writable:['title','description','category','location','status','image_url','impact_summary','beneficiaries_count','start_date','completion_date','before_image_url','after_image_url']},
  news: {table:'news', order:'COALESCE(published_at,created_at) DESC', writable:['title','excerpt','content','author','status','image_url','published_at']},
  scholarships: {table:'scholarship_applications', order:'submitted_at DESC', writable:['full_name','email','phone','date_of_birth','student_id','programme','institution','level','statement','document_url','status']},
  partnerships: {table:'partnerships', order:'created_at DESC', writable:['organization_name','contact_name','email','phone','message','status']},
  volunteers: {table:'volunteers', order:'created_at DESC', writable:['full_name','email','phone','skills','message','status']},
  messages: {table:'messages', order:'created_at DESC', writable:['name','email','subject','message','is_read']},
  users: {table:'admins', order:'created_at DESC', writable:['name','email','role','active']}
};
function getResource(name){ return resources[name]; }
function requireSuperAdmin(req,res,next){ if(req.admin?.role!=='super_admin') return res.status(403).json({message:'Super administrator access is required.'}); next(); }
async function audit(req,action,resource,recordId,details={}){ try{ await db.query('INSERT INTO audit_logs (admin_id,action,resource,record_id,details,ip_address) VALUES (?,?,?,?,?,?)',[req.admin?.id||null,action,resource,recordId||null,JSON.stringify(details),req.ip||null]); }catch(e){ console.warn('Audit log failed:',e.message); } }
function cleanPayload(config, body){
  const out={};
  config.writable.forEach(k=>{ if(Object.prototype.hasOwnProperty.call(body,k)) out[k]=body[k]; });
  return out;
}
function validateId(req,res,next){ const id=Number(req.params.id); if(!Number.isInteger(id)||id<1) return res.status(400).json({message:'Invalid record ID.'}); req.recordId=id; next(); }

router.get('/connection-check', async (req,res)=>{
  try {
    const tables = ['scholarship_applications','beneficiaries','projects','news','partnerships','messages'];
    const result = {};
    for (const table of tables) { const [[row]] = await db.query(`SELECT COUNT(*) AS count FROM ${table}`); result[table] = Number(row.count); }
    res.json({connected:true,database:db.pool?.config?.connectionConfig?.database || 'ask_bagbin',tables:result});
  } catch(e) { console.error(e); res.status(503).json({connected:false,message:'Database connection failed.'}); }
});

router.get('/stats', async (req,res)=>{
  try {
    const [[b]] = await db.query('SELECT COUNT(*) count FROM beneficiaries');
    const [[p]] = await db.query("SELECT COUNT(*) count FROM projects WHERE status='Published'");
    const [[n]] = await db.query("SELECT COUNT(*) count FROM news WHERE status='Published'");
    const [[m]] = await db.query('SELECT COUNT(*) count FROM messages WHERE is_read=0');
    const [[s]] = await db.query("SELECT COUNT(*) count FROM scholarship_applications WHERE status='Pending'");
    const [[pt]] = await db.query("SELECT COUNT(*) count FROM partnerships WHERE status='New'");
    const [[v]] = await db.query("SELECT COUNT(*) count FROM volunteers WHERE status='New'");
    const [[setting]] = await db.query('SELECT website_open FROM settings WHERE id=1');
    res.json({beneficiaries:Number(b.count),projects:Number(p.count),news:Number(n.count),messages:Number(m.count),pendingScholarships:Number(s.count),newPartnerships:Number(pt.count),newVolunteers:Number(v.count),websiteOpen:Boolean(setting?.website_open)});
  } catch(e){ console.error(e); res.status(500).json({message:'Unable to load dashboard statistics.'}); }
});

router.get('/activity', async (req,res)=>{
  try { const [rows]=await db.query(`SELECT 'message' type,id,name title,subject detail,created_at FROM messages UNION ALL SELECT 'scholarship',id,full_name,programme,submitted_at FROM scholarship_applications UNION ALL SELECT 'partnership',id,organization_name,status,created_at FROM partnerships UNION ALL SELECT 'volunteer',id,full_name,skills,created_at FROM volunteers ORDER BY created_at DESC LIMIT 10`); res.json(rows); }
  catch(e){ console.error(e); res.status(500).json({message:'Unable to load activity.'}); }
});

router.get('/records/:resource', async (req,res)=>{
  const config=getResource(req.params.resource); if(!config) return res.status(404).json({message:'Resource not found.'}); if(config.table==='admins' && req.admin?.role!=='super_admin') return res.status(403).json({message:'Super administrator access is required.'});
  try { const q=String(req.query.q||'').trim(); const page=Math.max(1,Number(req.query.page)||1); const limit=Math.min(100,Math.max(1,Number(req.query.limit)||25)); const offset=(page-1)*limit; const searchable=config.writable; const where=q&&searchable.length?`WHERE ${searchable.map(k=>`CAST(\`${k}\` AS CHAR) LIKE ?`).join(' OR ')}`:''; const params=q?searchable.map(()=>`%${q}%`):[]; const [[total]]=await db.query(`SELECT COUNT(*) count FROM ${config.table} ${where}`,params); const [rows]=await db.query(`SELECT * FROM ${config.table} ${where} ORDER BY ${config.order} LIMIT ? OFFSET ?`,[...params,limit,offset]); if(config.table==='admins') rows.forEach(r=>delete r.password_hash); res.setHeader('X-Total-Count',Number(total.count)); res.setHeader('X-Page',page); res.setHeader('X-Page-Size',limit); res.json(rows); }
  catch(e){ console.error(e); res.status(500).json({message:'Unable to load records.'}); }
});

router.get('/records/:resource/:id', validateId, async (req,res)=>{
  const config=getResource(req.params.resource); if(!config) return res.status(404).json({message:'Resource not found.'});
  try { const [rows]=await db.query(`SELECT * FROM ${config.table} WHERE id=? LIMIT 1`,[req.recordId]); if(!rows[0]) return res.status(404).json({message:'Record not found.'}); if(config.table==='admins') delete rows[0].password_hash; res.json(rows[0]); }
  catch(e){ console.error(e); res.status(500).json({message:'Unable to load record.'}); }
});

router.post('/records/:resource', async (req,res)=>{
  const config=getResource(req.params.resource); if(!config) return res.status(404).json({message:'Resource not found.'});
  try {
    const data=cleanPayload(config,req.body); if(!Object.keys(data).length) return res.status(400).json({message:'No valid fields supplied.'});
    if(config.table==='admins') return requireSuperAdmin(req,res,()=>res.status(403).json({message:'Use the dedicated administrator security workflow.'}));
    const keys=Object.keys(data), vals=keys.map(k=>data[k]);
    const [result]=await db.query(`INSERT INTO ${config.table} (${keys.join(',')}) VALUES (${keys.map(()=>'?').join(',')})`,vals);
    const [rows]=await db.query(`SELECT * FROM ${config.table} WHERE id=?`,[result.insertId]); await audit(req,'create',req.params.resource,result.insertId,{fields:Object.keys(data)}); res.status(201).json(rows[0]);
  } catch(e){ console.error(e); res.status(500).json({message:'Unable to create record.'}); }
});

router.put('/records/:resource/:id', validateId, async (req,res)=>{
  const config=getResource(req.params.resource); if(!config) return res.status(404).json({message:'Resource not found.'}); if(config.table==='admins' && req.admin?.role!=='super_admin') return res.status(403).json({message:'Super administrator access is required.'});
  try {
    if(config.table==='admins' && Object.prototype.hasOwnProperty.call(req.body,'password_hash')) return res.status(400).json({message:'Password changes are not accepted here.'});
    const data=cleanPayload(config,req.body); const keys=Object.keys(data); if(!keys.length) return res.status(400).json({message:'No valid fields supplied.'});
    const [result]=await db.query(`UPDATE ${config.table} SET ${keys.map(k=>`${k}=?`).join(',')} WHERE id=?`,[...keys.map(k=>data[k]),req.recordId]);
    if(!result.affectedRows) return res.status(404).json({message:'Record not found.'});
    const [rows]=await db.query(`SELECT * FROM ${config.table} WHERE id=?`,[req.recordId]); if(config.table==='admins') delete rows[0].password_hash; await audit(req,'update',req.params.resource,req.recordId,{fields:Object.keys(data)}); res.json(rows[0]);
  } catch(e){ console.error(e); res.status(500).json({message:'Unable to update record.'}); }
});

router.delete('/records/:resource/:id', validateId, async (req,res)=>{
  const config=getResource(req.params.resource); if(!config) return res.status(404).json({message:'Resource not found.'});
  if(config.table==='admins') return res.status(403).json({message:'Admin users cannot be deleted from this interface.'});
  try { const [result]=await db.query(`DELETE FROM ${config.table} WHERE id=?`,[req.recordId]); if(!result.affectedRows) return res.status(404).json({message:'Record not found.'}); res.json({message:'Record deleted.'}); }
  catch(e){ console.error(e); res.status(500).json({message:'Unable to delete record.'}); }
});

router.put('/messages/:id/read', validateId, async (req,res)=>{
  try { const [result]=await db.query('UPDATE messages SET is_read=1 WHERE id=?',[req.recordId]); if(!result.affectedRows) return res.status(404).json({message:'Message not found.'}); res.json({message:'Message marked as read.'}); }
  catch(e){ res.status(500).json({message:'Unable to update message.'}); }
});


router.get('/notifications', async (req,res)=>{
  try {
    const [rows]=await db.query(`
      SELECT * FROM (
        SELECT id, 'message' AS type, name AS title, subject AS detail, is_read AS unread, created_at FROM messages
        UNION ALL
        SELECT id, 'scholarship', full_name, programme, IF(status='Pending',1,0), submitted_at FROM scholarship_applications
        UNION ALL
        SELECT id, 'partnership', organization_name, status, IF(status='New',1,0), created_at FROM partnerships
        UNION ALL
        SELECT id, 'volunteer', full_name, skills, IF(status='New',1,0), created_at FROM volunteers
      ) activity
      ORDER BY created_at DESC LIMIT 20`);
    res.json(rows);
  } catch(e){ console.error(e); res.status(500).json({message:'Unable to load notifications.'}); }
});

router.get('/chart-data', async (req,res)=>{
  try {
    const [[messages]] = await db.query('SELECT COUNT(*) count FROM messages');
    const [[scholarships]] = await db.query('SELECT COUNT(*) count FROM scholarship_applications');
    const [[partnerships]] = await db.query('SELECT COUNT(*) count FROM partnerships');
    const [[volunteers]] = await db.query('SELECT COUNT(*) count FROM volunteers');
    const [[beneficiaries]] = await db.query('SELECT COUNT(*) count FROM beneficiaries');
    const [[projects]] = await db.query('SELECT COUNT(*) count FROM projects');
    const [scholarshipStatus] = await db.query('SELECT status, COUNT(*) count FROM scholarship_applications GROUP BY status');
    const [projectStatus] = await db.query('SELECT status, COUNT(*) count FROM projects GROUP BY status');
    res.json({
      totals:{messages:Number(messages.count),scholarships:Number(scholarships.count),partnerships:Number(partnerships.count),volunteers:Number(volunteers.count),beneficiaries:Number(beneficiaries.count),projects:Number(projects.count)},
      scholarshipStatus:scholarshipStatus.map(r=>({label:r.status,value:Number(r.count)})),
      projectStatus:projectStatus.map(r=>({label:r.status,value:Number(r.count)}))
    });
  } catch(e){ console.error(e); res.status(500).json({message:'Unable to load dashboard chart data.'}); }
});

router.get('/settings', async (req,res)=>{ try { const [rows]=await db.query('SELECT * FROM settings WHERE id=1'); res.json(rows[0]||{}); } catch(e){ res.status(500).json({message:'Unable to load settings.'}); } });
router.put('/settings', async (req,res)=>{ try { const open=req.body.websiteOpen?1:0; const message=String(req.body.maintenanceMessage||'Our website is temporarily unavailable. Please check back soon.').slice(0,500); const logoUrl=req.body.logoUrl ? String(req.body.logoUrl).slice(0,500) : null; await db.query('UPDATE settings SET website_open=?,maintenance_message=?,logo_url=COALESCE(?,logo_url) WHERE id=1',[open,message,logoUrl]); res.json({message:'Settings saved.',websiteOpen:Boolean(open)}); } catch(e){ res.status(500).json({message:'Unable to save settings.'}); } });

module.exports=router;

router.get('/audit-logs', requireSuperAdmin, async (req,res)=>{ try{ const limit=Math.min(100,Math.max(1,Number(req.query.limit)||50)); const [rows]=await db.query('SELECT a.id,a.action,a.resource,a.record_id,a.ip_address,a.created_at,u.name AS admin_name FROM audit_logs a LEFT JOIN admins u ON u.id=a.admin_id ORDER BY a.created_at DESC LIMIT ?',[limit]); res.json(rows); }catch(e){res.status(500).json({message:'Unable to load audit logs.'});} });
