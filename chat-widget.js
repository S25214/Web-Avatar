(()=>{var vi=Object.defineProperty;var D=(e,t)=>()=>(e&&(t=e(e=0)),t);var eo=(e,t)=>{for(var o in t)vi(e,o,{get:t[o],enumerable:!0})};function Ei(){if(ht&&(ht.hasAttribute("data-bot-id")||ht.hasAttribute("data-provider")))return ht;let e=document.querySelector(".bn-customerchat[data-bot-id], .bn-customerchat[data-provider], [data-chat-widget]");if(e)return e;let t=document.querySelector("script[data-widget-id], script[data-bot-id], script[data-provider], script[data-mode]");return t||ht||null}function O(e,t,o){return tt&&tt.hasAttribute(e)?tt.getAttribute(e):bt[t]!==void 0&&bt[t]!==null?String(bt[t]):o}function oo(e,t){return!!(tt&&tt.hasAttribute(e)||bt[t]!==void 0&&bt[t]!==null)}function ki(e){if(tt&&tt.hasAttribute(e))return tt.getAttribute(e);let t=yi[e];return t&&bt[t]!==void 0&&bt[t]!==null?String(bt[t]):null}var ht,yi,tt,bt,io,Ti,no,b,H=D(()=>{ht=document.currentScript||null,yi={"data-bot-id":"botId","data-provider":"provider","data-widget-id":"widgetId","data-persist-history":"persistHistory","data-avatar-widget-src":"avatarWidgetSrc","data-avatar":"avatar","data-auto-focus-input":"autoFocusInput","data-title":"title","data-worker-url":"workerUrl","data-config-save":"configSave","data-animation-api-url":"animationApiUrl","data-mic-limit":"micLimit","data-avatar-url":"avatarUrl","data-bnv-key":"bnvKey","data-bnv-version":"bnvVersion","data-bnv-speaker":"bnvSpeaker","data-color":"color","data-mode":"mode","data-greeting-instruction":"greetingInstruction"};tt=Ei(),bt=window.ChatWidgetConfig||{};io=O("data-provider","provider",null),Ti=!!O("data-bot-id","botId",""),no=io?io==="custom"?"custom":"botnoi":Ti?"botnoi":"custom";b={currentScript:tt||ht,getAttribute:ki,PROVIDER:no,WIDGET_ID:O("data-widget-id","widgetId",""),PERSIST_HISTORY:O("data-persist-history","persistHistory","true")!=="false",AVATAR_WIDGET_SRC:O("data-avatar-widget-src","avatarWidgetSrc","https://webavatar.didthat.cc/avatar-widget.js"),AVATAR_ENABLED:O("data-avatar","avatar","true")!=="false",AUTO_FOCUS_INPUT:O("data-auto-focus-input","autoFocusInput","false")==="true",WIDGET_TITLE:O("data-title","title","Botnoi Assistant"),WORKER_URL:O("data-worker-url","workerUrl","https://botnoichatbot.didthat.workers.dev"),CONFIG_SAVE:O("data-config-save","configSave","true")!=="false",ANIMATION_API_URL:O("data-animation-api-url","animationApiUrl","https://getanim-zb2xurnl2a-as.a.run.app"),MIC_LIMIT:no==="botnoi"?10:oo("data-mic-limit","micLimit")&&parseInt(O("data-mic-limit","micLimit","0"),10)||0,THEME_COLOR:oo("data-color","color")?O("data-color","color",null):null,MODE:O("data-mode","mode","panel"),GREETING_INSTRUCTION:O("data-greeting-instruction","greetingInstruction","")}});function et(){b.PERSIST_HISTORY&&localStorage.setItem(`botnoi_history_${c.userId}`,JSON.stringify(c.chatHistory))}function Mt(){let e=document.getElementById("avatar-widget-container");!e||!c.avatarReady||(b&&b.MODE==="avatar"&&!e.classList.contains("bcw-mode-avatar")&&e.classList.add("bcw-mode-avatar"),requestAnimationFrame(function(){requestAnimationFrame(function(){e.classList.add("bcw-avatar-visible")})}))}function oe(){let e=document.getElementById("avatar-widget-container");e&&e.classList.remove("bcw-avatar-visible")}var c,x,r,F=D(()=>{H();c={isOpen:!1,initialized:!1,needsSetup:!1,lastUserInput:"",chatHistory:[],avatarReady:!1,avatarPoll:null,avatarListener:null,hwid:"",sessionCount:1,userId:"",_readyQueue:[],_domReady:!1},x={WORKER_URL:b.WORKER_URL,BOT_ID:b.getAttribute("data-bot-id")||localStorage.getItem("bcw_bot_id")||"",AVATAR_MODEL:b.getAttribute("data-avatar-url")||localStorage.getItem("bcw_avatar_url")||"Botnoi",BNV_KEY:b.getAttribute("data-bnv-key")||localStorage.getItem("bcw_bnv_key")||"",BNV_VERSION:parseInt(b.getAttribute("data-bnv-version")||localStorage.getItem("bcw_bnv_version")||"1",10),BNV_SPEAKER:b.getAttribute("data-bnv-speaker")||localStorage.getItem("bcw_bnv_speaker")||"13",ably:null,channel:null,lastJWT:null};b.PROVIDER==="custom"&&(x.AVATAR_MODEL=b.getAttribute("data-avatar-url")||"Botnoi"),b.CONFIG_SAVE||(localStorage.removeItem("bcw_bot_id"),localStorage.removeItem("bcw_bnv_key"),localStorage.removeItem("bcw_bnv_version"),localStorage.removeItem("bcw_bnv_speaker"),localStorage.removeItem("bcw_avatar_url"),x.BOT_ID=b.getAttribute("data-bot-id")||"",x.BNV_KEY=b.getAttribute("data-bnv-key")||"",x.BNV_VERSION=parseInt(b.getAttribute("data-bnv-version")||"1",10),x.BNV_SPEAKER=b.getAttribute("data-bnv-speaker")||"13",x.AVATAR_MODEL=b.getAttribute("data-avatar-url")||"Botnoi"),b.PROVIDER==="botnoi"&&(c.needsSetup=!x.BOT_ID),c.hwid=localStorage.getItem("botnoi_hwid"),c.hwid||(c.hwid=window.crypto&&window.crypto.randomUUID?crypto.randomUUID().replace(/-/g,""):Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15),localStorage.setItem("botnoi_hwid",c.hwid)),c.sessionCount=parseInt(localStorage.getItem("botnoi_session_count")||"1",10),c.userId=`WebAvatarUser_${c.hwid}_${c.sessionCount}`,b.PERSIST_HISTORY?c.chatHistory=JSON.parse(localStorage.getItem(`botnoi_history_${c.userId}`)||"[]"):c.chatHistory=[];r={fab:null,panel:null,inputEl:null,sendBtn:null,collapseBtn:null,messagesEl:null,messagesOuterEl:null,clearBtn:null,headerAvatar:null,headerTitle:null,statusDot:null,statusText:null,volumeBtn:null,volumeSlider:null,volIcon:null,muteIcon:null,micBtn:null,overlayUser:null,overlayBot:null}});var ao={};eo(ao,{_getAudioCache:()=>_i,_setAudioCache:()=>Ai,clearAudioCache:()=>Wt,fetchAndCacheAudio:()=>ke});function Te(){return ie?Promise.resolve(ie):new Promise(function(e,t){var o=indexedDB.open("bcw-audio-cache",1);o.onupgradeneeded=function(i){i.target.result.createObjectStore("audio")},o.onsuccess=function(i){ie=i.target.result,e(ie)},o.onerror=function(){t(o.error)}})}function _i(e){return Te().then(function(t){return new Promise(function(o){var i=t.transaction("audio","readonly").objectStore("audio").get(e);i.onsuccess=function(){o(i.result||null)},i.onerror=function(){o(null)}})}).catch(function(){return null})}function Ai(e,t){return Te().then(function(o){return new Promise(function(i,n){var a=o.transaction("audio","readwrite");a.objectStore("audio").put(t,e),a.oncomplete=i,a.onerror=n})}).catch(function(){})}async function ke(e){return e}function Wt(){Te().then(function(e){try{var t=e.transaction("audio","readwrite");t.objectStore("audio").clear()}catch{}}).catch(function(){})}var ie,Ut=D(()=>{ie=null});function so(){ne=function(){Bi()},c._container.addEventListener("bcw-audio-ended",ne)}function ra(){ne&&c._container&&c._container.removeEventListener("bcw-audio-ended",ne),St=[],V=[],ot=null}function lo(e){if(r.overlayUser){var t=document.createElement("div");for(t.className="bcw-floating-bubble bcw-float-user",t.textContent=e,r.overlayUser.appendChild(t),requestAnimationFrame(function(){requestAnimationFrame(function(){t.classList.add("bcw-float-in")})}),St.push(t);St.length>4;)ro(St.shift());setTimeout(function(){wt(t);var o=St.indexOf(t);o!==-1&&St.splice(o,1)},Mi)}}function _e(e,t){if(r.overlayBot){var o=t||{};ot&&(wt(ot),ot=null);var i=document.createElement("div");for(i.className="bcw-floating-bubble bcw-float-bot",i.innerHTML=e.innerHTML,r.overlayBot.appendChild(i),requestAnimationFrame(function(){requestAnimationFrame(function(){i.classList.add("bcw-float-in")})}),V.push(i);V.length>3;)ro(V.shift());if(o.hasAudio&&!o.interactive)i._bcwAudioLinked=!0,i._bcwFallbackTimer=setTimeout(function(){wt(i);var s=V.indexOf(i);s!==-1&&V.splice(s,1)},3e4);else if(!o.interactive){var n=(e.textContent||"").split(/\s+/).filter(Boolean).length,a=Math.max(Si,n*Ci);setTimeout(function(){wt(i);var s=V.indexOf(i);s!==-1&&V.splice(s,1)},a)}}}function Dt(e){if(r.overlayBot){ot&&wt(ot);var t=document.createElement("div");t.className="bcw-floating-interactive",t.appendChild(e),r.overlayBot.appendChild(t),requestAnimationFrame(function(){requestAnimationFrame(function(){t.classList.add("bcw-float-in");var o=t.querySelectorAll(".bcw-quick-reply-btn");o&&o.forEach(function(i){i.classList.add("bcw-animate-in")})})}),ot=t,t.addEventListener("click",function o(i){i.target.closest("button, a, .bcw-quick-reply-btn, .bcw-carousel-btn")&&(t.removeEventListener("click",o),setTimeout(function(){wt(t),ot===t&&(ot=null)},300))})}}function co(e){return e?e.classList.contains("bcw-quick-replies")||e.classList.contains("bcw-carousel-container")||e.classList.contains("bcw-flex-msg"):!1}function Bi(){for(var e=[],t=0;t<V.length;t++){var o=V[t];o._bcwAudioLinked?(o._bcwFallbackTimer&&clearTimeout(o._bcwFallbackTimer),wt(o)):e.push(o)}V=e}function wt(e){!e||!e.parentNode||(e.classList.remove("bcw-float-in"),e.classList.add("bcw-float-out"),setTimeout(function(){e.classList.add("bcw-float-remove"),setTimeout(function(){e.parentNode&&e.parentNode.removeChild(e)},350)},400))}function ro(e){e&&e.parentNode&&(e._bcwFallbackTimer&&clearTimeout(e._bcwFallbackTimer),e.parentNode.removeChild(e))}var St,V,ot,ne,Mi,Si,Ci,Ae=D(()=>{F();St=[],V=[],ot=null,ne=null,Mi=4e3,Si=2500,Ci=120});function Ht(){r.messagesEl.scrollTo({top:r.messagesEl.scrollHeight,behavior:"smooth"})}function N(e,t){r.statusDot.className="bcw-status-dot",e==="online"?r.statusDot.classList.add("bcw-online"):e==="offline"&&r.statusDot.classList.add("bcw-offline"),r.statusText.textContent=t}function Me(e){var t=document.createElement("div");t.className="bcw-error-msg",t.style.opacity="0",t.style.transform="translateY(8px) scale(0.96)",t.style.transition="opacity 0.3s ease, transform 0.35s cubic-bezier(.34,1.4,.64,1)",t.appendChild(document.createTextNode(e)),r.messagesEl.appendChild(t),Ht(),requestAnimationFrame(function(){requestAnimationFrame(function(){t.style.opacity="1",t.style.transform="translateY(0) scale(1)"})})}function uo(e){var t=document.createElement("div");t.className="bcw-warning-msg",t.style.opacity="0",t.style.transform="translateY(8px) scale(0.96)",t.style.transition="opacity 0.3s ease, transform 0.35s cubic-bezier(.34,1.4,.64,1)",t.appendChild(document.createTextNode(e)),r.messagesEl.appendChild(t),Ht(),requestAnimationFrame(function(){requestAnimationFrame(function(){t.style.opacity="1",t.style.transform="translateY(0) scale(1)"})}),setTimeout(function(){t.classList.add("bcw-removing"),setTimeout(function(){t.parentNode&&t.parentNode.removeChild(t)},450)},4e3)}function R(e,t){var o=document.createElement("div");return o.className="bcw-msg bcw-"+t+"-msg",o.textContent=e,o}function L(e){if(b.MODE==="avatar"){if(e.classList.contains("bcw-user-msg")){lo(e.textContent||"");return}if(e.classList.contains("bcw-bot-msg")||e.classList.contains("bcw-msg")){if(co(e))Dt(e);else{var t=e.dataset.bcwInteractive==="true";_e(e,{hasAudio:c._bcwNextBubbleHasAudio||!1,interactive:t}),c._bcwNextBubbleHasAudio=!1}return}if(e.classList.contains("bcw-carousel-container")){Dt(e);return}_e(e,{hasAudio:!1});return}var o=r.messagesEl.querySelectorAll(".bcw-quick-replies");o.forEach(function(i){i.parentNode&&i.parentNode.removeChild(i)}),r.messagesEl.appendChild(e),Ht(),requestAnimationFrame(function(){requestAnimationFrame(function(){e.classList.contains("bcw-msg")&&e.classList.add("bcw-animate-in")})})}function Ft(e,t){var o=document.createElement("div");o.className="bcw-msg bcw-"+t+"-msg";var i=document.createElement("img");i.src=e,o.appendChild(i),L(o),i.onload=function(){r.messagesEl.scrollTop=r.messagesEl.scrollHeight}}function Se(e,t,o){var i=document.createElement("div");i.className="bcw-msg bcw-"+o+"-msg",i.innerHTML='\u{1F4C4} <a href="'+e+'" target="_blank">'+(t||"Download File")+"</a>",L(i)}function Ce(e,t,o,i){var n=document.createElement("div");n.className="bcw-msg bcw-"+i+"-msg",n.innerHTML='\u{1F4CD} <a href="https://maps.google.com/?q='+t+","+o+'" target="_blank">'+(e||"View Location")+"</a>",L(n)}function Be(e,t,o){var i=document.createElement("div");i.className="bcw-msg bcw-"+o+"-msg",i.innerHTML='<video controls src="'+e+'" poster="'+(t||"")+'"></video>',L(i)}function Le(e,t){var o=document.createElement("div");o.className="bcw-msg bcw-"+t+"-msg",o.innerHTML='<audio controls src="'+e+'"></audio>',L(o)}function Ie(e){if(typeof window.flex2html!="function"){console.warn("[BotnoiChatWidget] flex2html not loaded; skipping flex message.");return}var t=document.createElement("div");t.className="bcw-flex-msg chatbox";var o="bcw-flex-"+ ++Li;if(t.id=o,b.MODE==="avatar"){t.style.position="absolute",t.style.visibility="hidden",document.body.appendChild(t),flex2html(o,{type:"flex",altText:"Flex Message",contents:e}),t.querySelectorAll("br").forEach(function(i){i.parentNode.removeChild(i)}),document.body.removeChild(t),t.style.position="",t.style.visibility="",Dt(t);return}r.messagesEl.appendChild(t),flex2html(o,{type:"flex",altText:"Flex Message",contents:e}),t.querySelectorAll("br").forEach(function(i){i.parentNode.removeChild(i)}),Ht(),requestAnimationFrame(function(){requestAnimationFrame(function(){t.classList.add("bcw-animate-in")})})}function $e(e,t){var o=document.createElement("div");o.className="bcw-carousel-container",e.forEach(function(i){var n=document.createElement("div");n.className="bcw-carousel-card";var a="";i.image_url&&(a+='<img src="'+i.image_url+'" class="bcw-carousel-img" alt="'+(i.title||"Card image")+'">'),a+='<div class="bcw-carousel-body">',i.title&&(a+='<div class="bcw-carousel-title">'+i.title+"</div>"),i.subtitle&&(a+='<div class="bcw-carousel-subtitle">'+i.subtitle+"</div>"),n.innerHTML=a;var s=n.querySelector(".bcw-carousel-body");i.buttons&&i.buttons.forEach(function(l){var d=document.createElement("button");d.className="bcw-carousel-btn",d.textContent=l.label,d.onclick=function(){l.type==="web_url"?window.open(l.data,"_blank"):l.type==="phone"?window.location.href="tel:"+l.data:(l.type==="postback"||l.type==="text")&&t(l.data,l.label)},s.appendChild(d)}),o.appendChild(n)}),L(o)}function Oe(e,t,o,i,n){var a=null;e.text&&(a=R(e.text,"bot"),a.dataset.bcwInteractive="true",b.MODE!=="avatar"?L(a):(a.className="bcw-floating-bubble bcw-float-bot",a.style.opacity="1",a.style.transform="translateY(0) scale(1)",a.style.pointerEvents="auto"));var s=document.createElement("div");if(s.className="bcw-quick-replies",e.quick_reply_choices.forEach(function(d,p){var u=document.createElement("button");u.className="bcw-quick-reply-btn",u.style.setProperty("--bcw-btn-delay",p*60+"ms"),u.textContent=d.label,u.onclick=function(){t(d.data,d.label)},s.appendChild(u)}),b.MODE==="avatar"){var l=document.createElement("div");return l.className="bcw-quick-reply-group",l.style.display="flex",l.style.flexDirection="column",l.style.alignItems="center",a&&l.appendChild(a),l.appendChild(s),Dt(l),a}return r.messagesEl.appendChild(s),Ht(),requestAnimationFrame(function(){requestAnimationFrame(function(){var d=s.querySelectorAll(".bcw-quick-reply-btn");d.forEach(function(p){p.classList.add("bcw-animate-in")})})}),a}var Li,Xt=D(()=>{F();H();Ut();Ae();Li=0});async function po(e,t){return(await fetch(`${e}/api/verify`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({botId:t})})).json()}async function bo(e,t,o,i){var n=await fetch(`${e}/api/send`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:t,botId:o,text:i})});if(n.ok)return n.json();throw new Error("Message send failed")}async function mo(e,t,o,i,n){var a="https://tts-zb2xurnl2a-as.a.run.app/tts",s=i===2?"botnoiv2":"botnoi",l=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+o},body:JSON.stringify({bot_id:t,provider:s,text:e,speaker:n,volume:1,speed:1,type_media:"wav",save_file:"true",language:"th",page:"user"})});if(l.ok)return l.json();throw new Error("TTS Failed with status "+l.status)}function fo(e){return new Promise((t,o)=>{let i=new FileReader;i.onloadend=()=>t(i.result.split(",")[1]),i.readAsDataURL(e)})}async function xo(e,t,o){var i="https://asr-zb2xurnl2a-as.a.run.app/asr",n=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+o},body:JSON.stringify({bot_id:t,audio:e,language:"th"})});if(n.ok)return n.json();throw new Error("ASR Failed with status "+n.status)}var Re=D(()=>{});async function ae(e,t){let o={animation:null,emotion:null,duration:null};if(!window.WebAvatar||typeof window.WebAvatar.loadAnimation!="function")return o;let i={"Content-Type":"application/json"};if(b.WIDGET_ID&&(i["X-Widget-ID"]=b.WIDGET_ID),x.lastJWT&&(i.Authorization="Bearer "+x.lastJWT),!b.WIDGET_ID&&!x.lastJWT)return o;try{let n=await fetch(b.ANIMATION_API_URL,{method:"POST",headers:i,body:JSON.stringify({app:"avatar",input:[{role:"user",content:e||""},{role:"bot",content:t||""}]})});if(!n.ok)return console.warn("[ChatWidget] Animation API returned",n.status),o;let a=await n.json();return a.animation&&(window.WebAvatar.loadAnimation(a.animation),console.log("[ChatWidget] Animation selected:",a.animation)),a.emotion&&(a.length?(window.WebAvatar.setEmotion(a.emotion,a.length),console.log("[ChatWidget] Emotion selected:",a.emotion,a.length)):(window.WebAvatar.setEmotion(a.emotion),console.log("[ChatWidget] Emotion selected:",a.emotion))),{animation:a.animation||null,emotion:a.emotion||null,duration:a.length||null}}catch(n){return console.warn("[ChatWidget] Animation API error:",n),o}}function Pe(e){e&&(window.WebAvatar&&typeof window.WebAvatar.loadAnimation=="function"?window.WebAvatar.loadAnimation(e):console.warn("[ChatWidget] WebAvatar not available for animation:",e))}var Ne=D(()=>{H();F()});function re(e){if(r.panel.classList.add("bcw-setup-active"),r.messagesOuterEl.style.display="none",r.panel.querySelector("#bcw-input-area").style.display="none",r.panel.querySelector("#bcw-volume-group").style.display="none",r.panel.querySelector("#bcw-clear-btn").style.display="none",!r.panel.querySelector("#bcw-setup-form")){var t=x.AVATAR_MODEL;if(t&&(t.indexOf("http://")===0||t.indexOf("https://")===0)){var o=t.split("?")[0].split("/"),i=o[o.length-1]||o[o.length-2]||t;t=i.split(".")[0]||t}var n=document.createElement("div");n.id="bcw-setup-form",n.innerHTML='<span class="bcw-setup-title">Widget Setup</span><span class="bcw-setup-desc">Enter your credentials to connect the widget.</span><label><span style="display:flex;justify-content:space-between;align-items:center">Character'+(b.getAttribute("data-avatar-url")?"":'<button id="bcw-browse-models" style="background:none;border:none;cursor:pointer;font-size:11px;opacity:0.7;text-decoration:underline;color:inherit;padding:0;font-family:inherit">Browse \u2192</button>')+'</span><input type="text" id="bcw-setup-avatar" value="'+t+'" placeholder="e.g. Botnoi" '+(b.getAttribute("data-avatar-url")?'readonly disabled style="opacity:0.6;cursor:not-allowed;"':"")+" /></label>"+(x.BOT_ID?"":'<label><span style="display:flex;justify-content:space-between;align-items:center">Bot ID<a href="https://console.botnoi.ai/manage" target="_blank" rel="noopener" style="font-size:11px;opacity:0.7;text-decoration:underline;color:inherit">Get ID \u2192</a></span><input type="text" id="bcw-setup-botid" placeholder="e.g. 64464df59f76af17c9ca0ed3" /></label>')+(b.getAttribute("data-bnv-speaker")?"":'<div class="bcw-toggle-row"><span class="bcw-toggle-label">Speaker</span><div class="bcw-toggle-wrap"><span id="bcw-v-label-1" class="'+(x.BNV_VERSION===1?"bcw-active":"")+'">v1</span><label class="bcw-toggle"><input type="checkbox" id="bcw-setup-version" '+(x.BNV_VERSION===2?"checked":"")+' /><span class="bcw-toggle-track"></span></label><span id="bcw-v-label-2" class="'+(x.BNV_VERSION===2?"bcw-active":"")+'">v2</span></div></div><input type="text" id="bcw-setup-speaker" value="'+x.BNV_SPEAKER+'" placeholder="Speaker ID, e.g. 13" style="width:100%;padding:10px 12px;border:1.5px solid var(--bcw-border);border-radius:10px;font-size:13px;font-family:inherit;background:#fff;color:var(--bcw-title-text);outline:none;box-sizing:border-box" />')+'<p class="bcw-setup-error" id="bcw-setup-error"></p><button class="bcw-setup-submit" id="bcw-setup-go">Connect</button>',r.panel.insertBefore(n,r.messagesOuterEl);var a=n.querySelector("#bcw-browse-models");a&&a.addEventListener("click",async function(p){if(p.preventDefault(),a.textContent="Loading\u2026",a.disabled=!0,window.WebAvatar||await new Promise(function(h){var v=document.createElement("script");v.src=b.AVATAR_WIDGET_SRC,v.onload=h,v.onerror=h,document.head.appendChild(v)}),window.WebAvatar&&typeof window.WebAvatar.preload=="function")try{await window.WebAvatar.preload()}catch{}a.textContent="Browse \u2192",a.disabled=!1;var u=window.WebAvatar&&typeof window.WebAvatar.getModels=="function"?await window.WebAvatar.getModels():[],m=n.querySelector("#bcw-setup-avatar"),g=u.length?`Available models:
\u2022 `+u.join(`
\u2022 `)+`

Enter a model name:`:`No models found.

Enter a model name:`,f=prompt(g,m?m.value:"");f!==null&&m&&(m.value=f.trim())});var s=n.querySelector("#bcw-setup-version"),l=n.querySelector("#bcw-v-label-1"),d=n.querySelector("#bcw-v-label-2");s&&s.addEventListener("change",function(){s.checked?(l.classList.remove("bcw-active"),d.classList.add("bcw-active")):(l.classList.add("bcw-active"),d.classList.remove("bcw-active"))}),n.querySelector("#bcw-setup-go").addEventListener("click",function(){var p=n.querySelector("#bcw-setup-error"),u=n.querySelector("#bcw-setup-botid"),m=n.querySelector("#bcw-setup-avatar"),g=n.querySelector("#bcw-setup-speaker");if(u&&!u.value.trim()){p.textContent="Bot ID is required.";return}u&&(x.BOT_ID=u.value.trim(),b.CONFIG_SAVE&&localStorage.setItem("bcw_bot_id",x.BOT_ID)),x.AVATAR_MODEL=m&&!m.disabled&&m.value.trim()||x.AVATAR_MODEL||"Botnoi",x.BNV_VERSION=s?s.checked?2:1:x.BNV_VERSION,x.BNV_SPEAKER=g?g.value.trim()||"13":x.BNV_SPEAKER,b.CONFIG_SAVE&&(localStorage.setItem("bcw_avatar_url",x.AVATAR_MODEL),localStorage.setItem("bcw_bnv_version",String(x.BNV_VERSION)),localStorage.setItem("bcw_bnv_speaker",x.BNV_SPEAKER)),c.needsSetup=!1,r.panel.classList.remove("bcw-setup-active"),n.remove(),r.messagesOuterEl.style.display="",r.panel.querySelector("#bcw-input-area").style.display="",r.panel.querySelector("#bcw-volume-group").style.display="",r.panel.querySelector("#bcw-clear-btn").style.display="",c.initialized=!0,e&&e()})}}var se=D(()=>{H();F()});function mt(e){if(!e)return"";var t=e.replace(/https?:\/\/[^\s]+/gi,"");return t=t.replace(/\[([^\]]*)\]\([^)]*\)/g,"$1"),t=t.replace(/<[^>]*>/g,""),t=t.replace(/\s+/g," ").trim(),t}function Ii(e){switch(e.type){case"text":return mt(e.text);case"postback":return e.postback&&e.postback.data?mt(e.postback.data):"";default:return""}}function We(e,t){switch(t&&(c.chatHistory.push({sender:"bot",reply:e}),et()),e.type){case"text":{var o=R(e.text,"bot");return o.dataset.bcwTtsText=mt(e.text),Ct(o),L(o),o}case"image":Ft(e.image.original_img_url,"bot");break;case"file":Se(e.file_url,e.file_name,"bot");break;case"location":Ce(e.location.address,e.location.latitude,e.location.longitude,"bot");break;case"video":Be(e.video_url,e.preview_image_url,"bot");break;case"audio":Le(e.audio_url,"bot");break;case"sticker":Ft(e.sticker.sticker_image_url,"bot");break;case"quick_reply":return Oe(e.quick_reply,it,mt,Ct,Bt);case"carousel":$e(e.carousel_cards,it);break;case"flex":Ie(e.flex);break;case"postback":{if(e.postback&&e.postback.data){var i=R(e.postback.data,"bot");return i.dataset.bcwTtsText=mt(e.postback.data),Ct(i),L(i),i}break}}return null}function wo(){c.channel=x.ably.channels.get(`chat-${c.userId}`),c.channel.subscribe("bot-reply",function(e){let t=JSON.parse(e.data);t.token&&(x.lastJWT=t.token);let o=t.messages;var i=[];if(o.forEach(function(a){var s=Ii(a);if(s){var l=a.type==="text"||a.type==="postback"||a.type==="quick_reply";i.push({text:s,reply:a,bubbleRef:l?{el:null}:null})}}),o.forEach(function(a,s){setTimeout(function(){var l=We(a,!0);if(l){for(var d=0;d<i.length;d++)if(i[d].reply===a&&i[d].bubbleRef&&!i[d].bubbleRef.el){i[d].bubbleRef.el=l;break}}},s*go)}),i.length>0){var n=c.lastUserInput;setTimeout(function(){i.forEach(function(a){$i(a.text,n,a.text,a.bubbleRef,a.reply)})},(o.length-1)*go)}})}function vo(e){return new Promise((t,o)=>{if(!c.channel)return o(new Error("No active Ably channel"));let i=setTimeout(()=>{c.channel.unsubscribe("asr-token",n),o(new Error("Timeout waiting for ASR token"))},5e3),n=function(a){clearTimeout(i),c.channel.unsubscribe("asr-token",n),t(a.data)};c.channel.subscribe("asr-token",n),fetch(`${x.WORKER_URL}/api/request-asr-token`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:e})}).catch(a=>{clearTimeout(i),c.channel.unsubscribe("asr-token",n),o(a)})})}function $i(e,t,o,i,n){!b.AVATAR_ENABLED||!e||(qt.push({text:e,userInput:t||"",botText:o||e,bubbleRef:i||null,replyRef:n||null}),le||ze())}async function ze(){if(qt.length===0){le=!1;return}le=!0;var e=qt.shift();try{let d=await mo(e.text,x.BOT_ID,x.lastJWT,x.BNV_VERSION,x.BNV_SPEAKER);if(d&&d.content&&window.WebAvatar){var t=await ae(e.userInput,e.botText),o=t.animation,i=t.emotion,n=t.duration,a=await ke(d.content);if(a||(a=d.content),e.bubbleRef&&e.bubbleRef.el&&Bt(e.bubbleRef.el,d.content,o,i,n),e.replyRef){for(var s=null,l=c.chatHistory.length-1;l>=0;l--)if(c.chatHistory[l].sender==="bot"&&c.chatHistory[l].reply===e.replyRef){s=c.chatHistory[l];break}s&&(d.content&&(s.reply.audioUrl=d.content),o&&(s.reply.animName=o),i&&(s.reply.emotion=i),n&&(s.reply.duration=n),et())}window.WebAvatar.playAudio(a)}}catch{uo("Voice generation failed or network error.")}setTimeout(ze,300)}function ho(){qt.length=0,le=!1,window.WebAvatar&&window.WebAvatar.stopAudio()}async function it(e,t){var o=e||r.inputEl.value.trim();if(o){var i=t||o;L(R(i,"user")),c.chatHistory.push({sender:"user",text:o,uiText:i}),et(),r.inputEl.value="",c.lastUserInput=o;try{await bo(x.WORKER_URL,c.userId,x.BOT_ID,o)}catch(n){console.error("[BotnoiChatWidget] Send error:",n)}}}function Ct(e){if(!e.querySelector(".bcw-replay-btn")){var t=document.createElement("button");t.className="bcw-replay-btn",t.title="Replay",t.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393 285.2 400 271.4 400 256s-7.1-29.2-17.8-37.2c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/></svg>',t.addEventListener("click",function(o){o.stopPropagation(),Oi(e)}),e.addEventListener("touchstart",function(){e.classList.add("bcw-replay-hover"),clearTimeout(e._bcwReplayTimer),e._bcwReplayTimer=setTimeout(function(){e.classList.remove("bcw-replay-hover")},3e3)},{passive:!0}),e.appendChild(t)}}function Bt(e,t,o,i,n){e&&(t&&(e.dataset.bcwAudioUrl=t),o&&(e.dataset.bcwAnimName=o),i&&(e.dataset.bcwEmotion=i),n&&(e.dataset.bcwEmotionDuration=n))}async function Oi(e){var t=e.dataset.bcwAudioUrl||"",o=e.dataset.bcwAnimName||"",i=e.dataset.bcwEmotion||"",n=parseFloat(e.dataset.bcwEmotionDuration)||0,a=e.dataset.bcwTtsText||"";if(ho(),t&&window.WebAvatar){o&&typeof window.WebAvatar.loadAnimation=="function"&&window.WebAvatar.loadAnimation(o),i&&typeof window.WebAvatar.setEmotion=="function"&&window.WebAvatar.setEmotion(i,n);let{_getAudioCache:l}=await Promise.resolve().then(()=>(Ut(),ao));var s=await l(t);window.WebAvatar.playAudio(s||t)}else a&&(qt.push({text:a,userInput:"",botText:a,bubbleRef:null}),ze())}function ce(){if(confirm("Are you sure you want to clear the chat history? This cannot be undone.")){r.messagesEl.innerHTML="",localStorage.removeItem(`botnoi_history_${c.userId}`),Wt(),c.chatHistory=[],c.sessionCount++,localStorage.setItem("botnoi_session_count",c.sessionCount.toString()),c.userId=`WebAvatarUser_${c.hwid}_${c.sessionCount}`,r.headerTitle.textContent=b.WIDGET_TITLE,r.headerAvatar.src="",r.headerAvatar.classList.remove("bcw-show"),N("offline","Offline"),Vt();try{window.WebAvatar&&typeof window.WebAvatar.disconnect=="function"&&window.WebAvatar.disconnect()}catch{}oe(),c.avatarReady=!1,r.inputEl.value="",r.inputEl.disabled=!0,r.inputEl.placeholder="Connecting\u2026",r.sendBtn.disabled=!0,localStorage.removeItem("bcw_bot_id"),localStorage.removeItem("bcw_bnv_version"),localStorage.removeItem("bcw_bnv_speaker"),localStorage.removeItem("bcw_avatar_url"),x.BOT_ID=b.getAttribute("data-bot-id")||"",x.BNV_VERSION=parseInt(b.getAttribute("data-bnv-version")||"1",10),x.BNV_SPEAKER=b.getAttribute("data-bnv-speaker")||"13",x.AVATAR_MODEL=b.getAttribute("data-avatar-url")||"Botnoi",c.needsSetup=!x.BOT_ID,c.initialized=!1,c.needsSetup?re(()=>{c.initialized=!0,window.botnoiApp.loadAblyAndInit()}):(c.initialized=!0,window.botnoiApp.loadAblyAndInit())}}function yo(){r.messagesEl.innerHTML="",c.chatHistory.forEach(function(e){if(e.sender==="user"){var t=R(e.uiText||e.text,"user");t.classList.add("bcw-animate-in"),r.messagesEl.appendChild(t)}else e.sender==="bot"&&Ri(e.reply)}),r.messagesEl.scrollTop=r.messagesEl.scrollHeight}function Ri(e){switch(e.type){case"text":{var t=R(e.text,"bot");t.classList.add("bcw-animate-in"),t.dataset.bcwTtsText=mt(e.text),Ct(t),Bt(t,e.audioUrl,e.animName,e.emotion,e.duration),r.messagesEl.querySelectorAll(".bcw-quick-replies").forEach(function(n){n.parentNode&&n.parentNode.removeChild(n)}),r.messagesEl.appendChild(t);break}case"image":Ft(e.image&&(e.image.original_img_url||e.image.img_url),"bot");break;case"file":Se(e.file_url,e.file_name,"bot");break;case"location":Ce(e.location.address,e.location.latitude,e.location.longitude,"bot");break;case"video":Be(e.video_url,e.preview_image_url,"bot");break;case"audio":Le(e.audio_url,"bot");break;case"sticker":Ft(e.sticker.sticker_image_url,"bot");break;case"quick_reply":{var o=Oe(e.quick_reply,it,mt,Ct,Bt);o&&Bt(o,e.audioUrl,e.animName,e.emotion,e.duration);break}case"carousel":$e(e.carousel_cards,it);break;case"flex":Ie(e.flex);break;case"postback":if(e.postback&&e.postback.data){var i=R(e.postback.data,"bot");i.classList.add("bcw-animate-in"),i.dataset.bcwTtsText=mt(e.postback.data),Ct(i),Bt(i,e.audioUrl,e.animName,e.emotion,e.duration),r.messagesEl.querySelectorAll(".bcw-quick-replies").forEach(function(n){n.parentNode&&n.parentNode.removeChild(n)}),r.messagesEl.appendChild(i)}break}}function Vt(){try{var e=null;if(c.channel){e=c.channel.name;try{c.channel.unsubscribe()}catch{}try{c.channel.detach()}catch{}}window._bcwAblyInstances&&window._bcwAblyInstances.length>0&&(window._bcwAblyInstances.forEach(function(t){if(t){try{e&&t.channels.release(e)}catch{}if(t.connection)try{t.connection.off()}catch{}try{t.close()}catch{}}}),window._bcwAblyInstances=[]),ho()}catch(t){console.warn("[BotnoiChatWidget] Ably cleanup:",t)}finally{x.ably=null,c.ably=null,c.channel=null}}var go,qt,le,Ue=D(()=>{H();F();Xt();Ne();Re();Ut();se();go=340,qt=[],le=!1});function pe(e){at=e}function ko(e){De=e}async function _o(){Lt?To():await Pi()}async function Pi(){if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){console.warn("[ChatWidget] Mic API not supported in this browser or context (requires HTTPS)."),Lt=!1,ue(!1),at&&at(!1,{error:"not-supported"});return}try{vt=await navigator.mediaDevices.getUserMedia({audio:!0})}catch(e){console.warn("[ChatWidget] Mic permission denied:",e),Lt=!1,ue(!1),at&&at(!1,{error:"permission-denied"});return}de=[],Lt=!0,ue(!0),yt=b.MIC_LIMIT,r.inputEl&&(Eo=r.inputEl.placeholder),yt>0?(r.inputEl&&(r.inputEl.placeholder=`Listening... (${yt}s)`),Gt=setInterval(()=>{yt--,yt>0&&r.inputEl&&(r.inputEl.placeholder=`Listening... (${yt}s)`)},1e3),jt=setTimeout(()=>{To()},yt*1e3)):r.inputEl&&(r.inputEl.placeholder="Listening..."),nt=new MediaRecorder(vt,{mimeType:MediaRecorder.isTypeSupported("audio/webm;codecs=opus")?"audio/webm;codecs=opus":"audio/webm"}),nt.ondataavailable=function(e){e.data&&e.data.size>0&&(de.push(e.data),De&&De(e.data))},nt.onstop=function(){let e=new Blob(de,{type:nt.mimeType});de=[],vt&&vt.getTracks().forEach(function(t){t.stop()}),Gt&&clearInterval(Gt),jt&&clearTimeout(jt),r.inputEl&&(r.inputEl.placeholder=Eo),at&&at(!1,{stream:vt,blob:e}),vt=null,nt=null},nt.start(250),at&&at(!0,{stream:vt})}function To(){Lt=!1,ue(!1),Gt&&clearInterval(Gt),jt&&clearTimeout(jt),nt&&nt.state!=="inactive"&&nt.stop()}function ue(e){r.micBtn&&(e?(r.micBtn.classList.add("bcw-recording"),r.micBtn.title="Stop recording"):(r.micBtn.classList.remove("bcw-recording"),r.micBtn.title="Start recording"))}function Ia(){return Lt}var nt,vt,de,Lt,jt,Gt,yt,Eo,at,De,be=D(()=>{F();H();nt=null,vt=null,de=[],Lt=!1,jt=null,Gt=null,yt=10,Eo="",at=null,De=null});var Mo,Ao=D(()=>{Mo=`@charset "UTF-8";

.chatbox * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: 0 solid transparent;
  font-size: 100%;
  font-weight: normal;
  font-style: normal;
  list-style: none;
}

.chatbox *::after,
.chatbox *::before {
  box-sizing: inherit;
}

.chatbox {
  background-color: #849ebf;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 100%;
  flex: 1 1 100%;
  padding-top: 50px;
  width: 500px;
  height: auto;
  line-height: 1.4;
  color: #444;
  font-family: -apple-system, "BlinkMacSystemFont", Helvetica, Roboto,
    Sans-Serif;
  font-size: 16px;
  -webkit-user-select: none;
  -webkit-text-size-adjust: none;
}

.chatbox a {
  -webkit-touch-callout: none;
}

.chatbox a:active,
.chatbox a:focus,
.chatbox a:hover,
.chatbox a:link,
.chatbox a:visited {
  text-decoration: none;
}

/* Global rules removed \u2014 use the .chatbox-scoped section above instead.
   This prevents font-size/font-weight/border resets from leaking outside
   of flex card containers into the rest of the host page. */
.LySlider {
  overflow: hidden;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
}

.LySlider::-webkit-scrollbar {
  display: none;
}

.LySlider .lyInner {
  display: -webkit-box;
  display: flex;
  width: 100%;
}

.LySlider .lyInner::after {
  -webkit-box-flex: 0;
  flex: none;
  content: "";
  display: block;
  width: 7px;
  height: 1px;
}

.LySlider .lyItem {
  -webkit-box-flex: 0;
  flex: none;
  display: inherit;
  width: 80%;
  max-width: 300px;
  margin-left: 7px;
}

.LySlider .lyItem+.lyItem {
  margin-left: 9px;
}

.LySlider .lyItem.LyGi {
  max-width: 500px;
}

.LySlider .lyItem.LyMe {
  max-width: 300px;
}

.LySlider .lyItem.LyKi {
  max-width: 260px;
}

.LySlider .lyItem.LyHe {
  max-width: 241px;
}

.LySlider .lyItem.LyDe {
  max-width: 220px;
}

.LySlider .lyItem.LyMi {
  max-width: 160px;
}

.LySlider .lyItem.LyNa {
  max-width: 120px;
}

.LySlider .T1 {
  -webkit-box-flex: 1;
  flex: 1 0 0;
}

@media (-webkit-min-device-pixel-ratio: 1) {
  .LySlider .T1 {
    width: 0;
  }
}

@media (-webkit-min-device-pixel-ratio: 1) and (min-width: 0.001vmax) {
  .LySlider .T1 {
    width: auto;
  }
}

@media (min-resolution: 1dpi) {
  .LySlider .T1 {
    width: auto;
  }
}

.LySlider .T1 .t1Header {
  -webkit-box-flex: 0;
  flex: none;
}

.LySlider .T1 .t1Hero {
  -webkit-box-flex: 0;
  flex: none;
}

.LySlider .T1 .t1Hero:last-child {
  border-radius: 0;
}

.LySlider .T1 .t1Body {
  -webkit-box-flex: 1;
  flex: 1 0 0;
  flex-basis: auto;
}

@media (-webkit-min-device-pixel-ratio: 1) {
  .LySlider .T1 .t1Body {
    width: 0;
  }
}

@media (-webkit-min-device-pixel-ratio: 1) and (min-width: 0.001vmax) {
  .LySlider .T1 .t1Body {
    width: auto;
  }
}

@media (min-resolution: 1dpi) {
  .LySlider .T1 .t1Body {
    width: auto;
  }
}

.LySlider .T1 .t1Body>.MdBx.vr {
  -webkit-box-flex: 1;
  flex: 1 0 0;
  flex-basis: auto;
}

.LyGi .T1 {
  border-radius: 5px;
  max-width: 500px;
  margin: 0 7px;
}

.LyMe .T1 {
  border-radius: 17px;
}

.LyKi .T1 {
  border-radius: 10px;
}

.LyHe .T1 {
  border-radius: 10px;
}

.LyDe .T1 {
  border-radius: 10px;
}

.LyMi .T1 {
  border-radius: 10px;
}

.LyNa .T1 {
  border-radius: 10px;
}

.T1 {
  border-radius: 17px;
  overflow: hidden;
  background-color: #ffffff;
  display: -webkit-box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
}

.T1 .t1Body,
.T1 .t1Footer,
.T1 .t1Header,
.T1 .t1Hero {
  display: inherit;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
}

.T1 .t1Body>div,
.T1 .t1Footer>div,
.T1 .t1Header>div,
.T1 .t1Hero>div {
  flex-basis: auto;
}

.T1 .t1Hero:first-child,
.T1 .t1Hero:first-child .MdImg.ExFull,
.T1 .t1Hero:first-child .MdImg.ExFull>div,
.T1 .t1Hero:first-child .MdImg.ExFull>div>a,
.T1 .t1Hero:first-child .MdImg.ExFull>div>a>span {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

.T1 .t1Hero:last-child,
.T1 .t1Hero:last-child .MdImg.ExFull,
.T1 .t1Hero:last-child .MdImg.ExFull>div,
.T1 .t1Hero:last-child .MdImg.ExFull>div>a,
.T1 .t1Hero:last-child .MdImg.ExFull>div>a>span {
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}

.T1 .t1Hero:first-child .MdImg.ExFull>div>a>span,
.T1 .t1Hero:last-child .MdImg.ExFull>div>a>span {
  overflow: hidden;
}

.T1 .t1Header>.MdBx {
  padding: 20px;
}

.LyKi .T1 .t1Header>.MdBx {
  padding: 13px;
}

.LyHe .T1 .t1Header>.MdBx {
  padding: 11px 14px 13px;
}

.LyDe .T1 .t1Header>.MdBx {
  padding: 11px 14px 13px;
}

.LyMi .T1 .t1Header>.MdBx {
  padding: 10px;
}

.LyNa .T1 .t1Header>.MdBx {
  padding: 10px;
}

.T1 .t1Body>.MdBx {
  padding: 20px;
  padding-top: 19px;
}

.LyKi .T1 .t1Body>.MdBx {
  padding: 13px;
}

.LyHe .T1 .t1Body>.MdBx {
  padding: 11px 14px 13px;
}

.LyDe .T1 .t1Body>.MdBx {
  padding: 11px 14px 13px;
}

.LyMi .T1 .t1Body>.MdBx {
  padding: 10px;
}

.LyNa .T1 .t1Body>.MdBx {
  padding: 10px;
}

.T1 .t1Body.ExHasFooter>.MdBx {
  padding-bottom: 10px;
}

.LyKi .T1 .t1Body.ExHasFooter>.MdBx {
  padding-bottom: 17px;
}

.LyHe .T1 .t1Body.ExHasFooter>.MdBx {
  padding-bottom: 17px;
}

.LyDe .T1 .t1Body.ExHasFooter>.MdBx {
  padding-bottom: 17px;
}

.T1 .t1Footer>.MdBx {
  padding: 10px;
}

.fxLTR,
[dir="ltr"] {
  direction: ltr;
}

.fxRTL,
[dir="rtl"] {
  direction: rtl;
}

.MdBtn,
.MdBx,
.MdIco,
.MdImg,
.MdTxt,
[class*="MdSep"] {
  display: -webkit-box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-flex: 1;
  flex: 1 0 0;
  min-width: 0;
  max-width: 100%;
}

@media (-webkit-min-device-pixel-ratio: 1) {

  .MdBtn,
  .MdBx,
  .MdIco,
  .MdImg,
  .MdTxt,
  [class*="MdSep"] {
    width: 0;
  }
}

@media (-webkit-min-device-pixel-ratio: 1) and (min-width: 0.001vmax) {

  .MdBtn,
  .MdBx,
  .MdIco,
  .MdImg,
  .MdTxt,
  [class*="MdSep"] {
    width: auto;
  }
}

@media (min-resolution: 1dpi) {

  .MdBtn,
  .MdBx,
  .MdIco,
  .MdImg,
  .MdTxt,
  [class*="MdSep"] {
    width: auto;
  }
}

.MdBx {
  overflow: hidden;
  position: relative;
}

.MdBx.vr>div {
  -webkit-box-flex: 0;
  flex: none;
  flex-basis: auto;
}

.MdBx.hr {
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  flex-direction: row;
  width: 100%;
}

.MdBx.hr>div {
  overflow: hidden;
  -webkit-box-flex: 1;
  flex: 1 0 0;
}

@media (-webkit-min-device-pixel-ratio: 1) {
  .MdBx.hr>div {
    width: 0;
  }
}

@media (-webkit-min-device-pixel-ratio: 1) and (min-width: 0.001vmax) {
  .MdBx.hr>div {
    width: auto;
  }
}

@media (min-resolution: 1dpi) {
  .MdBx.hr>div {
    width: auto;
  }
}

.MdBx.hr>div.MdSep {
  overflow: visible;
}

.MdBx.hr>div.fl0 {
  width: auto;
}

.MdBx.hr>div.fl0.MdImg.ExFull {
  width: 100%;
}

.MdBx.hr>div[class*="MdSep"] {
  -webkit-box-flex: 0;
  flex: none;
}

.MdBx.hr.bl {
  -webkit-box-align: baseline;
  align-items: baseline;
}

.MdBx.hr>div.ExAbs {
  width: auto;
}

.MdBx.hr.ExAbs {
  width: auto;
}

.MdBx.hr.ExAbs>div {
  width: auto;
}

.ExAbs .MdBx.hr {
  width: auto;
}

.ExAbs .MdBx.hr>div {
  width: auto;
}

.T1 .MdBx.hr.spcXs>div {
  margin-left: 2px;
}

.T1 .MdBx.hr.spcSm>div {
  margin-left: 4px;
}

.T1 .MdBx.hr.spcMd>div {
  margin-left: 6px;
}

.T1 .MdBx.hr.spcLg>div {
  margin-left: 8px;
}

.T1 .MdBx.hr.spcXl>div {
  margin-left: 10px;
}

.T1 .MdBx.hr.spcXxl>div {
  margin-left: 12px;
}

.T1 .MdBx.hr>div.mdBxFiller,
.T1 .MdBx.hr>div.mdBxSpacer,
.T1 .MdBx.hr>div:first-child {
  margin-left: 0;
}

.T1.fxRTL .MdBx.hr>div {
  margin-left: 0;
}

.T1.fxRTL .MdBx.hr.spcXs>div {
  margin-right: 2px;
}

.T1.fxRTL .MdBx.hr.spcSm>div {
  margin-right: 4px;
}

.T1.fxRTL .MdBx.hr.spcMd>div {
  margin-right: 6px;
}

.T1.fxRTL .MdBx.hr.spcLg>div {
  margin-right: 8px;
}

.T1.fxRTL .MdBx.hr.spcXl>div {
  margin-right: 10px;
}

.T1.fxRTL .MdBx.hr.spcXxl>div {
  margin-right: 12px;
}

.T1.fxRTL .MdBx.hr>div.mdBxFiller,
.T1.fxRTL .MdBx.hr>div.mdBxSpacer,
.T1.fxRTL .MdBx.hr>div:first-child {
  margin-right: 0;
}

.MdBx.itms-jfcS {
  -webkit-box-pack: start;
  justify-content: flex-start;
}

.MdBx.itms-jfcE {
  -webkit-box-pack: end;
  justify-content: flex-end;
}

.MdBx.itms-jfcC {
  -webkit-box-pack: center;
  justify-content: center;
}

.MdBx.itms-jfcSB {
  -webkit-box-pack: justify;
  justify-content: space-between;
}

.MdBx.itms-jfcSA {
  justify-content: space-around;
}

.MdBx.itms-jfcSE {
  justify-content: space-evenly;
}

.MdBx.itms-algS {
  -webkit-box-align: start;
  align-items: flex-start;
}

.MdBx.itms-algE {
  -webkit-box-align: end;
  align-items: flex-end;
}

.MdBx.itms-algC {
  -webkit-box-align: center;
  align-items: center;
}

.MdBx.itms-algBL {
  -webkit-box-align: baseline;
  align-items: baseline;
}

.MdBx.itms-algSR {
  -webkit-box-align: stretch;
  align-items: stretch;
}

.MdBx.vr.spcXs>div {
  margin-top: 2px;
}

.MdBx.vr.spcSm>div {
  margin-top: 4px;
}

.MdBx.vr.spcMd>div {
  margin-top: 6px;
}

.MdBx.vr.spcLg>div {
  margin-top: 8px;
}

.MdBx.vr.spcXl>div {
  margin-top: 10px;
}

.MdBx.vr.spcXxl>div {
  margin-top: 12px;
}

.MdBx.vr>div.mdBxFiller,
.MdBx.vr>div.mdBxSpacer,
.MdBx.vr>div:first-child {
  margin-top: 0;
}

.MdBx>div.fl0 {
  -webkit-box-flex: 0 !important;
  flex: none !important;
}

.MdBx>div.fl1 {
  -webkit-box-flex: 1 !important;
  flex: 1 0 0 !important;
}

.MdBx>div.fl2 {
  -webkit-box-flex: 2 !important;
  flex: 2 0 0 !important;
}

.MdBx>div.fl3 {
  -webkit-box-flex: 3 !important;
  flex: 3 0 0 !important;
}

.MdBx>div.algS {
  -webkit-box-align: start;
  align-items: flex-start;
}

.MdBx>div.algE {
  -webkit-box-align: end;
  align-items: flex-end;
}

.MdBx>div.grvC {
  -webkit-box-pack: center;
  justify-content: center;
}

.MdBx>div.grvB {
  -webkit-box-pack: end;
  justify-content: flex-end;
}

.T1 .MdBx>div.mdBxFiller {
  -webkit-box-flex: 1;
  flex: 1 0 0;
}

@media (-webkit-min-device-pixel-ratio: 1) {
  .T1 .MdBx>div.mdBxFiller {
    width: 0;
  }
}

@media (-webkit-min-device-pixel-ratio: 1) and (min-width: 0.001vmax) {
  .T1 .MdBx>div.mdBxFiller {
    width: auto;
  }
}

@media (min-resolution: 1dpi) {
  .T1 .MdBx>div.mdBxFiller {
    width: auto;
  }
}

.MdBx>div.mdBxSpacer {
  -webkit-box-flex: 0;
  flex: none;
}

.MdBx.hr>div.mdBxSpacer {
  height: 1px;
}

.MdBx.hr>div.mdBxSpacer.spcXs {
  width: 2px;
}

.MdBx.hr>div.mdBxSpacer.spcSm {
  width: 4px;
}

.MdBx.hr>div.mdBxSpacer.spcMd {
  width: 6px;
}

.MdBx.hr>div.mdBxSpacer.spcLg {
  width: 8px;
}

.MdBx.hr>div.mdBxSpacer.spcXl {
  width: 10px;
}

.MdBx.hr>div.mdBxSpacer.spcXxl {
  width: 12px;
}

.MdBx.hr[class*="spc"]>div.mdBxSpacer+div {
  margin-left: 0;
}

.MdBx.hr>.MdSep {
  align-self: stretch;
}

.MdBx.vr>div.mdBxSpacer {
  width: 1px;
}

.MdBx.vr>div.mdBxSpacer.spcXs {
  height: 2px;
}

.MdBx.vr>div.mdBxSpacer.spcSm {
  height: 4px;
}

.MdBx.vr>div.mdBxSpacer.spcMd {
  height: 6px;
}

.MdBx.vr>div.mdBxSpacer.spcLg {
  height: 8px;
}

.MdBx.vr>div.mdBxSpacer.spcXl {
  height: 10px;
}

.MdBx.vr>div.mdBxSpacer.spcXxl {
  height: 12px;
}

.MdBx.vr>div.fl0 {
  -webkit-box-flex: 0 !important;
  flex: none !important;
}

.MdBx.vr>div.fl1 {
  -webkit-box-flex: 1 !important;
  flex: 1 0 auto !important;
}

.MdBx.vr>div.fl2 {
  -webkit-box-flex: 2 !important;
  flex: 2 0 auto !important;
}

.MdBx.vr>div.fl3 {
  -webkit-box-flex: 3 !important;
  flex: 3 0 auto !important;
}

.MdBx[class*="spc"]>div.mdBxSpacer+div {
  margin-top: 0;
}

[class*="MdSep"] {
  -webkit-box-flex: 0;
  flex: none;
  box-sizing: content-box;
  width: 100%;
  border: 0 solid #d4d6da;
}

.MdSep {
  position: relative;
  -webkit-box-flex: 0;
  flex: none;
}

.MdSep::before {
  box-sizing: content-box;
  content: "";
  display: block;
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 1px;
  border: inherit;
  border-top-width: 1px;
  -webkit-transform-origin: left top;
  transform-origin: left top;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.MdSep:last-child::before {
  margin-top: -1px;
  border-top-width: 0;
  border-bottom-width: 1px;
}

.fxRTL .MdSep::before {
  -webkit-transform-origin: right top;
  transform-origin: right top;
}

.MdSepB {
  border-top-width: 1px;
}

.MdBx.hr>div.MdSep::before {
  width: 1px;
  height: 100%;
  border-top-width: 0;
  border-left-width: 1px;
  -webkit-transform: scaleX(0.5);
  transform: scaleX(0.5);
}

.MdBx.hr>div.MdSep:last-child::before {
  margin-top: 0;
  margin-left: -1px;
  border-left-width: 0;
  border-right-width: 1px;
}

.MdBx.hr>div.MdSepB {
  border-top-width: 0;
  border-left-width: 1px;
}

.fxRTL .MdBx.hr>div.MdSep::before {
  border-left-width: 0;
  border-right-width: 1px;
}

.fxRTL .MdBx.hr>div.MdSep:last-child::before {
  margin-left: 0;
  margin-right: -1px;
  border-right-width: 0;
  border-left-width: 1px;
}

/* \u2500\u2500 ExMgnT: box/button/image margin-top (generated by ExMgnT+upperalldigit) */
.ExMgnTXxs {
  margin-top: 2px;
}

.ExMgnTXs {
  margin-top: 4px;
}

.ExMgnTSm {
  margin-top: 6px;
}

.ExMgnTMd {
  margin-top: 8px;
}

.ExMgnTLg {
  margin-top: 10px;
}

.ExMgnTXl {
  margin-top: 12px;
}

.ExMgnTXxl {
  margin-top: 14px;
}

.ExMgnTNone {
  margin-top: 0;
}

/* \u2500\u2500 ExMgnL: text margin-top (generated by ExMgnL+upperalldigit, applied
   to .MdTxt \u2014 the 'L' stands for 'leading' not 'left') */
.ExMgnLXxs {
  margin-top: 2px;
}

.ExMgnLXs {
  margin-top: 4px;
}

.ExMgnLSm {
  margin-top: 6px;
}

.ExMgnLMd {
  margin-top: 8px;
}

.ExMgnLLg {
  margin-top: 10px;
}

.ExMgnLXl {
  margin-top: 12px;
}

.ExMgnLXxl {
  margin-top: 14px;
}

.ExMgnLNone {
  margin-top: 0;
}

.MdTxt {
  position: relative;
}

.MdTxt p {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.MdTxt p:empty {
  height: 1.4em;
}

.MdTxt.ExWrap p {
  text-overflow: clip;
  word-wrap: break-word;
  white-space: normal;
}

.MdTxt.Ex2nd {
  color: #aaa;
}

.MdTxt.ExAlgC p {
  text-align: center;
}

.MdTxt.ExAlgE p {
  text-align: end;
}

.MdSpn {
  font-style: inherit;
  font-weight: inherit;
  text-decoration: inherit;
}

/* Size class names match what flex2html.js generates via upperalldigit()
   which uppercases ONLY the first character:
     xxs \u2192 Xxs,  xxl \u2192 Xxl,  3xl \u2192 3xl,  4xl \u2192 4xl,  5xl \u2192 5xl        */
.MdSpn.ExXxs {
  font-size: 11px;
}

.MdSpn.ExXs {
  font-size: 13px;
}

.MdSpn.ExSm {
  font-size: 14px;
}

.MdSpn.ExMd {
  font-size: 16px;
}

.MdSpn.ExLg {
  font-size: 19px;
}

.MdSpn.ExXl {
  font-size: 22px;
}

.MdSpn.ExXxl {
  font-size: 29px;
}

.MdSpn.Ex3xl {
  font-size: 35px;
}

.MdSpn.Ex4xl {
  font-size: 48px;
}

.MdSpn.Ex5xl {
  font-size: 74px;
}

/* MdTxt (text objects) size classes \u2014 MdTxt p has no default font-size
   so it inherits from .chatbox (16px). These explicit rules ensure the
   size field in the JSON is respected for full text objects. */
.MdTxt.ExXxs p {
  font-size: 11px;
}

.MdTxt.ExXs p {
  font-size: 13px;
}

.MdTxt.ExSm p {
  font-size: 14px;
}

.MdTxt.ExMd p {
  font-size: 16px;
}

.MdTxt.ExLg p {
  font-size: 19px;
}

.MdTxt.ExXl p {
  font-size: 22px;
}

.MdTxt.ExXxl p {
  font-size: 29px;
}

.MdTxt.Ex3xl p {
  font-size: 35px;
}

.MdTxt.Ex4xl p {
  font-size: 48px;
}

.MdTxt.Ex5xl p {
  font-size: 74px;
}

/* ExWB bold \u2014 .chatbox * resets font-weight:normal, explicit rules needed
   for both MdTxt and MdSpn so that weight:"bold" is respected. */
.MdTxt.ExWB p,
.MdSpn.ExWB {
  font-weight: bold;
}

.MdIco {
  position: relative;
}

.MdIco span {
  display: inline-block;
  overflow: hidden;
  background: no-repeat center;
  background-size: contain;
  width: 1em;
  height: 1em;
  vertical-align: baseline;
}

.MdIco.ExAr2to1 span {
  width: 2em;
}

.MdIco.ExAr3to1 span {
  width: 3em;
}

.MdIco.ExXXs,
.MdTxt.ExXXs {
  font-size: 11px;
}

.MdIco.ExXs,
.MdTxt.ExXs {
  font-size: 13px;
}

.MdIco.ExSm,
.MdTxt.ExSm {
  font-size: 14px;
}

.MdIco.ExMd,
.MdTxt.ExMd {
  font-size: 16px;
}

.MdIco.ExLg,
.MdTxt.ExLg {
  font-size: 19px;
}

.MdIco.ExXl,
.MdTxt.ExXl {
  font-size: 22px;
}

.MdIco.ExXXl,
.MdTxt.ExXXl {
  font-size: 29px;
}

.MdIco.Ex3Xl,
.MdTxt.Ex3Xl {
  font-size: 35px;
}

.MdIco.Ex4Xl,
.MdTxt.Ex4Xl {
  font-size: 48px;
}

.MdIco.Ex5Xl,
.MdTxt.Ex5Xl {
  font-size: 74px;
}

.MdBtn {
  position: relative;
}

.MdBtn a {
  display: inherit;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 16px;
}

.MdBtn div {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;
}

.MdBtn.ExBtn1 a {
  background-color: #17c950;
  color: #ffffff;
}

.MdBtn.ExBtn2 a {
  background-color: #dcdfe5;
  color: #111111;
}

.MdBtn.ExBtnL a {
  color: #42659a;
}

.MdBtn.ExSm a {
  height: 40px;
}

.MdImg {
  -webkit-box-align: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.MdImg>div {
  max-width: 100%;
}

.MdImg a {
  display: block;
  position: relative;
  width: 100%;
}

.MdImg span {
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center center;
}

.MdImg.ExXXs>div {
  width: 40px;
}

.MdImg.ExXs>div {
  width: 60px;
}

.MdImg.ExSm>div {
  width: 80px;
}

.MdImg.ExMd>div {
  width: 100px;
}

.MdImg.ExLg>div {
  width: 120px;
}

.MdImg.ExXl>div {
  width: 140px;
}

.MdImg.ExXXl>div {
  width: 160px;
}

.MdImg.Ex3Xl>div {
  width: 180px;
}

.MdImg.Ex4Xl>div {
  width: 200px;
}

.MdImg.Ex5Xl>div {
  width: 220px;
}

.MdImg.ExFull>div {
  width: 100%;
}

.MdImg.ExAr1to1 a {
  padding-bottom: 100%;
}

.MdImg.ExAr1_51to1 a {
  padding-bottom: 66.22517%;
}

.MdImg.ExAr1_91to1 a {
  padding-bottom: 52.35602%;
}

.MdImg.ExAr20to13 a {
  padding-bottom: 65%;
}

.MdImg.ExAr4to3 a {
  padding-bottom: 75%;
}

.MdImg.ExAr16to9 a {
  padding-bottom: 56.25%;
}

.MdImg.ExAr2to1 a {
  padding-bottom: 50%;
}

.MdImg.ExAr3to1 a {
  padding-bottom: 33.33333%;
}

.MdImg.ExAr3to4 a {
  padding-bottom: 133.33333%;
}

.MdImg.ExAr9to16 a {
  padding-bottom: 177.77778%;
}

.MdImg.ExAr1to2 a {
  padding-bottom: 200%;
}

.MdImg.ExAr1to3 a {
  padding-bottom: 300%;
}

.MdImg.ExFit span {
  background-size: contain;
}

.MdImg.ExCover span {
  background-size: cover;
}

.MdImg.ExCircle span {
  border-radius: 50%;
}

.MdImg.ExMirrored span {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

.MdImg.ExAbs.ExFull {
  width: 100%;
}

.ExMgnANone {
  margin: 0 !important;
}

.ExMgnAXs {
  margin: 2px !important;
}

.ExMgnASm {
  margin: 4px !important;
}

.ExMgnAMd {
  margin: 6px !important;
}

.ExMgnALg {
  margin: 8px !important;
}

.ExMgnAXl {
  margin: 10px !important;
}

.ExMgnAXXl {
  margin: 12px !important;
}

.ExMgnTNone {
  margin-top: 0 !important;
}

.ExMgnTXs {
  margin-top: 2px !important;
}

.ExMgnTSm {
  margin-top: 4px !important;
}

.ExMgnTMd {
  margin-top: 6px !important;
}

.ExMgnTLg {
  margin-top: 8px !important;
}

.ExMgnTXl {
  margin-top: 10px !important;
}

.ExMgnTXXl {
  margin-top: 12px !important;
}

.ExMgnBNone {
  margin-bottom: 0 !important;
}

.ExMgnBXs {
  margin-bottom: 2px !important;
}

.ExMgnBSm {
  margin-bottom: 4px !important;
}

.ExMgnBMd {
  margin-bottom: 6px !important;
}

.ExMgnBLg {
  margin-bottom: 8px !important;
}

.ExMgnBXl {
  margin-bottom: 10px !important;
}

.ExMgnBXXl {
  margin-bottom: 12px !important;
}

.ExMgnLNone {
  margin-left: 0 !important;
}

.ExMgnLXs {
  margin-left: 2px !important;
}

.ExMgnLSm {
  margin-left: 4px !important;
}

.ExMgnLMd {
  margin-left: 6px !important;
}

.ExMgnLLg {
  margin-left: 8px !important;
}

.ExMgnLXl {
  margin-left: 10px !important;
}

.ExMgnLXXl {
  margin-left: 12px !important;
}

.ExMgnRNone {
  margin-right: 0 !important;
}

.ExMgnRXs {
  margin-right: 2px !important;
}

.ExMgnRSm {
  margin-right: 4px !important;
}

.ExMgnRMd {
  margin-right: 6px !important;
}

.ExMgnRLg {
  margin-right: 8px !important;
}

.ExMgnRXl {
  margin-right: 10px !important;
}

.ExMgnRXXl {
  margin-right: 12px !important;
}

.ExPadANone {
  padding: 0 !important;
}

.ExPadAXs {
  padding: 2px !important;
}

.ExPadASm {
  padding: 4px !important;
}

.ExPadAMd {
  padding: 6px !important;
}

.ExPadALg {
  padding: 8px !important;
}

.ExPadAXl {
  padding: 10px !important;
}

.ExPadAXXl {
  padding: 12px !important;
}

.ExPadTNone {
  padding-top: 0 !important;
}

.ExPadTXs {
  padding-top: 2px !important;
}

.ExPadTSm {
  padding-top: 4px !important;
}

.ExPadTMd {
  padding-top: 6px !important;
}

.ExPadTLg {
  padding-top: 8px !important;
}

.ExPadTXl {
  padding-top: 10px !important;
}

.ExPadTXXl {
  padding-top: 12px !important;
}

.ExPadBNone {
  padding-bottom: 0 !important;
}

.ExPadBXs {
  padding-bottom: 2px !important;
}

.ExPadBSm {
  padding-bottom: 4px !important;
}

.ExPadBMd {
  padding-bottom: 6px !important;
}

.ExPadBLg {
  padding-bottom: 8px !important;
}

.ExPadBXl {
  padding-bottom: 10px !important;
}

.ExPadBXXl {
  padding-bottom: 12px !important;
}

.ExPadLNone {
  padding-left: 0 !important;
}

.ExPadLXs {
  padding-left: 2px !important;
}

.ExPadLSm {
  padding-left: 4px !important;
}

.ExPadLMd {
  padding-left: 6px !important;
}

.ExPadLLg {
  padding-left: 8px !important;
}

.ExPadLXl {
  padding-left: 10px !important;
}

.ExPadLXXl {
  padding-left: 12px !important;
}

.ExPadRNone {
  padding-right: 0 !important;
}

.ExPadRXs {
  padding-right: 2px !important;
}

.ExPadRSm {
  padding-right: 4px !important;
}

.ExPadRMd {
  padding-right: 6px !important;
}

.ExPadRLg {
  padding-right: 8px !important;
}

.ExPadRXl {
  padding-right: 10px !important;
}

.ExPadRXXl {
  padding-right: 12px !important;
}

.ExBdrWdtNone {
  border-width: 0 !important;
}

.ExBdrWdtLgh {
  border-width: 0.5px !important;
}

.ExBdrWdtNml {
  border-width: 1px !important;
}

.ExBdrWdtMdm {
  border-width: 2px !important;
}

.ExBdrWdtSbd {
  border-width: 3px !important;
}

.ExBdrWdtBld {
  border-width: 4px !important;
}

.ExBdrRadNone {
  border-radius: 0 !important;
}

.ExBdrRadXs {
  border-radius: 2px !important;
}

.ExBdrRadSm {
  border-radius: 4px !important;
}

.ExBdrRadMd {
  border-radius: 6px !important;
}

.ExBdrRadLg {
  border-radius: 8px !important;
}

.ExBdrRadXl {
  border-radius: 10px !important;
}

.ExBdrRadXXl {
  border-radius: 12px !important;
}

.ExAbs {
  position: absolute;
  margin: 0 !important;
  width: auto;
}

.ExTNone {
  top: 0;
}

.ExTXs {
  top: 2px;
}

.ExTSm {
  top: 4px;
}

.ExTMd {
  top: 6px;
}

.ExTLg {
  top: 8px;
}

.ExTXl {
  top: 10px;
}

.ExTXXl {
  top: 12px;
}

.ExBNone {
  bottom: 0;
}

.ExBXs {
  bottom: 2px;
}

.ExBSm {
  bottom: 4px;
}

.ExBMd {
  bottom: 6px;
}

.ExBLg {
  bottom: 8px;
}

.ExBXl {
  bottom: 10px;
}

.ExBXXl {
  bottom: 12px;
}

.ExLNone {
  left: 0;
}

.ExLXs {
  left: 2px;
}

.ExLSm {
  left: 4px;
}

.ExLMd {
  left: 6px;
}

.ExLLg {
  left: 8px;
}

.ExLXl {
  left: 10px;
}

.ExLXXl {
  left: 12px;
}

.ExRNone {
  right: 0;
}

.ExRXs {
  right: 2px;
}

.ExRSm {
  right: 4px;
}

.ExRMd {
  right: 6px;
}

.ExRLg {
  right: 8px;
}

.ExRXl {
  right: 10px;
}

.ExRXXl {
  right: 12px;
}

.ExWR {
  font-weight: normal !important;
}

.ExWR * {
  font-weight: inherit;
}

.ExWB {
  font-weight: bold !important;
}

.ExWB * {
  font-weight: inherit;
}

.ExFntStyNml {
  font-style: normal !important;
}

.ExFntStyNml * {
  font-style: inherit;
}

.ExFntStyIt {
  font-style: italic !important;
}

.ExFntStyIt * {
  font-style: inherit;
}

.ExTxtDecNone {
  text-decoration: none !important;
}

.ExTxtDecUl {
  text-decoration: underline !important;
}

.ExTxtDecLt {
  text-decoration: line-through !important;
}`});function zi(e,t){let o=ji(),i="";return t.type==="flex"&&((t=t.contents).type==="bubble"?(i=So(t),o=o.replace("<!-- inner -->",i)):t.type==="carousel"&&t.contents.forEach(((n,a)=>{let s=So(n);s=s.replace("<!-- content -->",""),s=s.replace("<!-- inner -->",""),o=o.replace("<!-- inner -->",s+"<!-- inner -->")}))),document.getElementById(e).innerHTML+=o,o}function So(e){let{hero:t,header:o,body:i,footer:n}=e,a=Yi(e),s=Ki(e),l=Ji(e),d=Qi(e),p=Gi(e),u="";if(t?.type==="video")u=Wi(t);else if(t?.type==="image")u=He("",t);else for(let m in t)t.hasOwnProperty(m)&&m==="type"&&t[m]==="box"&&(u=Yt(t),layout=t.layout,u=It(u,layout,t.contents));a=a.replace("<!-- inner -->",u),u="";for(let m in o)o.hasOwnProperty(m)&&m==="type"&&o[m]==="box"&&(u=Yt(o),layout=o.layout,u=It(u,layout,o.contents));s=s.replace("<!-- inner -->",u),u="";for(let m in i)i.hasOwnProperty(m)&&m==="type"&&i[m]==="box"&&(u=Yt(i),layout=i.layout,u=It(u,layout,i.contents));l=l.replace("<!-- inner -->",u),u="";for(let m in n)n.hasOwnProperty(m)&&m==="type"&&n[m]==="box"&&(u=Yt(n),layout=n.layout,u=It(u,layout,n.contents));return d=d.replace("<!-- inner -->",u),p=p.replace("<!-- hero -->",a),p=p.replace("<!-- header -->",s),p=p.replace("<!-- body -->",l),p=p.replace("<!-- footer -->",d),p}function Wi(e){return`<div class="ExCover MdImg ExFull"><div><video width="100%" poster="${e?.previewUrl}" controls>
   <source src="${e?.url}" type="video/mp4">
   <source src="${e?.url}" type="video/ogg">
   <source src="${e?.url}" type="video/webm">
</video></div></div>`}function It(e,t,o){let i=[];return o.forEach(((n,a)=>{let s;if(n.type==="box"){let l=Yt(n);layout2=n.layout,s=It(l,layout2,n.contents)}else if(n.type==="text"&&n.contents&&n.contents.length>0){let l=He(t,n);layout2=n.layout,s=It(l,layout2,n.contents)}else s=He(t,n);i[a]=s})),o.forEach(((n,a)=>{i[a]=i[a].replace("<!-- content -->",""),e=e.replace("<!-- content -->",i[a]+"<!-- content -->")})),e}function He(e,t){switch(t.type){case"image":object=Fi(t);break;case"icon":object=Hi(t);break;case"text":object=Zi(t);break;case"span":object=Vi(t);break;case"button":object=Ui(t);break;case"filler":object=Di(t);break;case"spacer":object=qi(t);break;case"separator":object=Xi(e,t);break;default:object=null}return object}function Yt(e){let t="",{layout:o,position:i,flex:n,spacing:a,margin:s,width:l,height:d,backgroundColor:p,borderColor:u,borderWidth:m,cornerRadius:g,justifyContent:f,alignItems:h,offsetTop:v,offsetBottom:T,offsetStart:E,offsetEnd:M,paddingAll:$,paddingTop:U,paddingBottom:Z,paddingStart:xt,paddingEnd:gt,background:P,maxWidth:_t,maxHeight:At}=e;if(o==="baseline"?(layout1="hr",layout2="bl"):o==="horizontal"?(layout1="hr",layout2=""):o==="vertical"&&(layout1="vr",layout2=""),fl="",n>3?t+=`-webkit-box-flex:${n};flex-grow:${n};`:fl=n>=0?`fl${n}`:"",exabs=i==="absolute"?"ExAbs":"",a&&a.indexOf("px")>=0?(spc="",t+=`gap:${a};`):spc=a?"spc"+w(a):"",s&&s.indexOf("px")>=0?(t+=`margin-top:${s};`,exmgn=""):exmgn=s?"ExMgnT"+w(s):"",l&&l!==""&&(t+=`width:${l}; max-width:${l};`),d&&d!==""&&(t+=`height:${d};`),p&&(t+=`background-color:${p} !important;`),u&&(t+=`border-color:${u} !important;`),m&&m.indexOf("px")>=0)t+=`border-width:${m};`,ExBdr="";else switch(m){case"none":ExBdr="ExBdrWdtNone";break;case"light":ExBdr="ExBdrWdtLgh";break;case"normal":ExBdr="ExBdrWdtNml";break;case"medium":ExBdr="ExBdrWdtMdm";break;case"semi-bold":ExBdr="ExBdrWdtSbd";break;case"bold":ExBdr="ExBdrWdtBld";break;default:ExBdr=""}if(g&&g.indexOf("px")>=0?(t+=`border-radius:${g};`,ExBdrRad=""):ExBdrRad=g?"ExBdrRad"+w(g):"",jfc="",f&&f!=="")switch(f){case"center":jfc="itms-jfcC";break;case"flex-start":jfc="itms-jfcS";break;case"flex-end":jfc="itms-jfcE";break;case"space-between":jfc="itms-jfcSB";break;case"space-around":jfc="itms-jfcSA";break;case"space-evenly":jfc="itms-jfcSE";break;default:jfc=""}if(alg="",h&&h!=="")switch(h){case"center":alg="itms-algC";break;case"flex-start":alg="itms-algS";break;case"flex-end":alg="itms-algE";break;default:alg=""}return v&&v.indexOf("px")>=0?(t+=`top:${v};`,ext=""):ext=v?"ExT"+w(v):"",T&&T.indexOf("px")>=0?(t+=`bottom:${T};`,exb=""):exb=T?"ExB"+w(T):"",E&&E.indexOf("px")>=0?(t+=`left:${E};`,exl=""):exl=E?"ExL"+w(E):"",M&&M.indexOf("px")>=0?(t+=`right:${M};`,exr=""):exr=M?"ExR"+w(M):"",$&&$.indexOf("px")>=0?(t+=`padding:${$};`,ExPadA=""):ExPadA=$?"ExPadA"+w($):"",U&&U.indexOf("px")>=0?(t+=`padding-top:${U};`,ExPadT=""):ExPadT=U?"ExPadT"+w(U):"",Z&&Z.indexOf("px")>=0?(t+=`padding-bottom:${Z};`,ExPadB=""):ExPadB=Z?"ExPadB"+w(Z):"",xt&&xt.indexOf("px")>=0?(t+=`padding-left:${xt};`,ExPadL=""):ExPadL=xt?"ExPadL"+w(xt):"",gt&&gt.indexOf("px")>=0?(t+=`padding-right:${gt};`,ExPadR=""):ExPadR=gt?"ExPadR"+w(gt):"",P&&P.type==="linearGradient"&&(centerPosition=P.centerPosition?P.centerPosition:"50%",P.centerColor?t+=`background: linear-gradient(${P.angle}, ${P.startColor} 0%, ${P.centerColor} ${centerPosition}, ${P.endColor} 100%);`:t+=`background: linear-gradient(${P.angle}, ${P.startColor} 0%, ${P.endColor} 100%);`),_t&&_t.indexOf("px")>=0&&(t+=`max-width:${_t};`),At&&At.indexOf("px")>=0&&(t+=`max-height:${At};`),`<div class="MdBx ${layout1} ${layout2} ${fl} ${exabs} ${exmgn} ${spc} ${ExBdr} ${ExBdrRad} ${jfc} ${alg} ${ext} ${exb} ${exl} ${exr} ${ExPadA} ${ExPadT} ${ExPadB} ${ExPadL} ${ExPadR}" style="${t}"><!-- content --></div>`}function Ui(e){style2="",style3="";let{flex:t,margin:o,position:i,height:n,style:a,color:s,gravity:l,adjustMode:d,offsetTop:p,offsetBottom:u,offsetStart:m,offsetEnd:g,action:f}=e;if(fl="",t>3?style2+=`-webkit-box-flex:${t};flex-grow:${t};`:fl=t>=0?`fl${t}`:"",exabs=i==="absolute"?"ExAbs":"",o&&o.indexOf("px")>=0?(style2+=`margin-top:${o};`,exmgn=""):exmgn=o?"ExMgnT"+w(o):"",n=n&&n!==""&&n!=="md"?"Ex"+w(n):"",grv=l==="bottom"||l==="center"?"grv"+Kt(l):"",ExBtn="ExBtnL",a&&a!=="")switch(a){case"link":default:ExBtn="ExBtnL";break;case"primary":ExBtn="ExBtn1";break;case"secondary":ExBtn="ExBtn2"}return s&&(style3+=a==="link"?`color:${s} !important;`:`background-color:${s} !important;`),p&&p.indexOf("px")>=0?(style2+=`top:${p};`,ext=""):ext=p?"ExT"+w(p):"",u&&u.indexOf("px")>=0?(style2+=`bottom:${u};`,exb=""):exb=u?"ExB"+w(u):"",m&&m.indexOf("px")>=0?(style2+=`left:${m};`,exl=""):exl=m?"ExL"+w(m):"",g&&g.indexOf("px")>=0?(style2+=`right:${g};`,exr=""):exr=g?"ExR"+w(g):"",f=f||{type:"none"},f.type==="uri"?`<div class="MdBtn ${ExBtn} ${n} ${fl} ${exabs} ${exmgn} ${grv} ${ext} ${exb} ${exl} ${exr}" style="${style2}" id="8d1efea2-4017-4c89-8931-98a5f4f141f2"><a href="${f.uri}" target="_blank" style="${style3}"><div>${f.label}</div></a></div>`:f.type==="message"?`<div class="MdBtn ${ExBtn} ${n} ${fl} ${exabs} ${exmgn} ${grv} ${ext} ${exb} ${exl} ${exr}" style="${style2}" id="8d1efea2-4017-4c89-8931-98a5f4f141f2"><a onclick="alert('message: ${f.text}')" style="${style3}"><div>${f.label}</div></a></div>`:f.type==="postback"?`<div class="MdBtn ${ExBtn} ${n} ${fl} ${exabs} ${exmgn} ${grv} ${ext} ${exb} ${exl} ${exr}" style="${style2}" id="8d1efea2-4017-4c89-8931-98a5f4f141f2"><a onclick="alert('postback data: ${f.data}')" style="${style3}"><div>${f.label}</div></a></div>`:`<div class="MdBtn ${ExBtn} ${n} ${fl} ${exabs} ${exmgn} ${grv} ${ext} ${exb} ${exl} ${exr}" style="${style2}" id="8d1efea2-4017-4c89-8931-98a5f4f141f2"><a style="${style3}"><div>${f.label}</div></a></div>`}function Di(e){let t="",{flex:o}=e;return fl="",o>3?t+=`-webkit-box-flex:${o};flex-grow:${o};`:fl=o>=0?`fl${o}`:"",`<div class="mdBxFiller ${fl}" style="${t}" ></div>`}function Hi(e){let t="",{size:o,aspectRatio:i,url:n,position:a,margin:s,offsetTop:l,offsetBottom:d,offsetStart:p,offsetEnd:u}=e,m=`background-image:url('${n}');`;return o=o&&o!==""?o:"md",o.indexOf("px")>=0?(t+=`font-size:${o};`,o=""):o="Ex"+w(o),i&&i!==""?(ratio=ratio[0]/ratio[1],m+=`width:${ratio}em;`):m+="width:1em;",exabs=a==="absolute"?"ExAbs":"",s&&s.indexOf("px")>=0?(t+=`margin-top:${s};`,exmgn=""):exmgn=s?"ExMgnT"+w(s):"",l&&l.indexOf("px")>=0?(t+=`top:${l};`,ext=""):ext=l?"ExT"+w(l):"",d&&d.indexOf("px")>=0?(t+=`bottom:${d};`,exb=""):exb=d?"ExB"+w(d):"",p&&p.indexOf("px")>=0?(t+=`left:${p};`,exl=""):exl=p?"ExL"+w(p):"",u&&u.indexOf("px")>=0?(t+=`right:${u};`,exr=""):exr=u?"ExR"+w(u):"",`<div class="MdIco fl0 ${o} ${exabs} ${exmgn} ${ext} ${exb} ${exl} ${exr}" style="${t}" ><div><span style="${m}"></span></div></div>`}function Fi(e){let t="",o="",{aspectMode:i,size:n,aspectRatio:a,url:s,position:l,flex:d,margin:p,align:u,gravity:m,backgroundColor:g,offsetTop:f,offsetBottom:h,offsetStart:v,offsetEnd:T,action:E}=e,M=`background-image:url('${s}');`;return g&&(M+=`background-color:${g} !important;`),i=i&&i!==""?i:"fit",n=n&&n!==""?n:"md",i=w(i),n.indexOf("px")>=0||n.indexOf("%")>=0?(o+=`width:${n};`,n=""):n="Ex"+w(n),a&&a!==""?(ratio=a.split(":"),ratio=100*ratio[1]/ratio[0]):ratio="100",fl="",d>3?t+=`-webkit-box-flex:${d};flex-grow:${d};`:fl=d>=0?`fl${d}`:"",exabs=l==="absolute"?"ExAbs":"",p&&p.indexOf("px")>=0?(t+=`margin-top:${p};`,exmgn=""):exmgn=p?"ExMgnT"+w(p):"",alg=u==="start"||u==="end"?"alg"+Kt(u):"",grv=m==="bottom"||m==="center"?"grv"+Kt(m):"",f&&f.indexOf("px")>=0?(t+=`top:${f};`,ext=""):ext=f?"ExT"+w(f):"",h&&h.indexOf("px")>=0?(t+=`bottom:${h};`,exb=""):exb=h?"ExB"+w(h):"",v&&v.indexOf("px")>=0?(t+=`left:${v};`,exl=""):exl=v?"ExL"+w(v):"",T&&T.indexOf("px")>=0?(t+=`right:${T};`,exr=""):exr=T?"ExR"+w(T):"",E=E||{type:"none"},E.type==="uri"?`<div class="MdImg Ex${i} ${fl} ${n} ${exabs} ${exmgn} ${alg} ${grv} ${ext} ${exb} ${exl} ${exr}"  style="${t}">
                  <div style="${o}">
                     <a href="${E.uri}" target="_blank" style="padding-bottom:${ratio}%;">
                        <span style="${M}"></span>
                     </a>
                  </div>
               </div>`:E.type==="message"?`<div class="MdImg Ex${i} ${fl} ${n} ${exabs} ${exmgn} ${alg} ${grv} ${ext} ${exb} ${exl} ${exr}"  style="${t}">
                  <div style="${o}">
                     <a onclick="alert('message: ${E.text}')" style="padding-bottom:${ratio}%;">
                        <span style="${M}"></span>
                     </a>
                  </div>
               </div>`:E.type==="postback"?`<div class="MdImg Ex${i} ${fl} ${n} ${exabs} ${exmgn} ${alg} ${grv} ${ext} ${exb} ${exl} ${exr}"  style="${t}">
                  <div style="${o}">
                     <a onclick="alert('postback data: ${E.data}')" style="padding-bottom:${ratio}%;">
                        <span style="${M}"></span>
                     </a>
                  </div>
               </div>`:`<div class="MdImg Ex${i} ${fl} ${n} ${exabs} ${exmgn} ${alg} ${grv} ${ext} ${exb} ${exl} ${exr}"  style="${t}">
                  <div style="${o}">
                     <a style="padding-bottom:${ratio}%;">
                        <span style="${M}"></span>
                     </a>
                  </div>
               </div>`}function Xi(e,t){let o="",{margin:i,color:n}=t;return i&&i.indexOf("px")>=0?(o+=e==="vertical"?`margin-top:${i};`:`margin-left:${i};`,exmgn=""):exmgn=i?"ExMgnT"+w(i):"",n&&(o+=`border-color:${n} !important;`),`<div class="fl0 MdSep ${exmgn}" style="${o}" ></div>`}function qi(e){let{size:t}=e;return t=t&&t!==""?t:"md",t=t.indexOf("px")>=0?"":"spc"+w(t),`<div class="mdBxSpacer ${t} fl0" ></div>`}function Vi(e){let t="",{text:o,size:i,color:n,weight:a,style:s,decoration:l}=e;return i&&i!==""?i.indexOf("px")>=0?(t+=`font-size:${i};`,i=""):i="Ex"+w(i):i="",n&&n!==""&&(t+=`color:${n};`),ExWB=a==="bold"?"ExWB":"",ExFntSty=s==="normal"?"ExFntStyNml":s==="italic"?"ExFntStyIt":"",ExTxtDec=l==="line-through"?"ExTxtDecLt":l==="underline"?"ExTxtDecUl":l==="none"?"ExTxtDecNone":"",`<span class="MdSpn ${ExWB} ${i} ${ExFntSty} ${ExTxtDec}" style="${t}" >${o}</span>`}function ji(){return'<div class="LySlider"><div class="lyInner"><!-- inner --></div></div><br>'}function Gi(e){let{size:t,direction:o,action:i}=e;return t=t&&t!==""?t:"medium",o=o&&o!=""?o:"ltr",t=tn(t),`<div class="lyItem Ly${t}"><div class="T1 fx${o.toUpperCase()}" dir="${o}"><!-- header --><!-- hero --><!-- body --><!-- footer --></div></div>`}function Yi(e){let{styles:t}=e,o="";if(t){let{hero:i}=t;o=i&&i.backgroundColor?`background-color:${i.backgroundColor}`:""}return`<div class="t1Hero" style="${o}"><!-- inner --></div>`}function Ki(e){let{styles:t}=e,o="";if(t){let{header:i}=t;o=i&&i.backgroundColor?`background-color:${i.backgroundColor}`:""}return`<div class="t1Header" style="${o}"><!-- inner --></div>`}function Ji(e){let{footer:t,styles:o}=e,i="";if(o){let{body:n}=o;i=n&&n.backgroundColor?`background-color:${n.backgroundColor}`:""}return`<div class="t1Body ${t?"ExHasFooter":""}" style="${i}"><!-- inner --></div>`}function Qi(e){let{styles:t}=e,o="";if(t){let{footer:i}=t;o=i&&i.backgroundColor?`background-color:${i.backgroundColor}`:""}return`<div class="t1Footer" style="${o}"><!-- inner --></div>`}function Zi(e){let t="",{flex:o,margin:i,size:n,position:a,align:s,gravity:l,text:d,color:p,weight:u,style:m,decoration:g,wrap:f,maxLines:h,adjustMode:v,offsetTop:T,offsetBottom:E,offsetStart:M,offsetEnd:$,lineSpacing:U}=e;return fl="",o>3?t+=`-webkit-box-flex:${o};flex-grow:${o};`:fl=o>=0?`fl${o}`:"",exabs=a==="absolute"?"ExAbs":"",i&&i.indexOf("px")>=0?(t+=`margin-top:${i};`,exmgn=""):exmgn=i?"ExMgnL"+w(i):"",alg=s==="start"||s==="end"||s==="center"?"ExAlg"+Kt(s):"",grv=l==="bottom"||l==="center"?"grv"+Kt(l):"",n=n&&n!==""?n:"md",n.indexOf("px")>=0?(t+=`font-size:${n};`,n=""):n="Ex"+w(n),p&&p!==""&&(t+=`color:${p};`),ExWB=u==="bold"?"ExWB":"",ExFntSty=m==="normal"?"ExFntStyNml":m==="italic"?"ExFntStyIt":"",ExTxtDec=g==="line-through"?"ExTxtDecLt":g==="underline"?"ExTxtDecUl":g==="none"?"ExTxtDecNone":"",ExWrap=f===!0?"ExWrap":"",T&&T.indexOf("px")>=0?(t+=`top:${T};`,ext=""):ext=T?"ExT"+w(T):"",E&&E.indexOf("px")>=0?(t+=`bottom:${E};`,exb=""):exb=E?"ExB"+w(E):"",M&&M.indexOf("px")>=0?(t+=`left:${M};`,exl=""):exl=M?"ExL"+w(M):"",$&&$.indexOf("px")>=0?(t+=`right:${$};`,exr=""):exr=$?"ExR"+w($):"",U&&U.indexOf("px")>=0&&(t+=`line-height:${parseInt(U.replace("px",""))+15+"px"};`),d=d||"",`<div class="MdTxt ${fl} ${exabs} ${exmgn} ${alg} ${grv} ${n} ${ExWB} ${ExFntSty} ${ExTxtDec} ${ExWrap} ${ext} ${exb} ${exl} ${exr}" style="${t}"><p>${d}<!-- content --></p></div>`}function Kt(e){return e.charAt(0).toUpperCase()}function tn(e){return e.charAt(0).toUpperCase()+e.substring(1,2)}function w(e){return e.charAt(0).toUpperCase()+e.slice(1)}var Co=D(()=>{window.flex2html=zi});var Bo={};eo(Bo,{clearChatHistory:()=>ce,disconnectAbly:()=>Vt,getBotnoiFunctions:()=>en,loadAblyAndInitBotnoi:()=>on,sendMessage:()=>it,showBotnoiSetup:()=>re});function en(){return{sendMessage:it,clearChatHistory:ce,disconnectAbly:Vt}}function on(){var e=1;function t(){e--,e<=0&&nn()}if(window.Ably)t();else{var o=document.createElement("script");o.src="https://cdn.ably.com/lib/ably.min-1.js",o.onload=t,o.onerror=function(){r.inputEl.placeholder="Failed to load messaging library."},document.head.appendChild(o)}if(!window.flex2html&&!document.getElementById("bcw-flex2html-css")){var i=document.createElement("style");i.id="bcw-flex2html-css",i.textContent=Mo,document.head.appendChild(i)}if(b.AVATAR_ENABLED&&!window.WebAvatar){e++;var n=document.createElement("script");n.src=b.AVATAR_WIDGET_SRC,n.onload=t,n.onerror=function(){console.warn("[BotnoiChatWidget] Failed to load avatar widget."),t()},document.head.appendChild(n)}}async function nn(){if(c.initialized)try{let t=await po(x.WORKER_URL,x.BOT_ID);if(!c.initialized)return;if(!t.success){r.inputEl.placeholder="Bot connection failed.",N("offline","Offline"),Me("Error: The requested Bot ID does not exist or cannot be authorized.");return}let o=b.getAttribute("data-title");if(o&&o.trim()!==""?r.headerTitle.textContent=o:t.bot_name&&(r.headerTitle.textContent=t.bot_name),t.bot_avatar&&(r.headerAvatar.src=t.bot_avatar,r.headerAvatar.classList.add("bcw-show")),window._bcwAblyInstances=window._bcwAblyInstances||[],x.ably=new window.Ably.Realtime({authUrl:`${x.WORKER_URL}/api/auth`}),c.ably=x.ably,window._bcwAblyInstances.push(x.ably),x.ably.connection.on(function(i){switch(i.current){case"connected":N("online","Online");break;case"disconnected":case"suspended":N("offline","Disconnected");break;case"closed":case"failed":N("offline","Offline");break;case"connecting":N("","Connecting\u2026");break}}),wo(),b.MODE==="avatar"?an():yo(),b.AVATAR_ENABLED&&window.WebAvatar){var e=window.innerWidth<=440;window.WebAvatar.init({modelUrl:x.AVATAR_MODEL,defaultAnimationUrl:"Idleloop",cameraTarget:{x:0,y:0,z:-2},offset:{x:e?50:360,y:90}}),rn()}r.inputEl.disabled=!1,r.sendBtn.disabled=!1,r.inputEl.placeholder="Type a message\u2026",b.AUTO_FOCUS_INPUT&&r.inputEl.focus(),pe(async(i,n)=>{if(i)r.inputEl.disabled=!0,r.sendBtn.disabled=!0;else{if(n&&n.error){r.inputEl.placeholder="Type a message\u2026",r.inputEl.disabled=!1,r.sendBtn.disabled=!1;return}if(r.inputEl.placeholder="Recognizing...",n&&n.blob)try{let a=await vo(c.userId),s=await fo(n.blob),l=await xo(s,x.BOT_ID,a);l&&l.text&&it(l.text)}catch(a){console.error("[BotnoiChatWidget] ASR Error:",a),Me("Voice recognition failed.")}r.inputEl.placeholder="Type a message\u2026",r.inputEl.disabled=!1,r.sendBtn.disabled=!1,b.AUTO_FOCUS_INPUT&&r.inputEl.focus()}})}catch(t){r.inputEl.placeholder="Network error occurred.",N("offline","Offline"),console.error("[BotnoiChatWidget]",t)}}function an(){var e=c.chatHistory;if(!(!e||e.length===0))for(var t={quick_reply:!0,carousel:!0,flex:!0},o=e.length-1;o>=0;o--){var i=e[o];if(i.sender==="user")return;if(i.sender==="bot"&&i.reply&&t[i.reply.type]){We(i.reply,!1);return}}}function rn(){var e=!1;function t(){e||(e=!0,c.avatarReady=!0,c.isOpen&&Mt())}function o(){window.removeEventListener("avatar-widget-ready",o),t()}c.avatarListener=o,window.addEventListener("avatar-widget-ready",o);var i=0;c.avatarPoll=setInterval(function(){i++;var n=document.getElementById("avatar-widget-container");if(n){var a=n.querySelector("canvas");a&&a.width>0&&(setTimeout(function(){c.avatarPoll&&clearInterval(c.avatarPoll),t()},500),c.avatarPoll&&clearInterval(c.avatarPoll))}i>=150&&(c.avatarPoll&&clearInterval(c.avatarPoll),t())},200)}var Lo=D(()=>{H();F();Xt();Re();Ue();se();be();Ao();Co();Ue();se()});var Io=`
    #botnoi-chat-widget {
      --bcw-primary: #a7e6ff;
      --bcw-primary-text: #272525;
      --bcw-secondary: #555;
      --bcw-secondary-text: #fff;
      --bcw-title-text: #333;
      --bcw-primary-subtitle-text: #666;
      --bcw-status-text: #999;
      --bcw-bg: #eee;
      --bcw-surface: #fff;
      --bcw-border: #e0e0e0;
      --bcw-danger: #dc3545;
      --bcw-header-bg: #a7e6ff;
      --bcw-header-text: #272525;
      --bcw-chat-area-bg: #e3f7ffff;
      --bcw-input-text: #1a1a1a;
      --bcw-disabled-bg: #e6e6e6;
      --bcw-disabled-btn: #c7c7c7;
      --bcw-scroll-thumb: #bfbfbf;
      --bcw-muted-text: #999;
      --bcw-fab-text: #272525;
      --bcw-input-area-bg: #a7e6ff;
      --bcw-input-area-text: #333;
      --bcw-input-area-icon: #333;
      --bcw-send-btn-bg: transparent;
      --bcw-send-btn-text: #333;
      --bcw-input-field-bg: #fff;
      --bcw-input-field-border: #8b8b8bff;
      --bcw-font: 'Segoe UI', system-ui, -apple-system, sans-serif;
      --bcw-fab-size: 56px;
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 2147483646;
      font-family: var(--bcw-font);
      font-size: 14px;
      line-height: 1.4;
      box-sizing: border-box;
    }
    #botnoi-chat-widget *,
    #botnoi-chat-widget *::before,
    #botnoi-chat-widget *::after {
      box-sizing: border-box;
    }

    #bcw-fab {
      width: var(--bcw-fab-size);
      height: var(--bcw-fab-size);
      border-radius: 50%;
      background: var(--bcw-primary);
      color: var(--bcw-fab-text);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.18);
      transition: transform 0.25s cubic-bezier(.4,0,.2,1), box-shadow 0.25s ease, opacity 0.25s ease;
      position: absolute;
      bottom: 0;
      right: 0;
      z-index: 2;
      margin: 0;
      padding: 0;
    }
    #bcw-fab:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 20px rgba(0,0,0,0.22);
    }
    #bcw-fab.bcw-hidden {
      opacity: 0;
      pointer-events: none;
      transform: scale(0.5);
    }
    #bcw-fab svg {
      width: 26px;
      height: 26px;
      fill: currentColor;
    }

    #bcw-panel {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 380px;
      height: 600px;
      max-height: calc(100vh - 40px);
      background: var(--bcw-surface);
      border: 1px solid var(--bcw-border);
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
      transform-origin: bottom right;
      transform: scale(0.85) translateY(20px);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.4s cubic-bezier(.34,1.56,.64,1), opacity 0.3s ease;
    }
    #bcw-panel.bcw-visible {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    #bcw-header {
      display: flex;
      align-items: center;
      padding: 12px 14px;
      margin: 0;
      background: var(--bcw-header-bg);
      border-bottom: 1px solid var(--bcw-border);
      flex-shrink: 0;
      gap: 10px;
    }
    #bcw-header-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
      display: none;
      margin: 0;
      padding: 0;
    }
    #bcw-header-avatar.bcw-show { display: block; }
    #bcw-header-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin: 0;
      padding: 0;
    }
    #bcw-header-title {
      font-weight: 700;
      font-size: 15px;
      color: var(--bcw-header-text);
      margin: 0;
      padding: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #bcw-header-status {
      display: flex;
      align-items: center;
      gap: 5px;
      margin: 0;
      padding: 0;
      font-size: 11px;
      color: var(--bcw-header-text);
      opacity: 0.7;
    }
    #botnoi-chat-widget .bcw-status-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #999;
      flex-shrink: 0;
      margin: 0;
      padding: 0;
      transition: background 0.3s;
      border: 1.5px solid #fff;
    }
    #botnoi-chat-widget .bcw-status-dot.bcw-online { background: #22c55e; }
    #botnoi-chat-widget .bcw-status-dot.bcw-offline { background: #ef4444; }
    #bcw-status-text {
      margin: 0;
      padding: 0;
    }
    #bcw-clear-btn, #bcw-clear-btn-avatar {
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      margin: 0;
      border-radius: 6px;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    #bcw-clear-btn:hover, #bcw-clear-btn-avatar:hover { background: rgba(220,53,69,0.12); }
    #bcw-clear-btn svg, #bcw-clear-btn-avatar svg { width: 16px; height: 16px; fill: var(--bcw-header-text); }
    #bcw-clear-btn:hover svg, #bcw-clear-btn-avatar:hover svg { fill: var(--bcw-danger); }

    #bcw-volume-group, #bcw-volume-group-avatar {
      display: flex;
      align-items: center;
      position: relative;
      flex-shrink: 0;
    }
    #bcw-volume-btn, #bcw-volume-btn-avatar {
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      margin: 0;
      border-radius: 6px;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    #bcw-volume-btn:hover, #bcw-volume-btn-avatar:hover { background: rgba(0,0,0,0.08); }
    #bcw-volume-btn svg, #bcw-volume-btn-avatar svg { width: 16px; height: 16px; fill: var(--bcw-header-text); }
    #bcw-volume-slider-wrap, #bcw-volume-slider-wrap-avatar {
      overflow: hidden;
      width: 0;
      transition: width 0.25s ease;
      display: flex;
      align-items: center;
    }
    #bcw-volume-group:hover #bcw-volume-slider-wrap,
    #bcw-volume-slider-wrap.bcw-pinned,
    #bcw-volume-group-avatar:hover #bcw-volume-slider-wrap-avatar,
    #bcw-volume-slider-wrap-avatar.bcw-pinned {
      width: 80px;
    }
    #bcw-volume-slider, #bcw-volume-slider-avatar {
      -webkit-appearance: none;
      appearance: none;
      width: 72px;
      height: 20px;
      background: transparent;
      outline: none;
      margin: 0 4px;
      cursor: pointer;
    }
    #bcw-volume-slider::-webkit-slider-runnable-track, #bcw-volume-slider-avatar::-webkit-slider-runnable-track {
      height: 4px;
      border-radius: 2px;
      background: var(--bcw-header-text);
      opacity: 0.3;
    }
    #bcw-volume-slider::-moz-range-track, #bcw-volume-slider-avatar::-moz-range-track {
      height: 4px;
      border-radius: 2px;
      background: var(--bcw-header-text);
      opacity: 0.3;
    }
    #bcw-volume-slider::-webkit-slider-thumb, #bcw-volume-slider-avatar::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--bcw-header-text);
      cursor: pointer;
      margin-top: -4px;
    }
    #bcw-volume-slider::-moz-range-thumb, #bcw-volume-slider-avatar::-moz-range-thumb {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--bcw-header-text);
      cursor: pointer;
      border: none;
    }

    #bcw-setup-form {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;
      flex: 1;
      padding: 28px 24px;
      gap: 16px;
      box-sizing: border-box;
      overflow: visible;
      background: var(--bcw-bg);
    }
    #bcw-setup-form .bcw-setup-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--bcw-title-text);
      text-align: center;
    }
    #bcw-setup-form .bcw-setup-desc {
      font-size: 12px;
      color: var(--bcw-title-text);
      text-align: center;
      line-height: 1.4;
    }
    #bcw-setup-form > label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
      font-size: 12px;
      font-weight: 600;
      color: var(--bcw-title-text);
    }
    #bcw-setup-form input[type="text"] {
      width: 100%;
      padding: 10px 12px;
      border: 1.5px solid var(--bcw-border);
      border-radius: 10px;
      font-size: 13px;
      font-family: inherit;
      background: var(--bcw-surface);
      color: var(--bcw-title-text);
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    #bcw-setup-form input[type="text"]:focus {
      border-color: var(--bcw-primary);
    }
    #bcw-setup-form .bcw-setup-submit {
      width: 100%;
      padding: 11px;
      border: none;
      border-radius: 12px;
      background: var(--bcw-primary);
      color: var(--bcw-primary-text);
      font-size: 14px;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      transition: opacity 0.2s;
      margin-top: 4px;
    }
    #bcw-setup-form .bcw-setup-submit:hover { opacity: 0.85; }
    #bcw-setup-form .bcw-setup-error {
      color: var(--bcw-danger);
      font-size: 12px;
      margin: 0;
      min-height: 16px;
    }
    .bcw-toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      box-sizing: border-box;
    }
    .bcw-toggle-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--bcw-title-text);
    }
    .bcw-toggle-wrap {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: var(--bcw-muted-text);
      flex-shrink: 0;
    }
    .bcw-toggle-wrap .bcw-active { color: var(--bcw-title-text); }
    .bcw-toggle {
      position: relative;
      width: 40px;
      height: 22px;
      flex-shrink: 0;
    }
    .bcw-toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .bcw-toggle-track {
      position: absolute;
      inset: 0;
      background: var(--bcw-primary);
      border-radius: 11px;
      cursor: pointer;
      transition: background 0.25s;
    }
    .bcw-toggle-track::after {
      content: '';
      position: absolute;
      left: 2px;
      top: 2px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #fff;
      transition: transform 0.25s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.15);
    }
    .bcw-toggle input:checked + .bcw-toggle-track {
      background: var(--bcw-primary);
    }
    .bcw-toggle input:checked + .bcw-toggle-track::after {
      transform: translateX(18px);
    }
    #bcw-messages-outer {
      flex: 1;
      overflow: hidden;
      background: var(--bcw-bg);
      min-height: 0;
    }
    #bcw-messages {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      padding: 16px;
      box-sizing: border-box;
      background: var(--bcw-chat-area-bg);
      display: flex;
      flex-direction: column;
      scroll-behavior: smooth;
      overscroll-behavior-y: none;
    }
    #bcw-messages::-webkit-scrollbar { width: 4px; }
    #bcw-messages::-webkit-scrollbar-track { background: transparent; }
    #bcw-messages::-webkit-scrollbar-thumb {
      background: rgba(0,0,0,0);
      border-radius: 10px;
      transition: background 0.3s;
    }
    #bcw-messages.bcw-scrolling::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); }

    #botnoi-chat-widget .bcw-msg {
      margin: 0 0 10px 0;
      padding: 5px 10px;
      border-radius: 18px;
      max-width: 80%;
      word-wrap: break-word;
      font-size: 14px;
      line-height: 1.45;
      list-style: none;
      opacity: 0;
      transform: translateY(8px) scale(0.97);
      transition: opacity 0.45s cubic-bezier(.22,.61,.36,1),
                  transform 0.55s cubic-bezier(.34,1.4,.64,1);
    }
    #botnoi-chat-widget .bcw-msg.bcw-animate-in {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    #botnoi-chat-widget .bcw-user-msg {
      background: var(--bcw-secondary);
      color: var(--bcw-secondary-text);
      margin-left: auto;
      margin-right: 0;
      border-bottom-right-radius: 4px;
      transform: translateX(14px) scale(0.97);
    }
    #botnoi-chat-widget .bcw-user-msg.bcw-animate-in {
      transform: translateX(0) scale(1);
    }
    #botnoi-chat-widget .bcw-bot-msg {
      background: var(--bcw-primary);
      color: var(--bcw-primary-text);
      margin-right: auto;
      margin-left: 0;
      border-bottom-left-radius: 4px;
      transform: translateX(-14px) scale(0.97);
      position: relative;
    }
    #botnoi-chat-widget .bcw-bot-msg.bcw-animate-in {
      transform: translateX(0) scale(1);
    }

    #botnoi-chat-widget .bcw-replay-btn {
      position: absolute;
      bottom: 0px;
      right: -20px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--bcw-surface);
      border: 1px solid var(--bcw-border);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s, background 0.2s;
      padding: 0;
      box-shadow: 0 1px 4px rgba(0,0,0,0.10);
      z-index: 1;
    }
    #botnoi-chat-widget .bcw-bot-msg:hover .bcw-replay-btn,
    #botnoi-chat-widget .bcw-bot-msg.bcw-replay-hover .bcw-replay-btn,
    #botnoi-chat-widget .bcw-bot-msg.bcw-row-hover .bcw-replay-btn {
      opacity: 1;
      pointer-events: auto;
    }
    #botnoi-chat-widget .bcw-replay-btn:hover {
      background: var(--bcw-primary);
    }
    #botnoi-chat-widget .bcw-replay-btn svg {
      width: 10px;
      height: 10px;
      fill: var(--bcw-title-text);
      flex-shrink: 0;
    }
    @keyframes bcw-shrinkOut {
      0%   { opacity: 1; max-height: 200px; margin-bottom: 10px; padding-top: 5px; padding-bottom: 5px; transform: scale(1); }
      30%  { opacity: 0.6; }
      100% { opacity: 0; max-height: 0;   margin-bottom: 0;   padding-top: 0;   padding-bottom: 0;   transform: scale(0.92); }
    }
    .bcw-msg.bcw-removing,
    .bcw-error-msg.bcw-removing,
    .bcw-warning-msg.bcw-removing {
      overflow: hidden;
      animation: bcw-shrinkOut 0.45s cubic-bezier(.4,0,.2,1) forwards;
      pointer-events: none;
    }
    #botnoi-chat-widget .bcw-msg img,
    #botnoi-chat-widget .bcw-msg video {
      max-width: 100%;
      border-radius: 8px;
      margin-top: 5px;
      outline: none;
      padding: 0;
    }
    #botnoi-chat-widget .bcw-msg audio {
      max-width: 100%;
      margin-top: 5px;
      padding: 0;
    }
    #botnoi-chat-widget .bcw-msg a {
      color: inherit;
      text-decoration: underline;
      font-weight: 600;
    }

    @keyframes bcw-fadeIn {
      from { opacity: 0; transform: translateY(8px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    #botnoi-chat-widget .bcw-quick-replies {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 0 0 10px 0;
      padding: 0;
      justify-content: flex-start;
      flex-shrink: 0;
      list-style: none;
    }
    .bcw-mode-avatar #botnoi-chat-widget .bcw-quick-replies {
      justify-content: center;
    }
    #botnoi-chat-widget .bcw-quick-reply-btn {
      padding: 8px 14px;
      margin: 0;
      background: var(--bcw-primary);
      border: 1.5px solid var(--bcw-secondary);
      color: var(--bcw-primary-text);
      border-radius: 20px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      font-family: var(--bcw-font);
      opacity: 0;
      transform: translateY(6px) scale(0.95);
      transition: background 0.2s, color 0.2s,
                  opacity 0.25s ease var(--bcw-btn-delay, 0ms),
                  transform 0.3s cubic-bezier(.34,1.4,.64,1) var(--bcw-btn-delay, 0ms);
    }
    #botnoi-chat-widget .bcw-quick-reply-btn.bcw-animate-in {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    #botnoi-chat-widget .bcw-quick-reply-btn:hover {
      background: var(--bcw-primary-text);
      color: var(--bcw-primary);
    }

    #botnoi-chat-widget .bcw-carousel-container {
      display: flex;
      overflow-x: auto;
      gap: 10px;
      padding: 4px 0 10px 0;
      margin: 0 0 10px 0;
      scroll-snap-type: x mandatory;
      flex-shrink: 0;
    }
    #botnoi-chat-widget .bcw-carousel-container::-webkit-scrollbar { height: 5px; }
    #botnoi-chat-widget .bcw-carousel-container::-webkit-scrollbar-thumb { background: var(--bcw-scroll-thumb); border-radius: 10px; }
    #botnoi-chat-widget .bcw-carousel-card {
      min-width: 210px;
      max-width: 230px;
      border: 1px solid var(--bcw-primary);
      border-radius: 10px;
      overflow: hidden;
      background: var(--bcw-primary);
      flex-shrink: 0;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
      scroll-snap-align: start;
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 0;
    }
    #botnoi-chat-widget .bcw-carousel-img {
      width: 100%;
      height: 120px;
      object-fit: cover;
      margin: 0;
      padding: 0;
    }
    #botnoi-chat-widget .bcw-carousel-body {
      padding: 10px;
      margin: 0;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    #botnoi-chat-widget .bcw-carousel-title {
      font-weight: 700;
      font-size: 14px;
      margin: 0 0 4px 0;
      padding: 0;
      color: var(--bcw-primary-text);
    }
    #botnoi-chat-widget .bcw-carousel-subtitle {
      font-size: 12px;
      color: var(--bcw-primary-subtitle-text);
      margin: 0 0 10px 0;
      padding: 0;
      flex: 1;
    }
    #botnoi-chat-widget .bcw-carousel-btn {
      display: block;
      width: 100%;
      padding: 7px;
      margin: 5px 0 0 0;
      text-align: center;
      border: 1.5px solid var(--bcw-secondary);
      background: var(--bcw-primary);
      color: var(--bcw-primary-text);
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: background 0.2s;
      font-family: var(--bcw-font);
    }
    #botnoi-chat-widget .bcw-carousel-btn:hover { background: var(--bcw-primary-text); color: var(--bcw-primary); }

    #bcw-input-area {
      display: flex;
      align-items: center;
      border-top: 1px solid var(--bcw-border);
      padding: 10px 12px;
      margin: 0;
      background: var(--bcw-input-area-bg);
      flex-shrink: 0;
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
      will-change: transform;
    }
    #bcw-input {
      flex: 1;
      padding: 10px 14px;
      margin: 0;
      border: 1px solid var(--bcw-input-field-border);
      border-radius: 24px;
      outline: none;
      font-family: var(--bcw-font);
      font-size: 14px;
      transition: border-color 0.2s;
      background: var(--bcw-input-field-bg);
      color: var(--bcw-input-text);
    }
    #bcw-input:focus { border-color: var(--bcw-primary); }
    #bcw-input:disabled { background: var(--bcw-disabled-bg); cursor: not-allowed; }
    #bcw-send-btn {
      margin: 0 0 0 8px;
      padding: 9px 16px;
      background: var(--bcw-send-btn-bg);
      font-weight: 700;
      color: var(--bcw-send-btn-text);
      border: 1.5px solid var(--bcw-input-field-border);
      border-radius: 24px;
      cursor: pointer;
      transition: opacity 0.2s, background 0.15s, border-color 0.15s;
      font-family: var(--bcw-font);
      font-size: 14px;
      white-space: nowrap;
    }
    #bcw-send-btn:hover { background: rgba(0,0,0,0.06); border-color: var(--bcw-primary); }
    #bcw-send-btn:disabled { background: var(--bcw-disabled-btn); border-color: var(--bcw-disabled-btn); cursor: not-allowed; opacity: 0.7; }

    #bcw-collapse-btn {
      margin: 0 0 0 6px;
      padding: 0;
      width: 36px;
      height: 36px;
      background: transparent;
      border: 1.5px solid var(--bcw-input-field-border);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, border-color 0.2s;
      flex-shrink: 0;
    }
    #bcw-collapse-btn:hover {
      background: rgba(0,0,0,0.06);
      border-color: var(--bcw-primary);
    }
    #bcw-collapse-btn svg {
      width: 16px;
      height: 16px;
      fill: var(--bcw-input-area-icon);
    }

    #avatar-widget-container {
      z-index: 2147483647 !important;
      opacity: 0 !important;
      transform: scale(0.8) !important;
      transform-origin: 150% 90%;
      transition: opacity 0.35s ease, transform 0.5s cubic-bezier(.4,0,.2,1);
      pointer-events: none;
    }
    #avatar-widget-container.bcw-avatar-visible {
      opacity: 1 !important;
      transform: scale(1) !important;
    }

    @media (max-width: 440px) {
      #bcw-panel {
        width: calc(100vw - 24px);
        right: -8px;
        bottom: 0;
        height: 75vh;
        border-radius: 14px;
      }
      #avatar-widget-container {
        transform-origin: 100% 90%;
      }
      #avatar-widget-container.bcw-avatar-visible {
        opacity: 0.7 !important;
      }
    }

    @keyframes bcw-fadeOut {
      0%   { opacity: 1; transform: translateY(0); }
      70%  { opacity: 1; }
      100% { opacity: 0; transform: translateY(-6px); }
    }
    .bcw-error-msg,
    .bcw-warning-msg {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin: 0 0 10px 0;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      line-height: 1.4;
      max-width: 92%;
      word-wrap: break-word;
      align-self: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.10);
      animation: bcw-fadeIn 0.25s ease;
    }
    .bcw-error-msg {
      background: #fff0f0;
      border: 1.5px solid #f87171;
      color: #b91c1c;
    }
    .bcw-error-msg::before {
      content: '\u26A0';
      font-size: 15px;
      flex-shrink: 0;
      line-height: 1.35;
    }
    .bcw-warning-msg {
      background: #fffbea;
      border: 1.5px solid #fbbf24;
      color: #92400e;
    }
    .bcw-warning-msg::before {
      content: '\u26A0';
      font-size: 15px;
      flex-shrink: 0;
      line-height: 1.35;
    }
    .bcw-warning-msg.bcw-fading {
      animation: bcw-fadeOut 1s ease forwards;
    }

    #botnoi-chat-widget .bcw-flex-msg.chatbox,
    #botnoi-chat-widget .bcw-flex-msg.chatbox * {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      user-select: text !important;
    }
    #botnoi-chat-widget .bcw-flex-msg.chatbox {
      display: block !important;
      width: auto !important;
      max-width: 100% !important;
      background-color: transparent !important;
      padding: 0 !important;
      flex: none !important;
      margin: 0 0 10px 0;
      opacity: 0;
      transform: translateX(-14px) scale(0.97);
      transition: opacity 0.45s cubic-bezier(.22,.61,.36,1),
                  transform 0.55s cubic-bezier(.34,1.4,.64,1);
    }
    #botnoi-chat-widget .bcw-flex-msg.bcw-animate-in {
      opacity: 1;
      transform: translateX(0) scale(1);
    }

    #botnoi-chat-widget .bcw-flex-msg .LySlider {
      display: block;
      overflow-x: auto;
      overflow-y: visible;
    }
    #botnoi-chat-widget .bcw-flex-msg .LySlider .lyInner {
      display: flex;
      flex-direction: row;
      width: 100%;
    }

    #botnoi-chat-widget .bcw-flex-msg .LySlider .lyItem {
      flex: none;
      width: 80%;
      max-width: 300px;
    }
    #botnoi-chat-widget .bcw-flex-msg .LySlider .lyItem.LyGi { max-width: 480px; }
    #botnoi-chat-widget .bcw-flex-msg .LySlider .lyItem.LyMe { max-width: 300px; }

    #botnoi-chat-widget .bcw-flex-msg .T1 {
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden;
    }

    #botnoi-chat-widget .bcw-flex-msg .T1 .t1Header,
    #botnoi-chat-widget .bcw-flex-msg .T1 .t1Hero {
      display: flex !important;
      flex-direction: column !important;
      flex: none !important;
    }
    #botnoi-chat-widget .bcw-flex-msg .T1 .t1Body {
      display: flex !important;
      flex-direction: column !important;
      flex: 1 0 auto !important;
    }
    #botnoi-chat-widget .bcw-flex-msg .T1 .t1Footer {
      display: flex !important;
      flex-direction: column !important;
      flex: none !important;
    }

    #botnoi-chat-widget .bcw-flex-msg .ExMgnTXxs { margin-top:  2px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnTXs  { margin-top:  4px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnTSm  { margin-top:  6px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnTMd  { margin-top:  8px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnTLg  { margin-top: 10px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnTXl  { margin-top: 12px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnTXxl { margin-top: 14px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnLXxs { margin-left:  2px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnLXs  { margin-left:  4px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnLSm  { margin-left:  6px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnLMd  { margin-left:  8px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnLLg  { margin-left: 10px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnLXl  { margin-left: 12px !important; }
    #botnoi-chat-widget .bcw-flex-msg .ExMgnLXxl { margin-left: 14px !important; }

    #botnoi-chat-widget .bcw-flex-msg .LySlider {
      zoom: 0.8;
    }

    /* \u2500\u2500\u2500 Mic Button \u2500\u2500\u2500 */
    #bcw-mic-btn {
      margin: 0 0 0 8px;
      padding: 0;
      width: 36px;
      height: 36px;
      background: transparent;
      border: 1.5px solid var(--bcw-input-field-border);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
      flex-shrink: 0;
      position: relative;
    }
    #bcw-mic-btn svg {
      width: 16px;
      height: 16px;
      fill: var(--bcw-input-area-icon);
      transition: fill 0.2s;
    }
    #bcw-mic-btn:hover {
      background: rgba(0,0,0,0.06);
      border-color: var(--bcw-primary);
    }

    /* Recording state */
    #bcw-mic-btn.bcw-recording {
      background: #fee2e2;
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
      animation: bcw-mic-pulse 1.5s ease-in-out infinite;
    }
    #bcw-mic-btn.bcw-recording svg {
      fill: #ef4444;
    }

    @keyframes bcw-mic-pulse {
      0%, 100% { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2); }
      50% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.1); }
    }

    /* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
       Avatar Mode \u2014 Display Mode System
       \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */

    /* \u2500\u2500 Overlay containers (hidden in panel mode) \u2500\u2500 */
    #bcw-overlay-user,
    #bcw-overlay-bot,
    #bcw-avatar-controls {
      display: none;
    }

    /* \u2500\u2500 Avatar mode: panel adjustments \u2500\u2500 */
    .bcw-mode-avatar #bcw-header {
      display: none;
    }
    .bcw-mode-avatar #bcw-messages-outer {
      display: none;
    }
    .bcw-mode-avatar #bcw-panel {
      height: auto;
      background: transparent;
      border: none;
      box-shadow: none;
      border-radius: 0;
      overflow: visible;
    }
    .bcw-mode-avatar #bcw-input-area {
      border-top: none;
      border-radius: 28px;
      background: var(--bcw-input-area-bg);
      box-shadow: 0 4px 16px rgba(0,0,0,0.14);
      padding: 8px 12px;
    }

    /* \u2500\u2500 Setup screen overrides in avatar mode \u2500\u2500 */
    .bcw-mode-avatar.bcw-setup-active #bcw-header,
    .bcw-mode-avatar #bcw-panel.bcw-setup-active #bcw-header {
      display: flex !important;
    }
    
    .bcw-setup-active #bcw-avatar-controls,
    #bcw-panel.bcw-setup-active #bcw-avatar-controls {
      display: none !important;
    }
    
    .bcw-mode-avatar #bcw-panel.bcw-setup-active {
      height: 600px !important;
      background: var(--bcw-surface) !important;
      border: 1px solid var(--bcw-border) !important;
      box-shadow: 0 8px 30px rgba(0,0,0,0.12) !important;
      border-radius: 16px !important;
      overflow: hidden !important;
    }

    /* \u2500\u2500 Floating controls in avatar mode \u2500\u2500 */
    .bcw-mode-avatar #bcw-avatar-controls {
      display: flex;
      align-items: center;
      position: absolute;
      top: -42px;
      right: 16px;
      gap: 4px;
      z-index: 10;
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      padding: 4px 8px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    /* \u2500\u2500 Avatar container repositioning (avatar mode) \u2500\u2500 */
    #avatar-widget-container.bcw-mode-avatar {
      --bcw-avatar-bottom: -100px;
      --bcw-avatar-right: -295px;
      bottom: var(--bcw-avatar-bottom) !important;
      right: var(--bcw-avatar-right) !important;
      transform-origin: center bottom;
      z-index: 2147483645 !important;
    }
    #avatar-widget-container.bcw-mode-avatar.bcw-avatar-visible {
      transform: scale(1) !important;
    }

    /* \u2500\u2500 User bubble overlay (above input area) \u2500\u2500 */
    .bcw-mode-avatar #bcw-overlay-user {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      width: 100%;
      max-height: 280px;
      overflow: hidden;
      padding: 0 4px 8px 4px;
      pointer-events: none;
      box-sizing: border-box;
    }

    /* \u2500\u2500 Bot bubble overlay (above avatar) \u2500\u2500 */
    .bcw-mode-avatar #bcw-overlay-bot {
      --bcw-bot-overlay-bottom: 200px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      position: absolute;
      bottom: var(--bcw-bot-overlay-bottom);
      left: 50%;
      transform: translateX(-50%);
      width: 320px;
      max-height: 320px;
      overflow: hidden;
      pointer-events: none;
      box-sizing: border-box;
      padding-bottom: 8px;
    }

    /* \u2500\u2500 Floating bubble base \u2500\u2500 */
    .bcw-floating-bubble {
      padding: 8px 14px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.45;
      max-width: 90%;
      word-wrap: break-word;
      margin-top: 6px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.12);
      opacity: 0;
      transform: translateY(12px) scale(0.95);
      transition: opacity 0.35s ease, transform 0.4s cubic-bezier(.34,1.4,.64,1);
      pointer-events: auto;
    }
    .bcw-floating-bubble.bcw-float-in {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    .bcw-floating-bubble.bcw-float-out {
      opacity: 0;
      transform: translateY(-8px) scale(0.95);
      transition: opacity 0.4s ease, transform 0.4s ease;
    }

    .bcw-floating-bubble.bcw-float-user {
      background: var(--bcw-secondary);
      color: var(--bcw-secondary-text);
      align-self: center;
    }
    .bcw-floating-bubble.bcw-float-bot {
      background: var(--bcw-primary);
      color: var(--bcw-primary-text);
      align-self: center;
    }

    /* \u2500\u2500 Floating interactive content (quick replies, carousel, flex) \u2500\u2500 */
    .bcw-floating-interactive {
      margin-top: 6px;
      pointer-events: auto;
      opacity: 0;
      transform: translateY(10px) scale(0.96);
      transition: opacity 0.35s ease, transform 0.4s cubic-bezier(.34,1.4,.64,1);
      width: 100%;
      max-width: 100%;
    }
    .bcw-floating-interactive.bcw-float-in {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    .bcw-floating-interactive.bcw-float-out {
      opacity: 0;
      transform: translateY(-6px) scale(0.95);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    /* \u2500\u2500 Floating quick reply buttons in overlay \u2500\u2500 */
    .bcw-floating-interactive .bcw-quick-reply-btn {
      opacity: 1;
      transform: none;
    }

    /* \u2500\u2500 Shrink-out for floating bubbles \u2500\u2500 */
    @keyframes bcw-floatShrink {
      0%   { max-height: 200px; margin-top: 6px; padding-top: 8px; padding-bottom: 8px; }
      100% { max-height: 0; margin-top: 0; padding-top: 0; padding-bottom: 0; opacity: 0; }
    }
    .bcw-floating-bubble.bcw-float-remove,
    .bcw-floating-interactive.bcw-float-remove {
      overflow: hidden;
      animation: bcw-floatShrink 0.35s ease forwards;
      pointer-events: none;
    }

    /* \u2500\u2500 Mobile adjustments for avatar mode \u2500\u2500 */
    @media (max-width: 440px) {
      .bcw-mode-avatar #bcw-overlay-bot {
        --bcw-bot-overlay-right: 50%;
        transform: translateX(50%);
        width: 260px;
      }
      .bcw-mode-avatar #bcw-panel {
        width: calc(100vw - 24px);
      }
    }
`;H();var sn=`
    <div id="bcw-panel">
      <div id="bcw-header">
        <img id="bcw-header-avatar" src="" alt="Bot" />
        <div id="bcw-header-info">
          <span id="bcw-header-title">**TITLE_PLACEHOLDER**</span>
          <div id="bcw-header-status">
            <span class="bcw-status-dot"></span>
            <span id="bcw-status-text">Connecting\u2026</span>
          </div>
        </div>
        <div id="bcw-volume-group">
          <button id="bcw-volume-btn" title="Volume">
            <svg id="bcw-vol-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393 285.2 400 271.4 400 256s-7.1-29.2-17.8-37.2c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/></svg>
            <svg id="bcw-mute-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style="display:none"><path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"/></svg>
          </button>
          <div id="bcw-volume-slider-wrap">
            <input type="range" id="bcw-volume-slider" min="0" max="100" value="100" />
          </div>
        </div>
        <button id="bcw-clear-btn" title="Clear Chat History">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
          </svg>
        </button>
      </div>
      <div id="bcw-messages-outer"><div id="bcw-messages"></div></div>
      <div id="bcw-overlay-user"></div>
      
      <div id="bcw-avatar-controls">
        <div id="bcw-volume-group-avatar">
          <button id="bcw-volume-btn-avatar" title="Volume">
            <svg id="bcw-vol-icon-avatar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393 285.2 400 271.4 400 256s-7.1-29.2-17.8-37.2c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/></svg>
            <svg id="bcw-mute-icon-avatar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style="display:none"><path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"/></svg>
          </button>
          <div id="bcw-volume-slider-wrap-avatar">
            <input type="range" id="bcw-volume-slider-avatar" min="0" max="100" value="100" />
          </div>
        </div>
        <button id="bcw-clear-btn-avatar" title="Clear Chat History">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
          </svg>
        </button>
      </div>

      <div id="bcw-input-area">
        <input type="text" id="bcw-input" placeholder="Connecting\u2026" autocomplete="off" disabled />
        <button id="bcw-mic-btn" title="Start recording" aria-label="Toggle microphone">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h144c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"/>
          </svg>
        </button>
        <button id="bcw-send-btn" disabled><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 25 25" fill="currentColor"><path d="M7.12,17,.55,13.36l0,0a1.06,1.06,0,0,1-.47-.95,1,1,0,0,1,.57-.88L23.76.08a.74.74,0,0,1,.51,0L7.1,17.07ZM7,18.57V24.3a.5.5,0,0,0,.88.32l4-4.88,4.92,2.76a1,1,0,0,0,.88.11,1,1,0,0,0,.64-.67L24.82,1a.78.78,0,0,0,0-.16Z"/></svg></button>
        <button id="bcw-collapse-btn" aria-label="Collapse chat" title="Collapse">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
          </svg>
        </button>
      </div>
      <div id="bcw-overlay-bot"></div>
    </div>
    <button id="bcw-fab" aria-label="Open chat">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M256 48C141.1 48 48 141.1 48 256c0 39.6 11.2 76.6 30.6 108.1L48.4 460.5c-2.7 8.6 5.5 16.8 14.1 14.1l96.4-30.2C190.4 463.4 222 474 256 474c114.9 0 208-93.1 208-208S370.9 48 256 48zM160 272a16 16 0 1 1 0-32 16 16 0 0 1 0 32zm96 0a16 16 0 1 1 0-32 16 16 0 0 1 0 32zm96 0a16 16 0 1 1 0-32 16 16 0 0 1 0 32z"/>
      </svg>
    </button>
  `;function $o(){return sn.replace("**TITLE_PLACEHOLDER**",b.WIDGET_TITLE)}function Oo(e){if(e=e.replace(/^#/,""),e.length===3&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),e.length!==6)return null;var t=parseInt(e,16);return isNaN(t)?null:{r:t>>16&255,g:t>>8&255,b:t&255}}function ln(e,t,o){e/=255,t/=255,o/=255;var i=Math.max(e,t,o),n=Math.min(e,t,o),a,s,l=(i+n)/2;if(i===n)a=s=0;else{var d=i-n;switch(s=l>.5?d/(2-i-n):d/(i+n),i){case e:a=((t-o)/d+(t<o?6:0))/6;break;case t:a=((o-e)/d+2)/6;break;case o:a=((e-t)/d+4)/6;break}}return{h:a*360,s,l}}function z(e,t,o){e=(e%360+360)%360,t=Math.max(0,Math.min(1,t)),o=Math.max(0,Math.min(1,o));var i=(1-Math.abs(2*o-1))*t,n=i*(1-Math.abs(e/60%2-1)),a=o-i/2,s,l,d;return e<60?(s=i,l=n,d=0):e<120?(s=n,l=i,d=0):e<180?(s=0,l=i,d=n):e<240?(s=0,l=n,d=i):e<300?(s=n,l=0,d=i):(s=i,l=0,d=n),s=Math.round((s+a)*255),l=Math.round((l+a)*255),d=Math.round((d+a)*255),"#"+((1<<24)+(s<<16)+(l<<8)+d).toString(16).slice(1)}function cn(e,t,o){var i=[e,t,o].map(function(n){return n/=255,n<=.03928?n/12.92:Math.pow((n+.055)/1.055,2.4)});return .2126*i[0]+.7152*i[1]+.0722*i[2]}function me(e){var t=Oo(e);if(!t)return"#000000";var o=cn(t.r,t.g,t.b);return o>.179?"#000000":"#ffffff"}function Ro(e){var t=Oo(e);if(!t)return null;var o=ln(t.r,t.g,t.b),i=o.h,n=o.s,a=o.l,s=e.charAt(0)==="#"?e:"#"+e,l=me(s),d=s,p=me(d),u=z(i,n,.9),m=z(i,Math.min(n,.3),.3),g=me(m),f=z(i,Math.min(n,.12),.98),h=z(i,Math.min(n,.15),.94),v=z(i,Math.min(n,.2),.86),T=z(i,Math.min(n,.15),.2),E=z(i,Math.min(n,.1),.4),M=z(i,Math.min(n,.08),.6),$=z(i,Math.min(n,.1),.1),U=z(i,Math.min(n,.08),.9),Z=z(i,Math.min(n,.08),.78),xt=z(i,Math.min(n,.1),.75),gt=z(i,Math.min(n,.06),.6),P=l,_t=d,At=me(_t),fi=s,xi=l,gi=At,hi=z(i,Math.min(n,.1),.99),wi=l;return{"--bcw-primary":s,"--bcw-primary-text":l,"--bcw-header-bg":d,"--bcw-header-text":p,"--bcw-chat-area-bg":u,"--bcw-secondary":m,"--bcw-secondary-text":g,"--bcw-title-text":T,"--bcw-primary-subtitle-text":E,"--bcw-status-text":M,"--bcw-bg":h,"--bcw-surface":f,"--bcw-border":v,"--bcw-input-text":$,"--bcw-disabled-bg":U,"--bcw-disabled-btn":Z,"--bcw-scroll-thumb":xt,"--bcw-muted-text":gt,"--bcw-fab-text":P,"--bcw-input-area-bg":_t,"--bcw-input-area-text":At,"--bcw-input-area-icon":gi,"--bcw-send-btn-bg":fi,"--bcw-send-btn-text":xi,"--bcw-input-field-bg":hi,"--bcw-input-field-border":wi}}H();F();Xt();Ne();be();Ut();var Po=[];function dn(e){typeof e=="function"&&Po.push(e)}function Xe(e){Po.forEach(function(t){try{t(e)}catch(o){console.error("[ChatWidget] onUserMessage callback error:",o)}})}function No(e,t){if(!c._domReady){c._readyQueue.push({type:"addBotMessage",args:[e,t]});return}let o=t||{};o.audio&&b.MODE==="avatar"&&(c._bcwNextBubbleHasAudio=!0);let i=R(e,"bot");L(i);let n={sender:"bot",reply:{type:"text",text:e}};c.chatHistory.push(n),et(),o.anim!==!1&&o.animation!==!1&&b.AVATAR_ENABLED&&(typeof o.animation=="string"?(Pe(o.animation),n.reply.animName=o.animation,et()):ae(c.lastUserInput||"",e).then(s=>{s&&(s.animation&&(n.reply.animName=s.animation),s.emotion&&(n.reply.emotion=s.emotion),s.duration&&(n.reply.duration=s.duration)),et()})),o.audio&&Wo(o.audio)}function zo(e){if(e){if(!c._domReady){c._readyQueue.push({type:"addUserMessage",args:[e]});return}L(R(e,"user")),c.chatHistory.push({sender:"user",text:e,uiText:e}),et(),c.lastUserInput=e,Xe(e)}}function un(e){e&&(c._onSendTextMessage?c._onSendTextMessage(e):c._onSendMessage&&c._onSendMessage(e))}function Wo(e){if(e)if(Fe(),window.WebAvatar&&typeof window.WebAvatar.playAudio=="function")window.WebAvatar.playAudio(e),Do();else{let t=new Audio(e);t.addEventListener("ended",function(){$t()}),t.play().catch(function(o){console.warn("[ChatWidget] Audio playback failed:",o)})}}var I=null,rt=[],Jt=!1,Qt=0,Zt=Promise.resolve(),B=new Uint8Array(0),st=null;function pn(e){let t=new Uint8Array(B.length+e.length);t.set(B,0),t.set(e,B.length),B=t}function Uo(e){if(e.length<44||e[0]!==82||e[1]!==73||e[2]!==70||e[3]!==70||e[8]!==87||e[9]!==65||e[10]!==86||e[11]!==69)return null;let t=new DataView(e.buffer,e.byteOffset,e.byteLength),o=12,i=null;for(;o+8<=e.length;){let n=String.fromCharCode(e[o],e[o+1],e[o+2],e[o+3]),a=t.getUint32(o+4,!0);if(n==="fmt "&&o+8+16<=e.length){let s=t.getUint16(o+8,!0);if(s!==1&&s!==3)return null;i={sampleRate:t.getUint32(o+12,!0),channels:t.getUint16(o+10,!0),bitDepth:t.getUint16(o+22,!0),pcmFloat:s===3}}if(n==="data"&&i)return i.dataOffset=o+8,i;o+=8+a,a%2!==0&&o++}return null}function te(e,t){let o=t.bitDepth/8,i=Math.floor(e.byteLength/(t.channels*o));if(i===0)return null;let n=I.createBuffer(t.channels,i,t.sampleRate),a=new DataView(e.buffer,e.byteOffset,e.byteLength);for(let s=0;s<t.channels;s++){let l=n.getChannelData(s);for(let d=0;d<i;d++){let p=(d*t.channels+s)*o;if(p+o>e.byteLength)break;t.pcmFloat?l[d]=a.getFloat32(p,!0):o===2?l[d]=a.getInt16(p,!0)/32768:o===4?l[d]=a.getInt32(p,!0)/2147483648:o===1&&(l[d]=(a.getUint8(p)-128)/128)}}return n}function ft(e){let t=I.createBufferSource();t.buffer=e,t.connect(I.destination);let o=I.currentTime,i;Qt===0?i=o+.08:o>Qt?i=o:i=Qt,t.start(i),Qt=i+e.duration,rt.push(t),t.onended=function(){let n=rt.indexOf(t);n!==-1&&rt.splice(n,1)}}function bn(e,t){if(window.WebAvatar&&typeof window.WebAvatar.pushAudioChunk=="function"){window.WebAvatar.pushAudioChunk(e,t);return}Zt=Zt.then(function(){return mn(e,t||{})}).catch(function(o){console.warn("[ChatWidget] pushAudioChunk processing error:",o)})}async function mn(e,t){I||(I=new(window.AudioContext||window.webkitAudioContext)),I.state==="suspended"&&await I.resume(),Jt=!0;let o;if(e instanceof ArrayBuffer)o=new Uint8Array(e);else if(ArrayBuffer.isView(e))o=new Uint8Array(e.buffer,e.byteOffset,e.byteLength);else if(typeof e=="string"){let n=atob(e);o=new Uint8Array(n.length);for(let a=0;a<n.length;a++)o[a]=n.charCodeAt(a)}else return;if(t.pcm){let n={sampleRate:t.sampleRate||24e3,channels:t.channels||1,bitDepth:t.bitDepth||16,pcmFloat:t.bitDepth===32},a=te(o,n);a&&ft(a);return}if(st){let n=te(o,st);n&&ft(n);return}try{let n=await I.decodeAudioData(o.buffer.slice(o.byteOffset,o.byteOffset+o.byteLength)),a=Uo(o);if(a&&(st=a),B.length>0){if(st){let s=te(B,st);s&&ft(s)}B=new Uint8Array(0)}ft(n);return}catch{}pn(o);let i=Uo(B);if(i){st=i;let n=B.slice(i.dataOffset);B=new Uint8Array(0);let a=te(n,i);a&&ft(a);return}try{let n=await I.decodeAudioData(B.buffer.slice(0));ft(n),B=new Uint8Array(0)}catch{}}function fn(){if(window.WebAvatar&&typeof window.WebAvatar.endAudio=="function"){window.WebAvatar.endAudio(),Do();return}Zt=Zt.then(async function(){if(B.length>0&&I){if(st){let o=te(B,st);o&&ft(o)}else try{let o=await I.decodeAudioData(B.buffer.slice(0));ft(o)}catch{}B=new Uint8Array(0)}if(Jt=!1,rt.length>0){var e=rt[rt.length-1],t=e.onended;e.onended=function(){t&&t(),$t()}}else $t()}).catch(function(e){console.warn("[ChatWidget] endAudio error:",e),Jt=!1})}function xn(e){if(!e)return;if(Fe(),window.WebAvatar&&typeof window.WebAvatar.playStream=="function"){window.WebAvatar.playStream(e);return}I||(I=new(window.AudioContext||window.webkitAudioContext));let t=I.createMediaStreamSource(e);t.connect(I.destination),rt.push(t),Jt=!0}function gn(){Fe(),window.WebAvatar&&typeof window.WebAvatar.stopAudio=="function"&&window.WebAvatar.stopAudio()}function Fe(){Jt=!1,rt.forEach(function(e){try{e.disconnect()}catch{}try{e.stop&&e.stop()}catch{}}),rt=[],Qt=0,B=new Uint8Array(0),st=null,Zt=Promise.resolve()}function $t(){c._container&&c._container.dispatchEvent(new CustomEvent("bcw-audio-ended"))}var lt=null;function Do(){lt&&clearInterval(lt),setTimeout(function(){var e=0;lt=setInterval(function(){e++;var t=window.WebAvatar;t&&typeof t.isAudioPlaying=="function"?t.isAudioPlaying()||(clearInterval(lt),lt=null,$t()):t&&t._audioPlaying===!1&&(clearInterval(lt),lt=null,$t()),e>=300&&(clearInterval(lt),lt=null,$t())},200)},500)}function hn(e){let t=Math.max(0,Math.min(1,e));window.WebAvatar&&window.WebAvatar.setVolume(t),r.volumeSlider&&(r.volumeSlider.value=Math.round(t*100))}function qe(){r.messagesEl&&(r.messagesEl.innerHTML=""),c.chatHistory=[],b.PERSIST_HISTORY&&localStorage.removeItem(`botnoi_history_${c.userId}`),Wt()}function wn(e,t){N(e,t)}function Ho(){c._domReady=!0,c._readyQueue.splice(0).forEach(function(t){switch(t.type){case"addBotMessage":No.apply(null,t.args);break;case"addUserMessage":zo.apply(null,t.args);break}})}function Fo(){window.ChatWidget={addBotMessage:No,addUserMessage:zo,sendUserMessage:un,playAudio:Wo,pushAudioChunk:bn,endAudio:fn,playStream:xn,stopAudio:gn,playAnimation:Pe,onMicToggle:pe,onMicChunk:ko,onUserMessage:dn,setVolume:hn,clearHistory:qe,setStatus:wn}}H();F();be();Ae();function Xo(){"use strict";var e=document.createElement("style");e.textContent=Io,document.head.appendChild(e);var t=document.createElement("div");if(t.id="botnoi-chat-widget",t.innerHTML=$o(),document.body.appendChild(t),b.MODE&&b.MODE!=="panel"&&t.classList.add("bcw-mode-"+b.MODE),b.THEME_COLOR){var o=Ro(b.THEME_COLOR);o&&Object.keys(o).forEach(function(f){t.style.setProperty(f,o[f])})}r.fab=t.querySelector("#bcw-fab"),r.panel=t.querySelector("#bcw-panel"),r.inputEl=t.querySelector("#bcw-input"),r.sendBtn=t.querySelector("#bcw-send-btn"),r.collapseBtn=t.querySelector("#bcw-collapse-btn"),r.messagesEl=t.querySelector("#bcw-messages"),r.messagesOuterEl=t.querySelector("#bcw-messages-outer"),r.clearBtn=t.querySelector("#bcw-clear-btn"),r.headerAvatar=t.querySelector("#bcw-header-avatar"),r.headerTitle=t.querySelector("#bcw-header-title"),r.statusDot=t.querySelector(".bcw-status-dot"),r.statusText=t.querySelector("#bcw-status-text"),r.volumeBtn=t.querySelector("#bcw-volume-btn"),r.volumeSlider=t.querySelector("#bcw-volume-slider"),r.volIcon=t.querySelector("#bcw-vol-icon"),r.muteIcon=t.querySelector("#bcw-mute-icon"),r.volumeBtnAvatar=t.querySelector("#bcw-volume-btn-avatar"),r.volumeSliderAvatar=t.querySelector("#bcw-volume-slider-avatar"),r.volIconAvatar=t.querySelector("#bcw-vol-icon-avatar"),r.muteIconAvatar=t.querySelector("#bcw-mute-icon-avatar"),r.micBtn=t.querySelector("#bcw-mic-btn"),r.overlayUser=t.querySelector("#bcw-overlay-user"),r.overlayBot=t.querySelector("#bcw-overlay-bot"),r.clearBtnAvatar=t.querySelector("#bcw-clear-btn-avatar"),c._container=t;var i=null;r.messagesEl.addEventListener("scroll",function(){r.messagesEl.classList.add("bcw-scrolling"),clearTimeout(i),i=setTimeout(function(){r.messagesEl.classList.remove("bcw-scrolling")},900)},{passive:!0}),r.messagesEl.addEventListener("mousemove",function(f){for(var h=r.messagesEl.querySelectorAll(".bcw-bot-msg"),v=0;v<h.length;v++){var T=h[v].getBoundingClientRect();f.clientY>=T.top&&f.clientY<=T.bottom?h[v].classList.add("bcw-row-hover"):h[v].classList.remove("bcw-row-hover")}},{passive:!0}),r.messagesEl.addEventListener("mouseleave",function(){r.messagesEl.querySelectorAll(".bcw-bot-msg.bcw-row-hover").forEach(function(f){f.classList.remove("bcw-row-hover")})},{passive:!0}),(function(){var f=0,h=0,v=!1;r.messagesEl.addEventListener("touchstart",function(E){f=E.touches[0].clientY,h=r.messagesEl.scrollTop,v=!1,r.messagesEl.style.transition="",r.messagesEl.style.transform=""},{passive:!0}),r.messagesEl.addEventListener("touchmove",function(E){var M=E.touches[0].clientY-f,$=h<=0&&M>0,U=h>=r.messagesEl.scrollHeight-r.messagesEl.clientHeight-1&&M<0;if($||U){v=!0;var Z=M/3;r.messagesEl.style.transform="translateY("+Z+"px)"}},{passive:!0});function T(){v&&(v=!1,r.messagesEl.style.transition="transform 0.5s cubic-bezier(.25,.46,.45,.94)",r.messagesEl.style.transform="translateY(0)",r.messagesEl.addEventListener("transitionend",function E(){r.messagesEl.style.transition="",r.messagesEl.removeEventListener("transitionend",E)}))}r.messagesEl.addEventListener("touchend",T,{passive:!0}),r.messagesEl.addEventListener("touchcancel",T,{passive:!0})})();let n=100,a=!1;function s(f){let h=f===0?"none":"",v=f===0?"":"none";r.volIcon&&(r.volIcon.style.display=h),r.muteIcon&&(r.muteIcon.style.display=v),r.volIconAvatar&&(r.volIconAvatar.style.display=h),r.muteIconAvatar&&(r.muteIconAvatar.style.display=v)}function l(f){var h=parseInt(f.target.value,10);a=h===0,h>0&&(n=h),r.volumeSlider&&(r.volumeSlider.value=h),r.volumeSliderAvatar&&(r.volumeSliderAvatar.value=h),s(h),window.WebAvatar&&window.WebAvatar.setVolume(h/100)}r.volumeSlider&&r.volumeSlider.addEventListener("input",l),r.volumeSliderAvatar&&r.volumeSliderAvatar.addEventListener("input",l);function d(){if(a){a=!1;let f=n;r.volumeSlider&&(r.volumeSlider.value=f),r.volumeSliderAvatar&&(r.volumeSliderAvatar.value=f),s(f),window.WebAvatar&&window.WebAvatar.setVolume(f/100)}else a=!0,n=parseInt(r.volumeSlider?r.volumeSlider.value:r.volumeSliderAvatar?r.volumeSliderAvatar.value:100,10)||100,r.volumeSlider&&(r.volumeSlider.value=0),r.volumeSliderAvatar&&(r.volumeSliderAvatar.value=0),s(0),window.WebAvatar&&window.WebAvatar.setVolume(0)}r.volumeBtn&&r.volumeBtn.addEventListener("click",d),r.volumeBtnAvatar&&r.volumeBtnAvatar.addEventListener("click",d);function p(){c.isOpen=!0,r.panel.classList.add("bcw-visible"),r.fab.classList.add("bcw-hidden"),Mt(),b.MODE==="avatar"&&r.overlayBot&&(r.overlayBot.style.display=""),c._onPanelOpen&&c._onPanelOpen(),c.initialized&&b.AUTO_FOCUS_INPUT&&r.inputEl.focus()}function u(){c.isOpen=!1,r.panel.classList.remove("bcw-visible"),r.fab.classList.remove("bcw-hidden"),oe(),b.MODE==="avatar"&&r.overlayBot&&(r.overlayBot.style.display="none")}r.fab.addEventListener("click",p),r.collapseBtn.addEventListener("click",u),t.querySelector("#bcw-header").addEventListener("click",function(f){f.target.closest("#bcw-clear-btn, #bcw-volume-group")||u()}),r.micBtn&&r.micBtn.addEventListener("click",function(){_o()});function m(){var f=r.inputEl.value.trim();f&&(r.inputEl.value="",c.lastUserInput=f,c._onSendMessage&&c._onSendMessage(f))}r.sendBtn.addEventListener("click",m),r.inputEl.addEventListener("keypress",function(f){f.key==="Enter"&&m()});function g(){if(c._onClearHistory)c._onClearHistory();else{if(!confirm("Are you sure you want to clear the chat history? This cannot be undone."))return;qe()}}r.clearBtn&&r.clearBtn.addEventListener("click",g),r.clearBtnAvatar&&r.clearBtnAvatar.addEventListener("click",g),Ho(),b.MODE==="avatar"&&so()}var fr=0,xr=0,gr=0,hr=0,wr=0,qo=0,vn=new Set(["add to cart","buy","buy now","order","order now","select","submit","click","click here","more","read more","view","view details","checkout","cart","add","\u0E2A\u0E31\u0E48\u0E07\u0E40\u0E25\u0E22","\u0E2A\u0E31\u0E48\u0E07\u0E0B\u0E37\u0E49\u0E2D","\u0E2B\u0E22\u0E34\u0E1A\u0E43\u0E2A\u0E48\u0E15\u0E30\u0E01\u0E23\u0E49\u0E32","\u0E40\u0E25\u0E37\u0E2D\u0E01","\u0E15\u0E01\u0E25\u0E07","\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19","\u0E14\u0E39\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21","\u0E15\u0E30\u0E01\u0E23\u0E49\u0E32","\u0E2A\u0E31\u0E48\u0E07\u0E2D\u0E32\u0E2B\u0E32\u0E23","increase quantity","decrease quantity","increase","decrease","quantity","\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E08\u0E33\u0E19\u0E27\u0E19","\u0E25\u0E14\u0E08\u0E33\u0E19\u0E27\u0E19","\u0E40\u0E1E\u0E34\u0E48\u0E21","\u0E25\u0E14","\u0E08\u0E33\u0E19\u0E27\u0E19"]);function yn(e){let t=e.parentElement;for(let o=0;o<4&&t;o++){let i=t.querySelector('h1, h2, h3, h4, h5, h6, [class*="title" i], [class*="name" i]');if(i&&!i.contains(e)&&i.textContent.trim())return i.textContent.trim().substring(0,40);t=t.parentElement}return""}function Ve(e){if(e.id&&/^[a-zA-Z][a-zA-Z0-9_\-]*$/.test(e.id))return`#${e.id}`;if(e.name){let o=e.name.replace(/"/g,'\\"');return`${e.tagName.toLowerCase()}[name="${o}"]`}if(e.getAttribute("data-webavatar-id"))return`[data-webavatar-id="${e.getAttribute("data-webavatar-id")}"]`;qo++;let t=`wa-${qo}`;return e.setAttribute("data-webavatar-id",t),`[data-webavatar-id="${t}"]`}function je(e=document){let t=window.location.origin,o=new Set,i=[];return e.querySelectorAll("a[href]").forEach(n=>{try{let a=new URL(n.href,t);if(a.origin!==t)return;let s=a.pathname+a.hash;if(o.has(s)||(o.add(s),s===window.location.pathname&&!a.hash))return;let l=n.getAttribute("aria-label")||n.getAttribute("title")||(n.textContent||"").trim().substring(0,60)||s;l&&s&&i.push({path:s,label:l})}catch{}}),i.slice(0,void 0)}function Vo(e=document){let t=[],o=["bcw-","avatar-","botnoi-","webavatar-"];return e.querySelectorAll("[id]").forEach(i=>{let n=i.id;if(n.length<3||o.some(u=>n.startsWith(u)))return;let a=i.tagName.toLowerCase();if(!["section","div","main","article","aside","header","footer"].includes(a))return;let l=i.getBoundingClientRect();if(l.width===0&&l.height===0)return;let p=(i.querySelector("h1, h2, h3, h4")?.textContent||"").trim().substring(0,60)||i.getAttribute("aria-label")||n.replace(/[-_]/g," ");t.push({selector:`#${n}`,label:p})}),t.slice(0,void 0)}function jo(e=document){let t=[],o=new Set;return e.querySelectorAll("input, textarea, select").forEach(i=>{if(i.type==="hidden"||i.disabled||i.readOnly||i.closest('#botnoi-chat-widget, [id^="bcw-"], [id^="avatar-"]'))return;let n=i.getBoundingClientRect();if(n.width===0&&n.height===0)return;let a=window.getComputedStyle(i);if(a.display==="none"||a.visibility==="hidden")return;let s=Ve(i);if(o.has(s))return;o.add(s);let l="";if(i.id){let d=document.querySelector(`label[for="${i.id}"]`);d&&(l=d.textContent.trim())}l||(l=i.getAttribute("aria-label")||""),l||(l=i.placeholder||""),l||(l=i.name||""),t.push({selector:s,label:l.substring(0,60),type:i.type||i.tagName.toLowerCase()})}),t.slice(0,void 0)}function Go(e=document){let t=[],o=new Set,i=["bcw-","avatar-","botnoi-","webavatar-"];return e.querySelectorAll('button, input[type="button"], input[type="submit"], [role="button"]').forEach(n=>{if(n.disabled||n.closest('#botnoi-chat-widget, [id^="bcw-"], [id^="avatar-"]')||n.id&&i.some(u=>n.id.startsWith(u)))return;let a=n.getBoundingClientRect();if(a.width===0&&a.height===0)return;let s=window.getComputedStyle(n);if(s.display==="none"||s.visibility==="hidden")return;let l=Ve(n);if(o.has(l))return;o.add(l);let d=n.getAttribute("aria-label")||n.getAttribute("title")||(n.textContent||"").trim();!d&&n.value&&(d=n.value.trim()),d=d.trim().substring(0,60);let p=d.toLowerCase();if(vn.has(p)||p.length<=4){let u=yn(n);u&&(d=`${d} (${u})`)}t.push({selector:l,label:d})}),t.slice(0,void 0)}function Yo(e=document){let t=[],o=new Set,i=["bcw-","avatar-","botnoi-","webavatar-"];return e.querySelectorAll("details, [aria-expanded]").forEach(n=>{if(n.closest('#botnoi-chat-widget, [id^="bcw-"], [id^="avatar-"]')||n.id&&i.some(u=>n.id.startsWith(u)))return;let a=n.getBoundingClientRect();if(a.width===0&&a.height===0)return;let s=window.getComputedStyle(n);if(s.display==="none"||s.visibility==="hidden")return;let l=Ve(n);if(o.has(l))return;o.add(l);let d="";if(n.tagName.toLowerCase()==="details"){let u=n.querySelector("summary");u&&(d=u.textContent.trim())}d||(d=n.textContent.trim()||n.getAttribute("aria-label")||n.getAttribute("title")||""),d=d.substring(0,60);let p="collapsed";n.tagName.toLowerCase()==="details"?p=n.hasAttribute("open")?"expanded":"collapsed":p=n.getAttribute("aria-expanded")==="true"?"expanded":"collapsed",t.push({selector:l,label:d,state:p})}),t.slice(0,void 0)}function vr(e,t){return e.length===0?"No targets found on the current page.":e.map(t).join(", ")}function fe(e){if(e){if(!document.getElementById("webavatar-highlight-style")){let t=document.createElement("style");t.id="webavatar-highlight-style",t.innerHTML=`
        @keyframes webavatar-glow {
            0% { box-shadow: 0 0 5px rgba(170, 59, 255, 0.5); }
            50% { box-shadow: 0 0 20px 8px rgba(170, 59, 255, 0.9); }
            100% { box-shadow: 0 0 5px rgba(170, 59, 255, 0.5); }
        }
        .webavatar-highlight {
            animation: webavatar-glow 1s ease-in-out 3 !important;
            border: 2px solid #aa3bff !important;
            border-radius: 4px !important;
            transition: all 0.3s ease;
        }
        `,document.head.appendChild(t)}e.classList.add("webavatar-highlight"),setTimeout(()=>{e.classList.remove("webavatar-highlight")},3e3)}}var En="https://generateavatartoken-zb2xurnl2a-as.a.run.app",k=!1,xe=class{constructor({greetingInstruction:t,onAudioData:o,onTextData:i,onInterrupt:n,onLog:a,onUserText:s,onTurnComplete:l,onToolCallExecuted:d,onUsageMetadata:p,onGoAway:u,onDisconnect:m}){this.greetingInstruction=t||"",this.onAudioData=o,this.onTextData=i,this.onInterrupt=n,this.onLog=a,this.onUserText=s,this.onTurnComplete=l,this.onToolCallExecuted=d,this.onUsageMetadata=p,this.onGoAway=u,this.onDisconnect=m,this.bargeInEnabled=!0,this.isAiSpeaking=!1,this.ws=null,this.setupComplete=!1,this._clientDisconnected=!1,this.toolHandlers={},this._audioEndTime=0,this._turnCompleteFallbackTimer=null,this.rmsHistory=[],this.maxHistorySize=100,this.speechThreshold=.005,this.silenceDurationMs=800,this.isUserSpeaking=!1,this.silenceTimer=null,this.streamEndedSent=!1,this._registerDefaultTools()}_addAudioDuration(t){let o=Date.now();!this._audioEndTime||this._audioEndTime<o?this._audioEndTime=o+t:this._audioEndTime+=t,this._scheduleTurnCompleteFallback()}_scheduleTurnCompleteFallback(){this._turnCompleteFallbackTimer&&clearTimeout(this._turnCompleteFallbackTimer);let t=Date.now(),i=(this._audioEndTime?Math.max(0,this._audioEndTime-t):0)+2e3;i<3500&&(i=3500),this._turnCompleteFallbackTimer=setTimeout(()=>{this.isAiSpeaking&&(k&&console.log("\u26A0\uFE0F Turn complete fallback triggered (Audio queue finished)"),this.isAiSpeaking=!1,this._audioEndTime=0,this.onTurnComplete&&this.onTurnComplete())},i)}async connectWithWidgetId(t){k&&console.log(`[LiveConnector] Fetching token for widgetId: ${t}`);let o=await fetch(En,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widgetId:t,provider:"gemini"})}),i=await o.json();if(!o.ok)throw new Error(i.error||"Failed to fetch token");let n=i.token,a=i.config||{};return k&&console.log("[LiveConnector] Token + config received.",a),this.bargeInEnabled=a.bargeInEnabled!==!1,this.navToolEnabled=a.navToolEnabled===!0,this.scrollToolEnabled=a.scrollToolEnabled===!0,this.formToolEnabled=a.formToolEnabled===!0,this._registerSiteTools(),Array.isArray(a.tools)&&this._registerCustomApiTools(a.tools),this.connect(n)}async connect(t){let o=`wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=${t}`;this.ws=new WebSocket(o),this.ws.onopen=()=>{k&&console.log("Connected to Gemini Live API"),this._sendSetup()},this.ws.onmessage=async i=>{let n=i.data instanceof Blob?await i.data.text():i.data;this._handleMessage(JSON.parse(n))},this.ws.onclose=i=>{k&&console.log("Connection closed",i.code,i.reason),!this._clientDisconnected&&this.onDisconnect&&this.onDisconnect(i.reason||"connection_closed")},this.ws.onerror=i=>console.error("WebSocket Error",i)}sendAudioChunk(t,o){if(!(this.ws?.readyState!==WebSocket.OPEN||!this.setupComplete)&&!(!this.bargeInEnabled&&this.isAiSpeaking))if(this.bargeInEnabled&&typeof o=="number"){this.rmsHistory.push(o),this.rmsHistory.length>this.maxHistorySize&&this.rmsHistory.shift();let i=Math.min(...this.rmsHistory);this.speechThreshold=Math.max(.004,i*1.8+.002),o>this.speechThreshold?(this.streamEndedSent=!1,this.isUserSpeaking=!0,this.silenceTimer&&(clearTimeout(this.silenceTimer),this.silenceTimer=null),this._sendAudioRealtimeInput(t)):this.isUserSpeaking&&(this.silenceTimer||(this.silenceTimer=setTimeout(()=>{this.isUserSpeaking=!1,this._sendAudioStreamEnd(),this.silenceTimer=null},this.silenceDurationMs)),this._sendAudioRealtimeInput(t))}else this._sendAudioRealtimeInput(t)}_sendAudioRealtimeInput(t){if(this.ws?.readyState===WebSocket.OPEN){let o={realtimeInput:{audio:{mimeType:"audio/pcm",data:t}}};this.ws.send(JSON.stringify(o))}}_sendAudioStreamEnd(){if(this.ws?.readyState===WebSocket.OPEN&&!this.streamEndedSent){k&&console.log("\u{1F507} Sending audioStreamEnd (silence detected)");let t={realtimeInput:{audioStreamEnd:!0}};this.ws.send(JSON.stringify(t)),this.streamEndedSent=!0}}disconnect(){this._clientDisconnected=!0,this._audioEndTime=0,this._turnCompleteFallbackTimer&&(clearTimeout(this._turnCompleteFallbackTimer),this._turnCompleteFallbackTimer=null),this.silenceTimer&&(clearTimeout(this.silenceTimer),this.silenceTimer=null),this.isUserSpeaking=!1,this.streamEndedSent=!1,this.rmsHistory=[],this.ws&&(this.ws.close(),this.ws=null),this.setupComplete=!1}sendUserMessage(t){if(this.ws?.readyState===WebSocket.OPEN&&this.setupComplete){let o={clientContent:{turns:[{role:"user",parts:[{text:t}]}],turnComplete:!0}};k&&console.log("Sending user text message:",o),this.ws.send(JSON.stringify(o))}}sendGreeting(){let t="[SYSTEM] Please greet the user.";this.greetingInstruction&&this.greetingInstruction.trim()!==""&&(t=`[SYSTEM]${this.greetingInstruction}`),this.sendUserMessage(t)}_sendSetup(){let t={setup:{}};k&&console.log("Sending minimal setup (token has full config)..."),this.ws.send(JSON.stringify(t))}_handleMessage(t){if(t.usageMetadata&&(k&&console.log(`\u{1F4CA} Native Usage Metadata received: 
`,JSON.stringify(t.usageMetadata)),this.onUsageMetadata))try{this.onUsageMetadata(t.usageMetadata)}catch(i){console.error("Error invoking onUsageMetadata:",i)}if(t.goAway){let i=t.goAway.timeLeft||"10s",n=parseFloat(i.replace("s",""))||10;k&&console.log(`\u26A0\uFE0F GoAway received: ${n}s remaining`),this.onGoAway&&this.onGoAway(n);return}if(t.setupComplete){console.log(" Setup complete!"),this.setupComplete=!0,this.sendGreeting();return}if(t.toolCall){k&&console.log("\u{1F3AF} \u{1F6E0}\uFE0F TOOL CALL response received:",t.toolCall),this._turnCompleteFallbackTimer&&(clearTimeout(this._turnCompleteFallbackTimer),this._turnCompleteFallbackTimer=null),this._handleToolCall(t.toolCall);return}let o=t.serverContent;if(o){if(o.interrupted){console.log("\u{1F5E3}\uFE0F User interrupted"),this.isAiSpeaking=!1,this.isUserSpeaking=!0,this.streamEndedSent=!1,this.silenceTimer&&(clearTimeout(this.silenceTimer),this.silenceTimer=null),this._audioEndTime=0,this._turnCompleteFallbackTimer&&clearTimeout(this._turnCompleteFallbackTimer),this.onInterrupt&&this.onInterrupt();return}if(o.inputTranscription&&(console.log("\u{1F3A4} User:",o.inputTranscription.text),this.onUserText&&this.onUserText(o.inputTranscription.text)),o.outputTranscription&&(console.log("\u{1F4AC} Bot:",o.outputTranscription.text),this.onTextData&&this.onTextData(o.outputTranscription.text)),o.modelTurn?.parts){this.isAiSpeaking=!0,this._scheduleTurnCompleteFallback();for(let i of o.modelTurn.parts){if(i.inlineData?.mimeType.startsWith("audio/pcm")){let n=i.inlineData.data,s=(n.length*3/4-(n.endsWith("==")?2:n.endsWith("=")?1:0))/48e3*1e3;this._addAudioDuration(s),this.onAudioData&&this.onAudioData(n)}i.text&&this.onTextData&&!o.outputTranscription&&(console.log("\u{1F4AC} Bot (part):",i.text),this.onTextData(i.text))}}if(o.turnComplete){if(!this.isAiSpeaking)return;let i=Date.now(),n=this._audioEndTime?Math.max(0,this._audioEndTime-i):0;this._turnCompleteFallbackTimer&&(clearTimeout(this._turnCompleteFallbackTimer),this._turnCompleteFallbackTimer=null),n>0?(k&&console.log(`\u{1F3C1} Turn complete received, but waiting ${Math.round(n)}ms for audio to finish`),this._turnCompleteFallbackTimer=setTimeout(()=>{this.isAiSpeaking&&(k&&console.log("\u{1F3C1} Delayed Turn complete fired"),this.isAiSpeaking=!1,this._audioEndTime=0,this.onTurnComplete&&this.onTurnComplete())},n+500)):(console.log("\u{1F3C1} Turn complete"),this.isAiSpeaking=!1,this._audioEndTime=0,this.onTurnComplete&&this.onTurnComplete())}}}registerToolHandler(t,o){this.toolHandlers[t]=o,k&&console.log(`Handler registered for tool: ${t}`)}_registerDefaultTools(){this.registerToolHandler("set_avatar_animation",async t=>{let o=`\u{1F3AC} Tool Call: set_avatar_animation -> ${t.animation}, ${t.emotion}, ${t.length}s`;return k&&console.log(o),this.onLog&&this.onLog(o,"sys"),window.WebAvatar&&(typeof window.WebAvatar.loadAnimation=="function"&&t.animation&&window.WebAvatar.loadAnimation(t.animation),typeof window.WebAvatar.setEmotion=="function"&&t.emotion&&window.WebAvatar.setEmotion(t.emotion,t.length||0)),{success:!0,message:`Animation ${t.animation} set`}}),this.registerToolHandler("show_alert",async t=>{let o=`\u{1F6E0}\uFE0F Tool Call: show_alert -> ${t.message}, "sys"`;return k&&console.log(o),alert(t.message),{success:!0,message:"Alert shown"}})}_registerSiteTools(){(this.navToolEnabled||this.scrollToolEnabled||this.formToolEnabled)&&this.registerToolHandler("scan_current_page",async t=>{let{containerSelector:o}=t||{},i=document;if(o)try{let u=document.querySelector(o);if(u)i=u;else return{success:!1,error:`Container element "${o}" not found.`}}catch(u){return{success:!1,error:`Invalid container selector: ${u.message}`}}let n=`\u{1F50D} Tool Call: scan_current_page${o?` (container: ${o})`:""}`;k&&console.log(n),this.onLog&&this.onLog(n,"sys");let a=this.navToolEnabled?je(i):[],s=this.scrollToolEnabled?Vo(i):[],l=this.formToolEnabled?jo(i):[],d=this.formToolEnabled?Go(i):[],p=this.formToolEnabled?Yo(i):[];return{success:!0,pages:this.navToolEnabled?a.map(u=>({path:u.path,label:u.label})):void 0,sections:this.scrollToolEnabled?s.map(u=>({sel:u.selector,label:u.label})):void 0,fields:this.formToolEnabled?l.map(u=>({sel:u.selector,label:u.label,type:u.type})):void 0,buttons:this.formToolEnabled?d.map(u=>({sel:u.selector,label:u.label})):void 0,panels:this.formToolEnabled?p.map(u=>({sel:u.selector,label:u.label})):void 0}}),this.navToolEnabled&&(this.registerToolHandler("navigate_parent_site",async t=>{let{target:o}=t,i=je();if(!o.startsWith("/")&&!o.startsWith("http")){let l=i.find(d=>d.path.toLowerCase().includes(o.toLowerCase())||d.label.toLowerCase().includes(o.toLowerCase()));if(l)o=l.path;else return{success:!1,error:`Could not find a page matching "${o}". Run scan_current_page to see available routes.`}}let n=`\u{1F9ED} Tool Call: navigate_parent_site -> ${o}`;k&&console.log(n),this.onLog&&this.onLog(n,"sys");try{if(new URL(o,window.location.origin).origin!==window.location.origin)return{success:!1,error:"Cannot navigate to external URLs."}}catch{if(o.startsWith("http")||o.startsWith("//"))return{success:!1,error:"Cannot navigate to external URLs."}}let a=new CustomEvent("webavatar-navigate",{detail:{target:o},cancelable:!0,bubbles:!0});if(!!document.dispatchEvent(a))window.location.href=o;else return await new Promise(l=>setTimeout(l,600)),{success:!0,currentPath:o};return{success:!0,currentPath:o}}),k&&console.log("[SiteTools] navigate_parent_site registered.")),this.scrollToolEnabled&&(this.registerToolHandler("scroll_to_element",async t=>{let{selector:o}=t,i=`\u{1F4DC} Tool Call: scroll_to_element -> ${o}`;if(k&&console.log(i),this.onLog&&this.onLog(i,"sys"),!/^[#.]?[a-zA-Z0-9_-]+$/.test(o))return{success:!1,error:"Invalid selector format."};let n=document.querySelector(o);if(!n)return{success:!1,error:`Element "${o}" not found.`};let a=n.getBoundingClientRect();return a.width===0&&a.height===0?{success:!1,error:`Element "${o}" is not visible.`}:(n.scrollIntoView({behavior:"smooth",block:"center"}),fe(n),{success:!0,scrolledTo:o})}),k&&console.log("[SiteTools] scroll_to_element handler registered.")),this.formToolEnabled&&(this.registerToolHandler("fill_form_fields",async t=>{let o="\u{1F4DD} Tool Call: fill_form_fields";k&&console.log(o,t),this.onLog&&this.onLog(o,"sys");let i=[];for(let n=1;n<=3;n++){let a=t[`selector_${n}`],s=t[`value_${n}`];if(!a||s===void 0)continue;if(!/^[#.]?[a-zA-Z0-9_\-[\]="]+$/.test(a)){i.push({selector:a,status:"invalid_selector"});continue}let l=document.querySelector(a);if(!l){i.push({selector:a,status:"not_found"});continue}let d=l.tagName.toLowerCase(),p;d==="textarea"?p=Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,"value")?.set:d==="select"?p=Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype,"value")?.set:p=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value")?.set,p?p.call(l,s):l.value=s,l.dispatchEvent(new Event("focus",{bubbles:!0})),l.dispatchEvent(new Event("input",{bubbles:!0})),l.dispatchEvent(new Event("change",{bubbles:!0})),l.dispatchEvent(new Event("blur",{bubbles:!0})),fe(l),i.push({selector:a,status:"filled"})}return{success:!0,fields:i}}),k&&console.log("[SiteTools] fill_form_fields handler registered."),this.registerToolHandler("click_element",async t=>{let{selector:o}=t,i=`\u26A1 Tool Call: click_element -> ${o}`;if(k&&console.log(i),this.onLog&&this.onLog(i,"sys"),!/^[#.]?[a-zA-Z0-9_\-[\]="]+$/.test(o))return{success:!1,error:"Invalid selector format."};let n=document.querySelector(o);if(!n)return{success:!1,error:`Element "${o}" not found.`};let a=n.getBoundingClientRect();if(a.width===0&&a.height===0)return{success:!1,error:`Element "${o}" is not visible.`};let s=n;if(n.tagName.toLowerCase()==="details"){let d=n.querySelector("summary");d&&(s=d)}s.scrollIntoView({behavior:"smooth",block:"center"}),await new Promise(d=>setTimeout(d,300)),s.focus();let l=new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window});return s.dispatchEvent(l),fe(s),{success:!0,clicked:o}}),this.registerToolHandler("get_dropdown_options",async t=>{let{selector:o}=t,i=`\u26A1 Tool Call: get_dropdown_options -> ${o}`;if(k&&console.log(i),this.onLog&&this.onLog(i,"sys"),!/^[#.]?[a-zA-Z0-9_\-[\]="]+$/.test(o))return{success:!1,error:"Invalid selector format."};let n=document.querySelector(o);return n?n.tagName.toLowerCase()!=="select"?{success:!1,error:`Element "${o}" is not a <select> dropdown.`}:{success:!0,options:Array.from(n.options).map(s=>({value:s.value,label:s.text.trim()}))}:{success:!1,error:`Element "${o}" not found.`}}),this.registerToolHandler("select_dropdown_option",async t=>{let{selector:o,value:i}=t,n=`\u26A1 Tool Call: select_dropdown_option -> ${o} = "${i}"`;if(k&&console.log(n),this.onLog&&this.onLog(n,"sys"),!/^[#.]?[a-zA-Z0-9_\-[\]="]+$/.test(o))return{success:!1,error:"Invalid selector format."};let a=document.querySelector(o);if(!a)return{success:!1,error:`Element "${o}" not found.`};if(a.tagName.toLowerCase()!=="select")return{success:!1,error:`Element "${o}" is not a <select> dropdown.`};let s=Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype,"value")?.set;return s?s.call(a,i):a.value=i,a.dispatchEvent(new Event("focus",{bubbles:!0})),a.dispatchEvent(new Event("input",{bubbles:!0})),a.dispatchEvent(new Event("change",{bubbles:!0})),a.dispatchEvent(new Event("blur",{bubbles:!0})),fe(a),{success:!0,selectedValue:i}}))}_registerCustomApiTools(t){Array.isArray(t)&&t.forEach(o=>{o.enabled!==!1&&this.registerToolHandler(o.name,async i=>{let n=`\u{1F50C} Custom Tool Call: ${o.name}`;k&&console.log(n,i),this.onLog&&this.onLog(n,"sys");let a=o.endpoint,s=(o.method||"POST").toUpperCase(),l={};Array.isArray(o.headers)&&o.headers.forEach(p=>{l[p.key]=p.value});let d={method:s,headers:l};if(s==="GET"||s==="DELETE"){let p=new URLSearchParams;for(let m in i){let g=i[m];Array.isArray(g)||typeof g=="object"?p.append(m,JSON.stringify(g)):p.append(m,g)}let u=p.toString();u&&(a+=(a.includes("?")?"&":"?")+u)}else a.includes("script.google.com")?d.headers["Content-Type"]="text/plain;charset=utf-8":d.headers["Content-Type"]||(d.headers["Content-Type"]="application/json"),d.body=JSON.stringify(i);try{let p=await fetch(a,d),u=p.headers.get("content-type")||"",m;return u.includes("application/json")?m=await p.json():m=await p.text(),m}catch(p){return console.error(`Error executing custom tool ${o.name}:`,p),{error:`API request failed: ${p.message}`}}})})}async _handleToolCall(t){let o=[];for(let i of t.functionCalls){let{name:n,id:a,args:s}=i;k&&console.log(`\u26A1 Executing tool ${n} with args:`,s);let l;if(this.toolHandlers[n])try{l=await this.toolHandlers[n](s)}catch(d){console.error(`Error executing tool ${n}:`,d),l={error:d.message}}else console.warn(`No handler registered for tool ${n}`),l={error:"Tool not implemented"};if(o.push({name:n,id:a,response:{output:l}}),this.onToolCallExecuted)try{this.onToolCallExecuted(n,a,s,l)}catch(d){console.error("Error invoking onToolCallExecuted callback:",d)}}this._sendToolResponse(o)}_sendToolResponse(t){let o={toolResponse:{functionResponses:t}};k&&console.log("\u{1F527} Sending tool response:",o),this.ws?.readyState===WebSocket.OPEN&&this.ws.send(JSON.stringify(o))}};var Tn=`
class AudioCaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 512;
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;
  }
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input && input.length > 0) {
      const inputChannel = input[0];
      for (let i = 0; i < inputChannel.length; i++) {
        this.buffer[this.bufferIndex++] = inputChannel[i];
        if (this.bufferIndex >= this.bufferSize) {
          this.port.postMessage({ type: "audio", data: this.buffer.slice() });
          this.bufferIndex = 0;
        }
      }
    }
    return true;
  }
}
registerProcessor("audio-capture-processor", AudioCaptureProcessor);
`,kn=`
class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.audioQueue = [];
    this.currentOffset = 0;
    this.port.onmessage = (event) => {
      if (event.data === "interrupt") {
        this.audioQueue = [];
        this.currentOffset = 0;
      } else if (event.data instanceof Float32Array) {
        this.audioQueue.push(event.data);
      }
    };
  }
  process(inputs, outputs, parameters) {
    const output = outputs[0];
    if (output.length === 0) return true;
    const channel = output[0];
    let outputIndex = 0;
    while (outputIndex < channel.length && this.audioQueue.length > 0) {
      const currentBuffer = this.audioQueue[0];
      if (!currentBuffer || currentBuffer.length === 0) {
        this.audioQueue.shift();
        this.currentOffset = 0;
        continue;
      }
      const remainingOutput = channel.length - outputIndex;
      const remainingBuffer = currentBuffer.length - this.currentOffset;
      const copyLength = Math.min(remainingOutput, remainingBuffer);
      for (let i = 0; i < copyLength; i++) {
        channel[outputIndex++] = currentBuffer[this.currentOffset++];
      }
      if (this.currentOffset >= currentBuffer.length) {
        this.audioQueue.shift();
        this.currentOffset = 0;
      }
    }
    while (outputIndex < channel.length) {
      channel[outputIndex++] = 0;
    }
    return true;
  }
}
registerProcessor("pcm-processor", PCMProcessor);
`;function Ko(e){let t=new Blob([e],{type:"application/javascript"});return URL.createObjectURL(t)}var Ge=null,Ye=null;function _n(){return Ge||(Ge=Ko(Tn)),Ge}function An(){return Ye||(Ye=Ko(kn)),Ye}var ge=class{constructor(t){this.client=t,this.audioContext=null,this.audioWorklet=null,this.mediaStream=null,this.isStreaming=!1,this.sampleRate=16e3}async start(t=null){try{let o={sampleRate:this.sampleRate,echoCancellation:!0,noiseSuppression:!0,autoGainControl:!0};return t&&(o.deviceId={exact:t}),this.mediaStream=await navigator.mediaDevices.getUserMedia({audio:o}),this.audioContext=new(window.AudioContext||window.webkitAudioContext),await this.audioContext.audioWorklet.addModule(_n()),this.audioWorklet=new AudioWorkletNode(this.audioContext,"audio-capture-processor"),this.audioWorklet.port.onmessage=n=>{if(this.isStreaming&&n.data.type==="audio"){let a=n.data.data,s=this.getRMSVolume(a),l=this.downsampleBuffer(a,this.audioContext.sampleRate,16e3),d=this.convertToPCM16(l),p=this.arrayBufferToBase64(d);this.client&&this.client.connected&&this.client.sendAudioMessage(p,s)}},this.audioContext.createMediaStreamSource(this.mediaStream).connect(this.audioWorklet),this.isStreaming=!0,console.log("\u{1F3A4} Audio streaming started"),!0}catch(o){throw console.error("Failed to start audio streaming:",o),o}}stop(){this.isStreaming=!1,this.audioWorklet&&(this.audioWorklet.disconnect(),this.audioWorklet.port.close(),this.audioWorklet=null),this.audioContext&&(this.audioContext.close(),this.audioContext=null),this.mediaStream&&(this.mediaStream.getTracks().forEach(t=>t.stop()),this.mediaStream=null),console.log("\u{1F6D1} Audio streaming stopped")}getRMSVolume(t){let o=0;for(let i=0;i<t.length;i++)o+=t[i]*t[i];return Math.sqrt(o/t.length)}convertToPCM16(t){let o=new Int16Array(t.length);for(let i=0;i<t.length;i++)o[i]=Math.max(-1,Math.min(1,t[i]))*32767;return o.buffer}arrayBufferToBase64(t){let o=new Uint8Array(t),i="";for(let n=0;n<o.byteLength;n++)i+=String.fromCharCode(o[n]);return window.btoa(i)}downsampleBuffer(t,o,i){if(i===o)return t;let n=o/i,a=Math.round(t.length/n),s=new Float32Array(a),l=0,d=0;for(;l<s.length;){let p=Math.round((l+1)*n),u=0,m=0;for(let g=d;g<p&&g<t.length;g++)u+=t[g],m++;s[l]=u/m,l++,d=p}return s}},he=class{constructor(){this.audioContext=null,this.workletNode=null,this.gainNode=null,this.isInitialized=!1,this.volume=1,this.sampleRate=24e3}async init(){if(!this.isInitialized)try{this.audioContext=new(window.AudioContext||window.webkitAudioContext)({sampleRate:this.sampleRate}),await this.audioContext.audioWorklet.addModule(An()),this.workletNode=new AudioWorkletNode(this.audioContext,"pcm-processor"),this.gainNode=this.audioContext.createGain(),this.gainNode.gain.value=this.volume,this.workletNode.connect(this.gainNode),this.gainNode.connect(this.audioContext.destination),this.isInitialized=!0,console.log("\u{1F50A} Audio player initialized")}catch(t){throw console.error("Failed to initialize audio player:",t),t}}async play(t){this.isInitialized||await this.init();try{this.audioContext.state==="suspended"&&await this.audioContext.resume();let o=atob(t),i=new Uint8Array(o.length);for(let s=0;s<o.length;s++)i[s]=o.charCodeAt(s);let n=new Int16Array(i.buffer),a=new Float32Array(n.length);for(let s=0;s<n.length;s++)a[s]=n[s]/32768;this.workletNode.port.postMessage(a)}catch(o){console.error("Error playing audio chunk:",o)}}interrupt(){this.workletNode&&this.workletNode.port.postMessage("interrupt")}setVolume(t){this.volume=Math.max(0,Math.min(1,t)),this.gainNode&&(this.gainNode.gain.value=this.volume)}destroy(){this.audioContext&&(this.audioContext.close(),this.audioContext=null),this.isInitialized=!1}};F();var we=class{constructor(t,o,i,n){this.widgetId=t,this.provider=o,this.realtimeMode=i,this.bargeInEnabled=n,this.sessionId=window.crypto&&window.crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15),this.userId=c.userId||"",this.hwid=c.hwid||"",this.startTime=Date.now(),this.totalBotDuration=0,this.totalUserDuration=0,this.interruptionCount=0,this.activeSpeaker="user",this.lastStateTransition=Date.now(),this.history=[],this.errors=[],this.hasTrackedEnd=!1,this.latencyTimestamps=[],this._tokenUsage={token_audio_input:0,token_text_input:0,token_cached_input:0,token_audio_output:0,token_text_output:0,thoughts_tokens:0,tool_use_prompt_tokens:0},this._prevPeak={promptTokenCount:0,responseTokenCount:0,totalTokenCount:0,cachedContentTokenCount:0,toolUsePromptTokenCount:0,thoughtsTokenCount:0,prompt_AUDIO:0,prompt_TEXT:0,response_AUDIO:0,response_TEXT:0},this._bankedTotals={promptTokenCount:0,responseTokenCount:0,totalTokenCount:0,cachedContentTokenCount:0,toolUsePromptTokenCount:0,thoughtsTokenCount:0,prompt_AUDIO:0,prompt_TEXT:0,response_AUDIO:0,response_TEXT:0},this._usageMessageCount=0}startSession(){let t={sessionId:this.sessionId,widgetId:this.widgetId,userId:this.userId,hwid:this.hwid,session_start_time:this.startTime,provider:this.provider,realtimeMode:this.realtimeMode,bargeInEnabled:this.bargeInEnabled};console.log(`[UsageTracker] Starting session ${this.sessionId}`),fetch("https://trackrealtimesessionstart-zb2xurnl2a-as.a.run.app",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}).catch(o=>{console.warn("[UsageTracker] Pre-emptive trackSessionStart call failed:",o),this.errors.push(`Start tracking failure: ${o.message}`)})}stopSession(t=!1){if(this.hasTrackedEnd)return;this.hasTrackedEnd=!0;let o=this.getPayload(),i="https://trackrealtimesessionend-zb2xurnl2a-as.a.run.app";if(console.log(`[UsageTracker] Stopping session ${this.sessionId} (keepalive: ${t})`),t){let n={sessionId:this.sessionId,session_end_time:o.session_end_time,duration:o.duration,interruptionCount:o.interruptionCount,history:o.history,tokenUsage:o.tokenUsage,deviceInfo:o.deviceInfo,metrics:o.metrics},a=JSON.stringify(n);if(typeof fetch=="function")fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:a,keepalive:!0}).catch(s=>console.warn("[UsageTracker] Keepalive end telemetry failed:",s));else if(navigator.sendBeacon){let s=new Blob([a],{type:"application/json"});navigator.sendBeacon(i,s)}}else fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).catch(n=>{console.warn("[UsageTracker] End telemetry call failed:",n),this.errors.push(`End tracking failure: ${n.message}`)})}updateSession(){if(this.hasTrackedEnd||this._isUpdating)return;this._isUpdating=!0;let t=Date.now(),o=(t-this.lastStateTransition)/1e3,i=this.totalBotDuration;this.activeSpeaker==="bot"&&(i+=o);let n=(t-this.startTime)/1e3,a=Math.max(0,n-i),s=this.history.splice(0,this.history.length),l={sessionId:this.sessionId,duration:{total:parseFloat(n.toFixed(2)),user:parseFloat(a.toFixed(2)),bot:parseFloat(i.toFixed(2))},interruptionCount:this.interruptionCount,history:s,tokenUsage:{token_audio_input:this._tokenUsage.token_audio_input,token_audio_output:this._tokenUsage.token_audio_output,token_text_input:this._tokenUsage.token_text_input,token_text_output:this._tokenUsage.token_text_output,token_cached_input:this._tokenUsage.token_cached_input,thoughts_tokens:this._tokenUsage.thoughts_tokens,tool_use_prompt_tokens:this._tokenUsage.tool_use_prompt_tokens,usage_message_count:this._usageMessageCount}};fetch("https://trackrealtimesessionupdate-zb2xurnl2a-as.a.run.app",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)}).then(()=>{console.log(`[UsageTracker] Mid-session update synced for ${this.sessionId}`)}).catch(p=>{console.warn("[UsageTracker] Mid-session update failed:",p),this.history.unshift(...s)}).finally(()=>{this._isUpdating=!1})}transitionSpeaker(t){let o=Date.now(),i=(o-this.lastStateTransition)/1e3;this.activeSpeaker==="user"?this.totalUserDuration+=i:this.activeSpeaker==="bot"&&(this.totalBotDuration+=i),this.activeSpeaker=t,this.lastStateTransition=o}addHistoryMessage(t,o){!o||o.trim()===""||this.history.push({sender:t,text:o.trim(),timestamp:Date.now()})}addToolCall(t,o,i){this.history.push({sender:"tool_call",name:t,id:o,args:i,timestamp:Date.now()})}addToolResponse(t,o,i){this.history.push({sender:"tool_response",name:t,id:o,output:i,timestamp:Date.now()})}recordUsageMetadata(t){if(!t)return;this._usageMessageCount++;let o=t.promptTokenCount||0,i=t.responseTokenCount||0,n=t.totalTokenCount||0,a=t.cachedContentTokenCount||0,s=t.toolUsePromptTokenCount||0,l=t.thoughtsTokenCount||0,d=this._getModalityCount(t.promptTokensDetails,"AUDIO"),p=this._getModalityCount(t.promptTokensDetails,"TEXT"),u=this._getModalityCount(t.responseTokensDetails,"AUDIO"),m=this._getModalityCount(t.responseTokensDetails,"TEXT");(o<this._prevPeak.promptTokenCount||i<this._prevPeak.responseTokenCount)&&(this._bankedTotals.promptTokenCount+=this._prevPeak.promptTokenCount,this._bankedTotals.responseTokenCount+=this._prevPeak.responseTokenCount,this._bankedTotals.totalTokenCount+=this._prevPeak.totalTokenCount,this._bankedTotals.cachedContentTokenCount+=this._prevPeak.cachedContentTokenCount,this._bankedTotals.toolUsePromptTokenCount+=this._prevPeak.toolUsePromptTokenCount,this._bankedTotals.thoughtsTokenCount+=this._prevPeak.thoughtsTokenCount,this._bankedTotals.prompt_AUDIO+=this._prevPeak.prompt_AUDIO,this._bankedTotals.prompt_TEXT+=this._prevPeak.prompt_TEXT,this._bankedTotals.response_AUDIO+=this._prevPeak.response_AUDIO,this._bankedTotals.response_TEXT+=this._prevPeak.response_TEXT,this._prevPeak={promptTokenCount:0,responseTokenCount:0,totalTokenCount:0,cachedContentTokenCount:0,toolUsePromptTokenCount:0,thoughtsTokenCount:0,prompt_AUDIO:0,prompt_TEXT:0,response_AUDIO:0,response_TEXT:0}),this._prevPeak.promptTokenCount=Math.max(this._prevPeak.promptTokenCount,o),this._prevPeak.responseTokenCount=Math.max(this._prevPeak.responseTokenCount,i),this._prevPeak.totalTokenCount=Math.max(this._prevPeak.totalTokenCount,n),this._prevPeak.cachedContentTokenCount=Math.max(this._prevPeak.cachedContentTokenCount,a),this._prevPeak.toolUsePromptTokenCount=Math.max(this._prevPeak.toolUsePromptTokenCount,s),this._prevPeak.thoughtsTokenCount=Math.max(this._prevPeak.thoughtsTokenCount,l),this._prevPeak.prompt_AUDIO=Math.max(this._prevPeak.prompt_AUDIO,d),this._prevPeak.prompt_TEXT=Math.max(this._prevPeak.prompt_TEXT,p),this._prevPeak.response_AUDIO=Math.max(this._prevPeak.response_AUDIO,u),this._prevPeak.response_TEXT=Math.max(this._prevPeak.response_TEXT,m);let f=this._bankedTotals.prompt_AUDIO+this._prevPeak.prompt_AUDIO,h=this._bankedTotals.prompt_TEXT+this._prevPeak.prompt_TEXT,v=this._bankedTotals.promptTokenCount+this._prevPeak.promptTokenCount,T=this._bankedTotals.response_AUDIO+this._prevPeak.response_AUDIO,E=this._bankedTotals.responseTokenCount+this._prevPeak.responseTokenCount;this._tokenUsage.token_audio_input=f,this._tokenUsage.token_text_input=h,this._tokenUsage.token_cached_input=Math.max(0,v-f-h),this._tokenUsage.token_audio_output=T,this._tokenUsage.token_text_output=Math.max(0,E-T),this._tokenUsage.thoughts_tokens=this._bankedTotals.thoughtsTokenCount+this._prevPeak.thoughtsTokenCount,this._tokenUsage.tool_use_prompt_tokens=this._bankedTotals.toolUsePromptTokenCount+this._prevPeak.toolUsePromptTokenCount,console.log(`[UsageTracker] \u{1F4CA} Token update #${this._usageMessageCount}: in(audio=${f}, text=${h}, cached=${this._tokenUsage.token_cached_input}) out(audio=${T}, text=${this._tokenUsage.token_text_output}, think=${this._tokenUsage.thoughts_tokens})`)}_getModalityCount(t,o){if(!Array.isArray(t))return 0;let i=t.find(n=>n.modality===o);return i&&i.tokenCount||0}recordError(t){t&&this.errors.push(`${new Date().toISOString()}: ${t}`)}getPayload(){this.transitionSpeaker("none");let t=Date.now(),o=(t-this.startTime)/1e3,i=Math.max(0,o-this.totalBotDuration),n=this.history.splice(0,this.history.length);return{sessionId:this.sessionId,session_end_time:t,duration:{total:parseFloat(o.toFixed(2)),user:parseFloat(i.toFixed(2)),bot:parseFloat(this.totalBotDuration.toFixed(2))},interruptionCount:this.interruptionCount,history:n,tokenUsage:{token_audio_input:this._tokenUsage.token_audio_input,token_audio_output:this._tokenUsage.token_audio_output,token_text_input:this._tokenUsage.token_text_input,token_text_output:this._tokenUsage.token_text_output,token_cached_input:this._tokenUsage.token_cached_input,thoughts_tokens:this._tokenUsage.thoughts_tokens,tool_use_prompt_tokens:this._tokenUsage.tool_use_prompt_tokens,usage_message_count:this._usageMessageCount},deviceInfo:{userAgent:navigator.userAgent,deviceType:window.innerWidth<=440?"mobile":"desktop",screenResolution:`${window.screen.width}x${window.screen.height}`,networkType:navigator.connection?navigator.connection.effectiveType:"unknown"},metrics:{connectionErrors:this.errors}}}};var Jo=`
/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Realtime Mode \u2014 Shared Styles
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */

