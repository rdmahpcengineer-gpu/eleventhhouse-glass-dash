
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-md z-50 flex items-center px-6 lg:px-12">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-black group-hover:rotate-45 transition-transform duration-500"></div>
             <div className="z-10 text-white font-bold text-xl tracking-tighter">E</div>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">EHCX.ai</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden sm:block px-6 py-2.5 text-sm font-semibold text-gray-600 hover:text-black transition-colors rounded-full border border-gray-200 hover:border-gray-900">
            Login
          </button>
          <button className="px-6 py-2.5 text-sm font-semibold bg-black text-white hover:bg-gray-800 transition-all rounded-full shadow-lg hover:shadow-xl active:scale-95">
            Register
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
