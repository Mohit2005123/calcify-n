"use client";
import Image from "next/image";
import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Explore the World of Math and Science
      </h2>
      <Carousel items={cards} />
    </div>
  );
}
const data = [
  {
    category: "Graphing Calculator",
    title: "Plot and Analyze Mathematical Functions",
    src: "/images/graph.png",
  },
  {
    category: "Sorting Algorithm Visualizer",
    title: "Visualize Sorting Algorithms in Action",
    src: "/images/sorting.png",
  },
  {
    category: "Pathfinding Algorithms",
    title: "Explore Dijkstra, A*, and Other Pathfinding Algorithms",
    src: "/images/pathfinding.png",
  },
  {
    category: "Physics Engine",
    title: "Simulate Physics Interactions and Forces",
    src: "/images/simulation.png",
  },
  {
    category: "Dynamic Programming Visualizer",
    title: "Learn and Visualize Dynamic Programming Solutions",
    src: "/images/dynamic.jpg",
  },
  {
    category: "Graph Algorithms",
    title: "Visualize Graph Algorithms like BFS, DFS, and MST",
    src: "/images/graph-algorithms.png",
  },
];

