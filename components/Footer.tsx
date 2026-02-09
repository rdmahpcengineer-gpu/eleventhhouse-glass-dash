
import React from 'react';

const Footer: React.FC = () => {
  const sections = {
    product: ["Features", "Pricing", "API Docs"],
    company: ["About", "Blog", "Partners"],
    support: ["Help Center", "Status", "Security"]
  };

  return (
    <footer className="bg-white pt-24 pb-12">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="relative w-12 h-12 flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 bg-black group-hover:rotate-45 transition-transform duration-500"></div>
                 <div className="z-10 text-white font-bold text-2xl tracking-tighter">E</div>
              </div>
              <span className="text-2xl font-black tracking-tight text-gray-900">EHCX AI</span>
            </div>
            <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
              Next Gen Contact Center. Built for growth business. Modernize your infrastructure without the legacy overhead.
            </p>
            <div className="flex items-center gap-6">
              {["LinkedIn", "Twitter", "YouTube"].map((social) => (
                <a key={social} href="#" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-3 gap-8">
            {Object.entries(sections).map(([title, links]) => (
              <div key={title} className="flex flex-col gap-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900">{title}</h4>
                <div className="flex flex-col gap-4">
                  {links.map((link) => (
                    <a key={link} href="#" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3 flex flex-col gap-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900">Newsletter</h4>
            <p className="text-sm font-bold text-gray-500">Get growth tips & AI insights</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-gray-50 border border-gray-100 p-4 pr-12 rounded-2xl font-bold text-sm focus:outline-none focus:border-black transition-all"
              />
              <button className="absolute right-2 top-2 w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center hover:bg-orange-500 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            ©2025 EHCX eleventhhouse.ai CX. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors">Privacy Policy</a>
            <a href="#" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
