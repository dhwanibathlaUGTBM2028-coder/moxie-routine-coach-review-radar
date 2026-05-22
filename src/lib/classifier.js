export const issueCategories = [
  "Routine mismatch",
  "Usage confusion",
  "Sticky or greasy feel",
  "Product feels heavy",
  "Dryness",
  "Weak hold",
  "Weighed-down curls",
  "Frizz not controlled",
  "White cast or residue",
  "Scalp concern",
  "Scent concern",
  "Price/quantity concern",
  "Packaging issue",
  "Delivery issue",
  "Positive repeat purchase",
  "Positive routine fit",
  "Other"
];

const MARKETPLACE_SOURCES = ["amazon", "nykaa", "flipkart", "myntra"];

const keywordTaxonomy = {
  "Routine mismatch": [
    ["wrong product", 4],
    ["not for my hair", 4],
    ["not for wavy", 4],
    ["not for curly", 4],
    ["not sure if", 3],
    ["confused which routine", 3],
    ["routine to buy", 3],
    ["for fine hair", 2],
    ["for oily scalp", 2],
    ["straight hair", 2],
    ["wavy or curly", 4],
    ["between 2b and 2c", 3],
    ["not enough for dense curls", 3],
    ["maybe good for wavy", 3],
    ["not for my routine", 3],
    ["only for frizz", 3],
    ["colored hair", 2]
  ],
  "Usage confusion": [
    ["how much", 5],
    ["used too much", 5],
    ["too much", 3],
    ["quantity", 4],
    ["application", 4],
    ["apply", 2],
    ["applied", 2],
    ["instructions", 4],
    ["correct way", 4],
    ["layer", 4],
    ["routine order", 5],
    ["before or after", 5],
    ["should i use", 4],
    ["can i use", 3],
    ["diagram", 4],
    ["placement", 4],
    ["sprayed too close", 4],
    ["blend", 3],
    ["brush", 2],
    ["on damp hair", 2],
    ["on dry hair", 2],
    ["non-wash days", 3],
    ["remove it", 3]
  ],
  "Sticky or greasy feel": [
    ["sticky", 5],
    ["greasy", 5],
    ["oily", 4],
    ["limp", 3],
    ["waxy", 3],
    ["chip chip", 4],
    ["buildup", 4],
    ["build up", 4],
    ["residue", 3],
    ["looked oily", 5],
    ["roots looked oily", 5],
    ["greasy roots", 5]
  ],
  "Product feels heavy": [
    ["heavy", 5],
    ["too rich", 4],
    ["weighed down", 5],
    ["flat", 3],
    ["flatten", 4],
    ["crown flat", 4],
    ["low volume", 2],
    ["limp", 4],
    ["dense", 1]
  ],
  Dryness: [
    ["dry", 5],
    ["rough", 4],
    ["frizzy dry", 4],
    ["dry ends", 5],
    ["dried", 4],
    ["moisture", 2],
    ["hydration", 2],
    ["skip conditioner", 4],
    ["ends feel dry", 5]
  ],
  "Weak hold": [
    ["weak hold", 6],
    ["hold did not last", 5],
    ["not strong hold", 5],
    ["not enough", 3],
    ["opened up", 4],
    ["did not last", 4],
    ["last in humidity", 4],
    ["two hours", 2]
  ],
  "Weighed-down curls": [
    ["weighed down", 6],
    ["curls opened", 4],
    ["not defined", 4],
    ["not defined enough", 5],
    ["crown flat", 4],
    ["flat curls", 4],
    ["made my curls soft but not", 3],
    ["definition", 2]
  ],
  "Frizz not controlled": [
    ["frizz", 4],
    ["puffy", 4],
    ["flyaways", 2],
    ["baby hairs", 2],
    ["not control frizz", 6],
    ["did not control frizz", 6],
    ["still puffy", 5],
    ["frizzy at the crown", 4],
    ["humid", 2],
    ["humidity", 2]
  ],
  "White cast or residue": [
    ["white cast", 7],
    ["grey", 5],
    ["gray", 5],
    ["white flakes", 6],
    ["flakes", 4],
    ["residue", 4],
    ["powder", 2],
    ["blending", 3],
    ["looks grey", 6]
  ],
  "Scalp concern": [
    ["scalp", 4],
    ["itchy", 6],
    ["itch", 6],
    ["flaky", 5],
    ["dandruff", 4],
    ["sensitive scalp", 5],
    ["sweaty scalp", 3],
    ["oily scalp", 3],
    ["hair fall", 6],
    ["hairfall", 6]
  ],
  "Scent concern": [
    ["scent", 5],
    ["fragrance", 5],
    ["smell", 4],
    ["perfume", 3],
    ["headache", 5],
    ["too strong", 4]
  ],
  "Price/quantity concern": [
    ["price", 5],
    ["quantity", 4],
    ["waste of money", 6],
    ["too expensive", 5],
    ["value", 3],
    ["bigger", 2],
    ["refill", 2],
    ["ml", 1]
  ],
  "Packaging issue": [
    ["packaging", 5],
    ["leaked", 6],
    ["leak", 6],
    ["broken", 5],
    ["cap", 3],
    ["nozzle", 6],
    ["outer box", 4],
    ["tube", 1],
    ["bottle", 1]
  ],
  "Delivery issue": [
    ["delivery", 6],
    ["delivered", 4],
    ["late", 5],
    ["returning", 4],
    ["order came late", 6],
    ["damaged box", 4],
    ["marketplace delivery", 6]
  ],
  "Positive repeat purchase": [
    ["repurchase", 6],
    ["ordered again", 6],
    ["second tube", 6],
    ["again", 4],
    ["repeat", 5],
    ["will repurchase", 6],
    ["re-order", 5],
    ["already ordered", 5]
  ],
  "Positive routine fit": [
    ["loved it", 5],
    ["love", 3],
    ["finally", 4],
    ["perfect", 4],
    ["works best", 3],
    ["works nicely", 3],
    ["works well", 3],
    ["soft", 2],
    ["smoother", 2],
    ["frizz-free", 4],
    ["game changer", 5],
    ["no heavy residue", 4],
    ["not heavy", 3],
    ["lightweight finish", 4],
    ["small amount is enough", 4],
    ["small swipe", 4],
    ["one pump is enough", 4],
    ["humid weather", 2]
  ]
};

