import React, {useRef} from "react";
import {useFrame} from "@react-three/fiber";
import gsap from "gsap";

export function Planet({ gltf, position, size, rotationSpeed, rotationDirection, onClick }) {
    const planetRef = useRef();

    useFrame(() => {
        if (planetRef.current) {
            planetRef.current.rotation.y += rotationSpeed * rotationDirection;
        }
    });

    const handleHover = (hover) => {
        gsap.to(planetRef.current.scale, {
            x: hover ? size * 1.1 : size,
            y: hover ? size * 1.1 : size,
            z: hover ? size * 1.1 : size,
            duration: 0.3,
            ease: 'power2.out',
        });
        document.body.style.cursor = hover ? 'pointer' : 'auto';
    };

    const handleClick = () => {
        gsap.to(planetRef.current.rotation, {
            y: planetRef.current.rotation.y + rotationDirection * (Math.PI * 3),
            duration: 2,
            ease: 'power2.out',
        });

        if (onClick) {
            onClick();
        }
    };

    return (
        <mesh
            ref={planetRef}
            position={position}
            onPointerOver={() => handleHover(true)}
            onPointerOut={() => handleHover(false)}
            onClick={handleClick}
            scale={[size, size, size]}
        >
            <primitive object={gltf.scene} />
        </mesh>
    );
}
