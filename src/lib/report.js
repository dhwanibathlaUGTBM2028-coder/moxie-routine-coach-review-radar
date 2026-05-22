import { issueCategories } from "./classifier.js";

export function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

export function average(values) {
  const valid = values.filter((value) => Number.isFinite(Number(value)));
  if (!valid.length) return 0;
  return valid.reduce((sum, value) => sum + Number(value), 0) / valid.length;
}

export function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = typeof key === "function" ? key(item) : item[key];
    const label = value || "Unknown";
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});
}

export function topEntries(record, limit = 5) {
  return Object.entries(record)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }));
}

export function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const value = typeof key === "function" ? key(item) : item[key];
    const label = value || "Unknown";
    if (!acc[label]) acc[label] = [];
    acc[label].push(item);
    return acc;
  }, {});
}

function normalized(value) {
  return String(value || "").toLowerCase();
}

function isMarketplaceSource(source) {
  return /amazon|nykaa|flipkart|myntra/.test(normalized(source));
}

function buildSourceWiseInsight(reviews) {
  const marketplaceReviews = reviews.filter((review) => isMarketplaceSource(review.Source));
  const conversationReviews = reviews.filter((review) => /instagram|support|whatsapp|reddit|quora/.test(normalized(review.Source)));

  const topMarketplaceIssue = topEntries(
    countBy(
      marketplaceReviews.filter((review) => !["Positive repeat purchase", "Positive routine fit"].includes(review.Primary_Issue)),
      "Primary_Issue"
    ),
    1
  )[0]?.label;
  const topConversationIssue = topEntries(
    countBy(
      conversationReviews.filter((review) => !["Positive repeat purchase", "Positive routine fit"].includes(review.Primary_Issue)),
      "Primary_Issue"
    ),
    1
  )[0]?.label;

  if (topMarketplaceIssue && topConversationIssue) {
    return `Marketplace reviews show more ${topMarketplaceIssue.toLowerCase()} signals, while Instagram/support-style comments show more ${topConversationIssue.toLowerCase()} questions. That split suggests product pages need clearer claims and support/content need sharper usage education.`;
  }

  if (topMarketplaceIssue) {
    return `Marketplace reviews are currently led by ${topMarketplaceIssue.toLowerCase()} signals, so low-rating product-page objections should be reviewed first.`;
  }

  if (topConversationIssue) {
    return `Social and support comments are currently led by ${topConversationIssue.toLowerCase()} questions, which makes them good input for FAQs, reels, and reply templates.`;
  }

  return "No strong source-wise split yet. Keep collecting marketplace, website, social, and support comments together for weekly review.";
}

function buildWeeklyRecommendation(topIssue, commonRootCause) {
  if (topIssue === "Sticky or greasy feel") {
    return "Add product-specific quantity visuals this week, especially for styling products where over-application can read as greasiness or buildup.";
  }
  if (topIssue === "Usage confusion") {
    return "Create one routine-order education module and reuse it across product pages, FAQs, WhatsApp replies, and Instagram content.";
  }
  if (topIssue === "Routine mismatch" || commonRootCause.includes("Routine mismatch")) {
    return "Tighten product-fit guidance by hair type, density, scalp type, and climate before pushing customers into bundles.";
  }
  if (topIssue === "Weak hold" || topIssue === "Frizz not controlled") {
    return "Add humid-weather expectation setting and refresh guidance before changing formula claims.";
  }
  return `Review the repeated ${topIssue.toLowerCase()} pattern and assign the first fix to the most affected team owner.`;
}

