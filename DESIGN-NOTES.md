# ReputationResolved homepage — design review

## Professional homepage — November 14, 2026

Replaced the cozy storefront treatment, handwritten accents and tilted paper
cards with a slate-and-white service presentation. The burgundy brand mark
and CTA color remain. Sans-serif headings, a factual casework brief, clearer
fee rows, a restrained form panel and an open numbered process establish a
more professional hierarchy. Normal 16px body copy and inputs are retained.

The homepage-only home.css is loaded after the shared styles and included in
the static build. Journal pages, research data, shared styling, navigation JS
and calculator/form JS are unchanged. Open Graph wording now matches the
more direct service positioning. No credentials or customer results added.
Fees remain USD $50 upfront and $125 per successful removal. The form is
still a local preview; it sends nothing. No production deployment performed.

Validation: npm run build and npm test passed, covering five homepage widths,
first-screen CTA visibility, 44px quantity controls, keyboard navigation,
calculator outcomes, local form preview/edit, no-JS safeguards, all internal
links, twelve journal layouts and the existing research calculations. Browser
checks found no horizontal overflow or external requests. Before screenshots
are in preview/professional-home/before/; current screenshots are in preview/.

## Research journal — November 12, 2026

Added a journal index, two substantial research articles and a two-card journal
section before the homepage's closing invitation. Journal links are in the
header and footer. The warm palette, local fonts and normal 16px reading scale
carry through; no existing homepage sections were redesigned. Existing pricing
and the preview-only form remain unchanged.

Articles include static, responsive SVG figures generated with Matplotlib,
readable captions, accessible data tables and CSV/JSON downloads. The rating
article adds a small optional calculation; both articles remain readable with
JavaScript disabled. Tables scroll inside their own container on narrow screens.
The contents list uses a native disclosure so it does not push the opening
paragraphs far down the screen on phones.

navigation.js shares the existing menu behaviour between the homepage and new
pages. Homepage calculations and preview logic remain in script.js. Journal
styles are scoped in journal.css; the existing styles.css was not changed.
The Node static generator creates complete article HTML and updates the two
homepage cards without a frontend framework or runtime requests.

Research is clearly identified as mathematical modelling or illustrative
editorial analysis. No customer outcomes, expert credentials, testimonials,
tracking configuration or operating backend were introduced. Launch still
requires the business-specific configuration described in README.md.

## Revision 3: a balanced, professional scale

Reduced the enlarged type throughout the homepage to normal proportions.
Body copy, FAQs, process text and form inputs now use 16px; hero copy is
16–17px. The desktop headline is capped at 66px, with 40–54px on mobile,
and main section headings are 30–44px. The header, hero photograph, buttons,
cards and section spacing are more compact without using browser zoom or
scaling the page. The warm palette, illustrations, content and interactions
remain intact, including USD $50 upfront and $125 per successful removal.

The updated browser check uses this smaller type scale and retains existing
navigation, calculator, form-preview and accessibility checks. Previous
styles/screenshots are preserved under preview/typography-v3/before/.

## Revision 2: larger type and an artistic direction

Expanded the existing warm brand into a more expressive editorial layout.
The hero now has a paper mount, hand-drawn annotations and an ink underline.
Pricing, the form, process, FAQs and footer use much larger text: main copy
is generally 17–18px, form labels 16px, inputs 18px and questions 17–18px.
Small decorative labels retain a clear supporting hierarchy.

The new review-concern workshop pairs an original SVG illustration with
four accessible information tabs. These explain concerns, not automatic
removal eligibility. Three paper-style process chapters replace the thin
text columns. An outcome slider adds useful pricing detail: three reviews
assessed and one removed is $275; if none are removed, the estimate is $150.
The assessment preview retains the full conditional success-fee maximum.
Fees remain USD $50 upfront and $125 per successfully removed review.

The homepage is still a local prototype. Its simple form, unrestricted
profile input, keyboard controls and honest preview-only confirmation remain.
No additional pages, backend, tracking or publication were introduced.
The first design's source and screenshots are preserved under
preview/redesign-v2/before/. Updated screenshots are in preview/.

Created November 11, 2026 in `C:\Users\alkhi\ReputationResolved.com`.
This is the requested homepage-only local prototype, ready for visual review.
No website, account, domain, backend, tracking or production integration was
created or modified in the two reference projects.

## Direction

Warm ivory, deep burgundy and soft peach. An original mark and wordmark,
locally served DM Sans/Lora typography, an illustrative stock storefront
photo, restrained borders and generous spacing give it a separate identity.
There are no fake ratings, testimonials, outcome statistics or Google badges.
The hero and clear primary assessment CTA are followed by pricing, the
assessment form, a three-step explanation, FAQs and a closing invitation.
Google review assistance is the only service offered in the concept.

## Included interactions

- USD $50 upfront per review plus USD $125 per successfully removed review.
- Calculator and form count synchronized from 1–50, with honest conditional
  totals: one successful removal is $175; three are $525.
- Native required-field/email validation. Profile/review input accepts plain
  text or blank values, with no URL or length constraint.
- Accessible request preview/edit flow. It sends and stores nothing; it
  clearly says the request has not been sent. Customer text is inserted with
  textContent, including optional context, never interpreted as HTML.
- Working mobile navigation, Escape dismissal, skip link, reduced-motion
  support and native FAQ disclosures. Quantity buttons meet a 44px target.
- No application dependencies, client hydration framework, external runtime
  requests, inherited account IDs or copied testimonials.

## Validation

`npm run build` and `npm test` passed. After the final target-size/context
adjustments, `node build.cjs` and `node tests/preview.cjs` passed again.
Syntax checks for script.js, server.cjs and build.cjs passed.

Browser QA covered 1440, 1024, 768, 390 and 320px widths: no horizontal
overflow; the main CTA is visible on the first screen; the image/local fonts
load; links resolve; menu/FAQ/keyboard work; amounts/counts/limits remain
correct; invalid forms do not proceed; plain-text profile input and optional
context survive the preview/edit; injected HTML remains literal text; no
external request or form submission occurs. Without JavaScript the preview
submit remains disabled to prevent accidental native submission.

Opening index.html directly was also verified with local fonts, image and
the enabled preview controls. There is no need to start a server to view it.
The local HTTP QA servers were stopped after testing. No publication.
The measurements are local checks, not claims of live Core Web Vitals or
search performance.

## Files

- index.html: complete homepage with truthful metadata and preview indexing
  restrictions. No claimed canonical/domain ownership or invented schema.
- styles.css: original responsive visual system and local font declarations.
- script.js: quantity estimate, navigation and local form preview.
- assets/brand-mark.svg: original brand/favicon mark.
- assets/review-workshop.svg: original scalable line-art illustration.
- assets/storefront-600.avif, assets/storefront-1000.avif: responsive hero
  photo, with corresponding .webp fallback files. Source/credit in README.
- assets/fonts/: three locally served font files and both OFL licenses.
- robots.txt: Disallow for this unlaunched design preview.
- package.json, server.cjs, build.cjs: dependency-free preview/static build.
- tests/preview.cjs: local browser checks using available developer tools.
- README.md, DESIGN-NOTES.md: usage, sources, scope and launch checklist.
- .gitignore: generated output/developer artifacts excluded from source.
- dist/: generated standalone website copy; not deployed.
- preview/: desktop/mobile screenshots and checks.json for review.

Backend/contact delivery, the new brand's bot verification, policies, actual
business/contact details, indexing/canonical/sitemap and optional measurement
can be completed after the design is approved. These are not represented
as active capabilities of this prototype.
