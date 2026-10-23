'use strict';
// ===== WORLD (procedural) =====
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const towers=[],rings=[];
for(let i=0;i<70;i++){const a=rnd()*Math.PI*2,r=150+rnd()*1600;towers.push({x:Math.cos(a)*r,z:Math.sin(a)*r,w:10+rnd()*20,h:40+rnd()*200,c:rnd()<.5?'#ff2a3d':(rnd()<.5?'#3ee6ff':'#ffb020')});}
for(let i=0;i<30;i++){const a=rnd()*Math.PI*2,r=100+rnd()*1200;rings.push({x:Math.cos(a)*r,z:Math.sin(a)*r,y:40+rnd()*160,r:14,yaw:rnd()*Math.PI});}

// ===== CITY (NEONWORLD2): smaller, lower neon city. Solid boxes (walls = HARD HIT / SKIM, roofs = ground), long low roofs + pads, doors, ramps everywhere,
// river (sinks + slows), continuous bank lips, race track, loop, half-pipe, hoops, signs, far outlines =====
const CITY=(()=>{let sd=90210;const cr=()=>(sd=(sd*16807)%2147483647)/2147483647;
  const BL=[],BX=[],RAMPS=[],PADS=[],TREES=[],LOTS=[],HOOPS=[],LOOPS=[],PIPES=[],TOWS=[],NEON=['#ff2a3d','#3ee6ff','#ffb020','#ff4fd8','#3ee6ff','#ff2a3d','#7dff6b'],WINC=['#ffd27a','#9ff3ff','#ffb3e6','#fff2c0'];
  const XS0=-560,XS1=560,ZS0=-300,ZS1=2100,RIV={z0:1780,z1:1840,lip:0.8,land:6,wet:3,sink:0.6,step:0.8},HW={x:-450,hw:15},TUN={z0:500,z1:700,x0:-530,x1:-370,bx0:-465,bx1:-435,ceil:10,top:34},
    PARK={x0:-340,x1:-160,z0:1010,z1:1190},STAD={x:1100,z:400,r:95},TAXI={x0:38,x1:62,z0:-20,z1:1450},DT={x:420,z:1250},TRACK={cx:1000,cz:1100,L:360,R:80,w:22},
    BRIDGES=[[-14,14],[HW.x-HW.hw,HW.x+HW.hw]],GF=4.5,FLOOR=3.5,SIGNW=['Z-DASH','NEON','DANCE','DRIFT','NOS','ARCADE','PIZZA','JUMP','PIXEL','CAFE','PETS','GARAGE','TURBO','BEATS'];
  // ---- WORLD AS DATA (builder-mode ready): OBJS = placed objects {id,type,x,z,rot,w,d,h,p}; each type has a builder that makes render items + registers its colliders.
  const OBJS=[],HND=new Map();let NID=1,cur=null;
  const box=(b,o)=>{const q=Object.assign({y0:0},o,{b,oid:cur.id});b.boxes.push(q);BX.push(q);cur.boxes.push(q);return q;};
  const bldg=(o)=>{const b=Object.assign({boxes:[],deco:[],id:BL.length,oid:cur.id},o);BL.push(b);cur.bl.push(b);return b;};
  const ext=(o)=>{const r=((o.rot||0)%180+180)%180===90,w=r?o.d:o.w,d=r?o.w:o.d;return[o.x-w/2,o.x+w/2,o.z-d/2,o.z+d/2];};
  // door-ready ground floor: door slots (1.4 x 2.4 m) every ~16 m along each street face of the ground box, stored as data for walking later
  function doorsOf(q){const D=[];for(const[ax,fix,n]of[['x',q.z0,[0,-1]],['x',q.z1,[0,1]],['z',q.x0,[-1,0]],['z',q.x1,[1,0]]]){const a0=ax==='x'?q.x0:q.z0,a1=ax==='x'?q.x1:q.z1,L=a1-a0,k=Math.max(1,Math.floor((L-8)/16));
      for(let i=0;i<k;i++){const a=a0+(L/(k))*(i+.5);D.push(ax==='x'?[a,fix,n[0],n[1]]:[fix,a,n[0],n[1]]);}}return D;}
  const TYPES={
   building(o){const[x0,x1,z0,z1]=ext(o),p=o.p||{},h=o.h,b=bldg({x0,x1,z0,z1,cx:o.x,cz:o.z,c:p.c,wc:p.wc,dash:p.dash||[2,1.6],wseed:p.wseed||0,kind:p.kind||'b',slab:p.y0>0?1:0,top:h,rad:Math.hypot(x1-x0,z1-z0)/2});
     if(p.y0>0){box(b,{x0,x1,z0,z1,y0:p.y0,y1:h});return;}
     const T=p.tiers||[1];let y=0,ax0=x0,ax1=x1,az0=z0,az1=z1;for(let i=0;i<T.length;i++){const top=i===T.length-1?h:h*T[i];box(b,{x0:ax0,x1:ax1,z0:az0,z1:az1,y0:y,y1:top});y=top;const ix=(ax1-ax0)*(p.inset||.14),iz=(az1-az0)*(p.inset||.14);ax0+=ix;ax1-=ix;az0+=iz;az1-=iz;}
     const t=b.boxes[b.boxes.length-1],rx=(t.x0+t.x1)/2,rz=(t.z0+t.z1)/2,rw=Math.min(t.x1-t.x0,t.z1-t.z0);
     if(b.kind==='b'||b.kind==='landmark'){b.doors=doorsOf(b.boxes[0]);b.gf=GF;}
     if(p.sign)b.deco.push(['sign',p.sign]);
     if(p.roof==='ant')b.deco.push(['ant',rx+rw*.2,rz,h,p.antH||16]);else if(p.roof==='tank')b.deco.push(['tank',t.x0+rw*.25,t.z0+rw*.25,h]);
     if(p.cable)b.deco.push(['cable',o.x,o.z,h,p.cable]);b.roofBox=t;if(p.pad)TYPES.helipad({id:o.id,x:rx,z:rz,h});},
   helipad(o){const b=BL.slice().reverse().find(q=>q.roofBox&&o.x>=q.roofBox.x0&&o.x<=q.roofBox.x1&&o.z>=q.roofBox.z0&&o.z<=q.roofBox.z1&&Math.abs(q.top-o.h)<.5);if(!b)return;const t=b.roofBox;
     const pd={x:o.x,z:o.z,y:o.h,r:Math.min(t.x1-t.x0,t.z1-t.z0)*.32,b:b.id,oid:o.id,hit:0,x0:t.x0,x1:t.x1,z0:t.z0,z1:t.z1};PADS.push(pd);cur.pads.push(pd);b.deco.push(['pad',pd]);cur.host=b;},
   // ramp: prof 'kick' (rises to a lip, then a drop) or 'crest' (road hump: long up, short steep down); yb = base height (sloped-roof kickers sit on a roof)
   ramp(o){const[x0,x1,z0,z1]=ext(o),p=o.p||{},yb=p.yb||0,q={x0,x1,z0,z1,yb,y1:yb+o.h,h:o.h,ramp:1,dir:Math.round(((o.rot||0)%360+360)%360/90)%4,nm:p.nm,oid:o.id,prof:p.prof||'kick',sz:p.sz||(o.h>=6?'big':o.h>=3?'medium':'small'),hid:p.hid?1:0,spot:p.spot||null};RAMPS.push(q);cur.ramps.push(q);
     if(p.hoop){const u=[[0,1],[1,0],[0,-1],[-1,0]][q.dir],cx=(x0+x1)/2,cz=(z0+z1)/2,L=(q.dir%2?x1-x0:z1-z0)/2,k=L+12+o.h*3;HOOPS.push({x:cx+u[0]*k,z:cz+u[1]*k,y:q.y1+3+o.h*.6,r:5.5,nx:u[0],nz:u[1],hit:0,oid:o.id});}},
       // tow truck jump (Bob: "add tow truck jump"): rear = tilted flatbed (a plain kick ramp rising toward the cab), front = low cab (solid box, below the lip so she flies over it)
    tow(o){zdTowType(o, TYPES, bldg, box, TOWS);},
lamp(o){const b=bldg({x0:o.x-1.5,x1:o.x+1.5,z0:o.z-1.5,z1:o.z+1.5,cx:o.x,cz:o.z,c:(o.p||{}).c||'#fff2c0',wc:'#fff2c0',dash:[1,9],wseed:0,kind:'pylon',top:o.h,rad:3});box(b,{x0:b.x0,x1:b.x1,z0:b.z0,z1:b.z1,y1:o.h});b.deco.push(['lamp',o.x,o.z,o.h]);},
   // billboard: pole + board slab (drive under it, land on top, hit its edge like any wall); sign drawn on both faces
   billboard(o){const p=o.p||{},r=((o.rot||0)%180+180)%180===90,w=o.w,y0=p.y0||10,th=1;const pb=bldg({x0:o.x-.6,x1:o.x+.6,z0:o.z-.6,z1:o.z+.6,cx:o.x,cz:o.z,c:'#8a7a9d',wc:'#8a7a9d',dash:[1,9],wseed:0,kind:'pylon',top:y0,rad:2});box(pb,{x0:pb.x0,x1:pb.x1,z0:pb.z0,z1:pb.z1,y1:y0});
     const bx0=r?o.x-th/2:o.x-w/2,bx1=r?o.x+th/2:o.x+w/2,bz0=r?o.z-w/2:o.z-th/2,bz1=r?o.z+w/2:o.z+th/2,b=bldg({x0:bx0,x1:bx1,z0:bz0,z1:bz1,cx:o.x,cz:o.z,c:p.c,wc:p.c,dash:[1,9],wseed:0,kind:'bill',slab:1,top:o.h,rad:w/2+1});
     box(b,{x0:bx0,x1:bx1,z0:bz0,z1:bz1,y0,y1:o.h});for(const s of[-1,1])b.deco.push(['sign',{x:o.x+(r?s*(th/2+.15):0),z:o.z+(r?0:s*(th/2+.15)),y:(y0+o.h)/2,nx:r?s:0,nz:r?0:s,w:w-1.5,h:o.h-y0-1.2,t:p.t,c:p.c}]);},
   tunnel(o){const[x0,x1,z0,z1]=ext(o),p=o.p,h=o.h,bw=p.bore/2,o2={kind:'hill',c:'#7dff6b',wc:'#7dff6b',dash:[1,9],wseed:1},cz=(z0+z1)/2;
     const L=bldg(Object.assign({x0,x1:o.x-bw,z0,z1,cx:(x0+o.x-bw)/2,cz,rad:110,top:h},o2));box(L,{x0,x1:o.x-bw,z0,z1,y1:h});
     const R=bldg(Object.assign({x0:o.x+bw,x1,z0,z1,cx:(o.x+bw+x1)/2,cz,rad:110,top:h},o2));box(R,{x0:o.x+bw,x1,z0,z1,y1:h});
     const S=bldg(Object.assign({x0:o.x-bw,x1:o.x+bw,z0,z1,cx:o.x,cz,rad:105,top:h,slab:1},o2));box(S,{x0:o.x-bw,x1:o.x+bw,z0,z1,y0:p.ceil,y1:h});},
   bridge(o){const p=o.p;for(const sx of[-1,1]){const b=bldg({x0:o.x+sx*p.py-1.5,x1:o.x+sx*p.py+1.5,z0:o.z-1.5,z1:o.z+1.5,cx:o.x+sx*p.py,cz:o.z,c:'#ffb020',wc:'#ffb020',dash:[1,9],wseed:0,kind:'pylon',top:o.h,rad:3});box(b,{x0:b.x0,x1:b.x1,z0:b.z0,z1:b.z1,y1:o.h});b.deco.push(['cable',o.x+sx*p.py,o.z,o.h,sx]);}},
   // far areas: outline-only skyline blocks (solid, but always drawn as simple neon outlines)
   outline(o){const[x0,x1,z0,z1]=ext(o),b=bldg({x0,x1,z0,z1,cx:o.x,cz:o.z,c:(o.p||{}).c||'#3ee6ff',wc:'#3ee6ff',dash:[1,9],wseed:0,kind:'outline',top:o.h,rad:Math.hypot(x1-x0,z1-z0)/2});box(b,{x0,x1,z0,z1,y1:o.h});},
   // loop-de-loop: entry line at (x,z) heading rot; R radius, w lane width, off = sideways shift of the exit lane. No colliders: the ride is a path (see cityMove)
   loop(o){const a=(o.rot||0)*D,L={x:o.x,z:o.z,ux:Math.sin(a),uz:Math.cos(a),R:o.h,w:o.w,off:(o.p||{}).off||9,oid:o.id,n:0};LOOPS.push(L);cur.loops.push(L);},
   // half-pipe along z: flat floor F, quarter curves C up to H, deck, back slope; floor-only surface (see gnd)
   halfpipe(o){const p=o.p||{},Pp={cx:o.x,z0:o.z-o.d/2,z1:o.z+o.d/2,H:o.h,F:p.F||16,C:p.C||7,deck:p.deck||3,back:p.back||14,oid:o.id};Pp.hw=Pp.F/2+Pp.C+Pp.deck+Pp.back;Pp.x0=Pp.cx-Pp.hw;Pp.x1=Pp.cx+Pp.hw;PIPES.push(Pp);cur.pipes.push(Pp);}};
  function build(o){cur={id:o.id,boxes:[],bl:[],ramps:[],pads:[],loops:[],pipes:[]};HND.set(o.id,cur);TYPES[o.type](o);const h=cur;cur=null;return h;}
  // PREFABS: named, self-contained pieces (default size/params, snap footprint). The city is built only by placing these, so builder mode can drop any of them.
  const PREFABS={
    tower_tall:{label:'Tall Tower',type:'building',w:44,d:44,h:120,snap:10,p:{tiers:[.6,1],inset:.14,roof:'ant',antH:24,c:'#3ee6ff',wc:'#9ff3ff',dash:[2,1.6],wseed:11}},
    tower_landmark:{label:'Sky Tower',type:'building',w:70,d:70,h:239,snap:10,p:{tiers:[.58,.84,1],inset:.15,pad:1,c:'#3ee6ff',wc:'#fff2c0',dash:[2,1.6],wseed:7,kind:'landmark'}},
    office_mid:{label:'Long Office',type:'building',w:72,d:172,h:40,snap:10,p:{tiers:[1],roof:'tank',c:'#ff2a3d',wc:'#ffd27a',dash:[4.5,2.5],wseed:5}},
    shop_low:{label:'Long Shops',type:'building',w:72,d:80,h:12,snap:5,p:{tiers:[1],c:'#ffb020',wc:'#ffb3e6',dash:[4.5,2.5],wseed:3}},
    helipad_roof:{label:'Rooftop Pad Block',type:'building',w:72,d:172,h:26,snap:10,p:{tiers:[1],pad:1,c:'#7dff6b',wc:'#ffd27a',dash:[2,1.6],wseed:9}},
    stadium_stand:{label:'Stadium Stand',type:'building',w:34,d:20,h:26,snap:5,p:{tiers:[1],kind:'stand',c:'#ff4fd8',wc:'#fff2c0',dash:[1,2.5],wseed:4}},
    ramp_small:{label:'Small Ramp (base)',type:'ramp',w:14,d:40,h:4,snap:5,p:{}},
    ramp_big:{label:'Big Ramp (base)',type:'ramp',w:16,d:60,h:7.5,snap:5,p:{}},
    ramp_kick:{label:'Kicker',type:'ramp',w:8,d:10,h:1.6,snap:1,p:{sz:'small'}},
    ramp_med:{label:'Medium Ramp',type:'ramp',w:12,d:24,h:3.5,snap:2,p:{sz:'medium'}},
    ramp_launch:{label:'Big Launch',type:'ramp',w:16,d:60,h:7.5,snap:5,p:{sz:'big'}},
    ramp_curb:{label:'Curb Kicker',type:'ramp',w:10,d:5,h:0.8,snap:1,p:{sz:'small',hid:1}},
    ramp_bank:{label:'Embankment',type:'ramp',w:20,d:30,h:4,snap:5,p:{sz:'medium',hid:1}},
    road_crest:{label:'Road Crest',type:'ramp',w:20,d:19,h:1.8,snap:1,p:{sz:'small',hid:1,prof:'crest'}},
    roof_slope:{label:'Sloped Roof Kicker',type:'ramp',w:10,d:20,h:2.5,snap:1,p:{sz:'medium',hid:1}},
    billboard:{label:'Billboard',type:'billboard',w:16,d:1,h:17,snap:1,p:{y0:10,c:'#ff4fd8',t:'Z-DASH'}},
    loop:{label:'Loop-de-loop',type:'loop',w:8,d:30,h:12,snap:5,p:{off:9}},
    halfpipe:{label:'Half-pipe',type:'halfpipe',w:64,d:120,h:5,snap:5,p:{F:16,C:7,deck:3,back:14}},
    far_outline:{label:'Far Skyline Block',type:'outline',w:60,d:60,h:60,snap:10,p:{}},
    tunnel_seg:{label:'Tunnel Hill',type:'tunnel',w:160,d:200,h:34,snap:10,p:{bore:30,ceil:10}},
    bridge_seg:{label:'Bridge Towers',type:'bridge',w:36,d:60,h:62,snap:10,p:{py:18}},
    tow_truck:ZD_TOW_PREFAB,
     lamp:{label:'Light Tower',type:'lamp',w:3,d:3,h:55,snap:5,p:{}}};
  function placePrefab(name,x,z,ov){const f=PREFABS[name];ov=ov||{};const o={id:ov.id||NID++,prefab:name,type:f.type,x,z,rot:ov.rot||0,w:ov.w!=null?ov.w:f.w,d:ov.d!=null?ov.d:f.d,h:ov.h!=null?ov.h:f.h,p:Object.assign({},f.p,ov.p||{})};if(o.id>=NID)NID=o.id+1;OBJS.push(o);build(o);return o;}
  const ringHit=(x0,x1,z0,z1,h)=>{let lim=h;for(const r of rings){const dx=Math.max(x0-r.x,0,r.x-x1),dz=Math.max(z0-r.z,0,r.z-z1);if(Math.hypot(dx,dz)<r.r+12&&h>r.y-r.r-15)lim=Math.min(lim,r.y-r.r-20);}return lim;};
  // a street-facing neon sign on the ground-floor band or just above it
  function signFor(x0,x1,z0,z1,h){const f=Math.floor(cr()*4),c=NEON[Math.floor(cr()*NEON.length)],t=SIGNW[Math.floor(cr()*SIGNW.length)],y=Math.min(h-2.5,GF+2.6+cr()*4),sh=3;
    if(f<2){const L=x1-x0,w=Math.min(18,L*.45),s=f?1:-1;return{x:(x0+x1)/2+(cr()-.5)*(L-w)*.6,z:s>0?z1+.25:z0-.25,y,nx:0,nz:s,w,h:sh,t,c};}
    const L=z1-z0,w=Math.min(18,L*.45),s=f===3?1:-1;return{x:s>0?x1+.25:x0-.25,z:(z0+z1)/2+(cr()-.5)*(L-w)*.6,y,nx:s,nz:0,w,h:sh,t,c};}
  // procedural generator: rolls the random look, then places a building (+ helipad) object
  function tower(x0,x1,z0,z1,h,f){f=f||{};const n=f.tiers||(h>60?2:1),T=[];let y=0;for(let i=0;i<n-1;i++){y=i===0?(f.t1||(.55+cr()*.15)):y+(1-y)*.6;T.push(y);}T.push(1);
    const p={c:f.c||NEON[Math.floor(cr()*NEON.length)],wc:WINC[Math.floor(cr()*4)],dash:cr()<.5?[2,1.6]:[4.5,2.5],wseed:Math.floor(cr()*997),kind:f.kind||'b',tiers:T,inset:.1+cr()*.06};
    if(!f.pad&&!f.noRoof&&!['hill','stand','pylon'].includes(f.kind)){const r=cr();if(h>50&&r<.45){p.roof='ant';p.antH=10+cr()*16;}else if(r<.6)p.roof='tank';}
    if(f.kind==null&&h>=10&&cr()<.5)p.sign=signFor(x0,x1,z0,z1,h);
    if(f.pad)p.pad=1;const pf=f.prefab||(f.kind==='stand'?'stadium_stand':f.pad?'helipad_roof':h>80?'tower_tall':h>20?'office_mid':'shop_low');
    return placePrefab(pf,(x0+x1)/2,(z0+z1)/2,{w:x1-x0,d:z1-z0,h,p});}
  // stunt spot: a plaza lot with a big launch + hoop, a medium, kickers, curb kickers at the street edges
  function stuntSpot(x0,x1,z0,z1,i){const cx=(x0+x1)/2,L=z1-z0,sp='spot'+i,fl=i%2;LOTS[LOTS.length-1].stunt=1;
    if(L>=150){placePrefab('ramp_launch',cx,fl?z1-42:z0+42,{rot:fl?180:0,p:{hoop:1,spot:sp}});placePrefab('ramp_med',x0+16,fl?z0+20:z1-20,{rot:fl?0:180,p:{hoop:1,spot:sp}});
      placePrefab('ramp_kick',x1-12,(z0+z1)/2,{rot:fl?180:0,p:{spot:sp}});placePrefab('ramp_kick',x1-12,(z0+z1)/2+(fl?-30:30),{rot:fl?180:0,p:{spot:sp,hid:1}});}
    else{placePrefab('ramp_med',cx,(z0+z1)/2,{rot:fl?180:0,p:{hoop:1,spot:sp}});placePrefab('ramp_kick',x1-12,(z0+z1)/2,{rot:fl?0:180,p:{spot:sp}});}
    placePrefab('ramp_curb',x0+3.5,(z0+z1)/2+12,{rot:90,p:{spot:sp}});placePrefab('ramp_curb',x1-3.5,(z0+z1)/2-12,{rot:270,p:{spot:sp}});}
  // --- lots: streets every 100 m in x, every 200 m in z (long blocks), 20 m wide; the runway corridor |x|<150 stays open ---
  const xl=[];for(let x=160;x+80<=XS1;x+=100){xl.push(x);xl.push(-x-80);}
  const FORCE={'160,110':[26,1],'-240,510':[62,1],'160,910':[18,1],'-340,1510':[34,1],'460,1110':[239,2]};let nSpot=0;
  const MERGED=new Set(),okLot=(x0,x1,z0,z1)=>!(x1>HW.x-HW.hw-3&&x0<HW.x+HW.hw+3)&&!(z1>RIV.z0-8&&z0<RIV.z1+8)&&!(x1>TUN.x0-5&&x0<TUN.x1+5&&z1>TUN.z0-5&&z0<TUN.z1+5)&&!(x1>PARK.x0&&x0<PARK.x1&&z1>PARK.z0&&z0<PARK.z1)&&x0>=XS0&&x1<=XS1;
  for(const lx of xl)for(let lz=ZS0+10;lz+180<=ZS1;lz+=200){if(MERGED.has(lx+','+lz))continue;let x0=lx,x1=lx+80,z0=lz,z1=lz+180;
    if(x1>HW.x-HW.hw-3&&x0<HW.x+HW.hw+3){if(x0<HW.x)x1=Math.min(x1,HW.x-HW.hw-3);else x0=Math.max(x0,HW.x+HW.hw+3);}
    if(z1>RIV.z0-8&&z0<RIV.z1+8){if(z0<RIV.z0)z1=Math.min(z1,RIV.z0-8);else z0=Math.max(z0,RIV.z1+8);}
    if(x1-x0<30||z1-z0<30)continue;
    if(x1>TUN.x0-5&&x0<TUN.x1+5&&z1>TUN.z0-5&&z0<TUN.z1+5)continue;
    const inPark=x1>PARK.x0&&x0<PARK.x1&&z1>PARK.z0&&z0<PARK.z1;LOTS.push({x0,x1,z0,z1,park:inPark});if(inPark)continue;
    const F=FORCE[lx+','+lz],m=4;
    if(F){if(F[1]===2){const cz=(z0+z1)/2;placePrefab('tower_landmark',(x0+x1)/2,cz,{w:x1-x0-10,d:70});tower(x0+5,x1-5,z0+m,cz-45,44,{});tower(x0+5,x1-5,cz+45,z1-m,16,{});}
      else tower(x0+m,x1-m,z0+m,z1-m,F[0],{pad:1,c:'#7dff6b',tiers:1});continue;}
    const dd=Math.hypot((x0+x1)/2-DT.x,(z0+z1)/2-DT.z),hM=10+62*Math.exp(-((dd/480)**2)),p=cr();
    if(p<.13&&x1-x0>=60){LOTS[LOTS.length-1].plaza=1;stuntSpot(x0,x1,z0,z1,nSpot++);continue;}
    const padBlk=z1-z0>=150&&cr()<.22;
    // ROOFTOP: a pad block takes the neighbouring lot too (one long, wide, low deck across the side street) so landings have room to stop
    if(padBlk){const nx=lx>0?lx+100:lx-100,k=nx+','+lz;const gx0=lx>0?lx+80:nx+80,gx1=gx0+20,CR=[[400,300],[-300,900],[350,1400],[-250,300],[450,-200]];if(!FORCE[k]&&okLot(nx,nx+80,z0,z1)&&!CR.some(([cx,cz])=>cx>gx0-12&&cx<gx1+12&&cz>z0-20&&cz<z1+20)){MERGED.add(k);const L=LOTS[LOTS.length-1];if(lx>0)x1=nx+80;else x0=nx;L.x0=x0;L.x1=x1;tower(x0+m,x1-m,z0+m,z1-m,Math.round(8+cr()*8),{pad:1,tiers:1});continue;}}
    const fp=[],alleys=[],q2=cr(),nb=padBlk?1:z1-z0<120?(q2<.5?1:2):q2<.15?1:q2<.4?2:q2<.7?3:4;
    {const cuts=[];for(let i=1;i<nb;i++)cuts.push(z0+(z1-z0)*(i/nb+(cr()-.5)*.12/nb));let za=z0+m;for(const c of cuts){fp.push([x0+m,x1-m,za,c-6]);alleys.push(c);za=c+6;}fp.push([x0+m,x1-m,za,z1-m]);}
    for(const[a,b,c,d]of fp){let h=Math.min(90,8+cr()*hM);h=Math.max(8,ringHit(a,b,c,d,h));if(padBlk)h=Math.min(h,10+cr()*18);const L=d-c,pad=padBlk;
      tower(a,b,c,d,Math.round(h),pad?{pad:1,tiers:1}:{});
      if(!pad&&h<=16&&L>=44&&cr()<.3)placePrefab('roof_slope',(a+b)/2,(c+d)/2,{rot:cr()<.5?0:180,p:{yb:Math.round(h)}});}
    for(const al of alleys)if(cr()<.3)placePrefab('ramp_kick',(x0+x1)/2,al,{rot:cr()<.5?90:270,p:{hid:cr()<.5?1:0}});}
  placePrefab('tunnel_seg',(TUN.x0+TUN.x1)/2,(TUN.z0+TUN.z1)/2,{w:TUN.x1-TUN.x0,d:TUN.z1-TUN.z0,h:TUN.top,p:{bore:TUN.bx1-TUN.bx0,ceil:TUN.ceil}});
  placePrefab('bridge_seg',0,1810);
  {const n=16;for(let i=0;i<n;i++){const a=i/n*Math.PI*2,x=STAD.x+Math.cos(a)*STAD.r,z=STAD.z+Math.sin(a)*STAD.r*.8,s=17;tower(x-s,x+s,z-s*.6,z+s*.6,24+(i%2)*4,{kind:'stand',c:'#ff4fd8'});}
   for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])placePrefab('lamp',STAD.x+a*125,STAD.z+b*95);}
  // base ramps (unchanged): taxiway, street, highway
  for(const[pf,x,z,w,h,nm]of[['ramp_big',50,790,16,7.5,'taxiway'],['ramp_small',250,350,14,4,'street'],['ramp_big',-450,1630,24,6,'highway']])placePrefab(pf,x,z,{w,h,p:{nm,sz:pf==='ramp_big'?'big':'medium'}});
  // runway-corridor ramps (open land beside the runway, never on the runway / taxiway / x 66-100 off-road lane)
  for(const[pf,x,z,rot,hid,hoop]of[['ramp_med',120,150,0,0,1],['ramp_kick',120,420,0,0,0],['ramp_launch',120,640,0,0,1],['ramp_med',120,1000,180,0,1],['ramp_kick',120,1250,0,1,0],['ramp_kick',125,1390,180,0,0],
     ['ramp_med',-40,520,0,0,1],['ramp_launch',-110,700,0,0,1],['ramp_kick',-40,900,0,1,0],['ramp_med',-110,1100,180,0,1],['ramp_kick',-40,1250,0,0,0],['ramp_kick',-125,1600,180,0,0],['ramp_kick',-40,60,180,1,0]])
    placePrefab(pf,x,z,{rot,p:{hid,hoop}});
  // river jumps: south bank rise +z to the lip, north bank rise -z; big ones clear the river, small ones land in the water
  for(const[pf,x,rot]of[['ramp_launch',120,0],['ramp_med',-100,0],['ramp_kick',-40,0],['ramp_med',100,180],['ramp_launch',-120,180],['ramp_kick',60,180],['ramp_med',250,0],['ramp_kick',-250,0],['ramp_med',300,180],['ramp_med',-250,180]]){
    const d=PREFABS[pf].d,z=rot?RIV.z1+RIV.land+2+d/2:RIV.z0-RIV.land-2-d/2;placePrefab(pf,x,z,{rot,p:{nm:'river',hoop:pf!=='ramp_kick'?1:0}});}
  // embankments (hidden) on the grass just outside the city edges; road crests (hidden) on a few streets
  for(const[x,z,rot]of[[300,-345,180],[-300,-345,180],[600,420,90],[600,1500,90],[-600,960,270],[300,2150,0],[-260,2150,0],[-600,1500,270]])placePrefab('ramp_bank',x,z,{rot});
  for(const[x,z,rot]of[[400,300,90],[-300,900,270],[350,1400,0],[-250,300,180],[450,-200,0]])placePrefab('road_crest',x,z,{rot,p:{nm:'crest'}});
  // stunts: half-pipe and loop beside the runway
  zdTowPlace(placePrefab);
  placePrefab('halfpipe',-95,260,{});placePrefab('loop',-80,1440,{rot:0});
  // billboards along the highway shoulders and the runway corridor
  {let i=0;for(const z of[-150,150,330,900,1150,1450,2000]){const s=i%2?1:-1;placePrefab('billboard',HW.x+s*(HW.hw+6),z,{rot:90,p:{t:SIGNW[i%SIGNW.length],c:NEON[i%NEON.length]}});i++;}
   for(const[x,z,t,c]of[[-70,1000,'NEON WORLD','#3ee6ff'],[90,1720,'JUMP!','#ffb020'],[-60,1700,'RIVER','#7dff6b'],[110,-80,'Z-DASH','#ff4fd8']])placePrefab('billboard',x,z,{w:22,p:{t,c}});}
  // far areas: outline-only skyline blocks around the edges
  for(let i=0;i<34;i++){const a=i/34*Math.PI*2+.07,rx=1000+cr()*300,rz=1500+cr()*350,x=Math.cos(a)*rx,z=900+Math.sin(a)*rz;if(Math.abs(x)<60)continue;const w=40+cr()*60,d=40+cr()*60,h=Math.max(20,ringHit(x-w/2,x+w/2,z-d/2,z+d/2,30+cr()*90));if(h<20)continue;
    if(Math.abs(x-HW.x)<90||Math.hypot(x-TRACK.cx,(z-TRACK.cz)*.6)<300||Math.hypot(x-STAD.x,z-STAD.z)<220)continue;placePrefab('far_outline',x,z,{w,d,h:Math.round(h),p:{c:NEON[i%NEON.length]}});}
  for(let i=0;i<70;i++){const x=PARK.x0+6+cr()*(PARK.x1-PARK.x0-12),z=PARK.z0+6+cr()*(PARK.z1-PARK.z0-12);if(Math.abs(((x+1e4)%100)-50)>38||Math.abs(((z+1e4)%100))<14||Math.abs(((z+1e4)%100))>86)continue;TREES.push([x,z,5+cr()*4]);}
  // --- floor-only surfaces: river profile (bank lips + sunk water) and half-pipes. st = stick to the surface (no edge launches inside a pipe) ---
  const bridgeK=(x)=>{let k=1;for(const[a,b]of BRIDGES){if(x>=a&&x<=b)return-1;k=Math.min(k,Math.max(0,(x<a?a-x:x-b))/12);}return Math.min(1,k);};
  function riverY(x,z){if(z<RIV.z0-RIV.land||z>RIV.z1+RIV.land)return 0;const k=bridgeK(x);if(k<0)return 0;const H=RIV.lip*k,S=-RIV.sink;
    if(z<RIV.z0)return H*(z-(RIV.z0-RIV.land))/RIV.land;if(z<RIV.z0+RIV.wet)return Math.min(H-RIV.step*k,0)+(S-Math.min(H-RIV.step*k,0))*(z-RIV.z0)/RIV.wet;
    if(z>RIV.z1)return H*((RIV.z1+RIV.land)-z)/RIV.land;if(z>RIV.z1-RIV.wet)return Math.min(H-RIV.step*k,0)+(S-Math.min(H-RIV.step*k,0))*(RIV.z1-z)/RIV.wet;return S;}
  function pipeY(Pp,x){const a=Math.abs(x-Pp.cx),f=Pp.F/2,c=f+Pp.C,dk=c+Pp.deck;if(a<=f)return 0;if(a<=c){const u=Math.min(1,(a-f)/Pp.C);return Pp.H*(1-Math.sqrt(Math.max(0,1-u*u)));}if(a<=dk)return Pp.H;return Math.max(0,Pp.H*(1-(a-dk)/Pp.back));}
  function gnd(x,z){for(const Pp of PIPES)if(x>Pp.x0&&x<Pp.x1&&z>=Pp.z0&&z<=Pp.z1)return[pipeY(Pp,x),1];return[riverY(x,z),0];}
  // --- spatial hash (50 m cells), rebuilt on add/remove ---
  const CS=50,HM=new Map(),key=(i,j)=>i*100003+j;
  function rehash(){HM.clear();for(const q of BX.concat(RAMPS)){for(let i=Math.floor((q.x0-2)/CS);i<=Math.floor((q.x1+2)/CS);i++)for(let j=Math.floor((q.z0-2)/CS);j<=Math.floor((q.z1+2)/CS);j++){const k=key(i,j);if(!HM.has(k))HM.set(k,[]);HM.get(k).push(q);}}}rehash();
  function add(o){if(o.prefab){o=placePrefab(o.prefab,o.x,o.z,o);rehash();ROADS.updateBlocked();return o.id;}o=Object.assign({id:NID++,rot:0,p:{}},o);if(o.id>=NID)NID=o.id+1;OBJS.push(o);build(o);rehash();ROADS.updateBlocked();return o.id;}
  function remove(id){const h=HND.get(id);if(!h)return false;const rm=(A,L)=>{for(const x of L){const i=A.indexOf(x);if(i>=0)A.splice(i,1);}};rm(BX,h.boxes);rm(BL,h.bl);rm(RAMPS,h.ramps);rm(PADS,h.pads);rm(LOOPS,h.loops);rm(PIPES,h.pipes);for(let i=HOOPS.length-1;i>=0;i--)if(HOOPS[i].oid===id)HOOPS.splice(i,1);
    if(h.host)h.host.deco=h.host.deco.filter(k=>!(k[0]==='pad'&&h.pads.includes(k[1])));HND.delete(id);const i=OBJS.findIndex(o=>o.id===id);if(i>=0)OBJS.splice(i,1);rehash();ROADS.updateBlocked();return true;}
  // --- ROADS: mutable road graph (future cops / Z traffic / builder mode). Same API as NEON WORLD 1 (nodes / edges / lanes / spawns / chains / blockedBy). ---
  const ROADS=(()=>{const G={nodes:[],edges:[],adj:[],spawns:[],chains:[],laneW:3.4},ix=new Map();
    const nid=(x,z,k)=>{x=Math.round(x*10)/10;z=Math.round(z*10)/10;const kk=x+','+z;if(!ix.has(kk)){ix.set(kk,G.nodes.length);G.nodes.push({id:G.nodes.length,x,z,kind:k});}return ix.get(kk);};
    G.addEdge=(a,b,w,kind)=>{const A=G.nodes[a],B=G.nodes[b],len=Math.hypot(B.x-A.x,B.z-A.z);if(len<1)return-1;const e={id:G.edges.length,a,b,len,w,kind,lanes:[],blockedBy:[]};G.edges.push(e);return e.id;};
    G.addRoad=(x0,z0,x1,z1,o)=>{o=o||{};const w=o.w||20,kind=o.kind||'street',st=o.step||100,L=Math.hypot(x1-x0,z1-z0),n=Math.max(1,Math.round(L/st)),ids=[];let prev=nid(x0,z0,kind);
      for(let i=1;i<=n;i++){const t=i/n,cur=nid(x0+(x1-x0)*t,z0+(z1-z0)*t,kind),k=typeof o.kindAt==='function'?o.kindAt(x0+(x1-x0)*(t-.5/n),z0+(z1-z0)*(t-.5/n)):kind;ids.push(G.addEdge(prev,cur,w,k));prev=cur;}if(!o.noRebuild)G.rebuild();return ids;};
    G.removeEdge=(id)=>{if(!G.edges[id])return false;G.edges[id]=null;G.rebuild();return true;};
    G.rebuild=()=>{const E=G.edges.filter(Boolean),N=G.nodes,LW=G.laneW;G.adj=N.map(()=>[]);G.spawns=[];
      for(const e of E){const A=N[e.a],B=N[e.b],ux=(B.x-A.x)/e.len,uz=(B.z-A.z)/e.len,o=e.w/4;G.adj[e.a].push(e.id);G.adj[e.b].push(e.id);
        e.lanes=[{from:e.a,to:e.b,dir:[ux,uz],yaw:Math.atan2(ux,uz),off:[uz*o,-ux*o]},{from:e.b,to:e.a,dir:[-ux,-uz],yaw:Math.atan2(-ux,-uz),off:[-uz*o,ux*o]}];
        if(e.kind!=='tunnel')e.lanes.forEach((l,li)=>G.spawns.push({edge:e.id,lane:li,x:(A.x+B.x)/2+l.off[0],z:(A.z+B.z)/2+l.off[1],yaw:l.yaw}));}
      const seen=new Set(),dirOf=(e)=>{const A=N[e.a],B=N[e.b];return[(B.x-A.x)/e.len,(B.z-A.z)/e.len];},same=(p,q)=>Math.abs(p[0]-q[0])<1e-6&&Math.abs(p[1]-q[1])<1e-6;G.chains=[];
      for(const e of E){if(seen.has(e.id))continue;const u=dirOf(e),run=[e];seen.add(e.id);
        for(const fwd of[1,0]){let cur=e;for(;;){const n=fwd?cur.b:cur.a,nx=G.adj[n].map(i=>G.edges[i]).find(f=>!seen.has(f.id)&&same(dirOf(f),u)&&(fwd?f.a===n:f.b===n));if(!nx)break;seen.add(nx.id);fwd?run.push(nx):run.unshift(nx);cur=nx;}}
        const s0=N[run[0].a],s1=N[run[run.length-1].b];G.chains.push({id:G.chains.length,edges:run.map(f=>f.id),x0:s0.x,z0:s0.z,ux:u[0],uz:u[1],len:Math.hypot(s1.x-s0.x,s1.z-s0.z),w:run[0].w,lanesPerDir:run[0].w>=30?3:2,laneW:LW,kind:run[0].kind});}
      G.updateBlocked();return G;};
    G.chainPos=(ci,d,lane)=>{const c=G.chains[ci],side=lane*G.laneW;return{x:c.x0+c.ux*d+c.uz*side,z:c.z0+c.uz*d-c.ux*side,yaw:Math.atan2(c.ux,c.uz)+(lane<0?Math.PI:0)};};
    G.updateBlocked=()=>{for(const e of G.edges){if(!e)continue;e.blockedBy=[];const A=G.nodes[e.a],B=G.nodes[e.b],ux=(B.x-A.x)/e.len,uz=(B.z-A.z)/e.len,hw=e.w/2-1;let curB=null;
      for(let d=2;d<e.len-2;d+=4){let hit=null;for(const s of[-hw,0,hw]){const x=A.x+ux*d+uz*s,z=A.z+uz*d-ux*s,pr=probe(x,z,0.3);if(pr.wl&&pr.wl.oid!=null&&!pr.wl.ramp){hit=pr.wl.oid;break;}}
        if(hit!=null){if(curB&&curB.oid===hit&&curB.d1>=d-4.1)curB.d1=d;else{curB={oid:hit,d0:d,d1:d};e.blockedBy.push(curB);}}}}};
    G.isBlocked=(id,d0,d1)=>{const e=G.edges[id];if(!e)return{removed:true};d0=d0==null?0:d0;d1=d1==null?e.len:d1;return e.blockedBy.find(b=>b.d1>=Math.min(d0,d1)-2&&b.d0<=Math.max(d0,d1)+2)||null;};
    G.toJSON=()=>G.edges.filter(Boolean).map(e=>({a:[G.nodes[e.a].x,G.nodes[e.a].z],b:[G.nodes[e.b].x,G.nodes[e.b].z],w:e.w,kind:e.kind}));
    G.fromJSON=(L)=>{G.nodes.length=0;G.edges.length=0;ix.clear();for(const r of L){const a=nid(r.a[0],r.a[1],r.kind),b=nid(r.b[0],r.b[1],r.kind);G.addEdge(a,b,r.w,r.kind);}return G.rebuild();};
    return G;})();
  const DYN=[];
  const STEP=0.7,WM=0.8,CARH=1.4;
  const rampH=(q,x,z)=>{let t=clamp([(z-q.z0)/(q.z1-q.z0),(x-q.x0)/(q.x1-q.x0),(q.z1-z)/(q.z1-q.z0),(q.x1-x)/(q.x1-q.x0)][q.dir||0],0,1);if(q.prof==='crest')t=t<.88?t/.88:(1-t)/.12;return q.yb+(q.y1-q.yb)*t;};
  // probe(x,z,y): floor under her, ceiling above her, a wall she is inside of; st = on a stick surface (half-pipe)
  const LIVE=[];
  function soak(q,x,z,yh,yl,box){const m=q.y0>0||q.ramp?0:WM;if(x<q.x0-m||x>q.x1+m||z<q.z0-m||z>q.z1+m)return;const ins=x>=q.x0&&x<=q.x1&&z>=q.z0&&z<=q.z1;
    if(q.ramp){const rh=rampH(q,x,z);if(yh>=rh-0.9)box.fl=Math.max(box.fl,rh);else box.wl=box.wl||q;return;}
    if(yh>=q.y1-STEP){if(ins)box.fl=Math.max(box.fl,q.y1);}else if(yl+CARH<=q.y0+0.3){if(ins)box.ce=Math.min(box.ce,q.y0);}else box.wl=box.wl||q;}
  function probe(x,z,y,py){if(py==null)py=y;const yh=Math.max(y,py),yl=Math.min(y,py),g0=gnd(x,z),box={fl:g0[0],ce:1e9,wl:null};const L=HM.get(key(Math.floor(x/CS),Math.floor(z/CS)));if(L)for(const q of L)soak(q,x,z,yh,yl,box);for(let i=0;i<LIVE.length;i++)soak(LIVE[i],x,z,yh,yl,box);
    return{fl:box.fl,ce:box.ce,wl:box.wl,st:g0[1]&&box.fl===g0[0]?1:0};}
  function live(q){if(q&&LIVE.indexOf(q)<0)LIVE.push(q);return q;}
  { // street grid (100 m in x, 200 m in z) + highway (bridge, tunnel) + race track loop + track connector
    const xs=[];for(let x=150;x<=XS1;x+=100)xs.push(x,-x);xs.sort((a,b)=>a-b);const o={noRebuild:1};
    for(const x of xs){if(x===HW.x){ROADS.addRoad(x,ZS0-400,x,ZS1+400,Object.assign({w:30,kind:'highway',kindAt:(X,Z)=>Z>RIV.z0-50&&Z<RIV.z1+50?'bridge':(Z>TUN.z0&&Z<TUN.z1?'tunnel':'highway')},o));continue;}
      ROADS.addRoad(x,ZS0,x,1700,o);ROADS.addRoad(x,1900,x,ZS1,o);}
    for(let z=ZS0;z<=ZS1;z+=200){if(z>RIV.z0-10&&z<RIV.z1+10)continue;ROADS.addRoad(-XS1,z,-150,z,o);ROADS.addRoad(150,z,XS1,z,o);}
    const T=TRACK,pts=trackPts(0,12);for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];ROADS.addRoad(a[0],a[1],b[0],b[1],Object.assign({w:T.w,kind:'track',step:1e9},o));}
    ROADS.addRoad(XS1,1100,T.cx-T.R,1100,Object.assign({kind:'street',step:120},o));
    ROADS.rebuild();}
  // race track: stadium-shaped oval (two straights along z + two half-circle bends); off = lateral offset from the centre line (+ = outside)
  function trackPts(off,nb){const T=TRACK,o=[],R=T.R+off,h=T.L/2;for(let i=0;i<=6;i++)o.push([T.cx+R,T.cz-h+T.L*i/6]);for(let i=1;i<nb;i++){const a=Math.PI*i/nb;o.push([T.cx+R*Math.cos(a),T.cz+h+R*Math.sin(a)]);}
    for(let i=0;i<=6;i++)o.push([T.cx-R,T.cz+h-T.L*i/6]);for(let i=1;i<nb;i++){const a=Math.PI+Math.PI*i/nb;o.push([T.cx+R*Math.cos(a),T.cz-h+R*Math.sin(a)]);}return o;}
  function trackDist(x,z){const T=TRACK,h=T.L/2,dz=z<T.cz-h?z-(T.cz-h):z>T.cz+h?z-(T.cz+h):0;return Math.hypot(x-T.cx,dz)-T.R;}
  const inR=(x,z,r)=>x>=r.x0&&x<=r.x1&&z>=r.z0&&z<=r.z1;
  // surfaceAt(x,z): 'paved' (runway, taxiway, streets, highway, bridges, tunnel, ramps, plazas, track, half-pipe), 'grass', 'park', 'water'
  function surfaceAt(x,z){if(Math.abs(x)<=16&&z>=-60&&z<=1500)return'paved';if(inR(x,z,TAXI)||(x>=0&&x<=62&&z>=-20&&z<=12))return'paved';
    for(const r of RAMPS)if(inR(x,z,r))return'paved';for(const Pp of PIPES)if(x>Pp.x0&&x<Pp.x1&&z>=Pp.z0&&z<=Pp.z1)return'paved';
    if(z>=RIV.z0&&z<=RIV.z1)return bridgeK(x)<0?'paved':'water';
    if(Math.abs(x-HW.x)<=HW.hw&&z>=ZS0-400&&z<=ZS1+400)return'paved';
    if(Math.abs(trackDist(x,z))<=TRACK.w/2+1)return'paved';if(Math.abs(z-1100)<=10&&x>=XS1&&x<=TRACK.cx-TRACK.R)return'paved';
    if(Math.hypot(x-STAD.x,(z-STAD.z)/.8)<STAD.r-12)return'park';
    if(x>=XS0-10&&x<=XS1+10&&z>=ZS0-10&&z<=ZS1+10&&Math.abs(x)>=140){if(x>=TUN.x0-5&&x<=TUN.x1+5&&z>=TUN.z0-5&&z<=TUN.z1+5)return'grass';
      if(inR(x,z,PARK)){const sx=((Math.abs(x)-150)%100+100)%100,sz=((z+300)%200+200)%200;return(sx<=10||sx>=90||sz<=10||sz>=190)?'paved':'park';}return'paved';}
    if(window.SOCCER&&SOCCER.paved&&SOCCER.paved(x,z))return'paved';
    return'grass';}
  const padAt=(x,z,y)=>PADS.find(p=>Math.abs(p.y-y)<1&&inR(x,z,p))||null;
  return{PREFABS,placePrefab,DYN,OBJS,TYPES,add,remove,live,toJSON:()=>JSON.stringify({objs:OBJS,roads:ROADS.toJSON()}),ROADS,BL,BX,RAMPS,PADS,TREES,LOTS,HOOPS,RINGS:rings,LOOPS,PIPES,TOWS,RIV,HW,TUN,PARK,STAD,TAXI,DT,TRACK,BRIDGES,XS0,XS1,ZS0,ZS1,
    probe,gnd,riverY,pipeY,rampH,trackPts,trackDist,surfaceAt,padAt,inTunnel:(x,z)=>x>TUN.bx0&&x<TUN.bx1&&z>TUN.z0&&z<TUN.z1};})();
