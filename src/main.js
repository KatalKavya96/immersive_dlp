import './styles.css';

const pages = [
  { nav: 'Our Heritage', short: 'Heritage', kicker: 'Since 1968 · Jaipur', title: 'Where <em>Heritage</em><br>Meets the Hearth', body: 'Handcrafted copper, brass and bronze cookware—rooted in tradition, made for today.' },
  { nav: 'The Materials', short: 'Materials', kicker: 'Materials', title: 'Explore the<br>Essence of <em>Each Metal</em>', body: 'Three timeless metals. Three unique personalities. One shared legacy of purity, performance and purpose.' },
  { nav: 'The Craft', short: 'Craft', kicker: 'Made by hand', title: 'The Art of<br><em>Timeless Making</em>', body: 'Each vessel is shaped slowly by skilled hands, using age-old techniques passed down through generations.' },
  { nav: 'Yours Forever', short: 'Care', kicker: 'Our promise', title: 'Care for<br><em>A Lifetime</em>', body: 'Timeless beauty, enduring support. From restoration and polishing to engraving touch-ups—our lifetime care preserves your heirloom for generations.' }
];

const assets = [
  ['/assets/heritage-kitchen.png','/assets/heritage-kitchen-4k.webp'],
  ['/assets/materials-alcove.png','/assets/materials-alcove-4k.webp'],
  ['/assets/artisan-craft.png','/assets/artisan-craft-4k.webp'],
  ['/assets/lifetime-care.png','/assets/lifetime-care-4k.webp']
];

const metals = {
  copper: { name: 'Copper', note: 'The Conductor', desc: 'Rapid and even heating for precise cooking. Enhances flavour, supports wellness and deepens over time.', stats: [5,5,5,4], best: 'Curries, sauces & mithai', care: 'Regular polishing keeps it radiant' },
  brass: { name: 'Brass', note: 'Warm & Nurturing', desc: 'A traditional alloy loved for steady warmth, strength and its quiet golden glow.', stats: [4,5,4,4], best: 'Dal, rice & slow cooking', care: 'Gentle cleansing preserves the lustre' },
  bronze: { name: 'Bronze', note: 'Strong & Timeless', desc: 'A beautifully durable metal that develops a soulful patina and holds heat with ease.', stats: [4,5,4,5], best: 'Serving, sautéing & rituals', care: 'Its living patina tells your story' }
};

const craftSteps = [
  ['forming','Forming','Pure metal is shaped with intention.'],
  ['hammer','Hammering','Hundreds of precise hammer strikes create strength and character.'],
  ['sparkle','Finishing','Edges refined. Surfaces polished. Details perfected.'],
  ['people','Blessing','Each piece is blessed before it begins its journey.']
];

const careSteps = [
  ['◫','Register your piece','Activate lifetime care benefits.'],
  ['❋','Care guidance','Personalised care tips and practice guidance.'],
  ['♧','Restoration service','Experts restore, polish and revive your heirloom.'],
  ['♙','Legacy transfer','Pass it forward with care records.']
];

const stage = document.querySelector('#stage');
const app = document.querySelector('#app');
const modal = document.querySelector('#modal');
const modalContent = document.querySelector('#modal-content');
const opening = document.querySelector('.opening-sequence');
const pageBgs = [...document.querySelectorAll('.scene-bg')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const mobile = matchMedia('(max-width: 780px)');
const lowPower = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory <= 4);

const state = { current: 0, transitioning: false, material: 'copper', craft: 1, care: 0, sound: false };
let wheelIntent = 0;
let touchStart = 0;
let preloadImages = [];

app.classList.toggle('low-power', Boolean(lowPower));
app.dataset.metal = state.material;
app.dataset.craftStep = state.craft;

// Three-depth parallax, updated only while motion is settling.
const motion = { targetX: 0, targetY: 0, x: 0, y: 0, scrollKick: 0 };
let lastMotionFrame = 0;
let motionFrame = 0;

function queueCinema() {
  if (!motionFrame && !reducedMotion.matches) motionFrame = requestAnimationFrame(animateCinema);
}

