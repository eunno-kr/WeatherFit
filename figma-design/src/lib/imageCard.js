const W = 400;
const H = 540;
const SCALE = 2;

function line(ctx, x1, y1, x2, y2, color = "#2A2A28") {
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function label(ctx, text, x, y) {
  ctx.font = "bold 9px Arial, sans-serif";
  ctx.fillStyle = "#6B665C";
  ctx.fillText(text.toUpperCase(), x, y);
}

function value(ctx, text, x, y) {
  ctx.font = "15px Arial, sans-serif";
  ctx.fillStyle = "#FFFDF7";
  ctx.fillText(text || "—", x, y);
}

export function downloadOutfitCard({ outfit, weather, palette, condition }) {
  const canvas = document.createElement("canvas");
  canvas.width = W * SCALE;
  canvas.height = H * SCALE;
  const ctx = canvas.getContext("2d");
  ctx.scale(SCALE, SCALE);

  // 배경
  ctx.fillStyle = "#1A1A1A";
  ctx.fillRect(0, 0, W, H);

  // 상단 컬러 바
  ctx.fillStyle = "#E8543B";
  ctx.fillRect(0, 0, W, 3);

  // 브랜드
  ctx.font = "bold 11px Arial, sans-serif";
  ctx.fillStyle = "#E8543B";
  ctx.fillText("WEATHERFIT", 24, 34);

  // 날짜·날씨
  const dateStr = new Date().toLocaleDateString("ko-KR");
  const city = weather?.city || "";
  const temp = weather ? `${Math.round(weather.temp)}°` : "";
  ctx.font = "11px Arial, sans-serif";
  ctx.fillStyle = "#7A7268";
  ctx.fillText(`${dateStr}  ·  ${city}  ·  ${temp}  ·  ${condition || ""}`, 24, 52);

  // 색상 팔레트 점
  const colors = palette?.length ? palette : ["#CBB89D", "#F5F1D8", "#3A3A3A", "#111111"];
  colors.slice(0, 5).forEach((hex, i) => {
    ctx.beginPath();
    ctx.arc(24 + i * 22, 76, 7, 0, Math.PI * 2);
    ctx.fillStyle = hex;
    ctx.fill();
    ctx.strokeStyle = "#3A3A38";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  });

  line(ctx, 24, 96, W - 24, 96, "#2E2E2C");

  // 코디 제목
  ctx.font = "bold 18px Arial, sans-serif";
  ctx.fillStyle = "#FFFDF7";
  ctx.fillText(outfit.title || "오늘의 코디", 24, 124);

  // 코디 아이템
  const items = [
    ["레이어", outfit.outer],
    ["상의", outfit.top],
    ["하의", outfit.bottom],
    ["슈즈", outfit.shoes],
    ["포인트", outfit.accessory],
  ];

  items.forEach(([lbl, val], i) => {
    const y = 158 + i * 60;
    label(ctx, lbl, 24, y);
    value(ctx, val, 24, y + 18);
    if (i < items.length - 1) line(ctx, 24, y + 36, W - 24, y + 36);
  });

  // 하단 구분선
  line(ctx, 24, H - 44, W - 24, H - 44, "#2E2E2C");

  // 푸터
  ctx.font = "9px Arial, sans-serif";
  ctx.fillStyle = "#4A4A48";
  ctx.fillText("WEATHERFIT  ·  AI STYLING", 24, H - 24);

  // 다운로드
  const a = document.createElement("a");
  a.download = `weatherfit-${new Date().toISOString().slice(0, 10)}.png`;
  a.href = canvas.toDataURL("image/png");
  a.click();
}
