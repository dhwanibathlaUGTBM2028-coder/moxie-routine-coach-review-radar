import { defaultBrandConfig, loadBrandConfig, resetBrandConfig, saveBrandConfig } from "./config/brandConfig.js";
import { sampleReviews } from "./data/sampleReviews.js";
import { analyzeReviews, issueCategories } from "./lib/classifier.js";
import { defaultQuizAnswers, generateRoutine } from "./lib/recommendationEngine.js";
import { buildAnalytics, buildWeeklyReport, formatPercent, reportToMarkdown, topEntries } from "./lib/report.js";
import { parseCsv, pastedTextToReviews, toCsv } from "./lib/csv.js";
import { copyText, downloadTextFile } from "./lib/downloads.js";

const app = document.querySelector("#app");

const classifiedHeaders = [
  "Date",
  "Source",
  "Product",
  "Rating",
  "Review_Text",
  "Customer_Hair_Type",
  "Purchase_Channel",
  "Verified_Buyer",
  "Location",
  "Status",
  "Sentiment",
  "Primary_Issue",
  "Secondary_Issue",
  "Root_Cause_Hypothesis",
  "Team_Owner",
  "Severity",
  "Confidence_Score",
  "Confidence_Explanation",
  "Climate_Insight",
  "Funnel_Impact",
  "Recommended_Brand_Action",
  "Product_Page_Fix",
  "Usage_Education_Idea",
  "Customer_Support_Reply",
  "Content_Idea"
];

let brandConfig = loadBrandConfig();
let state = {
  view: "home",
  demoMode: true,
  rawReviews: sampleReviews,
  classifiedReviews: analyzeReviews(sampleReviews),
  quizAnswers: { ...defaultQuizAnswers },
  filters: {
    product: "All",
    source: "All",
    rating: "All",
    category: "All",
    severity: "All",
    dateStart: "",
    dateEnd: ""
  },
  toast: ""
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function truncate(value, length = 96) {
  const text = String(value ?? "");
  return text.length > length ? `${text.slice(0, length - 1).trim()}...` : text;
}

function confidenceNote(review) {
  return String(review.Confidence_Explanation || "")
    .replace(/^\d+% confidence because\s+/i, "Because ")
    .replace(/^\d+% confidence:\s+/i, "");
}

function icon(name) {
  const icons = {
    sparkles:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.8 5.1L19 10l-5.2 1.9L12 17l-1.8-5.1L5 10l5.2-1.9L12 3Z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/></svg>',
    chart:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-7"/></svg>',
    upload:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12"/><path d="M7 8l5-5 5 5"/><path d="M5 21h14"/></svg>',
    download:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>',
    copy:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    settings:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a8.8 8.8 0 0 0 .1-2l2-1.5-2-3.4-2.4 1a7.6 7.6 0 0 0-1.7-1L15 5.5h-4L10.6 8a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a8.8 8.8 0 0 0 .1 2l-2 1.5 2 3.4 2.4-1a7.6 7.6 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.4-2.2-1.4Z"/></svg>',
    print:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/></svg>',
    info:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    radar:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 12l8-7"/><circle cx="12" cy="12" r="3"/><path d="M20.3 8.2A9 9 0 1 1 15.8 3.7"/></svg>',
    file:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h5"/></svg>',
    wand:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9H6"/><path d="M20 9h-2"/><path d="M17.8 6.2 19 5"/><path d="M11 11 3 19l2 2 8-8"/><path d="M17.8 11.8 19 13"/><path d="M12.2 6.2 11 5"/></svg>',
    list:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>'
  };
  return `<span class="icon" aria-hidden="true">${icons[name] || icons.info}</span>`;
}

function applyTheme() {
  const root = document.documentElement;
  root.style.setProperty("--primary", brandConfig.primaryColor);
  root.style.setProperty("--secondary", brandConfig.secondaryColor);
  root.style.setProperty("--accent", brandConfig.accentColor);
  root.style.setProperty("--soft", brandConfig.softColor || defaultBrandConfig.softColor);
  root.style.setProperty("--ink", brandConfig.inkColor || defaultBrandConfig.inkColor);
  root.style.setProperty("--display-font", brandConfig.fontFamily);
  root.style.setProperty("--body-font", brandConfig.bodyFontFamily || defaultBrandConfig.bodyFontFamily);
}

function toast(message) {
  state.toast = message;
  render();
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => {
    state.toast = "";
    render();
  }, 2200);
}

function setReviews(reviews, demoMode = false) {
  state.rawReviews = reviews;
  state.classifiedReviews = analyzeReviews(reviews);
  state.demoMode = demoMode;
  state.filters = {
    product: "All",
    source: "All",
    rating: "All",
    category: "All",
    severity: "All",
    dateStart: "",
    dateEnd: ""
  };
}

function getFilteredReviews() {
  return state.classifiedReviews.filter((review) => {
    const rating = Number(review.Rating || 0);
    const date = review.Date || "";
    const filterRating =
      state.filters.rating === "All" ||
      (state.filters.rating === "1-2" && rating <= 2) ||
      (state.filters.rating === "3" && rating === 3) ||
      (state.filters.rating === "4-5" && rating >= 4);

    return (
      (state.filters.product === "All" || review.Product === state.filters.product) &&
      (state.filters.source === "All" || review.Source === state.filters.source) &&
      filterRating &&
      (state.filters.category === "All" || review.Primary_Issue === state.filters.category) &&
      (state.filters.severity === "All" || review.Severity === state.filters.severity) &&
      (!state.filters.dateStart || date >= state.filters.dateStart) &&
      (!state.filters.dateEnd || date <= state.filters.dateEnd)
    );
  });
}