const positiveKeywords = [
  "loved",
  "love",
  "finally",
  "repurchase",
  "ordered again",
  "works",
  "perfect",
  "soft",
  "smooth",
  "nice",
  "great",
  "excellent",
  "best",
  "second tube",
  "saved",
  "manageable"
];

const negativeKeywords = [
  "sticky",
  "greasy",
  "heavy",
  "dry",
  "itchy",
  "white cast",
  "flakes",
  "leaked",
  "broken",
  "waste",
  "returning",
  "did not",
  "not control",
  "weak hold",
  "too strong",
  "headache",
  "limp",
  "flat"
];

const ownerMap = {
  "Usage confusion": "Usage education",
  "Routine mismatch": "Product fit",
  "Sticky or greasy feel": "Usage education",
  "Product feels heavy": "Product fit",
  Dryness: "Expectation mismatch",
  "Weak hold": "Expectation mismatch",
  "Weighed-down curls": "Product fit",
  "Frizz not controlled": "Expectation mismatch",
  "White cast or residue": "Usage education",
  "Scalp concern": "Product fit",
  "Scent concern": "Formula preference",
  "Price/quantity concern": "Commercial expectation",
  "Packaging issue": "Packaging",
  "Delivery issue": "Logistics",
  "Positive repeat purchase": "Growth signal",
  "Positive routine fit": "Growth signal",
  Other: "Needs review"
};

