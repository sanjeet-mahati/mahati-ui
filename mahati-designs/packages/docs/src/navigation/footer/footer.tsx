"use client"

import Link from 'next/link';
import React, {useState} from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

import { Bars3Icon, MoonIcon, SunIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
// import { useTheme } from '../context/ThemeContext';


const Footer = () => {

    // const{theme, toggleTheme} = useTheme();
    // const theme = "dark"   // TODO: get theme from contact
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const pathname = usePathname();
    const toggleMobileMenu = () => {
         setIsMobileMenuOpen(!isMobileMenuOpen);
    }


    const menuItems = [
        {href: "/about-us", label: "About Us"},
        {href: "/policies", label: "Policy"},
        {href: "/legal-notices", label: "Legal Notices"},
        {href: "/cookie-preferences", label: "Cookie Preferences"},
        {href: "#", label: "Follow us : "},
    ]



  return (
    <footer className='w-full bg-white/80 dark:bg-dark/80 backdrop-blur-sm z-50 
                    border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colorsbg-white dark:bg-dark border-t border-gray-900 dark:border-gray-800'>
        <div className='container max-w-7xl mx-auto pax-4 py-4'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
                <div className='mb-4 md:mb-0'>
                    <Link href="/" className='text-xl italic font-bold text-primary'>Mahati Systems</Link>
                    <p className='text-sm italic text-secondary mt-1 text-black'>{new Date().getFullYear() }  Mahati Systems. All rights reserved.</p>
                </div>
                
                

                {/* Desktop Menus */}
                <div className=' md:flex items-center space-x-8'>
                    {
                       menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                             <Link key={item.href} href={item.href} className={`hover:text-primary transition-colors font-medium ${isActive ? ' text-primary': ''}`}>{item.label}</Link>
                        )

                       }) 
                    }



                    {/* For section of social media links */}
                    <div className="flex px-10 space-x-6 ">
                        {/* For GitHub media ccount */}
                        <a
                        href="https://github.com/yourusername"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary hover:text-primary transition-colors"
                        >
                        <FaGithub className="h-6 w-6" />
                        </a>

                        {/* For Twitter social media account */}
                        <a
                        href="https://twitter.com/yourusername"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary hover:text-primary transition-colors"
                        >
                        <FaTwitter className="h-6 w-6" />
                        </a>

                        {/* For LinkedIn social media account */}
                        <a
                        href="https://linkedin.com/in/yourusername"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary hover:text-primary transition-colors"
                        >
                        <FaLinkedin className="h-6 w-6" />
                        </a>

                    </div>



                    {/* Button for Light Mode */}

                    {/*
                    <button onClick={toggleTheme} 
                            className='p-2 rounded-lg hover:bg-gray-100 dark:text-white 
                                       hover:text-primary dark:bg-gray-800 
                                       transition-colors cursor-pointer' >
                        {
                            theme === "dark"? (
                                <SunIcon className='w-5 h-5' />
                            ): (
                                <MoonIcon className='w-5 h-5' />
                            )
                        }
                    </button> 
                    */}

                </div>

            </div>
        </div>
    </footer>

  )
}

export default Footer
