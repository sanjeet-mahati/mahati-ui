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

// ✅ NEW: prop from server (cookie-based SSR state)
interface SideNavProps {
  initialExpanded: boolean;
}

const STORAGE_KEY = 'sidebarExpanded';
const COOKIE_KEY = 'sidebarExpanded';

const setCookie = (key: string, value: string) => {
  // persist for 1 year
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${key}=${value}; path=/; max-age=${maxAge}`;
};

export default function SideNav({ initialExpanded }: SideNavProps) {
  const navItems: NavItem[] = NavItems();

  // ✅ IMPORTANT:
  // Use server-provided initialExpanded so the very first render matches SSR HTML (no hydration mismatch).
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(initialExpanded);

  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // ✅ Keep localStorage in sync (optional, but keeps your previous storage behavior)
  // Also ensures it stays consistent when navigating client-side.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(isSidebarExpanded));
    } catch {
      // ignore
    }
  }, [isSidebarExpanded]);

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => {
      const next = !prev;

      // ✅ Persist to cookie so refresh keeps state (SERVER can read it)
      try {
        setCookie(COOKIE_KEY, next ? '1' : '0');
      } catch {
        // ignore
      }

      // ✅ Keep your old behavior: if collapsing, close submenus
      if (!next) {
        setOpenSubmenus({});
      }

      // ✅ Also write localStorage immediately (same behavior you originally had)
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }

      return next;
    });
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
            {/* ✅ FIX: asChild prevents Radix from injecting a <button> wrapper -> avoids hydration mismatch */}
            <TooltipTrigger asChild>
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
