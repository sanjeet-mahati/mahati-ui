'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Sheet, SheetContent } from '@/navigation/ui/sheet';
import { NavItems } from '@/navigation/sidebar/leftsidenavigation/config';
import { Menu } from 'lucide-react';

export default function Header() {
  const navItems = NavItems();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6 justify-between">
      {/* Logo for Mahati System */}
                <div className=" h-10 px-15 py-2 mb-6 ">
                    <img
                        
                        src="./resources/images/mahatilog.jpg"
                        alt="Mahati System Logo"
                        className="h-12 w-auto object-contain"
                    />
                </div>

      <div className='flex item-center px-auto py-5 mb-4 md:mb-0'>
        <Link href="/" className='text-xl italic font-bold text-primary'>
            Mahati Systems UI Components
        </Link>
      </div>    
      <div className="ml-4 flex items-center gap-3">
        <button onClick={() => setIsOpen(true)} className="block sm:hidden">
          <Menu size={24} />
        </button>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="right" className='block md:hidden'>
            <div className="pt-4  overflow-y-auto h-fit w-full flex flex-col gap-1">
              {navItems.map((navItem, idx) => (
                <Link
                  key={idx}
                  href={navItem.href}
                  onClick={() => setIsOpen(false)}
                  className={`h-full relative flex items-center whitespace-nowrap rounded-md ${
                    navItem.active
                      ? 'font-base text-sm bg-neutral-200 shadow-sm text-neutral-700 dark:bg-neutral-800 dark:text-white'
                      : 'hover:bg-neutral-200  hover:text-neutral-700 text-neutral-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                  }`}
                >
                  <div className="relative font-base text-sm py-1.5 px-2 flex flex-row items-center space-x-2 rounded-md duration-100">
                    {/* {navItem.icon} */}
                    <span>{navItem.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div> 
    </header>
  );
}
