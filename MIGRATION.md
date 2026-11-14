# ReputationResolved migration — November 14, 2026

## Working project

- Source prototype: `C:\Users\alkhi\ReviewsResolve.com`.
- Active destination: `C:\Users\alkhi\WebsiteResolved`.
- Brand: **ReputationResolved**.
- Existing Git remote preserved: `https://github.com/krisocre/WebsiteResolved.git`.
- No commit, push, hosting registration, publication or domain change performed.

The original folder is retained as an unchanged backup. The destination's
existing `.git` directory was preserved. Do not edit both copies in parallel;
use this checkout for future work on the renamed brand.

## Included in the migration

Homepage, journal index, both complete research articles and their source
templates, data downloads, original figures, local fonts and licence files,
stock photo assets and credit, navigation/calculator scripts, styles, preview
server, static build scripts and existing browser/data tests.

Brand references were updated in visible wordmarks and text, document titles,
Open Graph/Twitter metadata, article author/publisher and Dataset JSON-LD,
downloadable data attribution, SVG/PNG creator metadata, research scripts,
package/server identifiers and developer documentation. Public article slugs and
all local links are preserved. Figure exports were regenerated from the existing
data with the new creator metadata; no research results were changed.

The existing design, photography, icon mark, typography and interactions are
preserved. No other review-service project was copied into this site or changed.

## Behaviour preserved

- Google review assistance only.
- USD $50 upfront per review and USD $125 for each successful removal.
- Calculator/quantity synchronisation and partial-outcome examples.
- Preview-only form: no customer lead, email, payment or backend request is sent.
- No borrowed analytics accounts, Ads tags, Turnstile keys or Apps Script URLs.
- `noindex, nofollow` metadata and `robots.txt` disallow rules.
- Current article publication dates, source citations, study counts and limits.

The final live domain is unconfirmed. No absolute canonical URLs, sitemap host,
CNAME, redirects or production integration were invented. If an old version was
published outside these folders, its host/domain migration needs a separate,
confirmed production plan; the supplied local prototype does not contain one.

## Build and preview

```powershell
cd C:\Users\alkhi\WebsiteResolved
npm run build
npm test
npm run preview
```

Preview URL: `http://127.0.0.1:4176/`. The build creates `dist/`; `preview/` holds
local QA screenshots/results. Both are ignored by Git. No application dependency
installation is needed. Existing browser checks use the local Puppeteer and
Chrome installations; they never send real leads.

Before launch, confirm domain ownership, business identity/coverage and contact
details, legal pages, this brand's backend and bot-verification configuration,
and its own measurement accounts if required. Preserve preview restrictions
until those are ready.

## Completed verification

- `npm run build` passed in this destination checkout.
- `npm test` passed: five homepage widths, twelve article/journal layouts,
  navigation, keyboard controls, calculators, no-JavaScript content, internal
  links/downloads, schema and all 1,744 model states/twelve evidence cases.
- Browser tests made no external requests or real form submissions.
- All 53 original source files match their pre-migration SHA-256 hashes.
- Homepage source differs only by the brand substitution. CSS, interaction
  scripts, numeric/case CSVs, original icon and robots rules remain byte-identical.
- Public source/build files and PNG metadata contain no obsolete brand name.
- Existing Git remote and local preview status are preserved.
