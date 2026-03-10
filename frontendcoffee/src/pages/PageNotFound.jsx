import { motion } from "framer-motion";
import { useNavigate } from "react-router";
const SpaceNotFound = () => {
    const navigate = useNavigate();
  const stars = Array.from({ length: 80 }).map((_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5,
  }));

  return (
    <div className="relative min-h-screen w-full bg-[#05060f] overflow-hidden flex flex-col items-center justify-center text-white font-sans">
      {/* 1. Sparkling Stars Background */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full opacity-0"
          style={{
            width: star.size,
            height: star.size,
            top: star.top,
            left: star.left,
          }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}

      {/* 2. Floating Small Red Planets */}
      <RedPlanet size={40} className="top-[60%] left-[15%] opacity-60" />
      <RedPlanet size={25} className="top-[10%] left-[35%] opacity-40" />
      <RedPlanet size={20} className="bottom-[10%] left-[45%] opacity-30" />
      <RedPlanet size={45} className="bottom-[20%] right-[15%] opacity-70" />

      {/* 3. Rocket with Curvy Cord */}
      <motion.div
        className="absolute top-20 right-[20%] z-20"
        animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Curvy Cord/Trail */}
        <svg
          width="250"
          height="150"
          viewBox="0 0 250 150"
          className="absolute right-10 top-5 -z-10 overflow-visible"
        >
          <motion.path
            d="M 240 20 C 180 100, 100 -20, 0 80"
            stroke="white"
            strokeWidth="1.5"
            fill="transparent"
            strokeDasharray="5 5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />
        </svg>
        {/* Rocket Icon */}
        <div className="relative transform rotate-4">
          <div className="w-10 h-16 bg-gray-400 rounded-t-full relative">
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-6 bg-orange-500 rounded-full blur-[2px] animate-pulse" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1a1c2c] rounded-full border-2 border-gray-500" />
          </div>
          <div className="absolute -left-2 bottom-0 w-4 h-8 bg-gray-500 rounded-l-full" />
          <div className="absolute -right-2 bottom-0 w-4 h-8 bg-gray-500 rounded-r-full" />
        </div>
      </motion.div>

      {/* 4. Main 404 Section */}
      <div className="relative flex flex-col items-center">
        <div className="flex items-center justify-center relative">
          {/* Big "4" */}
          <h1 className="text-[18rem] font-bold text-[#1f232b] leading-none select-none">
            4
          </h1>

          {/* Central Red Planet and Sitting Astronaut */}
          <div className="relative w-64 h-64 -mx-5 z-10">
            {/* The Red Planet */}
            <div className="w-full h-full bg-[#8b1a1a] rounded-full shadow-[inset_-20px_-20px_50px_rgba(0,0,0,0.5)] border-b-4 border-black/20 overflow-hidden relative">
              {/* Craters */}
              <div className="absolute top-8 left-10 w-8 h-8 bg-black/20 rounded-full" />
              <div className="absolute bottom-12 right-12 w-12 h-12 bg-black/20 rounded-full" />
              <div className="absolute top-20 right-8 w-6 h-6 bg-black/20 rounded-full" />
            </div>

            {/* Sitting Astronaut */}
            <motion.div
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-32"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg viewBox="0 0 100 120" fill="none">
                {/* Suit */}
                <rect
                  x="30"
                  y="30"
                  width="40"
                  height="50"
                  rx="15"
                  fill="#e2e8f0"
                />
                {/* Helmet */}
                <rect
                  x="25"
                  y="5"
                  width="50"
                  height="45"
                  rx="20"
                  fill="#e2e8f0"
                  stroke="#1f232b"
                  strokeWidth="2"
                />
                <rect
                  x="32"
                  y="12"
                  width="36"
                  height="25"
                  rx="10"
                  fill="#1a1c2c"
                />
                {/* Sitting Legs */}
                <path
                  d="M 35 80 L 25 105 L 40 105"
                  fill="#e2e8f0"
                  stroke="#1f232b"
                />
                <path
                  d="M 65 80 L 75 105 L 60 105"
                  fill="#e2e8f0"
                  stroke="#1f232b"
                />
                {/* Arms */}
                <path
                  d="M 30 50 L 10 40"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 70 50 L 90 40"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          </div>

          {/* Big "4" */}
          <h1 className="text-[18rem] font-bold text-[#1f232b] leading-none select-none">
            4
          </h1>
        </div>

        {/* 5. Text Content */}
        <div className="-mt-5 text-center z-20">
          <h2 className="text-5xl font-bold tracking-tighter mb-2">OOPS!</h2>
          <p className="text-gray-400 tracking-[0.3em] font-light text-xl">
            PAGE NOT FOUND
          </p>
        </div>

        {/* 6. Action Buttons */}
        <div className="flex gap-4 mt-10 z-20">
          <button onClick={()=>navigate('/')} className="px-8 py-2 border border-white/30 rounded-md text-xs font-bold tracking-widest hover:bg-white hover:text-black transition-all">
            GO HOME
          </button>
          <button onClick={()=>navigate(-1)} className="px-8 py-2 border border-white/30 rounded-md text-xs font-bold tracking-widest hover:bg-white hover:text-black transition-all">
            GO BACK
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper component for scattered planets
const RedPlanet = ({ size, className }) => (
  <div
    className={`absolute rounded-full bg-[#631111] shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.4)] ${className}`}
    style={{ width: size, height: size }}
  >
    <div className="absolute top-1/4 left-1/4 w-[20%] h-[20%] bg-black/20 rounded-full" />
  </div>
);

export default SpaceNotFound;