"use client"
import { useState, useRef, useEffect } from 'react';
import { inorderTraversal, preorderTraversal, postorderTraversal, levelOrderTraversal } from '@/components/binarysearchtree/traversalAlgo';
class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}


const AVLtree = () => {
  const [nodes, setNodes] = useState([]);
  const [nodeValue, setNodeValue] = useState('');
  const [lines, setLines] = useState([]);
  const [draggingNode, setDraggingNode] = useState(null);
  const [traversalOrder, setTraversalOrder] = useState([]);
  const [currentTraversalIndex, setCurrentTraversalIndex] = useState(null);
  const [deleteValue, setDeleteValue] = useState('');
  const svgRef = useRef(null);
  const [animationSpeed, setAnimationSpeed] = useState(1000); // Default 1000ms (1 second)
   // AVL Tree Helper Functions
   const getHeight = (node) => {
    if (!node) return 0;
    return node.height;
  };

  const getBalanceFactor = (node) => {
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

  // Insert a node into AVL tree
  const insertNode = (root, value) => {
    if (!root) return new AVLNode(value);

    if (value < root.value)
      root.left = insertNode(root.left, value);
    else if (value > root.value)
      root.right = insertNode(root.right, value);
    else
      return root; // Duplicate values not allowed

    root.height = Math.max(getHeight(root.left), getHeight(root.right)) + 1;

    const balance = getBalanceFactor(root);

    // Left Left Case
    if (balance > 1 && value < root.left.value)
      return rightRotate(root);

    // Right Right Case
    if (balance < -1 && value > root.right.value)
      return leftRotate(root);

    // Left Right Case
    if (balance > 1 && value > root.left.value) {
      root.left = leftRotate(root.left);
      return rightRotate(root);
    }

    // Right Left Case
    if (balance < -1 && value < root.right.value) {
      root.right = rightRotate(root.right);
      return leftRotate(root);
    }

    return root;
  };

  // Convert AVL tree to visual representation
  const createVisualTree = (avlRoot, x = svgRef.current ? svgRef.current.clientWidth / 2 : 400, y = 50, level = 0) => {
    if (!avlRoot) return { nodes: [], lines: [] };

    const horizontalSpacing = Math.max(50, 150 * Math.pow(0.8, level));
    const verticalSpacing = 100;

    const newNodes = [];
    const newLines = [];
    const nodeId = Date.now() + Math.random();

    newNodes.push({
      id: nodeId,
      value: avlRoot.value.toString(),
      x,
      y,
      parent: null
    });

    const leftSubtree = createVisualTree(
      avlRoot.left,
      x - horizontalSpacing,
      y + verticalSpacing,
      level + 1
    );

    const rightSubtree = createVisualTree(
      avlRoot.right,
      x + horizontalSpacing,
      y + verticalSpacing,
      level + 1
    );

    if (leftSubtree.nodes.length > 0) {
      leftSubtree.nodes[0].parent = nodeId;
      leftSubtree.nodes[0].isLeft = true;
      newLines.push({
        id: `${nodeId}-${leftSubtree.nodes[0].id}`,
        startNode: nodeId,
        endNode: leftSubtree.nodes[0].id,
        startX: x,
        startY: y,
        endX: leftSubtree.nodes[0].x,
        endY: leftSubtree.nodes[0].y,
        ...calculateLineMetrics(x, y, leftSubtree.nodes[0].x, leftSubtree.nodes[0].y)
      });
    }

    if (rightSubtree.nodes.length > 0) {
      rightSubtree.nodes[0].parent = nodeId;
      rightSubtree.nodes[0].isLeft = false;
      newLines.push({
        id: `${nodeId}-${rightSubtree.nodes[0].id}`,
        startNode: nodeId,
        endNode: rightSubtree.nodes[0].id,
        startX: x,
        startY: y,
        endX: rightSubtree.nodes[0].x,
        endY: rightSubtree.nodes[0].y,
        ...calculateLineMetrics(x, y, rightSubtree.nodes[0].x, rightSubtree.nodes[0].y)
      });
    }

    return {
      nodes: [...newNodes, ...leftSubtree.nodes, ...rightSubtree.nodes],
      lines: [...newLines, ...leftSubtree.lines, ...rightSubtree.lines]
    };
  };
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
    if (nodes.some(node => parseInt(node.value) === value)) {
      alert("This value already exists in the tree");
      return;
    }

    // Build logical AVL tree from current visual representation
    let avlRoot = null;
    const sortedNodes = [...nodes].sort((a, b) => parseInt(a.value) - parseInt(b.value));
    sortedNodes.forEach(node => {
      avlRoot = insertNode(avlRoot, parseInt(node.value));
    });

    // Insert new node
    avlRoot = insertNode(avlRoot, value);

    // Convert balanced AVL tree back to visual representation
    const { nodes: newNodes, lines: newLines } = createVisualTree(avlRoot);
    setNodes(newNodes);
    setLines(newLines);
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

    // Build logical AVL tree from current visual representation
    let avlRoot = null;
    const sortedNodes = [...nodes].sort((a, b) => parseInt(a.value) - parseInt(b.value));
    sortedNodes.forEach(node => {
      avlRoot = insertNode(avlRoot, parseInt(node.value));
    });

    // Delete node and rebalance
    avlRoot = deleteNodeFromAVL(avlRoot, valueToDelete);

    if (!avlRoot) {
      setNodes([]);
      setLines([]);
    } else {
      // Convert balanced AVL tree back to visual representation
      const { nodes: newNodes, lines: newLines } = createVisualTree(avlRoot);
      setNodes(newNodes);
      setLines(newLines);
    }

    setDeleteValue('');
  };

  // Helper function to delete a node from AVL tree
  const deleteNodeFromAVL = (root, value) => {
    if (!root) return root;

    // Perform standard BST delete
    if (value < root.value) {
      root.left = deleteNodeFromAVL(root.left, value);
    } else if (value > root.value) {
      root.right = deleteNodeFromAVL(root.right, value);
    } else {
      // Node to delete found

      // Node with only one child or no child
      if (!root.left || !root.right) {
        const temp = root.left ? root.left : root.right;
        if (!temp) {
          // No child case
          root = null;
        } else {
          // One child case
          root = temp;
        }
      } else {
        // Node with two children
        const temp = findMinNode(root.right);
        root.value = temp.value;
        root.right = deleteNodeFromAVL(root.right, temp.value);
      }
    }

    // If the tree had only one node, return
    if (!root) return root;

    // Update height of the current node
    root.height = Math.max(getHeight(root.left), getHeight(root.right)) + 1;

    // Get the balance factor
    const balance = getBalanceFactor(root);

    // Rebalance if needed
    // Left Left Case
    if (balance > 1 && getBalanceFactor(root.left) >= 0) {
      return rightRotate(root);
    }

    // Left Right Case
    if (balance > 1 && getBalanceFactor(root.left) < 0) {
      root.left = leftRotate(root.left);
      return rightRotate(root);
    }

    // Right Right Case
    if (balance < -1 && getBalanceFactor(root.right) <= 0) {
      return leftRotate(root);
    }

    // Right Left Case
    if (balance < -1 && getBalanceFactor(root.right) > 0) {
      root.right = rightRotate(root.right);
      return leftRotate(root);
    }

    return root;
  };

  // Helper function to find the node with minimum value
  const findMinNode = (node) => {
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current;
  };

  const generateRandomAVLTree = () => {
    const numberOfNodes = Math.floor(Math.random() * 10) + 5; // Random number between 5 and 14
    let avlRoot = null;
    const uniqueValues = new Set();

    while (uniqueValues.size < numberOfNodes) {
      const randomValue = Math.floor(Math.random() * 100) + 1; // Random number between 1 and 100
      if (!uniqueValues.has(randomValue)) {
        uniqueValues.add(randomValue);
        avlRoot = insertNode(avlRoot, randomValue);
      }
    }

    const { nodes: newNodes, lines: newLines } = createVisualTree(avlRoot);
    setNodes(newNodes);
    setLines(newLines);
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
            onClick={() => startTraversal('inorder')}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
          >
            Visualize Inorder Traversal
          </button>
          <button
            onClick={() => startTraversal('preorder')}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md"
          >
            Visualize Preorder Traversal
          </button>
          <button
            onClick={() => startTraversal('postorder')}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md"
          >
            Visualize Postorder Traversal
          </button>
          <button
            onClick={() => startTraversal('levelorder')}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
          >
            Visualize Level-order Traversal
          </button>
          <button
            onClick={generateRandomAVLTree}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md"
          >
            Generate Random AVL Tree
          </button>
        </div>
        <div className="flex flex-wrap gap-4 items-center mb-4">
          {/* Add this slider control */}
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

export default AVLtree;
