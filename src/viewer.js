/* ============================================================================
   The 2.5D sandwich, in WebGL.

   This is a drop-in replacement for the CSS puck renderer, not an addition to
   it. It answers the same two calls app.js already makes - syncStack() and
   plate() - so the builder's state machine never learns that anything changed:

     CSS renderer                      this
     syncStack(root, pick, anim, open) viewer.sync(pick, anim, open)
     plate()                           viewer.plateDrop()

   The CSS renderer stays in the page as the fallback. WebGL is absent or
   blacklisted often enough on the Android WebViews this campaign is entered
   from - a QR on a mayonnaise jar, opened inside whatever in-app browser the
   scanner ships - that shipping 3D with no floor would be a coin flip on the
   one path we know most entries arrive through. supports() is the gate; if it
   says no, app.js never loads this file and the pucks render as before.

   Geometry comes out of sandwich_assets.blend as one .glb per layer, named for
   the same ids app.js already uses (bread/white -> bread_white_top.glb), so
   there is no translation table to drift. Layers load on demand and are cached:
   a build touches at most ten of the twenty-five.
   ========================================================================== */

import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Box3, Sphere, Vector3, Color,
  DirectionalLight, AmbientLight, AgXToneMapping, SRGBColorSpace,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

/* A lost context, a blacklisted driver and a software rasteriser all present
   as "WebGL works" to a naive check, so probe for a real context and throw the
   probe away immediately - keeping it costs one of the handful of contexts a
   browser will hand out per page. */
export function supports() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return false;
    const lose = gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
    return true;
  } catch {
    return false;
  }
}

const reduced = () =>
  matchMedia('(prefers-reduced-motion: reduce)').matches;

/* layer key -> glb basename. The lid and the base are different meshes of the
   same chosen bread, which is why bread takes a part argument. */
const fileFor = (slot, id, part) =>
  slot === 'bread' ? `bread_${id}_${part === 'top' ? 'top' : 'bottom'}`
                   : `${slot}_${id}`;

