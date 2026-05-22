# Moxie Routine Coach + Review Radar

Local-first proof-of-work product for Moxie Beauty: a customer-facing Routine Coach plus a brand-facing Review Radar that turns haircare reviews into product-page, education, support, and growth actions.

This is a brand-inspired demo, not an official Moxie asset. It uses placeholder logo text, configurable colors, and configurable product names so official logo, colors, fonts, and SKU mapping can be replaced later.

## What This Project Is

Moxie sells haircare and styling products for Indian hair, weather, humidity, and habits. The deeper monetizable problem is often not awareness alone. It is routine mismatch and usage confusion: customers may buy the wrong product, use the right product incorrectly, or apply too much/too little.

This demo has two connected modules:

- **Routine Coach:** pre-purchase quiz that recommends a routine, product categories, usage amount, application order, common mistake to avoid, education card, suggested bundle, and post-purchase tip.
- **Review Radar:** post-purchase dashboard that classifies reviews/comments into complaint categories, root cause, severity, confidence, funnel impact, and recommended brand actions.

## What It Solves

- Helps customers choose a better-fit routine before buying.
- Helps the brand detect patterns in reviews after purchase.
- Converts negative reviews and confusion into website updates, usage education, FAQs, support replies, and content ideas.
- Gives growth, support, product, and marketing teams a weekly operating routine.

## How To Run Locally

No paid APIs, no external LLMs, no database, and no install step are required.

```bash
node scripts/serve.mjs
```

Then open:

```text
http://127.0.0.1:4173
```

## GitHub Pages Deployment

This is a static app, so it can be hosted directly on GitHub Pages.

1. Push this folder to a GitHub repository.
2. In GitHub, go to **Settings > Pages**.
3. Set **Source** to **Deploy from a branch**.
4. Choose the default branch and `/root`.
5. Save. GitHub will publish the app at the Pages URL shown there.

The `.nojekyll` file is included so GitHub Pages serves the static files as-is.

In this Codex workspace, the regular `node` command may be blocked. If needed, run with the bundled runtime:

```powershell
& 'C:\Users\DHWANI\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts\serve.mjs
```

## How To Use Sample Data

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

Use **Review Radar** or **Dashboard** to inspect the classified output.

## How To Upload CSV

Go to **Review Radar** and upload a `.csv` file with these fields:

```text
Date, Source, Product, Rating, Review_Text, Customer_Hair_Type, Purchase_Channel, Verified_Buyer, Location, Status
```

Supported source examples: Website reviews, Amazon, Nykaa, Flipkart, Instagram comments, Support chat, WhatsApp, Reddit/Quora.

You can also paste one review or comment per line in the manual review box.

## How To Customize For Moxie

Open **Settings** in the app, or edit:

```text
src/config/brandConfig.js
```

You can change:

- Logo path
- Placeholder logo text
- Primary, secondary, accent, soft, and ink colors
- Display and body font families
- Product names
- Product categories
- Source list

Before sending this externally, replace placeholder branding with official assets only if Moxie provides permission or files.

## How To Export

From **Report**:

- **Export PDF:** opens the browser print flow. Choose "Save as PDF".
- **Copy report:** copies the weekly report as Markdown.
- **Reviews CSV:** exports classified reviews.
- **Insights JSON:** exports report sections plus analytics.

From **Review Radar**, export classified reviews as CSV or JSON.

## Free / No Paid API

This demo uses:

- Local JavaScript modules
- Local JSON-style sample data
- Browser localStorage for config
- Rule-based classification
- Client-side CSV parsing
- Browser print for PDF
- Client-side CSV/JSON download

It does **not** use OpenAI API, Gemini API, Claude API, paid scraping tools, paid database tools, or paid hosting.

## Stack Note

The requested React/Tailwind/Recharts stack was not available in this shell because npm is unavailable and the system Node command is blocked. I chose the closest free local alternative: a zero-build modular browser app with custom CSS and custom chart components. This improves demo reliability because it runs locally without dependency installation.

The project still keeps a clean `src` structure, including `src/lib/classifier.ts`, so it can be migrated to React/TypeScript later.

## Key Files

- `index.html` - app entry
- `src/main.js` - app navigation, rendering, interactions, exports
- `src/styles.css` - Moxie-inspired visual system and print styles
- `src/config/brandConfig.js` - editable brand/product configuration
- `src/data/sampleReviews.js` - built-in realistic sample review dataset
- `src/lib/classifier.ts` - requested classifier source mirror
- `src/lib/classifier.js` - runtime classifier
- `src/lib/recommendationEngine.js` - Routine Coach recommendation logic
- `src/lib/report.js` - analytics and weekly report generation
- `src/lib/csv.js` - CSV upload/export and pasted review parsing
- `scripts/serve.mjs` - tiny local static server
- `docs/demo-script.md` - 60-second demo script
- `docs/pitch-summary.md` - presentation positioning

## Limitations

- Rule-based logic is transparent and local, but not as flexible as a trained model.
- Product names are placeholders, not official Moxie SKUs.
- Brand visuals are inspired, not official.
- CSV upload expects clean headers.
- PDF export uses browser print, not a custom PDF renderer.
- No backend, user accounts, marketplace scraping, or long-term analytics database.

## Future Improvements

If Moxie wanted to pilot this seriously:

- Map product placeholders to real SKUs and official routine bundles.
- Add Shopify/Amazon/Nykaa review import workflows.
- Add a human review queue with owner/status changes.
- Track weekly trends over time with saved snapshots.
- Add official brand design tokens and product imagery.
- Add optional local-only LLM support through Ollama for summarization, while keeping rule-based fallback.
- Add A/B tracking for FAQ/product-page education changes.

## Screenshots

Run the app, then capture:

1. Pitch View hero and weekly workflow.
2. Routine Coach after changing hair type/density/climate.
3. Review Radar classified queue.
4. Dashboard with filters and heatmap.
5. Report page before printing to PDF.

## Packaging As One Shareable Deliverable

Zip the full folder:

```text
moxie-routine-coach-review-radar.zip
```

Include the README and keep the `src`, `scripts`, and `docs` folders together. The recipient can run `node scripts/serve.mjs` and open the local URL.
