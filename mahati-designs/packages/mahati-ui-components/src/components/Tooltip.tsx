"use client";
import React, { useState } from "react";
import "../styles/Tooltip.module.css";
interface TooltipProps {
  text: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, position, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="tooltipContainer"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={`tooltip ${visible ? 'tooltipVisible' : ''}`}>
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;