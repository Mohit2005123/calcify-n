'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

export default function ProjectileMotionSimulation() {
  const [angle, setAngle] = useState(45)
  const [velocity, setVelocity] = useState(40)
  const [projectileX, setProjectileX] = useState(0)
  const [projectileY, setProjectileY] = useState(0)
  const [time, setTime] = useState(0)
  const [isLaunched, setIsLaunched] = useState(false)

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(400, 400).parent(canvasParentRef)
  }

  const draw = (p5) => {
    p5.background(220)
    p5.translate(0, p5.height)

    if (isLaunched) {
      const radians = p5.radians(angle)
      const x = velocity * p5.cos(radians) * time
      const y = -1 * (velocity * p5.sin(radians) * time - 0.5 * 9.8 * time * time)

      setProjectileX(x)
      setProjectileY(y)

      p5.fill(45)
      p5.ellipse(x, y, 20, 20)

      setTime(time + 0.1)

      if (y > 0) {
        setIsLaunched(false)
        setTime(0)
      }
    }

    p5.stroke(0)
    p5.line(0, 0, 400, 0)
  }

  const handleLaunch = () => {
    setIsLaunched(true)
    setTime(0)
  }

  return (
    <div>
      <Sketch setup={setup} draw={draw} />
      <div className="mt-4 space-y-4">
        <div>
          <Label htmlFor="angle">Launch Angle: {angle}°</Label>
          <Slider
            id="angle"
            min={0}
            max={90}
            step={1}
            value={[angle]}
            onValueChange={(value) => setAngle(value[0])}
          />
        </div>
        <div>
          <Label htmlFor="velocity">Initial Velocity: {velocity} m/s</Label>
          <Slider
            id="velocity"
            min={10}
            max={100}
            step={1}
            value={[velocity]}
            onValueChange={(value) => setVelocity(value[0])}
          />
        </div>
        <Button onClick={handleLaunch}>Launch Projectile</Button>
        <div>
          <p>Projectile X: {projectileX.toFixed(2)} m</p>
          <p>Projectile Y: {projectileY.toFixed(2)} m</p>
        </div>
      </div>
    </div>
  )
}