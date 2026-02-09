
import React from 'react';

const ShowcaseSection: React.FC = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="bg-[#111] rounded-[3rem] md:rounded-[4.5rem] p-8 md:p-16 lg:p-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual Side: Interaction Analytics / Data Lake Visual */}
          <div className="order-2 lg:order-1 relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl ring-8 ring-white/5">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=1200" 
                alt="Interaction Analytics" 
                className="w-full h-auto"
              />
            </div>
            {/* Decorative floaters */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/20 blur-[80px] rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 blur-[80px] rounded-full"></div>
          </div>

          {/* Content Side: SMB & Enterprise Focus */}
          <div className="order-1 lg:order-2 flex flex-col gap-8 text-white">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-black tracking-[0.4em] uppercase text-orange-400">Implementation Path</span>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-none">
                Self-Service <br />
                <span className="text-gray-500">at Every Scale.</span>
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center font-bold text-xl">1</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">100% SMB Automation</h4>
                  <p className="text-gray-400 text-sm">Instant purchase and omni-channel deployment in minutes.</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-gray-700 flex items-center justify-center font-bold text-xl">2</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Enterprise CCaaS Migration</h4>
                  <p className="text-gray-400 text-sm">Structured paths for complex legacy infrastructure transformation.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button className="w-full md:w-auto px-10 py-5 bg-white text-black rounded-2xl font-bold text-sm tracking-widest uppercase hover:bg-gray-100 transition-all shadow-xl">
                START SELF-PROVISIONING
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
