# Phase 5 — Production Readiness & Security

Implemented upgrades:

- Secure response headers and disabled Express fingerprinting.
- Configurable CORS origin.
- Login/password rate limiting.
- Public form rate limiting.
- Authenticated image upload endpoint (PNG/JPG/WebP, max 5MB).
- Admin content manager now supports server-side search and pagination.
- Image uploads can be attached to resource records through the generic admin editor.
- Administrator profile editing (name/email).
- Server-side password change remains bcrypt-hashed.
- Scholarship application status lookup by application ID + email.
- Added public scholarship status page.
- Added robots.txt and XML sitemap endpoints.
- Production environment template updated.

Before launch:

1. Set a strong JWT_SECRET and database credentials.
2. Set PUBLIC_SITE_URL and CORS_ORIGIN to the real HTTPS domain.
3. Run the SQL schema against the production MySQL database.
4. Put the Node server behind HTTPS/reverse proxy.
5. Back up the database and backend/uploads directory.
6. Configure a real SMTP/email provider for application notifications if email delivery is required.
