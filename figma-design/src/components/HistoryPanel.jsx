import { useOpen } from "../lib/useOpen.js";

export default function HistoryPanel({ history, onRemove }) {
  const [open, toggleOpen] = useOpen("history", false);

  if (history.length === 0) return null;

  return (
    <section className="mt-6 border border-[#E5DED1] bg-[#FAF8F3] p-5 sm:p-6">
      <button
        type="button"
        onClick={toggleOpen}
        className="flex w-full items-center justify-between"
      >
        <div className="text-left">
          <div className="wf-label text-[#6B665C]" style={{ fontSize: "13px" }}>착용 기록</div>
          <h2 className="mt-1 text-lg font-semibold">착용 기록 {history.length}일</h2>
        </div>
        <span style={{ fontSize: "13px", border: "0.5px solid #D7D0C4", borderRadius: "4px", padding: "2px 8px", color: "#6B665C" }}>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="mt-4 grid gap-2">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start justify-between gap-3 border border-[#E5DED1] bg-[#FFFDF7] p-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#6B665C]">{entry.date}</span>
                  <span className="text-xs text-[#8F897D]">
                    {entry.city} · {entry.temp}° · {entry.condition}
                  </span>
                </div>
                <div className="mt-1 text-sm font-semibold">{entry.outfitTitle}</div>
                <div className="mt-0.5 text-xs text-[#8F897D]">
                  {entry.style} · {entry.occasion !== "free" ? entry.occasionLabel : "자유"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(entry.id)}
                className="shrink-0 border border-[#D7D0C4] px-2 py-1 text-xs text-[#6B665C]"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
