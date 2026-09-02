/* Westline — <wl-skyline>
   To-scale 3D skyline of the whole portfolio. Continuous slow orbit, drag to turn,
   wheel/pinch to zoom, hover to highlight, click to select (fires a "wl-select" event
   with the project key). Needs window.THREE on the page.

   Attributes: night, autorotate="off", selected="<key>"
   Property:   .towers = [{key,name,floors,status,note}]
*/
(function () {
  if (window.customElements && customElements.get("wl-skyline")) return;

  var DEFAULT_TOWERS = [
    { key: "splendid", name: "Splendid Homes", floors: 5, status: "Completed" },
    { key: "bonita", name: "Bonita", floors: 6, status: "Completed" },
    { key: "skydale", name: "Skydale", floors: 7, status: "Completed" },
    { key: "vantage", name: "Vantage", floors: 10, status: "Upcoming" },
    { key: "signature", name: "Westline Signature", floors: 55, status: "Ongoing" },
    { key: "cubix", name: "Cubix", floors: 53, status: "Upcoming" },
    { key: "salubrity", name: "Salubrity", floors: 7, status: "Ongoing" },
    { key: "fairmont", name: "Fairmont", floors: 6, status: "Ongoing" },
    { key: "jeppu", name: "Jeppu Medicity", floors: 6, status: "Completed" }
  ];

  var STATUS_COLOR = { Completed: 0x8d7f6b, Ongoing: 0xc9a96e, Upcoming: 0x6f8399 };

  class WlSkyline extends HTMLElement {
    constructor() {
      super();
      this.towers = null;
      this._objs = [];
      this._spin = 0;
      this._vel = 0;
      this._drag = false;
      this._zoom = 1;
      this._hover = -1;
      this._sel = -1;
      this._t0 = 0;
    }

    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this.style.display = "block";
      this.style.position = "relative";
      if (!this.style.width) this.style.width = "100%";
      if (!this.style.height) this.style.height = "100%";
      this.style.touchAction = "pan-y";
      this.style.cursor = "grab";

      this._canvas = document.createElement("canvas");
      this._canvas.setAttribute("aria-hidden", "true");
      this._canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
      this.appendChild(this._canvas);

      this._labels = document.createElement("div");
      this._labels.style.cssText = "position:absolute;inset:0;pointer-events:none;font-family:Jost,system-ui,sans-serif";
      this.appendChild(this._labels);

      this._reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      this._data = this.towers || DEFAULT_TOWERS;

      if (!window.THREE) { this._fail("3D view needs WebGL. The portfolio is listed in full below."); return; }
      try { this._init(); } catch (e) { this._fail("3D view unavailable on this device. The portfolio is listed in full below."); }
    }

    disconnectedCallback() {
      if (this._raf) cancelAnimationFrame(this._raf);
      if (this._wd) clearInterval(this._wd);
      if (this._ro) this._ro.disconnect();
      if (this._renderer) this._renderer.dispose();
      window.removeEventListener("pointermove", this._onMove);
      window.removeEventListener("pointerup", this._onUp);
    }

    _fail(msg) {
      this._canvas.style.display = "none";
      var d = document.createElement("div");
      d.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font:300 15px/1.6 Jost,system-ui,sans-serif;color:#a8a096";
      d.textContent = msg;
      this.appendChild(d);
    }

    _init() {
      var T = window.THREE;
      this._renderer = new T.WebGLRenderer({ canvas: this._canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
      this._renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
      this._scene = new T.Scene();
      this._camera = new T.PerspectiveCamera(34, 1, 0.5, 3000);
      this._root = new T.Group();
      this._scene.add(this._root);

      this._scene.add(new T.AmbientLight(0x6a5b47, 1.05));
      var key = new T.DirectionalLight(0xfff2dd, 1.35);
      key.position.set(120, 220, 140);
      this._scene.add(key);
      this._rim = new T.DirectionalLight(0xc9a96e, 0.85);
      this._rim.position.set(-160, 90, -80);
      this._scene.add(this._rim);

      // Ground plane, so the towers read as standing on something.
      var ground = new T.Mesh(
        new T.CircleGeometry(520, 64),
        new T.MeshStandardMaterial({ color: 0x120f0c, roughness: 0.95, metalness: 0 })
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.2;
      this._root.add(ground);

      var FH = 3.0;                      // metres per floor, to scale across the portfolio
      var gap = 30;
      var n = this._data.length;
      var x0 = -((n - 1) * gap) / 2;

      for (var i = 0; i < n; i++) {
        var t = this._data[i];
        var floors = t.floors || 3;
        var w = floors > 20 ? 15 : 20;
        var h = floors * FH;
        var col = STATUS_COLOR[t.status] || 0x6f6355;

        var g = new T.Group();
        g.position.x = x0 + i * gap;

        var body = new T.Mesh(
          new T.BoxGeometry(w, h, w),
          new T.MeshStandardMaterial({ color: 0x221b14, roughness: 0.6, metalness: 0.25 })
        );
        body.position.y = h / 2;
        g.add(body);

        // Floor lines: thin bright slabs, so height reads as floor count, not as a blank box.
        var slabGeo = new T.BoxGeometry(w * 1.02, 0.34, w * 1.02);
        var slabMat = new T.MeshStandardMaterial({ color: col, roughness: 0.35, metalness: 0.6, emissive: 0x000000 });
        var slabs = new T.Group();
        for (var f = 0; f < floors; f++) {
          var s = new T.Mesh(slabGeo, slabMat);
          s.position.y = f * FH + FH * 0.92;
          slabs.add(s);
        }
        g.add(slabs);

        g.userData = { key: t.key, name: t.name, floors: floors, status: t.status, h: h, mat: slabMat, body: body, base: col };
        this._root.add(g);
        this._objs.push(g);

        var lab = document.createElement("div");
        lab.style.cssText = "position:absolute;transform:translate(-50%,-100%);white-space:nowrap;transition:opacity 180ms ease";
        lab.innerHTML =
          '<span style="display:block;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#C9A96E">' + t.name + "</span>" +
          '<span style="display:block;font-size:10.5px;letter-spacing:0.1em;color:#7d746a">' + floors + " floors · " + t.status + "</span>";
        this._labels.appendChild(lab);
        g.userData.label = lab;
      }

      this._maxH = 0;
      for (var m = 0; m < this._objs.length; m++) this._maxH = Math.max(this._maxH, this._objs[m].userData.h);

      this._ray = new T.Raycaster();
      this._ndc = new T.Vector2(-2, -2);
      this._bind();

      this._ro = new ResizeObserver(() => this._resize());
      this._ro.observe(this);
      this._resize();

      this._tPrev = performance.now();
      this._t0 = this._tPrev;
      var step = t => {
        var dt = Math.min(0.05, (t - this._tPrev) / 1000);
        if (dt <= 0) return;
        this._tPrev = t;
        this._frame(dt, t);
      };
      this._step = step;
      var loop = t => { this._raf = requestAnimationFrame(loop); step(t); };
      this._raf = requestAnimationFrame(loop);
      // Some embedded contexts throttle rAF to zero; keep the scene alive anyway.
      this._wd = setInterval(() => {
        var now = performance.now();
        if (now - this._tPrev > 200) step(now);
      }, 60);
    }

    _bind() {
      var self = this;
      this.addEventListener("pointerdown", function (e) {
        self._drag = true; self._lastX = e.clientX; self._vel = 0;
        self.style.cursor = "grabbing";
        self._downX = e.clientX; self._downT = Date.now();
        if (self.setPointerCapture && e.pointerId != null) { try { self.setPointerCapture(e.pointerId); } catch (err) {} }
      });
      this._onMove = function (e) {
        var r = self.getBoundingClientRect();
        self._ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        self._ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
        if (!self._drag) return;
        var dx = e.clientX - self._lastX;
        self._lastX = e.clientX;
        self._spin += dx * 0.005;
        self._vel = dx * 0.005;
      };
      this._onUp = function (e) {
        if (!self._drag) return;
        self._drag = false;
        self.style.cursor = "grab";
        // A press that barely moved is a click: select whatever is under the cursor.
        if (Math.abs(e.clientX - self._downX) < 6 && Date.now() - self._downT < 500) self._pick();
      };
      window.addEventListener("pointermove", this._onMove, { passive: true });
      window.addEventListener("pointerup", this._onUp);
      this.addEventListener("pointerleave", function () { self._ndc.set(-2, -2); });
      this.addEventListener("wheel", function (e) {
        e.preventDefault();
        self._zoom = Math.min(1.8, Math.max(0.55, self._zoom * (1 + e.deltaY * 0.0012)));
      }, { passive: false });
    }

    _pick() {
      if (this._hover < 0) return;
      this._sel = this._hover;
      var o = this._objs[this._sel];
      this.setAttribute("selected", o.userData.key);
      this.dispatchEvent(new CustomEvent("wl-select", { bubbles: true, detail: { key: o.userData.key, name: o.userData.name } }));
    }

    _resize() {
      if (!this._renderer) return;
      var w = this.clientWidth || 1, h = this.clientHeight || 1;
      this._renderer.setSize(w, h, false);
      this._camera.aspect = w / h;
      this._camera.updateProjectionMatrix();
    }

    _frame(dt, t) {
      var T = window.THREE;
      var night = this.hasAttribute("night");
      var auto = this.getAttribute("autorotate") !== "off" && !this._reduced;

      if (!this._drag) { this._spin += this._vel; this._vel *= 0.93; }
      if (auto) this._spin += dt * 0.055;

      var dist = 400 * this._zoom;
      var elev = 98;
      this._camera.position.set(Math.sin(this._spin) * dist, elev + Math.sin(t / 4200) * 10, Math.cos(this._spin) * dist);
      this._camera.lookAt(0, 76, 0);

      // Hover pick
      this._ray.setFromCamera(this._ndc, this._camera);
      var hits = this._ray.intersectObjects(this._objs, true);
      var hoverIdx = -1;
      if (hits.length) {
        var o = hits[0].object;
        while (o && this._objs.indexOf(o) < 0) o = o.parent;
        hoverIdx = o ? this._objs.indexOf(o) : -1;
      }
      this._hover = hoverIdx;
      this.style.cursor = this._drag ? "grabbing" : hoverIdx >= 0 ? "pointer" : "grab";

      var selKey = this.getAttribute("selected");
      var pulse = 0.5 + 0.5 * Math.sin(t / 620);
      var W = this.clientWidth || 1, H = this.clientHeight || 1;
      var placed = [];

      for (var i = 0; i < this._objs.length; i++) {
        var g = this._objs[i];
        var d = g.userData;
        var on = i === hoverIdx || d.key === selKey;
        var lit = night || on;
        d.mat.emissive = new T.Color(on ? 0x2a1e0a : night ? 0x140e04 : 0x000000);
        d.mat.emissiveIntensity = on ? 0.6 + pulse * 0.6 : 1;
        d.mat.color = new T.Color(on ? 0xf0e4cc : d.base);
        d.body.material.color = new T.Color(night ? 0x100d0a : on ? 0x2e251a : 0x221b14);

        // Project the label to screen space; collisions are resolved below.
        var v = new T.Vector3(g.position.x, d.h + 10, 0).applyMatrix4(this._root.matrixWorld).project(this._camera);
        placed.push({
          lab: d.label,
          x: (v.x * 0.5 + 0.5) * W,
          y: (-v.y * 0.5 + 0.5) * H,
          vis: v.z < 1 && (on || d.key === "signature")
        });
      }

      // Nudge overlapping labels upward, tallest first, and keep them inside the frame.
      var live = placed.filter(function (l) { return l.vis; }).sort(function (a, b) { return a.y - b.y; });
      for (var j = 0; j < live.length; j++) {
        for (var k = 0; k < j; k++) {
          if (Math.abs(live[j].x - live[k].x) < 150 && Math.abs(live[j].y - live[k].y) < 30) live[j].y = live[k].y + 32;
        }
      }
      for (var q = 0; q < placed.length; q++) {
        var l = placed[q];
        var inFrame = l.x > 70 && l.x < W - 70 && l.y > 26 && l.y < H - 20;
        l.lab.style.left = l.x + "px";
        l.lab.style.top = l.y + "px";
        l.lab.style.opacity = l.vis && inFrame ? "1" : "0";
      }
      this._rim.intensity = night ? 1.5 : 0.85;
      this._renderer.render(this._scene, this._camera);
    }
  }

  customElements.define("wl-skyline", WlSkyline);
  window.WlSkyline = WlSkyline;
})();
