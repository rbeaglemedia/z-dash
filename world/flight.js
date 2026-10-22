'use strict';
// ===== RENDER =====
const FLYCAM={back:10,up:2.0};function rotBar(){const T=TUNE,mx=T.rotateSpeed*1.25,f=Math.min(1,P.v/mx),m=T.rotateSpeed/mx,ok=P.v>=T.rotateSpeed;
  return `<div style="position:relative;width:170px;height:12px;margin-top:4px;border:1px solid ${ok?'#ffb020':'#3ee6ff'};background:rgba(62,230,255,.08)"><div style="width:${f*100}%;height:100%;background:${ok?'#ffb020':'rgba(62,230,255,.6)'}"></div><div style="position:absolute;left:${m*100}%;top:-4px;width:2px;height:18px;background:#ffb020"></div></div><div style="font-size:10px;color:${ok?'#ffb020':'#8a7a7d'}">${ok?'PULL UP!':'ROTATE '+Math.round(T.rotateSpeed*2.237)+' MPH'}</div>`;}
