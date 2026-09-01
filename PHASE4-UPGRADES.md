# ASK Bagbin Website — Phase 4 Upgrades

## Public Website / Database Integration
- Public projects, news and beneficiaries are now loaded from the backend database.
- Approved partners can be exposed through the public API.
- Public settings endpoint supports maintenance state and database-controlled logo URL.
- Contact submissions are sent to the database instead of showing a fake success message.
- Partnership and volunteer forms submit to the database.
- Scholarship form continues using the backend API.
- Added standalone dynamic News, Projects and Beneficiaries pages.
- Added working Partnership and Volunteer submission pages.
- Added graceful loading/error handling for public API content.

## Production note
The project still requires a configured MySQL database and environment variables from `.env.example` before deployment.