function setMotionTarget(clientX, clientY) {
  if (reducedMotion.matches) return;
  motion.targetX = (clientX / innerWidth - .5) * 2;
  motion.targetY = (clientY / innerHeight - .5) * 2;
  app.style.setProperty('--light-x', `${clientX}px`);
  app.style.setProperty('--light-y', `${clientY}px`);
  queueCinema();
}

function animateCinema(time = 0) {
  if (time - lastMotionFrame < 33) {
    motionFrame = requestAnimationFrame(animateCinema);
    return;
  }
  lastMotionFrame = time;
  const power = lowPower || mobile.matches ? .48 : 1;
  motion.x += (motion.targetX - motion.x) * .075;
  motion.y += (motion.targetY - motion.y) * .075;
  motion.scrollKick *= .86;
  app.style.setProperty('--bg-x', `${motion.x * -16 * power}px`);
  app.style.setProperty('--bg-y', `${(motion.y * -11 + motion.scrollKick) * power}px`);
  app.style.setProperty('--far-x', `${motion.x * 4 * power}px`);
  app.style.setProperty('--far-y', `${motion.y * 2.5 * power}px`);
  app.style.setProperty('--near-x', `${motion.x * 11 * power}px`);
  app.style.setProperty('--near-y', `${motion.y * 7 * power}px`);
  app.style.setProperty('--counter-x', `${motion.x * -4 * power}px`);
  app.style.setProperty('--counter-y', `${motion.y * -2.5 * power}px`);
  app.style.setProperty('--tilt-x', `${motion.y * -1.1 * power}deg`);
  app.style.setProperty('--tilt-y', `${motion.x * 1.7 * power}deg`);
  const moving = Math.abs(motion.targetX-motion.x) > .002 || Math.abs(motion.targetY-motion.y) > .002 || Math.abs(motion.scrollKick) > .1;
  motionFrame = moving ? requestAnimationFrame(animateCinema) : 0;
}

const icon = (name) => ({ flame:'♨', lotus:'❋', leaf:'◇', hand:'⌁', forming:'◈', hammer:'⚒', sparkle:'✧', people:'♙', shield:'♢' }[name] || '✦');
const ratings = n => `<span class="rating">${[1,2,3,4,5].map(x=>`<i class="${x<=n?'on':''}"></i>`).join('')}</span>`;

function pageOne(classes='') {
  return `<section class="page page-home ${classes}" data-chapter="0">
    <div class="hero-copy reveal-block">
      <p class="eyebrow">${pages[0].kicker}</p><h1>${pages[0].title}</h1><p class="lede">${pages[0].body}</p>
      <div class="hero-actions"><button class="gold-button" data-go="1">Explore the collection <span>↗</span></button><button class="ghost-button" data-action="story">Our story <span>→</span></button></div>
    </div>
    <div class="purity-card glass-card reveal-panel"><span class="card-symbol">✥</span><strong>100%</strong><h3>Pure metals</h3><i></i><p>No coatings.<br>No compromise.<br>Just timeless performance.</p></div>
    <button class="film-card glass-card reveal-panel" data-action="film"><span><small>Behind the craft</small><strong>The Art of<br>Timeless Making</strong><em>Watch film <b>▶</b></em></span><span class="film-thumb"></span></button>
    <p class="scroll-hint"><i></i> Scroll vertically to enter the story</p>
  </section>`;
}

