require('dotenv').config();
const bcrypt=require('bcryptjs');
const db=require('../config/db');
(async()=>{
  const email=process.env.ADMIN_EMAIL||'admin@askbagbinedufund.org';
  const password=process.env.ADMIN_PASSWORD||'ChangeMe123!';
  const hash=await bcrypt.hash(password,12);
  await db.query(`INSERT INTO admins (name,email,password_hash,role) VALUES (?,?,?,'super_admin') ON DUPLICATE KEY UPDATE name=VALUES(name),password_hash=VALUES(password_hash),role='super_admin',active=1`,['Administrator',email,hash]);
  console.log(`Admin ready: ${email}`);
  console.log(`Password: ${password}`);
  await db.end();
})().catch(e=>{console.error(e);process.exit(1);});
