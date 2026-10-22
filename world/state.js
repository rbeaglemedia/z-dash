'use strict';
// ===== STATE =====
const P={gy:0,gT:0,gsl:0,nosTank:1,tf:1,lands:0,landKmh:0,ground:false,vs:0,x:0,y:0,z:0,yaw:0,pitch:0,bank:0,v:0,thr:0,stall:false,bounces:0,nosT:0};
function reset(){Object.assign(P,{x:0,z:0,y:0,yaw:0,pitch:0,bank:0,v:0,thr:0,stall:false,ground:true,vs:0,tf:0,wings:0,rotOK:false,nosTank:1,gam:0,hd:0,q:0,wreck:null,sus:0,susV:0,roll:null,flip:null,rec:0,rebT:null,nosLeft:0,hpDebt:0,hards:0,floating:0,lift0:0,slowLaunch:false,aoa:0,slip:0,rebV:0,_climb:0,gy:0,gT:0,gsl:0,walls:0,wallHards:0,lastWall:null,ceil:0,ramps:0,roofs:0,loop:null,inWater:false,_pg:null,hoops:0,loops:0,splash:0,pipeTurns:0,ebK:0,ebSlip:0,donutK:0,ebRoll:0,_ebFx:0});setWings(0,true);try{FX.length=0;showWreck(false);SKID.L.length=0;SKID.R.length=0;}catch(e){}} // starts on the RUNWAY, stopped, car mode
reset();
let flying=false;
