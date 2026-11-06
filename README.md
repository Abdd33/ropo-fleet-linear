# ROPO Fleet · Linear 全站副本

这是 ROPO Fleet 完整交互原型的独立 Linear 视觉版本。主题覆盖运营总览、车辆管理、车辆详情、任务与调度、创建计划、远程运营、自动化流程、记录与交班、系统设置。

[在线演示](https://abdd33.github.io/ropo-fleet-linear/) · [源码仓库](https://github.com/Abdd33/ropo-fleet-linear)

## 打开

1. 将 ZIP 完整解压，不要在压缩包内直接打开 HTML。
2. 在 Windows 文件资源管理器中双击根目录 index.html，自动进入 dist/index.html。
3. 若浏览器限制本地页面，双击 START-PREVIEW.cmd，访问 http://127.0.0.1:4190。结束后关闭终端。

打包页面无需安装依赖；请保持 dist 内 JS、CSS 和 assets 完整。聊天中的 HTML 链接可能显示源码，请通过文件资源管理器打开。

## 本次设计

- 采用 Linear 参考规范的近黑背景、灰阶表面、细边框、克制阴影与薰衣草紫主要操作。
- 六个指标以连贯的分区指标栏呈现；强化数字与标题的层级。
- 告警以分隔线和固定操作位置组织，保留编号、状态、时间、原因及操作结果。
- 地图降低底图饱和度，保留语义状态色、图层切换和选中车辆联动。
- 统一按钮、任务表、输入框及弹窗；保留键盘焦点与减少动态效果支持。
- 车辆卡、详情、远程运营和四步创建向导统一为灰阶表面与清晰分隔。
- 甘特图沿用时间网格、任务块、可拖动时间游标和详情联动；仅调整表面、边框、文字和语义状态色。
- 自动化沿用自由画布、节点拖拽、平移缩放、端口连线、子步骤、配置栏、校验及车组模拟；未更换表现形式。
- Ant Design 日期、筛选、消息和确认框同步采用 Linear 主题。

未新增解释段落，未删减业务信息。原来的任务甘特图和可拖拽自动化画布均完整保留。

## 样式维护

dist/linear-home.css 包含公共基础和首页样式；dist/linear-system.css 包含其余页面及语义颜色变量。
主题规则限定在 body.linear-theme 下，所有路由均生效。body.linear-home 仍用于标识首页。
src/antd-ui.jsx 的 fleetTheme 对象管理 Ant Design 主题；随包 dist/antd-ui.js 中对应主题常量已同步，控件行为代码未变。本轮只同步主题常量，没有新增依赖或重新构建业务模块。
底层仍是原 HTML / JavaScript 模块及 React / Ant Design 控件桥接，本轮没有更换组件库。

为保留首页副本已有的演示数据，继续使用 ropo-fleet-prototype-linear-home-v1 存储键。它与原版的存储键独立。首次打开使用预设数据；系统设置可导出 JSON 作为备份。

## 参考与验证

DESIGN.md 为本地安装的 [awesome-design-md Linear 规范](https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/linear.app/DESIGN.md)副本，来源提交 fcc70284932276d085f01ef9f83edde90b1258cb。它是设计参考文档，并非安装了 Linear 组件库。

已检查全部页面及代表性交互，实际验证甘特时间游标、画布拖拽/平移/缩放、子步骤、流程校验和车组模拟。甘特图与画布额外检查了 1280 和 1440 宽度。
设计参考的 MIT 授权见 DESIGN-LICENSE.txt；页面运行依赖的第三方声明见 dist/THIRD_PARTY_NOTICES.txt。
发布方式见 DEPLOYMENT.md。所有业务操作仍是本地模拟，不连接真实车辆或后台服务。
