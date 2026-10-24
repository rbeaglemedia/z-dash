'use strict';
function zdTowType(o, TYPES, bldg, box, TOWS){const p=o.p||{},dir=Math.round(((o.rot||0)%360+360)%360/90)%4,u=[[0,1],[1,0],[0,-1],[-1,0]][dir],L=o.d,bed=p.bed||L*.62,cab=L-bed,ch=Math.max(1.2,o.h-(p.drop||.4)),FS=1.15,cabL=2.376*FS,chF=2.345*FS,gap=L-bed-cabL,KD=1.1;
      const bx=o.x-u[0]*(L/2-bed/2),bz=o.z-u[1]*(L/2-bed/2);TYPES.ramp({id:o.id,x:bx,z:bz,rot:o.rot,w:o.w,d:bed,h:o.h,p:{sz:'medium',nm:'tow',tow:1}});
      if(gap>.3&&KD<9)TYPES.ramp({id:o.id,x:o.x+u[0]*(L/2-cabL-gap/2),z:o.z+u[1]*(L/2-cabL-gap/2),rot:o.rot,w:o.w,d:gap,h:chF-o.h+KD,p:{sz:'small',nm:'tow',tow:1,yb:o.h-KD}});
      const cx=o.x+u[0]*(L/2-cabL/2),cz=o.z+u[1]*(L/2-cabL/2),r=dir%2,hw=(r?cabL:o.w)/2,hd=(r?o.w:cabL)/2;
      const b=bldg({x0:cx-hw,x1:cx+hw,z0:cz-hd,z1:cz+hd,cx,cz,c:'#ffb020',wc:'#ffb020',dash:[1,9],wseed:0,kind:'pylon',top:chF,rad:6});b.towCab=1;box(b,{x0:b.x0,x1:b.x1,z0:b.z0,z1:b.z1,y1:chF});
      TOWS.push({x:o.x,z:o.z,u,w:o.w,L,bed,cab,cabL,h:o.h,ch:chF,oid:o.id});}
