const MOODS = [
  { id: "minimal", label: "미니멀" },
  { id: "casual", label: "캐주얼" },
  { id: "street", label: "스트릿" },
  { id: "formal", label: "포멀" },
  { id: "sporty", label: "스포티" },
];

export default function MoodPicker({ mood, onMoodChange, theme }) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {MOODS.map((item) => {
        const selected = mood === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onMoodChange(item.id)}
            className="rounded-full border px-4 py-2 text-sm transition"
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
  );
}
