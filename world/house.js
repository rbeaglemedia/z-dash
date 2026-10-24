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
const WALK_INDOOR={HOME:1,SHOWROOM:1,NEON_PAINT:1,GARAGE:1,DANCE:1,PETS:1,CAFE:1,ARCADE:1,BUILDER:1,NOS:1,SOCCER:1};
const WALK_PAGE={NEON_PAINT:'neon-paint.html',DANCE:'dance-stage.html',GARAGE:'jr.html#garage',PETS:'crew.html'};
const WALK_HOUSE_KEY='zdash.house.v1',WALK_KID_KEY='zdash.kid.v1';
const WALK_THEMES=['#ff4fd8','#3ee6ff','#7dff6b','#ffb020','#9b5cff'];
const WALK_FURN=['sofa','arcade','dj','trophy'];
const WALK_SIGNS=['ELLIE','Z COMPANY','370Z','HOME'];

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
  let name=park&&park.purposeLabel||'BUILDING';
  const kind=park&&park.type==='lot'?'LOT':'GARAGE';
  if(name.slice(-kind.length).toUpperCase()!==kind)name+=' '+kind;
  return 'PARKED AT '+name+' — TAP EXIT CAR OR ENTER';
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
  if(purpose==='NEON_PAINT')return 'OPEN NEON PAINT STUDIO';
  if(purpose==='GARAGE')return 'OPEN GARAGE Z';
  if(purpose==='PETS')return 'OPEN CREW & PETS';
  if(purpose==='SHOWROOM')return 'SPOTLIGHT THE 370Z';
  if(purpose==='CAFE')return 'ORDER BOBA & PIZZA';
  if(purpose==='ARCADE')return 'HIT THE ARCADE';
  if(purpose==='SOCCER')return 'KICK OFF';
  if(purpose==='BUILDER')return 'OPEN THE BLUEPRINTS';
  if(purpose==='NOS')return 'CLAIM THE NOS';
  return '';
}
function walkFurnLabel(id){
  if(id==='arcade')return 'RETRO ARCADE CABINET';
  if(id==='dj')return 'DJ BOOTH';
  if(id==='trophy')return 'TROPHY SHELF';
  if(id==='counter')return 'COUNTER SET';
  return 'CYBER SOFA';
}
function walkHouseRead(key){
  try{
    const raw=JSON.parse(localStorage.getItem(key)||'null');
    if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
    if(raw.house&&typeof raw.house==='object')return raw.house;
    return raw;
  }catch(e){return null;}
}
const HOUSE_WALL_HEX={'neon-grid':'#3ee6ff',bubblegum:'#ff4fd8',midnight:'#9b5cff','lime-loft':'#7dff6b'};
const HOUSE_WALL_NAME={'neon-grid':'NEON GRID',bubblegum:'BUBBLEGUM',midnight:'MIDNIGHT','lime-loft':'LIME LOFT'};
const HOUSE_SIGN_TEXT={ellie:"ELLIE'S Z",arts:'Z COMPANY ARTS',home:'WELCOME HOME',glow:'NEON DREAMS'};
const HOUSE_SIGN_IDS=['ellie','arts','home','glow'];
const HOUSE_WALL_IDS=['neon-grid','bubblegum','midnight','lime-loft'];
function walkHouseLoad(){
  const a=walkHouseRead(WALK_HOUSE_KEY)||{},b=walkHouseRead(WALK_KID_KEY)||{};
  const src=Object.assign({},b,a);
  const oldWall={'#ff4fd8':'bubblegum','#3ee6ff':'neon-grid','#7dff6b':'lime-loft','#ffb020':'neon-grid','#9b5cff':'midnight'};
  const oldSign={ELLIE:'ellie','Z COMPANY':'arts','370Z':'glow',HOME:'home'};
  let wall=src.wall||src.wallTheme;
  if(!HOUSE_WALL_HEX[wall])wall=oldWall[src.theme]||'neon-grid';
  let sign=src.sign;
  if(!HOUSE_SIGN_TEXT[sign])sign=oldSign[src.sign]||'ellie';
  const furniture=WALK_FURN.indexOf(src.furniture)>=0?src.furniture:(src.furniture==='counter'?'counter':'sofa');
  const hub=typeof src.sofa==='boolean'||typeof src.arcade==='boolean'||typeof src.danceFloor==='boolean'||typeof src.counter==='boolean';
  const sofa=hub?(src.sofa!==false):(furniture==='sofa'||src.furniture==null);
  const arcade=hub?(src.arcade!==false):(furniture==='arcade');
  const danceFloor=hub?(src.danceFloor!==false):false;
  const counter=hub?src.counter===true:furniture==='counter';
  const hasPlaced=Array.isArray(src.placed);
  return {theme:HOUSE_WALL_HEX[wall],wall,wallName:HOUSE_WALL_NAME[wall],furniture,petBed:src.petBed!==false,sign,signText:HOUSE_SIGN_TEXT[sign],accent:HOUSE_WALL_HEX[wall],sofa,arcade,danceFloor,counter,placed:hasPlaced?src.placed:[],hasPlaced};
}
function walkHouseSave(patch){
  const cur=walkHouseLoad();
  const next=Object.assign({
    v:1,wall:cur.wall,sign:cur.sign,sofa:!!cur.sofa,arcade:!!cur.arcade,petBed:cur.petBed!==false,
    danceFloor:!!cur.danceFloor,counter:!!cur.counter,furniture:cur.furniture,theme:cur.accent
  },patch||{});
  if(cur.hasPlaced||(patch&&Array.isArray(patch.placed)))next.placed=Array.isArray(next.placed)?next.placed:(cur.placed||[]);
  else delete next.placed;
  next.wallTheme=next.wall;
  next.neonSign=HOUSE_SIGN_TEXT[next.sign]||cur.signText;
  next.items={sofa:!!next.sofa,arcade:!!next.arcade,petBed:next.petBed!==false,danceFloor:!!next.danceFloor,counter:!!next.counter};
  try{localStorage.setItem(WALK_HOUSE_KEY,JSON.stringify(next));}catch(e){}
  try{
    const kid=JSON.parse(localStorage.getItem(WALK_KID_KEY)||'null');
    if(kid&&typeof kid==='object'&&!Array.isArray(kid)){kid.house=next;localStorage.setItem(WALK_KID_KEY,JSON.stringify(kid));}
  }catch(e){}
  try{if(window.WALK_ITEMS&&WALK_ITEMS.invalidate)WALK_ITEMS.invalidate();}catch(e){}
  return next;
}
function walkPetKind(){
  if(WALK_MODE&&WALK_MODE.petType)return WALK_MODE.petType;
  try{
    const kid=JSON.parse(localStorage.getItem(WALK_KID_KEY)||'null');
    if(kid&&kid.pet&&kid.pet.type)return kid.pet.type;
  }catch(e){}
  const D=window.CREWDATA;
  if(D&&D.pet&&D.pet.type)return D.pet.type;
  return 'pup';
}
function walkRoomReset(){
  WALK_MODE.room={x:0,z:2.45,yaw:Math.PI,petX:1.1,petZ:2.15,tx:null,tz:null};
}
function walkIso(x,z,W,H){
  const ox=W*0.5,oy=H*0.58;
  return [ox+(x-z*0.45)*42,oy+(z+x*0.22)*36];
}
function walkUniso(px,py,W,H){
  const ox=W*0.5,oy=H*0.58,u=(px-ox)/42,v=(py-oy)/36;
  const x=(u+0.45*v)/1.099,z=v-0.22*x;
  return {x:clamp(x,-4.4,4.4),z:clamp(z,-3.2,3.2)};
}
function walkStations(purpose){
  if(purpose==='HOME')return [
    {id:'theme',x:-3.1,z:-2.15,label:'WALL'},
    {id:'furniture',x:2.5,z:-1.3,label:'FURNITURE'},
    {id:'petBed',x:-2.5,z:0.55,label:'PET BED'},
    {id:'sign',x:0.2,z:-2.55,label:'SIGN'}
  ];
  return [{id:'act',x:0,z:-0.4,label:'ACT'}];
}
function walkUseStation(id){
  const door=WALK_MODE.insideDoor,purpose=door&&door.purpose;
  if(purpose==='HOME'){
    const s=walkHouseLoad();
    if(id==='theme'){const i=Math.max(0,HOUSE_WALL_IDS.indexOf(s.wall));const wall=HOUSE_WALL_IDS[(i+1)%HOUSE_WALL_IDS.length];walkHouseSave({wall,theme:HOUSE_WALL_HEX[wall]});}
    else if(id==='furniture'){const order=WALK_FURN.concat(['counter']);const i=Math.max(0,order.indexOf(s.furniture));const furniture=order[(i+1)%order.length];const patch={furniture};if(furniture==='sofa'||furniture==='arcade'||furniture==='counter')patch[furniture]=true;walkHouseSave(patch);}
    else if(id==='petBed')walkHouseSave({petBed:!s.petBed});
    else if(id==='sign'){const i=Math.max(0,HOUSE_SIGN_IDS.indexOf(s.sign));walkHouseSave({sign:HOUSE_SIGN_IDS[(i+1)%HOUSE_SIGN_IDS.length]});}
    walkFillTools('HOME');
  }else{
    const open=document.getElementById('walk-open-page');
    if(open&&!open.hidden)open.click();
    else walkToast(walkPageLabel(purpose)||'READY',(door&&door.color)||'#3ee6ff');
  }
  walkPaintRoom();
}
function walkFillTools(purpose){
  const row=typeof document!=='undefined'&&document.getElementById('walk-room-tools');
  if(!row)return;
  row.replaceChildren();
  if(purpose!=='HOME')return;
  const s=walkHouseLoad();
  const specs=[
    ['theme','NEON WALL · '+(s.wallName||s.wall)],
    ['furniture','FURNITURE · '+walkFurnLabel(s.furniture)],
    ['petBed',s.petBed?'GLOWING PET BED · ON':'GLOWING PET BED · OFF'],
    ['sign','NEON SIGN · '+(s.signText||s.sign)]
  ];
  for(const pair of specs){
    const b=document.createElement('button');
    b.type='button';b.dataset.house=pair[0];b.textContent=pair[1];
    b.addEventListener('click',()=>walkUseStation(pair[0]));
    row.appendChild(b);
  }
}
function walkRoomStep(w,d){
  const room=w.room||(w.room={x:0,z:2.45,yaw:Math.PI,petX:1.1,petZ:2.15,tx:null,tz:null});
  let ix=0,iz=0;
  if(typeof K!=='undefined'&&K){
    ix=(K.ArrowRight||K.KeyD?1:0)-(K.ArrowLeft||K.KeyA?1:0);
    iz=(K.ArrowDown||K.KeyS?1:0)-(K.ArrowUp||K.KeyW?1:0);
  }
  const n=w.nudge;
  if(n&&(Math.abs(n.x)>0.01||Math.abs(n.z)>0.01)){ix=n.x;iz=n.z;}
  if(!ix&&!iz&&typeof B!=='undefined'&&B&&(B.walk||B.tup))iz=-1;
  if(!ix&&!iz&&room.tx!=null){
    const dx=room.tx-room.x,dz=room.tz-room.z;
    if(Math.hypot(dx,dz)<0.08){room.tx=null;room.tz=null;}
    else{ix=dx;iz=dz;}
  }
  const len=Math.hypot(ix,iz);
  if(len>0.01){
    room.x=clamp(room.x+(ix/len)*2.4*d,-4.2,4.2);
    room.z=clamp(room.z+(iz/len)*2.4*d,-3.05,3.05);
    room.yaw=Math.atan2(ix,-iz);
  }
  const bed=walkHouseLoad();
  const idle=len<0.01&&room.tx==null;
  const hx=idle&&bed.petBed&&(w.insideDoor&&w.insideDoor.purpose==='HOME')?-2.5:room.x+0.85;
  const hz=idle&&bed.petBed&&(w.insideDoor&&w.insideDoor.purpose==='HOME')?0.55:room.z+0.35;
  const k=Math.min(1,(d||0.016)*3.2);
  room.petX+=(hx-room.petX)*k;room.petZ+=(hz-room.petZ)*k;
}
let walkCrewBuf=null;
function walkCam(x,y,z,W,H){
  const s=1.45/Math.max(0.38,z+1.7);
  return [W*0.5+x*s*H*0.58,H*0.60-(y-1.4)*s*H*0.58,s];
}
function walkQuad(g,pts,fill,stroke){
  g.beginPath();
  pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));
  g.closePath();
  if(fill){g.fillStyle=fill;g.fill();}
  if(stroke){g.strokeStyle=stroke;g.lineWidth=2;g.stroke();}
}
function walkBox(g,x,y,z,w,h,d,fill,stroke,W,H){
  const f=(px,py,pz)=>walkCam(px,py,pz,W,H);
  const a=f(x-w,y,z-d),b=f(x+w,y,z-d),c=f(x+w,y,z+d),e=f(x-w,y,z+d);
  const A=f(x-w,y+h,z-d),B=f(x+w,y+h,z-d),C=f(x+w,y+h,z+d),E=f(x-w,y+h,z+d);
  walkQuad(g,[e,c,C,E],fill,stroke);
  walkQuad(g,[a,b,B,A],fill,stroke);
  walkQuad(g,[a,e,E,A],fill,stroke);
  walkQuad(g,[b,c,C,B],fill,stroke);
  walkQuad(g,[A,B,C,E],fill,stroke);
}
function walkRoomTheme(purpose,house){
  const accent=(house&&house.theme)||(WALK_DOOR[purpose]&&WALK_DOOR[purpose].color)||'#ff4fd8';
  const base={
    HOME:{floor:'#241434',wall:'#3a2058',ceil:'#14081c',name:"ELLIE'S HOUSE"},
    GARAGE:{floor:'#2a2416',wall:'#3a321c',ceil:'#14120c',name:'SPEED GARAGE'},
    DANCE:{floor:'#2a1024',wall:'#4a1840',ceil:'#160810',name:'Z COMPANY ARTS'},
    NEON_PAINT:{floor:'#1c1830',wall:'#2c2450',ceil:'#100e1c',name:'NEON PAINT'},
    PETS:{floor:'#142418',wall:'#1c3824',ceil:'#0c140e',name:'CREW & PETS'},
    ARCADE:{floor:'#221838',wall:'#342050',ceil:'#120a1c',name:'PIXEL ARCADE'},
    SOCCER:{floor:'#14301c',wall:'#1c4030',ceil:'#0c1810',name:'SOCCER CLUB'},
    SKY_DROP:{floor:'#143040',wall:'#1c4860',ceil:'#0c1820',name:'SKY TOWER'},
    SHOWROOM:{floor:'#182430',wall:'#243848',ceil:'#101820',name:'GLASS SHOWROOM'},
    CAFE:{floor:'#301810',wall:'#482418',ceil:'#180c08',name:'PIZZA & BOBA'},
    NOS:{floor:'#142028',wall:'#1c3040',ceil:'#0c1418',name:'NOS DEPOT'},
    BUILDER:{floor:'#2a2614',wall:'#3a3418',ceil:'#14120c',name:'BUILDER HQ'}
  };
  return Object.assign({floor:'#1a1028',wall:'#2a1844',ceil:'#100818',name:purpose||'ROOM',accent},base[purpose]||{},{accent});
}
function walkDrawPerson(g,x,z,W,H){
  const skin='#f0c8a8',cloth='#ff4fd8',trim='#3ee6ff',hair='#7a2cff';
  const hip=walkCam(x,0.95,z,W,H),hd=walkCam(x,1.62,z,W,H);
  const s=Math.max(18,hd[2]*H*0.34);
  const sway=Math.sin((performance.now()||0)/180)*s*0.04;
  g.save();
  g.translate(sway,0);
  g.strokeStyle=trim;g.lineWidth=Math.max(4,s*0.16);g.lineCap='round';
  const footL=walkCam(x-0.16,0.02,z+0.05,W,H),footR=walkCam(x+0.16,0.02,z-0.02,W,H);
  g.beginPath();g.moveTo(hip[0]-s*0.12,hip[1]);g.lineTo(footL[0],footL[1]);g.moveTo(hip[0]+s*0.12,hip[1]);g.lineTo(footR[0],footR[1]);g.stroke();
  g.fillStyle=cloth;
  g.beginPath();g.moveTo(hip[0]-s*0.38,hip[1]);g.lineTo(hip[0]+s*0.38,hip[1]);g.lineTo(hd[0]+s*0.28,hd[1]+s*0.15);g.lineTo(hd[0]-s*0.28,hd[1]+s*0.15);g.closePath();g.fill();
  g.strokeStyle=trim;g.stroke();
  const handL=walkCam(x-0.42,1.05,z,W,H),handR=walkCam(x+0.42,1.05,z,W,H);
  g.beginPath();g.moveTo(hd[0]-s*0.22,hd[1]+s*0.35);g.lineTo(handL[0],handL[1]);g.moveTo(hd[0]+s*0.22,hd[1]+s*0.35);g.lineTo(handR[0],handR[1]);g.stroke();
  g.fillStyle=hair;g.beginPath();g.arc(hd[0],hd[1],s*0.46,0,7);g.fill();
  g.fillStyle=skin;g.beginPath();g.arc(hd[0],hd[1]+s*0.06,s*0.32,0,7);g.fill();
  g.fillStyle='#fff';g.fillRect(hd[0]-s*0.16,hd[1]-s*0.02,s*0.1,s*0.06);g.fillRect(hd[0]+s*0.06,hd[1]-s*0.02,s*0.1,s*0.06);
  g.restore();
}
function walkDrawPetBody(g,x,z,W,H){
  const p=walkCam(x,0.28,z,W,H),s=Math.max(10,p[2]*H*0.16);
  g.fillStyle='#ffb020';g.beginPath();g.ellipse(p[0],p[1],s*1.3,s*0.7,0,0,7);g.fill();
  g.beginPath();g.arc(p[0]+s*0.9,p[1]-s*0.55,s*0.55,0,7);g.fill();
  g.fillStyle='#fff';g.beginPath();g.arc(p[0]+s*1.05,p[1]-s*0.62,s*0.12,0,7);g.fill();
  g.fillStyle='#e9fff2';g.font='700 12px sans-serif';g.textAlign='left';g.fillText(walkPetKind(),p[0]+s*1.6,p[1]);
}
function walkPaintCrew(g,foot,W,H){
  const crew=window.CREW;
  if(!crew||typeof crew.preview!=='function'||typeof document==='undefined')return false;
  const bw=360,bh=480;
  if(!walkCrewBuf)walkCrewBuf=document.createElement('canvas');
  if(walkCrewBuf.width!==bw){walkCrewBuf.width=bw;walkCrewBuf.height=bh;}
  const c=walkCrewBuf.getContext('2d',{willReadFrequently:true});
  if(!c)return false;
  const state=window.CREW_STATE,prev=state&&state.gait;
  try{
    if(state)state.gait=(WALK_MODE.speed>0.3||(WALK_MODE.room&&WALK_MODE.room.tx!=null))?'walk':'idle';
    crew.preview(c,bw,bh,performance.now());
  }catch(e){return false;}
  finally{if(state&&prev!=null)state.gait=prev;}
  let img;try{img=c.getImageData(0,0,bw,bh);}catch(e){return false;}
  const d=img.data;let ink=0;
  for(let i=0;i<d.length;i+=4){
    if(d[i]<18&&d[i+1]<14&&d[i+2]<32)d[i+3]=0;
    else ink++;
  }
  if(ink<80)return false;
  c.putImageData(img,0,0);
  const dh=Math.min(H*0.78,W*0.92),dw=dh*(bw/bh);
  g.drawImage(walkCrewBuf,foot[0]-dw*0.40,foot[1]-dh*0.90,dw,dh);
  return true;
}
function walkPaintRoom(){
  const cv=typeof document!=='undefined'&&document.getElementById('walk-room-cv');
  const door=WALK_MODE.insideDoor;
  const card=typeof document!=='undefined'&&document.getElementById('walk-interior');
  if(!cv||!door||!WALK_MODE.insideBuilding)return;
  const W=Math.max(320,Math.floor((card&&card.clientWidth)||window.innerWidth||844));
  const H=Math.max(180,Math.floor((card&&card.clientHeight)||window.innerHeight||390));
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;}
  const g=cv.getContext('2d');if(!g)return;
  const purpose=door.purpose||'HOME';
  const house=purpose==='HOME'?walkHouseLoad():null;
  const theme=walkRoomTheme(purpose,house);
  const cam=(x,y,z)=>walkCam(x,y,z,W,H);
  const drawStatic=function(bg){
  bg.shadowBlur=0;
  bg.fillStyle='#05010c';bg.fillRect(0,0,W,H);
  const ceil=bg.createLinearGradient(0,0,0,H*0.45);
  ceil.addColorStop(0,theme.ceil);ceil.addColorStop(1,theme.wall);
  bg.fillStyle=ceil;bg.fillRect(0,0,W,H*0.5);
  walkQuad(bg,[cam(-4.2,0,7.4),cam(4.2,0,7.4),cam(4.2,3.1,7.4),cam(-4.2,3.1,7.4)],theme.wall,theme.accent);
  walkQuad(bg,[cam(-4.2,0,1.1),cam(-4.2,0,7.4),cam(-4.2,3.1,7.4),cam(-4.2,3.1,1.1)],theme.wall,null);
  walkQuad(bg,[cam(4.2,0,1.1),cam(4.2,0,7.4),cam(4.2,3.1,7.4),cam(4.2,3.1,1.1)],theme.wall,null);
  walkQuad(bg,[cam(-4.2,0,1.1),cam(4.2,0,1.1),cam(4.2,0,7.4),cam(-4.2,0,7.4)],theme.floor,null);
  bg.strokeStyle=theme.accent;bg.globalAlpha=0.45;bg.lineWidth=1.5;bg.shadowBlur=0;
  for(let i=-4;i<=4;i++){const a=cam(i,0.02,1.2),b=cam(i,0.02,7.2);bg.beginPath();bg.moveTo(a[0],a[1]);bg.lineTo(b[0],b[1]);bg.stroke();}
  for(let z=2;z<=7;z++){const a=cam(-4,0.02,z),b=cam(4,0.02,z);bg.beginPath();bg.moveTo(a[0],a[1]);bg.lineTo(b[0],b[1]);bg.stroke();}
  bg.globalAlpha=1;
  const lampL=cam(-1.4,3.0,4),lampR=cam(1.4,3.0,4);
  bg.fillStyle=theme.accent;bg.fillRect(lampL[0],lampL[1],Math.max(18,lampL[2]*80),6);bg.fillRect(lampR[0],lampR[1],Math.max(18,lampR[2]*80),6);
  if(purpose==='HOME'){
    walkBox(bg,-2.3,0,6.2,0.9,0.7,0.4,theme.accent,'#fff',W,H);
    if(!house||house.petBed)walkBox(bg,-2.6,0,3.2,0.7,0.22,0.45,'#7dff6b','#e9fff2',W,H);
    walkBox(bg,2.3,0,5.4,0.7,0.9,0.4,'#3ee6ff','#fff',W,H);
    const sign=cam(0.1,2.35,7.2);
    bg.fillStyle=theme.accent;bg.font='800 22px sans-serif';bg.textAlign='center';bg.fillText((house&&(house.signText||house.sign))||'ELLIE',sign[0],sign[1]);
  }else if(purpose==='DANCE'){
    walkBox(bg,0,0,4.6,1.6,0.04,1.6,'#ff4fd8','#fff',W,H);
    walkBox(bg,0,1.2,7.2,2.2,1.3,0.08,'#1a0614','#ff4fd8',W,H);
  }else if(purpose==='GARAGE'){
    walkBox(bg,0,0.9,5.5,1.3,0.12,0.8,'#ffb020','#fff',W,H);
    walkBox(bg,-2.8,0,5.2,0.45,1.1,0.35,'#3a321c','#ffb020',W,H);
  }else if(purpose==='NEON_PAINT'){
    walkBox(bg,-2.2,0,5,0.2,1.4,0.2,'#ff4fd8','#fff',W,H);
    walkBox(bg,-1.4,0,5,0.2,1.4,0.2,'#3ee6ff','#fff',W,H);
    walkBox(bg,-0.6,0,5,0.2,1.4,0.2,'#7dff6b','#fff',W,H);
  }else if(purpose==='ARCADE'){
    walkBox(bg,-2.2,0,5.2,0.45,1.5,0.35,'#ffe14d','#fff',W,H);
    walkBox(bg,2.2,0,5.2,0.45,1.5,0.35,'#ff4fd8','#fff',W,H);
  }else if(purpose==='SOCCER'){
    walkBox(bg,0,0,5.5,2.2,0.05,1.1,'#1c6b32','#fff',W,H);
    walkBox(bg,0,0.4,7.1,1.5,0.7,0.08,'#e9fff2','#7dfff2',W,H);
  }else if(purpose==='SKY_DROP'){
    walkBox(bg,-2.4,0.8,6.4,0.9,1.2,0.08,'#071820','#3ee6ff',W,H);
    walkBox(bg,2.4,0.8,6.4,0.9,1.2,0.08,'#071820','#3ee6ff',W,H);
  }else if(purpose==='PETS'){
    walkBox(bg,-2.2,0,5.4,0.5,0.35,0.4,'#7dff6b','#fff',W,H);
    walkBox(bg,2.1,0,5.6,0.55,0.7,0.4,'#ffb020','#fff',W,H);
  }else if(purpose==='SHOWROOM'){
    walkBox(bg,0,0.15,5.2,1.1,0.12,1.1,'#102030','#3ee6ff',W,H);
  }else if(purpose==='CAFE'){
    walkBox(bg,0,0,6.2,2.4,0.9,0.4,'#ff9a2e','#fff',W,H);
  }else if(purpose==='NOS'){
    walkBox(bg,-1.6,0,5.4,0.35,1.3,0.35,'#3ee6ff','#fff',W,H);
    walkBox(bg,1.6,0,5.4,0.35,1.3,0.35,'#ff4fd8','#fff',W,H);
  }else{
    walkBox(bg,0,0,5.6,1.2,0.7,0.5,theme.accent,'#fff',W,H);
  }
  };
  const kit=window.WALK_ITEMS&&typeof WALK_ITEMS.isKit==='function'&&WALK_ITEMS.isKit(purpose);
  if(window.WALK_ITEMS&&typeof WALK_ITEMS.present==='function'){
    WALK_ITEMS.present(g,W,H,purpose,function(bg){
      if(!(kit&&WALK_ITEMS.drawKit(bg,W,H,purpose)))drawStatic(bg);
    });
    if(typeof WALK_ITEMS.drawLive==='function')WALK_ITEMS.drawLive(g,W,H,purpose);
  }else if(!(kit&&window.WALK_ITEMS&&WALK_ITEMS.drawKit(g,W,H,purpose))){
    drawStatic(g);
  }
  const room=WALK_MODE.room||{x:0,z:1.2,petX:1.1,petZ:1.6};
  const rz=4.6-room.z*0.55,pz=4.6-(room.petZ==null?room.z+0.4:room.petZ)*0.55;
  const foot=cam(room.x,0.02,rz);
  g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(foot[0],foot[1],28,10,0,0,7);g.fill();
  const crewOn=walkPaintCrew(g,foot,W,H);
  if(!crewOn){walkDrawPerson(g,room.x,rz,W,H);walkDrawPetBody(g,room.petX==null?room.x+0.9:room.petX,pz,W,H);}
  g.shadowBlur=0;g.fillStyle=kit?'#243044':'#e9fff2';g.font='800 16px sans-serif';g.textAlign='left';g.fillText(theme.name,16,H-18);
  if(card)card.dataset.room=purpose;
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
  location.assign(page);
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
  const px=x-fx*0.72+rx*0.48,pz=z-fz*0.72+rz*0.48;
  walkRing(px,gy+0.05,pz,0.28,'#ff4fd8',2);
  line([px,gy+0.05,pz],[px,gy+0.42,pz],'#ff4fd8',2);
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
function walkDrawParkingBays(){
  if(typeof P==='undefined'||!P||typeof line!=='function'||typeof CITY==='undefined'||!CITY||!CITY.BL)return;
  if(WALK_MODE.insideBuilding)return;
  if(P.driveMode!=='street'&&!WALK_MODE.onFoot)return;
  const x=WALK_MODE.onFoot?WALK_MODE.x:P.x,z=WALK_MODE.onFoot?WALK_MODE.z:P.z;
  const t=(performance.now()||0)/1000,y=0.07+0.015*Math.sin(t*3);
  for(const b of CITY.BL){
    const p=b&&b.parking;
    if(!p||p.x0==null||p.x1==null||p.z0==null||p.z1==null)continue;
    const cx=(p.x0+p.x1)/2,cz=(p.z0+p.z1)/2;
    if(Math.hypot(cx-x,cz-z)>55)continue;
    const col=p.type==='lot'?'#ffb020':'#3ee6ff';
    const c=[[p.x0,p.z0],[p.x1,p.z0],[p.x1,p.z1],[p.x0,p.z1]];
    if(typeof ctx!=='undefined'){ctx.save();ctx.shadowColor=col;ctx.shadowBlur=12;}
    for(let i=0;i<4;i++)line([c[i][0],y,c[i][1]],[c[(i+1)%4][0],y,c[(i+1)%4][1]],col,2.6);
    if(p.doorX!=null){
      const nx=p.nx||0,nz=p.nz||0,rx=nz,rz=-nx;
      line([p.doorX-rx*2.3,0.14,p.doorZ-rz*2.3],[p.doorX+rx*2.3,0.14,p.doorZ+rz*2.3],'#7dff6b',3.2);
      line([p.doorX,0.14,p.doorZ],[p.doorX,2.35,p.doorZ],col,2.2);
    }
    if(typeof ctx!=='undefined')ctx.restore();
  }
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
    else location.assign('dance-stage.html');
  });
  const getOut=document.createElement('button');
  getOut.id='walk-get-out';getOut.type='button';getOut.textContent='EXIT CAR';
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
  const roomCss=document.createElement('style');
  roomCss.textContent='#walk-interior.show{display:block !important;background:#05010c !important;padding:0 !important;overflow:hidden !important;z-index:90 !important}#walk-room-cv{position:absolute !important;inset:0 !important;width:100% !important;height:100% !important;max-width:none !important;border:0 !important;border-radius:0 !important;box-shadow:none !important;background:#05010c !important;touch-action:none;z-index:0}#walk-interior h2,#walk-interior p{position:absolute;z-index:2;left:14px;margin:0;text-shadow:0 2px 8px #000}#walk-interior h2{top:56px}#walk-interior p{top:82px;max-width:42%}#walk-room-tools{position:absolute;z-index:2;left:12px;right:12px;bottom:14px;display:flex;flex-wrap:wrap;gap:8px;justify-content:center}#walk-room-tools button{background:#3ee6ff}#walk-open-page,#walk-step-out{position:absolute;z-index:2;bottom:64px}#walk-open-page{right:14px}#walk-step-out{left:14px}';
  document.head.appendChild(roomCss);
  const room=document.createElement('div');
  room.id='walk-interior';room.hidden=true;
  const title=document.createElement('h2');title.dataset.k='title';
  const blurb=document.createElement('p');blurb.dataset.k='act';
  const canvas=document.createElement('canvas');
  canvas.id='walk-room-cv';canvas.width=640;canvas.height=360;
  canvas.addEventListener('pointerdown',e=>{
    if(!WALK_MODE.insideBuilding)return;
    const r=canvas.getBoundingClientRect();
    const px=(e.clientX-r.left)/Math.max(1,r.width)*canvas.width;
    const py=(e.clientY-r.top)/Math.max(1,r.height)*canvas.height;
    const pt=walkUniso(px,py,canvas.width,canvas.height);
    const purpose=(WALK_MODE.insideDoor&&WALK_MODE.insideDoor.purpose)||'';
    let hit=null;
    for(const st of walkStations(purpose))if(!hit||Math.hypot(st.x-pt.x,st.z-pt.z)<Math.hypot(hit.x-pt.x,hit.z-pt.z))hit=st;
    const roomSt=WALK_MODE.room||(WALK_MODE.room={});
    if(hit&&Math.hypot(hit.x-pt.x,hit.z-pt.z)<1.15){roomSt.tx=hit.x;roomSt.tz=hit.z;walkUseStation(hit.id);}
    else{roomSt.tx=pt.x;roomSt.tz=pt.z;}
  });
  const tools=document.createElement('div');tools.id='walk-room-tools';
  const open=document.createElement('button');
  open.id='walk-open-page';open.type='button';open.hidden=true;
  open.addEventListener('click',()=>{
    const purpose=open.dataset.purpose,door=WALK_MODE.insideDoor||WALK_MODE.door;
    if(!walkLaunchStudio(purpose,door))walkToast(walkPageLabel(purpose)||'READY',(door&&door.color)||'#3ee6ff');
  });
  const out=document.createElement('button');
  out.id='walk-step-out';out.type='button';out.textContent='🚪 STEP BACK OUTSIDE';
  out.addEventListener('click',()=>WALK_MODE.stepBackOutside());
  room.append(title,blurb,canvas,tools,open,out);
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
  if(window.DETAIL&&typeof DETAIL.loadInterior==='function')DETAIL.loadInterior(door);
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
  card.dataset.room=door.purpose||'';
  card.hidden=false;card.classList.add('show');
  card.style.background='#05010c';card.style.zIndex='90';card.style.padding='0';
  const cv=document.getElementById('walk-room-cv');
  if(cv){cv.style.position='absolute';cv.style.inset='0';cv.style.width='100%';cv.style.height='100%';}
  if(card.parentElement)card.parentElement.appendChild(card);
  walkRoomReset();
  walkFillTools(door.purpose);
  walkPaintRoom();
}
function walkHideInterior(){
  if(window.DETAIL&&typeof DETAIL.unloadInterior==='function')DETAIL.unloadInterior();
  const cv=typeof document!=='undefined'&&document.getElementById('walk-room-cv');
  if(cv){const g=cv.getContext('2d');if(g)g.clearRect(0,0,cv.width,cv.height);cv.width=2;cv.height=2;}
  const card=typeof document!=='undefined'&&document.getElementById('walk-interior');
  if(!card)return;
  card.hidden=true;card.classList.remove('show');
}
function walkSyncPill(){
  walkEnsurePill();
  const pill=typeof document!=='undefined'&&document.getElementById('walk-door-pill');
  if(!pill)return;
  if(typeof document!=='undefined'&&document.getElementById('enterBldBtn')){
    pill.classList.remove('show','dance','parked');
    pill.hidden=true;pill.style.display='none';
    pill.setAttribute('aria-hidden','true');
    return;
  }
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
  if(walkDyn.bays){
    walkDyn.bays.x=WALK_MODE.onFoot?WALK_MODE.x:(typeof P!=='undefined'?P.x:0);
    walkDyn.bays.z=WALK_MODE.onFoot?WALK_MODE.z:(typeof P!=='undefined'?P.z:0);
    walkDyn.bays.y=0;
  }
  const door=WALK_MODE.onFoot?WALK_MODE.door:null;
  if(door){walkDyn.beacon.x=door.standX;walkDyn.beacon.z=door.standZ;walkDyn.beacon.y=0;}
  else {walkDyn.beacon.x=1e7;walkDyn.beacon.z=1e7;}
  if(typeof P!=='undefined'){walkDyn.glow.x=P.x;walkDyn.glow.y=(P.y||0)+0.08;walkDyn.glow.z=P.z;}
}

