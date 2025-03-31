import * as THREE from 'three';

export function initScene() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const colorMap = textureLoader.load('/public/moon_001_COLOR.jpg');
    const displacementMap = textureLoader.load('/public/moon_001_DISP.p,g');
    const normalMap = textureLoader.load('/public/moon_001_NORM.jpg');

    const material = new THREE.MeshStandardMaterial({
        map: colorMap,
        displacementMap: displacementMap,
        displacementScale: 0.1,
        normalMap: normalMap,
    });

    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const moon = new THREE.Mesh(geometry, material);
    moon.position.y = -2;
    scene.add(moon);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 3, 5);
    scene.add(light);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}
