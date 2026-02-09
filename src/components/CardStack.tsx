
import React, { useState } from 'react';

const CardStack: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const cards = [
    {
      id: 1,
      title: "AI Voice Synthesis",
      image: "/images/hero_card_img1.jpg",
      gradient: "from-orange-400 to-rose-500",
      // Arc logic: Leftmost
      default: { rotate: -12, x: 0, y: 0 },
      hovered: { rotate: -35, x: -180, y: 70 },
      zIndex: 40
    },
    {
      id: 2,
      title: "Human-Centric Support",
      image: "/images/hero_card_img2.png",
      gradient: "from-emerald-400 to-teal-500",
      // Arc logic: Inner Left (Highest in the dome)
      default: { rotate: -6, x: 20, y: 40 },
      hovered: { rotate: -12, x: -60, y: -20 },
      zIndex: 30
    },
    {
      id: 3,
      title: "Real-time Dashboards",
      image: "/images/hero_card_img3.png",
      gradient: "from-slate-700 to-slate-900",
      // Arc logic: Inner Right (Highest in the dome)
      default: { rotate: 6, x: 40, y: 80 },
      hovered: { rotate: 12, x: 60, y: -20 },
      zIndex: 20
    },
    {
      id: 4,
      title: "Customer Satisfaction",
      image: "/images/hero_card_img4.png",
      gradient: "from-amber-200 to-amber-400",
      // Arc logic: Rightmost
      default: { rotate: 12, x: 60, y: 120 },
      hovered: { rotate: 35, x: 180, y: 70 },
      zIndex: 10
    }
  ];

  return (
    <div
      className="relative w-full max-w-md h-[500px] md:h-[600px] flex items-start justify-center pt-10 perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {cards.map((card) => {
        const transformStyles = isHovered
          ? `rotate(${card.hovered.rotate}deg) translate(${card.hovered.x}px, ${card.hovered.y}px)`
          : `rotate(${card.default.rotate}deg) translate(${card.default.x}px, ${card.default.y}px)`;

        return (
          <div
            key={card.id}
            className="absolute w-[280px] md:w-[350px] aspect-[1.6/1] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer"
            style={{
              zIndex: card.zIndex,
              transform: transformStyles,
              transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
              boxShadow: isHovered ? '0 30px 60px -12px rgba(0,0,0,0.25)' : '0 10px 30px -5px rgba(0,0,0,0.1)'
            }}
          >
            {/* Card Image and Gradient Overlay */}
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className={`absolute inset-0 bg-gradient-to-tr ${card.gradient} opacity-40 mix-blend-overlay`}></div>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>

              {/* Branding on Card */}
              <div className="absolute bottom-6 left-6 flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-white/50 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-white font-bold text-sm tracking-widest opacity-80 uppercase">EHCX.ai</span>
              </div>

              <div className="absolute top-6 right-6">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-4 h-4 rounded-sm border border-white/50"></div>
                </div>
              </div>

              {/* Title appearing on hover spread */}
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <span className="text-white font-black text-xs md:text-sm tracking-[0.3em] uppercase bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  {card.title}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardStack;
