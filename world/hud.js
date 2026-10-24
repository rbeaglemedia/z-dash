'use strict';
// ===== WANTED-style HUD (same bubble / meter / dial / popup drawing as WANTED in jr.html) =====
const H_FONT="'Orbitron', 'Rajdhani', sans-serif",H_TXT="'Rajdhani', 'Roboto Condensed', sans-serif";
const H_PINK='#ff4fd8',H_CYAN='#3ee6ff',H_YEL='#ffe14d',H_LIME='#7dff6b',H_ORNG='#ff9a2e';
function hT(c,s,x,y,size,col,align='left',font=H_FONT,weight=800,glow=0){c.font=`${weight} ${size}px ${font}`;c.textAlign=align;c.textBaseline='alphabetic';c.fillStyle=col;if(glow){c.shadowColor=col;c.shadowBlur=glow;}c.fillText(s,x,y);c.shadowBlur=0;}
function hTN(c,str,x,y,size,col,align='left',font=H_FONT,weight=900,glow=0){const adv=size*.74,wd=adv*str.length,x0=align==='center'?x-wd/2:align==='right'?x-wd:x;for(let i=0;i<str.length;i++)hT(c,str[i],x0+adv*(i+.5),y,size,col,'center',font,weight,glow);}
function hrr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
function hbub(c,x,y,w,h,col,fill='rgba(12,4,24,.72)'){hrr(c,x,y,w,h,14);c.fillStyle=fill;c.fill();c.lineWidth=2.5;c.strokeStyle=col;c.shadowColor=col;c.shadowBlur=12;c.stroke();c.shadowBlur=0;}
// popups: WANTED's wMsg (big glowing word + white sub line, pops in then fades)
// See-through is off unless the player turns it on. Nearer buildings hide the runway and the airport.
const RWXRAY={on:localStorage.getItem('zdw_rwxray')==='1'};
let FMSG=null;function wMsg(txt,col=H_YEL,sub=''){FMSG={txt,col,sub,t:performance.now()/1000};}
const TOASTC={'PULL UP!':[H_YEL,'tilt the top of the phone toward you'],'LIFT OFF!':[H_LIME,'you are flying!'],'BUTTER LANDING!':[H_YEL,'smooth as butter'],'TOUCHDOWN':[H_CYAN,''],'BOUNCE!':['#ff2a3d','too fast or too steep'],'WINGS OUT!':[H_CYAN,''],'LOW SPEED: NOSE SINKING':[H_ORNG,'nose down or more throttle'],'FLY!':[H_LIME,'hold THROTTLE to roll'],'STALL!':['#ff2a3d','nose drops: dive for speed, then pull up'],'BARREL ROLL!':[H_PINK,'woohoo!'],'RECOVERED!':[H_LIME,'nice save!'],'TOO SLOW!':['#ff2a3d','not enough speed: she will settle back'],'SKIM!':[H_CYAN,'skipped off the ground: keep flying!'],'WRECKED!':['#ff2a3d','way too hard!'],'HARD HIT!':['#ff2a3d','too steep: lost your speed · keep going!'],'ROUGH LANDING!':[H_ORNG,'too hard: lost speed'],'BUMP!':[H_ORNG,'back on the runway'],'WINGS CLOSED!':['#ff2a3d','no lift: you will sink. Tap WINGS to open'],'WINGS OPEN!':[H_CYAN,'lift ON']};
let ktT=0;function kToast(s,ms=1600){const el=document.getElementById('kToast');el.textContent=s;el.classList.remove('hidden','fade');clearTimeout(ktT);ktT=setTimeout(()=>el.classList.add('hidden'),ms);}
function toast(s){const c=TOASTC[s];if(c)wMsg(s,c[0],c[1]);else kToast(s);}
let vShown=0,vS=0,vT=0,hudStackBottom=168;
// Heading-up minimap. City is baked once; each frame rotates that image by -yaw and blits it once. The Z icon stays pointing up.
const MINI={X0:-1650,Z0:-960,X1:1460,Z1:3060,S:0.22,cv:null};
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
// Positions come from CITY.LAYOUT (after boot) or window.CITY_LAYOUT. Do not copy coordinates into the HUD.
function miniLayout(){const C=typeof CITY!=='undefined'?CITY:null,live=C&&C.LAYOUT;if(live&&live.places&&live.places.length&&(live.roads&&live.roads.length||live.minimap&&live.minimap.roads))return live;const S=window.CITY_LAYOUT;if(S&&S.places&&S.places.length&&S.roads&&S.roads.length)return S;return null;}
function miniDistCol(id){const M={HOMESTEAD:'#7dff6b',CAR_ROW:'#ffb020',STAGE:'#ff4fd8',BUILDER_BAY:'#3ee6ff',TRACK:'#ff9a2e',FIELD:'#7dfff2',RIVERBANK:'#9ad7ff',DECK:'#c084fc'};if(M[id])return M[id];let h=0;const s=String(id||'');for(let i=0;i<s.length;i++)h=(h*33+s.charCodeAt(i))>>>0;return ['#7dff6b','#ffb020','#ff4fd8','#3ee6ff','#ff9a2e','#7dfff2','#c084fc','#ffe14d'][h%8];}
function miniKind(p){return (p&&(p.kind||p.type))||'';}
function miniAnchor(L,key){if(!L)return null;if(L[key]&&typeof L[key]==='object')return L[key];return L.anchors&&L.anchors[key];}
function miniAir(){const r=miniAnchor(miniLayout(),'runway');if(r&&isFinite(r.x0)&&isFinite(r.x1)&&isFinite(r.z0)&&isFinite(r.z1))return[(r.x0+r.x1)/2,(r.z0+r.z1)/2];return[0,730];}
function miniTrackPts(tr){if(!tr||!isFinite(tr.cx)||!isFinite(tr.cz))return null;const R=tr.R||tr.rx;if(!isFinite(R))return null;const len=tr.L!=null?tr.L:(tr.ry!=null?tr.ry*2:R*2),h=len/2,nb=10,o=[];
  for(let i=0;i<=6;i++)o.push([tr.cx+R,tr.cz-h+len*i/6]);
  for(let i=1;i<nb;i++){const a=Math.PI*i/nb;o.push([tr.cx+R*Math.cos(a),tr.cz+h+R*Math.sin(a)]);}
  for(let i=0;i<=6;i++)o.push([tr.cx-R,tr.cz+h-len*i/6]);
  for(let i=1;i<nb;i++){const a=Math.PI+Math.PI*i/nb;o.push([tr.cx+R*Math.cos(a),tr.cz-h+R*Math.sin(a)]);}
  return o;}
