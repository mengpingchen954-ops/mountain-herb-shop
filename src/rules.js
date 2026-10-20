export const SPECIES=[
 {id:'dew',name:'银露叶',part:'叶',route:'leaf',site:'溪畔',seasons:[0,1],color:'#7eab83',flower:'#fff7de',features:['宽卵形叶，边缘光滑','两片叶子在同一节上成对生长','圆茎，节部有白色绒环'],method:'采上层叶，留下基部。挑去褐叶与碎石，通风阴干。',spec:'阴干叶'},
 {id:'reed',name:'青铃叶',part:'叶',route:'leaf',site:'溪畔',seasons:[1,2],color:'#699b7b',flower:'#8fa7d7',features:['狭长尖叶，有清楚的锯齿','每节一片叶，左右交替生长','棱角方茎，没有白色绒环'],method:'只采完整叶，留下基部。挑选去杂，通风阴干。',spec:'阴干叶'},
 {id:'root',name:'暖心根',part:'根',route:'root',site:'山坡',seasons:[2,3],color:'#78934f',flower:'#d99955',features:['宽心形叶，有深深的叶脉','叶片从地面向四周放射生长','露出土面的根肩呈橙色，有横纹'],method:'成熟后取侧根，保留主根。刷净泥土，均匀切成五片，晴天晒干。',spec:'均匀根片'},
 {id:'star',name:'星绒花',part:'花',route:'leaf',site:'山坡',seasons:[0,1],color:'#8aab72',flower:'#f5d58c',features:['细长线形叶，像柔软的针','叶子围绕茎部轮生，形成一圈','五瓣星形花，中央有金色圆盘'],method:'采开放花朵，保留花苞。去杂质，不切碎，通风阴干。',spec:'完整干花'}
];
export const HERB=id=>SPECIES.find(s=>s.id===id);
export const SEASONS=['早春','暮春','初夏','晚夏'];
export const WEATHERS=['晴朗','晴朗','多云','小雨','晴朗','多云','小雨','晴朗'];
export const ORDERS=[
 {id:'o1',type:'山居手作人',name:'阿禾',herb:'dew',qty:2,min:'B',spec:'阴干叶',pay:46,feedback:'叶片完整，纸包也很干爽。做植物拓印正合适。'},
 {id:'o2',type:'山居手作人',name:'小石',herb:'star',qty:2,min:'B',spec:'完整干花',pay:52,feedback:'没有碎成花屑，星形花瓣在作品里很清楚。'},
 {id:'o3',type:'材料采购员',name:'林先生',herb:'root',qty:2,min:'B',spec:'均匀根片',pay:62,feedback:'厚薄一致，能作为工艺教学的标准样本。'},
 {id:'o4',type:'植物研究者',name:'许老师',herb:'reed',qty:2,min:'A',spec:'阴干叶',pay:72,feedback:'叶序记录清楚，锯齿也保存完整，这批样本很有价值。'},
 {id:'o5',type:'植物研究者',name:'许老师',herb:'dew',qty:3,min:'A',spec:'阴干叶',pay:88,feedback:'正确辨识、成熟采收、通风保存，每一步都有迹可循。'},
 {id:'o6',type:'材料采购员',name:'南山客',herb:'root',qty:3,min:'A',spec:'均匀根片',pay:96,feedback:'洁净、均匀、充分干燥，材料规格完全符合。'}
];
export const KEY='mountain-herb-shop.v1';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const need=(ok,msg)=>{if(!ok)throw Error(msg)};
export function createState(){return {version:1,tick:0,money:24,income:0,expenses:0,tools:{cabinet:false},started:false,view:'shop',site:null,trip:false,selected:null,identified:{},observed:{},journal:Object.fromEntries(SPECIES.map(h=>[h.id,{features:[],attempts:0,correct:0,notes:[]}])),plants:SPECIES.flatMap((h,hi)=>[0,1].map(i=>({id:`${h.id}-${i}`,herb:h.id,variant:i,readyAt:0,harvests:0}))),batches:[],work:null,completed:[],nextBatch:1,tutorial:0,lastResult:null,log:[],settings:{sound:true,low:false}}}
export const season=s=>Math.floor(s.tick/2)%4;
export const weather=s=>WEATHERS[s.tick%8];
export function maturity(s,p){const h=HERB(p.herb),phase=season(s);return h.seasons.includes(phase)?(p.variant===1&&s.tick%2===0?.72:1):.45}
export function maturityLabel(v){return v>=.9?'正当成熟':v>=.65?'将熟 · 可以等待':'未到成熟期'}
function note(s,id,msg){const j=s.journal[id];j.notes.unshift(msg);j.notes=j.notes.slice(0,8)}
function log(s,msg){s.log.unshift(msg);s.log=s.log.slice(0,12)}
export function advance(s,n=1,reason='结束一天'){
 need(Number.isInteger(n)&&n>0&&n<=8,'时间推进无效');
 for(let i=0;i<n;i++){s.tick++;for(const b of s.batches){if(b.qty<=0)continue;const protectedWork=s.work?.batch===b.id;if(!protectedWork){let loss=b.status==='fresh'?(b.storage==='cool'?.065:.13):(b.storage==='sealed'?.005:b.storage==='paper'?.025:.07);if(weather(s)==='小雨'&&b.storage==='open'&&b.status==='dry'){loss+=.055;b.moisture=clamp(b.moisture+.12)}b.condition=clamp(b.condition-loss);b.storageReason=b.status==='fresh'?'鲜料会随时间失去新鲜度，请尽快加工':b.storage==='sealed'?'密封罐减缓吸潮':b.storage==='paper'?'纸包通气，但雨天仍可能吸潮':'敞口存放，水分与完整度下降';}}}
 log(s,`${reason} · 推进 ${n} 段，现为${SEASONS[season(s)]} / ${weather(s)}`);
}
export function depart(s,site){need(!s.work,'先暂停工序并完成本批，或返回工作台');need(!s.trip,'已经在山里了');need(['溪畔','山坡'].includes(site),'地点无效');s.site=site;s.trip=true;s.view='field';s.selected=null;log(s,`前往${site}，观察不会推进时间`)}
export function returnHome(s){if(s.trip){s.trip=false;advance(s,1,'结束出行')}s.view='shop';s.selected=null}
export function observe(s,pid,index){const p=s.plants.find(p=>p.id===pid);need(p&&Number.isInteger(index)&&index>=0&&index<3,'观察对象无效');s.observed[pid]??=[];if(!s.observed[pid].includes(index))s.observed[pid].push(index);const j=s.journal[p.herb];if(!j.features.includes(index))j.features.push(index);s.tutorial=Math.max(s.tutorial,1)}
export function identify(s,pid,id){const p=s.plants.find(p=>p.id===pid);need(p&&HERB(id),'辨识对象无效');need((s.observed[pid]?.length||0)>=3,'先观察叶形、叶序、茎或花根三项特征');const j=s.journal[p.herb];j.attempts++;if(p.herb!==id){s.identified[pid]=false;const wrong=HERB(id),right=HERB(p.herb);const msg=`与${wrong.name}不符：实际是「${right.features[1]}」，而它应为「${wrong.features[1]}」。重新旋转观察叶片连接处。`;note(s,p.herb,`辨识纠正：${msg}`);return {ok:false,message:msg}}s.identified[pid]=true;j.correct++;s.tutorial=Math.max(s.tutorial,2);return {ok:true,message:`辨识正确：${HERB(id).name}。${HERB(id).method}`}}
export function harvest(s,pid,part,preserve=true,sample=false){
 const p=s.plants.find(p=>p.id===pid);need(s.trip&&p&&HERB(p.herb).site===s.site,'需要在正确地点采集');need(s.tick>=p.readyAt,'这株已采过，需要等待再生');need(sample||s.identified[pid],'先正确辨识，或者单独采集未确认样本');need(['叶','花','根'].includes(part),'选择采集部位');const h=HERB(p.herb);const qty=sample?1:3;const b={id:`b${s.nextBatch++}`,herb:p.herb,verified:!sample&&!!s.identified[pid],source:{plant:pid,site:s.site,tick:s.tick,weather:weather(s)},part,maturity:maturity(s,p),qty,status:'fresh',condition:1,moisture:1,storage:'cool',storageReason:'鲜料放入阴凉篮，仍需及时加工',clean:0,integrity:1,uniformity:0,spec:null,process:null};s.batches.push(b);p.harvests++;p.readyAt=s.tick+(part==='根'?(preserve?8:12):(preserve?2:5));s.tutorial=Math.max(s.tutorial,3);note(s,p.herb,`${SEASONS[season(s)]}采${part}，${maturityLabel(b.maturity)}；${preserve?'保留植株':'整株取走'}，${p.readyAt-s.tick}段后再生`);log(s,`获得${sample?'未确认样本':h.name} ×${qty} · ${part} · ${maturityLabel(b.maturity)}`);return b
}
export function verifyBatch(s,bid,pid){const b=s.batches.find(b=>b.id===bid),p=s.plants.find(p=>p.id===pid);need(b&&p&&p.herb===b.herb&&s.identified[pid],'需要重新观察并正确辨识原植物');b.verified=true;note(s,b.herb,'未确认样本已通过原株观察完成确认')}
export function startWork(s,bid){const b=s.batches.find(b=>b.id===bid);need(!s.work,'本批已在工作台；继续处理即可');need(b&&b.qty>0&&b.status==='fresh','只能加工现有鲜料');need(b.verified,'未确认样本不能直接加工为商品，请先核对原株');const h=HERB(b.herb);need(b.part===h.part,`部位不符合：${h.name}需要采${h.part}，这批采的是${b.part}`);need(b.condition>.15,'材料已失去可售状态');s.work={batch:bid,route:h.route,stage:h.route==='root'?'clean':'sort',removed:[],cuts:[],spread:[],dryMode:'shade',paused:false,startedAt:s.tick};b.process=s.work;log(s,`开始加工批次 ${bid}，材料保留在该批次中，不重复扣除`);return s.work}
export function touchWork(s,id){const w=s.work;need(w&&!w.paused,'请先继续加工');need(Number.isInteger(id)&&id>=0&&id<(w.stage==='clean'?10:11),'接触区域无效');need(['clean','sort'].includes(w.stage),'这一步不使用清理工具');if(!w.removed.includes(id))w.removed.push(id)}
export function cutWork(s,x){const w=s.work;need(w&&!w.paused&&w.stage==='cut','请进入切片工序');need(Number.isFinite(x)&&x>.04&&x<.96,'在根部范围内下刀');need(w.cuts.length<4,'已切四刀，请查看厚薄反馈');need(w.cuts.every(c=>Math.abs(c-x)>.07),'两刀太近，换一个位置');w.cuts.push(x);w.cuts.sort((a,b)=>a-b)}
export function uniformity(cuts){if(cuts.length!==4)return .25;const a=[0,...cuts,1],widths=a.slice(1).map((x,i)=>x-a[i]);return clamp(1-widths.reduce((sum,x)=>sum+Math.abs(x-.2),0)*1.55)}
export function spreadWork(s,i){const w=s.work;need(w&&!w.paused&&w.stage==='spread','先进入摊晾步骤');need(Number.isInteger(i)&&i>=0&&i<6,'竹筛位置无效');if(!w.spread.includes(i))w.spread.push(i)}
export function nextStage(s){const w=s.work;need(w&&!w.paused,'请先继续加工');const b=s.batches.find(b=>b.id===w.batch);if(w.stage==='clean'){b.clean=w.removed.length/10;w.stage='cut'}else if(w.stage==='sort'){b.clean=w.removed.filter(x=>x>=8).length/3;b.integrity=clamp(1-w.removed.filter(x=>x<8).length/8);w.stage='spread'}else if(w.stage==='cut'){need(w.cuts.length===4,'需要完成四刀，得到五片');b.uniformity=uniformity(w.cuts);w.stage='spread'}else throw Error('请先完成当前工序');log(s,'进入下一道工序，实际处理结果已保留')}
export function dryPreview(s,mode){const w=s.work,b=s.batches.find(b=>b.id===w?.batch);if(!w||!b)return null;const wet=weather(s)==='小雨',leaf=w.route==='leaf',spread=w.spread.length/6;let duration=mode==='shade'?2:1;let moisture=mode==='cabinet'?.1:mode==='shade'?.14:wet?.42:weather(s)==='多云'?.29:.12;moisture=clamp(moisture+(1-spread)*.4);let integrity=b.integrity;if(leaf&&mode==='sun')integrity*=.67;return {duration,moisture,integrity,spec:leaf?(mode==='sun'?'晒碎叶花':HERB(b.herb).spec):b.uniformity>=.72?'均匀根片':'不匀根片',message:mode==='sun'&&leaf?'叶花烈日干燥会卷曲、损伤完整度':mode==='sun'&&wet?'小雨不能充分晒干；选择阴干或换个晴天':spread<1?'堆叠会困住水分；建议摊满六个区域':'摊放均匀，空气能流过每一份材料'}}
export function finishDry(s,mode){const w=s.work;need(w&&!w.paused&&w.stage==='spread','先完成摊晾工序');need(['shade','sun','cabinet'].includes(mode),'设备无效');need(mode!=='cabinet'||s.tools.cabinet,'先解锁恒温干燥柜');need(w.spread.length>0,'先点击竹筛摆放材料');const b=s.batches.find(b=>b.id===w.batch),p=dryPreview(s,mode);advance(s,p.duration,'干燥完成');b.moisture=p.moisture;b.integrity=p.integrity;b.spec=p.spec;b.status='dry';b.storage='paper';b.driedAt=s.tick;b.process={...w,dryMode:mode,completedAt:s.tick};s.work=null;s.tutorial=Math.max(s.tutorial,4);s.lastResult=b.id;const g=grade(b);note(s,b.herb,`${mode==='shade'?'阴干':mode==='sun'?'晒干':'恒温干燥'}：${g.rank}级。${g.reasons.join('；')}`);log(s,`${HERB(b.herb).name}加工完成 · ${g.rank}级 · ${b.spec}`);return b}
export function grade(b){const reasons=[];if(!b.verified||b.part!==HERB(b.herb).part)return {rank:'不可售',score:0,reasons:['辨识未确认或采集部位不符合']};if(b.status!=='dry')return {rank:'鲜料',score:0,reasons:['尚未加工干燥']};const uniform=HERB(b.herb).route==='root'?b.uniformity:1;let score=Math.round(22*b.maturity+22*b.clean+18*b.integrity+14*uniform+14*clamp(1-b.moisture)+10*b.condition);if(b.maturity<.65)reasons.push('未到成熟期');else if(b.maturity<.9)reasons.push('成熟度稍早');else reasons.push('成熟度合适');reasons.push(b.clean>=.9?'杂质少，清洁充分':'仍有泥土或杂质');if(HERB(b.herb).route==='root')reasons.push(uniform>=.85?'切片厚薄均匀':'切片不够均匀');else reasons.push(b.integrity>=.9?'叶花完整':'误去好料或晒伤，完整度下降');reasons.push(b.moisture<=.2?'干燥充分':'含水偏高，需要回干');if(b.condition<.8)reasons.push('存放时间较长，保存状态下降');let rank=score>=87?'A':score>=68?'B':'C';if(b.moisture>.35||b.condition<.3||b.clean<.5)rank='C';return {rank,score,reasons}}
export function storage(s,bid,kind){const b=s.batches.find(b=>b.id===bid);need(b&&b.qty>0,'批次不存在');need(b.status==='fresh'?['cool','open'].includes(kind):['paper','sealed','open'].includes(kind),'包装不适合此批');need(!(kind==='sealed'&&b.moisture>.22),'含水偏高，不宜密封；先回干');b.storage=kind;b.storageReason=kind==='sealed'?'密封罐减缓吸潮':kind==='paper'?'纸包通气，注意雨天':kind==='cool'?'阴凉篮中保存鲜料，尽快处理':'敞口保存，容易失水或吸潮'}
export function redry(s,bid){const b=s.batches.find(b=>b.id===bid);need(b&&b.qty>0&&b.status==='dry'&&!s.work,'先完成工作台批次');advance(s,s.tools.cabinet?1:2,'通风回干');b.moisture=.14;b.storage='paper';log(s,`${HERB(b.herb).name}已回干；完整度与清洁度不会被自动修复`)}
const ranks={C:1,B:2,A:3};
export function quote(s,oid,bid){const o=ORDERS.find(o=>o.id===oid),b=s.batches.find(b=>b.id===bid);const issues=[];if(!o)return {ok:false,issues:['订单不存在'],pay:0};if(s.completed.includes(oid))issues.push('订单已经结算');if(!b||b.qty<=0)return {ok:false,issues:[...issues,'请选择现有库存批次'],pay:0};const g=grade(b);if(!b.verified)issues.push('辨识尚未确认');if(b.herb!==o.herb)issues.push(`种类需要${HERB(o.herb).name}`);if(b.qty<o.qty)issues.push(`数量不足，需要${o.qty}份`);if(b.status!=='dry'||b.moisture>.25)issues.push('需要充分干燥的成品');if((ranks[g.rank]||0)<ranks[o.min])issues.push(`最低${o.min}级，目前${g.rank}级`);if(b.spec!==o.spec)issues.push(`规格需要「${o.spec}」，目前「${b.spec||'未加工'}」`);if(b.condition<=.15)issues.push('保存状态过低');return {ok:!issues.length,issues,pay:o.pay,qty:o.qty,grade:g.rank}}
export function deliver(s,oid,bid){const q=quote(s,oid,bid);need(q.ok,q.issues.join('；'));const b=s.batches.find(b=>b.id===bid);b.qty-=q.qty;s.money+=q.pay;s.income+=q.pay;s.completed.push(oid);s.tutorial=5;log(s,`完成${ORDERS.find(o=>o.id===oid).name}的订单 · +${q.pay}铜`);return q}
export function basicPrice(b){const g=grade(b);return Math.round(({A:18,B:12,C:6}[g.rank]||0)*b.condition)}
export function sell(s,bid){const b=s.batches.find(b=>b.id===bid);need(b&&b.qty>0,'这批已经售完');need(b.verified&&b.status==='dry'&&b.moisture<=.35&&b.condition>.15,'基础出售需要已确认、加工干燥且保存合格的材料');const pay=basicPrice(b)*b.qty;need(pay>0,'材料状态不足，无法出售');b.qty=0;s.money+=pay;s.income+=pay;log(s,`基础出售 · +${pay}铜`);return pay}
export function unlock(s){need(!s.tools.cabinet,'工具已经购入');need(s.completed.length>=2,'先完成两份订单');need(s.money>=60,'需要60铜');s.money-=60;s.expenses+=60;s.tools.cabinet=true;log(s,'购入恒温干燥柜：雨天也能一段干燥，保留叶花完整度')}
export function validate(s){
 need(s&&s.version===1&&Number.isInteger(s.tick)&&s.tick>=0&&s.tick<10000000&&Number.isFinite(s.money)&&s.money>=0,'存档版本或收支数据无效');
 need(Number.isFinite(s.income)&&s.income>=0&&Number.isFinite(s.expenses)&&s.expenses>=0&&s.money===24+s.income-s.expenses,'收支不一致');
 need(typeof s.started==='boolean'&&typeof s.trip==='boolean'&&['shop','field'].includes(s.view)&&[null,'溪畔','山坡'].includes(s.site),'地点数据无效');
 need(typeof s.tools?.cabinet==='boolean'&&typeof s.settings?.sound==='boolean'&&typeof s.settings?.low==='boolean','工具或设置无效');
 need(Array.isArray(s.batches)&&s.batches.length<10000&&Array.isArray(s.plants)&&s.plants.length===8,'存档批次或植株无效');
 need(Array.isArray(s.completed)&&new Set(s.completed).size===s.completed.length&&s.completed.every(x=>ORDERS.some(o=>o.id===x)),'订单数据无效');
 need(new Set(s.batches.map(b=>b.id)).size===s.batches.length,'批次编号重复');
 const plantIds=SPECIES.flatMap(h=>[h.id+'-0',h.id+'-1']);
 need(new Set(s.plants.map(p=>p.id)).size===8,'植株编号重复');
 for(const p of s.plants)need(plantIds.includes(p.id)&&p.id===p.herb+'-'+p.variant&&HERB(p.herb)&&Number.isInteger(p.readyAt)&&p.readyAt>=0&&Number.isInteger(p.harvests)&&p.harvests>=0,'植株记录无效');
 const indexList=(list,max)=>Array.isArray(list)&&new Set(list).size===list.length&&list.every(i=>Number.isInteger(i)&&i>=0&&i<max);
 for(const h of SPECIES){const j=s.journal?.[h.id];need(j&&indexList(j.features,3)&&Number.isInteger(j.attempts)&&Number.isInteger(j.correct)&&j.attempts>=j.correct&&j.correct>=0&&Array.isArray(j.notes)&&j.notes.length<=8&&j.notes.every(n=>typeof n==='string'&&n.length<2000),'图鉴记录无效')}
 need(s.observed&&s.identified,'辨识数据无效');for(const [id,list] of Object.entries(s.observed))need(plantIds.includes(id)&&indexList(list,3),'观察数据无效');for(const [id,value] of Object.entries(s.identified))need(plantIds.includes(id)&&typeof value==='boolean','辨识记录无效');
 function process(w,b){need(w&&w.batch===b.id&&w.route===HERB(b.herb).route&&['clean','sort','cut','spread'].includes(w.stage)&&typeof w.paused==='boolean'&&indexList(w.removed,w.route==='root'?10:11)&&indexList(w.spread,6)&&Array.isArray(w.cuts)&&w.cuts.length<=4&&w.cuts.every((x,i)=>Number.isFinite(x)&&x>.04&&x<.96&&(i===0||x-w.cuts[i-1]>.07)),'加工记录无效')}
 for(const b of s.batches){
  need(/^b[1-9][0-9]*$/.test(b.id)&&HERB(b.herb)&&Number.isInteger(b.qty)&&b.qty>=0&&b.qty<=3&&typeof b.verified==='boolean'&&['fresh','dry'].includes(b.status)&&['叶','花','根'].includes(b.part),'批次数据无效');
  for(const k of ['maturity','condition','moisture','integrity','uniformity','clean'])need(Number.isFinite(b[k])&&b[k]>=0&&b[k]<=1,'批次品质数据无效');
  need(b.source&&plantIds.includes(b.source.plant)&&['溪畔','山坡'].includes(b.source.site)&&Number.isInteger(b.source.tick)&&b.source.tick>=0&&b.source.tick<=s.tick&&WEATHERS.includes(b.source.weather),'批次来源无效');
  need(['cool','open','paper','sealed'].includes(b.storage)&&typeof b.storageReason==='string'&&b.storageReason.length<500&&(b.spec===null||['阴干叶','完整干花','晒碎叶花','均匀根片','不匀根片'].includes(b.spec)),'储存或规格无效');
  if(b.process)process(b.process,b);
 }
 need(Number.isInteger(s.nextBatch)&&s.nextBatch>Math.max(0,...s.batches.map(b=>Number(b.id.slice(1)))),'下一个批次编号无效');
 if(s.work){const b=s.batches.find(b=>b.id===s.work.batch&&b.qty>0&&b.status==='fresh');need(b,'工作台批次缺失');process(s.work,b)}
 need(Array.isArray(s.log)&&s.log.length<=12&&s.log.every(x=>typeof x==='string'&&x.length<2000),'行动记录无效');
 return s;
}
