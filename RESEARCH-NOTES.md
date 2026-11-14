# Journal research and editorial record

Prepared November 12, 2026 for the local ReputationResolved prototype. This file
is development documentation and is not copied into the public build.

## Article 1: rating visibility model, version 1.0

The 1,744 rows are constructed mathematical states, not observed businesses.
Starting counts: 10, 25, 50, 100, 250, 500 and 1,000. At each count N, enumerate
integer star-point totals T from 4N through floor(4.9N). Remove one one-star
rating and require that T-1 lies between N-1 and 5(N-1). This also establishes
that the original total can contain the removed one-star rating.

The display assumption is nearest tenth with half-up ties, calculated exactly
as (20T+N)//(2N). It is not a reverse-engineered Google display specification.
Each feasible total gets one row. Individual star-distribution multiplicities
and real-world business prevalence are not weights. There is no pooled
unchanged-display percentage and no claim about removal probability.

| Starting ratings | Feasible totals | Unchanged display | Unchanged share |
| ---: | ---: | ---: | ---: |
| 10 | 7 | 0 | 0.0% |
| 25 | 22 | 0 | 0.0% |
| 50 | 46 | 13 | 28.3% |
| 100 | 91 | 64 | 70.3% |
| 250 | 226 | 195 | 86.3% |
| 500 | 451 | 424 | 94.0% |
| 1,000 | 901 | 874 | 97.0% |

For all rows the underlying mean rises. Google explains review scores as an
average of published ratings. Its statement about up to two weeks for score
updates concerns a **new review**; the article does not turn it into a removal
processing deadline. Scripts, output and chart captions expose these limits.

## Article 2: evidence matrix, version 1.0

Twelve deliberately constructed examples separate observations, supported
conclusions, unsupported inferences and a useful next step. The routes are
editorial coding, not moderation decisions: five more-context cases, six
policy-assessment cases and one dedicated extortion-report case. These counts
are not statistics about businesses, fake reviews or removal outcomes.

The central angle uses Google's November 19, 2025 review-nickname announcement
and current profile settings documentation. The article does not claim that
display names could never be changed before that announcement. It explains
why an exact booking-name search has a narrower meaning than "never a customer".
The April 2026 source concerns Google's review-spike protections and potential
temporary pauses; the text does not call every pause a permanent penalty.

Practical examples, inference limits and the private worksheet are original
editorial work. No customer records were collected. The worksheet downloads
to the reader; it is not another data-collection form.

## Primary sources checked

- https://support.google.com/business/answer/4801187?hl=en
  Review-score averaging and the specific new-review update caveat.
- https://support.google.com/business/answer/4596773?hl=en
  Policy reporting, status and eligible appeals; not disagreement-based removal.
- https://support.google.com/contributionpolicy/answer/7400114?hl=en
  Policy categories used as context, not an automatic eligibility checklist.
- https://blog.google/products-and-platforms/products/maps/holiday-gemini-tips-new-explore-tab/
  November 19, 2025 announcement: review nickname/picture and account association.
- https://support.google.com/maps/answer/9320433?hl=en
  Custom public Maps profile settings.
- https://support.google.com/maps/answer/6230175?hl=en
  Ratings, optional written text and direct review sharing.
- https://support.google.com/contributionpolicy/answer/16597558?hl=en
  Incentives and conflicts of interest; read alongside the main content policy.
- https://support.google.com/business/answer/16404809?hl=en
  Merchant-extortion reporting, evidence and avoiding payment to malicious parties.
- https://blog.google/products-and-platforms/products/maps/new-ways-were-protecting-businesses-on-maps/
  April 16, 2026 review-spike protections and owner notifications.

Only a brief nickname phrase is directly quoted. Most material is original
reasoning, examples and calculations, with limited primary-source paraphrase.
The attribution permissions on the articles apply to our figures/framework;
they do not relicense Google's content.

## Editorial approach and remaining launch work

No humanizer or AI-detector-evasion service was used. Natural editing focused
on concrete openings, varied sentence length, useful examples, source accuracy
and clearly bounded claims. There is no assertion that text is undetectable,
human-authored, guaranteed to be cited or guaranteed to rank.

The byline is the organization, ReputationResolved. No named expert, qualification,
review count, customer outcome or endorsement is invented. Article dates and
version numbers match the visible text and generated structured data.

Before public launch, confirm the business's final canonical domain and actual
publication date; add absolute article/citation/social URLs and a sitemap;
remove the deliberate noindex/robots block only when approved. Confirm actual
business and editorial responsibility, terms/privacy and a working correction
contact. The present assessment is a local preview, not an operating inbox.
Do not claim a correction can currently be sent through it.

Google policies and product details can change. Recheck linked sources and
record a new version when findings or underlying assumptions change. Keep
downloadable data, chart captions and article text synchronized. Public search
performance and third-party citations have not been measured.