// Mains stay on the map, one icon each. Extras are the repeated small shops: one icon per type per district.
const MINI_MAIN={home:1,pets:1,garage:1,tower:1,deck:1,show:1,paint:1,cafe:1,dance:1,arcade:1,builder:1,soccer:1,arch:1};
const MINI_EXTRA={nos:1,kitnos:1,bay:1,pad:1,snack:1};
function miniExtraType(p){const k=miniKind(p);return k==='kitnos'?'nos':k;}
function miniPlaceKey(p){return (p.district||'')+'|'+(p.station||'')+'|'+(p.name||'');}
let miniExtraPick=null;
function miniExtraSet(){if(miniExtraPick)return miniExtraPick;const L=miniLayout(),list=(L&&((L.minimap&&L.minimap.places)||L.places))||[];if(!list.length)return {};const best={};for(const p of list){const k=miniKind(p);if(!MINI_EXTRA[k])continue;const key=(p.district||'')+':'+miniExtraType(p),area=Math.abs((p.x1-p.x0)*(p.z1-p.z0));if(!best[key]||area>best[key].area)best[key]={key:miniPlaceKey(p),area};}miniExtraPick={};for(const k in best)miniExtraPick[best[k].key]=1;return miniExtraPick;}
function miniShowPlace(p){const k=miniKind(p);if(MINI_MAIN[k]||p.landmark)return true;if(MINI_EXTRA[k])return !!miniExtraSet()[miniPlaceKey(p)];return false;}
function miniSameLabel(a,b){const n=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');const x=n(a),y=n(b);return !!x&&(x===y||x.indexOf(y)>=0||y.indexOf(x)>=0);}
function miniGlyph(p,d){const kind=miniKind(p),r=d/2,disc=(fill,edge)=>{ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fillStyle=fill;ctx.fill();ctx.lineWidth=1.35;ctx.strokeStyle=edge;ctx.stroke();};
  if(kind==='nos'||kind==='kitnos'){disc('#1a1404','#ffe14d');ctx.beginPath();ctx.moveTo(r*.12,-r*.62);ctx.lineTo(-r*.42,-r*.05);ctx.lineTo(-r*.08,-r*.05);ctx.lineTo(-r*.18,r*.58);ctx.lineTo(r*.42,r*.02);ctx.lineTo(r*.06,r*.02);ctx.closePath();ctx.fillStyle='#fff6c8';ctx.fill();return;}
  if(kind==='pad'){ctx.beginPath();ctx.moveTo(0,-r);ctx.lineTo(r*.82,0);ctx.lineTo(0,r);ctx.lineTo(-r*.82,0);ctx.closePath();ctx.fillStyle='rgba(6,18,28,.94)';ctx.fill();ctx.strokeStyle='#3ee6ff';ctx.lineWidth=1.4;ctx.stroke();ctx.beginPath();ctx.moveTo(0,r*.28);ctx.lineTo(0,-r*.42);ctx.moveTo(-r*.28,-r*.08);ctx.lineTo(0,-r*.42);ctx.lineTo(r*.28,-r*.08);ctx.strokeStyle='#e9fbff';ctx.lineWidth=1.3;ctx.stroke();return;}
  if(kind==='bay'||kind==='garage'){hrr(ctx,-r,-r*.72,r*2,r*1.5,2);ctx.fillStyle='rgba(22,12,4,.94)';ctx.fill();ctx.strokeStyle='#ffb020';ctx.lineWidth=1.35;ctx.stroke();hT(ctx,kind==='garage'?'G':'P',0,r*.38,Math.max(8,r*1.2),'#ffe7b0','center',H_FONT,900);return;}
  if(kind==='home'){ctx.beginPath();ctx.moveTo(0,-r);ctx.lineTo(r*.9,-r*.12);ctx.lineTo(r*.55,-r*.12);ctx.lineTo(r*.55,r*.72);ctx.lineTo(-r*.55,r*.72);ctx.lineTo(-r*.55,-r*.12);ctx.lineTo(-r*.9,-r*.12);ctx.closePath();ctx.fillStyle='rgba(6,22,12,.94)';ctx.fill();ctx.strokeStyle='#7dff6b';ctx.lineWidth=1.35;ctx.stroke();return;}
  if(kind==='dance'){disc('#1a0814','#ff4fd8');ctx.fillStyle='#ffd6f4';ctx.strokeStyle='#ffd6f4';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(-r*.2,r*.28,r*.2,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(-r*.02,r*.28);ctx.lineTo(-r*.02,-r*.42);ctx.lineTo(r*.38,-r*.62);ctx.lineTo(r*.38,-r*.28);ctx.lineTo(-r*.02,-r*.1);ctx.stroke();return;}
  if(kind==='builder'){disc('#06140c','#7dff6b');hT(ctx,'B',0,r*.38,Math.max(8,r*1.15),'#e9ffe4','center',H_FONT,900);return;}
  if(kind==='soccer'){if(POI.ball){ctx.imageSmoothingEnabled=true;ctx.drawImage(POI.ball,-r,-r,r*2,r*2);}return;}
  if(kind==='arch'){ctx.strokeStyle=p.c||'#f4fbff';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-r*.75,r*.55);ctx.lineTo(-r*.75,-r*.15);ctx.quadraticCurveTo(0,-r*.95,r*.75,-r*.15);ctx.lineTo(r*.75,r*.55);ctx.stroke();return;}
  ctx.beginPath();ctx.arc(0,0,Math.max(3.2,r*.7),0,7);ctx.fillStyle=p.c||'#3ee6ff';ctx.fill();ctx.lineWidth=1;ctx.strokeStyle='#f4fbff';ctx.stroke();}
function miniPlaces(cx,cy,mw,mh,yaw,ppm,span){const L=miniLayout();if(!L)return;poiBake();const pad=12,hx=mw/2-pad,hy=mh/2-pad,co=Math.cos(yaw),si=Math.sin(yaw),tr=miniAnchor(L,'track');
  if(tr&&isFinite(tr.cx)&&isFinite(tr.cz)){const[sx,sy,out]=miniSpot(tr.cx,tr.cz,co,si,ppm,hx,hy);ctx.save();ctx.globalAlpha=out?.85:1;ctx.translate(cx+sx,cy+sy);ctx.fillStyle='#ff4fd8';ctx.fillRect(-1.1,-8,2.2,14);ctx.beginPath();ctx.moveTo(1.1,-8);ctx.lineTo(8,-4.2);ctx.lineTo(1.1,-1);ctx.closePath();ctx.fill();ctx.restore();}
  const list=(L.minimap&&L.minimap.places)||L.places||[];
  for(const p of list){if(!miniShowPlace(p))continue;const mx=isFinite(p.cx)?p.cx:(p.x0+p.x1)/2,mz=isFinite(p.cz)?p.cz:(p.z0+p.z1)/2;if(!isFinite(mx)||!isFinite(mz))continue;const main=!!(MINI_MAIN[miniKind(p)]||p.landmark),d=main?(span>1400?13:16):11,[sx,sy,out]=miniSpot(mx,mz,co,si,ppm,hx,hy);ctx.save();ctx.globalAlpha=out?.85:1;ctx.translate(cx+sx,cy+sy);miniGlyph(p,d);if(!main&&span<700){const tag=String(p.sign||p.name||'').slice(0,8);let repeat=false;const dists=(L.minimap&&L.minimap.districts)||L.districts||[];for(const dist of dists)if(miniSameLabel(tag,dist.label)||miniSameLabel(tag,dist.id))repeat=true;if(tag&&!repeat)hT(ctx,tag,0,-d*.7-1,7,p.c||'#f4fbff','center',H_FONT,800,2);}ctx.restore();}}
function miniOnSeg(r,x,z){const x0=Math.min(r.x0,r.x1),x1=Math.max(r.x0,r.x1),z0=Math.min(r.z0,r.z1),z1=Math.max(r.z0,r.z1);if(Math.abs(r.x0-r.x1)<1.5){const zz=Math.max(z0,Math.min(z1,z));return{x:r.x0,z:zz,d:Math.hypot(x-r.x0,z-zz)};}if(Math.abs(r.z0-r.z1)<1.5){const xx=Math.max(x0,Math.min(x1,x));return{x:xx,z:r.z0,d:Math.hypot(x-xx,z-r.z0)};}return null;}
function miniDistrictPoint(d,L){const roads=((L.minimap&&L.minimap.roads)||L.roads||[]).filter(r=>r&&!r.spur&&(r.kind==='street'||r.kind==='lane'));const mx=(d.x0+d.x1)/2,mz=(d.z0+d.z1)/2;let best=null;for(const r of roads){const hit=miniOnSeg(r,mx,mz);if(!hit)continue;const inside=hit.x>=Math.min(d.x0,d.x1)&&hit.x<=Math.max(d.x0,d.x1)&&hit.z>=Math.min(d.z0,d.z1)&&hit.z<=Math.max(d.z0,d.z1);if(!inside)continue;const score=(r.kind==='street'?0:100)+hit.d;if(!best||score<best.score)best={x:hit.x,z:hit.z,score};}return best||{x:mx,z:mz};}
function miniDistricts(cx,cy,mw,mh,yaw,ppm){const L=miniLayout();if(!L)return;const list=(L.minimap&&L.minimap.districts)||L.districts;if(!list)return;const co=Math.cos(yaw),si=Math.sin(yaw),pad=14,hx=mw/2-pad,hy=mh/2-pad;
  for(const d of list){if(!d||!isFinite(d.x0)||!isFinite(d.x1)||!isFinite(d.z0)||!isFinite(d.z1))continue;const w=Math.abs(d.x1-d.x0)*ppm,h=Math.abs(d.z1-d.z0)*ppm;if(Math.max(w,h)<52)continue;const at=miniDistrictPoint(d,L),dx=at.x-P.x,dz=at.z-P.z,sx=(dx*co-dz*si)*ppm,sy=(-dx*si-dz*co)*ppm;if(Math.abs(sx)>hx||Math.abs(sy)>hy)continue;ctx.save();ctx.translate(cx+sx,cy+sy);hT(ctx,String(d.label||d.id||''),0,3,Math.max(8,Math.min(12,Math.max(w,h)/12)),miniDistCol(d.id),'center',H_FONT,800,3);ctx.restore();}}
function miniWxLabels(cx,cy,mw,mh,yaw,ppm,span){
  if(window.ZD_KILL&&ZD_KILL.weather)return;
  var __p=window.ZD_PERF,__t=__p?performance.now():0;
  const L=miniLayout();if(!L||!L.weather||span<1200)return;const co=Math.cos(yaw),si=Math.sin(yaw),pad=14,hx=mw/2-pad,hy=mh/2-pad;
  for(const b of L.weather){if(!b||!isFinite(b.x0)||!isFinite(b.z0)||!b.name)continue;const mx=(b.x0+b.x1)/2,mz=(b.z0+b.z1)/2,dx=mx-P.x,dz=mz-P.z,sx=(dx*co-dz*si)*ppm,sy=(-dx*si-dz*co)*ppm;if(Math.abs(sx)>hx||Math.abs(sy)>hy)continue;ctx.save();ctx.globalAlpha=.72;ctx.translate(cx+sx,cy+sy);hT(ctx,String(b.name),0,3,8,'#d5e6ff','center',H_FONT,700,2);ctx.restore();}
  if(__p){try{var __d=performance.now()-__t;__p.add('weather',__d);__p.add('minimap',-__d);}catch(e){window.ZD_PERF=null;}}
}
// Giant dome. A live big pitch wins. Otherwise the layout field anchor. The old dome is only the fallback when neither exists.
function miniField(){const L=miniLayout(),A=miniAnchor(L,'field')||(L&&L.field),live=(typeof SOCCER!=='undefined'&&SOCCER.field)||null,box=src=>{const cx=src.cx,cz=src.cz,hw=src.hw||52,hl=src.hl||80;return {cx,cz,hw,hl,x0:isFinite(src.x0)?src.x0:cx-hw,x1:isFinite(src.x1)?src.x1:cx+hw,z0:isFinite(src.z0)?src.z0:cz-hl,z1:isFinite(src.z1)?src.z1:cz+hl,goalW:src.goalW,goalD:src.goalD,domeRx:src.domeRx||src.domeHw||src.rx,domeRz:src.domeRz||src.domeHl||src.ry,roadX0:isFinite(src.roadX0)?src.roadX0:NaN,tunW:src.tunW||src.roadW};};
  if(live&&isFinite(live.cx)&&isFinite(live.hw)&&live.hw>=40)return box(live);
  if(A&&isFinite(A.cx)){const cz=A.cz!=null?A.cz:A.z,rx=A.rx||A.domeRx||A.hw||80,ry=A.ry||A.domeRz||A.hl||60,hw=A.hw||rx*.62,hl=A.hl||ry*.72;return box({cx:A.cx,cz,hw,hl,x0:A.x0,x1:A.x1,z0:A.z0,z1:A.z1,goalW:A.goalW,goalD:A.goalD,domeRx:rx,domeRz:ry,roadX0:A.roadX0,tunW:A.tunW});}
  return box({cx:830,cz:300,hw:52,hl:80,x0:778,x1:882,z0:220,z1:380,roadX0:560});}
function miniFitPitch(){if(MINI.fit)return;MINI.fit=1;const F=miniField(),pad=24,rx=F.domeRx||F.hw+24,rz=F.domeRz||F.hl+20,road=isFinite(F.roadX0)?F.roadX0:F.cx,x0=Math.min(road,F.cx-rx)-pad,x1=Math.max(F.x1,F.cx+rx)+pad,z0=F.cz-rz-pad,z1=F.cz+rz+pad;if(x0<MINI.X0)MINI.X0=x0;if(x1>MINI.X1)MINI.X1=x1;if(z0<MINI.Z0)MINI.Z0=z0;if(z1>MINI.Z1)MINI.Z1=z1;}
function miniDome(ppm){const F=miniField(),cx=(F.cx-P.x)*ppm,cy=-(F.cz-P.z)*ppm,rx=(F.domeRx||F.hw+24)*ppm,rz=(F.domeRz||F.hl+20)*ppm;
  ctx.save();ctx.lineJoin='round';
  ctx.beginPath();ctx.ellipse(cx,cy,Math.max(rx,1),Math.max(rz,1),0,0,7);ctx.lineWidth=2;ctx.strokeStyle='#7dfff2';ctx.shadowColor='#3ee6ff';ctx.shadowBlur=7;ctx.stroke();
  ctx.beginPath();ctx.ellipse(cx,cy,Math.max(rx*.9,1),Math.max(rz*.9,1),0,0,7);ctx.lineWidth=1.15;ctx.strokeStyle='#3ee6ff';ctx.stroke();ctx.shadowBlur=0;
  if(isFinite(F.roadX0)&&F.x0>F.roadX0+4){const half=(F.tunW>2?F.tunW:16)/2,tx=(F.roadX0-P.x)*ppm,ty=-(F.cz+half-P.z)*ppm,tw=Math.max(0,F.x0-F.roadX0)*ppm,th=half*2*ppm;
  ctx.fillStyle='rgba(10,28,48,.82)';ctx.fillRect(tx,ty,tw,th);ctx.setLineDash([5,3]);ctx.strokeStyle='#ffb020';ctx.lineWidth=1.4;ctx.strokeRect(tx,ty,tw,th);ctx.setLineDash([]);}
  const px=(F.x0-P.x)*ppm,py=-(F.z1-P.z)*ppm,pw=(F.x1-F.x0)*ppm,ph=(F.z1-F.z0)*ppm;
  ctx.fillStyle='rgba(7,48,32,.9)';ctx.fillRect(px,py,pw,ph);ctx.strokeStyle='#3ee6ff';ctx.lineWidth=1.7;ctx.strokeRect(px,py,pw,ph);
  ctx.beginPath();ctx.moveTo(px,cy);ctx.lineTo(px+pw,cy);ctx.stroke();
  const gw=F.goalW>4?F.goalW:Math.min((F.x1-F.x0)*.34,36),gd=F.goalD>1?F.goalD:10,gx0=F.cx-gw/2,gx1=F.cx+gw/2;
  const goal=(z,sign,col)=>{ctx.beginPath();ctx.moveTo((gx0-P.x)*ppm,-(z-P.z)*ppm);ctx.lineTo((gx0-P.x)*ppm,-(z+sign*gd-P.z)*ppm);ctx.lineTo((gx1-P.x)*ppm,-(z+sign*gd-P.z)*ppm);ctx.lineTo((gx1-P.x)*ppm,-(z-P.z)*ppm);ctx.strokeStyle=col;ctx.lineWidth=2;ctx.stroke();};
  goal(F.z0,-1,'#ff4fd8');goal(F.z1,1,'#7dfff2');
  const st=typeof SOCCER!=='undefined'&&SOCCER.state;if(st&&isFinite(st.x)&&isFinite(st.z)){ctx.beginPath();ctx.arc((st.x-P.x)*ppm,-(st.z-P.z)*ppm,3,0,7);ctx.fillStyle='#f4f7fb';ctx.fill();ctx.lineWidth=1.3;ctx.strokeStyle='#141414';ctx.stroke();}
  ctx.restore();}
function miniPlaceCol(p){if(!p)return'#3ee6ff';if(p.kind==='arch'||p.type==='arch')return'#ff4fd8';if(p.purpose==='NOS')return'#ffe14d';if(p.purpose==='GARAGE')return'#ffb020';if(p.purpose==='SKY_DROP')return'#3ee6ff';if(p.purpose==='SNACK'||p.purpose==='CAFE')return'#ff9a2e';return p.c||'#7dff6b';}
function miniBake(){if(MINI.cv||typeof CITY==='undefined')return;const L=CITY.LAYOUT,M=L&&L.minimap,B=M&&M.bounds||L&&L.bounds;if(B){const pad=48;MINI.X0=B.x0-pad;MINI.X1=B.x1+pad;MINI.Z0=B.z0-pad;MINI.Z1=B.z1+pad;}miniFitPitch();const S=MINI.S,w=Math.ceil((MINI.X1-MINI.X0)*S),h=Math.ceil((MINI.Z1-MINI.Z0)*S),cv=document.createElement('canvas');cv.width=w;cv.height=h;const c=cv.getContext('2d'),X=x=>(x-MINI.X0)*S,Y=z=>(MINI.Z1-z)*S,C=CITY;
  c.fillStyle='#070314';c.fillRect(0,0,w,h);
  const dists=(M&&M.districts)||(L&&L.districts)||C.DISTRICTS||[];
  for(const d of dists){if(!d||!isFinite(d.x0)||!isFinite(d.z0))continue;const col=miniDistCol(d.id);c.fillStyle=miniHex(col,.16);c.fillRect(X(Math.min(d.x0,d.x1)),Y(Math.max(d.z0,d.z1)),Math.abs(d.x1-d.x0)*S,Math.abs(d.z1-d.z0)*S);c.strokeStyle=miniHex(col,.55);c.lineWidth=1;c.strokeRect(X(Math.min(d.x0,d.x1)),Y(Math.max(d.z0,d.z1)),Math.abs(d.x1-d.x0)*S,Math.abs(d.z1-d.z0)*S);}
  const riv=(M&&M.river)||(L&&L.river)||(L&&L.anchors&&L.anchors.river)||C.RIV;if(riv&&isFinite(riv.z0)&&isFinite(riv.z1)){const z0=Math.min(riv.z0,riv.z1),z1=Math.max(riv.z0,riv.z1);c.fillStyle='rgba(8,40,90,.95)';c.fillRect(0,Y(z1),w,(z1-z0)*S);}
  for(const band of (L&&L.weather)||[]){if(!band||!isFinite(band.x0)||!isFinite(band.z0))continue;c.save();c.setLineDash([4,3]);c.fillStyle='rgba(186,214,255,.06)';c.strokeStyle='rgba(210,226,255,.32)';c.lineWidth=1;c.fillRect(X(Math.min(band.x0,band.x1)),Y(Math.max(band.z0,band.z1)),Math.abs(band.x1-band.x0)*S,Math.abs(band.z1-band.z0)*S);c.strokeRect(X(Math.min(band.x0,band.x1)),Y(Math.max(band.z0,band.z1)),Math.abs(band.x1-band.x0)*S,Math.abs(band.z1-band.z0)*S);c.restore();}
  c.fillStyle='rgba(10,60,30,.85)';c.fillRect(X(C.PARK.x0),Y(C.PARK.z1),(C.PARK.x1-C.PARK.x0)*S,(C.PARK.z1-C.PARK.z0)*S);
  const segs=(M&&M.roads)||(L&&L.roads)||[];
  const strokeSeg=(r,col,lw)=>{if(!r)return;c.beginPath();c.moveTo(X(r.x0),Y(r.z0));c.lineTo(X(r.x1),Y(r.z1));c.strokeStyle=col;c.lineWidth=lw;c.stroke();};
  if(segs.length){for(const r of segs){const k=r.kind;if(k==='water')strokeSeg(r,'rgba(64,150,235,.95)',2.2);else if(k==='highway'||k==='bridge'||k==='tunnel')strokeSeg(r,'#ffb020',2.2);else if(k==='track')strokeSeg(r,'#ff4fd8',1.6);else if(k==='lane')strokeSeg(r,'rgba(125,255,242,.8)',1.25);else strokeSeg(r,'rgba(62,230,255,.9)',Math.max(1.1,(r.w||20)*S*0.45));}}
  else{const N=C.ROADS.nodes;c.beginPath();for(const e of C.ROADS.edges){if(!e)continue;const A=N[e.a],B=N[e.b];c.moveTo(X(A.x),Y(A.z));c.lineTo(X(B.x),Y(B.z));}c.strokeStyle='rgba(62,230,255,.8)';c.lineWidth=1.35;c.stroke();}
  const bridges=(M&&M.bridges)||(L&&L.bridges)||(L&&L.anchors&&L.anchors.bridges)||[];c.fillStyle='rgba(255,176,32,.72)';for(const b of bridges){if(!b||!isFinite(b.x0)||!isFinite(b.z0))continue;c.fillRect(X(Math.min(b.x0,b.x1)),Y(Math.max(b.z0,b.z1)),Math.abs(b.x1-b.x0)*S,Math.abs(b.z1-b.z0)*S);}
  const tr=miniAnchor(L,'track');const tpts=tr&&miniTrackPts(tr);if(tpts){c.beginPath();tpts.forEach((p,i)=>i?c.lineTo(X(p[0]),Y(p[1])):c.moveTo(X(p[0]),Y(p[1])));c.closePath();c.strokeStyle='#ff4fd8';c.lineWidth=Math.max(1.4,(tr.w||18)*S*.45);c.stroke();}
  c.strokeStyle='#ffb020';c.lineWidth=1.5;c.strokeRect(X(C.TAXI.x0),Y(C.TAXI.z1),(C.TAXI.x1-C.TAXI.x0)*S,(C.TAXI.z1-C.TAXI.z0)*S);
  const places=(M&&M.places)||(L&&L.places)||[];
  for(const p of places){if(!p||!isFinite(p.x0)||!isFinite(p.z0))continue;const bw=p.x1-p.x0,bd=p.z1-p.z0,col=miniPlaceCol(p);if(miniKind(p)==='arch'){c.strokeStyle=col;c.lineWidth=1.4;c.strokeRect(X(Math.min(p.x0,p.x1)),Y(Math.max(p.z0,p.z1)),Math.abs(bw)*S,Math.abs(bd)*S);continue;}c.fillStyle='#07080c';c.strokeStyle=col;c.lineWidth=1;c.fillRect(X(Math.min(p.x0,p.x1)),Y(Math.max(p.z0,p.z1)),Math.max(1.2,Math.abs(bw)*S),Math.max(1.2,Math.abs(bd)*S));c.strokeRect(X(Math.min(p.x0,p.x1)),Y(Math.max(p.z0,p.z1)),Math.max(1.2,Math.abs(bw)*S),Math.max(1.2,Math.abs(bd)*S));}
  const rw=miniAnchor(L,'runway');if(rw&&isFinite(rw.x0)&&isFinite(rw.z0)&&isFinite(rw.x1)&&isFinite(rw.z1)){const x0=Math.min(rw.x0,rw.x1),x1=Math.max(rw.x0,rw.x1),z0=Math.min(rw.z0,rw.z1),z1=Math.max(rw.z0,rw.z1),mx=(x0+x1)/2;c.fillStyle='rgba(62,230,255,.5)';c.fillRect(X(x0),Y(z1),(x1-x0)*S,(z1-z0)*S);c.strokeStyle='#e9fbff';c.lineWidth=2;c.strokeRect(X(x0),Y(z1),(x1-x0)*S,(z1-z0)*S);c.strokeStyle='rgba(255,255,255,.92)';c.lineWidth=1.1;c.beginPath();for(let z=z0;z<z1;z+=70){c.moveTo(X(mx),Y(z));c.lineTo(X(mx),Y(Math.min(z1,z+28)));}c.stroke();}
  c.fillStyle='#ff9a2e';for(const r of C.RAMPS){if(r.hid||r.yb>0||r.nm==='tow')continue;c.fillRect(X((r.x0+r.x1)/2)-1.3,Y((r.z0+r.z1)/2)-1.3,2.6,2.6);}
  MINI.cv=cv;MINI.layoutId=L&&L.id||'';}
let miniSpan=0;
const ZICON_W=.45; // visible car width ÷ sprite. Street width uses this.
function miniTune(){return window.MINIMAP_TUNE||{spanClose:300,spanFar:3400,altClose:24,altFar:240,ease:.8,street:20,iconMin:20,poiPx:20,hotPulse:.16,hotMs:110};}
function miniZoom(dt){const T=miniTune(),y=Math.max(0,P.y||0),den=(T.altFar||240)-(T.altClose||24),u=den>0?clamp((y-(T.altClose||24))/den,0,1):0,e=u*u*(3-2*u),target=(T.spanClose||300)+((T.spanFar||3400)-(T.spanClose||300))*e;
  if(!miniSpan){miniSpan=target;return miniSpan;}
  const k=1-Math.exp(-Math.min(Math.max(dt,0),.1)/Math.max(.05,T.ease||.8));miniSpan+=(target-miniSpan)*k;return miniSpan;}
function miniIconPx(mw,span){const T=miniTune(),px=(T.street||20)/span*mw;return Math.max(T.iconMin||20,px/ZICON_W);}
const POI={plane:null,ball:null,hotdrop:null};
function poiBake(){if(POI.plane)return;const N=128,disc=(glow,edge)=>{const cv=document.createElement('canvas');cv.width=cv.height=N;const c=cv.getContext('2d');c.beginPath();c.arc(64,64,54,0,7);c.fillStyle='rgba(8,4,20,0.92)';c.fill();c.lineWidth=7;c.strokeStyle=glow;c.shadowColor=glow;c.shadowBlur=14;c.stroke();c.shadowBlur=0;c.lineWidth=3;c.strokeStyle=edge;c.stroke();return c;};
  const star=(c,r0,r1)=>{c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rad=i%2?r0:r1,x=64+Math.cos(a)*rad,y=64+Math.sin(a)*rad;i?c.lineTo(x,y):c.moveTo(x,y);}c.closePath();};
  const pc=disc('#3ee6ff','#e9fbff');pc.save();pc.beginPath();pc.arc(64,64,50,0,7);pc.clip();pc.fillStyle='#f4fbff';pc.strokeStyle='#3ee6ff';pc.lineJoin='round';pc.lineWidth=5;
  pc.beginPath();pc.moveTo(64,18);pc.quadraticCurveTo(76,46,73,86);pc.lineTo(68,108);pc.quadraticCurveTo(64,114,60,108);pc.lineTo(55,86);pc.quadraticCurveTo(52,46,64,18);pc.closePath();pc.fill();pc.stroke();
  pc.beginPath();pc.moveTo(60,48);pc.lineTo(16,78);pc.lineTo(22,90);pc.lineTo(58,70);pc.lineTo(70,70);pc.lineTo(106,90);pc.lineTo(112,78);pc.lineTo(68,48);pc.closePath();pc.fill();pc.stroke();
  pc.beginPath();pc.moveTo(57,92);pc.lineTo(34,108);pc.lineTo(40,116);pc.lineTo(64,104);pc.lineTo(88,116);pc.lineTo(94,108);pc.lineTo(71,92);pc.closePath();pc.fill();pc.stroke();pc.restore();
  POI.plane=pc.canvas;
  const bc=disc('#7dff6b','#3ee6ff');bc.beginPath();bc.arc(64,64,36,0,7);bc.fillStyle='#f7f7f7';bc.fill();bc.lineWidth=4;bc.strokeStyle='#141414';bc.stroke();
  bc.beginPath();for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5,x=64+Math.cos(a)*16,y=64+Math.sin(a)*16;i?bc.lineTo(x,y):bc.moveTo(x,y);}bc.closePath();bc.fillStyle='#141414';bc.fill();
  bc.lineWidth=4;bc.strokeStyle='#141414';for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5,b=a+Math.PI/5;bc.beginPath();bc.moveTo(64+Math.cos(a)*16,64+Math.sin(a)*16);bc.quadraticCurveTo(64+Math.cos(b)*26,64+Math.sin(b)*26,64+Math.cos(a)*34,64+Math.sin(a)*34);bc.stroke();}
  bc.beginPath();for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5+Math.PI/5,x=64+Math.cos(a)*30,y=64+Math.sin(a)*30;i?bc.lineTo(x,y):bc.moveTo(x,y);}bc.closePath();bc.lineWidth=3;bc.stroke();
  POI.ball=bc.canvas;
  const hc=disc('#ffe14d','#3ee6ff');hc.save();hc.beginPath();hc.arc(64,64,48,0,7);hc.clip();star(hc,14,34);hc.fillStyle='#ffe14d';hc.strokeStyle='#fff';hc.lineJoin='round';hc.lineWidth=4;hc.fill();hc.stroke();star(hc,6,15);hc.fillStyle='#fff8d4';hc.fill();hc.restore();
  POI.hotdrop=hc.canvas;}