/* \u2500\u2500 Hide chat widget panel/FAB \u2500\u2500 */
#botnoi-chat-widget { display: none !important; }

/* \u2500\u2500 Avatar container base \u2500\u2500 */
#avatar-widget-container {
    opacity: 0;
    pointer-events: none;
    /* High z-index so avatar always renders above host page content.
       Layering budget:
         2147483600  \u2013 avatar container (this rule)
         2147483640  \u2013 realtime controls (call/volume buttons)
         2147483644  \u2013 speech bubble container
         2147483645+ \u2013 reserved for future UI (tooltips, notifications, etc.) */
    z-index: 2147483600 !important;
    transition: opacity 0.4s ease-in-out !important;
}
#avatar-widget-container.bcw-rt-avatar-animate {
    transition: left 0.5s cubic-bezier(.4, 0, .2, 1),
                top 0.5s cubic-bezier(.4, 0, .2, 1),
                width 0.5s cubic-bezier(.4, 0, .2, 1),
                height 0.5s cubic-bezier(.4, 0, .2, 1),
                border-radius 0.5s cubic-bezier(.4, 0, .2, 1) !important;
}
#avatar-widget-container.bcw-rt-avatar-visible {
    opacity: 1 !important;
}
#avatar-widget-container canvas {
    width: 100% !important;
    height: 100% !important;
    display: block;
    transition: border-radius 0.5s cubic-bezier(.4, 0, .2, 1) !important;
}

