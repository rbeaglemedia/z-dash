'use strict';
// Dev tools read window.ZD_PERF / ZD_KILL / ZD_BENCH. When those are unset the
// branches below are a few null checks and the frame is the normal game.
function zdT(){return window.ZD_PERF?performance.now():-1;}
function zdAdd(n,t0){var p=window.ZD_PERF;if(p&&t0>=0){try{p.add(n,performance.now()-t0);}catch(e){window.ZD_PERF=null;}}}
function zdSkip(n){var k=window.ZD_KILL;return !!(k&&k[n]);}
let fps=60,fpsAcc=0,fpsN=0,skyGrad=null,groundGrad=null,gradKey='';
function render(){const _vs=visApply();
  var __zo=zdT();
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
  const glOn=window.GLCITY&&GLCITY.active();
  if(glOn)GLCITY.beginUnder();
  let items;
  try{
  // sky + horizon
  ctx.fillStyle='#05020c';ctx.fillRect(0,0,W,H);
  const rl=cam.roll;cam.roll=0;  const hz=proj(cam.x+Math.sin(cam.yaw)*1e5,cam.y,cam.z+Math.cos(cam.yaw)*1e5);cam.roll=rl;let hy=hz&&Number.isFinite(hz[1])?hz[1]:H/2;if(!Number.isFinite(hy))hy=H*0.5;
  ctx.save();ctx.translate(W/2,H/2);ctx.rotate(cam.roll);ctx.translate(-W/2,-H/2);
  const gkey=(hy|0)+':'+H+':'+cv.width+':'+cv.height;
  if(gkey!==gradKey||!skyGrad){gradKey=gkey;skyGrad=ctx.createLinearGradient(0,hy-H,0,hy);skyGrad.addColorStop(0,'#05020c');skyGrad.addColorStop(.7,'#2a0636');skyGrad.addColorStop(1,'#ff2a3d');groundGrad=ctx.createLinearGradient(0,hy,0,hy+H);groundGrad.addColorStop(0,'#1a0410');groundGrad.addColorStop(1,'#020203');}
  ctx.fillStyle=skyGrad;ctx.fillRect(-W,hy-H*2,W*3,H*2);
  ctx.fillStyle=groundGrad;ctx.fillRect(-W,hy,W*3,H*2);
  ctx.strokeStyle='#ff5a66';ctx.lineWidth=2;ctx.shadowColor='#ff2a3d';ctx.shadowBlur=14;ctx.beginPath();ctx.moveTo(-W,hy);ctx.lineTo(W*2,hy);ctx.stroke();ctx.shadowBlur=0;ctx.restore();
  // grid
  const S=40,N=22,gx=Math.round(cam.x/S)*S,gz=Math.round(cam.z/S)*S,quiet=typeof roadLook==='function'&&roadLook()==='E';ctx.globalAlpha=quiet?0.16:0.55;
  for(let i=-N;i<=N;i++){line([gx+i*S,0,gz-N*S],[gx+i*S,0,gz+N*S],'#7a1a8a',1);line([gx-N*S,0,gz+i*S],[gx+N*S,0,gz+i*S],'#7a1a8a',1);}
  ctx.globalAlpha=1;
  zdAdd('other',__zo);
  // towers (far to near)
  var __zb=zdT();
  drawCityGround();if(!RWXRAY.on)drawRunway();items=[];cityItems(items);
  zdAdd('buildings',__zb);
  var __zt=zdT();
  if(window.TRAFFIC&&!zdSkip('traffic'))TRAFFIC.collect(items);
  zdAdd('traffic',__zt);
  __zb=zdT();
  for(const r of rings)items.push([(r.x-cam.x)**2+(r.z-cam.z)**2,'r',r]);items.sort((a,b)=>b[0]-a[0]);
  }finally{if(glOn)GLCITY.beginOver();}
  if(glOn)GLCITY.compose(items);
  zdAdd('buildings',__zb);
  var __perf=window.ZD_PERF,__drawn=0;
  for(const[d,k,o]of items){if(d>2200*2200)continue;var __ti=__perf?performance.now():0;ctx.globalAlpha=clamp(1.4-Math.sqrt(d)/1800,0.15,1);
    if(k==='t'){ctx.globalAlpha=1;if(o.draw){if(!(window.GLCITY&&GLCITY.skipDyn(o)))o.draw(Math.sqrt(d));}else drawBldg(o,Math.sqrt(d));}
    else{ctx.shadowColor='#ffb020';ctx.shadowBlur=8;let prev=null;for(let i=0;i<=16;i++){const a=i/16*Math.PI*2,px=o.x+Math.cos(o.yaw)*Math.cos(a)*o.r,pz=o.z+Math.sin(o.yaw)*Math.cos(a)*o.r,p=[px,o.y+Math.sin(a)*o.r,pz];if(prev)line(prev,p,'#ffb020',3);prev=p;}ctx.shadowBlur=0;}
    if(__perf){try{__drawn++;__perf.add((o&&o.traffic)?'traffic':(k==='r'?'effects':'buildings'),performance.now()-__ti);}catch(e){__perf=window.ZD_PERF=null;}}}
  if(__perf){try{__perf.note({draws:__drawn,objects:items.length});}catch(e){window.ZD_PERF=null;}}
  ctx.globalAlpha=1;farFlush();drawTunnelInside();
  // shadow on ground
  const sh=proj(P.x,(P.ground?P.y:P.gy||0)+0.35,P.z);if(sh){ctx.fillStyle='rgba(255,42,61,.25)';ctx.beginPath();ctx.ellipse(sh[0],sh[1],Math.max(2,900/sh[2]),Math.max(1,300/sh[2]),0,0,7);ctx.fill();}
  if(RWXRAY.on)drawRunway();
  var __ze=zdT();if(!zdSkip('trails'))drawSkids();zdAdd('effects',__ze);
  P.y+=P.sus||0;var __zc=zdT();if(window.CREW)CREW.update();drawZ();zdAdd('car',__zc);P.y-=P.sus||0;
  __ze=zdT();drawWaterline();if(!zdSkip('trails'))drawFX();if(window.HOTDROP)HOTDROP.draw();zdAdd('effects',__ze);
  var __zw=zdT();if(typeof drawWeather==='function'&&!zdSkip('weather')){try{drawWeather();}catch(e){}}zdAdd('weather',__zw);
  visRestore(_vs);drawHud(hudDt);if(typeof drawRoadLookTag==='function')drawRoadLookTag();}
