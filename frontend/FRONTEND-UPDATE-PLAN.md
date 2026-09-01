# Frontend functionality update plan

## Completed in this package

- Central manual image folder created: `assets/images/site/`
- Central image configuration created: `assets/js/image-config.js`
- Homepage hero images now use manual JPG slots.
- Page hero images now use manual JPG slots instead of generated SVG placeholders.
- Central API configuration created: `assets/js/api-config.js`.
- Phase 4 public API calls now use the central API base URL.
- Scholarship application now uses the central API base URL.
- Fixed the Phase 4 news link from `frontend/pages/news.html` to `pages/news.html`.
- Existing logo remains in `assets/images/logo/logo.png` and can be replaced manually.

## Still required for the frontend to work fully

1. **Run the Node backend** on port 5000 during local development.
2. **Run MySQL/MariaDB** and create the `ask_bagbin` database.
3. **Configure `.env`** correctly for the backend.
4. **Configure CORS** on the backend to allow the frontend origin during Live Server development (`http://127.0.0.1:5500` / `http://localhost:5500`).
5. **Test all public API endpoints:**
   - GET `/api/public/projects`
   - GET `/api/public/news`
   - GET `/api/public/beneficiaries`
   - GET `/api/public/partners`
   - GET `/api/public/settings`
   - POST `/api/public/messages`
   - POST `/api/public/partnerships`
   - POST `/api/public/volunteers`
   - POST `/api/public/scholarships`
6. **Test the forms** and confirm submissions appear in the admin dashboard/database.
7. **Connect dynamic uploaded images** from the backend so project/news/beneficiary images uploaded by the admin render correctly.
8. **Production API path:** after cPanel deployment, change `assets/js/api-config.js` to `/api` if frontend and backend share the same domain.
9. **Test every navigation item** on desktop and mobile.
10. **Test the maintenance/closed-site switch** against the backend settings.
11. **Test broken-image fallback** for every dynamic API record.
12. **Test HTTPS/CORS** after deployment.

## Important architecture

The frontend should not contain hard-coded API URLs in individual pages. Use `assets/js/api-config.js`.

The frontend should not require editing HTML every time a normal photograph changes. Replace the files inside `assets/images/site/` or edit `assets/js/image-config.js`.
