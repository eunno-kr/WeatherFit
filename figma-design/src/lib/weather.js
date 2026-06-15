export const SAMPLE_WEATHER = {
  city: "서울",
  temp: 18.4,
  feels: 17.1,
  humidity: 52,
  code: 2,
  tmax: 22,
  tmin: 11,
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
    daily: "temperature_2m_max,temperature_2m_min",
    timezone: "auto",
  });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("날씨 정보를 불러오지 못했습니다.");
  }

  const json = await response.json();
  return {
    city: city.name,
    temp: json.current.temperature_2m,
    feels: json.current.apparent_temperature,
    humidity: json.current.relative_humidity_2m,
    code: json.current.weather_code,
    tmax: json.daily.temperature_2m_max[0],
    tmin: json.daily.temperature_2m_min[0],
  };
}
