import './styles.css';

const pages = [
  { nav: 'Our Heritage', short: 'Heritage', kicker: 'Since 1968 · Jaipur', title: 'Where <em>Heritage</em><br>Meets the Hearth', body: 'Handcrafted copper, brass and bronze cookware—rooted in tradition, made for today.' },
  { nav: 'The Materials', short: 'Materials', kicker: 'Materials', title: 'Explore the<br>Essence of <em>Each Metal</em>', body: 'Three timeless metals. Three unique personalities. One shared legacy of purity, performance and purpose.' },
  { nav: 'The Craft', short: 'Craft', kicker: 'Made by hand', title: 'The Art of<br><em>Timeless Making</em>', body: 'Each vessel is shaped slowly by skilled hands, using age-old techniques passed down through generations.' },
  { nav: 'Yours Forever', short: 'Care', kicker: 'Our promise', title: 'Care for<br><em>A Lifetime</em>', body: 'Timeless beauty, enduring support. From restoration and polishing to engraving touch-ups—our lifetime care preserves your heirloom for generations.' }
];

const metals = {
  copper: { name: 'Copper', note: 'The Conductor', desc: 'Rapid and even heating for precise cooking. Enhances flavour, supports wellness and deepens over time.', stats: [5,5,5,4], best: 'Curries, sauces & mithai', care: 'Regular polishing keeps it radiant' },
  brass: { name: 'Brass', note: 'Warm & Nurturing', desc: 'A traditional alloy loved for steady warmth, strength and its quiet golden glow.', stats: [4,5,4,4], best: 'Dal, rice & slow cooking', care: 'Gentle cleansing preserves the lustre' },
  bronze: { name: 'Bronze', note: 'Strong & Timeless', desc: 'A beautifully durable metal that develops a soulful patina and holds heat with ease.', stats: [4,5,4,5], best: 'Serving, sautéing & rituals', care: 'Its living patina tells your story' }
};

const stage = document.querySelector('#stage');
const app = document.querySelector('#app');
const modal = document.querySelector('#modal');
const modalContent = document.querySelector('#modal-content');
const pageBgs = [...document.querySelectorAll('.scene-bg')];
let current = 0;
let transitioning = false;
let wheelLock = false;
let touchStart = 0;

const icon = (name) => ({ flame:'♨', lotus:'❋', leaf:'◇', hand:'⌁', hammer:'⚒', sparkle:'✧', people:'♙', shield:'♢', cloth:'◫' }[name] || '✦');

function pageOne() {
  return `<section class="page page-home">
    <div class="hero-copy">
      <p class="eyebrow">${pages[0].kicker}</p><h1>${pages[0].title}</h1><p class="lede">${pages[0].body}</p>
      <div class="hero-actions"><button class="gold-button" data-go="1">Explore collection <span>↗</span></button><button class="ghost-button" data-action="story">Our story <span>→</span></button></div>
    </div>
    <div class="purity-card glass-card"><span class="card-symbol">✥</span><strong>100%</strong><h3>Pure metals</h3><i></i><p>No coatings.<br>No compromise.<br>Just timeless performance.</p></div>
    <button class="film-card glass-card" data-action="film"><span><small>Behind the craft</small><strong>The Art of<br>Timeless Making</strong><em>Watch film <b>▶</b></em></span><span class="film-thumb"></span></button>
    <p class="scroll-hint"><i></i> Drag, scroll or use arrows to explore</p>
  </section>`;
}

