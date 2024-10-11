"use client"
import React, { useState, useRef } from 'react';

const GraphVisualization = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isAddingLine, setIsAddingLine] = useState(false);
  const [isWeighted, setIsWeighted] = useState(false);
  const [isBidirectional, setIsBidirectional] = useState(false);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [nodeName, setNodeName] = useState('');
  const [draggedNode, setDraggedNode] = useState(null);
  const [tempLine, setTempLine] = useState(null);
  const [isChoosingStart, setIsChoosingStart] = useState(false);
  const [isChoosingEnd, setIsChoosingEnd] = useState(false);
  const [awaitingWeight, setAwaitingWeight] = useState(false);
  const [pendingEdge, setPendingEdge] = useState(null);
  const svgRef = useRef(null);

  const addNode = () => {
    if (nodeName.trim() !== '') {
      const svgRect = svgRef.current.getBoundingClientRect();
      const x = nodes.length * 150 % (svgRect.width - 150) + 75;
      const y = Math.floor(nodes.length / Math.floor((svgRect.width - 150) / 150)) * 150 + 75;
      setNodes([...nodes, { id: Date.now(), name: nodeName, x, y }]);
      setNodeName('');
    }
  };

  const addEdge = (start, end, weight = null) => {
    if (start && end && start !== end) {
      const timestamp = Date.now();
  
      // If the graph is weighted and no weight is provided, assign a default weight of 1
      if (isWeighted && weight === null) {
        weight = 1;
      }
  
      if (!isBidirectional) {
        setEdges((prev) => [
          ...prev,
          { id: timestamp, start, end, weight, isForward: true },
          { id: timestamp + 1, start: end, end: start, weight, isForward: false }
        ]);
      } else {
        setEdges((prev) => [
          ...prev,
          { id: timestamp, start, end, weight, isDirected: true }
        ]);
      }
    }
  };
  

  const handleNodeClick = (node) => {
    if (isAddingLine) {
      if (!tempLine) {
        setTempLine({ start: node, end: node });
      } else {
        if (isWeighted) {
          setPendingEdge({ start: tempLine.start, end: node });
          setAwaitingWeight(true);
        } else {
          addEdge(tempLine.start, node);
        }
        setTempLine(null);
        setIsAddingLine(false);
      }
    } else if (isChoosingStart) {
      setStartNode(node);
      setIsChoosingStart(false);
    } else if (isChoosingEnd) {
      setEndNode(node);
      setIsChoosingEnd(false);
    }
  };

  const handleWeightSubmit = (event) => {
    event.preventDefault();
    const weight = parseInt(event.target.weight.value);
    if (!isNaN(weight) && pendingEdge) {
      addEdge(pendingEdge.start, pendingEdge.end, weight);
      setPendingEdge(null);
      setAwaitingWeight(false);
      event.target.reset();
    }
  };

  const handleMouseDown = (e, node) => {
    setDraggedNode(node);
  };

  const handleMouseMove = (e) => {
    if (draggedNode) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - svgRect.left;
      const y = e.clientY - svgRect.top;
      setNodes(nodes.map(n => n.id === draggedNode.id ? { ...n, x, y } : n));
    }
    if (tempLine) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - svgRect.left;
      const y = e.clientY - svgRect.top;
      setTempLine(prev => ({ ...prev, end: { x, y } }));
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setStartNode(null);
    setEndNode(null);
    setTempLine(null);
    setAwaitingWeight(false);
    setPendingEdge(null);
  };

  const calculateArrowPosition = (start, end, nodeRadius = 30) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);
    const length = Math.sqrt(dx * dx + dy * dy);
    
    const arrowX = end.x - (dx * (nodeRadius + 5) / length);
    const arrowY = end.y - (dy * (nodeRadius + 5) / length);
    
    return { x: arrowX, y: arrowY, angle: angle * 180 / Math.PI };
  };

  const renderArrow = (start, end, isForward) => {
    const arrowLength = 15;
    const arrowWidth = 7;
    const { x, y, angle } = calculateArrowPosition(start, end);

    return (
      <polygon
        points={`0,-${arrowWidth} ${arrowLength},0 0,${arrowWidth}`}
        fill="black"
        transform={`translate(${x},${y}) rotate(${angle})`}
      />
    );
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex justify-between p-4 bg-gray-100">
        <div className="flex items-center">
          <input
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            placeholder="Enter node name"
            className="mr-2 px-2 py-1 border rounded"
          />
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={addNode}
          >
            Add Node
          </button>
        </div>
        <button
          className={`px-4 py-2 ${isAddingLine ? 'bg-red-500' : 'bg-blue-500'} text-white rounded`}
          onClick={() => {
            setIsAddingLine(!isAddingLine);
            setTempLine(null);
          }}
        >
          {isAddingLine ? 'Cancel Add Line' : 'Add Line'}
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={clearGraph}
        >
          Clear Graph
        </button>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="weighted"
            checked={isWeighted}
            onChange={() => setIsWeighted(!isWeighted)}
            className="mr-2"
          />
          <label htmlFor="weighted">Weighted</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="bidirectional"
            checked={isBidirectional}
            onChange={() => setIsBidirectional(!isBidirectional)}
            className="mr-2"
          />
          <label htmlFor="bidirectional">Bidirectional</label>
        </div>
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded"
          onClick={() => {
            setIsChoosingStart(true);
            setIsChoosingEnd(false);
          }}
        >
          Choose Start
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => {
            setIsChoosingEnd(true);
            setIsChoosingStart(false);
          }}
        >
          Choose End
        </button>
      </div>
      
      {awaitingWeight && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-lg z-10">
          <form onSubmit={handleWeightSubmit}>
            <input
              type="number"
              name="weight"
              placeholder="Enter weight"
              className="mr-2 px-2 py-1 border rounded"
              autoFocus
            />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Add Edge
            </button>
          </form>
        </div>
      )}

      <svg
        ref={svgRef}
        className="flex-grow bg-white"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Render edges and arrows */}
        {edges.map(edge => {
          const startNode = nodes.find(n => n.id === edge.start.id);
          const endNode = nodes.find(n => n.id === edge.end.id);
          if (!startNode || !endNode) return null;
          
          const { x: lineEndX, y: lineEndY } = calculateArrowPosition(startNode, endNode);
          const { x: lineStartX, y: lineStartY } = calculateArrowPosition(endNode, startNode);
          
          const shouldShowArrow = isBidirectional ? edge.isForward : edge.isDirected;
          
          return (
            <g key={edge.id}>
              <line
                x1={lineStartX}
                y1={lineStartY}
                x2={lineEndX}
                y2={lineEndY}
                stroke="black"
                strokeWidth="2"
              />
              {shouldShowArrow && renderArrow(startNode, endNode)}
              {edge.weight !== null && (
                <text
                  x={(startNode.x + endNode.x) / 2}
                  y={(startNode.y + endNode.y) / 2 - 10}
                  textAnchor="middle"
                  fill="red"
                >
                  {edge.weight}
                </text>
              )}
            </g>
          );
        })}

        {/* Render nodes */}
        {nodes.map(node => (
          <g key={node.id} onMouseDown={(e) => handleMouseDown(e, node)} onClick={() => handleNodeClick(node)}>
            <circle
              cx={node.x}
              cy={node.y}
              r="30"
              fill={
                node === startNode
                  ? 'purple'
                  : node === endNode
                  ? '#00ff00'
                  : 'gray'
              }
              className="cursor-move"
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dy=".3em"
              fill="white"
              fontSize="14"
            >
              {node.name}
            </text>
          </g>
        ))}
        
        {/* Render temp line */}
        {tempLine && (
          <line
            x1={tempLine.start.x}
            y1={tempLine.start.y}
            x2={tempLine.end.x}
            y2={tempLine.end.y}
            stroke="gray"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        )}
      </svg>
    </div>
  );
};

export default GraphVisualization;