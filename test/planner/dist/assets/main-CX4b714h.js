(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}})();const Of={rentacomputer:{id:"rentacomputer",name:"Rentacomputer.com",appName:"Event Space Planner",siteUrl:"https://www.rentacomputer.com",logo:"./brand/rentacomputer-logo.png",logoW:400,logoH:84,icon:"./brand/rentacomputer-icon-192.png",icon512:"./brand/rentacomputer-icon-512.png",favicon:"./brand/rentacomputer-icon-64.png",colors:{bg:"#03192f",surface:"#0b2e55",fg:"#f4f8fc",muted:"#b9c6d8",action:"#2f7ed8",actionHover:"#1d6fc4",onAction:"#ffffff",accent:"#5fd4ff",highlight:"#2f7ed8",navy:"#062a50",strip:"#ffffff",stripText:"#062a50",stripSub:"#1d4a8d"},fonts:{body:"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",heading:"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"},copy:{lead:"Draw your room wall by wall and see it in 3D. Free to use.",repNote:"Sizes are typical. Your Rentacomputer.com rep confirms exact items.",shareTitle:"My event layout",shareText:"Planned with the Rentacomputer.com Event Space Planner",description:"Plan your event space in 3D with the Rentacomputer.com Event Space Planner. Draw your room, place tables, screens and tech, and share the layout."},quote:{url:"https://www.rentacomputer.com/api/quote",page:"https://www.rentacomputer.com/quote",wired:!1}}},Ff="rentacomputer",nt=Of[Ff],ie=n=>parseInt(n.slice(1),16);function zf(n=document.documentElement){const t=nt.colors,e=n.style;for(const[i,r]of Object.entries({bg:t.bg,surface:t.surface,fg:t.fg,muted:t.muted,action:t.action,"action-h":t.actionHover,"on-action":t.onAction,accent:t.accent,hl:t.highlight,navy:t.navy}))e.setProperty("--"+i,r);e.setProperty("--font",nt.fonts.body),e.setProperty("--font-h",nt.fonts.heading)}const s={};/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const pc="169",kf=0,oh=1,Bf=2,zu=1,Hf=2,Yn=3,Mi=0,ln=1,Kn=2,gi=0,ps=1,ah=2,lh=3,ch=4,Gf=5,Ni=100,Vf=101,Wf=102,$f=103,Xf=104,qf=200,Yf=201,jf=202,Zf=203,ll=204,cl=205,Kf=206,Jf=207,Qf=208,tp=209,ep=210,np=211,ip=212,sp=213,rp=214,hl=0,ul=1,dl=2,Ss=3,fl=4,pl=5,ml=6,gl=7,mc=0,op=1,ap=2,xi=0,lp=1,cp=2,hp=3,up=4,dp=5,fp=6,pp=7,ku=300,ws=301,bs=302,xl=303,vl=304,Go=306,bo=1e3,Oi=1001,_l=1002,Qe=1003,mp=1004,Er=1005,Cn=1006,ia=1007,Fi=1008,ei=1009,Bu=1010,Hu=1011,or=1012,gc=1013,Hi=1014,Jn=1015,pr=1016,xc=1017,vc=1018,Es=1020,Gu=35902,Vu=1021,Wu=1022,Pn=1023,$u=1024,Xu=1025,ms=1026,Ts=1027,qu=1028,_c=1029,Yu=1030,Mc=1031,yc=1033,ho=33776,uo=33777,fo=33778,po=33779,Ml=35840,yl=35841,Sl=35842,wl=35843,bl=36196,El=37492,Tl=37496,Al=37808,Cl=37809,Rl=37810,Pl=37811,Il=37812,Ll=37813,Dl=37814,Nl=37815,Ul=37816,Ol=37817,Fl=37818,zl=37819,kl=37820,Bl=37821,mo=36492,Hl=36494,Gl=36495,ju=36283,Vl=36284,Wl=36285,$l=36286,gp=3200,xp=3201,Zu=0,vp=1,mi="",An="srgb",wi="srgb-linear",Sc="display-p3",Vo="display-p3-linear",Eo="linear",xe="srgb",To="rec709",Ao="p3",ji=7680,hh=519,_p=512,Mp=513,yp=514,Ku=515,Sp=516,wp=517,bp=518,Ep=519,uh=35044,dh="300 es",Qn=2e3,Co=2001;class Ds{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const r=this._listeners[t];if(r!==void 0){const o=r.indexOf(e);o!==-1&&r.splice(o,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const r=i.slice(0);for(let o=0,a=r.length;o<a;o++)r[o].call(this,t);t.target=null}}}const qe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],sa=Math.PI/180,Xl=180/Math.PI;function Ns(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(qe[n&255]+qe[n>>8&255]+qe[n>>16&255]+qe[n>>24&255]+"-"+qe[t&255]+qe[t>>8&255]+"-"+qe[t>>16&15|64]+qe[t>>24&255]+"-"+qe[e&63|128]+qe[e>>8&255]+"-"+qe[e>>16&255]+qe[e>>24&255]+qe[i&255]+qe[i>>8&255]+qe[i>>16&255]+qe[i>>24&255]).toLowerCase()}function $e(n,t,e){return Math.max(t,Math.min(e,n))}function Tp(n,t){return(n%t+t)%t}function ra(n,t,e){return(1-e)*n+e*t}function Hs(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function on(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class ht{constructor(t=0,e=0){ht.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6],this.y=r[1]*e+r[4]*i+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos($e(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),r=Math.sin(e),o=this.x-t.x,a=this.y-t.y;return this.x=o*i-a*r+t.x,this.y=o*r+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Kt{constructor(t,e,i,r,o,a,l,c,h){Kt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,r,o,a,l,c,h)}set(t,e,i,r,o,a,l,c,h){const u=this.elements;return u[0]=t,u[1]=r,u[2]=l,u[3]=e,u[4]=o,u[5]=c,u[6]=i,u[7]=a,u[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,r=e.elements,o=this.elements,a=i[0],l=i[3],c=i[6],h=i[1],u=i[4],f=i[7],d=i[2],p=i[5],x=i[8],v=r[0],m=r[3],g=r[6],y=r[1],_=r[4],S=r[7],P=r[2],C=r[5],T=r[8];return o[0]=a*v+l*y+c*P,o[3]=a*m+l*_+c*C,o[6]=a*g+l*S+c*T,o[1]=h*v+u*y+f*P,o[4]=h*m+u*_+f*C,o[7]=h*g+u*S+f*T,o[2]=d*v+p*y+x*P,o[5]=d*m+p*_+x*C,o[8]=d*g+p*S+x*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],r=t[2],o=t[3],a=t[4],l=t[5],c=t[6],h=t[7],u=t[8];return e*a*u-e*l*h-i*o*u+i*l*c+r*o*h-r*a*c}invert(){const t=this.elements,e=t[0],i=t[1],r=t[2],o=t[3],a=t[4],l=t[5],c=t[6],h=t[7],u=t[8],f=u*a-l*h,d=l*c-u*o,p=h*o-a*c,x=e*f+i*d+r*p;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/x;return t[0]=f*v,t[1]=(r*h-u*i)*v,t[2]=(l*i-r*a)*v,t[3]=d*v,t[4]=(u*e-r*c)*v,t[5]=(r*o-l*e)*v,t[6]=p*v,t[7]=(i*c-h*e)*v,t[8]=(a*e-i*o)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,r,o,a,l){const c=Math.cos(o),h=Math.sin(o);return this.set(i*c,i*h,-i*(c*a+h*l)+a+t,-r*h,r*c,-r*(-h*a+c*l)+l+e,0,0,1),this}scale(t,e){return this.premultiply(oa.makeScale(t,e)),this}rotate(t){return this.premultiply(oa.makeRotation(-t)),this}translate(t,e){return this.premultiply(oa.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let r=0;r<9;r++)if(e[r]!==i[r])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const oa=new Kt;function Ju(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Ro(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Ap(){const n=Ro("canvas");return n.style.display="block",n}const fh={};function go(n){n in fh||(fh[n]=!0,console.warn(n))}function Cp(n,t,e){return new Promise(function(i,r){function o(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(o,e);break;default:i()}}setTimeout(o,e)})}function Rp(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Pp(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const ph=new Kt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),mh=new Kt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Gs={[wi]:{transfer:Eo,primaries:To,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n,fromReference:n=>n},[An]:{transfer:xe,primaries:To,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[Vo]:{transfer:Eo,primaries:Ao,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.applyMatrix3(mh),fromReference:n=>n.applyMatrix3(ph)},[Sc]:{transfer:xe,primaries:Ao,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.convertSRGBToLinear().applyMatrix3(mh),fromReference:n=>n.applyMatrix3(ph).convertLinearToSRGB()}},Ip=new Set([wi,Vo]),le={enabled:!0,_workingColorSpace:wi,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!Ip.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,t,e){if(this.enabled===!1||t===e||!t||!e)return n;const i=Gs[t].toReference,r=Gs[e].fromReference;return r(i(n))},fromWorkingColorSpace:function(n,t){return this.convert(n,this._workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this._workingColorSpace)},getPrimaries:function(n){return Gs[n].primaries},getTransfer:function(n){return n===mi?Eo:Gs[n].transfer},getLuminanceCoefficients:function(n,t=this._workingColorSpace){return n.fromArray(Gs[t].luminanceCoefficients)}};function gs(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function aa(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Zi;class Lp{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Zi===void 0&&(Zi=Ro("canvas")),Zi.width=t.width,Zi.height=t.height;const i=Zi.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Zi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ro("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const r=i.getImageData(0,0,t.width,t.height),o=r.data;for(let a=0;a<o.length;a++)o[a]=gs(o[a]/255)*255;return i.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(gs(e[i]/255)*255):e[i]=gs(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Dp=0;class Qu{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Dp++}),this.uuid=Ns(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let o;if(Array.isArray(r)){o=[];for(let a=0,l=r.length;a<l;a++)r[a].isDataTexture?o.push(la(r[a].image)):o.push(la(r[a]))}else o=la(r);i.url=o}return e||(t.images[this.uuid]=i),i}}function la(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Lp.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Np=0;class tn extends Ds{constructor(t=tn.DEFAULT_IMAGE,e=tn.DEFAULT_MAPPING,i=Oi,r=Oi,o=Cn,a=Fi,l=Pn,c=ei,h=tn.DEFAULT_ANISOTROPY,u=mi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Np++}),this.uuid=Ns(),this.name="",this.source=new Qu(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=o,this.minFilter=a,this.anisotropy=h,this.format=l,this.internalFormat=null,this.type=c,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Kt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ku)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case bo:t.x=t.x-Math.floor(t.x);break;case Oi:t.x=t.x<0?0:1;break;case _l:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case bo:t.y=t.y-Math.floor(t.y);break;case Oi:t.y=t.y<0?0:1;break;case _l:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}tn.DEFAULT_IMAGE=null;tn.DEFAULT_MAPPING=ku;tn.DEFAULT_ANISOTROPY=1;class Ae{constructor(t=0,e=0,i=0,r=1){Ae.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,r){return this.x=t,this.y=e,this.z=i,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,r=this.z,o=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*r+a[12]*o,this.y=a[1]*e+a[5]*i+a[9]*r+a[13]*o,this.z=a[2]*e+a[6]*i+a[10]*r+a[14]*o,this.w=a[3]*e+a[7]*i+a[11]*r+a[15]*o,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,r,o;const c=t.elements,h=c[0],u=c[4],f=c[8],d=c[1],p=c[5],x=c[9],v=c[2],m=c[6],g=c[10];if(Math.abs(u-d)<.01&&Math.abs(f-v)<.01&&Math.abs(x-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(f+v)<.1&&Math.abs(x+m)<.1&&Math.abs(h+p+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const _=(h+1)/2,S=(p+1)/2,P=(g+1)/2,C=(u+d)/4,T=(f+v)/4,I=(x+m)/4;return _>S&&_>P?_<.01?(i=0,r=.707106781,o=.707106781):(i=Math.sqrt(_),r=C/i,o=T/i):S>P?S<.01?(i=.707106781,r=0,o=.707106781):(r=Math.sqrt(S),i=C/r,o=I/r):P<.01?(i=.707106781,r=.707106781,o=0):(o=Math.sqrt(P),i=T/o,r=I/o),this.set(i,r,o,e),this}let y=Math.sqrt((m-x)*(m-x)+(f-v)*(f-v)+(d-u)*(d-u));return Math.abs(y)<.001&&(y=1),this.x=(m-x)/y,this.y=(f-v)/y,this.z=(d-u)/y,this.w=Math.acos((h+p+g-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Up extends Ds{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ae(0,0,t,e),this.scissorTest=!1,this.viewport=new Ae(0,0,t,e);const r={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Cn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const o=new tn(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);o.flipY=!1,o.generateMipmaps=i.generateMipmaps,o.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let l=0;l<a;l++)this.textures[l]=o.clone(),this.textures[l].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let r=0,o=this.textures.length;r<o;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,r=t.textures.length;i<r;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Qu(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Gi extends Up{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class td extends tn{constructor(t=null,e=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:r},this.magFilter=Qe,this.minFilter=Qe,this.wrapR=Oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Op extends tn{constructor(t=null,e=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:r},this.magFilter=Qe,this.minFilter=Qe,this.wrapR=Oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class mr{constructor(t=0,e=0,i=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=r}static slerpFlat(t,e,i,r,o,a,l){let c=i[r+0],h=i[r+1],u=i[r+2],f=i[r+3];const d=o[a+0],p=o[a+1],x=o[a+2],v=o[a+3];if(l===0){t[e+0]=c,t[e+1]=h,t[e+2]=u,t[e+3]=f;return}if(l===1){t[e+0]=d,t[e+1]=p,t[e+2]=x,t[e+3]=v;return}if(f!==v||c!==d||h!==p||u!==x){let m=1-l;const g=c*d+h*p+u*x+f*v,y=g>=0?1:-1,_=1-g*g;if(_>Number.EPSILON){const P=Math.sqrt(_),C=Math.atan2(P,g*y);m=Math.sin(m*C)/P,l=Math.sin(l*C)/P}const S=l*y;if(c=c*m+d*S,h=h*m+p*S,u=u*m+x*S,f=f*m+v*S,m===1-l){const P=1/Math.sqrt(c*c+h*h+u*u+f*f);c*=P,h*=P,u*=P,f*=P}}t[e]=c,t[e+1]=h,t[e+2]=u,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,r,o,a){const l=i[r],c=i[r+1],h=i[r+2],u=i[r+3],f=o[a],d=o[a+1],p=o[a+2],x=o[a+3];return t[e]=l*x+u*f+c*p-h*d,t[e+1]=c*x+u*d+h*f-l*p,t[e+2]=h*x+u*p+l*d-c*f,t[e+3]=u*x-l*f-c*d-h*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,r){return this._x=t,this._y=e,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,r=t._y,o=t._z,a=t._order,l=Math.cos,c=Math.sin,h=l(i/2),u=l(r/2),f=l(o/2),d=c(i/2),p=c(r/2),x=c(o/2);switch(a){case"XYZ":this._x=d*u*f+h*p*x,this._y=h*p*f-d*u*x,this._z=h*u*x+d*p*f,this._w=h*u*f-d*p*x;break;case"YXZ":this._x=d*u*f+h*p*x,this._y=h*p*f-d*u*x,this._z=h*u*x-d*p*f,this._w=h*u*f+d*p*x;break;case"ZXY":this._x=d*u*f-h*p*x,this._y=h*p*f+d*u*x,this._z=h*u*x+d*p*f,this._w=h*u*f-d*p*x;break;case"ZYX":this._x=d*u*f-h*p*x,this._y=h*p*f+d*u*x,this._z=h*u*x-d*p*f,this._w=h*u*f+d*p*x;break;case"YZX":this._x=d*u*f+h*p*x,this._y=h*p*f+d*u*x,this._z=h*u*x-d*p*f,this._w=h*u*f-d*p*x;break;case"XZY":this._x=d*u*f-h*p*x,this._y=h*p*f-d*u*x,this._z=h*u*x+d*p*f,this._w=h*u*f+d*p*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,r=Math.sin(i);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],r=e[4],o=e[8],a=e[1],l=e[5],c=e[9],h=e[2],u=e[6],f=e[10],d=i+l+f;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(u-c)*p,this._y=(o-h)*p,this._z=(a-r)*p}else if(i>l&&i>f){const p=2*Math.sqrt(1+i-l-f);this._w=(u-c)/p,this._x=.25*p,this._y=(r+a)/p,this._z=(o+h)/p}else if(l>f){const p=2*Math.sqrt(1+l-i-f);this._w=(o-h)/p,this._x=(r+a)/p,this._y=.25*p,this._z=(c+u)/p}else{const p=2*Math.sqrt(1+f-i-l);this._w=(a-r)/p,this._x=(o+h)/p,this._y=(c+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs($e(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const r=Math.min(1,e/i);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,r=t._y,o=t._z,a=t._w,l=e._x,c=e._y,h=e._z,u=e._w;return this._x=i*u+a*l+r*h-o*c,this._y=r*u+a*c+o*l-i*h,this._z=o*u+a*h+i*c-r*l,this._w=a*u-i*l-r*c-o*h,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,r=this._y,o=this._z,a=this._w;let l=a*t._w+i*t._x+r*t._y+o*t._z;if(l<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,l=-l):this.copy(t),l>=1)return this._w=a,this._x=i,this._y=r,this._z=o,this;const c=1-l*l;if(c<=Number.EPSILON){const p=1-e;return this._w=p*a+e*this._w,this._x=p*i+e*this._x,this._y=p*r+e*this._y,this._z=p*o+e*this._z,this.normalize(),this}const h=Math.sqrt(c),u=Math.atan2(h,l),f=Math.sin((1-e)*u)/h,d=Math.sin(e*u)/h;return this._w=a*f+this._w*d,this._x=i*f+this._x*d,this._y=r*f+this._y*d,this._z=o*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),o=Math.sqrt(i);return this.set(r*Math.sin(t),r*Math.cos(t),o*Math.sin(e),o*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(t=0,e=0,i=0){D.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(gh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(gh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,r=this.z,o=t.elements;return this.x=o[0]*e+o[3]*i+o[6]*r,this.y=o[1]*e+o[4]*i+o[7]*r,this.z=o[2]*e+o[5]*i+o[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,r=this.z,o=t.elements,a=1/(o[3]*e+o[7]*i+o[11]*r+o[15]);return this.x=(o[0]*e+o[4]*i+o[8]*r+o[12])*a,this.y=(o[1]*e+o[5]*i+o[9]*r+o[13])*a,this.z=(o[2]*e+o[6]*i+o[10]*r+o[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,r=this.z,o=t.x,a=t.y,l=t.z,c=t.w,h=2*(a*r-l*i),u=2*(l*e-o*r),f=2*(o*i-a*e);return this.x=e+c*h+a*f-l*u,this.y=i+c*u+l*h-o*f,this.z=r+c*f+o*u-a*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,r=this.z,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*r,this.y=o[1]*e+o[5]*i+o[9]*r,this.z=o[2]*e+o[6]*i+o[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,r=t.y,o=t.z,a=e.x,l=e.y,c=e.z;return this.x=r*c-o*l,this.y=o*a-i*c,this.z=i*l-r*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return ca.copy(this).projectOnVector(t),this.sub(ca)}reflect(t){return this.sub(ca.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos($e(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,r=this.z-t.z;return e*e+i*i+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const r=Math.sin(e)*t;return this.x=r*Math.sin(i),this.y=Math.cos(e)*t,this.z=r*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ca=new D,gh=new mr;class gr{constructor(t=new D(1/0,1/0,1/0),e=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(wn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(wn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=wn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const o=i.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let a=0,l=o.count;a<l;a++)t.isMesh===!0?t.getVertexPosition(a,wn):wn.fromBufferAttribute(o,a),wn.applyMatrix4(t.matrixWorld),this.expandByPoint(wn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Tr.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Tr.copy(i.boundingBox)),Tr.applyMatrix4(t.matrixWorld),this.union(Tr)}const r=t.children;for(let o=0,a=r.length;o<a;o++)this.expandByObject(r[o],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,wn),wn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Vs),Ar.subVectors(this.max,Vs),Ki.subVectors(t.a,Vs),Ji.subVectors(t.b,Vs),Qi.subVectors(t.c,Vs),ri.subVectors(Ji,Ki),oi.subVectors(Qi,Ji),Ei.subVectors(Ki,Qi);let e=[0,-ri.z,ri.y,0,-oi.z,oi.y,0,-Ei.z,Ei.y,ri.z,0,-ri.x,oi.z,0,-oi.x,Ei.z,0,-Ei.x,-ri.y,ri.x,0,-oi.y,oi.x,0,-Ei.y,Ei.x,0];return!ha(e,Ki,Ji,Qi,Ar)||(e=[1,0,0,0,1,0,0,0,1],!ha(e,Ki,Ji,Qi,Ar))?!1:(Cr.crossVectors(ri,oi),e=[Cr.x,Cr.y,Cr.z],ha(e,Ki,Ji,Qi,Ar))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,wn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(wn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Gn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Gn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Gn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Gn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Gn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Gn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Gn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Gn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Gn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Gn=[new D,new D,new D,new D,new D,new D,new D,new D],wn=new D,Tr=new gr,Ki=new D,Ji=new D,Qi=new D,ri=new D,oi=new D,Ei=new D,Vs=new D,Ar=new D,Cr=new D,Ti=new D;function ha(n,t,e,i,r){for(let o=0,a=n.length-3;o<=a;o+=3){Ti.fromArray(n,o);const l=r.x*Math.abs(Ti.x)+r.y*Math.abs(Ti.y)+r.z*Math.abs(Ti.z),c=t.dot(Ti),h=e.dot(Ti),u=i.dot(Ti);if(Math.max(-Math.max(c,h,u),Math.min(c,h,u))>l)return!1}return!0}const Fp=new gr,Ws=new D,ua=new D;class xr{constructor(t=new D,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):Fp.setFromPoints(t).getCenter(i);let r=0;for(let o=0,a=t.length;o<a;o++)r=Math.max(r,i.distanceToSquared(t[o]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ws.subVectors(t,this.center);const e=Ws.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),r=(i-this.radius)*.5;this.center.addScaledVector(Ws,r/i),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ua.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ws.copy(t.center).add(ua)),this.expandByPoint(Ws.copy(t.center).sub(ua))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Vn=new D,da=new D,Rr=new D,ai=new D,fa=new D,Pr=new D,pa=new D;class Wo{constructor(t=new D,e=new D(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Vn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Vn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Vn.copy(this.origin).addScaledVector(this.direction,e),Vn.distanceToSquared(t))}distanceSqToSegment(t,e,i,r){da.copy(t).add(e).multiplyScalar(.5),Rr.copy(e).sub(t).normalize(),ai.copy(this.origin).sub(da);const o=t.distanceTo(e)*.5,a=-this.direction.dot(Rr),l=ai.dot(this.direction),c=-ai.dot(Rr),h=ai.lengthSq(),u=Math.abs(1-a*a);let f,d,p,x;if(u>0)if(f=a*c-l,d=a*l-c,x=o*u,f>=0)if(d>=-x)if(d<=x){const v=1/u;f*=v,d*=v,p=f*(f+a*d+2*l)+d*(a*f+d+2*c)+h}else d=o,f=Math.max(0,-(a*d+l)),p=-f*f+d*(d+2*c)+h;else d=-o,f=Math.max(0,-(a*d+l)),p=-f*f+d*(d+2*c)+h;else d<=-x?(f=Math.max(0,-(-a*o+l)),d=f>0?-o:Math.min(Math.max(-o,-c),o),p=-f*f+d*(d+2*c)+h):d<=x?(f=0,d=Math.min(Math.max(-o,-c),o),p=d*(d+2*c)+h):(f=Math.max(0,-(a*o+l)),d=f>0?o:Math.min(Math.max(-o,-c),o),p=-f*f+d*(d+2*c)+h);else d=a>0?-o:o,f=Math.max(0,-(a*d+l)),p=-f*f+d*(d+2*c)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(da).addScaledVector(Rr,d),p}intersectSphere(t,e){Vn.subVectors(t.center,this.origin);const i=Vn.dot(this.direction),r=Vn.dot(Vn)-i*i,o=t.radius*t.radius;if(r>o)return null;const a=Math.sqrt(o-r),l=i-a,c=i+a;return c<0?null:l<0?this.at(c,e):this.at(l,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,r,o,a,l,c;const h=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,d=this.origin;return h>=0?(i=(t.min.x-d.x)*h,r=(t.max.x-d.x)*h):(i=(t.max.x-d.x)*h,r=(t.min.x-d.x)*h),u>=0?(o=(t.min.y-d.y)*u,a=(t.max.y-d.y)*u):(o=(t.max.y-d.y)*u,a=(t.min.y-d.y)*u),i>a||o>r||((o>i||isNaN(i))&&(i=o),(a<r||isNaN(r))&&(r=a),f>=0?(l=(t.min.z-d.z)*f,c=(t.max.z-d.z)*f):(l=(t.max.z-d.z)*f,c=(t.min.z-d.z)*f),i>c||l>r)||((l>i||i!==i)&&(i=l),(c<r||r!==r)&&(r=c),r<0)?null:this.at(i>=0?i:r,e)}intersectsBox(t){return this.intersectBox(t,Vn)!==null}intersectTriangle(t,e,i,r,o){fa.subVectors(e,t),Pr.subVectors(i,t),pa.crossVectors(fa,Pr);let a=this.direction.dot(pa),l;if(a>0){if(r)return null;l=1}else if(a<0)l=-1,a=-a;else return null;ai.subVectors(this.origin,t);const c=l*this.direction.dot(Pr.crossVectors(ai,Pr));if(c<0)return null;const h=l*this.direction.dot(fa.cross(ai));if(h<0||c+h>a)return null;const u=-l*ai.dot(pa);return u<0?null:this.at(u/a,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class pe{constructor(t,e,i,r,o,a,l,c,h,u,f,d,p,x,v,m){pe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,r,o,a,l,c,h,u,f,d,p,x,v,m)}set(t,e,i,r,o,a,l,c,h,u,f,d,p,x,v,m){const g=this.elements;return g[0]=t,g[4]=e,g[8]=i,g[12]=r,g[1]=o,g[5]=a,g[9]=l,g[13]=c,g[2]=h,g[6]=u,g[10]=f,g[14]=d,g[3]=p,g[7]=x,g[11]=v,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new pe().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,r=1/ts.setFromMatrixColumn(t,0).length(),o=1/ts.setFromMatrixColumn(t,1).length(),a=1/ts.setFromMatrixColumn(t,2).length();return e[0]=i[0]*r,e[1]=i[1]*r,e[2]=i[2]*r,e[3]=0,e[4]=i[4]*o,e[5]=i[5]*o,e[6]=i[6]*o,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,r=t.y,o=t.z,a=Math.cos(i),l=Math.sin(i),c=Math.cos(r),h=Math.sin(r),u=Math.cos(o),f=Math.sin(o);if(t.order==="XYZ"){const d=a*u,p=a*f,x=l*u,v=l*f;e[0]=c*u,e[4]=-c*f,e[8]=h,e[1]=p+x*h,e[5]=d-v*h,e[9]=-l*c,e[2]=v-d*h,e[6]=x+p*h,e[10]=a*c}else if(t.order==="YXZ"){const d=c*u,p=c*f,x=h*u,v=h*f;e[0]=d+v*l,e[4]=x*l-p,e[8]=a*h,e[1]=a*f,e[5]=a*u,e[9]=-l,e[2]=p*l-x,e[6]=v+d*l,e[10]=a*c}else if(t.order==="ZXY"){const d=c*u,p=c*f,x=h*u,v=h*f;e[0]=d-v*l,e[4]=-a*f,e[8]=x+p*l,e[1]=p+x*l,e[5]=a*u,e[9]=v-d*l,e[2]=-a*h,e[6]=l,e[10]=a*c}else if(t.order==="ZYX"){const d=a*u,p=a*f,x=l*u,v=l*f;e[0]=c*u,e[4]=x*h-p,e[8]=d*h+v,e[1]=c*f,e[5]=v*h+d,e[9]=p*h-x,e[2]=-h,e[6]=l*c,e[10]=a*c}else if(t.order==="YZX"){const d=a*c,p=a*h,x=l*c,v=l*h;e[0]=c*u,e[4]=v-d*f,e[8]=x*f+p,e[1]=f,e[5]=a*u,e[9]=-l*u,e[2]=-h*u,e[6]=p*f+x,e[10]=d-v*f}else if(t.order==="XZY"){const d=a*c,p=a*h,x=l*c,v=l*h;e[0]=c*u,e[4]=-f,e[8]=h*u,e[1]=d*f+v,e[5]=a*u,e[9]=p*f-x,e[2]=x*f-p,e[6]=l*u,e[10]=v*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(zp,t,kp)}lookAt(t,e,i){const r=this.elements;return dn.subVectors(t,e),dn.lengthSq()===0&&(dn.z=1),dn.normalize(),li.crossVectors(i,dn),li.lengthSq()===0&&(Math.abs(i.z)===1?dn.x+=1e-4:dn.z+=1e-4,dn.normalize(),li.crossVectors(i,dn)),li.normalize(),Ir.crossVectors(dn,li),r[0]=li.x,r[4]=Ir.x,r[8]=dn.x,r[1]=li.y,r[5]=Ir.y,r[9]=dn.y,r[2]=li.z,r[6]=Ir.z,r[10]=dn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,r=e.elements,o=this.elements,a=i[0],l=i[4],c=i[8],h=i[12],u=i[1],f=i[5],d=i[9],p=i[13],x=i[2],v=i[6],m=i[10],g=i[14],y=i[3],_=i[7],S=i[11],P=i[15],C=r[0],T=r[4],I=r[8],Z=r[12],M=r[1],b=r[5],B=r[9],H=r[13],U=r[2],z=r[6],L=r[10],W=r[14],k=r[3],Y=r[7],et=r[11],j=r[15];return o[0]=a*C+l*M+c*U+h*k,o[4]=a*T+l*b+c*z+h*Y,o[8]=a*I+l*B+c*L+h*et,o[12]=a*Z+l*H+c*W+h*j,o[1]=u*C+f*M+d*U+p*k,o[5]=u*T+f*b+d*z+p*Y,o[9]=u*I+f*B+d*L+p*et,o[13]=u*Z+f*H+d*W+p*j,o[2]=x*C+v*M+m*U+g*k,o[6]=x*T+v*b+m*z+g*Y,o[10]=x*I+v*B+m*L+g*et,o[14]=x*Z+v*H+m*W+g*j,o[3]=y*C+_*M+S*U+P*k,o[7]=y*T+_*b+S*z+P*Y,o[11]=y*I+_*B+S*L+P*et,o[15]=y*Z+_*H+S*W+P*j,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],r=t[8],o=t[12],a=t[1],l=t[5],c=t[9],h=t[13],u=t[2],f=t[6],d=t[10],p=t[14],x=t[3],v=t[7],m=t[11],g=t[15];return x*(+o*c*f-r*h*f-o*l*d+i*h*d+r*l*p-i*c*p)+v*(+e*c*p-e*h*d+o*a*d-r*a*p+r*h*u-o*c*u)+m*(+e*h*f-e*l*p-o*a*f+i*a*p+o*l*u-i*h*u)+g*(-r*l*u-e*c*f+e*l*d+r*a*f-i*a*d+i*c*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],r=t[2],o=t[3],a=t[4],l=t[5],c=t[6],h=t[7],u=t[8],f=t[9],d=t[10],p=t[11],x=t[12],v=t[13],m=t[14],g=t[15],y=f*m*h-v*d*h+v*c*p-l*m*p-f*c*g+l*d*g,_=x*d*h-u*m*h-x*c*p+a*m*p+u*c*g-a*d*g,S=u*v*h-x*f*h+x*l*p-a*v*p-u*l*g+a*f*g,P=x*f*c-u*v*c-x*l*d+a*v*d+u*l*m-a*f*m,C=e*y+i*_+r*S+o*P;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/C;return t[0]=y*T,t[1]=(v*d*o-f*m*o-v*r*p+i*m*p+f*r*g-i*d*g)*T,t[2]=(l*m*o-v*c*o+v*r*h-i*m*h-l*r*g+i*c*g)*T,t[3]=(f*c*o-l*d*o-f*r*h+i*d*h+l*r*p-i*c*p)*T,t[4]=_*T,t[5]=(u*m*o-x*d*o+x*r*p-e*m*p-u*r*g+e*d*g)*T,t[6]=(x*c*o-a*m*o-x*r*h+e*m*h+a*r*g-e*c*g)*T,t[7]=(a*d*o-u*c*o+u*r*h-e*d*h-a*r*p+e*c*p)*T,t[8]=S*T,t[9]=(x*f*o-u*v*o-x*i*p+e*v*p+u*i*g-e*f*g)*T,t[10]=(a*v*o-x*l*o+x*i*h-e*v*h-a*i*g+e*l*g)*T,t[11]=(u*l*o-a*f*o-u*i*h+e*f*h+a*i*p-e*l*p)*T,t[12]=P*T,t[13]=(u*v*r-x*f*r+x*i*d-e*v*d-u*i*m+e*f*m)*T,t[14]=(x*l*r-a*v*r-x*i*c+e*v*c+a*i*m-e*l*m)*T,t[15]=(a*f*r-u*l*r+u*i*c-e*f*c-a*i*d+e*l*d)*T,this}scale(t){const e=this.elements,i=t.x,r=t.y,o=t.z;return e[0]*=i,e[4]*=r,e[8]*=o,e[1]*=i,e[5]*=r,e[9]*=o,e[2]*=i,e[6]*=r,e[10]*=o,e[3]*=i,e[7]*=r,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,r))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),r=Math.sin(e),o=1-i,a=t.x,l=t.y,c=t.z,h=o*a,u=o*l;return this.set(h*a+i,h*l-r*c,h*c+r*l,0,h*l+r*c,u*l+i,u*c-r*a,0,h*c-r*l,u*c+r*a,o*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,r,o,a){return this.set(1,i,o,0,t,1,a,0,e,r,1,0,0,0,0,1),this}compose(t,e,i){const r=this.elements,o=e._x,a=e._y,l=e._z,c=e._w,h=o+o,u=a+a,f=l+l,d=o*h,p=o*u,x=o*f,v=a*u,m=a*f,g=l*f,y=c*h,_=c*u,S=c*f,P=i.x,C=i.y,T=i.z;return r[0]=(1-(v+g))*P,r[1]=(p+S)*P,r[2]=(x-_)*P,r[3]=0,r[4]=(p-S)*C,r[5]=(1-(d+g))*C,r[6]=(m+y)*C,r[7]=0,r[8]=(x+_)*T,r[9]=(m-y)*T,r[10]=(1-(d+v))*T,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,i){const r=this.elements;let o=ts.set(r[0],r[1],r[2]).length();const a=ts.set(r[4],r[5],r[6]).length(),l=ts.set(r[8],r[9],r[10]).length();this.determinant()<0&&(o=-o),t.x=r[12],t.y=r[13],t.z=r[14],bn.copy(this);const h=1/o,u=1/a,f=1/l;return bn.elements[0]*=h,bn.elements[1]*=h,bn.elements[2]*=h,bn.elements[4]*=u,bn.elements[5]*=u,bn.elements[6]*=u,bn.elements[8]*=f,bn.elements[9]*=f,bn.elements[10]*=f,e.setFromRotationMatrix(bn),i.x=o,i.y=a,i.z=l,this}makePerspective(t,e,i,r,o,a,l=Qn){const c=this.elements,h=2*o/(e-t),u=2*o/(i-r),f=(e+t)/(e-t),d=(i+r)/(i-r);let p,x;if(l===Qn)p=-(a+o)/(a-o),x=-2*a*o/(a-o);else if(l===Co)p=-a/(a-o),x=-a*o/(a-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+l);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,r,o,a,l=Qn){const c=this.elements,h=1/(e-t),u=1/(i-r),f=1/(a-o),d=(e+t)*h,p=(i+r)*u;let x,v;if(l===Qn)x=(a+o)*f,v=-2*f;else if(l===Co)x=o*f,v=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+l);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*u,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=v,c[14]=-x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let r=0;r<16;r++)if(e[r]!==i[r])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const ts=new D,bn=new pe,zp=new D(0,0,0),kp=new D(1,1,1),li=new D,Ir=new D,dn=new D,xh=new pe,vh=new mr;class Un{constructor(t=0,e=0,i=0,r=Un.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,r=this._order){return this._x=t,this._y=e,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const r=t.elements,o=r[0],a=r[4],l=r[8],c=r[1],h=r[5],u=r[9],f=r[2],d=r[6],p=r[10];switch(e){case"XYZ":this._y=Math.asin($e(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,o)):(this._x=Math.atan2(d,h),this._z=0);break;case"YXZ":this._x=Math.asin(-$e(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(l,p),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-f,o),this._z=0);break;case"ZXY":this._x=Math.asin($e(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,p),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(c,o));break;case"ZYX":this._y=Math.asin(-$e(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(c,o)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin($e(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,h),this._y=Math.atan2(-f,o)):(this._x=0,this._y=Math.atan2(l,p));break;case"XZY":this._z=Math.asin(-$e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,h),this._y=Math.atan2(l,o)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return xh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(xh,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return vh.setFromEuler(this),this.setFromQuaternion(vh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Un.DEFAULT_ORDER="XYZ";class wc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Bp=0;const _h=new D,es=new mr,Wn=new pe,Lr=new D,$s=new D,Hp=new D,Gp=new mr,Mh=new D(1,0,0),yh=new D(0,1,0),Sh=new D(0,0,1),wh={type:"added"},Vp={type:"removed"},ns={type:"childadded",child:null},ma={type:"childremoved",child:null};class ke extends Ds{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Bp++}),this.uuid=Ns(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ke.DEFAULT_UP.clone();const t=new D,e=new Un,i=new mr,r=new D(1,1,1);function o(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(o),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new pe},normalMatrix:{value:new Kt}}),this.matrix=new pe,this.matrixWorld=new pe,this.matrixAutoUpdate=ke.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ke.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new wc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return es.setFromAxisAngle(t,e),this.quaternion.multiply(es),this}rotateOnWorldAxis(t,e){return es.setFromAxisAngle(t,e),this.quaternion.premultiply(es),this}rotateX(t){return this.rotateOnAxis(Mh,t)}rotateY(t){return this.rotateOnAxis(yh,t)}rotateZ(t){return this.rotateOnAxis(Sh,t)}translateOnAxis(t,e){return _h.copy(t).applyQuaternion(this.quaternion),this.position.add(_h.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Mh,t)}translateY(t){return this.translateOnAxis(yh,t)}translateZ(t){return this.translateOnAxis(Sh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Wn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Lr.copy(t):Lr.set(t,e,i);const r=this.parent;this.updateWorldMatrix(!0,!1),$s.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Wn.lookAt($s,Lr,this.up):Wn.lookAt(Lr,$s,this.up),this.quaternion.setFromRotationMatrix(Wn),r&&(Wn.extractRotation(r.matrixWorld),es.setFromRotationMatrix(Wn),this.quaternion.premultiply(es.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(wh),ns.child=t,this.dispatchEvent(ns),ns.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Vp),ma.child=t,this.dispatchEvent(ma),ma.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Wn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Wn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Wn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(wh),ns.child=t,this.dispatchEvent(ns),ns.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($s,t,Hp),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($s,Gp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,r=e.length;i<r;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,r=e.length;i<r;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,r=e.length;i<r;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(l=>({boxInitialized:l.boxInitialized,boxMin:l.box.min.toArray(),boxMax:l.box.max.toArray(),sphereInitialized:l.sphereInitialized,sphereRadius:l.sphere.radius,sphereCenter:l.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function o(l,c){return l[c.uuid]===void 0&&(l[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=o(t.geometries,this.geometry);const l=this.geometry.parameters;if(l!==void 0&&l.shapes!==void 0){const c=l.shapes;if(Array.isArray(c))for(let h=0,u=c.length;h<u;h++){const f=c[h];o(t.shapes,f)}else o(t.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const l=[];for(let c=0,h=this.material.length;c<h;c++)l.push(o(t.materials,this.material[c]));r.material=l}else r.material=o(t.materials,this.material);if(this.children.length>0){r.children=[];for(let l=0;l<this.children.length;l++)r.children.push(this.children[l].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let l=0;l<this.animations.length;l++){const c=this.animations[l];r.animations.push(o(t.animations,c))}}if(e){const l=a(t.geometries),c=a(t.materials),h=a(t.textures),u=a(t.images),f=a(t.shapes),d=a(t.skeletons),p=a(t.animations),x=a(t.nodes);l.length>0&&(i.geometries=l),c.length>0&&(i.materials=c),h.length>0&&(i.textures=h),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),x.length>0&&(i.nodes=x)}return i.object=r,i;function a(l){const c=[];for(const h in l){const u=l[h];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const r=t.children[i];this.add(r.clone())}return this}}ke.DEFAULT_UP=new D(0,1,0);ke.DEFAULT_MATRIX_AUTO_UPDATE=!0;ke.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const En=new D,$n=new D,ga=new D,Xn=new D,is=new D,ss=new D,bh=new D,xa=new D,va=new D,_a=new D,Ma=new Ae,ya=new Ae,Sa=new Ae;class Rn{constructor(t=new D,e=new D,i=new D){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,r){r.subVectors(i,e),En.subVectors(t,e),r.cross(En);const o=r.lengthSq();return o>0?r.multiplyScalar(1/Math.sqrt(o)):r.set(0,0,0)}static getBarycoord(t,e,i,r,o){En.subVectors(r,e),$n.subVectors(i,e),ga.subVectors(t,e);const a=En.dot(En),l=En.dot($n),c=En.dot(ga),h=$n.dot($n),u=$n.dot(ga),f=a*h-l*l;if(f===0)return o.set(0,0,0),null;const d=1/f,p=(h*c-l*u)*d,x=(a*u-l*c)*d;return o.set(1-p-x,x,p)}static containsPoint(t,e,i,r){return this.getBarycoord(t,e,i,r,Xn)===null?!1:Xn.x>=0&&Xn.y>=0&&Xn.x+Xn.y<=1}static getInterpolation(t,e,i,r,o,a,l,c){return this.getBarycoord(t,e,i,r,Xn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(o,Xn.x),c.addScaledVector(a,Xn.y),c.addScaledVector(l,Xn.z),c)}static getInterpolatedAttribute(t,e,i,r,o,a){return Ma.setScalar(0),ya.setScalar(0),Sa.setScalar(0),Ma.fromBufferAttribute(t,e),ya.fromBufferAttribute(t,i),Sa.fromBufferAttribute(t,r),a.setScalar(0),a.addScaledVector(Ma,o.x),a.addScaledVector(ya,o.y),a.addScaledVector(Sa,o.z),a}static isFrontFacing(t,e,i,r){return En.subVectors(i,e),$n.subVectors(t,e),En.cross($n).dot(r)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,r){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,i,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return En.subVectors(this.c,this.b),$n.subVectors(this.a,this.b),En.cross($n).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Rn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Rn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,r,o){return Rn.getInterpolation(t,this.a,this.b,this.c,e,i,r,o)}containsPoint(t){return Rn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Rn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,r=this.b,o=this.c;let a,l;is.subVectors(r,i),ss.subVectors(o,i),xa.subVectors(t,i);const c=is.dot(xa),h=ss.dot(xa);if(c<=0&&h<=0)return e.copy(i);va.subVectors(t,r);const u=is.dot(va),f=ss.dot(va);if(u>=0&&f<=u)return e.copy(r);const d=c*f-u*h;if(d<=0&&c>=0&&u<=0)return a=c/(c-u),e.copy(i).addScaledVector(is,a);_a.subVectors(t,o);const p=is.dot(_a),x=ss.dot(_a);if(x>=0&&p<=x)return e.copy(o);const v=p*h-c*x;if(v<=0&&h>=0&&x<=0)return l=h/(h-x),e.copy(i).addScaledVector(ss,l);const m=u*x-p*f;if(m<=0&&f-u>=0&&p-x>=0)return bh.subVectors(o,r),l=(f-u)/(f-u+(p-x)),e.copy(r).addScaledVector(bh,l);const g=1/(m+v+d);return a=v*g,l=d*g,e.copy(i).addScaledVector(is,a).addScaledVector(ss,l)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const ed={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ci={h:0,s:0,l:0},Dr={h:0,s:0,l:0};function wa(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class Yt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=An){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,le.toWorkingColorSpace(this,e),this}setRGB(t,e,i,r=le.workingColorSpace){return this.r=t,this.g=e,this.b=i,le.toWorkingColorSpace(this,r),this}setHSL(t,e,i,r=le.workingColorSpace){if(t=Tp(t,1),e=$e(e,0,1),i=$e(i,0,1),e===0)this.r=this.g=this.b=i;else{const o=i<=.5?i*(1+e):i+e-i*e,a=2*i-o;this.r=wa(a,o,t+1/3),this.g=wa(a,o,t),this.b=wa(a,o,t-1/3)}return le.toWorkingColorSpace(this,r),this}setStyle(t,e=An){function i(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const a=r[1],l=r[2];switch(a){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return i(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return i(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return i(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=r[1],a=o.length;if(a===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=An){const i=ed[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=gs(t.r),this.g=gs(t.g),this.b=gs(t.b),this}copyLinearToSRGB(t){return this.r=aa(t.r),this.g=aa(t.g),this.b=aa(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=An){return le.fromWorkingColorSpace(Ye.copy(this),t),Math.round($e(Ye.r*255,0,255))*65536+Math.round($e(Ye.g*255,0,255))*256+Math.round($e(Ye.b*255,0,255))}getHexString(t=An){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=le.workingColorSpace){le.fromWorkingColorSpace(Ye.copy(this),e);const i=Ye.r,r=Ye.g,o=Ye.b,a=Math.max(i,r,o),l=Math.min(i,r,o);let c,h;const u=(l+a)/2;if(l===a)c=0,h=0;else{const f=a-l;switch(h=u<=.5?f/(a+l):f/(2-a-l),a){case i:c=(r-o)/f+(r<o?6:0);break;case r:c=(o-i)/f+2;break;case o:c=(i-r)/f+4;break}c/=6}return t.h=c,t.s=h,t.l=u,t}getRGB(t,e=le.workingColorSpace){return le.fromWorkingColorSpace(Ye.copy(this),e),t.r=Ye.r,t.g=Ye.g,t.b=Ye.b,t}getStyle(t=An){le.fromWorkingColorSpace(Ye.copy(this),t);const e=Ye.r,i=Ye.g,r=Ye.b;return t!==An?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(t,e,i){return this.getHSL(ci),this.setHSL(ci.h+t,ci.s+e,ci.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(ci),t.getHSL(Dr);const i=ra(ci.h,Dr.h,e),r=ra(ci.s,Dr.s,e),o=ra(ci.l,Dr.l,e);return this.setHSL(i,r,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,r=this.b,o=t.elements;return this.r=o[0]*e+o[3]*i+o[6]*r,this.g=o[1]*e+o[4]*i+o[7]*r,this.b=o[2]*e+o[5]*i+o[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ye=new Yt;Yt.NAMES=ed;let Wp=0;class Wi extends Ds{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Wp++}),this.uuid=Ns(),this.name="",this.type="Material",this.blending=ps,this.side=Mi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ll,this.blendDst=cl,this.blendEquation=Ni,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Yt(0,0,0),this.blendAlpha=0,this.depthFunc=Ss,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=hh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ji,this.stencilZFail=ji,this.stencilZPass=ji,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ps&&(i.blending=this.blending),this.side!==Mi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ll&&(i.blendSrc=this.blendSrc),this.blendDst!==cl&&(i.blendDst=this.blendDst),this.blendEquation!==Ni&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ss&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==hh&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ji&&(i.stencilFail=this.stencilFail),this.stencilZFail!==ji&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==ji&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(o){const a=[];for(const l in o){const c=o[l];delete c.metadata,a.push(c)}return a}if(e){const o=r(t.textures),a=r(t.images);o.length>0&&(i.textures=o),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const r=e.length;i=new Array(r);for(let o=0;o!==r;++o)i[o]=e[o].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Ce extends Wi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Un,this.combine=mc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const De=new D,Nr=new ht;class en{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=uh,this.updateRanges=[],this.gpuType=Jn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let r=0,o=this.itemSize;r<o;r++)this.array[t+r]=e.array[i+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Nr.fromBufferAttribute(this,e),Nr.applyMatrix3(t),this.setXY(e,Nr.x,Nr.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)De.fromBufferAttribute(this,e),De.applyMatrix3(t),this.setXYZ(e,De.x,De.y,De.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)De.fromBufferAttribute(this,e),De.applyMatrix4(t),this.setXYZ(e,De.x,De.y,De.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)De.fromBufferAttribute(this,e),De.applyNormalMatrix(t),this.setXYZ(e,De.x,De.y,De.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)De.fromBufferAttribute(this,e),De.transformDirection(t),this.setXYZ(e,De.x,De.y,De.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Hs(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=on(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Hs(e,this.array)),e}setX(t,e){return this.normalized&&(e=on(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Hs(e,this.array)),e}setY(t,e){return this.normalized&&(e=on(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Hs(e,this.array)),e}setZ(t,e){return this.normalized&&(e=on(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Hs(e,this.array)),e}setW(t,e){return this.normalized&&(e=on(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=on(e,this.array),i=on(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,r){return t*=this.itemSize,this.normalized&&(e=on(e,this.array),i=on(i,this.array),r=on(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=r,this}setXYZW(t,e,i,r,o){return t*=this.itemSize,this.normalized&&(e=on(e,this.array),i=on(i,this.array),r=on(r,this.array),o=on(o,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=r,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==uh&&(t.usage=this.usage),t}}class nd extends en{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class id extends en{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class ee extends en{constructor(t,e,i){super(new Float32Array(t),e,i)}}let $p=0;const _n=new pe,ba=new ke,rs=new D,fn=new gr,Xs=new gr,Ge=new D;class Se extends Ds{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:$p++}),this.uuid=Ns(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ju(t)?id:nd)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const o=new Kt().getNormalMatrix(t);i.applyNormalMatrix(o),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return _n.makeRotationFromQuaternion(t),this.applyMatrix4(_n),this}rotateX(t){return _n.makeRotationX(t),this.applyMatrix4(_n),this}rotateY(t){return _n.makeRotationY(t),this.applyMatrix4(_n),this}rotateZ(t){return _n.makeRotationZ(t),this.applyMatrix4(_n),this}translate(t,e,i){return _n.makeTranslation(t,e,i),this.applyMatrix4(_n),this}scale(t,e,i){return _n.makeScale(t,e,i),this.applyMatrix4(_n),this}lookAt(t){return ba.lookAt(t),ba.updateMatrix(),this.applyMatrix4(ba.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(rs).negate(),this.translate(rs.x,rs.y,rs.z),this}setFromPoints(t){const e=[];for(let i=0,r=t.length;i<r;i++){const o=t[i];e.push(o.x,o.y,o.z||0)}return this.setAttribute("position",new ee(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new gr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,r=e.length;i<r;i++){const o=e[i];fn.setFromBufferAttribute(o),this.morphTargetsRelative?(Ge.addVectors(this.boundingBox.min,fn.min),this.boundingBox.expandByPoint(Ge),Ge.addVectors(this.boundingBox.max,fn.max),this.boundingBox.expandByPoint(Ge)):(this.boundingBox.expandByPoint(fn.min),this.boundingBox.expandByPoint(fn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new xr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(t){const i=this.boundingSphere.center;if(fn.setFromBufferAttribute(t),e)for(let o=0,a=e.length;o<a;o++){const l=e[o];Xs.setFromBufferAttribute(l),this.morphTargetsRelative?(Ge.addVectors(fn.min,Xs.min),fn.expandByPoint(Ge),Ge.addVectors(fn.max,Xs.max),fn.expandByPoint(Ge)):(fn.expandByPoint(Xs.min),fn.expandByPoint(Xs.max))}fn.getCenter(i);let r=0;for(let o=0,a=t.count;o<a;o++)Ge.fromBufferAttribute(t,o),r=Math.max(r,i.distanceToSquared(Ge));if(e)for(let o=0,a=e.length;o<a;o++){const l=e[o],c=this.morphTargetsRelative;for(let h=0,u=l.count;h<u;h++)Ge.fromBufferAttribute(l,h),c&&(rs.fromBufferAttribute(t,h),Ge.add(rs)),r=Math.max(r,i.distanceToSquared(Ge))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,r=e.normal,o=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new en(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),l=[],c=[];for(let I=0;I<i.count;I++)l[I]=new D,c[I]=new D;const h=new D,u=new D,f=new D,d=new ht,p=new ht,x=new ht,v=new D,m=new D;function g(I,Z,M){h.fromBufferAttribute(i,I),u.fromBufferAttribute(i,Z),f.fromBufferAttribute(i,M),d.fromBufferAttribute(o,I),p.fromBufferAttribute(o,Z),x.fromBufferAttribute(o,M),u.sub(h),f.sub(h),p.sub(d),x.sub(d);const b=1/(p.x*x.y-x.x*p.y);isFinite(b)&&(v.copy(u).multiplyScalar(x.y).addScaledVector(f,-p.y).multiplyScalar(b),m.copy(f).multiplyScalar(p.x).addScaledVector(u,-x.x).multiplyScalar(b),l[I].add(v),l[Z].add(v),l[M].add(v),c[I].add(m),c[Z].add(m),c[M].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let I=0,Z=y.length;I<Z;++I){const M=y[I],b=M.start,B=M.count;for(let H=b,U=b+B;H<U;H+=3)g(t.getX(H+0),t.getX(H+1),t.getX(H+2))}const _=new D,S=new D,P=new D,C=new D;function T(I){P.fromBufferAttribute(r,I),C.copy(P);const Z=l[I];_.copy(Z),_.sub(P.multiplyScalar(P.dot(Z))).normalize(),S.crossVectors(C,Z);const b=S.dot(c[I])<0?-1:1;a.setXYZW(I,_.x,_.y,_.z,b)}for(let I=0,Z=y.length;I<Z;++I){const M=y[I],b=M.start,B=M.count;for(let H=b,U=b+B;H<U;H+=3)T(t.getX(H+0)),T(t.getX(H+1)),T(t.getX(H+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new en(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);const r=new D,o=new D,a=new D,l=new D,c=new D,h=new D,u=new D,f=new D;if(t)for(let d=0,p=t.count;d<p;d+=3){const x=t.getX(d+0),v=t.getX(d+1),m=t.getX(d+2);r.fromBufferAttribute(e,x),o.fromBufferAttribute(e,v),a.fromBufferAttribute(e,m),u.subVectors(a,o),f.subVectors(r,o),u.cross(f),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,v),h.fromBufferAttribute(i,m),l.add(u),c.add(u),h.add(u),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(m,h.x,h.y,h.z)}else for(let d=0,p=e.count;d<p;d+=3)r.fromBufferAttribute(e,d+0),o.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),u.subVectors(a,o),f.subVectors(r,o),u.cross(f),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Ge.fromBufferAttribute(t,e),Ge.normalize(),t.setXYZ(e,Ge.x,Ge.y,Ge.z)}toNonIndexed(){function t(l,c){const h=l.array,u=l.itemSize,f=l.normalized,d=new h.constructor(c.length*u);let p=0,x=0;for(let v=0,m=c.length;v<m;v++){l.isInterleavedBufferAttribute?p=c[v]*l.data.stride+l.offset:p=c[v]*u;for(let g=0;g<u;g++)d[x++]=h[p++]}return new en(d,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Se,i=this.index.array,r=this.attributes;for(const l in r){const c=r[l],h=t(c,i);e.setAttribute(l,h)}const o=this.morphAttributes;for(const l in o){const c=[],h=o[l];for(let u=0,f=h.length;u<f;u++){const d=h[u],p=t(d,i);c.push(p)}e.morphAttributes[l]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let l=0,c=a.length;l<c;l++){const h=a[l];e.addGroup(h.start,h.count,h.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(t[h]=c[h]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const h=i[c];t.data.attributes[c]=h.toJSON(t.data)}const r={};let o=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],u=[];for(let f=0,d=h.length;f<d;f++){const p=h[f];u.push(p.toJSON(t.data))}u.length>0&&(r[c]=u,o=!0)}o&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const l=this.boundingSphere;return l!==null&&(t.data.boundingSphere={center:l.center.toArray(),radius:l.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const r=t.attributes;for(const h in r){const u=r[h];this.setAttribute(h,u.clone(e))}const o=t.morphAttributes;for(const h in o){const u=[],f=o[h];for(let d=0,p=f.length;d<p;d++)u.push(f[d].clone(e));this.morphAttributes[h]=u}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let h=0,u=a.length;h<u;h++){const f=a[h];this.addGroup(f.start,f.count,f.materialIndex)}const l=t.boundingBox;l!==null&&(this.boundingBox=l.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Eh=new pe,Ai=new Wo,Ur=new xr,Th=new D,Or=new D,Fr=new D,zr=new D,Ea=new D,kr=new D,Ah=new D,Br=new D;class Bt extends ke{constructor(t=new Se,e=new Ce){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const r=e[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=r.length;o<a;o++){const l=r[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=o}}}}getVertexPosition(t,e){const i=this.geometry,r=i.attributes.position,o=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(r,t);const l=this.morphTargetInfluences;if(o&&l){kr.set(0,0,0);for(let c=0,h=o.length;c<h;c++){const u=l[c],f=o[c];u!==0&&(Ea.fromBufferAttribute(f,t),a?kr.addScaledVector(Ea,u):kr.addScaledVector(Ea.sub(e),u))}e.add(kr)}return e}raycast(t,e){const i=this.geometry,r=this.material,o=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ur.copy(i.boundingSphere),Ur.applyMatrix4(o),Ai.copy(t.ray).recast(t.near),!(Ur.containsPoint(Ai.origin)===!1&&(Ai.intersectSphere(Ur,Th)===null||Ai.origin.distanceToSquared(Th)>(t.far-t.near)**2))&&(Eh.copy(o).invert(),Ai.copy(t.ray).applyMatrix4(Eh),!(i.boundingBox!==null&&Ai.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Ai)))}_computeIntersections(t,e,i){let r;const o=this.geometry,a=this.material,l=o.index,c=o.attributes.position,h=o.attributes.uv,u=o.attributes.uv1,f=o.attributes.normal,d=o.groups,p=o.drawRange;if(l!==null)if(Array.isArray(a))for(let x=0,v=d.length;x<v;x++){const m=d[x],g=a[m.materialIndex],y=Math.max(m.start,p.start),_=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let S=y,P=_;S<P;S+=3){const C=l.getX(S),T=l.getX(S+1),I=l.getX(S+2);r=Hr(this,g,t,i,h,u,f,C,T,I),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{const x=Math.max(0,p.start),v=Math.min(l.count,p.start+p.count);for(let m=x,g=v;m<g;m+=3){const y=l.getX(m),_=l.getX(m+1),S=l.getX(m+2);r=Hr(this,a,t,i,h,u,f,y,_,S),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let x=0,v=d.length;x<v;x++){const m=d[x],g=a[m.materialIndex],y=Math.max(m.start,p.start),_=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let S=y,P=_;S<P;S+=3){const C=S,T=S+1,I=S+2;r=Hr(this,g,t,i,h,u,f,C,T,I),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{const x=Math.max(0,p.start),v=Math.min(c.count,p.start+p.count);for(let m=x,g=v;m<g;m+=3){const y=m,_=m+1,S=m+2;r=Hr(this,a,t,i,h,u,f,y,_,S),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}}}function Xp(n,t,e,i,r,o,a,l){let c;if(t.side===ln?c=i.intersectTriangle(a,o,r,!0,l):c=i.intersectTriangle(r,o,a,t.side===Mi,l),c===null)return null;Br.copy(l),Br.applyMatrix4(n.matrixWorld);const h=e.ray.origin.distanceTo(Br);return h<e.near||h>e.far?null:{distance:h,point:Br.clone(),object:n}}function Hr(n,t,e,i,r,o,a,l,c,h){n.getVertexPosition(l,Or),n.getVertexPosition(c,Fr),n.getVertexPosition(h,zr);const u=Xp(n,t,e,i,Or,Fr,zr,Ah);if(u){const f=new D;Rn.getBarycoord(Ah,Or,Fr,zr,f),r&&(u.uv=Rn.getInterpolatedAttribute(r,l,c,h,f,new ht)),o&&(u.uv1=Rn.getInterpolatedAttribute(o,l,c,h,f,new ht)),a&&(u.normal=Rn.getInterpolatedAttribute(a,l,c,h,f,new D),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a:l,b:c,c:h,normal:new D,materialIndex:0};Rn.getNormal(Or,Fr,zr,d.normal),u.face=d,u.barycoord=f}return u}class re extends Se{constructor(t=1,e=1,i=1,r=1,o=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:r,heightSegments:o,depthSegments:a};const l=this;r=Math.floor(r),o=Math.floor(o),a=Math.floor(a);const c=[],h=[],u=[],f=[];let d=0,p=0;x("z","y","x",-1,-1,i,e,t,a,o,0),x("z","y","x",1,-1,i,e,-t,a,o,1),x("x","z","y",1,1,t,i,e,r,a,2),x("x","z","y",1,-1,t,i,-e,r,a,3),x("x","y","z",1,-1,t,e,i,r,o,4),x("x","y","z",-1,-1,t,e,-i,r,o,5),this.setIndex(c),this.setAttribute("position",new ee(h,3)),this.setAttribute("normal",new ee(u,3)),this.setAttribute("uv",new ee(f,2));function x(v,m,g,y,_,S,P,C,T,I,Z){const M=S/T,b=P/I,B=S/2,H=P/2,U=C/2,z=T+1,L=I+1;let W=0,k=0;const Y=new D;for(let et=0;et<L;et++){const j=et*b-H;for(let xt=0;xt<z;xt++){const Pt=xt*M-B;Y[v]=Pt*y,Y[m]=j*_,Y[g]=U,h.push(Y.x,Y.y,Y.z),Y[v]=0,Y[m]=0,Y[g]=C>0?1:-1,u.push(Y.x,Y.y,Y.z),f.push(xt/T),f.push(1-et/I),W+=1}}for(let et=0;et<I;et++)for(let j=0;j<T;j++){const xt=d+j+z*et,Pt=d+j+z*(et+1),V=d+(j+1)+z*(et+1),K=d+(j+1)+z*et;c.push(xt,Pt,K),c.push(Pt,V,K),k+=6}l.addGroup(p,k,Z),p+=k,d+=W}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new re(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function As(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const r=n[e][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=r.clone():Array.isArray(r)?t[e][i]=r.slice():t[e][i]=r}}return t}function Je(n){const t={};for(let e=0;e<n.length;e++){const i=As(n[e]);for(const r in i)t[r]=i[r]}return t}function qp(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function sd(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:le.workingColorSpace}const Yp={clone:As,merge:Je};var jp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Zp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class yi extends Wi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=jp,this.fragmentShader=Zp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=As(t.uniforms),this.uniformsGroups=qp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?e.uniforms[r]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[r]={type:"m4",value:a.toArray()}:e.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class rd extends ke{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new pe,this.projectionMatrix=new pe,this.projectionMatrixInverse=new pe,this.coordinateSystem=Qn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const hi=new D,Ch=new ht,Rh=new ht;class Mn extends rd{constructor(t=50,e=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Xl*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(sa*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Xl*2*Math.atan(Math.tan(sa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){hi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(hi.x,hi.y).multiplyScalar(-t/hi.z),hi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(hi.x,hi.y).multiplyScalar(-t/hi.z)}getViewSize(t,e){return this.getViewBounds(t,Ch,Rh),e.subVectors(Rh,Ch)}setViewOffset(t,e,i,r,o,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=r,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(sa*.5*this.fov)/this.zoom,i=2*e,r=this.aspect*i,o=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,h=a.fullHeight;o+=a.offsetX*r/c,e-=a.offsetY*i/h,r*=a.width/c,i*=a.height/h}const l=this.filmOffset;l!==0&&(o+=t*l/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+r,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const os=-90,as=1;class Kp extends ke{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Mn(os,as,t,e);r.layers=this.layers,this.add(r);const o=new Mn(os,as,t,e);o.layers=this.layers,this.add(o);const a=new Mn(os,as,t,e);a.layers=this.layers,this.add(a);const l=new Mn(os,as,t,e);l.layers=this.layers,this.add(l);const c=new Mn(os,as,t,e);c.layers=this.layers,this.add(c);const h=new Mn(os,as,t,e);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,r,o,a,l,c]=e;for(const h of e)this.remove(h);if(t===Qn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),l.up.set(0,1,0),l.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Co)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),l.up.set(0,-1,0),l.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const h of e)this.add(h),h.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,a,l,c,h,u]=this.children,f=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),x=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,r),t.render(e,o),t.setRenderTarget(i,1,r),t.render(e,a),t.setRenderTarget(i,2,r),t.render(e,l),t.setRenderTarget(i,3,r),t.render(e,c),t.setRenderTarget(i,4,r),t.render(e,h),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,r),t.render(e,u),t.setRenderTarget(f,d,p),t.xr.enabled=x,i.texture.needsPMREMUpdate=!0}}class od extends tn{constructor(t,e,i,r,o,a,l,c,h,u){t=t!==void 0?t:[],e=e!==void 0?e:ws,super(t,e,i,r,o,a,l,c,h,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Jp extends Gi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},r=[i,i,i,i,i,i];this.texture=new od(r,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Cn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new re(5,5,5),o=new yi({name:"CubemapFromEquirect",uniforms:As(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:ln,blending:gi});o.uniforms.tEquirect.value=e;const a=new Bt(r,o),l=e.minFilter;return e.minFilter===Fi&&(e.minFilter=Cn),new Kp(1,10,this).update(t,a),e.minFilter=l,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,i,r){const o=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,r);t.setRenderTarget(o)}}const Ta=new D,Qp=new D,tm=new Kt;class jn{constructor(t=new D(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,r){return this.normal.set(t,e,i),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const r=Ta.subVectors(i,e).cross(Qp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Ta),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/r;return o<0||o>1?null:e.copy(t.start).addScaledVector(i,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||tm.getNormalMatrix(t),r=this.coplanarPoint(Ta).applyMatrix4(t),o=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ci=new xr,Gr=new D;class bc{constructor(t=new jn,e=new jn,i=new jn,r=new jn,o=new jn,a=new jn){this.planes=[t,e,i,r,o,a]}set(t,e,i,r,o,a){const l=this.planes;return l[0].copy(t),l[1].copy(e),l[2].copy(i),l[3].copy(r),l[4].copy(o),l[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Qn){const i=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],f=r[6],d=r[7],p=r[8],x=r[9],v=r[10],m=r[11],g=r[12],y=r[13],_=r[14],S=r[15];if(i[0].setComponents(c-o,d-h,m-p,S-g).normalize(),i[1].setComponents(c+o,d+h,m+p,S+g).normalize(),i[2].setComponents(c+a,d+u,m+x,S+y).normalize(),i[3].setComponents(c-a,d-u,m-x,S-y).normalize(),i[4].setComponents(c-l,d-f,m-v,S-_).normalize(),e===Qn)i[5].setComponents(c+l,d+f,m+v,S+_).normalize();else if(e===Co)i[5].setComponents(l,f,v,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ci.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ci.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ci)}intersectsSprite(t){return Ci.center.set(0,0,0),Ci.radius=.7071067811865476,Ci.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ci)}intersectsSphere(t){const e=this.planes,i=t.center,r=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(i)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const r=e[i];if(Gr.x=r.normal.x>0?t.max.x:t.min.x,Gr.y=r.normal.y>0?t.max.y:t.min.y,Gr.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(Gr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function ad(){let n=null,t=!1,e=null,i=null;function r(o,a){e(o,a),i=n.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(r),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){n=o}}}function em(n){const t=new WeakMap;function e(l,c){const h=l.array,u=l.usage,f=h.byteLength,d=n.createBuffer();n.bindBuffer(c,d),n.bufferData(c,h,u),l.onUploadCallback();let p;if(h instanceof Float32Array)p=n.FLOAT;else if(h instanceof Uint16Array)l.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(h instanceof Int16Array)p=n.SHORT;else if(h instanceof Uint32Array)p=n.UNSIGNED_INT;else if(h instanceof Int32Array)p=n.INT;else if(h instanceof Int8Array)p=n.BYTE;else if(h instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:d,type:p,bytesPerElement:h.BYTES_PER_ELEMENT,version:l.version,size:f}}function i(l,c,h){const u=c.array,f=c.updateRanges;if(n.bindBuffer(h,l),f.length===0)n.bufferSubData(h,0,u);else{f.sort((p,x)=>p.start-x.start);let d=0;for(let p=1;p<f.length;p++){const x=f[d],v=f[p];v.start<=x.start+x.count+1?x.count=Math.max(x.count,v.start+v.count-x.start):(++d,f[d]=v)}f.length=d+1;for(let p=0,x=f.length;p<x;p++){const v=f[p];n.bufferSubData(h,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(l){return l.isInterleavedBufferAttribute&&(l=l.data),t.get(l)}function o(l){l.isInterleavedBufferAttribute&&(l=l.data);const c=t.get(l);c&&(n.deleteBuffer(c.buffer),t.delete(l))}function a(l,c){if(l.isInterleavedBufferAttribute&&(l=l.data),l.isGLBufferAttribute){const u=t.get(l);(!u||u.version<l.version)&&t.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}const h=t.get(l);if(h===void 0)t.set(l,e(l,c));else if(h.version<l.version){if(h.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,l,c),h.version=l.version}}return{get:r,remove:o,update:a}}class kn extends Se{constructor(t=1,e=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:r};const o=t/2,a=e/2,l=Math.floor(i),c=Math.floor(r),h=l+1,u=c+1,f=t/l,d=e/c,p=[],x=[],v=[],m=[];for(let g=0;g<u;g++){const y=g*d-a;for(let _=0;_<h;_++){const S=_*f-o;x.push(S,-y,0),v.push(0,0,1),m.push(_/l),m.push(1-g/c)}}for(let g=0;g<c;g++)for(let y=0;y<l;y++){const _=y+h*g,S=y+h*(g+1),P=y+1+h*(g+1),C=y+1+h*g;p.push(_,S,C),p.push(S,P,C)}this.setIndex(p),this.setAttribute("position",new ee(x,3)),this.setAttribute("normal",new ee(v,3)),this.setAttribute("uv",new ee(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new kn(t.width,t.height,t.widthSegments,t.heightSegments)}}var nm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,im=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,sm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,rm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,om=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,am=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,lm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,cm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,hm=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,um=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,dm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,fm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,pm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,mm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,gm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,xm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,vm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,_m=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Mm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ym=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Sm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,wm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,bm=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Em=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Tm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Am=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Cm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Rm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Pm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Im=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Lm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Dm=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Nm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Um=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Om=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Fm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,zm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,km=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Bm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Hm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Gm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Vm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Wm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,$m=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Xm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,qm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Ym=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,jm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Zm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Km=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Jm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Qm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,t0=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,e0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,n0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,i0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,s0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,r0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,o0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,a0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,l0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,c0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,h0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,u0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,d0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,f0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,p0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,m0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,g0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,x0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,v0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,_0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,M0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,y0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,S0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,w0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,b0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,E0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,T0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,A0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,C0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,R0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,P0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,I0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,L0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,D0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,N0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,U0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,O0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,F0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,z0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,k0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,B0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,H0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,G0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,V0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,W0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,$0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,X0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,q0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Y0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,j0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Z0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,K0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,J0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Q0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,tg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const eg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ng=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ig=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,og=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ag=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,lg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,cg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,hg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,ug=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,dg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,pg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,mg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,gg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_g=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Mg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Sg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,wg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,bg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Eg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Tg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ag=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Cg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Rg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Pg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ig=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Lg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Dg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ng=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Zt={alphahash_fragment:nm,alphahash_pars_fragment:im,alphamap_fragment:sm,alphamap_pars_fragment:rm,alphatest_fragment:om,alphatest_pars_fragment:am,aomap_fragment:lm,aomap_pars_fragment:cm,batching_pars_vertex:hm,batching_vertex:um,begin_vertex:dm,beginnormal_vertex:fm,bsdfs:pm,iridescence_fragment:mm,bumpmap_pars_fragment:gm,clipping_planes_fragment:xm,clipping_planes_pars_fragment:vm,clipping_planes_pars_vertex:_m,clipping_planes_vertex:Mm,color_fragment:ym,color_pars_fragment:Sm,color_pars_vertex:wm,color_vertex:bm,common:Em,cube_uv_reflection_fragment:Tm,defaultnormal_vertex:Am,displacementmap_pars_vertex:Cm,displacementmap_vertex:Rm,emissivemap_fragment:Pm,emissivemap_pars_fragment:Im,colorspace_fragment:Lm,colorspace_pars_fragment:Dm,envmap_fragment:Nm,envmap_common_pars_fragment:Um,envmap_pars_fragment:Om,envmap_pars_vertex:Fm,envmap_physical_pars_fragment:Ym,envmap_vertex:zm,fog_vertex:km,fog_pars_vertex:Bm,fog_fragment:Hm,fog_pars_fragment:Gm,gradientmap_pars_fragment:Vm,lightmap_pars_fragment:Wm,lights_lambert_fragment:$m,lights_lambert_pars_fragment:Xm,lights_pars_begin:qm,lights_toon_fragment:jm,lights_toon_pars_fragment:Zm,lights_phong_fragment:Km,lights_phong_pars_fragment:Jm,lights_physical_fragment:Qm,lights_physical_pars_fragment:t0,lights_fragment_begin:e0,lights_fragment_maps:n0,lights_fragment_end:i0,logdepthbuf_fragment:s0,logdepthbuf_pars_fragment:r0,logdepthbuf_pars_vertex:o0,logdepthbuf_vertex:a0,map_fragment:l0,map_pars_fragment:c0,map_particle_fragment:h0,map_particle_pars_fragment:u0,metalnessmap_fragment:d0,metalnessmap_pars_fragment:f0,morphinstance_vertex:p0,morphcolor_vertex:m0,morphnormal_vertex:g0,morphtarget_pars_vertex:x0,morphtarget_vertex:v0,normal_fragment_begin:_0,normal_fragment_maps:M0,normal_pars_fragment:y0,normal_pars_vertex:S0,normal_vertex:w0,normalmap_pars_fragment:b0,clearcoat_normal_fragment_begin:E0,clearcoat_normal_fragment_maps:T0,clearcoat_pars_fragment:A0,iridescence_pars_fragment:C0,opaque_fragment:R0,packing:P0,premultiplied_alpha_fragment:I0,project_vertex:L0,dithering_fragment:D0,dithering_pars_fragment:N0,roughnessmap_fragment:U0,roughnessmap_pars_fragment:O0,shadowmap_pars_fragment:F0,shadowmap_pars_vertex:z0,shadowmap_vertex:k0,shadowmask_pars_fragment:B0,skinbase_vertex:H0,skinning_pars_vertex:G0,skinning_vertex:V0,skinnormal_vertex:W0,specularmap_fragment:$0,specularmap_pars_fragment:X0,tonemapping_fragment:q0,tonemapping_pars_fragment:Y0,transmission_fragment:j0,transmission_pars_fragment:Z0,uv_pars_fragment:K0,uv_pars_vertex:J0,uv_vertex:Q0,worldpos_vertex:tg,background_vert:eg,background_frag:ng,backgroundCube_vert:ig,backgroundCube_frag:sg,cube_vert:rg,cube_frag:og,depth_vert:ag,depth_frag:lg,distanceRGBA_vert:cg,distanceRGBA_frag:hg,equirect_vert:ug,equirect_frag:dg,linedashed_vert:fg,linedashed_frag:pg,meshbasic_vert:mg,meshbasic_frag:gg,meshlambert_vert:xg,meshlambert_frag:vg,meshmatcap_vert:_g,meshmatcap_frag:Mg,meshnormal_vert:yg,meshnormal_frag:Sg,meshphong_vert:wg,meshphong_frag:bg,meshphysical_vert:Eg,meshphysical_frag:Tg,meshtoon_vert:Ag,meshtoon_frag:Cg,points_vert:Rg,points_frag:Pg,shadow_vert:Ig,shadow_frag:Lg,sprite_vert:Dg,sprite_frag:Ng},_t={common:{diffuse:{value:new Yt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Kt}},envmap:{envMap:{value:null},envMapRotation:{value:new Kt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Kt},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Yt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Yt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0},uvTransform:{value:new Kt}},sprite:{diffuse:{value:new Yt(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}}},Ln={basic:{uniforms:Je([_t.common,_t.specularmap,_t.envmap,_t.aomap,_t.lightmap,_t.fog]),vertexShader:Zt.meshbasic_vert,fragmentShader:Zt.meshbasic_frag},lambert:{uniforms:Je([_t.common,_t.specularmap,_t.envmap,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.fog,_t.lights,{emissive:{value:new Yt(0)}}]),vertexShader:Zt.meshlambert_vert,fragmentShader:Zt.meshlambert_frag},phong:{uniforms:Je([_t.common,_t.specularmap,_t.envmap,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.fog,_t.lights,{emissive:{value:new Yt(0)},specular:{value:new Yt(1118481)},shininess:{value:30}}]),vertexShader:Zt.meshphong_vert,fragmentShader:Zt.meshphong_frag},standard:{uniforms:Je([_t.common,_t.envmap,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.roughnessmap,_t.metalnessmap,_t.fog,_t.lights,{emissive:{value:new Yt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Zt.meshphysical_vert,fragmentShader:Zt.meshphysical_frag},toon:{uniforms:Je([_t.common,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.gradientmap,_t.fog,_t.lights,{emissive:{value:new Yt(0)}}]),vertexShader:Zt.meshtoon_vert,fragmentShader:Zt.meshtoon_frag},matcap:{uniforms:Je([_t.common,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.fog,{matcap:{value:null}}]),vertexShader:Zt.meshmatcap_vert,fragmentShader:Zt.meshmatcap_frag},points:{uniforms:Je([_t.points,_t.fog]),vertexShader:Zt.points_vert,fragmentShader:Zt.points_frag},dashed:{uniforms:Je([_t.common,_t.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Zt.linedashed_vert,fragmentShader:Zt.linedashed_frag},depth:{uniforms:Je([_t.common,_t.displacementmap]),vertexShader:Zt.depth_vert,fragmentShader:Zt.depth_frag},normal:{uniforms:Je([_t.common,_t.bumpmap,_t.normalmap,_t.displacementmap,{opacity:{value:1}}]),vertexShader:Zt.meshnormal_vert,fragmentShader:Zt.meshnormal_frag},sprite:{uniforms:Je([_t.sprite,_t.fog]),vertexShader:Zt.sprite_vert,fragmentShader:Zt.sprite_frag},background:{uniforms:{uvTransform:{value:new Kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Zt.background_vert,fragmentShader:Zt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Kt}},vertexShader:Zt.backgroundCube_vert,fragmentShader:Zt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Zt.cube_vert,fragmentShader:Zt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Zt.equirect_vert,fragmentShader:Zt.equirect_frag},distanceRGBA:{uniforms:Je([_t.common,_t.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Zt.distanceRGBA_vert,fragmentShader:Zt.distanceRGBA_frag},shadow:{uniforms:Je([_t.lights,_t.fog,{color:{value:new Yt(0)},opacity:{value:1}}]),vertexShader:Zt.shadow_vert,fragmentShader:Zt.shadow_frag}};Ln.physical={uniforms:Je([Ln.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Kt},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Kt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Kt},sheen:{value:0},sheenColor:{value:new Yt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Kt},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Kt},attenuationDistance:{value:0},attenuationColor:{value:new Yt(0)},specularColor:{value:new Yt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Kt},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Kt}}]),vertexShader:Zt.meshphysical_vert,fragmentShader:Zt.meshphysical_frag};const Vr={r:0,b:0,g:0},Ri=new Un,Ug=new pe;function Og(n,t,e,i,r,o,a){const l=new Yt(0);let c=o===!0?0:1,h,u,f=null,d=0,p=null;function x(y){let _=y.isScene===!0?y.background:null;return _&&_.isTexture&&(_=(y.backgroundBlurriness>0?e:t).get(_)),_}function v(y){let _=!1;const S=x(y);S===null?g(l,c):S&&S.isColor&&(g(S,1),_=!0);const P=n.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,a):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||_)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(y,_){const S=x(_);S&&(S.isCubeTexture||S.mapping===Go)?(u===void 0&&(u=new Bt(new re(1,1,1),new yi({name:"BackgroundCubeMaterial",uniforms:As(Ln.backgroundCube.uniforms),vertexShader:Ln.backgroundCube.vertexShader,fragmentShader:Ln.backgroundCube.fragmentShader,side:ln,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(P,C,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),Ri.copy(_.backgroundRotation),Ri.x*=-1,Ri.y*=-1,Ri.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Ri.y*=-1,Ri.z*=-1),u.material.uniforms.envMap.value=S,u.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Ug.makeRotationFromEuler(Ri)),u.material.toneMapped=le.getTransfer(S.colorSpace)!==xe,(f!==S||d!==S.version||p!==n.toneMapping)&&(u.material.needsUpdate=!0,f=S,d=S.version,p=n.toneMapping),u.layers.enableAll(),y.unshift(u,u.geometry,u.material,0,0,null)):S&&S.isTexture&&(h===void 0&&(h=new Bt(new kn(2,2),new yi({name:"BackgroundMaterial",uniforms:As(Ln.background.uniforms),vertexShader:Ln.background.vertexShader,fragmentShader:Ln.background.fragmentShader,side:Mi,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(h)),h.material.uniforms.t2D.value=S,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.toneMapped=le.getTransfer(S.colorSpace)!==xe,S.matrixAutoUpdate===!0&&S.updateMatrix(),h.material.uniforms.uvTransform.value.copy(S.matrix),(f!==S||d!==S.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,f=S,d=S.version,p=n.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null))}function g(y,_){y.getRGB(Vr,sd(n)),i.buffers.color.setClear(Vr.r,Vr.g,Vr.b,_,a)}return{getClearColor:function(){return l},setClearColor:function(y,_=1){l.set(y),c=_,g(l,c)},getClearAlpha:function(){return c},setClearAlpha:function(y){c=y,g(l,c)},render:v,addToRenderList:m}}function Fg(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=d(null);let o=r,a=!1;function l(M,b,B,H,U){let z=!1;const L=f(H,B,b);o!==L&&(o=L,h(o.object)),z=p(M,H,B,U),z&&x(M,H,B,U),U!==null&&t.update(U,n.ELEMENT_ARRAY_BUFFER),(z||a)&&(a=!1,S(M,b,B,H),U!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function c(){return n.createVertexArray()}function h(M){return n.bindVertexArray(M)}function u(M){return n.deleteVertexArray(M)}function f(M,b,B){const H=B.wireframe===!0;let U=i[M.id];U===void 0&&(U={},i[M.id]=U);let z=U[b.id];z===void 0&&(z={},U[b.id]=z);let L=z[H];return L===void 0&&(L=d(c()),z[H]=L),L}function d(M){const b=[],B=[],H=[];for(let U=0;U<e;U++)b[U]=0,B[U]=0,H[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:b,enabledAttributes:B,attributeDivisors:H,object:M,attributes:{},index:null}}function p(M,b,B,H){const U=o.attributes,z=b.attributes;let L=0;const W=B.getAttributes();for(const k in W)if(W[k].location>=0){const et=U[k];let j=z[k];if(j===void 0&&(k==="instanceMatrix"&&M.instanceMatrix&&(j=M.instanceMatrix),k==="instanceColor"&&M.instanceColor&&(j=M.instanceColor)),et===void 0||et.attribute!==j||j&&et.data!==j.data)return!0;L++}return o.attributesNum!==L||o.index!==H}function x(M,b,B,H){const U={},z=b.attributes;let L=0;const W=B.getAttributes();for(const k in W)if(W[k].location>=0){let et=z[k];et===void 0&&(k==="instanceMatrix"&&M.instanceMatrix&&(et=M.instanceMatrix),k==="instanceColor"&&M.instanceColor&&(et=M.instanceColor));const j={};j.attribute=et,et&&et.data&&(j.data=et.data),U[k]=j,L++}o.attributes=U,o.attributesNum=L,o.index=H}function v(){const M=o.newAttributes;for(let b=0,B=M.length;b<B;b++)M[b]=0}function m(M){g(M,0)}function g(M,b){const B=o.newAttributes,H=o.enabledAttributes,U=o.attributeDivisors;B[M]=1,H[M]===0&&(n.enableVertexAttribArray(M),H[M]=1),U[M]!==b&&(n.vertexAttribDivisor(M,b),U[M]=b)}function y(){const M=o.newAttributes,b=o.enabledAttributes;for(let B=0,H=b.length;B<H;B++)b[B]!==M[B]&&(n.disableVertexAttribArray(B),b[B]=0)}function _(M,b,B,H,U,z,L){L===!0?n.vertexAttribIPointer(M,b,B,U,z):n.vertexAttribPointer(M,b,B,H,U,z)}function S(M,b,B,H){v();const U=H.attributes,z=B.getAttributes(),L=b.defaultAttributeValues;for(const W in z){const k=z[W];if(k.location>=0){let Y=U[W];if(Y===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(Y=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(Y=M.instanceColor)),Y!==void 0){const et=Y.normalized,j=Y.itemSize,xt=t.get(Y);if(xt===void 0)continue;const Pt=xt.buffer,V=xt.type,K=xt.bytesPerElement,lt=V===n.INT||V===n.UNSIGNED_INT||Y.gpuType===gc;if(Y.isInterleavedBufferAttribute){const at=Y.data,Rt=at.stride,Ot=Y.offset;if(at.isInstancedInterleavedBuffer){for(let Ht=0;Ht<k.locationSize;Ht++)g(k.location+Ht,at.meshPerAttribute);M.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let Ht=0;Ht<k.locationSize;Ht++)m(k.location+Ht);n.bindBuffer(n.ARRAY_BUFFER,Pt);for(let Ht=0;Ht<k.locationSize;Ht++)_(k.location+Ht,j/k.locationSize,V,et,Rt*K,(Ot+j/k.locationSize*Ht)*K,lt)}else{if(Y.isInstancedBufferAttribute){for(let at=0;at<k.locationSize;at++)g(k.location+at,Y.meshPerAttribute);M.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let at=0;at<k.locationSize;at++)m(k.location+at);n.bindBuffer(n.ARRAY_BUFFER,Pt);for(let at=0;at<k.locationSize;at++)_(k.location+at,j/k.locationSize,V,et,j*K,j/k.locationSize*at*K,lt)}}else if(L!==void 0){const et=L[W];if(et!==void 0)switch(et.length){case 2:n.vertexAttrib2fv(k.location,et);break;case 3:n.vertexAttrib3fv(k.location,et);break;case 4:n.vertexAttrib4fv(k.location,et);break;default:n.vertexAttrib1fv(k.location,et)}}}}y()}function P(){I();for(const M in i){const b=i[M];for(const B in b){const H=b[B];for(const U in H)u(H[U].object),delete H[U];delete b[B]}delete i[M]}}function C(M){if(i[M.id]===void 0)return;const b=i[M.id];for(const B in b){const H=b[B];for(const U in H)u(H[U].object),delete H[U];delete b[B]}delete i[M.id]}function T(M){for(const b in i){const B=i[b];if(B[M.id]===void 0)continue;const H=B[M.id];for(const U in H)u(H[U].object),delete H[U];delete B[M.id]}}function I(){Z(),a=!0,o!==r&&(o=r,h(o.object))}function Z(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:l,reset:I,resetDefaultState:Z,dispose:P,releaseStatesOfGeometry:C,releaseStatesOfProgram:T,initAttributes:v,enableAttribute:m,disableUnusedAttributes:y}}function zg(n,t,e){let i;function r(h){i=h}function o(h,u){n.drawArrays(i,h,u),e.update(u,i,1)}function a(h,u,f){f!==0&&(n.drawArraysInstanced(i,h,u,f),e.update(u,i,f))}function l(h,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,u,0,f);let p=0;for(let x=0;x<f;x++)p+=u[x];e.update(p,i,1)}function c(h,u,f,d){if(f===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let x=0;x<h.length;x++)a(h[x],u[x],d[x]);else{p.multiDrawArraysInstancedWEBGL(i,h,0,u,0,d,0,f);let x=0;for(let v=0;v<f;v++)x+=u[v];for(let v=0;v<d.length;v++)e.update(x,i,d[v])}}this.setMode=r,this.render=o,this.renderInstances=a,this.renderMultiDraw=l,this.renderMultiDrawInstances=c}function kg(n,t,e,i){let r;function o(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");r=n.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(T){return!(T!==Pn&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function l(T){const I=T===pr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==ei&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==Jn&&!I)}function c(T){if(T==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=e.precision!==void 0?e.precision:"highp";const u=c(h);u!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",u,"instead."),h=u);const f=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control");if(d===!0){const T=t.get("EXT_clip_control");T.clipControlEXT(T.LOWER_LEFT_EXT,T.ZERO_TO_ONE_EXT)}const p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),g=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),_=n.getParameter(n.MAX_VARYING_VECTORS),S=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),P=x>0,C=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:l,precision:h,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:p,maxVertexTextures:x,maxTextureSize:v,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:y,maxVaryings:_,maxFragmentUniforms:S,vertexTextures:P,maxSamples:C}}function Bg(n){const t=this;let e=null,i=0,r=!1,o=!1;const a=new jn,l=new Kt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const p=f.length!==0||d||i!==0||r;return r=d,i=f.length,p},this.beginShadows=function(){o=!0,u(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(f,d){e=u(f,d,0)},this.setState=function(f,d,p){const x=f.clippingPlanes,v=f.clipIntersection,m=f.clipShadows,g=n.get(f);if(!r||x===null||x.length===0||o&&!m)o?u(null):h();else{const y=o?0:i,_=y*4;let S=g.clippingState||null;c.value=S,S=u(x,d,_,p);for(let P=0;P!==_;++P)S[P]=e[P];g.clippingState=S,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=y}};function h(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function u(f,d,p,x){const v=f!==null?f.length:0;let m=null;if(v!==0){if(m=c.value,x!==!0||m===null){const g=p+v*4,y=d.matrixWorldInverse;l.getNormalMatrix(y),(m===null||m.length<g)&&(m=new Float32Array(g));for(let _=0,S=p;_!==v;++_,S+=4)a.copy(f[_]).applyMatrix4(y,l),a.normal.toArray(m,S),m[S+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function Hg(n){let t=new WeakMap;function e(a,l){return l===xl?a.mapping=ws:l===vl&&(a.mapping=bs),a}function i(a){if(a&&a.isTexture){const l=a.mapping;if(l===xl||l===vl)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const h=new Jp(c.height);return h.fromEquirectangularTexture(n,a),t.set(a,h),a.addEventListener("dispose",r),e(h.texture,a.mapping)}else return null}}return a}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap}return{get:i,dispose:o}}class ld extends rd{constructor(t=-1,e=1,i=1,r=-1,o=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=r,this.near=o,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,r,o,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=r,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let o=i-t,a=i+t,l=r+e,c=r-e;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=h*this.view.offsetX,a=o+h*this.view.width,l-=u*this.view.offsetY,c=l-u*this.view.height}this.projectionMatrix.makeOrthographic(o,a,l,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const us=4,Ph=[.125,.215,.35,.446,.526,.582],Ui=20,Aa=new ld,Ih=new Yt;let Ca=null,Ra=0,Pa=0,Ia=!1;const Li=(1+Math.sqrt(5))/2,ls=1/Li,Lh=[new D(-Li,ls,0),new D(Li,ls,0),new D(-ls,0,Li),new D(ls,0,Li),new D(0,Li,-ls),new D(0,Li,ls),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)];class Dh{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,r=100){Ca=this._renderer.getRenderTarget(),Ra=this._renderer.getActiveCubeFace(),Pa=this._renderer.getActiveMipmapLevel(),Ia=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(t,i,r,o),e>0&&this._blur(o,0,0,e),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Oh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Uh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ca,Ra,Pa),this._renderer.xr.enabled=Ia,t.scissorTest=!1,Wr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ws||t.mapping===bs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ca=this._renderer.getRenderTarget(),Ra=this._renderer.getActiveCubeFace(),Pa=this._renderer.getActiveMipmapLevel(),Ia=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Cn,minFilter:Cn,generateMipmaps:!1,type:pr,format:Pn,colorSpace:wi,depthBuffer:!1},r=Nh(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Nh(t,e,i);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Gg(o)),this._blurMaterial=Vg(o,t,e)}return r}_compileMaterial(t){const e=new Bt(this._lodPlanes[0],t);this._renderer.compile(e,Aa)}_sceneToCubeUV(t,e,i,r){const l=new Mn(90,1,e,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(Ih),u.toneMapping=xi,u.autoClear=!1;const p=new Ce({name:"PMREM.Background",side:ln,depthWrite:!1,depthTest:!1}),x=new Bt(new re,p);let v=!1;const m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,v=!0):(p.color.copy(Ih),v=!0);for(let g=0;g<6;g++){const y=g%3;y===0?(l.up.set(0,c[g],0),l.lookAt(h[g],0,0)):y===1?(l.up.set(0,0,c[g]),l.lookAt(0,h[g],0)):(l.up.set(0,c[g],0),l.lookAt(0,0,h[g]));const _=this._cubeSize;Wr(r,y*_,g>2?_:0,_,_),u.setRenderTarget(r),v&&u.render(x,l),u.render(t,l)}x.geometry.dispose(),x.material.dispose(),u.toneMapping=d,u.autoClear=f,t.background=m}_textureToCubeUV(t,e){const i=this._renderer,r=t.mapping===ws||t.mapping===bs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Oh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Uh());const o=r?this._cubemapMaterial:this._equirectMaterial,a=new Bt(this._lodPlanes[0],o),l=o.uniforms;l.envMap.value=t;const c=this._cubeSize;Wr(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(a,Aa)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const r=this._lodPlanes.length;for(let o=1;o<r;o++){const a=Math.sqrt(this._sigmas[o]*this._sigmas[o]-this._sigmas[o-1]*this._sigmas[o-1]),l=Lh[(r-o-1)%Lh.length];this._blur(t,o-1,o,a,l)}e.autoClear=i}_blur(t,e,i,r,o){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,r,"latitudinal",o),this._halfBlur(a,t,i,i,r,"longitudinal",o)}_halfBlur(t,e,i,r,o,a,l){const c=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new Bt(this._lodPlanes[r],h),d=h.uniforms,p=this._sizeLods[i]-1,x=isFinite(o)?Math.PI/(2*p):2*Math.PI/(2*Ui-1),v=o/x,m=isFinite(o)?1+Math.floor(u*v):Ui;m>Ui&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ui}`);const g=[];let y=0;for(let T=0;T<Ui;++T){const I=T/v,Z=Math.exp(-I*I/2);g.push(Z),T===0?y+=Z:T<m&&(y+=2*Z)}for(let T=0;T<g.length;T++)g[T]=g[T]/y;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=g,d.latitudinal.value=a==="latitudinal",l&&(d.poleAxis.value=l);const{_lodMax:_}=this;d.dTheta.value=x,d.mipInt.value=_-i;const S=this._sizeLods[r],P=3*S*(r>_-us?r-_+us:0),C=4*(this._cubeSize-S);Wr(e,P,C,3*S,2*S),c.setRenderTarget(e),c.render(f,Aa)}}function Gg(n){const t=[],e=[],i=[];let r=n;const o=n-us+1+Ph.length;for(let a=0;a<o;a++){const l=Math.pow(2,r);e.push(l);let c=1/l;a>n-us?c=Ph[a-n+us-1]:a===0&&(c=0),i.push(c);const h=1/(l-2),u=-h,f=1+h,d=[u,u,f,u,f,f,u,u,f,f,u,f],p=6,x=6,v=3,m=2,g=1,y=new Float32Array(v*x*p),_=new Float32Array(m*x*p),S=new Float32Array(g*x*p);for(let C=0;C<p;C++){const T=C%3*2/3-1,I=C>2?0:-1,Z=[T,I,0,T+2/3,I,0,T+2/3,I+1,0,T,I,0,T+2/3,I+1,0,T,I+1,0];y.set(Z,v*x*C),_.set(d,m*x*C);const M=[C,C,C,C,C,C];S.set(M,g*x*C)}const P=new Se;P.setAttribute("position",new en(y,v)),P.setAttribute("uv",new en(_,m)),P.setAttribute("faceIndex",new en(S,g)),t.push(P),r>us&&r--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Nh(n,t,e){const i=new Gi(n,t,e);return i.texture.mapping=Go,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Wr(n,t,e,i,r){n.viewport.set(t,e,i,r),n.scissor.set(t,e,i,r)}function Vg(n,t,e){const i=new Float32Array(Ui),r=new D(0,1,0);return new yi({name:"SphericalGaussianBlur",defines:{n:Ui,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Ec(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function Uh(){return new yi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ec(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function Oh(){return new yi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ec(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function Ec(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Wg(n){let t=new WeakMap,e=null;function i(l){if(l&&l.isTexture){const c=l.mapping,h=c===xl||c===vl,u=c===ws||c===bs;if(h||u){let f=t.get(l);const d=f!==void 0?f.texture.pmremVersion:0;if(l.isRenderTargetTexture&&l.pmremVersion!==d)return e===null&&(e=new Dh(n)),f=h?e.fromEquirectangular(l,f):e.fromCubemap(l,f),f.texture.pmremVersion=l.pmremVersion,t.set(l,f),f.texture;if(f!==void 0)return f.texture;{const p=l.image;return h&&p&&p.height>0||u&&p&&r(p)?(e===null&&(e=new Dh(n)),f=h?e.fromEquirectangular(l):e.fromCubemap(l),f.texture.pmremVersion=l.pmremVersion,t.set(l,f),l.addEventListener("dispose",o),f.texture):null}}}return l}function r(l){let c=0;const h=6;for(let u=0;u<h;u++)l[u]!==void 0&&c++;return c===h}function o(l){const c=l.target;c.removeEventListener("dispose",o);const h=t.get(c);h!==void 0&&(t.delete(c),h.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function $g(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return t[i]=r,r}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const r=e(i);return r===null&&go("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function Xg(n,t,e,i){const r={},o=new WeakMap;function a(f){const d=f.target;d.index!==null&&t.remove(d.index);for(const x in d.attributes)t.remove(d.attributes[x]);for(const x in d.morphAttributes){const v=d.morphAttributes[x];for(let m=0,g=v.length;m<g;m++)t.remove(v[m])}d.removeEventListener("dispose",a),delete r[d.id];const p=o.get(d);p&&(t.remove(p),o.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function l(f,d){return r[d.id]===!0||(d.addEventListener("dispose",a),r[d.id]=!0,e.memory.geometries++),d}function c(f){const d=f.attributes;for(const x in d)t.update(d[x],n.ARRAY_BUFFER);const p=f.morphAttributes;for(const x in p){const v=p[x];for(let m=0,g=v.length;m<g;m++)t.update(v[m],n.ARRAY_BUFFER)}}function h(f){const d=[],p=f.index,x=f.attributes.position;let v=0;if(p!==null){const y=p.array;v=p.version;for(let _=0,S=y.length;_<S;_+=3){const P=y[_+0],C=y[_+1],T=y[_+2];d.push(P,C,C,T,T,P)}}else if(x!==void 0){const y=x.array;v=x.version;for(let _=0,S=y.length/3-1;_<S;_+=3){const P=_+0,C=_+1,T=_+2;d.push(P,C,C,T,T,P)}}else return;const m=new(Ju(d)?id:nd)(d,1);m.version=v;const g=o.get(f);g&&t.remove(g),o.set(f,m)}function u(f){const d=o.get(f);if(d){const p=f.index;p!==null&&d.version<p.version&&h(f)}else h(f);return o.get(f)}return{get:l,update:c,getWireframeAttribute:u}}function qg(n,t,e){let i;function r(d){i=d}let o,a;function l(d){o=d.type,a=d.bytesPerElement}function c(d,p){n.drawElements(i,p,o,d*a),e.update(p,i,1)}function h(d,p,x){x!==0&&(n.drawElementsInstanced(i,p,o,d*a,x),e.update(p,i,x))}function u(d,p,x){if(x===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,o,d,0,x);let m=0;for(let g=0;g<x;g++)m+=p[g];e.update(m,i,1)}function f(d,p,x,v){if(x===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<d.length;g++)h(d[g]/a,p[g],v[g]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,o,d,0,v,0,x);let g=0;for(let y=0;y<x;y++)g+=p[y];for(let y=0;y<v.length;y++)e.update(g,i,v[y])}}this.setMode=r,this.setIndex=l,this.render=c,this.renderInstances=h,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function Yg(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(o,a,l){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=l*(o/3);break;case n.LINES:e.lines+=l*(o/2);break;case n.LINE_STRIP:e.lines+=l*(o-1);break;case n.LINE_LOOP:e.lines+=l*o;break;case n.POINTS:e.points+=l*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:i}}function jg(n,t,e){const i=new WeakMap,r=new Ae;function o(a,l,c){const h=a.morphTargetInfluences,u=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,f=u!==void 0?u.length:0;let d=i.get(l);if(d===void 0||d.count!==f){let M=function(){I.dispose(),i.delete(l),l.removeEventListener("dispose",M)};var p=M;d!==void 0&&d.texture.dispose();const x=l.morphAttributes.position!==void 0,v=l.morphAttributes.normal!==void 0,m=l.morphAttributes.color!==void 0,g=l.morphAttributes.position||[],y=l.morphAttributes.normal||[],_=l.morphAttributes.color||[];let S=0;x===!0&&(S=1),v===!0&&(S=2),m===!0&&(S=3);let P=l.attributes.position.count*S,C=1;P>t.maxTextureSize&&(C=Math.ceil(P/t.maxTextureSize),P=t.maxTextureSize);const T=new Float32Array(P*C*4*f),I=new td(T,P,C,f);I.type=Jn,I.needsUpdate=!0;const Z=S*4;for(let b=0;b<f;b++){const B=g[b],H=y[b],U=_[b],z=P*C*4*b;for(let L=0;L<B.count;L++){const W=L*Z;x===!0&&(r.fromBufferAttribute(B,L),T[z+W+0]=r.x,T[z+W+1]=r.y,T[z+W+2]=r.z,T[z+W+3]=0),v===!0&&(r.fromBufferAttribute(H,L),T[z+W+4]=r.x,T[z+W+5]=r.y,T[z+W+6]=r.z,T[z+W+7]=0),m===!0&&(r.fromBufferAttribute(U,L),T[z+W+8]=r.x,T[z+W+9]=r.y,T[z+W+10]=r.z,T[z+W+11]=U.itemSize===4?r.w:1)}}d={count:f,texture:I,size:new ht(P,C)},i.set(l,d),l.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,e);else{let x=0;for(let m=0;m<h.length;m++)x+=h[m];const v=l.morphTargetsRelative?1:1-x;c.getUniforms().setValue(n,"morphTargetBaseInfluence",v),c.getUniforms().setValue(n,"morphTargetInfluences",h)}c.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:o}}function Zg(n,t,e,i){let r=new WeakMap;function o(c){const h=i.render.frame,u=c.geometry,f=t.get(c,u);if(r.get(f)!==h&&(t.update(f),r.set(f,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return f}function a(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}class cd extends tn{constructor(t,e,i,r,o,a,l,c,h,u=ms){if(u!==ms&&u!==Ts)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===ms&&(i=Hi),i===void 0&&u===Ts&&(i=Es),super(null,r,o,a,l,c,u,i,h),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=l!==void 0?l:Qe,this.minFilter=c!==void 0?c:Qe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const hd=new tn,Fh=new cd(1,1),ud=new td,dd=new Op,fd=new od,zh=[],kh=[],Bh=new Float32Array(16),Hh=new Float32Array(9),Gh=new Float32Array(4);function Us(n,t,e){const i=n[0];if(i<=0||i>0)return n;const r=t*e;let o=zh[r];if(o===void 0&&(o=new Float32Array(r),zh[r]=o),t!==0){i.toArray(o,0);for(let a=1,l=0;a!==t;++a)l+=e,n[a].toArray(o,l)}return o}function Be(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function He(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function $o(n,t){let e=kh[t];e===void 0&&(e=new Int32Array(t),kh[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function Kg(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Jg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Be(e,t))return;n.uniform2fv(this.addr,t),He(e,t)}}function Qg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Be(e,t))return;n.uniform3fv(this.addr,t),He(e,t)}}function tx(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Be(e,t))return;n.uniform4fv(this.addr,t),He(e,t)}}function ex(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Be(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),He(e,t)}else{if(Be(e,i))return;Gh.set(i),n.uniformMatrix2fv(this.addr,!1,Gh),He(e,i)}}function nx(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Be(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),He(e,t)}else{if(Be(e,i))return;Hh.set(i),n.uniformMatrix3fv(this.addr,!1,Hh),He(e,i)}}function ix(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Be(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),He(e,t)}else{if(Be(e,i))return;Bh.set(i),n.uniformMatrix4fv(this.addr,!1,Bh),He(e,i)}}function sx(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function rx(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Be(e,t))return;n.uniform2iv(this.addr,t),He(e,t)}}function ox(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Be(e,t))return;n.uniform3iv(this.addr,t),He(e,t)}}function ax(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Be(e,t))return;n.uniform4iv(this.addr,t),He(e,t)}}function lx(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function cx(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Be(e,t))return;n.uniform2uiv(this.addr,t),He(e,t)}}function hx(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Be(e,t))return;n.uniform3uiv(this.addr,t),He(e,t)}}function ux(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Be(e,t))return;n.uniform4uiv(this.addr,t),He(e,t)}}function dx(n,t,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let o;this.type===n.SAMPLER_2D_SHADOW?(Fh.compareFunction=Ku,o=Fh):o=hd,e.setTexture2D(t||o,r)}function fx(n,t,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),e.setTexture3D(t||dd,r)}function px(n,t,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),e.setTextureCube(t||fd,r)}function mx(n,t,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),e.setTexture2DArray(t||ud,r)}function gx(n){switch(n){case 5126:return Kg;case 35664:return Jg;case 35665:return Qg;case 35666:return tx;case 35674:return ex;case 35675:return nx;case 35676:return ix;case 5124:case 35670:return sx;case 35667:case 35671:return rx;case 35668:case 35672:return ox;case 35669:case 35673:return ax;case 5125:return lx;case 36294:return cx;case 36295:return hx;case 36296:return ux;case 35678:case 36198:case 36298:case 36306:case 35682:return dx;case 35679:case 36299:case 36307:return fx;case 35680:case 36300:case 36308:case 36293:return px;case 36289:case 36303:case 36311:case 36292:return mx}}function xx(n,t){n.uniform1fv(this.addr,t)}function vx(n,t){const e=Us(t,this.size,2);n.uniform2fv(this.addr,e)}function _x(n,t){const e=Us(t,this.size,3);n.uniform3fv(this.addr,e)}function Mx(n,t){const e=Us(t,this.size,4);n.uniform4fv(this.addr,e)}function yx(n,t){const e=Us(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function Sx(n,t){const e=Us(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function wx(n,t){const e=Us(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function bx(n,t){n.uniform1iv(this.addr,t)}function Ex(n,t){n.uniform2iv(this.addr,t)}function Tx(n,t){n.uniform3iv(this.addr,t)}function Ax(n,t){n.uniform4iv(this.addr,t)}function Cx(n,t){n.uniform1uiv(this.addr,t)}function Rx(n,t){n.uniform2uiv(this.addr,t)}function Px(n,t){n.uniform3uiv(this.addr,t)}function Ix(n,t){n.uniform4uiv(this.addr,t)}function Lx(n,t,e){const i=this.cache,r=t.length,o=$o(e,r);Be(i,o)||(n.uniform1iv(this.addr,o),He(i,o));for(let a=0;a!==r;++a)e.setTexture2D(t[a]||hd,o[a])}function Dx(n,t,e){const i=this.cache,r=t.length,o=$o(e,r);Be(i,o)||(n.uniform1iv(this.addr,o),He(i,o));for(let a=0;a!==r;++a)e.setTexture3D(t[a]||dd,o[a])}function Nx(n,t,e){const i=this.cache,r=t.length,o=$o(e,r);Be(i,o)||(n.uniform1iv(this.addr,o),He(i,o));for(let a=0;a!==r;++a)e.setTextureCube(t[a]||fd,o[a])}function Ux(n,t,e){const i=this.cache,r=t.length,o=$o(e,r);Be(i,o)||(n.uniform1iv(this.addr,o),He(i,o));for(let a=0;a!==r;++a)e.setTexture2DArray(t[a]||ud,o[a])}function Ox(n){switch(n){case 5126:return xx;case 35664:return vx;case 35665:return _x;case 35666:return Mx;case 35674:return yx;case 35675:return Sx;case 35676:return wx;case 5124:case 35670:return bx;case 35667:case 35671:return Ex;case 35668:case 35672:return Tx;case 35669:case 35673:return Ax;case 5125:return Cx;case 36294:return Rx;case 36295:return Px;case 36296:return Ix;case 35678:case 36198:case 36298:case 36306:case 35682:return Lx;case 35679:case 36299:case 36307:return Dx;case 35680:case 36300:case 36308:case 36293:return Nx;case 36289:case 36303:case 36311:case 36292:return Ux}}class Fx{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=gx(e.type)}}class zx{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Ox(e.type)}}class kx{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const r=this.seq;for(let o=0,a=r.length;o!==a;++o){const l=r[o];l.setValue(t,e[l.id],i)}}}const La=/(\w+)(\])?(\[|\.)?/g;function Vh(n,t){n.seq.push(t),n.map[t.id]=t}function Bx(n,t,e){const i=n.name,r=i.length;for(La.lastIndex=0;;){const o=La.exec(i),a=La.lastIndex;let l=o[1];const c=o[2]==="]",h=o[3];if(c&&(l=l|0),h===void 0||h==="["&&a+2===r){Vh(e,h===void 0?new Fx(l,n,t):new zx(l,n,t));break}else{let f=e.map[l];f===void 0&&(f=new kx(l),Vh(e,f)),e=f}}}class xo{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const o=t.getActiveUniform(e,r),a=t.getUniformLocation(e,o.name);Bx(o,a,this)}}setValue(t,e,i,r){const o=this.map[e];o!==void 0&&o.setValue(t,i,r)}setOptional(t,e,i){const r=e[i];r!==void 0&&this.setValue(t,i,r)}static upload(t,e,i,r){for(let o=0,a=e.length;o!==a;++o){const l=e[o],c=i[l.id];c.needsUpdate!==!1&&l.setValue(t,c.value,r)}}static seqWithValue(t,e){const i=[];for(let r=0,o=t.length;r!==o;++r){const a=t[r];a.id in e&&i.push(a)}return i}}function Wh(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const Hx=37297;let Gx=0;function Vx(n,t){const e=n.split(`
`),i=[],r=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let a=r;a<o;a++){const l=a+1;i.push(`${l===t?">":" "} ${l}: ${e[a]}`)}return i.join(`
`)}function Wx(n){const t=le.getPrimaries(le.workingColorSpace),e=le.getPrimaries(n);let i;switch(t===e?i="":t===Ao&&e===To?i="LinearDisplayP3ToLinearSRGB":t===To&&e===Ao&&(i="LinearSRGBToLinearDisplayP3"),n){case wi:case Vo:return[i,"LinearTransferOETF"];case An:case Sc:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function $h(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),r=n.getShaderInfoLog(t).trim();if(i&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+Vx(n.getShaderSource(t),a)}else return r}function $x(n,t){const e=Wx(t);return`vec4 ${n}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Xx(n,t){let e;switch(t){case lp:e="Linear";break;case cp:e="Reinhard";break;case hp:e="Cineon";break;case up:e="ACESFilmic";break;case fp:e="AgX";break;case pp:e="Neutral";break;case dp:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const $r=new D;function qx(){le.getLuminanceCoefficients($r);const n=$r.x.toFixed(4),t=$r.y.toFixed(4),e=$r.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Yx(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ks).join(`
`)}function jx(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Zx(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const o=n.getActiveAttrib(t,r),a=o.name;let l=1;o.type===n.FLOAT_MAT2&&(l=2),o.type===n.FLOAT_MAT3&&(l=3),o.type===n.FLOAT_MAT4&&(l=4),e[a]={type:o.type,location:n.getAttribLocation(t,a),locationSize:l}}return e}function Ks(n){return n!==""}function Xh(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function qh(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Kx=/^[ \t]*#include +<([\w\d./]+)>/gm;function ql(n){return n.replace(Kx,Qx)}const Jx=new Map;function Qx(n,t){let e=Zt[t];if(e===void 0){const i=Jx.get(t);if(i!==void 0)e=Zt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return ql(e)}const tv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Yh(n){return n.replace(tv,ev)}function ev(n,t,e,i){let r="";for(let o=parseInt(t);o<parseInt(e);o++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return r}function jh(n){let t=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function nv(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===zu?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Hf?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Yn&&(t="SHADOWMAP_TYPE_VSM"),t}function iv(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case ws:case bs:t="ENVMAP_TYPE_CUBE";break;case Go:t="ENVMAP_TYPE_CUBE_UV";break}return t}function sv(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case bs:t="ENVMAP_MODE_REFRACTION";break}return t}function rv(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case mc:t="ENVMAP_BLENDING_MULTIPLY";break;case op:t="ENVMAP_BLENDING_MIX";break;case ap:t="ENVMAP_BLENDING_ADD";break}return t}function ov(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function av(n,t,e,i){const r=n.getContext(),o=e.defines;let a=e.vertexShader,l=e.fragmentShader;const c=nv(e),h=iv(e),u=sv(e),f=rv(e),d=ov(e),p=Yx(e),x=jx(o),v=r.createProgram();let m,g,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(Ks).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(Ks).join(`
`),g.length>0&&(g+=`
`)):(m=[jh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ks).join(`
`),g=[jh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==xi?"#define TONE_MAPPING":"",e.toneMapping!==xi?Zt.tonemapping_pars_fragment:"",e.toneMapping!==xi?Xx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Zt.colorspace_pars_fragment,$x("linearToOutputTexel",e.outputColorSpace),qx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ks).join(`
`)),a=ql(a),a=Xh(a,e),a=qh(a,e),l=ql(l),l=Xh(l,e),l=qh(l,e),a=Yh(a),l=Yh(l),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",e.glslVersion===dh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===dh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const _=y+m+a,S=y+g+l,P=Wh(r,r.VERTEX_SHADER,_),C=Wh(r,r.FRAGMENT_SHADER,S);r.attachShader(v,P),r.attachShader(v,C),e.index0AttributeName!==void 0?r.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function T(b){if(n.debug.checkShaderErrors){const B=r.getProgramInfoLog(v).trim(),H=r.getShaderInfoLog(P).trim(),U=r.getShaderInfoLog(C).trim();let z=!0,L=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(z=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,v,P,C);else{const W=$h(r,P,"vertex"),k=$h(r,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+b.name+`
Material Type: `+b.type+`

Program Info Log: `+B+`
`+W+`
`+k)}else B!==""?console.warn("THREE.WebGLProgram: Program Info Log:",B):(H===""||U==="")&&(L=!1);L&&(b.diagnostics={runnable:z,programLog:B,vertexShader:{log:H,prefix:m},fragmentShader:{log:U,prefix:g}})}r.deleteShader(P),r.deleteShader(C),I=new xo(r,v),Z=Zx(r,v)}let I;this.getUniforms=function(){return I===void 0&&T(this),I};let Z;this.getAttributes=function(){return Z===void 0&&T(this),Z};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(v,Hx)),M},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Gx++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=P,this.fragmentShader=C,this}let lv=0;class cv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,r=this._getShaderStage(e),o=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(o)===!1&&(a.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new hv(t),e.set(t,i)),i}}class hv{constructor(t){this.id=lv++,this.code=t,this.usedTimes=0}}function uv(n,t,e,i,r,o,a){const l=new wc,c=new cv,h=new Set,u=[],f=r.logarithmicDepthBuffer,d=r.reverseDepthBuffer,p=r.vertexTextures;let x=r.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(M){return h.add(M),M===0?"uv":`uv${M}`}function g(M,b,B,H,U){const z=H.fog,L=U.geometry,W=M.isMeshStandardMaterial?H.environment:null,k=(M.isMeshStandardMaterial?e:t).get(M.envMap||W),Y=k&&k.mapping===Go?k.image.height:null,et=v[M.type];M.precision!==null&&(x=r.getMaxPrecision(M.precision),x!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",x,"instead."));const j=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,xt=j!==void 0?j.length:0;let Pt=0;L.morphAttributes.position!==void 0&&(Pt=1),L.morphAttributes.normal!==void 0&&(Pt=2),L.morphAttributes.color!==void 0&&(Pt=3);let V,K,lt,at;if(et){const rn=Ln[et];V=rn.vertexShader,K=rn.fragmentShader}else V=M.vertexShader,K=M.fragmentShader,c.update(M),lt=c.getVertexShaderID(M),at=c.getFragmentShaderID(M);const Rt=n.getRenderTarget(),Ot=U.isInstancedMesh===!0,Ht=U.isBatchedMesh===!0,Xt=!!M.map,J=!!M.matcap,R=!!k,pt=!!M.aoMap,ft=!!M.lightMap,ct=!!M.bumpMap,mt=!!M.normalMap,zt=!!M.displacementMap,wt=!!M.emissiveMap,A=!!M.metalnessMap,w=!!M.roughnessMap,G=M.anisotropy>0,Q=M.clearcoat>0,st=M.dispersion>0,tt=M.iridescence>0,Nt=M.sheen>0,vt=M.transmission>0,Tt=G&&!!M.anisotropyMap,Qt=Q&&!!M.clearcoatMap,ut=Q&&!!M.clearcoatNormalMap,At=Q&&!!M.clearcoatRoughnessMap,Wt=tt&&!!M.iridescenceMap,$t=tt&&!!M.iridescenceThicknessMap,Ct=Nt&&!!M.sheenColorMap,te=Nt&&!!M.sheenRoughnessMap,qt=!!M.specularMap,me=!!M.specularColorMap,N=!!M.specularIntensityMap,bt=vt&&!!M.transmissionMap,q=vt&&!!M.thicknessMap,rt=!!M.gradientMap,yt=!!M.alphaMap,Et=M.alphaTest>0,ne=!!M.alphaHash,Le=!!M.extensions;let sn=xi;M.toneMapped&&(Rt===null||Rt.isXRRenderTarget===!0)&&(sn=n.toneMapping);const se={shaderID:et,shaderType:M.type,shaderName:M.name,vertexShader:V,fragmentShader:K,defines:M.defines,customVertexShaderID:lt,customFragmentShaderID:at,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:x,batching:Ht,batchingColor:Ht&&U._colorsTexture!==null,instancing:Ot,instancingColor:Ot&&U.instanceColor!==null,instancingMorph:Ot&&U.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:Rt===null?n.outputColorSpace:Rt.isXRRenderTarget===!0?Rt.texture.colorSpace:wi,alphaToCoverage:!!M.alphaToCoverage,map:Xt,matcap:J,envMap:R,envMapMode:R&&k.mapping,envMapCubeUVHeight:Y,aoMap:pt,lightMap:ft,bumpMap:ct,normalMap:mt,displacementMap:p&&zt,emissiveMap:wt,normalMapObjectSpace:mt&&M.normalMapType===vp,normalMapTangentSpace:mt&&M.normalMapType===Zu,metalnessMap:A,roughnessMap:w,anisotropy:G,anisotropyMap:Tt,clearcoat:Q,clearcoatMap:Qt,clearcoatNormalMap:ut,clearcoatRoughnessMap:At,dispersion:st,iridescence:tt,iridescenceMap:Wt,iridescenceThicknessMap:$t,sheen:Nt,sheenColorMap:Ct,sheenRoughnessMap:te,specularMap:qt,specularColorMap:me,specularIntensityMap:N,transmission:vt,transmissionMap:bt,thicknessMap:q,gradientMap:rt,opaque:M.transparent===!1&&M.blending===ps&&M.alphaToCoverage===!1,alphaMap:yt,alphaTest:Et,alphaHash:ne,combine:M.combine,mapUv:Xt&&m(M.map.channel),aoMapUv:pt&&m(M.aoMap.channel),lightMapUv:ft&&m(M.lightMap.channel),bumpMapUv:ct&&m(M.bumpMap.channel),normalMapUv:mt&&m(M.normalMap.channel),displacementMapUv:zt&&m(M.displacementMap.channel),emissiveMapUv:wt&&m(M.emissiveMap.channel),metalnessMapUv:A&&m(M.metalnessMap.channel),roughnessMapUv:w&&m(M.roughnessMap.channel),anisotropyMapUv:Tt&&m(M.anisotropyMap.channel),clearcoatMapUv:Qt&&m(M.clearcoatMap.channel),clearcoatNormalMapUv:ut&&m(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:At&&m(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Wt&&m(M.iridescenceMap.channel),iridescenceThicknessMapUv:$t&&m(M.iridescenceThicknessMap.channel),sheenColorMapUv:Ct&&m(M.sheenColorMap.channel),sheenRoughnessMapUv:te&&m(M.sheenRoughnessMap.channel),specularMapUv:qt&&m(M.specularMap.channel),specularColorMapUv:me&&m(M.specularColorMap.channel),specularIntensityMapUv:N&&m(M.specularIntensityMap.channel),transmissionMapUv:bt&&m(M.transmissionMap.channel),thicknessMapUv:q&&m(M.thicknessMap.channel),alphaMapUv:yt&&m(M.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(mt||G),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!L.attributes.uv&&(Xt||yt),fog:!!z,useFog:M.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:d,skinning:U.isSkinnedMesh===!0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:xt,morphTextureStride:Pt,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:n.shadowMap.enabled&&B.length>0,shadowMapType:n.shadowMap.type,toneMapping:sn,decodeVideoTexture:Xt&&M.map.isVideoTexture===!0&&le.getTransfer(M.map.colorSpace)===xe,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Kn,flipSided:M.side===ln,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Le&&M.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Le&&M.extensions.multiDraw===!0||Ht)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return se.vertexUv1s=h.has(1),se.vertexUv2s=h.has(2),se.vertexUv3s=h.has(3),h.clear(),se}function y(M){const b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(const B in M.defines)b.push(B),b.push(M.defines[B]);return M.isRawShaderMaterial===!1&&(_(b,M),S(b,M),b.push(n.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function _(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function S(M,b){l.disableAll(),b.supportsVertexTextures&&l.enable(0),b.instancing&&l.enable(1),b.instancingColor&&l.enable(2),b.instancingMorph&&l.enable(3),b.matcap&&l.enable(4),b.envMap&&l.enable(5),b.normalMapObjectSpace&&l.enable(6),b.normalMapTangentSpace&&l.enable(7),b.clearcoat&&l.enable(8),b.iridescence&&l.enable(9),b.alphaTest&&l.enable(10),b.vertexColors&&l.enable(11),b.vertexAlphas&&l.enable(12),b.vertexUv1s&&l.enable(13),b.vertexUv2s&&l.enable(14),b.vertexUv3s&&l.enable(15),b.vertexTangents&&l.enable(16),b.anisotropy&&l.enable(17),b.alphaHash&&l.enable(18),b.batching&&l.enable(19),b.dispersion&&l.enable(20),b.batchingColor&&l.enable(21),M.push(l.mask),l.disableAll(),b.fog&&l.enable(0),b.useFog&&l.enable(1),b.flatShading&&l.enable(2),b.logarithmicDepthBuffer&&l.enable(3),b.reverseDepthBuffer&&l.enable(4),b.skinning&&l.enable(5),b.morphTargets&&l.enable(6),b.morphNormals&&l.enable(7),b.morphColors&&l.enable(8),b.premultipliedAlpha&&l.enable(9),b.shadowMapEnabled&&l.enable(10),b.doubleSided&&l.enable(11),b.flipSided&&l.enable(12),b.useDepthPacking&&l.enable(13),b.dithering&&l.enable(14),b.transmission&&l.enable(15),b.sheen&&l.enable(16),b.opaque&&l.enable(17),b.pointsUvs&&l.enable(18),b.decodeVideoTexture&&l.enable(19),b.alphaToCoverage&&l.enable(20),M.push(l.mask)}function P(M){const b=v[M.type];let B;if(b){const H=Ln[b];B=Yp.clone(H.uniforms)}else B=M.uniforms;return B}function C(M,b){let B;for(let H=0,U=u.length;H<U;H++){const z=u[H];if(z.cacheKey===b){B=z,++B.usedTimes;break}}return B===void 0&&(B=new av(n,b,M,o),u.push(B)),B}function T(M){if(--M.usedTimes===0){const b=u.indexOf(M);u[b]=u[u.length-1],u.pop(),M.destroy()}}function I(M){c.remove(M)}function Z(){c.dispose()}return{getParameters:g,getProgramCacheKey:y,getUniforms:P,acquireProgram:C,releaseProgram:T,releaseShaderCache:I,programs:u,dispose:Z}}function dv(){let n=new WeakMap;function t(a){return n.has(a)}function e(a){let l=n.get(a);return l===void 0&&(l={},n.set(a,l)),l}function i(a){n.delete(a)}function r(a,l,c){n.get(a)[l]=c}function o(){n=new WeakMap}return{has:t,get:e,remove:i,update:r,dispose:o}}function fv(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Zh(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Kh(){const n=[];let t=0;const e=[],i=[],r=[];function o(){t=0,e.length=0,i.length=0,r.length=0}function a(f,d,p,x,v,m){let g=n[t];return g===void 0?(g={id:f.id,object:f,geometry:d,material:p,groupOrder:x,renderOrder:f.renderOrder,z:v,group:m},n[t]=g):(g.id=f.id,g.object=f,g.geometry=d,g.material=p,g.groupOrder=x,g.renderOrder=f.renderOrder,g.z=v,g.group=m),t++,g}function l(f,d,p,x,v,m){const g=a(f,d,p,x,v,m);p.transmission>0?i.push(g):p.transparent===!0?r.push(g):e.push(g)}function c(f,d,p,x,v,m){const g=a(f,d,p,x,v,m);p.transmission>0?i.unshift(g):p.transparent===!0?r.unshift(g):e.unshift(g)}function h(f,d){e.length>1&&e.sort(f||fv),i.length>1&&i.sort(d||Zh),r.length>1&&r.sort(d||Zh)}function u(){for(let f=t,d=n.length;f<d;f++){const p=n[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:i,transparent:r,init:o,push:l,unshift:c,finish:u,sort:h}}function pv(){let n=new WeakMap;function t(i,r){const o=n.get(i);let a;return o===void 0?(a=new Kh,n.set(i,[a])):r>=o.length?(a=new Kh,o.push(a)):a=o[r],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function mv(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new D,color:new Yt};break;case"SpotLight":e={position:new D,direction:new D,color:new Yt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new D,color:new Yt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new D,skyColor:new Yt,groundColor:new Yt};break;case"RectAreaLight":e={color:new Yt,position:new D,halfWidth:new D,halfHeight:new D};break}return n[t.id]=e,e}}}function gv(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let xv=0;function vv(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function _v(n){const t=new mv,e=gv(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new D);const r=new D,o=new pe,a=new pe;function l(h){let u=0,f=0,d=0;for(let Z=0;Z<9;Z++)i.probe[Z].set(0,0,0);let p=0,x=0,v=0,m=0,g=0,y=0,_=0,S=0,P=0,C=0,T=0;h.sort(vv);for(let Z=0,M=h.length;Z<M;Z++){const b=h[Z],B=b.color,H=b.intensity,U=b.distance,z=b.shadow&&b.shadow.map?b.shadow.map.texture:null;if(b.isAmbientLight)u+=B.r*H,f+=B.g*H,d+=B.b*H;else if(b.isLightProbe){for(let L=0;L<9;L++)i.probe[L].addScaledVector(b.sh.coefficients[L],H);T++}else if(b.isDirectionalLight){const L=t.get(b);if(L.color.copy(b.color).multiplyScalar(b.intensity),b.castShadow){const W=b.shadow,k=e.get(b);k.shadowIntensity=W.intensity,k.shadowBias=W.bias,k.shadowNormalBias=W.normalBias,k.shadowRadius=W.radius,k.shadowMapSize=W.mapSize,i.directionalShadow[p]=k,i.directionalShadowMap[p]=z,i.directionalShadowMatrix[p]=b.shadow.matrix,y++}i.directional[p]=L,p++}else if(b.isSpotLight){const L=t.get(b);L.position.setFromMatrixPosition(b.matrixWorld),L.color.copy(B).multiplyScalar(H),L.distance=U,L.coneCos=Math.cos(b.angle),L.penumbraCos=Math.cos(b.angle*(1-b.penumbra)),L.decay=b.decay,i.spot[v]=L;const W=b.shadow;if(b.map&&(i.spotLightMap[P]=b.map,P++,W.updateMatrices(b),b.castShadow&&C++),i.spotLightMatrix[v]=W.matrix,b.castShadow){const k=e.get(b);k.shadowIntensity=W.intensity,k.shadowBias=W.bias,k.shadowNormalBias=W.normalBias,k.shadowRadius=W.radius,k.shadowMapSize=W.mapSize,i.spotShadow[v]=k,i.spotShadowMap[v]=z,S++}v++}else if(b.isRectAreaLight){const L=t.get(b);L.color.copy(B).multiplyScalar(H),L.halfWidth.set(b.width*.5,0,0),L.halfHeight.set(0,b.height*.5,0),i.rectArea[m]=L,m++}else if(b.isPointLight){const L=t.get(b);if(L.color.copy(b.color).multiplyScalar(b.intensity),L.distance=b.distance,L.decay=b.decay,b.castShadow){const W=b.shadow,k=e.get(b);k.shadowIntensity=W.intensity,k.shadowBias=W.bias,k.shadowNormalBias=W.normalBias,k.shadowRadius=W.radius,k.shadowMapSize=W.mapSize,k.shadowCameraNear=W.camera.near,k.shadowCameraFar=W.camera.far,i.pointShadow[x]=k,i.pointShadowMap[x]=z,i.pointShadowMatrix[x]=b.shadow.matrix,_++}i.point[x]=L,x++}else if(b.isHemisphereLight){const L=t.get(b);L.skyColor.copy(b.color).multiplyScalar(H),L.groundColor.copy(b.groundColor).multiplyScalar(H),i.hemi[g]=L,g++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=_t.LTC_FLOAT_1,i.rectAreaLTC2=_t.LTC_FLOAT_2):(i.rectAreaLTC1=_t.LTC_HALF_1,i.rectAreaLTC2=_t.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=f,i.ambient[2]=d;const I=i.hash;(I.directionalLength!==p||I.pointLength!==x||I.spotLength!==v||I.rectAreaLength!==m||I.hemiLength!==g||I.numDirectionalShadows!==y||I.numPointShadows!==_||I.numSpotShadows!==S||I.numSpotMaps!==P||I.numLightProbes!==T)&&(i.directional.length=p,i.spot.length=v,i.rectArea.length=m,i.point.length=x,i.hemi.length=g,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=S+P-C,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=C,i.numLightProbes=T,I.directionalLength=p,I.pointLength=x,I.spotLength=v,I.rectAreaLength=m,I.hemiLength=g,I.numDirectionalShadows=y,I.numPointShadows=_,I.numSpotShadows=S,I.numSpotMaps=P,I.numLightProbes=T,i.version=xv++)}function c(h,u){let f=0,d=0,p=0,x=0,v=0;const m=u.matrixWorldInverse;for(let g=0,y=h.length;g<y;g++){const _=h[g];if(_.isDirectionalLight){const S=i.directional[f];S.direction.setFromMatrixPosition(_.matrixWorld),r.setFromMatrixPosition(_.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(m),f++}else if(_.isSpotLight){const S=i.spot[p];S.position.setFromMatrixPosition(_.matrixWorld),S.position.applyMatrix4(m),S.direction.setFromMatrixPosition(_.matrixWorld),r.setFromMatrixPosition(_.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(m),p++}else if(_.isRectAreaLight){const S=i.rectArea[x];S.position.setFromMatrixPosition(_.matrixWorld),S.position.applyMatrix4(m),a.identity(),o.copy(_.matrixWorld),o.premultiply(m),a.extractRotation(o),S.halfWidth.set(_.width*.5,0,0),S.halfHeight.set(0,_.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),x++}else if(_.isPointLight){const S=i.point[d];S.position.setFromMatrixPosition(_.matrixWorld),S.position.applyMatrix4(m),d++}else if(_.isHemisphereLight){const S=i.hemi[v];S.direction.setFromMatrixPosition(_.matrixWorld),S.direction.transformDirection(m),v++}}}return{setup:l,setupView:c,state:i}}function Jh(n){const t=new _v(n),e=[],i=[];function r(u){h.camera=u,e.length=0,i.length=0}function o(u){e.push(u)}function a(u){i.push(u)}function l(){t.setup(e)}function c(u){t.setupView(e,u)}const h={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:h,setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function Mv(n){let t=new WeakMap;function e(r,o=0){const a=t.get(r);let l;return a===void 0?(l=new Jh(n),t.set(r,[l])):o>=a.length?(l=new Jh(n),a.push(l)):l=a[o],l}function i(){t=new WeakMap}return{get:e,dispose:i}}class yv extends Wi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=gp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Sv extends Wi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const wv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,bv=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Ev(n,t,e){let i=new bc;const r=new ht,o=new ht,a=new Ae,l=new yv({depthPacking:xp}),c=new Sv,h={},u=e.maxTextureSize,f={[Mi]:ln,[ln]:Mi,[Kn]:Kn},d=new yi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:wv,fragmentShader:bv}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const x=new Se;x.setAttribute("position",new en(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Bt(x,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=zu;let g=this.type;this.render=function(C,T,I){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;const Z=n.getRenderTarget(),M=n.getActiveCubeFace(),b=n.getActiveMipmapLevel(),B=n.state;B.setBlending(gi),B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const H=g!==Yn&&this.type===Yn,U=g===Yn&&this.type!==Yn;for(let z=0,L=C.length;z<L;z++){const W=C[z],k=W.shadow;if(k===void 0){console.warn("THREE.WebGLShadowMap:",W,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;r.copy(k.mapSize);const Y=k.getFrameExtents();if(r.multiply(Y),o.copy(k.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(o.x=Math.floor(u/Y.x),r.x=o.x*Y.x,k.mapSize.x=o.x),r.y>u&&(o.y=Math.floor(u/Y.y),r.y=o.y*Y.y,k.mapSize.y=o.y)),k.map===null||H===!0||U===!0){const j=this.type!==Yn?{minFilter:Qe,magFilter:Qe}:{};k.map!==null&&k.map.dispose(),k.map=new Gi(r.x,r.y,j),k.map.texture.name=W.name+".shadowMap",k.camera.updateProjectionMatrix()}n.setRenderTarget(k.map),n.clear();const et=k.getViewportCount();for(let j=0;j<et;j++){const xt=k.getViewport(j);a.set(o.x*xt.x,o.y*xt.y,o.x*xt.z,o.y*xt.w),B.viewport(a),k.updateMatrices(W,j),i=k.getFrustum(),S(T,I,k.camera,W,this.type)}k.isPointLightShadow!==!0&&this.type===Yn&&y(k,I),k.needsUpdate=!1}g=this.type,m.needsUpdate=!1,n.setRenderTarget(Z,M,b)};function y(C,T){const I=t.update(v);d.defines.VSM_SAMPLES!==C.blurSamples&&(d.defines.VSM_SAMPLES=C.blurSamples,p.defines.VSM_SAMPLES=C.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new Gi(r.x,r.y)),d.uniforms.shadow_pass.value=C.map.texture,d.uniforms.resolution.value=C.mapSize,d.uniforms.radius.value=C.radius,n.setRenderTarget(C.mapPass),n.clear(),n.renderBufferDirect(T,null,I,d,v,null),p.uniforms.shadow_pass.value=C.mapPass.texture,p.uniforms.resolution.value=C.mapSize,p.uniforms.radius.value=C.radius,n.setRenderTarget(C.map),n.clear(),n.renderBufferDirect(T,null,I,p,v,null)}function _(C,T,I,Z){let M=null;const b=I.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(b!==void 0)M=b;else if(M=I.isPointLight===!0?c:l,n.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const B=M.uuid,H=T.uuid;let U=h[B];U===void 0&&(U={},h[B]=U);let z=U[H];z===void 0&&(z=M.clone(),U[H]=z,T.addEventListener("dispose",P)),M=z}if(M.visible=T.visible,M.wireframe=T.wireframe,Z===Yn?M.side=T.shadowSide!==null?T.shadowSide:T.side:M.side=T.shadowSide!==null?T.shadowSide:f[T.side],M.alphaMap=T.alphaMap,M.alphaTest=T.alphaTest,M.map=T.map,M.clipShadows=T.clipShadows,M.clippingPlanes=T.clippingPlanes,M.clipIntersection=T.clipIntersection,M.displacementMap=T.displacementMap,M.displacementScale=T.displacementScale,M.displacementBias=T.displacementBias,M.wireframeLinewidth=T.wireframeLinewidth,M.linewidth=T.linewidth,I.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const B=n.properties.get(M);B.light=I}return M}function S(C,T,I,Z,M){if(C.visible===!1)return;if(C.layers.test(T.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&M===Yn)&&(!C.frustumCulled||i.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,C.matrixWorld);const H=t.update(C),U=C.material;if(Array.isArray(U)){const z=H.groups;for(let L=0,W=z.length;L<W;L++){const k=z[L],Y=U[k.materialIndex];if(Y&&Y.visible){const et=_(C,Y,Z,M);C.onBeforeShadow(n,C,T,I,H,et,k),n.renderBufferDirect(I,null,H,et,C,k),C.onAfterShadow(n,C,T,I,H,et,k)}}}else if(U.visible){const z=_(C,U,Z,M);C.onBeforeShadow(n,C,T,I,H,z,null),n.renderBufferDirect(I,null,H,z,C,null),C.onAfterShadow(n,C,T,I,H,z,null)}}const B=C.children;for(let H=0,U=B.length;H<U;H++)S(B[H],T,I,Z,M)}function P(C){C.target.removeEventListener("dispose",P);for(const I in h){const Z=h[I],M=C.target.uuid;M in Z&&(Z[M].dispose(),delete Z[M])}}}const Tv={[hl]:ul,[dl]:ml,[fl]:gl,[Ss]:pl,[ul]:hl,[ml]:dl,[gl]:fl,[pl]:Ss};function Av(n){function t(){let N=!1;const bt=new Ae;let q=null;const rt=new Ae(0,0,0,0);return{setMask:function(yt){q!==yt&&!N&&(n.colorMask(yt,yt,yt,yt),q=yt)},setLocked:function(yt){N=yt},setClear:function(yt,Et,ne,Le,sn){sn===!0&&(yt*=Le,Et*=Le,ne*=Le),bt.set(yt,Et,ne,Le),rt.equals(bt)===!1&&(n.clearColor(yt,Et,ne,Le),rt.copy(bt))},reset:function(){N=!1,q=null,rt.set(-1,0,0,0)}}}function e(){let N=!1,bt=!1,q=null,rt=null,yt=null;return{setReversed:function(Et){bt=Et},setTest:function(Et){Et?lt(n.DEPTH_TEST):at(n.DEPTH_TEST)},setMask:function(Et){q!==Et&&!N&&(n.depthMask(Et),q=Et)},setFunc:function(Et){if(bt&&(Et=Tv[Et]),rt!==Et){switch(Et){case hl:n.depthFunc(n.NEVER);break;case ul:n.depthFunc(n.ALWAYS);break;case dl:n.depthFunc(n.LESS);break;case Ss:n.depthFunc(n.LEQUAL);break;case fl:n.depthFunc(n.EQUAL);break;case pl:n.depthFunc(n.GEQUAL);break;case ml:n.depthFunc(n.GREATER);break;case gl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}rt=Et}},setLocked:function(Et){N=Et},setClear:function(Et){yt!==Et&&(n.clearDepth(Et),yt=Et)},reset:function(){N=!1,q=null,rt=null,yt=null}}}function i(){let N=!1,bt=null,q=null,rt=null,yt=null,Et=null,ne=null,Le=null,sn=null;return{setTest:function(se){N||(se?lt(n.STENCIL_TEST):at(n.STENCIL_TEST))},setMask:function(se){bt!==se&&!N&&(n.stencilMask(se),bt=se)},setFunc:function(se,rn,Hn){(q!==se||rt!==rn||yt!==Hn)&&(n.stencilFunc(se,rn,Hn),q=se,rt=rn,yt=Hn)},setOp:function(se,rn,Hn){(Et!==se||ne!==rn||Le!==Hn)&&(n.stencilOp(se,rn,Hn),Et=se,ne=rn,Le=Hn)},setLocked:function(se){N=se},setClear:function(se){sn!==se&&(n.clearStencil(se),sn=se)},reset:function(){N=!1,bt=null,q=null,rt=null,yt=null,Et=null,ne=null,Le=null,sn=null}}}const r=new t,o=new e,a=new i,l=new WeakMap,c=new WeakMap;let h={},u={},f=new WeakMap,d=[],p=null,x=!1,v=null,m=null,g=null,y=null,_=null,S=null,P=null,C=new Yt(0,0,0),T=0,I=!1,Z=null,M=null,b=null,B=null,H=null;const U=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,L=0;const W=n.getParameter(n.VERSION);W.indexOf("WebGL")!==-1?(L=parseFloat(/^WebGL (\d)/.exec(W)[1]),z=L>=1):W.indexOf("OpenGL ES")!==-1&&(L=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),z=L>=2);let k=null,Y={};const et=n.getParameter(n.SCISSOR_BOX),j=n.getParameter(n.VIEWPORT),xt=new Ae().fromArray(et),Pt=new Ae().fromArray(j);function V(N,bt,q,rt){const yt=new Uint8Array(4),Et=n.createTexture();n.bindTexture(N,Et),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let ne=0;ne<q;ne++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(bt,0,n.RGBA,1,1,rt,0,n.RGBA,n.UNSIGNED_BYTE,yt):n.texImage2D(bt+ne,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,yt);return Et}const K={};K[n.TEXTURE_2D]=V(n.TEXTURE_2D,n.TEXTURE_2D,1),K[n.TEXTURE_CUBE_MAP]=V(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[n.TEXTURE_2D_ARRAY]=V(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),K[n.TEXTURE_3D]=V(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),lt(n.DEPTH_TEST),o.setFunc(Ss),ft(!1),ct(oh),lt(n.CULL_FACE),R(gi);function lt(N){h[N]!==!0&&(n.enable(N),h[N]=!0)}function at(N){h[N]!==!1&&(n.disable(N),h[N]=!1)}function Rt(N,bt){return u[N]!==bt?(n.bindFramebuffer(N,bt),u[N]=bt,N===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=bt),N===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=bt),!0):!1}function Ot(N,bt){let q=d,rt=!1;if(N){q=f.get(bt),q===void 0&&(q=[],f.set(bt,q));const yt=N.textures;if(q.length!==yt.length||q[0]!==n.COLOR_ATTACHMENT0){for(let Et=0,ne=yt.length;Et<ne;Et++)q[Et]=n.COLOR_ATTACHMENT0+Et;q.length=yt.length,rt=!0}}else q[0]!==n.BACK&&(q[0]=n.BACK,rt=!0);rt&&n.drawBuffers(q)}function Ht(N){return p!==N?(n.useProgram(N),p=N,!0):!1}const Xt={[Ni]:n.FUNC_ADD,[Vf]:n.FUNC_SUBTRACT,[Wf]:n.FUNC_REVERSE_SUBTRACT};Xt[$f]=n.MIN,Xt[Xf]=n.MAX;const J={[qf]:n.ZERO,[Yf]:n.ONE,[jf]:n.SRC_COLOR,[ll]:n.SRC_ALPHA,[ep]:n.SRC_ALPHA_SATURATE,[Qf]:n.DST_COLOR,[Kf]:n.DST_ALPHA,[Zf]:n.ONE_MINUS_SRC_COLOR,[cl]:n.ONE_MINUS_SRC_ALPHA,[tp]:n.ONE_MINUS_DST_COLOR,[Jf]:n.ONE_MINUS_DST_ALPHA,[np]:n.CONSTANT_COLOR,[ip]:n.ONE_MINUS_CONSTANT_COLOR,[sp]:n.CONSTANT_ALPHA,[rp]:n.ONE_MINUS_CONSTANT_ALPHA};function R(N,bt,q,rt,yt,Et,ne,Le,sn,se){if(N===gi){x===!0&&(at(n.BLEND),x=!1);return}if(x===!1&&(lt(n.BLEND),x=!0),N!==Gf){if(N!==v||se!==I){if((m!==Ni||_!==Ni)&&(n.blendEquation(n.FUNC_ADD),m=Ni,_=Ni),se)switch(N){case ps:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ah:n.blendFunc(n.ONE,n.ONE);break;case lh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ch:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case ps:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ah:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case lh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ch:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}g=null,y=null,S=null,P=null,C.set(0,0,0),T=0,v=N,I=se}return}yt=yt||bt,Et=Et||q,ne=ne||rt,(bt!==m||yt!==_)&&(n.blendEquationSeparate(Xt[bt],Xt[yt]),m=bt,_=yt),(q!==g||rt!==y||Et!==S||ne!==P)&&(n.blendFuncSeparate(J[q],J[rt],J[Et],J[ne]),g=q,y=rt,S=Et,P=ne),(Le.equals(C)===!1||sn!==T)&&(n.blendColor(Le.r,Le.g,Le.b,sn),C.copy(Le),T=sn),v=N,I=!1}function pt(N,bt){N.side===Kn?at(n.CULL_FACE):lt(n.CULL_FACE);let q=N.side===ln;bt&&(q=!q),ft(q),N.blending===ps&&N.transparent===!1?R(gi):R(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),r.setMask(N.colorWrite);const rt=N.stencilWrite;a.setTest(rt),rt&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),zt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?lt(n.SAMPLE_ALPHA_TO_COVERAGE):at(n.SAMPLE_ALPHA_TO_COVERAGE)}function ft(N){Z!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),Z=N)}function ct(N){N!==kf?(lt(n.CULL_FACE),N!==M&&(N===oh?n.cullFace(n.BACK):N===Bf?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):at(n.CULL_FACE),M=N}function mt(N){N!==b&&(z&&n.lineWidth(N),b=N)}function zt(N,bt,q){N?(lt(n.POLYGON_OFFSET_FILL),(B!==bt||H!==q)&&(n.polygonOffset(bt,q),B=bt,H=q)):at(n.POLYGON_OFFSET_FILL)}function wt(N){N?lt(n.SCISSOR_TEST):at(n.SCISSOR_TEST)}function A(N){N===void 0&&(N=n.TEXTURE0+U-1),k!==N&&(n.activeTexture(N),k=N)}function w(N,bt,q){q===void 0&&(k===null?q=n.TEXTURE0+U-1:q=k);let rt=Y[q];rt===void 0&&(rt={type:void 0,texture:void 0},Y[q]=rt),(rt.type!==N||rt.texture!==bt)&&(k!==q&&(n.activeTexture(q),k=q),n.bindTexture(N,bt||K[N]),rt.type=N,rt.texture=bt)}function G(){const N=Y[k];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function Q(){try{n.compressedTexImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function st(){try{n.compressedTexImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function tt(){try{n.texSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Nt(){try{n.texSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function vt(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Tt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Qt(){try{n.texStorage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ut(){try{n.texStorage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function At(){try{n.texImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Wt(){try{n.texImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function $t(N){xt.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),xt.copy(N))}function Ct(N){Pt.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),Pt.copy(N))}function te(N,bt){let q=c.get(bt);q===void 0&&(q=new WeakMap,c.set(bt,q));let rt=q.get(N);rt===void 0&&(rt=n.getUniformBlockIndex(bt,N.name),q.set(N,rt))}function qt(N,bt){const rt=c.get(bt).get(N);l.get(bt)!==rt&&(n.uniformBlockBinding(bt,rt,N.__bindingPointIndex),l.set(bt,rt))}function me(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},k=null,Y={},u={},f=new WeakMap,d=[],p=null,x=!1,v=null,m=null,g=null,y=null,_=null,S=null,P=null,C=new Yt(0,0,0),T=0,I=!1,Z=null,M=null,b=null,B=null,H=null,xt.set(0,0,n.canvas.width,n.canvas.height),Pt.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:lt,disable:at,bindFramebuffer:Rt,drawBuffers:Ot,useProgram:Ht,setBlending:R,setMaterial:pt,setFlipSided:ft,setCullFace:ct,setLineWidth:mt,setPolygonOffset:zt,setScissorTest:wt,activeTexture:A,bindTexture:w,unbindTexture:G,compressedTexImage2D:Q,compressedTexImage3D:st,texImage2D:At,texImage3D:Wt,updateUBOMapping:te,uniformBlockBinding:qt,texStorage2D:Qt,texStorage3D:ut,texSubImage2D:tt,texSubImage3D:Nt,compressedTexSubImage2D:vt,compressedTexSubImage3D:Tt,scissor:$t,viewport:Ct,reset:me}}function Qh(n,t,e,i){const r=Cv(i);switch(e){case Vu:return n*t;case $u:return n*t;case Xu:return n*t*2;case qu:return n*t/r.components*r.byteLength;case _c:return n*t/r.components*r.byteLength;case Yu:return n*t*2/r.components*r.byteLength;case Mc:return n*t*2/r.components*r.byteLength;case Wu:return n*t*3/r.components*r.byteLength;case Pn:return n*t*4/r.components*r.byteLength;case yc:return n*t*4/r.components*r.byteLength;case ho:case uo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case fo:case po:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case yl:case wl:return Math.max(n,16)*Math.max(t,8)/4;case Ml:case Sl:return Math.max(n,8)*Math.max(t,8)/2;case bl:case El:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Tl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Al:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Cl:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Rl:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Pl:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Il:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Ll:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Dl:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Nl:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Ul:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Ol:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Fl:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case zl:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case kl:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Bl:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case mo:case Hl:case Gl:return Math.ceil(n/4)*Math.ceil(t/4)*16;case ju:case Vl:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Wl:case $l:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Cv(n){switch(n){case ei:case Bu:return{byteLength:1,components:1};case or:case Hu:case pr:return{byteLength:2,components:1};case xc:case vc:return{byteLength:2,components:4};case Hi:case gc:case Jn:return{byteLength:4,components:1};case Gu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function Rv(n,t,e,i,r,o,a){const l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new ht,u=new WeakMap;let f;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(A,w){return p?new OffscreenCanvas(A,w):Ro("canvas")}function v(A,w,G){let Q=1;const st=wt(A);if((st.width>G||st.height>G)&&(Q=G/Math.max(st.width,st.height)),Q<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const tt=Math.floor(Q*st.width),Nt=Math.floor(Q*st.height);f===void 0&&(f=x(tt,Nt));const vt=w?x(tt,Nt):f;return vt.width=tt,vt.height=Nt,vt.getContext("2d").drawImage(A,0,0,tt,Nt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+st.width+"x"+st.height+") to ("+tt+"x"+Nt+")."),vt}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+st.width+"x"+st.height+")."),A;return A}function m(A){return A.generateMipmaps&&A.minFilter!==Qe&&A.minFilter!==Cn}function g(A){n.generateMipmap(A)}function y(A,w,G,Q,st=!1){if(A!==null){if(n[A]!==void 0)return n[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let tt=w;if(w===n.RED&&(G===n.FLOAT&&(tt=n.R32F),G===n.HALF_FLOAT&&(tt=n.R16F),G===n.UNSIGNED_BYTE&&(tt=n.R8)),w===n.RED_INTEGER&&(G===n.UNSIGNED_BYTE&&(tt=n.R8UI),G===n.UNSIGNED_SHORT&&(tt=n.R16UI),G===n.UNSIGNED_INT&&(tt=n.R32UI),G===n.BYTE&&(tt=n.R8I),G===n.SHORT&&(tt=n.R16I),G===n.INT&&(tt=n.R32I)),w===n.RG&&(G===n.FLOAT&&(tt=n.RG32F),G===n.HALF_FLOAT&&(tt=n.RG16F),G===n.UNSIGNED_BYTE&&(tt=n.RG8)),w===n.RG_INTEGER&&(G===n.UNSIGNED_BYTE&&(tt=n.RG8UI),G===n.UNSIGNED_SHORT&&(tt=n.RG16UI),G===n.UNSIGNED_INT&&(tt=n.RG32UI),G===n.BYTE&&(tt=n.RG8I),G===n.SHORT&&(tt=n.RG16I),G===n.INT&&(tt=n.RG32I)),w===n.RGB_INTEGER&&(G===n.UNSIGNED_BYTE&&(tt=n.RGB8UI),G===n.UNSIGNED_SHORT&&(tt=n.RGB16UI),G===n.UNSIGNED_INT&&(tt=n.RGB32UI),G===n.BYTE&&(tt=n.RGB8I),G===n.SHORT&&(tt=n.RGB16I),G===n.INT&&(tt=n.RGB32I)),w===n.RGBA_INTEGER&&(G===n.UNSIGNED_BYTE&&(tt=n.RGBA8UI),G===n.UNSIGNED_SHORT&&(tt=n.RGBA16UI),G===n.UNSIGNED_INT&&(tt=n.RGBA32UI),G===n.BYTE&&(tt=n.RGBA8I),G===n.SHORT&&(tt=n.RGBA16I),G===n.INT&&(tt=n.RGBA32I)),w===n.RGB&&G===n.UNSIGNED_INT_5_9_9_9_REV&&(tt=n.RGB9_E5),w===n.RGBA){const Nt=st?Eo:le.getTransfer(Q);G===n.FLOAT&&(tt=n.RGBA32F),G===n.HALF_FLOAT&&(tt=n.RGBA16F),G===n.UNSIGNED_BYTE&&(tt=Nt===xe?n.SRGB8_ALPHA8:n.RGBA8),G===n.UNSIGNED_SHORT_4_4_4_4&&(tt=n.RGBA4),G===n.UNSIGNED_SHORT_5_5_5_1&&(tt=n.RGB5_A1)}return(tt===n.R16F||tt===n.R32F||tt===n.RG16F||tt===n.RG32F||tt===n.RGBA16F||tt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),tt}function _(A,w){let G;return A?w===null||w===Hi||w===Es?G=n.DEPTH24_STENCIL8:w===Jn?G=n.DEPTH32F_STENCIL8:w===or&&(G=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Hi||w===Es?G=n.DEPTH_COMPONENT24:w===Jn?G=n.DEPTH_COMPONENT32F:w===or&&(G=n.DEPTH_COMPONENT16),G}function S(A,w){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==Qe&&A.minFilter!==Cn?Math.log2(Math.max(w.width,w.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?w.mipmaps.length:1}function P(A){const w=A.target;w.removeEventListener("dispose",P),T(w),w.isVideoTexture&&u.delete(w)}function C(A){const w=A.target;w.removeEventListener("dispose",C),Z(w)}function T(A){const w=i.get(A);if(w.__webglInit===void 0)return;const G=A.source,Q=d.get(G);if(Q){const st=Q[w.__cacheKey];st.usedTimes--,st.usedTimes===0&&I(A),Object.keys(Q).length===0&&d.delete(G)}i.remove(A)}function I(A){const w=i.get(A);n.deleteTexture(w.__webglTexture);const G=A.source,Q=d.get(G);delete Q[w.__cacheKey],a.memory.textures--}function Z(A){const w=i.get(A);if(A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(w.__webglFramebuffer[Q]))for(let st=0;st<w.__webglFramebuffer[Q].length;st++)n.deleteFramebuffer(w.__webglFramebuffer[Q][st]);else n.deleteFramebuffer(w.__webglFramebuffer[Q]);w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer[Q])}else{if(Array.isArray(w.__webglFramebuffer))for(let Q=0;Q<w.__webglFramebuffer.length;Q++)n.deleteFramebuffer(w.__webglFramebuffer[Q]);else n.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&n.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let Q=0;Q<w.__webglColorRenderbuffer.length;Q++)w.__webglColorRenderbuffer[Q]&&n.deleteRenderbuffer(w.__webglColorRenderbuffer[Q]);w.__webglDepthRenderbuffer&&n.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const G=A.textures;for(let Q=0,st=G.length;Q<st;Q++){const tt=i.get(G[Q]);tt.__webglTexture&&(n.deleteTexture(tt.__webglTexture),a.memory.textures--),i.remove(G[Q])}i.remove(A)}let M=0;function b(){M=0}function B(){const A=M;return A>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+r.maxTextures),M+=1,A}function H(A){const w=[];return w.push(A.wrapS),w.push(A.wrapT),w.push(A.wrapR||0),w.push(A.magFilter),w.push(A.minFilter),w.push(A.anisotropy),w.push(A.internalFormat),w.push(A.format),w.push(A.type),w.push(A.generateMipmaps),w.push(A.premultiplyAlpha),w.push(A.flipY),w.push(A.unpackAlignment),w.push(A.colorSpace),w.join()}function U(A,w){const G=i.get(A);if(A.isVideoTexture&&mt(A),A.isRenderTargetTexture===!1&&A.version>0&&G.__version!==A.version){const Q=A.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Pt(G,A,w);return}}e.bindTexture(n.TEXTURE_2D,G.__webglTexture,n.TEXTURE0+w)}function z(A,w){const G=i.get(A);if(A.version>0&&G.__version!==A.version){Pt(G,A,w);return}e.bindTexture(n.TEXTURE_2D_ARRAY,G.__webglTexture,n.TEXTURE0+w)}function L(A,w){const G=i.get(A);if(A.version>0&&G.__version!==A.version){Pt(G,A,w);return}e.bindTexture(n.TEXTURE_3D,G.__webglTexture,n.TEXTURE0+w)}function W(A,w){const G=i.get(A);if(A.version>0&&G.__version!==A.version){V(G,A,w);return}e.bindTexture(n.TEXTURE_CUBE_MAP,G.__webglTexture,n.TEXTURE0+w)}const k={[bo]:n.REPEAT,[Oi]:n.CLAMP_TO_EDGE,[_l]:n.MIRRORED_REPEAT},Y={[Qe]:n.NEAREST,[mp]:n.NEAREST_MIPMAP_NEAREST,[Er]:n.NEAREST_MIPMAP_LINEAR,[Cn]:n.LINEAR,[ia]:n.LINEAR_MIPMAP_NEAREST,[Fi]:n.LINEAR_MIPMAP_LINEAR},et={[_p]:n.NEVER,[Ep]:n.ALWAYS,[Mp]:n.LESS,[Ku]:n.LEQUAL,[yp]:n.EQUAL,[bp]:n.GEQUAL,[Sp]:n.GREATER,[wp]:n.NOTEQUAL};function j(A,w){if(w.type===Jn&&t.has("OES_texture_float_linear")===!1&&(w.magFilter===Cn||w.magFilter===ia||w.magFilter===Er||w.magFilter===Fi||w.minFilter===Cn||w.minFilter===ia||w.minFilter===Er||w.minFilter===Fi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(A,n.TEXTURE_WRAP_S,k[w.wrapS]),n.texParameteri(A,n.TEXTURE_WRAP_T,k[w.wrapT]),(A===n.TEXTURE_3D||A===n.TEXTURE_2D_ARRAY)&&n.texParameteri(A,n.TEXTURE_WRAP_R,k[w.wrapR]),n.texParameteri(A,n.TEXTURE_MAG_FILTER,Y[w.magFilter]),n.texParameteri(A,n.TEXTURE_MIN_FILTER,Y[w.minFilter]),w.compareFunction&&(n.texParameteri(A,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(A,n.TEXTURE_COMPARE_FUNC,et[w.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Qe||w.minFilter!==Er&&w.minFilter!==Fi||w.type===Jn&&t.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||i.get(w).__currentAnisotropy){const G=t.get("EXT_texture_filter_anisotropic");n.texParameterf(A,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,r.getMaxAnisotropy())),i.get(w).__currentAnisotropy=w.anisotropy}}}function xt(A,w){let G=!1;A.__webglInit===void 0&&(A.__webglInit=!0,w.addEventListener("dispose",P));const Q=w.source;let st=d.get(Q);st===void 0&&(st={},d.set(Q,st));const tt=H(w);if(tt!==A.__cacheKey){st[tt]===void 0&&(st[tt]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,G=!0),st[tt].usedTimes++;const Nt=st[A.__cacheKey];Nt!==void 0&&(st[A.__cacheKey].usedTimes--,Nt.usedTimes===0&&I(w)),A.__cacheKey=tt,A.__webglTexture=st[tt].texture}return G}function Pt(A,w,G){let Q=n.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(Q=n.TEXTURE_2D_ARRAY),w.isData3DTexture&&(Q=n.TEXTURE_3D);const st=xt(A,w),tt=w.source;e.bindTexture(Q,A.__webglTexture,n.TEXTURE0+G);const Nt=i.get(tt);if(tt.version!==Nt.__version||st===!0){e.activeTexture(n.TEXTURE0+G);const vt=le.getPrimaries(le.workingColorSpace),Tt=w.colorSpace===mi?null:le.getPrimaries(w.colorSpace),Qt=w.colorSpace===mi||vt===Tt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Qt);let ut=v(w.image,!1,r.maxTextureSize);ut=zt(w,ut);const At=o.convert(w.format,w.colorSpace),Wt=o.convert(w.type);let $t=y(w.internalFormat,At,Wt,w.colorSpace,w.isVideoTexture);j(Q,w);let Ct;const te=w.mipmaps,qt=w.isVideoTexture!==!0,me=Nt.__version===void 0||st===!0,N=tt.dataReady,bt=S(w,ut);if(w.isDepthTexture)$t=_(w.format===Ts,w.type),me&&(qt?e.texStorage2D(n.TEXTURE_2D,1,$t,ut.width,ut.height):e.texImage2D(n.TEXTURE_2D,0,$t,ut.width,ut.height,0,At,Wt,null));else if(w.isDataTexture)if(te.length>0){qt&&me&&e.texStorage2D(n.TEXTURE_2D,bt,$t,te[0].width,te[0].height);for(let q=0,rt=te.length;q<rt;q++)Ct=te[q],qt?N&&e.texSubImage2D(n.TEXTURE_2D,q,0,0,Ct.width,Ct.height,At,Wt,Ct.data):e.texImage2D(n.TEXTURE_2D,q,$t,Ct.width,Ct.height,0,At,Wt,Ct.data);w.generateMipmaps=!1}else qt?(me&&e.texStorage2D(n.TEXTURE_2D,bt,$t,ut.width,ut.height),N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,ut.width,ut.height,At,Wt,ut.data)):e.texImage2D(n.TEXTURE_2D,0,$t,ut.width,ut.height,0,At,Wt,ut.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){qt&&me&&e.texStorage3D(n.TEXTURE_2D_ARRAY,bt,$t,te[0].width,te[0].height,ut.depth);for(let q=0,rt=te.length;q<rt;q++)if(Ct=te[q],w.format!==Pn)if(At!==null)if(qt){if(N)if(w.layerUpdates.size>0){const yt=Qh(Ct.width,Ct.height,w.format,w.type);for(const Et of w.layerUpdates){const ne=Ct.data.subarray(Et*yt/Ct.data.BYTES_PER_ELEMENT,(Et+1)*yt/Ct.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,q,0,0,Et,Ct.width,Ct.height,1,At,ne,0,0)}w.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,q,0,0,0,Ct.width,Ct.height,ut.depth,At,Ct.data,0,0)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,q,$t,Ct.width,Ct.height,ut.depth,0,Ct.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else qt?N&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,q,0,0,0,Ct.width,Ct.height,ut.depth,At,Wt,Ct.data):e.texImage3D(n.TEXTURE_2D_ARRAY,q,$t,Ct.width,Ct.height,ut.depth,0,At,Wt,Ct.data)}else{qt&&me&&e.texStorage2D(n.TEXTURE_2D,bt,$t,te[0].width,te[0].height);for(let q=0,rt=te.length;q<rt;q++)Ct=te[q],w.format!==Pn?At!==null?qt?N&&e.compressedTexSubImage2D(n.TEXTURE_2D,q,0,0,Ct.width,Ct.height,At,Ct.data):e.compressedTexImage2D(n.TEXTURE_2D,q,$t,Ct.width,Ct.height,0,Ct.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):qt?N&&e.texSubImage2D(n.TEXTURE_2D,q,0,0,Ct.width,Ct.height,At,Wt,Ct.data):e.texImage2D(n.TEXTURE_2D,q,$t,Ct.width,Ct.height,0,At,Wt,Ct.data)}else if(w.isDataArrayTexture)if(qt){if(me&&e.texStorage3D(n.TEXTURE_2D_ARRAY,bt,$t,ut.width,ut.height,ut.depth),N)if(w.layerUpdates.size>0){const q=Qh(ut.width,ut.height,w.format,w.type);for(const rt of w.layerUpdates){const yt=ut.data.subarray(rt*q/ut.data.BYTES_PER_ELEMENT,(rt+1)*q/ut.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,rt,ut.width,ut.height,1,At,Wt,yt)}w.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ut.width,ut.height,ut.depth,At,Wt,ut.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,$t,ut.width,ut.height,ut.depth,0,At,Wt,ut.data);else if(w.isData3DTexture)qt?(me&&e.texStorage3D(n.TEXTURE_3D,bt,$t,ut.width,ut.height,ut.depth),N&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ut.width,ut.height,ut.depth,At,Wt,ut.data)):e.texImage3D(n.TEXTURE_3D,0,$t,ut.width,ut.height,ut.depth,0,At,Wt,ut.data);else if(w.isFramebufferTexture){if(me)if(qt)e.texStorage2D(n.TEXTURE_2D,bt,$t,ut.width,ut.height);else{let q=ut.width,rt=ut.height;for(let yt=0;yt<bt;yt++)e.texImage2D(n.TEXTURE_2D,yt,$t,q,rt,0,At,Wt,null),q>>=1,rt>>=1}}else if(te.length>0){if(qt&&me){const q=wt(te[0]);e.texStorage2D(n.TEXTURE_2D,bt,$t,q.width,q.height)}for(let q=0,rt=te.length;q<rt;q++)Ct=te[q],qt?N&&e.texSubImage2D(n.TEXTURE_2D,q,0,0,At,Wt,Ct):e.texImage2D(n.TEXTURE_2D,q,$t,At,Wt,Ct);w.generateMipmaps=!1}else if(qt){if(me){const q=wt(ut);e.texStorage2D(n.TEXTURE_2D,bt,$t,q.width,q.height)}N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,At,Wt,ut)}else e.texImage2D(n.TEXTURE_2D,0,$t,At,Wt,ut);m(w)&&g(Q),Nt.__version=tt.version,w.onUpdate&&w.onUpdate(w)}A.__version=w.version}function V(A,w,G){if(w.image.length!==6)return;const Q=xt(A,w),st=w.source;e.bindTexture(n.TEXTURE_CUBE_MAP,A.__webglTexture,n.TEXTURE0+G);const tt=i.get(st);if(st.version!==tt.__version||Q===!0){e.activeTexture(n.TEXTURE0+G);const Nt=le.getPrimaries(le.workingColorSpace),vt=w.colorSpace===mi?null:le.getPrimaries(w.colorSpace),Tt=w.colorSpace===mi||Nt===vt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Tt);const Qt=w.isCompressedTexture||w.image[0].isCompressedTexture,ut=w.image[0]&&w.image[0].isDataTexture,At=[];for(let rt=0;rt<6;rt++)!Qt&&!ut?At[rt]=v(w.image[rt],!0,r.maxCubemapSize):At[rt]=ut?w.image[rt].image:w.image[rt],At[rt]=zt(w,At[rt]);const Wt=At[0],$t=o.convert(w.format,w.colorSpace),Ct=o.convert(w.type),te=y(w.internalFormat,$t,Ct,w.colorSpace),qt=w.isVideoTexture!==!0,me=tt.__version===void 0||Q===!0,N=st.dataReady;let bt=S(w,Wt);j(n.TEXTURE_CUBE_MAP,w);let q;if(Qt){qt&&me&&e.texStorage2D(n.TEXTURE_CUBE_MAP,bt,te,Wt.width,Wt.height);for(let rt=0;rt<6;rt++){q=At[rt].mipmaps;for(let yt=0;yt<q.length;yt++){const Et=q[yt];w.format!==Pn?$t!==null?qt?N&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,yt,0,0,Et.width,Et.height,$t,Et.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,yt,te,Et.width,Et.height,0,Et.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):qt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,yt,0,0,Et.width,Et.height,$t,Ct,Et.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,yt,te,Et.width,Et.height,0,$t,Ct,Et.data)}}}else{if(q=w.mipmaps,qt&&me){q.length>0&&bt++;const rt=wt(At[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,bt,te,rt.width,rt.height)}for(let rt=0;rt<6;rt++)if(ut){qt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,At[rt].width,At[rt].height,$t,Ct,At[rt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,te,At[rt].width,At[rt].height,0,$t,Ct,At[rt].data);for(let yt=0;yt<q.length;yt++){const ne=q[yt].image[rt].image;qt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,yt+1,0,0,ne.width,ne.height,$t,Ct,ne.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,yt+1,te,ne.width,ne.height,0,$t,Ct,ne.data)}}else{qt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,$t,Ct,At[rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,te,$t,Ct,At[rt]);for(let yt=0;yt<q.length;yt++){const Et=q[yt];qt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,yt+1,0,0,$t,Ct,Et.image[rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,yt+1,te,$t,Ct,Et.image[rt])}}}m(w)&&g(n.TEXTURE_CUBE_MAP),tt.__version=st.version,w.onUpdate&&w.onUpdate(w)}A.__version=w.version}function K(A,w,G,Q,st,tt){const Nt=o.convert(G.format,G.colorSpace),vt=o.convert(G.type),Tt=y(G.internalFormat,Nt,vt,G.colorSpace);if(!i.get(w).__hasExternalTextures){const ut=Math.max(1,w.width>>tt),At=Math.max(1,w.height>>tt);st===n.TEXTURE_3D||st===n.TEXTURE_2D_ARRAY?e.texImage3D(st,tt,Tt,ut,At,w.depth,0,Nt,vt,null):e.texImage2D(st,tt,Tt,ut,At,0,Nt,vt,null)}e.bindFramebuffer(n.FRAMEBUFFER,A),ct(w)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Q,st,i.get(G).__webglTexture,0,ft(w)):(st===n.TEXTURE_2D||st>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&st<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Q,st,i.get(G).__webglTexture,tt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function lt(A,w,G){if(n.bindRenderbuffer(n.RENDERBUFFER,A),w.depthBuffer){const Q=w.depthTexture,st=Q&&Q.isDepthTexture?Q.type:null,tt=_(w.stencilBuffer,st),Nt=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,vt=ft(w);ct(w)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,vt,tt,w.width,w.height):G?n.renderbufferStorageMultisample(n.RENDERBUFFER,vt,tt,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,tt,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Nt,n.RENDERBUFFER,A)}else{const Q=w.textures;for(let st=0;st<Q.length;st++){const tt=Q[st],Nt=o.convert(tt.format,tt.colorSpace),vt=o.convert(tt.type),Tt=y(tt.internalFormat,Nt,vt,tt.colorSpace),Qt=ft(w);G&&ct(w)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Qt,Tt,w.width,w.height):ct(w)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Qt,Tt,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,Tt,w.width,w.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function at(A,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,A),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(w.depthTexture).__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),U(w.depthTexture,0);const Q=i.get(w.depthTexture).__webglTexture,st=ft(w);if(w.depthTexture.format===ms)ct(w)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Q,0,st):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Q,0);else if(w.depthTexture.format===Ts)ct(w)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Q,0,st):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function Rt(A){const w=i.get(A),G=A.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==A.depthTexture){const Q=A.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),Q){const st=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,Q.removeEventListener("dispose",st)};Q.addEventListener("dispose",st),w.__depthDisposeCallback=st}w.__boundDepthTexture=Q}if(A.depthTexture&&!w.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");at(w.__webglFramebuffer,A)}else if(G){w.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(e.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[Q]),w.__webglDepthbuffer[Q]===void 0)w.__webglDepthbuffer[Q]=n.createRenderbuffer(),lt(w.__webglDepthbuffer[Q],A,!1);else{const st=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,tt=w.__webglDepthbuffer[Q];n.bindRenderbuffer(n.RENDERBUFFER,tt),n.framebufferRenderbuffer(n.FRAMEBUFFER,st,n.RENDERBUFFER,tt)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=n.createRenderbuffer(),lt(w.__webglDepthbuffer,A,!1);else{const Q=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,st=w.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,st),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,st)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ot(A,w,G){const Q=i.get(A);w!==void 0&&K(Q.__webglFramebuffer,A,A.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),G!==void 0&&Rt(A)}function Ht(A){const w=A.texture,G=i.get(A),Q=i.get(w);A.addEventListener("dispose",C);const st=A.textures,tt=A.isWebGLCubeRenderTarget===!0,Nt=st.length>1;if(Nt||(Q.__webglTexture===void 0&&(Q.__webglTexture=n.createTexture()),Q.__version=w.version,a.memory.textures++),tt){G.__webglFramebuffer=[];for(let vt=0;vt<6;vt++)if(w.mipmaps&&w.mipmaps.length>0){G.__webglFramebuffer[vt]=[];for(let Tt=0;Tt<w.mipmaps.length;Tt++)G.__webglFramebuffer[vt][Tt]=n.createFramebuffer()}else G.__webglFramebuffer[vt]=n.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){G.__webglFramebuffer=[];for(let vt=0;vt<w.mipmaps.length;vt++)G.__webglFramebuffer[vt]=n.createFramebuffer()}else G.__webglFramebuffer=n.createFramebuffer();if(Nt)for(let vt=0,Tt=st.length;vt<Tt;vt++){const Qt=i.get(st[vt]);Qt.__webglTexture===void 0&&(Qt.__webglTexture=n.createTexture(),a.memory.textures++)}if(A.samples>0&&ct(A)===!1){G.__webglMultisampledFramebuffer=n.createFramebuffer(),G.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let vt=0;vt<st.length;vt++){const Tt=st[vt];G.__webglColorRenderbuffer[vt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,G.__webglColorRenderbuffer[vt]);const Qt=o.convert(Tt.format,Tt.colorSpace),ut=o.convert(Tt.type),At=y(Tt.internalFormat,Qt,ut,Tt.colorSpace,A.isXRRenderTarget===!0),Wt=ft(A);n.renderbufferStorageMultisample(n.RENDERBUFFER,Wt,At,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.RENDERBUFFER,G.__webglColorRenderbuffer[vt])}n.bindRenderbuffer(n.RENDERBUFFER,null),A.depthBuffer&&(G.__webglDepthRenderbuffer=n.createRenderbuffer(),lt(G.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(tt){e.bindTexture(n.TEXTURE_CUBE_MAP,Q.__webglTexture),j(n.TEXTURE_CUBE_MAP,w);for(let vt=0;vt<6;vt++)if(w.mipmaps&&w.mipmaps.length>0)for(let Tt=0;Tt<w.mipmaps.length;Tt++)K(G.__webglFramebuffer[vt][Tt],A,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+vt,Tt);else K(G.__webglFramebuffer[vt],A,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0);m(w)&&g(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Nt){for(let vt=0,Tt=st.length;vt<Tt;vt++){const Qt=st[vt],ut=i.get(Qt);e.bindTexture(n.TEXTURE_2D,ut.__webglTexture),j(n.TEXTURE_2D,Qt),K(G.__webglFramebuffer,A,Qt,n.COLOR_ATTACHMENT0+vt,n.TEXTURE_2D,0),m(Qt)&&g(n.TEXTURE_2D)}e.unbindTexture()}else{let vt=n.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(vt=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(vt,Q.__webglTexture),j(vt,w),w.mipmaps&&w.mipmaps.length>0)for(let Tt=0;Tt<w.mipmaps.length;Tt++)K(G.__webglFramebuffer[Tt],A,w,n.COLOR_ATTACHMENT0,vt,Tt);else K(G.__webglFramebuffer,A,w,n.COLOR_ATTACHMENT0,vt,0);m(w)&&g(vt),e.unbindTexture()}A.depthBuffer&&Rt(A)}function Xt(A){const w=A.textures;for(let G=0,Q=w.length;G<Q;G++){const st=w[G];if(m(st)){const tt=A.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,Nt=i.get(st).__webglTexture;e.bindTexture(tt,Nt),g(tt),e.unbindTexture()}}}const J=[],R=[];function pt(A){if(A.samples>0){if(ct(A)===!1){const w=A.textures,G=A.width,Q=A.height;let st=n.COLOR_BUFFER_BIT;const tt=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Nt=i.get(A),vt=w.length>1;if(vt)for(let Tt=0;Tt<w.length;Tt++)e.bindFramebuffer(n.FRAMEBUFFER,Nt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Tt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Nt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Tt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Nt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Nt.__webglFramebuffer);for(let Tt=0;Tt<w.length;Tt++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(st|=n.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(st|=n.STENCIL_BUFFER_BIT)),vt){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Nt.__webglColorRenderbuffer[Tt]);const Qt=i.get(w[Tt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Qt,0)}n.blitFramebuffer(0,0,G,Q,0,0,G,Q,st,n.NEAREST),c===!0&&(J.length=0,R.length=0,J.push(n.COLOR_ATTACHMENT0+Tt),A.depthBuffer&&A.resolveDepthBuffer===!1&&(J.push(tt),R.push(tt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,R)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,J))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),vt)for(let Tt=0;Tt<w.length;Tt++){e.bindFramebuffer(n.FRAMEBUFFER,Nt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Tt,n.RENDERBUFFER,Nt.__webglColorRenderbuffer[Tt]);const Qt=i.get(w[Tt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Nt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Tt,n.TEXTURE_2D,Qt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Nt.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&c){const w=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[w])}}}function ft(A){return Math.min(r.maxSamples,A.samples)}function ct(A){const w=i.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function mt(A){const w=a.render.frame;u.get(A)!==w&&(u.set(A,w),A.update())}function zt(A,w){const G=A.colorSpace,Q=A.format,st=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||G!==wi&&G!==mi&&(le.getTransfer(G)===xe?(Q!==Pn||st!==ei)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),w}function wt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(h.width=A.naturalWidth||A.width,h.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(h.width=A.displayWidth,h.height=A.displayHeight):(h.width=A.width,h.height=A.height),h}this.allocateTextureUnit=B,this.resetTextureUnits=b,this.setTexture2D=U,this.setTexture2DArray=z,this.setTexture3D=L,this.setTextureCube=W,this.rebindTextures=Ot,this.setupRenderTarget=Ht,this.updateRenderTargetMipmap=Xt,this.updateMultisampleRenderTarget=pt,this.setupDepthRenderbuffer=Rt,this.setupFrameBufferTexture=K,this.useMultisampledRTT=ct}function Pv(n,t){function e(i,r=mi){let o;const a=le.getTransfer(r);if(i===ei)return n.UNSIGNED_BYTE;if(i===xc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===vc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Gu)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Bu)return n.BYTE;if(i===Hu)return n.SHORT;if(i===or)return n.UNSIGNED_SHORT;if(i===gc)return n.INT;if(i===Hi)return n.UNSIGNED_INT;if(i===Jn)return n.FLOAT;if(i===pr)return n.HALF_FLOAT;if(i===Vu)return n.ALPHA;if(i===Wu)return n.RGB;if(i===Pn)return n.RGBA;if(i===$u)return n.LUMINANCE;if(i===Xu)return n.LUMINANCE_ALPHA;if(i===ms)return n.DEPTH_COMPONENT;if(i===Ts)return n.DEPTH_STENCIL;if(i===qu)return n.RED;if(i===_c)return n.RED_INTEGER;if(i===Yu)return n.RG;if(i===Mc)return n.RG_INTEGER;if(i===yc)return n.RGBA_INTEGER;if(i===ho||i===uo||i===fo||i===po)if(a===xe)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(i===ho)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===uo)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===fo)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===po)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(i===ho)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===uo)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===fo)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===po)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Ml||i===yl||i===Sl||i===wl)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(i===Ml)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===yl)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Sl)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===wl)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===bl||i===El||i===Tl)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(i===bl||i===El)return a===xe?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(i===Tl)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Al||i===Cl||i===Rl||i===Pl||i===Il||i===Ll||i===Dl||i===Nl||i===Ul||i===Ol||i===Fl||i===zl||i===kl||i===Bl)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(i===Al)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Cl)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Rl)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Pl)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Il)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Ll)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Dl)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Nl)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ul)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ol)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Fl)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===zl)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===kl)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Bl)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===mo||i===Hl||i===Gl)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(i===mo)return a===xe?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Hl)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Gl)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===ju||i===Vl||i===Wl||i===$l)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(i===mo)return o.COMPRESSED_RED_RGTC1_EXT;if(i===Vl)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Wl)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===$l)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Es?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class Iv extends Mn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class he extends ke{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Lv={type:"move"};class Da{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new he,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new he,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new he,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let r=null,o=null,a=null;const l=this._targetRay,c=this._grip,h=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(h&&t.hand){a=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,i),g=this._getHandJoint(h,v);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const u=h.joints["index-finger-tip"],f=h.joints["thumb-tip"],d=u.position.distanceTo(f.position),p=.02,x=.005;h.inputState.pinching&&d>p+x?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!h.inputState.pinching&&d<=p-x&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,i),o!==null&&(c.matrix.fromArray(o.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,o.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(o.linearVelocity)):c.hasLinearVelocity=!1,o.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(o.angularVelocity)):c.hasAngularVelocity=!1));l!==null&&(r=e.getPose(t.targetRaySpace,i),r===null&&o!==null&&(r=o),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,this.dispatchEvent(Lv)))}return l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new he;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const Dv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Nv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Uv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const r=new tn,o=t.properties.get(r);o.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=r}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new yi({vertexShader:Dv,fragmentShader:Nv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Bt(new kn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Ov extends Ds{constructor(t,e){super();const i=this;let r=null,o=1,a=null,l="local-floor",c=1,h=null,u=null,f=null,d=null,p=null,x=null;const v=new Uv,m=e.getContextAttributes();let g=null,y=null;const _=[],S=[],P=new ht;let C=null;const T=new Mn;T.layers.enable(1),T.viewport=new Ae;const I=new Mn;I.layers.enable(2),I.viewport=new Ae;const Z=[T,I],M=new Iv;M.layers.enable(1),M.layers.enable(2);let b=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let K=_[V];return K===void 0&&(K=new Da,_[V]=K),K.getTargetRaySpace()},this.getControllerGrip=function(V){let K=_[V];return K===void 0&&(K=new Da,_[V]=K),K.getGripSpace()},this.getHand=function(V){let K=_[V];return K===void 0&&(K=new Da,_[V]=K),K.getHandSpace()};function H(V){const K=S.indexOf(V.inputSource);if(K===-1)return;const lt=_[K];lt!==void 0&&(lt.update(V.inputSource,V.frame,h||a),lt.dispatchEvent({type:V.type,data:V.inputSource}))}function U(){r.removeEventListener("select",H),r.removeEventListener("selectstart",H),r.removeEventListener("selectend",H),r.removeEventListener("squeeze",H),r.removeEventListener("squeezestart",H),r.removeEventListener("squeezeend",H),r.removeEventListener("end",U),r.removeEventListener("inputsourceschange",z);for(let V=0;V<_.length;V++){const K=S[V];K!==null&&(S[V]=null,_[V].disconnect(K))}b=null,B=null,v.reset(),t.setRenderTarget(g),p=null,d=null,f=null,r=null,y=null,Pt.stop(),i.isPresenting=!1,t.setPixelRatio(C),t.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){o=V,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){l=V,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(V){h=V},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return f},this.getFrame=function(){return x},this.getSession=function(){return r},this.setSession=async function(V){if(r=V,r!==null){if(g=t.getRenderTarget(),r.addEventListener("select",H),r.addEventListener("selectstart",H),r.addEventListener("selectend",H),r.addEventListener("squeeze",H),r.addEventListener("squeezestart",H),r.addEventListener("squeezeend",H),r.addEventListener("end",U),r.addEventListener("inputsourceschange",z),m.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(P),r.renderState.layers===void 0){const K={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:o};p=new XRWebGLLayer(r,e,K),r.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),y=new Gi(p.framebufferWidth,p.framebufferHeight,{format:Pn,type:ei,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let K=null,lt=null,at=null;m.depth&&(at=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,K=m.stencil?Ts:ms,lt=m.stencil?Es:Hi);const Rt={colorFormat:e.RGBA8,depthFormat:at,scaleFactor:o};f=new XRWebGLBinding(r,e),d=f.createProjectionLayer(Rt),r.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),y=new Gi(d.textureWidth,d.textureHeight,{format:Pn,type:ei,depthTexture:new cd(d.textureWidth,d.textureHeight,lt,void 0,void 0,void 0,void 0,void 0,void 0,K),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),h=null,a=await r.requestReferenceSpace(l),Pt.setContext(r),Pt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function z(V){for(let K=0;K<V.removed.length;K++){const lt=V.removed[K],at=S.indexOf(lt);at>=0&&(S[at]=null,_[at].disconnect(lt))}for(let K=0;K<V.added.length;K++){const lt=V.added[K];let at=S.indexOf(lt);if(at===-1){for(let Ot=0;Ot<_.length;Ot++)if(Ot>=S.length){S.push(lt),at=Ot;break}else if(S[Ot]===null){S[Ot]=lt,at=Ot;break}if(at===-1)break}const Rt=_[at];Rt&&Rt.connect(lt)}}const L=new D,W=new D;function k(V,K,lt){L.setFromMatrixPosition(K.matrixWorld),W.setFromMatrixPosition(lt.matrixWorld);const at=L.distanceTo(W),Rt=K.projectionMatrix.elements,Ot=lt.projectionMatrix.elements,Ht=Rt[14]/(Rt[10]-1),Xt=Rt[14]/(Rt[10]+1),J=(Rt[9]+1)/Rt[5],R=(Rt[9]-1)/Rt[5],pt=(Rt[8]-1)/Rt[0],ft=(Ot[8]+1)/Ot[0],ct=Ht*pt,mt=Ht*ft,zt=at/(-pt+ft),wt=zt*-pt;if(K.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(wt),V.translateZ(zt),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert(),Rt[10]===-1)V.projectionMatrix.copy(K.projectionMatrix),V.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const A=Ht+zt,w=Xt+zt,G=ct-wt,Q=mt+(at-wt),st=J*Xt/w*A,tt=R*Xt/w*A;V.projectionMatrix.makePerspective(G,Q,st,tt,A,w),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}}function Y(V,K){K===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(K.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(r===null)return;let K=V.near,lt=V.far;v.texture!==null&&(v.depthNear>0&&(K=v.depthNear),v.depthFar>0&&(lt=v.depthFar)),M.near=I.near=T.near=K,M.far=I.far=T.far=lt,(b!==M.near||B!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),b=M.near,B=M.far);const at=V.parent,Rt=M.cameras;Y(M,at);for(let Ot=0;Ot<Rt.length;Ot++)Y(Rt[Ot],at);Rt.length===2?k(M,T,I):M.projectionMatrix.copy(T.projectionMatrix),et(V,M,at)};function et(V,K,lt){lt===null?V.matrix.copy(K.matrixWorld):(V.matrix.copy(lt.matrixWorld),V.matrix.invert(),V.matrix.multiply(K.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(K.projectionMatrix),V.projectionMatrixInverse.copy(K.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=Xl*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&p===null))return c},this.setFoveation=function(V){c=V,d!==null&&(d.fixedFoveation=V),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=V)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(M)};let j=null;function xt(V,K){if(u=K.getViewerPose(h||a),x=K,u!==null){const lt=u.views;p!==null&&(t.setRenderTargetFramebuffer(y,p.framebuffer),t.setRenderTarget(y));let at=!1;lt.length!==M.cameras.length&&(M.cameras.length=0,at=!0);for(let Ot=0;Ot<lt.length;Ot++){const Ht=lt[Ot];let Xt=null;if(p!==null)Xt=p.getViewport(Ht);else{const R=f.getViewSubImage(d,Ht);Xt=R.viewport,Ot===0&&(t.setRenderTargetTextures(y,R.colorTexture,d.ignoreDepthValues?void 0:R.depthStencilTexture),t.setRenderTarget(y))}let J=Z[Ot];J===void 0&&(J=new Mn,J.layers.enable(Ot),J.viewport=new Ae,Z[Ot]=J),J.matrix.fromArray(Ht.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(Ht.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(Xt.x,Xt.y,Xt.width,Xt.height),Ot===0&&(M.matrix.copy(J.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),at===!0&&M.cameras.push(J)}const Rt=r.enabledFeatures;if(Rt&&Rt.includes("depth-sensing")){const Ot=f.getDepthInformation(lt[0]);Ot&&Ot.isValid&&Ot.texture&&v.init(t,Ot,r.renderState)}}for(let lt=0;lt<_.length;lt++){const at=S[lt],Rt=_[lt];at!==null&&Rt!==void 0&&Rt.update(at,K,h||a)}j&&j(V,K),K.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:K}),x=null}const Pt=new ad;Pt.setAnimationLoop(xt),this.setAnimationLoop=function(V){j=V},this.dispose=function(){}}}const Pi=new Un,Fv=new pe;function zv(n,t){function e(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function i(m,g){g.color.getRGB(m.fogColor.value,sd(n)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function r(m,g,y,_,S){g.isMeshBasicMaterial||g.isMeshLambertMaterial?o(m,g):g.isMeshToonMaterial?(o(m,g),f(m,g)):g.isMeshPhongMaterial?(o(m,g),u(m,g)):g.isMeshStandardMaterial?(o(m,g),d(m,g),g.isMeshPhysicalMaterial&&p(m,g,S)):g.isMeshMatcapMaterial?(o(m,g),x(m,g)):g.isMeshDepthMaterial?o(m,g):g.isMeshDistanceMaterial?(o(m,g),v(m,g)):g.isMeshNormalMaterial?o(m,g):g.isLineBasicMaterial?(a(m,g),g.isLineDashedMaterial&&l(m,g)):g.isPointsMaterial?c(m,g,y,_):g.isSpriteMaterial?h(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function o(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,e(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===ln&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,e(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===ln&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,e(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,e(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const y=t.get(g),_=y.envMap,S=y.envMapRotation;_&&(m.envMap.value=_,Pi.copy(S),Pi.x*=-1,Pi.y*=-1,Pi.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Pi.y*=-1,Pi.z*=-1),m.envMapRotation.value.setFromMatrix4(Fv.makeRotationFromEuler(Pi)),m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,m.aoMapTransform))}function a(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform))}function l(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function c(m,g,y,_){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*y,m.scale.value=_*.5,g.map&&(m.map.value=g.map,e(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function u(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function f(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function d(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function p(m,g,y){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===ln&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,m.specularIntensityMapTransform))}function x(m,g){g.matcap&&(m.matcap.value=g.matcap)}function v(m,g){const y=t.get(g).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function kv(n,t,e,i){let r={},o={},a=[];const l=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,_){const S=_.program;i.uniformBlockBinding(y,S)}function h(y,_){let S=r[y.id];S===void 0&&(x(y),S=u(y),r[y.id]=S,y.addEventListener("dispose",m));const P=_.program;i.updateUBOMapping(y,P);const C=t.render.frame;o[y.id]!==C&&(d(y),o[y.id]=C)}function u(y){const _=f();y.__bindingPointIndex=_;const S=n.createBuffer(),P=y.__size,C=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,S),n.bufferData(n.UNIFORM_BUFFER,P,C),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,_,S),S}function f(){for(let y=0;y<l;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const _=r[y.id],S=y.uniforms,P=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,_);for(let C=0,T=S.length;C<T;C++){const I=Array.isArray(S[C])?S[C]:[S[C]];for(let Z=0,M=I.length;Z<M;Z++){const b=I[Z];if(p(b,C,Z,P)===!0){const B=b.__offset,H=Array.isArray(b.value)?b.value:[b.value];let U=0;for(let z=0;z<H.length;z++){const L=H[z],W=v(L);typeof L=="number"||typeof L=="boolean"?(b.__data[0]=L,n.bufferSubData(n.UNIFORM_BUFFER,B+U,b.__data)):L.isMatrix3?(b.__data[0]=L.elements[0],b.__data[1]=L.elements[1],b.__data[2]=L.elements[2],b.__data[3]=0,b.__data[4]=L.elements[3],b.__data[5]=L.elements[4],b.__data[6]=L.elements[5],b.__data[7]=0,b.__data[8]=L.elements[6],b.__data[9]=L.elements[7],b.__data[10]=L.elements[8],b.__data[11]=0):(L.toArray(b.__data,U),U+=W.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,B,b.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(y,_,S,P){const C=y.value,T=_+"_"+S;if(P[T]===void 0)return typeof C=="number"||typeof C=="boolean"?P[T]=C:P[T]=C.clone(),!0;{const I=P[T];if(typeof C=="number"||typeof C=="boolean"){if(I!==C)return P[T]=C,!0}else if(I.equals(C)===!1)return I.copy(C),!0}return!1}function x(y){const _=y.uniforms;let S=0;const P=16;for(let T=0,I=_.length;T<I;T++){const Z=Array.isArray(_[T])?_[T]:[_[T]];for(let M=0,b=Z.length;M<b;M++){const B=Z[M],H=Array.isArray(B.value)?B.value:[B.value];for(let U=0,z=H.length;U<z;U++){const L=H[U],W=v(L),k=S%P,Y=k%W.boundary,et=k+Y;S+=Y,et!==0&&P-et<W.storage&&(S+=P-et),B.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=S,S+=W.storage}}}const C=S%P;return C>0&&(S+=P-C),y.__size=S,y.__cache={},this}function v(y){const _={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(_.boundary=4,_.storage=4):y.isVector2?(_.boundary=8,_.storage=8):y.isVector3||y.isColor?(_.boundary=16,_.storage=12):y.isVector4?(_.boundary=16,_.storage=16):y.isMatrix3?(_.boundary=48,_.storage=48):y.isMatrix4?(_.boundary=64,_.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),_}function m(y){const _=y.target;_.removeEventListener("dispose",m);const S=a.indexOf(_.__bindingPointIndex);a.splice(S,1),n.deleteBuffer(r[_.id]),delete r[_.id],delete o[_.id]}function g(){for(const y in r)n.deleteBuffer(r[y]);a=[],r={},o={}}return{bind:c,update:h,dispose:g}}class Bv{constructor(t={}){const{canvas:e=Ap(),context:i=null,depth:r=!0,stencil:o=!1,alpha:a=!1,antialias:l=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1}=t;this.isWebGLRenderer=!0;let d;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=i.getContextAttributes().alpha}else d=a;const p=new Uint32Array(4),x=new Int32Array(4);let v=null,m=null;const g=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=An,this.toneMapping=xi,this.toneMappingExposure=1;const _=this;let S=!1,P=0,C=0,T=null,I=-1,Z=null;const M=new Ae,b=new Ae;let B=null;const H=new Yt(0);let U=0,z=e.width,L=e.height,W=1,k=null,Y=null;const et=new Ae(0,0,z,L),j=new Ae(0,0,z,L);let xt=!1;const Pt=new bc;let V=!1,K=!1;const lt=new pe,at=new pe,Rt=new D,Ot=new Ae,Ht={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Xt=!1;function J(){return T===null?W:1}let R=i;function pt(E,O){return e.getContext(E,O)}try{const E={alpha:!0,depth:r,stencil:o,antialias:l,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${pc}`),e.addEventListener("webglcontextlost",rt,!1),e.addEventListener("webglcontextrestored",yt,!1),e.addEventListener("webglcontextcreationerror",Et,!1),R===null){const O="webgl2";if(R=pt(O,E),R===null)throw pt(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let ft,ct,mt,zt,wt,A,w,G,Q,st,tt,Nt,vt,Tt,Qt,ut,At,Wt,$t,Ct,te,qt,me,N;function bt(){ft=new $g(R),ft.init(),qt=new Pv(R,ft),ct=new kg(R,ft,t,qt),mt=new Av(R),ct.reverseDepthBuffer&&mt.buffers.depth.setReversed(!0),zt=new Yg(R),wt=new dv,A=new Rv(R,ft,mt,wt,ct,qt,zt),w=new Hg(_),G=new Wg(_),Q=new em(R),me=new Fg(R,Q),st=new Xg(R,Q,zt,me),tt=new Zg(R,st,Q,zt),$t=new jg(R,ct,A),ut=new Bg(wt),Nt=new uv(_,w,G,ft,ct,me,ut),vt=new zv(_,wt),Tt=new pv,Qt=new Mv(ft),Wt=new Og(_,w,G,mt,tt,d,c),At=new Ev(_,tt,ct),N=new kv(R,zt,ct,mt),Ct=new zg(R,ft,zt),te=new qg(R,ft,zt),zt.programs=Nt.programs,_.capabilities=ct,_.extensions=ft,_.properties=wt,_.renderLists=Tt,_.shadowMap=At,_.state=mt,_.info=zt}bt();const q=new Ov(_,R);this.xr=q,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const E=ft.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=ft.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(E){E!==void 0&&(W=E,this.setSize(z,L,!1))},this.getSize=function(E){return E.set(z,L)},this.setSize=function(E,O,$=!0){if(q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=E,L=O,e.width=Math.floor(E*W),e.height=Math.floor(O*W),$===!0&&(e.style.width=E+"px",e.style.height=O+"px"),this.setViewport(0,0,E,O)},this.getDrawingBufferSize=function(E){return E.set(z*W,L*W).floor()},this.setDrawingBufferSize=function(E,O,$){z=E,L=O,W=$,e.width=Math.floor(E*$),e.height=Math.floor(O*$),this.setViewport(0,0,E,O)},this.getCurrentViewport=function(E){return E.copy(M)},this.getViewport=function(E){return E.copy(et)},this.setViewport=function(E,O,$,X){E.isVector4?et.set(E.x,E.y,E.z,E.w):et.set(E,O,$,X),mt.viewport(M.copy(et).multiplyScalar(W).round())},this.getScissor=function(E){return E.copy(j)},this.setScissor=function(E,O,$,X){E.isVector4?j.set(E.x,E.y,E.z,E.w):j.set(E,O,$,X),mt.scissor(b.copy(j).multiplyScalar(W).round())},this.getScissorTest=function(){return xt},this.setScissorTest=function(E){mt.setScissorTest(xt=E)},this.setOpaqueSort=function(E){k=E},this.setTransparentSort=function(E){Y=E},this.getClearColor=function(E){return E.copy(Wt.getClearColor())},this.setClearColor=function(){Wt.setClearColor.apply(Wt,arguments)},this.getClearAlpha=function(){return Wt.getClearAlpha()},this.setClearAlpha=function(){Wt.setClearAlpha.apply(Wt,arguments)},this.clear=function(E=!0,O=!0,$=!0){let X=0;if(E){let F=!1;if(T!==null){const dt=T.texture.format;F=dt===yc||dt===Mc||dt===_c}if(F){const dt=T.texture.type,St=dt===ei||dt===Hi||dt===or||dt===Es||dt===xc||dt===vc,It=Wt.getClearColor(),Ut=Wt.getClearAlpha(),Gt=It.r,Vt=It.g,Ft=It.b;St?(p[0]=Gt,p[1]=Vt,p[2]=Ft,p[3]=Ut,R.clearBufferuiv(R.COLOR,0,p)):(x[0]=Gt,x[1]=Vt,x[2]=Ft,x[3]=Ut,R.clearBufferiv(R.COLOR,0,x))}else X|=R.COLOR_BUFFER_BIT}O&&(X|=R.DEPTH_BUFFER_BIT,R.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),$&&(X|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",rt,!1),e.removeEventListener("webglcontextrestored",yt,!1),e.removeEventListener("webglcontextcreationerror",Et,!1),Tt.dispose(),Qt.dispose(),wt.dispose(),w.dispose(),G.dispose(),tt.dispose(),me.dispose(),N.dispose(),Nt.dispose(),q.dispose(),q.removeEventListener("sessionstart",Jc),q.removeEventListener("sessionend",Qc),bi.stop()};function rt(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function yt(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const E=zt.autoReset,O=At.enabled,$=At.autoUpdate,X=At.needsUpdate,F=At.type;bt(),zt.autoReset=E,At.enabled=O,At.autoUpdate=$,At.needsUpdate=X,At.type=F}function Et(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function ne(E){const O=E.target;O.removeEventListener("dispose",ne),Le(O)}function Le(E){sn(E),wt.remove(E)}function sn(E){const O=wt.get(E).programs;O!==void 0&&(O.forEach(function($){Nt.releaseProgram($)}),E.isShaderMaterial&&Nt.releaseShaderCache(E))}this.renderBufferDirect=function(E,O,$,X,F,dt){O===null&&(O=Ht);const St=F.isMesh&&F.matrixWorld.determinant()<0,It=Lf(E,O,$,X,F);mt.setMaterial(X,St);let Ut=$.index,Gt=1;if(X.wireframe===!0){if(Ut=st.getWireframeAttribute($),Ut===void 0)return;Gt=2}const Vt=$.drawRange,Ft=$.attributes.position;let ce=Vt.start*Gt,ge=(Vt.start+Vt.count)*Gt;dt!==null&&(ce=Math.max(ce,dt.start*Gt),ge=Math.min(ge,(dt.start+dt.count)*Gt)),Ut!==null?(ce=Math.max(ce,0),ge=Math.min(ge,Ut.count)):Ft!=null&&(ce=Math.max(ce,0),ge=Math.min(ge,Ft.count));const be=ge-ce;if(be<0||be===1/0)return;me.setup(F,X,It,$,Ut);let hn,oe=Ct;if(Ut!==null&&(hn=Q.get(Ut),oe=te,oe.setIndex(hn)),F.isMesh)X.wireframe===!0?(mt.setLineWidth(X.wireframeLinewidth*J()),oe.setMode(R.LINES)):oe.setMode(R.TRIANGLES);else if(F.isLine){let kt=X.linewidth;kt===void 0&&(kt=1),mt.setLineWidth(kt*J()),F.isLineSegments?oe.setMode(R.LINES):F.isLineLoop?oe.setMode(R.LINE_LOOP):oe.setMode(R.LINE_STRIP)}else F.isPoints?oe.setMode(R.POINTS):F.isSprite&&oe.setMode(R.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)oe.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if(ft.get("WEBGL_multi_draw"))oe.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{const kt=F._multiDrawStarts,Ve=F._multiDrawCounts,ae=F._multiDrawCount,Sn=Ut?Q.get(Ut).bytesPerElement:1,Yi=wt.get(X).currentProgram.getUniforms();for(let un=0;un<ae;un++)Yi.setValue(R,"_gl_DrawID",un),oe.render(kt[un]/Sn,Ve[un])}else if(F.isInstancedMesh)oe.renderInstances(ce,be,F.count);else if($.isInstancedBufferGeometry){const kt=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,Ve=Math.min($.instanceCount,kt);oe.renderInstances(ce,be,Ve)}else oe.render(ce,be)};function se(E,O,$){E.transparent===!0&&E.side===Kn&&E.forceSinglePass===!1?(E.side=ln,E.needsUpdate=!0,br(E,O,$),E.side=Mi,E.needsUpdate=!0,br(E,O,$),E.side=Kn):br(E,O,$)}this.compile=function(E,O,$=null){$===null&&($=E),m=Qt.get($),m.init(O),y.push(m),$.traverseVisible(function(F){F.isLight&&F.layers.test(O.layers)&&(m.pushLight(F),F.castShadow&&m.pushShadow(F))}),E!==$&&E.traverseVisible(function(F){F.isLight&&F.layers.test(O.layers)&&(m.pushLight(F),F.castShadow&&m.pushShadow(F))}),m.setupLights();const X=new Set;return E.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;const dt=F.material;if(dt)if(Array.isArray(dt))for(let St=0;St<dt.length;St++){const It=dt[St];se(It,$,F),X.add(It)}else se(dt,$,F),X.add(dt)}),y.pop(),m=null,X},this.compileAsync=function(E,O,$=null){const X=this.compile(E,O,$);return new Promise(F=>{function dt(){if(X.forEach(function(St){wt.get(St).currentProgram.isReady()&&X.delete(St)}),X.size===0){F(E);return}setTimeout(dt,10)}ft.get("KHR_parallel_shader_compile")!==null?dt():setTimeout(dt,10)})};let rn=null;function Hn(E){rn&&rn(E)}function Jc(){bi.stop()}function Qc(){bi.start()}const bi=new ad;bi.setAnimationLoop(Hn),typeof self<"u"&&bi.setContext(self),this.setAnimationLoop=function(E){rn=E,q.setAnimationLoop(E),E===null?bi.stop():bi.start()},q.addEventListener("sessionstart",Jc),q.addEventListener("sessionend",Qc),this.render=function(E,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),q.enabled===!0&&q.isPresenting===!0&&(q.cameraAutoUpdate===!0&&q.updateCamera(O),O=q.getCamera()),E.isScene===!0&&E.onBeforeRender(_,E,O,T),m=Qt.get(E,y.length),m.init(O),y.push(m),at.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),Pt.setFromProjectionMatrix(at),K=this.localClippingEnabled,V=ut.init(this.clippingPlanes,K),v=Tt.get(E,g.length),v.init(),g.push(v),q.enabled===!0&&q.isPresenting===!0){const dt=_.xr.getDepthSensingMesh();dt!==null&&Qo(dt,O,-1/0,_.sortObjects)}Qo(E,O,0,_.sortObjects),v.finish(),_.sortObjects===!0&&v.sort(k,Y),Xt=q.enabled===!1||q.isPresenting===!1||q.hasDepthSensing()===!1,Xt&&Wt.addToRenderList(v,E),this.info.render.frame++,V===!0&&ut.beginShadows();const $=m.state.shadowsArray;At.render($,E,O),V===!0&&ut.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=v.opaque,F=v.transmissive;if(m.setupLights(),O.isArrayCamera){const dt=O.cameras;if(F.length>0)for(let St=0,It=dt.length;St<It;St++){const Ut=dt[St];eh(X,F,E,Ut)}Xt&&Wt.render(E);for(let St=0,It=dt.length;St<It;St++){const Ut=dt[St];th(v,E,Ut,Ut.viewport)}}else F.length>0&&eh(X,F,E,O),Xt&&Wt.render(E),th(v,E,O);T!==null&&(A.updateMultisampleRenderTarget(T),A.updateRenderTargetMipmap(T)),E.isScene===!0&&E.onAfterRender(_,E,O),me.resetDefaultState(),I=-1,Z=null,y.pop(),y.length>0?(m=y[y.length-1],V===!0&&ut.setGlobalState(_.clippingPlanes,m.state.camera)):m=null,g.pop(),g.length>0?v=g[g.length-1]:v=null};function Qo(E,O,$,X){if(E.visible===!1)return;if(E.layers.test(O.layers)){if(E.isGroup)$=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(O);else if(E.isLight)m.pushLight(E),E.castShadow&&m.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Pt.intersectsSprite(E)){X&&Ot.setFromMatrixPosition(E.matrixWorld).applyMatrix4(at);const St=tt.update(E),It=E.material;It.visible&&v.push(E,St,It,$,Ot.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Pt.intersectsObject(E))){const St=tt.update(E),It=E.material;if(X&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Ot.copy(E.boundingSphere.center)):(St.boundingSphere===null&&St.computeBoundingSphere(),Ot.copy(St.boundingSphere.center)),Ot.applyMatrix4(E.matrixWorld).applyMatrix4(at)),Array.isArray(It)){const Ut=St.groups;for(let Gt=0,Vt=Ut.length;Gt<Vt;Gt++){const Ft=Ut[Gt],ce=It[Ft.materialIndex];ce&&ce.visible&&v.push(E,St,ce,$,Ot.z,Ft)}}else It.visible&&v.push(E,St,It,$,Ot.z,null)}}const dt=E.children;for(let St=0,It=dt.length;St<It;St++)Qo(dt[St],O,$,X)}function th(E,O,$,X){const F=E.opaque,dt=E.transmissive,St=E.transparent;m.setupLightsView($),V===!0&&ut.setGlobalState(_.clippingPlanes,$),X&&mt.viewport(M.copy(X)),F.length>0&&wr(F,O,$),dt.length>0&&wr(dt,O,$),St.length>0&&wr(St,O,$),mt.buffers.depth.setTest(!0),mt.buffers.depth.setMask(!0),mt.buffers.color.setMask(!0),mt.setPolygonOffset(!1)}function eh(E,O,$,X){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[X.id]===void 0&&(m.state.transmissionRenderTarget[X.id]=new Gi(1,1,{generateMipmaps:!0,type:ft.has("EXT_color_buffer_half_float")||ft.has("EXT_color_buffer_float")?pr:ei,minFilter:Fi,samples:4,stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:le.workingColorSpace}));const dt=m.state.transmissionRenderTarget[X.id],St=X.viewport||M;dt.setSize(St.z,St.w);const It=_.getRenderTarget();_.setRenderTarget(dt),_.getClearColor(H),U=_.getClearAlpha(),U<1&&_.setClearColor(16777215,.5),_.clear(),Xt&&Wt.render($);const Ut=_.toneMapping;_.toneMapping=xi;const Gt=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),m.setupLightsView(X),V===!0&&ut.setGlobalState(_.clippingPlanes,X),wr(E,$,X),A.updateMultisampleRenderTarget(dt),A.updateRenderTargetMipmap(dt),ft.has("WEBGL_multisampled_render_to_texture")===!1){let Vt=!1;for(let Ft=0,ce=O.length;Ft<ce;Ft++){const ge=O[Ft],be=ge.object,hn=ge.geometry,oe=ge.material,kt=ge.group;if(oe.side===Kn&&be.layers.test(X.layers)){const Ve=oe.side;oe.side=ln,oe.needsUpdate=!0,nh(be,$,X,hn,oe,kt),oe.side=Ve,oe.needsUpdate=!0,Vt=!0}}Vt===!0&&(A.updateMultisampleRenderTarget(dt),A.updateRenderTargetMipmap(dt))}_.setRenderTarget(It),_.setClearColor(H,U),Gt!==void 0&&(X.viewport=Gt),_.toneMapping=Ut}function wr(E,O,$){const X=O.isScene===!0?O.overrideMaterial:null;for(let F=0,dt=E.length;F<dt;F++){const St=E[F],It=St.object,Ut=St.geometry,Gt=X===null?St.material:X,Vt=St.group;It.layers.test($.layers)&&nh(It,O,$,Ut,Gt,Vt)}}function nh(E,O,$,X,F,dt){E.onBeforeRender(_,O,$,X,F,dt),E.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),F.onBeforeRender(_,O,$,X,E,dt),F.transparent===!0&&F.side===Kn&&F.forceSinglePass===!1?(F.side=ln,F.needsUpdate=!0,_.renderBufferDirect($,O,X,F,E,dt),F.side=Mi,F.needsUpdate=!0,_.renderBufferDirect($,O,X,F,E,dt),F.side=Kn):_.renderBufferDirect($,O,X,F,E,dt),E.onAfterRender(_,O,$,X,F,dt)}function br(E,O,$){O.isScene!==!0&&(O=Ht);const X=wt.get(E),F=m.state.lights,dt=m.state.shadowsArray,St=F.state.version,It=Nt.getParameters(E,F.state,dt,O,$),Ut=Nt.getProgramCacheKey(It);let Gt=X.programs;X.environment=E.isMeshStandardMaterial?O.environment:null,X.fog=O.fog,X.envMap=(E.isMeshStandardMaterial?G:w).get(E.envMap||X.environment),X.envMapRotation=X.environment!==null&&E.envMap===null?O.environmentRotation:E.envMapRotation,Gt===void 0&&(E.addEventListener("dispose",ne),Gt=new Map,X.programs=Gt);let Vt=Gt.get(Ut);if(Vt!==void 0){if(X.currentProgram===Vt&&X.lightsStateVersion===St)return sh(E,It),Vt}else It.uniforms=Nt.getUniforms(E),E.onBeforeCompile(It,_),Vt=Nt.acquireProgram(It,Ut),Gt.set(Ut,Vt),X.uniforms=It.uniforms;const Ft=X.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ft.clippingPlanes=ut.uniform),sh(E,It),X.needsLights=Nf(E),X.lightsStateVersion=St,X.needsLights&&(Ft.ambientLightColor.value=F.state.ambient,Ft.lightProbe.value=F.state.probe,Ft.directionalLights.value=F.state.directional,Ft.directionalLightShadows.value=F.state.directionalShadow,Ft.spotLights.value=F.state.spot,Ft.spotLightShadows.value=F.state.spotShadow,Ft.rectAreaLights.value=F.state.rectArea,Ft.ltc_1.value=F.state.rectAreaLTC1,Ft.ltc_2.value=F.state.rectAreaLTC2,Ft.pointLights.value=F.state.point,Ft.pointLightShadows.value=F.state.pointShadow,Ft.hemisphereLights.value=F.state.hemi,Ft.directionalShadowMap.value=F.state.directionalShadowMap,Ft.directionalShadowMatrix.value=F.state.directionalShadowMatrix,Ft.spotShadowMap.value=F.state.spotShadowMap,Ft.spotLightMatrix.value=F.state.spotLightMatrix,Ft.spotLightMap.value=F.state.spotLightMap,Ft.pointShadowMap.value=F.state.pointShadowMap,Ft.pointShadowMatrix.value=F.state.pointShadowMatrix),X.currentProgram=Vt,X.uniformsList=null,Vt}function ih(E){if(E.uniformsList===null){const O=E.currentProgram.getUniforms();E.uniformsList=xo.seqWithValue(O.seq,E.uniforms)}return E.uniformsList}function sh(E,O){const $=wt.get(E);$.outputColorSpace=O.outputColorSpace,$.batching=O.batching,$.batchingColor=O.batchingColor,$.instancing=O.instancing,$.instancingColor=O.instancingColor,$.instancingMorph=O.instancingMorph,$.skinning=O.skinning,$.morphTargets=O.morphTargets,$.morphNormals=O.morphNormals,$.morphColors=O.morphColors,$.morphTargetsCount=O.morphTargetsCount,$.numClippingPlanes=O.numClippingPlanes,$.numIntersection=O.numClipIntersection,$.vertexAlphas=O.vertexAlphas,$.vertexTangents=O.vertexTangents,$.toneMapping=O.toneMapping}function Lf(E,O,$,X,F){O.isScene!==!0&&(O=Ht),A.resetTextureUnits();const dt=O.fog,St=X.isMeshStandardMaterial?O.environment:null,It=T===null?_.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:wi,Ut=(X.isMeshStandardMaterial?G:w).get(X.envMap||St),Gt=X.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,Vt=!!$.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ft=!!$.morphAttributes.position,ce=!!$.morphAttributes.normal,ge=!!$.morphAttributes.color;let be=xi;X.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(be=_.toneMapping);const hn=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,oe=hn!==void 0?hn.length:0,kt=wt.get(X),Ve=m.state.lights;if(V===!0&&(K===!0||E!==Z)){const vn=E===Z&&X.id===I;ut.setState(X,E,vn)}let ae=!1;X.version===kt.__version?(kt.needsLights&&kt.lightsStateVersion!==Ve.state.version||kt.outputColorSpace!==It||F.isBatchedMesh&&kt.batching===!1||!F.isBatchedMesh&&kt.batching===!0||F.isBatchedMesh&&kt.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&kt.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&kt.instancing===!1||!F.isInstancedMesh&&kt.instancing===!0||F.isSkinnedMesh&&kt.skinning===!1||!F.isSkinnedMesh&&kt.skinning===!0||F.isInstancedMesh&&kt.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&kt.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&kt.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&kt.instancingMorph===!1&&F.morphTexture!==null||kt.envMap!==Ut||X.fog===!0&&kt.fog!==dt||kt.numClippingPlanes!==void 0&&(kt.numClippingPlanes!==ut.numPlanes||kt.numIntersection!==ut.numIntersection)||kt.vertexAlphas!==Gt||kt.vertexTangents!==Vt||kt.morphTargets!==Ft||kt.morphNormals!==ce||kt.morphColors!==ge||kt.toneMapping!==be||kt.morphTargetsCount!==oe)&&(ae=!0):(ae=!0,kt.__version=X.version);let Sn=kt.currentProgram;ae===!0&&(Sn=br(X,O,F));let Yi=!1,un=!1,ta=!1;const Re=Sn.getUniforms(),si=kt.uniforms;if(mt.useProgram(Sn.program)&&(Yi=!0,un=!0,ta=!0),X.id!==I&&(I=X.id,un=!0),Yi||Z!==E){ct.reverseDepthBuffer?(lt.copy(E.projectionMatrix),Rp(lt),Pp(lt),Re.setValue(R,"projectionMatrix",lt)):Re.setValue(R,"projectionMatrix",E.projectionMatrix),Re.setValue(R,"viewMatrix",E.matrixWorldInverse);const vn=Re.map.cameraPosition;vn!==void 0&&vn.setValue(R,Rt.setFromMatrixPosition(E.matrixWorld)),ct.logarithmicDepthBuffer&&Re.setValue(R,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&Re.setValue(R,"isOrthographic",E.isOrthographicCamera===!0),Z!==E&&(Z=E,un=!0,ta=!0)}if(F.isSkinnedMesh){Re.setOptional(R,F,"bindMatrix"),Re.setOptional(R,F,"bindMatrixInverse");const vn=F.skeleton;vn&&(vn.boneTexture===null&&vn.computeBoneTexture(),Re.setValue(R,"boneTexture",vn.boneTexture,A))}F.isBatchedMesh&&(Re.setOptional(R,F,"batchingTexture"),Re.setValue(R,"batchingTexture",F._matricesTexture,A),Re.setOptional(R,F,"batchingIdTexture"),Re.setValue(R,"batchingIdTexture",F._indirectTexture,A),Re.setOptional(R,F,"batchingColorTexture"),F._colorsTexture!==null&&Re.setValue(R,"batchingColorTexture",F._colorsTexture,A));const ea=$.morphAttributes;if((ea.position!==void 0||ea.normal!==void 0||ea.color!==void 0)&&$t.update(F,$,Sn),(un||kt.receiveShadow!==F.receiveShadow)&&(kt.receiveShadow=F.receiveShadow,Re.setValue(R,"receiveShadow",F.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(si.envMap.value=Ut,si.flipEnvMap.value=Ut.isCubeTexture&&Ut.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&O.environment!==null&&(si.envMapIntensity.value=O.environmentIntensity),un&&(Re.setValue(R,"toneMappingExposure",_.toneMappingExposure),kt.needsLights&&Df(si,ta),dt&&X.fog===!0&&vt.refreshFogUniforms(si,dt),vt.refreshMaterialUniforms(si,X,W,L,m.state.transmissionRenderTarget[E.id]),xo.upload(R,ih(kt),si,A)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(xo.upload(R,ih(kt),si,A),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&Re.setValue(R,"center",F.center),Re.setValue(R,"modelViewMatrix",F.modelViewMatrix),Re.setValue(R,"normalMatrix",F.normalMatrix),Re.setValue(R,"modelMatrix",F.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const vn=X.uniformsGroups;for(let na=0,Uf=vn.length;na<Uf;na++){const rh=vn[na];N.update(rh,Sn),N.bind(rh,Sn)}}return Sn}function Df(E,O){E.ambientLightColor.needsUpdate=O,E.lightProbe.needsUpdate=O,E.directionalLights.needsUpdate=O,E.directionalLightShadows.needsUpdate=O,E.pointLights.needsUpdate=O,E.pointLightShadows.needsUpdate=O,E.spotLights.needsUpdate=O,E.spotLightShadows.needsUpdate=O,E.rectAreaLights.needsUpdate=O,E.hemisphereLights.needsUpdate=O}function Nf(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(E,O,$){wt.get(E.texture).__webglTexture=O,wt.get(E.depthTexture).__webglTexture=$;const X=wt.get(E);X.__hasExternalTextures=!0,X.__autoAllocateDepthBuffer=$===void 0,X.__autoAllocateDepthBuffer||ft.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),X.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,O){const $=wt.get(E);$.__webglFramebuffer=O,$.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(E,O=0,$=0){T=E,P=O,C=$;let X=!0,F=null,dt=!1,St=!1;if(E){const Ut=wt.get(E);if(Ut.__useDefaultFramebuffer!==void 0)mt.bindFramebuffer(R.FRAMEBUFFER,null),X=!1;else if(Ut.__webglFramebuffer===void 0)A.setupRenderTarget(E);else if(Ut.__hasExternalTextures)A.rebindTextures(E,wt.get(E.texture).__webglTexture,wt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Ft=E.depthTexture;if(Ut.__boundDepthTexture!==Ft){if(Ft!==null&&wt.has(Ft)&&(E.width!==Ft.image.width||E.height!==Ft.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");A.setupDepthRenderbuffer(E)}}const Gt=E.texture;(Gt.isData3DTexture||Gt.isDataArrayTexture||Gt.isCompressedArrayTexture)&&(St=!0);const Vt=wt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Vt[O])?F=Vt[O][$]:F=Vt[O],dt=!0):E.samples>0&&A.useMultisampledRTT(E)===!1?F=wt.get(E).__webglMultisampledFramebuffer:Array.isArray(Vt)?F=Vt[$]:F=Vt,M.copy(E.viewport),b.copy(E.scissor),B=E.scissorTest}else M.copy(et).multiplyScalar(W).floor(),b.copy(j).multiplyScalar(W).floor(),B=xt;if(mt.bindFramebuffer(R.FRAMEBUFFER,F)&&X&&mt.drawBuffers(E,F),mt.viewport(M),mt.scissor(b),mt.setScissorTest(B),dt){const Ut=wt.get(E.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+O,Ut.__webglTexture,$)}else if(St){const Ut=wt.get(E.texture),Gt=O||0;R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,Ut.__webglTexture,$||0,Gt)}I=-1},this.readRenderTargetPixels=function(E,O,$,X,F,dt,St){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let It=wt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&St!==void 0&&(It=It[St]),It){mt.bindFramebuffer(R.FRAMEBUFFER,It);try{const Ut=E.texture,Gt=Ut.format,Vt=Ut.type;if(!ct.textureFormatReadable(Gt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ct.textureTypeReadable(Vt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=E.width-X&&$>=0&&$<=E.height-F&&R.readPixels(O,$,X,F,qt.convert(Gt),qt.convert(Vt),dt)}finally{const Ut=T!==null?wt.get(T).__webglFramebuffer:null;mt.bindFramebuffer(R.FRAMEBUFFER,Ut)}}},this.readRenderTargetPixelsAsync=async function(E,O,$,X,F,dt,St){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let It=wt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&St!==void 0&&(It=It[St]),It){const Ut=E.texture,Gt=Ut.format,Vt=Ut.type;if(!ct.textureFormatReadable(Gt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ct.textureTypeReadable(Vt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=E.width-X&&$>=0&&$<=E.height-F){mt.bindFramebuffer(R.FRAMEBUFFER,It);const Ft=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,Ft),R.bufferData(R.PIXEL_PACK_BUFFER,dt.byteLength,R.STREAM_READ),R.readPixels(O,$,X,F,qt.convert(Gt),qt.convert(Vt),0);const ce=T!==null?wt.get(T).__webglFramebuffer:null;mt.bindFramebuffer(R.FRAMEBUFFER,ce);const ge=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await Cp(R,ge,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,Ft),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,dt),R.deleteBuffer(Ft),R.deleteSync(ge),dt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,O=null,$=0){E.isTexture!==!0&&(go("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,E=arguments[1]);const X=Math.pow(2,-$),F=Math.floor(E.image.width*X),dt=Math.floor(E.image.height*X),St=O!==null?O.x:0,It=O!==null?O.y:0;A.setTexture2D(E,0),R.copyTexSubImage2D(R.TEXTURE_2D,$,0,0,St,It,F,dt),mt.unbindTexture()},this.copyTextureToTexture=function(E,O,$=null,X=null,F=0){E.isTexture!==!0&&(go("WebGLRenderer: copyTextureToTexture function signature has changed."),X=arguments[0]||null,E=arguments[1],O=arguments[2],F=arguments[3]||0,$=null);let dt,St,It,Ut,Gt,Vt;$!==null?(dt=$.max.x-$.min.x,St=$.max.y-$.min.y,It=$.min.x,Ut=$.min.y):(dt=E.image.width,St=E.image.height,It=0,Ut=0),X!==null?(Gt=X.x,Vt=X.y):(Gt=0,Vt=0);const Ft=qt.convert(O.format),ce=qt.convert(O.type);A.setTexture2D(O,0),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,O.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,O.unpackAlignment);const ge=R.getParameter(R.UNPACK_ROW_LENGTH),be=R.getParameter(R.UNPACK_IMAGE_HEIGHT),hn=R.getParameter(R.UNPACK_SKIP_PIXELS),oe=R.getParameter(R.UNPACK_SKIP_ROWS),kt=R.getParameter(R.UNPACK_SKIP_IMAGES),Ve=E.isCompressedTexture?E.mipmaps[F]:E.image;R.pixelStorei(R.UNPACK_ROW_LENGTH,Ve.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,Ve.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,It),R.pixelStorei(R.UNPACK_SKIP_ROWS,Ut),E.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,F,Gt,Vt,dt,St,Ft,ce,Ve.data):E.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,F,Gt,Vt,Ve.width,Ve.height,Ft,Ve.data):R.texSubImage2D(R.TEXTURE_2D,F,Gt,Vt,dt,St,Ft,ce,Ve),R.pixelStorei(R.UNPACK_ROW_LENGTH,ge),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,be),R.pixelStorei(R.UNPACK_SKIP_PIXELS,hn),R.pixelStorei(R.UNPACK_SKIP_ROWS,oe),R.pixelStorei(R.UNPACK_SKIP_IMAGES,kt),F===0&&O.generateMipmaps&&R.generateMipmap(R.TEXTURE_2D),mt.unbindTexture()},this.copyTextureToTexture3D=function(E,O,$=null,X=null,F=0){E.isTexture!==!0&&(go("WebGLRenderer: copyTextureToTexture3D function signature has changed."),$=arguments[0]||null,X=arguments[1]||null,E=arguments[2],O=arguments[3],F=arguments[4]||0);let dt,St,It,Ut,Gt,Vt,Ft,ce,ge;const be=E.isCompressedTexture?E.mipmaps[F]:E.image;$!==null?(dt=$.max.x-$.min.x,St=$.max.y-$.min.y,It=$.max.z-$.min.z,Ut=$.min.x,Gt=$.min.y,Vt=$.min.z):(dt=be.width,St=be.height,It=be.depth,Ut=0,Gt=0,Vt=0),X!==null?(Ft=X.x,ce=X.y,ge=X.z):(Ft=0,ce=0,ge=0);const hn=qt.convert(O.format),oe=qt.convert(O.type);let kt;if(O.isData3DTexture)A.setTexture3D(O,0),kt=R.TEXTURE_3D;else if(O.isDataArrayTexture||O.isCompressedArrayTexture)A.setTexture2DArray(O,0),kt=R.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,O.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,O.unpackAlignment);const Ve=R.getParameter(R.UNPACK_ROW_LENGTH),ae=R.getParameter(R.UNPACK_IMAGE_HEIGHT),Sn=R.getParameter(R.UNPACK_SKIP_PIXELS),Yi=R.getParameter(R.UNPACK_SKIP_ROWS),un=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,be.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,be.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Ut),R.pixelStorei(R.UNPACK_SKIP_ROWS,Gt),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Vt),E.isDataTexture||E.isData3DTexture?R.texSubImage3D(kt,F,Ft,ce,ge,dt,St,It,hn,oe,be.data):O.isCompressedArrayTexture?R.compressedTexSubImage3D(kt,F,Ft,ce,ge,dt,St,It,hn,be.data):R.texSubImage3D(kt,F,Ft,ce,ge,dt,St,It,hn,oe,be),R.pixelStorei(R.UNPACK_ROW_LENGTH,Ve),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,ae),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Sn),R.pixelStorei(R.UNPACK_SKIP_ROWS,Yi),R.pixelStorei(R.UNPACK_SKIP_IMAGES,un),F===0&&O.generateMipmaps&&R.generateMipmap(kt),mt.unbindTexture()},this.initRenderTarget=function(E){wt.get(E).__webglFramebuffer===void 0&&A.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?A.setTextureCube(E,0):E.isData3DTexture?A.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?A.setTexture2DArray(E,0):A.setTexture2D(E,0),mt.unbindTexture()},this.resetState=function(){P=0,C=0,T=null,mt.reset(),me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Qn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Sc?"display-p3":"srgb",e.unpackColorSpace=le.workingColorSpace===Vo?"display-p3":"srgb"}}class Hv extends ke{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Un,this.environmentIntensity=1,this.environmentRotation=new Un,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Gv extends tn{constructor(t=null,e=1,i=1,r,o,a,l,c,h=Qe,u=Qe,f,d){super(null,a,l,c,h,u,r,o,f,d),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Os extends Wi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Yt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Po=new D,Io=new D,tu=new pe,qs=new Wo,Xr=new xr,Na=new D,eu=new D;class Tc extends ke{constructor(t=new Se,e=new Os){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let r=1,o=e.count;r<o;r++)Po.fromBufferAttribute(e,r-1),Io.fromBufferAttribute(e,r),i[r]=i[r-1],i[r]+=Po.distanceTo(Io);t.setAttribute("lineDistance",new ee(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,r=this.matrixWorld,o=t.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Xr.copy(i.boundingSphere),Xr.applyMatrix4(r),Xr.radius+=o,t.ray.intersectsSphere(Xr)===!1)return;tu.copy(r).invert(),qs.copy(t.ray).applyMatrix4(tu);const l=o/((this.scale.x+this.scale.y+this.scale.z)/3),c=l*l,h=this.isLineSegments?2:1,u=i.index,d=i.attributes.position;if(u!==null){const p=Math.max(0,a.start),x=Math.min(u.count,a.start+a.count);for(let v=p,m=x-1;v<m;v+=h){const g=u.getX(v),y=u.getX(v+1),_=qr(this,t,qs,c,g,y);_&&e.push(_)}if(this.isLineLoop){const v=u.getX(x-1),m=u.getX(p),g=qr(this,t,qs,c,v,m);g&&e.push(g)}}else{const p=Math.max(0,a.start),x=Math.min(d.count,a.start+a.count);for(let v=p,m=x-1;v<m;v+=h){const g=qr(this,t,qs,c,v,v+1);g&&e.push(g)}if(this.isLineLoop){const v=qr(this,t,qs,c,x-1,p);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const r=e[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=r.length;o<a;o++){const l=r[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=o}}}}}function qr(n,t,e,i,r,o){const a=n.geometry.attributes.position;if(Po.fromBufferAttribute(a,r),Io.fromBufferAttribute(a,o),e.distanceSqToSegment(Po,Io,Na,eu)>i)return;Na.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Na);if(!(c<t.near||c>t.far))return{distance:c,point:eu.clone().applyMatrix4(n.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:n}}const nu=new D,iu=new D;class Ac extends Tc{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let r=0,o=e.count;r<o;r+=2)nu.fromBufferAttribute(e,r),iu.fromBufferAttribute(e,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+nu.distanceTo(iu);t.setAttribute("lineDistance",new ee(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Vv extends Tc{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}}class pd extends Wi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Yt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const su=new pe,Yl=new Wo,Yr=new xr,jr=new D;class Wv extends ke{constructor(t=new Se,e=new pd){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const i=this.geometry,r=this.matrixWorld,o=t.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Yr.copy(i.boundingSphere),Yr.applyMatrix4(r),Yr.radius+=o,t.ray.intersectsSphere(Yr)===!1)return;su.copy(r).invert(),Yl.copy(t.ray).applyMatrix4(su);const l=o/((this.scale.x+this.scale.y+this.scale.z)/3),c=l*l,h=i.index,f=i.attributes.position;if(h!==null){const d=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let x=d,v=p;x<v;x++){const m=h.getX(x);jr.fromBufferAttribute(f,m),ru(jr,m,c,r,t,e,this)}}else{const d=Math.max(0,a.start),p=Math.min(f.count,a.start+a.count);for(let x=d,v=p;x<v;x++)jr.fromBufferAttribute(f,x),ru(jr,x,c,r,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const r=e[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=r.length;o<a;o++){const l=r[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=o}}}}}function ru(n,t,e,i,r,o,a){const l=Yl.distanceSqToPoint(n);if(l<e){const c=new D;Yl.closestPointToPoint(n,c),c.applyMatrix4(i);const h=r.ray.origin.distanceTo(c);if(h<r.near||h>r.far)return;o.push({distance:h,distanceToRay:Math.sqrt(l),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class Bn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,r=this.getPoint(0),o=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),o+=i.distanceTo(r),e.push(o),r=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let r=0;const o=i.length;let a;e?a=e:a=t*i[o-1];let l=0,c=o-1,h;for(;l<=c;)if(r=Math.floor(l+(c-l)/2),h=i[r]-a,h<0)l=r+1;else if(h>0)c=r-1;else{c=r;break}if(r=c,i[r]===a)return r/(o-1);const u=i[r],d=i[r+1]-u,p=(a-u)/d;return(r+p)/(o-1)}getTangent(t,e){let r=t-1e-4,o=t+1e-4;r<0&&(r=0),o>1&&(o=1);const a=this.getPoint(r),l=this.getPoint(o),c=e||(a.isVector2?new ht:new D);return c.copy(l).sub(a).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new D,r=[],o=[],a=[],l=new D,c=new pe;for(let p=0;p<=t;p++){const x=p/t;r[p]=this.getTangentAt(x,new D)}o[0]=new D,a[0]=new D;let h=Number.MAX_VALUE;const u=Math.abs(r[0].x),f=Math.abs(r[0].y),d=Math.abs(r[0].z);u<=h&&(h=u,i.set(1,0,0)),f<=h&&(h=f,i.set(0,1,0)),d<=h&&i.set(0,0,1),l.crossVectors(r[0],i).normalize(),o[0].crossVectors(r[0],l),a[0].crossVectors(r[0],o[0]);for(let p=1;p<=t;p++){if(o[p]=o[p-1].clone(),a[p]=a[p-1].clone(),l.crossVectors(r[p-1],r[p]),l.length()>Number.EPSILON){l.normalize();const x=Math.acos($e(r[p-1].dot(r[p]),-1,1));o[p].applyMatrix4(c.makeRotationAxis(l,x))}a[p].crossVectors(r[p],o[p])}if(e===!0){let p=Math.acos($e(o[0].dot(o[t]),-1,1));p/=t,r[0].dot(l.crossVectors(o[0],o[t]))>0&&(p=-p);for(let x=1;x<=t;x++)o[x].applyMatrix4(c.makeRotationAxis(r[x],p*x)),a[x].crossVectors(r[x],o[x])}return{tangents:r,normals:o,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Cc extends Bn{constructor(t=0,e=0,i=1,r=1,o=0,a=Math.PI*2,l=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=r,this.aStartAngle=o,this.aEndAngle=a,this.aClockwise=l,this.aRotation=c}getPoint(t,e=new ht){const i=e,r=Math.PI*2;let o=this.aEndAngle-this.aStartAngle;const a=Math.abs(o)<Number.EPSILON;for(;o<0;)o+=r;for(;o>r;)o-=r;o<Number.EPSILON&&(a?o=0:o=r),this.aClockwise===!0&&!a&&(o===r?o=-r:o=o-r);const l=this.aStartAngle+t*o;let c=this.aX+this.xRadius*Math.cos(l),h=this.aY+this.yRadius*Math.sin(l);if(this.aRotation!==0){const u=Math.cos(this.aRotation),f=Math.sin(this.aRotation),d=c-this.aX,p=h-this.aY;c=d*u-p*f+this.aX,h=d*f+p*u+this.aY}return i.set(c,h)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class $v extends Cc{constructor(t,e,i,r,o,a){super(t,e,i,i,r,o,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Rc(){let n=0,t=0,e=0,i=0;function r(o,a,l,c){n=o,t=l,e=-3*o+3*a-2*l-c,i=2*o-2*a+l+c}return{initCatmullRom:function(o,a,l,c,h){r(a,l,h*(l-o),h*(c-a))},initNonuniformCatmullRom:function(o,a,l,c,h,u,f){let d=(a-o)/h-(l-o)/(h+u)+(l-a)/u,p=(l-a)/u-(c-a)/(u+f)+(c-l)/f;d*=u,p*=u,r(a,l,d,p)},calc:function(o){const a=o*o,l=a*o;return n+t*o+e*a+i*l}}}const Zr=new D,Ua=new Rc,Oa=new Rc,Fa=new Rc;class Xv extends Bn{constructor(t=[],e=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=r}getPoint(t,e=new D){const i=e,r=this.points,o=r.length,a=(o-(this.closed?0:1))*t;let l=Math.floor(a),c=a-l;this.closed?l+=l>0?0:(Math.floor(Math.abs(l)/o)+1)*o:c===0&&l===o-1&&(l=o-2,c=1);let h,u;this.closed||l>0?h=r[(l-1)%o]:(Zr.subVectors(r[0],r[1]).add(r[0]),h=Zr);const f=r[l%o],d=r[(l+1)%o];if(this.closed||l+2<o?u=r[(l+2)%o]:(Zr.subVectors(r[o-1],r[o-2]).add(r[o-1]),u=Zr),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let x=Math.pow(h.distanceToSquared(f),p),v=Math.pow(f.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(u),p);v<1e-4&&(v=1),x<1e-4&&(x=v),m<1e-4&&(m=v),Ua.initNonuniformCatmullRom(h.x,f.x,d.x,u.x,x,v,m),Oa.initNonuniformCatmullRom(h.y,f.y,d.y,u.y,x,v,m),Fa.initNonuniformCatmullRom(h.z,f.z,d.z,u.z,x,v,m)}else this.curveType==="catmullrom"&&(Ua.initCatmullRom(h.x,f.x,d.x,u.x,this.tension),Oa.initCatmullRom(h.y,f.y,d.y,u.y,this.tension),Fa.initCatmullRom(h.z,f.z,d.z,u.z,this.tension));return i.set(Ua.calc(c),Oa.calc(c),Fa.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const r=t.points[e];this.points.push(r.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const r=this.points[e];t.points.push(r.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const r=t.points[e];this.points.push(new D().fromArray(r))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function ou(n,t,e,i,r){const o=(i-t)*.5,a=(r-e)*.5,l=n*n,c=n*l;return(2*e-2*i+o+a)*c+(-3*e+3*i-2*o-a)*l+o*n+e}function qv(n,t){const e=1-n;return e*e*t}function Yv(n,t){return 2*(1-n)*n*t}function jv(n,t){return n*n*t}function er(n,t,e,i){return qv(n,t)+Yv(n,e)+jv(n,i)}function Zv(n,t){const e=1-n;return e*e*e*t}function Kv(n,t){const e=1-n;return 3*e*e*n*t}function Jv(n,t){return 3*(1-n)*n*n*t}function Qv(n,t){return n*n*n*t}function nr(n,t,e,i,r){return Zv(n,t)+Kv(n,e)+Jv(n,i)+Qv(n,r)}class md extends Bn{constructor(t=new ht,e=new ht,i=new ht,r=new ht){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=r}getPoint(t,e=new ht){const i=e,r=this.v0,o=this.v1,a=this.v2,l=this.v3;return i.set(nr(t,r.x,o.x,a.x,l.x),nr(t,r.y,o.y,a.y,l.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class t_ extends Bn{constructor(t=new D,e=new D,i=new D,r=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=r}getPoint(t,e=new D){const i=e,r=this.v0,o=this.v1,a=this.v2,l=this.v3;return i.set(nr(t,r.x,o.x,a.x,l.x),nr(t,r.y,o.y,a.y,l.y),nr(t,r.z,o.z,a.z,l.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class gd extends Bn{constructor(t=new ht,e=new ht){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ht){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ht){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class e_ extends Bn{constructor(t=new D,e=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new D){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new D){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class xd extends Bn{constructor(t=new ht,e=new ht,i=new ht){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new ht){const i=e,r=this.v0,o=this.v1,a=this.v2;return i.set(er(t,r.x,o.x,a.x),er(t,r.y,o.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class n_ extends Bn{constructor(t=new D,e=new D,i=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new D){const i=e,r=this.v0,o=this.v1,a=this.v2;return i.set(er(t,r.x,o.x,a.x),er(t,r.y,o.y,a.y),er(t,r.z,o.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class vd extends Bn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ht){const i=e,r=this.points,o=(r.length-1)*t,a=Math.floor(o),l=o-a,c=r[a===0?a:a-1],h=r[a],u=r[a>r.length-2?r.length-1:a+1],f=r[a>r.length-3?r.length-1:a+2];return i.set(ou(l,c.x,h.x,u.x,f.x),ou(l,c.y,h.y,u.y,f.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const r=t.points[e];this.points.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const r=this.points[e];t.points.push(r.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const r=t.points[e];this.points.push(new ht().fromArray(r))}return this}}var jl=Object.freeze({__proto__:null,ArcCurve:$v,CatmullRomCurve3:Xv,CubicBezierCurve:md,CubicBezierCurve3:t_,EllipseCurve:Cc,LineCurve:gd,LineCurve3:e_,QuadraticBezierCurve:xd,QuadraticBezierCurve3:n_,SplineCurve:vd});class i_ extends Bn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new jl[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),r=this.getCurveLengths();let o=0;for(;o<r.length;){if(r[o]>=i){const a=r[o]-i,l=this.curves[o],c=l.getLength(),h=c===0?0:1-a/c;return l.getPointAt(h,e)}o++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,r=this.curves.length;i<r;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let r=0,o=this.curves;r<o.length;r++){const a=o[r],l=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(l);for(let h=0;h<c.length;h++){const u=c[h];i&&i.equals(u)||(e.push(u),i=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const r=t.curves[e];this.curves.push(r.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const r=this.curves[e];t.curves.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const r=t.curves[e];this.curves.push(new jl[r.type]().fromJSON(r))}return this}}class au extends i_{constructor(t){super(),this.type="Path",this.currentPoint=new ht,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new gd(this.currentPoint.clone(),new ht(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,r){const o=new xd(this.currentPoint.clone(),new ht(t,e),new ht(i,r));return this.curves.push(o),this.currentPoint.set(i,r),this}bezierCurveTo(t,e,i,r,o,a){const l=new md(this.currentPoint.clone(),new ht(t,e),new ht(i,r),new ht(o,a));return this.curves.push(l),this.currentPoint.set(o,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new vd(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,r,o,a){const l=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+l,e+c,i,r,o,a),this}absarc(t,e,i,r,o,a){return this.absellipse(t,e,i,i,r,o,a),this}ellipse(t,e,i,r,o,a,l,c){const h=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+h,e+u,i,r,o,a,l,c),this}absellipse(t,e,i,r,o,a,l,c){const h=new Cc(t,e,i,r,o,a,l,c);if(this.curves.length>0){const f=h.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(h);const u=h.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Xo extends Se{constructor(t=[new ht(0,-.5),new ht(.5,0),new ht(0,.5)],e=12,i=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:i,phiLength:r},e=Math.floor(e),r=$e(r,0,Math.PI*2);const o=[],a=[],l=[],c=[],h=[],u=1/e,f=new D,d=new ht,p=new D,x=new D,v=new D;let m=0,g=0;for(let y=0;y<=t.length-1;y++)switch(y){case 0:m=t[y+1].x-t[y].x,g=t[y+1].y-t[y].y,p.x=g*1,p.y=-m,p.z=g*0,v.copy(p),p.normalize(),c.push(p.x,p.y,p.z);break;case t.length-1:c.push(v.x,v.y,v.z);break;default:m=t[y+1].x-t[y].x,g=t[y+1].y-t[y].y,p.x=g*1,p.y=-m,p.z=g*0,x.copy(p),p.x+=v.x,p.y+=v.y,p.z+=v.z,p.normalize(),c.push(p.x,p.y,p.z),v.copy(x)}for(let y=0;y<=e;y++){const _=i+y*u*r,S=Math.sin(_),P=Math.cos(_);for(let C=0;C<=t.length-1;C++){f.x=t[C].x*S,f.y=t[C].y,f.z=t[C].x*P,a.push(f.x,f.y,f.z),d.x=y/e,d.y=C/(t.length-1),l.push(d.x,d.y);const T=c[3*C+0]*S,I=c[3*C+1],Z=c[3*C+0]*P;h.push(T,I,Z)}}for(let y=0;y<e;y++)for(let _=0;_<t.length-1;_++){const S=_+y*t.length,P=S,C=S+t.length,T=S+t.length+1,I=S+1;o.push(P,C,I),o.push(T,I,C)}this.setIndex(o),this.setAttribute("position",new ee(a,3)),this.setAttribute("uv",new ee(l,2)),this.setAttribute("normal",new ee(h,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xo(t.points,t.segments,t.phiStart,t.phiLength)}}class qo extends Se{constructor(t=1,e=32,i=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:r},e=Math.max(3,e);const o=[],a=[],l=[],c=[],h=new D,u=new ht;a.push(0,0,0),l.push(0,0,1),c.push(.5,.5);for(let f=0,d=3;f<=e;f++,d+=3){const p=i+f/e*r;h.x=t*Math.cos(p),h.y=t*Math.sin(p),a.push(h.x,h.y,h.z),l.push(0,0,1),u.x=(a[d]/t+1)/2,u.y=(a[d+1]/t+1)/2,c.push(u.x,u.y)}for(let f=1;f<=e;f++)o.push(f,f+1,0);this.setIndex(o),this.setAttribute("position",new ee(a,3)),this.setAttribute("normal",new ee(l,3)),this.setAttribute("uv",new ee(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qo(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class cn extends Se{constructor(t=1,e=1,i=1,r=32,o=1,a=!1,l=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:r,heightSegments:o,openEnded:a,thetaStart:l,thetaLength:c};const h=this;r=Math.floor(r),o=Math.floor(o);const u=[],f=[],d=[],p=[];let x=0;const v=[],m=i/2;let g=0;y(),a===!1&&(t>0&&_(!0),e>0&&_(!1)),this.setIndex(u),this.setAttribute("position",new ee(f,3)),this.setAttribute("normal",new ee(d,3)),this.setAttribute("uv",new ee(p,2));function y(){const S=new D,P=new D;let C=0;const T=(e-t)/i;for(let I=0;I<=o;I++){const Z=[],M=I/o,b=M*(e-t)+t;for(let B=0;B<=r;B++){const H=B/r,U=H*c+l,z=Math.sin(U),L=Math.cos(U);P.x=b*z,P.y=-M*i+m,P.z=b*L,f.push(P.x,P.y,P.z),S.set(z,T,L).normalize(),d.push(S.x,S.y,S.z),p.push(H,1-M),Z.push(x++)}v.push(Z)}for(let I=0;I<r;I++)for(let Z=0;Z<o;Z++){const M=v[Z][I],b=v[Z+1][I],B=v[Z+1][I+1],H=v[Z][I+1];t>0&&(u.push(M,b,H),C+=3),e>0&&(u.push(b,B,H),C+=3)}h.addGroup(g,C,0),g+=C}function _(S){const P=x,C=new ht,T=new D;let I=0;const Z=S===!0?t:e,M=S===!0?1:-1;for(let B=1;B<=r;B++)f.push(0,m*M,0),d.push(0,M,0),p.push(.5,.5),x++;const b=x;for(let B=0;B<=r;B++){const U=B/r*c+l,z=Math.cos(U),L=Math.sin(U);T.x=Z*L,T.y=m*M,T.z=Z*z,f.push(T.x,T.y,T.z),d.push(0,M,0),C.x=z*.5+.5,C.y=L*.5*M+.5,p.push(C.x,C.y),x++}for(let B=0;B<r;B++){const H=P+B,U=b+B;S===!0?u.push(U,U+1,H):u.push(U+1,U,H),I+=3}h.addGroup(g,I,S===!0?1:2),g+=I}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new cn(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ar extends au{constructor(t){super(t),this.uuid=Ns(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,r=this.holes.length;i<r;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const r=t.holes[e];this.holes.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const r=this.holes[e];t.holes.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const r=t.holes[e];this.holes.push(new au().fromJSON(r))}return this}}const s_={triangulate:function(n,t,e=2){const i=t&&t.length,r=i?t[0]*e:n.length;let o=_d(n,0,r,e,!0);const a=[];if(!o||o.next===o.prev)return a;let l,c,h,u,f,d,p;if(i&&(o=c_(n,t,o,e)),n.length>80*e){l=h=n[0],c=u=n[1];for(let x=e;x<r;x+=e)f=n[x],d=n[x+1],f<l&&(l=f),d<c&&(c=d),f>h&&(h=f),d>u&&(u=d);p=Math.max(h-l,u-c),p=p!==0?32767/p:0}return lr(o,a,e,l,c,p,0),a}};function _d(n,t,e,i,r){let o,a;if(r===M_(n,t,e,i)>0)for(o=t;o<e;o+=i)a=lu(o,n[o],n[o+1],a);else for(o=e-i;o>=t;o-=i)a=lu(o,n[o],n[o+1],a);return a&&Yo(a,a.next)&&(hr(a),a=a.next),a}function Vi(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(Yo(e,e.next)||we(e.prev,e,e.next)===0)){if(hr(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function lr(n,t,e,i,r,o,a){if(!n)return;!a&&o&&p_(n,i,r,o);let l=n,c,h;for(;n.prev!==n.next;){if(c=n.prev,h=n.next,o?o_(n,i,r,o):r_(n)){t.push(c.i/e|0),t.push(n.i/e|0),t.push(h.i/e|0),hr(n),n=h.next,l=h.next;continue}if(n=h,n===l){a?a===1?(n=a_(Vi(n),t,e),lr(n,t,e,i,r,o,2)):a===2&&l_(n,t,e,i,r,o):lr(Vi(n),t,e,i,r,o,1);break}}}function r_(n){const t=n.prev,e=n,i=n.next;if(we(t,e,i)>=0)return!1;const r=t.x,o=e.x,a=i.x,l=t.y,c=e.y,h=i.y,u=r<o?r<a?r:a:o<a?o:a,f=l<c?l<h?l:h:c<h?c:h,d=r>o?r>a?r:a:o>a?o:a,p=l>c?l>h?l:h:c>h?c:h;let x=i.next;for(;x!==t;){if(x.x>=u&&x.x<=d&&x.y>=f&&x.y<=p&&ds(r,l,o,c,a,h,x.x,x.y)&&we(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function o_(n,t,e,i){const r=n.prev,o=n,a=n.next;if(we(r,o,a)>=0)return!1;const l=r.x,c=o.x,h=a.x,u=r.y,f=o.y,d=a.y,p=l<c?l<h?l:h:c<h?c:h,x=u<f?u<d?u:d:f<d?f:d,v=l>c?l>h?l:h:c>h?c:h,m=u>f?u>d?u:d:f>d?f:d,g=Zl(p,x,t,e,i),y=Zl(v,m,t,e,i);let _=n.prevZ,S=n.nextZ;for(;_&&_.z>=g&&S&&S.z<=y;){if(_.x>=p&&_.x<=v&&_.y>=x&&_.y<=m&&_!==r&&_!==a&&ds(l,u,c,f,h,d,_.x,_.y)&&we(_.prev,_,_.next)>=0||(_=_.prevZ,S.x>=p&&S.x<=v&&S.y>=x&&S.y<=m&&S!==r&&S!==a&&ds(l,u,c,f,h,d,S.x,S.y)&&we(S.prev,S,S.next)>=0))return!1;S=S.nextZ}for(;_&&_.z>=g;){if(_.x>=p&&_.x<=v&&_.y>=x&&_.y<=m&&_!==r&&_!==a&&ds(l,u,c,f,h,d,_.x,_.y)&&we(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;S&&S.z<=y;){if(S.x>=p&&S.x<=v&&S.y>=x&&S.y<=m&&S!==r&&S!==a&&ds(l,u,c,f,h,d,S.x,S.y)&&we(S.prev,S,S.next)>=0)return!1;S=S.nextZ}return!0}function a_(n,t,e){let i=n;do{const r=i.prev,o=i.next.next;!Yo(r,o)&&Md(r,i,i.next,o)&&cr(r,o)&&cr(o,r)&&(t.push(r.i/e|0),t.push(i.i/e|0),t.push(o.i/e|0),hr(i),hr(i.next),i=n=o),i=i.next}while(i!==n);return Vi(i)}function l_(n,t,e,i,r,o){let a=n;do{let l=a.next.next;for(;l!==a.prev;){if(a.i!==l.i&&x_(a,l)){let c=yd(a,l);a=Vi(a,a.next),c=Vi(c,c.next),lr(a,t,e,i,r,o,0),lr(c,t,e,i,r,o,0);return}l=l.next}a=a.next}while(a!==n)}function c_(n,t,e,i){const r=[];let o,a,l,c,h;for(o=0,a=t.length;o<a;o++)l=t[o]*i,c=o<a-1?t[o+1]*i:n.length,h=_d(n,l,c,i,!1),h===h.next&&(h.steiner=!0),r.push(g_(h));for(r.sort(h_),o=0;o<r.length;o++)e=u_(r[o],e);return e}function h_(n,t){return n.x-t.x}function u_(n,t){const e=d_(n,t);if(!e)return t;const i=yd(e,n);return Vi(i,i.next),Vi(e,e.next)}function d_(n,t){let e=t,i=-1/0,r;const o=n.x,a=n.y;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){const d=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=o&&d>i&&(i=d,r=e.x<e.next.x?e:e.next,d===o))return r}e=e.next}while(e!==t);if(!r)return null;const l=r,c=r.x,h=r.y;let u=1/0,f;e=r;do o>=e.x&&e.x>=c&&o!==e.x&&ds(a<h?o:i,a,c,h,a<h?i:o,a,e.x,e.y)&&(f=Math.abs(a-e.y)/(o-e.x),cr(e,n)&&(f<u||f===u&&(e.x>r.x||e.x===r.x&&f_(r,e)))&&(r=e,u=f)),e=e.next;while(e!==l);return r}function f_(n,t){return we(n.prev,n,t.prev)<0&&we(t.next,n,n.next)<0}function p_(n,t,e,i){let r=n;do r.z===0&&(r.z=Zl(r.x,r.y,t,e,i)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==n);r.prevZ.nextZ=null,r.prevZ=null,m_(r)}function m_(n){let t,e,i,r,o,a,l,c,h=1;do{for(e=n,n=null,o=null,a=0;e;){for(a++,i=e,l=0,t=0;t<h&&(l++,i=i.nextZ,!!i);t++);for(c=h;l>0||c>0&&i;)l!==0&&(c===0||!i||e.z<=i.z)?(r=e,e=e.nextZ,l--):(r=i,i=i.nextZ,c--),o?o.nextZ=r:n=r,r.prevZ=o,o=r;e=i}o.nextZ=null,h*=2}while(a>1);return n}function Zl(n,t,e,i,r){return n=(n-e)*r|0,t=(t-i)*r|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function g_(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function ds(n,t,e,i,r,o,a,l){return(r-a)*(t-l)>=(n-a)*(o-l)&&(n-a)*(i-l)>=(e-a)*(t-l)&&(e-a)*(o-l)>=(r-a)*(i-l)}function x_(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!v_(n,t)&&(cr(n,t)&&cr(t,n)&&__(n,t)&&(we(n.prev,n,t.prev)||we(n,t.prev,t))||Yo(n,t)&&we(n.prev,n,n.next)>0&&we(t.prev,t,t.next)>0)}function we(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function Yo(n,t){return n.x===t.x&&n.y===t.y}function Md(n,t,e,i){const r=Jr(we(n,t,e)),o=Jr(we(n,t,i)),a=Jr(we(e,i,n)),l=Jr(we(e,i,t));return!!(r!==o&&a!==l||r===0&&Kr(n,e,t)||o===0&&Kr(n,i,t)||a===0&&Kr(e,n,i)||l===0&&Kr(e,t,i))}function Kr(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Jr(n){return n>0?1:n<0?-1:0}function v_(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Md(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function cr(n,t){return we(n.prev,n,n.next)<0?we(n,t,n.next)>=0&&we(n,n.prev,t)>=0:we(n,t,n.prev)<0||we(n,n.next,t)<0}function __(n,t){let e=n,i=!1;const r=(n.x+t.x)/2,o=(n.y+t.y)/2;do e.y>o!=e.next.y>o&&e.next.y!==e.y&&r<(e.next.x-e.x)*(o-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function yd(n,t){const e=new Kl(n.i,n.x,n.y),i=new Kl(t.i,t.x,t.y),r=n.next,o=t.prev;return n.next=t,t.prev=n,e.next=r,r.prev=e,i.next=e,e.prev=i,o.next=i,i.prev=o,i}function lu(n,t,e,i){const r=new Kl(n,t,e);return i?(r.next=i.next,r.prev=i,i.next.prev=r,i.next=r):(r.prev=r,r.next=r),r}function hr(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Kl(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function M_(n,t,e,i){let r=0;for(let o=t,a=e-i;o<e;o+=i)r+=(n[a]-n[o])*(n[o+1]+n[a+1]),a=o;return r}class vi{static area(t){const e=t.length;let i=0;for(let r=e-1,o=0;o<e;r=o++)i+=t[r].x*t[o].y-t[o].x*t[r].y;return i*.5}static isClockWise(t){return vi.area(t)<0}static triangulateShape(t,e){const i=[],r=[],o=[];cu(t),hu(i,t);let a=t.length;e.forEach(cu);for(let c=0;c<e.length;c++)r.push(a),a+=e[c].length,hu(i,e[c]);const l=s_.triangulate(i,r);for(let c=0;c<l.length;c+=3)o.push(l.slice(c,c+3));return o}}function cu(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function hu(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class Pc extends Se{constructor(t=new ar([new ht(.5,.5),new ht(-.5,.5),new ht(-.5,-.5),new ht(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const i=this,r=[],o=[];for(let l=0,c=t.length;l<c;l++){const h=t[l];a(h)}this.setAttribute("position",new ee(r,3)),this.setAttribute("uv",new ee(o,2)),this.computeVertexNormals();function a(l){const c=[],h=e.curveSegments!==void 0?e.curveSegments:12,u=e.steps!==void 0?e.steps:1,f=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,p=e.bevelThickness!==void 0?e.bevelThickness:.2,x=e.bevelSize!==void 0?e.bevelSize:p-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const g=e.extrudePath,y=e.UVGenerator!==void 0?e.UVGenerator:y_;let _,S=!1,P,C,T,I;g&&(_=g.getSpacedPoints(u),S=!0,d=!1,P=g.computeFrenetFrames(u,!1),C=new D,T=new D,I=new D),d||(m=0,p=0,x=0,v=0);const Z=l.extractPoints(h);let M=Z.shape;const b=Z.holes;if(!vi.isClockWise(M)){M=M.reverse();for(let J=0,R=b.length;J<R;J++){const pt=b[J];vi.isClockWise(pt)&&(b[J]=pt.reverse())}}const H=vi.triangulateShape(M,b),U=M;for(let J=0,R=b.length;J<R;J++){const pt=b[J];M=M.concat(pt)}function z(J,R,pt){return R||console.error("THREE.ExtrudeGeometry: vec does not exist"),J.clone().addScaledVector(R,pt)}const L=M.length,W=H.length;function k(J,R,pt){let ft,ct,mt;const zt=J.x-R.x,wt=J.y-R.y,A=pt.x-J.x,w=pt.y-J.y,G=zt*zt+wt*wt,Q=zt*w-wt*A;if(Math.abs(Q)>Number.EPSILON){const st=Math.sqrt(G),tt=Math.sqrt(A*A+w*w),Nt=R.x-wt/st,vt=R.y+zt/st,Tt=pt.x-w/tt,Qt=pt.y+A/tt,ut=((Tt-Nt)*w-(Qt-vt)*A)/(zt*w-wt*A);ft=Nt+zt*ut-J.x,ct=vt+wt*ut-J.y;const At=ft*ft+ct*ct;if(At<=2)return new ht(ft,ct);mt=Math.sqrt(At/2)}else{let st=!1;zt>Number.EPSILON?A>Number.EPSILON&&(st=!0):zt<-Number.EPSILON?A<-Number.EPSILON&&(st=!0):Math.sign(wt)===Math.sign(w)&&(st=!0),st?(ft=-wt,ct=zt,mt=Math.sqrt(G)):(ft=zt,ct=wt,mt=Math.sqrt(G/2))}return new ht(ft/mt,ct/mt)}const Y=[];for(let J=0,R=U.length,pt=R-1,ft=J+1;J<R;J++,pt++,ft++)pt===R&&(pt=0),ft===R&&(ft=0),Y[J]=k(U[J],U[pt],U[ft]);const et=[];let j,xt=Y.concat();for(let J=0,R=b.length;J<R;J++){const pt=b[J];j=[];for(let ft=0,ct=pt.length,mt=ct-1,zt=ft+1;ft<ct;ft++,mt++,zt++)mt===ct&&(mt=0),zt===ct&&(zt=0),j[ft]=k(pt[ft],pt[mt],pt[zt]);et.push(j),xt=xt.concat(j)}for(let J=0;J<m;J++){const R=J/m,pt=p*Math.cos(R*Math.PI/2),ft=x*Math.sin(R*Math.PI/2)+v;for(let ct=0,mt=U.length;ct<mt;ct++){const zt=z(U[ct],Y[ct],ft);at(zt.x,zt.y,-pt)}for(let ct=0,mt=b.length;ct<mt;ct++){const zt=b[ct];j=et[ct];for(let wt=0,A=zt.length;wt<A;wt++){const w=z(zt[wt],j[wt],ft);at(w.x,w.y,-pt)}}}const Pt=x+v;for(let J=0;J<L;J++){const R=d?z(M[J],xt[J],Pt):M[J];S?(T.copy(P.normals[0]).multiplyScalar(R.x),C.copy(P.binormals[0]).multiplyScalar(R.y),I.copy(_[0]).add(T).add(C),at(I.x,I.y,I.z)):at(R.x,R.y,0)}for(let J=1;J<=u;J++)for(let R=0;R<L;R++){const pt=d?z(M[R],xt[R],Pt):M[R];S?(T.copy(P.normals[J]).multiplyScalar(pt.x),C.copy(P.binormals[J]).multiplyScalar(pt.y),I.copy(_[J]).add(T).add(C),at(I.x,I.y,I.z)):at(pt.x,pt.y,f/u*J)}for(let J=m-1;J>=0;J--){const R=J/m,pt=p*Math.cos(R*Math.PI/2),ft=x*Math.sin(R*Math.PI/2)+v;for(let ct=0,mt=U.length;ct<mt;ct++){const zt=z(U[ct],Y[ct],ft);at(zt.x,zt.y,f+pt)}for(let ct=0,mt=b.length;ct<mt;ct++){const zt=b[ct];j=et[ct];for(let wt=0,A=zt.length;wt<A;wt++){const w=z(zt[wt],j[wt],ft);S?at(w.x,w.y+_[u-1].y,_[u-1].x+pt):at(w.x,w.y,f+pt)}}}V(),K();function V(){const J=r.length/3;if(d){let R=0,pt=L*R;for(let ft=0;ft<W;ft++){const ct=H[ft];Rt(ct[2]+pt,ct[1]+pt,ct[0]+pt)}R=u+m*2,pt=L*R;for(let ft=0;ft<W;ft++){const ct=H[ft];Rt(ct[0]+pt,ct[1]+pt,ct[2]+pt)}}else{for(let R=0;R<W;R++){const pt=H[R];Rt(pt[2],pt[1],pt[0])}for(let R=0;R<W;R++){const pt=H[R];Rt(pt[0]+L*u,pt[1]+L*u,pt[2]+L*u)}}i.addGroup(J,r.length/3-J,0)}function K(){const J=r.length/3;let R=0;lt(U,R),R+=U.length;for(let pt=0,ft=b.length;pt<ft;pt++){const ct=b[pt];lt(ct,R),R+=ct.length}i.addGroup(J,r.length/3-J,1)}function lt(J,R){let pt=J.length;for(;--pt>=0;){const ft=pt;let ct=pt-1;ct<0&&(ct=J.length-1);for(let mt=0,zt=u+m*2;mt<zt;mt++){const wt=L*mt,A=L*(mt+1),w=R+ft+wt,G=R+ct+wt,Q=R+ct+A,st=R+ft+A;Ot(w,G,Q,st)}}}function at(J,R,pt){c.push(J),c.push(R),c.push(pt)}function Rt(J,R,pt){Ht(J),Ht(R),Ht(pt);const ft=r.length/3,ct=y.generateTopUV(i,r,ft-3,ft-2,ft-1);Xt(ct[0]),Xt(ct[1]),Xt(ct[2])}function Ot(J,R,pt,ft){Ht(J),Ht(R),Ht(ft),Ht(R),Ht(pt),Ht(ft);const ct=r.length/3,mt=y.generateSideWallUV(i,r,ct-6,ct-3,ct-2,ct-1);Xt(mt[0]),Xt(mt[1]),Xt(mt[3]),Xt(mt[1]),Xt(mt[2]),Xt(mt[3])}function Ht(J){r.push(c[J*3+0]),r.push(c[J*3+1]),r.push(c[J*3+2])}function Xt(J){o.push(J.x),o.push(J.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return S_(e,i,t)}static fromJSON(t,e){const i=[];for(let o=0,a=t.shapes.length;o<a;o++){const l=e[t.shapes[o]];i.push(l)}const r=t.options.extrudePath;return r!==void 0&&(t.options.extrudePath=new jl[r.type]().fromJSON(r)),new Pc(i,t.options)}}const y_={generateTopUV:function(n,t,e,i,r){const o=t[e*3],a=t[e*3+1],l=t[i*3],c=t[i*3+1],h=t[r*3],u=t[r*3+1];return[new ht(o,a),new ht(l,c),new ht(h,u)]},generateSideWallUV:function(n,t,e,i,r,o){const a=t[e*3],l=t[e*3+1],c=t[e*3+2],h=t[i*3],u=t[i*3+1],f=t[i*3+2],d=t[r*3],p=t[r*3+1],x=t[r*3+2],v=t[o*3],m=t[o*3+1],g=t[o*3+2];return Math.abs(l-u)<Math.abs(a-h)?[new ht(a,1-c),new ht(h,1-f),new ht(d,1-x),new ht(v,1-g)]:[new ht(l,1-c),new ht(u,1-f),new ht(p,1-x),new ht(m,1-g)]}};function S_(n,t,e){if(e.shapes=[],Array.isArray(n))for(let i=0,r=n.length;i<r;i++){const o=n[i];e.shapes.push(o.uuid)}else e.shapes.push(n.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Lo extends Se{constructor(t=new ar([new ht(0,.5),new ht(-.5,-.5),new ht(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],r=[],o=[],a=[];let l=0,c=0;if(Array.isArray(t)===!1)h(t);else for(let u=0;u<t.length;u++)h(t[u]),this.addGroup(l,c,u),l+=c,c=0;this.setIndex(i),this.setAttribute("position",new ee(r,3)),this.setAttribute("normal",new ee(o,3)),this.setAttribute("uv",new ee(a,2));function h(u){const f=r.length/3,d=u.extractPoints(e);let p=d.shape;const x=d.holes;vi.isClockWise(p)===!1&&(p=p.reverse());for(let m=0,g=x.length;m<g;m++){const y=x[m];vi.isClockWise(y)===!0&&(x[m]=y.reverse())}const v=vi.triangulateShape(p,x);for(let m=0,g=x.length;m<g;m++){const y=x[m];p=p.concat(y)}for(let m=0,g=p.length;m<g;m++){const y=p[m];r.push(y.x,y.y,0),o.push(0,0,1),a.push(y.x,y.y)}for(let m=0,g=v.length;m<g;m++){const y=v[m],_=y[0]+f,S=y[1]+f,P=y[2]+f;i.push(_,S,P),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return w_(e,t)}static fromJSON(t,e){const i=[];for(let r=0,o=t.shapes.length;r<o;r++){const a=e[t.shapes[r]];i.push(a)}return new Lo(i,t.curveSegments)}}function w_(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const r=n[e];t.shapes.push(r.uuid)}else t.shapes.push(n.uuid);return t}class Ic extends Se{constructor(t=1,e=32,i=16,r=0,o=Math.PI*2,a=0,l=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:r,phiLength:o,thetaStart:a,thetaLength:l},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const c=Math.min(a+l,Math.PI);let h=0;const u=[],f=new D,d=new D,p=[],x=[],v=[],m=[];for(let g=0;g<=i;g++){const y=[],_=g/i;let S=0;g===0&&a===0?S=.5/e:g===i&&c===Math.PI&&(S=-.5/e);for(let P=0;P<=e;P++){const C=P/e;f.x=-t*Math.cos(r+C*o)*Math.sin(a+_*l),f.y=t*Math.cos(a+_*l),f.z=t*Math.sin(r+C*o)*Math.sin(a+_*l),x.push(f.x,f.y,f.z),d.copy(f).normalize(),v.push(d.x,d.y,d.z),m.push(C+S,1-_),y.push(h++)}u.push(y)}for(let g=0;g<i;g++)for(let y=0;y<e;y++){const _=u[g][y+1],S=u[g][y],P=u[g+1][y],C=u[g+1][y+1];(g!==0||a>0)&&p.push(_,S,C),(g!==i-1||c<Math.PI)&&p.push(S,P,C)}this.setIndex(p),this.setAttribute("position",new ee(x,3)),this.setAttribute("normal",new ee(v,3)),this.setAttribute("uv",new ee(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ic(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class ir extends Se{constructor(t=1,e=.4,i=12,r=48,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:r,arc:o},i=Math.floor(i),r=Math.floor(r);const a=[],l=[],c=[],h=[],u=new D,f=new D,d=new D;for(let p=0;p<=i;p++)for(let x=0;x<=r;x++){const v=x/r*o,m=p/i*Math.PI*2;f.x=(t+e*Math.cos(m))*Math.cos(v),f.y=(t+e*Math.cos(m))*Math.sin(v),f.z=e*Math.sin(m),l.push(f.x,f.y,f.z),u.x=t*Math.cos(v),u.y=t*Math.sin(v),d.subVectors(f,u).normalize(),c.push(d.x,d.y,d.z),h.push(x/r),h.push(p/i)}for(let p=1;p<=i;p++)for(let x=1;x<=r;x++){const v=(r+1)*p+x-1,m=(r+1)*(p-1)+x-1,g=(r+1)*(p-1)+x,y=(r+1)*p+x;a.push(v,m,y),a.push(m,g,y)}this.setIndex(a),this.setAttribute("position",new ee(l,3)),this.setAttribute("normal",new ee(c,3)),this.setAttribute("uv",new ee(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ir(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class ve extends Wi{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Yt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Zu,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Un,this.combine=mc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class b_ extends Os{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}}class Sd extends ke{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Yt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class E_ extends Sd{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ke.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Yt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const za=new pe,uu=new D,du=new D;class T_{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ht(512,512),this.map=null,this.mapPass=null,this.matrix=new pe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new bc,this._frameExtents=new ht(1,1),this._viewportCount=1,this._viewports=[new Ae(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;uu.setFromMatrixPosition(t.matrixWorld),e.position.copy(uu),du.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(du),e.updateMatrixWorld(),za.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(za),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(za)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class A_ extends T_{constructor(){super(new ld(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class C_ extends Sd{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ke.DEFAULT_UP),this.updateMatrix(),this.target=new ke,this.shadow=new A_}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const fu=new pe;class R_{constructor(t,e,i=0,r=1/0){this.ray=new Wo(t,e),this.near=i,this.far=r,this.camera=null,this.layers=new wc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return fu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(fu),this}intersectObject(t,e=!0,i=[]){return Jl(t,this,i,e),i.sort(pu),i}intersectObjects(t,e=!0,i=[]){for(let r=0,o=t.length;r<o;r++)Jl(t[r],this,i,e);return i.sort(pu),i}}function pu(n,t){return n.distance-t.distance}function Jl(n,t,e,i){let r=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(r=!1),r===!0&&i===!0){const o=n.children;for(let a=0,l=o.length;a<l;a++)Jl(o[a],t,e,!0)}}class Lc extends Ac{constructor(t=10,e=10,i=4473924,r=8947848){i=new Yt(i),r=new Yt(r);const o=e/2,a=t/e,l=t/2,c=[],h=[];for(let d=0,p=0,x=-l;d<=e;d++,x+=a){c.push(-l,0,x,l,0,x),c.push(x,0,-l,x,0,l);const v=d===o?i:r;v.toArray(h,p),p+=3,v.toArray(h,p),p+=3,v.toArray(h,p),p+=3,v.toArray(h,p),p+=3}const u=new Se;u.setAttribute("position",new ee(c,3)),u.setAttribute("color",new ee(h,3));const f=new Os({vertexColors:!0,toneMapped:!1});super(u,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:pc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=pc);function Fs(n,t=!1){const e=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),r=new Set(Object.keys(n[0].morphAttributes)),o={},a={},l=n[0].morphTargetsRelative,c=new Se;let h=0;for(let u=0;u<n.length;++u){const f=n[u];let d=0;if(e!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const p in f.attributes){if(!i.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;o[p]===void 0&&(o[p]=[]),o[p].push(f.attributes[p]),d++}if(d!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(l!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const p in f.morphAttributes){if(!r.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;a[p]===void 0&&(a[p]=[]),a[p].push(f.morphAttributes[p])}if(t){let p;if(e)p=f.index.count;else if(f.attributes.position!==void 0)p=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,p,u),h+=p}}if(e){let u=0;const f=[];for(let d=0;d<n.length;++d){const p=n[d].index;for(let x=0;x<p.count;++x)f.push(p.getX(x)+u);u+=n[d].attributes.position.count}c.setIndex(f)}for(const u in o){const f=mu(o[u]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,f)}for(const u in a){const f=a[u][0].length;if(f===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let d=0;d<f;++d){const p=[];for(let v=0;v<a[u].length;++v)p.push(a[u][v][d]);const x=mu(p);if(!x)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(x)}}return c}function mu(n){let t,e,i,r=-1,o=0;for(let h=0;h<n.length;++h){const u=n[h];if(t===void 0&&(t=u.array.constructor),t!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=u.itemSize),e!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=u.normalized),i!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=u.gpuType),r!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;o+=u.count*e}const a=new t(o),l=new en(a,e,i);let c=0;for(let h=0;h<n.length;++h){const u=n[h];if(u.isInterleavedBufferAttribute){const f=c/e;for(let d=0,p=u.count;d<p;d++)for(let x=0;x<e;x++){const v=u.getComponent(d,x);l.setComponent(d+f,x,v)}}else a.set(u.array,c);c+=u.count*e}return r!==void 0&&(l.gpuType=r),l}const ka={},jt=(n,t,e={})=>ka[n]||(ka[n]=new ve({color:t,...e})),cs=()=>jt("white",15855593),Ne=()=>jt("metal",5988976),ue=()=>jt("black",1382429),ui=()=>jt("dark",2765376),vo=()=>jt("screen",1784405,{emissive:928324}),Ba=()=>jt("drape",1844016),Mt=(n,t,e,i,r,o=0,a=0,l=0,c=0)=>{const h=new Bt(new re(t,e,i),r);return h.position.set(o,a,l),h.rotation.x=c,n.add(h),h},Ue=(n,t,e,i,r,o=0,a=0,l=0,c=24)=>{const h=new Bt(new cn(t,e,i,c),r);return h.position.set(o,a,l),n.add(h),h},di=()=>jt("fabric",2832974),Qr=()=>jt("linen",16184559),Pe=()=>jt("chrome",13225686),Ha=()=>jt("wood",9071179),Ii=()=>jt("orange",ie(nt.colors.highlight)),Ys=()=>jt("teal",ie(nt.colors.accent),{emissive:670260}),js=()=>jt("rubber",1053206),to=()=>jt("navy",728890),Ga=(n,t,e,i=0,r=32)=>{const o=new Bt(new Xo(t.map(([a,l])=>new ht(a,l)),r),e);return o.position.y=i,n.add(o),o},fe=(n,t,e,i,r,o=0,a=0,l=0,c=.04)=>{const h=new ar,u=t/2-c,f=i/2-c;h.moveTo(-u,-i/2),h.lineTo(u,-i/2),h.quadraticCurveTo(t/2,-i/2,t/2,-f),h.lineTo(t/2,f),h.quadraticCurveTo(t/2,i/2,u,i/2),h.lineTo(-u,i/2),h.quadraticCurveTo(-t/2,i/2,-t/2,f),h.lineTo(-t/2,-f),h.quadraticCurveTo(-t/2,-i/2,-u,-i/2);const d=new Pc(h,{depth:e,bevelEnabled:!1,curveSegments:4}).rotateX(-Math.PI/2),p=new Bt(d,r);return p.position.set(o,a-e/2,l),n.add(p),p},Ee=(n,t,e,i,r)=>{const o=new D(e[0]-t[0],e[1]-t[1],e[2]-t[2]),a=o.length(),l=new Bt(new cn(i,i,a,8),r);return l.position.set((t[0]+e[0])/2,(t[1]+e[1])/2,(t[2]+e[2])/2),l.quaternion.setFromUnitVectors(new D(0,1,0),o.normalize()),n.add(l),l};function eo(n,t,e,i,r,o,a=2.5,l=.05,c=0){const h=Math.max(4,Math.round(t*a)),u=t/h,f=[];for(let p=0;p<h;p++)f.push(new re(u*.78,e,.035).translate(c-t/2+u*(p+.5),i,r+(p%2?l:-l)));f.push(new re(t,e,.02).translate(c,i,r));const d=new Bt(Fs(f),o);return f.forEach(p=>p.dispose()),n.add(d),d}function Va(n,t,e,i,r,o=.04,a=.12,l=!0){fe(n,t,e,a,ue(),0,i,r,.03),Mt(n,t-o*2,e-o*2,.01,l?vo():ue(),0,i,r+a/2+.006),Mt(n,t*.4,.03,.005,jt("logoStrip",3818322),0,i-e/2+.02,r+a/2+.004)}function P_(n,t,e={}){const i=new he,{w:r,h:o}=n,a=n.d;if(typeof n.mesh=="function")return n.mesh(t,e);switch(n.shape){case"table":if(n.id==="conf"){fe(i,r,.15,a,Ha(),0,o-.075,0,.6);for(const l of[-1,1])Mt(i,.12,o-.15,a*.55,ui(),l*(r/2-1.2),(o-.15)/2),Mt(i,.3,.05,a*.7,ui(),l*(r/2-1.2),.025);Mt(i,.6,.02,.35,ue(),0,o+.01)}else{Mt(i,r,.1,a,cs(),0,o-.05),eo(i,r-.02,o*.82,o-o*.82/2-.02,a/2-.03,Qr(),2,.012),Mt(i,r,.04,a,jt("edge",14605267),0,o-.1);for(const l of[-1,1])Mt(i,.02,o*.82,a,Qr(),l*(r/2-.01),o-o*.82/2-.02);for(const l of[-1,1])Ee(i,[l*(r/2-.4),0,-a/2+.2],[l*(r/2-.4),o-.1,-a/2+.2],.035,Ne()),Ee(i,[l*(r/2-.4),0,a/2-.2],[l*(r/2-.4),o-.1,a/2-.2],.035,Ne()),Ee(i,[l*(r/2-.4),.02,-a/2+.2],[l*(r/2-.4),.02,a/2-.2],.03,Ne())}break;case"round":if(n.id==="hightop")Ga(i,[[.01,0],[r*.3,0],[r*.32,.05],[.12,.3],[.09,o*.55],[.16,o-.4],[r/2,o-.08],[r/2,o],[.01,o]],jt("spandex",16052974)),Mt(i,.02,.5,.01,Ii(),0,o*.5,.11);else{Ga(i,[[.01,o],[r/2,o],[r/2,o-.05],[r/2+.03,.02],[r/2+.03,0],[.01,0]],Qr(),0,48),Ue(i,r/2-.05,r/2-.05,.005,cs(),0,o+.003,0,40);{const l=new Bt(new ir(r/2-.02,.025,6,48),Qr());l.rotation.x=Math.PI/2,l.position.y=o-.02,i.add(l)}}break;case"chair":if(n.id==="exec"){for(let c=0;c<5;c++){const h=c/5*Math.PI*2;Ee(i,[0,.25,0],[Math.sin(h)*(r/2-.1),.12,Math.cos(h)*(r/2-.1)],.05,ue()),Ue(i,.07,.07,.1,js(),Math.sin(h)*(r/2-.1),.06,Math.cos(h)*(r/2-.1),10)}Ue(i,.06,.06,1.1,Pe(),0,.8,0,12),fe(i,r*.85,.3,a*.75,di(),0,1.5,.05,.25);const l=fe(i,r*.8,o-1.75,.25,di(),0,1.65+(o-1.75)/2,-a/2+.3,.1);l.rotation.x=-.12;for(const c of[-1,1])Ee(i,[c*r*.4,1.45,0],[c*r*.4,2.05,0],.04,ue()),Mt(i,.14,.06,.8,ue(),c*r*.4,2.08,.05)}else{fe(i,r,.22,a*.82,di(),0,1.5,.08,.12);const l=fe(i,r*.94,o-1.7,.16,di(),0,1.62+(o-1.7)/2,-a/2+.12,.12);l.rotation.x=-.08,fe(i,r*.92,.06,a*.74,jt("fabricHi",3491938),0,1.63,.1,.12),Mt(i,r*.96,.05,.05,Pe(),0,1.38,a/2-.1),Ee(i,[-(r/2-.1),.35,-a/2+.06],[r/2-.1,.35,-a/2+.06],.025,Pe());for(const c of[-1,1]){Ee(i,[c*(r/2-.1),.35,a/2-.13],[c*(r/2-.1),.35,-a/2+.06],.025,Pe());for(const h of[a/2-.12,-a/2+.06])Ue(i,.045,.045,.04,js(),c*(r/2-.1),.02,h,8);Ee(i,[c*(r/2-.1),0,a/2-.12],[c*(r/2-.12),1.4,a/2-.18],.035,Pe()),Ee(i,[c*(r/2-.1),0,-a/2+.06],[c*(r/2-.12),o-.1,-a/2+.06],.035,Pe())}}break;case"stool":Ue(i,r/2,r/2-.03,.22,di(),0,o-.11,0,28),Ue(i,.06,.06,o-.2,Pe(),0,(o-.2)/2,0,12),Ga(i,[[.01,0],[r*.42,0],[r*.42,.04],[.1,.12],[.01,.12]],Pe());{const l=new Bt(new ir(r*.35,.03,8,28),Pe());l.rotation.x=Math.PI/2,l.position.y=o*.35,i.add(l)}break;case"lounge":fe(i,r-.6,.55,a-.5,di(),0,.95,.15,.15),fe(i,r,.7,a,jt("loungeBase",2240834),0,.5,0,.2),fe(i,r,o-.85,.5,di(),0,.85+(o-.85)/2,-a/2+.25,.2);for(const l of[-1,1])fe(i,.4,1.95-.15,a,di(),l*(r/2-.2),.15+1.8/2,0,.18);for(let l=1;l<3;l++)Mt(i,.02,.5,a-.6,jt("seam",2042682),-r/2+.3+(r-.6)/3*l,1,.15);for(const l of[-1,1])for(const c of[-1,1])Ue(i,.06,.05,.15,Pe(),l*(r/2-.3),.075,c*(a/2-.3),10);break;case"counter":fe(i,r-.1,o-.25,a-.1,cs(),0,.1+(o-.25)/2,0,.08),fe(i,r,.1,a,ui(),0,o-.05,0,.1),Mt(i,r-.3,.1,a-.3,ue(),0,.05),Mt(i,r-.5,o*.5,.01,to(),0,o*.5,a/2-.04),Mt(i,r-.5,.08,.012,Ii(),0,o*.25,a/2-.035),Mt(i,r-.5,.04,.012,Ys(),0,o-.25,a/2-.035),Ee(i,[-r/2+.35,.5,a/2-.02],[r/2-.35,.5,a/2-.02],.035,Pe());for(const l of[-1,1])Ee(i,[l*(r/2-.35),.5,a/2-.02],[l*(r/2-.35),.5,a/2-.12],.03,Pe());Mt(i,r-.2,.05,.6,cs(),0,o-.95,-a/2+.35);break;case"tv":{const l=n.panel;if(t==="wall")Va(i,r,l,l/2,0,.04,.2),Mt(i,r*.5,l*.5,.05,Ne(),0,l/2,-.12);else{const c=o-l;Va(i,r,l,c+l/2,.08,.04,.16);for(const h of[-1,1])Ee(i,[h*r*.18,.25,0],[h*r*.18,c+l*.7,0],.07,ue());Ee(i,[-r*.18,c*.45,0],[r*.18,c*.45,0],.04,ue()),fe(i,r*.6,.1,a*.9,ue(),0,.2,0,.1),Mt(i,.12,c*.85,.06,jt("cable",2237997),0,.25+c*.42,-.1),Mt(i,r*.32,.04,.7,Ne(),0,c*.55,.25);for(const h of[-1,1])for(const u of[-1,1])Ue(i,.07,.07,.06,js(),h*r*.27,.07,u*a*.38,10)}break}case"screen":Mt(i,r-.1,o-1.7,.03,jt("scrnW",16448250),0,1.7+(o-1.7)/2),Mt(i,r,.18,.06,ue(),0,o-.09),Mt(i,r,.4,.06,ue(),0,1.65);for(const l of[-1,1])Mt(i,.08,o,.08,ue(),l*(r/2-.04),o/2),Ee(i,[l*(r/2-.04),.02,-a/2],[l*(r/2-.04),.02,a/2],.04,Ne());break;case"led":{const l=6.5616666666666665,c=o-l;Mt(i,r,l,.3,ue(),0,c+l/2),Mt(i,r-.04,l-.04,.02,jt("led",1341352,{emissive:875910}),0,c+l/2,.16);const h=[];for(let f=1;f<6;f++){const d=-r/2+r/6*f;h.push(d,c,.175,d,c+l,.175)}for(let f=1;f<4;f++){const d=c+l/4*f;h.push(-r/2,d,.175,r/2,d,.175)}const u=new Se;u.setAttribute("position",new ee(h,3));{const f=new Ac(u,new Os({color:404029}));f.userData.ownMat=1,i.add(f)}for(const f of[-1,0,1])Mt(i,.2,c+.3,.2,Ne(),f*(r/2-.5),(c+.3)/2,-.25),Mt(i,.25,.08,a,Ne(),f*(r/2-.5),.04),Ee(i,[f*(r/2-.5),.05,a/2-.1],[f*(r/2-.5),c*.9,-.25],.04,Ne());Mt(i,r,.12,.12,Ne(),0,c-.06,-.2);for(const f of[c,c+l])Mt(i,r+.06,.06,.34,jt("ledFrame",790034),0,f,0);for(const f of[-1,1])Mt(i,.06,l,.34,jt("ledFrame",790034),f*(r/2+.01),c+l/2,0);break}case"ledposter":{const l=6.299212598425197,c=2.25/12,h=o-l,u=.04,f=!!e.joinL,d=!!e.joinR,p=h+l/2;fe(i,r,.12,a,ue(),0,.06,0,.03),Mt(i,r*.5,h-.12,c*.8,Ne(),0,.12+(h-.12)/2,0);const x=Mt(i,r,l,c*.7,ue(),0,p,0);x.name="posterCabinet";for(const[_,S,P]of[["bezelL",-1,!f],["bezelR",1,!d]])if(P){const C=Mt(i,u,l,c,ue(),S*(r/2-u/2),p,0);C.name=_}for(const _ of[-1,1]){const S=Mt(i,r,u,c,ue(),0,p+_*(l/2-u/2),0);S.name=_<0?"bezelB":"bezelT"}const v=-r/2+(f?-.003:u),m=r/2-(d?-.003:u),g=m-v,y=(v+m)/2;for(const _ of[-1,1]){const S=Mt(i,g,l-2*u,.01,jt("led",1341352,{emissive:875910}),y,p,_*(c/2+.006));S.name="posterScreen"}Mt(i,g,l*.18,.012,Ii(),y,h+l*.72,c/2+.012),Mt(i,g,l*.08,.012,Ys(),y,h+l*.3,c/2+.012);break}case"ledtrailer":{Mt(i,r*.7,.35,a*.8,ui(),0,2.4-.2),Mt(i,r*.72,1.2,a*.82,jt("trailer",15328991),0,2.4+.4),Mt(i,r*.72,.15,a*.83,Ii(),0,2.4+.75);for(const f of[-1,1]){const d=new Bt(new cn(1.1,1.1,.7,20),js());d.rotation.x=Math.PI/2,d.rotation.z=Math.PI/2,d.position.set(0,1.1,f*(a/2-.35)),d.rotation.set(Math.PI/2,0,0),i.add(d)}Ee(i,[r*.36,2.4-.2,0],[r/2,1.3,0],.12,ui());for(const f of[-1,1])for(const d of[-1,1])Ee(i,[f*r*.3,2.4-.3,d*a*.35],[f*r*.34,.05,d*a*.45],.08,Ne());Mt(i,.5,o-2.4-7*.5,.5,Ne(),0,2.4+1+(o-2.4-1-7)/2,0);const u=o-7/2;Mt(i,12+.3,7+.3,.6,ue(),0,u,0),Mt(i,12,7,.02,jt("led",1341352,{emissive:875910}),0,u,.31);break}case"laptop":{fe(i,r,.05,a,jt("alu",12172999),0,.025,0,.05),Mt(i,r*.86,.005,a*.42,ue(),0,.052,-a*.1),Mt(i,r*.36,.004,a*.24,jt("pad",10922932),0,.052,a*.3),Ue(i,.02,.02,r*.7,jt("alu",12172999),0,.05,-a/2+.02,8).rotation.z=Math.PI/2,Mt(i,r*.8,.004,.01,jt("keys",2764341),0,.054,a*.12);const l=new he;l.position.set(0,.05,-a/2+.01),l.rotation.x=-.28,fe(l,r,a*.95,.025,jt("alu",12172999),0,a*.475,0,.04),Mt(l,r-.06,a*.86,.004,vo(),0,a*.48,.015),i.add(l);break}case"ipad":{fe(i,r*.55,.03,a*.75,Ne(),0,.015,0,.05);const l=new he;l.position.set(0,.06,-.05),l.rotation.x=-.35,Ee(i,[0,.03,-.05],[0,.3,-.12],.025,Ne()),fe(l,r,o-.15,.025,jt("ipadG",3159100),0,(o-.15)/2+.1,.02,.05),Mt(l,r-.06,o-.21,.004,vo(),0,(o-.15)/2+.1,.034),i.add(l);break}case"monitor":{const c=o-.6;Va(i,r,1.2,c,.05,.03,.07),Ee(i,[0,.03,-.05],[0,c-.1,-.05],.04,Ne()),fe(i,.75,.04,a*.85,Ne(),0,.02,-.02,.15),Mt(i,.25,.25,.04,Ne(),0,c,0);break}case"kiosk":fe(i,r,.08,a,ui(),0,.04,0,.15),fe(i,r*.7,o-.3,.35,cs(),0,.08+(o-.3)/2,-.05,.1);{const l=new he;l.position.set(0,o-1.4,.13),l.rotation.x=-.12,Mt(l,r*.62,1.45,.06,ue(),0,.7),Mt(l,r*.56,1.35,.005,vo(),0,.7,.033),i.add(l)}Mt(i,r*.7,.12,.36,Ii(),0,o-.06,-.05),Mt(i,r*.5,.5,.005,to(),0,.9,.13),Mt(i,.28,.18,.12,ue(),r*.22,o-1.75,.17),Mt(i,.2,.02,.01,Ys(),r*.22,o-1.7,.235);for(const l of[-1,1])Mt(i,.05,.4,.006,jt("grille",2303790),l*r*.28,o-.7,.17);break;case"tower":fe(i,r,o,a,ui(),0,o/2,0,.04),Mt(i,.012,o*.7,a*.7,jt("vent",1712169),r/2+.001,o*.5),Mt(i,r-.08,.03,.01,Ys(),0,o-.1,a/2+.006),Ue(i,.03,.03,.01,Pe(),0,o-.25,a/2+.005,12).rotation.x=Math.PI/2;break;case"speaker":{for(let c=0;c<3;c++){const h=c*2*Math.PI/3;Ee(i,[0,o*.35,0],[Math.sin(h)*r*.55,.02,Math.cos(h)*r*.55],.035,ue())}Ue(i,.045,.045,o-1.9,ue(),0,(o-1.9)/2,0,10),fe(i,r*.95,1.9,a*.8,ue(),0,o-.95,0,.08);const l=a*.8/2+.004;Mt(i,r*.85,1.75,.008,jt("grille",2303790),0,o-.95,l),Ue(i,.02,.02,.01,Ys(),r*.3,o-.15,l+.004,8).rotation.x=Math.PI/2;break}case"podium":fe(i,r,o-.25,a*.8,Ha(),0,(o-.25)/2,-a*.05,.08),Mt(i,r*.8,.9,.01,to(),0,o*.55,a*.35+.006),Mt(i,r*.8,.05,.012,Ii(),0,o*.55-.5,a*.35+.007);{const l=Mt(i,r,.08,a,Ha(),0,o-.12,0);l.rotation.x=.25}Ee(i,[.3,o-.08,.1],[.3,o+.4,.3],.012,ue());break;case"powerbox":fe(i,r,o-.3,a,ui(),0,.3+(o-.3)/2,0,.06),Mt(i,r+.02,.1,a+.02,jt("yellow",15909424),0,o-.2),Mt(i,r*.7,o*.35,.01,ue(),0,o*.5,a/2+.006);for(let l=0;l<4;l++)Ue(i,.06,.06,.02,jt("yellow",15909424),-r*.25+r*.5*l/3,o*.5,a/2+.015,10).rotation.x=Math.PI/2;for(const l of[-1,1]){Mt(i,.05,.05,a*.6,Pe(),l*(r/2+.04),o-.5);for(const c of[-1,1])Ue(i,.13,.13,.08,js(),l*(r/2-.2),.13,c*(a/2-.2),12).rotation.z=Math.PI/2}Ee(i,[-r*.25,o,0],[r*.25,o,0],.03,Pe());{const l=new Bt(new ir(.28,.05,6,20),ue());l.rotation.x=Math.PI/2,l.position.set(r/2-.4,.05,-a/2+.4),i.add(l)}["#c33","#222","#eee","#2a6","#36c"].forEach((l,c)=>Ue(i,.07,.07,.04,jt("cam"+c,l),-r/2+.35+c*.22,.55,a/2+.02,10).rotation.x=Math.PI/2);break;case"drape":for(const l of[-1,1])Ue(i,.04,.04,o,Pe(),l*(r/2-.3),o/2,0,10),fe(i,.6,.04,.6,Ne(),l*(r/2-.3),.02,0,.08);Ue(i,.035,.035,r,Pe(),0,o-.04,0,10).rotation.z=Math.PI/2,eo(i,r-.1,o-.18,(o-.18)/2+.06,0,Ba(),2.5,.05);break;case"booth":{Mt(i,r,.04,a,jt("carpet",2242388),0,.02),eo(i,r-.1,o-.2,(o-.2)/2+.05,-a/2+.12/2,Ba(),2,.035);for(const c of[-1,1]){const h=eo(new he,a-.12,n.sideH-.1,(n.sideH-.1)/2+.05,0,Ba(),2,.03);h.rotation.y=Math.PI/2,h.position.set(c*(r/2-.05),0,.12/2),i.add(h)}for(const c of[-1,1]){Ue(i,.04,.04,o,Pe(),c*r/2,o/2,-a/2,10),Ue(i,.04,.04,n.sideH,Pe(),c*r/2,n.sideH/2,a/2,10),Mt(i,.05,.05,a,Pe(),c*r/2,n.sideH,0);for(const h of[-a/2,a/2])Ue(i,.22,.24,.04,Ne(),c*(r/2-.22),.06,h-Math.sign(h)*.26,12)}Mt(i,r,.05,.05,Pe(),0,o,-a/2),Mt(i,r*.5,.9,.06,to(),0,o-.6,-a/2+.12),Mt(i,r*.5,.08,.065,Ii(),0,o-1,-a/2+.125);break}default:typeof n.draw=="function"?n.draw(i,n,t,e):Mt(i,r,o,a,cs(),0,o/2);break}return n.shape==="booth"&&i.children.forEach((l,c)=>{c>0&&(l.userData.noHit=1)}),i.traverse(l=>{l.isMesh&&(l.castShadow=!1)}),i}function Ql(n){n.traverse(t=>{t.geometry&&!t.userData.sharedGeo&&t.geometry.dispose(),t.material&&t.userData.ownMat&&t.material.dispose()})}const I_=nt.colors.fg,L_=nt.colors.highlight,tc=nt.colors.accent,Me=n=>`<svg viewBox="0 0 48 48" fill="none" stroke="${I_}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${n}</svg>`,je=n=>`<g stroke="${L_}">${n}</g>`,gu=n=>`<g stroke="${tc}">${n}</g>`,fi=n=>`<g stroke="${tc}" fill="${tc}33">${n}</g>`,an={table:Me('<path d="M5 19h38M9 19l-2 19M39 19l2 19M24 19v4"/>'+je('<path d="M5 19l3-5h32l3 5"/>')),conf:Me('<ellipse cx="24" cy="22" rx="18" ry="6"/><path d="M16 27v11M32 27v11"/>'+je('<path d="M12 38h8M28 38h8"/>')),round:Me('<ellipse cx="24" cy="16" rx="16" ry="5"/><path d="M8 16c0 8 1 16 3 22M40 16c0 8-1 16-3 22M11 38c8 2 18 2 26 0"/>'+je('<path d="M18 26v8"/>')),hightop:Me('<ellipse cx="24" cy="10" rx="10" ry="3"/><path d="M14 10c0 6 8 10 8 16s-4 10-8 12M34 10c0 6-8 10-8 16s4 10 8 12M14 38h20"/>'+je('<path d="M24 20v8"/>')),chair:Me('<path d="M15 6h18v16H15zM13 24h22l-2 4H15zM16 28l-2 14M32 28l2 14"/>'+je('<path d="M18 11h12"/>')),exec:Me('<path d="M16 5h16v17H16zM14 24h20M24 26v8M14 42l10-8 10 8M24 34v8"/>'+je('<path d="M12 20v6M36 20v6"/>')),stool:Me('<ellipse cx="24" cy="9" rx="9" ry="3"/><path d="M24 12v26M15 42h18"/>'+je('<ellipse cx="24" cy="28" rx="7" ry="2"/>')),lounge:Me('<path d="M8 20h32v6H8zM6 18v16h36V18M10 34v4M38 34v4M10 20v-6c0-2 2-3 4-3h20c2 0 4 1 4 3v6"/>'+je('<path d="M24 20v6"/>')),counter:Me('<path d="M5 13h38M7 13v25h34V13"/>'+je('<path d="M11 30h26"/>')+gu('<path d="M11 19h26"/>')),tv:Me('<rect x="5" y="8" width="38" height="23" rx="2"/><path d="M24 31v7M15 40h18"/>'+fi('<rect x="9" y="12" width="30" height="15" rx="1"/>')),screen:Me('<path d="M7 7v35M41 7v35M7 9h34M7 32h34M4 42h6M38 42h6"/>'+je('<path d="M14 15h20"/>')),led:Me('<rect x="4" y="6" width="40" height="26"/><path d="M12 32v8M36 32v8M8 40h8M32 40h8"/>'+fi('<path d="M17.3 6v26M30.6 6v26M4 19h40"/>')),ledtrailer:Me('<rect x="8" y="4" width="32" height="18"/><path d="M24 22v8M6 30h34M44 34l-4-4"/><circle cx="16" cy="36" r="4"/><circle cx="28" cy="36" r="4"/>'+fi('<rect x="11" y="7" width="26" height="12"/>')),ledposter:Me('<rect x="17" y="3" width="14" height="36" rx="1"/><path d="M13 44h22M24 39v5"/>'+fi('<rect x="20" y="6" width="8" height="30"/>')),laptop:Me('<path d="M4 37h40l-3-5H7z"/><rect x="10" y="10" width="28" height="20" rx="2"/>'+fi('<rect x="13" y="13" width="22" height="14"/>')),ipad:Me('<rect x="14" y="5" width="20" height="28" rx="3" transform="rotate(8 24 19)"/><path d="M18 42h14M25 33l-2 9"/>'+fi('<rect x="17" y="9" width="14" height="20" rx="1" transform="rotate(8 24 19)"/>')),monitor:Me('<rect x="5" y="7" width="38" height="24" rx="2"/><path d="M24 31v7M16 40h16"/>'+fi('<rect x="9" y="11" width="30" height="16"/>')),kiosk:Me('<rect x="15" y="4" width="18" height="38" rx="2"/><path d="M11 44h26"/>'+fi('<rect x="18" y="8" width="12" height="18" rx="1"/>')+je('<path d="M18 34h12"/>')),tower:Me('<rect x="14" y="4" width="20" height="40" rx="2"/><path d="M18 12h12M18 16h12"/>'+gu('<circle cx="24" cy="36" r="2"/>')),speaker:Me('<rect x="14" y="3" width="20" height="23" rx="2"/><circle cx="24" cy="17" r="5"/><path d="M24 26v10M24 36l-9 7M24 36l9 7"/>'+je('<circle cx="24" cy="8" r="1.5"/>')),podium:Me('<path d="M12 14h24l-2 28H14zM10 10l28 4M18 42h12"/>'+je('<path d="M17 24h14"/>')),powerbox:Me('<rect x="7" y="12" width="34" height="24" rx="3"/><path d="M14 8h20M12 40v-4M36 40v-4"/>'+je('<path d="M26 16l-6 9h8l-6 9"/>')),drape:Me('<path d="M6 6v36M42 6v36M6 7h36M3 42h6M39 42h6"/>'+je('<path d="M10 9c2 10 2 22 0 31M18 9c-2 10-2 22 0 31M26 9c2 10 2 22 0 31M34 9c-2 10-2 22 0 31"/>')),booth:Me('<path d="M6 12l12-6h24v24l-12 6M6 12v24h24M30 36V12M6 12h24M42 6L30 12"/>'+je('<path d="M14 18h12"/>'))},D_={table:"table",round:"round",chair:"chair",stool:"stool",lounge:"lounge",counter:"counter",tv:"tv",screen:"screen",led:"led",ledtrailer:"ledtrailer",ledposter:"ledposter",laptop:"laptop",ipad:"ipad",monitor:"monitor",kiosk:"kiosk",tower:"tower",speaker:"speaker",podium:"podium",powerbox:"powerbox",drape:"drape",booth:"booth"},N_=n=>n.icon||an[n.id]||an[D_[n.shape]]||an.table,U_={tables:an.table,seating:an.chair,counters:an.counter,tvs:an.tv,led:an.led,computers:an.laptop,kiosks:an.kiosk,audio:an.speaker,power:an.powerbox,decor:an.drape},wd=an,nn=.33,no=10,xu=40,bd=[{id:"none",name:"No walls",w:0,l:0},{id:"20x20",name:"20 × 20",w:20,l:20},{id:"30x40",name:"30 × 40",w:30,l:40},{id:"50x100",name:"50 × 100",w:50,l:100},{id:"100x150",name:"100 × 150",w:100,l:150}],O_={indoor:"30x40",outdoor:"none"},jo=(n,t,e=0,i=0)=>({pts:[[e,i],[e+n,i],[e+n,i+t],[e,i+t]],closed:!0}),F_=n=>{const t=bd.find(e=>e.id===n);return t&&t.w?[jo(t.w,t.l)]:[]},io=Number.isFinite;function ur(n){const t=[];return n.forEach((e,i)=>{const r=e.pts.length,o=e.closed?r:r-1;for(let a=0;a<o;a++){const l=e.pts[a],c=e.pts[(a+1)%r];Math.hypot(c[0]-l[0],c[1]-l[1])>1e-6&&t.push({pi:i,i:a,a:l,b:c})}}),t}function In(n){let t=1/0,e=-1/0,i=1/0,r=-1/0;for(const o of n)for(const[a,l]of o.pts)t=Math.min(t,a),e=Math.max(e,a),i=Math.min(i,l),r=Math.max(r,l);return t===1/0?null:{minX:t,maxX:e,minZ:i,maxZ:r,w:e-t,l:r-i}}const Ed=n=>Math.abs(n.reduce((t,[e,i],r)=>{const[o,a]=n[(r+1)%n.length];return t+e*a-o*i},0))/2;function Td(n,t,e){let i=!1;for(let r=0,o=e.length-1;r<e.length;o=r++){const[a,l]=e[r],[c,h]=e[o];l>t!=h>t&&n<(c-a)*(t-l)/(h-l)+a&&(i=!i)}return i}function zs(n){const t=n.filter(r=>r.closed&&r.pts.length>=3),e=n.filter(r=>!r.closed&&r.pts.length>=1),i=[];if(e.length){const r=In(e);i.push({x0:r.minX-no,z0:r.minZ-no,x1:r.maxX+no,z1:r.maxZ+no})}return!t.length&&!e.length&&i.push({x0:0,z0:0,x1:xu,z1:xu}),{polys:t.map(r=>r.pts),rects:i}}const z_=(n,t,e)=>n.rects.some(i=>t>=i.x0&&t<=i.x1&&e>=i.z0&&e<=i.z1)||n.polys.some(i=>Td(t,e,i));function Zo(n){let t=1/0,e=-1/0,i=1/0,r=-1/0;for(const o of n.rects)t=Math.min(t,o.x0),e=Math.max(e,o.x1),i=Math.min(i,o.z0),r=Math.max(r,o.z1);for(const o of n.polys)for(const[a,l]of o)t=Math.min(t,a),e=Math.max(e,a),i=Math.min(i,l),r=Math.max(r,l);return{minX:t,maxX:e,minZ:i,maxZ:r,w:e-t,l:r-i}}function Ad(n){const t=[];for(const e of Fc(n)){const[i,r]=e.a,[o,a]=e.b,l=Math.hypot(o-i,a-r),c=(o-i)/l,h=(a-r)/l,u=-h,f=c;for(const d of[1,-1]){const p=d*nn/2;t.push({x1:i+u*p,z1:r+f*p,x2:o+u*p,z2:a+f*p,nx:d*u,nz:d*f,src:"room",host:null,seg:e})}}return t}const Cd=n=>Fc(n).map(t=>{const[e,i]=t.a,[r,o]=t.b,a=Math.hypot(r-e,o-i);return{x:(e+r)/2,z:(i+o)/2,a:Math.atan2(-(o-i)/a,(r-e)/a),w:a,d:nn,seg:t}}),_i=n=>n>=600?25:n>=160?10:n>=80?5:n>=30?1:.5,Rd=()=>.5;function k_(n,t,e){if(t==null||!n[t]||n[t].closed)return n.push({pts:[[e.x,e.z]],closed:!1}),n.length-1;const i=n[t];if(e.close&&i.pts.length>=3)return i.closed=!0,null;const[r,o]=i.pts[i.pts.length-1];return Math.hypot(e.x-r,e.z-o)<1e-6||i.pts.push([e.x,e.z]),t}function B_(n,t,e){const i=n[t];if(!i)return;const r=(i.doors||[]).filter(o=>o.i!==e);if(i.closed){const o=i.pts.length;i.pts=[...i.pts.slice(e+1),...i.pts.slice(0,e+1)],i.closed=!1,i.doors=r.map(a=>({i:(a.i-e-1+o)%o,t:a.t}))}else{const o=i.pts.slice(0,e+1),a=i.pts.slice(e+1),l={pts:o,closed:!1,doors:r.filter(h=>h.i<e)},c={pts:a,closed:!1,doors:r.filter(h=>h.i>e).map(h=>({...h,i:h.i-e-1}))};n.splice(t,1,...[l,c].filter(h=>h.pts.length>=2))}for(let o=n.length-1;o>=0;o--)n[o].pts.length<2&&n.splice(o,1)}const Do=n=>+n.toFixed(1);function Dc(n){const t=In(n);if(!t)return"No walls · open floor";const e=n.filter(i=>i.closed&&i.pts.length>=3).reduce((i,r)=>i+Ed(r.pts),0);return`${Do(t.w)} x ${Do(t.l)} ft${e?` · ${Math.round(e)} sq ft`:" · open walls"}`}const _o=n=>n>=10?`${Do(n)} ft`:`${Do(n)} ft`;function H_(n){return(Array.isArray(n)?n:[]).map(t=>({pts:(Array.isArray(t&&t.pts)?t.pts:[]).filter(e=>Array.isArray(e)&&io(e[0])&&io(e[1])).map(e=>[e[0],e[1]]),closed:!!(t&&t.closed),doors:(Array.isArray(t&&t.doors)?t.doors:[]).filter(e=>e&&Number.isInteger(e.i)&&io(e.t)).map(e=>({i:e.i,t:e.t,...e.k==="dock"||e.k==="svc"?{k:e.k}:{},...io(e.w)&&e.w>Fe?{w:Math.min(2e3,+(+e.w).toFixed(2))}:{}}))})).filter(t=>t.pts.length>=2||t.pts.length===1&&!t.closed).map(t=>t.pts.length<3?{...t,closed:!1}:t)}function G_(n){let t=1/0,e=-1/0,i=1/0,r=-1/0;for(const o of n||[]){const a=/^(-?\d+),(-?\d+)$/.exec(o);if(!a)continue;const l=+a[1],c=+a[2];t=Math.min(t,l),e=Math.max(e,l+1),i=Math.min(i,c),r=Math.max(r,c+1)}return t===1/0?[]:[jo(e-t,r-i,t,i)]}const zi=(n,t)=>Math.round(n/t)*t,V_=n=>Math.max(1.25,n*.6),W_=n=>Math.max(3,n*1.5);function $_(n,t,e){const i=zi(Math.min(n[0],t[0]),e),r=zi(Math.max(n[0],t[0]),e),o=zi(Math.min(n[1],t[1]),e),a=zi(Math.max(n[1],t[1]),e);return r-i>0&&a-o>0?jo(r-i,a-o,i,o):null}function X_(n){const t=[];for(const e of n)for(const i of e.pts)t.push(i);return t}function q_(n,t,e,i,r,o){const a=t!=null&&n[t]&&!n[t].closed?n[t]:null,l=V_(r),c=X_(n);if(!a){let T=null,I=null,Z=zi(e,r),M=zi(i,r);for(const[B,H]of c)T==null&&Math.abs(e-B)<=l&&(Z=B,T=[B,H]),I==null&&Math.abs(i-H)<=l&&(M=H,I=[B,H]);const b=[];return T&&b.push([T,[Z,M]]),I&&b.push([I,[Z,M]]),{x:Z,z:M,close:!1,guides:b,aligned:b.length>0}}const[h,u]=a.pts[0],[f,d]=a.pts[a.pts.length-1];if(a.pts.length>=3&&Math.hypot(e-h,i-u)<=W_(r))return{x:h,z:u,close:!0,guides:[],aligned:!0};const p=e-f,x=i-d,v=Math.max(1,r*.5),m=Math.abs(p),g=Math.abs(x);if(o.axis)o.axis==="x"&&g>m*1.8+v?o.axis="z":o.axis==="z"&&m>g*1.8+v&&(o.axis="x");else{if(Math.max(m,g)<v)return{x:f,z:d,close:!1,guides:[],aligned:!1,idle:!0};o.axis=m>=g?"x":"z"}const y=o.axis==="x"?e:i;let _=zi(y,r),S=null,P=l;for(const T of c){if(T===a.pts[a.pts.length-1])continue;const I=o.axis==="x"?T[0]:T[1],Z=Math.abs(y-I);Z<=P&&(P=Z,_=I,S=T)}const C=o.axis==="x"?{x:_,z:d}:{x:f,z:_};return{...C,close:!1,axis:o.axis,guides:S?[[S,[C.x,C.z]]]:[],aligned:!!S}}const Y_=(n,t,e,i)=>{const r=(a,l,c)=>Math.sign((l[0]-a[0])*(c[1]-a[1])-(l[1]-a[1])*(c[0]-a[0])),o=(a,l)=>a[0]===l[0]&&a[1]===l[1];return o(n,e)||o(n,i)||o(t,e)||o(t,i)?!1:r(n,t,e)*r(n,t,i)<0&&r(e,i,n)*r(e,i,t)<0},Mo=(n,t)=>n[0]===t[0]||n[1]===t[1];function Nc(n){if(!n||n.closed||n.pts.length<3)return null;const t=n.pts.map(u=>[...u]),e=t.length,i=t[0];if(e===4&&Mo(t[0],t[1])&&Mo(t[1],t[2])&&Mo(t[2],t[3])){const u=t[0][0]===t[1][0],f=t[2][0]===t[3][0];if(u===f){const d=t[3];if(t[3]=u?[t[2][0],i[1]]:[i[0],t[2][1]],(t[3][0]!==d[0]||t[3][1]!==d[1])&&(t[3][0]!==t[2][0]||t[3][1]!==t[2][1]))return{pts:t,ghost:[t[2],t[3],i],u:!0}}}const r=t[e-1];if(r[0]===i[0]||r[1]===i[1])return{pts:t,ghost:[r,i]};const o=[];for(let u=0;u<e-1;u++)o.push([t[u],t[u+1]]);const a=u=>![[r,u],[u,i]].some(([f,d])=>o.some(([p,x])=>Y_(f,d,p,x))),l=[i[0],r[1]],c=[r[0],i[1]],h=a(l)||!a(c)?l:c;return{pts:[...t,h],ghost:[r,h,i]}}function Pd(n,t){const e=n[t],i=Nc(e);return i?(e.pts=i.pts,e.closed=!0,zc([e]),null):t}const ec=n=>n&&n.closed&&n.pts.length===4&&n.pts.every((t,e)=>Mo(t,n.pts[(e+1)%4]));function j_(n,t,e,i){if(!ec(n)){n.pts[t]=[e,i];return}const[r,o]=n.pts[t],a=n.pts.map(c=>[...c]);for(const c of[(t+3)%4,(t+1)%4])a[c][0]===r?a[c][0]=e:a[c][1]===o&&(a[c][1]=i);a[t]=[e,i];const l=In([{pts:a}]);l.w>0&&l.l>0&&ec({closed:!0,pts:a})&&(n.pts=a)}const Fe=3,xs=nn/2,ni=(n,t)=>{const e=n.pts.length,i=n.pts[t],r=n.pts[(t+1)%e];return i&&r?Math.hypot(r[0]-i[0],r[1]-i[1]):0},Cs=n=>n.closed?n.pts.length:n.pts.length-1,Uc=(n,t)=>(n.doors||[]).filter(e=>e.i===t),pn=n=>n&&n.w>Fe?n.w:Fe,Id=(n,t=Fe)=>[xs+t/2,n-xs-t/2];function Oc(n,t,e,i,r=.5){const o=n[t];if(!o||e<0||e>=Cs(o))return{error:"Tap a wall to add a door"};const a=ni(o,e),[l,c]=Id(a);if(c<l-1e-9)return{error:"This wall is too short for a door"};const h=x=>Math.min(c,Math.max(l,x));let u=h(Math.round(i/r)*r);u!==Math.round(i/r)*r&&(u=h(u));const f=Uc(o,e),d=x=>x>=l-1e-9&&x<=c+1e-9&&f.every(v=>Math.abs(v.t-x)>=(pn(v)+Fe)/2-1e-9);if(!d(u)){const x=f.filter(m=>Math.abs(m.t-u)<(pn(m)+Fe)/2-1e-9).sort((m,g)=>Math.abs(m.t-u)-Math.abs(g.t-u))[0];if(u=[x.t+(pn(x)+Fe)/2,x.t-(pn(x)+Fe)/2].sort((m,g)=>Math.abs(m-i)-Math.abs(g-i)).find(d),u==null)return{error:"No room for another door here"}}const p={i:e,t:+u.toFixed(4)};return(o.doors||(o.doors=[])).push(p),{door:p}}function Ld(n,t){const e=Uc(n,t).map(r=>[r.t-pn(r)/2,r.t+pn(r)/2]).sort((r,o)=>r[0]-o[0]),i=[];for(const r of e){const o=i[i.length-1];o&&r[0]<=o[1]+1e-6?o[1]=Math.max(o[1],r[1]):i.push([...r])}return i}function Fc(n){const t=[];for(const e of ur(n)){const i=n[e.pi],r=Ld(i,e.i);if(!r.length){t.push(e);continue}const o=Math.hypot(e.b[0]-e.a[0],e.b[1]-e.a[1]),a=(e.b[0]-e.a[0])/o,l=(e.b[1]-e.a[1])/o,c=u=>[e.a[0]+a*u,e.a[1]+l*u];let h=0;for(const[u,f]of r)u-h>1e-6&&t.push({...e,a:c(h),b:c(u)}),h=f;o-h>1e-6&&t.push({...e,a:c(h),b:e.b})}return t}function vr(n){const t=[];return n.forEach((e,i)=>(e.doors||[]).forEach((r,o)=>{const a=e.pts.length,l=e.pts[r.i],c=e.pts[(r.i+1)%a];if(!l||!c)return;const h=Math.hypot(c[0]-l[0],c[1]-l[1]);if(!h)return;const u=(c[0]-l[0])/h,f=(c[1]-l[1])/h;t.push({pi:i,k:o,i:r.i,t:r.t,w:pn(r),dock:r.k==="dock",svc:r.k==="svc",x:l[0]+u*r.t,z:l[1]+f*r.t,ux:u,uz:f})})),t}function Z_(n,t,e,i=1){let r=null,o=1/0;for(const a of vr(n)){const l=(t-a.x)*a.ux+(e-a.z)*a.uz,c=Math.abs(-(t-a.x)*a.uz+(e-a.z)*a.ux);if(Math.abs(l)<=a.w/2&&c<=i){const h=Math.abs(l)+c;h<o&&(o=h,r=a)}}return r}function K_(n,t,e){const i=n[t];i&&i.doors&&i.doors.splice(e,1)}function No(n,t,e){let i=null;for(const r of ur(n)){const[o,a]=r.a,[l,c]=r.b,h=Math.hypot(l-o,c-a),u=Math.max(0,Math.min(h,((t-o)*(l-o)+(e-a)*(c-a))/h)),f=Math.hypot(o+(l-o)*u/h-t,a+(c-a)*u/h-e);(!i||f<i.dist)&&(i={pi:r.pi,i:r.i,t:u,dist:f})}return i}function zc(n){for(const t of n){if(!t.doors||!t.doors.length)continue;const e=[],i=Cs(t);for(const r of t.doors.slice().sort((o,a)=>o.i-a.i||o.t-a.t)){if(r.i<0||r.i>=i)continue;const o=ni(t,r.i),a=Math.min(pn(r),Math.max(Fe,o-2*xs)),[l,c]=Id(o,a);if(c<l-1e-9)continue;const h=Math.min(c,Math.max(l,r.t));if(e.some(f=>f.i===r.i&&Math.abs(f.t-h)<(pn(f)+a)/2-1e-9))continue;const u={...r,t:h};a>Fe?u.w=a:delete u.w,e.push(u)}t.doors=e}}function J_(n,t,e,i,r,o=.5){const a=n[t],l=a&&a.doors&&a.doors[e];if(!l)return null;const c=ni(a,l.i),h=pn(l),u=l.t-h/2,f=l.t+h/2,d=Uc(a,l.i).filter(_=>_!==l),p=Math.max(xs,...d.filter(_=>_.t<l.t).map(_=>_.t+pn(_)/2)),x=Math.min(c-xs,...d.filter(_=>_.t>l.t).map(_=>_.t-pn(_)/2));let v=Math.round(r/o)*o,m=u,g=f;i<0?m=Math.max(p,Math.min(v,f-Fe)):g=Math.min(x,Math.max(v,u+Fe));const y=+(g-m).toFixed(4);return l.t=+((m+g)/2).toFixed(4),y>Fe+1e-6?l.w=y:delete l.w,{w:pn(l),t:l.t,max:+(c-2*xs).toFixed(2)}}function Q_(n,t,e,i){const r=(n.doors||[]).map(o=>({d:o,L:ni(n,o.i)}));j_(n,t,e,i);for(const{d:o,L:a}of r){const l=ni(n,o.i);a>0&&l>0&&(o.t=Math.round(o.t/a*l*2)/2)}zc([n])}function tM(n){const t=Cs(n),e=(n.doors||[]).map(i=>ni(n,i.i));if(n.pts.reverse(),n.closed){const i=n.pts.length;n.doors=(n.doors||[]).map((r,o)=>({i:(2*i-2-r.i)%i,t:e[o]-r.t}))}else n.doors=(n.doors||[]).map((i,r)=>({i:t-1-i.i,t:e[r]-i.t}))}function Dd(n,t){const e=n.pts.length,i=n.pts[t],r=n.pts[(t+1)%e],o=Math.hypot(r[0]-i[0],r[1]-i[1])||1;return[-(r[1]-i[1])/o,(r[0]-i[0])/o]}function vu(n,t,e){const i=n.pts.length,r=Cs(n);if(t<0||t>=r||!e)return!e;const[o,a]=Dd(n,t),l=t,c=(t+1)%i,h=n.pts.map(d=>[...d]),u=n.pts.map((d,p)=>ni(n,p));h[l]=[h[l][0]+o*e,h[l][1]+a*e],h[c]=[h[c][0]+o*e,h[c][1]+a*e],{...n};for(const d of[t-1,t+1]){const p=n.closed?(d+r)%r:d;if(p<0||p>=r||p===t)continue;const x=n.pts[p],v=n.pts[(p+1)%i],m=h[p],g=h[(p+1)%i],y=[v[0]-x[0],v[1]-x[1]],_=[g[0]-m[0],g[1]-m[1]];if(Math.hypot(..._)<1-1e-9||y[0]*_[0]+y[1]*_[1]<=0)return!1}n.pts=h;const f=n.closed?(t+1)%r:t+1;if(n.doors)for(const d of n.doors)d.i===f&&f!==t&&(d.t+=ni(n,f)-u[f]);return zc([n]),!0}const _u=(n,t,e,i)=>{const r=(o,a,l)=>Math.sign((a[0]-o[0])*(l[1]-o[1])-(a[1]-o[1])*(l[0]-o[0]));return r(n,t,e)*r(n,t,i)<0&&r(e,i,n)*r(e,i,t)<0};function Wa(n,t){const e=n[t];if(!e||e.pts.length<2)return!1;const i=Cs(e),r=e.pts.length,o=(a,l)=>[a.pts[l],a.pts[(l+1)%a.pts.length]];for(let a=0;a<i;a++)if(ni(e,a)<1-1e-9)return!1;for(let a=0;a<i;a++){const[l,c]=o(e,a);for(let h=a+2;h<i;h++){if(e.closed&&a===0&&h===i-1)continue;const[u,f]=o(e,h);if(_u(l,c,u,f))return!1}for(let h=0;h<n.length;h++){if(h===t)continue;const u=n[h];for(let f=0;f<Cs(u);f++){const[d,p]=o(u,f);if(_u(l,c,d,p))return!1}}}return r>=2}const Nd=[],Ud=[],kc=[];function Lt(n){Nd.push(n)}function eM(n){Ud.push(n)}function _r(n){kc.push(n)}const Bc=(n,t)=>(n.order??0)-(t.order??0)||String(n.id).localeCompare(String(t.id)),nM=()=>Nd.slice().sort(Bc),iM=()=>Ud.slice().sort(Bc),sM=()=>kc.slice().sort(Bc),rM=n=>kc.find(t=>t.id===n)||null,so=n=>Math.round(n/12*1e3)/1e3;function Dt(n,t,e,i,r,o,a,l,c={}){return{order:n,id:t,cat:e,name:i,w:so(r),d:so(o),h:so(a),shape:l,snapsTo:[],...c,top:c.topIn?so(c.topIn):void 0}}const Mu={};function ot(n,t,e={}){return Mu[n]||(Mu[n]=new ve({color:t,...e}))}function it(n,t,e,i,r,o=0,a=0,l=0){const c=new Bt(new re(t,e,i),r);return c.position.set(o,a,l),n.add(c),c}function de(n,t,e,i,r,o=0,a=0,l=0,c=20){const h=new Bt(new cn(t,e,i,c),r);return h.position.set(o,a,l),n.add(h),h}const sr={w:7.76,d:5.98,h:1.65},yo={dia:1.46,len:6.93},vs={w:sr.w+yo.dia,d:Math.max(sr.d,yo.len),h:Math.max(sr.h,yo.dia)},oM="Unconfirmed size. Not confirmed for the floor plan.",aM=["Unconfirmed. Receiver is the Shure SLXD4 candidate, 7.76 × 5.98 × 1.65 in. Handheld is the SM58 candidate, 1.46 in diameter × 6.93 in. The footprint is those two parts with no gap between them.","Lav and headset body sizes are not in missing-products.xlsx, so they are not drawn as sized parts.","Bob has not confirmed that mics show on the floor plan. The Atlas MS-12C stand (10 in base, 34–62 in) is listed on the same row and is not a separate item."],lM=nt.colors.fg,cM=nt.colors.highlight,Od=nt.colors.accent,hM=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${lM}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="18" width="22" height="12" rx="1"/><rect x="30" y="16" width="8" height="16" rx="4" stroke="${cM}"/><path d="M10 24h8" stroke="${Od}"/></svg>`;function uM(n,t){const e=ot("micRx",2765112),i=ot("micRxFace",1711652),r=ot("micHand",12962256),o=ot("micBand",1711652),a=ot("micLed",ie(Od),{emissive:670276}),l=t.w*(sr.w/vs.w),c=t.w-l,h=t.d*(sr.d/vs.d),u=t.h*(yo.dia/vs.h);it(n,l,t.h,h,e,-t.w/2+l/2,t.h/2,0).name="micReceiver",it(n,l*.7,t.h*.28,.006,i,-t.w/2+l/2,t.h*.62,h/2-.006);const f=de(n,Math.min(.01,l*.04),Math.min(.01,l*.04),.006,a,-t.w/2+l*.72,t.h*.7,h/2-.008,8);f.rotation.x=Math.PI/2;const d=de(n,c/2,c/2,t.d,r,t.w/2-c/2,u/2,0,16);d.rotation.x=Math.PI/2,d.name="micHandheld";const p=de(n,c/2*.98,c/2*.98,t.d*.28,o,t.w/2-c/2,u/2,t.d*.12,12);p.rotation.x=Math.PI/2}const dM=Dt(52,"micset","audio","Wireless mic set",vs.w,vs.d,vs.h,"micset",{snapsTo:["top"],note:oM,flags:aM,icon:hM(),draw:uM,unconfirmed:!0,showOnPlan:"unconfirmed"});Lt(dM);const fM="UNCONFIRMED. Bob has not confirmed that Rentacomputer.com rents bars. The spreadsheet sizes only the front bar. Placeholder backbar 72 × 18 × 84 in (Luxe). Nearby listings are 72 × 18.5 × 84 and 72 × 18 × 83.",pM=nt.colors.fg,mM=nt.colors.highlight,gM=nt.colors.accent,xM=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${pM}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6h32v36H8z"/><path d="M8 18h32M8 30h32" stroke="${mM}"/><path d="M16 12h4M28 12h4M18 24h4" stroke="${gM}"/></svg>`;function vM(n,t){const e=ot("bbarFrame",2896444),i=ot("bbarShelf",9267781),r=ot("bbarBottle",1854010),o=ot("bbarAmber",12886362),a=.06;for(const u of[-1,1])it(n,a,t.h,a,e,u*(t.w/2-a/2),t.h/2,0);it(n,t.w,a,a,e,0,t.h-a/2,0).name="backbarFrame",it(n,t.w,a,t.d,e,0,a/2,0);const l=[.28,.5,.72];for(const u of l)it(n,t.w-a*2,.04,t.d*.72,i,0,t.h*u,-t.d*.08);const c=t.h*.72+.22;let h=-t.w*.32;for(let u=0;u<7;u++)de(n,.045,.05,.32,u%2?o:r,h,c,-t.d*.05,10),h+=t.w*.1}const _M=Dt(65,"backbar","counters","Backbar",72,18,84,"backbar",{snapsTo:["nearwall"],note:fM,icon:xM(),draw:vM,unconfirmed:!0});Lt(_M);const MM="UNCONFIRMED brand (Zebra or Epson). Generic shape. Size is the Zebra ZC300 single-sided candidate, 6.2 × 15.1 × 10.2 in. Dual-sided ZC300 is 18.4 in deep. Epson ColorWorks C3500 is 12.2 × 11.1 × 10.3 in.",yM=nt.colors.fg,SM=nt.colors.highlight,wM=nt.colors.accent,bM=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${yM}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="14" y="8" width="20" height="28" rx="2"/><path d="M18 36h12v4H18z"/><path d="M20 16h8M18 32h12" stroke="${SM}"/><circle cx="24" cy="23" r="3" stroke="${wM}"/></svg>`;function EM(n,t){const e=ot("badgeBody",2896184),i=ot("badgeLid",4015440),r=ot("badgeSlot",790034),o=ot("badgeCard",15196888),a=ot("badgeLed",6280447,{emissive:1333352});it(n,t.w,t.h,t.d,e,0,t.h/2,0).name="badgeBody",it(n,t.w*.86,.01,t.d*.5,i,0,t.h+.005,-t.d*.1);const l=t.w*.62,c=Math.min(.05,t.h*.1);it(n,l,c,.01,r,0,t.h*.42,t.d/2+.005),it(n,l*.72,.008,.02,o,0,t.h*.3,t.d/2+.004);const h=de(n,.012,.012,.012,a,t.w*.28,t.h*.72,t.d/2+.006,10);h.rotation.x=Math.PI/2}const TM=Dt(30,"badgeprinter","computers","Badge printer",6.2,15.1,10.2,"badgeprinter",{snapsTo:["top"],note:MM,icon:bM(),draw:EM,unconfirmed:!0});Lt(TM);Lt(Dt(26,"booth10","decor","10 × 10 booth (back and side walls)",120,120,96,"booth",{booth:!0,sideHIn:36}));Lt(Dt(27,"booth20","decor","10 × 20 booth (back and side walls)",240,120,96,"booth",{booth:!0,sideHIn:36}));Lt(Dt(10,"brandctr","counters","Branded counter",48,24,42,"counter",{topIn:42,snapsTo:["backwall"]}));const AM=[["tables","Tables"],["seating","Seating"],["counters","Counters"],["tvs","TVs and Screens"],["led","LED Walls"],["computers","Computers"],["kiosks","Kiosks"],["audio","Audio"],["power","Power distribution"],["decor","Decor and Booths"]];AM.forEach(([n,t],e)=>eM({id:n,name:t,order:e}));Lt(Dt(5,"chair","seating","Banquet chair",18,20,34,"chair",{snapsTo:["edge"],edgeKind:"chair"}));const $a={},$i=(n,t,e={})=>$a[n]||($a[n]=new ve({color:t,...e})),Te=n=>Math.round(n/12*1e3)/1e3,Ko=()=>$i("p40black",1382429),Rs=()=>$i("p40dark",2765376),dr=()=>$i("p40metal",9344931),CM=()=>$i("p40white",15197404),RM=()=>$i("p40rubber",1053206),Mr=()=>$i("p40teal",1731170,{emissive:670260}),Uo=()=>$i("p40bezel",922136);function yr(){return new he}function _e(n,t,e,i,r,o=0,a=0,l=0){const c=new Bt(new re(t,e,i),r);return c.position.set(o,a,l),n.add(c),c}function PM(n,t,e,i,r,o,a){const l=new Bt(new cn(t,t,e,12),i);return l.position.set(r,o,a),n.add(l),l}function Oo(n,t,e,i,r,o){const a=new ve({color:1324111,emissive:1466006,emissiveIntensity:.5}),l=new Bt(new re(t,e,.012),a);return l.name="screen",l.userData.ownMat=1,l.position.set(i,r,o),n.add(l),l}function Ps(n){return n.traverse(t=>{t.isMesh&&(t.castShadow=!1)}),n}function Sr(n){const t=nt.colors.fg,e=nt.colors.highlight,i=nt.colors.accent;return`<svg viewBox="0 0 48 48" fill="none" stroke="${t}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${n.replaceAll("{{O}}",e).replaceAll("{{T}}",i)}</svg>`}const nc=19,ic=8,sc=26;function IM(){const n=yr(),t=Te(nc),e=Te(ic),i=Te(sc);_e(n,t,i,e-.02,Rs(),0,i/2,-.01);const r=2,o=4,a=.03,l=.06,c=(t-l*2-a)/r,h=(i-l*2-a*(o-1))/o,u=e/2-.01;for(let f=0;f<r;f++)for(let d=0;d<o;d++){const p=-t/2+l+c/2+f*(c+a),x=l+h/2+d*(h+a);_e(n,c*.9,h*.88,.012,Ko(),p,x,u),_e(n,.02,h*.22,.008,dr(),p+c*.28,x,u+.004),_e(n,.018,.018,.008,Mr(),p-c*.26,x+h*.26,u+.004)}return Ps(n)}Lt(Dt(44,"charger","kiosks","Charging locker",nc,ic,sc,"charger",{snapsTo:["nearwall"],unconfirmed:!0,note:"Unconfirmed. ChargeTech 8-bay locker CT-300119, 19 × 8 × 26 in (retailer listings; maker sheet not opened). Floor unit against a wall; stand versus table is not confirmed.",gaps:["Maker spec sheet was not opened. Size is from two retailer listings in missing-products.xlsx.","Stand versus table is not confirmed. It is placed on the floor and can snap against a wall.","Bay opening size and door layout are not published. Eight doors are drawn 2 × 4 inside the 19 × 8 × 26 in body."],sources:["https://www.staples.com/chargetech-8-bay-charging-uv-disinfecting-locker-ct-300119/product_24467533","https://chargetech.com/products/guardian-8-charging-locker"],parts:{body:{wIn:nc,dIn:ic,hIn:sc},bays:8},mesh:IM,icon:Sr('<rect x="10" y="4" width="28" height="40" rx="2"/><path d="M24 8v32M14 14h20M14 24h20M14 34h20" stroke="{{T}}"/><circle cx="18" cy="18" r="1.2" stroke="{{O}}"/>')}));const LM="UNCONFIRMED model. Size is the ChargeTech Hightop Power Table candidate, 23.6 × 23.6 × 43.3 in. A pop-up table at 23.2 × 23.2 × 43.3 in is also listed. Square top; a round top is not confirmed.",DM=nt.colors.fg,NM=nt.colors.highlight,UM=nt.colors.accent,OM=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${DM}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="10" width="32" height="8" rx="1"/><path d="M24 18v18M16 40h16"/><path d="M18 14h4M26 14h4" stroke="${NM}"/><circle cx="24" cy="14" r="1.4" stroke="${UM}"/></svg>`;function FM(n,t){const e=ot("chargeTop",16052714),i=ot("chargeEdge",2765376),r=ot("chargePad",ie(nt.colors.accent),{emissive:670276}),o=ot("chargeWell",1712168),a=1.5/12;it(n,t.w,a,t.d,e,0,t.h-a/2,0).name="chargeTop";const l=1/12,c=t.w*.62;it(n,c,l,c,i,0,l/2,0),de(n,.22,.26,t.h-a-l,i,0,l+(t.h-a-l)/2,0,20),de(n,.16,.16,.02,r,0,t.h+.004,0,24);const h=t.w*.28;for(const[u,f]of[[-1,-1],[1,-1],[-1,1],[1,1]])de(n,.04,.04,.016,o,u*h,t.h+.002,f*h,12)}const zM=Dt(32,"chargetable","tables","Phone charging table",23.6,23.6,43.3,"chargetable",{topIn:43.3,note:LM,icon:OM(),draw:FM,unconfirmed:!0});Lt(zM);Lt(Dt(4,"conf","tables","Conference table",96,48,30,"table",{topIn:30,edgeFor:["chair"]}));const rc=24.375,oc=28.5,ac=36.875;function kM(){const n=yr(),t=Te(rc),e=Te(oc),i=Te(ac);_e(n,t,i-.08,e-.02,CM(),0,(i-.08)/2,-.01),_e(n,t*.94,.08,e*.84,Rs(),0,i-.04,-e*.02),_e(n,t*.62,i*.07,.012,Ko(),0,i*.7,e/2-.008),_e(n,t*.4,.035,.01,Mr(),0,i*.6,e/2-.008);for(const r of[.22,.36,.5])_e(n,t*.78,.02,.01,Rs(),0,i*r,e/2-.008);return Ps(n)}Lt(Dt(43,"copier","computers","Copier / multifunction printer",rc,oc,ac,"copier",{snapsTo:["nearwall"],unconfirmed:!0,note:"Unconfirmed model. Canon imageRUNNER ADVANCE DX C5840i, 24.375 × 28.5 × 36.875 in, from the maker spec in missing-products.xlsx.",gaps:["Which copier model is rented is still open. This is the candidate in missing-products.xlsx.","Control-panel size is not published. The front panel is a drawing inside the body and is not a video screen."],sources:["https://oip.manual.canon/USRMA-5488-zz-CS-5800-enUS/contents/devu-int-dev_spec-main_unit.html"],parts:{body:{wIn:rc,dIn:oc,hIn:ac}},mesh:kM,icon:Sr('<rect x="8" y="6" width="32" height="36" rx="2"/><path d="M12 14h24M14 32h20M14 36h20" stroke="{{T}}"/><rect x="14" y="18" width="20" height="8" rx="1" stroke="{{O}}"/>')}));const _s={wIn:6.06,dIn:11.5,hIn:12.77},Ms={wIn:24,dIn:8,hIn:18,flagged:!0},Fd=Ms.wIn+_s.wIn,zd=_s.dIn,BM=Ms.hIn;function HM(){const n=yr(),t={w:Te(Ms.wIn),d:Te(Ms.dIn),h:Te(Ms.hIn)},e={w:Te(_s.wIn),d:Te(_s.dIn),h:Te(_s.hIn)},i=Te(Fd),r=Te(zd),o=-i/2+t.w/2,a=i/2-e.w/2,l=r/2-t.d/2,c=r/2-e.d/2,h=t.h*.64,u=t.w*.94,f=.07,d=t.h-h/2;return _e(n,t.w,.05,t.d*.9,dr(),o,.025,l),_e(n,.06,Math.max(.08,d-h/2-.05),.05,dr(),o,.05+Math.max(.08,d-h/2-.05)/2,l+t.d*.08),_e(n,u,h,f,Uo(),o,d,l+t.d/2-f/2-.03),Oo(n,u-.08,h-.1,o,d,l+t.d/2-.012),_e(n,e.w,e.h,e.d-.02,Ko(),a,e.h/2,c-.01),_e(n,e.w*.72,e.h*.5,.012,Rs(),a,e.h*.55,r/2-.008),_e(n,.04,.04,.01,Mr(),a,e.h*.18,r/2-.008),Ps(n)}Lt(Dt(42,"desktop","computers","Desktop computer (tower and monitor)",Fd,zd,BM,"desktop",{snapsTo:["top"],unconfirmed:!0,note:"Unconfirmed bundle. Dell OptiPlex Tower 7020 is 6.06 × 11.5 × 12.77 in. The monitor is the existing flagged 24 × 8 × 18 in item, beside the tower with no gap.",gaps:['Combined size is not in missing-products.xlsx. The sheet sizes the tower only and says "+ existing monitor item".',"Monitor 24 × 8 × 18 in is the existing catalog item and is flagged (no confident source).","The monitor panel-versus-stand split is not published. The display is drawn inside that flagged envelope.","No gap is published between tower and monitor. They are drawn touching."],sources:["https://www.dell.com/support/manuals/en-us/optiplex-7020t-desktop/optiplex-tower-7020-owners-manual/dimensions-and-weight"],parts:{tower:_s,monitor:Ms},mesh:HM,icon:Sr('<rect x="3" y="8" width="28" height="18" rx="1.5"/><path d="M17 26v5M10 33h14" stroke="{{T}}"/><rect x="6" y="11" width="22" height="12" rx="1" stroke="{{O}}"/><rect x="34" y="14" width="10" height="22" rx="1"/>')}));const ys={wIn:48.7,dIn:1.1,hIn:27.9},Fo={wIn:36.1,dIn:25.3};function GM(){const n=yr(),t=Te(ys.wIn),e=Te(Fo.dIn),i=Te(ys.hIn),r=Te(Fo.wIn),o=Math.min(ys.dIn/12,e*.4),a=e/2-o/2-.03;_e(n,r,.06,e,Rs(),0,.03,0);for(const l of[-1,1])for(const c of[-1,1])PM(n,.04,.05,RM(),l*(r/2-.14),.025,c*(e/2-.14));for(const l of[-1,1])_e(n,.05,i*.72,.05,dr(),l*(t*.28),i*.36,a-o/2-.04);return _e(n,t,i,o,Uo(),0,i/2,a),Oo(n,t-.1,i-.12,0,i/2+.02,a+o/2+.01),_e(n,t*.28,.03,.008,Mr(),0,.1,a+o/2+.012),Ps(n)}Lt(Dt(40,"digisign","tvs","Digital signage on a floor stand",ys.wIn,Fo.dIn,ys.hIn,"digisign",{snapsTo:["nearwall"],unconfirmed:!0,note:"Unconfirmed overall height. Samsung QM55C panel 48.7 × 1.1 × 27.9 in on a Chief PFQUB base 36.1 × 25.3 in. Mount height is not published, so the model is only as tall as the panel.",gaps:["Overall stand height is not in missing-products.xlsx (column H is UNCONFIRMED). Item height is the panel height 27.9 in only.","Cart base thickness, pole height and caster size are not published. The 36.1 × 25.3 in base is a thin plate inside the panel height.","Candidate model only. Bob has not confirmed the stand or portrait versus landscape. The panel proportions are landscape."],sources:["https://www.samsung.com/latin_en/business/smart-signage/uhd-4k-signage/crystal-uhd-signage-qmc-lh55qmcebgcxgo/","https://shop.ccisolutions.com/StoreFront/jsp/pdf/CHI-PFQUB_drawing.pdf"],parts:{panel:ys,base:Fo},mesh:GM,icon:Sr('<rect x="8" y="6" width="32" height="20" rx="1.5"/><path d="M16 26v8M32 26v8M10 36h28M8 42h8M32 42h8" stroke="{{T}}"/><rect x="12" y="10" width="24" height="12" rx="1" stroke="{{O}}"/>')}));const VM="UNCONFIRMED size. The spreadsheet only numbers a 12 × 12 × 42 in pedestal. This display cube is a separate 24 × 24 × 24 in rental listing (Set Shop and Pro Party Rental). Not confirmed for Rentacomputer.com.",WM=nt.colors.fg,$M=nt.colors.highlight,XM=nt.colors.accent,qM=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${WM}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 18l16-8 16 8-16 8z"/><path d="M8 18v14l16 8 16-8V18" stroke="${$M}"/><path d="M24 26v14" stroke="${XM}"/></svg>`;function YM(n,t){const e=ot("cubeBody",16250352),i=ot("cubeCap",14999768),r=ot("cubeSeam",2765376);it(n,t.w,t.h-.08,t.d,e,0,(t.h-.08)/2,0).name="cubeBody",it(n,t.w,.08,t.d,i,0,t.h-.04,0),it(n,t.w*.72,.015,.012,r,0,t.h*.55,t.d/2-.004)}const jM=Dt(63,"displaycube","decor","Display cube",24,24,24,"displaycube",{topIn:24,snapsTo:["backwall"],note:VM,icon:qM(),draw:YM,unconfirmed:!0});Lt(jM);Lt(Dt(25,"drape","decor","Pipe and drape (10 ft section)",120,2,96,"drape",{wallHost:!0}));const ZM="UNCONFIRMED. Bob has not confirmed that Rentacomputer.com rents bars. missing-products.xlsx asks: Do we rent bars? Which model? Size is the CORT Posh 6 ft bar candidate, 72 × 30 × 40.25 in.",KM=nt.colors.fg,JM=nt.colors.highlight,QM=nt.colors.accent,t1=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${KM}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 16h38v6H5z"/><path d="M8 22v16M40 22v16M8 32h32" stroke="${JM}"/><path d="M12 26h10" stroke="${QM}"/></svg>`;function e1(n,t){const e=ot("ebarChrome",13225686),i=ot("ebarPanel",16184559),r=ot("ebarTop",1711652),o=.07;it(n,t.w,.08,t.d,r,0,t.h-.04,0).name="eventBarTop";for(const a of[-1,1])for(const l of[-1,1])it(n,o,t.h-.08,o,e,a*(t.w/2-o/2),(t.h-.08)/2,l*(t.d/2-o/2));it(n,t.w-o*2,t.h*.62,.04,i,0,t.h*.36,t.d/2-.06),it(n,t.w-.4,.04,t.d*.5,e,0,t.h*.45,-.04),it(n,t.w-.3,.035,.035,e,0,.35,t.d/2-.08)}const n1=Dt(64,"eventbar","counters","Event bar",72,30,40.25,"eventbar",{topIn:40.25,snapsTo:["nearwall"],note:ZM,icon:t1(),draw:e1,unconfirmed:!0});Lt(n1);Lt(Dt(6,"exec","seating","Executive chair",26,26,42,"chair",{snapsTo:["edge"],edgeKind:"chair"}));const i1="UNCONFIRMED cable size. The sheet gives the cable ramp only. This section uses that ramp's 36 in length and 2.31 in height for both depth and height so a run lines up with the ramps. It is not a sourced cable diameter or length. Sections snap end to end with other feeder cables.",s1=nt.colors.fg,kd=nt.colors.highlight,Bd=nt.colors.accent,r1=`<svg viewBox="0 0 48 48" fill="none" stroke="${s1}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 30c6-10 10-10 16 0s10 10 16 0"/><path d="M8 18h8M32 18h8" stroke="${kd}"/><path d="M22 34h6" stroke="${Bd}"/></svg>`;function o1(n,t){const e=ot("feederRubber",2303532),i=ot("feederBand",ie(kd)),r=ot("feederTick",ie(Bd)),o=t.h/2,a=de(n,o,o,t.w,e,0,o,0,18);a.rotation.z=Math.PI/2,a.name="feederCable";const l=de(n,o*.9,o*.9,t.w*.14,i,0,o,0,16);l.rotation.z=Math.PI/2,l.name="feederBand";const c=de(n,o*.55,o*.55,.04,r,t.w*.28,o,0,12);c.rotation.z=Math.PI/2}const a1=Dt(74,"feeder","power","Feeder cable",36,2.31,2.31,"feeder",{place:"end",note:i1,icon:r1,draw:o1,unconfirmed:!0,flags:["No sourced cable diameter or length. The sheet only lists the cable ramp.","Section length is the ramp's 36 in. Depth and height are the ramp's 2.31 in so the run lines up. This is not a sourced cable size.","Sections snap end to end with other feeder cables only."]});Lt(a1);const l1="UNCONFIRMED portable versus towable. Candidate is a Honda EU7000is with the handles folded, 33.4 × 27.6 × 28.4 in. Sits outside a closed room, on the outer face of the wall. Power distribution stays inside; this unit stays outside.",c1=nt.colors.fg,Hd=nt.colors.highlight,Gd=nt.colors.accent,h1=`<svg viewBox="0 0 48 48" fill="none" stroke="${c1}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="14" width="32" height="22" rx="2"/><path d="M14 36v4M34 36v4M16 14v-4h16v4"/><path d="M24 20l-4 6h6l-4 6" stroke="${Hd}"/><path d="M14 30h20" stroke="${Gd}"/></svg>`;function u1(n,t){const e=ot("genBody",4015184),i=ot("genRubber",1711394),r=ot("genStripe",15909424),o=ot("genPanel",1514274),a=ot("genHandle",12963028),l=ot("genLamp",ie(Gd),{emissive:1333352}),c=ot("genBolt",ie(Hd)),h=.22,u=.1,f=t.h-h-u;it(n,t.w,f,t.d,e,0,h+f/2,0).name="genBody",it(n,t.w*.62,u,.08,a,0,t.h-u/2,-t.d*.22).name="genHandle",it(n,t.w*.86,.07,.012,r,0,h+f*.62,t.d/2-.01).name="genStripe",it(n,t.w*.32,f*.42,.016,o,t.w*.16,h+f*.48,t.d/2-.012).name="genPanel",it(n,.08,.1,.01,c,-t.w*.22,h+f*.7,t.d/2-.008),it(n,.05,.05,.012,l,t.w*.34,h+f*.72,t.d/2-.01);const d=.11;for(const p of[-1,1])for(const x of[-1,1]){const v=de(n,d,d,.08,i,p*(t.w/2-.24),d,x*(t.d/2-.26),14);v.rotation.z=Math.PI/2,v.name="genWheel"}}const d1=Dt(73,"generator","power","Generator",33.4,27.6,28.4,"generator",{place:"outside",wallDIn:27.6,panelIn:1,note:l1,icon:h1,draw:u1,unconfirmed:!0,flags:["Portable versus towable is not confirmed. Envelope is the Honda EU7000is with handles folded, 33.4 × 27.6 × 28.4 in.","Indoors it sits outside the room, on the outer face of the wall. Outdoors it sits free on the ground.","Power distribution boxes stay inside the room. This unit stays outside."]});Lt(d1);const f1="UNCONFIRMED. The spreadsheet sizes only the 16 in cube and asks whether Rentacomputer.com rents bars. Placeholder 72 × 24 × 42 in from three rental pages. Other glow bars are listed at 72 × 12 × 42 and 72 × 22 × 48.",p1=nt.colors.fg,m1=nt.colors.highlight,g1=nt.colors.accent,x1=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${p1}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 18h36v14H6z"/><path d="M8 32v6M40 32v6M6 38h36" stroke="${m1}"/><path d="M10 22h28" stroke="${g1}"/></svg>`;function v1(n,t){const e=ot("glowBarFrame",12963028),i=ot("glowBarTop",1843755),r=ot("glowBarFace",ie(nt.colors.accent),{emissive:1333456,emissiveIntensity:.8}),o=.07;it(n,t.w,.08,t.d,i,0,t.h-.04,0).name="glowBarTop";for(const a of[-1,1])for(const l of[-1,1])it(n,o,t.h-.08,o,e,a*(t.w/2-o/2),(t.h-.08)/2,l*(t.d/2-o/2));it(n,t.w-.3,t.h*.55,.04,r,0,t.h*.38,t.d/2-.06).name="glowBarFace",it(n,t.w-.5,.04,t.d*.55,e,0,t.h*.42,-.05)}const _1=Dt(61,"glowbar","decor","LED glow bar",72,24,42,"glowbar",{topIn:42,note:f1,icon:x1(),draw:v1,unconfirmed:!0});Lt(_1);const M1="UNCONFIRMED. missing-products.xlsx asks which LED furniture pieces Rentacomputer.com rents. Size is the sheet's 16 × 16 × 16 in glow cube (three rental listings agree).",y1=nt.colors.fg,S1=nt.colors.highlight,w1=nt.colors.accent,b1=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${y1}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 30V16l14-8 14 8v14l-14 8z"/><path d="M10 16l14 8 14-8M24 24v16" stroke="${S1}"/><path d="M16 20l8 4 8-4" stroke="${w1}"/></svg>`;function E1(n,t){const e=ot("glowCubeEdge",1185308),i=ot("glowCubeFace",ie(nt.colors.accent),{emissive:1731839,emissiveIntensity:.85}),r=.05;it(n,t.w,t.h,r,i,0,t.h/2,t.d/2-r/2).name="glowFace",it(n,t.w,t.h,r,i,0,t.h/2,-t.d/2+r/2),it(n,r,t.h,t.d-r*2,i,t.w/2-r/2,t.h/2,0),it(n,r,t.h,t.d-r*2,i,-t.w/2+r/2,t.h/2,0),it(n,t.w-r*2,r,t.d-r*2,i,0,t.h-r/2,0),it(n,t.w-.08,.04,t.d-.08,e,0,.02,0)}const T1=Dt(60,"glowcube","decor","LED glow cube",16,16,16,"glowcube",{topIn:16,note:M1,icon:b1(),draw:E1,unconfirmed:!0});Lt(T1);const Xa={w:1.46,d:1.46,h:6.93},A1="Unconfirmed. Gooseneck length is not in the size sheet; shown as the sourced handheld body. Not confirmed for the floor plan.",C1=["Unconfirmed. missing-products.xlsx names a podium gooseneck and does not list a gooseneck length. No length was invented.","The mesh is the sourced SM58 body, 1.46 in diameter × 6.93 in, standing on a lectern (snaps to a top).","Bob has not confirmed that mics show on the floor plan."],R1=nt.colors.fg,P1=nt.colors.highlight,Vd=nt.colors.accent,I1=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${R1}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 40h16"/><path d="M24 40V16" stroke="${P1}"/><rect x="20" y="8" width="8" height="10" rx="4" stroke="${Vd}"/></svg>`;function L1(n,t){const e=ot("neckBody",12962256),i=ot("neckCap",1711652),r=ot("neckBand",ie(Vd),{emissive:670276}),o=de(n,t.w/2,t.w/2,t.h,e,0,t.h/2,0,20);o.name="gooseneckBody",de(n,t.w/2*.72,t.w/2*.72,t.h*.08,i,0,t.h*.9,0,16),de(n,t.w/2*.86,t.w/2*.86,t.h*.05,r,0,t.h*.22,0,16)}const D1=Dt(53,"gooseneck","audio","Podium gooseneck mic",Xa.w,Xa.d,Xa.h,"gooseneck",{snapsTo:["top"],note:A1,flags:C1,icon:I1(),draw:L1,unconfirmed:!0,showOnPlan:"unconfirmed"});Lt(D1);Lt(Dt(3,"hightop","tables","High-top cocktail table",30,30,42,"round",{topIn:42,round:!0,edgeFor:["stool"]}));const qa={w:5.78,d:5.08,h:1.15},N1="Unconfirmed size. Not confirmed for the floor plan.",U1=["Unconfirmed. missing-products.xlsx lists a Pepwave MAX BR1 Pro 5G candidate, 5.78 × 5.08 × 1.15 in, from the manufacturer datasheet. Rentacomputer.com has not confirmed the router.","Bob has not confirmed that the hotspot shows on the floor plan. The sheet asks whether it is a small table-top icon."],O1=nt.colors.fg,Wd=nt.colors.highlight,$d=nt.colors.accent,F1=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${O1}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="18" width="32" height="16" rx="2"/><path d="M16 18c0-4 4-6 8-6s8 2 8 6" stroke="${Wd}"/><circle cx="24" cy="26" r="2" stroke="${$d}"/></svg>`;function z1(n,t){const e=ot("hotBody",2370098),i=ot("hotTop",3423304),r=ot("hotLed",ie($d),{emissive:670276}),o=ot("hotMark",ie(Wd));it(n,t.w,t.h,t.d,e,0,t.h/2,0).name="hotspotBody",it(n,t.w*.84,t.h*.22,t.d*.72,i,0,t.h*.72,0);const a=de(n,t.w*.04,t.w*.04,.006,r,-t.w*.22,t.h*.62,t.d/2-.012,8);a.rotation.x=Math.PI/2,it(n,t.w*.18,t.h*.12,.006,o,t.w*.2,t.h*.55,t.d/2-.01)}const k1=Dt(57,"hotspot","computers","Wi-Fi hotspot",qa.w,qa.d,qa.h,"hotspot",{snapsTo:["top"],note:N1,flags:U1,icon:F1(),draw:z1,unconfirmed:!0,showOnPlan:"unconfirmed"});Lt(k1);const B1="UNCONFIRMED. Bob has not confirmed interpretation booths versus receivers only. Envelope is the ISO 4043 internal minimum for two interpreters, 63 × 63 × 79 in. Exterior size is not confirmed.",H1=nt.colors.fg,Xd=nt.colors.highlight,qd=nt.colors.accent,G1=`<svg viewBox="0 0 48 48" fill="none" stroke="${H1}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 40V14h32v26"/><path d="M8 18h32M24 18v22"/><path d="M14 26h6v8h-6z" stroke="${qd}"/><path d="M28 24h8" stroke="${Xd}"/></svg>`;function V1(n,t){const e=ot("iboothWall",15196886),i=ot("iboothTrim",ie(Xd)),r=ot("iboothGlass",ie(qd),{transparent:!0,opacity:.55}),o=ot("iboothFloor",2765120),a=.12,l=t.h-a-.06,c=.06+l/2;it(n,t.w,.06,t.d,o,0,.03,0).name="iboothFloor",it(n,t.w,a,t.d,e,0,t.h-a/2,0).name="iboothRoof",it(n,t.w,l,a,e,0,c,-t.d/2+a/2).name="iboothBack",it(n,a,l,t.d-a,e,-t.w/2+a/2,c,a/2).name="iboothSide",it(n,a,l,t.d-a,e,t.w/2-a/2,c,a/2);const h=Math.min(2.2,t.w*.4),u=Math.min(l*.86,l-.4),f=t.d/2-a/2,d=(t.w-h)/2,p=l-u;it(n,d,l,a,e,-t.w/2+d/2,c,f).name="iboothFront",it(n,d,l,a,e,t.w/2-d/2,c,f),p>.05&&it(n,h,p,a,e,0,.06+u+p/2,f),it(n,d*.5,1.05,.02,r,t.w/2-d/2,t.h*.62,t.d/2-.01).name="iboothWindow",it(n,.06,l*.9,t.d*.5,i,0,c,-t.d*.1).name="iboothDivider",it(n,t.w*.55,.035,.015,i,0,t.h-a-.03,f)}const W1=Dt(77,"ibooth","decor","Interpretation booth",63,63,79,"ibooth",{snapsTo:["nearwall"],note:B1,icon:G1,draw:V1,unconfirmed:!0,flags:["Bob has not confirmed interpretation booths versus receivers only.","Envelope is the ISO 4043 internal minimum for two interpreters, 63 × 63 × 79 in. Exterior size is not confirmed.","Sits against a wall."]});Lt(W1);Lt(Dt(18,"ipad","computers","iPad on a stand",10,7,9,"ipad",{snapsTo:["top"]}));const Ya={},Ie=(n,t,e={})=>Ya[n]||(Ya[n]=new ve({color:t,...e})),gt=n=>n/12,Yd=Math.hypot(16,9),jd=55,Zd=jd*16/Yd,Kd=jd*9/Yd;function We(n,t,e,i,r,o,a,l){const c=new Bt(new re(t,e,i),r);return c.position.set(o,a,l),n.add(c),c}function lc(n,t,e,i,r,o,a){const l=new Bt(new cn(t,t,e,16),i);return l.position.set(r,o,a),n.add(l),l}function Hc(n,t,e,i,r,o,a){const l=new ve({color:1784405,emissive:928324}),c=new Bt(new re(t,e,i),l);return c.position.set(r,o,a),c.name="screen",c.userData.screen=1,c.userData.ownMat=1,n.add(c),c}const yu=(n,t,e)=>[n,t,e].map(i=>Math.round(i*1e3)).join(","),Su=new Map,$1=15855593;let wu=!1;function Gc(n,t,e,i){if(Su.set(yu(n,t,e),i),wu)return;wu=!0;const r=he.prototype.add;he.prototype.add=function(a){const l=a&&a.isMesh&&a.geometry&&a.geometry.parameters,c=a&&a.material&&a.material.color&&a.material.color.getHex(),h=l&&!this.userData._espShape&&this.children.length===0&&c===$1&&Su.get(yu(l.width,l.height,l.depth));if(h&&Math.abs(a.position.y*2-l.height)<1e-4&&a.position.x===0&&a.position.z===0){this.userData._espShape=1;try{h(this)}finally{delete this.userData._espShape,a.geometry.dispose()}return this}return r.apply(this,arguments)}}const Dn=Dt(20,"kiosk","kiosks","iPad / tablet kiosk",18,18,48,"kiosk",{snapsTo:["backwall"]}),ja=16251130,X1=1843496,q1=1316894,Y1=ie(nt.colors.accent),j1=40,bu=n=>n*Math.PI/180;function Z1(n){const{w:t,h:e,d:i}=Dn,r=gt(.45),o=gt(.65),a=We(n,t,r,i,Ie("ipadPad",X1),0,r/2,0);a.name="kioskPad";const l=We(n,t-gt(.35),o,i-gt(.35),Ie("ipadWhite",ja),0,r+o/2,0);l.name="kioskBase";const c=gt(9),h=gt(4.5),u=r+o,f=gt(13.5),d=gt(5.4),p=gt(5.6),x=gt(12.2),v=gt(8.5),m=gt(.62),g=bu(j1),y=v/2*Math.cos(g)+m/2*Math.sin(g),_=e-y-gt(.15),S=gt(1.15),C=_-v/2*Math.cos(g)+gt(.35)-d/2,T=gt(.35),Z=C-d/2+gt(.4)-u,M=We(n,c,Z,h,Ie("ipadWhite",ja),0,u+Z/2,gt(.05));M.name="kioskPedestal";const b=We(n,f,d,p,Ie("ipadWhite",ja),0,C,T);b.name="kioskHead";const B=T+p/2,H=We(n,gt(4.6),gt(2.8),gt(.12),Ie("ipadRecess",1316894),gt(-1.6),C+gt(.2),B+gt(.02));H.name="kioskSensor";const U=lc(n,gt(.7),gt(.08),Ie("ipadLens",790550),gt(-1.6),C+gt(.2),B+gt(.1));U.rotation.x=Math.PI/2,We(n,gt(1.5),gt(1.05),gt(.08),Ie("ipadWell",15265524),gt(1.85),C-gt(.05),B+gt(.02)),We(n,gt(.28),gt(.28),gt(.05),Ie("ipadAccent",Y1),gt(1.45),C+gt(.7),B+gt(.05)),We(n,gt(.22),gt(.22),gt(.05),Ie("ipadPip",16054267),gt(2.15),C+gt(.7),B+gt(.05));const z=new he;z.name="kioskTablet",z.position.set(0,_,S),z.rotation.x=-g,We(z,x,v,m,Ie("ipadBezel",q1),0,0,0);const L=x-gt(.72),W=v-gt(.72),k=gt(.08),Y=Hc(z,L,W,k,0,0,m/2-k/2+gt(.02));Y.userData.isScreenFace=!0,n.add(z);const et=new he;et.name="kioskReaderMount",et.rotation.x=-bu(34);const j=C-d/2;et.position.set(0,j-gt(.7),B+gt(1.7));const xt=We(et,gt(3.2),gt(.7),gt(3.4),Ie("ipadBracket",1711652),0,gt(.85),gt(-1.15));xt.name="kioskReaderBracket";const Pt=We(et,gt(3.5),gt(3.3),gt(.46),Ie("ipadReader",16514301),0,gt(-.15),gt(.28));Pt.name="kioskReader",We(et,gt(2.2),gt(.11),gt(.04),Ie("ipadSlot",9345187),0,gt(.7),gt(.54));const V=lc(et,gt(.24),gt(.04),Ie("ipadMark",7239812),0,gt(-.35),gt(.55));V.rotation.x=Math.PI/2,n.add(et)}Gc(Dn.w,Dn.h,Dn.d,Z1);Dn.mesh=()=>{const n=new he,t=new Bt(new re(Dn.w,Dn.h,Dn.d),Ie("ipadPlaceholder",15855593));return t.position.set(0,Dn.h/2,0),n.add(t),n};Lt(Dn);new Set("table round chair stool lounge counter tv screen led ledposter ledtrailer laptop ipad monitor kiosk tower speaker podium powerbox drape booth".split(" "));Lt(Dt(17,"laptop","computers","Laptop",14,10,10,"laptop",{snapsTo:["top"]}));Lt(Dt(15,"led","led","LED video wall (6 × 4 panels)",118.1,18,92,"led",{snapsTo:["wallfloor","backwall"]}));Lt(Dt(16,"ledposter","led","LED poster display",25.2,18.7,79.9,"ledposter",{note:"standard size, pending Bob's model"}));Lt(Dt(14,"ledtrailer","led","LED screen trailer",240,96,216,"ledtrailer",{}));const K1=.75,J1=6,Eu=.6,Tu=Math.PI/18,Q1=n=>Math.atan2(Math.sin(n),Math.cos(n)),t2=(n,t,e)=>t>e?(t+e)/2:Math.max(t,Math.min(e,n));function e2(n,t,e,i,r=t.a){const o=Jt(t);if(!o||o.place!=="end")return null;let a=null;for(const l of n){if(l===t||l.type!==t.type)continue;const c=Math.abs(Q1((r??t.a)-l.a));if(c>Tu&&Math.abs(c-Math.PI)>Tu)continue;const h=Jt(l),[u,f]=Fn(l.x,l.z,l.a,e,i),d=h.w/2+o.w/2,p=Math.abs(u)-d;if(p>K1||p<-.2||Math.abs(f)>Eu)continue;const x=(Math.sign(u)||1)*d;if(n.some(_=>{if(_===t||_===l||_.type!==t.type)return!1;const[S,P]=Fn(l.x,l.z,l.a,_.x,_.z);return Math.abs(S-x)<.25&&Math.abs(P)<Eu}))continue;const[m,g]=On(l.x,l.z,l.a,x,0),y=Math.hypot(e-m,i-g);(!a||y<a.dist)&&(a={x:m,z:g,a:l.a,dist:y})}return a}function n2(n,t,e,i){if(!n||n.env==="outdoor")return null;const r=Jt(t);if(!r||r.place!=="outside")return null;const o=r.d;let a=null;for(const l of Ad(n.walls||[])){const c=(l.x1+l.x2)/2+l.nx*.4,h=(l.z1+l.z2)/2+l.nz*.4;if((n.walls||[]).some(C=>C.closed&&C.pts&&C.pts.length>=3&&Td(c,h,C.pts)))continue;const f=l.x2-l.x1,d=l.z2-l.z1,p=Math.hypot(f,d);if(!(p>0)||p<r.w-.01)continue;const x=f/p,v=d/p,m=t2((e-l.x1)*x+(i-l.z1)*v,r.w/2,p-r.w/2),g=l.x1+x*m,y=l.z1+v*m,_=g+l.nx*(o/2+.02),S=y+l.nz*(o/2+.02),P=Math.hypot(e-_,i-S);P<=J1&&(!a||P<a.dist)&&(a={x:_,z:S,a:Math.atan2(l.nx,l.nz),dist:P})}return a}function i2(n,t,e,i){const r=Jt(t);if(!r)return null;if(r.place==="end"){const o=e2(n.items,t,e,i,t.a);return o?{x:o.x,z:o.z,a:o.a,y:0,host:null,mode:"free"}:null}if(r.place==="outside"){const o=n2(n,t,e,i);return o?{x:o.x,z:o.z,a:o.a,y:0,host:null,mode:"wall"}:null}return null}Lt(Dt(8,"lounge","seating","Lounge chair",32,32,30,"lounge"));const Za={w:24.84,d:20.16,h:8.39},s2="Unconfirmed size. Sits on a table (front of house).",r2=["Unconfirmed. missing-products.xlsx lists a Behringer X32 Compact candidate, 24.84 × 20.16 × 8.39 in, from a retailer listing (Medium). Rentacomputer.com has not confirmed the mixer.","The sheet asks whether the mixer sits on a 6 ft table at the back of the room. This item snaps onto a table top. It does not include its own table."],o2=nt.colors.fg,a2=nt.colors.highlight,Jd=nt.colors.accent,l2=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${o2}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="14" width="40" height="22" rx="2"/><path d="M10 28v6M16 24v10M22 26v8M28 22v12" stroke="${a2}"/><rect x="32" y="18" width="8" height="6" rx="1" stroke="${Jd}"/></svg>`;function c2(n,t){const e=ot("mixerBody",1843496),i=ot("mixerDeck",2896960),r=ot("mixerFader",14015459),o=ot("mixerScreen",1323076,{emissive:798792}),a=ot("mixerTick",ie(Jd),{emissive:670276});it(n,t.w,t.h,t.d,e,0,t.h/2,0).name="mixerBody";const l=t.h*.22;it(n,t.w*.92,l,t.d*.62,i,0,t.h-.012-l/2,t.d*.1),it(n,t.w*.26,t.h*.28,t.d*.2,o,-t.w*.28,t.h*.62,-t.d*.26);for(let c=0;c<8;c++){const h=-t.w*.08+c*(t.w*.055);it(n,t.w*.012,t.h*.2,t.d*.22,r,h,t.h*.62,t.d*.16)}it(n,t.w*.16,.012,.012,a,t.w*.32,t.h*.55,t.d/2-.02)}const h2=Dt(50,"mixer","audio","Audio mixer",Za.w,Za.d,Za.h,"mixer",{snapsTo:["top"],note:s2,flags:r2,icon:l2(),draw:c2,unconfirmed:!0});Lt(h2);Lt(Dt(19,"monitor","computers","Desktop monitor 24–27 in",24,8,18,"monitor",{snapsTo:["top"]}));const u2="UNCONFIRMED. missing-products.xlsx asks which pedestal sizes Rentacomputer.com rents. Size is the sheet's 12 × 12 × 42 in display pedestal (FormDecor Linea and the Set Shop list).",d2=nt.colors.fg,f2=nt.colors.highlight,p2=nt.colors.accent,m2=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${d2}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8h12v32H18z"/><path d="M14 40h20M16 8h16" stroke="${f2}"/><path d="M20 14h8" stroke="${p2}"/></svg>`;function g2(n,t){const e=ot("pedMetal",2764856),i=ot("pedPanel",15987180),r=ot("pedGlass",14017774),o=Math.min(.06,t.w*.12);for(const a of[-1,1])for(const l of[-1,1])it(n,o,t.h-.04,o,e,a*(t.w/2-o/2),(t.h-.04)/2,l*(t.d/2-o/2));it(n,t.w-o*2,t.h-.1,t.d-o*2,i,0,(t.h-.1)/2,0).name="pedestalBody",it(n,t.w,.04,t.d,r,0,t.h-.02,0).name="pedestalTop"}const x2=Dt(62,"pedestal","decor","Display pedestal",12,12,42,"pedestal",{topIn:42,snapsTo:["backwall"],note:u2,icon:m2(),draw:g2,unconfirmed:!0});Lt(x2);Lt(Dt(23,"podium","audio","Podium / lectern",24,20,46,"podium",{topIn:46}));Lt(Dt(24,"powerbox","power","Power distribution box",24,16,18,"powerbox",{snapsTo:["nearwall"]}));const fr={w:120,d:24,h:96},ti={w:23.1,d:19.4,h:8.3},v2=1.45,_2=v2*fr.w,M2=fr.d+_2+ti.d,cc=12,Qd="videoScreen",Au="projbody",y2="UNCONFIRMED model and screen. Body is the Epson Pro L1100U candidate, 23.1 × 19.4 × 8.3 in. Screen is the catalog Projector screen, 120 × 24 × 96 in, which has no confident source. Throw is the standard-lens minimum, 1.45 × 120 in (that lens also reaches 2.32). The screen surface is named videoScreen. Ceiling is the preselected mount: the body hangs from a short drop in line with the screen. Table places only the projector on a table in the plan and leaves the screen where it is. UNCONFIRMED mount height and drop length (not in the size sheet). The drawing uses a 12 in drop from the top of this item, the 8 ft screen, which is not a measured ceiling.",tf=nt.colors.fg,ef=nt.colors.highlight,nf=nt.colors.accent,S2=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${tf}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="8" width="16" height="28" rx="1"/><path d="M6 12h12" stroke="${ef}"/><path d="M32 4v8" stroke="${nf}"/><rect x="24" y="12" width="18" height="8" rx="1"/></svg>`,w2=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${tf}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="16" width="36" height="16" rx="2"/><path d="M12 24h10" stroke="${ef}"/><circle cx="34" cy="24" r="3.5" stroke="${nf}"/></svg>`,Zn=n=>n/12;function b2(n){const t=Zn(ti.d),e=Zn(ti.h);return{x:0,y:n.h-Zn(cc)-e/2,z:n.d/2-t/2}}function sf(n,t,e,i,r,o,a){const l=ot("projBody",2764856),c=ot("projLens",1054752),h=ot("projVent",1711652),u=it(n,t,e,i,l,r,o,a);u.name="projectorBody";const f=de(n,.12,.14,.1,c,r,o+e*.08,a-i/2+.16,20);return f.rotation.x=Math.PI/2,f.name="projectorLens",it(n,t*.55,e*.28,.02,h,r,o,a+i/2-.02),u}function E2(n,t){const e=ot("projFrame",1711652),i=ot("projCloth",14210508),r=ot("videoScreen",1784405,{emissive:928324}),o=ot("projFoot",3817804),a=ot("projPole",9147294),l=Zn(fr.d),c=Zn(ti.w),h=Zn(ti.d),u=Zn(ti.h),f=-t.d/2,d=f+l/2,p=.08;for(const I of[-1,1])it(n,p,t.h,p,e,I*(t.w/2-p/2),t.h/2,d);it(n,t.w,.1,.1,e,0,t.h-.05,d),it(n,t.w,.08,.08,e,0,.5,d);for(const I of[-1,1])it(n,.35,.06,l,o,I*(t.w/2-.3),.03,d);const x=.58,v=t.h-.12,m=v-x,g=t.w-p*2,y=f+l;it(n,g,m,.02,i,0,x+m/2,y-.02);const _=it(n,g-.04,m-.04,.012,r,0,x+m/2,y-.006);_.name=Qd,_.userData.video=1;const S=new he;S.name="projectorRig";const P=b2(t),C=it(S,.45,.04,.45,a,P.x,t.h-.02,P.z);C.name="projectorMount";const T=de(S,.06,.06,Zn(cc),a,P.x,t.h-Zn(cc)/2,P.z,12);T.name="projectorDrop",sf(S,c,u,h,P.x,P.y,P.z),n.add(S)}function T2(n,t){sf(n,t.w,t.h,t.d,0,t.h/2,0)}const A2=Dt(31,"projscreen","tvs","Projector with screen",fr.w,M2,fr.h,"projscreen",{snapsTo:["wallfloor"],note:y2,icon:S2(),draw:E2,videoScreen:Qd,unconfirmed:!0}),C2=Dt(31.5,Au,"tvs","Projector",ti.w,ti.d,ti.h,Au,{snapsTo:["top"],note:"Tabletop projector body for Projector with screen. Same Epson Pro L1100U candidate, 23.1 × 19.4 × 8.3 in. UNCONFIRMED model.",icon:w2(),draw:T2,hidden:!0,unconfirmed:!0});Lt(A2);Lt(C2);const R2="UNCONFIRMED feet depth. Steel bike-rack queue barricade, 100 in long and 43 in tall. The 20 in depth is the sheet value and is not confirmed. Sections snap end to end into a line.",P2=nt.colors.fg,rf=nt.colors.highlight,I2=nt.colors.accent,L2=`<svg viewBox="0 0 48 48" fill="none" stroke="${P2}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 40V14M38 40V14M10 16h28M10 28h28"/><path d="M6 40h8M34 40h8" stroke="${rf}"/><path d="M14 34h20" stroke="${I2}"/></svg>`;function D2(n,t){const e=ot("qbarSteel",12963028),i=ot("qbarFoot",3817804),r=ot("qbarBand",ie(rf)),o=.055;for(const h of[-1,1])it(n,.14,.08,t.d,i,h*(t.w/2-.07),.04,0).name="qbarFoot",it(n,.08,t.h-o*2,.08,e,h*(t.w/2-.04),(t.h-o*2)/2,0).name="qbarPost";const a=de(n,o,o,t.w,e,0,t.h-o,0,12);a.rotation.z=Math.PI/2,a.name="qbarRail";const l=de(n,o*.7,o*.7,t.w-.24,e,0,t.h*.48,0,12);l.rotation.z=Math.PI/2,l.name="qbarMid";const c=de(n,o*.72,o*.72,.35,r,0,t.h*.48,0,12);c.rotation.z=Math.PI/2}const N2=Dt(70,"qbar","decor","Queue barricade",100,20,43,"qbar",{place:"end",note:R2,icon:L2,draw:D2,unconfirmed:!0,flags:["Feet depth is the sheet value of about 20 in and is not confirmed.","Length 100 in and height 43 in are the steel bike-rack candidate. Sections snap end to end."]});Lt(N2);const U2="UNCONFIRMED. Bob has not confirmed whether radios show on the plan. Candidate is a Motorola CP200d handheld, 2.4 × 1.7 × 5 in. Sits on a staff desk.",O2=nt.colors.fg,of=nt.colors.highlight,af=nt.colors.accent,F2=`<svg viewBox="0 0 48 48" fill="none" stroke="${O2}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="16" y="10" width="16" height="30" rx="2"/><path d="M22 8h4v4"/><path d="M19 16h10" stroke="${af}"/><circle cx="24" cy="28" r="3" stroke="${of}"/></svg>`;function z2(n,t){const e=ot("radioBody",2764856),i=ot("radioScreen",ie(af),{emissive:932426}),r=ot("radioBtn",ie(of)),o=ot("radioAnt",14015459),a=.045,l=t.h-a;it(n,t.w,l,t.d,e,0,l/2,0).name="radioBody",it(n,t.w*.62,l*.22,.008,i,0,l*.72,t.d/2-.006).name="radioScreen",de(n,.012,.012,.01,r,0,l*.42,t.d/2-.004,10).rotation.x=Math.PI/2;const c=de(n,.01,.01,a,o,t.w/2-.03,l+a/2,0,8);c.name="radioAntenna"}const k2=Dt(76,"radio","audio","Two-way radio",2.4,1.7,5,"radio",{snapsTo:["top"],note:U2,icon:F2,draw:z2,unconfirmed:!0,flags:["Bob has not confirmed whether radios show on the plan.","Candidate is a Motorola CP200d handheld, 2.4 × 1.7 × 5 in.","Staff-desk add-on. It sits on a counter or table top."]});Lt(k2);const B2="UNCONFIRMED which ramp is rented. Checkers Linebacker 5-channel candidate, 36 × 20 × 2.31 in. Sections snap end to end along the 36 in side.",H2=nt.colors.fg,lf=nt.colors.highlight,cf=nt.colors.accent,G2=`<svg viewBox="0 0 48 48" fill="none" stroke="${H2}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 34h36l-6-12H12z"/><path d="M14 28h4M22 28h4M30 28h4" stroke="${lf}"/><path d="M8 38h32" stroke="${cf}"/></svg>`;function V2(n,t){const e=ot("rampBody",15909424),i=ot("rampGroove",2761752),r=ot("rampTick",ie(lf)),o=ot("rampEdge",ie(cf));it(n,t.w,t.h,t.d,e,0,t.h/2,0).name="rampBody";const a=t.d/5;for(let l=0;l<5;l++){const c=-t.d/2+a*(l+.5);it(n,t.w*.9,t.h*.28,a*.42,i,0,t.h-t.h*.14,c).name="rampGroove"}it(n,.08,t.h*.4,t.d*.7,r,0,t.h*.45,0),it(n,t.w*.2,.012,.04,o,0,t.h-.008,0)}const W2=Dt(75,"ramp","power","Cable ramp",36,20,2.31,"ramp",{place:"end",note:B2,icon:G2,draw:V2,unconfirmed:!0,flags:["Which ramp Rentacomputer.com rents is not confirmed.","Envelope is the Checkers Linebacker 5-channel candidate, 36 × 20 × 2.31 in.","Sections snap end to end along the 36 in side, with other cable ramps only."]});Lt(W2);Lt(Dt(9,"regctr","counters","Registration counter",72,24,42,"counter",{topIn:42,snapsTo:["backwall"]}));Lt(Dt(2,"round60","tables","60 in round table",60,60,30,"round",{topIn:30,round:!0,edgeFor:["chair"]}));Lt(Dt(13,"screen","tvs","Projector screen",120,24,96,"screen",{snapsTo:["wallfloor"]}));Lt(Dt(22,"speaker","audio","Powered speaker on stand",15,15,72,"speaker"));const Ke=n=>n/12,Oe={wIn:96,dIn:48,hIn:24,deckIn:.75,frameHIn:4,legDiaIn:2.5,treadWIn:36,treadDIn:11,stairRunIn:22.75,stairSteps:2},fs={frameBandIn:Oe.legDiaIn,treadThickIn:Oe.deckIn,railIn:1,riserIn:.25,skirtPleatFt:.035,skirtInsetFt:.05},yn=Dt(33,"stage","decor","4 × 8 stage deck",Oe.wIn,Oe.dIn,Oe.hIn,"stage",{topIn:Oe.hIn,stairs:!0,skirt:!0,note:"24 in height unconfirmed, pending Bob"}),Ka={gap:.5,ang:Math.PI/18,cross:.5},Vc=n=>Math.atan2(Math.sin(n),Math.cos(n)),$2=(n,t,e,i,r)=>{const o=Math.cos(e),a=Math.sin(e);return[n+i*o+r*a,t-i*a+r*o]},zo=(n,t,e,i,r)=>{const o=i-n,a=r-t,l=Math.cos(e),c=Math.sin(e);return[o*l-a*c,o*c+a*l]};function X2(n,t){if(!t||t.type!=="stage")return t?[t]:[];const e=new Map(n.filter(o=>o.type==="stage").map(o=>[o.uid,o])),i=[t],r=[t];for(;r.length;){const o=r.shift();for(const a of o.links||[]){const l=e.get(a);l&&!i.includes(l)&&(i.push(l),r.push(l))}}return i}function q2(n,t){!n||!t||n===t||(n.links=[...new Set([...n.links||[],t.uid])],t.links=[...new Set([...t.links||[],n.uid])])}function Cu(n,t){if(!t||t.type!=="stage")return 0;let e=0;for(const i of n){if(i===t||i.type!=="stage"||Math.abs(Vc(i.a-t.a))>.001)continue;const[r,o]=zo(t.x,t.z,t.a,i.x,i.z),a=Math.abs(o)<.05&&Math.abs(Math.abs(r)-yn.w)<.05,l=Math.abs(r)<.05&&Math.abs(Math.abs(o)-yn.d)<.05;(a||l)&&(q2(t,i),e++)}return e}function Y2(n,t){const e={joinL:!1,joinR:!1,joinF:!1,joinB:!1};if(!t||t.type!=="stage"||!(t.links||[]).length)return e;const i=yn.w,r=yn.d;for(const o of t.links){const a=n.find(h=>h.uid===o);if(!a||Math.abs(Vc(a.a-t.a))>.001)continue;const[l,c]=zo(t.x,t.z,t.a,a.x,a.z);Math.abs(c)<.05&&Math.abs(Math.abs(l)-i)<.05&&(e[l>0?"joinR":"joinL"]=!0),Math.abs(l)<.05&&Math.abs(Math.abs(c)-r)<.05&&(e[c>0?"joinF":"joinB"]=!0)}return e}const j2=[{id:"R",axis:"x",sign:1},{id:"L",axis:"x",sign:-1},{id:"F",axis:"z",sign:1},{id:"B",axis:"z",sign:-1}];function Z2(n,t,e,i,r=t.a){if(!t||t.type!=="stage")return null;const o=X2(n,t);let a=null;for(const l of n){if(l===t||l.type!=="stage"||o.includes(l)||Math.abs(Vc(r-l.a))>Ka.ang+1e-9)continue;const[c,h]=zo(l.x,l.z,l.a,e,i);for(const u of j2){const f=u.axis==="x"?c:h,d=u.axis==="x"?h:c,p=u.axis==="x"?yn.w:yn.d;if(Math.sign(f)!==u.sign)continue;const x=Math.abs(f)-p;if(Math.abs(x)>Ka.gap+1e-9||Math.abs(d)>Ka.cross)continue;const v=u.axis==="x"?u.sign*p:0,m=u.axis==="z"?u.sign*p:0;if(n.some(P=>{if(P===t||P===l||P.type!=="stage"||o.includes(P))return!1;const[C,T]=zo(l.x,l.z,l.a,P.x,P.z);return Math.abs(C-v)<p/2-.05&&Math.abs(T-m)<(u.axis==="x"?yn.d:yn.w)/2-.05}))continue;const[y,_]=$2(l.x,l.z,l.a,v,m),S=Math.hypot(e-y,i-_);(!a||S<a.dist)&&(a={x:y,z:_,a:l.a,y:0,dist:S,join:l.uid,side:u.id,mode:"free",host:null})}}return a}const Ja={},Di=(n,t)=>Ja[n]||(Ja[n]=new ve({color:t})),Ze=(n,t,e,i,r,o,a,l,c,h)=>{const u=new Bt(new re(e,i,r),o);return u.position.set(a,l,c),u.name=t,h&&Object.assign(u.userData,h),n.add(u),u};function hs(n,t,e,i,r,o,a){if(t<.2)return;const l=Math.max(4,Math.round(t*2)),c=t/l,h=fs.skirtPleatFt,u=fs.skirtInsetFt,f=yn.h,d=Ke(Oe.deckIn),p=f-d-.04,x=.02+p/2,v=[];for(let g=0;g<l;g++){const y=-t/2+c*(g+.5),_=u+(g%2?h:0),S=e==="x"?i+y:i+o*_,P=e==="x"?r+o*_:r+y,C=e==="x"?c*.72:.025,T=e==="x"?.025:c*.72;v.push(new re(C,p,T).translate(S,x,P))}const m=new Bt(Fs(v),Di("skirt",1447966));return v.forEach(g=>g.dispose()),m.name="skirt",m.userData.side=a,n.add(m),m}function K2(n=yn,t={}){const e=new he;e.name="stage";const i=n.w,r=n.d,o=n.h,a=Ke(Oe.deckIn),l=Ke(Oe.frameHIn),c=Ke(Oe.legDiaIn)/2,h=Ke(fs.frameBandIn),u=Di("deck",1842722),f=Di("frame",10134445),d=Di("seam",3949132);Ze(e,"deckTop",i,a,r,u,0,o-a/2,0),Ze(e,"seam",i*.92,.004,.012,d,0,o-.003,0),Ze(e,"seam",.012,.004,r*.88,d,0,o-.003,0);const p=o-l/2;Ze(e,"frame",i,l,h,f,0,p,r/2-h/2,{side:"F"}),Ze(e,"frame",i,l,h,f,0,p,-r/2+h/2,{side:"B"}),Ze(e,"frame",h,l,r,f,i/2-h/2,p,0,{side:"R"}),Ze(e,"frame",h,l,r,f,-i/2+h/2,p,0,{side:"L"});const x=o-l;for(const g of[-1,1])for(const y of[-1,1]){const _=new Bt(new cn(c,c,x,16),f);_.position.set(g*(i/2-c),x/2,y*(r/2-c)),_.name="leg",e.add(_)}Ze(e,"centerRail",i-Ke(Oe.legDiaIn)*4,Ke(Oe.legDiaIn),Ke(Oe.legDiaIn),f,0,x-c,0);const v=t.skirt!==!1,m=t.stairs!==!1&&!t.joinF;if(v&&(t.joinL||hs(e,r,"z",-i/2,0,1,"L"),t.joinR||hs(e,r,"z",i/2,0,-1,"R"),t.joinB||hs(e,i,"x",0,-r/2,1,"B"),!t.joinF)){const g=Ke(Oe.treadWIn);if(m){const y=(i-g)/2;hs(e,y,"x",-(g/2+y/2),r/2,-1,"F"),hs(e,y,"x",g/2+y/2,r/2,-1,"F")}else hs(e,i,"x",0,r/2,-1,"F")}if(m){const g=Ke(Oe.stairRunIn),y=Ke(Oe.treadDIn),_=Ke(Oe.treadWIn),S=Ke(fs.treadThickIn),P=g-Oe.stairSteps*y,C=o/Oe.stairSteps,T=Di("tread",5002335),I=Di("nose",12963028),Z=Di("rail",2896184),M=r/2;Ze(e,"stairJoint",_,S,P,T,0,o-S/2,M+P/2);const b=Ke(fs.riserIn);for(let z=0;z<Oe.stairSteps;z++){const L=o-C*z,W=M+P+y*z;Ze(e,"stairTread",_,S,y,T,0,L-S/2,W+y/2),Ze(e,"stairNose",_*.96,.008,.04,I,0,L-.008,W+y-.03),Ze(e,"stairRiser",_,C,b,Z,0,L-C/2,W+y-b/2)}const B=Ke(fs.railIn),H=M+g,U=H-B-M;for(const z of[-1,1]){const L=z*(_/2-B/2);Ze(e,"stairRail",B,o,B,Z,L,o/2,H-B/2),Ze(e,"stairRail",B,B,U,Z,L,o-B/2,M+U/2),Ze(e,"stairRail",B,B,U*.7,Z,L,C*.55,M+U*.45)}}return e.traverse(g=>{g.isMesh&&(g.castShadow=!1)}),e}yn.draw=(n,t,e,i={})=>{n.add(K2(t,i))};Lt(yn);Lt(Dt(7,"stool","seating","Bar stool",16,16,30,"stool",{snapsTo:["edge"],edgeKind:"stool"}));const Qa={w:7.5,d:16.5,h:68.9},J2="Unconfirmed size. Tripod footprint is not confirmed.",Q2=["Unconfirmed. missing-products.xlsx gives 7.5 × 16.5 × 68.9 in for a Sony PXW-Z190 on a Manfrotto 504X tripod. 68.9 in is the tripod maximum height. Confidence on the row is Medium.","The tripod spread footprint is not in the sheet. Legs and the camera body are drawn inside the published envelope. No wider stance was invented.","Rentacomputer.com has not confirmed which camera kit we rent."],ty=nt.colors.fg,ey=nt.colors.highlight,hf=nt.colors.accent,ny=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${ty}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 40l8-24 8 24M18 34h12"/><rect x="14" y="8" width="16" height="10" rx="1" stroke="${ey}"/><path d="M30 11h6v4h-6" stroke="${hf}"/></svg>`;function iy(n,t){const e=ot("kitPole",2764856),i=ot("kitHead",1711652),r=ot("kitBody",1185308),o=ot("kitLens",790550),a=ot("kitGlass",1784405,{emissive:928324}),l=ot("kitTick",ie(hf),{emissive:670276}),c=Math.min(t.w,t.d)*.07,h=t.h-c;for(const y of[-1,1])for(const _ of[-1,1])de(n,c,c,h,e,y*(t.w/2-c),h/2,_*(t.d/2-c),8);it(n,t.w-c*2,c*.7,c*.7,e,0,t.h*.32,0),it(n,c*.7,c*.7,t.d-c*2,e,0,t.h*.32,0),it(n,t.w*.62,c,t.d*.28,i,0,t.h-c/2,0).name="streamHead";const u=t.w*.7,f=Math.min(t.h*.08,t.w*.45),d=t.d*.36,p=t.h-c-f/2;it(n,u,f,d,r,0,p,-t.d*.06).name="streamBody";const x=t.d*.16,v=-t.d*.06+d/2+x/2,m=de(n,f*.22,f*.26,x,o,0,p,v,16);m.rotation.x=Math.PI/2;const g=de(n,f*.12,f*.12,.008,a,0,p,v+x/2-.006,12);g.rotation.x=Math.PI/2,it(n,t.w*.16,.012,.012,l,0,p,-t.d*.06-d/2+.02)}const sy=Dt(54,"streamkit","tvs","Camera and live-streaming kit",Qa.w,Qa.d,Qa.h,"streamkit",{note:J2,flags:Q2,icon:ny(),draw:iy,unconfirmed:!0});Lt(sy);const tl={w:24,d:25.1,h:26.3},ry="Unconfirmed size.",oy=["Unconfirmed. missing-products.xlsx lists a JBL EON718S candidate, 24 × 25.1 × 26.3 in, from the manufacturer page. Rentacomputer.com has not confirmed the subwoofer.","The row's W × D × H columns are the mixer (24.84 × 20.16 × 8.39 in). Those numbers are not used for this item."],ay=nt.colors.fg,ly=nt.colors.highlight,uf=nt.colors.accent,cy=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${ay}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="10" y="8" width="28" height="32" rx="2"/><circle cx="24" cy="22" r="7" stroke="${ly}"/><circle cx="24" cy="22" r="2" stroke="${uf}"/><path d="M16 36h16"/></svg>`;function hy(n,t){const e=ot("subCab",1448222),i=ot("subGrille",2765112),r=ot("subCone",921878),o=ot("subPort",460810),a=ot("subTick",ie(uf),{emissive:670276});it(n,t.w,t.h,t.d,e,0,t.h/2,0).name="subCab",it(n,t.w*.86,t.h*.78,.01,i,0,t.h*.52,t.d/2-.012);const l=de(n,t.w*.22,t.w*.22,.01,r,0,t.h*.58,t.d/2-.016,24);l.rotation.x=Math.PI/2;const c=de(n,t.w*.06,t.w*.06,.01,o,0,t.h*.22,t.d/2-.016,16);c.rotation.x=Math.PI/2,it(n,t.w*.2,.012,.012,a,0,t.h*.1,t.d/2-.02)}const uy=Dt(51,"subwoofer","audio","Subwoofer",tl.w,tl.d,tl.h,"subwoofer",{note:ry,flags:oy,icon:cy(),draw:hy,unconfirmed:!0});Lt(uy);Lt(Dt(0,"table6","tables","6 ft banquet table",72,30,30,"table",{topIn:30,edgeFor:["chair"]}));Lt(Dt(1,"table8","tables","8 ft banquet table",96,30,30,"table",{topIn:30,edgeFor:["chair"]}));const dy="UNCONFIRMED. Bob has not confirmed tents, or which sizes to offer. Candidate is a 20 × 20 ft high-peak frame tent, 8 ft legs, peak 16 ft 9 in. Outdoor use.",fy=nt.colors.fg,df=nt.colors.highlight,py=nt.colors.accent,my=`<svg viewBox="0 0 48 48" fill="none" stroke="${fy}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 34L24 10l18 24H6z"/><path d="M8 40h32M14 34v6M34 34v6"/><path d="M24 10v24" stroke="${df}"/><path d="M16 34h16" stroke="${py}"/></svg>`,Tn=8;function gy(n,t){const e=ot("tentCanvas",15986920),i=ot("tentPole",12042442),r=ot("tentBand",ie(df)),o=ot("tentShade",15002611),a=.12;for(const d of[-1,1])for(const p of[-1,1])it(n,a*2,Tn,a*2,i,d*(t.w/2-a),Tn/2,p*(t.d/2-a)).name="tentPole";const l=.12;it(n,t.w,l,a*2,i,0,Tn-l/2,t.d/2-a).name="tentEave",it(n,t.w,l,a*2,i,0,Tn-l/2,-(t.d/2-a)),it(n,a*2,l,t.d-a*4,i,t.w/2-a,Tn-l/2,0),it(n,a*2,l,t.d-a*4,i,-(t.w/2-a),Tn-l/2,0);const c=1.1,h=Tn-l-c/2;it(n,t.w,c,.04,e,0,h,t.d/2-.02).name="tentValance",it(n,t.w,c,.04,e,0,h,-(t.d/2-.02)),it(n,.04,c,t.d-.08,e,t.w/2-.02,h,0),it(n,.04,c,t.d-.08,e,-(t.w/2-.02),h,0),it(n,t.w*.46,.05,.012,r,0,h,t.d/2-.012);const u=t.h-Tn,f=5;for(let d=0;d<f;d++){const p=d/f,x=Tn+u*p,v=Tn+u*((d+1)/f),m=Math.max(.3,t.w*(1-p)-.04),g=Math.max(.3,t.d*(1-p)-.04);it(n,m,v-x,g,d%2?o:e,0,(x+v)/2,0).name="tentRoof"}it(n,.2,u,.2,i,0,Tn+u/2,0).name="tentPeak",it(n,.55,.08,.55,r,0,t.h-.04,0)}const xy=Dt(72,"tent","decor","Event tent",240,240,201,"tent",{note:dy,icon:my,draw:gy,unconfirmed:!0,flags:["Bob has not confirmed tents, or which sizes to offer.","Candidate is a 20 × 20 ft high-peak frame tent with 8 ft legs and a 16 ft 9 in peak.","Outdoor use. The planner does not block placing it indoors."]});Lt(xy);const vy=nt.colors.fg,ff=nt.colors.highlight,Ru=nt.colors.accent;wd.touchkiosk=`<svg viewBox="0 0 48 48" fill="none" stroke="${vy}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="14" y="3" width="20" height="38" rx="1.5"/><path d="M10 44h28"/><g stroke="${Ru}" fill="${Ru}33"><rect x="17" y="7" width="14" height="24" rx="0.8"/></g><g stroke="${ff}"><path d="M18 35h12"/></g></svg>`;const _y=["Rental model is not confirmed. missing-products.xlsx asks which touchscreen kiosk Rentacomputer.com rents.","The spreadsheet candidate name is KIPICT555. The cited spec sheet is Peerless-AV KIPICT2555. The envelope is that spec: 34.00 x 75.06 x 19.00 in (W x H x D).","Glass size is the spec 55 in diagonal at 16:9, turned portrait. The spec does not give the glass position. It is centered on the front of the published envelope."],Js=Dt(28,"touchkiosk","kiosks","55 in touchscreen kiosk",34,19,75.06,"touchkiosk",{snapsTo:["backwall","nearwall"],note:"Candidate size (Peerless-AV KIPICT2555). Model not confirmed.",flags:_y});Lt(Js);Gc(Js.w,Js.h,Js.d,n=>{const{w:t,h:e,d:i}=Js,r=gt(Kd),o=gt(Zd),a=.012,l=.008;We(n,t,e,i,Ie("kioskBody",1448222),0,e/2,0),Hc(n,r,o,a,0,e/2,i/2-a/2+l);const c=e/2-o/2-.09;We(n,r*.42,.022,.006,Ie("kioskTick",ie(ff)),0,c,i/2+.004)});const My=nt.colors.fg,pf=nt.colors.highlight,Pu=nt.colors.accent;wd.touchtable=`<svg viewBox="0 0 48 48" fill="none" stroke="${My}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 18h36v6H6zM10 24v16M38 24v16"/><g stroke="${Pu}" fill="${Pu}33"><rect x="12" y="20" width="24" height="3.2" rx="0.4"/></g><g stroke="${pf}"><path d="M16 16h16"/></g></svg>`;const yy=["Rental model is not confirmed. missing-products.xlsx asks which touch table Rentacomputer.com rents (55 or 65 in, table or tilt). One manufacturer page only.","Envelope 71.0 x 35.6 x 29.0 in (L x W x H) is the Visionair-e 55 in Designer Interactive Touch Table line on that page.","16:9 is the page heading over the standard sizes, including 55 in. The 55 in paragraph does not repeat the aspect. Glass is the 55 in 16:9 area centered in the top. The page does not give the glass position.","Top thickness and leg size are not published. They are drawn inside the published envelope. The page describes clear glass legs; the model uses a pale solid leg."],Qs=Dt(29,"touchtable","kiosks","55 in touchscreen table",71,35.6,29,"touchtable",{note:"Candidate size (Visionair-e 55 in table). Model not confirmed.",flags:yy});Lt(Qs);const ro=.1;Gc(Qs.w,Qs.h,Qs.d,n=>{const{w:t,h:e,d:i}=Qs,r=gt(Zd),o=gt(Kd),a=.012,l=.07;We(n,t,ro,i,Ie("tableTop",16054008),0,e-ro/2,0),We(n,r+l*2,.016,o+l*2,Ie("tableBezel",1711652),0,e+.002,0),Hc(n,r,a,o,0,e+.012,0);const c=e-ro,h=t/2-.34,u=i/2-.28;for(const f of[-1,1])for(const d of[-1,1])lc(n,.055,c,Ie("tableLeg",14016232),f*h,c/2,d*u);We(n,t*.22,.012,.02,Ie("tableTick",ie(pf)),0,e-ro-.02,i/2-.02)});Lt(Dt(21,"tower","kiosks","Charging tower",16,16,72,"tower",{snapsTo:["backwall"]}));Lt(Dt(11,"tv55","tvs","55 in TV",48.2,24,66,"tv",{snapsTo:["wall"],panelIn:28,wallDIn:3,mountCenterIn:60}));Lt(Dt(12,"tv75","tvs","75 in TV",65.7,28,72,"tv",{snapsTo:["wall"],panelIn:38,wallDIn:3,mountCenterIn:62}));const hc=74.97,tr=42.71,mf=31.97,So=13.07,pi=.12;function Sy(n){const t=yr(),e=Te(hc),i=Te(tr),r=Te(So),o=Te(mf);if(n==="wall")return _e(t,e,i,pi,Uo(),0,i/2,0),Oo(t,e-.12,i-.12,0,i/2,pi/2+.01),_e(t,e*.35,i*.4,.04,dr(),0,i/2,-pi/2-.015),Ps(t);const a=r/2-pi/2-.04;_e(t,o,.07,r,Ko(),0,.035,0);for(const l of[-1,1])_e(t,.08,i*.42,.08,Rs(),l*o*.32,.07+i*.21,a-pi/2-.05);return _e(t,e,i,pi,Uo(),0,i/2,a),Oo(t,e-.14,i-.14,0,i/2,a+pi/2+.01),_e(t,e*.22,.035,.008,Mr(),0,.12,a+pi/2+.014),Ps(t)}Lt(Dt(41,"tv85","tvs","Large-format TV (85 in)",hc,So,tr,"tv85",{snapsTo:["wall"],panelIn:tr,wallDIn:So,mountCenterIn:tr/2,unconfirmed:!0,note:"Unconfirmed on-stand height. Samsung QM85C panel 74.97 × 42.71 in, stand footprint 31.97 × 13.07 in. Panel thickness and wall-mount height are not published.",gaps:["On-stand overall height is not published. Item height is the QM85C panel height 42.71 in. The panel is not raised on an unsourced pole.","QM85C panel thickness is not in the sheet. The 3.8 in depth belongs to the QM98T alternate and is not used. The cabinet depth is a drawing thickness inside the 13.07 in stand.","Wall-mount height is not published. On a wall the panel bottom sits at the floor.","Wall collision depth uses the sourced stand depth 13.07 in because a wall-mount thickness is not published.","98 in QM98T (86.5 × 3.8 × 49.24 in) is an alternate and is not the model drawn."],sources:["https://knitec.com/pages/samsung-qm-c-series-specifications","https://s7d9.scene7.com/is/content/techdata/Samsung-QM98T-CORP-Datasheetpdf"],parts:{panel:{wIn:hc,hIn:tr},stand:{wIn:mf,dIn:So}},mesh:Sy,icon:Sr('<rect x="3" y="10" width="42" height="24" rx="1.5"/><path d="M14 34v6M34 34v6M12 42h24" stroke="{{T}}"/><rect x="7" y="14" width="34" height="16" rx="1" stroke="{{O}}"/>')}));const wy=24,by=42,Ey="PLACEHOLDER. No vending model in missing-products.xlsx. Envelope is the AMS Classic Snack 5-wide, 39 × 35 × 72 in, on two AMS sheets. Crane Merchant cabinets are 33 or 44 in wide, so this is not a shared standard. Not confirmed for Rentacomputer.com. Front portrait screen is drawn 24 × 42 in. Screen size is UNCONFIRMED.",Ty=nt.colors.fg,Ay=nt.colors.highlight,uc=nt.colors.accent,Cy=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${Ty}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="12" y="4" width="24" height="40" rx="1"/><rect x="16" y="8" width="16" height="26" rx="0.8" stroke="${uc}" fill="${uc}33"/><path d="M16 38h16" stroke="${Ay}"/></svg>`;function Ry(n,t){const e=wy/12,i=by/12,r=.012,o=.008,a=ot("vendBezel",1382429),l=t.h*.58,c=t.d/2-r/2+o;it(n,e+.14,i+.14,.02,a,0,l,c-r/2-.012).name="vendBezel";const h=new ve({color:1784405,emissive:928324}),u=new Bt(new re(e,i,r),h);return u.position.set(0,l,c),u.name="screen",u.userData.screen=1,u.userData.ownMat=1,n.add(u),it(n,e*.28,.02,.006,ot("vendTick",ie(uc)),0,l-i/2-.06,t.d/2+.004).name="vendTick",u}function Py(n,t){const e=ot("vendBody",2765116),i=ot("vendTrim",1382429),r=ot("vendBin",921878),o=.05;it(n,t.w,t.h,t.d-.04,e,0,t.h/2,-.02).name="vendBody",it(n,t.w,o,.04,i,0,t.h-o/2,t.d/2-.02),it(n,t.w,o,.04,i,0,o/2,t.d/2-.02),it(n,o,t.h,.04,i,t.w/2-o/2,t.h/2,t.d/2-.02),it(n,o,t.h,.04,i,-t.w/2+o/2,t.h/2,t.d/2-.02),Ry(n,t),it(n,t.w*.7,t.h*.12,.03,r,0,t.h*.16,t.d/2-.02).name="vendBin"}const Iy=Dt(67,"vending","decor","Vending machine",39,35,72,"vending",{snapsTo:["nearwall"],note:Ey,icon:Cy(),draw:Py,unconfirmed:!0,placeholder:!0});Lt(Iy);const Ly=28.3,Dy=80.7,Ny="UNCONFIRMED model. Walk-through metal detector sized from the CEIA HI-PE Multi-Zone candidate: 32.9 × 26 × 88.8 in, opening 28.3 × 80.7 in. Which detector Rentacomputer.com rents is not confirmed.",Uy=nt.colors.fg,gf=nt.colors.highlight,xf=nt.colors.accent,Oy=`<svg viewBox="0 0 48 48" fill="none" stroke="${Uy}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 42V10h24v32"/><path d="M12 14h24" stroke="${gf}"/><path d="M18 22h4M26 28h4" stroke="${xf}"/></svg>`;function Fy(n,t){const e=ot("wtmeterBody",2896704),i=ot("wtmeterPanel",1711912),r=ot("wtmeterLamp",ie(xf),{emissive:1333352}),o=ot("wtmeterTick",ie(gf)),a=Ly/12,l=Dy/12,c=(t.w-a)/2,h=t.h-l;it(n,c,t.h,t.d,e,-t.w/2+c/2,t.h/2,0).name="wtmeterUpright",it(n,c,t.h,t.d,e,t.w/2-c/2,t.h/2,0).name="wtmeterUpright",it(n,t.w,h,t.d,e,0,t.h-h/2,0).name="wtmeterHeader",it(n,c*.72,.42,.04,i,t.w/2-c/2,t.h*.38,t.d/2-.03).name="wtmeterPanel",it(n,c*.28,.06,.012,r,t.w/2-c/2,t.h*.5,t.d/2-.02),it(n,t.w*.28,.04,.012,o,0,t.h-h/2,t.d/2-.01).name="wtmeterLamp"}const zy=Dt(71,"wtmeter","decor","Walk-through metal detector",32.9,26,88.8,"wtmeter",{note:Ny,icon:Oy,draw:Fy,unconfirmed:!0,flags:["Rental model is not confirmed. Envelope is the CEIA HI-PE Multi-Zone candidate, 32.9 × 26 × 88.8 in.","Walk-through opening is 28.3 in wide and 80.7 in tall, from that candidate spec."]});Lt(zy);const oo=n=>Math.round(n/12*1e3)/1e3,vf=({order:n,...t})=>t,_f=iM().map(vf),Wc=nM().map(vf),$c=Object.fromEntries(Wc.map(n=>[n.id,n]));for(const n of Wc)n.panelIn&&(n.panel=oo(n.panelIn)),n.wallDIn&&(n.wallD=oo(n.wallDIn)),n.mountCenterIn&&(n.mountY=oo(n.mountCenterIn-n.panelIn/2)),n.sideHIn&&(n.sideH=oo(n.sideHIn));const Mf=n=>`${+n.w.toFixed(2)} × ${+n.d.toFixed(2)} ft, ${+n.h.toFixed(2)} ft tall (typical)`,yf=["ledposter","stage"],ky=2,By=2.5,el=.5;let Hy=1;const Jt=n=>$c[n.type];function Is(n,t=0,e=0,i=0){return{uid:"i"+Date.now().toString(36)+(Hy++).toString(36),type:n,x:t,z:e,a:i,y:0,host:null,mode:"free"}}const Gy=n=>n.mode==="wall",Xi=n=>{const t=Jt(n);return{w:t.w,d:Gy(n)?t.wallD:t.d}},gn=Math.cos,xn=Math.sin,ki=(n,t,e)=>t>e?(t+e)/2:Math.max(t,Math.min(e,n)),On=(n,t,e,i,r)=>[n+i*gn(e)+r*xn(e),t-i*xn(e)+r*gn(e)],Fn=(n,t,e,i,r)=>{const o=i-n,a=r-t;return[o*gn(e)-a*xn(e),o*xn(e)+a*gn(e)]},Vy=(n,t,e)=>[t*gn(n)+e*xn(n),-t*xn(n)+e*gn(n)],Wy=(n,t)=>Math.atan2(n,t),$y=n=>n.type?{x:n.x,z:n.z,a:n.a,...Xi(n)}:n;function dc(n,t=0){const e=$y(n),{w:i,d:r}=e,o=i/2-t,a=r/2-t;return[[-o,-a],[o,-a],[o,a],[-o,a]].map(([l,c])=>On(e.x,e.z,e.a,l,c))}function Zs(n,t,e=.02){const i=dc(n,e),r=dc(t,e);for(const o of[n.a,t.a])for(const[a,l]of[[gn(o),-xn(o)],[xn(o),gn(o)]]){const c=i.map(([u,f])=>u*a+f*l),h=r.map(([u,f])=>u*a+f*l);if(Math.max(...c)<=Math.min(...h)||Math.max(...h)<=Math.min(...c))return!1}return!0}function Xy(n,t){const{w:e,d:i}=Xi(t),r=e/2-.01,o=i/2-.01,a=Math.max(1,Math.ceil(e/.5)),l=Math.max(1,Math.ceil(i/.5));for(let c=0;c<=a;c++)for(let h=0;h<=l;h++){const[u,f]=On(t.x,t.z,t.a,-r+2*r*c/a,-o+2*o*h/l);if(!z_(n,u,f))return!1}return!0}function qy(n){const t=[];for(const e of n){const i=Jt(e);if(!i.booth&&!i.wallHost)continue;const r=i.w/2,o=i.d/2,a=(l,c,h,u,f,d,p)=>{const[x,v]=On(e.x,e.z,e.a,l,c),[m,g]=On(e.x,e.z,e.a,h,u),[y,_]=Vy(e.a,f,d);t.push({x1:x,z1:v,x2:m,z2:g,nx:y,nz:_,src:p,host:e.uid})};i.booth?(a(-r,-o+.15,r,-o+.15,0,1,"boothBack"),a(-r+.1,-o,-r+.1,o,1,0,"boothSide"),a(r-.1,o,r-.1,-o,-1,0,"boothSide")):(a(-r,o,r,o,0,1,"drape"),a(r,-o,-r,-o,0,-1,"drape"))}return t}function ao(n,t,e,i,r){const o=Jt(n);let a=null;for(const l of i){const c=l.x2-l.x1,h=l.z2-l.z1,u=Math.hypot(c,h);if(u<o.w-.01)continue;const f=c/u,d=h/u,p=ki((t-l.x1)*f+(e-l.z1)*d,o.w/2,u-o.w/2),x=l.x1+f*p,v=l.z1+d*p;if((t-x)*l.nx+(e-v)*l.nz<-.75)continue;const m=x+l.nx*(r/2+.02),g=v+l.nz*(r/2+.02),y=Math.hypot(t-m,e-g);y<ky&&(!a||y<a.dist)&&(a={x:m,z:g,a:Wy(l.nx,l.nz),dist:y,host:l.host,hl:{seg:l}})}return a}const Iu=(n,t)=>{const e=[];let i=t.host;for(;i;){const r=n.find(o=>o.uid===i);if(!r||e.includes(r))break;e.push(r),i=r.host}return e},qi=(n,t)=>{const e=[],i=[t.uid];for(;i.length;){const r=i.shift();for(const o of n)o.host===r&&!e.includes(o)&&(e.push(o),i.push(o.uid))}return e},Yy=(n,t,e)=>Iu(n,t).includes(e)||Iu(n,e).includes(t);function jy(n,t,e,i){let r=null;const o=Jt(t),a=qi(n,t);for(const l of n){const c=Jt(l);if(l===t||!c.top||a.includes(l)||l.mode==="top")continue;let[h,u]=Fn(l.x,l.z,l.a,e,i);const f=t.a-l.a,d=Math.abs(gn(f))*o.w/2+Math.abs(xn(f))*o.d/2,p=Math.abs(xn(f))*o.w/2+Math.abs(gn(f))*o.d/2;if(c.round){const m=c.w/2,g=Math.hypot(h,u);if(g>m+el)continue;const y=m-Math.hypot(d,p);g>y&&g>0&&(h*=y/g,u*=y/g)}else{if(Math.abs(h)>c.w/2+el||Math.abs(u)>c.d/2+el)continue;h=ki(h,-c.w/2+d,c.w/2-d),u=ki(u,-c.d/2+p,c.d/2-p)}const[x,v]=On(l.x,l.z,l.a,h,u);(!r||c.top>r.y)&&(r={x,z:v,a:t.a,y:c.top,host:l.uid,hl:{item:l.uid}})}return r}function Zy(n,t,e,i){const r=Jt(t),o=r.edgeKind==="stool"?.25:.3;let a=null;for(const l of n){const c=Jt(l);if(!c.edgeFor||!c.edgeFor.includes(r.edgeKind))continue;const[h,u]=Fn(l.x,l.z,l.a,e,i);let f;if(c.round){let v=Math.atan2(h,u);v=Math.round(v/(Math.PI/4))*(Math.PI/4);const m=c.w/2+r.d/2-o;f=[m*xn(v),m*gn(v),v+Math.PI]}else{const v=c.w/2,m=c.d/2,g=r.d/2-o,y=[m-u,u+m,v-h,h+v].map(Math.abs),_=y.indexOf(Math.min(...y));f=_===0?[ki(h,-v+r.w/2,v-r.w/2),m+g,Math.PI]:_===1?[ki(h,-v+r.w/2,v-r.w/2),-m-g,0]:_===2?[v+g,ki(u,-m+r.w/2,m-r.w/2),-Math.PI/2]:[-v-g,ki(u,-m+r.w/2,m-r.w/2),Math.PI/2]}const[d,p]=On(l.x,l.z,l.a,f[0],f[1]),x=Math.hypot(e-d,i-p);x<By&&(!a||x<a.dist)&&(a={x:d,z:p,a:l.a+f[2],dist:x,host:l.uid,hl:{item:l.uid}})}return a}const nl={gap:.5,ang:Math.PI/18,lz:.5},Sf=n=>Math.atan2(Math.sin(n),Math.cos(n));function ko(n,t){if(!t||!yf.includes(t.type))return t?[t]:[];const e=new Map(n.filter(o=>o.type===t.type).map(o=>[o.uid,o])),i=[t],r=[t];for(;r.length;){const o=r.shift();for(const a of o.links||[]){const l=e.get(a);l&&!i.includes(l)&&(i.push(l),r.push(l))}}return i}function Ky(n,t){const e={joinL:!1,joinR:!1};if(!t||t.type!=="ledposter"||!(t.links||[]).length)return e;const i=Jt(t).w;for(const r of t.links){const o=n.find(c=>c.uid===r);if(!o||Math.abs(Sf(o.a-t.a))>.001)continue;const[a,l]=Fn(t.x,t.z,t.a,o.x,o.z);Math.abs(l)<.05&&Math.abs(Math.abs(a)-i)<.05&&(e[a>0?"joinR":"joinL"]=!0)}return e}function fc(n,t){!n||!t||n===t||(n.links=[...new Set([...n.links||[],t.uid])],t.links=[...new Set([...t.links||[],n.uid])])}function Xc(n,t){if(!t)return 0;const e=(t.links||[]).length;for(const i of n)i.links&&(i.links=i.links.filter(r=>r!==t.uid),i.links.length||delete i.links);return delete t.links,e}function Jy(n,t,e,i,r=t.a){if(t.type!=="ledposter")return null;const o=Jt(t),a=ko(n,t);let l=null;for(const c of n){if(c===t||c.type!=="ledposter"||a.includes(c)||Math.abs(Sf(r-c.a))>nl.ang+1e-9)continue;const h=Jt(c),[u,f]=Fn(c.x,c.z,c.a,e,i),d=h.w/2+o.w/2,p=Math.abs(u)-d;if(Math.abs(p)>nl.gap+1e-9||Math.abs(f)>nl.lz)continue;const x=(Math.sign(u)||1)*d;if(n.some(y=>y!==t&&y!==c&&y.type==="ledposter"&&!a.includes(y)&&(([_,S])=>Math.abs(_-x)<d-.05&&Math.abs(S)<h.d)(Fn(c.x,c.z,c.a,y.x,y.z))))continue;const[v,m]=On(c.x,c.z,c.a,x,0),g=Math.abs(p);(!l||g<l.dist)&&(l={x:v,z:m,a:c.a,dist:g,join:c.uid,hl:{item:c.uid}})}return l}function ks(n,t,e,i=n.a,r=.5){const o=Jt(n),a=Math.abs(gn(i))*o.w/2+Math.abs(xn(i))*o.d/2,l=Math.abs(xn(i))*o.w/2+Math.abs(gn(i))*o.d/2;return{x:Math.round((t-a)/r)*r+a,z:Math.round((e-l)/r)*r+l,a:i,y:0,host:null,mode:"free",hl:null}}function Bs(n,t,e,i,r=.5){const o=Jt(t),a=n.items.filter(d=>d!==t),l=qi(n.items,t),c=a.filter(d=>!l.includes(d)),h=n.env==="outdoor",u=()=>h?[]:Ad(n.walls),f=d=>qy(c).filter(d);if(t.type==="ledposter"){const d=Jy(n.items,t,e,i);if(d)return{...d,y:0,mode:"free"}}if(t.type==="stage"){const d=Z2(n.items,t,e,i);if(d)return{x:d.x,z:d.z,a:d.a,join:d.join,y:0,host:null,mode:"free"}}{const d=i2(n,t,e,i);if(d)return d}for(const d of o.snapsTo){let p=null;if(d==="top"&&(p=jy(n.items,t,e,i),p))return{...p,mode:"top"};if(d==="edge"&&(p=Zy(c,t,e,i),p))return{...p,y:0,mode:"edge"};if(d==="wall"&&(p=ao(t,e,i,[...u(),...f(()=>!0)],o.wallD),p))return{...p,y:o.mountY,mode:"wall"};if(d==="wallfloor"&&(p=ao(t,e,i,[...u(),...f(x=>x.src==="boothBack")],o.d),p))return{...p,y:0,mode:"wallfloor"};if(d==="backwall"&&(p=ao(t,e,i,f(x=>x.src==="boothBack"),o.d),p))return{...p,y:0,mode:"backwall"};if(d==="nearwall"&&!h&&(p=ao(t,e,i,u(),o.d),p))return{...p,y:0,mode:"wallfloor"}}return ks(t,e,i,t.a,r)}function mn(n,t,e){const i=qi(n.items,t),r=e.a-t.a;for(const o of i){const[a,l]=Fn(t.x,t.z,t.a,o.x,o.z),[c,h]=On(e.x,e.z,e.a,a,l);o.x=c,o.z=h,o.a+=r}Object.assign(t,{x:e.x,z:e.z,a:e.a,y:e.y||0,host:e.host||null,mode:e.mode||"free"})}function zn(n,t){const e=n.items,i=Jt(t);if(t.mode==="top"){const r=e.find(a=>a.uid===t.host);if(!r)return!1;const o=Jt(r);for(const[a,l]of dc(t,.01)){const[c,h]=Fn(r.x,r.z,r.a,a,l);if(o.round?Math.hypot(c,h)>o.w/2+.01:Math.abs(c)>o.w/2+.01||Math.abs(h)>o.d/2+.01)return!1}return!e.some(a=>a!==t&&a.mode==="top"&&a.host===t.host&&Zs(t,a))}if(t.mode==="wall")return t.host&&!e.some(r=>r.uid===t.host)?!1:!e.some(r=>r!==t&&r.mode==="wall"&&Zs(t,r)&&Math.abs(r.y-t.y)<Math.max(i.panel,Jt(r).panel||0));if(!Xy(zs(n.walls),t))return!1;for(const r of Cd(n.walls))if(Zs(t,r))return!1;for(const r of n.cols||[])if(Zs(t,r))return!1;for(const r of e){if(r===t||r.mode==="top"||r.mode==="wall")continue;const o=Jt(r);if(!!i.booth==!!o.booth&&!Yy(e,t,r)&&Zs(t,r))return!1}return!0}function Qy(n,t){yf.includes(t.type)&&Xc(n.items,t);const e=new Set([t,...qi(n.items,t)]);return n.items=n.items.filter(i=>!e.has(i)),e.size}function qc(n,t,e,i,r=14){for(let o=0;o<=r;o++)for(let a=-o;a<=o;a++)for(const[l,c]of o?[[a,-o],[a,o],[-o,a],[o,a]]:[[0,0]]){const h=Bs(n,t,e+l,i+c),u={...t};Object.assign(t,{x:h.x,z:h.z,a:h.a,y:h.y,host:h.host,mode:h.mode});const f=zn(n,t);if(Object.assign(t,u),f)return h}return null}const tS=n=>(Array.isArray(n)?n:[]).filter(t=>t&&$c[t.type]&&[t.x,t.z,t.a].every(Number.isFinite)).map(t=>({uid:String(t.uid),type:t.type,x:t.x,z:t.z,a:t.a,y:Number.isFinite(t.y)?t.y:0,host:t.host?String(t.host):null,...t.preset?{preset:String(t.preset)}:{},...t.type==="ledposter"&&Array.isArray(t.links)&&t.links.length?{links:t.links.map(String)}:{},mode:["free","top","edge","wall","wallfloor","backwall"].includes(t.mode)?t.mode:"free"})),eS="3.39",wf="esp.layout.v3",nS=["rentourav.esp.v3"],iS=3,Si=2e3;function bf(n){const t={};if(!n||typeof n!="object")return t;for(const[e,i]of Object.entries(n))typeof e=="string"&&typeof i=="string"&&i.trim()&&(t[e]=i.trim().slice(0,40));return t}function Yc(n){return JSON.stringify({schema:iS,app:eS,env:n.env,walls:n.walls||[],items:n.items||[],mute:!!n.mute,venue:n.venue||null,fill:n.fill||null,lvl:Number.isInteger(n.lvl)?n.lvl:1,levels:n.levels||{},tech:n.tech||"showcase",presetNames:bf(n.presetNames),saved:n.saved||Date.now()})}function sS(n){return!n||typeof n!="object"?null:(n.schema||(n={schema:1,env:n.env||"indoor",tiles:n.tiles||[],mute:!!n.mute}),n.schema<2&&(n={...n,schema:2,items:[]}),n.schema<3&&(n={...n,schema:3,walls:G_(n.tiles),migratedFromTiles:!0}),n)}const Bo=-3,Ho=20;function Lu(n){const t=tS(n.items),e=new Set(t.map(i=>i.uid));return t.forEach(i=>{i.host&&!e.has(i.host)&&(i.host=null,i.mode!=="wall"&&(i.mode="free"))}),{walls:H_(n.walls),items:t,venue:n.venue&&typeof n.venue=="object"?n.venue:null,fill:n.fill&&typeof n.fill=="object"&&(Array.isArray(n.fill.booths)||Array.isArray(n.fill.seats))?n.fill:null}}function Ef(n){let t;try{t=sS(JSON.parse(n))}catch{return null}if(!t)return null;const e=Lu(t),i=Number.isInteger(t.lvl)&&t.lvl>=Bo&&t.lvl<=Ho?t.lvl:1,r={};if(t.levels&&typeof t.levels=="object")for(const[o,a]of Object.entries(t.levels)){const l=+o;if(Number.isInteger(l)&&l>=Bo&&l<=Ho&&l!==i&&a&&typeof a=="object"){const c=Lu(a);(c.walls.length||c.items.length)&&(r[l]=c)}}return{env:t.env==="outdoor"?"outdoor":"indoor",walls:e.walls,items:e.items,mute:!!t.mute,venue:e.venue,fill:e.fill,lvl:i,levels:r,tech:["essentials","standard","showcase"].includes(t.tech)?t.tech:"showcase",presetNames:bf(t.presetNames),saved:t.saved||0,migrated:!!t.migratedFromTiles}}const rS=100;function oS(n=rS){let t=[],e=[],i=null;return{reset(r){t=[],e=[],i=r},record(r){return i===null?(i=r,!1):r===i?!1:(t.push(i),t.length>n&&t.shift(),e=[],i=r,!0)},undo(){return t.length?(e.push(i),i=t.pop(),i):null},redo(){return e.length?(t.push(i),t.length>n&&t.shift(),i=e.pop(),i):null},get canUndo(){return t.length>0},get canRedo(){return e.length>0},get size(){return t.length+e.length},get current(){return i}}}_r({id:"banquet",name:"Dining",note:"One table to sit around",order:2});_r({id:"booth",name:"Work bays",note:"Two benches with space around them",order:0});_r({id:"classroom",name:"Study",note:"A few desks and chairs",order:1});_r({id:"registration",name:"Welcome",note:"A desk by the door",order:4});_r({id:"theater",name:"Movie night",note:"Seats facing a screen",order:3});const il=.5;function aS(n,t,e,i){const r=n[t];if(!r)return[];const o=r.pts.length,a=r.pts[e],l=r.pts[(e+1)%o];if(!a||!l)return[];const c=Math.hypot(l[0]-a[0],l[1]-a[1]);if(!c)return[];const h=(l[0]-a[0])/c,u=(l[1]-a[1])/c,f=nn/2+il+1e-6,d=new Set;for(const p of i){if(p.host)continue;const{w:x,d:v}=Xi(p),m=Math.cos(p.a),g=Math.sin(p.a);let y=!1;for(const[_,S]of[[-x/2,-v/2],[x/2,-v/2],[x/2,v/2],[-x/2,v/2],[0,0]]){const P=p.x+_*m+S*g,C=p.z-_*g+S*m,T=(P-a[0])*h+(C-a[1])*u;if(!(T<-il||T>c+il)&&Math.abs(-(P-a[0])*u+(C-a[1])*h)<=f){y=!0;break}}if(y){d.add(p);for(const _ of qi(i,p))d.add(_)}}return[...d]}function Tf(n){const t=n.filter(i=>i.closed&&i.pts.length>=3);if(t.length){let i=null;for(const r of t){const o=In([r]);(!i||o.w*o.l>i.w*i.l)&&(i=o)}return i}return In(n)||Zo(zs(n))}const jc=sM().map(({id:n,name:t,note:e})=>({id:n,name:t,note:e})),ze={classRow:3.25,classCentre:4.5,classSide:3.5,wall:3,banquetChairBacks:5,boothAisle:10,regQueue:9,regBehind:5.1,door:3},sl=120,lS=n=>{if(!n)return n;const t={...n};for(const[e,i]of[["minX","maxX"],["minZ","maxZ"]]){const r=(t[e]+t[i])/2;t[i]-t[e]>sl&&(t[e]=r-sl/2,t[i]=r+sl/2)}return"w"in t&&(t.w=t.maxX-t.minX),"l"in t&&(t.l=t.maxZ-t.minZ),t},Ls=[{id:"essentials",name:"Essentials",note:"Furniture + minimal tech"},{id:"standard",name:"Standard",note:"About half the tech"},{id:"showcase",name:"Showcase",note:"Every screen, kiosk and charger"}],Zc="showcase",Af=n=>Math.max(0,Ls.findIndex(t=>t.id===n))||(n==="essentials"?0:2),qn=5,Du={essentials:16,standard:24,showcase:36},cS=n=>Du[n]||Du.essentials;function hS(n,t,e,i,r,o){const a=Is(t,e,i,r||0);if(n.items.push(a),o){const l=Bs(n,a,e,i);mn(n,a,l),a.mode==="free"&&(a.a=r||0)}else mn(n,a,ks(a,e,i,r||0));return zn(n,a)?a:(n.items.pop(),null)}function uS(n,t,e="essentials"){const i=Tf(t.walls);if(!i)return[];const r=cS(e),o=Af(e),a={env:t.env||"indoor",walls:t.walls,items:[]},l=nn/2,c=i.minX+l,h=i.maxX-l,u=i.minZ+l,f=i.maxZ-l,d=(c+h)/2,p=vr(t.walls),x=(_,S,P)=>!p.some(C=>Math.hypot(C.x-_,C.z-S)<Fe/2+qn+P),v=(_,S,P,C,T)=>a.items.length>=r||!x(S,P,1)?null:hS(a,_,S,P,C,T),m=Math.max(0,(h-c)*(f-u)),g=Math.max(1,Math.min(o>=2?3:2,Math.floor(m/1800)||1)),y=f-qn-2;if(n==="banquet"){const _=Math.min(y,u+(f-u)*.72),S=v("round60",d,_,0,!1);if(S)for(const[P,C]of[[0,-3.4],[3.4,0],[0,3.4],[-3.4,0]].concat(o>=1?[[2.4,2.4],[-2.4,2.4]]:[]))v("chair",S.x+P,S.z+C,Math.atan2(P,C),!0);o>=2&&v("screen",d,Math.min(f-3,(S?S.z:_)+10),Math.PI,!1)}else if(n==="theater"){const _=f-qn-1.2;v("screen",d,_,Math.PI,!1);const S=_-qn-2,P=o>=2?8:o>=1?6:4,C=1.8,T=qn+1;for(let I=0;I<P;I++){const Z=I<P/2?-1:1,M=I<P/2?P/2-1-I:I-P/2;v("chair",d+Z*(T/2+.9+M*C),S,Math.PI,!1)}}else if(n==="registration"){const _=Math.min(h-qn,d+12),S=u+qn+6,P=v("table6",_,S,0,!1);P&&v("chair",P.x,P.z+2.4,0,!0),o>=1&&P&&v("laptop",P.x,P.z,0,!0)}else if(n==="booth"){const _=y-4,S=Math.max(8,Math.min(14,(h-c)/2-8)),P=v("table6",d-S,_,0,!1),C=v("table6",d+S,_,0,!1);P&&v("chair",P.x,P.z-2.4,Math.PI,!0),C&&v("chair",C.x,C.z-2.4,Math.PI,!0),o>=1&&(P&&v("laptop",P.x,P.z,0,!0),C&&v("laptop",C.x,C.z,0,!0))}else{const _=Math.min(g,o>=2?3:2),S=6+qn+2,P=d-(_-1)*S/2,C=y-6;for(let T=0;T<_;T++){const I=v("table6",P+T*S,C,0,!1);I&&(v("chair",I.x-1.5,I.z-2.3,Math.PI,!0),v("chair",I.x+1.5,I.z-2.3,Math.PI,!0),o>=1&&v("laptop",I.x,I.z,0,!0))}o>=2&&v("screen",d,f-qn-1.2,Math.PI,!1)}return a.items}function dS(n,t,e=Zc){if(t&&t.home)return uS(n,t,e);const i=rM(n);if(i&&i.build)return i.build(t,e);const r=lS(Tf(t.walls));if(!r)return[];const o={env:t.env,walls:t.walls,items:[]},a=nn/2+2,l=r.minX+a,c=r.maxX-a;r.minZ+a,r.maxZ-a;const h=(l+c)/2,u=Af(e),f=U=>u>={e:0,s:1,x:2}[U],d=(U,z,L,W=0,k=!1)=>{const Y=Is(U,z,L,W);return o.items.push(Y),mn(o,Y,k?Bs(o,Y,z,L):ks(Y,z,L,W)),k&&Y.mode==="free"&&(Y.a=W),zn(o,Y)?Y:(o.items.pop(),null)},p=(U,z,L,W)=>{const k=Is(U,z,L,W);return o.items.push(k),mn(o,k,{x:z,z:L,a:W,y:0,host:null,mode:"free"}),zn(o,k)?k:(o.items.pop(),null)},x=(U,z,L,W,k=0,Y=!1)=>f(U)?d(z,L,W,k,Y):null,v=(U,z,L,W,k)=>{if(!f(U)||!L)return null;const Y=d(z,W,k,L.a,!0);return Y&&Y.host!==L.uid?(o.items.splice(o.items.indexOf(Y),1),null):Y},m=(U,z)=>{for(const[L,W]of z){const k=d("chair",L,W,0,!0);k&&k.host!==U.uid&&o.items.splice(o.items.indexOf(k),1)}},g=nn/2,y=r.minX+g,_=r.maxX-g,S=r.minZ+g,P=r.maxZ-g,C=vr(t.walls),T=(U,z,L)=>C.some(W=>Math.hypot(W.x-U,W.z-z)<L+Fe/2+ze.door),I=(U,z)=>U-z>=y+ze.wall-1e-6&&U+z<=_-ze.wall+1e-6,Z=U=>{const z=[],L=Fe/2+ze.door+U+.6,W=U+.6,k=C.length?C.slice(0,4):[{x:(y+_)/2,z:P}];for(const Y of k){const et=[[Math.abs(Y.z-S),0,1],[Math.abs(Y.z-P),0,-1],[Math.abs(Y.x-y),1,0],[Math.abs(Y.x-_),-1,0]].sort((Pt,V)=>Pt[0]-V[0])[0],j=et[1],xt=et[2];for(const Pt of[L,L+2*U+.4])for(const V of[-1,1])z.push([Y.x+j*W+(xt?V*Pt:0),Y.z+xt*W+(j?V*Pt:0),Math.atan2(j,xt),xt?V:0,j?V:0])}return z},M=(U,z,L,W,k,Y)=>{const et=Jt({type:"ledposter"}).w,j=[];for(let xt=0;xt<U;xt++){const Pt=(j[0]?j[0].x:z)+k*et*xt,V=(j[0]?j[0].z:L)+Y*et*xt,K=T(Pt,V,1.1)?null:xt===0?d("ledposter",Pt,V,W):p("ledposter",Pt,V,j[0].a);if(!K){for(const lt of j)o.items.splice(o.items.indexOf(lt),1);return null}j.push(K)}for(let xt=1;xt<U;xt++)fc(j[xt-1],j[xt]);return j},b=(U,z)=>{if(!f(U))return 0;let L=0;const W=Z(1.1);for(let k=0;k<W.length&&L<z.length;k++){const[Y,et,j,xt,Pt]=W[k];if(Y<y+.8||Y>_-.8||et<S+.8||et>P-.8)continue;const V=/^wall(\d)$/.exec(z[L]);(V?M(+V[1],Y,et,j,xt,Pt)||d("ledposter",Y,et,j):d(z[L],Y,et,j))&&L++}return L},B=(U,z,L)=>f(U)?d(z,L,S+1,0,!0):null,H=(U,z,L)=>{f(U)&&(d(z,y+.5,L,Math.PI/2,!0),d(z,_-.5,L,-Math.PI/2,!0))};if(n==="banquet"){const z=Math.ceil((8.06+ze.banquetChairBacks)*2)/2,L=4.03+ze.wall,W=4.5,k=Math.max(1,Math.floor((_-y-2*L)/z)+1),Y=Math.max(1,Math.floor((P-S-W-2*L)/z)+1),et=(y+_)/2-(k-1)*z/2,j=(S+W+P)/2-(Y-1)*z/2;if(_-y<2*L||P-S-W<2*L)return[];for(let K=0;K<k;K++)for(let lt=0;lt<Y;lt++){const at=et+K*z,Rt=j+lt*z;if(T(at,Rt,4.03))continue;const Ot=d("round60",at,Rt);Ot&&m(Ot,[...Array(8)].map((Ht,Xt)=>[Ot.x+3.2*Math.sin(Xt*Math.PI/4),Ot.z+3.2*Math.cos(Xt*Math.PI/4)]))}const xt=B("s","led",h),Pt=xt?5.6+1.5:0,V=f("s")?d("podium",h+Pt,S+1.6):null;v("s","laptop",V,V&&V.x,V&&V.z),H("s","tv75",S+(P-S)*.35);for(const[K,lt,at]of[[y+1,S+1,"s"],[_-1,S+1,"s"],[y+1,P-1,"x"],[_-1,P-1,"x"]])x(at,"speaker",K,lt);b("s",f("x")?["wall3","ledposter","tower"]:["ledposter"])}if(n==="classroom"){const W=Math.ceil((3.68+ze.classRow)*2)/2,k=ze.classCentre,Y=ze.classSide,et=Math.max(1,Math.floor((_-y-2*Y+k)/(6+k))),j=et*6+(et-1)*k,xt=(y+_)/2-j/2+6/2,Pt=f("x")?B("x","led",h):B("s","screen",h),V=d("podium",Pt?Math.min(h+7.2,_-2):(y+_)/2,S+1.5);v("e","laptop",V,V&&V.x,V&&V.z);const K=S+7.5,lt=Math.max(0,Math.floor((P-ze.wall-2.43-K)/W)+1);let at=0;for(let Rt=0;Rt<lt;Rt++)for(let Ot=0;Ot<et;Ot++){const Ht=xt+Ot*(6+k),Xt=K+Rt*W;if(T(Ht,Xt,3.5))continue;const J=d("table6",Ht,Xt);J&&(m(J,[[J.x-1.6,J.z+1.6],[J.x+1.6,J.z+1.6]]),(f("x")||f("s")&&at%2===0)&&v("s","laptop",J,J.x-1.6,J.z+.3),v("x","ipad",J,J.x+1.6,J.z+.3),at++)}lt>=3&&H("x","tv75",K+W*Math.floor(lt/2)),x("s","speaker",y+1,S+1),x("s","speaker",_-1,S+1),b("x",["tower","wall2"])}if(n==="theater"){const L=ze.classCentre,W=S+9,k=Math.floor((_-y-2*ze.wall-L)/2/1.5),Y=Math.PI;if(k<2||P-ze.wall-W<3)return[];const et=f("s")?Z(1.1):[],j=(K,lt)=>et.some(([at,Rt])=>Math.abs(at-K)<2.6&&Math.abs(Rt-lt)<2.6);for(let K=W;K+.83<=P-ze.wall+1e-6;K+=3)for(const lt of[-1,1])for(let at=0;at<k;at++){const Rt=h+lt*(L/2+.75+at*1.5);T(Rt,K,1.2)||j(Rt,K)||d("chair",Rt,K,Y)}const xt=B("s","led",h),Pt=10/2+.6;xt&&f("x")&&(B("x","screen",h-5.9-Pt),B("x","screen",h+5.9+Pt));const V=d("podium",h+(xt?-6.6:0),S+(xt?4.2:1.6));v("e","laptop",V,V&&V.x,V&&V.z),x("s","speaker",y+1,S+1.5),x("s","speaker",_-1,S+1.5),x("x","speaker",y+1,(W+P)/2),x("x","speaker",_-1,(W+P)/2),b("s",f("x")?["wall3","ledposter","kiosk","tower"]:["ledposter"])}if(n==="registration"){const U=S+ze.regBehind+2.43,z=Math.max(1,Math.min(4,Math.floor((_-y-2*ze.wall+1)/7))),L=(y+_)/2-(z-1)*7/2;let W=0;f("x")?B("x","led",h):f("s")&&d("tv75",h,S+.5,0,!0);for(let Y=0;Y<z;Y++){const et=L+Y*7;if(T(et,U,4))continue;const j=d("table6",et,U);j&&(W++,m(j,[[j.x-1.6,j.z-1.6],[j.x+1.6,j.z-1.6]]),v("e","laptop",j,j.x-1.9,j.z),v("s","laptop",j,j.x+1.9,j.z),v("x","monitor",j,j.x,j.z-.4))}if(W)for(const Y of[-1,1]){const et=Y<0?L-3.5-1.5:L+(z-1)*7+3.5+1.5;I(et,1.05)&&!T(et,U,1.1)&&x(Y<0?"s":"x","ledposter",et,U)}const k=U+1.25+ze.regQueue+1.5;if(k+1+ze.regQueue/2<P)for(const[Y,et]of[[-5,"s"],[5,"s"],[-10,"x"],[10,"x"]]){const j=(y+_)/2+Y;I(j,.75)&&!T(j,k,.75)&&x(et,"kiosk",j,k)}{const Y=h+(f("x")?7.6:3.6);I(Y,.67)&&x("x","tower",Y,S+1.2)}}if(n==="booth"){const U=nn/2+5.5,z=r.minX+U,L=r.maxX-U,W=Math.max(1,Math.floor((L-z)/10.5)+1),k=(z+L)/2-(W-1)*10.5/2,Y=r.l>=20+ze.boothAisle?[[r.minZ+U,0],[r.maxZ-U,Math.PI]]:[[r.minZ+U,0]];let et=0;for(const[j,xt]of Y)for(let Pt=0;Pt<W;Pt++){const V=k+Pt*10.5;if(T(V,j,7.1))continue;const K=d("booth10",V,j,xt);if(!K)continue;const lt=d("table6",K.x,K.z,0),at=Math.cos(xt),Rt=K.z-at*4.4;(f("x")||f("s")&&et%2===0)&&d("tv55",K.x,Rt,xt,!0),v("s",lt&&f("x")&&et%2?"ipad":"laptop",lt,lt&&lt.x-1.5,lt&&lt.z),f("x")&&lt&&et%2===0&&v("x","ipad",lt,lt.x+1.5,lt.z),x("x","ledposter",K.x+3.8,K.z+at*3.8,xt),et++}if(Y.length>1){const j=(Y[0][0]+Y[1][0])/2;for(let xt=1,Pt=0;xt<W;xt+=3,Pt++)x(Pt%2?"x":"s","tower",k+(xt-.5)*10.5,j)}if(f("s")){const j=[...Z(5.6),[y+1,(S+P)/2,Math.PI/2],[_-1,(S+P)/2,-Math.PI/2]];for(const[xt,Pt,V]of j)if(d("led",xt,Pt,V))break}}return o.items}const fS=n=>{const t={};for(const e of n)t[Jt(e).name]=(t[Jt(e).name]||0)+1;return t};s.DBG={err:"",lost:0,restored:0,crashes:0};s.noteErr=n=>{s.DBG.err=new Date().toLocaleTimeString()+"  "+(n&&(n.stack||n.message)||String(n))};addEventListener("error",n=>s.noteErr(n.error||n.message));addEventListener("unhandledrejection",n=>s.noteErr(n.reason));s.sim=null,s.simG=null,s.lastEvent=null,s.simLast=0;s.HL=ie(nt.colors.highlight),s.AC=ie(nt.colors.accent);s.$=n=>document.querySelector(n),s.$$=n=>[...document.querySelectorAll(n)];s.S={env:"indoor",walls:[],items:[],mute:!1,preset:"30x40",venue:null,fill:null,lvl:1,levels:{},tech:Zc,presetNames:{}};s.selDoor=null,s.active=null,s.selSeg=null,s.rub=null,s.tool="view",s.lock={axis:null},s.boxA=null,s.boxIdx=null,s.wasAligned=!1;s.topDown=!1,s.panMode=!1,s.wallsView="low",s.stamp=null,s.picker=!1,s.pendEdit=null,s.push=null,s.editPi=null,s.editGood=!0,s.preTop=null;s.W={get env(){return s.S.env},get walls(){return s.S.walls},get items(){return s.S.items},set items(n){s.S.items=n},get cols(){return s.S.venue?s.S.venue.cols:[]},get fill(){return s.S.fill}};s.loadSaved=()=>{try{return Ef(localStorage.getItem(wf)||nS.map(n=>localStorage.getItem(n)).find(Boolean)||null)}catch{return null}};s.saveT=0;s.save=()=>{clearTimeout(s.saveT),s.saveT=setTimeout(s.saveNow,300),s.H.record(s.snap())&&s.histUI()};s.H=oS();s.snap=()=>JSON.stringify({env:s.S.env,walls:s.S.walls,items:s.S.items,venue:s.S.venue,fill:s.S.fill,lvl:s.S.lvl,levels:s.S.levels,presetNames:s.S.presetNames||{},active:s.active});s.histUI=function(){s.$$(".hUndo").forEach(t=>t.disabled=!s.H.canUndo),s.$$(".hRedo").forEach(t=>t.disabled=!s.H.canRedo)};s.restore=function(t){if(!t)return;typeof s.simStop=="function"&&s.simStop();const e=JSON.parse(t);s.S.env=e.env,s.S.walls=e.walls,s.S.items=e.items,s.S.venue=e.venue||null,s.S.fill=e.fill||null,s.S.lvl=Number.isInteger(e.lvl)?e.lvl:1,s.S.levels=e.levels||{},s.S.presetNames=e.presetNames||{},typeof s.renderPresets=="function"&&s.renderPresets(),s.active=e.active!=null&&s.S.walls[e.active]&&!s.S.walls[e.active].closed?e.active:null,s.rub=null,s.selSeg=null,s.selDoor=null,s.corner=null,s.draw=null,s.push=null,s.pendEdit=null,s.editPi=null,s.editGood=!0,s.confirmUI(),s.boxA=s.boxIdx=null,s.drag=null,s.S.preset=null,s.renderPresets(),s.select(null),s.applyEnv(),s.syncItems(),clearTimeout(s.saveT),s.saveT=setTimeout(s.saveNow,300),s.histUI(),s.rebuildSoon()};s.undo=function(){if(s.pendEdit)return s.cancelEdit();const t=s.H.undo();t&&(s.restore(t),s.sTile(!1),s.toast("Undone"))};s.redo=function(){s.commitEdit();const t=s.H.redo();t&&(s.restore(t),s.sTile(!0),s.toast("Redone"))};s.histReset=()=>{s.H.reset(s.snap()),s.histUI()};s.beginEdit=function(){return s.commitEdit(),{walls:JSON.stringify(s.S.walls),items:JSON.stringify(s.S.items),preset:s.S.preset}};s.putBack=n=>{s.S.walls=JSON.parse(n.walls),s.S.preset=n.preset,n.items&&(s.S.items=JSON.parse(n.items),s.syncItems())};s.finishEdit=function(t,e,i){if(!s.editGood)return s.putBack(t),s.editPi=null,s.editGood=!0,s.renderPresets(),s.buildUI(),s.rebuildSoon(),s.sBad(),s.toast("That doesn't fit, so it was put back");if(e){s.pendEdit=t,s.confirmUI(),s.S.preset=null,s.renderPresets(),s.buildUI(),s.rebuildSoon(),i&&s.toast(i+" · tap ✓ to keep it");return}s.editPi=null,s.wallsChanged(),i&&s.toast(i)};s.commitEdit=function(){s.pendEdit&&(s.pendEdit=null,s.editPi=null,s.confirmUI(),s.wallsChanged())};s.cancelEdit=function(){s.pendEdit&&(s.putBack(s.pendEdit),s.pendEdit=null,s.editPi=null,s.editGood=!0,s.active=null,s.selSeg=null,s.selDoor=null,s.confirmUI(),s.renderPresets(),s.buildUI(),s.rebuildSoon(),s.sTile(!1),s.toast("Change cancelled"))};s.confirmUI=function(){const t=s.$("#confirm");t&&t.classList.toggle("hidden",!s.pendEdit)};s.WALLS_VIEWS=["low","full","hidden"],s.WV_NAME={low:"Low",full:"Full",hidden:"Hidden"};s.wallHt=function(){const t=s.S.env==="outdoor";return s.wallsView==="full"?t?3.5:9:s.wallsView==="hidden"?t?.05:.08:t?.35:s.WALL_H};s.setTop=function(t){if(t!==s.topDown){if(s.topDown=t,t){s.preTop=s.V.yaw,s.V.yaw=Math.round(s.V.yaw/(Math.PI/2))*(Math.PI/2);const e=In(s.S.walls);if(e){const i=Math.max(.3,innerWidth/Math.max(1,innerHeight)),r=Math.abs(Math.sin(s.V.yaw))>.5,o=r?e.l:e.w,a=r?e.w:e.l;s.V.tx=(e.minX+e.maxX)/2,s.V.tz=(e.minZ+e.maxZ)/2,s.V.dist=Math.max(20,Math.max(o/i,a)*1.75)}}else s.preTop!=null&&(s.V.yaw=s.preTop);s.viewUI(),s.setHint(),s.frame()}};s.setPanMode=function(t){s.panMode=!!t,s.viewUI(),s.setHint()};s.setWallsView=function(t){s.wallsView=t,s.viewUI(),s.rebuildSoon()};s.viewUI=function(){const t=s.$("#btnTop"),e=s.$("#btnPanMode"),i=s.$("#btnWallsView");t&&(t.classList.toggle("on",s.topDown),t.querySelector("span").textContent=s.topDown?"3D view":"Top view",e.classList.toggle("on",s.panMode),e.querySelector("span").textContent=s.panMode?"Drag: Pan":"Drag: Turn",i.querySelector("span").textContent="Walls: "+s.WV_NAME[s.wallsView],i.classList.toggle("on",s.wallsView!=="low"))};s.stampUI=function(){s.$("#stampBar").classList.toggle("hidden",!(s.stamp||s.picker)),s.$("#btnSame").classList.toggle("on",!!(s.stamp||s.picker)),s.$("#stampTxt").textContent=s.stamp?`Placing ${$c[s.stamp.type].name} · tap the floor to add more`:"Same again: tap an item to copy it",s.setHint()};s.startStamp=function(t){s.stamp={type:t.type,a:t.a},s.picker=!1,s.select(null),s.stampUI(),s.sTile(!0)};s.endStamp=function(){s.stamp=null,s.picker=!1,s.stampUI()};s.stampAt=function(t,e){const i=s.groundAt(t,e);if(!i)return;const r=Is(s.stamp.type,i[0],i[1],s.stamp.a);s.S.items.push(r);const o=qc(s.W,r,i[0],i[1],4)||Bs(s.W,r,i[0],i[1]);if(mn(s.W,r,o),!zn(s.W,r))return s.S.items.splice(s.S.items.indexOf(r),1),s.syncItems(),s.sBad(),s.toast("No room there");s.anim.set(r.uid,performance.now()),s.sDrop(),s.save(),s.syncItems(),s.frame()};s.logoImg=new Image;s.logoImg.src=nt.logo;s.layoutPng=function(){return s.endFx(),new Promise(t=>{s.placeCam(),s.R.render(s.scene,s.camera);const e=s.R.domElement,i=e.width,r=e.height,o=Math.round(Math.max(56,r*.08)),a=document.createElement("canvas");a.width=i,a.height=r+o;const l=a.getContext("2d");l.drawImage(e,0,0);const c=nt.colors;l.fillStyle=c.strip,l.fillRect(0,r,i,o);let h=o*.25,u=!1;if(s.logoImg.complete&&s.logoImg.naturalWidth){const d=o*.62,p=d*(s.logoImg.naturalWidth/s.logoImg.naturalHeight);l.drawImage(s.logoImg,o*.2,r+(o-d)/2,p,d),h=o*.2+p+o*.3,u=!0}const f=Math.round(o*(h>i*.55?.2:.28));l.fillStyle=c.stripText,l.font=`700 ${f}px ${nt.fonts.body}`,l.textBaseline="middle",l.fillText(u?nt.appName:`${nt.name} · ${nt.appName}`,h,r+o*.36),l.fillStyle=c.stripSub,l.font=`600 ${Math.round(f*.8)}px ${nt.fonts.body}`,l.fillText(Dc(s.S.walls)+` · ${s.S.items.length} item${s.S.items.length===1?"":"s"}`,h,r+o*.7),a.toBlob(d=>{const p={w:a.width,h:a.height,logo:u};a.width=a.height=0,t({blob:d,info:p})},"image/png")})};s.lastShare=null;s.shareLayout=async function(){const{blob:t,info:e}=await s.layoutPng();if(!t)return s.toast("Could not make the picture"),null;const i=new File([t],"my-event-layout.png",{type:"image/png"});try{if(navigator.canShare&&navigator.share&&navigator.canShare({files:[i]}))return s.lastShare={how:"share",...e,size:t.size},await navigator.share({files:[i],title:nt.copy.shareTitle,text:nt.copy.shareText}),s.lastShare}catch(a){if(a&&a.name==="AbortError")return s.lastShare}const r=URL.createObjectURL(t),o=document.createElement("a");return o.href=r,o.download="my-event-layout.png",document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(r),1500),s.lastShare={how:"download",...e,size:t.size},s.toast("Picture saved"),s.sTile(!0),s.lastShare};function Kc(n){if(!n||n.env==="outdoor")return 0;let t=0;for(let e=0;e<(n.walls||[]).length;e++){const i=n.walls[e];if(!i||!i.closed||(i.doors||[]).length||!i.pts||i.pts.length<3)continue;let r=0,o=0;for(let l=0;l<i.pts.length;l++){const c=i.pts[l],h=i.pts[(l+1)%i.pts.length],u=Math.hypot(h[0]-c[0],h[1]-c[1]);u>r&&(r=u,o=l)}if(r<Fe+1)continue;const a=Oc(n.walls,e,o,r/2);a&&!a.error&&t++}return t}const Cf="zdash.interior.presetNames.v1";s.presetMemory=function(){try{const t=JSON.parse(localStorage.getItem(Cf)||"{}");return t&&typeof t=="object"?t:{}}catch{return{}}};s.rememberPreset=function(t,e){const i=s.presetMemory();i[t]=e;try{localStorage.setItem(Cf,JSON.stringify(i))}catch{}};s.showEventPresets=function(){s.$("#sheet").classList.remove("hidden"),s.$("#sheet").classList.add("presetsheet"),s.$("#shBack").classList.add("hidden"),s.$("#shTitle").textContent=s.W&&s.W.home?"Room presets":"Event presets",s.$("#shBody").innerHTML=s.techRowHTML()+'<div class="catgrid">'+jc.map(t=>`<button class="cat evp" data-ev="${t.id}">${s.EV_ICONS[t.id]}<span class="evname" data-ev="${t.id}">${s.presetName(t.id)}</span><small>${t.note}</small></button>`).join("")+"</div>",s.bindTechRow(),s.$$(".evp").forEach(t=>t.onclick=()=>s.useEventPreset(t.dataset.ev)),s.$$(".evname").forEach(t=>t.onclick=e=>{e.preventDefault(),e.stopPropagation(),s.renamePreset(t.dataset.ev,t)})};s.renamePreset=function(t,e){const i=s.presetName(t),r=document.createElement("input");r.className="evrename",r.value=i,r.maxLength=40,r.setAttribute("aria-label","Preset name"),e.replaceWith(r),r.focus(),r.select();let o=!1;const a=l=>{if(o)return;o=!0;const c=l&&(r.value||"").trim().slice(0,40)||i;l&&(s.S.presetNames=Object.assign({},s.S.presetNames,{[t]:c}),s.rememberPreset(t,c),s.save()),s.showEventPresets()};r.onclick=l=>l.stopPropagation(),r.onkeydown=l=>{l.key==="Enter"?(l.preventDefault(),a(!0)):l.key==="Escape"&&(l.preventDefault(),a(!1))},r.onblur=()=>a(!0)};s.techRowHTML=()=>`<div class="techrow" role="radiogroup" aria-label="Tech level"><b>Tech level</b><div class="seg">${Ls.map(n=>`<button class="tlv${n.id===s.S.tech?" on":""}" role="radio" aria-checked="${n.id===s.S.tech}" data-tech="${n.id}">${n.name}</button>`).join("")}</div><small id="techNote">${(Ls.find(n=>n.id===s.S.tech)||{}).note||""}</small></div>`;s.techName=()=>(Ls.find(n=>n.id===s.S.tech)||{}).name||"Essentials";s.setTech=function(t){if(!Ls.some(i=>i.id===t))return;s.S.tech=t,s.$$(".tlv").forEach(i=>{const r=i.dataset.tech===t;i.classList.toggle("on",r),i.setAttribute("aria-checked",r)});const e=s.$("#techNote");e&&(e.textContent=Ls.find(i=>i.id===t).note||""),clearTimeout(s.saveT),s.saveT=setTimeout(s.saveNow,300)};s.bindTechRow=function(){s.$$(".tlv").forEach(t=>t.onclick=()=>s.setTech(t.dataset.tech))};s.hasPreset=()=>!!s.S.fill||s.S.items.some(n=>n.preset);s.isFillKind=n=>!!s.S.venue&&n!=="registration";s.presetName=n=>{const t=s.S.presetNames&&s.S.presetNames[n];if(t)return t;const e=s.presetMemory?s.presetMemory():{};return e&&e[n]?e[n]:(jc.find(i=>i.id===n)||{}).name||n};s.useEventPreset=function(t,e){return!e&&s.hasPreset()?(s.presetAsk(t),"ask"):s.isFillKind(t)?s.useVenueFill(t,e||"add"):s.applyLayout(t,e||"add")};s.dropPresetItems=function(){const t=new Set;for(const e of s.S.items)if(e.preset){t.add(e);for(const i of qi(s.S.items,e))t.add(i)}return s.S.items=s.S.items.filter(e=>!t.has(e)),t.size};s.presetAsk=function(t){s.closePresetAsk();const e=s.isFillKind(t)&&!!s.S.fill,i=s.S.items.filter(a=>a.preset).length,r=s.S.fill?i?`a room fill and ${i} preset item${i===1?"":"s"}`:"a room fill":`${i} preset item${i===1?"":"s"}`,o=document.createElement("div");o.id="presetAsk",o.className="pask",o.setAttribute("role","dialog"),o.setAttribute("aria-modal","true"),o.innerHTML=`<div class="paskbox"><b>${s.presetName(t)} preset</b><p>This floor already has ${r}. Items you placed yourself stay either way.</p>
    <label class="paskopt"><input type="radio" name="pask" value="replace" checked><span>Replace current preset</span></label>
    <label class="paskopt${e?" off":""}"><input type="radio" name="pask" value="add"${e?" disabled":""}><span>Add alongside${e?" <small>(one room fill per floor)</small>":""}</span></label>
    <div class="paskbtns"><button id="paskCancel" class="pbtn">Cancel</button><button id="paskOk" class="pbtn on">Apply</button></div></div>`,document.body.appendChild(o),o.onclick=a=>{a.target===o&&s.closePresetAsk()},s.$("#paskCancel").onclick=()=>s.closePresetAsk(),s.$("#paskOk").onclick=()=>{const a=o.querySelector("input[name=pask]:checked").value;s.closePresetAsk(),s.useEventPreset(t,a)},s.$("#paskOk").focus()};s.closePresetAsk=function(){const t=s.$("#presetAsk");t&&t.remove()};s.applyLayout=function(t,e){const i=s.presetName(t),r=dS(t,s.W,s.S.tech);if(!r.length)return s.sBad(),s.toast("This room is too small for that layout"),!1;s.closeSheet(),s.endStamp(),s.select(null),s.lastEvent=t,e==="replace"&&(s.dropPresetItems(),s.S.fill=null);for(const l of r)l.preset=t;s.S.items=[...s.S.items,...r];for(const l of r)l.host||s.anim.set(l.uid,performance.now());const o=Kc(s.W);o&&s.rebuild(),s.syncItems(),s.save(),s.sSnap();const a=In(s.S.walls);return a&&s.burst((a.minX+a.maxX)/2,(a.minZ+a.maxZ)/2,70),fS(r),s.toast(`${i} layout (${s.techName()}): ${r.length} items ${e==="replace"?"replaced the old preset":"added"}${o?" + a door":""} · Undo to take it back`),s.frame(),!0};s.EV_ICONS=Object.fromEntries(Object.entries({booth:'<svg viewBox="0 0 48 48" fill="none" stroke="#f4efe6" stroke-width="2.5"><path d="M6 38V12h16v26M26 38V12h16v26"/><path d="M10 30h8M30 30h8" stroke="#ff6a1a"/></svg>',classroom:'<svg viewBox="0 0 48 48" fill="none" stroke="#f4efe6" stroke-width="2.5"><path d="M18 8h12" stroke="#ff6a1a"/><path d="M8 18h12M28 18h12M8 28h12M28 28h12M8 38h12M28 38h12"/></svg>',banquet:'<svg viewBox="0 0 48 48" fill="none" stroke="#f4efe6" stroke-width="2.5"><circle cx="24" cy="24" r="9"/><g stroke="#2ce0c6"><circle cx="24" cy="9" r="2.5"/><circle cx="24" cy="39" r="2.5"/><circle cx="9" cy="24" r="2.5"/><circle cx="39" cy="24" r="2.5"/><circle cx="13.5" cy="13.5" r="2.5"/><circle cx="34.5" cy="34.5" r="2.5"/><circle cx="13.5" cy="34.5" r="2.5"/><circle cx="34.5" cy="13.5" r="2.5"/></g></svg>',registration:'<svg viewBox="0 0 48 48" fill="none" stroke="#f4efe6" stroke-width="2.5"><path d="M6 22h36M10 22v14M38 22v14"/><rect x="14" y="13" width="8" height="6" stroke="#2ce0c6"/><rect x="27" y="13" width="8" height="6" stroke="#2ce0c6"/><path d="M24 30v10M20 40h8" stroke="#ff6a1a"/></svg>',theater:'<svg viewBox="0 0 48 48" fill="none" stroke="#f4efe6" stroke-width="2.5"><rect x="12" y="6" width="24" height="6" rx="1" stroke="#2ce0c6"/><path d="M8 20h8M20 20h8M32 20h8M8 28h8M20 28h8M32 28h8M8 36h8M20 36h8M32 36h8"/></svg>'}).map(([n,t])=>[n,t.replace(/#f4efe6/g,nt.colors.fg).replace(/#ff6a1a/g,nt.colors.highlight).replace(/#2ce0c6/g,nt.colors.accent)])),s.NO_SAVE=/selftest/.test(location.search),s.saveNow=()=>{if(!s.NO_SAVE)try{localStorage.setItem(wf,Yc(s.S))}catch{}};typeof s.simStop!="function"&&(s.simStop=function(){});s.showScreen=function(t){s.$$(".screen").forEach(e=>e.classList.toggle("on",e.id===t)),t==="build"&&(s.resize(),s.frame()),t==="start"&&s.startUI()};s.startUI=function(){const t=s.loadSaved(),e=t&&(t.walls.length||t.items.length);s.$("#btnOpen").disabled=!e,s.$("#savedNote").textContent=e?`Saved layout: ${Dc(t.walls)}, ${t.items.length} item${t.items.length===1?"":"s"} (${t.env==="outdoor"?"Outdoor":"Indoor"})`:"No saved layout yet."};s.$("#btnNew").onclick=()=>{const n=s.loadSaved();n&&(n.walls.length||n.items.length)&&!confirm("Start a new layout? This replaces your saved layout.")||(s.S.venue=null,s.S.fill=null,s.S.lvl=1,s.S.levels={},s.S.walls=[],s.S.items=[],s.S.env="indoor",s.$$(".choice").forEach(t=>t.classList.toggle("on",t.dataset.env==="indoor")),s.showScreen("setup"))};s.$("#btnOpen").onclick=()=>{const n=s.loadSaved();n&&(Object.assign(s.S,{env:n.env,walls:n.walls,items:n.items,venue:n.venue||null,fill:n.fill||null,lvl:n.lvl??1,levels:n.levels||{},tech:n.tech||Zc}),s.active=null,s.selSeg=null,s.setMute(n.mute),s.applyEnv(),s.select(null),s.setPhase("place"),s.resetView(),s.showScreen("build"),s.toast(n.migrated?"Layout opened. Your floor was turned into walls.":"Layout opened"),s.histReset())};s.$$("[data-go]").forEach(n=>n.onclick=()=>s.showScreen(n.dataset.go));s.$$(".choice").forEach(n=>n.onclick=()=>{s.$$(".choice").forEach(t=>t.classList.toggle("on",t===n)),s.S.env=n.dataset.env});s.$("#btnBuild").onclick=()=>{s.usePreset(O_[s.S.env]),s.applyEnv(),s.select(null),s.setPhase("build"),s.resetView(),s.save(),s.showScreen("build"),s.histReset()};s.$("#btnHome").onclick=()=>{s.commitEdit(),s.endStamp(),s.saveNow(),s.closeSheet(),s.showScreen("start")};s.phase="build",s.hintShown=!1;s.HINT_KEY="esp.presetHint.v1";s.hintT=0;s.showPresetHint=function(){if(s.hintShown||s.S.items.length||s.S.fill||s.sim)return;s.hintShown=!0;try{if(!s.NO_SAVE){if(localStorage.getItem(s.HINT_KEY))return;localStorage.setItem(s.HINT_KEY,"1")}}catch{}const t=s.$("#presetTip");t.classList.remove("hidden"),s.$("#btnEvents").classList.add("pulse"),clearTimeout(s.hintT),s.hintT=setTimeout(()=>{t.classList.add("hidden"),s.$("#btnEvents").classList.remove("pulse")},6e3)};s.setPhase=function(t){s.phase=t,t!=="place"&&s.simStop(),s.$("#btnRun")&&s.$("#btnRun").classList.toggle("hidden",t!=="place"),t==="place"&&s.$("#presetTip")?setTimeout(s.showPresetHint,0):s.$("#presetTip")&&s.$("#presetTip").classList.add("hidden"),t!=="place"&&(s.stamp||s.picker)&&s.$("#stampBar")&&(s.stamp=null,s.picker=!1,s.stampUI()),t==="build"&&s.$("#drawTools")&&(s.tool="view",s.active=null,s.rub=null,s.$$("#drawTools button").forEach(i=>i.classList.toggle("on",i.dataset.tool==="view"))),s.$$("#modes button").forEach(i=>i.classList.toggle("on",i.dataset.phase===t)),s.$("#toolsBuild").classList.toggle("hidden",t!=="build"),s.$("#toolsPlace").classList.toggle("hidden",t!=="place"),t==="build"?s.select(null):(s.active=null,s.selSeg=null,s.rub=null),s.$("#presets").classList.toggle("hidden",t!=="build"),s.cursorDot.visible=!1;const e=s.$("#hint");e.style.opacity=1,s.setHint(),s.$("#drawTools").classList.toggle("hidden",t!=="build"),s.buildUI(),s.rebuildSoon()};s.setMode=n=>s.setPhase(n==="move"?"place":"build");s.usePreset=function(t){s.S.preset=t,s.S.venue=null,s.S.fill=null,s.S.walls=F_(t),s.active=null,s.selSeg=null,s.rub=null,s.renderPresets()};s.renderPresets=function(){s.$("#presets").innerHTML=bd.map(t=>`<button data-p="${t.id}" class="${s.S.preset===t.id?"on":""}">${t.name}</button>`).join(""),s.$$("#presets button[data-p]").forEach(t=>t.onclick=()=>{s.usePreset(t.dataset.p),Kc(s.W),s.resetView(),s.save(),s.rebuild(),s.sDrop()})};s.buildUI=function(){const t=s.$("#drawTools [data-tool=door]");t&&t.classList.toggle("hidden",s.S.env==="outdoor"&&!s.S.walls.some(i=>i.pts.length>=2)),t&&t.classList.contains("hidden")&&s.tool==="door"&&(s.tool="view",s.$$("#drawTools button").forEach(i=>i.classList.toggle("on",i.dataset.tool==="view")),s.setHint()),s.$("#btnDelWall").textContent=s.selDoor?"Delete door":"Delete wall",s.$("#btnDelWall").disabled=!s.selSeg&&!s.selDoor;const e=s.active!=null&&s.S.walls[s.active];s.$("#btnCloseWalls").classList.toggle("hidden",!(s.tool==="walls"&&e&&!e.closed&&e.pts.length>=3))};s.wallsChanged=function(){s.S.preset=null,s.renderPresets(),s.buildUI(),s.save(),s.rebuildSoon()};s.$$(".hUndo").forEach(n=>n.onclick=s.undo);s.$$(".hRedo").forEach(n=>n.onclick=s.redo);s.$("#btnDelWall").onclick=()=>{if(s.selDoor)return K_(s.S.walls,s.selDoor.pi,s.selDoor.k),s.selDoor=null,s.sTile(!1),s.toast("Door removed"),s.wallsChanged();s.selSeg&&(B_(s.S.walls,s.selSeg.pi,s.selSeg.i),s.selSeg=null,s.active=null,s.wallsChanged(),s.toast("Wall removed"))};s.setTool=function(t){s.tool=t,s.$$("#drawTools button").forEach(e=>e.classList.toggle("on",e.dataset.tool===t)),s.tool!=="walls"&&(s.active=null,s.rub=null,s.lock.axis=null),s.selDoor=null,s.selSeg=null,s.cursorDot.visible=!1,s.setHint(),s.buildUI(),s.rebuildSoon()};s.$$("#drawTools button").forEach(n=>n.onclick=()=>s.commitEdit()||s.setTool(n.dataset.tool===s.tool&&s.tool!=="view"?"view":n.dataset.tool));s.setHint=function(){const t=s.$("#hint");t.style.opacity=1;const e=r=>` · Tap ${r} again to stop drawing`,i=s.topDown||s.panMode?"pan":"turn the view";t.textContent=s.phase!=="build"?s.stamp?"Tap the floor to add another · Tap Done when finished":s.picker?"Tap a placed item to copy it":`Tap an item to select it · Drag items to move · Drag empty space to ${i}`:s.tool==="view"?`Drag to ${i} · Pick Box, Walls or Door to draw or edit walls`:s.tool==="box"?"Drag corner to corner to make a room · Drag a wall arrow to push or pull it"+e("Box"):s.tool==="door"?"Tap a wall to add a 3 ft door"+e("Door"):"Tap point to point · Walls stay square"+e("Walls")};s.$("#btnCloseWalls").onclick=()=>{if(s.active==null)return;const n=s.active;s.active=Pd(s.S.walls,s.active),s.celebrate(s.S.walls[n]&&s.S.walls[n].closed?s.S.walls[n]:s.S.walls[s.S.walls.length-1]),s.rub=null,s.lock.axis=null,s.sSnap(),s.toast("Room closed"),s.wallsChanged(),s.setTool("view")};s.$("#btnWallsDone").onclick=()=>{s.commitEdit(),s.active=null,s.rub=null,s.selSeg=null,s.setPhase("place"),s.save()};s.$$("[data-phase]").forEach(n=>n.onclick=()=>{s.commitEdit(),s.setPhase(n.dataset.phase)});s.$("#btnOk").onclick=()=>{s.commitEdit(),s.sSnap(),s.toast("Kept")};s.$("#btnCancel").onclick=s.cancelEdit;s.$("#btnTop").onclick=()=>s.setTop(!s.topDown);s.$("#btnPanMode").onclick=()=>s.setPanMode(!s.panMode);s.$("#btnWallsView").onclick=()=>{s.setWallsView(s.WALLS_VIEWS[(s.WALLS_VIEWS.indexOf(s.wallsView)+1)%3]),s.toast("Walls: "+s.WV_NAME[s.wallsView])};s.$("#btnSame").onclick=()=>{if(s.stamp||s.picker)return s.endStamp();const n=s.selItem();n?(s.startStamp(n),s.toast("Same again: "+Jt(n).name)):(s.picker=!0,s.stampUI())};s.$("#btnStampDone").onclick=s.endStamp;s.$("#btnEvents").onclick=()=>{s.$("#presetTip").classList.add("hidden"),s.$("#btnEvents").classList.remove("pulse"),s.showEventPresets()};s.$("#presetTip").onclick=()=>s.$("#btnEvents").click();s.$("#btnShare").onclick=()=>{s.commitEdit(),s.shareLayout()};s.$("#btnReset").onclick=()=>{s.resetView(),s.frame()};s.$("#btnMute").onclick=()=>{s.setMute(!s.S.mute),s.save()};s.setMute=function(t){s.S.mute=t,s.$("#icoSnd .w").style.display=t?"none":"",s.$("#icoSnd .x").style.display=t?"":"none"};s.toastT;s.toast=function(t){const e=s.$("#toast");e.textContent=t,e.classList.add("on"),clearTimeout(s.toastT),s.toastT=setTimeout(()=>e.classList.remove("on"),1600)};s.actx,s.lastTone=0;s.tone=function(t,e,i,r,o="sine"){if(s.S.mute)return;const a=performance.now();if(!(a-s.lastTone<40)){s.lastTone=a,s.DBG.tones=(s.DBG.tones||0)+1;try{s.actx=s.actx||new(window.AudioContext||window.webkitAudioContext);const l=s.actx.createOscillator(),c=s.actx.createGain(),h=s.actx.currentTime;l.type=o,l.frequency.setValueAtTime(t,h),l.frequency.exponentialRampToValueAtTime(e,h+i*.6),c.gain.setValueAtTime(1e-4,h),c.gain.exponentialRampToValueAtTime(r,h+.005),c.gain.exponentialRampToValueAtTime(1e-4,h+i),l.connect(c).connect(s.actx.destination),l.start(h),l.stop(h+i+.01)}catch{}}};s.buzz=n=>{if(!s.S.mute&&navigator.vibrate)try{navigator.vibrate(n)}catch{}},s.sTile=n=>{s.tone(n?880:520,n?1320:340,.08,.12),s.buzz(6)},s.sDrop=()=>{s.tone(420,260,.12,.16),s.buzz(10)},s.sSnap=()=>{s.tone(1500,2400,.06,.14,"triangle"),s.buzz([8,30,8])},s.sBad=()=>{s.tone(150,110,.22,.18,"square"),s.buzz([40,40,40])},s.cv=s.$("#cv"),s.R=new Bv({canvas:s.cv,antialias:!0});s.R.setPixelRatio(Math.min(devicePixelRatio,2));s.scene=new Hv,s.camera=new Mn(40,1,.3,8e3);s.scene.add(new E_(16777215,2241348,1.7));s.sun=new C_(16777215,1.3);s.sun.position.set(30,60,20);s.scene.add(s.sun);s.ground=new Bt(new kn(Si,Si),new ve({color:858664}));s.ground.rotation.x=-Math.PI/2;s.ground.position.y=-.02;s.scene.add(s.ground);s.grid1=new Lc(Si,Si,2771560,1716296);s.grid1.position.y=.001;s.scene.add(s.grid1);s.grid10=new Lc(Si,Si/10,2771560,2771560);s.grid10.position.y=.012;s.grid10.visible=!1;s.scene.add(s.grid10);s.grid100=new Lc(Si,Si/100,2771560,2771560);s.grid100.position.y=.014;s.grid100.visible=!1;s.scene.add(s.grid100);s.floorG=new he;s.scene.add(s.floorG);s.floorTex=new Gv(new Uint8Array(16),2,2);s.floorTex.magFilter=s.floorTex.minFilter=Qe;s.floorTex.wrapS=s.floorTex.wrapT=bo;s.floorTex.repeat.set(.5,.5);s.floorTex.colorSpace=An;s.setFloorColors=function(t,e){const i=s.floorTex.image.data,r=new Yt(t),o=new Yt(e);[r,o,o,r].forEach((a,l)=>{i[l*4]=Math.round(a.r*255),i[l*4+1]=Math.round(a.g*255),i[l*4+2]=Math.round(a.b*255),i[l*4+3]=255}),s.floorTex.needsUpdate=!0};s.floorMat=new ve({color:16777215,map:s.floorTex});new kn(1,1).rotateX(-Math.PI/2);s.dotGeo=new cn(.5,.5,.2,20),s.dotMat=new Ce({color:s.HL}),s.dotStartMat=new Ce({color:s.AC}),s.cursorDot=new Bt(s.dotGeo,new Ce({color:s.HL,transparent:!0,opacity:.6}));s.cursorDot.visible=!1;s.scene.add(s.cursorDot);s.doorGhost=new Bt(new re(1,1,1).translate(0,.5,0),new Ce({color:8381439,transparent:!0,opacity:.55,depthWrite:!1}));s.doorGhost.visible=!1;s.doorGhost.renderOrder=4;s.scene.add(s.doorGhost);s.handlesG=new he;s.scene.add(s.handlesG);s.venueG=new he;s.scene.add(s.venueG);s.fillG=new he;s.scene.add(s.fillG);s.fillOpen=!1;s.fG={carpet:new re(1,1,1).translate(0,.5,0),cyl:new cn(.5,.5,1,20).translate(0,.5,0)};s.fG.chair=Fs([new re(1.4,.15,1.4).translate(0,1.5,0),new re(1.4,1.4,.12).translate(0,2.2,-.64)]);s.vcol=(n,t)=>{const e=new Yt(t),i=n.attributes.position.count,r=new Float32Array(i*3);for(let o=0;o<i;o++)r[o*3]=e.r,r[o*3+1]=e.g,r[o*3+2]=e.b;return n.setAttribute("color",new en(r,3)),n},s.nI=n=>n.index?n.toNonIndexed():n;s.fG.chairHi=Fs([s.vcol(s.nI(new re(1.4,.18,1.3).translate(0,1.5,.08)),4872294),s.vcol(s.nI(new re(1.36,1.25,.14).rotateX(-.08).translate(0,2.25,-.62)),4872294),s.vcol(s.nI(new re(1.42,.06,.06).translate(0,2.9,-.66)),13225686),...[[-.62,.55],[.62,.55],[-.62,-.62],[.62,-.62]].map(([n,t])=>s.vcol(s.nI(new re(.07,1.42,.07).translate(n,.71,t)),13225686)),...[-.62,.62].map(n=>s.vcol(s.nI(new re(.05,.05,1.15).translate(n,.35,-.03)),13225686))]);s.fG.roundHi=Fs([s.vcol(s.nI(new Xo([[0,1],[.5,1],[.505,.985],[.52,.02],[.52,0],[0,0]].map(([n,t])=>new ht(n,t)),32)),16184559),s.vcol(s.nI(new cn(.48,.48,.004,32).translate(0,1.002,0)),16777215)]);s.FILL_HI_MAX=3e3;s.fillHiLast=null;s.fM={chairV:new ve({vertexColors:!0}),roundV:new ve({vertexColors:!0}),stageSkirt:new ve({color:1382429}),carpet:new ve({color:16777215}),panel:new ve({color:14212579}),table:new ve({color:15921128}),chair:new ve({color:4872294}),stage:new ve({color:2830138})},s.BOOTH_COL={i:4026288,c:3120783,p:13208110,s:11554938},s.ZONE_COL={reg:2941126,fnb:16757575,stage:11832575,lounge:8377195,buffet:16757575,av:7317759};s.fillKey="";s.ghostG=new he;s.scene.add(s.ghostG);s.colBoxGeo=new re(1,1,1).translate(0,.5,0),s.colCylGeo=new cn(.5,.5,1,16).translate(0,.5,0),s.boxPadGeo=new kn(1,1).rotateX(-Math.PI/2),s.colMat=new ve({color:10134445}),s.boxPadMat=new Ce({color:16762941}),s.COL_H=9;s.venueKey="";s.wallsG=new he;s.scene.add(s.wallsG);s.doorsG=new he;s.scene.add(s.doorsG);s.dockMat=new Ce({color:15901498}),s.lintelMat=new Ce({color:9067036}),s.svcMat=new Ce({color:8359846}),s.doorEndMat=new Ce({color:16765503});s.doorDrag=null,s.ghostAt=null;s.doorMat=new Ce({color:15328472,transparent:!0,opacity:.85}),s.doorSelMat=new Ce({color:s.HL}),s.unitBox=new re(1,1,1),s.wallMat=new ve({color:14275786}),s.wallSelMat=new ve({color:s.HL}),s.fenceMat=new ve({color:16052198}),s.WALL_H=1.5,s.wallOkMat=new ve({color:2278750}),s.wallBadMat=new ve({color:15680580}),s.midMat=new Ce({color:s.AC}),s.midGeo=new re(.5,.2,1.5);s.fx=null;s.fxMat=new pd({size:.9,vertexColors:!0,transparent:!0,depthWrite:!1}),s.FX_COLORS=[nt.colors.action,nt.colors.accent,"#ffffff",nt.colors.highlight].map(n=>new Yt(n)),s.reducedMotion=()=>{try{return matchMedia("(prefers-reduced-motion: reduce)").matches}catch{return!1}};s.burst=function(t,e,i=110){if(s.endFx(),s.reducedMotion())return;const r=new Float32Array(i*3),o=new Float32Array(i*3),a=new Float32Array(i*3);for(let h=0;h<i;h++){const u=Math.random()*Math.PI*2,f=.3+Math.random()*.7,d=s.FX_COLORS[h%4];r.set([t,2,e],h*3),a.set([Math.cos(u)*f*13,10+Math.random()*10,Math.sin(u)*f*13],h*3),o.set([d.r,d.g,d.b],h*3)}const l=new Se;l.setAttribute("position",new en(r,3)),l.setAttribute("color",new en(o,3));const c=new Wv(l,s.fxMat);c.frustumCulled=!1,s.scene.add(c),s.fx={pts:c,vel:a,t:performance.now(),last:performance.now()},s.fxMat.opacity=1,s.frame()};s.stepFx=function(){const t=performance.now(),e=(t-s.fx.t)/1e3,i=Math.min(.05,(t-s.fx.last)/1e3);if(s.fx.last=t,e>1.5)return s.endFx();const r=s.fx.pts.geometry.attributes.position,o=s.fx.vel;for(let a=0;a<r.count;a++)o[a*3+1]-=26*i,r.array[a*3]+=o[a*3]*i,r.array[a*3+1]=Math.max(.05,r.array[a*3+1]+o[a*3+1]*i),r.array[a*3+2]+=o[a*3+2]*i;r.needsUpdate=!0,s.fxMat.opacity=Math.max(0,1-e/1.5)};s.endFx=function(){s.fx&&(s.scene.remove(s.fx.pts),s.fx.pts.geometry.dispose(),s.fx=null)};s.celebrate=n=>{if(!n||!n.closed)return;const t=In([n]);s.burst((t.minX+t.maxX)/2,(t.minZ+t.maxZ)/2),s.tone(660,990,.18,.08)},s.rubber=new Bt(s.unitBox,new Ce({color:s.HL,transparent:!0,opacity:.7}));s.rubber.visible=!1;s.scene.add(s.rubber);s.ghostWallMat=new Ce({color:s.AC,transparent:!0,opacity:.35,depthWrite:!1}),s.closeGhosts=[0,1].map(()=>{const n=new Bt(s.unitBox,s.ghostWallMat);return n.visible=!1,s.scene.add(n),n}),s.guideMat=new b_({color:s.AC,dashSize:.8,gapSize:.5}),s.guides=[0,1].map(()=>{const n=new Se;n.setAttribute("position",new ee(new Float32Array(6),3));const t=new Tc(n,s.guideMat);return t.visible=!1,t.frustumCulled=!1,s.scene.add(t),t}),s.itemsG=new he;s.scene.add(s.itemsG);s.selMark=new Bt(new kn(1,1).rotateX(-Math.PI/2),new Ce({color:2278750,transparent:!0,opacity:.45,depthWrite:!1}));s.selMark.visible=!1;s.selMark.renderOrder=2;s.scene.add(s.selMark);s.selRectGeo=s.selMark.geometry,s.selCircGeo=new qo(.5,40).rotateX(-Math.PI/2),s.hlItem=new Bt(new kn(1,1).rotateX(-Math.PI/2),new Ce({color:s.AC,transparent:!0,opacity:.35,depthWrite:!1}));s.hlItem.visible=!1;s.scene.add(s.hlItem);s.hlSeg=new Bt(new re(1,1,.12),new Ce({color:s.AC,transparent:!0,opacity:.55,depthWrite:!1}));s.hlSeg.visible=!1;s.scene.add(s.hlSeg);s.ENV_COL={indoor:{a:9081763,b:8160662,bg:ie(nt.colors.bg),gr:858664},outdoor:{a:6265418,b:5672003,bg:1058874,gr:1320474}};s.applyEnv=function(){const t=s.ENV_COL[s.S.env];s.scene.background=new Yt(t.bg),s.ground.material.color.set(t.gr),s.rebuild()};new pe;new Yt;const lo={minDist:6,maxDist:2400,minPitch:.35,maxPitch:1.45},pS={yaw:Math.PI/4,pitch:.95,dist:46,tx:0,tz:0},mS=8,Nu=12,Nn=n=>typeof n=="number"&&Number.isFinite(n),Uu=(n,t,e)=>Math.max(t,Math.min(e,n));function Rf(n){return Nn(n)?(n=n%(2*Math.PI),n>Math.PI&&(n-=2*Math.PI),n<-Math.PI&&(n+=2*Math.PI),n):0}function ii(n,t=pS){for(const e of["yaw","pitch","dist","tx","tz"])Nn(n[e])||(n[e]=t[e]);return n.dist=Uu(n.dist,lo.minDist,lo.maxDist),n.pitch=Uu(n.pitch,lo.minPitch,lo.maxPitch),n.yaw=Rf(n.yaw),n}const gS=(n,t)=>({d:Math.hypot(n.x-t.x,n.y-t.y),ang:Math.atan2(t.y-n.y,t.x-n.x),mx:(n.x+t.x)/2,my:(n.y+t.y)/2}),xS=(n,t)=>{if(!n||!t)return[0,0];const e=t.mx-n.mx,i=t.my-n.my;return[Nn(e)?e:0,Nn(i)?i:0]},vS=1.5695;function _S(n,t,e){if(!t||!e)return ii(n);Nn(t.d)&&Nn(e.d)&&t.d>=Nu&&e.d>=Nu&&(n.dist*=t.d/e.d);const i=Rf(e.ang-t.ang);return Nn(i)&&(n.yaw-=i),ii(n)}function MS(n,t,e){return Nn(t)&&(n.yaw-=t*.008),Nn(e)&&(n.pitch+=e*.006),ii(n)}function yS(n,t){return Nn(t)&&t>0&&(n.dist*=t),ii(n)}const SS=(n,t,e,i)=>Math.hypot(e-n,i-t)>=mS,wS=(n,t)=>!(n.booth||n.wallHost)||!!t;s.dirty=!1;s.rebuildSoon=()=>{s.dirty=!0,s.frame()};s.rebuild=function(){s.rebuildNow(),s.frame()};s.placeBar=(n,t,e,i,r,o,a)=>{const l=Math.hypot(i-t,r-e);n.scale.set(l+a,o,a),n.position.set((t+i)/2,o/2,(e+r)/2),n.rotation.y=Math.atan2(-(r-e),i-t)};s.rebuildNow=function(){const t=s.ENV_COL[s.S.env];s.setFloorColors(t.a,t.b),s.drawVenue(),s.drawGhost(),s.lvlUI(),s.drawFill();for(const i of[...s.floorG.children])s.floorG.remove(i),i.geometry.dispose();const e=zs(s.S.walls);for(const i of e.polys){const r=new ar(i.map(([l,c])=>new ht(l,-c))),o=new Lo(r).rotateX(-Math.PI/2),a=new Bt(o,s.floorMat);a.position.y=-.006,s.floorG.add(a)}for(const i of e.rects){const r=new ar([new ht(i.x0,-i.z0),new ht(i.x1,-i.z0),new ht(i.x1,-i.z1),new ht(i.x0,-i.z1)]),o=new Bt(new Lo(r).rotateX(-Math.PI/2),s.floorMat);o.position.y=-.008,s.floorG.add(o)}s.doorsG.clear();for(const i of vr(s.S.walls)){const r=s.selDoor&&s.selDoor.pi===i.pi&&s.selDoor.k===i.k,o=new Bt(s.unitBox,r?s.doorSelMat:i.dock?s.dockMat:i.svc?s.svcMat:s.doorMat),a=i.w/2-(i.dock?0:.04);if(s.placeBar(o,i.x-i.ux*a,i.z-i.uz*a,i.x+i.ux*a,i.z+i.uz*a,i.dock?.05:.02,nn+(i.dock?.6:.25)),o.name=i.dock?"dockDoor":i.svc?"svcDoor":"door",s.doorsG.add(o),i.dock){const l=new Bt(s.unitBox,s.lintelMat);s.placeBar(l,i.x-i.ux*a,i.z-i.uz*a,i.x+i.ux*a,i.z+i.uz*a,.6,nn+.1),l.position.y=s.wallHt()-.6,l.name="dockLintel",s.doorsG.add(l)}if(r&&s.phase==="build"&&s.tool==="door")for(const l of[-1,1]){const c=new Bt(s.dotGeo,s.doorEndMat);c.scale.set(1.5,3,1.5),c.position.set(i.x+i.ux*l*i.w/2,.3,i.z+i.uz*l*i.w/2),c.name="doorEnd",c.userData.doorEnd={pi:i.pi,k:i.k,end:l},s.doorsG.add(c)}}s.doorGhost.visible=!1,s.wallsG.clear();for(const i of Fc(s.S.walls)){const r=s.selSeg&&s.selSeg.pi===i.pi&&s.selSeg.i===i.i,o=new Bt(s.unitBox,s.editPi===i.pi?s.editGood?s.wallOkMat:s.wallBadMat:r?s.wallSelMat:s.S.env==="outdoor"?s.fenceMat:s.wallMat);s.placeBar(o,i.a[0],i.a[1],i.b[0],i.b[1],s.wallHt(),s.S.env==="outdoor"?.18:nn),o.userData.seg={pi:i.pi,i:i.i},s.wallsG.add(o)}s.handlesG.clear(),s.phase==="build"&&s.tool!=="view"&&s.S.walls.forEach((i,r)=>i.pts.forEach(([o,a],l)=>{const c=new Bt(s.dotGeo,r===s.active&&l===0&&!i.closed?s.dotStartMat:s.dotMat);c.position.set(o,s.wallHt()+.15,a),c.userData.corner={pi:r,j:l},s.handlesG.add(c)})),s.phase==="build"&&s.tool!=="view"&&s.S.walls.forEach((i,r)=>{if(r===s.active)return;const o=i.closed?i.pts.length:i.pts.length-1;for(let a=0;a<o;a++){const l=i.pts[a],c=i.pts[(a+1)%i.pts.length];if(Math.hypot(c[0]-l[0],c[1]-l[1])<2)continue;const h=new Bt(s.midGeo,s.midMat);h.position.set((l[0]+c[0])/2,s.wallHt()+.15,(l[1]+c[1])/2),h.rotation.y=Math.atan2(c[0]-l[0],c[1]-l[1]),h.userData.mid={pi:r,i:a},s.handlesG.add(h)}}),s.$("#sizeLbl").textContent=Dc(s.S.walls),s.syncItems(),s.buildUI()};s.meshes=new Map,s.anim=new Map,s.fpGeoRect=new kn(1,1).rotateX(-Math.PI/2),s.fpGeoCirc=new qo(.5,40).rotateX(-Math.PI/2),s.lineGeo=n=>new Se().setFromPoints(n.map(([t,e])=>new D(t,0,e))),s.fpLineRect=s.lineGeo([[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]]),s.fpLineCirc=s.lineGeo([...Array(48)].map((n,t)=>[.5*Math.cos(t*Math.PI/24),.5*Math.sin(t*Math.PI/24)])),s.fpFill=new Ce({color:s.AC,transparent:!0,opacity:.25,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2}),s.fpEdge=new Os({color:s.AC,transparent:!0,opacity:.7}),s.FP_SHARED={fpGeoRect:s.fpGeoRect,fpGeoCirc:s.fpGeoCirc,fpLineRect:s.fpLineRect,fpLineCirc:s.fpLineCirc,fpFill:s.fpFill,fpEdge:s.fpEdge};s.makeFp=function(t,e){if(e.mode==="wall")return;const i=Jt(e),{w:r,d:o}=Xi(e),a=!!i.round,l=new he;l.userData.fp=1,l.userData.noHit=1;const c=new Bt(a?s.fpGeoCirc:s.fpGeoRect,s.fpFill),h=new Vv(a?s.fpLineCirc:s.fpLineRect,s.fpEdge);for(const u of[c,h])u.userData.sharedGeo=1,u.userData.noHit=1,u.userData.uid=e.uid,u.renderOrder=1,u.raycast=()=>{},l.add(u);return l.scale.set(r,1,o),s.fpG.add(l),l};s.fpG=new he;s.scene.add(s.fpG);s.wallGhostMat=new ve({color:14275786,transparent:!0,opacity:.28,depthWrite:!1});s.syncItems=function(){const t=new Set(s.S.items.map(e=>e.uid));for(const[e,i]of s.meshes)t.has(e)||(s.itemsG.remove(i.g),Ql(i.g),i.fp&&s.fpG.remove(i.fp),s.meshes.delete(e));for(const e of s.anim.keys())t.has(e)||s.anim.delete(e);for(const e of s.S.items){const i=Jt(e),r=e.type==="ledposter"?Ky(s.S.items,e):e.type==="stage"?Y2(s.S.items,e):null,o=(e.mode==="wall"?"wall":"floor")+(r?(r.joinL?"L":"")+(r.joinR?"R":"")+(r.joinF?"F":"")+(r.joinB?"B":""):"");let a=s.meshes.get(e.uid);if(!a||a.k!==o){a&&(s.itemsG.remove(a.g),Ql(a.g),a.fp&&s.fpG.remove(a.fp));const h=P_(i,e.mode,r||{});if(h.traverse(u=>u.userData.uid=e.uid),e.mode==="wall"&&!e.host){const u=i.panel+.6,f=new Bt(new re(i.w+1,e.y+u,.06),s.wallGhostMat);f.position.set(0,(u-e.y)/2,-i.wallD/2-.05),f.userData.uid=e.uid,f.userData.ghost=1,h.add(f)}a={g:h,k:o,fp:s.makeFp(h,e)},s.meshes.set(e.uid,a),s.itemsG.add(h)}a.fp&&(a.fp.visible=e.uid!==s.selUid,a.fp.position.set(e.x,(e.mode==="top"?e.y:0)+.025,e.z),a.fp.rotation.y=e.a);const l=s.anim.get(e.uid);let c=0;if(l){const h=(performance.now()-l)/380;h>=1?s.anim.delete(e.uid):c=Math.abs(Math.sin(h*Math.PI*2))*(1-h)*.6}a.g.position.set(e.x,e.y+c,e.z),a.g.rotation.y=e.a}s.selUI()};s.selUI=function(){const t=s.selItem();if(!t){s.selMark.visible=!1;return}const{w:e,d:i}=Xi(t),r=zn(s.W,t);s.selMark.visible=t.mode!=="wall"||!r,s.selMark.scale.set(e+.1,1,i+.1),s.selMark.rotation.y=t.a,s.selMark.position.set(t.x,(t.mode==="top"?t.y:(t.mode,0))+.03,t.z),s.selMark.geometry=Jt(t).round?s.selCircGeo:s.selRectGeo,s.selMark.material.color.set(s.drag?r?2278750:15680580:r?s.HL:15680580),s.selMark.material.opacity=s.drag?.45:.4,s.selMark.userData.state=s.drag?r?"ok":"bad":r?"sel":"bad",s.$("#selInfo").textContent=`${Mf(Jt(t))}${r?"":" · Not a valid spot"}`};s.showHl=function(t){if(s.hlItem.visible=s.hlSeg.visible=!1,!(!t||!t.hl)){if(t.hl.item){const e=s.S.items.find(r=>r.uid===t.hl.item);if(!e)return;const i=Jt(e);s.hlItem.visible=!0,s.hlItem.scale.set(i.w+.3,1,i.d+.3),s.hlItem.rotation.y=e.a,s.hlItem.position.set(e.x,(i.top||0)+.02,e.z)}if(t.hl.seg){const e=t.hl.seg,i=Math.hypot(e.x2-e.x1,e.z2-e.z1);s.hlSeg.visible=!0;const r=t.mode==="wall"?8:2;s.hlSeg.scale.set(i,r,1),s.hlSeg.position.set((e.x1+e.x2)/2+e.nx*.05,r/2,(e.z1+e.z2)/2+e.nz*.05),s.hlSeg.rotation.y=Math.atan2(e.nx,e.nz)}}};s.V={yaw:Math.PI/4,pitch:.95,dist:46,tx:0,tz:0};s.resetView=function(){const t=In(s.S.walls)||Zo(zs(s.S.walls));Object.assign(s.V,{yaw:Math.PI/4,pitch:.95}),s.V.tx=(t.minX+t.maxX)/2,s.V.tz=(t.minZ+t.maxZ)/2,s.V.dist=Math.max(24,Math.max(t.w,t.l)*1.9),ii(s.V)};s.placeCam=function(){ii(s.V);const t=s.topDown?vS:s.V.pitch,e=Math.cos(t);s.camera.position.set(s.V.tx+s.V.dist*e*Math.sin(s.V.yaw),s.V.dist*Math.sin(t),s.V.tz+s.V.dist*e*Math.cos(s.V.yaw)),s.camera.lookAt(s.V.tx,0,s.V.tz),s.camera.updateMatrixWorld()};s.resize=function(){const t=Math.round(innerWidth),e=Math.round(innerHeight);t>0&&e>0&&(s.R.setPixelRatio(Math.min(devicePixelRatio||1,2)),s.R.setSize(t,e,!1),s.camera.aspect=t/e,s.camera.updateProjectionMatrix())};s.crashed=!1,s.ctxLost=!1;s.crash=function(t,e){t&&s.noteErr(t),s.DBG.crashes++,s.crashed=!0,s.saveNow(),s.$("#crash").classList.remove("hidden"),s.$("#crash b").textContent=e||"Something went wrong",s.$("#crash p").textContent=e?"Your layout is saved.":"Your layout is saved. Tap to reload the view.",s.$("#btnRecover").classList.toggle("hidden",!!e)};s.recover=function(){try{s.crashed=!1,s.$("#crash").classList.add("hidden"),s.ptrs.clear(),s.tapInfo=s.twoPrev=s.orbitPtr=s.drag=s.down=null,s.anim.clear(),s.endFx();for(const[,t]of s.meshes)s.itemsG.remove(t.g),Ql(t.g);s.fpG.clear(),s.meshes.clear(),ii(s.V),s.resize(),s.applyEnv(),s.select(s.selItem()),s.frame()}catch(t){s.noteErr(t),s.saveNow(),location.reload()}};s.$("#btnRecover").onclick=s.recover;s.cv.addEventListener("webglcontextlost",n=>{n.preventDefault(),s.DBG.lost++,s.ctxLost=!0,s.noteErr("WebGL context lost"),s.crash(null,"Restoring the 3D view…")});s.cv.addEventListener("webglcontextrestored",()=>{s.DBG.restored++,s.ctxLost=!1,s.recover()});s.raf=0;s.frame=function(){s.raf||s.crashed||s.ctxLost||(s.raf=requestAnimationFrame(()=>{s.raf=0;try{s.dirty&&(s.dirty=!1,s.rebuildNow()),s.anim.size&&(s.syncItems(),s.frame()),s.fx&&(s.stepFx(),s.fx&&s.frame()),s.sim&&!s.sim.paused&&(s.simTick(),s.frame()),ii(s.V),s.placeCam(),s.overlays(),s.R.render(s.scene,s.camera)}catch(t){s.crash(t)}}))};s.lbls=[],s.lblV=new D;s.label=function(t,e,i,r,o){let a=s.lbls[t];if(a||(a=document.createElement("div"),s.$("#labels").appendChild(a),s.lbls[t]=a),s.lblV.set(e,s.wallHt()+.5,i).project(s.camera),s.lblV.z>1){a.style.display="none";return}a.style.display="",a.className="lbl "+(o||""),a.textContent=r,a.style.transform=`translate(${(s.lblV.x+1)/2*innerWidth}px, ${(1-s.lblV.y)/2*innerHeight}px) translate(-50%,${o==="seg"?"-150%":"-50%"})`};s.overlays=function(){const t=s.V.dist>=160,e=s.V.dist>=600;s.grid1.visible=!t,s.grid10.visible=t&&!e,s.grid100.visible=e;const i=Math.max(.5,s.V.dist*.017);s.handlesG.children.forEach(a=>a.scale.set(i,1,i)),s.cursorDot.scale.set(i,1,i);let r=0;const o=_i(s.V.dist);if(s.$("#snapHint").textContent=s.phase==="build"?`Snap: ${o} ft`:`Move snap: ${Rd(s.V.dist)} ft`,s.phase==="build"){const a=ur(s.S.walls);if(a.length<=60)for(const d of a)s.corner&&d.pi===s.corner.pi||s.push&&d.pi===s.push.pi||s.label(r++,(d.a[0]+d.b[0])/2,(d.a[1]+d.b[1])/2,_o(Math.hypot(d.b[0]-d.a[0],d.b[1]-d.a[1])),s.tool!=="view"?"seg":"");const l=s.tool==="walls"&&s.active!=null&&Nc(s.S.walls[s.active]);s.closeGhosts.forEach((d,p)=>{const x=l&&l.ghost[p],v=l&&l.ghost[p+1];d.visible=!!(x&&v),d.visible&&s.placeBar(d,x[0],x[1],v[0],v[1],s.wallHt(),nn)});const c=s.rub&&s.rub.guides||[];s.guides.forEach((d,p)=>{const x=c[p];if(d.visible=!!x,x){const v=d.geometry.attributes.position;v.setXYZ(0,x[0][0],s.wallHt()+.2,x[0][1]),v.setXYZ(1,x[1][0],s.wallHt()+.2,x[1][1]),v.needsUpdate=!0,d.computeLineDistances()}}),s.cursorDot.material.color.set(s.rub&&(s.rub.aligned||s.rub.close)?s.AC:s.HL);const h=s.corner?s.corner.pi:s.push?s.push.pi:s.pendEdit?s.editPi:null,u=h!=null&&s.S.walls[h];if(u&&u.closed&&!s.boxA){const d=In([u]),p=Math.round(Ed(u.pts));s.label(r++,(d.minX+d.maxX)/2,(d.minZ+d.maxZ)/2,(ec(u)?`${d.w} x ${d.l} ft · `:"")+`${p} sq ft`,s.editGood?"live":"live bad")}if(u&&(s.corner||s.push))for(const d of ur([u]))s.label(r++,(d.a[0]+d.b[0])/2,(d.a[1]+d.b[1])/2,_o(Math.hypot(d.b[0]-d.a[0],d.b[1]-d.a[1])),s.editGood?"live":"live bad");if(s.boxA&&s.S.walls[s.boxIdx]&&s.S.walls[s.boxIdx].closed){const d=In([s.S.walls[s.boxIdx]]);s.label(r++,(d.minX+d.maxX)/2,(d.minZ+d.maxZ)/2,`${d.w} x ${d.l} ft · ${Math.round(d.w*d.l)} sq ft`,s.editGood?"live":"live bad")}const f=s.active!=null&&s.S.walls[s.active];if(f&&s.rub&&f.pts.length){const[d,p]=f.pts[f.pts.length-1];s.rubber.visible=!0,s.placeBar(s.rubber,d,p,s.rub.x,s.rub.z,s.wallHt(),nn),s.label(r++,(d+s.rub.x)/2,(p+s.rub.z)/2,_o(Math.hypot(s.rub.x-d,s.rub.z-p))+(s.rub.close?" · close room":""),"live")}else s.rubber.visible=!1}else s.rubber.visible=!1,s.closeGhosts.forEach(a=>a.visible=!1),s.guides.forEach(a=>a.visible=!1);for(let a=r;a<s.lbls.length;a++)s.lbls[a].style.display="none"};addEventListener("resize",()=>{s.resize(),s.frame()});addEventListener("orientationchange",()=>setTimeout(()=>{s.resize(),s.frame()},300));window.visualViewport&&visualViewport.addEventListener("resize",()=>{s.resize(),s.frame()});s.selUid=null;s.selItem=()=>s.S.items.find(n=>n.uid===s.selUid)||null;s.select=function(t){s.selUid=t?t.uid:null,t&&s.$("#presetTip")&&s.$("#presetTip").classList.add("hidden"),s.$("#selBar").classList.toggle("hidden",!t),t&&(s.$("#selName").textContent=Jt(t).name),s.$("#btnSplit").classList.toggle("hidden",!(t&&t.type==="ledposter"&&(t.links||[]).length)),t&&t.type==="ledposter"&&ko(s.S.items,t).length>1&&(s.$("#selName").textContent=`LED poster wall (${ko(s.S.items,t).length} wide)`),s.showHl(null),s.syncItems(),s.frame()};s.dropped=function(t,e){zn(s.W,t)?(s.anim.set(t.uid,performance.now()),t.host||["wall","wallfloor"].includes(t.mode)?s.sSnap():s.sDrop()):(s.sBad(),e&&(mn(s.W,t,e),s.toast("That spot does not fit"))),s.showHl(null),s.save(),s.syncItems(),s.frame()};s.poseOf=n=>({x:n.x,z:n.z,a:n.a,y:n.y,host:n.host,mode:n.mode});s.$("#btnRot").onclick=()=>{const n=s.selItem();if(!n)return;(n.type==="ledposter"||n.type==="stage")&&Xc(s.S.items,n);const t=s.poseOf(n),e=n.a+Math.PI/2,i={...n,a:e};let r=Bs(s.W,i,n.x,n.z);["edge","wall","wallfloor","backwall"].includes(r.mode)&&(r={...ks(i,n.x,n.z,e)}),mn(s.W,n,r),s.dropped(n,zn(s.W,n)?null:t)};s.$("#btnCopy").onclick=()=>{const n=s.selItem();if(!n)return;const t=Is(n.type,n.x,n.z,n.a);s.S.items.push(t);const e=qc(s.W,t,n.x+Jt(n).w+.5,n.z)||ks(t,n.x+1,n.z+1);mn(s.W,t,e),s.select(t),s.dropped(t,null)};s.$("#btnDel").onclick=()=>{const n=s.selItem();if(!n)return;const t=Qy(s.W,n);s.select(null),s.toast(t>1?`Removed ${t} items`:"Removed"),s.save(),s.syncItems(),s.frame()};s.$("#btnDone").onclick=()=>s.select(null);s.moveGroup=function(t){if(!(!s.drag||!s.drag.grp))for(const e of s.drag.grp){const[i,r]=On(t.x,t.z,t.a,e.l[0],e.l[1]);e.o.x=i,e.o.z=r,e.o.a=t.a+e.da,e.o.y=0}};s.separatePoster=function(t=s.selItem()){return!t||t.type!=="ledposter"||!(t.links||[]).length?!1:(Xc(s.S.items,t),s.toast("Separated from the poster wall · drag it away"),s.save(),s.select(t),!0)};s.$("#btnSplit").onclick=()=>s.separatePoster();s.openSheet=function(){s.$("#sheet").classList.remove("hidden","presetsheet"),s.showCats()};s.closeSheet=function(){s.$("#sheet").classList.add("hidden"),s.$("#sheet").classList.remove("presetsheet")};s.showCats=function(){s.$("#shBack").classList.add("hidden"),s.$("#shTitle").textContent="Add to your space",s.$("#shBody").innerHTML='<div class="evrow"><b>Event presets</b>'+s.techRowHTML()+"<div>"+jc.map(t=>`<button class="evchip" data-ev="${t.id}">${s.EV_ICONS[t.id]}<span>${t.name}</span></button>`).join("")+'</div></div><div class="catgrid">'+_f.map(t=>`<button class="cat" data-cat="${t.id}">${U_[t.id]}<span>${t.name}</span></button>`).join("")+"</div>",s.$$(".cat").forEach(t=>t.onclick=()=>s.showProducts(t.dataset.cat)),s.bindTechRow(),s.$$(".evchip").forEach(t=>t.onclick=()=>s.useEventPreset(t.dataset.ev))};s.showProducts=function(t){s.$("#shBack").classList.remove("hidden"),s.$("#shTitle").textContent=_f.find(e=>e.id===t).name,s.$("#shBody").innerHTML=Wc.filter(e=>e.cat===t).map(e=>`<button class="prod" data-id="${e.id}"><i class="picon">${N_(e)}</i><div><b>${e.name}</b><span>${Mf(e)}</span>${e.note?`<small class="pnote">${e.note}</small>`:""}</div><span class="plus">+</span></button>`).join(""),s.$$(".prod").forEach(e=>e.onclick=()=>s.addItem(e.dataset.id))};s.$("#btnAdd").onclick=s.openSheet;s.$("#shClose").onclick=s.closeSheet;s.$("#shBack").onclick=s.showCats;s.viewCenter=function(){return s.placeCam(),s.ray.setFromCamera(new ht(0,.1),s.camera),s.ray.ray.intersectPlane(s.groundPlane,s.hitP)?[s.hitP.x,s.hitP.z]:[s.V.tx,s.V.tz]};s.addItem=function(t){const[e,i]=s.viewCenter(),r=Is(t,e,i);s.S.items.push(r);const o=qc(s.W,r,e,i,30);mn(s.W,r,o||ks(r,e,i)),s.closeSheet(),s.setMode("move"),s.select(r),s.dropped(r,null),o||s.toast("No free spot found. Drag it to a clear area."),s.$("#keepPlacing").checked&&(s.startStamp(r),s.toast(`Keep placing: tap the floor to add more ${Jt(r).name}`))};s.ray=new R_,s.ndc=new ht,s.groundPlane=new jn(new D(0,1,0),0),s.hitP=new D;s.setRay=function(t,e){const i=s.cv.getBoundingClientRect();s.ndc.set((t-i.left)/i.width*2-1,-((e-i.top)/i.height)*2+1),s.placeCam(),s.ray.setFromCamera(s.ndc,s.camera)};s.groundAt=function(t,e){return s.setRay(t,e),s.ray.ray.intersectPlane(s.groundPlane,s.hitP)?[s.hitP.x,s.hitP.z]:null};s.itemAt=function(t,e){s.setRay(t,e);const i=s.ray.intersectObjects(s.itemsG.children,!0).filter(l=>!l.object.userData.ghost&&!l.object.userData.noHit);if(!i.length)return null;const r=[...new Set(i.filter(l=>!l.object.userData.noHit).map(l=>l.object.userData.uid))].map(l=>s.S.items.find(c=>c.uid===l)).filter(Boolean),o=r.filter(l=>!Jt(l).booth);if(!o.length)return r[0]||null;const a=o[0];return o.filter(l=>qi(s.S.items,a).includes(l))[0]||a};s.ptrs=new Map;s.editBefore=null,s.panPtr=null,s.tapInfo=null,s.twoPrev=null,s.orbitPtr=null,s.drag=null,s.down=null,s.needSave=!1,s.corner=null,s.draw=null;s.panBy=function(t,e){const i=s.V.dist*.728/Math.max(1,innerHeight),r=Math.cos(s.V.yaw),o=-Math.sin(s.V.yaw),a=-Math.sin(s.V.yaw),l=-Math.cos(s.V.yaw);s.V.tx+=(-r*t+a*e)*i,s.V.tz+=(-o*t+l*e)*i,ii(s.V)};s.itemMode=()=>s.phase==="place"||s.tool==="view",s.drawAt=(n,t)=>{const e=s.groundAt(n,t);return e?q_(s.S.walls,s.active,e[0],e[1],_i(s.V.dist),s.lock):null};s.handleAt=function(t,e){s.setRay(t,e);const i=s.ray.intersectObjects(s.handlesG.children,!1)[0];if(i)return i.object.userData.corner?{corner:i.object.userData.corner}:{mid:i.object.userData.mid};const r=s.cv.getBoundingClientRect(),o=(h,u,f)=>(s.lblV.set(h,u,f).project(s.camera),Math.hypot(r.left+(s.lblV.x+1)/2*r.width-t,r.top+(1-s.lblV.y)/2*r.height-e));let a=null,l=40;for(const h of s.handlesG.children){let u=Math.min(o(h.position.x,h.position.y,h.position.z),o(h.position.x,0,h.position.z));h.userData.mid&&(u+=6),u<l&&(l=u,a=h.userData)}if(a)return a.corner?{corner:a.corner}:{mid:a.mid};const c=s.ray.intersectObjects(s.wallsG.children,!1)[0];return c?{seg:c.object.userData.seg}:{}};s.addPt=function(t){if(!t||t.idle&&s.active!=null)return;if(s.lock.axis=null,t.close&&s.active!=null){const i=s.active;return s.active=Pd(s.S.walls,s.active),s.celebrate(s.S.walls[i]&&s.S.walls[i].closed?s.S.walls[i]:s.S.walls[s.S.walls.length-1]),s.rub=null,s.sSnap(),s.toast("Room closed"),s.wallsChanged(),s.setTool("view")}const e=s.active;s.active=k_(s.S.walls,s.active,t),t.close?(s.sSnap(),s.toast("Room closed")):s.sTile(!0),e==null&&s.active!=null&&s.S.walls[s.active].pts.length,s.rub=null,s.wallsChanged()};s.tapBuild=function(t,e,i){if(s.tool==="door")return s.tapDoor(t,e);if(i.corner){const{pi:a,j:l}=i.corner,c=s.S.walls[a];if(a===s.active&&l===0&&c.pts.length>=3)return s.addPt({x:c.pts[0][0],z:c.pts[0][1],close:!0});if(s.active==null&&!c.closed&&(l===0||l===c.pts.length-1))return l===0&&tM(c),s.active=a,s.selSeg=null,s.toast("Continue drawing from here"),s.sTile(!0),s.rebuildSoon()}if(i.mid){s.toast("Drag the arrow to push or pull this wall");return}if(i.seg&&s.active==null)return s.selSeg=s.selSeg&&s.selSeg.pi===i.seg.pi&&s.selSeg.i===i.seg.i?null:i.seg,s.buildUI(),s.rebuildSoon();if(s.selSeg=null,s.tool==="door")return s.tapDoor(t,e);if(s.tool==="box"){s.toast("Drag from one corner to the opposite corner");return}const r=s.active!=null&&Nc(s.S.walls[s.active]),o=s.groundAt(t,e);if(r&&o&&s.nearGhost(r.ghost,o,Math.max(2,_i(s.V.dist)))){s.$("#btnCloseWalls").click();return}s.addPt(s.drawAt(t,e))};s.wallPlane=new jn(new D(0,1,0),0),s.wallHitP=new D;s.wallPointAt=function(t,e){s.setRay(t,e);const i=s.ray.intersectObjects(s.wallsG.children,!1)[0];if(i)return[i.point.x,i.point.z];s.wallPlane.constant=-Math.max(.5,s.wallHt()/2);const r=s.ray.ray.intersectPlane(s.wallPlane,s.wallHitP)?[s.wallHitP.x,s.wallHitP.z]:null,o=s.groundAt(t,e);return r&&(!o||(No(s.S.walls,r[0],r[1])||{dist:1e9}).dist<=(No(s.S.walls,o[0],o[1])||{dist:1e9}).dist)?r:o};s.tapDoor=function(t,e){const i=s.wallPointAt(t,e);if(!i)return;const r=Z_(s.S.walls,i[0],i[1],1.2);if(r)return s.selDoor=s.selDoor&&s.selDoor.pi===r.pi&&s.selDoor.k===r.k?null:{pi:r.pi,k:r.k},s.selSeg=null,s.buildUI(),s.sTile(!0),s.rebuildSoon();s.selDoor=null;const o=No(s.S.walls,i[0],i[1]);if(!o||o.dist>Math.max(1.5,_i(s.V.dist)*.5))return s.buildUI(),s.rebuildSoon(),s.toast(s.S.walls.length?"Tap on a wall to add a door":"Draw walls first, then add doors");const a=Oc(s.S.walls,o.pi,o.i,o.t,.5);if(a.error)return s.sBad(),s.toast(a.error);const l=s.S.walls[o.pi],c=Ld(l,o.i).some(([h,u])=>u-h>Fe+.01&&a.door.t>=h&&a.door.t<=u);s.sSnap(),s.toast(c?"Double door (6 ft)":"Door added (3 ft) · tap it, then drag its ends to resize"),s.wallsChanged()};s.doorSpot=function(t,e){const i=s.wallPointAt(t,e);if(!i)return null;const r=No(s.S.walls,i[0],i[1]);if(!r||r.dist>Math.max(1.5,_i(s.V.dist)*.5))return{g:i,n:null};const o=s.S.walls[r.pi],a=o.pts[r.i],l=o.pts[(r.i+1)%o.pts.length],c=Math.hypot(l[0]-a[0],l[1]-a[1]),h=(l[0]-a[0])/c,u=(l[1]-a[1])/c,f=nn/2+Fe/2,d=Math.min(c-f,Math.max(f,Math.round(r.t*2)/2));return{g:i,n:r,x:a[0]+h*d,z:a[1]+u*d,ux:h,uz:u,t:d,wx:a[0]+h*r.t,wz:a[1]+u*r.t}};s.hoverDoor=function(t,e){const i=s.doorSpot(t,e);if(s.cursorDot.visible=!1,!i||!i.n){s.doorGhost.visible=!1,s.ghostAt=i?{...i,on:!1}:null,s.frame();return}s.doorGhost.position.set(i.x,0,i.z),s.doorGhost.rotation.y=Math.atan2(i.ux,i.uz)+Math.PI/2,s.doorGhost.scale.set(Fe,Math.max(.3,s.wallHt()*.9),nn+.35),s.doorGhost.visible=!0,s.ghostAt={...i,on:!0,cx:t,cy:e},s.frame()};s.doorEndAt=function(t,e){if(!s.selDoor||s.tool!=="door")return null;const i=s.cv.getBoundingClientRect(),r=new D;let o=null,a=30;for(const l of s.doorsG.children){if(!l.userData.doorEnd)continue;r.copy(l.position).project(s.camera);const c=Math.hypot(i.left+(r.x+1)/2*i.width-t,i.top+(1-r.y)/2*i.height-e);c<a&&(a=c,o=l.userData.doorEnd)}return o};s.nearGhost=function(t,e,i){for(let r=0;r<t.length-1;r++){const[o,a]=t[r],[l,c]=t[r+1],h=(l-o)**2+(c-a)**2;let u=h?((e[0]-o)*(l-o)+(e[1]-a)*(c-a))/h:0;if(u=Math.max(0,Math.min(1,u)),Math.hypot(e[0]-o-u*(l-o),e[1]-a-u*(c-a))<=i)return!0}return!1};s.twoNow=()=>{const[n,t]=[...s.ptrs.values()];return gS(n,t)},s.endDrag=n=>{if(!s.drag)return;const t=s.selItem();if(t&&s.drag.grp&&s.drag.grp.length){const e=()=>{mn(s.W,t,s.drag.start);for(const i of s.drag.grp)mn(s.W,i.o,i.start)};n?e():s.drag.moved&&([t,...s.drag.grp.map(i=>i.o)].every(i=>zn(s.W,i))?(s.drag.join&&(fc(t,s.S.items.find(i=>i.uid===s.drag.join)),t.type==="stage"&&Cu(s.S.items,t)),s.anim.set(t.uid,performance.now()),s.sDrop(),s.save()):(s.sBad(),e(),s.toast("That spot does not fit")))}else t&&(n?mn(s.W,t,s.drag.start):s.drag.moved&&(s.drag.join&&zn(s.W,t)&&(fc(t,s.S.items.find(e=>e.uid===s.drag.join)),t.type==="stage"&&Cu(s.S.items,t)),s.dropped(t,s.drag.start)));s.drag=null,s.showHl(null),s.syncItems(),s.frame()},s.guard=n=>t=>{try{n(t)}catch(e){s.crash(e)}};s.cv.addEventListener("contextmenu",n=>n.preventDefault());s.cv.addEventListener("pointerdown",s.guard(n=>{if(!(s.walkOn&&s.phase!=="build")){try{s.cv.setPointerCapture(n.pointerId)}catch{}if(s.ptrs.set(n.pointerId,{x:n.clientX,y:n.clientY}),s.$("#hint").style.opacity=0,n.pointerType==="mouse"&&n.button===2){s.panPtr={x:n.clientX,y:n.clientY};return}if(n.pointerType==="mouse"&&n.button===1){s.orbitPtr={x:n.clientX,y:n.clientY};return}if(s.ptrs.size>=2){s.tapInfo=null,s.down=null,(s.corner||s.push)&&(s.editBefore&&(s.putBack(s.editBefore),s.editBefore=null),s.corner=s.push=null,s.editPi=null,s.editGood=!0,s.rebuildSoon()),s.boxA&&(s.S.walls.splice(s.boxIdx,1),s.boxA=s.boxIdx=null,s.editPi=null,s.editGood=!0,s.rebuildSoon()),s.draw&&(s.draw=null,s.rub=null),s.endDrag(!1),s.orbitPtr=null,s.twoPrev=s.twoNow(),s.cursorDot.visible=!1,s.frame();return}n.pointerType==="mouse"&&n.button!==0||(s.pendEdit&&s.commitEdit(),s.down={de:s.phase==="build"?s.doorEndAt(n.clientX,n.clientY):null,x0:n.clientX,y0:n.clientY,started:!1,item:s.itemMode()?s.itemAt(n.clientX,n.clientY):null,hb:s.itemMode()?null:s.handleAt(n.clientX,n.clientY)})}}));s.cv.addEventListener("pointermove",s.guard(n=>{if(!(s.walkOn&&s.phase!=="build")){if(!s.ptrs.has(n.pointerId)){if(n.pointerType==="mouse"&&s.phase==="build"&&s.tool==="door"){s.hoverDoor(n.clientX,n.clientY);return}if(n.pointerType==="mouse"&&s.phase==="build"&&s.tool!=="view"){const t=s.drawAt(n.clientX,n.clientY);t&&(s.cursorDot.position.set(t.x,s.wallHt()+.15,t.z),s.cursorDot.visible=!0,s.rub=s.active!=null?t:null,s.frame())}return}if(s.ptrs.set(n.pointerId,{x:n.clientX,y:n.clientY}),s.twoPrev&&s.ptrs.size>=2){const t=s.twoNow(),[e,i]=xS(s.twoPrev,t);_S(s.V,s.twoPrev,t),s.panBy(e,i),s.twoPrev=t,s.frame();return}if(s.panPtr){s.panBy(n.clientX-s.panPtr.x,n.clientY-s.panPtr.y),s.panPtr.x=n.clientX,s.panPtr.y=n.clientY,s.frame();return}if(s.orbitPtr){MS(s.V,n.clientX-s.orbitPtr.x,n.clientY-s.orbitPtr.y),s.orbitPtr.x=n.clientX,s.orbitPtr.y=n.clientY,s.frame();return}if(s.down&&!s.down.started){if(!SS(s.down.x0,s.down.y0,n.clientX,n.clientY))return;s.down.started=!0;const t=s.down.item;if(s.itemMode())if(t&&wS(Jt(t),s.selUid===t.uid)){s.select(t);const e=s.groundAt(s.down.x0,s.down.y0)||[t.x,t.z];s.drag={off:[t.x-e[0],t.z-e[1]],start:s.poseOf(t),moved:!0,grp:ko(s.S.items,t).filter(i=>i!==t).map(i=>({o:i,l:Fn(t.x,t.z,t.a,i.x,i.z),da:i.a-t.a,start:s.poseOf(i)}))}}else s.topDown||s.panMode?s.panPtr={x:n.clientX,y:n.clientY}:s.orbitPtr={x:n.clientX,y:n.clientY};else{const e=s.down.hb||{};if(s.down.de)s.doorDrag={...s.down.de,before:JSON.stringify(s.S.walls[s.down.de.pi].doors)},s.doorGhost.visible=!1;else if(e.mid&&s.S.walls[e.mid.pi]){const i=s.groundAt(s.down.x0,s.down.y0);i&&(s.editBefore=s.beginEdit(),s.push={...e.mid,n:Dd(s.S.walls[e.mid.pi],e.mid.i),g0:i,base:JSON.stringify(s.S.walls[e.mid.pi]),last:0,carry:aS(s.S.walls,e.mid.pi,e.mid.i,s.S.items).map(r=>({uid:r.uid,x:r.x,z:r.z}))},s.editPi=e.mid.pi,s.editGood=!0,s.selSeg=null,s.selDoor=null)}else if(e.corner&&!(e.corner.pi===s.active&&e.corner.j===s.S.walls[s.active].pts.length-1))s.editBefore=s.beginEdit(),s.corner=e.corner,s.selSeg=null,s.editPi=s.corner.pi,s.editGood=!0;else if(s.tool==="door")s.topDown||s.panMode?s.panPtr={x:n.clientX,y:n.clientY}:s.orbitPtr={x:n.clientX,y:n.clientY};else if(s.tool==="box"){const i=s.groundAt(s.down.x0,s.down.y0);i&&(s.editBefore=s.beginEdit(),s.S.preset&&(s.S.walls=[]),s.boxA=i,s.active=null,s.S.walls.push({pts:[],closed:!1}),s.boxIdx=s.S.walls.length-1,s.editPi=s.boxIdx,s.editGood=!1)}else s.draw=!0,s.active==null&&s.addPt(s.drawAt(s.down.x0,s.down.y0))}}if(s.drag){const t=s.selItem(),e=s.groundAt(n.clientX,n.clientY);if(!t||!e)return;const i=Bs(s.W,t,e[0]+s.drag.off[0],e[1]+s.drag.off[1],Rd(s.V.dist)),r=t.host||t.mode;mn(s.W,t,i),s.moveGroup(t),s.drag.join=i.join||null,s.showHl(i),((i.host||i.mode)!==r||i.join)&&i.hl&&s.drag.lastJoin!==i.join&&s.sSnap(),s.drag.lastJoin=i.join,s.syncItems(),s.frame();return}if(s.doorDrag){const t=s.groundAt(n.clientX,n.clientY),e=vr(s.S.walls).find(o=>o.pi===s.doorDrag.pi&&o.k===s.doorDrag.k);if(!t||!e)return;const i=e.t+(t[0]-e.x)*e.ux+(t[1]-e.z)*e.uz,r=J_(s.S.walls,s.doorDrag.pi,s.doorDrag.k,s.doorDrag.end,i,.5);r&&r.w!==s.doorDrag.w&&(s.doorDrag.w=r.w,s.toast(`Door ${_o(r.w)} wide`)),s.S.preset=null,s.rebuildSoon();return}if(s.boxA){const t=s.groundAt(n.clientX,n.clientY);if(!t)return;const e=$_(s.boxA,t,_i(s.V.dist));s.S.walls[s.boxIdx]=e||{pts:[],closed:!1},s.S.preset=null,s.editGood=!!e&&Wa(s.S.walls,s.boxIdx),s.rebuildSoon();return}if(s.corner){const t=s.groundAt(n.clientX,n.clientY);if(!t)return;const e=_i(s.V.dist),i=s.S.walls[s.corner.pi];if(!i)return;Q_(i,s.corner.j,Math.round(t[0]/e)*e,Math.round(t[1]/e)*e),s.S.preset=null,s.editGood=Wa(s.S.walls,s.corner.pi),s.rebuildSoon();return}if(s.push){const t=s.groundAt(n.clientX,n.clientY);if(!t)return;const e=_i(s.V.dist),i=Math.round(((t[0]-s.push.g0[0])*s.push.n[0]+(t[1]-s.push.g0[1])*s.push.n[1])/e)*e,r=JSON.parse(s.push.base);if(vu(r,s.push.i,i))s.S.walls[s.push.pi]=r,s.push.last=i,s.editGood=Wa(s.S.walls,s.push.pi);else{const o=JSON.parse(s.push.base);vu(o,s.push.i,s.push.last),s.S.walls[s.push.pi]=o,s.editGood=!1}for(const o of s.push.carry){const a=s.S.items.find(l=>l.uid===o.uid);a&&(a.x=o.x+s.push.n[0]*s.push.last,a.z=o.z+s.push.n[1]*s.push.last)}s.S.preset=null,s.syncItems(),s.rebuildSoon();return}if(s.draw){const t=s.drawAt(n.clientX,n.clientY);if(t){const e=!!(t.aligned||t.close);e&&!s.wasAligned&&s.sSnap(),s.wasAligned=e,s.rub=t,s.cursorDot.position.set(t.x,s.wallHt()+.15,t.z),s.cursorDot.visible=!0,s.frame()}return}}}));s.onUp=s.guard(n=>{if(s.walkOn&&s.phase!=="build"){s.ptrs.delete(n.pointerId);return}s.ptrs.delete(n.pointerId),s.ptrs.size<2&&(s.twoPrev=null);const t=n.pointerType!=="mouse";if(!s.ptrs.size){if(s.down&&!s.down.started&&(s.phase==="place"&&(s.stamp||s.picker)?s.down.item?(s.startStamp(s.down.item),s.toast("Same again: "+Jt(s.down.item).name)):s.stamp?s.stampAt(s.down.x0,s.down.y0):s.toast("Tap a placed item to copy it"):s.itemMode()?s.select(s.down.item||null):s.tapBuild(s.down.x0,s.down.y0,s.down.hb||{})),s.draw&&(s.rub&&s.addPt(s.rub),s.draw=null,s.rub=null,s.cursorDot.visible=!1),s.corner&&(s.corner=null,s.selDoor=null,s.sTile(!0),s.finishEdit(s.editBefore,t),s.editBefore=null),s.doorDrag){const e=JSON.stringify(s.S.walls[s.doorDrag.pi].doors)!==s.doorDrag.before;s.doorDrag=null,e&&(s.sSnap(),s.wallsChanged())}if(s.push){const e=s.push.last!==0||!s.editGood;s.push=null,e?(s.sTile(!0),s.finishEdit(s.editBefore,t,s.editGood?"Wall moved":"")):(s.editPi=null,s.editGood=!0,s.rebuildSoon()),s.editBefore=null}if(s.boxA){const e=s.boxIdx,i=s.S.walls[s.boxIdx]&&s.S.walls[s.boxIdx].closed;i||s.S.walls.splice(s.boxIdx,1),s.boxA=null,s.boxIdx=null,i?(s.editGood&&(s.sSnap(),s.celebrate(s.S.walls[e])),s.finishEdit(s.editBefore,t,"Room made"),s.setTool("view")):(s.editPi=null,s.editGood=!0,s.wallsChanged()),s.editBefore=null}s.down=null,s.orbitPtr=null,s.panPtr=null,s.tapInfo=null,s.endDrag(!1),s.needSave&&(s.needSave=!1,s.save())}});s.cv.addEventListener("pointerup",s.onUp);s.cv.addEventListener("pointercancel",s.guard(n=>{if(s.walkOn&&s.phase!=="build"){s.ptrs.delete(n.pointerId);return}s.ptrs.delete(n.pointerId),s.ptrs.size<2&&(s.twoPrev=null),s.ptrs.size||(s.endDrag(!0),(s.corner||s.push)&&s.editBefore&&s.putBack(s.editBefore),s.editBefore=null,s.editPi=null,s.editGood=!0,s.orbitPtr=s.panPtr=s.tapInfo=s.down=s.corner=s.push=s.draw=s.rub=null,s.boxA&&(s.S.walls.splice(s.boxIdx,1),s.boxA=s.boxIdx=null),s.rebuildSoon(),s.needSave&&(s.needSave=!1,s.save()))}));s.cv.addEventListener("pointerleave",n=>{s.walkOn&&s.phase!=="build"||n.pointerType==="mouse"&&!s.ptrs.size&&(s.cursorDot.visible=!1,s.doorGhost.visible=!1,s.frame())});s.cv.addEventListener("wheel",n=>{if(s.walkOn&&s.phase!=="build"){n.preventDefault();return}n.preventDefault(),yS(s.V,n.deltaY>0?1.1:.9),s.frame()},{passive:!1});s.verTaps=[];s.$("#verBuild").addEventListener("pointerdown",()=>{const n=performance.now();if(s.verTaps=s.verTaps.filter(t=>n-t<700).concat(n),s.verTaps.length>=3){s.verTaps=[];const t=s.$("#dbg");t.classList.toggle("hidden"),t.classList.contains("hidden")||s.dbgUI()}});s.dbgUI=function(){const t=s.R.info;s.$("#dbg").textContent=`Event Space Planner v3.39 debug
${navigator.userAgent}
screen ${innerWidth}x${innerHeight} dpr ${devicePixelRatio} (render ${s.R.getPixelRatio()})
phase ${s.phase} items ${s.S.items.length} walls ${ur(s.S.walls).length} drawing ${s.active}
view ${JSON.stringify(s.V)}
GPU geometries ${t.memory.geometries} textures ${t.memory.textures} draw calls ${t.render.calls}
context lost ${s.DBG.lost} restored ${s.DBG.restored} crashes ${s.DBG.crashes}
last error: ${s.DBG.err||"none"}`};addEventListener("keydown",n=>{if(!s.$("#build").classList.contains("on"))return;const t=n.key.toLowerCase();(n.ctrlKey||n.metaKey)&&(t==="y"||t==="z"&&n.shiftKey)?(n.preventDefault(),s.redo()):(n.ctrlKey||n.metaKey)&&t==="z"?(n.preventDefault(),s.undo()):t==="r"&&s.selItem()?s.$("#btnRot").click():(t==="delete"||t==="backspace")&&s.selItem()?s.$("#btnDel").click():t==="t"&&!n.ctrlKey&&!n.metaKey?s.setTop(!s.topDown):t==="escape"&&s.pendEdit?s.cancelEdit():t==="escape"&&(s.stamp||s.picker)?s.endStamp():t==="escape"&&s.phase==="build"&&s.tool!=="view"?s.setTool("view"):t==="escape"&&(s.select(null),s.closeSheet())});addEventListener("pagehide",s.saveNow);s.ghostMat=new Os({color:9418976,transparent:!0,opacity:.35,depthWrite:!1});s.isEmpty=function(t){return!t||!t.walls.length&&!t.items.length&&!t.fill};s.moveToLevel=function(t){s.sim&&s.simStop();const e={walls:s.S.walls,items:s.S.items,venue:s.S.venue,fill:s.S.fill};s.isEmpty(e)?delete s.S.levels[s.S.lvl]:s.S.levels[s.S.lvl]=e;const i=s.S.levels[t]||{walls:[],items:[],venue:null};delete s.S.levels[t],s.S.lvl=t,s.S.walls=i.walls,s.S.items=i.items,s.S.venue=i.venue||null,s.S.fill=i.fill||null,s.S.preset=null,s.active=null,s.selSeg=null,s.rub=null,typeof s.select=="function"&&s.select(null)};s.switchLevel=function(t){const e=s.S.lvl+t;e<Bo||e>Ho||(s.moveToLevel(e),s.syncItems(),s.renderPresets(),s.save(),s.rebuild(),s.toast(s.lvlName()))};s.lvlName=function(){const t=s.S.venue;return`Level ${s.S.lvl}`+(t&&t.lvlName&&t.lvlName!==`Level ${s.S.lvl}`?` · ${t.lvlName}`:"")+(t&&t.lvlGuess?" (estimated)":"")};s.usedLevels=function(){const t=new Set(Object.keys(s.S.levels).map(Number));return s.isEmpty(s.S)||t.add(s.S.lvl),[...t].sort((e,i)=>e-i)};s.lvlUI=function(){const t=s.$("#lvlTxt");if(!t)return;const e=s.S.venue,i=e&&e.lvlName&&e.lvlName!==`Level ${s.S.lvl}`?e.lvlName:"",r=s.usedLevels();t.textContent=`Level ${s.S.lvl}`,s.$("#lvlSub").textContent=[i,e&&e.lvlGuess?"(estimated)":"",!e&&r.length>1?`${r.length} floors: ${r.join(", ")}`:""].filter(Boolean).join(" "),s.$("#lvlBar").title=s.lvlName()+(r.length>1?` · floors used: ${r.join(", ")}`:""),s.$("#lvlUp").disabled=s.S.lvl>=Ho,s.$("#lvlDown").disabled=s.S.lvl<=Bo};s.drawGhost=function(){for(const o of[...s.ghostG.children])s.ghostG.remove(o),o.geometry.dispose();const t=s.S.levels[s.S.lvl-1];if(s.isEmpty(t))return;const e=[];for(const o of t.walls){const a=o.pts.length;for(let l=0;l<(o.closed?a:a-1);l++){const c=o.pts[l],h=o.pts[(l+1)%a];e.push(c[0],.03,c[1],h[0],.03,h[1])}}for(const o of t.items){if(o.mode==="top"||o.mode==="wall")continue;const{w:a,d:l}=Xi(o),c=Math.cos(o.a||0),h=Math.sin(o.a||0),u=[[-a/2,-l/2],[a/2,-l/2],[a/2,l/2],[-a/2,l/2]].map(([f,d])=>[o.x+f*c+d*h,o.z-f*h+d*c]);for(let f=0;f<4;f++){const d=u[f],p=u[(f+1)%4];e.push(d[0],.03,d[1],p[0],.03,p[1])}}if(!e.length)return;const i=new Se;i.setAttribute("position",new ee(e,3));const r=new Ac(i,s.ghostMat);r.name="ghostBelow",r.renderOrder=-1,s.ghostG.add(r)};s.$("#lvlUp").onclick=()=>s.switchLevel(1);s.$(".lvlmid").onclick=()=>s.toast(s.lvlName());s.$("#lvlDown").onclick=()=>s.switchLevel(-1);s.clearKind=function(){const t=document.querySelector("#clearPick input[name=clearK]:checked");return t?t.value:"items"};s.clearUI=function(){const t=s.clearKind(),e=s.$("#clearGo");e.textContent=t==="build"?"Clear build":"Clear items",e.classList.toggle("dangerbtn",t==="build"),e.classList.toggle("primary",t!=="build")};s.openClear=function(){const t=document.querySelector("#clearPick input[value=items]");t&&(t.checked=!0),s.clearUI(),s.$("#clearPick").classList.remove("hidden")};s.closeClear=function(){s.$("#clearPick").classList.add("hidden")};s.clearRoom=function(t){s.sim&&s.simStop(),typeof s.endStamp=="function"&&(s.stamp||s.picker)&&s.endStamp(),s.select(null),s.selDoor=null,s.selSeg=null,s.active=null,s.rub=null,t==="build"?(s.S.walls=[],s.S.items=[],s.S.venue=null,s.S.fill=null,s.S.preset=null):(s.S.items=[],s.S.fill=null),s.closeClear(),s.syncItems(),s.renderPresets(),s.buildUI(),s.save(),s.rebuild(),s.toast(t==="build"?"Build cleared · Undo to bring it back":"Items cleared · Undo to bring them back")};s.$("#btnClear").onclick=()=>s.$("#clearPick").classList.contains("hidden")?s.openClear():s.closeClear();s.$$("#clearPick input[name=clearK]").forEach(n=>n.onchange=s.clearUI);s.$("#clearCancel").onclick=s.closeClear;s.$("#clearGo").onclick=()=>s.clearRoom(s.clearKind());const ye=.3048;function bS(){let n;try{n=new URLSearchParams(location.search)}catch{n=new URLSearchParams}const t=parseFloat(n.get("fw")||""),e=parseFloat(n.get("fd")||"");return{on:n.get("embed")==="1",room:n.get("room")||"",fw:t>1?t:30,fd:e>1?e:40,title:n.get("title")||"Room",from:n.get("from")||"dev",walk:n.get("walk")==="1"}}function ES(n){return"zdash.interior.layout.v1:"+n.room}function TS(){const n=Cd(s.S.walls).map(function(r){return{kind:"wall",name:"Wall",x:r.x*ye,z:r.z*ye,a:r.a,w:r.w*ye,d:r.d*ye}}),t=[];(s.S.items||[]).forEach(function(r){const o=Xi(r),a=Jt(r);if(!o||!a)return;const l=(r.y||0)*ye,c=(a.h||0)*ye;l+c<.35||l>1.7||t.push({kind:"item",name:a.name||r.type,x:r.x*ye,z:r.z*ye,a:r.a||0,w:o.w*ye,d:o.d*ye})});const e=zs(s.S.walls),i=Zo(e);return{walls:n,items:t,floor:{minX:i.minX*ye,maxX:i.maxX*ye,minZ:i.minZ*ye,maxZ:i.maxZ*ye,polys:e.polys.map(function(r){return r.map(function(o){return[o[0]*ye,o[1]*ye]})}),rects:e.rects.map(function(r){return{x0:r.x0*ye,z0:r.z0*ye,x1:r.x1*ye,z1:r.z1*ye}})},title:s.EMBED.title}}const AS=2*Math.atan(.5/.9)*180/Math.PI,wo=40,Ou=4.5/ye,CS=1.1/ye,RS=1.85/ye;function rr(n){!s.camera||Math.abs(s.camera.fov-n)<.05||(s.camera.fov=n,s.camera.updateProjectionMatrix())}function PS(){const n=s.walkPoseData,t=Zo(zs(s.S.walls)),e=(t.minX+t.maxX)/2,i=(t.minZ+t.maxZ)/2,r=n&&Number.isFinite(n.x)?n.x:e,o=n&&Number.isFinite(n.z)?n.z:i;s.V.tx=e*.35+r*.65,s.V.tz=i*.35+o*.65,s.V.yaw=Math.PI/4,s.V.pitch=.62;const a=Math.max(t.maxX-t.minX,t.maxZ-t.minZ,24);s.V.dist=Math.max(72,a*1.25)}function IS(){const n=s.walkPoseData||{x:0,z:0,y:0,yaw:0},t=n.yaw||0,e=n.x||0,i=n.z||0,r=n.y||0;rr(AS),s.camera.position.set(e-Math.sin(t)*Ou,Math.max(.8/ye,r+RS),i-Math.cos(t)*Ou),s.camera.lookAt(e,r+CS,i),s.camera.updateMatrixWorld()}function LS(){if(s.placeCam&&!s.placeCam._walkWrapped){const n=s.placeCam,t=function(){if(!s.walkOn||s.phase==="build"||s.topDown)return rr(wo),n();if(s.walkCam==="room")return rr(wo),s.orbitPtr||s.panPtr?s.walkHeld=!0:s.walkHeld||PS(),n();IS()};t._walkWrapped=1,t._walk=1,s.placeCam=t}if(typeof s.overlays=="function"&&!s.overlays._walk){const n=s.overlays,t=function(){if(s.walkOn&&s.phase!=="build"){Jo(!0);return}n(),s.walkOn&&(s.grid1&&(s.grid1.visible=!1),s.grid10&&(s.grid10.visible=!1),s.grid100&&(s.grid100.visible=!1),s.cursorDot&&(s.cursorDot.visible=!1))};t._walk=1,s.overlays=t}if(s.R&&typeof s.R.render=="function"&&!s.R.render._walk){const n=s.R.render.bind(s.R),t=function(i,r){const o=performance.now();return s._fpsN=(s._fpsN||0)+1,s._fpsT||(s._fpsT=o),o-s._fpsT>=400&&(s.walkFps=Math.round(s._fpsN*1e3/(o-s._fpsT)),s._fpsN=0,s._fpsT=o),n(i,r)};t._walk=1,s.R.render=t}if(typeof s.resize=="function"&&!s.resize._walk){const n=s.resize,t=function(){if(n(),!(s.walkOn&&s.R&&s.camera))return;const i=Math.round(innerWidth),r=Math.round(innerHeight);if(!(i>0&&r>0))return;const o=844*390;let a=i,l=r;if(a*l>o){const c=Math.sqrt(o/(a*l));a=Math.max(1,Math.round(i*c)),l=Math.max(1,Math.round(r*c))}s.R.setPixelRatio(1),s.R.setSize(a,l,!1),s.camera.aspect=i/Math.max(1,r),s.camera.updateProjectionMatrix()};t._walk=1,s.resize=t}}function DS(){if(document.getElementById("zdWalkCss"))return;const n=document.createElement("style");n.id="zdWalkCss",n.textContent="body.zd-walk header.bar,body.zd-walk #modes,body.zd-walk #toolsBuild,body.zd-walk #toolsPlace,body.zd-walk #drawTools,body.zd-walk #presets,body.zd-walk #hist,body.zd-walk #snapHint,body.zd-walk #lvlBar,body.zd-walk #hint,body.zd-walk #btnClear,body.zd-walk .ver,body.zd-walk #simBar,body.zd-walk #labels,body.zd-walk #presetTip,body.zd-walk #stampBar,body.zd-walk #selBar{display:none!important}body.zd-embed #btnShare,body.zd-embed #btnRun,body.zd-embed #btnQuote,body.zd-embed #btnExitStreet,body.zd-embed #sizeLbl,body.zd-embed #snapHint,body.zd-embed #lvlBar{display:none!important}body.zd-walk #rail,body.zd-walk #btnClear,body.zd-walk #btnNoWalls,body.zd-walk #presets{display:none!important}body.zd-embed header.bar{padding-right:112px;box-sizing:border-box}body.zd-embed.zd-build #rail{display:grid!important;grid-auto-flow:column;align-content:start;justify-items:stretch;top:8px;overflow:hidden;z-index:6}body.zd-embed.zd-build #btnClear,body.zd-embed.zd-build #btnNoWalls{display:inline-flex!important;align-items:center;justify-content:center;top:158px;bottom:auto;height:28px;padding:2px 8px;font-size:12px;z-index:8;max-width:none;white-space:nowrap}body.zd-embed.zd-build #btnClear{left:10px}body.zd-embed.zd-build #btnNoWalls{left:98px}.evrename{width:100%;box-sizing:border-box;font:600 13px sans-serif;padding:2px 4px;border-radius:6px;border:1px solid var(--accent);background:#0c2038;color:#fff}body.zd-embed.zd-build #hint{left:210px;right:96px;transform:none;max-width:none;width:auto;text-align:left;pointer-events:none;z-index:4}body.zd-embed #rail button.hidden,body.zd-embed #btnShare,body.zd-embed #btnRun,body.zd-embed #btnQuote{display:none!important}body.zd-embed #rail button:not(.hidden){display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:1px;border-radius:12px;border:1px solid #ffffff40;background:color-mix(in srgb,var(--surface) 91%,transparent);color:var(--fg);padding:2px 1px;font-weight:600;font-size:9px;line-height:1.05;overflow:hidden;box-sizing:border-box;min-height:0!important}body.zd-embed #rail button svg{display:block!important;width:14px;height:14px;flex:0 0 auto;margin:0!important}body.zd-embed #rail button span{display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.05}body.zd-embed #rail button.on{background:var(--accent);color:var(--on-action);border-color:var(--accent)}body.zd-embed #rail #btnAdd{background:var(--action);color:var(--on-action);border-color:var(--action)}body.zd-embed #sheet{z-index:12}@media (max-height:450px){body.zd-embed.zd-build #hint{display:none!important}}",document.head.appendChild(n)}const Xe={group:null,mats:[],meshes:[],geo:null,head:null},NS=new D(0,1,0),Fu=new D,Bi={group:null};function Jo(n){const t=["floorG","wallsG","doorsG","itemsG","fpG","handlesG","ghostG","venueG","fillG","grid1","grid10","grid100","cursorDot","rubber","ground","doorGhost"];for(let e=0;e<t.length;e++)s[t[e]]&&(s[t[e]].visible=!n);n&&(s.closeGhosts&&s.closeGhosts.forEach(function(e){e.visible=!1}),s.guides&&s.guides.forEach(function(e){e.visible=!1}))}function Pf(){Bi.group&&(s.scene&&s.scene.remove(Bi.group),Bi.group.traverse(function(n){n.geometry&&n.geometry.dispose(),n.material&&n.material.dispose()}),Bi.group=null)}function US(n,t){const e=n.index?n.toNonIndexed():n,i=e.getAttribute("position");if(!i)return e!==n&&e.dispose(),null;const r=new Float32Array(i.count*3),o=new D;for(let l=0;l<i.count;l++)o.fromBufferAttribute(i,l).applyMatrix4(t),r[l*3]=o.x,r[l*3+1]=o.y,r[l*3+2]=o.z;e!==n&&e.dispose();const a=new Se;return a.setAttribute("position",new en(r,3)),a}function OS(){if(Pf(),!s.scene)return;const n=new he;n.name="zdBake";const t=new Map,e=[s.floorG,s.wallsG,s.doorsG,s.itemsG];for(let i=0;i<e.length;i++){const r=e[i];r&&(r.updateMatrixWorld(!0),r.traverse(function(o){if(!o.isMesh||!o.geometry||o.userData&&(o.userData.ghost||o.userData.noHit))return;const a=US(o.geometry,o.matrixWorld);if(!a)return;const l=o.material&&o.material.color?o.material.color.getHex():8956620;t.has(l)||t.set(l,[]),t.get(l).push(a)}))}t.forEach(function(i,r){let o=null;try{o=Fs(i,!1)}catch{o=null}if(i.forEach(function(l){l!==o&&l.dispose()}),!o)return;const a=new Bt(o,new Ce({color:r}));a.frustumCulled=!1,a.userData.noHit=1,n.add(a)}),s.scene.add(n),Bi.group=n}function FS(){typeof s.rebuildNow=="function"&&s.rebuildNow(),OS(),Jo(!0),(!Bi.group||!Bi.group.children.length)&&(s.floorG&&(s.floorG.visible=!0),s.wallsG&&(s.wallsG.visible=!0),s.doorsG&&(s.doorsG.visible=!0),s.itemsG&&(s.itemsG.visible=!0))}function zS(){Pf(),Jo(!1)}function kS(){if(!s.frame||s.frame._exploreWrapped)return;const n=s.frame,t=function(){if(s.walkOn&&s.phase!=="build"){if(s.raf||s.crashed||s.ctxLost)return;s.raf=requestAnimationFrame(function(){s.raf=0;try{s.placeCam&&s.placeCam(),s.R&&s.scene&&s.camera&&s.R.render(s.scene,s.camera)}catch(i){typeof s.crash=="function"&&s.crash(i)}});return}return n.call(s)};t._exploreWrapped=1,s.frame=t}function BS(){if(document.getElementById("btnNoWalls"))return;const n=document.createElement("button");n.id="btnNoWalls",n.type="button",n.className="clearbtn",n.textContent="No walls",n.title="Clear walls",n.onclick=function(){if(typeof s.usePreset=="function"){s.usePreset("none");try{Kc(s.W)}catch{}typeof s.resetView=="function"&&s.resetView(),s.save(),typeof s.rebuild=="function"&&s.rebuild(),typeof s.toast=="function"&&s.toast("No walls · Undo to bring them back")}},document.body.appendChild(n)}function If(){Xe.group||!s.scene||(Xe.group=new he,Xe.group.name="zdWalkActor",Xe.geo=new cn(.5,.5,1,6),Xe.head=new Ic(.5,8,6),s.scene.add(Xe.group))}function HS(n){const t=new Ce({color:16730840}),e=new Bt(n?Xe.head:Xe.geo,t);return e.frustumCulled=!1,Xe.group.add(e),Xe.mats.push(t),Xe.meshes.push(e),e}function GS(n){if(If(),!Xe.group)return;const t=n||[];for(;Xe.meshes.length<t.length;)HS(!!(t[Xe.meshes.length]&&t[Xe.meshes.length].head));for(let e=0;e<Xe.meshes.length;e++){const i=Xe.meshes[e],r=t[e];if(!r||!r.a||!r.b){i.visible=!1;continue}const o=+r.a[0],a=+r.a[1],l=+r.a[2],c=+r.b[0],h=+r.b[1],u=+r.b[2],f=Math.hypot(c-o,h-a,u-l)||.04,d=Math.max(.12,(+r.r||.08)*1.7);if(i.visible=!0,i.material.color.set(r.c||"#ff4ad8"),r.head){i.position.set(o,a,l),i.scale.set(d*2,d*2,d*2),i.quaternion.identity();continue}i.position.set((o+c)/2,(a+h)/2,(l+u)/2),i.scale.set(d*2,f,d*2),Fu.set(c-o,h-a,u-l).multiplyScalar(1/f),i.quaternion.setFromUnitVectors(NS,Fu)}}function VS(n){s.floorMat&&(n?(s.floorMat.color.set(794680),s.floorMat.transparent=!0,s.floorMat.opacity=.72,s.floorMat.depthWrite=!1):(s.floorMat.color.set(16777215),s.floorMat.transparent=!1,s.floorMat.opacity=1,s.floorMat.depthWrite=!0))}const WS='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',$S='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v5M16 4v5"/></svg>';function rl(n,t,e){if(!n||n.dataset.dressed==="1")return;n.dataset.plain=n.innerHTML;let i=e||"";if(!i){const o=n.querySelector("svg");i=o?o.outerHTML:""}n.innerHTML=i+"<span>"+t+"</span>";const r=n.querySelector("svg");r&&r.removeAttribute("style"),n.dataset.dressed="1"}function XS(){const n=s.$("#rail");if(!n)return;const t=s.$("#btnTop")||n.firstChild;["btnAdd","btnSame","btnEvents"].forEach(function(e){const i=s.$("#"+e);i&&(!i.dataset.railHome&&i.parentElement&&(i.dataset.railHome=i.parentElement.id||""),n.insertBefore(i,t))}),rl(s.$("#btnAdd"),"Add item",WS),rl(s.$("#btnSame"),"Same again",""),rl(s.$("#btnEvents"),"Presets",$S),["btnShare","btnRun","btnQuote"].forEach(function(e){const i=s.$("#"+e);i&&i.classList.add("hidden")})}function qS(n){let t=document;try{window.parent&&window.parent.document&&window.parent.document.getElementById&&(t=window.parent.document)}catch{}const e=t.getElementById(n);if(!e||!e.getBoundingClientRect)return null;const r=(e.ownerDocument&&e.ownerDocument.defaultView||window).getComputedStyle(e);if(r.display==="none"||r.visibility==="hidden"||r.opacity==="0")return null;const o=e.getBoundingClientRect();if(o.width<2||o.height<2)return null;let a=o.left,l=o.top,c=o.right,h=o.bottom;if(e.ownerDocument!==document&&window.frameElement&&window.frameElement.getBoundingClientRect){const u=window.frameElement.getBoundingClientRect();a-=u.left,l-=u.top,c-=u.left,h-=u.top}return{x:a,y:l,r:c,b:h}}function ol(n){const t=s.$(n);if(!t||!t.getBoundingClientRect)return null;const e=getComputedStyle(t);if(e.display==="none"||e.visibility==="hidden"||e.opacity==="0")return null;const i=t.getBoundingClientRect();return i.width<2||i.height<2?null:{x:i.left,y:i.top,r:i.right,b:i.bottom}}function al(){const n=s.$("#rail");if(!n)return;const t=window.innerWidth||844,e=window.innerHeight||390,i=[].filter.call(n.querySelectorAll("button"),function(v){return!v.classList.contains("hidden")}),r=Math.max(1,i.length),o=4,a=72,l=18,c=["kMenuB","exitCarBtn","tup","nos","brk","wng","emoteBtn","zdWalkAct","zdWalkExit","zdWalkCam","zdWalkTitle","zdWalkFps","devOpen","enterBldBtn"].map(qS).filter(Boolean);["header.bar","#modes","#drawTools","#hint"].forEach(function(v){const m=ol(v);m&&c.push(m)});const h=c.filter(function(v){return v.x>t*.45&&v.b>e*.4});let u=(h.length?Math.min.apply(null,h.map(function(v){return v.y})):e)-8;const f=ol("#toolsBuild")||ol("#toolsPlace");f&&f.y>48&&(u=Math.min(u,f.y-8));function d(v){const m=Math.ceil(r/v),g=v*a+(v-1)*o,y=t-8-g;let _=8;c.forEach(function(T){if(T.y>=u-4)return;Math.min(t-8,T.r)-Math.max(y,T.x)>2&&T.b+6>_&&(_=Math.ceil(T.b+6))});const S=u-_;let P=Math.floor((S-o*(m-1))/m);P>44&&(P=44);const C=m*l+o*(m-1);return{cols:v,rows:m,top:_,btnH:P,avail:S,railW:g,ok:P>=l&&S+1>=C}}let p=d(1);p.ok||(p=d(2)),p.ok||(p.btnH=l);const x=[p.cols,p.rows,p.top,p.btnH,p.railW,r,Math.round(u)].join("|");n.dataset.fit!==x&&(n.dataset.fit=x,n.style.top=p.top+"px",n.style.right="8px",n.style.left="auto",n.style.gap=o+"px",n.style.width=p.railW+"px",n.style.maxHeight=Math.max(36,Math.floor(p.avail))+"px",n.style.gridTemplateRows="repeat("+p.rows+", "+p.btnH+"px)",n.style.gridTemplateColumns="repeat("+p.cols+", "+a+"px)",i.forEach(function(v){v.style.height=p.btnH+"px",v.style.minHeight="0px",v.style.width=a+"px",v.style.fontSize="",v.style.padding="",v.style.overflow="hidden",v.style.whiteSpace=""}))}function co(n){let t=null,e="";try{e=Yc(s.S),t=TS()}catch{}try{parent.postMessage({type:n,room:s.EMBED.room,from:s.EMBED.from,layout:e,solids:t,title:s.EMBED.title},"*")}catch{}}function YS(){const n=bS();if(!n.on||!n.room)return;s.EMBED=n,s.W.home=!0;const t=ES(n);s.loadSaved=function(){try{return Ef(localStorage.getItem(t))}catch{return null}};const e=s.saveNow;s.saveNow=function(){try{localStorage.setItem(t,Yc(s.S))}catch{}co("zd-interior-save"),typeof e=="function"&&s.saveNow};const i=s.loadSaved();i&&(i.walls&&i.walls.length||i.items&&i.items.length)?(s.S.env=i.env||"indoor",s.S.walls=i.walls||[],s.S.items=i.items||[],s.S.venue=i.venue||null,s.S.fill=i.fill||null,s.S.lvl=i.lvl||1,s.S.levels=i.levels||{},s.S.tech=i.tech||"essentials",s.S.presetNames=i.presetNames||{},s.S.preset=null,s.setPhase("place")):(s.S.env="indoor",s.S.walls=[jo(n.fw,n.fd)],s.S.items=[],s.S.preset=null,s.S.presetNames={},s.S.tech="essentials",s.S.venue=null,s.S.fill=null,Oc(s.S.walls,0,0,n.fw/2),s.setPhase("build")),s.sim=null,typeof s.simStop=="function"&&s.simStop(),s.applyEnv(),s.select(null),s.resetView(),s.histReset(),s.showScreen("build"),LS(),kS(),DS(),BS(),document.body&&document.body.classList.add("zd-embed");const r=s.$("#btnHome");r&&(r.onclick=function(){s.saveNow(),co(n.from==="walk"?"zd-interior-back":"zd-interior-exit")});const o=s.$("#btnWallsDone");o&&n.from==="walk"&&(o.onclick=function(){typeof s.commitEdit=="function"&&s.commitEdit(),s.saveNow(),co("zd-interior-back")}),s.walkPose=function(l){s.walkPoseData=l||null,GS(l&&l.segs),s.frame&&s.frame()},s.setWalkCam=function(l){return s.walkCam=l==="room"?"room":"chase",s.walkHeld=!1,s.frame&&s.frame(),s.walkCam},s.sheetOpen=function(){const l=s.$("#sheet");return!!(l&&!l.classList.contains("hidden"))},s.setWalk=function(l){const c=!!s.walkOn;s.walkOn=!!l,s.sim=null,typeof s.simStop=="function"&&s.simStop(),document.body&&(document.body.classList.add("zd-embed"),document.body.classList.toggle("zd-walk",!!l),document.body.classList.toggle("zd-build",!l)),VS(!!l),l?(c||(typeof s.setWallsView=="function"&&s.setWallsView("low"),s.walkCam="chase",s.walkHeld=!1),s.select(null),typeof s.endStamp=="function"&&s.endStamp(),typeof s.closeSheet=="function"&&s.closeSheet(),Jo(!0),s.phase!=="place"&&typeof s.setPhase=="function"&&s.setPhase("place"),If(),FS()):(zS(),rr(wo),s.walkHeld=!1,typeof s.setPhase=="function"&&s.setPhase("build")),XS(),typeof s.resize=="function"&&s.resize(),s.frame&&s.frame(),l||al()},s.fitWalkRail=al,addEventListener("resize",function(){document.body&&document.body.classList.contains("zd-build")&&al()}),n.walk&&s.setWalk(!0),document.body&&(document.body.dataset.ready="1");try{window.ESP=s}catch{}s.renderPresets(),s.rebuildSoon(),co("zd-interior-ready")}zf();typeof s.drawVenue!="function"&&(s.drawVenue=function(){});typeof s.drawFill!="function"&&(s.drawFill=function(){});s.saved0=s.loadSaved();s.saved0&&s.setMute(s.saved0.mute);s.startUI();s.renderPresets();s.applyEnv();s.resetView();s.setPhase("build");s.histReset();s.viewUI();s.stampUI();YS();
