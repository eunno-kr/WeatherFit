export default function ColorPalette({ palette }) {
  return (
    <section className="mt-5 border border-[#D7D0C4] bg-[#FFFDF7] p-5">
      <div className="font-display text-[11px] font-bold text-[#6B665C]">COLOR BALANCE</div>
      <div className="mt-3 flex items-center gap-3">
        {palette.colors.map((color) => (
          <span
            key={color}
            className="h-11 w-11 border border-black/10"
            style={{ background: color }}
            title={color}
          />
        ))}
        <div>
          <div className="text-sm font-semibold">{palette.name}</div>
          <p className="mt-1 text-xs leading-5 text-[#6B665C]">{palette.text}</p>
        </div>
      </div>
    </section>
  );
}
