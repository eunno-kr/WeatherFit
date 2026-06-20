import { useState } from "react";
import ColorText from "./ColorText.jsx";

const SLOTS = [
  ["레이어", "outer"],
  ["상의", "top"],
  ["하의", "bottom"],
  ["슈즈", "shoes"],
  ["포인트", "accessory"],
];

export default function SavedOutfitsPanel({ savedOutfits, onRemove }) {
  const [open, setOpen] = useState(false);

  if (savedOutfits.length === 0) return null;

  return (
    <section className="mt-6 border border-[#E5DED1] bg-[#FAF8F3] p-5 sm:p-6">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between"
      >
        <div className="text-left">
          <div className="wf-label text-[#6B665C]">SAVED LOOKS</div>
          <h2 className="mt-1 text-lg font-semibold">저장한 코디 {savedOutfits.length}개</h2>
        </div>
        <span className="shrink-0 border border-[#D7D0C4] px-3 py-1 text-xs text-[#6B665C]">
          {open ? "접기" : "펼치기"}
        </span>
      </button>

      {open && (
        <div className="mt-4 grid gap-3">
          {savedOutfits.map((outfit) => (
            <article
              key={outfit.savedId}
              className="border border-[#E5DED1] bg-[#FFFDF7] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{outfit.title}</div>
                  <div className="mt-0.5 text-xs text-[#8F897D]">
                    {outfit.savedDate} 저장
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(outfit.savedId)}
                  className="shrink-0 border border-[#D7D0C4] px-2 py-1 text-xs text-[#6B665C]"
                >
                  삭제
                </button>
              </div>
              <div className="mt-3 grid gap-1.5">
                {SLOTS.map(([label, key]) => (
                  <div key={key} className="grid grid-cols-[56px_1fr] gap-2 text-sm">
                    <span className="text-xs text-[#8F897D]">{label}</span>
                    <ColorText value={outfit[key]} muted={outfit[key] === "레이어 생략"} />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
