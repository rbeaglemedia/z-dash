(()=>{'use strict';
const PARTS={"doorR": ["Object_4279_BODY_0", "Object_4312_Material002_0", "Object_4313_Material002_0", "Object_4323_Material002_0", "Object_4327_Material002_0", "Object_4328_Material002_0", "Object_4329_Material002_0", "Object_4330_Material002_0", "Object_4351_BODY_0", "Object_4354_Material002_0", "Object_4369_BLACK_0", "Object_4376_Material002_0", "Object_4472_Material002_0", "Object_4473_Material002_0", "Object_4516_Material002_0", "Object_4517_Material002_0", "Object_4518_BLACK_0", "Object_4950_GLASS_0"], "doorL": ["Object_4264_Material002_0", "Object_4265_Material002_0", "Object_4272_Material002_0", "Object_4274_Material002_0", "Object_4276_Material002_0", "Object_4285_Material002_0", "Object_4286_Material002_0", "Object_4287_Material002_0", "Object_4288_Material002_0", "Object_4299_Material002_0", "Object_4300_Material002_0", "Object_4301_Material002_0", "Object_4355_BODY_0", "Object_4375_Material002_0", "Object_4550_Material002_0", "Object_4551_Material002_0", "Object_4552_Material002_0", "Object_4553_BLACK_0", "Object_4554_BODY_0", "Object_4555_Material002_0", "Object_4951_GLASS_0"], "hatch": ["Object_4450_Material002_0", "Object_4527_Material002_0", "Object_4528_Material002_0", "Object_4529_Material002_0", "Object_4530_Material002_0", "Object_4531_Material002_0", "Object_4532_Material002_0", "Object_4538_Material002_0", "Object_4540_Material002_0", "Object_4541_Material002_0", "Object_4626_Material002_0", "Object_4630_Material002_0", "Object_4648_Material002_0", "Object_4656_Material002_0", "Object_4682_Material002_0", "Object_4703_Material002_0", "Object_4708_Material002_0", "Object_4734_Material002_0", "Object_4735_Material002_0", "Object_4806_Material002_0", "Object_4807_Material002_0", "Object_4808_Material002_0", "Object_4915_Material002_0", "Object_4920_Material002_0", "Object_4921_Material002_0", "Object_4924_Material002_0", "Object_4925_Material002_0", "Object_4926_CARBON__0", "Object_4927_Material002_0", "Object_4929_CARBON__0", "Object_4931_Material002_0", "Object_4932_Material002_0", "Object_4933_Material002_0", "Object_4934_Material002_0", "Object_4935_Material002_0", "Object_4936_Material002_0", "Object_4937_Material002_0", "Object_4938_Material002_0", "Object_4939_Material002_0", "Object_4940_Material002_0", "Object_4941_Material002_0", "Object_4942_Material002_0", "Object_4947_BLACK_0", "Object_4961_GLASS_0"]};
const GL={time:1.8,doorDeg:90,layDeg:90,dihedral:-4,rootUp:0.26,hatchExtra:10,open:[0,.35],lay:[.3,.65],hatch:[.4,.85],spoil:[.6,1]};
const OPEN={hingeY0:0.13,hingeY1:0.60,hingeBack:0.008,hingeIn:0.004,doorDeg:68,hatchDeg:80,doorS:1.1,hatchS:1.5,axisFwd:0.12,axisIn:0.06};
const S={g:0,gT:0,d:0,h:0,dT:0,hT:0,yaw:0.6,pitch:0.16,ok:false,hingeD:[],hingeH:null,miss:[]};
const ez=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;            // ease-in-out (doors)
const strut=t=>{const e=1-Math.pow(1-t,3);return e+Math.sin(t*Math.PI)*0.025*t;}; // gas strut: eases up, tiny settle
function setup(X){const V=X.THREE_Vector3,byName={};X.car.traverse(o=>{if(o.isMesh)byName[o.name]=o;});
  const grab=k=>PARTS[k].map(n=>byName[n]||(S.miss.push(n),null)).filter(Boolean);
  const any=byName[PARTS.doorR[0]];let c=any;while(c.parent&&c.parent!==X.car)c=c.parent;c.updateMatrixWorld(true);
  const G=()=>new X.car.constructor();
  function pivot(meshes,hingeW){const p=G();c.add(p);p.position.copy(c.worldToLocal(hingeW.clone()));p.updateMatrixWorld(true);meshes.forEach(m=>p.attach(m));p.userData.q0=p.quaternion.clone();return p;}
  const box=ms=>{const b=new X.THREE_Box3();ms.forEach(m=>b.expandByObject(m));return b;};
  const all=new X.THREE_Box3().setFromObject(c),cz=(all.min.z+all.max.z)/2;
  for(const k of['doorR','doorL']){const ms=grab(k);
    // all door maths in the car container's LOCAL frame (the viewer has already yawed the car for the camera)
    const hgt=m=>{const bb=new X.THREE_Box3().setFromObject(m);return bb.max.y-bb.min.y;},skin=ms.filter(m=>m.userData.mat==='BODY').sort((p,q)=>hgt(q)-hgt(p))[0];
    const pa=skin.geometry.attributes.position,vs=[];for(let i=0;i<pa.count;i++)vs.push(c.worldToLocal(new V().fromBufferAttribute(pa,i).applyMatrix4(skin.matrixWorld)));
    const side=Math.sign(vs.reduce((t2,v)=>t2+v.z,0))||1;
    const xs=vs.map(v=>v.x),fx=Math.max(...xs),sc=(fx-Math.min(...xs))/1.325,strip=vs.filter(v=>v.x>fx-0.10*sc),sy0=Math.min(...strip.map(v=>v.y)),sy1=Math.max(...strip.map(v=>v.y)),yr=sy1-sy0;
    const at=f=>{const yb=sy0+f*yr,s2=strip.filter(v=>Math.abs(v.y-yb)<0.07*yr);return s2.reduce((a2,v)=>(v.x>a2.x?v:a2),s2[0]).clone();};
    const pB=at(OPEN.hingeY0),pT=at(OPEN.hingeY1);       // straight lower front edge = real hinge line (below the belt curve)
    const hl=pB.clone().add(pT).multiplyScalar(0.5).add(new V(-OPEN.hingeBack*sc,0,-side*OPEN.hingeIn*sc));
    const p=G();c.add(p);p.position.copy(hl);p.updateMatrixWorld(true);ms.forEach(m=>p.attach(m));p.userData.q0=p.quaternion.clone();
    const ax=pT.clone().sub(pB).normalize();
    const Q=p.quaternion.constructor,q=new Q().setFromAxisAngle(ax,0.3),rear=new V(-1,0,0).applyQuaternion(q);p.userData.sgn=(rear.z*side>0)?1:-1;
    p.userData.ax=ax;p.userData.edge=strip.filter(v=>v.x>fx-0.015*sc&&v.y<sy0+0.62*yr);S.hingeD.push(p);
    const p2=G();c.add(p2);p2.position.set(hl.x,sy0+GL.rootUp*sc,hl.z);p2.updateMatrixWorld(true);p2.attach(p);p.userData.q0=p.quaternion.clone();p2.userData.q0=p2.quaternion.clone();p2.userData.side=side;p.userData.p2=p2;}
  {const ms=grab('hatch'),b=box(ms);const hw=new V(b.max.x-0.02,b.max.y-0.015,(b.min.z+b.max.z)/2);const p=pivot(ms,hw),ax=new V(0,0,1);
    const Q=p.quaternion.constructor,q=new Q().setFromAxisAngle(ax,0.3),rear=new V(-1,0,0).applyQuaternion(q);p.userData.sgn=rear.y>0?1:-1;p.userData.ax=ax;S.hingeH=p;
    const gl=ms.filter(m=>m.userData.mat==='GLASS').sort((a2,b2)=>b2.geometry.attributes.position.count-a2.geometry.attributes.position.count)[0],gb=new X.THREE_Box3().setFromObject(gl);
    const lo=c.worldToLocal(gb.min.clone()),hi=c.worldToLocal(gb.max.clone());S.hatchSlope=Math.atan2(Math.abs(hi.y-lo.y),Math.abs(hi.x-lo.x))*180/Math.PI;S.hatchVert=90-S.hatchSlope;
    const hgt2=m=>{const bb=new X.THREE_Box3().setFromObject(m);return bb.max.y-bb.min.y;};
    const sp=ms.filter(m=>m.userData.mat==='CARBON').sort((a2,b2)=>hgt2(a2)-hgt2(b2))[0];S.spoilerName=sp&&sp.name;
    if(sp){const sb=new X.THREE_Box3().setFromObject(sp),sl=c.worldToLocal(sb.getCenter(new V()));const e1=c.worldToLocal(new V(sb.max.x,sb.max.y,sb.max.z)),e0=c.worldToLocal(new V(sb.min.x,sb.min.y,sb.min.z));
      const front=Math.max(e0.x,e1.x),ps=G();p.add(ps);ps.position.copy(p.worldToLocal(c.localToWorld(new V(front,sl.y,sl.z))));ps.updateMatrixWorld(true);ps.attach(sp);ps.userData.q0=ps.quaternion.clone();S.spoilerP=ps;}
    S.wheelG=[];S.wheelN=0;S.extraN=0;S.sc=1;}
  S.ok=true;(window.ZOPEN=window.ZOPEN||{}).parts={doorR:PARTS.doorR.length,doorL:PARTS.doorL.length,hatch:PARTS.hatch.length,missing:S.miss};}
const seg=(g,a,b)=>Math.max(0,Math.min(1,(g-a)/(b-a)));
function apply(){const Q=S.hingeH.quaternion.constructor,V=S.hingeH.position.constructor,D=Math.PI/180,g=S.g;
  const tOpen=ez(seg(g,GL.open[0],GL.open[1])),tLay=ez(seg(g,GL.lay[0],GL.lay[1])),tH=strut(seg(g,GL.hatch[0],GL.hatch[1])),tS=ez(seg(g,GL.spoil[0],GL.spoil[1]));
  for(const p of S.hingeD){p.quaternion.copy(p.userData.q0).multiply(new Q().setFromAxisAngle(p.userData.ax,p.userData.sgn*tOpen*GL.doorDeg*D));
    const p2=p.userData.p2,sd=p2.userData.side;p2.quaternion.copy(p2.userData.q0).multiply(new Q().setFromAxisAngle(new V(1,0,0),sd*tLay*GL.dihedral*D)).multiply(new Q().setFromAxisAngle(new V(0,0,1),tLay*GL.layDeg*D));}
  const hA=tH*(S.hatchVert+GL.hatchExtra),p=S.hingeH;p.quaternion.copy(p.userData.q0).multiply(new Q().setFromAxisAngle(p.userData.ax,p.userData.sgn*hA*D));
  if(S.spoilerP){const ps=S.spoilerP;ps.quaternion.copy(ps.userData.q0).multiply(new Q().setFromAxisAngle(new V(0,0,1),-p.userData.sgn*hA*D*tS));}}
function clamp(v,tg){return Math.max(0,Math.min(1,v));}
window.ZGL={S,GL,ensure(){const X=window.ZD&&ZD.Xray;if(X&&X.ready&&!S.ok)setup(X);return S.ok;},set(g){S.g=g;if(S.ok)apply();}};window.ZOPEN={S,OPEN,GL,edgeGap(){return S.hingeD.map(p=>{const q0=p.userData.q0,Q=p.quaternion.constructor,V=p.position.constructor,q=q0.clone().multiply(new Q().setFromAxisAngle(p.userData.ax,p.userData.sgn*OPEN.doorDeg*Math.PI/180));let mx=0,up=0,out=0;for(const e of p.userData.edge){const r=e.clone().sub(p.position),a2=r.clone().applyQuaternion(q0.clone().invert()).applyQuaternion(q);const d=a2.sub(r);mx=Math.max(mx,d.length());up=Math.max(up,Math.abs(d.y));}return{maxMove:+mx.toFixed(3),maxUp:+up.toFixed(3),axis:p.userData.ax.toArray().map(v=>+v.toFixed(3))};});}};})();