let last=performance.now(),hudDt=1/60;
function loop(t){var __p=window.ZD_PERF;if(__p){try{__p.begin();}catch(e){window.ZD_PERF=__p=null;}}
  const dt=Math.min(0.05,(t-last)/1000);last=t;fpsAcc+=dt;fpsN++;if(fpsAcc>0.5){fps=fpsN/fpsAcc;fpsAcc=0;fpsN=0;}
  hudDt=dt;var __tp=__p?performance.now():-1;if(flying&&!paused&&!(window.ZD_BENCH&&ZD_BENCH.drive))step(dt);if(__p){try{__p.add('physics',performance.now()-__tp);}catch(e){window.ZD_PERF=__p=null;}}
  if(window.TOWDRIVE&&!paused)TOWDRIVE.update(dt);
  var __tr=__p?performance.now():-1;if(window.TRAFFIC&&!paused&&!zdSkip('traffic'))TRAFFIC.update(dt);if(__p){try{__p.add('traffic',performance.now()-__tr);}catch(e){window.ZD_PERF=__p=null;}}
  if(window.ZD_BENCH&&ZD_BENCH.tick){try{ZD_BENCH.tick(dt);}catch(e){}}
  if(window.SOCCER)SOCCER.frame(dt);try{render();}catch(e){if(!loop.err)loop.err=String(e&&e.message||e);}
  if(__p){try{__p.end();}catch(e){window.ZD_PERF=null;}}
  requestAnimationFrame(loop);}
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
// Tools stay unloaded until this device is unlocked, the URL says ?dev=1, or the hidden corner gesture.
(function(){
  function zdRoot(){var list=document.getElementsByTagName('script'),i,src,m;for(i=0;i<list.length;i++){src=list[i].getAttribute('src')||'';m=src.match(/^(.*)world\/boot\.js/);if(m)return m[1];}return '';}
  function zdLoad(file){try{var s=document.createElement('script');s.src=zdRoot()+'test/dev/'+file;s.async=false;s.onerror=function(){var b=document.getElementById('zd-banner');if(!b){b=document.createElement('div');b.id='zd-banner';b.setAttribute('role','alert');b.style.cssText='position:fixed;left:8px;right:8px;top:8px;z-index:90;background:#3a1020;color:#fff;padding:12px 14px;font:16px/1.35 sans-serif;border:2px solid #ff5a7a';(document.body||document.documentElement).appendChild(b);}b.textContent='A dev tool failed to load ('+file+'). The game is still running.';};document.head.appendChild(s);}catch(e){}}
  var q=false,unlocked=false;
  try{q=/[?&]dev=1(?:&|$)/.test(location.search);}catch(e){}
  try{unlocked=localStorage.getItem('zdash.dev.unlock')==='1';}catch(e){}
  if(q||unlocked)zdLoad('hook.js');
  var taps=0,tapAt=0;
  addEventListener('pointerdown',function(e){
    if(q||unlocked||document.getElementById('zd-pin'))return;
    if(e.clientX>40||e.clientY>40){taps=0;return;}
    var now=Date.now();if(now-tapAt>4000)taps=0;tapAt=now;taps++;
    if(taps>=5){taps=0;zdLoad('unlock.js');}
  },{passive:true});
})();
