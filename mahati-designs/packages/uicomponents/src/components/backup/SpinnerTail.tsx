// spinner.tsx
import React from "react";

type SpinnerProps = {
  className?: string;
  label?: string;
};

const Spinner: React.FC<SpinnerProps> = ({ className = "", label = "Loading" }) => {
  return (
    <div
      role="status"
      aria-label={label}
      className={[
        "w-[24px] h-[24px]",
        "border-solid border-[4px]",
        // ring color (20% alpha)
        "border-[rgba(0,123,255,0.2)]",
        // top accent in RGBA (100% alpha)
        "border-t-[rgba(0,123,255,1)]",
        "rounded-[10%]",
        "animate-[spin_1s_linear_infinite]",
        className,
      ].join(" ")}
    />
  );
};

export default Spinner;
