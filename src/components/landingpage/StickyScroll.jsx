"use client";
import React from "react";
import { StickyScroll } from "../ui/sticky-scroll-reveal";
import Image from "next/image";

const content = [
  {
    title: "Graphing Calculator",
    description:
      "Visualize complex equations and functions with ease. Our graphing calculator allows you to plot graphs in real time, providing a powerful tool for both students and professionals. Enhance your understanding of mathematical concepts with interactive visualizations.",
    content: (
      <div
        className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Graphing Calculator
      </div>
    ),
  },
  {
    title: "Algorithm Visualizer",
    description:
      "Understand algorithms like never before. Our visualizer breaks down complex algorithms into easy-to-follow steps, helping you grasp the logic and flow of each process. Perfect for learning and teaching computer science concepts.",
    content: (
      <div
        className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
        Algorithm Visualizer
      </div>
    ),
  },
  {
    title: "Physics Engine",
    description:
      "Coming soon: Experience the power of physics simulations. Our upcoming physics engine will allow you to simulate real-world scenarios, providing an interactive way to explore the laws of physics. Stay tuned for this exciting feature!",
    content: (
      <div
        className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
        Physics Engine
      </div>
    ),
  },
  {
    title: "More Features Coming Soon",
    description:
      "We are constantly working to bring you more features. Stay tuned for updates as we continue to expand our platform with new tools and capabilities to enhance your learning and productivity.",
    content: (
      <div
        className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        More Features Coming Soon
      </div>
    ),
  },
];
export function StickyScrollRevealDemo() {
  return (
    (<div className="p-10">
      <StickyScroll content={content} />
    </div>)
  );
}
