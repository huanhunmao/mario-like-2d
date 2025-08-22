# 2D 平台动作游戏（Mario-like）

一个使用 **HTML5 Canvas + 原生 ES Modules** 构建的横版平台动作小游戏。包含地图滚动、重力与碰撞、敌人 AI、金币收集、终点判定、摄像机跟随、HUD 等常用功能。代码采用模块化组织，便于扩展关卡与玩法。

## 快速开始

```bash
# 1) Node 18+
npm start
# 输出: http://localhost:5173
```

> 不依赖打包器，直接以原生 ES Module 运行。若使用 VSCode Live Server 亦可直接打开 `index.html` 运行。

## 操作

- `A/D` 或 ← →：移动
- `J` 或 空格：跳跃（接触地面可跳）
- `K`：水平冲刺
- `R`：重置关卡

## 目录结构

```
mario-like-2d
├─ index.html
├─ server.js            // 本地静态服务
├─ src
│  ├─ engine            // 引擎层
│  │  ├─ camera.js      // 摄像机/震屏
│  │  ├─ input.js       // 键盘输入
│  │  ├─ physics.js     // 基于瓦片的 AABB 碰撞与分离
│  │  ├─ renderer.js    // 背景/瓦片/实体渲染与 HUD
│  │  └─ tilemap.js     // 瓦片地图装载与绘制、视口裁剪
│  ├─ game
│  │  ├─ entities.js    // Player / Goomba / Coin / Flag
│  │  ├─ game.js        // 核心玩法循环与交互判定
│  │  └─ levels
│  │     └─ level1.json // 关卡数据（可扩展）
└─ package.json
```

## 关键实现

- **瓦片地图与视口裁剪**：仅渲染摄像机视野内的瓦片，避免不必要的像素填充。
- **碰撞系统（AABB）**：按轴分离，先水平后垂直；基于瓦片邻域快速检测，减少检测面积。
- **摄像机跟随与震屏**：围绕玩家的“安全边距”推进视口，触发事件可震屏。
- **实体交互**：踩踏敌人会反弹；金币收集；触旗通关；掉落至深渊判负。
- **无资源依赖**：纯矢量绘制，便于替换为精灵图或位图字库。

## 地图与关卡

- `src/game/levels/level1.json`：基础关卡。
- 字段：`width/height/tileSize/layers/solid/colors`。
- 标记：`1/2` 为可碰撞地形，`3` 为金币，`4` 为终点旗帜。
- 新增关卡：复制 `level1.json`，在 `main.js` 中按需加载。

## 扩展建议

- 动画与素材：加入 spritesheet 与帧动画系统（可按实体 `state` 切换）。
- 更多交互：弹簧、可破坏砖块、移动平台、管道、Boss。
- 物理优化：基于扫掠 AABB 的连续碰撞、坡地/半平台、动态四叉树宽相。

## 构建/部署

项目为静态资源，可直接部署至任意静态站点（GitHub Pages、Vercel、Nginx）。

```bash
npm start               # 本地开发
# 构建阶段无需打包，直接上传根目录文件即可
```

## 许可

MIT