export async function mount(host, opts = {}) {
  const base = opts.base || 'assets/3d/';
  const manifest = await fetch(base + 'manifest.json').then(r => r.json());

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'display:block;width:100%;height:100%';
  host.appendChild(canvas);

  const renderer = new WebGLRenderer({
    canvas, antialias: true, alpha: true, powerPreference: 'high-performance',
  });
  renderer.outputColorSpace = SRGBColorSpace;
  // the .blend renders through AgX, so the browser does too - ACES here would
  // warm every crust by a visible amount against the reference renders
  renderer.toneMapping = AgXToneMapping;
  renderer.toneMappingExposure = manifest.exposure ?? 1;

  const scene = new Scene();
  const camera = new PerspectiveCamera(manifest.camera.fov, 1, 0.01, 10);

  /* Blender's own three-point rig, exported with the meshes. Matching it here
     is why the baked albedo reads the same in the browser as in the render:
     the bake carries colour only, every bit of shaping is these lights. */
  for (const l of manifest.lights) {
    const light = new DirectionalLight(new Color(...l.color), l.intensity);
    light.position.set(...l.position);
    scene.add(light);
  }
  scene.add(new AmbientLight(
    new Color(...(manifest.ambient?.color || [1, 1, 1])),
    manifest.ambient?.intensity ?? 0.25,
  ));

  const root = new Group();
  scene.add(root);

  /* Draco costs a 245 KB decoder once and takes the 25 layers from 13.4 MB to
     1.73 MB, so it pays for itself on the second layer a build loads. */
  const draco = new DRACOLoader().setDecoderPath(base + 'draco/');
  const loader = new GLTFLoader().setDRACOLoader(draco);
  const cache = new Map();          // file -> Promise<Group>
  const live = new Map();           // "slot:id:part" -> Group in the scene

  function load(file) {
    if (!cache.has(file)) {
      cache.set(file, loader.loadAsync(`${base}${file}.glb`).then(g => g.scene));
    }
    return cache.get(file);
  }

  /* ---- framing -----------------------------------------------------------
     The stack grows as layers land, so the camera cannot be set once. It is
     re-fitted to the live bounding box, which also means an open-faced build
     and a finished one are both framed correctly without a special case. */
  const box = new Box3(), size = new Vector3(), centre = new Vector3();
  const sphere = new Sphere();
  let fitTarget = 1, fitNow = 1;

  function refit() {
    if (!root.children.length) return;
    const food = [...live.entries()].filter(([k]) => !k.startsWith('board:')).map(([, g]) => g);
    if (!food.length) return;
    box.makeEmpty();
    for (const g of food) box.expandByObject(g);
    if (box.isEmpty()) return;
    box.getSize(size); box.getCenter(centre);
    /* The box is measured in WORLD space, so it already carries whatever
       offset root is currently holding. Assigning -centre would therefore
       double-count it and the stack would walk out of frame a little further
       on every re-sync; subtracting lands the centre on the origin exactly. */
    root.position.sub(centre);

    /* Fit the bounding SPHERE, not the per-axis box. The camera looks in from
       an azimuth, so what the frame has to hold is the silhouette's diagonal,
       not its width: a 0.106 x 0.092 board presents 0.140 across at -35deg,
       which is what cropped the pav bun when this fitted x and z separately.
       A sphere has no orientation, so one number covers every angle.
       camera.fov is the VERTICAL angle; a portrait canvas is tighter
       horizontally, so fit against whichever half-angle is smaller. */
    box.getBoundingSphere(sphere);
    const vFov = camera.fov * Math.PI / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    const half = Math.min(vFov, hFov) / 2;
    fitTarget = (sphere.radius / Math.sin(half)) * (manifest.camera.pad ?? 1.05);
  }

  function place() {
    const a = manifest.camera.angle;   // [azimuth, elevation] in radians
    const d = fitNow;
    camera.position.set(
      Math.sin(a[0]) * Math.cos(a[1]) * d,
      Math.sin(a[1]) * d,
      Math.cos(a[0]) * Math.cos(a[1]) * d,
    );
    camera.lookAt(0, 0, 0);
  }

  /* ---- drop animation ----------------------------------------------------
     The CSS version animates a class for 760ms and fires buzz() on impact.
     Here a layer carries its own remaining fall in `drop`, decremented each
     frame; nothing is scheduled with setTimeout, so a layer swapped mid-fall
     simply stops existing instead of landing on top of its replacement. */
  const FALL = 0.5;                  // seconds
  const RISE = manifest.dropHeight ?? 0.06;
  const falling = new Set();

  function animate(dt) {
    for (const g of falling) {
      g.userData.drop -= dt;
      if (g.userData.drop <= 0) {
        g.userData.drop = 0;
        g.position.y = g.userData.restY;
        falling.delete(g);
        if (g.userData.buzz) { g.userData.buzz = false; opts.onImpact?.(); }
      } else {
        // ease-out: fast at the top of the fall, settling at the bottom
        const t = g.userData.drop / FALL;
        g.position.y = g.userData.restY + RISE * t * t;
      }
    }
  }

  function startDrop(g, delay = 0, buzz = false) {
    g.userData.drop = FALL + delay;
    g.userData.buzz = buzz;
    falling.add(g);
  }

  /* ---- the one call app.js makes ---------------------------------------- */
  let stackSeq = 0;

  async function sync(pick, anim = false, open = false) {
    const seq = ++stackSeq;
    const want = [];
    want.push(['board', 'wood', null]);
    want.push(['bread', pick.bread, 'bottom']);
    if (pick.mayo) want.push(['mayo', pick.mayo, null]);
    /* Lettuce is a bed, not a topping: all three preset stacks in the .blend
       lay it straight on the mayo and put the filling on top of it, and every
       other vegetable above the filling. Stacking it with the others buries
       the filling - which is the one layer the build is named after. */
    const veg = pick.veg || [];
    if (veg.includes('lettuce')) want.push(['veg', 'lettuce', null]);
    if (pick.filling) want.push(['filling', pick.filling, null]);
    for (const id of veg) if (id !== 'lettuce') want.push(['veg', id, null]);
    for (const id of pick.crunch || []) want.push(['crunch', id, null]);
    if (!open) want.push(['bread', pick.bread, 'top']);

    const keys = want.map(([s, i, p]) => `${s}:${i}:${p || ''}`);
    const keyset = new Set(keys);

    for (const [k, g] of live) {
      if (!keyset.has(k)) { root.remove(g); falling.delete(g); live.delete(k); }
    }

    let y = 0;
    for (let n = 0; n < want.length; n++) {
      const [slot, id, part] = want[n];
      const key = keys[n];
      const file = slot === 'board' ? 'board_wood' : fileFor(slot, id, part);
      const rise = manifest.layers[file]?.rise ?? 0.01;

      let g = live.get(key);
      const fresh = !g;
      if (fresh) {
        const src = await load(file);
        if (seq !== stackSeq) return;      // a newer sync overtook this one
        g = src.clone(true);
        live.set(key, g);
        root.add(g);
      }
      g.userData.restY = y;
      if (fresh) {
        g.position.y = y;
        const wanted = anim === 'all' || anim === `${slot}:${id}`;
        if (wanted && !reduced()) startDrop(g, 0, true);
      } else if (!falling.has(g)) {
        g.position.y = y;
      }
      y += rise;
    }
    refit();
  }

  /* The finale replays the whole build, bottom to top, with the lid held back
     so it reads as a lid. Same stagger the CSS version used. */
  function plateDrop() {
    if (reduced()) return;
    const order = [...live.values()];
    order.forEach((g, i) => {
      const isLid = g === order[order.length - 1];
      startDrop(g, i * 0.07 + (isLid ? 0.3 : 0), isLid);
    });
  }

  /* ---- loop --------------------------------------------------------------
     rAF only while the host is on screen and the tab is visible. A sticky
     worktop that scrolls away must not keep a GPU busy on a phone. */
  let running = false, last = 0, raf = 0;
  function frame(t) {
    raf = requestAnimationFrame(frame);
    const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
    last = t;
    animate(dt);
    fitNow += (fitTarget - fitNow) * Math.min(dt * 6, 1);
    place();
    renderer.render(scene, camera);
  }
  function start() {
    if (running) return;
    running = true; last = 0; raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false; cancelAnimationFrame(raf);
  }

  const io = new IntersectionObserver(
    e => (e[0].isIntersecting && !document.hidden ? start() : stop()),
    { threshold: 0 },
  );
  io.observe(host);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (host.getBoundingClientRect().bottom > 0) start();
  });

  const ro = new ResizeObserver(() => {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
  ro.observe(host);

  /* A context loss is recoverable in principle and not worth recovering here:
     the CSS stack is still in the DOM, so hand the page back to it. */
  canvas.addEventListener('webglcontextlost', e => {
    e.preventDefault(); stop(); opts.onLost?.();
  });

  return {
    sync, plateDrop,
    // read-only window into the fit maths, for the dev harness
    debug: () => ({
      size: size.toArray().map(v => +v.toFixed(4)),
      centre: centre.toArray().map(v => +v.toFixed(4)),
      rootPos: root.position.toArray().map(v => +v.toFixed(4)),
      camPos: camera.position.toArray().map(v => +v.toFixed(4)),
      fitTarget: +fitTarget.toFixed(4), fitNow: +fitNow.toFixed(4),
      aspect: +camera.aspect.toFixed(3), fov: camera.fov,
      layers: [...live.keys()],
    }),
    dispose() {
      stop(); io.disconnect(); ro.disconnect();
      renderer.dispose(); canvas.remove();
    },
  };
}
