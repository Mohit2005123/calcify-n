"use client";

import React from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    (<div
      className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
    </div>)
  );
}

const testimonials = [
  {
    quote:
      "Explore complex mathematical functions with our intuitive graphing calculator, designed for students and professionals alike.",
    name: "Graphing Calculator",
    title: "Feature Highlight",
  },
  {
    quote:
      "Visualize algorithms in action and understand their inner workings with our interactive algorithm visualizer.",
    name: "Algorithm Visualizer",
    title: "Feature Highlight",
  },
  {
    quote: "Stay tuned for more exciting features that will enhance your learning and productivity.",
    name: "Coming Soon",
    title: "Feature Teaser",
  },
  {
    quote:
      "Our platform is built to support a wide range of educational tools, from basic arithmetic to advanced computational models.",
    name: "Educational Tools",
    title: "Feature Overview",
  },
  {
    quote:
      "Join our community of learners and educators to share insights and collaborate on projects.",
    name: "Community",
    title: "Engagement",
  },
  {
    quote:
      "Access a library of pre-built templates and examples to kickstart your projects and learning.",
    name: "Template Library",
    title: "Resource Hub",
  },
  {
    quote:
      "Track your progress with personalized dashboards and analytics, helping you stay on top of your learning goals.",
    name: "Progress Tracking",
    title: "Personalized Learning",
  },
  {
    quote:
      "Collaborate in real-time with peers and mentors using our integrated communication tools.",
    name: "Real-Time Collaboration",
    title: "Interactive Learning",
  },
  {
    quote:
      "Enhance your understanding with step-by-step tutorials and guided exercises.",
    name: "Guided Learning",
    title: "Tutorials & Exercises",
  },
  {
    quote:
      "Experience seamless integration with other educational platforms and tools.",
    name: "Platform Integration",
    title: "Seamless Experience",
  },
];
