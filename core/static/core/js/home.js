const canvas = document.getElementById("cityCanvas");

if (canvas) {
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 25;

    // --- Luces ---
    const pointLight = new THREE.PointLight(0xffffff, 5);
    pointLight.position.set(10, 20, 20);
    scene.add(pointLight);
    scene.add(new THREE.AmbientLight(0xffffff, 2));

    // --- Edificios ---
    for (let i = 0; i < 120; i++) {
        const building = new THREE.Mesh(
            new THREE.BoxGeometry(1, Math.random() * 10 + 2, 1),
            new THREE.MeshPhongMaterial({ color: 0x0d6efd, emissive: 0x003366 })
        );
        building.position.x = (Math.random() - 0.5) * 60;
        building.position.y = -5;
        building.position.z = (Math.random() - 0.5) * 40;
        scene.add(building);
    }

    // --- Nodos IoT ---
    for (let i = 0; i < 40; i++) {
        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 16, 16),
            new THREE.MeshPhongMaterial({ color: 0x0d6efd, emissive: 0x003366 })
        );
        sphere.position.x = (Math.random() - 0.5) * 50;
        sphere.position.y = Math.random() * 10 - 5;
        sphere.position.z = (Math.random() - 0.5) * 30;
        scene.add(sphere);
    }

    // --- Línea de conexión IoT ---
    const points = [
        new THREE.Vector3(-10, 3, 0),
        new THREE.Vector3(0, 6, 0),
        new THREE.Vector3(10, 3, 0)
    ];
    scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: 0x00ffff })
    ));

    // --- Vehículo ---
    const car = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.4, 0.7),
        new THREE.MeshPhongMaterial({ color: 0x0d6efd, emissive: 0x003366 })
    );
    car.position.y = -8;
    scene.add(car);

    // --- Animación ---
    function animate() {
        requestAnimationFrame(animate);
        car.position.x += 0.08;
        if (car.position.x > 30) car.position.x = -30;
        renderer.render(scene, camera);
    }
    animate();

    // --- Responsive ---
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
