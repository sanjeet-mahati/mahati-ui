import Link, { LinkProps } from 'next/link';
import React from 'react';

interface TooltipLinkProps extends LinkProps {
  children: React.ReactNode;
  tooltip: string;
  className?: string;
}

const TooltipLink: React.FC<TooltipLinkProps> = ({ href, children, tooltip, className }) => {
  return (
    <span className="relative inline-block">
      <Link href={href} className={className} data-tooltip={tooltip}>
        {children}
      </Link>
    </span>
  );
};

export default TooltipLink;