function miniSpot(lx,lz,co,si,ppm,hx,hy){const dx=lx-P.x,dz=lz-P.z;let sx=(dx*co-dz*si)*ppm,sy=(-dx*si-dz*co)*ppm,out=Math.abs(sx)>hx||Math.abs(sy)>hy;if(out){const t=1/Math.max(Math.abs(sx)/hx,Math.abs(sy)/hy);sx*=t;sy*=t;}return[sx,sy,out];}
// window.HOTDROP is the live beacon. P.hotDrop / P.hotDropNosT are the same countdown if physics stamps them on the car.
function miniHot(){const H=window.HOTDROP,nos=P&&+P.hotDropNosT>0?+P.hotDropNosT:0,ph=P&&P.hotDrop;
  if(H&&((H.active&&H.tLeft>0)||H.overchargeT>0))return nos>0&&!(H.overchargeT>0)?{active:H.active,x:H.x,z:H.z,tLeft:H.tLeft,maxT:H.maxT||25,overchargeT:nos}:H;
  if(ph&&typeof ph==='object'){const tLeft=ph.tLeft!=null?+ph.tLeft:+ph.t||0,over=ph.overchargeT>0?+ph.overchargeT:nos,active=ph.active!=null?!!ph.active:tLeft>0;if(active||over>0)return{active,x:+ph.x||0,z:+ph.z||0,tLeft,maxT:ph.maxT||25,overchargeT:over};}
  if(typeof ph==='number'&&ph>0)return{active:true,x:P.x,z:P.z,tLeft:ph,maxT:25,overchargeT:nos};
  if(nos>0)return{active:false,x:P.x,z:P.z,tLeft:0,maxT:25,overchargeT:nos};
  return H||null;}
