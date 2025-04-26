import { useState } from "react";
import { Package, Grid, PieChart } from "lucide-react";

// Updated interfaces to work with string array input
interface InventoryCategoriesProps {
  categories?: string[];
  title?: string;
}

const InventoryCategories: React.FC<InventoryCategoriesProps> = ({
  categories = [],
  title = "INVENTORY CATEGORIES"
}) => {
  // State management
  type VisualizationType = "card" | "circular";
  const [visualizationType, setVisualizationType] = useState<VisualizationType>("card");

  // Transform string array into consistent format with default counts
  const processedCategories = categories.map((category, index) => ({
    id: `cat-${index}`,
    name: category,
    count: 1 // Default count of 1 for each category
  }));

  // Get color based on index for consistent coloring
  const getColor = (index: number): string => {
    const colors = [
      "#8B5CF6", // purple
      "#6D28D9", // purple darker
      "#4C1D95", // purple darkest
      "#9333EA", // purple-600
      "#7E22CE", // purple-700
      "#6B21A8"  // purple-800
    ];
    
    return colors[index % colors.length];
  };

  // Total count is just the number of categories now
  const totalCount = processedCategories.length;

  // Circular Visualization Component
  const CircularVisualization: React.FC = () => {
    // Handle empty categories
    if (processedCategories.length === 0) {
      return (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-400">No categories available</p>
        </div>
      );
    }

    const radius = 40;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;
    
    // Equal segments for visualization
    const segmentLength = circumference / processedCategories.length;
    
    const segments = processedCategories.map((category, index) => {
      const color = getColor(index);
      const offset = index * segmentLength;

      return {
        category,
        color,
        segmentLength,
        offset,
      };
    });

    return (
      <div className="flex flex-col items-center my-4">
        <div className="relative w-32 h-32">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#374151"
              strokeWidth={strokeWidth}
              className="opacity-30"
            />
            {segments.map((segment, index) => (
              <circle
                key={index}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${segment.segmentLength} ${circumference - segment.segmentLength}`}
                strokeDashoffset={-segment.offset}
                transform="rotate(-90 50 50)"
                style={{
                  transition: "stroke-dashoffset 0.5s ease-in-out",
                }}
              />
            ))}
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-current text-white text-lg font-bold"
            >
              {totalCount}
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 w-full">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-800/30 p-2 rounded-lg">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              ></div>
              <div className="flex-1 text-xs font-medium text-white truncate">
                {segment.category.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Card Visualization Component
  const CardVisualization: React.FC = () => {
    // Handle empty categories
    if (processedCategories.length === 0) {
      return (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-400">No categories available</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-2 my-3">
        {processedCategories.map((category, index) => {
          const color = getColor(index);

          return (
            <div
              key={category.id}
              className="relative rounded-lg overflow-hidden bg-gray-800/40 hover:bg-gray-800/60 transition-all flex flex-col justify-between"
              style={{
                boxShadow: `0 0 10px ${color}33`,
              }}
            >
              <div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: color }}
              ></div>
              <div className="p-2">
                <h3 className="font-medium text-white text-sm truncate">
                  {category.name}
                </h3>
              </div>
              <div className="p-2 flex items-end justify-between">
                <div
                  className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                  style={{ backgroundColor: color }}
                >
                  #{index + 1}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-black to-gray-900 rounded-lg shadow-lg p-3 border border-white/10">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-3 border-b border-gray-700/50 pb-2">
        <div className="flex items-center gap-2">
          <Package className="text-indigo-400" size={18} />
          <h3 className="text-base font-semibold text-white">
            {title}
          </h3>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setVisualizationType("card")}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              visualizationType === "card"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                : "bg-gray-800"
            }`}
            title="Card View"
          >
            <Grid size={14} className="text-white" />
          </button>
          <button
            onClick={() => setVisualizationType("circular")}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              visualizationType === "circular"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                : "bg-gray-800"
            }`}
            title="Circular View"
          >
            <PieChart size={14} className="text-white" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="overflow-y-auto max-h-96">
        {visualizationType === "circular" && <CircularVisualization />}
        {visualizationType === "card" && <CardVisualization />}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-gray-800 flex justify-between items-center text-xs text-gray-400">
        <div>
          {processedCategories.length} Categories
        </div>
        <div>
          Total: <span className="font-bold text-white">{totalCount}</span>
        </div>
      </div>
    </div>
  );
};

export default InventoryCategories;

