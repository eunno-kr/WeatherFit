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
}) {
  const genderLabel = profile.gender === "male" ? "남성" : profile.gender === "female" ? "여성" : "공용";

  return (
    <section className="border-t-2 border-ink pt-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="brand-wordmark text-[30px] sm:text-[38px]">
            WEATHER<span style={{ color: theme.accent }}>FIT</span>
          </div>
          <p className="mt-2 max-w-[520px] text-sm leading-6 text-[#6B665C]">
            날씨, 취향, 옷장을 함께 읽어 오늘 입을 수 있는 코디를 정리합니다.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={city.name}
            onChange={(event) => onCityChange(cities.find((item) => item.name === event.target.value))}
            className="border border-ink bg-transparent px-3 py-2 text-sm outline-none"
          >
            {cities.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <button type="button" onClick={onEditProfile} className="border border-[#CFC9BD] px-3 py-2 text-sm">
            프로필
          </button>
          <button type="button" onClick={onResetSavedData} className="border border-[#CFC9BD] px-3 py-2 text-sm">
            초기화
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <div className="border border-ink bg-[#FFFDF7] p-5">
          <div className="font-display text-[11px] font-bold" style={{ color: theme.accent }}>
            {theme.name} · {data.city} · {profile.age} · {genderLabel}
          </div>
          <div className="mt-3 flex items-end gap-4">
            <div className="font-display text-[86px] font-black leading-[0.86] sm:text-[104px]">
              {Math.round(data.temp)}°
            </div>
            <div className="pb-2 text-sm leading-6 text-[#3A362E]">
              <div className="text-base font-semibold text-ink">{condition}</div>
              <div>체감 {Math.round(data.feels)}° · 습도 {data.humidity}%</div>
              <div>
                {Math.round(data.tmin)}° / {Math.round(data.tmax)}°
                {gap >= 8 && <span style={{ color: theme.accent }}> · 일교차 큼</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="border border-[#D7D0C4] bg-[#FFFDF7] p-5">
          <div className="font-display text-[11px] font-bold text-[#6B665C]">STYLE PROFILE</div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-[#8F897D]">스타일</div>
              <div className="mt-1 font-semibold">{profile.style}</div>
            </div>
            <div>
              <div className="text-xs text-[#8F897D]">색감</div>
              <div className="mt-1 font-semibold">{profile.colorTone}</div>
            </div>
            <div>
              <div className="text-xs text-[#8F897D]">민감도</div>
              <div className="mt-1 font-semibold">{profile.sensitivity}</div>
            </div>
            <div>
              <div className="text-xs text-[#8F897D]">저장</div>
              <div className="mt-1 font-semibold">자동</div>
            </div>
          </div>
          <p className="mt-4 border-t border-[#E5DED1] pt-3 text-xs leading-5 text-[#8F897D]">
            프로필, 옷장, 고정 선택은 이 브라우저에 저장됩니다.
          </p>
        </div>
      </div>
    </section>
  );
}
