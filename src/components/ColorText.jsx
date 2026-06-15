const COLOR_MAP = [
  ["다크브라운", "#4A2F23"],
  ["라이트그레이", "#C9CDD0"],
  ["라이트블루", "#AFCFEA"],
  ["미디엄블루", "#547EA8"],
  ["스카이블루", "#9FC7E8"],
  ["쿨그레이", "#A8B0B7"],
  ["버터 옐로", "#F4DF8A"],
  ["오프화이트", "#F7F2E8"],
  ["아이보리", "#F5F1D8"],
  ["차콜", "#3A3A3A"],
  ["블랙", "#111111"],
  ["화이트", "#FFFFFF"],
  ["크림", "#F2E8CF"],
  ["베이지", "#CBB89D"],
  ["그레이", "#9A9A9A"],
  ["네이비", "#1F2E46"],
  ["세이지", "#8A9A70"],
  ["카키", "#77724F"],
  ["브라운", "#6B4A34"],
  ["인디고", "#263E6A"],
  ["데님", "#547EA8"],
  ["연청", "#AFCFEA"],
  ["실버", "#C9CDD2"],
  ["스톤", "#B8B1A3"],
  ["무채색", "#111111"],
  ["밝은 톤", "#F7F2D8"],
  ["차분한 톤", "#283747"],
  ["포인트 컬러", "#D9532B"],
  ["라벤더", "#B8A7D9"],
  ["민트", "#A9D8C2"],
  ["버건디", "#7B263A"],
  ["핑크", "#F2A7B5"],
  ["레드", "#C9443E"],
  ["오렌지", "#E68A3A"],
  ["옐로", "#F4DF8A"],
  ["퍼플", "#7B5FA3"],
  ["블루", "#5B8FC9"],
  ["그린", "#6F9A72"],
];

export function getColorChips(text) {
  if (!text || text === "레이어 생략") return [];
  const matched = COLOR_MAP.filter(([name]) => text.includes(name)).map(([name, color]) => ({ name, color }));
  return matched.length ? matched : [{ name: "색상", color: "#CBB89D" }];
}

export function ColorChips({ text, colorHex }) {
  if (colorHex) {
    return (
      <span
        className="inline-block h-3.5 w-3.5 shrink-0 border border-black/20 align-middle"
        style={{ background: colorHex }}
        title={text || colorHex}
      />
    );
  }

  return (
    <>
      {getColorChips(text).map((chip) => (
        <span
          key={`${chip.name}-${chip.color}`}
          className="inline-block h-3.5 w-3.5 shrink-0 border border-black/20 align-middle"
          style={{ background: chip.color }}
          title={chip.name}
        />
      ))}
    </>
  );
}

export default function ColorText({ value, muted = false, suffix = "", colorHex }) {
  const text = value || "선택";
  return (
    <span className={muted ? "text-[#9A958B]" : "font-medium text-ink"}>
      <span className="inline-flex min-w-0 flex-wrap items-center gap-1.5">
        <ColorChips text={text} colorHex={colorHex} />
        <span>
          {text}
          {suffix}
        </span>
      </span>
    </span>
  );
}
