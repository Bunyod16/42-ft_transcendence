// 'use client'

import { Canvas } from '@react-three/fiber'
import { KeyboardControls, Preload } from '@react-three/drei'
import { r3f } from '@/helpers/global'

export default function Scene({ ...props }) {
  // Everything defined in here will persist between route changes, only children are swapped
  return (
    <KeyboardControls
    map={[
      { name: "up", keys: ["ArrowUp", "KeyW"] },
      { name: "down", keys: ["ArrowDown", "KeyS"] },
    ]}
  >
      <Canvas {...props}>
        <r3f.Out />
        <Preload all />
      </Canvas>
    </KeyboardControls>
  )
}
