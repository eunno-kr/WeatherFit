import { useOpen } from "../lib/useOpen.js";

const MOODS = [
  { id: "minimal", label: "미니멀" },
  { id: "casual", label: "캐주얼" },
  { id: "street", label: "스트릿" },
  { id: "formal", label: "포멀" },
  { id: "sporty", label: "스포티" },
];

export default function MoodPicker({ mood, onMoodChange, theme }) {
  const [open, toggleOpen] = useOpen("mood", true);
  const current = MOODS.find((m) => m.id === mood);

  return (
    <div className="mt-6 border-b border-[#D7D0C4] pb-5">
      <button type="button" onClick={toggleOpen} className="flex w-full items-center justify-between mb-2">
        <div className="wf-label text-[#6B665C]" style={{ fontSize: "13px" }}>스타일 · {current?.label || "선택"}</div>
        <span style={{ fontSize: "13px", border: "0.5px solid #D7D0C4", borderRadius: "4px", padding: "2px 8px", color: "#6B665C" }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="flex flex-wrap gap-2">
          {MOODS.map((item) => {
            const selected = mood === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onMoodChange(item.id)}
                className="border px-4 py-2 text-sm transition"
                style={{
                  borderColor: selected ? theme.accent : "#CFC9BD",
                  background: selected ? theme.accent : "transparent",
                  color: selected ? "#fff" : "#6B665C",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
