import { useState } from "react";
import { useOpen } from "../lib/useOpen.js";

const PC_KEY = "wf-personal-color-v2";

// ── STEP1: 웜/쿨 + 밝기 판별 (5문항) ─────────────────────────────────────

const STEP1_QUESTIONS = [
  {
    q: "손목 안쪽 혈관 색이 어떻게 보이나요?",
    hint: "예: 초록빛 → 잔디·피망처럼 초록 / 파란·보라빛 → 청바지·제비꽃처럼 파란 느낌",
    options: [{ label: "초록빛", value: "W" }, { label: "파란·보라빛", value: "C" }],
  },
  {
    q: "자연 피부에서 느껴지는 빛깔은?",
    hint: "예: 전지현·이정재처럼 노란기·황금빛이 돌면 웜톤 / 아이유·차은우처럼 분홍빛·파란기가 돌면 쿨톤",
    options: [{ label: "노란빛·황금빛·복숭아빛", value: "W" }, { label: "분홍빛·파란빛·붉은빛", value: "C" }],
  },
  {
    q: "더 잘 어울리는 금속 액세서리는?",
    hint: "예: 금반지·황동 버클이 더 생기있어 보이면 골드 / 은반지·스틸 시계가 더 화사해 보이면 실버",
    options: [{ label: "골드(Gold) — 더 화사해 보임", value: "W" }, { label: "실버(Silver) — 더 화사해 보임", value: "C" }],
  },
  {
    q: "햇빛에 오래 노출되면 피부가 어떻게 되나요?",
    hint: "예: 여름 휴가 후 구릿빛으로 예쁘게 그을림 vs 금방 빨개지거나 타도 금방 원래대로 돌아옴",
    options: [{ label: "황금빛으로 자연스럽게 그을림", value: "W" }, { label: "쉽게 붉어지거나 잘 타지 않음", value: "C" }],
  },
  {
    q: "전체적인 피부 인상은?",
    hint: "예: 아이유·차은우처럼 맑고 투명하거나 장원영·정해인처럼 눈코입이 또렷한 느낌 → 밝음 / 손예진·공유처럼 부드럽고 차분하거나 한가인·현빈처럼 깊고 풍성한 느낌 → 깊음",
    options: [
      { label: "맑고 투명한 편 / 선명하고 또렷한 편", value: "bright" },
      { label: "부드럽고 차분한 편 / 깊고 풍성한 편", value: "deep" },
    ],
  },
];

function calcSeason(ans) {
  const wCount = [0, 1, 2, 3].filter((i) => ans[i] === "W").length;
  const isWarm = wCount >= 2;
  const isBright = ans[4] === "bright";
  if (isWarm && isBright) return "봄";
  if (isWarm && !isBright) return "가을";
  if (!isWarm && isBright) return "겨울";
  return "여름";
}

// ── STEP2: 시즌별 서브타입 6문항 (round-robin 1:1 대결) ──────────────────
// 4타입 A/B/C/D → 6쌍: AB CD AC BD AD BC (각 타입 3회 등장)
// isMale: true이면 메이크업 질문 → 소품/아이템 질문으로 자동 교체