function ratings(n){ return `<span class="rating">${[1,2,3,4,5].map(x=>`<i class="${x<=n?'on':''}"></i>`).join('')}</span>`; }
function pageTwo(selected='copper') {
  const m=metals[selected];
  return `<section class="page page-materials" data-metal="${selected}">
    <div class="materials-copy hero-copy"><p class="eyebrow">✥ &nbsp; ${pages[1].kicker}</p><h1>${pages[1].title}</h1><p class="lede">${pages[1].body}</p>
      <div class="score-card glass-card">
        ${[['flame','Heat retention'],['lotus','Ritual value'],['leaf','Wellness benefits'],['hand','Care level']].map((x,i)=>`<div><span>${icon(x[0])} ${x[1]}</span>${ratings(m.stats[i])}</div>`).join('')}
      </div><p class="microcopy">ⓘ &nbsp; Select a metal to explore its character and care.</p>
    </div>
    <aside class="detail-card glass-card"><p class="eyebrow">✥ &nbsp; ${m.name}</p><h3>${m.note}</h3><p>${m.desc}</p><i></i>
      <dl><div><dt>◌ Cooking character</dt><dd>Fast, responsive & expressive</dd></div><div><dt>✦ Best for</dt><dd>${m.best}</dd></div><div><dt>♧ Wellness benefit</dt><dd>Supports mindful, nourishing meals</dd></div><div><dt>◉ Care</dt><dd>${m.care}</dd></div></dl>
      <button class="text-link" data-go="3">Explore care guide <span>→</span></button>
    </aside>
    <div class="metal-picker glass-card">${Object.entries(metals).map(([key,val])=>`<button class="${key===selected?'is-selected':''}" data-metal-select="${key}"><span class="metal-orb ${key}">◉</span><span><strong>${val.name}</strong><small>${val.note}</small></span></button>`).join('')}</div>
  </section>`;
}

const steps = [
  ['forming','Forming','Pure metal is shaped with intention.'],['hammer','Hammering','Hundreds of precise hammer strikes create strength and character.'],['sparkle','Finishing','Edges refined. Surfaces polished. Details perfected.'],['people','Blessing','Each piece is blessed before it begins its journey.']
];
function pageThree(active=1) {
  return `<section class="page page-craft">
    <div class="hero-copy"><p class="eyebrow">${pages[2].kicker}</p><h1>${pages[2].title}</h1><p class="lede">${pages[2].body}</p><div class="hero-actions"><button class="ghost-button" data-action="film">Watch film <span>▶</span></button><button class="text-link" data-action="artisan">♙ &nbsp; Meet the artisan</button></div></div>
    <aside class="craft-values glass-card">${[['hammer','Hammered by hand','Every strike brings strength and soul.'],['sparkle','Heritage engraving','Intricate motifs. Timeless stories.'],['shield','Passed through generations','Crafted to be lived with, gifted, and remembered.']].map(x=>`<div><b>${icon(x[0])}</b><span><strong>${x[1]}</strong><small>${x[2]}</small></span></div>`).join('')}</aside>
    <div class="journey-wrap"><p class="eyebrow">The journey of a Dharohar vessel</p><div class="journey glass-card">${steps.map((x,i)=>`<button class="${i===active?'is-selected':''}" data-step="${i}"><b>0${i+1}</b><span>${icon(x[0])}</span><strong>${x[1]}</strong><small>${x[2]}</small></button>`).join('')}</div></div>
  </section>`;
}

const careSteps = [
  ['◫','Register your piece','Activate lifetime care benefits.'],['❋','Care guidance','Personalised care tips and practice guidance.'],['♧','Restoration service','Experts restore, polish and revive your heirloom.'],['♙','Legacy transfer','Pass it forward with care records.']
];
function pageFour(active=0) {
  return `<section class="page page-care">
    <div class="hero-copy"><p class="eyebrow">${pages[3].kicker}</p><h1>${pages[3].title}</h1><p class="lede">${pages[3].body}</p><div class="hero-actions"><button class="gold-button" data-action="promise">Our lifetime promise</button><button class="ghost-button" data-action="carefilm"><span>▶</span> See how we care</button></div></div>
    <aside class="care-services glass-card"><h2>✥ &nbsp; Lifetime care</h2>${[['Restoration','Revive and restore aged pieces.'],['Polishing','Bring back the natural radiance.'],['Re-tinning / Reconditioning','Ensure safe cooking with traditional re-tinning.'],['Engraving refresh','Keep stories alive.'],['Heirloom consultation','Guidance on use and preserving your legacy.']].map((x,i)=>`<div><b>${['♢','✧','♧','⌁','♙'][i]}</b><span><strong>${x[0]}</strong><small>${x[1]}</small></span></div>`).join('')}</aside>
    <div class="care-journey"><p class="eyebrow">Your Dharohar care journey</p><div class="journey glass-card">${careSteps.map((x,i)=>`<button class="${i===active?'is-selected':''}" data-step="${i}"><b>0${i+1}</b><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></button>`).join('')}</div></div>
  </section>`;
}

