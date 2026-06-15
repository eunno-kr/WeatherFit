import React, { useState, useEffect, useMemo } from "react";

// ─────────────────────────────────────────────────────────────
// WeatherFit — 날씨 기반 코디 큐레이션 (프로토타입)
// 외부 API: Open-Meteo (키 불필요, 무료, CORS open)
// ─────────────────────────────────────────────────────────────

const CITIES = [
  { name: "서울", lat: 37.5665, lon: 126.978 },
  { name: "부산", lat: 35.1796, lon: 129.0756 },
  { name: "대구", lat: 35.8714, lon: 128.6014 },
  { name: "인천", lat: 37.4563, lon: 126.7052 },
  { name: "대전", lat: 36.3504, lon: 127.3845 },
  { name: "광주", lat: 35.1595, lon: 126.8526 },
  { name: "제주", lat: 33.4996, lon: 126.5312 },
];

const MOODS = [
  { id: "minimal", label: "미니멀" },
  { id: "casual", label: "캐주얼" },
  { id: "street", label: "스트릿" },
];

// 날씨 코드 → 한글 라벨 + 비/눈 여부
function decodeWeather(code) {
  const map = {
    0: ["맑음", false],
    1: ["대체로 맑음", false],
    2: ["구름 조금", false],
    3: ["흐림", false],
    45: ["안개", false],
    48: ["짙은 안개", false],
    51: ["약한 이슬비", true],
    53: ["이슬비", true],
    55: ["강한 이슬비", true],
    61: ["약한 비", true],
    63: ["비", true],
    65: ["강한 비", true],
    71: ["약한 눈", true],
    73: ["눈", true],
    75: ["강한 눈", true],
    80: ["소나기", true],
    81: ["소나기", true],
    82: ["강한 소나기", true],
    95: ["천둥번개", true],
  };
  return map[code] || ["흐림", false];
}

// ── 코디 큐레이션 엔진 ──────────────────────────────────────────
// 체감온도(apparent) 기준 + 비 + 일교차 + 무드
function curate({ feels, isWet, gap, mood }) {
  // 기온대별 베이스
  const bands = [
    { min: 28, outer: null, top: ["민소매", "반팔 티"], bottom: ["반바지", "린넨 팬츠"], shoes: "샌들·로퍼", note: "가볍고 통기성 좋은 소재로." },
    { min: 23, outer: null, top: ["반팔 티", "얇은 셔츠"], bottom: ["반바지", "면바지"], shoes: "스니커즈", note: "린넨·코튼 위주로 시원하게." },
    { min: 20, outer: "얇은 가디건", top: ["긴팔 티", "얇은 셔츠"], bottom: ["슬랙스", "면바지"], shoes: "스니커즈", note: "아침저녁 대비 겉옷 하나." },
    { min: 17, outer: "얇은 자켓", top: ["맨투맨", "얇은 니트"], bottom: ["청바지", "슬랙스"], shoes: "스니커즈·로퍼", note: "레이어링 시작하기 좋은 날씨." },
    { min: 12, outer: "자켓·야상", top: ["니트", "맨투맨"], bottom: ["청바지", "치노"], shoes: "스니커즈·부츠", note: "겉옷 두께로 온도 조절." },
    { min: 9, outer: "트렌치·야상", top: ["니트", "기모 후드"], bottom: ["청바지"], shoes: "부츠·스니커즈", note: "바람 막아주는 아우터." },
    { min: 5, outer: "코트·가죽자켓", top: ["두꺼운 니트", "히트텍 +상의"], bottom: ["기모 청바지", "슬랙스"], shoes: "부츠", note: "이너로 보온 챙기기." },
    { min: -50, outer: "패딩·두꺼운 코트", top: ["기모 니트", "히트텍 레이어"], bottom: ["기모 팬츠"], shoes: "부츠", note: "목도리·장갑까지." },
  ];
  const band = bands.find((b) => feels >= b.min);

  // 무드별 톤 변형
  const moodTone = {
    minimal: { acc: "무채색·뉴트럴 톤으로 정리. 핏은 깔끔하게.", shoeBias: "로퍼·미니멀 스니커즈" },
    casual: { acc: "데님·코튼 중심의 편안한 데일리룩.", shoeBias: "스니커즈" },
    street: { acc: "오버핏·레이어드로 볼륨감 있게.", shoeBias: "청키 스니커즈·부츠" },
  }[mood];

  let outer = band.outer;
  let top = [...band.top];
  let bottom = [...band.bottom];
  let shoes = moodTone.shoeBias || band.shoes;
  let accessory = "—";
  const reasons = [`체감 ${Math.round(feels)}°`];

  if (mood === "street") {
    top = top.map((t) => `오버핏 ${t}`);
  }
  if (mood === "minimal") {
    accessory = "톤온톤 가방·미니멀 캡";
  } else if (mood === "street") {
    accessory = "캡·크로스백·양말 포인트";
  } else {
    accessory = "에코백·볼캡";
  }

  // 비/눈 오버라이드
  if (isWet) {
    outer = outer ? `방수 ${outer}` : "방수 윈드브레이커";
    shoes = "방수 스니커즈·부츠 (천 소재 피하기)";
    accessory = "우산 필수 · 어두운 톤 추천";
    reasons.push("강수");
  }

  // 일교차
  if (gap >= 8) {
    if (!outer) outer = "얇은 가디건";
    reasons.push(`일교차 ${Math.round(gap)}°`);
  }

  return {
    outer,
    top,
    bottom,
    shoes,
    accessory,
    comment: isWet
      ? `비 소식 있어요. ${moodTone.acc} 발 젖지 않게 슈즈부터 챙기세요.`
      : `${moodTone.acc} ${band.note}`,
    reasons,
  };
}