function getStep2(isMale) {
  return {
    봄: {
      types: ["라이트", "트루", "웜", "브라이트"],
      questions: [
        { q: "봄에 자연스럽게 맞는 무드는?",
          hint: "예: 연분홍 니트·민트 가방 vs 코럴 블라우스·골드 귀걸이",
          options: [{ label: "밝고 가벼운 파스텔 계열", type: "라이트" }, { label: "선명하고 활기찬 코럴·골드 계열", type: "트루" }] },
        { q: "선호하는 색의 분위기는?",
          hint: "예: 황토색 코트·겨자색 니트처럼 흙빛 계열의 따뜻한 색 vs 빨간 패딩·형광 노란 운동화처럼 눈에 확 들어오는 강렬한 색",
          options: [{ label: "골드·오렌지처럼 따뜻하고 풍성한 느낌", type: "웜" }, { label: "원색에 가까운 선명하고 경쾌한 느낌", type: "브라이트" }] },
        { q: "주로 입는 옷 스타일은?",
          hint: "예: 베이비핑크 티·아이보리 원피스 vs 올리브 자켓·테라코타 팬츠",
          options: [{ label: "파스텔, 화이트, 연한 색 위주", type: "라이트" }, { label: "카키, 머스타드, 테라코타 계열", type: "웜" }] },
        isMale
          ? { q: "포인트 아이템(가방·신발·소품)에서 잘 받는 색은?",
              hint: "예: 연어빛·복숭아색 가방을 들었을 때 피부가 더 자연스러운지 vs 빨간·주황 백팩을 멨을 때 더 선명하고 또렷해 보이는지",
              options: [{ label: "코럴, 피치 계열이 자연스럽게 어울림", type: "트루" }, { label: "레드, 오렌지처럼 선명한 컬러가 또렷해 보임", type: "브라이트" }] }
          : { q: "포인트 컬러는? (메이크업 또는 소품 기준)",
              hint: "예: 메이크업이라면 살구색·피치 립 / 소품이라면 코럴 가방·피치 스카프 vs 레드·오렌지 립스틱 / 레드 가방·오렌지 스니커즈",
              options: [{ label: "코럴, 피치 계열이 자연스러움", type: "트루" }, { label: "레드, 오렌지처럼 선명한 컬러가 또렷해 보임", type: "브라이트" }] },
        { q: "전체적인 이미지는?",
          hint: "예: 김유정·박형식처럼 사랑스럽고 부드러운 느낌 vs 아이린·이민호처럼 밝고 생동감 있는 느낌",
          options: [{ label: "부드럽고 사랑스러운 느낌", type: "라이트" }, { label: "밝고 생동감 있는 느낌", type: "브라이트" }] },
        { q: "잘 어울리는 베이스 컬러(흰색 계열)는?",
          hint: "예: 아이보리·피치 톤 흰 셔츠 vs 버터·크림 톤 흰 니트",
          options: [{ label: "아이보리, 연한 피치 톤 화이트", type: "트루" }, { label: "버터, 연한 황금빛 크림 톤", type: "웜" }] },
      ],
    },
    여름: {
      types: ["라이트", "트루", "쿨", "소프트"],
      questions: [
        { q: "전체적인 인상을 고른다면?",
          hint: "예: 수지·박보검처럼 맑고 산뜻한 느낌 vs 윤아·이준기처럼 차분하고 우아한 느낌",
          options: [{ label: "밝고 가볍고 산뜻한 느낌", type: "라이트" }, { label: "차분하고 우아한 느낌", type: "트루" }] },
        { q: "선호하는 색상 느낌은?",
          hint: "예: 하늘색 가디건·파스텔 보라색 원피스처럼 차갑고 맑게 선명한 색 vs 뿌연 분홍·회갈색 팬츠처럼 전체적으로 살짝 탁하고 부드러운 색",
          options: [{ label: "아이스블루·라벤더처럼 선명한 쿨 컬러", type: "쿨" }, { label: "모든 색이 약간 흐리고 그레이시한 느낌", type: "소프트" }] },
        isMale
          ? { q: "피부와 가장 잘 어울리는 셔츠·티 베이스 컬러는?",
              hint: "예: 약간 분홍기·노란기 도는 따뜻한 흰 티를 입으면 피부가 더 맑아 보이는지 vs 약간 파란기 도는 차가운 흰 셔츠를 입으면 피부가 더 밝고 선명해 보이는지",
              options: [{ label: "핑크베이지, 밝고 맑은 느낌의 흰색", type: "라이트" }, { label: "푸른기가 살짝 도는 아이시한 흰색", type: "쿨" }] }
          : { q: "피부에 잘 어울리는 베이스 컬러는?",
              hint: "예: 메이크업이라면 핑크베이지 파운데이션 / 옷이라면 아이보리·핑크빛 흰 셔츠 vs 쿨베이지 쿠션 / 푸른기 도는 아이시한 흰 셔츠",
              options: [{ label: "핑크베이지, 투명하고 맑은 피부 톤", type: "라이트" }, { label: "블루언더톤이 있는 밝은 피부 톤", type: "쿨" }] },
        { q: "잘 어울리는 머리색은?",
          hint: "예: 차갑고 맑아 보이는 갈색(밝은 초콜릿빛) vs 약간 보라빛·회색빛이 살짝 섞인 어두운 갈색·회색",
          options: [{ label: "애쉬브라운, 자연스러운 쿨브라운", type: "트루" }, { label: "그레이 계열, 모브브라운", type: "소프트" }] },
        { q: "코디할 때 선호하는 방식은?",
          hint: "예: 화이트 블라우스+스카이블루 팬츠처럼 밝은 색 조합 vs 모카베이지+그레이처럼 전체 채도를 낮춘 코디",
          options: [{ label: "밝은 색끼리 조합하는 것이 자연스러움", type: "라이트" }, { label: "전반적으로 채도를 낮춘 코디가 어울림", type: "소프트" }] },
        { q: "포인트 컬러로 잘 받는 느낌은?",
          hint: "예: 로즈핑크 가방·라벤더 스카프 vs 아이스핑크 니트·아이스블루 코트",
          options: [{ label: "로즈, 핑크, 라벤더가 잘 맞음", type: "트루" }, { label: "아이스핑크, 아이스블루, 아이스민트가 더 잘 받음", type: "쿨" }] },
      ],
    },
    가을: {
      types: ["소프트", "트루", "웜", "딥"],
      questions: [
        { q: "피부에 맞는 분위기는?",
          hint: "예: 베이지색 니트·황토빛 팬츠처럼 밝고 부드럽게 가라앉은 흙빛 vs 갈색 코트·겨자색 목도리처럼 깊고 묵직한 흙빛",
          options: [{ label: "부드럽고 차분하게 가라앉은 어스톤", type: "소프트" }, { label: "깊고 풍성한 따뜻한 어스톤", type: "트루" }] },
        isMale
          ? { q: "포인트 소품이나 아이템에서 잘 받는 컬러는?",
              hint: "예: 구릿빛 갈색 벨트·벽돌 느낌의 주황-갈색 운동화가 잘 받음 vs 진한 초콜릿색 가방·어두운 와인색 자켓이 잘 받음",
              options: [{ label: "코퍼, 테라코타 계열 — 화사하게 어울림", type: "웜" }, { label: "초코, 딥브라운, 버건디 계열 — 자연스럽게 어울림", type: "딥" }] }
          : { q: "포인트 컬러는? (메이크업 또는 소품 기준)",
              hint: "예: 메이크업이라면 코퍼·테라코타 립·새도 / 소품이라면 테라코타 니트·코퍼 가방 vs 초코브라운·버건디 립스틱 / 버건디 코트·딥브라운 가방",
              options: [{ label: "코퍼, 테라코타 계열이 화사하게 어울림", type: "웜" }, { label: "초코, 딥브라운, 버건디가 자연스럽게 어울림", type: "딥" }] },
        { q: "잘 어울리는 머리색은?",
          hint: "예: 초록빛이 살짝 섞인 어두운 갈색(올리브빛 갈색) vs 꿀처럼 따뜻하고 빛나는 황금빛 갈색",
          options: [{ label: "모카브라운, 애쉬카키 계열", type: "소프트" }, { label: "카멜, 골든브라운 계열", type: "웜" }] },
        { q: "전체적인 인상은?",
          hint: "예: 고현정·정우성처럼 따뜻하고 자연스러운 느낌 vs 이병헌·김혜수처럼 강하고 묵직한 느낌",
          options: [{ label: "따뜻하고 자연스러운 어스 무드", type: "트루" }, { label: "강하고 묵직하며 깊은 무드", type: "딥" }] },
        { q: "잘 어울리는 상의 컬러는?",
          hint: "예: 황록빛 셔츠·크림색 니트·연갈색 자켓처럼 부드럽고 밝은 흙빛 계열 vs 진한 초록색 코트·거의 검정 같은 파란색 티·어두운 와인색 후드처럼 짙고 깊은 계열",
          options: [{ label: "카키, 모카베이지, 오트밀 계열", type: "소프트" }, { label: "딥그린, 다크네이비, 딥버건디 계열", type: "딥" }] },
        { q: "골드 액세서리나 메탈 소품을 착용했을 때?",
          hint: "예: 금반지를 끼면 피부가 포근하고 편안하게 어울리는 느낌 vs 금반지를 끼면 피부가 더 환하고 도드라져 보이는 느낌",
          options: [{ label: "따뜻하고 자연스럽게 어울림", type: "트루" }, { label: "생기있고 더욱 화사해 보임", type: "웜" }] },
      ],
    },
    겨울: {
      types: ["브라이트", "트루", "쿨", "딥"],
      questions: [
        { q: "어울리는 색의 강도는?",
          hint: "예: 비비드 빨간 패딩·형광 블루 가방 vs 블랙 자켓+화이트 셔츠 대비 코디",
          options: [{ label: "원색·비비드 계열이 훨씬 잘 맞음", type: "브라이트" }, { label: "블랙·화이트 강한 대비가 가장 잘 받음", type: "트루" }] },
        { q: "피부 느낌은?",
          hint: "예: 에스파 카리나·차은우처럼 밝고 투명한 느낌 vs 이병헌·김태리처럼 어둡고 강렬한 느낌",
          options: [{ label: "밝고 차갑고 투명한 느낌", type: "쿨" }, { label: "어둡고 강렬하고 깊은 느낌", type: "딥" }] },
        { q: "선호하는 포인트 컬러는?",
          hint: "예: 비비드 레드 코트·코발트블루 가방 vs 아이스블루 니트·라벤더 스카프",
          options: [{ label: "비비드 레드, 비비드 블루처럼 선명한 원색", type: "브라이트" }, { label: "아이스블루, 라벤더, 아이스핑크 같은 쿨 파스텔", type: "쿨" }] },
        { q: "블랙 아이템을 착용했을 때 느낌은?",
          hint: "예: 블랙 터틀넥을 입으면 세련되고 강렬해 보임 vs 블랙 롱코트를 입으면 고급스럽고 깊이 있어 보임",
          options: [{ label: "세련되고 강렬한 느낌이 강해짐", type: "트루" }, { label: "고급스럽고 깊이 있는 느낌이 강해짐", type: "딥" }] },
        { q: "선호하는 색감은?",
          hint: "예: 원색 빨강·원색 파랑·형광 계열 vs 딥퍼플·딥네이비·딥버건디 같은 짙은 색",
          options: [{ label: "비비드, 선명한 컬러가 생기있어 보임", type: "브라이트" }, { label: "딥퍼플, 딥네이비처럼 깊고 진한 색이 잘 맞음", type: "딥" }] },
        { q: "잘 어울리는 머리색은?",
          hint: "예: 새까만 검정 머리(파란빛 살짝 도는 진한 검정) vs 은빛·연회색이 살짝 섞인 밝은 회색 머리",
          options: [{ label: "블루블랙, 제트블랙이 가장 잘 어울림", type: "트루" }, { label: "애쉬, 플래티넘, 실버 계열이 잘 받음", type: "쿨" }] },
      ],
    },
  };
}

