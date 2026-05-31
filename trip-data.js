window.TRIP_DATA = {
  meta: {
    title: "釜山 + 濟州島 7日6夜",
    subtitle: "2026年8月1–7日 · 5人 · 無自駕",
    flights: [
      { date: "8/1", code: "UO604", route: "香港 → 釜山" },
      { date: "8/4", code: "7C501", route: "釜山 → 濟州" },
      { date: "8/7", code: "UO699", route: "濟州 → 香港" },
    ],
  },
  regions: [
    {
      id: "busan",
      name: "釜山",
      dates: "8/1 – 8/4",
      center: { lat: 35.158, lng: 129.06 },
      zoom: 11,
      dayColors: ["#e91e63", "#2196f3", "#ff9800", "#9c27b0"],
      days: [
        {
          id: "busan-d1",
          label: "Day 1 · 8/1",
          theme: "抵達 · 巨大豬肉湯飯 · 海雲台",
          stops: [
            { id: "b1-1", name: "金海國際機場 PUS", nameKo: "김해공항", time: "02:35–07:00", desc: "UO604 抵達、入境取行李", transport: "✈️ UO604", lat: 35.179528, lng: 128.938222 },
            { id: "b1-2", name: "海雲台酒店", nameKo: "해운대 호텔", time: "10:00–14:00", desc: "Check-in、淋浴補眠", transport: "🚕×2 約40–50分", lat: 35.163381, lng: 129.160456 },
            { id: "b1-3", name: "巨大豬肉湯飯", nameKo: "거대돼지국밥", time: "11:30–13:00", desc: "湯飯 ₩13,000 / 拌麵 ₩11,000", transport: "🚶 步行5–10分", lat: 35.163, lng: 129.178 },
            { id: "b1-4", name: "海雲台海水浴場", nameKo: "해운대해수욕장", time: "14:00–18:00", desc: "海灘散步、傳統市場小食", transport: "🚶 步行10–15分", lat: 35.158698, lng: 129.160384 },
          ],
        },
        {
          id: "busan-d2",
          label: "Day 2 · 8/2",
          theme: "西線：甘川 → 扎嘎其 → 松島 → 白淺灘",
          stops: [
            { id: "b2-0", name: "海雲台酒店", nameKo: "출발", time: "08:30", desc: "早餐後出發", transport: "—", lat: 35.163381, lng: 129.160456, skipMarker: true },
            { id: "b2-1", name: "甘川洞文化村", nameKo: "감천문화마을", time: "09:00–11:30", desc: "壁畫、小王子打卡", transport: "🚕×2 約35–45分", lat: 35.097493, lng: 129.010678 },
            { id: "b2-2", name: "扎嘎其市場", nameKo: "자갈치시장", time: "12:00–13:30", desc: "活海鮮午餐", transport: "🚕×2 約15–20分", lat: 35.096878, lng: 129.030478 },
            { id: "b2-3", name: "松島海上水晶纜車", nameKo: "송도해상케이블카", time: "14:00–16:00", desc: "透明纜車跨海（需預約）", transport: "🚕×2 約15–20分", lat: 35.076389, lng: 129.018056 },
            { id: "b2-4", name: "白淺灘文化村", nameKo: "흰여울문화마을", time: "16:45–19:00", desc: "彩色階梯、黃昏咖啡", transport: "🚕×2 約20–25分", lat: 35.078611, lng: 129.045278 },
          ],
        },
        {
          id: "busan-d3",
          label: "Day 3 · 8/3",
          theme: "Greetvi → Luge → 踏石 → 小镰倉 → 膠囊 → 購物",
          stops: [
            { id: "b3-0", name: "海雲台酒店", nameKo: "출발", time: "08:00", desc: "早餐、退房行李", transport: "—", lat: 35.163381, lng: 129.160456, skipMarker: true },
            { id: "b3-1", name: "Greetvi 西生店", nameKo: "그릿비 서생점", time: "10:00–12:30", desc: "海景咖啡早午餐", transport: "🚕×2 約50–60分", lat: 35.3594, lng: 129.2972 },
            { id: "b3-2", name: "Skyline Luge", nameKo: "스카이라인루지", time: "13:00–16:00", desc: "纜車 + 斜坡滑車", transport: "🚕×2 約15–25分", lat: 35.2925, lng: 129.2015 },
            { id: "b3-3", name: "青沙浦踏石觀景台", nameKo: "청사포다릿돌전망대", time: "16:15–16:50", desc: "海上天空步道（免費）", transport: "🚕×2 約35–45分", lat: 35.16104, lng: 129.20659 },
            { id: "b3-4", name: "青沙浦「小镰倉」", nameKo: "청사포역道口", time: "16:50–17:20", desc: "鐵道道口網紅拍照", transport: "🚶 沿海岸10–15分", lat: 35.158833, lng: 129.222583 },
            { id: "b3-5", name: "天空膠囊（青沙浦站）", nameKo: "해변열차", time: "17:30–18:30", desc: "청사포→尾浦（需訂票）", transport: "🚶 步行3–5分", lat: 35.1589, lng: 129.2226 },
            { id: "b3-6", name: "天空膠囊（尾浦站）", nameKo: "미포", time: "18:30", desc: "膠囊終點下車", transport: "—", lat: 35.158083, lng: 129.158611, skipMarker: true },
            { id: "b3-7", name: "Olive Young LCT", nameKo: "올리브영", time: "18:30–20:00", desc: "美妝伴手禮", transport: "🚶 尾浦步行5分", lat: 35.1595, lng: 129.1635 },
            { id: "b3-8", name: "樂天超市 Buam", nameKo: "롯데마트부산점", time: "20:00–21:00", desc: "零食/日用品", transport: "🚇 地鐵2號線約15分", lat: 35.1536, lng: 129.0591 },
          ],
        },
        {
          id: "busan-d4",
          label: "Day 4 · 8/4",
          theme: "飛濟州",
          stops: [
            { id: "b4-1", name: "海雲台酒店", nameKo: "退房", time: "05:30", desc: "退房、檢查護照", transport: "—", lat: 35.163381, lng: 129.160456, skipMarker: true },
            { id: "b4-2", name: "金海機場 PUS", nameKo: "김해공항", time: "06:30–08:00", desc: "7C501 值機登機", transport: "🚕×2 06:00出發", lat: 35.179528, lng: 128.938222 },
          ],
        },
      ],
    },
    {
      id: "jeju",
      name: "濟州島",
      dates: "8/4 – 8/7",
      center: { lat: 33.45, lng: 126.55 },
      zoom: 10,
      dayColors: ["#4caf50", "#009688", "#673ab7", "#795548"],
      days: [
        {
          id: "jeju-d1",
          label: "Day 1 · 8/4",
          theme: "黑豬肉 · 泰迪熊 · Hello Kitty · BHC",
          stops: [
            { id: "j1-1", name: "濟州機場 CJU", nameKo: "제주공항", time: "09:05", desc: "7C501 抵達", transport: "✈️ 7C501", lat: 33.506806, lng: 126.492778 },
            { id: "j1-2", name: "Dombedon 烤黑豬肉", nameKo: "돔베돈", time: "11:30–13:00", desc: "濟州黑豬烤肉", transport: "🚕×2 約15分", lat: 33.4892, lng: 126.5128 },
            { id: "j1-3", name: "泰迪熊博物館", nameKo: "테디베어뮤지엄", time: "13:30–14:30", desc: "中문度假區主題展", transport: "🚐 包車約40分", lat: 33.2414, lng: 126.412 },
            { id: "j1-4", name: "Hello Kitty Island", nameKo: "헬로키티아일랜드", time: "15:00–16:30", desc: "主題館拍照、周邊", transport: "🚐 包車20–25分", lat: 33.2965, lng: 126.3618 },
            { id: "j1-5", name: "BHC 炸雞 蓮洞店", nameKo: "BHC치킨", time: "18:00–19:30", desc: "火山雞、啤酒", transport: "🚐 回市區", lat: 33.4868, lng: 126.4925 },
          ],
        },
        {
          id: "jeju-d2",
          label: "Day 2 · 8/5",
          theme: "城山日出峰 + 牛島（建議9座包車）",
          stops: [
            { id: "j2-0", name: "濟州酒店 蓮洞", nameKo: "노형/연동", time: "07:30", desc: "出發（帶護照！）", transport: "—", lat: 33.4875, lng: 126.491, skipMarker: true },
            { id: "j2-1", name: "城山日出峰", nameKo: "성산일출봉", time: "09:00–11:00", desc: "門票 ₩5,000", transport: "🚐 包車約1h", lat: 33.4584, lng: 126.9416 },
            { id: "j2-2", name: "城山港 牛島渡輪", nameKo: "성산포항", time: "11:30–16:00", desc: "牛島一日（需護照）", transport: "🚐 包車", lat: 33.506, lng: 126.922 },
          ],
        },
        {
          id: "jeju-d3",
          label: "Day 3 · 8/6",
          theme: "北線咖啡 · 涯月 · 七星街 · 購物",
          stops: [
            { id: "j3-1", name: "倫敦貝果博物館", nameKo: "런던베이글뮤지엄", time: "08:00–09:30", desc: "排隊貝果早午餐", transport: "🚐/🚕", lat: 33.5422, lng: 126.8618 },
            { id: "j3-2", name: "Cafe Layered 小狗咖啡", nameKo: "카페 레이어드", time: "09:30–10:30", desc: "貝果旁 · 小狗主題", transport: "🚶 同區", lat: 33.54225, lng: 126.86185, skipMarker: true },
            { id: "j3-3", name: "Mou Moon 海景咖啡", nameKo: "머문카페", time: "10:30–12:00", desc: "月汀里海景", transport: "🚐 約15分", lat: 33.548, lng: 126.867 },
            { id: "j3-4", name: "涯月邑 漢潭海岸", nameKo: "애월읍", time: "15:00–17:00", desc: "海岸散步、咖啡", transport: "🚐 約40分", lat: 33.462, lng: 126.308 },
            { id: "j3-5", name: "七星街", nameKo: "칠성로", time: "17:30–19:00", desc: "逛街購物", transport: "🚐 回市區", lat: 33.4998, lng: 126.5235 },
            { id: "j3-6", name: "Olive Young 濟州", nameKo: "올리브영", time: "19:00–20:00", desc: "K-Beauty · MALTESE", transport: "🚶/🚕", lat: 33.487, lng: 126.489 },
            { id: "j3-7", name: "Hi Jeju / Butter / Jejustar", nameKo: "伴手禮", time: "20:00–21:00", desc: "노연商圈伴手禮", transport: "🚶 步行", lat: 33.4893, lng: 126.4885 },
            { id: "j3-8", name: "樂天免稅店 濟州", nameKo: "롯데면세점", time: "21:00–22:00", desc: "機場提貨", transport: "🚕", lat: 33.511, lng: 126.492 },
          ],
        },
        {
          id: "jeju-d4",
          label: "Day 4 · 8/7",
          theme: "返程",
          stops: [
            { id: "j4-1", name: "濟州酒店", nameKo: "退房", time: "05:00", desc: "退房出發", transport: "—", lat: 33.4875, lng: 126.491, skipMarker: true },
            { id: "j4-2", name: "濟州機場 CJU", nameKo: "제주공항", time: "07:30", desc: "UO699 離境", transport: "🚕×2 05:00出發", lat: 33.506806, lng: 126.492778 },
          ],
        },
      ],
    },
  ],
};
