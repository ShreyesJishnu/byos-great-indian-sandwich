/* ============ ENTRY LOADER ============
   Dismisses #ldr when the page is genuinely ready: web fonts settled AND the
   hero photograph decoded - the two things whose absence a user would actually
   see. Whichever comes first between that and a 3s hard timeout wins, so a bad
   connection can never trap anyone behind the overlay.
   The node is removed from the DOM (not hidden) so nothing of it survives in
   the accessibility tree or the tab order. */
(function () {
  var el = document.getElementById('ldr');
  if (!el) return;

  var HERO = 'assets/hero-sandwich.webp';
  /* On a warm cache fonts and hero resolve in tens of ms, so without a floor
     the overlay flashes and the brand moment - the wordmark in MomentsDisplay
     over the product shot - never happens at all. The floor was 1100ms when
     the sandwich here bounced on a 950ms loop and the number had to cover a
     whole cycle; the loader is a still frame now, so it only has to be long
     enough to read as deliberate rather than as a flicker. The 3s timeout is
     measured from the same t0, so the floor can never push past it. */
  var MIN = 800;
  var t0 = performance.now();
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var done = false;

  /* Progress is the real thing, not a fake timer: it steps when a milestone
     actually resolves. The creep between steps exists so a slow connection
     never looks frozen, and it is capped below the next milestone so it can
     never claim progress that has not happened. */
  var p = 0, target = 0.10;
  function setP(v) { p = v; el.style.setProperty('--p', v.toFixed(3)); }
  setP(0);
  /* A timer, not requestAnimationFrame. rAF is throttled to nothing while a
     tab is not painting - which is exactly the state a QR scanner's in-app
     browser can be in on the first frames - and the fill would then jump
     straight from empty to full. setInterval keeps its own clock, and the
     CSS transition does the smoothing. */
  var creep = setInterval(function () {
    setP(p + (target - p) * 0.09);
    if (done && p > 0.995) clearInterval(creep);
  }, 55);

  function kill() {
    if (done) return;
    var wait = MIN - (performance.now() - t0);
    if (wait > 0) { setTimeout(kill, wait); return; }
    done = true;
    setP(1);
    if (reduce) { el.remove(); return; }
    el.addEventListener('transitionend', function () { el.remove(); }, { once: true });
    // belt and braces: transitionend never fires on a backgrounded tab
    setTimeout(function () { el.remove(); }, 600);
    el.classList.add('out');
  }

  /* Loading it here also warms the cache for the real hero.
     load/error, not decode(): decode() on a detached image never settles while
     the tab is backgrounded (rendering is suspended), which strands the
     readiness path on the 3s timeout for anyone who scans the QR and switches
     app. load fires regardless and is the honest "the hero is here" signal. */
  var hero = new Image();
  var heroReady = new Promise(function (r) { hero.onload = hero.onerror = r; });
  hero.src = HERO;

  if (document.fonts) document.fonts.ready.then(function(){ target = Math.max(target, 0.55); });
  heroReady.then(function(){ target = Math.max(target, 0.85); });

  Promise.all([document.fonts ? document.fonts.ready : 0, heroReady]).then(function(){
    target = 1;                       // the remaining MIN floor is the fill completing
    kill();
  });
  setTimeout(function(){ target = 1; kill(); }, 3000);
})();
