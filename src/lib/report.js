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
    commonRootCause,
    topIssue,
    marketplaceRiskScore
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

  return {
    title: `${config.logoText} Weekly Routine Intelligence Report`,
    generatedOn: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    sections: [
      {
        heading: "Executive Summary",
        body: `Analyzed ${analytics.totalReviews} reviews and customer messages. Average rating is ${analytics.averageRating.toFixed(
          2
        )}, with ${formatPercent(analytics.negativeReviewShare)} negative share. The leading issue is ${analytics.topIssue}. Most repeated root-cause signal: ${analytics.commonRootCause}. Marketplace risk score is ${analytics.marketplaceRiskScore}/100.`
      },
      {
        heading: "What Customers Are Struggling With",
        body: `${sentenceList(topComplaints, "No clear complaint concentration yet.")}\n\n${formatPercent(
          usageShare
        )} of negative styling-product reviews are not pure product rejection. They point to usage confusion, product fit, or expectation mismatch, especially around quantity, placement, layering, and humid-weather performance.`
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
        heading: "Top Product-Specific Issues",
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
        body: sentenceList(productFixes, "No page fixes generated yet.")
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
        heading: "Marketplace Conversion Risks",
        body: sentenceList(
          analytics.marketplaceRiskReviews
            .slice(0, 7)
            .map((review) => `${review.Source} / ${review.Product}: ${review.Primary_Issue}. ${review.Product_Page_Fix}`),
          "Marketplace risk is low in this filtered view."
        )
      },
      {
        heading: "Priority Actions for This Week",
        body: sentenceList(priorityActions.slice(0, 7), "No priority action generated yet.")
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