function miniPois(cx,cy,mw,mh,yaw,ppm){poiBake();const T=miniTune(),px=T.poiPx||20,pad=12,hx=mw/2-pad,hy=mh/2-pad,co=Math.cos(yaw),si=Math.sin(yaw);
  const air=miniAir(),Fd=miniField(),marks=[[air[0],air[1],POI.plane,-yaw],[Fd.cx,Fd.cz,POI.ball,0]];
  for(const[lx,lz,spr,rot]of marks){const[sx,sy,out]=miniSpot(lx,lz,co,si,ppm,hx,hy);
    ctx.save();ctx.globalAlpha=out?.85:1;ctx.translate(cx+sx,cy+sy);if(rot)ctx.rotate(rot);ctx.imageSmoothingEnabled=true;ctx.drawImage(spr,-px/2,-px/2,px,px);ctx.restore();}
  const H=miniHot();if(H&&H.active){const[sx,sy,out]=miniSpot(H.x,H.z,co,si,ppm,hx,hy),pulse=1+(T.hotPulse||.16)*Math.sin(performance.now()/(T.hotMs||110)),d=px*pulse;
    ctx.save();ctx.globalAlpha=out?.85:1;ctx.translate(cx+sx,cy+sy);ctx.beginPath();ctx.arc(0,0,d*.62,0,7);ctx.lineWidth=2;ctx.strokeStyle=H_YEL;ctx.shadowColor=H_YEL;ctx.shadowBlur=12;ctx.stroke();ctx.shadowBlur=0;ctx.imageSmoothingEnabled=true;ctx.drawImage(POI.hotdrop,-d/2,-d/2,d,d);ctx.restore();}}
