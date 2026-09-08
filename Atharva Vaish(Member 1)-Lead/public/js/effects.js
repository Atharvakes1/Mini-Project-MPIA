// effects.js - Three.js 3D Background Effects

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // Check WebGL Support
    function isWebGLAvailable() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    if (!isWebGLAvailable() || typeof THREE === 'undefined') {
        console.warn('WebGL or Three.js not supported. Showing fallback background.');
        // Fallback applied via CSS usually, we can add a fallback class
        canvas.parentElement.classList.add('webgl-fallback');
        return;
    }

    // Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    const container = canvas.parentElement;
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize performance

    // Group for all models to apply rotation easily
    const campusGroup = new THREE.Group();
    scene.add(campusGroup);

    // 1. Main Central Building (Cube)
    const mainGeometry = new THREE.BoxGeometry(4, 4, 4);
    const mainMaterial = new THREE.MeshPhongMaterial({
        color: 0x7C3AED, // Purple
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    const mainBuilding = new THREE.Mesh(mainGeometry, mainMaterial);
    campusGroup.add(mainBuilding);

    // Inner glowing core
    const coreGeometry = new THREE.BoxGeometry(2, 2, 2);
    const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x9333ea, transparent: true, opacity: 0.5 });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    campusGroup.add(core);

    // 2. Surrounding Department Cubes
    const depts = [];
    const deptCount = 6;
    for(let i=0; i<deptCount; i++) {
        const dGeo = new THREE.BoxGeometry(1, 1, 1);
        const dMat = new THREE.MeshPhongMaterial({
            color: 0xc084fc,
            transparent: true,
            opacity: 0.7,
            wireframe: i % 2 === 0
        });
        const dept = new THREE.Mesh(dGeo, dMat);
        
        // Position in circle
        const angle = (i / deptCount) * Math.PI * 2;
        const radius = 6;
        dept.position.x = Math.cos(angle) * radius;
        dept.position.z = Math.sin(angle) * radius;
        dept.position.y = (Math.random() - 0.5) * 4;
        
        // Custom orbit properties
        dept.userData = {
            angle: angle,
            speed: 0.005 + Math.random() * 0.01,
            radius: radius,
            yOffset: dept.position.y
        };
        
        campusGroup.add(dept);
        depts.push(dept);
    }

    // 3. Connectivity Torus Knot
    const torusGeometry = new THREE.TorusKnotGeometry(8, 0.3, 100, 16);
    const torusMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x4c1d95, 
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    campusGroup.add(torus);

    // 4. Particle System (Glowing Dots)
    const particleCount = 500;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for(let i=0; i<particleCount * 3; i++) {
        particlePositions[i] = (Math.random() - 0.5) * 40;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    // Create circular texture for particles programmatically
    const canvasTexture = document.createElement('canvas');
    canvasTexture.width = 16;
    canvasTexture.height = 16;
    const ctx = canvasTexture.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(8, 8, 8, 0, Math.PI * 2);
    ctx.fill();
    const pTexture = new THREE.CanvasTexture(canvasTexture);

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.2,
        color: 0xa78bfa,
        transparent: true,
        opacity: 0.6,
        map: pTexture,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x7C3AED, 2, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0x3B82F6, 1, 50);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Mouse Parallax Effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.001;
        mouseY = (event.clientY - windowHalfY) * 0.001;
    });

    // Resize Handler
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();

        // Rotate main group
        campusGroup.rotation.y += 0.002;
        campusGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.1;

        // Rotate core and building
        mainBuilding.rotation.x += 0.005;
        mainBuilding.rotation.y += 0.005;
        core.rotation.x -= 0.01;
        core.rotation.y -= 0.01;
        
        // Rotate Torus
        torus.rotation.z -= 0.003;
        torus.rotation.x += 0.001;

        // Orbit Departments
        depts.forEach(dept => {
            dept.userData.angle += dept.userData.speed;
            dept.position.x = Math.cos(dept.userData.angle) * dept.userData.radius;
            dept.position.z = Math.sin(dept.userData.angle) * dept.userData.radius;
            dept.position.y = dept.userData.yOffset + Math.sin(elapsedTime * 2 + dept.userData.angle) * 1;
            
            dept.rotation.x += 0.01;
            dept.rotation.y += 0.02;
        });

        // Gently move particles
        particles.rotation.y = elapsedTime * 0.05;

        // Mouse Parallax easing
        targetX = mouseX * 2;
        targetY = mouseY * 2;
        
        camera.position.x += (targetX - camera.position.x) * 0.02;
        camera.position.y += (-targetY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();
});
