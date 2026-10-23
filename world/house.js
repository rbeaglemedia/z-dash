'use strict';
// On-foot / house hook. Driving physics stay in phys-*.js.
// GET OUT is for street mode, on the ground, P.v < 3.
// Each door carries a building purpose (from the city, or id % 12 until that lands)
// plus a kid-facing label, an enter action, and a floating prompt.
const WALK_PURPOSES=['HOME','SHOWROOM','NEON_PAINT','GARAGE','NOS','DANCE','PETS','CAFE','ARCADE','SKY_DROP','SOCCER','BUILDER'];
const WALK_DOOR={
  HOME:{purposeLabel:'PLAYER HOUSE & GARAGE',actionLabel:'[E] WELCOME HOME',color:'#7dff6b'},
  SHOWROOM:{purposeLabel:'Z-DASH GLASS SHOWROOM',actionLabel:'[E] 370Z SPOTLIGHT',color:'#3ee6ff'},
  NEON_PAINT:{purposeLabel:"ELLIE'S NEON PAINT STUDIO",actionLabel:"[E] ENTER ELLIE'S NEON PAINT STUDIO",color:'#ff4fd8'},
  GARAGE:{purposeLabel:'SPEED & TUNING GARAGE',actionLabel:'[E] GARAGE TUNE-UP',color:'#ffb020'},
  NOS:{purposeLabel:'NOS & FUEL DEPOT',actionLabel:'TAP: NOS DEPOT (30s NOS)',color:'#3ee6ff'},
  DANCE:{purposeLabel:'Z COMPANY ARTS — DANCE STUDIO',actionLabel:'ENTER Z COMPANY ARTS',color:'#ff4fd8'},
  PETS:{purposeLabel:'PET RESCUE & CRITTER LOUNGE',actionLabel:'[E] CRITTERS SAY HI',color:'#7dff6b'},
  CAFE:{purposeLabel:'NEON PIZZA & BOBA CAFE',actionLabel:'[E] BOBA & PIZZA',color:'#ff9a2e'},
  ARCADE:{purposeLabel:'RETRO PIXEL ARCADE',actionLabel:'[E] ARCADE JACKPOT',color:'#ffe14d'},
  SKY_DROP:{purposeLabel:'SKY-DROP ELEVATOR TOWER',actionLabel:'[E] ROOFTOP ELEVATOR',color:'#3ee6ff'},
  SOCCER:{purposeLabel:'STADIUM PRO SHOP & ARENA',actionLabel:'[E] STADIUM ARENA',color:'#7dfff2'},
  BUILDER:{purposeLabel:'CITY BUILDER ARCHITECT HQ',actionLabel:'[E] CITY BUILDER HQ',color:'#ffb020'}
};
const WALK_UG=['#ff4fd8','#3ee6ff','#7dff6b','#ffe14d','#9b5cff'];
const WALK_PILL_M=6,WALK_AUTO_M=4.5;
const WALK_V=3.6,RUN_V=7.6,WALK_ACCEL=14,WALK_BRAKE=32,WALK_STRIDE=2.4,DANCE_STRIDE=6;
const WALK_PARK_M=9,WALK_PARK_PAD=1.5,WALK_BAY_M=1.35,WALK_BAY_STAND=1.7;
const WALK_INDOOR={HOME:1,SHOWROOM:1,NEON_PAINT:1,GARAGE:1,DANCE:1,PETS:1,CAFE:1,ARCADE:1,BUILDER:1};
const WALK_PAGE={NEON_PAINT:'neon-paint.html',DANCE:'dance-stage.html',GARAGE:'garage-z.html',PETS:'crew.html'};

