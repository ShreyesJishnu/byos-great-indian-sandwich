/* ============================ data ============================ */
const STEPS=[
 {key:'bread',title:'Your Bread',hint:'Choose one.',multi:false,opts:[
   {id:'white',n:'White',c:'#F1DFB8'},{id:'multi',n:'Brown Multigrain',c:'#A9743F'},
   {id:'sour',n:'Sourdough',c:'#D9AD63'},{id:'pav',n:'Pav',c:'#F3E2BE'}]},
 /* the four real FunFoods SKUs, as transparent studio cutouts. A brand person
    seeing their own jar here is worth more than any amount of colour work. */
 {key:'mayo',title:'Your Mayo',hint:'Choose one.',multi:false,opts:[
   {id:'orig',n:'Original',c:'#F4ECD2',img:'assets/mayo-orig.webp',alt:'Dr. Oetker FunFoods Veg Mayonnaise Original'},
   {id:'burger',n:'Burger',c:'#F0D98A',img:'assets/mayo-burger.webp',alt:'Dr. Oetker FunFoods Veg Mayonnaise Burger'},
   {id:'garlic',n:'Garlic',c:'#EEF2DF',img:'assets/mayo-garlic.webp',alt:'Dr. Oetker FunFoods Veg Garlic Mayonnaise'},
   {id:'tandoori',n:'Tandoori',c:'#E07A3F',img:'assets/mayo-tandoori.webp',alt:'Dr. Oetker FunFoods Veg Mayonnaise Tandoori Masala'}]},
 {key:'filling',title:'Your Filling',hint:'Choose one.',multi:false,opts:[
   {id:'aloo',n:'Aloo',c:'#E8C15A'},{id:'paneer',n:'Paneer',c:'#F5EDD4'},
   {id:'chicken',n:'Chicken',c:'#D99A56'},{id:'veggies',n:'Veggies',c:'#D3763F'}]},
 {key:'veg',title:'The Veggies',hint:'Pick as many as you like.',multi:true,opts:[
   {id:'onion',n:'Onion',c:'#D7A9C6'},{id:'tomato',n:'Tomato',c:'#E2453A'},
   {id:'cucumber',n:'Cucumber',c:'#6FAE4C'},{id:'lettuce',n:'Lettuce',c:'#5FA233'}]},
 {key:'crunch',title:'The Crunch',hint:'Pick as many as you like.',multi:true,opts:[
   {id:'chips',n:'Chips',c:'#E8C968'},{id:'nachos',n:'Nachos',c:'#E0A94C'},
   {id:'friedonion',n:'Fried Onion',c:'#C9852F'},{id:'namkeen',n:'Namkeen',c:'#D9B24A'}]}
];
const OPT={}; STEPS.forEach(s=>s.opts.forEach(o=>OPT[s.key+':'+o.id]=o));
const NAMES={mayo:{orig:'Classic',burger:'Burger-Style',garlic:'Garlicky',tandoori:'Tandoori'},
             filling:{aloo:'Aloo',paneer:'Paneer',chicken:'Chicken',veggies:'Veggie'},
             tail:['Crunch','Stack','Special','Bomb','Deluxe']};
/* mymuesli pattern: curated starting points so nobody faces a blank canvas */
const PRESETS=[
 {n:'Bombay Tandoori',d:'Sourdough, paneer and smoky tandoori mayo',shot:'assets/dish-tandoori.webp',
  alt:'Tandoori paneer sandwich, grilled',
  p:{bread:'sour',mayo:'tandoori',filling:'paneer',veg:['onion','tomato'],crunch:['nachos']}},
 {n:'The Classic Club',d:'Triple-decker white bread, chicken and chips',shot:'assets/dish-club.webp',
  alt:'Club sandwich, toasted white bread',
  p:{bread:'white',mayo:'orig',filling:'chicken',veg:['lettuce','tomato','cucumber'],crunch:['chips']}},
 {n:'Pav Masala',d:'Spiced aloo in bread/pav/kulcha with garlic mayo',shot:'assets/dish-pav.webp',
  alt:'Vada pav, spiced potato fritter in a pav bun',
  p:{bread:'pav',mayo:'garlic',filling:'aloo',veg:['onion'],crunch:['namkeen','friedonion']}}
];
const ICON={
 check:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 share:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M12 15V4m0 0L8 8m4-4l4 4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 14v4a2 2 0 002 2h10a2 2 0 002-2v-4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
 info:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.9"/><path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 alert:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5.5M12 16h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>'
};

/* ============ brand devices, spec S9 ============ */
/* (a) the card-top arc. One path, viewBox 0 0 624 28, deliberately wider than
   the card so its own rounded corners fall outside the visible box. The fill
   is inherited from --arcfill on the card, so it always matches the footer. */
const ARC='<svg class="arc" viewBox="0 0 624 28" preserveAspectRatio="none" aria-hidden="true">'+
 '<path d="M16 203C7.16344 203 0 195.837 0 187V21.351C0 21.351 143.433 -1.4836e-05 313.3 0C483.167 1.48361e-05 624 21.3511 624 21.3511V187C624 195.837 616.836 203 608 203H16Z"/></svg>';
