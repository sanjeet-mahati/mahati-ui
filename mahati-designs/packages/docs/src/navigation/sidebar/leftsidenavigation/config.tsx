'use client';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faGear,
  faHandPointer,
  faCreditCard,
  faTableList,
  faSpinner,
  faAlignJustify,
  faSquareCaretDown,
  faWindowMaximize
} from '@fortawesome/free-solid-svg-icons';
import {
  faMessage
} from '@fortawesome/free-regular-svg-icons';

export interface NavItem {
  name: string;
  href: string;
  icon: JSX.Element | null;
  position?: 'top' | 'bottom';
  active?: boolean;
  subItems?: NavItem[];
}
export const NavItems = (): NavItem[]  => {
  const pathname = usePathname();
  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }
  return [
    {
      name: 'Mahati UI Component',
      href: '/',
      icon: <FontAwesomeIcon icon={faHouse} size="lg" />,
      active: pathname === '/',
      position: 'top',
    },
    {
      name: 'Button',
      href: '/button',
      // icon: <FontAwesomeIcon icon={faGear} size="lg" />,
      icon: <FontAwesomeIcon icon={faHandPointer} size="lg"/>,
      // active: pathname === '/navigationcomponent/button',
      active: pathname === '/button',
      position: 'top',
      subItems: [
        {
          name: 'Basic Buttons',
          href: '/button#basic-buttons',
          icon: <FontAwesomeIcon icon={faHandPointer} size="sm" />,
          // active: isNavItemActive(pathname, '/blogs/blog01'),
          // position: 'top',
        },     
        {
          name: 'Button Sizes',
          href: '/button#button-sizes',
          icon: <FontAwesomeIcon icon={faHandPointer} size="sm" />,
          // active: isNavItemActive(pathname, '/blogs/blog01'),
          // position: 'top',
        },     
        {
          name: 'Button Variants',
          href: '/button#button-variants',
          icon: <FontAwesomeIcon icon={faHandPointer} size="sm" />,
          // active: isNavItemActive(pathname, '/blogs/blog01'),
          // position: 'top',
        },     
        {
          name: 'Button States',
          href: '/button#button-states',
          icon: <FontAwesomeIcon icon={faHandPointer} size="sm" />,
          // active: isNavItemActive(pathname, '/blogs/blog01'),
          // position: 'top',
        },     
        {
          name: 'Combining Variants',
          href: '/button#combining-variants',
          icon: <FontAwesomeIcon icon={faHandPointer} size="sm" />,
          // active: isNavItemActive(pathname, '/blogs/blog01'),
          // position: 'top',
        },     
        {
          name: 'Props',
          href: '/button#props',
          icon: <FontAwesomeIcon icon={faHandPointer} size="sm" />,
          // active: isNavItemActive(pathname, '/blogs/blog01'),
          // position: 'top',
        },     
        {
          name: 'Examples',
          href: '/button#examples',
          icon: <FontAwesomeIcon icon={faHandPointer} size="sm" />,
          // active: isNavItemActive(pathname, '/blogs/blog01'),
          // position: 'top',
        },     
        
        
      ],
    },
    {
      name: 'Card',
      href: '/card',
      icon: <FontAwesomeIcon icon={faCreditCard} size="lg"/>,
      active: pathname === '/card',
      position: 'top',

      subItems: [
        {
          name: 'Basic Card',
          href: '/card#basic-card',
          icon: <FontAwesomeIcon icon={faCreditCard} size="sm" />,
        },     
        {
          name: 'With Title',
          href: '/card#card-with-title',
          icon: <FontAwesomeIcon icon={faCreditCard} size="sm" />,
        },
        {
          name: 'With Image',
          href: '/card#card-with-image',
          icon: <FontAwesomeIcon icon={faCreditCard} size="sm" />,
        },
        {
          name: 'Interactive',
          href: '/card#interactive-card',
          icon: <FontAwesomeIcon icon={faCreditCard} size="sm" />,
        },
        {
          name: 'Collapsible',
          href: '/card#collapsible-card',
          icon: <FontAwesomeIcon icon={faCreditCard} size="sm" />,
        },
        {
          name: 'Product Card',
          href: '/card#product-card',
          icon: <FontAwesomeIcon icon={faCreditCard} size="sm" />,
        },
        {
          name: 'User Profile',
          href: '/card#user-profile-card',
          icon: <FontAwesomeIcon icon={faCreditCard} size="sm" />,
        },
        {
          name: 'Special Offer',
          href: '/card#special-offer-card',
          icon: <FontAwesomeIcon icon={faCreditCard} size="sm" />,
        },
        {
          name: 'Spinning Cards',
          href: '/card#spinning-cards',
          icon: <FontAwesomeIcon icon={faCreditCard} size="sm" />,
        },
      ],
    },
    {
      name: 'Modal',
      href: '/modal',
      icon: <FontAwesomeIcon icon={faWindowMaximize} size="lg"/>,
      active: pathname === '/modal',
      position: 'top',
      subItems: [
        {
          name: 'Basic Modal',
          href: '/modal#basic-modal',
          icon: <FontAwesomeIcon icon={faWindowMaximize} size="sm" />,
        },
        {
          name: 'Confirmation',
          href: '/modal#confirmation-modal',
          icon: <FontAwesomeIcon icon={faWindowMaximize} size="sm" />,
        },
        {
          name: 'Form Modal',
          href: '/modal#form-modal',
          icon: <FontAwesomeIcon icon={faWindowMaximize} size="sm" />,
        },
        {
          name: 'Image Modal',
          href: '/modal#image-modal',
          icon: <FontAwesomeIcon icon={faWindowMaximize} size="sm" />,
        },
        {
          name: 'Notification',
          href: '/modal#notification-modal',
          icon: <FontAwesomeIcon icon={faWindowMaximize} size="sm" />,
        },
        {
          name: 'Loading Modal',
          href: '/modal#loading-modal',
          icon: <FontAwesomeIcon icon={faWindowMaximize} size="sm" />,
        },
        {
          name: 'Full-Screen',
          href: '/modal#fullscreen-modal',
          icon: <FontAwesomeIcon icon={faWindowMaximize} size="sm" />,
        },
      ],
    },
  {
  name: 'Dropdown',
  href: '/dropdown',
  icon: <FontAwesomeIcon icon={faSquareCaretDown} size="lg" />,
  active: pathname === '/dropdown',
  position: 'top',
  subItems: [
    { name: 'Basic', href: '/dropdown#basic', icon: <FontAwesomeIcon icon={faSquareCaretDown} size="sm" /> },
    { name: 'Outline', href: '/dropdown#outline', icon: <FontAwesomeIcon icon={faSquareCaretDown} size="sm" /> },
    { name: 'Pill', href: '/dropdown#pill', icon: <FontAwesomeIcon icon={faSquareCaretDown} size="sm" /> },
    { name: 'Dark', href: '/dropdown#dark', icon: <FontAwesomeIcon icon={faSquareCaretDown} size="sm" /> },
    { name: 'Underline', href: '/dropdown#underline', icon: <FontAwesomeIcon icon={faSquareCaretDown} size="sm" /> },
    { name: 'Shadow', href: '/dropdown#shadow', icon: <FontAwesomeIcon icon={faSquareCaretDown} size="sm" /> },
    { name: 'Glass', href: '/dropdown#glass', icon: <FontAwesomeIcon icon={faSquareCaretDown} size="sm" /> },
    { name: 'Gradient', href: '/dropdown#gradient', icon: <FontAwesomeIcon icon={faSquareCaretDown} size="sm" /> },
  ],
},

     {
      name: 'Tooltip',
      href: '/tooltip',
      icon: <FontAwesomeIcon icon={faSquareCaretDown} size="lg"/>,
      active: pathname === '/tooltip',
      position: 'top',
    },
    {
      name: 'Form',
      href: '/form',
      icon: <FontAwesomeIcon icon={faHandPointer} size="lg" />,
      active: pathname === '/form',
      position: 'top',
     subItems:[
      { name: 'Basic Input', href: '/form#basic-inputs', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
      { name: 'Floating Label', href: '/form#floating-inputs', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
      { name: 'File Upload', href: '/form#file-upload', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
      { name: 'Form Example', href: '/form#form-example', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
  
     ]
    },
    {
      name: 'Input',
      href: '/input',
      icon: <FontAwesomeIcon icon={faHandPointer} size="lg" />,
      active: pathname === '/input',
      position: 'top',
      subItems: [
        { name: 'Basic Input', href: '/input#basic-input-field', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Input States', href: '/input#input-states', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Floating Label', href: '/input#floating-label', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Input Sizes', href: '/input#input-sizes', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Resizable Textarea', href: '/input#resizable-textarea', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'File Input', href: '/input#file-input', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Avatar Input', href: '/input#avatar-input', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Avatar Placeholder', href: '/input#avatar-placeholder', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Avatar Ring', href: '/input#avatar-input-ring', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Avatar Ring Gap', href: '/input#avatar-input-ring-gap', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Avatar Image', href: '/input#avatar-image-input', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Rounded Inputs', href: '/input#rounded-inputs', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Image Header Form', href: '/input#image-header-form', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Basic Form', href: '/input#basic-form', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Reset Password', href: '/input#reset-password', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Validation', href: '/input#form-with-validation', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'With Icons', href: '/input#form-with-icons', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Full Form', href: '/input#full-featured-form', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Login Form', href: '/input#login-form', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Login with BG', href: '/input#login-form-bg', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
      ]
    },
    // {
    //   name: 'Key Value Display',
    //   href: '/keyValueDisplay',
    //   icon: <FontAwesomeIcon icon={faHandPointer} size="lg"/>,
    //   active: pathname === '/navigationcomponent/',
    //   position: 'top',
    // },
    // {
    //   name: 'Paragraph',
    //   href: '/paragraph',
    //   icon: <FontAwesomeIcon icon={faAlignJustify} size="lg"/>,
    //   active: pathname === '/navigationcomponent/',
    //   position: 'top',
    // },
    // {
    //   name: 'Row',
    //   href: '/row',
    //   icon: <FontAwesomeIcon icon={faHandPointer} size="lg"/>,
    //   active: pathname === '/navigationcomponent/',
    //   position: 'top',
    // },
    // {
    //   name: 'Spinner TailWindCSS',
    //   href: '/spinnerTailwindcss',
    //   icon: <FontAwesomeIcon icon={faSpinner} size="lg"/>,
    //   active: pathname === '/spinnerTailwindcss/',
    //   position: 'top',
    // },
    // {
    //   name: 'Spinner Regular CSS',
    //   href: '/spinner',
    //   icon: <FontAwesomeIcon icon={faSpinner} size="lg"/>,
    //   active: pathname === '/spinner/',
    //   position: 'top',
    // },
    // {
    //   name: 'Toast Message using TailwindCSS',
    //   href: '/toastMessageTailwindcssDemo',
    //   icon: <FontAwesomeIcon icon={faSpinner} size="lg"/>,
    //   active: pathname === '/ToastMessageTailwindcssDemo/',
    //   position: 'top',
    // },
    // {
    //   name: 'Toast Message Regular CSS',
    //   href: '/toastMessageDemo',
    //   icon: <FontAwesomeIcon icon={faSpinner} size="lg"/>,
    //   active: pathname === '/ToastMessageDemo/',
    //   position: 'top',
    // },

    {
      name: 'Table',
      href: '/table',
      icon: <FontAwesomeIcon icon={faTableList} size="lg"/>,
      active: pathname === '/table',
      position: 'top',
      subItems: [
        { name: 'Basic Table', href: '/table#basic-table', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'Paginated', href: '/table#paginated', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'Custom Cells', href: '/table#custom-cells', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'Sorting', href: '/table#sorting', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'Bordered', href: '/table#bordered', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'Global Alignment', href: '/table#global-alignment', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'Column Alignment', href: '/table#column-alignment', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'Column Visibility', href: '/table#column-visibility', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'All-in-One', href: '/table#all-in-one', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
      ]
    },

    {
      name: 'Table with talwindcss',
      href: '/tableTailwindCSSDemo',
      icon: <FontAwesomeIcon icon={faTableList} size="lg"/>,
      active: pathname === '/tableTailwindCSSDemo',
      position: 'top',
    },



    {
      name: 'Tab',
      href: '/tab',
      icon: <FontAwesomeIcon icon={faHandPointer} size="lg"/>,
      active: pathname === '/tab',
      position: 'top',
      subItems: [
        { name: 'Basic Tabs', href: '/tab#basic-tabs', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Outline', href: '/tab#outline-tabs', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Pill', href: '/tab#pill-tabs', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Dark', href: '/tab#dark-tabs', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Underline', href: '/tab#underline-tabs', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Shadow', href: '/tab#shadow-tabs', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Glass', href: '/tab#glass-tabs', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Gradient', href: '/tab#gradient-tabs', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
      ]
    },


     {
      name: 'Tab Tailwind CSS',
      href: '/tabTailwindCSSDemo',
      icon: <FontAwesomeIcon icon={faHandPointer} size="lg"/>,
      active: pathname === '/tabTailwindCSSDemo',
      position: 'top',
     },


    // {
    //   name: 'Tooltip',
    //   href: '/Tooltip',
    //   icon: <FontAwesomeIcon icon={faMessage} size="lg"/>,
    //   // icon: <FontAwesomeIcon icon={faHandPointer} size="lg"/>,
    //   active: pathname === '/navigationcomponent/',
    //   position: 'top',
    // },
    
    
  ];
};