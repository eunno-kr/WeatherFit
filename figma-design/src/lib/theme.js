export function themeFor(feels, isWet) {
  if (isWet) return { accent: "#4A5468", soft: "#E7E9EE", name: "RAIN" };
  if (feels >= 23) return { accent: "#D9532B", soft: "#F6E5DC", name: "HOT" };
  if (feels >= 17) return { accent: "#7C8B5A", soft: "#ECEEE0", name: "MILD" };
  if (feels >= 9) return { accent: "#5B7A99", soft: "#E2E9EF", name: "COOL" };
  return { accent: "#3E5C73", soft: "#DFE7EC", name: "COLD" };
}
