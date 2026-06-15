export const DEFAULT_WARDROBE = [
  {
    id: "linen-shirt",
    name: "화이트 린넨 셔츠",
    category: "outer",
    color: "화이트",
    colorHex: "#FFFFFF",
    warmth: "light",
    style: "minimal",
    rainOk: false,
  },
  {
    id: "black-tee",
    name: "블랙 반팔 티셔츠",
    category: "top",
    color: "블랙",
    colorHex: "#111111",
    warmth: "summer",
    style: "minimal",
    rainOk: true,
  },
  {
    id: "denim-pants",
    name: "연청 데님 팬츠",
    category: "bottom",
    color: "데님",
    colorHex: "#547EA8",
    warmth: "light",
    style: "casual",
    rainOk: false,
  },
  {
    id: "wide-slacks",
    name: "차콜 와이드 슬랙스",
    category: "bottom",
    color: "차콜",
    colorHex: "#3A3A3A",
    warmth: "light",
    style: "minimal",
    rainOk: true,
  },
  {
    id: "white-sneakers",
    name: "화이트 스니커즈",
    category: "shoes",
    color: "화이트",
    colorHex: "#FFFFFF",
    warmth: "all",
    style: "casual",
    rainOk: false,
  },
  {
    id: "black-loafer",
    name: "블랙 로퍼",
    category: "shoes",
    color: "블랙",
    colorHex: "#111111",
    warmth: "all",
    style: "formal",
    rainOk: true,
  },
  {
    id: "nylon-bag",
    name: "블랙 나일론 크로스백",
    category: "accessory",
    color: "블랙",
    colorHex: "#111111",
    warmth: "all",
    style: "street",
    rainOk: true,
  },
];

const CATEGORY_LABELS = {
  outer: "아우터",
  top: "상의",
  bottom: "하의",
  shoes: "신발",
  accessory: "액세서리",
};

function warmthMatches(item, feels) {
  if (item.warmth === "all") return true;
  if (feels >= 24) return item.warmth === "summer" || item.warmth === "light";
  if (feels >= 12) return item.warmth === "light" || item.warmth === "middle";
  return item.warmth === "middle" || item.warmth === "warm";
}

const COLOR_GROUPS = [
  ["블랙", "차콜", "그레이", "화이트", "아이보리", "크림"],
  ["네이비", "데님", "연청", "라이트블루", "스카이블루", "인디고"],
  ["베이지", "브라운", "카키", "세이지", "스톤"],
];

function sameColorFamily(a = "", b = "") {
  if (!a || !b) return false;
  return COLOR_GROUPS.some((group) => group.some((color) => a.includes(color)) && group.some((color) => b.includes(color)));
}

function scoreItem(item, { feels, isWet, mood, colorTone, anchor }) {
  let score = 0;
  if (warmthMatches(item, feels)) score += 4;
  if (item.style === mood) score += 3;
  if (anchor?.style && item.style === anchor.style) score += 2;
  if (anchor?.color && item.color === anchor.color) score += 2;
  if (anchor?.color && sameColorFamily(item.color, anchor.color)) score += 1;
  if (item.style === "minimal" && colorTone === "neutral") score += 1;
  if (item.rainOk && isWet) score += 2;
  if (!item.rainOk && isWet) score -= 4;
  return score;
}

export function recommendWardrobe({ wardrobe, weather, isWet, mood, profile, locks = {} }) {
  const categories = ["outer", "top", "bottom", "shoes", "accessory"];
  const picked = {};
  const reasons = [];
  const lockedItems = Object.values(locks)
    .filter(Boolean)
    .map((id) => wardrobe.find((item) => item.id === id))
    .filter(Boolean);
  const anchor = lockedItems[0];
  const effectiveMood = anchor?.style || mood;

  categories.forEach((category) => {
    if (locks[category]) {
      const lockedItem = wardrobe.find((item) => item.id === locks[category]);
      if (lockedItem) {
        picked[category] = lockedItem;
        return;
      }
    }

    const candidates = wardrobe
      .filter((item) => item.category === category)
      .map((item) => ({
        item,
        score: scoreItem(item, {
          feels: weather.feels,
          isWet,
          mood: effectiveMood,
          colorTone: profile.colorTone,
          anchor,
        }),
      }))
      .sort((a, b) => b.score - a.score);

    if (candidates[0] && candidates[0].score > 0) {
      picked[category] = candidates[0].item;
    }
  });

  const lockedCount = Object.values(locks).filter(Boolean).length;
  if (lockedCount > 0) reasons.push(`직접 고른 옷 ${lockedCount}개를 우선 고정했습니다.`);
  if (anchor) reasons.push(`${anchor.name}의 ${anchor.style} 무드와 ${anchor.color} 색을 기준으로 나머지를 맞췄습니다.`);
  if (picked.top) reasons.push(`${CATEGORY_LABELS.top}는 날씨 두께와 스타일 태그가 가장 잘 맞습니다.`);
  if (picked.shoes && isWet) reasons.push("비 오는 날 기준으로 젖기 쉬운 신발은 제외했습니다.");
  if (picked.bottom) reasons.push("하의는 상의 색을 받쳐주는 중립색을 우선했습니다.");

  const outfit = {
    title: lockedCount > 0 ? "고정 아이템 기반 코디" : "내 옷장 자동 코디",
    outer: picked.outer,
    top: picked.top,
    bottom: picked.bottom,
    shoes: picked.shoes,
    accessory: picked.accessory,
  };

  return { picked, reasons, outfit, lockedCount };
}

export const CATEGORY_LABELS_KO = CATEGORY_LABELS;