/* (b) the seal - 8-lobed rounded blob, 84px path scaled by viewBox */
const SEALPATH='M44.7505 75.5465C43.0819 76.6453 40.9193 76.6453 39.2507 75.5465L35.8883 73.3323C34.6282 72.5024 33.1337 72.102 31.6275 72.1906L27.6084 72.4269C25.6139 72.5442 23.7411 71.4629 22.8454 69.677L21.0406 66.0783C20.3642 64.7295 19.2702 63.6355 17.9215 62.9591L14.3227 61.1543C12.5368 60.2586 11.4555 58.3858 11.5728 56.3913L11.8092 52.3723C11.8977 50.8661 11.4973 49.3716 10.6675 48.1114L8.45326 44.749C7.35444 43.0804 7.35444 40.9178 8.45326 39.2492L10.6675 35.8868C11.4973 34.6267 11.8977 33.1322 11.8092 31.626L11.5728 27.6069C11.4555 25.6125 12.5368 23.7396 14.3227 22.844L17.9215 21.0391C19.2702 20.3628 20.3642 19.2687 21.0406 17.92L22.8454 14.3212C23.7411 12.5353 25.6139 11.454 27.6084 11.5713L31.6275 11.8077C33.1337 11.8963 34.6282 11.4958 35.8883 10.666L39.2507 8.45179C40.9193 7.35297 43.0819 7.35297 44.7505 8.45179L48.1129 10.666C49.373 11.4958 50.8675 11.8963 52.3737 11.8077L56.3928 11.5713C58.3873 11.454 60.2601 12.5353 61.1558 14.3212L62.9606 17.92C63.637 19.2687 64.731 20.3628 66.0797 21.0391L69.6785 22.844C71.4644 23.7396 72.5457 25.6125 72.4284 27.6069L72.192 31.626C72.1034 33.1322 72.5039 34.6267 73.3337 35.8868L75.5479 39.2492C76.6468 40.9178 76.6468 43.0804 75.5479 44.749L73.3337 48.1114C72.5039 49.3716 72.1034 50.8661 72.192 52.3723L72.4284 56.3913C72.5457 58.3858 71.4644 60.2586 69.6785 61.1543L66.0797 62.9591C64.731 63.6355 63.637 64.7296 62.9606 66.0783L61.1558 69.677C60.2601 71.4629 58.3872 72.5442 56.3928 72.4269L52.3737 72.1906C50.8675 72.102 49.373 72.5024 48.1129 73.3323L44.7505 75.5465Z';
const seal=(label,cls='')=>`<span class="seal ${cls}" aria-hidden="true">
  <svg viewBox="0 0 84 84"><circle class="disc" cx="42" cy="42" r="38"/><path class="lobe" d="${SEALPATH}"/></svg>
  <b>${label}</b></span>`;
/* (c) the two-part CTA: 50px pill + 1px hairline ring inset 5px, in a 110px box */
const cta=(label,attrs='')=>
  `<button class="cta" ${attrs}><span class="ring"></span><span class="pill">${label}</span></button>`;
