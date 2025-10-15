import React, { useState, useMemo, useRef, useCallback } from 'react';
import { HourlyForecast as HourlyForecastData } from '../types';

interface HourlyForecastProps {
  data: HourlyForecastData[];
}

const HourlyForecastChart: React.FC<HourlyForecastProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const chartData = useMemo(() => data.slice(0, 10), [data]);

  const { tempMin, tempMax, points, areaPath, linePath } = useMemo(() => {
    const temps = chartData.map(d => d.temp);
    const tempMin = Math.min(...temps) - 2;
    const tempMax = Math.max(...temps) + 2;
    const tempRange = tempMax - tempMin;

    const width = 500;
    const height = 100;
    const padding = { top: 10, bottom: 20, left: 0, right: 0 };

    const getX = (index: number) => padding.left + (index / (chartData.length - 1)) * (width - padding.left - padding.right);
    const getY = (temp: number) => (height - padding.bottom) - ((temp - tempMin) / tempRange) * (height - padding.top - padding.bottom);

    const points = chartData.map((d, i) => ({
      x: getX(i),
      y: getY(d.temp),
      temp: d.temp,
      time: d.time,
    }));

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    return { tempMin, tempMax, points, areaPath, linePath };
  }, [chartData]);

  const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    
    const svgRect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - svgRect.left;

    const closestIndex = points.reduce((closest, point, index) => {
      const dist = Math.abs(point.x - x);
      const closestDist = Math.abs(points[closest].x - x);
      return dist < closestDist ? index : closest;
    }, 0);

    setHoveredIndex(closestIndex);
    setTooltipPosition({ x: points[closestIndex].x, y: points[closestIndex].y });
  }, [points]);

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setTooltipPosition(null);
  };

  const hoveredData = hoveredIndex !== null ? chartData[hoveredIndex] : null;

  return (
    <div className="mt-8 relative h-40">
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 500 100"
        preserveAspectRatio="none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFA500" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#FFA500" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* X-axis labels (Time) */}
        <g className="text-xs fill-current text-gray-500 dark:text-gray-500">
          {points.map((point, index) => (
            <text key={index} x={point.x} y={100} textAnchor="middle">
              {chartData[index].time}
            </text>
          ))}
        </g>

        {/* Gradient Area */}
        <path d={areaPath} fill="url(#areaGradient)" />

        {/* Temperature Line */}
        <path d={linePath} fill="none" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Hover elements */}
        {hoveredIndex !== null && tooltipPosition && (
          <g>
            {/* Vertical line */}
            <line
              x1={tooltipPosition.x}
              y1="0"
              x2={tooltipPosition.x}
              y2="80"
              className="stroke-gray-600 dark:stroke-white"
              strokeWidth="1"
              strokeDasharray="3 3"
              strokeOpacity={0.5}
            />
            {/* Circle on point */}
            <circle cx={tooltipPosition.x} cy={tooltipPosition.y} r="4" className="fill-gray-100 dark:fill-[#181818] stroke-orange-500" strokeWidth="2" />
          </g>
        )}
      </svg>
      
      {/* Tooltip */}
      {hoveredIndex !== null && tooltipPosition && hoveredData && (
        <div 
            className="absolute bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm pointer-events-none transition-transform duration-100 ease-out shadow-lg"
            style={{
              left: `${(tooltipPosition.x / 500) * 100}%`,
              bottom: `${100 - (tooltipPosition.y / 100) * 100 + 5}%`,
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap'
            }}
        >
            <span className="font-bold text-gray-900 dark:text-white">{hoveredData.temp}°C</span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">{hoveredData.time}</span>
        </div>
      )}
    </div>
  );
};
  
export default React.memo(HourlyForecastChart);