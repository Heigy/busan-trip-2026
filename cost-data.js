/** Trip cost summary · amounts from vouchers + rough estimates. Update when new receipts arrive. */
window.COST_DATA = {
  people: 5,
  updated: "2026-07-31",
  fx: {
    /** Approximate: how many KRW for 1 CNY (for converting ₩ → ¥ display) */
    krwPerCny: 190,
    note: {
      zh: "匯率約 1 CNY ≈ 190 KRW（估算用 · 以實際刷卡為準）",
      en: "FX ~1 CNY ≈ 190 KRW (estimate · use card statement as truth)",
    },
  },
  categories: [
    {
      id: "stay",
      title: { zh: "住宿", en: "Lodging" },
      items: [
        {
          id: "busan-hotel",
          name: { zh: "Raviens 海雲台 · 雙床×3 · 3晚", en: "Raviens Haeundae · Twin×3 · 3N" },
          status: "paid",
          cny: 7723.02,
          note: { zh: "Trip.com · 不含餐", en: "Trip.com · no meals" },
        },
        {
          id: "jeju-hotel-1",
          name: { zh: "濟州太平洋 · 豪華雙床×1 · 3晚", en: "Jeju Pacific · Deluxe Twin×1 · 3N" },
          status: "paid",
          cny: 1536,
          note: { zh: "含 8/5–7 雙人早餐", en: "Breakfast for 2 · Aug 5–7" },
        },
        {
          id: "jeju-hotel-2",
          name: { zh: "濟州太平洋 · 豪華雙床×2 · 3晚", en: "Jeju Pacific · Deluxe Twin×2 · 3N" },
          status: "paid",
          cny: 4122,
          note: { zh: "含 8/5–7 共 6 份早餐", en: "6 breakfasts · Aug 5–7" },
        },
      ],
    },
    {
      id: "tickets",
      title: { zh: "已訂票券", en: "Booked tickets" },
      items: [
        {
          id: "blueline",
          name: { zh: "藍線海邊列車 · 單程×5", en: "Blueline Beach Train · one-way×5" },
          status: "paid",
          krw: 40000,
          note: { zh: "8/3 18:00 第19回", en: "Aug 3 18:00 session 19" },
        },
        {
          id: "songdo",
          name: { zh: "松島水晶纜車往返×5", en: "Songdo Crystal Cabin RT×5" },
          status: "tbd",
          note: { zh: "Klook 已訂 · 金額待補進總表", en: "Booked on Klook · amount TBD" },
        },
      ],
    },
    {
      id: "flights",
      title: { zh: "機票", en: "Flights" },
      items: [
        {
          id: "uo604",
          name: { zh: "UO604 香港→釜山 ×5", en: "UO604 HKG→PUS ×5" },
          status: "tbd",
          note: { zh: "香港快運 · 金額待補", en: "HK Express · amount TBD" },
        },
        {
          id: "7c0503",
          name: { zh: "7C0503 釜山→濟州 ×5", en: "7C0503 PUS→CJU ×5" },
          status: "tbd",
          note: { zh: "濟州航空 · 金額待補", en: "Jeju Air · amount TBD" },
        },
        {
          id: "uo699",
          name: { zh: "UO699 濟州→香港 ×5", en: "UO699 CJU→HKG ×5" },
          status: "tbd",
          note: { zh: "香港快運 · 金額待補", en: "HK Express · amount TBD" },
        },
      ],
    },
    {
      id: "local",
      title: { zh: "當地預估（未付）", en: "On-trip estimates (not yet paid)" },
      items: [
        {
          id: "taxi-busan",
          name: { zh: "釜山計程車（3日合計）", en: "Busan taxis (3 days total)" },
          status: "estimate",
          krw: 350000,
          note: { zh: "無自駕 · 約兩輛並行 · 粗估", en: "No car · often 2 taxis · rough" },
        },
        {
          id: "taxi-jeju",
          name: { zh: "濟州包車／計程車（3日）", en: "Jeju van/taxis (3 days)" },
          status: "estimate",
          krw: 450000,
          note: { zh: "含城山＋牛島日 · 粗估", en: "Incl. Seongsan+Udo day · rough" },
        },
        {
          id: "food",
          name: { zh: "餐飲（7日 · 5人）", en: "Meals (7 days · 5 pax)" },
          status: "estimate",
          krw: 1750000,
          note: { zh: "約 ₩50,000/人/日 · 酒店早餐已含部分", en: "~₩50k/person/day · some hotel breakfasts included" },
        },
        {
          id: "attractions",
          name: { zh: "門票／渡輪（城山＋牛島等）", en: "Tickets / ferries (Seongsan + Udo…)" },
          status: "estimate",
          krw: 120000,
          note: { zh: "城山約 ₩5,000/人 · 牛島船票另計", en: "Seongsan ~₩5k/pp · Udo ferry extra" },
        },
        {
          id: "misc",
          name: { zh: "伴手禮／日用品預留", en: "Souvenirs / sundries buffer" },
          status: "estimate",
          cny: 2000,
          note: { zh: "Olive Young、零食等", en: "Olive Young, snacks, etc." },
        },
      ],
    },
  ],
};
