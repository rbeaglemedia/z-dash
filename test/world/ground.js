'use strict';
// off-road: only while fully rolling (0.3 s after any touchdown / skim / kick), never on roofs
function offRoadK(){if(P.gy>0.3||(P.gT||0)<0.3)return 1;return surfaceAt(P.x,P.z)==='paved'?1:TUNE.offRoad;}
// Four ground surfaces. offRoadK() stays the grass drag scalar; this names the surface for feel + HUD.
// roof (grounded, deck height) wins over the runway box; runway uses Bob's strip, not surfaceAt's narrower paved test.
function surfaceKindAt(x,z,y){
  if(P.ground&&((y||P.y)||0)>0.8)return 'roof';
  if(Math.abs(x)<=18&&z>=-50&&z<=1520&&(y||0)<0.6)return 'runway';
  return surfaceAt(x,z)==='paved'?'road':'grass';
}
// boot.js paints the sky and the ground with a new CanvasGradient every frame.
// Those two are full-height vertical fills on the world canvas. Keep each one
// until H or the horizon moves by more than a pixel. Other gradients (HUD bars)
// are horizontal and fall through to the real allocator.
(function cacheSkyGroundGradients(){
  if(typeof ctx==='undefined'||!ctx||typeof ctx.createLinearGradient!=='function')return;
  const orig=ctx.createLinearGradient.bind(ctx);
  const saved=[];
  function near(a,b){return Math.abs(a-b)<=1;}
  function hit(y0,y1){
    for(let i=0;i<saved.length;i++){
      const s=saved[i];
      if(near(y0,s.y0)&&near(y1,s.y1)&&near(H,s.H)&&s.cw===cv.width&&s.ch===cv.height)return s;
    }
    return null;
  }
  function remember(slot){
    for(let i=saved.length-1;i>=0;i--)if(saved[i].kind===slot.kind)saved.splice(i,1);
    saved.push(slot);
  }
  ctx.createLinearGradient=function(x0,y0,x1,y1){
    if(this!==ctx||x0!==0||x1!==0||!(y1>y0)||Math.abs((y1-y0)-H)>1)return orig(x0,y0,x1,y1);
    const prev=hit(y0,y1);
    if(prev){
      const g=prev.g;let n=0;
      g.addColorStop=function(){if(++n>=prev.n)g.addColorStop=prev.add;};
      return g;
    }
    const g=orig(x0,y0,x1,y1),add=g.addColorStop.bind(g);
    const slot={g,y0,y1,H,add,n:0,cw:cv.width,ch:cv.height,kind:''};
    let stops=0;
    g.addColorStop=function(off,color){
      add(off,color);stops++;
      if(stops===2&&color==='#020203'){slot.kind='ground';slot.n=2;remember(slot);g.addColorStop=add;}
      else if(stops===3&&color==='#ff2a3d'){slot.kind='sky';slot.n=3;remember(slot);g.addColorStop=add;}
    };
    return g;
  };
})();
