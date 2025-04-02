import * as THREE from 'three'
import React, {useEffect, useRef, useState} from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Trail, OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { TextureLoader } from "three";
import { forwardRef } from "react";
import gsap from "gsap";
import { useMemo } from "react";


const characterTextures = [
    "/character1.png",
    "/character2.png",
    "/character3.png",
    "/character4.png",
    "/character5.png",
    "/character6.png",
];

const characterTexts = [
    { name: "Le Petit Prince", quote: "On ne voit bien qu’avec le cœur." },
    { name: "La Rose", quote: "Tu deviens responsable pour toujours..." },
    { name: "Le Pilote", quote: "Toutes les grandes personnes ont été enfants." },
    { name: "Le Mouton", quote: "S’il te plaît… dessine-moi un mouton !" },
    { name: "Le Renard", quote: "On ne connaît que les choses que l’on apprivoise." },
    { name: "Le Serpent", quote: "Je puis t’aider à retourner chez toi..." },
];

const Moon = forwardRef(({ onClick }, ref) => {
    const [colorMap, displacementMap, normalMap] = useLoader(TextureLoader, [
        "/moon_001_COLOR.jpg",
        "/moon_001_DISP.png",
        "/moon_001_NORM.jpg",
    ]);

    return (
        <mesh ref={ref} position={[0, -4, 0]} onClick={onClick}>
            <sphereGeometry args={[3, 64, 64]} />
            <meshStandardMaterial
                map={colorMap}
                displacementMap={displacementMap}
                displacementScale={0.1}
                normalMap={normalMap}
            />
        </mesh>
    );
});


function Character({ texture, position }) {
    const spriteMap = useMemo(() => new THREE.TextureLoader().load(texture), [texture]);

    return (
        <sprite position={position} scale={[1.2, 1.2, 1.2]}>
            <spriteMaterial attach="material" map={spriteMap} toneMapped={false} />
        </sprite>
    );
}

function ShootingStar() {
    const ref = useRef();
    const orbitCenter = [17, 4, -30];
    const orbitRadius = 6;

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const x = orbitCenter[0] + Math.cos(t) * orbitRadius;
        const z = orbitCenter[2] + Math.sin(t) * orbitRadius;
        const y = orbitCenter[1];

        ref.current.position.set(x, y, z);
    });

    return (
        <Trail width={5} length={8} color={new THREE.Color(2, 1, 10)} attenuation={(t) => t * t}>
            <mesh ref={ref}>
                <sphereGeometry args={[0.25]} />
                <meshBasicMaterial color={[10, 1, 10]} toneMapped={false} />
            </mesh>
        </Trail>
    );
}

// function FallingStar() {
//     const ref = useRef();
//     const [position, setPosition] = useState({ x: 0, y: 0 });
//     const [speed, setSpeed] = useState({ x: 0, y: 0 });
//     const [visible, setVisible] = useState(false);
//
//     const resetStar = () => {
//         setPosition({ x: Math.random() * 20 - 50, y: 40 });
//         setSpeed({ x: Math.random() * 10 + 15, y: Math.random() * 10 + 15 });
//         setVisible(true);
//     };
//
//     useEffect(() => {
//         setTimeout(resetStar, Math.random() * 3000);
//     }, []);
//
//     useFrame(({ clock }) => {
//         if (!ref.current || !visible) return;
//
//         const t = clock.getElapsedTime() % 5;
//         const x = position.x + speed.x * t;
//         const y = position.y - speed.y * t;
//
//         ref.current.position.set(x, y, -30);
//
//         if (y < -40) {
//             setTimeout(resetStar, Math.random() * 3000 + 1000);
//         }
//     });
//
//     return visible ? (
//         <Trail width={3} length={5} color={new THREE.Color(1, 1, 10)} attenuation={(t) => t * t}>
//             <mesh ref={ref} position={[position.x, position.y, -30]}>
//                 <sphereGeometry args={[0.2]} />
//                 <meshBasicMaterial color={[10, 1, 10]} toneMapped={false} />
//             </mesh>
//         </Trail>
//     ) : null;
// }
//
// function FallingStars({ count = 5 }) {
//     return (
//         <>
//             {Array.from({ length: count }).map((_, i) => (
//                 <FallingStar key={i} />
//             ))}
//         </>
//     );
// }


function FallingStarsRain({ count = 20 }) {
    const stars = useMemo(() => {
        return Array.from({ length: count }, () => {
            const angleVariation = (Math.random() - 0.5) * 0.5;
            return {
                position: [
                    -100 + Math.random() * 10,
                    50 + Math.random() * 20,
                    -30 - Math.random() * 20
                ],
                speed: 3.5 + Math.random() * 4,
                size: 0.2 + Math.random() * 0.3,
                angle: Math.PI/4 + angleVariation
            };
        });
    }, [count]);

    return (
        <>
            {stars.map((star, index) => (
                <FallingStars
                    key={index}
                    initialPosition={star.position}
                    speed={star.speed}
                    size={star.size}
                    angle={star.angle}
                />
            ))}
        </>
    );
}

