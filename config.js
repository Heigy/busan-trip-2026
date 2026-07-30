// My Maps 嵌入链接（embed 用 embed，分享用 viewer）
// 釜山、济州请使用「两张不同」的地图 mid，否则切到济州看起来像没反应
window.MYMAPS_CONFIG = {
  busan: {
    embedUrl: "https://www.google.com/maps/d/embed?mid=1YYWCTDv84LEeBrXCHn5J1Atry2eE5oI",
    viewUrl: "https://www.google.com/maps/d/viewer?mid=1YYWCTDv84LEeBrXCHn5J1Atry2eE5oI",
  },
  jeju: {
    // TODO: 新建济州 My Maps，导入 jeju-locations.kml 后，把下面两行换成新的 mid
    embedUrl: "YOUR_JEJU_EMBED_URL",
    viewUrl: "YOUR_JEJU_VIEW_URL",
  },
};
