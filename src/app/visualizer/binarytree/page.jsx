"use client"
import { useState, useRef, useCallback } from 'react';
import { inorderTraversal, preorderTraversal, postorderTraversal, levelOrderTraversal } from '@/components/binarytree/traversalAlgo';
const BinaryTree = () => {
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeValue, setNodeValue] = useState('');
  const [lines, setLines] = useState([]);
  const [draggingLine, setDraggingLine] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [highlightedNode, setHighlightedNode] = useState(null); 
  const svgRef = useRef(null);
  const [visualizationSpeed, setVisualizationSpeed] = useState(1000); // Default speed: 1000ms
  const [selectedTraversal, setSelectedTraversal] = useState('inorder');

  const traversalOptions = [
    { value: 'inorder', label: 'Inorder', func: inorderTraversal },
    { value: 'preorder', label: 'Preorder', func: preorderTraversal },
    { value: 'postorder', label: 'Postorder', func: postorderTraversal },
    { value: 'levelOrder', label: 'Level Order', func: levelOrderTraversal },
  ];

  const handleVisualize = () => {
    const selectedOption = traversalOptions.find(option => option.value === selectedTraversal);
    if (selectedOption) {
      visualizeTraversal(selectedOption.func);
    }
  };

  const getLeftChild = (node) => nodes.find(n => n.id === node.left);
  const getRightChild = (node) => nodes.find(n => n.id === node.right);
  // Visualize traversal by highlighting nodes in sequence
  const visualizeTraversal = useCallback((traversalFunc) => {
    if (!nodes.length) return;
    
    const rootNode = nodes.find(node => node.parent === null);
    const traversalOrder = traversalFunc(rootNode, getLeftChild, getRightChild);

    console.log('Traversal Order:', traversalOrder); // Debugging line

    traversalOrder.forEach((node, index) => {
      setTimeout(() => setHighlightedNode(node.id), index * visualizationSpeed);
    });

    // Reset highlight after traversal completes
    setTimeout(() => setHighlightedNode(null), traversalOrder.length * visualizationSpeed);
  }, [nodes, visualizationSpeed, getLeftChild, getRightChild]);
  // Helper to find parent node
  const findParentNode = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !node.parent) return null;
    return nodes.find(n => n.id === node.parent);
  };
