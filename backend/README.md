# ASK Bagbin Education Fund Backend

## Requirements
- Node.js 18+
- MySQL 8+ (XAMPP MySQL is fine)

## Setup
1. Copy `.env.example` to `.env`.
2. Open MySQL Workbench or phpMyAdmin and run `backend/database/schema.sql`.
3. Run `npm install` from the project root.
4. Run `node backend/database/seed-admin.js` to create the first administrator.
5. Run `npm start`.
6. Open `http://localhost:5000/` for the website and `http://localhost:5000/admin/` for the admin login.

Default development credentials are taken from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` (or the safe example values printed by the seed script). Change them before deployment.
