# ASK Bagbin Education Fund Website

## Run locally
1. Copy `.env.example` to `.env` and enter your database details and a strong JWT secret.
2. Run `npm install`.
3. Import `backend/database/schema.sql` into MySQL.
4. Run `node backend/database/seed-admin.js` to create the initial administrator.
5. Start with `npm run dev`.
6. Open `http://localhost:5000/` for the website and `http://localhost:5000/admin/` for administration.

Do not commit `.env`, `node_modules`, or uploaded runtime files.


## Professional release 3.0

This release includes a source-grounded public website, scholarship application and status workflow, project/beneficiary/news publishing feeds, partner/volunteer submissions, accountability pages, audit logging and protected scholarship-document handling. Donation and transfer UI has been removed.

See `PRODUCTION-READINESS.md` for deployment requirements.