function walkPurpose(b){
  if(b&&b.purpose&&WALK_DOOR[b.purpose])return b.purpose;
  const id=b&&Number.isFinite(b.id)?b.id:0;
  return WALK_PURPOSES[((id%12)+12)%12];
}
function walkMeta(b){
  const purpose=walkPurpose(b),meta=WALK_DOOR[purpose]||WALK_DOOR.HOME;
  // Ellie's real studio name stays on every DANCE door, even if the city label differs.
  const purposeLabel=purpose==='DANCE'?meta.purposeLabel:((b&&b.purposeLabel)||meta.purposeLabel);
  return {purpose,purposeLabel,actionLabel:meta.actionLabel,color:meta.color||(b&&b.c)||'#3ee6ff'};
}
function walkDoorTag(door){
  const tag=door&&door[4];
  return tag==='garage'||tag==='lot'||tag==='side'||tag==='rear';
}
function walkFaceKey(door){
  const nx=door[2]||0,nz=door[3]||0;
  if(Math.abs(nx)>=Math.abs(nz))return nx>=0?'x+':'x-';
  return nz>=0?'z+':'z-';
}
function walkFrontKey(b){
  const cx=b&&b.cx||0,cz=b&&b.cz||0;
  const rx=Math.round(cx/100)*100,rz=Math.round(cz/200)*200;
  if(Math.abs(rx-cx)<=Math.abs(rz-cz))return (rx-cx)>=0?'x+':'x-';
  return (rz-cz)>=0?'z+':'z-';
}
function walkSideDoor(b,door){
  if(!door)return false;
  if(walkDoorTag(door))return true;
  if(b&&b.parking)return false;
  if(door[4])return false;
  return walkFaceKey(door)!==walkFrontKey(b||{});
}
function walkDoorRec(b,door,x,z){
  const meta=walkMeta(b);
  const nx=door[2]||0,nz=door[3]||0,len=Math.hypot(nx,nz)||1,ux=nx/len,uz=nz/len;
  const dx=door[0],dz=door[1];
  return {x:dx,z:dz,nx:ux,nz:uz,dist:Math.hypot(dx-x,dz-z),y:0,buildingId:b.id,
    standX:dx+ux*WALK_BAY_STAND,standZ:dz+uz*WALK_BAY_STAND,garage:true,
    purpose:meta.purpose,purposeLabel:meta.purposeLabel,actionLabel:meta.actionLabel,color:meta.color,
    top:b.top||0,cx:b.cx,cz:b.cz,building:b};
}
function walkParkingHit(b,x,z){
  const p=b&&b.parking;
  if(!p||p.x0==null||p.x1==null||p.z0==null||p.z1==null)return null;
  if(x<p.x0-WALK_PARK_PAD||x>p.x1+WALK_PARK_PAD||z<p.z0-WALK_PARK_PAD||z>p.z1+WALK_PARK_PAD)return null;
  let door=null;
  if(b.doors){
    for(const d of b.doors){
      if(p.doorX!=null&&Math.hypot(d[0]-p.doorX,d[1]-p.doorZ)<1.2){door=d;break;}
      if(!door&&walkDoorTag(d))door=d;
    }
  }
  if(!door&&p.doorX!=null)door=[p.doorX,p.doorZ,p.nx||0,p.nz||0,p.type==='lot'?'lot':'garage'];
  if(!door)return null;
  const rec=walkDoorRec(b,door,x,z);
  return {type:p.type==='lot'?'lot':'garage',label:p.label||'',buildingId:b.id,purposeLabel:rec.purposeLabel,door:rec,area:Math.abs((p.x1-p.x0)*(p.z1-p.z0))||1};
}
function walkParkLine(park){
  const name=park&&park.purposeLabel||'BUILDING';
  const kind=park&&park.type==='lot'?'LOT':'GARAGE';
  return 'PARKED AT '+name+' '+kind+' — TAP GET OUT OR ENTER';
}
function walkEnterLabel(park){
  return 'ENTER '+((park&&park.purposeLabel)||'BUILDING');
}
function walkDanceBuilding(door){
  if(!door)return null;
  if(door.building)return door.building;
  if(typeof CITY!=='undefined'&&CITY&&CITY.BL&&door.buildingId!=null){
    for(const b of CITY.BL)if(b&&b.id===door.buildingId)return b;
  }
  return door;
}
function walkApproach(cur,target,rate,dt){
  const diff=target-cur,step=rate*dt;
  if(Math.abs(diff)<=step)return target;
  return cur+Math.sign(diff)*step;
}
function walkQuery(x,z,y){
  if(typeof CITY!=='undefined'&&CITY&&typeof CITY.hit==='function'){
    const h=CITY.hit(x,z,y);
    if(!h)return null;
    if(typeof h.x==='number'&&typeof h.z==='number')return {x:h.x,z:h.z};
    return {block:1};
  }
  if(typeof CITY!=='undefined'&&CITY&&typeof CITY.probe==='function'){
    const pr=CITY.probe(x,z,y);
    if(pr&&pr.wl)return {block:1,wl:pr.wl};
  }
  return null;
}
function walkUnstick(x,z,y){
  const hit=walkQuery(x,z,y);
  if(!hit)return {x,z};
  if(typeof hit.x==='number')return {x:hit.x,z:hit.z};
  const q=hit.wl;
  if(!q)return {x,z};
  const m=q.y0>0||q.ramp?0:0.8,x0=q.x0-m,x1=q.x1+m,z0=q.z0-m,z1=q.z1+m,pad=0.08;
  const d=[x-x0,x1-x,z-z0,z1-z],k=d.indexOf(Math.min.apply(null,d));
  if(k===0)x=x0-pad;else if(k===1)x=x1+pad;else if(k===2)z=z0-pad;else z=z1+pad;
  return {x,z};
}
function walkSlide(ox,oz,nx,nz,y){
  let x=nx,z=oz;
  const hx=walkQuery(x,z,y);
  if(hx){if(typeof hx.x==='number')x=hx.x;else x=ox;}
  z=nz;
  const hz=walkQuery(x,z,y);
  if(hz){if(typeof hz.z==='number')z=hz.z;else z=oz;}
  if(walkQuery(x,z,y)){x=ox;z=oz;}
  return {x,z};
}
function walkIntegrate(w,d){
  if(typeof P!=='undefined'&&P){P.v=0;P.thr=0;}
  const n=w.nudge;
  const moving=!!(n&&(Math.abs(n.x)>0.01||Math.abs(n.z)>0.01));
  if(moving&&!w._nudging){
    const now=performance.now();
    if(now-(w._nudgeAt||0)<380)w.runMode=!w.runMode;
    w._nudgeAt=now;
  }
  w._nudging=moving;
  const holdWalk=!!(typeof B!=='undefined'&&B&&(B.walk||B.tup))||!!(typeof K!=='undefined'&&K&&(K.ArrowUp||K.KeyW));
  const holdRun=holdWalk&&(!!(typeof B!=='undefined'&&B&&(B.run||B.nos))||!!(w.runMode||w._shift));
  if(moving||holdWalk)w.dancing=false;
  let wishX=0,wishZ=0,max=(w.runMode||w._shift)?RUN_V:WALK_V;
  if(!w.dancing&&moving){
    const len=Math.hypot(n.x,n.z)||1;
    wishX=n.x/len;wishZ=n.z/len;
    w.yaw=Math.atan2(wishX,wishZ);
    w._roofY=null;
  }else if(!moving){
    let steer=0;
    if(typeof K!=='undefined'&&K)steer=(K.ArrowRight||K.KeyD?1:0)-(K.ArrowLeft||K.KeyA?1:0);
    if(!steer&&typeof input==='function'){
      const inp=input();
      if(inp&&Number.isFinite(inp.lr)&&Math.abs(inp.lr)>0.01)steer=clamp(inp.lr,-1,1);
    }
    if(!steer&&typeof tiltOk==='function'&&tiltOk()&&typeof TL!=='undefined'){
      const span=(typeof TUNE!=='undefined'&&TUNE.gTiltSpan)||12.1;
      const dead=(typeof TUNE!=='undefined'&&TUNE.gTiltDead)||1.5;
      const raw=(TL.lr||0)-((TL.n0&&TL.n0.lr)||0);
      if(Math.abs(raw)>dead)steer=Math.sign(raw)*Math.pow(clamp((Math.abs(raw)-dead)/span,0,1),0.85);
    }
    if(steer)w.yaw=Math.atan2(Math.sin(w.yaw+steer*2.4*d),Math.cos(w.yaw+steer*2.4*d));
    if(holdWalk){
      wishX=Math.sin(w.yaw);wishZ=Math.cos(w.yaw);
      max=holdRun?RUN_V:WALK_V;
      w._roofY=null;
    }
  }
  const rate=(wishX||wishZ)?WALK_ACCEL:WALK_BRAKE;
  if(w.dancing){w.vx=0;w.vz=0;}
  else{w.vx=walkApproach(w.vx,wishX*max,rate,d);w.vz=walkApproach(w.vz,wishZ*max,rate,d);}
  w.speed=Math.hypot(w.vx,w.vz);
  if((w.jumpY||0)>0||(w.jumpVy||0)>0){
    w.jumpY=Math.max(0,(w.jumpY||0)+(w.jumpVy||0)*d);
    w.jumpVy=(w.jumpVy||0)-17.5*d;
    if(w.jumpY<=0){w.jumpY=0;w.jumpVy=0;}
  }
  if(w.dancing)w.stridePhase+=d*DANCE_STRIDE;
  else if(w.speed>0.05)w.stridePhase+=w.speed*d*WALK_STRIDE;
  w.gait=w.dancing?'dance':(w.jumpY||0)>0.05?'jump':w.speed>4.5?'run':w.speed>0.25?'walk':'idle';
  const y=(w.y||0)+0.4;
  const stuck=walkQuery(w.x,w.z,y);
  if(stuck){
    if(typeof stuck.x==='number'){w.x=stuck.x;w.z=stuck.z;}
    else{const u=walkUnstick(w.x,w.z,y);w.x=u.x;w.z=u.z;}
  }
  const slid=walkSlide(w.x,w.z,w.x+w.vx*d,w.z+w.vz*d,y);
  w.x=slid.x;w.z=slid.z;
  if(w._roofY==null)w.y=(typeof P!=='undefined'&&P&&P.y)||0;
  else w.y=w._roofY;
}
function walkPageLabel(purpose){
  if(purpose==='DANCE')return 'OPEN CAMERA DANCE STAGE';
  if(purpose==='NEON_PAINT')return 'OPEN NEON PAINT';
  if(purpose==='GARAGE')return 'OPEN GARAGE';
  if(purpose==='PETS')return 'OPEN CREW';
  return '';
}
function walkLaunchStudio(purpose,door){
  if(purpose==='DANCE'&&window.DANCE_STAGE&&typeof window.DANCE_STAGE.open==='function'){
    window.DANCE_STAGE.open({building:walkDanceBuilding(door)});
    return true;
  }
  if(purpose==='NEON_PAINT'&&typeof openNeonPaint==='function'&&!walkHeadless()){openNeonPaint();return true;}
  const page=WALK_PAGE[purpose];
  if(!page)return false;
  if(walkHeadless()){walkToast(page,WALK_DOOR[purpose]&&WALK_DOOR[purpose].color);return true;}
  window.open(page,'_blank');
  return true;
}
function walkHeadless(){
  try{if(navigator.webdriver)return true;if(/Headless/i.test(navigator.userAgent||''))return true;}catch(e){}
  return !!window.__WALK_HEADLESS;
}
function walkToast(s,col){
  if(typeof wMsg==='function')wMsg(s,col||'#7dff6b','');
  else if(typeof toast==='function')toast(s);
  else if(typeof kToast==='function')kToast(s);
}
function walkBurst(n){if(typeof fxBurst==='function')fxBurst('spark',n);}
function walkGreetPet(){
  if(typeof CREW!=='undefined'&&CREW&&typeof CREW.nextPet==='function'){CREW.nextPet();return;}
  const D=window.CREWDATA;
  if(!D||!D.PET_RIG||!D.pet)return;
  const types=Object.keys(D.PET_RIG);
  if(!types.length)return;
  const i=Math.max(0,types.indexOf(D.pet.type));
  D.pet.type=types[(i+1)%types.length];
  WALK_MODE.petType=D.pet.type;
  if(D.NEONPET&&typeof D.NEONPET.react==='function')D.NEONPET.react('dance');
}
function walkRing(x,y,z,r,col,w){
  if(typeof line!=='function')return;
  let prev=null;
  for(let i=0;i<=18;i++){
    const a=i/18*Math.PI*2,p=[x+Math.cos(a)*r,y,z+Math.sin(a)*r];
    if(prev)line(prev,p,col,w);
    prev=p;
  }
}
function walkDrawMarker(){
  if(!WALK_MODE.onFoot||typeof line!=='function')return;
  const x=WALK_MODE.x,gy=WALK_MODE.y||0,y=gy+(WALK_MODE.jumpY||0),z=WALK_MODE.z,yaw=WALK_MODE.yaw||0;
  const t=(performance.now()||0)/1000,fx=Math.sin(yaw),fz=Math.cos(yaw),rx=fz,rz=-fx;
  const pulse=0.72+0.08*Math.sin(t*5);
  if(typeof ctx!=='undefined'){ctx.save();ctx.shadowColor='#7dff6b';ctx.shadowBlur=14;}
  walkRing(x,gy+0.06,z,pulse,'#7dff6b',3);
  walkRing(x,gy+0.06,z,pulse*0.55,'#3ee6ff',2);
  line([x,y+0.08,z],[x,y+1.55,z],'#3ee6ff',3.2);
  line([x,y+1.15,z],[x+rx*0.38,y+0.82,z+rz*0.38],'#3ee6ff',2.4);
  line([x,y+1.15,z],[x-rx*0.38,y+0.82,z-rz*0.38],'#3ee6ff',2.4);
  line([x,y+0.55,z],[x+fx*0.22+rx*0.16,y+0.08,z+fz*0.22+rz*0.16],'#7dff6b',2.4);
  line([x,y+0.55,z],[x+fx*0.22-rx*0.16,y+0.08,z+fz*0.22-rz*0.16],'#7dff6b',2.4);
  walkRing(x,y+1.62,z,0.16,'#e9fbff',2);
  if(typeof ctx!=='undefined')ctx.restore();
  if(WALK_MODE.dancePartyT>0){
    const bob=0.4+0.35*Math.sin(t*8);
    walkRing(x,y+0.08+bob*0.05,z,1.15+bob,'#ff4fd8',2.4);
    walkRing(x,y+0.9,z,0.7+0.15*Math.sin(t*6),'#3ee6ff',2);
  }
}
function walkDrawBeacon(){
  if(!WALK_MODE.onFoot||!WALK_MODE.door||typeof line!=='function')return;
  const d=WALK_MODE.door,col=d.color||'#3ee6ff';
  const x=d.standX,z=d.standZ,y=0.07,t=(performance.now()||0)/1000;
  const r=1.15+0.18*Math.sin(t*3.2);
  if(typeof ctx!=='undefined'){ctx.save();ctx.shadowColor=col;ctx.shadowBlur=16;}
  walkRing(x,y,z,r,col,3);
  walkRing(x,y,z,r*0.62,'#7dff6b',2);
  line([x,y,z],[x,2.5,z],col,2.2);
  if(typeof ctx!=='undefined')ctx.restore();
}
function walkDrawGlow(){
  if(!(WALK_MODE.ugT>0)||typeof P==='undefined'||typeof line!=='function')return;
  const col=WALK_MODE.ugColor||'#3ee6ff',t=(performance.now()||0)/1000;
  walkRing(P.x,(P.y||0)+0.08,P.z,1.7+0.12*Math.sin(t*6),col,3);
}

