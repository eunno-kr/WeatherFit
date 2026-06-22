import { useMemo, useState } from "react";
import ColorText, { ColorChips } from "./ColorText.jsx";
import { CATEGORY_LABELS_KO } from "../lib/wardrobe.js";

const CATEGORY_OPTIONS = [
  ["outer", "아우터"],
  ["top", "상의"],
  ["bottom", "하의"],
  ["shoes", "신발"],
  ["accessory", "액세서리"],
];

const WARMTH_OPTIONS = [
  ["summer", "여름"],
  ["light", "가벼움"],
  ["middle", "중간"],
  ["warm", "따뜻함"],
  ["all", "사계절"],
];

const STYLE_OPTIONS = [
  ["minimal", "미니멀"],
  ["casual", "캐주얼"],
  ["street", "스트릿"],
  ["formal", "포멀"],
  ["sporty", "스포티"],
];

const COLOR_SWATCHES = [
  ["블랙", "#111111"],
  ["차콜", "#3A3A3A"],
  ["그레이", "#9A9A9A"],
  ["화이트", "#FFFFFF"],
  ["아이보리", "#F5F1D8"],
  ["크림", "#F2E8CF"],
  ["베이지", "#CBB89D"],
  ["브라운", "#6B4A34"],
  ["네이비", "#1F2E46"],
  ["데님", "#547EA8"],
  ["연청", "#AFCFEA"],
  ["스카이블루", "#9FC7E8"],
  ["세이지", "#8A9A70"],
  ["카키", "#77724F"],
  ["버터 옐로", "#F4DF8A"],
  ["레드", "#C9443E"],
  ["라벤더", "#B8A7D9"],
  ["민트", "#A9D8C2"],
];

const MORE_COLOR_SWATCHES = [
  ["오프화이트", "#F7F2E8"],
  ["샌드", "#D8C3A5"],
  ["카멜", "#B88450"],
  ["초콜릿", "#4B2F24"],
  ["버건디", "#7B263A"],
  ["코랄", "#F27D72"],
  ["오렌지", "#E68A3A"],
  ["머스타드", "#C99A2E"],
  ["올리브", "#6F743E"],
  ["포레스트", "#2F5D46"],
  ["틸", "#2B7A78"],
  ["민트그린", "#A9D8C2"],
  ["코발트", "#2257A6"],
  ["로열블루", "#263E9B"],
  ["퍼플", "#7B5FA3"],
  ["라벤더", "#B8A7D9"],
  ["핑크", "#F2A7B5"],
  ["로즈", "#C76D7E"],
  ["실버", "#C9CDD2"],
  ["골드", "#C7A64A"],
];

const COLOR_NAME_TO_HEX = Object.fromEntries([...COLOR_SWATCHES, ...MORE_COLOR_SWATCHES]);

const FILTER_OPTIONS = [["all", "전체"], ...CATEGORY_OPTIONS];

