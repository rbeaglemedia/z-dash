'use strict';
let fps=60,fpsAcc=0,fpsN=0;
// Per-frame render cost after the warm-up. The ring is the flight the pace report reads.
// gaps[] is the time between animation frames (what the HUD turns into FPS).
const Z_PACE=window.Z_PACE={n:0,sum:0,min:1e9,max:0,ring:[],gaps:[],cap:4000,heavyN:0,heavySum:0,lightN:0,lightSum:0,carSum:0,collectSum:0,restSum:0,
  reset(){this.n=0;this.sum=0;this.min=1e9;this.max=0;this.ring.length=0;this.gaps.length=0;this.heavyN=0;this.heavySum=0;this.lightN=0;this.lightSum=0;this.carSum=0;this.collectSum=0;this.restSum=0;}};
function pacePush(ms){const p=Z_PACE;p.n++;p.sum+=ms;if(ms<p.min)p.min=ms;if(ms>p.max)p.max=ms;if(p.ring.length<p.cap)p.ring.push(ms);}
function paceGap(ms){const p=Z_PACE;if(p.gaps.length<p.cap)p.gaps.push(ms);}
// ?perf=1 draws the frame-time graph and names the systems in that frame.
// Off that flag, none of these timers run.
const PERF=/[?&]perf=1/.test(location.search);
const Z_PERF=window.Z_PERF={on:PERF,gap:0,work:0,worst:'',worstMs:0,pass:{},top:[],frames:0,sum:{},slowN:0,slowSum:{},slow:[],raf:0,gcPending:0,gcN:0,gcWatch:false,heapDrop:0,flickerN:0,flickerLast:'',flicker:[],flickerBy:{},flickerLayer:{},build:'flick-1'};
// One row per layer per frame. A later cause on the same layer is appended.
function flickNote(layer,cause,detail){
  if(!PERF)return;
  if(!(window.Z_WARM&&Z_WARM.phase==='done'))return;
  const frame=Z_PERF.opened||0;
  let row=Z_PERF.flicker.length&&Z_PERF.flicker[Z_PERF.flicker.length-1].frame===frame&&Z_PERF.flicker[Z_PERF.flicker.length-1].layer===layer?Z_PERF.flicker[Z_PERF.flicker.length-1]:null;
  if(!row){
    row={frame,layer,cause,detail:detail||'',t:Math.round(performance.now())};
    Z_PERF.flickerN++;
    Z_PERF.flickerLayer[layer]=(Z_PERF.flickerLayer[layer]||0)+1;
    if(Z_PERF.flicker.length>=48)Z_PERF.flicker.shift();
    Z_PERF.flicker.push(row);
    if(Z_PERF.flickerN<=16)console.log('[flicker]',layer,cause,detail||'');
  }else{
    if(cause&&row.cause.indexOf(cause)<0)row.cause+='+'+cause;
    if(detail)row.detail=detail;
  }
  Z_PERF.flickerLast=row.layer+' '+row.cause+(row.detail?(' '+row.detail):'');
  const key=layer+':'+cause;
  Z_PERF.flickerBy[key]=(Z_PERF.flickerBy[key]||0)+1;
}
function flickCanvas(cv,prevW,prevH,w,h){
  let kind='';
  if(cv&&cv.id==='c')kind='city';
  else if(window.ZD&&ZD.Xray&&cv===ZD.Xray.canvas)kind='gl';
  else if(typeof ZV!=='undefined'&&ZV&&cv===ZV.cv)kind='cache';
  else return;
  if(!Z_PERF.clears)Z_PERF.clears={city:0,gl:0,cache:0};
  Z_PERF.clears[kind]++;
  Z_PERF.clearLast=kind+' '+prevW+'x'+prevH+'→'+w+'x'+h;
  if(kind==='gl')Z_PERF.glResizeFrame=Z_PERF.opened||0;
  if(kind==='cache')Z_PERF.cacheResizeFrame=Z_PERF.opened||0;
  // The city canvas is the picture. A width write clears the city and the HUD
  // together, and the browser can show that blank frame before the next draw.
  if(kind==='city'){flickNote('city','resize',Z_PERF.clearLast);flickNote('hud','resize',Z_PERF.clearLast);}
}
window.flickNote=flickNote;
window.flickCanvas=flickCanvas;
// A width or height write clears the bitmap, even when the number does not change.
// Wrapped only for ?perf=1, and only after the first real size, so the fast path
// and the first allocation stay out of the count.
if(PERF&&typeof HTMLCanvasElement==='function'){
  const proto=HTMLCanvasElement.prototype;
  const dw=Object.getOwnPropertyDescriptor(proto,'width');
  const dh=Object.getOwnPropertyDescriptor(proto,'height');
  if(dw&&dw.set&&dh&&dh.set&&!window._zFlickWrap){
    window._zFlickWrap=1;
    let guard=null;
    function arm(cv,prevW,prevH){
      if(guard===cv)return;
      guard=cv;
      queueMicrotask(function(){if(guard===cv)guard=null;});
      if(!(prevW>0||prevH>0))return;
      if(!(window.Z_WARM&&Z_WARM.phase==='done'))return;
      flickCanvas(cv,prevW,prevH,dw.get.call(cv),dh.get.call(cv));
    }
    Object.defineProperty(proto,'width',{configurable:true,enumerable:dw.enumerable,get:dw.get,set:function(v){const w=dw.get.call(this),h=dh.get.call(this);dw.set.call(this,v);arm(this,w,h);}});
    Object.defineProperty(proto,'height',{configurable:true,enumerable:dh.enumerable,get:dh.get,set:function(v){const w=dw.get.call(this),h=dh.get.call(this);dh.set.call(this,v);arm(this,w,h);}});
  }
}
let perfTextAt=0,perfBoxEl=null;
const PERF_SHORT={buildings:'bldg',trafficDraw:'cars',traffic:'ai',windows:'wins',objectives:'goal',collect:'bake',detail:'detail',ground:'ground',trails:'trails',fx:'fx',hud:'hud',map:'map',car:'car',carGl:'car gl',carCopy:'car copy',carBlit:'car blit',flame:'flame',sky:'sky',step:'step',dyn:'dyn',rings:'rings',crew:'crew',water:'water',hotdrop:'drop',walk:'walk',dom:'dom',timer:'timer',gc:'gc',other:'other',soccer:'ball',tow:'tow',runway:'runway',sort:'sort',tunnel:'tunnel',roads:'roads'};
function perfBegin(){
  if(!PERF)return;
  const p=Z_PERF.pass;
  for(const k in p)p[k]=0;
  if(Z_PERF.gcPending){p.gc=Z_PERF.gcPending;Z_PERF.gcPending=0;}
  Z_PERF.raf=0;
  Z_PERF.heap0=performance.memory?performance.memory.usedJSHeapSize:0;
  Z_PERF.t0=performance.now();
  Z_PERF.opened=(Z_PERF.opened||0)+1;
  Z_PERF.seen=Z_PERF.opened;
}
function perfAdd(name,ms){if(!PERF||!(ms>0))return;Z_PERF.pass[name]=(Z_PERF.pass[name]||0)+ms;}
window.perfBegin=perfBegin;window.perfAdd=perfAdd;
if(PERF&&typeof PerformanceObserver==='function'){
  try{
    const o=new PerformanceObserver(list=>{for(const e of list.getEntries()){Z_PERF.gcPending+=e.duration||0;Z_PERF.gcN++;}});
    o.observe({type:'gc',buffered:true});Z_PERF.gcWatch=true;
  }catch(e){
    try{
      const o=new PerformanceObserver(list=>{for(const e of list.getEntries()){Z_PERF.gcPending+=e.duration||0;Z_PERF.gcN++;}});
      o.observe({entryTypes:['gc']});Z_PERF.gcWatch=true;
    }catch(e2){Z_PERF.gcWatch=false;}
  }
}
function perfRows(){
  const rows=[],pass=Z_PERF.pass;let sum=0;
  for(const k in pass){const ms=pass[k];if(ms>0.05){rows.push([k,ms]);sum+=ms;}}
  return {rows,sum};
}
function perfClose(gap){
  if(!PERF)return;
  const work=Math.max(0,performance.now()-(Z_PERF.t0||performance.now()));
  const got=perfRows();let rows=got.rows;
  const other=work-got.sum;
  if(other>0.5)rows.push(['other',other]);
  rows.sort((a,b)=>b[1]-a[1]);
  Z_PERF.top=rows.slice(0,3).map(([n,ms])=>({n,ms:+ms.toFixed(2)}));
  Z_PERF.gap=gap;Z_PERF.work=work;
  Z_PERF.worst=Z_PERF.top.length?Z_PERF.top[0].n:'';
  Z_PERF.worstMs=Z_PERF.top.length?Z_PERF.top[0].ms:0;
  if(performance.memory)Z_PERF.heapDrop=(Z_PERF.heap0||0)-performance.memory.usedJSHeapSize;
  const live=window.Z_WARM&&Z_WARM.phase==='done';
  if(!live)return;
  Z_PERF.frames++;
  for(const[n,ms]of rows)Z_PERF.sum[n]=(Z_PERF.sum[n]||0)+ms;
  if(gap>=16||work>=16){
    Z_PERF.slowN++;
    for(const[n,ms]of rows)Z_PERF.slowSum[n]=(Z_PERF.slowSum[n]||0)+ms;
    if(Z_PERF.heapDrop>500000)Z_PERF.gcFrames=(Z_PERF.gcFrames||0)+1;
    const play=rows.filter(([n,ms])=>ms>=0.3).map(([n,ms])=>({n,ms:+ms.toFixed(2)}));
    if(Z_PERF.slow.length<48)Z_PERF.slow.push({gap:+gap.toFixed(1),work:+work.toFixed(1),top:Z_PERF.top.slice(),play,heap:Z_PERF.heapDrop|0,raf:Z_PERF.raf|0});
  }
}
function render(){const _vs=visApply();const tR=performance.now();
  // chase cam: smoothed behind the plane
  if(FLYCAM.orbit){const o=FLYCAM.orbit,tx=P.x,ty=P.y+.6,tz=P.z,ay=P.yaw+o.az;cam.x=tx+Math.sin(ay)*Math.cos(o.el)*o.d;cam.z=tz+Math.cos(ay)*Math.cos(o.el)*o.d;cam.y=ty+Math.sin(o.el)*o.d;
    const dx=tx-cam.x,dy=ty-cam.y,dz=tz-cam.z;cam.yaw=Math.atan2(dx,dz);cam.pitch=Math.atan2(-dy,Math.hypot(dx,dz));cam.roll=0;}else{
  const back=FLYCAM.back,up=FLYCAM.up,ty=P.y+ZV.ty,cp=Math.cos(P.pitch);
  let aim=P.yaw;if((P.ebK||0)>0.02){const dh=Math.atan2(Math.sin((P.hd||0)-P.yaw),Math.cos((P.hd||0)-P.yaw));aim=P.yaw+dh*P.ebK;}
  const D=Math.hypot(back,up);
  let dx=-Math.sin(aim)*cp*back,dy=-Math.sin(P.pitch)*back+up,dz=-Math.cos(aim)*cp*back;
  const len=Math.hypot(dx,dy,dz)||1,k=D/len;dx*=k;dy*=k;dz*=k;
  let cy=ty+dy;if(cy<1){cy=1;const dyA=cy-ty,horiz=Math.sqrt(Math.max(0,D*D-dyA*dyA));dx=-Math.sin(aim)*horiz;dz=-Math.cos(aim)*horiz;}
  cam.x=P.x+dx;cam.y=cy;cam.z=P.z+dz;
  {const lx=P.x-cam.x,ly=ty-cam.y,lz=P.z-cam.z;cam.yaw=Math.atan2(lx,lz);cam.pitch=Math.atan2(-ly,Math.hypot(lx,lz));}cam.roll=0;} /* locked chase cam: behind on heading+pitch, car dead centre, horizon level */
  // sky + horizon
  ctx.fillStyle='#05020c';ctx.fillRect(0,0,W,H);
  const rl=cam.roll;cam.roll=0;const hz=proj(cam.x+Math.sin(cam.yaw)*1e5,cam.y,cam.z+Math.cos(cam.yaw)*1e5);cam.roll=rl;const hy=hz?hz[1]:H/2;
  ctx.save();ctx.translate(W/2,H/2);ctx.rotate(cam.roll);ctx.translate(-W/2,-H/2);
  if(!skyGrad||gradHy!==hy||gradH!==H){gradHy=hy;gradH=H;skyGrad=ctx.createLinearGradient(0,hy-H,0,hy);skyGrad.addColorStop(0,'#05020c');skyGrad.addColorStop(.7,'#2a0636');skyGrad.addColorStop(1,'#ff2a3d');groundGrad=ctx.createLinearGradient(0,hy,0,hy+H);groundGrad.addColorStop(0,'#1a0410');groundGrad.addColorStop(1,'#020203');}
  ctx.fillStyle=skyGrad;ctx.fillRect(-W,hy-H*2,W*3,H*2);
  ctx.fillStyle=groundGrad;ctx.fillRect(-W,hy,W*3,H*2);
  ctx.strokeStyle='#ff5a66';ctx.lineWidth=2;ctx.shadowColor='#ff2a3d';ctx.shadowBlur=14;ctx.beginPath();ctx.moveTo(-W,hy);ctx.lineTo(W*2,hy);ctx.stroke();ctx.shadowBlur=0;ctx.restore();
  // grid
  const S=40,N=22,gx=Math.round(cam.x/S)*S,gz=Math.round(cam.z/S)*S;ctx.globalAlpha=.55;
  for(let i=-N;i<=N;i++){line([gx+i*S,0,gz-N*S],[gx+i*S,0,gz+N*S],'#7a1a8a',1);line([gx-N*S,0,gz+i*S],[gx+N*S,0,gz+i*S],'#7a1a8a',1);}
  ctx.globalAlpha=1;
  if(PERF)perfAdd('sky',performance.now()-tR);
  // towers (far to near)
  drawCityGround();if(!RWXRAY.on)drawRunway();frameItems.length=0;if(typeof itemReset==='function')itemReset();
  if(PERF){const tS=performance.now();cityItems(frameItems);perfAdd('sort',performance.now()-tS);}else cityItems(frameItems);
  const tCol=performance.now();if(window.TRAFFIC)TRAFFIC.collect(frameItems);const colMs=performance.now()-tCol;if(PERF)perfAdd('collect',colMs);
  if(PERF){const tS=performance.now();for(const r of rings){if(typeof itemPush==='function')itemPush(frameItems,(r.x-cam.x)**2+(r.z-cam.z)**2,'r',r);else frameItems.push([(r.x-cam.x)**2+(r.z-cam.z)**2,'r',r]);}frameItems.sort(itemFarther);perfAdd('sort',performance.now()-tS);}
  else{for(const r of rings){if(typeof itemPush==='function')itemPush(frameItems,(r.x-cam.x)**2+(r.z-cam.z)**2,'r',r);else frameItems.push([(r.x-cam.x)**2+(r.z-cam.z)**2,'r',r]);}frameItems.sort(itemFarther);}
  for(const[d,k,o]of frameItems){if(d>2200*2200)continue;
    const t0=PERF?performance.now():0,w0=PERF?(Z_PERF.pass.windows||0):0;
    ctx.globalAlpha=clamp(1.4-Math.sqrt(d)/1800,0.15,1);
    if(k==='t'){ctx.globalAlpha=1;if(o.draw)o.draw(Math.sqrt(d));else drawBldg(o,Math.sqrt(d));}
    else{ctx.shadowColor='#ffb020';ctx.shadowBlur=8;let prev=null;for(let i=0;i<=16;i++){const a=i/16*Math.PI*2,px=o.x+Math.cos(o.yaw)*Math.cos(a)*o.r,pz=o.z+Math.sin(o.yaw)*Math.cos(a)*o.r,p=[px,o.y+Math.sin(a)*o.r,pz];if(prev)line(prev,p,'#ffb020',3);prev=p;}ctx.shadowBlur=0;}
    if(t0){const name=k==='r'?'rings':(o.traffic?'trafficDraw':(o.draw?'dyn':'buildings'));const win=(Z_PERF.pass.windows||0)-w0;perfAdd(name,Math.max(0,performance.now()-t0-win));}}
  ctx.globalAlpha=1;farFlush();drawTunnelInside();
  // shadow on ground
  const sh=proj(P.x,(P.ground?P.y:P.gy||0)+0.35,P.z);if(sh){ctx.fillStyle='rgba(255,42,61,.25)';ctx.beginPath();ctx.ellipse(sh[0],sh[1],Math.max(2,900/sh[2]),Math.max(1,300/sh[2]),0,0,7);ctx.fill();}
  if(RWXRAY.on)drawRunway();
  if(PERF){const t=performance.now();drawSkids();perfAdd('trails',performance.now()-t);}else drawSkids();
  P.y+=P.sus||0;if(window.CREW){if(PERF){const t=performance.now();CREW.update();perfAdd('crew',performance.now()-t);}else CREW.update();}
  drawZ();P.y-=P.sus||0;
  if(PERF){const t=performance.now();drawWaterline();perfAdd('water',performance.now()-t);const t2=performance.now();drawFX();perfAdd('fx',performance.now()-t2);}else{drawWaterline();drawFX();}
  if(window.HOTDROP){if(PERF){const t=performance.now();HOTDROP.draw();perfAdd('hotdrop',performance.now()-t);}else HOTDROP.draw();}
  visRestore(_vs);
  if(PERF){const t=performance.now(),m0=Z_PERF.pass.map||0,hd=Z_PERF.hudDrew||0;drawHud(hudDt);perfAdd('hud',Math.max(0,performance.now()-t-((Z_PERF.pass.map||0)-m0)));if((Z_PERF.hudDrew||0)===hd&&window.Z_WARM&&Z_WARM.phase==='done')flickNote('hud','not-drawn','');}else drawHud(hudDt);
  // Train the car rate on heavy frames only, and only once play has started.
  // A 70–90 blended average is not a signal: it is the cheap frame mixed with this one.
  if(window.Z_WARM&&Z_WARM.phase==='done'){
    const dtR=performance.now()-tR;
    pacePush(dtR);
    Z_PACE.collectSum+=colMs;
    const carMs=ZV.drew?(ZV.carMs||0):0;
    Z_PACE.restSum+=dtR-colMs-carMs;
    if(ZV.drew){Z_PACE.heavyN++;Z_PACE.heavySum+=dtR;Z_PACE.carSum+=carMs;if(typeof zRate==='function')zRate(dtR,1);}
    else{Z_PACE.lightN++;Z_PACE.lightSum+=dtR;}
  }}
