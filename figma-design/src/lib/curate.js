const BANDS = [
  {
    min: 28,
    outer: null,
    top: ["민소매", "반팔"],
    bottom: ["반바지", "린넨 팬츠"],
    shoes: "샌들·로퍼",
    note: "가볍고 통기성 좋은 소재로 시원하게.",
  },
  {
    min: 23,
    outer: null,
    top: ["반팔", "얇은 셔츠"],
    bottom: ["반바지", "면바지"],
    shoes: "스니커즈",
    note: "린넨·코튼 위주로 쾌적하게.",
  },
  {
    min: 20,
    outer: "얇은 가디건",
    top: ["긴팔", "얇은 셔츠"],
    bottom: ["슬랙스", "면바지"],
    shoes: "스니커즈",
    note: "아침저녁 대비 겉옷 하나.",
  },
  {
    min: 17,
    outer: "얇은 자켓",
    top: ["맨투맨", "얇은 니트"],
    bottom: ["청바지", "슬랙스"],
    shoes: "스니커즈·로퍼",
    note: "레이어링 시작하기 좋은 날씨.",
  },
  {
    min: 12,
    outer: "자켓·야상",
    top: ["니트", "맨투맨"],
    bottom: ["청바지", "치노"],
    shoes: "스니커즈·부츠",
    note: "겉옷 여닫기로 온도 조절.",
  },
  {
    min: 9,
    outer: "트렌치·야상",
    top: ["니트", "기모 후드"],
    bottom: ["청바지"],
    shoes: "부츠·스니커즈",
    note: "바람 막아주는 아우터를 챙기기.",
  },
  {
    min: 5,
    outer: "코트·가죽자켓",
    top: ["두꺼운 니트", "히트텍+상의"],
    bottom: ["기모 청바지", "슬랙스"],
    shoes: "부츠",
    note: "이너로 보온 챙기기.",
  },
  {
    min: -50,
    outer: "패딩·두꺼운 코트",
    top: ["기모 니트", "히트텍 레이어"],
    bottom: ["기모 팬츠"],
    shoes: "부츠",
    note: "목도리·장갑까지 챙기기.",
  },
];

const MOOD_TONES = {
  minimal: {
    accessory: "블랙 톤온톤 가방·그레이 미니멀 캡",
    comment: "무채색·뉴트럴 톤으로 깔끔한 핏을 추천해요.",
    shoes: "로퍼·미니멀 스니커즈",
  },
  casual: {
    accessory: "아이보리 에코백·네이비 볼캡",
    comment: "데님·코튼 중심의 편안한 데일리룩이 잘 맞아요.",
    shoes: "스니커즈",
  },
  street: {
    accessory: "블랙 캡·차콜 크로스백·화이트 양말 포인트",
    comment: "오버핏과 레이어드로 볼륨감 있게 가져가세요.",
    shoes: "청키 스니커즈·부츠",
  },
  formal: {
    accessory: "블랙 가죽 벨트·실버 심플 워치",
    comment: "셔츠와 정돈된 실루엣으로 단정한 인상을 추천해요.",
    shoes: "로퍼·더비슈즈",
  },
  sporty: {
    accessory: "블랙 나일론 백·쿨그레이 볼캡",
    comment: "움직임이 편한 소재와 가벼운 레이어를 추천해요.",
    shoes: "러닝화·스니커즈",
  },
};

const GENDER_TWEAKS = {
  male: {
    formalTop: "옥스포드 셔츠",
    formalBottom: "테이퍼드 슬랙스",
    warmLayer: "얇은 셔츠 재킷",
  },
  female: {
    formalTop: "블라우스",
    formalBottom: "와이드 슬랙스·스커트",
    warmLayer: "얇은 니트 가디건",
  },
  unisex: {
    formalTop: "셔츠",
    formalBottom: "와이드 팬츠",
    warmLayer: "얇은 셔츠",
  },
};