/* \u2500\u2500 Fullscreen avatar \u2500\u2500 */
#avatar-widget-container.bcw-rt-avatar-fullscreen {
    position: fixed !important;
    inset: 0 !important;
    width: 100dvw !important;
    height: 100dvh !important;
    left: 0 !important; right: 0 !important;
    top: 0 !important; bottom: 0 !important;
    transform: none !important;
    border-radius: 0 !important;
}
#avatar-widget-container.bcw-rt-avatar-fullscreen canvas {
    border-radius: 0 !important;
}

/* \u2500\u2500 Widget avatar (bottom-right corner) \u2500\u2500 */
#avatar-widget-container.bcw-rt-avatar-widget {
    position: fixed !important;
    bottom: 16px !important;
    right: 16px !important;
    width: 340px !important;
    height: 475px !important;
    /* Avoid left: auto and top: auto so transitions can interpolate smoothly! */
    left: calc(100dvw - 340px - 16px) !important;
    top: calc(100dvh - 460px - 16px) !important;
    border-radius: 24px !important;
    overflow: visible !important;
}
#avatar-widget-container.bcw-rt-avatar-widget canvas {
    border-radius: 24px !important;
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Controls \u2014 Bottom-right button stack
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
#bcw-rt-controls {
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 2147483640;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

