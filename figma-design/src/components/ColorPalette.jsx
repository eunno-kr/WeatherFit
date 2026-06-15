export default function ColorPalette({ palette }) {
  return (
    <section className="wf-card-soft mt-6 p-5">
      <div className="wf-label text-[#6B665C]">COLOR BALANCE</div>
      <div className="mt-3 flex items-center gap-3">
        {palette.colors.map((color) => (
          <span
            key={color}
            className="h-12 w-12 border border-black/10 shadow-[4px_4px_0_rgba(26,26,26,0.06)]"
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
