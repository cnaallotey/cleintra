# Product Backlog & Deferred Ideas

This document tracks ideas, feature requests, and deferred scope items raised across agent cycles (`product-owner`, `architect-backend`, `frontend`, `qa`, `crm-user`).

---

## Explicitly Out of Scope for MVP

| Feature / Idea | Origin / Source | Reason Deferred |
|---|---|---|
| Automated Follow-ups & Reminders | AGENTS.md MVP Scope | Out of scope for MVP; keep product manual and simple |
| WhatsApp Two-Way Chat / Webhook Integration | AGENTS.md MVP Scope | Requires external API integration and webhook setup |
| Reporting / Analytics Dashboards | AGENTS.md MVP Scope | Secondary to core contact and pipeline tracking |
| Multi-seat / Multi-user Permissions & RBAC | AGENTS.md MVP Scope | Single business owner account focus for MVP |

---

## Triaged Feedback & Post-MVP Enhancements

### Contact Ingestion & Data Management
- **Direct Excel (.xlsx) Import** (Feature 1): Allow direct drag-and-drop of `.xlsx` / `.xls` spreadsheets without requiring the user to export as CSV first.
- **Duplicate Detection & Merge Suggestions** (Feature 1): Detect duplicate phone numbers or emails on import and offer merge/overwrite options.
- **Semicolon / Tab Delimited CSV Detection** (Feature 1): Automatically recognize semicolon (`;`) and tab (`\t`) separated CSV files.

### Interaction & Activity Tracking
- **Dedicated WhatsApp / Voice Note Activity Type** (Feature 4): Add specific preset for WhatsApp chats and voice notes in the activity logging dropdown.
- **Timeline Pagination / Infinite Scroll** (Feature 4): Paginate interaction history for leads with hundreds of historical logs.
- **Activity Outcome Filtering** (Feature 4): Filter timeline entries by outcome (e.g. view only "Meeting / Discussion" or "Email Sent").

### Dashboard & Navigation
- **One-Click WhatsApp Quick Link in Contact Table (`wa.me`)** (Feature 5): Add a quick launcher button next to phone numbers in the contact table to initiate WhatsApp chats in a new tab.
- **Kanban Pipeline Board View** (Feature 5): Drag-and-drop card layout across stage columns.
- **Stage Reordering (Up/Down)** (Feature 3): Custom order sorting for pipeline stages in the Stage Manager modal.

### Authentication & Account Security
- **Self-Serve Password Reset Flow (Email Link / OTP)** (Feature 6): Password recovery link sent via transactional email.
- **Inactivity Session Auto-Timeout** (Feature 6): Configurable security timeout for sensitive financial or customer data.
