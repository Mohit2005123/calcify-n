"use client"
import React, { useState } from 'react';

export default function ImplicitToExplicitConverter() {
  const [implicitEq, setImplicitEq] = useState('x^2 + y^2 = 1');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const convertToExplicit = () => {
    try {
      // Split the equation into left and right sides
      let [leftSide, rightSide] = implicitEq.split('=').map(side => side.trim());
      
      // If either side is empty, handle the error
      if (!leftSide || !rightSide) {
        throw new Error('Invalid equation format. Please use x and y variables with an equals sign.');
      }

      // Move everything to the left side
      let normalizedEq = `(${leftSide}) - (${rightSide})`;
      
      // Simplify basic arithmetic if possible
      normalizedEq = normalizedEq.replace(/\s+/g, '');

      // Try to identify the type of equation and solve
      let explicitForms = [];

      // Circle: x^2 + y^2 = r^2
      const circleRegex = /^(?:x\^2\+y\^2|y\^2\+x\^2)=(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)-(?:x\^2\+y\^2|y\^2\+x\^2)=0$/;
      const circleMatch = implicitEq.replace(/\s+/g, '').match(circleRegex);
      
      if (circleMatch) {
        const r = Math.sqrt(Number(circleMatch[1] || circleMatch[2]));
        explicitForms.push(`y = √(${r}^2 - x^2)`);
        explicitForms.push(`y = -√(${r}^2 - x^2)`);
        explicitForms.push(`Domain: -${r} ≤ x ≤ ${r}`);
      } 
      // Linear: ax + by = c
      else if (!normalizedEq.includes('^') && 
               normalizedEq.includes('x') && 
               normalizedEq.includes('y')) {
        // Attempt to solve for y
        const terms = normalizedEq.match(/[+-]?\s*\d*\.?\d*[xy]|\d+/g) || [];
        let xCoeff = 0, yCoeff = 0, constant = 0;
        
        terms.forEach(term => {
          if (term.includes('x')) {
            xCoeff += parseFloat(term.replace('x', '') || '1');
          } else if (term.includes('y')) {
            yCoeff += parseFloat(term.replace('y', '') || '1');
          } else {
            constant += parseFloat(term);
          }
        });

        if (yCoeff !== 0) {
          const slope = -xCoeff / yCoeff;
          const yIntercept = -constant / yCoeff;
          explicitForms.push(`y = ${slope === 0 ? '' : `${slope}x`}${yIntercept === 0 ? '' : ` ${yIntercept >= 0 ? '+' : '-'} ${Math.abs(yIntercept)}`}`);
        }
      }
      // Vertical line: x = a
      else if (implicitEq.trim().match(/^x=[-]?\d+(?:\.\d+)?$/)) {
        explicitForms.push(implicitEq.trim());
      }
      // Horizontal line: y = a
      else if (implicitEq.trim().match(/^y=[-]?\d+(?:\.\d+)?$/)) {
        explicitForms.push(implicitEq.trim());
      }
      // Parabola: y = ax^2 + bx + c
      else if (implicitEq.includes('x^2') && !implicitEq.includes('y^2')) {
        // This is a simplified check - would need more robust parsing for all cases
        explicitForms.push(rightSide);
      }
      else {
        explicitForms.push("Cannot convert to explicit form analytically.");
        explicitForms.push("Try graphing the equation to visualize it.");
      }
      
      setResults(explicitForms);
      setError('');
    } catch (e) {
      setError('Error processing equation: ' + e.message);
      setResults([]);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Implicit to Explicit Equation Converter</h1>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Enter implicit equation:
        </label>
        <input
          type="text"
          value={implicitEq}
          onChange={(e) => setImplicitEq(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="e.g., x^2 + y^2 = 1"
        />
      </div>
      
      <button
        onClick={convertToExplicit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Convert to Explicit Form
      </button>
      
      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {results.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Results:</h2>
          {results.map((result, index) => (
            <p key={index} className="mb-1">{result}</p>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Examples of supported equations:</p>
        <ul className="list-disc pl-5">
          <li>Circle: x^2 + y^2 = 1</li>
          <li>Line: 2x + y = 4</li>
          <li>Vertical line: x = 3</li>
          <li>Horizontal line: y = 2</li>
        </ul>
      </div>
    </div>
  );
}