function miniZoneBox(){const C=typeof CITY!=='undefined'?CITY:null,Z=C&&C.BUILDER_ZONE;return Z&&isFinite(Z.x0)?Z:{x0:-400,x1:540,z0:1860,z1:2100,label:'BUILDER'};}
function miniZone(ppm){const Z=miniZoneBox(),w=(Z.x1-Z.x0)*ppm,h=(Z.z1-Z.z0)*ppm,x=(Z.x0-P.x)*ppm,y=-(Z.z1-P.z)*ppm;
  ctx.save();ctx.setLineDash([6,4]);ctx.lineWidth=1.8;ctx.strokeStyle='#7dff6b';ctx.shadowColor='#7dff6b';ctx.shadowBlur=6;ctx.strokeRect(x,y,w,h);
  ctx.lineWidth=1.15;ctx.strokeStyle='#3ee6ff';ctx.shadowColor='#3ee6ff';ctx.strokeRect(x+1.1,y+1.1,Math.max(0,w-2.2),Math.max(0,h-2.2));ctx.restore();}
function miniZoneLabel(cx,cy,mw,mh,yaw,ppm){const Z=miniZoneBox(),pad=14,hx=mw/2-pad,hy=mh/2-pad,[sx,sy,out]=miniSpot((Z.x0+Z.x1)/2,(Z.z0+Z.z1)/2,Math.cos(yaw),Math.sin(yaw),ppm,hx,hy);
  ctx.save();ctx.globalAlpha=out?.85:1;ctx.translate(cx+sx,cy+sy);hT(ctx,String(Z.label||'BUILDER'),0,3,9,'#e9fbff','center',H_FONT,800,4);ctx.restore();}
function miniIsPurp(b){return !!(b&&b.purpose&&(b.kind==='b'||b.kind==='landmark'));}
function miniTag(b){const p=b.purpose,raw=typeof p==='string'?p:(p.tag||p.short||p.label||p.name||'');const s=String(raw||'').trim();return s?s.slice(0,10):'';}
function miniPurp(ppm,lim){if(typeof CITY==='undefined'||!CITY.BL)return;for(const b of CITY.BL){if(!miniIsPurp(b))continue;const mx=(b.x0+b.x1)/2,mz=(b.z0+b.z1)/2;if(Math.abs(mx-P.x)>lim||Math.abs(mz-P.z)>lim)continue;
  const x=(b.x0-P.x)*ppm,y=-(b.z1-P.z)*ppm,w=(b.x1-b.x0)*ppm,h=(b.z1-b.z0)*ppm,col=b.c||'#3ee6ff';
  ctx.save();ctx.strokeStyle=col;ctx.shadowColor=col;ctx.shadowBlur=4;ctx.lineWidth=1.8;ctx.strokeRect(x,y,w,h);ctx.shadowBlur=0;ctx.fillStyle='#f7fbff';ctx.beginPath();ctx.arc(x+w/2,y+h/2,Math.max(1.5,Math.min(3,Math.min(w,h)*.22)),0,7);ctx.fill();ctx.restore();}}
function miniGap(b,x,z){const dx=x<b.x0?b.x0-x:x>b.x1?x-b.x1:0,dz=z<b.z0?b.z0-z:z>b.z1?z-b.z1:0;return Math.hypot(dx,dz);}
function miniActor(){const foot=typeof WALK_MODE!=='undefined'&&WALK_MODE.onFoot;return {x:foot?+WALK_MODE.x:P.x,z:foot?+WALK_MODE.z:P.z,close:!!(foot||P.driveMode==='street')};}
// Real b.parking wins. Otherwise a small side (east) or rear (south) bay while the player is within 260 m.
function miniParkOf(b){const p=b&&b.parking;if(p&&isFinite(p.x0)&&isFinite(p.x1)&&isFinite(p.z0)&&isFinite(p.z1))return p;
  const a=miniActor();if(miniGap(b,a.x,a.z)>260)return null;const mx=(b.x0+b.x1)/2,mz=(b.z0+b.z1)/2,bay=Math.min(16,Math.max(9,Math.min(b.x1-b.x0,b.z1-b.z0)*.4)),depth=8;
  if((b.id|0)%2)return {type:'lot',x0:mx-bay/2,x1:mx+bay/2,z0:b.z0-depth,z1:b.z0,doorX:mx,doorZ:b.z0-depth*.5};
  return {type:'garage',x0:b.x1,x1:b.x1+depth,z0:mz-bay/2,z1:mz+bay/2,doorX:b.x1+depth*.5,doorZ:mz};}
function miniPark(ppm,lim){if(typeof CITY==='undefined'||!CITY.BL)return;for(const b of CITY.BL){if(!miniIsPurp(b))continue;const pk=miniParkOf(b);if(!pk)continue;
  const x0=Math.min(pk.x0,pk.x1),x1=Math.max(pk.x0,pk.x1),z0=Math.min(pk.z0,pk.z1),z1=Math.max(pk.z0,pk.z1),mx=(x0+x1)/2,mz=(z0+z1)/2;if(Math.abs(mx-P.x)>lim||Math.abs(mz-P.z)>lim)continue;
  ctx.save();ctx.fillStyle='rgba(125,255,107,.42)';ctx.fillRect((x0-P.x)*ppm,-(z1-P.z)*ppm,(x1-x0)*ppm,(z1-z0)*ppm);ctx.strokeStyle=H_CYAN;ctx.lineWidth=1.5;ctx.strokeRect((x0-P.x)*ppm,-(z1-P.z)*ppm,(x1-x0)*ppm,(z1-z0)*ppm);ctx.restore();}}
function miniParkBadges(cx,cy,mw,mh,yaw,ppm){const a=miniActor();if(!a.close||typeof CITY==='undefined'||!CITY.BL)return;const pad=12,hx=mw/2-pad,hy=mh/2-pad,co=Math.cos(yaw),si=Math.sin(yaw);
  for(const b of CITY.BL){if(!miniIsPurp(b))continue;const pk=miniParkOf(b);if(!pk)continue;const bx=isFinite(pk.doorX)?pk.doorX:(pk.x0+pk.x1)/2,bz=isFinite(pk.doorZ)?pk.doorZ:(pk.z0+pk.z1)/2;if(Math.hypot(bx-a.x,bz-a.z)>180)continue;
    const[sx,sy,out]=miniSpot(bx,bz,co,si,ppm,hx,hy);ctx.save();ctx.globalAlpha=out?.85:1;ctx.translate(cx+sx,cy+sy);ctx.beginPath();ctx.arc(0,0,6.5,0,7);ctx.fillStyle='rgba(8,4,20,.94)';ctx.fill();ctx.strokeStyle=H_CYAN;ctx.lineWidth=1.4;ctx.stroke();hT(ctx,'P',0,3,9,H_LIME,'center',H_FONT,900,3);ctx.restore();}}
