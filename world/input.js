'use strict';
// Desktop PC only: no touch screen, and wider than a tablet. Mobile and touch laptops stay on the phone layout.
function isDesktopPC(){return !(('ontouchstart' in window)||(navigator.maxTouchPoints>0))&&innerWidth>1024;}
window.isDesktopPC=isDesktopPC;
const PC_FOOT_IDS={tup:'walkFwdBtn',nos:'walkRunBtn',brk:'walkJumpBtn',exitCarBtn:'walkExitBtn',emoteBtn:'walkEmoteBtn'};
function syncPcMode(){const on=isDesktopPC();document.documentElement.classList.toggle('pc-mode',on);if(document.body)document.body.classList.toggle('pc-mode',on);if(typeof stampAllPcKeys==='function')stampAllPcKeys();}
function installPcCss(){if(document.getElementById('pcModeCss'))return;const css=document.createElement('style');css.id='pcModeCss';css.textContent=''
  +'html.pc-mode #nos{left:18px;right:auto;bottom:16px;width:108px;height:108px}'
  +'html.pc-mode #brk.kfbrk{left:18px;right:auto;bottom:136px;width:104px;height:100px}'
  +'html.pc-mode #tup{right:18px;left:auto;bottom:16px;width:120px;height:120px}'
  +'html.pc-mode #wng.kfwng{right:18px;left:auto;top:auto !important;bottom:148px !important;width:104px;height:104px}'
  +'html.pc-mode #kMenuB,html.pc-mode #kid[data-tab] #kMenuB{position:fixed;left:auto !important;right:10px !important;top:8px !important;bottom:auto !important;transform:none !important;width:68px;height:auto;min-height:52px;z-index:40;display:flex;flex-direction:column;align-items:center;justify-content:center}'
  +'html.pc-mode #kMenuB.hidden,html.pc-mode #kMenuB.kopen{display:none !important}'
  +'html.pc-mode #exitCarBtn{position:fixed !important;top:8px !important;right:86px !important;left:auto !important;height:52px;min-width:96px;z-index:40}'
  +'html.pc-mode #enterBldBtn{position:fixed !important;top:8px !important;left:max(300px,23vw) !important;right:auto !important;height:52px;z-index:40}'
  +'html.pc-mode #pcFps{position:fixed;top:10px;left:calc(50% + 150px);z-index:40;min-width:92px;height:42px;display:flex;align-items:center;justify-content:center;padding:0 12px;border-radius:12px;border:2px solid #3ee6ff;background:rgba(8,4,20,.9);color:#fff;font:900 18px/1 Orbitron,sans-serif;letter-spacing:1px;box-shadow:0 0 16px rgba(62,230,255,.6);pointer-events:none;text-shadow:0 0 8px #3ee6ff}'
  +'html.pc-mode .pc-key{display:block;font:800 10px/1.1 Rajdhani,sans-serif !important;letter-spacing:.3px;margin-top:3px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.9);pointer-events:none;white-space:nowrap}'
  +'html.pc-mode #exitCarBtn .pc-key,html.pc-mode #enterBldBtn .pc-key{color:#140018;text-shadow:none;font-size:9px !important}'
  +'html.pc-mode #kMenuB .pc-key{color:#bff6ff;text-shadow:0 0 6px #3ee6ff;font-size:9px !important;margin-top:0}'
  +'html:not(.pc-mode) .pc-key{display:none !important}';
  document.head.appendChild(css);}
installPcCss();syncPcMode();addEventListener('resize',syncPcMode);
function pcKeyFor(el){if(!el)return '';const foot=onFootNow();
  switch(el.id){case 'tup':return '[W / ↑]';case 'nos':return foot?'[SHIFT + W]':'[SHIFT]';case 'brk':return foot?'[SPACE]':'[S / ↓]';
    case 'wng':return foot?'[C]':'[F · G MODE]';case 'ebpad':return '[SPACE]';case 'exitCarBtn':return '[C]';case 'enterBldBtn':return '[E]';
    case 'kMenuB':return '[ESC]';case 'emoteBtn':return '[1-4]';default:return '';}}
function stampPcKey(el){if(!el)return;let k=el.querySelector(':scope > small.pc-key');
  if(!isDesktopPC()){if(k)k.remove();return;}
  const text=pcKeyFor(el);if(!text){if(k)k.remove();return;}
  if(!k){k=document.createElement('small');k.className='pc-key';}
  if(k.textContent!==text)k.textContent=text;
  if(el.lastChild!==k)el.appendChild(k);
  const footId=PC_FOOT_IDS[el.id];
  if(footId){if(onFootNow()){if(k.id!==footId)k.id=footId;}else if(k.id===footId)k.removeAttribute('id');}}
function stampAllPcKeys(){for(const id of ['tup','nos','brk','wng','ebpad','exitCarBtn','enterBldBtn','kMenuB','emoteBtn'])stampPcKey(document.getElementById(id));}
// ===== TILT (same approach as jr.html TL) =====
const TL={have:false,perm:(window.DeviceOrientationEvent&&typeof DeviceOrientationEvent.requestPermission==='function')?'ask':'auto',lr:0,fb:0,n0:{lr:0,fb:0},calNext:true,last:0};
function screenAngle(){if(window.ORIENT_OVERRIDE!=null)return window.ORIENT_OVERRIDE;let a=screen.orientation&&typeof screen.orientation.angle==='number'?screen.orientation.angle:(window.orientation||0);return((Math.round(a/90)*90)%360+360)%360;}
function tiltRead(e){if(e.beta==null)return;TL.gv=gravScreen(e.beta,e.gamma||0,TL.a0!=null?TL.a0:screenAngle());const a=TL.a0!=null?TL.a0:screenAngle(),b=e.beta,g=e.gamma||0;const [lr,fb]=a===90?[b,g]:a===270?[-b,-g]:a===180?[-g,b]:[g,-b];
  TL.lr=clamp(lr,-90,90);TL.fb=clamp(fb,-90,90);TL.have=true;TL.last=performance.now();if(TL.perm!=='denied')TL.perm='granted';if(TL.calNext){TL.calNext=false;TL.n0={lr:TL.lr,fb:TL.fb};TL.g0=TL.gv;TL.sl=0;TL.sf=0;}}
