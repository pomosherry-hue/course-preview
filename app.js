/* 色彩观察学院 · 书网站本地预览（纯前端，无AI，无上传） */
(function(){
'use strict';
var B=window.BOOK, SW=B.sw, PL=B.plain, CH=1, D=null;
var CN=['','一','二','三','四','五','六','七','八','九','十','十一','十二'];
var app=document.getElementById('app');
var KEY='coa-book-v1';
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return{}}}
var st=load(); st.scores=st.scores||{}; st.subs=st.subs||{};
function save(){try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function meta(c){return B.chapters[c-1]}
function K(c,n){return c===1?n:c+'-'+n}
function passOf(rows){return Math.ceil((rows||4)*3*0.75)}
function maxOf(rows){return (rows||4)*3}
function passed(c,n){var m=meta(c),s=m&&m.secs[n-1];if(!s)return false;return (st.scores[K(c,n)]||0)>=passOf(s.rows)}
function unlockedC(c,n){if(st.teacher)return true;if(n===1)return c===1||passed(c-1,10);return passed(c,n-1)}
function unlocked(n){return unlockedC(CH,n)}
function sec(n){return D.sections[n-1]}
function chName(c){var m=meta(c);return m.title.replace(/ [A-Za-z].*$/,'')}
function needCh(c,cb){window.BOOKCH=window.BOOKCH||{};if(window.BOOKCH[c]){cb();return}
 app.innerHTML='<p class="hint">正在载入'+(CN[c]?'第'+CN[c]+'章':'')+'……</p>';
 var sc=document.createElement('script');sc.src='data/ch'+c+'.js?v='+meta(c).v;sc.onload=cb;sc.onerror=function(){app.innerHTML='<div class="card"><p>载入失败，请检查网络后刷新。</p></div>'};document.head.appendChild(sc)}

var VOLS=[
 {t:'第一卷 · 训练眼睛',ch:[[1,'色块','Color Spots'],[2,'边缘形','Edge Shapes'],[3,'颜色笔记','Color Notes'],[4,'比较观察','Comparative Seeing']]},
 {t:'第二卷 · 训练颜色',ch:[[5,'色相'],[6,'明度'],[7,'彩度'],[8,'冷暖']]},
 {t:'第三卷 · 组织画面',ch:[[9,'颜色包络'],[10,'色彩和谐'],[11,'大师分析'],[12,'个人调色体系']]}];

/* ---------- 孟塞尔说明卡（网站说明，非书稿正文） ---------- */
function explainer(){
 var s='5PB 5/1';
 return '<div class="card explainer" id="explainer"><h3>两分钟看懂孟塞尔记号</h3>'+
 '<p class="hint">网站说明，不是书稿正文。第1–2章只需要“会读”，作业里用白话描述颜色即可。</p>'+
 '<div class="ex"><span class="sw" style="background:'+SW[s]+'"></span><code><span class="pill p1">5PB</span> <span class="pill p2">5</span>/<span class="pill p3">1</span></code></div>'+
 '<ol class="steps"><li><span class="pill p1">5PB</span> 字母＝<b>色相家族</b>：R 红、YR 橙、Y 黄、GY 黄绿、G 绿、BG 青绿、B 蓝、PB 蓝紫、P 紫、RP 紫红。前面的数字表示在这个家族里偏向哪一边。</li>'+
 '<li><span class="pill p2">5</span> 第一个数字＝<b>明度</b>：0 最黑，10 最白，5 是中间。</li>'+
 '<li><span class="pill p3">/1</span> 斜线后面＝<b>彩度</b>：数字越小越接近灰，越大越鲜艳。</li></ol>'+
 '<p>所以 <b>5PB 5/1</b> 读作：“'+PL[s]+'”。字母 <b>N</b> 开头（如 N7）表示没有色相的中性灰，只看明度。</p>'+
 '<p class="hint">本网站里，每个记号都配一块色样和一句白话。点一下才显示“老师的注”。屏幕颜色只作参考；网站不会从照片里读取孟塞尔数值。</p></div>';
}
function showModal(h){var m=document.getElementById('modal');m.querySelector('.modalbody').innerHTML=h;m.hidden=false}
document.querySelector('#modal .close').onclick=function(){document.getElementById('modal').hidden=true};
document.getElementById('modal').onclick=function(e){if(e.target.id==='modal')this.hidden=true};
document.getElementById('whatMunsell').onclick=function(){showModal(explainer())};
document.getElementById('teacherUnlock').onclick=function(){st.teacher=!st.teacher;save();this.textContent=st.teacher?'老师预览：恢复按分数解锁':'老师预览：全部解锁';route()};
document.getElementById('teacherUnlock').textContent=st.teacher?'老师预览：恢复按分数解锁':'老师预览：全部解锁';
document.getElementById('resetAll').onclick=function(){if(confirm('清除这台设备上的学习进度？')){st={scores:{},subs:{}};save();route()}};
document.addEventListener('click',function(e){var c=e.target.closest('.mchip');if(c){c.classList.toggle('open');c.setAttribute('aria-expanded',c.classList.contains('open'))}});

/* ---------- 首页 ---------- */
function home(){
 var h='<section class="card hero"><p class="t1">Color Observation Academy｜色彩观察学院</p><h1>职业色彩训练体系</h1><p>每一节都分三步：<b>阅读</b> → <b>练习</b> → <b>作业</b>。全书三卷十二章，每章十节，基础、进阶、挑战三级作业，达到达标线（多数是 9/12 分）再进入下一节。</p><p><a class="btn" href="#/ch1">从第一章开始 →</a></p></section>';
 var vt=['','第一卷 · 训练眼睛','第二卷 · 训练颜色','第三卷 · 组织画面'];
 for(var v=1;v<=3;v++){
  h+='<section class="vol"><h2>'+vt[v]+'</h2><div class="chlist">';
  B.chapters.forEach(function(m){ if(m.vol!==v)return;
   var parts=m.title.split(' '),nm=parts.slice(0,2).join(' '),en=parts.slice(2).join(' ');
   var open=unlockedC(m.no,1);
   h+='<a class="ch" href="#/ch'+m.no+'"><span class="num">'+m.no+'</span><span><span class="nm">'+esc(nm)+'</span> <span class="hint">'+esc(en)+'</span><br><span class="st">'+doneCount(m.no)+' / 10 节已达标 · '+(open?'开始学习 →':'🔒 完成上一章后解锁（可先浏览目录）')+'</span></span></a>';
  });
  h+='</div></section>';
 }
 h+='<section class="card"><h2 style="margin-top:0">孟塞尔记号怎么学</h2><ol class="steps"><li><b>第1–2章：会读就行。</b>记号藏在“老师的注”里，配色样和白话。作业用白话描述即可得满分。</li><li><b>第3章起：自己写读数。</b>先明度，再色相，最后彩度，用灰阶卡或实体色卡。从这里起读数计入评分。</li><li><b>第二卷起：求精确。</b>更细的色相档位和彩度上限。</li></ol></section>';
 app.innerHTML=h;
}
function doneCount(c){var n=0;for(var i=1;i<=10;i++)if(passed(c,i))n++;return n}

/* ---------- 章节页 ---------- */
function chapter(){
 var vt=['','第一卷','第二卷','第三卷'];
 var h='<p class="crumb"><a href="#/">首页</a> › '+vt[D.vol]+'</p><h1>'+esc(D.title)+'</h1>'+(D.intro||'')+'<div class="chlist seclist">';
 D.sections.forEach(function(s){
  var u=unlocked(s.no),sc=st.scores[K(CH,s.no)],ps=passOf(s.rows.length),mx=maxOf(s.rows.length);
  var t=s.title.replace(/^第\d+节 /,'');
  h+= u? '<a class="ch" href="#/ch'+CH+'/s'+s.no+'/read"><span class="num">'+s.no+'</span><span><span class="nm">'+esc(t)+'</span>'+(sc>=ps?'<span class="badge">已达标 '+sc+'/'+mx+'</span>':sc?'<span class="badge lock">'+sc+'/'+mx+' 未达标</span>':'')+'<br><span class="st">阅读 · 练习 · 作业'+(s.cards?' · 场景图 '+s.cards+' 张':'')+'</span></span></a>'
       : '<div class="ch locked" onclick="alert(\''+(s.no===1?'先完成上一章第10节作业并达标':'完成第'+(s.no-1)+'节作业并达标后解锁')+'\')"><span class="num">🔒</span><span><span class="nm">第'+s.no+'节 '+esc(t)+'</span><br><span class="st">'+(s.no===1?'完成上一章第10节作业（达标）后解锁':'完成第'+(s.no-1)+'节作业（达标）后解锁')+'</span></span></div>';
 });
 h+='</div>';
 if(CH>1)h+='<p class="hint">提示：页脚的“老师预览：全部解锁”可以跳过解锁顺序，方便浏览。</p>';
 app.innerHTML=h;
}

/* ---------- 小节页 ---------- */
var TGT=null;
function section(n,tab){
 var tgt=TGT;TGT=null;
 if(!unlocked(n)&&tgt){var s0=sec(n),mm=new RegExp('<figure class="scard" id="'+tgt+'">[\\s\\S]*?</figure>').exec(s0.read);
  if(mm){app.innerHTML='<p class="crumb"><a href="#/">首页</a> › <a href="#/ch'+CH+'">'+esc(chName(CH))+'</a></p><h1>'+esc(s0.title)+'</h1><div class="card lockcard"><p>🔒 这一节还没解锁，先单独看看这张场景卡。学完前面的课程后，可以读到这一节的全文。</p><div class="scards-g">'+mm[0]+'</div><p class="hint">点图片可放大。测试时可点页脚“老师预览：全部解锁”。</p><p><a class="btn" href="javascript:history.back()">← 返回刚才的页面</a></p></div>';
   bindCards(app);window.scrollTo(0,0);return}}
 if(!unlocked(n)){app.innerHTML='<p class="crumb"><a href="#/ch'+CH+'">'+esc(chName(CH))+'</a></p><div class="card"><h2>🔒 第'+n+'节还没解锁</h2><p>'+(n===1?'先完成上一章第10节作业并达标，这一章会自动打开。':'完成第'+(n-1)+'节作业并达标后，这一节会自动打开。')+'</p>'+(n===1?'<a class="btn" href="#/ch'+(CH-1)+'/s10/hw">去上一章第10节作业</a>':'<a class="btn" href="#/ch'+CH+'/s'+(n-1)+'/hw">去第'+(n-1)+'节作业</a>')+'<p class="hint">测试时可点页脚“老师预览：全部解锁”。</p></div>';return}
 var s=sec(n);
 var h='<p class="crumb"><a href="#/">首页</a> › <a href="#/ch'+CH+'">'+esc(chName(CH))+'</a></p><h1>'+esc(s.title)+'</h1>'+
 '<nav class="tabs"><a href="#/ch'+CH+'/s'+n+'/read" class="'+(tab==='read'?'on':'')+'">① 阅读</a><a href="#/ch'+CH+'/s'+n+'/practice" class="'+(tab==='practice'?'on':'')+'">② 练习</a><a href="#/ch'+CH+'/s'+n+'/hw" class="'+(tab==='hw'?'on':'')+'">③ 作业</a></nav><div id="pane"></div>';
 app.innerHTML=h;
 var p=document.getElementById('pane');
 if(tab==='read'){
  p.innerHTML=s.head+s.read+(s.refs?'<details><summary>参考文献（本节引用）</summary>'+s.refs+'</details>':'')+
   '<div class="nextnav"><span></span><a class="btn" href="#/ch'+CH+'/s'+n+'/practice">读完了，去练习 →</a></div>';
  bindCards(p);
  if(n===1&&CH===1){var c=p.querySelector('.mchip');if(c){var at=c.closest('.tw')||c.closest('p');var d=document.createElement('div');d.innerHTML=explainer();at.parentNode.insertBefore(d.firstChild,at)}}
 } else if(tab==='practice'){ practice(n,p) } else { homework(n,p) }
 window.scrollTo(0,0);
 if(tab==='read'&&tgt){var el=document.getElementById(tgt);if(el){var im=el.querySelector('img');if(im)im.loading='eager';
  setTimeout(function(){el.scrollIntoView({block:'center'});el.classList.add('flash');setTimeout(function(){el.classList.remove('flash')},2600)},60)}}
}
function bigCard(im){showModal('<img class="scard-big" src="'+im.getAttribute('src')+'" alt="'+esc(im.alt)+'"><p class="scard-cap">'+esc(im.alt)+' · <a href="'+im.getAttribute('src')+'" target="_blank" rel="noopener">打开原图（可两指放大）</a></p>')}
function bindCards(p){p.querySelectorAll('img.scard-img,img.slink-th').forEach(function(im){im.onclick=function(){bigCard(im)}})}

/* ---------- 练习 ---------- */
function sw(k){return SW[k]}
function quiz(q,opts,ans,exp){
 var id='q'+Math.random().toString(36).slice(2,7);
 var h='<div class="card" id="'+id+'"><h3 style="border:0;margin-top:0;padding-top:0">小测：'+q+'</h3>';
 opts.forEach(function(o,i){h+='<button type="button" class="choice" data-i="'+i+'">'+o+'</button>'});
 h+='<div class="explain"><p>'+exp+'</p></div></div>';
 setTimeout(function(){var el=document.getElementById(id);if(!el)return;el.querySelectorAll('.choice').forEach(function(b){b.onclick=function(){
  el.querySelectorAll('.choice').forEach(function(x){x.classList.remove('right','wrong')});
  b.classList.add(+b.dataset.i===ans?'right':'wrong'); el.querySelector('.explain').classList.add('show');}})},0);
 return h;
}
function blk(k,label){return '<div class="blk"><div class="b" style="background:'+sw(k)+'"></div>'+label+'<br><span class="hint">'+PL[k]+'</span></div>'}
function widget(n,p){
 var h='', after=null;
 var src='<p class="hint">练习内容取自本节正文的案例数据。屏幕颜色只作参考，真正的训练对象是你眼前的实物。</p>';
 if(n===1){
  h+='<div class="card"><h3 style="border:0;margin-top:0;padding-top:0">互动：纸筒观察</h3><p>案例1：一只白瓷杯在晨光里。先整体看，再点 A、B、C，像透过纸筒一样只看一小块。</p>'+
  '<div class="stage scene" id="tubeStage"><div class="cup"><div style="background:'+sw('2.5Y 9/1')+'">A</div><div style="background:'+sw('5YR 7/1')+'">B</div><div style="background:'+sw('5PB 5/1')+';color:#fff">C</div></div><div class="tube" id="tube"></div></div>'+
  '<p><button class="btn sec" data-t="0">看 A</button><button class="btn sec" data-t="1">看 B</button><button class="btn sec" data-t="2">看 C</button><button class="btn sec" data-t="-1">拿开纸筒</button></p>'+
  '<p><button class="btn" id="pull">把三块并排取出</button></p><div id="pulled"></div></div>';
  h+=quiz('同一只白瓷杯的三个区域，只是深浅不同吗？',['是，三块都是白色，只是深浅不同','不是，色相本身也分道扬镳了'],1,'正文：“把三块颜色单独取出来并排放置，会发现它们不只是明暗不同，色相本身就已经分道扬镳。”');
  after=function(){
   var tube=document.getElementById('tube'),stage=document.getElementById('tubeStage');
   p.querySelectorAll('[data-t]').forEach(function(b){b.onclick=function(){var t=+b.dataset.t;if(t<0){tube.style.background='none';return}
    var cup=stage.querySelector('.cup').getBoundingClientRect(),r=stage.getBoundingClientRect();var x=cup.left-r.left+cup.width*(t+.5)/3,y=cup.top-r.top+cup.height*.45;
    tube.style.background='radial-gradient(circle at '+x+'px '+y+'px, transparent 0 26px, #1b1b1a 27px)';}});
   document.getElementById('pull').onclick=function(){document.getElementById('pulled').innerHTML='<div class="row">'+blk('2.5Y 9/1','A 迎光面')+blk('5YR 7/1','B 侧光过渡面')+blk('5PB 5/1','C 背光面')+'</div>'};
  };
 }
 if(n===2){
  var g=['N9','N8.7','N8.3'];
  h+='<div class="card"><h3 style="border:0;margin-top:0;padding-top:0">互动：眯眼看亮面</h3><p>左边是案例1的“业余渐变”（N9→N8.7→N8.3），右边是“职业归纳”（整块 N8.7）。按“眯眼”，看渐变会不会归成一块。</p>'+
  '<div class="row"><div class="blk"><div class="sphere eye" style="background:radial-gradient(circle at 35% 30%,'+sw('N9')+' 0 18%,'+sw('N8.7')+' 30%,'+sw('N8.3')+' 52%,'+sw('N5')+' 75%)"></div>业余渐变</div>'+
  '<div class="blk"><div class="sphere eye" style="background:radial-gradient(circle at 35% 30%,'+sw('N8.7')+' 0 52%,'+sw('N5')+' 53% 75%)"></div>职业归纳</div></div>'+
  '<p><b>灰阶条 N1–N9</b>（对照用）</p><div class="strip eye">'+[1,2,3,4,5,6,7,8,9].map(function(i){return '<div style="background:'+sw('N'+i)+';color:'+(i>5?'#000':'#fff')+'">N'+i+'</div>'}).join('')+'</div>'+
  '<p><button class="btn" id="squint">眯眼（模糊）</button></p></div>';
  h+=quiz('石膏立方体的三个面里，哪个才是“亮面”？',['顶面（正对光源）','正面（约45°受光）','侧面（背光）'],0,'正文案例2：顶面 N8.5 是“唯一的亮面，与光源夹角最小”；正面是中间调面，不属于亮面范畴。');
  after=function(){document.getElementById('squint').onclick=function(){p.querySelectorAll('.eye').forEach(function(e){e.classList.toggle('blur')});this.textContent=this.textContent.indexOf('眯眼')===0?'睁开眼':'眯眼（模糊）'}};
 }
 if(n===3){
  h+=quiz('下面两块，哪一块是石膏圆柱体灰面的“职业判断”？<div class="row" style="margin-top:8px">'+blk('N5','甲')+blk('7.5Y 6/1','乙')+'</div>',['甲','乙'],1,'正文案例3：业余判断默认“灰面＝中性灰”（N5）；职业判断确认灰面仍带暖黄倾向（7.5Y 6/1），只是彩度极低。');
  h+=quiz('石膏立方体的灰面，更接近亮面还是暗面？',['亮面','暗面'],0,'正文案例2：灰面与亮面同属7.5Y色相家族，仅明度、彩度降低；暗面跳到冷蓝紫，完全不同家族。');
 }
 if(n===4){
  h+=quiz('立方体的暗面和它落在木桌上的投影，是同一个色相家族吗？<div class="row" style="margin-top:8px">'+blk('5PB 3.5/2','暗面（侧面）')+blk('7.5YR 3/1','投影（木桌面）')+'</div>',['是同一家族','不是，投影偏暖褐，暗面偏冷蓝紫'],1,'正文案例2：暗面色相偏冷蓝紫；投影落在木桌上，色相偏暖褐。投影是独立的第三类色块，不是暗面的加深版。');
 }
 if(n===5){
  h+='<div class="card"><h3 style="border:0;margin-top:0;padding-top:0">互动：同一块灰，两种背景</h3><p>案例1：中间的小方块颜色完全一样。先比较：哪一块看起来偏冷，哪一块偏暖？然后按“揭下背景”。</p>'+
  '<div class="stage field" id="field"><div style="background:'+sw('7.5YR 4/4')+'"><div class="sq" style="background:'+sw('N8.5')+'"></div></div><div style="background:'+sw('5PB 4/2')+'"><div class="sq" style="background:'+sw('N8.5')+'"></div></div></div>'+
  '<p><button class="btn" id="peel">揭下背景</button></p><div id="peelmsg"></div></div>';
  h+=quiz('作画时应该先铺哪一块？',['先画主体，最后补背景','先铺背景色块，再判断主体'],1,'正文案例2：先建立背景色块，能有效防止退回到“物体应该是什么颜色”的记忆默认判断。');
  after=function(){document.getElementById('peel').onclick=function(){var f=document.getElementById('field');f.classList.toggle('peeled');var on=f.classList.contains('peeled');this.textContent=on?'放回背景':'揭下背景';
   document.getElementById('peelmsg').innerHTML=on?'<div class="okmsg">两块完全相同，都是 N8.5（'+PL['N8.5']+'）。</div><p>正文：暖褐背景上常被误判为偏冷，冷蓝背景上常被误判为偏暖——这就是“同时对比”。</p>':''}};
 }
 if(n===6){
  var five=[['亮面（顶面）','7.5Y 8.5/2'],['灰面（正面）','7.5Y 6/1'],['暗面（侧面）','5PB 3.5/2'],['投影（木桌）','7.5YR 3/1'],['背景','5B 7/1']];
  h+='<div class="card"><h3 style="border:0;margin-top:0;padding-top:0">互动：5 → 4 → 3 色块合并</h3><p>案例1的立方体有五块颜色。每次点选<b>两块</b>，按“合并”。目标：压缩成三块，画面仍然看得懂。</p><div class="row" id="mrow"></div><p><button class="btn" id="mgo">合并选中的两块</button><button class="btn sec" id="mreset">重来</button></p><div id="mmsg"></div></div>';
  after=function(){
   var items,sel;
   function draw(){document.getElementById('mrow').innerHTML=items.map(function(it,i){return '<div class="blk mergeblk'+(sel.indexOf(i)>=0?' sel':'')+'" data-i="'+i+'"><div class="b" style="background:'+sw(it[1])+'"></div>'+it[0]+'</div>'}).join('');
    p.querySelectorAll('.mergeblk').forEach(function(b){b.onclick=function(){var i=+b.dataset.i,k=sel.indexOf(i);if(k>=0)sel.splice(k,1);else{if(sel.length===2)sel.shift();sel.push(i)}draw()}})}
   function reset(){items=five.slice();sel=[];document.getElementById('mmsg').innerHTML='';draw()}
   reset();
   document.getElementById('mreset').onclick=reset;
   document.getElementById('mgo').onclick=function(){
    if(sel.length!==2){document.getElementById('mmsg').innerHTML='<p class="note">请先点选两块。</p>';return}
    var a=items[sel[0]][0],b=items[sel[1]][0],has=function(x){return a.indexOf(x)>=0||b.indexOf(x)>=0},msg='',ok=false,res=null;
    if(has('亮面')&&has('灰面')){ok=true;res=['光块（亮面＋灰面）','7.5Y 7.5/1.5'];msg='对：第3节已确认二者同属7.5Y色相家族，属于“光的阵营”。'}
    else if(has('暗面')&&has('投影')&&items.length===4){ok=true;res=['阴影块（暗面＋投影）','5PB 3.3/1.8'];msg='对：二者在高度简化的画面中同属“阴影大类”，投影面积通常远小于暗面，取暗面色相为主导。'}
    else if(has('灰面')&&has('背景')){msg='这是正文案例3的“错误合并”：灰面和背景明度接近（6 对 7），但色相相差近180°，合并后趋于中性灰（约 N6.5），丢失“灰面属于光”的信息，光从哪边来变得无法判断。'}
    else if(has('暗面')&&has('投影')){msg='正文的顺序是先合并“光的阵营”（亮面＋灰面），再合并阴影类。先试试第一步。'}
    else {msg='想一想：这两块属于同一个阵营吗？正文的依据是色彩逻辑（如色相家族归属），不是数值看起来接近。'}
    if(ok){var keep=items.filter(function(_,i){return sel.indexOf(i)<0});keep.unshift(res);items=keep;sel=[];draw()}
    document.getElementById('mmsg').innerHTML='<p class="'+(ok?'okmsg':'note')+'">'+msg+'</p>'+(items.length===3?'<p class="okmsg">完成！最终3色块：光块偏暖黄、阴影块偏冷蓝紫、背景独立——仍然可读。</p>':'');
   };
  };
 }
 if(n===7){
  var three=[['阴天散射光','5B 5/1',5],['正午阳光','5PB 3.5/2',3.5],['暖色台灯','5PB 2.5/2',2.5]];
  var shuffled=[three[1],three[2],three[0]];
  h+='<div class="card"><h3 style="border:0;margin-top:0;padding-top:0">互动：暗面明度排序</h3><p>案例2：同一个立方体的暗面，在三种光源下。<b>按从亮到暗的顺序</b>依次点它们。</p><div class="sortlist" id="slist">'+
   shuffled.map(function(t,i){return '<button type="button" class="choice" data-i="'+i+'"><span class="ord"></span><span class="b" style="background:'+sw(t[1])+'"></span><span>'+t[0]+'<br><span class="hint">'+PL[t[1]]+'</span></span></button>'}).join('')+
   '</div><p><button class="btn sec" id="sreset">重来</button></p><div id="smsg"></div></div>';
  after=function(){var order=[];
   function upd(){p.querySelectorAll('#slist .choice').forEach(function(b){var k=order.indexOf(+b.dataset.i);b.querySelector('.ord').textContent=k>=0?(k+1):'';b.classList.remove('right','wrong')});
    if(order.length===3){var vals=order.map(function(i){return shuffled[i][2]});var ok=vals[0]>vals[1]&&vals[1]>vals[2];
     p.querySelectorAll('#slist .choice').forEach(function(b){b.classList.add(ok?'right':'wrong')});
     document.getElementById('smsg').innerHTML=ok?'<p class="okmsg">对！阴天最亮，正午居中，暖色台灯最暗。</p><p>正文：暗面的明度基调由“光源的方向性与补光是否充足”决定，而不是简单由光源色温或强度决定。台灯是唯一光源、缺乏环境补光，所以最暗。</p>':'<p class="note">再想想：哪种光有最多的环境补光？正文说“并不是光源越暖、画面整体就越亮”。按“重来”再试。</p>'}}
   p.querySelectorAll('#slist .choice').forEach(function(b){b.onclick=function(){var i=+b.dataset.i;if(order.indexOf(i)<0&&order.length<3)order.push(i);upd()}});
   document.getElementById('sreset').onclick=function(){order=[];document.getElementById('smsg').innerHTML='';upd()};};
 }
 if(n===8){
  h+=quiz('下面两处交界，哪一处是“假边缘风险区”——学生常在这里画出生硬的轮廓线？<div class="row" style="margin-top:8px"><div class="blk"><div class="row" style="gap:0"><div class="b" style="flex:1;background:'+sw('5PB 3.5/2')+'"></div><div class="b" style="flex:1;background:'+sw('5B 7/1')+'"></div></div>甲：暗面｜背景</div><div class="blk"><div class="row" style="gap:0"><div class="b" style="flex:1;background:'+sw('7.5Y 8.5/2')+'"></div><div class="b" style="flex:1;background:'+sw('7.5Y 6/1')+'"></div></div>乙：亮面｜灰面</div></div>',['甲','乙'],1,'正文案例1：亮面与灰面同色相家族，仅明度差2.5级，属于中等偏软的过渡，应处理为柔和过渡而非硬边；暗面与背景明度差3.5级，是真边缘。');
  h+=quiz('“阴影死灰化”指的是什么？',['阴影画得太暗','灰面与投影的色相信息完全流失，变成中性灰'],1,'正文案例2：灰面 7.5Y 6/1 被画成 N5，投影 7.5YR 3/1 被画成 N3——彩度从1降到0，色相信息完全流失。');
 }
 if(n===9){
  var C=function(k){return sw(k)};
  var svg='<svg class="stamp" id="stamp" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="'+C('5B 7/1')+'"/><rect y="170" width="300" height="130" fill="'+C('5R 5/6')+'"/><path d="M0 250 Q80 230 150 262 T300 248 L300 300 L0 300Z" fill="'+C('7.5RP 2.5/3')+'"/>'+
   '<polygon points="175,232 250,232 285,212 210,212" fill="'+C('5R 2.5/2')+'"/><polygon points="80,110 170,110 200,90 110,90" fill="'+C('7.5Y 8.5/2')+'"/><rect x="80" y="110" width="90" height="120" fill="'+C('7.5Y 6/1')+'"/><polygon points="170,110 200,90 200,210 170,230" fill="'+C('5PB 3.5/2')+'"/><polygon points="170,195 200,178 200,210 170,230" fill="'+C('7.5R 4/3')+'"/></svg>';
  h+='<div class="card"><h3 style="border:0;margin-top:0;padding-top:0">互动：邮票测试</h3><p>下图只用案例1的8个色块拼成（示意，不是写生）。拖动滑块把它缩到邮票大小：还能看出立方体、布料和光从哪边来吗？</p><div class="stampwrap">'+svg+'</div><label class="hint">缩放：<span id="zv">100%</span></label><input type="range" id="zoom" min="10" max="100" value="100"></div>';
  h+=quiz('60分钟限时写生，第1优先判断哪一块？',['石膏亮面','背景','石膏投影和反光带'],1,'正文案例2：背景是其他一切判断的比较基准，必须最先确立；投影和反光带在时间不足时可以合并简化。');
  after=function(){var z=document.getElementById('zoom');z.oninput=function(){document.getElementById('stamp').style.transform='scale('+z.value/100+')';document.getElementById('zv').textContent=z.value+'%'}};
 }
 if(n===10){
  var items10=['能在3秒内判断两个色块谁更亮/暗','调出的灰面、投影颜色带有可辨识的色彩倾向（非死灰）','8色块以内完成一张可读的静物写生（邮票测试依然可读）','近三次作业中无描边痕迹','能在不同光源条件下，独立判断色相与明度的系统性偏移（至少完成过一次三光源对比速写）','能识别材质间的环境反射光现象（至少记录过一次跨材质反光）'];
  st.check=st.check||[];
  h+='<div class="card"><h3 style="border:0;margin-top:0;padding-top:0">本章综合达标线自查清单</h3><p class="hint">取自正文“复盘3”。六项全部勾选，才具备进入第二章的基础。</p>'+items10.map(function(t,i){return '<label class="chk"><input type="checkbox" data-i="'+i+'"'+(st.check[i]?' checked':'')+'> '+t+'</label>'}).join('')+'<p class="total" id="ckt"></p></div>';
  after=function(){function upd(){var c=st.check.filter(Boolean).length;document.getElementById('ckt').textContent='已勾选 '+c+' / 6'+(c===6?' ✓':'')}
   p.querySelectorAll('.chk input').forEach(function(x){x.onchange=function(){st.check[+x.dataset.i]=x.checked;save();upd()}});upd()};
 }
 return {h:h,after:after,src:src};
}
function practice(n,p){var w=CH===1?widget(n,p):(window.widget2?window.widget2(CH,n,p,{sec:sec,sw:sw,PL:PL,quiz:quiz,blk:blk,st:st,save:save,esc:esc}):{h:'',src:''});
 p.innerHTML=w.src+w.h+'<div class="nextnav"><a class="btn sec" href="#/ch'+CH+'/s'+n+'/read">← 回到阅读</a><a class="btn" href="#/ch'+CH+'/s'+n+'/hw">去做作业 →</a></div>';
 if(w.after)w.after();
}

/* ---------- 作业 ---------- */
function formHTML(sub,munNote){
 return '<div class="card"><h2 style="margin-top:0">提交作业</h2><form id="hwform">'+
  '<label>作业照片 <span class="hint">（拍你的色块/调色/写生；照片只留在本机浏览器）</span></label><input type="file" accept="image/*" id="photo"><div class="preview" id="pv"></div>'+
  '<label for="f_light">光源</label><input type="text" id="f_light" placeholder="例：东窗晨光 / 台灯 / 阴天窗光" value="'+esc(sub.light)+'">'+
  '<label for="f_bg">背景</label><input type="text" id="f_bg" placeholder="例：浅蓝灰的墙 / 木桌" value="'+esc(sub.bg)+'">'+
  '<label for="f_time">时间</label><input type="text" id="f_time" placeholder="例：11月10日 上午8点" value="'+esc(sub.time)+'">'+
  '<label for="f_words">你的白话描述（A / B / C 各一句）</label><textarea id="f_words" placeholder="A：偏黄的很浅色&#10;B：暖一点的灰，比A暗&#10;C：偏蓝紫的冷灰，最暗">'+esc(sub.words)+'</textarea>'+
  '<label for="f_mun">孟塞尔读数 <span class="hint">（'+munNote+'）</span></label><input type="text" id="f_mun" placeholder="例：A 2.5Y 9/1（用实体色卡估读）" value="'+esc(sub.mun)+'">'+
  '<label for="f_other">其他说明 <span class="hint">（可选：哪里最难、调色用了什么）</span></label><textarea id="f_other">'+esc(sub.other)+'</textarea>'+
  '<label class="chk"><input type="checkbox" id="f_ok"'+(sub.consent?' checked':'')+'> 同意老师在课程中展示我的照片（可匿名）</label>'+
  '<button class="btn" type="submit">提交作业</button></form></div><div id="mark"></div>';
}
function bindForm(key,onDone){
 var photoURL=null;
 document.getElementById('photo').onchange=function(){var f=this.files[0];if(!f)return;photoURL=URL.createObjectURL(f);document.getElementById('pv').innerHTML='<img src="'+photoURL+'" alt="作业照片预览">'};
 document.getElementById('hwform').onsubmit=function(e){e.preventDefault();
  var v=function(id){return document.getElementById(id).value.trim()};
  var sub={light:v('f_light'),bg:v('f_bg'),time:v('f_time'),words:v('f_words'),mun:v('f_mun'),other:v('f_other'),consent:document.getElementById('f_ok').checked,at:Date.now(),photo:!!photoURL};
  st.subs[key]=sub;save();onDone(sub,photoURL);};
}
function homework(n,p){
 var s=sec(n),key=K(CH,n),sub=st.subs[key]||{},R=s.rows.length,mx=maxOf(R),ps=passOf(R);
 var policy=CH<=2?'<div class="note"><b>第1–2章约定：</b>用白话描述颜色（如“偏黄的很浅色”“冷一点、暗一点”）即可得满分；孟塞尔读数可写可不写，写了算加分。“坐标判断准确度”一类项目，按你的白话比较是否准确来判断。</div>'
   :'<div class="note"><b>第3章起：</b>请写下孟塞尔读数（先明度，再色相，最后彩度），并注明光源、背景和时间；读数计入评分。网站和老师不会从照片里读取孟塞尔数值。</div>';
 var rub=R?'<div class="card"><h2 style="margin-top:0">交作业前，先看评分标准</h2><p class="hint">老师会按下面 '+R+' 项逐项给分，每项 3 / 2 / 1 分，满分 '+mx+' 分。<b>达到 '+ps+' 分</b>，下一节自动打开；没达到可以修改后重新提交。</p>'+s.rubric+policy+'</div>'
   :'<div class="card"><p>本节没有单独的评分表，按正文的达标清单自查即可。</p>'+policy+'</div>';
 p.innerHTML='<div class="card"><h2 style="margin-top:0">本节作业</h2>'+s.hw+'</div>'+rub+formHTML(sub,CH<=2?'可选，第1–2章不要求':'第3章起需要填写');
 var nx=n<10?{href:'#/ch'+CH+'/s'+(n+1)+'/read',name:'第'+(n+1)+'节'}:(CH<12?{href:'#/ch'+(CH+1),name:'第'+CN[CH+1]+'章'}:null);
 var opts={key:key,rows:R?s.rows:[['完成情况','按清单全部完成','大部分完成','刚开始']],gate:true,next:nx};
 bindForm(key,function(sb,url){demoMark(opts,sb,url)});
 if(sub.at)demoMark(opts,sub,null);
}
function demoMark(o,sub,photoURL){
 var rows=o.rows,n=o.key,box=document.getElementById('mark'),i=0,max=rows.length*3;
 var missing=[];if(!sub.light)missing.push('光源');if(!sub.bg)missing.push('背景');if(!sub.time)missing.push('时间');if(!sub.words)missing.push('白话描述');
 function itemHTML(k){var r=rows[k];
  return '<div class="item"><p class="prog">第 '+(k+1)+' 项 / 共 '+rows.length+' 项</p><h4>'+esc(r[0])+'</h4>'+
  '<p><b>得分：</b><span class="hint">演示模式不打分（真实批改时这里显示 3 / 2 / 1）</span></p>'+
  '<p><b>观察：</b><span class="hint">（版式示例，不是对你作业的评价）</span>老师会在这里写出你照片或笔记里与“'+esc(r[0])+'”有关的一处具体地方。'+(k===0&&sub.words?'<br>你写的是：“'+esc(sub.words.split('\n')[0])+'”':'')+'</p>'+
  '<p><b>下一次试一试：</b><span class="hint">（版式示例）</span>老师会只给一件具体的小调整。可以先对照本项“优秀（3分）”的标准：'+esc(r[1])+'</p></div>'}
 function render(){
  box.innerHTML=(o.gate?'':'<div class="okmsg">🎉 作业交好了，谢谢你！'+(o.next?'下一课已经打开：<a href="'+o.next.href+'">'+o.next.name+' →</a>':'这一章的课都上完了。')+'</div><p></p>')+
  '<div class="demo"><p><span class="demotag">演示模式</span></p><p><b>现在还没有接入AI，也不是老师的真实批改。</b>下面只演示批改会怎样呈现：按评分标准<b>一次只讲一项</b>，每项一个具体观察＋一件下次可以试的事。</p>'+
  (missing.length?'<p class="note">你的提交缺少：'+missing.join('、')+'。真实批改时，缺少测量条件会影响“准确度”类项目的判断。</p>':'')+
  '<div class="note"><b>关于照片的说明：</b>照片会受光线、相机白平衡和屏幕的影响，颜色不一定等于现场。所以像“坐标判断准确度”“调色还原度”这类项目，以你现场写下的笔记为准；网站和老师不会从照片里读取孟塞尔数值。</div>'+
  (photoURL?'<div class="preview"><img src="'+photoURL+'" alt="已提交的照片"></div>':'')+
  itemHTML(i)+
  '<p><button class="btn sec" id="prev"'+(i===0?' disabled':'')+'>← 上一项</button><button class="btn" id="next"'+(i===rows.length-1?' disabled':'')+'>下一项 →</button></p>'+
  '<details'+(st.scores[n]?' open':'')+'><summary>老师演示：模拟打分'+'（测试“达标解锁”用）'+'</summary><div class="scorebox">'+
   rows.map(function(r,k){var cur=(st.sim&&st.sim[n]&&st.sim[n][k])||2;return '<p>'+esc(r[0])+'：<select data-k="'+k+'">'+[3,2,1].map(function(x){return '<option'+(x==cur?' selected':'')+'>'+x+'</option>'}).join('')+'</select></p>'}).join('')+
   '<p class="total" id="tot"></p><button class="btn" id="saveScore">保存分数</button><div id="unlockmsg"></div></div></details>'+
  '<p><button class="btn sec" id="revise">修改后重新提交</button></p></div>';
  document.getElementById('prev').onclick=function(){i--;render()};
  document.getElementById('next').onclick=function(){i++;render()};
  var sels=box.querySelectorAll('select');
  function tot(){var t=0;sels.forEach(function(x){t+=+x.value});
   var ps=Math.ceil(max*0.75);document.getElementById('tot').textContent=o.gate?('合计 '+t+' / '+max+(t>=ps?'（达标）':'（未达标，需 ≥'+ps+'）')):('得分 '+t+' / '+max+(t>=max*0.75?' —— 很棒！':t>=max*0.5?' —— 已经抓到要点了，继续加油！':' —— 刚起步，慢慢来，可以改了再交。'));return t}
  sels.forEach(function(x){x.onchange=tot});tot();
  document.getElementById('saveScore').onclick=function(){var t=tot();st.sim=st.sim||{};st.sim[n]=[].map.call(sels,function(x){return +x.value});st.scores[n]=t;save();
   if(!o.gate){document.getElementById('unlockmsg').innerHTML='<p class="okmsg">已保存。分数只是给你的鼓励，不影响下一课。</p>';return}
   var ps=Math.ceil(max*0.75);document.getElementById('unlockmsg').innerHTML=t>=ps?(o.next?'<p class="okmsg">达标！'+o.next.name+'已解锁。<a href="'+o.next.href+'">去'+o.next.name+' →</a></p>':'<p class="okmsg">全书最后一节完成，恭喜！</p>'):'<p class="note">还差 '+(ps-t)+' 分。可以按老师的建议修改后重新提交。</p>'};
  document.getElementById('revise').onclick=function(){document.getElementById('hwform').scrollIntoView({behavior:'smooth'})};
 }
 render();
 if(photoURL)box.scrollIntoView({behavior:'smooth'});
}

/* ---------- 路由 ---------- */
function route(){
 var h=location.hash.replace(/^#\/?/,'').split('/');
 var mm=/^ch(\d+)$/.exec(h[0]||'');
 if(mm&&meta(+mm[1])){var c=+mm[1];needCh(c,function(){CH=c;D=window.BOOKCH[c];
   if(h[1]){var n=+h[1].slice(1);TGT=/^c-[\w-]+$/.test(h[3]||'')?h[3]:null;if(n>=1&&n<=D.sections.length)section(n,h[2]||'read');else chapter()}else chapter()});return}
 else if(h[0]==='e'){location.replace('#/ch1');return}
 else home();
}
function hh(){var t=document.querySelector('.top');document.documentElement.style.setProperty('--hh',t.offsetHeight+'px')}
window.addEventListener('resize',hh);hh();
window.addEventListener('hashchange',route);route();
})();
