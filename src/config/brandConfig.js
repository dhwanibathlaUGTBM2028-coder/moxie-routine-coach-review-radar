export const defaultBrandConfig = {
  logoPath: "",
  logoText: "MOXIE BEAUTY",
  primaryColor: "#17151F",
  secondaryColor: "#F5A8C8",
  accentColor: "#F4E85D",
  softColor: "#CBEF72",
  inkColor: "#17151F",
  fontFamily: "'Arial Black', 'Inter', ui-sans-serif, system-ui, sans-serif",
  bodyFontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  brandNote:
    "This is a brand-inspired local demo. Replace logo, exact brand colors, and licensed fonts before sharing as an official Moxie asset.",
  productNames: [
    "Hydrating Shampoo",
    "Lightweight Conditioner",
    "Curl Defining Cream",
    "Leave-In Conditioner",
    "Anti-Frizz Serum",
    "Wax Stick / Flyaway Fix",
    "Heat Protectant",
    "Dry Shampoo",
    "Styling Gel"
  ],
  categories: [
    "Cleanse",
    "Condition",
    "Define",
    "De-frizz",
    "Sleek styling",
    "Heat protection",
    "Refresh"
  ],
  sources: [
    "Website reviews",
    "Amazon",
    "Nykaa",
    "Flipkart",
    "Instagram comments",
    "Support chat",
    "WhatsApp",
    "Reddit/Quora"
  ]
};

export function loadBrandConfig() {
  try {
    const saved = localStorage.getItem("moxie-brand-config");
    if (!saved) return { ...defaultBrandConfig };
    return { ...defaultBrandConfig, ...JSON.parse(saved) };
  } catch {
    return { ...defaultBrandConfig };
  }
}

export function saveBrandConfig(config) {
  localStorage.setItem("moxie-brand-config", JSON.stringify(config));
}

export function resetBrandConfig() {
  localStorage.removeItem("moxie-brand-config");
  return { ...defaultBrandConfig };
}
