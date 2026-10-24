/* CREW LOOK — sleek Neon Woman / Neon Man inside the Z, plus on-foot playback.
   Pet meshes are NOT rebuilt here. drawPet / petFk / petParts stay the fox, cat,
   dragon, and robo-dog tubes from CREWDATA. Signature dances and zdash.petdance.v1
   only change pose fields (wag, bob, pitch, flap, …). */
(function(){'use strict';
const D=window.CREWDATA;if(!D)return;
const AX={fx:1,fz:1,ok:false};
const st={phase:'ride',tk:0,tkOn:false,open:false,hatch:0,ready:false,type:'',built:false,who:'girl',gait:'sit',onFoot:false,danceName:null};
let root=null,api=null,t=0,clock=0;
const tubes=[],spheres=[];
let charCore=null,charGlow=null,petCore=null,petGlow=null,eyeMat=null;
let charHex='',petHex='';
const tmp={};
const SIG=2.6;
const HKEY='zdash.customdance.v1',PKEY='zdash.petdance.v1',CKEY='zdash.crew.v1';
let hRaw=null,hSlot=null,pRaw=null,pSlot=null,modeRaw=null,modeVal='signature';
let hSpin=0,pSpin=0,lastX=null,lastZ=null,strideAcc=0,stepAcc=0;
const rings=[];
const petFollow={onFoot:false,x:0,y:0,z:0,yaw:0,vx:0,vz:0,speed:0,phase:0,gait:'idle',jumpY:0,jumpVy:0};
let footMove=null,footNow=0,footDt=0,footStepped=false,carSpriteDirty=false;
const DANCE_NAME={fox:'NOVA FOX',cat:'NEON KITTY',dragon:'MINI DRAGON',robo:'CYBER PUP',dog:'CYBER PUP',bunny:'STAR BUNNY'};
const LOOK={
  girl:{name:'WOMAN',pony:1,hip:.10,shoulder:.15,thigh:.40,shin:.38,torso:.40,neck:.045,head:.125,uarm:.26,farm:.23,armR:.036,legR:.055,
    cloth:'#1c0e22',cloth2:'#2a1434',trim:'#ff4ad8',accent:'#3ee6ff',sole:'#ffe14d',hair:'#ff4ad8',
    torso3:.34,neck3:.04,head3:.096,shoulder3:.115,hip3:.07,uarm3:.20,farm3:.18,armR3:.03,thigh3:.20,shin3:.17,legR3:.042,bodyR:.085},
  boy:{name:'MAN',hood:1,hip:.11,shoulder:.185,thigh:.42,shin:.40,torso:.42,neck:.05,head:.12,uarm:.28,farm:.24,armR:.042,legR:.06,
    cloth:'#10161f',cloth2:'#1a2838',trim:'#3ee6ff',accent:'#7aa6ff',sole:'#b6ff4a',hair:'#102033',
    torso3:.36,neck3:.045,head3:.10,shoulder3:.14,hip3:.078,uarm3:.21,farm3:.19,armR3:.034,thigh3:.20,shin3:.17,legR3:.046,bodyR:.10}
};
function wearLook(who){
  const base=LOOK[who]||LOOK.girl;
  const W=window.CHARCLOSET&&CHARCLOSET.wear&&CHARCLOSET.wear();
  if(!W||!W.parts)return base;
  const p=W.parts,c=W.colors||{};
  const short=p.body==='short';
  const head3=0.16,torso3=short?0.18:0.22,thigh3=short?0.12:0.15,shin3=short?0.11:0.14;
  const uarm3=short?0.11:0.13,farm3=short?0.10:0.12;
  const top=c.top||c.shirt||base.cloth,bottom=c.bottom||c.pants||base.cloth2;
  const hair=p.hair||'ponytail',hands=p.hands==='gloves'?'gloves':'mittens';
  return Object.assign({},base,{
    head:0.30,torso:torso3,thigh:thigh3,shin:shin3,neck:.045,uarm:uarm3,farm:farm3,
    head3:head3,torso3:torso3,neck3:.045,thigh3:thigh3,shin3:shin3,uarm3:uarm3,farm3:farm3,
    cloth:top,cloth2:bottom,hair:c.hair||base.hair,sole:c.shoes||'#ffffff',
    trim:'#3ee6ff',accent:c.eye||'#3ee6ff',skin:c.skin||'#f2c7a5',hands:c.hands||c.skin||'#f2c7a5',
    pony:hair==='ponytail'||hair==='long'?1:0,hood:(p.top||p.shirt)==='hoodie'?1:0,
    hairStyle:hair,handStyle:hands,headShape:'round',hat:'none',shoes:p.shoes||'sneakers',
    shorts:(p.bottom||p.pants)==='shorts'?1:0,face:'smile'
  });
}
let wearStamp='';
function blank(){const o=()=>({rotation:{x:0,y:0,z:0},position:{x:0,y:0,z:0}});
  return {head:o(),torso:o(),armL:o(),armR:o(),legL:o(),legR:o(),elbowL:o(),elbowR:o(),kneeL:o(),kneeR:o(),pelvis:o()};}
const logical={girl:blank(),boy:blank()};

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
  if(which==='c'){if(charHex===hex||!charCore)return;charHex=hex;charCore.color.set(hex);charGlow.color.set(hex);}
  else {if(petHex===hex||!petCore)return;petHex=hex;petCore.color.set(hex);petGlow.color.set(hex);}
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
  api={X,Mesh:mesh.constructor,Group:X.car.constructor,BG,BA,V,cyl:cylinder(BG,BA,8),ball:sphere(BG,BA,8,6),seed};
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
  X.car.updateMatrixWorld(true);
  const inv=X.car.matrixWorld.clone();if(inv.invert)inv.invert();
  const Box=X.THREE_Box3;let hx=0,hn=0,tx=0,tn=0;
  if(Box)X.car.traverse(o=>{
    if(!o.isMesh)return;const mat=o.userData&&o.userData.mat;if(mat!=='LIGHT'&&mat!=='REARLIGHT')return;
    const c=new Box().setFromObject(o).getCenter(new api.V()).applyMatrix4(inv);
    if(!Number.isFinite(c.x))return;
    if(mat==='LIGHT'){hx+=c.x;hn++;}else{tx+=c.x;tn++;}
  });
  if(hn&&tn&&Math.abs(hx/hn-tx/tn)>0.15){AX.fx=hx/hn>tx/tn?1:-1;AX.fz=AX.fx;AX.ok=true;}
  else{AX.fx=1;AX.fz=1;AX.ok=false;}
  AX.lights=[hn,tn,hn?+(hx/hn).toFixed(2):0,tn?+(tx/tn).toFixed(2):0];
}
function solid(hex){
  const m=api.seed.clone();m.map=null;m.alphaMap=null;m.color.set(hex);
  m.transparent=false;m.opacity=1;m.blending=1;m.depthWrite=true;m.depthTest=true;
  m.side=2;m.fog=false;if('toneMapped' in m)m.toneMapped=false;m.userData.crew=1;return m;
}
function M(geo,mat,parent,x,y,z,sx,sy,sz,rx,ry,rz){
  const m=new api.Mesh(geo,mat);m.frustumCulled=false;m.castShadow=false;m.receiveShadow=false;m.renderOrder=3;
  m.position.set(x||0,y||0,z||0);m.scale.set(sx==null?1:sx,sy==null?1:sy,sz==null?1:sz);
  if(rx||ry||rz)m.rotation.set(rx||0,ry||0,rz||0);m.userData.crew=1;parent.add(m);return m;
}
function grp(){const g=new api.Group();g.frustumCulled=false;return g;}
function buildRig(look){
  const pelvis=grp(),torso=grp(),head=grp(),armL=grp(),armR=grp(),elbowL=grp(),elbowR=grp(),legL=grp(),legR=grp(),kneeL=grp(),kneeR=grp();
  const group=grp();group.add(pelvis);pelvis.add(torso);pelvis.add(legL);pelvis.add(legR);
  torso.add(head);torso.add(armL);torso.add(armR);armL.add(elbowL);armR.add(elbowR);legL.add(kneeL);legR.add(kneeR);
  head.position.y=look.torso3+look.neck3;
  armL.position.set(-look.shoulder3,look.torso3*.92,0);armR.position.set(look.shoulder3,look.torso3*.92,0);
  elbowL.position.y=-look.uarm3;elbowR.position.y=-look.uarm3;
  legL.position.x=-look.hip3;legR.position.x=look.hip3;
  kneeL.position.y=-look.thigh3;kneeR.position.y=-look.thigh3;
  const cloth=solid(look.cloth),pants=solid(look.cloth2),trim=solid('#3ee6ff'),hair=solid(look.hair),sole=solid(look.sole||'#fff'),skin=solid(look.skin||'#f2c7a5');
  const handHex=look.handStyle==='gloves'?(look.hands||'#222'):(look.hands||look.skin||'#f2c7a5');
  const handM=solid(handHex),eye=solid(look.accent||'#3ee6ff');
  const hx=look.head3*(look.headShape==='square'?1.08:.96),hy=look.head3*(look.headShape==='tall'?1.18:look.headShape==='square'?.9:1);
  M(api.cyl,cloth,torso,0,look.torso3*.48,0,look.bodyR*1.2,look.torso3,look.bodyR);
  M(api.ball,skin,head,0,hy*.12,0,hx,hy,hx*.95);
  M(api.ball,eye,head,-.028,.01,hx*.82,.012,look.face==='wink'?.004:.012,.008);
  M(api.ball,eye,head,.028,.01,hx*.82,.012,.012,.008);
  if(look.hairStyle==='bob'||look.hairStyle==='long'||look.hairStyle==='ponytail')M(api.ball,hair,head,0,hy*.35,-.02,hx*1.02,hy*.42,hx);
  if(look.pony)M(api.cyl,hair,head,0,-hy*(look.hairStyle==='long'?.35:.05),-hx*.8,.018,look.hairStyle==='long'?hy*1.1:hy*.55,.018,.4,0,0);
  if(look.hairStyle==='curls'){M(api.ball,hair,head,-hx*.75,hy*.1,0,.028,.028,.028);M(api.ball,hair,head,hx*.75,hy*.1,0,.028,.028,.028);M(api.ball,hair,head,0,hy*.55,0,.03,.03,.03);}
  if(look.hood)M(api.ball,cloth,head,0,hy*.15,-.02,hx*1.18,hy*1.15,hx*1.05);
  if(look.hat==='cap'||look.hat==='beanie'){const hatM=solid(look.hatColor||look.cloth);M(api.cyl,hatM,head,0,hy*.72,0,hx*.85,.03,hx*.7);}
  [[armL,elbowL],[armR,elbowR]].forEach(([arm,elb])=>{
    M(api.cyl,cloth,arm,0,-look.uarm3*.5,0,look.armR3*1.25,look.uarm3,look.armR3*1.25);
    M(api.cyl,trim,arm,0,-look.uarm3*.2,0,look.armR3*1.45,.008,look.armR3*1.45);
    M(api.cyl,skin,elb,0,-look.farm3*.5,0,look.armR3,look.farm3,look.armR3);
    if(look.handStyle==='fingers'){
      M(api.cyl,handM,elb,-.012,-look.farm3,0,.005,.028,.005);
      M(api.cyl,handM,elb,0,-look.farm3,.006,.005,.03,.005);
      M(api.cyl,handM,elb,.012,-look.farm3,0,.005,.026,.005);
    }else M(api.ball,handM,elb,0,-look.farm3,0,look.armR3*(look.handStyle==='gloves'?1.2:1),look.armR3*.75,look.armR3);
  });
  [[legL,kneeL],[legR,kneeR]].forEach(([leg,knee])=>{
    M(api.cyl,pants,leg,0,-look.thigh3*.5,0,look.legR3*1.05,look.thigh3,look.legR3*1.05);
    M(api.cyl,pants,knee,0,-look.shin3*(look.shorts?0.28:0.5),0,look.legR3*.9,look.shin3*(look.shorts?0.55:1),look.legR3*.9);
    if(look.shoes!=='none')M(api.cyl,sole,knee,0,-look.shin3,.04,.042,.09,.028,Math.PI/2,0,0);
  });
  return {group,parts:{pelvis,torso,head,armL,armR,legL,legR,elbowL,elbowR,kneeL,kneeR}};
}
function syncMap(map){
  map.matrixAutoUpdate=false;const e=map.matrix.elements,fx=AX.fx,fz=AX.fz;
  e[0]=0;e[1]=0;e[2]=fz;e[3]=0;
  e[4]=0;e[5]=1;e[6]=0;e[7]=0;
  e[8]=fx;e[9]=0;e[10]=0;e[11]=0;
  e[12]=-.17*fx;e[13]=.375;e[14]=-.35*fz;e[15]=1;
  map.matrixWorldNeedsUpdate=true;
}
function build(X){
  if(!grab(X))return false;
  calibrate(X);
  root=new api.Group();root.name='crew';X.car.add(root);
  st.map=grp();st.map.name='crew-map';root.add(st.map);syncMap(st.map);
  st.rigs={girl:buildRig(wearLook('girl')),boy:buildRig(wearLook('boy'))};
  wearStamp=(window.CHARCLOSET&&CHARCLOSET.key)?CHARCLOSET.key():'';
  st.map.add(st.rigs.girl.group);st.map.add(st.rigs.boy.group);
  st.petPool=Array.from({length:24},()=>({core:tube(petCore,3),glow:tube(petGlow,3)}));
  st.petHead=ball(petCore,3);st.petHeadG=ball(petGlow,3);
  st.eyes=[0,1].map(()=>ball(eyeMat,3));
  st.built=true;root.visible=false;return true;
}
function applySpec(parts,spec){
  parts.pelvis.position.y=spec.bob||0;
  parts.pelvis.rotation.z=(spec.sway||0)*.35;
  parts.torso.rotation.x=spec.lean||0;
  parts.torso.rotation.y=spec.twist||0;
  parts.torso.rotation.z=spec.sway||0;
  parts.head.rotation.x=spec.headPitch||0;
  parts.head.rotation.y=spec.headYaw||0;
  const out=spec.armOut==null?0.2:spec.armOut;
  parts.armL.rotation.x=-(spec.armL||0);parts.armR.rotation.x=-(spec.armR||0);
  parts.armL.rotation.z=-out;parts.armR.rotation.z=out;
  parts.elbowL.rotation.x=spec.elbL||0;parts.elbowR.rotation.x=spec.elbR||0;
  parts.legL.rotation.x=-(spec.legL||0);parts.legR.rotation.x=-(spec.legR||0);
  parts.kneeL.rotation.x=spec.kneeL||0;parts.kneeR.rotation.x=spec.kneeR||0;
}
function sitSpec(time){
  const b=Math.sin((time||0)*Math.PI*2);
  return {bob:.006*b,lean:-.42,sway:.02*b,twist:0,headYaw:.08*Math.sin((time||0)*1.3),headPitch:-.12,
    armL:.95,armR:.95,elbL:1.15,elbR:1.15,legL:.85,legR:.85,kneeL:1.15,kneeR:1.15,armOut:.22};
}
function pinHead(head){
  if(!head||!head.getWorldPosition||!api)return;
  try{
    if(root)root.updateMatrixWorld(true);
    const v=tmp.p;head.getWorldPosition(v);
    const inv=api.X.car.matrixWorld.clone();if(inv.invert)inv.invert();v.applyMatrix4(inv);
    if(Number.isFinite(v.x)){st.headX=v.x;st.headY=v.y;st.headZ=v.z;}
  }catch(e){}
}
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
function readText(key){try{return localStorage.getItem(key)||'';}catch(e){return '';}}
function parseSlot(text,dur,name){
  try{
    const o=JSON.parse(text||'null');
    if(!o||o.version!==1||o.enabled===false||!o.slots||!o.slots.length)return null;
    const sl=o.slots[o.activeSlot|0]||o.slots[0];
    if(!sl||!sl.frames||!sl.frames.length)return null;
    return {name:sl.name||name,duration:sl.duration>0?sl.duration:dur,frames:sl.frames};
  }catch(e){return null;}
}
function sampleFrames(sl,tSec,fields){
  if(!sl)return null;
  const dur=sl.duration||8,u=((tSec%dur)+dur)%dur/dur,f=sl.frames.slice().sort((a,b)=>(+a.t||0)-(+b.t||0));
  const pack=(a,b,k)=>{const o={u,duration:dur,name:sl.name,spin:(a.spin||(b&&b.spin))?1:0};for(const key of fields){const p=+a[key]||0,q=b?+b[key]||0:p;o[key]=p+(q-p)*(k||0);}return o;};
  if(f.length===1)return pack(f[0],null,0);
  let i=0;for(;i<f.length;i++)if((+f[i].t||0)>u)break;
  const b=f[i%f.length],a=f[(i-1+f.length)%f.length];
  let span=(+b.t||0)-(+a.t||0);if(span<=1e-6)span+=1;
  let du=u-(+a.t||0);if(du<0)du+=1;const k=du/span<0?0:du/span>1?1:du/span;
  return pack(a,b,k);
}
function humanClip(){
  if(window.CREWSTATE&&CREWSTATE.dance)return CREWSTATE.dance();
  const text=readText(HKEY);if(text!==hRaw){hRaw=text;hSlot=parseSlot(text,8,'CUSTOM');}return hSlot;
}
function petClip(){
  if(window.CREWSTATE&&CREWSTATE.petClip)return CREWSTATE.petClip();
  const text=readText(PKEY);if(text!==pRaw){pRaw=text;pSlot=parseSlot(text,6,'MY DOG');}return pSlot;
}
function sampleHuman(tSec){
  if(window.CREWSTATE&&CREWSTATE.sample)return CREWSTATE.sample(tSec);
  return sampleFrames(humanClip(),tSec,['armL','armR','legL','legR','sway','bounce']);
}
function samplePet(tSec){
  if(window.CREWSTATE&&CREWSTATE.samplePet)return CREWSTATE.samplePet(tSec);
  return sampleFrames(petClip(),tSec,['hop','wag','pawL','pawR','bow','sway']);
}
let hObjRaw='',hObj=null,pObjRaw='',pObj=null;
function parseStore(text){try{const o=JSON.parse(text||'null');if(!o||o.version!==1||!o.slots)return null;return o;}catch(e){return null;}}
function charStore(){const text=readText(HKEY);if(text!==hObjRaw){hObjRaw=text;hObj=parseStore(text);}return hObj;}
function petStore(){const text=readText(PKEY);if(text!==pObjRaw){pObjRaw=text;pObj=parseStore(text);}return pObj;}
function usable(o){return !!(o&&o.version===1&&o.enabled!==false&&o.slots&&o.slots.length);}
function slotAt(o,i){if(!usable(o)||i<0||i>2)return null;const sl=o.slots[i];if(!sl||!sl.frames||!sl.frames.length)return null;return sl;}
function activeIndex(o){
  if(!usable(o))return -1;
  const i=o.activeSlot|0;
  if(slotAt(o,i))return i;
  for(let k=0;k<3;k++)if(slotAt(o,k))return k;
  return -1;
}
function sigOf(o){
  const i=activeIndex(o);if(i<0)return '';
  const sl=o.slots[i],f=sl.frames;
  return i+'|'+f.length+'|'+(sl.duration||0)+'|'+(sl.name||'')+'|'+JSON.stringify(f);
}
function validOpt(v){return v==='default'||v==='slot0'||v==='slot1'||v==='slot2';}
function optIndex(opt){const m=/^slot([012])$/.exec(opt||'');return m?+m[1]:-1;}
function readSavedObj(){try{const s=JSON.parse(readText(CKEY)||'null');if(s&&s.v===1)return s;}catch(e){}return {};}
function saveOpts(charOpt,petOpt){
  const prev=readSavedObj();
  const who=prev.who==='boy'||prev.who==='girl'?prev.who:whoNow();
  const data={v:1,who,charDanceOpt:charOpt,petDanceOpt:petOpt,charDanceSeen:sigOf(charStore()),petDanceSeen:sigOf(petStore())};
  try{localStorage.setItem(CKEY,JSON.stringify(data));}catch(e){}
  st.charDanceOpt=charOpt;st.petDanceOpt=petOpt;
  if(window.CREWSTATE){CREWSTATE.charDanceOpt=charOpt;CREWSTATE.petDanceOpt=petOpt;}
}
function syncDanceOpts(){
  const saved=readSavedObj();
  let charOpt=validOpt(saved.charDanceOpt)?saved.charDanceOpt:'default';
  let petOpt=validOpt(saved.petDanceOpt)?saved.petDanceOpt:'default';
  const cs=sigOf(charStore()),ps=sigOf(petStore());
  if(cs&&cs!==(saved.charDanceSeen||''))charOpt='slot'+cs.split('|')[0];
  if(ps&&ps!==(saved.petDanceSeen||''))petOpt='slot'+ps.split('|')[0];
  if(optIndex(charOpt)>=0&&!slotAt(charStore(),optIndex(charOpt)))charOpt='default';
  if(optIndex(petOpt)>=0&&!slotAt(petStore(),optIndex(petOpt)))petOpt='default';
  const dirty=charOpt!==(saved.charDanceOpt||'default')||petOpt!==(saved.petDanceOpt||'default')||cs!==(saved.charDanceSeen||'')||ps!==(saved.petDanceSeen||'');
  st.charDanceOpt=charOpt;st.petDanceOpt=petOpt;
  if(window.CREWSTATE){CREWSTATE.charDanceOpt=charOpt;CREWSTATE.petDanceOpt=petOpt;}
  if(dirty)saveOpts(charOpt,petOpt);
  return {charDanceOpt:charOpt,petDanceOpt:petOpt};
}
function danceOptions(store,classic,recorded){
  const out=[{id:'default',label:classic}];
  const o=store();
  if(!usable(o))return out;
  for(let i=0;i<3;i++){
    const sl=slotAt(o,i);if(!sl)continue;
    const name=sl.name&&String(sl.name).trim();
    out.push({id:'slot'+i,label:name?recorded(name,i):recorded('',i),name:name||''});
  }
  return out;
}
function getCharDanceOptions(){syncDanceOpts();return danceOptions(charStore,'✨ CLASSIC GROOVE',(name,i)=>name?('🎬 '+name):('🎬 ELLIE DANCE #'+(i+1)));}
function getPetDanceOptions(){syncDanceOpts();return danceOptions(petStore,'✨ SIGNATURE PET DANCE',(name,i)=>name?('🐶 '+name):('🐶 RECORDED PET DANCE #'+(i+1)));}
function setCharDanceOpt(opt){
  syncDanceOpts();
  const id=validOpt(opt)?opt:'default';
  if(optIndex(id)>=0&&!slotAt(charStore(),optIndex(id)))return st.charDanceOpt||'default';
  saveOpts(id,st.petDanceOpt||'default');
  return id;
}
function setPetDanceOpt(opt){
  syncDanceOpts();
  const id=validOpt(opt)?opt:'default';
  if(optIndex(id)>=0&&!slotAt(petStore(),optIndex(id)))return st.petDanceOpt||'default';
  saveOpts(st.charDanceOpt||'default',id);
  return id;
}
function cycleCharDance(){
  const ids=getCharDanceOptions().map(o=>o.id);
  const i=ids.indexOf(st.charDanceOpt||'default');
  return setCharDanceOpt(ids[(i+1)%ids.length]||'default');
}
function sampleSlot(o,index,tSec,fields,fallbackDur){
  const sl=slotAt(o,index);if(!sl)return null;
  return sampleFrames({name:sl.name||'',duration:sl.duration>0?sl.duration:fallbackDur,frames:sl.frames},tSec,fields);
}
function sampleHumanSelected(tSec){
  syncDanceOpts();
  const i=optIndex(st.charDanceOpt);
  if(i<0)return null;
  return sampleSlot(charStore(),i,tSec,['armL','armR','legL','legR','sway','bounce'],8);
}
function recordedSample(tSec){
  syncDanceOpts();
  const i=optIndex(st.petDanceOpt);
  if(i<0)return null;
  return sampleSlot(petStore(),i,tSec,['hop','wag','pawL','pawR','bow','sway'],6);
}
function whoNow(){
  if(window.CREWSTATE&&(CREWSTATE.who==='girl'||CREWSTATE.who==='boy'))return CREWSTATE.who;
  try{const s=JSON.parse(readText(CKEY)||'null');if(s&&(s.who==='girl'||s.who==='boy'))return s.who;}catch(e){}
  return D.char&&D.char.gender==='male'?'boy':'girl';
}
function activePet(){const typ=D.pet&&D.pet.type;return D.PET_RIG[typ]?typ:'fox';}
function tickHuman(dt,tSec,on){
  if(!on){hSpin=0;return;}
  if((st.charDanceOpt||'default')==='default'){
    const u=((tSec%8)+8)%8/8;if(builtinDance(u).spin)hSpin+=dt/8*Math.PI*2;return;
  }
  const s=sampleHumanSelected(tSec);if(s&&s.spin)hSpin+=dt/(s.duration||8)*Math.PI*2;
}
function tickPet(dt,tSec,on){
  if(!on){pSpin=0;return;}
  const s=recordedSample(tSec);if(s&&s.spin)pSpin+=dt/(s.duration||6)*Math.PI*2;
}
function baseSpec(){return {bob:0,lean:0,sway:0,twist:0,headYaw:0,headPitch:0,armL:.12,armR:.1,elbL:.3,elbR:.3,legL:0,legR:0,kneeL:.06,kneeR:.06,spin:0,armOut:.2};}
function builtinDance(u){
  const uu=((u%1)+1)%1,k=Math.floor(uu*8)%8,f=uu*8-Math.floor(uu*8),hit=Math.sin(Math.PI*f),s=k%2?1:-1;
  const spec=baseSpec();
  spec.bob=.02+.05*hit;spec.sway=s*.12*hit;spec.twist=s*.12*hit;spec.headYaw=s*.22;spec.headPitch=-.08*hit;
  spec.armL=.35;spec.armR=.35;spec.elbL=.45;spec.elbR=.45;spec.legL=.1;spec.legR=-.1;spec.kneeL=.2;spec.kneeR=.2;
  if(k===0){spec.armL=.4+1.3*hit;spec.sway=.25*hit;spec.elbL=.35;}
  if(k===1){spec.armR=.4+1.3*hit;spec.sway=-.25*hit;spec.elbR=.35;}
  if(k===2){spec.armL=2.15;spec.armR=.25;spec.elbL=.15;spec.elbR=.5;}
  if(k===3){spec.armR=2.15;spec.armL=.25;spec.elbR=.15;spec.elbL=.5;}
  if(k===4){spec.spin=1;spec.armL=1.15;spec.armR=1.15;spec.elbL=.4;spec.elbR=.4;spec.legL=.3;spec.legR=-.3;}
  if(k===5){spec.armL=1.05;spec.armR=1.05;spec.elbL=1.5;spec.elbR=1.5;spec.bob=.1*hit;spec.kneeL=.55;spec.kneeR=.55;}
  if(k===6){spec.sway=.32*s;spec.lean=-.18;spec.armL=1.4;spec.armR=1.4;spec.elbL=.6;spec.elbR=.6;}
  if(k===7){spec.armL=2.3;spec.armR=.15;spec.legR=.45;spec.kneeR=.5;spec.headPitch=-.25;}
  return spec;
}
function customSpec(sm){
  const spec=baseSpec();
  spec.armL=(+sm.armL||0)*.95*Math.PI;spec.armR=(+sm.armR||0)*.95*Math.PI;
  spec.elbL=.4+(+sm.armL||0)*.5;spec.elbR=.4+(+sm.armR||0)*.5;
  spec.legL=(+sm.legL||0)*48*Math.PI/180;spec.legR=(+sm.legR||0)*48*Math.PI/180;
  spec.kneeL=.15+Math.abs(+sm.legL||0)*.7;spec.kneeR=.15+Math.abs(+sm.legR||0)*.7;
  spec.sway=(+sm.sway||0)*14*Math.PI/180;spec.bob=(+sm.bounce||0)*.14;
  spec.spin=sm.spin?1:0;spec.headYaw=(+sm.sway||0)*.2;
  spec.dance=sm.name||'CUSTOM';
  return spec;
}
function humanSpec(gait,phase,tSec,allowCustom){
  let spec;
  if(gait==='dance'){
    if(allowCustom!==false){const sm=sampleHumanSelected(tSec);if(sm)spec=customSpec(sm);}
    if(!spec)spec=builtinDance(((tSec%8)+8)%8/8);
  }else{
    spec=baseSpec();const s=Math.sin((phase||0)*Math.PI*2);
    if(gait!=='walk'&&gait!=='run'){
      const b=Math.sin((phase||0)*Math.PI*2);
      spec.bob=.016*b;spec.headYaw=.18*Math.sin((phase||0)*Math.PI*2*.37);spec.headPitch=.04*b;
      spec.sway=.03*b;spec.armL=.12;spec.armR=.1;spec.elbL=spec.elbR=.28;spec.kneeL=spec.kneeR=.06;
    }else{
      const run=gait==='run',A=(run?48:28)*Math.PI/180;
      spec.armL=-A*s;spec.armR=A*s;spec.legL=A*s;spec.legR=-A*s;
      spec.sway=(run?0.05:0.07)*Math.sin((phase||0)*Math.PI*4);
      spec.lean=run?12*Math.PI/180:.04;
      spec.elbL=spec.elbR=run?0.7:0.4;
      spec.kneeL=.1+Math.max(0,-spec.legL)*1.05;spec.kneeR=.1+Math.max(0,-spec.legR)*1.05;
      spec.bob=(run?0.04:0.02)*Math.abs(s);spec.headPitch=run?-.12:-.04;
    }
  }
  spec.gait=gait;spec.phase=phase||0;
  return spec;
}
function qFill(o){
  const q={tailCurl:0,earFold:0,tailDown:0,fold:0,pitch:0,x:0,y:0,z:0,yaw:0,ph:0,amp:0,sit:0,bob:0,tuck:0,wag:0,tilt:0,look:0,pawUp:0,flap:0};
  if(o)for(const k in o)q[k]=o[k];return q;
}
function danceDog(u){
  const q=qFill(),k=Math.floor(u*4)%4,f=u*4-Math.floor(u*4),hit=Math.sin(Math.PI*f);
  q.wag=Math.sin(u*Math.PI*16)*.95;q.ph=u*4;q.amp=.35;
  if(k===0||k===2){q.pitch=-32*hit;q.look=-10*hit;q.bob=.004;}
  else if(k===1){q.amp=.95;q.pawUp=.08;q.bob=.012*hit;}
  else {q.bob=.055*hit;q.y=.04*hit;q.tuck=.3*hit;q.yaw=hit*90;q.pawUp=.4*hit;q.amp=.2;}
  return q;
}
function danceCat(u){
  const q=qFill();
  q.look=16*Math.sin(u*Math.PI*4);q.pitch=7*Math.sin(u*Math.PI*4);
  q.pawUp=Math.max(0,Math.sin(u*Math.PI*2));q.wag=.62*Math.sin(u*Math.PI*2);
  q.tilt=14*Math.sin(u*Math.PI*4);q.bob=.014*Math.abs(Math.sin(u*Math.PI*8));q.sit=.2;
  return q;
}
function danceBunny(u){
  const q=qFill(),hop=Math.pow(Math.abs(Math.sin(u*Math.PI*4)),.85);
  q.bob=.05*hop;q.y=.03*hop;q.tuck=.5*hop;q.tilt=18*Math.sin(u*Math.PI*2);
  q.earFold=.15+.55*Math.max(0,-Math.sin(u*Math.PI*2));q.wag=.75*Math.sin(u*Math.PI*8);q.yaw=10*Math.sin(u*Math.PI*2);
  return q;
}
function danceDragon(u){
  const q=qFill(),w=Math.sin(u*Math.PI*8);
  q.flap=.35+.65*Math.max(0,w);q.bob=.032*Math.abs(w);q.y=.028*Math.abs(w);
  q.look=14*Math.sin(u*Math.PI*2);q.pitch=8*Math.sin(u*Math.PI*2);q.wag=.7*Math.sin(u*Math.PI*2);q.yaw=Math.sin(u*Math.PI*2)*36;
  return q;
}
function danceFox(u){
  const q=qFill(),s=Math.sin(u*Math.PI*2);
  q.x=.07*s;q.bob=.04*Math.abs(s);q.tuck=.22*Math.abs(s);q.wag=.98*s;q.yaw=s*16;q.tilt=8*s;q.ph=u*2;q.amp=.75;q.earFold=.08;
  if(u>.62){q.yaw=(u-.62)/.38*80;q.earFold=0;q.bob=.03;}
  return q;
}
function sigDance(type,u){
  if(type==='cat')return danceCat(u);
  if(type==='dragon')return danceDragon(u);
  if(type==='robo'||type==='dog')return danceDog(u);
  if(type==='bunny')return danceBunny(u);
  return danceFox(u);
}
function mocapToQ(s){
  const q=qFill(),hop=+s.hop||0,wag=+s.wag||0,bow=+s.bow||0,sway=+s.sway||0,pawL=+s.pawL||0,pawR=+s.pawR||0;
  q.bob=hop*.06;q.y=hop*.035;q.tuck=hop*.3;q.wag=wag*.9;q.pitch=-bow*34;q.look=-bow*8;q.tilt=sway*14;q.x=sway*.05;
  const hi=Math.max(pawL,pawR),lo=Math.min(pawL,pawR);
  if(Math.abs(pawL-pawR)>.25){q.pawUp=.05;q.amp=.4+Math.abs(pawL-pawR)*.8;q.ph=pawR>pawL?0.5:0;}
  else {q.pawUp=hi;q.amp=.1;}
  q.yaw=pSpin*180/Math.PI;return q;
}
function petDanceQ(type,tSec){
  const rec=recordedSample(tSec);if(rec)return mocapToQ(rec);
  const u=((tSec%SIG)+SIG)%SIG/SIG;return sigDance(type,u);
}
function lineupQ(type){
  const u={fox:.22,cat:.25,dragon:.08,robo:.12,dog:.12,bunny:.18}[type];
  const q=sigDance(type,u==null?0.2:u);q.yaw=(q.yaw||0)-18;return q;
}
function groundPetQ(type,gait,phase,tSec,human){
  const rec=(gait==='dance'||gait==='idle')?recordedSample(tSec):null;
  let q;
  if(rec)q=mocapToQ(rec);
  else if(gait==='dance')q=sigDance(type,((tSec%SIG)+SIG)%SIG/SIG);
  else if(gait==='run')q=qFill({ph:phase*2,amp:1.25,bob:.035*Math.abs(Math.sin(phase*Math.PI*4)),tuck:.22,wag:.45*Math.sin(phase*Math.PI*8)});
  else if(gait==='walk')q=qFill({ph:phase*2,amp:.85,bob:.012*Math.abs(Math.sin(phase*Math.PI*4)),wag:.4*Math.sin(phase*Math.PI*4)});
  else q=qFill({sit:1,bob:.01*Math.sin((phase||0)*6),wag:.28*Math.sin((phase||0)*8),look:12*Math.sin((phase||0)*2),tilt:6*Math.sin((phase||0)*3)});
  if(human&&gait==='dance')q.bob+=(human.bob||0)*.35;
  return q;
}
function seatRecorded(base,s){
  const q=Object.assign({},base),hop=+s.hop||0,wag=+s.wag||0,bow=+s.bow||0,sway=+s.sway||0;
  q.wag=wag*.42;
  q.bob=(base.bob||0)+hop*.012+Math.abs(bow)*.006;
  q.pitch=(base.pitch||0)-bow*8;
  q.look=(base.look||0)*.4-bow*4;
  q.tilt=(base.tilt||0)+sway*6;
  q.x=(base.x||0)+sway*.012;
  return q;
}
function seatMix(base,dance){
  const q=Object.assign({},base),tuck=base.tuck||0;
  q.wag=dance.wag||0;
  q.look=(base.look||0)*.25+(dance.look||0)*.65;
  q.tilt=(dance.tilt||0)*.7;
  q.flap=Math.max(base.flap||0,(dance.flap||0)*(1-tuck*.4));
  q.pawUp=Math.min(1,(base.pawUp||0)+(dance.pawUp||0)*(1-tuck*.5));
  q.earFold=dance.earFold!=null?dance.earFold:(base.earFold||0);
  q.bob=(base.bob||0)+(dance.bob||0)*(1-tuck*.5);
  q.ph=dance.ph||0;q.amp=(dance.amp||0)*(1-tuck)*.85;
  q.pitch=(base.pitch||0)+(dance.pitch||0)*.4;
  q.yaw=(base.yaw||0)+(dance.yaw||0)*.35;
  q.x=(base.x||0)+(dance.x||0)*.25;
  q.y=(base.y||0)+(dance.y||0)*.2;
  return q;
}
function V(x,y,z){return {x:x,y:y,z:z};}
function add(a,b){return V(a.x+b.x,a.y+b.y,a.z+b.z);}
function mul(a,s){return V(a.x*s,a.y*s,a.z*s);}
function rx(p,a){const c=Math.cos(a),s=Math.sin(a);return V(p.x,p.y*c-p.z*s,p.y*s+p.z*c);}
function rz(p,a){const c=Math.cos(a),s=Math.sin(a);return V(p.x*c-p.y*s,p.x*s+p.y*c,p.z);}
function basis(forward,out){
  return {x:rz(V(1,0,0),out),y:rz(rx(V(0,1,0),-forward),out),z:rz(rx(V(0,0,1),-forward),out)};
}
function applyB(B,p){return V(B.x.x*p.x+B.y.x*p.y+B.z.x*p.z,B.x.y*p.x+B.y.y*p.y+B.z.y*p.z,B.x.z*p.x+B.y.z*p.y+B.z.z*p.z);}
function chain(forward,bend,l1,l2,out){
  const B=basis(forward,out);
  const knee=mul(applyB(B,V(0,-1,0)),l1);
  const ankle=add(knee,mul(applyB(B,rx(V(0,-1,0),bend)),l2));
  return {knee,ankle};
}
function figurePoints(look,spec){
  const hip=V((spec.sway||0)*.04,look.thigh+look.shin+(spec.bob||0),0);
  const sway=spec.sway||0,lean=spec.lean||0;
  const up=rz(rx(V(0,1,0),lean),sway),side=rz(rx(V(1,0,0),lean),sway);
  const chest=add(hip,mul(up,look.torso)),neck=add(chest,mul(up,look.neck)),head=add(neck,mul(up,look.head*.85));
  const shL=add(chest,mul(side,-look.shoulder)),shR=add(chest,mul(side,look.shoulder));
  const hpL=add(hip,V(-look.hip,-.02,0)),hpR=add(hip,V(look.hip,-.02,0));
  const out=spec.armOut==null?0.2:spec.armOut;
  const aL=chain(spec.armL||0,spec.elbL||0,look.uarm,look.farm,-out);
  const aR=chain(spec.armR||0,spec.elbR||0,look.uarm,look.farm,out);
  const lL=chain(spec.legL||0,spec.kneeL||0,look.thigh,look.shin,-.05);
  const lR=chain(spec.legR||0,spec.kneeR||0,look.thigh,look.shin,.05);
  const elL=add(shL,aL.knee),wrL=add(shL,aL.ankle),elR=add(shR,aR.knee),wrR=add(shR,aR.ankle);
  const knL=add(hpL,lL.knee),anL=add(hpL,lL.ankle),knR=add(hpR,lR.knee),anR=add(hpR,lR.ankle);
  const ftL=add(anL,V(0,-.02,.09)),ftR=add(anR,V(0,-.02,.09));
  const pony0=add(head,V(0,look.head*.1,-look.head*.75));
  const pony1=add(pony0,V(0,-.16,-.06)),pony2=add(pony1,V((spec.sway||0)*.2,-.14,-.03));
  return {hip,chest,neck,head,shL,shR,hpL,hpR,elL,wrL,elR,wrR,knL,anL,knR,anR,ftL,ftR,pony0,pony1,pony2};
}
function xform(p,ox,oy,oz,yaw){
  const c=Math.cos(yaw||0),s=Math.sin(yaw||0);
  return [ox+p.x*c+p.z*s,oy+p.y,oz-p.x*s+p.z*c];
}
function bone(ctx,a,b,r,fill,glow){
  if(!a||!b)return;const z=(a[2]+b[2])*.5,f=a[3]||b[3]||300,w=Math.max(1.4,r*2*f/Math.max(.2,z));
  ctx.lineCap='round';ctx.strokeStyle=glow;ctx.globalAlpha=.4;ctx.lineWidth=w*1.9;
  ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
  ctx.globalAlpha=1;ctx.strokeStyle=fill;ctx.lineWidth=w;
  ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
}
function paintFigure(ctx,look,spec,project,yaw,origin){
  if(window.CHARCLOSET&&CHARCLOSET.paintWorld){
    CHARCLOSET.paintWorld(ctx,spec,project,yaw||0,origin||{x:0,y:0,z:0});
    return;
  }
  const pts=figurePoints(look,spec),o=origin||{x:0,y:0,z:0},P={};
  for(const k in pts){const w=xform(pts[k],o.x,o.y,o.z,yaw||0);P[k]=project(w[0],w[1],w[2]);}
  const items=[];
  const push=(a,b,r,fill,glow)=>{if(P[a]&&P[b])items.push({z:(P[a][2]+P[b][2])*.5,draw(){bone(ctx,P[a],P[b],r,fill,glow);}});};
  push('hpL','knL',look.legR,look.cloth,look.trim);push('knL','anL',look.legR*.82,look.cloth2,look.trim);
  push('hpR','knR',look.legR,look.cloth,look.trim);push('knR','anR',look.legR*.82,look.cloth2,look.trim);
  push('anL','ftL',look.legR*.7,look.sole,look.sole);push('anR','ftR',look.legR*.7,look.sole,look.sole);
  push('shL','elL',look.armR,look.cloth,look.trim);push('elL','wrL',look.armR*.85,look.cloth2,look.accent);
  push('shR','elR',look.armR,look.cloth,look.trim);push('elR','wrR',look.armR*.85,look.cloth2,look.accent);
  if(look.pony){push('pony0','pony1',.03,look.hair,look.trim);push('pony1','pony2',.022,look.hair,look.accent);
    if(P.pony0)items.push({z:P.pony0[2],draw(){const rad=Math.max(2,.03*P.pony0[3]/Math.max(.2,P.pony0[2]));ctx.fillStyle=look.accent;ctx.beginPath();ctx.arc(P.pony0[0],P.pony0[1],rad,0,7);ctx.fill();}});}
  if(P.shL&&P.shR&&P.hpL&&P.hpR){
    const z=(P.shL[2]+P.shR[2]+P.hpL[2]+P.hpR[2])/4;
    items.push({z,draw(){
      ctx.beginPath();ctx.moveTo(P.shL[0],P.shL[1]);ctx.lineTo(P.shR[0],P.shR[1]);ctx.lineTo(P.hpR[0],P.hpR[1]);ctx.lineTo(P.hpL[0],P.hpL[1]);ctx.closePath();
      ctx.fillStyle=look.cloth;ctx.fill();ctx.strokeStyle=look.trim;ctx.lineWidth=2;ctx.stroke();
      ctx.strokeStyle=look.accent;ctx.lineWidth=1.5;ctx.beginPath();
      ctx.moveTo((P.shL[0]+P.shR[0])/2,(P.shL[1]+P.shR[1])/2);ctx.lineTo((P.hpL[0]+P.hpR[0])/2,(P.hpL[1]+P.hpR[1])/2);ctx.stroke();
    }});
  }
  if(P.head){
    items.push({z:P.head[2]-(look.hood?0.04:0),draw(){
      const rad=Math.max(4,look.head*P.head[3]/Math.max(.2,P.head[2]));
      if(look.hood){ctx.fillStyle=look.cloth;ctx.beginPath();ctx.arc(P.head[0],P.head[1]-rad*.12,rad*1.22,0,7);ctx.fill();ctx.strokeStyle=look.trim;ctx.lineWidth=1.6;ctx.stroke();}
      ctx.fillStyle=look.cloth2;ctx.beginPath();ctx.arc(P.head[0],P.head[1],rad,0,7);ctx.fill();
      ctx.fillStyle=look.hair;ctx.beginPath();ctx.arc(P.head[0],P.head[1],rad*.92,Math.PI,Math.PI*2);ctx.fill();
      ctx.strokeStyle=look.trim;ctx.lineWidth=Math.max(2,rad*.28);ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(P.head[0]-rad*.62,P.head[1]-rad*.02);ctx.lineTo(P.head[0]+rad*.62,P.head[1]-rad*.02);ctx.stroke();
      ctx.strokeStyle='#fff';ctx.lineWidth=Math.max(1,rad*.1);
      ctx.beginPath();ctx.moveTo(P.head[0]-rad*.38,P.head[1]-rad*.02);ctx.lineTo(P.head[0]-rad*.16,P.head[1]-rad*.02);
      ctx.moveTo(P.head[0]+rad*.16,P.head[1]-rad*.02);ctx.lineTo(P.head[0]+rad*.38,P.head[1]-rad*.02);ctx.stroke();
    }});
  }
  items.sort((a,b)=>b.z-a.z);for(const it of items)it.draw();
  ctx.globalAlpha=1;
}
function paintPet(ctx,type,q,project,color){
  if(!D.PET_RIG[type])return;
  let J;try{J=D.petFk(q,type);}catch(e){return;}
  const parts=D.petParts(type),items=[];
  const loc=name=>{const v=J[name];if(!v)return null;return project(v[0],v[1],v[2]);};
  for(const [a,b,r] of parts){
    const pa=loc(a),pb=loc(b);if(!pa||!pb)continue;
    items.push({z:(pa[2]+pb[2])*.5,a:pa,b:pb,r,head:a===b,snout:a==='head'&&b==='snout'});
  }
  items.sort((a,b)=>b.z-a.z);
  for(const it of items){
    if(it.head){
      const rad=Math.max(2,it.r*it.a[3]/Math.max(.15,it.a[2]));
      ctx.fillStyle=color;ctx.beginPath();ctx.arc(it.a[0],it.a[1],rad,0,7);ctx.fill();
      ctx.strokeStyle='#ffe7a8';ctx.globalAlpha=.55;ctx.lineWidth=Math.max(1,rad*.35);ctx.stroke();ctx.globalAlpha=1;
    }else bone(ctx,it.a,it.b,it.r,it.snout?'#ffd27a':color,'#ffe1a3');
  }
  ['eyeL','eyeR'].forEach(k=>{const e=loc(k);if(!e)return;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(e[0],e[1],Math.max(1.3,.02*e[3]/Math.max(.15,e[2])),0,7);ctx.fill();});
  ctx.globalAlpha=1;
}
function cellProject(x,y,z,ox,oy,f,dist,lookY){
  const Z=dist-z;if(Z<.12)return null;
  return [ox+x*f/Z,oy-(y-lookY)*f/Z,Z,f];
}
function drawOne(ctx,who,spec,cx,cy,cellH,yaw){
  const look=wearLook(who),f=cellH*1.56,dist=2.9;
  paintFigure(ctx,look,spec,(x,y,z)=>cellProject(x,y,z,cx,cy,f,dist,.75),yaw||0,{x:0,y:0,z:0});
}
function label(ctx,text,x,y,color){
  ctx.globalAlpha=1;ctx.fillStyle=color||'#f4ecff';ctx.font='700 11px system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,x,y);
}
function drawSheet(ctx,w,h){
  const gaits=['idle','walk','run','dance'],phase={idle:.25,walk:.18,run:.18,dance:.3},rows=['girl','boy'];
  const cw=w/4,rh=h/2;
  for(let r=0;r<2;r++)for(let c=0;c<4;c++){
    const who=rows[r],gait=gaits[c],ph=phase[gait];
    const spec=humanSpec(gait,ph,gait==='dance'?ph*8:0,false);
    drawOne(ctx,who,spec,c*cw+cw/2,r*rh+rh*.56,rh*.92,0);
    label(ctx,LOOK[who].name+'  '+gait.toUpperCase(),c*cw+cw/2,r*rh+rh-12,LOOK[who].trim);
  }
}
function petCam(x,y,w,h){
  const f=h*1.85,dist=.82,lookY=.14;
  return (px,py,pz)=>cellProject(px,py,pz,x+w/2,y+h*.66,f,dist,lookY);
}
function drawPets(ctx,w,h){
  const keys=Object.keys(D.PET_RIG),cw=w/Math.max(1,keys.length);
  keys.forEach((type,i)=>{
    const q=lineupQ(type);
    ctx.fillStyle='rgba(255,176,32,.14)';ctx.beginPath();ctx.ellipse(i*cw+cw/2,h*.8,cw*.2,8,0,0,7);ctx.fill();
    paintPet(ctx,type,q,petCam(i*cw,0,cw,h),'#ffb020');
    label(ctx,D.PET_RIG[type].n,i*cw+cw/2,22,'#fff6e4');
    label(ctx,DANCE_NAME[type]||type.toUpperCase(),i*cw+cw/2,40,'#ffb020');
  });
}
function drawStage(ctx,w,h,tSec){
  const who=whoNow(),gait=(window.CREWSTATE&&CREWSTATE.gait)||'idle';
  const phase=gait==='run'?tSec*1.55:gait==='walk'?tSec*.9:tSec*.35;
  const spec=humanSpec(gait,phase,tSec,true);
  const ym=/[?&]yaw=([-0-9.]+)/.exec(qs());
  drawOne(ctx,who,spec,w*.4,h*.58,Math.min(h*.9,w*.62),ym?parseFloat(ym[1])||0:hSpin);
  const type=activePet();
  const q=groundPetQ(type,gait,phase,tSec,gait==='dance'?{bob:spec.bob}:null);
  q.yaw=(q.yaw||0)+(hSpin*180/Math.PI);
  st.pet=type;
  paintPet(ctx,type,q,petCam(w*.58,h*.18,w*.38,h*.7),(D.pet&&D.pet.glow)||'#ffb020');
  label(ctx,LOOK[who].name+'  '+gait.toUpperCase(),w*.4,h-18,LOOK[who].trim);
  const rec=recordedSample(tSec);
  label(ctx,(D.PET_RIG[type]?D.PET_RIG[type].n:type)+'  '+(rec?(rec.name||'RECORDED PET'):(gait==='dance'?(DANCE_NAME[type]||'SIGNATURE'):'WITH YOU')),w*.76,h-18,'#ffb020');
}
function qs(){try{return location.search||'';}catch(e){return '';}}
function preview(ctx,w,h,now){
  const tSec=(now||performance.now())/1000,dt=Math.min(.05,clock?( (now||performance.now())-clock)/1000:0);
  clock=now||performance.now();
  const query=qs();
  syncDanceOpts();
  ctx.save();ctx.clearRect(0,0,w,h);ctx.fillStyle='#07010f';ctx.fillRect(0,0,w,h);
  if(/pets=1/.test(query)){drawPets(ctx,w,h);ctx.restore();return;}
  if(/sheet=1/.test(query)){drawSheet(ctx,w,h);ctx.restore();return;}
  const gait=(window.CREWSTATE&&CREWSTATE.gait)||'idle';
  tickHuman(dt,tSec,gait==='dance');
  tickPet(dt,tSec,(gait==='dance'||gait==='idle')&&optIndex(st.petDanceOpt)>=0);
  drawStage(ctx,w,h,tSec);ctx.restore();
}
function resolveMove(W,dt){
  let speed=typeof W.speed==='number'?W.speed:0;
  if(typeof W.speed!=='number'){
    if(lastX==null||!(dt>0))speed=0;else speed=Math.hypot((W.x||0)-lastX,(W.z||0)-lastZ)/dt;
  }
  lastX=W.x;lastZ=W.z;
  let gait=W.gait;
  if(W.dancing||gait==='dance')gait='dance';
  else if(gait!=='idle'&&gait!=='walk'&&gait!=='run')gait=speed>6.5?'run':speed>.35?'walk':'idle';
  let phase=typeof W.stridePhase==='number'?W.stridePhase:null;
  if(phase==null){strideAcc+=Math.max(0,speed)*dt*(gait==='run'?0.55:0.32);phase=strideAcc;}
  return {gait,phase,speed};
}
function worldProject(x,y,z){
  if(typeof proj!=='function')return null;
  const p=proj(x,y,z);if(!p)return null;
  const f=(typeof H==='number'?H:390)*.9;return [p[0],p[1],p[2],f];
}
function drawRing(x,y,z,rad,color,alpha){
  ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,alpha))*.9;ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();
  let on=false;
  for(let i=0;i<=24;i++){const a=i/24*Math.PI*2,p=worldProject(x+Math.cos(a)*rad,y,z+Math.sin(a)*rad);
    if(!p){on=false;continue;}if(!on){ctx.moveTo(p[0],p[1]);on=true;}else ctx.lineTo(p[0],p[1]);}
  ctx.stroke();ctx.restore();
}
function heelOf(W){
  const fx=Math.sin(W.yaw||0),fz=Math.cos(W.yaw||0),rx=Math.cos(W.yaw||0),rz=-Math.sin(W.yaw||0);
  return {fx:fx,fz:fz,x:(W.x||0)-rx*0.65-fx*0.52,z:(W.z||0)-rz*0.65-fz*0.52};
}
function turnToward(cur,target,rate,dt){
  let d=Math.atan2(Math.sin(target-cur),Math.cos(target-cur)),max=rate*dt;
  if(d>max)d=max;else if(d<-max)d=-max;
  return cur+d;
}
function stepPetFollow(W,move,dt){
  const heel=heelOf(W);
  if(!petFollow.onFoot||Math.hypot((W.x||0)-petFollow.x,(W.z||0)-petFollow.z)>18){
    petFollow.x=heel.x;petFollow.z=heel.z;petFollow.y=W.y||0;petFollow.yaw=W.yaw||0;
    petFollow.vx=0;petFollow.vz=0;petFollow.speed=0;petFollow.onFoot=true;
  }
  const dx=heel.x-petFollow.x,dz=heel.z-petFollow.z,dist=Math.hypot(dx,dz);
  if(dist>0.08||move.speed>0.15){
    const wantV=dist>0.12?Math.min(9.2,dist*4.5+move.speed*0.92):0;
    const ux=dist>1e-4?dx/dist:heel.fx,uz=dist>1e-4?dz/dist:heel.fz,k=Math.min(1,18*dt);
    petFollow.vx+=(ux*wantV-petFollow.vx)*k;
    petFollow.vz+=(uz*wantV-petFollow.vz)*k;
    petFollow.x+=petFollow.vx*dt;petFollow.z+=petFollow.vz*dt;
  }else{petFollow.vx=0;petFollow.vz=0;}
  petFollow.speed=Math.hypot(petFollow.vx,petFollow.vz);
  petFollow.yaw=turnToward(petFollow.yaw,petFollow.speed>0.35?Math.atan2(petFollow.vx,petFollow.vz):(W.yaw||0),petFollow.speed>0.35?10:6,dt);
  petFollow.phase+=Math.max(0.35,petFollow.speed)*dt*(petFollow.speed>4.2?0.62:0.40);
  petFollow.gait=(W.dancing||move.gait==='dance')?'dance':petFollow.speed>4.2?'run':petFollow.speed>0.22?'walk':'idle';
  if((W.jumpY||0)>0.08&&petFollow.jumpY<=0.01&&petFollow.jumpVy<=0){petFollow.jumpVy=5.4;petFollow.jumpY=0.04;}
  petFollow.jumpVy-=17.5*dt;petFollow.jumpY+=petFollow.jumpVy*dt;
  if(petFollow.jumpY<=0){petFollow.jumpY=0;petFollow.jumpVy=0;}
  petFollow.y=(W.y||0)+petFollow.jumpY;
}
function stepOnFoot(W,dt,now){
  footMove=resolveMove(W,dt);footNow=now;footDt=dt;
  const tSec=now/1000,dancing=footMove.gait==='dance';
  st.gait=footMove.gait;st.who=whoNow();st.pet=activePet();st.type=st.pet;
  tickHuman(dt,tSec,dancing);
  tickPet(dt,tSec,(dancing||footMove.gait==='idle')&&optIndex(st.petDanceOpt)>=0);
  stepPetFollow(W,footMove,dt);
  footStepped=true;
}
function bustCarSprite(){if(typeof ZV!=='undefined'&&ZV)ZV.lastPx=0;}
function drawWorldWalker(W,dt,now){
  if(!footStepped)stepOnFoot(W,dt,now);
  if(typeof proj!=='function'||typeof ctx==='undefined'||!ctx||!footMove)return;
  const move=footMove,tSec=(footNow||now)/1000,dancing=move.gait==='dance',who=st.who||whoNow();
  const spec=humanSpec(move.gait,move.phase,tSec,true);
  const yaw=(W.yaw||0)+hSpin,look=wearLook(who);
  if(dancing){const sm=sampleHumanSelected(tSec);st.danceName=sm&&sm.name?sm.name:(st.charDanceOpt==='default'?'CLASSIC GROOVE':'DANCE');}
  else st.danceName=st.charDanceOpt==='default'?'CLASSIC GROOVE':st.charDanceOpt;
  ctx.save();
  try{
    if(move.gait==='run'){
      stepAcc+=footDt;
      if(stepAcc>.26){stepAcc=0;const side=rings.length%2?1:-1,rx=Math.cos(yaw),rz=-Math.sin(yaw);
        rings.push({x:W.x+rx*side*.18,z:W.z+rz*side*.18,t:footNow,col:look.trim});}
    }
    for(let i=rings.length-1;i>=0;i--){const age=(footNow-rings[i].t)/1000;if(age>.9){rings.splice(i,1);continue;}drawRing(rings[i].x,(W.y||0)+.03,rings[i].z,.16,rings[i].col,1-age/.9);}
    if(dancing)drawRing(W.x,(W.y||0)+.03,W.z,.5+.14*Math.abs(Math.sin(tSec*Math.PI*4)),look.trim,.7);
    paintFigure(ctx,look,spec,worldProject,yaw,{x:W.x,y:(W.y||0)+(W.jumpY||0),z:W.z});
    const q=groundPetQ(st.pet,petFollow.gait,petFollow.phase,tSec,petFollow.gait==='dance'?{bob:spec.bob}:null);
    q.yaw=petFollow.yaw*180/Math.PI+(q.yaw||0);
    const pScale=1.25,py=(W.y||0)+(petFollow.jumpY||0);
    paintPet(ctx,st.pet,q,(x,y,z)=>worldProject(petFollow.x+x*pScale,py+y*pScale,petFollow.z+z*pScale),(D.pet&&D.pet.glow)||'#ffb020');
  }finally{ctx.restore();}
}
function syncWearRigs(){
  if(!st.built||!st.rigs||!st.map)return;
  const k=(window.CHARCLOSET&&CHARCLOSET.key)?CHARCLOSET.key():'';
  if(k===wearStamp)return;
  wearStamp=k;
  try{st.map.remove(st.rigs.girl.group);st.map.remove(st.rigs.boy.group);}catch(e){}
  st.rigs={girl:buildRig(wearLook('girl')),boy:buildRig(wearLook('boy'))};
  st.map.add(st.rigs.girl.group);st.map.add(st.rigs.boy.group);
}
function drawDriver(who){
  if(!st.rigs)return;
  st.rigs.girl.group.visible=who==='girl';
  st.rigs.boy.group.visible=who==='boy';
  syncMap(st.map);
  // Driving pose stays seated. The armed dance (classic groove or a recorded slot)
  // is what she uses the moment she dances on foot.
  applySpec(st.rigs[who].parts,sitSpec((t%4)/4));
  st.danceName=st.charDanceOpt==='default'?'CLASSIC GROOVE':st.charDanceOpt;
}
function update(){
  footStepped=false;
  const now=(typeof performance!=='undefined'?performance.now():Date.now());
  const dt=Math.min(.05,clock?(now-clock)/1000:0);clock=now;
  syncDanceOpts();
  syncWearRigs();
  const sim=!(typeof flying!=='undefined'&&flying&&typeof paused!=='undefined'&&paused);
  if(sim)t+=dt;
  const W=window.WALK_MODE;
  if(W&&W.onFoot){
    if(root)root.visible=false;
    if(!st.onFoot)bustCarSprite();
    st.onFoot=true;st.phase='onfoot';st.ready=true;
    stepOnFoot(W,sim?dt:0,now);
    if(!W.insideBuilding&&typeof drawWaterline!=='function')drawWorldWalker(W,0,now);
    return;
  }
  if(st.onFoot){petFollow.onFoot=false;petFollow.vx=0;petFollow.vz=0;petFollow.speed=0;petFollow.jumpY=0;petFollow.jumpVy=0;carSpriteDirty=true;}
  st.onFoot=false;
  const X=xray();if(!X)return;
  if(!st.built&&!build(X))return;
  const who=whoNow();st.who=who;st.gait='sit';
  drawDriver(who);
  const pet=petPose(sim?dt:0);
  st.pet=pet.type;
  let q=pet.q;
  if(st.phase==='ride'){
    const rec=recordedSample(now/1000);
    if(rec){q=seatRecorded(q,rec);st.danceName=rec.name||'RECORDED PET';}
    else {q=seatMix(q,sigDance(pet.type,((now/1000)%SIG)/SIG));st.danceName=DANCE_NAME[pet.type]||'SIGNATURE';}
  }
  drawPet(q,pet.type);
  if(root)root.visible=true;
  if(carSpriteDirty){bustCarSprite();carSpriteDirty=false;}
  if(st.rigs)pinHead(st.rigs[who].parts.head);
  st.ready=true;
}
window.addEventListener&&window.addEventListener('storage',e=>{
  if(!e.key||e.key===HKEY){hRaw=null;hObjRaw='';}
  if(!e.key||e.key===PKEY){pRaw=null;pObjRaw='';}
  if(!e.key||e.key===CKEY)modeRaw=null;
});
try{new BroadcastChannel('zdash-customdance').onmessage=()=>{hRaw=null;hObjRaw='';};}catch(e){}
try{new BroadcastChannel('zdash-char').onmessage=()=>{if(D.reload)D.reload();wearStamp='';};}catch(e){}
try{new BroadcastChannel('zdash-petdance').onmessage=()=>{pRaw=null;pObjRaw='';};}catch(e){}
if(typeof drawWaterline==='function'&&!drawWaterline.__crewHooked){
  const _dw=drawWaterline;
  drawWaterline=function(){
    _dw();
    const W=window.WALK_MODE;
    if(W&&W.onFoot&&!W.insideBuilding)drawWorldWalker(W,0,footNow||(typeof performance!=='undefined'?performance.now():Date.now()));
  };
  drawWaterline.__crewHooked=true;
}
window.CREW={
  update,
  preview,
  parts(who){const w=who==='boy'?'boy':who==='girl'?'girl':whoNow();return (st.rigs&&st.rigs[w]&&st.rigs[w].parts)||logical[w];},
  debugHuman(gait,tSec,phase){syncDanceOpts();return humanSpec(gait,phase==null?tSec:phase,tSec,true);},
  debugPet(type,tSec){syncDanceOpts();st.pet=type;return petDanceQ(type,tSec);},
  debugGround(type,gait,phase,tSec){syncDanceOpts();return groundPetQ(type,gait,phase==null?0.2:phase,tSec,null);},
  debugSeat(base,tSec){const rec=recordedSample(tSec);return rec?seatRecorded(base||{},rec):null;},
  debugSig(type,u){return sigDance(type,u);},
  getCharDanceOptions,setCharDanceOpt,cycleCharDance,getPetDanceOptions,setPetDanceOpt,syncDanceOpts,
  get state(){return {phase:st.phase,tk:st.tkOn?+st.tk.toFixed(3):0,hatch:+(st.hatch||0).toFixed(3),type:st.type||(st.pet||D.pet.type),ready:st.ready,fx:AX.fx,fz:AX.fz,axis:AX.ok,head:st.headX!=null?[+st.headX.toFixed(3),+st.headY.toFixed(3),+st.headZ.toFixed(3)]:null,pet:st.petX!=null?[+st.petX.toFixed(3),+st.petY.toFixed(3),+st.petZ.toFixed(3)]:null,petType:st.pet||(D.pet&&D.pet.type)||'fox',char:D.char.glow,hair:D.char.hair,petGlow:D.pet.glow,spot:D.pet.spot,who:st.who||whoNow(),gait:st.gait,dance:st.danceName,charDanceOpt:st.charDanceOpt||'default',petDanceOpt:st.petDanceOpt||'default',onFoot:!!st.onFoot,rootVisible:!!(root&&root.visible),petWorld:st.onFoot?{x:+petFollow.x.toFixed(2),z:+petFollow.z.toFixed(2),yaw:+petFollow.yaw.toFixed(2),speed:+petFollow.speed.toFixed(2),gait:petFollow.gait}:null};},
  reload(){const r=D.reload();charHex='';petHex='';return r;},
  axis(fx,fz){AX.fx=fx;AX.fz=fz==null?fx:fz;AX.ok=true;}
};
})();
