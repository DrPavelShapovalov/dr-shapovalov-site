(function(){var d=document.documentElement;d.classList.add('js');
var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
try{var b=navigator.userAgentData&&navigator.userAgentData.brands;if(b&&b.some(function(x){return /Chromium/.test(x.brand)})&&CSS.supports('backdrop-filter','url(#lg) blur(1px)'))d.classList.add('lg')}catch(e){}
function ready(){
 var rv=[].slice.call(document.querySelectorAll('.rv'));
 function show(el){el.classList.add('in');[].forEach.call(el.querySelectorAll('[data-count]'),count)}
 function count(el){if(rm||el.dataset.done)return;el.dataset.done=1;var to=+el.dataset.count,t0=0,txt=el.textContent,pre=txt.charAt(0)==='≈'?'≈':'';
  function f(t){t0=t0||t;var k=Math.min(1,(t-t0)/1200),v=Math.round(to*(1-Math.pow(1-k,3)));el.textContent=pre+v;if(k<1)requestAnimationFrame(f);else el.textContent=txt}requestAnimationFrame(f)}
 if(rm||!('IntersectionObserver' in window))rv.forEach(show);
 else{var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){show(x.target);io.unobserve(x.target)}})},{rootMargin:'0px 0px -10% 0px'});rv.forEach(function(el){io.observe(el)})}
 var tl=document.querySelector('.tl'),raf=0;
 function upd(){raf=0;if(!tl)return;var r=tl.getBoundingClientRect(),p=(innerHeight*.55-r.top)/r.height;tl.style.setProperty('--p',Math.max(0,Math.min(1,p)).toFixed(4))}
 addEventListener('scroll',function(){if(!raf)raf=requestAnimationFrame(upd)},{passive:true});addEventListener('resize',upd);upd();
 var links={};[].forEach.call(document.querySelectorAll('.years a'),function(a){links[a.getAttribute('href').slice(1)]=a});
 if('IntersectionObserver' in window){var yo=new IntersectionObserver(function(es){es.forEach(function(x){if(!x.isIntersecting)return;
  for(var k in links)links[k].removeAttribute('aria-current');var a=links[x.target.id];if(a){a.setAttribute('aria-current','true');
  var bar=a.parentNode;bar.scrollTo({left:a.offsetLeft-bar.clientWidth/2+a.clientWidth/2,behavior:rm?'auto':'smooth'})}})},{rootMargin:'-40% 0px -55% 0px'});
  Object.keys(links).forEach(function(id){var s=document.getElementById(id);if(s)yo.observe(s)})}
 if(!rm)document.addEventListener('pointermove',function(ev){var g=ev.target.closest&&ev.target.closest('.glass');if(!g)return;var r=g.getBoundingClientRect();
  g.style.setProperty('--mx',(ev.clientX-r.left)+'px');g.style.setProperty('--my',(ev.clientY-r.top)+'px')},{passive:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();
