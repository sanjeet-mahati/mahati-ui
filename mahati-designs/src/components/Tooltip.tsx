'use client';
import React, { useState } from "react";
import styles from "../styles/Tooltip.module.css";

export interface TooltipProps {
  text: string;
  position?: "top" | "right" | "bottom" | "left";
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, position = "top", children }) => {
  const [visible, setVisible] = useState(false);

  const showTooltip = () => {
    console.log("Showing tooltip");
    setVisible(true);
  };
  
  const hideTooltip = () => {
    console.log("Hiding tooltip");
    setVisible(false);
  };


  return (
    <div
      className={styles.tooltipContainer}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {visible && (
        <div className={`${styles.tooltip} ${styles[position]}`}>
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;