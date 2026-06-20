import { useState, useEffect } from "react";
import { fetchSeasonChecklist } from "../lib/gemini.js";

const STORAGE_KEY = "wf-season-checklist";
const CHECKED_KEY = "wf-season-checklist-checked";

const getSeason = () => {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "fall";
  return "winter";
};

const FALLBACK = {
  spring: [
    { label: "트렌치코트", desc: "봄 필수 아우터, 가볍게 걸치기 좋아요" },
    { label: "린넨 셔츠", desc: "통기성 좋은 소재로 레이어링하기 편해요" },
    { label: "화이트 스니커즈", desc: "봄 코디 마무리의 클래식 아이템" },
    { label: "파스텔 니트", desc: "쌀쌀한 봄 아침·저녁 대비" },
    { label: "크로스백", desc: "가볍고 실용적인 봄 가방" },
  ],
  summer: [
    { label: "린넨 팬츠", desc: "통기성 최고, 여름 필수 하의" },
    { label: "UV 차단 모자", desc: "강한 자외선을 막는 필수 아이템" },
    { label: "오버사이즈 반팔", desc: "편안한 핏으로 시원하게" },
    { label: "샌들 또는 슬리퍼", desc: "더운 날씨엔 발도 시원하게" },
    { label: "선글라스", desc: "눈부심 방지 + 여름 패션 완성" },
  ],
  fall: [
    { label: "체크 패턴 코트", desc: "가을 감성을 대표하는 아우터" },
    { label: "머스타드 또는 카키 니트", desc: "어스톤 코디의 핵심 아이템" },
    { label: "첼시 부츠", desc: "가을부터 겨울까지 활용 가능" },
    { label: "베이지 스카프", desc: "쌀쌀한 아침 레이어링에 필수" },
    { label: "코듀로이 팬츠", desc: "가을 소재의 정석, 따뜻하고 멋스러워요" },
  ],
  winter: [
    { label: "울 코트 또는 롱패딩", desc: "방한의 핵심 아우터, 하나는 필수" },
    { label: "터틀넥 니트", desc: "목 보온과 스타일을 동시에" },
    { label: "히트텍 이너", desc: "레이어링 필수 내의" },
    { label: "니트 비니", desc: "체온 유지 + 겨울 포인트 아이템" },
    { label: "방한 부츠 또는 워커", desc: "발 보온이 체감온도를 크게 바꿔요" },
  ],
};

function getWeekKey() {
  const d = new Date();
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  const y = monday.getFullYear();
  const m = String(monday.getMonth() + 1).padStart(2, "0");
  const day = String(monday.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function loadCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { items, weekKey } = JSON.parse(raw);
    if (weekKey === getWeekKey()) return items;
    return null;
  } catch { return null; }
}

function saveCache(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, weekKey: getWeekKey() }));
  } catch {}
}

function loadChecked() {
  try { return JSON.parse(localStorage.getItem(CHECKED_KEY) || "{}"); } catch { return {}; }
}

function saveChecked(checked) {
  try { localStorage.setItem(CHECKED_KEY, JSON.stringify(checked)); } catch {}
}

export default function SeasonChecklist({ profile, condition, temp, theme }) {
  const [items, setItems] = useState([]);
  const [checked, setChecked] = useState(() => loadChecked());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(true);
  const accent = theme?.accent || "#E8543B";
  const season = getSeason();
  const checkedCount = items.filter((_, i) => checked[i]).length;

  useEffect(() => {
    const cached = loadCache();
    if (cached) { setItems(cached); return; }

    setLoading(true);
    fetchSeasonChecklist({ profile, condition, temp })
      .then((result) => {
        setItems(result);
        saveCache(result);
      })
      .catch(() => {
        setItems(FALLBACK[season]);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggle = (i) => {
    setChecked((prev) => {
      const next = { ...prev, [i]: !prev[i] };
      saveChecked(next);
      return next;
    });
  };

  const seasonLabel = { spring: "봄", summer: "여름", fall: "가을", winter: "겨울" }[season];

  return (
    <section className="mt-4 border border-[#E5DED1] bg-[#FAF8F3] p-5">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between mb-4">
        <div>
          <div className="wf-label text-[#3A362E]" style={{ fontSize: "13px" }}>계절 체크리스트</div>
          <p className="mt-1 text-sm font-medium text-[#6B665C]">
            {error ? "기본 목록 (AI 연결 실패)" : `AI 추천 · 이번 주 ${seasonLabel} 아이템 · 매주 월요일 갱신`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <span className="border px-3 py-1 text-sm font-bold" style={{ borderColor: `${accent}55`, color: accent }}>
              {checkedCount}/{items.length}
            </span>
          )}
          <span style={{ fontSize: "13px", border: "0.5px solid #D7D0C4", borderRadius: "4px", padding: "2px 8px", color: "#6B665C" }}>{open ? "−" : "+"}</span>
        </div>
      </button>

      {open && loading && (
        <div className="flex items-center gap-2.5 py-4 text-sm font-medium text-[#6B665C]">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          AI가 이번 시즌 체크리스트 생성 중...
        </div>
      )}

      {open && !loading && items.map((item, i) => (
        <button
          key={i}
          type="button"
          onClick={() => toggle(i)}
          className="flex w-full items-start gap-3 py-3.5 text-left transition hover:opacity-80"
          style={{ borderBottom: i < items.length - 1 ? "1px solid #EFE8DA" : "none" }}
        >
          <div
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 text-xs font-bold transition"
            style={{
              borderColor: checked[i] ? accent : "#C9C3BB",
              background: checked[i] ? accent : "transparent",
              color: "#FFFDF7",
            }}
          >
            {checked[i] && "✓"}
          </div>
          <div>
            <div
              className="text-base font-semibold leading-6 transition"
              style={{
                color: checked[i] ? "#A8A296" : "#1A1A1A",
                textDecoration: checked[i] ? "line-through" : "none",
              }}
            >
              {item.label}
            </div>
            {item.desc && (
              <div className="mt-0.5 text-sm font-medium text-[#6B665C]">{item.desc}</div>
            )}
          </div>
        </button>
      ))}

      {open && checkedCount === items.length && items.length > 0 && (
        <div
          className="mt-3 border-l-2 pl-3 text-base font-bold"
          style={{ borderColor: accent, color: accent }}
        >
          {seasonLabel} 준비 완료! 🎉
        </div>
      )}
    </section>
  );
}
