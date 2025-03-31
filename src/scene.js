import * as THREE from 'three';
import gsap from 'gsap';

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

    const geometry = new THREE.SphereGeometry(3, 64, 64);
    const moon = new THREE.Mesh(geometry, material);
    moon.position.y = -3;
    scene.add(moon);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 3, 5);
    scene.add(light);

    camera.position.z = 5;

    const characterTextures = [
        textureLoader.load('/public/character1.png'),
        textureLoader.load('/public/character2.png'),
        textureLoader.load('/public/character3.png'),
        textureLoader.load('/public/character4.png'),
        textureLoader.load('/public/character5.png'),
        textureLoader.load('/public/character6.png'),
    ];

    let currentTextureIndex = 0;

    const characterMaterial = new THREE.SpriteMaterial({ map: characterTextures[currentTextureIndex] });
    const character = new THREE.Sprite(characterMaterial);
    character.scale.set(1, 1, 1);
    character.position.set(0, 0, 2);
    scene.add(character);

    // Tourner la lune au clic
    window.addEventListener('click', () => {
        gsap.to(moon.rotation, { z: moon.rotation.z + THREE.MathUtils.degToRad(45), duration: 1, ease: "power2.inOut" });

        gsap.to(character.material, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                currentTextureIndex = (currentTextureIndex + 1) % characterTextures.length;
                character.material.map = characterTextures[currentTextureIndex];
                character.material.needsUpdate = true;

                gsap.to(character.material, { opacity: 1, duration: 1.25, ease: "power2.inOut" });
            }
        });
    });

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}