function pageTwo(classes='') {
  const m=metals[state.material];
  return `<section class="page page-materials ${classes}" data-chapter="1" data-metal="${state.material}">
    <div class="materials-copy hero-copy reveal-block"><p class="eyebrow">✥ &nbsp; ${pages[1].kicker}</p><h1>${pages[1].title}</h1><p class="lede">${pages[1].body}</p>
      <div class="score-card glass-card">${[['flame','Heat retention'],['lotus','Ritual value'],['leaf','Wellness benefits'],['hand','Care level']].map((x,i)=>`<div><span>${icon(x[0])} ${x[1]}</span>${ratings(m.stats[i])}</div>`).join('')}</div>
      <div class="hero-actions"><button class="gold-button" data-action="recommend">Find your metal <span>→</span></button></div>
    </div>
    <aside class="detail-card glass-card reveal-panel"><p class="eyebrow">✥ &nbsp; ${m.name}</p><h3>${m.note}</h3><p>${m.desc}</p><i></i>
      <dl><div><dt>◌ Cooking character</dt><dd>Responsive, expressive and enduring</dd></div><div><dt>✦ Best for</dt><dd>${m.best}</dd></div><div><dt>♧ Wellness benefit</dt><dd>Supports mindful, nourishing meals</dd></div><div><dt>◉ Care</dt><dd>${m.care}</dd></div></dl>
      <button class="text-link" data-go="3">Explore care guide <span>→</span></button>
    </aside>
    <div class="metal-picker glass-card reveal-panel">${Object.entries(metals).map(([key,val])=>`<button class="${key===state.material?'is-selected':''}" data-metal-select="${key}" aria-pressed="${key===state.material}"><span class="metal-orb ${key}">◉</span><span><strong>${val.name}</strong><small>${val.note}</small></span></button>`).join('')}</div>
  </section>`;
}

function pageThree(classes='') {
  const active=craftSteps[state.craft];
  return `<section class="page page-craft ${classes}" data-chapter="2">
    <div class="hero-copy reveal-block"><p class="eyebrow">${pages[2].kicker}</p><h1>${pages[2].title}</h1><p class="lede">${pages[2].body}</p><div class="hero-actions"><button class="gold-button" data-action="artisan">Meet the artisan <span>→</span></button><button class="ghost-button" data-action="film">Watch film <span>▶</span></button></div></div>
    <aside class="craft-values glass-card reveal-panel">${[['hammer','Hammered by hand','Every strike brings strength and soul.'],['sparkle','Heritage engraving','Intricate motifs. Timeless stories.'],['shield','Passed through generations','Crafted to be lived with, gifted, and remembered.']].map(x=>`<div><b>${icon(x[0])}</b><span><strong>${x[1]}</strong><small>${x[2]}</small></span></div>`).join('')}</aside>
    <div class="craft-moment glass-card"><span>0${state.craft+1}</span><div><small>Now exploring</small><strong>${active[1]}</strong><p>${active[2]}</p></div></div>
    <div class="journey-wrap reveal-panel"><p class="eyebrow">The journey of a Dharohar vessel</p><div class="journey glass-card">${craftSteps.map((x,i)=>`<button class="${i===state.craft?'is-selected':''}" data-step="${i}" aria-pressed="${i===state.craft}"><b>0${i+1}</b><span>${icon(x[0])}</span><strong>${x[1]}</strong><small>${x[2]}</small></button>`).join('')}</div></div>
  </section>`;
}

function pageFour(classes='') {
  return `<section class="page page-care ${classes}" data-chapter="3">
    <div class="hero-copy reveal-block"><p class="eyebrow">${pages[3].kicker}</p><h1>${pages[3].title}</h1><p class="lede">${pages[3].body}</p><div class="hero-actions"><button class="gold-button" data-action="promise">Register your heirloom <span>→</span></button><button class="ghost-button" data-action="carefilm"><span>▶</span> See how we care</button></div></div>
    <aside class="care-services glass-card reveal-panel"><h2>✥ &nbsp; Lifetime care</h2>${[['Restoration','Revive and restore aged pieces.'],['Polishing','Bring back the natural radiance.'],['Re-tinning / Reconditioning','Ensure safe cooking with traditional re-tinning.'],['Engraving refresh','Keep stories alive.'],['Heirloom consultation','Guidance on use and preserving your legacy.']].map((x,i)=>`<div><b>${['♢','✧','♧','⌁','♙'][i]}</b><span><strong>${x[0]}</strong><small>${x[1]}</small></span></div>`).join('')}</aside>
    <div class="care-journey reveal-panel"><p class="eyebrow">Your Dharohar care journey</p><div class="journey glass-card">${careSteps.map((x,i)=>`<button class="${i===state.care?'is-selected':''}" data-step="${i}" aria-pressed="${i===state.care}"><b>0${i+1}</b><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></button>`).join('')}</div></div>
  </section>`;
}

function markup(index, classes='') { return [pageOne,pageTwo,pageThree,pageFour][index](classes); }

