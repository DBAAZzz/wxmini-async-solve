!function(n,o){"object"==typeof exports&&"undefined"!=typeof module?o(exports):"function"==typeof define&&define.amd?define(["exports"],o):o((n="undefined"!=typeof globalThis?globalThis:n||self).WxminiAsyncSolve={})}(this,function(n){"use strict";let s=new class{constructor(){this.subs={}}$on(n,o){this.subs[n]||(this.subs[n]=[]),this.subs[n].push(o)}$emit(n,...o){this.subs[n]&&this.subs[n].forEach(n=>{n(...o)})}$off(n,o){let e=this.subs[n];n=e.indexOf(o);-1!==n&&e.splice(n,1)}$once(o,e){let t=(...n)=>{e(...n),this.$off(o,t)};this.$on(o,t)}};var r={},a={},i={};const c=["onLaunch","onShow","onHide","onThemeChange"],f=["onLoad","onShow","onReady","onHide","onUnload"],l=["created","attached","ready","moved","detached"],u={onLoad:null,onShow:function(){console.log("我是统一拦截注入的 onShow 方法")}};function d(n,o){let e="",t="";return n.forEach(n=>{0===o.indexOf(n)&&(e=o.slice(n.length),t=n)}),[e,t]}function p(e){new Promise((n,o)=>{a[e]="pending",i[e]=n})}function h(n,o){const e=this[n];e&&"function"==typeof e&&(this[n]=function(){return o&&o.call(this,...arguments),e.call(this,...arguments)})}function m(e,t,i,n){r.hasOwnProperty(g(t))&&h.call(e,n,function(...n){let o={};o[t]={},e._dataPromise=o,e._dataPromise[t].promise=new Promise((n,o)=>{e._dataPromise[t].proRes=n}),"fulfilled"===a[t]?(console.log("执行了哈哈哈"),e._dataPromise[t].proRes()):s.$on(t,n=>{e._dataPromise[t].proRes(n)}),e._dataPromise[t].promise.then(()=>{e[i].call(this,...n)})})}function g(n){return n.trim().toLowerCase().replace(n[0],n[0].toUpperCase())}n.appFns=c,n.componenetFns=l,n.init=function(){const i=App,s=Page,r=Component;App=function(n){for(var o in n){var[e,t]=d(c,o);e&&m(n,e,o,t)}i(n)},Page=function(o){for(var n in f.forEach(n=>{h.call(o,n,u[n]||null)}),o){var[e,t]=d(f,n);e&&m(o,e,n,t)}s(o)},Component=function(n){for(var o in console.log("options",n),n){var[e,t]=d(l,o);e&&m(n,e,o,t)}r(n)}},n.injectLifeCycleFns=u,n.pageFns=f,n.proxyData=function(n){for(var o in n)p(g(o));return r=new Proxy(n,{get:(n,o)=>o in n?n[o]:void 0,set:(n,o,e)=>{var t=g(o);return i[t]&&("pending"===a[t]?(i[t](e),s.$emit(t,e)):(p(t),i[t](e)),a[t]="fulfilled"),n[o]=e,!0}})},Object.defineProperty(n,"__esModule",{value:!0})});