let last=performance.now(),hudDt=1/60,fpsWall=performance.now(),loopHidden=false;
const frameItems=[];
function itemFarther(a,b){return b[0]-a[0];}
let skyGrad=null,groundGrad=null,gradHy=NaN,gradH=0;
// Asset packs. world/warm-manifest.json is the list a server can replace.
// A pack with an atlas URL is sliced into the cache. A null URL is baked here.
// Fast devices stop around 10s. A slow iPad may run longer. Neither path
// changes the picture: the sprites and shop lines are the ones play already built.
const Z_WARM=window.Z_WARM={phase:'probe',pct:2,slow:false,budget:10000,ms:0,label:'Checking this device',cache:0,bytes:0,bakeMs:0,at:0,total:0,pack:'',probeN:0,probeMs:0};
let warmManifest=null,warmLocked=false,warmLeft=0,warmPackI=0,warmUrl=null,warmGridSet=false,warmGpuN=0;
const WARM_FALLBACK={packs:[
  {id:'shaders',kind:'gpu',label:'Lights and shaders',weight:8,url:null},
  {id:'minimap',kind:'canvas',label:'City map',weight:6,url:null},
  {id:'icons',kind:'canvas',label:'Icons',weight:4,url:null},
  {id:'shops',kind:'geometry',label:'Shop fronts',weight:10,url:null},
  {id:'traffic',kind:'sprite-grid',label:'Cars',weight:72,url:null,elev:[0,1,2,3,4,-1,5],atlas:{url:null,sheets:null,cell:160,columns:24,rows:7}}
]};
fetch('world/warm-manifest.json').then(r=>r.ok?r.json():null).then(m=>{if(m&&m.packs&&!warmLocked)warmManifest=m;}).catch(()=>{});
function warmPacks(){return (warmManifest&&warmManifest.packs)||WARM_FALLBACK.packs;}
function warmEnsure(){
  let el=document.getElementById('zWarm');
  if(el)return el;
  const css=document.createElement('style');
  css.id='zWarmCss';
  css.textContent='#zWarm{position:fixed;inset:0;z-index:220;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(ellipse at 50% 0%,#2a0636 0%,#05020c 58%);color:#e9fbff;font-family:Orbitron,Rajdhani,sans-serif;text-align:center}#zWarm .zw{width:min(440px,90vw)}#zWarm .kicker{font:800 13px Rajdhani,sans-serif;letter-spacing:5px;color:#3ee6ff}#zWarm h2{margin:10px 0 20px;font:900 28px/1.15 Orbitron,sans-serif;letter-spacing:2px;text-shadow:0 0 18px #ff4fd8,0 0 4px #3ee6ff}#zWarm .bar{height:16px;border:2px solid #3ee6ff;border-radius:99px;overflow:hidden;box-shadow:0 0 18px rgba(62,230,255,.55);background:rgba(8,4,20,.85)}#zWarm .bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#3ee6ff,#ff4fd8);box-shadow:0 0 12px #3ee6ff;transition:width .18s linear}#zWarm .pct{margin-top:14px;font:900 26px Orbitron,sans-serif;letter-spacing:1px}#zWarm .st{margin-top:8px;min-height:1.2em;font:800 15px Rajdhani,sans-serif;letter-spacing:.8px;color:#d7f6ff}#zWarm .foot{margin-top:16px;font:700 13px/1.35 Rajdhani,sans-serif;letter-spacing:.2px;color:#b9a8d4}';
  document.head.appendChild(css);
  el=document.createElement('div');
  el.id='zWarm';
  el.setAttribute('role','status');
  el.setAttribute('aria-live','polite');
  el.innerHTML='<div class="zw"><div class="kicker">NEON WORLD</div><h2>WAKING THE CITY</h2><div class="bar" aria-hidden="true"><i data-k="f"></i></div><div class="pct" data-k="p">2%</div><div class="st" data-k="s">Checking this device</div><div class="foot" data-k="foot"></div></div>';
  (document.body||document.documentElement).appendChild(el);
  return el;
}
function warmPaint(pct,label){
  const el=warmEnsure();
  Z_WARM.pct=pct;Z_WARM.label=label||'';
  const bar=el.querySelector('[data-k="f"]'),num=el.querySelector('[data-k="p"]'),st=el.querySelector('[data-k="s"]'),ft=el.querySelector('[data-k="foot"]');
  if(bar)bar.style.width=pct+'%';
  if(num)num.textContent=pct+'%';
  if(st)st.textContent=label||'';
  if(ft)ft.textContent=Z_WARM.slow?'This iPad is building the city before the first flight.':'About ten seconds, then the city is ready to drive.';
}
function warmPct(subAt,subTotal){
  const packs=warmPacks();let w=0,acc=0;
  for(let i=0;i<packs.length;i++)w+=packs[i].weight||1;
  if(!w)w=1;
  for(let i=0;i<warmPackI&&i<packs.length;i++)acc+=packs[i].weight||1;
  if(warmPackI<packs.length&&subTotal>0)acc+=(packs[warmPackI].weight||1)*Math.min(1,subAt/subTotal);
  return Math.max(2,Math.min(99,Math.round(100*acc/w)));
}
function warmFinish(){
  if(Z_WARM.phase==='done')return;
  Z_WARM.phase='done';Z_WARM.pct=100;Z_WARM.ms=Math.max(0,Math.round(Z_WARM.budget-warmLeft));
  if(typeof ipadPause==='function')ipadPause(1.6);
  const el=document.getElementById('zWarm');if(el)el.remove();
  fpsWall=performance.now();
}
function warmWork(budget){
  const packs=warmPacks();
  if(warmPackI>=packs.length)return;
  const pack=packs[warmPackI];
  Z_WARM.pack=pack.id||'';
  let done=false,at=0,total=1,label=pack.label||'Loading';
  try{
    if(pack.kind==='gpu'){
      const ok=typeof zWarmGpu==='function'&&zWarmGpu();
      warmGpuN++;done=!!ok||warmGpuN>24;label=pack.label||'Lights and shaders';
    }else if(pack.kind==='canvas'&&pack.id==='minimap'){
      if(typeof miniBake==='function')miniBake();
      if(typeof zIconBake==='function')zIconBake();
      done=true;label=pack.label||'City map';
    }else if(pack.kind==='canvas'){
      if(typeof poiBake==='function')poiBake();
      done=true;label=pack.label||'Icons';
    }else if(pack.kind==='geometry'){
      const r=window.DETAIL&&DETAIL.prewarm?DETAIL.prewarm(budget):{done:true,at:1,total:1};
      done=!!(r&&r.done);at=r?r.at:0;total=r?r.total:1;
      label=(pack.label||'Shop fronts')+(total?'  '+at+' / '+total:'');
    }else if(pack.kind==='sprite-grid'){
      const sheets=pack.atlas&&pack.atlas.sheets;
      if(!warmUrl&&sheets&&sheets.length&&window.TRAFFIC&&TRAFFIC.warmFromUrl){
        warmUrl='wait';
        TRAFFIC.warmFromUrl(pack).then(ok=>{warmUrl=ok?'ok':'local';});
        label='Fetching cars';
      }else if(warmUrl==='wait'){
        label='Fetching cars';
      }else if(warmUrl==='ok'){
        done=true;label='Cars ready';
      }else if(window.TRAFFIC&&TRAFFIC.warmStep){
        if(!warmGridSet&&TRAFFIC.warmGrid){TRAFFIC.warmGrid(pack.elev);warmGridSet=true;}
        const r=TRAFFIC.warmStep(budget);
        done=!!(r&&r.done);at=r?r.at:0;total=r?r.total:1;
        Z_WARM.cache=r?r.cache:Z_WARM.cache;Z_WARM.bytes=r?r.bytes:Z_WARM.bytes;Z_WARM.bakeMs=r?r.bakeMs:Z_WARM.bakeMs;
        Z_WARM.at=at;Z_WARM.total=total;
        label='Cars  '+at+' / '+total;
      }else done=true;
    }else done=true;
  }catch(e){done=true;}
  warmPaint(warmPct(at,total),label);
  if(done){warmPackI++;warmUrl=null;}
}
function warmDrive(t,wall){
  if(Z_WARM.phase==='done')return false;
  if(Z_WARM.phase==='probe'){
    Z_WARM.probeN++;
    if(Z_WARM.probeN>1)Z_WARM.probeMs+=Math.min(0.08,Math.max(0,wall||0));
    warmPaint(2,'Checking this device');
    if(Z_WARM.probeN>=4){
      const avg=Z_WARM.probeMs/Math.max(1,Z_WARM.probeN-1);
      const slow=typeof ipadSized!=='undefined'&&ipadSized&&avg>0.016;
      warmLocked=true;Z_WARM.slow=slow;
      const bud=warmManifest&&warmManifest.budgets;
      Z_WARM.budget=slow?((bud&&bud.slowIpadMs)||26000):((bud&&bud.fastMs)||10000);
      Z_WARM.phase='run';warmLeft=Z_WARM.budget;
    }
    return false;
  }
  const t0=performance.now();
  warmWork(Math.min(34,Math.max(8,warmLeft)));
  warmLeft-=performance.now()-t0;
  Z_WARM.ms=Math.max(0,Math.round(Z_WARM.budget-warmLeft));
  last=t;fpsWall=performance.now();
  if(warmPackI>=warmPacks().length||warmLeft<=0){warmFinish();return false;}
  return true;
}
function loop(t){
  // A hidden tab keeps the callback armed and does not step or draw. The next
  // visible frame starts a fresh clock so one background gap is not a stall.
  if(typeof document!=='undefined'&&document.hidden){loopHidden=true;requestAnimationFrame(loop);return;}
  const now=performance.now();
  if(loopHidden){loopHidden=false;last=t;fpsWall=now;}
  const wall=now-fpsWall;fpsWall=now;
  const raw=Math.max(0,t-last);last=t;const dt=Math.min(0.05,raw/1000);
  if(warmDrive(t,wall)){requestAnimationFrame(loop);return;}
  if(PERF&&Z_PERF.seen!==Z_PERF.opened)perfBegin();
  if(typeof camLookTick==='function'){if(PERF){const tC=performance.now();camLookTick(t);perfAdd('cam',performance.now()-tC);}else camLookTick(t);}
  // Physics keeps the 50ms cap. Phone and PC keep that same clock for the HUD.
  // An iPad uses the wall gap, so a frame slower than 50ms is not shown as 20.
  const onIpad=typeof ipadSized!=='undefined'&&ipadSized;
  const clock=onIpad?(wall>250?dt:wall/1000):dt;
  fpsAcc+=clock;fpsN++;if(fpsAcc>0.5){fps=fpsN/fpsAcc;fpsAcc=0;fpsN=0;}
  if(onIpad&&wall<=250&&typeof ipadFit==='function')ipadFit(wall/1000);
  hudDt=dt;
  if(PERF){
    const tS=performance.now(),o0=Z_PERF.pass.objectives||0;if(flying&&!paused)step(dt);perfAdd('step',Math.max(0,performance.now()-tS-((Z_PERF.pass.objectives||0)-o0)));
    const tT=performance.now();if(window.TOWDRIVE&&!paused)TOWDRIVE.update(dt);perfAdd('tow',performance.now()-tT);
    const tA=performance.now();if(window.TRAFFIC&&!paused)TRAFFIC.update(dt);perfAdd('traffic',performance.now()-tA);
    const tB=performance.now();if(window.SOCCER)SOCCER.frame(dt);perfAdd('soccer',performance.now()-tB);
  }else{if(flying&&!paused)step(dt);if(window.TOWDRIVE&&!paused)TOWDRIVE.update(dt);if(window.TRAFFIC&&!paused)TRAFFIC.update(dt);if(window.SOCCER)SOCCER.frame(dt);}
  if(window.NEON_PAINT&&NEON_PAINT.settle)NEON_PAINT.settle();
  render();
  if(window.Z_WARM&&Z_WARM.phase==='done'&&wall>0&&wall<250)paceGap(wall);
  if(PERF){perfClose(wall);perfPaint();}
  requestAnimationFrame(loop);}
