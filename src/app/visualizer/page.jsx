'use client'; // Add this line to mark the file as a client component

import Link from 'next/link';
import Navbar from '@/components/landingpage/Navbar';
import Footer from '@/components/landingpage/Footer';
import dynamic from 'next/dynamic';

const Visualizer = () => {
  const links = [
    { href: '/visualizer/sorting', label: 'Sorting', iconPath: '/icons/SortingIcon.svg', color: 'emerald' },
    { href: '/visualizer/binarytree', label: 'Binary Tree', iconPath: '/icons/BinaryTreeIcon.svg', color: 'sky' },
    { href: '/visualizer/linkedlist', label: 'Linked List', iconPath: '/icons/LinkedListIcon.svg', color: 'rose' },
    { href: '/visualizer/graph', label: 'Graph', iconPath: '/icons/GraphIcon.svg', color: 'violet' },
    { href: '/visualizer/AVLtree', label: 'AVL Tree', iconPath: '/icons/AVLTreeIcon.svg', color: 'amber' },
    { href: '/visualizer/binarysearchtree', label: 'Binary Search Tree', iconPath: '/icons/BinarySearchTreeIcon.svg', color: 'cyan' },
  ];

  return (
    <>
    <Navbar />
       <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 leading-tight py-2">
          Algorithm Visualizer
        </h1>
        <p className="text-xl text-gray-600">Explore and understand algorithms through interactive visualizations</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl px-4">
        {links.map((link, index) => (
          <Link key={index} href={link.href} passHref>
            <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-200">
              <div className={`absolute inset-0 bg-gradient-to-br from-${link.color}-100 to-${link.color}-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100`}></div>
              <div className="relative p-8">
                <img
                  src={link.iconPath}
                  alt={`${link.label} icon`}
                  className="text-6xl mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
                  style={{ width: '64px', height: '64px' }} // Set a fixed size for the icons
                />
                <h2 className="text-2xl font-bold mb-2 text-gray-800">{link.label}</h2>
                <p className="text-gray-600 text-sm">
                  Visualize and learn about {link.label.toLowerCase()} algorithms
                </p>
              </div>
            </div>
          </Link>
        ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Visualizer;
