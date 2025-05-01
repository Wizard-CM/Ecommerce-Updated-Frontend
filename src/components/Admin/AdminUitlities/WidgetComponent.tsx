import React from 'react';
import { 
  BarChart3, 
  Activity, 
  Zap, 
  Award, 
  TrendingUp, 
  Hexagon, 
  Circle, 
  Triangle, 
  Square,
  Diamond,
  PieChart,
  ArrowLeftRight, 
  Package, 
  Users, 
  DollarSign,
  Repeat,
  ShoppingBag,
  User,
} from 'lucide-react';


// TypeScript interface for the Widget component props
interface WidgetProps {
  title: string;
  value: number;
  color: string;
  icon?: string;
}

const WidgetComponent: React.FC<WidgetProps> = ({ 
  title, 
  value, 
  color,
  icon = "chart"
}) => {
  // Determine color classes based on prop
  const colorClasses: Record<string, string> = {
    purple: "from-purple-500 to-indigo-600",
    blue: "from-blue-500 to-indigo-600",
    red: "from-red-500 to-orange-600",
    green: "from-green-500 to-emerald-600",
    orange: "from-orange-500 to-amber-600",
    default: "from-indigo-600 to-purple-600"
  };
  
  const gradientClass = colorClasses[color] || colorClasses.default;
  
  // Format the value with commas for thousands
  const formattedValue = new Intl.NumberFormat().format(value);
  
  // Determine which icon to display
  const renderIcon = () => {
    switch (icon) {
      case "user":
        return <Users size={22} className="text-white" />;
      case "revenue":
        return <DollarSign size={22} className="text-white" />;
      case "transaction":
        return <ArrowLeftRight size={22} className="text-white" />;
      default:
        return <Package size={22} className="text-white" />;
    }
  };

  // Render decorative shapes based on color
  const renderDecorativeShapes = () => {
    switch (color) {
      case "purple":
        return (
          <>
            <Circle size={12} className="text-purple-500/30" />
            <Diamond size={14} className="text-indigo-600/30" />
            <Hexagon size={16} className="text-purple-400/30" />
          </>
        );
      case "blue":
        return (
          <>
            <Square size={12} className="text-blue-500/30" />
            <Circle size={14} className="text-indigo-600/30" />
            <Diamond size={16} className="text-blue-400/30" />
          </>
        );
      case "green":
        return (
          <>
            <Triangle size={12} className="text-green-500/30" />
            <Hexagon size={14} className="text-emerald-600/30" />
            <Circle size={16} className="text-green-400/30" />
          </>
        );
      case "red":
        return (
          <>
            <Diamond size={12} className="text-red-500/30" />
            <Square size={14} className="text-orange-600/30" />
            <Triangle size={16} className="text-red-400/30" />
          </>
        );
      case "orange":
        return (
          <>
            <Square size={12} className="text-orange-500/30" />
            <Circle size={14} className="text-amber-600/30" />
            <Hexagon size={16} className="text-orange-400/30" />
          </>
        );
      default:
        return (
          <>
            <Circle size={12} className="text-indigo-500/30" />
            <Hexagon size={14} className="text-purple-600/30" />
            <Diamond size={16} className="text-indigo-400/30" />
          </>
        );
    }
  };
  
  return (
    <div className="w-full max-w-sm">
      <div className="relative bg-gradient-to-br from-black to-gray-900 rounded-xl shadow-xl overflow-hidden">
        {/* Gradient border */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/10 to-indigo-600/20"></div>
        
        {/* Decorative SVG background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" className="absolute">
            <pattern id={`grid-${color}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className={`text-${color}-500`} />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill={`url(#grid-${color})`} />
          </svg>
        </div>
        
        {/* Main content */}
        <div className="relative z-10 p-6">
          {/* Header with icon */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${gradientClass} shadow-lg mr-3 ring-1 ring-gray-800`}>
                {renderIcon()}
              </div>
              <h3 className="text-lg font-medium text-white tracking-wide">{title}</h3>
            </div>
            
            {/* Decorative shapes */}
            <div className="flex space-x-2">
              {renderDecorativeShapes()}
            </div>
          </div>
          
          {/* Value display */}
          <div className="mb-5">
            <div className="relative">
              <h2 className="text-4xl font-bold text-white tracking-tight">
                {formattedValue}
              </h2>
              <div className={`absolute -bottom-2 left-0 h-1 w-12 bg-gradient-to-r ${gradientClass} rounded-full`}></div>
            </div>
          </div>
          
          {/* Custom SVG element based on color */}
          <div className="relative h-12 w-full mt-4">
            <svg 
              viewBox="0 0 200 40" 
              className="w-full h-full" 
              preserveAspectRatio="none"
            >
              {/* Dynamic background line */}
              <path 
                d="M0,20 Q50,30 100,20 Q150,10 200,20" 
                stroke="rgba(75, 85, 99, 0.3)" 
                strokeWidth="1.5" 
                fill="none" 
              />
              
              {/* Colored line */}
              <path 
                d="M0,20 Q50,30 100,20 Q150,10 200,20" 
                stroke={`url(#line-gradient-${color})`} 
                strokeWidth="2.5" 
                fill="none" 
                strokeLinecap="round" 
              />
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id={`line-gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor: color === 'purple' ? '#a855f7' : 
                                            color === 'blue' ? '#3b82f6' : 
                                            color === 'green' ? '#10b981' : 
                                            color === 'red' ? '#ef4444' : 
                                            color === 'orange' ? '#f97316' : '#6366f1'}} />
                  <stop offset="100%" style={{stopColor: color === 'purple' ? '#4f46e5' : 
                                             color === 'blue' ? '#4f46e5' : 
                                             color === 'green' ? '#10b981' : 
                                             color === 'red' ? '#f97316' : 
                                             color === 'orange' ? '#f59e0b' : '#a855f7'}} />
                </linearGradient>
              </defs>
              
              {/* Data points */}
              <circle cx="0" cy="20" r="3" fill="rgba(255, 255, 255, 0.7)" />
              <circle cx="50" cy="30" r="3" fill="rgba(255, 255, 255, 0.7)" />
              <circle cx="100" cy="20" r="3" fill="rgba(255, 255, 255, 0.7)" />
              <circle cx="150" cy="10" r="3" fill="rgba(255, 255, 255, 0.7)" />
              <circle cx="200" cy="20" r="3" fill="rgba(255, 255, 255, 0.7)" />
            </svg>
          </div>
          
        </div>
      </div>
    </div>
  );
};


export default WidgetComponent;