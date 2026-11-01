Planzy backend security patch + "Delete my account"
====================================================
Copy these 4 files into the happyhop-backend project (same folders), then deploy.

  middleware/requireAdmin.js     NEW  - admin-only check using the ADMIN_EMAILS variable
  routes/auth.js                 CHANGED
     - GET  /api/auth/users               now needs an ADMIN login (was public)
     - POST /api/auth/set-venue-password  now needs an ADMIN login (was public = anyone could reset any password)
     - DELETE /api/auth/me                NEW - a parent deletes their own account
  controllers/authController.js  CHANGED - adds deleteAccount

BEFORE deploying, set this Railway variable on the backend service:
  ADMIN_EMAILS = <your admin login email(s), comma-separated>

The admin portal must send its login token on those two admin calls
(Claude updates admin.planzyjo.shop for this BEFORE the backend goes live).