const ZD_TOW_PREFAB={label:'Tow Truck Jump',type:'tow',w:3.6,d:14,h:2.6,snap:1,p:{drop:1.1}};
function zdTowPlace(placePrefab){
  // tow truck jumps: parked in a street lane mid-block, bed facing oncoming drivers (Bob: "add tow truck jump")
  for(const[x,z,rot]of[[254,600,0],[-354,1200,180],[-154,800,0],[-246,0,0],[154,1600,0],[-546,400,180]])placePrefab('tow_truck',x,z,{rot});
}
// tow truck dressing (visual only): wheels, bed rails, cab glass, roof beacon, boom + hook, TOW sign
function drawTow(t,d){if(d>CDRAW.dist)return;if(TOW3.draw(t,d))return;const u=t.u,s=[u[1],-u[0]],P=(a,l,y)=>[t.x+u[0]*a+s[0]*l,y,t.z+u[1]*a+s[1]*l],hw=t.w/2,A0=-t.L/2,Ab=A0+t.bed,A1=t.L/2,tt=performance.now()/1000;
  ctx.save();ctx.beginPath();for(const l of[-hw-.05,hw+.05])for(const a of[A0+1.6,Ab-1.2,A1-1.1]){const pts=[];for(let i=0;i<10;i++){const q=i/10*Math.PI*2;pts.push(P(a+Math.cos(q)*.55,l,.55+Math.sin(q)*.55));}wpoly(pts);}ctx.fillStyle='#05030a';ctx.fill();ctx.strokeStyle='#3ee6ff';ctx.lineWidth=d<120?2:1.2;ctx.stroke();
  ctx.beginPath();for(const l of[-hw,hw]){pathSeg(P(A0,l,.2),P(Ab,l,t.h+.35));pathSeg(P(A0,l,0),P(A0,l,.2));}pathSeg(P(A0,-hw,.2),P(A0,hw,.2));ctx.strokeStyle='#3ee6ff';ctx.shadowColor='#3ee6ff';ctx.shadowBlur=d<90?8:0;ctx.lineWidth=d<120?2.4:1.4;ctx.stroke();ctx.shadowBlur=0;
  ctx.beginPath();wpoly([P(A1-.05,-hw*.8,t.ch*.45),P(A1-.05,hw*.8,t.ch*.45),P(A1-.05,hw*.8,t.ch*.9),P(A1-.05,-hw*.8,t.ch*.9)]);ctx.fillStyle='rgba(62,230,255,.25)';ctx.fill();ctx.strokeStyle='#9ff3ff';ctx.lineWidth=1.2;ctx.stroke();
  ctx.beginPath();pathSeg(P(Ab+.3,0,t.ch),P(Ab-.6,0,t.ch+1.4));pathSeg(P(Ab-.6,0,t.ch+1.4),P(Ab-.6,0,t.ch+.7));ctx.strokeStyle='#ffb020';ctx.lineWidth=2;ctx.stroke();
  const on=Math.floor(tt*3)%2;ctx.beginPath();wpoly([P(Ab+.9,-hw*.6,t.ch+.05),P(Ab+.9,hw*.6,t.ch+.05),P(Ab+.9,hw*.6,t.ch+.35),P(Ab+.9,-hw*.6,t.ch+.35)]);ctx.fillStyle=on?'#ffb020':'#ff2a3d';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=d<200?14:0;ctx.fill();ctx.shadowBlur=0;
  if(d<220){const c=proj(...P(Ab+cabMid(t),0,t.ch+1.4));if(c){const fs=clamp(260/Math.max(d,8),9,26);ctx.font=`900 ${fs}px Rajdhani,sans-serif`;ctx.textAlign='center';ctx.fillStyle='#ffb020';ctx.shadowColor='#ffb020';ctx.shadowBlur=8;ctx.fillText('TOW',c[0],c[1]);ctx.shadowBlur=0;}}
  ctx.restore();}
