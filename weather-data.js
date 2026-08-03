/** Forecast snapshot for trip dates (Aug 2026). Re-check KMA before outing. */
window.WEATHER_DATA = {
  updated: "2026-07-31",
  sourceNote: {
    zh: "綜合 BBC / 韓媒氣象趨勢 · 出發前請再查韓國氣象廳 weather.go.kr",
    en: "Based on BBC / KMA outlook · re-check weather.go.kr before going out",
  },
  alert: {
    title: {
      zh: "超強颱風 Dolphin 路徑未定 · 週末後可能影響半島／濟州",
      en: "Super Typhoon Dolphin track uncertain · may affect Korea/Jeju after weekend",
    },
    detail: {
      zh: "酷熱高濕仍持續 · 尤其盯 8/5–7 牛島渡輪與回港航班 UO699；路徑週末前後才會更清楚",
      en: "Heat/humidity continues · watch Udo ferry & UO699 (8/5–7); track clearer around this weekend",
    },
  },
  days: {
    "busan-d1": {
      summary: { zh: "晴熱 · 約 33–35°C / 夜 25°C · 高濕", en: "Sunny hot · ~33–35°C / night 25°C · humid" },
      tip: {
        zh: "紅眼落地易中暑 · 優先 Plan A、多喝水、海灘避開正午暴晒",
        en: "Red-eye + heat · prefer Plan A, hydrate, avoid peak sun on the beach",
      },
    },
    "busan-d2": {
      summary: { zh: "晴熱 · 約 34–35°C · 偶有短暫陣雨可能", en: "Sunny hot · ~34–35°C · brief showers possible" },
      tip: {
        zh: "甘川／白淺灘多坡暴晒 · 松島纜車遇雷雨／強風或停運 · 備水與遮陽",
        en: "Gamcheon/Huinnyeoul are exposed · Songdo cable may suspend in storms · water + shade",
      },
    },
    "busan-d3": {
      summary: { zh: "晴熱 · 約 33–34°C · 東北風轉強趨勢", en: "Sunny hot · ~33–34°C · NE wind picking up" },
      tip: {
        zh: "Greetvi 戶外暴晒 · 預設 Plan A 含樂天購物稍緊；藍線月台仍熱 · 晚間極東湯飯 LO 20:30 別太晚",
        en: "Greetvi is exposed · default Plan A with Lotte is tighter · Blueline platforms stay hot · Geukdong LO 20:30 — don’t run late",
      },
    },
    "busan-d4": {
      summary: { zh: "清晨較涼出發 · 日間仍熱約 33°C", en: "Cooler early depart · still ~33°C daytime" },
      tip: {
        zh: "05:45 退房趕飛 · 天氣對早班機影響通常較小 · 仍查 7C0503 準點",
        en: "05:45 checkout rush · morning flights usually OK · still check 7C0503 status",
      },
    },
    "jeju-d1": {
      summary: { zh: "晴熱 · 約 31–32°C · 局部短暫雨可能", en: "Sunny hot · ~31–32°C · patchy rain possible" },
      tip: {
        zh: "中文線戶外館熱 · 中午少久站 · 回市區晚餐較涼",
        en: "Jungmun outdoor sites are hot · limit noon standing · dinner in town feels cooler",
      },
    },
    "jeju-d2": {
      summary: { zh: "熱 · 約 31°C · 局部雷陣雨可能 · 風轉東北", en: "Hot · ~31°C · possible thunder showers · NE wind" },
      tip: {
        zh: "最關鍵日：城山＋牛島 · 熱浪＋渡輪風浪；颱風動向一變可能停航 · 出發前必查渡輪／天氣",
        en: "Key day: Seongsan + Udo · heat + ferry waves; typhoon shift may cancel ferries · check before leaving",
      },
    },
    "jeju-d3": {
      summary: { zh: "熱 · 約 30–31°C · 風偏東北略強 · 短暫雨可能", en: "Hot · ~30–31°C · stronger NE breeze · patchy rain possible" },
      tip: {
        zh: "涯月海岸風大浪高時勿靠近防波堤 · 貝果排隊備遮陽",
        en: "Avoid breakwaters if swell warnings · shade while queuing for bagels",
      },
    },
    "jeju-d4": {
      summary: { zh: "清晨出發 · 日間仍熱 · 留意颱風外圍雲雨", en: "Early depart · still hot daytime · watch typhoon outer bands" },
      tip: {
        zh: "UO699 07:30 · 若 Dolphin 靠近可能延誤／取消 · 前一晚查航班與機場交通",
        en: "UO699 07:30 · delays/cancels if Dolphin nears · check flight + airport taxi night before",
      },
    },
  },
};