/* (d) staggered 10vh scroll reveal (spec S8.3) */
function reveal_on_scroll(){
  if(matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const els=document.querySelectorAll('.rv'); if(!els.length) return;
  const io=new IntersectionObserver((rows,o)=>rows.forEach(r=>{
    if(r.isIntersecting){r.target.classList.add('in');o.unobserve(r.target)}
  }),{rootMargin:'0px 0px -8% 0px'});
  els.forEach(el=>io.observe(el));
}

/* ============================ state ============================ */
let pick={bread:null,mayo:null,filling:null,veg:[],crunch:[]};
// Anyone who loaded the leaderboard build still has its two keys sitting in this
// origin with nothing left to read them. Drop them on boot rather than orphaning
// a 24-entry blob in browsers we can no longer reach.
['gis_e','gis_voted'].forEach(k=>localStorage.removeItem(k));
// One key, holding the one entry this browser filed. ponytail: stands in for the
// response to POST /api/entries; nothing reads it back on load, share() is its
// only consumer. try/catch because an older build stored a bare code string here.
const DB={
 get mine(){try{return JSON.parse(localStorage.getItem('gis_mine'))}catch(e){return null}},
 set mine(v){localStorage.setItem('gis_mine',JSON.stringify(v))}
};
const sig=p=>[p.bread,p.mayo,p.filling,[...p.veg].sort().join('-'),[...p.crunch].sort().join('-')].join('|');
const title=p=>`${NAMES.mayo[p.mayo]} ${NAMES.filling[p.filling]} ${p.crunch.length?NAMES.tail[(p.crunch.length+p.veg.length)%NAMES.tail.length]:'Sandwich'}`;
function code(s,p){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;
  return '#'+((NAMES.mayo[p.mayo]||'X')[0]+(NAMES.filling[p.filling]||'X')[0]+'S').toUpperCase()+(h%1000+'').padStart(3,'0')}

/* ============ Smart Mouth pattern: every layer in the DOM, toggled by display ============ */
/* .layers is flex column-reverse, so SPEC runs BOTTOM of the sandwich first.
   veg + crunch are scattered shapes rather than slabs, so all four variants of
   each share one fixed-height slot and are absolutely positioned inside it;
   the pieces themselves are <i> children. */
const PIECES={lettuce:1,tomato:2,onion:1,cucumber:1,chips:4,nachos:4,friedonion:5,namkeen:6};
function layerSpec(){
  const L=[];
  STEPS[0].opts.forEach(o=>L.push({cls:'puck breadB '+o.id,slot:'bread',id:o.id}));
  STEPS[1].opts.forEach(o=>L.push({cls:'puck mayo '+o.id,slot:'mayo',id:o.id}));
  STEPS[2].opts.forEach(o=>L.push({cls:'puck fill '+o.id,slot:'filling',id:o.id}));
  L.push({wrap:'vslot',kids:STEPS[3].opts.map(o=>({cls:'veg '+o.id,slot:'veg',id:o.id}))});
  L.push({wrap:'cslot',kids:STEPS[4].opts.map(o=>({cls:'crunch '+o.id,slot:'crunch',id:o.id}))});
  // part:'top' is the lid. It is the only layer the live builder withholds, so
  // it needs a marker syncStack can test; the slot stays 'bread' because the
  // lid's variant is still chosen by pick.bread.
  STEPS[0].opts.forEach(o=>L.push({cls:'puck breadT '+o.id,slot:'bread',id:o.id,part:'top'}));
  return L;
}
const SPEC=layerSpec();
// One canonical template, cloned for hero + build preview + every thumbnail so markup lives
// in exactly one place (ponytail: don't hand-write the same 30 divs 4x).
const ly=l=>`<div class="ly ${l.cls}" data-slot="${l.slot}" data-id="${l.id}"${
  l.part?` data-part="${l.part}"`:''}>${'<i></i>'.repeat(PIECES[l.id]||0)}</div>`;
const stackHTML=(cls='')=>`<div class="sw ${cls}" aria-hidden="true"><div class="board"></div><div class="layers">`+
  SPEC.map(l=>l.wrap?`<div class="${l.wrap}">${l.kids.map(ly).join('')}</div>`:ly(l)).join('')+
  `</div></div>`;
/*
  ONE sync for the hero, the build preview, all three preset thumbnails and the
  reveal card. Two optional arguments carry the
  only two behaviours that differ between them, so the function is never forked:

  anim  - which single layer just arrived, as "slot:id" (e.g. "veg:tomato"), or
          'all' for a full rebuild. Anything else, including omitted, is silent.
          It is one key rather than a boolean because a re-render rebuilds the
          DOM, so EVERY enabled layer looks new; without the key, picking a
          second vegetable would re-drop the first one too.
  open  - open-faced. Withholds the lid. The live builder is the only caller
          that passes it: the hero, presets and reveal all show finished
          sandwiches, and the lid arriving in the reveal is the payoff.
*/
function syncStack(root,p,anim,open){
  let landed=false;
  root.querySelectorAll('.ly').forEach(el=>{
    const {slot,id,part}=el.dataset, v=p[slot];
    let on = Array.isArray(v) ? v.includes(id) : v===id;
    if(open && part==='top') on=false;
    const fresh = on && !el.classList.contains('on');
    el.classList.toggle('on',on);
    if(fresh && (anim==='all' || anim===slot+':'+id)){
      el.classList.remove('drop'); void el.offsetWidth;   // restart if it is mid-fall
      el.classList.add('drop'); landed=true;
      setTimeout(()=>el.classList.remove('drop'),760);
    }
  });
  if(landed){root.classList.add('impact');setTimeout(()=>root.classList.remove('impact'),560)}
}
const $=id=>document.getElementById(id);

const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
/* Progressive enhancement, in the strict sense: navigator.vibrate does not
   exist in iOS Safari at all, and where it does exist it needs a user gesture -
   which the tap that triggered the drop satisfies. One pulse per user action,
   never one per piece, or a six-piece namkeen drop becomes a buzz. */
/* HAPTICS UNDER A SCROLL-DRIVEN MODEL.
   Chrome gates navigator.vibrate on STICKY user activation, and a commit here can
   now be reached by scrolling rather than by tapping. The gate is not "did the
   user tap a control", it is "has this frame ever been activated" - and on a
   touch device a scroll BEGINS with a touchstart, which grants exactly that. So
   `gestured` below mirrors the browser's own rule rather than working around it:
   it is true from the first touch of the first swipe, which on the QR-entered
   phone journey is before any layer can land. What it buys is silence instead of
   a console error on desktop wheel-scroll, where nothing can vibrate anyway.
   iOS Safari does not implement navigator.vibrate at all, at any version, so an
   iPhone gets no haptics in this build and got none in the previous one either;
   that is a platform fact, not a regression, and it is why the drop animation
   has to carry the feedback on its own. */
let gestured=false;
const mark=e=>{if(e.isTrusted) gestured=true};   // untrusted events do not activate a frame
['pointerdown','touchstart','keydown'].forEach(e=>addEventListener(e,mark,{once:true,passive:true}));
const buzz=ms=>{if(gestured&&!reduced()&&navigator.vibrate)try{navigator.vibrate(ms)}catch(e){}};

/* ============================ scroll-narrative state ============================
   There is no `view`, no render() and no routes. The whole site is ONE document,
   written once at boot; after that every change is a targeted DOM update. */
let busy=false, plated=false, submitted=false;
const byKey={}; STEPS.forEach((s,i)=>{s.i=i; byKey[s.key]=s});

/* themed arrow hints: the brand's own bow, given a knife tip. Not a chevron. */
Object.assign(ICON,{
 arcR:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">'+
  '<path d="M8.6 3.4C13.4 6.2 15.6 9.2 15.6 12s-2.2 5.8-7 8.6" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>'+
  '<path d="M13.2 7.6 20.4 12l-7.2 4.4z" fill="currentColor"/></svg>',
 arcL:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">'+
  '<path d="M15.4 3.4C10.6 6.2 8.4 9.2 8.4 12s2.2 5.8 7 8.6" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>'+
  '<path d="M10.8 7.6 3.6 12l7.2 4.4z" fill="currentColor"/></svg>',
 arcD:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">'+
  '<path d="M3.4 8.6C6.2 13.4 9.2 15.6 12 15.6s5.8-2.2 8.6-7" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>'+
  '<path d="M7.6 10.8 12 18l4.4-7.2z" fill="currentColor"/></svg>'
});

/* ============================ the story, written once ============================ */
/* Card and rail markup. A single-select card is a real radio inside a radiogroup,
   so arrow keys move AND select, which is exactly the scroll grammar in keyboard
   form. A multi card is a toggle button. The chip is aria-hidden: the state a
   screen reader hears comes from aria-checked/aria-pressed, never from a label. */
const optCard=(s,o,j)=>`
  <button class="opt" data-key="${s.key}" data-id="${o.id}" data-j="${j}" tabindex="${j?-1:0}"
    ${s.multi?'aria-pressed="false"':'role="radio" aria-checked="false"'}
    ${o.img?`aria-label="${o.n} &mdash; ${o.alt}"`:''}>
    <span class="tick" aria-hidden="true">${ICON.check}</span>
    <span class="swatch" style="--swatch:${o.img?'var(--white)':o.c}">${
      o.img?`<img src="${o.img}" alt="" loading="lazy" width="200" height="200">`:''}</span>
    <span class="foot">${ARC}<span class="name">${o.n}</span>
      <span class="chip" aria-hidden="true"><i class="ck">${ICON.check}</i><span class="lbl">${
        s.multi?'Tap to add':'On the board'}</span></span>
    </span>
  </button>`;

/* Everything inside .stepin is one sticky block pinned to the worktop's lip, so
   the step never shows a reserved band of empty cream when the user rests off
   the snap. See the .stepin comment in styles.css for the geometry. The wrapper
   exists only to give sticky a single box to act on; nothing else depends on it. */
const stepHTML=s=>`
<section class="step" id="step-${s.key}" data-step="${s.key}" aria-labelledby="h-${s.key}">
 <div class="stepin">
  <h2 class="steph" id="h-${s.key}">${s.title}</h2>
  <p class="meta">Step ${s.i+1} of ${STEPS.length} &middot; ${s.hint}</p>
  <div class="tray">${ARC}
    <div class="railwrap">
      <button class="nudge prev" data-nudge="-1" aria-label="Previous option">${ICON.arcL}</button>
      <div class="rail" data-rail="${s.key}" role="${s.multi?'group':'radiogroup'}"
           aria-labelledby="h-${s.key}">${s.opts.map((o,j)=>optCard(s,o,j)).join('')}</div>
      <button class="nudge next" data-nudge="1" aria-label="Next option">${ICON.arcR}</button>
    </div>
    <p class="hint">${s.multi
      ? 'Swipe to browse &middot; tap the middle card to add or remove'
      : 'Swipe sideways &middot; the middle one goes on the board'}</p>
  </div>
 </div>
</section>`;

const regField=(id,label,help,attrs,prefix)=>`
  <div class="field" data-f="${id}">
    <label for="${id}">${label}</label>
    ${prefix
      ? `<div class="pillrow" data-invalid="false"><span class="pfx">${prefix}</span><input id="${id}" ${attrs}></div>`
      : `<input id="${id}" ${attrs}>`}
    <p class="help" id="${id}-help">${help}</p>
  </div>`;

function story(){
  $('main').innerHTML=`
  <section class="opening" aria-labelledby="h1">
    <div class="hero bleed curve-deep">
      <img src="assets/hero-sandwich.webp" width="800" height="481"
           alt="A grilled tandoori paneer sandwich, cut and stacked" fetchpriority="high">
    </div>
    <div class="heroblock bleed curve-b">
      <p class="august">Make it yours</p>
      <h1 class="display on-hero" id="h1" tabindex="-1">The Great Indian Sandwich</h1>
    </div>
    <p class="lede mt5">Five picks, one sandwich, and a name on it. Scroll to cook &mdash; the
      counter is set. A Dr. Oetker jury reads every entry, and the builds they find most
      interesting get made for real.</p>
    <div class="cue" aria-hidden="true"><span class="lbl">Scroll to start</span><span class="ln"></span>${ICON.arcD}</div>
  </section>

  <section class="starters rv" aria-labelledby="h-start">
    <h2 id="h-start">Start From a Favourite</h2>
    <p class="sub">Slide through, tap one, then change anything you like as you go.</p>
    <div class="presets">${PRESETS.map((p,i)=>`
      <button class="preset" data-preset="${i}">
        <span class="shot"><img src="${p.shot}" alt="${p.alt}" loading="lazy" width="360" height="216">
          <span class="thumb">${stackHTML('sm')}</span></span>
        <span class="foot">${ARC}<b>${p.n}</b><span>${p.d}</span></span>
      </button>`).join('')}</div>
  </section>

  <section class="howto mech bleed rv" aria-labelledby="h-how">${ARC}
    <h2 id="h-how">How It Works</h2>
    <ol>
      <li>${seal(1)}<p>Scroll down. Each step adds a layer.</p></li>
      <li>${seal(2)}<p>Swipe sideways. The middle one goes on.</p></li>
      <li>${seal(3)}<p>Name it at the bottom. You're in.</p></li>
    </ol>
  </section>
  <p class="center" style="margin:var(--s5) 0 0">
    <a class="tlink" href="#step-bread">Start with the bread</a></p>

  <div class="build" id="build">
    <div class="counter" id="counter">
      <div class="air"></div>
      <div class="slab">${ARC}<div class="prog" id="prog" aria-hidden="true"></div></div>
      ${stackHTML('empty')}
    </div>
    ${STEPS.map(stepHTML).join('')}
  </div>
  <!-- the closing beat sits OUTSIDE .build on purpose: it is the counter's
       sticky container that has to END here, so the worktop can clear the top of
       the screen before the plate enters from the bottom. Inside .build it only
       made the counter stick for longer and both sandwiches showed at once. -->
  <div class="closing"><p>That's everything. Close it up &mdash; keep scrolling.</p>
    <ol class="method" id="method" aria-label="Your sandwich, as a method"></ol></div>

  <section class="finale" id="finale" aria-labelledby="h-fin">
    <div class="plate"><div class="air"></div><div class="slab">${ARC}</div>${stackHTML()}</div>
    <h2 id="h-fin" tabindex="-1">Your Sandwich</h2>
    <div class="code" id="fincode"></div>
    <div class="tags" id="fintags"></div>
    <div id="regwrap">
      <div class="field">
        <label for="sname">Name your sandwich</label>
        <input id="sname" maxlength="42" enterkeyhint="next" autocomplete="off"
               aria-describedby="sname-help">
        <p class="help" id="sname-help">Leave it as it is and we'll use the name above.</p>
      </div>
      <h2 class="minor">Your Details</h2>
      <p class="sub">So we can reach you if a jury picks yours.</p>
      <fieldset class="fieldset">
        <legend class="vh">Registration details</legend>
        ${regField('rname','Full name','As it should appear on your entry.',
          'maxlength="60" autocomplete="name" enterkeyhint="next" aria-describedby="rname-help"')}
        ${regField('rphone','Mobile number','10 digits. We only use it to verify your entry.',
          'type="tel" inputmode="numeric" maxlength="10" autocomplete="tel-national" '+
          'enterkeyhint="next" aria-describedby="rphone-help"','+91')}
        ${regField('remail','Email <span class="sub" style="font-size:14px">(optional)</span>','Only if you want a copy of your entry.',
          'type="email" maxlength="120" autocomplete="email" enterkeyhint="next" aria-describedby="remail-help"')}
        ${regField('rcity','City','Where the sandwich was made.',
          'maxlength="60" autocomplete="address-level2" enterkeyhint="done" aria-describedby="rcity-help"')}
        <div class="consent" id="consentbox" data-invalid="false">
          <input type="checkbox" id="rconsent" aria-describedby="rconsent-err">
          <label for="rconsent">I agree that Dr. Oetker India may store and use these details
            to run this contest and contact me about my entry.</label>
        </div>
        <p class="help" id="rconsent-err" style="padding-left:0">You can withdraw consent at any
          time by writing to us. We never sell your details.</p>
      </fieldset>
      <div class="ctas mt5">
        ${cta('Submit Entry','data-act="submit"')}
      </div>
    </div>
  </section>
  <small class="fine">Prototype &middot; data stays in this browser</small>`;

  document.querySelectorAll('.preset').forEach((el,i)=>syncStack(el.querySelector('.sw'),PRESETS[i].p,false));
  reveal_on_scroll();
}

/* ============================ the rails ============================
   Horizontal scroll chooses. Three rules hold the whole thing together:

   1. The rail is a NATIVE scroller. Nothing calls preventDefault on wheel or
      touchmove anywhere in this file; the only programmatic scrolls are
      rail.scrollTo() in response to a click or an arrow key. Vertical gestures
      are never touched, so the browser's own axis lock handles the diagonal
      thumb swipe and overscroll-behavior-x:contain stops the page from panning.
   2. The centred card is PAINTED on every frame (cheap: four offset reads,
      rAF-coalesced) but COMMITTED only on settle. Settle is whichever of
      `scrollend` or a 130ms idle timer fires first; commit is idempotent, so the
      two firing together costs nothing and neither can double-drop a layer.
   3. Commit is one call site. The drop animation, the haptic and the layer
      toggle cannot drift apart because they are the same three lines. */
let counterSW,plateSW; const rails={};

const railCards=r=>[...r.children];
function centredIndex(rail){
  const mid=rail.scrollLeft+rail.clientWidth/2; let best=0,bd=Infinity;
  railCards(rail).forEach((c,i)=>{
    const d=Math.abs(c.offsetLeft+c.offsetWidth/2-mid);
    if(d<bd){bd=d;best=i}
  });
  return best;
}
function markAt(rail,i){
  if(+rail.dataset.at===i) return;
  rail.dataset.at=i;
  railCards(rail).forEach((c,j)=>{
    c.classList.toggle('at',j===i);
    c.tabIndex=j===i?0:-1;                 // roving tabindex follows the scroll
  });
  const wrap=rail.parentElement;
  wrap.querySelector('.nudge.prev').disabled=i===0;
  wrap.querySelector('.nudge.next').disabled=i===rail.children.length-1;
}
function goTo(rail,i,focus){
  const n=rail.children.length; i=Math.max(0,Math.min(n-1,i));
  const el=rail.children[i];
  rail.scrollTo({left:el.offsetLeft-(rail.clientWidth-el.offsetWidth)/2,
                 behavior:reduced()?'auto':'smooth'});
  markAt(rail,i);
  if(focus) el.focus({preventScroll:true});   // preventScroll: the rail moves, the page never does
  const s=byKey[rail.dataset.rail];
  if(!s.multi) select(s.key,s.opts[i].id);    // radiogroup semantics: moving IS choosing
}
function watchRail(rail){
  let t=0,raf=0;
  const settle=()=>{
    const i=centredIndex(rail); markAt(rail,i);
    const s=byKey[rail.dataset.rail];
    if(!s.multi && rail.dataset.live==='1') select(s.key,s.opts[i].id);
  };
  rail.addEventListener('scroll',()=>{
    if(!raf) raf=requestAnimationFrame(()=>{raf=0;markAt(rail,centredIndex(rail))});
    rail.parentElement.classList.add('touched');
    clearTimeout(t); t=setTimeout(settle,130);
  },{passive:true});
  // scrollend where it exists (Chrome/Firefox/Safari 18+), the timer everywhere else
  rail.addEventListener('scrollend',()=>{clearTimeout(t);settle()});
  rail.addEventListener('keydown',e=>{
    const n=rail.children.length, i=+rail.dataset.at||0; let j=null;
    if(e.key==='ArrowRight') j=i+1; else if(e.key==='ArrowLeft') j=i-1;
    else if(e.key==='Home') j=0; else if(e.key==='End') j=n-1; else return;
    e.preventDefault();                       // a focused control's arrow keys, not the page's
    rail.parentElement.classList.add('touched');
    rail.dataset.live='1'; goTo(rail,j,true);
  });
  markAt(rail,0);
}

/* ---------- commit ---------- */
function drop(key,id){
  syncStack(counterSW,pick,key+':'+id,true);       // open-faced: the lid is the finale's payoff
  syncStack(plateSW,pick,false,false);
  counterSW.classList.remove('empty');
  setTimeout(()=>buzz(14),240);                    // one pulse per settle, on the impact frame
}
function select(key,id){
  if(pick[key]===id) return;                       // idempotent: dedupes scrollend + timer
  pick[key]=id; paintRail(key); drop(key,id);
}
function toggle(key,id){
  const a=pick[key], k=a.indexOf(id);
  if(k<0){a.push(id); paintRail(key); drop(key,id)}
  else{a.splice(k,1); paintRail(key); syncStack(counterSW,pick,false,true); syncStack(plateSW,pick,false,false)}
}
function paintRail(key){
  const s=byKey[key], rail=rails[key], v=pick[key];
  railCards(rail).forEach((c,j)=>{
    const on=s.multi?v.includes(s.opts[j].id):v===s.opts[j].id;
    c.setAttribute(s.multi?'aria-pressed':'aria-checked',on);
    if(s.multi) c.querySelector('.chip .lbl').textContent=on?'On the board':'Tap to add';
  });
}
function setProg(n){
  $('prog').innerHTML=STEPS.map((_,i)=>`<i class="${i<n?'on':''}"></i>`).join('');
}

/* ---------- which step am I in ----------
   Each .step is (100svh - header) tall, so two of them can never both clear 55%
   of the viewport: exactly one is live at any scroll position, no tie-breaking.
   Arriving at a single-select step commits whatever is centred, which is how the
   sandwich gains its base without the user having to do anything but scroll. */
function enterStep(key,entering){
  const rail=rails[key], s=byKey[key];
  if(!entering){rail.dataset.live='0';return}
  rail.dataset.live='1'; setProg(s.i+1);
  // arriving at a single-select step commits whatever is centred: the sandwich
  // gains its layer from the vertical scroll alone, and sideways scroll edits it
  if(!s.multi && !pick[s.key]) select(s.key,s.opts[centredIndex(rail)].id);
}
function watchSteps(){
  const io=new IntersectionObserver(rows=>rows.forEach(r=>
    enterStep(r.target.dataset.step,r.isIntersecting)),{threshold:.55});
  document.querySelectorAll('.step').forEach(el=>io.observe(el));
}

/* ---------- taps ---------- */
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-act],[data-preset],[data-nudge],.opt[data-key]');
  if(!t) return;

  const card=t.closest('.opt[data-key]');
  if(card){
    const rail=card.parentElement, s=byKey[card.dataset.key];
    rail.dataset.live='1'; rail.parentElement.classList.add('touched');
    goTo(rail,+card.dataset.j,false);          // single-select is already committed by goTo
    if(s.multi) toggle(s.key,card.dataset.id);
    return;
  }
  if(t.dataset.nudge){
    const rail=t.closest('.railwrap').querySelector('.rail');
    rail.dataset.live='1';
    return goTo(rail,(+rail.dataset.at||0)+ +t.dataset.nudge,false);
  }
  if(t.dataset.preset!==undefined) return usePreset(+t.dataset.preset);
  switch(t.dataset.act){
    case 'submit':  return submit();
    case 'share':   return share();
    case 'restart': location.hash=''; return location.reload();
    case 'reset':
      if(!confirm('Reset prototype data? This deletes your sandwich entry and the details you gave us \u2014 your name, mobile number, email and city \u2014 from this browser. This cannot be undone.')) return;
      localStorage.clear(); return location.reload();
  }
});

