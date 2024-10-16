"use client"
import React, { useState, useEffect, useRef } from 'react';
import { bubbleSort } from '@/components/sortingAlgo/bubbleSort';
import { quickSort } from '@/components/sortingAlgo/quickSort';
import { insertionSort } from '@/components/sortingAlgo/insertionSort';
import { selectionSort } from '@/components/sortingAlgo/selectionSort';
import { mergeSort } from '@/components/sortingAlgo/mergeSort';
import { heapSort } from '@/components/sortingAlgo/heapSort';
import { shellSort } from '@/components/sortingAlgo/shellSort';
import { timSort } from '@/components/sortingAlgo/timSort';
import { radixSort } from '@/components/sortingAlgo/radixSort';
import { bucketSort } from '@/components/sortingAlgo/bucketSort';
const AVAILABLE_ALGORITHMS = {
    bubble: { name: 'Bubble Sort', color: 'rgba(59, 130, 246, 0.8)', borderColor: '#3b82f6' },
    quick: { name: 'Quick Sort', color: 'rgba(236, 72, 153, 0.8)', borderColor: '#ec4899' },
    insertion: { name: 'Insertion Sort', color: 'rgba(16, 185, 129, 0.8)', borderColor: '#10b981' },
    selection: { name: 'Selection Sort', color: 'rgba(245, 158, 11, 0.8)', borderColor: '#f59e0b' },
    merge: { name: 'Merge Sort', color: 'rgba(234, 88, 12, 0.8)', borderColor: '#ea580c' },
    heap: { name: 'Heap Sort', color: 'rgba(37, 99, 235, 0.8)', borderColor: '#2563eb' },
    shell: { name: 'Shell Sort', color: 'rgba(0, 123, 255, 0.8)', borderColor: '#007bff' },
    tim: { name: 'Tim Sort', color: 'rgba(255, 193, 7, 0.8)', borderColor: '#ffc107' },
    radix: { name: 'Radix Sort', color: 'rgba(128, 0, 128, 0.8)', borderColor: '#800080' },
    bucket: { name: 'Bucket Sort', color: 'rgba(255, 105, 180, 0.8)', borderColor: '#ff69b4' }
};
const ALGORITHM_COMPLEXITY = {
    bubble: { time: 'O(n^2)', space: 'O(1)' },
    quick: { time: 'O(n log n)', space: 'O(log n)' },
    insertion: { time: 'O(n^2)', space: 'O(1)' },
    selection: { time: 'O(n^2)', space: 'O(1)' },
    merge: { time: 'O(n log n)', space: 'O(n)' },
    heap: { time: 'O(n log n)', space: 'O(1)' },
    shell: { time: 'O(n^2)', space: 'O(1)' },
    tim: { time: 'O(n log n)', space: 'O(n)' },
    radix: { time: 'O(nk)', space: 'O(n + k)' },
    bucket: { time: 'O(n + k)', space: 'O(n)' }
};
const SortingAlgo = () => {
    const [selectedAlgorithms, setSelectedAlgorithms] = useState(['bubble']);
    const [arrays, setArrays] = useState(() => {
        return { bubble: [5, 35, 20, 80, 50, 90, 10, 60, 45, 70, 25, 15, 85, 30, 55, 95, 40, 75, 65, 100] };
    });
    const [sorting, setSorting] = useState(false);
    const [showBars, setShowBars] = useState(true);
    const [inputArray, setInputArray] = useState(arrays.bubble.join(', '));
    const [sortingSpeed, setSortingSpeed] = useState(50);
    const [isPaused, setIsPaused] = useState(false);
    const pauseRef = useRef(false);

    useEffect(() => {
        const initialArray = inputArray.split(',').map(num => parseInt(num.trim(), 10));
        const newArrays = {};
        selectedAlgorithms.forEach(algo => {
            newArrays[algo] = [...initialArray];
        });
        setArrays(newArrays);
    }, [selectedAlgorithms, inputArray]);

    const handleInputChange = (event) => {
        setInputArray(event.target.value);
    };

    const resetArrays = () => {
        const initialArray = inputArray.split(',').map(num => parseInt(num.trim(), 10));
        const newArrays = {};
        selectedAlgorithms.forEach(algo => {
            newArrays[algo] = [...initialArray];
        });
        setArrays(newArrays);
    };

    const sleep = (ms) => {
        const speed = Math.pow(10, (sortingSpeed - 50) / 25); // Logarithmic scale
        return new Promise(resolve => {
            const checkPause = () => {
                if (pauseRef.current) {
                    setTimeout(checkPause, 100);
                } else {
                    setTimeout(resolve, ms / speed);
                }
            };
            checkPause();
        });
    };

    const startSort = async () => {
        setSorting(true);
        setIsPaused(false);
        pauseRef.current = false;
        try {
            await Promise.all(selectedAlgorithms.map(algo => sortArray(algo)));
        } catch (error) {
            console.error('Sorting error:', error);
        }
        setSorting(false);
    };

    const isArraySorted = (array) => {
        for (let i = 0; i < array.length - 1; i++) {
            if (array[i] > array[i + 1]) {
                return false;
            }
        }
        return true;
    };

    const sortArray = async (algorithmKey) => {
        const currentArray = [...arrays[algorithmKey]];

        if (isArraySorted(currentArray)) {
            console.log(`${algorithmKey} array is already sorted!`);
            return;
        }

        const updateArrayState = (newArray) => {
            setArrays(prev => ({
                ...prev,
                [algorithmKey]: newArray
            }));
        };

        switch (algorithmKey) {
            case 'bubble':
                await bubbleSort(currentArray, updateArrayState, sleep);
                break;
            case 'quick':
                await quickSort(currentArray, 0, currentArray.length - 1, updateArrayState, sleep);
                break;
            case 'insertion':
                await insertionSort(currentArray, updateArrayState, sleep);
                break;
            case 'selection':
                await selectionSort(currentArray, updateArrayState, sleep);
                break;
            case 'merge':
                await mergeSort(currentArray, updateArrayState, sleep);
                break;
            case 'heap':
                await heapSort(currentArray, updateArrayState, sleep);
                break;
            case 'shell':
                await shellSort(currentArray, updateArrayState, sleep);
                break;
            case 'tim':
                await timSort(currentArray, updateArrayState, sleep);
                break;
            case 'radix':
                await radixSort(currentArray, updateArrayState, sleep);
                break;
            case 'bucket':
                await bucketSort(currentArray, updateArrayState, sleep);
                break;
            default:
                console.error('Unknown sorting algorithm');
        }
    };

    const toggleView = () => {
        setShowBars(!showBars);
    };

    const handleAlgorithmToggle = (algorithm) => {
        setSelectedAlgorithms(prev => {
            if (prev.includes(algorithm) && prev.length === 1) {
                return prev;
            }

            if (prev.includes(algorithm)) {
                return prev.filter(a => a !== algorithm);
            }
            return [...prev, algorithm];
        });
    };

    const handleSpeedChange = (event) => {
        setSortingSpeed(parseInt(event.target.value, 10));
    };

    const togglePause = () => {
        setIsPaused(!isPaused);
        pauseRef.current = !pauseRef.current;
    };

    const renderArrayVisualization = (algorithmKey) => {
        const currentArray = arrays[algorithmKey];
        if (!currentArray) return null;

        const algorithmInfo = AVAILABLE_ALGORITHMS[algorithmKey];
        const complexityInfo = ALGORITHM_COMPLEXITY[algorithmKey];

        return (
            <div>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{algorithmInfo.name}</h2>
                <p>Time Complexity: {complexityInfo.time}</p>
                <p>Space Complexity: {complexityInfo.space}</p>
                {showBars ? (
                    <div style={{
                        display: 'flex',
                        height: '10rem',
                        alignItems: 'flex-end',
                    }}>
                        {currentArray.map((value, index) => (
                            <div key={index} style={{
                                flex: 1,
                                backgroundColor: algorithmInfo.color,
                                marginRight: index < currentArray.length - 1 ? '2px' : '0',
                                height: `${value + 5}%`,
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold'
                            }}>
                                {value}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{
                        display: 'flex',
                        border: `2px solid ${algorithmInfo.borderColor}`,
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        height: '4rem',
                    }}>
                        {currentArray.map((value, index) => (
                            <div key={index} style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRight: index < currentArray.length - 1 ? `1px solid ${algorithmInfo.borderColor}` : 'none',
                                backgroundColor: algorithmInfo.color.replace('0.8', value / 100),
                                color: value > 50 ? 'white' : 'black',
                                fontWeight: 'bold'
                            }}>
                                {value}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const getGridStyle = () => {
        const count = selectedAlgorithms.length;
        return {
            display: 'grid',
            gridTemplateColumns: count > 9 ? 'repeat(4, 1fr)' : count > 6 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
            gap: '2rem',
        };
    };
    return (
        <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Algorithm Comparison Visualizer</h1>

            <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Input Array (comma-separated):</label>
                <input
                    type="text"
                    value={inputArray}
                    onChange={handleInputChange}
                    disabled={sorting}
                    style={{
                        padding: '0.5rem',
                        border: '1px solid #ccc',
                        borderRadius: '0.25rem',
                        width: '100%'
                    }}
                />
                <button
                    onClick={resetArrays}
                    disabled={sorting}
                    style={{
                        padding: '0.5rem',
                        border: 'none',
                        borderRadius: '0.25rem',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: sorting ? 'not-allowed' : 'pointer',
                        width: '200px' // Adjust the width here
                    }}>
                    Reset Array
                </button>

            </div>

            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label htmlFor="speed-slider" style={{ fontWeight: 'bold' }}>Sorting Speed:</label>
                <input
                    id="speed-slider"
                    type="range"
                    min="1"
                    max="100"
                    value={sortingSpeed}
                    onChange={handleSpeedChange}
                    disabled={sorting}
                    style={{ flex: 1 }}
                />
                <span>{sortingSpeed}%</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {Object.keys(AVAILABLE_ALGORITHMS).map(key => (
                        <button
                            key={key}
                            onClick={() => handleAlgorithmToggle(key)}
                            style={{
                                padding: '0.5rem',
                                backgroundColor: selectedAlgorithms.includes(key) ? AVAILABLE_ALGORITHMS[key].color : '#ccc',
                                color: 'white',
                                fontWeight: 'bold',
                                border: 'none',
                                borderRadius: '0.25rem',
                                cursor: sorting ? 'not-allowed' : 'pointer'
                            }}
                            disabled={sorting}
                        >
                            {AVAILABLE_ALGORITHMS[key].name}
                        </button>
                    ))}
                </div>
                <button onClick={toggleView} style={{
                    padding: '0.5rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: sorting ? 'not-allowed' : 'pointer'
                }}>
                    {showBars ? 'Switch to Grid View' : 'Switch to Bars View'}
                </button>
            </div>

            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                <button
                    onClick={startSort}
                    disabled={sorting && !isPaused}
                    style={{
                        padding: '1rem',
                        backgroundColor: '#f44336',
                        color: 'white',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: (sorting && !isPaused) ? 'not-allowed' : 'pointer',
                        width: '200px'
                    }}>
                    {sorting ? (isPaused ? 'Resume Sorting' : 'Sorting...') : 'Start Sorting'}
                </button>

                {sorting && (
                    <button
                        onClick={togglePause}
                        style={{
                            padding: '1rem',
                            backgroundColor: '#4caf50',
                            color: 'white',
                            fontWeight: 'bold',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            width: '200px'
                        }}>
                        {isPaused ? 'Resume' : 'Pause'}
                    </button>
                )}
            </div>

            <div style={getGridStyle()}>
                {selectedAlgorithms.map(algorithmKey => (
                    <div key={algorithmKey} style={{
                        border: `2px solid ${AVAILABLE_ALGORITHMS[algorithmKey].borderColor}`,
                        padding: '1rem',
                        borderRadius: '0.25rem'
                    }}>
                        {renderArrayVisualization(algorithmKey)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SortingAlgo;