export function normalizeText(value = "") {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9+/#.\s-]/g, " ")
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function numericRating(review) {
  const rating = Number(review.Rating ?? review.rating ?? 0);
  return Number.isFinite(rating) ? rating : 0;
}

function sourceName(review) {
  return normalizeText(review.Source || review.source || review.Purchase_Channel || "");
}

function productName(review) {
  return String(review.Product || review.product || "Unassigned product");
}

function combinedText(review) {
  return normalizeText(
    `${review.Review_Text || review.review_text || review.text || ""} ${review.Customer_Hair_Type || ""} ${review.Location || ""}`
  );
}

function scoreTerms(text, weightedTerms) {
  return weightedTerms.reduce((score, [term, weight]) => {
    const normalizedTerm = normalizeText(term);
    return text.includes(normalizedTerm) ? score + weight : score;
  }, 0);
}

function boostProductLogic(scores, review, text) {
  const product = normalizeText(productName(review));

  if ((product.includes("wax") || product.includes("serum")) && /sticky|greasy|oily|waxy|buildup/.test(text)) {
    scores["Sticky or greasy feel"] = (scores["Sticky or greasy feel"] || 0) + 5;
    scores["Usage confusion"] = (scores["Usage confusion"] || 0) + 2;
  }

  if ((product.includes("curl") || product.includes("leave in") || product.includes("conditioner")) && /fine|2a|2b|flat|heavy|weighed/.test(text)) {
    scores["Routine mismatch"] = (scores["Routine mismatch"] || 0) + 3;
    scores["Product feels heavy"] = (scores["Product feels heavy"] || 0) + 3;
  }

  if ((product.includes("gel") || product.includes("styling")) && /humidity|sweat|hold|opened/.test(text)) {
    scores["Weak hold"] = (scores["Weak hold"] || 0) + 4;
  }

  if (product.includes("dry shampoo") && /white|grey|gray|powder|blend|itchy|scalp/.test(text)) {
    scores["White cast or residue"] = (scores["White cast or residue"] || 0) + 4;
    if (/scalp|itchy|sweaty/.test(text)) {
      scores["Scalp concern"] = (scores["Scalp concern"] || 0) + 3;
    }
  }

  if ((product.includes("shampoo") || product.includes("conditioner")) && /scalp|flaky|dandruff|itchy/.test(text)) {
    scores["Scalp concern"] = (scores["Scalp concern"] || 0) + 3;
  }

  if (/mumbai|chennai|goa|kolkata|humid|humidity|sweat|monsoon/.test(text) && /frizz|hold|puffy|opened/.test(text)) {
    scores["Frizz not controlled"] = (scores["Frizz not controlled"] || 0) + 2;
    scores["Weak hold"] = (scores["Weak hold"] || 0) + 1;
  }

  if (/again|repurchase|second|finally/.test(text)) {
    scores["Positive repeat purchase"] = (scores["Positive repeat purchase"] || 0) + 4;
  }

  if (/can i|should i|how much|not sure|confused|instructions|diagram|routine order/.test(text)) {
    scores["Usage confusion"] = (scores["Usage confusion"] || 0) + 4;
  }

  if (/leak|broken|nozzle|cap|box|packaging|delivery|late/.test(text)) {
    scores["Packaging issue"] = (scores["Packaging issue"] || 0) + 2;
  }
}

export function classifySentiment(review) {
  const rating = numericRating(review);
  const text = combinedText(review);
  let score = 0;

  if (rating >= 5) score += 3;
  else if (rating === 4) score += 2;
  else if (rating === 3) score += 0;
  else if (rating === 2) score -= 2;
  else if (rating === 1) score -= 3;

  positiveKeywords.forEach((keyword) => {
    if (text.includes(normalizeText(keyword))) score += 1;
  });
  negativeKeywords.forEach((keyword) => {
    if (text.includes(normalizeText(keyword))) score -= 1;
  });

  if (/but|however|although|maybe/.test(text) && Math.abs(score) <= 3) {
    return { sentiment: "Mixed", sentimentScore: score };
  }

  if (score >= 3) return { sentiment: "Positive", sentimentScore: score };
  if (score <= -3) return { sentiment: "Negative", sentimentScore: score };
  return { sentiment: rating === 3 ? "Neutral" : "Mixed", sentimentScore: score };
}

export function classifyIssue(review) {
  const text = combinedText(review);
  const rating = numericRating(review);
  const { sentiment } = classifySentiment(review);
  const scores = {};

  issueCategories.forEach((category) => {
    if (category !== "Other") scores[category] = scoreTerms(text, keywordTaxonomy[category] || []);
  });

  boostProductLogic(scores, review, text);

  if (rating <= 2) {
    scores["Positive repeat purchase"] = Math.max(0, (scores["Positive repeat purchase"] || 0) - 3);
    scores["Positive routine fit"] = Math.max(0, (scores["Positive routine fit"] || 0) - 3);
  }

  if (sentiment === "Positive") {
    scores["Positive routine fit"] = (scores["Positive routine fit"] || 0) + 2;
  }

  const ranked = Object.entries(scores)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]);

  const primaryIssue = ranked[0]?.[0] || "Other";
  const secondaryIssue = ranked.find(([issue]) => issue !== primaryIssue)?.[0] || "Other";

  return {
    primaryIssue,
    secondaryIssue,
    issueScores: Object.fromEntries(ranked)
  };
}

