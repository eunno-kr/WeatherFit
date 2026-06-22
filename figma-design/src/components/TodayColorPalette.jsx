import { useState } from "react";
import { useOpen } from "../lib/useOpen.js";

const getSeason = () => {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "fall";
  return "winter";
};

const SEASON_KO = { spring: "봄", summer: "여름", fall: "가을", winter: "겨울" };
const PC_KEY = "wf-personal-color";

const QUESTIONS = [
  {
    q: "손목 안쪽 혈관이 어떤 색인가요?",
    hint: "밝은 빛 아래서 확인해보세요",
    options: [{ label: "초록빛", value: "W" }, { label: "파란·보라빛", value: "C" }],
  },
  {
    q: "피부에서 느껴지는 빛깔은?",
    hint: "화장을 지운 자연 피부 기준",
    options: [{ label: "노란빛·황금빛", value: "W" }, { label: "분홍빛·파란빛", value: "C" }],
  },
  {
    q: "어울리는 금속 액세서리는?",
    hint: "착용했을 때 더 화사해 보이는 것",
    options: [{ label: "금(Gold)", value: "W" }, { label: "은(Silver)", value: "C" }],
  },
  {
    q: "햇빛에 노출되면 피부가 어떻게 되나요?",
    hint: "",
    options: [{ label: "황금빛으로 그을린다", value: "W" }, { label: "붉어지거나 잘 안 탄다", value: "C" }],
  },
  {
    q: "전체적인 피부 인상은?",
    hint: "자연광 아래에서 봤을 때",
    options: [
      { label: "맑고 투명한 / 선명하고 또렷한", value: "bright" },
      { label: "부드럽고 차분한 / 깊고 풍성한", value: "deep" },
    ],
  },
];

const RESULT_MAP = {
  "W-bright": { name: "봄 웜톤", desc: "맑고 밝은 따뜻한 컬러 타입", tone: "warm" },
  "W-deep":   { name: "가을 웜톤", desc: "깊고 풍성한 따뜻한 컬러 타입", tone: "warm" },
  "C-bright": { name: "여름 쿨톤", desc: "부드럽고 흐린 차가운 컬러 타입", tone: "cool" },
  "C-deep":   { name: "겨울 쿨톤", desc: "선명하고 강렬한 차가운 컬러 타입", tone: "cool" },
};

const PALETTES = {
  spring: {
    warm: {
      desc: "봄날의 밝고 따뜻한 파스텔",
      tip: "웜톤은 봄에 코럴·피치·골드로 화사하게 연출하세요",
      colors: [
        { hex: "#F4A460", name: "웜코럴" },
        { hex: "#FFC080", name: "피치" },
        { hex: "#FFE8A0", name: "버터옐로우" },
        { hex: "#A8D880", name: "프레시그린" },
        { hex: "#F8D8A0", name: "아이보리골드" },
      ],
    },
    cool: {
      desc: "봄날의 맑고 부드러운 쿨 파스텔",
      tip: "쿨톤은 봄에 라일락·파스텔블루로 청순하게 연출하세요",
      colors: [
        { hex: "#B8D8F0", name: "파스텔블루" },
        { hex: "#D0B8E8", name: "라일락" },
        { hex: "#B0E8D0", name: "소프트민트" },
        { hex: "#F8F0FF", name: "소프트화이트" },
        { hex: "#F0B8C8", name: "로즈핑크" },
      ],
    },
  },
  summer: {
    warm: {
      desc: "여름의 가볍고 따뜻한 베이지 계열",
      tip: "웜톤은 여름에도 코럴·피치 유지, 아이보리 베이스로 시원하게",
      colors: [
        { hex: "#F4A470", name: "써머코럴" },
        { hex: "#FFC888", name: "연피치" },
        { hex: "#FFF0D0", name: "크림아이보리" },
        { hex: "#C8D890", name: "연카키" },
        { hex: "#F0E0B0", name: "베이지" },
      ],
    },
    cool: {
      desc: "여름의 청량하고 시원한 쿨 베이스",
      tip: "쿨톤은 여름에 아이스블루·민트로 청량감을 극대화하세요",
      colors: [
        { hex: "#D6EDFF", name: "아이스블루" },
        { hex: "#A8E6CF", name: "민트그린" },
        { hex: "#F8F8F8", name: "오프화이트" },
        { hex: "#D8C8F0", name: "소프트라벤더" },
        { hex: "#C0E8F0", name: "아쿠아" },
      ],
    },
  },
  fall: {
    warm: {
      desc: "가을의 깊고 따뜻한 어스 팔레트",
      tip: "웜톤은 가을에 테라코타·카멜로 가장 자연스러운 어스 코디를",
      colors: [
        { hex: "#C88848", name: "카멜" },
        { hex: "#C06040", name: "테라코타" },
        { hex: "#C09820", name: "머스타드" },
        { hex: "#806040", name: "초코브라운" },
        { hex: "#607840", name: "올리브" },
      ],
    },
    cool: {
      desc: "가을의 스모키하고 차분한 쿨 어스",
      tip: "쿨톤은 가을에 스모키 계열로 차분하고 세련되게 연출하세요",
      colors: [
        { hex: "#7090A8", name: "스틸블루" },
        { hex: "#A090B0", name: "스모키라벤더" },
        { hex: "#508878", name: "딥민트" },
        { hex: "#506070", name: "슬레이트" },
        { hex: "#A06870", name: "로즈우드" },
      ],
    },
  },
  winter: {
    warm: {
      desc: "겨울의 깊고 따뜻한 딥 웜 팔레트",
      tip: "웜톤은 겨울에 딥버건디·다크올리브로 깊고 고급스럽게",
      colors: [
        { hex: "#900030", name: "딥버건디" },
        { hex: "#A06030", name: "딥카멜" },
        { hex: "#506028", name: "다크올리브" },
        { hex: "#A04830", name: "딥테라코타" },
        { hex: "#988020", name: "골드브라운" },
      ],
    },
    cool: {
      desc: "겨울의 선명하고 강렬한 딥 쿨 팔레트",
      tip: "쿨톤은 겨울에 로얄네이비·와인레드로 강렬한 대비를 살리세요",
      colors: [
        { hex: "#203880", name: "로얄네이비" },
        { hex: "#602068", name: "딥퍼플" },
        { hex: "#A02030", name: "와인레드" },
        { hex: "#E8E8F0", name: "아이시화이트" },
        { hex: "#205060", name: "딥틸" },
      ],
    },
  },
};

