'use strict';
// Optional 25s Hot Drop beacon. Spawned once on the first grounded touchdown after a Sky Drop.
window.HOTDROP={active:false,x:0,z:0,y:0,r:16,tLeft:0,maxT:25,overchargeT:0,claimed:0,spawned:0,
  spawn(fromX,fromZ,yaw){
    const spot=hotDropSpot(fromX,fromZ,yaw||0);
    this.x=spot.x;this.y=0;this.z=spot.z;this.r=16;
    this.active=true;this.tLeft=25;this.maxT=25;this.spawned++;
    if(typeof wMsg==='function')wMsg('⚡ HOT DROP NEARBY!','#ffe14d','optional 25s sprint · follow the ★ on the map!');
  },
  update(dt){
    if(this.overchargeT>0){this.overchargeT=Math.max(0,this.overchargeT-dt);P.nosTank=1;}
    if(!this.active)return;
    this.tLeft-=dt;
    if(Math.hypot(P.x-this.x,P.z-this.z)<=18&&Math.abs(P.y-this.y)<=22){
      this.active=false;this.claimed++;this.overchargeT=15;P.nosTank=1;
      if(typeof fxBurst==='function')fxBurst('spark',45);
      if(typeof wMsg==='function')wMsg('🔥 HOT DROP CLAIMED!','#7dff6b','15s OVERCHARGED UNLIMITED NOS!');
      return;
    }
    if(this.tLeft<=0){this.active=false;this.tLeft=0;}
  },
  draw(){
    if(!this.active)return;
    const t=(performance.now()||0)/1000,x=this.x,y=this.y,z=this.z;
    ctx.save();ctx.lineCap='round';ctx.shadowColor='#ffe14d';ctx.shadowBlur=16;
    for(let i=0;i<8;i++){const a=t*1.35+i*Math.PI/4,rad=0.7+((i%3)===0?1.5:0.35);
      const ox=Math.cos(a)*rad,oz=Math.sin(a)*rad,col=i%2?'#3ee6ff':'#ffe14d';
      line([x+ox,y,z+oz],[x+ox,y+140,z+oz],col,i%2?2.2:3.4);}
    line([x,y,z],[x,y+140,z],'#fff6c2',1.6);
    const pulse=0.86+0.16*Math.sin(t*5),R=(this.r||16)*pulse,spin=t*1.7,N=32;
    let prev=null;
    for(let i=0;i<=N;i++){const a=spin+i/N*Math.PI*2,p=[x+Math.cos(a)*R,y+0.35,z+Math.sin(a)*R];
      if(prev)line(prev,p,i%2?'#ffe14d':'#3ee6ff',3.2);prev=p;}
    prev=null;const R2=R*0.55;
    for(let i=0;i<=N;i++){const a=-spin*1.3+i/N*Math.PI*2,p=[x+Math.cos(a)*R2,y+0.55,z+Math.sin(a)*R2];
      if(prev)line(prev,p,'#ffe14d',2);prev=p;}
    const hy=y+7.5+Math.sin(t*2.4)*1.5,s=3.4,dA=spin*0.65;
    const pts=[];for(let i=0;i<4;i++){const a=dA+i*Math.PI/2;pts.push([x+Math.cos(a)*s,hy,z+Math.sin(a)*s]);}
    const top=[x,hy+4.4,z],bot=[x,hy-2.4,z];
    for(let i=0;i<4;i++){const a=pts[i],b=pts[(i+1)%4],col=i%2?'#3ee6ff':'#ffe14d';
      line(a,b,col,2.6);line(a,top,'#ffe14d',2);line(a,bot,'#3ee6ff',2);}
    const cy=hy+8.2;
    line([x,cy+3.2,z],[x-2.4,cy,z],'#ffe14d',2.6);line([x,cy+3.2,z],[x+2.4,cy,z],'#3ee6ff',2.6);
    line([x-2.4,cy,z],[x,cy-1.4,z],'#ffe14d',2);line([x+2.4,cy,z],[x,cy-1.4,z],'#3ee6ff',2);
    ctx.restore();
  }};
function hotDropSpot(fromX,fromZ,yaw){
  const R=(typeof CITY!=='undefined'&&CITY.ROADS)?CITY.ROADS:null,fx=Math.sin(yaw),fz=Math.cos(yaw);
  const score=(x,z,kind,id)=>{if(kind==='tunnel'||kind==='track')return null;const dx=x-fromX,dz=z-fromZ,dist=Math.hypot(dx,dz);if(dist<200||dist>340)return null;
    const ahead=(dx*fx+dz*fz)/dist,street=kind==='street'?80:(kind==='highway'||kind==='bridge'?18:8);
    return street+ahead*50+12*(1-Math.abs(dist-270)/70)-(id||0)*1e-6;};
  let best=null,bestS=-1e9;
  if(R){for(const n of R.nodes){if(!n)continue;const s=score(n.x,n.z,n.kind,n.id);if(s!=null&&s>bestS){bestS=s;best={x:n.x,z:n.z};}}
    if(!best)for(const e of R.edges){if(!e||e.kind==='tunnel'||e.kind==='track')continue;const A=R.nodes[e.a],B=R.nodes[e.b];if(!A||!B)continue;
      for(const u of[0.35,0.5,0.65]){const x=A.x+(B.x-A.x)*u,z=A.z+(B.z-A.z)*u,s=score(x,z,e.kind,e.id);if(s!=null&&s>bestS){bestS=s;best={x,z};}}}}
  if(best)return best;
  const px=fromX+fx*260,pz=fromZ+fz*260;
  if(R){let nd=1e9,nn=null;for(const n of R.nodes){if(!n||n.kind==='tunnel'||n.kind==='track')continue;const od=Math.hypot(n.x-fromX,n.z-fromZ);if(od<200||od>340)continue;const d=Math.hypot(n.x-px,n.z-pz);if(d<nd){nd=d;nn=n;}}
    if(nn)return{x:nn.x,z:nn.z};}
  return{x:px,z:pz};}
