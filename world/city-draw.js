'use strict';
// ---------- render ----------
const CDRAW={dist:950,far:170,winDist:90,streets:360,outline:1900};
function cpoly(c){const o=[];for(let i=0;i<c.length;i++){const a=c[i],b=c[(i+1)%c.length],ai=a[2]>=NEAR,bi=b[2]>=NEAR;if(ai)o.push(a);if(ai!==bi){const t=(NEAR-a[2])/(b[2]-a[2]);o.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,NEAR]);}}return o;}
let PT=null;function pathPoly(c){const o=cpoly(c);if(o.length<3)return;const f=H*0.9,g=PT||ctx;for(let i=0;i<o.length;i++){const q=o[i],X=W/2+q[0]*f/q[2],Y=H/2-q[1]*f/q[2];i?g.lineTo(X,Y):g.moveTo(X,Y);}g.closePath();}
function pathSeg(a,b){let p=camS(a[0],a[1],a[2]),q=camS(b[0],b[1],b[2]);if(p[2]<NEAR&&q[2]<NEAR)return;if(p[2]<NEAR||q[2]<NEAR){const t=(NEAR-p[2])/(q[2]-p[2]),m=[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t,NEAR];if(p[2]<NEAR)p=m;else q=m;}const f=H*0.9,g=PT||ctx;g.moveTo(W/2+p[0]*f/p[2],H/2-p[1]*f/p[2]);g.lineTo(W/2+q[0]*f/q[2],H/2-q[1]*f/q[2]);}
const wpoly=(pts)=>pathPoly(pts.map(p=>camS(p[0],p[1],p[2])));
function pathLine(pts){for(let i=1;i<pts.length;i++)pathSeg(pts[i-1],pts[i]);}
function boxFaces(q){const C=[];for(const y of[q.y0,q.y1])for(const[x,z]of[[q.x0,q.z0],[q.x1,q.z0],[q.x1,q.z1],[q.x0,q.z1]])C.push(camS(x,y,z));
  if(cam.x<q.x0)pathPoly([C[0],C[3],C[7],C[4]]);else if(cam.x>q.x1)pathPoly([C[1],C[2],C[6],C[5]]);
  if(cam.z<q.z0)pathPoly([C[0],C[1],C[5],C[4]]);else if(cam.z>q.z1)pathPoly([C[3],C[2],C[6],C[7]]);
  if(cam.y>q.y1)pathPoly([C[4],C[5],C[6],C[7]]);else if(cam.y<q.y0)pathPoly([C[0],C[1],C[2],C[3]]);}
// windows: human-scale floors (3.5 m) above a 4.5 m ground floor; the ground floor itself gets doors (drawBldg)
function winRows(b,q,d){const st=d<120?FLOORH:FLOORH*2,s=H*0.9/d;let any=false;
  for(let y=q.y0+(q.y0>0?2:GFH+1.8);y<q.y1-1.5;y+=st){if(((Math.floor(y/st)*31+b.wseed)%7)===0)continue;
    if(cam.x<q.x0){pathSeg([q.x0-.2,y,q.z0+2],[q.x0-.2,y,q.z1-2]);any=true;}else if(cam.x>q.x1){pathSeg([q.x1+.2,y,q.z0+2],[q.x1+.2,y,q.z1-2]);any=true;}
    if(cam.z<q.z0){pathSeg([q.x0+2,y,q.z0-.2],[q.x1-2,y,q.z0-.2]);any=true;}else if(cam.z>q.z1){pathSeg([q.x0+2,y,q.z1+.2],[q.x1-2,y,q.z1+.2]);any=true;}}
  return s;}
