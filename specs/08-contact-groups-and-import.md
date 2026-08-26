# Feature Spec: Contact Groups & Group-based Import

## User goal
Organize contacts into simple segments (like "Wholesale Customers", "Retail", "Instagram Leads", or "Exhibition 2026") so business owners can focus on specific audiences, filter their dashboard view, and automatically assign new CSV uploads to a specific group.

## Flow
1. **Viewing & Filtering Groups**:
   - On the Contacts dashboard, the user sees a group selector/tabs (defaulting to "All Contacts").
   - Selecting a specific group filters the contact table immediately to show only contacts belonging to that group.
2. **Managing Groups**:
   - The user can create a new group at any time by giving it a simple name (e.g., clicking "+ New Group", entering "Trade Show 2026", and saving).
   - The user can rename or delete existing groups without deleting the underlying contacts (contacts in a deleted group simply return to unassigned / "All Contacts").
3. **Assigning Contacts to Groups**:
   - From the contact details or contact list, the user can change or set the group for any contact.
4. **Group-based CSV Import**:
   - When clicking **Import Contacts (CSV)**, the upload dialog includes an optional **Group** dropdown.
   - The dropdown lists existing groups, an option to **"+ Create new group"** on the fly, and a default **"None (All Contacts)"** option.
   - Upon upload, all valid contacts in that CSV file are automatically assigned to the chosen group.

## Acceptance criteria
- [ ] A group filter selector is visible on the Contacts dashboard allowing users to toggle between "All Contacts" and specific groups.
- [ ] Users can create a new group with a name; duplicate or empty names are cleanly prevented with a clear message.
- [ ] Users can rename or delete a group; deleting a group does NOT delete the contacts in that group.
- [ ] Each contact row / contact modal displays its assigned group (or "None") and allows updating the group assignment.
- [ ] In the CSV Import modal, the user can select an existing group, create a new group inline, or leave it as "None (All Contacts)".
- [ ] Contacts imported with a selected group are immediately tagged with that group upon successful import.
- [ ] Group counts (number of contacts in each group) are accurately displayed when viewing group filters.
- [ ] The dashboard table and statistics update dynamically when filtering by a group.

## Explicitly out of scope
- Multi-group membership per contact (a contact belongs to 0 or 1 group to keep mental model simple).
- Complex nested / hierarchical folder structures for groups.
- Automated rule-based smart groups (e.g., auto-grouping based on lead status or date).
- Group-level permission management or role-based access control.
