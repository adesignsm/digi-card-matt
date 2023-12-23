import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise } from '@react-three/postprocessing'
import { Box, OrbitControls, RoundedBox } from "@react-three/drei";
import { TextureLoader, DoubleSide } from "three";
import * as THREE from 'three';

import './root.css';

import FRONT from './Assets/front.png';
import BACK from './Assets/back.png';
import AUDIO from './Assets/audio.mp3';

const App = () => {
    const [showScene, setShowScene] = useState(false);
    const [showEnter, setShowEnter] = useState(true);

    const controlsRef = useRef();
    const audioRef = useRef(new Audio(AUDIO));

    const Card = () => {
        const cardRef = useRef();
        const [isRotating, setIsRotating] = useState(true);

        useFrame(() => {
            if (cardRef.current && isRotating) {
                cardRef.current.rotation.y += 0.02;
                if (cardRef.current.position.z < -0.1) {
                    cardRef.current.position.z += 0.06;
                } else {
                    cardRef.current.position.z = 0;
                }
            }
        });

        const handleClick = () => {
            setIsRotating(!isRotating);
        }

        return (
            <>
                <group ref={cardRef} position={[0, 0, -10]} onClick={handleClick}>
                    <mesh position={[0, 0, 0.02]}>
                        <planeGeometry args={[0.6, 0.9]} />
                        <meshBasicMaterial side={THREE.FrontSide} map={new THREE.TextureLoader().load(FRONT)} color={"#fff"} transparent={true} opacity={1}/>
                    </mesh>
                    <mesh>
                        <RoundedBox args={[0.58, 0.88, 0.00000001]} radius={0.015} smoothness={4}>
                            <meshBasicMaterial color={"#051E72"} />
                        </RoundedBox>
                    </mesh>
                    <mesh scale={[1, 1, 1]} position={[0, 0, -0.011]}>
                        <planeGeometry args={[0.6, 0.9]}/>
                        <meshBasicMaterial side={THREE.BackSide} map={new THREE.TextureLoader().load(BACK)} color={"#fff"} transparent={true} opacity={1} />
                    </mesh>
                </group>
            </>
        )
    }

    const handleEnterClick = () => {
        setShowScene(true);
        setShowEnter(false);

        audioRef.current.play();
    }

    return (
        <>
            {showScene && (
                <div id="canvas-container">
                    <Canvas frameloop="always" camera={{ fov: 75, near: 0.1, far: 10000, position: [0, 0, 1] }}>
                        {/* <PointerLockControls selector="#stage-one-canvas" /> */}
                        <ambientLight intensity={1} />
                        <Card />
                        <EffectComposer>
                            <Bloom luminanceThreshold={1} luminanceSmoothing={0.1} height={window.innerHeight} />
                            <Noise opacity={0.2} />
                        </EffectComposer>
                        <OrbitControls ref={controlsRef} enableZoom={true} />
                    </Canvas>
                </div>
            )}

            {showEnter && (
                <div id="enter-scene">
                    <button onClick={() => handleEnterClick()}>
                        Press to enter this next card I made for you my guy
                    </button>
                </div>
            )}
        </>
    )
}

export default App;