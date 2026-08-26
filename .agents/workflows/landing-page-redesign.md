# Workflow: Landing Page Conversion & UI Redesign

This workflow governs how Simple CRM updates and optimizes its public landing page (`src/app/page.tsx`) to maximize organic search ranking, visitor engagement, and business account signups.

---

## The Workflow Chain

```
[Design Inspiration & User Needs]
              │
              ▼
   1. lead-convert-seo (SEO & High-Converting Copy)
              │
              ▼
   2. ui-designer (Visual Hierarchy, Color System & Bento UI Specs)
              │
              ▼
   3. frontend (Pixel-Perfect Next.js & Tailwind Implementation)
              │
              ▼
   4. qa & crm-user (Verification, Accessibility & Usability Review)
```

---

## Step Details

### Step 1: `lead-convert-seo`
- Analyzes search intent (SMB lead tracking, spreadsheet alternatives, WhatsApp customer management).
- Generates high-converting section copy: Hero hook, pain agitation, value propositions, feature highlights, comparison matrix, FAQs, and conversion CTAs.
- Delivers structured copy blocks ready for the UI Designer.

### Step 2: `ui-designer`
- Evaluates visual inspiration (such as editorial dark-mode palettes, bento grids, and layered diagrams).
- Adapts design principles (deep forest green canvas, vibrant lime accents, clean cream containers, flat crisp borders) specifically for Simple CRM.
- Produces a comprehensive layout specification detailing color tokens, typography scales, container structures, and component wireframes for the Front-End Developer.

### Step 3: `frontend`
- Implements the landing page in `src/app/page.tsx` using Next.js App Router and Tailwind CSS.
- Strictly adheres to flat, shadow-free styling with crisp high-contrast borders.
- Ensures mobile-first responsiveness, fast Core Web Vitals (LCP < 1.2s), and accessible markup.

### Step 4: `qa` & `crm-user`
- `qa` verifies responsiveness, navigation links, FAQ accordions, and automated test suites.
- `crm-user` tests the experience from the perspective of a small business owner landing on the page.