/* \u2500\u2500 Base button \u2500\u2500 */
.bcw-rt-btn {
    box-sizing: border-box !important;
    padding: 0 !important;
    margin: 0 !important;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    transition:
        background 0.35s ease,
        box-shadow 0.35s ease,
        transform 0.2s cubic-bezier(.34,1.56,.64,1);
    -webkit-tap-highlight-color: transparent;
}
.bcw-rt-btn:hover { transform: scale(1.1); }
.bcw-rt-btn:active { transform: scale(0.95); }
.bcw-rt-btn svg {
    width: 26px; height: 26px;
    fill: #fff;
    stroke: none;
}

/* \u2500\u2500 Connect button \u2500\u2500 */
.bcw-rt-btn-connect {
    width: 72px;
    height: 72px;
    background: radial-gradient(circle at 35% 35%, #4ade80, #16a34a);
    box-shadow: 0 6px 24px rgba(34,197,94,0.55), 0 2px 8px rgba(0,0,0,0.3);
}
.bcw-rt-btn-connect:hover {
    box-shadow: 0 8px 32px rgba(34,197,94,0.70), 0 2px 8px rgba(0,0,0,0.3);
}
.bcw-rt-btn-connect svg {
    width: 32px; height: 32px;
}

/* Connected state (red) */
.bcw-rt-btn-connect.bcw-rt-connected {
    background: radial-gradient(circle at 35% 35%, #f87171, #dc2626);
    box-shadow: 0 6px 24px rgba(239,68,68,0.55), 0 2px 8px rgba(0,0,0,0.3);
}
.bcw-rt-btn-connect.bcw-rt-connected:hover {
    box-shadow: 0 8px 32px rgba(239,68,68,0.70), 0 2px 8px rgba(0,0,0,0.3);
}

/* Connecting spinner */
.bcw-rt-btn-connect.bcw-rt-connecting {
    background: radial-gradient(circle at 35% 35%, #93c5fd, #3b82f6);
    box-shadow: 0 6px 24px rgba(59,130,246,0.55), 0 2px 8px rgba(0,0,0,0.3);
    animation: bcw-rt-pulse 1.2s ease-in-out infinite;
}
@keyframes bcw-rt-pulse {
    0%,100% { opacity: 1; }
    50% { opacity: 0.65; }
}

/* \u2500\u2500 Glow indicator on connect button \u2500\u2500 */
@keyframes bcw-rt-glow-breathe {
    0%,100% { box-shadow: 0 0 0 4px rgba(34,197,94,0.35), 0 0 30px rgba(34,197,94,0.25), 0 0 8px rgba(0,0,0,0.3); }
    50%     { box-shadow: 0 0 0 8px rgba(34,197,94,0.55), 0 0 50px rgba(34,197,94,0.40), 0 0 8px rgba(0,0,0,0.3); }
}
@keyframes bcw-rt-glow-speak {
    0%,100% { box-shadow: 0 0 0 4px rgba(96,165,250,0.45), 0 0 30px rgba(96,165,250,0.30), 0 0 8px rgba(0,0,0,0.3); }
    50%     { box-shadow: 0 0 0 10px rgba(96,165,250,0.70), 0 0 60px rgba(96,165,250,0.50), 0 0 8px rgba(0,0,0,0.3); }
}

.bcw-rt-glow-listening {
    animation: bcw-rt-glow-breathe 2.5s ease-in-out infinite !important;
}
.bcw-rt-glow-speaking {
    animation: bcw-rt-glow-speak 1.1s ease-in-out infinite !important;
}

/* \u2500\u2500 Secondary buttons \u2500\u2500 */
.bcw-rt-btn-secondary {
    background: rgba(17, 24, 39, 0.75) !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    box-shadow: 0 4px 16px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.15) !important;
}
.bcw-rt-btn-secondary svg {
    fill: #ffffff !important;
}
.bcw-rt-btn-secondary:hover {
    background: rgba(17, 24, 39, 0.85) !important;
    box-shadow: 0 6px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.2) !important;
}

/* Fly-out animation */
.bcw-rt-hidden {
    display: none !important;
}

.bcw-rt-btn-enter {
    animation: bcw-rt-flyout 0.4s cubic-bezier(.34,1.56,.64,1) forwards;
}
@keyframes bcw-rt-flyout {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.5);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Volume control
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */

#bcw-rt-volume-wrap,
#bcw-rt-expand-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Slider track \u2014 vertical, slides out upward */
#bcw-rt-slider-track {
    width: 30px;
    height: 0;
    overflow: hidden;
    transition: height 0.35s cubic-bezier(.4, 0, .2, 1),
                margin-bottom 0.35s cubic-bezier(.4, 0, .2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 22px;
    margin-bottom: 0;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}

.bcw-rt-volume-open #bcw-rt-slider-track {
    height: 140px;
    margin-bottom: 8px;
}

