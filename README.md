# 釜山 + 濟州島 2026 · 互動行程地圖

类似 [tf.wmkst.com](https://tf.wmkst.com/share/XhgIWCNHFu) 的交互式行程分享页：**Google Maps + 右侧行程列表**，点击站点定位地图，按天显示路线。

## 在线访问

部署完成后访问：`https://<你的用户名>.github.io/busan-trip-2026/`

分享时可带参数：
- `?region=jeju` — 直接打开济州
- `?day=2` — 打开第 2 天

示例：`https://<用户名>.github.io/busan-trip-2026/?region=jeju&day=3`

## 本地预览

```bash
cd busan-trip-2026
cp config.example.js config.js
# 编辑 config.js，填入 Google Maps API Key
python3 -m http.server 8080
# 打开 http://localhost:8080
```

## Google Maps API Key 设置

1. 打开 [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. 创建项目 → 启用 **Maps JavaScript API**
3. 凭据 → 创建 API Key
4. 限制 Key：**HTTP 引荐来源**，添加：
   - `http://localhost:*`
   - `https://<你的用户名>.github.io/*`

### GitHub 部署（推荐）

在 GitHub 仓库 **Settings → Secrets and variables → Actions** 添加：

| Name | Value |
|------|-------|
| `GMAPS_API_KEY` | 你的 API Key |

推送后 GitHub Actions 会自动注入 Key 并部署 Pages。

## 部署到 GitHub（首次）

```bash
cd busan-trip-2026
git init
git add .
git commit -m "Add interactive trip map with Google Maps"
```

在 GitHub 网页创建空仓库 `busan-trip-2026`，然后：

```bash
git remote add origin https://github.com/<你的用户名>/busan-trip-2026.git
git branch -M main
git push -u origin main
```

最后在仓库 **Settings → Pages → Build and deployment** 选择 **GitHub Actions**。

## 文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 主页面 |
| `app.js` | 地图交互逻辑 |
| `trip-data.js` | 釜山 + 济州行程数据 |
| `styles.css` | 样式 |
| `config.example.js` | API Key 模板 |
| `busan-flowchart.html` / `jeju-flowchart.html` | 手账风静态流程图 |
| `*.kml` / `*.csv` | Google My Maps 导入 |

## 更新行程

编辑 `trip-data.js` 中的坐标、时间、描述，推送即可自动重新部署。
