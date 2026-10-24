(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();const xf={rentacomputer:{id:"rentacomputer",name:"Rentacomputer.com",appName:"Event Space Planner",siteUrl:"https://www.rentacomputer.com",logo:"./brand/rentacomputer-logo.png",logoW:400,logoH:84,icon:"./brand/rentacomputer-icon-192.png",icon512:"./brand/rentacomputer-icon-512.png",favicon:"./brand/rentacomputer-icon-64.png",colors:{bg:"#03192f",surface:"#0b2e55",fg:"#f4f8fc",muted:"#b9c6d8",action:"#2f7ed8",actionHover:"#1d6fc4",onAction:"#ffffff",accent:"#5fd4ff",highlight:"#2f7ed8",navy:"#062a50",strip:"#ffffff",stripText:"#062a50",stripSub:"#1d4a8d"},fonts:{body:"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",heading:"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"},copy:{lead:"Draw your room wall by wall and see it in 3D. Free to use.",repNote:"Sizes are typical. Your Rentacomputer.com rep confirms exact items.",shareTitle:"My event layout",shareText:"Planned with the Rentacomputer.com Event Space Planner",description:"Plan your event space in 3D with the Rentacomputer.com Event Space Planner. Draw your room, place tables, screens and tech, and share the layout."},quote:{url:"https://www.rentacomputer.com/api/quote",page:"https://www.rentacomputer.com/quote",wired:!1}}},vf="rentacomputer",nt=xf[vf],ne=i=>parseInt(i.slice(1),16);function _f(i=document.documentElement){const t=nt.colors,e=i.style;for(const[n,s]of Object.entries({bg:t.bg,surface:t.surface,fg:t.fg,muted:t.muted,action:t.action,"action-h":t.actionHover,"on-action":t.onAction,accent:t.accent,hl:t.highlight,navy:t.navy}))e.setProperty("--"+n,s);e.setProperty("--font",nt.fonts.body),e.setProperty("--font-h",nt.fonts.heading)}const r={};/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const sc="169",Mf=0,Yc=1,Sf=2,wu=1,yf=2,$n=3,vi=0,rn=1,Yn=2,pi=0,us=1,jc=2,Kc=3,Zc=4,wf=5,Li=100,bf=101,Ef=102,Tf=103,Af=104,Cf=200,Rf=201,Pf=202,If=203,Ja=204,Qa=205,Lf=206,Df=207,Uf=208,Nf=209,Of=210,Ff=211,kf=212,Bf=213,zf=214,tl=0,el=1,nl=2,_s=3,il=4,sl=5,rl=6,ol=7,rc=0,Gf=1,Hf=2,mi=0,Vf=1,Wf=2,$f=3,Xf=4,qf=5,Yf=6,jf=7,bu=300,Ms=301,Ss=302,al=303,ll=304,No=306,xo=1e3,Ui=1001,cl=1002,Je=1003,Kf=1004,Mr=1005,Tn=1006,jo=1007,Ni=1008,Jn=1009,Eu=1010,Tu=1011,Ks=1012,oc=1013,ki=1014,jn=1015,or=1016,ac=1017,lc=1018,ys=1020,Au=35902,Cu=1021,Ru=1022,Cn=1023,Pu=1024,Iu=1025,ds=1026,ws=1027,Lu=1028,cc=1029,Du=1030,hc=1031,uc=1033,so=33776,ro=33777,oo=33778,ao=33779,hl=35840,ul=35841,dl=35842,fl=35843,pl=36196,ml=37492,gl=37496,xl=37808,vl=37809,_l=37810,Ml=37811,Sl=37812,yl=37813,wl=37814,bl=37815,El=37816,Tl=37817,Al=37818,Cl=37819,Rl=37820,Pl=37821,lo=36492,Il=36494,Ll=36495,Uu=36283,Dl=36284,Ul=36285,Nl=36286,Zf=3200,Jf=3201,Nu=0,Qf=1,fi="",En="srgb",Si="srgb-linear",dc="display-p3",Oo="display-p3-linear",vo="linear",xe="srgb",_o="rec709",Mo="p3",Xi=7680,Jc=519,tp=512,ep=513,np=514,Ou=515,ip=516,sp=517,rp=518,op=519,Qc=35044,th="300 es",Kn=2e3,So=2001;class Cs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const o=s.indexOf(e);o!==-1&&s.splice(o,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let o=0,a=s.length;o<a;o++)s[o].call(this,t);t.target=null}}}const Xe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ko=Math.PI/180,Ol=180/Math.PI;function Rs(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Xe[i&255]+Xe[i>>8&255]+Xe[i>>16&255]+Xe[i>>24&255]+"-"+Xe[t&255]+Xe[t>>8&255]+"-"+Xe[t>>16&15|64]+Xe[t>>24&255]+"-"+Xe[e&63|128]+Xe[e>>8&255]+"-"+Xe[e>>16&255]+Xe[e>>24&255]+Xe[n&255]+Xe[n>>8&255]+Xe[n>>16&255]+Xe[n>>24&255]).toLowerCase()}function $e(i,t,e){return Math.max(t,Math.min(e,i))}function ap(i,t){return(i%t+t)%t}function Zo(i,t,e){return(1-e)*i+e*t}function Ls(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function nn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class ht{constructor(t=0,e=0){ht.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos($e(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),o=this.x-t.x,a=this.y-t.y;return this.x=o*n-a*s+t.x,this.y=o*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Zt{constructor(t,e,n,s,o,a,l,c,h){Zt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,o,a,l,c,h)}set(t,e,n,s,o,a,l,c,h){const u=this.elements;return u[0]=t,u[1]=s,u[2]=l,u[3]=e,u[4]=o,u[5]=c,u[6]=n,u[7]=a,u[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,o=this.elements,a=n[0],l=n[3],c=n[6],h=n[1],u=n[4],f=n[7],d=n[2],p=n[5],x=n[8],v=s[0],m=s[3],g=s[6],y=s[1],_=s[4],w=s[7],P=s[2],R=s[5],A=s[8];return o[0]=a*v+l*y+c*P,o[3]=a*m+l*_+c*R,o[6]=a*g+l*w+c*A,o[1]=h*v+u*y+f*P,o[4]=h*m+u*_+f*R,o[7]=h*g+u*w+f*A,o[2]=d*v+p*y+x*P,o[5]=d*m+p*_+x*R,o[8]=d*g+p*w+x*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],a=t[4],l=t[5],c=t[6],h=t[7],u=t[8];return e*a*u-e*l*h-n*o*u+n*l*c+s*o*h-s*a*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],a=t[4],l=t[5],c=t[6],h=t[7],u=t[8],f=u*a-l*h,d=l*c-u*o,p=h*o-a*c,x=e*f+n*d+s*p;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/x;return t[0]=f*v,t[1]=(s*h-u*n)*v,t[2]=(l*n-s*a)*v,t[3]=d*v,t[4]=(u*e-s*c)*v,t[5]=(s*o-l*e)*v,t[6]=p*v,t[7]=(n*c-h*e)*v,t[8]=(a*e-n*o)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,o,a,l){const c=Math.cos(o),h=Math.sin(o);return this.set(n*c,n*h,-n*(c*a+h*l)+a+t,-s*h,s*c,-s*(-h*a+c*l)+l+e,0,0,1),this}scale(t,e){return this.premultiply(Jo.makeScale(t,e)),this}rotate(t){return this.premultiply(Jo.makeRotation(-t)),this}translate(t,e){return this.premultiply(Jo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Jo=new Zt;function Fu(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function yo(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function lp(){const i=yo("canvas");return i.style.display="block",i}const eh={};function co(i){i in eh||(eh[i]=!0,console.warn(i))}function cp(i,t,e){return new Promise(function(n,s){function o(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(o,e);break;default:n()}}setTimeout(o,e)})}function hp(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function up(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const nh=new Zt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),ih=new Zt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Ds={[Si]:{transfer:vo,primaries:_o,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i,fromReference:i=>i},[En]:{transfer:xe,primaries:_o,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Oo]:{transfer:vo,primaries:Mo,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.applyMatrix3(ih),fromReference:i=>i.applyMatrix3(nh)},[dc]:{transfer:xe,primaries:Mo,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.convertSRGBToLinear().applyMatrix3(ih),fromReference:i=>i.applyMatrix3(nh).convertLinearToSRGB()}},dp=new Set([Si,Oo]),le={enabled:!0,_workingColorSpace:Si,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!dp.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=Ds[t].toReference,s=Ds[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return Ds[i].primaries},getTransfer:function(i){return i===fi?vo:Ds[i].transfer},getLuminanceCoefficients:function(i,t=this._workingColorSpace){return i.fromArray(Ds[t].luminanceCoefficients)}};function fs(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Qo(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let qi;class fp{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{qi===void 0&&(qi=yo("canvas")),qi.width=t.width,qi.height=t.height;const n=qi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=qi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=yo("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),o=s.data;for(let a=0;a<o.length;a++)o[a]=fs(o[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(fs(e[n]/255)*255):e[n]=fs(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let pp=0;class ku{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:pp++}),this.uuid=Rs(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let o;if(Array.isArray(s)){o=[];for(let a=0,l=s.length;a<l;a++)s[a].isDataTexture?o.push(ta(s[a].image)):o.push(ta(s[a]))}else o=ta(s);n.url=o}return e||(t.images[this.uuid]=n),n}}function ta(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?fp.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let mp=0;class Qe extends Cs{constructor(t=Qe.DEFAULT_IMAGE,e=Qe.DEFAULT_MAPPING,n=Ui,s=Ui,o=Tn,a=Ni,l=Cn,c=Jn,h=Qe.DEFAULT_ANISOTROPY,u=fi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:mp++}),this.uuid=Rs(),this.name="",this.source=new ku(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=o,this.minFilter=a,this.anisotropy=h,this.format=l,this.internalFormat=null,this.type=c,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==bu)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case xo:t.x=t.x-Math.floor(t.x);break;case Ui:t.x=t.x<0?0:1;break;case cl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case xo:t.y=t.y-Math.floor(t.y);break;case Ui:t.y=t.y<0?0:1;break;case cl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Qe.DEFAULT_IMAGE=null;Qe.DEFAULT_MAPPING=bu;Qe.DEFAULT_ANISOTROPY=1;class Ee{constructor(t=0,e=0,n=0,s=1){Ee.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,o=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*o,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*o,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*o,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*o,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,o;const c=t.elements,h=c[0],u=c[4],f=c[8],d=c[1],p=c[5],x=c[9],v=c[2],m=c[6],g=c[10];if(Math.abs(u-d)<.01&&Math.abs(f-v)<.01&&Math.abs(x-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(f+v)<.1&&Math.abs(x+m)<.1&&Math.abs(h+p+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const _=(h+1)/2,w=(p+1)/2,P=(g+1)/2,R=(u+d)/4,A=(f+v)/4,D=(x+m)/4;return _>w&&_>P?_<.01?(n=0,s=.707106781,o=.707106781):(n=Math.sqrt(_),s=R/n,o=A/n):w>P?w<.01?(n=.707106781,s=0,o=.707106781):(s=Math.sqrt(w),n=R/s,o=D/s):P<.01?(n=.707106781,s=.707106781,o=0):(o=Math.sqrt(P),n=A/o,s=D/o),this.set(n,s,o,e),this}let y=Math.sqrt((m-x)*(m-x)+(f-v)*(f-v)+(d-u)*(d-u));return Math.abs(y)<.001&&(y=1),this.x=(m-x)/y,this.y=(f-v)/y,this.z=(d-u)/y,this.w=Math.acos((h+p+g-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class gp extends Cs{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ee(0,0,t,e),this.scissorTest=!1,this.viewport=new Ee(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Tn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const o=new Qe(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);o.flipY=!1,o.generateMipmaps=n.generateMipmaps,o.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let l=0;l<a;l++)this.textures[l]=o.clone(),this.textures[l].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,o=this.textures.length;s<o;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new ku(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Bi extends gp{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Bu extends Qe{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Je,this.minFilter=Je,this.wrapR=Ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class xp extends Qe{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Je,this.minFilter=Je,this.wrapR=Ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ar{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,o,a,l){let c=n[s+0],h=n[s+1],u=n[s+2],f=n[s+3];const d=o[a+0],p=o[a+1],x=o[a+2],v=o[a+3];if(l===0){t[e+0]=c,t[e+1]=h,t[e+2]=u,t[e+3]=f;return}if(l===1){t[e+0]=d,t[e+1]=p,t[e+2]=x,t[e+3]=v;return}if(f!==v||c!==d||h!==p||u!==x){let m=1-l;const g=c*d+h*p+u*x+f*v,y=g>=0?1:-1,_=1-g*g;if(_>Number.EPSILON){const P=Math.sqrt(_),R=Math.atan2(P,g*y);m=Math.sin(m*R)/P,l=Math.sin(l*R)/P}const w=l*y;if(c=c*m+d*w,h=h*m+p*w,u=u*m+x*w,f=f*m+v*w,m===1-l){const P=1/Math.sqrt(c*c+h*h+u*u+f*f);c*=P,h*=P,u*=P,f*=P}}t[e]=c,t[e+1]=h,t[e+2]=u,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,o,a){const l=n[s],c=n[s+1],h=n[s+2],u=n[s+3],f=o[a],d=o[a+1],p=o[a+2],x=o[a+3];return t[e]=l*x+u*f+c*p-h*d,t[e+1]=c*x+u*d+h*f-l*p,t[e+2]=h*x+u*p+l*d-c*f,t[e+3]=u*x-l*f-c*d-h*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,o=t._z,a=t._order,l=Math.cos,c=Math.sin,h=l(n/2),u=l(s/2),f=l(o/2),d=c(n/2),p=c(s/2),x=c(o/2);switch(a){case"XYZ":this._x=d*u*f+h*p*x,this._y=h*p*f-d*u*x,this._z=h*u*x+d*p*f,this._w=h*u*f-d*p*x;break;case"YXZ":this._x=d*u*f+h*p*x,this._y=h*p*f-d*u*x,this._z=h*u*x-d*p*f,this._w=h*u*f+d*p*x;break;case"ZXY":this._x=d*u*f-h*p*x,this._y=h*p*f+d*u*x,this._z=h*u*x+d*p*f,this._w=h*u*f-d*p*x;break;case"ZYX":this._x=d*u*f-h*p*x,this._y=h*p*f+d*u*x,this._z=h*u*x-d*p*f,this._w=h*u*f+d*p*x;break;case"YZX":this._x=d*u*f+h*p*x,this._y=h*p*f+d*u*x,this._z=h*u*x-d*p*f,this._w=h*u*f-d*p*x;break;case"XZY":this._x=d*u*f-h*p*x,this._y=h*p*f-d*u*x,this._z=h*u*x+d*p*f,this._w=h*u*f+d*p*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],o=e[8],a=e[1],l=e[5],c=e[9],h=e[2],u=e[6],f=e[10],d=n+l+f;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(u-c)*p,this._y=(o-h)*p,this._z=(a-s)*p}else if(n>l&&n>f){const p=2*Math.sqrt(1+n-l-f);this._w=(u-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(o+h)/p}else if(l>f){const p=2*Math.sqrt(1+l-n-f);this._w=(o-h)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+u)/p}else{const p=2*Math.sqrt(1+f-n-l);this._w=(a-s)/p,this._x=(o+h)/p,this._y=(c+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs($e(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,o=t._z,a=t._w,l=e._x,c=e._y,h=e._z,u=e._w;return this._x=n*u+a*l+s*h-o*c,this._y=s*u+a*c+o*l-n*h,this._z=o*u+a*h+n*c-s*l,this._w=a*u-n*l-s*c-o*h,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,o=this._z,a=this._w;let l=a*t._w+n*t._x+s*t._y+o*t._z;if(l<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,l=-l):this.copy(t),l>=1)return this._w=a,this._x=n,this._y=s,this._z=o,this;const c=1-l*l;if(c<=Number.EPSILON){const p=1-e;return this._w=p*a+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*o+e*this._z,this.normalize(),this}const h=Math.sqrt(c),u=Math.atan2(h,l),f=Math.sin((1-e)*u)/h,d=Math.sin(e*u)/h;return this._w=a*f+this._w*d,this._x=n*f+this._x*d,this._y=s*f+this._y*d,this._z=o*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),o=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),o*Math.sin(e),o*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(t=0,e=0,n=0){L.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(sh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(sh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[3]*n+o[6]*s,this.y=o[1]*e+o[4]*n+o[7]*s,this.z=o[2]*e+o[5]*n+o[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,o=t.elements,a=1/(o[3]*e+o[7]*n+o[11]*s+o[15]);return this.x=(o[0]*e+o[4]*n+o[8]*s+o[12])*a,this.y=(o[1]*e+o[5]*n+o[9]*s+o[13])*a,this.z=(o[2]*e+o[6]*n+o[10]*s+o[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,o=t.x,a=t.y,l=t.z,c=t.w,h=2*(a*s-l*n),u=2*(l*e-o*s),f=2*(o*n-a*e);return this.x=e+c*h+a*f-l*u,this.y=n+c*u+l*h-o*f,this.z=s+c*f+o*u-a*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s,this.y=o[1]*e+o[5]*n+o[9]*s,this.z=o[2]*e+o[6]*n+o[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,o=t.z,a=e.x,l=e.y,c=e.z;return this.x=s*c-o*l,this.y=o*a-n*c,this.z=n*l-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ea.copy(this).projectOnVector(t),this.sub(ea)}reflect(t){return this.sub(ea.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos($e(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ea=new L,sh=new ar;class lr{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Sn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Sn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Sn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const o=n.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let a=0,l=o.count;a<l;a++)t.isMesh===!0?t.getVertexPosition(a,Sn):Sn.fromBufferAttribute(o,a),Sn.applyMatrix4(t.matrixWorld),this.expandByPoint(Sn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Sr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Sr.copy(n.boundingBox)),Sr.applyMatrix4(t.matrixWorld),this.union(Sr)}const s=t.children;for(let o=0,a=s.length;o<a;o++)this.expandByObject(s[o],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Sn),Sn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Us),yr.subVectors(this.max,Us),Yi.subVectors(t.a,Us),ji.subVectors(t.b,Us),Ki.subVectors(t.c,Us),ii.subVectors(ji,Yi),si.subVectors(Ki,ji),wi.subVectors(Yi,Ki);let e=[0,-ii.z,ii.y,0,-si.z,si.y,0,-wi.z,wi.y,ii.z,0,-ii.x,si.z,0,-si.x,wi.z,0,-wi.x,-ii.y,ii.x,0,-si.y,si.x,0,-wi.y,wi.x,0];return!na(e,Yi,ji,Ki,yr)||(e=[1,0,0,0,1,0,0,0,1],!na(e,Yi,ji,Ki,yr))?!1:(wr.crossVectors(ii,si),e=[wr.x,wr.y,wr.z],na(e,Yi,ji,Ki,yr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Sn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Sn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(zn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),zn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),zn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),zn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),zn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),zn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),zn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),zn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(zn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const zn=[new L,new L,new L,new L,new L,new L,new L,new L],Sn=new L,Sr=new lr,Yi=new L,ji=new L,Ki=new L,ii=new L,si=new L,wi=new L,Us=new L,yr=new L,wr=new L,bi=new L;function na(i,t,e,n,s){for(let o=0,a=i.length-3;o<=a;o+=3){bi.fromArray(i,o);const l=s.x*Math.abs(bi.x)+s.y*Math.abs(bi.y)+s.z*Math.abs(bi.z),c=t.dot(bi),h=e.dot(bi),u=n.dot(bi);if(Math.max(-Math.max(c,h,u),Math.min(c,h,u))>l)return!1}return!0}const vp=new lr,Ns=new L,ia=new L;class cr{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):vp.setFromPoints(t).getCenter(n);let s=0;for(let o=0,a=t.length;o<a;o++)s=Math.max(s,n.distanceToSquared(t[o]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ns.subVectors(t,this.center);const e=Ns.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Ns,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ia.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ns.copy(t.center).add(ia)),this.expandByPoint(Ns.copy(t.center).sub(ia))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Gn=new L,sa=new L,br=new L,ri=new L,ra=new L,Er=new L,oa=new L;class Fo{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Gn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Gn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Gn.copy(this.origin).addScaledVector(this.direction,e),Gn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){sa.copy(t).add(e).multiplyScalar(.5),br.copy(e).sub(t).normalize(),ri.copy(this.origin).sub(sa);const o=t.distanceTo(e)*.5,a=-this.direction.dot(br),l=ri.dot(this.direction),c=-ri.dot(br),h=ri.lengthSq(),u=Math.abs(1-a*a);let f,d,p,x;if(u>0)if(f=a*c-l,d=a*l-c,x=o*u,f>=0)if(d>=-x)if(d<=x){const v=1/u;f*=v,d*=v,p=f*(f+a*d+2*l)+d*(a*f+d+2*c)+h}else d=o,f=Math.max(0,-(a*d+l)),p=-f*f+d*(d+2*c)+h;else d=-o,f=Math.max(0,-(a*d+l)),p=-f*f+d*(d+2*c)+h;else d<=-x?(f=Math.max(0,-(-a*o+l)),d=f>0?-o:Math.min(Math.max(-o,-c),o),p=-f*f+d*(d+2*c)+h):d<=x?(f=0,d=Math.min(Math.max(-o,-c),o),p=d*(d+2*c)+h):(f=Math.max(0,-(a*o+l)),d=f>0?o:Math.min(Math.max(-o,-c),o),p=-f*f+d*(d+2*c)+h);else d=a>0?-o:o,f=Math.max(0,-(a*d+l)),p=-f*f+d*(d+2*c)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(sa).addScaledVector(br,d),p}intersectSphere(t,e){Gn.subVectors(t.center,this.origin);const n=Gn.dot(this.direction),s=Gn.dot(Gn)-n*n,o=t.radius*t.radius;if(s>o)return null;const a=Math.sqrt(o-s),l=n-a,c=n+a;return c<0?null:l<0?this.at(c,e):this.at(l,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,o,a,l,c;const h=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,d=this.origin;return h>=0?(n=(t.min.x-d.x)*h,s=(t.max.x-d.x)*h):(n=(t.max.x-d.x)*h,s=(t.min.x-d.x)*h),u>=0?(o=(t.min.y-d.y)*u,a=(t.max.y-d.y)*u):(o=(t.max.y-d.y)*u,a=(t.min.y-d.y)*u),n>a||o>s||((o>n||isNaN(n))&&(n=o),(a<s||isNaN(s))&&(s=a),f>=0?(l=(t.min.z-d.z)*f,c=(t.max.z-d.z)*f):(l=(t.max.z-d.z)*f,c=(t.min.z-d.z)*f),n>c||l>s)||((l>n||n!==n)&&(n=l),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Gn)!==null}intersectTriangle(t,e,n,s,o){ra.subVectors(e,t),Er.subVectors(n,t),oa.crossVectors(ra,Er);let a=this.direction.dot(oa),l;if(a>0){if(s)return null;l=1}else if(a<0)l=-1,a=-a;else return null;ri.subVectors(this.origin,t);const c=l*this.direction.dot(Er.crossVectors(ri,Er));if(c<0)return null;const h=l*this.direction.dot(ra.cross(ri));if(h<0||c+h>a)return null;const u=-l*ri.dot(oa);return u<0?null:this.at(u/a,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class pe{constructor(t,e,n,s,o,a,l,c,h,u,f,d,p,x,v,m){pe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,o,a,l,c,h,u,f,d,p,x,v,m)}set(t,e,n,s,o,a,l,c,h,u,f,d,p,x,v,m){const g=this.elements;return g[0]=t,g[4]=e,g[8]=n,g[12]=s,g[1]=o,g[5]=a,g[9]=l,g[13]=c,g[2]=h,g[6]=u,g[10]=f,g[14]=d,g[3]=p,g[7]=x,g[11]=v,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new pe().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Zi.setFromMatrixColumn(t,0).length(),o=1/Zi.setFromMatrixColumn(t,1).length(),a=1/Zi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*o,e[5]=n[5]*o,e[6]=n[6]*o,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,o=t.z,a=Math.cos(n),l=Math.sin(n),c=Math.cos(s),h=Math.sin(s),u=Math.cos(o),f=Math.sin(o);if(t.order==="XYZ"){const d=a*u,p=a*f,x=l*u,v=l*f;e[0]=c*u,e[4]=-c*f,e[8]=h,e[1]=p+x*h,e[5]=d-v*h,e[9]=-l*c,e[2]=v-d*h,e[6]=x+p*h,e[10]=a*c}else if(t.order==="YXZ"){const d=c*u,p=c*f,x=h*u,v=h*f;e[0]=d+v*l,e[4]=x*l-p,e[8]=a*h,e[1]=a*f,e[5]=a*u,e[9]=-l,e[2]=p*l-x,e[6]=v+d*l,e[10]=a*c}else if(t.order==="ZXY"){const d=c*u,p=c*f,x=h*u,v=h*f;e[0]=d-v*l,e[4]=-a*f,e[8]=x+p*l,e[1]=p+x*l,e[5]=a*u,e[9]=v-d*l,e[2]=-a*h,e[6]=l,e[10]=a*c}else if(t.order==="ZYX"){const d=a*u,p=a*f,x=l*u,v=l*f;e[0]=c*u,e[4]=x*h-p,e[8]=d*h+v,e[1]=c*f,e[5]=v*h+d,e[9]=p*h-x,e[2]=-h,e[6]=l*c,e[10]=a*c}else if(t.order==="YZX"){const d=a*c,p=a*h,x=l*c,v=l*h;e[0]=c*u,e[4]=v-d*f,e[8]=x*f+p,e[1]=f,e[5]=a*u,e[9]=-l*u,e[2]=-h*u,e[6]=p*f+x,e[10]=d-v*f}else if(t.order==="XZY"){const d=a*c,p=a*h,x=l*c,v=l*h;e[0]=c*u,e[4]=-f,e[8]=h*u,e[1]=d*f+v,e[5]=a*u,e[9]=p*f-x,e[2]=x*f-p,e[6]=l*u,e[10]=v*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(_p,t,Mp)}lookAt(t,e,n){const s=this.elements;return hn.subVectors(t,e),hn.lengthSq()===0&&(hn.z=1),hn.normalize(),oi.crossVectors(n,hn),oi.lengthSq()===0&&(Math.abs(n.z)===1?hn.x+=1e-4:hn.z+=1e-4,hn.normalize(),oi.crossVectors(n,hn)),oi.normalize(),Tr.crossVectors(hn,oi),s[0]=oi.x,s[4]=Tr.x,s[8]=hn.x,s[1]=oi.y,s[5]=Tr.y,s[9]=hn.y,s[2]=oi.z,s[6]=Tr.z,s[10]=hn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,o=this.elements,a=n[0],l=n[4],c=n[8],h=n[12],u=n[1],f=n[5],d=n[9],p=n[13],x=n[2],v=n[6],m=n[10],g=n[14],y=n[3],_=n[7],w=n[11],P=n[15],R=s[0],A=s[4],D=s[8],K=s[12],M=s[1],b=s[5],z=s[9],G=s[13],N=s[2],k=s[6],I=s[10],W=s[14],B=s[3],Y=s[7],et=s[11],j=s[15];return o[0]=a*R+l*M+c*N+h*B,o[4]=a*A+l*b+c*k+h*Y,o[8]=a*D+l*z+c*I+h*et,o[12]=a*K+l*G+c*W+h*j,o[1]=u*R+f*M+d*N+p*B,o[5]=u*A+f*b+d*k+p*Y,o[9]=u*D+f*z+d*I+p*et,o[13]=u*K+f*G+d*W+p*j,o[2]=x*R+v*M+m*N+g*B,o[6]=x*A+v*b+m*k+g*Y,o[10]=x*D+v*z+m*I+g*et,o[14]=x*K+v*G+m*W+g*j,o[3]=y*R+_*M+w*N+P*B,o[7]=y*A+_*b+w*k+P*Y,o[11]=y*D+_*z+w*I+P*et,o[15]=y*K+_*G+w*W+P*j,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],o=t[12],a=t[1],l=t[5],c=t[9],h=t[13],u=t[2],f=t[6],d=t[10],p=t[14],x=t[3],v=t[7],m=t[11],g=t[15];return x*(+o*c*f-s*h*f-o*l*d+n*h*d+s*l*p-n*c*p)+v*(+e*c*p-e*h*d+o*a*d-s*a*p+s*h*u-o*c*u)+m*(+e*h*f-e*l*p-o*a*f+n*a*p+o*l*u-n*h*u)+g*(-s*l*u-e*c*f+e*l*d+s*a*f-n*a*d+n*c*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],a=t[4],l=t[5],c=t[6],h=t[7],u=t[8],f=t[9],d=t[10],p=t[11],x=t[12],v=t[13],m=t[14],g=t[15],y=f*m*h-v*d*h+v*c*p-l*m*p-f*c*g+l*d*g,_=x*d*h-u*m*h-x*c*p+a*m*p+u*c*g-a*d*g,w=u*v*h-x*f*h+x*l*p-a*v*p-u*l*g+a*f*g,P=x*f*c-u*v*c-x*l*d+a*v*d+u*l*m-a*f*m,R=e*y+n*_+s*w+o*P;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/R;return t[0]=y*A,t[1]=(v*d*o-f*m*o-v*s*p+n*m*p+f*s*g-n*d*g)*A,t[2]=(l*m*o-v*c*o+v*s*h-n*m*h-l*s*g+n*c*g)*A,t[3]=(f*c*o-l*d*o-f*s*h+n*d*h+l*s*p-n*c*p)*A,t[4]=_*A,t[5]=(u*m*o-x*d*o+x*s*p-e*m*p-u*s*g+e*d*g)*A,t[6]=(x*c*o-a*m*o-x*s*h+e*m*h+a*s*g-e*c*g)*A,t[7]=(a*d*o-u*c*o+u*s*h-e*d*h-a*s*p+e*c*p)*A,t[8]=w*A,t[9]=(x*f*o-u*v*o-x*n*p+e*v*p+u*n*g-e*f*g)*A,t[10]=(a*v*o-x*l*o+x*n*h-e*v*h-a*n*g+e*l*g)*A,t[11]=(u*l*o-a*f*o-u*n*h+e*f*h+a*n*p-e*l*p)*A,t[12]=P*A,t[13]=(u*v*s-x*f*s+x*n*d-e*v*d-u*n*m+e*f*m)*A,t[14]=(x*l*s-a*v*s-x*n*c+e*v*c+a*n*m-e*l*m)*A,t[15]=(a*f*s-u*l*s+u*n*c-e*f*c-a*n*d+e*l*d)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,o=t.z;return e[0]*=n,e[4]*=s,e[8]*=o,e[1]*=n,e[5]*=s,e[9]*=o,e[2]*=n,e[6]*=s,e[10]*=o,e[3]*=n,e[7]*=s,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),o=1-n,a=t.x,l=t.y,c=t.z,h=o*a,u=o*l;return this.set(h*a+n,h*l-s*c,h*c+s*l,0,h*l+s*c,u*l+n,u*c-s*a,0,h*c-s*l,u*c+s*a,o*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,o,a){return this.set(1,n,o,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,o=e._x,a=e._y,l=e._z,c=e._w,h=o+o,u=a+a,f=l+l,d=o*h,p=o*u,x=o*f,v=a*u,m=a*f,g=l*f,y=c*h,_=c*u,w=c*f,P=n.x,R=n.y,A=n.z;return s[0]=(1-(v+g))*P,s[1]=(p+w)*P,s[2]=(x-_)*P,s[3]=0,s[4]=(p-w)*R,s[5]=(1-(d+g))*R,s[6]=(m+y)*R,s[7]=0,s[8]=(x+_)*A,s[9]=(m-y)*A,s[10]=(1-(d+v))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let o=Zi.set(s[0],s[1],s[2]).length();const a=Zi.set(s[4],s[5],s[6]).length(),l=Zi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(o=-o),t.x=s[12],t.y=s[13],t.z=s[14],yn.copy(this);const h=1/o,u=1/a,f=1/l;return yn.elements[0]*=h,yn.elements[1]*=h,yn.elements[2]*=h,yn.elements[4]*=u,yn.elements[5]*=u,yn.elements[6]*=u,yn.elements[8]*=f,yn.elements[9]*=f,yn.elements[10]*=f,e.setFromRotationMatrix(yn),n.x=o,n.y=a,n.z=l,this}makePerspective(t,e,n,s,o,a,l=Kn){const c=this.elements,h=2*o/(e-t),u=2*o/(n-s),f=(e+t)/(e-t),d=(n+s)/(n-s);let p,x;if(l===Kn)p=-(a+o)/(a-o),x=-2*a*o/(a-o);else if(l===So)p=-a/(a-o),x=-a*o/(a-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+l);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,o,a,l=Kn){const c=this.elements,h=1/(e-t),u=1/(n-s),f=1/(a-o),d=(e+t)*h,p=(n+s)*u;let x,v;if(l===Kn)x=(a+o)*f,v=-2*f;else if(l===So)x=o*f,v=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+l);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*u,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=v,c[14]=-x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Zi=new L,yn=new pe,_p=new L(0,0,0),Mp=new L(1,1,1),oi=new L,Tr=new L,hn=new L,rh=new pe,oh=new ar;class Un{constructor(t=0,e=0,n=0,s=Un.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,o=s[0],a=s[4],l=s[8],c=s[1],h=s[5],u=s[9],f=s[2],d=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin($e(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,o)):(this._x=Math.atan2(d,h),this._z=0);break;case"YXZ":this._x=Math.asin(-$e(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(l,p),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-f,o),this._z=0);break;case"ZXY":this._x=Math.asin($e(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,p),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(c,o));break;case"ZYX":this._y=Math.asin(-$e(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(c,o)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin($e(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,h),this._y=Math.atan2(-f,o)):(this._x=0,this._y=Math.atan2(l,p));break;case"XZY":this._z=Math.asin(-$e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,h),this._y=Math.atan2(l,o)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return rh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(rh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return oh.setFromEuler(this),this.setFromQuaternion(oh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Un.DEFAULT_ORDER="XYZ";class fc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Sp=0;const ah=new L,Ji=new ar,Hn=new pe,Ar=new L,Os=new L,yp=new L,wp=new ar,lh=new L(1,0,0),ch=new L(0,1,0),hh=new L(0,0,1),uh={type:"added"},bp={type:"removed"},Qi={type:"childadded",child:null},aa={type:"childremoved",child:null};class Be extends Cs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Sp++}),this.uuid=Rs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Be.DEFAULT_UP.clone();const t=new L,e=new Un,n=new ar,s=new L(1,1,1);function o(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(o),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new pe},normalMatrix:{value:new Zt}}),this.matrix=new pe,this.matrixWorld=new pe,this.matrixAutoUpdate=Be.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new fc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ji.setFromAxisAngle(t,e),this.quaternion.multiply(Ji),this}rotateOnWorldAxis(t,e){return Ji.setFromAxisAngle(t,e),this.quaternion.premultiply(Ji),this}rotateX(t){return this.rotateOnAxis(lh,t)}rotateY(t){return this.rotateOnAxis(ch,t)}rotateZ(t){return this.rotateOnAxis(hh,t)}translateOnAxis(t,e){return ah.copy(t).applyQuaternion(this.quaternion),this.position.add(ah.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(lh,t)}translateY(t){return this.translateOnAxis(ch,t)}translateZ(t){return this.translateOnAxis(hh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Hn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ar.copy(t):Ar.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Os.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Hn.lookAt(Os,Ar,this.up):Hn.lookAt(Ar,Os,this.up),this.quaternion.setFromRotationMatrix(Hn),s&&(Hn.extractRotation(s.matrixWorld),Ji.setFromRotationMatrix(Hn),this.quaternion.premultiply(Ji.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(uh),Qi.child=t,this.dispatchEvent(Qi),Qi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(bp),aa.child=t,this.dispatchEvent(aa),aa.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Hn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Hn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Hn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(uh),Qi.child=t,this.dispatchEvent(Qi),Qi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Os,t,yp),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Os,wp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(l=>({boxInitialized:l.boxInitialized,boxMin:l.box.min.toArray(),boxMax:l.box.max.toArray(),sphereInitialized:l.sphereInitialized,sphereRadius:l.sphere.radius,sphereCenter:l.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function o(l,c){return l[c.uuid]===void 0&&(l[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=o(t.geometries,this.geometry);const l=this.geometry.parameters;if(l!==void 0&&l.shapes!==void 0){const c=l.shapes;if(Array.isArray(c))for(let h=0,u=c.length;h<u;h++){const f=c[h];o(t.shapes,f)}else o(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const l=[];for(let c=0,h=this.material.length;c<h;c++)l.push(o(t.materials,this.material[c]));s.material=l}else s.material=o(t.materials,this.material);if(this.children.length>0){s.children=[];for(let l=0;l<this.children.length;l++)s.children.push(this.children[l].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let l=0;l<this.animations.length;l++){const c=this.animations[l];s.animations.push(o(t.animations,c))}}if(e){const l=a(t.geometries),c=a(t.materials),h=a(t.textures),u=a(t.images),f=a(t.shapes),d=a(t.skeletons),p=a(t.animations),x=a(t.nodes);l.length>0&&(n.geometries=l),c.length>0&&(n.materials=c),h.length>0&&(n.textures=h),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),x.length>0&&(n.nodes=x)}return n.object=s,n;function a(l){const c=[];for(const h in l){const u=l[h];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Be.DEFAULT_UP=new L(0,1,0);Be.DEFAULT_MATRIX_AUTO_UPDATE=!0;Be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const wn=new L,Vn=new L,la=new L,Wn=new L,ts=new L,es=new L,dh=new L,ca=new L,ha=new L,ua=new L,da=new Ee,fa=new Ee,pa=new Ee;class An{constructor(t=new L,e=new L,n=new L){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),wn.subVectors(t,e),s.cross(wn);const o=s.lengthSq();return o>0?s.multiplyScalar(1/Math.sqrt(o)):s.set(0,0,0)}static getBarycoord(t,e,n,s,o){wn.subVectors(s,e),Vn.subVectors(n,e),la.subVectors(t,e);const a=wn.dot(wn),l=wn.dot(Vn),c=wn.dot(la),h=Vn.dot(Vn),u=Vn.dot(la),f=a*h-l*l;if(f===0)return o.set(0,0,0),null;const d=1/f,p=(h*c-l*u)*d,x=(a*u-l*c)*d;return o.set(1-p-x,x,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Wn)===null?!1:Wn.x>=0&&Wn.y>=0&&Wn.x+Wn.y<=1}static getInterpolation(t,e,n,s,o,a,l,c){return this.getBarycoord(t,e,n,s,Wn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(o,Wn.x),c.addScaledVector(a,Wn.y),c.addScaledVector(l,Wn.z),c)}static getInterpolatedAttribute(t,e,n,s,o,a){return da.setScalar(0),fa.setScalar(0),pa.setScalar(0),da.fromBufferAttribute(t,e),fa.fromBufferAttribute(t,n),pa.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(da,o.x),a.addScaledVector(fa,o.y),a.addScaledVector(pa,o.z),a}static isFrontFacing(t,e,n,s){return wn.subVectors(n,e),Vn.subVectors(t,e),wn.cross(Vn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return wn.subVectors(this.c,this.b),Vn.subVectors(this.a,this.b),wn.cross(Vn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return An.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return An.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,o){return An.getInterpolation(t,this.a,this.b,this.c,e,n,s,o)}containsPoint(t){return An.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return An.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,o=this.c;let a,l;ts.subVectors(s,n),es.subVectors(o,n),ca.subVectors(t,n);const c=ts.dot(ca),h=es.dot(ca);if(c<=0&&h<=0)return e.copy(n);ha.subVectors(t,s);const u=ts.dot(ha),f=es.dot(ha);if(u>=0&&f<=u)return e.copy(s);const d=c*f-u*h;if(d<=0&&c>=0&&u<=0)return a=c/(c-u),e.copy(n).addScaledVector(ts,a);ua.subVectors(t,o);const p=ts.dot(ua),x=es.dot(ua);if(x>=0&&p<=x)return e.copy(o);const v=p*h-c*x;if(v<=0&&h>=0&&x<=0)return l=h/(h-x),e.copy(n).addScaledVector(es,l);const m=u*x-p*f;if(m<=0&&f-u>=0&&p-x>=0)return dh.subVectors(o,s),l=(f-u)/(f-u+(p-x)),e.copy(s).addScaledVector(dh,l);const g=1/(m+v+d);return a=v*g,l=d*g,e.copy(n).addScaledVector(ts,a).addScaledVector(es,l)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const zu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ai={h:0,s:0,l:0},Cr={h:0,s:0,l:0};function ma(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Yt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=En){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,le.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=le.workingColorSpace){return this.r=t,this.g=e,this.b=n,le.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=le.workingColorSpace){if(t=ap(t,1),e=$e(e,0,1),n=$e(n,0,1),e===0)this.r=this.g=this.b=n;else{const o=n<=.5?n*(1+e):n+e-n*e,a=2*n-o;this.r=ma(a,o,t+1/3),this.g=ma(a,o,t),this.b=ma(a,o,t-1/3)}return le.toWorkingColorSpace(this,s),this}setStyle(t,e=En){function n(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const a=s[1],l=s[2];switch(a){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=s[1],a=o.length;if(a===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=En){const n=zu[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=fs(t.r),this.g=fs(t.g),this.b=fs(t.b),this}copyLinearToSRGB(t){return this.r=Qo(t.r),this.g=Qo(t.g),this.b=Qo(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=En){return le.fromWorkingColorSpace(qe.copy(this),t),Math.round($e(qe.r*255,0,255))*65536+Math.round($e(qe.g*255,0,255))*256+Math.round($e(qe.b*255,0,255))}getHexString(t=En){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=le.workingColorSpace){le.fromWorkingColorSpace(qe.copy(this),e);const n=qe.r,s=qe.g,o=qe.b,a=Math.max(n,s,o),l=Math.min(n,s,o);let c,h;const u=(l+a)/2;if(l===a)c=0,h=0;else{const f=a-l;switch(h=u<=.5?f/(a+l):f/(2-a-l),a){case n:c=(s-o)/f+(s<o?6:0);break;case s:c=(o-n)/f+2;break;case o:c=(n-s)/f+4;break}c/=6}return t.h=c,t.s=h,t.l=u,t}getRGB(t,e=le.workingColorSpace){return le.fromWorkingColorSpace(qe.copy(this),e),t.r=qe.r,t.g=qe.g,t.b=qe.b,t}getStyle(t=En){le.fromWorkingColorSpace(qe.copy(this),t);const e=qe.r,n=qe.g,s=qe.b;return t!==En?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(ai),this.setHSL(ai.h+t,ai.s+e,ai.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ai),t.getHSL(Cr);const n=Zo(ai.h,Cr.h,e),s=Zo(ai.s,Cr.s,e),o=Zo(ai.l,Cr.l,e);return this.setHSL(n,s,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,o=t.elements;return this.r=o[0]*e+o[3]*n+o[6]*s,this.g=o[1]*e+o[4]*n+o[7]*s,this.b=o[2]*e+o[5]*n+o[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const qe=new Yt;Yt.NAMES=zu;let Ep=0;class Gi extends Cs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ep++}),this.uuid=Rs(),this.name="",this.type="Material",this.blending=us,this.side=vi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ja,this.blendDst=Qa,this.blendEquation=Li,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Yt(0,0,0),this.blendAlpha=0,this.depthFunc=_s,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Jc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xi,this.stencilZFail=Xi,this.stencilZPass=Xi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==us&&(n.blending=this.blending),this.side!==vi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ja&&(n.blendSrc=this.blendSrc),this.blendDst!==Qa&&(n.blendDst=this.blendDst),this.blendEquation!==Li&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==_s&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Jc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Xi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Xi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Xi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(o){const a=[];for(const l in o){const c=o[l];delete c.metadata,a.push(c)}return a}if(e){const o=s(t.textures),a=s(t.images);o.length>0&&(n.textures=o),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let o=0;o!==s;++o)n[o]=e[o].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Oe extends Gi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Un,this.combine=rc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ie=new L,Rr=new ht;class on{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Qc,this.updateRanges=[],this.gpuType=jn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,o=this.itemSize;s<o;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Rr.fromBufferAttribute(this,e),Rr.applyMatrix3(t),this.setXY(e,Rr.x,Rr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ie.fromBufferAttribute(this,e),Ie.applyMatrix3(t),this.setXYZ(e,Ie.x,Ie.y,Ie.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ie.fromBufferAttribute(this,e),Ie.applyMatrix4(t),this.setXYZ(e,Ie.x,Ie.y,Ie.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ie.fromBufferAttribute(this,e),Ie.applyNormalMatrix(t),this.setXYZ(e,Ie.x,Ie.y,Ie.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ie.fromBufferAttribute(this,e),Ie.transformDirection(t),this.setXYZ(e,Ie.x,Ie.y,Ie.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ls(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=nn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ls(e,this.array)),e}setX(t,e){return this.normalized&&(e=nn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ls(e,this.array)),e}setY(t,e){return this.normalized&&(e=nn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ls(e,this.array)),e}setZ(t,e){return this.normalized&&(e=nn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ls(e,this.array)),e}setW(t,e){return this.normalized&&(e=nn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=nn(e,this.array),n=nn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=nn(e,this.array),n=nn(n,this.array),s=nn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,o){return t*=this.itemSize,this.normalized&&(e=nn(e,this.array),n=nn(n,this.array),s=nn(s,this.array),o=nn(o,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Qc&&(t.usage=this.usage),t}}class Gu extends on{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Hu extends on{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class re extends on{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Tp=0;const xn=new pe,ga=new Be,ns=new L,un=new lr,Fs=new lr,He=new L;class Te extends Cs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Tp++}),this.uuid=Rs(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Fu(t)?Hu:Gu)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const o=new Zt().getNormalMatrix(t);n.applyNormalMatrix(o),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return xn.makeRotationFromQuaternion(t),this.applyMatrix4(xn),this}rotateX(t){return xn.makeRotationX(t),this.applyMatrix4(xn),this}rotateY(t){return xn.makeRotationY(t),this.applyMatrix4(xn),this}rotateZ(t){return xn.makeRotationZ(t),this.applyMatrix4(xn),this}translate(t,e,n){return xn.makeTranslation(t,e,n),this.applyMatrix4(xn),this}scale(t,e,n){return xn.makeScale(t,e,n),this.applyMatrix4(xn),this}lookAt(t){return ga.lookAt(t),ga.updateMatrix(),this.applyMatrix4(ga.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ns).negate(),this.translate(ns.x,ns.y,ns.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const o=t[n];e.push(o.x,o.y,o.z||0)}return this.setAttribute("position",new re(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new lr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const o=e[n];un.setFromBufferAttribute(o),this.morphTargetsRelative?(He.addVectors(this.boundingBox.min,un.min),this.boundingBox.expandByPoint(He),He.addVectors(this.boundingBox.max,un.max),this.boundingBox.expandByPoint(He)):(this.boundingBox.expandByPoint(un.min),this.boundingBox.expandByPoint(un.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new cr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){const n=this.boundingSphere.center;if(un.setFromBufferAttribute(t),e)for(let o=0,a=e.length;o<a;o++){const l=e[o];Fs.setFromBufferAttribute(l),this.morphTargetsRelative?(He.addVectors(un.min,Fs.min),un.expandByPoint(He),He.addVectors(un.max,Fs.max),un.expandByPoint(He)):(un.expandByPoint(Fs.min),un.expandByPoint(Fs.max))}un.getCenter(n);let s=0;for(let o=0,a=t.count;o<a;o++)He.fromBufferAttribute(t,o),s=Math.max(s,n.distanceToSquared(He));if(e)for(let o=0,a=e.length;o<a;o++){const l=e[o],c=this.morphTargetsRelative;for(let h=0,u=l.count;h<u;h++)He.fromBufferAttribute(l,h),c&&(ns.fromBufferAttribute(t,h),He.add(ns)),s=Math.max(s,n.distanceToSquared(He))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,o=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new on(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),l=[],c=[];for(let D=0;D<n.count;D++)l[D]=new L,c[D]=new L;const h=new L,u=new L,f=new L,d=new ht,p=new ht,x=new ht,v=new L,m=new L;function g(D,K,M){h.fromBufferAttribute(n,D),u.fromBufferAttribute(n,K),f.fromBufferAttribute(n,M),d.fromBufferAttribute(o,D),p.fromBufferAttribute(o,K),x.fromBufferAttribute(o,M),u.sub(h),f.sub(h),p.sub(d),x.sub(d);const b=1/(p.x*x.y-x.x*p.y);isFinite(b)&&(v.copy(u).multiplyScalar(x.y).addScaledVector(f,-p.y).multiplyScalar(b),m.copy(f).multiplyScalar(p.x).addScaledVector(u,-x.x).multiplyScalar(b),l[D].add(v),l[K].add(v),l[M].add(v),c[D].add(m),c[K].add(m),c[M].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let D=0,K=y.length;D<K;++D){const M=y[D],b=M.start,z=M.count;for(let G=b,N=b+z;G<N;G+=3)g(t.getX(G+0),t.getX(G+1),t.getX(G+2))}const _=new L,w=new L,P=new L,R=new L;function A(D){P.fromBufferAttribute(s,D),R.copy(P);const K=l[D];_.copy(K),_.sub(P.multiplyScalar(P.dot(K))).normalize(),w.crossVectors(R,K);const b=w.dot(c[D])<0?-1:1;a.setXYZW(D,_.x,_.y,_.z,b)}for(let D=0,K=y.length;D<K;++D){const M=y[D],b=M.start,z=M.count;for(let G=b,N=b+z;G<N;G+=3)A(t.getX(G+0)),A(t.getX(G+1)),A(t.getX(G+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new on(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);const s=new L,o=new L,a=new L,l=new L,c=new L,h=new L,u=new L,f=new L;if(t)for(let d=0,p=t.count;d<p;d+=3){const x=t.getX(d+0),v=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,x),o.fromBufferAttribute(e,v),a.fromBufferAttribute(e,m),u.subVectors(a,o),f.subVectors(s,o),u.cross(f),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,v),h.fromBufferAttribute(n,m),l.add(u),c.add(u),h.add(u),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(m,h.x,h.y,h.z)}else for(let d=0,p=e.count;d<p;d+=3)s.fromBufferAttribute(e,d+0),o.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),u.subVectors(a,o),f.subVectors(s,o),u.cross(f),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)He.fromBufferAttribute(t,e),He.normalize(),t.setXYZ(e,He.x,He.y,He.z)}toNonIndexed(){function t(l,c){const h=l.array,u=l.itemSize,f=l.normalized,d=new h.constructor(c.length*u);let p=0,x=0;for(let v=0,m=c.length;v<m;v++){l.isInterleavedBufferAttribute?p=c[v]*l.data.stride+l.offset:p=c[v]*u;for(let g=0;g<u;g++)d[x++]=h[p++]}return new on(d,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Te,n=this.index.array,s=this.attributes;for(const l in s){const c=s[l],h=t(c,n);e.setAttribute(l,h)}const o=this.morphAttributes;for(const l in o){const c=[],h=o[l];for(let u=0,f=h.length;u<f;u++){const d=h[u],p=t(d,n);c.push(p)}e.morphAttributes[l]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let l=0,c=a.length;l<c;l++){const h=a[l];e.addGroup(h.start,h.count,h.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(t[h]=c[h]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const h=n[c];t.data.attributes[c]=h.toJSON(t.data)}const s={};let o=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],u=[];for(let f=0,d=h.length;f<d;f++){const p=h[f];u.push(p.toJSON(t.data))}u.length>0&&(s[c]=u,o=!0)}o&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const l=this.boundingSphere;return l!==null&&(t.data.boundingSphere={center:l.center.toArray(),radius:l.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const h in s){const u=s[h];this.setAttribute(h,u.clone(e))}const o=t.morphAttributes;for(const h in o){const u=[],f=o[h];for(let d=0,p=f.length;d<p;d++)u.push(f[d].clone(e));this.morphAttributes[h]=u}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let h=0,u=a.length;h<u;h++){const f=a[h];this.addGroup(f.start,f.count,f.materialIndex)}const l=t.boundingBox;l!==null&&(this.boundingBox=l.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const fh=new pe,Ei=new Fo,Pr=new cr,ph=new L,Ir=new L,Lr=new L,Dr=new L,xa=new L,Ur=new L,mh=new L,Nr=new L;class zt extends Be{constructor(t=new Te,e=new Oe){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=s.length;o<a;o++){const l=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=o}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,o=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const l=this.morphTargetInfluences;if(o&&l){Ur.set(0,0,0);for(let c=0,h=o.length;c<h;c++){const u=l[c],f=o[c];u!==0&&(xa.fromBufferAttribute(f,t),a?Ur.addScaledVector(xa,u):Ur.addScaledVector(xa.sub(e),u))}e.add(Ur)}return e}raycast(t,e){const n=this.geometry,s=this.material,o=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Pr.copy(n.boundingSphere),Pr.applyMatrix4(o),Ei.copy(t.ray).recast(t.near),!(Pr.containsPoint(Ei.origin)===!1&&(Ei.intersectSphere(Pr,ph)===null||Ei.origin.distanceToSquared(ph)>(t.far-t.near)**2))&&(fh.copy(o).invert(),Ei.copy(t.ray).applyMatrix4(fh),!(n.boundingBox!==null&&Ei.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ei)))}_computeIntersections(t,e,n){let s;const o=this.geometry,a=this.material,l=o.index,c=o.attributes.position,h=o.attributes.uv,u=o.attributes.uv1,f=o.attributes.normal,d=o.groups,p=o.drawRange;if(l!==null)if(Array.isArray(a))for(let x=0,v=d.length;x<v;x++){const m=d[x],g=a[m.materialIndex],y=Math.max(m.start,p.start),_=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let w=y,P=_;w<P;w+=3){const R=l.getX(w),A=l.getX(w+1),D=l.getX(w+2);s=Or(this,g,t,n,h,u,f,R,A,D),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const x=Math.max(0,p.start),v=Math.min(l.count,p.start+p.count);for(let m=x,g=v;m<g;m+=3){const y=l.getX(m),_=l.getX(m+1),w=l.getX(m+2);s=Or(this,a,t,n,h,u,f,y,_,w),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let x=0,v=d.length;x<v;x++){const m=d[x],g=a[m.materialIndex],y=Math.max(m.start,p.start),_=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let w=y,P=_;w<P;w+=3){const R=w,A=w+1,D=w+2;s=Or(this,g,t,n,h,u,f,R,A,D),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const x=Math.max(0,p.start),v=Math.min(c.count,p.start+p.count);for(let m=x,g=v;m<g;m+=3){const y=m,_=m+1,w=m+2;s=Or(this,a,t,n,h,u,f,y,_,w),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Ap(i,t,e,n,s,o,a,l){let c;if(t.side===rn?c=n.intersectTriangle(a,o,s,!0,l):c=n.intersectTriangle(s,o,a,t.side===vi,l),c===null)return null;Nr.copy(l),Nr.applyMatrix4(i.matrixWorld);const h=e.ray.origin.distanceTo(Nr);return h<e.near||h>e.far?null:{distance:h,point:Nr.clone(),object:i}}function Or(i,t,e,n,s,o,a,l,c,h){i.getVertexPosition(l,Ir),i.getVertexPosition(c,Lr),i.getVertexPosition(h,Dr);const u=Ap(i,t,e,n,Ir,Lr,Dr,mh);if(u){const f=new L;An.getBarycoord(mh,Ir,Lr,Dr,f),s&&(u.uv=An.getInterpolatedAttribute(s,l,c,h,f,new ht)),o&&(u.uv1=An.getInterpolatedAttribute(o,l,c,h,f,new ht)),a&&(u.normal=An.getInterpolatedAttribute(a,l,c,h,f,new L),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a:l,b:c,c:h,normal:new L,materialIndex:0};An.getNormal(Ir,Lr,Dr,d.normal),u.face=d,u.barycoord=f}return u}class se extends Te{constructor(t=1,e=1,n=1,s=1,o=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:o,depthSegments:a};const l=this;s=Math.floor(s),o=Math.floor(o),a=Math.floor(a);const c=[],h=[],u=[],f=[];let d=0,p=0;x("z","y","x",-1,-1,n,e,t,a,o,0),x("z","y","x",1,-1,n,e,-t,a,o,1),x("x","z","y",1,1,t,n,e,s,a,2),x("x","z","y",1,-1,t,n,-e,s,a,3),x("x","y","z",1,-1,t,e,n,s,o,4),x("x","y","z",-1,-1,t,e,-n,s,o,5),this.setIndex(c),this.setAttribute("position",new re(h,3)),this.setAttribute("normal",new re(u,3)),this.setAttribute("uv",new re(f,2));function x(v,m,g,y,_,w,P,R,A,D,K){const M=w/A,b=P/D,z=w/2,G=P/2,N=R/2,k=A+1,I=D+1;let W=0,B=0;const Y=new L;for(let et=0;et<I;et++){const j=et*b-G;for(let xt=0;xt<k;xt++){const Pt=xt*M-z;Y[v]=Pt*y,Y[m]=j*_,Y[g]=N,h.push(Y.x,Y.y,Y.z),Y[v]=0,Y[m]=0,Y[g]=R>0?1:-1,u.push(Y.x,Y.y,Y.z),f.push(xt/A),f.push(1-et/D),W+=1}}for(let et=0;et<D;et++)for(let j=0;j<A;j++){const xt=d+j+k*et,Pt=d+j+k*(et+1),V=d+(j+1)+k*(et+1),Z=d+(j+1)+k*et;c.push(xt,Pt,Z),c.push(Pt,V,Z),B+=6}l.addGroup(p,B,K),p+=B,d+=W}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new se(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function bs(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ze(i){const t={};for(let e=0;e<i.length;e++){const n=bs(i[e]);for(const s in n)t[s]=n[s]}return t}function Cp(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Vu(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:le.workingColorSpace}const Rp={clone:bs,merge:Ze};var Pp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ip=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class _i extends Gi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Pp,this.fragmentShader=Ip,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=bs(t.uniforms),this.uniformsGroups=Cp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Wu extends Be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new pe,this.projectionMatrix=new pe,this.projectionMatrixInverse=new pe,this.coordinateSystem=Kn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const li=new L,gh=new ht,xh=new ht;class vn extends Wu{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ol*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ko*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ol*2*Math.atan(Math.tan(Ko*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){li.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(li.x,li.y).multiplyScalar(-t/li.z),li.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(li.x,li.y).multiplyScalar(-t/li.z)}getViewSize(t,e){return this.getViewBounds(t,gh,xh),e.subVectors(xh,gh)}setViewOffset(t,e,n,s,o,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ko*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,o=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,h=a.fullHeight;o+=a.offsetX*s/c,e-=a.offsetY*n/h,s*=a.width/c,n*=a.height/h}const l=this.filmOffset;l!==0&&(o+=t*l/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const is=-90,ss=1;class Lp extends Be{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new vn(is,ss,t,e);s.layers=this.layers,this.add(s);const o=new vn(is,ss,t,e);o.layers=this.layers,this.add(o);const a=new vn(is,ss,t,e);a.layers=this.layers,this.add(a);const l=new vn(is,ss,t,e);l.layers=this.layers,this.add(l);const c=new vn(is,ss,t,e);c.layers=this.layers,this.add(c);const h=new vn(is,ss,t,e);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,o,a,l,c]=e;for(const h of e)this.remove(h);if(t===Kn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),l.up.set(0,1,0),l.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===So)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),l.up.set(0,-1,0),l.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const h of e)this.add(h),h.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,a,l,c,h,u]=this.children,f=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),x=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,o),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,l),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,h),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,u),t.setRenderTarget(f,d,p),t.xr.enabled=x,n.texture.needsPMREMUpdate=!0}}class $u extends Qe{constructor(t,e,n,s,o,a,l,c,h,u){t=t!==void 0?t:[],e=e!==void 0?e:Ms,super(t,e,n,s,o,a,l,c,h,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Dp extends Bi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new $u(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Tn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new se(5,5,5),o=new _i({name:"CubemapFromEquirect",uniforms:bs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:rn,blending:pi});o.uniforms.tEquirect.value=e;const a=new zt(s,o),l=e.minFilter;return e.minFilter===Ni&&(e.minFilter=Tn),new Lp(1,10,this).update(t,a),e.minFilter=l,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,s){const o=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(o)}}const va=new L,Up=new L,Np=new Zt;class Xn{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=va.subVectors(n,e).cross(Up.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(va),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/s;return o<0||o>1?null:e.copy(t.start).addScaledVector(n,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Np.getNormalMatrix(t),s=this.coplanarPoint(va).applyMatrix4(t),o=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ti=new cr,Fr=new L;class pc{constructor(t=new Xn,e=new Xn,n=new Xn,s=new Xn,o=new Xn,a=new Xn){this.planes=[t,e,n,s,o,a]}set(t,e,n,s,o,a){const l=this.planes;return l[0].copy(t),l[1].copy(e),l[2].copy(n),l[3].copy(s),l[4].copy(o),l[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Kn){const n=this.planes,s=t.elements,o=s[0],a=s[1],l=s[2],c=s[3],h=s[4],u=s[5],f=s[6],d=s[7],p=s[8],x=s[9],v=s[10],m=s[11],g=s[12],y=s[13],_=s[14],w=s[15];if(n[0].setComponents(c-o,d-h,m-p,w-g).normalize(),n[1].setComponents(c+o,d+h,m+p,w+g).normalize(),n[2].setComponents(c+a,d+u,m+x,w+y).normalize(),n[3].setComponents(c-a,d-u,m-x,w-y).normalize(),n[4].setComponents(c-l,d-f,m-v,w-_).normalize(),e===Kn)n[5].setComponents(c+l,d+f,m+v,w+_).normalize();else if(e===So)n[5].setComponents(l,f,v,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ti.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ti.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ti)}intersectsSprite(t){return Ti.center.set(0,0,0),Ti.radius=.7071067811865476,Ti.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ti)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Fr.x=s.normal.x>0?t.max.x:t.min.x,Fr.y=s.normal.y>0?t.max.y:t.min.y,Fr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Fr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Xu(){let i=null,t=!1,e=null,n=null;function s(o,a){e(o,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){i=o}}}function Op(i){const t=new WeakMap;function e(l,c){const h=l.array,u=l.usage,f=h.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,h,u),l.onUploadCallback();let p;if(h instanceof Float32Array)p=i.FLOAT;else if(h instanceof Uint16Array)l.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(h instanceof Int16Array)p=i.SHORT;else if(h instanceof Uint32Array)p=i.UNSIGNED_INT;else if(h instanceof Int32Array)p=i.INT;else if(h instanceof Int8Array)p=i.BYTE;else if(h instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:d,type:p,bytesPerElement:h.BYTES_PER_ELEMENT,version:l.version,size:f}}function n(l,c,h){const u=c.array,f=c.updateRanges;if(i.bindBuffer(h,l),f.length===0)i.bufferSubData(h,0,u);else{f.sort((p,x)=>p.start-x.start);let d=0;for(let p=1;p<f.length;p++){const x=f[d],v=f[p];v.start<=x.start+x.count+1?x.count=Math.max(x.count,v.start+v.count-x.start):(++d,f[d]=v)}f.length=d+1;for(let p=0,x=f.length;p<x;p++){const v=f[p];i.bufferSubData(h,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(l){return l.isInterleavedBufferAttribute&&(l=l.data),t.get(l)}function o(l){l.isInterleavedBufferAttribute&&(l=l.data);const c=t.get(l);c&&(i.deleteBuffer(c.buffer),t.delete(l))}function a(l,c){if(l.isInterleavedBufferAttribute&&(l=l.data),l.isGLBufferAttribute){const u=t.get(l);(!u||u.version<l.version)&&t.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}const h=t.get(l);if(h===void 0)t.set(l,e(l,c));else if(h.version<l.version){if(h.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(h.buffer,l,c),h.version=l.version}}return{get:s,remove:o,update:a}}class Fn extends Te{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const o=t/2,a=e/2,l=Math.floor(n),c=Math.floor(s),h=l+1,u=c+1,f=t/l,d=e/c,p=[],x=[],v=[],m=[];for(let g=0;g<u;g++){const y=g*d-a;for(let _=0;_<h;_++){const w=_*f-o;x.push(w,-y,0),v.push(0,0,1),m.push(_/l),m.push(1-g/c)}}for(let g=0;g<c;g++)for(let y=0;y<l;y++){const _=y+h*g,w=y+h*(g+1),P=y+1+h*(g+1),R=y+1+h*g;p.push(_,w,R),p.push(w,P,R)}this.setIndex(p),this.setAttribute("position",new re(x,3)),this.setAttribute("normal",new re(v,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fn(t.width,t.height,t.widthSegments,t.heightSegments)}}var Fp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,kp=`#ifdef USE_ALPHAHASH
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
#endif`,Bp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,zp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Gp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Hp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Vp=`#ifdef USE_AOMAP
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
#endif`,Wp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,$p=`#ifdef USE_BATCHING
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
#endif`,Xp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,qp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Yp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,jp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Kp=`#ifdef USE_IRIDESCENCE
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
#endif`,Zp=`#ifdef USE_BUMPMAP
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
#endif`,Jp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Qp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,tm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,em=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,nm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,im=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,sm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,rm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,om=`#define PI 3.141592653589793
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
} // validated`,am=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,lm=`vec3 transformedNormal = objectNormal;
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
#endif`,cm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,hm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,um=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,dm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,fm="gl_FragColor = linearToOutputTexel( gl_FragColor );",pm=`
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
}`,mm=`#ifdef USE_ENVMAP
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
#endif`,gm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,xm=`#ifdef USE_ENVMAP
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
#endif`,vm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,_m=`#ifdef USE_ENVMAP
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
#endif`,Mm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Sm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ym=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,wm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,bm=`#ifdef USE_GRADIENTMAP
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
}`,Em=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Tm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Am=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Cm=`uniform bool receiveShadow;
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
#endif`,Rm=`#ifdef USE_ENVMAP
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
#endif`,Pm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Im=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Lm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Dm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Um=`PhysicalMaterial material;
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
#endif`,Nm=`struct PhysicalMaterial {
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
}`,Om=`
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
#endif`,Fm=`#if defined( RE_IndirectDiffuse )
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
#endif`,km=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Bm=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,zm=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Gm=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Hm=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Vm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Wm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$m=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Xm=`#if defined( USE_POINTS_UV )
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
#endif`,qm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ym=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,jm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Km=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Zm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jm=`#ifdef USE_MORPHTARGETS
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
#endif`,Qm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,t0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,e0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,n0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,i0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,s0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,r0=`#ifdef USE_NORMALMAP
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
#endif`,o0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,a0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,l0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,c0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,h0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,u0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,d0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,f0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,p0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,m0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,g0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,x0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,v0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,_0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,M0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,S0=`float getShadowMask() {
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
}`,y0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,w0=`#ifdef USE_SKINNING
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
#endif`,b0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,E0=`#ifdef USE_SKINNING
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
#endif`,T0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,A0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,C0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,R0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,P0=`#ifdef USE_TRANSMISSION
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
#endif`,I0=`#ifdef USE_TRANSMISSION
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
#endif`,L0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,D0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,U0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,N0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const O0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,F0=`uniform sampler2D t2D;
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
}`,k0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,B0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,z0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,G0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,H0=`#include <common>
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
}`,V0=`#if DEPTH_PACKING == 3200
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
}`,W0=`#define DISTANCE
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
}`,$0=`#define DISTANCE
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
}`,X0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,q0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Y0=`uniform float scale;
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
}`,j0=`uniform vec3 diffuse;
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
}`,K0=`#include <common>
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
}`,Z0=`uniform vec3 diffuse;
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
}`,J0=`#define LAMBERT
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
}`,Q0=`#define LAMBERT
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
}`,tg=`#define MATCAP
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
}`,eg=`#define MATCAP
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
}`,ng=`#define NORMAL
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
}`,ig=`#define NORMAL
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
}`,sg=`#define PHONG
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
}`,rg=`#define PHONG
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
}`,og=`#define STANDARD
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
}`,ag=`#define STANDARD
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
}`,lg=`#define TOON
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
}`,cg=`#define TOON
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
}`,hg=`uniform float size;
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
}`,ug=`uniform vec3 diffuse;
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
}`,dg=`#include <common>
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
}`,fg=`uniform vec3 color;
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
}`,pg=`uniform float rotation;
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
}`,mg=`uniform vec3 diffuse;
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
}`,Kt={alphahash_fragment:Fp,alphahash_pars_fragment:kp,alphamap_fragment:Bp,alphamap_pars_fragment:zp,alphatest_fragment:Gp,alphatest_pars_fragment:Hp,aomap_fragment:Vp,aomap_pars_fragment:Wp,batching_pars_vertex:$p,batching_vertex:Xp,begin_vertex:qp,beginnormal_vertex:Yp,bsdfs:jp,iridescence_fragment:Kp,bumpmap_pars_fragment:Zp,clipping_planes_fragment:Jp,clipping_planes_pars_fragment:Qp,clipping_planes_pars_vertex:tm,clipping_planes_vertex:em,color_fragment:nm,color_pars_fragment:im,color_pars_vertex:sm,color_vertex:rm,common:om,cube_uv_reflection_fragment:am,defaultnormal_vertex:lm,displacementmap_pars_vertex:cm,displacementmap_vertex:hm,emissivemap_fragment:um,emissivemap_pars_fragment:dm,colorspace_fragment:fm,colorspace_pars_fragment:pm,envmap_fragment:mm,envmap_common_pars_fragment:gm,envmap_pars_fragment:xm,envmap_pars_vertex:vm,envmap_physical_pars_fragment:Rm,envmap_vertex:_m,fog_vertex:Mm,fog_pars_vertex:Sm,fog_fragment:ym,fog_pars_fragment:wm,gradientmap_pars_fragment:bm,lightmap_pars_fragment:Em,lights_lambert_fragment:Tm,lights_lambert_pars_fragment:Am,lights_pars_begin:Cm,lights_toon_fragment:Pm,lights_toon_pars_fragment:Im,lights_phong_fragment:Lm,lights_phong_pars_fragment:Dm,lights_physical_fragment:Um,lights_physical_pars_fragment:Nm,lights_fragment_begin:Om,lights_fragment_maps:Fm,lights_fragment_end:km,logdepthbuf_fragment:Bm,logdepthbuf_pars_fragment:zm,logdepthbuf_pars_vertex:Gm,logdepthbuf_vertex:Hm,map_fragment:Vm,map_pars_fragment:Wm,map_particle_fragment:$m,map_particle_pars_fragment:Xm,metalnessmap_fragment:qm,metalnessmap_pars_fragment:Ym,morphinstance_vertex:jm,morphcolor_vertex:Km,morphnormal_vertex:Zm,morphtarget_pars_vertex:Jm,morphtarget_vertex:Qm,normal_fragment_begin:t0,normal_fragment_maps:e0,normal_pars_fragment:n0,normal_pars_vertex:i0,normal_vertex:s0,normalmap_pars_fragment:r0,clearcoat_normal_fragment_begin:o0,clearcoat_normal_fragment_maps:a0,clearcoat_pars_fragment:l0,iridescence_pars_fragment:c0,opaque_fragment:h0,packing:u0,premultiplied_alpha_fragment:d0,project_vertex:f0,dithering_fragment:p0,dithering_pars_fragment:m0,roughnessmap_fragment:g0,roughnessmap_pars_fragment:x0,shadowmap_pars_fragment:v0,shadowmap_pars_vertex:_0,shadowmap_vertex:M0,shadowmask_pars_fragment:S0,skinbase_vertex:y0,skinning_pars_vertex:w0,skinning_vertex:b0,skinnormal_vertex:E0,specularmap_fragment:T0,specularmap_pars_fragment:A0,tonemapping_fragment:C0,tonemapping_pars_fragment:R0,transmission_fragment:P0,transmission_pars_fragment:I0,uv_pars_fragment:L0,uv_pars_vertex:D0,uv_vertex:U0,worldpos_vertex:N0,background_vert:O0,background_frag:F0,backgroundCube_vert:k0,backgroundCube_frag:B0,cube_vert:z0,cube_frag:G0,depth_vert:H0,depth_frag:V0,distanceRGBA_vert:W0,distanceRGBA_frag:$0,equirect_vert:X0,equirect_frag:q0,linedashed_vert:Y0,linedashed_frag:j0,meshbasic_vert:K0,meshbasic_frag:Z0,meshlambert_vert:J0,meshlambert_frag:Q0,meshmatcap_vert:tg,meshmatcap_frag:eg,meshnormal_vert:ng,meshnormal_frag:ig,meshphong_vert:sg,meshphong_frag:rg,meshphysical_vert:og,meshphysical_frag:ag,meshtoon_vert:lg,meshtoon_frag:cg,points_vert:hg,points_frag:ug,shadow_vert:dg,shadow_frag:fg,sprite_vert:pg,sprite_frag:mg},_t={common:{diffuse:{value:new Yt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Zt}},envmap:{envMap:{value:null},envMapRotation:{value:new Zt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Zt},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Yt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Yt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0},uvTransform:{value:new Zt}},sprite:{diffuse:{value:new Yt(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}}},In={basic:{uniforms:Ze([_t.common,_t.specularmap,_t.envmap,_t.aomap,_t.lightmap,_t.fog]),vertexShader:Kt.meshbasic_vert,fragmentShader:Kt.meshbasic_frag},lambert:{uniforms:Ze([_t.common,_t.specularmap,_t.envmap,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.fog,_t.lights,{emissive:{value:new Yt(0)}}]),vertexShader:Kt.meshlambert_vert,fragmentShader:Kt.meshlambert_frag},phong:{uniforms:Ze([_t.common,_t.specularmap,_t.envmap,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.fog,_t.lights,{emissive:{value:new Yt(0)},specular:{value:new Yt(1118481)},shininess:{value:30}}]),vertexShader:Kt.meshphong_vert,fragmentShader:Kt.meshphong_frag},standard:{uniforms:Ze([_t.common,_t.envmap,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.roughnessmap,_t.metalnessmap,_t.fog,_t.lights,{emissive:{value:new Yt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag},toon:{uniforms:Ze([_t.common,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.gradientmap,_t.fog,_t.lights,{emissive:{value:new Yt(0)}}]),vertexShader:Kt.meshtoon_vert,fragmentShader:Kt.meshtoon_frag},matcap:{uniforms:Ze([_t.common,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.fog,{matcap:{value:null}}]),vertexShader:Kt.meshmatcap_vert,fragmentShader:Kt.meshmatcap_frag},points:{uniforms:Ze([_t.points,_t.fog]),vertexShader:Kt.points_vert,fragmentShader:Kt.points_frag},dashed:{uniforms:Ze([_t.common,_t.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Kt.linedashed_vert,fragmentShader:Kt.linedashed_frag},depth:{uniforms:Ze([_t.common,_t.displacementmap]),vertexShader:Kt.depth_vert,fragmentShader:Kt.depth_frag},normal:{uniforms:Ze([_t.common,_t.bumpmap,_t.normalmap,_t.displacementmap,{opacity:{value:1}}]),vertexShader:Kt.meshnormal_vert,fragmentShader:Kt.meshnormal_frag},sprite:{uniforms:Ze([_t.sprite,_t.fog]),vertexShader:Kt.sprite_vert,fragmentShader:Kt.sprite_frag},background:{uniforms:{uvTransform:{value:new Zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Kt.background_vert,fragmentShader:Kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Zt}},vertexShader:Kt.backgroundCube_vert,fragmentShader:Kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Kt.cube_vert,fragmentShader:Kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Kt.equirect_vert,fragmentShader:Kt.equirect_frag},distanceRGBA:{uniforms:Ze([_t.common,_t.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Kt.distanceRGBA_vert,fragmentShader:Kt.distanceRGBA_frag},shadow:{uniforms:Ze([_t.lights,_t.fog,{color:{value:new Yt(0)},opacity:{value:1}}]),vertexShader:Kt.shadow_vert,fragmentShader:Kt.shadow_frag}};In.physical={uniforms:Ze([In.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Zt},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Zt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Zt},sheen:{value:0},sheenColor:{value:new Yt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Zt},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Zt},attenuationDistance:{value:0},attenuationColor:{value:new Yt(0)},specularColor:{value:new Yt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Zt},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Zt}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag};const kr={r:0,b:0,g:0},Ai=new Un,gg=new pe;function xg(i,t,e,n,s,o,a){const l=new Yt(0);let c=o===!0?0:1,h,u,f=null,d=0,p=null;function x(y){let _=y.isScene===!0?y.background:null;return _&&_.isTexture&&(_=(y.backgroundBlurriness>0?e:t).get(_)),_}function v(y){let _=!1;const w=x(y);w===null?g(l,c):w&&w.isColor&&(g(w,1),_=!0);const P=i.xr.getEnvironmentBlendMode();P==="additive"?n.buffers.color.setClear(0,0,0,1,a):P==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(y,_){const w=x(_);w&&(w.isCubeTexture||w.mapping===No)?(u===void 0&&(u=new zt(new se(1,1,1),new _i({name:"BackgroundCubeMaterial",uniforms:bs(In.backgroundCube.uniforms),vertexShader:In.backgroundCube.vertexShader,fragmentShader:In.backgroundCube.fragmentShader,side:rn,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(P,R,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Ai.copy(_.backgroundRotation),Ai.x*=-1,Ai.y*=-1,Ai.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Ai.y*=-1,Ai.z*=-1),u.material.uniforms.envMap.value=w,u.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(gg.makeRotationFromEuler(Ai)),u.material.toneMapped=le.getTransfer(w.colorSpace)!==xe,(f!==w||d!==w.version||p!==i.toneMapping)&&(u.material.needsUpdate=!0,f=w,d=w.version,p=i.toneMapping),u.layers.enableAll(),y.unshift(u,u.geometry,u.material,0,0,null)):w&&w.isTexture&&(h===void 0&&(h=new zt(new Fn(2,2),new _i({name:"BackgroundMaterial",uniforms:bs(In.background.uniforms),vertexShader:In.background.vertexShader,fragmentShader:In.background.fragmentShader,side:vi,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=w,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.toneMapped=le.getTransfer(w.colorSpace)!==xe,w.matrixAutoUpdate===!0&&w.updateMatrix(),h.material.uniforms.uvTransform.value.copy(w.matrix),(f!==w||d!==w.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,f=w,d=w.version,p=i.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null))}function g(y,_){y.getRGB(kr,Vu(i)),n.buffers.color.setClear(kr.r,kr.g,kr.b,_,a)}return{getClearColor:function(){return l},setClearColor:function(y,_=1){l.set(y),c=_,g(l,c)},getClearAlpha:function(){return c},setClearAlpha:function(y){c=y,g(l,c)},render:v,addToRenderList:m}}function vg(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let o=s,a=!1;function l(M,b,z,G,N){let k=!1;const I=f(G,z,b);o!==I&&(o=I,h(o.object)),k=p(M,G,z,N),k&&x(M,G,z,N),N!==null&&t.update(N,i.ELEMENT_ARRAY_BUFFER),(k||a)&&(a=!1,w(M,b,z,G),N!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(N).buffer))}function c(){return i.createVertexArray()}function h(M){return i.bindVertexArray(M)}function u(M){return i.deleteVertexArray(M)}function f(M,b,z){const G=z.wireframe===!0;let N=n[M.id];N===void 0&&(N={},n[M.id]=N);let k=N[b.id];k===void 0&&(k={},N[b.id]=k);let I=k[G];return I===void 0&&(I=d(c()),k[G]=I),I}function d(M){const b=[],z=[],G=[];for(let N=0;N<e;N++)b[N]=0,z[N]=0,G[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:b,enabledAttributes:z,attributeDivisors:G,object:M,attributes:{},index:null}}function p(M,b,z,G){const N=o.attributes,k=b.attributes;let I=0;const W=z.getAttributes();for(const B in W)if(W[B].location>=0){const et=N[B];let j=k[B];if(j===void 0&&(B==="instanceMatrix"&&M.instanceMatrix&&(j=M.instanceMatrix),B==="instanceColor"&&M.instanceColor&&(j=M.instanceColor)),et===void 0||et.attribute!==j||j&&et.data!==j.data)return!0;I++}return o.attributesNum!==I||o.index!==G}function x(M,b,z,G){const N={},k=b.attributes;let I=0;const W=z.getAttributes();for(const B in W)if(W[B].location>=0){let et=k[B];et===void 0&&(B==="instanceMatrix"&&M.instanceMatrix&&(et=M.instanceMatrix),B==="instanceColor"&&M.instanceColor&&(et=M.instanceColor));const j={};j.attribute=et,et&&et.data&&(j.data=et.data),N[B]=j,I++}o.attributes=N,o.attributesNum=I,o.index=G}function v(){const M=o.newAttributes;for(let b=0,z=M.length;b<z;b++)M[b]=0}function m(M){g(M,0)}function g(M,b){const z=o.newAttributes,G=o.enabledAttributes,N=o.attributeDivisors;z[M]=1,G[M]===0&&(i.enableVertexAttribArray(M),G[M]=1),N[M]!==b&&(i.vertexAttribDivisor(M,b),N[M]=b)}function y(){const M=o.newAttributes,b=o.enabledAttributes;for(let z=0,G=b.length;z<G;z++)b[z]!==M[z]&&(i.disableVertexAttribArray(z),b[z]=0)}function _(M,b,z,G,N,k,I){I===!0?i.vertexAttribIPointer(M,b,z,N,k):i.vertexAttribPointer(M,b,z,G,N,k)}function w(M,b,z,G){v();const N=G.attributes,k=z.getAttributes(),I=b.defaultAttributeValues;for(const W in k){const B=k[W];if(B.location>=0){let Y=N[W];if(Y===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(Y=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(Y=M.instanceColor)),Y!==void 0){const et=Y.normalized,j=Y.itemSize,xt=t.get(Y);if(xt===void 0)continue;const Pt=xt.buffer,V=xt.type,Z=xt.bytesPerElement,lt=V===i.INT||V===i.UNSIGNED_INT||Y.gpuType===oc;if(Y.isInterleavedBufferAttribute){const at=Y.data,Rt=at.stride,Ot=Y.offset;if(at.isInstancedInterleavedBuffer){for(let Gt=0;Gt<B.locationSize;Gt++)g(B.location+Gt,at.meshPerAttribute);M.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let Gt=0;Gt<B.locationSize;Gt++)m(B.location+Gt);i.bindBuffer(i.ARRAY_BUFFER,Pt);for(let Gt=0;Gt<B.locationSize;Gt++)_(B.location+Gt,j/B.locationSize,V,et,Rt*Z,(Ot+j/B.locationSize*Gt)*Z,lt)}else{if(Y.isInstancedBufferAttribute){for(let at=0;at<B.locationSize;at++)g(B.location+at,Y.meshPerAttribute);M.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let at=0;at<B.locationSize;at++)m(B.location+at);i.bindBuffer(i.ARRAY_BUFFER,Pt);for(let at=0;at<B.locationSize;at++)_(B.location+at,j/B.locationSize,V,et,j*Z,j/B.locationSize*at*Z,lt)}}else if(I!==void 0){const et=I[W];if(et!==void 0)switch(et.length){case 2:i.vertexAttrib2fv(B.location,et);break;case 3:i.vertexAttrib3fv(B.location,et);break;case 4:i.vertexAttrib4fv(B.location,et);break;default:i.vertexAttrib1fv(B.location,et)}}}}y()}function P(){D();for(const M in n){const b=n[M];for(const z in b){const G=b[z];for(const N in G)u(G[N].object),delete G[N];delete b[z]}delete n[M]}}function R(M){if(n[M.id]===void 0)return;const b=n[M.id];for(const z in b){const G=b[z];for(const N in G)u(G[N].object),delete G[N];delete b[z]}delete n[M.id]}function A(M){for(const b in n){const z=n[b];if(z[M.id]===void 0)continue;const G=z[M.id];for(const N in G)u(G[N].object),delete G[N];delete z[M.id]}}function D(){K(),a=!0,o!==s&&(o=s,h(o.object))}function K(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:l,reset:D,resetDefaultState:K,dispose:P,releaseStatesOfGeometry:R,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:m,disableUnusedAttributes:y}}function _g(i,t,e){let n;function s(h){n=h}function o(h,u){i.drawArrays(n,h,u),e.update(u,n,1)}function a(h,u,f){f!==0&&(i.drawArraysInstanced(n,h,u,f),e.update(u,n,f))}function l(h,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,h,0,u,0,f);let p=0;for(let x=0;x<f;x++)p+=u[x];e.update(p,n,1)}function c(h,u,f,d){if(f===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let x=0;x<h.length;x++)a(h[x],u[x],d[x]);else{p.multiDrawArraysInstancedWEBGL(n,h,0,u,0,d,0,f);let x=0;for(let v=0;v<f;v++)x+=u[v];for(let v=0;v<d.length;v++)e.update(x,n,d[v])}}this.setMode=s,this.render=o,this.renderInstances=a,this.renderMultiDraw=l,this.renderMultiDrawInstances=c}function Mg(i,t,e,n){let s;function o(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==Cn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function l(A){const D=A===or&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Jn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==jn&&!D)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=e.precision!==void 0?e.precision:"highp";const u=c(h);u!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",u,"instead."),h=u);const f=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control");if(d===!0){const A=t.get("EXT_clip_control");A.clipControlEXT(A.LOWER_LEFT_EXT,A.ZERO_TO_ONE_EXT)}const p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),g=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),_=i.getParameter(i.MAX_VARYING_VECTORS),w=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),P=x>0,R=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:l,precision:h,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:p,maxVertexTextures:x,maxTextureSize:v,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:y,maxVaryings:_,maxFragmentUniforms:w,vertexTextures:P,maxSamples:R}}function Sg(i){const t=this;let e=null,n=0,s=!1,o=!1;const a=new Xn,l=new Zt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const p=f.length!==0||d||n!==0||s;return s=d,n=f.length,p},this.beginShadows=function(){o=!0,u(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(f,d){e=u(f,d,0)},this.setState=function(f,d,p){const x=f.clippingPlanes,v=f.clipIntersection,m=f.clipShadows,g=i.get(f);if(!s||x===null||x.length===0||o&&!m)o?u(null):h();else{const y=o?0:n,_=y*4;let w=g.clippingState||null;c.value=w,w=u(x,d,_,p);for(let P=0;P!==_;++P)w[P]=e[P];g.clippingState=w,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=y}};function h(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(f,d,p,x){const v=f!==null?f.length:0;let m=null;if(v!==0){if(m=c.value,x!==!0||m===null){const g=p+v*4,y=d.matrixWorldInverse;l.getNormalMatrix(y),(m===null||m.length<g)&&(m=new Float32Array(g));for(let _=0,w=p;_!==v;++_,w+=4)a.copy(f[_]).applyMatrix4(y,l),a.normal.toArray(m,w),m[w+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function yg(i){let t=new WeakMap;function e(a,l){return l===al?a.mapping=Ms:l===ll&&(a.mapping=Ss),a}function n(a){if(a&&a.isTexture){const l=a.mapping;if(l===al||l===ll)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const h=new Dp(c.height);return h.fromEquirectangularTexture(i,a),t.set(a,h),a.addEventListener("dispose",s),e(h.texture,a.mapping)}else return null}}return a}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap}return{get:n,dispose:o}}class qu extends Wu{constructor(t=-1,e=1,n=1,s=-1,o=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=o,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,o,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let o=n-t,a=n+t,l=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=h*this.view.offsetX,a=o+h*this.view.width,l-=u*this.view.offsetY,c=l-u*this.view.height}this.projectionMatrix.makeOrthographic(o,a,l,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const ls=4,vh=[.125,.215,.35,.446,.526,.582],Di=20,_a=new qu,_h=new Yt;let Ma=null,Sa=0,ya=0,wa=!1;const Pi=(1+Math.sqrt(5))/2,rs=1/Pi,Mh=[new L(-Pi,rs,0),new L(Pi,rs,0),new L(-rs,0,Pi),new L(rs,0,Pi),new L(0,Pi,-rs),new L(0,Pi,rs),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)];class Sh{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Ma=this._renderer.getRenderTarget(),Sa=this._renderer.getActiveCubeFace(),ya=this._renderer.getActiveMipmapLevel(),wa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(t,n,s,o),e>0&&this._blur(o,0,0,e),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=bh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=wh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ma,Sa,ya),this._renderer.xr.enabled=wa,t.scissorTest=!1,Br(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ms||t.mapping===Ss?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ma=this._renderer.getRenderTarget(),Sa=this._renderer.getActiveCubeFace(),ya=this._renderer.getActiveMipmapLevel(),wa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Tn,minFilter:Tn,generateMipmaps:!1,type:or,format:Cn,colorSpace:Si,depthBuffer:!1},s=yh(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=yh(t,e,n);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=wg(o)),this._blurMaterial=bg(o,t,e)}return s}_compileMaterial(t){const e=new zt(this._lodPlanes[0],t);this._renderer.compile(e,_a)}_sceneToCubeUV(t,e,n,s){const l=new vn(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(_h),u.toneMapping=mi,u.autoClear=!1;const p=new Oe({name:"PMREM.Background",side:rn,depthWrite:!1,depthTest:!1}),x=new zt(new se,p);let v=!1;const m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,v=!0):(p.color.copy(_h),v=!0);for(let g=0;g<6;g++){const y=g%3;y===0?(l.up.set(0,c[g],0),l.lookAt(h[g],0,0)):y===1?(l.up.set(0,0,c[g]),l.lookAt(0,h[g],0)):(l.up.set(0,c[g],0),l.lookAt(0,0,h[g]));const _=this._cubeSize;Br(s,y*_,g>2?_:0,_,_),u.setRenderTarget(s),v&&u.render(x,l),u.render(t,l)}x.geometry.dispose(),x.material.dispose(),u.toneMapping=d,u.autoClear=f,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Ms||t.mapping===Ss;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=bh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=wh());const o=s?this._cubemapMaterial:this._equirectMaterial,a=new zt(this._lodPlanes[0],o),l=o.uniforms;l.envMap.value=t;const c=this._cubeSize;Br(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,_a)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let o=1;o<s;o++){const a=Math.sqrt(this._sigmas[o]*this._sigmas[o]-this._sigmas[o-1]*this._sigmas[o-1]),l=Mh[(s-o-1)%Mh.length];this._blur(t,o-1,o,a,l)}e.autoClear=n}_blur(t,e,n,s,o){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",o),this._halfBlur(a,t,n,n,s,"longitudinal",o)}_halfBlur(t,e,n,s,o,a,l){const c=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new zt(this._lodPlanes[s],h),d=h.uniforms,p=this._sizeLods[n]-1,x=isFinite(o)?Math.PI/(2*p):2*Math.PI/(2*Di-1),v=o/x,m=isFinite(o)?1+Math.floor(u*v):Di;m>Di&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Di}`);const g=[];let y=0;for(let A=0;A<Di;++A){const D=A/v,K=Math.exp(-D*D/2);g.push(K),A===0?y+=K:A<m&&(y+=2*K)}for(let A=0;A<g.length;A++)g[A]=g[A]/y;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=g,d.latitudinal.value=a==="latitudinal",l&&(d.poleAxis.value=l);const{_lodMax:_}=this;d.dTheta.value=x,d.mipInt.value=_-n;const w=this._sizeLods[s],P=3*w*(s>_-ls?s-_+ls:0),R=4*(this._cubeSize-w);Br(e,P,R,3*w,2*w),c.setRenderTarget(e),c.render(f,_a)}}function wg(i){const t=[],e=[],n=[];let s=i;const o=i-ls+1+vh.length;for(let a=0;a<o;a++){const l=Math.pow(2,s);e.push(l);let c=1/l;a>i-ls?c=vh[a-i+ls-1]:a===0&&(c=0),n.push(c);const h=1/(l-2),u=-h,f=1+h,d=[u,u,f,u,f,f,u,u,f,f,u,f],p=6,x=6,v=3,m=2,g=1,y=new Float32Array(v*x*p),_=new Float32Array(m*x*p),w=new Float32Array(g*x*p);for(let R=0;R<p;R++){const A=R%3*2/3-1,D=R>2?0:-1,K=[A,D,0,A+2/3,D,0,A+2/3,D+1,0,A,D,0,A+2/3,D+1,0,A,D+1,0];y.set(K,v*x*R),_.set(d,m*x*R);const M=[R,R,R,R,R,R];w.set(M,g*x*R)}const P=new Te;P.setAttribute("position",new on(y,v)),P.setAttribute("uv",new on(_,m)),P.setAttribute("faceIndex",new on(w,g)),t.push(P),s>ls&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function yh(i,t,e){const n=new Bi(i,t,e);return n.texture.mapping=No,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Br(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function bg(i,t,e){const n=new Float32Array(Di),s=new L(0,1,0);return new _i({name:"SphericalGaussianBlur",defines:{n:Di,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:mc(),fragmentShader:`

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
		`,blending:pi,depthTest:!1,depthWrite:!1})}function wh(){return new _i({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:mc(),fragmentShader:`

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
		`,blending:pi,depthTest:!1,depthWrite:!1})}function bh(){return new _i({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:mc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:pi,depthTest:!1,depthWrite:!1})}function mc(){return`

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
	`}function Eg(i){let t=new WeakMap,e=null;function n(l){if(l&&l.isTexture){const c=l.mapping,h=c===al||c===ll,u=c===Ms||c===Ss;if(h||u){let f=t.get(l);const d=f!==void 0?f.texture.pmremVersion:0;if(l.isRenderTargetTexture&&l.pmremVersion!==d)return e===null&&(e=new Sh(i)),f=h?e.fromEquirectangular(l,f):e.fromCubemap(l,f),f.texture.pmremVersion=l.pmremVersion,t.set(l,f),f.texture;if(f!==void 0)return f.texture;{const p=l.image;return h&&p&&p.height>0||u&&p&&s(p)?(e===null&&(e=new Sh(i)),f=h?e.fromEquirectangular(l):e.fromCubemap(l),f.texture.pmremVersion=l.pmremVersion,t.set(l,f),l.addEventListener("dispose",o),f.texture):null}}}return l}function s(l){let c=0;const h=6;for(let u=0;u<h;u++)l[u]!==void 0&&c++;return c===h}function o(l){const c=l.target;c.removeEventListener("dispose",o);const h=t.get(c);h!==void 0&&(t.delete(c),h.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Tg(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&co("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Ag(i,t,e,n){const s={},o=new WeakMap;function a(f){const d=f.target;d.index!==null&&t.remove(d.index);for(const x in d.attributes)t.remove(d.attributes[x]);for(const x in d.morphAttributes){const v=d.morphAttributes[x];for(let m=0,g=v.length;m<g;m++)t.remove(v[m])}d.removeEventListener("dispose",a),delete s[d.id];const p=o.get(d);p&&(t.remove(p),o.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function l(f,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function c(f){const d=f.attributes;for(const x in d)t.update(d[x],i.ARRAY_BUFFER);const p=f.morphAttributes;for(const x in p){const v=p[x];for(let m=0,g=v.length;m<g;m++)t.update(v[m],i.ARRAY_BUFFER)}}function h(f){const d=[],p=f.index,x=f.attributes.position;let v=0;if(p!==null){const y=p.array;v=p.version;for(let _=0,w=y.length;_<w;_+=3){const P=y[_+0],R=y[_+1],A=y[_+2];d.push(P,R,R,A,A,P)}}else if(x!==void 0){const y=x.array;v=x.version;for(let _=0,w=y.length/3-1;_<w;_+=3){const P=_+0,R=_+1,A=_+2;d.push(P,R,R,A,A,P)}}else return;const m=new(Fu(d)?Hu:Gu)(d,1);m.version=v;const g=o.get(f);g&&t.remove(g),o.set(f,m)}function u(f){const d=o.get(f);if(d){const p=f.index;p!==null&&d.version<p.version&&h(f)}else h(f);return o.get(f)}return{get:l,update:c,getWireframeAttribute:u}}function Cg(i,t,e){let n;function s(d){n=d}let o,a;function l(d){o=d.type,a=d.bytesPerElement}function c(d,p){i.drawElements(n,p,o,d*a),e.update(p,n,1)}function h(d,p,x){x!==0&&(i.drawElementsInstanced(n,p,o,d*a,x),e.update(p,n,x))}function u(d,p,x){if(x===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,o,d,0,x);let m=0;for(let g=0;g<x;g++)m+=p[g];e.update(m,n,1)}function f(d,p,x,v){if(x===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<d.length;g++)h(d[g]/a,p[g],v[g]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,o,d,0,v,0,x);let g=0;for(let y=0;y<x;y++)g+=p[y];for(let y=0;y<v.length;y++)e.update(g,n,v[y])}}this.setMode=s,this.setIndex=l,this.render=c,this.renderInstances=h,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function Rg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(o,a,l){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=l*(o/3);break;case i.LINES:e.lines+=l*(o/2);break;case i.LINE_STRIP:e.lines+=l*(o-1);break;case i.LINE_LOOP:e.lines+=l*o;break;case i.POINTS:e.points+=l*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Pg(i,t,e){const n=new WeakMap,s=new Ee;function o(a,l,c){const h=a.morphTargetInfluences,u=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,f=u!==void 0?u.length:0;let d=n.get(l);if(d===void 0||d.count!==f){let M=function(){D.dispose(),n.delete(l),l.removeEventListener("dispose",M)};var p=M;d!==void 0&&d.texture.dispose();const x=l.morphAttributes.position!==void 0,v=l.morphAttributes.normal!==void 0,m=l.morphAttributes.color!==void 0,g=l.morphAttributes.position||[],y=l.morphAttributes.normal||[],_=l.morphAttributes.color||[];let w=0;x===!0&&(w=1),v===!0&&(w=2),m===!0&&(w=3);let P=l.attributes.position.count*w,R=1;P>t.maxTextureSize&&(R=Math.ceil(P/t.maxTextureSize),P=t.maxTextureSize);const A=new Float32Array(P*R*4*f),D=new Bu(A,P,R,f);D.type=jn,D.needsUpdate=!0;const K=w*4;for(let b=0;b<f;b++){const z=g[b],G=y[b],N=_[b],k=P*R*4*b;for(let I=0;I<z.count;I++){const W=I*K;x===!0&&(s.fromBufferAttribute(z,I),A[k+W+0]=s.x,A[k+W+1]=s.y,A[k+W+2]=s.z,A[k+W+3]=0),v===!0&&(s.fromBufferAttribute(G,I),A[k+W+4]=s.x,A[k+W+5]=s.y,A[k+W+6]=s.z,A[k+W+7]=0),m===!0&&(s.fromBufferAttribute(N,I),A[k+W+8]=s.x,A[k+W+9]=s.y,A[k+W+10]=s.z,A[k+W+11]=N.itemSize===4?s.w:1)}}d={count:f,texture:D,size:new ht(P,R)},n.set(l,d),l.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let x=0;for(let m=0;m<h.length;m++)x+=h[m];const v=l.morphTargetsRelative?1:1-x;c.getUniforms().setValue(i,"morphTargetBaseInfluence",v),c.getUniforms().setValue(i,"morphTargetInfluences",h)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:o}}function Ig(i,t,e,n){let s=new WeakMap;function o(c){const h=n.render.frame,u=c.geometry,f=t.get(c,u);if(s.get(f)!==h&&(t.update(f),s.set(f,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==h&&(d.update(),s.set(d,h))}return f}function a(){s=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}class Yu extends Qe{constructor(t,e,n,s,o,a,l,c,h,u=ds){if(u!==ds&&u!==ws)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===ds&&(n=ki),n===void 0&&u===ws&&(n=ys),super(null,s,o,a,l,c,u,n,h),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=l!==void 0?l:Je,this.minFilter=c!==void 0?c:Je,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const ju=new Qe,Eh=new Yu(1,1),Ku=new Bu,Zu=new xp,Ju=new $u,Th=[],Ah=[],Ch=new Float32Array(16),Rh=new Float32Array(9),Ph=new Float32Array(4);function Ps(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let o=Th[s];if(o===void 0&&(o=new Float32Array(s),Th[s]=o),t!==0){n.toArray(o,0);for(let a=1,l=0;a!==t;++a)l+=e,i[a].toArray(o,l)}return o}function ze(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ge(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function ko(i,t){let e=Ah[t];e===void 0&&(e=new Int32Array(t),Ah[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Lg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Dg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ze(e,t))return;i.uniform2fv(this.addr,t),Ge(e,t)}}function Ug(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ze(e,t))return;i.uniform3fv(this.addr,t),Ge(e,t)}}function Ng(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ze(e,t))return;i.uniform4fv(this.addr,t),Ge(e,t)}}function Og(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ze(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ge(e,t)}else{if(ze(e,n))return;Ph.set(n),i.uniformMatrix2fv(this.addr,!1,Ph),Ge(e,n)}}function Fg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ze(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ge(e,t)}else{if(ze(e,n))return;Rh.set(n),i.uniformMatrix3fv(this.addr,!1,Rh),Ge(e,n)}}function kg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ze(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ge(e,t)}else{if(ze(e,n))return;Ch.set(n),i.uniformMatrix4fv(this.addr,!1,Ch),Ge(e,n)}}function Bg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function zg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ze(e,t))return;i.uniform2iv(this.addr,t),Ge(e,t)}}function Gg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ze(e,t))return;i.uniform3iv(this.addr,t),Ge(e,t)}}function Hg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ze(e,t))return;i.uniform4iv(this.addr,t),Ge(e,t)}}function Vg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Wg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ze(e,t))return;i.uniform2uiv(this.addr,t),Ge(e,t)}}function $g(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ze(e,t))return;i.uniform3uiv(this.addr,t),Ge(e,t)}}function Xg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ze(e,t))return;i.uniform4uiv(this.addr,t),Ge(e,t)}}function qg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let o;this.type===i.SAMPLER_2D_SHADOW?(Eh.compareFunction=Ou,o=Eh):o=ju,e.setTexture2D(t||o,s)}function Yg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Zu,s)}function jg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Ju,s)}function Kg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Ku,s)}function Zg(i){switch(i){case 5126:return Lg;case 35664:return Dg;case 35665:return Ug;case 35666:return Ng;case 35674:return Og;case 35675:return Fg;case 35676:return kg;case 5124:case 35670:return Bg;case 35667:case 35671:return zg;case 35668:case 35672:return Gg;case 35669:case 35673:return Hg;case 5125:return Vg;case 36294:return Wg;case 36295:return $g;case 36296:return Xg;case 35678:case 36198:case 36298:case 36306:case 35682:return qg;case 35679:case 36299:case 36307:return Yg;case 35680:case 36300:case 36308:case 36293:return jg;case 36289:case 36303:case 36311:case 36292:return Kg}}function Jg(i,t){i.uniform1fv(this.addr,t)}function Qg(i,t){const e=Ps(t,this.size,2);i.uniform2fv(this.addr,e)}function tx(i,t){const e=Ps(t,this.size,3);i.uniform3fv(this.addr,e)}function ex(i,t){const e=Ps(t,this.size,4);i.uniform4fv(this.addr,e)}function nx(i,t){const e=Ps(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function ix(i,t){const e=Ps(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function sx(i,t){const e=Ps(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function rx(i,t){i.uniform1iv(this.addr,t)}function ox(i,t){i.uniform2iv(this.addr,t)}function ax(i,t){i.uniform3iv(this.addr,t)}function lx(i,t){i.uniform4iv(this.addr,t)}function cx(i,t){i.uniform1uiv(this.addr,t)}function hx(i,t){i.uniform2uiv(this.addr,t)}function ux(i,t){i.uniform3uiv(this.addr,t)}function dx(i,t){i.uniform4uiv(this.addr,t)}function fx(i,t,e){const n=this.cache,s=t.length,o=ko(e,s);ze(n,o)||(i.uniform1iv(this.addr,o),Ge(n,o));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||ju,o[a])}function px(i,t,e){const n=this.cache,s=t.length,o=ko(e,s);ze(n,o)||(i.uniform1iv(this.addr,o),Ge(n,o));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Zu,o[a])}function mx(i,t,e){const n=this.cache,s=t.length,o=ko(e,s);ze(n,o)||(i.uniform1iv(this.addr,o),Ge(n,o));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Ju,o[a])}function gx(i,t,e){const n=this.cache,s=t.length,o=ko(e,s);ze(n,o)||(i.uniform1iv(this.addr,o),Ge(n,o));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Ku,o[a])}function xx(i){switch(i){case 5126:return Jg;case 35664:return Qg;case 35665:return tx;case 35666:return ex;case 35674:return nx;case 35675:return ix;case 35676:return sx;case 5124:case 35670:return rx;case 35667:case 35671:return ox;case 35668:case 35672:return ax;case 35669:case 35673:return lx;case 5125:return cx;case 36294:return hx;case 36295:return ux;case 36296:return dx;case 35678:case 36198:case 36298:case 36306:case 35682:return fx;case 35679:case 36299:case 36307:return px;case 35680:case 36300:case 36308:case 36293:return mx;case 36289:case 36303:case 36311:case 36292:return gx}}class vx{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Zg(e.type)}}class _x{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=xx(e.type)}}class Mx{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let o=0,a=s.length;o!==a;++o){const l=s[o];l.setValue(t,e[l.id],n)}}}const ba=/(\w+)(\])?(\[|\.)?/g;function Ih(i,t){i.seq.push(t),i.map[t.id]=t}function Sx(i,t,e){const n=i.name,s=n.length;for(ba.lastIndex=0;;){const o=ba.exec(n),a=ba.lastIndex;let l=o[1];const c=o[2]==="]",h=o[3];if(c&&(l=l|0),h===void 0||h==="["&&a+2===s){Ih(e,h===void 0?new vx(l,i,t):new _x(l,i,t));break}else{let f=e.map[l];f===void 0&&(f=new Mx(l),Ih(e,f)),e=f}}}class ho{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const o=t.getActiveUniform(e,s),a=t.getUniformLocation(e,o.name);Sx(o,a,this)}}setValue(t,e,n,s){const o=this.map[e];o!==void 0&&o.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let o=0,a=e.length;o!==a;++o){const l=e[o],c=n[l.id];c.needsUpdate!==!1&&l.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,o=t.length;s!==o;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function Lh(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const yx=37297;let wx=0;function bx(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let a=s;a<o;a++){const l=a+1;n.push(`${l===t?">":" "} ${l}: ${e[a]}`)}return n.join(`
`)}function Ex(i){const t=le.getPrimaries(le.workingColorSpace),e=le.getPrimaries(i);let n;switch(t===e?n="":t===Mo&&e===_o?n="LinearDisplayP3ToLinearSRGB":t===_o&&e===Mo&&(n="LinearSRGBToLinearDisplayP3"),i){case Si:case Oo:return[n,"LinearTransferOETF"];case En:case dc:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function Dh(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+s+`

`+bx(i.getShaderSource(t),a)}else return s}function Tx(i,t){const e=Ex(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Ax(i,t){let e;switch(t){case Vf:e="Linear";break;case Wf:e="Reinhard";break;case $f:e="Cineon";break;case Xf:e="ACESFilmic";break;case Yf:e="AgX";break;case jf:e="Neutral";break;case qf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const zr=new L;function Cx(){le.getLuminanceCoefficients(zr);const i=zr.x.toFixed(4),t=zr.y.toFixed(4),e=zr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Rx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Hs).join(`
`)}function Px(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Ix(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const o=i.getActiveAttrib(t,s),a=o.name;let l=1;o.type===i.FLOAT_MAT2&&(l=2),o.type===i.FLOAT_MAT3&&(l=3),o.type===i.FLOAT_MAT4&&(l=4),e[a]={type:o.type,location:i.getAttribLocation(t,a),locationSize:l}}return e}function Hs(i){return i!==""}function Uh(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Nh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Lx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Fl(i){return i.replace(Lx,Ux)}const Dx=new Map;function Ux(i,t){let e=Kt[t];if(e===void 0){const n=Dx.get(t);if(n!==void 0)e=Kt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Fl(e)}const Nx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Oh(i){return i.replace(Nx,Ox)}function Ox(i,t,e,n){let s="";for(let o=parseInt(t);o<parseInt(e);o++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return s}function Fh(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Fx(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===wu?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===yf?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===$n&&(t="SHADOWMAP_TYPE_VSM"),t}function kx(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ms:case Ss:t="ENVMAP_TYPE_CUBE";break;case No:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Bx(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ss:t="ENVMAP_MODE_REFRACTION";break}return t}function zx(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case rc:t="ENVMAP_BLENDING_MULTIPLY";break;case Gf:t="ENVMAP_BLENDING_MIX";break;case Hf:t="ENVMAP_BLENDING_ADD";break}return t}function Gx(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Hx(i,t,e,n){const s=i.getContext(),o=e.defines;let a=e.vertexShader,l=e.fragmentShader;const c=Fx(e),h=kx(e),u=Bx(e),f=zx(e),d=Gx(e),p=Rx(e),x=Px(o),v=s.createProgram();let m,g,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(Hs).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(Hs).join(`
`),g.length>0&&(g+=`
`)):(m=[Fh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Hs).join(`
`),g=[Fh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==mi?"#define TONE_MAPPING":"",e.toneMapping!==mi?Kt.tonemapping_pars_fragment:"",e.toneMapping!==mi?Ax("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Kt.colorspace_pars_fragment,Tx("linearToOutputTexel",e.outputColorSpace),Cx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Hs).join(`
`)),a=Fl(a),a=Uh(a,e),a=Nh(a,e),l=Fl(l),l=Uh(l,e),l=Nh(l,e),a=Oh(a),l=Oh(l),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",e.glslVersion===th?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===th?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const _=y+m+a,w=y+g+l,P=Lh(s,s.VERTEX_SHADER,_),R=Lh(s,s.FRAGMENT_SHADER,w);s.attachShader(v,P),s.attachShader(v,R),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function A(b){if(i.debug.checkShaderErrors){const z=s.getProgramInfoLog(v).trim(),G=s.getShaderInfoLog(P).trim(),N=s.getShaderInfoLog(R).trim();let k=!0,I=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(k=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,P,R);else{const W=Dh(s,P,"vertex"),B=Dh(s,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+b.name+`
Material Type: `+b.type+`

Program Info Log: `+z+`
`+W+`
`+B)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(G===""||N==="")&&(I=!1);I&&(b.diagnostics={runnable:k,programLog:z,vertexShader:{log:G,prefix:m},fragmentShader:{log:N,prefix:g}})}s.deleteShader(P),s.deleteShader(R),D=new ho(s,v),K=Ix(s,v)}let D;this.getUniforms=function(){return D===void 0&&A(this),D};let K;this.getAttributes=function(){return K===void 0&&A(this),K};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(v,yx)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=wx++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=P,this.fragmentShader=R,this}let Vx=0;class Wx{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),o=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(o)===!1&&(a.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new $x(t),e.set(t,n)),n}}class $x{constructor(t){this.id=Vx++,this.code=t,this.usedTimes=0}}function Xx(i,t,e,n,s,o,a){const l=new fc,c=new Wx,h=new Set,u=[],f=s.logarithmicDepthBuffer,d=s.reverseDepthBuffer,p=s.vertexTextures;let x=s.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(M){return h.add(M),M===0?"uv":`uv${M}`}function g(M,b,z,G,N){const k=G.fog,I=N.geometry,W=M.isMeshStandardMaterial?G.environment:null,B=(M.isMeshStandardMaterial?e:t).get(M.envMap||W),Y=B&&B.mapping===No?B.image.height:null,et=v[M.type];M.precision!==null&&(x=s.getMaxPrecision(M.precision),x!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",x,"instead."));const j=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,xt=j!==void 0?j.length:0;let Pt=0;I.morphAttributes.position!==void 0&&(Pt=1),I.morphAttributes.normal!==void 0&&(Pt=2),I.morphAttributes.color!==void 0&&(Pt=3);let V,Z,lt,at;if(et){const en=In[et];V=en.vertexShader,Z=en.fragmentShader}else V=M.vertexShader,Z=M.fragmentShader,c.update(M),lt=c.getVertexShaderID(M),at=c.getFragmentShaderID(M);const Rt=i.getRenderTarget(),Ot=N.isInstancedMesh===!0,Gt=N.isBatchedMesh===!0,Xt=!!M.map,J=!!M.matcap,C=!!B,pt=!!M.aoMap,ft=!!M.lightMap,ct=!!M.bumpMap,mt=!!M.normalMap,kt=!!M.displacementMap,wt=!!M.emissiveMap,T=!!M.metalnessMap,S=!!M.roughnessMap,H=M.anisotropy>0,Q=M.clearcoat>0,st=M.dispersion>0,tt=M.iridescence>0,Ut=M.sheen>0,vt=M.transmission>0,Tt=H&&!!M.anisotropyMap,Qt=Q&&!!M.clearcoatMap,ut=Q&&!!M.clearcoatNormalMap,At=Q&&!!M.clearcoatRoughnessMap,Wt=tt&&!!M.iridescenceMap,$t=tt&&!!M.iridescenceThicknessMap,Ct=Ut&&!!M.sheenColorMap,te=Ut&&!!M.sheenRoughnessMap,qt=!!M.specularMap,me=!!M.specularColorMap,U=!!M.specularIntensityMap,bt=vt&&!!M.transmissionMap,q=vt&&!!M.thicknessMap,rt=!!M.gradientMap,St=!!M.alphaMap,Et=M.alphaTest>0,ee=!!M.alphaHash,Pe=!!M.extensions;let tn=mi;M.toneMapped&&(Rt===null||Rt.isXRRenderTarget===!0)&&(tn=i.toneMapping);const ie={shaderID:et,shaderType:M.type,shaderName:M.name,vertexShader:V,fragmentShader:Z,defines:M.defines,customVertexShaderID:lt,customFragmentShaderID:at,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:x,batching:Gt,batchingColor:Gt&&N._colorsTexture!==null,instancing:Ot,instancingColor:Ot&&N.instanceColor!==null,instancingMorph:Ot&&N.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:Rt===null?i.outputColorSpace:Rt.isXRRenderTarget===!0?Rt.texture.colorSpace:Si,alphaToCoverage:!!M.alphaToCoverage,map:Xt,matcap:J,envMap:C,envMapMode:C&&B.mapping,envMapCubeUVHeight:Y,aoMap:pt,lightMap:ft,bumpMap:ct,normalMap:mt,displacementMap:p&&kt,emissiveMap:wt,normalMapObjectSpace:mt&&M.normalMapType===Qf,normalMapTangentSpace:mt&&M.normalMapType===Nu,metalnessMap:T,roughnessMap:S,anisotropy:H,anisotropyMap:Tt,clearcoat:Q,clearcoatMap:Qt,clearcoatNormalMap:ut,clearcoatRoughnessMap:At,dispersion:st,iridescence:tt,iridescenceMap:Wt,iridescenceThicknessMap:$t,sheen:Ut,sheenColorMap:Ct,sheenRoughnessMap:te,specularMap:qt,specularColorMap:me,specularIntensityMap:U,transmission:vt,transmissionMap:bt,thicknessMap:q,gradientMap:rt,opaque:M.transparent===!1&&M.blending===us&&M.alphaToCoverage===!1,alphaMap:St,alphaTest:Et,alphaHash:ee,combine:M.combine,mapUv:Xt&&m(M.map.channel),aoMapUv:pt&&m(M.aoMap.channel),lightMapUv:ft&&m(M.lightMap.channel),bumpMapUv:ct&&m(M.bumpMap.channel),normalMapUv:mt&&m(M.normalMap.channel),displacementMapUv:kt&&m(M.displacementMap.channel),emissiveMapUv:wt&&m(M.emissiveMap.channel),metalnessMapUv:T&&m(M.metalnessMap.channel),roughnessMapUv:S&&m(M.roughnessMap.channel),anisotropyMapUv:Tt&&m(M.anisotropyMap.channel),clearcoatMapUv:Qt&&m(M.clearcoatMap.channel),clearcoatNormalMapUv:ut&&m(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:At&&m(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Wt&&m(M.iridescenceMap.channel),iridescenceThicknessMapUv:$t&&m(M.iridescenceThicknessMap.channel),sheenColorMapUv:Ct&&m(M.sheenColorMap.channel),sheenRoughnessMapUv:te&&m(M.sheenRoughnessMap.channel),specularMapUv:qt&&m(M.specularMap.channel),specularColorMapUv:me&&m(M.specularColorMap.channel),specularIntensityMapUv:U&&m(M.specularIntensityMap.channel),transmissionMapUv:bt&&m(M.transmissionMap.channel),thicknessMapUv:q&&m(M.thicknessMap.channel),alphaMapUv:St&&m(M.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(mt||H),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!I.attributes.uv&&(Xt||St),fog:!!k,useFog:M.fog===!0,fogExp2:!!k&&k.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:d,skinning:N.isSkinnedMesh===!0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:xt,morphTextureStride:Pt,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&z.length>0,shadowMapType:i.shadowMap.type,toneMapping:tn,decodeVideoTexture:Xt&&M.map.isVideoTexture===!0&&le.getTransfer(M.map.colorSpace)===xe,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Yn,flipSided:M.side===rn,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Pe&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Pe&&M.extensions.multiDraw===!0||Gt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return ie.vertexUv1s=h.has(1),ie.vertexUv2s=h.has(2),ie.vertexUv3s=h.has(3),h.clear(),ie}function y(M){const b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(const z in M.defines)b.push(z),b.push(M.defines[z]);return M.isRawShaderMaterial===!1&&(_(b,M),w(b,M),b.push(i.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function _(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function w(M,b){l.disableAll(),b.supportsVertexTextures&&l.enable(0),b.instancing&&l.enable(1),b.instancingColor&&l.enable(2),b.instancingMorph&&l.enable(3),b.matcap&&l.enable(4),b.envMap&&l.enable(5),b.normalMapObjectSpace&&l.enable(6),b.normalMapTangentSpace&&l.enable(7),b.clearcoat&&l.enable(8),b.iridescence&&l.enable(9),b.alphaTest&&l.enable(10),b.vertexColors&&l.enable(11),b.vertexAlphas&&l.enable(12),b.vertexUv1s&&l.enable(13),b.vertexUv2s&&l.enable(14),b.vertexUv3s&&l.enable(15),b.vertexTangents&&l.enable(16),b.anisotropy&&l.enable(17),b.alphaHash&&l.enable(18),b.batching&&l.enable(19),b.dispersion&&l.enable(20),b.batchingColor&&l.enable(21),M.push(l.mask),l.disableAll(),b.fog&&l.enable(0),b.useFog&&l.enable(1),b.flatShading&&l.enable(2),b.logarithmicDepthBuffer&&l.enable(3),b.reverseDepthBuffer&&l.enable(4),b.skinning&&l.enable(5),b.morphTargets&&l.enable(6),b.morphNormals&&l.enable(7),b.morphColors&&l.enable(8),b.premultipliedAlpha&&l.enable(9),b.shadowMapEnabled&&l.enable(10),b.doubleSided&&l.enable(11),b.flipSided&&l.enable(12),b.useDepthPacking&&l.enable(13),b.dithering&&l.enable(14),b.transmission&&l.enable(15),b.sheen&&l.enable(16),b.opaque&&l.enable(17),b.pointsUvs&&l.enable(18),b.decodeVideoTexture&&l.enable(19),b.alphaToCoverage&&l.enable(20),M.push(l.mask)}function P(M){const b=v[M.type];let z;if(b){const G=In[b];z=Rp.clone(G.uniforms)}else z=M.uniforms;return z}function R(M,b){let z;for(let G=0,N=u.length;G<N;G++){const k=u[G];if(k.cacheKey===b){z=k,++z.usedTimes;break}}return z===void 0&&(z=new Hx(i,b,M,o),u.push(z)),z}function A(M){if(--M.usedTimes===0){const b=u.indexOf(M);u[b]=u[u.length-1],u.pop(),M.destroy()}}function D(M){c.remove(M)}function K(){c.dispose()}return{getParameters:g,getProgramCacheKey:y,getUniforms:P,acquireProgram:R,releaseProgram:A,releaseShaderCache:D,programs:u,dispose:K}}function qx(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let l=i.get(a);return l===void 0&&(l={},i.set(a,l)),l}function n(a){i.delete(a)}function s(a,l,c){i.get(a)[l]=c}function o(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:o}}function Yx(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function kh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Bh(){const i=[];let t=0;const e=[],n=[],s=[];function o(){t=0,e.length=0,n.length=0,s.length=0}function a(f,d,p,x,v,m){let g=i[t];return g===void 0?(g={id:f.id,object:f,geometry:d,material:p,groupOrder:x,renderOrder:f.renderOrder,z:v,group:m},i[t]=g):(g.id=f.id,g.object=f,g.geometry=d,g.material=p,g.groupOrder=x,g.renderOrder=f.renderOrder,g.z=v,g.group=m),t++,g}function l(f,d,p,x,v,m){const g=a(f,d,p,x,v,m);p.transmission>0?n.push(g):p.transparent===!0?s.push(g):e.push(g)}function c(f,d,p,x,v,m){const g=a(f,d,p,x,v,m);p.transmission>0?n.unshift(g):p.transparent===!0?s.unshift(g):e.unshift(g)}function h(f,d){e.length>1&&e.sort(f||Yx),n.length>1&&n.sort(d||kh),s.length>1&&s.sort(d||kh)}function u(){for(let f=t,d=i.length;f<d;f++){const p=i[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:o,push:l,unshift:c,finish:u,sort:h}}function jx(){let i=new WeakMap;function t(n,s){const o=i.get(n);let a;return o===void 0?(a=new Bh,i.set(n,[a])):s>=o.length?(a=new Bh,o.push(a)):a=o[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Kx(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new L,color:new Yt};break;case"SpotLight":e={position:new L,direction:new L,color:new Yt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new Yt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new Yt,groundColor:new Yt};break;case"RectAreaLight":e={color:new Yt,position:new L,halfWidth:new L,halfHeight:new L};break}return i[t.id]=e,e}}}function Zx(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Jx=0;function Qx(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function tv(i){const t=new Kx,e=Zx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)n.probe.push(new L);const s=new L,o=new pe,a=new pe;function l(h){let u=0,f=0,d=0;for(let K=0;K<9;K++)n.probe[K].set(0,0,0);let p=0,x=0,v=0,m=0,g=0,y=0,_=0,w=0,P=0,R=0,A=0;h.sort(Qx);for(let K=0,M=h.length;K<M;K++){const b=h[K],z=b.color,G=b.intensity,N=b.distance,k=b.shadow&&b.shadow.map?b.shadow.map.texture:null;if(b.isAmbientLight)u+=z.r*G,f+=z.g*G,d+=z.b*G;else if(b.isLightProbe){for(let I=0;I<9;I++)n.probe[I].addScaledVector(b.sh.coefficients[I],G);A++}else if(b.isDirectionalLight){const I=t.get(b);if(I.color.copy(b.color).multiplyScalar(b.intensity),b.castShadow){const W=b.shadow,B=e.get(b);B.shadowIntensity=W.intensity,B.shadowBias=W.bias,B.shadowNormalBias=W.normalBias,B.shadowRadius=W.radius,B.shadowMapSize=W.mapSize,n.directionalShadow[p]=B,n.directionalShadowMap[p]=k,n.directionalShadowMatrix[p]=b.shadow.matrix,y++}n.directional[p]=I,p++}else if(b.isSpotLight){const I=t.get(b);I.position.setFromMatrixPosition(b.matrixWorld),I.color.copy(z).multiplyScalar(G),I.distance=N,I.coneCos=Math.cos(b.angle),I.penumbraCos=Math.cos(b.angle*(1-b.penumbra)),I.decay=b.decay,n.spot[v]=I;const W=b.shadow;if(b.map&&(n.spotLightMap[P]=b.map,P++,W.updateMatrices(b),b.castShadow&&R++),n.spotLightMatrix[v]=W.matrix,b.castShadow){const B=e.get(b);B.shadowIntensity=W.intensity,B.shadowBias=W.bias,B.shadowNormalBias=W.normalBias,B.shadowRadius=W.radius,B.shadowMapSize=W.mapSize,n.spotShadow[v]=B,n.spotShadowMap[v]=k,w++}v++}else if(b.isRectAreaLight){const I=t.get(b);I.color.copy(z).multiplyScalar(G),I.halfWidth.set(b.width*.5,0,0),I.halfHeight.set(0,b.height*.5,0),n.rectArea[m]=I,m++}else if(b.isPointLight){const I=t.get(b);if(I.color.copy(b.color).multiplyScalar(b.intensity),I.distance=b.distance,I.decay=b.decay,b.castShadow){const W=b.shadow,B=e.get(b);B.shadowIntensity=W.intensity,B.shadowBias=W.bias,B.shadowNormalBias=W.normalBias,B.shadowRadius=W.radius,B.shadowMapSize=W.mapSize,B.shadowCameraNear=W.camera.near,B.shadowCameraFar=W.camera.far,n.pointShadow[x]=B,n.pointShadowMap[x]=k,n.pointShadowMatrix[x]=b.shadow.matrix,_++}n.point[x]=I,x++}else if(b.isHemisphereLight){const I=t.get(b);I.skyColor.copy(b.color).multiplyScalar(G),I.groundColor.copy(b.groundColor).multiplyScalar(G),n.hemi[g]=I,g++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=_t.LTC_FLOAT_1,n.rectAreaLTC2=_t.LTC_FLOAT_2):(n.rectAreaLTC1=_t.LTC_HALF_1,n.rectAreaLTC2=_t.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=f,n.ambient[2]=d;const D=n.hash;(D.directionalLength!==p||D.pointLength!==x||D.spotLength!==v||D.rectAreaLength!==m||D.hemiLength!==g||D.numDirectionalShadows!==y||D.numPointShadows!==_||D.numSpotShadows!==w||D.numSpotMaps!==P||D.numLightProbes!==A)&&(n.directional.length=p,n.spot.length=v,n.rectArea.length=m,n.point.length=x,n.hemi.length=g,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=_,n.pointShadowMap.length=_,n.spotShadow.length=w,n.spotShadowMap.length=w,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=_,n.spotLightMatrix.length=w+P-R,n.spotLightMap.length=P,n.numSpotLightShadowsWithMaps=R,n.numLightProbes=A,D.directionalLength=p,D.pointLength=x,D.spotLength=v,D.rectAreaLength=m,D.hemiLength=g,D.numDirectionalShadows=y,D.numPointShadows=_,D.numSpotShadows=w,D.numSpotMaps=P,D.numLightProbes=A,n.version=Jx++)}function c(h,u){let f=0,d=0,p=0,x=0,v=0;const m=u.matrixWorldInverse;for(let g=0,y=h.length;g<y;g++){const _=h[g];if(_.isDirectionalLight){const w=n.directional[f];w.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),f++}else if(_.isSpotLight){const w=n.spot[p];w.position.setFromMatrixPosition(_.matrixWorld),w.position.applyMatrix4(m),w.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),p++}else if(_.isRectAreaLight){const w=n.rectArea[x];w.position.setFromMatrixPosition(_.matrixWorld),w.position.applyMatrix4(m),a.identity(),o.copy(_.matrixWorld),o.premultiply(m),a.extractRotation(o),w.halfWidth.set(_.width*.5,0,0),w.halfHeight.set(0,_.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),x++}else if(_.isPointLight){const w=n.point[d];w.position.setFromMatrixPosition(_.matrixWorld),w.position.applyMatrix4(m),d++}else if(_.isHemisphereLight){const w=n.hemi[v];w.direction.setFromMatrixPosition(_.matrixWorld),w.direction.transformDirection(m),v++}}}return{setup:l,setupView:c,state:n}}function zh(i){const t=new tv(i),e=[],n=[];function s(u){h.camera=u,e.length=0,n.length=0}function o(u){e.push(u)}function a(u){n.push(u)}function l(){t.setup(e)}function c(u){t.setupView(e,u)}const h={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function ev(i){let t=new WeakMap;function e(s,o=0){const a=t.get(s);let l;return a===void 0?(l=new zh(i),t.set(s,[l])):o>=a.length?(l=new zh(i),a.push(l)):l=a[o],l}function n(){t=new WeakMap}return{get:e,dispose:n}}class nv extends Gi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Zf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class iv extends Gi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const sv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,rv=`uniform sampler2D shadow_pass;
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
}`;function ov(i,t,e){let n=new pc;const s=new ht,o=new ht,a=new Ee,l=new nv({depthPacking:Jf}),c=new iv,h={},u=e.maxTextureSize,f={[vi]:rn,[rn]:vi,[Yn]:Yn},d=new _i({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:sv,fragmentShader:rv}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const x=new Te;x.setAttribute("position",new on(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new zt(x,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=wu;let g=this.type;this.render=function(R,A,D){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||R.length===0)return;const K=i.getRenderTarget(),M=i.getActiveCubeFace(),b=i.getActiveMipmapLevel(),z=i.state;z.setBlending(pi),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const G=g!==$n&&this.type===$n,N=g===$n&&this.type!==$n;for(let k=0,I=R.length;k<I;k++){const W=R[k],B=W.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",W,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);const Y=B.getFrameExtents();if(s.multiply(Y),o.copy(B.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(o.x=Math.floor(u/Y.x),s.x=o.x*Y.x,B.mapSize.x=o.x),s.y>u&&(o.y=Math.floor(u/Y.y),s.y=o.y*Y.y,B.mapSize.y=o.y)),B.map===null||G===!0||N===!0){const j=this.type!==$n?{minFilter:Je,magFilter:Je}:{};B.map!==null&&B.map.dispose(),B.map=new Bi(s.x,s.y,j),B.map.texture.name=W.name+".shadowMap",B.camera.updateProjectionMatrix()}i.setRenderTarget(B.map),i.clear();const et=B.getViewportCount();for(let j=0;j<et;j++){const xt=B.getViewport(j);a.set(o.x*xt.x,o.y*xt.y,o.x*xt.z,o.y*xt.w),z.viewport(a),B.updateMatrices(W,j),n=B.getFrustum(),w(A,D,B.camera,W,this.type)}B.isPointLightShadow!==!0&&this.type===$n&&y(B,D),B.needsUpdate=!1}g=this.type,m.needsUpdate=!1,i.setRenderTarget(K,M,b)};function y(R,A){const D=t.update(v);d.defines.VSM_SAMPLES!==R.blurSamples&&(d.defines.VSM_SAMPLES=R.blurSamples,p.defines.VSM_SAMPLES=R.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new Bi(s.x,s.y)),d.uniforms.shadow_pass.value=R.map.texture,d.uniforms.resolution.value=R.mapSize,d.uniforms.radius.value=R.radius,i.setRenderTarget(R.mapPass),i.clear(),i.renderBufferDirect(A,null,D,d,v,null),p.uniforms.shadow_pass.value=R.mapPass.texture,p.uniforms.resolution.value=R.mapSize,p.uniforms.radius.value=R.radius,i.setRenderTarget(R.map),i.clear(),i.renderBufferDirect(A,null,D,p,v,null)}function _(R,A,D,K){let M=null;const b=D.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(b!==void 0)M=b;else if(M=D.isPointLight===!0?c:l,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const z=M.uuid,G=A.uuid;let N=h[z];N===void 0&&(N={},h[z]=N);let k=N[G];k===void 0&&(k=M.clone(),N[G]=k,A.addEventListener("dispose",P)),M=k}if(M.visible=A.visible,M.wireframe=A.wireframe,K===$n?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:f[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,D.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const z=i.properties.get(M);z.light=D}return M}function w(R,A,D,K,M){if(R.visible===!1)return;if(R.layers.test(A.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&M===$n)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,R.matrixWorld);const G=t.update(R),N=R.material;if(Array.isArray(N)){const k=G.groups;for(let I=0,W=k.length;I<W;I++){const B=k[I],Y=N[B.materialIndex];if(Y&&Y.visible){const et=_(R,Y,K,M);R.onBeforeShadow(i,R,A,D,G,et,B),i.renderBufferDirect(D,null,G,et,R,B),R.onAfterShadow(i,R,A,D,G,et,B)}}}else if(N.visible){const k=_(R,N,K,M);R.onBeforeShadow(i,R,A,D,G,k,null),i.renderBufferDirect(D,null,G,k,R,null),R.onAfterShadow(i,R,A,D,G,k,null)}}const z=R.children;for(let G=0,N=z.length;G<N;G++)w(z[G],A,D,K,M)}function P(R){R.target.removeEventListener("dispose",P);for(const D in h){const K=h[D],M=R.target.uuid;M in K&&(K[M].dispose(),delete K[M])}}}const av={[tl]:el,[nl]:rl,[il]:ol,[_s]:sl,[el]:tl,[rl]:nl,[ol]:il,[sl]:_s};function lv(i){function t(){let U=!1;const bt=new Ee;let q=null;const rt=new Ee(0,0,0,0);return{setMask:function(St){q!==St&&!U&&(i.colorMask(St,St,St,St),q=St)},setLocked:function(St){U=St},setClear:function(St,Et,ee,Pe,tn){tn===!0&&(St*=Pe,Et*=Pe,ee*=Pe),bt.set(St,Et,ee,Pe),rt.equals(bt)===!1&&(i.clearColor(St,Et,ee,Pe),rt.copy(bt))},reset:function(){U=!1,q=null,rt.set(-1,0,0,0)}}}function e(){let U=!1,bt=!1,q=null,rt=null,St=null;return{setReversed:function(Et){bt=Et},setTest:function(Et){Et?lt(i.DEPTH_TEST):at(i.DEPTH_TEST)},setMask:function(Et){q!==Et&&!U&&(i.depthMask(Et),q=Et)},setFunc:function(Et){if(bt&&(Et=av[Et]),rt!==Et){switch(Et){case tl:i.depthFunc(i.NEVER);break;case el:i.depthFunc(i.ALWAYS);break;case nl:i.depthFunc(i.LESS);break;case _s:i.depthFunc(i.LEQUAL);break;case il:i.depthFunc(i.EQUAL);break;case sl:i.depthFunc(i.GEQUAL);break;case rl:i.depthFunc(i.GREATER);break;case ol:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}rt=Et}},setLocked:function(Et){U=Et},setClear:function(Et){St!==Et&&(i.clearDepth(Et),St=Et)},reset:function(){U=!1,q=null,rt=null,St=null}}}function n(){let U=!1,bt=null,q=null,rt=null,St=null,Et=null,ee=null,Pe=null,tn=null;return{setTest:function(ie){U||(ie?lt(i.STENCIL_TEST):at(i.STENCIL_TEST))},setMask:function(ie){bt!==ie&&!U&&(i.stencilMask(ie),bt=ie)},setFunc:function(ie,en,Bn){(q!==ie||rt!==en||St!==Bn)&&(i.stencilFunc(ie,en,Bn),q=ie,rt=en,St=Bn)},setOp:function(ie,en,Bn){(Et!==ie||ee!==en||Pe!==Bn)&&(i.stencilOp(ie,en,Bn),Et=ie,ee=en,Pe=Bn)},setLocked:function(ie){U=ie},setClear:function(ie){tn!==ie&&(i.clearStencil(ie),tn=ie)},reset:function(){U=!1,bt=null,q=null,rt=null,St=null,Et=null,ee=null,Pe=null,tn=null}}}const s=new t,o=new e,a=new n,l=new WeakMap,c=new WeakMap;let h={},u={},f=new WeakMap,d=[],p=null,x=!1,v=null,m=null,g=null,y=null,_=null,w=null,P=null,R=new Yt(0,0,0),A=0,D=!1,K=null,M=null,b=null,z=null,G=null;const N=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,I=0;const W=i.getParameter(i.VERSION);W.indexOf("WebGL")!==-1?(I=parseFloat(/^WebGL (\d)/.exec(W)[1]),k=I>=1):W.indexOf("OpenGL ES")!==-1&&(I=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),k=I>=2);let B=null,Y={};const et=i.getParameter(i.SCISSOR_BOX),j=i.getParameter(i.VIEWPORT),xt=new Ee().fromArray(et),Pt=new Ee().fromArray(j);function V(U,bt,q,rt){const St=new Uint8Array(4),Et=i.createTexture();i.bindTexture(U,Et),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ee=0;ee<q;ee++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(bt,0,i.RGBA,1,1,rt,0,i.RGBA,i.UNSIGNED_BYTE,St):i.texImage2D(bt+ee,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,St);return Et}const Z={};Z[i.TEXTURE_2D]=V(i.TEXTURE_2D,i.TEXTURE_2D,1),Z[i.TEXTURE_CUBE_MAP]=V(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[i.TEXTURE_2D_ARRAY]=V(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Z[i.TEXTURE_3D]=V(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),lt(i.DEPTH_TEST),o.setFunc(_s),ft(!1),ct(Yc),lt(i.CULL_FACE),C(pi);function lt(U){h[U]!==!0&&(i.enable(U),h[U]=!0)}function at(U){h[U]!==!1&&(i.disable(U),h[U]=!1)}function Rt(U,bt){return u[U]!==bt?(i.bindFramebuffer(U,bt),u[U]=bt,U===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=bt),U===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=bt),!0):!1}function Ot(U,bt){let q=d,rt=!1;if(U){q=f.get(bt),q===void 0&&(q=[],f.set(bt,q));const St=U.textures;if(q.length!==St.length||q[0]!==i.COLOR_ATTACHMENT0){for(let Et=0,ee=St.length;Et<ee;Et++)q[Et]=i.COLOR_ATTACHMENT0+Et;q.length=St.length,rt=!0}}else q[0]!==i.BACK&&(q[0]=i.BACK,rt=!0);rt&&i.drawBuffers(q)}function Gt(U){return p!==U?(i.useProgram(U),p=U,!0):!1}const Xt={[Li]:i.FUNC_ADD,[bf]:i.FUNC_SUBTRACT,[Ef]:i.FUNC_REVERSE_SUBTRACT};Xt[Tf]=i.MIN,Xt[Af]=i.MAX;const J={[Cf]:i.ZERO,[Rf]:i.ONE,[Pf]:i.SRC_COLOR,[Ja]:i.SRC_ALPHA,[Of]:i.SRC_ALPHA_SATURATE,[Uf]:i.DST_COLOR,[Lf]:i.DST_ALPHA,[If]:i.ONE_MINUS_SRC_COLOR,[Qa]:i.ONE_MINUS_SRC_ALPHA,[Nf]:i.ONE_MINUS_DST_COLOR,[Df]:i.ONE_MINUS_DST_ALPHA,[Ff]:i.CONSTANT_COLOR,[kf]:i.ONE_MINUS_CONSTANT_COLOR,[Bf]:i.CONSTANT_ALPHA,[zf]:i.ONE_MINUS_CONSTANT_ALPHA};function C(U,bt,q,rt,St,Et,ee,Pe,tn,ie){if(U===pi){x===!0&&(at(i.BLEND),x=!1);return}if(x===!1&&(lt(i.BLEND),x=!0),U!==wf){if(U!==v||ie!==D){if((m!==Li||_!==Li)&&(i.blendEquation(i.FUNC_ADD),m=Li,_=Li),ie)switch(U){case us:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case jc:i.blendFunc(i.ONE,i.ONE);break;case Kc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Zc:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case us:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case jc:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Kc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Zc:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}g=null,y=null,w=null,P=null,R.set(0,0,0),A=0,v=U,D=ie}return}St=St||bt,Et=Et||q,ee=ee||rt,(bt!==m||St!==_)&&(i.blendEquationSeparate(Xt[bt],Xt[St]),m=bt,_=St),(q!==g||rt!==y||Et!==w||ee!==P)&&(i.blendFuncSeparate(J[q],J[rt],J[Et],J[ee]),g=q,y=rt,w=Et,P=ee),(Pe.equals(R)===!1||tn!==A)&&(i.blendColor(Pe.r,Pe.g,Pe.b,tn),R.copy(Pe),A=tn),v=U,D=!1}function pt(U,bt){U.side===Yn?at(i.CULL_FACE):lt(i.CULL_FACE);let q=U.side===rn;bt&&(q=!q),ft(q),U.blending===us&&U.transparent===!1?C(pi):C(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),s.setMask(U.colorWrite);const rt=U.stencilWrite;a.setTest(rt),rt&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),kt(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?lt(i.SAMPLE_ALPHA_TO_COVERAGE):at(i.SAMPLE_ALPHA_TO_COVERAGE)}function ft(U){K!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),K=U)}function ct(U){U!==Mf?(lt(i.CULL_FACE),U!==M&&(U===Yc?i.cullFace(i.BACK):U===Sf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):at(i.CULL_FACE),M=U}function mt(U){U!==b&&(k&&i.lineWidth(U),b=U)}function kt(U,bt,q){U?(lt(i.POLYGON_OFFSET_FILL),(z!==bt||G!==q)&&(i.polygonOffset(bt,q),z=bt,G=q)):at(i.POLYGON_OFFSET_FILL)}function wt(U){U?lt(i.SCISSOR_TEST):at(i.SCISSOR_TEST)}function T(U){U===void 0&&(U=i.TEXTURE0+N-1),B!==U&&(i.activeTexture(U),B=U)}function S(U,bt,q){q===void 0&&(B===null?q=i.TEXTURE0+N-1:q=B);let rt=Y[q];rt===void 0&&(rt={type:void 0,texture:void 0},Y[q]=rt),(rt.type!==U||rt.texture!==bt)&&(B!==q&&(i.activeTexture(q),B=q),i.bindTexture(U,bt||Z[U]),rt.type=U,rt.texture=bt)}function H(){const U=Y[B];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function Q(){try{i.compressedTexImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function st(){try{i.compressedTexImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function tt(){try{i.texSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ut(){try{i.texSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function vt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Tt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Qt(){try{i.texStorage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ut(){try{i.texStorage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function At(){try{i.texImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Wt(){try{i.texImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function $t(U){xt.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),xt.copy(U))}function Ct(U){Pt.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),Pt.copy(U))}function te(U,bt){let q=c.get(bt);q===void 0&&(q=new WeakMap,c.set(bt,q));let rt=q.get(U);rt===void 0&&(rt=i.getUniformBlockIndex(bt,U.name),q.set(U,rt))}function qt(U,bt){const rt=c.get(bt).get(U);l.get(bt)!==rt&&(i.uniformBlockBinding(bt,rt,U.__bindingPointIndex),l.set(bt,rt))}function me(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},B=null,Y={},u={},f=new WeakMap,d=[],p=null,x=!1,v=null,m=null,g=null,y=null,_=null,w=null,P=null,R=new Yt(0,0,0),A=0,D=!1,K=null,M=null,b=null,z=null,G=null,xt.set(0,0,i.canvas.width,i.canvas.height),Pt.set(0,0,i.canvas.width,i.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:lt,disable:at,bindFramebuffer:Rt,drawBuffers:Ot,useProgram:Gt,setBlending:C,setMaterial:pt,setFlipSided:ft,setCullFace:ct,setLineWidth:mt,setPolygonOffset:kt,setScissorTest:wt,activeTexture:T,bindTexture:S,unbindTexture:H,compressedTexImage2D:Q,compressedTexImage3D:st,texImage2D:At,texImage3D:Wt,updateUBOMapping:te,uniformBlockBinding:qt,texStorage2D:Qt,texStorage3D:ut,texSubImage2D:tt,texSubImage3D:Ut,compressedTexSubImage2D:vt,compressedTexSubImage3D:Tt,scissor:$t,viewport:Ct,reset:me}}function Gh(i,t,e,n){const s=cv(n);switch(e){case Cu:return i*t;case Pu:return i*t;case Iu:return i*t*2;case Lu:return i*t/s.components*s.byteLength;case cc:return i*t/s.components*s.byteLength;case Du:return i*t*2/s.components*s.byteLength;case hc:return i*t*2/s.components*s.byteLength;case Ru:return i*t*3/s.components*s.byteLength;case Cn:return i*t*4/s.components*s.byteLength;case uc:return i*t*4/s.components*s.byteLength;case so:case ro:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case oo:case ao:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ul:case fl:return Math.max(i,16)*Math.max(t,8)/4;case hl:case dl:return Math.max(i,8)*Math.max(t,8)/2;case pl:case ml:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case gl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case xl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case vl:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case _l:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Ml:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Sl:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case yl:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case wl:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case bl:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case El:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Tl:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Al:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Cl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Rl:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Pl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case lo:case Il:case Ll:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Uu:case Dl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Ul:case Nl:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function cv(i){switch(i){case Jn:case Eu:return{byteLength:1,components:1};case Ks:case Tu:case or:return{byteLength:2,components:1};case ac:case lc:return{byteLength:2,components:4};case ki:case oc:case jn:return{byteLength:4,components:1};case Au:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function hv(i,t,e,n,s,o,a){const l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new ht,u=new WeakMap;let f;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(T,S){return p?new OffscreenCanvas(T,S):yo("canvas")}function v(T,S,H){let Q=1;const st=wt(T);if((st.width>H||st.height>H)&&(Q=H/Math.max(st.width,st.height)),Q<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const tt=Math.floor(Q*st.width),Ut=Math.floor(Q*st.height);f===void 0&&(f=x(tt,Ut));const vt=S?x(tt,Ut):f;return vt.width=tt,vt.height=Ut,vt.getContext("2d").drawImage(T,0,0,tt,Ut),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+st.width+"x"+st.height+") to ("+tt+"x"+Ut+")."),vt}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+st.width+"x"+st.height+")."),T;return T}function m(T){return T.generateMipmaps&&T.minFilter!==Je&&T.minFilter!==Tn}function g(T){i.generateMipmap(T)}function y(T,S,H,Q,st=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let tt=S;if(S===i.RED&&(H===i.FLOAT&&(tt=i.R32F),H===i.HALF_FLOAT&&(tt=i.R16F),H===i.UNSIGNED_BYTE&&(tt=i.R8)),S===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(tt=i.R8UI),H===i.UNSIGNED_SHORT&&(tt=i.R16UI),H===i.UNSIGNED_INT&&(tt=i.R32UI),H===i.BYTE&&(tt=i.R8I),H===i.SHORT&&(tt=i.R16I),H===i.INT&&(tt=i.R32I)),S===i.RG&&(H===i.FLOAT&&(tt=i.RG32F),H===i.HALF_FLOAT&&(tt=i.RG16F),H===i.UNSIGNED_BYTE&&(tt=i.RG8)),S===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(tt=i.RG8UI),H===i.UNSIGNED_SHORT&&(tt=i.RG16UI),H===i.UNSIGNED_INT&&(tt=i.RG32UI),H===i.BYTE&&(tt=i.RG8I),H===i.SHORT&&(tt=i.RG16I),H===i.INT&&(tt=i.RG32I)),S===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(tt=i.RGB8UI),H===i.UNSIGNED_SHORT&&(tt=i.RGB16UI),H===i.UNSIGNED_INT&&(tt=i.RGB32UI),H===i.BYTE&&(tt=i.RGB8I),H===i.SHORT&&(tt=i.RGB16I),H===i.INT&&(tt=i.RGB32I)),S===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(tt=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(tt=i.RGBA16UI),H===i.UNSIGNED_INT&&(tt=i.RGBA32UI),H===i.BYTE&&(tt=i.RGBA8I),H===i.SHORT&&(tt=i.RGBA16I),H===i.INT&&(tt=i.RGBA32I)),S===i.RGB&&H===i.UNSIGNED_INT_5_9_9_9_REV&&(tt=i.RGB9_E5),S===i.RGBA){const Ut=st?vo:le.getTransfer(Q);H===i.FLOAT&&(tt=i.RGBA32F),H===i.HALF_FLOAT&&(tt=i.RGBA16F),H===i.UNSIGNED_BYTE&&(tt=Ut===xe?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT_4_4_4_4&&(tt=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(tt=i.RGB5_A1)}return(tt===i.R16F||tt===i.R32F||tt===i.RG16F||tt===i.RG32F||tt===i.RGBA16F||tt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),tt}function _(T,S){let H;return T?S===null||S===ki||S===ys?H=i.DEPTH24_STENCIL8:S===jn?H=i.DEPTH32F_STENCIL8:S===Ks&&(H=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===ki||S===ys?H=i.DEPTH_COMPONENT24:S===jn?H=i.DEPTH_COMPONENT32F:S===Ks&&(H=i.DEPTH_COMPONENT16),H}function w(T,S){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==Je&&T.minFilter!==Tn?Math.log2(Math.max(S.width,S.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?S.mipmaps.length:1}function P(T){const S=T.target;S.removeEventListener("dispose",P),A(S),S.isVideoTexture&&u.delete(S)}function R(T){const S=T.target;S.removeEventListener("dispose",R),K(S)}function A(T){const S=n.get(T);if(S.__webglInit===void 0)return;const H=T.source,Q=d.get(H);if(Q){const st=Q[S.__cacheKey];st.usedTimes--,st.usedTimes===0&&D(T),Object.keys(Q).length===0&&d.delete(H)}n.remove(T)}function D(T){const S=n.get(T);i.deleteTexture(S.__webglTexture);const H=T.source,Q=d.get(H);delete Q[S.__cacheKey],a.memory.textures--}function K(T){const S=n.get(T);if(T.depthTexture&&T.depthTexture.dispose(),T.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(S.__webglFramebuffer[Q]))for(let st=0;st<S.__webglFramebuffer[Q].length;st++)i.deleteFramebuffer(S.__webglFramebuffer[Q][st]);else i.deleteFramebuffer(S.__webglFramebuffer[Q]);S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer[Q])}else{if(Array.isArray(S.__webglFramebuffer))for(let Q=0;Q<S.__webglFramebuffer.length;Q++)i.deleteFramebuffer(S.__webglFramebuffer[Q]);else i.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&i.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let Q=0;Q<S.__webglColorRenderbuffer.length;Q++)S.__webglColorRenderbuffer[Q]&&i.deleteRenderbuffer(S.__webglColorRenderbuffer[Q]);S.__webglDepthRenderbuffer&&i.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const H=T.textures;for(let Q=0,st=H.length;Q<st;Q++){const tt=n.get(H[Q]);tt.__webglTexture&&(i.deleteTexture(tt.__webglTexture),a.memory.textures--),n.remove(H[Q])}n.remove(T)}let M=0;function b(){M=0}function z(){const T=M;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),M+=1,T}function G(T){const S=[];return S.push(T.wrapS),S.push(T.wrapT),S.push(T.wrapR||0),S.push(T.magFilter),S.push(T.minFilter),S.push(T.anisotropy),S.push(T.internalFormat),S.push(T.format),S.push(T.type),S.push(T.generateMipmaps),S.push(T.premultiplyAlpha),S.push(T.flipY),S.push(T.unpackAlignment),S.push(T.colorSpace),S.join()}function N(T,S){const H=n.get(T);if(T.isVideoTexture&&mt(T),T.isRenderTargetTexture===!1&&T.version>0&&H.__version!==T.version){const Q=T.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Pt(H,T,S);return}}e.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+S)}function k(T,S){const H=n.get(T);if(T.version>0&&H.__version!==T.version){Pt(H,T,S);return}e.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+S)}function I(T,S){const H=n.get(T);if(T.version>0&&H.__version!==T.version){Pt(H,T,S);return}e.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+S)}function W(T,S){const H=n.get(T);if(T.version>0&&H.__version!==T.version){V(H,T,S);return}e.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+S)}const B={[xo]:i.REPEAT,[Ui]:i.CLAMP_TO_EDGE,[cl]:i.MIRRORED_REPEAT},Y={[Je]:i.NEAREST,[Kf]:i.NEAREST_MIPMAP_NEAREST,[Mr]:i.NEAREST_MIPMAP_LINEAR,[Tn]:i.LINEAR,[jo]:i.LINEAR_MIPMAP_NEAREST,[Ni]:i.LINEAR_MIPMAP_LINEAR},et={[tp]:i.NEVER,[op]:i.ALWAYS,[ep]:i.LESS,[Ou]:i.LEQUAL,[np]:i.EQUAL,[rp]:i.GEQUAL,[ip]:i.GREATER,[sp]:i.NOTEQUAL};function j(T,S){if(S.type===jn&&t.has("OES_texture_float_linear")===!1&&(S.magFilter===Tn||S.magFilter===jo||S.magFilter===Mr||S.magFilter===Ni||S.minFilter===Tn||S.minFilter===jo||S.minFilter===Mr||S.minFilter===Ni)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,B[S.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,B[S.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,B[S.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,Y[S.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,Y[S.minFilter]),S.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,et[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Je||S.minFilter!==Mr&&S.minFilter!==Ni||S.type===jn&&t.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){const H=t.get("EXT_texture_filter_anisotropic");i.texParameterf(T,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function xt(T,S){let H=!1;T.__webglInit===void 0&&(T.__webglInit=!0,S.addEventListener("dispose",P));const Q=S.source;let st=d.get(Q);st===void 0&&(st={},d.set(Q,st));const tt=G(S);if(tt!==T.__cacheKey){st[tt]===void 0&&(st[tt]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,H=!0),st[tt].usedTimes++;const Ut=st[T.__cacheKey];Ut!==void 0&&(st[T.__cacheKey].usedTimes--,Ut.usedTimes===0&&D(S)),T.__cacheKey=tt,T.__webglTexture=st[tt].texture}return H}function Pt(T,S,H){let Q=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(Q=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(Q=i.TEXTURE_3D);const st=xt(T,S),tt=S.source;e.bindTexture(Q,T.__webglTexture,i.TEXTURE0+H);const Ut=n.get(tt);if(tt.version!==Ut.__version||st===!0){e.activeTexture(i.TEXTURE0+H);const vt=le.getPrimaries(le.workingColorSpace),Tt=S.colorSpace===fi?null:le.getPrimaries(S.colorSpace),Qt=S.colorSpace===fi||vt===Tt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Qt);let ut=v(S.image,!1,s.maxTextureSize);ut=kt(S,ut);const At=o.convert(S.format,S.colorSpace),Wt=o.convert(S.type);let $t=y(S.internalFormat,At,Wt,S.colorSpace,S.isVideoTexture);j(Q,S);let Ct;const te=S.mipmaps,qt=S.isVideoTexture!==!0,me=Ut.__version===void 0||st===!0,U=tt.dataReady,bt=w(S,ut);if(S.isDepthTexture)$t=_(S.format===ws,S.type),me&&(qt?e.texStorage2D(i.TEXTURE_2D,1,$t,ut.width,ut.height):e.texImage2D(i.TEXTURE_2D,0,$t,ut.width,ut.height,0,At,Wt,null));else if(S.isDataTexture)if(te.length>0){qt&&me&&e.texStorage2D(i.TEXTURE_2D,bt,$t,te[0].width,te[0].height);for(let q=0,rt=te.length;q<rt;q++)Ct=te[q],qt?U&&e.texSubImage2D(i.TEXTURE_2D,q,0,0,Ct.width,Ct.height,At,Wt,Ct.data):e.texImage2D(i.TEXTURE_2D,q,$t,Ct.width,Ct.height,0,At,Wt,Ct.data);S.generateMipmaps=!1}else qt?(me&&e.texStorage2D(i.TEXTURE_2D,bt,$t,ut.width,ut.height),U&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ut.width,ut.height,At,Wt,ut.data)):e.texImage2D(i.TEXTURE_2D,0,$t,ut.width,ut.height,0,At,Wt,ut.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){qt&&me&&e.texStorage3D(i.TEXTURE_2D_ARRAY,bt,$t,te[0].width,te[0].height,ut.depth);for(let q=0,rt=te.length;q<rt;q++)if(Ct=te[q],S.format!==Cn)if(At!==null)if(qt){if(U)if(S.layerUpdates.size>0){const St=Gh(Ct.width,Ct.height,S.format,S.type);for(const Et of S.layerUpdates){const ee=Ct.data.subarray(Et*St/Ct.data.BYTES_PER_ELEMENT,(Et+1)*St/Ct.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,q,0,0,Et,Ct.width,Ct.height,1,At,ee,0,0)}S.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,q,0,0,0,Ct.width,Ct.height,ut.depth,At,Ct.data,0,0)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,q,$t,Ct.width,Ct.height,ut.depth,0,Ct.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else qt?U&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,q,0,0,0,Ct.width,Ct.height,ut.depth,At,Wt,Ct.data):e.texImage3D(i.TEXTURE_2D_ARRAY,q,$t,Ct.width,Ct.height,ut.depth,0,At,Wt,Ct.data)}else{qt&&me&&e.texStorage2D(i.TEXTURE_2D,bt,$t,te[0].width,te[0].height);for(let q=0,rt=te.length;q<rt;q++)Ct=te[q],S.format!==Cn?At!==null?qt?U&&e.compressedTexSubImage2D(i.TEXTURE_2D,q,0,0,Ct.width,Ct.height,At,Ct.data):e.compressedTexImage2D(i.TEXTURE_2D,q,$t,Ct.width,Ct.height,0,Ct.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):qt?U&&e.texSubImage2D(i.TEXTURE_2D,q,0,0,Ct.width,Ct.height,At,Wt,Ct.data):e.texImage2D(i.TEXTURE_2D,q,$t,Ct.width,Ct.height,0,At,Wt,Ct.data)}else if(S.isDataArrayTexture)if(qt){if(me&&e.texStorage3D(i.TEXTURE_2D_ARRAY,bt,$t,ut.width,ut.height,ut.depth),U)if(S.layerUpdates.size>0){const q=Gh(ut.width,ut.height,S.format,S.type);for(const rt of S.layerUpdates){const St=ut.data.subarray(rt*q/ut.data.BYTES_PER_ELEMENT,(rt+1)*q/ut.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,rt,ut.width,ut.height,1,At,Wt,St)}S.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ut.width,ut.height,ut.depth,At,Wt,ut.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,$t,ut.width,ut.height,ut.depth,0,At,Wt,ut.data);else if(S.isData3DTexture)qt?(me&&e.texStorage3D(i.TEXTURE_3D,bt,$t,ut.width,ut.height,ut.depth),U&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ut.width,ut.height,ut.depth,At,Wt,ut.data)):e.texImage3D(i.TEXTURE_3D,0,$t,ut.width,ut.height,ut.depth,0,At,Wt,ut.data);else if(S.isFramebufferTexture){if(me)if(qt)e.texStorage2D(i.TEXTURE_2D,bt,$t,ut.width,ut.height);else{let q=ut.width,rt=ut.height;for(let St=0;St<bt;St++)e.texImage2D(i.TEXTURE_2D,St,$t,q,rt,0,At,Wt,null),q>>=1,rt>>=1}}else if(te.length>0){if(qt&&me){const q=wt(te[0]);e.texStorage2D(i.TEXTURE_2D,bt,$t,q.width,q.height)}for(let q=0,rt=te.length;q<rt;q++)Ct=te[q],qt?U&&e.texSubImage2D(i.TEXTURE_2D,q,0,0,At,Wt,Ct):e.texImage2D(i.TEXTURE_2D,q,$t,At,Wt,Ct);S.generateMipmaps=!1}else if(qt){if(me){const q=wt(ut);e.texStorage2D(i.TEXTURE_2D,bt,$t,q.width,q.height)}U&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,At,Wt,ut)}else e.texImage2D(i.TEXTURE_2D,0,$t,At,Wt,ut);m(S)&&g(Q),Ut.__version=tt.version,S.onUpdate&&S.onUpdate(S)}T.__version=S.version}function V(T,S,H){if(S.image.length!==6)return;const Q=xt(T,S),st=S.source;e.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+H);const tt=n.get(st);if(st.version!==tt.__version||Q===!0){e.activeTexture(i.TEXTURE0+H);const Ut=le.getPrimaries(le.workingColorSpace),vt=S.colorSpace===fi?null:le.getPrimaries(S.colorSpace),Tt=S.colorSpace===fi||Ut===vt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Tt);const Qt=S.isCompressedTexture||S.image[0].isCompressedTexture,ut=S.image[0]&&S.image[0].isDataTexture,At=[];for(let rt=0;rt<6;rt++)!Qt&&!ut?At[rt]=v(S.image[rt],!0,s.maxCubemapSize):At[rt]=ut?S.image[rt].image:S.image[rt],At[rt]=kt(S,At[rt]);const Wt=At[0],$t=o.convert(S.format,S.colorSpace),Ct=o.convert(S.type),te=y(S.internalFormat,$t,Ct,S.colorSpace),qt=S.isVideoTexture!==!0,me=tt.__version===void 0||Q===!0,U=st.dataReady;let bt=w(S,Wt);j(i.TEXTURE_CUBE_MAP,S);let q;if(Qt){qt&&me&&e.texStorage2D(i.TEXTURE_CUBE_MAP,bt,te,Wt.width,Wt.height);for(let rt=0;rt<6;rt++){q=At[rt].mipmaps;for(let St=0;St<q.length;St++){const Et=q[St];S.format!==Cn?$t!==null?qt?U&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St,0,0,Et.width,Et.height,$t,Et.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St,te,Et.width,Et.height,0,Et.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):qt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St,0,0,Et.width,Et.height,$t,Ct,Et.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St,te,Et.width,Et.height,0,$t,Ct,Et.data)}}}else{if(q=S.mipmaps,qt&&me){q.length>0&&bt++;const rt=wt(At[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,bt,te,rt.width,rt.height)}for(let rt=0;rt<6;rt++)if(ut){qt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,At[rt].width,At[rt].height,$t,Ct,At[rt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,te,At[rt].width,At[rt].height,0,$t,Ct,At[rt].data);for(let St=0;St<q.length;St++){const ee=q[St].image[rt].image;qt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St+1,0,0,ee.width,ee.height,$t,Ct,ee.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St+1,te,ee.width,ee.height,0,$t,Ct,ee.data)}}else{qt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,$t,Ct,At[rt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,te,$t,Ct,At[rt]);for(let St=0;St<q.length;St++){const Et=q[St];qt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St+1,0,0,$t,Ct,Et.image[rt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St+1,te,$t,Ct,Et.image[rt])}}}m(S)&&g(i.TEXTURE_CUBE_MAP),tt.__version=st.version,S.onUpdate&&S.onUpdate(S)}T.__version=S.version}function Z(T,S,H,Q,st,tt){const Ut=o.convert(H.format,H.colorSpace),vt=o.convert(H.type),Tt=y(H.internalFormat,Ut,vt,H.colorSpace);if(!n.get(S).__hasExternalTextures){const ut=Math.max(1,S.width>>tt),At=Math.max(1,S.height>>tt);st===i.TEXTURE_3D||st===i.TEXTURE_2D_ARRAY?e.texImage3D(st,tt,Tt,ut,At,S.depth,0,Ut,vt,null):e.texImage2D(st,tt,Tt,ut,At,0,Ut,vt,null)}e.bindFramebuffer(i.FRAMEBUFFER,T),ct(S)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Q,st,n.get(H).__webglTexture,0,ft(S)):(st===i.TEXTURE_2D||st>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&st<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Q,st,n.get(H).__webglTexture,tt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function lt(T,S,H){if(i.bindRenderbuffer(i.RENDERBUFFER,T),S.depthBuffer){const Q=S.depthTexture,st=Q&&Q.isDepthTexture?Q.type:null,tt=_(S.stencilBuffer,st),Ut=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,vt=ft(S);ct(S)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,vt,tt,S.width,S.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,vt,tt,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,tt,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ut,i.RENDERBUFFER,T)}else{const Q=S.textures;for(let st=0;st<Q.length;st++){const tt=Q[st],Ut=o.convert(tt.format,tt.colorSpace),vt=o.convert(tt.type),Tt=y(tt.internalFormat,Ut,vt,tt.colorSpace),Qt=ft(S);H&&ct(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Qt,Tt,S.width,S.height):ct(S)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Qt,Tt,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,Tt,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function at(T,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,T),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(S.depthTexture).__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),N(S.depthTexture,0);const Q=n.get(S.depthTexture).__webglTexture,st=ft(S);if(S.depthTexture.format===ds)ct(S)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0,st):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0);else if(S.depthTexture.format===ws)ct(S)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0,st):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function Rt(T){const S=n.get(T),H=T.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==T.depthTexture){const Q=T.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),Q){const st=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,Q.removeEventListener("dispose",st)};Q.addEventListener("dispose",st),S.__depthDisposeCallback=st}S.__boundDepthTexture=Q}if(T.depthTexture&&!S.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");at(S.__webglFramebuffer,T)}else if(H){S.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[Q]),S.__webglDepthbuffer[Q]===void 0)S.__webglDepthbuffer[Q]=i.createRenderbuffer(),lt(S.__webglDepthbuffer[Q],T,!1);else{const st=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,tt=S.__webglDepthbuffer[Q];i.bindRenderbuffer(i.RENDERBUFFER,tt),i.framebufferRenderbuffer(i.FRAMEBUFFER,st,i.RENDERBUFFER,tt)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),lt(S.__webglDepthbuffer,T,!1);else{const Q=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,st=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,st),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,st)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ot(T,S,H){const Q=n.get(T);S!==void 0&&Z(Q.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&Rt(T)}function Gt(T){const S=T.texture,H=n.get(T),Q=n.get(S);T.addEventListener("dispose",R);const st=T.textures,tt=T.isWebGLCubeRenderTarget===!0,Ut=st.length>1;if(Ut||(Q.__webglTexture===void 0&&(Q.__webglTexture=i.createTexture()),Q.__version=S.version,a.memory.textures++),tt){H.__webglFramebuffer=[];for(let vt=0;vt<6;vt++)if(S.mipmaps&&S.mipmaps.length>0){H.__webglFramebuffer[vt]=[];for(let Tt=0;Tt<S.mipmaps.length;Tt++)H.__webglFramebuffer[vt][Tt]=i.createFramebuffer()}else H.__webglFramebuffer[vt]=i.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){H.__webglFramebuffer=[];for(let vt=0;vt<S.mipmaps.length;vt++)H.__webglFramebuffer[vt]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(Ut)for(let vt=0,Tt=st.length;vt<Tt;vt++){const Qt=n.get(st[vt]);Qt.__webglTexture===void 0&&(Qt.__webglTexture=i.createTexture(),a.memory.textures++)}if(T.samples>0&&ct(T)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let vt=0;vt<st.length;vt++){const Tt=st[vt];H.__webglColorRenderbuffer[vt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[vt]);const Qt=o.convert(Tt.format,Tt.colorSpace),ut=o.convert(Tt.type),At=y(Tt.internalFormat,Qt,ut,Tt.colorSpace,T.isXRRenderTarget===!0),Wt=ft(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Wt,At,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.RENDERBUFFER,H.__webglColorRenderbuffer[vt])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),lt(H.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(tt){e.bindTexture(i.TEXTURE_CUBE_MAP,Q.__webglTexture),j(i.TEXTURE_CUBE_MAP,S);for(let vt=0;vt<6;vt++)if(S.mipmaps&&S.mipmaps.length>0)for(let Tt=0;Tt<S.mipmaps.length;Tt++)Z(H.__webglFramebuffer[vt][Tt],T,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+vt,Tt);else Z(H.__webglFramebuffer[vt],T,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0);m(S)&&g(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ut){for(let vt=0,Tt=st.length;vt<Tt;vt++){const Qt=st[vt],ut=n.get(Qt);e.bindTexture(i.TEXTURE_2D,ut.__webglTexture),j(i.TEXTURE_2D,Qt),Z(H.__webglFramebuffer,T,Qt,i.COLOR_ATTACHMENT0+vt,i.TEXTURE_2D,0),m(Qt)&&g(i.TEXTURE_2D)}e.unbindTexture()}else{let vt=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(vt=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(vt,Q.__webglTexture),j(vt,S),S.mipmaps&&S.mipmaps.length>0)for(let Tt=0;Tt<S.mipmaps.length;Tt++)Z(H.__webglFramebuffer[Tt],T,S,i.COLOR_ATTACHMENT0,vt,Tt);else Z(H.__webglFramebuffer,T,S,i.COLOR_ATTACHMENT0,vt,0);m(S)&&g(vt),e.unbindTexture()}T.depthBuffer&&Rt(T)}function Xt(T){const S=T.textures;for(let H=0,Q=S.length;H<Q;H++){const st=S[H];if(m(st)){const tt=T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,Ut=n.get(st).__webglTexture;e.bindTexture(tt,Ut),g(tt),e.unbindTexture()}}}const J=[],C=[];function pt(T){if(T.samples>0){if(ct(T)===!1){const S=T.textures,H=T.width,Q=T.height;let st=i.COLOR_BUFFER_BIT;const tt=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ut=n.get(T),vt=S.length>1;if(vt)for(let Tt=0;Tt<S.length;Tt++)e.bindFramebuffer(i.FRAMEBUFFER,Ut.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Ut.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Ut.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ut.__webglFramebuffer);for(let Tt=0;Tt<S.length;Tt++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(st|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(st|=i.STENCIL_BUFFER_BIT)),vt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ut.__webglColorRenderbuffer[Tt]);const Qt=n.get(S[Tt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Qt,0)}i.blitFramebuffer(0,0,H,Q,0,0,H,Q,st,i.NEAREST),c===!0&&(J.length=0,C.length=0,J.push(i.COLOR_ATTACHMENT0+Tt),T.depthBuffer&&T.resolveDepthBuffer===!1&&(J.push(tt),C.push(tt),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,C)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,J))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),vt)for(let Tt=0;Tt<S.length;Tt++){e.bindFramebuffer(i.FRAMEBUFFER,Ut.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.RENDERBUFFER,Ut.__webglColorRenderbuffer[Tt]);const Qt=n.get(S[Tt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Ut.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.TEXTURE_2D,Qt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ut.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&c){const S=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}}function ft(T){return Math.min(s.maxSamples,T.samples)}function ct(T){const S=n.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function mt(T){const S=a.render.frame;u.get(T)!==S&&(u.set(T,S),T.update())}function kt(T,S){const H=T.colorSpace,Q=T.format,st=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||H!==Si&&H!==fi&&(le.getTransfer(H)===xe?(Q!==Cn||st!==Jn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),S}function wt(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(h.width=T.naturalWidth||T.width,h.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(h.width=T.displayWidth,h.height=T.displayHeight):(h.width=T.width,h.height=T.height),h}this.allocateTextureUnit=z,this.resetTextureUnits=b,this.setTexture2D=N,this.setTexture2DArray=k,this.setTexture3D=I,this.setTextureCube=W,this.rebindTextures=Ot,this.setupRenderTarget=Gt,this.updateRenderTargetMipmap=Xt,this.updateMultisampleRenderTarget=pt,this.setupDepthRenderbuffer=Rt,this.setupFrameBufferTexture=Z,this.useMultisampledRTT=ct}function uv(i,t){function e(n,s=fi){let o;const a=le.getTransfer(s);if(n===Jn)return i.UNSIGNED_BYTE;if(n===ac)return i.UNSIGNED_SHORT_4_4_4_4;if(n===lc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Au)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Eu)return i.BYTE;if(n===Tu)return i.SHORT;if(n===Ks)return i.UNSIGNED_SHORT;if(n===oc)return i.INT;if(n===ki)return i.UNSIGNED_INT;if(n===jn)return i.FLOAT;if(n===or)return i.HALF_FLOAT;if(n===Cu)return i.ALPHA;if(n===Ru)return i.RGB;if(n===Cn)return i.RGBA;if(n===Pu)return i.LUMINANCE;if(n===Iu)return i.LUMINANCE_ALPHA;if(n===ds)return i.DEPTH_COMPONENT;if(n===ws)return i.DEPTH_STENCIL;if(n===Lu)return i.RED;if(n===cc)return i.RED_INTEGER;if(n===Du)return i.RG;if(n===hc)return i.RG_INTEGER;if(n===uc)return i.RGBA_INTEGER;if(n===so||n===ro||n===oo||n===ao)if(a===xe)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(n===so)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ro)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===oo)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ao)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(n===so)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ro)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===oo)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ao)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===hl||n===ul||n===dl||n===fl)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(n===hl)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ul)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===dl)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===fl)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===pl||n===ml||n===gl)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(n===pl||n===ml)return a===xe?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(n===gl)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===xl||n===vl||n===_l||n===Ml||n===Sl||n===yl||n===wl||n===bl||n===El||n===Tl||n===Al||n===Cl||n===Rl||n===Pl)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(n===xl)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===vl)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===_l)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ml)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Sl)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===yl)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===wl)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===bl)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===El)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Tl)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Al)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Cl)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Rl)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Pl)return a===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===lo||n===Il||n===Ll)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(n===lo)return a===xe?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Il)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ll)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Uu||n===Dl||n===Ul||n===Nl)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(n===lo)return o.COMPRESSED_RED_RGTC1_EXT;if(n===Dl)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ul)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Nl)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ys?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class dv extends vn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class fe extends Be{constructor(){super(),this.isGroup=!0,this.type="Group"}}const fv={type:"move"};class Ea{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new fe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new fe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new fe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,o=null,a=null;const l=this._targetRay,c=this._grip,h=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(h&&t.hand){a=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),g=this._getHandJoint(h,v);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const u=h.joints["index-finger-tip"],f=h.joints["thumb-tip"],d=u.position.distanceTo(f.position),p=.02,x=.005;h.inputState.pinching&&d>p+x?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!h.inputState.pinching&&d<=p-x&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,n),o!==null&&(c.matrix.fromArray(o.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,o.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(o.linearVelocity)):c.hasLinearVelocity=!1,o.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(o.angularVelocity)):c.hasAngularVelocity=!1));l!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&o!==null&&(s=o),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,this.dispatchEvent(fv)))}return l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new fe;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const pv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,mv=`
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

}`;class gv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Qe,o=t.properties.get(s);o.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new _i({vertexShader:pv,fragmentShader:mv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new zt(new Fn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class xv extends Cs{constructor(t,e){super();const n=this;let s=null,o=1,a=null,l="local-floor",c=1,h=null,u=null,f=null,d=null,p=null,x=null;const v=new gv,m=e.getContextAttributes();let g=null,y=null;const _=[],w=[],P=new ht;let R=null;const A=new vn;A.layers.enable(1),A.viewport=new Ee;const D=new vn;D.layers.enable(2),D.viewport=new Ee;const K=[A,D],M=new dv;M.layers.enable(1),M.layers.enable(2);let b=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let Z=_[V];return Z===void 0&&(Z=new Ea,_[V]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(V){let Z=_[V];return Z===void 0&&(Z=new Ea,_[V]=Z),Z.getGripSpace()},this.getHand=function(V){let Z=_[V];return Z===void 0&&(Z=new Ea,_[V]=Z),Z.getHandSpace()};function G(V){const Z=w.indexOf(V.inputSource);if(Z===-1)return;const lt=_[Z];lt!==void 0&&(lt.update(V.inputSource,V.frame,h||a),lt.dispatchEvent({type:V.type,data:V.inputSource}))}function N(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",N),s.removeEventListener("inputsourceschange",k);for(let V=0;V<_.length;V++){const Z=w[V];Z!==null&&(w[V]=null,_[V].disconnect(Z))}b=null,z=null,v.reset(),t.setRenderTarget(g),p=null,d=null,f=null,s=null,y=null,Pt.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){o=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){l=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(V){h=V},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return f},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function(V){if(s=V,s!==null){if(g=t.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",N),s.addEventListener("inputsourceschange",k),m.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(P),s.renderState.layers===void 0){const Z={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:o};p=new XRWebGLLayer(s,e,Z),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),y=new Bi(p.framebufferWidth,p.framebufferHeight,{format:Cn,type:Jn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let Z=null,lt=null,at=null;m.depth&&(at=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Z=m.stencil?ws:ds,lt=m.stencil?ys:ki);const Rt={colorFormat:e.RGBA8,depthFormat:at,scaleFactor:o};f=new XRWebGLBinding(s,e),d=f.createProjectionLayer(Rt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),y=new Bi(d.textureWidth,d.textureHeight,{format:Cn,type:Jn,depthTexture:new Yu(d.textureWidth,d.textureHeight,lt,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),h=null,a=await s.requestReferenceSpace(l),Pt.setContext(s),Pt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function k(V){for(let Z=0;Z<V.removed.length;Z++){const lt=V.removed[Z],at=w.indexOf(lt);at>=0&&(w[at]=null,_[at].disconnect(lt))}for(let Z=0;Z<V.added.length;Z++){const lt=V.added[Z];let at=w.indexOf(lt);if(at===-1){for(let Ot=0;Ot<_.length;Ot++)if(Ot>=w.length){w.push(lt),at=Ot;break}else if(w[Ot]===null){w[Ot]=lt,at=Ot;break}if(at===-1)break}const Rt=_[at];Rt&&Rt.connect(lt)}}const I=new L,W=new L;function B(V,Z,lt){I.setFromMatrixPosition(Z.matrixWorld),W.setFromMatrixPosition(lt.matrixWorld);const at=I.distanceTo(W),Rt=Z.projectionMatrix.elements,Ot=lt.projectionMatrix.elements,Gt=Rt[14]/(Rt[10]-1),Xt=Rt[14]/(Rt[10]+1),J=(Rt[9]+1)/Rt[5],C=(Rt[9]-1)/Rt[5],pt=(Rt[8]-1)/Rt[0],ft=(Ot[8]+1)/Ot[0],ct=Gt*pt,mt=Gt*ft,kt=at/(-pt+ft),wt=kt*-pt;if(Z.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(wt),V.translateZ(kt),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert(),Rt[10]===-1)V.projectionMatrix.copy(Z.projectionMatrix),V.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const T=Gt+kt,S=Xt+kt,H=ct-wt,Q=mt+(at-wt),st=J*Xt/S*T,tt=C*Xt/S*T;V.projectionMatrix.makePerspective(H,Q,st,tt,T,S),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}}function Y(V,Z){Z===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(Z.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(s===null)return;let Z=V.near,lt=V.far;v.texture!==null&&(v.depthNear>0&&(Z=v.depthNear),v.depthFar>0&&(lt=v.depthFar)),M.near=D.near=A.near=Z,M.far=D.far=A.far=lt,(b!==M.near||z!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),b=M.near,z=M.far);const at=V.parent,Rt=M.cameras;Y(M,at);for(let Ot=0;Ot<Rt.length;Ot++)Y(Rt[Ot],at);Rt.length===2?B(M,A,D):M.projectionMatrix.copy(A.projectionMatrix),et(V,M,at)};function et(V,Z,lt){lt===null?V.matrix.copy(Z.matrixWorld):(V.matrix.copy(lt.matrixWorld),V.matrix.invert(),V.matrix.multiply(Z.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(Z.projectionMatrix),V.projectionMatrixInverse.copy(Z.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=Ol*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&p===null))return c},this.setFoveation=function(V){c=V,d!==null&&(d.fixedFoveation=V),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=V)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(M)};let j=null;function xt(V,Z){if(u=Z.getViewerPose(h||a),x=Z,u!==null){const lt=u.views;p!==null&&(t.setRenderTargetFramebuffer(y,p.framebuffer),t.setRenderTarget(y));let at=!1;lt.length!==M.cameras.length&&(M.cameras.length=0,at=!0);for(let Ot=0;Ot<lt.length;Ot++){const Gt=lt[Ot];let Xt=null;if(p!==null)Xt=p.getViewport(Gt);else{const C=f.getViewSubImage(d,Gt);Xt=C.viewport,Ot===0&&(t.setRenderTargetTextures(y,C.colorTexture,d.ignoreDepthValues?void 0:C.depthStencilTexture),t.setRenderTarget(y))}let J=K[Ot];J===void 0&&(J=new vn,J.layers.enable(Ot),J.viewport=new Ee,K[Ot]=J),J.matrix.fromArray(Gt.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(Gt.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(Xt.x,Xt.y,Xt.width,Xt.height),Ot===0&&(M.matrix.copy(J.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),at===!0&&M.cameras.push(J)}const Rt=s.enabledFeatures;if(Rt&&Rt.includes("depth-sensing")){const Ot=f.getDepthInformation(lt[0]);Ot&&Ot.isValid&&Ot.texture&&v.init(t,Ot,s.renderState)}}for(let lt=0;lt<_.length;lt++){const at=w[lt],Rt=_[lt];at!==null&&Rt!==void 0&&Rt.update(at,Z,h||a)}j&&j(V,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),x=null}const Pt=new Xu;Pt.setAnimationLoop(xt),this.setAnimationLoop=function(V){j=V},this.dispose=function(){}}}const Ci=new Un,vv=new pe;function _v(i,t){function e(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,Vu(i)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function s(m,g,y,_,w){g.isMeshBasicMaterial||g.isMeshLambertMaterial?o(m,g):g.isMeshToonMaterial?(o(m,g),f(m,g)):g.isMeshPhongMaterial?(o(m,g),u(m,g)):g.isMeshStandardMaterial?(o(m,g),d(m,g),g.isMeshPhysicalMaterial&&p(m,g,w)):g.isMeshMatcapMaterial?(o(m,g),x(m,g)):g.isMeshDepthMaterial?o(m,g):g.isMeshDistanceMaterial?(o(m,g),v(m,g)):g.isMeshNormalMaterial?o(m,g):g.isLineBasicMaterial?(a(m,g),g.isLineDashedMaterial&&l(m,g)):g.isPointsMaterial?c(m,g,y,_):g.isSpriteMaterial?h(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function o(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,e(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===rn&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,e(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===rn&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,e(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,e(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const y=t.get(g),_=y.envMap,w=y.envMapRotation;_&&(m.envMap.value=_,Ci.copy(w),Ci.x*=-1,Ci.y*=-1,Ci.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Ci.y*=-1,Ci.z*=-1),m.envMapRotation.value.setFromMatrix4(vv.makeRotationFromEuler(Ci)),m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,m.aoMapTransform))}function a(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform))}function l(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function c(m,g,y,_){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*y,m.scale.value=_*.5,g.map&&(m.map.value=g.map,e(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function u(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function f(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function d(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function p(m,g,y){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===rn&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,m.specularIntensityMapTransform))}function x(m,g){g.matcap&&(m.matcap.value=g.matcap)}function v(m,g){const y=t.get(g).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Mv(i,t,e,n){let s={},o={},a=[];const l=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,_){const w=_.program;n.uniformBlockBinding(y,w)}function h(y,_){let w=s[y.id];w===void 0&&(x(y),w=u(y),s[y.id]=w,y.addEventListener("dispose",m));const P=_.program;n.updateUBOMapping(y,P);const R=t.render.frame;o[y.id]!==R&&(d(y),o[y.id]=R)}function u(y){const _=f();y.__bindingPointIndex=_;const w=i.createBuffer(),P=y.__size,R=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,w),i.bufferData(i.UNIFORM_BUFFER,P,R),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,_,w),w}function f(){for(let y=0;y<l;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const _=s[y.id],w=y.uniforms,P=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,_);for(let R=0,A=w.length;R<A;R++){const D=Array.isArray(w[R])?w[R]:[w[R]];for(let K=0,M=D.length;K<M;K++){const b=D[K];if(p(b,R,K,P)===!0){const z=b.__offset,G=Array.isArray(b.value)?b.value:[b.value];let N=0;for(let k=0;k<G.length;k++){const I=G[k],W=v(I);typeof I=="number"||typeof I=="boolean"?(b.__data[0]=I,i.bufferSubData(i.UNIFORM_BUFFER,z+N,b.__data)):I.isMatrix3?(b.__data[0]=I.elements[0],b.__data[1]=I.elements[1],b.__data[2]=I.elements[2],b.__data[3]=0,b.__data[4]=I.elements[3],b.__data[5]=I.elements[4],b.__data[6]=I.elements[5],b.__data[7]=0,b.__data[8]=I.elements[6],b.__data[9]=I.elements[7],b.__data[10]=I.elements[8],b.__data[11]=0):(I.toArray(b.__data,N),N+=W.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,z,b.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(y,_,w,P){const R=y.value,A=_+"_"+w;if(P[A]===void 0)return typeof R=="number"||typeof R=="boolean"?P[A]=R:P[A]=R.clone(),!0;{const D=P[A];if(typeof R=="number"||typeof R=="boolean"){if(D!==R)return P[A]=R,!0}else if(D.equals(R)===!1)return D.copy(R),!0}return!1}function x(y){const _=y.uniforms;let w=0;const P=16;for(let A=0,D=_.length;A<D;A++){const K=Array.isArray(_[A])?_[A]:[_[A]];for(let M=0,b=K.length;M<b;M++){const z=K[M],G=Array.isArray(z.value)?z.value:[z.value];for(let N=0,k=G.length;N<k;N++){const I=G[N],W=v(I),B=w%P,Y=B%W.boundary,et=B+Y;w+=Y,et!==0&&P-et<W.storage&&(w+=P-et),z.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=w,w+=W.storage}}}const R=w%P;return R>0&&(w+=P-R),y.__size=w,y.__cache={},this}function v(y){const _={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(_.boundary=4,_.storage=4):y.isVector2?(_.boundary=8,_.storage=8):y.isVector3||y.isColor?(_.boundary=16,_.storage=12):y.isVector4?(_.boundary=16,_.storage=16):y.isMatrix3?(_.boundary=48,_.storage=48):y.isMatrix4?(_.boundary=64,_.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),_}function m(y){const _=y.target;_.removeEventListener("dispose",m);const w=a.indexOf(_.__bindingPointIndex);a.splice(w,1),i.deleteBuffer(s[_.id]),delete s[_.id],delete o[_.id]}function g(){for(const y in s)i.deleteBuffer(s[y]);a=[],s={},o={}}return{bind:c,update:h,dispose:g}}class Sv{constructor(t={}){const{canvas:e=lp(),context:n=null,depth:s=!0,stencil:o=!1,alpha:a=!1,antialias:l=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=a;const p=new Uint32Array(4),x=new Int32Array(4);let v=null,m=null;const g=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=En,this.toneMapping=mi,this.toneMappingExposure=1;const _=this;let w=!1,P=0,R=0,A=null,D=-1,K=null;const M=new Ee,b=new Ee;let z=null;const G=new Yt(0);let N=0,k=e.width,I=e.height,W=1,B=null,Y=null;const et=new Ee(0,0,k,I),j=new Ee(0,0,k,I);let xt=!1;const Pt=new pc;let V=!1,Z=!1;const lt=new pe,at=new pe,Rt=new L,Ot=new Ee,Gt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Xt=!1;function J(){return A===null?W:1}let C=n;function pt(E,O){return e.getContext(E,O)}try{const E={alpha:!0,depth:s,stencil:o,antialias:l,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${sc}`),e.addEventListener("webglcontextlost",rt,!1),e.addEventListener("webglcontextrestored",St,!1),e.addEventListener("webglcontextcreationerror",Et,!1),C===null){const O="webgl2";if(C=pt(O,E),C===null)throw pt(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let ft,ct,mt,kt,wt,T,S,H,Q,st,tt,Ut,vt,Tt,Qt,ut,At,Wt,$t,Ct,te,qt,me,U;function bt(){ft=new Tg(C),ft.init(),qt=new uv(C,ft),ct=new Mg(C,ft,t,qt),mt=new lv(C),ct.reverseDepthBuffer&&mt.buffers.depth.setReversed(!0),kt=new Rg(C),wt=new qx,T=new hv(C,ft,mt,wt,ct,qt,kt),S=new yg(_),H=new Eg(_),Q=new Op(C),me=new vg(C,Q),st=new Ag(C,Q,kt,me),tt=new Ig(C,st,Q,kt),$t=new Pg(C,ct,T),ut=new Sg(wt),Ut=new Xx(_,S,H,ft,ct,me,ut),vt=new _v(_,wt),Tt=new jx,Qt=new ev(ft),Wt=new xg(_,S,H,mt,tt,d,c),At=new ov(_,tt,ct),U=new Mv(C,kt,ct,mt),Ct=new _g(C,ft,kt),te=new Cg(C,ft,kt),kt.programs=Ut.programs,_.capabilities=ct,_.extensions=ft,_.properties=wt,_.renderLists=Tt,_.shadowMap=At,_.state=mt,_.info=kt}bt();const q=new xv(_,C);this.xr=q,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){const E=ft.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=ft.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(E){E!==void 0&&(W=E,this.setSize(k,I,!1))},this.getSize=function(E){return E.set(k,I)},this.setSize=function(E,O,$=!0){if(q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=E,I=O,e.width=Math.floor(E*W),e.height=Math.floor(O*W),$===!0&&(e.style.width=E+"px",e.style.height=O+"px"),this.setViewport(0,0,E,O)},this.getDrawingBufferSize=function(E){return E.set(k*W,I*W).floor()},this.setDrawingBufferSize=function(E,O,$){k=E,I=O,W=$,e.width=Math.floor(E*$),e.height=Math.floor(O*$),this.setViewport(0,0,E,O)},this.getCurrentViewport=function(E){return E.copy(M)},this.getViewport=function(E){return E.copy(et)},this.setViewport=function(E,O,$,X){E.isVector4?et.set(E.x,E.y,E.z,E.w):et.set(E,O,$,X),mt.viewport(M.copy(et).multiplyScalar(W).round())},this.getScissor=function(E){return E.copy(j)},this.setScissor=function(E,O,$,X){E.isVector4?j.set(E.x,E.y,E.z,E.w):j.set(E,O,$,X),mt.scissor(b.copy(j).multiplyScalar(W).round())},this.getScissorTest=function(){return xt},this.setScissorTest=function(E){mt.setScissorTest(xt=E)},this.setOpaqueSort=function(E){B=E},this.setTransparentSort=function(E){Y=E},this.getClearColor=function(E){return E.copy(Wt.getClearColor())},this.setClearColor=function(){Wt.setClearColor.apply(Wt,arguments)},this.getClearAlpha=function(){return Wt.getClearAlpha()},this.setClearAlpha=function(){Wt.setClearAlpha.apply(Wt,arguments)},this.clear=function(E=!0,O=!0,$=!0){let X=0;if(E){let F=!1;if(A!==null){const dt=A.texture.format;F=dt===uc||dt===hc||dt===cc}if(F){const dt=A.texture.type,yt=dt===Jn||dt===ki||dt===Ks||dt===ys||dt===ac||dt===lc,It=Wt.getClearColor(),Nt=Wt.getClearAlpha(),Ht=It.r,Vt=It.g,Ft=It.b;yt?(p[0]=Ht,p[1]=Vt,p[2]=Ft,p[3]=Nt,C.clearBufferuiv(C.COLOR,0,p)):(x[0]=Ht,x[1]=Vt,x[2]=Ft,x[3]=Nt,C.clearBufferiv(C.COLOR,0,x))}else X|=C.COLOR_BUFFER_BIT}O&&(X|=C.DEPTH_BUFFER_BIT,C.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),$&&(X|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),C.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",rt,!1),e.removeEventListener("webglcontextrestored",St,!1),e.removeEventListener("webglcontextcreationerror",Et,!1),Tt.dispose(),Qt.dispose(),wt.dispose(),S.dispose(),H.dispose(),tt.dispose(),me.dispose(),U.dispose(),Ut.dispose(),q.dispose(),q.removeEventListener("sessionstart",zc),q.removeEventListener("sessionend",Gc),yi.stop()};function rt(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function St(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const E=kt.autoReset,O=At.enabled,$=At.autoUpdate,X=At.needsUpdate,F=At.type;bt(),kt.autoReset=E,At.enabled=O,At.autoUpdate=$,At.needsUpdate=X,At.type=F}function Et(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function ee(E){const O=E.target;O.removeEventListener("dispose",ee),Pe(O)}function Pe(E){tn(E),wt.remove(E)}function tn(E){const O=wt.get(E).programs;O!==void 0&&(O.forEach(function($){Ut.releaseProgram($)}),E.isShaderMaterial&&Ut.releaseShaderCache(E))}this.renderBufferDirect=function(E,O,$,X,F,dt){O===null&&(O=Gt);const yt=F.isMesh&&F.matrixWorld.determinant()<0,It=ff(E,O,$,X,F);mt.setMaterial(X,yt);let Nt=$.index,Ht=1;if(X.wireframe===!0){if(Nt=st.getWireframeAttribute($),Nt===void 0)return;Ht=2}const Vt=$.drawRange,Ft=$.attributes.position;let ce=Vt.start*Ht,ge=(Vt.start+Vt.count)*Ht;dt!==null&&(ce=Math.max(ce,dt.start*Ht),ge=Math.min(ge,(dt.start+dt.count)*Ht)),Nt!==null?(ce=Math.max(ce,0),ge=Math.min(ge,Nt.count)):Ft!=null&&(ce=Math.max(ce,0),ge=Math.min(ge,Ft.count));const ye=ge-ce;if(ye<0||ye===1/0)return;me.setup(F,X,It,$,Nt);let ln,oe=Ct;if(Nt!==null&&(ln=Q.get(Nt),oe=te,oe.setIndex(ln)),F.isMesh)X.wireframe===!0?(mt.setLineWidth(X.wireframeLinewidth*J()),oe.setMode(C.LINES)):oe.setMode(C.TRIANGLES);else if(F.isLine){let Bt=X.linewidth;Bt===void 0&&(Bt=1),mt.setLineWidth(Bt*J()),F.isLineSegments?oe.setMode(C.LINES):F.isLineLoop?oe.setMode(C.LINE_LOOP):oe.setMode(C.LINE_STRIP)}else F.isPoints?oe.setMode(C.POINTS):F.isSprite&&oe.setMode(C.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)oe.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if(ft.get("WEBGL_multi_draw"))oe.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{const Bt=F._multiDrawStarts,Ve=F._multiDrawCounts,ae=F._multiDrawCount,Mn=Nt?Q.get(Nt).bytesPerElement:1,$i=wt.get(X).currentProgram.getUniforms();for(let cn=0;cn<ae;cn++)$i.setValue(C,"_gl_DrawID",cn),oe.render(Bt[cn]/Mn,Ve[cn])}else if(F.isInstancedMesh)oe.renderInstances(ce,ye,F.count);else if($.isInstancedBufferGeometry){const Bt=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,Ve=Math.min($.instanceCount,Bt);oe.renderInstances(ce,ye,Ve)}else oe.render(ce,ye)};function ie(E,O,$){E.transparent===!0&&E.side===Yn&&E.forceSinglePass===!1?(E.side=rn,E.needsUpdate=!0,_r(E,O,$),E.side=vi,E.needsUpdate=!0,_r(E,O,$),E.side=Yn):_r(E,O,$)}this.compile=function(E,O,$=null){$===null&&($=E),m=Qt.get($),m.init(O),y.push(m),$.traverseVisible(function(F){F.isLight&&F.layers.test(O.layers)&&(m.pushLight(F),F.castShadow&&m.pushShadow(F))}),E!==$&&E.traverseVisible(function(F){F.isLight&&F.layers.test(O.layers)&&(m.pushLight(F),F.castShadow&&m.pushShadow(F))}),m.setupLights();const X=new Set;return E.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;const dt=F.material;if(dt)if(Array.isArray(dt))for(let yt=0;yt<dt.length;yt++){const It=dt[yt];ie(It,$,F),X.add(It)}else ie(dt,$,F),X.add(dt)}),y.pop(),m=null,X},this.compileAsync=function(E,O,$=null){const X=this.compile(E,O,$);return new Promise(F=>{function dt(){if(X.forEach(function(yt){wt.get(yt).currentProgram.isReady()&&X.delete(yt)}),X.size===0){F(E);return}setTimeout(dt,10)}ft.get("KHR_parallel_shader_compile")!==null?dt():setTimeout(dt,10)})};let en=null;function Bn(E){en&&en(E)}function zc(){yi.stop()}function Gc(){yi.start()}const yi=new Xu;yi.setAnimationLoop(Bn),typeof self<"u"&&yi.setContext(self),this.setAnimationLoop=function(E){en=E,q.setAnimationLoop(E),E===null?yi.stop():yi.start()},q.addEventListener("sessionstart",zc),q.addEventListener("sessionend",Gc),this.render=function(E,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),q.enabled===!0&&q.isPresenting===!0&&(q.cameraAutoUpdate===!0&&q.updateCamera(O),O=q.getCamera()),E.isScene===!0&&E.onBeforeRender(_,E,O,A),m=Qt.get(E,y.length),m.init(O),y.push(m),at.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),Pt.setFromProjectionMatrix(at),Z=this.localClippingEnabled,V=ut.init(this.clippingPlanes,Z),v=Tt.get(E,g.length),v.init(),g.push(v),q.enabled===!0&&q.isPresenting===!0){const dt=_.xr.getDepthSensingMesh();dt!==null&&$o(dt,O,-1/0,_.sortObjects)}$o(E,O,0,_.sortObjects),v.finish(),_.sortObjects===!0&&v.sort(B,Y),Xt=q.enabled===!1||q.isPresenting===!1||q.hasDepthSensing()===!1,Xt&&Wt.addToRenderList(v,E),this.info.render.frame++,V===!0&&ut.beginShadows();const $=m.state.shadowsArray;At.render($,E,O),V===!0&&ut.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=v.opaque,F=v.transmissive;if(m.setupLights(),O.isArrayCamera){const dt=O.cameras;if(F.length>0)for(let yt=0,It=dt.length;yt<It;yt++){const Nt=dt[yt];Vc(X,F,E,Nt)}Xt&&Wt.render(E);for(let yt=0,It=dt.length;yt<It;yt++){const Nt=dt[yt];Hc(v,E,Nt,Nt.viewport)}}else F.length>0&&Vc(X,F,E,O),Xt&&Wt.render(E),Hc(v,E,O);A!==null&&(T.updateMultisampleRenderTarget(A),T.updateRenderTargetMipmap(A)),E.isScene===!0&&E.onAfterRender(_,E,O),me.resetDefaultState(),D=-1,K=null,y.pop(),y.length>0?(m=y[y.length-1],V===!0&&ut.setGlobalState(_.clippingPlanes,m.state.camera)):m=null,g.pop(),g.length>0?v=g[g.length-1]:v=null};function $o(E,O,$,X){if(E.visible===!1)return;if(E.layers.test(O.layers)){if(E.isGroup)$=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(O);else if(E.isLight)m.pushLight(E),E.castShadow&&m.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Pt.intersectsSprite(E)){X&&Ot.setFromMatrixPosition(E.matrixWorld).applyMatrix4(at);const yt=tt.update(E),It=E.material;It.visible&&v.push(E,yt,It,$,Ot.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Pt.intersectsObject(E))){const yt=tt.update(E),It=E.material;if(X&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Ot.copy(E.boundingSphere.center)):(yt.boundingSphere===null&&yt.computeBoundingSphere(),Ot.copy(yt.boundingSphere.center)),Ot.applyMatrix4(E.matrixWorld).applyMatrix4(at)),Array.isArray(It)){const Nt=yt.groups;for(let Ht=0,Vt=Nt.length;Ht<Vt;Ht++){const Ft=Nt[Ht],ce=It[Ft.materialIndex];ce&&ce.visible&&v.push(E,yt,ce,$,Ot.z,Ft)}}else It.visible&&v.push(E,yt,It,$,Ot.z,null)}}const dt=E.children;for(let yt=0,It=dt.length;yt<It;yt++)$o(dt[yt],O,$,X)}function Hc(E,O,$,X){const F=E.opaque,dt=E.transmissive,yt=E.transparent;m.setupLightsView($),V===!0&&ut.setGlobalState(_.clippingPlanes,$),X&&mt.viewport(M.copy(X)),F.length>0&&vr(F,O,$),dt.length>0&&vr(dt,O,$),yt.length>0&&vr(yt,O,$),mt.buffers.depth.setTest(!0),mt.buffers.depth.setMask(!0),mt.buffers.color.setMask(!0),mt.setPolygonOffset(!1)}function Vc(E,O,$,X){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[X.id]===void 0&&(m.state.transmissionRenderTarget[X.id]=new Bi(1,1,{generateMipmaps:!0,type:ft.has("EXT_color_buffer_half_float")||ft.has("EXT_color_buffer_float")?or:Jn,minFilter:Ni,samples:4,stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:le.workingColorSpace}));const dt=m.state.transmissionRenderTarget[X.id],yt=X.viewport||M;dt.setSize(yt.z,yt.w);const It=_.getRenderTarget();_.setRenderTarget(dt),_.getClearColor(G),N=_.getClearAlpha(),N<1&&_.setClearColor(16777215,.5),_.clear(),Xt&&Wt.render($);const Nt=_.toneMapping;_.toneMapping=mi;const Ht=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),m.setupLightsView(X),V===!0&&ut.setGlobalState(_.clippingPlanes,X),vr(E,$,X),T.updateMultisampleRenderTarget(dt),T.updateRenderTargetMipmap(dt),ft.has("WEBGL_multisampled_render_to_texture")===!1){let Vt=!1;for(let Ft=0,ce=O.length;Ft<ce;Ft++){const ge=O[Ft],ye=ge.object,ln=ge.geometry,oe=ge.material,Bt=ge.group;if(oe.side===Yn&&ye.layers.test(X.layers)){const Ve=oe.side;oe.side=rn,oe.needsUpdate=!0,Wc(ye,$,X,ln,oe,Bt),oe.side=Ve,oe.needsUpdate=!0,Vt=!0}}Vt===!0&&(T.updateMultisampleRenderTarget(dt),T.updateRenderTargetMipmap(dt))}_.setRenderTarget(It),_.setClearColor(G,N),Ht!==void 0&&(X.viewport=Ht),_.toneMapping=Nt}function vr(E,O,$){const X=O.isScene===!0?O.overrideMaterial:null;for(let F=0,dt=E.length;F<dt;F++){const yt=E[F],It=yt.object,Nt=yt.geometry,Ht=X===null?yt.material:X,Vt=yt.group;It.layers.test($.layers)&&Wc(It,O,$,Nt,Ht,Vt)}}function Wc(E,O,$,X,F,dt){E.onBeforeRender(_,O,$,X,F,dt),E.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),F.onBeforeRender(_,O,$,X,E,dt),F.transparent===!0&&F.side===Yn&&F.forceSinglePass===!1?(F.side=rn,F.needsUpdate=!0,_.renderBufferDirect($,O,X,F,E,dt),F.side=vi,F.needsUpdate=!0,_.renderBufferDirect($,O,X,F,E,dt),F.side=Yn):_.renderBufferDirect($,O,X,F,E,dt),E.onAfterRender(_,O,$,X,F,dt)}function _r(E,O,$){O.isScene!==!0&&(O=Gt);const X=wt.get(E),F=m.state.lights,dt=m.state.shadowsArray,yt=F.state.version,It=Ut.getParameters(E,F.state,dt,O,$),Nt=Ut.getProgramCacheKey(It);let Ht=X.programs;X.environment=E.isMeshStandardMaterial?O.environment:null,X.fog=O.fog,X.envMap=(E.isMeshStandardMaterial?H:S).get(E.envMap||X.environment),X.envMapRotation=X.environment!==null&&E.envMap===null?O.environmentRotation:E.envMapRotation,Ht===void 0&&(E.addEventListener("dispose",ee),Ht=new Map,X.programs=Ht);let Vt=Ht.get(Nt);if(Vt!==void 0){if(X.currentProgram===Vt&&X.lightsStateVersion===yt)return Xc(E,It),Vt}else It.uniforms=Ut.getUniforms(E),E.onBeforeCompile(It,_),Vt=Ut.acquireProgram(It,Nt),Ht.set(Nt,Vt),X.uniforms=It.uniforms;const Ft=X.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ft.clippingPlanes=ut.uniform),Xc(E,It),X.needsLights=mf(E),X.lightsStateVersion=yt,X.needsLights&&(Ft.ambientLightColor.value=F.state.ambient,Ft.lightProbe.value=F.state.probe,Ft.directionalLights.value=F.state.directional,Ft.directionalLightShadows.value=F.state.directionalShadow,Ft.spotLights.value=F.state.spot,Ft.spotLightShadows.value=F.state.spotShadow,Ft.rectAreaLights.value=F.state.rectArea,Ft.ltc_1.value=F.state.rectAreaLTC1,Ft.ltc_2.value=F.state.rectAreaLTC2,Ft.pointLights.value=F.state.point,Ft.pointLightShadows.value=F.state.pointShadow,Ft.hemisphereLights.value=F.state.hemi,Ft.directionalShadowMap.value=F.state.directionalShadowMap,Ft.directionalShadowMatrix.value=F.state.directionalShadowMatrix,Ft.spotShadowMap.value=F.state.spotShadowMap,Ft.spotLightMatrix.value=F.state.spotLightMatrix,Ft.spotLightMap.value=F.state.spotLightMap,Ft.pointShadowMap.value=F.state.pointShadowMap,Ft.pointShadowMatrix.value=F.state.pointShadowMatrix),X.currentProgram=Vt,X.uniformsList=null,Vt}function $c(E){if(E.uniformsList===null){const O=E.currentProgram.getUniforms();E.uniformsList=ho.seqWithValue(O.seq,E.uniforms)}return E.uniformsList}function Xc(E,O){const $=wt.get(E);$.outputColorSpace=O.outputColorSpace,$.batching=O.batching,$.batchingColor=O.batchingColor,$.instancing=O.instancing,$.instancingColor=O.instancingColor,$.instancingMorph=O.instancingMorph,$.skinning=O.skinning,$.morphTargets=O.morphTargets,$.morphNormals=O.morphNormals,$.morphColors=O.morphColors,$.morphTargetsCount=O.morphTargetsCount,$.numClippingPlanes=O.numClippingPlanes,$.numIntersection=O.numClipIntersection,$.vertexAlphas=O.vertexAlphas,$.vertexTangents=O.vertexTangents,$.toneMapping=O.toneMapping}function ff(E,O,$,X,F){O.isScene!==!0&&(O=Gt),T.resetTextureUnits();const dt=O.fog,yt=X.isMeshStandardMaterial?O.environment:null,It=A===null?_.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Si,Nt=(X.isMeshStandardMaterial?H:S).get(X.envMap||yt),Ht=X.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,Vt=!!$.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ft=!!$.morphAttributes.position,ce=!!$.morphAttributes.normal,ge=!!$.morphAttributes.color;let ye=mi;X.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(ye=_.toneMapping);const ln=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,oe=ln!==void 0?ln.length:0,Bt=wt.get(X),Ve=m.state.lights;if(V===!0&&(Z===!0||E!==K)){const gn=E===K&&X.id===D;ut.setState(X,E,gn)}let ae=!1;X.version===Bt.__version?(Bt.needsLights&&Bt.lightsStateVersion!==Ve.state.version||Bt.outputColorSpace!==It||F.isBatchedMesh&&Bt.batching===!1||!F.isBatchedMesh&&Bt.batching===!0||F.isBatchedMesh&&Bt.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&Bt.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&Bt.instancing===!1||!F.isInstancedMesh&&Bt.instancing===!0||F.isSkinnedMesh&&Bt.skinning===!1||!F.isSkinnedMesh&&Bt.skinning===!0||F.isInstancedMesh&&Bt.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&Bt.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&Bt.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&Bt.instancingMorph===!1&&F.morphTexture!==null||Bt.envMap!==Nt||X.fog===!0&&Bt.fog!==dt||Bt.numClippingPlanes!==void 0&&(Bt.numClippingPlanes!==ut.numPlanes||Bt.numIntersection!==ut.numIntersection)||Bt.vertexAlphas!==Ht||Bt.vertexTangents!==Vt||Bt.morphTargets!==Ft||Bt.morphNormals!==ce||Bt.morphColors!==ge||Bt.toneMapping!==ye||Bt.morphTargetsCount!==oe)&&(ae=!0):(ae=!0,Bt.__version=X.version);let Mn=Bt.currentProgram;ae===!0&&(Mn=_r(X,O,F));let $i=!1,cn=!1,Xo=!1;const Ae=Mn.getUniforms(),ni=Bt.uniforms;if(mt.useProgram(Mn.program)&&($i=!0,cn=!0,Xo=!0),X.id!==D&&(D=X.id,cn=!0),$i||K!==E){ct.reverseDepthBuffer?(lt.copy(E.projectionMatrix),hp(lt),up(lt),Ae.setValue(C,"projectionMatrix",lt)):Ae.setValue(C,"projectionMatrix",E.projectionMatrix),Ae.setValue(C,"viewMatrix",E.matrixWorldInverse);const gn=Ae.map.cameraPosition;gn!==void 0&&gn.setValue(C,Rt.setFromMatrixPosition(E.matrixWorld)),ct.logarithmicDepthBuffer&&Ae.setValue(C,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&Ae.setValue(C,"isOrthographic",E.isOrthographicCamera===!0),K!==E&&(K=E,cn=!0,Xo=!0)}if(F.isSkinnedMesh){Ae.setOptional(C,F,"bindMatrix"),Ae.setOptional(C,F,"bindMatrixInverse");const gn=F.skeleton;gn&&(gn.boneTexture===null&&gn.computeBoneTexture(),Ae.setValue(C,"boneTexture",gn.boneTexture,T))}F.isBatchedMesh&&(Ae.setOptional(C,F,"batchingTexture"),Ae.setValue(C,"batchingTexture",F._matricesTexture,T),Ae.setOptional(C,F,"batchingIdTexture"),Ae.setValue(C,"batchingIdTexture",F._indirectTexture,T),Ae.setOptional(C,F,"batchingColorTexture"),F._colorsTexture!==null&&Ae.setValue(C,"batchingColorTexture",F._colorsTexture,T));const qo=$.morphAttributes;if((qo.position!==void 0||qo.normal!==void 0||qo.color!==void 0)&&$t.update(F,$,Mn),(cn||Bt.receiveShadow!==F.receiveShadow)&&(Bt.receiveShadow=F.receiveShadow,Ae.setValue(C,"receiveShadow",F.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(ni.envMap.value=Nt,ni.flipEnvMap.value=Nt.isCubeTexture&&Nt.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&O.environment!==null&&(ni.envMapIntensity.value=O.environmentIntensity),cn&&(Ae.setValue(C,"toneMappingExposure",_.toneMappingExposure),Bt.needsLights&&pf(ni,Xo),dt&&X.fog===!0&&vt.refreshFogUniforms(ni,dt),vt.refreshMaterialUniforms(ni,X,W,I,m.state.transmissionRenderTarget[E.id]),ho.upload(C,$c(Bt),ni,T)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(ho.upload(C,$c(Bt),ni,T),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&Ae.setValue(C,"center",F.center),Ae.setValue(C,"modelViewMatrix",F.modelViewMatrix),Ae.setValue(C,"normalMatrix",F.normalMatrix),Ae.setValue(C,"modelMatrix",F.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const gn=X.uniformsGroups;for(let Yo=0,gf=gn.length;Yo<gf;Yo++){const qc=gn[Yo];U.update(qc,Mn),U.bind(qc,Mn)}}return Mn}function pf(E,O){E.ambientLightColor.needsUpdate=O,E.lightProbe.needsUpdate=O,E.directionalLights.needsUpdate=O,E.directionalLightShadows.needsUpdate=O,E.pointLights.needsUpdate=O,E.pointLightShadows.needsUpdate=O,E.spotLights.needsUpdate=O,E.spotLightShadows.needsUpdate=O,E.rectAreaLights.needsUpdate=O,E.hemisphereLights.needsUpdate=O}function mf(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(E,O,$){wt.get(E.texture).__webglTexture=O,wt.get(E.depthTexture).__webglTexture=$;const X=wt.get(E);X.__hasExternalTextures=!0,X.__autoAllocateDepthBuffer=$===void 0,X.__autoAllocateDepthBuffer||ft.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),X.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,O){const $=wt.get(E);$.__webglFramebuffer=O,$.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(E,O=0,$=0){A=E,P=O,R=$;let X=!0,F=null,dt=!1,yt=!1;if(E){const Nt=wt.get(E);if(Nt.__useDefaultFramebuffer!==void 0)mt.bindFramebuffer(C.FRAMEBUFFER,null),X=!1;else if(Nt.__webglFramebuffer===void 0)T.setupRenderTarget(E);else if(Nt.__hasExternalTextures)T.rebindTextures(E,wt.get(E.texture).__webglTexture,wt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Ft=E.depthTexture;if(Nt.__boundDepthTexture!==Ft){if(Ft!==null&&wt.has(Ft)&&(E.width!==Ft.image.width||E.height!==Ft.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");T.setupDepthRenderbuffer(E)}}const Ht=E.texture;(Ht.isData3DTexture||Ht.isDataArrayTexture||Ht.isCompressedArrayTexture)&&(yt=!0);const Vt=wt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Vt[O])?F=Vt[O][$]:F=Vt[O],dt=!0):E.samples>0&&T.useMultisampledRTT(E)===!1?F=wt.get(E).__webglMultisampledFramebuffer:Array.isArray(Vt)?F=Vt[$]:F=Vt,M.copy(E.viewport),b.copy(E.scissor),z=E.scissorTest}else M.copy(et).multiplyScalar(W).floor(),b.copy(j).multiplyScalar(W).floor(),z=xt;if(mt.bindFramebuffer(C.FRAMEBUFFER,F)&&X&&mt.drawBuffers(E,F),mt.viewport(M),mt.scissor(b),mt.setScissorTest(z),dt){const Nt=wt.get(E.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+O,Nt.__webglTexture,$)}else if(yt){const Nt=wt.get(E.texture),Ht=O||0;C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,Nt.__webglTexture,$||0,Ht)}D=-1},this.readRenderTargetPixels=function(E,O,$,X,F,dt,yt){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let It=wt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&yt!==void 0&&(It=It[yt]),It){mt.bindFramebuffer(C.FRAMEBUFFER,It);try{const Nt=E.texture,Ht=Nt.format,Vt=Nt.type;if(!ct.textureFormatReadable(Ht)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ct.textureTypeReadable(Vt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=E.width-X&&$>=0&&$<=E.height-F&&C.readPixels(O,$,X,F,qt.convert(Ht),qt.convert(Vt),dt)}finally{const Nt=A!==null?wt.get(A).__webglFramebuffer:null;mt.bindFramebuffer(C.FRAMEBUFFER,Nt)}}},this.readRenderTargetPixelsAsync=async function(E,O,$,X,F,dt,yt){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let It=wt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&yt!==void 0&&(It=It[yt]),It){const Nt=E.texture,Ht=Nt.format,Vt=Nt.type;if(!ct.textureFormatReadable(Ht))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ct.textureTypeReadable(Vt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=E.width-X&&$>=0&&$<=E.height-F){mt.bindFramebuffer(C.FRAMEBUFFER,It);const Ft=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,Ft),C.bufferData(C.PIXEL_PACK_BUFFER,dt.byteLength,C.STREAM_READ),C.readPixels(O,$,X,F,qt.convert(Ht),qt.convert(Vt),0);const ce=A!==null?wt.get(A).__webglFramebuffer:null;mt.bindFramebuffer(C.FRAMEBUFFER,ce);const ge=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await cp(C,ge,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,Ft),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,dt),C.deleteBuffer(Ft),C.deleteSync(ge),dt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,O=null,$=0){E.isTexture!==!0&&(co("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,E=arguments[1]);const X=Math.pow(2,-$),F=Math.floor(E.image.width*X),dt=Math.floor(E.image.height*X),yt=O!==null?O.x:0,It=O!==null?O.y:0;T.setTexture2D(E,0),C.copyTexSubImage2D(C.TEXTURE_2D,$,0,0,yt,It,F,dt),mt.unbindTexture()},this.copyTextureToTexture=function(E,O,$=null,X=null,F=0){E.isTexture!==!0&&(co("WebGLRenderer: copyTextureToTexture function signature has changed."),X=arguments[0]||null,E=arguments[1],O=arguments[2],F=arguments[3]||0,$=null);let dt,yt,It,Nt,Ht,Vt;$!==null?(dt=$.max.x-$.min.x,yt=$.max.y-$.min.y,It=$.min.x,Nt=$.min.y):(dt=E.image.width,yt=E.image.height,It=0,Nt=0),X!==null?(Ht=X.x,Vt=X.y):(Ht=0,Vt=0);const Ft=qt.convert(O.format),ce=qt.convert(O.type);T.setTexture2D(O,0),C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,O.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,O.unpackAlignment);const ge=C.getParameter(C.UNPACK_ROW_LENGTH),ye=C.getParameter(C.UNPACK_IMAGE_HEIGHT),ln=C.getParameter(C.UNPACK_SKIP_PIXELS),oe=C.getParameter(C.UNPACK_SKIP_ROWS),Bt=C.getParameter(C.UNPACK_SKIP_IMAGES),Ve=E.isCompressedTexture?E.mipmaps[F]:E.image;C.pixelStorei(C.UNPACK_ROW_LENGTH,Ve.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Ve.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,It),C.pixelStorei(C.UNPACK_SKIP_ROWS,Nt),E.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,F,Ht,Vt,dt,yt,Ft,ce,Ve.data):E.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,F,Ht,Vt,Ve.width,Ve.height,Ft,Ve.data):C.texSubImage2D(C.TEXTURE_2D,F,Ht,Vt,dt,yt,Ft,ce,Ve),C.pixelStorei(C.UNPACK_ROW_LENGTH,ge),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,ye),C.pixelStorei(C.UNPACK_SKIP_PIXELS,ln),C.pixelStorei(C.UNPACK_SKIP_ROWS,oe),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Bt),F===0&&O.generateMipmaps&&C.generateMipmap(C.TEXTURE_2D),mt.unbindTexture()},this.copyTextureToTexture3D=function(E,O,$=null,X=null,F=0){E.isTexture!==!0&&(co("WebGLRenderer: copyTextureToTexture3D function signature has changed."),$=arguments[0]||null,X=arguments[1]||null,E=arguments[2],O=arguments[3],F=arguments[4]||0);let dt,yt,It,Nt,Ht,Vt,Ft,ce,ge;const ye=E.isCompressedTexture?E.mipmaps[F]:E.image;$!==null?(dt=$.max.x-$.min.x,yt=$.max.y-$.min.y,It=$.max.z-$.min.z,Nt=$.min.x,Ht=$.min.y,Vt=$.min.z):(dt=ye.width,yt=ye.height,It=ye.depth,Nt=0,Ht=0,Vt=0),X!==null?(Ft=X.x,ce=X.y,ge=X.z):(Ft=0,ce=0,ge=0);const ln=qt.convert(O.format),oe=qt.convert(O.type);let Bt;if(O.isData3DTexture)T.setTexture3D(O,0),Bt=C.TEXTURE_3D;else if(O.isDataArrayTexture||O.isCompressedArrayTexture)T.setTexture2DArray(O,0),Bt=C.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,O.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,O.unpackAlignment);const Ve=C.getParameter(C.UNPACK_ROW_LENGTH),ae=C.getParameter(C.UNPACK_IMAGE_HEIGHT),Mn=C.getParameter(C.UNPACK_SKIP_PIXELS),$i=C.getParameter(C.UNPACK_SKIP_ROWS),cn=C.getParameter(C.UNPACK_SKIP_IMAGES);C.pixelStorei(C.UNPACK_ROW_LENGTH,ye.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,ye.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Nt),C.pixelStorei(C.UNPACK_SKIP_ROWS,Ht),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Vt),E.isDataTexture||E.isData3DTexture?C.texSubImage3D(Bt,F,Ft,ce,ge,dt,yt,It,ln,oe,ye.data):O.isCompressedArrayTexture?C.compressedTexSubImage3D(Bt,F,Ft,ce,ge,dt,yt,It,ln,ye.data):C.texSubImage3D(Bt,F,Ft,ce,ge,dt,yt,It,ln,oe,ye),C.pixelStorei(C.UNPACK_ROW_LENGTH,Ve),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,ae),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Mn),C.pixelStorei(C.UNPACK_SKIP_ROWS,$i),C.pixelStorei(C.UNPACK_SKIP_IMAGES,cn),F===0&&O.generateMipmaps&&C.generateMipmap(Bt),mt.unbindTexture()},this.initRenderTarget=function(E){wt.get(E).__webglFramebuffer===void 0&&T.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?T.setTextureCube(E,0):E.isData3DTexture?T.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?T.setTexture2DArray(E,0):T.setTexture2D(E,0),mt.unbindTexture()},this.resetState=function(){P=0,R=0,A=null,mt.reset(),me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Kn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===dc?"display-p3":"srgb",e.unpackColorSpace=le.workingColorSpace===Oo?"display-p3":"srgb"}}class yv extends Be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Un,this.environmentIntensity=1,this.environmentRotation=new Un,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class wv extends Qe{constructor(t=null,e=1,n=1,s,o,a,l,c,h=Je,u=Je,f,d){super(null,a,l,c,h,u,s,o,f,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Is extends Gi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Yt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const wo=new L,bo=new L,Hh=new pe,ks=new Fo,Gr=new cr,Ta=new L,Vh=new L;class gc extends Be{constructor(t=new Te,e=new Is){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,o=e.count;s<o;s++)wo.fromBufferAttribute(e,s-1),bo.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=wo.distanceTo(bo);t.setAttribute("lineDistance",new re(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,o=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Gr.copy(n.boundingSphere),Gr.applyMatrix4(s),Gr.radius+=o,t.ray.intersectsSphere(Gr)===!1)return;Hh.copy(s).invert(),ks.copy(t.ray).applyMatrix4(Hh);const l=o/((this.scale.x+this.scale.y+this.scale.z)/3),c=l*l,h=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){const p=Math.max(0,a.start),x=Math.min(u.count,a.start+a.count);for(let v=p,m=x-1;v<m;v+=h){const g=u.getX(v),y=u.getX(v+1),_=Hr(this,t,ks,c,g,y);_&&e.push(_)}if(this.isLineLoop){const v=u.getX(x-1),m=u.getX(p),g=Hr(this,t,ks,c,v,m);g&&e.push(g)}}else{const p=Math.max(0,a.start),x=Math.min(d.count,a.start+a.count);for(let v=p,m=x-1;v<m;v+=h){const g=Hr(this,t,ks,c,v,v+1);g&&e.push(g)}if(this.isLineLoop){const v=Hr(this,t,ks,c,x-1,p);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=s.length;o<a;o++){const l=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=o}}}}}function Hr(i,t,e,n,s,o){const a=i.geometry.attributes.position;if(wo.fromBufferAttribute(a,s),bo.fromBufferAttribute(a,o),e.distanceSqToSegment(wo,bo,Ta,Vh)>n)return;Ta.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Ta);if(!(c<t.near||c>t.far))return{distance:c,point:Vh.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const Wh=new L,$h=new L;class xc extends gc{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,o=e.count;s<o;s+=2)Wh.fromBufferAttribute(e,s),$h.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Wh.distanceTo($h);t.setAttribute("lineDistance",new re(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class bv extends gc{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}}class Qu extends Gi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Yt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Xh=new pe,kl=new Fo,Vr=new cr,Wr=new L;class Ev extends Be{constructor(t=new Te,e=new Qu){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,o=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Vr.copy(n.boundingSphere),Vr.applyMatrix4(s),Vr.radius+=o,t.ray.intersectsSphere(Vr)===!1)return;Xh.copy(s).invert(),kl.copy(t.ray).applyMatrix4(Xh);const l=o/((this.scale.x+this.scale.y+this.scale.z)/3),c=l*l,h=n.index,f=n.attributes.position;if(h!==null){const d=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let x=d,v=p;x<v;x++){const m=h.getX(x);Wr.fromBufferAttribute(f,m),qh(Wr,m,c,s,t,e,this)}}else{const d=Math.max(0,a.start),p=Math.min(f.count,a.start+a.count);for(let x=d,v=p;x<v;x++)Wr.fromBufferAttribute(f,x),qh(Wr,x,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=s.length;o<a;o++){const l=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=o}}}}}function qh(i,t,e,n,s,o,a){const l=kl.distanceSqToPoint(i);if(l<e){const c=new L;kl.closestPointToPoint(i,c),c.applyMatrix4(n);const h=s.ray.origin.distanceTo(c);if(h<s.near||h>s.far)return;o.push({distance:h,distanceToRay:Math.sqrt(l),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class kn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),o=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),o+=n.distanceTo(s),e.push(o),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const o=n.length;let a;e?a=e:a=t*n[o-1];let l=0,c=o-1,h;for(;l<=c;)if(s=Math.floor(l+(c-l)/2),h=n[s]-a,h<0)l=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(o-1);const u=n[s],d=n[s+1]-u,p=(a-u)/d;return(s+p)/(o-1)}getTangent(t,e){let s=t-1e-4,o=t+1e-4;s<0&&(s=0),o>1&&(o=1);const a=this.getPoint(s),l=this.getPoint(o),c=e||(a.isVector2?new ht:new L);return c.copy(l).sub(a).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new L,s=[],o=[],a=[],l=new L,c=new pe;for(let p=0;p<=t;p++){const x=p/t;s[p]=this.getTangentAt(x,new L)}o[0]=new L,a[0]=new L;let h=Number.MAX_VALUE;const u=Math.abs(s[0].x),f=Math.abs(s[0].y),d=Math.abs(s[0].z);u<=h&&(h=u,n.set(1,0,0)),f<=h&&(h=f,n.set(0,1,0)),d<=h&&n.set(0,0,1),l.crossVectors(s[0],n).normalize(),o[0].crossVectors(s[0],l),a[0].crossVectors(s[0],o[0]);for(let p=1;p<=t;p++){if(o[p]=o[p-1].clone(),a[p]=a[p-1].clone(),l.crossVectors(s[p-1],s[p]),l.length()>Number.EPSILON){l.normalize();const x=Math.acos($e(s[p-1].dot(s[p]),-1,1));o[p].applyMatrix4(c.makeRotationAxis(l,x))}a[p].crossVectors(s[p],o[p])}if(e===!0){let p=Math.acos($e(o[0].dot(o[t]),-1,1));p/=t,s[0].dot(l.crossVectors(o[0],o[t]))>0&&(p=-p);for(let x=1;x<=t;x++)o[x].applyMatrix4(c.makeRotationAxis(s[x],p*x)),a[x].crossVectors(s[x],o[x])}return{tangents:s,normals:o,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class vc extends kn{constructor(t=0,e=0,n=1,s=1,o=0,a=Math.PI*2,l=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=o,this.aEndAngle=a,this.aClockwise=l,this.aRotation=c}getPoint(t,e=new ht){const n=e,s=Math.PI*2;let o=this.aEndAngle-this.aStartAngle;const a=Math.abs(o)<Number.EPSILON;for(;o<0;)o+=s;for(;o>s;)o-=s;o<Number.EPSILON&&(a?o=0:o=s),this.aClockwise===!0&&!a&&(o===s?o=-s:o=o-s);const l=this.aStartAngle+t*o;let c=this.aX+this.xRadius*Math.cos(l),h=this.aY+this.yRadius*Math.sin(l);if(this.aRotation!==0){const u=Math.cos(this.aRotation),f=Math.sin(this.aRotation),d=c-this.aX,p=h-this.aY;c=d*u-p*f+this.aX,h=d*f+p*u+this.aY}return n.set(c,h)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Tv extends vc{constructor(t,e,n,s,o,a){super(t,e,n,n,s,o,a),this.isArcCurve=!0,this.type="ArcCurve"}}function _c(){let i=0,t=0,e=0,n=0;function s(o,a,l,c){i=o,t=l,e=-3*o+3*a-2*l-c,n=2*o-2*a+l+c}return{initCatmullRom:function(o,a,l,c,h){s(a,l,h*(l-o),h*(c-a))},initNonuniformCatmullRom:function(o,a,l,c,h,u,f){let d=(a-o)/h-(l-o)/(h+u)+(l-a)/u,p=(l-a)/u-(c-a)/(u+f)+(c-l)/f;d*=u,p*=u,s(a,l,d,p)},calc:function(o){const a=o*o,l=a*o;return i+t*o+e*a+n*l}}}const $r=new L,Aa=new _c,Ca=new _c,Ra=new _c;class Av extends kn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new L){const n=e,s=this.points,o=s.length,a=(o-(this.closed?0:1))*t;let l=Math.floor(a),c=a-l;this.closed?l+=l>0?0:(Math.floor(Math.abs(l)/o)+1)*o:c===0&&l===o-1&&(l=o-2,c=1);let h,u;this.closed||l>0?h=s[(l-1)%o]:($r.subVectors(s[0],s[1]).add(s[0]),h=$r);const f=s[l%o],d=s[(l+1)%o];if(this.closed||l+2<o?u=s[(l+2)%o]:($r.subVectors(s[o-1],s[o-2]).add(s[o-1]),u=$r),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let x=Math.pow(h.distanceToSquared(f),p),v=Math.pow(f.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(u),p);v<1e-4&&(v=1),x<1e-4&&(x=v),m<1e-4&&(m=v),Aa.initNonuniformCatmullRom(h.x,f.x,d.x,u.x,x,v,m),Ca.initNonuniformCatmullRom(h.y,f.y,d.y,u.y,x,v,m),Ra.initNonuniformCatmullRom(h.z,f.z,d.z,u.z,x,v,m)}else this.curveType==="catmullrom"&&(Aa.initCatmullRom(h.x,f.x,d.x,u.x,this.tension),Ca.initCatmullRom(h.y,f.y,d.y,u.y,this.tension),Ra.initCatmullRom(h.z,f.z,d.z,u.z,this.tension));return n.set(Aa.calc(c),Ca.calc(c),Ra.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new L().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Yh(i,t,e,n,s){const o=(n-t)*.5,a=(s-e)*.5,l=i*i,c=i*l;return(2*e-2*n+o+a)*c+(-3*e+3*n-2*o-a)*l+o*i+e}function Cv(i,t){const e=1-i;return e*e*t}function Rv(i,t){return 2*(1-i)*i*t}function Pv(i,t){return i*i*t}function Xs(i,t,e,n){return Cv(i,t)+Rv(i,e)+Pv(i,n)}function Iv(i,t){const e=1-i;return e*e*e*t}function Lv(i,t){const e=1-i;return 3*e*e*i*t}function Dv(i,t){return 3*(1-i)*i*i*t}function Uv(i,t){return i*i*i*t}function qs(i,t,e,n,s){return Iv(i,t)+Lv(i,e)+Dv(i,n)+Uv(i,s)}class td extends kn{constructor(t=new ht,e=new ht,n=new ht,s=new ht){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ht){const n=e,s=this.v0,o=this.v1,a=this.v2,l=this.v3;return n.set(qs(t,s.x,o.x,a.x,l.x),qs(t,s.y,o.y,a.y,l.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Nv extends kn{constructor(t=new L,e=new L,n=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new L){const n=e,s=this.v0,o=this.v1,a=this.v2,l=this.v3;return n.set(qs(t,s.x,o.x,a.x,l.x),qs(t,s.y,o.y,a.y,l.y),qs(t,s.z,o.z,a.z,l.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class ed extends kn{constructor(t=new ht,e=new ht){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ht){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ht){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ov extends kn{constructor(t=new L,e=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new L){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new L){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class nd extends kn{constructor(t=new ht,e=new ht,n=new ht){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ht){const n=e,s=this.v0,o=this.v1,a=this.v2;return n.set(Xs(t,s.x,o.x,a.x),Xs(t,s.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Fv extends kn{constructor(t=new L,e=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new L){const n=e,s=this.v0,o=this.v1,a=this.v2;return n.set(Xs(t,s.x,o.x,a.x),Xs(t,s.y,o.y,a.y),Xs(t,s.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class id extends kn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ht){const n=e,s=this.points,o=(s.length-1)*t,a=Math.floor(o),l=o-a,c=s[a===0?a:a-1],h=s[a],u=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return n.set(Yh(l,c.x,h.x,u.x,f.x),Yh(l,c.y,h.y,u.y,f.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ht().fromArray(s))}return this}}var Bl=Object.freeze({__proto__:null,ArcCurve:Tv,CatmullRomCurve3:Av,CubicBezierCurve:td,CubicBezierCurve3:Nv,EllipseCurve:vc,LineCurve:ed,LineCurve3:Ov,QuadraticBezierCurve:nd,QuadraticBezierCurve3:Fv,SplineCurve:id});class kv extends kn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Bl[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let o=0;for(;o<s.length;){if(s[o]>=n){const a=s[o]-n,l=this.curves[o],c=l.getLength(),h=c===0?0:1-a/c;return l.getPointAt(h,e)}o++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,o=this.curves;s<o.length;s++){const a=o[s],l=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(l);for(let h=0;h<c.length;h++){const u=c[h];n&&n.equals(u)||(e.push(u),n=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Bl[s.type]().fromJSON(s))}return this}}class jh extends kv{constructor(t){super(),this.type="Path",this.currentPoint=new ht,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new ed(this.currentPoint.clone(),new ht(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const o=new nd(this.currentPoint.clone(),new ht(t,e),new ht(n,s));return this.curves.push(o),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,o,a){const l=new td(this.currentPoint.clone(),new ht(t,e),new ht(n,s),new ht(o,a));return this.curves.push(l),this.currentPoint.set(o,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new id(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,o,a){const l=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+l,e+c,n,s,o,a),this}absarc(t,e,n,s,o,a){return this.absellipse(t,e,n,n,s,o,a),this}ellipse(t,e,n,s,o,a,l,c){const h=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+h,e+u,n,s,o,a,l,c),this}absellipse(t,e,n,s,o,a,l,c){const h=new vc(t,e,n,s,o,a,l,c);if(this.curves.length>0){const f=h.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(h);const u=h.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Bo extends Te{constructor(t=[new ht(0,-.5),new ht(.5,0),new ht(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=$e(s,0,Math.PI*2);const o=[],a=[],l=[],c=[],h=[],u=1/e,f=new L,d=new ht,p=new L,x=new L,v=new L;let m=0,g=0;for(let y=0;y<=t.length-1;y++)switch(y){case 0:m=t[y+1].x-t[y].x,g=t[y+1].y-t[y].y,p.x=g*1,p.y=-m,p.z=g*0,v.copy(p),p.normalize(),c.push(p.x,p.y,p.z);break;case t.length-1:c.push(v.x,v.y,v.z);break;default:m=t[y+1].x-t[y].x,g=t[y+1].y-t[y].y,p.x=g*1,p.y=-m,p.z=g*0,x.copy(p),p.x+=v.x,p.y+=v.y,p.z+=v.z,p.normalize(),c.push(p.x,p.y,p.z),v.copy(x)}for(let y=0;y<=e;y++){const _=n+y*u*s,w=Math.sin(_),P=Math.cos(_);for(let R=0;R<=t.length-1;R++){f.x=t[R].x*w,f.y=t[R].y,f.z=t[R].x*P,a.push(f.x,f.y,f.z),d.x=y/e,d.y=R/(t.length-1),l.push(d.x,d.y);const A=c[3*R+0]*w,D=c[3*R+1],K=c[3*R+0]*P;h.push(A,D,K)}}for(let y=0;y<e;y++)for(let _=0;_<t.length-1;_++){const w=_+y*t.length,P=w,R=w+t.length,A=w+t.length+1,D=w+1;o.push(P,R,D),o.push(A,D,R)}this.setIndex(o),this.setAttribute("position",new re(a,3)),this.setAttribute("uv",new re(l,2)),this.setAttribute("normal",new re(h,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Bo(t.points,t.segments,t.phiStart,t.phiLength)}}class zo extends Te{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const o=[],a=[],l=[],c=[],h=new L,u=new ht;a.push(0,0,0),l.push(0,0,1),c.push(.5,.5);for(let f=0,d=3;f<=e;f++,d+=3){const p=n+f/e*s;h.x=t*Math.cos(p),h.y=t*Math.sin(p),a.push(h.x,h.y,h.z),l.push(0,0,1),u.x=(a[d]/t+1)/2,u.y=(a[d+1]/t+1)/2,c.push(u.x,u.y)}for(let f=1;f<=e;f++)o.push(f,f+1,0);this.setIndex(o),this.setAttribute("position",new re(a,3)),this.setAttribute("normal",new re(l,3)),this.setAttribute("uv",new re(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zo(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class mn extends Te{constructor(t=1,e=1,n=1,s=32,o=1,a=!1,l=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:o,openEnded:a,thetaStart:l,thetaLength:c};const h=this;s=Math.floor(s),o=Math.floor(o);const u=[],f=[],d=[],p=[];let x=0;const v=[],m=n/2;let g=0;y(),a===!1&&(t>0&&_(!0),e>0&&_(!1)),this.setIndex(u),this.setAttribute("position",new re(f,3)),this.setAttribute("normal",new re(d,3)),this.setAttribute("uv",new re(p,2));function y(){const w=new L,P=new L;let R=0;const A=(e-t)/n;for(let D=0;D<=o;D++){const K=[],M=D/o,b=M*(e-t)+t;for(let z=0;z<=s;z++){const G=z/s,N=G*c+l,k=Math.sin(N),I=Math.cos(N);P.x=b*k,P.y=-M*n+m,P.z=b*I,f.push(P.x,P.y,P.z),w.set(k,A,I).normalize(),d.push(w.x,w.y,w.z),p.push(G,1-M),K.push(x++)}v.push(K)}for(let D=0;D<s;D++)for(let K=0;K<o;K++){const M=v[K][D],b=v[K+1][D],z=v[K+1][D+1],G=v[K][D+1];t>0&&(u.push(M,b,G),R+=3),e>0&&(u.push(b,z,G),R+=3)}h.addGroup(g,R,0),g+=R}function _(w){const P=x,R=new ht,A=new L;let D=0;const K=w===!0?t:e,M=w===!0?1:-1;for(let z=1;z<=s;z++)f.push(0,m*M,0),d.push(0,M,0),p.push(.5,.5),x++;const b=x;for(let z=0;z<=s;z++){const N=z/s*c+l,k=Math.cos(N),I=Math.sin(N);A.x=K*I,A.y=m*M,A.z=K*k,f.push(A.x,A.y,A.z),d.push(0,M,0),R.x=k*.5+.5,R.y=I*.5*M+.5,p.push(R.x,R.y),x++}for(let z=0;z<s;z++){const G=P+z,N=b+z;w===!0?u.push(N,N+1,G):u.push(N+1,N,G),D+=3}h.addGroup(g,D,w===!0?1:2),g+=D}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new mn(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Zs extends jh{constructor(t){super(t),this.uuid=Rs(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new jh().fromJSON(s))}return this}}const Bv={triangulate:function(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let o=sd(i,0,s,e,!0);const a=[];if(!o||o.next===o.prev)return a;let l,c,h,u,f,d,p;if(n&&(o=Wv(i,t,o,e)),i.length>80*e){l=h=i[0],c=u=i[1];for(let x=e;x<s;x+=e)f=i[x],d=i[x+1],f<l&&(l=f),d<c&&(c=d),f>h&&(h=f),d>u&&(u=d);p=Math.max(h-l,u-c),p=p!==0?32767/p:0}return Js(o,a,e,l,c,p,0),a}};function sd(i,t,e,n,s){let o,a;if(s===e_(i,t,e,n)>0)for(o=t;o<e;o+=n)a=Kh(o,i[o],i[o+1],a);else for(o=e-n;o>=t;o-=n)a=Kh(o,i[o],i[o+1],a);return a&&Go(a,a.next)&&(tr(a),a=a.next),a}function zi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Go(e,e.next)||Se(e.prev,e,e.next)===0)){if(tr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Js(i,t,e,n,s,o,a){if(!i)return;!a&&o&&jv(i,n,s,o);let l=i,c,h;for(;i.prev!==i.next;){if(c=i.prev,h=i.next,o?Gv(i,n,s,o):zv(i)){t.push(c.i/e|0),t.push(i.i/e|0),t.push(h.i/e|0),tr(i),i=h.next,l=h.next;continue}if(i=h,i===l){a?a===1?(i=Hv(zi(i),t,e),Js(i,t,e,n,s,o,2)):a===2&&Vv(i,t,e,n,s,o):Js(zi(i),t,e,n,s,o,1);break}}}function zv(i){const t=i.prev,e=i,n=i.next;if(Se(t,e,n)>=0)return!1;const s=t.x,o=e.x,a=n.x,l=t.y,c=e.y,h=n.y,u=s<o?s<a?s:a:o<a?o:a,f=l<c?l<h?l:h:c<h?c:h,d=s>o?s>a?s:a:o>a?o:a,p=l>c?l>h?l:h:c>h?c:h;let x=n.next;for(;x!==t;){if(x.x>=u&&x.x<=d&&x.y>=f&&x.y<=p&&cs(s,l,o,c,a,h,x.x,x.y)&&Se(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function Gv(i,t,e,n){const s=i.prev,o=i,a=i.next;if(Se(s,o,a)>=0)return!1;const l=s.x,c=o.x,h=a.x,u=s.y,f=o.y,d=a.y,p=l<c?l<h?l:h:c<h?c:h,x=u<f?u<d?u:d:f<d?f:d,v=l>c?l>h?l:h:c>h?c:h,m=u>f?u>d?u:d:f>d?f:d,g=zl(p,x,t,e,n),y=zl(v,m,t,e,n);let _=i.prevZ,w=i.nextZ;for(;_&&_.z>=g&&w&&w.z<=y;){if(_.x>=p&&_.x<=v&&_.y>=x&&_.y<=m&&_!==s&&_!==a&&cs(l,u,c,f,h,d,_.x,_.y)&&Se(_.prev,_,_.next)>=0||(_=_.prevZ,w.x>=p&&w.x<=v&&w.y>=x&&w.y<=m&&w!==s&&w!==a&&cs(l,u,c,f,h,d,w.x,w.y)&&Se(w.prev,w,w.next)>=0))return!1;w=w.nextZ}for(;_&&_.z>=g;){if(_.x>=p&&_.x<=v&&_.y>=x&&_.y<=m&&_!==s&&_!==a&&cs(l,u,c,f,h,d,_.x,_.y)&&Se(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;w&&w.z<=y;){if(w.x>=p&&w.x<=v&&w.y>=x&&w.y<=m&&w!==s&&w!==a&&cs(l,u,c,f,h,d,w.x,w.y)&&Se(w.prev,w,w.next)>=0)return!1;w=w.nextZ}return!0}function Hv(i,t,e){let n=i;do{const s=n.prev,o=n.next.next;!Go(s,o)&&rd(s,n,n.next,o)&&Qs(s,o)&&Qs(o,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(o.i/e|0),tr(n),tr(n.next),n=i=o),n=n.next}while(n!==i);return zi(n)}function Vv(i,t,e,n,s,o){let a=i;do{let l=a.next.next;for(;l!==a.prev;){if(a.i!==l.i&&Jv(a,l)){let c=od(a,l);a=zi(a,a.next),c=zi(c,c.next),Js(a,t,e,n,s,o,0),Js(c,t,e,n,s,o,0);return}l=l.next}a=a.next}while(a!==i)}function Wv(i,t,e,n){const s=[];let o,a,l,c,h;for(o=0,a=t.length;o<a;o++)l=t[o]*n,c=o<a-1?t[o+1]*n:i.length,h=sd(i,l,c,n,!1),h===h.next&&(h.steiner=!0),s.push(Zv(h));for(s.sort($v),o=0;o<s.length;o++)e=Xv(s[o],e);return e}function $v(i,t){return i.x-t.x}function Xv(i,t){const e=qv(i,t);if(!e)return t;const n=od(e,i);return zi(n,n.next),zi(e,e.next)}function qv(i,t){let e=t,n=-1/0,s;const o=i.x,a=i.y;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){const d=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=o&&d>n&&(n=d,s=e.x<e.next.x?e:e.next,d===o))return s}e=e.next}while(e!==t);if(!s)return null;const l=s,c=s.x,h=s.y;let u=1/0,f;e=s;do o>=e.x&&e.x>=c&&o!==e.x&&cs(a<h?o:n,a,c,h,a<h?n:o,a,e.x,e.y)&&(f=Math.abs(a-e.y)/(o-e.x),Qs(e,i)&&(f<u||f===u&&(e.x>s.x||e.x===s.x&&Yv(s,e)))&&(s=e,u=f)),e=e.next;while(e!==l);return s}function Yv(i,t){return Se(i.prev,i,t.prev)<0&&Se(t.next,i,i.next)<0}function jv(i,t,e,n){let s=i;do s.z===0&&(s.z=zl(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Kv(s)}function Kv(i){let t,e,n,s,o,a,l,c,h=1;do{for(e=i,i=null,o=null,a=0;e;){for(a++,n=e,l=0,t=0;t<h&&(l++,n=n.nextZ,!!n);t++);for(c=h;l>0||c>0&&n;)l!==0&&(c===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,l--):(s=n,n=n.nextZ,c--),o?o.nextZ=s:i=s,s.prevZ=o,o=s;e=n}o.nextZ=null,h*=2}while(a>1);return i}function zl(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Zv(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function cs(i,t,e,n,s,o,a,l){return(s-a)*(t-l)>=(i-a)*(o-l)&&(i-a)*(n-l)>=(e-a)*(t-l)&&(e-a)*(o-l)>=(s-a)*(n-l)}function Jv(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Qv(i,t)&&(Qs(i,t)&&Qs(t,i)&&t_(i,t)&&(Se(i.prev,i,t.prev)||Se(i,t.prev,t))||Go(i,t)&&Se(i.prev,i,i.next)>0&&Se(t.prev,t,t.next)>0)}function Se(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Go(i,t){return i.x===t.x&&i.y===t.y}function rd(i,t,e,n){const s=qr(Se(i,t,e)),o=qr(Se(i,t,n)),a=qr(Se(e,n,i)),l=qr(Se(e,n,t));return!!(s!==o&&a!==l||s===0&&Xr(i,e,t)||o===0&&Xr(i,n,t)||a===0&&Xr(e,i,n)||l===0&&Xr(e,t,n))}function Xr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function qr(i){return i>0?1:i<0?-1:0}function Qv(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&rd(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Qs(i,t){return Se(i.prev,i,i.next)<0?Se(i,t,i.next)>=0&&Se(i,i.prev,t)>=0:Se(i,t,i.prev)<0||Se(i,i.next,t)<0}function t_(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,o=(i.y+t.y)/2;do e.y>o!=e.next.y>o&&e.next.y!==e.y&&s<(e.next.x-e.x)*(o-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function od(i,t){const e=new Gl(i.i,i.x,i.y),n=new Gl(t.i,t.x,t.y),s=i.next,o=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,o.next=n,n.prev=o,n}function Kh(i,t,e,n){const s=new Gl(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function tr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Gl(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function e_(i,t,e,n){let s=0;for(let o=t,a=e-n;o<e;o+=n)s+=(i[a]-i[o])*(i[o+1]+i[a+1]),a=o;return s}class gi{static area(t){const e=t.length;let n=0;for(let s=e-1,o=0;o<e;s=o++)n+=t[s].x*t[o].y-t[o].x*t[s].y;return n*.5}static isClockWise(t){return gi.area(t)<0}static triangulateShape(t,e){const n=[],s=[],o=[];Zh(t),Jh(n,t);let a=t.length;e.forEach(Zh);for(let c=0;c<e.length;c++)s.push(a),a+=e[c].length,Jh(n,e[c]);const l=Bv.triangulate(n,s);for(let c=0;c<l.length;c+=3)o.push(l.slice(c,c+3));return o}}function Zh(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Jh(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class Mc extends Te{constructor(t=new Zs([new ht(.5,.5),new ht(-.5,.5),new ht(-.5,-.5),new ht(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],o=[];for(let l=0,c=t.length;l<c;l++){const h=t[l];a(h)}this.setAttribute("position",new re(s,3)),this.setAttribute("uv",new re(o,2)),this.computeVertexNormals();function a(l){const c=[],h=e.curveSegments!==void 0?e.curveSegments:12,u=e.steps!==void 0?e.steps:1,f=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,p=e.bevelThickness!==void 0?e.bevelThickness:.2,x=e.bevelSize!==void 0?e.bevelSize:p-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const g=e.extrudePath,y=e.UVGenerator!==void 0?e.UVGenerator:n_;let _,w=!1,P,R,A,D;g&&(_=g.getSpacedPoints(u),w=!0,d=!1,P=g.computeFrenetFrames(u,!1),R=new L,A=new L,D=new L),d||(m=0,p=0,x=0,v=0);const K=l.extractPoints(h);let M=K.shape;const b=K.holes;if(!gi.isClockWise(M)){M=M.reverse();for(let J=0,C=b.length;J<C;J++){const pt=b[J];gi.isClockWise(pt)&&(b[J]=pt.reverse())}}const G=gi.triangulateShape(M,b),N=M;for(let J=0,C=b.length;J<C;J++){const pt=b[J];M=M.concat(pt)}function k(J,C,pt){return C||console.error("THREE.ExtrudeGeometry: vec does not exist"),J.clone().addScaledVector(C,pt)}const I=M.length,W=G.length;function B(J,C,pt){let ft,ct,mt;const kt=J.x-C.x,wt=J.y-C.y,T=pt.x-J.x,S=pt.y-J.y,H=kt*kt+wt*wt,Q=kt*S-wt*T;if(Math.abs(Q)>Number.EPSILON){const st=Math.sqrt(H),tt=Math.sqrt(T*T+S*S),Ut=C.x-wt/st,vt=C.y+kt/st,Tt=pt.x-S/tt,Qt=pt.y+T/tt,ut=((Tt-Ut)*S-(Qt-vt)*T)/(kt*S-wt*T);ft=Ut+kt*ut-J.x,ct=vt+wt*ut-J.y;const At=ft*ft+ct*ct;if(At<=2)return new ht(ft,ct);mt=Math.sqrt(At/2)}else{let st=!1;kt>Number.EPSILON?T>Number.EPSILON&&(st=!0):kt<-Number.EPSILON?T<-Number.EPSILON&&(st=!0):Math.sign(wt)===Math.sign(S)&&(st=!0),st?(ft=-wt,ct=kt,mt=Math.sqrt(H)):(ft=kt,ct=wt,mt=Math.sqrt(H/2))}return new ht(ft/mt,ct/mt)}const Y=[];for(let J=0,C=N.length,pt=C-1,ft=J+1;J<C;J++,pt++,ft++)pt===C&&(pt=0),ft===C&&(ft=0),Y[J]=B(N[J],N[pt],N[ft]);const et=[];let j,xt=Y.concat();for(let J=0,C=b.length;J<C;J++){const pt=b[J];j=[];for(let ft=0,ct=pt.length,mt=ct-1,kt=ft+1;ft<ct;ft++,mt++,kt++)mt===ct&&(mt=0),kt===ct&&(kt=0),j[ft]=B(pt[ft],pt[mt],pt[kt]);et.push(j),xt=xt.concat(j)}for(let J=0;J<m;J++){const C=J/m,pt=p*Math.cos(C*Math.PI/2),ft=x*Math.sin(C*Math.PI/2)+v;for(let ct=0,mt=N.length;ct<mt;ct++){const kt=k(N[ct],Y[ct],ft);at(kt.x,kt.y,-pt)}for(let ct=0,mt=b.length;ct<mt;ct++){const kt=b[ct];j=et[ct];for(let wt=0,T=kt.length;wt<T;wt++){const S=k(kt[wt],j[wt],ft);at(S.x,S.y,-pt)}}}const Pt=x+v;for(let J=0;J<I;J++){const C=d?k(M[J],xt[J],Pt):M[J];w?(A.copy(P.normals[0]).multiplyScalar(C.x),R.copy(P.binormals[0]).multiplyScalar(C.y),D.copy(_[0]).add(A).add(R),at(D.x,D.y,D.z)):at(C.x,C.y,0)}for(let J=1;J<=u;J++)for(let C=0;C<I;C++){const pt=d?k(M[C],xt[C],Pt):M[C];w?(A.copy(P.normals[J]).multiplyScalar(pt.x),R.copy(P.binormals[J]).multiplyScalar(pt.y),D.copy(_[J]).add(A).add(R),at(D.x,D.y,D.z)):at(pt.x,pt.y,f/u*J)}for(let J=m-1;J>=0;J--){const C=J/m,pt=p*Math.cos(C*Math.PI/2),ft=x*Math.sin(C*Math.PI/2)+v;for(let ct=0,mt=N.length;ct<mt;ct++){const kt=k(N[ct],Y[ct],ft);at(kt.x,kt.y,f+pt)}for(let ct=0,mt=b.length;ct<mt;ct++){const kt=b[ct];j=et[ct];for(let wt=0,T=kt.length;wt<T;wt++){const S=k(kt[wt],j[wt],ft);w?at(S.x,S.y+_[u-1].y,_[u-1].x+pt):at(S.x,S.y,f+pt)}}}V(),Z();function V(){const J=s.length/3;if(d){let C=0,pt=I*C;for(let ft=0;ft<W;ft++){const ct=G[ft];Rt(ct[2]+pt,ct[1]+pt,ct[0]+pt)}C=u+m*2,pt=I*C;for(let ft=0;ft<W;ft++){const ct=G[ft];Rt(ct[0]+pt,ct[1]+pt,ct[2]+pt)}}else{for(let C=0;C<W;C++){const pt=G[C];Rt(pt[2],pt[1],pt[0])}for(let C=0;C<W;C++){const pt=G[C];Rt(pt[0]+I*u,pt[1]+I*u,pt[2]+I*u)}}n.addGroup(J,s.length/3-J,0)}function Z(){const J=s.length/3;let C=0;lt(N,C),C+=N.length;for(let pt=0,ft=b.length;pt<ft;pt++){const ct=b[pt];lt(ct,C),C+=ct.length}n.addGroup(J,s.length/3-J,1)}function lt(J,C){let pt=J.length;for(;--pt>=0;){const ft=pt;let ct=pt-1;ct<0&&(ct=J.length-1);for(let mt=0,kt=u+m*2;mt<kt;mt++){const wt=I*mt,T=I*(mt+1),S=C+ft+wt,H=C+ct+wt,Q=C+ct+T,st=C+ft+T;Ot(S,H,Q,st)}}}function at(J,C,pt){c.push(J),c.push(C),c.push(pt)}function Rt(J,C,pt){Gt(J),Gt(C),Gt(pt);const ft=s.length/3,ct=y.generateTopUV(n,s,ft-3,ft-2,ft-1);Xt(ct[0]),Xt(ct[1]),Xt(ct[2])}function Ot(J,C,pt,ft){Gt(J),Gt(C),Gt(ft),Gt(C),Gt(pt),Gt(ft);const ct=s.length/3,mt=y.generateSideWallUV(n,s,ct-6,ct-3,ct-2,ct-1);Xt(mt[0]),Xt(mt[1]),Xt(mt[3]),Xt(mt[1]),Xt(mt[2]),Xt(mt[3])}function Gt(J){s.push(c[J*3+0]),s.push(c[J*3+1]),s.push(c[J*3+2])}function Xt(J){o.push(J.x),o.push(J.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return i_(e,n,t)}static fromJSON(t,e){const n=[];for(let o=0,a=t.shapes.length;o<a;o++){const l=e[t.shapes[o]];n.push(l)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Bl[s.type]().fromJSON(s)),new Mc(n,t.options)}}const n_={generateTopUV:function(i,t,e,n,s){const o=t[e*3],a=t[e*3+1],l=t[n*3],c=t[n*3+1],h=t[s*3],u=t[s*3+1];return[new ht(o,a),new ht(l,c),new ht(h,u)]},generateSideWallUV:function(i,t,e,n,s,o){const a=t[e*3],l=t[e*3+1],c=t[e*3+2],h=t[n*3],u=t[n*3+1],f=t[n*3+2],d=t[s*3],p=t[s*3+1],x=t[s*3+2],v=t[o*3],m=t[o*3+1],g=t[o*3+2];return Math.abs(l-u)<Math.abs(a-h)?[new ht(a,1-c),new ht(h,1-f),new ht(d,1-x),new ht(v,1-g)]:[new ht(l,1-c),new ht(u,1-f),new ht(p,1-x),new ht(m,1-g)]}};function i_(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const o=i[n];e.shapes.push(o.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Eo extends Te{constructor(t=new Zs([new ht(0,.5),new ht(-.5,-.5),new ht(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],o=[],a=[];let l=0,c=0;if(Array.isArray(t)===!1)h(t);else for(let u=0;u<t.length;u++)h(t[u]),this.addGroup(l,c,u),l+=c,c=0;this.setIndex(n),this.setAttribute("position",new re(s,3)),this.setAttribute("normal",new re(o,3)),this.setAttribute("uv",new re(a,2));function h(u){const f=s.length/3,d=u.extractPoints(e);let p=d.shape;const x=d.holes;gi.isClockWise(p)===!1&&(p=p.reverse());for(let m=0,g=x.length;m<g;m++){const y=x[m];gi.isClockWise(y)===!0&&(x[m]=y.reverse())}const v=gi.triangulateShape(p,x);for(let m=0,g=x.length;m<g;m++){const y=x[m];p=p.concat(y)}for(let m=0,g=p.length;m<g;m++){const y=p[m];s.push(y.x,y.y,0),o.push(0,0,1),a.push(y.x,y.y)}for(let m=0,g=v.length;m<g;m++){const y=v[m],_=y[0]+f,w=y[1]+f,P=y[2]+f;n.push(_,w,P),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return s_(e,t)}static fromJSON(t,e){const n=[];for(let s=0,o=t.shapes.length;s<o;s++){const a=e[t.shapes[s]];n.push(a)}return new Eo(n,t.curveSegments)}}function s_(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class Ys extends Te{constructor(t=1,e=.4,n=12,s=48,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:o},n=Math.floor(n),s=Math.floor(s);const a=[],l=[],c=[],h=[],u=new L,f=new L,d=new L;for(let p=0;p<=n;p++)for(let x=0;x<=s;x++){const v=x/s*o,m=p/n*Math.PI*2;f.x=(t+e*Math.cos(m))*Math.cos(v),f.y=(t+e*Math.cos(m))*Math.sin(v),f.z=e*Math.sin(m),l.push(f.x,f.y,f.z),u.x=t*Math.cos(v),u.y=t*Math.sin(v),d.subVectors(f,u).normalize(),c.push(d.x,d.y,d.z),h.push(x/s),h.push(p/n)}for(let p=1;p<=n;p++)for(let x=1;x<=s;x++){const v=(s+1)*p+x-1,m=(s+1)*(p-1)+x-1,g=(s+1)*(p-1)+x,y=(s+1)*p+x;a.push(v,m,y),a.push(m,g,y)}this.setIndex(a),this.setAttribute("position",new re(l,3)),this.setAttribute("normal",new re(c,3)),this.setAttribute("uv",new re(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ys(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class ve extends Gi{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Yt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Nu,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Un,this.combine=rc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class r_ extends Is{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}}class ad extends Be{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Yt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class o_ extends ad{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Be.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Yt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Pa=new pe,Qh=new L,tu=new L;class a_{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ht(512,512),this.map=null,this.mapPass=null,this.matrix=new pe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new pc,this._frameExtents=new ht(1,1),this._viewportCount=1,this._viewports=[new Ee(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Qh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Qh),tu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(tu),e.updateMatrixWorld(),Pa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Pa),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Pa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class l_ extends a_{constructor(){super(new qu(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class c_ extends ad{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Be.DEFAULT_UP),this.updateMatrix(),this.target=new Be,this.shadow=new l_}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const eu=new pe;class h_{constructor(t,e,n=0,s=1/0){this.ray=new Fo(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new fc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return eu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(eu),this}intersectObject(t,e=!0,n=[]){return Hl(t,this,n,e),n.sort(nu),n}intersectObjects(t,e=!0,n=[]){for(let s=0,o=t.length;s<o;s++)Hl(t[s],this,n,e);return n.sort(nu),n}}function nu(i,t){return i.distance-t.distance}function Hl(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const o=i.children;for(let a=0,l=o.length;a<l;a++)Hl(o[a],t,e,!0)}}class Sc extends xc{constructor(t=10,e=10,n=4473924,s=8947848){n=new Yt(n),s=new Yt(s);const o=e/2,a=t/e,l=t/2,c=[],h=[];for(let d=0,p=0,x=-l;d<=e;d++,x+=a){c.push(-l,0,x,l,0,x),c.push(x,0,-l,x,0,l);const v=d===o?n:s;v.toArray(h,p),p+=3,v.toArray(h,p),p+=3,v.toArray(h,p),p+=3,v.toArray(h,p),p+=3}const u=new Te;u.setAttribute("position",new re(c,3)),u.setAttribute("color",new re(h,3));const f=new Is({vertexColors:!0,toneMapped:!1});super(u,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:sc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=sc);function hr(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),o={},a={},l=i[0].morphTargetsRelative,c=new Te;let h=0;for(let u=0;u<i.length;++u){const f=i[u];let d=0;if(e!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const p in f.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;o[p]===void 0&&(o[p]=[]),o[p].push(f.attributes[p]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(l!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const p in f.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;a[p]===void 0&&(a[p]=[]),a[p].push(f.morphAttributes[p])}if(t){let p;if(e)p=f.index.count;else if(f.attributes.position!==void 0)p=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,p,u),h+=p}}if(e){let u=0;const f=[];for(let d=0;d<i.length;++d){const p=i[d].index;for(let x=0;x<p.count;++x)f.push(p.getX(x)+u);u+=i[d].attributes.position.count}c.setIndex(f)}for(const u in o){const f=iu(o[u]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,f)}for(const u in a){const f=a[u][0].length;if(f===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let d=0;d<f;++d){const p=[];for(let v=0;v<a[u].length;++v)p.push(a[u][v][d]);const x=iu(p);if(!x)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(x)}}return c}function iu(i){let t,e,n,s=-1,o=0;for(let h=0;h<i.length;++h){const u=i[h];if(t===void 0&&(t=u.array.constructor),t!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=u.itemSize),e!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;o+=u.count*e}const a=new t(o),l=new on(a,e,n);let c=0;for(let h=0;h<i.length;++h){const u=i[h];if(u.isInterleavedBufferAttribute){const f=c/e;for(let d=0,p=u.count;d<p;d++)for(let x=0;x<e;x++){const v=u.getComponent(d,x);l.setComponent(d+f,x,v)}}else a.set(u.array,c);c+=u.count*e}return s!==void 0&&(l.gpuType=s),l}const Ia={},jt=(i,t,e={})=>Ia[i]||(Ia[i]=new ve({color:t,...e})),os=()=>jt("white",15855593),Le=()=>jt("metal",5988976),he=()=>jt("black",1382429),ci=()=>jt("dark",2765376),uo=()=>jt("screen",1784405,{emissive:928324}),La=()=>jt("drape",1844016),Mt=(i,t,e,n,s,o=0,a=0,l=0,c=0)=>{const h=new zt(new se(t,e,n),s);return h.position.set(o,a,l),h.rotation.x=c,i.add(h),h},De=(i,t,e,n,s,o=0,a=0,l=0,c=24)=>{const h=new zt(new mn(t,e,n,c),s);return h.position.set(o,a,l),i.add(h),h},hi=()=>jt("fabric",2832974),Yr=()=>jt("linen",16184559),Ce=()=>jt("chrome",13225686),Da=()=>jt("wood",9071179),Ri=()=>jt("orange",ne(nt.colors.highlight)),Bs=()=>jt("teal",ne(nt.colors.accent),{emissive:670260}),zs=()=>jt("rubber",1053206),jr=()=>jt("navy",728890),Ua=(i,t,e,n=0,s=32)=>{const o=new zt(new Bo(t.map(([a,l])=>new ht(a,l)),s),e);return o.position.y=n,i.add(o),o},de=(i,t,e,n,s,o=0,a=0,l=0,c=.04)=>{const h=new Zs,u=t/2-c,f=n/2-c;h.moveTo(-u,-n/2),h.lineTo(u,-n/2),h.quadraticCurveTo(t/2,-n/2,t/2,-f),h.lineTo(t/2,f),h.quadraticCurveTo(t/2,n/2,u,n/2),h.lineTo(-u,n/2),h.quadraticCurveTo(-t/2,n/2,-t/2,f),h.lineTo(-t/2,-f),h.quadraticCurveTo(-t/2,-n/2,-u,-n/2);const d=new Mc(h,{depth:e,bevelEnabled:!1,curveSegments:4}).rotateX(-Math.PI/2),p=new zt(d,s);return p.position.set(o,a-e/2,l),i.add(p),p},we=(i,t,e,n,s)=>{const o=new L(e[0]-t[0],e[1]-t[1],e[2]-t[2]),a=o.length(),l=new zt(new mn(n,n,a,8),s);return l.position.set((t[0]+e[0])/2,(t[1]+e[1])/2,(t[2]+e[2])/2),l.quaternion.setFromUnitVectors(new L(0,1,0),o.normalize()),i.add(l),l};function Kr(i,t,e,n,s,o,a=2.5,l=.05,c=0){const h=Math.max(4,Math.round(t*a)),u=t/h,f=[];for(let p=0;p<h;p++)f.push(new se(u*.78,e,.035).translate(c-t/2+u*(p+.5),n,s+(p%2?l:-l)));f.push(new se(t,e,.02).translate(c,n,s));const d=new zt(hr(f),o);return f.forEach(p=>p.dispose()),i.add(d),d}function Na(i,t,e,n,s,o=.04,a=.12,l=!0){de(i,t,e,a,he(),0,n,s,.03),Mt(i,t-o*2,e-o*2,.01,l?uo():he(),0,n,s+a/2+.006),Mt(i,t*.4,.03,.005,jt("logoStrip",3818322),0,n-e/2+.02,s+a/2+.004)}function u_(i,t,e={}){const n=new fe,{w:s,h:o}=i,a=i.d;if(typeof i.mesh=="function")return i.mesh(t,e);switch(i.shape){case"table":if(i.id==="conf"){de(n,s,.15,a,Da(),0,o-.075,0,.6);for(const l of[-1,1])Mt(n,.12,o-.15,a*.55,ci(),l*(s/2-1.2),(o-.15)/2),Mt(n,.3,.05,a*.7,ci(),l*(s/2-1.2),.025);Mt(n,.6,.02,.35,he(),0,o+.01)}else{Mt(n,s,.1,a,os(),0,o-.05),Kr(n,s-.02,o*.82,o-o*.82/2-.02,a/2-.03,Yr(),2,.012),Mt(n,s,.04,a,jt("edge",14605267),0,o-.1);for(const l of[-1,1])Mt(n,.02,o*.82,a,Yr(),l*(s/2-.01),o-o*.82/2-.02);for(const l of[-1,1])we(n,[l*(s/2-.4),0,-a/2+.2],[l*(s/2-.4),o-.1,-a/2+.2],.035,Le()),we(n,[l*(s/2-.4),0,a/2-.2],[l*(s/2-.4),o-.1,a/2-.2],.035,Le()),we(n,[l*(s/2-.4),.02,-a/2+.2],[l*(s/2-.4),.02,a/2-.2],.03,Le())}break;case"round":if(i.id==="hightop")Ua(n,[[.01,0],[s*.3,0],[s*.32,.05],[.12,.3],[.09,o*.55],[.16,o-.4],[s/2,o-.08],[s/2,o],[.01,o]],jt("spandex",16052974)),Mt(n,.02,.5,.01,Ri(),0,o*.5,.11);else{Ua(n,[[.01,o],[s/2,o],[s/2,o-.05],[s/2+.03,.02],[s/2+.03,0],[.01,0]],Yr(),0,48),De(n,s/2-.05,s/2-.05,.005,os(),0,o+.003,0,40);{const l=new zt(new Ys(s/2-.02,.025,6,48),Yr());l.rotation.x=Math.PI/2,l.position.y=o-.02,n.add(l)}}break;case"chair":if(i.id==="exec"){for(let c=0;c<5;c++){const h=c/5*Math.PI*2;we(n,[0,.25,0],[Math.sin(h)*(s/2-.1),.12,Math.cos(h)*(s/2-.1)],.05,he()),De(n,.07,.07,.1,zs(),Math.sin(h)*(s/2-.1),.06,Math.cos(h)*(s/2-.1),10)}De(n,.06,.06,1.1,Ce(),0,.8,0,12),de(n,s*.85,.3,a*.75,hi(),0,1.5,.05,.25);const l=de(n,s*.8,o-1.75,.25,hi(),0,1.65+(o-1.75)/2,-a/2+.3,.1);l.rotation.x=-.12;for(const c of[-1,1])we(n,[c*s*.4,1.45,0],[c*s*.4,2.05,0],.04,he()),Mt(n,.14,.06,.8,he(),c*s*.4,2.08,.05)}else{de(n,s,.22,a*.82,hi(),0,1.5,.08,.12);const l=de(n,s*.94,o-1.7,.16,hi(),0,1.62+(o-1.7)/2,-a/2+.12,.12);l.rotation.x=-.08,de(n,s*.92,.06,a*.74,jt("fabricHi",3491938),0,1.63,.1,.12),Mt(n,s*.96,.05,.05,Ce(),0,1.38,a/2-.1),we(n,[-(s/2-.1),.35,-a/2+.06],[s/2-.1,.35,-a/2+.06],.025,Ce());for(const c of[-1,1]){we(n,[c*(s/2-.1),.35,a/2-.13],[c*(s/2-.1),.35,-a/2+.06],.025,Ce());for(const h of[a/2-.12,-a/2+.06])De(n,.045,.045,.04,zs(),c*(s/2-.1),.02,h,8);we(n,[c*(s/2-.1),0,a/2-.12],[c*(s/2-.12),1.4,a/2-.18],.035,Ce()),we(n,[c*(s/2-.1),0,-a/2+.06],[c*(s/2-.12),o-.1,-a/2+.06],.035,Ce())}}break;case"stool":De(n,s/2,s/2-.03,.22,hi(),0,o-.11,0,28),De(n,.06,.06,o-.2,Ce(),0,(o-.2)/2,0,12),Ua(n,[[.01,0],[s*.42,0],[s*.42,.04],[.1,.12],[.01,.12]],Ce());{const l=new zt(new Ys(s*.35,.03,8,28),Ce());l.rotation.x=Math.PI/2,l.position.y=o*.35,n.add(l)}break;case"lounge":de(n,s-.6,.55,a-.5,hi(),0,.95,.15,.15),de(n,s,.7,a,jt("loungeBase",2240834),0,.5,0,.2),de(n,s,o-.85,.5,hi(),0,.85+(o-.85)/2,-a/2+.25,.2);for(const l of[-1,1])de(n,.4,1.95-.15,a,hi(),l*(s/2-.2),.15+1.8/2,0,.18);for(let l=1;l<3;l++)Mt(n,.02,.5,a-.6,jt("seam",2042682),-s/2+.3+(s-.6)/3*l,1,.15);for(const l of[-1,1])for(const c of[-1,1])De(n,.06,.05,.15,Ce(),l*(s/2-.3),.075,c*(a/2-.3),10);break;case"counter":de(n,s-.1,o-.25,a-.1,os(),0,.1+(o-.25)/2,0,.08),de(n,s,.1,a,ci(),0,o-.05,0,.1),Mt(n,s-.3,.1,a-.3,he(),0,.05),Mt(n,s-.5,o*.5,.01,jr(),0,o*.5,a/2-.04),Mt(n,s-.5,.08,.012,Ri(),0,o*.25,a/2-.035),Mt(n,s-.5,.04,.012,Bs(),0,o-.25,a/2-.035),we(n,[-s/2+.35,.5,a/2-.02],[s/2-.35,.5,a/2-.02],.035,Ce());for(const l of[-1,1])we(n,[l*(s/2-.35),.5,a/2-.02],[l*(s/2-.35),.5,a/2-.12],.03,Ce());Mt(n,s-.2,.05,.6,os(),0,o-.95,-a/2+.35);break;case"tv":{const l=i.panel;if(t==="wall")Na(n,s,l,l/2,0,.04,.2),Mt(n,s*.5,l*.5,.05,Le(),0,l/2,-.12);else{const c=o-l;Na(n,s,l,c+l/2,.08,.04,.16);for(const h of[-1,1])we(n,[h*s*.18,.25,0],[h*s*.18,c+l*.7,0],.07,he());we(n,[-s*.18,c*.45,0],[s*.18,c*.45,0],.04,he()),de(n,s*.6,.1,a*.9,he(),0,.2,0,.1),Mt(n,.12,c*.85,.06,jt("cable",2237997),0,.25+c*.42,-.1),Mt(n,s*.32,.04,.7,Le(),0,c*.55,.25);for(const h of[-1,1])for(const u of[-1,1])De(n,.07,.07,.06,zs(),h*s*.27,.07,u*a*.38,10)}break}case"screen":Mt(n,s-.1,o-1.7,.03,jt("scrnW",16448250),0,1.7+(o-1.7)/2),Mt(n,s,.18,.06,he(),0,o-.09),Mt(n,s,.4,.06,he(),0,1.65);for(const l of[-1,1])Mt(n,.08,o,.08,he(),l*(s/2-.04),o/2),we(n,[l*(s/2-.04),.02,-a/2],[l*(s/2-.04),.02,a/2],.04,Le());break;case"led":{const l=6.5616666666666665,c=o-l;Mt(n,s,l,.3,he(),0,c+l/2),Mt(n,s-.04,l-.04,.02,jt("led",1341352,{emissive:875910}),0,c+l/2,.16);const h=[];for(let f=1;f<6;f++){const d=-s/2+s/6*f;h.push(d,c,.175,d,c+l,.175)}for(let f=1;f<4;f++){const d=c+l/4*f;h.push(-s/2,d,.175,s/2,d,.175)}const u=new Te;u.setAttribute("position",new re(h,3));{const f=new xc(u,new Is({color:404029}));f.userData.ownMat=1,n.add(f)}for(const f of[-1,0,1])Mt(n,.2,c+.3,.2,Le(),f*(s/2-.5),(c+.3)/2,-.25),Mt(n,.25,.08,a,Le(),f*(s/2-.5),.04),we(n,[f*(s/2-.5),.05,a/2-.1],[f*(s/2-.5),c*.9,-.25],.04,Le());Mt(n,s,.12,.12,Le(),0,c-.06,-.2);for(const f of[c,c+l])Mt(n,s+.06,.06,.34,jt("ledFrame",790034),0,f,0);for(const f of[-1,1])Mt(n,.06,l,.34,jt("ledFrame",790034),f*(s/2+.01),c+l/2,0);break}case"ledposter":{const l=6.299212598425197,c=2.25/12,h=o-l,u=.04,f=!!e.joinL,d=!!e.joinR,p=h+l/2;de(n,s,.12,a,he(),0,.06,0,.03),Mt(n,s*.5,h-.12,c*.8,Le(),0,.12+(h-.12)/2,0);const x=Mt(n,s,l,c*.7,he(),0,p,0);x.name="posterCabinet";for(const[_,w,P]of[["bezelL",-1,!f],["bezelR",1,!d]])if(P){const R=Mt(n,u,l,c,he(),w*(s/2-u/2),p,0);R.name=_}for(const _ of[-1,1]){const w=Mt(n,s,u,c,he(),0,p+_*(l/2-u/2),0);w.name=_<0?"bezelB":"bezelT"}const v=-s/2+(f?-.003:u),m=s/2-(d?-.003:u),g=m-v,y=(v+m)/2;for(const _ of[-1,1]){const w=Mt(n,g,l-2*u,.01,jt("led",1341352,{emissive:875910}),y,p,_*(c/2+.006));w.name="posterScreen"}Mt(n,g,l*.18,.012,Ri(),y,h+l*.72,c/2+.012),Mt(n,g,l*.08,.012,Bs(),y,h+l*.3,c/2+.012);break}case"ledtrailer":{Mt(n,s*.7,.35,a*.8,ci(),0,2.4-.2),Mt(n,s*.72,1.2,a*.82,jt("trailer",15328991),0,2.4+.4),Mt(n,s*.72,.15,a*.83,Ri(),0,2.4+.75);for(const f of[-1,1]){const d=new zt(new mn(1.1,1.1,.7,20),zs());d.rotation.x=Math.PI/2,d.rotation.z=Math.PI/2,d.position.set(0,1.1,f*(a/2-.35)),d.rotation.set(Math.PI/2,0,0),n.add(d)}we(n,[s*.36,2.4-.2,0],[s/2,1.3,0],.12,ci());for(const f of[-1,1])for(const d of[-1,1])we(n,[f*s*.3,2.4-.3,d*a*.35],[f*s*.34,.05,d*a*.45],.08,Le());Mt(n,.5,o-2.4-7*.5,.5,Le(),0,2.4+1+(o-2.4-1-7)/2,0);const u=o-7/2;Mt(n,12+.3,7+.3,.6,he(),0,u,0),Mt(n,12,7,.02,jt("led",1341352,{emissive:875910}),0,u,.31);break}case"laptop":{de(n,s,.05,a,jt("alu",12172999),0,.025,0,.05),Mt(n,s*.86,.005,a*.42,he(),0,.052,-a*.1),Mt(n,s*.36,.004,a*.24,jt("pad",10922932),0,.052,a*.3),De(n,.02,.02,s*.7,jt("alu",12172999),0,.05,-a/2+.02,8).rotation.z=Math.PI/2,Mt(n,s*.8,.004,.01,jt("keys",2764341),0,.054,a*.12);const l=new fe;l.position.set(0,.05,-a/2+.01),l.rotation.x=-.28,de(l,s,a*.95,.025,jt("alu",12172999),0,a*.475,0,.04),Mt(l,s-.06,a*.86,.004,uo(),0,a*.48,.015),n.add(l);break}case"ipad":{de(n,s*.55,.03,a*.75,Le(),0,.015,0,.05);const l=new fe;l.position.set(0,.06,-.05),l.rotation.x=-.35,we(n,[0,.03,-.05],[0,.3,-.12],.025,Le()),de(l,s,o-.15,.025,jt("ipadG",3159100),0,(o-.15)/2+.1,.02,.05),Mt(l,s-.06,o-.21,.004,uo(),0,(o-.15)/2+.1,.034),n.add(l);break}case"monitor":{const c=o-.6;Na(n,s,1.2,c,.05,.03,.07),we(n,[0,.03,-.05],[0,c-.1,-.05],.04,Le()),de(n,.75,.04,a*.85,Le(),0,.02,-.02,.15),Mt(n,.25,.25,.04,Le(),0,c,0);break}case"kiosk":de(n,s,.08,a,ci(),0,.04,0,.15),de(n,s*.7,o-.3,.35,os(),0,.08+(o-.3)/2,-.05,.1);{const l=new fe;l.position.set(0,o-1.4,.13),l.rotation.x=-.12,Mt(l,s*.62,1.45,.06,he(),0,.7),Mt(l,s*.56,1.35,.005,uo(),0,.7,.033),n.add(l)}Mt(n,s*.7,.12,.36,Ri(),0,o-.06,-.05),Mt(n,s*.5,.5,.005,jr(),0,.9,.13),Mt(n,.28,.18,.12,he(),s*.22,o-1.75,.17),Mt(n,.2,.02,.01,Bs(),s*.22,o-1.7,.235);for(const l of[-1,1])Mt(n,.05,.4,.006,jt("grille",2303790),l*s*.28,o-.7,.17);break;case"tower":de(n,s,o,a,ci(),0,o/2,0,.04),Mt(n,.012,o*.7,a*.7,jt("vent",1712169),s/2+.001,o*.5),Mt(n,s-.08,.03,.01,Bs(),0,o-.1,a/2+.006),De(n,.03,.03,.01,Ce(),0,o-.25,a/2+.005,12).rotation.x=Math.PI/2;break;case"speaker":{for(let c=0;c<3;c++){const h=c*2*Math.PI/3;we(n,[0,o*.35,0],[Math.sin(h)*s*.55,.02,Math.cos(h)*s*.55],.035,he())}De(n,.045,.045,o-1.9,he(),0,(o-1.9)/2,0,10),de(n,s*.95,1.9,a*.8,he(),0,o-.95,0,.08);const l=a*.8/2+.004;Mt(n,s*.85,1.75,.008,jt("grille",2303790),0,o-.95,l),De(n,.02,.02,.01,Bs(),s*.3,o-.15,l+.004,8).rotation.x=Math.PI/2;break}case"podium":de(n,s,o-.25,a*.8,Da(),0,(o-.25)/2,-a*.05,.08),Mt(n,s*.8,.9,.01,jr(),0,o*.55,a*.35+.006),Mt(n,s*.8,.05,.012,Ri(),0,o*.55-.5,a*.35+.007);{const l=Mt(n,s,.08,a,Da(),0,o-.12,0);l.rotation.x=.25}we(n,[.3,o-.08,.1],[.3,o+.4,.3],.012,he());break;case"powerbox":de(n,s,o-.3,a,ci(),0,.3+(o-.3)/2,0,.06),Mt(n,s+.02,.1,a+.02,jt("yellow",15909424),0,o-.2),Mt(n,s*.7,o*.35,.01,he(),0,o*.5,a/2+.006);for(let l=0;l<4;l++)De(n,.06,.06,.02,jt("yellow",15909424),-s*.25+s*.5*l/3,o*.5,a/2+.015,10).rotation.x=Math.PI/2;for(const l of[-1,1]){Mt(n,.05,.05,a*.6,Ce(),l*(s/2+.04),o-.5);for(const c of[-1,1])De(n,.13,.13,.08,zs(),l*(s/2-.2),.13,c*(a/2-.2),12).rotation.z=Math.PI/2}we(n,[-s*.25,o,0],[s*.25,o,0],.03,Ce());{const l=new zt(new Ys(.28,.05,6,20),he());l.rotation.x=Math.PI/2,l.position.set(s/2-.4,.05,-a/2+.4),n.add(l)}["#c33","#222","#eee","#2a6","#36c"].forEach((l,c)=>De(n,.07,.07,.04,jt("cam"+c,l),-s/2+.35+c*.22,.55,a/2+.02,10).rotation.x=Math.PI/2);break;case"drape":for(const l of[-1,1])De(n,.04,.04,o,Ce(),l*(s/2-.3),o/2,0,10),de(n,.6,.04,.6,Le(),l*(s/2-.3),.02,0,.08);De(n,.035,.035,s,Ce(),0,o-.04,0,10).rotation.z=Math.PI/2,Kr(n,s-.1,o-.18,(o-.18)/2+.06,0,La(),2.5,.05);break;case"booth":{Mt(n,s,.04,a,jt("carpet",2242388),0,.02),Kr(n,s-.1,o-.2,(o-.2)/2+.05,-a/2+.12/2,La(),2,.035);for(const c of[-1,1]){const h=Kr(new fe,a-.12,i.sideH-.1,(i.sideH-.1)/2+.05,0,La(),2,.03);h.rotation.y=Math.PI/2,h.position.set(c*(s/2-.05),0,.12/2),n.add(h)}for(const c of[-1,1]){De(n,.04,.04,o,Ce(),c*s/2,o/2,-a/2,10),De(n,.04,.04,i.sideH,Ce(),c*s/2,i.sideH/2,a/2,10),Mt(n,.05,.05,a,Ce(),c*s/2,i.sideH,0);for(const h of[-a/2,a/2])De(n,.22,.24,.04,Le(),c*(s/2-.22),.06,h-Math.sign(h)*.26,12)}Mt(n,s,.05,.05,Ce(),0,o,-a/2),Mt(n,s*.5,.9,.06,jr(),0,o-.6,-a/2+.12),Mt(n,s*.5,.08,.065,Ri(),0,o-1,-a/2+.125);break}default:typeof i.draw=="function"?i.draw(n,i,t,e):Mt(n,s,o,a,os(),0,o/2);break}return i.shape==="booth"&&n.children.forEach((l,c)=>{c>0&&(l.userData.noHit=1)}),n.traverse(l=>{l.isMesh&&(l.castShadow=!1)}),n}function Vl(i){i.traverse(t=>{t.geometry&&!t.userData.sharedGeo&&t.geometry.dispose(),t.material&&t.userData.ownMat&&t.material.dispose()})}const d_=nt.colors.fg,f_=nt.colors.highlight,Wl=nt.colors.accent,Me=i=>`<svg viewBox="0 0 48 48" fill="none" stroke="${d_}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${i}</svg>`,Ye=i=>`<g stroke="${f_}">${i}</g>`,su=i=>`<g stroke="${Wl}">${i}</g>`,ui=i=>`<g stroke="${Wl}" fill="${Wl}33">${i}</g>`,sn={table:Me('<path d="M5 19h38M9 19l-2 19M39 19l2 19M24 19v4"/>'+Ye('<path d="M5 19l3-5h32l3 5"/>')),conf:Me('<ellipse cx="24" cy="22" rx="18" ry="6"/><path d="M16 27v11M32 27v11"/>'+Ye('<path d="M12 38h8M28 38h8"/>')),round:Me('<ellipse cx="24" cy="16" rx="16" ry="5"/><path d="M8 16c0 8 1 16 3 22M40 16c0 8-1 16-3 22M11 38c8 2 18 2 26 0"/>'+Ye('<path d="M18 26v8"/>')),hightop:Me('<ellipse cx="24" cy="10" rx="10" ry="3"/><path d="M14 10c0 6 8 10 8 16s-4 10-8 12M34 10c0 6-8 10-8 16s4 10 8 12M14 38h20"/>'+Ye('<path d="M24 20v8"/>')),chair:Me('<path d="M15 6h18v16H15zM13 24h22l-2 4H15zM16 28l-2 14M32 28l2 14"/>'+Ye('<path d="M18 11h12"/>')),exec:Me('<path d="M16 5h16v17H16zM14 24h20M24 26v8M14 42l10-8 10 8M24 34v8"/>'+Ye('<path d="M12 20v6M36 20v6"/>')),stool:Me('<ellipse cx="24" cy="9" rx="9" ry="3"/><path d="M24 12v26M15 42h18"/>'+Ye('<ellipse cx="24" cy="28" rx="7" ry="2"/>')),lounge:Me('<path d="M8 20h32v6H8zM6 18v16h36V18M10 34v4M38 34v4M10 20v-6c0-2 2-3 4-3h20c2 0 4 1 4 3v6"/>'+Ye('<path d="M24 20v6"/>')),counter:Me('<path d="M5 13h38M7 13v25h34V13"/>'+Ye('<path d="M11 30h26"/>')+su('<path d="M11 19h26"/>')),tv:Me('<rect x="5" y="8" width="38" height="23" rx="2"/><path d="M24 31v7M15 40h18"/>'+ui('<rect x="9" y="12" width="30" height="15" rx="1"/>')),screen:Me('<path d="M7 7v35M41 7v35M7 9h34M7 32h34M4 42h6M38 42h6"/>'+Ye('<path d="M14 15h20"/>')),led:Me('<rect x="4" y="6" width="40" height="26"/><path d="M12 32v8M36 32v8M8 40h8M32 40h8"/>'+ui('<path d="M17.3 6v26M30.6 6v26M4 19h40"/>')),ledtrailer:Me('<rect x="8" y="4" width="32" height="18"/><path d="M24 22v8M6 30h34M44 34l-4-4"/><circle cx="16" cy="36" r="4"/><circle cx="28" cy="36" r="4"/>'+ui('<rect x="11" y="7" width="26" height="12"/>')),ledposter:Me('<rect x="17" y="3" width="14" height="36" rx="1"/><path d="M13 44h22M24 39v5"/>'+ui('<rect x="20" y="6" width="8" height="30"/>')),laptop:Me('<path d="M4 37h40l-3-5H7z"/><rect x="10" y="10" width="28" height="20" rx="2"/>'+ui('<rect x="13" y="13" width="22" height="14"/>')),ipad:Me('<rect x="14" y="5" width="20" height="28" rx="3" transform="rotate(8 24 19)"/><path d="M18 42h14M25 33l-2 9"/>'+ui('<rect x="17" y="9" width="14" height="20" rx="1" transform="rotate(8 24 19)"/>')),monitor:Me('<rect x="5" y="7" width="38" height="24" rx="2"/><path d="M24 31v7M16 40h16"/>'+ui('<rect x="9" y="11" width="30" height="16"/>')),kiosk:Me('<rect x="15" y="4" width="18" height="38" rx="2"/><path d="M11 44h26"/>'+ui('<rect x="18" y="8" width="12" height="18" rx="1"/>')+Ye('<path d="M18 34h12"/>')),tower:Me('<rect x="14" y="4" width="20" height="40" rx="2"/><path d="M18 12h12M18 16h12"/>'+su('<circle cx="24" cy="36" r="2"/>')),speaker:Me('<rect x="14" y="3" width="20" height="23" rx="2"/><circle cx="24" cy="17" r="5"/><path d="M24 26v10M24 36l-9 7M24 36l9 7"/>'+Ye('<circle cx="24" cy="8" r="1.5"/>')),podium:Me('<path d="M12 14h24l-2 28H14zM10 10l28 4M18 42h12"/>'+Ye('<path d="M17 24h14"/>')),powerbox:Me('<rect x="7" y="12" width="34" height="24" rx="3"/><path d="M14 8h20M12 40v-4M36 40v-4"/>'+Ye('<path d="M26 16l-6 9h8l-6 9"/>')),drape:Me('<path d="M6 6v36M42 6v36M6 7h36M3 42h6M39 42h6"/>'+Ye('<path d="M10 9c2 10 2 22 0 31M18 9c-2 10-2 22 0 31M26 9c2 10 2 22 0 31M34 9c-2 10-2 22 0 31"/>')),booth:Me('<path d="M6 12l12-6h24v24l-12 6M6 12v24h24M30 36V12M6 12h24M42 6L30 12"/>'+Ye('<path d="M14 18h12"/>'))},p_={table:"table",round:"round",chair:"chair",stool:"stool",lounge:"lounge",counter:"counter",tv:"tv",screen:"screen",led:"led",ledtrailer:"ledtrailer",ledposter:"ledposter",laptop:"laptop",ipad:"ipad",monitor:"monitor",kiosk:"kiosk",tower:"tower",speaker:"speaker",podium:"podium",powerbox:"powerbox",drape:"drape",booth:"booth"},m_=i=>i.icon||sn[i.id]||sn[p_[i.shape]]||sn.table,g_={tables:sn.table,seating:sn.chair,counters:sn.counter,tvs:sn.tv,led:sn.led,computers:sn.laptop,kiosks:sn.kiosk,audio:sn.speaker,power:sn.powerbox,decor:sn.drape},ld=sn,an=.33,Zr=10,ru=40,cd=[{id:"none",name:"No walls",w:0,l:0},{id:"20x20",name:"20 × 20",w:20,l:20},{id:"30x40",name:"30 × 40",w:30,l:40},{id:"50x100",name:"50 × 100",w:50,l:100},{id:"100x150",name:"100 × 150",w:100,l:150}],x_={indoor:"30x40",outdoor:"none"},Ho=(i,t,e=0,n=0)=>({pts:[[e,n],[e+i,n],[e+i,n+t],[e,n+t]],closed:!0}),v_=i=>{const t=cd.find(e=>e.id===i);return t&&t.w?[Ho(t.w,t.l)]:[]},Jr=Number.isFinite;function er(i){const t=[];return i.forEach((e,n)=>{const s=e.pts.length,o=e.closed?s:s-1;for(let a=0;a<o;a++){const l=e.pts[a],c=e.pts[(a+1)%s];Math.hypot(c[0]-l[0],c[1]-l[1])>1e-6&&t.push({pi:n,i:a,a:l,b:c})}}),t}function Pn(i){let t=1/0,e=-1/0,n=1/0,s=-1/0;for(const o of i)for(const[a,l]of o.pts)t=Math.min(t,a),e=Math.max(e,a),n=Math.min(n,l),s=Math.max(s,l);return t===1/0?null:{minX:t,maxX:e,minZ:n,maxZ:s,w:e-t,l:s-n}}const hd=i=>Math.abs(i.reduce((t,[e,n],s)=>{const[o,a]=i[(s+1)%i.length];return t+e*a-o*n},0))/2;function ud(i,t,e){let n=!1;for(let s=0,o=e.length-1;s<e.length;o=s++){const[a,l]=e[s],[c,h]=e[o];l>t!=h>t&&i<(c-a)*(t-l)/(h-l)+a&&(n=!n)}return n}function ur(i){const t=i.filter(s=>s.closed&&s.pts.length>=3),e=i.filter(s=>!s.closed&&s.pts.length>=1),n=[];if(e.length){const s=Pn(e);n.push({x0:s.minX-Zr,z0:s.minZ-Zr,x1:s.maxX+Zr,z1:s.maxZ+Zr})}return!t.length&&!e.length&&n.push({x0:0,z0:0,x1:ru,z1:ru}),{polys:t.map(s=>s.pts),rects:n}}const __=(i,t,e)=>i.rects.some(n=>t>=n.x0&&t<=n.x1&&e>=n.z0&&e<=n.z1)||i.polys.some(n=>ud(t,e,n));function yc(i){let t=1/0,e=-1/0,n=1/0,s=-1/0;for(const o of i.rects)t=Math.min(t,o.x0),e=Math.max(e,o.x1),n=Math.min(n,o.z0),s=Math.max(s,o.z1);for(const o of i.polys)for(const[a,l]of o)t=Math.min(t,a),e=Math.max(e,a),n=Math.min(n,l),s=Math.max(s,l);return{minX:t,maxX:e,minZ:n,maxZ:s,w:e-t,l:s-n}}function dd(i){const t=[];for(const e of Tc(i)){const[n,s]=e.a,[o,a]=e.b,l=Math.hypot(o-n,a-s),c=(o-n)/l,h=(a-s)/l,u=-h,f=c;for(const d of[1,-1]){const p=d*an/2;t.push({x1:n+u*p,z1:s+f*p,x2:o+u*p,z2:a+f*p,nx:d*u,nz:d*f,src:"room",host:null,seg:e})}}return t}const fd=i=>Tc(i).map(t=>{const[e,n]=t.a,[s,o]=t.b,a=Math.hypot(s-e,o-n);return{x:(e+s)/2,z:(n+o)/2,a:Math.atan2(-(o-n)/a,(s-e)/a),w:a,d:an,seg:t}}),xi=i=>i>=600?25:i>=160?10:i>=80?5:i>=30?1:.5,pd=()=>.5;function M_(i,t,e){if(t==null||!i[t]||i[t].closed)return i.push({pts:[[e.x,e.z]],closed:!1}),i.length-1;const n=i[t];if(e.close&&n.pts.length>=3)return n.closed=!0,null;const[s,o]=n.pts[n.pts.length-1];return Math.hypot(e.x-s,e.z-o)<1e-6||n.pts.push([e.x,e.z]),t}function S_(i,t,e){const n=i[t];if(!n)return;const s=(n.doors||[]).filter(o=>o.i!==e);if(n.closed){const o=n.pts.length;n.pts=[...n.pts.slice(e+1),...n.pts.slice(0,e+1)],n.closed=!1,n.doors=s.map(a=>({i:(a.i-e-1+o)%o,t:a.t}))}else{const o=n.pts.slice(0,e+1),a=n.pts.slice(e+1),l={pts:o,closed:!1,doors:s.filter(h=>h.i<e)},c={pts:a,closed:!1,doors:s.filter(h=>h.i>e).map(h=>({...h,i:h.i-e-1}))};i.splice(t,1,...[l,c].filter(h=>h.pts.length>=2))}for(let o=i.length-1;o>=0;o--)i[o].pts.length<2&&i.splice(o,1)}const To=i=>+i.toFixed(1);function wc(i){const t=Pn(i);if(!t)return"No walls · open floor";const e=i.filter(n=>n.closed&&n.pts.length>=3).reduce((n,s)=>n+hd(s.pts),0);return`${To(t.w)} x ${To(t.l)} ft${e?` · ${Math.round(e)} sq ft`:" · open walls"}`}const fo=i=>i>=10?`${To(i)} ft`:`${To(i)} ft`;function y_(i){return(Array.isArray(i)?i:[]).map(t=>({pts:(Array.isArray(t&&t.pts)?t.pts:[]).filter(e=>Array.isArray(e)&&Jr(e[0])&&Jr(e[1])).map(e=>[e[0],e[1]]),closed:!!(t&&t.closed),doors:(Array.isArray(t&&t.doors)?t.doors:[]).filter(e=>e&&Number.isInteger(e.i)&&Jr(e.t)).map(e=>({i:e.i,t:e.t,...e.k==="dock"||e.k==="svc"?{k:e.k}:{},...Jr(e.w)&&e.w>ke?{w:Math.min(2e3,+(+e.w).toFixed(2))}:{}}))})).filter(t=>t.pts.length>=2||t.pts.length===1&&!t.closed).map(t=>t.pts.length<3?{...t,closed:!1}:t)}function w_(i){let t=1/0,e=-1/0,n=1/0,s=-1/0;for(const o of i||[]){const a=/^(-?\d+),(-?\d+)$/.exec(o);if(!a)continue;const l=+a[1],c=+a[2];t=Math.min(t,l),e=Math.max(e,l+1),n=Math.min(n,c),s=Math.max(s,c+1)}return t===1/0?[]:[Ho(e-t,s-n,t,n)]}const Oi=(i,t)=>Math.round(i/t)*t,b_=i=>Math.max(1.25,i*.6),E_=i=>Math.max(3,i*1.5);function T_(i,t,e){const n=Oi(Math.min(i[0],t[0]),e),s=Oi(Math.max(i[0],t[0]),e),o=Oi(Math.min(i[1],t[1]),e),a=Oi(Math.max(i[1],t[1]),e);return s-n>0&&a-o>0?Ho(s-n,a-o,n,o):null}function A_(i){const t=[];for(const e of i)for(const n of e.pts)t.push(n);return t}function C_(i,t,e,n,s,o){const a=t!=null&&i[t]&&!i[t].closed?i[t]:null,l=b_(s),c=A_(i);if(!a){let A=null,D=null,K=Oi(e,s),M=Oi(n,s);for(const[z,G]of c)A==null&&Math.abs(e-z)<=l&&(K=z,A=[z,G]),D==null&&Math.abs(n-G)<=l&&(M=G,D=[z,G]);const b=[];return A&&b.push([A,[K,M]]),D&&b.push([D,[K,M]]),{x:K,z:M,close:!1,guides:b,aligned:b.length>0}}const[h,u]=a.pts[0],[f,d]=a.pts[a.pts.length-1];if(a.pts.length>=3&&Math.hypot(e-h,n-u)<=E_(s))return{x:h,z:u,close:!0,guides:[],aligned:!0};const p=e-f,x=n-d,v=Math.max(1,s*.5),m=Math.abs(p),g=Math.abs(x);if(o.axis)o.axis==="x"&&g>m*1.8+v?o.axis="z":o.axis==="z"&&m>g*1.8+v&&(o.axis="x");else{if(Math.max(m,g)<v)return{x:f,z:d,close:!1,guides:[],aligned:!1,idle:!0};o.axis=m>=g?"x":"z"}const y=o.axis==="x"?e:n;let _=Oi(y,s),w=null,P=l;for(const A of c){if(A===a.pts[a.pts.length-1])continue;const D=o.axis==="x"?A[0]:A[1],K=Math.abs(y-D);K<=P&&(P=K,_=D,w=A)}const R=o.axis==="x"?{x:_,z:d}:{x:f,z:_};return{...R,close:!1,axis:o.axis,guides:w?[[w,[R.x,R.z]]]:[],aligned:!!w}}const R_=(i,t,e,n)=>{const s=(a,l,c)=>Math.sign((l[0]-a[0])*(c[1]-a[1])-(l[1]-a[1])*(c[0]-a[0])),o=(a,l)=>a[0]===l[0]&&a[1]===l[1];return o(i,e)||o(i,n)||o(t,e)||o(t,n)?!1:s(i,t,e)*s(i,t,n)<0&&s(e,n,i)*s(e,n,t)<0},po=(i,t)=>i[0]===t[0]||i[1]===t[1];function bc(i){if(!i||i.closed||i.pts.length<3)return null;const t=i.pts.map(u=>[...u]),e=t.length,n=t[0];if(e===4&&po(t[0],t[1])&&po(t[1],t[2])&&po(t[2],t[3])){const u=t[0][0]===t[1][0],f=t[2][0]===t[3][0];if(u===f){const d=t[3];if(t[3]=u?[t[2][0],n[1]]:[n[0],t[2][1]],(t[3][0]!==d[0]||t[3][1]!==d[1])&&(t[3][0]!==t[2][0]||t[3][1]!==t[2][1]))return{pts:t,ghost:[t[2],t[3],n],u:!0}}}const s=t[e-1];if(s[0]===n[0]||s[1]===n[1])return{pts:t,ghost:[s,n]};const o=[];for(let u=0;u<e-1;u++)o.push([t[u],t[u+1]]);const a=u=>![[s,u],[u,n]].some(([f,d])=>o.some(([p,x])=>R_(f,d,p,x))),l=[n[0],s[1]],c=[s[0],n[1]],h=a(l)||!a(c)?l:c;return{pts:[...t,h],ghost:[s,h,n]}}function md(i,t){const e=i[t],n=bc(e);return n?(e.pts=n.pts,e.closed=!0,Ac([e]),null):t}const $l=i=>i&&i.closed&&i.pts.length===4&&i.pts.every((t,e)=>po(t,i.pts[(e+1)%4]));function P_(i,t,e,n){if(!$l(i)){i.pts[t]=[e,n];return}const[s,o]=i.pts[t],a=i.pts.map(c=>[...c]);for(const c of[(t+3)%4,(t+1)%4])a[c][0]===s?a[c][0]=e:a[c][1]===o&&(a[c][1]=n);a[t]=[e,n];const l=Pn([{pts:a}]);l.w>0&&l.l>0&&$l({closed:!0,pts:a})&&(i.pts=a)}const ke=3,ps=an/2,Qn=(i,t)=>{const e=i.pts.length,n=i.pts[t],s=i.pts[(t+1)%e];return n&&s?Math.hypot(s[0]-n[0],s[1]-n[1]):0},Es=i=>i.closed?i.pts.length:i.pts.length-1,Ec=(i,t)=>(i.doors||[]).filter(e=>e.i===t),dn=i=>i&&i.w>ke?i.w:ke,gd=(i,t=ke)=>[ps+t/2,i-ps-t/2];function xd(i,t,e,n,s=.5){const o=i[t];if(!o||e<0||e>=Es(o))return{error:"Tap a wall to add a door"};const a=Qn(o,e),[l,c]=gd(a);if(c<l-1e-9)return{error:"This wall is too short for a door"};const h=x=>Math.min(c,Math.max(l,x));let u=h(Math.round(n/s)*s);u!==Math.round(n/s)*s&&(u=h(u));const f=Ec(o,e),d=x=>x>=l-1e-9&&x<=c+1e-9&&f.every(v=>Math.abs(v.t-x)>=(dn(v)+ke)/2-1e-9);if(!d(u)){const x=f.filter(m=>Math.abs(m.t-u)<(dn(m)+ke)/2-1e-9).sort((m,g)=>Math.abs(m.t-u)-Math.abs(g.t-u))[0];if(u=[x.t+(dn(x)+ke)/2,x.t-(dn(x)+ke)/2].sort((m,g)=>Math.abs(m-n)-Math.abs(g-n)).find(d),u==null)return{error:"No room for another door here"}}const p={i:e,t:+u.toFixed(4)};return(o.doors||(o.doors=[])).push(p),{door:p}}function vd(i,t){const e=Ec(i,t).map(s=>[s.t-dn(s)/2,s.t+dn(s)/2]).sort((s,o)=>s[0]-o[0]),n=[];for(const s of e){const o=n[n.length-1];o&&s[0]<=o[1]+1e-6?o[1]=Math.max(o[1],s[1]):n.push([...s])}return n}function Tc(i){const t=[];for(const e of er(i)){const n=i[e.pi],s=vd(n,e.i);if(!s.length){t.push(e);continue}const o=Math.hypot(e.b[0]-e.a[0],e.b[1]-e.a[1]),a=(e.b[0]-e.a[0])/o,l=(e.b[1]-e.a[1])/o,c=u=>[e.a[0]+a*u,e.a[1]+l*u];let h=0;for(const[u,f]of s)u-h>1e-6&&t.push({...e,a:c(h),b:c(u)}),h=f;o-h>1e-6&&t.push({...e,a:c(h),b:e.b})}return t}function Vo(i){const t=[];return i.forEach((e,n)=>(e.doors||[]).forEach((s,o)=>{const a=e.pts.length,l=e.pts[s.i],c=e.pts[(s.i+1)%a];if(!l||!c)return;const h=Math.hypot(c[0]-l[0],c[1]-l[1]);if(!h)return;const u=(c[0]-l[0])/h,f=(c[1]-l[1])/h;t.push({pi:n,k:o,i:s.i,t:s.t,w:dn(s),dock:s.k==="dock",svc:s.k==="svc",x:l[0]+u*s.t,z:l[1]+f*s.t,ux:u,uz:f})})),t}function I_(i,t,e,n=1){let s=null,o=1/0;for(const a of Vo(i)){const l=(t-a.x)*a.ux+(e-a.z)*a.uz,c=Math.abs(-(t-a.x)*a.uz+(e-a.z)*a.ux);if(Math.abs(l)<=a.w/2&&c<=n){const h=Math.abs(l)+c;h<o&&(o=h,s=a)}}return s}function L_(i,t,e){const n=i[t];n&&n.doors&&n.doors.splice(e,1)}function Ao(i,t,e){let n=null;for(const s of er(i)){const[o,a]=s.a,[l,c]=s.b,h=Math.hypot(l-o,c-a),u=Math.max(0,Math.min(h,((t-o)*(l-o)+(e-a)*(c-a))/h)),f=Math.hypot(o+(l-o)*u/h-t,a+(c-a)*u/h-e);(!n||f<n.dist)&&(n={pi:s.pi,i:s.i,t:u,dist:f})}return n}function Ac(i){for(const t of i){if(!t.doors||!t.doors.length)continue;const e=[],n=Es(t);for(const s of t.doors.slice().sort((o,a)=>o.i-a.i||o.t-a.t)){if(s.i<0||s.i>=n)continue;const o=Qn(t,s.i),a=Math.min(dn(s),Math.max(ke,o-2*ps)),[l,c]=gd(o,a);if(c<l-1e-9)continue;const h=Math.min(c,Math.max(l,s.t));if(e.some(f=>f.i===s.i&&Math.abs(f.t-h)<(dn(f)+a)/2-1e-9))continue;const u={...s,t:h};a>ke?u.w=a:delete u.w,e.push(u)}t.doors=e}}function D_(i,t,e,n,s,o=.5){const a=i[t],l=a&&a.doors&&a.doors[e];if(!l)return null;const c=Qn(a,l.i),h=dn(l),u=l.t-h/2,f=l.t+h/2,d=Ec(a,l.i).filter(_=>_!==l),p=Math.max(ps,...d.filter(_=>_.t<l.t).map(_=>_.t+dn(_)/2)),x=Math.min(c-ps,...d.filter(_=>_.t>l.t).map(_=>_.t-dn(_)/2));let v=Math.round(s/o)*o,m=u,g=f;n<0?m=Math.max(p,Math.min(v,f-ke)):g=Math.min(x,Math.max(v,u+ke));const y=+(g-m).toFixed(4);return l.t=+((m+g)/2).toFixed(4),y>ke+1e-6?l.w=y:delete l.w,{w:dn(l),t:l.t,max:+(c-2*ps).toFixed(2)}}function U_(i,t,e,n){const s=(i.doors||[]).map(o=>({d:o,L:Qn(i,o.i)}));P_(i,t,e,n);for(const{d:o,L:a}of s){const l=Qn(i,o.i);a>0&&l>0&&(o.t=Math.round(o.t/a*l*2)/2)}Ac([i])}function N_(i){const t=Es(i),e=(i.doors||[]).map(n=>Qn(i,n.i));if(i.pts.reverse(),i.closed){const n=i.pts.length;i.doors=(i.doors||[]).map((s,o)=>({i:(2*n-2-s.i)%n,t:e[o]-s.t}))}else i.doors=(i.doors||[]).map((n,s)=>({i:t-1-n.i,t:e[s]-n.t}))}function _d(i,t){const e=i.pts.length,n=i.pts[t],s=i.pts[(t+1)%e],o=Math.hypot(s[0]-n[0],s[1]-n[1])||1;return[-(s[1]-n[1])/o,(s[0]-n[0])/o]}function ou(i,t,e){const n=i.pts.length,s=Es(i);if(t<0||t>=s||!e)return!e;const[o,a]=_d(i,t),l=t,c=(t+1)%n,h=i.pts.map(d=>[...d]),u=i.pts.map((d,p)=>Qn(i,p));h[l]=[h[l][0]+o*e,h[l][1]+a*e],h[c]=[h[c][0]+o*e,h[c][1]+a*e],{...i};for(const d of[t-1,t+1]){const p=i.closed?(d+s)%s:d;if(p<0||p>=s||p===t)continue;const x=i.pts[p],v=i.pts[(p+1)%n],m=h[p],g=h[(p+1)%n],y=[v[0]-x[0],v[1]-x[1]],_=[g[0]-m[0],g[1]-m[1]];if(Math.hypot(..._)<1-1e-9||y[0]*_[0]+y[1]*_[1]<=0)return!1}i.pts=h;const f=i.closed?(t+1)%s:t+1;if(i.doors)for(const d of i.doors)d.i===f&&f!==t&&(d.t+=Qn(i,f)-u[f]);return Ac([i]),!0}const au=(i,t,e,n)=>{const s=(o,a,l)=>Math.sign((a[0]-o[0])*(l[1]-o[1])-(a[1]-o[1])*(l[0]-o[0]));return s(i,t,e)*s(i,t,n)<0&&s(e,n,i)*s(e,n,t)<0};function Oa(i,t){const e=i[t];if(!e||e.pts.length<2)return!1;const n=Es(e),s=e.pts.length,o=(a,l)=>[a.pts[l],a.pts[(l+1)%a.pts.length]];for(let a=0;a<n;a++)if(Qn(e,a)<1-1e-9)return!1;for(let a=0;a<n;a++){const[l,c]=o(e,a);for(let h=a+2;h<n;h++){if(e.closed&&a===0&&h===n-1)continue;const[u,f]=o(e,h);if(au(l,c,u,f))return!1}for(let h=0;h<i.length;h++){if(h===t)continue;const u=i[h];for(let f=0;f<Es(u);f++){const[d,p]=o(u,f);if(au(l,c,d,p))return!1}}}return s>=2}const Md=[],Sd=[],Cc=[];function Lt(i){Md.push(i)}function O_(i){Sd.push(i)}function dr(i){Cc.push(i)}const Rc=(i,t)=>(i.order??0)-(t.order??0)||String(i.id).localeCompare(String(t.id)),F_=()=>Md.slice().sort(Rc),k_=()=>Sd.slice().sort(Rc),B_=()=>Cc.slice().sort(Rc),z_=i=>Cc.find(t=>t.id===i)||null,Qr=i=>Math.round(i/12*1e3)/1e3;function Dt(i,t,e,n,s,o,a,l,c={}){return{order:i,id:t,cat:e,name:n,w:Qr(s),d:Qr(o),h:Qr(a),shape:l,snapsTo:[],...c,top:c.topIn?Qr(c.topIn):void 0}}const lu={};function ot(i,t,e={}){return lu[i]||(lu[i]=new ve({color:t,...e}))}function it(i,t,e,n,s,o=0,a=0,l=0){const c=new zt(new se(t,e,n),s);return c.position.set(o,a,l),i.add(c),c}function ue(i,t,e,n,s,o=0,a=0,l=0,c=20){const h=new zt(new mn(t,e,n,c),s);return h.position.set(o,a,l),i.add(h),h}const js={w:7.76,d:5.98,h:1.65},mo={dia:1.46,len:6.93},ms={w:js.w+mo.dia,d:Math.max(js.d,mo.len),h:Math.max(js.h,mo.dia)},G_="Unconfirmed size. Not confirmed for the floor plan.",H_=["Unconfirmed. Receiver is the Shure SLXD4 candidate, 7.76 × 5.98 × 1.65 in. Handheld is the SM58 candidate, 1.46 in diameter × 6.93 in. The footprint is those two parts with no gap between them.","Lav and headset body sizes are not in missing-products.xlsx, so they are not drawn as sized parts.","Bob has not confirmed that mics show on the floor plan. The Atlas MS-12C stand (10 in base, 34–62 in) is listed on the same row and is not a separate item."],V_=nt.colors.fg,W_=nt.colors.highlight,yd=nt.colors.accent,$_=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${V_}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="18" width="22" height="12" rx="1"/><rect x="30" y="16" width="8" height="16" rx="4" stroke="${W_}"/><path d="M10 24h8" stroke="${yd}"/></svg>`;function X_(i,t){const e=ot("micRx",2765112),n=ot("micRxFace",1711652),s=ot("micHand",12962256),o=ot("micBand",1711652),a=ot("micLed",ne(yd),{emissive:670276}),l=t.w*(js.w/ms.w),c=t.w-l,h=t.d*(js.d/ms.d),u=t.h*(mo.dia/ms.h);it(i,l,t.h,h,e,-t.w/2+l/2,t.h/2,0).name="micReceiver",it(i,l*.7,t.h*.28,.006,n,-t.w/2+l/2,t.h*.62,h/2-.006);const f=ue(i,Math.min(.01,l*.04),Math.min(.01,l*.04),.006,a,-t.w/2+l*.72,t.h*.7,h/2-.008,8);f.rotation.x=Math.PI/2;const d=ue(i,c/2,c/2,t.d,s,t.w/2-c/2,u/2,0,16);d.rotation.x=Math.PI/2,d.name="micHandheld";const p=ue(i,c/2*.98,c/2*.98,t.d*.28,o,t.w/2-c/2,u/2,t.d*.12,12);p.rotation.x=Math.PI/2}const q_=Dt(52,"micset","audio","Wireless mic set",ms.w,ms.d,ms.h,"micset",{snapsTo:["top"],note:G_,flags:H_,icon:$_(),draw:X_,unconfirmed:!0,showOnPlan:"unconfirmed"});Lt(q_);const Y_="UNCONFIRMED. Bob has not confirmed that Rentacomputer.com rents bars. The spreadsheet sizes only the front bar. Placeholder backbar 72 × 18 × 84 in (Luxe). Nearby listings are 72 × 18.5 × 84 and 72 × 18 × 83.",j_=nt.colors.fg,K_=nt.colors.highlight,Z_=nt.colors.accent,J_=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${j_}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6h32v36H8z"/><path d="M8 18h32M8 30h32" stroke="${K_}"/><path d="M16 12h4M28 12h4M18 24h4" stroke="${Z_}"/></svg>`;function Q_(i,t){const e=ot("bbarFrame",2896444),n=ot("bbarShelf",9267781),s=ot("bbarBottle",1854010),o=ot("bbarAmber",12886362),a=.06;for(const u of[-1,1])it(i,a,t.h,a,e,u*(t.w/2-a/2),t.h/2,0);it(i,t.w,a,a,e,0,t.h-a/2,0).name="backbarFrame",it(i,t.w,a,t.d,e,0,a/2,0);const l=[.28,.5,.72];for(const u of l)it(i,t.w-a*2,.04,t.d*.72,n,0,t.h*u,-t.d*.08);const c=t.h*.72+.22;let h=-t.w*.32;for(let u=0;u<7;u++)ue(i,.045,.05,.32,u%2?o:s,h,c,-t.d*.05,10),h+=t.w*.1}const tM=Dt(65,"backbar","counters","Backbar",72,18,84,"backbar",{snapsTo:["nearwall"],note:Y_,icon:J_(),draw:Q_,unconfirmed:!0});Lt(tM);const eM="UNCONFIRMED brand (Zebra or Epson). Generic shape. Size is the Zebra ZC300 single-sided candidate, 6.2 × 15.1 × 10.2 in. Dual-sided ZC300 is 18.4 in deep. Epson ColorWorks C3500 is 12.2 × 11.1 × 10.3 in.",nM=nt.colors.fg,iM=nt.colors.highlight,sM=nt.colors.accent,rM=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${nM}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="14" y="8" width="20" height="28" rx="2"/><path d="M18 36h12v4H18z"/><path d="M20 16h8M18 32h12" stroke="${iM}"/><circle cx="24" cy="23" r="3" stroke="${sM}"/></svg>`;function oM(i,t){const e=ot("badgeBody",2896184),n=ot("badgeLid",4015440),s=ot("badgeSlot",790034),o=ot("badgeCard",15196888),a=ot("badgeLed",6280447,{emissive:1333352});it(i,t.w,t.h,t.d,e,0,t.h/2,0).name="badgeBody",it(i,t.w*.86,.01,t.d*.5,n,0,t.h+.005,-t.d*.1);const l=t.w*.62,c=Math.min(.05,t.h*.1);it(i,l,c,.01,s,0,t.h*.42,t.d/2+.005),it(i,l*.72,.008,.02,o,0,t.h*.3,t.d/2+.004);const h=ue(i,.012,.012,.012,a,t.w*.28,t.h*.72,t.d/2+.006,10);h.rotation.x=Math.PI/2}const aM=Dt(30,"badgeprinter","computers","Badge printer",6.2,15.1,10.2,"badgeprinter",{snapsTo:["top"],note:eM,icon:rM(),draw:oM,unconfirmed:!0});Lt(aM);Lt(Dt(26,"booth10","decor","10 × 10 booth (back and side walls)",120,120,96,"booth",{booth:!0,sideHIn:36}));Lt(Dt(27,"booth20","decor","10 × 20 booth (back and side walls)",240,120,96,"booth",{booth:!0,sideHIn:36}));Lt(Dt(10,"brandctr","counters","Branded counter",48,24,42,"counter",{topIn:42,snapsTo:["backwall"]}));const lM=[["tables","Tables"],["seating","Seating"],["counters","Counters"],["tvs","TVs and Screens"],["led","LED Walls"],["computers","Computers"],["kiosks","Kiosks"],["audio","Audio"],["power","Power distribution"],["decor","Decor and Booths"]];lM.forEach(([i,t],e)=>O_({id:i,name:t,order:e}));Lt(Dt(5,"chair","seating","Banquet chair",18,20,34,"chair",{snapsTo:["edge"],edgeKind:"chair"}));const Fa={},Hi=(i,t,e={})=>Fa[i]||(Fa[i]=new ve({color:t,...e})),be=i=>Math.round(i/12*1e3)/1e3,Wo=()=>Hi("p40black",1382429),Ts=()=>Hi("p40dark",2765376),nr=()=>Hi("p40metal",9344931),cM=()=>Hi("p40white",15197404),hM=()=>Hi("p40rubber",1053206),fr=()=>Hi("p40teal",1731170,{emissive:670260}),Co=()=>Hi("p40bezel",922136);function pr(){return new fe}function _e(i,t,e,n,s,o=0,a=0,l=0){const c=new zt(new se(t,e,n),s);return c.position.set(o,a,l),i.add(c),c}function uM(i,t,e,n,s,o,a){const l=new zt(new mn(t,t,e,12),n);return l.position.set(s,o,a),i.add(l),l}function Ro(i,t,e,n,s,o){const a=new ve({color:1324111,emissive:1466006,emissiveIntensity:.5}),l=new zt(new se(t,e,.012),a);return l.name="screen",l.userData.ownMat=1,l.position.set(n,s,o),i.add(l),l}function As(i){return i.traverse(t=>{t.isMesh&&(t.castShadow=!1)}),i}function mr(i){const t=nt.colors.fg,e=nt.colors.highlight,n=nt.colors.accent;return`<svg viewBox="0 0 48 48" fill="none" stroke="${t}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${i.replaceAll("{{O}}",e).replaceAll("{{T}}",n)}</svg>`}const Xl=19,ql=8,Yl=26;function dM(){const i=pr(),t=be(Xl),e=be(ql),n=be(Yl);_e(i,t,n,e-.02,Ts(),0,n/2,-.01);const s=2,o=4,a=.03,l=.06,c=(t-l*2-a)/s,h=(n-l*2-a*(o-1))/o,u=e/2-.01;for(let f=0;f<s;f++)for(let d=0;d<o;d++){const p=-t/2+l+c/2+f*(c+a),x=l+h/2+d*(h+a);_e(i,c*.9,h*.88,.012,Wo(),p,x,u),_e(i,.02,h*.22,.008,nr(),p+c*.28,x,u+.004),_e(i,.018,.018,.008,fr(),p-c*.26,x+h*.26,u+.004)}return As(i)}Lt(Dt(44,"charger","kiosks","Charging locker",Xl,ql,Yl,"charger",{snapsTo:["nearwall"],unconfirmed:!0,note:"Unconfirmed. ChargeTech 8-bay locker CT-300119, 19 × 8 × 26 in (retailer listings; maker sheet not opened). Floor unit against a wall; stand versus table is not confirmed.",gaps:["Maker spec sheet was not opened. Size is from two retailer listings in missing-products.xlsx.","Stand versus table is not confirmed. It is placed on the floor and can snap against a wall.","Bay opening size and door layout are not published. Eight doors are drawn 2 × 4 inside the 19 × 8 × 26 in body."],sources:["https://www.staples.com/chargetech-8-bay-charging-uv-disinfecting-locker-ct-300119/product_24467533","https://chargetech.com/products/guardian-8-charging-locker"],parts:{body:{wIn:Xl,dIn:ql,hIn:Yl},bays:8},mesh:dM,icon:mr('<rect x="10" y="4" width="28" height="40" rx="2"/><path d="M24 8v32M14 14h20M14 24h20M14 34h20" stroke="{{T}}"/><circle cx="18" cy="18" r="1.2" stroke="{{O}}"/>')}));const fM="UNCONFIRMED model. Size is the ChargeTech Hightop Power Table candidate, 23.6 × 23.6 × 43.3 in. A pop-up table at 23.2 × 23.2 × 43.3 in is also listed. Square top; a round top is not confirmed.",pM=nt.colors.fg,mM=nt.colors.highlight,gM=nt.colors.accent,xM=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${pM}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="10" width="32" height="8" rx="1"/><path d="M24 18v18M16 40h16"/><path d="M18 14h4M26 14h4" stroke="${mM}"/><circle cx="24" cy="14" r="1.4" stroke="${gM}"/></svg>`;function vM(i,t){const e=ot("chargeTop",16052714),n=ot("chargeEdge",2765376),s=ot("chargePad",ne(nt.colors.accent),{emissive:670276}),o=ot("chargeWell",1712168),a=1.5/12;it(i,t.w,a,t.d,e,0,t.h-a/2,0).name="chargeTop";const l=1/12,c=t.w*.62;it(i,c,l,c,n,0,l/2,0),ue(i,.22,.26,t.h-a-l,n,0,l+(t.h-a-l)/2,0,20),ue(i,.16,.16,.02,s,0,t.h+.004,0,24);const h=t.w*.28;for(const[u,f]of[[-1,-1],[1,-1],[-1,1],[1,1]])ue(i,.04,.04,.016,o,u*h,t.h+.002,f*h,12)}const _M=Dt(32,"chargetable","tables","Phone charging table",23.6,23.6,43.3,"chargetable",{topIn:43.3,note:fM,icon:xM(),draw:vM,unconfirmed:!0});Lt(_M);Lt(Dt(4,"conf","tables","Conference table",96,48,30,"table",{topIn:30,edgeFor:["chair"]}));const jl=24.375,Kl=28.5,Zl=36.875;function MM(){const i=pr(),t=be(jl),e=be(Kl),n=be(Zl);_e(i,t,n-.08,e-.02,cM(),0,(n-.08)/2,-.01),_e(i,t*.94,.08,e*.84,Ts(),0,n-.04,-e*.02),_e(i,t*.62,n*.07,.012,Wo(),0,n*.7,e/2-.008),_e(i,t*.4,.035,.01,fr(),0,n*.6,e/2-.008);for(const s of[.22,.36,.5])_e(i,t*.78,.02,.01,Ts(),0,n*s,e/2-.008);return As(i)}Lt(Dt(43,"copier","computers","Copier / multifunction printer",jl,Kl,Zl,"copier",{snapsTo:["nearwall"],unconfirmed:!0,note:"Unconfirmed model. Canon imageRUNNER ADVANCE DX C5840i, 24.375 × 28.5 × 36.875 in, from the maker spec in missing-products.xlsx.",gaps:["Which copier model is rented is still open. This is the candidate in missing-products.xlsx.","Control-panel size is not published. The front panel is a drawing inside the body and is not a video screen."],sources:["https://oip.manual.canon/USRMA-5488-zz-CS-5800-enUS/contents/devu-int-dev_spec-main_unit.html"],parts:{body:{wIn:jl,dIn:Kl,hIn:Zl}},mesh:MM,icon:mr('<rect x="8" y="6" width="32" height="36" rx="2"/><path d="M12 14h24M14 32h20M14 36h20" stroke="{{T}}"/><rect x="14" y="18" width="20" height="8" rx="1" stroke="{{O}}"/>')}));const gs={wIn:6.06,dIn:11.5,hIn:12.77},xs={wIn:24,dIn:8,hIn:18,flagged:!0},wd=xs.wIn+gs.wIn,bd=gs.dIn,SM=xs.hIn;function yM(){const i=pr(),t={w:be(xs.wIn),d:be(xs.dIn),h:be(xs.hIn)},e={w:be(gs.wIn),d:be(gs.dIn),h:be(gs.hIn)},n=be(wd),s=be(bd),o=-n/2+t.w/2,a=n/2-e.w/2,l=s/2-t.d/2,c=s/2-e.d/2,h=t.h*.64,u=t.w*.94,f=.07,d=t.h-h/2;return _e(i,t.w,.05,t.d*.9,nr(),o,.025,l),_e(i,.06,Math.max(.08,d-h/2-.05),.05,nr(),o,.05+Math.max(.08,d-h/2-.05)/2,l+t.d*.08),_e(i,u,h,f,Co(),o,d,l+t.d/2-f/2-.03),Ro(i,u-.08,h-.1,o,d,l+t.d/2-.012),_e(i,e.w,e.h,e.d-.02,Wo(),a,e.h/2,c-.01),_e(i,e.w*.72,e.h*.5,.012,Ts(),a,e.h*.55,s/2-.008),_e(i,.04,.04,.01,fr(),a,e.h*.18,s/2-.008),As(i)}Lt(Dt(42,"desktop","computers","Desktop computer (tower and monitor)",wd,bd,SM,"desktop",{snapsTo:["top"],unconfirmed:!0,note:"Unconfirmed bundle. Dell OptiPlex Tower 7020 is 6.06 × 11.5 × 12.77 in. The monitor is the existing flagged 24 × 8 × 18 in item, beside the tower with no gap.",gaps:['Combined size is not in missing-products.xlsx. The sheet sizes the tower only and says "+ existing monitor item".',"Monitor 24 × 8 × 18 in is the existing catalog item and is flagged (no confident source).","The monitor panel-versus-stand split is not published. The display is drawn inside that flagged envelope.","No gap is published between tower and monitor. They are drawn touching."],sources:["https://www.dell.com/support/manuals/en-us/optiplex-7020t-desktop/optiplex-tower-7020-owners-manual/dimensions-and-weight"],parts:{tower:gs,monitor:xs},mesh:yM,icon:mr('<rect x="3" y="8" width="28" height="18" rx="1.5"/><path d="M17 26v5M10 33h14" stroke="{{T}}"/><rect x="6" y="11" width="22" height="12" rx="1" stroke="{{O}}"/><rect x="34" y="14" width="10" height="22" rx="1"/>')}));const vs={wIn:48.7,dIn:1.1,hIn:27.9},Po={wIn:36.1,dIn:25.3};function wM(){const i=pr(),t=be(vs.wIn),e=be(Po.dIn),n=be(vs.hIn),s=be(Po.wIn),o=Math.min(vs.dIn/12,e*.4),a=e/2-o/2-.03;_e(i,s,.06,e,Ts(),0,.03,0);for(const l of[-1,1])for(const c of[-1,1])uM(i,.04,.05,hM(),l*(s/2-.14),.025,c*(e/2-.14));for(const l of[-1,1])_e(i,.05,n*.72,.05,nr(),l*(t*.28),n*.36,a-o/2-.04);return _e(i,t,n,o,Co(),0,n/2,a),Ro(i,t-.1,n-.12,0,n/2+.02,a+o/2+.01),_e(i,t*.28,.03,.008,fr(),0,.1,a+o/2+.012),As(i)}Lt(Dt(40,"digisign","tvs","Digital signage on a floor stand",vs.wIn,Po.dIn,vs.hIn,"digisign",{snapsTo:["nearwall"],unconfirmed:!0,note:"Unconfirmed overall height. Samsung QM55C panel 48.7 × 1.1 × 27.9 in on a Chief PFQUB base 36.1 × 25.3 in. Mount height is not published, so the model is only as tall as the panel.",gaps:["Overall stand height is not in missing-products.xlsx (column H is UNCONFIRMED). Item height is the panel height 27.9 in only.","Cart base thickness, pole height and caster size are not published. The 36.1 × 25.3 in base is a thin plate inside the panel height.","Candidate model only. Bob has not confirmed the stand or portrait versus landscape. The panel proportions are landscape."],sources:["https://www.samsung.com/latin_en/business/smart-signage/uhd-4k-signage/crystal-uhd-signage-qmc-lh55qmcebgcxgo/","https://shop.ccisolutions.com/StoreFront/jsp/pdf/CHI-PFQUB_drawing.pdf"],parts:{panel:vs,base:Po},mesh:wM,icon:mr('<rect x="8" y="6" width="32" height="20" rx="1.5"/><path d="M16 26v8M32 26v8M10 36h28M8 42h8M32 42h8" stroke="{{T}}"/><rect x="12" y="10" width="24" height="12" rx="1" stroke="{{O}}"/>')}));const bM="UNCONFIRMED size. The spreadsheet only numbers a 12 × 12 × 42 in pedestal. This display cube is a separate 24 × 24 × 24 in rental listing (Set Shop and Pro Party Rental). Not confirmed for Rentacomputer.com.",EM=nt.colors.fg,TM=nt.colors.highlight,AM=nt.colors.accent,CM=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${EM}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 18l16-8 16 8-16 8z"/><path d="M8 18v14l16 8 16-8V18" stroke="${TM}"/><path d="M24 26v14" stroke="${AM}"/></svg>`;function RM(i,t){const e=ot("cubeBody",16250352),n=ot("cubeCap",14999768),s=ot("cubeSeam",2765376);it(i,t.w,t.h-.08,t.d,e,0,(t.h-.08)/2,0).name="cubeBody",it(i,t.w,.08,t.d,n,0,t.h-.04,0),it(i,t.w*.72,.015,.012,s,0,t.h*.55,t.d/2-.004)}const PM=Dt(63,"displaycube","decor","Display cube",24,24,24,"displaycube",{topIn:24,snapsTo:["backwall"],note:bM,icon:CM(),draw:RM,unconfirmed:!0});Lt(PM);Lt(Dt(25,"drape","decor","Pipe and drape (10 ft section)",120,2,96,"drape",{wallHost:!0}));const IM="UNCONFIRMED. Bob has not confirmed that Rentacomputer.com rents bars. missing-products.xlsx asks: Do we rent bars? Which model? Size is the CORT Posh 6 ft bar candidate, 72 × 30 × 40.25 in.",LM=nt.colors.fg,DM=nt.colors.highlight,UM=nt.colors.accent,NM=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${LM}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 16h38v6H5z"/><path d="M8 22v16M40 22v16M8 32h32" stroke="${DM}"/><path d="M12 26h10" stroke="${UM}"/></svg>`;function OM(i,t){const e=ot("ebarChrome",13225686),n=ot("ebarPanel",16184559),s=ot("ebarTop",1711652),o=.07;it(i,t.w,.08,t.d,s,0,t.h-.04,0).name="eventBarTop";for(const a of[-1,1])for(const l of[-1,1])it(i,o,t.h-.08,o,e,a*(t.w/2-o/2),(t.h-.08)/2,l*(t.d/2-o/2));it(i,t.w-o*2,t.h*.62,.04,n,0,t.h*.36,t.d/2-.06),it(i,t.w-.4,.04,t.d*.5,e,0,t.h*.45,-.04),it(i,t.w-.3,.035,.035,e,0,.35,t.d/2-.08)}const FM=Dt(64,"eventbar","counters","Event bar",72,30,40.25,"eventbar",{topIn:40.25,snapsTo:["nearwall"],note:IM,icon:NM(),draw:OM,unconfirmed:!0});Lt(FM);Lt(Dt(6,"exec","seating","Executive chair",26,26,42,"chair",{snapsTo:["edge"],edgeKind:"chair"}));const kM="UNCONFIRMED cable size. The sheet gives the cable ramp only. This section uses that ramp's 36 in length and 2.31 in height for both depth and height so a run lines up with the ramps. It is not a sourced cable diameter or length. Sections snap end to end with other feeder cables.",BM=nt.colors.fg,Ed=nt.colors.highlight,Td=nt.colors.accent,zM=`<svg viewBox="0 0 48 48" fill="none" stroke="${BM}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 30c6-10 10-10 16 0s10 10 16 0"/><path d="M8 18h8M32 18h8" stroke="${Ed}"/><path d="M22 34h6" stroke="${Td}"/></svg>`;function GM(i,t){const e=ot("feederRubber",2303532),n=ot("feederBand",ne(Ed)),s=ot("feederTick",ne(Td)),o=t.h/2,a=ue(i,o,o,t.w,e,0,o,0,18);a.rotation.z=Math.PI/2,a.name="feederCable";const l=ue(i,o*.9,o*.9,t.w*.14,n,0,o,0,16);l.rotation.z=Math.PI/2,l.name="feederBand";const c=ue(i,o*.55,o*.55,.04,s,t.w*.28,o,0,12);c.rotation.z=Math.PI/2}const HM=Dt(74,"feeder","power","Feeder cable",36,2.31,2.31,"feeder",{place:"end",note:kM,icon:zM,draw:GM,unconfirmed:!0,flags:["No sourced cable diameter or length. The sheet only lists the cable ramp.","Section length is the ramp's 36 in. Depth and height are the ramp's 2.31 in so the run lines up. This is not a sourced cable size.","Sections snap end to end with other feeder cables only."]});Lt(HM);const VM="UNCONFIRMED portable versus towable. Candidate is a Honda EU7000is with the handles folded, 33.4 × 27.6 × 28.4 in. Sits outside a closed room, on the outer face of the wall. Power distribution stays inside; this unit stays outside.",WM=nt.colors.fg,Ad=nt.colors.highlight,Cd=nt.colors.accent,$M=`<svg viewBox="0 0 48 48" fill="none" stroke="${WM}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="14" width="32" height="22" rx="2"/><path d="M14 36v4M34 36v4M16 14v-4h16v4"/><path d="M24 20l-4 6h6l-4 6" stroke="${Ad}"/><path d="M14 30h20" stroke="${Cd}"/></svg>`;function XM(i,t){const e=ot("genBody",4015184),n=ot("genRubber",1711394),s=ot("genStripe",15909424),o=ot("genPanel",1514274),a=ot("genHandle",12963028),l=ot("genLamp",ne(Cd),{emissive:1333352}),c=ot("genBolt",ne(Ad)),h=.22,u=.1,f=t.h-h-u;it(i,t.w,f,t.d,e,0,h+f/2,0).name="genBody",it(i,t.w*.62,u,.08,a,0,t.h-u/2,-t.d*.22).name="genHandle",it(i,t.w*.86,.07,.012,s,0,h+f*.62,t.d/2-.01).name="genStripe",it(i,t.w*.32,f*.42,.016,o,t.w*.16,h+f*.48,t.d/2-.012).name="genPanel",it(i,.08,.1,.01,c,-t.w*.22,h+f*.7,t.d/2-.008),it(i,.05,.05,.012,l,t.w*.34,h+f*.72,t.d/2-.01);const d=.11;for(const p of[-1,1])for(const x of[-1,1]){const v=ue(i,d,d,.08,n,p*(t.w/2-.24),d,x*(t.d/2-.26),14);v.rotation.z=Math.PI/2,v.name="genWheel"}}const qM=Dt(73,"generator","power","Generator",33.4,27.6,28.4,"generator",{place:"outside",wallDIn:27.6,panelIn:1,note:VM,icon:$M,draw:XM,unconfirmed:!0,flags:["Portable versus towable is not confirmed. Envelope is the Honda EU7000is with handles folded, 33.4 × 27.6 × 28.4 in.","Indoors it sits outside the room, on the outer face of the wall. Outdoors it sits free on the ground.","Power distribution boxes stay inside the room. This unit stays outside."]});Lt(qM);const YM="UNCONFIRMED. The spreadsheet sizes only the 16 in cube and asks whether Rentacomputer.com rents bars. Placeholder 72 × 24 × 42 in from three rental pages. Other glow bars are listed at 72 × 12 × 42 and 72 × 22 × 48.",jM=nt.colors.fg,KM=nt.colors.highlight,ZM=nt.colors.accent,JM=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${jM}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 18h36v14H6z"/><path d="M8 32v6M40 32v6M6 38h36" stroke="${KM}"/><path d="M10 22h28" stroke="${ZM}"/></svg>`;function QM(i,t){const e=ot("glowBarFrame",12963028),n=ot("glowBarTop",1843755),s=ot("glowBarFace",ne(nt.colors.accent),{emissive:1333456,emissiveIntensity:.8}),o=.07;it(i,t.w,.08,t.d,n,0,t.h-.04,0).name="glowBarTop";for(const a of[-1,1])for(const l of[-1,1])it(i,o,t.h-.08,o,e,a*(t.w/2-o/2),(t.h-.08)/2,l*(t.d/2-o/2));it(i,t.w-.3,t.h*.55,.04,s,0,t.h*.38,t.d/2-.06).name="glowBarFace",it(i,t.w-.5,.04,t.d*.55,e,0,t.h*.42,-.05)}const t1=Dt(61,"glowbar","decor","LED glow bar",72,24,42,"glowbar",{topIn:42,note:YM,icon:JM(),draw:QM,unconfirmed:!0});Lt(t1);const e1="UNCONFIRMED. missing-products.xlsx asks which LED furniture pieces Rentacomputer.com rents. Size is the sheet's 16 × 16 × 16 in glow cube (three rental listings agree).",n1=nt.colors.fg,i1=nt.colors.highlight,s1=nt.colors.accent,r1=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${n1}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 30V16l14-8 14 8v14l-14 8z"/><path d="M10 16l14 8 14-8M24 24v16" stroke="${i1}"/><path d="M16 20l8 4 8-4" stroke="${s1}"/></svg>`;function o1(i,t){const e=ot("glowCubeEdge",1185308),n=ot("glowCubeFace",ne(nt.colors.accent),{emissive:1731839,emissiveIntensity:.85}),s=.05;it(i,t.w,t.h,s,n,0,t.h/2,t.d/2-s/2).name="glowFace",it(i,t.w,t.h,s,n,0,t.h/2,-t.d/2+s/2),it(i,s,t.h,t.d-s*2,n,t.w/2-s/2,t.h/2,0),it(i,s,t.h,t.d-s*2,n,-t.w/2+s/2,t.h/2,0),it(i,t.w-s*2,s,t.d-s*2,n,0,t.h-s/2,0),it(i,t.w-.08,.04,t.d-.08,e,0,.02,0)}const a1=Dt(60,"glowcube","decor","LED glow cube",16,16,16,"glowcube",{topIn:16,note:e1,icon:r1(),draw:o1,unconfirmed:!0});Lt(a1);const ka={w:1.46,d:1.46,h:6.93},l1="Unconfirmed. Gooseneck length is not in the size sheet; shown as the sourced handheld body. Not confirmed for the floor plan.",c1=["Unconfirmed. missing-products.xlsx names a podium gooseneck and does not list a gooseneck length. No length was invented.","The mesh is the sourced SM58 body, 1.46 in diameter × 6.93 in, standing on a lectern (snaps to a top).","Bob has not confirmed that mics show on the floor plan."],h1=nt.colors.fg,u1=nt.colors.highlight,Rd=nt.colors.accent,d1=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${h1}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 40h16"/><path d="M24 40V16" stroke="${u1}"/><rect x="20" y="8" width="8" height="10" rx="4" stroke="${Rd}"/></svg>`;function f1(i,t){const e=ot("neckBody",12962256),n=ot("neckCap",1711652),s=ot("neckBand",ne(Rd),{emissive:670276}),o=ue(i,t.w/2,t.w/2,t.h,e,0,t.h/2,0,20);o.name="gooseneckBody",ue(i,t.w/2*.72,t.w/2*.72,t.h*.08,n,0,t.h*.9,0,16),ue(i,t.w/2*.86,t.w/2*.86,t.h*.05,s,0,t.h*.22,0,16)}const p1=Dt(53,"gooseneck","audio","Podium gooseneck mic",ka.w,ka.d,ka.h,"gooseneck",{snapsTo:["top"],note:l1,flags:c1,icon:d1(),draw:f1,unconfirmed:!0,showOnPlan:"unconfirmed"});Lt(p1);Lt(Dt(3,"hightop","tables","High-top cocktail table",30,30,42,"round",{topIn:42,round:!0,edgeFor:["stool"]}));const Ba={w:5.78,d:5.08,h:1.15},m1="Unconfirmed size. Not confirmed for the floor plan.",g1=["Unconfirmed. missing-products.xlsx lists a Pepwave MAX BR1 Pro 5G candidate, 5.78 × 5.08 × 1.15 in, from the manufacturer datasheet. Rentacomputer.com has not confirmed the router.","Bob has not confirmed that the hotspot shows on the floor plan. The sheet asks whether it is a small table-top icon."],x1=nt.colors.fg,Pd=nt.colors.highlight,Id=nt.colors.accent,v1=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${x1}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="18" width="32" height="16" rx="2"/><path d="M16 18c0-4 4-6 8-6s8 2 8 6" stroke="${Pd}"/><circle cx="24" cy="26" r="2" stroke="${Id}"/></svg>`;function _1(i,t){const e=ot("hotBody",2370098),n=ot("hotTop",3423304),s=ot("hotLed",ne(Id),{emissive:670276}),o=ot("hotMark",ne(Pd));it(i,t.w,t.h,t.d,e,0,t.h/2,0).name="hotspotBody",it(i,t.w*.84,t.h*.22,t.d*.72,n,0,t.h*.72,0);const a=ue(i,t.w*.04,t.w*.04,.006,s,-t.w*.22,t.h*.62,t.d/2-.012,8);a.rotation.x=Math.PI/2,it(i,t.w*.18,t.h*.12,.006,o,t.w*.2,t.h*.55,t.d/2-.01)}const M1=Dt(57,"hotspot","computers","Wi-Fi hotspot",Ba.w,Ba.d,Ba.h,"hotspot",{snapsTo:["top"],note:m1,flags:g1,icon:v1(),draw:_1,unconfirmed:!0,showOnPlan:"unconfirmed"});Lt(M1);const S1="UNCONFIRMED. Bob has not confirmed interpretation booths versus receivers only. Envelope is the ISO 4043 internal minimum for two interpreters, 63 × 63 × 79 in. Exterior size is not confirmed.",y1=nt.colors.fg,Ld=nt.colors.highlight,Dd=nt.colors.accent,w1=`<svg viewBox="0 0 48 48" fill="none" stroke="${y1}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 40V14h32v26"/><path d="M8 18h32M24 18v22"/><path d="M14 26h6v8h-6z" stroke="${Dd}"/><path d="M28 24h8" stroke="${Ld}"/></svg>`;function b1(i,t){const e=ot("iboothWall",15196886),n=ot("iboothTrim",ne(Ld)),s=ot("iboothGlass",ne(Dd),{transparent:!0,opacity:.55}),o=ot("iboothFloor",2765120),a=.12,l=t.h-a-.06,c=.06+l/2;it(i,t.w,.06,t.d,o,0,.03,0).name="iboothFloor",it(i,t.w,a,t.d,e,0,t.h-a/2,0).name="iboothRoof",it(i,t.w,l,a,e,0,c,-t.d/2+a/2).name="iboothBack",it(i,a,l,t.d-a,e,-t.w/2+a/2,c,a/2).name="iboothSide",it(i,a,l,t.d-a,e,t.w/2-a/2,c,a/2);const h=Math.min(2.2,t.w*.4),u=Math.min(l*.86,l-.4),f=t.d/2-a/2,d=(t.w-h)/2,p=l-u;it(i,d,l,a,e,-t.w/2+d/2,c,f).name="iboothFront",it(i,d,l,a,e,t.w/2-d/2,c,f),p>.05&&it(i,h,p,a,e,0,.06+u+p/2,f),it(i,d*.5,1.05,.02,s,t.w/2-d/2,t.h*.62,t.d/2-.01).name="iboothWindow",it(i,.06,l*.9,t.d*.5,n,0,c,-t.d*.1).name="iboothDivider",it(i,t.w*.55,.035,.015,n,0,t.h-a-.03,f)}const E1=Dt(77,"ibooth","decor","Interpretation booth",63,63,79,"ibooth",{snapsTo:["nearwall"],note:S1,icon:w1,draw:b1,unconfirmed:!0,flags:["Bob has not confirmed interpretation booths versus receivers only.","Envelope is the ISO 4043 internal minimum for two interpreters, 63 × 63 × 79 in. Exterior size is not confirmed.","Sits against a wall."]});Lt(E1);Lt(Dt(18,"ipad","computers","iPad on a stand",10,7,9,"ipad",{snapsTo:["top"]}));const za={},Re=(i,t,e={})=>za[i]||(za[i]=new ve({color:t,...e})),gt=i=>i/12,Ud=Math.hypot(16,9),Nd=55,Od=Nd*16/Ud,Fd=Nd*9/Ud;function We(i,t,e,n,s,o,a,l){const c=new zt(new se(t,e,n),s);return c.position.set(o,a,l),i.add(c),c}function Jl(i,t,e,n,s,o,a){const l=new zt(new mn(t,t,e,16),n);return l.position.set(s,o,a),i.add(l),l}function Pc(i,t,e,n,s,o,a){const l=new ve({color:1784405,emissive:928324}),c=new zt(new se(t,e,n),l);return c.position.set(s,o,a),c.name="screen",c.userData.screen=1,c.userData.ownMat=1,i.add(c),c}const cu=(i,t,e)=>[i,t,e].map(n=>Math.round(n*1e3)).join(","),hu=new Map,T1=15855593;let uu=!1;function Ic(i,t,e,n){if(hu.set(cu(i,t,e),n),uu)return;uu=!0;const s=fe.prototype.add;fe.prototype.add=function(a){const l=a&&a.isMesh&&a.geometry&&a.geometry.parameters,c=a&&a.material&&a.material.color&&a.material.color.getHex(),h=l&&!this.userData._espShape&&this.children.length===0&&c===T1&&hu.get(cu(l.width,l.height,l.depth));if(h&&Math.abs(a.position.y*2-l.height)<1e-4&&a.position.x===0&&a.position.z===0){this.userData._espShape=1;try{h(this)}finally{delete this.userData._espShape,a.geometry.dispose()}return this}return s.apply(this,arguments)}}const Ln=Dt(20,"kiosk","kiosks","iPad / tablet kiosk",18,18,48,"kiosk",{snapsTo:["backwall"]}),Ga=16251130,A1=1843496,C1=1316894,R1=ne(nt.colors.accent),P1=40,du=i=>i*Math.PI/180;function I1(i){const{w:t,h:e,d:n}=Ln,s=gt(.45),o=gt(.65),a=We(i,t,s,n,Re("ipadPad",A1),0,s/2,0);a.name="kioskPad";const l=We(i,t-gt(.35),o,n-gt(.35),Re("ipadWhite",Ga),0,s+o/2,0);l.name="kioskBase";const c=gt(9),h=gt(4.5),u=s+o,f=gt(13.5),d=gt(5.4),p=gt(5.6),x=gt(12.2),v=gt(8.5),m=gt(.62),g=du(P1),y=v/2*Math.cos(g)+m/2*Math.sin(g),_=e-y-gt(.15),w=gt(1.15),R=_-v/2*Math.cos(g)+gt(.35)-d/2,A=gt(.35),K=R-d/2+gt(.4)-u,M=We(i,c,K,h,Re("ipadWhite",Ga),0,u+K/2,gt(.05));M.name="kioskPedestal";const b=We(i,f,d,p,Re("ipadWhite",Ga),0,R,A);b.name="kioskHead";const z=A+p/2,G=We(i,gt(4.6),gt(2.8),gt(.12),Re("ipadRecess",1316894),gt(-1.6),R+gt(.2),z+gt(.02));G.name="kioskSensor";const N=Jl(i,gt(.7),gt(.08),Re("ipadLens",790550),gt(-1.6),R+gt(.2),z+gt(.1));N.rotation.x=Math.PI/2,We(i,gt(1.5),gt(1.05),gt(.08),Re("ipadWell",15265524),gt(1.85),R-gt(.05),z+gt(.02)),We(i,gt(.28),gt(.28),gt(.05),Re("ipadAccent",R1),gt(1.45),R+gt(.7),z+gt(.05)),We(i,gt(.22),gt(.22),gt(.05),Re("ipadPip",16054267),gt(2.15),R+gt(.7),z+gt(.05));const k=new fe;k.name="kioskTablet",k.position.set(0,_,w),k.rotation.x=-g,We(k,x,v,m,Re("ipadBezel",C1),0,0,0);const I=x-gt(.72),W=v-gt(.72),B=gt(.08),Y=Pc(k,I,W,B,0,0,m/2-B/2+gt(.02));Y.userData.isScreenFace=!0,i.add(k);const et=new fe;et.name="kioskReaderMount",et.rotation.x=-du(34);const j=R-d/2;et.position.set(0,j-gt(.7),z+gt(1.7));const xt=We(et,gt(3.2),gt(.7),gt(3.4),Re("ipadBracket",1711652),0,gt(.85),gt(-1.15));xt.name="kioskReaderBracket";const Pt=We(et,gt(3.5),gt(3.3),gt(.46),Re("ipadReader",16514301),0,gt(-.15),gt(.28));Pt.name="kioskReader",We(et,gt(2.2),gt(.11),gt(.04),Re("ipadSlot",9345187),0,gt(.7),gt(.54));const V=Jl(et,gt(.24),gt(.04),Re("ipadMark",7239812),0,gt(-.35),gt(.55));V.rotation.x=Math.PI/2,i.add(et)}Ic(Ln.w,Ln.h,Ln.d,I1);Ln.mesh=()=>{const i=new fe,t=new zt(new se(Ln.w,Ln.h,Ln.d),Re("ipadPlaceholder",15855593));return t.position.set(0,Ln.h/2,0),i.add(t),i};Lt(Ln);new Set("table round chair stool lounge counter tv screen led ledposter ledtrailer laptop ipad monitor kiosk tower speaker podium powerbox drape booth".split(" "));Lt(Dt(17,"laptop","computers","Laptop",14,10,10,"laptop",{snapsTo:["top"]}));Lt(Dt(15,"led","led","LED video wall (6 × 4 panels)",118.1,18,92,"led",{snapsTo:["wallfloor","backwall"]}));Lt(Dt(16,"ledposter","led","LED poster display",25.2,18.7,79.9,"ledposter",{note:"standard size, pending Bob's model"}));Lt(Dt(14,"ledtrailer","led","LED screen trailer",240,96,216,"ledtrailer",{}));const L1=.75,D1=6,fu=.6,pu=Math.PI/18,U1=i=>Math.atan2(Math.sin(i),Math.cos(i)),N1=(i,t,e)=>t>e?(t+e)/2:Math.max(t,Math.min(e,i));function O1(i,t,e,n,s=t.a){const o=Jt(t);if(!o||o.place!=="end")return null;let a=null;for(const l of i){if(l===t||l.type!==t.type)continue;const c=Math.abs(U1((s??t.a)-l.a));if(c>pu&&Math.abs(c-Math.PI)>pu)continue;const h=Jt(l),[u,f]=On(l.x,l.z,l.a,e,n),d=h.w/2+o.w/2,p=Math.abs(u)-d;if(p>L1||p<-.2||Math.abs(f)>fu)continue;const x=(Math.sign(u)||1)*d;if(i.some(_=>{if(_===t||_===l||_.type!==t.type)return!1;const[w,P]=On(l.x,l.z,l.a,_.x,_.z);return Math.abs(w-x)<.25&&Math.abs(P)<fu}))continue;const[m,g]=Nn(l.x,l.z,l.a,x,0),y=Math.hypot(e-m,n-g);(!a||y<a.dist)&&(a={x:m,z:g,a:l.a,dist:y})}return a}function F1(i,t,e,n){if(!i||i.env==="outdoor")return null;const s=Jt(t);if(!s||s.place!=="outside")return null;const o=s.d;let a=null;for(const l of dd(i.walls||[])){const c=(l.x1+l.x2)/2+l.nx*.4,h=(l.z1+l.z2)/2+l.nz*.4;if((i.walls||[]).some(R=>R.closed&&R.pts&&R.pts.length>=3&&ud(c,h,R.pts)))continue;const f=l.x2-l.x1,d=l.z2-l.z1,p=Math.hypot(f,d);if(!(p>0)||p<s.w-.01)continue;const x=f/p,v=d/p,m=N1((e-l.x1)*x+(n-l.z1)*v,s.w/2,p-s.w/2),g=l.x1+x*m,y=l.z1+v*m,_=g+l.nx*(o/2+.02),w=y+l.nz*(o/2+.02),P=Math.hypot(e-_,n-w);P<=D1&&(!a||P<a.dist)&&(a={x:_,z:w,a:Math.atan2(l.nx,l.nz),dist:P})}return a}function k1(i,t,e,n){const s=Jt(t);if(!s)return null;if(s.place==="end"){const o=O1(i.items,t,e,n,t.a);return o?{x:o.x,z:o.z,a:o.a,y:0,host:null,mode:"free"}:null}if(s.place==="outside"){const o=F1(i,t,e,n);return o?{x:o.x,z:o.z,a:o.a,y:0,host:null,mode:"wall"}:null}return null}Lt(Dt(8,"lounge","seating","Lounge chair",32,32,30,"lounge"));const Ha={w:24.84,d:20.16,h:8.39},B1="Unconfirmed size. Sits on a table (front of house).",z1=["Unconfirmed. missing-products.xlsx lists a Behringer X32 Compact candidate, 24.84 × 20.16 × 8.39 in, from a retailer listing (Medium). Rentacomputer.com has not confirmed the mixer.","The sheet asks whether the mixer sits on a 6 ft table at the back of the room. This item snaps onto a table top. It does not include its own table."],G1=nt.colors.fg,H1=nt.colors.highlight,kd=nt.colors.accent,V1=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${G1}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="14" width="40" height="22" rx="2"/><path d="M10 28v6M16 24v10M22 26v8M28 22v12" stroke="${H1}"/><rect x="32" y="18" width="8" height="6" rx="1" stroke="${kd}"/></svg>`;function W1(i,t){const e=ot("mixerBody",1843496),n=ot("mixerDeck",2896960),s=ot("mixerFader",14015459),o=ot("mixerScreen",1323076,{emissive:798792}),a=ot("mixerTick",ne(kd),{emissive:670276});it(i,t.w,t.h,t.d,e,0,t.h/2,0).name="mixerBody";const l=t.h*.22;it(i,t.w*.92,l,t.d*.62,n,0,t.h-.012-l/2,t.d*.1),it(i,t.w*.26,t.h*.28,t.d*.2,o,-t.w*.28,t.h*.62,-t.d*.26);for(let c=0;c<8;c++){const h=-t.w*.08+c*(t.w*.055);it(i,t.w*.012,t.h*.2,t.d*.22,s,h,t.h*.62,t.d*.16)}it(i,t.w*.16,.012,.012,a,t.w*.32,t.h*.55,t.d/2-.02)}const $1=Dt(50,"mixer","audio","Audio mixer",Ha.w,Ha.d,Ha.h,"mixer",{snapsTo:["top"],note:B1,flags:z1,icon:V1(),draw:W1,unconfirmed:!0});Lt($1);Lt(Dt(19,"monitor","computers","Desktop monitor 24–27 in",24,8,18,"monitor",{snapsTo:["top"]}));const X1="UNCONFIRMED. missing-products.xlsx asks which pedestal sizes Rentacomputer.com rents. Size is the sheet's 12 × 12 × 42 in display pedestal (FormDecor Linea and the Set Shop list).",q1=nt.colors.fg,Y1=nt.colors.highlight,j1=nt.colors.accent,K1=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${q1}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8h12v32H18z"/><path d="M14 40h20M16 8h16" stroke="${Y1}"/><path d="M20 14h8" stroke="${j1}"/></svg>`;function Z1(i,t){const e=ot("pedMetal",2764856),n=ot("pedPanel",15987180),s=ot("pedGlass",14017774),o=Math.min(.06,t.w*.12);for(const a of[-1,1])for(const l of[-1,1])it(i,o,t.h-.04,o,e,a*(t.w/2-o/2),(t.h-.04)/2,l*(t.d/2-o/2));it(i,t.w-o*2,t.h-.1,t.d-o*2,n,0,(t.h-.1)/2,0).name="pedestalBody",it(i,t.w,.04,t.d,s,0,t.h-.02,0).name="pedestalTop"}const J1=Dt(62,"pedestal","decor","Display pedestal",12,12,42,"pedestal",{topIn:42,snapsTo:["backwall"],note:X1,icon:K1(),draw:Z1,unconfirmed:!0});Lt(J1);Lt(Dt(23,"podium","audio","Podium / lectern",24,20,46,"podium",{topIn:46}));Lt(Dt(24,"powerbox","power","Power distribution box",24,16,18,"powerbox",{snapsTo:["nearwall"]}));const ir={w:120,d:24,h:96},Zn={w:23.1,d:19.4,h:8.3},Q1=1.45,t2=Q1*ir.w,e2=ir.d+t2+Zn.d,Ql=12,Bd="videoScreen",mu="projbody",n2="UNCONFIRMED model and screen. Body is the Epson Pro L1100U candidate, 23.1 × 19.4 × 8.3 in. Screen is the catalog Projector screen, 120 × 24 × 96 in, which has no confident source. Throw is the standard-lens minimum, 1.45 × 120 in (that lens also reaches 2.32). The screen surface is named videoScreen. Ceiling is the preselected mount: the body hangs from a short drop in line with the screen. Table places only the projector on a table in the plan and leaves the screen where it is. UNCONFIRMED mount height and drop length (not in the size sheet). The drawing uses a 12 in drop from the top of this item, the 8 ft screen, which is not a measured ceiling.",zd=nt.colors.fg,Gd=nt.colors.highlight,Hd=nt.colors.accent,i2=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${zd}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="8" width="16" height="28" rx="1"/><path d="M6 12h12" stroke="${Gd}"/><path d="M32 4v8" stroke="${Hd}"/><rect x="24" y="12" width="18" height="8" rx="1"/></svg>`,s2=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${zd}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="16" width="36" height="16" rx="2"/><path d="M12 24h10" stroke="${Gd}"/><circle cx="34" cy="24" r="3.5" stroke="${Hd}"/></svg>`,qn=i=>i/12;function r2(i){const t=qn(Zn.d),e=qn(Zn.h);return{x:0,y:i.h-qn(Ql)-e/2,z:i.d/2-t/2}}function Vd(i,t,e,n,s,o,a){const l=ot("projBody",2764856),c=ot("projLens",1054752),h=ot("projVent",1711652),u=it(i,t,e,n,l,s,o,a);u.name="projectorBody";const f=ue(i,.12,.14,.1,c,s,o+e*.08,a-n/2+.16,20);return f.rotation.x=Math.PI/2,f.name="projectorLens",it(i,t*.55,e*.28,.02,h,s,o,a+n/2-.02),u}function o2(i,t){const e=ot("projFrame",1711652),n=ot("projCloth",14210508),s=ot("videoScreen",1784405,{emissive:928324}),o=ot("projFoot",3817804),a=ot("projPole",9147294),l=qn(ir.d),c=qn(Zn.w),h=qn(Zn.d),u=qn(Zn.h),f=-t.d/2,d=f+l/2,p=.08;for(const D of[-1,1])it(i,p,t.h,p,e,D*(t.w/2-p/2),t.h/2,d);it(i,t.w,.1,.1,e,0,t.h-.05,d),it(i,t.w,.08,.08,e,0,.5,d);for(const D of[-1,1])it(i,.35,.06,l,o,D*(t.w/2-.3),.03,d);const x=.58,v=t.h-.12,m=v-x,g=t.w-p*2,y=f+l;it(i,g,m,.02,n,0,x+m/2,y-.02);const _=it(i,g-.04,m-.04,.012,s,0,x+m/2,y-.006);_.name=Bd,_.userData.video=1;const w=new fe;w.name="projectorRig";const P=r2(t),R=it(w,.45,.04,.45,a,P.x,t.h-.02,P.z);R.name="projectorMount";const A=ue(w,.06,.06,qn(Ql),a,P.x,t.h-qn(Ql)/2,P.z,12);A.name="projectorDrop",Vd(w,c,u,h,P.x,P.y,P.z),i.add(w)}function a2(i,t){Vd(i,t.w,t.h,t.d,0,t.h/2,0)}const l2=Dt(31,"projscreen","tvs","Projector with screen",ir.w,e2,ir.h,"projscreen",{snapsTo:["wallfloor"],note:n2,icon:i2(),draw:o2,videoScreen:Bd,unconfirmed:!0}),c2=Dt(31.5,mu,"tvs","Projector",Zn.w,Zn.d,Zn.h,mu,{snapsTo:["top"],note:"Tabletop projector body for Projector with screen. Same Epson Pro L1100U candidate, 23.1 × 19.4 × 8.3 in. UNCONFIRMED model.",icon:s2(),draw:a2,hidden:!0,unconfirmed:!0});Lt(l2);Lt(c2);const h2="UNCONFIRMED feet depth. Steel bike-rack queue barricade, 100 in long and 43 in tall. The 20 in depth is the sheet value and is not confirmed. Sections snap end to end into a line.",u2=nt.colors.fg,Wd=nt.colors.highlight,d2=nt.colors.accent,f2=`<svg viewBox="0 0 48 48" fill="none" stroke="${u2}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 40V14M38 40V14M10 16h28M10 28h28"/><path d="M6 40h8M34 40h8" stroke="${Wd}"/><path d="M14 34h20" stroke="${d2}"/></svg>`;function p2(i,t){const e=ot("qbarSteel",12963028),n=ot("qbarFoot",3817804),s=ot("qbarBand",ne(Wd)),o=.055;for(const h of[-1,1])it(i,.14,.08,t.d,n,h*(t.w/2-.07),.04,0).name="qbarFoot",it(i,.08,t.h-o*2,.08,e,h*(t.w/2-.04),(t.h-o*2)/2,0).name="qbarPost";const a=ue(i,o,o,t.w,e,0,t.h-o,0,12);a.rotation.z=Math.PI/2,a.name="qbarRail";const l=ue(i,o*.7,o*.7,t.w-.24,e,0,t.h*.48,0,12);l.rotation.z=Math.PI/2,l.name="qbarMid";const c=ue(i,o*.72,o*.72,.35,s,0,t.h*.48,0,12);c.rotation.z=Math.PI/2}const m2=Dt(70,"qbar","decor","Queue barricade",100,20,43,"qbar",{place:"end",note:h2,icon:f2,draw:p2,unconfirmed:!0,flags:["Feet depth is the sheet value of about 20 in and is not confirmed.","Length 100 in and height 43 in are the steel bike-rack candidate. Sections snap end to end."]});Lt(m2);const g2="UNCONFIRMED. Bob has not confirmed whether radios show on the plan. Candidate is a Motorola CP200d handheld, 2.4 × 1.7 × 5 in. Sits on a staff desk.",x2=nt.colors.fg,$d=nt.colors.highlight,Xd=nt.colors.accent,v2=`<svg viewBox="0 0 48 48" fill="none" stroke="${x2}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="16" y="10" width="16" height="30" rx="2"/><path d="M22 8h4v4"/><path d="M19 16h10" stroke="${Xd}"/><circle cx="24" cy="28" r="3" stroke="${$d}"/></svg>`;function _2(i,t){const e=ot("radioBody",2764856),n=ot("radioScreen",ne(Xd),{emissive:932426}),s=ot("radioBtn",ne($d)),o=ot("radioAnt",14015459),a=.045,l=t.h-a;it(i,t.w,l,t.d,e,0,l/2,0).name="radioBody",it(i,t.w*.62,l*.22,.008,n,0,l*.72,t.d/2-.006).name="radioScreen",ue(i,.012,.012,.01,s,0,l*.42,t.d/2-.004,10).rotation.x=Math.PI/2;const c=ue(i,.01,.01,a,o,t.w/2-.03,l+a/2,0,8);c.name="radioAntenna"}const M2=Dt(76,"radio","audio","Two-way radio",2.4,1.7,5,"radio",{snapsTo:["top"],note:g2,icon:v2,draw:_2,unconfirmed:!0,flags:["Bob has not confirmed whether radios show on the plan.","Candidate is a Motorola CP200d handheld, 2.4 × 1.7 × 5 in.","Staff-desk add-on. It sits on a counter or table top."]});Lt(M2);const S2="UNCONFIRMED which ramp is rented. Checkers Linebacker 5-channel candidate, 36 × 20 × 2.31 in. Sections snap end to end along the 36 in side.",y2=nt.colors.fg,qd=nt.colors.highlight,Yd=nt.colors.accent,w2=`<svg viewBox="0 0 48 48" fill="none" stroke="${y2}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 34h36l-6-12H12z"/><path d="M14 28h4M22 28h4M30 28h4" stroke="${qd}"/><path d="M8 38h32" stroke="${Yd}"/></svg>`;function b2(i,t){const e=ot("rampBody",15909424),n=ot("rampGroove",2761752),s=ot("rampTick",ne(qd)),o=ot("rampEdge",ne(Yd));it(i,t.w,t.h,t.d,e,0,t.h/2,0).name="rampBody";const a=t.d/5;for(let l=0;l<5;l++){const c=-t.d/2+a*(l+.5);it(i,t.w*.9,t.h*.28,a*.42,n,0,t.h-t.h*.14,c).name="rampGroove"}it(i,.08,t.h*.4,t.d*.7,s,0,t.h*.45,0),it(i,t.w*.2,.012,.04,o,0,t.h-.008,0)}const E2=Dt(75,"ramp","power","Cable ramp",36,20,2.31,"ramp",{place:"end",note:S2,icon:w2,draw:b2,unconfirmed:!0,flags:["Which ramp Rentacomputer.com rents is not confirmed.","Envelope is the Checkers Linebacker 5-channel candidate, 36 × 20 × 2.31 in.","Sections snap end to end along the 36 in side, with other cable ramps only."]});Lt(E2);Lt(Dt(9,"regctr","counters","Registration counter",72,24,42,"counter",{topIn:42,snapsTo:["backwall"]}));Lt(Dt(2,"round60","tables","60 in round table",60,60,30,"round",{topIn:30,round:!0,edgeFor:["chair"]}));Lt(Dt(13,"screen","tvs","Projector screen",120,24,96,"screen",{snapsTo:["wallfloor"]}));Lt(Dt(22,"speaker","audio","Powered speaker on stand",15,15,72,"speaker"));const Ke=i=>i/12,Ne={wIn:96,dIn:48,hIn:24,deckIn:.75,frameHIn:4,legDiaIn:2.5,treadWIn:36,treadDIn:11,stairRunIn:22.75,stairSteps:2},hs={frameBandIn:Ne.legDiaIn,treadThickIn:Ne.deckIn,railIn:1,riserIn:.25,skirtPleatFt:.035,skirtInsetFt:.05},_n=Dt(33,"stage","decor","4 × 8 stage deck",Ne.wIn,Ne.dIn,Ne.hIn,"stage",{topIn:Ne.hIn,stairs:!0,skirt:!0,note:"24 in height unconfirmed, pending Bob"}),Va={gap:.5,ang:Math.PI/18,cross:.5},Lc=i=>Math.atan2(Math.sin(i),Math.cos(i)),T2=(i,t,e,n,s)=>{const o=Math.cos(e),a=Math.sin(e);return[i+n*o+s*a,t-n*a+s*o]},Io=(i,t,e,n,s)=>{const o=n-i,a=s-t,l=Math.cos(e),c=Math.sin(e);return[o*l-a*c,o*c+a*l]};function A2(i,t){if(!t||t.type!=="stage")return t?[t]:[];const e=new Map(i.filter(o=>o.type==="stage").map(o=>[o.uid,o])),n=[t],s=[t];for(;s.length;){const o=s.shift();for(const a of o.links||[]){const l=e.get(a);l&&!n.includes(l)&&(n.push(l),s.push(l))}}return n}function C2(i,t){!i||!t||i===t||(i.links=[...new Set([...i.links||[],t.uid])],t.links=[...new Set([...t.links||[],i.uid])])}function gu(i,t){if(!t||t.type!=="stage")return 0;let e=0;for(const n of i){if(n===t||n.type!=="stage"||Math.abs(Lc(n.a-t.a))>.001)continue;const[s,o]=Io(t.x,t.z,t.a,n.x,n.z),a=Math.abs(o)<.05&&Math.abs(Math.abs(s)-_n.w)<.05,l=Math.abs(s)<.05&&Math.abs(Math.abs(o)-_n.d)<.05;(a||l)&&(C2(t,n),e++)}return e}function R2(i,t){const e={joinL:!1,joinR:!1,joinF:!1,joinB:!1};if(!t||t.type!=="stage"||!(t.links||[]).length)return e;const n=_n.w,s=_n.d;for(const o of t.links){const a=i.find(h=>h.uid===o);if(!a||Math.abs(Lc(a.a-t.a))>.001)continue;const[l,c]=Io(t.x,t.z,t.a,a.x,a.z);Math.abs(c)<.05&&Math.abs(Math.abs(l)-n)<.05&&(e[l>0?"joinR":"joinL"]=!0),Math.abs(l)<.05&&Math.abs(Math.abs(c)-s)<.05&&(e[c>0?"joinF":"joinB"]=!0)}return e}const P2=[{id:"R",axis:"x",sign:1},{id:"L",axis:"x",sign:-1},{id:"F",axis:"z",sign:1},{id:"B",axis:"z",sign:-1}];function I2(i,t,e,n,s=t.a){if(!t||t.type!=="stage")return null;const o=A2(i,t);let a=null;for(const l of i){if(l===t||l.type!=="stage"||o.includes(l)||Math.abs(Lc(s-l.a))>Va.ang+1e-9)continue;const[c,h]=Io(l.x,l.z,l.a,e,n);for(const u of P2){const f=u.axis==="x"?c:h,d=u.axis==="x"?h:c,p=u.axis==="x"?_n.w:_n.d;if(Math.sign(f)!==u.sign)continue;const x=Math.abs(f)-p;if(Math.abs(x)>Va.gap+1e-9||Math.abs(d)>Va.cross)continue;const v=u.axis==="x"?u.sign*p:0,m=u.axis==="z"?u.sign*p:0;if(i.some(P=>{if(P===t||P===l||P.type!=="stage"||o.includes(P))return!1;const[R,A]=Io(l.x,l.z,l.a,P.x,P.z);return Math.abs(R-v)<p/2-.05&&Math.abs(A-m)<(u.axis==="x"?_n.d:_n.w)/2-.05}))continue;const[y,_]=T2(l.x,l.z,l.a,v,m),w=Math.hypot(e-y,n-_);(!a||w<a.dist)&&(a={x:y,z:_,a:l.a,y:0,dist:w,join:l.uid,side:u.id,mode:"free",host:null})}}return a}const Wa={},Ii=(i,t)=>Wa[i]||(Wa[i]=new ve({color:t})),je=(i,t,e,n,s,o,a,l,c,h)=>{const u=new zt(new se(e,n,s),o);return u.position.set(a,l,c),u.name=t,h&&Object.assign(u.userData,h),i.add(u),u};function as(i,t,e,n,s,o,a){if(t<.2)return;const l=Math.max(4,Math.round(t*2)),c=t/l,h=hs.skirtPleatFt,u=hs.skirtInsetFt,f=_n.h,d=Ke(Ne.deckIn),p=f-d-.04,x=.02+p/2,v=[];for(let g=0;g<l;g++){const y=-t/2+c*(g+.5),_=u+(g%2?h:0),w=e==="x"?n+y:n+o*_,P=e==="x"?s+o*_:s+y,R=e==="x"?c*.72:.025,A=e==="x"?.025:c*.72;v.push(new se(R,p,A).translate(w,x,P))}const m=new zt(hr(v),Ii("skirt",1447966));return v.forEach(g=>g.dispose()),m.name="skirt",m.userData.side=a,i.add(m),m}function L2(i=_n,t={}){const e=new fe;e.name="stage";const n=i.w,s=i.d,o=i.h,a=Ke(Ne.deckIn),l=Ke(Ne.frameHIn),c=Ke(Ne.legDiaIn)/2,h=Ke(hs.frameBandIn),u=Ii("deck",1842722),f=Ii("frame",10134445),d=Ii("seam",3949132);je(e,"deckTop",n,a,s,u,0,o-a/2,0),je(e,"seam",n*.92,.004,.012,d,0,o-.003,0),je(e,"seam",.012,.004,s*.88,d,0,o-.003,0);const p=o-l/2;je(e,"frame",n,l,h,f,0,p,s/2-h/2,{side:"F"}),je(e,"frame",n,l,h,f,0,p,-s/2+h/2,{side:"B"}),je(e,"frame",h,l,s,f,n/2-h/2,p,0,{side:"R"}),je(e,"frame",h,l,s,f,-n/2+h/2,p,0,{side:"L"});const x=o-l;for(const g of[-1,1])for(const y of[-1,1]){const _=new zt(new mn(c,c,x,16),f);_.position.set(g*(n/2-c),x/2,y*(s/2-c)),_.name="leg",e.add(_)}je(e,"centerRail",n-Ke(Ne.legDiaIn)*4,Ke(Ne.legDiaIn),Ke(Ne.legDiaIn),f,0,x-c,0);const v=t.skirt!==!1,m=t.stairs!==!1&&!t.joinF;if(v&&(t.joinL||as(e,s,"z",-n/2,0,1,"L"),t.joinR||as(e,s,"z",n/2,0,-1,"R"),t.joinB||as(e,n,"x",0,-s/2,1,"B"),!t.joinF)){const g=Ke(Ne.treadWIn);if(m){const y=(n-g)/2;as(e,y,"x",-(g/2+y/2),s/2,-1,"F"),as(e,y,"x",g/2+y/2,s/2,-1,"F")}else as(e,n,"x",0,s/2,-1,"F")}if(m){const g=Ke(Ne.stairRunIn),y=Ke(Ne.treadDIn),_=Ke(Ne.treadWIn),w=Ke(hs.treadThickIn),P=g-Ne.stairSteps*y,R=o/Ne.stairSteps,A=Ii("tread",5002335),D=Ii("nose",12963028),K=Ii("rail",2896184),M=s/2;je(e,"stairJoint",_,w,P,A,0,o-w/2,M+P/2);const b=Ke(hs.riserIn);for(let k=0;k<Ne.stairSteps;k++){const I=o-R*k,W=M+P+y*k;je(e,"stairTread",_,w,y,A,0,I-w/2,W+y/2),je(e,"stairNose",_*.96,.008,.04,D,0,I-.008,W+y-.03),je(e,"stairRiser",_,R,b,K,0,I-R/2,W+y-b/2)}const z=Ke(hs.railIn),G=M+g,N=G-z-M;for(const k of[-1,1]){const I=k*(_/2-z/2);je(e,"stairRail",z,o,z,K,I,o/2,G-z/2),je(e,"stairRail",z,z,N,K,I,o-z/2,M+N/2),je(e,"stairRail",z,z,N*.7,K,I,R*.55,M+N*.45)}}return e.traverse(g=>{g.isMesh&&(g.castShadow=!1)}),e}_n.draw=(i,t,e,n={})=>{i.add(L2(t,n))};Lt(_n);Lt(Dt(7,"stool","seating","Bar stool",16,16,30,"stool",{snapsTo:["edge"],edgeKind:"stool"}));const $a={w:7.5,d:16.5,h:68.9},D2="Unconfirmed size. Tripod footprint is not confirmed.",U2=["Unconfirmed. missing-products.xlsx gives 7.5 × 16.5 × 68.9 in for a Sony PXW-Z190 on a Manfrotto 504X tripod. 68.9 in is the tripod maximum height. Confidence on the row is Medium.","The tripod spread footprint is not in the sheet. Legs and the camera body are drawn inside the published envelope. No wider stance was invented.","Rentacomputer.com has not confirmed which camera kit we rent."],N2=nt.colors.fg,O2=nt.colors.highlight,jd=nt.colors.accent,F2=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${N2}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 40l8-24 8 24M18 34h12"/><rect x="14" y="8" width="16" height="10" rx="1" stroke="${O2}"/><path d="M30 11h6v4h-6" stroke="${jd}"/></svg>`;function k2(i,t){const e=ot("kitPole",2764856),n=ot("kitHead",1711652),s=ot("kitBody",1185308),o=ot("kitLens",790550),a=ot("kitGlass",1784405,{emissive:928324}),l=ot("kitTick",ne(jd),{emissive:670276}),c=Math.min(t.w,t.d)*.07,h=t.h-c;for(const y of[-1,1])for(const _ of[-1,1])ue(i,c,c,h,e,y*(t.w/2-c),h/2,_*(t.d/2-c),8);it(i,t.w-c*2,c*.7,c*.7,e,0,t.h*.32,0),it(i,c*.7,c*.7,t.d-c*2,e,0,t.h*.32,0),it(i,t.w*.62,c,t.d*.28,n,0,t.h-c/2,0).name="streamHead";const u=t.w*.7,f=Math.min(t.h*.08,t.w*.45),d=t.d*.36,p=t.h-c-f/2;it(i,u,f,d,s,0,p,-t.d*.06).name="streamBody";const x=t.d*.16,v=-t.d*.06+d/2+x/2,m=ue(i,f*.22,f*.26,x,o,0,p,v,16);m.rotation.x=Math.PI/2;const g=ue(i,f*.12,f*.12,.008,a,0,p,v+x/2-.006,12);g.rotation.x=Math.PI/2,it(i,t.w*.16,.012,.012,l,0,p,-t.d*.06-d/2+.02)}const B2=Dt(54,"streamkit","tvs","Camera and live-streaming kit",$a.w,$a.d,$a.h,"streamkit",{note:D2,flags:U2,icon:F2(),draw:k2,unconfirmed:!0});Lt(B2);const Xa={w:24,d:25.1,h:26.3},z2="Unconfirmed size.",G2=["Unconfirmed. missing-products.xlsx lists a JBL EON718S candidate, 24 × 25.1 × 26.3 in, from the manufacturer page. Rentacomputer.com has not confirmed the subwoofer.","The row's W × D × H columns are the mixer (24.84 × 20.16 × 8.39 in). Those numbers are not used for this item."],H2=nt.colors.fg,V2=nt.colors.highlight,Kd=nt.colors.accent,W2=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${H2}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="10" y="8" width="28" height="32" rx="2"/><circle cx="24" cy="22" r="7" stroke="${V2}"/><circle cx="24" cy="22" r="2" stroke="${Kd}"/><path d="M16 36h16"/></svg>`;function $2(i,t){const e=ot("subCab",1448222),n=ot("subGrille",2765112),s=ot("subCone",921878),o=ot("subPort",460810),a=ot("subTick",ne(Kd),{emissive:670276});it(i,t.w,t.h,t.d,e,0,t.h/2,0).name="subCab",it(i,t.w*.86,t.h*.78,.01,n,0,t.h*.52,t.d/2-.012);const l=ue(i,t.w*.22,t.w*.22,.01,s,0,t.h*.58,t.d/2-.016,24);l.rotation.x=Math.PI/2;const c=ue(i,t.w*.06,t.w*.06,.01,o,0,t.h*.22,t.d/2-.016,16);c.rotation.x=Math.PI/2,it(i,t.w*.2,.012,.012,a,0,t.h*.1,t.d/2-.02)}const X2=Dt(51,"subwoofer","audio","Subwoofer",Xa.w,Xa.d,Xa.h,"subwoofer",{note:z2,flags:G2,icon:W2(),draw:$2,unconfirmed:!0});Lt(X2);Lt(Dt(0,"table6","tables","6 ft banquet table",72,30,30,"table",{topIn:30,edgeFor:["chair"]}));Lt(Dt(1,"table8","tables","8 ft banquet table",96,30,30,"table",{topIn:30,edgeFor:["chair"]}));const q2="UNCONFIRMED. Bob has not confirmed tents, or which sizes to offer. Candidate is a 20 × 20 ft high-peak frame tent, 8 ft legs, peak 16 ft 9 in. Outdoor use.",Y2=nt.colors.fg,Zd=nt.colors.highlight,j2=nt.colors.accent,K2=`<svg viewBox="0 0 48 48" fill="none" stroke="${Y2}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 34L24 10l18 24H6z"/><path d="M8 40h32M14 34v6M34 34v6"/><path d="M24 10v24" stroke="${Zd}"/><path d="M16 34h16" stroke="${j2}"/></svg>`,bn=8;function Z2(i,t){const e=ot("tentCanvas",15986920),n=ot("tentPole",12042442),s=ot("tentBand",ne(Zd)),o=ot("tentShade",15002611),a=.12;for(const d of[-1,1])for(const p of[-1,1])it(i,a*2,bn,a*2,n,d*(t.w/2-a),bn/2,p*(t.d/2-a)).name="tentPole";const l=.12;it(i,t.w,l,a*2,n,0,bn-l/2,t.d/2-a).name="tentEave",it(i,t.w,l,a*2,n,0,bn-l/2,-(t.d/2-a)),it(i,a*2,l,t.d-a*4,n,t.w/2-a,bn-l/2,0),it(i,a*2,l,t.d-a*4,n,-(t.w/2-a),bn-l/2,0);const c=1.1,h=bn-l-c/2;it(i,t.w,c,.04,e,0,h,t.d/2-.02).name="tentValance",it(i,t.w,c,.04,e,0,h,-(t.d/2-.02)),it(i,.04,c,t.d-.08,e,t.w/2-.02,h,0),it(i,.04,c,t.d-.08,e,-(t.w/2-.02),h,0),it(i,t.w*.46,.05,.012,s,0,h,t.d/2-.012);const u=t.h-bn,f=5;for(let d=0;d<f;d++){const p=d/f,x=bn+u*p,v=bn+u*((d+1)/f),m=Math.max(.3,t.w*(1-p)-.04),g=Math.max(.3,t.d*(1-p)-.04);it(i,m,v-x,g,d%2?o:e,0,(x+v)/2,0).name="tentRoof"}it(i,.2,u,.2,n,0,bn+u/2,0).name="tentPeak",it(i,.55,.08,.55,s,0,t.h-.04,0)}const J2=Dt(72,"tent","decor","Event tent",240,240,201,"tent",{note:q2,icon:K2,draw:Z2,unconfirmed:!0,flags:["Bob has not confirmed tents, or which sizes to offer.","Candidate is a 20 × 20 ft high-peak frame tent with 8 ft legs and a 16 ft 9 in peak.","Outdoor use. The planner does not block placing it indoors."]});Lt(J2);const Q2=nt.colors.fg,Jd=nt.colors.highlight,xu=nt.colors.accent;ld.touchkiosk=`<svg viewBox="0 0 48 48" fill="none" stroke="${Q2}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="14" y="3" width="20" height="38" rx="1.5"/><path d="M10 44h28"/><g stroke="${xu}" fill="${xu}33"><rect x="17" y="7" width="14" height="24" rx="0.8"/></g><g stroke="${Jd}"><path d="M18 35h12"/></g></svg>`;const tS=["Rental model is not confirmed. missing-products.xlsx asks which touchscreen kiosk Rentacomputer.com rents.","The spreadsheet candidate name is KIPICT555. The cited spec sheet is Peerless-AV KIPICT2555. The envelope is that spec: 34.00 x 75.06 x 19.00 in (W x H x D).","Glass size is the spec 55 in diagonal at 16:9, turned portrait. The spec does not give the glass position. It is centered on the front of the published envelope."],Vs=Dt(28,"touchkiosk","kiosks","55 in touchscreen kiosk",34,19,75.06,"touchkiosk",{snapsTo:["backwall","nearwall"],note:"Candidate size (Peerless-AV KIPICT2555). Model not confirmed.",flags:tS});Lt(Vs);Ic(Vs.w,Vs.h,Vs.d,i=>{const{w:t,h:e,d:n}=Vs,s=gt(Fd),o=gt(Od),a=.012,l=.008;We(i,t,e,n,Re("kioskBody",1448222),0,e/2,0),Pc(i,s,o,a,0,e/2,n/2-a/2+l);const c=e/2-o/2-.09;We(i,s*.42,.022,.006,Re("kioskTick",ne(Jd)),0,c,n/2+.004)});const eS=nt.colors.fg,Qd=nt.colors.highlight,vu=nt.colors.accent;ld.touchtable=`<svg viewBox="0 0 48 48" fill="none" stroke="${eS}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 18h36v6H6zM10 24v16M38 24v16"/><g stroke="${vu}" fill="${vu}33"><rect x="12" y="20" width="24" height="3.2" rx="0.4"/></g><g stroke="${Qd}"><path d="M16 16h16"/></g></svg>`;const nS=["Rental model is not confirmed. missing-products.xlsx asks which touch table Rentacomputer.com rents (55 or 65 in, table or tilt). One manufacturer page only.","Envelope 71.0 x 35.6 x 29.0 in (L x W x H) is the Visionair-e 55 in Designer Interactive Touch Table line on that page.","16:9 is the page heading over the standard sizes, including 55 in. The 55 in paragraph does not repeat the aspect. Glass is the 55 in 16:9 area centered in the top. The page does not give the glass position.","Top thickness and leg size are not published. They are drawn inside the published envelope. The page describes clear glass legs; the model uses a pale solid leg."],Ws=Dt(29,"touchtable","kiosks","55 in touchscreen table",71,35.6,29,"touchtable",{note:"Candidate size (Visionair-e 55 in table). Model not confirmed.",flags:nS});Lt(Ws);const to=.1;Ic(Ws.w,Ws.h,Ws.d,i=>{const{w:t,h:e,d:n}=Ws,s=gt(Od),o=gt(Fd),a=.012,l=.07;We(i,t,to,n,Re("tableTop",16054008),0,e-to/2,0),We(i,s+l*2,.016,o+l*2,Re("tableBezel",1711652),0,e+.002,0),Pc(i,s,a,o,0,e+.012,0);const c=e-to,h=t/2-.34,u=n/2-.28;for(const f of[-1,1])for(const d of[-1,1])Jl(i,.055,c,Re("tableLeg",14016232),f*h,c/2,d*u);We(i,t*.22,.012,.02,Re("tableTick",ne(Qd)),0,e-to-.02,n/2-.02)});Lt(Dt(21,"tower","kiosks","Charging tower",16,16,72,"tower",{snapsTo:["backwall"]}));Lt(Dt(11,"tv55","tvs","55 in TV",48.2,24,66,"tv",{snapsTo:["wall"],panelIn:28,wallDIn:3,mountCenterIn:60}));Lt(Dt(12,"tv75","tvs","75 in TV",65.7,28,72,"tv",{snapsTo:["wall"],panelIn:38,wallDIn:3,mountCenterIn:62}));const tc=74.97,$s=42.71,tf=31.97,go=13.07,di=.12;function iS(i){const t=pr(),e=be(tc),n=be($s),s=be(go),o=be(tf);if(i==="wall")return _e(t,e,n,di,Co(),0,n/2,0),Ro(t,e-.12,n-.12,0,n/2,di/2+.01),_e(t,e*.35,n*.4,.04,nr(),0,n/2,-di/2-.015),As(t);const a=s/2-di/2-.04;_e(t,o,.07,s,Wo(),0,.035,0);for(const l of[-1,1])_e(t,.08,n*.42,.08,Ts(),l*o*.32,.07+n*.21,a-di/2-.05);return _e(t,e,n,di,Co(),0,n/2,a),Ro(t,e-.14,n-.14,0,n/2,a+di/2+.01),_e(t,e*.22,.035,.008,fr(),0,.12,a+di/2+.014),As(t)}Lt(Dt(41,"tv85","tvs","Large-format TV (85 in)",tc,go,$s,"tv85",{snapsTo:["wall"],panelIn:$s,wallDIn:go,mountCenterIn:$s/2,unconfirmed:!0,note:"Unconfirmed on-stand height. Samsung QM85C panel 74.97 × 42.71 in, stand footprint 31.97 × 13.07 in. Panel thickness and wall-mount height are not published.",gaps:["On-stand overall height is not published. Item height is the QM85C panel height 42.71 in. The panel is not raised on an unsourced pole.","QM85C panel thickness is not in the sheet. The 3.8 in depth belongs to the QM98T alternate and is not used. The cabinet depth is a drawing thickness inside the 13.07 in stand.","Wall-mount height is not published. On a wall the panel bottom sits at the floor.","Wall collision depth uses the sourced stand depth 13.07 in because a wall-mount thickness is not published.","98 in QM98T (86.5 × 3.8 × 49.24 in) is an alternate and is not the model drawn."],sources:["https://knitec.com/pages/samsung-qm-c-series-specifications","https://s7d9.scene7.com/is/content/techdata/Samsung-QM98T-CORP-Datasheetpdf"],parts:{panel:{wIn:tc,hIn:$s},stand:{wIn:tf,dIn:go}},mesh:iS,icon:mr('<rect x="3" y="10" width="42" height="24" rx="1.5"/><path d="M14 34v6M34 34v6M12 42h24" stroke="{{T}}"/><rect x="7" y="14" width="34" height="16" rx="1" stroke="{{O}}"/>')}));const sS=24,rS=42,oS="PLACEHOLDER. No vending model in missing-products.xlsx. Envelope is the AMS Classic Snack 5-wide, 39 × 35 × 72 in, on two AMS sheets. Crane Merchant cabinets are 33 or 44 in wide, so this is not a shared standard. Not confirmed for Rentacomputer.com. Front portrait screen is drawn 24 × 42 in. Screen size is UNCONFIRMED.",aS=nt.colors.fg,lS=nt.colors.highlight,ec=nt.colors.accent,cS=()=>`<svg viewBox="0 0 48 48" fill="none" stroke="${aS}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="12" y="4" width="24" height="40" rx="1"/><rect x="16" y="8" width="16" height="26" rx="0.8" stroke="${ec}" fill="${ec}33"/><path d="M16 38h16" stroke="${lS}"/></svg>`;function hS(i,t){const e=sS/12,n=rS/12,s=.012,o=.008,a=ot("vendBezel",1382429),l=t.h*.58,c=t.d/2-s/2+o;it(i,e+.14,n+.14,.02,a,0,l,c-s/2-.012).name="vendBezel";const h=new ve({color:1784405,emissive:928324}),u=new zt(new se(e,n,s),h);return u.position.set(0,l,c),u.name="screen",u.userData.screen=1,u.userData.ownMat=1,i.add(u),it(i,e*.28,.02,.006,ot("vendTick",ne(ec)),0,l-n/2-.06,t.d/2+.004).name="vendTick",u}function uS(i,t){const e=ot("vendBody",2765116),n=ot("vendTrim",1382429),s=ot("vendBin",921878),o=.05;it(i,t.w,t.h,t.d-.04,e,0,t.h/2,-.02).name="vendBody",it(i,t.w,o,.04,n,0,t.h-o/2,t.d/2-.02),it(i,t.w,o,.04,n,0,o/2,t.d/2-.02),it(i,o,t.h,.04,n,t.w/2-o/2,t.h/2,t.d/2-.02),it(i,o,t.h,.04,n,-t.w/2+o/2,t.h/2,t.d/2-.02),hS(i,t),it(i,t.w*.7,t.h*.12,.03,s,0,t.h*.16,t.d/2-.02).name="vendBin"}const dS=Dt(67,"vending","decor","Vending machine",39,35,72,"vending",{snapsTo:["nearwall"],note:oS,icon:cS(),draw:uS,unconfirmed:!0,placeholder:!0});Lt(dS);const fS=28.3,pS=80.7,mS="UNCONFIRMED model. Walk-through metal detector sized from the CEIA HI-PE Multi-Zone candidate: 32.9 × 26 × 88.8 in, opening 28.3 × 80.7 in. Which detector Rentacomputer.com rents is not confirmed.",gS=nt.colors.fg,ef=nt.colors.highlight,nf=nt.colors.accent,xS=`<svg viewBox="0 0 48 48" fill="none" stroke="${gS}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 42V10h24v32"/><path d="M12 14h24" stroke="${ef}"/><path d="M18 22h4M26 28h4" stroke="${nf}"/></svg>`;function vS(i,t){const e=ot("wtmeterBody",2896704),n=ot("wtmeterPanel",1711912),s=ot("wtmeterLamp",ne(nf),{emissive:1333352}),o=ot("wtmeterTick",ne(ef)),a=fS/12,l=pS/12,c=(t.w-a)/2,h=t.h-l;it(i,c,t.h,t.d,e,-t.w/2+c/2,t.h/2,0).name="wtmeterUpright",it(i,c,t.h,t.d,e,t.w/2-c/2,t.h/2,0).name="wtmeterUpright",it(i,t.w,h,t.d,e,0,t.h-h/2,0).name="wtmeterHeader",it(i,c*.72,.42,.04,n,t.w/2-c/2,t.h*.38,t.d/2-.03).name="wtmeterPanel",it(i,c*.28,.06,.012,s,t.w/2-c/2,t.h*.5,t.d/2-.02),it(i,t.w*.28,.04,.012,o,0,t.h-h/2,t.d/2-.01).name="wtmeterLamp"}const _S=Dt(71,"wtmeter","decor","Walk-through metal detector",32.9,26,88.8,"wtmeter",{note:mS,icon:xS,draw:vS,unconfirmed:!0,flags:["Rental model is not confirmed. Envelope is the CEIA HI-PE Multi-Zone candidate, 32.9 × 26 × 88.8 in.","Walk-through opening is 28.3 in wide and 80.7 in tall, from that candidate spec."]});Lt(_S);const eo=i=>Math.round(i/12*1e3)/1e3,sf=({order:i,...t})=>t,rf=k_().map(sf),Dc=F_().map(sf),Uc=Object.fromEntries(Dc.map(i=>[i.id,i]));for(const i of Dc)i.panelIn&&(i.panel=eo(i.panelIn)),i.wallDIn&&(i.wallD=eo(i.wallDIn)),i.mountCenterIn&&(i.mountY=eo(i.mountCenterIn-i.panelIn/2)),i.sideHIn&&(i.sideH=eo(i.sideHIn));const of=i=>`${+i.w.toFixed(2)} × ${+i.d.toFixed(2)} ft, ${+i.h.toFixed(2)} ft tall (typical)`,af=["ledposter","stage"],MS=2,SS=2.5,qa=.5;let yS=1;const Jt=i=>Uc[i.type];function sr(i,t=0,e=0,n=0){return{uid:"i"+Date.now().toString(36)+(yS++).toString(36),type:i,x:t,z:e,a:n,y:0,host:null,mode:"free"}}const wS=i=>i.mode==="wall",Vi=i=>{const t=Jt(i);return{w:t.w,d:wS(i)?t.wallD:t.d}},fn=Math.cos,pn=Math.sin,Fi=(i,t,e)=>t>e?(t+e)/2:Math.max(t,Math.min(e,i)),Nn=(i,t,e,n,s)=>[i+n*fn(e)+s*pn(e),t-n*pn(e)+s*fn(e)],On=(i,t,e,n,s)=>{const o=n-i,a=s-t;return[o*fn(e)-a*pn(e),o*pn(e)+a*fn(e)]},bS=(i,t,e)=>[t*fn(i)+e*pn(i),-t*pn(i)+e*fn(i)],ES=(i,t)=>Math.atan2(i,t),TS=i=>i.type?{x:i.x,z:i.z,a:i.a,...Vi(i)}:i;function nc(i,t=0){const e=TS(i),{w:n,d:s}=e,o=n/2-t,a=s/2-t;return[[-o,-a],[o,-a],[o,a],[-o,a]].map(([l,c])=>Nn(e.x,e.z,e.a,l,c))}function Gs(i,t,e=.02){const n=nc(i,e),s=nc(t,e);for(const o of[i.a,t.a])for(const[a,l]of[[fn(o),-pn(o)],[pn(o),fn(o)]]){const c=n.map(([u,f])=>u*a+f*l),h=s.map(([u,f])=>u*a+f*l);if(Math.max(...c)<=Math.min(...h)||Math.max(...h)<=Math.min(...c))return!1}return!0}function AS(i,t){const{w:e,d:n}=Vi(t),s=e/2-.01,o=n/2-.01,a=Math.max(1,Math.ceil(e/.5)),l=Math.max(1,Math.ceil(n/.5));for(let c=0;c<=a;c++)for(let h=0;h<=l;h++){const[u,f]=Nn(t.x,t.z,t.a,-s+2*s*c/a,-o+2*o*h/l);if(!__(i,u,f))return!1}return!0}function CS(i){const t=[];for(const e of i){const n=Jt(e);if(!n.booth&&!n.wallHost)continue;const s=n.w/2,o=n.d/2,a=(l,c,h,u,f,d,p)=>{const[x,v]=Nn(e.x,e.z,e.a,l,c),[m,g]=Nn(e.x,e.z,e.a,h,u),[y,_]=bS(e.a,f,d);t.push({x1:x,z1:v,x2:m,z2:g,nx:y,nz:_,src:p,host:e.uid})};n.booth?(a(-s,-o+.15,s,-o+.15,0,1,"boothBack"),a(-s+.1,-o,-s+.1,o,1,0,"boothSide"),a(s-.1,o,s-.1,-o,-1,0,"boothSide")):(a(-s,o,s,o,0,1,"drape"),a(s,-o,-s,-o,0,-1,"drape"))}return t}function no(i,t,e,n,s){const o=Jt(i);let a=null;for(const l of n){const c=l.x2-l.x1,h=l.z2-l.z1,u=Math.hypot(c,h);if(u<o.w-.01)continue;const f=c/u,d=h/u,p=Fi((t-l.x1)*f+(e-l.z1)*d,o.w/2,u-o.w/2),x=l.x1+f*p,v=l.z1+d*p;if((t-x)*l.nx+(e-v)*l.nz<-.75)continue;const m=x+l.nx*(s/2+.02),g=v+l.nz*(s/2+.02),y=Math.hypot(t-m,e-g);y<MS&&(!a||y<a.dist)&&(a={x:m,z:g,a:ES(l.nx,l.nz),dist:y,host:l.host,hl:{seg:l}})}return a}const _u=(i,t)=>{const e=[];let n=t.host;for(;n;){const s=i.find(o=>o.uid===n);if(!s||e.includes(s))break;e.push(s),n=s.host}return e},Wi=(i,t)=>{const e=[],n=[t.uid];for(;n.length;){const s=n.shift();for(const o of i)o.host===s&&!e.includes(o)&&(e.push(o),n.push(o.uid))}return e},RS=(i,t,e)=>_u(i,t).includes(e)||_u(i,e).includes(t);function PS(i,t,e,n){let s=null;const o=Jt(t),a=Wi(i,t);for(const l of i){const c=Jt(l);if(l===t||!c.top||a.includes(l)||l.mode==="top")continue;let[h,u]=On(l.x,l.z,l.a,e,n);const f=t.a-l.a,d=Math.abs(fn(f))*o.w/2+Math.abs(pn(f))*o.d/2,p=Math.abs(pn(f))*o.w/2+Math.abs(fn(f))*o.d/2;if(c.round){const m=c.w/2,g=Math.hypot(h,u);if(g>m+qa)continue;const y=m-Math.hypot(d,p);g>y&&g>0&&(h*=y/g,u*=y/g)}else{if(Math.abs(h)>c.w/2+qa||Math.abs(u)>c.d/2+qa)continue;h=Fi(h,-c.w/2+d,c.w/2-d),u=Fi(u,-c.d/2+p,c.d/2-p)}const[x,v]=Nn(l.x,l.z,l.a,h,u);(!s||c.top>s.y)&&(s={x,z:v,a:t.a,y:c.top,host:l.uid,hl:{item:l.uid}})}return s}function IS(i,t,e,n){const s=Jt(t),o=s.edgeKind==="stool"?.25:.3;let a=null;for(const l of i){const c=Jt(l);if(!c.edgeFor||!c.edgeFor.includes(s.edgeKind))continue;const[h,u]=On(l.x,l.z,l.a,e,n);let f;if(c.round){let v=Math.atan2(h,u);v=Math.round(v/(Math.PI/4))*(Math.PI/4);const m=c.w/2+s.d/2-o;f=[m*pn(v),m*fn(v),v+Math.PI]}else{const v=c.w/2,m=c.d/2,g=s.d/2-o,y=[m-u,u+m,v-h,h+v].map(Math.abs),_=y.indexOf(Math.min(...y));f=_===0?[Fi(h,-v+s.w/2,v-s.w/2),m+g,Math.PI]:_===1?[Fi(h,-v+s.w/2,v-s.w/2),-m-g,0]:_===2?[v+g,Fi(u,-m+s.w/2,m-s.w/2),-Math.PI/2]:[-v-g,Fi(u,-m+s.w/2,m-s.w/2),Math.PI/2]}const[d,p]=Nn(l.x,l.z,l.a,f[0],f[1]),x=Math.hypot(e-d,n-p);x<SS&&(!a||x<a.dist)&&(a={x:d,z:p,a:l.a+f[2],dist:x,host:l.uid,hl:{item:l.uid}})}return a}const Ya={gap:.5,ang:Math.PI/18,lz:.5},lf=i=>Math.atan2(Math.sin(i),Math.cos(i));function Lo(i,t){if(!t||!af.includes(t.type))return t?[t]:[];const e=new Map(i.filter(o=>o.type===t.type).map(o=>[o.uid,o])),n=[t],s=[t];for(;s.length;){const o=s.shift();for(const a of o.links||[]){const l=e.get(a);l&&!n.includes(l)&&(n.push(l),s.push(l))}}return n}function LS(i,t){const e={joinL:!1,joinR:!1};if(!t||t.type!=="ledposter"||!(t.links||[]).length)return e;const n=Jt(t).w;for(const s of t.links){const o=i.find(c=>c.uid===s);if(!o||Math.abs(lf(o.a-t.a))>.001)continue;const[a,l]=On(t.x,t.z,t.a,o.x,o.z);Math.abs(l)<.05&&Math.abs(Math.abs(a)-n)<.05&&(e[a>0?"joinR":"joinL"]=!0)}return e}function ic(i,t){!i||!t||i===t||(i.links=[...new Set([...i.links||[],t.uid])],t.links=[...new Set([...t.links||[],i.uid])])}function Nc(i,t){if(!t)return 0;const e=(t.links||[]).length;for(const n of i)n.links&&(n.links=n.links.filter(s=>s!==t.uid),n.links.length||delete n.links);return delete t.links,e}function DS(i,t,e,n,s=t.a){if(t.type!=="ledposter")return null;const o=Jt(t),a=Lo(i,t);let l=null;for(const c of i){if(c===t||c.type!=="ledposter"||a.includes(c)||Math.abs(lf(s-c.a))>Ya.ang+1e-9)continue;const h=Jt(c),[u,f]=On(c.x,c.z,c.a,e,n),d=h.w/2+o.w/2,p=Math.abs(u)-d;if(Math.abs(p)>Ya.gap+1e-9||Math.abs(f)>Ya.lz)continue;const x=(Math.sign(u)||1)*d;if(i.some(y=>y!==t&&y!==c&&y.type==="ledposter"&&!a.includes(y)&&(([_,w])=>Math.abs(_-x)<d-.05&&Math.abs(w)<h.d)(On(c.x,c.z,c.a,y.x,y.z))))continue;const[v,m]=Nn(c.x,c.z,c.a,x,0),g=Math.abs(p);(!l||g<l.dist)&&(l={x:v,z:m,a:c.a,dist:g,join:c.uid,hl:{item:c.uid}})}return l}function gr(i,t,e,n=i.a,s=.5){const o=Jt(i),a=Math.abs(fn(n))*o.w/2+Math.abs(pn(n))*o.d/2,l=Math.abs(pn(n))*o.w/2+Math.abs(fn(n))*o.d/2;return{x:Math.round((t-a)/s)*s+a,z:Math.round((e-l)/s)*s+l,a:n,y:0,host:null,mode:"free",hl:null}}function xr(i,t,e,n,s=.5){const o=Jt(t),a=i.items.filter(d=>d!==t),l=Wi(i.items,t),c=a.filter(d=>!l.includes(d)),h=i.env==="outdoor",u=()=>h?[]:dd(i.walls),f=d=>CS(c).filter(d);if(t.type==="ledposter"){const d=DS(i.items,t,e,n);if(d)return{...d,y:0,mode:"free"}}if(t.type==="stage"){const d=I2(i.items,t,e,n);if(d)return{x:d.x,z:d.z,a:d.a,join:d.join,y:0,host:null,mode:"free"}}{const d=k1(i,t,e,n);if(d)return d}for(const d of o.snapsTo){let p=null;if(d==="top"&&(p=PS(i.items,t,e,n),p))return{...p,mode:"top"};if(d==="edge"&&(p=IS(c,t,e,n),p))return{...p,y:0,mode:"edge"};if(d==="wall"&&(p=no(t,e,n,[...u(),...f(()=>!0)],o.wallD),p))return{...p,y:o.mountY,mode:"wall"};if(d==="wallfloor"&&(p=no(t,e,n,[...u(),...f(x=>x.src==="boothBack")],o.d),p))return{...p,y:0,mode:"wallfloor"};if(d==="backwall"&&(p=no(t,e,n,f(x=>x.src==="boothBack"),o.d),p))return{...p,y:0,mode:"backwall"};if(d==="nearwall"&&!h&&(p=no(t,e,n,u(),o.d),p))return{...p,y:0,mode:"wallfloor"}}return gr(t,e,n,t.a,s)}function Rn(i,t,e){const n=Wi(i.items,t),s=e.a-t.a;for(const o of n){const[a,l]=On(t.x,t.z,t.a,o.x,o.z),[c,h]=Nn(e.x,e.z,e.a,a,l);o.x=c,o.z=h,o.a+=s}Object.assign(t,{x:e.x,z:e.z,a:e.a,y:e.y||0,host:e.host||null,mode:e.mode||"free"})}function ti(i,t){const e=i.items,n=Jt(t);if(t.mode==="top"){const s=e.find(a=>a.uid===t.host);if(!s)return!1;const o=Jt(s);for(const[a,l]of nc(t,.01)){const[c,h]=On(s.x,s.z,s.a,a,l);if(o.round?Math.hypot(c,h)>o.w/2+.01:Math.abs(c)>o.w/2+.01||Math.abs(h)>o.d/2+.01)return!1}return!e.some(a=>a!==t&&a.mode==="top"&&a.host===t.host&&Gs(t,a))}if(t.mode==="wall")return t.host&&!e.some(s=>s.uid===t.host)?!1:!e.some(s=>s!==t&&s.mode==="wall"&&Gs(t,s)&&Math.abs(s.y-t.y)<Math.max(n.panel,Jt(s).panel||0));if(!AS(ur(i.walls),t))return!1;for(const s of fd(i.walls))if(Gs(t,s))return!1;for(const s of i.cols||[])if(Gs(t,s))return!1;for(const s of e){if(s===t||s.mode==="top"||s.mode==="wall")continue;const o=Jt(s);if(!!n.booth==!!o.booth&&!RS(e,t,s)&&Gs(t,s))return!1}return!0}function US(i,t){af.includes(t.type)&&Nc(i.items,t);const e=new Set([t,...Wi(i.items,t)]);return i.items=i.items.filter(n=>!e.has(n)),e.size}function Oc(i,t,e,n,s=14){for(let o=0;o<=s;o++)for(let a=-o;a<=o;a++)for(const[l,c]of o?[[a,-o],[a,o],[-o,a],[o,a]]:[[0,0]]){const h=xr(i,t,e+l,n+c),u={...t};Object.assign(t,{x:h.x,z:h.z,a:h.a,y:h.y,host:h.host,mode:h.mode});const f=ti(i,t);if(Object.assign(t,u),f)return h}return null}const NS=i=>(Array.isArray(i)?i:[]).filter(t=>t&&Uc[t.type]&&[t.x,t.z,t.a].every(Number.isFinite)).map(t=>({uid:String(t.uid),type:t.type,x:t.x,z:t.z,a:t.a,y:Number.isFinite(t.y)?t.y:0,host:t.host?String(t.host):null,...t.preset?{preset:String(t.preset)}:{},...t.type==="ledposter"&&Array.isArray(t.links)&&t.links.length?{links:t.links.map(String)}:{},mode:["free","top","edge","wall","wallfloor","backwall"].includes(t.mode)?t.mode:"free"})),OS="3.39",cf="esp.layout.v3",FS=["rentourav.esp.v3"],kS=3,Mi=2e3;function Fc(i){return JSON.stringify({schema:kS,app:OS,env:i.env,walls:i.walls||[],items:i.items||[],mute:!!i.mute,venue:i.venue||null,fill:i.fill||null,lvl:Number.isInteger(i.lvl)?i.lvl:1,levels:i.levels||{},tech:i.tech||"showcase",saved:i.saved||Date.now()})}function BS(i){return!i||typeof i!="object"?null:(i.schema||(i={schema:1,env:i.env||"indoor",tiles:i.tiles||[],mute:!!i.mute}),i.schema<2&&(i={...i,schema:2,items:[]}),i.schema<3&&(i={...i,schema:3,walls:w_(i.tiles),migratedFromTiles:!0}),i)}const Do=-3,Uo=20;function Mu(i){const t=NS(i.items),e=new Set(t.map(n=>n.uid));return t.forEach(n=>{n.host&&!e.has(n.host)&&(n.host=null,n.mode!=="wall"&&(n.mode="free"))}),{walls:y_(i.walls),items:t,venue:i.venue&&typeof i.venue=="object"?i.venue:null,fill:i.fill&&typeof i.fill=="object"&&(Array.isArray(i.fill.booths)||Array.isArray(i.fill.seats))?i.fill:null}}function hf(i){let t;try{t=BS(JSON.parse(i))}catch{return null}if(!t)return null;const e=Mu(t),n=Number.isInteger(t.lvl)&&t.lvl>=Do&&t.lvl<=Uo?t.lvl:1,s={};if(t.levels&&typeof t.levels=="object")for(const[o,a]of Object.entries(t.levels)){const l=+o;if(Number.isInteger(l)&&l>=Do&&l<=Uo&&l!==n&&a&&typeof a=="object"){const c=Mu(a);(c.walls.length||c.items.length)&&(s[l]=c)}}return{env:t.env==="outdoor"?"outdoor":"indoor",walls:e.walls,items:e.items,mute:!!t.mute,venue:e.venue,fill:e.fill,lvl:n,levels:s,tech:["essentials","standard","showcase"].includes(t.tech)?t.tech:"showcase",saved:t.saved||0,migrated:!!t.migratedFromTiles}}const zS=100;function GS(i=zS){let t=[],e=[],n=null;return{reset(s){t=[],e=[],n=s},record(s){return n===null?(n=s,!1):s===n?!1:(t.push(n),t.length>i&&t.shift(),e=[],n=s,!0)},undo(){return t.length?(e.push(n),n=t.pop(),n):null},redo(){return e.length?(t.push(n),t.length>i&&t.shift(),n=e.pop(),n):null},get canUndo(){return t.length>0},get canRedo(){return e.length>0},get size(){return t.length+e.length},get current(){return n}}}dr({id:"banquet",name:"Banquet",note:"Round tables with 8 chairs",order:2});dr({id:"booth",name:"Booth",note:"10 x 10 booths along the walls, a table in each",order:0});dr({id:"classroom",name:"Classroom",note:"Rows of tables facing a podium",order:1});dr({id:"registration",name:"Registration",note:"Check-in tables, laptops, signs and kiosks",order:4});dr({id:"theater",name:"Theater",note:"Rows of chairs facing a stage (36 in rows)",order:3});const ja=.5;function HS(i,t,e,n){const s=i[t];if(!s)return[];const o=s.pts.length,a=s.pts[e],l=s.pts[(e+1)%o];if(!a||!l)return[];const c=Math.hypot(l[0]-a[0],l[1]-a[1]);if(!c)return[];const h=(l[0]-a[0])/c,u=(l[1]-a[1])/c,f=an/2+ja+1e-6,d=new Set;for(const p of n){if(p.host)continue;const{w:x,d:v}=Vi(p),m=Math.cos(p.a),g=Math.sin(p.a);let y=!1;for(const[_,w]of[[-x/2,-v/2],[x/2,-v/2],[x/2,v/2],[-x/2,v/2],[0,0]]){const P=p.x+_*m+w*g,R=p.z-_*g+w*m,A=(P-a[0])*h+(R-a[1])*u;if(!(A<-ja||A>c+ja)&&Math.abs(-(P-a[0])*u+(R-a[1])*h)<=f){y=!0;break}}if(y){d.add(p);for(const _ of Wi(n,p))d.add(_)}}return[...d]}function VS(i){const t=i.filter(n=>n.closed&&n.pts.length>=3);if(t.length){let n=null;for(const s of t){const o=Pn([s]);(!n||o.w*o.l>n.w*n.l)&&(n=o)}return n}return Pn(i)||yc(ur(i))}const kc=B_().map(({id:i,name:t,note:e})=>({id:i,name:t,note:e})),Fe={classRow:3.25,classCentre:4.5,classSide:3.5,wall:3,banquetChairBacks:5,boothAisle:10,regQueue:9,regBehind:5.1,door:3},Ka=120,WS=i=>{if(!i)return i;const t={...i};for(const[e,n]of[["minX","maxX"],["minZ","maxZ"]]){const s=(t[e]+t[n])/2;t[n]-t[e]>Ka&&(t[e]=s-Ka/2,t[n]=s+Ka/2)}return"w"in t&&(t.w=t.maxX-t.minX),"l"in t&&(t.l=t.maxZ-t.minZ),t},rr=[{id:"essentials",name:"Essentials",note:"Furniture + minimal tech"},{id:"standard",name:"Standard",note:"About half the tech"},{id:"showcase",name:"Showcase",note:"Every screen, kiosk and charger"}],Bc="showcase",$S=i=>Math.max(0,rr.findIndex(t=>t.id===i))||(i==="essentials"?0:2);function XS(i,t,e=Bc){const n=z_(i);if(n&&n.build)return n.build(t,e);const s=WS(VS(t.walls));if(!s)return[];const o={env:t.env,walls:t.walls,items:[]},a=an/2+2,l=s.minX+a,c=s.maxX-a;s.minZ+a,s.maxZ-a;const h=(l+c)/2,u=$S(e),f=N=>u>={e:0,s:1,x:2}[N],d=(N,k,I,W=0,B=!1)=>{const Y=sr(N,k,I,W);return o.items.push(Y),Rn(o,Y,B?xr(o,Y,k,I):gr(Y,k,I,W)),B&&Y.mode==="free"&&(Y.a=W),ti(o,Y)?Y:(o.items.pop(),null)},p=(N,k,I,W)=>{const B=sr(N,k,I,W);return o.items.push(B),Rn(o,B,{x:k,z:I,a:W,y:0,host:null,mode:"free"}),ti(o,B)?B:(o.items.pop(),null)},x=(N,k,I,W,B=0,Y=!1)=>f(N)?d(k,I,W,B,Y):null,v=(N,k,I,W,B)=>{if(!f(N)||!I)return null;const Y=d(k,W,B,I.a,!0);return Y&&Y.host!==I.uid?(o.items.splice(o.items.indexOf(Y),1),null):Y},m=(N,k)=>{for(const[I,W]of k){const B=d("chair",I,W,0,!0);B&&B.host!==N.uid&&o.items.splice(o.items.indexOf(B),1)}},g=an/2,y=s.minX+g,_=s.maxX-g,w=s.minZ+g,P=s.maxZ-g,R=Vo(t.walls),A=(N,k,I)=>R.some(W=>Math.hypot(W.x-N,W.z-k)<I+ke/2+Fe.door),D=(N,k)=>N-k>=y+Fe.wall-1e-6&&N+k<=_-Fe.wall+1e-6,K=N=>{const k=[],I=ke/2+Fe.door+N+.6,W=N+.6,B=R.length?R.slice(0,4):[{x:(y+_)/2,z:P}];for(const Y of B){const et=[[Math.abs(Y.z-w),0,1],[Math.abs(Y.z-P),0,-1],[Math.abs(Y.x-y),1,0],[Math.abs(Y.x-_),-1,0]].sort((Pt,V)=>Pt[0]-V[0])[0],j=et[1],xt=et[2];for(const Pt of[I,I+2*N+.4])for(const V of[-1,1])k.push([Y.x+j*W+(xt?V*Pt:0),Y.z+xt*W+(j?V*Pt:0),Math.atan2(j,xt),xt?V:0,j?V:0])}return k},M=(N,k,I,W,B,Y)=>{const et=Jt({type:"ledposter"}).w,j=[];for(let xt=0;xt<N;xt++){const Pt=(j[0]?j[0].x:k)+B*et*xt,V=(j[0]?j[0].z:I)+Y*et*xt,Z=A(Pt,V,1.1)?null:xt===0?d("ledposter",Pt,V,W):p("ledposter",Pt,V,j[0].a);if(!Z){for(const lt of j)o.items.splice(o.items.indexOf(lt),1);return null}j.push(Z)}for(let xt=1;xt<N;xt++)ic(j[xt-1],j[xt]);return j},b=(N,k)=>{if(!f(N))return 0;let I=0;const W=K(1.1);for(let B=0;B<W.length&&I<k.length;B++){const[Y,et,j,xt,Pt]=W[B];if(Y<y+.8||Y>_-.8||et<w+.8||et>P-.8)continue;const V=/^wall(\d)$/.exec(k[I]);(V?M(+V[1],Y,et,j,xt,Pt)||d("ledposter",Y,et,j):d(k[I],Y,et,j))&&I++}return I},z=(N,k,I)=>f(N)?d(k,I,w+1,0,!0):null,G=(N,k,I)=>{f(N)&&(d(k,y+.5,I,Math.PI/2,!0),d(k,_-.5,I,-Math.PI/2,!0))};if(i==="banquet"){const k=Math.ceil((8.06+Fe.banquetChairBacks)*2)/2,I=4.03+Fe.wall,W=4.5,B=Math.max(1,Math.floor((_-y-2*I)/k)+1),Y=Math.max(1,Math.floor((P-w-W-2*I)/k)+1),et=(y+_)/2-(B-1)*k/2,j=(w+W+P)/2-(Y-1)*k/2;if(_-y<2*I||P-w-W<2*I)return[];for(let Z=0;Z<B;Z++)for(let lt=0;lt<Y;lt++){const at=et+Z*k,Rt=j+lt*k;if(A(at,Rt,4.03))continue;const Ot=d("round60",at,Rt);Ot&&m(Ot,[...Array(8)].map((Gt,Xt)=>[Ot.x+3.2*Math.sin(Xt*Math.PI/4),Ot.z+3.2*Math.cos(Xt*Math.PI/4)]))}const xt=z("s","led",h),Pt=xt?5.6+1.5:0,V=f("s")?d("podium",h+Pt,w+1.6):null;v("s","laptop",V,V&&V.x,V&&V.z),G("s","tv75",w+(P-w)*.35);for(const[Z,lt,at]of[[y+1,w+1,"s"],[_-1,w+1,"s"],[y+1,P-1,"x"],[_-1,P-1,"x"]])x(at,"speaker",Z,lt);b("s",f("x")?["wall3","ledposter","tower"]:["ledposter"])}if(i==="classroom"){const W=Math.ceil((3.68+Fe.classRow)*2)/2,B=Fe.classCentre,Y=Fe.classSide,et=Math.max(1,Math.floor((_-y-2*Y+B)/(6+B))),j=et*6+(et-1)*B,xt=(y+_)/2-j/2+6/2,Pt=f("x")?z("x","led",h):z("s","screen",h),V=d("podium",Pt?Math.min(h+7.2,_-2):(y+_)/2,w+1.5);v("e","laptop",V,V&&V.x,V&&V.z);const Z=w+7.5,lt=Math.max(0,Math.floor((P-Fe.wall-2.43-Z)/W)+1);let at=0;for(let Rt=0;Rt<lt;Rt++)for(let Ot=0;Ot<et;Ot++){const Gt=xt+Ot*(6+B),Xt=Z+Rt*W;if(A(Gt,Xt,3.5))continue;const J=d("table6",Gt,Xt);J&&(m(J,[[J.x-1.6,J.z+1.6],[J.x+1.6,J.z+1.6]]),(f("x")||f("s")&&at%2===0)&&v("s","laptop",J,J.x-1.6,J.z+.3),v("x","ipad",J,J.x+1.6,J.z+.3),at++)}lt>=3&&G("x","tv75",Z+W*Math.floor(lt/2)),x("s","speaker",y+1,w+1),x("s","speaker",_-1,w+1),b("x",["tower","wall2"])}if(i==="theater"){const I=Fe.classCentre,W=w+9,B=Math.floor((_-y-2*Fe.wall-I)/2/1.5),Y=Math.PI;if(B<2||P-Fe.wall-W<3)return[];const et=f("s")?K(1.1):[],j=(Z,lt)=>et.some(([at,Rt])=>Math.abs(at-Z)<2.6&&Math.abs(Rt-lt)<2.6);for(let Z=W;Z+.83<=P-Fe.wall+1e-6;Z+=3)for(const lt of[-1,1])for(let at=0;at<B;at++){const Rt=h+lt*(I/2+.75+at*1.5);A(Rt,Z,1.2)||j(Rt,Z)||d("chair",Rt,Z,Y)}const xt=z("s","led",h),Pt=10/2+.6;xt&&f("x")&&(z("x","screen",h-5.9-Pt),z("x","screen",h+5.9+Pt));const V=d("podium",h+(xt?-6.6:0),w+(xt?4.2:1.6));v("e","laptop",V,V&&V.x,V&&V.z),x("s","speaker",y+1,w+1.5),x("s","speaker",_-1,w+1.5),x("x","speaker",y+1,(W+P)/2),x("x","speaker",_-1,(W+P)/2),b("s",f("x")?["wall3","ledposter","kiosk","tower"]:["ledposter"])}if(i==="registration"){const N=w+Fe.regBehind+2.43,k=Math.max(1,Math.min(4,Math.floor((_-y-2*Fe.wall+1)/7))),I=(y+_)/2-(k-1)*7/2;let W=0;f("x")?z("x","led",h):f("s")&&d("tv75",h,w+.5,0,!0);for(let Y=0;Y<k;Y++){const et=I+Y*7;if(A(et,N,4))continue;const j=d("table6",et,N);j&&(W++,m(j,[[j.x-1.6,j.z-1.6],[j.x+1.6,j.z-1.6]]),v("e","laptop",j,j.x-1.9,j.z),v("s","laptop",j,j.x+1.9,j.z),v("x","monitor",j,j.x,j.z-.4))}if(W)for(const Y of[-1,1]){const et=Y<0?I-3.5-1.5:I+(k-1)*7+3.5+1.5;D(et,1.05)&&!A(et,N,1.1)&&x(Y<0?"s":"x","ledposter",et,N)}const B=N+1.25+Fe.regQueue+1.5;if(B+1+Fe.regQueue/2<P)for(const[Y,et]of[[-5,"s"],[5,"s"],[-10,"x"],[10,"x"]]){const j=(y+_)/2+Y;D(j,.75)&&!A(j,B,.75)&&x(et,"kiosk",j,B)}{const Y=h+(f("x")?7.6:3.6);D(Y,.67)&&x("x","tower",Y,w+1.2)}}if(i==="booth"){const N=an/2+5.5,k=s.minX+N,I=s.maxX-N,W=Math.max(1,Math.floor((I-k)/10.5)+1),B=(k+I)/2-(W-1)*10.5/2,Y=s.l>=20+Fe.boothAisle?[[s.minZ+N,0],[s.maxZ-N,Math.PI]]:[[s.minZ+N,0]];let et=0;for(const[j,xt]of Y)for(let Pt=0;Pt<W;Pt++){const V=B+Pt*10.5;if(A(V,j,7.1))continue;const Z=d("booth10",V,j,xt);if(!Z)continue;const lt=d("table6",Z.x,Z.z,0),at=Math.cos(xt),Rt=Z.z-at*4.4;(f("x")||f("s")&&et%2===0)&&d("tv55",Z.x,Rt,xt,!0),v("s",lt&&f("x")&&et%2?"ipad":"laptop",lt,lt&&lt.x-1.5,lt&&lt.z),f("x")&&lt&&et%2===0&&v("x","ipad",lt,lt.x+1.5,lt.z),x("x","ledposter",Z.x+3.8,Z.z+at*3.8,xt),et++}if(Y.length>1){const j=(Y[0][0]+Y[1][0])/2;for(let xt=1,Pt=0;xt<W;xt+=3,Pt++)x(Pt%2?"x":"s","tower",B+(xt-.5)*10.5,j)}if(f("s")){const j=[...K(5.6),[y+1,(w+P)/2,Math.PI/2],[_-1,(w+P)/2,-Math.PI/2]];for(const[xt,Pt,V]of j)if(d("led",xt,Pt,V))break}}return o.items}const qS=i=>{const t={};for(const e of i)t[Jt(e).name]=(t[Jt(e).name]||0)+1;return t};r.DBG={err:"",lost:0,restored:0,crashes:0};r.noteErr=i=>{r.DBG.err=new Date().toLocaleTimeString()+"  "+(i&&(i.stack||i.message)||String(i))};addEventListener("error",i=>r.noteErr(i.error||i.message));addEventListener("unhandledrejection",i=>r.noteErr(i.reason));r.sim=null,r.simG=null,r.lastEvent=null,r.simLast=0;r.HL=ne(nt.colors.highlight),r.AC=ne(nt.colors.accent);r.$=i=>document.querySelector(i),r.$$=i=>[...document.querySelectorAll(i)];r.S={env:"indoor",walls:[],items:[],mute:!1,preset:"30x40",venue:null,fill:null,lvl:1,levels:{},tech:Bc};r.selDoor=null,r.active=null,r.selSeg=null,r.rub=null,r.tool="view",r.lock={axis:null},r.boxA=null,r.boxIdx=null,r.wasAligned=!1;r.topDown=!1,r.panMode=!1,r.wallsView="low",r.stamp=null,r.picker=!1,r.pendEdit=null,r.push=null,r.editPi=null,r.editGood=!0,r.preTop=null;r.W={get env(){return r.S.env},get walls(){return r.S.walls},get items(){return r.S.items},set items(i){r.S.items=i},get cols(){return r.S.venue?r.S.venue.cols:[]},get fill(){return r.S.fill}};r.loadSaved=()=>{try{return hf(localStorage.getItem(cf)||FS.map(i=>localStorage.getItem(i)).find(Boolean)||null)}catch{return null}};r.saveT=0;r.save=()=>{clearTimeout(r.saveT),r.saveT=setTimeout(r.saveNow,300),r.H.record(r.snap())&&r.histUI()};r.H=GS();r.snap=()=>JSON.stringify({env:r.S.env,walls:r.S.walls,items:r.S.items,venue:r.S.venue,fill:r.S.fill,lvl:r.S.lvl,levels:r.S.levels,active:r.active});r.histUI=function(){r.$$(".hUndo").forEach(t=>t.disabled=!r.H.canUndo),r.$$(".hRedo").forEach(t=>t.disabled=!r.H.canRedo)};r.restore=function(t){if(!t)return;typeof r.simStop=="function"&&r.simStop();const e=JSON.parse(t);r.S.env=e.env,r.S.walls=e.walls,r.S.items=e.items,r.S.venue=e.venue||null,r.S.fill=e.fill||null,r.S.lvl=Number.isInteger(e.lvl)?e.lvl:1,r.S.levels=e.levels||{},typeof r.renderPresets=="function"&&r.renderPresets(),r.active=e.active!=null&&r.S.walls[e.active]&&!r.S.walls[e.active].closed?e.active:null,r.rub=null,r.selSeg=null,r.selDoor=null,r.corner=null,r.draw=null,r.push=null,r.pendEdit=null,r.editPi=null,r.editGood=!0,r.confirmUI(),r.boxA=r.boxIdx=null,r.drag=null,r.S.preset=null,r.renderPresets(),r.select(null),r.applyEnv(),r.syncItems(),clearTimeout(r.saveT),r.saveT=setTimeout(r.saveNow,300),r.histUI(),r.rebuildSoon()};r.undo=function(){if(r.pendEdit)return r.cancelEdit();const t=r.H.undo();t&&(r.restore(t),r.sTile(!1),r.toast("Undone"))};r.redo=function(){r.commitEdit();const t=r.H.redo();t&&(r.restore(t),r.sTile(!0),r.toast("Redone"))};r.histReset=()=>{r.H.reset(r.snap()),r.histUI()};r.beginEdit=function(){return r.commitEdit(),{walls:JSON.stringify(r.S.walls),items:JSON.stringify(r.S.items),preset:r.S.preset}};r.putBack=i=>{r.S.walls=JSON.parse(i.walls),r.S.preset=i.preset,i.items&&(r.S.items=JSON.parse(i.items),r.syncItems())};r.finishEdit=function(t,e,n){if(!r.editGood)return r.putBack(t),r.editPi=null,r.editGood=!0,r.renderPresets(),r.buildUI(),r.rebuildSoon(),r.sBad(),r.toast("That doesn't fit, so it was put back");if(e){r.pendEdit=t,r.confirmUI(),r.S.preset=null,r.renderPresets(),r.buildUI(),r.rebuildSoon(),n&&r.toast(n+" · tap ✓ to keep it");return}r.editPi=null,r.wallsChanged(),n&&r.toast(n)};r.commitEdit=function(){r.pendEdit&&(r.pendEdit=null,r.editPi=null,r.confirmUI(),r.wallsChanged())};r.cancelEdit=function(){r.pendEdit&&(r.putBack(r.pendEdit),r.pendEdit=null,r.editPi=null,r.editGood=!0,r.active=null,r.selSeg=null,r.selDoor=null,r.confirmUI(),r.renderPresets(),r.buildUI(),r.rebuildSoon(),r.sTile(!1),r.toast("Change cancelled"))};r.confirmUI=function(){const t=r.$("#confirm");t&&t.classList.toggle("hidden",!r.pendEdit)};r.WALLS_VIEWS=["low","full","hidden"],r.WV_NAME={low:"Low",full:"Full",hidden:"Hidden"};r.wallHt=function(){const t=r.S.env==="outdoor";return r.wallsView==="full"?t?3.5:9:r.wallsView==="hidden"?t?.05:.08:t?.35:r.WALL_H};r.setTop=function(t){if(t!==r.topDown){if(r.topDown=t,t){r.preTop=r.V.yaw,r.V.yaw=Math.round(r.V.yaw/(Math.PI/2))*(Math.PI/2);const e=Pn(r.S.walls);if(e){const n=Math.max(.3,innerWidth/Math.max(1,innerHeight)),s=Math.abs(Math.sin(r.V.yaw))>.5,o=s?e.l:e.w,a=s?e.w:e.l;r.V.tx=(e.minX+e.maxX)/2,r.V.tz=(e.minZ+e.maxZ)/2,r.V.dist=Math.max(20,Math.max(o/n,a)*1.75)}}else r.preTop!=null&&(r.V.yaw=r.preTop);r.viewUI(),r.setHint(),r.frame()}};r.setPanMode=function(t){r.panMode=!!t,r.viewUI(),r.setHint()};r.setWallsView=function(t){r.wallsView=t,r.viewUI(),r.rebuildSoon()};r.viewUI=function(){const t=r.$("#btnTop"),e=r.$("#btnPanMode"),n=r.$("#btnWallsView");t&&(t.classList.toggle("on",r.topDown),t.querySelector("span").textContent=r.topDown?"3D view":"Top view",e.classList.toggle("on",r.panMode),e.querySelector("span").textContent=r.panMode?"Drag: Pan":"Drag: Turn",n.querySelector("span").textContent="Walls: "+r.WV_NAME[r.wallsView],n.classList.toggle("on",r.wallsView!=="low"))};r.stampUI=function(){r.$("#stampBar").classList.toggle("hidden",!(r.stamp||r.picker)),r.$("#btnSame").classList.toggle("on",!!(r.stamp||r.picker)),r.$("#stampTxt").textContent=r.stamp?`Placing ${Uc[r.stamp.type].name} · tap the floor to add more`:"Same again: tap an item to copy it",r.setHint()};r.startStamp=function(t){r.stamp={type:t.type,a:t.a},r.picker=!1,r.select(null),r.stampUI(),r.sTile(!0)};r.endStamp=function(){r.stamp=null,r.picker=!1,r.stampUI()};r.stampAt=function(t,e){const n=r.groundAt(t,e);if(!n)return;const s=sr(r.stamp.type,n[0],n[1],r.stamp.a);r.S.items.push(s);const o=Oc(r.W,s,n[0],n[1],4)||xr(r.W,s,n[0],n[1]);if(Rn(r.W,s,o),!ti(r.W,s))return r.S.items.splice(r.S.items.indexOf(s),1),r.syncItems(),r.sBad(),r.toast("No room there");r.anim.set(s.uid,performance.now()),r.sDrop(),r.save(),r.syncItems(),r.frame()};r.logoImg=new Image;r.logoImg.src=nt.logo;r.layoutPng=function(){return r.endFx(),new Promise(t=>{r.placeCam(),r.R.render(r.scene,r.camera);const e=r.R.domElement,n=e.width,s=e.height,o=Math.round(Math.max(56,s*.08)),a=document.createElement("canvas");a.width=n,a.height=s+o;const l=a.getContext("2d");l.drawImage(e,0,0);const c=nt.colors;l.fillStyle=c.strip,l.fillRect(0,s,n,o);let h=o*.25,u=!1;if(r.logoImg.complete&&r.logoImg.naturalWidth){const d=o*.62,p=d*(r.logoImg.naturalWidth/r.logoImg.naturalHeight);l.drawImage(r.logoImg,o*.2,s+(o-d)/2,p,d),h=o*.2+p+o*.3,u=!0}const f=Math.round(o*(h>n*.55?.2:.28));l.fillStyle=c.stripText,l.font=`700 ${f}px ${nt.fonts.body}`,l.textBaseline="middle",l.fillText(u?nt.appName:`${nt.name} · ${nt.appName}`,h,s+o*.36),l.fillStyle=c.stripSub,l.font=`600 ${Math.round(f*.8)}px ${nt.fonts.body}`,l.fillText(wc(r.S.walls)+` · ${r.S.items.length} item${r.S.items.length===1?"":"s"}`,h,s+o*.7),a.toBlob(d=>{const p={w:a.width,h:a.height,logo:u};a.width=a.height=0,t({blob:d,info:p})},"image/png")})};r.lastShare=null;r.shareLayout=async function(){const{blob:t,info:e}=await r.layoutPng();if(!t)return r.toast("Could not make the picture"),null;const n=new File([t],"my-event-layout.png",{type:"image/png"});try{if(navigator.canShare&&navigator.share&&navigator.canShare({files:[n]}))return r.lastShare={how:"share",...e,size:t.size},await navigator.share({files:[n],title:nt.copy.shareTitle,text:nt.copy.shareText}),r.lastShare}catch(a){if(a&&a.name==="AbortError")return r.lastShare}const s=URL.createObjectURL(t),o=document.createElement("a");return o.href=s,o.download="my-event-layout.png",document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(s),1500),r.lastShare={how:"download",...e,size:t.size},r.toast("Picture saved"),r.sTile(!0),r.lastShare};function uf(i){if(!i||i.env==="outdoor")return 0;let t=0;for(let e=0;e<(i.walls||[]).length;e++){const n=i.walls[e];if(!n||!n.closed||(n.doors||[]).length||!n.pts||n.pts.length<3)continue;let s=0,o=0;for(let l=0;l<n.pts.length;l++){const c=n.pts[l],h=n.pts[(l+1)%n.pts.length],u=Math.hypot(h[0]-c[0],h[1]-c[1]);u>s&&(s=u,o=l)}if(s<ke+1)continue;const a=xd(i.walls,e,o,s/2);a&&!a.error&&t++}return t}r.showEventPresets=function(){r.$("#sheet").classList.remove("hidden"),r.$("#sheet").classList.add("presetsheet"),r.$("#shBack").classList.add("hidden"),r.$("#shTitle").textContent="Event presets",r.$("#shBody").innerHTML=r.techRowHTML()+'<div class="catgrid">'+kc.map(t=>`<button class="cat evp" data-ev="${t.id}">${r.EV_ICONS[t.id]}<span>${t.name}</span><small>${t.note}</small></button>`).join("")+"</div>",r.bindTechRow(),r.$$(".evp").forEach(t=>t.onclick=()=>r.useEventPreset(t.dataset.ev))};r.techRowHTML=()=>`<div class="techrow" role="radiogroup" aria-label="Tech level"><b>Tech level</b><div class="seg">${rr.map(i=>`<button class="tlv${i.id===r.S.tech?" on":""}" role="radio" aria-checked="${i.id===r.S.tech}" data-tech="${i.id}">${i.name}</button>`).join("")}</div><small id="techNote">${(rr.find(i=>i.id===r.S.tech)||{}).note||""}</small></div>`;r.setTech=function(t){if(!rr.some(n=>n.id===t))return;r.S.tech=t,r.$$(".tlv").forEach(n=>{const s=n.dataset.tech===t;n.classList.toggle("on",s),n.setAttribute("aria-checked",s)});const e=r.$("#techNote");e&&(e.textContent=rr.find(n=>n.id===t).note||""),clearTimeout(r.saveT),r.saveT=setTimeout(r.saveNow,300)};r.bindTechRow=function(){r.$$(".tlv").forEach(t=>t.onclick=()=>r.setTech(t.dataset.tech))};r.hasPreset=()=>!!r.S.fill||r.S.items.some(i=>i.preset);r.isFillKind=i=>!!r.S.venue&&i!=="registration";r.presetName=i=>({theater:"Theater"})[i]||(kc.find(t=>t.id===i)||{}).name||i;r.useEventPreset=function(t,e){return!e&&r.hasPreset()?(r.presetAsk(t),"ask"):r.isFillKind(t)?r.useVenueFill(t,e||"add"):r.applyLayout(t,e||"add")};r.dropPresetItems=function(){const t=new Set;for(const e of r.S.items)if(e.preset){t.add(e);for(const n of Wi(r.S.items,e))t.add(n)}return r.S.items=r.S.items.filter(e=>!t.has(e)),t.size};r.presetAsk=function(t){r.closePresetAsk();const e=r.isFillKind(t)&&!!r.S.fill,n=r.S.items.filter(a=>a.preset).length,s=r.S.fill?n?`a room fill and ${n} preset item${n===1?"":"s"}`:"a room fill":`${n} preset item${n===1?"":"s"}`,o=document.createElement("div");o.id="presetAsk",o.className="pask",o.setAttribute("role","dialog"),o.setAttribute("aria-modal","true"),o.innerHTML=`<div class="paskbox"><b>${r.presetName(t)} preset</b><p>This floor already has ${s}. Items you placed yourself stay either way.</p>
    <label class="paskopt"><input type="radio" name="pask" value="replace" checked><span>Replace current preset</span></label>
    <label class="paskopt${e?" off":""}"><input type="radio" name="pask" value="add"${e?" disabled":""}><span>Add alongside${e?" <small>(one room fill per floor)</small>":""}</span></label>
    <div class="paskbtns"><button id="paskCancel" class="pbtn">Cancel</button><button id="paskOk" class="pbtn on">Apply</button></div></div>`,document.body.appendChild(o),o.onclick=a=>{a.target===o&&r.closePresetAsk()},r.$("#paskCancel").onclick=()=>r.closePresetAsk(),r.$("#paskOk").onclick=()=>{const a=o.querySelector("input[name=pask]:checked").value;r.closePresetAsk(),r.useEventPreset(t,a)},r.$("#paskOk").focus()};r.closePresetAsk=function(){const t=r.$("#presetAsk");t&&t.remove()};r.applyLayout=function(t,e){const n=r.presetName(t),s=XS(t,r.W,r.S.tech);if(!s.length)return r.sBad(),r.toast("This room is too small for that layout"),!1;r.closeSheet(),r.endStamp(),r.select(null),r.lastEvent=t,e==="replace"&&(r.dropPresetItems(),r.S.fill=null);for(const l of s)l.preset=t;r.S.items=[...r.S.items,...s];for(const l of s)l.host||r.anim.set(l.uid,performance.now());const o=uf(r.W);o&&r.rebuild(),r.syncItems(),r.save(),r.sSnap();const a=Pn(r.S.walls);return a&&r.burst((a.minX+a.maxX)/2,(a.minZ+a.maxZ)/2,70),qS(s),r.toast(`${n} layout (${r.techName()}): ${s.length} items ${e==="replace"?"replaced the old preset":"added"}${o?" + a door":""} · Undo to take it back`),r.frame(),!0};r.EV_ICONS=Object.fromEntries(Object.entries({booth:'<svg viewBox="0 0 48 48" fill="none" stroke="#f4efe6" stroke-width="2.5"><path d="M6 38V12h16v26M26 38V12h16v26"/><path d="M10 30h8M30 30h8" stroke="#ff6a1a"/></svg>',classroom:'<svg viewBox="0 0 48 48" fill="none" stroke="#f4efe6" stroke-width="2.5"><path d="M18 8h12" stroke="#ff6a1a"/><path d="M8 18h12M28 18h12M8 28h12M28 28h12M8 38h12M28 38h12"/></svg>',banquet:'<svg viewBox="0 0 48 48" fill="none" stroke="#f4efe6" stroke-width="2.5"><circle cx="24" cy="24" r="9"/><g stroke="#2ce0c6"><circle cx="24" cy="9" r="2.5"/><circle cx="24" cy="39" r="2.5"/><circle cx="9" cy="24" r="2.5"/><circle cx="39" cy="24" r="2.5"/><circle cx="13.5" cy="13.5" r="2.5"/><circle cx="34.5" cy="34.5" r="2.5"/><circle cx="13.5" cy="34.5" r="2.5"/><circle cx="34.5" cy="13.5" r="2.5"/></g></svg>',registration:'<svg viewBox="0 0 48 48" fill="none" stroke="#f4efe6" stroke-width="2.5"><path d="M6 22h36M10 22v14M38 22v14"/><rect x="14" y="13" width="8" height="6" stroke="#2ce0c6"/><rect x="27" y="13" width="8" height="6" stroke="#2ce0c6"/><path d="M24 30v10M20 40h8" stroke="#ff6a1a"/></svg>',theater:'<svg viewBox="0 0 48 48" fill="none" stroke="#f4efe6" stroke-width="2.5"><rect x="12" y="6" width="24" height="6" rx="1" stroke="#2ce0c6"/><path d="M8 20h8M20 20h8M32 20h8M8 28h8M20 28h8M32 28h8M8 36h8M20 36h8M32 36h8"/></svg>'}).map(([i,t])=>[i,t.replace(/#f4efe6/g,nt.colors.fg).replace(/#ff6a1a/g,nt.colors.highlight).replace(/#2ce0c6/g,nt.colors.accent)])),r.NO_SAVE=/selftest/.test(location.search),r.saveNow=()=>{if(!r.NO_SAVE)try{localStorage.setItem(cf,Fc(r.S))}catch{}};typeof r.simStop!="function"&&(r.simStop=function(){});r.showScreen=function(t){r.$$(".screen").forEach(e=>e.classList.toggle("on",e.id===t)),t==="build"&&(r.resize(),r.frame()),t==="start"&&r.startUI()};r.startUI=function(){const t=r.loadSaved(),e=t&&(t.walls.length||t.items.length);r.$("#btnOpen").disabled=!e,r.$("#savedNote").textContent=e?`Saved layout: ${wc(t.walls)}, ${t.items.length} item${t.items.length===1?"":"s"} (${t.env==="outdoor"?"Outdoor":"Indoor"})`:"No saved layout yet."};r.$("#btnNew").onclick=()=>{const i=r.loadSaved();i&&(i.walls.length||i.items.length)&&!confirm("Start a new layout? This replaces your saved layout.")||(r.S.venue=null,r.S.fill=null,r.S.lvl=1,r.S.levels={},r.S.walls=[],r.S.items=[],r.S.env="indoor",r.$$(".choice").forEach(t=>t.classList.toggle("on",t.dataset.env==="indoor")),r.showScreen("setup"))};r.$("#btnOpen").onclick=()=>{const i=r.loadSaved();i&&(Object.assign(r.S,{env:i.env,walls:i.walls,items:i.items,venue:i.venue||null,fill:i.fill||null,lvl:i.lvl??1,levels:i.levels||{},tech:i.tech||Bc}),r.active=null,r.selSeg=null,r.setMute(i.mute),r.applyEnv(),r.select(null),r.setPhase("place"),r.resetView(),r.showScreen("build"),r.toast(i.migrated?"Layout opened. Your floor was turned into walls.":"Layout opened"),r.histReset())};r.$$("[data-go]").forEach(i=>i.onclick=()=>r.showScreen(i.dataset.go));r.$$(".choice").forEach(i=>i.onclick=()=>{r.$$(".choice").forEach(t=>t.classList.toggle("on",t===i)),r.S.env=i.dataset.env});r.$("#btnBuild").onclick=()=>{r.usePreset(x_[r.S.env]),r.applyEnv(),r.select(null),r.setPhase("build"),r.resetView(),r.save(),r.showScreen("build"),r.histReset()};r.$("#btnHome").onclick=()=>{r.commitEdit(),r.endStamp(),r.saveNow(),r.closeSheet(),r.showScreen("start")};r.phase="build",r.hintShown=!1;r.HINT_KEY="esp.presetHint.v1";r.hintT=0;r.showPresetHint=function(){if(r.hintShown||r.S.items.length||r.S.fill||r.sim)return;r.hintShown=!0;try{if(!r.NO_SAVE){if(localStorage.getItem(r.HINT_KEY))return;localStorage.setItem(r.HINT_KEY,"1")}}catch{}const t=r.$("#presetTip");t.classList.remove("hidden"),r.$("#btnEvents").classList.add("pulse"),clearTimeout(r.hintT),r.hintT=setTimeout(()=>{t.classList.add("hidden"),r.$("#btnEvents").classList.remove("pulse")},6e3)};r.setPhase=function(t){r.phase=t,t!=="place"&&r.simStop(),r.$("#btnRun")&&r.$("#btnRun").classList.toggle("hidden",t!=="place"),t==="place"&&r.$("#presetTip")?setTimeout(r.showPresetHint,0):r.$("#presetTip")&&r.$("#presetTip").classList.add("hidden"),t!=="place"&&(r.stamp||r.picker)&&r.$("#stampBar")&&(r.stamp=null,r.picker=!1,r.stampUI()),t==="build"&&r.$("#drawTools")&&(r.tool="view",r.active=null,r.rub=null,r.$$("#drawTools button").forEach(n=>n.classList.toggle("on",n.dataset.tool==="view"))),r.$$("#modes button").forEach(n=>n.classList.toggle("on",n.dataset.phase===t)),r.$("#toolsBuild").classList.toggle("hidden",t!=="build"),r.$("#toolsPlace").classList.toggle("hidden",t!=="place"),t==="build"?r.select(null):(r.active=null,r.selSeg=null,r.rub=null),r.$("#presets").classList.toggle("hidden",t!=="build"),r.cursorDot.visible=!1;const e=r.$("#hint");e.style.opacity=1,r.setHint(),r.$("#drawTools").classList.toggle("hidden",t!=="build"),r.buildUI(),r.rebuildSoon()};r.setMode=i=>r.setPhase(i==="move"?"place":"build");r.usePreset=function(t){r.S.preset=t,r.S.venue=null,r.S.fill=null,r.S.walls=v_(t),r.active=null,r.selSeg=null,r.rub=null,r.renderPresets()};r.renderPresets=function(){r.$("#presets").innerHTML=cd.map(t=>`<button data-p="${t.id}" class="${r.S.preset===t.id?"on":""}">${t.name}</button>`).join(""),r.$$("#presets button[data-p]").forEach(t=>t.onclick=()=>{r.usePreset(t.dataset.p),uf(r.W),r.resetView(),r.save(),r.rebuild(),r.sDrop()})};r.buildUI=function(){const t=r.$("#drawTools [data-tool=door]");t&&t.classList.toggle("hidden",r.S.env==="outdoor"&&!r.S.walls.some(n=>n.pts.length>=2)),t&&t.classList.contains("hidden")&&r.tool==="door"&&(r.tool="view",r.$$("#drawTools button").forEach(n=>n.classList.toggle("on",n.dataset.tool==="view")),r.setHint()),r.$("#btnDelWall").textContent=r.selDoor?"Delete door":"Delete wall",r.$("#btnDelWall").disabled=!r.selSeg&&!r.selDoor;const e=r.active!=null&&r.S.walls[r.active];r.$("#btnCloseWalls").classList.toggle("hidden",!(r.tool==="walls"&&e&&!e.closed&&e.pts.length>=3))};r.wallsChanged=function(){r.S.preset=null,r.renderPresets(),r.buildUI(),r.save(),r.rebuildSoon()};r.$$(".hUndo").forEach(i=>i.onclick=r.undo);r.$$(".hRedo").forEach(i=>i.onclick=r.redo);r.$("#btnDelWall").onclick=()=>{if(r.selDoor)return L_(r.S.walls,r.selDoor.pi,r.selDoor.k),r.selDoor=null,r.sTile(!1),r.toast("Door removed"),r.wallsChanged();r.selSeg&&(S_(r.S.walls,r.selSeg.pi,r.selSeg.i),r.selSeg=null,r.active=null,r.wallsChanged(),r.toast("Wall removed"))};r.setTool=function(t){r.tool=t,r.$$("#drawTools button").forEach(e=>e.classList.toggle("on",e.dataset.tool===t)),r.tool!=="walls"&&(r.active=null,r.rub=null,r.lock.axis=null),r.selDoor=null,r.selSeg=null,r.cursorDot.visible=!1,r.setHint(),r.buildUI(),r.rebuildSoon()};r.$$("#drawTools button").forEach(i=>i.onclick=()=>r.commitEdit()||r.setTool(i.dataset.tool===r.tool&&r.tool!=="view"?"view":i.dataset.tool));r.setHint=function(){const t=r.$("#hint");t.style.opacity=1;const e=s=>` · Tap ${s} again to stop drawing`,n=r.topDown||r.panMode?"pan":"turn the view";t.textContent=r.phase!=="build"?r.stamp?"Tap the floor to add another · Tap Done when finished":r.picker?"Tap a placed item to copy it":`Tap an item to select it · Drag items to move · Drag empty space to ${n}`:r.tool==="view"?`Drag to ${n} · Pick Box, Walls or Door to draw or edit walls`:r.tool==="box"?"Drag corner to corner to make a room · Drag a wall arrow to push or pull it"+e("Box"):r.tool==="door"?"Tap a wall to add a 3 ft door"+e("Door"):"Tap point to point · Walls stay square"+e("Walls")};r.$("#btnCloseWalls").onclick=()=>{if(r.active==null)return;const i=r.active;r.active=md(r.S.walls,r.active),r.celebrate(r.S.walls[i]&&r.S.walls[i].closed?r.S.walls[i]:r.S.walls[r.S.walls.length-1]),r.rub=null,r.lock.axis=null,r.sSnap(),r.toast("Room closed"),r.wallsChanged(),r.setTool("view")};r.$("#btnWallsDone").onclick=()=>{r.commitEdit(),r.active=null,r.rub=null,r.selSeg=null,r.setPhase("place"),r.save()};r.$$("[data-phase]").forEach(i=>i.onclick=()=>{r.commitEdit(),r.setPhase(i.dataset.phase)});r.$("#btnOk").onclick=()=>{r.commitEdit(),r.sSnap(),r.toast("Kept")};r.$("#btnCancel").onclick=r.cancelEdit;r.$("#btnTop").onclick=()=>r.setTop(!r.topDown);r.$("#btnPanMode").onclick=()=>r.setPanMode(!r.panMode);r.$("#btnWallsView").onclick=()=>{r.setWallsView(r.WALLS_VIEWS[(r.WALLS_VIEWS.indexOf(r.wallsView)+1)%3]),r.toast("Walls: "+r.WV_NAME[r.wallsView])};r.$("#btnSame").onclick=()=>{if(r.stamp||r.picker)return r.endStamp();const i=r.selItem();i?(r.startStamp(i),r.toast("Same again: "+Jt(i).name)):(r.picker=!0,r.stampUI())};r.$("#btnStampDone").onclick=r.endStamp;r.$("#btnEvents").onclick=()=>{r.$("#presetTip").classList.add("hidden"),r.$("#btnEvents").classList.remove("pulse"),r.showEventPresets()};r.$("#presetTip").onclick=()=>r.$("#btnEvents").click();r.$("#btnShare").onclick=()=>{r.commitEdit(),r.shareLayout()};r.$("#btnReset").onclick=()=>{r.resetView(),r.frame()};r.$("#btnMute").onclick=()=>{r.setMute(!r.S.mute),r.save()};r.setMute=function(t){r.S.mute=t,r.$("#icoSnd .w").style.display=t?"none":"",r.$("#icoSnd .x").style.display=t?"":"none"};r.toastT;r.toast=function(t){const e=r.$("#toast");e.textContent=t,e.classList.add("on"),clearTimeout(r.toastT),r.toastT=setTimeout(()=>e.classList.remove("on"),1600)};r.actx,r.lastTone=0;r.tone=function(t,e,n,s,o="sine"){if(r.S.mute)return;const a=performance.now();if(!(a-r.lastTone<40)){r.lastTone=a,r.DBG.tones=(r.DBG.tones||0)+1;try{r.actx=r.actx||new(window.AudioContext||window.webkitAudioContext);const l=r.actx.createOscillator(),c=r.actx.createGain(),h=r.actx.currentTime;l.type=o,l.frequency.setValueAtTime(t,h),l.frequency.exponentialRampToValueAtTime(e,h+n*.6),c.gain.setValueAtTime(1e-4,h),c.gain.exponentialRampToValueAtTime(s,h+.005),c.gain.exponentialRampToValueAtTime(1e-4,h+n),l.connect(c).connect(r.actx.destination),l.start(h),l.stop(h+n+.01)}catch{}}};r.buzz=i=>{if(!r.S.mute&&navigator.vibrate)try{navigator.vibrate(i)}catch{}},r.sTile=i=>{r.tone(i?880:520,i?1320:340,.08,.12),r.buzz(6)},r.sDrop=()=>{r.tone(420,260,.12,.16),r.buzz(10)},r.sSnap=()=>{r.tone(1500,2400,.06,.14,"triangle"),r.buzz([8,30,8])},r.sBad=()=>{r.tone(150,110,.22,.18,"square"),r.buzz([40,40,40])},r.cv=r.$("#cv"),r.R=new Sv({canvas:r.cv,antialias:!0});r.R.setPixelRatio(Math.min(devicePixelRatio,2));r.scene=new yv,r.camera=new vn(40,1,.3,8e3);r.scene.add(new o_(16777215,2241348,1.7));r.sun=new c_(16777215,1.3);r.sun.position.set(30,60,20);r.scene.add(r.sun);r.ground=new zt(new Fn(Mi,Mi),new ve({color:858664}));r.ground.rotation.x=-Math.PI/2;r.ground.position.y=-.02;r.scene.add(r.ground);r.grid1=new Sc(Mi,Mi,2771560,1716296);r.grid1.position.y=.001;r.scene.add(r.grid1);r.grid10=new Sc(Mi,Mi/10,2771560,2771560);r.grid10.position.y=.012;r.grid10.visible=!1;r.scene.add(r.grid10);r.grid100=new Sc(Mi,Mi/100,2771560,2771560);r.grid100.position.y=.014;r.grid100.visible=!1;r.scene.add(r.grid100);r.floorG=new fe;r.scene.add(r.floorG);r.floorTex=new wv(new Uint8Array(16),2,2);r.floorTex.magFilter=r.floorTex.minFilter=Je;r.floorTex.wrapS=r.floorTex.wrapT=xo;r.floorTex.repeat.set(.5,.5);r.floorTex.colorSpace=En;r.setFloorColors=function(t,e){const n=r.floorTex.image.data,s=new Yt(t),o=new Yt(e);[s,o,o,s].forEach((a,l)=>{n[l*4]=Math.round(a.r*255),n[l*4+1]=Math.round(a.g*255),n[l*4+2]=Math.round(a.b*255),n[l*4+3]=255}),r.floorTex.needsUpdate=!0};r.floorMat=new ve({color:16777215,map:r.floorTex});new Fn(1,1).rotateX(-Math.PI/2);r.dotGeo=new mn(.5,.5,.2,20),r.dotMat=new Oe({color:r.HL}),r.dotStartMat=new Oe({color:r.AC}),r.cursorDot=new zt(r.dotGeo,new Oe({color:r.HL,transparent:!0,opacity:.6}));r.cursorDot.visible=!1;r.scene.add(r.cursorDot);r.doorGhost=new zt(new se(1,1,1).translate(0,.5,0),new Oe({color:8381439,transparent:!0,opacity:.55,depthWrite:!1}));r.doorGhost.visible=!1;r.doorGhost.renderOrder=4;r.scene.add(r.doorGhost);r.handlesG=new fe;r.scene.add(r.handlesG);r.venueG=new fe;r.scene.add(r.venueG);r.fillG=new fe;r.scene.add(r.fillG);r.fillOpen=!1;r.fG={carpet:new se(1,1,1).translate(0,.5,0),cyl:new mn(.5,.5,1,20).translate(0,.5,0)};r.fG.chair=hr([new se(1.4,.15,1.4).translate(0,1.5,0),new se(1.4,1.4,.12).translate(0,2.2,-.64)]);r.vcol=(i,t)=>{const e=new Yt(t),n=i.attributes.position.count,s=new Float32Array(n*3);for(let o=0;o<n;o++)s[o*3]=e.r,s[o*3+1]=e.g,s[o*3+2]=e.b;return i.setAttribute("color",new on(s,3)),i},r.nI=i=>i.index?i.toNonIndexed():i;r.fG.chairHi=hr([r.vcol(r.nI(new se(1.4,.18,1.3).translate(0,1.5,.08)),4872294),r.vcol(r.nI(new se(1.36,1.25,.14).rotateX(-.08).translate(0,2.25,-.62)),4872294),r.vcol(r.nI(new se(1.42,.06,.06).translate(0,2.9,-.66)),13225686),...[[-.62,.55],[.62,.55],[-.62,-.62],[.62,-.62]].map(([i,t])=>r.vcol(r.nI(new se(.07,1.42,.07).translate(i,.71,t)),13225686)),...[-.62,.62].map(i=>r.vcol(r.nI(new se(.05,.05,1.15).translate(i,.35,-.03)),13225686))]);r.fG.roundHi=hr([r.vcol(r.nI(new Bo([[0,1],[.5,1],[.505,.985],[.52,.02],[.52,0],[0,0]].map(([i,t])=>new ht(i,t)),32)),16184559),r.vcol(r.nI(new mn(.48,.48,.004,32).translate(0,1.002,0)),16777215)]);r.FILL_HI_MAX=3e3;r.fillHiLast=null;r.fM={chairV:new ve({vertexColors:!0}),roundV:new ve({vertexColors:!0}),stageSkirt:new ve({color:1382429}),carpet:new ve({color:16777215}),panel:new ve({color:14212579}),table:new ve({color:15921128}),chair:new ve({color:4872294}),stage:new ve({color:2830138})},r.BOOTH_COL={i:4026288,c:3120783,p:13208110,s:11554938},r.ZONE_COL={reg:2941126,fnb:16757575,stage:11832575,lounge:8377195,buffet:16757575,av:7317759};r.fillKey="";r.ghostG=new fe;r.scene.add(r.ghostG);r.colBoxGeo=new se(1,1,1).translate(0,.5,0),r.colCylGeo=new mn(.5,.5,1,16).translate(0,.5,0),r.boxPadGeo=new Fn(1,1).rotateX(-Math.PI/2),r.colMat=new ve({color:10134445}),r.boxPadMat=new Oe({color:16762941}),r.COL_H=9;r.venueKey="";r.wallsG=new fe;r.scene.add(r.wallsG);r.doorsG=new fe;r.scene.add(r.doorsG);r.dockMat=new Oe({color:15901498}),r.lintelMat=new Oe({color:9067036}),r.svcMat=new Oe({color:8359846}),r.doorEndMat=new Oe({color:16765503});r.doorDrag=null,r.ghostAt=null;r.doorMat=new Oe({color:15328472,transparent:!0,opacity:.85}),r.doorSelMat=new Oe({color:r.HL}),r.unitBox=new se(1,1,1),r.wallMat=new ve({color:14275786}),r.wallSelMat=new ve({color:r.HL}),r.fenceMat=new ve({color:16052198}),r.WALL_H=1.5,r.wallOkMat=new ve({color:2278750}),r.wallBadMat=new ve({color:15680580}),r.midMat=new Oe({color:r.AC}),r.midGeo=new se(.5,.2,1.5);r.fx=null;r.fxMat=new Qu({size:.9,vertexColors:!0,transparent:!0,depthWrite:!1}),r.FX_COLORS=[nt.colors.action,nt.colors.accent,"#ffffff",nt.colors.highlight].map(i=>new Yt(i)),r.reducedMotion=()=>{try{return matchMedia("(prefers-reduced-motion: reduce)").matches}catch{return!1}};r.burst=function(t,e,n=110){if(r.endFx(),r.reducedMotion())return;const s=new Float32Array(n*3),o=new Float32Array(n*3),a=new Float32Array(n*3);for(let h=0;h<n;h++){const u=Math.random()*Math.PI*2,f=.3+Math.random()*.7,d=r.FX_COLORS[h%4];s.set([t,2,e],h*3),a.set([Math.cos(u)*f*13,10+Math.random()*10,Math.sin(u)*f*13],h*3),o.set([d.r,d.g,d.b],h*3)}const l=new Te;l.setAttribute("position",new on(s,3)),l.setAttribute("color",new on(o,3));const c=new Ev(l,r.fxMat);c.frustumCulled=!1,r.scene.add(c),r.fx={pts:c,vel:a,t:performance.now(),last:performance.now()},r.fxMat.opacity=1,r.frame()};r.stepFx=function(){const t=performance.now(),e=(t-r.fx.t)/1e3,n=Math.min(.05,(t-r.fx.last)/1e3);if(r.fx.last=t,e>1.5)return r.endFx();const s=r.fx.pts.geometry.attributes.position,o=r.fx.vel;for(let a=0;a<s.count;a++)o[a*3+1]-=26*n,s.array[a*3]+=o[a*3]*n,s.array[a*3+1]=Math.max(.05,s.array[a*3+1]+o[a*3+1]*n),s.array[a*3+2]+=o[a*3+2]*n;s.needsUpdate=!0,r.fxMat.opacity=Math.max(0,1-e/1.5)};r.endFx=function(){r.fx&&(r.scene.remove(r.fx.pts),r.fx.pts.geometry.dispose(),r.fx=null)};r.celebrate=i=>{if(!i||!i.closed)return;const t=Pn([i]);r.burst((t.minX+t.maxX)/2,(t.minZ+t.maxZ)/2),r.tone(660,990,.18,.08)},r.rubber=new zt(r.unitBox,new Oe({color:r.HL,transparent:!0,opacity:.7}));r.rubber.visible=!1;r.scene.add(r.rubber);r.ghostWallMat=new Oe({color:r.AC,transparent:!0,opacity:.35,depthWrite:!1}),r.closeGhosts=[0,1].map(()=>{const i=new zt(r.unitBox,r.ghostWallMat);return i.visible=!1,r.scene.add(i),i}),r.guideMat=new r_({color:r.AC,dashSize:.8,gapSize:.5}),r.guides=[0,1].map(()=>{const i=new Te;i.setAttribute("position",new re(new Float32Array(6),3));const t=new gc(i,r.guideMat);return t.visible=!1,t.frustumCulled=!1,r.scene.add(t),t}),r.itemsG=new fe;r.scene.add(r.itemsG);r.selMark=new zt(new Fn(1,1).rotateX(-Math.PI/2),new Oe({color:2278750,transparent:!0,opacity:.45,depthWrite:!1}));r.selMark.visible=!1;r.selMark.renderOrder=2;r.scene.add(r.selMark);r.selRectGeo=r.selMark.geometry,r.selCircGeo=new zo(.5,40).rotateX(-Math.PI/2),r.hlItem=new zt(new Fn(1,1).rotateX(-Math.PI/2),new Oe({color:r.AC,transparent:!0,opacity:.35,depthWrite:!1}));r.hlItem.visible=!1;r.scene.add(r.hlItem);r.hlSeg=new zt(new se(1,1,.12),new Oe({color:r.AC,transparent:!0,opacity:.55,depthWrite:!1}));r.hlSeg.visible=!1;r.scene.add(r.hlSeg);r.ENV_COL={indoor:{a:9081763,b:8160662,bg:ne(nt.colors.bg),gr:858664},outdoor:{a:6265418,b:5672003,bg:1058874,gr:1320474}};r.applyEnv=function(){const t=r.ENV_COL[r.S.env];r.scene.background=new Yt(t.bg),r.ground.material.color.set(t.gr),r.rebuild()};new pe;new Yt;const io={minDist:6,maxDist:2400,minPitch:.35,maxPitch:1.45},YS={yaw:Math.PI/4,pitch:.95,dist:46,tx:0,tz:0},jS=8,Su=12,Dn=i=>typeof i=="number"&&Number.isFinite(i),yu=(i,t,e)=>Math.max(t,Math.min(e,i));function df(i){return Dn(i)?(i=i%(2*Math.PI),i>Math.PI&&(i-=2*Math.PI),i<-Math.PI&&(i+=2*Math.PI),i):0}function ei(i,t=YS){for(const e of["yaw","pitch","dist","tx","tz"])Dn(i[e])||(i[e]=t[e]);return i.dist=yu(i.dist,io.minDist,io.maxDist),i.pitch=yu(i.pitch,io.minPitch,io.maxPitch),i.yaw=df(i.yaw),i}const KS=(i,t)=>({d:Math.hypot(i.x-t.x,i.y-t.y),ang:Math.atan2(t.y-i.y,t.x-i.x),mx:(i.x+t.x)/2,my:(i.y+t.y)/2}),ZS=(i,t)=>{if(!i||!t)return[0,0];const e=t.mx-i.mx,n=t.my-i.my;return[Dn(e)?e:0,Dn(n)?n:0]},JS=1.5695;function QS(i,t,e){if(!t||!e)return ei(i);Dn(t.d)&&Dn(e.d)&&t.d>=Su&&e.d>=Su&&(i.dist*=t.d/e.d);const n=df(e.ang-t.ang);return Dn(n)&&(i.yaw-=n),ei(i)}function ty(i,t,e){return Dn(t)&&(i.yaw-=t*.008),Dn(e)&&(i.pitch+=e*.006),ei(i)}function ey(i,t){return Dn(t)&&t>0&&(i.dist*=t),ei(i)}const ny=(i,t,e,n)=>Math.hypot(e-i,n-t)>=jS,iy=(i,t)=>!(i.booth||i.wallHost)||!!t;r.dirty=!1;r.rebuildSoon=()=>{r.dirty=!0,r.frame()};r.rebuild=function(){r.rebuildNow(),r.frame()};r.placeBar=(i,t,e,n,s,o,a)=>{const l=Math.hypot(n-t,s-e);i.scale.set(l+a,o,a),i.position.set((t+n)/2,o/2,(e+s)/2),i.rotation.y=Math.atan2(-(s-e),n-t)};r.rebuildNow=function(){const t=r.ENV_COL[r.S.env];r.setFloorColors(t.a,t.b),r.drawVenue(),r.drawGhost(),r.lvlUI(),r.drawFill();for(const n of[...r.floorG.children])r.floorG.remove(n),n.geometry.dispose();const e=ur(r.S.walls);for(const n of e.polys){const s=new Zs(n.map(([l,c])=>new ht(l,-c))),o=new Eo(s).rotateX(-Math.PI/2),a=new zt(o,r.floorMat);a.position.y=-.006,r.floorG.add(a)}for(const n of e.rects){const s=new Zs([new ht(n.x0,-n.z0),new ht(n.x1,-n.z0),new ht(n.x1,-n.z1),new ht(n.x0,-n.z1)]),o=new zt(new Eo(s).rotateX(-Math.PI/2),r.floorMat);o.position.y=-.008,r.floorG.add(o)}r.doorsG.clear();for(const n of Vo(r.S.walls)){const s=r.selDoor&&r.selDoor.pi===n.pi&&r.selDoor.k===n.k,o=new zt(r.unitBox,s?r.doorSelMat:n.dock?r.dockMat:n.svc?r.svcMat:r.doorMat),a=n.w/2-(n.dock?0:.04);if(r.placeBar(o,n.x-n.ux*a,n.z-n.uz*a,n.x+n.ux*a,n.z+n.uz*a,n.dock?.05:.02,an+(n.dock?.6:.25)),o.name=n.dock?"dockDoor":n.svc?"svcDoor":"door",r.doorsG.add(o),n.dock){const l=new zt(r.unitBox,r.lintelMat);r.placeBar(l,n.x-n.ux*a,n.z-n.uz*a,n.x+n.ux*a,n.z+n.uz*a,.6,an+.1),l.position.y=r.wallHt()-.6,l.name="dockLintel",r.doorsG.add(l)}if(s&&r.phase==="build"&&r.tool==="door")for(const l of[-1,1]){const c=new zt(r.dotGeo,r.doorEndMat);c.scale.set(1.5,3,1.5),c.position.set(n.x+n.ux*l*n.w/2,.3,n.z+n.uz*l*n.w/2),c.name="doorEnd",c.userData.doorEnd={pi:n.pi,k:n.k,end:l},r.doorsG.add(c)}}r.doorGhost.visible=!1,r.wallsG.clear();for(const n of Tc(r.S.walls)){const s=r.selSeg&&r.selSeg.pi===n.pi&&r.selSeg.i===n.i,o=new zt(r.unitBox,r.editPi===n.pi?r.editGood?r.wallOkMat:r.wallBadMat:s?r.wallSelMat:r.S.env==="outdoor"?r.fenceMat:r.wallMat);r.placeBar(o,n.a[0],n.a[1],n.b[0],n.b[1],r.wallHt(),r.S.env==="outdoor"?.18:an),o.userData.seg={pi:n.pi,i:n.i},r.wallsG.add(o)}r.handlesG.clear(),r.phase==="build"&&r.tool!=="view"&&r.S.walls.forEach((n,s)=>n.pts.forEach(([o,a],l)=>{const c=new zt(r.dotGeo,s===r.active&&l===0&&!n.closed?r.dotStartMat:r.dotMat);c.position.set(o,r.wallHt()+.15,a),c.userData.corner={pi:s,j:l},r.handlesG.add(c)})),r.phase==="build"&&r.tool!=="view"&&r.S.walls.forEach((n,s)=>{if(s===r.active)return;const o=n.closed?n.pts.length:n.pts.length-1;for(let a=0;a<o;a++){const l=n.pts[a],c=n.pts[(a+1)%n.pts.length];if(Math.hypot(c[0]-l[0],c[1]-l[1])<2)continue;const h=new zt(r.midGeo,r.midMat);h.position.set((l[0]+c[0])/2,r.wallHt()+.15,(l[1]+c[1])/2),h.rotation.y=Math.atan2(c[0]-l[0],c[1]-l[1]),h.userData.mid={pi:s,i:a},r.handlesG.add(h)}}),r.$("#sizeLbl").textContent=wc(r.S.walls),r.syncItems(),r.buildUI()};r.meshes=new Map,r.anim=new Map,r.fpGeoRect=new Fn(1,1).rotateX(-Math.PI/2),r.fpGeoCirc=new zo(.5,40).rotateX(-Math.PI/2),r.lineGeo=i=>new Te().setFromPoints(i.map(([t,e])=>new L(t,0,e))),r.fpLineRect=r.lineGeo([[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]]),r.fpLineCirc=r.lineGeo([...Array(48)].map((i,t)=>[.5*Math.cos(t*Math.PI/24),.5*Math.sin(t*Math.PI/24)])),r.fpFill=new Oe({color:r.AC,transparent:!0,opacity:.25,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2}),r.fpEdge=new Is({color:r.AC,transparent:!0,opacity:.7}),r.FP_SHARED={fpGeoRect:r.fpGeoRect,fpGeoCirc:r.fpGeoCirc,fpLineRect:r.fpLineRect,fpLineCirc:r.fpLineCirc,fpFill:r.fpFill,fpEdge:r.fpEdge};r.makeFp=function(t,e){if(e.mode==="wall")return;const n=Jt(e),{w:s,d:o}=Vi(e),a=!!n.round,l=new fe;l.userData.fp=1,l.userData.noHit=1;const c=new zt(a?r.fpGeoCirc:r.fpGeoRect,r.fpFill),h=new bv(a?r.fpLineCirc:r.fpLineRect,r.fpEdge);for(const u of[c,h])u.userData.sharedGeo=1,u.userData.noHit=1,u.userData.uid=e.uid,u.renderOrder=1,u.raycast=()=>{},l.add(u);return l.scale.set(s,1,o),r.fpG.add(l),l};r.fpG=new fe;r.scene.add(r.fpG);r.wallGhostMat=new ve({color:14275786,transparent:!0,opacity:.28,depthWrite:!1});r.syncItems=function(){const t=new Set(r.S.items.map(e=>e.uid));for(const[e,n]of r.meshes)t.has(e)||(r.itemsG.remove(n.g),Vl(n.g),n.fp&&r.fpG.remove(n.fp),r.meshes.delete(e));for(const e of r.anim.keys())t.has(e)||r.anim.delete(e);for(const e of r.S.items){const n=Jt(e),s=e.type==="ledposter"?LS(r.S.items,e):e.type==="stage"?R2(r.S.items,e):null,o=(e.mode==="wall"?"wall":"floor")+(s?(s.joinL?"L":"")+(s.joinR?"R":"")+(s.joinF?"F":"")+(s.joinB?"B":""):"");let a=r.meshes.get(e.uid);if(!a||a.k!==o){a&&(r.itemsG.remove(a.g),Vl(a.g),a.fp&&r.fpG.remove(a.fp));const h=u_(n,e.mode,s||{});if(h.traverse(u=>u.userData.uid=e.uid),e.mode==="wall"&&!e.host){const u=n.panel+.6,f=new zt(new se(n.w+1,e.y+u,.06),r.wallGhostMat);f.position.set(0,(u-e.y)/2,-n.wallD/2-.05),f.userData.uid=e.uid,f.userData.ghost=1,h.add(f)}a={g:h,k:o,fp:r.makeFp(h,e)},r.meshes.set(e.uid,a),r.itemsG.add(h)}a.fp&&(a.fp.visible=e.uid!==r.selUid,a.fp.position.set(e.x,(e.mode==="top"?e.y:0)+.025,e.z),a.fp.rotation.y=e.a);const l=r.anim.get(e.uid);let c=0;if(l){const h=(performance.now()-l)/380;h>=1?r.anim.delete(e.uid):c=Math.abs(Math.sin(h*Math.PI*2))*(1-h)*.6}a.g.position.set(e.x,e.y+c,e.z),a.g.rotation.y=e.a}r.selUI()};r.selUI=function(){const t=r.selItem();if(!t){r.selMark.visible=!1;return}const{w:e,d:n}=Vi(t),s=ti(r.W,t);r.selMark.visible=t.mode!=="wall"||!s,r.selMark.scale.set(e+.1,1,n+.1),r.selMark.rotation.y=t.a,r.selMark.position.set(t.x,(t.mode==="top"?t.y:(t.mode,0))+.03,t.z),r.selMark.geometry=Jt(t).round?r.selCircGeo:r.selRectGeo,r.selMark.material.color.set(r.drag?s?2278750:15680580:s?r.HL:15680580),r.selMark.material.opacity=r.drag?.45:.4,r.selMark.userData.state=r.drag?s?"ok":"bad":s?"sel":"bad",r.$("#selInfo").textContent=`${of(Jt(t))}${s?"":" · Not a valid spot"}`};r.showHl=function(t){if(r.hlItem.visible=r.hlSeg.visible=!1,!(!t||!t.hl)){if(t.hl.item){const e=r.S.items.find(s=>s.uid===t.hl.item);if(!e)return;const n=Jt(e);r.hlItem.visible=!0,r.hlItem.scale.set(n.w+.3,1,n.d+.3),r.hlItem.rotation.y=e.a,r.hlItem.position.set(e.x,(n.top||0)+.02,e.z)}if(t.hl.seg){const e=t.hl.seg,n=Math.hypot(e.x2-e.x1,e.z2-e.z1);r.hlSeg.visible=!0;const s=t.mode==="wall"?8:2;r.hlSeg.scale.set(n,s,1),r.hlSeg.position.set((e.x1+e.x2)/2+e.nx*.05,s/2,(e.z1+e.z2)/2+e.nz*.05),r.hlSeg.rotation.y=Math.atan2(e.nx,e.nz)}}};r.V={yaw:Math.PI/4,pitch:.95,dist:46,tx:0,tz:0};r.resetView=function(){const t=Pn(r.S.walls)||yc(ur(r.S.walls));Object.assign(r.V,{yaw:Math.PI/4,pitch:.95}),r.V.tx=(t.minX+t.maxX)/2,r.V.tz=(t.minZ+t.maxZ)/2,r.V.dist=Math.max(24,Math.max(t.w,t.l)*1.9),ei(r.V)};r.placeCam=function(){ei(r.V);const t=r.topDown?JS:r.V.pitch,e=Math.cos(t);r.camera.position.set(r.V.tx+r.V.dist*e*Math.sin(r.V.yaw),r.V.dist*Math.sin(t),r.V.tz+r.V.dist*e*Math.cos(r.V.yaw)),r.camera.lookAt(r.V.tx,0,r.V.tz),r.camera.updateMatrixWorld()};r.resize=function(){const t=Math.round(innerWidth),e=Math.round(innerHeight);t>0&&e>0&&(r.R.setPixelRatio(Math.min(devicePixelRatio||1,2)),r.R.setSize(t,e,!1),r.camera.aspect=t/e,r.camera.updateProjectionMatrix())};r.crashed=!1,r.ctxLost=!1;r.crash=function(t,e){t&&r.noteErr(t),r.DBG.crashes++,r.crashed=!0,r.saveNow(),r.$("#crash").classList.remove("hidden"),r.$("#crash b").textContent=e||"Something went wrong",r.$("#crash p").textContent=e?"Your layout is saved.":"Your layout is saved. Tap to reload the view.",r.$("#btnRecover").classList.toggle("hidden",!!e)};r.recover=function(){try{r.crashed=!1,r.$("#crash").classList.add("hidden"),r.ptrs.clear(),r.tapInfo=r.twoPrev=r.orbitPtr=r.drag=r.down=null,r.anim.clear(),r.endFx();for(const[,t]of r.meshes)r.itemsG.remove(t.g),Vl(t.g);r.fpG.clear(),r.meshes.clear(),ei(r.V),r.resize(),r.applyEnv(),r.select(r.selItem()),r.frame()}catch(t){r.noteErr(t),r.saveNow(),location.reload()}};r.$("#btnRecover").onclick=r.recover;r.cv.addEventListener("webglcontextlost",i=>{i.preventDefault(),r.DBG.lost++,r.ctxLost=!0,r.noteErr("WebGL context lost"),r.crash(null,"Restoring the 3D view…")});r.cv.addEventListener("webglcontextrestored",()=>{r.DBG.restored++,r.ctxLost=!1,r.recover()});r.raf=0;r.frame=function(){r.raf||r.crashed||r.ctxLost||(r.raf=requestAnimationFrame(()=>{r.raf=0;try{r.dirty&&(r.dirty=!1,r.rebuildNow()),r.anim.size&&(r.syncItems(),r.frame()),r.fx&&(r.stepFx(),r.fx&&r.frame()),r.sim&&!r.sim.paused&&(r.simTick(),r.frame()),ei(r.V),r.placeCam(),r.overlays(),r.R.render(r.scene,r.camera)}catch(t){r.crash(t)}}))};r.lbls=[],r.lblV=new L;r.label=function(t,e,n,s,o){let a=r.lbls[t];if(a||(a=document.createElement("div"),r.$("#labels").appendChild(a),r.lbls[t]=a),r.lblV.set(e,r.wallHt()+.5,n).project(r.camera),r.lblV.z>1){a.style.display="none";return}a.style.display="",a.className="lbl "+(o||""),a.textContent=s,a.style.transform=`translate(${(r.lblV.x+1)/2*innerWidth}px, ${(1-r.lblV.y)/2*innerHeight}px) translate(-50%,${o==="seg"?"-150%":"-50%"})`};r.overlays=function(){const t=r.V.dist>=160,e=r.V.dist>=600;r.grid1.visible=!t,r.grid10.visible=t&&!e,r.grid100.visible=e;const n=Math.max(.5,r.V.dist*.017);r.handlesG.children.forEach(a=>a.scale.set(n,1,n)),r.cursorDot.scale.set(n,1,n);let s=0;const o=xi(r.V.dist);if(r.$("#snapHint").textContent=r.phase==="build"?`Snap: ${o} ft`:`Move snap: ${pd(r.V.dist)} ft`,r.phase==="build"){const a=er(r.S.walls);if(a.length<=60)for(const d of a)r.corner&&d.pi===r.corner.pi||r.push&&d.pi===r.push.pi||r.label(s++,(d.a[0]+d.b[0])/2,(d.a[1]+d.b[1])/2,fo(Math.hypot(d.b[0]-d.a[0],d.b[1]-d.a[1])),r.tool!=="view"?"seg":"");const l=r.tool==="walls"&&r.active!=null&&bc(r.S.walls[r.active]);r.closeGhosts.forEach((d,p)=>{const x=l&&l.ghost[p],v=l&&l.ghost[p+1];d.visible=!!(x&&v),d.visible&&r.placeBar(d,x[0],x[1],v[0],v[1],r.wallHt(),an)});const c=r.rub&&r.rub.guides||[];r.guides.forEach((d,p)=>{const x=c[p];if(d.visible=!!x,x){const v=d.geometry.attributes.position;v.setXYZ(0,x[0][0],r.wallHt()+.2,x[0][1]),v.setXYZ(1,x[1][0],r.wallHt()+.2,x[1][1]),v.needsUpdate=!0,d.computeLineDistances()}}),r.cursorDot.material.color.set(r.rub&&(r.rub.aligned||r.rub.close)?r.AC:r.HL);const h=r.corner?r.corner.pi:r.push?r.push.pi:r.pendEdit?r.editPi:null,u=h!=null&&r.S.walls[h];if(u&&u.closed&&!r.boxA){const d=Pn([u]),p=Math.round(hd(u.pts));r.label(s++,(d.minX+d.maxX)/2,(d.minZ+d.maxZ)/2,($l(u)?`${d.w} x ${d.l} ft · `:"")+`${p} sq ft`,r.editGood?"live":"live bad")}if(u&&(r.corner||r.push))for(const d of er([u]))r.label(s++,(d.a[0]+d.b[0])/2,(d.a[1]+d.b[1])/2,fo(Math.hypot(d.b[0]-d.a[0],d.b[1]-d.a[1])),r.editGood?"live":"live bad");if(r.boxA&&r.S.walls[r.boxIdx]&&r.S.walls[r.boxIdx].closed){const d=Pn([r.S.walls[r.boxIdx]]);r.label(s++,(d.minX+d.maxX)/2,(d.minZ+d.maxZ)/2,`${d.w} x ${d.l} ft · ${Math.round(d.w*d.l)} sq ft`,r.editGood?"live":"live bad")}const f=r.active!=null&&r.S.walls[r.active];if(f&&r.rub&&f.pts.length){const[d,p]=f.pts[f.pts.length-1];r.rubber.visible=!0,r.placeBar(r.rubber,d,p,r.rub.x,r.rub.z,r.wallHt(),an),r.label(s++,(d+r.rub.x)/2,(p+r.rub.z)/2,fo(Math.hypot(r.rub.x-d,r.rub.z-p))+(r.rub.close?" · close room":""),"live")}else r.rubber.visible=!1}else r.rubber.visible=!1,r.closeGhosts.forEach(a=>a.visible=!1),r.guides.forEach(a=>a.visible=!1);for(let a=s;a<r.lbls.length;a++)r.lbls[a].style.display="none"};addEventListener("resize",()=>{r.resize(),r.frame()});addEventListener("orientationchange",()=>setTimeout(()=>{r.resize(),r.frame()},300));window.visualViewport&&visualViewport.addEventListener("resize",()=>{r.resize(),r.frame()});r.selUid=null;r.selItem=()=>r.S.items.find(i=>i.uid===r.selUid)||null;r.select=function(t){r.selUid=t?t.uid:null,t&&r.$("#presetTip")&&r.$("#presetTip").classList.add("hidden"),r.$("#selBar").classList.toggle("hidden",!t),t&&(r.$("#selName").textContent=Jt(t).name),r.$("#btnSplit").classList.toggle("hidden",!(t&&t.type==="ledposter"&&(t.links||[]).length)),t&&t.type==="ledposter"&&Lo(r.S.items,t).length>1&&(r.$("#selName").textContent=`LED poster wall (${Lo(r.S.items,t).length} wide)`),r.showHl(null),r.syncItems(),r.frame()};r.dropped=function(t,e){ti(r.W,t)?(r.anim.set(t.uid,performance.now()),t.host||["wall","wallfloor"].includes(t.mode)?r.sSnap():r.sDrop()):(r.sBad(),e&&(Rn(r.W,t,e),r.toast("That spot does not fit"))),r.showHl(null),r.save(),r.syncItems(),r.frame()};r.poseOf=i=>({x:i.x,z:i.z,a:i.a,y:i.y,host:i.host,mode:i.mode});r.$("#btnRot").onclick=()=>{const i=r.selItem();if(!i)return;(i.type==="ledposter"||i.type==="stage")&&Nc(r.S.items,i);const t=r.poseOf(i),e=i.a+Math.PI/2,n={...i,a:e};let s=xr(r.W,n,i.x,i.z);["edge","wall","wallfloor","backwall"].includes(s.mode)&&(s={...gr(n,i.x,i.z,e)}),Rn(r.W,i,s),r.dropped(i,ti(r.W,i)?null:t)};r.$("#btnCopy").onclick=()=>{const i=r.selItem();if(!i)return;const t=sr(i.type,i.x,i.z,i.a);r.S.items.push(t);const e=Oc(r.W,t,i.x+Jt(i).w+.5,i.z)||gr(t,i.x+1,i.z+1);Rn(r.W,t,e),r.select(t),r.dropped(t,null)};r.$("#btnDel").onclick=()=>{const i=r.selItem();if(!i)return;const t=US(r.W,i);r.select(null),r.toast(t>1?`Removed ${t} items`:"Removed"),r.save(),r.syncItems(),r.frame()};r.$("#btnDone").onclick=()=>r.select(null);r.moveGroup=function(t){if(!(!r.drag||!r.drag.grp))for(const e of r.drag.grp){const[n,s]=Nn(t.x,t.z,t.a,e.l[0],e.l[1]);e.o.x=n,e.o.z=s,e.o.a=t.a+e.da,e.o.y=0}};r.separatePoster=function(t=r.selItem()){return!t||t.type!=="ledposter"||!(t.links||[]).length?!1:(Nc(r.S.items,t),r.toast("Separated from the poster wall · drag it away"),r.save(),r.select(t),!0)};r.$("#btnSplit").onclick=()=>r.separatePoster();r.openSheet=function(){r.$("#sheet").classList.remove("hidden","presetsheet"),r.showCats()};r.closeSheet=function(){r.$("#sheet").classList.add("hidden"),r.$("#sheet").classList.remove("presetsheet")};r.showCats=function(){r.$("#shBack").classList.add("hidden"),r.$("#shTitle").textContent="Add to your space",r.$("#shBody").innerHTML='<div class="evrow"><b>Event presets</b>'+r.techRowHTML()+"<div>"+kc.map(t=>`<button class="evchip" data-ev="${t.id}">${r.EV_ICONS[t.id]}<span>${t.name}</span></button>`).join("")+'</div></div><div class="catgrid">'+rf.map(t=>`<button class="cat" data-cat="${t.id}">${g_[t.id]}<span>${t.name}</span></button>`).join("")+"</div>",r.$$(".cat").forEach(t=>t.onclick=()=>r.showProducts(t.dataset.cat)),r.bindTechRow(),r.$$(".evchip").forEach(t=>t.onclick=()=>r.useEventPreset(t.dataset.ev))};r.showProducts=function(t){r.$("#shBack").classList.remove("hidden"),r.$("#shTitle").textContent=rf.find(e=>e.id===t).name,r.$("#shBody").innerHTML=Dc.filter(e=>e.cat===t).map(e=>`<button class="prod" data-id="${e.id}"><i class="picon">${m_(e)}</i><div><b>${e.name}</b><span>${of(e)}</span>${e.note?`<small class="pnote">${e.note}</small>`:""}</div><span class="plus">+</span></button>`).join(""),r.$$(".prod").forEach(e=>e.onclick=()=>r.addItem(e.dataset.id))};r.$("#btnAdd").onclick=r.openSheet;r.$("#shClose").onclick=r.closeSheet;r.$("#shBack").onclick=r.showCats;r.viewCenter=function(){return r.placeCam(),r.ray.setFromCamera(new ht(0,.1),r.camera),r.ray.ray.intersectPlane(r.groundPlane,r.hitP)?[r.hitP.x,r.hitP.z]:[r.V.tx,r.V.tz]};r.addItem=function(t){const[e,n]=r.viewCenter(),s=sr(t,e,n);r.S.items.push(s);const o=Oc(r.W,s,e,n,30);Rn(r.W,s,o||gr(s,e,n)),r.closeSheet(),r.setMode("move"),r.select(s),r.dropped(s,null),o||r.toast("No free spot found. Drag it to a clear area."),r.$("#keepPlacing").checked&&(r.startStamp(s),r.toast(`Keep placing: tap the floor to add more ${Jt(s).name}`))};r.ray=new h_,r.ndc=new ht,r.groundPlane=new Xn(new L(0,1,0),0),r.hitP=new L;r.setRay=function(t,e){const n=r.cv.getBoundingClientRect();r.ndc.set((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1),r.placeCam(),r.ray.setFromCamera(r.ndc,r.camera)};r.groundAt=function(t,e){return r.setRay(t,e),r.ray.ray.intersectPlane(r.groundPlane,r.hitP)?[r.hitP.x,r.hitP.z]:null};r.itemAt=function(t,e){r.setRay(t,e);const n=r.ray.intersectObjects(r.itemsG.children,!0).filter(l=>!l.object.userData.ghost&&!l.object.userData.noHit);if(!n.length)return null;const s=[...new Set(n.filter(l=>!l.object.userData.noHit).map(l=>l.object.userData.uid))].map(l=>r.S.items.find(c=>c.uid===l)).filter(Boolean),o=s.filter(l=>!Jt(l).booth);if(!o.length)return s[0]||null;const a=o[0];return o.filter(l=>Wi(r.S.items,a).includes(l))[0]||a};r.ptrs=new Map;r.editBefore=null,r.panPtr=null,r.tapInfo=null,r.twoPrev=null,r.orbitPtr=null,r.drag=null,r.down=null,r.needSave=!1,r.corner=null,r.draw=null;r.panBy=function(t,e){const n=r.V.dist*.728/Math.max(1,innerHeight),s=Math.cos(r.V.yaw),o=-Math.sin(r.V.yaw),a=-Math.sin(r.V.yaw),l=-Math.cos(r.V.yaw);r.V.tx+=(-s*t+a*e)*n,r.V.tz+=(-o*t+l*e)*n,ei(r.V)};r.itemMode=()=>r.phase==="place"||r.tool==="view",r.drawAt=(i,t)=>{const e=r.groundAt(i,t);return e?C_(r.S.walls,r.active,e[0],e[1],xi(r.V.dist),r.lock):null};r.handleAt=function(t,e){r.setRay(t,e);const n=r.ray.intersectObjects(r.handlesG.children,!1)[0];if(n)return n.object.userData.corner?{corner:n.object.userData.corner}:{mid:n.object.userData.mid};const s=r.cv.getBoundingClientRect(),o=(h,u,f)=>(r.lblV.set(h,u,f).project(r.camera),Math.hypot(s.left+(r.lblV.x+1)/2*s.width-t,s.top+(1-r.lblV.y)/2*s.height-e));let a=null,l=40;for(const h of r.handlesG.children){let u=Math.min(o(h.position.x,h.position.y,h.position.z),o(h.position.x,0,h.position.z));h.userData.mid&&(u+=6),u<l&&(l=u,a=h.userData)}if(a)return a.corner?{corner:a.corner}:{mid:a.mid};const c=r.ray.intersectObjects(r.wallsG.children,!1)[0];return c?{seg:c.object.userData.seg}:{}};r.addPt=function(t){if(!t||t.idle&&r.active!=null)return;if(r.lock.axis=null,t.close&&r.active!=null){const n=r.active;return r.active=md(r.S.walls,r.active),r.celebrate(r.S.walls[n]&&r.S.walls[n].closed?r.S.walls[n]:r.S.walls[r.S.walls.length-1]),r.rub=null,r.sSnap(),r.toast("Room closed"),r.wallsChanged(),r.setTool("view")}const e=r.active;r.active=M_(r.S.walls,r.active,t),t.close?(r.sSnap(),r.toast("Room closed")):r.sTile(!0),e==null&&r.active!=null&&r.S.walls[r.active].pts.length,r.rub=null,r.wallsChanged()};r.tapBuild=function(t,e,n){if(r.tool==="door")return r.tapDoor(t,e);if(n.corner){const{pi:a,j:l}=n.corner,c=r.S.walls[a];if(a===r.active&&l===0&&c.pts.length>=3)return r.addPt({x:c.pts[0][0],z:c.pts[0][1],close:!0});if(r.active==null&&!c.closed&&(l===0||l===c.pts.length-1))return l===0&&N_(c),r.active=a,r.selSeg=null,r.toast("Continue drawing from here"),r.sTile(!0),r.rebuildSoon()}if(n.mid){r.toast("Drag the arrow to push or pull this wall");return}if(n.seg&&r.active==null)return r.selSeg=r.selSeg&&r.selSeg.pi===n.seg.pi&&r.selSeg.i===n.seg.i?null:n.seg,r.buildUI(),r.rebuildSoon();if(r.selSeg=null,r.tool==="door")return r.tapDoor(t,e);if(r.tool==="box"){r.toast("Drag from one corner to the opposite corner");return}const s=r.active!=null&&bc(r.S.walls[r.active]),o=r.groundAt(t,e);if(s&&o&&r.nearGhost(s.ghost,o,Math.max(2,xi(r.V.dist)))){r.$("#btnCloseWalls").click();return}r.addPt(r.drawAt(t,e))};r.wallPlane=new Xn(new L(0,1,0),0),r.wallHitP=new L;r.wallPointAt=function(t,e){r.setRay(t,e);const n=r.ray.intersectObjects(r.wallsG.children,!1)[0];if(n)return[n.point.x,n.point.z];r.wallPlane.constant=-Math.max(.5,r.wallHt()/2);const s=r.ray.ray.intersectPlane(r.wallPlane,r.wallHitP)?[r.wallHitP.x,r.wallHitP.z]:null,o=r.groundAt(t,e);return s&&(!o||(Ao(r.S.walls,s[0],s[1])||{dist:1e9}).dist<=(Ao(r.S.walls,o[0],o[1])||{dist:1e9}).dist)?s:o};r.tapDoor=function(t,e){const n=r.wallPointAt(t,e);if(!n)return;const s=I_(r.S.walls,n[0],n[1],1.2);if(s)return r.selDoor=r.selDoor&&r.selDoor.pi===s.pi&&r.selDoor.k===s.k?null:{pi:s.pi,k:s.k},r.selSeg=null,r.buildUI(),r.sTile(!0),r.rebuildSoon();r.selDoor=null;const o=Ao(r.S.walls,n[0],n[1]);if(!o||o.dist>Math.max(1.5,xi(r.V.dist)*.5))return r.buildUI(),r.rebuildSoon(),r.toast(r.S.walls.length?"Tap on a wall to add a door":"Draw walls first, then add doors");const a=xd(r.S.walls,o.pi,o.i,o.t,.5);if(a.error)return r.sBad(),r.toast(a.error);const l=r.S.walls[o.pi],c=vd(l,o.i).some(([h,u])=>u-h>ke+.01&&a.door.t>=h&&a.door.t<=u);r.sSnap(),r.toast(c?"Double door (6 ft)":"Door added (3 ft) · tap it, then drag its ends to resize"),r.wallsChanged()};r.doorSpot=function(t,e){const n=r.wallPointAt(t,e);if(!n)return null;const s=Ao(r.S.walls,n[0],n[1]);if(!s||s.dist>Math.max(1.5,xi(r.V.dist)*.5))return{g:n,n:null};const o=r.S.walls[s.pi],a=o.pts[s.i],l=o.pts[(s.i+1)%o.pts.length],c=Math.hypot(l[0]-a[0],l[1]-a[1]),h=(l[0]-a[0])/c,u=(l[1]-a[1])/c,f=an/2+ke/2,d=Math.min(c-f,Math.max(f,Math.round(s.t*2)/2));return{g:n,n:s,x:a[0]+h*d,z:a[1]+u*d,ux:h,uz:u,t:d,wx:a[0]+h*s.t,wz:a[1]+u*s.t}};r.hoverDoor=function(t,e){const n=r.doorSpot(t,e);if(r.cursorDot.visible=!1,!n||!n.n){r.doorGhost.visible=!1,r.ghostAt=n?{...n,on:!1}:null,r.frame();return}r.doorGhost.position.set(n.x,0,n.z),r.doorGhost.rotation.y=Math.atan2(n.ux,n.uz)+Math.PI/2,r.doorGhost.scale.set(ke,Math.max(.3,r.wallHt()*.9),an+.35),r.doorGhost.visible=!0,r.ghostAt={...n,on:!0,cx:t,cy:e},r.frame()};r.doorEndAt=function(t,e){if(!r.selDoor||r.tool!=="door")return null;const n=r.cv.getBoundingClientRect(),s=new L;let o=null,a=30;for(const l of r.doorsG.children){if(!l.userData.doorEnd)continue;s.copy(l.position).project(r.camera);const c=Math.hypot(n.left+(s.x+1)/2*n.width-t,n.top+(1-s.y)/2*n.height-e);c<a&&(a=c,o=l.userData.doorEnd)}return o};r.nearGhost=function(t,e,n){for(let s=0;s<t.length-1;s++){const[o,a]=t[s],[l,c]=t[s+1],h=(l-o)**2+(c-a)**2;let u=h?((e[0]-o)*(l-o)+(e[1]-a)*(c-a))/h:0;if(u=Math.max(0,Math.min(1,u)),Math.hypot(e[0]-o-u*(l-o),e[1]-a-u*(c-a))<=n)return!0}return!1};r.twoNow=()=>{const[i,t]=[...r.ptrs.values()];return KS(i,t)},r.endDrag=i=>{if(!r.drag)return;const t=r.selItem();if(t&&r.drag.grp&&r.drag.grp.length){const e=()=>{Rn(r.W,t,r.drag.start);for(const n of r.drag.grp)Rn(r.W,n.o,n.start)};i?e():r.drag.moved&&([t,...r.drag.grp.map(n=>n.o)].every(n=>ti(r.W,n))?(r.drag.join&&(ic(t,r.S.items.find(n=>n.uid===r.drag.join)),t.type==="stage"&&gu(r.S.items,t)),r.anim.set(t.uid,performance.now()),r.sDrop(),r.save()):(r.sBad(),e(),r.toast("That spot does not fit")))}else t&&(i?Rn(r.W,t,r.drag.start):r.drag.moved&&(r.drag.join&&ti(r.W,t)&&(ic(t,r.S.items.find(e=>e.uid===r.drag.join)),t.type==="stage"&&gu(r.S.items,t)),r.dropped(t,r.drag.start)));r.drag=null,r.showHl(null),r.syncItems(),r.frame()},r.guard=i=>t=>{try{i(t)}catch(e){r.crash(e)}};r.cv.addEventListener("contextmenu",i=>i.preventDefault());r.cv.addEventListener("pointerdown",r.guard(i=>{try{r.cv.setPointerCapture(i.pointerId)}catch{}if(r.ptrs.set(i.pointerId,{x:i.clientX,y:i.clientY}),r.$("#hint").style.opacity=0,i.pointerType==="mouse"&&i.button===2){r.panPtr={x:i.clientX,y:i.clientY};return}if(i.pointerType==="mouse"&&i.button===1){r.orbitPtr={x:i.clientX,y:i.clientY};return}if(r.ptrs.size>=2){r.tapInfo=null,r.down=null,(r.corner||r.push)&&(r.editBefore&&(r.putBack(r.editBefore),r.editBefore=null),r.corner=r.push=null,r.editPi=null,r.editGood=!0,r.rebuildSoon()),r.boxA&&(r.S.walls.splice(r.boxIdx,1),r.boxA=r.boxIdx=null,r.editPi=null,r.editGood=!0,r.rebuildSoon()),r.draw&&(r.draw=null,r.rub=null),r.endDrag(!1),r.orbitPtr=null,r.twoPrev=r.twoNow(),r.cursorDot.visible=!1,r.frame();return}i.pointerType==="mouse"&&i.button!==0||(r.pendEdit&&r.commitEdit(),r.down={de:r.phase==="build"?r.doorEndAt(i.clientX,i.clientY):null,x0:i.clientX,y0:i.clientY,started:!1,item:r.itemMode()?r.itemAt(i.clientX,i.clientY):null,hb:r.itemMode()?null:r.handleAt(i.clientX,i.clientY)})}));r.cv.addEventListener("pointermove",r.guard(i=>{if(!r.ptrs.has(i.pointerId)){if(i.pointerType==="mouse"&&r.phase==="build"&&r.tool==="door"){r.hoverDoor(i.clientX,i.clientY);return}if(i.pointerType==="mouse"&&r.phase==="build"&&r.tool!=="view"){const t=r.drawAt(i.clientX,i.clientY);t&&(r.cursorDot.position.set(t.x,r.wallHt()+.15,t.z),r.cursorDot.visible=!0,r.rub=r.active!=null?t:null,r.frame())}return}if(r.ptrs.set(i.pointerId,{x:i.clientX,y:i.clientY}),r.twoPrev&&r.ptrs.size>=2){const t=r.twoNow(),[e,n]=ZS(r.twoPrev,t);QS(r.V,r.twoPrev,t),r.panBy(e,n),r.twoPrev=t,r.frame();return}if(r.panPtr){r.panBy(i.clientX-r.panPtr.x,i.clientY-r.panPtr.y),r.panPtr.x=i.clientX,r.panPtr.y=i.clientY,r.frame();return}if(r.orbitPtr){ty(r.V,i.clientX-r.orbitPtr.x,i.clientY-r.orbitPtr.y),r.orbitPtr.x=i.clientX,r.orbitPtr.y=i.clientY,r.frame();return}if(r.down&&!r.down.started){if(!ny(r.down.x0,r.down.y0,i.clientX,i.clientY))return;r.down.started=!0;const t=r.down.item;if(r.itemMode())if(t&&iy(Jt(t),r.selUid===t.uid)){r.select(t);const e=r.groundAt(r.down.x0,r.down.y0)||[t.x,t.z];r.drag={off:[t.x-e[0],t.z-e[1]],start:r.poseOf(t),moved:!0,grp:Lo(r.S.items,t).filter(n=>n!==t).map(n=>({o:n,l:On(t.x,t.z,t.a,n.x,n.z),da:n.a-t.a,start:r.poseOf(n)}))}}else r.topDown||r.panMode?r.panPtr={x:i.clientX,y:i.clientY}:r.orbitPtr={x:i.clientX,y:i.clientY};else{const e=r.down.hb||{};if(r.down.de)r.doorDrag={...r.down.de,before:JSON.stringify(r.S.walls[r.down.de.pi].doors)},r.doorGhost.visible=!1;else if(e.mid&&r.S.walls[e.mid.pi]){const n=r.groundAt(r.down.x0,r.down.y0);n&&(r.editBefore=r.beginEdit(),r.push={...e.mid,n:_d(r.S.walls[e.mid.pi],e.mid.i),g0:n,base:JSON.stringify(r.S.walls[e.mid.pi]),last:0,carry:HS(r.S.walls,e.mid.pi,e.mid.i,r.S.items).map(s=>({uid:s.uid,x:s.x,z:s.z}))},r.editPi=e.mid.pi,r.editGood=!0,r.selSeg=null,r.selDoor=null)}else if(e.corner&&!(e.corner.pi===r.active&&e.corner.j===r.S.walls[r.active].pts.length-1))r.editBefore=r.beginEdit(),r.corner=e.corner,r.selSeg=null,r.editPi=r.corner.pi,r.editGood=!0;else if(r.tool==="door")r.topDown||r.panMode?r.panPtr={x:i.clientX,y:i.clientY}:r.orbitPtr={x:i.clientX,y:i.clientY};else if(r.tool==="box"){const n=r.groundAt(r.down.x0,r.down.y0);n&&(r.editBefore=r.beginEdit(),r.S.preset&&(r.S.walls=[]),r.boxA=n,r.active=null,r.S.walls.push({pts:[],closed:!1}),r.boxIdx=r.S.walls.length-1,r.editPi=r.boxIdx,r.editGood=!1)}else r.draw=!0,r.active==null&&r.addPt(r.drawAt(r.down.x0,r.down.y0))}}if(r.drag){const t=r.selItem(),e=r.groundAt(i.clientX,i.clientY);if(!t||!e)return;const n=xr(r.W,t,e[0]+r.drag.off[0],e[1]+r.drag.off[1],pd(r.V.dist)),s=t.host||t.mode;Rn(r.W,t,n),r.moveGroup(t),r.drag.join=n.join||null,r.showHl(n),((n.host||n.mode)!==s||n.join)&&n.hl&&r.drag.lastJoin!==n.join&&r.sSnap(),r.drag.lastJoin=n.join,r.syncItems(),r.frame();return}if(r.doorDrag){const t=r.groundAt(i.clientX,i.clientY),e=Vo(r.S.walls).find(o=>o.pi===r.doorDrag.pi&&o.k===r.doorDrag.k);if(!t||!e)return;const n=e.t+(t[0]-e.x)*e.ux+(t[1]-e.z)*e.uz,s=D_(r.S.walls,r.doorDrag.pi,r.doorDrag.k,r.doorDrag.end,n,.5);s&&s.w!==r.doorDrag.w&&(r.doorDrag.w=s.w,r.toast(`Door ${fo(s.w)} wide`)),r.S.preset=null,r.rebuildSoon();return}if(r.boxA){const t=r.groundAt(i.clientX,i.clientY);if(!t)return;const e=T_(r.boxA,t,xi(r.V.dist));r.S.walls[r.boxIdx]=e||{pts:[],closed:!1},r.S.preset=null,r.editGood=!!e&&Oa(r.S.walls,r.boxIdx),r.rebuildSoon();return}if(r.corner){const t=r.groundAt(i.clientX,i.clientY);if(!t)return;const e=xi(r.V.dist),n=r.S.walls[r.corner.pi];if(!n)return;U_(n,r.corner.j,Math.round(t[0]/e)*e,Math.round(t[1]/e)*e),r.S.preset=null,r.editGood=Oa(r.S.walls,r.corner.pi),r.rebuildSoon();return}if(r.push){const t=r.groundAt(i.clientX,i.clientY);if(!t)return;const e=xi(r.V.dist),n=Math.round(((t[0]-r.push.g0[0])*r.push.n[0]+(t[1]-r.push.g0[1])*r.push.n[1])/e)*e,s=JSON.parse(r.push.base);if(ou(s,r.push.i,n))r.S.walls[r.push.pi]=s,r.push.last=n,r.editGood=Oa(r.S.walls,r.push.pi);else{const o=JSON.parse(r.push.base);ou(o,r.push.i,r.push.last),r.S.walls[r.push.pi]=o,r.editGood=!1}for(const o of r.push.carry){const a=r.S.items.find(l=>l.uid===o.uid);a&&(a.x=o.x+r.push.n[0]*r.push.last,a.z=o.z+r.push.n[1]*r.push.last)}r.S.preset=null,r.syncItems(),r.rebuildSoon();return}if(r.draw){const t=r.drawAt(i.clientX,i.clientY);if(t){const e=!!(t.aligned||t.close);e&&!r.wasAligned&&r.sSnap(),r.wasAligned=e,r.rub=t,r.cursorDot.position.set(t.x,r.wallHt()+.15,t.z),r.cursorDot.visible=!0,r.frame()}return}}));r.onUp=r.guard(i=>{r.ptrs.delete(i.pointerId),r.ptrs.size<2&&(r.twoPrev=null);const t=i.pointerType!=="mouse";if(!r.ptrs.size){if(r.down&&!r.down.started&&(r.phase==="place"&&(r.stamp||r.picker)?r.down.item?(r.startStamp(r.down.item),r.toast("Same again: "+Jt(r.down.item).name)):r.stamp?r.stampAt(r.down.x0,r.down.y0):r.toast("Tap a placed item to copy it"):r.itemMode()?r.select(r.down.item||null):r.tapBuild(r.down.x0,r.down.y0,r.down.hb||{})),r.draw&&(r.rub&&r.addPt(r.rub),r.draw=null,r.rub=null,r.cursorDot.visible=!1),r.corner&&(r.corner=null,r.selDoor=null,r.sTile(!0),r.finishEdit(r.editBefore,t),r.editBefore=null),r.doorDrag){const e=JSON.stringify(r.S.walls[r.doorDrag.pi].doors)!==r.doorDrag.before;r.doorDrag=null,e&&(r.sSnap(),r.wallsChanged())}if(r.push){const e=r.push.last!==0||!r.editGood;r.push=null,e?(r.sTile(!0),r.finishEdit(r.editBefore,t,r.editGood?"Wall moved":"")):(r.editPi=null,r.editGood=!0,r.rebuildSoon()),r.editBefore=null}if(r.boxA){const e=r.boxIdx,n=r.S.walls[r.boxIdx]&&r.S.walls[r.boxIdx].closed;n||r.S.walls.splice(r.boxIdx,1),r.boxA=null,r.boxIdx=null,n?(r.editGood&&(r.sSnap(),r.celebrate(r.S.walls[e])),r.finishEdit(r.editBefore,t,"Room made"),r.setTool("view")):(r.editPi=null,r.editGood=!0,r.wallsChanged()),r.editBefore=null}r.down=null,r.orbitPtr=null,r.panPtr=null,r.tapInfo=null,r.endDrag(!1),r.needSave&&(r.needSave=!1,r.save())}});r.cv.addEventListener("pointerup",r.onUp);r.cv.addEventListener("pointercancel",r.guard(i=>{r.ptrs.delete(i.pointerId),r.ptrs.size<2&&(r.twoPrev=null),r.ptrs.size||(r.endDrag(!0),(r.corner||r.push)&&r.editBefore&&r.putBack(r.editBefore),r.editBefore=null,r.editPi=null,r.editGood=!0,r.orbitPtr=r.panPtr=r.tapInfo=r.down=r.corner=r.push=r.draw=r.rub=null,r.boxA&&(r.S.walls.splice(r.boxIdx,1),r.boxA=r.boxIdx=null),r.rebuildSoon(),r.needSave&&(r.needSave=!1,r.save()))}));r.cv.addEventListener("pointerleave",i=>{i.pointerType==="mouse"&&!r.ptrs.size&&(r.cursorDot.visible=!1,r.doorGhost.visible=!1,r.frame())});r.cv.addEventListener("wheel",i=>{i.preventDefault(),ey(r.V,i.deltaY>0?1.1:.9),r.frame()},{passive:!1});r.verTaps=[];r.$("#verBuild").addEventListener("pointerdown",()=>{const i=performance.now();if(r.verTaps=r.verTaps.filter(t=>i-t<700).concat(i),r.verTaps.length>=3){r.verTaps=[];const t=r.$("#dbg");t.classList.toggle("hidden"),t.classList.contains("hidden")||r.dbgUI()}});r.dbgUI=function(){const t=r.R.info;r.$("#dbg").textContent=`Event Space Planner v3.39 debug
${navigator.userAgent}
screen ${innerWidth}x${innerHeight} dpr ${devicePixelRatio} (render ${r.R.getPixelRatio()})
phase ${r.phase} items ${r.S.items.length} walls ${er(r.S.walls).length} drawing ${r.active}
view ${JSON.stringify(r.V)}
GPU geometries ${t.memory.geometries} textures ${t.memory.textures} draw calls ${t.render.calls}
context lost ${r.DBG.lost} restored ${r.DBG.restored} crashes ${r.DBG.crashes}
last error: ${r.DBG.err||"none"}`};addEventListener("keydown",i=>{if(!r.$("#build").classList.contains("on"))return;const t=i.key.toLowerCase();(i.ctrlKey||i.metaKey)&&(t==="y"||t==="z"&&i.shiftKey)?(i.preventDefault(),r.redo()):(i.ctrlKey||i.metaKey)&&t==="z"?(i.preventDefault(),r.undo()):t==="r"&&r.selItem()?r.$("#btnRot").click():(t==="delete"||t==="backspace")&&r.selItem()?r.$("#btnDel").click():t==="t"&&!i.ctrlKey&&!i.metaKey?r.setTop(!r.topDown):t==="escape"&&r.pendEdit?r.cancelEdit():t==="escape"&&(r.stamp||r.picker)?r.endStamp():t==="escape"&&r.phase==="build"&&r.tool!=="view"?r.setTool("view"):t==="escape"&&(r.select(null),r.closeSheet())});addEventListener("pagehide",r.saveNow);r.ghostMat=new Is({color:9418976,transparent:!0,opacity:.35,depthWrite:!1});r.isEmpty=function(t){return!t||!t.walls.length&&!t.items.length&&!t.fill};r.moveToLevel=function(t){r.sim&&r.simStop();const e={walls:r.S.walls,items:r.S.items,venue:r.S.venue,fill:r.S.fill};r.isEmpty(e)?delete r.S.levels[r.S.lvl]:r.S.levels[r.S.lvl]=e;const n=r.S.levels[t]||{walls:[],items:[],venue:null};delete r.S.levels[t],r.S.lvl=t,r.S.walls=n.walls,r.S.items=n.items,r.S.venue=n.venue||null,r.S.fill=n.fill||null,r.S.preset=null,r.active=null,r.selSeg=null,r.rub=null,typeof r.select=="function"&&r.select(null)};r.switchLevel=function(t){const e=r.S.lvl+t;e<Do||e>Uo||(r.moveToLevel(e),r.syncItems(),r.renderPresets(),r.save(),r.rebuild(),r.toast(r.lvlName()))};r.lvlName=function(){const t=r.S.venue;return`Level ${r.S.lvl}`+(t&&t.lvlName&&t.lvlName!==`Level ${r.S.lvl}`?` · ${t.lvlName}`:"")+(t&&t.lvlGuess?" (estimated)":"")};r.usedLevels=function(){const t=new Set(Object.keys(r.S.levels).map(Number));return r.isEmpty(r.S)||t.add(r.S.lvl),[...t].sort((e,n)=>e-n)};r.lvlUI=function(){const t=r.$("#lvlTxt");if(!t)return;const e=r.S.venue,n=e&&e.lvlName&&e.lvlName!==`Level ${r.S.lvl}`?e.lvlName:"",s=r.usedLevels();t.textContent=`Level ${r.S.lvl}`,r.$("#lvlSub").textContent=[n,e&&e.lvlGuess?"(estimated)":"",!e&&s.length>1?`${s.length} floors: ${s.join(", ")}`:""].filter(Boolean).join(" "),r.$("#lvlBar").title=r.lvlName()+(s.length>1?` · floors used: ${s.join(", ")}`:""),r.$("#lvlUp").disabled=r.S.lvl>=Uo,r.$("#lvlDown").disabled=r.S.lvl<=Do};r.drawGhost=function(){for(const o of[...r.ghostG.children])r.ghostG.remove(o),o.geometry.dispose();const t=r.S.levels[r.S.lvl-1];if(r.isEmpty(t))return;const e=[];for(const o of t.walls){const a=o.pts.length;for(let l=0;l<(o.closed?a:a-1);l++){const c=o.pts[l],h=o.pts[(l+1)%a];e.push(c[0],.03,c[1],h[0],.03,h[1])}}for(const o of t.items){if(o.mode==="top"||o.mode==="wall")continue;const{w:a,d:l}=Vi(o),c=Math.cos(o.a||0),h=Math.sin(o.a||0),u=[[-a/2,-l/2],[a/2,-l/2],[a/2,l/2],[-a/2,l/2]].map(([f,d])=>[o.x+f*c+d*h,o.z-f*h+d*c]);for(let f=0;f<4;f++){const d=u[f],p=u[(f+1)%4];e.push(d[0],.03,d[1],p[0],.03,p[1])}}if(!e.length)return;const n=new Te;n.setAttribute("position",new re(e,3));const s=new xc(n,r.ghostMat);s.name="ghostBelow",s.renderOrder=-1,r.ghostG.add(s)};r.$("#lvlUp").onclick=()=>r.switchLevel(1);r.$(".lvlmid").onclick=()=>r.toast(r.lvlName());r.$("#lvlDown").onclick=()=>r.switchLevel(-1);r.clearKind=function(){const t=document.querySelector("#clearPick input[name=clearK]:checked");return t?t.value:"items"};r.clearUI=function(){const t=r.clearKind(),e=r.$("#clearGo");e.textContent=t==="build"?"Clear build":"Clear items",e.classList.toggle("dangerbtn",t==="build"),e.classList.toggle("primary",t!=="build")};r.openClear=function(){const t=document.querySelector("#clearPick input[value=items]");t&&(t.checked=!0),r.clearUI(),r.$("#clearPick").classList.remove("hidden")};r.closeClear=function(){r.$("#clearPick").classList.add("hidden")};r.clearRoom=function(t){r.sim&&r.simStop(),typeof r.endStamp=="function"&&(r.stamp||r.picker)&&r.endStamp(),r.select(null),r.selDoor=null,r.selSeg=null,r.active=null,r.rub=null,t==="build"?(r.S.walls=[],r.S.items=[],r.S.venue=null,r.S.fill=null,r.S.preset=null):(r.S.items=[],r.S.fill=null),r.closeClear(),r.syncItems(),r.renderPresets(),r.buildUI(),r.save(),r.rebuild(),r.toast(t==="build"?"Build cleared · Undo to bring it back":"Items cleared · Undo to bring them back")};r.$("#btnClear").onclick=()=>r.$("#clearPick").classList.contains("hidden")?r.openClear():r.closeClear();r.$$("#clearPick input[name=clearK]").forEach(i=>i.onchange=r.clearUI);r.$("#clearCancel").onclick=r.closeClear;r.$("#clearGo").onclick=()=>r.clearRoom(r.clearKind());const Ue=.3048;function sy(){let i;try{i=new URLSearchParams(location.search)}catch{i=new URLSearchParams}const t=parseFloat(i.get("fw")||""),e=parseFloat(i.get("fd")||"");return{on:i.get("embed")==="1",room:i.get("room")||"",fw:t>1?t:30,fd:e>1?e:40,title:i.get("title")||"Room",from:i.get("from")||"dev"}}function ry(i){return"zdash.interior.layout.v1:"+i.room}function oy(){const i=fd(r.S.walls).map(function(s){return{kind:"wall",name:"Wall",x:s.x*Ue,z:s.z*Ue,a:s.a,w:s.w*Ue,d:s.d*Ue}}),t=[];(r.S.items||[]).forEach(function(s){const o=Vi(s),a=Jt(s);if(!o||!a)return;const l=(s.y||0)*Ue,c=(a.h||0)*Ue;l+c<.35||l>1.7||t.push({kind:"item",name:a.name||s.type,x:s.x*Ue,z:s.z*Ue,a:s.a||0,w:o.w*Ue,d:o.d*Ue})});const e=ur(r.S.walls),n=yc(e);return{walls:i,items:t,floor:{minX:n.minX*Ue,maxX:n.maxX*Ue,minZ:n.minZ*Ue,maxZ:n.maxZ*Ue,polys:e.polys.map(function(s){return s.map(function(o){return[o[0]*Ue,o[1]*Ue]})}),rects:e.rects.map(function(s){return{x0:s.x0*Ue,z0:s.z0*Ue,x1:s.x1*Ue,z1:s.z1*Ue}})},title:r.EMBED.title}}function Za(i){let t=null,e="";try{e=Fc(r.S),t=oy()}catch{}try{parent.postMessage({type:i,room:r.EMBED.room,from:r.EMBED.from,layout:e,solids:t,title:r.EMBED.title},"*")}catch{}}function ay(){const i=sy();if(!i.on||!i.room)return;r.EMBED=i;const t=ry(i);r.loadSaved=function(){try{return hf(localStorage.getItem(t))}catch{return null}};const e=r.saveNow;r.saveNow=function(){try{localStorage.setItem(t,Fc(r.S))}catch{}Za("zd-interior-save"),typeof e=="function"&&r.saveNow};const n=r.loadSaved();n&&(n.walls&&n.walls.length||n.items&&n.items.length)?(r.S.env=n.env||"indoor",r.S.walls=n.walls||[],r.S.items=n.items||[],r.S.venue=n.venue||null,r.S.fill=n.fill||null,r.S.lvl=n.lvl||1,r.S.levels=n.levels||{},r.S.tech=n.tech||r.S.tech,r.S.preset=null,r.setPhase("place")):(r.S.env="indoor",r.S.walls=[Ho(i.fw,i.fd)],r.S.items=[],r.S.preset=null,r.S.venue=null,r.S.fill=null,r.setPhase("build")),r.applyEnv(),r.select(null),r.resetView(),r.histReset(),r.showScreen("build");const s=r.$("#btnHome");s&&(s.onclick=function(){r.saveNow(),Za("zd-interior-exit")});const o=r.$("header.bar");if(o&&!r.$("#btnExitStreet")){const a=document.createElement("button");a.id="btnExitStreet",a.type="button",a.textContent="Exit to street",a.setAttribute("aria-label","Exit to street"),a.onclick=function(){r.saveNow(),Za("zd-interior-exit")},o.appendChild(a)}document.body&&(document.body.dataset.ready="1"),r.renderPresets(),r.rebuildSoon()}_f();typeof r.drawVenue!="function"&&(r.drawVenue=function(){});typeof r.drawFill!="function"&&(r.drawFill=function(){});r.saved0=r.loadSaved();r.saved0&&r.setMute(r.saved0.mute);r.startUI();r.renderPresets();r.applyEnv();r.resetView();r.setPhase("build");r.histReset();r.viewUI();r.stampUI();ay();