const WARMTH_LABELS = Object.fromEntries(WARMTH_OPTIONS);
const STYLE_LABELS = Object.fromEntries(STYLE_OPTIONS);

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="grid gap-1 text-xs font-semibold text-[#6B665C]">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 w-full border border-[#D7D0C4] bg-transparent px-2 py-2 text-sm font-normal text-ink outline-none"
      >
        {options.map(([id, text]) => (
          <option key={id} value={id}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function WardrobePanel({
  wardrobe,
  setWardrobe,
  draft,
  setDraft,
  recommendation,
  locks,
  setLocks,
  appliedLocks,
  setAppliedLocks,
  fallbackOutfit,
  seasonAlert,
}) {
  const [filter, setFilter] = useState("all");
  const [appliedAt, setAppliedAt] = useState(null);
  const [showMoreColors, setShowMoreColors] = useState(false);
  const readOpen = (key, def) => { try { const v = localStorage.getItem(key); return v === null ? def : v === "true"; } catch { return def; } };
  const saveOpen = (key, val) => { try { localStorage.setItem(key, val); } catch {} };
  const [openAdd, setOpenAdd] = useState(() => readOpen("wf.open.wAdd", true));
  const [openLock, setOpenLock] = useState(() => readOpen("wf.open.wLock", false));
  const [openList, setOpenList] = useState(() => readOpen("wf.open.wList", true));
  const [openRec, setOpenRec] = useState(() => readOpen("wf.open.wRec", true));
  const toggleAdd  = () => setOpenAdd(v  => { const n = !v;  saveOpen("wf.open.wAdd",  n); return n; });
  const toggleLock = () => setOpenLock(v => { const n = !v;  saveOpen("wf.open.wLock", n); return n; });
  const toggleList = () => setOpenList(v => { const n = !v;  saveOpen("wf.open.wList", n); return n; });
  const toggleRec  = () => setOpenRec(v  => { const n = !v;  saveOpen("wf.open.wRec",  n); return n; });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const SIZE = 100;
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, SIZE, SIZE);
      const data = ctx.getImageData(0, 0, SIZE, SIZE).data;
      let rSum = 0, gSum = 0, bSum = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const brightness = (r + g + b) / 3;
        if (brightness > 20 && brightness < 235) {
          rSum += r; gSum += g; bSum += b; count++;
        }
      }
      if (count > 0) {
        const hex =
          "#" +
          Math.round(rSum / count).toString(16).padStart(2, "0") +
          Math.round(gSum / count).toString(16).padStart(2, "0") +
          Math.round(bSum / count).toString(16).padStart(2, "0");
        setDraft((prev) => ({ ...prev, color: "사진 추출", colorHex: hex }));
      }
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
    e.target.value = "";
  };
  const filteredWardrobe = useMemo(
    () => (filter === "all" ? wardrobe : wardrobe.filter((item) => item.category === filter)),
    [filter, wardrobe]
  );
  const categoryCounts = useMemo(
    () =>
      wardrobe.reduce(
        (counts, item) => ({
          ...counts,
          [item.category]: (counts[item.category] || 0) + 1,
        }),
        {}
      ),
    [wardrobe]
  );

  const addItem = () => {
    if (!draft.name.trim()) return;
    setWardrobe([
      ...wardrobe,
      {
        ...draft,
        id: `${Date.now()}`,
        name: draft.name.trim(),
        wearCount: 0,
        addedAt: new Date().toISOString().slice(0, 10),
        lastWorn: null,
      },
    ]);
    setDraft({ ...draft, name: "" });
  };

  const recordWear = (id) => {
    const today = new Date().toISOString().slice(0, 10);
    setWardrobe(wardrobe.map((item) =>
      item.id === id
        ? { ...item, wearCount: (item.wearCount || 0) + 1, lastWorn: today }
        : item
    ));
  };

  const removeItem = (id) => {
    setWardrobe(wardrobe.filter((item) => item.id !== id));
    const clearDeleted = (currentLocks) =>
      Object.fromEntries(
        Object.entries(currentLocks).map(([category, lockedId]) => [category, lockedId === id ? "" : lockedId])
      );
    setLocks(clearDeleted(locks));
    setAppliedLocks(clearDeleted(appliedLocks));
  };

  const itemsByCategory = (category) => wardrobe.filter((item) => item.category === category);
  const SKIP = "__skip__";
  const EMPTY_LOCKS = { outer: SKIP, top: SKIP, bottom: SKIP, shoes: SKIP, accessory: SKIP };
  const lockedCount = Object.values(locks).filter((v) => v && v !== SKIP).length;
  const appliedCount = Object.values(appliedLocks).filter((v) => v && v !== SKIP).length;
  const applyLocks = () => {
    setAppliedLocks(locks);
    setAppliedAt(new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }));
  };

  const clearLocks = () => {
    setLocks({ ...EMPTY_LOCKS });
    setAppliedLocks({ ...EMPTY_LOCKS });
    setAppliedAt(null);
  };

  const AUTO_LOCKS = { outer: "", top: "", bottom: "", shoes: "", accessory: "" };
  const autoAll = () => {
    setLocks({ ...AUTO_LOCKS });
    setAppliedLocks({ ...AUTO_LOCKS });
    setAppliedAt(null);
  };

  const outfitRows = [
    ["아우터", "outer", recommendation.outfit?.outer, fallbackOutfit?.outer],
    ["상의", "top", recommendation.outfit?.top, fallbackOutfit?.top],
    ["하의", "bottom", recommendation.outfit?.bottom, fallbackOutfit?.bottom],
    ["신발", "shoes", recommendation.outfit?.shoes, fallbackOutfit?.shoes],
    ["포인트", "accessory", recommendation.outfit?.accessory, fallbackOutfit?.accessory],
  ];

  const SubHeader = ({ title, sub, open: o, onToggle }) => (
    <button type="button" onClick={onToggle} className="flex w-full items-start justify-between py-1 text-left">
      <div>
        <div className="text-sm font-semibold text-[#1A1A1A]">{title}</div>
        {sub && <p className="text-xs text-[#6B665C] leading-5">{sub}</p>}
      </div>
      <span className="ml-3 shrink-0" style={{ fontSize: "13px", border: "0.5px solid #D7D0C4", borderRadius: "4px", padding: "2px 8px", color: "#6B665C" }}>{o ? "−" : "+"}</span>
    </button>
  );

  return (
    <div className="mt-6 grid gap-3">
      {seasonAlert && (
        <div className="flex items-start gap-2 border border-[#E8543B] bg-[#FFF5F2] px-4 py-3 text-sm text-[#E8543B]">
          <span>🌿</span>
          <span>{seasonAlert}</span>
        </div>
      )}

      {/* ── 옷 추가 ── */}
      <section className="wf-card-soft px-4 py-3">
        <SubHeader title="옷 추가" open={openAdd} onToggle={toggleAdd} />
        {openAdd && (
          <div className="grid min-w-0 gap-3 border-t border-[#E5DED1] pt-3">
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="예: 네이비 반팔 니트"
              className="min-w-0 w-full border border-[#D7D0C4] bg-transparent px-3 py-2 text-sm outline-none"
            />
            <SelectField label="분류" value={draft.category} onChange={(category) => setDraft({ ...draft, category })} options={CATEGORY_OPTIONS} />
            <label className="grid gap-1 text-xs font-semibold text-[#6B665C]">
              색상
              <div className="flex min-w-0 items-center gap-2">
                <span className="shrink-0"><ColorChips text={draft.color} colorHex={draft.colorHex} /></span>
                <input
                  value={draft.color}
                  onChange={(e) => {
                    const name = e.target.value;
                    const hex = COLOR_NAME_TO_HEX[name];
                    setDraft({ ...draft, color: name, ...(hex ? { colorHex: hex } : {}) });
                  }}
                  className="min-w-0 w-full border border-[#D7D0C4] bg-transparent px-3 py-2 text-sm font-normal text-ink outline-none"
                />
              </div>
              <div className="mt-2 grid grid-cols-9 gap-1.5">
                {(showMoreColors ? [...COLOR_SWATCHES, ...MORE_COLOR_SWATCHES] : COLOR_SWATCHES).map(([name, hex]) => {
                  const selected = draft.colorHex === hex;
                  return (
                    <button key={`${name}-${hex}`} type="button" onClick={() => setDraft({ ...draft, color: name, colorHex: hex })}
                      className="h-6 border"
                      style={{ background: hex, borderColor: selected ? "#1A1A1A" : "#D7D0C4", outline: selected ? "2px solid #1A1A1A" : "none", outlineOffset: 1 }}
                      title={name} aria-label={`${name} 선택`}
                    />
                  );
                })}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => setShowMoreColors(!showMoreColors)} className="border border-[#D7D0C4] px-3 py-1.5 text-xs font-normal text-[#6B665C]">
                  {showMoreColors ? "기본 색만 보기" : "더 많은 색 보기"}
                </button>
                <input type="color" value={draft.colorHex || "#111111"} onChange={(e) => setDraft({ ...draft, color: "직접 선택", colorHex: e.target.value })}
                  className="h-8 w-10 border border-[#D7D0C4] bg-transparent p-0" title="직접 색 선택" />
                <span className="text-xs font-normal text-[#8F897D]">직접 선택</span>
                <label className="flex cursor-pointer items-center gap-1 border border-[#D7D0C4] px-3 py-1.5 text-xs font-normal text-[#6B665C] transition hover:border-[#1A1A1A]">
                  📷 사진 색상 추출
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </label>
            <SelectField label="두께" value={draft.warmth} onChange={(warmth) => setDraft({ ...draft, warmth })} options={WARMTH_OPTIONS} />
            <SelectField label="스타일" value={draft.style} onChange={(style) => setDraft({ ...draft, style })} options={STYLE_OPTIONS} />
            <label className="flex items-center gap-2 text-sm text-[#3A362E]">
              <input type="checkbox" checked={draft.rainOk} onChange={(e) => setDraft({ ...draft, rainOk: e.target.checked })} />
              비 오는 날에도 착용 가능
            </label>
            <button type="button" onClick={addItem} className="bg-ink px-4 py-2 text-sm font-semibold text-white">
              옷장에 추가
            </button>
          </div>
        )}
      </section>

      {/* ── 오늘의 고정 ── */}
      <section className="wf-card-soft px-4 py-3">
        <SubHeader title="오늘의 고정" sub={lockedCount > 0 ? `${lockedCount}개 고정 중` : "특정 아이템을 고정하고 나머지를 조합"} open={openLock} onToggle={toggleLock} />
        {openLock && (
          <div className="border-t border-[#E5DED1] pt-3">
            <div className="grid min-w-0 gap-3">
              {CATEGORY_OPTIONS.map(([category, label]) => (
                <label key={category} className="grid gap-1 text-xs font-semibold text-[#6B665C]">
                  {label} 고정
                  <select
                    value={locks[category] ?? SKIP}
                    onChange={(e) => setLocks({ ...locks, [category]: e.target.value })}
                    className="min-w-0 w-full border border-[#D7D0C4] bg-transparent px-2 py-2 text-sm font-normal text-ink outline-none"
                  >
                    <option value="__skip__">고정 안함</option>
                    <option value="">자동 추천</option>
                    {itemsByCategory(category).map((item) => (
                      <option key={item.id} value={item.id}>{item.name} · {item.color}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={applyLocks} className="bg-ink px-4 py-2 text-sm font-semibold text-white">고정한 옷으로 다시 조합하기</button>
              <button type="button" onClick={autoAll} className="border border-[#D7D0C4] px-4 py-2 text-sm text-[#6B665C]">자동 추천</button>
              <button type="button" onClick={clearLocks} className="border border-[#D7D0C4] px-4 py-2 text-sm text-[#6B665C]">고정 해제</button>
            </div>
            <p className="mt-3 text-xs leading-5 text-[#6B665C]">
              {lockedCount > 0
                ? `현재 ${lockedCount}개 고정.${appliedAt ? ` ${appliedAt}에 조합했어요.` : " 버튼을 눌러 결과를 확인하세요."}`
                : "고정한 옷이 없으면 자동으로 조합합니다."}
            </p>
          </div>
        )}
      </section>

      {/* ── 옷장 목록 ── */}
      <section className="wf-card-soft px-4 py-3">
        <SubHeader
          title={`옷장 목록 · ${wardrobe.length}개`}
          sub={`상의 ${categoryCounts.top || 0} · 하의 ${categoryCounts.bottom || 0} · 신발 ${categoryCounts.shoes || 0}`}
          open={openList}
          onToggle={toggleList}
        />
        {openList && (
          <div className="border-t border-[#E5DED1] pt-3">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {FILTER_OPTIONS.map(([id, label]) => {
                const selected = filter === id;
                return (
                  <button key={id} type="button" onClick={() => setFilter(id)} className="border px-2.5 py-1 text-xs"
                    style={{ borderColor: selected ? "#1A1A1A" : "#D7D0C4", background: selected ? "#1A1A1A" : "transparent", color: selected ? "#fff" : "#6B665C" }}>
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="grid max-h-[320px] gap-2 overflow-auto pr-1">
              {filteredWardrobe.map((item) => (
                <div key={item.id} className="border border-[#E5DED1] bg-[#FAF8F3] p-3 transition hover:border-[#1A1A1A] hover:bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold"><ColorText value={item.name} colorHex={item.colorHex} /></div>
                      <div className="mt-1 text-xs leading-5 text-[#6B665C]">
                        {CATEGORY_LABELS_KO[item.category]} · <ColorText value={item.color} colorHex={item.colorHex} /> · {WARMTH_LABELS[item.warmth]} · {STYLE_LABELS[item.style]}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#8F897D]">
                        <span>{item.rainOk ? "비 오는 날 가능" : "비 오는 날 비추천"}</span>
                        {(item.wearCount || 0) > 0
                          ? <span className="border border-[#E5DED1] px-1.5 py-0.5">{item.wearCount}회 착용</span>
                          : <span className="text-[#C9B89A]">미착용</span>}
                      </div>
                      {item.lastWorn && <div className="mt-0.5 text-xs text-[#A8A296]">마지막 {item.lastWorn}</div>}
                    </div>
                    <div className="flex shrink-0 flex-col gap-1">
                      <button type="button" onClick={() => recordWear(item.id)} className="border border-[#D7D0C4] px-2 py-1 text-xs text-[#6B665C]">착용 ✓</button>
                      <button type="button" onClick={() => removeItem(item.id)} className="border border-[#D7D0C4] px-2 py-1 text-xs text-[#6B665C]">삭제</button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredWardrobe.length === 0 && (
                <div className="border border-dashed border-[#D7D0C4] p-4 text-center text-sm text-[#8F897D]">이 분류에 등록된 옷이 없습니다.</div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ── 옷장 코디 결과 ── */}
      <section className="wf-card-soft px-4 py-3">
        <SubHeader
          title="옷장에서 고른 코디"
          sub={lockedCount > 0 ? "고정 반영" : "자동 조합"}
          open={openRec}
          onToggle={toggleRec}
        />
        {openRec && (
          <div className="border-t border-[#E5DED1] pt-3">
            <div className="border border-[#1A1A1A] bg-[#FAF8F3] p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold">{recommendation.outfit?.title || "내 옷장 코디"}</h3>
                <span className="border border-[#D7D0C4] px-2 py-1 text-[11px] text-[#6B665C]">{lockedCount > 0 ? "고정 반영" : "자동"}</span>
              </div>
              <div className="mt-3 grid gap-2">
                {outfitRows.map(([label, category, item, fallback]) => {
                  const isSkipped = appliedLocks[category] === "__skip__";
                  const value = item ? `${item.name} · ${item.color}` : fallback;
                  const colorHex = item?.colorHex;
                  const suffix = item ? (appliedLocks[item.category] === item.id ? " · 고정" : "") : "";
                  return (
                    <div key={label} className="grid grid-cols-[56px_1fr] gap-3 text-sm">
                      <span className="font-semibold text-[#6B665C]">{label}</span>
                      {isSkipped
                        ? <span className="text-[#C9B89A]">생략</span>
                        : value
                          ? <ColorText value={value} suffix={suffix} colorHex={colorHex} />
                          : <span className="text-[#A8A296]">추천 가능한 옷 부족</span>}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-3 grid gap-2">
              {Object.entries(recommendation.picked).map(([category, item]) => (
                <div key={category} className="flex items-center justify-between border-t border-[#E5DED1] pt-2 text-sm">
                  <span className="font-semibold text-[#6B665C]">{CATEGORY_LABELS_KO[category]}</span>
                  <ColorText value={`${item.name} · ${item.color}`} colorHex={item.colorHex} suffix={appliedLocks[category] === item.id ? " · 고정" : ""} />
                </div>
              ))}
              {Object.keys(recommendation.picked).length === 0 && (
                <p className="text-sm leading-6 text-[#8F897D]">상의, 하의, 신발을 하나씩 추가해보세요.</p>
              )}
            </div>
            {recommendation.reasons.length > 0 && (
              <div className="mt-4 grid gap-1 text-xs leading-5 text-[#6B665C]">
                {recommendation.reasons.map((reason) => <p key={reason}>왜? {reason}</p>)}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
