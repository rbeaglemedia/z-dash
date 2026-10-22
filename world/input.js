'use strict';
// ===== TILT (same approach as jr.html TL) =====
const TL={have:false,perm:(window.DeviceOrientationEvent&&typeof DeviceOrientationEvent.requestPermission==='function')?'ask':'auto',lr:0,fb:0,n0:{lr:0,fb:0},calNext:true,last:0};
function screenAngle(){if(window.ORIENT_OVERRIDE!=null)return window.ORIENT_OVERRIDE;let a=screen.orientation&&typeof screen.orientation.angle==='number'?screen.orientation.angle:(window.orientation||0);return((Math.round(a/90)*90)%360+360)%360;}
function tiltRead(e){if(e.beta==null)return;TL.gv=gravScreen(e.beta,e.gamma||0,TL.a0!=null?TL.a0:screenAngle());const a=TL.a0!=null?TL.a0:screenAngle(),b=e.beta,g=e.gamma||0;const [lr,fb]=a===90?[b,g]:a===270?[-b,-g]:a===180?[-g,b]:[g,-b];
  TL.lr=clamp(lr,-90,90);TL.fb=clamp(fb,-90,90);TL.have=true;TL.last=performance.now();if(TL.perm!=='denied')TL.perm='granted';if(TL.calNext){TL.calNext=false;TL.n0={lr:TL.lr,fb:TL.fb};TL.g0=TL.gv;TL.sl=0;TL.sf=0;}}
addEventListener('deviceorientation',tiltRead);
function orientFix(){try{const k=document.getElementById('kid');if(TL.a0==null){k&&k.classList.remove('flip180');return;}const d=((screenAngle()-TL.a0)%360+360)%360;k&&k.classList.toggle('flip180',d===180);}catch(e){}}
addEventListener('orientationchange',orientFix);try{screen.orientation&&screen.orientation.addEventListener&&screen.orientation.addEventListener('change',orientFix);}catch(e){}
async function allowTilt(){if(TL.perm==='ask'){try{const r=await DeviceOrientationEvent.requestPermission();TL.perm=r==='granted'?'granted':'denied';}catch(e){TL.perm='denied';}}}
/* gravity unit vector in the SCREEN frame (from the device rotation; alpha not needed) */
function gravScreen(b,g,a){const B=b*D,G=g*D,x=Math.cos(B)*Math.sin(G),y=-Math.sin(B),z=-Math.cos(B)*Math.cos(G);
  return a===90?[-y,x,z]:a===270?[y,-x,z]:a===180?[-x,-y,z]:[x,y,z];}
/* tilt relative to the centred pose: rotation from g0 to g, split along the centred screen axes (stable at any angle, no axis swap) */
function relTilt(){const g0=TL.g0,g=TL.gv;if(!g0||!g)return null;
  let ex=[1-g0[0]*g0[0],-g0[0]*g0[1],-g0[0]*g0[2]];const n=Math.hypot(ex[0],ex[1],ex[2])||1;ex=ex.map(v=>v/n);
  const ey=[ex[1]*g0[2]-ex[2]*g0[1],ex[2]*g0[0]-ex[0]*g0[2],ex[0]*g0[1]-ex[1]*g0[0]],dot=(u,v)=>u[0]*v[0]+u[1]*v[1]+u[2]*v[2],c=dot(g,g0);
  return[Math.atan2(dot(g,ex),c)/D,Math.atan2(dot(g,ey),c)/D];}
function goFull(){const lk=()=>{try{const o=screen.orientation;if(o&&o.lock&&/^landscape/.test(o.type||''))o.lock(o.type).catch(()=>{});}catch(e){}};
  try{const d=document.documentElement,fs=document.fullscreenElement||document.webkitFullscreenElement;if(fs){lk();return;}
    const r=d.requestFullscreen?d.requestFullscreen({navigationUI:'hide'}):d.webkitRequestFullscreen?d.webkitRequestFullscreen():null;
    if(r&&r.then)r.then(lk,lk);else lk();}catch(e){lk();}}