function miniNearPurp(){const foot=typeof WALK_MODE!=='undefined'&&WALK_MODE.onFoot,street=P.driveMode==='street';if(!foot&&!street||typeof CITY==='undefined'||!CITY.BL)return null;
  const x=foot?WALK_MODE.x:P.x,z=foot?WALK_MODE.z:P.z;let best=null,bd=60,door=null;
  for(const b of CITY.BL){if(!miniIsPurp(b))continue;const dx=x<b.x0?b.x0-x:x>b.x1?x-b.x1:0,dz=z<b.z0?b.z0-z:z>b.z1?z-b.z1:0,d=Math.hypot(dx,dz);if(d>=bd)continue;bd=d;best=b;door=null;
    if(b.doors){let dd=60;for(const dr of b.doors){const ad=Math.hypot((dr[0]||0)-x,(dr[1]||0)-z);if(ad<dd){dd=ad;door={x:dr[0],z:dr[1]};}}}}
  return best?{b:best,door}:null;}
function miniMark(cx,cy,x,y,draw){ctx.save();ctx.translate(cx+x,cy+y);draw();ctx.restore();}
function miniDoor(cx,cy,door,co,si,ppm,hx,hy){if(!door||!isFinite(door.x)||!isFinite(door.z))return;const[dx,dy,dout]=miniSpot(door.x,door.z,co,si,ppm,hx,hy);
  ctx.save();ctx.globalAlpha=dout?.85:1;ctx.translate(cx+dx,cy+dy);ctx.rotate(Math.PI/4);ctx.strokeStyle=H_YEL;ctx.shadowColor=H_YEL;ctx.shadowBlur=6;ctx.lineWidth=1.6;ctx.strokeRect(-3.2,-3.2,6.4,6.4);ctx.restore();}
function miniFoot(cx,cy,mw,mh,yaw,ppm){const pad=12,hx=mw/2-pad,hy=mh/2-pad,co=Math.cos(yaw),si=Math.sin(yaw),foot=typeof WALK_MODE!=='undefined'&&WALK_MODE.onFoot,near=miniNearPurp();
  if(near){const b=near.b,tag=miniTag(b),[sx,sy]=miniSpot((b.x0+b.x1)/2,(b.z0+b.z1)/2,co,si,ppm,hx,hy);if(tag)miniMark(cx,cy,sx,sy,()=>hT(ctx,tag,0,-7,8,b.c||H_LIME,'center',H_FONT,800,3));if(!(foot&&WALK_MODE.door))miniDoor(cx,cy,near.door,co,si,ppm,hx,hy);}
  if(!foot)return;const[sx,sy,out]=miniSpot(WALK_MODE.x,WALK_MODE.z,co,si,ppm,hx,hy),pulse=1+.22*Math.sin(performance.now()/130);
  ctx.save();ctx.globalAlpha=out?.85:1;ctx.translate(cx+sx,cy+sy);ctx.beginPath();ctx.arc(0,0,7*pulse,0,7);ctx.strokeStyle=H_LIME;ctx.shadowColor=H_LIME;ctx.shadowBlur=10;ctx.lineWidth=1.7;ctx.stroke();ctx.beginPath();ctx.arc(0,0,2.8,0,7);ctx.fillStyle='#f4fbff';ctx.shadowBlur=0;ctx.fill();ctx.restore();
  miniDoor(cx,cy,WALK_MODE.door,co,si,ppm,hx,hy);}
// North on screen after the map is rotated by -yaw. yaw 0 faces +z, and +yaw turns toward +x.
function miniNorth(mx,my,mw,mh,yaw){const dx=-Math.sin(yaw),dy=-Math.cos(yaw),r=12,cx=mx+mw/2,cy=my+mh/2,hx=mw/2-r-3,hy=mh/2-r-3,x=cx+dx*hx,y=cy+dy*hy;
  ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fillStyle='rgba(8,4,20,.92)';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=H_CYAN;ctx.shadowColor=H_CYAN;ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;
  ctx.beginPath();ctx.moveTo(x+dx*(r-1),y+dy*(r-1));ctx.lineTo(x+dx*(r+4),y+dy*(r+4));ctx.lineWidth=2;ctx.strokeStyle='#fff';ctx.stroke();
  hT(ctx,'N',x,y+5,14,'#fff','center',H_FONT,900);}
function drawMini(mx,my,mw,mh,dt){try{miniBake();}catch(e){MINI.cv=MINI.cv||null;}
  const span=miniZoom(dt),yaw=P.yaw||0,cx=mx+mw/2,cy=my+mh/2;
  ctx.save();hrr(ctx,mx,my,mw,mh,14);ctx.clip();ctx.fillStyle='rgba(7,3,20,.94)';ctx.fillRect(mx-1,my-1,mw+2,mh+2);
  if(MINI.cv){const ppm=mw/span,lay=miniLayout(),dw=(MINI.X1-MINI.X0)*ppm,dh=(MINI.Z1-MINI.Z0)*ppm;ctx.save();ctx.translate(cx,cy);ctx.rotate(-yaw);ctx.imageSmoothingEnabled=true;ctx.drawImage(MINI.cv,(MINI.X0-P.x)*ppm,-(MINI.Z1-P.z)*ppm,dw,dh);const tows=lay?(typeof CITY!=='undefined'&&CITY.LAYOUT===lay&&CITY.TOWS):((window.CITY&&CITY.TOWS)||null);if(tows){ctx.fillStyle='#ffe14d';const lim=span*.75;for(const t of tows){const ex=t.x-P.x,ez=t.z-P.z;if(Math.abs(ex)>lim||Math.abs(ez)>lim)continue;ctx.beginPath();ctx.arc(ex*ppm,-ez*ppm,2.4,0,7);ctx.fill();}}if(!lay){miniZone(ppm);miniPurp(ppm,span*.9);miniPark(ppm,Math.max(span*.9,260));}miniDome(ppm);ctx.restore();miniPois(cx,cy,mw,mh,yaw,ppm);if(lay){miniPlaces(cx,cy,mw,mh,yaw,ppm,span);miniDistricts(cx,cy,mw,mh,yaw,ppm);miniWxLabels(cx,cy,mw,mh,yaw,ppm,span);}else miniZoneLabel(cx,cy,mw,mh,yaw,ppm);}
  zIconBake();const d=miniIconPx(mw,span);ctx.imageSmoothingEnabled=true;ctx.drawImage(ZICON.cv,cx-d/2,cy-d/2,d,d);miniFoot(cx,cy,mw,mh,yaw,mw/span);if(!miniLayout())miniParkBadges(cx,cy,mw,mh,yaw,mw/span);ctx.restore();
  hrr(ctx,mx,my,mw,mh,14);ctx.lineWidth=2.5;ctx.strokeStyle=H_CYAN;ctx.shadowColor=H_CYAN;ctx.shadowBlur=10;ctx.stroke();ctx.shadowBlur=0;miniNorth(mx,my,mw,mh,yaw);}
function zIpadOn(){return !!(window.Z_IS_IPAD||document.documentElement.classList.contains('ipad-mode')||(document.body&&document.body.classList.contains('ipad-mode')));}
function placeIpadDom(on,cssL){
  const ids=['kMenuB','exitCarBtn','enterBldBtn'];
  if(!on||!cssL){
    for(const id of ids){const n=document.getElementById(id);if(!n||!n.dataset.ipadBox)continue;
      n.style.position=n.style.left=n.style.top=n.style.right=n.style.bottom=n.style.width=n.style.height=n.style.transform=n.style.margin='';
      delete n.dataset.ipadBox;}
    return;
  }
  const put=(id,box)=>{const n=document.getElementById(id);if(!n||!box)return;
    const sig=[box.x,box.y,box.w,box.h].map(v=>Math.round(v)).join('|');
    if(n.dataset.ipadBox===sig)return;n.dataset.ipadBox=sig;
    n.style.position='fixed';n.style.left=Math.round(box.x)+'px';n.style.top=Math.round(box.y)+'px';
    n.style.right='auto';n.style.bottom='auto';n.style.width=Math.round(box.w)+'px';n.style.height=Math.round(box.h)+'px';
    n.style.transform='none';n.style.margin='0';};
  put('kMenuB',cssL.pause);put('exitCarBtn',cssL.exit);put('enterBldBtn',cssL.enter);
}
function drawIpadTel(b,st,t){
  const col=P.stall&&Math.floor(t*6)%2?H_ORNG:H_CYAN;
  hbub(ctx,b.x,b.y,b.w,b.h,col,'rgba(8,4,20,.88)');
  hT(ctx,'ALT '+Math.round(P.y)+'M',b.x+8,b.y+16,11,'#fff','left',H_TXT,800);
  hT(ctx,(fps|0)+' FPS',b.x+b.w-8,b.y+16,10,'rgba(191,214,255,.75)','right',H_TXT,700);
  hTN(ctx,String(vShown),b.x+b.w-8,b.y+36,22,'#fff','right',H_FONT,900,6);
  hT(ctx,'MPH',b.x+8,b.y+36,11,H_CYAN,'left',H_FONT,900);
  hT(ctx,st,b.x+8,b.y+b.h-8,11,P.flip?'#ff2a3d':P.stall?H_ORNG:P.ground?H_CYAN:H_LIME,'left',H_FONT,900,3);
  hudStackBottom=b.y+b.h;
}
// WINGS sits under the right-hand ALT stack. Same size; THROTTLE is left on its CSS anchor.
let wingKey='';function placeWings(s,bottomHud){const wng=document.getElementById('wng'),thr=document.getElementById('tup');if(!wng)return;
  // On a desktop the canvas buffer is capped (1280×720) while CSS pixels are the real window.
  // Writing those buffer pixels into style.top parks WINGS over the telemetry. CSS owns the spot.
  // iPad is the same: shared/ipad.css docks the thumb buttons. Do not write buffer pixels into style.
  if(document.documentElement.classList.contains('pc-mode')){if(wingKey!=='pc'){wng.style.top='';wng.style.right='';wng.style.bottom='';wng.style.left='';wingKey='pc';}return;}
  if(zIpadOn()){if(wingKey!=='ipad'){wng.style.top='';wng.style.right='';wng.style.bottom='';wng.style.left='';wingKey='ipad';}return;}
  if(wingKey==='pc'||wingKey==='ipad'){wng.style.top='';wng.style.right='';wng.style.bottom='';wng.style.left='';wingKey='';}
  const key=W+'x'+H+'x'+bottomHud;if(key===wingKey)return;const gap=6;let top=Math.round(bottomHud*s+gap),wh=wng.offsetHeight||84;if(thr){const thrTop=thr.offsetTop;if(top+wh>thrTop-gap)top=thrTop-gap-wh;}if(top<bottomHud*s+2&&thr){wng.style.right=(20+(thr.offsetWidth||112)+10)+'px';top=Math.round(Math.max(bottomHud*s+gap,thr.offsetTop));}else wng.style.right='20px';wng.style.top=Math.round(top)+'px';wng.style.bottom='auto';wingKey=key;}
