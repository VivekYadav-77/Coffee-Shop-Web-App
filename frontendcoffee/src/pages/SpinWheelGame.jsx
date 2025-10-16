import { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import { motion, AnimatePresence } from "framer-motion";
import { couponsApi } from "../utils/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Ticket, Clock } from "lucide-react";

const wheelData = [
  {
    option: "10% OFF",
    style: { backgroundColor: "#f4c141ff", textColor: "#1F2937" },
  },
  { option: "Try Again 🍀" },
  {
    option: "₹50 OFF",
    style: { backgroundColor: "#34D399", textColor: "#1F2937" },
  },
  { option: "Try Again 🍀" },
  { option: "10% OFF" },
  { option: "Try Again 🍀" },
  {
    option: "FREE COFFEE ☕",
    style: { backgroundColor: "#EF4444", textColor: "white" },
  },
  { option: "Try Again 🍀" },
];

const SpinWheelGame = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [spinError, setSpinError] = useState(null);
  const [timeUntilNextSpin, setTimeUntilNextSpin] = useState(null);

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const calculateTimeRemaining = (lastSpinDate) => {
    if (!lastSpinDate) return null;
    const nextSpinTime = new Date(lastSpinDate).getTime() + 24 * 60 * 60 * 1000;
    const now = new Date().getTime();
    const difference = nextSpinTime - now;

    if (difference <= 0) return null;

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let timer;
    if (user?.lastSpinAt) {
      timer = setInterval(() => {
        const timeRemaining = calculateTimeRemaining(user.lastSpinAt);
        setTimeUntilNextSpin(timeRemaining);
        if (!timeRemaining) clearInterval(timer);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [user?.lastSpinAt]);

  const handleSpinClick = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setResult(null);
    setSpinError(null);
    setLoading(true);
    try {
      const response = await couponsApi.spinWheel();
      const winningPrize = response.prize;
      const winningIndex = wheelData.findIndex((data) =>
        data.option.includes(winningPrize.text)
      );

      setPrizeNumber(winningIndex >= 0 ? winningIndex : 1); // Default to "Try Again" if not found
      setResult(response);
      setMustSpin(true);
    } catch (error) {
      setSpinError(
        error.response?.data?.message || "Spin failed! Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  from-black via-violet-900 to-indigo-900 flex flex-col items-center justify-center text-white p-4 overflow-hidden font-['Bangers'] tracking-wide pt-28">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stars.png')] opacity-10"></div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center"
      >
        <h1 className="text-6xl md:text-8xl font-extrabold mb-3 text-blue-drop-shadow-lg [text-shadow:_5px_1px_9px_rgba(25,255,6754,0.5)] text-orange-700">
          Spin the Cosmic Wheel !
        </h1>
        <p className="text-xl text-red-200 mb-5 italic">
          Unleash your destiny and grab a magical discount on your favourite
          items!🔮
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="relative my-8"
      >
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={wheelData}
          outerBorderColor="#6D28D9"
          outerBorderWidth={10}
          innerBorderColor="#FBBF24"
          innerBorderWidth={0}
          radiusLineColor="#6D28D9"
          radiusLineWidth={2}
          textColors={["#FFFFFF"]}
          backgroundColors={["#8B5CF6", "#EC4899"]}
          fontSize={16}
          onStopSpinning={() => setMustSpin(false)}
        />
        <button
          onClick={handleSpinClick}
          disabled={mustSpin || loading || !!timeUntilNextSpin}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-orange-500 border-4 border-white rounded-full font-bold text-xl text-purple-900 shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:bg-gray-500 z-10"
        >
          {loading ? "..." : "SPIN !"}
        </button>
      </motion.div>

      <AnimatePresence>
        {timeUntilNextSpin && !mustSpin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-blue-800/70 border border-blue-500 p-4 rounded-lg text-center"
          >
            <p className="flex items-center gap-2 text-lg">
              <Clock size={20} /> You can spin again in:{" "}
              <span className="font-mono">{timeUntilNextSpin}</span>
            </p>
          </motion.div>
        )}
        {spinError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 bg-red-800/70 border border-red-500 p-4 rounded-lg text-center"
          >
            <p>{spinError}</p>
          </motion.div>
        )}
        {result && !mustSpin && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-4 bg-gradient-to-r from-purple-700 to-pink-600 p-6 rounded-xl text-center z-10 shadow-2xl"
          >
            <h2 className="text-19xl font-bold text-yellow-500">
              Congratulations !
            </h2>
            <p className="text-lg mt-2">
              The cosmos has chosen:{" "}
              <span className="font-bold">{result.prize.text}</span>
            </p>
            {result.coupon && (
              <p className="text-sm mt-1 flex items-center justify-center gap-2">
                <Ticket size={16} /> Coupon Code:{" "}
                <span className="font-mono bg-purple-900 px-2 py-1 rounded">
                  {result.coupon.code}
                </span>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpinWheelGame;
