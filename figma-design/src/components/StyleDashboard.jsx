import { useMemo } from "react";

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

const TIPS = {
  rain:    ["우산은 필수예요. 방수 소재 아우터를 챙기세요.", "비 오는 날엔 밝은 컬러로 기분을 올려보세요.", "스웨이드·패브릭 슈즈는 오늘 쉬게 해주세요."],
  snow:    ["방한 레이어링이 핵심이에요. 목도리 챙기세요.", "어두운 컬러 코트에 흰 니트 조합 추천해요.", "워커나 방수 부츠로 발을 따뜻하게 하세요."],
  cold:    ["체감온도가 낮아요. 히트텍 이너를 꼭 챙기세요.", "두꺼운 한 겹보다 얇은 여러 겹이 더 따뜻해요.", "목·손목·발목, 3곳만 막아도 체감이 달라요."],
  cool:    ["레이어링 하기 좋은 날씨예요.", "가벼운 재킷이나 가디건 하나면 충분해요.", "일교차가 있으면 접어 넣을 수 있는 아우터가 좋아요."],
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
  if (t > 23) return TIPS.hot;
  return TIPS.default;
}

function getWeekDates() {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

function calcStreak(history) {
  if (!history.length) return 0;
  const dates = new Set(
    history.map((h) => {
      const raw = h.date || "";
      const m = raw.match(/(\d{4})[.\-](\d{1,2})[.\-](\d{1,2})/);
      if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
      return null;
    }).filter(Boolean)
  );
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (dates.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export default function StyleDashboard({ history, condition, temp, theme }) {
  const accent = theme?.accent || "#E8543B";

  const weekDates = useMemo(() => getWeekDates(), []);
  const todayStr = new Date().toISOString().slice(0, 10);

  const historyDates = useMemo(() => {
    const set = new Set();
    history.forEach((h) => {
      const raw = h.date || "";
      const m = raw.match(/(\d{4})[.\-](\d{1,2})[.\-](\d{1,2})/);
      if (m) set.add(`${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`);
    });
    return set;
  }, [history]);

  const streak = useMemo(() => calcStreak(history), [history]);

  const tips = useMemo(() => getTip(condition, temp), [condition, temp]);
  const todayTip = tips[new Date().getDay() % tips.length];

  const recentOutfits = history.slice(0, 3);

  return (
    <div className="mt-6 grid gap-4">

      {/* 이번 주 달력 */}
      <section className="border border-[#E5DED1] bg-[#FAF8F3] p-4">
        <div className="wf-label mb-3 text-[#6B665C]">이번 주 착용 기록</div>
        <div className="grid grid-cols-7 gap-1.5">
          {weekDates.map((date, i) => {
            const worn = historyDates.has(date);
            const isToday = date === todayStr;
            return (
              <div key={date} className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-[#8F897D]">{WEEKDAYS[i]}</span>
                <div
                  className="flex h-8 w-8 items-center justify-center text-xs font-semibold"
                  style={{
                    background: worn ? accent : isToday ? "#F0EBE0" : "transparent",
                    color: worn ? "#FFFDF7" : isToday ? accent : "#A8A296",
                    border: isToday && !worn ? `1.5px solid ${accent}` : "1.5px solid transparent",
                    borderRadius: "4px",
                  }}
                >
                  {new Date(date + "T00:00:00").getDate()}
                </div>
              </div>
            );
          })}
        </div>
        {history.length === 0 && (
          <p className="mt-2 text-xs text-[#A8A296]">"오늘 입었어요 ✓" 버튼으로 기록을 시작해보세요!</p>
        )}
      </section>

      {/* 착용 스트릭 + 오늘의 팁 */}
      <div className="grid grid-cols-2 gap-3">
        <section className="border border-[#E5DED1] bg-[#FAF8F3] p-4">
          <div className="wf-label mb-2 text-[#6B665C]">착용 스트릭</div>
          <div className="flex items-end gap-1.5">
            <span className="text-3xl font-semibold" style={{ color: streak > 0 ? accent : "#A8A296" }}>
              {streak}
            </span>
            <span className="mb-1 text-sm text-[#6B665C]">일 연속</span>
          </div>
          <p className="mt-1 text-xs text-[#8F897D]">
            {streak === 0 ? "오늘 기록을 시작해보세요!" : streak >= 7 ? "대단해요! 일주일 연속 기록 중!" : streak >= 3 ? "잘 하고 있어요! 계속 이어가요!" : "좋은 시작이에요!"}
          </p>
        </section>

        <section className="border border-[#E5DED1] bg-[#FAF8F3] p-4">
          <div className="wf-label mb-2 text-[#6B665C]">오늘의 팁</div>
          <p className="text-xs leading-5 text-[#3A362E]">{todayTip}</p>
        </section>
      </div>

      {/* 최근 착용 코디 */}
      {recentOutfits.length > 0 && (
        <section className="border border-[#E5DED1] bg-[#FAF8F3] p-4">
          <div className="wf-label mb-3 text-[#6B665C]">최근 착용 코디</div>
          <div className="grid gap-2">
            {recentOutfits.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between border-l-2 pl-3 text-sm"
                style={{ borderColor: accent }}
              >
                <div>
                  <div className="font-semibold text-[#1A1A1A]">{entry.outfitTitle}</div>
                  <div className="text-xs text-[#8F897D]">
                    {entry.date} · {entry.temp}° · {entry.condition}
                  </div>
                </div>
                <span
                  className="shrink-0 border px-2 py-0.5 text-[10px]"
                  style={{ borderColor: `${accent}44`, color: accent }}
                >
                  {entry.style}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