export function buildAnalytics(reviews) {
  const totalReviews = reviews.length;
  const negativeReviews = reviews.filter((review) => review.Sentiment === "Negative").length;
  const positiveReviews = reviews.filter((review) => review.Sentiment === "Positive").length;
  const highSeverity = reviews.filter((review) => ["High", "Critical"].includes(review.Severity));
  const marketplaceRiskReviews = reviews.filter((review) => review.Funnel_Impact === "Marketplace conversion risk");
  const repeatSignals = reviews.filter((review) => review.Primary_Issue === "Positive repeat purchase");
  const routineSignals = reviews.filter((review) =>
    ["Routine mismatch", "Usage confusion", "Sticky or greasy feel", "Product feels heavy", "Weighed-down curls"].includes(review.Primary_Issue)
  );
  const nonPositiveReviews = reviews.filter((review) => !["Positive repeat purchase", "Positive routine fit"].includes(review.Primary_Issue));
  const complaintBase = nonPositiveReviews.length ? nonPositiveReviews : reviews;

  const categoryCounts = countBy(complaintBase, "Primary_Issue");
  const productCounts = countBy(
    nonPositiveReviews,
    "Product"
  );
  const rootCauseCounts = countBy(complaintBase, "Root_Cause_Hypothesis");
  const severityCounts = countBy(reviews, "Severity");
  const sentimentCounts = countBy(reviews, "Sentiment");
  const sourceCounts = countBy(reviews, "Source");
  const funnelCounts = countBy(reviews, "Funnel_Impact");
  const teamOwnerCounts = countBy(reviews, "Team_Owner");

  const productIssueMatrix = Object.entries(groupBy(reviews, "Product")).map(([product, productReviews]) => {
    const productComplaintBase =
      productReviews.filter((review) => !["Positive repeat purchase", "Positive routine fit"].includes(review.Primary_Issue)) || [];
    const issues = countBy(productComplaintBase.length ? productComplaintBase : productReviews, "Primary_Issue");
    const high = productReviews.filter((review) => ["High", "Critical"].includes(review.Severity)).length;
    const negative = productReviews.filter((review) => review.Sentiment === "Negative").length;
    return {
      product,
      total: productReviews.length,
      negative,
      high,
      topIssue: topEntries(issues, 1)[0]?.label || "Other",
      educationShare: productReviews.filter((review) => review.Issue_Owner === "Usage education").length / productReviews.length
    };
  });

  const sourceIssueTable = Object.entries(groupBy(reviews, "Source")).map(([source, sourceReviews]) => ({
    source,
    total: sourceReviews.length,
    negative: sourceReviews.filter((review) => review.Sentiment === "Negative").length,
    topIssue:
      topEntries(
        countBy(
          sourceReviews.filter((review) => !["Positive repeat purchase", "Positive routine fit"].includes(review.Primary_Issue)).length
            ? sourceReviews.filter((review) => !["Positive repeat purchase", "Positive routine fit"].includes(review.Primary_Issue))
            : sourceReviews,
          "Primary_Issue"
        ),
        1
      )[0]?.label || "Other",
    marketplaceRisk: sourceReviews.filter((review) => review.Funnel_Impact === "Marketplace conversion risk").length
  }));

  const urgentActions = highSeverity
    .slice()
    .sort((a, b) => b.Confidence_Score - a.Confidence_Score)
    .slice(0, 5)
    .map((review) => ({
      product: review.Product,
      issue: review.Primary_Issue,
      severity: review.Severity,
      action: review.Recommended_Brand_Action
    }));

  const educationOpportunities = topEntries(
    countBy(reviews.filter((review) => ["Usage education", "Product fit", "Expectation mismatch"].includes(review.Issue_Owner)), "Product_Page_Fix"),
    7
  );

  const topIssue = topEntries(categoryCounts, 1)[0]?.label || "Other";
  const commonRootCause = topEntries(rootCauseCounts, 1)[0]?.label || "Needs review";
  const averageRating = average(reviews.map((review) => review.Rating || 0));
  const marketplaceRiskScore = totalReviews
    ? Math.min(100, Math.round((marketplaceRiskReviews.length / totalReviews) * 100 + highSeverity.length * 1.8 + negativeReviews * 0.9))
    : 0;
  const marketplaceRiskExplanation =
    "This score combines low ratings, review severity, source risk, and repeated complaint categories. Higher score means more urgent product-page/support intervention is needed.";
  const weeklyRecommendation = buildWeeklyRecommendation(topIssue, commonRootCause);
  const biggestAvoidableReviewRisk = topIssue === "Other" ? "No single avoidable risk dominates yet." : `${topIssue} is the biggest avoidable review risk in this view.`;
  const sourceWiseInsight = buildSourceWiseInsight(reviews);

  return {
    totalReviews,
    negativeReviewShare: totalReviews ? negativeReviews / totalReviews : 0,
    positiveReviewShare: totalReviews ? positiveReviews / totalReviews : 0,
    averageRating,
    categoryCounts,
    productCounts,
    rootCauseCounts,
    severityCounts,
    sentimentCounts,
    sourceCounts,
    funnelCounts,
    teamOwnerCounts,
    highSeverity,
    marketplaceRiskReviews,
    repeatSignals,
    routineSignals,
    productIssueMatrix,
    sourceIssueTable,
    urgentActions,
    educationOpportunities,
    topComplaints: topEntries(categoryCounts, 7),
    topAffectedProducts: topEntries(productCounts, 6),
    teamOwnerTable: topEntries(teamOwnerCounts, 8),
    commonRootCause,
    topIssue,
    marketplaceRiskScore,
    marketplaceRiskExplanation,
    weeklyRecommendation,
    biggestAvoidableReviewRisk,
    sourceWiseInsight
  };
}

