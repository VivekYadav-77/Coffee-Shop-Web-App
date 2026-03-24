import { useEffect, useState } from "react";

const scenes = [
  {
    title: "1. Order Placed",
    subtitle: "User sending request to The Roasting House...",
    bgColor: "from-sky-900/40 to-black",
  },
  {
    title: "2. Verifying & Preparing",
    subtitle: "The Roasting House is crafting your order...",
    bgColor: "from-pink-900/40 to-black",
  },
  {
    title: "3. Out for Delivery",
    subtitle: "Your treats are on the move!",
    bgColor: "from-sky-900/40 via-pink-900/20 to-black",
  },
  {
    title: "4. Enjoy Your Morning",
    subtitle: "Fresh coffee, donuts, and the daily news.",
    bgColor: "from-black via-white/10 to-black",
  }
];

const StoryboardLoader = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [startProgress, setStartProgress] = useState(false);

  // Start the 50-second global progress bar
  useEffect(() => {
    setTimeout(() => setStartProgress(true), 100);
  }, []);

  // Advance the storyline every 12.5 seconds (50s total / 4 scenes)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScene((prev) => Math.min(prev + 1, scenes.length - 1));
    }, 12500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden font-sans transition-colors duration-1000 bg-gradient-to-br ${scenes[currentScene].bgColor} bg-black`}>
      
      {/* GLOBAL BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-screen"></div>

      {/* HEADER: Persistent Branding */}
      <div className="z-10 w-full max-w-4xl flex justify-between items-center opacity-80 mt-4">
        <div className="flex flex-col">
          <span className="text-sm font-black tracking-widest text-white/50 uppercase">The</span>
          <span className="text-xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-pink-300">
            ROASTING HOUSE
          </span>
        </div>
        <div className="text-sky-300 font-mono text-xs sm:text-sm font-bold flex items-center gap-2 bg-sky-900/30 px-3 py-1.5 rounded-full border border-sky-400/20">
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping"></span>
          SERVER WAKING UP
        </div>
      </div>

      {/* CENTER: The Active Scene */}
      <div className="flex-1 flex flex-col items-center justify-center w-full z-10 mt-8">
        
        {/* Dynamic Scene Visuals Container */}
        <div className="relative w-60 h-60 sm:w-72 sm:h-72 flex items-center justify-center mb-8">
          
          {/* Background Glow Rings (Always visible) */}
          <div className="absolute inset-0 border-[1px] border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-4 border-[1px] border-dashed border-sky-300/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
          
          {/* SCENE 0: User & Phone */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${currentScene === 0 ? 'scale-100 opacity-100 z-20' : 'scale-50 opacity-0 z-0'}`}>
            <div className="relative flex items-center justify-center w-full h-full">
               <div className="text-7xl sm:text-8xl drop-shadow-[0_0_30px_rgba(255,182,193,0.5)] z-10">👤</div>
               <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 text-5xl sm:text-6xl animate-bounce drop-shadow-[0_0_30px_rgba(135,206,235,0.8)] z-20">📱</div>
               <div className="absolute top-1/4 right-1/4 text-sky-300 animate-ping font-black text-2xl">)))</div>
            </div>
          </div>

          {/* SCENE 1: The Store (SVG LOGO) */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${currentScene === 1 ? 'scale-100 opacity-100 z-20' : 'scale-50 opacity-0 z-0'}`}>
             <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
                <div className="absolute inset-0 bg-pink-500/30 blur-3xl rounded-full animate-pulse" />
                
                <div className="absolute -top-4 -right-4 text-3xl animate-[spin_4s_linear_infinite] opacity-70">⚙️</div>
                <div className="absolute -bottom-2 -left-2 text-2xl animate-[spin_3s_linear_infinite_reverse] opacity-70">⚙️</div>

                {/* THE ACTUAL LOGO */}
                <svg version="1.1" viewBox="0 0 512 512" className="w-full h-full relative z-10 animate-pulse drop-shadow-[0_0_20px_rgba(255,182,193,0.5)] bg-white/5 rounded-full p-2 backdrop-blur-sm">
                  <path style={{fill:'#521F0E'}} d="M509.571,220.737C492.388,96.041,385.419,0,256,0C114.615,0,0,114.616,0,256 c0,113.387,73.722,209.54,175.843,243.182L509.571,220.737z"></path>
                  <path style={{fill:'#220D06'}} d="M512,256c0-11.966-0.84-23.735-2.429-35.263L400.696,111.861L74.199,196.297l1.036,85.198 l84.321,84.321L55.652,378.991l120.191,120.191C201.06,507.49,228.001,512,256,512C397.384,512,512,397.384,512,256z"></path>
                  <polygon style={{fill:'#FFE376'}} points="422.957,378.991 400.696,417.948 256,417.948 234.296,367.861 "></polygon>
                  <polygon style={{fill:'#FFF3AD'}} points="111.304,417.948 256,417.948 256,367.861 89.043,378.991 "></polygon>
                  <path style={{fill:'#FFFFFF'}} d="M222.609,301.078H122.435c-36.824,0-66.783-29.959-66.783-66.783s29.959-66.783,66.783-66.783 h100.174v22.261H122.435c-24.549,0-44.522,19.972-44.522,44.522s19.972,44.522,44.522,44.522h100.174V301.078z"></path>
                  <path style={{fill:'#FFF3AD'}} d="M400.696,111.861H256l-33.391,267.13l122.435-22.261 C345.043,266.768,400.696,201.824,400.696,111.861z"></path>
                  <path style={{fill:'#FFFFFF'}} d="M111.304,111.861H256v267.13l-89.043-22.261C166.957,266.768,111.304,201.824,111.304,111.861z"></path>
                  <polygon style={{fill:'#FFD23E'}} points="456.348,356.73 456.348,378.991 256,378.991 245.009,367.861 256,356.73 "></polygon>
                  <rect x="55.652" y="356.73" style={{fill:'#FFE376'}} width="200.348" height="22.261"></rect>
                  <path style={{fill:'#692811'}} d="M200.904,111.861l176.295,22.261c-3.539,32.145-14.158,61.696-25.277,92.65 c-12.099,33.67-24.543,68.307-28.127,107.698H256L200.904,111.861z"></path>
                  <path style={{fill:'#813115'}} d="M256,111.861V334.47h-67.795c-3.584-39.391-16.028-74.029-28.127-107.698 c-11.119-30.954-21.738-60.505-25.277-92.65L256,111.861z"></path>
                  <polygon style={{fill:'#B78456'}} points="377.199,111.861 377.199,134.122 256,134.122 233.739,89.6 "></polygon>
                  <g>
                    <polygon style={{fill:'#C9A06C'}} points="134.801,111.861 256,89.6 256,134.122 134.801,134.122 "></polygon>
                    <path style={{fill:'#C9A06C'}} d="M377.199,111.861H256L233.739,89.6L256,67.339h76.678 C357.165,67.339,377.199,87.374,377.199,111.861z"></path>
                  </g>
                  <path style={{fill:'#DBBC82'}} d="M256,67.339v44.522H134.801c0-24.487,20.035-44.522,44.522-44.522H256z"></path>
                </svg>
             </div>
          </div>

          {/* SCENE 2: Delivery */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${currentScene === 2 ? 'scale-100 opacity-100 z-20' : 'scale-50 opacity-0 z-0 -translate-x-20'}`}>
            <div className="relative">
              <div className="text-7xl sm:text-8xl animate-[drive_2s_ease-in-out_infinite_alternate] drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] z-10">🛵</div>
              <div className="absolute top-8 -left-12 w-8 h-1.5 bg-sky-300/50 rounded-full animate-pulse"></div>
              <div className="absolute top-14 -left-16 w-12 h-1.5 bg-pink-300/50 rounded-full animate-pulse delay-75"></div>
            </div>
          </div>

          {/* SCENE 3: Enjoying */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${currentScene === 3 ? 'scale-100 opacity-100 z-20' : 'scale-75 opacity-0 z-0 translate-y-10'}`}>
            <div className="relative flex items-center justify-center w-full h-full">
              <div className="text-7xl sm:text-8xl drop-shadow-[0_0_40px_rgba(135,206,235,0.4)] z-10">🗞️</div>
              <div className="absolute -left-4 bottom-6 sm:bottom-10 text-5xl sm:text-6xl animate-bounce z-20 drop-shadow-xl">🍩</div>
              <div className="absolute -right-4 top-6 sm:top-10 text-5xl sm:text-6xl animate-[float_3s_ease-in-out_infinite] z-20 drop-shadow-xl">☕</div>
            </div>
          </div>

        </div>

        {/* Text Storytelling */}
        <div className="text-center h-24">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2 drop-shadow-lg">
            {scenes[currentScene].title}
          </h2>
          <p className="text-sm sm:text-lg text-sky-200/80 font-medium px-4">
            {scenes[currentScene].subtitle}
          </p>
        </div>

        {/* Scene Progress Indicators */}
        <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-8">
          {scenes.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${currentScene >= i ? 'w-8 sm:w-10 bg-sky-400 shadow-[0_0_12px_#87CEEB]' : 'w-3 sm:w-4 bg-white/20'}`}
            />
          ))}
        </div>
      </div>

      {/* ========================================= */}
      {/* NEW: THE "WHY THE WAIT?" EXPLANATION BANNER */}
      {/* ========================================= */}
      <div className="z-20 w-full max-w-2xl mt-8 mb-6">
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex items-start gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <div className="text-3xl animate-pulse drop-shadow-md">💡</div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-sm sm:text-base tracking-wide flex items-center gap-2">
              Waking up the digital barista... 
            </h3>
            <p className="text-white/60 text-xs sm:text-sm mt-1.5 leading-relaxed">
              To keep things eco-friendly (and our coffee affordable), our servers take a quick nap when it's quiet. 
              It takes about <strong className="text-white font-bold">50 seconds</strong> to get the machines running on your first visit. Enjoy the story while we brew!
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER: Global Progress Bar */}
      <div className="z-10 w-full max-w-2xl space-y-2 sm:space-y-3 mb-2 sm:mb-4">
        <div className="flex justify-between text-[10px] sm:text-xs font-mono font-bold text-white/50 px-1 uppercase tracking-widest">
          <span>Server Booting</span>
          <span>Ready</span>
        </div>
        
        <div className="w-full h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden relative border border-white/5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-sky-400 via-pink-400 to-white relative"
            style={{
              width: startProgress ? "100%" : "0%",
              transition: "width 50s cubic-bezier(0.1, 0.5, 0.8, 1)",
            }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/80 to-transparent animate-[shimmer_2s_infinite] -translate-x-full" />
          </div>
        </div>
      </div>

      {/* Custom Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes drive {
          0% { transform: translateX(-20px) rotate(-5deg); }
          100% { transform: translateX(20px) rotate(5deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export default StoryboardLoader;