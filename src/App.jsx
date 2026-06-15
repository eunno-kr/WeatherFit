import { useEffect, useMemo, useState } from "react";
import ColorText from "./components/ColorText.jsx";
import ColorPalette from "./components/ColorPalette.jsx";
import InsightPanel from "./components/InsightPanel.jsx";
import LookCard from "./components/LookCard.jsx";
import MoodPicker from "./components/MoodPicker.jsx";
import ProfileSetup from "./components/ProfileSetup.jsx";
import WardrobePanel from "./components/WardrobePanel.jsx";
import WeatherHero from "./components/WeatherHero.jsx";
import { CITIES } from "./data/cities.js";
import { curate } from "./lib/curate.js";
import { themeFor } from "./lib/theme.js";
import { decodeWeather, fetchWeather, SAMPLE_WEATHER } from "./lib/weather.js";
import { DEFAULT_WARDROBE, recommendWardrobe } from "./lib/wardrobe.js";

const INITIAL_PROFILE = {
  age: "20대",
  gender: "unisex",
  cityName: "서울",
  style: "minimal",
  sensitivity: "normal",
  colorTone: "neutral",
  mainColor: "auto",
  customColor: "",
};

const INITIAL_DRAFT = {
  name: "",
  category: "top",
  color: "블랙",
  colorHex: "#111111",
  warmth: "light",
  style: "minimal",
  rainOk: false,
};

const INITIAL_LOCKS = {
  outer: "",
  top: "",
  bottom: "",
  shoes: "",
  accessory: "",
};

const STORAGE_KEYS = {
  profile: "weatherfit.profile",
  profileDone: "weatherfit.profileDone",
  wardrobe: "weatherfit.wardrobe",
  locks: "weatherfit.locks",
  appliedLocks: "weatherfit.appliedLocks",
};

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function readProfile() {
  return { ...INITIAL_PROFILE, ...readStorage(STORAGE_KEYS.profile, INITIAL_PROFILE) };
}

const FALLBACK_COLOR_HEX = {
  블랙: "#111111",
  화이트: "#FFFFFF",
  차콜: "#3A3A3A",
  그레이: "#9A9A9A",
  아이보리: "#F5F1D8",
  크림: "#F2E8CF",
  베이지: "#CBB89D",
  브라운: "#6B4A34",
  네이비: "#1F2E46",
  데님: "#547EA8",
  연청: "#AFCFEA",
  스카이블루: "#9FC7E8",
  세이지: "#8A9A70",
  카키: "#77724F",
};

function normalizeWardrobe(items) {
  return items.map((item) => ({
    ...item,
    colorHex:
      item.colorHex ||
      Object.entries(FALLBACK_COLOR_HEX).find(([name]) => item.color?.includes(name))?.[1] ||
      "#CBB89D",
  }));
}

