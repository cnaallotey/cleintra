# Feature Spec: Sidebar Navigation & Dedicated Groups Management Route (`/groups`)

## User goal
Small business owners can navigate effortlessly across their CRM using a clean, modern sidebar (switching between Contacts/Dashboard, Groups, and Settings) and manage all contact groups, group details, and assigned contacts on a dedicated `/groups` page without navigating complex settings or modal popups.

## Flow
1. **Sidebar Navigation**:
   - The user opens the CRM and sees a persistent, modern sidebar on the left containing the business brand, quick navigation items (**Dashboard / Contacts**, **Groups**, **Settings**), and user profile/logout controls.
   - The active section is clearly highlighted.
   - On mobile devices, the sidebar cleanly collapses into an accessible mobile hamburger drawer.
2. **Accessing the Groups Route (`/groups`)**:
   - The user clicks **"Groups"** in the sidebar and navigates to the dedicated `/groups` page.
   - The user sees an overview of all contact groups, including group names, total contact count in each group, and an unassigned contacts summary.
3. **Creating a New Group**:
   - The user clicks **"+ New Group"**, enters a group name (e.g. "VIP Wholesale", "Trade Fair Leads"), and clicks **Create**.
   - The group instantly appears in the group list and is immediately available across the CRM.
4. **Managing Existing Groups & Viewing Members**:
   - The user can click on any group to view the list of contacts belonging to that group.
   - The user can rename the group or delete it. Deleting a group prompts for confirmation and cleanly unassigns contacts rather than deleting them.
   - The user can remove contacts from a group directly from the group details view.
5. **Returning to Dashboard**:
   - The user clicks **"Dashboard"** in the sidebar to return directly to the main lead pipeline and contact list with all group updates reflected immediately.

## Acceptance criteria
- [ ] **Sidebar Layout Shell**: A consistent left sidebar navigation is present across all authenticated pages (`/dashboard`, `/groups`, `/settings`, `/contacts/[id]`), providing one-click access to:
  - **Dashboard** (Contacts & Pipeline at `/dashboard`)
  - **Groups** (Dedicated group management at `/groups`)
  - **Settings** (Business profile & account settings at `/settings`)
- [ ] **Active Page Indicator**: The sidebar clearly highlights the link corresponding to the active route.
- [ ] **Responsive Mobile Drawer**: On mobile/small screens (<768px), the sidebar collapses into a slide-over navigation drawer accessible via a top navbar hamburger toggle.
- [ ] **Sidebar User & Business Profile**: The sidebar displays the business name, owner initials/avatar, and a direct sign-out option.
- [ ] **Protected Route (`/groups`)**: Navigating to `/groups` is protected by `AuthGuard`; unauthenticated visitors are redirected to `/login`.
- [ ] **Group Overview & Statistics**: The `/groups` page displays all created groups along with the total count of contacts assigned to each group and an empty state if no groups exist yet.
- [ ] **Create Group**: Users can create a group with a simple name input; empty names or duplicate names display helpful validation errors.
- [ ] **Rename & Delete Group**: Users can edit/rename an existing group and delete a group with confirmation. Deleting a group removes the group tag from assigned contacts without deleting the contacts themselves.
- [ ] **Group Member List**: Selecting or viewing a group shows its member contacts, allowing the user to click into any contact record or remove a contact from the group.
- [ ] **Real-Time Consistency**: Changes made in `/groups` immediately reflect in the sidebar, `/dashboard` group filters, and CSV import dropdowns without requiring a page refresh.

## Explicitly out of scope
- Multi-level nested or hierarchical sub-groups.
- Multi-group membership per contact.
- Automated smart-group filter rules.
- Role-based group permissions.
