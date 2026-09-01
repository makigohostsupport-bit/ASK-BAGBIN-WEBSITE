# ASK Bagbin Education Fund — Phase 6 Upgrades

## Production-ready dashboard and deployment

### Completed
- Added dashboard platform-activity visualizations using live database counts.
- Added scholarship application pipeline summary.
- Added admin notification centre for messages, scholarships, partnerships and volunteers.
- Added improved backend/database health presentation.
- Added secure 404 page instead of falling back to the homepage for missing GET routes.
- Added server-enforced maintenance mode for the homepage and public HTML pages when the website is closed.
- Added dedicated maintenance page.
- Added production Dockerfile and Docker Compose deployment stack.
- Added `.env.production.example` with explicit production configuration requirements.
- Added persistent Docker volumes for MySQL and uploaded media.
- Kept secrets out of the repository; production values must be supplied through environment variables.

## Deployment
1. Copy `.env.production.example` to `.env`.
2. Set a unique long `JWT_SECRET` and strong database passwords.
3. Set `PUBLIC_SITE_URL` and `CORS_ORIGIN` to the real HTTPS domain.
4. Run `docker compose up -d --build`.
5. Create the initial administrator using the project's seed workflow.
6. Put HTTPS/reverse-proxy infrastructure in front of port 5000.
7. Back up the `mysql_data` volume and `backend/uploads` volume regularly.

## Operational notes
- Do not commit `.env` or production secrets.
- Configure DNS and TLS at the hosting provider/reverse proxy.
- Test login, public forms, media uploads, maintenance mode and backups after deployment.