export default function App() {
  const [profile, setProfile] = useState(() => readProfile());
  const [profileDone, setProfileDone] = useState(() => readStorage(STORAGE_KEYS.profileDone, false));
  const [city, setCity] = useState(CITIES[0]);
  const [mood, setMood] = useState(INITIAL_PROFILE.style);
  const [wardrobe, setWardrobe] = useState(() => normalizeWardrobe(readStorage(STORAGE_KEYS.wardrobe, DEFAULT_WARDROBE)));
  const [draft, setDraft] = useState(INITIAL_DRAFT);
  const [locks, setLocks] = useState(() => readStorage(STORAGE_KEYS.locks, INITIAL_LOCKS));
  const [appliedLocks, setAppliedLocks] = useState(() => readStorage(STORAGE_KEYS.appliedLocks, INITIAL_LOCKS));
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingSample, setUsingSample] = useState(false);

  const startWithProfile = () => {
    const selectedCity = CITIES.find((item) => item.name === profile.cityName) || CITIES[0];
    setCity(selectedCity);
    setMood(profile.style);
    setProfileDone(true);
  };

  const resetSavedData = () => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    setProfile(INITIAL_PROFILE);
    setProfileDone(false);
    setCity(CITIES[0]);
    setMood(INITIAL_PROFILE.style);
    setWardrobe(DEFAULT_WARDROBE);
    setLocks(INITIAL_LOCKS);
    setAppliedLocks(INITIAL_LOCKS);
    setDraft(INITIAL_DRAFT);
  };

  useEffect(() => {
    const selectedCity = CITIES.find((item) => item.name === profile.cityName);
    if (selectedCity) setCity(selectedCity);
    setMood(profile.style);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.profileDone, JSON.stringify(profileDone));
  }, [profileDone]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.wardrobe, JSON.stringify(wardrobe));
  }, [wardrobe]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.locks, JSON.stringify(locks));
  }, [locks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.appliedLocks, JSON.stringify(appliedLocks));
  }, [appliedLocks]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchWeather(city)
      .then((nextWeather) => {
        if (!active) return;
        setWeather(nextWeather);
        setUsingSample(false);
      })
      .catch(() => {
        if (!active) return;
        setWeather({ ...SAMPLE_WEATHER, city: city.name });
        setUsingSample(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [city]);

  const [condition, isWet] = weather ? decodeWeather(weather.code) : ["", false];
  const gap = weather ? weather.tmax - weather.tmin : 0;
  const theme = weather ? themeFor(weather.feels, isWet) : themeFor(18, false);
  const look = useMemo(
    () => (weather ? curate({ feels: weather.feels, isWet, gap, mood, profile }) : null),
    [weather, isWet, gap, mood, profile]
  );
  const wardrobeRecommendation = useMemo(
    () =>
      weather
        ? recommendWardrobe({ wardrobe, weather, isWet, mood, profile, locks: appliedLocks })
        : { picked: {}, reasons: [] },
    [wardrobe, weather, isWet, mood, profile, appliedLocks]
  );
  const appliedLockCount = Object.values(appliedLocks).filter(Boolean).length;
  const fallbackOutfit = look?.outfits?.[0];

  if (!profileDone) {
    return (
      <ProfileSetup
        profile={profile}
        setProfile={setProfile}
        cities={CITIES}
        onStart={startWithProfile}
      />
    );
  }

  return (
    <main className="min-h-screen bg-paper px-4 py-6 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        {loading && (
          <div className="border-t border-ink pt-24 text-center text-sm text-[#9A958B]">
            날씨를 불러오는 중...
          </div>
        )}

        {!loading && weather && look && (
          <>
            <WeatherHero
              data={weather}
              condition={condition}
              gap={gap}
              theme={theme}
              city={city}
              onCityChange={setCity}
              cities={CITIES}
              profile={profile}
              onEditProfile={() => setProfileDone(false)}
              onResetSavedData={resetSavedData}
            />
            <MoodPicker mood={mood} onMoodChange={setMood} theme={theme} />
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
              <div className="min-w-0">
                {appliedLockCount > 0 && (
                  <section className="mt-5 border border-ink bg-[#FFFDF7] p-5">
                    <div className="font-display text-[11px] font-bold text-[#6B665C]">WARDROBE RESULT</div>
                    <h2 className="mt-2 text-lg font-semibold">내가 고른 옷으로 다시 맞춘 코디</h2>
                    <div className="mt-4 grid gap-2 text-sm">
                      {[
                        ["아우터", "outer", wardrobeRecommendation.outfit?.outer, fallbackOutfit?.outer],
                        ["상의", "top", wardrobeRecommendation.outfit?.top, fallbackOutfit?.top],
                        ["하의", "bottom", wardrobeRecommendation.outfit?.bottom, fallbackOutfit?.bottom],
                        ["신발", "shoes", wardrobeRecommendation.outfit?.shoes, fallbackOutfit?.shoes],
                        ["포인트", "accessory", wardrobeRecommendation.outfit?.accessory, fallbackOutfit?.accessory],
                      ].map(([label, category, item, fallback]) => {
                        const value = item ? `${item.name} · ${item.color}` : fallback;
                        const colorHex = item?.colorHex;
                        const suffix = item
                          ? appliedLocks[item.category] === item.id
                            ? " · 고정"
                            : ""
                          : "";
                        return (
                          <div key={label} className="grid grid-cols-[56px_1fr] gap-3">
                            <span className="font-semibold text-[#6B665C]">{label}</span>
                            {value ? (
                              <ColorText value={value} suffix={suffix} colorHex={colorHex} />
                            ) : (
                              <span className="text-[#A8A296]">추천 가능한 옷 부족</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 grid gap-1 text-xs leading-5 text-[#6B665C]">
                      {wardrobeRecommendation.reasons.map((reason) => (
                        <p key={reason}>왜? {reason}</p>
                      ))}
                    </div>
                  </section>
                )}
                <LookCard look={look} theme={theme} />
                <InsightPanel look={look} />
              </div>
              <aside className="min-w-0 lg:sticky lg:top-5 lg:self-start">
                <ColorPalette palette={look.palette} />
                <WardrobePanel
                  wardrobe={wardrobe}
                  setWardrobe={setWardrobe}
                  draft={draft}
                  setDraft={setDraft}
                  recommendation={wardrobeRecommendation}
                  locks={locks}
                  setLocks={setLocks}
                  appliedLocks={appliedLocks}
                  setAppliedLocks={setAppliedLocks}
                  fallbackOutfit={fallbackOutfit}
                />
              </aside>
            </div>
            <p className="mt-5 text-xs leading-5 text-[#8F897D]">
              {usingSample
                ? "실시간 호출에 실패해 샘플 데이터로 표시 중입니다. 배포 환경에서는 네트워크 상태를 확인해주세요."
                : "실시간 날씨 · Open-Meteo"}
            </p>
          </>
        )}
      </div>
    </main>
  );
}