function walkAct(door){
  const b=door,purpose=door.purpose;
  if(purpose==='HOME'){
    P.wreck=null;P.hards=0;P.hpDebt=0;P.wallHards=0;P.stall=false;P.nosTank=1;
    if(typeof showWreck==='function')showWreck(false);
    walkGreetPet();
    walkToast('WELCOME HOME, ELLIE! Z TUNED & READY',door.color);
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
function walkFrontDoorAt(x,z,maxDist){
  if(typeof CITY==='undefined'||!CITY||!CITY.BL||!(maxDist>0))return null;
  let best=null;
  for(const b of CITY.BL){
    if(!b||!b.doors)continue;
    const meta=walkMeta(b);
    for(const door of b.doors){
      const dx=door[0]-x,dz=door[1]-z,dist=Math.hypot(dx,dz);
      if(!(dist<=maxDist)||(best&&dist>=best.dist))continue;
      const nx=door[2]||0,nz=door[3]||0;
      if((x-door[0])*nx+(z-door[1])*nz<-2)continue;
      const garage=walkDoorTag(door);
      const reach=garage?WALK_BAY_STAND:1.05;
      best={x:door[0],z:door[1],nx,nz,dist,y:0,buildingId:b.id,standX:door[0]+nx*reach,standZ:door[1]+nz*reach,garage,
        purpose:meta.purpose,purposeLabel:meta.purposeLabel,actionLabel:meta.actionLabel,color:meta.color,
        top:b.top||0,cx:b.cx,cz:b.cz,building:b};
    }
  }
  return best;
}
function walkEntryTarget(){
  if(!WALK_MODE||WALK_MODE.insideBuilding||typeof P==='undefined'||!P)return null;
  const onFoot=!!WALK_MODE.onFoot;
  const x=onFoot?WALK_MODE.x:P.x,z=onFoot?WALK_MODE.z:P.z;
  if(!Number.isFinite(x)||!Number.isFinite(z))return null;
  const carOk=!!(P.ground&&!P.wreck);
  if((onFoot||(carOk&&P.v<10))&&typeof WALK_MODE.activeParking==='function'){
    const garage=WALK_MODE.activeParking(x,z);
    if(garage&&garage.door)return {door:garage.door,garage};
  }
  const max=onFoot?10:(carOk&&P.v<8?12:0);
  const door=walkFrontDoorAt(x,z,max);
  return door?{door,garage:null}:null;
}
function walkShortBld(door){
  const map={HOME:'HOUSE',SHOWROOM:'SHOWROOM',NEON_PAINT:'PAINT',GARAGE:'GARAGE',NOS:'NOS',DANCE:'DANCE',PETS:'PETS',CAFE:'CAFE',ARCADE:'ARCADE',SKY_DROP:'SKY',SOCCER:'STADIUM',BUILDER:'BUILDER'};
  return (door&&map[door.purpose])||'';
}
function walkEnsureEnterBtn(){
  if(typeof document==='undefined')return null;
  const found=document.getElementById('enterBldBtn');
  if(found)return found;
  const css=document.createElement('style');
  css.id='enterBldCss';
  css.textContent='#enterBldBtn{position:fixed;top:5px;right:calc(50% + 66px);z-index:95;height:44px;min-width:98px;padding:3px 12px;display:none;margin:0;border-radius:14px;border:2.5px solid #fff;background:radial-gradient(circle at 40% 32%,#f4fff6,#39ff7a 38%,#ff2bd6 78%);box-shadow:0 0 16px #7dff6b,0 0 12px #ff2bd6;color:#140018;font:900 11px/1.05 Orbitron,sans-serif;letter-spacing:.4px;flex-direction:column;align-items:center;justify-content:center;touch-action:none;user-select:none;cursor:pointer;-webkit-tap-highlight-color:transparent}#enterBldBtn small{font:800 9px/1 Rajdhani,sans-serif;letter-spacing:.6px;margin-top:1px}#enterBldBtn.inside{border-color:#ff4fd8;background:radial-gradient(circle at 40% 32%,#fff5fc,#ff4fd8 40%,#3ee6ff 82%);box-shadow:0 0 16px #ff4fd8,0 0 12px #3ee6ff}';
  document.head.appendChild(css);
  const btn=document.createElement('button');
  btn.id='enterBldBtn';btn.type='button';btn.dataset.houseEnter='1';
  btn.setAttribute('aria-label','ENTER BUILDING');
  const lead=document.createElement('span');lead.dataset.k='lead';lead.textContent='🚪 ENTER';
  const sm=document.createElement('small');sm.textContent='BUILDING';
  btn.append(lead,sm);
  let lock=0;
  const fire=e=>{
    if(e){e.preventDefault();e.stopPropagation();}
    const n=performance.now();if(n-lock<280)return;lock=n;
    if(WALK_MODE.insideBuilding)WALK_MODE.stepBackOutside();
    else WALK_MODE.enterDoor();
  };
  btn.addEventListener('pointerup',fire);
  btn.addEventListener('click',fire);
  (document.body||document.documentElement).appendChild(btn);
  return btn;
}
function walkSyncEnterBtn(){
  const btn=walkEnsureEnterBtn();
  if(!btn||btn.dataset.houseEnter!=='1')return;
  const lead=btn.querySelector('[data-k="lead"]'),sm=btn.querySelector('small');
  if(WALK_MODE.insideBuilding){
    btn.style.display='flex';btn.classList.add('inside');
    if(lead)lead.textContent='🚪 EXIT';
    if(sm)sm.textContent='BUILDING';
    btn.setAttribute('aria-label','EXIT BUILDING');
    return;
  }
  const target=walkEntryTarget();
  if(!target){
    btn.style.display='none';btn.classList.remove('inside');
    btn.setAttribute('aria-hidden','true');
    return;
  }
  btn.style.display='flex';btn.classList.remove('inside');
  btn.setAttribute('aria-hidden','false');
  if(lead)lead.textContent='🚪 ENTER';
  const short=walkShortBld(target.door);
  if(sm)sm.textContent=short?short+' BUILDING':'BUILDING';
  btn.setAttribute('aria-label','ENTER BUILDING');
}
function walkEnterDoor(){
  const self=this&&typeof this.nearestDoor==='function'?this:WALK_MODE;
  if(typeof P==='undefined'||!P||self.insideBuilding)return false;
  const target=walkEntryTarget();
  if(!target||!target.door)return false;
  const door=target.door;
  P.v=0;P.ground=true;P.pitch=0;
  if(P.driveMode!=='street')P.driveMode='street';
  self.onFoot=true;self.y=P.y||0;self._roofY=null;
  self.x=door.standX!=null?door.standX:P.x;
  self.z=door.standZ!=null?door.standZ:P.z;
  const nx=door.nx||0,nz=door.nz||0;
  if(nx||nz)self.yaw=Math.atan2(nx,nz);
  self.door=door;self.parking=null;
  try{walkAct(door);}catch(e){return false;}
  if(WALK_INDOOR[door.purpose]){self.insideBuilding=true;self.insideDoor=door;walkShowInterior(door);}
  else{self.insideBuilding=false;self.insideDoor=null;walkHideInterior();}
  walkSyncPill();walkSyncGait();walkSyncDyn();walkSyncEnterBtn();
  return !!self.insideBuilding;
}
function walkLockEnter(){
  const wm=window.WALK_MODE;
  if(!wm||wm.__walkEnterLocked)return;
  try{
    Object.defineProperty(wm,'enterDoor',{
      configurable:true,enumerable:true,
      get(){return walkEnterDoor;},
      set(){}
    });
    Object.defineProperty(wm,'__walkEnterLocked',{value:1});
  }catch(e){}
}
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
      walkHideInterior();walkSyncPill();walkSyncGait();walkSyncDyn();
      try{if(window.WALK_ITEMS&&WALK_ITEMS.sync)WALK_ITEMS.sync();}catch(e){}
      return false;
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
    if(window.NEON_PAINT&&typeof window.NEON_PAINT.closeStudio==='function'){try{window.NEON_PAINT.closeStudio();}catch(e){}}
    if(window.GARAGE_HOME_HUB&&typeof window.GARAGE_HOME_HUB.close==='function'){try{window.GARAGE_HOME_HUB.close();}catch(e){}}
    if(door&&door.standX!=null&&door.standZ!=null){
      this.onFoot=true;this.x=door.standX;this.z=door.standZ;this.y=door.y||0;this._roofY=null;
      const nx=door.nx||0,nz=door.nz||0;
      if(nx||nz)this.yaw=Math.atan2(nx,nz);
      if(door.buildingId!=null)this._autoBld=door.buildingId;
      if(typeof P!=='undefined'&&P){P.ground=true;P.v=0;P.pitch=0;}
    }
    this.door=this.onFoot?this.nearestDoor(18):null;
    walkSyncPill();walkSyncGait();walkSyncDyn();walkSyncEnterBtn();
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
  canEnterBuilding(){return walkEntryTarget();},
  enterDoor(){return walkEnterDoor.call(this);},
  update(dt){
    const d=Math.max(0,Math.min(0.05,+dt||0));
    try{this._update(d);}finally{walkSyncEnterBtn();try{if(window.WALK_ITEMS&&WALK_ITEMS.sync)WALK_ITEMS.sync();}catch(e){}}
  },
  _update(d){
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
      walkSyncPill();walkSyncGait();walkSyncDyn();
      try{if(window.WALK_ITEMS&&WALK_ITEMS.sync)WALK_ITEMS.sync();}catch(e){}
      return;
    }
    if(this.insideBuilding){
      this.vx=0;this.vz=0;this.speed=0;this.dancing=false;this.gait='walk';
      walkRoomStep(this,d);
      walkPaintRoom();
      walkSyncPill();walkSyncGait();walkSyncDyn();return;
    }
    walkIntegrate(this,d);
    this.door=this.nearestDoor(18);
    walkSyncPill();walkSyncGait();walkSyncDyn();
  }
};

walkEnsurePill();
walkEnsureEnterBtn();
walkLockEnter();
setTimeout(walkLockEnter,0);
setInterval(walkLockEnter,400);
addEventListener('keydown',e=>{
  if(e.code==='ShiftLeft'||e.code==='ShiftRight'){WALK_MODE._shift=true;walkSyncGait();return;}
  if(e.repeat||e.code!=='KeyE'||WALK_MODE.insideBuilding)return;
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
  walkDyn.bays={x:0,y:0,z:0,rad:40,draw:walkDrawParkingBays};
  CITY.DYN.push(walkDyn.walker,walkDyn.beacon,walkDyn.glow,walkDyn.bays);
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
