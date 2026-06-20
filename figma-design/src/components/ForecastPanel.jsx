import { decodeWeather } from "../lib/weather.js";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function weatherIcon(code) {
  if (code <= 1) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌦️";
  return "⛈️";
}

export default function ForecastPanel({ forecast, selectedDay, onSelectDay, theme }) {
  if (!forecast?.length) return null;

  const tomorrow = forecast[1];
  const tomorrowRain = tomorrow && tomorrow.precipProb >= 50;

  return (
    <section className="mt-5">
      {tomorrowRain && (
        <div
          className="mb-3 flex items-center gap-2 border px-4 py-2.5 text-sm"
          style={{ borderColor: theme.accent, background: `${theme.accent}15`, color: theme.accent }}
        >
          <span>☂️</span>
          <span>
            내일 강수 확률 {tomorrow.precipProb}% — 방수 아이템을 미리 준비하세요
          </span>
        </div>
      )}

      <div className="wf-label mb-2 text-[#6B665C]">WEEKLY FORECAST</div>
      <div className="forecast-scroll">
      <div className="forecast-grid">
        {forecast.map((day, i) => {
          const date = new Date(day.date + "T12:00:00");
          const label = i === 0 ? "오늘" : i === 1 ? "내일" : WEEKDAYS[date.getDay()];
          const selected = selectedDay === i;
          const [condition] = decodeWeather(day.code);

          return (
            <button
              key={day.date}
              type="button"
              onClick={() => onSelectDay(i)}
              title={condition}
              className="flex flex-col items-center gap-1 border py-2.5 px-1 text-xs transition"
              style={{
                borderColor: selected ? "#1A1A1A" : "#E5DED1",
                background: selected ? "#1A1A1A" : "#FAF8F3",
                color: selected ? "#FFFDF7" : "#3A362E",
              }}
            >
              <span className="font-semibold">{label}</span>
              <span className="text-lg leading-none">{weatherIcon(day.code)}</span>
              <span
                className="font-semibold"
                style={{ color: selected ? "#FFFDF7" : theme.accent }}
              >
                {Math.round(day.tmax)}°
              </span>
              <span style={{ opacity: 0.55 }}>{Math.round(day.tmin)}°</span>
              {day.precipProb >= 20 && (
                <span
                  className="text-[10px]"
                  style={{ color: selected ? "#9FC7E8" : "#547EA8" }}
                >
                  {day.precipProb}%
                </span>
              )}
            </button>
          );
        })}
      </div>
      </div>

      {selectedDay > 0 && forecast[selectedDay] && (
        <p className="mt-2 text-xs text-[#6B665C]">
          {forecast[selectedDay].date.slice(5).replace("-", "월 ")}일 날씨 기준 코디를 보여줍니다.{" "}
          <button
            type="button"
            onClick={() => onSelectDay(0)}
            className="underline underline-offset-2"
          >
            오늘로 돌아가기
          </button>
        </p>
      )}
    </section>
  );
}
