/* CREW LOOK — neon silhouette renderer for CREWDATA.
   Cheap shared-geometry meshes inside the Z sprite (ZD.Xray), so Ellie and her pet
   show through the glass and stay hidden behind the body. No physics, no car changes.
   Swap this file for a skinned mesh later; keep reading CREWDATA joints. */
(function(){'use strict';
const D=window.CREWDATA;if(!D)return;
const AX={fx:1,fz:1,ok:false};
const st={phase:'ride',tk:0,tkOn:false,open:false,hatch:0,ready:false,type:'',built:false};
let root=null,api=null,t=0,clock=0;
const tubes=[],spheres=[],pool=[];
let charCore=null,charGlow=null,petCore=null,petGlow=null,eyeMat=null;
let charHex='',petHex='';
const tmp={}; // filled once THREE vectors exist

function xray(){const X=window.ZD&&ZD.Xray;return X&&X.ready&&X.car?X:null;}
function mats(seed,hex){
  const core=seed.clone();core.map=null;core.alphaMap=null;core.color.set(hex);
  core.transparent=false;core.opacity=1;core.blending=1;core.depthWrite=true;core.depthTest=true;
  core.side=2;core.fog=false;if('toneMapped' in core)core.toneMapped=false;core.userData.crew=1;
  const glow=seed.clone();glow.map=null;glow.alphaMap=null;glow.color.set(hex);
  glow.transparent=true;glow.opacity=.4;glow.blending=2;glow.depthWrite=false;glow.depthTest=true;
  glow.side=2;glow.fog=false;if('toneMapped' in glow)glow.toneMapped=false;glow.userData.crew=1;
  return [core,glow];
}
function paint(which,hex){
  if(which==='c'){if(charHex===hex)return;charHex=hex;charCore.color.set(hex);charGlow.color.set(hex);}
  else {if(petHex===hex)return;petHex=hex;petCore.color.set(hex);petGlow.color.set(hex);}
}
function grab(X){
  let seed=null,mesh=null;
  X.car.traverse(o=>{
    if(!o.isMesh||seed)return;
    const ms=Array.isArray(o.material)?o.material:[o.material];
    for(const m of ms) if(m&&m.isMeshBasicMaterial){seed=m;mesh=o;}
  });
  if(!seed)return false;
  const BG=mesh.geometry.constructor,BA=mesh.geometry.attributes.position.constructor;
  const V=X.THREE_Vector3;
  tmp.a=new V();tmp.b=new V();tmp.d=new V();tmp.up=new V(0,1,0);tmp.p=new V();
  api={X,Mesh:mesh.constructor,Group:X.car.constructor,BG,BA,V,cyl:cylinder(BG,BA,8),ball:sphere(BG,BA,8,6)};
  if(api.cyl.computeBoundingSphere)api.cyl.computeBoundingSphere();
  if(api.ball.computeBoundingSphere)api.ball.computeBoundingSphere();
  [charCore,charGlow]=mats(seed,D.char.glow||'#ff3df2');charHex=D.char.glow||'#ff3df2';
  [petCore,petGlow]=mats(seed,D.pet.glow||'#ffb020');petHex=D.pet.glow||'#ffb020';
  eyeMat=seed.clone();eyeMat.map=null;eyeMat.alphaMap=null;eyeMat.color.set('#ffffff');
  eyeMat.transparent=false;eyeMat.opacity=1;eyeMat.blending=1;eyeMat.depthWrite=true;eyeMat.depthTest=true;
  eyeMat.side=2;eyeMat.fog=false;if('toneMapped' in eyeMat)eyeMat.toneMapped=false;
  return true;
}
function cylinder(BG,BA,n){
  const pos=[],idx=[];
  const v=(x,y,z)=>{pos.push(x,y,z);return pos.length/3-1;};
  const ring=y=>{const ids=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2;ids.push(v(Math.cos(a),y,Math.sin(a)));}return ids;};
  const top=ring(.5),bot=ring(-.5),ct=v(0,.5,0),cb=v(0,-.5,0);
  for(let i=0;i<n;i++){const j=(i+1)%n;
    idx.push(top[i],bot[i],top[j], top[j],bot[i],bot[j]);
    idx.push(ct,top[j],top[i], cb,bot[i],bot[j]);}
  const g=new BG();g.setAttribute('position',new BA(new Float32Array(pos),3));g.setIndex(idx);return g;
}
function sphere(BG,BA,seg,rings){
  const pos=[],idx=[],rows=[];
  const v=(x,y,z)=>{pos.push(x,y,z);return pos.length/3-1;};
  for(let r=0;r<=rings;r++){const phi=r/rings*Math.PI,y=Math.cos(phi),rr=Math.sin(phi),row=[],m=r===0||r===rings?1:seg;
    for(let i=0;i<m;i++){const a=i/seg*Math.PI*2;row.push(v(Math.cos(a)*rr,y,Math.sin(a)*rr));}rows.push(row);}
  for(let r=0;r<rings;r++){const a=rows[r],b=rows[r+1];
    if(a.length===1){for(let i=0;i<b.length;i++)idx.push(a[0],b[i],b[(i+1)%b.length]);}
    else if(b.length===1){for(let i=0;i<a.length;i++)idx.push(a[i],b[0],a[(i+1)%a.length]);}
    else for(let i=0;i<seg;i++){const j=(i+1)%seg;idx.push(a[i],b[i],a[j], a[j],b[i],b[j]);}}
  const g=new BG();g.setAttribute('position',new BA(new Float32Array(pos),3));g.setIndex(idx);return g;
}
function addMesh(geo,mat,order){
  const m=new api.Mesh(geo,mat);m.frustumCulled=true;m.castShadow=false;m.receiveShadow=false;m.renderOrder=order;m.userData.crew=1;
  root.add(m);return m;
}
function tube(mat,order){const m=addMesh(api.cyl,mat,order);tubes.push(m);return m;}
function ball(mat,order){const m=addMesh(api.ball,mat,order);spheres.push(m);return m;}
function calibrate(X){
  // GLB nodes sit at the model origin; the bulbs are in the vertex buffer. Use mesh bounds.
  X.car.updateMatrixWorld(true);
  const inv=X.car.matrixWorld.clone();if(inv.invert)inv.invert();
  const Box=X.THREE_Box3;let hx=0,hn=0,tx=0,tn=0;
  if(Box)X.car.traverse(o=>{
    if(!o.isMesh)return;const mat=o.userData&&o.userData.mat;if(mat!=='LIGHT'&&mat!=='REARLIGHT')return;
    const c=new Box().setFromObject(o).getCenter(new api.V()).applyMatrix4(inv);
    if(!Number.isFinite(c.x))return;
    if(mat==='LIGHT'){hx+=c.x;hn++;}else{tx+=c.x;tn++;}
  });
  // Nose is the headlight end. char +z (forward) maps onto that car X.
  // Right-handed Y-up: car right is +Z when the nose is +X, so the same sign maps char +x (right).
  if(hn&&tn&&Math.abs(hx/hn-tx/tn)>0.15){AX.fx=hx/hn>tx/tn?1:-1;AX.fz=AX.fx;AX.ok=true;}
  else{AX.fx=1;AX.fz=1;AX.ok=false;}
  AX.lights=[hn,tn,hn?+(hx/hn).toFixed(2):0,tn?+(tx/tn).toFixed(2):0];
}
function build(X){
  if(!grab(X))return false;
  calibrate(X);
  root=new api.Group();root.name='crew';X.car.add(root);
  const C=D.char,sh=D.SH[C.gender]||D.SH.female,fem=C.gender!=='male';
  const leg=sh.limb,arm=fem?.88:1; // drawChar: thigh gets a slight extra, arms use lw .88
  st.charSeg=[
    seg('hipL','kneeL',.075*(fem?1.04:1)*leg),seg('kneeL','ankL',.055*leg),seg('ankL','toeL',.04*leg),
    seg('hipR','kneeR',.075*(fem?1.04:1)*leg),seg('kneeR','ankR',.055*leg),seg('ankR','toeR',.04*leg),
    seg('shL','elL',.05*arm),seg('elL','wrL',.04*arm),seg('wrL','handL',.032*arm),
    seg('shR','elR',.05*arm),seg('elR','wrR',.04*arm),seg('wrR','handR',.032*arm),
    seg('neck','chin',sh.neckW)
  ];
  st.head=ball(charCore,3);st.headG=ball(charGlow,3);
  st.torso=ball(charCore,3);st.torsoG=ball(charGlow,3);
  st.visor=tube(charCore,3);
  st.hairT=[0,1,2,3].map(()=>tube(charCore,3));
  st.hairB=[0,1].map(()=>ball(charCore,3));
  st.petPool=Array.from({length:24},()=>({core:tube(petCore,3),glow:tube(petGlow,3)}));
  st.petHead=ball(petCore,3);st.petHeadG=ball(petGlow,3);
  st.eyes=[0,1].map(()=>ball(eyeMat,3));
  st.built=true;root.visible=false;return true;
}
function seg(a,b,r){return {a,b,r,core:tube(charCore,3),glow:tube(charGlow,3)};}
function hideAll(){for(const m of tubes)m.visible=false;for(const m of spheres)m.visible=false;}
function placeTube(mesh,x0,y0,z0,x1,y1,z1,rad){
  const dx=x1-x0,dy=y1-y0,dz=z1-z0,len=Math.hypot(dx,dy,dz);
  if(!(len>1e-4)||!(rad>0)){mesh.visible=false;return;}
  mesh.visible=true;mesh.matrixAutoUpdate=true;
  mesh.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);
  const dxn=dx/len,dyn=dy/len,dzn=dz/len;
  if(dyn<-.999)mesh.quaternion.set(1,0,0,0);
  else mesh.quaternion.setFromUnitVectors(tmp.up,tmp.d.set(dxn,dyn,dzn));
  mesh.scale.set(rad,len,rad);
}
function placeBall(mesh,x,y,z,rx,ry,rz){
  if(!(rx>0)){mesh.visible=false;return;}
  mesh.visible=true;mesh.matrixAutoUpdate=true;mesh.quaternion.identity();
  mesh.position.set(x,y,z);mesh.scale.set(rx,ry==null?rx:ry,rz==null?rx:rz);
}
function mapJ(J,name,out){
  const p=J[name];if(!p)return null;
  out.x=p[2]*AX.fx;out.y=p[1];out.z=p[0]*AX.fz;return out;
}
function basis(J){
  const h=J.head,t=J.top;
  let ux=t[0]-h[0],uy=t[1]-h[1],uz=t[2]-h[2],ul=Math.hypot(ux,uy,uz)||1;ux/=ul;uy/=ul;uz/=ul;
  const yaw=(J._yaw||0)*Math.PI/180;
  let fx=Math.sin(yaw),fy=0,fz=Math.cos(yaw),dot=fx*ux+fy*uy+fz*uz;
  fx-=ux*dot;fy-=uy*dot;fz-=uz*dot;let fl=Math.hypot(fx,fy,fz)||1;fx/=fl;fy/=fl;fz/=fl;
  const rx=uy*fz-uz*fy,ry=uz*fx-ux*fz,rz=ux*fy-uy*fx;
  const P=(right,up,fwd)=>[h[0]+rx*right+ux*up+fx*fwd,h[1]+ry*right+uy*up+fy*fwd,h[2]+rz*right+uz*up+fz*fwd];
  return P;
}
function hairOf(style,J){
  const P=basis(J),sw=Math.sin(performance.now()/260)*.045,segs=[],balls=[];
  if(style==='ponytail'){segs.push([P(0,.05,-.04),P(sw,-.20,-.16),.034],[P(sw,-.20,-.16),P(sw*1.6,-.36,-.12),.026]);}
  else if(style==='long'){segs.push([P(.08,.02,-.02),P(.1,-.42,-.06),.03],[P(-.08,.02,-.02),P(-.1,-.42,-.06),.03]);}
  else if(style==='bob'){segs.push([P(.1,.02,.02),P(.12,-.12,-.02),.032],[P(-.1,.02,.02),P(-.12,-.12,-.02),.032]);}
  else if(style==='spiky'){segs.push([P(0,.02,0),P(0,.16,.02),.02],[P(.06,0,.02),P(.1,.12,.04),.016],[P(-.06,0,.02),P(-.1,.12,.04),.016]);}
  else if(style==='buns'){balls.push([P(.08,.08,-.02),.04],[P(-.08,.08,-.02),.04]);}
  else if(style==='short'){segs.push([P(0,.06,.04),P(0,.1,.06),.02]);}
  return {segs,balls};
}
function showSeg(pair,A,B,r){
  if(!A||!B){pair.core.visible=false;pair.glow.visible=false;return;}
  placeTube(pair.core,A.x,A.y,A.z,B.x,B.y,B.z,r);
  placeTube(pair.glow,A.x,A.y,A.z,B.x,B.y,B.z,r*2.15);
}
function drawChar(pose){
  const C=D.char,sh=D.SH[C.gender]||D.SH.female,J=D.fk(pose,sh);J._yaw=pose.yaw||0;
  paint('c',C.glow);
  const A=tmp.a,B=tmp.b;
  for(const s of st.charSeg){const a=mapJ(J,s.a,A),b=mapJ(J,s.b,B);if(!a||!b){s.core.visible=s.glow.visible=false;continue;}
    const ax=a.x,ay=a.y,az=a.z;mapJ(J,s.b,B);showSeg(s,{x:ax,y:ay,z:az},{x:B.x,y:B.y,z:B.z},s.r);}
  const hd=mapJ(J,'head',A);if(!hd)return;
  const hx0=hd.x,hy0=hd.y,hz0=hd.z;
  const hr=D.B.head*.5*((C.gender==='male')?.9:.88);
  placeBall(st.head,hx0,hy0,hz0,hr*.9,hr,hr*.86);
  placeBall(st.headG,hx0,hy0,hz0,hr*1.55,hr*1.7,hr*1.45);
  // torso ellipsoid along the spine, shoulder-wide — the solid neon body from drawChar
  const pel=mapJ(J,'pel',A),ch=mapJ(J,'chest',tmp.d),sL=mapJ(J,'shL',B);
  if(pel&&ch&&sL){
    const sR=J.shR?[J.shR[2]*AX.fx,J.shR[1],J.shR[0]*AX.fz]:null;
    const hx=(sL.x+(sR?sR[0]:sL.x))/2,hy=(sL.y+(sR?sR[1]:sL.y))/2,hz=(sL.z+(sR?sR[2]:sL.z))/2;
    let yx=hx-pel.x,yy=hy-pel.y,yz=hz-pel.z,yl=Math.hypot(yx,yy,yz)||1;yx/=yl;yy/=yl;yz/=yl;
    let xx=(sR?sR[0]:sL.x)-sL.x,xy=(sR?sR[1]:sL.y)-sL.y,xz=(sR?sR[2]:sL.z)-sL.z,xl=Math.hypot(xx,xy,xz)||1;
    xx/=xl;xy/=xl;xz/=xl;
    // z = x cross y
    let zx=xy*yz-xz*yy,zy=xz*yx-xx*yz,zz=xx*yy-xy*yx,zl=Math.hypot(zx,zy,zz)||1;zx/=zl;zy/=zl;zz/=zl;
    const cx=(pel.x+hx)/2,cy=(pel.y+hy)/2,cz=(pel.z+hz)/2;
    const sx=Math.max(sh.sh*.92,.08),sy=yl*.55,sz=sh.torsoD*.55;
    ellipsoid(st.torso,cx,cy,cz,xx,xy,xz,yx,yy,yz,zx,zy,zz,sx,sy,sz);
    ellipsoid(st.torsoG,cx,cy,cz,xx,xy,xz,yx,yy,yz,zx,zy,zz,sx*1.35,sy*1.25,sz*1.45);
  } else {st.torso.visible=st.torsoG.visible=false;}
  const P=basis(J),v0=P(-.05,.01,.075),v1=P(.05,.01,.075);
  const q0={x:v0[2]*AX.fx,y:v0[1],z:v0[0]*AX.fz},q1={x:v1[2]*AX.fx,y:v1[1],z:v1[0]*AX.fz};
  placeTube(st.visor,q0.x,q0.y,q0.z,q1.x,q1.y,q1.z,.012);
  const hair=hairOf(D.HAIRS.includes(C.hair)?C.hair:'ponytail',J);
  st.hairT.forEach((m,i)=>{const s=hair.segs[i];if(!s){m.visible=false;return;}
    const a={x:s[0][2]*AX.fx,y:s[0][1],z:s[0][0]*AX.fz},b={x:s[1][2]*AX.fx,y:s[1][1],z:s[1][0]*AX.fz};
    placeTube(m,a.x,a.y,a.z,b.x,b.y,b.z,s[2]);});
  st.hairB.forEach((m,i)=>{const s=hair.balls[i];if(!s){m.visible=false;return;}
    placeBall(m,s[0][2]*AX.fx,s[0][1],s[0][0]*AX.fz,s[1]);});
  st.headY=hy0;st.headX=hx0;st.headZ=hz0;
}
function ellipsoid(mesh,cx,cy,cz,xx,xy,xz,yx,yy,yz,zx,zy,zz,sx,sy,sz){
  mesh.visible=true;mesh.matrixAutoUpdate=false;
  const e=mesh.matrix.elements;
  e[0]=xx*sx;e[1]=xy*sx;e[2]=xz*sx;e[3]=0;
  e[4]=yx*sy;e[5]=yy*sy;e[6]=yz*sy;e[7]=0;
  e[8]=zx*sz;e[9]=zy*sz;e[10]=zz*sz;e[11]=0;
  e[12]=cx;e[13]=cy;e[14]=cz;e[15]=1;
  mesh.matrixWorldNeedsUpdate=true;
}
function drawPet(q,type){
  const J=D.petFk(q,type),parts=D.petParts(type);
  paint('p',D.pet.glow);
  let i=0;
  for(const [a,b,r] of parts){
    const slot=st.petPool[i++];if(!slot)break;
    const A=J[a],B=J[b];
    if(!A||!B){slot.core.visible=slot.glow.visible=false;continue;}
    if(a===b){slot.core.visible=slot.glow.visible=false;
      placeBall(st.petHead,A[2]*AX.fx,A[1],A[0]*AX.fz,r*.92);
      placeBall(st.petHeadG,A[2]*AX.fx,A[1],A[0]*AX.fz,r*1.55);
      continue;}
    else {
      const ax=A[2]*AX.fx,ay=A[1],az=A[0]*AX.fz,bx=B[2]*AX.fx,by=B[1],bz=B[0]*AX.fz;
      placeTube(slot.core,ax,ay,az,bx,by,bz,r);
      placeTube(slot.glow,ax,ay,az,bx,by,bz,r*1.85);
    }
  }
  for(;i<st.petPool.length;i++){st.petPool[i].core.visible=false;st.petPool[i].glow.visible=false;}
  // big friendly eyes, same joints the canvas pet draws in white
  ['L','R'].forEach((k,n)=>{
    const e=J['eye'+k],m=st.eyes[n];
    if(!e){m.visible=false;return;}
    placeBall(m,e[2]*AX.fx,e[1],e[0]*AX.fz,.02);
  });
  const h=J.head;st.petX=h?h[2]*AX.fx:0;st.petY=h?h[1]:0;st.petZ=h?h[0]*AX.fz:0;
}
function hatchOpen(){
  const H=ZGL&&ZGL.GL&&ZGL.GL.hatch,g=P.tf||0;
  if(!H||!(H[1]>H[0]))return g;
  const u=(g-H[0])/(H[1]-H[0]);return u<0?0:u>1?1:u;
}
function petPose(dt){
  const type=D.PET_RIG[D.pet.type]?D.pet.type:'fox';
  const wings=P.wings&&P.tf>0;
  if(wings&&!st.open){st.open=true;st.tkOn=true;st.tk=0;}
  if(!P.wings&&P.tf<=0){st.open=false;st.tkOn=false;st.tk=0;}
  if(st.tkOn){st.tk+=dt/D.PET_CLIPS.takeoff.len;if(st.tk>=1){st.tkOn=false;st.tk=1;}}
  const ht=hatchOpen();st.hatch=ht;
  const rideT=(t%D.PET_CLIPS.ride.len)/D.PET_CLIPS.ride.len;
  let q;
  if(st.tkOn){q=D.PET_CLIPS.takeoff.f(Math.min(st.tk,.999),type);st.phase='takeoff';}
  else {q=D.rideFor(rideT,type,ht);st.phase=D.flyMix(ht)>.55?'fly':'ride';}
  st.type=type;st.tkU=st.tkOn?st.tk:0;
  return {q,type};
}
function update(){
  const X=xray();if(!X)return;
  if(!st.built&&!build(X))return;
  const now=performance.now(),dt=Math.min(.05,clock? (now-clock)/1000 : 0);clock=now;
  if(!(flying&&paused))t+=dt;
  hideUnused();
  const pose=D.sitPose((t%4)/4);
  drawChar(pose);
  const pet=petPose(flying&&paused?0:dt);
  drawPet(pet.q,pet.type);
  root.visible=true;st.ready=true;
}
function hideUnused(){
  // draw functions show what they use; pool leftovers are hidden in drawPet
}
window.CREW={
  update,
  get state(){return {phase:st.phase,tk:st.tkOn?+st.tk.toFixed(3):0,hatch:+st.hatch.toFixed(3),type:st.type||D.pet.type,ready:st.ready,fx:AX.fx,fz:AX.fz,axis:AX.ok,head:st.headX!=null?[+st.headX.toFixed(3),+st.headY.toFixed(3),+st.headZ.toFixed(3)]:null,pet:st.petX!=null?[+st.petX.toFixed(3),+st.petY.toFixed(3),+st.petZ.toFixed(3)]:null,char:D.char.glow,hair:D.char.hair,petGlow:D.pet.glow,spot:D.pet.spot};},
  reload(){const r=D.reload();charHex='';petHex='';return r;},
  axis(fx,fz){AX.fx=fx;AX.fz=fz==null?fx:fz;AX.ok=true;}
};
})();
