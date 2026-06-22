export const SAMPLE_WEATHER = {
  city: "서울",
  temp: 18.4,
  feels: 17.1,
  humidity: 52,
  code: 2,
  tmax: 22,
  tmin: 11,
  uvIndex: 6,
  uvHourly: [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map((h) => ({
    hour: h,
    time: `${String(h).padStart(2, "0")}:00`,
    uv: [0,0,0,1,2,3,5,7,8,7,6,4,2,1,0,0,0,0][h - 6] ?? 0,
  })),
  pm10: 45,
  pm25: 18,
  forecast: Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() + i * 86400000);
    return {
      date: d.toISOString().slice(0, 10),
      tmax: Math.round(22 - i * 0.5),
      tmin: Math.round(11 + i * 0.3),
      code: i === 2 ? 61 : i === 4 ? 63 : 1,
      precipProb: i === 2 ? 75 : i === 4 ? 60 : 10,
      feelsMax: Math.round(21 - i * 0.5),
      feelsMin: Math.round(10 + i * 0.3),
    };
  }),
};

const WEATHER_CODES = {
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

export function decodeWeather(code) {
  return WEATHER_CODES[code] || ["흐림", false];
}

// 한국 환경부 기준
export function dustLevel(pm10, pm25) {
  const pm10Label = pm10 <= 30 ? "좋음" : pm10 <= 80 ? "보통" : pm10 <= 150 ? "나쁨" : "매우나쁨";
  const pm25Label = pm25 <= 15 ? "좋음" : pm25 <= 35 ? "보통" : pm25 <= 75 ? "나쁨" : "매우나쁨";
  const colorMap = { 좋음: "#4CAF50", 보통: "#FFC107", 나쁨: "#FF9800", 매우나쁨: "#F44336" };
  return {
    pm10Label, pm10Color: colorMap[pm10Label],
    pm25Label, pm25Color: colorMap[pm25Label],
  };
}

export async function fetchWeather(city) {
  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
  weatherUrl.search = new URLSearchParams({
    latitude: city.lat,
    longitude: city.lon,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code",
    hourly: "uv_index",
    daily:
      "weather_code,precipitation_probability_max,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min",
    timezone: "auto",
    forecast_days: "7",
  });

  const airUrl = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  airUrl.search = new URLSearchParams({
    latitude: city.lat,
    longitude: city.lon,
    hourly: "pm10,pm2_5",
    timezone: "auto",
    forecast_days: "1",
  });

  const [weatherRes, airRes] = await Promise.all([
    fetch(weatherUrl),
    fetch(airUrl).catch(() => null),
  ]);
  if (!weatherRes.ok) throw new Error("날씨 정보를 불러오지 못했습니다.");

  const json = await weatherRes.json();
  const d = json.daily;
  const h = json.hourly;

  const todayStr = new Date().toISOString().slice(0, 10);
  const currentHour = new Date().getHours();

  const uvHourly = h.time
    .map((t, i) => ({ t, uv: h.uv_index[i] ?? 0 }))
    .filter(({ t }) => t.startsWith(todayStr))
    .map(({ t, uv }) => ({
      hour: parseInt(t.slice(11, 13)),
      time: t.slice(11, 16),
      uv: Math.round(uv * 10) / 10,
    }));

  const currentUVEntry = uvHourly.find((e) => e.hour === currentHour);
  const uvIndex = currentUVEntry?.uv ?? uvHourly[Math.min(12, uvHourly.length - 1)]?.uv ?? 0;

  let pm10 = null;
  let pm25 = null;
  if (airRes?.ok) {
    const airJson = await airRes.json();
    const ah = airJson.hourly;
    const idx = ah.time.findIndex((t) => parseInt(t.slice(11, 13)) === currentHour);
    const i = idx >= 0 ? idx : Math.min(currentHour, ah.time.length - 1);
    pm10 = Math.round(ah.pm10?.[i] ?? null);
    pm25 = Math.round(ah.pm2_5?.[i] ?? null);
  }

  return {
    city: city.name,
    temp: json.current.temperature_2m,
    feels: json.current.apparent_temperature,
    humidity: json.current.relative_humidity_2m,
    code: json.current.weather_code,
    tmax: d.temperature_2m_max[0],
    tmin: d.temperature_2m_min[0],
    uvIndex,
    uvHourly,
    pm10,
    pm25,
    forecast: d.time.map((date, i) => ({
      date,
      tmax: d.temperature_2m_max[i],
      tmin: d.temperature_2m_min[i],
      code: d.weather_code[i],
      precipProb: d.precipitation_probability_max[i] ?? 0,
      feelsMax: d.apparent_temperature_max[i],
      feelsMin: d.apparent_temperature_min[i],
    })),
  };
}
