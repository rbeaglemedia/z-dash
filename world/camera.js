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
