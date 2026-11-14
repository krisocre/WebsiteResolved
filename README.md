# ReputationResolved — local website concept

Migrated to this Git checkout on November 14, 2026. Use this folder for future
ReputationResolved changes. The original `C:\Users\alkhi\ReviewsResolve.com`
folder remains an unchanged backup. See [MIGRATION.md](MIGRATION.md).
The final live domain is not configured; the website remains a local preview.

Local design prototype, created November 11, 2026. A research journal and two
articles were added November 12, 2026.
The existing ReviewsBoost and ReviewRemoval projects have not been modified.

## Preview

Open index.html directly, or run `npm run preview` from this folder and visit
http://127.0.0.1:4176/. The static preview server binds to the local machine.
There are no application dependencies or third-party frontend requests.

The homepage uses slate, white and the existing burgundy brand accent, with
locally served DM Sans, a structured service brief, clear fee rows and an open
three-step process. Its page-specific home.css preserves the journal's existing
editorial design. Body text and inputs remain 16px. The interactive concern
guide, partial-removal calculator and local form preview are unchanged.
The original storefront and illustration assets remain available in assets/;
they are no longer displayed on the homepage.
Google review assistance is the only service. No testimonials, ratings,
customer results, credentials or business locations have been invented.

## Pricing and interactions

- USD $50 upfront per review; USD $125 for each successful removal.
- A working calculator and form quantity stay synchronized, from 1 to 50.
- The outcome slider calculates success fees for 0 to the selected number
  removed; it illustrates fees without predicting an outcome. The form preview
  still shows the conditional maximum success fees for the submitted quantity.
- Concern tabs support clicks and ArrowLeft/ArrowRight/Home/End navigation;
  their information remains visible without JavaScript.
- The public profile/review field accepts blank values or any plain text.
- Mobile navigation, native FAQ disclosure and keyboard controls work.
- The form produces an in-page preview only. It sends nothing, stores no
  personal data and takes no payment. It never claims a request was received.
- No endpoint, analytics, payment or Turnstile identifiers have been copied
  from another business. These need this brand's actual configuration later.

`npm run build` creates a standalone static copy in dist/. `npm test` runs
local browser QA using the existing Puppeteer installation and local Chrome
(CHROME_PATH can override its executable path). Those are development tools,
not dependencies of the website. Screenshots/results are under preview/.

## Research journal

Open [blog.html](blog.html), or use Journal in the homepage navigation.
The homepage also includes a two-article journal section. Articles, figures,
downloads and cross-links work when opened directly as local files.

- **One review removed. Why didn't the stars move?** An original model of
  1,744 feasible rating states, with two figures, a small interactive example,
  complete CSV output, assumptions and a reproducible Python calculation.
- **No booking record? That doesn't settle whether a review is fake.**
  Primary-source research on Maps nicknames, customer-record searches and
  reporting evidence, with twelve explicitly hypothetical cases, an evidence
  map and a private worksheet readers can download.

These are original mathematical and editorial analyses, not surveys, customer
case studies, observed Google decisions or success rates. Both explain their
limitations and link Google's primary sources. No detector-evasion humanizer
was used; the text was edited for natural wording and checked against sources.

Edit article bodies under content/, metadata in content/articles.json, and
the evidence matrix in data/review-evidence-matrix.json. `npm run build`
regenerates the public HTML with build-blog.cjs and copies the website to dist/.
The complete article text, tables and cases are rendered in static HTML.
Reading the articles or downloading their data requires no JavaScript.

Optional research regeneration, from this folder:

```powershell
python data/rating-visibility-model.py
python tools/render-research.py
npm run build
```

The model uses only Python's standard library. Figure regeneration additionally
uses Matplotlib; it is a development tool, not a browser or production build
dependency. Checked-in SVG/PNG figures and CSV/JSON data are used by the normal
Node-only build. The articles state the model's rounding rule rather than
claiming to have measured Google's exact interface behaviour.

Article metadata and BlogPosting/Dataset structured data describe the visible
content only. Absolute canonical URLs, social images and a launch sitemap
remain pending confirmation of the final public domain. The existing preview
indexing restrictions are deliberately preserved on all pages.

Editorial methods, primary-source checks and launch requirements are recorded
in RESEARCH-NOTES.md. Browser and data checks are in tests/blog.cjs; existing
homepage checks remain in tests/preview.cjs.

## Before launch, after design approval

Confirm business identity, contact details, service coverage, domain ownership
and actual service terms. Create the appropriate privacy/terms pages. Supply
this brand's own form backend, bot-verification settings and measurement IDs,
if wanted, and test them separately. Do not borrow another brand's project or
account IDs. Confirm the final domain/canonical, social preview and sitemap.
Remove the deliberate noindex/nofollow and robots Disallow only when ready.
This local prototype has not been published or registered with a hosting app.

## Asset credits and factual sources

- Storefront photograph: James Sestric on Unsplash,
  https://unsplash.com/photos/a-storefront-with-a-striped-awning-and-three-chairs-EikvQ07M4wI
  (https://unsplash.com/license). It is illustrative stock imagery, not a
  customer, testimonial, claimed business location or endorsement.
- DM Sans and Lora: Google Fonts, SIL Open Font License. The respective
  license files are included beside the locally served font files.
- Policy/reporting descriptions were checked against Google's official help:
  https://support.google.com/business/answer/4596773?hl=en and
  https://support.google.com/contributionpolicy/answer/7400114?hl=en.
  Google determines whether reviews violate its policies; removal is not
  guaranteed. Negative opinions alone are not presented as removable.
