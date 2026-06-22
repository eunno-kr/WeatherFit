import { useOpen } from "../lib/useOpen.js";

function uvLevel(uv) {
  if (uv <= 2) return { label: "낮음",    color: "#4CAF50", bg: "#E8F5E9", text: "#2E7D32" };
  if (uv <= 5) return { label: "보통",    color: "#FFC107", bg: "#FFF8E1", text: "#F57F17" };
  if (uv <= 7) return { label: "높음",    color: "#FF9800", bg: "#FFF3E0", text: "#E65100" };
  if (uv <= 10) return { label: "매우높음", color: "#F44336", bg: "#FFEBEE", text: "#B71C1C" };
  return { label: "위험",    color: "#9C27B0", bg: "#F3E5F5", text: "#6A1B9A" };
}

const UV_WARNINGS = [
  { icon: "🧴", text: "자외선 차단제(SPF 30+) 필수, 외출 30분 전 도포 후 2시간마다 재도포" },
  { icon: "🧢", text: "모자·선글라스 착용 — 눈과 두피 자외선 차단" },
  { icon: "🕙", text: "오전 10시 ~ 오후 2시 야외 활동 자제 (자외선 최강 시간대)" },
  { icon: "👕", text: "긴소매·긴바지 또는 UV 차단 소재 의류 착용 권장" },
];

const UV_HIGH_TIPS = [
  { icon: "🧴", text: "자외선 차단제(SPF 50+) 필수, 1~2시간마다 재도포" },
  { icon: "🚫", text: "오전 10시 ~ 오후 2시 야외 활동 최대한 자제" },
  { icon: "🧢", text: "챙 넓은 모자 + UV 차단 선글라스 착용" },
  { icon: "👕", text: "UV 차단 기능성 의류 또는 긴소매 착용 강력 권장" },
];

export default function UVPanel({ uvIndex = 0, uvHourly = [], theme, darkMode }) {
  const accent = theme?.accent || "#E8543B";
  const [open, toggleOpen] = useOpen("uvPanel", true);

  const level = uvLevel(uvIndex);
  const isHigh = uvIndex >= 6;
  const isVeryHigh = uvIndex >= 8;

  const currentHour = new Date().getHours();
  const displayHours = uvHourly.filter((e) => e.hour >= 6 && e.hour <= 20);
  const maxUV = Math.max(...displayHours.map((e) => e.uv), 1);

  const warnings = isVeryHigh ? UV_HIGH_TIPS : UV_WARNINGS;

  return (
    <section className="mt-6 border border-[#E5DED1] bg-[#FAF8F3] p-5">
      {/* 헤더 */}
      <button type="button" onClick={toggleOpen} className="flex w-full items-start justify-between mb-3">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <div className="wf-label text-[#3A362E]" style={{ fontSize: "15px" }}>자외선 지수</div>
            {isHigh && (
              <span
                className="text-[10px] font-bold px-2 py-0.5"
                style={{ background: level.color, color: "#fff", borderRadius: "2px" }}
              >
                {isVeryHigh ? "⚠️ 매우 높음" : "⚠️ 높음"}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-[#4A4540] leading-5">
            오늘 시간대별 자외선 지수와 주의사항을 확인하세요.
          </p>
        </div>
        <span className="ml-3 shrink-0" style={{ fontSize: "15px", border: "0.5px solid #D7D0C4", borderRadius: "4px", padding: "2px 8px", color: "#3A362E" }}>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && <div className="border-t border-[#E5DED1] pt-4 mb-4" />}

      {open && (
        <div>
          {/* 현재 UV 뱃지 */}
          <div className="flex items-center gap-4 mb-5">
            <div
              className="flex flex-col items-center justify-center w-20 h-20 border-2"
              style={{ borderColor: level.color, background: level.bg }}
            >
              <span className="text-3xl font-black leading-none" style={{ color: level.color }}>
                {Math.round(uvIndex)}
              </span>
              <span className="text-xs font-bold mt-1" style={{ color: level.text }}>
                {level.label}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: darkMode ? "#DDD7CC" : "#1A1A1A" }}>
                현재 자외선 지수 {uvIndex.toFixed(1)}
              </p>
              <div className="mt-2 flex gap-2 flex-wrap">
                {[
                  { range: "0–2", label: "낮음",    color: "#4CAF50" },
                  { range: "3–5", label: "보통",    color: "#FFC107" },
                  { range: "6–7", label: "높음",    color: "#FF9800" },
                  { range: "8–10", label: "매우높음", color: "#F44336" },
                  { range: "11+", label: "위험",    color: "#9C27B0" },
                ].map((lv) => (
                  <span key={lv.label} className="flex items-center gap-1 text-xs text-[#3A362E]">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ background: lv.color }} />
                    {lv.range} {lv.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 시간별 그래프 */}
          {displayHours.length > 0 && (
            <div className="mb-5">
              <div className="wf-label mb-3 text-[#3A362E]" style={{ fontSize: "15px" }}>시간대별 자외선</div>
              <div className="flex items-end gap-1" style={{ height: "80px" }}>
                {displayHours.map((e) => {
                  const lv = uvLevel(e.uv);
                  const heightPct = maxUV > 0 ? (e.uv / maxUV) * 100 : 0;
                  const isCurrent = e.hour === currentHour;
                  return (
                    <div key={e.hour} className="flex flex-col items-center flex-1 gap-1">
                      <span className="text-[9px] font-bold" style={{ color: isCurrent ? level.color : "transparent" }}>
                        {e.uv > 0 ? e.uv : ""}
                      </span>
                      <div className="w-full flex items-end" style={{ height: "52px" }}>
                        <div
                          className="w-full transition-all"
                          style={{
                            height: `${Math.max(heightPct, 4)}%`,
                            background: lv.color,
                            opacity: isCurrent ? 1 : 0.6,
                            outline: isCurrent ? `2px solid ${lv.color}` : "none",
                            outlineOffset: "1px",
                          }}
                        />
                      </div>
                      <span className="text-[9px]" style={{ color: darkMode ? "#9e9890" : "#A09A90" }}>
                        {e.hour}시
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 경고 패널 (UV >= 6) */}
          {isHigh && (
            <div
              className="border-l-4 pl-4 py-3 pr-3"
              style={{ borderColor: level.color, background: level.bg }}
            >
              <p className="text-sm font-bold mb-2" style={{ color: level.text }}>
                {isVeryHigh ? "⚠️ 자외선 매우 높음 — 외출 시 주의 필수" : "⚠️ 자외선 높음 — 외출 시 주의하세요"}
              </p>
              <ul className="space-y-1.5">
                {warnings.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-5" style={{ color: level.text }}>
                    <span>{w.icon}</span>
                    <span>{w.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* UV 낮을 때 안내 */}
          {!isHigh && (
            <p className="text-sm text-[#4A4540] leading-5">
              현재 자외선 지수가 낮아 야외 활동에 무리가 없어요.
              {uvIndex >= 3 && " 장시간 외출 시에는 자외선 차단제를 챙기세요."}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
