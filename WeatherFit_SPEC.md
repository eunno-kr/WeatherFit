# WeatherFit — Build Spec (for Codex)

> 날씨 기반 코디 큐레이션 웹앱. 제출용 + 포트폴리오용.
> 이 문서는 Codex가 처음부터 끝까지 구현할 수 있도록 작성된 빌드 명세서다.
> 모든 UI 텍스트는 **한국어**, 코드/주석은 자유.

---

## 1. Goal

사용자의 현재 위치(도시) 날씨에 맞는 코디를 **큐레이션**해서 보여주고,
마음에 드는 코디를 저장할 수 있는 웹 서비스.

차별점은 단순 "기온 → 옷" 매칭이 아니라, **체감온도 + 강수 + 일교차 + 스타일 무드**를
종합한 큐레이션 로직과, 추천 근거를 보여주는 신뢰 요소다.

---

## 2. Tech Stack

| 영역 | 사용 |
|------|------|
| Build | Vite |
| UI | React + Tailwind CSS |
| Weather API | **Open-Meteo** (API 키 불필요, 무료, CORS open) |
| Auth / DB | Firebase Authentication + Firestore *(Phase 3에서 추가)* |
| Deploy | Vercel |

> ⚠️ **중요**: 날씨 API는 OpenWeatherMap이 아니라 **Open-Meteo**를 쓴다.
> 키 발급/회원가입 없이 프론트에서 바로 호출 가능. 백엔드 불필요.

---

## 3. Folder Structure

```
weatherfit/
├─ index.html
├─ package.json
├─ vite.config.js
├─ tailwind.config.js
├─ postcss.config.js
├─ .gitignore
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   ├─ index.css
   ├─ data/
   │  └─ cities.js          # 한국 도시 7개 + 위경도
   ├─ lib/
   │  ├─ weather.js         # Open-Meteo 호출 + weather_code 해석
   │  ├─ curate.js          # ★ 코디 큐레이션 엔진 (핵심)
   │  └─ theme.js           # 체감온도 → 액센트 컬러
   └─ components/
      ├─ WeatherHero.jsx    # 현재 도시/기온/체감/일교차
      ├─ MoodPicker.jsx     # 무드 선택 버튼
      └─ LookCard.jsx       # 추천 코디 카드
```

*(Phase 3에서 `src/lib/firebase.js`, `src/components/AuthBar.jsx`, `src/pages/Profile.jsx` 추가)*

---

## 4. Data

### 4.1 Cities (`src/data/cities.js`)

```
서울 37.5665 / 126.978
부산 35.1796 / 129.0756
대구 35.8714 / 128.6014
인천 37.4563 / 126.7052
대전 36.3504 / 127.3845
광주 35.1595 / 126.8526
제주 33.4996 / 126.5312
```

### 4.2 Open-Meteo 호출 (`src/lib/weather.js`)

```
GET https://api.open-meteo.com/v1/forecast
  ?latitude={lat}&longitude={lon}
  &current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code
  &daily=temperature_2m_max,temperature_2m_min
  &timezone=auto
```

응답에서 추출: `temp`(현재기온), `feels`(체감/apparent), `humidity`, `code`(날씨코드), `tmax`, `tmin`.

`weather_code` → 한글 라벨 + 강수여부(isWet) 매핑:
- 0~3 맑음/구름/흐림 (isWet=false)
- 45,48 안개 (false)
- 51~65 이슬비~비 (true)
- 71~75 눈 (true)
- 80~82 소나기 (true)
- 95 천둥번개 (true)

API 실패 시 샘플 데이터(서울 18°)로 폴백하고 안내 문구 표시.

---

## 5. ★ Curation Engine (`src/lib/curate.js`) — 가장 중요

입력: `{ feels, isWet, gap, mood }` (gap = tmax - tmin)
출력: `{ outer, top[], bottom[], shoes, accessory, comment, reasons[] }`

### 5.1 체감온도 기준 기온대 (feels 기준)

| feels | 아우터 | 상의 | 하의 | 슈즈 |
|-------|--------|------|------|------|
| 28°+ | 없음 | 민소매, 반팔 | 반바지, 린넨 팬츠 | 샌들·로퍼 |
| 23~27 | 없음 | 반팔, 얇은 셔츠 | 반바지, 면바지 | 스니커즈 |
| 20~22 | 얇은 가디건 | 긴팔, 얇은 셔츠 | 슬랙스, 면바지 | 스니커즈 |
| 17~19 | 얇은 자켓 | 맨투맨, 얇은 니트 | 청바지, 슬랙스 | 스니커즈·로퍼 |
| 12~16 | 자켓·야상 | 니트, 맨투맨 | 청바지, 치노 | 스니커즈·부츠 |
| 9~11 | 트렌치·야상 | 니트, 기모 후드 | 청바지 | 부츠·스니커즈 |
| 5~8 | 코트·가죽자켓 | 두꺼운 니트, 히트텍+상의 | 기모 청바지, 슬랙스 | 부츠 |
| ~4 이하 | 패딩·두꺼운 코트 | 기모 니트, 히트텍 레이어 | 기모 팬츠 | 부츠 |

### 5.2 무드(mood) 변형

- **minimal**: 무채색·뉴트럴 톤, 깔끔한 핏. 슈즈는 로퍼·미니멀 스니커즈. 포인트 = 톤온톤 가방·미니멀 캡.
- **casual**: 데님·코튼 중심 데일리룩. 슈즈 스니커즈. 포인트 = 에코백·볼캡.
- **street**: 오버핏·레이어드(상의 앞에 "오버핏 " 접두). 슈즈 청키 스니커즈·부츠. 포인트 = 캡·크로스백·양말 포인트.