function rerenderCurrent() {
  stage.innerHTML=markup(state.current,'is-current');
}

function updateMaterial(key,withSound=false){
  if(!metals[key]||state.current!==1)return;
  state.material=key;app.dataset.metal=key;
  const m=metals[key],page=stage.querySelector('.page-materials');if(!page)return;
  page.dataset.metal=key;
  const score=page.querySelector('.score-card');if(score)score.innerHTML=[['flame','Heat retention'],['lotus','Ritual value'],['leaf','Wellness benefits'],['hand','Care level']].map((x,i)=>`<div><span>${icon(x[0])} ${x[1]}</span>${ratings(m.stats[i])}</div>`).join('');
  const detail=page.querySelector('.detail-card');if(detail)detail.innerHTML=`<p class="eyebrow">✥ &nbsp; ${m.name}</p><h3>${m.note}</h3><p>${m.desc}</p><i></i><dl><div><dt>◌ Cooking character</dt><dd>Responsive, expressive and enduring</dd></div><div><dt>✦ Best for</dt><dd>${m.best}</dd></div><div><dt>♧ Wellness benefit</dt><dd>Supports mindful, nourishing meals</dd></div><div><dt>◉ Care</dt><dd>${m.care}</dd></div></dl><button class="text-link" data-go="3">Explore care guide <span>→</span></button>`;
  page.querySelectorAll('[data-metal-select]').forEach(button=>{const selected=button.dataset.metalSelect===key;button.classList.toggle('is-selected',selected);button.setAttribute('aria-pressed',String(selected));});
  if(withSound)tone({copper:260,brass:310,bronze:210}[key],.32,.065);
}

function renderProgress() {
  document.querySelector('.progress-pages').innerHTML=pages.map((p,i)=>`<button data-go="${i}" class="${i===state.current?'is-active':''}" aria-current="${i===state.current?'page':'false'}"><b>0${i+1}</b><i></i><span>${p.nav}</span></button>`).join('');
  document.querySelector('.chapter-list').innerHTML=pages.map((p,i)=>`<button data-go="${i}" class="${i===state.current?'is-active':''}" aria-current="${i===state.current?'page':'false'}"><b>0${i+1}</b><i></i><span>${p.short}</span></button>`).join('');
  document.querySelector('.mobile-counter span').textContent=`0${state.current+1}`;
  document.querySelectorAll('.main-nav [data-go]').forEach(el=>el.classList.toggle('is-active',+el.dataset.go===state.current));
}

function transitionDuration(){ return reducedMotion.matches?0:(mobile.matches?560:780); }

function go(rawIndex, directionHint) {
  const numericIndex=Number(rawIndex);if(!Number.isFinite(numericIndex))return;
  const index=((numericIndex%pages.length)+pages.length)%pages.length;
  if(index===state.current||state.transitioning||app.classList.contains('intro-playing'))return;
  const oldIndex=state.current;
  const direction=directionHint||Math.sign(rawIndex-oldIndex)||1;
  const oldPage=stage.querySelector('.page.is-current');
  state.transitioning=true;
  stage.setAttribute('aria-busy','true');
  app.classList.add('is-transitioning');
  app.dataset.transitionDirection=direction>0?'down':'up';
  stage.insertAdjacentHTML('beforeend',markup(index,`is-entering ${direction>0?'from-below':'from-above'}`));
  const newPage=stage.querySelector('.page.is-entering');
  state.current=index;
  app.dataset.page=index;
  app.dataset.craftStep=state.craft;
  document.title=`Dharohar — ${pages[index].short}`;
  renderProgress();
  playSceneCue(index);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    oldPage?.classList.remove('is-current');
    oldPage?.classList.add('is-leaving',direction>0?'to-above':'to-below');
    newPage?.classList.remove('is-entering','from-below','from-above');
    newPage?.classList.add('is-current');
    pageBgs[oldIndex].classList.remove('is-active');
    pageBgs[index].classList.add('is-active');
  }));
  const duration=transitionDuration();
  setTimeout(()=>{
    oldPage?.remove();
    state.transitioning=false;
    stage.removeAttribute('aria-busy');
    app.classList.remove('is-transitioning');
  },duration+80);
  prefetch((index+1)%pages.length);
}

