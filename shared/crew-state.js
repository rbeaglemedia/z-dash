/* CREW STATE — who is on foot, which preview gait, and Ellie's camera dances.
   Pet choice and pet meshes stay in zdash.pet.v1 (crew-data). This file only stores the toggle and the clips.
   Human: localStorage zdash.customdance.v1, BroadcastChannel zdash-customdance.
   Dog mo-cap: localStorage zdash.petdance.v1, BroadcastChannel zdash-petdance. */
(function(){'use strict';
const KEY='zdash.crew.v1', DANCE='zdash.customdance.v1', PETDANCE='zdash.petdance.v1';
function readSaved(){
  try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&s.v===1)return s;}catch(e){}
  return null;
}
function readWho(){
  const s=readSaved();
  if(s&&(s.who==='girl'||s.who==='boy'))return s.who;
  try{
    const c=JSON.parse(localStorage.getItem('zdash.char.v1')||'null');
    if(c&&c.gender==='male')return 'boy';
  }catch(e){}
  return 'girl';
}
function normOpt(v){return v==='slot0'||v==='slot1'||v==='slot2'?v:'default';}
const saved=readSaved();
const S={who:readWho(),gait:'idle',dancing:false,charDanceOpt:normOpt(saved&&saved.charDanceOpt),petDanceOpt:normOpt(saved&&saved.petDanceOpt)};
function save(){
  let prev={};
  try{prev=JSON.parse(localStorage.getItem(KEY)||'null')||{};}catch(e){}
  try{localStorage.setItem(KEY,JSON.stringify({v:1,who:S.who,charDanceOpt:S.charDanceOpt||'default',petDanceOpt:S.petDanceOpt||'default',charDanceSeen:prev.charDanceSeen||'',petDanceSeen:prev.petDanceSeen||''}));}catch(e){}
}
function parseClip(text, fallbackDur, fallbackName){
  try{
    const o=JSON.parse(text||'null');
    if(!o||o.version!==1||o.enabled===false||!o.slots||!o.slots.length)return null;
    const i=o.activeSlot|0, sl=o.slots[i]||o.slots[0];
    if(!sl||!sl.frames||!sl.frames.length)return null;
    return {name:sl.name||fallbackName,bpm:sl.bpm||120,duration:sl.duration>0?sl.duration:fallbackDur,frames:sl.frames};
  }catch(e){return null;}
}
function loadClip(key, cache){
  let text='';
  try{text=localStorage.getItem(key)||'';}catch(e){}
  if(text!==cache.raw){cache.raw=text;cache.slot=parseClip(text, cache.dur, cache.name);}
  return cache.slot;
}
const danceCache={raw:null,slot:null,dur:8,name:'CUSTOM'};
const petCache={raw:null,slot:null,dur:6,name:'MY DOG'};
function dance(){return loadClip(DANCE, danceCache);}
function petDance(){return loadClip(PETDANCE, petCache);}
function sampleFrames(sl, tSec, fields){
  if(!sl)return null;
  const dur=sl.duration||8, u=((tSec%dur)+dur)%dur/dur, f=sl.frames.slice().sort((a,b)=>(+a.t||0)-(+b.t||0));
  if(f.length===1){
    const one={u,duration:dur,name:sl.name,spin:f[0].spin?1:0};
    for(const k of fields) one[k]=+f[0][k]||0;
    return one;
  }
  let i=0;for(;i<f.length;i++)if((+f[i].t||0)>u)break;
  const b=f[i%f.length], a=f[(i-1+f.length)%f.length];
  let span=(+b.t||0)-(+a.t||0);if(span<=1e-6)span+=1;
  let du=u-(+a.t||0);if(du<0)du+=1;
  const k=du/span<0?0:du/span>1?1:du/span, L=(p,q)=>(+p||0)+((+q||0)-(+p||0))*k;
  const out={u,duration:dur,name:sl.name,spin:(a.spin||b.spin)?1:0};
  for(const key of fields) out[key]=L(a[key],b[key]);
  return out;
}
function sample(tSec){return sampleFrames(dance(), tSec, ['armL','armR','legL','legR','sway','bounce']);}
function samplePet(tSec){return sampleFrames(petDance(), tSec, ['hop','wag','pawL','pawR','bow','sway']);}
function refresh(){danceCache.raw=null;petCache.raw=null;dance();petDance();}
window.addEventListener('storage',e=>{
  if(!e.key||e.key===DANCE)danceCache.raw=null;
  if(!e.key||e.key===PETDANCE)petCache.raw=null;
  if(!e.key||e.key===KEY){const s=readSaved();if(s){if(s.who==='girl'||s.who==='boy')S.who=s.who;S.charDanceOpt=normOpt(s.charDanceOpt);S.petDanceOpt=normOpt(s.petDanceOpt);}}
});
try{const ch=new BroadcastChannel('zdash-customdance');ch.onmessage=()=>{danceCache.raw=null;dance();};}catch(e){}
try{const ch=new BroadcastChannel('zdash-petdance');ch.onmessage=()=>{petCache.raw=null;petDance();};}catch(e){}
S.setWho=function(w){S.who=w==='boy'?'boy':'girl';save();};
S.setGait=function(g){S.gait=(g==='walk'||g==='run'||g==='dance')?g:'idle';S.dancing=S.gait==='dance';};
S.setCharDanceOpt=function(opt){S.charDanceOpt=normOpt(opt);save();if(window.CREW&&CREW.setCharDanceOpt)return CREW.setCharDanceOpt(opt);return S.charDanceOpt;};
S.setPetDanceOpt=function(opt){S.petDanceOpt=normOpt(opt);save();if(window.CREW&&CREW.setPetDanceOpt)return CREW.setPetDanceOpt(opt);return S.petDanceOpt;};
S.dance=dance;S.sample=sample;S.petClip=petDance;S.samplePet=samplePet;S.refresh=refresh;
window.CREWSTATE=S;window.CREW_STATE=S;
})();
