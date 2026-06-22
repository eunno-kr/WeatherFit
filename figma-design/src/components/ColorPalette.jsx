export default function ColorPalette({ palette }) {
  return (
    <section className="wf-card-soft mt-6 p-5">
      <div className="wf-label text-[#1A1A1A]" style={{ fontSize: "16px" }}>오늘의 코디 팔레트</div>
      <p className="mt-1 text-base text-[#3A362E] leading-6">
        온보딩에서 선택한 컬러 톤 기반으로 구성됩니다. 이 팔레트가 오늘 코디 아이템 색상에 직접 반영돼요.
      </p>
      <div className="mt-4 grid gap-4">
        {palette.colors.map((color, i) => (
          <div key={color} className="flex items-start gap-3">
            <span
              className="shrink-0 h-12 w-12 border border-black/10 shadow-[3px_3px_0_rgba(26,26,26,0.06)]"
              style={{ background: color }}
              title={palette.colorNames?.[i] || color}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base font-bold text-[#1A1A1A]">
                  {palette.colorNames?.[i] || color}
                </span>
                {palette.colorRoles?.[i] && (
                  <span
                    className="border px-1.5 py-0.5 text-sm font-medium"
                    style={{ borderColor: `${color}88`, color: "#1A1A1A" }}
                  >
                    {palette.colorRoles[i]}
                  </span>
                )}
              </div>
              {palette.colorWhys?.[i] && (
                <p className="mt-0.5 text-base leading-6 text-[#3A362E]">
                  {palette.colorWhys[i]}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-base leading-6 text-[#1A1A1A] border-t border-[#EFE8DA] pt-3">
        {palette.text}
      </p>
    </section>
  );
}