const surfaceAt=CITY.surfaceAt;
// walls: glancing scrapes along the tangent (keeps tangential speed, sparks), square hits bounce 2.5–4.5 m/s off the normal, airborne grazes deflect outward. Pushed out of q: no reset, no trap.
function cityWall(q,px,pz){const T=TUNE,m=q.y0>0||q.ramp?0:0.8;let nx=0,nz=0;
  const ox=px<q.x0-m?-1:px>q.x1+m?1:0,oz=pz<q.z0-m?-1:pz>q.z1+m?1:0;
  if(ox&&oz){const hx0=Math.sin(P.hd||0),hz0=Math.cos(P.hd||0),gapX=ox<0?q.x0-m-px:px-(q.x1+m),gapZ=oz<0?q.z0-m-pz:pz-(q.z1+m),cX=ox<0?hx0:-hx0,cZ=oz<0?hz0:-hz0,tX=cX>1e-4?gapX/cX:1e9,tZ=cZ>1e-4?gapZ/cZ:1e9;if(tX<=tZ)nx=ox;else nz=oz;}
  else if(ox||oz){nx=ox;nz=oz;}
  else{const d=[P.x-(q.x0-m),(q.x1+m)-P.x,P.z-(q.z0-m),(q.z1+m)-P.z],k=d.indexOf(Math.min(...d));[nx,nz]=[[-1,0],[1,0],[0,-1],[0,1]][k];}
  if(nx<0)P.x=q.x0-m-0.05;if(nx>0)P.x=q.x1+m+0.05;if(nz<0)P.z=q.z0-m-0.05;if(nz>0)P.z=q.z1+m+0.05;
  const hx=Math.sin(P.hd||0),hz=Math.cos(P.hd||0),dot=hx*nx+hz*nz,a=Math.asin(clamp(-dot,0,1)),cosAngle=Math.cos(a);let tx=hx-dot*nx,tz=hz-dot*nz;if(Math.hypot(tx,tz)<1e-3){tx=-nz;tz=nx;}
  const nh=Math.atan2(tx,tz),spark=()=>{if(typeof fxBurst==='function')fxBurst('spark',10);},keep=Math.max(0.55,cosAngle*0.85);
  P.walls=(P.walls||0)+1;P.lastWall={a:+(a/D).toFixed(1),n:[nx,nz]};
  const glance=a/D<T.skimDeg&&(P.v>T.skimSpeed||!P.ground),square=a/D>=48&&P.v>=12;
  if(glance){P.v*=keep;P.skims=(P.skims||0)+1;spark();toast('SKIM!');navigator.vibrate&&navigator.vibrate(30);P.hd=nh;P.yaw=nh;
    if(!P.ground){P.x+=nx*0.3;P.z+=nz*0.3;P.bank=clamp((P.bank||0)-nx*12*D+nz*6*D,-0.7,0.7);}}
  else if(square){const bounce=clamp(P.v*0.075,2.5,4.5);P.hards=(P.hards||0)+1;P.wallHards=(P.wallHards||0)+1;P.landKmh=P.v*3.6;P.v=bounce;P.roll=null;P.flip=null;const away=Math.atan2(nx,nz);P.hd=away;P.yaw=away;P.x+=nx*0.35;P.z+=nz*0.35;spark();if(typeof fxBurst==='function')fxBurst('smoke',6);toast('HARD HIT!');navigator.vibrate&&navigator.vibrate([120,60,200]);
    if(!P.ground)P.bank=clamp((P.bank||0)-nx*14*D,-0.7,0.7);}
  else if(!P.ground){P.v*=keep;const away=Math.atan2(nx,nz);let dAng=away-nh;while(dAng>Math.PI)dAng-=Math.PI*2;while(dAng<-Math.PI)dAng+=Math.PI*2;P.hd=nh+dAng*0.35;P.yaw=P.hd;P.x+=nx*0.35;P.z+=nz*0.35;P.bank=clamp((P.bank||0)-nx*12*D+nz*6*D,-0.7,0.7);spark();}
  else if(P.v<12){P.v*=.5;P.bumps=(P.bumps||0)+1;toast('BUMP!');P.hd=nh;P.yaw=nh;}
  else{P.v*=keep;spark();P.hd=nh;P.yaw=nh;}
  if(P.x>q.x0&&P.x<q.x1&&P.z>q.z0&&P.z<q.z1){if(nx)P.x=nx<0?q.x0-0.05:q.x1+0.05;if(nz)P.z=nz<0?q.z0-0.05:q.z1+0.05;}}