addEventListener('deviceorientation',tiltRead);
function orientFix(){try{const k=document.getElementById('kid');if(TL.a0==null){k&&k.classList.remove('flip180');return;}const a=screenAngle(),d=((a-TL.a0)%360+360)%360;if(d===90||d===270){TL.a0=a;TL.calNext=true;TL.sl=0;TL.sf=0;k&&k.classList.remove('flip180');return;}k&&k.classList.toggle('flip180',d===180);}catch(e){}}
addEventListener('orientationchange',orientFix);addEventListener('resize',orientFix);try{screen.orientation&&screen.orientation.addEventListener&&screen.orientation.addEventListener('change',orientFix);}catch(e){}
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
function tiltCenter(){if(TL.a0!=null&&((screenAngle()-TL.a0)%180!==0)){TL.a0=screenAngle();orientFix();TL.calNext=true;TL.sl=0;TL.sf=0;return;}if(TL.have){TL.n0={lr:TL.lr,fb:TL.fb};TL.g0=TL.gv;TL.sl=0;TL.sf=0;TL.calNext=false;}else TL.calNext=true;}
const tiltOk=()=>!TL.off&&TL.have&&TL.perm!=='denied'&&performance.now()-TL.last<1500;
// ===== INPUT =====
function onFootNow(){const W=window.WALK_MODE;return !!(W&&W.onFoot);}
function canExitCar(){const W=window.WALK_MODE;return !!(W&&!W.onFoot&&typeof W.canGetOut==='function'&&W.canGetOut());}
function syncWingsBtn(){const b=document.getElementById('wng');if(!b)return;
  if(onFootNow()){if(typeof syncOnFootButtons==='function')syncOnFootButtons();return;}
  const s=document.getElementById('wngS'),hasP=typeof P!=='undefined',open=!!(hasP&&P.wings),street=!open&&hasP&&P.driveMode==='street';
  b.classList.remove('enter-car','exit-car');
  b.classList.toggle('open',open);b.classList.toggle('arcade',!open&&!street);b.classList.toggle('street',street);
  b.style.background='';b.style.boxShadow='';b.style.color='';
  if(s)s.textContent=open?'OPEN':street?'STREET':'ARCADE';}
syncWingsBtn();
function bootWingsBtn(){try{if(typeof P!=='undefined'&&P.driveMode!=='street'&&P.driveMode!=='arcade')P.driveMode='arcade';syncWingsBtn();}catch(e){}}
if(document.readyState==='loading')addEventListener('DOMContentLoaded',bootWingsBtn);else bootWingsBtn();
function setWings(on,quiet){P.wings=on?1:0;syncWingsBtn();if(!quiet)toast(on?'WINGS OPEN!':'WINGS CLOSED!');}
function setDriveMode(mode,quiet){const street=mode==='street';P.driveMode=street?'street':'arcade';
  if(!quiet){if(street){if(P.wings&&P.ground)setWings(0,true);toast('STREET MODE · REALISTIC DRIVE');if(typeof wMsg==='function')wMsg('🛣️ STREET MODE','#7dff6b','realistic speed, easy slow-down & street drift');}
    else{toast('ARCADE MODE · FULL POWER');if(typeof wMsg==='function')wMsg('⚡ ARCADE MODE','#3ee6ff','full power & instant launch');}}
  syncWingsBtn();}
window.setDriveMode=setDriveMode;
function toggleDrive(){setDriveMode(P.driveMode==='street'?'arcade':'street');}
addEventListener('keydown',e=>{if(e.repeat)return;if(e.code==='KeyF'&&flying)setWings(!P.wings);if(e.code==='KeyV'||e.code==='KeyM'||(e.code==='KeyG'&&isDesktopPC()))toggleDrive();});
function startRoll(d){return;/* Bob: no barrel rolls */if(!flying||P.ground||P.roll||P.flip)return;P.roll={d,t:0,b0:clamp(P.bank,-TUNE.maxBank*D,TUNE.maxBank*D)};toast('BARREL ROLL!');}
{const tap={};addEventListener('keydown',e=>{if(e.repeat)return;if(e.code==='KeyZ')startRoll(-1);if(e.code==='KeyC')startRoll(1);const d=(e.code==='ArrowLeft'||e.code==='KeyA')?-1:(e.code==='ArrowRight'||e.code==='KeyD')?1:0;if(!d)return;const n=performance.now();if(n-(tap[d]||0)<300){startRoll(d);tap[d]=0;}else tap[d]=n;});}
const K={};addEventListener('keydown',e=>{K[e.code]=1;if(e.code.startsWith('Arrow')||e.code==='Space')e.preventDefault();});addEventListener('keyup',e=>{K[e.code]=0;});
const B={tup:0,nos:0,brk:0,brkDx:0,brkX:null,ebLatch:0,walk:0,run:0,jump:0,emote:0};
// Each button keeps its own pointer and its own touch so AIR BRAKE and THROTTLE can be held together.
// Touch is handled on touch events (two fingers). Mouse/pen use pointer events. A touch does not also
// take the mouse-compat pointer that some browsers fire afterwards.
// On the ground the button reads BRAKE. In the air (P.y > 0.15) it reads AIR BRAKE.
// The label is rewritten only when that ground/air state changes. Past the drag threshold,
// on the ground or in the air, a separate E-BRAKE pad pops up under the finger, to the right
// of the button. It is live only while the finger is on it. KeyB latches too, so desktop and
// tests can hold the Sky Whip. An outside B.ebLatch = 1 sticks.
let ebTouchAt=0;
function syncEb(){const el=document.getElementById('brk'),pad=document.getElementById('ebpad');
  const canEb=typeof P!=='undefined'&&!P.wreck;
  let on=false;
  if(el&&pad&&B.brk&&canEb&&B.brkX!=null&&B.brkDx>=(TUNE.eBrakeDrag||40)){
    const body=el.offsetParent||el.parentElement,br=body.getBoundingClientRect();
    const flip=!!(document.getElementById('kid')&&document.getElementById('kid').classList.contains('flip180'));
    let fx=B.brkX-br.left;if(flip)fx=br.width-fx;
    const size=el.offsetWidth||92,gap=8;
    const minLeft=el.offsetLeft+el.offsetWidth+gap;
    const maxLeft=Math.max(minLeft,(body.clientWidth||br.width)-size-8);
    let left=fx-size/2;if(left<minLeft)left=minLeft;if(left>maxLeft)left=maxLeft;
    on=fx>=left-1;
    if(on){pad.style.left=left+'px';pad.style.top=el.offsetTop+'px';pad.style.width=size+'px';pad.style.height=(el.offsetHeight||size)+'px';pad.style.right='auto';pad.style.bottom='auto';}}
  if(B.brk)B.ebLatch=on?1:0;
  if(canEb&&K.KeyB){B.ebLatch=1;B._ebKey=1;}
  else if(B._ebKey){B._ebKey=0;if(!B.brk)B.ebLatch=0;}
  if(pad){pad.classList.toggle('show',on);pad.setAttribute('aria-hidden',on?'false':'true');}}
