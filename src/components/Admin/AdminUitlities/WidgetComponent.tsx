import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Circle } from 'lucide-react';

// Define TypeScript interface for component props
interface WidgetComponentProps {
  title: string;
  value: string | number;
  percentage: string | number;
  amount?: boolean;
  color: string;
}

// Define the component with TypeScript typing
const WidgetComponent: React.FC<WidgetComponentProps> = ({
  title,
  value,
  percentage: initialPercentage,
  amount,
  color,
}) => {
  let percentage = initialPercentage;
  const subString = "k";
  
  if (!Number.isInteger(Number(percentage))) {
    const number = Math.round(Number(percentage));
    percentage = `${number}`;
  }
  
  if (+percentage > 10000) {
    percentage = `${9999}`;
  }
  
  if (+percentage < 0 && -10000 > +percentage) {
    percentage = `${-9999}`;
  }

  const isPositive = Math.round(+percentage) > 0;
  const [animate, setAnimate] = useState<boolean>(false);

  useEffect(() => {
    setAnimate(true);
    
    // Add a slight delay to enhance animation effect
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 hover:translate-y-1 hover:shadow-2xl bg-gradient-to-br from-black to-gray-900 border  border-white/50 group">
      {/* Animated glow effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
          filter: 'blur(15px)'
        }}
      ></div>
      
      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col">
            <p className="text-gray-400 font-medium text-sm uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-4xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300">
              {amount ? `₹${value}` : value}
            </h3>
          </div>
          
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-md"></div>
            <Circle 
              size={60}
              className="text-gray-800/50"
              strokeWidth={1}
            />
            <svg className="absolute inset-0" width="60" height="60" viewBox="0 0 60 60">
              <circle
                cx="30"
                cy="30"
                r="24"
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${Math.min(Math.abs(Number(percentage)), 100) * 1.51} 151`}
                strokeDashoffset="0"
                transform="rotate(-90 30 30)"
                className="transition-all duration-1500 ease-out"
                style={{
                  strokeDasharray: animate ? 
                    `${typeof percentage == "string" && percentage.includes(subString)
                      ? Number(+percentage.split("k")[0] / 100) * 151
                      : (Math.min(Math.abs(Number(percentage)), 100) / 100) * 151} 151` 
                    : "0 151",
                  filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.3))'
                }}
              />
            </svg>
            <span className="absolute font-mono font-semibold text-sm text-white">
              {percentage}%
            </span>
          </div>
        </div>
        
        <div className="flex items-center mt-4">
          <div 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              isPositive 
                ? "bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-400 border border-green-500/30" 
                : "bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-400 border border-red-500/30"
            }`}
          >
            {isPositive ? (
              <TrendingUp size={16} className="text-green-400" />
            ) : (
              <TrendingDown size={16} className="text-red-400" />
            )}
            <p className={`${isPositive ? "text-green-400" : "text-red-400"}`}>
              {isPositive ? `+${percentage}` : percentage}%
            </p>
          </div>
          
          {/* Animated progress bar */}
          <div className="ml-4 h-1 flex-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full ${isPositive ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-red-500 to-pink-500"} transition-all duration-1000 ease-out`}
              style={{ 
                width: animate ? `${Math.min(Math.abs(Number(percentage)), 100)}%` : '0%',
                opacity: 0.8
              }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 opacity-5 transform rotate-45">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path 
            fill={color} 
            d="M47.7,-57.2C59.9,-47.3,67,-31.6,70.4,-15.2C73.9,1.2,73.8,18.2,66.6,31.1C59.3,44,45,52.8,30.2,58.4C15.3,64.1,-0.1,66.7,-15.8,63.5C-31.5,60.3,-47.5,51.3,-58.2,37.9C-68.9,24.5,-74.4,6.7,-71.8,-9.4C-69.3,-25.5,-58.8,-39.9,-45.6,-49.9C-32.3,-59.8,-16.2,-65.2,0.4,-65.7C17,-66.1,35.5,-67.1,47.7,-57.2Z" 
            transform="translate(100 100)" 
          />
        </svg>
      </div>
      
      <div className="absolute bottom-0 left-0 h-32 w-32 opacity-10 transform -translate-x-1/2 translate-y-1/4">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path 
            fill={color} 
            d="M41.3,-31.7C50.9,-21.2,54.3,-5.3,50.9,8.2C47.5,21.7,37.3,32.9,24.6,39.6C11.9,46.3,-3.3,48.6,-18.7,44.5C-34.1,40.3,-49.6,29.6,-56.2,13.9C-62.9,-1.9,-60.6,-22.7,-49.9,-33.3C-39.2,-43.9,-19.6,-44.3,-2.2,-42.5C15.1,-40.7,31.7,-42.2,41.3,-31.7Z" 
            transform="translate(100 100)" 
          />
        </svg>
      </div>
    </div>
  );
};

export default WidgetComponent;