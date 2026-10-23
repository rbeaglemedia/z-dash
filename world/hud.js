'use strict';
// ===== WANTED-style HUD (same bubble / meter / dial / popup drawing as WANTED in jr.html) =====
const H_FONT="'Orbitron', 'Rajdhani', sans-serif",H_TXT="'Rajdhani', 'Roboto Condensed', sans-serif";
const H_PINK='#ff4fd8',H_CYAN='#3ee6ff',H_YEL='#ffe14d',H_LIME='#7dff6b',H_ORNG='#ff9a2e';
function hT(c,s,x,y,size,col,align='left',font=H_FONT,weight=800,glow=0){c.font=`${weight} ${size}px ${font}`;c.textAlign=align;c.textBaseline='alphabetic';c.fillStyle=col;if(glow){c.shadowColor=col;c.shadowBlur=glow;}c.fillText(s,x,y);c.shadowBlur=0;}
function hTN(c,str,x,y,size,col,align='left',font=H_FONT,weight=900,glow=0){const adv=size*.74,wd=adv*str.length,x0=align==='center'?x-wd/2:align==='right'?x-wd:x;for(let i=0;i<str.length;i++)hT(c,str[i],x0+adv*(i+.5),y,size,col,'center',font,weight,glow);}
function hrr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
function hbub(c,x,y,w,h,col,fill='rgba(12,4,24,.72)'){hrr(c,x,y,w,h,14);c.fillStyle=fill;c.fill();c.lineWidth=2.5;c.strokeStyle=col;c.shadowColor=col;c.shadowBlur=12;c.stroke();c.shadowBlur=0;}
// popups: WANTED's wMsg (big glowing word + white sub line, pops in then fades)
const RWXRAY={on:localStorage.getItem('zdw_rwxray')!=='0'};
let FMSG=null;function wMsg(txt,col=H_YEL,sub=''){FMSG={txt,col,sub,t:performance.now()/1000};}
const TOASTC={'PULL UP!':[H_YEL,'tilt the top of the phone toward you'],'LIFT OFF!':[H_LIME,'you are flying!'],'BUTTER LANDING!':[H_YEL,'smooth as butter'],'TOUCHDOWN':[H_CYAN,''],'BOUNCE!':['#ff2a3d','too fast or too steep'],'WINGS OUT!':[H_CYAN,''],'LOW SPEED: NOSE SINKING':[H_ORNG,'nose down or more throttle'],'FLY!':[H_LIME,'hold THROTTLE to roll'],'STALL!':['#ff2a3d','nose drops: dive for speed, then pull up'],'BARREL ROLL!':[H_PINK,'woohoo!'],'RECOVERED!':[H_LIME,'nice save!'],'TOO SLOW!':['#ff2a3d','not enough speed: she will settle back'],'SKIM!':[H_CYAN,'skipped off the ground: keep flying!'],'WRECKED!':['#ff2a3d','way too hard!'],'HARD HIT!':['#ff2a3d','too steep: lost your speed · keep going!'],'ROUGH LANDING!':[H_ORNG,'too hard: lost speed'],'BUMP!':[H_ORNG,'back on the runway'],'WINGS CLOSED!':['#ff2a3d','no lift: you will sink. Tap WINGS to open'],'WINGS OPEN!':[H_CYAN,'lift ON']};
let ktT=0;function kToast(s,ms=1600){const el=document.getElementById('kToast');el.textContent=s;el.classList.remove('hidden','fade');clearTimeout(ktT);ktT=setTimeout(()=>el.classList.add('hidden'),ms);}
function toast(s){const c=TOASTC[s];if(c)wMsg(s,c[0],c[1]);else kToast(s);}
let vShown=0,vS=0,vT=0,hudStackBottom=168;
// Heading-up minimap. City is baked once; each frame rotates that image by -yaw and blits it once. The Z icon stays pointing up.
const MINI={X0:-1500,Z0:-900,X1:1900,Z1:2900,S:0.34,cv:null};
// Garage Z (world/garage.js) reads localStorage 'zdash.kid.v1' -> eq.paint (and wheels, windows, rims, tires, stance, spoiler, spcol).
// The player model is always the 370Z; the save does not swap the car. No save leaves KID.paint at the default cyan #1aa6c8.
// That cyan, and other map-like paints, disappear into the roads, runway, highways, track, ramps, or tow dots, so those fall back to white.
const ZICON={cv:null,paint:''};
function miniIconPaint(){const white='#f4f6fb';
  if(typeof GZ==='undefined'||!GZ.on||typeof KID==='undefined')return white;
  const hex=String(KID.paint||'');if(!/^#[0-9a-fA-F]{6}$/.test(hex))return white;
  const n=parseInt(hex.slice(1),16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  if(.2126*r+.7152*g+.0722*b<52)return white;
  const near=(R,G,B,d)=>Math.hypot(r-R,g-G,b-B)<d;
  if(near(62,230,255,108)||near(255,176,32,82)||near(255,79,216,88)||near(255,154,46,82)||near(255,225,77,82))return white;
  return hex;}
function zIconBake(){if(ZICON.cv)return;const paint=miniIconPaint(),N=160,cv=document.createElement('canvas');cv.width=cv.height=N;
  const c=cv.getContext('2d'),cx=N/2,y0=14,y1=N-16,span=4.56,k=(y1-y0)/span,zA=2.32,X=w=>cx+w*k,Y=z=>y0+(zA-z)*k,ink='#140814';
  const trace=pts=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(X(p[0]),Y(p[1])):c.moveTo(X(p[0]),Y(p[1])));};
  const ring=side=>{trace(side);for(let i=side.length-1;i>=0;i--)c.lineTo(X(-side[i][0]),Y(side[i][1]));c.closePath();};
  c.lineJoin='round';c.lineCap='round';
  // Plan of the 370Z: narrow nose, long hood, cabin set back, wide rear hips, flat tail. Nose is up.
  const side=[[.08,2.30],[.42,2.22],[.66,2.04],[.84,1.74],[.90,1.30],[.82,.70],[.78,.10],[.88,-.40],[1.04,-1.15],[.98,-1.64],[.82,-2.00],[.64,-2.16]];
  ring(side);c.fillStyle=paint;c.fill();c.lineWidth=7;c.strokeStyle=ink;c.stroke();
  trace([[-.82,-2.06],[.82,-2.06],[.82,-2.26],[-.82,-2.26]]);c.closePath();c.fillStyle=paint;c.fill();c.lineWidth=5;c.strokeStyle=ink;c.stroke();
  const wheel=(sx,z)=>{c.beginPath();c.ellipse(X(sx*1.05),Y(z),.22*k,.38*k,0,0,7);c.fillStyle='#12141a';c.fill();c.lineWidth=3;c.strokeStyle='#3a3e48';c.stroke();};
  wheel(1,1.18);wheel(-1,1.18);wheel(1,-1.38);wheel(-1,-1.38);
  ring([[.64,-.05],[.56,-.45],[.46,-1.00],[.34,-1.48],[.20,-1.66]]);c.fillStyle='#10131c';c.fill();
  const lamp=sx=>{c.beginPath();c.moveTo(X(sx*.26),Y(2.18));c.lineTo(X(sx*.74),Y(2.04));c.lineTo(X(sx*.94),Y(1.48));c.lineTo(X(sx*.52),Y(1.42));c.lineTo(X(sx*.34),Y(1.92));c.closePath();c.fillStyle=ink;c.fill();
    c.beginPath();c.moveTo(X(sx*.40),Y(2.06));c.lineTo(X(sx*.66),Y(1.98));c.lineTo(X(sx*.76),Y(1.64));c.lineTo(X(sx*.50),Y(1.68));c.closePath();c.fillStyle='#fff';c.fill();};
  lamp(1);lamp(-1);
  const tail=sx=>{c.beginPath();c.moveTo(X(sx*.42),Y(-2.08));c.lineTo(X(sx*.74),Y(-2.02));c.lineTo(X(sx*.70),Y(-1.86));c.lineTo(X(sx*.40),Y(-1.94));c.closePath();c.fillStyle='#ff2a3d';c.fill();};
  tail(1);tail(-1);
  trace([[-.18,2.20],[.18,2.20],[.12,2.08],[-.12,2.08]]);c.closePath();c.fillStyle=ink;c.fill();
  ZICON.cv=cv;ZICON.paint=paint;}
