'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PendulumSimulation from './simulations/PendulumSimulation'
import ProjectileMotionSimulation from './simulations/ProjectileMotionSimulation'
import SpringMassSimulation from './simulations/SpringMassSimulation'
import WaveInterferenceSimulation from './simulations/WaveInterferenceSimulation'
import GravitationalOrbitsSimulation from './simulations/GravitationalOrbitsSimulation'
import ElectricFieldSimulation from './simulations/ElectricFieldSimulation'

const simulations = [
  { name: 'Pendulum', component: PendulumSimulation },
  { name: 'Projectile Motion', component: ProjectileMotionSimulation },
  { name: 'Spring-Mass System', component: SpringMassSimulation },
  { name: 'Wave Interference', component: WaveInterferenceSimulation },
  { name: 'Gravitational Orbits', component: GravitationalOrbitsSimulation },
  { name: 'Electric Field', component: ElectricFieldSimulation },
]

export default function PhysicsSimulations() {
  const [currentSimulation, setCurrentSimulation] = useState(0)
  const CurrentSimulationComponent = simulations[currentSimulation].component
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Physics Simulations</h1>
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {simulations.map((sim, index) => (
          <Button
            key={sim.name}
            onClick={() => setCurrentSimulation(index)}
            variant={currentSimulation === index ? 'default' : 'outline'}
          >
            {sim.name}
          </Button>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{simulations[currentSimulation].name}</CardTitle>
        </CardHeader>
        <CardContent>
          <CurrentSimulationComponent />
        </CardContent>
      </Card>
    </div>
  )
}