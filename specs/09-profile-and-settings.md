# Feature Spec: Business Profile & Settings Page (`/settings`)

## User goal
Small business owners can view and manage their business profile details, contact preferences, regional settings, and account details in a clean, dedicated settings page, keeping their business identity up to date across the CRM.

## Flow
1. The business owner clicks on their profile pill / avatar in the top `AuthNavbar` and clicks the new **"Settings"** link.
2. The user is navigated to `/settings` (protected route), which presents two primary sections: **Business Profile** and **Account Summary**.
3. The user edits desired business fields (e.g. Business Name, Owner Full Name, Support Email, Phone Number, Currency / Region, Industry).
4. The user clicks **"Save Changes"**.
5. The CRM validates the inputs, displays a brief saving indicator, updates Firestore and the local storage fallback, and syncs the updated business profile in `AuthContext`.
6. A success confirmation banner appears, and the top navbar avatar/name updates in real time across the app without requiring a page refresh.
7. The user can review their read-only Account Summary (Account ID, Registration Date, Email) and easily navigate back to the CRM Dashboard.

## Acceptance criteria
- [ ] **Protected Route (`/settings`)**: Navigating to `/settings` is guarded; unauthenticated visitors are redirected to `/login`.
- [ ] **Navbar Integration**: The user profile dropdown in `AuthNavbar` displays a "Settings" link with an icon navigating to `/settings`.
- [ ] **Business Profile Form**: Presents clean, accessible input fields for:
  - **Business Name** (required, min 2 characters)
  - **Owner Name** (optional / text)
  - **Support Email** (optional / validated email format)
  - **Contact Phone** (optional / text)
  - **Currency / Region** (dropdown with common defaults, e.g., `GHS (₵)`, `USD ($)`, `EUR (€)`, `GBP (£)`, `NGN (₦)`, `KES (KSh)`)
  - **Industry** (dropdown, e.g., Retail, Wholesale, Services, Real Estate, Consulting, Other)
- [ ] **Live Session Synchronization**: Submitting the form updates Firestore (`businesses` collection) and updates the active `business` / `user` state in `AuthContext`, so that `AuthNavbar` immediately reflects the updated business name and avatar initials.
- [ ] **Account Information Card**: Displays read-only account metadata:
  - Account / Business ID
  - Registration Date (formatted as friendly readable date)
  - Account Sign-in Email & Auth Provider
- [ ] **Validation & User Feedback**: Displays clear inline error messages for invalid inputs and displays a green success confirmation banner upon saving.
- [ ] **Responsive Navigation**: Clear breadcrumbs or "Back to Dashboard" button allowing effortless return to `/dashboard`.

## Explicitly out of scope
- Multi-seat / team invitations and role-based permissions (RBAC).
- Payment gateways, subscription billing management, or invoicing.
- Image/logo asset uploading to cloud storage.
- API key generation and outbound webhook management.
