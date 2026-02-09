import React from 'react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      id: "01",
      title: "Sync Your Stack",
      description: "Link your preferred cloud provider (AWS, GCP, Azure, or Oracle) in one click. No provider lock-in, no stress.",
      color: "bg-orange-500"
    },
    {
      id: "02",
      title: "Architect Your Agent",
      description: "Use our Drag-and-Drop builder to script your AI's personality, goals, and workflows.",
      color: "bg-blue-600"
    },
    {
      id: "03",
      title: "Flip the Switch",
      description: "Launch and watch your dashboard light up as AI begins handling your traffic in real-time.",
      color: "bg-emerald-500"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-40 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 mb-20">
          <span className="text-xs font-black tracking-[0.5em] uppercase text-gray-400">Deployment Logic</span>
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none">
            Go Live in a <br />
            <span className="text-orange-500">3-Step Sprint.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5 flex flex-col gap-16">
            {steps.map((step, i) => (
              <div key={i} className="group relative pl-20">
                {i !== steps.length - 1 && (
                  <div className="absolute left-[2.25rem] top-12 bottom-[-4rem] w-px bg-gray-100 group-hover:bg-gray-900 transition-colors duration-500"></div>
                )}
                <div className={`absolute left-0 top-0 w-16 h-16 rounded-3xl ${step.color} flex items-center justify-center text-white text-2xl font-black shadow-lg transform group-hover:rotate-12 transition-transform duration-500`}>
                  {step.id}
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{step.title}</h3>
                  <p className="text-lg text-gray-500 font-medium leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7 relative">
            <div className="bg-[#0a0a0a] rounded-[3rem] aspect-video shadow-2xl relative overflow-hidden border border-white/10 group">
              <img
                src="/images/feature_dashboard.png"
                alt="EHCX Dashboard Preview"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all group/play">
                  <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </button>
              </div>

              {/* Bottom info bar */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold text-lg">Live Dashboard Demo</h4>
                    <p className="text-white/60 text-sm">Watch EHCX handle real customer interactions</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Live Preview</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 px-6 py-3 bg-white shadow-2xl rounded-2xl border border-gray-100 z-20">
               <span className="text-xs font-black text-gray-900 uppercase tracking-tighter">
                 Real-Time Analytics
               </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
