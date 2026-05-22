# Moxie Routine Coach + Review Radar

Referral-ready proof-of-work product for Moxie Beauty: a customer-facing Routine Coach plus a brand-facing Review Radar that turns haircare reviews into product-page, education, support, and weekly growth actions.

This is a brand-inspired demo, not an official Moxie asset. It uses placeholder logo text `MOXIE BEAUTY`, configurable colors, and configurable product names so official logo, colors, fonts, and SKU mapping can be replaced later.

## Problem It Solves

For haircare brands, customer dissatisfaction does not always mean the product is bad. A customer may choose the wrong product for their hair type, use the right product in the wrong amount, apply it in the wrong order, or expect the same result across humidity, scalp type, and styling habits.

That creates a monetizable operating problem:

- Wrong-fit purchases before checkout.
- Avoidable sticky, greasy, heavy, dry, weak-hold, or residue complaints.
- Lower marketplace conversion when low ratings repeat the same objection.
- More support load from routine and usage questions.
- Missed content opportunities from repeated customer confusion.

This tool helps Moxie detect those patterns and turn them into page fixes, usage education, support replies, and content actions.

## What The App Includes

- **Why / Pitch View:** clear business framing and proof-of-work summary.
- **Routine Coach:** short quiz that recommends a lean routine, amount, order, mistakes to avoid, and product-page education ideas.
- **Review Radar:** sample data, CSV upload, pasted comments, and rule-based classification.
- **Metrics Dashboard:** complaint categories, root causes, marketplace risk, urgent actions, source insights, product heatmap, and team owner breakdown.
- **Weekly Report:** presentation-ready report with open summary/action sections and export options.
- **Settings:** local brand config for logo path, colors, fonts, product names, and categories.
- **Exports:** classified CSV, insights JSON, report copy, and browser print-to-PDF.

## How To Run Locally

No install step, paid API, external LLM, database, or backend is required.

```bash
node scripts/serve.mjs
```

Then open:

```text
http://127.0.0.1:4173
```

If the regular `node` command is blocked on this machine, use the bundled runtime:

```powershell
& 'C:\Users\DHWANI\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts\serve.mjs
```

## How To Deploy

This is a static app and can be deployed on GitHub Pages.

1. Push the project to GitHub.
2. Go to the repository on GitHub.
3. Open **Settings > Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose the `gh-pages` branch and `/root`.
6. Save and wait a few minutes for GitHub Pages to publish.
7. Open the Pages URL shown by GitHub.

For this repository, the expected live URL format is:

```text
https://dhwanibathlaugtbm2028-coder.github.io/moxie-routine-coach-review-radar/
```

The `.nojekyll` file is included so GitHub Pages serves the static files as-is.

## Demo Mode

Demo mode is on by default and loads realistic sample reviews across:

- Curl Defining Cream
- Leave-In Conditioner
- Wax Stick / Flyaway Fix
- Dry Shampoo
- Hydrating Shampoo
- Lightweight Conditioner
- Anti-Frizz Serum
- Heat Protectant
- Styling Gel

Use the top-right toggle to clear or reload sample data.

## Upload CSV

Go to **Review Radar** and upload a `.csv` file with these fields:

```text
Date, Source, Product, Rating, Review_Text, Customer_Hair_Type, Purchase_Channel, Verified_Buyer, Location, Status
```

Supported source examples:

- Website reviews
- Amazon
- Nykaa
- Flipkart
- Instagram comments
- Support chat
- WhatsApp
- Reddit/Quora manually pasted

You can also paste one review, support message, or social comment per line.

## Export Report And Data

From **Weekly Report**:

- **Export PDF:** opens browser print. Choose "Save as PDF".
- **Copy report:** copies the weekly report as Markdown.
- **Reviews CSV:** exports classified reviews.
- **Insights JSON:** exports report sections and analytics.

From **Review Radar**, export classified reviews as CSV or JSON.

## Local-First / No Paid API

This demo uses:

- Local JavaScript modules
- Local sample data
- Browser localStorage for config
- Rule-based keyword and scoring logic
- Client-side CSV parsing
- Browser print for PDF
- Client-side CSV/JSON downloads

It does **not** use OpenAI API, Gemini API, Claude API, paid scraping tools, paid database tools, subscriptions, paid credits, or backend hosting.

## Key Files

- `index.html` - app entry
- `src/main.js` - navigation, rendering, interactions, exports
- `src/styles.css` - Moxie-inspired visual system and print styles
- `src/config/brandConfig.js` - editable brand/product configuration
- `src/data/sampleReviews.js` - built-in realistic sample review dataset
- `src/lib/classifier.js` - runtime classifier
- `src/lib/classifier.ts` - requested classifier mirror
- `src/lib/recommendationEngine.js` - Routine Coach recommendation logic
- `src/lib/report.js` - analytics and weekly report generation
- `src/lib/csv.js` - CSV upload/export and pasted review parsing
- `scripts/serve.mjs` - tiny local static server
- `docs/demo-script.md` - short spoken demo script
- `docs/pitch-summary.md` - presentation positioning

## Customize Before Sending To Moxie

Replace only with permission or official files:

- Official logo asset and `logoPath`
- Exact Moxie color tokens
- Licensed brand fonts
- Real product SKU names and bundle mapping
- Product imagery, if Moxie provides usable assets
- Any claims that require internal proof or approval

You can edit defaults in:

```text
src/config/brandConfig.js
```

The in-app Settings page also stores local overrides in browser localStorage.

## 60-Second Demo Script

"I built Moxie Routine Coach + Review Radar as a proof-of-work around one monetizable haircare problem: routine mismatch. In beauty, a bad review does not always mean the product is bad. Sometimes the customer chose the wrong routine, used too much product, or applied it in the wrong order. This tool helps customers find the right routine before buying, and helps the brand detect repeated usage confusion after purchase. It turns reviews and comments into product-page fixes, support replies, usage education, and weekly content actions. It is local-first, no API, and built to be easy for a brand team to pilot."

## Suggested Walkthrough

1. Start on **Why** and explain the routine mismatch problem.
2. Open **Coach** and show the default wavy, fine, oily-scalp, humid-weather recommendation.
3. Open **Radar** and show how a sticky wax-stick review becomes an action, root cause, confidence score, and team owner.
4. Open **Metrics** and point to the weekly action, biggest avoidable risk, marketplace risk, and owner breakdown.
5. Open **Weekly Report** and show the open executive summary, priority actions, product-page fixes, and education ideas.

## Limitations

- Rule-based logic is transparent and local, but not as flexible as a trained model.
- Product names are placeholders, not official Moxie SKUs.
- Brand visuals are inspired, not official.
- CSV upload expects clean headers.
- PDF export uses browser print, not a custom PDF renderer.
- There is no backend, user accounts, scraping, or long-term analytics database.

## Future Improvements For A Real Pilot

- Map placeholders to real Moxie SKUs and official bundles.
- Add Shopify/Amazon/Nykaa review import workflows.
- Add a human review queue with editable owner/status fields.
- Save weekly snapshots and trend movement over time.
- Add official brand design tokens and approved product imagery.
- Add optional local-only Ollama summarization while keeping rule-based fallback.
- Track product-page/FAQ changes against future review objections.

## Packaging As A Shareable Deliverable

Zip the full folder:

```text
moxie-routine-coach-review-radar.zip
```

Keep `index.html`, `src`, `scripts`, `docs`, `.nojekyll`, and `README.md` together. The recipient can run the local server and open the browser URL.
