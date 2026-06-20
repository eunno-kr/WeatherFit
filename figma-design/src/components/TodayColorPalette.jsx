import { useState, useMemo } from "react";

const getSeason = () => {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "fall";
  return "winter";
};

const SEASON_TO_PC = {
  spring: "spring-warm",
  summer: "summer-cool",
  fall:   "fall-warm",
  winter: "winter-cool",
};

const PERSONAL_COLORS = {
  "spring-warm": {
    name: "봄 웜톤",
    tone: "웜(Warm)",
    trait: "맑고 투명한 · 밝고 화사한",
    tip:  "선명하고 밝은 따뜻한 컬러가 어울려요. 골드 액세서리와 잘 맞아요.",
    colors: [
      { hex: "#F4A460", name: "웜코럴" },
      { hex: "#FFC080", name: "피치" },
      { hex: "#FFE8A0", name: "버터옐로우" },
      { hex: "#90C870", name: "프레시그린" },
      { hex: "#F8D8A0", name: "아이보리골드" },
    ],
    combos: [
      { colors: ["#F4A460", "#FFC080", "#FFE8A0"], name: "웜 파스텔" },
      { colors: ["#90C870", "#FFE8A0", "#F4A460"], name: "봄 내추럴" },
    ],
  },
  "summer-cool": {
    name: "여름 쿨톤",
    tone: "쿨(Cool)",
    trait: "흐릿하고 차가운 · 안개 낀 듯 부드러운",
    tip:  "탁하고 부드러운 쿨 베이스가 어울려요. 실버 액세서리와 잘 맞아요.",
    colors: [
      { hex: "#A8C0D8", name: "파우더블루" },
      { hex: "#C8A8C8", name: "소프트라벤더" },
      { hex: "#F0B8C8", name: "로즈핑크" },
      { hex: "#B8B8C8", name: "쿨그레이" },
      { hex: "#C0E0E8", name: "아이시민트" },
    ],
    combos: [
      { colors: ["#A8C0D8", "#C8A8C8", "#F0F0F8"], name: "쿨 뮤트" },
      { colors: ["#F0B8C8", "#C8A8C8", "#B8B8C8"], name: "소프트 로즈" },
    ],
  },
  "fall-warm": {
    name: "가을 웜톤",
    tone: "웜(Warm)",
    trait: "깊고 따뜻한 · 풍부하고 자연스러운",
    tip:  "깊고 탁한 어스 계열이 어울려요. 골드·구리 액세서리와 잘 맞아요.",
    colors: [
      { hex: "#C88848", name: "카멜" },
      { hex: "#C06040", name: "테라코타" },
      { hex: "#C09820", name: "머스타드" },
      { hex: "#806040", name: "초코브라운" },
      { hex: "#607840", name: "올리브그린" },
    ],
    combos: [
      { colors: ["#C88848", "#806040", "#C09820"], name: "어스 웜" },
      { colors: ["#C06040", "#607840", "#C88848"], name: "어텀 내추럴" },
    ],
  },
  "winter-cool": {
    name: "겨울 쿨톤",
    tone: "쿨(Cool)",
    trait: "선명하고 차가운 · 강렬한 대비",
    tip:  "선명하고 강한 쿨 딥 컬러가 어울려요. 실버·백금 액세서리와 잘 맞아요.",
    colors: [
      { hex: "#204888", name: "로얄네이비" },
      { hex: "#602068", name: "딥퍼플" },
      { hex: "#B02030", name: "와인레드" },
      { hex: "#E8E8F0", name: "아이시화이트" },
      { hex: "#204848", name: "딥틸" },
    ],
    combos: [
      { colors: ["#204888", "#E8E8F0", "#B02030"], name: "클래식 쿨" },
      { colors: ["#602068", "#204888", "#E8E8F0"], name: "쿨 딥" },
    ],
  },
};

const TABS = [
  { key: "spring-warm", label: "봄 웜톤" },
  { key: "summer-cool", label: "여름 쿨톤" },
  { key: "fall-warm",   label: "가을 웜톤" },
  { key: "winter-cool", label: "겨울 쿨톤" },
];

function getWeatherNote(condition, temp) {
  const c = (condition || "").toLowerCase();
  if (c.includes("rain") || c.includes("비")) return "비 오는 날 → 무채색 베이스에 포인트 한 가지 추천";
  if (c.includes("snow") || c.includes("눈")) return "눈 오는 날 → 화이트·아이보리 베이스 강조";
  if (temp >= 27) return "더운 날 → 밝고 가벼운 톤으로 청량감 강조";
  if (temp <= 5)  return "추운 날 → 딥톤 베이스에 레이어링 추천";
  return null;
}