const GFH=4.5,FLOORH=3.5;
function drawSign(g,d){const fr=(cam.x-g.x)*g.nx+(cam.z-g.z)*g.nz;if(fr<=0||d>520)return;const tx=-g.nz,tz=g.nx,hw=g.w/2,hh=g.h/2;
  const pts=[[g.x-tx*hw,g.y-hh,g.z-tz*hw],[g.x+tx*hw,g.y-hh,g.z+tz*hw],[g.x+tx*hw,g.y+hh,g.z+tz*hw],[g.x-tx*hw,g.y+hh,g.z-tz*hw]];
  ctx.beginPath();wpoly(pts);ctx.fillStyle='#07030d';ctx.fill();ctx.strokeStyle=g.c;ctx.lineWidth=d<200?2.4:1.4;ctx.shadowColor=g.c;ctx.shadowBlur=d<90?8:0;ctx.stroke();
  const a=proj(...pts[0]),b=proj(...pts[1]),c=proj(g.x,g.y,g.z),e=proj(g.x,g.y+hh,g.z);if(a&&b&&c&&e&&d<380){const pw=Math.hypot(b[0]-a[0],b[1]-a[1]),ph=Math.abs(c[1]-e[1])*1.5,fs=Math.min(ph,pw/(g.t.length*.68));
    if(fs>=5){ctx.font=`900 ${fs.toFixed(1)}px system-ui,Arial,sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=g.c;ctx.fillText(g.t,c[0],c[1]);}}ctx.shadowBlur=0;}
function drawDeco(b,d){const t=P.simT||0;for(const k of b.deco){
  if(k[0]==='pad'){const p=k[1];if(cam.y<p.y)continue;ctx.beginPath();const n=18;const pts=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2;pts.push([p.x+Math.cos(a)*p.r,p.y+.05,p.z+Math.sin(a)*p.r]);}wpoly(pts);
    pathSeg([p.x-p.r*.35,p.y+.05,p.z-p.r*.45],[p.x-p.r*.35,p.y+.05,p.z+p.r*.45]);pathSeg([p.x+p.r*.35,p.y+.05,p.z-p.r*.45],[p.x+p.r*.35,p.y+.05,p.z+p.r*.45]);pathSeg([p.x-p.r*.35,p.y+.05,p.z],[p.x+p.r*.35,p.y+.05,p.z]);
    ctx.strokeStyle=p.hit?'#ffb020':'#7dff6b';ctx.lineWidth=2.5;ctx.stroke();
    if(d<900){ctx.beginPath();for(const[x,z]of[[p.x0+1,p.z0+1],[p.x1-1,p.z0+1],[p.x1-1,p.z1-1],[p.x0+1,p.z1-1]])pathSeg([x,p.y,z],[x,p.y+1,z]);ctx.strokeStyle=(t*2%1)<.5?'#7dff6b':'#1d5a2a';ctx.lineWidth=3;ctx.stroke();}}
  else if(k[0]==='sign')drawSign(k[1],d);
  else if(k[0]==='ant'){const[,x,z,y,h]=k;ctx.beginPath();pathSeg([x,y,z],[x,y+h,z]);ctx.strokeStyle='#8a7a9d';ctx.lineWidth=1.5;ctx.stroke();const p=proj(x,y+h,z);if(p&&(t%1.2)<.6){ctx.fillStyle='#ff2a3d';ctx.beginPath();ctx.arc(p[0],p[1],Math.max(1.5,H*1.2/p[2]),0,7);ctx.fill();}}
  else if(k[0]==='tank'&&d<700){const[,x,z,y]=k;ctx.beginPath();const r=3,h=5;wpoly([[x-r,y+2,z],[x+r,y+2,z],[x+r,y+2+h,z],[x-r,y+2+h,z]]);pathSeg([x-r*.7,y,z],[x-r*.7,y+2,z]);pathSeg([x+r*.7,y,z],[x+r*.7,y+2,z]);ctx.fillStyle='#120a18';ctx.fill();ctx.strokeStyle='#ffb020';ctx.lineWidth=1.2;ctx.stroke();}
  else if(k[0]==='cable'){const[,x,z,y]=k;ctx.beginPath();for(const dz of[-30,-15,15,30])pathSeg([x,y,z],[x,0.5,z+dz*1.0]);pathSeg([x,y,z],[x,0.5,z-60]);pathSeg([x,y,z],[x,0.5,z+60]);ctx.strokeStyle='#ffb020';ctx.lineWidth=1.3;ctx.stroke();}
  else if(k[0]==='lamp'){const[,x,z,y]=k;const p=proj(x,y+1,z);if(p){ctx.fillStyle='#fff2c0';ctx.shadowColor='#fff2c0';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(p[0],p[1],Math.max(2,H*3/p[2]),0,7);ctx.fill();ctx.shadowBlur=0;}}}}
// doors stay visible out to 150 m in both modes. Street Mode, on the ground under 12 m/s and within 30 m, adds a filled panel.
function drawDoors(b,d){if(!b.doors||d>150)return;const q=b.boxes[0];ctx.beginPath();
  if(cam.x<q.x0)pathSeg([q.x0-.2,GFH,q.z0],[q.x0-.2,GFH,q.z1]);else if(cam.x>q.x1)pathSeg([q.x1+.2,GFH,q.z0],[q.x1+.2,GFH,q.z1]);if(cam.z<q.z0)pathSeg([q.x0,GFH,q.z0-.2],[q.x1,GFH,q.z0-.2]);else if(cam.z>q.z1)pathSeg([q.x0,GFH,q.z1+.2],[q.x1,GFH,q.z1+.2]);
  ctx.strokeStyle=b.c;ctx.globalAlpha=.55;ctx.lineWidth=1.2;ctx.stroke();ctx.globalAlpha=1;
  const close=P.driveMode==='street'&&P.ground&&Math.abs(P.v)<12&&d<30,panels=[];ctx.beginPath();
  for(const[x,z,nx,nz]of b.doors){if((cam.x-x)*nx+(cam.z-z)*nz<=0)continue;const tx=-nz*.7,tz=nx*.7,ox=nx*.15,oz=nz*.15,rect=[[x-tx+ox,0,z-tz+oz],[x-tx+ox,2.4,z-tz+oz],[x+tx+ox,2.4,z+tz+oz],[x+tx+ox,0,z+tz+oz]];pathLine(rect);if(close)panels.push(rect);}
  ctx.strokeStyle=b.wc;ctx.lineWidth=d<60?2:1.3;ctx.stroke();
  if(!panels.length)return;drawDoors.extra=(drawDoors.extra||0)+panels.length;ctx.beginPath();for(const rect of panels)wpoly(rect);ctx.fillStyle='#14081c';ctx.fill();
  ctx.beginPath();for(const rect of panels){pathSeg(rect[1],rect[2]);const mx=(rect[0][0]*3+rect[3][0])/4,mz=(rect[0][2]*3+rect[3][2])/4;pathSeg([mx,0.9,mz],[mx,1.35,mz]);}ctx.strokeStyle='#ffe14d';ctx.lineWidth=2.2;ctx.stroke();}
// far buildings (> CDRAW.far) and outline blocks: one cheap whole box per building box (every wall that faces the camera, plus the roof).
// Same faces as the near draw, batched into one fill and one stroke per colour, so nothing pops in as a single wall.
const FARB=new Map();let FARF=null,FARD=0,FARN=0;function farFlush(){if(FARF){ctx.fillStyle='#0a0612';ctx.fill(FARF);FARF=null;}if(!FARB.size){FARN=0;return;}const d0=FARN||FARD;ctx.lineWidth=d0<400?1.8:1.2;ctx.globalAlpha=clamp(1.5-d0/CDRAW.dist,.25,1);for(const[c,p]of FARB){ctx.strokeStyle=c;ctx.stroke(p);}ctx.globalAlpha=1;FARB.clear();FARN=0;}
function farSil(q){const P8=[];for(const y of[q.y0,q.y1])for(const[x,z]of[[q.x0,q.z0],[q.x1,q.z0],[q.x1,q.z1],[q.x0,q.z1]])P8.push(camS(x,y,z));
  const edge=(i,j)=>{let a=P8[i],b=P8[j];if(a[2]<NEAR&&b[2]<NEAR)return;if(a[2]<NEAR||b[2]<NEAR){const t=(NEAR-a[2])/(b[2]-a[2]),m=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,NEAR];if(a[2]<NEAR)a=m;else b=m;}const f=H*0.9;PT.moveTo(W/2+a[0]*f/a[2],H/2-a[1]*f/a[2]);PT.lineTo(W/2+b[0]*f/b[2],H/2-b[1]*f/b[2]);};
  const face=(ids)=>{for(let k=0;k<4;k++)edge(ids[k],ids[(k+1)%4]);if(FARF){const ink=PT;PT=FARF;const f4=[P8[ids[0]],P8[ids[1]],P8[ids[2]],P8[ids[3]]];let ar=0;for(let k=0;k<4;k++){const u=f4[k],v=f4[(k+1)%4];ar+=(u[0]/Math.max(u[2],NEAR))*(v[1]/Math.max(v[2],NEAR))-(v[0]/Math.max(v[2],NEAR))*(u[1]/Math.max(u[2],NEAR));}pathPoly(ar<0?f4.reverse():f4);PT=ink;}};
  if(farSil.o){face([0,1,2,3]);face([4,5,6,7]);edge(0,4);edge(1,5);edge(2,6);edge(3,7);return;}
  if(cam.x<q.x0)face([0,3,7,4]);else if(cam.x>q.x1)face([1,2,6,5]);if(cam.z<q.z0)face([0,1,5,4]);else if(cam.z>q.z1)face([3,2,6,7]);if(cam.y>q.y1)face([4,5,6,7]);else if(cam.y<q.y0)face([0,1,2,3]);}
function drawBldg(b,d){if(b.towCab&&TOW3.on(d))return;const ol=b.kind==='outline';if(CDRAW.nonear&&d<=CDRAW.far&&!ol)return;if(d>CDRAW.far||ol){if(CDRAW.nofar||(!ol&&d>CDRAW.far*3.5&&b.top<12))return;if(!FARF){FARF=new Path2D();FARD=d;}FARN=d;farSil.o=ol;let p=FARB.get(b.c);if(!p){p=new Path2D();FARB.set(b.c,p);}farSil.o=false;PT=p;for(const q of b.boxes)farSil(q);PT=null;farFlush();
    if(!ol&&d<520)for(const k of b.deco)if(k[0]==='sign'){farFlush();drawSign(k[1],d);}return;}farFlush();const a=clamp(1.5-d/CDRAW.dist,0.25,1);
  ctx.beginPath();for(const q of b.boxes)boxFaces(q);ctx.fillStyle=b.kind==='hill'?'#05100a':'#0a0612';ctx.fill();ctx.globalAlpha=a;ctx.strokeStyle=b.c;ctx.lineWidth=d<400?1.8:1.2;ctx.stroke();
  if(d<CDRAW.winDist&&b.kind!=='pylon'&&b.kind!=='bill'){ctx.beginPath();let s=1;for(const q of b.boxes)s=winRows(b,q,d);const lw=clamp(s*1.1,1,3.5);ctx.setLineDash([Math.max(1,b.dash[0]*s),Math.max(1.5,b.dash[1]*s)]);ctx.lineDashOffset=b.wseed%7;ctx.strokeStyle=b.wc;ctx.globalAlpha=a*.75;ctx.lineWidth=lw;ctx.stroke();ctx.setLineDash([]);}
  ctx.globalAlpha=a;drawDoors(b,d);drawDeco(b,d);ctx.globalAlpha=1;}
// ramps: shared geometry per profile, batched into one fill + one stroke per style (marked = neon lip + chevrons, hidden = dim edges only)

function drawBanks(cx,R){const C=CITY,V=C.RIV,x0=cx-R,x1=cx+R,runs=[];let a=x0;for(const[b0,b1]of C.BRIDGES.slice().sort((p,q)=>p[0]-q[0])){if(b0>a)runs.push([a,Math.min(b0,x1)]);a=Math.max(a,b1);}if(a<x1)runs.push([a,x1]);
  for(const s of[0,1]){const zL=s?V.z1+V.land:V.z0-V.land,zT=s?V.z1:V.z0,zW=s?V.z1-V.wet:V.z0+V.wet,face=new Path2D(),edge=new Path2D();
    for(const[r0,r1]of runs){if(r1-r0<1)continue;const xs=[];const st=Math.max(8,(r1-r0)/40);for(let x=r0;x<r1;x+=st)xs.push(x);xs.push(r1);
      const top=xs.map(x=>[x,C.riverY(x,zT)+.03,zT]);PT=face;wpoly([[r0,0,zL],[r1,0,zL]].concat(top.slice().reverse()));wpoly(top.concat([[r1,-V.sink,zW],[r0,-V.sink,zW]]));
      PT=edge;pathLine(top);pathLine(xs.map(x=>[x,0.03,zL]));}
    PT=null;ctx.fillStyle='#0b1630';ctx.fill(face);ctx.strokeStyle='#3ee6ff';ctx.lineWidth=2.4;ctx.stroke(edge);}}
function drawTrack(cx,cz){const C=CITY,T=C.TRACK;if(Math.hypot(cx-T.cx,cz-T.cz)>CDRAW.dist+300)return;const out=C.trackPts(T.w/2,14),inn=C.trackPts(-T.w/2,14).reverse();
  ctx.beginPath();wpoly(out.map(p=>[p[0],0.02,p[1]]));wpoly(inn.map(p=>[p[0],0.02,p[1]]));ctx.fillStyle='#0e0a16';ctx.fill('evenodd');
  ctx.beginPath();pathLine(out.concat([out[0]]).map(p=>[p[0],0.04,p[1]]));ctx.strokeStyle='#3ee6ff';ctx.lineWidth=2.2;ctx.stroke();
  ctx.beginPath();pathLine(inn.concat([inn[0]]).map(p=>[p[0],0.04,p[1]]));ctx.strokeStyle='#ff4fd8';ctx.stroke();
  if(Math.hypot(cx-T.cx,cz-T.cz)<700){ctx.beginPath();const md=C.trackPts(0,14);for(let i=0;i<md.length;i+=1){const a=md[i],b=md[(i+1)%md.length];pathSeg([a[0],0.04,a[1]],[(a[0]+b[0])/2,0.04,(a[1]+b[1])/2]);}ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=1.2;ctx.stroke();
    ctx.beginPath();for(let i=0;i<6;i++){const x=T.cx+T.R-T.w/2+i*T.w/6;pathSeg([x,0.05,T.cz],[x+T.w/12,0.05,T.cz]);pathSeg([x+T.w/12,0.05,T.cz+2],[x+T.w/6,0.05,T.cz+2]);}ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.stroke();}}
function drawPipe(Pp,d){if(d>CDRAW.dist)return;const C=CITY,xs=[];for(let i=0;i<=24;i++)xs.push(Pp.x0+(Pp.x1-Pp.x0)*i/24);const prof=z=>xs.map(x=>[x,C.pipeY(Pp,x)+.03,z]);
  ctx.beginPath();for(const z of[Pp.z0,Pp.z1])wpoly(prof(z).concat([[Pp.x1,0,z],[Pp.x0,0,z]]));ctx.fillStyle='#120a1c';ctx.fill();
  ctx.beginPath();for(let z=Pp.z0;z<=Pp.z1+.1;z+=20)pathLine(prof(z));ctx.strokeStyle='rgba(62,230,255,.55)';ctx.lineWidth=1.2;ctx.stroke();
  ctx.beginPath();const dk=Pp.F/2+Pp.C;for(const x of[Pp.cx-dk,Pp.cx+dk,Pp.cx-Pp.F/2,Pp.cx+Pp.F/2])pathSeg([x,C.pipeY(Pp,x)+.05,Pp.z0],[x,C.pipeY(Pp,x)+.05,Pp.z1]);ctx.strokeStyle='#ff4fd8';ctx.lineWidth=2.6;ctx.stroke();}
function drawLoop(L,d){if(d>CDRAW.dist)return;ctx.beginPath();const n=40;for(const s of[-1,1]){const pts=[];for(let i=0;i<=n;i++){const th=i/n*2*Math.PI,f=L.R*Math.sin(th),y=L.R*(1-Math.cos(th))+.1,lat=L.off*th/(2*Math.PI)+s*L.w/2;pts.push([L.x+L.ux*f+L.uz*lat,y,L.z+L.uz*f-L.ux*lat]);}pathLine(pts);}
  ctx.strokeStyle='#ffb020';ctx.lineWidth=d<300?3:1.8;ctx.shadowColor='#ffb020';ctx.shadowBlur=10;ctx.stroke();ctx.shadowBlur=0;
  if(d<400){ctx.beginPath();for(let i=0;i<n;i+=2){const th=i/n*2*Math.PI,f=L.R*Math.sin(th),y=L.R*(1-Math.cos(th))+.1,lat=L.off*th/(2*Math.PI);pathSeg([L.x+L.ux*f+L.uz*(lat-L.w/2),y,L.z+L.uz*f-L.ux*(lat-L.w/2)],[L.x+L.ux*f+L.uz*(lat+L.w/2),y,L.z+L.uz*f-L.ux*(lat+L.w/2)]);}ctx.strokeStyle='rgba(255,176,32,.35)';ctx.lineWidth=1;ctx.stroke();}}
function drawHoop(h,d){if(d>700)return;ctx.beginPath();const pts=[];for(let i=0;i<20;i++){const a=i/20*Math.PI*2;pts.push([h.x+h.nz*Math.cos(a)*h.r,h.y+Math.sin(a)*h.r,h.z-h.nx*Math.cos(a)*h.r]);}wpoly(pts);const flash=h.hitT!=null&&((P.simT||0)-h.hitT)<1.5;ctx.strokeStyle=flash?'#7dff6b':'#ff4fd8';ctx.lineWidth=d<200?3:1.6;ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=10;ctx.stroke();ctx.shadowBlur=0;}
{for(const t of CITY.TOWS)CITY.DYN.push({x:t.x,z:t.z,y:1.5,rad:9,draw:d=>drawTow(t,d)});for(const Pp of CITY.PIPES)CITY.DYN.push({x:Pp.cx,z:(Pp.z0+Pp.z1)/2,y:0,rad:70,draw:d=>drawPipe(Pp,d)});for(const L of CITY.LOOPS)CITY.DYN.push({x:L.x+L.ux*0+L.uz*L.off/2,z:L.z,y:L.R,rad:20,draw:d=>drawLoop(L,d)});for(const h of CITY.HOOPS)CITY.DYN.push({x:h.x,z:h.z,y:h.y,rad:8,draw:d=>drawHoop(h,d)});}
// cyan street edges, split where a blockedBy building footprint crosses the span (pad decks that cover a side street)
function roadFeet(){const ids=new Set();for(const e of (CITY.ROADS&&CITY.ROADS.edges)||[]){if(!e)continue;for(const b of e.blockedBy||[])if(b&&b.oid!=null)ids.add(b.oid);}const out=[];
  for(const b of CITY.buildings||CITY.BL){if(!ids.has(b.oid)||!b.boxes)continue;for(const q of b.boxes)if((q.y0||0)<=1.2&&q.y1>1)out.push(q);}return out;}
function cutSpan(a,b,cuts){let seg=[[a,b]];for(const[c0,c1]of cuts){if(!(c1>c0))continue;const next=[];for(const[s0,s1]of seg){if(c1<=s0||c0>=s1){next.push([s0,s1]);continue;}if(c0>s0+0.05)next.push([s0,c0]);if(c1<s1-0.05)next.push([c1,s1]);}seg=next;if(!seg.length)break;}return seg;}
function drawRoads(cx,cz){cx=cx==null?cam.x:cx;cz=cz==null?cam.z:cz;const C=CITY,RS=CDRAW.streets,feet=roadFeet(),z0=Math.max(C.ZS0,cz-RS),z1=Math.min(C.ZS1,cz+RS),x0=Math.max(C.XS0,cx-RS),x1=Math.min(C.XS1,cx+RS);
  const emitZ=(x,za,zb)=>{if(!(zb>za))return;const cuts=[];for(const q of feet)if(x>q.x0&&x<q.x1&&q.z1>za&&q.z0<zb)cuts.push([Math.max(za,q.z0),Math.min(zb,q.z1)]);for(const[s0,s1]of cutSpan(za,zb,cuts))if(s1-s0>0.4)pathSeg([x,0.02,s0],[x,0.02,s1]);};
  const emitX=(z,xa,xb)=>{if(xb<xa){const t=xa;xa=xb;xb=t;}if(!(xb>xa))return;const cuts=[];for(const q of feet)if(z>q.z0&&z<q.z1&&q.x1>xa&&q.x0<xb)cuts.push([Math.max(xa,q.x0),Math.min(xb,q.x1)]);for(const[s0,s1]of cutSpan(xa,xb,cuts))if(s1-s0>0.4)pathSeg([s0,0.02,z],[s1,0.02,z]);};
  ctx.beginPath();
  for(const X of C.roadsX){if(Math.abs(X-cx)>RS)continue;for(const e of[-10,10]){const zb=Math.max(z0,C.ZS0),ze=Math.min(z1,C.ZS1);if(ze<=zb)continue;if(zb<1700&&ze>1900){emitZ(X+e,zb,1700);emitZ(X+e,1900,ze);}else if(zb<1700||ze>1900)emitZ(X+e,Math.max(zb,ze>1900&&zb>=1700?1900:zb),Math.min(ze,zb<1700&&ze<=1900?1700:ze));}}
  for(const z of C.roadsZ){if(Math.abs(z-cz)>RS)continue;for(const e of[-10,10])for(const s of[-1,1]){const a=s>0?140:-C.XS1,b2=s>0?C.XS1:-140,xa=Math.max(a,x0),xb=Math.min(b2,x1);if(xb>xa)emitX(z+e,xa,xb);}}
  if(Math.abs(cz-1100)<RS)for(const e of[-10,10])emitX(1100+e,C.XS1,C.TRACK.cx-C.TRACK.R-C.TRACK.w/2);
  ctx.strokeStyle='rgba(62,230,255,.35)';ctx.lineWidth=1.2;ctx.stroke();}
function drawCityGround(){const cx=cam.x,cz=cam.z,R=CDRAW.dist,C=CITY;ctx.save();
  // river + bridge decks + bank lips
  const nearR=Math.abs(cz-(C.RIV.z0+C.RIV.z1)/2)<R;if(nearR){ctx.beginPath();wpoly([[cx-3000,0,C.RIV.z0],[cx+3000,0,C.RIV.z0],[cx+3000,0,C.RIV.z1],[cx-3000,0,C.RIV.z1]]);ctx.fillStyle='#03132e';ctx.fill();
  ctx.beginPath();for(let k=0;k<4;k++){const z=C.RIV.z0+8+k*14,o=((P.simT||0)*6+k*37)%60;for(let x=Math.floor((cx-R)/60)*60;x<cx+R;x+=60)pathSeg([x+o,0,z],[x+o+22,0,z]);}ctx.strokeStyle='rgba(62,230,255,.35)';ctx.lineWidth=1;if(Math.abs(cz-C.RIV.z0)<600)ctx.stroke();
  if(Math.abs(cz-C.RIV.z0)<700)drawBanks(cx,Math.min(R,900));
  ctx.beginPath();for(const bx of[0,C.HW.x]){const w=bx?C.HW.hw:14;wpoly([[bx-w,0.05,C.RIV.z0-4],[bx+w,0.05,C.RIV.z0-4],[bx+w,0.05,C.RIV.z1+4],[bx-w,0.05,C.RIV.z1+4]]);}ctx.fillStyle='#120a18';ctx.fill();
  ctx.beginPath();for(const bx of[0,C.HW.x]){const w=bx?C.HW.hw:14;for(const s of[-1,1]){pathSeg([bx+s*w,1.2,C.RIV.z0-4],[bx+s*w,1.2,C.RIV.z1+4]);pathSeg([bx+s*w,0,C.RIV.z0-4],[bx+s*w,0,C.RIV.z1+4]);}}ctx.strokeStyle='#ffb020';ctx.lineWidth=1.6;ctx.stroke();}
  // park + stadium field
  ctx.beginPath();if(Math.hypot(cx+250,cz-1100)<R)wpoly([[C.PARK.x0,0,C.PARK.z0],[C.PARK.x1,0,C.PARK.z0],[C.PARK.x1,0,C.PARK.z1],[C.PARK.x0,0,C.PARK.z1]]);if(Math.hypot(cx-C.STAD.x,cz-C.STAD.z)<R){const pts=[];for(let i=0;i<20;i++){const a=i/20*Math.PI*2;pts.push([C.STAD.x+Math.cos(a)*(C.STAD.r-14),0,C.STAD.z+Math.sin(a)*(C.STAD.r-14)*.8]);}wpoly(pts);}ctx.fillStyle='#062a12';ctx.fill();
  if(Math.hypot(cx-C.STAD.x,cz-C.STAD.z)<R*.6){ctx.beginPath();wpoly([[C.STAD.x-50,0.05,C.STAD.z-30],[C.STAD.x+50,0.05,C.STAD.z-30],[C.STAD.x+50,0.05,C.STAD.z+30],[C.STAD.x-50,0.05,C.STAD.z+30]]);pathSeg([C.STAD.x,0.05,C.STAD.z-30],[C.STAD.x,0.05,C.STAD.z+30]);ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1.2;ctx.stroke();}
  if(Math.hypot(cx-(C.PARK.x0+C.PARK.x1)/2,cz-(C.PARK.z0+C.PARK.z1)/2)<900){ctx.beginPath();for(const[x,z,h]of C.TREES){pathSeg([x,0,z],[x,h,z]);pathSeg([x-2,h*.7,z],[x+2,h*.7,z]);}ctx.strokeStyle='#7dff6b';ctx.lineWidth=1.4;ctx.stroke();}
  drawTrack(cx,cz);
  // stunt spots: neon outline on the plaza ground
  ctx.beginPath();for(const l of C.LOTS)if(l.stunt&&Math.hypot((l.x0+l.x1)/2-cx,(l.z0+l.z1)/2-cz)<R*.6)wpoly([[l.x0+1,0.04,l.z0+1],[l.x1-1,0.04,l.z0+1],[l.x1-1,0.04,l.z1-1],[l.x0+1,0.04,l.z1-1]]);ctx.strokeStyle='rgba(125,255,107,.45)';ctx.lineWidth=1.4;ctx.stroke();
  drawRoads(cx,cz);
  ctx.beginPath();for(const e of[-C.HW.hw,C.HW.hw])pathSeg([C.HW.x+e,0.03,Math.max(C.ZS0-400,cz-R)],[C.HW.x+e,0.03,Math.min(C.ZS1+400,cz+R)]);
  for(const e of[C.TAXI.x0,C.TAXI.x1])pathSeg([e,0.03,C.TAXI.z0],[e,0.03,C.TAXI.z1]);ctx.strokeStyle='#ffb020';ctx.lineWidth=1.8;ctx.stroke();
  if(Math.abs(cx-C.HW.x)<700){ctx.beginPath();for(let z=Math.floor((cz-500)/24)*24;z<cz+700;z+=24)for(const e of[-5,5])pathSeg([C.HW.x+e,0.03,z],[C.HW.x+e,0.03,z+10]);ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1.2;ctx.stroke();}
  drawRamps(cx,cz,R);
  ctx.restore();}
// in the river: the water line covers the bottom of the car
function drawWaterline(){if(!P.inWater||P.loop)return;const fx=Math.sin(P.yaw),fz=Math.cos(P.yaw),rx=fz,rz=-fx,L=3.2,Wd=1.6,t=P.simT||0;ctx.save();ctx.beginPath();
  wpoly([[P.x-fx*L-rx*Wd,0,P.z-fz*L-rz*Wd],[P.x+fx*L-rx*Wd,0,P.z+fz*L-rz*Wd],[P.x+fx*L+rx*Wd,0,P.z+fz*L+rz*Wd],[P.x-fx*L+rx*Wd,0,P.z-fz*L+rz*Wd]]);ctx.fillStyle='rgba(3,19,46,.82)';ctx.fill();
  ctx.beginPath();const n=16,r=3.6+(t*3%1.2);const pts=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2;pts.push([P.x+Math.cos(a)*r,0.02,P.z+Math.sin(a)*r*1.4]);}wpoly(pts);ctx.strokeStyle='rgba(62,230,255,.6)';ctx.lineWidth=1.4;ctx.stroke();ctx.restore();}
function drawTunnelInside(){const C=CITY,T=C.TUN;if(!(cam.x>T.bx0-2&&cam.x<T.bx1+2&&cam.z>T.z0-60&&cam.z<T.z1+10))return;ctx.save();ctx.beginPath();
  for(let z=T.z0+6;z<T.z1;z+=12)for(const x of[T.bx0+.6,T.bx1-.6])pathSeg([x,T.ceil-1.2,z],[x,T.ceil-1.2,z+4]);ctx.strokeStyle='#ffb020';ctx.shadowColor='#ffb020';ctx.shadowBlur=10;ctx.lineWidth=4;ctx.stroke();ctx.shadowBlur=0;
  ctx.beginPath();for(let z=T.z0+12;z<T.z1;z+=24)pathSeg([C.HW.x,T.ceil-.1,z],[C.HW.x,T.ceil-.1,z+8]);ctx.strokeStyle='#fff2c0';ctx.lineWidth=3;ctx.stroke();
  ctx.beginPath();for(const x of[T.bx0+.3,T.bx1-.3])pathSeg([x,1,T.z0],[x,1,T.z1]);ctx.strokeStyle='#3ee6ff';ctx.lineWidth=2;ctx.stroke();ctx.restore();}
function cityItems(items){const R2=CDRAW.dist**2,O2=CDRAW.outline**2,fx=W/(H*0.9)/2*1.3+.2;for(const b of CITY.BL){const dx=b.cx-cam.x,dz=b.cz-cam.z,d=dx*dx+dz*dz;if(d>(b.kind==='outline'?O2:R2))continue;const c=camS(b.cx,Math.min(b.top,Math.max(0,cam.y)),b.cz),r=b.rad+4;if(c[2]<-r)continue;if(Math.abs(c[0])-r>(Math.max(c[2],0)+r)*fx)continue;items.push([d,'t',b]);}for(const m of CITY.DYN){const d=(m.x-cam.x)**2+(m.z-cam.z)**2;if(d<R2)items.push([d,'t',m]);}}

function drawRunway(){const L0=-40,L1=1500,hw=15;ctx.save();ctx.shadowColor='#3ee6ff';ctx.shadowBlur=10;
  line([-hw,0,L0],[-hw,0,L1],'#3ee6ff',2.5);line([hw,0,L0],[hw,0,L1],'#3ee6ff',2.5);ctx.shadowBlur=0;
  for(let z=0;z<L1;z+=30)line([0,0,z],[0,0,z+14],'rgba(255,255,255,.8)',2);
  for(let k=-5;k<=5;k++){if(!k)continue;const x=k*2.4;line([x,0,L0+4],[x,0,L0+18],'#ffe14d',2);}
  if(drawRunway.zr==null){let v=0,d=0;const T=TUNE;for(let i=0;i<4000&&v<T.rotateSpeed;i++){v+=(T.maxSpeed-v)*T.groundAccel*.01-T.groundFric*.01;d+=v*.01;}drawRunway.zr=d;}const zr=drawRunway.zr;/* green bars = where full throttle reaches ROTATE */for(const x of[-hw,hw])line([x,0,zr],[x*1.6,0,zr],'#7dff6b',3);ctx.restore();}
