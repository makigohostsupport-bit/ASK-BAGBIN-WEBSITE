# Phase 6 Login Fix

## What was fixed

The admin login previously called `/api/auth/login` relative to the page origin. If `admin/login.html` was opened through a static server such as VS Code Live Server, that server received the POST request and could return `405 Method Not Allowed` because it does not run the Node API.

The admin now detects common local static-server usage and sends API requests to:

`http://localhost:5000/api`

You can override this for a separate production API host by defining `window.ASK_BAGBIN_API_BASE` before `api-config.js`.

## Recommended local startup

1. Install Node.js 18+.
2. In the project root run `npm install`.
3. Configure `.env` from `.env.example`.
4. Make sure MySQL is running and the `ask_bagbin` schema is imported.
5. Run `npm start`.
6. Open `http://localhost:5000/admin/`.

Do not use a static-file server to serve `admin/login.html` when you expect it to handle API POST requests unless `api-config.js` is configured to point at the running Node backend.