/* A preset fills all five picks, then drives every rail to the matching card and
   rebuilds the stack in one pass ('all'), instead of five staggered drops. */
function usePreset(i){
  pick=JSON.parse(JSON.stringify(PRESETS[i].p));
  STEPS.forEach(s=>{
    const rail=rails[s.key];
    const want=s.multi?s.opts.findIndex(o=>pick[s.key].includes(o.id))
                      :s.opts.findIndex(o=>o.id===pick[s.key]);
    rail.dataset.live='0';                     // don't let the programmatic scroll re-commit
    rail.scrollTo({left:rail.children[Math.max(0,want)].offsetLeft
      -(rail.clientWidth-rail.children[0].offsetWidth)/2,behavior:'auto'});
    markAt(rail,Math.max(0,want)); paintRail(s.key);
  });
  counterSW.classList.remove('empty');
  syncStack(counterSW,pick,'all',true); syncStack(plateSW,pick,false,false);
  buzz(14);
  $('step-bread').scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'});
}

/* ============================ the finale ============================ */
const HELP={};   // original helper text, so clearing an error restores it verbatim

function finaleCopy(){
  if(submitted) return;              // the entry is filed; the form it wrote into is gone
  // a user who jumped here with an anchor may have skipped a rail; take whatever
  // is centred rather than rendering "undefined Sandwich"
  STEPS.forEach(s=>{if(!s.multi && !pick[s.key]) select(s.key,s.opts[centredIndex(rails[s.key])].id)});
  const n=title(pick);
  $('h-fin').textContent=n;
  $('fincode').textContent=code(sig(pick),pick);
  $('sname').placeholder=n;
  $('fintags').innerHTML=[OPT['bread:'+pick.bread].n,OPT['mayo:'+pick.mayo].n+' Mayo',
    OPT['filling:'+pick.filling].n,...pick.veg.map(v=>OPT['veg:'+v].n),
    ...pick.crunch.map(c=>OPT['crunch:'+c].n)].map(t=>`<span class="tag">${t}</span>`).join('');
}
/* The lid lands here and nowhere else: the five steps run open-faced, so closing
   the sandwich is the payoff for reaching the bottom. Same 70ms upward stagger
   as before, with a beat of daylight before the top slice. */
