import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

const stage = document.querySelector("[data-luxury-3d]");
const canvas = document.querySelector("[data-luxury-3d-canvas]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (stage && canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 1.08, 7.25);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));

  const composition = new THREE.Group();
  scene.add(composition);

  const studioFloor = new THREE.MeshPhysicalMaterial({
    color: 0xd8d1c5,
    roughness: 0.48,
    metalness: 0.03,
    clearcoat: 0.18,
    clearcoatRoughness: 0.38,
  });

  const pianoBlack = new THREE.MeshPhysicalMaterial({
    color: 0x030303,
    roughness: 0.12,
    metalness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
  });

  const champagneGold = new THREE.MeshPhysicalMaterial({
    color: 0xd8b36f,
    roughness: 0.15,
    metalness: 1,
    clearcoat: 0.72,
    clearcoatRoughness: 0.12,
  });

  const satinGold = new THREE.MeshPhysicalMaterial({
    color: 0xc9a65e,
    roughness: 0.28,
    metalness: 0.88,
    clearcoat: 0.42,
    clearcoatRoughness: 0.24,
  });

  const heavyGlass = new THREE.MeshPhysicalMaterial({
    color: 0x0a0a09,
    roughness: 0.18,
    metalness: 0.1,
    transmission: 0.18,
    transparent: true,
    opacity: 0.74,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
  });

  const mirrorMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xe9e0d3,
    roughness: 0.03,
    metalness: 0.9,
    transmission: 0.08,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
  });

  const softPowder = new THREE.MeshStandardMaterial({
    color: 0xe6ddcf,
    roughness: 0.86,
    metalness: 0.01,
  });

  const lipstickWax = new THREE.MeshStandardMaterial({
    color: 0x7c1f22,
    roughness: 0.36,
    metalness: 0.04,
  });

  const createRoundedBox = (width, height, depth, radius, depthSegments = 1) => {
    const x = width / 2 - radius;
    const y = height / 2 - radius;
    const shape = new THREE.Shape();
    shape.moveTo(-x, -height / 2);
    shape.lineTo(x, -height / 2);
    shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -y);
    shape.lineTo(width / 2, y);
    shape.quadraticCurveTo(width / 2, height / 2, x, height / 2);
    shape.lineTo(-x, height / 2);
    shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, y);
    shape.lineTo(-width / 2, -y);
    shape.quadraticCurveTo(-width / 2, -height / 2, -x, -height / 2);

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelSegments: 10,
      bevelSize: Math.min(radius * 0.34, 0.055),
      bevelThickness: Math.min(radius * 0.28, 0.05),
      curveSegments: 18,
      steps: depthSegments,
    });
    geometry.center();
    return geometry;
  };

  const createLogoTexture = (color = "#d8b36f", shadow = false) => {
    const logoCanvas = document.createElement("canvas");
    logoCanvas.width = 512;
    logoCanvas.height = 512;
    const context = logoCanvas.getContext("2d");
    context.clearRect(0, 0, logoCanvas.width, logoCanvas.height);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "600 188px Georgia, serif";
    if (shadow) {
      context.shadowColor = "rgba(0, 0, 0, 0.36)";
      context.shadowBlur = 18;
      context.shadowOffsetY = 7;
    }
    context.fillStyle = color;
    context.fillText("DT", 256, 264);
    const texture = new THREE.CanvasTexture(logoCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  const dtGold = createLogoTexture("#d8b36f", true);
  const dtEmboss = createLogoTexture("rgba(42, 30, 15, 0.35)");

  const logoMaterial = new THREE.MeshBasicMaterial({
    map: dtGold,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    depthTest: false,
  });

  const embossedLogoMaterial = new THREE.MeshBasicMaterial({
    map: dtEmboss,
    transparent: true,
    opacity: 0.48,
    depthWrite: false,
  });

  const platform = new THREE.Mesh(new THREE.CylinderGeometry(2.55, 2.68, 0.22, 128), studioFloor);
  platform.position.y = -1.03;
  composition.add(platform);

  const shadowDisk = new THREE.Mesh(new THREE.CylinderGeometry(2.62, 2.7, 0.024, 128), new THREE.MeshBasicMaterial({
    color: 0x0a0908,
    transparent: true,
    opacity: 0.16,
  }));
  shadowDisk.position.y = -0.895;
  composition.add(shadowDisk);

  const goldHalo = new THREE.Mesh(new THREE.TorusGeometry(2.43, 0.012, 8, 180), new THREE.MeshBasicMaterial({
    color: 0xd8b36f,
    transparent: true,
    opacity: 0.38,
  }));
  goldHalo.position.y = -0.86;
  goldHalo.rotation.x = Math.PI / 2;
  composition.add(goldHalo);

  const foundation = new THREE.Group();
  foundation.position.set(0.12, -0.01, -0.12);
  foundation.rotation.y = -0.08;
  composition.add(foundation);

  const bottleBody = new THREE.Mesh(createRoundedBox(0.86, 2.28, 0.46, 0.14), heavyGlass);
  bottleBody.position.y = -0.02;
  foundation.add(bottleBody);

  const lacquerPanel = new THREE.Mesh(createRoundedBox(0.68, 1.72, 0.035, 0.11), pianoBlack);
  lacquerPanel.position.set(0, -0.1, 0.252);
  foundation.add(lacquerPanel);

  const reflectionMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
  });

  const bottleReflection = new THREE.Mesh(new THREE.PlaneGeometry(0.055, 1.55), reflectionMaterial);
  bottleReflection.position.set(-0.27, -0.08, 0.294);
  foundation.add(bottleReflection);

  const softBottleReflection = new THREE.Mesh(new THREE.PlaneGeometry(0.025, 1.18), reflectionMaterial.clone());
  softBottleReflection.material.opacity = 0.08;
  softBottleReflection.position.set(0.29, -0.12, 0.296);
  foundation.add(softBottleReflection);

  const weightedBase = new THREE.Mesh(createRoundedBox(0.88, 0.16, 0.5, 0.09), satinGold);
  weightedBase.position.y = -1.22;
  foundation.add(weightedBase);

  const collar = new THREE.Mesh(createRoundedBox(0.88, 0.18, 0.5, 0.08), champagneGold);
  collar.position.y = 1.17;
  foundation.add(collar);

  const cap = new THREE.Mesh(createRoundedBox(0.76, 0.78, 0.46, 0.1), pianoBlack);
  cap.position.y = 1.65;
  foundation.add(cap);

  const capTop = new THREE.Mesh(createRoundedBox(0.78, 0.075, 0.48, 0.07), champagneGold);
  capTop.position.y = 2.08;
  foundation.add(capTop);

  const pumpStem = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.2, 36), champagneGold);
  pumpStem.position.y = 2.18;
  foundation.add(pumpStem);

  const pumpHead = new THREE.Mesh(createRoundedBox(0.44, 0.12, 0.27, 0.055), champagneGold);
  pumpHead.position.set(0.06, 2.3, 0.01);
  foundation.add(pumpHead);

  const pumpSpout = new THREE.Mesh(createRoundedBox(0.34, 0.07, 0.12, 0.035), champagneGold);
  pumpSpout.position.set(0.28, 2.31, 0.02);
  foundation.add(pumpSpout);

  const foundationLogo = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.42), logoMaterial);
  foundationLogo.position.set(0, 0.13, 0.322);
  foundation.add(foundationLogo);

  const compact = new THREE.Group();
  compact.position.set(1.28, -0.58, 0.16);
  compact.rotation.set(0.08, -0.58, -0.015);
  compact.scale.setScalar(0.92);
  composition.add(compact);

  const compactLower = new THREE.Mesh(new THREE.CylinderGeometry(0.83, 0.88, 0.22, 128), champagneGold);
  compact.add(compactLower);

  const compactBlackRim = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.055, 14, 128), pianoBlack);
  compactBlackRim.position.y = 0.13;
  compactBlackRim.rotation.x = Math.PI / 2;
  compact.add(compactBlackRim);

  const powderPan = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.035, 128), softPowder);
  powderPan.position.y = 0.16;
  compact.add(powderPan);

  const powderBevel = new THREE.Mesh(new THREE.TorusGeometry(0.63, 0.025, 12, 128), satinGold);
  powderBevel.position.y = 0.19;
  powderBevel.rotation.x = Math.PI / 2;
  compact.add(powderBevel);

  const hingeBar = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.46, 32), champagneGold);
  hingeBar.position.set(0, 0.24, -0.86);
  hingeBar.rotation.x = Math.PI / 2;
  compact.add(hingeBar);

  const hingeKnuckleLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.12, 32), champagneGold);
  hingeKnuckleLeft.position.set(-0.24, 0.24, -0.87);
  hingeKnuckleLeft.rotation.x = Math.PI / 2;
  compact.add(hingeKnuckleLeft);

  const hingeKnuckleRight = hingeKnuckleLeft.clone();
  hingeKnuckleRight.position.x = 0.24;
  compact.add(hingeKnuckleRight);

  const clasp = new THREE.Mesh(createRoundedBox(0.28, 0.12, 0.045, 0.028), champagneGold);
  clasp.position.set(0, 0.08, 0.89);
  compact.add(clasp);

  const compactLid = new THREE.Group();
  compactLid.position.set(0, 0.22, -0.8);
  compactLid.rotation.x = -1.08;
  compact.add(compactLid);

  const lidOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.86, 0.08, 128), champagneGold);
  lidOuter.rotation.x = Math.PI / 2;
  compactLid.add(lidOuter);

  const lidBlackInset = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.092, 128), pianoBlack);
  lidBlackInset.rotation.x = Math.PI / 2;
  lidBlackInset.position.z = 0.011;
  compactLid.add(lidBlackInset);

  const compactLogo = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.42), embossedLogoMaterial);
  compactLogo.position.z = 0.065;
  compactLogo.rotation.x = 0;
  compactLid.add(compactLogo);

  const mirror = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.018, 128), mirrorMaterial);
  mirror.position.z = -0.058;
  mirror.rotation.x = Math.PI / 2;
  compactLid.add(mirror);

  const lipstick = new THREE.Group();
  lipstick.position.set(-1.2, -0.57, 0.54);
  lipstick.rotation.set(0.02, 0.28, -0.02);
  lipstick.scale.setScalar(0.86);
  composition.add(lipstick);

  const lipstickBase = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.29, 0.28, 64), pianoBlack);
  lipstickBase.position.y = -0.34;
  lipstick.add(lipstickBase);

  const lipstickLowerGold = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.54, 64), champagneGold);
  lipstickLowerGold.position.y = 0.06;
  lipstick.add(lipstickLowerGold);

  const lipstickLogo = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), embossedLogoMaterial);
  lipstickLogo.position.set(0, 0.08, 0.276);
  lipstick.add(lipstickLogo);

  const lipstickInner = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.21, 0.78, 64), champagneGold);
  lipstickInner.position.y = 0.74;
  lipstick.add(lipstickInner);

  const bulletBody = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.19, 0.55, 64), lipstickWax);
  bulletBody.position.y = 1.35;
  lipstick.add(bulletBody);

  const bulletTip = new THREE.Mesh(new THREE.ConeGeometry(0.19, 0.38, 64), lipstickWax);
  bulletTip.position.y = 1.81;
  bulletTip.scale.x = 0.88;
  bulletTip.rotation.z = -0.1;
  lipstick.add(bulletTip);

  const lipstickCap = new THREE.Group();
  lipstickCap.position.set(0.62, -0.04, -0.14);
  lipstickCap.rotation.y = -0.06;
  lipstick.add(lipstickCap);

  const capShell = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.32, 1.14, 64), champagneGold);
  lipstickCap.add(capShell);

  const capLacquerInset = new THREE.Mesh(createRoundedBox(0.33, 0.88, 0.035, 0.08), pianoBlack);
  capLacquerInset.position.set(0, 0, 0.31);
  lipstickCap.add(capLacquerInset);

  const capTopLip = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.04, 64), champagneGold);
  capTopLip.position.y = 0.59;
  lipstickCap.add(capTopLip);

  const lightArc = new THREE.Mesh(new THREE.TorusGeometry(1.92, 0.009, 8, 180), new THREE.MeshBasicMaterial({
    color: 0xd8b36f,
    transparent: true,
    opacity: 0.28,
  }));
  lightArc.position.set(0.1, -0.25, -0.08);
  lightArc.rotation.x = Math.PI / 2;
  composition.add(lightArc);

  const particleCount = 120;
  const particlePositions = new Float32Array(particleCount * 3);

  for (let index = 0; index < particleCount; index += 1) {
    const radius = 1.4 + Math.random() * 2.25;
    const angle = Math.random() * Math.PI * 2;
    particlePositions[index * 3] = Math.cos(angle) * radius;
    particlePositions[index * 3 + 1] = -0.25 + Math.random() * 1.9;
    particlePositions[index * 3 + 2] = Math.sin(angle) * radius * 0.48;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: 0xd8b36f,
      size: 0.018,
      transparent: true,
      opacity: 0.44,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  composition.add(particles);

  scene.add(new THREE.HemisphereLight(0xfff0de, 0x18130d, 0.76));

  const keyLight = new THREE.DirectionalLight(0xffe2b6, 3.2);
  keyLight.position.set(-3.2, 4.8, 4.6);
  scene.add(keyLight);

  const stripLight = new THREE.RectAreaLight(0xffffff, 3.4, 1.4, 4.2);
  stripLight.position.set(-2.8, 1.5, 3);
  stripLight.lookAt(0, 0.25, 0);
  scene.add(stripLight);

  const rimLight = new THREE.PointLight(0xd8b36f, 3.4, 9);
  rimLight.position.set(2.8, 1.3, 2.8);
  scene.add(rimLight);

  const lowFill = new THREE.PointLight(0xfff4e8, 1.4, 8);
  lowFill.position.set(-1.8, -0.7, 2.6);
  scene.add(lowFill);

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

    composition.rotation.x = pointer.y * 0.07;
    composition.rotation.y = Math.sin(seconds * 0.24) * 0.09 + seconds * 0.024 + pointer.x * 0.13;
    composition.position.y = Math.sin(seconds * 0.72) * 0.035 - pointer.y * 0.035;
    foundation.position.y = -0.01 + Math.sin(seconds * 0.66) * 0.018;
    compactLid.rotation.x = -1.08 + Math.sin(seconds * 0.42) * 0.025;
    lipstick.position.y = -0.54 + Math.sin(seconds * 0.58 + 0.8) * 0.016;
    lightArc.rotation.z = seconds * 0.08;
    particles.rotation.y = -seconds * 0.018;
    camera.position.x = Math.sin(seconds * 0.16) * 0.13 + pointer.x * 0.16;
    camera.position.y = 1.15 + pointer.y * 0.1;
    camera.lookAt(0, -0.1, 0);

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
