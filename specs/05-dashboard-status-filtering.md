# Feature Spec: Simple dashboard / list view with filtering by status

## User goal
A small business owner wants a single central screen where they can see all their contacts at a glance, immediately see how many leads are in each pipeline stage, and filter down by status or search to find who to follow up with next.

## Flow
1. User navigates to the main Dashboard / Contacts list page.
2. User sees summary status tabs at the top showing total counts for each stage (e.g., "All (24)", "New Lead (10)", "Contacted (6)", "Follow-up (5)", "Won (2)", "Lost (1)").
3. User clicks on any status tab (e.g., "Follow-up") to instantly filter the list to contacts in that stage.
4. User can type in a search bar to instantly narrow contacts by name, phone, email, or source/company.
5. In the contact list, the user sees clear details for each lead: Name, Contact Info (Phone & Email), Status Badge, and Last Activity summary/date.
6. User clicks on any contact row or "View" button to jump straight into that contact's full record and interaction history.

## Acceptance criteria
- [ ] Dashboard displays an overview filter bar showing all pipeline stages with live contact counts per stage (plus an "All" tab).
- [ ] Clicking a status tab immediately filters the contact list to show only contacts matching that status.
- [ ] An active visual indicator clearly highlights the currently selected status filter tab.
- [ ] Search input allows real-time filtering across contact name, phone number, email, and source/company.
- [ ] Search and status filters work together seamlessly (e.g., searching for "Kwame" while filtered to "Follow-up").
- [ ] Each contact row displays Name, Source, Phone, Email, Status Badge (color-coded), and Last Contacted Date.
- [ ] If no contacts match the filter/search, a friendly empty state is displayed with a one-click button to "Clear Filters".
- [ ] Clicking a contact row or view action navigates directly to `/contacts/[id]`.
- [ ] Filter state is reflected in the URL search params (e.g. `?status=Follow-up` or `?q=Kwame`) so filtered views survive page refreshes and can be shared/bookmarked.
- [ ] List is responsive and touch-friendly on both mobile devices and desktop viewports.

## Explicitly out of scope
- Drag-and-drop Kanban board layout (deferred to future visual pipeline enhancement).
- Multi-field boolean query builders or advanced nested filtering rules.
- Bulk batch actions (e.g. bulk stage change or mass delete).
- Exporting filtered views to custom PDF or Excel reports.
