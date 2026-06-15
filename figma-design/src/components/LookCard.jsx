import ColorText from "./ColorText.jsx";

const SLOTS = [
  ["레이어", "outer"],
  ["상의", "top"],
  ["하의", "bottom"],
  ["슈즈", "shoes"],
  ["포인트", "accessory"],
];

function OutfitCard({ outfit, index, theme }) {
  return (
    <article className="group border border-black/10 bg-[#FFFDF7] p-5 transition hover:border-black/40 hover:bg-white">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="wf-label" style={{ color: theme.accent }}>
            LOOK {index + 1}
          </div>
          <h3 className="mt-1 text-lg font-semibold">{outfit.title}</h3>
        </div>
        <span className="border px-2 py-1 text-[11px] text-[#6B665C]" style={{ borderColor: `${theme.accent}55` }}>
          완성 코디
        </span>
      </div>

      <div className="mt-4 grid gap-2">
        {SLOTS.map(([label, key]) => (
          <div key={key} className="grid grid-cols-[64px_1fr] gap-3 border-t border-[#EFE8DA] pt-2 text-sm first:border-t-0 first:pt-0">
            <span className="wf-label" style={{ color: theme.accent }}>
              {label}
            </span>
            <ColorText value={outfit[key]} muted={outfit[key] === "레이어 생략"} />
          </div>
        ))}
      </div>
    </article>
  );
}

export default function LookCard({ look, theme }) {
  return (
    <section className="mt-6 border p-5 sm:p-6" style={{ background: theme.soft, borderColor: `${theme.accent}44` }}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="wf-label" style={{ color: theme.accent }}>
            TODAY'S LOOK
          </div>
          <h2 className="mt-1 text-2xl font-semibold tracking-normal">오늘 바로 입는 3가지 코디</h2>
        </div>
        <div className="border border-[#D7D0C4] bg-[#FFFDF7] px-2.5 py-1 text-xs text-[#6B665C]">일반 추천</div>
      </div>

      <div className="mt-5 grid gap-3">
        {look.outfits.map((outfit, index) => (
          <OutfitCard key={outfit.id} outfit={outfit} index={index} theme={theme} />
        ))}
      </div>

      <p className="mt-5 text-sm leading-6 text-[#3A362E]">{look.comment}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {look.reasons.map((reason) => (
          <span
            key={reason}
            className="border px-2.5 py-1 font-display text-[11px] font-medium"
            style={{ borderColor: `${theme.accent}66`, color: theme.accent }}
          >
            왜? {reason}
          </span>
        ))}
      </div>
    </section>
  );
}
