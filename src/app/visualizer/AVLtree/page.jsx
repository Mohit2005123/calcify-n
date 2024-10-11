"use client"
import { useState, useRef, useEffect } from 'react';
import { inorderTraversal, preorderTraversal, postorderTraversal } from '@/components/binarysearchtree/traversalAlgo';
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
      }, 1000); // 1-second delay between each step

      return () => clearTimeout(timeout);
    }
  }, [currentTraversalIndex, traversalOrder]);
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

  return (
    <div className="w-full h-screen bg-gray-100 p-4">
      {/* Control Panel */}
      <div className="mb-4 flex gap-4 items-center bg-white p-4 rounded-lg shadow">
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