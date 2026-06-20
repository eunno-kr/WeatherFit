import { useMemo, useState } from "react";

const RANGES = [
  { label: "영하 이하", sub: "0° 미만", min: -99, max: 0,  emoji: "🥶" },
  { label: "0 – 9°",   sub: "한겨울",  min: 0,   max: 10, emoji: "🧥" },
  { label: "10 – 14°", sub: "초봄·초겨울", min: 10, max: 15, emoji: "🧣" },
  { label: "15 – 19°", sub: "봄·가을", min: 15, max: 20, emoji: "🧤" },
  { label: "20 – 24°", sub: "따뜻함",  min: 20, max: 25, emoji: "👕" },
  { label: "25 – 29°", sub: "여름",    min: 25, max: 30, emoji: "🌞" },
  { label: "30° 이상", sub: "한여름",  min: 30, max: 99, emoji: "🔥" },
];

function getMostFrequent(entries) {
  if (!entries.length) return "";
  const counts = {};
  entries.forEach((e) => {
    counts[e.outfitTitle] = (counts[e.outfitTitle] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

export default function TempHistory({ history, theme }) {
  const accent = theme?.accent || "#E8543B";
  const [open, setOpen] = useState(true);

  const grouped = useMemo(() => {
    return RANGES.map((r) => ({
      ...r,
      entries: history.filter((h) => {
        const t = Number(h.temp);
        return !isNaN(t) && t >= r.min && t < r.max;
      }),
    })).filter((r) => r.entries.length > 0);
  }, [history]);

  if (!grouped.length) return null;

  const maxCount = Math.max(...grouped.map((r) => r.entries.length));

  return (
    <section className="mt-4 border border-[#E5DED1] bg-[#FAF8F3] p-5">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between mb-1">
        <div>
          <div className="wf-label text-[#3A362E]" style={{ fontSize: "13px" }}>기온대별 코디 기록</div>
          <p className="mt-1 text-sm font-medium text-[#6B665C]">
            내 착용 기록 {history.length}개 분석 · 기온별 자주 입은 코디
          </p>
        </div>
        <span style={{ fontSize: "13px", border: "0.5px solid #D7D0C4", borderRadius: "4px", padding: "2px 8px", color: "#6B665C" }}>{open ? "−" : "+"}</span>
      </button>

      {open && <div className="mt-4 grid gap-4">
        {grouped.map((range) => {
          const topOutfit = getMostFrequent(range.entries);
          const barPct = Math.max(8, Math.round((range.entries.length / maxCount) * 100));

          return (
            <div key={range.label}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg leading-none">{range.emoji}</span>
                  <span className="text-sm font-bold text-[#1A1A1A]">{range.label}</span>
                  <span className="text-sm font-medium text-[#8F897D]">· {range.sub}</span>
                </div>
                <span className="text-sm font-bold tabular-nums" style={{ color: accent }}>
                  {range.entries.length}회
                </span>
              </div>

              {/* 바 그래프 */}
              <div className="relative h-9 overflow-hidden bg-[#F0EBE0]">
                <div
                  className="absolute inset-y-0 left-0 transition-all"
                  style={{ width: `${barPct}%`, background: `${accent}40` }}
                />
                <div className="absolute inset-0 flex items-center px-3">
                  <span className="truncate text-sm font-semibold text-[#1A1A1A]">{topOutfit}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>}

      {open && <p className="mt-4 text-xs font-medium text-[#8F897D]">
        막대 안 텍스트 = 해당 기온에서 가장 자주 입은 코디
      </p>}
    </section>
  );
}