function plate(){
  syncStack(plateSW,pick,false,false);
  if(reduced()) return;
  let last=0;
  [...plateSW.querySelectorAll('.ly.on')].forEach((el,i)=>{
    el.style.animation='none'; el.offsetHeight;
    last=i*70+(el.classList.contains('breadT')?300:0);
    el.style.animation=`drop .5s var(--ease) ${last}ms both`;
  });
  setTimeout(()=>buzz(22),last+280);
}
/* ---------- the closing beat ----------
   It is a whole screen by construction (see the .closing comment in styles.css:
   the counter/plate separation needs >= one viewport of run there) and it used
   to spend that screen on a single centred line. It now reads the assembly back
   as a METHOD — the making, in cooking voice. Deliberately not the five picks as
   labels: the finale one screen later already shows the generated name, the code
   and a pill per pick, and a second list of the same five would read as filler.
   Painted on approach rather than at boot, because the picks are still changing
   right up until the last step. */
const METHOD={
  bread:v=>`Lay out the ${v} slices.`,
  mayo:v=>`Spread the ${v} mayo, edge to edge.`,
  filling:v=>`Pile on the ${v}.`,
  veg:v=>v?`Layer the ${v}.`:'Skip the salad &mdash; straight to the crunch.',
  crunch:v=>v?`Finish with the ${v}.`:'No crunch. Soft and honest.'
};
const andList=names=>names.length<2?(names[0]||'')
  :names.slice(0,-1).join(', ')+' and '+names[names.length-1];
