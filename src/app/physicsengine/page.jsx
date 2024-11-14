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
import Navbar from '@/components/landingpage/Navbar'
import { Menu } from "lucide-react"
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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const CurrentSimulationComponent = simulations[currentSimulation].component
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      <div className="container relative mx-auto px-4 py-8 pt-20">
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-20 z-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div className={`
          fixed left-0 top-0 h-full w-64 bg-background/95 shadow-xl
          transform transition-transform duration-300 ease-in-out pt-32
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col gap-3 p-4">
            {simulations.map((sim, index) => (
              <Button
                key={sim.name}
                onClick={() => {
                  setCurrentSimulation(index)
                  setSidebarOpen(false)
                }}
                variant={currentSimulation === index ? 'default' : 'outline'}
                className={`
                  w-full transition-all duration-200 hover:scale-105
                  ${currentSimulation === index ? 'shadow-lg' : 'hover:border-primary/50'}
                `}
              >
                {sim.name}
              </Button>
            ))}
          </div>
        </div>

        <div className={`
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}>
          <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Interactive Physics Simulations
          </h1>

          <Card className="border-2 shadow-xl backdrop-blur-sm bg-card/50">
            <CardHeader className="border-b">
              <CardTitle className="text-2xl font-semibold text-center">
                {simulations[currentSimulation].name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="aspect-video w-full">
                <CurrentSimulationComponent />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}