// loop-de-loop ride: energy along the circle (v^2 = v0^2 - 2 g y); fast enough = full loop and out the exit lane, too slow = rolls back out the way she came
function loopStep(dt){const o=P.loop,L=o.L,g=9.8;let y=L.R*(1-Math.cos(o.th)),v=Math.sqrt(Math.max(0,o.v0*o.v0-2*g*y))*0.995;
  if(o.dn>0&&!o.full&&(v<1||o.th>=Math.PI/2))o.dn=-1;o.th+=o.dn*Math.max(v,1.2)*dt/L.R;
  let done=0;if(o.th>=2*Math.PI){o.th=2*Math.PI;done=1;}else if(o.th<=0){o.th=0;done=-1;}
  y=L.R*(1-Math.cos(o.th));v=Math.sqrt(Math.max(0,o.v0*o.v0-2*g*y))*0.995;const f=L.R*Math.sin(o.th),lat=L.off*o.th/(2*Math.PI);
  P.x=L.x+L.ux*f+L.uz*lat;P.z=L.z+L.uz*f-L.ux*lat;P.y=y;P.v=Math.max(v,0.5);P.ground=true;P.gam=0;P.q=0;P.bank=0;P.yaw=P.hd=Math.atan2(L.ux,L.uz)+(o.dn<0?Math.PI:0);P.pitch=o.dn>0?(o.th>Math.PI?o.th-2*Math.PI:o.th):-(o.th);
  if(typeof VP!=='undefined')VP.cp=null;
  if(done){P.loop=null;P.y=0;P.pitch=0;if(done>0){P.loops=(P.loops||0)+1;L.n++;toast('LOOP!');}else{P.v=Math.max(2,Math.min(P.v,o.v0));toast('TOO SLOW!');}}
  P.gy=P.y;return{fl:P.y,ce:1e9,wl:null,st:1};}