function sentenceList(items, fallback) {
  if (!items.length) return fallback;
  return items.map((item) => `- ${item}`).join("\n");
}

export function buildWeeklyReport(reviews, config) {
  const analytics = buildAnalytics(reviews);
  const negativeStylingReviews = reviews.filter(
    (review) =>
      review.Sentiment === "Negative" &&
      /cream|leave|serum|wax|gel|dry shampoo|heat/i.test(review.Product || "")
  );
  const usageLedStyling = negativeStylingReviews.filter((review) =>
    ["Usage education", "Product fit", "Expectation mismatch"].includes(review.Issue_Owner)
  );
  const usageShare = negativeStylingReviews.length ? usageLedStyling.length / negativeStylingReviews.length : 0;
  const topProducts = analytics.topAffectedProducts.map((entry) => `${entry.label} (${entry.value})`);
  const topComplaints = analytics.topComplaints.map((entry) => `${entry.label} (${entry.value})`);
  const urgent = analytics.highSeverity.slice(0, 5);
  const productFixes = [...new Set(reviews.map((review) => review.Product_Page_Fix))].slice(0, 8);
  const educationIdeas = [...new Set(reviews.map((review) => review.Usage_Education_Idea))].slice(0, 8);
  const supportTemplates = [...new Map(reviews.map((review) => [review.Primary_Issue, review.Customer_Support_Reply])).values()].slice(0, 6);
  const contentIdeas = [...new Set(reviews.map((review) => review.Content_Idea))].slice(0, 8);
  const priorityActions = analytics.urgentActions.length
    ? analytics.urgentActions.map((item) => `${item.product}: ${item.action}`)
    : [
        "Review fresh low-rating marketplace reviews.",
        "Choose one repeated routine-confusion pattern for this week's content.",
        "Update one product-page education block."
      ];
  const teamOwners = analytics.teamOwnerTable.map((entry) => `${entry.label}: ${entry.value} items`);
  const weeklyLoop = [
    "Every Monday, upload reviews and comments from Amazon, Nykaa, website, Instagram, WhatsApp, and support.",
    "Review Radar classifies incoming feedback by issue, root cause, severity, confidence, and team owner.",
    "Marketing checks repeated confusion patterns and chooses the week's education angle.",
    "Website team updates product-page FAQs, fit guidance, and quantity visuals.",
    "Content team turns repeated questions into reels, carousels, and post-purchase tips.",
    "Support team uses the suggested reply templates for recovery and troubleshooting.",
    "Product team reviews repeated formula, scent, scalp, or packaging concerns.",
    "Growth tracks whether ratings and objections improve over time."
  ];

  return {
    title: `${config.logoText} Weekly Routine Intelligence Report`,
    generatedOn: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    sections: [
      {
        heading: "Executive Summary",
        body: `${analytics.totalReviews} reviews were analyzed across marketplace, website, support, and social sources. Average rating is ${analytics.averageRating.toFixed(
          2
        )}, with ${formatPercent(analytics.negativeReviewShare)} negative share. The largest avoidable risk is ${analytics.topIssue.toLowerCase()}, and the most repeated root cause is ${analytics.commonRootCause.toLowerCase()}. Marketplace risk is ${analytics.marketplaceRiskScore}/100. The pattern suggests that many complaints are not pure product rejection; they are tied to amount, placement, routine order, fit, or climate expectations.`
      },
      {
        heading: "Priority Actions This Week",
        body: sentenceList(priorityActions.slice(0, 7), "No priority action generated yet.")
      },
      {
        heading: "What Customers Are Struggling With",
        body: `${sentenceList(topComplaints, "No clear complaint concentration yet.")}\n\n${formatPercent(
          usageShare
        )} of negative styling-product reviews are not pure product rejection. They point to usage confusion, product fit, or expectation mismatch, especially around quantity, placement, layering, and humid-weather performance.\n\n${analytics.sourceWiseInsight}`
      },
      {
        heading: "Top Routine Mismatch Patterns",
        body: sentenceList(
          [
            ...new Set(
              reviews
                .filter((review) => ["Routine mismatch", "Usage confusion", "Product feels heavy", "Weighed-down curls"].includes(review.Primary_Issue))
                .map((review) => `${review.Product}: ${review.Root_Cause_Hypothesis}`)
            )
          ].slice(0, 7),
          "No routine mismatch pattern was dominant in this sample."
        )
      },
      {
        heading: "Product-Specific Issues",
        body: sentenceList(
          analytics.productIssueMatrix
            .sort((a, b) => b.high - a.high || b.negative - a.negative)
            .slice(0, 7)
            .map((row) => `${row.product}: ${row.topIssue}, ${row.negative}/${row.total} negative, ${row.high} high-severity`),
          "No product-specific issue stood out."
        )
      },
      {
        heading: "Reviews That Need Immediate Attention",
        body: sentenceList(
          urgent.map(
            (review) =>
              `${review.Product} on ${review.Source}: ${review.Primary_Issue} (${review.Severity}, ${review.Confidence_Score}% confidence). ${review.Review_Text}`
          ),
          "No high-severity review needs immediate triage."
        )
      },
      {
        heading: "Product Page Fixes",
        body: sentenceList(productFixes, "No page fixes generated yet.") + `\n\nOwner lens:\n${sentenceList(teamOwners, "No team owner split generated yet.")}`
      },
      {
        heading: "Usage Education Ideas",
        body: sentenceList(educationIdeas, "No education ideas generated yet.")
      },
      {
        heading: "Customer Support Templates",
        body: sentenceList(supportTemplates, "No support templates generated yet.")
      },
      {
        heading: "Content Ideas for Instagram/Reels",
        body: sentenceList(contentIdeas, "No content ideas generated yet.")
      },
      {
        heading: "How Moxie Could Use This Weekly",
        body: sentenceList(weeklyLoop, "No weekly workflow generated yet.")
      }
    ]
  };
}

export function reportToMarkdown(report) {
  return [`# ${report.title}`, `Generated: ${report.generatedOn}`, ...report.sections.map((section) => `## ${section.heading}\n${section.body}`)].join(
    "\n\n"
  );
}

export function allIssueCategories() {
  return issueCategories;
}