function bindHold(id){const el=document.getElementById(id);let ptr=null,touchId=null,x0=0,y0=0,wasFoot=false,jumpLatched=false;
  const down=(x,y)=>{y0=y==null?y0:y;wasFoot=onFootNow();jumpLatched=false;el.classList.add('on','nfxp');
    if(wasFoot){if(id==='tup'){B.walk=1;B.tup=0;}else if(id==='nos'){B.run=1;B.nos=0;}else if(id==='brk'){B.jump=1;B.brk=0;B.brkX=null;B.brkDx=0;B.ebLatch=0;const pad=document.getElementById('ebpad');if(pad){pad.classList.remove('show');pad.setAttribute('aria-hidden','true');}if(window.WALK_MODE&&typeof WALK_MODE.jump==='function')WALK_MODE.jump();}
      if(window.WALK_MODE)WALK_MODE.runMode=!!(B.run&&B.walk);return;}
    B[id]=1;if(id==='brk'){x0=x;B.brkX=x;B.brkDx=0;syncEb();}};
  const move=(x,y)=>{if(wasFoot&&id==='nos'&&B.run){const flip=!!(document.getElementById('kid')&&document.getElementById('kid').classList.contains('flip180'));
      const upPx=flip?(y-y0):(y0-y);const brk=document.getElementById('brk');
      if(upPx>=32){B.run=1;if(!jumpLatched){jumpLatched=true;B.jump=1;if(brk)brk.classList.add('on');if(window.WALK_MODE&&typeof WALK_MODE.jump==='function')WALK_MODE.jump();}}
      else if(upPx<20&&jumpLatched){jumpLatched=false;if(brk&&!brk.classList.contains('nfxp')){B.jump=0;brk.classList.remove('on');}}
      if(window.WALK_MODE)WALK_MODE.runMode=!!(B.run&&B.walk);return;}
    if(!wasFoot&&id==='brk'&&B.brk){B.brkX=x;B.brkDx=x-x0;syncEb();}};
  const up=()=>{el.classList.remove('on','nfxp');
    if(wasFoot){if(id==='tup')B.walk=0;else if(id==='nos'){B.run=0;if(jumpLatched){jumpLatched=false;const brk=document.getElementById('brk');if(brk&&!brk.classList.contains('nfxp')){B.jump=0;brk.classList.remove('on');}}}else if(id==='brk')B.jump=0;
      if(window.WALK_MODE)WALK_MODE.runMode=!!(onFootNow()&&B.run&&B.walk);return;}
    B[id]=0;if(id==='brk'){B.brkDx=0;B.brkX=null;B.ebLatch=0;syncEb();}};
  el.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||performance.now()-ebTouchAt<700)return;e.preventDefault();ptr=e.pointerId;try{el.setPointerCapture(e.pointerId);}catch(_){}down(e.clientX,e.clientY);});
  el.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||ptr!==e.pointerId)return;move(e.clientX,e.clientY);});
  const pup=e=>{if(e.pointerType==='touch'||ptr!==e.pointerId)return;ptr=null;up();};
  el.addEventListener('pointerup',pup);el.addEventListener('pointercancel',pup);
  el.addEventListener('touchstart',e=>{ebTouchAt=performance.now();try{e.preventDefault();}catch(_){}
    for(const t of e.changedTouches)if(touchId==null){touchId=t.identifier;down(t.clientX,t.clientY);}},{passive:false});
  el.addEventListener('touchmove',e=>{for(const t of e.changedTouches)if(t.identifier===touchId){ebTouchAt=performance.now();try{e.preventDefault();}catch(_){}move(t.clientX,t.clientY);}},{passive:false});
  const tup=e=>{ebTouchAt=performance.now();for(const t of e.changedTouches)if(t.identifier===touchId){touchId=null;up();}};
  el.addEventListener('touchend',tup,{passive:false});el.addEventListener('touchcancel',tup,{passive:false});}