/* Vertical range input */
#bcw-rt-volume-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 116px;
    height: 6px;
    background: transparent;
    transform: rotate(-90deg);
    transform-origin: center center;
    cursor: pointer;
    margin: 0;
}

#bcw-rt-volume-slider::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2));
}
#bcw-rt-volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    margin-top: -7px;
    cursor: pointer;
    transition: transform 0.15s ease;
}
#bcw-rt-volume-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
}

/* Firefox */
#bcw-rt-volume-slider::-moz-range-track {
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2));
}
#bcw-rt-volume-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    border: none;
    cursor: pointer;
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Bubble
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */

#bcw-rt-bubble-container {
    position: fixed;
    top: 2vh;
    left: 50%;
    transform: translateX(-50%);
    width: min(620px, 88vw);
    z-index: 2147483644;
    pointer-events: none;
    display: flex;
    justify-content: center;
}

/* Position bubble absolute above the avatar container depending on mode */
#avatar-widget-container #bcw-rt-bubble-container {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2147483644;
    pointer-events: none;
    display: flex;
    justify-content: center;
}

.bcw-rt-avatar-fullscreen #bcw-rt-bubble-container {
    top: 2vh;
    bottom: auto;
    width: min(620px, 88vw);
}

.bcw-rt-avatar-widget #bcw-rt-bubble-container {
    top: auto;
    bottom: calc(100% + 12px);
    width: min(320px, 85vw);
    align-items: flex-end;
}