function cabMid(t){return t.cab/2;}
// TOWSTOCK: turn the Kenney Car Kit "truck-flat" (CC0) into a rollback tow truck whose bed is tilted down to the ground.
// parts: [{geo,map}] in model space (front = +x, up = +y, wheels on y=0). o: {L,bed,cab,w,h,ch,split,deck}. Visual only (no colliders).
function towRollback(parts,o){
  const bb=g=>{g.computeBoundingBox();return g.boundingBox;};
  let body=null,bs=null;for(const p of parts){const s=bb(p.geo);if(!body||s.max.x-s.min.x>bs.max.x-bs.min.x){body=p;bs=s.clone();}}
  const BG=body.geo.constructor,BA=body.geo.attributes.position.constructor;
  const bx0=bs.min.x,bx1=bs.max.x,W0=bs.max.z-bs.min.z,zc=(bs.max.z+bs.min.z)/2,xs=o.split,A0=-o.L/2,Ab=A0+o.bed,sz=o.w/W0,slope=o.h/o.bed,
    top=o.ch+(o.cabLift||.12),yk=o.yKnee||.8,yu=(top-yk)/(bs.max.y-yk),kb=o.kb||1.1,kw=o.kw||.95,rearA=o.rearA||.72,deck=o.deck,
    cabY=y=>y<yk?y:yk+(y-yk)*yu,cabX=x=>Ab+(x-xs)/(bx1-xs)*o.cab,
    FS=o.full?(o.fs||1.15):0,Ac=o.L/2-(bx1-xs)*FS;   // full: uncut stock cab, uniform scale (width = bed width), front bumper at the truck front
  const out=[];o.cabTop=FS?bs.max.y*FS:0;
  for(const p of parts){let g=p.geo.index?p.geo.toNonIndexed():p.geo.clone();let pa=g.attributes.position,n=pa.count;
    if(p!==body){const s=bb(p.geo),cx=(s.min.x+s.max.x)/2,cy=(s.min.y+s.max.y)/2,cz=(s.min.z+s.max.z)/2,front=cx>xs;
      const k=FS||kw,X=front?(FS?Ac+(cx-xs)*FS:cabX(cx)):A0+rearA*o.bed,Y=cy*k,Z=(cz-zc)*(FS||sz);
      for(let i=0;i<n;i++)pa.setXYZ(i,X+(pa.getX(i)-cx)*k,Y+(pa.getY(i)-cy)*k,Z+(pa.getZ(i)-cz)*k);}
    else{const keep=[];const at=Object.keys(g.attributes);
      for(let t=0;t<n;t+=3){const cxT=(pa.getX(t)+pa.getX(t+1)+pa.getX(t+2))/3,cyT=Math.max(pa.getY(t),pa.getY(t+1),pa.getY(t+2)),isBed=cxT<xs;
        if(isBed)continue;   // the stock bed is replaced by a clean tilted deck below (stretching it made its stacked deck faces shimmer)
        if(isBed&&g.attributes.uv){const U=g.attributes.uv,cu=(U.getX(t)+U.getX(t+1)+U.getX(t+2))/3,cv=(U.getY(t)+U.getY(t+1)+U.getY(t+2))/3;for(let i=t;i<t+3;i++)U.setXY(i,cu,cv);}  // stretched bed: one flat palette colour per face (no texture shimmer)
        keep.push(t);for(let i=t;i<t+3;i++){const x=pa.getX(i),y=pa.getY(i),z=(pa.getZ(i)-zc)*sz;
          if(FS){pa.setXYZ(i,Ac+(x-xs)*FS,y*FS,(pa.getZ(i)-zc)*FS);continue;}
          if(isBed){const a=Math.max(0,Math.min(o.bed,(x-bx0)/(xs-bx0)*o.bed));pa.setXYZ(i,A0+a,Math.max(0,slope*a+(y-deck)*kb),z);}
          else pa.setXYZ(i,cabX(x),cabY(y),z);}}
      const ng=new BG();for(const k of at){const A=g.attributes[k],c=A.itemSize,arr=new Float32Array(keep.length*3*c);let j=0;for(const t of keep)for(let i=t;i<t+3;i++)for(let q=0;q<c;q++)arr[j++]=A.array[i*c+q];ng.setAttribute(k,new BA(arr,c));}
      g=ng;pa=g.attributes.position;}
    pa.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();out.push({geo:g,map:p.map||null});}
  // clean tilted deck + frame (visual only). Deck top = the ramp collider surface (0 at the rear, h at the lip).
  const hw=o.w/2,ra=A0+rearA*o.bed,ry=.95*kw*.55*2;
  const mk=(P,col)=>{const fg=new BG();fg.setAttribute('position',new BA(new Float32Array(P),3));fg.computeVertexNormals();fg.computeBoundingBox();fg.computeBoundingSphere();out.push({geo:fg,map:null,color:col});};
  const box=(P,x0,x1,y0a,y1a,y0b,y1b,z0,z1)=>{const v=[[x0,y0a,z0],[x1,y0b,z0],[x1,y1b,z0],[x0,y1a,z0],[x0,y0a,z1],[x1,y0b,z1],[x1,y1b,z1],[x0,y1a,z1]],
      F=[[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[3,7,6,2],[0,1,5,4]];for(const f of F)for(const i of[0,1,2,0,2,3])P.push(...v[f[i]]);};
  const D=[],Rl=[],Fr=[],h=o.h,th=.28;
  box(D,A0,Ab,-.02,0,h-th,h,-hw*.94,hw*.94);                                  // deck slab (top flush with the collider)
  for(const s of[-1,1])box(Rl,A0,Ab,0,.22,h-.05,h+.22,s*hw-.16*(s>0),s*hw+.16*(s<0)); // side rails
  if(o.full){const ar=Ac;const kd=o.kd||1.1;box(Rl,Ab+.05,ar,h-kd-.14,h-kd,o.ch-.14,o.ch,-hw*.94,hw*.94);for(const s of[-1,1])box(Fr,Ab,ar,0.9,h-.74,0.9,o.ch-.14,s*hw*.94-.12,s*hw*.94+.12);}  // full cab: sloped cab-guard plate (= the hidden kick collider) from the lip up to the cab roof
  else box(Rl,Ab-.25,Ab,h-.1,h+.85,h-.1,h+.85,-hw,hw);                                // headboard at the lip
  box(Rl,A0,A0+.18,0,.12,.05,.17,-hw,hw);                                        // rear lip plate on the ground
  for(const s of[-1,1]){const z0=s*hw*.55-.12,z1=s*hw*.55+.12;box(Fr,ra-1.3,Ab+.4,ry*.55,ry*.55+.28,.62,.9,z0,z1);}  // frame rails
  box(Fr,ra-.2,ra+.2,ry*.6,ry*.6+.22,ry*.6,ry*.6+.22,-hw*.6,hw*.6);
  {const a1=o.bed*.8,yb=slope*a1-th;box(Fr,Ab-2.4,A0+a1,.72,.95,yb-.2,yb,-.15,.15);}                                // lift ram
  mk(D,o.deckCol||'#3a2a52');mk(Rl,o.railCol||'#ffb020');mk(Fr,o.frameCol||'#1a1024');
  return out;}

// TOW3: one isolated WebGL bake of the rollback (48 yaw × 3 pitch), then the temp
// renderer is destroyed. Gameplay blits a 2D cell — no live WebGL context and no per-frame R.render.
const TOW3={ok:false,fail:false,baked:false,sheets:null,dist:320,n:0,R:null,
  on(d){return this.ok&&d<this.dist;},
  init(){if(this.ok||this.fail)return this.ok;const X=window.ZD&&ZD.Xray;if(!X||!X.ready)return false;const tr=X.loadTraffic();if(!tr.ready||!tr.models['k-truck-flat'])return false;
    let R=null;
    try{let Mesh=null,Std=null,Basic=null;const seek=o=>{if(o.isMesh){Mesh=Mesh||o.constructor;const m=o.material;if(m&&m.type==='MeshStandardMaterial')Std=Std||m.constructor;if(m&&m.type==='MeshBasicMaterial')Basic=Basic||m.constructor;}};
      X.scene.traverse(seek);tr.scene.traverse(seek);Basic=Basic||(tr.outline&&tr.outline.constructor);if(!Mesh||!Std||!Basic){this.fail=true;return false;}
      const YN=48,PITCHES=[-0.08,-0.30,-0.62],CW=160,CH=112;
      const cv=document.createElement('canvas');
      R=new X.renderer.constructor({canvas:cv,antialias:true,alpha:true,preserveDrawingBuffer:true,premultipliedAlpha:false});
      R.setPixelRatio(1);R.setSize(CW,CH,false);R.setClearColor(0x000000,0);
      const sc=new X.scene.constructor();tr.scene.children.forEach(c=>{if(c.isLight)sc.add(c.clone());});const grp=new X.car.constructor();sc.add(grp);
      const T0=(CITY.TOWS||[])[0]||{},T={L:14,bed:8.68,cab:5.32,w:3.6,h:2.6,ch:T0.ch||3.12,split:.1,deck:.9,full:1,rearA:.8};const parts=towRollback(tr.models['k-truck-flat'],T);
      const C=X.cam.constructor,cam3=new C(58,CW/CH,0.3,400);const AMB='#ffb020',TO='#ff6a1a';
      const col=(c,k)=>new Std({color:c,emissive:c,emissiveIntensity:k});
      const ol=[];for(const p of parts){let m;if(p.map){m=new Std({map:p.map,emissive:TO,emissiveIntensity:.55});m.color.set(TO).lerp(m.color.clone().set('#ffffff'),.5);}else m=col(p.color,p.color==='#ffb020'?.35:.12);
        grp.add(new Mesh(p.geo,m));const o=new Mesh(p.geo,new Basic({color:p.map?TO:AMB,side:1,polygonOffset:true,polygonOffsetFactor:3,polygonOffsetUnits:3}));o.scale.setScalar(1.02);grp.add(o);ol.push(o);}
      grp.position.set(0,0,0);grp.rotation.set(0,Math.PI/2,0);grp.updateMatrixWorld(true);
      const sheetHi=document.createElement('canvas'),sheetLo=document.createElement('canvas');
      sheetHi.width=sheetLo.width=YN*CW;sheetHi.height=sheetLo.height=PITCHES.length*CH;
      const gh=sheetHi.getContext('2d'),gl2=sheetLo.getContext('2d');
      const frameH=14,frameW=frameH*(CW/CH),look=1.35,dist=frameH*0.9;
      const M4=X.cam.matrix.constructor;
      const camSLocal=(camL,x,y,z)=>{let dx=x-camL.x,dy=y-camL.y,dz=z-camL.z;const cy=Math.cos(camL.yaw),sy=Math.sin(camL.yaw);let X1=dx*cy-dz*sy,Z=dx*sy+dz*cy;const cp=Math.cos(-camL.pitch),sp=Math.sin(-camL.pitch);let Y=dy*cp-Z*sp;Z=dy*sp+Z*cp;return[X1,Y,Z];};
      const aim=(rel,pitch)=>{const el=-pitch,hd=dist*Math.cos(el),camL={x:Math.sin(rel)*hd,y:look+Math.sin(el)*dist,z:Math.cos(rel)*hd,roll:0};
        const dx=-camL.x,dy=look-camL.y,dz=-camL.z;camL.yaw=Math.atan2(dx,dz);camL.pitch=Math.atan2(-dy,Math.hypot(dx,dz));
        const o=[camL.x,camL.y,camL.z],ax=[camSLocal(camL,o[0]+1,o[1],o[2]),camSLocal(camL,o[0],o[1]+1,o[2]),camSLocal(camL,o[0],o[1],o[2]+1)];
        const r=[ax[0][0],ax[1][0],-ax[2][0]],up=[ax[0][1],ax[1][1],-ax[2][1]],fw=[ax[0][2],ax[1][2],-ax[2][2]];
        const m=new M4().set(r[0],up[0],-fw[0],0, r[1],up[1],-fw[1],0, r[2],up[2],-fw[2],0, 0,0,0,1);
        cam3.position.set(o[0],o[1],-o[2]);cam3.quaternion.setFromRotationMatrix(m);cam3.fov=2*Math.atan(.5/.9)*180/Math.PI;cam3.aspect=CW/CH;cam3.near=0.3;cam3.far=400;cam3.updateProjectionMatrix();cam3.updateMatrixWorld();};
      R.setScissorTest(false);if(R.setViewport)R.setViewport(0,0,CW,CH);
      for(let pi=0;pi<PITCHES.length;pi++)for(let yi=0;yi<YN;yi++){aim(yi*(Math.PI*2/YN),PITCHES[pi]);
        ol.forEach(q=>q.visible=true);R.clear();R.render(sc,cam3);gh.drawImage(cv,0,0,CW,CH,yi*CW,pi*CH,CW,CH);
        ol.forEach(q=>q.visible=false);R.clear();R.render(sc,cam3);gl2.drawImage(cv,0,0,CW,CH,yi*CW,pi*CH,CW,CH);}
      try{R.dispose();R.forceContextLoss();}catch(e2){}
      R=null;
      Object.assign(this,{T,tris:parts.reduce((a,p)=>a+p.geo.attributes.position.count/3,0),yaws:YN,pitches:PITCHES,cw:CW,ch:CH,frameW,frameH,look,
        sheets:{hi:sheetHi,lo:sheetLo,yaws:YN,pitches:PITCHES.slice(),cw:CW,ch:CH},baked:true,ok:true,R:null,cv:null});
    }catch(e){this.fail=true;this.err=String(e);try{if(R){R.dispose();R.forceContextLoss();}}catch(e2){}this.R=null;}
    return this.ok;},
  draw(t,d){if(d>=this.dist||!this.init())return false;const T=this.T,u=t.u,s=[u[1],-u[0]];
    const p=proj(t.x,this.look,t.z);if(!p)return true;
    const truckYaw=Math.atan2(u[0],u[1]);
    let rel=Math.atan2(cam.x-t.x,cam.z-t.z)-truckYaw;rel=Math.atan2(Math.sin(rel),Math.cos(rel));
    const YN=this.yaws,step=Math.PI*2/YN;let yi=Math.round(rel/step);yi=((yi%YN)+YN)%YN;
    const hd=Math.hypot(cam.x-t.x,cam.z-t.z)||0.001,elev=Math.atan2(this.look-cam.y,hd);
    let pi=0,bd=1e9;for(let i=0;i<this.pitches.length;i++){const dd=Math.abs(elev-this.pitches[i]);if(dd<bd){bd=dd;pi=i;}}
    const low=!!(ZD.perf&&ZD.perf.low),sheet=low?this.sheets.lo:this.sheets.hi;
    const sw=H*0.9/p[2]*this.frameW,sh=H*0.9/p[2]*this.frameH;
    ctx.save();ctx.imageSmoothingEnabled=true;ctx.drawImage(sheet,yi*this.cw,pi*this.ch,this.cw,this.ch,p[0]-sw/2,p[1]-sh/2,sw,sh);ctx.restore();this.n++;
    // 2D game dressing on top: pink lip + green chevrons on the deck, flashing beacon, TOW sign
    const P=(a,l,y)=>[t.x+u[0]*a+s[0]*l,y,t.z+u[1]*a+s[1]*l],hw=T.w/2,A0=-T.L/2,Ab=A0+T.bed,tt=performance.now()/1000;ctx.save();
    if(d<200){ctx.beginPath();pathSeg(P(Ab-.3,-hw*.9,T.h+.04),P(Ab-.3,hw*.9,T.h+.04));ctx.strokeStyle='#ff4fd8';ctx.lineWidth=3;ctx.stroke();
      ctx.beginPath();for(let i=1;i<=3;i++){const f=i/4,a=A0+T.bed*f,y=T.h*f+.04,ab=a-T.bed/4*.5,yb=T.h*(ab-A0)/T.bed+.04;pathSeg(P(ab,-hw*.6,yb),P(a,0,y));pathSeg(P(a,0,y),P(ab,hw*.6,yb));}ctx.strokeStyle='#7dff6b';ctx.lineWidth=2.2;ctx.stroke();}
    const on=Math.floor(tt*3)%2;ctx.beginPath();wpoly([P(Ab+1.2,-hw*.5,t.ch+.12),P(Ab+1.2,hw*.5,t.ch+.12),P(Ab+1.2,hw*.5,t.ch+.36),P(Ab+1.2,-hw*.5,t.ch+.36)]);ctx.fillStyle=on?'#ffb020':'#ff2a3d';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=d<200?14:0;ctx.fill();ctx.shadowBlur=0;
    if(d<220){const c=proj(...P(Ab-.2,0,T.h+1.5));if(c){const fs=clamp(260/Math.max(d,8),9,26);ctx.font=`900 ${fs}px Rajdhani,sans-serif`;ctx.textAlign='center';ctx.fillStyle='#ffb020';ctx.shadowColor='#ffb020';ctx.shadowBlur=8;ctx.fillText('TOW',c[0],c[1]);ctx.shadowBlur=0;}}
    ctx.restore();return true;}};
window.TOW3=TOW3;