function walkEnsurePill(){
  if(typeof document==='undefined'||document.getElementById('walk-door-pill'))return;
  const css=document.createElement('style');
  css.textContent='#walk-door-pill{position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:30;display:none;align-items:center;gap:8px;max-width:calc(100% - 24px);font:800 12px Orbitron,Rajdhani,sans-serif;letter-spacing:.4px;color:#04140c;background:#e9fff2;border:2px solid #7dff6b;border-radius:999px;padding:8px 14px;cursor:pointer;box-shadow:0 0 16px #7dff6b}#walk-door-pill.show{display:flex}#walk-door-pill b{font-weight:900}#walk-door-pill [data-k="act"]{font-weight:800;opacity:.9}#walk-door-pill.dance{flex-direction:column;align-items:stretch;gap:6px;border-radius:16px;padding:12px 14px;text-align:center;min-width:260px}#walk-door-pill.dance [data-k="label"]{font-size:13px;letter-spacing:.6px}#walk-door-cam{display:none;border:0;border-radius:999px;padding:8px 12px;font:800 11px Orbitron,Rajdhani,sans-serif;letter-spacing:.4px;color:#04140c;background:#ff4fd8;cursor:pointer}#walk-door-pill.dance #walk-door-cam{display:block}#walk-get-out,#walk-park-enter{display:none;border:0;border-radius:999px;padding:8px 12px;font:800 11px Orbitron,Rajdhani,sans-serif;letter-spacing:.4px;cursor:pointer;color:#04140c}#walk-get-out{background:#7dff6b}#walk-park-enter{background:#3ee6ff}#walk-door-pill.parked{flex-direction:column;align-items:stretch;gap:6px;border-radius:16px;padding:12px 14px;text-align:center;min-width:280px}#walk-door-pill.parked #walk-get-out,#walk-door-pill.parked #walk-park-enter{display:block}#walk-run-pill,#walk-dance-pill{position:fixed;top:14px;z-index:45;display:none;font:800 12px Orbitron,Rajdhani,sans-serif;letter-spacing:.6px;color:#04140c;background:#e9fff2;border:2px solid #7dff6b;border-radius:999px;padding:8px 12px;cursor:pointer}#walk-run-pill{left:12px}#walk-dance-pill{right:12px;border-color:#ff4fd8}#walk-run-pill.show,#walk-dance-pill.show{display:none}#walk-run-pill.on{background:#7dff6b}#walk-dance-pill.on{background:#ff4fd8}#walk-interior{position:fixed;inset:0;z-index:40;display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:24px;background:rgba(5,2,12,.94);color:#e9fff2;text-align:center;font:800 14px Orbitron,Rajdhani,sans-serif}#walk-interior.show{display:flex}#walk-interior h2{margin:0;font-size:18px;letter-spacing:.8px;color:#fff}#walk-interior p{margin:0;opacity:.9}#walk-interior button{border:0;border-radius:999px;padding:10px 16px;font:800 12px Orbitron,Rajdhani,sans-serif;letter-spacing:.5px;cursor:pointer;color:#04140c}#walk-open-page{background:#ff4fd8}#walk-step-out{background:#7dff6b}';
  document.head.appendChild(css);
  const b=document.createElement('div');
  b.id='walk-door-pill';b.hidden=true;b.setAttribute('role','button');b.tabIndex=0;
  const lab=document.createElement('b');lab.dataset.k='label';
  const act=document.createElement('span');act.dataset.k='act';
  const cam=document.createElement('button');
  cam.id='walk-door-cam';cam.type='button';cam.textContent='OPEN CAMERA DANCE STAGE';
  cam.addEventListener('click',e=>{
    e.stopPropagation();e.preventDefault();
    const building=walkDanceBuilding(WALK_MODE.door);
    if(window.DANCE_STAGE)window.DANCE_STAGE.open({building});
    else window.open('dance-stage.html','_blank');
  });
  const getOut=document.createElement('button');
  getOut.id='walk-get-out';getOut.type='button';getOut.textContent='GET OUT';
  getOut.addEventListener('click',e=>{e.stopPropagation();e.preventDefault();WALK_MODE.toggleGetOut();});
  const goIn=document.createElement('button');
  goIn.id='walk-park-enter';goIn.type='button';goIn.textContent='ENTER';
  goIn.addEventListener('click',e=>{e.stopPropagation();e.preventDefault();WALK_MODE.enterDoor();});
  b.append(lab,act,cam,getOut,goIn);
  b.addEventListener('click',()=>{if(WALK_MODE.onFoot)WALK_MODE.enterDoor();});
  const root=document.body||document.documentElement;
  root.appendChild(b);
  const run=document.createElement('button');
  run.id='walk-run-pill';run.type='button';run.textContent='RUN';run.hidden=true;run.style.display='none';
  run.addEventListener('click',()=>{if(WALK_MODE.onFoot)WALK_MODE.toggleRun();});
  const dance=document.createElement('button');
  dance.id='walk-dance-pill';dance.type='button';dance.textContent='DANCE';dance.hidden=true;dance.style.display='none';
  dance.addEventListener('click',()=>{if(WALK_MODE.onFoot)WALK_MODE.toggleDance();});
  root.append(run,dance);
  const room=document.createElement('div');
  room.id='walk-interior';room.hidden=true;
  const title=document.createElement('h2');title.dataset.k='title';
  const blurb=document.createElement('p');blurb.dataset.k='act';
  const open=document.createElement('button');
  open.id='walk-open-page';open.type='button';open.hidden=true;
  open.addEventListener('click',()=>walkLaunchStudio(open.dataset.purpose,WALK_MODE.insideDoor||WALK_MODE.door));
  const out=document.createElement('button');
  out.id='walk-step-out';out.type='button';out.textContent='STEP BACK OUTSIDE';
  out.addEventListener('click',()=>WALK_MODE.stepBackOutside());
  room.append(title,blurb,open,out);
  root.appendChild(room);
}
function walkSyncGait(){
  const run=typeof document!=='undefined'&&document.getElementById('walk-run-pill');
  const dance=typeof document!=='undefined'&&document.getElementById('walk-dance-pill');
  const on=!!(WALK_MODE&&WALK_MODE.onFoot);
  if(run){run.hidden=!on;run.style.display='none';run.classList.toggle('show',on);run.classList.toggle('on',!!(WALK_MODE.runMode||WALK_MODE._shift));}
  if(dance){dance.hidden=!on;dance.style.display='none';dance.classList.toggle('show',on);dance.classList.toggle('on',!!WALK_MODE.dancing);}
}
function walkShowInterior(door){
  walkEnsurePill();
  const card=typeof document!=='undefined'&&document.getElementById('walk-interior');
  if(!card||!door)return;
  const dance=door.purpose==='DANCE';
  const title=dance?WALK_DOOR.DANCE.purposeLabel:(door.purposeLabel||'');
  const act=dance?WALK_DOOR.DANCE.actionLabel:(door.actionLabel||'');
  const h=card.querySelector('[data-k="title"]'),p=card.querySelector('[data-k="act"]');
  if(h)h.textContent=title;
  if(p)p.textContent=act;
  const open=document.getElementById('walk-open-page');
  const label=walkPageLabel(door.purpose);
  if(open){open.hidden=!label;open.textContent=label||'';open.dataset.purpose=door.purpose||'';}
  card.hidden=false;card.classList.add('show');
}
function walkHideInterior(){
  const card=typeof document!=='undefined'&&document.getElementById('walk-interior');
  if(!card)return;
  card.hidden=true;card.classList.remove('show');
}
function walkSyncPill(){
  walkEnsurePill();
  const pill=typeof document!=='undefined'&&document.getElementById('walk-door-pill');
  if(!pill)return;
  const park=!WALK_MODE.onFoot&&WALK_MODE.parking;
  const d=WALK_MODE.onFoot?WALK_MODE.door:(park?park.door:null);
  const show=!!park||!!(d&&d.dist<WALK_PILL_M);
  const dance=!!(show&&!park&&d&&d.purpose==='DANCE');
  pill.classList.toggle('show',show);
  pill.classList.toggle('dance',dance);
  pill.classList.toggle('parked',!!park);
  pill.hidden=!show;
  pill.setAttribute('aria-hidden',show?'false':'true');
  const getOut=pill.querySelector('#walk-get-out'),goIn=pill.querySelector('#walk-park-enter');
  if(getOut)getOut.style.display=park?'block':'none';
  if(goIn)goIn.style.display=park?'block':'none';
  if(!show)return;
  if(dance){d.purposeLabel=WALK_DOOR.DANCE.purposeLabel;d.actionLabel=WALK_DOOR.DANCE.actionLabel;}
  const camBtn=pill.querySelector('#walk-door-cam');
  if(camBtn){
    camBtn.hidden=!dance;
    camBtn.style.display=dance?'block':'none';
  }
  pill.style.borderColor=(d&&d.color)||'#7dff6b';
  pill.style.boxShadow='0 0 16px '+((d&&d.color)||'#7dff6b');
  const lab=pill.querySelector('[data-k="label"]'),act=pill.querySelector('[data-k="act"]');
  if(park){
    if(lab)lab.textContent=walkParkLine(park);
    if(act)act.textContent='';
    if(goIn)goIn.textContent=walkEnterLabel(park);
  }else{
    if(lab)lab.textContent=(d&&d.purposeLabel)||'';
    if(act)act.textContent=(d&&d.actionLabel)||'[E] ENTER';
  }
  pill.setAttribute('aria-label',park?walkParkLine(park):((d&&d.purposeLabel)||'')+' '+((d&&d.actionLabel)||''));
}
function walkSyncDyn(){
  if(!walkDyn.walker)return;
  if(WALK_MODE.onFoot){walkDyn.walker.x=WALK_MODE.x;walkDyn.walker.y=WALK_MODE.y||0;walkDyn.walker.z=WALK_MODE.z;}
  else {walkDyn.walker.x=1e7;walkDyn.walker.z=1e7;}
  const door=WALK_MODE.onFoot?WALK_MODE.door:null;
  if(door){walkDyn.beacon.x=door.standX;walkDyn.beacon.z=door.standZ;walkDyn.beacon.y=0;}
  else {walkDyn.beacon.x=1e7;walkDyn.beacon.z=1e7;}
  if(typeof P!=='undefined'){walkDyn.glow.x=P.x;walkDyn.glow.y=(P.y||0)+0.08;walkDyn.glow.z=P.z;}
}

