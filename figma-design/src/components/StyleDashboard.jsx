import { useMemo, useState } from "react";

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

const TIPS = {
  rain:    ["우산은 필수예요. 방수 소재 아우터를 챙기세요.", "비 오는 날엔 밝은 컬러로 기분을 올려보세요.", "스웨이드·패브릭 슈즈는 오늘 쉬게 해주세요."],
  snow:    ["방한 레이어링이 핵심이에요. 목도리 챙기세요.", "어두운 컬러 코트에 흰 니트 조합 추천해요.", "워커나 방수 부츠로 발을 따뜻하게 하세요."],
  cold:    ["체감온도가 낮아요. 히트텍 이너를 꼭 챙기세요.", "두꺼운 한 겹보다 얇은 여러 겹이 더 따뜻해요.", "목·손목·발목, 3곳만 막아도 체감이 달라요."],
  cool:    ["레이어링 하기 좋은 날씨예요.", "가벼운 재킷이나 가디건 하나면 충분해요.", "일교차가 있으면 접을 수 있는 아우터가 좋아요."],
  warm:    ["통기성 좋은 소재를 선택하세요.", "린넨이나 코튼 소재가 오늘 딱이에요.", "자외선이 강하면 모자나 선글라스를 챙기세요."],
  hot:     ["최대한 가볍게 입고 그늘을 활용하세요.", "흰색·연한 컬러가 열을 덜 흡수해요.", "자외선 차단제는 옷만큼 중요한 아이템이에요."],
  default: ["오늘 코디에 포인트 컬러 하나 추가해보세요.", "자신 있는 아이템으로 시작하면 코디가 쉬워져요.", "편안함과 스타일, 둘 다 잡는 게 진짜 패션이에요."],
};

function getTip(condition, temp) {
  const c = (condition || "").toLowerCase();
  const t = temp || 20;
  if (c.includes("rain") || c.includes("비") || c.includes("drizzle")) return TIPS.rain;
  if (c.includes("snow") || c.includes("눈")) return TIPS.snow;
  if (t <= 4) return TIPS.cold;
  if (t <= 12) return TIPS.cool;
  if (t <= 23) return TIPS.warm;
  return TIPS.hot;
}

function localDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getWeekDates() {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dow + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return localDateStr(d);
  });
}