function uniqueOptions(key, reviews = state.classifiedReviews) {
  return [...new Set(reviews.map((review) => review[key]).filter(Boolean))].sort();
}

function optionTags(values, selected) {
  return values.map((value) => `<option value="${escapeHtml(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(value)}</option>`).join("");
}

function pill(label, modifier = "") {
  const className = modifier ? `pill ${modifier.toLowerCase()}` : "pill";
  return `<span class="${className}">${escapeHtml(label)}</span>`;
}

function metricCard(label, value, note, tooltip = "") {
  return `
    <div class="card metric">
      <div class="metric-label">
        <span>${escapeHtml(label)}</span>
        <span title="${escapeHtml(tooltip || note)}">${icon("info")}</span>
      </div>
      <div class="metric-value">${value}</div>
      ${note ? `<div class="metric-note">${escapeHtml(note)}</div>` : ""}
    </div>
  `;
}

function compactList(items, className = "focus-list") {
  const safeItems = (items || []).filter(Boolean);
  if (!safeItems.length) return renderEmpty("No recommendation generated yet.");
  return `<ul class="${className}">${safeItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderTopbar() {
  const tabs = [
    ["home", "Why", "sparkles"],
    ["coach", "Coach", "wand"],
    ["radar", "Radar", "radar"],
    ["dashboard", "Metrics", "chart"],
    ["report", "Weekly Report", "file"],
    ["settings", "Settings", "settings"]
  ];

  return `
    <header class="topbar">
      <div class="topbar-inner">
        <div class="brand-lockup">
          <div class="brand-mark">${brandConfig.logoPath ? `<img src="${escapeHtml(brandConfig.logoPath)}" alt="" />` : "M"}</div>
          <div class="brand-copy">
            <strong>${escapeHtml(brandConfig.logoText)}</strong>
            <span>Routine fit intelligence</span>
          </div>
        </div>
        <nav class="nav-tabs" aria-label="Primary navigation">
          ${tabs
            .map(
              ([view, label, iconName]) =>
                `<button class="nav-tab ${state.view === view ? "active" : ""}" data-view="${view}">${icon(iconName)} ${label}</button>`
            )
            .join("")}
        </nav>
        <div class="top-actions">
          <label class="demo-toggle" title="Loads or clears the built-in sample dataset">
            Demo mode
            <span class="switch">
              <input type="checkbox" id="demoToggle" ${state.demoMode ? "checked" : ""} />
              <span></span>
            </span>
          </label>
        </div>
      </div>
    </header>
  `;
}

function renderHome() {
  const analytics = buildAnalytics(state.classifiedReviews);
  const whyCards = [
    {
      title: "Prevent wrong-fit purchases",
      body:
        "Customers can understand whether a routine suits their hair type, density, scalp, climate, and finish preference before adding products to cart."
    },
    {
      title: "Reduce avoidable bad reviews",
      body:
        "Sticky, greasy, heavy, dry, or weak-hold complaints often point to amount, placement, or routine order. Catching that pattern helps the brand respond before confusion becomes reputation drag."
    },
    {
      title: "Turn review patterns into weekly brand actions",
      body:
        "Repeated complaints become concrete fixes: product-page education, FAQ updates, support replies, reels, and product-team review notes."
    }
  ];

  return `
    <main class="page">
      <section class="hero">
        <div>
          <p class="eyebrow">Proof-of-work for Indian haircare growth</p>
          <h1>Routine Fit Intelligence for Moxie Beauty</h1>
          <p class="lead">
            A local-first tool that helps identify routine mismatch, usage confusion, and avoidable bad-review patterns across haircare reviews, comments, and support messages.
          </p>
          <p class="hero-subline">
            Help customers choose the right routine before buying. Detect usage confusion after reviews. Turn repeated haircare complaints into page fixes, support replies, and content actions.
          </p>
          <div class="hero-actions no-print">
            <button class="button primary" data-view="coach">${icon("wand")} Coach</button>
            <button class="button accent" data-view="radar">${icon("radar")} Radar</button>
            <button class="button" data-view="report">${icon("file")} Report</button>
          </div>
        </div>
        <div class="problem-strip">
          <div class="plain-panel">
            <p class="mini-label">Core positioning</p>
            <span class="big-answer">Routine mismatch is the monetizable problem.</span>
          </div>
          <div class="focus-panel">
            <p class="mini-label">Why it matters</p>
            <h3 style="margin-top:10px;">A bad review can start with the wrong product, wrong amount, or wrong order.</h3>
          </div>
        </div>
        <div class="hero-visual" aria-label="Moxie routine intelligence flow">
          <div class="strand-field">
            <span class="strand one"></span>
            <span class="strand two"></span>
            <span class="strand three"></span>
          </div>
          <div class="hero-card-stack">
            <div class="mini-card">
              <div class="mini-label">01 Customer</div>
              <div class="mini-value">Routine Coach</div>
              <p class="mini-copy">Find the right routine.</p>
            </div>
            <div class="mini-card">
              <div class="mini-label">02 Brand</div>
              <div class="mini-value">Review Radar</div>
              <p class="mini-copy">Spot repeated confusion.</p>
            </div>
            <div class="mini-card">
              <div class="mini-label">03 Team action</div>
              <div class="mini-value">${escapeHtml(analytics.topIssue)}</div>
              <p class="mini-copy">Fix copy, FAQs, support, content.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <div>
            <p class="eyebrow">Why this matters</p>
            <h2>Fix the journey before the review becomes permanent</h2>
          </div>
        </div>
        <div class="why-grid">
          ${whyCards
            .map(
              (card) => `
                <article class="card insight-card">
                  <h3>${escapeHtml(card.title)}</h3>
                  <p>${escapeHtml(card.body)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <div>
            <p class="eyebrow">Demo path</p>
            <h2>Three focused screens</h2>
          </div>
        </div>
        <div class="flow-grid">
          <article class="flow-card" data-step="1">
            <h3>Before purchase: recommend the right routine and usage amount</h3>
            <p class="small">The coach translates hair type, scalp, climate, habit, and sensitivity into a lean routine with specific quantity guidance.</p>
          </article>
          <article class="flow-card" data-step="2">
            <h3>After purchase: detect repeated review complaints and root causes</h3>
            <p class="small">The radar classifies reviews by issue, likely cause, severity, confidence, marketplace risk, and team owner.</p>
          </article>
          <article class="flow-card" data-step="3">
            <h3>Weekly action: update product pages, FAQs, support replies, and content</h3>
            <p class="small">The report converts repeated confusion into product-page fixes, education ideas, reply templates, and content prompts.</p>
          </article>
        </div>
      </section>

      <section class="section">
        <div class="proof-summary">
          <div>
            <p class="eyebrow">Proof-of-Work Summary</p>
            <h2>Built to help a brand team see repeated confusion faster</h2>
            <p>
              I built this as a no-API, local-first prototype for Moxie Beauty. It helps identify routine mismatch and usage confusion from reviews/comments, then turns those patterns into product-page fixes, usage education, support replies, and content actions. The goal is not to replace human judgment, but to help brand, growth, support, and product teams see repeated customer confusion faster.
            </p>
          </div>
          <div class="summary-grid">
            <div><span>Problem observed</span><strong>Wrong fit or wrong usage can look like product failure.</strong></div>
            <div><span>What I built</span><strong>A customer coach plus a brand review intelligence dashboard.</strong></div>
            <div><span>How it works</span><strong>Local rules classify issues, causes, severity, confidence, and owners.</strong></div>
            <div><span>Why Moxie should care</span><strong>It turns scattered review language into action for pages, support, and content.</strong></div>
            <div><span>Weekly use</span><strong>Upload reviews every Monday, triage patterns, and assign team fixes.</strong></div>
            <div><span>Could become</span><strong>A lightweight routine intelligence workflow inside growth and support.</strong></div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="plain-panel">
          <p class="eyebrow">Routine areas</p>
          <div class="product-chip-grid">
            ${brandConfig.categories.map((category) => `<span class="product-chip">${escapeHtml(category)}</span>`).join("")}
          </div>
        </div>
      </section>

      ${renderWeeklyWorkflow()}
    </main>
  `;
}

function renderWeeklyWorkflow() {
  const steps = [
    "Every Monday, upload reviews/comments from Amazon, Nykaa, website, Instagram, and support.",
    "Review Radar classifies all incoming feedback by issue, root cause, severity, confidence, and team owner.",
    "Marketing checks the top repeated confusion patterns and chooses the week's education focus.",
    "Website team updates FAQs, product pages, fit notes, and quantity visuals.",
    "Content team creates usage education reels, carousels, and post-purchase tips.",
    "Support team uses suggested reply templates for recovery and troubleshooting.",
    "Product team reviews repeated formula, scalp, scent, or fit concerns.",
    "Growth team tracks whether ratings and objections improve over time."
  ];

  return `
    <section class="section">
      <div class="section-header">
        <div>
          <p class="eyebrow">How Moxie could use this weekly</p>
          <h2>Monday operating loop</h2>
        </div>
      </div>
      <div class="panel">
        <div class="workflow-list">
          ${steps.map((step) => `<div class="workflow-item"><p class="small">${escapeHtml(step)}</p></div>`).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderCoach() {
  const routine = generateRoutine(state.quizAnswers, brandConfig);
  const options = {
    hairType: ["straight", "wavy", "curly", "coily", "frizzy", "unsure"],
    density: ["fine", "medium", "thick", "unsure"],
    scalp: ["oily", "dry", "normal", "flaky", "unsure"],
    concern: ["frizz", "dryness", "definition", "hold", "flyaways", "volume", "heat damage", "greasy roots", "dullness"],
    climate: ["humid", "dry", "mixed"],
    habit: ["air dry", "heat styling", "tied-up hair", "wash-and-go", "special occasions"],
    preference: ["2-step", "3-step", "full routine"],
    sensitivity: ["hates sticky feel", "hates heavy products", "wants strong hold", "wants lightweight finish"],
    budget: ["low", "medium", "high"]
  };

  const labels = {
    hairType: "Hair type",
    density: "Hair density",
    scalp: "Scalp type",
    concern: "Main concern",
    climate: "Climate",
    habit: "Styling habit",
    preference: "Routine preference",
    sensitivity: "Product sensitivity",
    budget: "Budget sensitivity"
  };

  return `
    <main class="page">
      <section class="section">
        <div class="section-header">
          <div>
            <p class="eyebrow">Customer-facing module</p>
            <h2>Routine Coach</h2>
          </div>
          <button class="button no-print" data-action="demo-profile">${icon("sparkles")} Demo profile</button>
        </div>
        <div class="grid two">
          <div class="panel">
            <h3>Short routine quiz</h3>
            <div class="form-grid" style="margin-top:16px;">
              ${Object.entries(options)
                .map(
                  ([field, values]) => `
                    <div class="field">
                      <label for="${field}">${labels[field]}</label>
                      <select id="${field}" data-quiz="${field}">
                        ${values.map((value) => `<option value="${value}" ${state.quizAnswers[field] === value ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}
                      </select>
                    </div>
                  `
                )
                .join("")}
            </div>
            <div class="why-note" style="margin-top:16px;">
              ${icon("info")}
              <span><strong>Goal:</strong> right product, right amount, right order.</span>
            </div>
          </div>
          <div class="panel">
            <div class="metric-label"><span>Recommended profile</span>${pill(routine.profileSummary)}</div>
            <h3 style="margin-top:12px;">Recommended routine</h3>
            <p class="small" style="margin-top:8px;">${escapeHtml(routine.suggestedBundle.name)} - ${escapeHtml(routine.suggestedBundle.note)}</p>
            <div class="routine-list">
              ${routine.recommendedRoutine
                .map(
                  (step, index) => `
                    <div class="routine-step">
                      <span class="step-number">${index + 1}</span>
                      <div>
                        <strong>${escapeHtml(step.product)}</strong>
                        <p>${escapeHtml(step.role)}.</p>
                        <small>${escapeHtml(step.amount)}</small>
                      </div>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="grid two">
          <article class="card insight-card">
            <h3>Why this routine fits this profile</h3>
            <p>${escapeHtml(routine.whyThisFitsDetailed)}</p>
            ${compactList(routine.whyThisFits)}
          </article>
          <article class="card insight-card">
            <h3>Usage amount and order</h3>
            ${compactList(routine.usageAmountAndOrder)}
          </article>
        </div>
      </section>

      <section class="section">
        <div class="grid three">
          <article class="card insight-card">
            <h3>Common mistake to avoid</h3>
            <p>${escapeHtml(routine.commonMistake)}</p>
          </article>
          <article class="card insight-card">
            <h3>What to avoid for this hair type</h3>
            ${compactList(routine.avoidForHairType)}
          </article>
          <article class="card insight-card">
            <h3>Post-purchase education tip</h3>
            <p>${escapeHtml(routine.postPurchaseEducationTip || routine.postPurchaseTip)}</p>
          </article>
        </div>
      </section>

      <section class="section">
        <div class="grid two">
          <article class="card insight-card">
            <h3>Moxie education card</h3>
            <p><strong>${escapeHtml(routine.educationCard.title)}</strong></p>
            <p>${escapeHtml(routine.educationCard.body)}</p>
            ${compactList(routine.educationCard.bullets)}
          </article>
          <article class="card insight-card">
            <h3>Product-page fix suggestion</h3>
            <p>${escapeHtml(routine.productPageFixSuggestion || routine.productPageEducation)}</p>
          </article>
        </div>
      </section>
    </main>
  `;
}

function renderRadar() {
  const reviews = state.classifiedReviews;
  const analytics = buildAnalytics(reviews);

  return `
    <main class="page">
      <section class="section">
        <div class="page-intro">
          <div class="plain-panel">
            <p class="eyebrow">Brand-facing module</p>
            <h2>Review Radar</h2>
            <p class="lead" style="margin-top:12px;">What are customers confused about?</p>
            <div class="compact-actions no-print">
              <button class="button" data-action="use-sample">${icon("sparkles")} Sample data</button>
              <button class="button ghost" data-action="clear-reviews">${icon("list")} Clear</button>
            </div>
          </div>
          <div class="focus-panel">
            <p class="mini-label">Current focus</p>
            <h3 style="margin-top:10px;">${escapeHtml(analytics.topIssue)}</h3>
            <p class="small" style="margin-top:10px;">${analytics.totalReviews} reviews. ${formatPercent(analytics.negativeReviewShare)} negative.</p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="grid two">
          <div class="panel upload-zone">
            <div class="data-step">
              <span>1</span>
              <div>
                <strong>Upload CSV</strong>
              </div>
            </div>
            <label class="file-input">
              <input type="file" id="csvUpload" accept=".csv,text/csv" />
            </label>
          </div>
          <div class="panel upload-zone">
            <div class="data-step">
              <span>2</span>
              <div>
                <strong>Paste comments</strong>
              </div>
            </div>
            <div class="field">
              <textarea id="pasteReviews" placeholder="Paste one review, support message, or social comment per line. Example: The wax stick made my hair greasy, maybe I used too much."></textarea>
            </div>
            <button class="button primary" data-action="analyze-paste">${icon("radar")} Analyze</button>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <div>
            <p class="eyebrow">What the brand should look at</p>
            <h2>Review queue</h2>
          </div>
          <div class="button-row no-print" style="margin-top:0;">
            <button class="button" data-action="export-csv">${icon("download")} Export CSV</button>
            <button class="button" data-action="export-json">${icon("download")} Export JSON</button>
          </div>
        </div>
        ${reviews.length ? renderReviewTable(reviews.slice(0, 18), true) : renderEmpty("Load sample data, upload CSV, or paste reviews to begin.")}
      </section>
    </main>
  `;
}

function renderFilters() {
  return `
    <div class="filter-bar no-print">
      <div class="field">
        <label>Product</label>
        <select data-filter="product"><option>All</option>${optionTags(uniqueOptions("Product"), state.filters.product)}</select>
      </div>
      <div class="field">
        <label>Source</label>
        <select data-filter="source"><option>All</option>${optionTags(uniqueOptions("Source"), state.filters.source)}</select>
      </div>
      <div class="field">
        <label>Rating</label>
        <select data-filter="rating">
          ${optionTags(["All", "1-2", "3", "4-5"], state.filters.rating)}
        </select>
      </div>
      <div class="field">
        <label>Category</label>
        <select data-filter="category"><option>All</option>${optionTags(issueCategories, state.filters.category)}</select>
      </div>
      <div class="field">
        <label>Severity</label>
        <select data-filter="severity">${optionTags(["All", "Critical", "High", "Medium", "Low"], state.filters.severity)}</select>
      </div>
      <div class="field">
        <label>From</label>
        <input type="date" data-filter="dateStart" value="${escapeHtml(state.filters.dateStart)}" />
      </div>
      <div class="field">
        <label>To</label>
        <input type="date" data-filter="dateEnd" value="${escapeHtml(state.filters.dateEnd)}" />
      </div>
    </div>
  `;
}

function renderDashboard() {
  const filtered = getFilteredReviews();
  const analytics = buildAnalytics(filtered);
  const allAnalytics = buildAnalytics(state.classifiedReviews);

  return `
    <main class="page">
      <section class="section">
        <div class="page-intro">
          <div class="plain-panel">
            <p class="eyebrow">Metrics for the weekly review</p>
            <h2>Decision-ready review intelligence</h2>
            <p class="lead" style="margin-top:12px;">Use this page to decide which customer confusion pattern gets fixed first, and which team should own it.</p>
          </div>
          <div class="focus-panel">
            <p class="mini-label">Marketplace risk</p>
            <h3 style="margin-top:10px;">${analytics.marketplaceRiskScore}/100</h3>
            <p class="small" style="margin-top:10px;">${escapeHtml(analytics.marketplaceRiskExplanation)}</p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="grid three decision-grid">
          <article class="card decision-card">
            <p class="mini-label">What Moxie should do this week</p>
            <h3>${escapeHtml(analytics.weeklyRecommendation)}</h3>
          </article>
          <article class="card decision-card">
            <p class="mini-label">Biggest avoidable review risk</p>
            <h3>${escapeHtml(analytics.biggestAvoidableReviewRisk)}</h3>
          </article>
          <article class="card decision-card">
            <p class="mini-label">Most repeated root cause</p>
            <h3>${escapeHtml(analytics.commonRootCause)}</h3>
          </article>
        </div>
      </section>

      <section class="section">
        <div class="plain-panel">
          <p class="mini-label">Optional filters</p>
          ${renderFilters()}
          <div class="grid four">
            ${metricCard("Reviews", analytics.totalReviews, "")}
            ${metricCard("Negative share", formatPercent(analytics.negativeReviewShare), "")}
            ${metricCard("Average rating", analytics.averageRating.toFixed(2), "")}
            ${metricCard("Repeat signals", analytics.repeatSignals.length, "Positive routine fit or repurchase signals.")}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="dashboard-layout">
          <div class="card chart-card">
            <h3>Top complaint categories</h3>
            ${renderBarChart(analytics.topComplaints.slice(0, 6), "No issues in this filter.")}
          </div>
          <div class="card">
            <h3>Team owner breakdown</h3>
            ${renderBarChart(analytics.teamOwnerTable, "No team owners in this filter.")}
            <div class="why-note" style="margin-top:16px;">
              ${icon("info")}
              <span>Owners are assigned by issue type, source risk, and likely action: page fix, reel/tutorial, reply template, product review, or marketplace intervention.</span>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="dashboard-layout">
          <div class="panel">
            <h3>Top 5 urgent actions</h3>
            ${
              analytics.urgentActions.length
                ? `<div class="workflow-list" style="margin-top:16px;">${analytics.urgentActions
                    .map((item) => `<div class="workflow-item"><p class="small"><strong>${escapeHtml(item.product)}:</strong> ${escapeHtml(item.action)}</p></div>`)
                    .join("")}</div>`
                : renderEmpty("No high-severity item in this filtered view.")
            }
          </div>
          <div class="panel">
            <h3>Sentiment and severity</h3>
            <div style="margin-top:16px;">
              ${renderStackedBar(analytics.sentimentCounts)}
            </div>
            <div style="margin-top:18px;">
              ${renderBarChart(topEntries(analytics.severityCounts, 4), "No severity data.")}
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="grid two">
          <div class="panel">
            <h3>Product issue table</h3>
            ${renderProductHeatmap(analytics.productIssueMatrix)}
          </div>
          <div class="panel">
            <h3>Source-wise issue table</h3>
            <p class="small" style="margin-top:8px;">${escapeHtml(analytics.sourceWiseInsight)}</p>
            ${renderSourceTable(analytics.sourceIssueTable)}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="why-note">
          ${icon("info")}
          <span>${allAnalytics.totalReviews} records. ${allAnalytics.highSeverity.length} urgent. ${allAnalytics.marketplaceRiskReviews.length} marketplace risks.</span>
        </div>
      </section>
    </main>
  `;
}

function renderReport() {
  const filtered = getFilteredReviews();
  const reviews = filtered.length ? filtered : state.classifiedReviews;
  const report = buildWeeklyReport(reviews, brandConfig);
  const analytics = buildAnalytics(reviews);
  const defaultOpenSections = new Set(["Executive Summary", "Priority Actions This Week", "Product Page Fixes", "Usage Education Ideas"]);

  return `
    <main class="page">
      <section class="section no-print">
        <div class="section-header">
          <div>
            <p class="eyebrow">Exportable insight report</p>
            <h2>Weekly Report</h2>
          </div>
          <div class="button-row" style="margin-top:0;">
            <button class="button primary" data-action="print-report">${icon("print")} Export PDF</button>
            <button class="button" data-action="copy-report">${icon("copy")} Copy report</button>
            <button class="button" data-action="export-csv">${icon("download")} Reviews CSV</button>
            <button class="button" data-action="export-insights-json">${icon("download")} Insights JSON</button>
          </div>
        </div>
        <details class="filter-details">
          <summary>Filters</summary>
          ${renderFilters()}
        </details>
      </section>
      <section class="report-shell">
        <div class="report-cover">
          <p class="eyebrow">${escapeHtml(report.generatedOn)}</p>
          <h1 class="report-title">${escapeHtml(report.title)}</h1>
          <p class="report-lede">A weekly, presentation-ready readout of routine mismatch, usage confusion, marketplace risk, and next actions for brand, growth, support, website, and product teams.</p>
          <div class="grid four" style="margin-top:18px;">
            ${metricCard("Reviews", analytics.totalReviews, "")}
            ${metricCard("Negative share", formatPercent(analytics.negativeReviewShare), "")}
            ${metricCard("Top issue", escapeHtml(analytics.topIssue), "")}
            ${metricCard("Risk score", `${analytics.marketplaceRiskScore}/100`, "")}
          </div>
        </div>
        ${report.sections
          .map(
            (section) => `
              <details class="report-section" ${defaultOpenSections.has(section.heading) ? "open" : ""}>
                <summary>${escapeHtml(section.heading)}</summary>
                <pre>${escapeHtml(section.body)}</pre>
              </details>
            `
          )
          .join("")}
      </section>
    </main>
  `;
}

function renderSettings() {
  return `
    <main class="page">
      <section class="section">
        <div class="section-header">
          <div>
            <p class="eyebrow">Brand personalization</p>
            <h2>Settings and config</h2>
            <p>These values are stored in browser localStorage. Replace them before sending as an official branded artifact.</p>
          </div>
        </div>
        <div class="settings-grid">
          <div class="panel">
            <h3>Theme</h3>
            <div class="form-grid" style="margin-top:16px;">
              ${textField("logoText", "Logo text", brandConfig.logoText)}
              ${textField("logoPath", "Logo path", brandConfig.logoPath, "Use a local relative path after adding your own logo.")}
              ${textField("fontFamily", "Display font family", brandConfig.fontFamily)}
              ${textField("bodyFontFamily", "Body font family", brandConfig.bodyFontFamily)}
              ${colorField("primaryColor", "Primary color", brandConfig.primaryColor)}
              ${colorField("secondaryColor", "Secondary color", brandConfig.secondaryColor)}
              ${colorField("accentColor", "Accent color", brandConfig.accentColor)}
              ${colorField("softColor", "Soft color", brandConfig.softColor)}
            </div>
            <div class="button-row no-print">
              <button class="button primary" data-action="save-config">${icon("settings")} Save config</button>
              <button class="button" data-action="reset-config">${icon("list")} Reset config</button>
            </div>
          </div>
          <div class="panel">
            <h3>Products and categories</h3>
            <div class="field" style="margin-top:16px;">
              <label for="productNames">Product names</label>
              <textarea id="productNames" data-config="productNames">${escapeHtml(brandConfig.productNames.join("\n"))}</textarea>
            </div>
            <div class="field" style="margin-top:16px;">
              <label for="categories">Categories</label>
              <textarea id="categories" data-config="categories">${escapeHtml(brandConfig.categories.join("\n"))}</textarea>
            </div>
            <div class="why-note" style="margin-top:16px;">
              ${icon("info")}
              <span><strong>Customization note:</strong> ${escapeHtml(brandConfig.brandNote)}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}

function textField(id, label, value, placeholder = "") {
  return `
    <div class="field">
      <label for="${id}">${escapeHtml(label)}</label>
      <input id="${id}" data-config="${id}" value="${escapeHtml(value || "")}" placeholder="${escapeHtml(placeholder)}" />
    </div>
  `;
}

function colorField(id, label, value) {
  return `
    <div class="field">
      <label for="${id}">${escapeHtml(label)}</label>
      <div class="color-row">
        <input data-config="${id}" value="${escapeHtml(value || "")}" />
        <input type="color" data-color-proxy="${id}" value="${escapeHtml(value || "#ffffff")}" />
      </div>
    </div>
  `;
}

function renderBarChart(entries, emptyText) {
  if (!entries.length) return renderEmpty(emptyText);
  const max = Math.max(...entries.map((entry) => entry.value), 1);
  return `
    <div class="bar-chart">
      ${entries
        .map(
          (entry) => `
            <div class="bar-row">
              <div class="bar-label" title="${escapeHtml(entry.label)}">${escapeHtml(entry.label)}</div>
              <div class="bar-track"><div class="bar-fill" style="width:${Math.max(6, (entry.value / max) * 100)}%;"></div></div>
              <div class="bar-value">${entry.value}</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderStackedBar(counts) {
  const entries = Object.entries(counts);
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  if (!total) return renderEmpty("No sentiment data.");
  return `
    <div class="stacked-bar" title="Sentiment distribution">
      ${entries
        .map(([label, value]) => {
          const width = Math.max(8, (value / total) * 100);
          return `<div class="segment ${label.toLowerCase()}" style="width:${width}%;">${value}</div>`;
        })
        .join("")}
    </div>
  `;
}

function renderProductHeatmap(rows) {
  if (!rows.length) return renderEmpty("No product issues in this view.");
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Product</th><th>Total</th><th>Negative</th><th>High severity</th><th>Top issue</th><th>Education share</th></tr></thead>
        <tbody>
          ${rows
            .sort((a, b) => b.high - a.high || b.negative - a.negative)
            .map((row) => {
              const heat = row.high >= 3 ? 3 : row.high >= 2 ? 2 : row.high >= 1 ? 1 : 0;
              return `
                <tr>
                  <td>${escapeHtml(row.product)}</td>
                  <td>${row.total}</td>
                  <td>${row.negative}</td>
                  <td><span class="heatmap-cell heat-${heat}">${row.high}</span></td>
                  <td>${escapeHtml(row.topIssue)}</td>
                  <td>${formatPercent(row.educationShare)}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderSourceTable(rows) {
  if (!rows.length) return renderEmpty("No source data in this view.");
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Source</th><th>Total</th><th>Negative</th><th>Marketplace risk</th><th>Top issue</th></tr></thead>
        <tbody>
          ${rows
            .sort((a, b) => b.marketplaceRisk - a.marketplaceRisk || b.negative - a.negative)
            .map(
              (row) => `
                <tr>
                  <td>${escapeHtml(row.source)}</td>
                  <td>${row.total}</td>
                  <td>${row.negative}</td>
                  <td>${row.marketplaceRisk}</td>
                  <td>${escapeHtml(row.topIssue)}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderReviewTable(reviews, compact = false) {
  if (compact) {
    return `
      <div class="table-wrap">
        <table class="compact-table radar-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Source</th>
              <th>Review</th>
              <th>Primary issue</th>
              <th>Root cause</th>
              <th>Severity</th>
              <th>Confidence</th>
              <th>Recommended action</th>
            </tr>
          </thead>
          <tbody>
            ${reviews
              .map(
                (review) => `
                  <tr>
                    <td><strong>${escapeHtml(review.Product)}</strong><br><span class="small">${escapeHtml(review.Team_Owner || "Support team")}</span></td>
                    <td>${escapeHtml(review.Source)}</td>
                    <td class="review-text">${escapeHtml(truncate(review.Review_Text, 120))}</td>
                    <td>${escapeHtml(review.Primary_Issue)}</td>
                    <td>${escapeHtml(truncate(review.Root_Cause_Hypothesis, 92))}</td>
                    <td>${pill(review.Severity, review.Severity)}</td>
                    <td><strong>${review.Confidence_Score}%</strong><br><span class="small">${escapeHtml(truncate(confidenceNote(review), 92))}</span></td>
                    <td class="action-cell">${escapeHtml(truncate(review.Recommended_Brand_Action, 170))}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Source</th>
            <th>Product</th>
            <th>Review</th>
            <th>Rating</th>
            <th>Sentiment</th>
            <th>Primary issue</th>
            <th>Root cause</th>
            <th>Severity</th>
            <th>Confidence</th>
            <th>Team owner</th>
            <th>Funnel impact</th>
            <th>Recommended action</th>
          </tr>
        </thead>
        <tbody>
          ${reviews
            .map(
              (review) => `
                <tr>
                  <td>${escapeHtml(review.Date)}</td>
                  <td>${escapeHtml(review.Source)}</td>
                  <td>${escapeHtml(review.Product)}</td>
                  <td class="review-text">${escapeHtml(review.Review_Text)}</td>
                  <td>${review.Rating || "-"}</td>
                  <td>${pill(review.Sentiment, review.Sentiment)}</td>
                  <td>${escapeHtml(review.Primary_Issue)}${compact ? "" : `<br><span class="small">${escapeHtml(review.Secondary_Issue)}</span>`}</td>
                  <td>${escapeHtml(review.Root_Cause_Hypothesis)}</td>
                  <td>${pill(review.Severity, review.Severity)}</td>
                  <td>${review.Confidence_Score}%<br><span class="small">${escapeHtml(confidenceNote(review))}</span></td>
                  <td>${escapeHtml(review.Team_Owner || "Support team")}</td>
                  <td>${escapeHtml(review.Funnel_Impact)}</td>
                  <td class="action-cell">${escapeHtml(review.Recommended_Brand_Action)}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderEmpty(message) {
  return `<div class="empty-state"><p>${escapeHtml(message)}</p></div>`;
}

function render() {
  applyTheme();
  const views = {
    home: renderHome,
    coach: renderCoach,
    radar: renderRadar,
    dashboard: renderDashboard,
    report: renderReport,
    settings: renderSettings
  };
  app.innerHTML = `
    <div class="app-shell">
      ${renderTopbar()}
      ${views[state.view]()}
      ${state.toast ? `<div class="toast">${escapeHtml(state.toast)}</div>` : ""}
    </div>
  `;
}

function handleViewChange(view) {
  state.view = view;
  window.scrollTo({ top: 0, behavior: "smooth" });
  render();
}

function saveConfigFromDom() {
  const next = { ...brandConfig };
  document.querySelectorAll("[data-config]").forEach((input) => {
    const key = input.dataset.config;
    if (key === "productNames" || key === "categories") {
      next[key] = input.value
        .split(/\n+/)
        .map((item) => item.trim())
        .filter(Boolean);
    } else {
      next[key] = input.value;
    }
  });
  brandConfig = next;
  saveBrandConfig(brandConfig);
  toast("Brand config saved locally.");
}

function exportCsv() {
  downloadTextFile("moxie-classified-reviews.csv", toCsv(state.classifiedReviews, classifiedHeaders), "text/csv");
  toast("Classified CSV exported.");
}

function exportJson(filename = "moxie-classified-reviews.json", data = state.classifiedReviews) {
  downloadTextFile(filename, JSON.stringify(data, null, 2), "application/json");
  toast("JSON exported.");
}

async function handleFileUpload(file) {
  if (!file) return;
  const text = await file.text();
  const parsed = parseCsv(text);
  if (!parsed.length) {
    toast("No CSV rows found. Check headers and formatting.");
    return;
  }
  setReviews(parsed, false);
  toast(`${parsed.length} CSV reviews analyzed.`);
}

document.addEventListener("click", async (event) => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    handleViewChange(viewButton.dataset.view);
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  const action = actionButton.dataset.action;

  if (action === "demo-profile") {
    state.quizAnswers = { ...defaultQuizAnswers };
    toast("Demo profile loaded.");
  }

  if (action === "use-sample") {
    setReviews(sampleReviews, true);
    toast("Sample dataset loaded.");
  }

  if (action === "clear-reviews") {
    setReviews([], false);
    toast("Review data cleared.");
  }

  if (action === "analyze-paste") {
    const textarea = document.querySelector("#pasteReviews");
    const parsed = pastedTextToReviews(textarea?.value || "");
    if (!parsed.length) {
      toast("Paste at least one review line.");
      return;
    }
    setReviews([...parsed, ...state.rawReviews], false);
    toast(`${parsed.length} pasted reviews analyzed.`);
  }

  if (action === "export-csv") exportCsv();

  if (action === "export-json") exportJson();

  if (action === "export-insights-json") {
    const reviews = getFilteredReviews().length ? getFilteredReviews() : state.classifiedReviews;
    const report = buildWeeklyReport(reviews, brandConfig);
    exportJson("moxie-weekly-routine-intelligence.json", {
      report,
      analytics: buildAnalytics(reviews)
    });
  }

  if (action === "print-report") {
    window.print();
  }

  if (action === "copy-report") {
    const reviews = getFilteredReviews().length ? getFilteredReviews() : state.classifiedReviews;
    const report = buildWeeklyReport(reviews, brandConfig);
    await copyText(reportToMarkdown(report));
    toast("Report copied to clipboard.");
  }

  if (action === "save-config") saveConfigFromDom();

  if (action === "reset-config") {
    brandConfig = resetBrandConfig();
    toast("Brand config reset.");
  }

  render();
});

document.addEventListener("change", async (event) => {
  const quiz = event.target.closest("[data-quiz]");
  if (quiz) {
    state.quizAnswers[quiz.dataset.quiz] = quiz.value;
    render();
    return;
  }

  const filter = event.target.closest("[data-filter]");
  if (filter) {
    state.filters[filter.dataset.filter] = filter.value;
    render();
    return;
  }

  const colorProxy = event.target.closest("[data-color-proxy]");
  if (colorProxy) {
    const field = document.querySelector(`[data-config="${colorProxy.dataset.colorProxy}"]`);
    if (field) field.value = colorProxy.value;
    return;
  }

  if (event.target.id === "csvUpload") {
    await handleFileUpload(event.target.files?.[0]);
    render();
  }

  if (event.target.id === "demoToggle") {
    if (event.target.checked) {
      setReviews(sampleReviews, true);
      toast("Demo mode on.");
    } else {
      setReviews([], false);
      toast("Demo mode off. Upload or paste reviews.");
    }
    render();
  }
});

render();
