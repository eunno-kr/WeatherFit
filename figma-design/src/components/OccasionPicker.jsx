const OCCASIONS = [
  { id: "free",     label: "자유",   emoji: "✨", mood: null,     tip: "선택한 스타일 그대로 적용됩니다." },
  { id: "work",     label: "출근",   emoji: "💼", mood: "formal", tip: "단정하고 깔끔한 포멀 룩으로 추천합니다." },
  { id: "date",     label: "데이트", emoji: "🌹", mood: null,     tip: "선택한 스타일에 포인트 아이템을 강조합니다." },
  { id: "exercise", label: "운동",   emoji: "🏃", mood: "sporty", tip: "움직임 편한 스포티 룩으로 추천합니다." },
  { id: "meeting",  label: "약속",   emoji: "☕", mood: "casual", tip: "부담 없이 편안한 캐주얼 룩으로 추천합니다." },
];

export const OCCASION_DEFS = OCCASIONS;

export default function OccasionPicker({ occasion, onOccasionChange, theme }) {
  const current = OCCASIONS.find((o) => o.id === occasion) || OCCASIONS[0];

  return (
    <div className="mt-4 border-b border-[#D7D0C4] pb-4">
      <div className="wf-label mb-2 text-[#6B665C]" style={{ fontSize: "13px" }}>상황</div>
      <div className="flex flex-wrap gap-2">
        {OCCASIONS.map((item) => {
          const selected = occasion === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onOccasionChange(item.id)}
              className="flex items-center gap-1.5 border px-3 py-1.5 text-sm transition"
              style={{
                borderColor: selected ? theme.accent : "#CFC9BD",
                background: selected ? theme.accent : "transparent",
                color: selected ? "#fff" : "#6B665C",
              }}
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      {current.tip && (
        <p className="mt-2 text-xs text-[#8F897D]">{current.tip}</p>
      )}
    </div>
  );
}