function assetFor(index){ return (devicePixelRatio>1.25&&innerWidth>900)?assets[index][1]:assets[index][0]; }
function prefetch(index){
  const src=assetFor(index);
  if(preloadImages.some(img=>img.src.endsWith(src)))return Promise.resolve();
  return new Promise(resolve=>{const img=new Image();img.onload=img.onerror=resolve;img.src=src;preloadImages.push(img);});
}

async function runOpening(){
  let seen=false;try{seen=sessionStorage.getItem('dharohar-opening')==='seen';}catch{}
  if(seen||reducedMotion.matches){opening.classList.add('is-skipped');prefetch(1);return;}
  app.classList.add('intro-playing');
  await Promise.race([prefetch(0),new Promise(r=>setTimeout(r,1100))]);
  opening.classList.add('is-revealing');
  setTimeout(()=>{opening.classList.add('is-complete');app.classList.remove('intro-playing');prefetch(1);try{sessionStorage.setItem('dharohar-opening','seen');}catch{}},1550);
}

// Muted-by-default procedural room tone and scene cues; no network audio dependency.
let audioContext, masterGain, ambientSources=[];
function ensureAudio(){
  if(audioContext)return;
  audioContext=new (window.AudioContext||window.webkitAudioContext)();
  masterGain=audioContext.createGain();masterGain.gain.value=0;masterGain.connect(audioContext.destination);
  const drone=audioContext.createOscillator(),droneGain=audioContext.createGain();drone.type='sine';drone.frequency.value=54;droneGain.gain.value=.025;drone.connect(droneGain).connect(masterGain);drone.start();
  const buffer=audioContext.createBuffer(1,audioContext.sampleRate*2,audioContext.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.18;
  const noise=audioContext.createBufferSource(),filter=audioContext.createBiquadFilter(),noiseGain=audioContext.createGain();noise.buffer=buffer;noise.loop=true;filter.type='lowpass';filter.frequency.value=480;noiseGain.gain.value=.055;noise.connect(filter).connect(noiseGain).connect(masterGain);noise.start();ambientSources=[drone,noise];
}
function toggleSound(button){
  ensureAudio();state.sound=!state.sound;button.classList.toggle('is-on',state.sound);button.setAttribute('aria-pressed',String(state.sound));button.setAttribute('aria-label',state.sound?'Mute ambient sound':'Play ambient sound');audioContext.resume();masterGain.gain.cancelScheduledValues(audioContext.currentTime);masterGain.gain.linearRampToValueAtTime(state.sound ? .85 : 0,audioContext.currentTime+.45);
}
function tone(frequency,duration=.45,volume=.08,type='sine'){
  if(!state.sound||!audioContext)return;const now=audioContext.currentTime,osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type=type;osc.frequency.setValueAtTime(frequency,now);osc.frequency.exponentialRampToValueAtTime(Math.max(42,frequency*.55),now+duration);gain.gain.setValueAtTime(volume,now);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);osc.connect(gain).connect(masterGain);osc.start(now);osc.stop(now+duration+.02);
}
function playSceneCue(index){ if(index===2){tone(360,.16,.14,'triangle');setTimeout(()=>tone(190,.25,.09,'sine'),95);}else tone([150,240,360,190][index],.5,.075,'sine'); }

function showModal(type){
  const contents={
    consult:['Private consultation','A considered conversation about your kitchen, rituals and the heirloom you want to create.','Request a personal appointment'],
    personalise:['Made only for you','Add initials, a family motif, a date or a blessing—engraved by hand into your chosen piece.','Begin personalisation'],
    story:['Born from fire. Kept by families.','For generations, our artisans have shaped pure metals into vessels that gather people around the hearth.','Discover our heritage'],
    film:['The art of timeless making','A short portrait of hands, fire and hundreds of quiet hammer strikes.','Play the craft film'],
    artisan:['Meet the artisan','Every Dharohar vessel carries the rhythm, judgment and memory of a master craftsperson.','Read their stories'],
    promise:['Register your heirloom','Activate lifetime restoration, polishing, re-tinning and engraving care for your Dharohar piece.','Register your piece'],
    carefilm:['Care is part of the craft','Learn the simple rituals that help living metals mature with grace.','Play the care film'],
    recommend:['Find your metal','Tell us how you cook and what you value. Our concierge will recommend the metal that best fits your kitchen rituals.','Begin the consultation']
  };
  const c=contents[type]||contents.consult;
  modalContent.innerHTML=`<p class="eyebrow">Dharohar concierge</p><h2>${c[0]}</h2><p>${c[1]}</p><form method="dialog"><label>Email address<input type="email" placeholder="you@example.com" required></label><button class="gold-button">${c[2]} <span>→</span></button></form>`;
  modal.showModal();
}

