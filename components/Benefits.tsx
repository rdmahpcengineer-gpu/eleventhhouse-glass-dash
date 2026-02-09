
import React from 'react';

const Benefits: React.FC = () => {
  return (
    <section className="py-20 md:py-32">
      {/* High-Impact Showcase Card: Core Mission & Agentic AI */}
      <div className="bg-[#f9fafb] rounded-[3rem] md:rounded-[4.5rem] p-8 md:p-16 lg:p-24 overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="flex flex-col gap-8 z-10">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-black tracking-[0.4em] uppercase text-orange-600">Core Mission</span>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter leading-[0.95]">
                Contact Center <br />
                <span className="text-gray-400">of the Future.</span>
              </h2>
            </div>
            
            <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed max-w-lg">
              EHCX connects your data and utilizes Agentic GenAI to provide 
              a better overall customer experience. A fully managed service 
              designed to accelerate your time-to-market.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <button className="px-10 py-5 bg-black text-white rounded-2xl font-bold text-sm tracking-tighter hover:bg-gray-800 transition-all shadow-xl active:scale-95">
                Deploy Agentic AI
              </button>
              <button className="text-gray-900 font-bold text-sm hover:underline flex items-center gap-2 group">
                View Pillars
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right: Visual Collage (Staggered Grid) */}
          <div className="grid grid-cols-12 gap-4 h-[400px] md:h-[600px] relative">
            <div className="col-span-7 flex flex-col gap-4">
              <div className="h-[60%] rounded-[2rem] overflow-hidden shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-700">
                <img src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=800" alt="AI Agent" className="w-full h-full object-cover" />
              </div>
              <div className="h-[40%] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800" alt="Tech Hub" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="col-span-5 flex flex-col gap-4 pt-12">
              <div className="h-[45%] rounded-[2rem] overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700">
                <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800" alt="Support Team" className="w-full h-full object-cover" />
              </div>
              <div className="h-[55%] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" alt="Collaboration" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