function tiltCenter(){if(TL.have){TL.n0={lr:TL.lr,fb:TL.fb};TL.g0=TL.gv;TL.sl=0;TL.sf=0;TL.calNext=false;}else TL.calNext=true;}
const tiltOk=()=>!TL.off&&TL.have&&TL.perm!=='denied'&&performance.now()-TL.last<1500;
// ===== INPUT =====
function setWings(on,quiet){P.wings=on?1:0;const b=document.getElementById('wng');if(b){b.classList.toggle('open',!!on);document.getElementById('wngS').textContent=on?'OPEN':'CLOSED';}if(!quiet)toast(on?'WINGS OPEN!':'WINGS CLOSED!');}
{const b=document.getElementById('wng');b.addEventListener('pointerdown',e=>{e.preventDefault();b.classList.add('nfxp');setWings(!P.wings);});['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,()=>b.classList.remove('nfxp')));
 addEventListener('keydown',e=>{if(e.code==='KeyF'&&!e.repeat&&flying)setWings(!P.wings);});}
function startRoll(d){return;/* Bob: no barrel rolls */if(!flying||P.ground||P.roll||P.flip)return;P.roll={d,t:0,b0:clamp(P.bank,-TUNE.maxBank*D,TUNE.maxBank*D)};toast('BARREL ROLL!');}
{const tap={};addEventListener('keydown',e=>{if(e.repeat)return;if(e.code==='KeyZ')startRoll(-1);if(e.code==='KeyC')startRoll(1);const d=(e.code==='ArrowLeft'||e.code==='KeyA')?-1:(e.code==='ArrowRight'||e.code==='KeyD')?1:0;if(!d)return;const n=performance.now();if(n-(tap[d]||0)<300){startRoll(d);tap[d]=0;}else tap[d]=n;});}
const K={};addEventListener('keydown',e=>{K[e.code]=1;if(e.code.startsWith('Arrow')||e.code==='Space')e.preventDefault();});addEventListener('keyup',e=>{K[e.code]=0;});
const B={tup:0,nos:0,brk:0,brkDx:0,brkX:null,ebLatch:0};
// Each button keeps its own pointer and its own touch so AIR BRAKE and THROTTLE can be held together.
// Touch is handled on touch events (two fingers). Mouse/pen use pointer events. A touch does not also
// take the mouse-compat pointer that some browsers fire afterwards.
// AIR BRAKE stays labeled AIR BRAKE. Past the drag threshold, on the ground, a separate E-BRAKE pad
// pops up under the finger, to the right of the button. It is live only while the finger is on it.
let ebTouchAt=0;
function syncEb(){const el=document.getElementById('brk'),pad=document.getElementById('ebpad');
  const ground=typeof P!=='undefined'&&!!P.ground;
  let on=false;
  if(el&&pad&&B.brk&&ground&&B.brkX!=null&&B.brkDx>=(TUNE.eBrakeDrag||40)){
    const body=el.offsetParent||el.parentElement,br=body.getBoundingClientRect();
    const flip=!!(document.getElementById('kid')&&document.getElementById('kid').classList.contains('flip180'));
    let fx=B.brkX-br.left;if(flip)fx=br.width-fx;
    const size=el.offsetWidth||92,gap=8;
    const minLeft=el.offsetLeft+el.offsetWidth+gap;
    const maxLeft=Math.max(minLeft,(body.clientWidth||br.width)-size-8);
    let left=fx-size/2;if(left<minLeft)left=minLeft;if(left>maxLeft)left=maxLeft;
    on=fx>=left-1;
    if(on){pad.style.left=left+'px';pad.style.top=el.offsetTop+'px';pad.style.width=size+'px';pad.style.height=(el.offsetHeight||size)+'px';pad.style.right='auto';pad.style.bottom='auto';}}
  B.ebLatch=on?1:0;
  if(pad){pad.classList.toggle('show',on);pad.setAttribute('aria-hidden',on?'false':'true');}}
function bindHold(id){const el=document.getElementById(id);let ptr=null,touchId=null,x0=0;
  const down=x=>{B[id]=1;el.classList.add('on','nfxp');if(id==='brk'){x0=x;B.brkX=x;B.brkDx=0;syncEb();}};
  const move=x=>{if(id!=='brk'||!B.brk)return;B.brkX=x;B.brkDx=x-x0;syncEb();};
  const up=()=>{B[id]=0;el.classList.remove('on','nfxp');if(id==='brk'){B.brkDx=0;B.brkX=null;B.ebLatch=0;syncEb();}};
  el.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||performance.now()-ebTouchAt<700)return;e.preventDefault();ptr=e.pointerId;try{el.setPointerCapture(e.pointerId);}catch(_){}down(e.clientX);});
  el.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||ptr!==e.pointerId)return;move(e.clientX);});
  const pup=e=>{if(e.pointerType==='touch'||ptr!==e.pointerId)return;ptr=null;up();};
  el.addEventListener('pointerup',pup);el.addEventListener('pointercancel',pup);
  el.addEventListener('touchstart',e=>{ebTouchAt=performance.now();try{e.preventDefault();}catch(_){}
    for(const t of e.changedTouches)if(touchId==null){touchId=t.identifier;down(t.clientX);}},{passive:false});
  el.addEventListener('touchmove',e=>{for(const t of e.changedTouches)if(t.identifier===touchId){ebTouchAt=performance.now();try{e.preventDefault();}catch(_){}move(t.clientX);}},{passive:false});
  const tup=e=>{ebTouchAt=performance.now();for(const t of e.changedTouches)if(t.identifier===touchId){touchId=null;up();}};
  el.addEventListener('touchend',tup,{passive:false});el.addEventListener('touchcancel',tup,{passive:false});}
for(const id of['tup','nos','brk'])bindHold(id);
