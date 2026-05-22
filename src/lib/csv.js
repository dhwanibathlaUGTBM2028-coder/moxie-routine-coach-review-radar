export function parseCsv(text) {
  const rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(current);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      current = "";
    } else {
      current += char;
    }
  }

  row.push(current);
  if (row.some((cell) => cell.trim() !== "")) rows.push(row);
  if (rows.length < 2) return [];

  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((cells, index) => {
    const record = {};
    headers.forEach((header, cellIndex) => {
      record[header] = cells[cellIndex]?.trim() || "";
    });
    if (!record.Date) record.Date = new Date().toISOString().slice(0, 10);
    if (!record.Source) record.Source = "CSV upload";
    if (!record.Product) record.Product = "Unassigned product";
    if (!record.Rating) record.Rating = 0;
    if (!record.Status) record.Status = "New";
    record.id = `csv-${Date.now()}-${index}`;
    return record;
  });
}

function escapeCsv(value) {
  const stringValue = value == null ? "" : String(value);
  if (/[",\n\r]/.test(stringValue)) return `"${stringValue.replace(/"/g, '""')}"`;
  return stringValue;
}

export function toCsv(rows, preferredHeaders = []) {
  if (!rows.length) return "";
  const headers = preferredHeaders.length ? preferredHeaders : Object.keys(rows[0]);
  return [headers.join(","), ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(","))].join("\n");
}

export function pastedTextToReviews(text) {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => ({
      id: `paste-${Date.now()}-${index}`,
      Date: new Date().toISOString().slice(0, 10),
      Source: "Manual paste",
      Product: inferProduct(line),
      Rating: inferRating(line),
      Review_Text: line,
      Customer_Hair_Type: inferHairType(line),
      Purchase_Channel: "Manual paste",
      Verified_Buyer: "Unknown",
      Location: inferLocation(line),
      Status: "New"
    }));
}

function inferRating(text) {
  const normalized = text.toLowerCase();
  if (/love|perfect|repurchase|finally|excellent|great|works well/.test(normalized)) return 5;
  if (/good|nice|okay|ok|works/.test(normalized)) return 4;
  if (/not sure|confused|maybe|but/.test(normalized)) return 3;
  if (/bad|sticky|greasy|heavy|white cast|weak|dry|leaked|broken|itchy/.test(normalized)) return 2;
  if (/waste|returning|never|terrible|damaged/.test(normalized)) return 1;
  return 0;
}

function inferProduct(text) {
  const normalized = text.toLowerCase();
  const productMatchers = [
    ["curl", "Curl Defining Cream"],
    ["leave-in", "Leave-In Conditioner"],
    ["leave in", "Leave-In Conditioner"],
    ["wax", "Wax Stick / Flyaway Fix"],
    ["flyaway", "Wax Stick / Flyaway Fix"],
    ["dry shampoo", "Dry Shampoo"],
    ["shampoo", "Hydrating Shampoo"],
    ["conditioner", "Lightweight Conditioner"],
    ["serum", "Anti-Frizz Serum"],
    ["heat", "Heat Protectant"],
    ["gel", "Styling Gel"]
  ];
  return productMatchers.find(([term]) => normalized.includes(term))?.[1] || "Unassigned product";
}

function inferHairType(text) {
  const normalized = text.toLowerCase();
  if (/curly|3a|3b|3c/.test(normalized)) return "Curly";
  if (/wavy|2a|2b|2c/.test(normalized)) return "Wavy";
  if (/straight|1a|1b|1c/.test(normalized)) return "Straight";
  if (/coily|4a|4b|4c/.test(normalized)) return "Coily";
  if (/fine/.test(normalized)) return "Fine";
  if (/thick|dense/.test(normalized)) return "Thick";
  return "Unknown";
}

function inferLocation(text) {
  const normalized = text.toLowerCase();
  const cities = ["mumbai", "delhi", "bengaluru", "bangalore", "pune", "chennai", "hyderabad", "kolkata", "goa", "gurgaon"];
  const city = cities.find((name) => normalized.includes(name));
  return city ? city.replace(/\b\w/g, (letter) => letter.toUpperCase()) : "";
}
