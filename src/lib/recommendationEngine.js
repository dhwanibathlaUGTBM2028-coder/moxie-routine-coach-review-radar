const defaultAmounts = {
  "Hydrating Shampoo": "Rs. 1 coin amount at the scalp; rinse well before conditioner.",
  "Lightweight Conditioner": "Rs. 2 coin amount on mid-lengths and ends; avoid oily roots.",
  "Curl Defining Cream": "Pea to almond-size on soaking wet hair; use less for fine waves.",
  "Leave-In Conditioner": "Pea-size for fine hair, almond-size for thick curls, only on lengths.",
  "Anti-Frizz Serum": "One pea-size drop or half pump on damp mid-lengths and ends.",
  "Wax Stick / Flyaway Fix": "One light swipe on flyaways, then blend with fingertips or brush.",
  "Heat Protectant": "4 to 6 light sprays from mid-length to ends before heat styling.",
  "Dry Shampoo": "Short sprays at roots from 15 cm away; wait, then brush.",
  "Styling Gel": "Coin-size glaze on wet curls; scrunch and avoid touching while drying."
};

function title(value) {
  return String(value || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function includesAny(value, terms) {
  const normalized = String(value || "").toLowerCase();
  return terms.some((term) => normalized.includes(term));
}

function product(config, preferred) {
  return config.productNames.find((name) => name.toLowerCase() === preferred.toLowerCase()) || preferred;
}

function budgetNote(level) {
  if (level === "high") return "Keep the bundle lean: prioritize cleanser/conditioner plus one targeted styling step.";
  if (level === "medium") return "Start with the core routine, then add one styling product once usage is clear.";
  return "Full routine is acceptable if each product has a clear role and quantity guidance.";
}

function densityAmount(productName, density) {
  const amount = defaultAmounts[productName] || "Start with a small amount and build only if needed.";
  if (density === "fine") return amount.replace("almond-size", "pea-size").replace("coin-size", "pea-size");
  if (density === "thick") return `${amount} Thick hair can add a second small layer only on lengths.`;
  return amount;
}

export function generateRoutine(answers, config) {
  const hairType = answers.hairType || "wavy";
  const density = answers.density || "medium";
  const scalp = answers.scalp || "normal";
  const concern = answers.concern || "frizz";
  const climate = answers.climate || "humid";
  const habit = answers.habit || "air dry";
  const preference = answers.preference || "3-step";
  const sensitivity = answers.sensitivity || "hates sticky feel";
  const budget = answers.budget || "medium";

  const products = {
    shampoo: product(config, "Hydrating Shampoo"),
    conditioner: product(config, "Lightweight Conditioner"),
    curlCream: product(config, "Curl Defining Cream"),
    leaveIn: product(config, "Leave-In Conditioner"),
    serum: product(config, "Anti-Frizz Serum"),
    wax: product(config, "Wax Stick / Flyaway Fix"),
    heat: product(config, "Heat Protectant"),
    dry: product(config, "Dry Shampoo"),
    gel: product(config, "Styling Gel")
  };

  const routine = [];
  const avoid = [];
  const reasons = [];
  const educationBullets = [];

  const isFine = density === "fine";
  const isCurly = includesAny(hairType, ["curly", "coily"]);
  const isWavy = includesAny(hairType, ["wavy", "frizzy", "unsure"]);
  const isStraight = hairType === "straight";
  const wantsLight = includesAny(sensitivity, ["sticky", "heavy", "lightweight"]);
  const wantsHold = includesAny(sensitivity, ["strong hold"]) || concern === "hold";
  const humid = climate === "humid" || climate === "mixed";
  const heatStyling = habit === "heat styling" || concern === "heat damage";
  const oilyScalp = scalp === "oily";
  const flakyScalp = scalp === "flaky";

  if (oilyScalp) {
    routine.push({
      role: "Cleanse roots without overloading lengths",
      product: products.shampoo,
      amount: densityAmount(products.shampoo, density),
      note: "Focus shampoo on scalp. Let the rinse clean the lengths."
    });
    educationBullets.push("Keep conditioners, creams, and serums away from oily roots.");
  } else {
    routine.push({
      role: flakyScalp ? "Gentle cleanse while avoiding scalp buildup" : "Cleanse and reset",
      product: products.shampoo,
      amount: densityAmount(products.shampoo, density),
      note: flakyScalp ? "Patch test and avoid layering styling products near the scalp." : "Start with a clean base so styling products do not fight residue."
    });
  }

  routine.push({
    role: "Condition the lengths",
    product: products.conditioner,
    amount: densityAmount(products.conditioner, density),
    note: isFine ? "Use only on the last two-thirds of hair so waves stay airy." : "Detangle with fingers, then rinse thoroughly."
  });

  if (preference !== "2-step") {
    if (isCurly && !wantsLight) {
      routine.push({
        role: "Define curl clumps",
        product: products.curlCream,
        amount: densityAmount(products.curlCream, density),
        note: "Apply on soaking wet hair, then scrunch upward."
      });
      reasons.push("Curly/coily hair usually needs a richer definition step before hold.");
    } else if ((isWavy || wantsLight || isFine) && concern !== "hold") {
      routine.push({
        role: humid ? "Seal frizz in humid weather" : "Add light smoothness",
        product: products.serum,
        amount: densityAmount(products.serum, density),
        note: "Apply only from mid-lengths to ends. Avoid the scalp and crown."
      });
      reasons.push("A lighter serum is safer for fine or wavy hair than heavy creams.");
    } else {
      routine.push({
        role: "Add soft moisture",
        product: products.leaveIn,
        amount: densityAmount(products.leaveIn, density),
        note: "Use on damp lengths, then comb or rake through."
      });
    }
  }

  if (preference === "full routine" || wantsHold || concern === "definition" || concern === "hold") {
    if (isCurly || wantsHold) {
      routine.push({
        role: humid ? "Lock shape for humidity" : "Hold definition",
        product: products.gel,
        amount: densityAmount(products.gel, density),
        note: "Glaze over wet hair after cream/leave-in, scrunch, then let dry undisturbed."
      });
    }
  }

  if (heatStyling) {
    routine.push({
      role: "Protect before heat",
      product: products.heat,
      amount: densityAmount(products.heat, density),
      note: "Use before blow-dry, straightener, or curling iron. Serum goes after styling if needed."
    });
  }

  if (concern === "flyaways" || habit === "tied-up hair" || habit === "special occasions") {
    routine.push({
      role: "Finish flyaways",
      product: products.wax,
      amount: densityAmount(products.wax, density),
      note: "One light swipe is enough for the hairline. Blend immediately."
    });
  }

  if (concern === "greasy roots" || oilyScalp) {
    routine.push({
      role: "Refresh roots between washes",
      product: products.dry,
      amount: densityAmount(products.dry, density),
      note: "Best on dry roots before oil is heavy; wait before brushing."
    });
  }

  if (isFine || wantsLight) {
    avoid.push("Avoid layering curl cream, leave-in, serum, and gel in one routine unless each amount is tiny.");
    avoid.push("Avoid applying conditioners, creams, wax, or serum near the scalp.");
  }

  if (humid) {
    educationBullets.push("Humidity can make product feel heavier by evening; start lighter and refresh only where needed.");
    reasons.push("The routine keeps styling weight low while still sealing frizz for Indian humid weather.");
  }

  if (concern === "dryness") {
    reasons.push("Dry lengths need conditioner or leave-in before any sealant; serum alone will not add enough moisture.");
  } else if (concern === "definition") {
    reasons.push("Definition depends on wet-hair application and drying discipline, not only product strength.");
  } else if (concern === "flyaways") {
    reasons.push("Flyaways need a tiny targeted finishing step, not all-over product.");
  } else if (concern === "volume") {
    reasons.push("Volume improves when rich stylers stay off the roots and the routine remains lightweight.");
  }

  if (flakyScalp) {
    avoid.push("Avoid treating every scalp concern as dryness; scalp products and length products should stay separate.");
  }

  if (!avoid.length) {
    avoid.push("Avoid adding more product before checking whether hair is wet enough and evenly sectioned.");
  }

  const uniqueRoutine = routine.filter(
    (step, index, list) => list.findIndex((candidate) => candidate.product === step.product && candidate.role === step.role) === index
  );

  const maxSteps = preference === "2-step" ? 2 : preference === "3-step" ? 3 : 5;
  const finalRoutine = uniqueRoutine.slice(0, maxSteps);
  const order = finalRoutine.map((step, index) => `${index + 1}. ${step.product} - ${step.role}`);
  const bundleName =
    preference === "2-step"
      ? "Light Reset Pair"
      : isCurly
        ? "Definition + Hold Routine"
        : humid
          ? "Humid-Weather Frizz Control Kit"
          : "Soft Finish Everyday Routine";

  return {
    profileSummary: `${title(hairType)} hair, ${title(density)} density, ${title(scalp)} scalp, ${title(climate)} climate`,
    recommendedRoutine: finalRoutine,
    productCategories: finalRoutine.map((step) => step.product),
    applicationOrder: order,
    commonMistake: avoid[0],
    whyThisFits: [
      ...new Set([
        ...reasons,
        `${budgetNote(budget)}`,
        `Sensitivity note: ${title(sensitivity)} means the routine should start with smaller amounts and add only after hair dries.`
      ])
    ].slice(0, 4),
    educationCard: {
      title: humid ? "Humidity changes how product feels" : "Quantity matters more than more products",
      body: humid
        ? "In humid Indian cities, the same amount can feel heavier by evening. Start with less, apply on damp hair, and keep product off roots unless it is made for scalp or refresh."
        : "Most avoidable dissatisfaction comes from too much product or the wrong placement. A smaller amount on damp lengths usually gives a cleaner finish.",
      bullets: educationBullets.length
        ? educationBullets
        : ["Start with less product than you think.", "Apply on damp lengths unless the product is specifically a finishing step."]
    },
    suggestedBundle: {
      name: bundleName,
      items: finalRoutine.map((step) => step.product),
      note: `${bundleName} is a placeholder bundle name. Replace with official Moxie SKU mapping in config.`
    },
    postPurchaseTip:
      finalRoutine.length > 2
        ? `On first use, try only steps 1-${Math.min(3, finalRoutine.length)} before adding optional finishers. This makes it easier to spot over-application.`
        : "Use the routine twice before adding a styling product so the customer can feel the baseline result.",
    productPageEducation:
      isFine || wantsLight
        ? "Add a product-page visual: fine hair should start with half the standard quantity."
        : humid
          ? "Add a humid-weather note: apply on damp hair and use smaller layers."
          : "Add a routine-order panel with wet/dry application cues."
  };
}

export const defaultQuizAnswers = {
  hairType: "wavy",
  density: "fine",
  scalp: "oily",
  concern: "frizz",
  climate: "humid",
  habit: "air dry",
  preference: "3-step",
  sensitivity: "hates sticky feel",
  budget: "medium"
};