const COLOR_PALETTES = {
  neutral: {
    name: "무채색",
    accessory: "블랙 양말·그레이 미니백",
    colorNames: ["블랙", "아이보리", "그레이"],
    colors: ["#111111", "#F5F1E8", "#8C8C86"],
    text: "블랙, 아이보리, 그레이로 정돈된 인상을 만듭니다.",
  },
  bright: {
    name: "밝은 톤",
    accessory: "아이보리 양말·스카이블루 에코백",
    colorNames: ["아이보리", "스카이블루", "화이트"],
    colors: ["#F7F2D8", "#BFD7EA", "#FFFFFF"],
    text: "아이보리와 라이트블루를 중심으로 산뜻하게 보입니다.",
  },
  calm: {
    name: "차분한 톤",
    accessory: "네이비 양말·세이지 캔버스백",
    colorNames: ["네이비", "세이지", "베이지"],
    colors: ["#283747", "#7C8B5A", "#D8D0C2"],
    text: "네이비, 세이지, 베이지 조합으로 안정적인 분위기를 줍니다.",
  },
  point: {
    name: "포인트 컬러",
    accessory: "블랙 양말·버터 옐로 미니백",
    colorNames: ["블랙", "아이보리", "버터 옐로"],
    colors: ["#1A1A1A", "#EDE7DA", "#F4DF8A"],
    text: "기본색을 깔고 감색 포인트를 하나만 넣어 완성도를 높입니다.",
  },
};

const COLOR_HEX = {
  블랙: "#111111",
  차콜: "#3A3A3A",
  그레이: "#9A9A9A",
  쿨그레이: "#A8B0B7",
  라이트그레이: "#C9CDD0",
  화이트: "#FFFFFF",
  아이보리: "#F5F1D8",
  크림: "#F2E8CF",
  베이지: "#CBB89D",
  네이비: "#1F2E46",
  스카이블루: "#9FC7E8",
  라이트블루: "#AFCFEA",
  세이지: "#8A9A70",
  카키: "#77724F",
  브라운: "#6B4A34",
  다크브라운: "#4A2F23",
  "버터 옐로": "#F4DF8A",
  실버: "#C9CDD2",
};

const COLOR_TONE_RULES = {
  neutral: {
    top: "화이트",
    bottom: "차콜",
    outer: "라이트그레이",
    shoes: "블랙",
    accessory: "그레이",
    text: "무채색 선택이라 블랙·화이트·그레이 중심으로 정돈했습니다.",
  },
  bright: {
    top: "아이보리",
    bottom: "라이트블루",
    outer: "화이트",
    shoes: "아이보리",
    accessory: "스카이블루",
    text: "밝은 톤 선택이라 블랙 계열을 줄이고 아이보리·스카이블루 중심으로 맞췄습니다.",
  },
  calm: {
    top: "크림",
    bottom: "네이비",
    outer: "세이지",
    shoes: "브라운",
    accessory: "베이지",
    text: "차분한 톤 선택이라 네이비·세이지·베이지 중심으로 안정감을 줬습니다.",
  },
  point: {
    top: "화이트",
    bottom: "차콜",
    outer: "아이보리",
    shoes: "블랙",
    accessory: "버터 옐로",
    text: "포인트 컬러 선택이라 기본색 위에 버터 옐로 포인트를 하나 넣었습니다.",
  },
};

const MAIN_COLOR_RULES = {
  auto: null,
  ivory: { label: "아이보리", hex: COLOR_HEX.아이보리 },
  skyblue: { label: "스카이블루", hex: COLOR_HEX.스카이블루 },
  butter: { label: "버터 옐로", hex: COLOR_HEX["버터 옐로"] },
  sage: { label: "세이지", hex: COLOR_HEX.세이지 },
  navy: { label: "네이비", hex: COLOR_HEX.네이비 },
  black: { label: "블랙", hex: COLOR_HEX.블랙 },
};

const CUSTOM_COLOR_HEX = {
  라벤더: "#B8A7D9",
  민트: "#A9D8C2",
  버건디: "#7B263A",
  핑크: "#F2A7B5",
  레드: "#C9443E",
  오렌지: "#E68A3A",
  옐로: "#F4DF8A",
  퍼플: "#7B5FA3",
  블루: "#5B8FC9",
  그린: "#6F9A72",
};

