const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("cityCanvas"),
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

camera.position.z = 30;

/* ==========================
   NODOS IOT
========================== */

const nodes = [];
const nodeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
const nodeMaterial = new THREE.MeshBasicMaterial({
    color: 0x00d4ff
});

for (let i = 0; i < 60; i++) {

    const node = new THREE.Mesh(
        nodeGeometry,
        nodeMaterial
    );

    node.position.x = (Math.random() - 0.5) * 60;
    node.position.y = (Math.random() - 0.5) * 30;
    node.position.z = (Math.random() - 0.5) * 20;

    scene.add(node);
    nodes.push(node);
}

/* ==========================
   CONEXIONES
========================== */

const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x0066ff,
    transparent: true,
    opacity: 0.4
});

for (let i = 0; i < nodes.length; i++) {

    for (let j = i + 1; j < nodes.length; j++) {

        const distance =
            nodes[i].position.distanceTo(nodes[j].position);

        if (distance < 12) {

            const points = [
                nodes[i].position,
                nodes[j].position
            ];

            const geometry =
                new THREE.BufferGeometry().setFromPoints(points);

            const line =
                new THREE.Line(geometry, lineMaterial);

            scene.add(line);
        }
    }
}

/* ==========================
   PARTÍCULAS DE DATOS
========================== */

const particles = [];

for (let i = 0; i < 100; i++) {

    const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 8, 8),
        new THREE.MeshBasicMaterial({
            color: 0xff3b3b
        })
    );

    particle.position.x = (Math.random() - 0.5) * 60;
    particle.position.y = (Math.random() - 0.5) * 30;
    particle.position.z = (Math.random() - 0.5) * 20;

    particle.velocity = {
        x: (Math.random() - 0.5) * 0.03,
        y: (Math.random() - 0.5) * 0.03,
        z: (Math.random() - 0.5) * 0.03
    };

    scene.add(particle);
    particles.push(particle);
}

/* ==========================
   ANIMACIÓN
========================== */

function animate() {

    requestAnimationFrame(animate);

    particles.forEach(p => {

        p.position.x += p.velocity.x;
        p.position.y += p.velocity.y;
        p.position.z += p.velocity.z;

        if (Math.abs(p.position.x) > 30)
            p.velocity.x *= -1;

        if (Math.abs(p.position.y) > 15)
            p.velocity.y *= -1;

        if (Math.abs(p.position.z) > 10)
            p.velocity.z *= -1;
    });

    scene.rotation.y += 0.0008;

    renderer.render(scene, camera);
}

animate();

/* ==========================
   RESPONSIVE
========================== */

window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});
