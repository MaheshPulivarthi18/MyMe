import { useEffect, useRef } from "react";
import * as THREE from "three";

// A live model of an event-driven backend: clients -> gateway -> Kafka -> workers -> stores.
// Requests travel along the edges as glowing packets. Pointer and scroll move the camera.

const COLORS = {
  violet: new THREE.Color("#9d8cff"),
  teal: new THREE.Color("#34d1c3"),
  amber: new THREE.Color("#ffb547"),
  sky: new THREE.Color("#6fa8ff"),
  edge: new THREE.Color("#3d5a99"),
  dust: new THREE.Color("#6b84c4"),
};

const TIERS = [
  { key: "clients", n: 5, color: COLORS.violet },
  { key: "gateway", n: 3, color: COLORS.sky },
  { key: "kafka", n: 4, color: COLORS.amber },
  { key: "workers", n: 6, color: COLORS.teal },
  { key: "stores", n: 3, color: COLORS.sky },
];

// Small deterministic PRNG so the graph looks the same on every visit.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function glowTexture() {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.2, "rgba(255,255,255,0.65)");
  grad.addColorStop(0.5, "rgba(255,255,255,0.15)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function nodeGeometry(key) {
  switch (key) {
    case "gateway":
      return new THREE.OctahedronGeometry(0.22, 0);
    case "kafka":
      return new THREE.BoxGeometry(0.5, 0.17, 0.17);
    case "stores":
      return new THREE.CylinderGeometry(0.2, 0.2, 0.32, 20);
    case "clients":
      return new THREE.SphereGeometry(0.13, 16, 12);
    default:
      return new THREE.IcosahedronGeometry(0.17, 0);
  }
}