function perfBox(){
  if(perfBoxEl)return perfBoxEl;
  const css=document.createElement('style');
  css.textContent='#zPerf{position:fixed;left:8px;bottom:8px;z-index:400;pointer-events:none;padding:6px 8px;border:1px solid #3ee6ff;border-radius:8px;background:rgba(5,2,12,.88);color:#d7fff8;font:700 11px/1.35 ui-monospace,monospace;text-shadow:0 1px 0 #000;white-space:pre-line;max-width:480px}#zPerf canvas{display:block;width:192px;height:48px;margin-bottom:4px;background:#12081c}';
  document.head.appendChild(css);
  const el=document.createElement('div');
  el.id='zPerf';
  el.innerHTML='<canvas width="192" height="48"></canvas><div data-k="t"></div>';
  (document.body||document.documentElement).appendChild(el);
  perfBoxEl=el;
  return el;
}
function perfPaint(){
  const gap=Z_PERF.gap,work=Z_PERF.work;
  const samples=Z_PERF.gaps||(Z_PERF.gaps=[]);
  samples.push(gap);if(samples.length>96)samples.shift();
  const el=perfBox(),cv=el.querySelector('canvas'),g=cv.getContext('2d'),Wd=cv.width,Hd=cv.height,scale=Hd/40;
  g.clearRect(0,0,Wd,Hd);g.fillStyle='#12081c';g.fillRect(0,0,Wd,Hd);
  g.globalAlpha=.45;g.strokeStyle='#3ee6ff';g.beginPath();g.moveTo(0,Hd-8.3*scale);g.lineTo(Wd,Hd-8.3*scale);g.stroke();
  g.strokeStyle='#ff4fd8';g.beginPath();g.moveTo(0,Hd-16.6*scale);g.lineTo(Wd,Hd-16.6*scale);g.stroke();g.globalAlpha=1;
  for(let i=0;i<samples.length;i++){const ms=samples[i],bh=Math.max(1,Math.min(Hd,ms*scale));g.fillStyle=ms>16.6?'#ff2a3d':ms>8.6?'#ffb020':'#3ee6ff';g.fillRect(i*2,Hd-bh,1,bh);}
  const now=performance.now();if(now-perfTextAt<200)return;perfTextAt=now;
  const stats=paceQuant(Z_PACE.gaps);
  const every=typeof ZV!=='undefined'?ZV.every:1;
  const rung=typeof ipadSized!=='undefined'&&ipadSized&&typeof ipadScale==='function'?ipadScale():null;
  const slow=gap>=16||work>=16;
  const line=list=>list.map(r=>((PERF_SHORT[r.n]||r.n)+' '+r.ms.toFixed(1))).join(' · ');
  const avgN=Z_PERF.frames||0,avg=[];
  if(avgN){for(const k in Z_PERF.sum)avg.push({n:k,ms:Z_PERF.sum[k]/avgN});avg.sort((a,b)=>b.ms-a.ms);}
  const heap=Z_PERF.heapDrop>1000000?('  heap -'+(Z_PERF.heapDrop/1048576).toFixed(1)+'mb'):'';
  const extra=Z_PERF.raf>0?('  extra raf '+Z_PERF.raf):'';
  el.querySelector('[data-k=t]').textContent=
    gap.toFixed(1)+' ms gap   '+work.toFixed(1)+' ms work'+(slow?'  SLOW':'')+heap+extra+'\n'
    +'now '+(Z_PERF.top.length?line(Z_PERF.top):'—')+'\n'
    +(avg.length?('avg '+line(avg.slice(0,3).map(r=>({n:r.n,ms:r.ms})))+'\n'):'')
    +(stats?('med '+stats.med.toFixed(1)+'   1% '+stats.low.toFixed(1)+'   slow '+Z_PERF.slowN+'\n'):'')
    +'sprite x'+every+(window.Z_NOCARSKIP?' nocarskip':'')+'  skip '+(Z_PERF.skipN||0)+(rung?'   rung '+rung.step+' / '+rung.boost:'')+'\n'
    +flickLine()+'\n'
    +perfSw()+' · '+perfPdb()+' · bakes '+(Z_PERF.trafficBake||0)+' · glsize '+((Z_PERF.clears&&Z_PERF.clears.gl)||0)+' · rsz '+(Z_PERF.resizeN||0)+(Z_PERF.resizeSame?('/'+Z_PERF.resizeSame+' same'):'')+'\n'
    +perfBg()+' · '+Z_PERF.build+'\n'+perfIdle();
}
function flickLine(){
  const n=Z_PERF.flickerN||0,by=Z_PERF.flickerBy||{},rows=[];
  for(const k in by)rows.push([k,by[k]]);
  rows.sort(function(a,b){return b[1]-a[1];});
  const top=rows.slice(0,3).map(function(r){return r[0]+' '+r[1];}).join(' · ');
  return 'flicker '+n+(top?('  '+top):'  —')+(Z_PERF.flickerLast?('\nlast '+Z_PERF.flickerLast):'');
}
function perfSw(){
  let url='none';
  try{const c=navigator.serviceWorker&&navigator.serviceWorker.controller;url=c&&c.scriptURL?c.scriptURL:'none';}catch(e){}
  Z_PERF.sw=url;
  if(url.indexOf('/test/sw.js')>=0)return 'sw test';
  if(/\/sw\.js(?:\?|$)/.test(url))return 'sw ROOT';
  if(url!=='none')return 'sw other';
  return 'sw none';
}
function perfPdb(){
  try{
    const R=window.ZD&&ZD.Xray&&ZD.Xray.renderer;
    const gl=R&&R.getContext&&R.getContext();
    if(!gl)return 'pdb ?';
    const a=gl.getContextAttributes()||{};
    Z_PERF.pdb=a.preserveDrawingBuffer?1:0;
    return 'pdb '+(a.preserveDrawingBuffer?1:0)+' aa '+(a.antialias?1:0);
  }catch(e){return 'pdb ?';}
}
function perfBg(){
  const dash=!!(window.ZDKID||document.getElementById('kCv')||(window.ZD&&ZD.Music));
  const music=!!(window.ZD&&ZD.Music&&ZD.Music.playing);
  let audio=0;
  document.querySelectorAll('audio').forEach(a=>{if(!a.paused&&(a.currentSrc||a.src))audio++;});
  const gl=(window.ZD&&ZD.Xray&&ZD.Xray.renderer)?1:0;
  const dance=window.DANCE_STAGE&&typeof DANCE_STAGE.armed==='function'&&DANCE_STAGE.armed()&&!(DANCE_STAGE.isOpen&&DANCE_STAGE.isOpen());
  Z_PERF.bg={dash,music,audio,gl,dance};
  return (dash?'DASH ON':'dash off')+' · '+(music?'music on':'music off')+' · car gl '+gl+' · '+(dance?'bg raf':'bg off');
}
function perfIdle(){
  const bg=window.Z_BG;
  if(!bg||typeof bg.line!=='function')return 'idle ?';
  return bg.line();
}
function paceQuant(arr){
  if(!arr||arr.length<8)return null;
  const s=arr.slice().sort(function(a,b){return a-b;});
  const at=function(p){return s[Math.min(s.length-1,Math.max(0,Math.floor(p*(s.length-1))))];};
  return {min:s[0],med:at(0.5),max:s[s.length-1],low:at(0.99)};
}
requestAnimationFrame(loop);
function syncStartButtons(){const row=document.getElementById('kStartMode');if(!row)return;row.querySelectorAll('[data-sm]').forEach(b=>b.classList.toggle('on',b.dataset.sm===P.startMode));}
function setStartMode(mode){P.startMode=mode==='skydrop'?'skydrop':'runway';try{localStorage.setItem('zdw_start',P.startMode);}catch(e){}syncStartButtons();}
function beginSky(){resetSkyDrop();if(typeof wMsg==='function')wMsg('SKY DROP!','#3ee6ff','tap WINGS to open & glide · aim for the city!');}
document.getElementById('ready').addEventListener('click',async()=>{goFull();TL.a0=screenAngle();orientFix();await allowTilt();tiltCenter();if(P.startMode==='skydrop')beginSky();flying=true;document.getElementById('kOver').classList.add('hidden');document.getElementById('kMenuB').classList.remove('hidden');if(P.startMode!=='skydrop')toast('FLY!');});
document.getElementById('kStartMode').addEventListener('click',e=>{const b=e.target.closest('[data-sm]');if(!b)return;e.preventDefault();const sm=b.dataset.sm;if(sm==='soccer'||sm==='wall'||sm==='paint'){const file=(location.pathname||'').split('/').pop()||'world.html';if(sm==='soccer')location.assign(file+'?entry=soccer');else if(sm==='wall')location.assign('neon-paint.html?mode=wall');else location.assign('neon-paint.html');return;}setStartMode(sm);});
document.getElementById('kHome').addEventListener('click',e=>{const b=e.target.closest('[data-m="skydrop"]');if(!b)return;setStartMode('skydrop');beginSky();flying=true;document.getElementById('kOver').classList.add('hidden');document.getElementById('kMenuB').classList.remove('hidden');kPause(false);});
syncStartButtons();

document.getElementById('kWrR').addEventListener('click',()=>{reset();kToast('BACK ON THE RUNWAY');});document.getElementById('kWrH').addEventListener('click',()=>{location.href='jr.html';});
// On-screen TILT button removed. Pause-menu ⊙ TILT CENTER still calls tiltCenter(); tilt input itself is unchanged.
window.FLY={VP,visPose,CITY,CDRAW,P,TUNE,TL,FLYCAM,cam,proj,FX,showWreck,get fps(){return fps;}};
