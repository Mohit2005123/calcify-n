"use client"
import { useState, useRef, useEffect } from 'react';
import { inorderTraversal, preorderTraversal, postorderTraversal, levelOrderTraversal } from '@/components/binarysearchtree/traversalAlgo';
const BinarySearchTree = () => {
  const [nodes, setNodes] = useState([]);
  const [nodeValue, setNodeValue] = useState('');
  const [lines, setLines] = useState([]);
  const [draggingNode, setDraggingNode] = useState(null);
  const [traversalOrder, setTraversalOrder] = useState([]);
  const [currentTraversalIndex, setCurrentTraversalIndex] = useState(null);
  const [deleteValue, setDeleteValue] = useState('');
  const svgRef = useRef(null);
  const [animationSpeed, setAnimationSpeed] = useState(1000); // Default 1000ms (1 second)
  const [selectedTraversal, setSelectedTraversal] = useState('inorder');

  // Helper functions
  const findParentNode = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !node.parent) return null;
    return nodes.find(n => n.id === node.parent);
  };

  const isLeftChild = (node) => {
    const parent = findParentNode(node.id);
    if (!parent) return null;
    return node.x < parent.x;
  };

  const calculateLineMetrics = (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    return { length, angle };
  };

//   const findNodePosition = (value) => {
//     if (nodes.length === 0) {
//       return { x: 400, y: 50, parent: null };
//     }

//     let current = nodes.find(n => n.parent === null); // root
//     let x = 400;
//     let y = 50;
//     let parent = null;
//     let horizontalSpacing = 150;

//     while (current) {
//       parent = current;
//       y += 100;
      
//       if (value < parseInt(current.value)) {
//         x -= horizontalSpacing;
//         current = nodes.find(n => n.parent === current.id && n.isLeft);
//       } else {
//         x += horizontalSpacing;
//         current = nodes.find(n => n.parent === current.id && !n.isLeft);
//       }
      
//       horizontalSpacing = Math.max(50, horizontalSpacing * 0.8);
//     }