.bcw-rt-bubble {
    position: relative;
    background: linear-gradient(135deg,
        rgba(255,255,255,0.96) 0%,
        rgba(224,242,255,0.96) 100%);
    border: 3px solid rgba(255,255,255,0.9);
    border-radius: 28px;
    padding: 18px 28px;
    font-size: clamp(15px, 2.2vw, 21px);
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-weight: 600;
    color: #12122a;
    line-height: 1.55;
    text-align: center;
    box-shadow:
        0 8px 32px rgba(0,0,0,0.28),
        0 0 0 2px rgba(147,210,255,0.6),
        inset 0 1px 0 rgba(255,255,255,0.8);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    opacity: 0;
    transform: translateY(-14px) scale(0.92);
    transition: opacity 0.45s cubic-bezier(.22,.61,.36,1),
                transform 0.55s cubic-bezier(.34,1.56,.64,1);
    max-width: 100%;
    word-wrap: break-word;
}

/* Cartoon tail */
.bcw-rt-bubble::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 0; height: 0;
    border-left: 14px solid transparent;
    border-right: 14px solid transparent;
    border-top: 20px solid rgba(224,242,255,0.96);
    filter: drop-shadow(0 4px 3px rgba(0,0,0,0.12));
}
.bcw-rt-bubble::before {
    content: '';
    position: absolute;
    bottom: -24px;
    left: 50%;
    transform: translateX(-50%);
    width: 0; height: 0;
    border-left: 17px solid transparent;
    border-right: 17px solid transparent;
    border-top: 22px solid rgba(255,255,255,0.9);
}

