import { useState } from "react";
import { Package, Grid, PieChart, List } from "lucide-react";

// Define TypeScript interfaces for our data
interface CategoryData {
  [key: string]: number; // Maps category names to percentage values
}

interface InventoryPanelProps {
  categoryArray: string[]; // Array of category names
  categoryData: CategoryData; // Object mapping category names to percentages
}

interface CategoryComponentProps {
  title: string;
  color: string;
  percentage: number;
}

interface SegmentData {
  category: string;
  percentage: number;
  color: string;
  segmentLength: number;
  offset: number;
}

// Hex Grid Visualization Component
const HexGridVisualization: React.FC<InventoryPanelProps> = ({
  categoryArray,
  categoryData,
}) => {
  const sortedCategories: string[] = [...categoryArray].sort(
    (a, b) => categoryData[b] - categoryData[a]
  );

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-2 my-4">
      {sortedCategories.map((category: string) => {
        const percentage: number = categoryData[category];
        const color: string = `hsl(${percentage * 5}, ${percentage * 7}%, 50%)`;
        return (
          <div key={category} className="relative flex justify-center">
            <div
              className="w-16 h-16 cursor-pointer transform transition-transform hover:scale-110 relative"
              title={`${category}: ${percentage}%`}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon
                  points="50 1, 95 25, 95 75, 50 99, 5 75, 5 25"
                  style={{
                    fill: color,
                    opacity: 0.2 + (percentage / 100) * 0.8,
                    stroke: color,
                    strokeWidth: "4",
                  }}
                />
                <text
                  x="50"
                  y="40"
                  textAnchor="middle"
                  className="text-xs font-bold fill-current text-white"
                  style={{ fontSize: "14px" }}
                >
                  {percentage}%
                </text>
              </svg>
              <div className="absolute inset-0 flex items-end justify-center pb-1">
                <span className="text-xs font-medium text-white truncate max-w-full px-1">
                  {category.length > 8
                    ? `${category.substring(0, 6)}...`
                    : category}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Circular Visualization Component
const CircularVisualization: React.FC<InventoryPanelProps> = ({
  categoryArray,
  categoryData,
}) => {
  const radius: number = 40;
  const strokeWidth: number = 12;
  const circumference: number = 2 * Math.PI * radius;

  let offset: number = 0;

  const segments: SegmentData[] = categoryArray.map((category: string) => {
    const percentage: number = categoryData[category];
    const segmentLength: number = (percentage / 100) * circumference;
    const color: string = `hsl(${percentage * 5}, ${percentage * 7}%, 50%)`;
    const currentOffset: number = offset;
    offset += segmentLength;

    return {
      category,
      percentage,
      color,
      segmentLength,
      offset: currentOffset,
    };
  });

  return (
    <div className="flex flex-col items-center my-6">
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
          {segments.map((segment: SegmentData, index: number) => (
            <circle
              key={index}
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={circumference - segment.offset}
              transform="rotate(-90 50 50)"
              style={{
                transition: "stroke-dashoffset 1s ease-in-out",
              }}
            />
          ))}
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dy="0.3em"
            className="fill-current text-white text-lg font-bold"
          >
            {categoryArray.length}
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 w-full">
        {segments.map((segment: SegmentData, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: segment.color }}
            ></div>
            <div className="flex-1 text-sm font-medium text-white truncate">
              {segment.category}
            </div>
            <div className="text-sm font-bold text-white">
              {segment.percentage}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Card Visualization Component
const CardVisualization: React.FC<InventoryPanelProps> = ({
  categoryArray,
  categoryData,
}) => {
  const sortedCategories: string[] = [...categoryArray].sort(
    (a, b) => categoryData[b] - categoryData[a]
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-4">
      {sortedCategories.map((category: string) => {
        const percentage: number = categoryData[category];
        const color: string = `hsl(${percentage * 5}, ${percentage * 7}%, 50%)`;
        const sizeClass: string =
          percentage > 70
            ? "col-span-2 row-span-2"
            : percentage > 40
            ? "col-span-1 row-span-2"
            : "col-span-1 row-span-1";

        return (
          <div
            key={category}
            className={`${sizeClass} relative rounded-lg overflow-hidden bg-gray-800/40 hover:bg-gray-800/60 transition-all duration-300 flex flex-col justify-between`}
            style={{
              boxShadow: `0 0 15px ${color}33`,
            }}
          >
            <div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{ backgroundColor: color }}
            ></div>
            <div className="p-3">
              <h3 className="font-medium text-white text-sm md:text-base truncate">
                {category}
              </h3>
            </div>
            <div className="p-3 flex items-end justify-between">
              <div
                className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                style={{ backgroundColor: color }}
              >
                {percentage}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Main component with visualization switching
const InventoryPanel: React.FC<InventoryPanelProps> = ({
  categoryArray,
  categoryData,
}) => {
  type VisualizationType = "hex" | "circular" | "card";
  const [visualizationType, setVisualizationType] =
    useState<VisualizationType>("hex");

  return (
    <div className="w-full bg-gradient-to-br from-black to-gray-900 rounded-xl shadow-lg p-5 border  border-white/50">
      <div className="flex items-center justify-between mb-4 border-b border-gray-700/50 pb-3">
        <div className="flex items-center gap-2">
          <Package className="text-indigo-400" size={20} />
          <h3 className="text-lg md:text-xl font-semibold text-white">
            INVENTORY
          </h3>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setVisualizationType("hex")}
            className={`p-1.5 rounded-md transition-colors ${
              visualizationType === "hex"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                : "bg-gray-800"
            }`}
            title="Hex Grid View"
          >
            <Grid size={16} className="text-white" />
          </button>
          <button
            onClick={() => setVisualizationType("circular")}
            className={`p-1.5 rounded-md transition-colors ${
              visualizationType === "circular"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                : "bg-gray-800"
            }`}
            title="Circular View"
          >
            <PieChart size={16} className="text-white" />
          </button>
          <button
            onClick={() => setVisualizationType("card")}
            className={`p-1.5 rounded-md transition-colors ${
              visualizationType === "card"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                : "bg-gray-800"
            }`}
            title="Card View"
          >
            <List size={16} className="text-white" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[500px] custom-scrollbar pr-1">
        {visualizationType === "hex" && (
          <HexGridVisualization
            categoryArray={categoryArray}
            categoryData={categoryData}
          />
        )}

        {visualizationType === "circular" && (
          <CircularVisualization
            categoryArray={categoryArray}
            categoryData={categoryData}
          />
        )}

        {visualizationType === "card" && (
          <CardVisualization
            categoryArray={categoryArray}
            categoryData={categoryData}
          />
        )}
      </div>

    </div>
  );
};

export default InventoryPanel;
