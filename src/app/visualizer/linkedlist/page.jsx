"use client"
import React, { useState } from 'react';

const LinkedListVisualizer = () => {
  const [nodes, setNodes] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [indexInput, setIndexInput] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());

  class ListNode {
    constructor(value) {
      this.value = value;
      this.id = Math.random().toString(36).substr(2, 9);
    }
  }

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const highlightNodesUntilIndex = async (index) => {
    for (let i = 0; i <= index && i < nodes.length; i++) {
      setHighlightedNodes(prev => new Set([...prev, nodes[i].id]));
      await sleep(500);
    }
    await sleep(500);
    setHighlightedNodes(new Set());
  };

  const addNode = () => {
    if (inputValue.trim() !== '') {
      const newNode = new ListNode(inputValue);
      setNodes(prev => [...prev, newNode]);
      setInputValue('');
    }
  };

  const insertAtIndex = async () => {
    if (inputValue.trim() === '' || indexInput.trim() === '') return;
    
    const index = parseInt(indexInput);
    if (isNaN(index) || index < 0 || index > nodes.length) {
      alert('Please enter a valid index');
      return;
    }

    await highlightNodesUntilIndex(index - 1);
    
    const newNode = new ListNode(inputValue);
    setNodes(prev => [
      ...prev.slice(0, index),
      newNode,
      ...prev.slice(index)
    ]);
    
    setInputValue('');
    setIndexInput('');
  };

  const removeNode = async (id) => {
    const index = nodes.findIndex(node => node.id === id);
    await highlightNodesUntilIndex(index);
    setNodes(nodes.filter(node => node.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Linked List Visualizer
        </h1>
        
        {/* Input Controls */}
        <div className="flex flex-col gap-4 mb-12">
          <div className="flex gap-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="Enter node value"
            />
            <button
              onClick={addNode}
              className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-sm"
            >
              Add to End
            </button>
          </div>
          
          <div className="flex gap-4">
            <input
              type="number"
              value={indexInput}
              onChange={(e) => setIndexInput(e.target.value)}
              className="w-24 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="Index"
              min="0"
              max={nodes.length}
            />
            <button
              onClick={insertAtIndex}
              className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-sm"
            >
              Insert at Index
            </button>
          </div>
        </div>

        {/* Linked List Visualization */}
        <div className="flex items-center overflow-x-auto pb-8 px-4">
          {nodes.map((node, index) => (
            <div key={node.id} className="flex items-center">
              {/* Circular Node */}
              <div className="relative group">
                <div 
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-300 shadow-lg
                    ${highlightedNodes.has(node.id) ? 'bg-yellow-100 border-4 border-yellow-500' : 'bg-white border-4 border-blue-500'}
                    hover:shadow-xl
                  `}
                >
                  <span className="text-lg font-semibold text-gray-700">{node.value}</span>
                </div>
                
                {/* Remove button */}
                <button
                  onClick={() => removeNode(node.id)}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              {/* Arrow */}
              {index < nodes.length - 1 && (
                <div className="w-16 relative mx-2">
                  <div className="h-0.5 bg-blue-500 w-full absolute top-1/2 transform -translate-y-1/2">
                    <div className="absolute right-0 w-3 h-3 border-t-2 border-r-2 border-blue-500 transform rotate-45 translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {nodes.length === 0 && (
          <div className="text-center text-gray-500 mt-8 bg-white p-8 rounded-lg shadow-sm">
            <div className="w-20 h-20 rounded-full border-4 border-gray-200 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl text-gray-300">?</span>
            </div>
            Start by adding some nodes to visualize the linked list!
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Instructions:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Enter a value and click "Add to End" to append a node</li>
            <li>To insert at a specific position, enter both value and index</li>
            <li>Hover over any node to reveal the delete button</li>
            <li>Yellow highlighting shows traversal during insertion at index</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LinkedListVisualizer;