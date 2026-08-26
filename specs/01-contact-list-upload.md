# Feature Spec: Contact list upload (CSV import) with validation

## User goal
A small business owner wants to upload a spreadsheet file (CSV) containing their sales leads or customer contacts so they can start tracking them in one place without typing them in one by one.

## Flow
1. The user navigates to the Contacts page and clicks an **"Import Contacts"** button.
2. The user sees a clear upload area with instructions and a link to download a simple sample CSV template.
3. The user selects or drags-and-drops their `.csv` file from their computer or phone.
4. The system validates the file immediately and presents a simple preview summary:
   - Total contacts found in the file.
   - Number of ready-to-import contacts.
   - Number of rows with errors or missing required details (if any), with plain-language explanations of what is missing.
5. The user clicks **"Confirm Import"** to save the valid contacts.
6. The user receives a success confirmation showing the number of contacts added, and the page updates immediately to show the newly imported contacts in their contact list.

## Acceptance criteria
- [ ] The user can click an "Import Contacts" button from the main contacts view to open the upload interface.
- [ ] The user can download a pre-formatted sample CSV file containing example columns (`Name`, `Phone`, `Email`, `Source`, `Notes`).
- [ ] The user can select or drag-and-drop a `.csv` file into the upload box.
- [ ] If a non-CSV file is selected (e.g., PDF or image), the system displays a clear error message: "Please select a valid CSV file (.csv)."
- [ ] Each contact row must contain at least a **Name** and at least one contact method (**Phone number** or **Email address**).
- [ ] The system recognizes common phone number formats (including Ghana formats like `024XXXXXXX`, `+233XXXXXXXXX`, or international numbers).
- [ ] Before saving, the user is shown an import summary stating how many contacts are valid and how many rows have errors.
- [ ] If there are invalid rows, the user can see which row numbers had issues and a plain-English explanation (e.g., "Row 4: Missing phone number and email").
- [ ] Valid contacts can still be imported even if some rows have errors, without failing the entire file.
- [ ] Clicking "Confirm Import" saves the contacts and assigns them the default starting status ("New Lead" / "Not Contacted").
- [ ] Upon successful import, the user is shown a confirmation message (e.g., "Successfully added 25 contacts") and redirected to the contact list where the new contacts are visible.
- [ ] If an empty CSV file is uploaded, the system informs the user: "No contacts found in the uploaded file."

## Explicitly out of scope
- Direct import of native Excel files (`.xlsx`, `.xls`) or Google Sheets live sync (users export as CSV first).
- Complex custom column mapping wizards (the file uses standard headers, or auto-detects standard column names like Name, Phone, Email, Source, Notes).
- Advanced automated deduplication and contact merging rules (flagged for backlog).
- Background scheduled imports or third-party CRM migration integrations.
