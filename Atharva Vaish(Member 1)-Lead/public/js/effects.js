// ═══════════════════════════════════════════════════════════════
// Campus Clone - MPIA | 3D College Scene
// Graduation cap + floating books + particle constellations
// ═══════════════════════════════════════════════════════════════

(function () {
  const container = document.getElementById('three-canvas')?.parentElement ||
                    document.querySelector('.hero-3d-container');
  const canvas = document.getElementById('three-canvas');

  if (!canvas || !container) {
    console.log('[3D] No canvas found, skipping');
    return;
  }

  // Check WebGL support
  try {
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) throw new Error('No WebGL');
  } catch (e) {
    container.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse at center,rgba(0,212,255,0.08),transparent 70%);border-radius:20px"><p style="color:var(--text-muted);font-family:var(--font-mono);font-size:12px">3D requires WebGL</p></div>';
    return;
  }

  // Dynamic import Three.js
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  script.onload = initScene;
  document.head.appendChild(script);

  function initScene() {
    const THREE = window.THREE;
    if (!THREE) return;

    const w = container.clientWidth || 500;
    const h = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 1000);
    camera.position.set(0, 1.5, 6);
    camera.lookAt(0, 0.5, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // ─── Lighting ───
    const ambientLight = new THREE.AmbientLight(0x4466AA, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0x00D4FF, 1.2, 20);
    mainLight.position.set(3, 4, 3);
    scene.add(mainLight);

    const warmLight = new THREE.PointLight(0xFF6B35, 0.6, 15);
    warmLight.position.set(-3, 2, -2);
    scene.add(warmLight);

    const rimLight = new THREE.PointLight(0xFFD700, 0.4, 12);
    rimLight.position.set(0, -2, 4);
    scene.add(rimLight);

    // ─── Graduation Cap ───
    const capGroup = new THREE.Group();

    // Square board (mortarboard)
    const boardGeo = new THREE.BoxGeometry(2.2, 0.08, 2.2);
    const boardMat = new THREE.MeshPhongMaterial({
      color: 0x0B1428,
      specular: 0x00D4FF,
      shininess: 80,
      emissive: 0x001122,
    });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.y = 0.6;
    capGroup.add(board);

    // Board edge glow
    const edgeGeo = new THREE.EdgesGeometry(boardGeo);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x00D4FF, linewidth: 2 });
    const edges = new THREE.LineSegments(edgeGeo, edgeMat);
    edges.position.copy(board.position);
    capGroup.add(edges);

    // Cap dome (skull cap)
    const domeGeo = new THREE.CylinderGeometry(0.75, 0.9, 0.5, 6);
    const domeMat = new THREE.MeshPhongMaterial({
      color: 0x0B1428,
      specular: 0x0099CC,
      shininess: 60,
      emissive: 0x001122,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 0.3;
    capGroup.add(dome);

    // Tassel button (top center)
    const buttonGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const buttonMat = new THREE.MeshPhongMaterial({
      color: 0xFFD700,
      emissive: 0x664400,
      shininess: 100,
    });
    const button = new THREE.Mesh(buttonGeo, buttonMat);
    button.position.set(0, 0.68, 0);
    capGroup.add(button);

    // Tassel string
    const tasselCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.68, 0),
      new THREE.Vector3(0.4, 0.5, 0.2),
      new THREE.Vector3(0.9, 0.2, 0.3),
      new THREE.Vector3(1.1, -0.2, 0.2),
    ]);
    const tasselGeo = new THREE.TubeGeometry(tasselCurve, 20, 0.02, 8, false);
    const tasselMat = new THREE.MeshPhongMaterial({
      color: 0xFFD700,
      emissive: 0x553300,
      shininess: 80,
    });
    const tassel = new THREE.Mesh(tasselGeo, tasselMat);
    capGroup.add(tassel);

    // Tassel end cluster
    for (let i = 0; i < 5; i++) {
      const threadGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.3, 4);
      const thread = new THREE.Mesh(threadGeo, tasselMat);
      thread.position.set(
        1.1 + (Math.random() - 0.5) * 0.1,
        -0.35 - Math.random() * 0.15,
        0.2 + (Math.random() - 0.5) * 0.1
      );
      thread.rotation.z = (Math.random() - 0.5) * 0.3;
      capGroup.add(thread);
    }

    capGroup.position.y = 0.5;
    scene.add(capGroup);

    // ─── Floating Books ───
    const books = [];
    const bookColors = [0x00D4FF, 0xFF6B35, 0xFFD700, 0x00E080, 0x6B35FF];
    const bookData = [
      { x: -2.5, y: -0.3, z: -1, rx: 0.2, ry: 0.5, scale: 0.7 },
      { x: 2.8, y: 0.2, z: -0.5, rx: -0.15, ry: -0.3, scale: 0.6 },
      { x: -1.8, y: 1.8, z: -1.5, rx: 0.4, ry: 0.8, scale: 0.5 },
      { x: 2, y: 1.5, z: -1, rx: -0.3, ry: 0.4, scale: 0.55 },
      { x: 0.5, y: -1, z: -2, rx: 0.1, ry: -0.6, scale: 0.65 },
    ];

    bookData.forEach((bd, i) => {
      const bookGroup = new THREE.Group();

      // Book cover
      const coverGeo = new THREE.BoxGeometry(0.8, 1.1, 0.12);
      const coverMat = new THREE.MeshPhongMaterial({
        color: bookColors[i],
        specular: 0xffffff,
        shininess: 40,
        emissive: new THREE.Color(bookColors[i]).multiplyScalar(0.15),
      });
      const cover = new THREE.Mesh(coverGeo, coverMat);
      bookGroup.add(cover);

      // Pages (slightly inset)
      const pagesGeo = new THREE.BoxGeometry(0.7, 1.0, 0.08);
      const pagesMat = new THREE.MeshPhongMaterial({
        color: 0xE8ECF4,
        specular: 0xaaaaaa,
        shininess: 20,
      });
      const pages = new THREE.Mesh(pagesGeo, pagesMat);
      pages.position.x = 0.02;
      bookGroup.add(pages);

      // Spine edge glow
      const spineEdges = new THREE.EdgesGeometry(coverGeo);
      const spineLine = new THREE.LineSegments(spineEdges,
        new THREE.LineBasicMaterial({ color: bookColors[i], transparent: true, opacity: 0.3 })
      );
      bookGroup.add(spineLine);

      bookGroup.position.set(bd.x, bd.y, bd.z);
      bookGroup.rotation.set(bd.rx, bd.ry, 0);
      bookGroup.scale.setScalar(bd.scale);

      books.push({ mesh: bookGroup, baseY: bd.y, speed: 0.5 + Math.random() * 0.8, phase: Math.random() * Math.PI * 2 });
      scene.add(bookGroup);
    });

    // ─── Particle Constellation ───
    const particleCount = 300;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const cyanColor = new THREE.Color(0x00D4FF);
    const orangeColor = new THREE.Color(0xFF6B35);
    const goldColor = new THREE.Color(0xFFD700);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 3 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = (Math.random() - 0.5) * 6;
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta) - 2;

      const colorChoice = Math.random();
      const c = colorChoice < 0.5 ? cyanColor : colorChoice < 0.8 ? orangeColor : goldColor;
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;

      sizes[i] = Math.random() * 3 + 1;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Create circular particle texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32; pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const gradient = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.6)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    pCtx.fillStyle = gradient;
    pCtx.fillRect(0, 0, 32, 32);
    const particleTexture = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.06,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ─── Orbital Rings ───
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00D4FF,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3, 0.01, 8, 100), ringMat);
    ring1.rotation.x = Math.PI * 0.45;
    ring1.rotation.z = 0.3;
    scene.add(ring1);

    const ring2Mat = ringMat.clone();
    ring2Mat.color = new THREE.Color(0xFF6B35);
    ring2Mat.opacity = 0.05;
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.008, 8, 100), ring2Mat);
    ring2.rotation.x = Math.PI * 0.55;
    ring2.rotation.z = -0.4;
    scene.add(ring2);

    // ─── Mouse Parallax ───
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    document.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // ─── Animation Loop ───
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // Camera parallax
      camera.position.x = mouseX * 0.8;
      camera.position.y = 1.5 - mouseY * 0.4;
      camera.lookAt(0, 0.5, 0);

      // Graduation cap gentle float + rotate
      capGroup.rotation.y = t * 0.15 + mouseX * 0.2;
      capGroup.position.y = 0.5 + Math.sin(t * 0.8) * 0.15;

      // Floating books
      books.forEach((book) => {
        book.mesh.position.y = book.baseY + Math.sin(t * book.speed + book.phase) * 0.25;
        book.mesh.rotation.y += 0.003;
        book.mesh.rotation.x = Math.sin(t * 0.3 + book.phase) * 0.05;
      });

      // Particles slow rotation
      particles.rotation.y = t * 0.02;
      particles.rotation.x = Math.sin(t * 0.05) * 0.05;

      // Orbital rings
      ring1.rotation.z = 0.3 + t * 0.08;
      ring2.rotation.z = -0.4 - t * 0.06;

      // Lights pulse
      mainLight.intensity = 1.2 + Math.sin(t * 1.5) * 0.2;
      warmLight.intensity = 0.6 + Math.sin(t * 1.2 + 1) * 0.15;

      renderer.render(scene, camera);
    }

    animate();

    // ─── Resize ───
    function onResize() {
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW === 0 || newH === 0) return;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    }

    window.addEventListener('resize', onResize);

    // Also handle visibility changes to save GPU
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        renderer.setAnimationLoop(null);
      } else {
        renderer.setAnimationLoop(null);
        animate();
      }
    });
  }
})();
