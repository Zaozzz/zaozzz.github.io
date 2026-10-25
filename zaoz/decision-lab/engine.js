/* Small, deterministic portfolio solver. All input records are fictional demo data. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AtlasEngine=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const evidence=[
    {id:'e1',name:'季度资源与预算底稿',kind:'财务',status:'ready',label:'已核对',note:'提供预算、人周与项目成本的演练基线。数字来自内置虚构样例。'},
    {id:'e2',name:'客户访谈摘要与交付复盘',kind:'客户',status:'ready',label:'已核对',note:'假定客户更关注按时交付、使用体验与售后响应；用于说明项目评分依据。'},
    {id:'e3',name:'渠道试点需求表',kind:'市场',status:'stale',label:'需要更新',note:'演练中假定需求窗口已变化。启动渠道增长前，应更新需求与转化假设。'},
    {id:'e4',name:'备选供应商验证记录',kind:'供应链',status:'pending',label:'待补材料',note:'缺少批量质量与切换周期验证。双源项目执行前需要补充相关资料。'},
    {id:'e5',name:'平台与自动化技术评估',kind:'研发',status:'ready',label:'已核对',note:'假定数据观察台是自动化提效的前置能力；人周为总投入而非并行人数。'},
    {id:'e6',name:'质量与安全约束清单',kind:'治理',status:'ready',label:'已核对',note:'将安全与质量审计设为每个组合的必选项。真实组织须自行制定约束。'}
  ];
  const projects=[
    {id:'p1',name:'交付流程升级',short:'交付底座',owner:'交付团队',cost:24,people:8,weeks:4,risk:14,growth:42,resilience:92,experience:78,deps:[],evidence:['e1','e2'],description:'梳理交付节点、统一验收清单，为新产品试点和供应切换提供稳定的交付基础。'},
    {id:'p2',name:'供应链双源验证',short:'双源验证',owner:'采购团队',cost:28,people:9,weeks:5,risk:18,growth:36,resilience:96,experience:58,deps:['p1'],evidence:['e1','e4'],description:'在交付标准明确后验证备选供应链。演练中仍有验证材料缺口，不能将评分视为实际可行性证据。'},
    {id:'p3',name:'旗舰产品试点',short:'产品试点',owner:'产品团队',cost:38,people:13,weeks:6,risk:38,growth:94,resilience:55,experience:86,deps:['p1'],evidence:['e1','e2'],description:'在交付流程升级后开展小范围产品试点，验证核心价值与服务承接能力。'},
    {id:'p4',name:'渠道增长实验',short:'渠道实验',owner:'增长团队',cost:22,people:7,weeks:3,risk:42,growth:90,resilience:35,experience:62,deps:['p3'],evidence:['e2','e3'],description:'通过已完成的产品试点验证渠道策略。需先完成产品试点，并更新演练中的过期需求材料。'},
    {id:'p5',name:'客户成功体系',short:'客户成功',owner:'服务团队',cost:18,people:6,weeks:4,risk:16,growth:62,resilience:73,experience:96,deps:[],evidence:['e1','e2'],description:'建立关键客户跟进、问题归档和使用反馈机制，提升已有客户的交付与使用体验。'},
    {id:'p6',name:'数据观察台',short:'数据观察',owner:'数据团队',cost:16,people:5,weeks:3,risk:20,growth:64,resilience:78,experience:72,deps:[],evidence:['e1','e5'],description:'建立可复用的指标与异常观察能力，为后续自动化提效提供数据基础。'},
    {id:'p7',name:'安全与质量审计',short:'安全审计',owner:'质量团队',cost:14,people:4,weeks:2,risk:8,growth:28,resilience:94,experience:65,deps:[],evidence:['e1','e6'],description:'核对关键风险、验收标准与安全约束。作为本演练所有方案的固定必选项目。'},
    {id:'p8',name:'自动化提效',short:'自动化',owner:'研发团队',cost:26,people:8,weeks:5,risk:27,growth:77,resilience:75,experience:68,deps:['p6'],evidence:['e1','e5'],description:'在数据观察台具备基础能力后，对重复流程进行自动化，减少人工整理与交接成本。'}
  ];
  const scenarios={
    launch:{name:'新品上市',title:'增长机会，先配好交付能力。',brief:'下一季度计划推出新产品。有限的预算和团队投入，需要在新增长、现有客户与交付稳定性之间取舍。',budget:120,capacity:40,horizon:12,risk:36,weights:{growth:55,resilience:20,experience:25},mandatory:['p7'],event:'需求窗口缩短 2 周，项目成本上浮 8%。'},
    supply:{name:'供应受阻',title:'先守住交付，再寻找增长。',brief:'核心供应不稳定，需要建立双源保障，同时保留客户服务能力。先确认必做事项，再比较剩余资源的去向。',budget:104,capacity:36,horizon:13,risk:27,weights:{growth:20,resilience:60,experience:20},mandatory:['p2','p7'],event:'备选供应验证延长 2 周，项目成本上浮 10%。'},
    tight:{name:'预算收紧',title:'资源减少时，保留最有用的行动。',brief:'预算与团队投入受限。优先守住质量和客户体验，明确本轮选择以及需要延后的项目。',budget:76,capacity:26,horizon:10,risk:25,weights:{growth:25,resilience:40,experience:35},mandatory:['p7'],event:'可用预算临时减少 20%，人力与期限保持不变。'}
  };
  const policies=[{id:'recommended',name:'当前目标优先',note:'按你设定的目标权重，寻找可行范围内贡献最高的组合。'}, {id:'resilient',name:'韧性优先',note:'提高韧性权重，比较更重视稳定性的选择。',weights:{growth:15,resilience:70,experience:15}}, {id:'growth',name:'增长优先',note:'提高增长权重，检视机会与风险之间的取舍。',weights:{growth:75,resilience:10,experience:15}}];
  const find=id=>projects.find(p=>p.id===id);
  const defaults=scenario=>({scenario,budget:scenarios[scenario].budget,capacity:scenarios[scenario].capacity,horizon:scenarios[scenario].horizon,risk:scenarios[scenario].risk,weights:{...scenarios[scenario].weights},shock:false,locked:[],excluded:[]});
  function effective(config){return {...config,budget:config.shock&&config.scenario==='tight'?Math.floor(config.budget*.8):config.budget,horizon:config.shock&&config.scenario==='launch'?config.horizon-2:config.horizon,costFactor:config.shock?(config.scenario==='launch'?1.08:config.scenario==='supply'?1.1:1):1};}
  function evaluate(mask,config){
    const env=effective(config),items=projects.filter((p,i)=>mask&(1<<i)),ids=items.map(p=>p.id),reasons=[];
    const sum=k=>items.reduce((n,p)=>n+p[k],0),cost=Math.round(sum('cost')*env.costFactor*10)/10,people=sum('people');
    const risk=cost?items.reduce((n,p)=>n+p.cost*p.risk,0)/sum('cost'):0;
    const required=[...new Set([...scenarios[config.scenario].mandatory,...config.locked])];
    if(!items.length)reasons.push('至少选择一个项目');
    required.forEach(id=>{if(!ids.includes(id))reasons.push('缺少必选：'+find(id).name);});
    config.excluded.forEach(id=>{if(ids.includes(id))reasons.push('包含已排除项目：'+find(id).name);});
    items.forEach(p=>p.deps.forEach(id=>{if(!ids.includes(id))reasons.push(p.name+' 缺少前置 '+find(id).name);}));
    if(cost>env.budget+1e-8)reasons.push('预算超出 '+Number((cost-env.budget).toFixed(1))+' 万元');
    if(people>env.capacity)reasons.push('人力超出 '+(people-env.capacity)+' 人周');
    if(risk>env.risk+1e-8)reasons.push('组合风险超过上限');
    const schedule={},finish=id=>{if(schedule[id])return schedule[id].end;const p=find(id);const start=p.deps.filter(d=>ids.includes(d)).reduce((n,d)=>Math.max(n,finish(d)),0);const duration=p.weeks+(config.shock&&config.scenario==='supply'&&id==='p2'?2:0);schedule[id]={start,end:start+duration};return start+duration;};
    items.forEach(p=>finish(p.id));
    const weeks=items.reduce((n,p)=>Math.max(n,schedule[p.id].end),0);
    if(weeks>env.horizon)reasons.push('前置依赖后的工期超出 '+(weeks-env.horizon)+' 周');
    const dims={growth:sum('growth'),resilience:sum('resilience'),experience:sum('experience')};
    const sources=[...new Set(items.flatMap(p=>p.evidence))].map(id=>evidence.find(e=>e.id===id));
    const coverage=sources.length?Math.round(sources.filter(e=>e.status==='ready').length/sources.length*100):0;
    return {mask,items,ids,cost,people,risk:Math.round(risk*10)/10,weeks,schedule,dims,sources,coverage,reasons,feasible:reasons.length===0};
  }
  function score(plan,weights){const total=weights.growth+weights.resilience+weights.experience;return Object.keys(plan.dims).reduce((n,k)=>n+plan.dims[k]*weights[k]/total,0);}
  function solve(config){
    const candidates=[];for(let mask=1;mask<(1<<projects.length);mask++){const p=evaluate(mask,config);if(p.feasible)candidates.push(p);}
    const options=policies.map(policy=>{const weights=policy.weights||config.weights;const sorted=candidates.slice().sort((a,b)=>score(b,weights)-score(a,weights)||a.cost-b.cost||a.mask-b.mask);const plan=sorted[0]||null;return {...policy,weights,plan,score:plan?score(plan,config.weights):0};});
    return {options,candidates,count:candidates.length,total:(1<<projects.length)-1,env:effective(config)};
  }
  function validateConfig(c){
    if(!c||!Object.prototype.hasOwnProperty.call(scenarios,c.scenario))throw new Error('未知演练场景');
    for(const [k,lo,hi] of [['budget',40,200],['capacity',12,64],['horizon',6,18],['risk',10,55]])if(typeof c[k]!=='number'||!Number.isFinite(c[k])||c[k]<lo||c[k]>hi)throw new Error('参数不合法：'+k);
    if(!c.weights||!['growth','resilience','experience'].every(k=>typeof c.weights[k]==='number'&&Number.isFinite(c.weights[k])&&c.weights[k]>=0&&c.weights[k]<=100)||['growth','resilience','experience'].reduce((sum,k)=>sum+c.weights[k],0)<=0)throw new Error('目标权重须在 0–100 且不能全部为零');
    if(typeof c.shock!=='boolean')throw new Error('压力事件格式不正确');
    for(const k of ['locked','excluded'])if(!Array.isArray(c[k])||c[k].length>projects.length||!c[k].every(id=>typeof id==='string'&&find(id))||new Set(c[k]).size!==c[k].length)throw new Error('项目约束格式不正确');
    if(c.locked.some(id=>c.excluded.includes(id)))throw new Error('同一项目不能同时必选和排除');
    return {scenario:c.scenario,budget:c.budget,capacity:c.capacity,horizon:c.horizon,risk:c.risk,weights:{growth:c.weights.growth,resilience:c.weights.resilience,experience:c.weights.experience},shock:c.shock,locked:[...c.locked],excluded:[...c.excluded]};
  }
  return {projects,evidence,scenarios,policies,find,defaults,effective,evaluate,score,solve,validateConfig};
});