// 체감온도 → 테마 액센트 (시그니처)
function themeFor(feels, isWet) {
  if (isWet) return { accent: "#4A5468", soft: "#E7E9EE", name: "RAIN" };
  if (feels >= 23) return { accent: "#D9532B", soft: "#F6E5DC", name: "HOT" }; // persimmon 감
  if (feels >= 17) return { accent: "#7C8B5A", soft: "#ECEEE0", name: "MILD" }; // sage
  if (feels >= 9) return { accent: "#5B7A99", soft: "#E2E9EF", name: "COOL" };
  return { accent: "#3E5C73", soft: "#DFE7EC", name: "COLD" }; // steel
}

const SAMPLE = {
  city: "서울",
  temp: 18.4,
  feels: 17.1,
  humidity: 52,
  code: 2,
  tmax: 22.0,
  tmin: 11.0,
};

export default function WeatherFit() {
  const [city, setCity] = useState(CITIES[0]);
  const [mood, setMood] = useState("minimal");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingSample, setUsingSample] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code` +
      `&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
    fetch(url)
      .then((r) => r.json())
      .then((j) => {
        if (!active) return;
        setData({
          city: city.name,
          temp: j.current.temperature_2m,
          feels: j.current.apparent_temperature,
          humidity: j.current.relative_humidity_2m,
          code: j.current.weather_code,
          tmax: j.daily.temperature_2m_max[0],
          tmin: j.daily.temperature_2m_min[0],
        });
        setUsingSample(false);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setData({ ...SAMPLE, city: city.name });
        setUsingSample(true);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [city]);

  const [condLabel, isWet] = data ? decodeWeather(data.code) : ["", false];
  const gap = data ? data.tmax - data.tmin : 0;
  const theme = data ? themeFor(data.feels, isWet) : themeFor(18, false);
  const look = useMemo(
    () => (data ? curate({ feels: data.feels, isWet, gap, mood }) : null),
    [data, isWet, gap, mood]
  );

  return (
    <div
      style={{
        fontFamily:
          "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        background: "#FAF8F3",
        color: "#1A1A1A",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;900&display=swap');
        .mono { font-family: 'Archivo', sans-serif; letter-spacing: .04em; }
        * { box-sizing: border-box; }
        button { cursor: pointer; }
      `}</style>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "28px 20px 64px" }}>
        {/* 헤더 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div className="mono" style={{ fontWeight: 900, fontSize: 22, letterSpacing: "-0.01em" }}>
            WEATHER<span style={{ color: theme.accent }}>FIT</span>
          </div>
          <select
            value={city.name}
            onChange={(e) => setCity(CITIES.find((c) => c.name === e.target.value))}
            style={{
              fontFamily: "inherit", fontSize: 14, padding: "6px 10px",
              border: "1px solid #1A1A1A", background: "transparent", borderRadius: 0,
            }}
          >
            {CITIES.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div style={{ padding: "80px 0", textAlign: "center", color: "#9A958B" }}>
            날씨 불러오는 중…
          </div>
        ) : (
          <>
            {/* 히어로: 오늘의 날씨 */}
            <div style={{ marginTop: 28, borderTop: "1px solid #1A1A1A", paddingTop: 18 }}>
              <div className="mono" style={{ fontSize: 11, color: theme.accent, fontWeight: 700 }}>
                {theme.name} · {data.city}
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginTop: 4 }}>
                <div className="mono" style={{ fontSize: 76, lineHeight: 0.9, fontWeight: 900 }}>
                  {Math.round(data.temp)}°
                </div>
                <div style={{ paddingBottom: 8, fontSize: 14, lineHeight: 1.5 }}>
                  <div>{condLabel}</div>
                  <div style={{ color: "#6B665C" }}>
                    체감 {Math.round(data.feels)}° · 습도 {data.humidity}%
                  </div>
                  <div style={{ color: "#6B665C" }}>
                    {Math.round(data.tmin)}° / {Math.round(data.tmax)}°
                    {gap >= 8 && <span style={{ color: theme.accent }}> · 일교차 큼</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* 무드 선택 */}
            <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
              {MOODS.map((m) => {
                const on = mood === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMood(m.id)}
                    style={{
                      fontFamily: "inherit", fontSize: 13, padding: "8px 16px",
                      border: `1px solid ${on ? theme.accent : "#CFC9BD"}`,
                      background: on ? theme.accent : "transparent",
                      color: on ? "#fff" : "#6B665C", borderRadius: 999,
                      transition: "all .15s",
                    }}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>

            {/* 룩북 카드 */}
            <div
              style={{
                marginTop: 18, background: theme.soft, padding: "22px 22px 26px",
                border: `1px solid ${theme.accent}22`,
              }}
            >
              <div className="mono" style={{ fontSize: 11, fontWeight: 700, color: theme.accent }}>
                TODAY'S LOOK
              </div>

              <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
                <Slot label="아우터" value={look.outer || "불필요"} accent={theme.accent} muted={!look.outer} />
                <Slot label="상의" value={look.top.join(" · ")} accent={theme.accent} />
                <Slot label="하의" value={look.bottom.join(" · ")} accent={theme.accent} />
                <Slot label="슈즈" value={look.shoes} accent={theme.accent} />
                <Slot label="포인트" value={look.accessory} accent={theme.accent} />
              </div>

              <p style={{ marginTop: 18, fontSize: 14, lineHeight: 1.6, color: "#3A362E" }}>
                {look.comment}
              </p>

              <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {look.reasons.map((r) => (
                  <span
                    key={r}
                    className="mono"
                    style={{
                      fontSize: 11, padding: "3px 9px", border: `1px solid ${theme.accent}55`,
                      color: theme.accent, fontWeight: 500,
                    }}
                  >
                    왜? {r}
                  </span>
                ))}
              </div>
            </div>

            <p style={{ marginTop: 18, fontSize: 12, color: "#A8A296", lineHeight: 1.5 }}>
              {usingSample
                ? "※ 실시간 호출 실패 — 샘플 데이터로 표시 중. 배포 환경에선 정상 동작합니다."
                : "실시간 날씨 · Open-Meteo"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Slot({ label, value, accent, muted }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
      <div
        className="mono"
        style={{ width: 56, flexShrink: 0, fontSize: 11, fontWeight: 700, color: accent }}
      >
        {label}
      </div>
      <div style={{ fontSize: 15, color: muted ? "#A8A296" : "#1A1A1A", fontWeight: muted ? 400 : 500 }}>
        {value}
      </div>
    </div>
  );
}
