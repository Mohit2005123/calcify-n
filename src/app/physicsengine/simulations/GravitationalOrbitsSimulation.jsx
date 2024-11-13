'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

export default function GravitationalOrbitsSimulation() {
  const [centralMass, setCentralMass] = useState(1000)
  const [orbitingMass, setOrbitingMass] = useState(10)
  const [initialVelocity, setInitialVelocity] = useState(2)

  let x, y, vx, vy

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(400, 400).parent(canvasParentRef)
    resetSimulation(p5)
  }

  const resetSimulation = (p5) => {
    x = 200
    y = 100
    vx = initialVelocity
    vy = 0
  }

  const draw = (p5) => {
    p5.background(220)

    // Draw central mass
    p5.fill(255, 0, 0)
    p5.ellipse(200, 200, 20, 20)

    // Update position and velocity of orbiting mass
    const dx = 200 - x
    const dy = 200 - y
    const r = p5.sqrt(dx * dx + dy * dy)
    const f = (centralMass * orbitingMass) / (r * r)
    const ax = (f * dx) / r
    const ay = (f * dy) / r

    vx += ax * 0.1
    vy += ay * 0.1
    x += vx * 0.1
    y += vy * 0.1

    // Draw orbiting mass
    p5.fill(0, 0, 255)
    p5.ellipse(x, y, 10, 10)

    // Reset if out of bounds
    if (x < 0 || x > 400 || y < 0 || y > 400) {
      resetSimulation(p5)
    }
  }

  return (
    <div>
      <Sketch setup={setup} draw={draw} />
      <div className="mt-4 space-y-4">
        <div>
          <Label htmlFor="centralMass">Central Mass: {centralMass}</Label>
          <Slider
            id="centralMass"
            min={500}
            max={2000}
            step={10}
            value={[centralMass]}
            onValueChange={(value) => setCentralMass(value[0])}
          />
        </div>
        <div>
          <Label htmlFor="orbitingMass">Orbiting Mass: {orbitingMass}</Label>
          <Slider
            id="orbitingMass"
            min={1}
            max={50}
            step={1}
            value={[orbitingMass]}
            onValueChange={(value) => setOrbitingMass(value[0])}
          />
        </div>
        <div>
          <Label htmlFor="initialVelocity">Initial Velocity: {initialVelocity}</Label>
          <Slider
            id="initialVelocity"
            min={0.5}
            max={5}
            step={0.1}
            value={[initialVelocity]}
            onValueChange={(value) => setInitialVelocity(value[0])}
          />
        </div>
      </div>
    </div>
  )
}