function syncPcFps(){const on=document.documentElement.classList.contains('pc-mode');let n=document.getElementById('pcFps');
  if(!on){if(n)n.remove();return;}
  if(!n){n=document.createElement('div');n.id='pcFps';n.setAttribute('aria-label','Frames per second');(document.querySelector('.kbody')||document.body).appendChild(n);}
  const v=Math.max(0,Math.round(typeof fps==='number'?fps:0));const t=v+' FPS';if(n.textContent!==t)n.textContent=t;}
function drawHud(dt){var __zh=typeof zdT==='function'?zdT():-1;const t=performance.now()/1000,w=W,h=H,ipad=zIpadOn(),s=ipad?1:clamp(h/378,.72,1.35);ctx.save();ctx.scale(s,s);const Wd=w/s,Hh=h/s,TU=TUNE;
  const cssL=ipad&&typeof zIpadChrome==='function'?zIpadChrome(innerWidth,innerHeight):null;
  const sx=cssL?W/Math.max(1,innerWidth):1,sy=cssL?H/Math.max(1,innerHeight):1;
  const scBox=b=>b?{x:b.x*sx,y:b.y*sy,w:b.w*sx,h:b.h*sy}:null;
  const L=cssL?{map:scBox(cssL.map),tilt:scBox(cssL.tilt),tel:scBox(cssL.tel)}:null;
  if(ipad)placeIpadDom(true,cssL);else placeIpadDom(false);
  vS+=(P.v*2.237-vS)*(1-Math.exp(-dt/.3));vT+=dt;if(vT>.14){vT=0;const r=Math.round(vS);if(Math.abs(vS-vShown)>.75||r===0)vShown=r;}
  // TOP LEFT: minimap in the slot the ALT/THR panel used on main (x 12, y 10, 196×134)
  if(typeof zdAdd==='function')zdAdd('hud',__zh);__zh=typeof zdT==='function'?zdT():-1;
  if(!(window.ZD_KILL&&ZD_KILL.minimap)){const mapW=L?L.map.w:Math.min(196,Math.max(96,Wd/2-79));drawMini(L?L.map.x:12,L?L.map.y:10,mapW,L?L.map.h:134,dt);}
  if(typeof zdAdd==='function')zdAdd('minimap',__zh);__zh=typeof zdT==='function'?zdT():-1;
  // TOP CENTRE: ROTATE speed cue (WANTED's level / ramp bar)
  {const gw=L?L.tilt.w:118,gh=L?L.tilt.h:58,gx=L?L.tilt.x:Wd/2-gw/2,gy=L?L.tilt.y:6,cm=window.TCMD||[0,0],ok=P.ground&&P.rotOK,cx=gx+gw/2,cy=gy+gh/2,on=(typeof tiltOk==='function'&&tiltOk())||document.documentElement.classList.contains('pc-mode');
    ctx.save();ctx.beginPath();ctx.roundRect(gx,gy,gw,gh,12);ctx.fillStyle='rgba(10,5,24,.82)';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=on?H_CYAN:'#55507a';ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=6;ctx.stroke();
    const edge=(x1,y1,x2,y2)=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.lineWidth=4;ctx.strokeStyle=H_YEL;ctx.shadowColor=H_YEL;ctx.shadowBlur=16;ctx.stroke();};
    if(cm[1]>=.98)edge(gx+14,gy+1.5,gx+gw-14,gy+1.5);if(cm[1]<=-.98)edge(gx+14,gy+gh-1.5,gx+gw-14,gy+gh-1.5);if(cm[0]<=-.98)edge(gx+1.5,gy+12,gx+1.5,gy+gh-12);if(cm[0]>=.98)edge(gx+gw-1.5,gy+12,gx+gw-1.5,gy+gh-12);
    ctx.shadowBlur=0;ctx.strokeStyle='rgba(191,214,255,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(gx+8,cy);ctx.lineTo(gx+gw-8,cy);ctx.moveTo(cx,gy+6);ctx.lineTo(cx,gy+gh-6);ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,5,0,7);ctx.stroke();
    const dx=cx+cm[0]*(gw/2-10),dy=cy-cm[1]*(gh/2-9),mx1=Math.abs(cm[0])>=.98||Math.abs(cm[1])>=.98;ctx.beginPath();ctx.arc(dx,dy,5.5,0,7);ctx.fillStyle=mx1?H_YEL:H_PINK;ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=10;ctx.fill();ctx.restore();
    if(window.INP){INP.dotX=cm[0]*(gw/2-10);INP.dotY=cm[1]*(gh/2-9);}
    if(document.documentElement.classList.contains('pc-mode')){let kd=document.getElementById('kTiltDot');if(!kd){kd=document.createElement('i');kd.id='kTiltDot';kd.setAttribute('aria-hidden','true');kd.style.cssText='position:fixed;width:11px;height:11px;margin:-5.5px 0 0 -5.5px;border-radius:50%;pointer-events:none;z-index:5;opacity:0';(document.body||document.documentElement).appendChild(kd);}kd.style.left=(dx*s)+'px';kd.style.top=(dy*s)+'px';kd.dataset.x=(+cm[0]).toFixed(3);kd.dataset.y=(+cm[1]).toFixed(3);let kl=document.getElementById('kTiltLbl');if(!kl){kl=document.createElement('i');kl.id='kTiltLbl';kl.setAttribute('aria-hidden','true');kl.style.cssText='position:fixed;pointer-events:none;opacity:0';(document.body||document.documentElement).appendChild(kl);}const ax=Math.abs(cm[0]),ay=Math.abs(cm[1]);kl.textContent=!on?'TILT OFF':(ax<.02&&ay<.02)?'CENTER':((ax>=.98?(cm[0]>0?'100% RIGHT':'100% LEFT'):'TILT')+(ay>=.98?(cm[1]>0?' 100% UP':' 100% DOWN'):''));}
    hT(ctx,on?'TILT':'TILT OFF',gx+6,gy+10,8,'#8f8ab8','left',H_TXT,800);
    if(window.TILTDBG){const r=TL.raw||[TL.lr-TL.n0.lr,TL.fb-TL.n0.fb];hT(ctx,`raw lr ${r[0].toFixed(1)}° fb ${r[1].toFixed(1)}° · cmd ${cm[0].toFixed(2)} ${cm[1].toFixed(2)}`,Wd/2,gy+gh+30,10,'#9fffb8','center',H_TXT,800,4);}
    const by=gy+gh+5,bw=gw;if(P.ground){const mxv=TU.rotateSpeed*1.25,fr=v=>clamp(v/mxv,0,1);ctx.fillStyle='rgba(255,255,255,.14)';hrr(ctx,gx,by,bw,5,2.5);ctx.fill();ctx.fillStyle=ok?(Math.floor(t*6)%2?'#fff':H_YEL):H_CYAN;if(P.v>.3){hrr(ctx,gx,by,Math.max(5,bw*fr(P.v)),5,2.5);ctx.fill();}ctx.fillStyle=H_LIME;ctx.fillRect(gx+bw*fr(TU.rotateSpeed)-1.5,by-3,3,11);
      hT(ctx,ok?'PULL UP!  ▲ TILT TOWARD YOU':!P.wings?(P.v>=TU.rotateSpeed?'OPEN WINGS TO LAUNCH!':'WINGS CLOSED · NO LIFT · TAP WINGS'):P.v<1?`HOLD THROTTLE · ROTATE AT ${Math.round(TU.rotateSpeed*2.237)} MPH`:'BUILD SPEED TO THE GREEN MARK',Wd/2,by+20+(ok?2:0),ok?13:10,ok?H_YEL:'#bfd6ff','center',ok?H_FONT:H_TXT,900,ok?10:4);}
    else hT(ctx,P.stall?'LOW SPEED · NOSE DOWN OR MORE THROTTLE':P.y<15&&P.v*3.6<40?'SLOW & NOSE UP · AIR BRAKE · BUTTER IT!':'DIVE = SPEED · CLIMB = HEIGHT',Wd/2,by+14,10,P.stall?H_ORNG:'#bfd6ff','center',H_TXT,800,4);}
  // Hot Drop pill sits under the tilt prompt. Overcharge uses the same slot while the NOS reward is live.
  {const H=miniHot(),over=H&&H.overchargeT>0,hot=H&&H.active&&H.tLeft>0;if(over||hot){const pw=184,ph=22,px=Wd/2-pw/2,py=L?Math.round(Math.max(L.map.y+L.map.h,L.tilt.y+L.tilt.h)+8):98,col=over?H_LIME:H_YEL,frac=over?clamp(H.overchargeT/15,0,1):clamp(H.tLeft/(H.maxT||25),0,1);
    const label=over?`🔥 OVERCHARGE NOS · ${Math.ceil(H.overchargeT)}S`:`⚡ HOT DROP · ${Math.ceil(H.tLeft)}S · ${Math.round(Math.hypot(H.x-P.x,H.z-P.z))}M`;
    ctx.save();hrr(ctx,px,py,pw,ph,11);ctx.fillStyle='rgba(8,4,20,.92)';ctx.fill();ctx.lineWidth=1.5;ctx.strokeStyle=H_CYAN;ctx.shadowColor=col;ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;
    hT(ctx,label,Wd/2,py+14,10,col,'center',H_FONT,800,3);
    ctx.fillStyle='rgba(255,255,255,.14)';ctx.fillRect(px+10,py+ph-4,pw-20,2);ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=6;ctx.fillRect(px+10,py+ph-4,Math.max(2,(pw-20)*frac),2);ctx.shadowBlur=0;ctx.restore();}}
  if(L&&L.tel){const st=P.ground?(P.v<1?'PARKED':'ROLLING'):P.flip?'STALL!':P.stall?'LOW SPEED!':'FLYING';drawIpadTel(L.tel,st,t);}
  else{
  // RIGHT: MPH dial, then the smaller ALT/THR + STATUS stack directly under it. N2O gauge stays off (bottle is on the NOS button).
  // pcDrop keeps that stack under the desktop top bar (FPS, exit car, pause) instead of underneath it.
  {const pcDrop=document.documentElement.classList.contains('pc-mode')?64:0;const rx=Wd-16;ctx.save();const g=ctx.createLinearGradient(Wd-200,0,Wd,0);g.addColorStop(0,'rgba(8,3,20,0)');g.addColorStop(1,'rgba(8,3,20,.6)');ctx.fillStyle=g;ctx.fillRect(Wd-200,8+pcDrop,200,60);ctx.restore();
    {const cx=rx-128,cy=46+pcDrop,r=26,MAX=TU.maxSpeed*TU.nosBoost*2.237,v=clamp(vS,0,MAX),a0=Math.PI*.8,a1=Math.PI*2.2,A=m=>a0+(a1-a0)*(m/MAX);ctx.save();ctx.lineCap='round';ctx.lineWidth=5;ctx.strokeStyle='rgba(255,255,255,.14)';ctx.beginPath();ctx.arc(cx,cy,r,a0,a1);ctx.stroke();
      ctx.strokeStyle=P.stall?H_ORNG:H_CYAN;ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=8;ctx.beginPath();ctx.arc(cx,cy,r,a0,A(v));ctx.stroke();ctx.shadowBlur=0;
      const cm=A(TU.rotateSpeed*2.237);ctx.strokeStyle=H_LIME;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx+Math.cos(cm)*(r-8),cy+Math.sin(cm)*(r-8));ctx.lineTo(cx+Math.cos(cm)*(r+5),cy+Math.sin(cm)*(r+5));ctx.stroke();
      ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(A(v))*(r-4),cy+Math.sin(A(v))*(r-4));ctx.stroke();ctx.restore();}
    hTN(ctx,String(vShown),rx-48,48+pcDrop,34,'#fff','right',H_FONT,900,10);hT(ctx,'MPH',rx,48+pcDrop,12,H_CYAN,'right',H_FONT,900);
    // ~63% of main's 196-wide panel and ~60% of its 126px of boxes (92+34). ALT number stays 18px; bar stays 13px. Labels trimmed.
    const aw=124,ah=50,ax=rx-aw,ay=76+pcDrop,st=P.ground?(P.v<1?'PARKED':'ROLLING'):P.flip?'STALL!':P.stall?'LOW SPEED!':'FLYING';
    hbub(ctx,ax,ay,aw,ah,P.stall&&Math.floor(t*6)%2?H_ORNG:'#3e7bff');
    hT(ctx,'ALT',ax+8,ay+14,9,'#ffd0f4','left',H_TXT,800);hTN(ctx,String(Math.round(P.y)),ax+aw-18,ay+20,18,'#fff','right',H_FONT,900,6);hT(ctx,'M',ax+aw-6,ay+18,10,H_CYAN,'right',H_FONT,900);
    hT(ctx,'THR',ax+8,ay+42,9,'#bfd6ff','left',H_TXT,800);{const bx=ax+34,by=ay+32,bw=aw-42,bh=13;ctx.fillStyle='rgba(255,255,255,.1)';hrr(ctx,bx,by,bw,bh,7);ctx.fill();const g2=ctx.createLinearGradient(bx,0,bx+bw,0);g2.addColorStop(0,'#3e7bff');g2.addColorStop(1,H_PINK);ctx.fillStyle=g2;if(P.thr>.01){hrr(ctx,bx,by,Math.max(14,bw*P.thr),bh,7);ctx.fill();}hT(ctx,Math.round(P.thr*100)+'%'+(P.nosT?' · NOS!':''),bx+bw/2,by+10,10,'#fff','center',H_TXT,900);}
    {const sy=142+pcDrop,sh=26;hbub(ctx,ax,sy,aw,sh,P.stall&&Math.floor(t*5)%2?H_ORNG:'rgba(255,79,216,.8)');hT(ctx,'STATUS',ax+8,sy+17,9,'#ffd0f4','left',H_TXT,800);hT(ctx,st,ax+aw-8,sy+17,11,P.flip?'#ff2a3d':P.stall?H_ORNG:P.ground?H_CYAN:H_LIME,'right',H_FONT,900,4);hudStackBottom=sy+sh;}
    /* Phone keeps the canvas readout. Desktop draws a DOM counter in the top bar so the buffer cap cannot hide it. */
    if(!pcDrop)hT(ctx,(fps|0)+' FPS',rx,134,9,'rgba(191,214,255,.6)','right',H_TXT,700);}}
  // popup (WANTED wMsg)
  if(FMSG&&t-FMSG.t<1.4){const a=clamp((1.4-(t-FMSG.t))/.4,0,1),sc=1+Math.max(0,.25-(t-FMSG.t))*1.2;ctx.globalAlpha=a;ctx.save();ctx.translate(Wd/2,Hh*.6);ctx.scale(sc,sc);hT(ctx,FMSG.txt,0,0,28,FMSG.col,'center',H_FONT,900,18);if(FMSG.sub)hT(ctx,FMSG.sub,0,22,13,'#fff','center',H_TXT,800);ctx.restore();ctx.globalAlpha=1;}
  ctx.restore();placeWings(s,hudStackBottom);
  // NOS bottle on the NOS button (WANTED's .nfxcan)
  if(!nosCan){nosCan=document.createElement('div');nosCan.className='nfxcan';nosCan.innerHTML='<i></i><b></b>';document.getElementById('nos').appendChild(nosCan);}
  const f=Math.round(P.nosTank*200)/200;if(f!==nosCan.f){nosCan.f=f;nosCan.style.setProperty('--cf',f);document.getElementById('nos').classList.toggle('ready',f>=.99);document.getElementById('nos').classList.toggle('empty',f<.05);}
  syncPcFps();if(typeof zdAdd==='function')zdAdd('hud',__zh);}
