
import React, { useState } from 'react';

interface FAQItem {
  q: string;
  a: string;
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const questions: FAQItem[] = [
    {
      q: "Do I need a Cloud expert?",
      a: "Nope. We’re your outsourced DevOps team. We handle the multi-cloud architecture; you handle the wins."
    },
    {
      q: "How fast is 'Fast'?",
      a: "Our record is 18 minutes. Most teams are live and taking calls before lunch."
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes. We believe in earning your business every month. No long-term contracts, no traps."
    },
    {
      q: "What happens during a call spike?",
      a: "Our infrastructure breathes with your business. It scales up instantly to handle the load and scales down to save you money."
    }
  ];

  return (
    <section className="py-24 md:py-40 bg-gray-50/50 rounded-[3rem] md:rounded-[4.5rem] my-12 border border-gray-100">
      <div className="container mx-auto px-8 md:px-16">
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-black tracking-[0.4em] uppercase text-orange-500 mb-4 block">Intelligence & Operations</span>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-tight">
            Your Questions, <br />
            <span className="text-gray-400">Answered.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            {questions.map((item, i) => (
              <div 
                key={i} 
                className={`p-8 rounded-3xl border transition-all duration-300 cursor-pointer ${openIndex === i ? 'bg-white border-orange-500 shadow-xl' : 'bg-white/50 border-gray-100 hover:border-gray-300'}`}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">{item.q}</h4>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${openIndex === i ? 'rotate-180 bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {openIndex === i && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-gray-500 font-medium leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="hidden lg:block relative p-12 bg-black rounded-[3rem] overflow-hidden text-white h-full min-h-[400px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[100px] rounded-full"></div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase text-orange-500 mb-6 block">Direct Line</span>
                <h3 className="text-3xl font-black tracking-tighter mb-4">Still Curious?</h3>
                <p className="text-white/50 font-medium">Our AI-human hybrids are ready to chat. Get a personalized tour of the EHCX Multi-Cloud infrastructure today.</p>
              </div>
              <button className="mt-8 px-8 py-4 bg-white text-black rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-orange-500 hover:text-white transition-all">
                BOOK STRATEGY SESSION
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
