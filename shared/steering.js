'use strict';
// Desktop keyboard tilt. A linear step lands on exactly ±1 while the key is held
// and is not multiplied back down, so it cannot settle short of full tilt.
// It eases to 0 only after the key is released. Phones and a live gyro stay on
// the accelerometer path below.
const PCST={x:0,y:0,t:0};
function pcStick(keys){
  const now=performance.now();
  let dt=(now-(PCST.t||now))/1000;PCST.t=now;
  if(!(dt>0)||dt>0.1)dt=1/60;
  const tx=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0);
  const ty=(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0);
  const rate=8;
  const step=(cur,target)=>{
    if(cur===target)return cur;
    const next=cur+Math.sign(target-cur)*rate*dt;
    if((target-cur)*(target-next)<=0)return target;
    return next;
  };
  PCST.x=step(PCST.x,tx);PCST.y=step(PCST.y,ty);
  return PCST;
}
function pcTiltLive(){
  return typeof isDesktopPC==='function'&&isDesktopPC()&&!(typeof tiltOk==='function'&&tiltOk())&&!(typeof onFootNow==='function'&&onFootNow());
}
function publishInp(lr,pitch){
  const inp=window.INP||(window.INP={});
  inp.steer=lr;inp.pitch=pitch;inp.tiltX=lr;inp.tiltY=pitch;inp.gyroX=lr;inp.gyroY=pitch;
  inp.dotX=lr*49;inp.dotY=pitch*20;
  return inp;
}
function input(){if(typeof syncEb==='function')syncEb();const dz=v=>Math.abs(v)<TUNE.deadZone?0:v;let lr=0,fb=0;
  let hard=0;if(tiltOk()){const dt0=clamp((P.simT||0)-(TL.tq||0),0,.1);TL.tq=P.simT||0;const rq=relTilt(),dl=rq?rq[0]:TL.lr-TL.n0.lr,df=rq?rq[1]:TL.fb-TL.n0.fb,ks=dt0>0?Math.min(1,dt0/Math.max(.001,TUNE.tiltSmooth)):1;TL.sl=(TL.sl||0)+(clamp(dl,-60,60)-(TL.sl||0))*(rq?ks:1);TL.sf=(TL.sf||0)+(clamp(df,-60,60)-(TL.sf||0))*(rq?ks:1);TL.raw=[dl,df];const rl=TL.sl/TUNE.tiltRange;if(Math.abs(rl)>=TUNE.rollTilt)hard=Math.sign(rl);lr=dz(clamp(rl,-1,1));fb=dz(clamp(TL.sf/TUNE.tiltRange,-1,1));}if(P.ground&&tiltOk()){const q2=relTilt(),d=q2?q2[0]:TL.lr-TL.n0.lr,m=Math.max(0,Math.abs(d)-TUNE.gTiltDead);lr=Math.sign(d)*Math.pow(Math.min(1,m/TUNE.gTiltSpan),0.8);}
  if(pcTiltLive()){const s=pcStick(K);lr=s.x;fb=-s.y;}
  else{if(K.ArrowLeft||K.KeyA)lr-=1;if(K.ArrowRight||K.KeyD)lr+=1;
    if(K.ArrowUp||K.KeyW)fb+=1;if(K.ArrowDown||K.KeyS)fb-=1;}
  lr=clamp(lr,-1,1);fb=clamp(fb,-1,1);
  window.TCMD=[lr,-fb];
  const pitch=clamp(-fb,-1,1);
  publishInp(lr,pitch);
  return{hard,lr,climb:pitch,nos:B.nos||K.ShiftLeft||K.ShiftRight,brk:B.brk||K.Space,eb:B.ebLatch?1:0,tu:B.tup||K.KeyE};}