const COLOR_WORDS = [
  "다크브라운",
  "라이트그레이",
  "라이트블루",
  "미디엄블루",
  "스카이블루",
  "쿨그레이",
  "버터 옐로",
  "오프화이트",
  "아이보리",
  "차콜",
  "블랙",
  "화이트",
  "크림",
  "베이지",
  "그레이",
  "네이비",
  "세이지",
  "카키",
  "브라운",
  "인디고",
  "실버",
  "스톤",
];

function preferredPalette(profile) {
  const base = COLOR_PALETTES[profile.colorTone] || COLOR_PALETTES.neutral;
  const rules = COLOR_TONE_RULES[profile.colorTone] || COLOR_TONE_RULES.neutral;
  const selected =
    profile.mainColor === "custom" && profile.customColor?.trim()
      ? {
          label: profile.customColor.trim(),
          hex: CUSTOM_COLOR_HEX[profile.customColor.trim()] || "#CBB89D",
        }
      : MAIN_COLOR_RULES[profile.mainColor || "auto"];

  if (!selected) {
    return { ...base, text: `${base.text} ${rules.text}` };
  }

  return {
    ...base,
    name: `${base.name} · ${selected.label}`,
    colorNames: [selected.label, rules.top, rules.bottom],
    colors: [selected.hex, COLOR_HEX[rules.top], COLOR_HEX[rules.bottom]].filter(Boolean),
    accessory: `${selected.label} 미니백·${rules.shoes} 양말`,
    text: `${selected.label}를 중심색으로 두고 ${rules.top}, ${rules.bottom} 계열로 균형을 맞춥니다.`,
  };
}

function preferredColor(profile, role, index = 0) {
  const rules = COLOR_TONE_RULES[profile.colorTone] || COLOR_TONE_RULES.neutral;
  const selected =
    profile.mainColor === "custom" && profile.customColor?.trim()
      ? { label: profile.customColor.trim() }
      : MAIN_COLOR_RULES[profile.mainColor || "auto"];
  if (selected && (role === "top" || role === "outer" || role === "accessory") && index === 0) {
    return selected.label;
  }
  return rules[role] || rules.top;
}

function applyPreferredColor(item, profile, role, index = 0) {
  if (!item || item === "레이어 생략") return item;
  const color = preferredColor(profile, role, index);
  const existing = COLOR_WORDS.find((word) => item.includes(word));
  if (existing) return item.replace(existing, color);
  return `${color} ${item}`;
}

function applyPaletteColor(item, color) {
  if (!item || item === "레이어 생략" || !color) return item;
  const existing = COLOR_WORDS.find((word) => item.includes(word));
  if (existing) return item.replace(existing, color);
  return `${color} ${item}`;
}