let nosCan=null;
// ===== pause menu (WANTED ⏸ → RESUME / row / HOME) =====
let paused=false;function kPause(on){paused=on;document.getElementById('kHome').classList.toggle('hidden',!on);document.getElementById('kPzBg').classList.toggle('hidden',!on);document.getElementById('kMenuB').classList.toggle('kopen',on);}
document.getElementById('kMenuB').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();kPause(!paused);});
document.getElementById('kPzX').addEventListener('click',e=>{e.stopPropagation();kPause(false);});
document.getElementById('kPzBg').addEventListener('click',()=>kPause(false));
document.getElementById('kHome').addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(!b)return;const m=b.dataset.m;
  if(m==='resume')kPause(false);else if(m==='home')location.replace('jr.html');else if(m==='full'){goFull();kPause(false);}else if(m==='recal'){tiltCenter();kPause(false);kToast('TILT CENTERED ✓');}else if(m==='xray'){RWXRAY.on=!RWXRAY.on;localStorage.setItem('zdw_rwxray',RWXRAY.on?'1':'0');b.textContent='RUNWAY X-RAY '+(RWXRAY.on?'ON':'OFF');kToast(b.textContent);}else if(m==='runway'){reset();kPause(false);kToast('BACK ON THE RUNWAY');}});

{const xb=document.querySelector('#kTabs [data-m=xray]');if(xb)xb.textContent='RUNWAY X-RAY '+(RWXRAY.on?'ON':'OFF');}
