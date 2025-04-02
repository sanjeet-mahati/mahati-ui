import React, { useState } from "react";
import styles from "./Tooltip.module.css"; // Assuming you use CSS Modules

const Tooltip = ({ text, position = "top", children }) => {
  const [visible, setVisible] = useState(false);

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

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
