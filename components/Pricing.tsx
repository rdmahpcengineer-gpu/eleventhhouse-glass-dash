
import React from 'react';

const Pricing: React.FC = () => {
  return (
    <section className="py-24 md:py-40">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
          <span className="text-xs font-black tracking-[0.5em] uppercase text-orange-500">Value First Pricing</span>
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none mb-4">
            Start Scaling <br />
            <span className="text-gray-400">Without Risk.</span>
          </h2>

          <div className="w-full max-w-2xl bg-[#f8f9fa] rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            {/* Top accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-blue-500 to-emerald-500"></div>
            
            <div className="flex flex-col items-center gap-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Active Beta Program</span>
              </div>
              
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                Enterprise Free Trial
              </h3>
              
              <p className="text-lg text-gray-500 font-medium max-w-md">
                Full access to the EHCX Native AI Engine. <br />
                <span className="text-gray-900 font-bold">No credit card. No setup fees. No strings.</span>
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full mt-4">
                {["24/7 Voice Support", "Multi-Cloud Integration", "Custom AI Workflows"].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 justify-center">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs font-bold text-gray-700">{feat}</span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-6 bg-black text-white rounded-2xl font-black text-lg tracking-tight hover:bg-gray-800 transition-all shadow-xl active:scale-95">
                START YOUR FREE SPRINT
              </button>
              
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Deployment takes ~20 minutes from registration
              </p>
            </div>
          </div>

          <div className="mt-16 max-w-2xl">
            <div className="p-8 rounded-[2rem] bg-gray-50/50 border border-dashed border-gray-200">
              <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed italic">
                "We believe in sharing the burden with our customer. As such, 
                <span className="text-gray-900 font-bold"> pricing comes after </span> 
                we are able to deliver quality service and significantly improve your business outcomes."
              </p>
              <div className="mt-4 flex items-center justify-center gap-4">
                 <div className="h-px w-8 bg-gray-200"></div>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">The EHCX Philosophy</span>
                 <div className="h-px w-8 bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