function loadSavedPC() {
  try { return JSON.parse(localStorage.getItem(PC_KEY)); } catch { return null; }
}

export default function TodayColorPalette({ condition, temp, profile, theme, darkMode }) {
  const accent = theme?.accent || "#E8543B";
  const season = getSeason();
  const seasonKo = SEASON_KO[season];

  const [open, toggleOpen] = useOpen("colorPalette", true);
  const [tab, setTab] = useState("quiz");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(() => loadSavedPC());
  const [done, setDone] = useState(() => !!loadSavedPC());

  const palette = tab === "warm" ? PALETTES[season].warm : tab === "cool" ? PALETTES[season].cool : null;

  const handleAnswer = (value) => {
    const next = { ...answers, [step]: value };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      const toneVotes = Object.entries(next).slice(0, 4).map(([, v]) => v);
      const wCount = toneVotes.filter((v) => v === "W").length;
      const tone = wCount >= 2 ? "W" : "C";
      const depth = next[4] || "bright";
      const pc = RESULT_MAP[`${tone}-${depth}`];
      setResult(pc);
      setDone(true);
      localStorage.setItem(PC_KEY, JSON.stringify(pc));
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setStep(0);
    setResult(null);
    setDone(false);
    localStorage.removeItem(PC_KEY);
  };

  const TABS = [
    { key: "quiz", label: "퍼스널컬러 찾기" },
    { key: "warm", label: `${seasonKo} 웜톤` },
    { key: "cool", label: `${seasonKo} 쿨톤` },
  ];

  return (
    <section className="mt-6 border border-[#E5DED1] bg-[#FAF8F3] p-5">

      {/* 헤더 */}
      <button type="button" onClick={toggleOpen} className="flex w-full items-start justify-between mb-3">
        <div className="text-left">
          <div className="wf-label text-[#3A362E]" style={{ fontSize: "13px" }}>퍼스널컬러 & 색상 팔레트</div>
          <p className="mt-1 text-xs text-[#8F897D] leading-5">내 피부톤에 맞는 색상을 진단하고 계절별 팔레트를 확인하세요. 코디 추천 색상과는 별개로, 평소 잘 받는 색을 파악하는 용도예요.</p>
        </div>
        <span className="ml-3 shrink-0" style={{ fontSize: "13px", border: "0.5px solid #D7D0C4", borderRadius: "4px", padding: "2px 8px", color: "#6B665C" }}>{open ? "−" : "+"}</span>
      </button>
      {open && <div className="border-t border-[#E5DED1] pt-4 mb-1" />}

      {/* 탭 */}
      {open && <div className="grid grid-cols-3 gap-1.5 mb-5">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className="py-3 text-sm font-bold border transition"
            style={{
              background: tab === key ? "#1A1A1A" : "transparent",
              color: tab === key ? "#FFFDF7" : (darkMode ? "#9e9890" : "#6B665C"),
              borderColor: tab === key ? "#1A1A1A" : (darkMode ? "#4a4540" : "#D7D0C4"),
            }}
          >
            {label}
            {key === "quiz" && result && tab !== "quiz" && (
              <span className="ml-1 text-[10px]" style={{ color: accent }}>✓</span>
            )}
          </button>
        ))}
      </div>}

      {/* ── 퍼스널컬러 찾기 탭 ── */}
      {open && tab === "quiz" && !done && (
        <div>
          {/* 진행 바 */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <div className="wf-label text-[#3A362E]" style={{ fontSize: "13px" }}>
                퍼스널컬러 진단
              </div>
              <span className="text-xs font-semibold text-[#8F897D]">
                {step + 1} / {QUESTIONS.length}
              </span>
            </div>
            <div className="h-1.5 bg-[#F0EBE0]">
              <div
                className="h-full transition-all"
                style={{ width: `${(step / QUESTIONS.length) * 100}%`, background: accent }}
              />
            </div>
          </div>

          <p className="text-base font-bold text-[#1A1A1A] leading-6">{QUESTIONS[step].q}</p>
          {QUESTIONS[step].hint && (
            <p className="mt-1 text-xs text-[#8F897D]">{QUESTIONS[step].hint}</p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3">
            {QUESTIONS[step].options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleAnswer(opt.value)}
                className="border py-5 text-sm font-semibold text-[#3A362E] transition hover:border-[#1A1A1A] hover:bg-[#EEE9E0]"
                style={{ borderColor: "#D7D0C4" }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 진단 결과 ── */}
      {open && tab === "quiz" && done && result && (
        <div>
          <div className="wf-label mb-3 text-[#3A362E]" style={{ fontSize: "13px" }}>내 퍼스널컬러</div>
          <div className="border-l-4 pl-4 py-2 mb-4" style={{ borderColor: accent }}>
            <p className="text-2xl font-bold text-[#1A1A1A]">{result.name}</p>
            <p className="mt-1 text-sm text-[#6B665C]">{result.desc}</p>
          </div>

          <div className="bg-[#F0EBE0] px-4 py-3 text-sm text-[#3A362E] leading-6">
            <strong>{seasonKo} 시즌</strong>에 맞는 팔레트는 위 탭에서 확인하세요!<br />
            <span style={{ color: accent }} className="font-semibold">
              {result.tone === "warm" ? `→ '${seasonKo} 웜톤' 탭 추천` : `→ '${seasonKo} 쿨톤' 탭 추천`}
            </span>
          </div>

          <button
            type="button"
            onClick={resetQuiz}
            className="mt-4 border border-[#D7D0C4] px-4 py-2 text-xs font-semibold text-[#6B665C] hover:border-[#1A1A1A] transition"
          >
            다시 테스트하기
          </button>
        </div>
      )}

      {/* ── 웜톤 / 쿨톤 팔레트 탭 ── */}
      {open && palette && (
        <div>
          <p className="mb-4 text-sm font-medium text-[#6B665C]">{palette.desc}</p>

          {result && (
            <div
              className="mb-4 flex items-center gap-2 border px-3 py-2 text-xs font-semibold"
              style={{ borderColor: `${accent}44`, color: accent }}
            >
              ✦ 내 퍼스널컬러({result.name})
              {result.tone === (tab === "warm" ? "warm" : "cool")
                ? " — 나에게 잘 맞는 톤이에요!"
                : " — 나의 톤과 다를 수 있어요"}
            </div>
          )}

          {/* 스와치 */}
          <div className="grid grid-cols-5 gap-2 mb-5">
            {palette.colors.map((color, i) => (
              <div key={i}>
                <div className="h-16 w-full border border-black/10" style={{ background: color.hex }} />
                <div className="bg-[#EEEBE4] px-1 py-1.5 text-center">
                  <span className="block text-xs font-bold text-[#1A1A1A] leading-tight">{color.name}</span>
                  <span className="block text-[10px] text-[#6B665C] mt-0.5">{color.hex}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="border-l-2 pl-3 text-sm font-medium text-[#3A362E]" style={{ borderColor: accent }}>
            {palette.tip}
          </p>

          {!result && (
            <button
              type="button"
              onClick={() => setTab("quiz")}
              className="mt-4 border px-4 py-2 text-xs font-semibold transition"
              style={{ borderColor: `${accent}55`, color: accent }}
            >
              ✦ 내 퍼스널컬러 찾기 →
            </button>
          )}
        </div>
      )}
    </section>
  );
}
