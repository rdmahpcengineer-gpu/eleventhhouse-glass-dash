
import React from 'react';

const FloatingAgents: React.FC = () => {
  const agents = [
    { name: "Sarah Connor", status: "AI Voice Engaged", color: "bg-orange-400", img: "https://picsum.photos/id/64/100/100" },
    { name: "James Wilson", status: "IT Support Live", color: "bg-emerald-400", img: "https://picsum.photos/id/65/100/100" },
    { name: "Elena Gilbert", status: "Resolving Ticket #492", color: "bg-blue-400", img: "https://picsum.photos/id/66/100/100" },
    { name: "Marcus Wright", status: "Customer Success", color: "bg-indigo-400", img: "https://picsum.photos/id/67/100/100" },
    { name: "Haleema Antoun", status: "Expert Strategist", color: "bg-teal-400", img: "https://picsum.photos/id/68/100/100" }
  ];

  return (
    <div className="fixed bottom-12 right-12 hidden xl:flex flex-col gap-3 items-end z-20">
      {/* Top larger pill like the orange one in image */}
      <div className="flex items-center gap-3 bg-orange-400/90 text-white backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20 hover:-translate-x-2 transition-transform cursor-pointer">
        <img src={agents[0].img} alt="" className="w-10 h-10 rounded-full border-2 border-white/50" />
        <div className="flex flex-col pr-4">
          <span className="text-xs font-bold leading-none">{agents[0].name}</span>
          <span className="text-[10px] opacity-80">{agents[0].status}</span>
        </div>
      </div>

      <div className="flex gap-3">
        {agents.slice(1, 3).map((agent, i) => (
          <div key={i} className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-gray-100 hover:-translate-y-1 transition-transform cursor-pointer">
            <img src={agent.img} alt="" className="w-8 h-8 rounded-full grayscale hover:grayscale-0 transition-all" />
            <div className="flex flex-col pr-2">
              <span className="text-[10px] font-bold text-gray-800">{agent.name}</span>
              <span className="text-[8px] text-gray-400">{agent.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        {agents.slice(3, 5).map((agent, i) => (
          <div key={i} className={`flex items-center gap-2 ${i === 1 ? 'bg-emerald-500/90 text-white' : 'bg-white/80'} backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-gray-100/20 hover:-translate-y-1 transition-transform cursor-pointer`}>
            <img src={agent.img} alt="" className="w-8 h-8 rounded-full grayscale hover:grayscale-0 transition-all border border-white/20" />
            <div className="flex flex-col pr-2">
              <span className={`text-[10px] font-bold ${i === 1 ? 'text-white' : 'text-gray-800'}`}>{agent.name}</span>
              <span className={`text-[8px] ${i === 1 ? 'text-white/70' : 'text-gray-400'}`}>{agent.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloatingAgents;
