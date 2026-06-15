const AGE_OPTIONS = ["10대", "20대", "30대", "40대+"];
const GENDER_OPTIONS = [
  ["unisex", "공용"],
  ["male", "남성"],
  ["female", "여성"],
];
const STYLE_OPTIONS = [
  ["minimal", "미니멀"],
  ["casual", "캐주얼"],
  ["street", "스트릿"],
  ["formal", "포멀"],
  ["sporty", "스포티"],
];
const SENSITIVITY_OPTIONS = [
  ["normal", "보통"],
  ["cold", "추위를 많이 탐"],
  ["heat", "더위를 많이 탐"],
];
const COLOR_OPTIONS = [
  ["neutral", "무채색"],
  ["bright", "밝은 톤"],
  ["calm", "차분한 톤"],
  ["point", "포인트 컬러"],
];
const MAIN_COLOR_OPTIONS = [
  ["auto", "추천 색상"],
  ["ivory", "아이보리"],
  ["skyblue", "스카이블루"],
  ["butter", "버터 옐로"],
  ["sage", "세이지"],
  ["navy", "네이비"],
  ["black", "블랙"],
  ["custom", "직접 입력"],
];

function ChoiceGroup({ label, options, value, onChange, accent }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold text-[#6B665C]">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const id = Array.isArray(option) ? option[0] : option;
          const text = Array.isArray(option) ? option[1] : option;
          const selected = value === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className="border px-3 py-2 text-sm transition"
              style={{
                borderColor: selected ? accent : "#D7D0C4",
                background: selected ? accent : "transparent",
                color: selected ? "#fff" : "#3A362E",
              }}
            >
              {text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ProfileSetup({ profile, setProfile, cities, onStart }) {
  const accent = "#7C8B5A";

  return (
    <main className="min-h-screen bg-paper px-5 py-8 text-ink">
      <section className="mx-auto max-w-[760px]">
        <div className="border-b border-ink pb-5">
          <div className="font-display text-[13px] font-bold text-[#7C8B5A]">WEATHERFIT PROFILE</div>
          <h1 className="mt-3 max-w-[620px] text-3xl font-semibold leading-tight">
            오늘 날씨와 나의 취향을 함께 읽는 스타일 프로필
          </h1>
          <p className="mt-3 max-w-[600px] text-sm leading-6 text-[#6B665C]">
            민감한 개인정보가 아니라 추천 정확도를 높이기 위한 취향 설정입니다. 선택값은 현재 화면에서만
            사용하고, 로그인이나 저장 기능은 다음 단계에서 확장할 수 있습니다.
          </p>
        </div>

        <div className="mt-6 grid gap-5 border border-[#D7D0C4] bg-[#FFFDF7] p-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold text-[#6B665C]">위치</label>
            <select
              value={profile.cityName}
              onChange={(event) => setProfile({ ...profile, cityName: event.target.value })}
              className="w-full border border-[#D7D0C4] bg-transparent px-3 py-2 text-sm outline-none"
            >
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <ChoiceGroup
            label="나이대"
            options={AGE_OPTIONS}
            value={profile.age}
            onChange={(age) => setProfile({ ...profile, age })}
            accent={accent}
          />
          <ChoiceGroup
            label="성별"
            options={GENDER_OPTIONS}
            value={profile.gender}
            onChange={(gender) => setProfile({ ...profile, gender })}
            accent={accent}
          />
          <ChoiceGroup
            label="선호 스타일"
            options={STYLE_OPTIONS}
            value={profile.style}
            onChange={(style) => setProfile({ ...profile, style })}
            accent={accent}
          />
          <ChoiceGroup
            label="온도 민감도"
            options={SENSITIVITY_OPTIONS}
            value={profile.sensitivity}
            onChange={(sensitivity) => setProfile({ ...profile, sensitivity })}
            accent={accent}
          />
          <ChoiceGroup
            label="색감 선호"
            options={COLOR_OPTIONS}
            value={profile.colorTone}
            onChange={(colorTone) => setProfile({ ...profile, colorTone })}
            accent={accent}
          />
          <ChoiceGroup
            label="주요 컬러"
            options={MAIN_COLOR_OPTIONS}
            value={profile.mainColor || "auto"}
            onChange={(mainColor) => setProfile({ ...profile, mainColor })}
            accent={accent}
          />
          {profile.mainColor === "custom" && (
            <label className="grid gap-2 text-xs font-semibold text-[#6B665C]">
              직접 입력 컬러
              <input
                value={profile.customColor || ""}
                onChange={(event) => setProfile({ ...profile, customColor: event.target.value })}
                placeholder="예: 라벤더, 민트, 버건디"
                className="w-full border border-[#D7D0C4] bg-transparent px-3 py-2 text-sm font-normal text-ink outline-none"
              />
            </label>
          )}
        </div>

        <button
          type="button"
          onClick={onStart}
          className="mt-6 w-full bg-ink px-5 py-4 text-sm font-semibold text-white sm:w-auto"
        >
          내 프로필로 오늘 코디 보기
        </button>
      </section>
    </main>
  );
}
