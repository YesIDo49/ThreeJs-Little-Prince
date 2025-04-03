import React, {useMemo, useRef} from "react";
import * as THREE from "three";
import {useFrame} from "@react-three/fiber";

export function StarsShader({ count = 2000, speed = 0.01 }) {
    const starsRef = useRef();
    const pointsRef = useRef();

    const [positions, pulseOffsets] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const offsets = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            // Random spherical distribution
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 100;
            pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = radius * Math.cos(phi);
            offsets[i] = Math.random() * 10;
        }
        return [pos, offsets];
    }, [count]);

    const shader = useMemo(() => ({
        uniforms: {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color('#FCF6BD') },
            uPulseSpeed: { value: 1.5 },
            uSize: { value: 5.0 },
        },
        vertexShader: `
            attribute float pulseOffset;
            uniform float uTime;
            uniform float uPulseSpeed;
            uniform float uSize;
            varying float vBrightness;

            void main() {
                // Pulsation effect based on time and offset
                vBrightness = 0.5 + 0.5 * sin(uTime * uPulseSpeed + pulseOffset);
                gl_PointSize = uSize * vBrightness; // Size varies with brightness
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 uColor;
            varying float vBrightness;

            void main() {
                // Circular star shape
                vec2 coord = gl_PointCoord - vec2(0.5);
                float dist = length(coord);
                if (dist > 0.5) discard; // Discard outside circle

                // Apply brightness to color
                gl_FragColor = vec4(uColor * vBrightness, 1.0);
            }
        `,
    }), []);

    useFrame(({ clock }) => {
        if (starsRef.current) {
            starsRef.current.rotation.y = clock.getElapsedTime() * speed; // Spin like RotatingStars
        }
        if (pointsRef.current && pointsRef.current.material) {
            pointsRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
        }
    });

    return (
        <group ref={starsRef}>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        array={positions}
                        itemSize={3}
                        count={count}
                    />
                    <bufferAttribute
                        attach="attributes-pulseOffset"
                        array={pulseOffsets}
                        itemSize={1}
                        count={count}
                    />
                </bufferGeometry>
                <shaderMaterial
                    uniforms={shader.uniforms}
                    vertexShader={shader.vertexShader}
                    fragmentShader={shader.fragmentShader}
                    transparent={true}
                />
            </points>
        </group>
    );
}