export default function SystemScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 760px)").matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      mount.dataset.fallback = "true";
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#0b1630", 0.035);
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 15);

    const disposables = [];
    const track = (o) => (disposables.push(o), o);
    const glow = track(glowTexture());

    const graph = new THREE.Group();
    scene.add(graph);

    // Nodes
    const rand = rng(18);
    const tierX = (t) => (t - (TIERS.length - 1) / 2) * 3.1;
    const nodes = [];
    TIERS.forEach((tier, t) => {
      const geo = track(nodeGeometry(tier.key));
      const mat = track(new THREE.MeshBasicMaterial({ color: tier.color }));
      for (let i = 0; i < tier.n; i++) {
        const y = (i - (tier.n - 1) / 2) * 1.35 + (rand() - 0.5) * 0.4;
        const z = Math.cos((y / 4) * Math.PI) * 1.2 + (rand() - 0.5) * 1.6 - 0.6;
        const pos = new THREE.Vector3(tierX(t) + (rand() - 0.5) * 0.5, y, z);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(pos);
        mesh.rotation.set(rand() * 3, rand() * 3, 0);
        if (tier.key === "kafka") mesh.rotation.set(0, 0, 0);
        graph.add(mesh);

        const halo = new THREE.Sprite(
          track(
            new THREE.SpriteMaterial({
              map: glow,
              color: tier.color,
              transparent: true,
              opacity: 0.55,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
            })
          )
        );
        halo.position.copy(pos);
        halo.scale.setScalar(1.2);
        graph.add(halo);
        nodes.push({ tier: t, pos, mesh, halo, pulse: 0, spin: (rand() - 0.5) * 0.6 });
      }
    });

    // Edges: every node links to 1-2 nodes in the next tier; every node gets at least one input.
    const edges = [];
    const out = nodes.map(() => []);
    for (let t = 0; t < TIERS.length - 1; t++) {
      const from = nodes.map((n, i) => i).filter((i) => nodes[i].tier === t);
      const to = nodes.map((n, i) => i).filter((i) => nodes[i].tier === t + 1);
      const fed = new Set();
      from.forEach((a) => {
        const k = 1 + (rand() < 0.55 ? 1 : 0);
        for (let j = 0; j < k; j++) {
          const b = to[Math.floor(rand() * to.length)];
          if (!out[a].includes(b)) {
            out[a].push(b);
            edges.push([a, b]);
            fed.add(b);
          }
        }
      });
      to.forEach((b) => {
        if (!fed.has(b)) {
          const a = from[Math.floor(rand() * from.length)];
          out[a].push(b);
          edges.push([a, b]);
        }
      });
    }
    const edgePos = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      nodes[a].pos.toArray(edgePos, i * 6);
      nodes[b].pos.toArray(edgePos, i * 6 + 3);
    });
    const edgeGeo = track(new THREE.BufferGeometry());
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(edgePos, 3));
    graph.add(
      new THREE.LineSegments(
        edgeGeo,
        track(new THREE.LineBasicMaterial({ color: COLORS.edge, transparent: true, opacity: 0.55 }))
      )
    );

    // Packets with short trails
    const PACKETS = small ? 26 : 54;
    const TRAIL = 4;
    const roots = nodes.map((n, i) => i).filter((i) => nodes[i].tier === 0);
    const packets = [];
    const newRoute = () => {
      let cur = roots[Math.floor(Math.random() * roots.length)];
      const route = [cur];
      while (out[cur].length) {
        cur = out[cur][Math.floor(Math.random() * out[cur].length)];
        route.push(cur);
      }
      return route;
    };
    for (let i = 0; i < PACKETS; i++) {
      packets.push({
        route: newRoute(),
        seg: Math.floor(Math.random() * 3),
        t: Math.random(),
        speed: 0.45 + Math.random() * 0.5,
        color: Math.random() < 0.7 ? COLORS.amber : COLORS.teal,
      });
    }
    const pPos = new Float32Array(PACKETS * TRAIL * 3);
    const pCol = new Float32Array(PACKETS * TRAIL * 3);
    const pGeo = track(new THREE.BufferGeometry());
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
    graph.add(
      new THREE.Points(
        pGeo,
        track(
          new THREE.PointsMaterial({
            size: small ? 0.42 : 0.36,
            map: glow,
            vertexColors: true,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          })
        )
      )
    );

    // Background dust
    const DUST = small ? 350 : 700;
    const dPos = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      const r = 14 + Math.random() * 40;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      dPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      dPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.6;
      dPos[i * 3 + 2] = r * Math.cos(ph) - 10;
    }
    const dGeo = track(new THREE.BufferGeometry());
    dGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
    const dust = new THREE.Points(
      dGeo,
      track(
        new THREE.PointsMaterial({
          size: 0.12,
          map: glow,
          color: COLORS.dust,
          transparent: true,
          opacity: 0.7,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      )
    );
    scene.add(dust);

    const tmp = new THREE.Vector3();
    const placePackets = () => {
      packets.forEach((p, i) => {
        for (let k = 0; k < TRAIL; k++) {
          const back = k * 0.06;
          let seg = p.seg;
          let t = p.t - back;
          while (t < 0 && seg > 0) {
            seg -= 1;
            t += 1;
          }
          t = Math.max(t, 0);
          const a = nodes[p.route[seg]].pos;
          const b = nodes[p.route[Math.min(seg + 1, p.route.length - 1)]].pos;
          tmp.lerpVectors(a, b, t);
          tmp.toArray(pPos, (i * TRAIL + k) * 3);
          const fade = k === 0 ? 1 : 0.55 / k;
          pCol[(i * TRAIL + k) * 3] = p.color.r * fade;
          pCol[(i * TRAIL + k) * 3 + 1] = p.color.g * fade;
          pCol[(i * TRAIL + k) * 3 + 2] = p.color.b * fade;
        }
      });
      pGeo.attributes.position.needsUpdate = true;
      pGeo.attributes.color.needsUpdate = true;
    };

    // Interaction state
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let scroll = 0;
    const onPointer = (e) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll = max > 0 ? window.scrollY / max : 0;
    };

    const layout = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const narrow = w < 900;
      graph.userData.baseX = narrow ? 0 : w < 1300 ? 3.6 : 4.4;
      graph.userData.baseY = narrow ? -1.6 : 0.4;
      graph.userData.baseZ = narrow ? 18 : 15;
      graph.scale.setScalar(narrow ? 0.6 : 0.74);
    };
    layout();
    onScroll();

    const applyCamera = (time) => {
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      const ud = graph.userData;
      graph.position.x = ud.baseX * (1 - Math.min(scroll * 4, 1));
      graph.position.y = ud.baseY + scroll * 1.5;
      graph.rotation.y = -0.35 + Math.sin(time * 0.00012) * 0.18 + pointer.x * 0.35 + scroll * 1.6;
      graph.rotation.x = 0.12 + pointer.y * 0.18 - scroll * 0.35;
      camera.position.z = ud.baseZ + scroll * 7;
      dust.rotation.y = time * 0.00002 + scroll * 0.4;
    };

    let last = performance.now();
    let raf = 0;
    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      packets.forEach((p) => {
        p.t += dt * p.speed;
        while (p.t >= 1) {
          p.t -= 1;
          p.seg += 1;
          const arrived = nodes[p.route[p.seg]];
          if (arrived) arrived.pulse = 1;
          if (p.seg >= p.route.length - 1) {
            p.route = newRoute();
            p.seg = 0;
            p.speed = 0.45 + Math.random() * 0.5;
          }
        }
      });
      placePackets();

      nodes.forEach((n) => {
        n.pulse = Math.max(0, n.pulse - dt * 2.2);
        n.halo.scale.setScalar(1.2 + n.pulse * 0.9);
        n.halo.material.opacity = 0.5 + n.pulse * 0.45;
        n.mesh.rotation.y += dt * n.spin;
      });

      applyCamera(now);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    const onResize = () => {
      layout();
      if (reduced) {
        applyCamera(0);
        renderer.render(scene, camera);
      }
    };
    const onVisibility = () => {
      if (reduced) return;
      if (document.hidden) cancelAnimationFrame(raf);
      else {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    if (reduced) {
      placePackets();
      applyCamera(0);
      renderer.render(scene, camera);
      const onStaticScroll = () => {
        onScroll();
        applyCamera(0);
        renderer.render(scene, camera);
      };
      window.addEventListener("scroll", onStaticScroll, { passive: true });
      disposables.push({ dispose: () => window.removeEventListener("scroll", onStaticScroll) });
    } else {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      raf = requestAnimationFrame(frame);
    }
    mount.dataset.ready = "true";

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="scene" aria-hidden="true" />;
}
