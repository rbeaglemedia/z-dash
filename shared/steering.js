'use strict';
function input(){if(typeof syncEb==='function')syncEb();const dz=v=>Math.abs(v)<TUNE.deadZone?0:v;let lr=0,fb=0;
  let hard=0;if(tiltOk()){const dt0=clamp((P.simT||0)-(TL.tq||0),0,.1);TL.tq=P.simT||0;const rq=relTilt(),dl=rq?rq[0]:TL.lr-TL.n0.lr,df=rq?rq[1]:TL.fb-TL.n0.fb,ks=dt0>0?Math.min(1,dt0/Math.max(.001,TUNE.tiltSmooth)):1;TL.sl=(TL.sl||0)+(clamp(dl,-60,60)-(TL.sl||0))*(rq?ks:1);TL.sf=(TL.sf||0)+(clamp(df,-60,60)-(TL.sf||0))*(rq?ks:1);TL.raw=[dl,df];const rl=TL.sl/TUNE.tiltRange;if(Math.abs(rl)>=TUNE.rollTilt)hard=Math.sign(rl);lr=dz(clamp(rl,-1,1));fb=dz(clamp(TL.sf/TUNE.tiltRange,-1,1));}if(P.ground&&tiltOk()){const q2=relTilt(),d=q2?q2[0]:TL.lr-TL.n0.lr,m=Math.max(0,Math.abs(d)-TUNE.gTiltDead);lr=Math.sign(d)*Math.pow(Math.min(1,m/TUNE.gTiltSpan),0.8);}window.TCMD=[lr,-fb];
  if(K.ArrowLeft||K.KeyA)lr-=1;if(K.ArrowRight||K.KeyD)lr+=1;
  // fb>0 = top away = dive. Keys: Up/W = dive (push stick), Down/S = climb (pull back)
  if(K.ArrowUp||K.KeyW)fb+=1;if(K.ArrowDown||K.KeyS)fb-=1;
  return{hard,lr:clamp(lr,-1,1),climb:clamp(-fb,-1,1),nos:B.nos||K.ShiftLeft||K.ShiftRight,brk:B.brk||K.Space,eb:B.ebLatch?1:0,tu:B.tup||K.KeyE};}