### 5.3 오버라이드 규칙

- **isWet=true**: 아우터에 "방수 " 접두(없으면 "방수 윈드브레이커"), 슈즈 "방수 스니커즈·부츠(천 소재 피하기)", 포인트 "우산 필수·어두운 톤", reasons에 "강수" 추가, comment에 발 젖지 않게 안내.
- **gap ≥ 8**: 아우터 없으면 "얇은 가디건" 추가, reasons에 "일교차 N°" 추가.

### 5.4 reasons (추천 근거)

항상 `체감 N°` 포함. 강수/일교차 조건 충족 시 각각 추가.
→ UI에서 "왜? 체감 17°" 형태 칩으로 표시 (신뢰 요소).

> 📌 기존 프로토타입 `WeatherFit.jsx`의 `curate()` 함수가 위 로직의 레퍼런스 구현이다.
> 그 파일을 첨부하면 그대로 가져다 모듈화하면 됨.

---

## 6. Design System

### 6.1 Signature — 체감온도 반응형 액센트 (`src/lib/theme.js`)

화면 액센트 컬러가 체감온도/강수에 따라 바뀐다. (이게 이 앱의 시그니처)

| 조건 | accent | 라벨 |
|------|--------|------|
| 비/눈 | `#4A5468` (인디고) | RAIN |
| feels ≥ 23 | `#D9532B` (감/persimmon) | HOT |
| feels ≥ 17 | `#7C8B5A` (세이지) | MILD |
| feels ≥ 9 | `#5B7A99` (스틸블루) | COOL |
| 그 외 | `#3E5C73` (딥스틸) | COLD |

### 6.2 Base

- 배경 `#FAF8F3` (웜 페이퍼), 잉크 `#1A1A1A`
- 무드: MUJI / 무신사 미니멀. 카드형 레이아웃, 넉넉한 여백, border-radius 최소.
- 모바일 우선(max-width 약 560px), 데스크탑/태블릿 대응.

### 6.3 Typography

- 본문: Pretendard (한국어)
- 숫자/영문 라벨(기온, TODAY'S LOOK 등): Archivo 등 그로테스크, letter-spacing 약간.

---

## 7. Pages & Components (Phase 1~2)

- **App**: 도시 셀렉트 → 날씨 호출 → 히어로 + 무드피커 + 룩카드 조합. 도시/무드 변경 시 추천 재계산.
- **WeatherHero**: 큰 기온, 날씨 라벨, 체감/습도, 최저/최고, 일교차 큰 날 표시.
- **MoodPicker**: 미니멀/캐주얼/스트릿 토글(선택 시 액센트 컬러로 채움).
- **LookCard**: 아우터/상의/하의/슈즈/포인트 슬롯 + comment + reasons 칩. 카드 배경은 액센트의 연한 톤.

---

## 8. Firebase (Phase 3)

### Auth
이메일 회원가입 / 로그인 / 로그아웃 / 프로필.

### Firestore 컬렉션

```
users
  uid, email, nickname, createdAt

favorites
  userId, savedAt
  snapshot: { city, feels, condition, mood, look(추천 결과 전체) }
```

> 코디는 별도 마스터 테이블 없이, 저장 시점의 추천 결과를 스냅샷으로 저장한다
> (생성형 추천이라 고정 outfit 테이블이 불필요).

저장 기능: 룩카드에 ♡ 버튼 → favorites 저장. 프로필 페이지에서 저장한 코디 목록 조회.

---

## 9. Build Phases (순서대로)

1. **Phase 1 — Scaffold + 날씨/추천**: Vite+React+Tailwind 셋업, 폴더 구조, Open-Meteo 연동, curate 엔진, 3개 컴포넌트. **로그인/DB 없이 동작.**
2. **Phase 2 — UI 다듬기 + 로직 고도화**: 반응형 마무리, 무드/기온대 추천 검수(오너가 패션 감각으로 조정).
3. **Phase 3 — Firebase**: Auth + Firestore 저장/조회, 프로필 페이지.
4. **Phase 4 — Deploy**: Vercel 배포, 실제 링크.
5. **Phase 5 — 마무리**: README, 포트폴리오 정리.

각 Phase 끝에서 동작 확인 후 다음으로.

---

## 10. Acceptance Criteria (Phase 1 "완료" 기준)

- [ ] 도시 7개 셀렉트 가능, 변경 시 실시간 날씨 갱신
- [ ] 기온/체감/습도/최저·최고/일교차 정확히 표시
- [ ] 무드 3종 전환 시 추천 코디가 실제로 달라짐
- [ ] 비 올 때 방수/우산 추천이 뜸
- [ ] 일교차 8° 이상일 때 레이어링 안내가 뜸
- [ ] 추천 근거(reasons) 칩 표시
- [ ] 체감온도에 따라 액센트 컬러가 바뀜
- [ ] 모바일에서 깨지지 않음
- [ ] API 실패 시 샘플 데이터로 폴백

---

## 11. Out of Scope (지금은 X)

- 코디 이미지(실제 사진/일러스트) — 텍스트 추천만
- AI 스타일 코멘트(LLM 호출) — 추후 옵션
- 위치 자동감지(geolocation) — 도시 셀렉트로 대체
- 다국어 — 한국어만

---

## 12. First Command to Codex

> "이 SPEC.md를 기준으로 Phase 1을 구현해줘. 먼저 폴더 구조와 package.json을
> 보여주고 내 확인을 받은 다음, 파일을 하나씩 작성해. Firebase는 아직 넣지 마.
> 기존 WeatherFit.jsx의 curate() 로직을 src/lib/curate.js로 모듈화해서 재사용해줘."