function closeMenu(){const menu=document.querySelector('.menu-button');menu.classList.remove('is-open');document.querySelector('.main-nav').classList.remove('is-open');menu.setAttribute('aria-expanded','false');}

document.addEventListener('click',e=>{
  const goEl=e.target.closest('[data-go]');if(goEl){const target=+goEl.dataset.go;go(target,target>state.current?1:-1);closeMenu();}
  const dir=e.target.closest('button[data-direction]');if(dir){const d=+dir.dataset.direction;go(state.current+d,d);}
  const metal=e.target.closest('[data-metal-select]');if(metal)updateMaterial(metal.dataset.metalSelect,true);
  const step=e.target.closest('[data-step]');if(step&&state.current===2){state.craft=+step.dataset.step;app.dataset.craftStep=state.craft;rerenderCurrent();playSceneCue(2);}
  else if(step&&state.current===3){state.care=+step.dataset.step;rerenderCurrent();tone(170+state.care*35,.3,.055);}
  const action=e.target.closest('[data-action]')?.dataset.action;
  if(action==='close')modal.close();else if(action==='sound')toggleSound(e.target.closest('.sound-toggle'));else if(action)showModal(action);
  if(e.target.closest('.menu-button')){const menu=e.target.closest('.menu-button');menu.classList.toggle('is-open');document.querySelector('.main-nav').classList.toggle('is-open');menu.setAttribute('aria-expanded',String(menu.classList.contains('is-open')));}
});

document.addEventListener('pointerover',e=>{
  if(!matchMedia('(hover:hover)').matches||state.current!==1||state.transitioning)return;
  const metal=e.target.closest('[data-metal-select]');if(!metal||metal.dataset.metalSelect===state.material)return;
  updateMaterial(metal.dataset.metalSelect);
});

window.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='PageDown')go(state.current+1,1);if(e.key==='ArrowUp'||e.key==='PageUp')go(state.current-1,-1);if(e.key==='Escape'){if(modal.open)modal.close();else closeMenu();}});
window.addEventListener('wheel',e=>{if(modal.open||state.transitioning||app.classList.contains('intro-playing'))return;wheelIntent+=e.deltaY;if(Math.abs(wheelIntent)<48)return;const d=wheelIntent>0?1:-1;wheelIntent=0;motion.scrollKick=d>0?-7:7;queueCinema();go(state.current+d,d);},{passive:true});
window.addEventListener('touchstart',e=>touchStart=e.touches[0].clientY,{passive:true});
window.addEventListener('touchmove',e=>setMotionTarget(e.touches[0].clientX,e.touches[0].clientY),{passive:true});
window.addEventListener('touchend',e=>{const d=touchStart-e.changedTouches[0].clientY;if(Math.abs(d)>55)go(state.current+(d>0?1:-1),d>0?1:-1);},{passive:true});
window.addEventListener('pointermove',e=>setMotionTarget(e.clientX,e.clientY),{passive:true});
window.addEventListener('pointerleave',()=>{motion.targetX=0;motion.targetY=0;queueCinema();});
document.addEventListener('visibilitychange',()=>{app.classList.toggle('is-paused',document.hidden);if(audioContext){if(document.hidden)audioContext.suspend();else if(state.sound)audioContext.resume();}});
reducedMotion.addEventListener?.('change',()=>{if(reducedMotion.matches&&motionFrame){cancelAnimationFrame(motionFrame);motionFrame=0;}});

stage.innerHTML=markup(0,'is-current');
renderProgress();
runOpening();
queueCinema();
