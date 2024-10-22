'use client'
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowRight, Calculator, Share2, Atom, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const styles = {
  fadeInUp: {
    animation: 'fadeInUp 0.8s ease-out forwards',
  },
  buttonHover: {
    transition: 'transform 0.2s, background-color 0.2s',
  }
};

function generateGraphData(complexity) {
  return Array.from({ length: 10 }, (_, index) => ({
    x: index,
    y: Math.sin(index * complexity) * 50 + 50,
  }));
}

export default function Hero() {
  const [graphData, setGraphData] = useState(generateGraphData(0.5));
  const [activeFeature, setActiveFeature] = useState(null);
  const [complexity, setComplexity] = useState(0.5);
  const [isHovered, setIsHovered] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [lineType, setLineType] = useState('monotone');
  const [animationSpeed, setAnimationSpeed] = useState(3000);

  useEffect(() => {
    const interval = setInterval(() => {
      setGraphData(generateGraphData(complexity));
    }, 3000);
    return () => clearInterval(interval);
  }, [complexity]);

  const handleComplexityChange = (newComplexity) => {
    setComplexity(newComplexity);
    setGraphData(generateGraphData(newComplexity));
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-hidden">
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 
              className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500 leading-tight cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.3s ease'
              }}
            >
              Discover the Universe of Knowledge
            </h1>

            <div className="mb-8 space-y-4">
              <Card className="p-4 bg-indigo-50 hover:bg-indigo-100 transition-all duration-300">
                <div className="text-center">
                  <p className="text-lg italic text-gray-700">
                    "Experience a platform that combines cutting-edge visual tools for learning. Explore the Graph Calculator, Physics Engine, and Algorithm Visualizer."
                  </p>
                  <p className="text-sm text-indigo-600 mt-2">
                    Unleash your potential with interactive learning
                  </p>
                </div>
              </Card>
            </div>

            <div className="flex gap-4 mb-8">
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white transform hover:scale-105 transition-all shadow-lg group"
                style={styles.buttonHover}
              >
                Start Your Journey 
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                className="text-indigo-600 border border-indigo-600 hover:bg-indigo-50 transform hover:scale-105 transition-all shadow-lg"
                style={styles.buttonHover}
              >
                Watch Demo
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Calculator, title: "Graph Calculator", href: "/graph-calculator" },
                { icon: Share2, title: "Algorithm Visualizer", href: "/algorithm-visualizer" },
                { icon: Atom, title: "Physics Engine" }
              ].map(({ icon: Icon, title, href }) => (
                <FeatureCard 
                  key={title}
                  icon={Icon} 
                  title={title} 
                  href={href}
                  setActiveFeature={setActiveFeature}
                  isActive={activeFeature === title}
                />
              ))}
            </div>
          </div>

          <div className="bg-indigo-50 rounded-xl p-6 shadow-xl">
            <Tabs defaultValue="graph" className="mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="graph">Graph</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="graph">
                <div className="mb-4 flex justify-center gap-4">
                  <Button 
                    onClick={() => handleComplexityChange(0.5)}
                    variant={complexity === 0.5 ? "default" : "outline"}
                  >
                    Simple
                  </Button>
                  <Button 
                    onClick={() => handleComplexityChange(1)}
                    variant={complexity === 1 ? "default" : "outline"}
                  >
                    Medium
                  </Button>
                  <Button 
                    onClick={() => handleComplexityChange(1.5)}
                    variant={complexity === 1.5 ? "default" : "outline"}
                  >
                    Complex
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={graphData}>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
                    <XAxis dataKey="x" stroke="#4B5563" />
                    <YAxis stroke="#4B5563" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB' }}
                      cursor={{ stroke: '#6366F1', strokeWidth: 2 }}
                    />
                    <Line 
                      type={lineType}
                      dataKey="y" 
                      stroke="#6366F1" 
                      strokeWidth={2} 
                      dot={{ r: 4, stroke: '#6366F1', strokeWidth: 2, fill: '#F3F4F6' }}
                      activeDot={{ r: 8, fill: '#4F46E5' }}
                      animationDuration={300}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="settings">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-grid">Show Grid</Label>
                    <Switch
                      id="show-grid"
                      checked={showGrid}
                      onCheckedChange={setShowGrid}
                    />
                  </div>
                  <div>
                    <Label>Line Type</Label>
                    <div className="flex gap-2 mt-2">
                      {['monotone', 'linear', 'step'].map((type) => (
                        <Button
                          key={type}
                          variant={lineType === type ? 'default' : 'outline'}
                          onClick={() => setLineType(type)}
                          className="capitalize"
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Animation Speed</Label>
                    <Slider
                      min={1000}
                      max={5000}
                      step={500}
                      value={[animationSpeed]}
                      onValueChange={(value) => setAnimationSpeed(value[0])}
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {animationSpeed / 1000}s
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      {activeFeature === "Physics Engine" && (
        <FeatureModal feature={activeFeature} onClose={() => setActiveFeature(null)} />
      )}
    </div>
  );
}

function FeatureCard({ icon: Icon, title, href, setActiveFeature, isActive }) {
  const content = (
    <>
      <Icon className={`w-8 h-8 ${isActive ? 'text-indigo-600' : 'text-indigo-500'} mb-2`} />
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </>
  );

  if (href) {
    return (
      <Link href={href} passHref>
        <div
          className={`bg-indigo-50 p-4 rounded-lg cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${
            isActive ? 'ring-2 ring-indigo-500' : ''
          }`}
        >
          {content}
        </div>
      </Link>
    );
  }

  return (
    <div
      className={`bg-indigo-50 p-4 rounded-lg cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${
        isActive ? 'ring-2 ring-indigo-500' : ''
      }`}
      onClick={() => setActiveFeature(title)}
    >
      {content}
    </div>
  );
}

function FeatureModal({ feature, onClose }) {
  const featureContent = {
    "Graph Calculator": {
      description: "Our graphing calculator is a powerful tool for visualizing mathematical functions and data.",
      features: [
        "2D and 3D graphing capabilities",
        "Interactive function analysis",
        "Support for parametric equations",
        "Statistical analysis"
      ]
    },
    "Algorithm Visualizer": {
      description: "Step into the world of algorithms with our visualizer.",
      features: [
        "Visualize binary trees",
        "Explore sorting algorithms",
        "Understand graph algorithms",
        "Step-by-step execution"
      ]
    },
    "Physics Engine": {
      description: "Experience the laws of physics in action.",
      features: [
        "Particle physics simulation",
        "Electromagnetic fields",
        "Quantum mechanics",
        "Interactive experiments"
      ]
    }
  };

  const content = featureContent[feature];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg max-w-2xl w-full transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold mb-4 text-indigo-600">{feature}</h2>
        <p className="text-gray-700 mb-6">{content.description}</p>
        <ul className="space-y-2 mb-6">
          {content.features.map((item, index) => (
            <li key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose} className="text-indigo-600 border-indigo-600 hover:bg-indigo-50">
            Close
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
