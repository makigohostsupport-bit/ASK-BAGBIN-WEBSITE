# ASK Bagbin Admin — Live Database Connection

The admin interface is database-backed. It does not use the JSON files in `admin/data` for production records.

## Connected resources

| Admin section | API | MySQL table | Public write/read flow |
|---|---|---|---|
| Scholarships | `/api/admin/records/scholarships` | `scholarship_applications` | Public application form → database → admin review |
| Beneficiaries | `/api/admin/records/beneficiaries` | `beneficiaries` | Admin → database → approved public directory |
| Projects | `/api/admin/records/projects` | `projects` | Admin → database → published public portfolio |
| News | `/api/admin/records/news` | `news` | Admin → database → published public updates |
| Partnerships | `/api/admin/records/partnerships` | `partnerships` | Public partnership form → database → admin review → approved partner directory |
| Messages | `/api/admin/records/messages` | `messages` | Public contact form → database → admin inbox |

The dashboard also reads live counts from these tables through `/api/admin/stats`, recent activity through `/api/admin/activity`, charts through `/api/admin/chart-data`, and notifications through `/api/admin/notifications`.

## Verify the connection

After starting the backend, an authenticated administrator can use the dashboard. Resource pages also perform a database health check and display `Database connected`.

The backend health endpoint is:

`GET /api/health`

The authenticated resource verification endpoint is:

`GET /api/admin/connection-check`

## Local startup

```bash
npm install
npm run db:seed-admin
npm start
```

Open:

`http://localhost:5000/admin/login.html`

For Docker:

```bash
docker compose up -d --build
```

Set a real `JWT_SECRET`, database password, CORS origin and public site URL before production deployment.
