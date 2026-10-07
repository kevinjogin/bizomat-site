const $=s=>document.querySelector(s);const money=n=>new Intl.NumberFormat(undefined,{style:'currency',currency:'AUD',maximumFractionDigits:0}).format(isFinite(n)?n:0);const num=(n,d=1)=>new Intl.NumberFormat(undefined,{maximumFractionDigits:d}).format(isFinite(n)?n:0);const pct=n=>`${num(n,1)}%`;const val=k=>Number(document.querySelector(`[name="${k}"]`)?.value||0);const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function band(score,good=70,warn=45){return score>=good?'good':score>=warn?'warn':'bad'}
function status(score,good='STRONG',warn='WATCH',bad='WEAK'){return {text:score>=70?good:score>=45?warn:bad,tone:band(score)}}
function m(label,value){return {label,value}}
function result(text,tone,summary,metrics=[],recommendation=''){return {text,tone,summary,metrics,recommendation}}
function calc(id){for(const fn of (window.GOCORE_CALC_PARTS||[])){const r=fn(id);if(r)return r}return result('READY','good','Enter your assumptions to see the result.',[],'');}