export function detectRootCause(review, issueResult = classifyIssue(review)) {
  const text = combinedText(review);
  const primary = issueResult.primaryIssue;
  const secondary = issueResult.secondaryIssue;
  const product = normalizeText(productName(review));
  let rootCause = "Needs human review";

  if (/how much|used too much|too much|quantity|apply|applied|instructions|correct way|routine order|before or after|sprayed too close|blend|diagram|placement|layer/.test(text)) {
    rootCause = "Usage confusion / over-application or routine order";
  } else if (/fine|2a|2b|straight hair|wavy or curly|not for my hair|not enough for dense curls|not for my routine|only for frizz|colored hair/.test(text)) {
    rootCause = "Routine mismatch / product fit uncertainty";
  } else if (/humid|humidity|mumbai|chennai|goa|kolkata|sweat|monsoon/.test(text) && /frizz|hold|puffy|opened/.test(text)) {
    rootCause = "Climate expectation mismatch";
  } else if (/leak|broken|nozzle|cap|box|packaging/.test(text)) {
    rootCause = "Packaging or component failure";
  } else if (/delivery|late|returning|marketplace/.test(text)) {
    rootCause = "Marketplace logistics issue";
  } else if (/scent|fragrance|smell|headache|too strong/.test(text)) {
    rootCause = "Fragrance preference mismatch";
  } else if (/scalp|itchy|flaky|dandruff|sensitive/.test(text)) {
    rootCause = "Scalp compatibility question";
  } else if (["Positive repeat purchase", "Positive routine fit"].includes(primary)) {
    rootCause = "Strong fit signal";
  } else if (primary !== "Other") {
    rootCause = `${primary} pattern needs review`;
  }

  if (primary === "Sticky or greasy feel" && /wax|serum|leave in|cream|gel/.test(product) && !/used too much|how much|quantity/.test(text)) {
    rootCause = "Likely over-application or placement issue";
  }

  if (primary === "Weak hold" && /gel|styling/.test(product) && /humid|humidity|sweat|mumbai/.test(text)) {
    rootCause = "Hold expectation under humid conditions";
  }

  const issueOwner = ownerMap[rootCause.includes("Usage") ? "Usage confusion" : primary] || ownerMap[secondary] || "Needs review";

  return {
    rootCauseHypothesis: rootCause,
    issueOwner
  };
}

export function calculateSeverity(review, issueResult = classifyIssue(review), sentimentResult = classifySentiment(review), rootCauseResult = detectRootCause(review, issueResult)) {
  const rating = numericRating(review);
  const text = combinedText(review);
  const source = sourceName(review);
  const marketplace = MARKETPLACE_SOURCES.some((name) => source.includes(name));
  let points = 0;

  if (rating === 1) points += 4;
  else if (rating === 2) points += 3;
  else if (rating === 3) points += 1;

  if (sentimentResult.sentiment === "Negative") points += 2;
  if (marketplace && rating <= 3) points += 2;
  if (/itchy|hair fall|hairfall|headache|returning|waste of money|broken|leaked|nozzle stopped/.test(text)) points += 2;
  if (["Packaging issue", "Delivery issue"].includes(issueResult.primaryIssue) && marketplace) points += 1;
  if (rootCauseResult.rootCauseHypothesis.includes("Strong fit")) points -= 3;

  if (points >= 7) return "Critical";
  if (points >= 5) return "High";
  if (points >= 2) return "Medium";
  return "Low";
}

