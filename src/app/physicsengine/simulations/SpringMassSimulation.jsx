'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

export default function SpringMassSimulation() {
  const [springConstant, setSpringConstant] = useState(0.1)
  const [mass, setMass] = useState(40)
  
  let position = 0
  let velocity = 0
  const equilibrium = 200

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(400, 400).parent(canvasParentRef)
  }

  const draw = (p5) => {
    p5.background(220)
    
    const force = -springConstant * (position - equilibrium)
    const acceleration = force / mass
    
    velocity += acceleration
    position += velocity
    
    p5.fill(45)
    p5.rect(180, position, 40, 40)
    
    p5.stroke(0)
    p5.line(200, 0, 200, position)
  }

  return (
    <div>
      <Sketch setup={setup} draw={draw} />
      <div className="mt-4 space-y-4">
        <div>
          <Label htmlFor="springConstant">Spring Constant: {springConstant.toFixed(2)}</Label>
          <Slider
            id="springConstant"
            min={0.01}
            max={0.2}
            step={0.01}
            value={[springConstant]}
            onValueChange={(value) => setSpringConstant(value[0])}
          />
        </div>
        <div>
          <Label htmlFor="mass">Mass: {mass}</Label>
          <Slider
            id="mass"
            min={10}
            max={100}
            step={1}
            value={[mass]}
            onValueChange={(value) => setMass(value[0])}
          />
        </div>
      </div>
    </div>
  )
}