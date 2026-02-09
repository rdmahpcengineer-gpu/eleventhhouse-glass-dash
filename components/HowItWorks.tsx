
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const HowItWorks: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState("");

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

  const handleGenerateDemo = async () => {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }

    setIsGenerating(true);
    setStatusText("Initializing Neural Synthesis...");
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const loadingMessages = [
        "Connecting to EHCX Multi-Cloud Nodes...",
        "Simulating Lead Qualification Call...",
        "Rendering Real-time Analytics Dashboard...",
        "Finalizing Cinematic Visualization..."
      ];
      
      let msgIdx = 0;
      const interval = setInterval(() => {
        setStatusText(loadingMessages[msgIdx % loadingMessages.length]);
        msgIdx++;
      }, 4000);

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: 'A sleek, professional futuristic AI contact center dashboard showing vibrant moving audio waveforms, real-time multi-cloud data transcription scrolling, and sentiment heatmaps. Cinematic lighting, 4k, high-tech aesthetic.',
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      clearInterval(interval);
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!response.ok) throw new Error(`Video download failed: ${response.status}`);
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }
    } catch (error: any) {
      console.error("Veo Generation Error:", error);
      const isNotFoundError = error.message?.includes("Requested entity was not found") || 
                           error.status === 404 || 
                           JSON.stringify(error).includes("404");

      if (isNotFoundError) {
        alert("Veo Access Error: Project not found. Ensure you selected a valid paid API key.");
        await (window as any).aistudio.openSelectKey();
      } else {
        alert("Synthesis Interrupted: " + (error.message || "Unknown error occurred."));
      }
    } finally {
      setIsGenerating(false);
      setStatusText("");
    }
  };

  return (
    <section className="py-24 md:py-40 bg-white relative overflow-hidden">
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
            <div className="bg-[#0a0a0a] rounded-[3rem] aspect-video shadow-2xl relative overflow-hidden border border-white/10 group flex items-center justify-center">
              {videoUrl ? (
                <video 
                  src={videoUrl} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover"
                />
              ) : isGenerating ? (
                <div className="flex flex-col items-center gap-6 p-12 text-center">
                  <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="space-y-2">
                    <p className="text-white font-bold text-xl tracking-tight">{statusText}</p>
                    <p className="text-white/40 text-sm italic">Synthesizing cinematic preview...</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-8 text-center p-12">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <svg className="w-10 h-10 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-2xl font-bold text-white tracking-tight">Visualize Your Cloud-Agnostic CX</h4>
                    <p className="text-white/50 max-w-sm mx-auto">Generate a custom AI demo visualization using Veo 3.1. Requires a paid API key.</p>
                  </div>
                  <button 
                    onClick={handleGenerateDemo}
                    className="px-10 py-5 bg-white text-black rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-95"
                  >
                    Generate Live Demo
                  </button>
                  <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-white/30 uppercase tracking-widest hover:text-white/60 transition-colors underline"
                  >
                    Learn about Billing & Keys
                  </a>
                </div>
              )}
            </div>

            <div className="absolute -bottom-6 -right-6 px-6 py-3 bg-white shadow-2xl rounded-2xl border border-gray-100 z-20">
               <span className="text-xs font-black text-gray-900 uppercase tracking-tighter">
                {videoUrl ? "Live Visualization" : "Neural Simulation Ready"}
               </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
