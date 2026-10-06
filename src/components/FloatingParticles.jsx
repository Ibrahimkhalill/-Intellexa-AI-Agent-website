import { useMemo } from "react";

// Decorative background dots. Positions are generated once so they don't
// jump around every time the parent re-renders (e.g. on each keystroke).
const FloatingParticles = ({ count = 12 }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 3}s`,
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((style, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse"
          style={style}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