const DETAIL_GUIDE = {
  minimal: {
    top: {
      hot: ["오프화이트 린넨 반팔 셔츠", "블랙 수피마 코튼 티셔츠"],
      mild: ["아이보리 얇은 니트", "라이트그레이 긴팔 티셔츠"],
      cold: ["차콜 미들게이지 니트", "블랙 기모 스웨트셔츠"],
    },
    bottom: {
      hot: ["차콜 무릎 위 3cm 테일러드 쇼츠", "베이지 원턱 버뮤다 쇼츠"],
      mild: ["차콜 세미와이드 슬랙스", "크림 스트레이트 데님"],
      cold: ["블랙 울 블렌드 슬랙스", "딥인디고 기모 데님"],
    },
    outer: {
      hot: "냉방 대비 라이트그레이 린넨 셔츠",
      mild: "세이지 얇은 코튼 자켓",
      cold: "차콜 싱글 코트",
    },
    shoes: {
      hot: "화이트 슬림솔 스니커즈 또는 블랙 레더 샌들",
      mild: "블랙 로퍼 또는 미니멀 스니커즈",
      cold: "블랙 첼시 부츠",
    },
  },
  casual: {
    top: {
      hot: ["화이트 코튼 반팔 티셔츠", "스카이블루 오픈카라 셔츠"],
      mild: ["네이비 맨투맨", "스트라이프 긴팔 티셔츠"],
      cold: ["크림 후디", "그레이 기모 스웨트셔츠"],
    },
    bottom: {
      hot: ["라이트블루 무릎선 데님 조츠", "네이비 코튼 버뮤다 쇼츠"],
      mild: ["미디엄블루 스트레이트 데님", "카키 코튼 치노 팬츠"],
      cold: ["인디고 기모 데님", "브라운 코듀로이 팬츠"],
    },
    outer: {
      hot: "냉방 대비 화이트 코튼 셔츠",
      mild: "워시드 데님 자켓",
      cold: "네이비 퀼팅 자켓",
    },
    shoes: {
      hot: "아이보리 로우프로파일 스니커즈",
      mild: "화이트 스니커즈",
      cold: "브라운 스웨이드 스니커즈",
    },
  },
  street: {
    top: {
      hot: ["차콜 오버핏 그래픽 티셔츠", "화이트 박시 슬리브리스"],
      mild: ["오버핏 후드 티셔츠", "레이어드 롱슬리브 티셔츠"],
      cold: ["헤비웨이트 후디", "오버핏 기모 맨투맨"],
    },
    bottom: {
      hot: ["블랙 와이드 버뮤다 쇼츠", "워시드 데님 롱 조츠"],
      mild: ["블랙 와이드 카고 팬츠", "워시드 와이드 데님"],
      cold: ["차콜 벌룬 팬츠", "블랙 기모 와이드 팬츠"],
    },
    outer: {
      hot: "냉방 대비 나일론 라이트 셔츠",
      mild: "오버핏 나일론 윈드브레이커",
      cold: "블랙 숏 패딩",
    },
    shoes: {
      hot: "실버 포인트 러닝 스니커즈",
      mild: "청키 스니커즈",
      cold: "블랙 워커 부츠",
    },
  },
  formal: {
    top: {
      hot: ["버터 옐로 반팔 니트", "화이트 린넨 셔츠"],
      mild: ["화이트 옥스포드 셔츠", "스카이블루 드레스 셔츠"],
      cold: ["아이보리 터틀넥 니트", "차콜 파인울 니트"],
    },
    bottom: {
      hot: ["베이지 무릎선 테일러드 버뮤다 쇼츠", "차콜 원턱 하프 슬랙스"],
      mild: ["차콜 투턱 와이드 슬랙스", "네이비 세미와이드 슬랙스"],
      cold: ["블랙 울 슬랙스", "딥브라운 와이드 트라우저"],
    },
    outer: {
      hot: "냉방 대비 네이비 린넨 블레이저",
      mild: "네이비 언컨스트럭티드 블레이저",
      cold: "카멜 울 코트",
    },
    shoes: {
      hot: "블랙 레더 샌들 또는 슬림 로퍼",
      mild: "블랙 로퍼",
      cold: "다크브라운 더비슈즈",
    },
  },
  sporty: {
    top: {
      hot: ["쿨그레이 기능성 반팔 티셔츠", "화이트 메시 티셔츠"],
      mild: ["라이트 나일론 아노락", "집업 트랙 탑"],
      cold: ["플리스 하프집업", "기모 트레이닝 스웨트셔츠"],
    },
    bottom: {
      hot: ["블랙 5인치 러닝 쇼츠", "스톤 컬러 나일론 쇼츠"],
      mild: ["블랙 조거 팬츠", "그레이 스트레치 팬츠"],
      cold: ["기모 조거 팬츠", "블랙 웜업 팬츠"],
    },
    outer: {
      hot: "초경량 바람막이 셔츠",
      mild: "나일론 윈드브레이커",
      cold: "경량 패딩 베스트",
    },
    shoes: {
      hot: "메시 러닝화",
      mild: "로우프로파일 트레이닝화",
      cold: "쿠션감 있는 러닝화",
    },
  },
};