function methodCopy(){
  $('method').innerHTML=STEPS.map(s=>{
    // a user who anchored past a rail has no pick yet; read what is centred
    // rather than printing "Start with the .". Read only — no commit here.
    const v=s.multi?andList(pick[s.key].map(id=>OPT[s.key+':'+id].n))
      :(OPT[s.key+':'+pick[s.key]]||s.opts[centredIndex(rails[s.key])]).n;
    return `<li>${seal(s.i+1)}<p>${METHOD[s.key](v.toLowerCase())}</p></li>`;
  }).join('');
}
function watchClosing(){
  new IntersectionObserver(rows=>rows.forEach(r=>{if(r.isIntersecting) methodCopy()}),
    {rootMargin:'0px 0px 240px 0px'}).observe(document.querySelector('.closing'));
}
function watchFinale(){
  new IntersectionObserver((rows,o)=>rows.forEach(r=>{
    if(!r.isIntersecting) return;
    finaleCopy(); if(!plated){plated=true; plate()}
  }),{threshold:.2}).observe($('finale'));
}

/* ---------- inline validation ---------- */
const RULES={
  rname:v=>v.trim().length>=2||'Enter at least 2 characters so we can credit the entry.',
  rphone:v=>/^[6-9]\d{9}$/.test(v.trim())||'Enter a 10-digit Indian mobile number.',
  remail:v=>!v.trim()||/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())||'That does not look like an email address.',
  rcity:v=>v.trim().length>=2||'Enter the city you are entering from.'
};
function setErr(id,msg){
  const wrap=document.querySelector(`[data-f="${id}"]`), el=$(id),
        row=wrap.querySelector('.pillrow'), p=$(id+'-help');
  el.setAttribute('aria-invalid',msg?'true':'false');
  if(row) row.dataset.invalid=msg?'true':'false';
  p.className=msg?'err':'help';
  p.innerHTML=msg?ICON.alert+'<span>'+msg+'</span>':HELP[id];
}
function check(id){const r=RULES[id](  $(id).value); setErr(id,r===true?'':r); return r===true}
/* The consent gate is the one required control that is not in RULES, and it used
   to be signalled by a red outline ALONE: no aria-invalid, and #rconsent-err —
   despite its id — held permanent withdraw-consent boilerplate that never moved.
   A screen-reader user who submitted unticked had focus thrown at the checkbox
   and heard "You can withdraw consent at any time". On the legal gate. */