for(const id of['tup','nos','brk'])bindHold(id);
// WINGS: a quick tap (pad never shown, drag under 24px) opens or closes the wings.
// Slide left at least 36px in unflipped coords (flip180 mapped like the E-BRAKE pad) and #mdpad
// pops up to the left, naming the mode you will switch to. Slide back onto WINGS to cancel.
// Release while that pad is showing (it latches the pending switch) calls setDriveMode.
{const b=document.getElementById('wng');let ptr=null,touchId=null,x0=0,y0=0,fx0=0,moved=0,holding=false,padOn=false,everPad=false;
  const unflip=clientX=>{const body=b.offsetParent||b.parentElement,br=body.getBoundingClientRect();
    const flip=!!(document.getElementById('kid')&&document.getElementById('kid').classList.contains('flip180'));
    let fx=clientX-br.left;if(flip)fx=br.width-fx;return fx;};
  const syncMd=clientX=>{const pad=document.getElementById('mdpad');if(!pad)return false;let on=false;
    if(holding&&clientX!=null){const fx=unflip(clientX);
      if(fx0-fx>=36){const size=b.offsetWidth||84,gap=8,maxLeft=b.offsetLeft-size-gap;
        let left=fx-size/2;if(left<8)left=8;if(left>maxLeft)left=maxLeft;
        const toStreet=!(typeof P!=='undefined'&&P.driveMode==='street');
        const t=document.getElementById('mdpadT'),s=document.getElementById('mdpadS');
        if(t)t.textContent=toStreet?'STREET':'ARCADE';if(s)s.textContent='MODE';
        pad.classList.toggle('to-street',toStreet);pad.classList.toggle('to-arcade',!toStreet);
        pad.style.left=left+'px';pad.style.top=b.offsetTop+'px';pad.style.width=size+'px';pad.style.height=(b.offsetHeight||size)+'px';pad.style.right='auto';pad.style.bottom='auto';
        on=true;everPad=true;}}
    padOn=on;pad.classList.toggle('show',on);pad.setAttribute('aria-hidden',on?'false':'true');return on;};
  const arm=(x,y)=>{holding=true;x0=x;y0=y;fx0=unflip(x);moved=0;padOn=false;everPad=false;b.classList.add('nfxp');syncMd(x);};
  const drag=(x,y)=>{if(!holding)return;const d=Math.hypot(x-x0,y-y0);if(d>moved)moved=d;syncMd(x);};
  const release=commit=>{b.classList.remove('nfxp');const latched=!!padOn;holding=false;padOn=false;
    const pad=document.getElementById('mdpad');if(pad){pad.classList.remove('show');pad.setAttribute('aria-hidden','true');}
    if(commit&&latched)setDriveMode((typeof P!=='undefined'&&P.driveMode==='street')?'arcade':'street');
    else if(commit&&!everPad&&moved<24){const W=window.WALK_MODE;
      if(W&&W.onFoot&&typeof W.toggleGetOut==='function')W.toggleGetOut();
      else setWings(!P.wings);}
    if(typeof syncOnFootButtons==='function')syncOnFootButtons();
    ptr=null;touchId=null;};
  b.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||performance.now()-ebTouchAt<700)return;e.preventDefault();ptr=e.pointerId;try{b.setPointerCapture(e.pointerId);}catch(_){}arm(e.clientX,e.clientY);});
  b.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||ptr!==e.pointerId)return;drag(e.clientX,e.clientY);});
  const pup=e=>{if(e.pointerType==='touch'||ptr!==e.pointerId)return;release(e.type==='pointerup');};
  b.addEventListener('pointerup',pup);b.addEventListener('pointercancel',pup);
  b.addEventListener('touchstart',e=>{ebTouchAt=performance.now();try{e.preventDefault();}catch(_){}
    for(const t of e.changedTouches)if(touchId==null){touchId=t.identifier;arm(t.clientX,t.clientY);}},{passive:false});
  b.addEventListener('touchmove',e=>{for(const t of e.changedTouches)if(t.identifier===touchId){ebTouchAt=performance.now();try{e.preventDefault();}catch(_){}drag(t.clientX,t.clientY);}},{passive:false});
  const tend=e=>{ebTouchAt=performance.now();const commit=e.type==='touchend';for(const t of e.changedTouches)if(t.identifier===touchId)release(commit);};
  b.addEventListener('touchend',tend,{passive:false});b.addEventListener('touchcancel',tend,{passive:false});}
// On foot, the four drive buttons become WALK / RUN / JUMP / ENTER, and a bottom-middle EMOTE wheel appears.
// Street exit/enter is #exitCarBtn, left of pause, so #wng stays WINGS while driving.
// Injected here so world-split.html stays untouched.
const EMOTE_OPTS=[{id:'up',name:'DANCE 1',label:'↑ Dance 1'},{id:'right',name:'DANCE 2',label:'→ Dance 2'},{id:'down',name:'PET GROOVE',label:'↓ Pet Groove'},{id:'left',name:'HYPE SPIN',label:'← Hype Spin'}];
let footMode='';
function setBtnFace(el,main,smallText,smallId){if(!el)return;const can=el.querySelector('.nfxcan');const keep=el.querySelector(':scope > small.pc-key');
  [...el.childNodes].forEach(n=>{if(n!==can&&n!==keep)n.remove();});
  const sm=document.createElement('small');if(smallId)sm.id=smallId;sm.textContent=smallText;
  el.insertBefore(document.createTextNode(main),el.firstChild);
  el.insertBefore(sm,el.firstChild.nextSibling);
  stampPcKey(el);}
function paintDriveWings(){const b=document.getElementById('wng');if(!b)return;const s=document.getElementById('wngS'),hasP=typeof P!=='undefined',open=!!(hasP&&P.wings),street=!open&&hasP&&P.driveMode==='street';
  b.classList.remove('enter-car','exit-car');b.classList.toggle('open',open);b.classList.toggle('arcade',!open&&!street);b.classList.toggle('street',street);
  b.style.background='';b.style.boxShadow='';b.style.color='';if(s)s.textContent=open?'OPEN':street?'STREET':'ARCADE';}