//     return { x, y, parent: parent.id, isLeft: value < parseInt(parent.value) };
//   };
const findNodePosition = (value) => {
    if (nodes.length === 0 && svgRef.current) {
      // Get the width of the SVG container dynamically
      const svgWidth = svgRef.current.clientWidth;
      // Center the root node horizontally
      return { x: svgWidth / 2, y: 50, parent: null };
    }
  
    let current = nodes.find(n => n.parent === null); // root
    let x = svgRef.current ? svgRef.current.clientWidth / 2 : 400;
    let y = 50;
    let parent = null;
    let horizontalSpacing = 150;
  
    while (current) {
      parent = current;
      y += 100;
  
      if (value < parseInt(current.value)) {
        x -= horizontalSpacing;
        current = nodes.find(n => n.parent === current.id && n.isLeft);
      } else {
        x += horizontalSpacing;
        current = nodes.find(n => n.parent === current.id && !n.isLeft);
      }
  
      horizontalSpacing = Math.max(50, horizontalSpacing * 0.8);
    }
  
    return { x, y, parent: parent.id, isLeft: value < parseInt(parent.value) };
  };
  

  const addNode = () => {
    if (!nodeValue.trim() || isNaN(parseInt(nodeValue))) {
      alert("Please enter a valid number");
      return;
    }

    const value = parseInt(nodeValue);
    
    // Check if value already exists
    if (nodes.some(node => parseInt(node.value) === value)) {
      alert("This value already exists in the tree");
      return;
    }

    const position = findNodePosition(value);
    const newNode = {
      id: Date.now(),
      value: nodeValue,
      x: position.x,
      y: position.y,
      parent: position.parent,
      isLeft: position.isLeft
    };

    if (position.parent !== null) {
      const parentNode = nodes.find(n => n.id === position.parent);
      const { length, angle } = calculateLineMetrics(
        parentNode.x,
        parentNode.y,
        newNode.x,
        newNode.y
      );

      const newLine = {
        id: `${parentNode.id}-${newNode.id}`,
        startNode: parentNode.id,
        endNode: newNode.id,
        startX: parentNode.x,
        startY: parentNode.y,
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

  const constrainNodePosition = (node, newX, newY) => {
    const parent = findParentNode(node.id);
    if (!parent) return { x: newX, y: newY }; // Root node can move freely

    const isLeft = isLeftChild(node);
    const minDistance = 50;
    const maxDistance = 250;

    let constrainedX = newX;
    if (isLeft) {
      constrainedX = Math.min(parent.x - minDistance, Math.max(parent.x - maxDistance, newX));
    } else {
      constrainedX = Math.max(parent.x + minDistance, Math.min(parent.x + maxDistance, newX));
    }

    return { x: constrainedX, y: newY };
  };

  const handleDrag = (e) => {
    if (!svgRef.current) return;

    if (draggingNode) {
      const rect = svgRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;

      const { x, y } = constrainNodePosition(draggingNode, rawX, rawY);

      const updatedNodes = nodes.map(node =>
        node.id === draggingNode.id ? { ...node, x, y } : node
      );
      setNodes(updatedNodes);

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
  };

  const handleNodeDragStart = (node, e) => {
    e.stopPropagation();
    setDraggingNode(node);
  };

  const handleDragEnd = () => {
    setDraggingNode(null);
  };

  // Visualization logic
  const startTraversal = (type) => {
    let order = [];
    const root = nodes.find((n) => n.parent === null);
    if (root) {
      if (type === 'inorder') {
        order = inorderTraversal(root.id, nodes);
      } else if (type === 'preorder') {
        order = preorderTraversal(root.id, nodes);
      } else if (type === 'postorder') {
        order = postorderTraversal(root.id, nodes);
      } else if (type === 'levelorder') {
        order = levelOrderTraversal(root.id, nodes);
      }
    }
    setTraversalOrder(order);
    setCurrentTraversalIndex(0);
  };

  // Automatically update traversal visualization
  useEffect(() => {
    if (currentTraversalIndex !== null && currentTraversalIndex < traversalOrder.length) {
      const timeout = setTimeout(() => {
        setCurrentTraversalIndex((index) => index + 1);
      }, animationSpeed); // Use animationSpeed instead of fixed 1000ms

      return () => clearTimeout(timeout);
    }
  }, [currentTraversalIndex, traversalOrder, animationSpeed]);
  const deleteNode = () => {
    if (!deleteValue.trim() || isNaN(parseInt(deleteValue))) {
      alert("Please enter a valid number to delete");
      return;
    }

    const valueToDelete = parseInt(deleteValue);
    const nodeToDelete = nodes.find(node => parseInt(node.value) === valueToDelete);

    if (!nodeToDelete) {
      alert("Node not found in the tree");
      return;
    }

    let updatedNodes = [...nodes];
    let updatedLines = [...lines];

    // Case 1: Leaf node
    if (!updatedNodes.some(n => n.parent === nodeToDelete.id)) {
      updatedNodes = updatedNodes.filter(n => n.id !== nodeToDelete.id);
      updatedLines = updatedLines.filter(l => l.endNode !== nodeToDelete.id);
    }
    // Case 2: Node with one child
    else if (updatedNodes.filter(n => n.parent === nodeToDelete.id).length === 1) {
      const childNode = updatedNodes.find(n => n.parent === nodeToDelete.id);
      const parentNode = updatedNodes.find(n => n.id === nodeToDelete.parent);
      
      childNode.parent = parentNode ? parentNode.id : null;
      childNode.isLeft = parentNode ? valueToDelete < parseInt(parentNode.value) : false;
      
      updatedNodes = updatedNodes.filter(n => n.id !== nodeToDelete.id);
      updatedLines = updatedLines.filter(l => l.startNode !== nodeToDelete.id && l.endNode !== nodeToDelete.id);
      
      if (parentNode) {
        updatedLines.push({
          id: `${parentNode.id}-${childNode.id}`,
          startNode: parentNode.id,
          endNode: childNode.id,
          startX: parentNode.x,
          startY: parentNode.y,
          endX: childNode.x,
          endY: childNode.y,
          ...calculateLineMetrics(parentNode.x, parentNode.y, childNode.x, childNode.y)
        });
      }
    }
    // Case 3: Node with two children
    else {
      const successorNode = findInorderSuccessor(nodeToDelete.id, updatedNodes);
      nodeToDelete.value = successorNode.value;
      
      // Now remove the successor (which is guaranteed to have at most one child)
      const successorChild = updatedNodes.find(n => n.parent === successorNode.id);
      if (successorChild) {
        successorChild.parent = successorNode.parent;
        successorChild.isLeft = successorNode.isLeft;
      }
      
      updatedNodes = updatedNodes.filter(n => n.id !== successorNode.id);
      updatedLines = updatedLines.filter(l => l.startNode !== successorNode.id && l.endNode !== successorNode.id);
      
      if (successorChild) {
        const successorParent = updatedNodes.find(n => n.id === successorNode.parent);
        updatedLines.push({
          id: `${successorParent.id}-${successorChild.id}`,
          startNode: successorParent.id,
          endNode: successorChild.id,
          startX: successorParent.x,
          startY: successorParent.y,
          endX: successorChild.x,
          endY: successorChild.y,
          ...calculateLineMetrics(successorParent.x, successorParent.y, successorChild.x, successorChild.y)
        });
      }
    }

    setNodes(updatedNodes);
    setLines(updatedLines);
    setDeleteValue('');
  };

  const findInorderSuccessor = (nodeId, nodes) => {
    const node = nodes.find(n => n.id === nodeId);
    let current = nodes.find(n => n.parent === nodeId && !n.isLeft);
    
    while (current && nodes.some(n => n.parent === current.id && n.isLeft)) {
      current = nodes.find(n => n.parent === current.id && n.isLeft);
    }
    
    return current || node;
  };

  const generateRandomBST = () => {
    const numberOfNodes = Math.floor(Math.random() * 10) + 5; // Generate 5 to 14 nodes
    const values = new Set();
    
    // Generate unique random values
    while (values.size < numberOfNodes) {
      values.add(Math.floor(Math.random() * 100) + 1); // Random values between 1 and 100
    }

    // Clear existing tree
    setNodes([]);
    setLines([]);

    // Add nodes in order
    const sortedValues = Array.from(values).sort((a, b) => a - b);
    const rootValue = sortedValues[Math.floor(sortedValues.length / 2)];
    
    const addNodeRecursively = (value, x, y, parent = null, isLeft = false) => {
      const newNode = {
        id: Date.now() + Math.random(), // Ensure unique ID
        value: value.toString(),
        x,
        y,
        parent: parent ? parent.id : null,
        isLeft
      };

      setNodes(prevNodes => [...prevNodes, newNode]);

      if (parent) {
        const newLine = {
          id: `${parent.id}-${newNode.id}`,
          startNode: parent.id,
          endNode: newNode.id,
          startX: parent.x,
          startY: parent.y,
          endX: x,
          endY: y,
          ...calculateLineMetrics(parent.x, parent.y, x, y)
        };
        setLines(prevLines => [...prevLines, newLine]);
      }

      return newNode;
    };

    const buildTree = (values, x, y, parent = null, isLeft = false) => {
      if (values.length === 0) return;

      const mid = Math.floor(values.length / 2);
      const node = addNodeRecursively(values[mid], x, y, parent, isLeft);

      const leftValues = values.slice(0, mid);
      const rightValues = values.slice(mid + 1);

      if (leftValues.length > 0) {
        buildTree(leftValues, x - 100, y + 100, node, true);
      }
      if (rightValues.length > 0) {
        buildTree(rightValues, x + 100, y + 100, node, false);
      }
    };

    buildTree(sortedValues, svgRef.current ? svgRef.current.clientWidth / 2 : 400, 50);
  };

  const handleVisualize = () => {
    startTraversal(selectedTraversal);
  };

  return (
    <div className="w-full h-screen bg-gray-100 p-4">
      {/* Control Panel */}
      <div className="mb-4 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <input
            type="number"
            value={nodeValue}
            onChange={(e) => setNodeValue(e.target.value)}
            placeholder="Enter number"
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addNode}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Add Node
          </button>
          <input
            type="number"
            value={deleteValue}
            onChange={(e) => setDeleteValue(e.target.value)}
            placeholder="Enter number to delete"
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={deleteNode}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
            Delete Node
          </button>
          <button
            onClick={generateRandomBST}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md"
          >
            Generate Random BST
          </button>
        </div>
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <select
            value={selectedTraversal}
            onChange={(e) => setSelectedTraversal(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="inorder">Inorder Traversal</option>
            <option value="preorder">Preorder Traversal</option>
            <option value="postorder">Postorder Traversal</option>
            <option value="levelorder">Level Order Traversal</option>
          </select>
          <button
            onClick={handleVisualize}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
          >
            Visualize Traversal
          </button>
        </div>
        <div className="flex items-center">
          <label htmlFor="speed-slider" className="mr-2 text-sm font-medium text-gray-700">
            Animation Speed:
          </label>
          <input
            id="speed-slider"
            type="range"
            min="100"
            max="2000"
            step="100"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(Number(e.target.value))}
            className="w-64"
          />
          <span className="ml-2 text-sm text-gray-600">{animationSpeed}ms</span>
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="bg-white rounded-lg shadow p-4 h-[calc(100vh-220px)]">
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
          {nodes.map((node, index) => (
            <g
              key={node.id}
              transform={`translate(${node.x},${node.y})`}
              onMouseDown={(e) => handleNodeDragStart(node, e)}
              className="cursor-move"
            >
              <circle
                r="25"
                fill={traversalOrder[currentTraversalIndex] === node.id ? '#34D399' : '#fff'}
                stroke="#2563EB"
                strokeWidth="2"
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

export default BinarySearchTree;
