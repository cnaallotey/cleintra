# Feature Spec: Route Restructuring & Public Landing Page vs Dashboard

## User goal
A prospective small business owner visiting the CRM website can quickly understand what the product does on a clean, welcoming public landing page and jump straight to sign up or sign in, while active users manage their leads inside a dedicated, secure dashboard at `/dashboard`.

## Flow
1. A visitor navigates to the root URL (`/`) and sees a modern, welcoming public landing page showcasing the CRM's core benefits (simple lead lists, call tracking, customizable pipelines) with prominent "Sign In" and "Get Started" call-to-action buttons.
2. If an authenticated user visits the landing page (`/`), the header and hero provide an instant "Go to Dashboard" action to resume working.
3. If an unauthenticated visitor tries to navigate directly to `/dashboard` (or internal contact pages), they are redirected to `/login`.
4. When a user signs in or creates a new account on `/login`, they are immediately taken to `/dashboard`.
5. From `/dashboard` and internal CRM views, the user has access to their full CRM workspace (contact management, stats, filtering, import, settings) and can sign out at any time.

## Acceptance criteria
- [ ] The root URL (`/`) serves a public, responsive landing page explaining the CRM value proposition without requiring authentication.
- [ ] Landing page features clear call-to-action buttons ("Get Started" and "Sign In") leading to `/login`.
- [ ] When an authenticated user visits `/`, the landing page clearly displays a "Go to Dashboard" button.
- [ ] The full authenticated CRM workspace (stats cards, contact table, search, stage filters, new contact, and CSV import) is hosted at `/dashboard`.
- [ ] Unauthenticated requests to `/dashboard` automatically redirect to `/login`.
- [ ] Successful login or registration redirects the user directly to `/dashboard`.
- [ ] Header navigation cleanly differentiates between public visitor mode on `/` (brand and sign-in CTAs) and authenticated app mode on `/dashboard` (business name, dashboard link, settings, and sign-out).
- [ ] All existing CRM operations (contact detail navigation, stage filtering, CSV upload, call logging) work seamlessly on `/dashboard`.

## Explicitly out of scope
- Multi-page marketing website (e.g. blog, dynamic pricing calculator, interactive feature matrices).
- Live interactive product sandbox on the landing page without signing up.
- Marketing analytics trackers or CMS-driven marketing content management.
