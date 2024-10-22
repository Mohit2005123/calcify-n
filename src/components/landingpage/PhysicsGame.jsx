'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PhysicsGame = () => {
  const [balls, setBalls] = useState([]);
  const [angle, setAngle] = useState(45);
  const [power, setPower] = useState(50);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 500, y: 300 });
  const frameRef = useRef();
  const canvasRef = useRef();

  const GRAVITY = 0.5;
  const BALL_RADIUS = 10;
  const TARGET_SIZE = 40;
  
  const generateNewTargetPosition = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const margin = TARGET_SIZE * 2;
    return {
      x: Math.random() * (canvas.width - margin * 2) + margin,
      y: Math.random() * (canvas.height - margin * 2) + margin,
    };
  };
  
  useEffect(() => {
    if (gameStarted) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const updatePhysics = () => {
        setBalls(prevBalls => 
          prevBalls.map(ball => {
            // Apply physics
            const newVx = ball.vx;
            const newVy = ball.vy + GRAVITY;
            const newX = ball.x + newVx;
            const newY = ball.y + newVy;
            
            // Check if ball hit target
            const dx = newX - targetPosition.x;
            const dy = newY - targetPosition.y;
            if (Math.sqrt(dx * dx + dy * dy) < (BALL_RADIUS + TARGET_SIZE/2)) {
              setScore(prev => prev + 100);
              // Move target to new position after hit
              setTargetPosition(generateNewTargetPosition());
              return null;
            }
            
            // Check boundaries
            if (newY > canvas.height || newX > canvas.width || newX < 0) {
              return null;
            }
            
            return {
              ...ball,
              x: newX,
              y: newY,
              vx: newVx,
              vy: newVy
            };
          }).filter(ball => ball !== null)
        );
      };
      
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw target with pulsing effect
        const pulseSize = TARGET_SIZE + Math.sin(Date.now() / 200) * 5;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(targetPosition.x, targetPosition.y, pulseSize/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw concentric circles around target
        ctx.strokeStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(targetPosition.x, targetPosition.y, TARGET_SIZE, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw balls with trail effect
        balls.forEach(ball => {
          // Ball trail
          ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
          ctx.beginPath();
          ctx.arc(ball.x - ball.vx, ball.y - ball.vy, BALL_RADIUS * 1.2, 0, Math.PI * 2);
          ctx.fill();
          
          // Main ball
          ctx.fillStyle = '#3b82f6';
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
          ctx.fill();
        });
        
        // Draw launcher with power indicator
        ctx.strokeStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(50, canvas.height - 50);
        const launchAngle = angle * Math.PI / 180;
        const launchLength = 50 * (power / 100);
        ctx.lineTo(
          50 + Math.cos(launchAngle) * launchLength,
          canvas.height - 50 - Math.sin(launchAngle) * launchLength
        );
        ctx.stroke();
        
        frameRef.current = requestAnimationFrame(draw);
        updatePhysics();
      };
      
      frameRef.current = requestAnimationFrame(draw);
      
      return () => {
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current);
        }
      };
    }
  }, [gameStarted, balls, targetPosition, angle, power]);
  
  const launchBall = () => {
    const launchAngle = angle * Math.PI / 180;
    const velocity = power / 5;
    setBalls(prev => [...prev, {
      x: 50,
      y: canvasRef.current.height - 50,
      vx: Math.cos(launchAngle) * velocity,
      vy: -Math.sin(launchAngle) * velocity
    }]);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-white min-h-screen">
      <h1 className="text-4xl font-bold text-blue-800 mb-2">Gravity Gauntlet</h1>
      <p className="text-lg text-gray-600 mb-4">
        Master gravity, hit the target, and climb the scoreboard in this thrilling physics challenge!
      </p>
      
      <div className="flex gap-6">
        <Card className="p-4 bg-white shadow-lg rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              Score: {score}
            </Badge>
            {!gameStarted && (
              <Button 
                onClick={() => setGameStarted(true)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Start Game
              </Button>
            )}
          </div>
          
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="border-2 border-gray-300 bg-gray-50 rounded-lg shadow-inner"
          />
        </Card>
        
        <Card className="p-6 bg-white shadow-lg rounded-lg w-80">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Angle: {angle}°</label>
              <Slider
                value={[angle]}
                onValueChange={(value) => setAngle(value[0])}
                min={0}
                max={90}
                step={1}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Power: {power}%</label>
              <Slider
                value={[power]}
                onValueChange={(value) => setPower(value[0])}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            
            {gameStarted && (
              <Button 
                onClick={launchBall}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Launch Ball
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PhysicsGame;
