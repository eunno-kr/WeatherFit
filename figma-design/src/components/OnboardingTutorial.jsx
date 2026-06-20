import { useState } from "react";

const STEPS = [
  {
    emoji: "🌤️",
    title: "실시간 날씨 기반 추천",
    desc: "도시를 선택하면 현재 날씨와 체감 온도를 불러와 오늘 입기 딱 좋은 두께와 스타일을 자동으로 계산해요.",
  },
  {
    emoji: "📅",
    title: "7일 예보로 내일 코디 미리 준비",
    desc: "날씨 카드 아래 요일 버튼을 클릭하면 그날 날씨 기준 코디를 미리 확인할 수 있어요. 비 예보가 있으면 방수 아이템을 추천해요.",
  },
  {
    emoji: "👔",
    title: "내 옷장 등록 & 착용 기록",
    desc: "가지고 있는 옷을 등록하면 날씨·스타일·색상에 맞는 조합을 내 옷장 안에서 골라줘요. 착용 ✓ 버튼으로 기록도 남겨보세요.",
  },
  {
    emoji: "💾",
    title: "코디 저장 & 히스토리",
    desc: "마음에 드는 코디는 '저장' 버튼으로 보관하고, '오늘 입었어요'로 기록을 쌓아보세요. 저장한 코디는 하단 SAVED LOOKS에서 확인할 수 있어요.",
  },
];

export default function OnboardingTutorial({ onClose }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md border border-[#1A1A1A] bg-[#FFFDF7] p-8 shadow-2xl">
        <div className="wf-label mb-6 text-[#E8543B]">
          WEATHERFIT 시작하기 {step + 1} / {STEPS.length}
        </div>

        <div className="mb-4 text-5xl">{current.emoji}</div>
        <h2 className="text-xl font-semibold">{current.title}</h2>
        <p className="mt-3 text-sm leading-7 text-[#6B665C]">{current.desc}</p>

        <div className="mt-8 flex items-center justify-between gap-3">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStep(i)}
                className="h-1.5 transition"
                style={{
                  width: i === step ? "24px" : "8px",
                  background: i === step ? "#E8543B" : "#D7D0C4",
                }}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-[#D7D0C4] px-4 py-2 text-sm text-[#6B665C]"
            >
              건너뛰기
            </button>
            {isLast ? (
              <button
                type="button"
                onClick={onClose}
                className="bg-[#E8543B] px-5 py-2 text-sm font-semibold text-white"
              >
                시작하기
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="bg-[#1A1A1A] px-5 py-2 text-sm font-semibold text-white"
              >
                다음 →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