.bcw-rt-bubble.bcw-rt-bubble-in {
    opacity: 1;
    transform: translateY(0) scale(1);
}
.bcw-rt-bubble.bcw-rt-bubble-out {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
    transition: opacity 0.55s ease, transform 0.55s ease;
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Connecting pulse rings
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
#bcw-rt-call-btn-wrap {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 72px;
    height: 72px;
}

.bcw-rt-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    pointer-events: none;
    z-index: -1;
    opacity: 0;
    box-sizing: border-box;
    border: 2px solid rgba(147, 197, 253, 0.85);
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
    transform-origin: center center;
}

.bcw-rt-connecting-state .bcw-rt-ring {
    animation: bcw-rt-ring-pulse 2.4s cubic-bezier(0.25, 0, 0, 1) infinite;
}

.bcw-rt-connecting-state .bcw-rt-ring-1 {
    animation-delay: 0s;
}

.bcw-rt-connecting-state .bcw-rt-ring-2 {
    animation-delay: 0.8s;
}

.bcw-rt-connecting-state .bcw-rt-ring-3 {
    animation-delay: 1.6s;
}

@keyframes bcw-rt-ring-pulse {
    0% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.85;
    }
    100% {
        transform: translate(-50%, -50%) scale(2.4);
        opacity: 0;
    }
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Countdown UI
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
#realtime-countdown-pill {
    position: fixed;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.75);
    color: white;
    padding: 10px 20px;
    border-radius: 30px;
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 2147483647;
    backdrop-filter: blur(8px);
    transition: top 0.4s cubic-bezier(.34,1.56,.64,1);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
