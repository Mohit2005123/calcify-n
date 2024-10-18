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
    const [arraySize, setArraySize] = useState(20);
    const [arrayRange, setArrayRange] = useState({ min: 1, max: 100 });

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

    const generateRandomArray = () => {
        const newArray = Array.from({ length: arraySize }, () =>
            Math.floor(Math.random() * (arrayRange.max - arrayRange.min + 1)) + arrayRange.min
        );
        setInputArray(newArray.join(', '));
    };

    const buttonStyle = {
        padding: '0.75rem 1rem',
        border: 'none',
        borderRadius: '0.5rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        outline: 'none',
    };

    const primaryButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#3b82f6',
        color: 'white',
        '&:hover': {
            backgroundColor: '#2563eb',
        },
        '&:disabled': {
            backgroundColor: '#93c5fd',
            cursor: 'not-allowed',
        },
    };

    const secondaryButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#f3f4f6',
        color: '#1f2937',
        border: '1px solid #d1d5db',
        '&:hover': {
            backgroundColor: '#e5e7eb',
        },
        '&:disabled': {
            backgroundColor: '#f9fafb',
            color: '#9ca3af',
            cursor: 'not-allowed',
        },
    };

    return (
        <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Algorithm Comparison Visualizer</h1>

            <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Input Array Configuration</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <label style={{ fontWeight: 'bold' }}>Array Size:</label>
                    <input
                        type="number"
                        value={arraySize}
                        onChange={(e) => setArraySize(Math.max(2, parseInt(e.target.value)))}
                        min="2"
                        style={{
                            padding: '0.5rem',
                            border: '1px solid #ccc',
                            borderRadius: '0.25rem',
                            width: '80px',
                        }}
                    />
                    <label style={{ fontWeight: 'bold' }}>Range:</label>
                    <input
                        type="number"
                        value={arrayRange.min}
                        onChange={(e) => setArrayRange({ ...arrayRange, min: parseInt(e.target.value) })}
                        style={{
                            padding: '0.5rem',
                            border: '1px solid #ccc',
                            borderRadius: '0.25rem',
                            width: '80px',
                        }}
                    />
                    <span>to</span>
                    <input
                        type="number"
                        value={arrayRange.max}
                        onChange={(e) => setArrayRange({ ...arrayRange, max: parseInt(e.target.value) })}
                        style={{
                            padding: '0.5rem',
                            border: '1px solid #ccc',
                            borderRadius: '0.25rem',
                            width: '80px',
                        }}
                    />
                    <button
                        onClick={generateRandomArray}
                        disabled={sorting}
                        style={{
                            ...primaryButtonStyle,
                            alignSelf: 'flex-start',
                        }}>
                        Generate Random Array
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <label style={{ fontWeight: 'bold' }}>Current Array:</label>
                    <input
                        type="text"
                        value={inputArray}
                        onChange={handleInputChange}
                        disabled={sorting}
                        style={{
                            padding: '0.5rem',
                            border: '1px solid #ccc',
                            borderRadius: '0.25rem',
                            flex: 1,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    />
                    <button
                        onClick={resetArrays}
                        disabled={sorting}
                        style={{
                            ...secondaryButtonStyle,
                        }}>
                        Reset Array
                    </button>
                </div>
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
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {Object.keys(AVAILABLE_ALGORITHMS).map(key => (
                        <button
                            key={key}
                            onClick={() => handleAlgorithmToggle(key)}
                            style={{
                                ...secondaryButtonStyle,
                                backgroundColor: selectedAlgorithms.includes(key) ? AVAILABLE_ALGORITHMS[key].color : '#f3f4f6',
                                color: selectedAlgorithms.includes(key) ? 'white' : '#1f2937',
                            }}
                            disabled={sorting}
                        >
                            {AVAILABLE_ALGORITHMS[key].name}
                        </button>
                    ))}
                </div>
                <button onClick={toggleView} style={{
                    ...secondaryButtonStyle,
                }}>
                    {showBars ? 'Switch to Grid View' : 'Switch to Bars View'}
                </button>
            </div>

            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                <button
                    onClick={startSort}
                    disabled={sorting && !isPaused}
                    style={{
                        ...primaryButtonStyle,
                        backgroundColor: sorting ? '#f44336' : '#3b82f6',
                        width: '200px',
                    }}>
                    {sorting ? (isPaused ? 'Resume Sorting' : 'Sorting...') : 'Start Sorting'}
                </button>

                {sorting && (
                    <button
                        onClick={togglePause}
                        style={{
                            ...secondaryButtonStyle,
                            width: '200px',
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