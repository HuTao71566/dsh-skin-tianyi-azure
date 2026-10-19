# 天依蓝 · 洛天依皮肤（dsh-skin-tianyi-azure）

DeepSeek Harness Web 界面的一套洛天依主题皮肤，纯展示型插件：不注册任何 Host 服务，只挂一个 Client 半。

- **壁纸**：`shell.overlay` 里的一层全屏、可穿透点击的插画薄雾；左侧淡出，右侧显色，不压住正文。**亮暗各一张**，随主题实时换图。
- **品牌位**：侧栏左上角的品牌标记、以及新建会话页的大标记，换成天依的圆形头像（带天依蓝描边）。
- **强调色**：`--dsw-alias-brand-primary` → `#66CCFF`（天依蓝），通过 `ctx.theme.overrideTokens()` 叠加，不改主题注册表。
- **设置卡**：插画浓度与侧栏装饰共四条滑条（亮色 / 暗色各两条），由皮肤管理器画在「设置 → 皮肤管理」里，只在当前皮肤是本皮肤时出现。

## 安装

从 GitHub 安装（把 `<user>` 换成仓库作者名）：

```text
install_bundle  target: github:<user>/dsh-skin-tianyi-azure
```

也可以在 DSH 的插件页里安装本仓库，或把仓库克隆到本地后按本地路径安装。
装好后打开 **设置 → 皮肤管理**（需要 `@smalltailqwq/dsh-client-ui-skin-deep-whale-manager`），选中「天依蓝 · 洛天依」。

默认参数：亮色插画 60% / 暗色插画 60% / 左侧装饰 100%，可在皮肤管理卡片里调，或点「重置」回到这组值。


## 与皮肤管理器集成

本包含一份 `skin.json`，因此会出现在「设置 → 皮肤管理」里，与 whale 系列皮肤并列、由管理器统一开关与互斥：

```json
{ "id": "tianyi-azure", "package": "dsh-skin-tianyi-azure",
  "wiring": { "id": "ui-skin-tianyi-azure" }, "bodyAttr": "data-dsh-tianyi-azure" }
```

- `wiring.id` 必须等于 `cordis.patch.yml` 里那一行的 `id`（`ui-skin-tianyi-azure`），管理器就是按它往 profile / home 两层的 `cordis.patch.yml` 写 `disabled: true|false`。
- **必须由皮肤自己打 `bodyAttr` 标记**：Client 半在 `ctx.effect` 里给 `<body>` 加 `data-dsh-tianyi-azure`，卸载时移除。管理器的界面靠这个属性判断「当前装的是哪套皮肤」，没有它就会误判成「官方默认已生效」，切换按钮点了也不动。
- 选「官方默认」时本行被置为 `disabled: true`，整个插件卸载：壁纸层、头像注册、主题叠加与 body 标记一并撤掉，品牌位回到官方小鱼标记。**不会占用默认外观。**
- 选任意一套皮肤时，管理器会把其余皮肤（含本皮肤）写成 `disabled: true`，所以只会有一层生效。

## 结构

```text
dsh-skin-tianyi/
├── package.json            # 包清单：dsh.bundle.patch + dsh.client(web)
├── cordis.patch.yml        # 插入一行 ui-skin-tianyi-azure
├── index.js                # Host 半：空 apply（本插件没有 Host 行为）
├── client.js               # 构建产物：图片已内联为 data URI，勿手改
├── skin.json               # 皮肤管理器清单（id / wiring.id / bodyAttr / 兼容版本）
├── src/
│   ├── client.template.js  # 真正的源码，改这里
│   ├── make-assets.py      # 从原图重建 assets/*.webp（裁切参数都在里面）
│   └── smoke.mjs           # 本地冒烟：桩 window/ctx 跑一遍 apply
├── build.mjs               # 把 assets/*.webp 内联进 client.js
├── assets/
│   ├── wallpaper-dark.webp          # 1920×1200 云端城堡·夜（镜像，锐化）
│   ├── wallpaper-light.webp         # 1920×1200 云端城堡（镜像，锐化）
│   ├── sidebar-portrait-dark.webp   # 620×721 夜雨纸伞半身像（两个主题共用）
│   ├── sidebar-ambience.webp        # 560×620 左侧栏舞台光（夜空重模糊）
│   ├── sidebar-ambience-light.webp  # 560×620 亮色舞台光（晴空重模糊、提亮）
│   ├── avatar.webp                  # 512×512 头像（Q 版头部）
│   └── icon.svg                     # 插件列表图标
└── locale/{zh,en}.json     # meta.title / meta.description
```

