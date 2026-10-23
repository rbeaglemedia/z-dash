'use strict';
// On-foot / house hook. Self-contained: driving and flying physics stay where they are.
// split-buttons can show GET OUT when canGetOut() is true — street mode, on the ground, P.v < 3.
// Door slots live on CITY buildings (b.doors = [x, z, nx, nz]); nearestDoor() is the walk-up point.
window.WALK_MODE={
  unlocked:false,onFoot:false,x:0,y:0,z:0,yaw:0,door:null,
  canGetOut(){
    if(this.onFoot)return false;
    if(typeof P==='undefined'||!P||P.wreck)return false;
    return P.driveMode==='street'&&!!P.ground&&P.v<3;
  },
  toggleGetOut(){
    if(this.onFoot){this.onFoot=false;this.door=null;return false;}
    if(!this.canGetOut())return false;
    const yaw=P.yaw||0,side=1.35;
    this.x=P.x-Math.cos(yaw)*side;this.y=P.y||0;this.z=P.z+Math.sin(yaw)*side;this.yaw=yaw;
    this.onFoot=true;this.door=this.nearestDoor(16);
    return true;
  },
  // Closest ground-floor door. From the walker when on foot, otherwise from the Z.
  nearestDoor(maxDist){
    const max=maxDist==null?18:+maxDist;
    if(!isFinite(max)||max<=0)return null;
    if(typeof CITY==='undefined'||!CITY||!CITY.BL)return null;
    const x=this.onFoot?this.x:(typeof P!=='undefined'?P.x:this.x);
    const z=this.onFoot?this.z:(typeof P!=='undefined'?P.z:this.z);
    let best=null,bd=max;
    for(const b of CITY.BL){
      if(!b||!b.doors)continue;
      for(const door of b.doors){
        const dx=door[0]-x,dz=door[1]-z,dist=Math.hypot(dx,dz);
        if(dist>=bd)continue;
        const nx=door[2]||0,nz=door[3]||0;
        bd=dist;
        best={x:door[0],z:door[1],nx,nz,dist,y:0,buildingId:b.id,standX:door[0]+nx*1.05,standZ:door[1]+nz*1.05};
      }
    }
    return best;
  },
  update(dt){
    if(!this.onFoot)return;
    if(typeof P==='undefined'||P.driveMode!=='street'||!P.ground||P.wreck){this.onFoot=false;this.door=null;return;}
    const d=Math.max(0,Math.min(0.05,+dt||0)),n=this.nudge;
    if(n&&(n.x||n.z)){
      const len=Math.hypot(n.x,n.z)||1,sp=3.2;
      this.x+=(n.x/len)*sp*d;this.z+=(n.z/len)*sp*d;this.yaw=Math.atan2(n.x,n.z);
    }
    this.y=P.y||0;
    this.door=this.nearestDoor(14);
  }
};
let walkT=performance.now();
function walkFrame(t){
  const dt=Math.min(0.05,Math.max(0,(t-walkT)/1000));walkT=t;
  try{WALK_MODE.update(dt);}catch(_){}
  requestAnimationFrame(walkFrame);
}
requestAnimationFrame(walkFrame);
