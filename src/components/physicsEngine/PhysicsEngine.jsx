'use client'

import React, { useEffect, useRef } from 'react'
import { Engine, Render, World, Bodies, Mouse, MouseConstraint } from 'matter-js'

export default function PhysicsEngine() {
  const sceneRef = useRef(null)
  const engineRef = useRef(null)

  useEffect(() => {
    if (!sceneRef.current) return

    // Create an engine
    const engine = Engine.create()
    engineRef.current = engine

    // Create a renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: '#f0f0f0',
      },
    })

    // Create bodies
    const ground = Bodies.rectangle(400, 590, 800, 20, { isStatic: true })
    const boxA = Bodies.rectangle(400, 200, 80, 80)
    const boxB = Bodies.rectangle(450, 50, 80, 80)
    const circle = Bodies.circle(300, 50, 40)

    // Add bodies to the world
    World.add(engine.world, [ground, boxA, boxB, circle])

    // Add mouse control
    const mouse = Mouse.create(render.canvas)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    })

    World.add(engine.world, mouseConstraint)

    // Keep the mouse in sync with rendering
    render.mouse = mouse

    // Run the engine
    Engine.run(engine)

    // Run the renderer
    Render.run(render)

    // Cleanup function
    return () => {
      Render.stop(render)
      World.clear(engine.world, false)
      Engine.clear(engine)
      render.canvas.remove()
      render.canvas = null
      render.context = null
      render.textures = {}
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Physics Engine Demo</h1>
      <div ref={sceneRef} className="border border-gray-300 rounded-lg shadow-lg" />
      <p className="mt-4 text-gray-600">Click and drag to interact with the objects!</p>
    </div>
  )
}