import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="w-full px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-lg sm:rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xs sm:text-sm">EH</span>
            </div>
            <span className="text-lg sm:text-xl font-black tracking-tight">EHCX.ai</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-bold text-gray-600 hover:text-black transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
            <Link
              to="/investor"
              className="px-3 xl:px-4 py-2 text-sm font-bold text-gray-500 hover:text-black border border-gray-200 rounded-full transition-colors whitespace-nowrap"
            >
              Investor Portal
            </Link>
            <Link
              to="/login"
              className="px-4 xl:px-6 py-2.5 text-sm font-bold text-gray-700 hover:text-black transition-colors whitespace-nowrap"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 xl:px-6 py-2.5 bg-black text-white rounded-full text-sm font-bold tracking-wider uppercase hover:bg-gray-800 transition-all shadow-lg whitespace-nowrap"
            >
              Start Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 -mr-2 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 sm:px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-sm font-bold text-gray-600 hover:text-black hover:bg-gray-50 transition-colors py-3 px-3 rounded-lg"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 mt-2 border-t border-gray-100 space-y-2">
              <Link
                to="/investor"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-6 py-3 text-sm font-bold text-gray-500 hover:text-black transition-colors border border-gray-200 rounded-xl"
              >
                Investor Portal
              </Link>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-6 py-3 text-sm font-bold text-gray-700 hover:text-black transition-colors border border-gray-200 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-6 py-3 bg-black text-white rounded-xl text-sm font-bold tracking-wider uppercase hover:bg-gray-800 transition-all"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
