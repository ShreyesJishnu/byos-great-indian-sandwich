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
  /* One full bounce cycle is 950ms. On a warm cache fonts and hero resolve in
     tens of ms, so without a floor the overlay flashes and the brand moment -
     the wordmark in MomentsDisplay, the sandwich bouncing once - never
     happens. 1100ms is one complete cycle plus a beat to read the line, and
     short enough not to tax a returning visitor. The 3s timeout is measured
     from the same t0, so the floor can never push past it. */
  var MIN = 1100;
  var t0 = performance.now();
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var done = false;

  function kill() {
    if (done) return;
    var wait = MIN - (performance.now() - t0);
    if (wait > 0) { setTimeout(kill, wait); return; }
    done = true;
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

  Promise.all([document.fonts ? document.fonts.ready : 0, heroReady]).then(kill);
  setTimeout(kill, 3000);
})();
