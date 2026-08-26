# Feature Spec: Contact record view

## User goal
A small business owner wants to view the details of a single contact (name, phone number, email, lead source, status, date added, and notes) in one clean, easy-to-read screen so they can quickly review who the person is before reaching out.

## Flow
1. User navigates to their contact list and clicks on any contact row or name.
2. The app displays the Contact Record View with the contact's core details prominently visible: Full Name, Phone Number, Email, Status, Lead Source, and Date Added.
3. User sees direct action triggers next to the contact info (e.g. "Call" or "Email" link/button).
4. User can click a "Back to Contacts" button to return to the full list.

## Acceptance criteria
- [ ] Clicking a contact in the contacts table opens the Contact Record View for that specific contact.
- [ ] The record view clearly displays:
  - Full Name (or "No Name" if only phone was provided)
  - Phone number (formatted for easy reading, with a clickable `tel:` link)
  - Email address (with a clickable `mailto:` link, or "None" if blank)
  - Current Status (e.g., "Not Contacted", "Follow-up Needed", "Converted", "Closed")
  - Lead Source (e.g., "CSV Import", "Walk-in", "Referral", or "None")
  - Date & time the contact was created/imported
- [ ] If optional fields (email, source) are empty, the view displays a clean placeholder (e.g., "—" or "Not provided") rather than an error or blank void.
- [ ] A prominent "Back" button returns the user directly to their contacts list without reloading the page or losing list state.
- [ ] The view is fully responsive and readable on both mobile and desktop screens.

## Explicitly out of scope
- Editing contact fields (part of later contact management).
- Adding custom pipeline stages (covered in Feature 3).
- Logging interaction notes or call outcomes (covered in Feature 4).
- Activity timelines or automated contact history.
