import React, {forwardRef} from "react";
import {useGLTF} from "@react-three/drei";

export const Moon = forwardRef(({ onClick }, ref) => {
    const { scene } = useGLTF("/models/moon2.glb");

    const handleHover = (hover) => {
        document.body.style.cursor = hover ? 'pointer' : 'auto';
    };

    return (
        <primitive
            ref={ref}
            object={scene}
            position={[0, -4, -1]}
            onClick={onClick}
            scale={6}
            onPointerOver={() => handleHover(true)}
            onPointerOut={() => handleHover(false)}
        />
    );
});