function render(innerState) {
  stage.innerHTML = current===0?pageOne():current===1?pageTwo(innerState):current===2?pageThree(innerState):pageFour(innerState);
  stage.querySelector('.page').animate([{opacity:0, transform:'translateY(20px)'},{opacity:1,transform:'none'}],{duration:900,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
}

function renderProgress() {
  document.querySelector('.progress-pages').innerHTML = pages.map((p,i)=>`<button data-go="${i}" class="${i===current?'is-active':''}"><b>0${i+1}</b><i></i><span>${p.nav}</span></button>`).join('');
  document.querySelector('.mobile-counter span').textContent=`0${current+1}`;
  document.querySelectorAll('.main-nav [data-go]').forEach(el=>el.classList.toggle('is-active',+el.dataset.go===current));
}

function go(index) {
  index=(index+pages.length)%pages.length;
  if(index===current||transitioning)return;
  transitioning=true;
  app.classList.add('is-transitioning');
  const old=current; current=index; app.dataset.page=current;
  setTimeout(()=>{ pageBgs[old].classList.remove('is-active'); pageBgs[current].classList.add('is-active'); render(current===1?'copper':current===2?1:0); renderProgress(); },280);
  setTimeout(()=>{app.classList.remove('is-transitioning');transitioning=false;},1050);
}

function showModal(type){
  const contents={
    consult:['Private consultation','A considered conversation about your kitchen, rituals and the heirloom you want to create.','Request a personal appointment'],
    personalise:['Made only for you','Add initials, a family motif, a date or a blessing—engraved by hand into your chosen piece.','Begin personalisation'],
    story:['Born from fire. Kept by families.','For generations, our artisans have shaped pure metals into vessels that gather people around the hearth.','Discover our heritage'],
    film:['The art of timeless making','A short portrait of hands, fire and hundreds of quiet hammer strikes.','Play the craft film'],
    artisan:['Meet the artisan','Every Dharohar vessel carries the rhythm, judgment and memory of a master craftsperson.','Read their stories'],
    promise:['Our lifetime promise','Restoration, polishing, re-tinning and engraving care—so your piece can live beautifully for generations.','Register your piece'],
    carefilm:['Care is part of the craft','Learn the simple rituals that help living metals mature with grace.','Play the care film']
  };
  const c=contents[type]||contents.consult;
  modalContent.innerHTML=`<p class="eyebrow">Dharohar concierge</p><h2>${c[0]}</h2><p>${c[1]}</p><form method="dialog"><label>Email address<input type="email" placeholder="you@example.com" required></label><button class="gold-button">${c[2]} <span>→</span></button></form>`;
  modal.showModal();
}

document.addEventListener('click',e=>{
  const goEl=e.target.closest('[data-go]'); if(goEl)go(+goEl.dataset.go);
  const dir=e.target.closest('[data-direction]'); if(dir)go(current+(+dir.dataset.direction));
  const metal=e.target.closest('[data-metal-select]'); if(metal)render(metal.dataset.metalSelect);
  const step=e.target.closest('[data-step]'); if(step)render(+step.dataset.step);
  const action=e.target.closest('[data-action]')?.dataset.action;
  if(action==='close')modal.close(); else if(action==='sound'){e.target.closest('.sound-toggle').classList.toggle('is-on');} else if(action)showModal(action);
  if(e.target.closest('.menu-button')){const menu=e.target.closest('.menu-button');menu.classList.toggle('is-open');document.querySelector('.main-nav').classList.toggle('is-open');menu.setAttribute('aria-expanded',menu.classList.contains('is-open'));}
});

window.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowDown')go(current+1);if(e.key==='ArrowLeft'||e.key==='ArrowUp')go(current-1);if(e.key==='Escape'&&modal.open)modal.close();});
window.addEventListener('wheel',e=>{if(modal.open||wheelLock||Math.abs(e.deltaY)<18)return;wheelLock=true;go(current+(e.deltaY>0?1:-1));setTimeout(()=>wheelLock=false,1200);},{passive:true});
window.addEventListener('touchstart',e=>touchStart=e.touches[0].clientX,{passive:true});
window.addEventListener('touchend',e=>{const d=touchStart-e.changedTouches[0].clientX;if(Math.abs(d)>55)go(current+(d>0?1:-1));},{passive:true});

render(0); renderProgress();
