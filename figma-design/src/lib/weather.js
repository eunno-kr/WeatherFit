export const SAMPLE_WEATHER = {
  city: "서울",
  temp: 18.4,
  feels: 17.1,
  humidity: 52,
  code: 2,
  tmax: 22,
  tmin: 11,
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

export async function fetchWeather(city) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: city.lat,
    longitude: city.lon,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code",
    daily:
      "weather_code,precipitation_probability_max,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min",
    timezone: "auto",
    forecast_days: "7",
  });

  const response = await fetch(url);
  if (!response.ok) throw new Error("날씨 정보를 불러오지 못했습니다.");

  const json = await response.json();
  const d = json.daily;
  return {
    city: city.name,
    temp: json.current.temperature_2m,
    feels: json.current.apparent_temperature,
    humidity: json.current.relative_humidity_2m,
    code: json.current.weather_code,
    tmax: d.temperature_2m_max[0],
    tmin: d.temperature_2m_min[0],
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
