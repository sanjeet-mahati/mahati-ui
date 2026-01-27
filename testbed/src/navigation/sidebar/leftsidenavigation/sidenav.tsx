'use client';

import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/navigation/ui/tooltip';
import { NavItems, NavItem } from '@/navigation/sidebar/leftsidenavigation/config';

import { cn } from '../../../lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '@/navigation/sidebar/leftsidenavigation/SideNav.css';

interface SideNavItemProps {
  label: string;
  icon: any;
  path: string;
  active?: boolean;
  isSidebarExpanded: boolean;
  subItems?: NavItem[];
  isOpen: boolean;
  toggleSubmenu: (key: string) => void;
  isSubItem: boolean;
  level: number;
  itemKey: string;
  openSubmenus: { [key: string]: boolean };
  handleMouseEnter: (key: string) => void;
  handleMouseLeave: (key: string) => void;
}

export default function SideNav() {
  const navItems: NavItem[] = NavItems();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('sidebarExpanded');
      if (saved === null) {
        return true;
      }
      return JSON.parse(saved);
    }
    return true;
  });
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        'sidebarExpanded',
        JSON.stringify(isSidebarExpanded),
      );
    }
  }, [isSidebarExpanded]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
    if (!isSidebarExpanded) {
      setOpenSubmenus({});
    }
  };

  const toggleSubmenu = (itemKey: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  const handleMouseEnter = (itemKey: string) => {
    if (isSidebarExpanded) {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
      setOpenSubmenus((prev) => ({
        ...prev,
        [itemKey]: true,
      }));
    }
  };

  const handleMouseLeave = (itemKey: string) => {
    if (isSidebarExpanded) {
      const timeout = setTimeout(() => {
        setOpenSubmenus((prev) => ({
          ...prev,
          [itemKey]: false,
        }));
      }, 500);
      setHoverTimeout(timeout);
    }
  };

  return (
    <div className="sidebar-container">
      <div
        className={cn(
          'sidebar',
          isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed',
        )}
      >
        <aside className="sidebar-aside">
          <div className="nav-container">
            <div className="nav-list">
              {navItems.map((item: NavItem, idx: number) => {
                if (item.position === 'top') {
                  const itemKey = `${item.href}-${item.name}`;
                  return (
                    <Fragment key={idx}>
                      <div
                        className="nav-item"
                        onMouseEnter={() => handleMouseEnter(itemKey)}
                        onMouseLeave={() => handleMouseLeave(itemKey)}
                      >
                        <SideNavItem
                          label={item.name}
                          icon={item.icon}
                          path={item.href}
                          active={item.active || false}
                          isSidebarExpanded={isSidebarExpanded}
                          subItems={item.subItems}
                          isOpen={openSubmenus[itemKey] || false}
                          toggleSubmenu={toggleSubmenu}
                          isSubItem={false}
                          level={0}
                          itemKey={itemKey}
                          openSubmenus={openSubmenus}
                          handleMouseEnter={handleMouseEnter}
                          handleMouseLeave={handleMouseLeave}
                        />
                      </div>
                    </Fragment>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </aside>
        <div className="toggle-button-container">
          <button
            type="button"
            className="toggle-button"
            onClick={toggleSidebar}
          >
            {isSidebarExpanded ? (
              <FontAwesomeIcon icon={faChevronLeft} size="sm" className="stroke-foreground " />
            ) : (
              <FontAwesomeIcon icon={faChevronRight} size="sm" className="stroke-foreground" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export const SideNavItem: React.FC<SideNavItemProps> = ({
  label,
  icon,
  path,
  active,
  isSidebarExpanded,
  subItems,
  isOpen,
  toggleSubmenu,
  isSubItem = false,
  level = 0,
  itemKey,
  openSubmenus,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  return (
    <>
      {isSidebarExpanded ? (
        <div className="relative">
          <div
            className="w-full"
            onMouseEnter={() => handleMouseEnter(itemKey)}
            onMouseLeave={() => handleMouseLeave(itemKey)}
          >
            <div>
              <Link
                href={path}
                className={cn(
                  'nav-link',
                  active ? 'nav-link-active' : 'nav-link-inactive',
                )}
                onClick={() => subItems && toggleSubmenu(itemKey)}
              >
                <div className="nav-link-content">
                  {icon && icon}
                  <span className="nav-link-content-text">{label}</span>
                  {subItems && subItems.length > 0 && (
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      size="sm"
                      className={cn(
                        'chevron-icon',
                        isOpen ? 'chevron-open' : 'chevron-closed',
                      )}
                    />
                  )}
                </div>
              </Link>
            </div>
            {subItems && isSidebarExpanded && isOpen && (
              <div className="submenu-container" style={{ marginLeft: `${level * 10}px`}}>
                {subItems.map((subItem, subIdx) => {
                  const subItemKey = `${subItem.href}-${subItem.name}-${level + 1}-${subIdx}`;
                  return (
                    <div key={subIdx} className="subitem-indent">
                      <SideNavItem
                        label={subItem.name}
                        icon={subItem.icon}
                        path={subItem.href}
                        active={subItem.active || false}
                        isSidebarExpanded={isSidebarExpanded}
                        subItems={subItem.subItems}
                        isOpen={openSubmenus[subItemKey] || false}
                        toggleSubmenu={toggleSubmenu}
                        isSubItem={true}
                        level={level + 1}
                        itemKey={subItemKey}
                        openSubmenus={openSubmenus}
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <TooltipProvider delayDuration={70}>
          <Tooltip>
            <TooltipTrigger>
              <Link
                href={path}
                className={cn(
                  'nav-link',
                  active ? 'nav-link-active' : 'nav-link-inactive',
                  isSubItem && 'nav-link-subitem',
                )}
                onClick={() => subItems && toggleSubmenu(itemKey)}
              >
                <div className="nav-link-content-collapsed">
                  {icon && icon}
                  {subItems && subItems.length > 0 && (
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      size="sm"
                      className={cn(
                        'chevron-icon',
                        isOpen ? 'chevron-open' : 'chevron-closed',
                      )}
                    />
                  )}
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="tooltip-content"
              sideOffset={10}
            >
              <span>{label}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};