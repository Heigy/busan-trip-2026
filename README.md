# 釜山 + 濟州島 2026 · 互動行程地圖

**Google My Maps 嵌入 + 右側行程列表**（免費，無需 Google Cloud API Key）

在线访问：https://heigy.github.io/busan-trip-2026/

分享参数：
- `?region=jeju` — 济州
- `?day=2` — 第 2 天

---

## 一、建立 Google My Maps（约 5 分钟）

### 釜山地图

1. 打开 [Google My Maps](https://www.google.com/maps/d/)
2. **创建新地图**，标题：`釜山 4日 2026年8月`
3. 点 **导入** → 上传仓库里的 `busan-locations.kml`
4. 左侧会出现 **Day 1–4** 图层（可单独开关）
5. **分享** → 「知道链接的任何人**可查看**」

### 济州地图

同样步骤，导入 `jeju-locations.kml`。

### 获取嵌入链接

1. 在 My Maps 里点 **⋮（三个点）** → **「在地图中嵌入」**
2. 复制 iframe 里 `src="..."` 的网址，形如：
   ```
   https://www.google.com/maps/d/embed?mid=1xxxxxxxxxx
   ```
3. 分享链接（浏览器地址栏）作为 `viewUrl`，形如：
   ```
   https://www.google.com/maps/d/viewer?mid=1xxxxxxxxxx
   ```

---

## 二、填入 config.js 并推送

编辑 `config.js`：

```javascript
window.MYMAPS_CONFIG = {
  busan: {
    embedUrl: "https://www.google.com/maps/d/embed?mid=你的釜山MID",
    viewUrl: "https://www.google.com/maps/d/viewer?mid=你的釜山MID",
  },
  jeju: {
    embedUrl: "https://www.google.com/maps/d/embed?mid=你的济州MID",
    viewUrl: "https://www.google.com/maps/d/viewer?mid=你的济州MID",
  },
};
```

推送：

```bash
cd /Users/sunny/Projects/busan-trip-2026
git add config.js
git commit -m "Add My Maps embed URLs"
git push
```

约 1–2 分钟后刷新网站即可。

### 可选：用 GitHub Secrets（不把链接提交到仓库）

Settings → Secrets → Actions，添加：

| Name | Value |
|------|-------|
| `MYMAPS_BUSAN_EMBED` | 釜山 embed URL |
| `MYMAPS_BUSAN_VIEW` | 釜山 view URL（可选） |
| `MYMAPS_JEJU_EMBED` | 济州 embed URL |
| `MYMAPS_JEJU_VIEW` | 济州 view URL（可选） |

然后 Re-run Actions workflow。

---

## 网站用法

| 操作 | 说明 |
|------|------|
| 釜山 / 济州 | 顶部切换，左侧换 My Maps |
| Day 1–4 | 右侧切换当天行程；左侧 My Maps 勾选对应图层 |
| 点击「🗺️ 地图定位」 | 左侧地图聚焦该站点 |
| 「↩ 返回 My Maps」 | 回到完整 My Maps 总览 |
| 「↗ 全屏 My Maps」 | 新标签打开完整版 |
| 「🧭 导航」 | 打开 Google Maps 导航 |

---

## 本地预览

```bash
python3 -m http.server 8080
# http://localhost:8080
```

---

## 文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 主页面 |
| `app.js` | 行程 + 地图交互 |
| `trip-data.js` | 行程数据 |
| `config.js` | My Maps 嵌入链接 |
| `busan-locations.kml` / `jeju-locations.kml` | 导入 My Maps |
| `busan-flowchart.html` / `jeju-flowchart.html` | 手账风流程图 |

---

## 更新行程

1. 改 `trip-data.js`（网站右侧列表）
2. 改 KML 后重新导入 My Maps（地图标记）
3. `git push` 自动部署
