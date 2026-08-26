# Feature Spec: Basic User Auth (Single Business Account)

## User goal
A small business owner wants to securely sign up and log in to their CRM using their email and password so their business contact data is private, persistent, and accessible across devices.

## Flow
1. User navigates to the CRM. If not logged in, they see a clean, simple Welcome / Sign In screen with an option to switch to Sign Up.
2. If new: The user enters their Business Name, Email, and Password, then clicks **"Create Account"**.
3. If returning: The user enters their Email and Password, then clicks **"Sign In"**.
4. Upon successful login/signup, the user is immediately taken to their CRM Dashboard (`/`).
5. A user menu / profile header at the top right clearly shows their Business Name / Email and provides a one-click **"Sign Out"** button.
6. When the user logs out or the session expires, they are redirected back to the Sign In screen, and protected CRM routes/data are inaccessible.

## Acceptance criteria
- [ ] Sign Up form accepts Business Name, Email address, and Password with immediate inline validation for missing or invalid inputs.
- [ ] Sign In form accepts Email and Password, providing clear and friendly error messages for invalid credentials (e.g., "Incorrect email or password") without technical jargon.
- [ ] Authenticated session persists across browser page reloads and tab closures until explicitly signed out.
- [ ] Unauthenticated users attempting to access protected CRM views (Dashboard, Contact Details, Import, Add Contact) are automatically redirected to the Sign In screen.
- [ ] Navigation header displays the logged-in Business Name/Email and a clear, functional "Sign Out" action.
- [ ] Signing out terminates the session and immediately redirects the user to the Sign In screen.
- [ ] Contacts and pipeline data are securely scoped to the authenticated account.

## Explicitly out of scope
- Multi-seat team management, role-based access control (RBAC), and team invites.
- Social OAuth providers (Google, Apple, Microsoft) and SAML/SSO.
- Self-serve SMS 2FA / MFA authentication.
- Complex organization hierarchies or multi-tenant switching.
