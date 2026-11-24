# 🌻 桃園・向日葵花田

以專案資料夾內的 `1.png`（Welcome to Taoyuan 向日葵花田照片）為主視覺，加入一系列大自然元素動畫所打造的純靜態響應式網頁。

## 大自然元素

| 元素 | 實作方式 |
| --- | --- |
| ☀️ 太陽 | `repeating-conic-gradient` 放射光芒 + 發光脈動，緩慢旋轉 |
| ☁️ 雲 | 三層模糊徑向漸層，不同速度橫向飄移 |
| 🐦 飛鳥 | SVG 路徑 + `scaleY` 拍翅動畫，成群飛越天際 |
| 🌿 草地 | 雲端 SVG 波浪剪影，前後兩層交替搖曳 |
| 🌼 花粉／花瓣 | `<canvas>` 粒子系統，正弦飄動、旋轉與明暗變化 |
| 💧 露水・風・土壤 | 卡片區的 SVG 圖示動畫 |

其他細節：捲動視差、`IntersectionObserver` 進場動畫、文字跑馬燈、波浪頁尾。

## 技術

- 純 **HTML / CSS / Vanilla JS**，無建置流程、無相依套件
- RWD（`clamp()` 流式排版、`auto-fit` 網格）
- 無障礙：語意化標籤、`aria-hidden` 裝飾元素、鍵盤可達的導覽
- 尊重 `prefers-reduced-motion`：關閉所有動畫
- 分頁隱藏／首屏離開時自動暫停粒子運算

## 本地預覽

```powershell
# 任選一種
start .\index.html
python -m http.server 8080
npx serve .
```

## 目錄結構

```
├── index.html      # 頁面結構
├── 1.png           # 原始照片（主視覺）
├── css/style.css   # 樣式與動畫
└── js/main.js      # 粒子、進場、視差
```

## 線上版本

部署於 GitHub Pages：<https://<username>.github.io/<repo>/