function applyFootMode(mode){const tup=document.getElementById('tup'),nos=document.getElementById('nos'),brk=document.getElementById('brk'),wng=document.getElementById('wng');
  const can=nos&&nos.querySelector('.nfxcan');if(can)can.style.visibility=mode==='walk'?'hidden':'';
  if(mode==='walk'){if(tup){tup.classList.add('onfoot-walk');setBtnFace(tup,'WALK','HOLD');}
    if(nos){nos.classList.add('onfoot-run');setBtnFace(nos,'RUN','HOLD · ↑ JUMP');}
    if(brk){brk.classList.add('onfoot-jump');setBtnFace(brk,'JUMP','TAP');}
    if(wng){wng.classList.remove('open','arcade','street','exit-car');wng.classList.add('enter-car');setBtnFace(wng,'ENTER','CAR','wngS');}
    const pad=document.getElementById('ebpad');if(pad){pad.classList.remove('show');pad.setAttribute('aria-hidden','true');}
    B.tup=0;B.nos=0;B.brk=0;B.ebLatch=0;}
  else{if(tup){tup.classList.remove('onfoot-walk');setBtnFace(tup,'THROTTLE','HOLD');}
    if(nos){nos.classList.remove('onfoot-run');setBtnFace(nos,'NOS','HOLD');}
    if(brk){brk.classList.remove('onfoot-jump');brkAir=null;}
    if(wng){wng.classList.remove('enter-car','exit-car');
      const lead=wng.childNodes[0]&&wng.childNodes[0].nodeType===3?wng.childNodes[0].textContent:'';
      if(lead!=='WINGS')setBtnFace(wng,'WINGS','ARCADE','wngS');
      paintDriveWings();}}}
function syncOnFootButtons(){ensureEmote();ensureExitBtn();const mode=onFootNow()?'walk':'drive';
  const em=document.getElementById('emoteBtn'),wheel=document.getElementById('emoteWheel');
  if(em)em.style.display=mode==='walk'?'flex':'none';
  if(wheel&&mode!=='walk'){wheel.classList.remove('show');wheel.setAttribute('aria-hidden','true');}
  if(mode!==footMode){applyFootMode(mode);footMode=mode;}
  else if(mode==='drive')paintDriveWings();
  const W=window.WALK_MODE;if(W)W.runMode=!!(mode==='walk'&&B.run&&B.walk);
  if(mode!=='walk'){B.walk=0;B.run=0;if(!B.brk)B.jump=0;}
  paintExitBtn();
  syncEnterBldBtn();
  syncBrakeLabel();
  stampAllPcKeys();}
window.syncOnFootButtons=syncOnFootButtons;
window.syncOnFootUI=syncOnFootButtons;
function ensureEmote(){if(document.getElementById('emoteBtn'))return;
  const css=document.createElement('style');css.id='emoteCss';css.textContent=''
    +'#emoteBtn{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:25;display:none;width:min(92px,23vh);height:min(92px,23vh);border-radius:50%;border:4px solid #fff;margin:0;padding:0;'
    +'background:radial-gradient(circle at 40% 35%,#ffe9ff,#d14dff 45%,#4a0a6a);box-shadow:0 0 22px #e06bff;color:#fff;font:900 clamp(12px,3.4vh,15px) Orbitron,sans-serif;letter-spacing:.5px;'
    +'flex-direction:column;align-items:center;justify-content:center;touch-action:none;user-select:none;cursor:pointer}'
    +'#emoteBtn small{font:800 9px Rajdhani,sans-serif;letter-spacing:.5px;margin-top:2px}'
    +'#emoteBtn.held{filter:brightness(.86)}'
    +'#tup.onfoot-walk{background:radial-gradient(circle at 40% 35%,#d8ffe6,#2fd980 45%,#093822);box-shadow:0 0 18px #7dff6b;color:#042414}'
    +'#nos.onfoot-run{background:radial-gradient(circle at 40% 35%,#fff2a8,#ffb020 45%,#8a3c00);box-shadow:0 0 18px #ffe14d;color:#240c00}'
    +'#brk.onfoot-jump{background:radial-gradient(circle at 40% 35%,#c8fbff,#3ee6ff 45%,#0b6a86);box-shadow:0 0 18px #3ee6ff;color:#04202a}'
    +'#wng.enter-car,#wng.exit-car{background:radial-gradient(circle at 40% 35%,#ffe9ff,#d14dff 45%,#4a0a6a);box-shadow:0 0 18px #e06bff;color:#fff}'
    +'#emoteWheel{position:fixed;left:50%;bottom:calc(20px + min(46px,11.5vh));transform:translateX(-50%);z-index:26;display:none;width:0;height:0;pointer-events:none}'
    +'#emoteWheel.show{display:block}'
    +'#emoteWheel .emoteOpt{position:absolute;white-space:nowrap;padding:6px 10px;border-radius:999px;border:3px solid #fff;background:rgba(20,0,40,.9);color:#fff;font:900 12px Orbitron,sans-serif;box-shadow:0 0 12px #e06bff;transform:translate(-50%,-50%)}'
    +'#emoteWheel .emoteOpt.active{background:#ffe14d;color:#240c00;box-shadow:0 0 18px #ffe14d}'
    +'#emoteWheel .emoteOpt[data-dir="up"]{left:0;top:-74px}#emoteWheel .emoteOpt[data-dir="right"]{left:118px;top:0}'
    +'#emoteWheel .emoteOpt[data-dir="down"]{left:0;top:46px}#emoteWheel .emoteOpt[data-dir="left"]{left:-118px;top:0}';
  document.head.appendChild(css);
  const host=document.querySelector('.kbody')||document.body;
  const wheel=document.createElement('div');wheel.id='emoteWheel';wheel.setAttribute('aria-hidden','true');
  wheel.innerHTML=EMOTE_OPTS.map(o=>'<span class="emoteOpt" data-dir="'+o.id+'">'+o.label+'</span>').join('');
  const btn=document.createElement('button');btn.id='emoteBtn';btn.type='button';btn.innerHTML='EMOTE<small id="emoteS">HOLD · DRAG</small>';stampPcKey(btn);
  host.appendChild(wheel);host.appendChild(btn);
  let ptr=null,touchId=null,cur='',maxD=0;
  const nameOf=id=>{const o=EMOTE_OPTS.find(x=>x.id===id);return o?o.name:'';};
  const dirAt=(x,y)=>{const r=btn.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
    const flip=!!(document.getElementById('kid')&&document.getElementById('kid').classList.contains('flip180'));
    const dx=flip?(cx-x):(x-cx),dy=flip?(y-cy):(cy-y),dist=Math.hypot(dx,dy);
    if(dist>maxD)maxD=dist;if(dist<24)return '';
    if(Math.abs(dy)>=Math.abs(dx))return dy>=0?'up':'down';return dx>=0?'right':'left';};
  const paint=d=>{cur=d;wheel.querySelectorAll('.emoteOpt').forEach(n=>n.classList.toggle('active',n.getAttribute('data-dir')===d));
    const s=document.getElementById('emoteS');if(s)s.textContent=d?nameOf(d):'HOLD · DRAG';};
  const show=on=>{wheel.classList.toggle('show',on);wheel.setAttribute('aria-hidden',on?'false':'true');btn.classList.toggle('held',on);if(!on)paint('');};
  const fire=()=>{const W=window.WALK_MODE;if(cur){B.emote=cur;if(W&&typeof W.triggerEmote==='function')W.triggerEmote(cur);else if(W&&typeof W.toggleDance==='function')W.toggleDance();}
    else if(maxD<24){if(W&&typeof W.triggerEmote==='function')W.triggerEmote('tap');else if(W&&typeof W.toggleDance==='function')W.toggleDance();}};
  const start=()=>{if(!onFootNow())return false;maxD=0;cur='';show(true);paint('');return true;};
  const end=commit=>{if(btn.classList.contains('held')){if(commit)fire();show(false);}ptr=null;touchId=null;};
  btn.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||performance.now()-ebTouchAt<700)return;if(!start())return;e.preventDefault();ptr=e.pointerId;try{btn.setPointerCapture(e.pointerId);}catch(_){}});
  btn.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||ptr!==e.pointerId)return;paint(dirAt(e.clientX,e.clientY));});
  const pup=e=>{if(e.pointerType==='touch'||ptr!==e.pointerId)return;end(e.type==='pointerup');};
  btn.addEventListener('pointerup',pup);btn.addEventListener('pointercancel',pup);
  btn.addEventListener('touchstart',e=>{ebTouchAt=performance.now();if(!start())return;try{e.preventDefault();}catch(_){}
    for(const t of e.changedTouches)if(touchId==null)touchId=t.identifier;},{passive:false});
  btn.addEventListener('touchmove',e=>{for(const t of e.changedTouches)if(t.identifier===touchId){ebTouchAt=performance.now();try{e.preventDefault();}catch(_){}paint(dirAt(t.clientX,t.clientY));}},{passive:false});
  const tend=e=>{ebTouchAt=performance.now();const commit=e.type==='touchend';for(const t of e.changedTouches)if(t.identifier===touchId)end(commit);};
  btn.addEventListener('touchend',tend,{passive:false});btn.addEventListener('touchcancel',tend,{passive:false});}