#realtime-countdown-pill.visible {
    top: 24px;
}
.countdown-dot {
    width: 10px;
    height: 10px;
    background: #f87171;
    border-radius: 50%;
    animation: countdown-pulse 1s ease-in-out infinite;
}
@keyframes countdown-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Mobile tweaks
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */

@media (max-width: 480px) {
    #bcw-rt-controls {
        bottom: 20px;
        right: 20px;
        gap: 10px;
    }
    #bcw-rt-call-btn-wrap {
        width: 62px;
        height: 62px;
    }
    .bcw-rt-btn-connect {
        width: 62px;
        height: 62px;
    }
    .bcw-rt-btn-connect svg { width: 28px; height: 28px; }
    .bcw-rt-btn { width: 50px; height: 50px; }
    .bcw-rt-btn svg { width: 22px; height: 22px; }
    .bcw-rt-bubble { padding: 14px 20px; }

    /* Widget sizing for mobile */
    #avatar-widget-container.bcw-rt-avatar-widget {
        width: 280px !important;
        height: 390px !important;
        bottom: 12px !important;
        right: 12px !important;
        left: calc(100dvw - 280px - 12px) !important;
        top: calc(100dvh - 380px - 12px) !important;
        border-radius: 20px !important;
    }
}
`;function Qo(){return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C11.2 30.3 0 46 0 64
        C0 311.4 200.6 512 448 512c18 0 33.8-11.2 38.6-29.5l24-88
        c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368
        C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/>
    </svg>`}function Zo(){return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <g transform="rotate(135 256 256)">
            <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C11.2 30.3 0 46 0 64
            C0 311.4 200.6 512 448 512c18 0 33.8-11.2 38.6-29.5l24-88
            c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368
            C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/>
        </g>
    </svg>`}function ti(){return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
        <g transform="translate(0, 64)">
            <path d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5
            s-6.8-25.4 3.5-33.8C557.5 398.2 592 330.8 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8
            s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5
            s-6.8-25.4 3.5-33.8C446.9 339.7 464 300.4 464 256s-17.1-83.7-51.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8
            s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3
            L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/>
        </g>
    </svg>`}function ei(){return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 576">
        <g transform="translate(0, 32)">
            <path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3
            L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z
            M425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9
            s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55
            c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"/>
        </g>
    </svg>`}function oi(){return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M4 4h6v2H6v4H4V4zm14 0h-6v2h4v4h2V4zM4 20h6v-2H6v-4H4v6zm14 0h-6v-2h4v-4h2v6z"/>
    </svg>`}function ii(){return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M10 10H4V8h4V4h2v6zm4 0h6V8h-4V4h-2v6zM10 14H4v2h4v4h2v-6zm4 0h6v2h-4v4h-2v-6z"/>
    </svg>`}H();F();var q=null,J=null,Ot=null,Ke=!1,_=null,ni=null,j=null,Q="realtime-fullscreen",Rt=!1,ve=!1,Et=null,Tt=null,X=null,Pt=null,Nt=null,ai=!1,Je=!1,W={DISCONNECTED:"DISCONNECTED",LISTENING:"LISTENING",SPEAKING:"SPEAKING"},Qe=W.DISCONNECTED;function zt(e){if(Qe===e)return;let t=Qe;Qe=e,t===W.SPEAKING?(_&&_.transitionSpeaker("user"),A&&A.classList.remove("bcw-rt-glow-speaking")):t===W.LISTENING&&A&&A.classList.remove("bcw-rt-glow-listening"),e===W.LISTENING?(A&&A.classList.add("bcw-rt-glow-listening"),pt("Listening\u2026")):e===W.SPEAKING?(_&&t!==W.SPEAKING&&_.transitionSpeaker("bot"),A&&A.classList.add("bcw-rt-glow-speaking"),pt("Speaking\u2026"),j&&(clearTimeout(j),j=null)):e===W.DISCONNECTED&&(_&&t===W.SPEAKING&&_.transitionSpeaker("user"),A&&A.classList.remove("bcw-rt-connected","bcw-rt-connecting","bcw-rt-glow-listening","bcw-rt-glow-speaking"))}var S=null,A=null,G=null,ct=null,C=null,dt=null,Y=null,ri=null,ut=null,y=null,K=null,kt={x:0,y:-.07,z:-4},Mn=.04,Sn=.6;async function bi(e){Q=e,Vn(),Cn(),Q==="realtime-fullscreen"&&await si()}async function si(){if(!ve){if(b.AVATAR_ENABLED&&!window.WebAvatar){let e=b.AVATAR_WIDGET_SRC;await Hn(e)}if(window.WebAvatar){let t={modelUrl:b.getAttribute("data-avatar-url")||"Botnoi",defaultAnimationUrl:"Idleloop",cameraTarget:kt};Q==="realtime-fullscreen"?(t.width=window.innerWidth,t.height=window.innerHeight):(t.width=340,t.height=460),window.WebAvatar.init(t);let o=()=>{y=document.getElementById("avatar-widget-container"),y&&(Q==="realtime-fullscreen"||Rt?y.classList.add("bcw-rt-avatar-fullscreen"):y.classList.add("bcw-rt-avatar-widget"),Ze(),window.ResizeObserver&&(K&&K.disconnect(),K=new ResizeObserver(()=>{window.dispatchEvent(new Event("resize"))}),K.observe(y)),window.dispatchEvent(new Event("resize")),requestAnimationFrame(()=>{y.classList.add("bcw-rt-avatar-visible")}))};document.getElementById("avatar-widget-container")?o():window.addEventListener("avatar-widget-ready",o,{once:!0}),ve=!0}}}function Ze(){let e=document.getElementById("avatar-widget-container");S||(S=document.createElement("div"),S.id="bcw-rt-bubble-container"),e?(S.parentNode!==e&&e.appendChild(S),y=e):S.parentNode!==document.body&&document.body.appendChild(S)}function Cn(){Ze(),ut=document.createElement("div"),ut.id="bcw-rt-controls",C=document.createElement("div"),C.id="bcw-rt-volume-wrap",C.className="bcw-rt-hidden",dt=document.createElement("button"),dt.className="bcw-rt-btn bcw-rt-btn-secondary",dt.setAttribute("aria-label","Volume"),dt.innerHTML=ui(),Y=document.createElement("input"),Y.type="range",Y.id="bcw-rt-volume-slider",Y.min="0",Y.max="100",Y.value="80",Y.setAttribute("aria-label","Volume level"),Y.addEventListener("input",On);let e=document.createElement("div");e.id="bcw-rt-slider-track",e.appendChild(Y),C.appendChild(e),C.appendChild(dt);let t=null;C.addEventListener("mouseenter",()=>{t&&(clearTimeout(t),t=null),C.classList.add("bcw-rt-volume-open")}),C.addEventListener("mouseleave",()=>{t=setTimeout(()=>{C.classList.remove("bcw-rt-volume-open")},400)});let o=n=>{n.stopPropagation(),n.preventDefault(),C.classList.toggle("bcw-rt-volume-open")};dt.addEventListener("pointerdown",o),dt.addEventListener("click",n=>{n.stopPropagation(),C.classList.contains("bcw-rt-volume-open")||C.classList.add("bcw-rt-volume-open")}),ut.appendChild(C),ct=document.createElement("div"),ct.id="bcw-rt-expand-wrap",ct.className="bcw-rt-hidden",G=document.createElement("button"),G.id="bcw-rt-expand-btn",G.className="bcw-rt-btn bcw-rt-btn-secondary",G.setAttribute("aria-label","Expand"),G.innerHTML=pi(),G.addEventListener("click",Rn),ct.appendChild(G),ut.appendChild(ct);let i=document.createElement("div");i.id="bcw-rt-call-btn-wrap";for(let n=1;n<=3;n++){let a=document.createElement("div");a.className=`bcw-rt-ring bcw-rt-ring-${n}`,i.appendChild(a)}A=document.createElement("button"),A.id="bcw-rt-call-btn",A.className="bcw-rt-btn bcw-rt-btn-connect",A.setAttribute("aria-label","Connect to AI"),A.innerHTML=di(),A.addEventListener("click",Bn),i.appendChild(A),ut.appendChild(i),document.body.appendChild(ut)}function li(e){if(X)return;X=document.createElement("div"),X.id="realtime-countdown-pill";let t=document.createElement("div");t.className="countdown-dot";let o=document.createElement("span");X.appendChild(t),X.appendChild(o),document.body.appendChild(X),X.offsetWidth,X.classList.add("visible");let i=Math.ceil(e);o.textContent=`Session ending in ${i}s`,Tt&&clearInterval(Tt),Tt=setInterval(()=>{i--,i<=0?(clearInterval(Tt),o.textContent="Session ended"):o.textContent=`Session ending in ${i}s`},1e3)}async function Bn(){if(Ke){ee();return}await Ln()}async function Ln(){let e=b.WIDGET_ID||b.getAttribute("data-widget-id");if(!e){console.error("[GeminiLive] No data-widget-id configured."),pt("No widget ID");return}A.disabled=!0,A.classList.add("bcw-rt-connecting"),ut.classList.add("bcw-rt-connecting-state"),pt("Requesting mic...");try{Ot=new ge({connected:!1,sendAudioMessage:(o,i)=>q&&q.sendAudioChunk(o,i)}),await Ot.start(),pt("Connecting to AI..."),J=new he,await J.init();let t=parseInt(Y.value,10)/100;J.setVolume(t),q=new xe({greetingInstruction:b.GREETING_INSTRUCTION||b.getAttribute("data-greeting-instruction")||"",onAudioData:Nn,onTextData:zn,onInterrupt:Un,onUserText:o=>{_&&(_.transitionSpeaker("user"),_.addHistoryMessage("user",o))},onTurnComplete:Wn,onLog:null,onToolCallExecuted:(o,i,n,a)=>{_&&(_.addToolCall(o,i,n),_.addToolResponse(o,i,a))},onUsageMetadata:o=>{_&&_.recordUsageMetadata(o)},onGoAway:o=>{li(o)},onDisconnect:o=>{console.log(`[App] Disconnecting because: ${o}`),ee()}}),await q.connectWithWidgetId(e),_=new we(e,"gemini-live",Q,q.bargeInEnabled),_.startSession(),jn(),Ot.client.connected=!0,c._onSendTextMessage=o=>{q&&(o.startsWith("[SYSTEM]")||_&&(_.transitionSpeaker("user"),_.addHistoryMessage("user",o)),q.sendUserMessage(o))},Q==="realtime-widget"&&(Et&&(clearTimeout(Et),Et=null,window.ResizeObserver&&y&&(K&&K.disconnect(),K=new ResizeObserver(()=>{window.dispatchEvent(new Event("resize"))}),K.observe(y))),ve?y&&y.classList.add("bcw-rt-avatar-visible"):await si()),Ke=!0,A.disabled=!1,A.classList.remove("bcw-rt-connecting"),ut.classList.remove("bcw-rt-connecting-state"),A.classList.add("bcw-rt-connected"),A.setAttribute("aria-label","End call"),A.innerHTML=Fn(),Pt&&clearTimeout(Pt),Pt=setTimeout(()=>{console.warn("[App] Fallback timer triggered. Disconnecting."),ee()},195*1e3),Nt&&clearTimeout(Nt),Nt=setTimeout(()=>{li(10)},170*1e3),zt(W.LISTENING),In()}catch(t){console.error("[GeminiLive] Connection error:",t),A.disabled=!1,A.classList.remove("bcw-rt-connecting"),t.name==="NotAllowedError"||t.name==="NotFoundError"?(alert("Microphone access was denied. If you are in an app like LINE, please tap the menu and select 'Open in Browser'."),pt("Mic access denied")):pt("Connection failed"),setTimeout(()=>pt("Tap to connect"),3e3),ee()}}function ee(e=!1){if(!Je){if(Je=!0,Pt&&(clearTimeout(Pt),Pt=null),Nt&&(clearTimeout(Nt),Nt=null),Tt&&(clearInterval(Tt),Tt=null),X&&(X.classList.remove("visible"),setTimeout(()=>{X&&X.remove(),X=null},300)),_){let t=S?S.querySelector(".bcw-rt-bubble:not(.tracked-bubble)"):null;t&&t.textContent&&(_.addHistoryMessage("bot",t.textContent),t.classList.add("tracked-bubble")),_.stopSession(e)}_=null,c._onSendTextMessage=null,q&&(q.disconnect(),q=null),Ot&&(Ot.stop(),Ot=null),J&&(J.destroy(),J=null),window.WebAvatar&&(window.WebAvatar.stopAudio?window.WebAvatar.stopAudio():window.WebAvatar.endAudio&&window.WebAvatar.endAudio(),window.WebAvatar.loadAnimation&&window.WebAvatar.loadAnimation("GreetLow")),Ke=!1,zt(W.DISCONNECTED),ut.classList.remove("bcw-rt-connecting-state"),A.innerHTML=di(),A.setAttribute("aria-label","Connect to AI"),ye(!0),pt("Tap to connect"),$n(),Q==="realtime-widget"&&y&&(y.classList.remove("bcw-rt-avatar-visible"),Rt&&ci(!0),K&&(K.disconnect(),K=null),Et&&clearTimeout(Et),Et=setTimeout(()=>{if(Et=null,window.WebAvatar&&typeof window.WebAvatar.disconnect=="function")try{window.WebAvatar.disconnect()}catch(o){console.error("[GeminiLive] Failed to disconnect WebAvatar:",o)}ve=!1,y=null},450)),Je=!1}}function In(){C.classList.remove("bcw-rt-hidden"),requestAnimationFrame(()=>{requestAnimationFrame(()=>{C.classList.add("bcw-rt-btn-enter")})}),Q==="realtime-widget"&&setTimeout(()=>{ct.classList.remove("bcw-rt-hidden"),requestAnimationFrame(()=>{requestAnimationFrame(()=>{ct.classList.add("bcw-rt-btn-enter")})})},80)}function $n(){C.classList.remove("bcw-rt-volume-open"),C.classList.remove("bcw-rt-btn-enter"),ct.classList.remove("bcw-rt-btn-enter"),setTimeout(()=>{C.classList.add("bcw-rt-hidden"),ct.classList.add("bcw-rt-hidden")},300)}function On(){let e=parseInt(Y.value,10)/100;window.WebAvatar&&typeof window.WebAvatar.setVolume=="function"&&window.WebAvatar.setVolume(e),e===0?dt.innerHTML=Xn():dt.innerHTML=ui()}function Rn(){Rt?ci(!1):Pn()}function Pn(){Rt=!0,y&&(y.classList.add("bcw-rt-avatar-animate"),y.classList.remove("bcw-rt-avatar-widget"),y.classList.add("bcw-rt-avatar-fullscreen")),G.innerHTML=qn(),G.setAttribute("aria-label","Contract"),setTimeout(()=>{y&&y.classList.remove("bcw-rt-avatar-animate"),window.dispatchEvent(new Event("resize"))},550)}function ci(e){Rt=!1,e&&y?y.style.transition="none":y&&y.classList.add("bcw-rt-avatar-animate"),y&&(y.classList.remove("bcw-rt-avatar-fullscreen"),y.classList.add("bcw-rt-avatar-widget")),G.innerHTML=pi(),G.setAttribute("aria-label","Expand"),e&&requestAnimationFrame(()=>{y&&(y.style.transition="")}),setTimeout(()=>{!e&&y&&y.classList.remove("bcw-rt-avatar-animate"),window.dispatchEvent(new Event("resize"))},e?50:550)}function Nn(e){zt(W.SPEAKING),window.WebAvatar&&window.WebAvatar.pushAudioChunk?window.WebAvatar.pushAudioChunk(e,{pcm:!0,sampleRate:24e3}):J&&J.play(e)}function zn(e){let t=q&&!q.isAiSpeaking;t||zt(W.SPEAKING),Ze(),j&&(clearTimeout(j),j=null);let o=S.querySelector(".bcw-rt-bubble:not(.tracked-bubble)");o||(o=document.createElement("div"),o.className="bcw-rt-bubble",S.appendChild(o),requestAnimationFrame(()=>requestAnimationFrame(()=>o.classList.add("bcw-rt-bubble-in")))),o.textContent=(o.textContent||"")+e,ni=o,requestAnimationFrame(()=>{Dn()}),t&&(j=setTimeout(()=>ye(!1),1e3))}function Wn(){if(zt(W.LISTENING),_){let e=S?S.querySelector(".bcw-rt-bubble:not(.tracked-bubble)"):null;e&&e.textContent&&(_.addHistoryMessage("bot",e.textContent),e.classList.add("tracked-bubble")),_.updateSession()}window.WebAvatar&&window.WebAvatar.endAudio&&window.WebAvatar.endAudio(),j=setTimeout(()=>ye(!1),1e3)}function Un(){if(_){_.interruptionCount++;let e=S?S.querySelector(".bcw-rt-bubble"):null;e&&e.textContent&&_.addHistoryMessage("bot",e.textContent+" (interrupted)")}zt(W.LISTENING),window.WebAvatar&&(window.WebAvatar.stopAudio?window.WebAvatar.stopAudio():window.WebAvatar.endAudio&&window.WebAvatar.endAudio()),J&&J.interrupt(),ye(!0)}function ye(e){j&&(clearTimeout(j),j=null);let t=S?S.querySelector(".bcw-rt-bubble"):null;if(!t){Ee();return}e?(t.remove(),Ee()):(t.classList.remove("bcw-rt-bubble-in"),t.classList.add("bcw-rt-bubble-out"),Ee(),setTimeout(()=>t.remove(),600)),ni=null}function pt(e){ri&&(ri.textContent=e)}function Dn(){if(!window.WebAvatar||!window.WebAvatar.setCameraPosition||Q==="realtime-widget"&&!Rt)return;let e=S?S.querySelector(".bcw-rt-bubble"):null;if(!e){Ee();return}let t=e.offsetHeight;if(!t)return;let o=window.getComputedStyle(e),i=parseFloat(o.paddingTop)||0,n=parseFloat(o.paddingBottom)||0,a=parseFloat(o.borderTopWidth)||0,s=parseFloat(o.borderBottomWidth)||0,l=parseFloat(o.lineHeight);(isNaN(l)||l<=0)&&(l=(parseFloat(o.fontSize)||18)*1.55);let d=i+n+a+s,p=Math.max(0,t-d),u=Math.max(1,Math.round(p/l)),m=Math.min(Sn,u*Mn),g=kt.y+m;window.WebAvatar.setCameraPosition(kt.x,g,kt.z)}function Ee(){window.WebAvatar&&window.WebAvatar.setCameraPosition&&window.WebAvatar.setCameraPosition(kt.x,kt.y,kt.z)}function Hn(e){return new Promise(t=>{let o=document.createElement("script");o.src=e,o.onload=t,o.onerror=t,document.head.appendChild(o)})}function di(){return Qo()}function Fn(){return Zo()}function ui(){return ti()}function Xn(){return ei()}function pi(){return oi()}function qn(){return ii()}function Rr(){let e=document.querySelector('meta[name="viewport"]');e||Q==="realtime-fullscreen"&&(e=document.createElement("meta"),e.name="viewport",e.content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",document.head.appendChild(e),console.warn("[WebAvatar] Viewport meta tag was missing on the page. Injected a default mobile viewport tag for fullscreen mode."))}function Vn(){if(document.getElementById("bcw-rt-style"))return;let e=document.createElement("style");e.id="bcw-rt-style",e.textContent=Jo,document.head.appendChild(e)}function jn(){if(ai)return;ai=!0;let e=()=>{ee(!0)};window.addEventListener("pagehide",e),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&e()})}H();F();Xt();function Gn(e){document.body?e():document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):document.addEventListener("DOMContentLoaded",e,{once:!0})}Gn(function(){if(!window.__bcwInitialized){if(window.__bcwInitialized=!0,b.MODE==="realtime-fullscreen"||b.MODE==="realtime-widget"){bi(b.MODE);return}Xo(),Fo(),b.PROVIDER==="custom"?Yn():Qn()}});function Yn(){c._onSendMessage=function(e){L(R(e,"user")),c.chatHistory.push({sender:"user",text:e,uiText:e});let{saveHistory:t}=ta();t(),c.lastUserInput=e,Xe(e)},c._onClearHistory=function(){confirm("Are you sure you want to clear the chat history? This cannot be undone.")&&window.ChatWidget&&window.ChatWidget.clearHistory()},c._onPanelOpen=function(){c.initialized||(c.initialized=!0,Kn())}}function Kn(){if(b.AVATAR_ENABLED&&!window.WebAvatar){var e=document.createElement("script");e.src=b.AVATAR_WIDGET_SRC,e.onload=function(){mi()},e.onerror=function(){console.warn("[ChatWidget] Failed to load avatar widget."),to()},document.head.appendChild(e)}else b.AVATAR_ENABLED&&window.WebAvatar?mi():to()}function mi(){var e=b.getAttribute("data-avatar-url")||"Botnoi",t=window.innerWidth<=440;window.WebAvatar.init({modelUrl:e,defaultAnimationUrl:"Idleloop",cameraTarget:{x:0,y:0,z:-2},offset:{x:t?50:360,y:90}}),Zn(function(){to()})}function to(){r.inputEl.disabled=!1,r.sendBtn.disabled=!1,r.inputEl.placeholder="Type a message\u2026",N("online","Ready"),b.AUTO_FOCUS_INPUT&&r.inputEl.focus(),c.chatHistory.length>0&&b.MODE!=="avatar"&&Jn()}function Jn(){c.chatHistory.forEach(function(e){if(e.sender==="user"){var t=R(e.uiText||e.text,"user");t.classList.add("bcw-animate-in"),r.messagesEl.appendChild(t)}else if(e.sender==="bot"&&e.reply&&e.reply.text){var t=R(e.reply.text,"bot");t.classList.add("bcw-animate-in"),r.messagesEl.appendChild(t)}}),r.messagesEl.scrollTop=r.messagesEl.scrollHeight}function Qn(){let e=null;c._onPanelOpen=function(){!c.initialized&&!c.needsSetup?(c.initialized=!0,t()):c.needsSetup?t():b.AUTO_FOCUS_INPUT&&r.inputEl.focus()};function t(){Promise.resolve().then(()=>(Lo(),Bo)).then(function(o){e=o;let{sendMessage:i,clearChatHistory:n,disconnectAbly:a}=o.getBotnoiFunctions();c._onSendMessage=function(s){i(s)},c._onClearHistory=function(){n()},window._bcwDisconnects=window._bcwDisconnects||[],window._bcwDisconnects.push(function(){a(),c.avatarPoll&&(clearInterval(c.avatarPoll),c.avatarPoll=null),c.avatarListener&&(window.removeEventListener("avatar-widget-ready",c.avatarListener),c.avatarListener=null),c._container&&c._container.parentNode&&c._container.parentNode.removeChild(c._container),c.initialized=!1,c.isOpen=!1,c.needsSetup=!1}),window.botnoiApp={loadAblyAndInit:o.loadAblyAndInitBotnoi,disconnect:function(){a()}},c.needsSetup?o.showBotnoiSetup(o.loadAblyAndInitBotnoi):o.loadAblyAndInitBotnoi()}).catch(function(o){console.error("[ChatWidget] Failed to load Botnoi provider:",o),N("offline","Load Error")})}}function Zn(e){var t=!1;function o(){t||(t=!0,c.avatarReady=!0,c.isOpen&&Mt(),e&&e())}function i(){window.removeEventListener("avatar-widget-ready",i),o()}c.avatarListener=i,window.addEventListener("avatar-widget-ready",i);var n=0;c.avatarPoll=setInterval(function(){n++;var a=document.getElementById("avatar-widget-container");if(a){var s=a.querySelector("canvas");s&&s.width>0&&(setTimeout(function(){c.avatarPoll&&clearInterval(c.avatarPoll),o()},500),c.avatarPoll&&clearInterval(c.avatarPoll))}n>=150&&(c.avatarPoll&&clearInterval(c.avatarPoll),o())},200)}function ta(){return{saveHistory:function(){b.PERSIST_HISTORY&&localStorage.setItem(`botnoi_history_${c.userId}`,JSON.stringify(c.chatHistory))}}}})();
