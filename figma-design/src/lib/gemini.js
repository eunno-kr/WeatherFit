const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

function getKey() {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  if (!key) throw new Error("figma-design/.env 파일에 VITE_GROQ_API_KEY를 설정해주세요.");
  return key;
}

async function callGroq(messages) {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getKey()}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 600,
      temperature: 0.75,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq API 오류 (${res.status})`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("AI 응답을 받지 못했어요.");
  return text.trim();
}

export async function askGeminiForOutfit({ weather, profile, look, wardrobe, occasion, condition }) {
  const outfitList = look.outfits
    .map(
      (o, i) =>
        `${i + 1}. ${o.title}: 아우터=${o.outer}, 상의=${o.top}, 하의=${o.bottom}, 슈즈=${o.shoes}, 포인트=${o.accessory}`
    )
    .join("\n");

  const wardrobeItems = wardrobe
    .slice(0, 20)
    .map((item) => `${item.name}(${item.category}, ${item.color}, ${item.warmth})`)
    .join(", ");

  return callGroq([
    {
      role: "system",
      content:
        "당신은 친절한 한국어 패션 스타일리스트입니다. 날씨와 사용자 정보를 바탕으로 실용적인 코디 조언을 제공합니다. 항상 한국어로 답변하세요.",
    },
    {
      role: "user",
      content: `아래 정보를 바탕으로 오늘 코디 조언을 작성해주세요.

[날씨] ${weather.city} / ${condition} / ${Math.round(weather.temp)}°C (체감 ${Math.round(weather.feels)}°C) / 최고·최저 ${Math.round(weather.tmax)}°/${Math.round(weather.tmin)}°
[사용자] ${profile.age}, ${profile.style} 스타일, 온도 민감도: ${profile.sensitivity}, 상황: ${occasion}
[추천 코디]
${outfitList}
[옷장] ${wardrobeItems || "등록된 옷 없음"}

다음 3가지를 각각 한두 문장으로 작성해주세요:
① 오늘 날씨 주의점
② 가장 추천하는 코디와 이유
③ 스타일링 팁 1가지

200자 이내, 친근한 말투로.`,
    },
  ]);
}

export async function chatWithStylist({ message, history, weather, profile, look, wardrobe, occasion, condition }) {
  const wardrobeItems = wardrobe
    .slice(0, 15)
    .map((item) => `${item.name}(${item.category},${item.color},${item.warmth})`)
    .join(", ");

  const outfitList = look?.outfits
    ?.map((o, i) => `${i + 1}.${o.title}: 아우터=${o.outer}, 상의=${o.top}, 하의=${o.bottom}`)
    .join(" / ") || "";

  const systemMsg = {
    role: "system",
    content: `당신은 WeatherFit 앱의 AI 패션 스타일리스트입니다. 항상 한국어로 답변하세요.

현재 상황:
- 도시: ${weather?.city || "알 수 없음"} / 날씨: ${condition || ""} / 기온: ${weather ? Math.round(weather.temp) : ""}°C (체감 ${weather ? Math.round(weather.feels) : ""}°C)
- 사용자: ${profile.age}, ${profile.style} 스타일, 온도 민감도 ${profile.sensitivity}, 상황: ${occasion}
- 오늘 추천 코디: ${outfitList}
- 옷장: ${wardrobeItems || "등록된 옷 없음"}

코디, 패션, 날씨 관련 질문에 친절하고 실용적으로 답하세요. 2-4문장 이내로 간결하게.`,
  };

  const chatHistory = history.map((m) => ({
    role: m.role === "model" ? "assistant" : "user",
    content: m.text,
  }));

  return callGroq([systemMsg, ...chatHistory, { role: "user", content: message }]);
}
