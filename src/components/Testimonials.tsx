
import React from 'react';

const Testimonials: React.FC = () => {
  const quotes = [
    {
      quote: "This platform turned our cost center into a profit center. Our AI agents now handle 60% of sales inquiries before a human even picks up.",
      author: "Maria Chen",
      role: "CEO of TechGrow Inc.",
      company: "45% Revenue Growth",
      color: "border-orange-500"
    },
    {
      quote: "We went live in under 20 minutes. The automated CloudOps means we never worry about downtime during our peak season.",
      author: "David Rodriguez",
      role: "COO of Summit Retail",
      company: "300% Holiday Volume Increase",
      color: "border-blue-500"
    }
  ];

  return (
    <section className="py-24 md:py-40 bg-[#0a0a0a] rounded-[3rem] md:rounded-[4.5rem] my-12 overflow-hidden relative">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 blur-[120px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-8 md:px-16 relative z-10">
        <div className="max-w-3xl mb-20">
          <span className="text-xs font-black tracking-[0.4em] uppercase text-orange-400 mb-4 block">Proven Performance</span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
            Hear From SMBs Who <br />
            <span className="text-gray-500">Out-Performed the Giants.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {quotes.map((item, i) => (
            <div 
              key={i} 
              className={`p-10 md:p-14 bg-white/5 border-l-4 ${item.color} backdrop-blur-sm rounded-r-[2rem] flex flex-col justify-between group hover:bg-white/10 transition-all duration-500`}
            >
              <div className="mb-8">
                <svg className="w-12 h-12 text-white/10 mb-6" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8v8h6c0 4.411-3.589 8-8 8v4c6.617 0 12-5.383 12-12v-8h-10zM22 8v8h6c0 4.411-3.589 8-8 8v4c6.617 0 12-5.383 12-12v-8h-10z"></path>
                </svg>
                <p className="text-xl md:text-2xl font-medium text-white/90 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-8 border-t border-white/5">
                <div>
                  <h4 className="text-lg font-bold text-white">{item.author}</h4>
                  <p className="text-sm text-white/40 font-bold uppercase tracking-widest">{item.role}</p>
                </div>
                <div className={`px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-black tracking-tighter ${item.color.replace('border-', 'text-')} whitespace-nowrap`}>
                  {item.company}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex -space-x-4">
               {[1,2,3,4,5].map(n => (
                 <img key={n} src={`https://picsum.photos/id/${60+n}/100/100`} className="w-12 h-12 rounded-full border-2 border-[#0a0a0a]" alt="User" />
               ))}
               <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-[10px] font-black text-white border-2 border-[#0a0a0a]">
                  +200
               </div>
            </div>
            <p className="text-white/40 font-bold text-sm tracking-widest uppercase">
              Join 500+ SMBs building the future of CX
            </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
