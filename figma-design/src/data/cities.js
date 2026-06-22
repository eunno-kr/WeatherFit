export const CITY_GROUPS = [
  {
    label: "서울",
    cities: [
      { name: "서울", lat: 37.5665, lon: 126.9780 },
      { name: "서울 강남", lat: 37.5172, lon: 127.0473 },
      { name: "서울 강서", lat: 37.5509, lon: 126.8495 },
      { name: "서울 마포", lat: 37.5663, lon: 126.9014 },
      { name: "서울 종로", lat: 37.5730, lon: 126.9794 },
      { name: "서울 송파", lat: 37.5145, lon: 127.1059 },
      { name: "서울 노원", lat: 37.6542, lon: 127.0568 },
      { name: "서울 은평", lat: 37.6026, lon: 126.9291 },
      { name: "서울 서초", lat: 37.4837, lon: 127.0324 },
    ],
  },
  {
    label: "경기",
    cities: [
      { name: "수원", lat: 37.2636, lon: 127.0286 },
      { name: "성남", lat: 37.4386, lon: 127.1378 },
      { name: "안양", lat: 37.3943, lon: 126.9568 },
      { name: "고양", lat: 37.6584, lon: 126.8320 },
      { name: "용인", lat: 37.2411, lon: 127.1775 },
      { name: "부천", lat: 37.5034, lon: 126.7660 },
      { name: "안산", lat: 37.3219, lon: 126.8309 },
      { name: "화성", lat: 37.1994, lon: 126.8317 },
      { name: "평택", lat: 36.9921, lon: 127.1121 },
      { name: "의정부", lat: 37.7381, lon: 127.0337 },
    ],
  },
  {
    label: "인천",
    cities: [
      { name: "인천", lat: 37.4563, lon: 126.7052 },
      { name: "인천 미추홀", lat: 37.4599, lon: 126.6546 },
      { name: "인천 연수", lat: 37.4106, lon: 126.6780 },
      { name: "인천 부평", lat: 37.5072, lon: 126.7229 },
    ],
  },
  {
    label: "강원",
    cities: [
      { name: "춘천", lat: 37.8813, lon: 127.7298 },
      { name: "원주", lat: 37.3422, lon: 127.9202 },
      { name: "강릉", lat: 37.7519, lon: 128.8761 },
      { name: "속초", lat: 38.2048, lon: 128.5912 },
      { name: "동해", lat: 37.5246, lon: 129.1144 },
    ],
  },
  {
    label: "충북",
    cities: [
      { name: "청주", lat: 36.6424, lon: 127.4890 },
      { name: "충주", lat: 36.9910, lon: 127.9259 },
      { name: "제천", lat: 37.1322, lon: 128.1910 },
    ],
  },
  {
    label: "충남",
    cities: [
      { name: "천안", lat: 36.8151, lon: 127.1139 },
      { name: "아산", lat: 36.7897, lon: 127.0020 },
      { name: "공주", lat: 36.4465, lon: 127.1192 },
      { name: "서산", lat: 36.7845, lon: 126.4503 },
    ],
  },
  {
    label: "세종 · 대전",
    cities: [
      { name: "세종", lat: 36.4801, lon: 127.2890 },
      { name: "대전", lat: 36.3504, lon: 127.3845 },
      { name: "대전 유성", lat: 36.3624, lon: 127.3564 },
    ],
  },
  {
    label: "전북",
    cities: [
      { name: "전주", lat: 35.8242, lon: 127.1480 },
      { name: "군산", lat: 35.9676, lon: 126.7368 },
      { name: "익산", lat: 35.9483, lon: 126.9579 },
    ],
  },
  {
    label: "전남 · 광주",
    cities: [
      { name: "광주", lat: 35.1595, lon: 126.8526 },
      { name: "목포", lat: 34.8118, lon: 126.3922 },
      { name: "여수", lat: 34.7604, lon: 127.6622 },
      { name: "순천", lat: 34.9506, lon: 127.4875 },
    ],
  },
  {
    label: "경북 · 대구",
    cities: [
      { name: "대구", lat: 35.8714, lon: 128.6014 },
      { name: "대구 수성", lat: 35.8586, lon: 128.6311 },
      { name: "포항", lat: 36.0190, lon: 129.3435 },
      { name: "경주", lat: 35.8562, lon: 129.2247 },
      { name: "구미", lat: 36.1196, lon: 128.3446 },
      { name: "안동", lat: 36.5684, lon: 128.7294 },
    ],
  },
  {
    label: "경남 · 부산 · 울산",
    cities: [
      { name: "부산", lat: 35.1796, lon: 129.0756 },
      { name: "부산 해운대", lat: 35.1631, lon: 129.1636 },
      { name: "울산", lat: 35.5384, lon: 129.3114 },
      { name: "창원", lat: 35.2280, lon: 128.6811 },
      { name: "진주", lat: 35.1799, lon: 128.1076 },
      { name: "통영", lat: 34.8544, lon: 128.4335 },
      { name: "거제", lat: 34.8802, lon: 128.6212 },
      { name: "김해", lat: 35.2342, lon: 128.8811 },
    ],
  },
  {
    label: "제주",
    cities: [
      { name: "제주", lat: 33.4996, lon: 126.5312 },
      { name: "서귀포", lat: 33.2541, lon: 126.5600 },
    ],
  },
];

export const CITIES = CITY_GROUPS.flatMap((g) => g.cities);
