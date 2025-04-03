import React, {useEffect} from "react";

export function Character({ gltf, position, scale, rotation, characterRef }) {
    useEffect(() => {
        if (characterRef.current) {
            characterRef.current.traverse((child) => {
                if (child.isMesh) {
                    child.material.transparent = true;
                    child.material.opacity = 1;
                }
            });
        }
    }, [gltf, characterRef]);

    return (
        <mesh ref={characterRef} position={position} scale={scale} rotation={rotation}>
            <primitive object={gltf.scene} />
        </mesh>
    );
}