'use strict';
// ===== CAMERA / PROJECTION =====
const cv=document.getElementById('c'),ctx=cv.getContext('2d');let W=0,H=0,DPR=1;
// Desktop PCs fill a huge backing store (often 1080p at devicePixelRatio 2) and the
// 2D city cannot keep up. Cap that buffer only. Phones keep the exact sizing below.
// iPad (touch, including 1180×820 and 1366×1024) is not a desktop PC: hasTouch is
// true, so isDesktopPC stays false. Its own cap is 1440×1080 at DPR 1, CSS-scaled
// to the screen. W and H stay the canvas logical size (HUD + projection).
// Pointer handlers keep using clientX / clientY and getBoundingClientRect, which are
// CSS viewport pixels, so a smaller buffer does not shift look-around or HUD hits.
// The canvas CSS stays width/height 100% (iPad also sets that size in px).
// ipadBoost stays 1 unless an iPad's measured frame time misses ~55fps.
// Phones, desktops, and an iPad already near 60 never take a step down.
let ipadSized=false,ipadBoost=1,ipadStepI=0,ipadEma=0.016,ipadWarm=0,ipadBad=0,ipadGood=0,ipadCool=0,ipadProbe=0,ipadProbeBase=0,ipadProbeUp=0,ipadLock=99,ipadClimbHold=0,ipadSettle=0,ipadProbeSum=0,ipadProbeN=0,ipadAnchor=0;
const IPAD_LADDER=[1,0.84,0.70,0.58,0.48,0.38];
function resize(reason){
  const hasTouch=('ontouchstart' in window)||(navigator.maxTouchPoints>0);
  const isDesktopPC=!hasTouch&&innerWidth>1024;
  const isIPadUA=/iPad/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const shortSide=Math.min(innerWidth,innerHeight),longSide=Math.max(innerWidth,innerHeight);
  const isIPad=hasTouch&&(isIPadUA||(shortSide>=680&&longSide>=900));
  if(isIPad){
    DPR=1;
    const cap=1440*1080,area=innerWidth*innerHeight||1;
    const scale=Math.min(1,Math.sqrt(cap/area))*ipadBoost;
    W=Math.max(1,Math.round(innerWidth*scale));H=Math.max(1,Math.round(innerHeight*scale));
    if(W*H>cap){const fit=Math.sqrt(cap/(W*H));W=Math.max(1,Math.floor(W*fit));H=Math.max(1,Math.floor(H*fit));}
    cv.style.width=innerWidth+'px';cv.style.height=innerHeight+'px';
    ipadSized=true;
  }else if(!isDesktopPC){
    const plan=(typeof zResPlan==='function')?zResPlan():null;
    if(plan&&plan.mode==='phone'){DPR=plan.dpr;W=plan.W;H=plan.H;}
    else{
      DPR=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;
      const area=W*H||1,cap=1440*1080;
      if(area*DPR*DPR>cap)DPR=Math.sqrt(cap/area);
    }
    if(ipadSized){cv.style.width='';cv.style.height='';ipadSized=false;}
  }else{
    DPR=1;
    const cap=1280*720,area=innerWidth*innerHeight||1;
    const scale=Math.min(1,Math.sqrt(cap/area));
    W=Math.round(innerWidth*scale);H=Math.round(innerHeight*scale);
    if(W*H>cap){const fit=Math.sqrt(cap/(W*H));W=Math.max(1,Math.floor(W*fit));H=Math.max(1,Math.floor(H*fit));}
    if(ipadSized){cv.style.width='';cv.style.height='';ipadSized=false;}
  }
  let bw=Math.max(1,Math.round(W*DPR)),bh=Math.max(1,Math.round(H*DPR));
  if(!isIPad&&!isDesktopPC&&typeof zResPlan==='function'){const plan=zResPlan();if(plan.mode==='phone'){bw=plan.bufW;bh=plan.bufH;DPR=plan.dpr;}}
  if(cv.width!==bw||cv.height!==bh){cv.width=bw;cv.height=bh;}
  ctx.setTransform(DPR,0,0,DPR,0,0);
  if(typeof zResAfter==='function')zResAfter(typeof reason==='string'?reason:'resize');
}
function ipadScale(){return {boost:ipadBoost,step:ipadStepI,ema:+ipadEma.toFixed(4),lock:ipadLock};}
function ipadPause(s){
  ipadSettle=Math.max(0,+s||0);ipadBad=0;ipadGood=0;ipadProbe=0;ipadProbeUp=0;
  ipadProbeSum=0;ipadProbeN=0;ipadEma=0.016;ipadWarm=1.3;
}
function ipadApply(i){
  i=Math.max(0,Math.min(IPAD_LADDER.length-1,i|0));
  ipadStepI=i;ipadBoost=IPAD_LADDER[i];ipadBad=0;ipadGood=0;ipadCool=0.6;
  resize();
}
function ipadArmProbe(){ipadProbe=1.15;ipadProbeSum=0;ipadProbeN=0;}
// Wall-clock seconds for one frame. Drops the internal buffer only while this iPad
// stays slower than ~18.5ms, and only when the drop actually shortens the frame.
// A step that does not help is not the end of the search: smaller buffers are
// still scored against the last size that did help. The search runs once, then
// that size stays, so the picture does not flicker. Quality climbs only while frames are
// comfortably under 13.5ms, and a climb that misses 60 is undone.
function ipadFit(frame){
  if(!ipadSized){
    if(ipadStepI||ipadBoost!==1){ipadStepI=0;ipadBoost=1;ipadLock=99;ipadProbe=0;ipadProbeUp=0;ipadBad=0;ipadGood=0;resize();}
    return;
  }
  if(!(frame>0)||frame>0.25)return;
  ipadWarm+=frame;
  ipadEma+=(frame-ipadEma)*0.15;
  if(ipadWarm<1.3)return;
  if(ipadSettle>0){ipadSettle-=frame;return;}
  if(ipadClimbHold>0)ipadClimbHold-=frame;
  if(ipadCool>0){ipadCool-=frame;return;}
  if(ipadProbe>0){
    ipadProbe-=frame;
    // The resize itself is not the new frame time. Score only the back half.
    if(ipadProbe<0.90){ipadProbeSum+=frame;ipadProbeN++;}
    if(ipadProbe<=0&&ipadProbeN>0){
      const avg=ipadProbeSum/ipadProbeN;
      ipadEma=avg;
      if(ipadProbeUp){
        ipadProbeUp=0;
        if(avg>0.017){ipadApply(ipadStepI+1);ipadClimbHold=6;}
      }else if(avg<=ipadProbeBase*0.90){
        // Faster. Stop once a frame fits under ~18.5ms so a medium iPad
        // does not keep shrinking after the picture is already smooth.
        ipadProbeBase=avg;ipadAnchor=ipadStepI;ipadEma=avg;
        if(avg>0.0185&&ipadStepI<IPAD_LADDER.length-1&&ipadStepI<ipadLock){ipadApply(ipadStepI+1);ipadArmProbe();}
        else ipadLock=ipadStepI;
      }else if(ipadProbeBase>0.0185&&ipadStepI<IPAD_LADDER.length-1&&ipadStepI<ipadLock){
        // A weak rung does not hide a smaller buffer that would actually help.
        ipadApply(ipadStepI+1);ipadArmProbe();
      }else{
        ipadLock=ipadAnchor;ipadEma=ipadProbeBase;ipadApply(ipadAnchor);
      }
    }
    return;
  }
  if(ipadEma>0.0185&&ipadStepI<IPAD_LADDER.length-1&&ipadStepI<ipadLock){
    ipadBad+=frame;ipadGood=0;
    if(ipadBad>0.7){ipadProbeBase=ipadEma;ipadProbeUp=0;ipadAnchor=ipadStepI;ipadApply(ipadStepI+1);ipadArmProbe();ipadBad=0;}
  }else if(ipadEma<0.0135&&ipadStepI>0&&ipadClimbHold<=0){
    ipadGood+=frame;ipadBad=0;
    if(ipadGood>1.6){ipadLock=99;ipadProbeUp=1;ipadProbeBase=ipadEma;ipadApply(ipadStepI-1);ipadArmProbe();ipadGood=0;}
  }else{
    ipadBad=Math.max(0,ipadBad-frame);
    ipadGood=Math.max(0,ipadGood-frame*0.25);
  }
}
addEventListener('resize',()=>resize('resize'));resize('parse');
if(typeof zResListen==='function')zResListen();
const cam={x:0,y:0,z:0,yaw:0,pitch:0,roll:0};
// Flight pull-up damping. boot.js aims the chase cam with the raw nose pitch, which
// drops the camera under the car on a sharp climb and shoves the city off the bottom.
// The first projection of each frame rewrites that pose with a softened climb angle.
// The Z sprite still reads the real P.pitch, and flight physics are untouched.
let CAM_CLIMB_P=0,camFrameN=0,camStabN=-1,camStabT=0;
// Street look publishes into these. FLYCAM.orbit stays null: boot.js orbits with +sin
// and a hardcoded aim height, which parks the camera in front of the Z.
let camLookOn=false,camLookAz=0,camLookElDelta=0,camSeatedFoot=false;
function camOnFoot(){
  return typeof WALK_MODE!=='undefined'&&WALK_MODE&&WALK_MODE.onFoot&&!WALK_MODE.insideBuilding;
}
function camSyncDist(onFoot){
  if(typeof ZV==='undefined'||!ZV)return;
  if(onFoot)ZV.camDist=Math.max(4,Math.hypot(cam.x-P.x,cam.y-(P.y+(ZV.ty||0.6)),cam.z-P.z));
  else ZV.camDist=Math.hypot((typeof FLYCAM!=='undefined'&&FLYCAM.back)||10,(typeof FLYCAM!=='undefined'&&FLYCAM.up)||2);
}
function camSeatFoot(){
  const wx=Number.isFinite(WALK_MODE.x)?WALK_MODE.x:P.x;
  const wy=Number.isFinite(WALK_MODE.y)?WALK_MODE.y:(P.y||0);
  const wz=Number.isFinite(WALK_MODE.z)?WALK_MODE.z:P.z;
  const wyaw=Number.isFinite(WALK_MODE.yaw)?WALK_MODE.yaw:(P.yaw||0);
  const back=4.5,ty=wy+1.10;
  cam.x=wx-Math.sin(wyaw)*back;
  cam.z=wz-Math.cos(wyaw)*back;
  cam.y=Math.max(0.8,wy+1.85);
  const lx=wx-cam.x,ly=ty-cam.y,lz=wz-cam.z;
  cam.yaw=Math.atan2(lx,lz);cam.pitch=Math.atan2(-ly,Math.hypot(lx,lz));cam.roll=0;
  camSyncDist(true);
}
function camSeatChase(aim){
  if(camOnFoot()){camSeatFoot();return;}
  const back=(typeof FLYCAM!=='undefined'&&FLYCAM.back)||10;
  const up=(typeof FLYCAM!=='undefined'&&FLYCAM.up)||2;
  const ty=P.y+((typeof ZV!=='undefined'&&ZV.ty)||0.6);
  const eff=CAM_CLIMB_P,cp=Math.cos(eff);
  const D0=Math.hypot(back,up);
  let dx=-Math.sin(aim)*cp*back,dy=-Math.sin(eff)*back+up,dz=-Math.cos(aim)*cp*back;
  const len=Math.hypot(dx,dy,dz)||1,kk=D0/len;dx*=kk;dy*=kk;dz*=kk;
  let cy=ty+dy;
  if(cy<1){cy=1;const dyA=cy-ty,horiz=Math.sqrt(Math.max(0,D0*D0-dyA*dyA));dx=-Math.sin(aim)*horiz;dz=-Math.cos(aim)*horiz;}
  cam.x=P.x+dx;cam.y=cy;cam.z=P.z+dz;
  const lx=P.x-cam.x,ly=ty-cam.y,lz=P.z-cam.z;
  cam.yaw=Math.atan2(lx,lz);cam.pitch=Math.atan2(-ly,Math.hypot(lx,lz));cam.roll=0;
  camSyncDist(false);
}
function camStabilizeFlightPitch(){
  if(typeof P==='undefined'||!P)return;
  const onFoot=camOnFoot();
  // A real orbit (not street look, not the on-foot follow) is someone else's camera.
  if(typeof FLYCAM!=='undefined'&&FLYCAM.orbit&&!camLookOn&&!onFoot)return;
  if((camLookOn||onFoot)&&typeof FLYCAM!=='undefined')FLYCAM.orbit=null;
  if(camStabN!==camFrameN){
    const now=performance.now();
    const dt=camStabT?Math.min(0.5,Math.max(0,(now-camStabT)/1000)):1/60;
    camStabT=now;camStabN=camFrameN;
    const maxUp=9*Math.PI/180;
    const climb=!P.ground&&!P.loop&&P.pitch>0;
    const target=climb?Math.min(P.pitch*0.22,maxUp):P.pitch;
    const k=1-Math.exp(-(dt||1/60)/0.18);
    CAM_CLIMB_P+=(target-CAM_CLIMB_P)*k;
    let aim=P.yaw;
    if(!onFoot&&!camLookOn&&(P.ebK||0)>0.02){const dh=Math.atan2(Math.sin((P.hd||0)-P.yaw),Math.cos((P.hd||0)-P.yaw));aim=P.yaw+dh*P.ebK;}
    if(onFoot){camSeatFoot();camSeatedFoot=true;}
    else{camSeatChase(aim);camSeatedFoot=false;}
  }else if(onFoot){
    camSeatFoot();camSeatedFoot=true;
  }else if(camLookOn||camSeatedFoot){
    // boot.js rewrites the chase pose at the start of render. Put it back behind the car,
    // including the frame she climbs back into the seat.
    camSeatChase(P.yaw);camSeatedFoot=false;
  }
  if(camLookOn){
    // Head pan only. On foot she stays in front of the rig, back toward the lens.
    cam.yaw=camWrap(cam.yaw+camLookAz);
    cam.pitch=clamp(cam.pitch-camLookElDelta,-0.45,0.35);
  }
}
function camS(x,y,z){camStabilizeFlightPitch();let dx=x-cam.x,dy=y-cam.y,dz=z-cam.z;
  const cy=Math.cos(cam.yaw),sy=Math.sin(cam.yaw);let X=dx*cy-dz*sy,Z=dx*sy+dz*cy;
  const cp=Math.cos(-cam.pitch),sp=Math.sin(-cam.pitch);let Y=dy*cp-Z*sp;Z=dy*sp+Z*cp;
  const cr=Math.cos(cam.roll),sr=Math.sin(cam.roll);return[X*cr-Y*sr,X*sr+Y*cr,Z];}
