// TraversalAlgo.js

// Inorder Traversal
export const inorderTraversal = (nodeId, nodes, order = []) => {
    if (!nodeId) return order;
  
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return order;
  
    const leftChild = nodes.find((n) => n.parent === node.id && n.isLeft);
    const rightChild = nodes.find((n) => n.parent === node.id && !n.isLeft);
  
    if (leftChild) inorderTraversal(leftChild.id, nodes, order);
    order.push(nodeId);
    if (rightChild) inorderTraversal(rightChild.id, nodes, order);
  
    return order;
  };
  
  // Preorder Traversal
  export const preorderTraversal = (nodeId, nodes, order = []) => {
    if (!nodeId) return order;
  
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return order;
  
    order.push(nodeId);
  
    const leftChild = nodes.find((n) => n.parent === node.id && n.isLeft);
    const rightChild = nodes.find((n) => n.parent === node.id && !n.isLeft);
  
    if (leftChild) preorderTraversal(leftChild.id, nodes, order);
    if (rightChild) preorderTraversal(rightChild.id, nodes, order);
  
    return order;
  };
  
  // Postorder Traversal
  export const postorderTraversal = (nodeId, nodes, order = []) => {
    if (!nodeId) return order;
  
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return order;
  
    const leftChild = nodes.find((n) => n.parent === node.id && n.isLeft);
    const rightChild = nodes.find((n) => n.parent === node.id && !n.isLeft);
  
    if (leftChild) postorderTraversal(leftChild.id, nodes, order);
    if (rightChild) postorderTraversal(rightChild.id, nodes, order);
  
    order.push(nodeId);
  
    return order;
  };

export const levelOrderTraversal = (rootId, nodes) => {
  const order = [];
  const queue = [rootId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    order.push(currentId);

    const leftChild = nodes.find(n => n.parent === currentId && n.isLeft);
    const rightChild = nodes.find(n => n.parent === currentId && !n.isLeft);

    if (leftChild) queue.push(leftChild.id);
    if (rightChild) queue.push(rightChild.id);
  }

  return order;
};