function parseDate(raw) {
  if (!raw) return null;
  // "2026. 6. 21." (ko-KR) 및 "2026-06-21", "2026/6/21" 등 모두 처리
  const m = raw.match(/(\d{4})\s*[.\-/]\s*(\d{1,2})\s*[.\-/]\s*(\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  return null;
}

function calcStreak(history) {
  if (!history.length) return 0;
  const dates = new Set(history.map((h) => parseDate(h.date)).filter(Boolean));
  let streak = 0;
  const d = new Date();
  while (true) {
    if (dates.has(localDateStr(d))) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
}

const STYLE_KO = { minimal: "미니멀", casual: "캐주얼", street: "스트릿", formal: "포멀", sporty: "스포티" };
const LABEL_STYLE = { fontSize: "13px" };

export default function StyleDashboard({ history, condition, temp, theme }) {
  const accent = theme?.accent || "#E8543B";
  const weekDates = useMemo(() => getWeekDates(), []);
  const todayStr = localDateStr(new Date());

  const historyDates = useMemo(() => {
    const set = new Set();
    history.forEach((h) => { const d = parseDate(h.date); if (d) set.add(d); });
    return set;
  }, [history]);

  const streak = useMemo(() => calcStreak(history), [history]);
  const tips = useMemo(() => getTip(condition, temp), [condition, temp]);
  const todayTip = tips[new Date().getDay() % tips.length];
  const recentOutfits = history.slice(0, 3);
  const wornDays = weekDates.filter((d) => historyDates.has(d)).length;

  const [openCal, setOpenCal] = useState(true);
  const [openStreak, setOpenStreak] = useState(true);
  const [openRecent, setOpenRecent] = useState(true);

  return (
    <div className="mt-6 grid gap-4">

      {/* ── 1. 이번 주 착용 달력 ── */}
      <section className="border border-[#E5DED1] bg-[#FAF8F3] p-5">
        <button type="button" onClick={() => setOpenCal((v) => !v)} className="flex w-full items-center justify-between mb-4">
          <div>
            <div className="wf-label text-[#3A362E]" style={LABEL_STYLE}>이번 주 착용 달력</div>
            <p className="mt-1 text-sm font-medium text-[#6B665C]">
              {wornDays > 0 ? `이번 주 ${wornDays}일 기록했어요` : "오늘부터 기록을 시작해보세요!"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="border px-3 py-1 text-sm font-bold" style={{ borderColor: `${accent}55`, color: accent }}>{wornDays}/7</span>
            <span className="text-xs text-[#A8A296]">{openCal ? "▲" : "▼"}</span>
          </div>
        </button>
        {openCal && (
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, i) => {
              const worn = historyDates.has(date);
              const isToday = date === todayStr;
              const dayNum = new Date(date + "T00:00:00").getDate();
              return (
                <div key={date} className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: isToday ? accent : "#6B665C" }}>
                    {WEEKDAYS[i]}
                  </span>
                  <div
                    className="flex h-10 w-full items-center justify-center text-sm font-bold transition"
                    style={{
                      background: worn ? accent : isToday ? `${accent}18` : "#F0EBE0",
                      color: worn ? "#FFFDF7" : isToday ? accent : "#6B665C",
                      borderRadius: "4px",
                    }}
                  >
                    {worn ? "✓" : dayNum}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── 2+3. 착용 스트릭 + 오늘의 팁 ── */}
      <div className="grid grid-cols-[auto_1fr] gap-3">
        <section
          className="border p-4 flex flex-col justify-between"
          style={{ borderColor: streak > 0 ? `${accent}55` : "#E5DED1", background: streak > 0 ? `${accent}08` : "#FAF8F3", minWidth: "120px" }}
        >
          <div className="wf-label text-[#3A362E]" style={LABEL_STYLE}>연속 착용일</div>
          <div className="mt-3">
            <div className="flex items-end gap-1">
              <span className="text-4xl font-semibold leading-none" style={{ color: streak > 0 ? accent : "#C9C3BB" }}>
                {streak}
              </span>
              <span className="mb-1 text-base font-semibold text-[#6B665C]">일</span>
            </div>
            <p className="mt-2 text-sm font-medium text-[#6B665C]">
              {streak === 0 && "오늘 기록을 시작해보세요!"}
              {streak >= 1 && streak < 3 && "좋은 시작이에요!"}
              {streak >= 3 && streak < 7 && "잘 하고 있어요!"}
              {streak >= 7 && "🔥 일주일 연속!"}
            </p>
          </div>
        </section>

        <section className="border border-[#E5DED1] bg-[#FAF8F3] p-4">
          <div className="wf-label text-[#3A362E]" style={LABEL_STYLE}>오늘의 스타일 팁</div>
          <div className="mt-3 border-l-2 pl-3 text-sm font-medium leading-6 text-[#1A1A1A]" style={{ borderColor: accent }}>
            {todayTip}
          </div>
          <p className="mt-2 text-xs font-medium text-[#8F897D]">
            {condition || "현재 날씨"} · {temp}°
          </p>
        </section>
      </div>

      {/* ── 4. 최근 착용 코디 ── */}
      {recentOutfits.length > 0 && (
        <section className="border border-[#E5DED1] bg-[#FAF8F3] p-5">
          <button type="button" onClick={() => setOpenRecent((v) => !v)} className="flex w-full items-center justify-between mb-4">
            <div className="wf-label text-[#3A362E]" style={LABEL_STYLE}>최근 착용 코디</div>
            <span className="text-xs text-[#A8A296]">{openRecent ? "▲" : "▼"}</span>
          </button>
          {openRecent && (
            <div className="grid gap-3">
              {recentOutfits.map((entry, i) => (
                <div key={entry.id} className="flex items-center gap-3">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center text-sm font-bold text-[#FFFDF7]"
                    style={{ background: i === 0 ? accent : "#C9C3BB" }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0 border-b border-[#F0EBE0] pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base font-semibold truncate text-[#1A1A1A]">{entry.outfitTitle}</span>
                      <span
                        className="shrink-0 border px-2 py-0.5 text-xs font-semibold"
                        style={{ borderColor: `${accent}44`, color: accent }}
                      >
                        {STYLE_KO[entry.style] || entry.style}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-[#6B665C]">
                      {entry.date} · {entry.temp}° · {entry.condition}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

    </div>
  );
}