const NEAR=0.5;function scr(c){const f=H*0.9;return[W/2+c[0]*f/c[2],H/2-c[1]*f/c[2],c[2]];}
// A segment that crosses the near plane interpolates a point at z=NEAR. That point's
// screen position runs away to tens of thousands of pixels and the stroke comes back
// as a floating shard. Keep the visible piece and cut it to a pad just outside the
// canvas so the stroke of the cut itself never lands on screen.
function clip2d(x1,y1,x2,y2){
  const pad=12,xmin=-pad,ymin=-pad,xmax=W+pad,ymax=H+pad;
  const code=(x,y)=>{let c=0;if(x<xmin)c|=1;else if(x>xmax)c|=2;if(y<ymin)c|=4;else if(y>ymax)c|=8;return c;};
  let c1=code(x1,y1),c2=code(x2,y2);
  for(let n=0;n<8;n++){
    if(!(c1|c2))return[x1,y1,x2,y2];
    if(c1&c2)return null;
    const c=c1||c2,dx=x2-x1,dy=y2-y1;let x,y;
    if(c&8){if(!dy)return null;const t=(ymax-y1)/dy;x=x1+dx*t;y=ymax;}
    else if(c&4){if(!dy)return null;const t=(ymin-y1)/dy;x=x1+dx*t;y=ymin;}
    else if(c&2){if(!dx)return null;const t=(xmax-x1)/dx;y=y1+dy*t;x=xmax;}
    else{if(!dx)return null;const t=(xmin-x1)/dx;y=y1+dy*t;x=xmin;}
    if(!isFinite(x)||!isFinite(y))return null;
    if(c1){x1=x;y1=y;c1=code(x1,y1);}else{x2=x;y2=y;c2=code(x2,y2);}
  }
  return null;
}
function nearSeg(p,q){
  if(p[2]<NEAR&&q[2]<NEAR)return null;
  let a=p,b=q,cut=false;
  if(a[2]<NEAR||b[2]<NEAR){
    const dz=b[2]-a[2];
    if(dz>-1e-8&&dz<1e-8)return null;
    const t=(NEAR-a[2])/dz;
    if(!(t>=0&&t<=1))return null;
    const m=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,NEAR];
    if(a[2]<NEAR)a=m;else b=m;
    cut=true;
  }
  if(!(a[2]>=NEAR)||!(b[2]>=NEAR))return null;
  const f=H*0.9,x1=W/2+a[0]*f/a[2],y1=H/2-a[1]*f/a[2],x2=W/2+b[0]*f/b[2],y2=H/2-b[1]*f/b[2];
  if(!isFinite(x1)||!isFinite(y1)||!isFinite(x2)||!isFinite(y2))return null;
  const pad=12;
  if(cut||x1<-pad||y1<-pad||x1>W+pad||y1>H+pad||x2<-pad||y2<-pad||x2>W+pad||y2>H+pad)return clip2d(x1,y1,x2,y2);
  return[x1,y1,x2,y2];
}
function proj(x,y,z){
  // boot.js samples the horizon from the chase cam it just wrote. Retarget that
  // one far point onto the stabilized camera so the sky line matches the city.
  const ox=cam.x,oy=cam.y,oz=cam.z,oyaw=cam.yaw;
  camStabilizeFlightPitch();
  const hx=ox+Math.sin(oyaw)*1e5,hz=oz+Math.cos(oyaw)*1e5;
  if(Math.abs(x-hx)<2&&Math.abs(z-hz)<2&&Math.abs(y-oy)<2){x=cam.x+Math.sin(cam.yaw)*1e5;y=cam.y;z=cam.z+Math.cos(cam.yaw)*1e5;}
  const c=camS(x,y,z);return c[2]<NEAR?null:scr(c);
}
function line(a,b,col,w){const s=nearSeg(camS(...a),camS(...b));if(!s)return;
  ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(s[0],s[1]);ctx.lineTo(s[2],s[3]);ctx.stroke();}
