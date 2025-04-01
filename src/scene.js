import * as THREE from 'three';
import gsap from 'gsap';

export function initScene() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    const loader = new THREE.TextureLoader();
    loader.load('public/space-bg2.jpg', function(texture) {
        scene.background = texture;
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const colorMap = textureLoader.load('/public/moon_001_COLOR.jpg');
    const displacementMap = textureLoader.load('/public/moon_001_DISP.png');
    const normalMap = textureLoader.load('/public/moon_001_NORM.jpg');

    const material = new THREE.MeshStandardMaterial({
        map: colorMap,
        displacementMap: displacementMap,
        displacementScale: 0.1,
        normalMap: normalMap,
    });

    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const moon = new THREE.Mesh(geometry, material);
    moon.position.y = -2.5;
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
    character.scale.set(0.5, 0.5, 0.5);
    character.position.set(0, -0.25, 2);
    scene.add(character);

    const characterTexts = [
        { name: "Le Petit Prince", quote: "On ne voit bien qu’avec le cœur. L’essentiel est invisible pour les yeux." },
        { name: "La Rose", quote: "Tu deviens responsable pour toujours de ce que tu as apprivoisé." },
        { name: "Le Pilote", quote: "Toutes les grandes personnes ont d’abord été des enfants. (Mais peu d’entre elles s’en souviennent.)" },
        { name: "Le Mouton", quote: "S’il te plaît… dessine-moi un mouton !" },
        { name: "Le Renard", quote: "On ne connaît que les choses que l’on apprivoise." },
        { name: "Le Serpent", quote: "Je puis t’aider à retourner chez toi..." }
    ];


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
    updateCharacterText();

    function updateCharacterText() {
        document.getElementById('character-name').textContent = characterTexts[currentTextureIndex].name;
        document.getElementById('character-quote').textContent = characterTexts[currentTextureIndex].quote;
    }


    window.addEventListener('click', () => {

        gsap.to("#character-info", { opacity: 0, duration: 0.3, onComplete: () => {
                updateCharacterText();
                gsap.to("#character-info", { opacity: 1, duration: 0.3 });
            }});
    });

    function createStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];

        for (let i = 0; i < 5000; i++) { // Nombre d’étoiles
            const x = (Math.random() - 0.5) * 500;
            const y = (Math.random() - 0.5) * 500;
            const z = (Math.random() - 0.5) * 500;
            starVertices.push(x, y, z);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });

        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        function animateStars() {
            stars.rotation.y += 0.0002;
            requestAnimationFrame(animateStars);
        }
        animateStars();
    }

    createStars();

    function createShootingStar() {
        const startX = (Math.random() - 0.5) * 200;
        const startY = Math.random() * 100 + 100;
        const startZ = -50;

        const endX = startX;
        const endY = startY - 50;
        const endZ = -50;

        const points = [new THREE.Vector3(startX, startY, startZ), new THREE.Vector3(endX, endY, endZ)];

        const material = new THREE.ShaderMaterial({
            vertexShader: `
            varying float vOpacity;
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                vOpacity = (position.y - ${startY}) / (${endY} - ${startY}); // Transparence de haut en bas
            }
        `,
            fragmentShader: `
            varying float vOpacity;
            void main() {
                gl_FragColor = vec4(1.0, 241.0/255.0, 161.0/255.0, vOpacity);  // Couleur #FFF1A1 avec dégradé d'opacité
            }
        `,
            transparent: true,
            opacity: 0.8,
        });

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const ShootingStar = new THREE.Line(geometry, material);
        scene.add(ShootingStar);

        gsap.to(ShootingStar.position, {
            duration: 3,
            y: -200,
            ease: "power1.out",
            onComplete: () => {
                ShootingStar.position.y = Math.random() * 100 + 100;
            }
        });
    }

    function startShootingStar() {
        setInterval(() => {
            for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
                setTimeout(() => createShootingStar(), Math.random() * 200);
            }
        }, 200);
    }

    startShootingStar();


    animate();

}