export function calculateConfidence(review, issueResult = classifyIssue(review)) {
  const text = combinedText(review);
  const scores = Object.values(issueResult.issueScores || {});
  const top = scores[0] || 0;
  const second = scores[1] || 0;
  const signalStrength = Math.min(45, top * 4);
  const separation = Math.min(25, Math.max(0, top - second) * 4);
  const lengthSignal = text.length > 120 ? 15 : text.length > 55 ? 10 : 5;
  const metadataSignal = numericRating(review) ? 10 : 0;
  const productSignal = productName(review) !== "Unassigned product" ? 5 : 0;
  return Math.max(35, Math.min(96, 25 + signalStrength + separation + lengthSignal + metadataSignal + productSignal));
}

function funnelImpact(review, severity, sentiment, issue, rootCause) {
  const source = sourceName(review);
  const marketplace = MARKETPLACE_SOURCES.some((name) => source.includes(name));

  if (["Positive repeat purchase", "Positive routine fit"].includes(issue)) {
    return "Retention and advocacy signal";
  }
  if (marketplace && ["Critical", "High"].includes(severity)) {
    return "Marketplace conversion risk";
  }
  if (rootCause.includes("Usage confusion")) {
    return "Review risk + support load";
  }
  if (["Packaging issue", "Delivery issue"].includes(issue)) {
    return "Fulfilment trust risk";
  }
  if (sentiment === "Negative") {
    return "Review risk + repeat purchase risk";
  }
  return "Education opportunity";
}

export function generateRecommendedAction(review, issueResult = classifyIssue(review), rootCauseResult = detectRootCause(review, issueResult)) {
  const issue = issueResult.primaryIssue;
  const product = productName(review);
  const rootCause = rootCauseResult.rootCauseHypothesis;

  if (["Positive repeat purchase", "Positive routine fit"].includes(issue)) {
    return `Use this ${product} review as a proof point for routine-fit messaging and collect permission for UGC.`;
  }
  if (rootCause.includes("Usage confusion") || issue === "Usage confusion") {
    return `Prioritize usage education for ${product} before treating this as a formula rejection. Add quantity, placement, and routine-order guidance.`;
  }
  if (issue === "Routine mismatch" || issue === "Product feels heavy" || issue === "Weighed-down curls") {
    return `Tighten product-fit guidance for ${product}. Clarify who should choose a lighter routine and who needs richer styling support.`;
  }
  if (issue === "Sticky or greasy feel") {
    return `Audit product-page usage visuals for ${product}. Show smallest recommended amount and where not to apply for oily roots or fine hair.`;
  }
  if (issue === "Frizz not controlled" || issue === "Weak hold") {
    return `Add climate-specific expectations for ${product}, especially humid-city routines and layering suggestions.`;
  }
  if (issue === "White cast or residue") {
    return `Add blending instructions and dark-hair demos for ${product}. Review nozzle dispersion if this repeats.`;
  }
  if (issue === "Packaging issue") {
    return `Escalate ${product} packaging complaint to operations and check batch or component issue frequency.`;
  }
  if (issue === "Delivery issue") {
    return `Flag marketplace fulfilment for ${product} and prepare a replacement/refund support response.`;
  }
  if (issue === "Scalp concern") {
    return `Route to support with scalp-sensitivity guidance and update FAQ around scalp type fit.`;
  }
  if (issue === "Scent concern") {
    return `Track fragrance sensitivity mentions and add scent expectation notes on product pages.`;
  }
  if (issue === "Price/quantity concern") {
    return `Review value framing for ${product}, including usage-per-wash or usage-per-styling math.`;
  }
  return `Tag for weekly review and look for repeated language before changing product, page, or support scripts.`;
}