function FallingStars({ initialPosition, speed = 1, size = 0.2, angle = Math.PI/2 }) {
    const ref = useRef();
    const trailRef = useRef();
    const startTime = useRef(0);
    const [hide, setHide] = useState(false);

    useFrame((state) => {
        if (startTime.current === 0) {
            startTime.current = state.clock.getElapsedTime();
        }

        const elapsed = state.clock.getElapsedTime() - startTime.current;

        const x = initialPosition[0] + elapsed * speed * Math.cos(angle) * 2;
        const y = initialPosition[1] - elapsed * speed * (Math.sin(angle) * 1.5);
        const z = initialPosition[2];

        ref.current.position.set(x, y, z);

        if (y < 40 && hide) {
            setHide(false);
        }

        if (x > 100 || y < -50) {
            setHide(true);

            setTimeout(() => {
                startTime.current = state.clock.getElapsedTime();
                ref.current.position.set(
                    initialPosition[0] - 5 + Math.random() * 10,
                    initialPosition[1] + Math.random() * 10,
                    initialPosition[2]
                );
                // setTimeout(() => {
                //     setHide(false);
                // }, 1750);
            }, 50);


        }
    });

    return (
        <Trail
            ref={trailRef}
            width={size * 12}
            length={5}
            color={new THREE.Color(2, 1, 10)}
            attenuation={(t) => hide ? 0 : t * t}
        >
            <mesh ref={ref}>
                <sphereGeometry args={[size]} />
                <meshBasicMaterial
                    color={[10, 1, 10]}
                    toneMapped={false}
                    opacity={0.8}
                />
            </mesh>
        </Trail>
    );
}

function Planet({ texture, position, size, rotationSpeed, rotationDirection }) {
    const planetTexture = useLoader(TextureLoader, texture);
    const planetRef = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame(() => {
        if (planetRef.current) {
            planetRef.current.rotation.y += rotationSpeed * rotationDirection;
        }
    });

    const handleHover = (hover) => {
        gsap.to(planetRef.current.scale, {
            x: hover ? 1.1 : 1,
            y: hover ? 1.1 : 1,
            z: hover ? 1.1 : 1,
            duration: 0.3,
            ease: "power2.out",
        });
    };

    return (
        <mesh ref={planetRef}
              position={position}
              onPointerOver={() => handleHover(true)}
              onPointerOut={() => handleHover(false)}
        >
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial map={planetTexture} />
        </mesh>
    );
}


function RotatingStars({ count, speed }) {
    const starsRef = useRef();

    useFrame(({ clock }) => {
        if (starsRef.current) {
            const t = clock.getElapsedTime() * speed;
            starsRef.current.rotation.y = t;
        }
    });

    return (
        <group ref={starsRef}>
            <Stars saturation={false} count={count} speed={0.5} />
        </group>
    );
}

export default function App() {
    const [textureIndex, setTextureIndex] = useState(0);
    const moonRef = useRef();

    const handleMoonClick = () => {
        gsap.to(moonRef.current.rotation, {
            z: "+=0.785", // 45° en radians
            duration: 1,
            ease: "power2.inOut",
        });

        setTextureIndex((prev) => (prev + 1) % characterTextures.length);
    };
  return (
      <div className="container">
          <div className="character-info">
              <h2>{characterTexts[textureIndex].name}</h2>
              <p>{characterTexts[textureIndex].quote}</p>
          </div>
          <Canvas camera={{ position: [0, 0, 5] }}>
            <color attach="background" args={['black']} />
            <ambientLight intensity={1} />
            <ShootingStar />
              <FallingStarsRain count={10} />
              <RotatingStars count={2000} speed={0.01} />
            <OrbitControls />
            <EffectComposer>
              <Bloom mipmapBlur luminanceThreshold={1} />
            </EffectComposer>
              <Moon ref={moonRef} onClick={handleMoonClick} />
              <Character texture={characterTextures[textureIndex]} position={[0, -0.5, 1]} />
              <Planet
                  texture="/moon_001_COLOR.jpg"
                  position={[-11, 7, -20]}
                  size={6}
                  rotationSpeed={0.001}
                  rotationDirection={-1}
              />

              <Planet
                  texture="/moon_001_COLOR.jpg"
                  position={[17, 4, -30]}
                  size={4}
                  rotationSpeed={0.01}
                  rotationDirection={1}
              />
          </Canvas>
      </div>
  )
}
