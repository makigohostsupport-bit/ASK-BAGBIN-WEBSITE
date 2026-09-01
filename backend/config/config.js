require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT || 5000),
  jwtSecret: process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? (()=>{ throw new Error('JWT_SECRET must be set in production.'); })() : 'local-development-secret-change-this'),
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME || 'ask_bagbin',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  }
};