function streetInCar(){return typeof P!=='undefined'&&P.driveMode==='street'&&!onFootNow();}
function paintExitBtn(){const b=document.getElementById('exitCarBtn');if(!b)return;
  const show=onFootNow()||streetInCar()||canExitCar();
  b.style.display=show?'flex':'none';
  if(show){const want=onFootNow()?'ENTER':'EXIT';
    const lead=b.childNodes[0]&&b.childNodes[0].nodeType===3?b.childNodes[0].textContent:'';
    const sub=b.querySelector('small:not(.pc-key)');
    if(!(lead===want&&sub)){const keep=b.querySelector(':scope > small.pc-key');
      b.replaceChildren(document.createTextNode(want));
      const sm=document.createElement('small');sm.textContent='CAR';b.appendChild(sm);if(keep)b.appendChild(keep);}}
  stampPcKey(b);}
function exitCarTap(){
  if(!onFootNow()&&typeof P!=='undefined'&&P.ground&&P.v<15)P.v=0;
  const W=window.WALK_MODE;if(W&&typeof W.toggleGetOut==='function')W.toggleGetOut();
  if(typeof syncOnFootButtons==='function')syncOnFootButtons();}
function ensureExitBtn(){if(document.getElementById('exitCarBtn'))return;
  const css=document.createElement('style');css.id='exitCarCss';css.textContent=''
    +'#exitCarBtn{position:absolute;top:5px;right:calc(var(--pzr, calc(21vw + 2px)) + 52px);z-index:25;display:none;'
    +'height:44px;min-width:78px;padding:0 12px;border-radius:14px;border:2.5px solid #fff;margin:0;'
    +'background:radial-gradient(circle at 40% 32%,#f4fff6,#39ff7a 38%,#ff2bd6 78%);'
    +'box-shadow:0 0 16px #7dff6b,0 0 12px #ff2bd6;color:#140018;'
    +'font:900 11px/1.05 Orbitron,sans-serif;letter-spacing:.4px;'
    +'flex-direction:column;align-items:center;justify-content:center;touch-action:none;user-select:none;cursor:pointer;-webkit-tap-highlight-color:transparent}'
    +'#exitCarBtn small{font:800 9px/1 Rajdhani,sans-serif;letter-spacing:.6px;margin-top:1px}';
  document.head.appendChild(css);
  const host=document.querySelector('.kbody')||document.body;
  const btn=document.createElement('button');btn.id='exitCarBtn';btn.type='button';btn.setAttribute('aria-label','Exit or enter car');
  btn.appendChild(document.createTextNode('EXIT'));
  const sm=document.createElement('small');sm.textContent='CAR';btn.appendChild(sm);
  const menu=document.getElementById('kMenuB');
  if(menu&&menu.parentElement===host)host.insertBefore(btn,menu);else host.appendChild(btn);
  let lock=0;
  const fire=()=>{const n=performance.now();if(n-lock<280)return;lock=n;exitCarTap();};
  btn.addEventListener('pointerup',e=>{if(e.pointerType==='touch'||performance.now()-ebTouchAt<700)return;e.preventDefault();fire();});
  btn.addEventListener('touchend',e=>{ebTouchAt=performance.now();try{e.preventDefault();}catch(_){}fire();},{passive:false});
  btn.addEventListener('click',e=>{if(performance.now()-ebTouchAt<700)return;e.preventDefault();fire();});}
