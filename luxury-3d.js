import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

const stage = document.querySelector("[data-luxury-3d]");
const canvas = document.querySelector("[data-luxury-3d-canvas]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (stage && canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0.2, 4.35, 7.4);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));

  const composition = new THREE.Group();
  composition.rotation.x = -0.08;
  scene.add(composition);

  const stepMaterial = new THREE.MeshStandardMaterial({
    color: 0xe6a08c,
    roughness: 0.72,
    metalness: 0.02,
  });

  const stepHighlight = new THREE.MeshStandardMaterial({
    color: 0xf1b8a4,
    roughness: 0.8,
    metalness: 0.01,
  });

  const pearlCase = new THREE.MeshPhysicalMaterial({
    color: 0xe9f0f8,
    roughness: 0.2,
    metalness: 0.38,
    clearcoat: 0.72,
    clearcoatRoughness: 0.16,
  });

  const porcelainBlue = new THREE.MeshPhysicalMaterial({
    color: 0x86a9ff,
    roughness: 0.18,
    metalness: 0.32,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15,
  });

  const champagneGold = new THREE.MeshPhysicalMaterial({
    color: 0xd8b36f,
    roughness: 0.16,
    metalness: 0.9,
    clearcoat: 0.72,
    clearcoatRoughness: 0.12,
  });

  const mirrorMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf5ebe2,
    roughness: 0.05,
    metalness: 0.72,
    transmission: 0.12,
  });

  const powderMaterials = [0xeed7b0, 0xd79b66, 0xbb6237, 0xf0c985, 0xc87a4d].map(
    (color) =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.86,
        metalness: 0.01,
      })
  );

  const steps = new THREE.Group();
  composition.add(steps);

  const stepLayout = [
    [-2.25, 1.5, 0.32],
    [-0.75, 1.5, 0.5],
    [0.75, 1.5, 0.68],
    [2.25, 1.5, 0.86],
    [-1.5, 0.1, 0.62],
    [0, 0.1, 0.8],
    [1.5, 0.1, 0.98],
    [-2.25, -1.3, 0.92],
    [-0.75, -1.3, 1.1],
    [0.75, -1.3, 1.28],
    [2.25, -1.3, 1.46],
  ];

  stepLayout.forEach(([x, z, height], index) => {
    const step = new THREE.Mesh(new THREE.BoxGeometry(1.48, height, 1.42), index % 2 ? stepMaterial : stepHighlight);
    step.position.set(x, -1.1 + height / 2, z);
    steps.add(step);
  });

  const compactGroups = [];

  const createCompact = ({ powderMaterial, scale = 1, lidAngle = -0.95 }) => {
    const compact = new THREE.Group();
    compact.scale.setScalar(scale);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.5, 0.105, 80), pearlCase);
    compact.add(base);

    const blueUnderglow = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.032, 10, 80), porcelainBlue);
    blueUnderglow.position.y = -0.032;
    blueUnderglow.rotation.x = Math.PI / 2;
    compact.add(blueUnderglow);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.022, 10, 80), champagneGold);
    rim.position.y = 0.07;
    rim.rotation.x = Math.PI / 2;
    compact.add(rim);

    const powder = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.035, 80), powderMaterial);
    powder.position.y = 0.082;
    compact.add(powder);

    const lidPivot = new THREE.Group();
    lidPivot.position.set(0, 0.05, -0.42);
    compact.add(lidPivot);

    const lid = new THREE.Mesh(new THREE.TorusGeometry(0.41, 0.045, 12, 88), pearlCase);
    lid.position.set(0, 0.42, 0);
    lid.rotation.x = lidAngle;
    lidPivot.add(lid);

    const mirror = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.015, 80), mirrorMaterial);
    mirror.position.set(0, 0.42, 0);
    mirror.rotation.x = lidAngle;
    lidPivot.add(mirror);

    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.34, 20), champagneGold);
    hinge.position.set(0, 0.09, -0.45);
    hinge.rotation.z = Math.PI / 2;
    compact.add(hinge);

    compact.userData.lidPivot = lidPivot;
    return compact;
  };

  const compactLayout = [
    [-2.25, 1.5, 0.32, 0, 0.05, 0.86],
    [-0.75, 1.5, 0.5, 1, -0.04, 0.86],
    [0.75, 1.5, 0.68, 2, 0.03, 0.86],
    [2.25, 1.5, 0.86, 3, -0.06, 0.82],
    [-1.5, 0.1, 0.62, 4, -0.04, 0.88],
    [0, 0.1, 0.8, 0, 0.05, 0.9],
    [1.5, 0.1, 0.98, 2, -0.03, 0.86],
    [-2.25, -1.3, 0.92, 1, 0.04, 0.86],
    [-0.75, -1.3, 1.1, 3, -0.02, 0.9],
    [0.75, -1.3, 1.28, 4, 0.03, 0.86],
    [2.25, -1.3, 1.46, 2, -0.05, 0.84],
  ];

  compactLayout.forEach(([x, z, height, powderIndex, rotation, scale], index) => {
    const compact = createCompact({
      powderMaterial: powderMaterials[powderIndex],
      scale,
      lidAngle: -0.92 - (index % 3) * 0.06,
    });
    compact.position.set(x, -1.1 + height + 0.1, z + 0.04);
    compact.rotation.y = rotation;
    compact.userData.baseY = compact.position.y;
    compact.userData.phase = index * 0.72;
    composition.add(compact);
    compactGroups.push(compact);
  });

  const particleCount = 150;
  const particlePositions = new Float32Array(particleCount * 3);

  for (let index = 0; index < particleCount; index += 1) {
    particlePositions[index * 3] = -3.4 + Math.random() * 6.8;
    particlePositions[index * 3 + 1] = -0.1 + Math.random() * 2.6;
    particlePositions[index * 3 + 2] = -2.3 + Math.random() * 4.6;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: 0xf6d7b4,
      size: 0.022,
      transparent: true,
      opacity: 0.74,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  composition.add(particles);

  const sweepRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.8, 0.01, 8, 128),
    new THREE.MeshBasicMaterial({
      color: 0xd8b36f,
      transparent: true,
      opacity: 0.42,
    })
  );
  sweepRing.position.set(0, -0.64, 0.2);
  sweepRing.rotation.x = Math.PI / 2;
  composition.add(sweepRing);

  scene.add(new THREE.AmbientLight(0xffe9dc, 1.08));

  const keyLight = new THREE.DirectionalLight(0xffdfc2, 2.75);
  keyLight.position.set(-2.8, 5.2, 4.8);
  scene.add(keyLight);

  const blueRim = new THREE.PointLight(0x83a8ff, 1.8, 7);
  blueRim.position.set(2.8, 1.2, 2.4);
  scene.add(blueRim);

  const champagneFill = new THREE.PointLight(0xd8b36f, 2.4, 8);
  champagneFill.position.set(-2.8, 1.3, -1.8);
  scene.add(champagneFill);

  let width = 0;
  let height = 0;
  let isVisible = false;
  let frameId = 0;

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

    composition.rotation.y = Math.sin(seconds * 0.18) * 0.08;
    composition.position.x = Math.sin(seconds * 0.14) * 0.16;
    composition.position.y = Math.sin(seconds * 0.28) * 0.035;

    compactGroups.forEach((compact, index) => {
      const phase = seconds * 0.62 + compact.userData.phase;
      compact.position.y = compact.userData.baseY + Math.sin(phase) * 0.04;
      compact.rotation.y += Math.sin(phase) * 0.0009;
      compact.userData.lidPivot.rotation.x = Math.sin(phase * 0.7) * 0.045;

      if (index % 4 === 0) {
        compact.scale.setScalar(0.86 + Math.sin(phase * 0.5) * 0.012);
      }
    });

    particles.rotation.y = seconds * 0.035;
    particles.position.y = Math.sin(seconds * 0.4) * 0.04;
    sweepRing.rotation.z = seconds * 0.1;
    camera.position.x = Math.sin(seconds * 0.12) * 0.28;
    camera.position.z = 7.4 + Math.cos(seconds * 0.11) * 0.18;
    camera.lookAt(0, -0.08, 0);

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