const FEMALE_DETAIL_GUIDE = {
  minimal: {
    top: {
      hot: ["아이보리 린넨 슬리브리스 블라우스 (민소매 상의)", "블랙 수피마 코튼 반팔 티셔츠 (반팔)"],
      mild: ["크림 얇은 니트 가디건 (얇은 겉옷)", "라이트그레이 보트넥 긴팔 티셔츠 (긴팔)"],
      cold: ["차콜 미들게이지 니트 (두꺼운 니트)", "블랙 기모 스웨트셔츠 (따뜻한 상의)"],
    },
    bottom: {
      hot: ["아이보리 린넨 버뮤다 쇼츠 (무릎길이 반바지)", "블랙 A라인 미디 스커트 (종아리 아래 스커트)"],
      mild: ["차콜 세미와이드 슬랙스 (긴바지)", "크림 스트레이트 데님 (긴 청바지)"],
      cold: ["블랙 울 블렌드 슬랙스 (긴바지)", "딥인디고 기모 데님 (따뜻한 청바지)"],
    },
    outer: {
      hot: "냉방 대비 라이트그레이 린넨 셔츠 (얇은 겉옷)",
      mild: "세이지 크롭 코튼 자켓 (짧은 겉옷)",
      cold: "차콜 싱글 코트 (긴 겉옷)",
    },
    shoes: {
      hot: "아이보리 슬림 플랫슈즈 (낮은 신발)",
      mild: "블랙 로퍼 (단정한 구두)",
      cold: "블랙 앵클부츠 (발목 부츠)",
    },
  },
  casual: {
    top: {
      hot: ["화이트 코튼 반팔 티셔츠 (반팔)", "스카이블루 오픈카라 블라우스 (얇은 셔츠)"],
      mild: ["네이비 맨투맨 (편한 긴팔)", "스트라이프 긴팔 티셔츠 (긴팔)"],
      cold: ["크림 후디 (후드티)", "그레이 기모 스웨트셔츠 (따뜻한 상의)"],
    },
    bottom: {
      hot: ["라이트블루 무릎선 데님 조츠 (긴 반바지)", "화이트 코튼 롱스커트 (긴 치마)"],
      mild: ["미디엄블루 스트레이트 데님 (긴 청바지)", "카키 코튼 치노 팬츠 (긴바지)"],
      cold: ["인디고 기모 데님 (따뜻한 청바지)", "브라운 코듀로이 팬츠 (긴바지)"],
    },
    outer: {
      hot: "냉방 대비 화이트 코튼 셔츠 (얇은 겉옷)",
      mild: "워시드 데님 자켓 (청자켓)",
      cold: "네이비 퀼팅 자켓 (누빔 겉옷)",
    },
    shoes: {
      hot: "아이보리 로우프로파일 스니커즈 (낮은 운동화)",
      mild: "화이트 스니커즈 (운동화)",
      cold: "브라운 스웨이드 스니커즈 (운동화)",
    },
  },
  street: {
    top: {
      hot: ["차콜 오버핏 그래픽 티셔츠 (큰 반팔)", "화이트 박시 슬리브리스 (박스핏 민소매)"],
      mild: ["오버핏 후드 티셔츠 (큰 후드티)", "레이어드 롱슬리브 티셔츠 (긴팔)"],
      cold: ["헤비웨이트 후디 (두꺼운 후드티)", "오버핏 기모 맨투맨 (따뜻한 긴팔)"],
    },
    bottom: {
      hot: ["블랙 와이드 버뮤다 쇼츠 (넓은 무릎길이 반바지)", "워시드 데님 롱 조츠 (긴 청반바지)"],
      mild: ["블랙 와이드 카고 팬츠 (주머니 많은 긴바지)", "워시드 와이드 데님 (넓은 청바지)"],
      cold: ["차콜 벌룬 팬츠 (둥근 핏 긴바지)", "블랙 기모 와이드 팬츠 (따뜻한 긴바지)"],
    },
    outer: {
      hot: "냉방 대비 나일론 라이트 셔츠 (얇은 겉옷)",
      mild: "오버핏 나일론 윈드브레이커 (바람막이)",
      cold: "블랙 숏 패딩 (짧은 패딩)",
    },
    shoes: {
      hot: "실버 포인트 러닝 스니커즈 (운동화)",
      mild: "청키 스니커즈 (두꺼운 운동화)",
      cold: "블랙 워커 부츠 (부츠)",
    },
  },
  formal: {
    top: {
      hot: ["버터 옐로 반팔 니트 (얇은 반팔 니트)", "화이트 린넨 블라우스 (얇은 셔츠)"],
      mild: ["화이트 타이넥 블라우스 (리본 블라우스)", "스카이블루 드레스 셔츠 (단정한 셔츠)"],
      cold: ["아이보리 터틀넥 니트 (목폴라)", "차콜 파인울 니트 (얇은 울 니트)"],
    },
    bottom: {
      hot: ["베이지 무릎선 테일러드 버뮤다 쇼츠 (단정한 반바지)", "차콜 H라인 미디 스커트 (종아리 아래 치마)"],
      mild: ["차콜 투턱 와이드 슬랙스 (넓은 긴바지)", "네이비 세미와이드 슬랙스 (긴바지)"],
      cold: ["블랙 울 슬랙스 (긴바지)", "딥브라운 와이드 트라우저 (넓은 긴바지)"],
    },
    outer: {
      hot: "냉방 대비 네이비 린넨 블레이저 (얇은 자켓)",
      mild: "네이비 언컨스트럭티드 블레이저 (가벼운 자켓)",
      cold: "카멜 울 코트 (긴 코트)",
    },
    shoes: {
      hot: "블랙 메리제인 플랫 (낮은 구두)",
      mild: "블랙 로퍼 (단정한 구두)",
      cold: "다크브라운 앵클부츠 (발목 부츠)",
    },
  },
  sporty: {
    top: {
      hot: ["쿨그레이 기능성 반팔 티셔츠 (운동 반팔)", "화이트 메시 티셔츠 (통기성 반팔)"],
      mild: ["라이트 나일론 아노락 (얇은 바람막이)", "집업 트랙 탑 (운동 집업)"],
      cold: ["플리스 하프집업 (따뜻한 집업)", "기모 트레이닝 스웨트셔츠 (따뜻한 상의)"],
    },
    bottom: {
      hot: ["블랙 5인치 러닝 쇼츠 (짧은 반바지)", "스톤 컬러 나일론 쇼츠 (가벼운 반바지)"],
      mild: ["블랙 조거 팬츠 (발목 조이는 긴바지)", "그레이 스트레치 팬츠 (편한 긴바지)"],
      cold: ["기모 조거 팬츠 (따뜻한 긴바지)", "블랙 웜업 팬츠 (운동 긴바지)"],
    },
    outer: {
      hot: "초경량 바람막이 셔츠 (얇은 겉옷)",
      mild: "나일론 윈드브레이커 (바람막이)",
      cold: "경량 패딩 베스트 (조끼 패딩)",
    },
    shoes: {
      hot: "메시 러닝화 (운동화)",
      mild: "로우프로파일 트레이닝화 (낮은 운동화)",
      cold: "쿠션감 있는 러닝화 (운동화)",
    },
  },
};