function calcSubtype(season, answers, step2Data) {
  const types = step2Data[season].types;
  const scores = Object.fromEntries(types.map((t) => [t, 0]));
  answers.forEach((t) => { if (t in scores) scores[t]++; });
  const sorted = [...types].sort((a, b) => scores[b] - scores[a]);
  const winnerScore = scores[sorted[0]];
  const secondScore = scores[sorted[1]];
  const fitPercent = Math.min(99, 60 + winnerScore * 10 + (winnerScore - secondScore) * 5);
  return { subtype: sorted[0], fitPercent, ranking: sorted, scores };
}

// ── 16타입 팔레트 & 코디 팁 ──────────────────────────────────────────────

const PC_DATA = {
  "봄 라이트": {
    palette: ["#FFCCA0", "#FFF0C0", "#C8F0E0", "#EED8F8", "#FFF8F0"],
    names:   ["소프트코럴", "버터크림", "민트크림", "소프트라일락", "크림아이보리"],
    tip: "밝고 가벼운 파스텔로 코디하세요. 피치·베이비핑크·민트가 피부를 맑게 살려줍니다.",
    avoid: "진한 어스톤, 딥브라운, 블랙 단독 착용은 무거워 보일 수 있어요.",
  },
  "봄 트루": {
    palette: ["#FF8870", "#FFB080", "#A0D870", "#A0D8F0", "#FFD8A0"],
    names:   ["코럴", "피치오렌지", "프레시그린", "아쿠아블루", "버터골드"],
    tip: "코럴, 피치, 골드 계열이 가장 잘 어울려요. 선명하고 따뜻한 스프링 컬러를 살리세요.",
    avoid: "무채색 단독, 차가운 네이비나 딥퍼플은 피하세요.",
  },
  "봄 웜": {
    palette: ["#FFD040", "#FF9040", "#FF8060", "#C88040", "#FFF0D0"],
    names:   ["골드옐로우", "오렌지", "웜코럴", "카멜", "크림"],
    tip: "골드, 오렌지, 테라코타 계열이 피부를 생기있게 해줘요. 따뜻하고 풍성한 팔레트를 활용하세요.",
    avoid: "차가운 화이트, 딥퍼플, 쿨그레이는 피하세요.",
  },
  "봄 브라이트": {
    palette: ["#FF3060", "#FF8000", "#FFD000", "#40C080", "#0080F0"],
    names:   ["비비드레드", "오렌지", "비비드옐로우", "비비드그린", "비비드블루"],
    tip: "원색과 비비드 계열이 가장 잘 맞아요. 밝고 선명한 포인트 컬러로 생동감을 살리세요.",
    avoid: "채도가 낮은 모노톤, 흐리고 부드러운 파스텔은 존재감이 사라져요.",
  },
  "여름 라이트": {
    palette: ["#E0D0F8", "#C0D8F0", "#FFD8E8", "#C0F0E8", "#F0F0F8"],
    names:   ["소프트라벤더", "파스텔블루", "소프트핑크", "소프트민트", "아이시화이트"],
    tip: "밝고 가벼운 쿨 파스텔이 잘 맞아요. 핑크베이지, 라벤더, 소프트블루로 산뜻하게 연출하세요.",
    avoid: "진한 어스톤, 원색, 황금빛은 피부를 탁하게 만들 수 있어요.",
  },
  "여름 트루": {
    palette: ["#D09090", "#A0C0E0", "#C0A8E0", "#C08088", "#F0B0C0"],
    names:   ["더스티로즈", "소프트블루", "모브라벤더", "로즈우드", "소프트핑크"],
    tip: "로즈, 모브, 라벤더 계열이 가장 잘 받아요. 차분하고 우아한 쿨 팔레트로 연출하세요.",
    avoid: "원색, 황금빛, 진한 오렌지 계열은 피하세요.",
  },
  "여름 쿨": {
    palette: ["#90C8F0", "#B0A0E8", "#F0C0D8", "#90E0D8", "#C0C8D8"],
    names:   ["아이스블루", "쿨라벤더", "아이스핑크", "아이스민트", "스틸블루그레이"],
    tip: "아이스블루, 라벤더, 아이스핑크 등 맑고 차가운 컬러가 피부를 투명하게 살려줘요.",
    avoid: "웜 어스톤, 오렌지, 골드는 피하세요.",
  },
  "여름 소프트": {
    palette: ["#B0A8C0", "#D0A8A8", "#A0C0B8", "#A0B098", "#C0C0C8"],
    names:   ["모브그레이", "더스티핑크", "소프트틸", "세이지그레이", "라벤더그레이"],
    tip: "저채도의 그레이시 컬러들이 부드럽게 어울려요. 모브, 모카, 그레이베이지로 차분하게 연출하세요.",
    avoid: "비비드 원색, 강한 대비, 선명한 색 조합은 피하세요.",
  },
  "가을 소프트": {
    palette: ["#909870", "#C09070", "#E0B090", "#889870", "#C0B0A0"],
    names:   ["올리브그린", "클레이", "아이보리베이지", "카키그린", "모카베이지"],
    tip: "오트밀, 카키, 모카베이지 등 부드러운 어스 컬러가 잘 어울려요. 저채도의 따뜻한 팔레트를 활용하세요.",
    avoid: "비비드 원색, 네온, 차가운 파스텔은 피하세요.",
  },
  "가을 트루": {
    palette: ["#C08840", "#C89020", "#C07030", "#708038", "#804830"],
    names:   ["카멜", "머스타드", "테라코타", "올리브", "쵸코브라운"],
    tip: "카멜, 머스타드, 테라코타 등 가을 어스 컬러가 가장 자연스러워요. 골드·코퍼 액세서리도 잘 어울려요.",
    avoid: "차가운 파스텔, 블루 계열, 쿨 그레이는 피하세요.",
  },
  "가을 웜": {
    palette: ["#C06040", "#C05820", "#B07030", "#A84028", "#A06030"],
    names:   ["테라코타", "번트오렌지", "코퍼", "버건디", "브릭레드"],
    tip: "코퍼, 테라코타, 번트오렌지가 피부를 생기있게 해줘요. 따뜻하고 풍성한 가을 팔레트를 활용하세요.",
    avoid: "차갑고 선명한 쿨 계열, 파스텔, 블루 계열은 피하세요.",
  },
  "가을 딥": {
    palette: ["#802030", "#503020", "#506030", "#907820", "#402818"],
    names:   ["딥버건디", "초콜릿브라운", "딥올리브", "다크골드", "에스프레소"],
    tip: "딥버건디, 딥그린, 다크브라운 등 진하고 풍성한 컬러가 잘 어울려요. 묵직하고 고급스러운 스타일을 연출하세요.",
    avoid: "파스텔, 밝은 색, 차가운 계열은 피하세요.",
  },
  "겨울 브라이트": {
    palette: ["#E01030", "#0030C0", "#8000C0", "#00A060", "#F8F8FF"],
    names:   ["비비드레드", "코발트블루", "비비드퍼플", "비비드그린", "아이시화이트"],
    tip: "비비드 레드, 코발트블루, 비비드 퍼플 등 원색이 가장 잘 맞아요. 대담하고 선명한 포인트 컬러를 활용하세요.",
    avoid: "채도 낮은 어스톤, 흐리고 부드러운 파스텔은 피하세요.",
  },
  "겨울 트루": {
    palette: ["#181820", "#F8F8FF", "#C01020", "#101840", "#800818"],
    names:   ["제트블랙", "퓨어화이트", "와인레드", "딥네이비", "딥버건디"],
    tip: "블랙, 화이트, 와인레드 등 강한 대비의 컬러가 가장 잘 받아요. 세련되고 강렬한 스타일을 연출하세요.",
    avoid: "웜 어스톤, 황금빛, 베이지 계열은 피하세요.",
  },
  "겨울 쿨": {
    palette: ["#80C0F0", "#C0B0F0", "#C0C8D0", "#80E0D8", "#F8E0F0"],
    names:   ["아이스블루", "아이스라벤더", "아이스그레이", "아이스민트", "아이스핑크"],
    tip: "아이스블루, 아이스라벤더, 아이스핑크 등 맑고 차가운 파스텔 계열이 잘 어울려요.",
    avoid: "웜 어스톤, 오렌지, 황금빛 계열은 피하세요.",
  },
  "겨울 딥": {
    palette: ["#0A1030", "#401068", "#400818", "#181828", "#104840"],
    names:   ["딥네이비", "딥퍼플", "딥버건디", "딥블랙네이비", "딥틸블랙"],
    tip: "딥퍼플, 딥네이비, 블랙 등 어둡고 깊은 컬러가 고급스럽게 어울려요. 묵직하고 강렬한 스타일을 연출하세요.",
    avoid: "밝고 따뜻한 계열, 파스텔, 황금빛은 피하세요.",
  },
};

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(PC_KEY)); } catch { return null; }
}

