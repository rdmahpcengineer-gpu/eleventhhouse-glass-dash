
import React from 'react';

const BuildWithEHCX: React.FC = () => {
  const advantages = [
    { label: "Rapid Time to Revenue (20 Min CCaaS)", href: "#" },
    { label: "Massive Scalability (50k+ Onboarding)", href: "#" },
    { label: "Streamlined Team Logistics", href: "#" },
    { label: "Secure Single-Tenant Cloud-Agnostic Hosting", href: "#" }
  ];

  return (
    <section className="py-24 md:py-40">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left Side: Bold Title */}
        <div>
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none">
            Scale with <br />
            Eleventh House.
          </h2>
        </div>
        
        {/* Right Side: Description and Link List */}
        <div className="flex flex-col gap-12 max-w-xl">
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            EHCX.ai modernization strategies offer total flexibility for your 
            customer experience infrastructure. Combine our state-of-the-art 
            Experience Automation with your choice of cloud provider 
            and self-hosting benefits.
          </p>
          
          <div className="flex flex-col gap-6">
            {advantages.map((item, i) => (
              <a 
                key={i} 
                href={item.href}
                className="group flex items-center justify-between py-6 border-b border-gray-100 hover:border-black transition-all"
              >
                <span className="text-xl md:text-2xl font-bold text-gray-900 group-hover:pl-2 transition-all duration-300">
                  {item.label}
                </span>
                <span className="transform group-hover:translate-x-3 transition-transform duration-500 text-gray-300 group-hover:text-black">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuildWithEHCX;