const PLAIN_HINTS = [
  ["조츠", "긴 청반바지"],
  ["버뮤다 쇼츠", "무릎길이 반바지"],
  ["테일러드 쇼츠", "단정한 반바지"],
  ["러닝 쇼츠", "짧은 반바지"],
  ["나일론 쇼츠", "가벼운 반바지"],
  ["슬랙스", "긴바지"],
  ["트라우저", "긴바지"],
  ["팬츠", "긴바지"],
  ["데님", "청바지"],
  ["스커트", "치마"],
  ["블라우스", "셔츠형 상의"],
  ["슬리브리스", "민소매"],
  ["후디", "후드티"],
  ["윈드브레이커", "바람막이"],
  ["블레이저", "자켓"],
  ["로퍼", "단정한 구두"],
  ["스니커즈", "운동화"],
  ["플랫", "낮은 구두"],
  ["부츠", "부츠"],
];

function withPlainHint(item) {
  if (!item || item.includes("(")) return item;
  const match = PLAIN_HINTS.find(([keyword]) => item.includes(keyword));
  return match ? `${item} (${match[1]})` : item;
}

function adjustFeels(feels, sensitivity) {
  if (sensitivity === "cold") return feels - 2;
  if (sensitivity === "heat") return feels + 2;
  return feels;
}

