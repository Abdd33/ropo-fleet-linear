# GitHub Pages 发布

独立源码仓库：https://github.com/Abdd33/ropo-fleet-linear
在线原型：https://abdd33.github.io/ropo-fleet-linear/

## 分支与发布

- main：完整源码、预编译页面、素材、依赖锁文件及说明。
- gh-pages：由 main 的 dist/ 生成，只包含网页文件。
- Settings → Pages：Deploy from a branch，选择 gh-pages，目录 / (root)。
- dist/.nojekyll 保证按普通静态文件发布。

## 更新

先在 main 验证并提交改动。若修改 src/antd-ui.jsx 的控件行为，请先安装锁定依赖并执行 pnpm run build；普通业务脚本和主题 CSS 直接位于 dist/。

```sh
git add dist src README.md DEPLOYMENT.md
git commit -m "Update Linear fleet prototype"
git push origin main
git subtree split --prefix dist -b pages-release
git push origin pages-release:gh-pages
git branch -d pages-release
```

等待 GitHub Pages 构建完成，再检查在线地址。发布分支只更新当前版本的 dist/，原 ropo-fleet-prototype 仓库不受影响。

## 公开内容

本仓库和站点公开原型代码、页面素材与预置演示数据。浏览器 localStorage 状态、工作区截图、历史验证记录、凭据及原始项目参考文件不上传。
演示数据仅存于访问者浏览器，彼此不共享；不会控制真实车辆或调用业务后台。
