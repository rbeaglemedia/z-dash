'use strict';
// ===== REAL 370Z (jr.html model + approved zglide transform) composited into the neon world =====
const KID={paint:'#1aa6c8',glow:'#3ee6ff',grid:'#9b5cff',wheel:'#4a4f57',wheelGlow:false,spoiler:null,wings:null,extra:null,extras:[]};
// GARAGEZ phase 1 (Bob, Oct 22): her Garage Z from jr.html's save ('zdash.kid.v1' -> eq), colour data ported from jr.html CAT + look().
// No save / broken save -> KID above untouched (today's cyan look). Garage WINGS hidden all game. DUCK TAIL rides the stock spoiler pivot
// (tilts with the hatch); GT WING / DOUBLE DECKER / LIGHTNING WING shrink out as the hatch opens and grow back as it closes.
const GZ=(()=>{const C={"paint":{"cyan":["#1aa6c8","#3ee6ff","#9b5cff",0,0],"pink":["#e0359f","#ff4fd8","#3ee6ff",0,0],"gun":["#5c6068","#ff2a3d","#ff2a3d",0,0],"lime":["#3cc24a","#7dff6b","#ff4fd8",0,0],"purple":["#6a33d6","#c08bff","#3ee6ff",0,0],"gold":["#d9a514","#ffe14d","#ff4fd8",0,0],"rainbow":["rainbow","#ffffff","#ff4fd8",0,0],"red40":["#8a0f1a","#ff2a3d","#ffe14d",0,0],"gunmetal":["#5c6068","#ff2a3d","#ff2a3d",0,0],"blackout":["#121318","#3a7bff","#3a7bff",0,0],"tuner-orange":["#ff7a1a","#ffe14d","#ff9a3d",0,0],"cop_bw":["#0e0f13","#3a7bff","#ff2a3d",1,"#e9edf2"],"cop_white":["#e6e9ef","#2a6bff","#2a6bff",2,"#1f4fff"],"cop_stealth":["#2a2d33","#9fb4c8","#5a6a7a",3,"#aab4bf"],"cop_interceptor":["#0b0b0e","#ffcf4d","#ffb020",4,"#d9a514"]},"win":{"win-clear":{"color":"#cfe6f5","op":0.28},"win-smoke":{"color":"#5a6470","op":0.55},"win-limo":{"color":"#08090c","op":0.9},"win-ice":{"color":"#8fe3ff","op":0.5,"glow":"#3ee6ff"},"win-purple":{"color":"#8a4dff","op":0.6,"glow":"#9b5cff"},"win-rose":{"color":"#e8a598","op":0.6,"glow":"#ffb7a8"}},"wh":{"w-gun":["#4a4f57",false],"w-black":["#15161a",false],"w-chrome":["#d8dde4",false],"w-gold":["#e0b020",false],"w-cyan":["#3ee6ff",true],"w-pink":["#ff4fd8",true],"w-rainbow":["rainbow",true],"w-fire":["#ff9a2e",true]},"sc":{"sc-match":null,"sc-gloss":{"color":"#0c0c10"},"sc-matte":{"color":"#1b1b20","matte":true},"sc-carbon":{"color":"#ffffff","carbon":true},"sc-chrome":{"color":"#e9edf3","chrome":true},"sc-pink":{"color":"#ff4fd8","neon":true},"sc-cyan":{"color":"#3ee6ff","neon":true},"sc-lime":{"color":"#7dff6b","neon":true},"sc-purple":{"color":"#9b5cff","neon":true}},"st":{"st-stock":"stock","st-low":"low","st-slam":"slam"},"rims":["gtx04","stock","5spoke","steel","star","mesh","deepdish","turbine"],"tires":["street","stretch","slick","offroad","street-white","street-neon"],"sp":["none-s","duck","gtwing","twin","bolt"],"wings":["none-w","jet","butterfly","dragon"]},o={on:false,rimFb:null};
  try{const sv=JSON.parse(localStorage.getItem('zdash.kid.v1')||'null'),e=sv&&sv.eq;if(!e||typeof e!=='object'||Array.isArray(e))return o;
    const pa=C.paint[e.paint]||C.paint.cyan,wh=C.wh[e.wheels]||C.wh['w-gun'];
    let rim=typeof e.rims==='string'?e.rims:'gtx04';if(rim==='gtx01'||(!sv.rimMig&&rim==='stock'))rim='gtx04';if(!C.rims.includes(rim)){o.rimFb=rim;rim='stock';}
    const sp=C.sp.includes(e.spoiler)&&!/^none/.test(e.spoiler)?e.spoiler:null;
    o.k={paint:pa[0],glow:pa[1],grid:pa[2],wheel:wh[0],wheelGlow:wh[1],spoiler:sp,wings:null,extra:null,extras:[],window:C.win[e.windows]||C.win['win-clear'],
      rim,size:[17,18,19,20].includes(+e.size)?+e.size:19,tire:C.tires.includes(e.tires)?e.tires:'street',stance:C.st[e.stance]||'stock',spcol:Object.prototype.hasOwnProperty.call(C.sc,e.spcol)?C.sc[e.spcol]:null};
    o.rb=pa[0]==='rainbow';o.wrb=wh[0]==='rainbow';o.liv=pa[3]||0;o.livC=pa[4]||null;o.id=e.paint;
    if(o.rb){o.k.paint='#ff4fd8';o.k.glow='#ffffff';}if(o.wrb)o.k.wheel='#ff4fd8';o.on=true;}catch(x){o.on=false;}
  return o;})();
if(GZ.on)Object.assign(KID,GZ.k);
function gzFrame(X){if(!GZ.on)return;const t=performance.now()/1000,hue=(t*60)%360;
  if(GZ.rb){KID.paint=`hsl(${hue},90%,55%)`;KID.glow=`hsl(${(hue+120)%360},100%,70%)`;}if(GZ.wrb)KID.wheel=`hsl(${(hue+200)%360},100%,60%)`;
  if(X._gzLv!==GZ.liv&&X.car){X._gzLv=GZ.liv;X.car.traverse(m=>{if(!m.isMesh)return;(Array.isArray(m.material)?m.material:[m.material]).forEach(q=>{if(q&&q.uniforms&&q.uniforms.zLiv){q.uniforms.zLiv.value=GZ.liv;if(GZ.livC)q.uniforms.zLivC.value.set(GZ.livC);}});});}
  const kp=X.kidParts,id=KID.spoiler,pt=kp&&id&&kp[id];if(!pt||!ZGL.S.ok)return;
  if(!GZ.sp){GZ.n=(GZ.n||0)+1;if(GZ.n<3)return;   // wait until the renderer has applied her stance to the kid parts
    if(id==='duck'&&ZGL.S.spoilerP){ZGL.S.spoilerP.attach(pt);GZ.sp={duck:1};}
    else{const B=new X.THREE_Box3().setFromObject(pt),c=pt.parent.worldToLocal(B.getCenter(pt.position.clone()));GZ.sp={c,p0:pt.position.clone()};}}
  if(GZ.sp.duck)return;
  const H=ZGL.GL.hatch,u=Math.max(0,Math.min(1,(ZGL.S.g-H[0])/.18)),k=1-u*u*(3-2*u),sc=Math.max(k,.001);GZ.k1=k;
  pt.scale.setScalar(sc);pt.position.copy(GZ.sp.c).sub(GZ.sp.c.clone().sub(GZ.sp.p0).multiplyScalar(sc));}
window.GZ=GZ;
