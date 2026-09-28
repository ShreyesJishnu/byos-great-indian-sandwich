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
