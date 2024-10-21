'use client'
import React from 'react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Menu, X, Calculator, Home, Info, Activity } from 'lucide-react'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/visualizer', label: 'Visualizer', icon: Activity },
    { href: '/graphingCalculator', label: 'Graphing Calculator', icon: Calculator },
    { href: '/about', label: 'About', icon: Info },
  ]

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 bg-white ${
      scrolled 
        ? 'backdrop-blur-md border-b border-gray-200 shadow-sm' 
        : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              {/* Logo Component */}
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:ml-10 lg:flex lg:items-center lg:space-x-1">
              <NavigationMenu>
                <NavigationMenuList>
                  {navItems.map((item) => (
                    <NavigationMenuItem key={item.href}>
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50">
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <Button variant="ghost">Sign In</Button>
            <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-700"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50 bg-white transition-opacity duration-300">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-indigo-600">Calcify</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto py-6 px-4">
                <div className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-2 px-4 py-3 text-lg font-medium text-gray-900 rounded-lg hover:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <div className="pt-6 space-y-4">
                    <Button variant="outline" className="w-full">Sign In</Button>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Get Started</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

// Example of a Logo component
const Logo = () => (
  <div className="relative w-8 h-8">
    <div className="absolute inset-0 bg-indigo-600 rounded-lg transform rotate-6"></div>
    <div className="absolute inset-0 bg-indigo-500 rounded-lg transform -rotate-3"></div>
    <span className="relative flex items-center justify-center h-full text-white font-bold">C</span>
  </div>
)

export default Navbar