function walkOpenHub(purpose){
  if(purpose!=='HOME'&&purpose!=='GARAGE')return false;
  if(!window.GARAGE_HOME_HUB||typeof window.GARAGE_HOME_HUB.open!=='function')return false;
  window.GARAGE_HOME_HUB.open(purpose==='GARAGE'?'garage':'home');
  WALK_MODE.insideBuilding=true;
  return true;
}
function walkAct(door){
  const b=door,purpose=door.purpose;
  if(purpose==='HOME'){
    P.wreck=null;P.hards=0;P.hpDebt=0;P.wallHards=0;P.stall=false;P.nosTank=1;
    if(typeof showWreck==='function')showWreck(false);
    walkGreetPet();
    walkToast('WELCOME HOME, ELLIE! Z TUNED & READY',door.color);
    walkOpenHub('HOME');
  }else if(purpose==='NEON_PAINT'){
    if(walkHeadless())walkToast("ELLIE'S NEON PAINT STUDIO!",door.color);
    else if(typeof openNeonPaint==='function')openNeonPaint();
  }else if(purpose==='GARAGE'){
    P.nosTank=1;
    WALK_MODE.ugI=(WALK_MODE.ugI+1)%WALK_UG.length;
    WALK_MODE.ugColor=WALK_UG[WALK_MODE.ugI];
    WALK_MODE.ugT=6;
    if(typeof KID!=='undefined'&&KID)KID.underglow=WALK_MODE.ugColor;
    if(window.GARAGEZ&&typeof window.GARAGEZ.open==='function')window.GARAGEZ.open({building:walkDanceBuilding(door)});
    walkToast('GARAGE TUNE-UP! 100% NOS',door.color);
    walkOpenHub('GARAGE');
  }else if(purpose==='NOS'){
    P.nosTank=1;P.hotDropNosT=30;
    walkToast('NOS DEPOT! 30s OVERCHARGED NOS!',door.color);
  }else if(purpose==='DANCE'){
    const building=walkDanceBuilding(door);
    if(window.DANCE_STAGE&&typeof window.DANCE_STAGE.open==='function'){
      window.DANCE_STAGE.open({building});
    }else{
      WALK_MODE.dancePartyT=10;walkBurst(18);
      walkToast('DANCE STUDIO! NEON BEATS PARTY!',door.color);
    }
  }else if(purpose==='PETS'){
    walkGreetPet();
    walkToast('PET LOUNGE! CRITTERS SAY HI!',door.color);
  }else if(purpose==='CAFE'){
    P.score=(P.score||0)+250;
    P.nosTank=Math.min(1,(P.nosTank||0)+0.5);
    walkToast('BOBA & PIZZA BREAK! +250 PTS & +50% NOS',door.color);
  }else if(purpose==='ARCADE'){
    P.score=(P.score||0)+500;walkBurst(16);
    walkToast('RETRO ARCADE HIGH SCORE! +500 PTS',door.color);
  }else if(purpose==='SKY_DROP'){
    const top=b.top||0,atRoof=!WALK_MODE.onFoot||(WALK_MODE._roofY!=null&&Math.abs((WALK_MODE.y||0)-top)<2);
    if(!atRoof){
      P.x=b.cx;P.z=b.cz;P.y=top+0.5;P.v=0;P.ground=true;P.pitch=0;
      WALK_MODE.x=b.cx;WALK_MODE.z=b.cz;WALK_MODE.y=top;WALK_MODE._roofY=top;
      walkToast('SKY-DROP ELEVATOR! ROOFTOP!',door.color);
    }else{
      P.x=b.cx;P.z=b.cz;P.y=Math.max(top+2,180);P.ground=false;P.v=0;P.pitch=-0.35;
      WALK_MODE.onFoot=false;WALK_MODE._roofY=null;WALK_MODE.door=null;
      walkToast('SKY-DROP ELEVATOR! ROOFTOP LAUNCH!',door.color);
    }
  }else if(purpose==='SOCCER'){
    const S=(typeof CITY!=='undefined'&&CITY&&CITY.STAD)||{x:1100,z:400,r:95};
    const gap=(S.r||95)+16;
    P.x=S.x-gap;P.z=S.z;P.y=0;P.v=0;P.ground=true;P.pitch=0;P.yaw=Math.PI/2;P.hd=P.yaw;P.nosTank=1;
    if(WALK_MODE.onFoot){
      WALK_MODE.x=P.x-Math.cos(P.yaw)*1.35;WALK_MODE.z=P.z+Math.sin(P.yaw)*1.35;WALK_MODE.y=0;WALK_MODE.yaw=P.yaw;WALK_MODE._roofY=null;
    }
    walkToast('STADIUM ARENA READY! GAME ON!',door.color);
  }else if(purpose==='SHOWROOM'){
    P.nosTank=1;walkBurst(14);
    walkToast('Z-DASH SHOWROOM! 2010 370Z SPOTLIGHT',door.color);
  }else if(purpose==='BUILDER'){
    walkToast('CITY BUILDER HQ! SANDLOT NORTH OF THE RIVER',door.color);
  }
  WALK_MODE.lastAct=purpose;
}

