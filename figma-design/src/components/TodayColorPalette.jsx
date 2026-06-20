import { useMemo } from "react";

const getSeason = () => {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "fall";
  return "winter";
};

const PALETTES = {
  spring: {
    name: "봄 파스텔",
    desc: "따뜻해지는 봄날을 닮은 부드러운 컬러",
    colors: [
      { hex: "#F2C6D0", name: "블러시핑크" },
      { hex: "#C8E6C9", name: "세이지그린" },
      { hex: "#FFF3C4", name: "버터옐로우" },
      { hex: "#B3D9F5", name: "스카이블루" },
      { hex: "#E8D5F5", name: "라벤더" },
    ],
    combos: [
      { colors: ["#F2C6D0", "#FFF3C4", "#E8D5F5"], name: "로맨틱" },
      { colors: ["#C8E6C9", "#B3D9F5", "#FFFFFF"], name: "프레시" },
    ],
  },
  summer: {
    name: "여름 쿨톤",
    desc: "청량하고 시원한 여름의 쿨 베이스",
    colors: [
      { hex: "#D6EDFF", name: "아이스블루" },
      { hex: "#A8E6CF", name: "민트그린" },
      { hex: "#F8F8F8", name: "오프화이트" },
      { hex: "#FFD3B6", name: "피치코럴" },
      { hex: "#C8F0F5", name: "아쿠아" },
    ],
    combos: [
      { colors: ["#D6EDFF", "#A8E6CF", "#F8F8F8"], name: "청량" },
      { colors: ["#FFD3B6", "#F8F8F8", "#A8E6CF"], name: "여름 캐주얼" },
    ],
  },
  fall: {
    name: "가을 어스톤",
    desc: "깊어지는 계절의 따뜻한 어스 팔레트",
    colors: [
      { hex: "#D4956A", name: "카라멜" },
      { hex: "#C67C52", name: "테라코타" },
      { hex: "#C8A84B", name: "머스타드" },
      { hex: "#6B4226", name: "초코브라운" },
      { hex: "#8D6B5A", name: "모카" },
    ],
    combos: [
      { colors: ["#D4956A", "#6B4226", "#C8A84B"], name: "어텀웜" },
      { colors: ["#C67C52", "#8D6B5A", "#D4956A"], name: "어스톤" },
    ],
  },
  winter: {
    name: "겨울 딥톤",
    desc: "차갑고 선명한 겨울의 딥 & 모노 팔레트",
    colors: [
      { hex: "#1A2456", name: "딥네이비" },
      { hex: "#2C2C2C", name: "차콜" },
      { hex: "#F5F3EE", name: "아이보리" },
      { hex: "#8B1A2B", name: "버건디" },
      { hex: "#5A7382", name: "블루그레이" },
    ],
    combos: [
      { colors: ["#1A2456", "#F5F3EE", "#8B1A2B"], name: "클래식" },
      { colors: ["#2C2C2C", "#5A7382", "#F5F3EE"], name: "모노톤" },
    ],
  },
};

const STYLE_ACCENT = {
  minimal: { hex: "#E8E0D0", name: "뉴트럴베이지" },
  casual:  { hex: "#90C7F0", name: "캐주얼블루" },
  street:  { hex: "#F07060", name: "스트릿레드" },
  office:  { hex: "#7090A0", name: "오피스그레이" },
  outdoor: { hex: "#70B870", name: "아웃도어그린" },
};

const WEATHER_TIP = {
  rain:    "비 오는 날엔 무채색 베이스에 포인트 컬러 하나로 심플하게",
  snow:    "눈 오는 날엔 아이보리·화이트 베이스에 딥컬러 레이어링",
  hot:     "더운 날엔 밝고 가벼운 톤으로 시각적 청량감을",
  cold:    "추운 날엔 딥톤 베이스에 따뜻한 어스 계열로 레이어링",
  default: "오늘 날씨와 계절에 어울리는 팔레트예요",
};

function getWeatherKey(condition, temp) {
  const c = (condition || "").toLowerCase();
  if (c.includes("rain") || c.includes("비") || c.includes("drizzle")) return "rain";
  if (c.includes("snow") || c.includes("눈")) return "snow";
  if (temp >= 27) return "hot";
  if (temp <= 5) return "cold";
  return "default";
}

export default function TodayColorPalette({ condition, temp, profile, theme }) {
  const accent = theme?.accent || "#E8543B";
  const season = getSeason();
  const palette = PALETTES[season];
  const weatherKey = useMemo(() => getWeatherKey(condition, temp), [condition, temp]);
  const tip = WEATHER_TIP[weatherKey];
  const styleAccent = STYLE_ACCENT[profile?.style];

  const colors = useMemo(() => {
    const base = [...palette.colors];
    if (styleAccent && profile?.style !== "minimal") {
      base[4] = styleAccent;
    }
    return base;
  }, [palette, profile?.style]);

  return (
    <section className="mt-6 border border-[#E5DED1] bg-[#FAF8F3] p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="wf-label text-[#6B665C]">오늘의 컬러 팔레트</div>
        <span
          className="border px-2 py-0.5 text-[11px] font-semibold"
          style={{ borderColor: `${accent}44`, color: accent }}
        >
          {palette.name}
        </span>
      </div>
      <p className="mb-5 text-xs text-[#8F897D]">{palette.desc}</p>

      {/* 스와치 */}
      <div className="grid grid-cols-5 gap-2 mb-5">
        {colors.map((color, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div
              className="h-16 w-full border border-black/8 transition hover:scale-[1.04]"
              style={{ background: color.hex }}
              title={color.hex}
            />
            <span className="text-[10px] font-semibold text-center leading-tight text-[#3A362E]">
              {color.name}
            </span>
            <span className="text-[9px] text-center text-[#A8A296]">{color.hex}</span>
          </div>
        ))}
      </div>

      {/* 추천 조합 */}
      <div className="border-t border-[#EFE8DA] pt-4">
        <p className="mb-3 text-xs font-semibold text-[#6B665C]">오늘 추천 조합</p>
        <div className="flex gap-4">
          {palette.combos.map((combo, ci) => (
            <div key={ci} className="flex flex-col gap-1.5">
              <div className="flex">
                {combo.colors.map((hex, i) => (
                  <div
                    key={i}
                    className="h-7 w-8 border border-black/8 first:rounded-l last:rounded-r"
                    style={{ background: hex }}
                  />
                ))}
              </div>
              <span className="text-[10px] text-[#8F897D]">{combo.name}</span>
            </div>
          ))}
        </div>
        <p
          className="mt-4 border-l-2 pl-3 text-xs leading-5 text-[#6B665C]"
          style={{ borderColor: accent }}
        >
          {tip}
        </p>
      </div>
    </section>
  );
}
