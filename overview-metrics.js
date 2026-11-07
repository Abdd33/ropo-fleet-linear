(() => {
  'use strict';
  const F = window.Fleet, h = F.h;
  // Supplied Lucide fleet icons. See LUCIDE-LICENSE.txt.
  const metricIconShapes = {"charging": "<path d=\"m11 7-3 5h4l-3 5\" /> <path d=\"M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935\" /> <path d=\"M22 14v-4\" /> <path d=\"M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936\" />", "alerts": "<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\" /> <path d=\"M12 9v4\" /> <path d=\"M12 17h.01\" />"};
  const metricIcon = key => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${metricIconShapes[key]}</svg>`;
  const statusGroups = [
    {key:'running', name:'执行任务', states:['running'], color:'#79a7df'},
    {key:'standby', name:'待命可用', states:['standby','waiting'], color:'#70b895'},
    {key:'charging', name:'补能充电', states:['charging'], color:'#ad90d0'},
    {key:'repair', name:'维修中', states:['maintenance'], color:'#c3a366'},
    {key:'offline', name:'离线', states:['offline'], color:'#dc8391'},
  ];
  // Fixed scene history, intentionally separate from live vehicle counts.
  const demoHistory = Object.freeze([
    {minute:480, running:18, standby:21},
    {minute:500, running:21, standby:18},
    {minute:520, running:25, standby:14},
    {minute:540, running:23, standby:16},
    {minute:560, running:27, standby:12},
    {minute:580, running:26, standby:13},
    {minute:600, running:29, standby:9},
  ].map(Object.freeze));
  const chart = {width:1000, height:110, left:32, right:22, top:8, bottom:24, start:480, now:620};
  const clock = minute => String(Math.floor(minute / 60)).padStart(2,'0') + ':' + String(minute % 60).padStart(2,'0');
  const percentage = (n,total) => total ? Math.round(n / total * 1000) / 10 : 0;
  function snapshot() {
    const vehicles = F.state.vehicles;
    const groups = statusGroups.map(group => ({...group, count:vehicles.filter(v=>group.states.includes(v.status)).length}));
    const known = new Set(statusGroups.flatMap(g=>g.states));
    const other = vehicles.filter(v=>!known.has(v.status)).length;
    if (other) groups.push({key:'all',name:'其他',color:'#8a8f98',count:other});
    // These are existing alert conditions, not inferred severity levels.
    const offline = groups.find(g=>g.key==='offline').count;
    const waiting = F.state.plans.filter(p=>p.status==='waiting'&&p.vehicleId==='RT-021').length;
    return {
      total:vehicles.length, groups,
      running:groups[0].count, standby:groups[1].count, charging:groups[2].count,
      alertTypes:[{name:'通信离线',count:offline,color:'#dc8391'},{name:'发车待确认',count:waiting,color:'#c3a366'}],
      alertCount:offline+waiting,
    };
  }
  function series(data) {
    return [...demoHistory.filter(p=>p.minute<chart.now), {minute:chart.now,running:data.running,standby:data.standby}];
  }
  const dot = color => `<i class="metric-dot" style="--dot:${color}" aria-hidden="true"></i>`;
  const relation = (group,total) => `${group.name} ${group.count} 辆 · ${percentage(group.count,total)}%`;
  const filterButton = (group,total,segment=false) => `<button type="button" class="${segment?'fleet-state-segment':'fleet-state-legend'}" data-action="overview-stat" data-filter="${group.key}" data-metric-state="${group.key}" data-metric-tip="${h(relation(group,total))}" aria-label="${h(relation(group,total))}" style="--state-color:${group.color};${segment?`flex-grow:${group.count}`:''}">${segment?'':`${dot(group.color)}<span>${h(group.name)}</span><b>${group.count}</b>`}</button>`;
  function render() {
    const data = snapshot(), pct = percentage(data.standby,data.total);
    const radius = 22, circumference = 2 * Math.PI * radius;
    return `<div class="fleet-metric-grid">
      <section class="fleet-metric fleet-composition" aria-label="车队状态">
        <div class="metric-head"><span>车队状态</span><button type="button" class="metric-all" data-action="overview-stat" data-filter="all" aria-label="全部车队 ${data.total} 辆">全部车队 ↗</button></div>
        <div class="metric-value" data-metric="total"><strong>${data.total}</strong><span>辆</span></div>
        <div class="fleet-state-bar" aria-label="车队状态占比">${data.groups.filter(g=>g.count).map(g=>filterButton(g,data.total,true)).join('')}${data.total?'':'<span class="metric-empty-bar"></span>'}</div>
        <div class="fleet-state-legends">${data.groups.map(g=>filterButton(g,data.total)).join('')}</div>
      </section>
      <button type="button" class="fleet-metric metric-link" data-action="overview-stat" data-filter="standby" aria-label="待命可用 ${data.standby} 辆，占车队 ${pct}%">
        <span class="metric-head">待命可用</span>
        <span class="metric-with-arc"><span class="metric-value" data-metric="standby"><strong>${data.standby}</strong><span>辆</span></span>
          <svg class="metric-arc" viewBox="0 0 52 52" width="52" height="52" aria-hidden="true"><circle cx="26" cy="26" r="${radius}" fill="none" stroke="#292c31" stroke-width="4"/><circle cx="26" cy="26" r="${radius}" fill="none" stroke="#70b895" stroke-width="4" stroke-linecap="${pct?'round':'butt'}" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference*(1-pct/100)}" transform="rotate(-90 26 26)"/></svg>
        </span><span class="metric-caption">占车队 ${pct}%</span>
      </button>
      <button type="button" class="fleet-metric metric-link" data-action="overview-stat" data-filter="charging" aria-label="补能充电 ${data.charging} 辆">
        <span class="metric-head">补能充电 ${metricIcon('charging')}</span><span class="metric-value" data-metric="charging"><strong>${data.charging}</strong><span>辆</span></span>
        <span class="metric-charge-bar" aria-hidden="true"><i style="width:${percentage(data.charging,data.total)}%"></i></span>
        <span class="metric-caption">当前补能 · 占车队 ${percentage(data.charging,data.total)}%</span>
      </button>
      <button type="button" class="fleet-metric metric-link" data-action="overview-stat" data-filter="alerts" aria-label="待处理警报 ${data.alertCount} 项，查看待处理事项">
        <span class="metric-head">待处理警报 ${metricIcon('alerts')}</span><span class="metric-value metric-alert-value" data-metric="alerts"><strong>${data.alertCount}</strong><span>项</span></span>
        <span class="metric-alert-types">${data.alertTypes.map(a=>`<span>${dot(a.color)}${a.name}<b>${a.count}</b></span>`).join('')}</span>
      </button>
    </div>${trendMarkup(data)}`;
  }
  function trendMarkup(data) {
    const points = series(data);
    if (!demoHistory.length) return '<section class="fleet-trend panel"><h3>运营趋势</h3><p class="muted">暂无演示趋势数据</p></section>';
    const max = Math.max(10,Math.ceil(Math.max(...points.flatMap(p=>[p.running,p.standby]))/10)*10);
    const x = minute => chart.left + (minute-chart.start)/(chart.now-chart.start)*(chart.width-chart.left-chart.right);
    const y = n => chart.top + (1-n/max)*(chart.height-chart.top-chart.bottom);
    const line = key => points.map((p,i)=>`${i?'L':'M'}${x(p.minute)},${y(p[key])}`).join(' ');
    return `<section class="fleet-trend panel" aria-label="运营趋势 · 演示趋势">
      <header><h3>运营趋势 <small>演示趋势 · 辆</small></h3><div class="trend-legends">
        ${statusGroups.slice(0,2).map(g=>`<button type="button" data-trend-key="${g.key}" aria-pressed="true" title="显示或隐藏${g.name}">${dot(g.color)}${g.name}<b>${data[g.key]}</b></button>`).join('')}
      </div><span class="trend-now">当前 10:20</span></header>
      <div class="trend-plot">
        <svg viewBox="0 0 ${chart.width} ${chart.height}" preserveAspectRatio="none" role="img" aria-label="08:00 至 10:20 演示趋势，当前执行任务 ${data.running} 辆，待命可用 ${data.standby} 辆">
          ${[0,max/2,max].map(n=>`<line class="trend-grid" x1="${chart.left}" x2="${chart.width-chart.right}" y1="${y(n)}" y2="${y(n)}"/><text class="trend-y" x="${chart.left-8}" y="${y(n)+3}">${n}</text>`).join('')}
          ${[480,540,600,620].map(minute=>`<text class="trend-x" x="${x(minute)}" y="${chart.height-5}">${clock(minute)}</text>`).join('')}
          ${statusGroups.slice(0,2).map(g=>`<g data-trend-series="${g.key}" style="--series-color:${g.color}"><path class="trend-line" d="${line(g.key)}"/><circle class="trend-current" cx="${x(chart.now)}" cy="${y(data[g.key])}" r="3" data-current-value="${data[g.key]}"/></g>`).join('')}
          <line class="trend-reference" x1="0" x2="0" y1="${chart.top}" y2="${chart.height-chart.bottom}" hidden/>
        </svg>
        <div class="trend-hit" tabindex="0" role="slider" aria-label="查看趋势时间点" aria-valuemin="0" aria-valuemax="${points.length-1}" aria-valuenow="${points.length-1}" aria-valuetext="10:20，执行任务 ${data.running} 辆，待命可用 ${data.standby} 辆"></div>
        <div class="trend-tooltip" role="tooltip" hidden></div>
      </div>
    </section>`;
  }
  function mount(root) {
    const controller = new AbortController(), {signal} = controller;
    const data = snapshot(), points = series(data);
    const trend = root.querySelector('.fleet-trend'), hit = trend?.querySelector('.trend-hit');
    const tip = trend?.querySelector('.trend-tooltip'), reference = trend?.querySelector('.trend-reference');
    const hidden = new Set();
    let current = points.length-1;
    function show(index) {
      current = Math.max(0, Math.min(points.length-1,index));
      const p = points[current], ratio = (p.minute-chart.start)/(chart.now-chart.start);
      const x = chart.left + ratio*(chart.width-chart.left-chart.right);
      reference.setAttribute('x1',x); reference.setAttribute('x2',x); reference.removeAttribute('hidden');
      tip.textContent = `${clock(p.minute)} · 执行任务 ${p.running} 辆 · 待命可用 ${p.standby} 辆`;
      tip.hidden = false;
      tip.style.left = Math.max(4,Math.min(hit.clientWidth*ratio,hit.clientWidth-tip.offsetWidth-4)) + 'px';
      hit.setAttribute('aria-valuenow',current);
      hit.setAttribute('aria-valuetext',tip.textContent);
    }
    function hide() { tip.hidden=true; reference.setAttribute('hidden',''); }
    if (hit) {
      hit.addEventListener('pointermove',event=>{
        const r=hit.getBoundingClientRect();
        const minute=chart.start+(event.clientX-r.left)/r.width*(chart.now-chart.start);
        const index=points.reduce((best,p,i)=>Math.abs(p.minute-minute)<Math.abs(points[best].minute-minute)?i:best,0);
        show(index);
      },{signal});
      hit.addEventListener('pointerleave',hide,{signal});
      hit.addEventListener('focus',()=>show(current),{signal});
      hit.addEventListener('blur',hide,{signal});
      hit.addEventListener('keydown',event=>{
        if(event.key==='Escape'){hide();return;}
        if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
        event.preventDefault();
        show(event.key==='Home'?0:event.key==='End'?points.length-1:current+(event.key==='ArrowLeft'?-1:1));
      },{signal});
      trend.querySelectorAll('[data-trend-key]').forEach(button=>{
        const key=button.dataset.trendKey;
        const highlight=()=>trend.dataset.highlight=key;
        const unhighlight=()=>delete trend.dataset.highlight;
        button.addEventListener('pointerenter',highlight,{signal});
        button.addEventListener('pointerleave',unhighlight,{signal});
        button.addEventListener('focus',highlight,{signal});
        button.addEventListener('blur',unhighlight,{signal});
        button.addEventListener('click',()=>{
          if(hidden.has(key))hidden.delete(key);
          else if(hidden.size===0)hidden.add(key);
          else return;
          button.setAttribute('aria-pressed',String(!hidden.has(key)));
          const group=trend.querySelector(`[data-trend-series="${key}"]`);
          group.style.display=hidden.has(key)?'none':'';
        },{signal});
      });
    }
    const floating=document.createElement('div');
    floating.className='overview-metric-tooltip';
    floating.setAttribute('role','tooltip');
    floating.id='overview-metric-tooltip';
    floating.hidden=true;
    document.body.append(floating);
    let target;
    function clearMetric() {
      root.querySelectorAll('.is-metric-highlight').forEach(e=>e.classList.remove('is-metric-highlight'));
      target?.removeAttribute('aria-describedby'); target=null; floating.hidden=true;
    }
    function metricHover(event) {
      const el=event.target.closest('[data-metric-state]');
      if(!el||el===target)return;
      clearMetric(); target=el;
      root.querySelectorAll('[data-metric-state]').forEach(other=>other.classList.toggle('is-metric-highlight',other.dataset.metricState===el.dataset.metricState));
      floating.textContent=el.dataset.metricTip;
      floating.hidden=false; el.setAttribute('aria-describedby',floating.id);
      const r=el.getBoundingClientRect();
      floating.style.left=Math.max(8,Math.min(r.left,innerWidth-floating.offsetWidth-8))+'px';
      floating.style.top=Math.max(8,r.top-floating.offsetHeight-6)+'px';
    }
    root.addEventListener('pointerover',metricHover,{signal});
    root.addEventListener('focusin',metricHover,{signal});
    root.addEventListener('pointerout',event=>{
      if(target?.contains(event.target)&&!target.contains(event.relatedTarget)&&!target.matches(':focus-visible'))clearMetric();
    },{signal});
    root.addEventListener('focusout',clearMetric,{signal});
    window.addEventListener('scroll',clearMetric,{signal});
    window.addEventListener('resize',()=>{clearMetric(); if(hit)hide();},{signal});
    root.addEventListener('keydown',event=>{if(event.key==='Escape')clearMetric();},{signal});
    F.cleanup=()=>{controller.abort();floating.remove();};
  }
  F.overviewMetrics={render,mount};
})();