function miniHex(hex,a){const n=parseInt(String(hex||'').replace('#',''),16);if(!Number.isFinite(n))return`rgba(62,230,255,${a})`;return`rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;}
// Pitch and spur live in the baked layer (shared/soccer-tune.js). Bounds grow only if that pitch sits outside the city frame.
function miniFitPitch(){const T=window.SOCCER_TUNE;if(!T||MINI.fit)return;MINI.fit=1;const pad=24,x0=Math.min(T.roadX0,T.fieldCx-T.fieldHw)-pad,x1=Math.max(T.roadX1,T.fieldCx+T.fieldHw)+pad,z0=T.fieldCz-T.fieldHl-pad,z1=T.fieldCz+T.fieldHl+pad;if(x0<MINI.X0)MINI.X0=x0;if(x1>MINI.X1)MINI.X1=x1;if(z0<MINI.Z0)MINI.Z0=z0;if(z1>MINI.Z1)MINI.Z1=z1;}
function miniPitch(c,X,Y,S){const T=window.SOCCER_TUNE;if(!T)return;const F=window.SOCCER&&SOCCER.field,x0=T.fieldCx-T.fieldHw,x1=T.fieldCx+T.fieldHw,z0=T.fieldCz-T.fieldHl,z1=T.fieldCz+T.fieldHl,gw=(F&&F.goalW)||Math.min((x1-x0)*.46,16),gd=(F&&F.goalD)||5,gx0=T.fieldCx-gw/2,gx1=T.fieldCx+gw/2;
  c.fillStyle='rgba(62,230,255,.55)';c.fillRect(X(T.roadX0),Y(T.roadZ+T.roadHalfW),(T.roadX1-T.roadX0)*S,T.roadHalfW*2*S);
  c.fillStyle='rgba(7,40,28,.92)';c.fillRect(X(x0),Y(z1),(x1-x0)*S,(z1-z0)*S);c.strokeStyle='#3ee6ff';c.lineWidth=1.7;c.strokeRect(X(x0),Y(z1),(x1-x0)*S,(z1-z0)*S);
  c.beginPath();c.moveTo(X(x0),Y(T.fieldCz));c.lineTo(X(x1),Y(T.fieldCz));c.stroke();
  const goal=(z,sign,col)=>{c.beginPath();c.moveTo(X(gx0),Y(z));c.lineTo(X(gx0),Y(z+sign*gd));c.lineTo(X(gx1),Y(z+sign*gd));c.lineTo(X(gx1),Y(z));c.strokeStyle=col;c.lineWidth=1.8;c.stroke();};
  goal(z0,-1,'#ff4fd8');goal(z1,1,'#7dfff2');}
function miniBake(){if(MINI.cv||typeof CITY==='undefined')return;miniFitPitch();const S=MINI.S,w=Math.ceil((MINI.X1-MINI.X0)*S),h=Math.ceil((MINI.Z1-MINI.Z0)*S),cv=document.createElement('canvas');cv.width=w;cv.height=h;const c=cv.getContext('2d'),X=x=>(x-MINI.X0)*S,Y=z=>(MINI.Z1-z)*S,C=CITY;
  c.fillStyle='#070314';c.fillRect(0,0,w,h);
  c.fillStyle='rgba(8,40,90,.95)';c.fillRect(0,Y(C.RIV.z1),w,(C.RIV.z1-C.RIV.z0)*S);
  c.fillStyle='rgba(10,60,30,.85)';c.fillRect(X(C.PARK.x0),Y(C.PARK.z1),(C.PARK.x1-C.PARK.x0)*S,(C.PARK.z1-C.PARK.z0)*S);
  const N=C.ROADS.nodes,roads=(pred,col,lw)=>{c.beginPath();for(const e of C.ROADS.edges){if(!e||!pred(e))continue;const A=N[e.a],B=N[e.b];c.moveTo(X(A.x),Y(A.z));c.lineTo(X(B.x),Y(B.z));}c.strokeStyle=col;c.lineWidth=lw;c.stroke();};
  roads(e=>e.kind==='street','rgba(62,230,255,.8)',1.35);
  roads(e=>e.kind==='highway'||e.kind==='bridge'||e.kind==='tunnel','#ffb020',2.1);
  roads(e=>e.kind==='track','#ff4fd8',1.6);
  c.strokeStyle='#ffb020';c.lineWidth=1.5;c.strokeRect(X(C.TAXI.x0),Y(C.TAXI.z1),(C.TAXI.x1-C.TAXI.x0)*S,(C.TAXI.z1-C.TAXI.z0)*S);
  for(const b of C.BL){const bw=b.x1-b.x0,bd=b.z1-b.z0;if(bw<6||bd<6)continue;const ol=b.kind==='outline';c.fillStyle=ol?'rgba(62,230,255,.08)':miniHex(b.c,.3);c.strokeStyle=ol?'rgba(62,230,255,.5)':(b.c||'#3ee6ff');c.lineWidth=1;c.fillRect(X(b.x0),Y(b.z1),bw*S,bd*S);c.strokeRect(X(b.x0),Y(b.z1),bw*S,bd*S);}
  const z0=-40,z1=1500;c.fillStyle='rgba(62,230,255,.5)';c.fillRect(X(-15),Y(z1),30*S,(z1-z0)*S);c.strokeStyle='#e9fbff';c.lineWidth=2;c.strokeRect(X(-15),Y(z1),30*S,(z1-z0)*S);
  c.strokeStyle='rgba(255,255,255,.92)';c.lineWidth=1.1;c.beginPath();for(let z=0;z<z1;z+=70){c.moveTo(X(0),Y(z));c.lineTo(X(0),Y(Math.min(z1,z+28)));}c.stroke();
  c.fillStyle='#ff9a2e';for(const r of C.RAMPS){if(r.hid||r.yb>0||r.nm==='tow')continue;c.fillRect(X((r.x0+r.x1)/2)-1.3,Y((r.z0+r.z1)/2)-1.3,2.6,2.6);}
  miniPitch(c,X,Y,S);
  MINI.cv=cv;}
let miniSpan=0;
const ZICON_W=.45; // visible car width ÷ sprite. Street width uses this.
function miniTune(){return window.MINIMAP_TUNE||{spanClose:300,spanFar:3400,altClose:24,altFar:240,ease:.8,street:20,iconMin:20,poiPx:20};}
function miniZoom(dt){const T=miniTune(),y=Math.max(0,P.y||0),den=(T.altFar||240)-(T.altClose||24),u=den>0?clamp((y-(T.altClose||24))/den,0,1):0,e=u*u*(3-2*u),target=(T.spanClose||300)+((T.spanFar||3400)-(T.spanClose||300))*e;
  if(!miniSpan){miniSpan=target;return miniSpan;}
  const k=1-Math.exp(-Math.min(Math.max(dt,0),.1)/Math.max(.05,T.ease||.8));miniSpan+=(target-miniSpan)*k;return miniSpan;}
function miniIconPx(mw,span){const T=miniTune(),px=(T.street||20)/span*mw;return Math.max(T.iconMin||20,px/ZICON_W);}
const POI={plane:null,ball:null};
function poiBake(){if(POI.plane)return;const N=128,disc=(glow,edge)=>{const cv=document.createElement('canvas');cv.width=cv.height=N;const c=cv.getContext('2d');c.beginPath();c.arc(64,64,54,0,7);c.fillStyle='rgba(8,4,20,0.92)';c.fill();c.lineWidth=7;c.strokeStyle=glow;c.shadowColor=glow;c.shadowBlur=14;c.stroke();c.shadowBlur=0;c.lineWidth=3;c.strokeStyle=edge;c.stroke();return c;};
  const pc=disc('#3ee6ff','#e9fbff');pc.save();pc.beginPath();pc.arc(64,64,50,0,7);pc.clip();pc.fillStyle='#f4fbff';pc.strokeStyle='#3ee6ff';pc.lineJoin='round';pc.lineWidth=5;
  pc.beginPath();pc.moveTo(64,18);pc.quadraticCurveTo(76,46,73,86);pc.lineTo(68,108);pc.quadraticCurveTo(64,114,60,108);pc.lineTo(55,86);pc.quadraticCurveTo(52,46,64,18);pc.closePath();pc.fill();pc.stroke();
  pc.beginPath();pc.moveTo(60,48);pc.lineTo(16,78);pc.lineTo(22,90);pc.lineTo(58,70);pc.lineTo(70,70);pc.lineTo(106,90);pc.lineTo(112,78);pc.lineTo(68,48);pc.closePath();pc.fill();pc.stroke();
  pc.beginPath();pc.moveTo(57,92);pc.lineTo(34,108);pc.lineTo(40,116);pc.lineTo(64,104);pc.lineTo(88,116);pc.lineTo(94,108);pc.lineTo(71,92);pc.closePath();pc.fill();pc.stroke();pc.restore();
  POI.plane=pc.canvas;
  const bc=disc('#7dff6b','#3ee6ff');bc.beginPath();bc.arc(64,64,36,0,7);bc.fillStyle='#f7f7f7';bc.fill();bc.lineWidth=4;bc.strokeStyle='#141414';bc.stroke();
  bc.beginPath();for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5,x=64+Math.cos(a)*16,y=64+Math.sin(a)*16;i?bc.lineTo(x,y):bc.moveTo(x,y);}bc.closePath();bc.fillStyle='#141414';bc.fill();
  bc.lineWidth=4;bc.strokeStyle='#141414';for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5,b=a+Math.PI/5;bc.beginPath();bc.moveTo(64+Math.cos(a)*16,64+Math.sin(a)*16);bc.quadraticCurveTo(64+Math.cos(b)*26,64+Math.sin(b)*26,64+Math.cos(a)*34,64+Math.sin(a)*34);bc.stroke();}
  bc.beginPath();for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5+Math.PI/5,x=64+Math.cos(a)*30,y=64+Math.sin(a)*30;i?bc.lineTo(x,y):bc.moveTo(x,y);}bc.closePath();bc.lineWidth=3;bc.stroke();
  POI.ball=bc.canvas;}
function miniPois(cx,cy,mw,mh,yaw,ppm){poiBake();const px=miniTune().poiPx||20,pad=12,hx=mw/2-pad,hy=mh/2-pad,co=Math.cos(yaw),si=Math.sin(yaw);
  const marks=[[0,730,POI.plane,-yaw],[(window.SOCCER_TUNE&&SOCCER_TUNE.fieldCx)||790,(window.SOCCER_TUNE&&SOCCER_TUNE.fieldCz)||300,POI.ball,0]];
  for(const[lx,lz,spr,rot]of marks){const dx=lx-P.x,dz=lz-P.z;let sx=(dx*co-dz*si)*ppm,sy=(-dx*si-dz*co)*ppm,out=Math.abs(sx)>hx||Math.abs(sy)>hy;
    if(out){const t=1/Math.max(Math.abs(sx)/hx,Math.abs(sy)/hy);sx*=t;sy*=t;}
    ctx.save();ctx.globalAlpha=out?.85:1;ctx.translate(cx+sx,cy+sy);if(rot)ctx.rotate(rot);ctx.imageSmoothingEnabled=true;ctx.drawImage(spr,-px/2,-px/2,px,px);ctx.restore();}}
// North on screen after the map is rotated by -yaw. yaw 0 faces +z, and +yaw turns toward +x.
function miniNorth(mx,my,mw,mh,yaw){const dx=-Math.sin(yaw),dy=-Math.cos(yaw),r=12,cx=mx+mw/2,cy=my+mh/2,hx=mw/2-r-3,hy=mh/2-r-3,x=cx+dx*hx,y=cy+dy*hy;
  ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fillStyle='rgba(8,4,20,.92)';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=H_CYAN;ctx.shadowColor=H_CYAN;ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;
  ctx.beginPath();ctx.moveTo(x+dx*(r-1),y+dy*(r-1));ctx.lineTo(x+dx*(r+4),y+dy*(r+4));ctx.lineWidth=2;ctx.strokeStyle='#fff';ctx.stroke();
  hT(ctx,'N',x,y+5,14,'#fff','center',H_FONT,900);}
function drawMini(mx,my,mw,mh,dt){try{miniBake();}catch(e){MINI.cv=MINI.cv||null;}
  const span=miniZoom(dt),yaw=P.yaw||0,cx=mx+mw/2,cy=my+mh/2;
  ctx.save();hrr(ctx,mx,my,mw,mh,14);ctx.clip();ctx.fillStyle='rgba(7,3,20,.94)';ctx.fillRect(mx-1,my-1,mw+2,mh+2);
  if(MINI.cv){const ppm=mw/span,dw=(MINI.X1-MINI.X0)*ppm,dh=(MINI.Z1-MINI.Z0)*ppm;ctx.save();ctx.translate(cx,cy);ctx.rotate(-yaw);ctx.imageSmoothingEnabled=true;ctx.drawImage(MINI.cv,(MINI.X0-P.x)*ppm,-(MINI.Z1-P.z)*ppm,dw,dh);if(window.CITY&&CITY.TOWS){ctx.fillStyle='#ffe14d';const lim=span*.75;for(const t of CITY.TOWS){const ex=t.x-P.x,ez=t.z-P.z;if(Math.abs(ex)>lim||Math.abs(ez)>lim)continue;ctx.beginPath();ctx.arc(ex*ppm,-ez*ppm,2.4,0,7);ctx.fill();}}ctx.restore();miniPois(cx,cy,mw,mh,yaw,ppm);}
  zIconBake();const d=miniIconPx(mw,span);ctx.imageSmoothingEnabled=true;ctx.drawImage(ZICON.cv,cx-d/2,cy-d/2,d,d);ctx.restore();
  hrr(ctx,mx,my,mw,mh,14);ctx.lineWidth=2.5;ctx.strokeStyle=H_CYAN;ctx.shadowColor=H_CYAN;ctx.shadowBlur=10;ctx.stroke();ctx.shadowBlur=0;miniNorth(mx,my,mw,mh,yaw);}
// WINGS sits under the right-hand ALT stack. Same size; THROTTLE is left on its CSS anchor.
let wingKey='';function placeWings(s,bottomHud){const wng=document.getElementById('wng'),thr=document.getElementById('tup');if(!wng)return;const key=W+'x'+H+'x'+bottomHud;if(key===wingKey)return;const gap=6;let top=Math.round(bottomHud*s+gap),wh=wng.offsetHeight||84;if(thr){const thrTop=thr.offsetTop;if(top+wh>thrTop-gap)top=thrTop-gap-wh;}if(top<bottomHud*s+2&&thr){wng.style.right=(20+(thr.offsetWidth||112)+10)+'px';top=Math.round(Math.max(bottomHud*s+gap,thr.offsetTop));}else wng.style.right='20px';wng.style.top=Math.round(top)+'px';wng.style.bottom='auto';wingKey=key;}
function drawHud(dt){const t=performance.now()/1000,w=W,h=H,s=clamp(h/378,.72,1.35);ctx.save();ctx.scale(s,s);const Wd=w/s,Hh=h/s,TU=TUNE;
  vS+=(P.v*2.237-vS)*(1-Math.exp(-dt/.3));vT+=dt;if(vT>.14){vT=0;const r=Math.round(vS);if(Math.abs(vS-vShown)>.75||r===0)vShown=r;}
  // TOP LEFT: minimap in the slot the ALT/THR panel used on main (x 12, y 10, 196×134)
  {const mapW=Math.min(196,Math.max(96,Wd/2-79));drawMini(12,10,mapW,134,dt);}
  // TOP CENTRE: ROTATE speed cue (WANTED's level / ramp bar)
  {const gw=118,gh=58,gx=Wd/2-gw/2,gy=6,cm=window.TCMD||[0,0],ok=P.ground&&P.rotOK,cx=gx+gw/2,cy=gy+gh/2,on=typeof tiltOk==='function'&&tiltOk();
    ctx.save();ctx.beginPath();ctx.roundRect(gx,gy,gw,gh,12);ctx.fillStyle='rgba(10,5,24,.82)';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=on?H_CYAN:'#55507a';ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=6;ctx.stroke();
    const edge=(x1,y1,x2,y2)=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.lineWidth=4;ctx.strokeStyle=H_YEL;ctx.shadowColor=H_YEL;ctx.shadowBlur=16;ctx.stroke();};
    if(cm[1]>=.98)edge(gx+14,gy+1.5,gx+gw-14,gy+1.5);if(cm[1]<=-.98)edge(gx+14,gy+gh-1.5,gx+gw-14,gy+gh-1.5);if(cm[0]<=-.98)edge(gx+1.5,gy+12,gx+1.5,gy+gh-12);if(cm[0]>=.98)edge(gx+gw-1.5,gy+12,gx+gw-1.5,gy+gh-12);
    ctx.shadowBlur=0;ctx.strokeStyle='rgba(191,214,255,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(gx+8,cy);ctx.lineTo(gx+gw-8,cy);ctx.moveTo(cx,gy+6);ctx.lineTo(cx,gy+gh-6);ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,5,0,7);ctx.stroke();
    const dx=cx+cm[0]*(gw/2-10),dy=cy-cm[1]*(gh/2-9),mx1=Math.abs(cm[0])>=.98||Math.abs(cm[1])>=.98;ctx.beginPath();ctx.arc(dx,dy,5.5,0,7);ctx.fillStyle=mx1?H_YEL:H_PINK;ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=10;ctx.fill();ctx.restore();
    hT(ctx,on?'TILT':'TILT OFF',gx+6,gy+10,8,'#8f8ab8','left',H_TXT,800);
    if(window.TILTDBG){const r=TL.raw||[TL.lr-TL.n0.lr,TL.fb-TL.n0.fb];hT(ctx,`raw lr ${r[0].toFixed(1)}° fb ${r[1].toFixed(1)}° · cmd ${cm[0].toFixed(2)} ${cm[1].toFixed(2)}`,Wd/2,gy+gh+30,10,'#9fffb8','center',H_TXT,800,4);}
    const by=gy+gh+5,bw=gw;if(P.ground){const mxv=TU.rotateSpeed*1.25,fr=v=>clamp(v/mxv,0,1);ctx.fillStyle='rgba(255,255,255,.14)';hrr(ctx,gx,by,bw,5,2.5);ctx.fill();ctx.fillStyle=ok?(Math.floor(t*6)%2?'#fff':H_YEL):H_CYAN;if(P.v>.3){hrr(ctx,gx,by,Math.max(5,bw*fr(P.v)),5,2.5);ctx.fill();}ctx.fillStyle=H_LIME;ctx.fillRect(gx+bw*fr(TU.rotateSpeed)-1.5,by-3,3,11);
      hT(ctx,ok?'PULL UP!  ▲ TILT TOWARD YOU':!P.wings?(P.v>=TU.rotateSpeed?'OPEN WINGS TO LAUNCH!':'WINGS CLOSED · NO LIFT · TAP WINGS'):P.v<1?`HOLD THROTTLE · ROTATE AT ${Math.round(TU.rotateSpeed*2.237)} MPH`:'BUILD SPEED TO THE GREEN MARK',Wd/2,by+20+(ok?2:0),ok?13:10,ok?H_YEL:'#bfd6ff','center',ok?H_FONT:H_TXT,900,ok?10:4);}
    else hT(ctx,P.stall?'LOW SPEED · NOSE DOWN OR MORE THROTTLE':P.y<15&&P.v*3.6<40?'SLOW & NOSE UP · AIR BRAKE · BUTTER IT!':'DIVE = SPEED · CLIMB = HEIGHT',Wd/2,by+14,10,P.stall?H_ORNG:'#bfd6ff','center',H_TXT,800,4);}
  // RIGHT: MPH dial, then the smaller ALT/THR + STATUS stack directly under it. N2O gauge stays off (bottle is on the NOS button).
  {const rx=Wd-16;ctx.save();const g=ctx.createLinearGradient(Wd-200,0,Wd,0);g.addColorStop(0,'rgba(8,3,20,0)');g.addColorStop(1,'rgba(8,3,20,.6)');ctx.fillStyle=g;ctx.fillRect(Wd-200,8,200,60);ctx.restore();
    {const cx=rx-128,cy=46,r=26,MAX=TU.maxSpeed*TU.nosBoost*2.237,v=clamp(vS,0,MAX),a0=Math.PI*.8,a1=Math.PI*2.2,A=m=>a0+(a1-a0)*(m/MAX);ctx.save();ctx.lineCap='round';ctx.lineWidth=5;ctx.strokeStyle='rgba(255,255,255,.14)';ctx.beginPath();ctx.arc(cx,cy,r,a0,a1);ctx.stroke();
      ctx.strokeStyle=P.stall?H_ORNG:H_CYAN;ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=8;ctx.beginPath();ctx.arc(cx,cy,r,a0,A(v));ctx.stroke();ctx.shadowBlur=0;
      const cm=A(TU.rotateSpeed*2.237);ctx.strokeStyle=H_LIME;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx+Math.cos(cm)*(r-8),cy+Math.sin(cm)*(r-8));ctx.lineTo(cx+Math.cos(cm)*(r+5),cy+Math.sin(cm)*(r+5));ctx.stroke();
      ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(A(v))*(r-4),cy+Math.sin(A(v))*(r-4));ctx.stroke();ctx.restore();}
    hTN(ctx,String(vShown),rx-48,48,34,'#fff','right',H_FONT,900,10);hT(ctx,'MPH',rx,48,12,H_CYAN,'right',H_FONT,900);
    // ~63% of main's 196-wide panel and ~60% of its 126px of boxes (92+34). ALT number stays 18px; bar stays 13px. Labels trimmed.
    const aw=124,ah=50,ax=rx-aw,ay=76,st=P.ground?(P.v<1?'PARKED':'ROLLING'):P.flip?'STALL!':P.stall?'LOW SPEED!':'FLYING';
    hbub(ctx,ax,ay,aw,ah,P.stall&&Math.floor(t*6)%2?H_ORNG:'#3e7bff');
    hT(ctx,'ALT',ax+8,ay+14,9,'#ffd0f4','left',H_TXT,800);hTN(ctx,String(Math.round(P.y)),ax+aw-18,ay+20,18,'#fff','right',H_FONT,900,6);hT(ctx,'M',ax+aw-6,ay+18,10,H_CYAN,'right',H_FONT,900);
    hT(ctx,'THR',ax+8,ay+42,9,'#bfd6ff','left',H_TXT,800);{const bx=ax+34,by=ay+32,bw=aw-42,bh=13;ctx.fillStyle='rgba(255,255,255,.1)';hrr(ctx,bx,by,bw,bh,7);ctx.fill();const g2=ctx.createLinearGradient(bx,0,bx+bw,0);g2.addColorStop(0,'#3e7bff');g2.addColorStop(1,H_PINK);ctx.fillStyle=g2;if(P.thr>.01){hrr(ctx,bx,by,Math.max(14,bw*P.thr),bh,7);ctx.fill();}hT(ctx,Math.round(P.thr*100)+'%'+(P.nosT?' · NOS!':''),bx+bw/2,by+10,10,'#fff','center',H_TXT,900);}
    {const sy=142,sh=26;hbub(ctx,ax,sy,aw,sh,P.stall&&Math.floor(t*5)%2?H_ORNG:'rgba(255,79,216,.8)');hT(ctx,'STATUS',ax+8,sy+17,9,'#ffd0f4','left',H_TXT,800);hT(ctx,st,ax+aw-8,sy+17,11,P.flip?'#ff2a3d':P.stall?H_ORNG:P.ground?H_CYAN:H_LIME,'right',H_FONT,900,4);hudStackBottom=sy+sh;}
    /* FPS is back where main draws it: right edge, baseline y=134 (under the speedometer, above STATUS). */hT(ctx,(fps|0)+' FPS',rx,134,9,'rgba(191,214,255,.6)','right',H_TXT,700);}
  // popup (WANTED wMsg)
  if(FMSG&&t-FMSG.t<1.4){const a=clamp((1.4-(t-FMSG.t))/.4,0,1),sc=1+Math.max(0,.25-(t-FMSG.t))*1.2;ctx.globalAlpha=a;ctx.save();ctx.translate(Wd/2,Hh*.6);ctx.scale(sc,sc);hT(ctx,FMSG.txt,0,0,28,FMSG.col,'center',H_FONT,900,18);if(FMSG.sub)hT(ctx,FMSG.sub,0,22,13,'#fff','center',H_TXT,800);ctx.restore();ctx.globalAlpha=1;}
  ctx.restore();placeWings(s,hudStackBottom);
  // NOS bottle on the NOS button (WANTED's .nfxcan)
  if(!nosCan){nosCan=document.createElement('div');nosCan.className='nfxcan';nosCan.innerHTML='<i></i><b></b>';document.getElementById('nos').appendChild(nosCan);}
  const f=Math.round(P.nosTank*200)/200;if(f!==nosCan.f){nosCan.f=f;nosCan.style.setProperty('--cf',f);document.getElementById('nos').classList.toggle('ready',f>=.99);document.getElementById('nos').classList.toggle('empty',f<.05);}}
let nosCan=null;
// ===== pause menu (WANTED ⏸ → RESUME / row / HOME) =====
let paused=false;function kPause(on){paused=on;document.getElementById('kHome').classList.toggle('hidden',!on);document.getElementById('kPzBg').classList.toggle('hidden',!on);document.getElementById('kMenuB').classList.toggle('kopen',on);}
document.getElementById('kMenuB').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();kPause(!paused);});
document.getElementById('kPzX').addEventListener('click',e=>{e.stopPropagation();kPause(false);});
document.getElementById('kPzBg').addEventListener('click',()=>kPause(false));
document.getElementById('kHome').addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(!b)return;const m=b.dataset.m;
  if(m==='resume')kPause(false);else if(m==='home')location.replace('jr.html');else if(m==='full'){goFull();kPause(false);}else if(m==='recal'){tiltCenter();kPause(false);kToast('TILT CENTERED ✓');}else if(m==='xray'){RWXRAY.on=!RWXRAY.on;localStorage.setItem('zdw_rwxray',RWXRAY.on?'1':'0');b.textContent='RUNWAY X-RAY '+(RWXRAY.on?'ON':'OFF');kToast(b.textContent);}else if(m==='runway'){reset();kPause(false);kToast('BACK ON THE RUNWAY');}});

{const xb=document.querySelector('#kTabs [data-m=xray]');if(xb)xb.textContent='RUNWAY X-RAY '+(RWXRAY.on?'ON':'OFF');}
