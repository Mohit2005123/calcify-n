"use client"
import { useState, useCallback, useRef, useEffect } from 'react';

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

export default function AVLTreeVisualizer() {
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [draggedNode, setDraggedNode] = useState(null);
  const [nodes, setNodes] = useState(new Map());
  const svgRef = useRef(null);

  // Constants for angle constraints
  const MIN_ANGLE = -60; // Maximum angle to the left (degrees)
  const MAX_ANGLE = 60;  // Maximum angle to the right (degrees)
  const MIN_DISTANCE = 50; // Minimum distance between parent and child

  // Calculate angle between two points
  const calculateAngle = (x1, y1, x2, y2) => {
    return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  };

  // Calculate distance between two points
  const calculateDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  // Calculate constrained position
  const getConstrainedPosition = (parentX, parentY, childX, childY, isLeft) => {
    const angle = calculateAngle(parentX, parentY, childX, childY);
    const distance = Math.max(calculateDistance(parentX, parentY, childX, childY), MIN_DISTANCE);
    
    // Constrain angle based on whether it's a left or right child
    let constrainedAngle;
    if (isLeft) {
      constrainedAngle = Math.max(MIN_ANGLE, Math.min(-10, angle));
    } else {
      constrainedAngle = Math.min(MAX_ANGLE, Math.max(10, angle));
    }
    
    // Convert angle back to coordinates
    const radians = constrainedAngle * (Math.PI / 180);
    return {
      x: parentX + distance * Math.cos(radians),
      y: parentY + distance * Math.sin(radians)
    };
  };

  // Convert tree to flat structure with positions
  const flattenTree = useCallback((node, x = 0, y = 0, level = 1) => {
    if (!node) return;
    
    const spacing = 80 / (level + 1);
    
    // Use existing position if node has been dragged, otherwise calculate default position
    if (!nodes.has(node.value)) {
      nodes.set(node.value, { x, y, node });
    }
    
    if (node.left) {
      const leftX = x - spacing;
      const leftY = y + 80;
      flattenTree(node.left, leftX, leftY, level + 1);
    }
    if (node.right) {
      const rightX = x + spacing;
      const rightY = y + 80;
      flattenTree(node.right, rightX, rightY, level + 1);
    }
  }, [nodes]);

  // AVL Tree operations (unchanged)
  const getHeight = (node) => {
    if (!node) return 0;
    return node.height;
  };
  
  const getBalance = (node) => {
    if (!node) return 0;
    return getHeight(node.left) - getHeight(node.right);
  };
  
  const rightRotate = (y) => {
    const x = y.left;
    const T2 = x.right;
    
    x.right = y;
    y.left = T2;
    
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    
    return x;
  };
  
  const leftRotate = (x) => {
    const y = x.right;
    const T2 = y.left;
    
    y.left = x;
    x.right = T2;
    
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    
    return y;
  };

  // Handle drag events with constraints
  const handleDragStart = (e, value) => {
    setDraggedNode(value);
    e.stopPropagation();
  };

  const findParentNode = (searchNode, targetValue) => {
    if (!searchNode) return null;
    if ((searchNode.left && searchNode.left.value === targetValue) ||
        (searchNode.right && searchNode.right.value === targetValue)) {
      return searchNode;
    }
    return findParentNode(searchNode.left, targetValue) || findParentNode(searchNode.right, targetValue);
  };

  const handleDrag = (e) => {
    if (!draggedNode || !svgRef.current) return;
    
    const svg = svgRef.current;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());
    
    const parentNode = findParentNode(root, draggedNode);
    if (parentNode) {
      const parentData = nodes.get(parentNode.value);
      const isLeft = parentNode.left && parentNode.left.value === draggedNode;
      
      // Get constrained position
      const constrainedPos = getConstrainedPosition(
        parentData.x,
        parentData.y,
        svgPoint.x,
        svgPoint.y,
        isLeft
      );

      const nodeData = nodes.get(draggedNode);
      if (nodeData) {
        nodes.set(draggedNode, {
          ...nodeData,
          x: constrainedPos.x,
          y: constrainedPos.y
        });
        setNodes(new Map(nodes));
      }
    } else if (draggedNode === root.value) {
      // Root node can move freely within bounds
      const nodeData = nodes.get(draggedNode);
      if (nodeData) {
        nodes.set(draggedNode, {
          ...nodeData,
          x: svgPoint.x,
          y: svgPoint.y
        });
        setNodes(new Map(nodes));
      }
    }
  };

  const handleDragEnd = () => {
    setDraggedNode(null);
  };

  // Insert with position handling
  const insert = useCallback((node, value) => {
    if (!node) return new AVLNode(value);
    
    if (value < node.value) {
      node.left = insert(node.left, value);
    } else if (value > node.value) {
      node.right = insert(node.right, value);
    } else {
      return node;
    }
    
    node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
    
    const balance = getBalance(node);
    
    if (balance > 1 && value < node.left.value) {
      return rightRotate(node);
    }
    if (balance < -1 && value > node.right.value) {
      return leftRotate(node);
    }
    if (balance > 1 && value > node.left.value) {
      node.left = leftRotate(node.left);
      return rightRotate(node);
    }
    if (balance < -1 && value < node.right.value) {
      node.right = rightRotate(node.right);
      return leftRotate(node);
    }
    
    return node;
  }, []);

  const handleAddNode = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      setRoot((prevRoot) => {
        const newRoot = insert(prevRoot, value);
        setNodes(new Map());
        return newRoot;
      });
      setInputValue('');
    }
  };

  useEffect(() => {
    if (root) {
      flattenTree(root);
      setNodes(new Map(nodes));
    }
  }, [root, flattenTree]);

  // Render tree connection line
  const TreeLine = ({ from, to }) => {
    const fromNode = nodes.get(from.value);
    const toNode = nodes.get(to.value);
    
    if (!fromNode || !toNode) return null;

    return (
      <line
        x1={fromNode.x}
        y1={fromNode.y}
        x2={toNode.x}
        y2={toNode.y}
        className="stroke-gray-400"
        strokeWidth="2"
      />
    );
  };

  // Render tree node
  const TreeNode = ({ node }) => {
    if (!node || !nodes.has(node.value)) return null;
    
    const nodeData = nodes.get(node.value);
    
    return (
      <>
        {node.left && <TreeLine from={node} to={node.left} />}
        {node.right && <TreeLine from={node} to={node.right} />}
        
        <g
          transform={`translate(${nodeData.x},${nodeData.y})`}
          onMouseDown={(e) => handleDragStart(e, node.value)}
          className="cursor-move"
        >
          <circle
            r="20"
            className={`${draggedNode === node.value ? 'fill-blue-600' : 'fill-blue-500'} stroke-white stroke-2`}
          />
          <text
            className="text-white text-sm font-bold select-none"
            textAnchor="middle"
            dy=".3em"
          >
            {node.value}
          </text>
        </g>
        
        {node.left && <TreeNode node={node.left} />}
        {node.right && <TreeNode node={node.right} />}
      </>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-2">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          placeholder="Enter value"
        />
        <button
          onClick={handleAddNode}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        >
          Add Node
        </button>
      </div>
      
      <div className="w-full h-[600px] border border-gray-200 rounded">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="-400 -50 800 600"
          className="overflow-visible"
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          {root && <TreeNode node={root} />}
        </svg>
      </div>
    </div>
  );
}
