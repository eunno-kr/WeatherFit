import ColorText from "./ColorText.jsx";
import { downloadOutfitCard } from "../lib/imageCard.js";

const SLOTS = [
  ["레이어", "outer"],
  ["상의", "top"],
  ["하의", "bottom"],
  ["슈즈", "shoes"],
  ["포인트", "accessory"],
];

function OutfitCard({ outfit, index, theme, onSave, isSaved, weather, palette, condition }) {
  return (
    <article className="group border border-black/10 bg-[#FFFDF7] p-5 transition hover:border-black/40 hover:bg-white">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="wf-label" style={{ color: theme.accent }}>
            LOOK {index + 1}
          </div>
          <h3 className="mt-1 text-lg font-semibold">{outfit.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => downloadOutfitCard({ outfit, weather, palette, condition })}
            className="border border-[#D7D0C4] px-2 py-1 text-[11px] text-[#6B665C] transition hover:border-[#1A1A1A]"
            title="이미지로 저장"
          >
            ↓ 카드
          </button>
          <button
            type="button"
            onClick={() => onSave(outfit)}
            className="border px-2 py-1 text-[11px] transition"
            style={{
              borderColor: isSaved ? theme.accent : "#D7D0C4",
              color: isSaved ? theme.accent : "#6B665C",
              background: isSaved ? `${theme.accent}18` : "transparent",
            }}
          >
            {isSaved ? "저장됨 ✓" : "저장"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {SLOTS.map(([label, key]) => (
          <div
            key={key}
            className="grid grid-cols-[64px_1fr] gap-3 border-t border-[#EFE8DA] pt-2 text-sm first:border-t-0 first:pt-0"
          >
            <span className="wf-label" style={{ color: theme.accent }}>
              {label}
            </span>
            <ColorText value={outfit[key]} muted={outfit[key] === "레이어 생략"} />
          </div>
        ))}
      </div>
    </article>
  );
}

function shareOutfit(outfit, weather) {
  const lines = [
    `👗 WeatherFit 코디 추천`,
    `📅 ${new Date().toLocaleDateString("ko-KR")} · ${weather || ""}`,
    `✨ ${outfit.title}`,
    ``,
    `레이어: ${outfit.outer}`,
    `상의: ${outfit.top}`,
    `하의: ${outfit.bottom}`,
    `슈즈: ${outfit.shoes}`,
    `포인트: ${outfit.accessory}`,
  ].join("\n");

  if (navigator.share) {
    navigator.share({ title: "WeatherFit 코디", text: lines }).catch(() => {});
  } else {
    navigator.clipboard.writeText(lines).then(() => alert("클립보드에 복사됐어요!")).catch(() => {});
  }
}

export default function LookCard({
  look,
  theme,
  onSave,
  savedIds,
  forecastDay,
  forecastDate,
  onWorn,
  weatherSummary,
  onAskAI,
  aiAdvice,
  aiLoading,
  weather,
  condition,
}) {
  const sectionLabel =
    forecastDay === 0 ? "오늘의 코디" : forecastDay === 1 ? "내일의 코디" : "예보 코디";
  const title =
    forecastDay === 0
      ? "오늘 바로 입는 3가지 코디"
      : forecastDay === 1
        ? "내일 날씨에 맞는 3가지 코디"
        : `${forecastDate} 날씨에 맞는 3가지 코디`;

  return (
    <section
      className="look-section-animated mt-6 border p-5 sm:p-6"
      style={{ borderColor: `${theme.accent}44` }}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="wf-label" style={{ color: theme.accent }}>
            {sectionLabel}
          </div>
          <h2 className="mt-1 text-2xl font-semibold tracking-normal">{title}</h2>
        </div>
        <div className="border border-[#D7D0C4] bg-[#FFFDF7] px-2.5 py-1 text-xs text-[#6B665C]">
          일반 추천
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {look.outfits.map((outfit, index) => (
          <OutfitCard
            key={outfit.id}
            outfit={outfit}
            index={index}
            theme={theme}
            onSave={onSave}
            isSaved={savedIds.has(outfit.id)}
            weather={weather}
            palette={look.palette}
            condition={condition}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onWorn && onWorn(look.outfits[0])}
          className="border border-[#1A1A1A] bg-[#1A1A1A] px-4 py-2 text-xs font-semibold text-white transition hover:opacity-80"
        >
          오늘 입었어요 ✓
        </button>
        <button
          type="button"
          onClick={() => shareOutfit(look.outfits[0], weatherSummary)}
          className="border border-[#D7D0C4] px-4 py-2 text-xs text-[#6B665C]"
        >
          공유하기 ↗
        </button>
        {onAskAI && (
          <button
            type="button"
            onClick={onAskAI}
            disabled={aiLoading}
            className="flex items-center gap-1.5 border px-4 py-2 text-xs font-semibold transition disabled:opacity-50"
            style={{
              borderColor: theme.accent,
              color: aiAdvice ? "#FFFDF7" : theme.accent,
              background: aiAdvice ? theme.accent : "transparent",
            }}
          >
            {aiLoading ? (
              <>
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                AI 분석 중...
              </>
            ) : (
              <>✦ AI에게 물어보기</>
            )}
          </button>
        )}
      </div>

      {aiAdvice && (
        <div
          className="mt-4 border-l-2 pl-4 text-sm leading-7"
          style={{ borderColor: theme.accent }}
        >
          <div className="wf-label mb-2" style={{ color: theme.accent }}>
            AI 스타일리스트
          </div>
          <p className="whitespace-pre-line text-[#3A362E]">{aiAdvice}</p>
        </div>
      )}

      <p className="mt-5 text-sm leading-6 text-[#3A362E]">{look.comment}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {look.reasons.map((reason) => (
          <span
            key={reason}
            className="border px-2.5 py-1 font-display text-[11px] font-medium"
            style={{ borderColor: `${theme.accent}66`, color: theme.accent }}
          >
            왜? {reason}
          </span>
        ))}
      </div>
    </section>
  );
}