const walkDyn={walker:null,beacon:null,glow:null};
window.WALK_MODE={
  unlocked:false,onFoot:false,x:0,y:0,z:0,yaw:0,door:null,
  dancePartyT:0,ugT:0,ugI:0,ugColor:WALK_UG[0],petType:'',lastAct:'',
  runMode:false,dancing:false,vx:0,vz:0,speed:0,stridePhase:0,gait:'idle',
  jumpY:0,jumpVy:0,jumpCount:0,emote:'',
  insideBuilding:false,insideDoor:null,cityHoldFrames:0,
  activeParking(x,z){
    if(typeof CITY==='undefined'||!CITY||!CITY.BL)return null;
    if(!Number.isFinite(+x)||!Number.isFinite(+z))return null;
    let box=null;
    for(const b of CITY.BL){
      const hit=walkParkingHit(b,x,z);
      if(hit&&(!box||hit.area<box.area))box=hit;
    }
    if(box)return box;
    let best=null;
    for(const b of CITY.BL){
      if(!b||b.parking||!b.doors)continue;
      for(const door of b.doors){
        if(!walkSideDoor(b,door))continue;
        const dist=Math.hypot(door[0]-x,door[1]-z);
        if(dist>WALK_PARK_M)continue;
        if(best&&dist>=best.door.dist)continue;
        const rec=walkDoorRec(b,door,x,z);
        best={type:'garage',label:'',buildingId:b.id,purposeLabel:rec.purposeLabel,door:rec,area:1e9,fallback:true};
      }
    }
    return best;
  },
  _holdParking(){
    if(typeof P==='undefined'||!P||this.onFoot||P.wreck||!P.ground||!(P.v<6)){this.parking=null;return null;}
    const park=this.activeParking(P.x,P.z);
    if(!park){this.parking=null;return null;}
    if(P.driveMode!=='street')P.driveMode='street';
    this.parking=park;this.door=park.door;
    return park;
  },
  _stepIntoBay(park){
    const door=park&&park.door;
    if(!door)return false;
    if(P.driveMode!=='street')P.driveMode='street';
    const yaw=P.yaw||0,side=1.65;
    this.x=P.x-Math.cos(yaw)*side;this.z=P.z+Math.sin(yaw)*side;this.y=P.y||0;this._roofY=null;
    const dx=(door.x==null?0:door.x-this.x),dz=(door.z==null?0:door.z-this.z);
    this.yaw=(dx||dz)?Math.atan2(dx,dz):yaw;
    this.onFoot=true;this.parking=null;
    const dist=Math.hypot((door.x==null?this.x:door.x)-this.x,(door.z==null?this.z:door.z)-this.z);
    this.door=Object.assign({},door,{dist:Number.isFinite(dist)?dist:0});
    this._parkLatch=door.buildingId;this._parkStep=this.door.dist;
    this.vx=0;this.vz=0;this.speed=0;this.gait='idle';this.dancing=false;
    P.v=0;P.ground=true;
    walkSyncPill();walkSyncGait();walkSyncDyn();
    return true;
  },
  canGetOut(){
    if(this.onFoot)return false;
    if(typeof P==='undefined'||!P||P.wreck||!P.ground)return false;
    const park=this.parking||this.activeParking(P.x,P.z);
    if(park&&P.v<6)return true;
    return P.driveMode==='street'&&P.v<3;
  },
  toggleGetOut(){
    if(this.onFoot){
      this.onFoot=false;this.door=null;this._roofY=null;this._autoBld=null;this._parkLatch=null;this._parkStep=null;
      this.insideBuilding=false;this.insideDoor=null;this.dancing=false;this.runMode=false;
      this.vx=0;this.vz=0;this.speed=0;this.gait='idle';this.jumpY=0;this.jumpVy=0;
      walkHideInterior();walkSyncPill();walkSyncGait();walkSyncDyn();return false;
    }
    const park=this._holdParking();
    if(park)return this._stepIntoBay(park);
    if(!this.canGetOut())return false;
    const yaw=P.yaw||0,side=1.35;
    this.x=P.x-Math.cos(yaw)*side;this.y=P.y||0;this.z=P.z+Math.sin(yaw)*side;this.yaw=yaw;
    this.onFoot=true;this._roofY=null;this.door=this.nearestDoor(16);
    this.vx=0;this.vz=0;this.speed=0;this.gait='idle';this.dancing=false;
    walkSyncPill();walkSyncGait();walkSyncDyn();
    return true;
  },
  toggleRun(){
    if(!this.onFoot)return false;
    this.runMode=!this.runMode;walkSyncGait();return this.runMode;
  },
  toggleDance(){
    if(!this.onFoot)return false;
    this.dancing=!this.dancing;
    if(this.dancing){this.vx=0;this.vz=0;this.speed=0;this.emote='tap';}
    this.gait=this.dancing?'dance':(this.jumpY||0)>0.05?'jump':this.speed>4.5?'run':this.speed>0.25?'walk':'idle';
    walkSyncGait();return this.dancing;
  },
  jump(){
    if(!this.onFoot||(this.jumpY||0)>0.05)return false;
    this.jumpVy=6.5;this.jumpY=0.06;this.dancing=false;
    this.jumpCount=(this.jumpCount||0)+1;this.gait='jump';
    walkBurst(8);walkToast('JUMP!','#3ee6ff');
    return true;
  },
  triggerEmote(dir){
    if(!this.onFoot)return false;
    const moves={
      up:{id:'up',label:'🕺 DANCE 1 · GROOVE',opt:'slot0'},
      right:{id:'right',label:'🔥 DANCE 2 · NEON SPIN',opt:'slot1'},
      down:{id:'down',label:'🐾 PET GROOVE PARTY',opt:'pet'},
      left:{id:'left',label:'⚡ DANCE 3 · HYPE',opt:'slot2'}
    };
    const meta=moves[dir];
    if(!meta||dir==='tap')return this.toggleDance();
    this.emote=dir;this.dancing=true;this.vx=0;this.vz=0;this.speed=0;this.gait='dance';this.dancePartyT=8;
    if(dir==='down'){
      walkGreetPet();walkToast('🐾 PET GROOVE PARTY!','#7dff6b');walkSyncGait();return true;
    }
    const crew=(typeof window!=='undefined'&&window.CREW_STATE)||(typeof CREW_STATE!=='undefined'?CREW_STATE:null);
    const data=(typeof window!=='undefined'&&window.CREWDATA)||(typeof CREWDATA!=='undefined'?CREWDATA:null);
    const api=crew&&typeof crew.setCharDanceOpt==='function'?crew:(data&&typeof data.setCharDanceOpt==='function'?data:null);
    if(api)api.setCharDanceOpt(meta.opt);
    walkToast(meta.label,'#ff4fd8');walkSyncGait();return true;
  },
  stepBackOutside(){
    const door=this.insideDoor||this.door;
    this.insideBuilding=false;this.insideDoor=null;this.dancing=false;
    this.vx=0;this.vz=0;this.speed=0;this.gait='idle';
    walkHideInterior();
    if(window.DANCE_STAGE&&typeof window.DANCE_STAGE.close==='function'){try{window.DANCE_STAGE.close();}catch(e){}}
    if(window.GARAGE_HOME_HUB&&typeof window.GARAGE_HOME_HUB.close==='function'){try{window.GARAGE_HOME_HUB.close();}catch(e){}}
    if(door&&door.standX!=null&&door.standZ!=null){
      this.onFoot=true;this.x=door.standX;this.z=door.standZ;this.y=door.y||0;this._roofY=null;
      const nx=door.nx||0,nz=door.nz||0;
      if(nx||nz)this.yaw=Math.atan2(nx,nz);
      if(door.buildingId!=null)this._autoBld=door.buildingId;
      if(typeof P!=='undefined'&&P){P.x=this.x;P.z=this.z;P.y=this.y||0;P.ground=true;P.v=0;P.pitch=0;P.yaw=this.yaw;P.hd=this.yaw;}
    }
    this.door=this.onFoot?this.nearestDoor(18):null;
    walkSyncPill();walkSyncGait();walkSyncDyn();
    return true;
  },
  nearestDoor(maxDist){
    const max=maxDist==null?18:+maxDist;
    if(!isFinite(max)||max<=0)return null;
    if(typeof CITY==='undefined'||!CITY||!CITY.BL)return null;
    const x=this.onFoot?this.x:(typeof P!=='undefined'?P.x:this.x);
    const z=this.onFoot?this.z:(typeof P!=='undefined'?P.z:this.z);
    let best=null,bd=max;
    for(const b of CITY.BL){
      if(!b||!b.doors)continue;
      const meta=walkMeta(b);
      for(const door of b.doors){
        const dx=door[0]-x,dz=door[1]-z,dist=Math.hypot(dx,dz);
        if(dist>=bd)continue;
        const nx=door[2]||0,nz=door[3]||0;
        bd=dist;
        const garage=walkDoorTag(door);
        const reach=garage?WALK_BAY_STAND:1.05;
        best={x:door[0],z:door[1],nx,nz,dist,y:0,buildingId:b.id,standX:door[0]+nx*reach,standZ:door[1]+nz*reach,garage,
          purpose:meta.purpose,purposeLabel:meta.purposeLabel,actionLabel:meta.actionLabel,color:meta.color,
          top:b.top||0,cx:b.cx,cz:b.cz};
      }
    }
    return best;
  },
  enterDoor(){
    if(typeof P==='undefined')return false;
    // On foot, a prompt door (under 6 m) wins. From a parked bay, the garage door opens the building.
    // In the car elsewhere, only a sky-drop door beside the Z qualifies.
    if(!this.onFoot)this._holdParking();
    const park=!this.onFoot&&this.parking;
    let door=this.onFoot&&this.door&&(this.door.dist<WALK_PILL_M||this.door.garage)?this.door:null;
    if(!door&&park)door=park.door;
    if(!door)door=this.nearestDoor(WALK_PILL_M);
    if(!door)return false;
    if(!park&&!(door.dist<WALK_PILL_M))return false;
    if(!this.onFoot&&door.purpose!=='SKY_DROP'&&!park)return false;
    this.door=door;
    try{walkAct(door);}catch(e){return false;}
    if(WALK_INDOOR[door.purpose]){this.insideBuilding=true;this.insideDoor=door;walkShowInterior(door);}
    else{this.insideBuilding=false;this.insideDoor=null;walkHideInterior();}
    walkSyncPill();walkSyncGait();walkSyncDyn();
    return true;
  },
  update(dt){
    const d=Math.max(0,Math.min(0.05,+dt||0));
    const jumpHeld=!!(typeof B!=='undefined'&&B&&(B.jump||B.brk))||!!(typeof K!=='undefined'&&K&&K.Space);
    if(this.onFoot&&jumpHeld&&!this._jumpHeld)this.jump();
    this._jumpHeld=jumpHeld;
    if(this.dancePartyT>0)this.dancePartyT=Math.max(0,this.dancePartyT-d);
    if(this.ugT>0)this.ugT=Math.max(0,this.ugT-d);
    if(typeof P!=='undefined'&&P.hotDropNosT>0){P.hotDropNosT=Math.max(0,P.hotDropNosT-d);P.nosTank=1;}
    if(!this.onFoot){
      // A bay ENTER opens the room while she is still in the seat. Keep that room up.
      if(this.insideBuilding){walkSyncPill();walkSyncGait();walkSyncDyn();return;}
      this.vx=0;this.vz=0;this.speed=0;this.dancing=false;this.gait='idle';
      this._holdParking();
      walkSyncPill();walkSyncGait();walkSyncDyn();
      return;
    }
    const leave=typeof P==='undefined'||P.driveMode!=='street'||!!P.wreck||(!P.ground&&this._roofY==null);
    if(leave){
      this.onFoot=false;this.door=null;this._roofY=null;this._autoBld=null;this._parkLatch=null;
      if(this.insideBuilding){this.insideBuilding=false;this.insideDoor=null;walkHideInterior();}
      this.vx=0;this.vz=0;this.speed=0;this.dancing=false;this.gait='idle';this.jumpY=0;this.jumpVy=0;
      this._holdParking();
      walkSyncPill();walkSyncGait();walkSyncDyn();return;
    }
    if(this.insideBuilding){
      const n=this.nudge,moving=!!(n&&(Math.abs(n.x)>0.01||Math.abs(n.z)>0.01));
      if(moving)this.dancing=false;
      if(this.dancing){this.vx=0;this.vz=0;this.speed=0;this.stridePhase+=d*DANCE_STRIDE;}
      else{
        this.vx=walkApproach(this.vx,0,WALK_BRAKE,d);this.vz=walkApproach(this.vz,0,WALK_BRAKE,d);
        this.speed=Math.hypot(this.vx,this.vz);
        if(this.speed>0.05)this.stridePhase+=this.speed*d*WALK_STRIDE;
      }
      if((this.jumpY||0)>0||(this.jumpVy||0)>0){
        this.jumpY=Math.max(0,(this.jumpY||0)+(this.jumpVy||0)*d);
        this.jumpVy=(this.jumpVy||0)-17.5*d;
        if(this.jumpY<=0){this.jumpY=0;this.jumpVy=0;}
      }
      this.gait=this.dancing?'dance':(this.jumpY||0)>0.05?'jump':this.speed>4.5?'run':this.speed>0.25?'walk':'idle';
      walkSyncPill();walkSyncGait();walkSyncDyn();return;
    }
    walkIntegrate(this,d);
    this.door=this.nearestDoor(18);
    const bay=!!(this.door&&this.door.garage);
    const autoM=bay?WALK_BAY_M:WALK_AUTO_M;
    const stepped=!bay||this._parkLatch!==this.door.buildingId||this.door.dist<(this._parkStep==null?WALK_BAY_M:this._parkStep-0.2);
    if(this.door&&this.door.dist<autoM&&stepped){
      if(this._autoBld!==this.door.buildingId){this._autoBld=this.door.buildingId;this.enterDoor();}
    }else if(!this.door||this.door.dist>=(bay?WALK_PILL_M:WALK_PILL_M))this._autoBld=null;
    walkSyncPill();walkSyncGait();walkSyncDyn();
  }
};

