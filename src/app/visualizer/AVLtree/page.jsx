"use client"
import { useState, useRef, useEffect } from 'react';

// AVL Tree Node class
class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
    this.x = 0;
    this.y = 0;
  }
}

const AVLTreeVisualizer = () => {
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [lines, setLines] = useState([]);

  // Helper function to get height
  const getHeight = (node) => {
    if (!node) return 0;
    return node.height;
  };

  // Get balance factor
  const getBalance = (node) => {
    if (!node) return 0;
    return getHeight(node.left) - getHeight(node.right);
  };

  // Right rotate
  const rightRotate = (y) => {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;

    return x;
  };

  // Left rotate
  const leftRotate = (x) => {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;

    return y;
  };

  // Insert a node
  const insert = (node, value) => {
    if (!node) {
      return new AVLNode(value);
    }

    if (value < node.value) {
      node.left = insert(node.left, value);
    } else if (value > node.value) {
      node.right = insert(node.right, value);
    } else {
      return node; // Duplicate values not allowed
    }

    node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;

    const balance = getBalance(node);

    // Left Left Case
    if (balance > 1 && value < node.left.value) {
      return rightRotate(node);
    }

    // Right Right Case
    if (balance < -1 && value > node.right.value) {
      return leftRotate(node);
    }

    // Left Right Case
    if (balance > 1 && value > node.left.value) {
      node.left = leftRotate(node.left);
      return rightRotate(node);
    }

    // Right Left Case
    if (balance < -1 && value < node.right.value) {
      node.right = rightRotate(node.right);
      return leftRotate(node);
    }

    return node;
  };

  // Calculate node positions
  const calculatePositions = (node, level = 0, position = 0, width = 800) => {
    if (!node) return;

    const spacing = width / Math.pow(2, level + 1);
    node.x = position;
    node.y = level * 80 + 100;

    calculatePositions(node.left, level + 1, position - spacing, width);
    calculatePositions(node.right, level + 1, position + spacing, width);
  };

  // Update visual representation
  const updateVisualization = () => {
    if (!root) {
      setNodes([]);
      setLines([]);
      return;
    }

    calculatePositions(root, 0, 400, 800);
    const newNodes = [];
    const newLines = [];

    const traverseTree = (node) => {
      if (!node) return;

      newNodes.push({
        x: node.x,
        y: node.y,
        value: node.value
      });

      if (node.left) {
        newLines.push({
          x1: node.x,
          y1: node.y,
          x2: node.left.x,
          y2: node.left.y
        });
        traverseTree(node.left);
      }

      if (node.right) {
        newLines.push({
          x1: node.x,
          y1: node.y,
          x2: node.right.x,
          y2: node.right.y
        });
        traverseTree(node.right);
      }
    };

    traverseTree(root);
    setNodes(newNodes);
    setLines(newLines);
  };

  // Handle node addition
  const handleAddNode = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }
    setError('');
    setRoot(insert(root, value));
    setInputValue('');
  };

  // Update visualization when root changes
  useEffect(() => {
    updateVisualization();
  }, [root]);

  const handleMouseDown = (e, lineIndex) => {
    setDraggingNode({ index: lineIndex, startX: e.clientX, startY: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!draggingNode) return;

    const dx = e.clientX - draggingNode.startX;
    const dy = e.clientY - draggingNode.startY;

    setLines(prevLines => {
      const newLines = [...prevLines];
      const line = newLines[draggingNode.index];
      line.x2 += dx;
      line.y2 += dy;
      return newLines;
    });

    setDraggingNode({
      ...draggingNode,
      startX: e.clientX,
      startY: e.clientY
    });
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 p-4">
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter number"
        />
        <button
          onClick={handleAddNode}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Node
        </button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <svg 
        width="800" 
        height="600" 
        className="border rounded-lg bg-white"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {lines.map((line, index) => (
          <line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="black"
            strokeWidth="2"
            onMouseDown={(e) => handleMouseDown(e, index)}
            className="cursor-move"
          />
        ))}
        {nodes.map((node, index) => (
          <g key={index}>
            <circle
              cx={node.x}
              cy={node.y}
              r="20"
              fill="white"
              stroke="black"
              strokeWidth="2"
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="select-none"
            >
              {node.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default AVLTreeVisualizer;