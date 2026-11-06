/* Contextual help belongs outside the primary working area. No business-state mutations. */
(() => {
  'use strict';
  const F = window.Fleet;
  F.contextHelp = (topic, label) => `<button type="button" class="context-help" data-action="visual-help" data-topic="${F.h(topic)}" aria-label="${F.h(label)}"><span aria-hidden="true">ⓘ</span>${F.h(label)}</button>`;
  const content = {
    timeline: ['时间轴帮助', [
      ['预览时点', '拖动红色游标，按 5 分钟吸附。卡片状态和右侧进度随预览时间更新，车辆真实演示状态不因此改变。'],
      ['键盘操作', '聚焦时间游标后，<kbd>←</kbd> <kbd>→</kbd> 移动 5 分钟；按住 <kbd>Shift</kbd> 移动 15 分钟；<kbd>Home</kbd> / <kbd>End</kbd> 跳至范围首尾。'],
      ['计划联动', '点击任务查看详情；点击车辆选中该时点的当前、下一项或最近完成的计划。时间轴支持横向滚动。'],
      ['调整计划', '在右侧调整时段或换车；系统检查车辆时段冲突。未触发的预排班不能进入远程接管。'],
    ]],
    canvas: ['画布帮助', [
      ['移动与缩放', '拖动画布空白处平移；也可按住空格或使用鼠标中键拖动。使用底部 − / + 缩放，⛶ 适应全部节点。'],
      ['添加与拖动', '点击或拖入左侧组件添加节点。拖动节点标题移动卡片；展开子步骤不会自动重排主流程。'],
      ['结果连线', '点击或拖动结果输出端口，再连接目标输入端口。每个结果出口保留一条连线；也可在右侧“结果与下一步”配置。'],
      ['删除与撤销', '拖入垃圾桶删除节点，或选中后按 Delete / Backspace。删除后可“撤销删除”。选中连线后可断开。'],
      ['校验与模拟', '保存草稿允许存在待修复项；模拟和发布前须通过流程检查。异常连线可通过工具栏开关查看。'],
    ]],
    'task-types': ['任务类型', [
      ['接送任务', '配置起终点、时间与可用车辆，安排乘客接送。'],
      ['回场补能', '将车辆调回运营中心补能，检查预计到达电量。'],
      ['车辆调位', '将空闲车辆调至指定候客区或运营区域。'],
      ['循环运行', '按固定线路循环巡航，配置路线、发车时间和执行车辆。'],
      ['停运检修', '安排车辆返回维修区域，完成后再恢复运营。'],
    ]],
    map: ['地图帮助', [
      ['浏览', '拖动地图平移，使用 + / − 或滚轮缩放；“适应宽度”恢复初始范围。'],
      ['素材范围', '地图是原稿静态素材，路线与耗时为模拟值，不提供实时导航。'],
    ]],
    environment: ['演示环境', [
      ['操作范围', '所有计划、发车、停车、工单和流程发布均为本地模拟，不连接真实车辆或外部服务。'],
      ['数据保存', '修改保存在当前浏览器。可在系统设置中导出 JSON 或恢复初始数据；恢复操作会清除本地修改。'],
      ['场景时间', '初始场景为 2026-10-23 10:20。新增操作记录采用设备时间。'],
      ['地图与视频', '地图、摄像头和车辆图像为原稿素材，不能反映实时位置或路况。'],
    ]],
  };
  let helpTrigger = null;
  document.addEventListener('click', e => {
    const button = e.target.closest('[data-action="visual-help"]');
    if (!button) return;
    const topic = content[button.dataset.topic];
    if (!topic) return;
    helpTrigger = button;
    F.modal(topic[0], `<dl class="help-grid">${topic[1].map(([term, text]) => `<div><dt>${term}</dt><dd>${text}</dd></div>`).join('')}</dl><div class="dialog-actions"><button class="btn primary" type="submit">知道了</button></div>`);
  });
  document.querySelector('#modal').addEventListener('close', () => {
    if (helpTrigger?.isConnected) helpTrigger.focus({preventScroll:true});
    helpTrigger = null;
  });
})();