`src/make-assets.py` 需要原图（不进包）：

```powershell
$env:TIANYI_RAW='<放原图的目录>'
python src/make-assets.py      # 重新生成 assets/*.webp
node build.mjs                 # 再内联进 client.js
```

## 皮肤设置（皮肤管理页里的卡片）

不单独占用设置导航：皮肤通过管理器的 **customization 协议**（`dsh:skin-customization-register-v2` 事件）申报自己的设置，管理器把卡片画在 **设置 → 皮肤管理** 里，且只在该皮肤为当前皮肤时显示。重置按钮、持久化、导入导出都由管理器负责。

| 滑条 | 作用 | 范围 | 默认 |
|---|---|---|---|
| 亮色插画不透明度 | 亮色壁纸浓度（`--ty-art-user-light`） | 0–100% | 60% |
| 暗色插画不透明度 | 暗色壁纸浓度（`--ty-art-user-dark`） | 0–100% | 60% |
| 亮色左侧装饰 | 亮色侧栏光效与半身像倍率（`--ty-side-scale-light`） | 0–100% | 100% |
| 暗色左侧装饰 | 暗色侧栏光效与半身像倍率（`--ty-side-scale-dark`） | 0–100% | 100% |

- 四条全部按主题分开记，调亮色不会连带把暗色也拖亮。
- 值由管理器存进 `localStorage['dsh.skin-manager.preferences.v2']`（与 maid / orca 两套皮肤同一份偏好），卡片上的「重置」调用 `registry.resetSkin('tianyi-azure')`。
- 皮肤只做两件事：注册时 `dispatchEvent` 申报定义，收到 `apply({ values })` 时把四个数写到 `<html>` 的 CSS 变量上；卸载时 `apply(null)` 撤销。
- 没装管理器时这些变量不存在，样式表回落到下面的分主题默认值。

## 两套调参（亮色 / 暗色分开）

皮肤会读当前主题的 `colorScheme`，把它写成 `<body data-dsh-tianyi-scheme="light|dark">`，并在 `theme/change` 事件里实时跟随。CSS 因此有两套独立参数，改一套不影响另一套：

| 变量 | 暗色 | 亮色 | 作用 |
|---|---|---|---|
| `--ty-art` | 0.6 | 0.6 | 右侧插画浓度（管理器滑条会覆盖，发布默认 60%） |
| `--ty-art-sat` / `--ty-art-contrast` | 1.2 / 1.1 | 1.24 / 1.14 | 饱和度 / 对比度（提锐度） |
| `--ty-glow` | 0.5 | 0.5 | 左栏舞台光（× `--ty-side-scale-dark` / `-light`，滑条 100% 即此值） |
| `--ty-portrait` | 0.48 | 0.5 | 左栏半身像（× `--ty-side-scale-dark` / `-light`，滑条 100% 即此值） |
| `--ty-veil-strong` | 0.18 | 0.05 | 底部深蓝雾 |
| `--ty-veil-soft` / `--ty-veil-hint` | 0.09 / 0.05 | 0.03 / 0.02 | 右侧青光 / 顶部微光 |

暗色靠这些半透明光把纯黑提亮；亮色刻意压得很轻，避免白底上出现灰污。图片本身也是分开的：同一张夜空图铺在白底上会变成灰块，所以亮色换成了白云那张。

## 图层关系（图在字下）

