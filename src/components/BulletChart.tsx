"use client";
import React from "react";

export interface BulletItem {
  name: string;
  achieved: number;
  target: number;
  marker: number;
}

export interface BulletData {
  title: string;
  bullets: BulletItem[];
}

export interface BulletChartData {
  data: BulletData;
}

export interface BulletChartProps {
  title: string;
  bullets: BulletItem[];
  testId?: string;
}

export const BulletChart: React.FC<BulletChartProps> = ({ title, bullets, testId }) => {
  return (
    <div className="w-full h-full flex flex-col" data-testid={testId}>
      {/* Title */}
      <div className="text-[rgba(23,97,163,1)] font-[Poppins,sans-serif] text-sm font-semibold leading-normal sm:text-base">
        {title}
      </div>

      {/* Bullets Container */}
      <div className="mt-4 flex flex-col gap-[35px] sm:gap-[45px]">
        {bullets.map((b) => {
          const percentageAchieved = Math.round((b.achieved / b.target) * 100);
          const achievedWidth = Math.min((b.achieved / b.target) * 100, 100);
          const markerPosition = Math.min((b.marker / b.target) * 100, 100);

          return (
            <div
              key={b.name}
              className="flex flex-col gap-[9px]"
              data-testid={testId ? `${testId}-item-${b.name}` : undefined}
            >
              {/* Bullet Name */}
              <div className="text-[rgba(23,97,163,1)] font-[Poppins,sans-serif] text-xs font-semibold leading-normal sm:text-sm">
                {b.name}
              </div>

              {/* Bullet Content */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                {/* Bar Container */}
                <div className="relative w-full sm:w-[500px]">
                  {/* Value Label */}
                  <div className="absolute top-[-29px] right-0 text-black font-[Poppins,sans-serif] text-xs font-semibold leading-normal whitespace-nowrap sm:text-sm">
                    ${b.achieved.toLocaleString()}/${b.target.toLocaleString()}
                  </div>

                  {/* Bar Background */}
                  <div className="relative w-full h-5 rounded-[20px] bg-[rgba(183,232,214,0.9)] overflow-hidden">
                    {/* Bar Fill */}
                    <div
                      className="h-5 rounded-l-[20px] rounded-r-none bg-gradient-to-r from-[rgba(23,97,163,1)] to-[rgba(77,175,131,1)]"
                      style={{ width: `${achievedWidth}%` }}
                      data-testid={testId ? `${testId}-bar-${b.name}` : undefined}
                    />
                    {/* Marker */}
                    <div
                      className="absolute top-0 h-5 w-1 rounded-sm bg-[rgba(15,74,122,1)]"
                      style={{ left: `${markerPosition}%`, transform: 'translateX(-50%)' }}
                      data-testid={testId ? `${testId}-marker-${b.name}` : undefined}
                    />
                  </div>

                  {/* Axis Labels */}
                  <div className="absolute top-[29px] left-0 w-full">
                    <div className="flex justify-between items-start">
                      <span className="text-[rgba(94,94,94,1)] font-[Poppins,sans-serif] text-[10px] font-medium leading-normal sm:text-xs">0</span>
                      <span className="text-[rgba(94,94,94,1)] font-[Poppins,sans-serif] text-[10px] font-medium leading-normal sm:text-xs" style={{ marginLeft: '-4px' }}>2k</span>
                      <span className="text-[rgba(94,94,94,1)] font-[Poppins,sans-serif] text-[10px] font-medium leading-normal sm:text-xs" style={{ marginLeft: '-4px' }}>4k</span>
                      <span className="text-[rgba(94,94,94,1)] font-[Poppins,sans-serif] text-[10px] font-medium leading-normal sm:text-xs" style={{ marginLeft: '-4px' }}>6k</span>
                      <span className="text-[rgba(94,94,94,1)] font-[Poppins,sans-serif] text-[10px] font-medium leading-normal sm:text-xs" style={{ marginLeft: '-4px' }}>8k</span>
                      <span className="text-[rgba(94,94,94,1)] font-[Poppins,sans-serif] text-[10px] font-medium leading-normal sm:text-xs" style={{ marginLeft: '-8px' }}>10k</span>
                    </div>
                  </div>
                </div>

                {/* Percentage Text */}
                <div
                  className="text-[rgba(115,115,115,1)] font-[Poppins,sans-serif] text-[9px] font-semibold leading-normal whitespace-nowrap sm:ml-[27px] sm:text-[10px]"
                  data-testid={testId ? `${testId}-percentage-${b.name}` : undefined}
                >
                  {percentageAchieved}% of target achieved
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

BulletChart.displayName = "BulletChart";