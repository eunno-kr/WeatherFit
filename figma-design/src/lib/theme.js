const BRAND = "#E8543B";

export function themeFor(feels, isWet) {
  if (isWet) return { accent: BRAND, soft: "#E7E9EE", name: "RAIN" };
  if (feels >= 23) return { accent: BRAND, soft: "#F6E5DC", name: "HOT" };
  if (feels >= 17) return { accent: BRAND, soft: "#ECEEE0", name: "MILD" };
  if (feels >= 9) return { accent: BRAND, soft: "#E2E9EF", name: "COOL" };
  return { accent: BRAND, soft: "#DFE7EC", name: "COLD" };
}
