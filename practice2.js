/* 色彩观察学院 · 第2–12章练习页（纯前端，无AI，无上传）。互动只复用第一章已有的几种类型。 */
(function(){
'use strict';
function card(t,body){return '<div class="card"><h3 style="border:0;margin-top:0;padding-top:0">'+t+'</h3>'+body+'</div>'}
function pairRow(a,b,label,A){return '<div class="blk"><div class="row" style="gap:0"><div class="b" style="flex:1;background:'+A.sw(a)+'"></div><div class="b" style="flex:1;background:'+A.sw(b)+'"></div></div>'+label+'</div>'}
function field(id,bgs,mid,A){return '<div class="stage field" id="'+id+'" style="grid-template-columns:repeat('+bgs.length+',1fr)">'+bgs.map(function(b){return '<div style="background:'+A.sw(b)+'"><div class="sq" style="background:'+A.sw(mid)+'"></div></div>'}).join('')+'</div>'}
function peel(id,btn,msg,okHTML){var f=document.getElementById(id),b=document.getElementById(btn);if(!f||!b)return;
 b.onclick=function(){f.classList.toggle('peeled');var on=f.classList.contains('peeled');b.textContent=on?'放回背景':'揭下背景';document.getElementById(msg).innerHTML=on?okHTML:''}}
function sorter(id,items,A,okText){ // items: [label, munsell, value]; click in order from high to low
 var sh=items.slice().sort(function(a,b){return (a[0]>b[0])?1:-1});
 var h='<div class="sortlist" id="'+id+'">'+sh.map(function(t,i){return '<button type="button" class="choice" data-i="'+i+'"><span class="ord"></span><span class="b" style="background:'+A.sw(t[1])+'"></span><span>'+t[0]+'<br><span class="hint">'+A.PL[t[1]]+'</span></span></button>'}).join('')+'</div><p><button class="btn sec" id="'+id+'r">重来</button></p><div id="'+id+'m"></div>';
 var bind=function(p){var order=[];
  function upd(){p.querySelectorAll('#'+id+' .choice').forEach(function(b){var k=order.indexOf(+b.dataset.i);b.querySelector('.ord').textContent=k>=0?(k+1):'';b.classList.remove('right','wrong')});
   if(order.length===sh.length){var v=order.map(function(i){return sh[i][2]});var ok=v.every(function(x,k){return k===0||v[k-1]>=x});
    p.querySelectorAll('#'+id+' .choice').forEach(function(b){b.classList.add(ok?'right':'wrong')});
    document.getElementById(id+'m').innerHTML=ok?'<p class="okmsg">'+okText+'</p>':'<p class="note">顺序不对，再看看。可以眯眼比较。</p>'}}
  p.querySelectorAll('#'+id+' .choice').forEach(function(b){b.onclick=function(){var i=+b.dataset.i;if(order.indexOf(i)<0&&order.length<sh.length)order.push(i);upd()}});
  document.getElementById(id+'r').onclick=function(){order=[];document.getElementById(id+'m').innerHTML='';upd()}};
 return {h:h,bind:bind};
}
/* 每节都有：看图先判断（遮住色块）、观察起步笔记、本节作业提示 */
function generic(c,n,p,A){
 var s=A.sec(n),key=c+'-'+n,h='';
 var imgs=[],re=/<img class="scard-img" src="([^"]+)" alt="([^"]*)"/g,m;
 while((m=re.exec(s.read)))imgs.push([m[1],m[2]]);
 if(imgs.length){
  h+=card('看图先判断（共 '+imgs.length+' 张）','<p>右边的色块先被遮住了。先看照片，自己说出 A、B、C（或 ①②③）各是什么颜色倾向、谁亮谁暗，再点“揭开”对答案。</p>'+
   imgs.map(function(x,i){return '<figure class="scard pcover" data-i="'+i+'" style="position:relative"><img src="'+x[0]+'" alt="'+A.esc(x[1])+'" loading="lazy" decoding="async" width="1080" height="1350" style="cursor:default"><div class="pc-mask" style="position:absolute;left:63.5%;top:17.3%;width:31.6%;height:56.6%;background:#e8dfd1;border-radius:12px;display:grid;place-items:center;text-align:center;font-weight:700;color:#5c564c;font-size:15px;padding:6px">先自己判断<br>再点下面揭开</div><figcaption>'+A.esc(x[1])+' <button type="button" class="btn sec pc-open" style="margin-left:6px">揭开</button></figcaption></figure>'}).join(''));
 }
 var go=(s.head||'').match(/观察起步<\/strong>\s*([^<]+)/);
 var notes=A.st.notes||{};
 h+=card('观察起步：先写下你的判断',(go?'<p>'+go[1]+'</p>':'<p>读完正文后，找一个身边的场景，用一句白话写下你最想验证的一个判断。</p>')+
  '<textarea id="pnote" placeholder="写下你的判断（只存在这台设备）">'+A.esc(notes[key]||'')+'</textarea><p><button class="btn sec" id="psave">保存笔记</button> <span id="pmsg" class="hint"></span></p>');
 h+=card('然后做作业','<p>把本节作业的<b>基础级</b>先做完，再挑战进阶级和挑战级。做好后到“③ 作业”提交照片和笔记。</p>');
 var after=function(){
  p.querySelectorAll('.pcover').forEach(function(f){var b=f.querySelector('.pc-open'),mk=f.querySelector('.pc-mask');b.onclick=function(){var on=mk.style.display!=='none';mk.style.display=on?'none':'grid';b.textContent=on?'遮住':'揭开'}});
  var sv=document.getElementById('psave');if(sv)sv.onclick=function(){A.st.notes=A.st.notes||{};A.st.notes[key]=document.getElementById('pnote').value;A.save();document.getElementById('pmsg').textContent='已保存在这台设备。'};
 };
 return {h:h,after:after};
}
/* 少量互动：复用第一章的类型（眯眼、揭下背景、排序、小测） */
function extra(c,n,p,A){
 var h='',after=null,k=c+'.'+n;
 if(k==='2.1'){
  h+=card('互动：眯眼看三种边','<p>下面三对颜色取自本节案例。按“眯眼”，看哪一对的分界还清楚，哪一对几乎融成一片。</p><div class="row eyes">'+
   pairRow('5PB 3.5/2','5B 7/1','① 暗面｜背景',A)+pairRow('7.5Y 8.5/2','7.5Y 6/1','② 亮面｜灰面',A)+pairRow('N8.5','N8.3','③ 白墙｜白布',A)+'</div><p><button class="btn" id="squint2">眯眼（模糊）</button></p>');
  h+=A.quiz('三对里，哪一对是“消失边缘”？',['① 暗面｜背景','② 亮面｜灰面','③ 白墙｜白布'],2,'正文案例3：白墙与白色织物 N8.5 对 N8.3，只差0.2级——视觉上应处理为完全没有分界线的过渡。');
  after=function(){document.getElementById('squint2').onclick=function(){p.querySelectorAll('.eyes .b').forEach(function(e){e.classList.toggle('blur')});this.textContent=this.textContent.indexOf('眯眼')===0?'睁开眼':'眯眼（模糊）'}};
 }
 if(k==='2.4')h+=A.quiz('立方体的棱有90°转折，但两面坐标只差0.2级（N8.3 对 N8.1），应该怎么处理？',['画一条清楚的硬线，因为有转折','按观察结果，处理为消失或极弱的边'],1,'正文案例2：坐标差异趋近于零时，边缘处理服从观察到的光学结果，而不是“这里有个角，应该有条线”。');
 if(k==='2.7')h+=A.quiz('阴天时，立方体暗面（5B 5/1）和背景（5B 7/1）这条边，等级怎么变？',['仍是硬边','降为软边'],1,'正文案例1：阴天时两侧同为 5B，只差2级明度——原本的硬边应降级为软边。');
 if(k==='3.2'){
  h+=card('互动：同一块灰，两种背景','<p>案例2：中间的灰片完全一样（N6）。左边放在暗面上，右边放在亮面上。先猜：哪一块看起来更亮？然后按“揭下背景”。</p>'+field('f32',['5PB 3.5/2','7.5Y 8.5/2'],'N6',A)+'<p><button class="btn" id="b32">揭下背景</button></p><div id="m32"></div>');
  after=function(){peel('f32','b32','m32','<div class="okmsg">两块都是 N6（'+A.PL['N6']+'）。</div><p>正文：放在暗面上像“7级”，放在亮面上像“5级”，其实都是 N6——判断明度要和灰阶紧挨着比。</p>')};
 }
 if(k==='3.4'){var so=sorter('s34',[['陶土花盆','10R 5/6',6],['褪色施工锥','5YR 6.5/8',8],['橙子受光面','2.5YR 6/12',12]],A,'对！彩度从高到低：橙子 /12 → 施工锥 /8 → 花盆 /6。');
  h+=card('互动：按彩度排队','<p>案例2的三件“橙色”物体。<b>从最鲜到最灰</b>依次点它们。</p>'+so.h);after=function(){so.bind(p)};}
 if(k==='3.3')h+=A.quiz('把静物从北窗冷光移到暖色台灯下，石膏暗面的色相会怎样？',['不变，仍是 5PB','跳到 YR 一侧（约 5YR 3.5/2）'],1,'正文案例3：暖台灯下暗面重判为 5YR 3.5/2——明度几乎不变，色相横跨半个色环。');
 if(k==='4.3'){
  h+=card('互动：灰片放进三种场地','<p>案例1：三块灰片完全一样（N6）。分别放在浅灰、鲜红、青绿的场地上。先比较：哪块偏绿、哪块偏红？然后按“揭下背景”。</p>'+field('f43',['N8','5R 5/10','5BG 5/8'],'N6',A)+'<p><button class="btn" id="b43">揭下背景</button></p><div id="m43"></div>');
  after=function(){peel('f43','b43','m43','<div class="okmsg">三块都是 N6（'+A.PL['N6']+'）。</div><p>正文：浅灰场压暗约半级；鲜红场把灰推向绿（约 5BG 6/1）；青绿场把灰推向红（约 5R 6/1）。加一圈中性隔离带，诱导会减弱八成以上。</p>')};
 }
 if(k==='4.1')h+=A.quiz('瓷杯体色（2.5Y 8.5/1.5）和石膏亮面（7.5Y 8.5/2），明暗、鲜灰都差不多。用哪一句才能把它们分开？',['明暗句','鲜灰句','冷暖句'],2,'正文案例2：前两句几乎无话可说，冷暖句判断“瓷杯比石膏暖·略”。');
 if(k==='4.4')h+=A.quiz('阴影里的白衬衫（5PB 7/1，复核约6.5）和阳光下的陶土（约10R 6/6），谁更亮？',['白衬衫','陶土'],1,'正文案例2：陶土受光面比阴影里的白衬衫亮约半级——名字会骗人。');
 if(k==='7.7')h+=A.quiz('同一种红砖，从30米到3公里，颜色怎么变？',['越远越红','越远彩度越低，最后变成大气的蓝灰色'],1,'正文案例1：10R 4.5/6 → 约 7.5R 5.5/3 → 约 5PB 6.5/1，远处“改姓大气色”。');
 if(k==='8.4')h+=A.quiz('同一只白石膏方块，哪种光下“固有色存活率”最高？',['晴日正午','阴天漫射','暖灯＋蓝墙'],1,'正文案例4：阴天漫射时四个面都接近中性（5PB 8.5/0.5、N8、N6.5），固有色存活率高；另外两种光下各面都被光和环境染色。');
 return {h:h,after:after};
}
window.widget2=function(c,n,p,A){
 var e=extra(c,n,p,A),g=generic(c,n,p,A);
 var src='<p class="hint">练习取自本节正文。屏幕颜色只作参考，真正的训练对象是你眼前的实物。</p>';
 return {src:src,h:e.h+g.h,after:function(){if(e.after)e.after();g.after()}};
};
})();
