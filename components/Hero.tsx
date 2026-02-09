
import React from 'react';
import CardStack from './CardStack';

const Hero: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
      {/* Left Column: Copy */}
      <div className="flex flex-col gap-6 md:gap-8 order-2 lg:order-1">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full w-fit">
            <span className="text-[10px] font-black tracking-widest uppercase text-gray-500">Eleventh House AI Presents</span>
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
          </div>
        </div>

        <h1 className="flex flex-col gap-2 tracking-tighter leading-[0.9]">
          <span className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900">
            EHCX
          </span>
          <span className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-400">
            AI Contact Center That Runs Itself
          </span>
        </h1>

        <div className="space-y-4">
          <p className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            No IT Team Required.
          </p>
          <p className="max-w-xl text-lg text-gray-500 font-medium leading-relaxed">
            EHCX.ai by Eleventh House AI is the world's first self-optimizing contact center. 
            Deploy in minutes, not months. Our AI-human voice engine handles complex queries 
            with zero configuration, letting you scale your global support without a technical army.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-4">
          <button className="px-8 py-4 bg-black text-white rounded-full font-bold text-sm tracking-widest uppercase hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl active:scale-95">
            LAUNCH NOW
          </button>
          <button className="px-8 py-4 bg-gray-100 text-gray-500 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-gray-200 transition-all">
            HOW IT WORKS
          </button>
        </div>
      </div>

      {/* Right Column: Visual Component */}
      <div className="relative order-1 lg:order-2 flex items-center justify-center">
        <CardStack />
      </div>
    </div>
  );
};

export default Hero;
