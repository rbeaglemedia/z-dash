'use strict';
// Shared iPad / tablet touch detector. Phones (short side under 680) and
// non-touch desktops stay off this path. iPad Pro widths are touch devices,
// so they never qualify as a desktop PC (that check is !hasTouch && width > 1024).
function zReadIPad(){
  const hasTouch=('ontouchstart' in window)||(navigator.maxTouchPoints>0);
  const isIPadUA=/iPad/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const shortSide=Math.min(window.innerWidth,window.innerHeight);
  const longSide=Math.max(window.innerWidth,window.innerHeight);
  return !!(hasTouch&&(isIPadUA||(shortSide>=680&&longSide>=900)));
}
function zSyncIPad(){
  const isIPad=zReadIPad();
  window.Z_IS_IPAD=isIPad;
  document.documentElement.classList.toggle('ipad-mode',isIPad);
  if(document.body)document.body.classList.toggle('ipad-mode',isIPad);
  return isIPad;
}
// CSS-pixel slots for the iPad top bar. Canvas HUD scales these into the
// backing store; DOM buttons use the CSS-pixel boxes so touch stays 1:1.
let zChrome=null,zChromeK='';
function zIpadChrome(vw,vh){
  vw=vw||window.innerWidth;vh=vh||window.innerHeight;
  const k=vw+'x'+vh;
  if(zChrome&&zChromeK===k)return zChrome;
  zChromeK=k;
  const portrait=vh>vw;
  const edge=16,top=12,btnH=56;
  const pause={x:vw-edge-64,y:top,w:64,h:btnH};
  const exit={x:pause.x-10-118,y:top,w:118,h:btnH};
  const map=portrait?{x:edge,y:top,w:132,h:88}:{x:edge,y:top,w:168,h:104};
  let enter,tilt,tel;
  if(!portrait){
    enter={x:map.x+map.w+12,y:top,w:156,h:btnH};
    const gw=118,gh=58;
    let tx=Math.round(vw/2-gw/2);
    const minX=enter.x+enter.w+10,maxX=exit.x-gw-10;
    if(tx<minX)tx=minX;
    if(tx>maxX)tx=Math.max(minX,maxX);
    tilt={x:tx,y:8,w:gw,h:gh};
    const gapL=Math.max(tilt.x+tilt.w,enter.x+enter.w)+10,gapR=exit.x-10;
    const tw=Math.min(176,gapR-gapL);
    if(tw>=120)tel={x:gapR-tw,y:8,w:tw,h:62};
    else tel={x:Math.max(edge,vw-126-168),y:Math.max(map.y+map.h,tilt.y+tilt.h)+10,w:168,h:86};
  }else{
    enter={x:edge,y:map.y+map.h+10,w:168,h:btnH};
    const gw=112,gh=56;
    const minX=map.x+map.w+8,maxX=exit.x-gw-8;
    let tx=Math.round((minX+maxX)/2-gw/2);
    tx=Math.max(minX,Math.min(tx,maxX));
    tilt={x:tx,y:top,w:gw,h:gh};
    const telW=160;
    tel={x:vw-edge-telW,y:Math.max(exit.y+exit.h,enter.y+enter.h)+10,w:telW,h:86};
  }
  zChrome={portrait:portrait,map:map,enter:enter,exit:exit,pause:pause,tilt:tilt,tel:tel};
  return zChrome;
}
window.zReadIPad=zReadIPad;
window.zSyncIPad=zSyncIPad;
window.zIpadChrome=zIpadChrome;
zSyncIPad();
addEventListener('resize',zSyncIPad);
addEventListener('orientationchange',zSyncIPad);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',zSyncIPad);