function tempKey(feels) {
  if (feels >= 23) return "hot";
  if (feels >= 12) return "mild";
  return "cold";
}

function detailedItems({ feels, mood, profile, isWet, gap }) {
  const key = tempKey(feels);
  const guide = profile.gender === "female" ? FEMALE_DETAIL_GUIDE[mood] || FEMALE_DETAIL_GUIDE.minimal : DETAIL_GUIDE[mood] || DETAIL_GUIDE.minimal;
  const genderPrefix = profile.gender === "male" ? "깔끔한 남성 핏의 " : "";
  const top = guide.top[key].map((item, index) =>
    withPlainHint(applyPreferredColor(`${genderPrefix}${item}`, profile, "top", index))
  );
  const bottom = guide.bottom[key].map((item, index) =>
    withPlainHint(applyPreferredColor(item, profile, "bottom", index))
  );
  const shoes = withPlainHint(applyPreferredColor(guide.shoes[key], profile, "shoes"));
  let outer = null;

  if (gap >= 8 || isWet || feels < 23) {
    outer = withPlainHint(applyPreferredColor(guide.outer[key], profile, "outer"));
  }

  if (isWet) {
    outer = outer ? `방수 처리 가능한 ${outer}` : "차콜 방수 윈드브레이커 (바람막이)";
  }

  return { top, bottom, outer, shoes };
}

function outfitName(mood, index) {
  const names = {
    minimal: ["톤 정리 미니멀", "린넨 클린룩", "모노 밸런스"],
    casual: ["주말 데일리", "데님 캐주얼", "가벼운 시티룩"],
    street: ["롱 쇼츠 스트릿", "나일론 레이어드", "그래픽 포인트"],
    formal: ["쿨 비즈 포멀", "린넨 셋업 무드", "정돈된 출근룩"],
    sporty: ["라이트 액티브", "러닝 캐주얼", "나일론 스포츠"],
  };
  return (names[mood] || names.minimal)[index];
}

function makeOutfits({ detail, outer, accessory, mood, palette, reasons, isWet, gap, feels, profile }) {
  const topOptions = detail.top.length ? detail.top : ["기본 상의"];
  const bottomOptions = detail.bottom.length ? detail.bottom : ["기본 하의"];
  const shoeOptions =
    typeof detail.shoes === "string" && detail.shoes.includes(" 또는 ")
      ? detail.shoes.split(" 또는 ")
      : [detail.shoes];
  const layerOptions = [
    outer,
    feels >= 23 ? "레이어 생략" : outer,
    gap >= 8 ? outer : "레이어 생략",
  ];

  return [0, 1, 2].map((index) => {
    const paletteColors = palette.colorNames || ["블랙", "아이보리", "그레이"];
    const pickedOuter = layerOptions[index] || outer || "레이어 생략";
    const top = applyPaletteColor(topOptions[index % topOptions.length], paletteColors[index % 3]);
    const bottom = applyPaletteColor(bottomOptions[index % bottomOptions.length], paletteColors[(index + 1) % 3]);
    const shoes = applyPaletteColor(shoeOptions[index % shoeOptions.length] || detail.shoes, paletteColors[(index + 2) % 3]);
    const point =
      index === 0
        ? applyPaletteColor(accessory, paletteColors[2])
        : index === 1
          ? palette.accessory
          : isWet
          ? profile?.colorTone === "bright"
            ? "스카이블루 우산·아이보리 방수 파우치"
            : "네이비 우산·차콜 방수 파우치"
            : "실버 주얼리·얇은 벨트";

    return {
      id: `${mood}-${index}`,
      title: outfitName(mood, index),
      outer: pickedOuter,
      top,
      bottom,
      shoes,
      accessory: point,
      reasons,
    };
  });
}

