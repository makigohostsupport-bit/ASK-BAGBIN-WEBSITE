ASK BAGBIN EDUCATION FUND — ADMIN PANEL

The admin panel is connected to the Node.js + MySQL backend. The pages below read and write live database records; the JSON files in admin/data are not used by the production admin interface.

PAGES
- login.html          Admin login
- dashboard.html      Live database statistics, activity and notifications
- beneficiaries.html  Manage beneficiaries
- scholarship-applications.html  Manage scholarship applications
- projects.html       Manage projects and before/after images
- news.html           Manage news and updates
- partnerships.html   Manage partnership requests
- messages.html       Manage contact messages
- users.html          Manage administrator accounts (super admin)
- settings.html       Live website settings and logo
- audit-logs.html     Database-backed accountability log

LIVE API RESOURCES
- /api/admin/records/beneficiaries
- /api/admin/records/scholarships
- /api/admin/records/projects
- /api/admin/records/news
- /api/admin/records/partnerships
- /api/admin/records/messages

The dashboard also uses /api/admin/stats, /api/admin/activity, /api/admin/chart-data and /api/admin/notifications.

LOCAL START
1. Start MySQL (or run docker compose up -d db).
2. Create/configure .env.
3. Run the schema, then: node backend/database/seed-admin.js
4. Start the backend: npm start
5. Open http://localhost:5000/admin/login.html

If using VS Code Live Server for the admin HTML, api-config.js automatically points API requests to http://localhost:5000/api.
