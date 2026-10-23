'use strict';
function rampGeo(r){const u=[[0,1],[1,0],[0,-1],[-1,0]][r.dir],lo=r.dir===0?r.z0:r.dir===1?r.x0:r.dir===2?r.z1:r.x1,hi=r.dir===0?r.z1:r.dir===1?r.x1:r.dir===2?r.z0:r.x0,
    a0=r.dir%2?r.z0:r.x0,a1=r.dir%2?r.z1:r.x1,P3=(s,a,y)=>r.dir%2?[s,y,a]:[a,y,s],b=r.yb,t=r.y1,pk=r.prof==='crest'?lo+(hi-lo)*.88:hi;
  const F=[[P3(lo,a0,b),P3(lo,a1,b),P3(pk,a1,t),P3(pk,a0,t)],[P3(lo,a0,b),P3(pk,a0,t),P3(pk,a0,b)],[P3(lo,a1,b),P3(pk,a1,t),P3(pk,a1,b)]];
  if(r.prof==='crest')F.push([P3(pk,a0,t),P3(pk,a1,t),P3(hi,a1,b),P3(hi,a0,b)]);else F.push([P3(pk,a0,b),P3(pk,a1,b),P3(pk,a1,t),P3(pk,a0,t)]);
  const n=r.sz==='small'?2:r.sz==='medium'?3:5,am=(a0+a1)/2,hw=(a1-a0)/2,chev=[];
  for(let i=1;i<=n;i++){const k=i/(n+1),s=lo+(pk-lo)*k,y=b+(t-b)*k+.05,sb=s-(pk-lo)/(n+1)*.5;chev.push([P3(sb,am-hw*.7,y-.2),P3(s,am,y)],[P3(s,am,y),P3(sb,am+hw*.7,y-.2)]);}
  const posts=[[P3(pk,a0,t),P3(pk,a0,t+1.8)],[P3(pk,a1,t),P3(pk,a1,t+1.8)],[P3(pk,a0,t+1.8),P3(pk,a1,t+1.8)],[P3(pk,a0,t+.55),P3(pk,a1,t+.55)]];
  const side=[];
  for(const a of[a0,a1]){side.push([P3(lo,a,b+.2),P3(pk,a,t)],[P3(lo+(pk-lo)*.28,a,b+.15),P3(lo+(pk-lo)*.72,a,b+(t-b)*.7)]);}
  const back=[[P3(hi,a0,b+.25),P3(pk,a1,t)],[P3(hi,a1,b+.25),P3(pk,a0,t)],[P3(hi,am,b+.3),P3(pk,am,t)]];
  return{F,lip:[P3(pk,a0,t+.05),P3(pk,a1,t+.05)],lo,pk,a0,a1,u,chev,posts,side,back};}
function rampCache(r){if(r.nm==='tow'){if(!r._geo||r._gx!==r.x0||r._gz!==r.z0||!r._geo.posts){r._geo=rampGeo(r);r._gx=r.x0;r._gz=r.z0;r.mx=(r.x0+r.x1)/2;r.mz=(r.z0+r.z1)/2;}}
  else if(!r._geo||!r._geo.posts){r.mx=(r.x0+r.x1)/2;r.mz=(r.z0+r.z1)/2;r._geo=rampGeo(r);}return r._geo;}
function drawRamps(cx,cz,R){const C=CITY,fill=new Path2D(),edge=new Path2D(),lip=new Path2D(),chev=new Path2D(),dr=R*1.15;
  for(const r of C.RAMPS){const g=rampCache(r),mx=r.mx,mz=r.mz;if(r.nm==='tow'&&TOW3.on(Math.hypot(mx-cam.x,mz-cam.z)))continue;if(Math.abs(mx-cx)>dr||Math.abs(mz-cz)>dr)continue;if(r.yb>0&&cam.y<r.yb)continue;
    PT=fill;for(const f of g.F)wpoly(f);PT=edge;for(const f of g.F)wpoly(f);
    PT=lip;pathSeg(g.lip[0],g.lip[1]);for(let i=0;i<g.posts.length;i++)pathSeg(g.posts[i][0],g.posts[i][1]);
    PT=chev;for(let i=0;i<g.chev.length;i++)pathSeg(g.chev[i][0],g.chev[i][1]);for(let i=0;i<g.side.length;i++)pathSeg(g.side[i][0],g.side[i][1]);for(let i=0;i<g.back.length;i++)pathSeg(g.back[i][0],g.back[i][1]);}
  PT=null;ctx.fillStyle='#1c0c1f';ctx.fill(fill);ctx.strokeStyle='#ffb020';ctx.lineWidth=2.4;ctx.stroke(edge);
  ctx.strokeStyle='#ff4fd8';ctx.lineWidth=3.2;ctx.stroke(lip);ctx.strokeStyle='#7dff6b';ctx.lineWidth=2.4;ctx.stroke(chev);}
