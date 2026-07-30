window.BOOKING_DATA = {
  bookings: [
    {
      id: "songdo-cable",
      stopIds: ["b2-3"],
      region: "busan",
      dayId: "busan-d2",
      status: "confirmed",
      date: "2026-08-02",
      dateLabel: { zh: "8月2日 · 日", en: "Sun · Aug 2" },
      time: { zh: "當日可用（建議 14:00–16:00）", en: "Valid that day (aim 14:00–16:00)" },
      title: {
        zh: "松島海上水晶纜車（往返）",
        en: "Songdo Crystal Cabin Cable Car (round-trip)",
      },
      titleKo: "송도해상케이블카",
      platform: "Klook",
      orderNo: "QTR564558",
      voucherNo: "KLK2189631015",
      qty: { zh: "成人 × 5", en: "Adult × 5" },
      lead: "NG YI HIN",
      travelers: ["Ng Yi Hin", "Ying Hei Tung", "Chung Wing Tung", "Ng Sum Yu", "Ng Yi Ho"],
      howToUse: {
        zh: "出示電子憑證，在松島灣站售票櫃台換實體票",
        en: "Show e-voucher at Songdo Bay Station ticket counter for physical tickets",
      },
      address: {
        zh: "171 Songdohaebyeon-ro, Amnam-dong, Seo-gu, Busan",
        en: "171 Songdohaebyeon-ro, Amnam-dong, Seo-gu, Busan",
      },
      note: {
        zh: "憑證兌換前可免費取消；天氣停運時可於指定期限內改日使用",
        en: "Free cancel before voucher redemption; weather cancellations may allow later use",
      },
      link: "https://www.klook.com/",
      website: null,
      phone: null,
      amount: null,
    },
    {
      id: "blueline-train",
      stopIds: ["b3-4", "b3-5"],
      region: "busan",
      dayId: "busan-d3",
      status: "confirmed",
      date: "2026-08-03",
      dateLabel: { zh: "8月3日 · 一", en: "Mon · Aug 3" },
      time: { zh: "18:00–18:30（第19回）", en: "18:00–18:30 (session 19)" },
      title: {
        zh: "海雲台藍線公園 · 海邊列車（單程）",
        en: "Haeundae Blueline Park · Beach Train (one-way)",
      },
      titleKo: "해운대 블루라인파크 해변열차",
      platform: "Blueline Park / makeTicket",
      orderNo: "RS26011549364",
      voucherNo: null,
      qty: { zh: "單程 × 5", en: "One-way × 5" },
      lead: null,
      travelers: null,
      howToUse: {
        zh: "手機票連結會發到手機簡訊 · 建議提前到青沙浦站候車",
        en: "Mobile ticket link via SMS · arrive early at Cheongsapo Station",
      },
      address: {
        zh: "釜山 海雲台區 青沙浦路 116（中洞）",
        en: "116 Cheongsapo-ro, Haeundae-gu, Busan",
      },
      note: {
        zh: "路線：松亭 ↔ 青沙浦 → 尾浦 · 金額 ₩40,000",
        en: "Route: Songjeong ↔ Cheongsapo → Mipo · ₩40,000",
      },
      link: "https://www.bluelinepark.com/",
      website: "https://www.bluelinepark.com/",
      phone: "051-701-5548",
      amount: "₩40,000",
    },
  ],
};

window.bookingForStop = function (stopId) {
  return (window.BOOKING_DATA?.bookings || []).find((b) => (b.stopIds || []).includes(stopId));
};
