# ASK Bagbin Education Fund — Production Readiness

## Included in this release
- Source-grounded content and images from the supplied 2025 Policy and Governance Framework.
- Compact navigation and responsive public pages.
- Scholarship application workflow with application ID/status lookup.
- Optional supporting-document upload (PDF/DOC/DOCX, 10MB limit) stored outside public static files; authorised administrators open documents through an authenticated endpoint.
- Admin CRUD for scholarships, beneficiaries, projects, news, partnerships, volunteers and messages.
- Project portfolio fields for location, category, impact summary, beneficiary count, dates and before/after imagery.
- Public beneficiary, project and news feeds with privacy-first empty states.
- Transparency & Accountability, Safeguarding, Privacy and Website Terms pages.
- Audit-log table and admin mutation logging.
- Security headers, rate limiting and production JWT-secret enforcement.
- Policy document available from the public Policy Briefs page.

## Donation system
Donation UI and donation solicitation components were intentionally removed at the user's request. Bank/mobile-money pages and donation-related UI were removed from the website as requested.

## Before go-live
1. Set a long random `JWT_SECRET` in the production environment.
2. Set production database credentials and a locked-down `CORS_ORIGIN`.
3. Use HTTPS and verify the domain in `PUBLIC_SITE_URL`.
4. Verify all published phone, email, banking/mobile-money and social-media details with the Foundation.
5. Approve the privacy, safeguarding, complaints and retention policies.
6. Populate real, approved project, beneficiary and news records through the admin panel.
7. Configure regular MySQL backups and test restoration.
8. Put uploads behind appropriate access controls and review who can download scholarship documents.
9. Configure transactional email/SMS externally if notifications are required; no provider credentials are bundled.
10. Run mobile, accessibility, performance, security and broken-link QA on the deployed domain.
