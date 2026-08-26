---
description: Runs one full feature cycle through the five CRM agents (Product Owner, Architect, Frontend, QA, CRM User) for a single named feature area, then reports what's ready for the next cycle.
---

# Simple CRM — Multi-Agent Build Workflow

## Project summary

A lightweight CRM for small businesses, built on the FormDrop form-backend
concept. Core loop: a business uploads a list of contacts, the list gets
validated, and each contact is tracked through a simple status/pipeline
(e.g. not contacted, called, follow-up needed, converted, closed). Primary
use case is sales lead tracking, secondary use case is general customer
follow-up. Must stay simple enough for a non-technical small business owner
to use without training.

**Stack:** Next.js and Firebase (Firestore, Firebase Auth, Firebase
Storage), TypeScript throughout.

## Agent roster

1. **Product Owner Agent** — owns requirements and acceptance criteria
2. **Architect / Backend Agent** — owns data model, API design, validation logic
3. **Frontend Agent** — owns UI/UX and component implementation
4. **QA Agent** — tests implementation against acceptance criteria
5. **CRM User Agent** — roleplays a small business owner using the product,
   surfaces friction and missing features

## How the agents should work together

Run this as a loop, not a single pass. Each cycle should be scoped to one
feature area (e.g. "contact list upload", "call logging", "pipeline view")
rather than the whole product at once.

**Per-feature cycle:**

1. Product Owner Agent writes/updates the feature spec and acceptance
   criteria for the feature area.
2. Architect Agent proposes the data model and API changes needed, checks
   them against the existing FormDrop backend, and flags anything that
   conflicts with prior decisions.
3. Frontend Agent implements the UI against the spec and API contract.
4. QA Agent tests the implemented feature against the Product Owner's
   acceptance criteria and files bugs/gaps.
5. CRM User Agent uses the feature as a small business owner would,
   without seeing the spec, and reports confusion, friction, or missing
   functionality in plain language.
6. Feed the CRM User Agent's feedback and QA's bug list back to the
   Product Owner Agent to decide what's in scope for this feature vs.
   backlog for later.

Repeat per feature area until the MVP feature list (below) is covered.

## MVP feature list (starting scope)

- Contact list upload (CSV import) with validation
- Contact record view (name, phone, email, source, status)
- Status/pipeline tracking per contact (customizable stages, sensible defaults)
- Call/interaction logging per contact (date, outcome, notes)
- Simple dashboard/list view with filtering by status
- Basic user auth (single business account, no multi-seat needed for MVP)

Explicitly out of scope for MVP: automation, WhatsApp integration,
reporting/analytics dashboards, multi-user permissions. Note these as
backlog items if the CRM User Agent or Product Owner Agent raises them.

## Instructions for using these files in Antigravity

Each of the five files (01–05) is a standalone system prompt for one agent.
Paste each into its own agent/session in Antigravity. Keep them running as
separate agents rather than one agent switching hats — the value of this
setup is in the friction between roles (e.g. QA pushing back on Frontend,
CRM User Agent complaining about Product Owner's assumptions).
