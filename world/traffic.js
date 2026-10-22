'use strict';
// Neon World traffic: Z TAKEOVER level 4, every car a Nissan 370Z.
// Drives CITY.ROADS lanes (both ways), turns or loops at intersections, keeps a gap,
// and recycles a fixed pool around the player. Buildings, tow trucks and the runway are not drivable.
// Draw reuses the world's 370Z renderer (ZD.Xray.render, the same model drawZ uses). Far cars are a flat box / dot.
// Player: WT.bumpTraffic slowdown + a small shove. Never reset(), never a wreck.
const TRAFFIC=(()=>{
  const cars=[];
  let graph=null,booted=false,nobake=false,bakedN=0,bumps=0,msgT=0,builds=0;
  const cache=new Map();
  const stats={cap:0,lanes:0,active:0,bumps:0,baked:0,inside:0};
  const ang=(a,b)=>{let d=b-a;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;return d;};
  function pose(L,s){return{x:L.ax+L.sx*s+L.rx*L.off,z:L.az+L.sz*s+L.rz*L.off};}
  function solidAt(x,z,tows){
    if(Math.abs(x)<=20&&z>=-70&&z<=1510)return true;                 // runway corridor, not a street
    if(CITY.surfaceAt(x,z)==='water')return true;
    for(let i=0;i<tows.length;i++){const q=tows[i];if(x>=q.x0&&x<=q.x1&&z>=q.z0&&z<=q.z1)return true;}
    const pr=CITY.probe(x,z,0.45);
    if(pr.wl&&!(pr.wl.ramp&&pr.wl.nm!=='tow'))return true;
    return false;
  }
  function build(){
    const T=TRAFFIC_TUNE,G=CITY.ROADS,tows=[];
    for(const q of CITY.RAMPS)if(q.nm==='tow')tows.push({x0:q.x0-1.4,x1:q.x1+1.4,z0:q.z0-1.4,z1:q.z1+1.4});
    for(const b of CITY.BL)if(b.towCab)tows.push({x0:b.x0-1,x1:b.x1+1,z0:b.z0-1,z1:b.z1+1});
    const lanes=[],out={};
    for(const e of G.edges){
      if(!e||e.len<12)continue;
      const A=G.nodes[e.a],B=G.nodes[e.b],ux=(B.x-A.x)/e.len,uz=(B.z-A.z)/e.len,nL=e.w>=30?3:2;
      for(let dir=0;dir<2;dir++){
        const sx=dir?-ux:ux,sz=dir?-uz:uz,rx=sz,rz=-sx,ax=dir?B.x:A.x,az=dir?B.z:A.z,from=dir?e.b:e.a,to=dir?e.a:e.b;
        for(let li=0;li<nL;li++){
          const off=T.laneW*(li+.5);
          if(off+T.W*.5>e.w*.5-.25)continue;
          const blocks=[];let on=false,b0=0;
          for(let s=0;s<=e.len+1e-3;s+=5){
            const ss=Math.min(s,e.len),x=ax+sx*ss+rx*off,z=az+sz*ss+rz*off;
            const hit=solidAt(x,z,tows)||solidAt(x+rx*1.15,z+rz*1.15,tows)||solidAt(x-rx*1.15,z-rz*1.15,tows);
            if(hit&&!on){on=true;b0=Math.max(0,ss-7);}
            if(!hit&&on){blocks.push([b0,Math.min(e.len,ss+7)]);on=false;}
          }
          if(on)blocks.push([b0,e.len]);
          blocks.sort((p,q)=>p[0]-q[0]);
          const mb=[];
          for(const iv of blocks){if(!mb.length||iv[0]>mb[mb.length-1][1])mb.push([iv[0],iv[1]]);else mb[mb.length-1][1]=Math.max(mb[mb.length-1][1],iv[1]);}
          const free=[];let c0=0;
          for(const iv of mb){if(iv[0]-c0>=14)free.push([c0,iv[0]]);c0=iv[1];}
          if(e.len-c0>=14)free.push([c0,e.len]);
          if(!free.length)continue;
          const L={id:lanes.length,edge:e.id,dir,li,ax,az,sx,sz,rx,rz,off,len:e.len,yaw:Math.atan2(sx,sz),from,to,free};
          lanes.push(L);(out[from]||(out[from]=[])).push(L);
        }
      }
    }
    const by=new Map(lanes.map(L=>[L.edge+'|'+L.dir+'|'+L.li,L]));
    for(const L of lanes)L.rev=by.get(L.edge+'|'+(1-L.dir)+'|'+L.li)||null;
    const anchors=[],grid=new Map();
    for(const L of lanes)for(const fr of L.free)for(let s=fr[0]+6;s<=fr[1]-6;s+=18){
      const p=pose(L,s),k=(Math.floor(p.x/80))+','+(Math.floor(p.z/80)),a={L,s,x:p.x,z:p.z};
      anchors.push(a);const g=grid.get(k);if(g)g.push(a);else grid.set(k,[a]);
    }
    graph={lanes,out,anchors,grid};stats.lanes=lanes.length;stats.cap=TRAFFIC_TUNE.cap;stats.anchors=anchors.length;
    for(let i=0;i<TRAFFIC_TUNE.cap;i++)cars.push({on:false,id:i});
    booted=true;
  }
  function rangeAt(L,s){for(const fr of L.free)if(s>=fr[0]-.4&&s<=fr[1]+.4)return fr;return null;}
  function clampS(L,s){let best=null,bd=1e9;for(const fr of L.free){if(s>=fr[0]&&s<=fr[1])return s;const c=Math.max(fr[0]+1,Math.min(fr[1]-1,s)),d=Math.abs(c-s);if(d<bd){bd=d;best=c;}}return best;}
  function place(c){
    const p=pose(c.lane,c.s);c.x=p.x;c.z=p.z;c.yaw=c.lane.yaw;
    const pr=CITY.probe(p.x,p.z,1);
    if(pr.wl&&!pr.wl.ramp){c.on=false;stats.inside++;return;}
    c.y=pr.fl>0&&pr.fl<2.6?pr.fl:0;
  }
  function occupied(L,sMax){for(const o of cars)if(o.on&&o.lane===L&&o.s<sMax)return true;return false;}
  function tooClose(x,z,L,s){
    const T=TRAFFIC_TUNE;
    for(const o of cars){if(!o.on)continue;if(o.lane===L&&Math.abs(o.s-s)<T.gap)return true;if((o.x-x)**2+(o.z-z)**2<4.6*4.6)return true;}
    return false;
  }
  function nearAnchors(){
    const T=TRAFFIC_TUNE,out=[],seen=new Set();
    const x0=Math.floor((P.x-T.spawnMax)/80),x1=Math.floor((P.x+T.spawnMax)/80);
    const z0=Math.floor((P.z-T.spawnMax)/80),z1=Math.floor((P.z+T.spawnMax)/80);
    for(let i=x0;i<=x1;i++)for(let j=z0;j<=z1;j++){
      const g=graph.grid.get(i+','+j);if(!g)continue;
      for(const a of g){if(seen.has(a))continue;seen.add(a);
        const d=Math.hypot(a.x-P.x,a.z-P.z);if(d>=T.spawnMin&&d<=T.spawnMax)out.push(a);}
    }
    return out;
  }
  function trySpawn(){
    const T=TRAFFIC_TUNE,slot=cars.find(c=>!c.on);if(!slot)return false;
    const list=nearAnchors();if(!list.length)return false;
    for(let k=0;k<list.length&&k<48;k++){
      const a=list[(Math.random()*list.length)|0];
      let n=0;for(const o of cars)if(o.on&&o.lane===a.L)n++;if(n>=5)continue;
      if(tooClose(a.x,a.z,a.L,a.s))continue;
      const cruise=T.v0+Math.random()*T.vSpan;
      Object.assign(slot,{on:true,lane:a.L,s:a.s,cruise,v:cruise,pi:(Math.random()*T.paints.length)|0,wob:0,slowT:0,hold:0,flip:0,travel:0,bumpT:0});
      place(slot);if(!slot.on)continue;return true;
    }
    return false;
  }
  function fill(){let miss=0;while(cars.some(c=>!c.on)&&miss<8){if(trySpawn())miss=0;else miss++;}}
  function doReverse(c){
    c.flip=(c.flip||0)+1;c.hold=0;
    const r=c.lane.rev;
    if(!r||c.flip>3){c.on=false;return;}
    const want=r.len-c.s,ns=clampS(r,want);
    if(ns==null||Math.abs(ns-want)>18){c.on=false;return;}
    c.lane=r;c.s=ns;
  }
  function opens(L){return L.free.some(fr=>fr[0]<=2&&fr[1]-fr[0]>=12);}
  function pickNext(c){
    const opts=(graph.out[c.lane.to]||[]).filter(L=>L!==c.lane.rev&&opens(L));
    if(!opts.length)return null;
    const clear=opts.filter(L=>!occupied(L,TRAFFIC_TUNE.gap+4));
    if(!clear.length)return 'wait';
    const scored=clear.map(L=>({L,a:Math.abs(ang(c.lane.yaw,L.yaw))})).filter(o=>o.a<2.2);
    if(!scored.length)return null;
    const straight=scored.filter(o=>o.a<.55);
    if(straight.length&&Math.random()<TRAFFIC_TUNE.straightP)return straight.reduce((a,b)=>a.a<b.a?a:b).L;
    return scored[(Math.random()*scored.length)|0].L;
  }
  function leader(c){
    let best=null,bd=1e9;
    for(const o of cars){if(!o.on||o===c||o.lane!==c.lane)continue;const ds=o.s-c.s;if(ds>.4&&ds<bd){bd=ds;best=o;}}
    return best?{car:best,ds:bd}:null;
  }
  function yieldTo(c){
    const fx=Math.sin(c.yaw),fz=Math.cos(c.yaw);
    for(const o of cars){
      if(!o.on||o===c||o.lane===c.lane||o.id>c.id)continue;
      const dx=o.x-c.x,dz=o.z-c.z;
      if(dx*dx+dz*dz<25&&dx*fx+dz*fz>0)return true;
    }
    return false;
  }
  function drive(c,dt){
    const T=TRAFFIC_TUNE;
    if(c.slowT>0)c.slowT-=dt;
    if(c.wob)c.wob*=Math.exp(-dt*6);
    let v=c.slowT>0?c.cruise*.62:c.cruise;
    const lead=leader(c);
    if(lead){
      const want=T.gap+c.cruise*.25;
      if(lead.ds<want)v=Math.min(v,lead.car.v);
      if(lead.ds<T.L+1.1)v=Math.min(v,Math.max(0,lead.car.v*(lead.ds/Math.max(T.L,1))));
      if(lead.ds<T.L*.8)v=0;
    }
    if(yieldTo(c))v=Math.min(v,3.5);
    c.v=v;
    const fr=rangeAt(c.lane,c.s);
    if(!fr){const ns=clampS(c.lane,c.s);if(ns==null){c.on=false;return;}c.s=ns;}
    const fr2=rangeAt(c.lane,c.s)||c.lane.free[0];
    const room=fr2[1]-c.s,step=v*dt;
    c.travel=(c.travel||0)+step;if(c.travel>28){c.travel=0;c.flip=0;}
    if(step<room-.45){c.s+=step;place(c);return;}
    if(fr2[1]>=c.lane.len-1.25){
      const nxt=pickNext(c);
      if(nxt&&nxt!=='wait'){c.lane=nxt;c.s=Math.max(2,(nxt.free.find(f=>f[0]<=2)||nxt.free[0])[0]+1);c.hold=0;place(c);return;}
      if(nxt==='wait'){c.hold=(c.hold||0)+dt;c.s=Math.max(fr2[0]+1,fr2[1]-.7);c.v=0;if(c.hold>2)doReverse(c);place(c);return;}
      doReverse(c);place(c);return;
    }
    doReverse(c);place(c);
  }
  function collide(){
    if(!flying||P.wreck||(P.y||0)>2.2)return;
    const T=TRAFFIC_TUNE,now=performance.now()/1000;
    const fx=Math.sin(P.yaw||0),fz=Math.cos(P.yaw||0),rx=fz,rz=-fx;
    for(const c of cars){
      if(!c.on)continue;
      const dx=P.x-c.x,dz=P.z-c.z;if(dx*dx+dz*dz>30)continue;
      const cfx=Math.sin(c.yaw),cfz=Math.cos(c.yaw),crx=cfz,crz=-cfx;
      const aL=(T.L-.25)/2,aW=(T.W-.15)/2;
      let hit=true;
      for(const[ux,uz]of[[fx,fz],[rx,rz],[cfx,cfz],[crx,crz]]){
        const dist=Math.abs(dx*ux+dz*uz);
        const ra=Math.abs(fx*ux+fz*uz)*aL+Math.abs(rx*ux+rz*uz)*aW;
        const rb=Math.abs(cfx*ux+cfz*uz)*aL+Math.abs(crx*ux+crz*uz)*aW;
        if(dist>ra+rb){hit=false;break;}
      }
      if(!hit||now<(c.bumpT||0))continue;
      c.bumpT=now+T.bumpCool;bumps++;stats.bumps=bumps;
      let nx=dx,nz=dz,nd=Math.hypot(nx,nz)||1;nx/=nd;nz/=nd;
      const ox=P.x,oz=P.z;P.x+=nx*T.bumpKick;P.z+=nz*T.bumpKick;
      const pr=CITY.probe(P.x,P.z,P.y,P.y);if(pr.wl){P.x=ox;P.z=oz;}
      P.v*=T.bumpSlow;
      const side=Math.sign(dx*crx+dz*crz)||1;
      c.wob=side*.45;c.slowT=.4;
      const fr=rangeAt(c.lane,c.s);if(fr)c.s=Math.min(fr[1]-1,c.s+1.4);
      try{navigator.vibrate&&navigator.vibrate(20);}catch(e){}
      if(now>msgT){msgT=now+1.3;if(typeof wMsg==='function')wMsg('BUMP!','#ff9a2e','clipped a Z');}
      break;
    }
  }
  function kidOf(p){const w=TRAFFIC_TUNE.wins[p.win];return{paint:p.paint,glow:p.glow,grid:p.grid,wheel:'#4a4f57',wheelGlow:false,spoiler:null,wings:null,extra:null,extras:[],window:w};}
  function bake(pi,yi,ei){
    const X=window.ZD&&ZD.Xray;if(!X||!X.ready||nobake)return null;
    const T=TRAFFIC_TUNE,p=T.paints[pi],yaw=yi*(Math.PI/6),pitch=[.08,.34,.62][ei]||.08;
    const dist=7/(2*Math.tan(13*Math.PI/180)),rp=160;
    try{
      X.render(ctx,0,0,rp,rp,{xray:false,showroom:true,yaw,pitch,dist,tx:0,ty:.6,fov:26,drl:1,noDraw:true,kid:kidOf(p),st:{t:0,throttle:45,wheelAng:.6}});
      const cv=document.createElement('canvas');cv.width=X.canvas.width;cv.height=X.canvas.height;cv.getContext('2d').drawImage(X.canvas,0,0);
      if(cache.size>80)cache.clear();
      const sp={cv};cache.set(pi+'|'+yi+'|'+ei,sp);bakedN++;stats.baked=bakedN;return sp;
    }catch(e){nobake=true;try{X.kidApply&&X.kidApply(null);}catch(_){}return null;}
  }
  function drawCheap(c,dist){
    const T=TRAFFIC_TUNE,p=T.paints[c.pi],y=c.y||0,yaw=c.yaw+(c.wob||0);
    const fx=Math.sin(yaw),fz=Math.cos(yaw),rx=fz,rz=-fx,L=T.L/2,Wd=T.W/2;
    const P=(a,l,h)=>[c.x+fx*a+rx*l,y+h,c.z+fz*a+rz*l];
    const q=proj(c.x,y+.9,c.z);if(!q)return;
    const elev=Math.atan2(cam.y-(y+.6),Math.hypot(cam.x-c.x,cam.z-c.z)||1);
    if(elev>.7&&dist<280){ctx.fillStyle=p.paint;ctx.strokeStyle=p.glow;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(q[0],q[1],Math.max(6,980/q[2]),Math.max(3.2,460/q[2]),c.yaw-cam.yaw,0,7);ctx.fill();ctx.stroke();}
    if(dist>T.dot){ctx.fillStyle=p.glow;ctx.beginPath();ctx.arc(q[0],q[1],Math.max(2.2,170/q[2]),0,7);ctx.fill();return;}
    ctx.fillStyle=p.paint;ctx.strokeStyle=p.glow;ctx.lineWidth=dist<70?1.6:1;
    if(dist<48&&cam.y<30){ctx.shadowColor=p.glow;ctx.shadowBlur=8;}
    ctx.beginPath();wpoly([P(-L,-Wd,.42),P(L*.78,-Wd,.42),P(L*.78,Wd,.42),P(-L,Wd,.42)]);ctx.fill();ctx.stroke();
    ctx.shadowBlur=0;ctx.fillStyle='#07060c';
    ctx.beginPath();wpoly([P(-L*.2,-Wd*.72,1.12),P(L*.42,-Wd*.5,1.02),P(L*.42,Wd*.5,1.02),P(-L*.2,Wd*.72,1.12)]);ctx.fill();
    ctx.fillStyle=p.glow;
    ctx.beginPath();wpoly([P(L*.5,-Wd*.62,.5),P(L*.92,-Wd*.48,.46),P(L*.92,Wd*.48,.46),P(L*.5,Wd*.62,.5)]);ctx.fill();
    if(dist<55){
      for(const s of[-1,1]){const h=proj(...P(L*.82,s*Wd*.45,.55));if(!h)continue;ctx.fillStyle='#e8fbff';ctx.beginPath();ctx.arc(h[0],h[1],Math.max(1.2,70/h[2]),0,7);ctx.fill();}
    }
  }
  function drawOne(c,dist){
    if(!c.on)return;
    const T=TRAFFIC_TUNE,y=c.y||0;
    const sh=proj(c.x,y+.04,c.z);
    ctx.save();
    if(sh&&dist<T.dot){ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(sh[0],sh[1],Math.max(2,700/sh[2]),Math.max(1,220/sh[2]),0,0,7);ctx.fill();}
    const dx=cam.x-c.x,dz=cam.z-c.z,hd=Math.hypot(dx,dz)||1,elev=Math.atan2(cam.y-(y+.6),hd);
    const useSprite=dist<T.sprite&&elev<.75&&cam.y<32&&!nobake;
    if(useSprite){
      const ca=Math.atan2(dx,dz),rel=Math.atan2(Math.sin(ca-(c.yaw+(c.wob||0))),Math.cos(ca-(c.yaw+(c.wob||0))));
      const yi=Math.max(-6,Math.min(6,Math.round(rel/(Math.PI/6)))),ei=elev<.22?0:elev<.48?1:2,key=c.pi+'|'+yi+'|'+ei;
      let sp=cache.get(key);
      if(!sp&&builds<1&&(typeof fps==='undefined'||fps>=26||stats.baked<8)){builds++;sp=bake(c.pi,yi,ei);}
      if(sp){
        const c0=camS(c.x,y+.6,c.z);
        if(c0[2]>NEAR){const sc=scr(c0),px=Math.max(8,Math.min(240,(H*.9)/c0[2]*7));
          ctx.drawImage(sp.cv,0,0,sp.cv.width,sp.cv.height,sc[0]-px/2,sc[1]-px/2,px,px);stats.blit++;ctx.restore();return;}
      }
    }
    drawCheap(c,dist);ctx.restore();
  }
  function step(dt){
    if(!booted){build();fill();}
    if(!graph)return;
    const T=TRAFFIC_TUNE;
    for(const c of cars){
      if(!c.on)continue;
      if((c.x-P.x)**2+(c.z-P.z)**2>T.despawn*T.despawn){c.on=false;continue;}
      drive(c,dt);
    }
    if(cars.some(c=>!c.on))trySpawn();
    collide();
    let n=0;for(const c of cars)if(c.on)n++;stats.active=n;
  }
  function drawOverlay(){
    const list=[];
    for(const c of cars){if(!c.on)continue;const d=(c.x-cam.x)**2+(c.z-cam.z)**2;if(d<650*650)list.push([d,c]);}
    list.sort((a,b)=>b[0]-a[0]);
    ctx.save();ctx.globalAlpha=1;ctx.shadowBlur=0;
    for(const[d,c]of list)drawOne(c,Math.sqrt(d));
    ctx.restore();
  }
  function queue(items){
    builds=0;stats.blit=0;
    if(!booted)return;
    for(const c of cars){if(!c.on)continue;items.push([(c.x-cam.x)**2+(c.z-cam.z)**2,'tr',c]);}
  }
  // Same north-up window drawHud already painted (x12,y10). Dots only; hud.js stays untouched.
  function minimap(){
    if(!booted)return;
    const s=clamp(H/378,.72,1.35),Wd=W/s,mw=Math.min(196,Math.max(96,Wd/2-79)),mx=12,my=10,mh=134,ppm=mw/680;
    ctx.save();ctx.scale(s,s);ctx.beginPath();hrr(ctx,mx,my,mw,mh,14);ctx.clip();
    ctx.globalAlpha=.95;ctx.shadowBlur=0;
    for(const c of cars){
      if(!c.on)continue;
      const sx=mx+mw/2+(c.x-P.x)*ppm,sy=my+mh/2-(c.z-P.z)*ppm;
      ctx.fillStyle=TRAFFIC_TUNE.paints[c.pi].glow;ctx.beginPath();ctx.arc(sx,sy,1.6,0,7);ctx.fill();
    }
    ctx.restore();
  }
  return{step,queue,drawOne,drawOverlay,minimap,cars,get stats(){return stats;},get cap(){return TRAFFIC_TUNE.cap;}};
})();
window.TRAFFIC=TRAFFIC;