function buildingSpot(W){
  if(!W)return false;
  if(typeof W.canEnterBuilding==='function')return !!W.canEnterBuilding();
  const hasP=typeof P!=='undefined'&&!!P;
  const grounded=hasP&&P.ground&&!P.wreck;
  const garageOk=!!(W.onFoot||(grounded&&P.v<10));
  let park=W.parking||null;
  if(!park&&garageOk&&typeof W.activeParking==='function'&&hasP)park=W.activeParking(P.x,P.z);
  if(park&&garageOk)return true;
  const doorLim=W.onFoot?10:12;
  const doorOk=!!(W.onFoot||(grounded&&P.v<8));
  let door=W.door;
  if(!(door&&door.dist<=doorLim)&&doorOk&&typeof W.nearestDoor==='function')door=W.nearestDoor(12);
  if(!(door&&door.dist<=doorLim&&doorOk))return false;
  const x=W.onFoot?W.x:(hasP?P.x:0),z=W.onFoot?W.z:(hasP?P.z:0);
  return (x-(door.x||0))*(door.nx||0)+(z-(door.z||0))*(door.nz||0)>=-2;
}
function paintEnterFace(b,inside){
  const want=inside?'🚪 EXIT':'🚪 ENTER';
  b.classList.toggle('is-inside',inside);
  const lead=b.childNodes[0]&&b.childNodes[0].nodeType===3?b.childNodes[0].textContent:'';
  const sub=b.querySelector('small:not(.pc-key)');
  if(!(lead===want&&sub&&sub.textContent==='BUILDING')){const keep=b.querySelector(':scope > small.pc-key');
    b.replaceChildren(document.createTextNode(want));
    const sm=document.createElement('small');sm.textContent='BUILDING';b.appendChild(sm);if(keep)b.appendChild(keep);}
  stampPcKey(b);
}
function syncEnterBldBtn(){ensureEnterBldBtn();installSafeEnter();
  const b=document.getElementById('enterBldBtn');if(!b)return;
  const W=window.WALK_MODE;
  if(W&&W.insideBuilding){b.style.display='flex';paintEnterFace(b,true);return;}
  const show=!!(W&&buildingSpot(W));
  b.style.display=show?'flex':'none';
  if(show)paintEnterFace(b,false);else b.classList.remove('is-inside');
}
window.syncEnterBldBtn=syncEnterBldBtn;
// Garage hub installs enterDoor as a getter, then the dance stage assigns a wrapper
// back through that setter. The two wrappers call each other. Put a plain function
// on the object so a later wrap captures this one and the tap can enter.
function safeEnterDoor(){
  const W=(this&&typeof this.nearestDoor==='function')?this:window.WALK_MODE;
  if(!W||typeof P==='undefined')return false;
  if(!W.onFoot&&typeof W._holdParking==='function')W._holdParking();
  const park=!W.onFoot&&W.parking;
  let door=W.onFoot&&W.door&&(W.door.dist<WALK_PILL_M||W.door.garage)?W.door:null;
  if(!door&&park)door=park.door;
  if(!door&&typeof W.nearestDoor==='function')door=W.nearestDoor(WALK_PILL_M);
  if(!door)return false;
  if(!park&&!(door.dist<WALK_PILL_M))return false;
  if(!W.onFoot&&door.purpose!=='SKY_DROP'&&!park)return false;
  W.door=door;
  try{walkAct(door);}catch(e){return false;}
  if(typeof WALK_INDOOR!=='undefined'&&WALK_INDOOR[door.purpose]){W.insideBuilding=true;W.insideDoor=door;if(typeof walkShowInterior==='function')walkShowInterior(door);}
  else{W.insideBuilding=false;W.insideDoor=null;if(typeof walkHideInterior==='function')walkHideInterior();}
  if(typeof walkSyncPill==='function')walkSyncPill();
  if(typeof walkSyncGait==='function')walkSyncGait();
  if(typeof walkSyncDyn==='function')walkSyncDyn();
  return true;
}
function installSafeEnter(){
  const W=window.WALK_MODE;if(!W||W.__enterSafe||W.__walkEnterLocked)return;
  const desc=Object.getOwnPropertyDescriptor(W,'enterDoor');
  if(desc&&desc.get){
    safeEnterDoor._bld=1;
    Object.defineProperty(W,'enterDoor',{configurable:true,enumerable:true,writable:true,value:safeEnterDoor});
  }
  W.__enterSafe=1;
}
function enterBldTap(){
  installSafeEnter();
  const W=window.WALK_MODE;if(!W)return;
  if(W.insideBuilding){
    if(window.DANCE_STAGE&&typeof window.DANCE_STAGE.close==='function'){try{window.DANCE_STAGE.close();}catch(e){}}
    if(window.NEON_PAINT&&typeof window.NEON_PAINT.closeStudio==='function'){try{window.NEON_PAINT.closeStudio();}catch(e){}}
    if(typeof W.stepBackOutside==='function')W.stepBackOutside();
  }else if(buildingSpot(W)&&typeof W.enterDoor==='function')W.enterDoor();
  if(typeof syncOnFootButtons==='function')syncOnFootButtons();
}
function ensureEnterBldBtn(){if(document.getElementById('enterBldBtn'))return;
  const css=document.createElement('style');css.id='enterBldCss';css.textContent=''
    +'#enterBldBtn{position:fixed;top:5px;right:calc(50% + 66px);z-index:95;display:none;'
    +'height:44px;min-width:98px;padding:3px 12px;border-radius:14px;border:2.5px solid #fff;margin:0;'
    +'background:radial-gradient(circle at 40% 32%,#f4fff6,#39ff7a 38%,#ff2bd6 78%);'
    +'box-shadow:0 0 16px #7dff6b,0 0 12px #ff2bd6;color:#140018;'
    +'font:900 11px/1.05 Orbitron,sans-serif;letter-spacing:.4px;'
    +'flex-direction:column;align-items:center;justify-content:center;touch-action:none;user-select:none;cursor:pointer;-webkit-tap-highlight-color:transparent}'
    +'#enterBldBtn small{font:800 9px/1 Rajdhani,sans-serif;letter-spacing:.6px;margin-top:1px}'
    +'#enterBldBtn.is-inside{border-color:#ff4fd8;background:radial-gradient(circle at 40% 32%,#ffe9ff,#ff4fd8 46%,#ffb020 82%);'
    +'box-shadow:0 0 18px #ff4fd8,0 0 10px #ffb020;color:#240014}';
  document.head.appendChild(css);
  const host=document.body||document.querySelector('.kbody');
  const btn=document.createElement('button');btn.id='enterBldBtn';btn.type='button';btn.setAttribute('aria-label','Enter or exit building');
  btn.appendChild(document.createTextNode('🚪 ENTER'));
  const sm=document.createElement('small');sm.textContent='BUILDING';btn.appendChild(sm);
  host.appendChild(btn);
  let lock=0;
  const fire=()=>{const n=performance.now();if(n-lock<280)return;lock=n;enterBldTap();};
  btn.addEventListener('pointerup',e=>{if(e.pointerType==='touch'||performance.now()-ebTouchAt<700)return;e.preventDefault();fire();});
  btn.addEventListener('touchend',e=>{ebTouchAt=performance.now();try{e.preventDefault();}catch(_){}fire();},{passive:false});
  btn.addEventListener('click',e=>{if(performance.now()-ebTouchAt<700)return;e.preventDefault();fire();});}
