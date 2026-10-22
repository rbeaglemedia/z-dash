'use strict';
function rampGeo(r){const u=[[0,1],[1,0],[0,-1],[-1,0]][r.dir],lo=r.dir===0?r.z0:r.dir===1?r.x0:r.dir===2?r.z1:r.x1,hi=r.dir===0?r.z1:r.dir===1?r.x1:r.dir===2?r.z0:r.x0,
    a0=r.dir%2?r.z0:r.x0,a1=r.dir%2?r.z1:r.x1,P3=(s,a,y)=>r.dir%2?[s,y,a]:[a,y,s],b=r.yb,t=r.y1,pk=r.prof==='crest'?lo+(hi-lo)*.88:hi;
  const F=[[P3(lo,a0,b),P3(lo,a1,b),P3(pk,a1,t),P3(pk,a0,t)],[P3(lo,a0,b),P3(pk,a0,t),P3(pk,a0,b)],[P3(lo,a1,b),P3(pk,a1,t),P3(pk,a1,b)]];
  if(r.prof==='crest')F.push([P3(pk,a0,t),P3(pk,a1,t),P3(hi,a1,b),P3(hi,a0,b)]);else F.push([P3(pk,a0,b),P3(pk,a1,b),P3(pk,a1,t),P3(pk,a0,t)]);
  return{F,lip:[P3(pk,a0,t+.05),P3(pk,a1,t+.05)],lo,pk,a0,a1,P3,u};}
function drawRamps(cx,cz,R){const C=CITY,fill=new Path2D(),mk=new Path2D(),hd=new Path2D(),lip=new Path2D(),chev=new Path2D();
  for(const r of C.RAMPS){const mx=(r.x0+r.x1)/2,mz=(r.z0+r.z1)/2;if(r.nm==='tow'&&TOW3.on(Math.hypot(mx-cam.x,mz-cam.z)))continue;const dr=r.hid?R*.6:R*.85;if(Math.abs(mx-cx)>dr||Math.abs(mz-cz)>dr)continue;if(r.yb>0&&cam.y<r.yb)continue;const g=rampGeo(r),o=r.hid?hd:mk;
    PT=fill;for(const f of g.F)wpoly(f);PT=o;for(const f of g.F)wpoly(f);
    if(!r.hid&&Math.hypot(mx-cx,mz-cz)<R*.7){PT=lip;pathSeg(g.lip[0],g.lip[1]);PT=chev;const n=r.sz==='small'?2:r.sz==='medium'?3:5,am=(g.a0+g.a1)/2,hw=(g.a1-g.a0)/2;
      for(let i=1;i<=n;i++){const t=i/(n+1),s=g.lo+(g.pk-g.lo)*t,y=r.yb+(r.y1-r.yb)*t+.05,sb=s-(g.pk-g.lo)/(n+1)*.5;pathSeg(g.P3(sb,am-hw*.7,y-.2),g.P3(s,am,y));pathSeg(g.P3(s,am,y),g.P3(sb,am+hw*.7,y-.2));}}}
  PT=null;ctx.fillStyle='#140a10';ctx.fill(fill);ctx.strokeStyle='#ffb020';ctx.lineWidth=2;ctx.stroke(mk);ctx.strokeStyle='rgba(150,110,170,.45)';ctx.lineWidth=1.1;ctx.stroke(hd);
  ctx.strokeStyle='#ff4fd8';ctx.lineWidth=3;ctx.stroke(lip);ctx.strokeStyle='#7dff6b';ctx.lineWidth=2.2;ctx.stroke(chev);}