walkEnsurePill();
addEventListener('keydown',e=>{
  if(e.code==='ShiftLeft'||e.code==='ShiftRight'){WALK_MODE._shift=true;walkSyncGait();return;}
  if(e.repeat||e.code!=='KeyE'||!WALK_MODE.onFoot)return;
  const tag=e.target&&e.target.tagName;
  if(tag==='INPUT'||tag==='TEXTAREA')return;
  WALK_MODE.enterDoor();
});
addEventListener('keyup',e=>{
  if(e.code!=='ShiftLeft'&&e.code!=='ShiftRight')return;
  WALK_MODE._shift=false;walkSyncGait();
});
if(typeof CITY!=='undefined'&&CITY&&CITY.DYN){
  walkDyn.walker={x:1e7,y:0,z:1e7,rad:3,draw:walkDrawMarker};
  walkDyn.beacon={x:1e7,y:0,z:1e7,rad:4,draw:walkDrawBeacon};
  walkDyn.glow={x:0,y:0,z:0,rad:4,draw:walkDrawGlow};
  CITY.DYN.push(walkDyn.walker,walkDyn.beacon,walkDyn.glow);
}
// boot.js owns the city loop. Hold that one callback while an interior is open so the
// outdoor draw, traffic, and flight step do not spend frames behind the room card.
const walkNativeRAF=window.requestAnimationFrame.bind(window);
let walkCityLoop=null;
window.requestAnimationFrame=function(fn){
  if(typeof fn==='function'&&fn.name==='loop'){
    if(!walkCityLoop){
      const game=fn;
      walkCityLoop=function(t){
        if(WALK_MODE.insideBuilding){WALK_MODE.cityHoldFrames=(WALK_MODE.cityHoldFrames||0)+1;walkNativeRAF(walkCityLoop);return;}
        game(t);
      };
    }
    return walkNativeRAF(walkCityLoop);
  }
  return walkNativeRAF(fn);
};
let walkT=performance.now();
function walkFrame(t){
  const dt=Math.min(0.05,Math.max(0,(t-walkT)/1000));walkT=t;
  try{WALK_MODE.update(dt);}catch(e){}
  walkNativeRAF(walkFrame);
}
walkNativeRAF(walkFrame);
