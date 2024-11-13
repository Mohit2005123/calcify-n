'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

export default function PendulumSimulation() {
  const [length, setLength] = useState(200)
  const [gravity, setGravity] = useState(1)

  let angle = Math.PI / 4
  let angleVelocity = 0
  let angleAcceleration = 0

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(400, 400).parent(canvasParentRef)
  }

  const draw = (p5) => {
    p5.background(220)
    p5.translate(200, 0)

    const x = length * Math.sin(angle)
    const y = length * Math.cos(angle)

    angleAcceleration = (-1 * gravity / length) * Math.sin(angle)
    angleVelocity += angleAcceleration
    angle += angleVelocity

    p5.stroke(0)
    p5.line(0, 0, x, y)
    p5.fill(45)
    p5.ellipse(x, y, 30, 30)
  }

  return (
    <div>
      <Sketch setup={setup} draw={draw} />
      <div className="mt-4 space-y-4">
        <div>
          <Label htmlFor="length">Pendulum Length: {length}</Label>
          <Slider
            id="length"
            min={50}
            max={300}
            step={1}
            value={[length]}
            onValueChange={(value) => setLength(value[0])}
          />
        </div>
        <div>
          <Label htmlFor="gravity">Gravity: {gravity.toFixed(2)}</Label>
          <Slider
            id="gravity"
            min={0.1}
            max={2}
            step={0.1}
            value={[gravity]}
            onValueChange={(value) => setGravity(value[0])}
          />
        </div>
      </div>
    </div>
  )
}