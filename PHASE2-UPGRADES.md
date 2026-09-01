# ASK Bagbin Website Upgrade — Phase 2

Implemented in this build:

1. **Admin authentication repair**
   - Unified the JWT/localStorage keys used by login and the admin dashboard.
   - Removed the hard-coded `http://localhost:5000` login dependency so the admin works from the same deployed host.
   - Added automatic redirect when an existing admin session is detected.
   - Improved session-expiry handling.

2. **Dashboard/backend connection**
   - Dashboard statistics now use the authenticated API.
   - Recent activity now includes messages, scholarship applications, partnerships and volunteers.
   - Notification indicator reflects outstanding admin activity.
   - Admin identity is loaded from the authenticated session.

3. **Admin data foundation**
   - Added authenticated record-list endpoints for beneficiaries, projects, news, scholarships, partnerships, volunteers, messages and admin users.
   - Admin password hashes are never returned by the users endpoint.

4. **Admin UI polish**
   - Added responsive mobile sidebar behavior.
   - Added overlay support for mobile navigation.
   - Added empty-state styling and logo consistency.

5. **Production configuration improvement**
   - Production mode now requires `JWT_SECRET` instead of silently using a development secret.

## Next roadmap phase

- Connect each management page to the new API records.
- Add create/edit/delete forms with validation and role permissions.
- Connect public forms and public content fully to the database.
- Add image/document upload workflows.
- Add pagination, search and filters.
- Add audit logs and stronger production security controls.
- Run full browser/mobile QA after database and Node dependencies are installed.
