# Feature Spec: Call & interaction logging per contact (date, outcome, notes)

## User goal
A small business owner or salesperson wants to quickly record what happened after calling, emailing, or meeting a contact (date, outcome, and notes) and see a clear timeline of past conversations so they never lose context before their next follow-up.

## Flow
1. User clicks on a contact from the list or opens the contact detail page.
2. User sees an "Activity & History" section alongside the contact details, showing past logged interactions in reverse chronological order.
3. User clicks **"Log Activity"** (or uses an inline quick-entry form).
4. User selects an **Activity Type / Outcome** from simple pre-set choices:
   - *Call - Connected*
   - *Call - Left Voicemail*
   - *Call - No Answer*
   - *Email Sent*
   - *Meeting / Discussion*
   - *Note / Other*
5. Date automatically defaults to **Today / Current Time** (with option to adjust if logging retrospectively).
6. User types brief notes into a text box (e.g. "Interested in standard package, wants a follow-up next Tuesday").
7. User clicks **"Save Log"**.
8. The new log instantly appears at the top of the contact's interaction history timeline with a clear timestamp and outcome badge.
9. Contact's "Last Contacted" date automatically updates across the CRM and contact list table.

## Acceptance criteria
- [ ] User can log an interaction from the contact detail view with Date, Outcome/Type, and Notes.
- [ ] Outcome dropdown includes clear, plain-English defaults (*Connected, Left Voicemail, No Answer, Email, Meeting, General Note*).
- [ ] Date defaults to current date/time so logging requires zero unnecessary clicks.
- [ ] Notes field is optional but prominent and easy to type in (clean multi-line text input).
- [ ] Logged interactions display in an easy-to-read chronological timeline (newest on top) with date, outcome tag, and note text.
- [ ] User can delete or edit an incorrectly entered log entry.
- [ ] Logging an interaction automatically updates the contact's `lastContactedAt` timestamp.
- [ ] The contacts table displays the `Last Activity / Last Contacted` date formatted for easy scanning.
- [ ] Zero technical jargon (no "payloads", "CRON syncs", "event IDs", etc.).

## Explicitly out of scope
- Automatic telephony / VoIP integration or browser-based dialing.
- Two-way email inbox syncing (IMAP/OAuth).
- Audio call recording or transcription.
- Automated cadence / drip sequences.
- Rich-text WYSIWYG editor (keep notes plain text for simplicity and speed).
