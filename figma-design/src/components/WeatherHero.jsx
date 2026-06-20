const STYLE_KO = {
  minimal: "미니멀", street: "스트릿", casual: "캐주얼", office: "오피스", outdoor: "아웃도어",
};
const COLOR_KO = {
  neutral: "뉴트럴", warm: "웜톤", cool: "쿨톤", vivid: "비비드",
};
const SENSITIVITY_KO = {
  sensitive: "추위 탐", normal: "보통", resilient: "더위 탐",
};
const SEASON_KO = () => {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return "봄";
  if (m >= 6 && m <= 8) return "여름";
  if (m >= 9 && m <= 11) return "가을";
  return "겨울";
};

export default function WeatherHero({
  data,
  condition,
  gap,
  theme,
  city,
  onCityChange,
  cities,
  profile,
  onEditProfile,
  onResetSavedData,
  darkMode,
  onToggleDark,
}) {
  const genderLabel = profile.gender === "male" ? "남성" : profile.gender === "female" ? "여성" : "공용";
  const season = SEASON_KO();

  return (
    <section className="pt-2">
      <div className="flex flex-col gap-5 border-b-2 border-ink pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="brand-wordmark text-[34px] sm:text-[46px]">
            WEATHER<span style={{ color: theme.accent }}>FIT</span>
          </div>
          <p className="mt-2 max-w-[560px] text-sm leading-6 text-[#5E594F]">
            날씨, 취향, 옷장을 함께 읽어 오늘 입을 수 있는 코디를 정리합니다.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={city.name}
            onChange={(event) => onCityChange(cities.find((item) => item.name === event.target.value))}
            className="border border-ink bg-[#FFFDF7] px-3 py-2 text-sm outline-none"
          >
            {cities.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <button type="button" onClick={onEditProfile} className="border border-[#1A1A1A] bg-[#FFFDF7] px-3 py-2 text-sm">
            프로필
          </button>
          <button type="button" onClick={onResetSavedData} className="border border-[#D7D0C4] bg-[#FFFDF7] px-3 py-2 text-sm text-[#6B665C]">
            초기화
          </button>
          <button
            type="button"
            onClick={onToggleDark}
            className="border border-[#D7D0C4] bg-[#FFFDF7] px-3 py-2 text-sm text-[#6B665C]"
            title={darkMode ? "라이트모드" : "다크모드"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
        <div className="wf-card overflow-hidden p-0">
          <div className="grid min-h-[260px] sm:grid-cols-[0.92fr_1.08fr]">
            <div className="flex flex-col justify-between border-b border-ink bg-[#1A1A1A] p-5 text-[#FFFDF7] sm:border-b-0 sm:border-r">
              <div className="wf-label text-[#E8543B]">
                {theme.name} · {data.city} · {profile.age} · {genderLabel}
              </div>
              <div>
                <div className="font-display text-[104px] font-black leading-[0.82] sm:text-[132px]">
                  {Math.round(data.temp)}°
                </div>
                <p className="mt-3 text-sm leading-6 text-[#D8D0C2]">날씨 기반 스타일 리포트</p>
              </div>
            </div>
            <div className="flex flex-col justify-between bg-[#FFFDF7] p-5 sm:p-6">
              <div>
                <div className="wf-label" style={{ color: theme.accent }}>
                  오늘 날씨
                </div>
                <h2 className="mt-2 text-2xl font-semibold">{condition}</h2>
                <div className="mt-3 text-sm leading-7 text-[#3A362E]">
                  <div>체감 {Math.round(data.feels)}° · 습도 {data.humidity}%</div>
                  <div>
                    최저 {Math.round(data.tmin)}° / 최고 {Math.round(data.tmax)}°
                    {gap >= 8 && <span style={{ color: theme.accent }}> · 일교차 큼</span>}
                  </div>
                  {gap >= 10 && (
                    <div className="mt-2 text-xs font-semibold" style={{ color: theme.accent }}>
                      ⚠️ 일교차 {Math.round(gap)}° — 벗고 입기 쉬운 레이어 필수
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-5 border-t border-[#E5DED1] pt-4 text-sm leading-6 text-[#6B665C]">
                현재 날씨 기준으로 소재 두께, 색 조합, 고정 아이템까지 함께 계산합니다.
              </p>
            </div>
          </div>

          {/* ── 1번: 최저/최고/일교차 바 ── */}
          <div className="grid grid-cols-3 border-t border-[#1A1A1A] bg-[#FAF8F3]">
            {[
              { label: "최저", value: `${Math.round(data.tmin)}°` },
              { label: "최고", value: `${Math.round(data.tmax)}°` },
              { label: "일교차", value: `${Math.round(gap)}°` },
            ].map(({ label, value }, i) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center gap-1 py-5"
                style={{ borderRight: i < 2 ? "1px solid #E5DED1" : "none" }}
              >
                <div className="wf-label text-[#A09A90]">{label}</div>
                <strong className="mt-1 text-2xl font-semibold tracking-tight text-ink">
                  {value}
                </strong>
              </div>
            ))}
          </div>
        </div>

        {/* ── 2번: 스타일 프로필 ── */}
        <div className="wf-card-soft flex flex-col p-5 sm:p-6">
          <div className="wf-label text-[#6B665C]">스타일 프로필</div>

          <div className="mt-4 grid grid-cols-2 gap-0">
            {[
              { label: "스타일", value: STYLE_KO[profile.style] || profile.style },
              { label: "색감", value: COLOR_KO[profile.colorTone] || profile.colorTone },
              { label: "온도 민감도", value: SENSITIVITY_KO[profile.sensitivity] || profile.sensitivity },
              { label: "성별", value: genderLabel },
              { label: "나이대", value: profile.age || "-" },
              { label: "계절", value: season },
              { label: "현재 날씨", value: condition },
              { label: "위치", value: data.city || city.name },
            ].map(({ label, value }, i) => (
              <div
                key={label}
                className="py-3 px-1"
                style={{ borderBottom: i < 6 ? "1px solid #EFE8DA" : "none" }}
              >
                <div className="text-xs text-[#8F897D]">{label}</div>
                <div className="mt-1 text-base font-semibold leading-snug">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-[#E5DED1]">
            <p className="text-xs leading-5 text-[#8F897D]">
              프로필, 옷장, 고정 선택은 이 브라우저에 저장됩니다.
            </p>
            <button
              type="button"
              onClick={onEditProfile}
              className="mt-2 text-xs font-semibold underline underline-offset-2"
              style={{ color: theme.accent }}
            >
              프로필 편집 →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