export function curate({ feels, isWet, gap, mood, profile = {} }) {
  const adjustedFeels = adjustFeels(feels, profile.sensitivity);
  const band = BANDS.find((item) => adjustedFeels >= item.min);
  const tone = MOOD_TONES[mood] || MOOD_TONES.minimal;
  const gender = GENDER_TWEAKS[profile.gender] || GENDER_TWEAKS.unisex;
  const palette = preferredPalette(profile);
  const reasons = [`체감 ${Math.round(feels)}°`];
  const insights = [
    `실제 추천은 체감온도 ${Math.round(feels)}°를 기준으로 두께를 먼저 정합니다.`,
  ];

  const detail = detailedItems({ feels, mood, profile, isWet, gap });
  let outer = detail.outer || band.outer;
  let top = detail.top.length ? detail.top : [...band.top];
  const bottom = detail.bottom.length ? [...detail.bottom] : [...band.bottom];
  let shoes = detail.shoes || tone.shoes || band.shoes;
  let accessory = applyPreferredColor(tone.accessory, profile, "accessory");

  if (profile.sensitivity === "cold") {
    reasons.push("추위 민감");
    insights.push("추위를 많이 타는 설정이라 얇은 레이어를 한 단계 더 보수적으로 봅니다.");
  }

  if (profile.sensitivity === "heat") {
    reasons.push("더위 민감");
    insights.push("더위를 많이 타는 설정이라 통기성과 밝은 색감을 우선합니다.");
  }

  if (mood === "street") {
    top = top.map((item) => (item.includes("오버핏") || item.includes("박시") ? item : `오버핏 ${item}`));
  }

  if (mood === "formal") {
    top = [withPlainHint(applyPreferredColor(gender.formalTop, profile, "top")), ...top.slice(0, 1)];
    bottom[0] = withPlainHint(applyPreferredColor(gender.formalBottom, profile, "bottom"));
  }

  if (profile.gender === "female" && feels >= 23) {
    bottom[1] = withPlainHint(applyPreferredColor("롱스커트", profile, "bottom", 1));
  }

  if (isWet) {
    outer = outer ? `방수 ${outer}` : "방수 윈드브레이커";
    shoes = "방수 스니커즈·부츠(천 소재 피하기)";
    accessory = profile.colorTone === "bright" ? "스카이블루 우산·아이보리 방수 파우치" : "네이비 우산·차콜 방수 파우치";
    reasons.push("강수");
    insights.push("강수 가능성이 있어 젖기 쉬운 천 소재 신발과 밝은 밑단은 피하는 쪽으로 추천합니다.");
  }

  if (gap >= 8) {
    if (!outer) outer = feels >= 28 ? "냉방 대비 얇은 셔츠" : gender.warmLayer;
    reasons.push(`일교차 ${Math.round(gap)}°`);
    insights.push(
      feels >= 28
        ? "더운 날의 레이어는 실외용 아우터가 아니라 실내 냉방이나 늦은 시간 대비용입니다."
        : "아침저녁 온도 차가 커서 벗고 입기 쉬운 가벼운 겉옷을 더했습니다."
    );
  }

  return {
    outer,
    top,
    bottom,
    shoes,
    accessory,
    outfits: makeOutfits({ detail, outer, accessory, mood, palette, reasons, isWet, gap, feels, profile }),
    palette,
    adjustedFeels,
    insights,
    comment: isWet
      ? `${tone.comment} 비 소식이 있어 발이 젖지 않게 방수 소재를 챙기세요.`
      : `${tone.comment} ${band.note} ${palette.text}`,
    reasons,
  };
}