// yaw convention: heading vector (sin yaw, cos yaw) in x,z

// Street-mode LOOK AROUND. The chase rig stays behind the car (same pose as boot.js).
// az / el only pan and pitch the camera head, clamped so a drag cannot orbit around
// to the nose. FLYCAM.orbit stays null: boot's orbit branch uses +sin and ty = P.y+0.6,
// which frames the front of the Z and lifts it off its shadow.
// Hold and drag the upper canvas (clear of the HUD buttons), or call beginDrag / moveDrag
// from the LOOK AROUND control. After release the view holds (holdMs, default 1.2s), then
// az eases back to 0 and the chase cam returns. Double-tap, leaving street mode, or leaving
// the ground skips the hold and eases home the same way.
const CAM_EL0=0.18,CAM_EL_MIN=0.04,CAM_EL_MAX=0.85,CAM_DIST=10.2,CAM_AZ_MAX=0.65,CAM_SENS_X=0.0075,CAM_SENS_Y=0.004,CAM_PAN_TAU=0.05,CAM_SLOP=6;
function camWrap(a){return Math.atan2(Math.sin(a),Math.cos(a));}
function camStreet(){return typeof P!=='undefined'&&P.driveMode==='street'&&!!P.ground;}
const CAM_LOOK={
  active:false,az:0,el:CAM_EL0,d:CAM_DIST,dragLook:false,holdMs:1200,
  _on:true,_armed:false,_panning:false,_ptr:null,_x:0,_y:0,_x0:0,_y0:0,_moved:0,_downT:0,_lastTap:0,_gAz:0,_gEl:CAM_EL0,_easeAt:0,_fast:false,
  enableStreetDragLook(on){this._on=!!on;if(!this._on&&(this._armed||this._ptr!=null))this.endDrag();},
  beginDrag(x,y){
    if(!camStreet()||!Number.isFinite(x)||!Number.isFinite(y))return false;
    this._armed=true;this._panning=false;this.dragLook=true;this._moved=0;
    this._x=this._x0=x;this._y=this._y0=y;this._downT=performance.now();
    this._gAz=this.az;this._gEl=this.el;this._easeAt=0;this._fast=false;
    return true;
  },
  moveDrag(x,y){
    if(!this._armed||!Number.isFinite(x)||!Number.isFinite(y))return false;
    const dx=x-this._x,dy=y-this._y;
    this._moved=Math.hypot(x-this._x0,y-this._y0);
    if(!camStreet()){this.dragLook=false;this._armed=false;this._panning=false;this._ptr=null;if(this.active)this._easeAt=performance.now();return false;}
    if(this._moved<CAM_SLOP&&!this._panning)return true;
    this._panning=true;this._x=x;this._y=y;
    this._gAz=clamp(this._gAz+dx*CAM_SENS_X,-CAM_AZ_MAX,CAM_AZ_MAX);
    this._gEl=clamp(this._gEl-dy*CAM_SENS_Y,CAM_EL_MIN,CAM_EL_MAX);
    camLookFollow(0.12);
    return true;
  },
  endDrag(){
    const now=performance.now(),was=this._armed,moved=this._moved,dur=now-(this._downT||now);
    this._armed=false;this._panning=false;this.dragLook=false;this._ptr=null;
    const tap=was&&moved<16&&dur<320;
    if(tap&&now-this._lastTap<380){this._lastTap=0;this._fast=true;if(this.active)this._easeAt=now;return;}
    if(tap)this._lastTap=now;
    if(!this.active)return;
    this.az=this._gAz;this.el=clamp(this._gEl,CAM_EL_MIN,CAM_EL_MAX);this.d=CAM_DIST;camLookPublish();
    this._fast=false;this._easeAt=now+Math.max(0,+this.holdMs||0);
  }
};
function camLookPublish(){
  CAM_LOOK.az=clamp(CAM_LOOK.az,-CAM_AZ_MAX,CAM_AZ_MAX);
  CAM_LOOK._gAz=clamp(CAM_LOOK._gAz,-CAM_AZ_MAX,CAM_AZ_MAX);
  CAM_LOOK.el=clamp(CAM_LOOK.el,CAM_EL_MIN,CAM_EL_MAX);CAM_LOOK.d=CAM_DIST;CAM_LOOK.active=true;
  CAM_LOOK.orbit={az:CAM_LOOK.az,el:CAM_LOOK.el,d:CAM_DIST};
  camLookOn=true;camLookAz=CAM_LOOK.az;camLookElDelta=CAM_LOOK.el-CAM_EL0;
  if(typeof FLYCAM!=='undefined')FLYCAM.orbit=null;
}
function camLookClear(){
  CAM_LOOK.az=0;CAM_LOOK.el=CAM_EL0;CAM_LOOK.d=CAM_DIST;CAM_LOOK._gAz=0;CAM_LOOK._gEl=CAM_EL0;
  CAM_LOOK.active=false;CAM_LOOK.dragLook=false;CAM_LOOK._easeAt=0;CAM_LOOK._fast=false;CAM_LOOK._panning=false;
  CAM_LOOK.orbit=null;camLookOn=false;camLookAz=0;camLookElDelta=0;
  if(typeof FLYCAM!=='undefined')FLYCAM.orbit=null;
}
function camLookFollow(dt){
  const k=1-Math.exp(-Math.max(0.016,dt)/CAM_PAN_TAU);
  CAM_LOOK.az=clamp(CAM_LOOK.az+(CAM_LOOK._gAz-CAM_LOOK.az)*k,-CAM_AZ_MAX,CAM_AZ_MAX);
  CAM_LOOK.el=clamp(CAM_LOOK.el+(CAM_LOOK._gEl-CAM_LOOK.el)*k,CAM_EL_MIN,CAM_EL_MAX);
  camLookPublish();
}
function camLookUpper(x,y){
  const r=cv.getBoundingClientRect();
  if(x<r.left||x>r.right||y<r.top||y>r.bottom)return false;
  const ids=['brk','wng','tup','nos'];let band=r.top+r.height*0.62;
  for(const id of ids){const n=document.getElementById(id);if(!n)continue;const b=n.getBoundingClientRect();if(b.height>2)band=Math.min(band,b.top-6);}
  if(y>=band)return false;
  for(const id of ['brk','wng','tup','nos','ebpad','kMenuB']){const n=document.getElementById(id);if(!n)continue;const b=n.getBoundingClientRect();if(b.width<2||b.height<2)continue;if(x>=b.left-8&&x<=b.right+8&&y>=b.top-8&&y<=b.bottom+8)return false;}
  return true;
}
cv.addEventListener('pointerdown',e=>{
  if(!CAM_LOOK._on||!camStreet()||(e.button!=null&&e.button!==0))return;
  if(!camLookUpper(e.clientX,e.clientY))return;
  CAM_LOOK._ptr=e.pointerId;
  if(!CAM_LOOK.beginDrag(e.clientX,e.clientY)){CAM_LOOK._ptr=null;return;}
  try{e.preventDefault();cv.setPointerCapture(e.pointerId);}catch(_){}
});
cv.addEventListener('pointermove',e=>{if(CAM_LOOK._ptr==null||e.pointerId!==CAM_LOOK._ptr)return;CAM_LOOK.moveDrag(e.clientX,e.clientY);});
function camLookPtrUp(e){if(CAM_LOOK._ptr==null||e.pointerId!==CAM_LOOK._ptr)return;CAM_LOOK._ptr=null;CAM_LOOK.endDrag();}
cv.addEventListener('pointerup',camLookPtrUp);cv.addEventListener('pointercancel',camLookPtrUp);
let camLookT=performance.now();
function camLookTick(t){
  camFrameN++;
  const dt=Math.min(0.05,Math.max(0,(t-camLookT)/1000));camLookT=t;
  try{
    if((CAM_LOOK.active||CAM_LOOK.dragLook)&&!camStreet()){
      CAM_LOOK.dragLook=false;CAM_LOOK._armed=false;CAM_LOOK._panning=false;CAM_LOOK._ptr=null;
      if(CAM_LOOK.active)CAM_LOOK._easeAt=Math.min(CAM_LOOK._easeAt||t,t);
    }
    if(CAM_LOOK.dragLook&&CAM_LOOK._panning)camLookFollow(dt||1/60);
    else if(CAM_LOOK.active&&!CAM_LOOK.dragLook&&CAM_LOOK._easeAt&&t>=CAM_LOOK._easeAt){
      const tau=CAM_LOOK._fast?0.16:0.34,k=1-Math.exp(-(dt||1/60)/tau);
      CAM_LOOK.az=clamp(CAM_LOOK.az*(1-k),-CAM_AZ_MAX,CAM_AZ_MAX);CAM_LOOK.el+= (CAM_EL0-CAM_LOOK.el)*k;
      CAM_LOOK._gAz=clamp(CAM_LOOK.az,-CAM_AZ_MAX,CAM_AZ_MAX);CAM_LOOK._gEl=CAM_LOOK.el;
      if(Math.abs(CAM_LOOK.az)<0.012&&Math.abs(CAM_LOOK.el-CAM_EL0)<0.015)camLookClear();
      else camLookPublish();
    }
  }catch(_){}
}
window.CAM_LOOK=CAM_LOOK;
