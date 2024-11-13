'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

export default function ElectricFieldSimulation() {
  const [charge1, setCharge1] = useState(100)
  const [charge2, setCharge2] = useState(-100)

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(400, 400).parent(canvasParentRef)
  }

  const draw = (p5) => {
    p5.background(220)

    // Draw charges
    p5.fill(255, 0, 0)
    p5.ellipse(100, 200, 20, 20)
    p5.fill(0, 0, 255)
    p5.ellipse(300, 200, 20, 20)

    // Draw electric field lines
    for (let y = 0; y < 400; y += 20) {
      for (let x = 0; x < 400; x += 20) {
        const ex1 = charge1 * (x - 100) / Math.pow(p5.dist(x, y, 100, 200), 3)
        const ey1 = charge1 * (y - 200) / Math.pow(p5.dist(x, y, 100, 200), 3)
        const ex2 = charge2 * (x - 300) / Math.pow(p5.dist(x, y, 300, 200), 3)
        const ey2 = charge2 * (y - 200) / Math.pow(p5.dist(x, y, 300, 200), 3)

        const ex = ex1 + ex2
        const ey = ey1 + ey2

        const magnitude = Math.sqrt(ex * ex + ey * ey)
        const normalizedEx = ex / magnitude
        const normalizedEy = ey / magnitude

        p5.stroke(0)
        p5.line(x, y, x + normalizedEx * 10, y + normalizedEy * 10)
      }
    }
  }

  return (
    <div>
      <Sketch setup={setup} draw={draw} />
      <div className="mt-4 space-y-4">
        <div>
          <Label htmlFor="charge1">Charge 1: {charge1}</Label>
          <Slider
            id="charge1"
            min={-200}
            max={200}
            step={10}
            value={[charge1]}
            onValueChange={(value) => setCharge1(value[0])}
          />
        </div>
        <div>
          <Label htmlFor="charge2">Charge 2: {charge2}</Label>
          <Slider
            id="charge2"
            min={-200}
            max={200}
            step={10}
            value={[charge2]}
            onValueChange={(value) => setCharge2(value[0])}
          />
        </div>
      </div>
    </div>
  )
}