function setConsent(ok){
  const p=$('rconsent-err');
  $('rconsent').setAttribute('aria-invalid',ok?'false':'true');
  $('consentbox').dataset.invalid=ok?'false':'true';
  p.className=ok?'help':'err';
  p.innerHTML=ok?HELP.rconsent
    :ICON.alert+'<span>Tick the box to enter — we need your consent to hold your details.</span>';
}
function wireValidation(){
  HELP.rconsent=$('rconsent-err').innerHTML;
  Object.keys(RULES).forEach(id=>{
    HELP[id]=$(id+'-help').innerHTML;
    $(id).addEventListener('blur',()=>check(id));
    // clear the moment it becomes valid, rather than on the next submit
    $(id).addEventListener('input',()=>{if($(id).getAttribute('aria-invalid')==='true') check(id)});
  });
  $('rconsent').addEventListener('change',()=>{
    if($('rconsent').checked) setConsent(true);
  });
  $('rphone').addEventListener('input',e=>{e.target.value=e.target.value.replace(/\D/g,'')});
}
function submit(){
  if(busy||submitted) return;
  const bad=Object.keys(RULES).filter(id=>!check(id));
  const consent=$('rconsent').checked;
  setConsent(consent);
  if(bad.length||!consent){
    const first=bad.length?$(bad[0]):$('rconsent');
    first.focus(); first.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'center'});
    return;
  }
  busy=true;
  const btn=document.querySelector('[data-act=submit]');
  btn.disabled=true; btn.querySelector('.pill').innerHTML='<span class="spin"></span>Creating';
  setTimeout(()=>{                                  // ponytail: stands in for POST /api/entries
    const given=$('sname').value.trim();
    // the body of that POST: the sandwich, plus the lead the jury has to reach.
    // Field names are the endpoint's, so swapping this for a real fetch is a
    // one-line change. Consent is not a field: submit() cannot get here without it.
    const entry={
      code:code(sig(pick),pick), name:given||title(pick),
      pick:JSON.parse(JSON.stringify(pick)),
      fullName:$('rname').value.trim(), phone:$('rphone').value.trim(),
      email:$('remail').value.trim(), city:$('rcity').value.trim(),
      at:Date.now()};
    DB.mine=entry; busy=false; submitted=true;
    confirmEntry(entry);
  },900);
}
/* The ending. No board to hand off to, so the code is the keepsake and the two
   ways out of a finished entry — share it, build another — live here, which is
   where the board's own CTAs used to be. */