export default function TodayColorPalette({ condition, temp, profile, theme, darkMode }) {
  const accent = theme?.accent || "#E8543B";
  const isMale = profile?.gender !== "female";
  const step2Data = getStep2(isMale);

  const [open, toggleOpen] = useOpen("colorPalette", true);

  const initialSaved = (() => { try { return JSON.parse(localStorage.getItem(PC_KEY)); } catch { return null; } })();
  const [phase, setPhase] = useState(initialSaved ? "result" : "step1");
  const [step, setStep] = useState(0);
  const [step1Ans, setStep1Ans] = useState({});
  const [step2Ans, setStep2Ans] = useState([]);
  const [season, setSeason] = useState(initialSaved?.season ?? null);
  const [result, setResult] = useState(initialSaved);

  const handleStep1 = (value) => {
    const next = { ...step1Ans, [step]: value };
    setStep1Ans(next);
    if (step < STEP1_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      const s = calcSeason(next);
      setSeason(s);
      setStep(0);
      setPhase("step2");
    }
  };

  const handleStep2 = (type) => {
    const next = [...step2Ans, type];
    setStep2Ans(next);
    const totalQ = step2Data[season].questions.length;
    if (next.length < totalQ) {
      setStep(step + 1);
    } else {
      const { subtype, fitPercent, ranking, scores } = calcSubtype(season, next, step2Data);
      const res = { season, subtype, fullName: `${season} ${subtype}`, fitPercent, ranking, scores };
      setResult(res);
      setPhase("result");
      localStorage.setItem(PC_KEY, JSON.stringify(res));
    }
  };

  const handleBack = () => {
    if (phase === "step1" && step > 0) {
      const newAns = { ...step1Ans };
      delete newAns[step - 1];
      setStep1Ans(newAns);
      setStep(step - 1);
    } else if (phase === "step2") {
      if (step > 0) {
        setStep2Ans(step2Ans.slice(0, -1));
        setStep(step - 1);
      } else {
        const newAns = { ...step1Ans };
        delete newAns[STEP1_QUESTIONS.length - 1];
        setStep1Ans(newAns);
        setStep2Ans([]);
        setPhase("step1");
        setStep(STEP1_QUESTIONS.length - 1);
      }
    }
  };

  const reset = () => {
    setPhase("step1");
    setStep(0);
    setStep1Ans({});
    setStep2Ans([]);
    setSeason(null);
    setResult(null);
    localStorage.removeItem(PC_KEY);
  };

  const pcData = result ? PC_DATA[result.fullName] : null;
  const qText = darkMode ? "#DDD7CC" : "#1A1A1A";
  const borderColor = darkMode ? "#4a4540" : "#D7D0C4";
  const hoverBg = darkMode ? "#2c2a26" : "#EEE9E0";

  return (
    <section className="mt-6 border border-[#E5DED1] bg-[#FAF8F3] p-5">
      {/* 헤더 */}
      <button type="button" onClick={toggleOpen} className="flex w-full items-start justify-between mb-3">
        <div className="text-left">
          <div className="wf-label text-[#3A362E]" style={{ fontSize: "13px" }}>퍼스널컬러 16타입 진단</div>
          <p className="mt-1 text-sm text-[#4A4540] leading-5">
            2단계 진단으로 나에게 맞는 퍼스널컬러 타입을 찾아보세요.
            {result && <span style={{ color: accent }}> · 현재: {result.fullName}</span>}
          </p>
        </div>
        <span className="ml-3 shrink-0" style={{ fontSize: "13px", border: "0.5px solid #D7D0C4", borderRadius: "4px", padding: "2px 8px", color: "#6B665C" }}>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && <div className="border-t border-[#E5DED1] pt-4 mb-4" />}

      {/* ── 1단계 ── */}
      {open && phase === "step1" && (
        <div>
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="wf-label text-[#3A362E]" style={{ fontSize: "15px" }}>
                1단계 · 기본 피부톤 파악
              </span>
              <span className="text-sm font-semibold text-[#4A4540]">
                {step + 1} / {STEP1_QUESTIONS.length}
              </span>
            </div>
            <div className="h-1.5 bg-[#F0EBE0]">
              <div className="h-full transition-all" style={{ width: `${(step / STEP1_QUESTIONS.length) * 100}%`, background: accent }} />
            </div>
          </div>

          <p className="text-lg font-bold leading-7" style={{ color: qText }}>{STEP1_QUESTIONS[step].q}</p>
          {STEP1_QUESTIONS[step].hint && (
            <p className="mt-1.5 text-sm text-[#4A4540] leading-6">{STEP1_QUESTIONS[step].hint}</p>
          )}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {STEP1_QUESTIONS[step].options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleStep1(opt.value)}
                className="border py-5 text-base font-semibold transition"
                style={{ borderColor, color: darkMode ? "#DDD7CC" : "#3A362E" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.borderColor = qText; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = borderColor; }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button type="button" onClick={handleBack} className="mt-3 text-sm text-[#6B665C] underline underline-offset-2">
              ← 이전 질문으로
            </button>
          )}
        </div>
      )}

      {/* ── 2단계 ── */}
      {open && phase === "step2" && season && (
        <div>
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="wf-label text-[#3A362E]" style={{ fontSize: "15px" }}>
                2단계 · {season} 서브타입 진단
              </span>
              <span className="text-sm font-semibold text-[#4A4540]">
                {step + 1} / {step2Data[season].questions.length}
              </span>
            </div>
            <div className="h-1.5 bg-[#F0EBE0]">
              <div className="h-full transition-all" style={{ width: `${(step / step2Data[season].questions.length) * 100}%`, background: accent }} />
            </div>
          </div>

          <div className="mb-3 text-sm font-semibold" style={{ color: accent }}>
            ✦ 1단계 결과: {season} 시즌 — 이제 세부 타입을 찾아볼게요
          </div>

          <p className="text-lg font-bold leading-7" style={{ color: qText }}>
            {step2Data[season].questions[step].q}
          </p>
          {step2Data[season].questions[step].hint && (
            <p className="mt-1.5 text-sm text-[#4A4540] leading-6">
              {step2Data[season].questions[step].hint}
            </p>
          )}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {step2Data[season].questions[step].options.map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => handleStep2(opt.type)}
                className="border py-5 text-base font-semibold transition"
                style={{ borderColor, color: darkMode ? "#DDD7CC" : "#3A362E" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.borderColor = qText; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = borderColor; }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={handleBack} className="mt-3 text-sm text-[#6B665C] underline underline-offset-2">
            ← 이전 질문으로
          </button>
        </div>
      )}

      {/* ── 결과 ── */}
      {open && phase === "result" && result && pcData && (
        <div>
          {/* 타입 헤더 */}
          <div className="border-l-4 pl-4 py-2 mb-5" style={{ borderColor: accent }}>
            <div className="wf-label mb-1" style={{ fontSize: "15px", color: accent }}>내 퍼스널컬러</div>
            <p className="text-2xl font-bold" style={{ color: qText }}>{result.fullName}</p>
            <div className="mt-1 flex items-center gap-3">
              <span className="text-base font-semibold" style={{ color: accent }}>적합도 {result.fitPercent}%</span>
              <span className="text-sm text-[#4A4540]">· {result.season} 시즌</span>
            </div>
          </div>

          {/* Top 3 */}
          <div className="mb-5 grid grid-cols-3 gap-2">
            {result.ranking.slice(0, 3).map((t, i) => (
              <div
                key={t}
                className="border px-2 py-3 text-center"
                style={{
                  borderColor: i === 0 ? accent : (darkMode ? "#4a4540" : "#E5DED1"),
                  background: i === 0 ? `${accent}12` : "transparent",
                }}
              >
                <div className="text-sm font-bold mb-1" style={{ color: i === 0 ? accent : "#4A4540" }}>
                  {i === 0 ? "1위" : i === 1 ? "2위" : "3위"}
                </div>
                <div className="text-base font-semibold" style={{ color: qText }}>{result.season} {t}</div>
                <div className="text-sm text-[#4A4540] mt-0.5">{result.scores[t]} / 3점</div>
              </div>
            ))}
          </div>

          {/* 팔레트 */}
          <div className="mb-4">
            <div className="wf-label mb-3 text-[#3A362E]" style={{ fontSize: "15px" }}>추천 팔레트</div>
            <div className="grid grid-cols-5 gap-2">
              {pcData.palette.map((hex, i) => (
                <div key={i}>
                  <div className="h-16 w-full border border-black/10" style={{ background: hex }} />
                  <div className="bg-[#EEEBE4] px-1 py-1.5 text-center">
                    <span className="block text-xs font-bold text-[#1A1A1A] leading-tight">{pcData.names[i]}</span>
                    <span className="block text-xs text-[#4A4540] mt-0.5">{hex}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 팁 */}
          <div className="mb-2 border-l-2 pl-3 text-base font-medium leading-7 text-[#3A362E]" style={{ borderColor: accent }}>
            {pcData.tip}
          </div>
          <p className="mb-5 text-sm leading-6 text-[#4A4540]">
            <span className="font-semibold text-[#3A362E]">피하면 좋은 컬러: </span>{pcData.avoid}
          </p>

          <button
            type="button"
            onClick={reset}
            className="border px-4 py-2 text-sm font-semibold transition"
            style={{ borderColor, color: "#3A362E" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = qText; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = borderColor; }}
          >
            다시 테스트하기
          </button>
        </div>
      )}
    </section>
  );
}
