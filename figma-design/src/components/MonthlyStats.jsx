import { useMemo } from "react";
import { useOpen } from "../lib/useOpen.js";

const STYLE_KO = {
  minimal: "미니멀", casual: "캐주얼", street: "스트릿",
  formal: "포멀", sporty: "스포티",
};
const OCCASION_KO = {
  free: "자유", work: "출근", date: "데이트", exercise: "운동", meeting: "약속",
};

function topN(arr, key, n = 3) {
  const counts = {};
  arr.forEach((item) => {
    const val = item[key];
    if (val) counts[val] = (counts[val] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

export default function MonthlyStats({ history, wardrobe }) {
  const [open, toggleOpen] = useOpen("monthlyStats", false);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = `${now.getFullYear()}년 ${now.getMonth() + 1}월`;

    const monthHistory = history.filter((h) => {
      const d = new Date(h.date.replace(/\./g, "-").replace(/년 |월 |일/g, "-").trim());
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });

    const topStyles = topN(monthHistory, "style");
    const topOccasions = topN(monthHistory, "occasion");
    const topWardrobe = [...wardrobe]
      .filter((w) => (w.wearCount || 0) > 0)
      .sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0))
      .slice(0, 3);

    return { thisMonth, monthHistory, topStyles, topOccasions, topWardrobe };
  }, [history, wardrobe]);

  if (history.length === 0 && wardrobe.every((w) => !w.wearCount)) return null;

  return (
    <section className="mt-6 border border-[#E5DED1] bg-[#FAF8F3] p-5 sm:p-6">
      <button
        type="button"
        onClick={toggleOpen}
        className="flex w-full items-center justify-between"
      >
        <div className="text-left">
          <div className="wf-label text-[#6B665C]" style={{ fontSize: "13px" }}>월별 통계</div>
          <h2 className="mt-1 text-lg font-semibold">
            {stats.thisMonth} · {stats.monthHistory.length}회 착용
          </h2>
        </div>
        <span style={{ fontSize: "13px", border: "0.5px solid #D7D0C4", borderRadius: "4px", padding: "2px 8px", color: "#6B665C" }}>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="mt-5 grid gap-5">

          {/* 자주 입은 스타일 */}
          {stats.topStyles.length > 0 && (
            <div>
              <div className="wf-label mb-2 text-[#8F897D]" style={{ fontSize: "13px" }}>자주 입은 스타일</div>
              <div className="grid gap-2">
                {stats.topStyles.map(([style, count], i) => (
                  <div key={style} className="flex items-center gap-3">
                    <span className="w-4 text-xs font-semibold text-[#8F897D]">{i + 1}</span>
                    <div className="flex flex-1 items-center justify-between">
                      <span className="text-sm font-semibold">{STYLE_KO[style] || style}</span>
                      <span className="text-xs text-[#8F897D]">{count}회</span>
                    </div>
                    <div className="h-1.5 w-24 overflow-hidden bg-[#E5DED1]">
                      <div
                        className="h-full"
                        style={{
                          width: `${(count / stats.monthHistory.length) * 100}%`,
                          background: "#E8543B",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 자주 나간 상황 */}
          {stats.topOccasions.length > 0 && (
            <div>
              <div className="wf-label mb-2 text-[#8F897D]" style={{ fontSize: "13px" }}>자주 나간 상황</div>
              <div className="flex flex-wrap gap-2">
                {stats.topOccasions.map(([occasion, count]) => (
                  <div
                    key={occasion}
                    className="border border-[#D7D0C4] bg-[#FFFDF7] px-3 py-1.5 text-xs"
                  >
                    <span className="font-semibold">{OCCASION_KO[occasion] || occasion}</span>
                    <span className="ml-1.5 text-[#8F897D]">{count}회</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 자주 입은 옷 TOP3 */}
          {stats.topWardrobe.length > 0 && (
            <div>
              <div className="wf-label mb-2 text-[#8F897D]" style={{ fontSize: "13px" }}>자주 입은 옷 TOP {stats.topWardrobe.length}</div>
              <div className="grid gap-2">
                {stats.topWardrobe.map((item, i) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 border border-[#E5DED1] bg-[#FFFDF7] px-3 py-2.5"
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center text-xs font-semibold text-[#FFFDF7]"
                      style={{ background: i === 0 ? "#E8543B" : i === 1 ? "#6B665C" : "#A8A296" }}
                    >
                      {i + 1}
                    </span>
                    <div
                      className="h-4 w-4 shrink-0 border border-black/10"
                      style={{ background: item.colorHex || "#CBB89D" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{item.name}</div>
                      <div className="text-xs text-[#8F897D]">{item.color}</div>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-[#E8543B]">
                      {item.wearCount}회
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stats.monthHistory.length === 0 && (
            <p className="text-sm text-[#8F897D]">
              이번 달 착용 기록이 없어요. "오늘 입었어요" 버튼으로 기록해보세요!
            </p>
          )}
        </div>
      )}
    </section>
  );
}