插画**不在插槽里**：`shell.overlay` 渲染在 `.BynINW_overlayLayer`（`z-index: 20`）中，天然盖在所有栏之上，文字必然被它蒙一层。现在的做法完全用 CSS：

- 选框：`body[data-dsh-tianyi-azure] :has(> [data-shell-overlay])` —— 这个 `:has()` 精确命中「含有 overlay 层的那个元素」，也就是 shell frame，不依赖任何构建哈希；
- 该元素 `isolation: isolate` 成为层叠上下文，`::after` 以 `position: absolute; z-index: -1` 画在 frame 背景**之上**、所有栏与文字**之下**；
- 顶部渐隐（窗口标题栏那条）**烘进图片 alpha**，CSS 只留一条横向遮罩，因此不依赖 `mask-composite`；
- 会挡住它的两层不透明底都被放掉：中心列（`[class*='centerCol']`）和会话面板（带 `data-phase` 的根节点，它的 `background: var(--dsw-alias-bg-base)` 就是之前“插画完全看不见”的元凶）；
- **暗色**下把侧栏列也放透明（并去掉右边框），让壁纸一直延伸到整个左栏：左边的人物和右边的大图因此是同一片夜景，而不是两幅画拼在一起；横向遮罩同时改成从最左端 0% 起坡，接缝彻底消失。
- 亮色保留侧栏底色（白底上放透明栏会显得空），左侧装饰（光效 + 半身像）仍留在 overlay 里用普通透明度。

亮/暗两套浓度、遮罩与滑条都还在，只是不再是“盖在字上的雾”。

<!-- legacy: 曾经试过 (1) mix-blend-mode——overlay 层是层叠上下文，混合看不到页面；(2) 插件 apply() 里插 DOM——那时 shell 还没渲染；(3) 组件挂载时插 DOM——被会话面板的不透明底挡住。 -->

## 左侧工作区

侧栏装饰画在**侧栏列里面**（`[class*='sidebarCol']`，`position: relative` + `isolation: isolate`），因此永远在侧栏文字的下面，和正文区“图在字下”的做法一致：

- `::before`：整张插画（夜雨纸伞），`left/right: -4%`、`bottom: 0`、`height: 70%`、`cover`、`background-position: 50% 50%`，上缘 38% 处渐隐；透明度 = `--ty-portrait × --ty-side-scale`（即「亮色/暗色左侧装饰」滑条）。
- `::after`：舞台光（重模糊的夜空），透明度 = `--ty-glow × --ty-side-scale`。
- 侧栏入口自己会用 `--dsw-specific-sidebar-fill` 画一层不透明底，盖住装饰；所以这个 token 在 `<body>` 上先被存成 `--dsh-ty-sidebar-base`，列内把它置透明，再由列自己用存下的颜色打底。
- 两个主题都保留侧栏自己的底色与边框：右侧壁纸只铺在正文区，不会伸进左栏，左右两边互不混合。
- `sidebar.brand.name` 换成「天依蓝 / TIANYI AZURE」渐变字标，卸载时恢复官方字标。


## 改样式

1. 换图：改 `src/make-assets.py` 里的裁切框，跑一遍；只调浓淡则跳过这步。
2. 编辑 `src/client.template.js`（浓淡在 `.ty-azure-wall` 的变量表里，配色在 `:root` 与 `overrideTokens` 两处）。
3. `node build.mjs` 重新生成 `client.js`。
4. 浏览器端是热更的：`client-modules` 按文件 mtime/size 推出新修订并推给已打开的页面，**不需要重启 DSH**。Host 半（`index.js`）改动才需要重启。

## 卸载

插件页里停用或移除 `dsh-skin-tianyi-azure`；或从 profile 的 `dsh.profile.bundles` 里去掉这一行。

## 版权

代码 MIT。**插画不是 MIT**：素材为用户提供的洛天依同人 / 官方插画，角色形象与插画著作权属于上海禾念（Vsinger）及各原画作者（见 `NOTICE`）。本包只作个人本地界面自用，请勿再分发或商用。
