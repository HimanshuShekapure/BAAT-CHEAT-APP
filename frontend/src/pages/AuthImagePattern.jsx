import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react"; // Chat icon

// Typing animation component
const TypewriterText = ({ text, speed = 40 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index++;
      if (index === text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <p className="font-camellia text-lg text-gray-300 italic max-w-md mx-auto">
      “{displayedText}”
    </p>
  );
};

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="relative w-full h-full hidden lg:flex items-center justify-center bg-[#0f172a] text-white overflow-hidden">
      {/* Background blobs */}
      <div className="absolute w-[600px] h-[600px] bg-purple-600 rounded-full blur-3xl opacity-30 top-[-200px] left-[-150px] animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-pink-500 rounded-full blur-2xl opacity-20 bottom-[-100px] right-[-100px] animate-ping" />

      {/* Floating Chat Icon in center background */}
      <div className="absolute opacity-10 text-white/80 scale-[8] animate-bounce">
        <MessageSquare />
      </div>

      {/* Foreground Content Box */}
      <div className="relative z-10 max-w-xl px-10 py-12 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl text-center space-y-6 transition duration-300 ease-in-out hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold tracking-tight">{title}</h2>
        <TypewriterText text={subtitle} />
      </div>
    </div>
  );
};

export default AuthImagePattern;