export function generateProductPageFix(review, issueResult = classifyIssue(review), rootCauseResult = detectRootCause(review, issueResult)) {
  const issue = issueResult.primaryIssue;
  const product = productName(review);

  if (issue === "Sticky or greasy feel") {
    return `Add a "how much is enough" visual for ${product}: pea-size/pump/swipe guidance by hair length and density.`;
  }
  if (issue === "Usage confusion") {
    return `Add a routine-order strip for ${product}: when to apply, wet vs dry hair, and what to pair it with.`;
  }
  if (issue === "Routine mismatch" || issue === "Product feels heavy") {
    return `Add "best for / skip if" fit notes for ${product}, especially fine hair, oily scalp, and wave vs curl use cases.`;
  }
  if (issue === "Weak hold" || issue === "Frizz not controlled") {
    return `Add a humid-weather routine note for ${product}: layering, refresh method, and realistic hold expectations.`;
  }
  if (issue === "White cast or residue") {
    return `Add dark-hair blending steps for ${product}: spray distance, wait time, brush technique, and before/after visual.`;
  }
  if (issue === "Scalp concern") {
    return `Add scalp compatibility FAQ for ${product}: oily, flaky, sensitive, colored, and daily-use guidance.`;
  }
  if (issue === "Scent concern") {
    return `Add scent profile and intensity expectation for ${product}.`;
  }
  if (issue === "Price/quantity concern") {
    return `Add cost-per-use framing and recommended quantity for ${product}.`;
  }
  if (issue === "Packaging issue" || issue === "Delivery issue") {
    return `Add marketplace handling note only if issue repeats; otherwise route operationally.`;
  }
  if (["Positive repeat purchase", "Positive routine fit"].includes(issue)) {
    return `Feature this fit signal near ${product} routine education, with hair type and climate context.`;
  }
  return `Add a compact FAQ block for the repeated question pattern once it appears in three or more reviews.`;
}

export function generateSupportReply(review, issueResult = classifyIssue(review)) {
  const issue = issueResult.primaryIssue;
  const product = productName(review);

  if (issue === "Sticky or greasy feel") {
    return `Thanks for sharing this. With ${product}, a little goes a long way. Try applying only to mid-lengths or flyaways, avoid the scalp/root area, and start with the smallest amount before adding more.`;
  }
  if (issue === "Usage confusion") {
    return `Happy to help. For ${product}, start with the lowest quantity, apply as directed for your hair density, and layer from lightest to richest product. We can also suggest a routine if you share your hair type and styling goal.`;
  }
  if (issue === "Routine mismatch" || issue === "Product feels heavy" || issue === "Weighed-down curls") {
    return `This may be a routine-fit issue rather than the product being wrong for everyone. If your hair is fine or low-density, use a smaller amount or choose a lighter styling step.`;
  }
  if (issue === "Weak hold") {
    return `Humidity can reduce hold. Try applying ${product} on wetter hair, avoid touching while drying, and layer with a light leave-in only if needed.`;
  }
  if (issue === "White cast or residue") {
    return `For dark hair, spray from a little distance, wait one to two minutes, then brush or blend thoroughly. Applying too close can leave visible residue.`;
  }
  if (issue === "Scalp concern") {
    return `Sorry you experienced this. Please pause use if irritation continues. For scalp-prone routines, avoid heavy product near roots and share your scalp type so support can guide you better.`;
  }
  if (issue === "Packaging issue" || issue === "Delivery issue") {
    return `We are sorry the order arrived this way. Please share your order ID and a photo so the team can check the shipment and help with a replacement or resolution.`;
  }
  if (issue === "Scent concern") {
    return `Thank you for the feedback. Fragrance preference is personal; we will pass this to the product team and help you choose a lighter routine if scent sensitivity is a concern.`;
  }
  if (["Positive repeat purchase", "Positive routine fit"].includes(issue)) {
    return `Thank you for sharing your routine. We are so glad it fits your hair type and climate.`;
  }
  return `Thank you for the feedback. We will review this with the product and education teams and help you troubleshoot your routine.`;
}

