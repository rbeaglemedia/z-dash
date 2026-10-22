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
let vShown=0,vS=0,vT=0;
function drawHud(dt){const t=performance.now()/1000,w=W,h=H,s=clamp(h/378,.72,1.35);ctx.save();ctx.scale(s,s);const Wd=w/s,Hh=h/s,TU=TUNE;
  vS+=(P.v*2.237-vS)*(1-Math.exp(-dt/.3));vT+=dt;if(vT>.14){vT=0;const r=Math.round(vS);if(Math.abs(vS-vShown)>.75||r===0)vShown=r;}
  // LEFT: ALT + THROTTLE meter (WANTED's HEAT / BUSTED bubble)
  hbub(ctx,12,10,140,60,P.stall&&Math.floor(t*6)%2?H_ORNG:'#3e7bff');hT(ctx,'ALT',22,28,10,'#ffd0f4','left',H_TXT,800);hTN(ctx,String(Math.round(P.y)),126,30,14,'#fff','right',H_FONT,900,6);hT(ctx,'M',142,30,9,H_CYAN,'right',H_FONT,900);
  hT(ctx,'THR',22,46,9,'#bfd6ff','left',H_TXT,800);{const bx=22,by=52,bw=120,bh=11;ctx.fillStyle='rgba(255,255,255,.1)';hrr(ctx,bx,by,bw,bh,7);ctx.fill();const g=ctx.createLinearGradient(bx,0,bx+bw,0);g.addColorStop(0,'#3e7bff');g.addColorStop(1,H_PINK);ctx.fillStyle=g;if(P.thr>.01){hrr(ctx,bx,by,Math.max(14,bw*P.thr),bh,7);ctx.fill();}hT(ctx,Math.round(P.thr*100)+'%'+(P.nosT?' · NOS!':''),bx+bw/2,by+9,8,'#fff','center',H_TXT,900);}
  {const sy=82,st=P.ground?(P.v<1?'PARKED':'ROLLING'):P.flip?'STALL!':P.stall?'LOW SPEED!':'FLYING';hbub(ctx,12,sy-6,140,30,P.stall&&Math.floor(t*5)%2?H_ORNG:'rgba(255,79,216,.8)');hT(ctx,'STATUS',22,sy+13,9,'#ffd0f4','left',H_TXT,800);hT(ctx,st,142,sy+14,10,P.flip?'#ff2a3d':P.stall?H_ORNG:P.ground?H_CYAN:H_LIME,'right',H_FONT,900,6);}
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
  // RIGHT: KM/H dial + digits, N2O bottle bar (WANTED's MPH block)
  {const rx=Wd-16;ctx.save();const g=ctx.createLinearGradient(Wd-200,0,Wd,0);g.addColorStop(0,'rgba(8,3,20,0)');g.addColorStop(1,'rgba(8,3,20,.6)');ctx.fillStyle=g;ctx.fillRect(Wd-200,8,200,58);ctx.restore();
    {const cx=rx-128,cy=46,r=26,MAX=TU.maxSpeed*TU.nosBoost*2.237,v=clamp(vS,0,MAX),a0=Math.PI*.8,a1=Math.PI*2.2,A=m=>a0+(a1-a0)*(m/MAX);ctx.save();ctx.lineCap='round';ctx.lineWidth=5;ctx.strokeStyle='rgba(255,255,255,.14)';ctx.beginPath();ctx.arc(cx,cy,r,a0,a1);ctx.stroke();
      ctx.strokeStyle=P.stall?H_ORNG:H_CYAN;ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=8;ctx.beginPath();ctx.arc(cx,cy,r,a0,A(v));ctx.stroke();ctx.shadowBlur=0;
      const cm=A(TU.rotateSpeed*2.237);ctx.strokeStyle=H_LIME;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx+Math.cos(cm)*(r-8),cy+Math.sin(cm)*(r-8));ctx.lineTo(cx+Math.cos(cm)*(r+5),cy+Math.sin(cm)*(r+5));ctx.stroke();
      ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(A(v))*(r-4),cy+Math.sin(A(v))*(r-4));ctx.stroke();ctx.restore();}
    hTN(ctx,String(vShown),rx-48,48,34,'#fff','right',H_FONT,900,10);hT(ctx,'MPH',rx,48,12,H_CYAN,'right',H_FONT,900);
    /* N2O gauge removed for now (NOS still works: bottle on the NOS button). Minimap slot reserved: screen-space below the MPH block, right side, approx x Wd-150..Wd-14, y 70..200 (HUD units). *//* TILT status is the #kTilt button (DOM) */hT(ctx,(fps|0)+' FPS',Wd-4,10,9,'rgba(191,214,255,.6)','right',H_TXT,700);}
  // popup (WANTED wMsg)
  if(FMSG&&t-FMSG.t<1.4){const a=clamp((1.4-(t-FMSG.t))/.4,0,1),sc=1+Math.max(0,.25-(t-FMSG.t))*1.2;ctx.globalAlpha=a;ctx.save();ctx.translate(Wd/2,Hh*.6);ctx.scale(sc,sc);hT(ctx,FMSG.txt,0,0,28,FMSG.col,'center',H_FONT,900,18);if(FMSG.sub)hT(ctx,FMSG.sub,0,22,13,'#fff','center',H_TXT,800);ctx.restore();ctx.globalAlpha=1;}
  ctx.restore();
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
