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
// North-up minimap. City is baked once; each frame blits that image and draws the player arrow.
const MINI={X0:-1500,Z0:-900,X1:1900,Z1:2900,S:0.34,cv:null};
function miniHex(hex,a){const n=parseInt(String(hex||'').replace('#',''),16);if(!Number.isFinite(n))return`rgba(62,230,255,${a})`;return`rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;}
function miniBake(){if(MINI.cv||typeof CITY==='undefined')return;const S=MINI.S,w=Math.ceil((MINI.X1-MINI.X0)*S),h=Math.ceil((MINI.Z1-MINI.Z0)*S),cv=document.createElement('canvas');cv.width=w;cv.height=h;const c=cv.getContext('2d'),X=x=>(x-MINI.X0)*S,Y=z=>(MINI.Z1-z)*S,C=CITY;
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
  c.fillStyle='#ffe14d';for(const t of C.TOWS){c.beginPath();c.arc(X(t.x),Y(t.z),2.5,0,7);c.fill();}
  MINI.cv=cv;}
function drawMini(mx,my,mw,mh){try{miniBake();}catch(e){MINI.cv=MINI.cv||null;}
  ctx.save();hrr(ctx,mx,my,mw,mh,14);ctx.clip();ctx.fillStyle='rgba(7,3,20,.94)';ctx.fillRect(mx-1,my-1,mw+2,mh+2);
  if(MINI.cv){const ppm=mw/680,cx=mx+mw/2,cy=my+mh/2,dw=(MINI.X1-MINI.X0)*ppm,dh=(MINI.Z1-MINI.Z0)*ppm;ctx.drawImage(MINI.cv,cx+(MINI.X0-P.x)*ppm,cy-(MINI.Z1-P.z)*ppm,dw,dh);}
  ctx.translate(mx+mw/2,my+mh/2);ctx.rotate(P.yaw||0);ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(5.2,6);ctx.lineTo(0,2.2);ctx.lineTo(-5.2,6);ctx.closePath();ctx.fillStyle='#fff';ctx.fill();ctx.lineWidth=1.4;ctx.strokeStyle=H_CYAN;ctx.stroke();ctx.restore();
  hrr(ctx,mx,my,mw,mh,14);ctx.lineWidth=2.5;ctx.strokeStyle=H_CYAN;ctx.shadowColor=H_CYAN;ctx.shadowBlur=10;ctx.stroke();ctx.shadowBlur=0;hT(ctx,'N',mx+mw/2,my+12,9,H_CYAN,'center',H_TXT,800);}
// WINGS sits under the right-hand ALT stack. Same size; THROTTLE is left on its CSS anchor.
let wingKey='';function placeWings(s,bottomHud){const wng=document.getElementById('wng'),thr=document.getElementById('tup');if(!wng)return;const key=W+'x'+H+'x'+bottomHud;if(key===wingKey)return;const gap=6;let top=Math.round(bottomHud*s+gap),wh=wng.offsetHeight||84;if(thr){const thrTop=thr.offsetTop;if(top+wh>thrTop-gap)top=thrTop-gap-wh;}if(top<bottomHud*s+2&&thr){wng.style.right=(20+(thr.offsetWidth||112)+10)+'px';top=Math.round(Math.max(bottomHud*s+gap,thr.offsetTop));}else wng.style.right='20px';wng.style.top=Math.round(top)+'px';wng.style.bottom='auto';wingKey=key;}
function drawHud(dt){const t=performance.now()/1000,w=W,h=H,s=clamp(h/378,.72,1.35);ctx.save();ctx.scale(s,s);const Wd=w/s,Hh=h/s,TU=TUNE;
  vS+=(P.v*2.237-vS)*(1-Math.exp(-dt/.3));vT+=dt;if(vT>.14){vT=0;const r=Math.round(vS);if(Math.abs(vS-vShown)>.75||r===0)vShown=r;}
  // TOP LEFT: minimap in the slot the ALT/THR panel used on main (x 12, y 10, 196×134)
  {const mapW=Math.min(196,Math.max(96,Wd/2-79));drawMini(12,10,mapW,134);}
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
