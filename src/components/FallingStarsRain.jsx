import React, {useMemo, useRef, useState} from "react";
import {useFrame} from "@react-three/fiber";
import {Trail} from "@react-three/drei";
import * as THREE from "three";

export function FallingStarsRain({ count = 20 }) {
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
            }, 50);


        }
    });

    return (
        <Trail
            ref={trailRef}
            width={size * 12}
            length={5}
            color={new THREE.Color(5, 5, 1)}
            attenuation={(t) => hide ? 0 : t * t}
        >
            <mesh ref={ref}>
                <sphereGeometry args={[size]} />
                <meshBasicMaterial
                    color={[8, 6, 3]}
                    toneMapped={false}
                    opacity={0.8}
                />
            </mesh>
        </Trail>
    );
}
