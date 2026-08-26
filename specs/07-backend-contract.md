# Backend Architecture & Contract: Route Restructuring & Public Landing Page vs Dashboard

## Next.js App Router Structure
- `/`: Public landing page (Hero, Value Proposition, CTAs, "Go to Dashboard" if logged in)
- `/login`: Public auth page (Sign in, Sign up, Google Auth, redirect to `/dashboard`)
- `/dashboard`: Protected CRM dashboard & contact workspace (`<AuthGuard>` protected)
- `/contacts/[id]`: Protected contact detail page (`<AuthGuard>` protected)

## Navigation Contracts
- Successful login/signup redirects to `/dashboard`
- "Back to Contacts" in contact detail links to `/dashboard`
- Sign out redirects to `/login`
- Root layout removes global `<AuthGuard>` blocking, applying it specifically to protected sections.
