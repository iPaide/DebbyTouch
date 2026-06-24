import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

const stage = document.querySelector("[data-luxury-3d]");
const canvas = document.querySelector("[data-luxury-3d-canvas]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (stage && canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 1.2, 6.4);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));

  const composition = new THREE.Group();
  scene.add(composition);

  const blackMarble = new THREE.MeshPhysicalMaterial({
    color: 0x11100f,
    roughness: 0.34,
    metalness: 0.22,
    clearcoat: 0.7,
    clearcoatRoughness: 0.28,
  });

  const champagneGold = new THREE.MeshPhysicalMaterial({
    color: 0xd8b36f,
    roughness: 0.18,
    metalness: 1,
    clearcoat: 0.8,
    clearcoatRoughness: 0.12,
  });

  const softPowder = new THREE.MeshStandardMaterial({
    color: 0xd8ad8e,
    roughness: 0.74,
    metalness: 0.02,
  });

  const blushMetal = new THREE.MeshPhysicalMaterial({
    color: 0xc78b76,
    roughness: 0.24,
    metalness: 0.72,
    clearcoat: 0.58,
  });

  const bristle = new THREE.MeshStandardMaterial({
    color: 0x9a6147,
    roughness: 0.86,
    metalness: 0.02,
  });

  const glassBottle = new THREE.MeshPhysicalMaterial({
    color: 0xf4dfc8,
    roughness: 0.08,
    metalness: 0.06,
    transmission: 0.28,
    transparent: true,
    opacity: 0.52,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
  });

  const foundationCream = new THREE.MeshStandardMaterial({
    color: 0xd49a73,
    roughness: 0.48,
    metalness: 0.02,
  });

  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = 512;
  labelCanvas.height = 384;
  const labelContext = labelCanvas.getContext("2d");
  labelContext.fillStyle = "rgba(244, 233, 218, 0.86)";
  labelContext.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
  labelContext.strokeStyle = "rgba(34, 25, 19, 0.42)";
  labelContext.lineWidth = 10;
  labelContext.strokeRect(18, 18, labelCanvas.width - 36, labelCanvas.height - 36);
  labelContext.fillStyle = "#1b1815";
  labelContext.textAlign = "center";
  labelContext.font = "700 62px Georgia, serif";
  labelContext.fillText("DEBBY", 256, 140);
  labelContext.fillText("TOUCH", 256, 205);
  labelContext.font = "500 24px Arial, sans-serif";
  labelContext.letterSpacing = "4px";
  labelContext.fillText("LUXURY BEAUTY", 256, 286);
  const bottleLabel = new THREE.CanvasTexture(labelCanvas);
  bottleLabel.colorSpace = THREE.SRGBColorSpace;

  const platform = new THREE.Mesh(new THREE.CylinderGeometry(2.25, 2.35, 0.22, 96), blackMarble);
  platform.position.y = -0.96;
  composition.add(platform);

  const platformRing = new THREE.Mesh(new THREE.TorusGeometry(2.36, 0.018, 12, 128), champagneGold);
  platformRing.position.y = -0.82;
  platformRing.rotation.x = Math.PI / 2;
  composition.add(platformRing);

  const bottle = new THREE.Group();
  bottle.position.set(0, -0.13, 0.06);
  composition.add(bottle);

  const bottleLiquid = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.43, 1.22, 72), foundationCream);
  bottleLiquid.position.y = -0.06;
  bottle.add(bottleLiquid);

  const bottleGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.49, 1.34, 72), glassBottle);
  bottleGlass.position.y = -0.08;
  bottle.add(bottleGlass);

  const bottleBase = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.49, 0.08, 72), new THREE.MeshPhysicalMaterial({
    color: 0xf7eee4,
    roughness: 0.08,
    metalness: 0.16,
    transparent: true,
    opacity: 0.64,
  }));
  bottleBase.position.y = -0.74;
  bottle.add(bottleBase);

  const bottleShoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.16, 64), champagneGold);
  bottleShoulder.position.y = 0.68;
  bottle.add(bottleShoulder);

  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.62, 72), champagneGold);
  cap.position.y = 1.05;
  bottle.add(cap);

  const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.045, 72), new THREE.MeshBasicMaterial({
    color: 0xffe5b7,
    transparent: true,
    opacity: 0.42,
  }));
  capTop.position.y = 1.38;
  bottle.add(capTop);

  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(0.56, 0.42),
    new THREE.MeshBasicMaterial({
      map: bottleLabel,
      transparent: true,
      opacity: 0.92,
    })
  );
  label.position.set(0, -0.17, 0.49);
  bottle.add(label);

  const compact = new THREE.Group();
  compact.position.set(1.12, -0.5, -0.28);
  compact.rotation.set(0.04, -0.55, -0.03);
  compact.scale.setScalar(0.68);
  composition.add(compact);

  const compactBase = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.86, 0.18, 96), champagneGold);
  compact.add(compactBase);

  const powder = new THREE.Mesh(new THREE.CylinderGeometry(0.64, 0.64, 0.045, 96), softPowder);
  powder.position.y = 0.12;
  compact.add(powder);

  const compactRim = new THREE.Mesh(new THREE.TorusGeometry(0.77, 0.035, 12, 96), champagneGold);
  compactRim.position.y = 0.15;
  compactRim.rotation.x = Math.PI / 2;
  compact.add(compactRim);

  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.76, 0.05, 96), champagneGold);
  lid.position.set(-0.1, 0.58, -0.45);
  lid.rotation.x = -0.92;
  compact.add(lid);

  const lidMirror = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.02, 96), new THREE.MeshPhysicalMaterial({
    color: 0xf1e4d7,
    roughness: 0.04,
    metalness: 0.78,
    transmission: 0.14,
  }));
  lidMirror.position.set(-0.1, 0.61, -0.46);
  lidMirror.rotation.x = -0.92;
  compact.add(lidMirror);

  const brush = new THREE.Group();
  brush.position.set(-1.2, -0.56, 0.3);
  brush.rotation.set(0.22, 0.3, -0.48);
  composition.add(brush);

  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.095, 2.18, 32), champagneGold);
  handle.rotation.z = Math.PI / 2;
  handle.position.x = -0.08;
  brush.add(handle);

  const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.105, 0.36, 32), blushMetal);
  ferrule.rotation.z = Math.PI / 2;
  ferrule.position.x = -1.24;
  brush.add(ferrule);

  const bristles = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 48), bristle);
  bristles.rotation.z = -Math.PI / 2;
  bristles.rotation.y = 0.28;
  bristles.position.x = -1.61;
  brush.add(bristles);

  const lipstick = new THREE.Group();
  lipstick.position.set(1.62, -0.5, 0.42);
  lipstick.rotation.set(0.06, 0.18, -0.1);
  lipstick.scale.setScalar(0.86);
  composition.add(lipstick);

  const lipstickCase = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.92, 48), champagneGold);
  lipstickCase.position.y = -0.04;
  lipstick.add(lipstickCase);

  const lipstickBullet = new THREE.Mesh(new THREE.ConeGeometry(0.19, 0.5, 48), new THREE.MeshStandardMaterial({
    color: 0xb86f73,
    roughness: 0.42,
    metalness: 0.08,
  }));
  lipstickBullet.position.y = 0.66;
  lipstick.add(lipstickBullet);

  const accentRing = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.015, 8, 160), new THREE.MeshBasicMaterial({
    color: 0xd8b36f,
    transparent: true,
    opacity: 0.78,
  }));
  accentRing.position.y = -0.76;
  accentRing.rotation.x = Math.PI / 2;
  composition.add(accentRing);

  const bottleHalo = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.008, 8, 128), new THREE.MeshBasicMaterial({
    color: 0xd8b36f,
    transparent: true,
    opacity: 0.42,
  }));
  bottleHalo.position.set(0, 0.12, -0.04);
  bottleHalo.rotation.x = Math.PI / 2;
  composition.add(bottleHalo);

  const particleCount = 180;
  const particlePositions = new Float32Array(particleCount * 3);

  for (let index = 0; index < particleCount; index += 1) {
    const radius = 1.2 + Math.random() * 2.5;
    const angle = Math.random() * Math.PI * 2;
    particlePositions[index * 3] = Math.cos(angle) * radius;
    particlePositions[index * 3 + 1] = -0.35 + Math.random() * 2.25;
    particlePositions[index * 3 + 2] = Math.sin(angle) * radius * 0.56;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: 0xd8b36f,
      size: 0.026,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  composition.add(particles);

  scene.add(new THREE.AmbientLight(0xffead3, 0.92));

  const keyLight = new THREE.DirectionalLight(0xffe0b6, 2.6);
  keyLight.position.set(-3.2, 4.4, 4.2);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0xd8b36f, 3.2, 9);
  rimLight.position.set(2.8, 1.4, 2.4);
  scene.add(rimLight);

  const softFill = new THREE.PointLight(0xfff4e8, 1.8, 8);
  softFill.position.set(-2.2, -0.2, 3);
  scene.add(softFill);

  let width = 0;
  let height = 0;
  let isVisible = false;
  let frameId = 0;
  const pointer = { x: 0, y: 0 };
  const pointerTarget = { x: 0, y: 0 };

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  const render = (time = 0) => {
    const seconds = time * 0.001;
    pointer.x += (pointerTarget.x - pointer.x) * 0.045;
    pointer.y += (pointerTarget.y - pointer.y) * 0.045;

    composition.rotation.x = pointer.y * 0.08;
    composition.rotation.y = Math.sin(seconds * 0.32) * 0.14 + seconds * 0.035 + pointer.x * 0.16;
    composition.position.y = Math.sin(seconds * 0.8) * 0.045 - pointer.y * 0.04;
    bottle.rotation.y = Math.sin(seconds * 0.42) * 0.08 - pointer.x * 0.04;
    bottle.position.y = -0.13 + Math.sin(seconds * 0.72) * 0.025;
    brush.rotation.y = Math.sin(seconds * 0.72) * 0.08 - 0.08;
    accentRing.rotation.z = seconds * 0.12;
    bottleHalo.rotation.z = -seconds * 0.08;
    bottleHalo.position.y = 0.12 + Math.sin(seconds * 0.5) * 0.03;
    particles.rotation.y = -seconds * 0.025;
    camera.position.x = Math.sin(seconds * 0.18) * 0.18 + pointer.x * 0.18;
    camera.position.y = 1.2 + pointer.y * 0.12;
    camera.lookAt(0, -0.18, 0);

    renderer.render(scene, camera);

    if (isVisible && !reduceMotion.matches) {
      frameId = window.requestAnimationFrame(render);
    }
  };

  const start = () => {
    if (!frameId) {
      frameId = window.requestAnimationFrame(render);
    }
  };

  const stop = () => {
    window.cancelAnimationFrame(frameId);
    frameId = 0;
  };

  new ResizeObserver(() => {
    resize();
    render();
  }).observe(stage);

  if (!reduceMotion.matches && window.matchMedia("(pointer: fine)").matches) {
    stage.addEventListener("pointermove", (event) => {
      const rect = stage.getBoundingClientRect();
      pointerTarget.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerTarget.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    stage.addEventListener("pointerleave", () => {
      pointerTarget.x = 0;
      pointerTarget.y = 0;
    });
  }

  new IntersectionObserver(
    (entries) => {
      isVisible = entries.some((entry) => entry.isIntersecting);
      if (isVisible && !reduceMotion.matches) {
        start();
      } else {
        stop();
        render();
      }
    },
    { threshold: 0.18 }
  ).observe(stage);

  resize();
  render();
  stage.classList.add("is-rendered");
}
