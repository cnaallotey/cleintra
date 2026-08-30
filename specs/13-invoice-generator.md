## Feature: Lightweight Invoice & Quote Generator (`/invoices`)

### User goal
Small business owners can quickly generate, manage, print, and WhatsApp-share professional invoices and quotations for their leads and customers without needing complicated accounting software or manual spreadsheets.

### Flow
1. **Access Invoices**: The business owner clicks the **"Invoices"** tab in the main sidebar or clicks **"Create Invoice"** directly from any contact's profile page.
2. **Dashboard Overview**: The user sees summary cards (Total Invoiced, Paid Revenue, Pending/Overdue), a filterable list of all existing invoices/quotes (Draft, Sent, Paid, Overdue), and a search bar to find invoices by client name or invoice number.
3. **Create New Document**: The user clicks **"New Invoice"** (or toggles to "New Quote").
4. **Auto-Populate Details**:
   - The document automatically generates the next sequential number (e.g. `INV-2026-001` or `QUO-2026-001`).
   - Seller information is pre-filled from their Business Profile (Business Name, Owner, Email, Phone, Currency).
   - The user selects an existing contact from a searchable dropdown (which auto-fills client name, email, phone, and address) or types in new customer details on the fly.
   - Issue date defaults to today; due date defaults to a sensible preset (e.g., Due Upon Receipt, Net 7, Net 14, Net 30, or Custom).
5. **Add Line Items & Pricing**:
   - The user adds line items with Description, Quantity, and Unit Price. Line totals update instantly.
   - Optional fields for overall Discount (%) and Tax/VAT (%) recalculate the Subtotal, Discounts, Tax, and Final Total in the selected currency (e.g. GHS ₵, USD $, etc.).
   - Optional note/payment instructions (e.g., Mobile Money number, Bank transfer info, or payment terms).
6. **Save & Status Management**: The user saves the invoice (defaults to "Draft" or "Sent"). The invoice status can be updated with 1-click between **Draft**, **Sent**, **Paid**, and **Overdue**.
7. **Share & Print**:
   - **1-Tap WhatsApp Share**: The user clicks "Share on WhatsApp" to open WhatsApp Web/Mobile with a pre-formatted message detailing the invoice summary, line breakdown, total due, payment instructions, and due date.
   - **Print / Save as PDF**: The user clicks "Print / PDF" to open a clean, branded, print-optimized view (hiding navigation, sidebars, and action buttons) ready for physical printing or saving as a PDF.
8. **Contact Profile Integration**: When visiting any Contact Profile (`/contacts/[id]`), an "Invoices & Quotes" tab/card lists all invoices associated with that contact, along with quick actions to view, pay, or issue a new invoice for them with 1 click.

### Acceptance criteria
- [ ] **Navigation & Protected Route**: A dedicated "Invoices" link is added to the main navigation sidebar (`/invoices`), guarded for authenticated users.
- [ ] **Invoices Summary Dashboard**:
  - Displays metrics at the top: **Total Invoiced**, **Paid Amount**, and **Outstanding / Overdue Amount** in the business's primary currency.
  - Search bar to instantly filter invoices by Client Name or Invoice Number.
  - Tabbed filters for document status: **All**, **Draft**, **Sent**, **Paid**, and **Overdue**.
  - Document type filter / badge: **Invoice** vs **Quote**.
- [ ] **Invoice / Quote Creation & Editing**:
  - Modal or dedicated page to create/edit invoices.
  - Auto-generated document number with configurable prefix (e.g., `INV-2026-001`, `QUO-2026-001`).
  - Contact Picker dropdown: Selecting a contact auto-fills customer name, email, and phone. Allows entering custom recipient details if contact isn't saved yet.
  - Date selectors for Issue Date and Due Date (with quick shortcuts: Due upon receipt, 7 days, 14 days, 30 days).
  - Business details (Business Name, Phone, Email, Currency) are pre-populated from the user's Business Profile settings.
- [ ] **Dynamic Line Items & Calculations**:
  - Ability to add, edit, and remove multiple line items (Description, Quantity, Unit Price).
  - Live automatic calculations: Item Total = Quantity × Unit Price.
  - Live calculation of Subtotal, optional Discount (%) deduction, optional Tax/VAT (%) addition, and Final Total.
  - Supports the currency symbol defined in Business Profile (e.g. `₵`, `$`, `€`, `£`, `₦`, `KSh`).
- [ ] **Notes & Payment Instructions**: Free-text area for payment methods (e.g., MoMo number, bank details) and terms/conditions.
- [ ] **Status Lifecycle & Tracking**:
  - 1-click status transitions: `Draft` ➔ `Sent` ➔ `Paid` (or `Overdue`).
  - Marking as `Paid` records the payment date and updates dashboard financial totals in real time.
- [ ] **1-Tap WhatsApp Sharing**:
  - Generates a clean, human-readable WhatsApp message link (`https://wa.me/{phone}?text=...`) including invoice number, business name, itemized summary, total amount, due date, and payment instructions.
  - Handles URL-encoding properly for emojis, line breaks, and currency symbols.
- [ ] **Printer-Friendly / PDF View**:
  - Dedicated print stylesheet (`@media print`) or printable view that strips application navigation, sidebars, and control buttons.
  - Renders a clean, high-contrast, professional document layout with business header, client info, itemized table, total summary, and payment notes.
- [ ] **Contact Profile Integration (`/contacts/[id]`)**:
  - Contact record view displays an **Invoices & Quotes** section showing all documents issued to that contact with their current status and totals.
  - Provides a **"New Invoice"** button on the contact record that launches the invoice creator pre-filled with that contact's info.

### Explicitly out of scope
- Automatic online credit card payment processing / Stripe integration (cash, bank transfer, and mobile money manual tracking only).
- Recurring automated subscription billing / automated recurring invoice cron jobs.
- Complex multi-tier tax brackets or multi-currency exchange rate conversions within a single invoice.
- Inventory tracking or automatic stock deduction.
- Full double-entry accounting / ledger reporting.
