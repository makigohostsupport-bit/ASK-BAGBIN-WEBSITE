# ASK Bagbin Website — Phase 3 Upgrades

## Database-backed administration
- Added authenticated CRUD endpoints for beneficiaries, projects, news, scholarships, partnerships, volunteers and messages.
- Added record search/edit/delete UI for the main administration pages.
- Scholarship applications now use the backend database instead of browser localStorage.
- Messages can be marked read and are stored in the backend.
- Website maintenance status is enforced by the public API.
- Admin dashboard statistics continue to use live database counts.

## Important production step
Run the database schema in `backend/database/schema.sql`, configure `.env`, then install dependencies with `npm ci` and start the server with `npm start`.