export default function TodayColorPalette({ condition, temp, profile, theme }) {
  const accent = theme?.accent || "#E8543B";
  const season = getSeason();
  const recommended = SEASON_TO_PC[season];
  const [selected, setSelected] = useState(recommended);
  const pc = PERSONAL_COLORS[selected];
  const weatherNote = useMemo(() => getWeatherNote(condition, temp), [condition, temp]);

  const seasonLabel = { spring: "봄", summer: "여름", fall: "가을", winter: "겨울" }[season];

  return (
    <section className="mt-6 border border-[#E5DED1] bg-[#FAF8F3] p-5">

      {/* 헤더 */}
      <div className="wf-label text-[#3A362E]" style={{ fontSize: "13px" }}>오늘의 컬러 팔레트</div>

      {/* 선정 기준 박스 */}
      <div className="mt-2 mb-4 bg-[#F0EBE0] px-3 py-2.5 text-xs leading-5 text-[#3A362E]">
        <span className="font-bold">선정 기준</span>
        {"  "}현재 계절({seasonLabel}) + 날씨({condition || "—"}) + 기온({temp}°C)
        <span className="ml-1 font-semibold" style={{ color: accent }}>→ {PERSONAL_COLORS[recommended].name} 자동 추천</span>
        <div className="mt-1 text-[#6B665C]">
          아래 탭을 눌러 다른 퍼스널컬러 팔레트도 확인할 수 있어요
        </div>
      </div>

      {/* 탭 */}
      <div className="grid grid-cols-4 gap-1 mb-5">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelected(key)}
            className="py-2 text-xs font-bold border transition"
            style={{
              background: selected === key ? "#1A1A1A" : "transparent",
              color: selected === key ? "#FFFDF7" : "#6B665C",
              borderColor: selected === key ? "#1A1A1A" : "#D7D0C4",
              position: "relative",
            }}
          >
            {label}
            {key === recommended && selected !== key && (
              <span
                className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-full border-2 border-[#FAF8F3]"
                style={{ background: accent }}
                title="계절 추천"
              />
            )}
            {key === recommended && selected === key && (
              <span className="ml-1" style={{ color: accent }}>★</span>
            )}
          </button>
        ))}
      </div>

      {/* 퍼스널컬러 특징 */}
      <div className="mb-4 flex items-start gap-2 text-xs text-[#6B665C]">
        <span
          className="shrink-0 border px-1.5 py-0.5 font-semibold"
          style={{ borderColor: `${accent}44`, color: accent }}
        >
          {pc.tone}
        </span>
        <span className="font-medium">{pc.trait}</span>
      </div>

      {/* 색상 스와치 */}
      <div className="grid grid-cols-5 gap-2 mb-5">
        {pc.colors.map((color, i) => (
          <div key={i} className="flex flex-col gap-0">
            <div
              className="h-16 w-full border border-black/10"
              style={{ background: color.hex }}
              title={color.hex}
            />
            <div className="bg-[#EEEBE4] px-1 py-1.5 text-center">
              <span className="block text-xs font-bold leading-tight text-[#1A1A1A]">{color.name}</span>
              <span className="block text-[10px] font-medium text-[#6B665C] mt-0.5">{color.hex}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 추천 조합 */}
      <div className="border-t border-[#EFE8DA] pt-4">
        <p className="mb-3 text-sm font-bold text-[#3A362E]">추천 조합</p>
        <div className="flex gap-5">
          {pc.combos.map((combo, ci) => (
            <div key={ci} className="flex flex-col gap-2">
              <div className="flex overflow-hidden border border-black/10">
                {combo.colors.map((hex, i) => (
                  <div key={i} className="h-8 w-9" style={{ background: hex }} />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#6B665C]">{combo.name}</span>
            </div>
          ))}
        </div>

        {/* 스타일 팁 */}
        <p className="mt-4 border-l-2 pl-3 text-sm font-medium text-[#3A362E]"
           style={{ borderColor: accent }}>
          {pc.tip}
        </p>

        {/* 날씨 보정 */}
        {weatherNote && (
          <p className="mt-2 text-xs font-medium text-[#8F897D]">
            💡 {weatherNote}
          </p>
        )}
      </div>
    </section>
  );
}
