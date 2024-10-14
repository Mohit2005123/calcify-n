// Inorder Traversal (Left, Root, Right)
export const inorderTraversal = (node, getLeftChild, getRightChild, visited = []) => {
    if (!node) return visited;
    inorderTraversal(getLeftChild(node), getLeftChild, getRightChild, visited);
    visited.push(node);
    inorderTraversal(getRightChild(node), getLeftChild, getRightChild, visited);
    return visited;
  };
  
  // Preorder Traversal (Root, Left, Right)
  export const preorderTraversal = (node, getLeftChild, getRightChild, visited = []) => {
    if (!node) return visited;
    visited.push(node);
    preorderTraversal(getLeftChild(node), getLeftChild, getRightChild, visited);
    preorderTraversal(getRightChild(node), getLeftChild, getRightChild, visited);
    return visited;
  };
  
  // Postorder Traversal (Left, Right, Root)
  export const postorderTraversal = (node, getLeftChild, getRightChild, visited = []) => {
    if (!node) return visited;
    postorderTraversal(getLeftChild(node), getLeftChild, getRightChild, visited);
    postorderTraversal(getRightChild(node), getLeftChild, getRightChild, visited);
    visited.push(node);
    return visited;
  };
   export const levelOrderTraversal = (root, getLeftChild, getRightChild) => {
    if (!root) return [];
    const queue = [root];
    const result = [];
    
    while (queue.length > 0) {
      const node = queue.shift();
      result.push(node);
      
      const leftChild = getLeftChild(node);
      const rightChild = getRightChild(node);
      
      if (leftChild) queue.push(leftChild);
      if (rightChild) queue.push(rightChild);
    }
    
    return result;
  };