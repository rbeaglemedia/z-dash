'use strict';
// ===== CAMERA / PROJECTION =====
const cv=document.getElementById('c'),ctx=cv.getContext('2d');let W=0,H=0,DPR=1;
function resize(){DPR=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);}addEventListener('resize',resize);resize();
const cam={x:0,y:0,z:0,yaw:0,pitch:0,roll:0};
function camS(x,y,z){let dx=x-cam.x,dy=y-cam.y,dz=z-cam.z;
  const cy=Math.cos(cam.yaw),sy=Math.sin(cam.yaw);let X=dx*cy-dz*sy,Z=dx*sy+dz*cy;
  const cp=Math.cos(-cam.pitch),sp=Math.sin(-cam.pitch);let Y=dy*cp-Z*sp;Z=dy*sp+Z*cp;
  const cr=Math.cos(cam.roll),sr=Math.sin(cam.roll);return[X*cr-Y*sr,X*sr+Y*cr,Z];}
const NEAR=0.5;function scr(c){const f=H*0.9;return[W/2+c[0]*f/c[2],H/2-c[1]*f/c[2],c[2]];}
function proj(x,y,z){const c=camS(x,y,z);return c[2]<NEAR?null:scr(c);}
function line(a,b,col,w){let p=camS(...a),q=camS(...b);if(p[2]<NEAR&&q[2]<NEAR)return;
  if(p[2]<NEAR||q[2]<NEAR){const t=(NEAR-p[2])/(q[2]-p[2]),m=[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t,NEAR];if(p[2]<NEAR)p=m;else q=m;}
  const P1=scr(p),Q1=scr(q);ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(P1[0],P1[1]);ctx.lineTo(Q1[0],Q1[1]);ctx.stroke();}
// yaw convention: heading vector (sin yaw, cos yaw) in x,z

// Street-mode LOOK AROUND. boot.js already orbits when FLYCAM.orbit = {az, el, d}.
// Hold and drag the upper canvas (clear of the HUD buttons), or call beginDrag / moveDrag
// from the LOOK AROUND control. After release the view holds (holdMs, default 1.2s), then
// az eases back to 0 and the chase cam returns. Double-tap, leaving street mode, or leaving
// the ground skips the hold and eases home the same way.
const CAM_EL0=0.18,CAM_EL_MIN=0.04,CAM_EL_MAX=0.85,CAM_DIST=10.2,CAM_SENS_X=0.0075,CAM_SENS_Y=0.004,CAM_PAN_TAU=0.05,CAM_SLOP=6;
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
    this._gAz=camWrap(this._gAz+dx*CAM_SENS_X);
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
  CAM_LOOK.el=clamp(CAM_LOOK.el,CAM_EL_MIN,CAM_EL_MAX);CAM_LOOK.d=CAM_DIST;CAM_LOOK.active=true;
  FLYCAM.orbit={az:CAM_LOOK.az,el:CAM_LOOK.el,d:CAM_DIST};
}
function camLookClear(){
  CAM_LOOK.az=0;CAM_LOOK.el=CAM_EL0;CAM_LOOK.d=CAM_DIST;CAM_LOOK._gAz=0;CAM_LOOK._gEl=CAM_EL0;
  CAM_LOOK.active=false;CAM_LOOK.dragLook=false;CAM_LOOK._easeAt=0;CAM_LOOK._fast=false;CAM_LOOK._panning=false;
  if(typeof FLYCAM!=='undefined')FLYCAM.orbit=null;
}
function camLookFollow(dt){
  const k=1-Math.exp(-Math.max(0.016,dt)/CAM_PAN_TAU);
  const dAz=Math.atan2(Math.sin(CAM_LOOK._gAz-CAM_LOOK.az),Math.cos(CAM_LOOK._gAz-CAM_LOOK.az));
  CAM_LOOK.az=camWrap(CAM_LOOK.az+dAz*k);
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
  const dt=Math.min(0.05,Math.max(0,(t-camLookT)/1000));camLookT=t;
  try{
    if((CAM_LOOK.active||CAM_LOOK.dragLook)&&!camStreet()){
      CAM_LOOK.dragLook=false;CAM_LOOK._armed=false;CAM_LOOK._panning=false;CAM_LOOK._ptr=null;
      if(CAM_LOOK.active)CAM_LOOK._easeAt=Math.min(CAM_LOOK._easeAt||t,t);
    }
    if(CAM_LOOK.dragLook&&CAM_LOOK._panning)camLookFollow(dt||1/60);
    else if(CAM_LOOK.active&&!CAM_LOOK.dragLook&&CAM_LOOK._easeAt&&t>=CAM_LOOK._easeAt){
      const tau=CAM_LOOK._fast?0.16:0.34,k=1-Math.exp(-(dt||1/60)/tau);
      CAM_LOOK.az+=-CAM_LOOK.az*k;CAM_LOOK.el+= (CAM_EL0-CAM_LOOK.el)*k;
      CAM_LOOK._gAz=CAM_LOOK.az;CAM_LOOK._gEl=CAM_LOOK.el;
      if(Math.abs(CAM_LOOK.az)<0.012&&Math.abs(CAM_LOOK.el-CAM_EL0)<0.015)camLookClear();
      else camLookPublish();
    }
  }catch(_){}
  requestAnimationFrame(camLookTick);
}
requestAnimationFrame(camLookTick);
window.CAM_LOOK=CAM_LOOK;