export function generateContentIdea(review, issueResult = classifyIssue(review), rootCauseResult = detectRootCause(review, issueResult)) {
  const issue = issueResult.primaryIssue;
  const product = productName(review);
  const text = combinedText(review);
  const humid = /mumbai|chennai|goa|kolkata|humid|humidity|sweat|monsoon/.test(text);

  if (issue === "Sticky or greasy feel") {
    return `Reel: "One swipe vs three swipes" showing ${product} quantity on fine, medium, and thick hair.`;
  }
  if (issue === "Usage confusion") {
    return `Carousel: "${product} routine order" with damp/dry hair, quantity, placement, and what to avoid.`;
  }
  if (issue === "Routine mismatch" || issue === "Product feels heavy") {
    return `Quiz post: "Are you choosing for waves, curls, frizz, or scalp?" using hair density and climate cues.`;
  }
  if (issue === "Weak hold" || (issue === "Frizz not controlled" && humid)) {
    return `Reel: "Humid-city styling routine" showing refresh, layering, and realistic hold checkpoints.`;
  }
  if (issue === "White cast or residue") {
    return `Reel: "Dry shampoo on dark Indian hair" with spray distance, wait time, and blending brush demo.`;
  }
  if (issue === "Scalp concern") {
    return `FAQ post: "What goes on scalp vs lengths?" for oily, flaky, and sensitive scalp routines.`;
  }
  if (issue === "Scent concern") {
    return `Story poll: scent preference and sensitivity, followed by a product scent explainer.`;
  }
  if (issue === "Price/quantity concern") {
    return `Carousel: "How many uses per bottle?" with routine amount and cost-per-use examples.`;
  }
  if (issue === "Packaging issue" || issue === "Delivery issue") {
    return `Internal ops note rather than public content unless the brand wants a packaging-care update.`;
  }
  if (["Positive repeat purchase", "Positive routine fit"].includes(issue)) {
    return `UGC prompt: ask customer to share hair type, city climate, and exact routine steps.`;
  }
  return `Weekly education post based on the most repeated customer question.`;
}

export function generateUsageEducationIdea(review, issueResult = classifyIssue(review)) {
  const issue = issueResult.primaryIssue;
  const product = productName(review);

  if (issue === "Sticky or greasy feel") return `Create ${product} quantity guide by hair length: pea-size, one pump, or one light swipe.`;
  if (issue === "Usage confusion") return `Create a "where it sits in your routine" visual for ${product}.`;
  if (issue === "Routine mismatch") return `Create product-fit decision tree: waves vs curls vs frizz-only vs oily scalp.`;
  if (issue === "Product feels heavy" || issue === "Weighed-down curls") return `Explain how fine hair should use half the amount and avoid roots.`;
  if (issue === "Weak hold") return `Show humid-weather layering and drying rules for hold.`;
  if (issue === "Frizz not controlled") return `Show frizz routine by climate: humid, dry, and mixed weather.`;
  if (issue === "White cast or residue") return `Show dry shampoo spray distance, wait time, and blending on dark hair.`;
  if (issue === "Scalp concern") return `Explain scalp vs length application and when to pause use.`;
  return `Add a short education card answering the reviewer's main question.`;
}

export function analyzeReview(review) {
  const sentimentResult = classifySentiment(review);
  const issueResult = classifyIssue(review);
  const rootCauseResult = detectRootCause(review, issueResult);
  const severity = calculateSeverity(review, issueResult, sentimentResult, rootCauseResult);
  const confidenceScore = calculateConfidence(review, issueResult);
  const primaryIssue = issueResult.primaryIssue;

  return {
    ...review,
    id:
      review.id ||
      `${normalizeText(productName(review)).replace(/\s+/g, "-")}-${normalizeText(review.Date || "").replace(/\s+/g, "-")}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
    Rating: numericRating(review),
    Product: productName(review),
    Review_Text: review.Review_Text || review.review_text || review.text || "",
    Sentiment: sentimentResult.sentiment,
    Sentiment_Score: sentimentResult.sentimentScore,
    Primary_Issue: primaryIssue,
    Secondary_Issue: issueResult.secondaryIssue,
    Root_Cause_Hypothesis: rootCauseResult.rootCauseHypothesis,
    Issue_Owner: rootCauseResult.issueOwner,
    Severity: severity,
    Confidence_Score: confidenceScore,
    Funnel_Impact: funnelImpact(review, severity, sentimentResult.sentiment, primaryIssue, rootCauseResult.rootCauseHypothesis),
    Recommended_Brand_Action: generateRecommendedAction(review, issueResult, rootCauseResult),
    Product_Page_Fix: generateProductPageFix(review, issueResult, rootCauseResult),
    Usage_Education_Idea: generateUsageEducationIdea(review, issueResult),
    Customer_Support_Reply: generateSupportReply(review, issueResult),
    Content_Idea: generateContentIdea(review, issueResult, rootCauseResult),
    Status: review.Status || "New"
  };
}

export function analyzeReviews(reviews) {
  return reviews.map((review) => analyzeReview(review));
}
