export default function ColorPalette({ palette }) {
  return (
    <section className="wf-card-soft mt-6 p-5">
      <div className="wf-label text-[#6B665C]" style={{ fontSize: "13px" }}>오늘의 코디 팔레트</div>
      <p className="mt-1 text-xs text-[#8F897D] leading-5">
        온보딩에서 선택한 컬러 톤 기반으로 구성됩니다. 이 팔레트가 오늘 코디 아이템 색상에 직접 반영돼요.
      </p>
      <div className="mt-4 grid gap-3">
        {palette.colors.map((color, i) => (
          <div key={color} className="flex items-start gap-3">
            <span
              className="shrink-0 h-10 w-10 border border-black/10 shadow-[3px_3px_0_rgba(26,26,26,0.06)]"
              style={{ background: color }}
              title={palette.colorNames?.[i] || color}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-[#1A1A1A]">
                  {palette.colorNames?.[i] || color}
                </span>
                {palette.colorRoles?.[i] && (
                  <span
                    className="border px-1.5 py-0.5 text-[10px] font-medium"
                    style={{ borderColor: `${color}88`, color: "#6B665C" }}
                  >
                    {palette.colorRoles[i]}
                  </span>
                )}
              </div>
              {palette.colorWhys?.[i] && (
                <p className="mt-0.5 text-[11px] leading-4 text-[#8F897D]">
                  {palette.colorWhys[i]}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-[#6B665C] border-t border-[#EFE8DA] pt-3">
        {palette.text}
      </p>
    </section>
  );
}