// after the move: walls, tunnel ceiling (gentle cap, never a crash), floor height under her (roofs / ramps / bank lips / pipes are ground), river drag, hoops, loop entry
function cityMove(px,pz,py,dt){dt=dt||1/30;if(P.loop)return loopStep(dt);
  let pr=CITY.probe(P.x,P.z,P.y,py);if(pr.wl){cityWall(pr.wl,px,pz);pr=CITY.probe(P.x,P.z,P.y,py);if(pr.wl){P.x=px;P.z=pz;pr=CITY.probe(P.x,P.z,P.y,py);}}
  if(pr.ce<1e9&&P.y+1.4>pr.ce){P.y=Math.max(pr.fl,pr.ce-1.4);if(!P.ground){P.gam=Math.min(P.gam,0);P.pitch=Math.min(P.pitch,2*D);}P.ceil=(P.ceil||0)+1;}
  // half-pipe: speed follows the height she climbs or drops (energy); runs out going up = rolls back down
  if(P.ground&&pr.st&&P._pg!=null){const dy=pr.fl-P._pg,v2=P.v*P.v-2*9.8*dy;if(v2<=0.25&&dy>0){P.v=0.4;P.yaw+=Math.PI;P.hd=P.yaw;P.pipeTurns=(P.pipeTurns||0)+1;}else P.v=Math.sqrt(Math.max(0.16,v2));}
  P._pg=P.ground&&pr.st?pr.fl:null;
  // river: sinks (floor = -RIV.sink) and drags; drives back out over the bank lip
  const wet=P.ground&&pr.fl<-0.3;if(wet){P.v-=P.v*TUNE.waterDrag*dt;if(!P.inWater){P.splash=(P.splash||0)+1;toast('SPLASH!');}}P.inWater=wet;
  for(const h of CITY.HOOPS){const a=(px-h.x)*h.nx+(pz-h.z)*h.nz,b=(P.x-h.x)*h.nx+(P.z-h.z)*h.nz;if((a<0)!==(b<0)&&Math.abs(a-b)<20&&!(h.hitT&&(P.simT-h.hitT)<0.5)){const t=a/(a-b),cx=px+(P.x-px)*t,cz=pz+(P.z-pz)*t,cy=py+(P.y-py)*t;if(Math.hypot(cx-h.x,cz-h.z,cy-h.y)<=h.r+1.0){P.nosTank=Math.min(1,(P.nosTank||0)+1/3);h.hit=1;h.hitT=P.simT||0;P.hoops=(P.hoops||0)+1;if(typeof fxBurst==='function')fxBurst('spark',10);if(typeof wMsg==='function')wMsg('HOOP! +1/3 NOS','#ff4fd8','NOS +33%');else toast('HOOP!');}}}
  for(const r of rings){const nx=-Math.sin(r.yaw),nz=Math.cos(r.yaw),a=(px-r.x)*nx+(pz-r.z)*nz,b=(P.x-r.x)*nx+(P.z-r.z)*nz;if((a<0)!==(b<0)&&Math.abs(a-b)<25&&!(r.hitT&&(P.simT-r.hitT)<0.5)){const t=a/(a-b),cx=px+(P.x-px)*t,cz=pz+(P.z-pz)*t,cy=py+(P.y-py)*t;if(Math.hypot(cx-r.x,cz-r.z,cy-r.y)<=r.r+1.5){P.nosTank=1;r.hit=1;r.hitT=P.simT||0;P.rings=(P.rings||0)+1;if(typeof fxBurst==='function')fxBurst('spark',16);if(typeof wMsg==='function')wMsg('RING! FULL NOS','#ffe14d','NOS 100%');else toast('RING!');}}}
  if(P.ground&&!P.wreck&&P.v>8)for(const L of CITY.LOOPS){const f0=(px-L.x)*L.ux+(pz-L.z)*L.uz,f1=(P.x-L.x)*L.ux+(P.z-L.z)*L.uz,lat=(P.x-L.x)*L.uz-(P.z-L.z)*L.ux;
    if(f0<0&&f1>=0&&Math.abs(lat)<L.w/2&&Math.sin(P.hd)*L.ux+Math.cos(P.hd)*L.uz>Math.cos(35*D)){P.loop={L,th:0,dn:1,v0:P.v,full:P.v*P.v>=5.4*9.8*L.R};return loopStep(dt);}}
  P.gy=pr.fl;return pr;}