function confirmEntry(me){
  $('regwrap').innerHTML=`
    <div class="card center mt5">
      <h2 tabindex="-1" id="donetitle"></h2>
      <div class="code">${me.code}</div>
      <div class="center" style="margin-top:var(--s5);display:flex;justify-content:center">
        ${seal("You're<br>In",'lg')}</div>
    </div>
    <div class="note">${ICON.info}<span><b>Keep this code.</b> It is how we find your sandwich.
      If the jury picks yours, we will call the number you gave.</span></div>
    <div class="ctas mt5">
      ${cta('Share It','data-act="share"')}
      ${cta('Build Another','data-act="restart"')}
      <button class="tlink" data-act="reset">Reset prototype data</button>
    </div>`;
  // textContent, never interpolation: me.name is whatever the user typed into
  // #sname. Interpolated into innerHTML it executed — "<img src=x onerror=...>"
  // as a sandwich name ran. Harmless while DB.mine is local-only; the moment
  // this block becomes the real POST /api/entries it is stored XSS.
  $('donetitle').textContent=me.name;
  $('donetitle').focus({preventScroll:true});
  $('donetitle').scrollIntoView({behavior:reduced()?'auto':'smooth',block:'center'});
}
function share(){
  const me=DB.mine;
  const text=`I built "${me.name}" ${me.code} for The Great Indian Sandwich. Build yours.`;
  if(navigator.share) navigator.share({title:'The Great Indian Sandwich',text,url:location.href}).catch(()=>{});
  else alert(text+'\n\n(On a phone this opens the native share sheet -> Instagram Stories.)');
}

/* ============================ boot ============================ */
story();
counterSW=document.querySelector('.counter .sw');
plateSW=document.querySelector('.plate .sw');
STEPS.forEach(s=>{rails[s.key]=document.querySelector(`[data-rail="${s.key}"]`); watchRail(rails[s.key])});
setProg(0); watchSteps(); watchClosing(); watchFinale(); wireValidation();
// paint the closing method once at boot too: watchClosing keeps it current, but
// an observer only fires on a rendered frame, so without this the beat is an
// empty screen for anyone who reaches it without one (and it measured as one).
methodCopy();
// the header's height moves with the safe-area inset and with font swap, and both
// the sticky offset and every step's scroll-margin are derived from it
const setBarH=()=>document.documentElement.style.setProperty('--barH',$('bar').offsetHeight+'px');
setBarH();                                         // synchronous, before first scroll
new ResizeObserver(setBarH).observe($('bar'));     // then keep it honest
