'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

export default function WaveInterferenceSimulation() {
  const [wavelength1, setWavelength1] = useState(50)
  const [wavelength2, setWavelength2] = useState(50)
  const [amplitude1, setAmplitude1] = useState(50)
  const [amplitude2, setAmplitude2] = useState(50)

  let time = 0

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(400, 400).parent(canvasParentRef)
  }

  const draw = (p5) => {
    p5.background(220)
    p5.translate(0, p5.height / 2)

    p5.stroke(255, 0, 0)
    drawWave(p5, wavelength1, amplitude1, time)

    p5.stroke(0, 0, 255)
    drawWave(p5, wavelength2, amplitude2, time)

    p5.stroke(0)
    drawSuperposition(p5, wavelength1, wavelength2, amplitude1, amplitude2, time)

    time += 0.05
  }

  const drawWave = (p5, wavelength, amplitude, time) => {
    p5.beginShape()
    for (let x = 0; x < p5.width; x++) {
      const y = amplitude * p5.sin((2 * Math.PI * x) / wavelength + time)
      p5.vertex(x, y)
    }
    p5.endShape()
  }

  const drawSuperposition = (p5, wavelength1, wavelength2, amplitude1, amplitude2, time) => {
    p5.beginShape()
    for (let x = 0; x < p5.width; x++) {
      const y1 = amplitude1 * p5.sin((2 * Math.PI * x) / wavelength1 + time)
      const y2 = amplitude2 * p5.sin((2 * Math.PI * x) / wavelength2 + time)
      p5.vertex(x, y1 + y2)
    }
    p5.endShape()
  }

  return (
    <div>
      <Sketch setup={setup} draw={draw} />
      <div className="mt-4 space-y-4">
        <div>
          <Label htmlFor="wavelength1">Wavelength 1: {wavelength1}</Label>
          <Slider
            id="wavelength1"
            min={20}
            max={100}
            step={1}
            value={[wavelength1]}
            onValueChange={(value) => setWavelength1(value[0])}
          />
        </div>
        <div>
          <Label htmlFor="wavelength2">Wavelength 2: {wavelength2}</Label>
          <Slider
            id="wavelength2"
            min={20}
            max={100}
            step={1}
            value={[wavelength2]}
            onValueChange={(value) => setWavelength2(value[0])}
          />
        </div>
        <div>
          <Label htmlFor="amplitude1">Amplitude 1: {amplitude1}</Label>
          <Slider
            id="amplitude1"
            min={10}
            max={100}
            step={1}
            value={[amplitude1]}
            onValueChange={(value) => setAmplitude1(value[0])}
          />
        </div>
        <div>
          <Label htmlFor="amplitude2">Amplitude 2: {amplitude2}</Label>
          <Slider
            id="amplitude2"
            min={10}
            max={100}
            step={1}
            value={[amplitude2]}
            onValueChange={(value) => setAmplitude2(value[0])}
          />
        </div>
      </div>
    </div>
  )
}