let brkAir=false;
function syncBrakeLabel(){const el=document.getElementById('brk');if(!el)return;
  if(onFootNow()){brkAir=null;stampPcKey(el);return;}
  const air=typeof P!=='undefined'&&P.y>0.15;
  if(brkAir!==air){brkAir=air;
    if(air)setBtnFace(el,'AIR','BRAKE');
    else{const can=el.querySelector('.nfxcan'),keep=el.querySelector(':scope > small.pc-key');[...el.childNodes].forEach(n=>{if(n!==can&&n!==keep)n.remove();});el.insertBefore(document.createTextNode('BRAKE'),el.firstChild);}}
  stampPcKey(el);}
function footLoop(){try{syncOnFootButtons();}catch(e){}requestAnimationFrame(footLoop);}
if(document.getElementById('wng')){ensureEmote();ensureExitBtn();ensureEnterBldBtn();syncOnFootButtons();requestAnimationFrame(footLoop);}
// PC keyboard: W/↑ throttle, S/↓ brake, Space e-brake, G mode, C car, Esc/P pause, 1-4 emotes.
// F wings and Shift NOS already exist. Labels stay off touch screens.
addEventListener('keydown',e=>{
  if(!isDesktopPC()||e.repeat)return;
  const tag=e.target&&e.target.tagName;if(tag==='INPUT'||tag==='TEXTAREA'||(e.target&&e.target.isContentEditable))return;
  if(e.code==='KeyC'){if(onFootNow()||streetInCar()||canExitCar()){e.preventDefault();exitCarTap();}return;}
  if(e.code==='Escape'||e.code==='KeyP'){
    if(window.GARAGE_HOME_HUB&&GARAGE_HOME_HUB.isOpen)return;
    const home=document.getElementById('kHome');if(!home||typeof kPause!=='function')return;
    e.preventDefault();kPause(!!home.classList.contains('hidden'));return;}
  if(!onFootNow()||!/^Digit[1-4]$/.test(e.code))return;
  const id=['up','right','down','left'][Number(e.code.slice(5))-1];
  const W=window.WALK_MODE;if(!W)return;
  if(typeof W.triggerEmote==='function')W.triggerEmote(id);else if(typeof W.toggleDance==='function')W.toggleDance();
});
function installPcKeys(){if(installPcKeys.done||typeof window.input!=='function')return;installPcKeys.done=1;
  const base=window.input;
  window.input=function(){const pc=isDesktopPC(),foot=onFootNow();let heldSpace=0;
    if(pc&&!foot&&K.Space){heldSpace=1;K.Space=0;}
    const r=base();
    if(heldSpace)K.Space=1;
    if(!pc||foot){if(B._pcSpace){B._pcSpace=0;if(!B.brk)B.ebLatch=0;}return r;}
    if(K.KeyW||K.ArrowUp)r.tu=1;
    if(K.KeyS||K.ArrowDown)r.brk=1;
    if(K.Space){r.eb=1;B.ebLatch=1;B._pcSpace=1;}
    else if(B._pcSpace){B._pcSpace=0;if(!B.brk)B.ebLatch=0;r.eb=B.ebLatch?1:0;}
    return r;};
  if(typeof window.streetThrottle==='function'&&!window.streetThrottle._pc){const orig=window.streetThrottle;
    const wrapped=function(){return orig()||(isDesktopPC()&&!onFootNow()&&!!(K.KeyW||K.ArrowUp));};
    wrapped._pc=1;window.streetThrottle=wrapped;}}
if(document.readyState==='loading')addEventListener('DOMContentLoaded',installPcKeys);else installPcKeys();
addEventListener('load',installPcKeys);
