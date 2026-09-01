const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const config = require('../config/config');
const { requireAuth } = require('../middleware/auth');
const { rateLimit } = require('../middleware/security');

const router = express.Router();

router.post('/login', rateLimit({windowMs:60000,max:8,keyPrefix:'login'}), async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
    const [rows] = await db.query('SELECT id,name,email,password_hash,role,active FROM admins WHERE email=? LIMIT 1', [email]);
    const admin = rows[0];
    if (!admin || !admin.active || !(await bcrypt.compare(password, admin.password_hash))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = jwt.sign({ id: admin.id, name: admin.name, email: admin.email, role: admin.role }, config.jwtSecret, { expiresIn: '8h' });
    res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to sign in. Check the database connection.' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  res.json({ admin: req.admin });
});

router.get('/profile', requireAuth, async (req,res)=>{ try { const [[admin]]=await db.query('SELECT id,name,email,role,active,created_at,updated_at FROM admins WHERE id=?',[req.admin.id]); if(!admin)return res.status(404).json({message:'Administrator not found.'}); res.json({admin}); } catch(e){res.status(500).json({message:'Unable to load profile.'});} });

router.put('/profile', requireAuth, async (req,res)=>{ try { const name=String(req.body.name||'').trim(); const email=String(req.body.email||'').trim().toLowerCase(); if(name.length<2||!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({message:'Enter a valid name and email.'}); const [dup]=await db.query('SELECT id FROM admins WHERE email=? AND id<>?',[email,req.admin.id]); if(dup[0])return res.status(409).json({message:'That email is already in use.'}); await db.query('UPDATE admins SET name=?,email=? WHERE id=?',[name,email,req.admin.id]); res.json({message:'Profile updated. Please sign in again if your email changed.',admin:{id:req.admin.id,name,email,role:req.admin.role}}); } catch(e){res.status(500).json({message:'Unable to update profile.'});} });

router.post('/change-password', requireAuth, rateLimit({windowMs:60000,max:5,keyPrefix:'password'}), async (req, res) => {
  try {
    const current = String(req.body.currentPassword || '');
    const next = String(req.body.newPassword || '');
    if (next.length < 8) return res.status(400).json({ message: 'New password must contain at least 8 characters.' });
    const [rows] = await db.query('SELECT password_hash FROM admins WHERE id=?', [req.admin.id]);
    if (!rows[0] || !(await bcrypt.compare(current, rows[0].password_hash))) return res.status(400).json({ message: 'Current password is incorrect.' });
    const hash = await bcrypt.hash(next, 12);
    await db.query('UPDATE admins SET password_hash=? WHERE id=?', [hash, req.admin.id]);
    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to change password.' });
  }
});

module.exports = router;
