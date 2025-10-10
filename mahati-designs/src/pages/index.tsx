'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { 
  UserIcon, 
  Cog6ToothIcon, 
  QuestionMarkCircleIcon, 
  ArrowLeftStartOnRectangleIcon 
} from '@heroicons/react/24/outline';

import mahatilog from '@/imagesmahati-icon.png';
interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {

  return (
    <header className="flex justify-between items-start px-4 py-2 border-b bg-white shadow-sm z-30">
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Toggle */}
        <span>
  <Image
                   src="/mahatilog.jpg"
                   alt="Mahati Logo"
                   width={36}
                   height={36}
                   style={{ borderRadius: 12 }}
                 />
      <h1>Mahati UI Components</h1>
        </span>
     
        
        {/* Brand */}
       
      </div>
    </header>
  );
}