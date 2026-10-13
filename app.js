'use strict';
const stalls=[
['whampoa','Singapore Fried Hokkien Mee','Whampoa','90 Whampoa Drive, #01-32, Singapore 320090',1.3237,103.8567,'wet'],
['hongheng','Hong Heng Fried Sotong Prawn Mee','Tiong Bahru','30 Seng Poh Road, #02-01, Singapore 168898',1.2847,103.8329,'unknown'],
['comedaily','Come Daily Fried Hokkien Prawn Mee','Toa Payoh','127 Lorong 1 Toa Payoh, #02-27, Singapore 310127',1.3381,103.8443,'wet'],
['xiaodi','Xiao Di Fried Prawn Noodle','Serangoon North','153 Serangoon North Avenue 1, #01-512, Singapore 550153',1.3701,103.8706,'wet'],
['hainan','Hainan Fried Hokkien Prawn Mee','Beach Road','505 Beach Road, #B1-34, Singapore 199583',1.3032,103.8637,'dry'],
['ahhock','Ah Hock Fried Hokkien Noodles','Serangoon Gardens','20 Kensington Park Road, Chomp Chomp Food Centre #01-27, Singapore 557269',1.3645,103.8663,'wet'],
['yiji','Yi Ji Fried Hokkien Prawn Mee','Old Airport Road','51 Old Airport Road, #01-102, Singapore 390051',1.3084,103.8857,'wet'],
['sweeguan','Swee Guan Hokkien Mee','Geylang','5 Geylang Lorong 29, Singapore 388060',1.3128,103.8864,'wet'],
['geylang29','Geylang Lorong 29 Fried Hokkien Mee','East Coast','936 East Coast Road, Singapore 459129',1.3132,103.9299,'wet'],
['shbeauty','Shiok Hokkien Mee Beauty World','Beauty World','144 Upper Bukit Timah Road, #04-52, Singapore 588177',1.342,103.7767,'unknown'],
['shbishan','Shiok Hokkien Mee Bishan','Bishan','504 Bishan Street 11, #01-444, Singapore 570504',1.3485,103.8498,'unknown'],
['shgolden','Shiok Hokkien Mee Golden Mile','Beach Road','505 Beach Road, #01-57, Singapore 199583',1.3032,103.8637,'unknown'],
['shbahru','Shiok Hokkien Mee Tiong Bahru','Tiong Bahru','11B Boon Tiong Road, Singapore 163011',1.2864,103.8274,'unknown'],
['shsengkang','Shiok Hokkien Mee Sengkang','Sengkang','279 Sengkang East Avenue, Singapore 540279',1.3849,103.8942,'unknown'],
['bedokcorner','Bedok Corner Hokkien Prawn Mee','Bedok','1 Bedok Road, #01-29, Singapore 469356',1.3207,103.9554,'unknown'],
['simon','Original Simon Road Hokkien Mee','Kovan','209 Hougang Street 21, #01-66, Singapore 530209',1.3598,103.8856,'unknown'],
['hoji','Ho Ji Fried Hokkien Prawn Noodles','Ang Mo Kio','162 Ang Mo Kio Avenue 4, #01-39, Singapore 560162',1.3741,103.8391,'unknown'],
['hokkienman','Hokkien Man Hokkien Mee','Toa Payoh','19 Lorong 7 Toa Payoh, Singapore 310019',1.3367,103.8566,'unknown'],
['neighbourwok','The Neighbourwok','Bukit Batok','177 Bukit Batok West Avenue 8, Singapore 650177',1.3466,103.7423,'unknown'],
['ahhuat','Ah Huat Hokkien Prawn Mee','Toa Payoh','51 Lorong 6 Toa Payoh, #01-62, Singapore 310051',1.3341,103.8507,'unknown']
].map(([id,name,area,address,lat,lng,style])=>({id,name,area,address,lat,lng,style}));
const $=id=>document.getElementById(id);
const state={location:[1.300,103.850],map:null,markers:[],journal:JSON.parse(localStorage.getItem('hh-journal')||'{}'),prefs:JSON.parse(localStorage.getItem('hh-prefs')||'{"preferred":"any","maxDistance":20}')};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dist=s=>{let [a,b]=state.location,rad=Math.PI/180,dLat=(s.lat-a)*rad,dLon=(s.lng-b)*rad,x=Math.sin(dLat/2)**2+Math.cos(a*rad)*Math.cos(s.lat*rad)*Math.sin(dLon/2)**2;return 6371*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))};
const route=s=>'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(s.address);
const journal=id=>state.journal[id]||{};
function save(){localStorage.setItem('hh-journal',JSON.stringify(state.journal));renderAll()}
function toggle(id,key){state.journal[id]??={};state.journal[id][key]=!state.journal[id][key];save()}
function stallCard(s){let j=journal(s.id);return '<div class="stall"><div class="stat"><h3>'+esc(s.name)+'</h3><span class="score">'+dist(s).toFixed(1)+' km</span></div><p class="muted">'+esc(s.area)+' · '+esc(s.address)+'</p><span class="tag">'+esc(s.style)+'</span><div class="actions"><button class="btn secondary" data-save="'+esc(s.id)+'">'+(j.saved?'★ Saved':'☆ Save')+'</button><button class="btn secondary" data-visit="'+esc(s.id)+'">'+(j.visited?'✓ Visited':'Mark visited')+'</button><a class="btn" target="_blank" rel="noopener" href="'+route(s)+'">Directions ↗</a></div></div>'}
function recommend(){let max=Number(state.prefs.maxDistance)||20,mode=$('transport').value,minutes=Number($('minutes').value),speed={driving:25,transit:14,walking:4}[mode],ranked=stalls.map(s=>({...s,km:dist(s)})).filter(s=>s.km<=max&&2*s.km/speed*60+35<=minutes).filter(s=>state.prefs.preferred==='any'||s.style===state.prefs.preferred||s.style==='unknown').sort((a,b)=>a.km-b.km);$('recommendations').innerHTML=ranked.length?ranked.slice(0,6).map(stallCard).join(''):'<p class="muted">No matches within your time and distance limits. Try a longer window.</p>'}
function explore(){let q=$('search').value.toLowerCase(),style=$('style').value,filtered=stalls.filter(s=>(s.name+' '+s.area+' '+s.address).toLowerCase().includes(q)&&(style==='all'||s.style===style)).sort((a,b)=>dist(a)-dist(b));$('listing').innerHTML=filtered.map(stallCard).join('')||'<p>No matches.</p>';if(state.map){state.markers.forEach(m=>m.remove());state.markers=filtered.map(s=>L.marker([s.lat,s.lng]).addTo(state.map).bindPopup('<b>'+esc(s.name)+'</b><p>'+esc(s.address)+'</p><a target="_blank" href="'+route(s)+'">Directions</a>'))}}
function renderAll(){$('count').textContent=stalls.length;$('visitedCount').textContent=Object.values(state.journal).filter(j=>j.visited).length;$('savedCount').textContent=Object.values(state.journal).filter(j=>j.saved).length;$('journalList').innerHTML=stalls.filter(s=>journal(s.id).visited||journal(s.id).saved).map(stallCard).join('')||'<p class="muted">Nothing here yet. Explore stalls and save your favourites.</p>';recommend();explore()}
function tab(name){document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===name));if(name==='explore'){if(!state.map&&window.L){state.map=L.map('map').setView([1.34,103.85],11);L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(state.map)}explore();setTimeout(()=>state.map?.invalidateSize(),50)}}
document.addEventListener('click',e=>{let b=e.target.closest('[data-save],[data-visit],[data-tab],[data-goto]');if(!b)return;if(b.dataset.save)toggle(b.dataset.save,'saved');else if(b.dataset.visit)toggle(b.dataset.visit,'visited');else tab(b.dataset.tab||b.dataset.goto)});
$('recommend').onclick=recommend;$('search').oninput=explore;$('style').onchange=explore;$('minutes').onchange=recommend;$('transport').onchange=recommend;
$('locate').onclick=()=>{if(!navigator.geolocation){$('locationStatus').textContent='Location not available.';return}navigator.geolocation.getCurrentPosition(p=>{state.location=[p.coords.latitude,p.coords.longitude];$('locationStatus').textContent='Using your current location (approximate).';renderAll()},()=>{$('locationStatus').textContent='Location unavailable or permission denied.'},{enableHighAccuracy:false,timeout:12000})};
$('preferred').value=state.prefs.preferred;$('maxDistance').value=state.prefs.maxDistance;
$('saveSettings').onclick=()=>{state.prefs={preferred:$('preferred').value,maxDistance:Math.max(1,Number($('maxDistance').value)||20)};localStorage.setItem('hh-prefs',JSON.stringify(state.prefs));renderAll();alert('Preferences saved')};
$('export').onclick=()=>{let a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(state.journal,null,2)],{type:'application/json'}));a.href=url;a.download='hokkien-hunt-passport.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)};
$('reset').onclick=()=>{if(confirm('Clear your saved stalls and visits?')){state.journal={};save()}};
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
renderAll();