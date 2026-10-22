'use strict';
// Garage Z on the Neon World split car. Reads jr.html's save (localStorage 'zdash.kid.v1' -> eq)
// and copies the Garage choices onto the existing World Z look (KID). No save, or a broken save,
// leaves KID as the World default (cyan). The 370Z mesh is not swapped and the silver badge keeps
// its own material. Garage flight-wings and the held-back Stillen bumper stay off.
// Painted once when the model is ready, and again when another tab writes the save. Nothing here
// runs any work after that (apply returns on the first line).
(function(){
  if(typeof KID==='undefined'||typeof GZ==='undefined')return;
  const KEY='zdash.kid.v1';
  const BASE={paint:'#1aa6c8',glow:'#3ee6ff',grid:'#9b5cff',wheel:'#4a4f57',wheelGlow:false,spoiler:null,wings:null,extra:null,extras:[]};
  // Colour rows match jr.html CAT + look(): paint[id] = [body, glow, grid, livery, livery colour].
  const C={
    paint:{
      cyan:['#1aa6c8','#3ee6ff','#9b5cff',0,0],pink:['#e0359f','#ff4fd8','#3ee6ff',0,0],gun:['#5c6068','#ff2a3d','#ff2a3d',0,0],
      lime:['#3cc24a','#7dff6b','#ff4fd8',0,0],purple:['#6a33d6','#c08bff','#3ee6ff',0,0],gold:['#d9a514','#ffe14d','#ff4fd8',0,0],
      rainbow:['rainbow','#ffffff','#ff4fd8',0,0],red40:['#8a0f1a','#ff2a3d','#ffe14d',0,0],gunmetal:['#5c6068','#ff2a3d','#ff2a3d',0,0],
      blackout:['#121318','#3a7bff','#3a7bff',0,0],'tuner-orange':['#ff7a1a','#ffe14d','#ff9a3d',0,0],
      cop_bw:['#0e0f13','#3a7bff','#ff2a3d',1,'#e9edf2'],cop_white:['#e6e9ef','#2a6bff','#2a6bff',2,'#1f4fff'],
      cop_stealth:['#2a2d33','#9fb4c8','#5a6a7a',3,'#aab4bf'],cop_interceptor:['#0b0b0e','#ffcf4d','#ffb020',4,'#d9a514']
    },
    win:{
      'win-clear':{color:'#cfe6f5',op:0.28},'win-smoke':{color:'#5a6470',op:0.55},'win-limo':{color:'#08090c',op:0.9},
      'win-ice':{color:'#8fe3ff',op:0.5,glow:'#3ee6ff'},'win-purple':{color:'#8a4dff',op:0.6,glow:'#9b5cff'},'win-rose':{color:'#e8a598',op:0.6,glow:'#ffb7a8'}
    },
    wh:{
      'w-gun':['#4a4f57',false],'w-black':['#15161a',false],'w-chrome':['#d8dde4',false],'w-gold':['#e0b020',false],
      'w-cyan':['#3ee6ff',true],'w-pink':['#ff4fd8',true],'w-rainbow':['rainbow',true],'w-fire':['#ff9a2e',true]
    },
    roof:{
      'r-match':null,'r-black':{color:'#0c0c10'},'r-matte':{color:'#1b1b20',matte:true},'r-carbon':{color:'#ffffff',carbon:true},
      'r-white':{color:'#eef0f6'},'r-pink':{color:'#ff4fd8'},'r-cyan':{color:'#3ee6ff'},'r-gold':{color:'#e8b923'}
    },
    head:{
      'h-clear':{glow:'#f2f8ff',smoke:0},'h-smoke':{glow:'#e6eef8',smoke:0.35},'h-dark':{glow:'#dfe8f2',smoke:0.6},'h-black':{glow:'#d8e2ee',smoke:0.85},
      'h-blue':{glow:'#6fb8ff',smoke:0},'h-purple':{glow:'#b48cff',smoke:0},'h-pink':{glow:'#ff8fe0',smoke:0},'h-amber':{glow:'#ffc040',smoke:0}
    },
    tail:{
      't-red':{glow:'#ff1f35',smoke:0},'t-smoke':{glow:'#ff1f35',smoke:0.35},'t-dark':{glow:'#ff1f35',smoke:0.6},'t-black':{glow:'#ff1f35',smoke:0.85},
      't-blue':{glow:'#4f9bff',smoke:0},'t-purple':{glow:'#a46bff',smoke:0},'t-pink':{glow:'#ff4fd8',smoke:0},'t-amber':{glow:'#ffb020',smoke:0}
    },
    ug:{'ug-off':null,'ug-pink':'#ff4fd8','ug-cyan':'#3ee6ff','ug-purple':'#9b5cff','ug-lime':'#7dff6b','ug-red':'#ff2a3d','ug-blue':'#2a5bff','ug-rainbow':'#ff4fd8'},
    cal:{'cal-red':'#d1121f','cal-yellow':'#ffd21f','cal-blue':'#2f7bff','cal-pink':'#ff4fd8','cal-lime':'#7dff6b','cal-black':'#15161a','cal-gold':'#e8b923'},
    sc:{'sc-match':null,'sc-gloss':{color:'#0c0c10'},'sc-matte':{color:'#1b1b20',matte:true},'sc-carbon':{color:'#ffffff',carbon:true},'sc-chrome':{color:'#e9edf3',chrome:true},'sc-pink':{color:'#ff4fd8',neon:true},'sc-cyan':{color:'#3ee6ff',neon:true},'sc-lime':{color:'#7dff6b',neon:true},'sc-purple':{color:'#9b5cff',neon:true}},
    st:{'st-stock':'stock','st-low':'low','st-slam':'slam'},
    cb:{'cb-off':null,'cb-mild':'mild','cb-poke':'poke'},
    rims:['gtx04','stock','5spoke','steel','star','mesh','deepdish','turbine'],
    tires:['street','stretch','slick','offroad','street-white','street-neon'],
    sp:['none-s','duck','gtwing','twin','bolt'],
    kit:['black','body','carbon']
  };
  const RB='#ff4fd8'; // rainbow is a still frame of the Garage cycle, so the drive loop stays free of it
  function has(o,k){return Object.prototype.hasOwnProperty.call(o,k);}
  function strip(id){return typeof id==='string'&&id&&id.indexOf('none')!==0?id:null;}
  function strip2(id){return typeof id==='string'&&id&&!/-none$/.test(id)?id:null;}
  function put(fields){
    Object.keys(KID).forEach(k=>{delete KID[k];});
    Object.assign(KID,fields);
  }
  function off(){
    put(BASE);
    GZ.on=false;GZ.liv=0;GZ.livC=null;GZ.rimFb=null;GZ.id=null;GZ._sig='';
  }
  function read(){
    let raw=null;
    try{raw=localStorage.getItem(KEY);}catch(e){off();return;}
    let sv=null;
    try{sv=JSON.parse(raw||'null');}catch(e){off();return;}
    const e=sv&&sv.eq;
    if(!e||typeof e!=='object'||Array.isArray(e)){off();return;}
    const pa=C.paint[e.paint]||C.paint.cyan,wh=C.wh[e.wheels]||C.wh['w-gun'];
    let rim=typeof e.rims==='string'?e.rims:'gtx04';
    if(rim==='gtx01'||(!sv.rimMig&&rim==='stock'))rim='gtx04';
    if(C.rims.indexOf(rim)<0){GZ.rimFb=rim;rim='stock';}else GZ.rimFb=null;
    const paint=pa[0]==='rainbow'?RB:pa[0],glow=pa[0]==='rainbow'?'#ffffff':pa[1];
    const wheel=wh[0]==='rainbow'?RB:wh[0];
    const extras=e.extras&&typeof e.extras==='object'&&!Array.isArray(e.extras)?Object.keys(e.extras).map(k=>e.extras[k]).filter(strip):[];
    put({
      paint:paint,glow:glow,grid:pa[2],wheel:wheel,wheelGlow:!!wh[1],
      spoiler:C.sp.indexOf(e.spoiler)>=0?strip(e.spoiler):null,
      wings:null, // flight doors are the World wings; Garage butterfly / jet / dragon stay hidden
      extra:strip(e.extra==='multi'?'none-x':e.extra),
      extras:extras,
      window:C.win[e.windows]||C.win['win-clear'],
      rim:rim,size:[17,18,19,20].indexOf(+e.size)>=0?+e.size:19,
      tire:C.tires.indexOf(e.tires)>=0?e.tires:'street',
      roof:has(C.roof,e.roof)?C.roof[e.roof]:null,
      head:C.head[e.heads]||C.head['h-clear'],
      tail:C.tail[e.tails]||C.tail['t-red'],
      underglow:has(C.ug,e.underglow)?C.ug[e.underglow]:null,
      caliper:C.cal[e.caliper]||C.cal['cal-red'],
      // Ride height stays the World Z's. The renderer lowers shell meshes by local Y, but the wing
      // hinge has already reparented the hatch, rear glass, roof and spoiler, so a low/slam offset
      // writes those parts' old height and they float above the body.
      stance:'stock',
      camber:has(C.cb,e.camber)?C.cb[e.camber]:null,
      lip:strip2(e.lip),skirts:strip2(e.skirts),diffuser:strip2(e.diffuser),
      kitmat:C.kit.indexOf(e.kitmat&&e.kitmat.slice(3))>=0?e.kitmat.slice(3):(C.kit.indexOf(e.kitmat)>=0?e.kitmat:'black'),
      tips:e.tips&&e.tips!=='tip-stock'?e.tips:null,
      spcol:has(C.sc,e.spcol)?C.sc[e.spcol]:null,
      bumper:null
    });
    GZ.on=true;GZ.liv=pa[3]||0;GZ.livC=pa[4]||null;GZ.id=e.paint||'cyan';GZ._sig=raw||'';
  }
  function badge(X){
    if(X._gzBadge||!X.rimMat||!X.car)return;
    X._gzBadge=1;
    const src=X.rimMat;
    X.car.traverse(m=>{
      if(!m.isMesh||(m.userData&&m.userData.crew))return;
      if(m.userData&&m.userData.mat==='SILVER'&&m.material===src)m.material=src.clone();
    });
  }
  function liv(X){
    const n=GZ.on?(GZ.liv||0):0,col=GZ.livC;
    const paint=(mat)=>{
      if(!mat||!mat.uniforms||!mat.uniforms.zLiv)return;
      mat.uniforms.zLiv.value=n;
      if(col&&mat.uniforms.zLivC)mat.uniforms.zLivC.value.set(col);
    };
    paint(X.solid);paint(X.shell);
    if(!X.car)return;
    X.car.traverse(m=>{
      if(!m.isMesh||(m.userData&&m.userData.crew))return;
      const ms=Array.isArray(m.material)?m.material:[m.material];
      for(let i=0;i<ms.length;i++)paint(ms[i]);
    });
    X._gzLv=n;
  }
  function apply(X){
    if(!X||!X.ready)return;
    if(X._gzSig===GZ._sig)return;
    X._gzSig=GZ._sig;
    badge(X);
    liv(X);
  }
  function sync(){
    read();
    const X=window.ZD&&ZD.Xray;
    if(X)X._gzSig=null;
    if(X&&X.ready)apply(X);
  }
  read();
  addEventListener('storage',e=>{if(e.key&&e.key!==KEY)return;sync();});
  window.GARAGEZ={apply:apply,sync:sync,get on(){return !!GZ.on;},get liv(){return GZ.on?(GZ.liv||0):0;},get id(){return GZ.id||null;}};
  // The old per-frame hatch spoiler pass stays installed on the page. Point it here so it cannot run.
  window.gzFrame=function(X){apply(X);};
})();