2
  // Helper to determine if node is left or right child
  const isLeftChild = (node) => {
    const parent = findParentNode(node.id);
    if (!parent) return null;
    return node.x < parent.x;
  };

  // Calculate line metrics
  const calculateLineMetrics = (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    return { length, angle };
  };

  // Add a new node
  const addNode = (position) => {
    if (!nodeValue.trim()) return;

    if (position === 'root' && nodes.length > 0) {
      alert("The binary tree can only have one root node.");
      return;
    }

    const existingChild = nodes.find(n => n.parent === selectedNode.id && n.isLeft === (position === 'left'));
    if (existingChild) {
      alert(`The selected node already has a ${position} child.`);
      return;
    }

    const newNode = {
      id: Date.now(),
      value: nodeValue,
      x: position === 'root' ? 400 :
        position === 'left' ? selectedNode.x - 150 :
          selectedNode.x + 150,
      y: position === 'root' ? 50 : selectedNode.y + 100,
      parent: position === 'root' ? null : selectedNode.id,
      isLeft: position === 'left'
    };

    if (position !== 'root') {
      if (position === 'left') {
        selectedNode.left = newNode.id;
      } else {
        selectedNode.right = newNode.id;
      }
    }

    if (position !== 'root') {
      const { length, angle } = calculateLineMetrics(
        selectedNode.x,
        selectedNode.y,
        newNode.x,
        newNode.y
      );

      const newLine = {
        id: `${selectedNode.id}-${newNode.id}`,
        startNode: selectedNode.id,
        endNode: newNode.id,
        startX: selectedNode.x,
        startY: selectedNode.y,
        endX: newNode.x,
        endY: newNode.y,
        angle,
        length
      };
      setLines([...lines, newLine]);
    }

    setNodes([...nodes, newNode]);
    setNodeValue('');
  };


  // Constrain node position based on parent
  const constrainNodePosition = (node, newX, newY) => {
    const parent = findParentNode(node.id);
    if (!parent) return { x: newX, y: newY }; // Root node can move freely

    const isLeft = isLeftChild(node);
    const minDistance = 50; // Minimum horizontal distance from parent
    const maxDistance = 250; // Maximum horizontal distance from parent

    let constrainedX = newX;
    if (isLeft) {
      // Left child must stay to the left of parent
      constrainedX = Math.min(parent.x - minDistance, Math.max(parent.x - maxDistance, newX));
    } else {
      // Right child must stay to the right of parent
      constrainedX = Math.max(parent.x + minDistance, Math.min(parent.x + maxDistance, newX));
    }

    return { x: constrainedX, y: newY };
  };

  // Handle node dragging
  const handleDrag = (e) => {
    if (!svgRef.current) return;

    if (draggingNode) {
      const rect = svgRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;

      // Apply constraints to the new position
      const { x, y } = constrainNodePosition(draggingNode, rawX, rawY);

      // Update node position
      const updatedNodes = nodes.map(node =>
        node.id === draggingNode.id ? { ...node, x, y } : node
      );
      setNodes(updatedNodes);

      // Update connected lines
      const updatedLines = lines.map(line => {
        if (line.startNode === draggingNode.id) {
          const { length, angle } = calculateLineMetrics(x, y, line.endX, line.endY);
          return { ...line, startX: x, startY: y, length, angle };
        }
        if (line.endNode === draggingNode.id) {
          const { length, angle } = calculateLineMetrics(line.startX, line.startY, x, y);
          return { ...line, endX: x, endY: y, length, angle };
        }
        return line;
      });
      setLines(updatedLines);
    }

    if (draggingLine) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const updatedLines = lines.map(line => {
        if (line.id === draggingLine.line.id) {
          const startX = draggingLine.end === 'start' ? x : line.startX;
          const startY = draggingLine.end === 'start' ? y : line.startY;
          const endX = draggingLine.end === 'end' ? x : line.endX;
          const endY = draggingLine.end === 'end' ? y : line.endY;

          const { length, angle } = calculateLineMetrics(startX, startY, endX, endY);

          return {
            ...line,
            startX,
            startY,
            endX,
            endY,
            length,
            angle
          };
        }
        return line;
      });

      setLines(updatedLines);
    }
  };

  const handleNodeDragStart = (node, e) => {
    e.stopPropagation();
    setDraggingNode(node);
  };

  const handleDragEnd = () => {
    setDraggingNode(null);
    setDraggingLine(null);
  };

  // Line length adjustment
  const adjustLineLength = (line, delta) => {
    const angle = line.angle * (Math.PI / 180);
    const newLength = Math.max(30, line.length + delta);
    const dx = Math.cos(angle) * newLength;
    const dy = Math.sin(angle) * newLength;

    const updatedLines = lines.map(l => {
      if (l.id === line.id) {
        return {
          ...l,
          endX: l.startX + dx,
          endY: l.startY + dy,
          length: newLength
        };
      }
      return l;
    });

    setLines(updatedLines);
  };

  const generateRandomTree = () => {
    const newNodes = [];
    const newLines = [];
    const nodeCount = Math.floor(Math.random() * 6) + 5; // Random number of nodes between 5 and 10
    // Create root node
    const rootNode = {
      id: Date.now(),
      value: Math.floor(Math.random() * 100).toString(),
      x: svgRef.current ? svgRef.current.clientWidth / 2 : 400,
      y: 50,
      parent: null,
      left: null,
      right: null
    };
    newNodes.push(rootNode);

    for (let i = 1; i < nodeCount; i++) {
      const value = Math.floor(Math.random() * 100).toString();
      let parentNode = newNodes[Math.floor(Math.random() * newNodes.length)];
      
      while (parentNode.left && parentNode.right) {
        parentNode = newNodes[Math.floor(Math.random() * newNodes.length)];
      }

      const isLeft = !parentNode.left;
      const newNode = {
        id: Date.now() + i,
        value: value,
        x: isLeft ? parentNode.x - 150 : parentNode.x + 150,
        y: parentNode.y + 100,
        parent: parentNode.id,
        left: null,
        right: null
      };

      if (isLeft) {
        parentNode.left = newNode.id;
      } else {
        parentNode.right = newNode.id;
      }

      newNodes.push(newNode);

      const { length, angle } = calculateLineMetrics(
        parentNode.x,
        parentNode.y,
        newNode.x,
        newNode.y
      );

      newLines.push({
        id: `${parentNode.id}-${newNode.id}`,
        startNode: parentNode.id,
        endNode: newNode.id,
        startX: parentNode.x,
        startY: parentNode.y,
        endX: newNode.x,
        endY: newNode.y,
        angle,
        length
      });
    }

    setNodes(newNodes);
    setLines(newLines);
  };
  return (
    <div className="w-full h-screen bg-gray-100 p-4">
      {/* Control Panel */}
      <div className="mb-4 flex gap-4 items-center bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          value={nodeValue}
          onChange={(e) => setNodeValue(e.target.value)}
          placeholder="Enter node value"
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => addNode('root')}
          disabled={nodes.length > 0}
          className={`px-4 py-2 rounded-md ${nodes.length > 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
        >
          Add Root
        </button>
        {selectedNode && (
          <>
            <button
              onClick={() => addNode('left')}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
            >
              Add Left
            </button>
            <button
              onClick={() => addNode('right')}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
            >
              Add Right
            </button>
          </>
        )}
        <button
          onClick={generateRandomTree}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
        >
          Generate Random Tree
        </button>
        {/* Replace the four visualization buttons with a dropdown and a single button */}
        <select
          value={selectedTraversal}
          onChange={(e) => setSelectedTraversal(e.target.value)}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {traversalOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleVisualize}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md"
        >
          Visualize
        </button>
        {/* Add this slider control */}
        <div className="flex items-center">
          <label htmlFor="speed-slider" className="mr-2">Speed:</label>
          <input
            id="speed-slider"
            type="range"
            min="100"
            max="2000"
            step="100"
            value={visualizationSpeed}
            onChange={(e) => setVisualizationSpeed(Number(e.target.value))}
            className="w-40"
          />
          <span className="ml-2">{visualizationSpeed}ms</span>
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="bg-white rounded-lg shadow p-4 h-[calc(100vh-120px)]">
        <svg
          ref={svgRef}
          className="w-full h-full"
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          {/* Lines */}
          {lines.map((line) => (
            <g key={line.id}>
              <line
                x1={line.startX}
                y1={line.startY}
                x2={line.endX}
                y2={line.endY}
                stroke="black"
                strokeWidth="2"
                className="cursor-move"
              />
            </g>
          ))}

          {/* Nodes */}
          {nodes.map((node) => (
            <g
              key={node.id}
              transform={`translate(${node.x},${node.y})`}
              onMouseDown={(e) => handleNodeDragStart(node, e)}
              className="cursor-move"
            >
              <circle
                r="25"
                fill={highlightedNode === node.id ? 'orange' : (selectedNode?.id === node.id ? '#93C5FD' : '#fff')}
                stroke="#2563EB"
                strokeWidth="2"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(node);
                }}
              />
              <text
                textAnchor="middle"
                dy=".3em"
                className="select-none pointer-events-none"
              >
                {node.value}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default BinaryTree;
