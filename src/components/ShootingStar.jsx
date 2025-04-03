import React, {useRef} from "react";
import {useFrame} from "@react-three/fiber";
import {Trail} from "@react-three/drei";
import * as THREE from "three";

export function ShootingStar({ speed }) {
    const ref = useRef();
    const orbitCenter = [17, 4, -30];
    const orbitRadius = 6;
    const accumulatedTime = useRef(0);
    const lastTime = useRef(0);

    useFrame((state) => {
        const currentTime = state.clock.getElapsedTime();
        const delta = currentTime - lastTime.current;
        lastTime.current = currentTime;

        accumulatedTime.current += delta * speed;

        const x = orbitCenter[0] + Math.cos(accumulatedTime.current) * orbitRadius;
        const z = orbitCenter[2] + Math.sin(accumulatedTime.current) * orbitRadius;
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
