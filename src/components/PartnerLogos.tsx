
import React from 'react';

const PartnerLogos: React.FC = () => {
  const partners = [
    { name: 'Amazon Web Services', logo: 'https://cdn.worldvectorlogo.com/logos/aws-2.svg' },
    { name: 'Oracle', logo: 'https://cdn.worldvectorlogo.com/logos/oracle-6.svg' },
    { name: 'OpenAI', logo: 'https://cdn.worldvectorlogo.com/logos/openai-2.svg' },
    { name: 'Google Cloud', logo: 'https://cdn.worldvectorlogo.com/logos/google-cloud-1.svg' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
    { name: 'Nvidia', logo: 'https://cdn.worldvectorlogo.com/logos/nvidia.svg' },
    { name: 'Hugging Face', logo: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg' },
  ];

  // Double the partners to create a seamless infinite loop for the marquee
  const displayPartners = [...partners, ...partners];

  return (
    <div className="relative w-full overflow-hidden mask-fade-edges py-4">
      <div className="flex animate-scroll whitespace-nowrap gap-16 md:gap-24 items-center">
        {displayPartners.map((p, index) => (
          <div 
            key={`${p.name}-${index}`} 
            className="flex-shrink-0 flex flex-col items-center gap-2 group transition-all duration-300"
          >
            <img 
              src={p.logo} 
              alt={p.name} 
              className="h-8 md:h-10 w-auto object-contain opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
            />
            <span className="text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 uppercase tracking-widest transition-opacity">
              {p.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerLogos;
