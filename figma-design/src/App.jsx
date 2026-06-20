import { useEffect, useMemo, useRef, useState } from "react";
import ChatBot from "./components/ChatBot.jsx";
import ColorText from "./components/ColorText.jsx";
import ColorPalette from "./components/ColorPalette.jsx";
import MonthlyStats from "./components/MonthlyStats.jsx";
import StyleDashboard from "./components/StyleDashboard.jsx";
import TodayColorPalette from "./components/TodayColorPalette.jsx";
import SeasonChecklist from "./components/SeasonChecklist.jsx";
import TempHistory from "./components/TempHistory.jsx";
import ForecastPanel from "./components/ForecastPanel.jsx";
import HistoryPanel from "./components/HistoryPanel.jsx";
import InsightPanel from "./components/InsightPanel.jsx";
import LookCard from "./components/LookCard.jsx";
import MoodPicker from "./components/MoodPicker.jsx";
import NotificationSettings from "./components/NotificationSettings.jsx";
import OccasionPicker, { OCCASION_DEFS } from "./components/OccasionPicker.jsx";
import OnboardingTutorial from "./components/OnboardingTutorial.jsx";
import ProfileSetup from "./components/ProfileSetup.jsx";
import SavedOutfitsPanel from "./components/SavedOutfitsPanel.jsx";
import WardrobePanel from "./components/WardrobePanel.jsx";
import WeatherHero from "./components/WeatherHero.jsx";
import { CITIES } from "./data/cities.js";
import { curate } from "./lib/curate.js";
import { askGeminiForOutfit } from "./lib/gemini.js";
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
  savedOutfits: "weatherfit.savedOutfits",
  history: "weatherfit.history",
  darkMode: "weatherfit.darkMode",
  notifTime: "weatherfit.notifTime",
  tutorialDone: "weatherfit.tutorialDone",
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
  블랙: "#111111", 화이트: "#FFFFFF", 차콜: "#3A3A3A", 그레이: "#9A9A9A",
  아이보리: "#F5F1D8", 크림: "#F2E8CF", 베이지: "#CBB89D", 브라운: "#6B4A34",
  네이비: "#1F2E46", 데님: "#547EA8", 연청: "#AFCFEA", 스카이블루: "#9FC7E8",
  세이지: "#8A9A70", 카키: "#77724F",
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
  const [occasion, setOccasion] = useState("free");
  const [wardrobe, setWardrobe] = useState(() =>
    normalizeWardrobe(readStorage(STORAGE_KEYS.wardrobe, DEFAULT_WARDROBE))
  );
  const [draft, setDraft] = useState(INITIAL_DRAFT);
  const [locks, setLocks] = useState(() => readStorage(STORAGE_KEYS.locks, INITIAL_LOCKS));
  const [appliedLocks, setAppliedLocks] = useState(() =>
    readStorage(STORAGE_KEYS.appliedLocks, INITIAL_LOCKS)
  );
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingSample, setUsingSample] = useState(false);
  const [forecastDay, setForecastDay] = useState(0);
  const [savedOutfits, setSavedOutfits] = useState(() => readStorage(STORAGE_KEYS.savedOutfits, []));
  const [history, setHistory] = useState(() => readStorage(STORAGE_KEYS.history, []));
  const [darkMode, setDarkMode] = useState(() => readStorage(STORAGE_KEYS.darkMode, false));
  const [aiAdvice, setAiAdvice] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [notifTime, setNotifTime] = useState(() => readStorage(STORAGE_KEYS.notifTime, null));
  const [showTutorial, setShowTutorial] = useState(
    () => !readStorage(STORAGE_KEYS.tutorialDone, false)
  );

  // 다크모드 적용
  useEffect(() => {
    document.documentElement.setAttribute("data-dark", darkMode ? "true" : "false");
    localStorage.setItem(STORAGE_KEYS.darkMode, JSON.stringify(darkMode));
  }, [darkMode]);

  // 알림 타이머
  const notifFiredRef = useRef(false);
  useEffect(() => {
    if (!notifTime || typeof Notification === "undefined" || Notification.permission !== "granted") return;
    notifFiredRef.current = false;
    const interval = setInterval(() => {
      const now = new Date();
      const [h, m] = notifTime.split(":").map(Number);
      if (now.getHours() === h && now.getMinutes() === m && !notifFiredRef.current) {
        notifFiredRef.current = true;
        new Notification("WeatherFit", {
          body: `오늘 날씨를 확인하고 코디를 준비해보세요! 🌤️`,
        });
      }
      if (now.getHours() !== h || now.getMinutes() !== m) {
        notifFiredRef.current = false;
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [notifTime]);

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
    setOccasion("free");
    setWardrobe(DEFAULT_WARDROBE);
    setLocks(INITIAL_LOCKS);
    setAppliedLocks(INITIAL_LOCKS);
    setDraft(INITIAL_DRAFT);
    setSavedOutfits([]);
    setHistory([]);
    setForecastDay(0);
  };

  useEffect(() => {
    const selectedCity = CITIES.find((item) => item.name === profile.cityName);
    if (selectedCity) setCity(selectedCity);
    setMood(profile.style);
  }, []);

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.profileDone, JSON.stringify(profileDone)); }, [profileDone]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.wardrobe, JSON.stringify(wardrobe)); }, [wardrobe]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.locks, JSON.stringify(locks)); }, [locks]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.appliedLocks, JSON.stringify(appliedLocks)); }, [appliedLocks]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.savedOutfits, JSON.stringify(savedOutfits)); }, [savedOutfits]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.notifTime, JSON.stringify(notifTime)); }, [notifTime]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setForecastDay(0);

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

    return () => { active = false; };
  }, [city]);

  // 상황(occasion)에 따른 유효 무드
  const effectiveMood = useMemo(() => {
    const def = OCCASION_DEFS.find((o) => o.id === occasion);
    return def?.mood || mood;
  }, [occasion, mood]);

  // 선택한 날짜의 날씨
  const activeWeather = useMemo(() => {
    if (forecastDay === 0 || !weather?.forecast) return weather;
    const f = weather.forecast[forecastDay];
    if (!f) return weather;
    return {
      ...weather,
      temp: Math.round((f.tmax + f.tmin) / 2),
      feels: (f.feelsMax + f.feelsMin) / 2,
      tmax: f.tmax,
      tmin: f.tmin,
      code: f.code,
    };
  }, [weather, forecastDay]);

  const [condition, isWet] = activeWeather ? decodeWeather(activeWeather.code) : ["", false];
  const gap = activeWeather ? activeWeather.tmax - activeWeather.tmin : 0;
  const theme = activeWeather ? themeFor(activeWeather.feels, isWet) : themeFor(18, false);

  const look = useMemo(
    () => activeWeather ? curate({ feels: activeWeather.feels, isWet, gap, mood: effectiveMood, profile }) : null,
    [activeWeather, isWet, gap, effectiveMood, profile]
  );

  const wardrobeRecommendation = useMemo(
    () =>
      activeWeather
        ? recommendWardrobe({ wardrobe, weather: activeWeather, isWet, mood: effectiveMood, profile, locks: appliedLocks })
        : { picked: {}, reasons: [] },
    [wardrobe, activeWeather, isWet, effectiveMood, profile, appliedLocks]
  );

  const appliedLockCount = Object.values(appliedLocks).filter(Boolean).length;
  const fallbackOutfit = look?.outfits?.[0];

  // 코디 저장 토글
  const savedIds = useMemo(() => new Set(savedOutfits.map((s) => s.id)), [savedOutfits]);
  const toggleSaveOutfit = (outfit) => {
    if (savedIds.has(outfit.id)) {
      setSavedOutfits((prev) => prev.filter((s) => s.id !== outfit.id));
    } else {
      const dateStr = new Date().toLocaleDateString("ko-KR");
      setSavedOutfits((prev) =>
        [{ ...outfit, savedDate: dateStr, savedId: `${Date.now()}` }, ...prev].slice(0, 30)
      );
    }
  };
  const removeSavedOutfit = (savedId) => setSavedOutfits((prev) => prev.filter((s) => s.savedId !== savedId));

  // 오늘 입었어요 기록
  const recordWorn = (outfit) => {
    const dateStr = new Date().toLocaleDateString("ko-KR");
    const occasionDef = OCCASION_DEFS.find((o) => o.id === occasion);
    const newEntry = {
      id: `${Date.now()}`,
      date: dateStr,
      outfitTitle: outfit.title,
      style: effectiveMood,
      occasion,
      occasionLabel: occasionDef?.label || "자유",
      city: city.name,
      temp: `${Math.round(activeWeather?.temp || 0)}°`,
      condition,
    };
    // 오늘 기록이 있으면 교체, 없으면 추가
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.date !== dateStr);
      return [newEntry, ...filtered].slice(0, 60);
    });
  };
  const removeHistory = (id) => setHistory((prev) => prev.filter((h) => h.id !== id));

  // 날씨·상황 바뀌면 AI 조언 초기화
  useEffect(() => { setAiAdvice(null); }, [forecastDay, occasion, city]);

  const handleAskAI = async () => {
    if (!activeWeather || !look) return;
    setAiLoading(true);
    setAiAdvice(null);
    try {
      const advice = await askGeminiForOutfit({
        weather: activeWeather,
        profile,
        look,
        wardrobe,
        occasion,
        condition,
      });
      setAiAdvice(advice);
    } catch (err) {
      setAiAdvice(`오류: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  // 계절 정리 알림
  const seasonAlert = useMemo(() => {
    if (!activeWeather || wardrobe.length < 3) return null;
    const temp = activeWeather.feels;
    const summerCount = wardrobe.filter((i) => i.warmth === "summer").length;
    const warmCount = wardrobe.filter((i) => i.warmth === "warm").length;
    const ratio = wardrobe.length;
    if (temp < 10 && summerCount / ratio > 0.35)
      return "옷장에 여름옷이 많아요 — 두꺼운 옷을 앞으로 꺼낼 때가 됐어요 🧥";
    if (temp > 25 && warmCount / ratio > 0.35)
      return "옷장에 두꺼운 옷이 많아요 — 가벼운 여름옷으로 교체를 고려해보세요 👕";
    return null;
  }, [activeWeather, wardrobe]);

  const forecastDate =
    weather?.forecast?.[forecastDay]?.date.slice(5).replace("-", "월 ") + "일";
  const weatherSummary = activeWeather
    ? `${city.name} ${condition} ${Math.round(activeWeather.temp)}°`
    : "";

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
    <main className="figma-shell min-h-screen px-4 py-6 text-ink sm:px-6 lg:px-8">
      {showTutorial && (
        <OnboardingTutorial
          onClose={() => {
            setShowTutorial(false);
            localStorage.setItem(STORAGE_KEYS.tutorialDone, "true");
          }}
        />
      )}

      <div className="figma-content mx-auto max-w-[1220px]">

        {/* 상단 배너 */}
        <div className="mb-5 flex items-center justify-between border border-ink bg-[#1A1A1A] px-6 py-5 text-[#FFFDF7]">
          <span className="wf-label text-[#FFFDF7]" style={{ fontSize: "15px", letterSpacing: "0.1em" }}>날씨가 코디를 결정한다</span>
          <span className="text-[#D8D0C2]" style={{ fontSize: "15px" }}>
            {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
          </span>
        </div>

        {loading && (
          <div className="border-t border-ink pt-24 text-center text-sm text-[#9A958B]">
            날씨를 불러오는 중...
          </div>
        )}

        {!loading && weather && look && (
          <>
            <WeatherHero
              data={activeWeather}
              condition={condition}
              gap={gap}
              theme={theme}
              city={city}
              onCityChange={setCity}
              cities={CITIES}
              profile={profile}
              onEditProfile={() => setProfileDone(false)}
              onResetSavedData={resetSavedData}
              darkMode={darkMode}
              onToggleDark={() => setDarkMode((d) => !d)}
            />

            <ForecastPanel
              forecast={weather.forecast}
              selectedDay={forecastDay}
              onSelectDay={setForecastDay}
              theme={theme}
            />

            <OccasionPicker occasion={occasion} onOccasionChange={setOccasion} theme={theme} />
            <MoodPicker mood={mood} onMoodChange={setMood} theme={theme} />

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(380px,0.88fr)]">
              <div className="min-w-0">
                {appliedLockCount > 0 && (
                  <section className="wf-card mt-6 p-5 sm:p-6">
                    <div className="wf-label text-[#6B665C]">내 옷장 코디 결과</div>
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
                          ? appliedLocks[item.category] === item.id ? " · 고정" : ""
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

                <LookCard
                  look={look}
                  theme={theme}
                  onSave={toggleSaveOutfit}
                  savedIds={savedIds}
                  forecastDay={forecastDay}
                  forecastDate={forecastDate}
                  onWorn={recordWorn}
                  weatherSummary={weatherSummary}
                  onAskAI={handleAskAI}
                  aiAdvice={aiAdvice}
                  aiLoading={aiLoading}
                  weather={activeWeather}
                  condition={condition}
                  history={history}
                />
                <InsightPanel look={look} />
                <SavedOutfitsPanel savedOutfits={savedOutfits} onRemove={removeSavedOutfit} />
                <HistoryPanel history={history} onRemove={removeHistory} />
                <MonthlyStats history={history} wardrobe={wardrobe} />
                <StyleDashboard
                  history={history}
                  condition={condition}
                  temp={Math.round(activeWeather?.temp || 0)}
                  theme={theme}
                />
                <TodayColorPalette
                  condition={condition}
                  temp={Math.round(activeWeather?.temp || 0)}
                  profile={profile}
                  theme={theme}
                />
                <SeasonChecklist
                  profile={profile}
                  condition={condition}
                  temp={Math.round(activeWeather?.temp || 0)}
                  theme={theme}
                />
                <TempHistory
                  history={history}
                  theme={theme}
                />
              </div>

              <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
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
                  seasonAlert={seasonAlert}
                />
                <div className="wf-card-soft mt-4 p-4">
                  <NotificationSettings
                    notifTime={notifTime}
                    onSave={setNotifTime}
                    condition={condition}
                    temp={Math.round(activeWeather?.temp || 0)}
                  />
                </div>
              </aside>
            </div>

            <div className="mt-8 border-t border-[#E5DED1] pt-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-xs text-[#8F897D]">
              <p>
                {usingSample
                  ? "실시간 호출에 실패해 샘플 데이터로 표시 중입니다."
                  : "실시간 날씨 · Open-Meteo · Groq AI"}
                {" · "}
                <button
                  type="button"
                  className="underline underline-offset-2"
                  onClick={() => setShowTutorial(true)}
                >
                  사용 가이드
                </button>
              </p>
              <p className="flex items-center gap-2">
                <span>WeatherFit © 2026</span>
                <span>·</span>
                <span>Designed & Developed by</span>
                <a
                  href="https://github.com/eunno-kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#1A1A1A] underline underline-offset-2 hover:text-[#E8543B] transition-colors"
                >
                  korea_j
                </a>
              </p>
            </div>

            <ChatBot
              weather={activeWeather}
              profile={profile}
              look={look}
              wardrobe={wardrobe}
              occasion={occasion}
              condition={condition}
              theme={theme}
            />
          </>
        )}
      </div>
    </main>
  );
}
