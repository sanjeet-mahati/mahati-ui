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
          name: 'Dotted Button',
          href: '/button#dotted-button',
          icon: <FontAwesomeIcon icon={faHandPointer} size="sm" />,
          // active: isNavItemActive(pathname, '/blogs/blog01'),
        },
        {
          name: 'Pill Button',
          href: '/button#pill-button',
          icon: <FontAwesomeIcon icon={faHandPointer} size="sm" />,
          // active: isNavItemActive(pathname, '/blogs/blog01'),
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
      icon: <FontAwesomeIcon icon={faMessage} size="lg"/>,
      active: pathname === '/tooltip',
      position: 'top',
      subItems: [
        { name: 'MahatiTooltip Props', href: '/tooltip#mahatitooltip-props', icon: <FontAwesomeIcon icon={faMessage} size="sm" /> },
        { name: 'ConfettiExplosion Props', href: '/tooltip#confettiexplosion-props', icon: <FontAwesomeIcon icon={faMessage} size="sm" /> },
        { name: 'RealisticConfetti Props', href: '/tooltip#realisticconfetti-props', icon: <FontAwesomeIcon icon={faMessage} size="sm" /> },
        { name: 'Basic', href: '/tooltip#basic', icon: <FontAwesomeIcon icon={faMessage} size="sm" /> },
        { name: 'Transparent Background', href: '/tooltip#transparent-background', icon: <FontAwesomeIcon icon={faMessage} size="sm" /> },
        { name: 'Image & GIF', href: '/tooltip#image-gif', icon: <FontAwesomeIcon icon={faMessage} size="sm" /> },
        { name: 'Custom Border', href: '/tooltip#custom-border', icon: <FontAwesomeIcon icon={faMessage} size="sm" /> },
        { name: 'Sparkles', href: '/tooltip#sparkles', icon: <FontAwesomeIcon icon={faMessage} size="sm" /> },
        { name: 'Positions', href: '/tooltip#positions', icon: <FontAwesomeIcon icon={faMessage} size="sm" /> },
        { name: 'Text Content', href: '/tooltip#text-content', icon: <FontAwesomeIcon icon={faMessage} size="sm" /> },
        { name: 'Interactive Elements', href: '/tooltip#interactive-elements', icon: <FontAwesomeIcon icon={faMessage} size="sm" /> },
        { name: 'Celebration', href: '/tooltip#celebration', icon: <FontAwesomeIcon icon={faMessage} size="sm" /> },
      ],
    },
    {
      name: 'Form',
      href: '/form',
      icon: <FontAwesomeIcon icon={faHandPointer} size="lg" />,
      active: pathname === '/form',
      position: 'top',
      subItems: [
        { name: 'Basic Input', href: '/form#basic-input', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Input with Error', href: '/form#input-with-error', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Form Example', href: '/form#form-example', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Input Props', href: '/form#input-props', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'FormContainer Props', href: '/form#formcontainer-props', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
      ]
    },
    {
      name: 'Input',
      href: '/input',
      icon: <FontAwesomeIcon icon={faHandPointer} size="lg" />,
      active: pathname === '/input',
      position: 'top',
      subItems: [
        { name: 'Basic Input Fields', href: '/input#basic-input-fields', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Input States', href: '/input#input-states', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Floating Label', href: '/input#floating-label', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Input Sizes', href: '/input#input-sizes', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Resizable Textarea', href: '/input#resizable-textarea', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'File Input - Click Box', href: '/input#file-input-click-box', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'File Input - Inline (Left Button)', href: '/input#file-input-inline-left-button', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'File Input - Inline (Right Button)', href: '/input#file-input-inline-right-button', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'File Input - Drag & Drop', href: '/input#file-input-drag-drop', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Input with Avatar', href: '/input#input-with-avatar', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Input with Avatar Placeholder', href: '/input#input-with-avatar-placeholder', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Input with Avatar (Ring)', href: '/input#input-with-avatar-ring', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Input with Avatar (Ring Gap)', href: '/input#input-with-avatar-ring-gap', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Input with Avatar Image', href: '/input#input-with-avatar-image', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Rounded Inputs', href: '/input#rounded-inputs', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Form with Image Header', href: '/input#form-with-image-header', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Basic Form Container', href: '/input#basic-form-container', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Reset Password Form', href: '/input#reset-password-form', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Form with Validation', href: '/input#form-with-validation', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Form with Icons', href: '/input#form-with-icons', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Full Featured Form', href: '/input#full-featured-form', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Login Form Example', href: '/input#login-form-example', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Login Form with Background Image', href: '/input#login-form-with-background-image', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
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
    {
      name: 'Spinner TailWindCSS',
      href: '/spinnerTailwindcss',
      icon: <FontAwesomeIcon icon={faSpinner} size="lg"/>,
      active: pathname === '/spinnerTailwindcss/',
      position: 'top',
    },
    {
      name: 'Spinner Regular CSS',
      href: '/spinner',
      icon: <FontAwesomeIcon icon={faSpinner} size="lg"/>,
      active: pathname === '/spinner/',
      position: 'top',
    },
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
      // subItems: [
      //   { name: 'Basic Table', href: '/tableTailwindCSSDemo#basic-table', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
      //   { name: 'Paginated', href: '/tableTailwindCSSDemo#paginated', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
      //   { name: 'Custom Cells', href: '/tableTailwindCSSDemo#custom-cells', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
      //   { name: 'Sorting', href: '/tableTailwindCSSDemo#sorting', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
      //   { name: 'Bordered', href: '/tableTailwindCSSDemo#bordered', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
      //   { name: 'Global Alignment', href: '/tableTailwindCSSDemo#global-alignment', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
      //   { name: 'Column Alignment', href: '/tableTailwindCSSDemo#column-alignment', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
      //   { name: 'Column Visibility', href: '/tableTailwindCSSDemo#column-visibility', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
      //   { name: 'All-in-One', href: '/tableTailwindCSSDemo#all-in-one', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
      //   { name: 'Expandable Rows with Summary', href: '/tableTailwindCSSDemo#expandable-rows-with-summary', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
      //   { name: 'Expandable Multiple Rows with Summary', href: '/tableTailwindCSSDemo#expandable-multiple-rows-with-summary', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
      //   { name: 'Text Wrap Column Table', href: '/tableTailwindCSSDemo#text-wrap-column-table', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        
      // ]
    },



    {
      name: 'Tab',
      href: '/tab',
      icon: <FontAwesomeIcon icon={faHandPointer} size="lg"/>,
      active: pathname === '/tab',
      position: 'top',
      subItems: [
        { name: 'Basic Tabs', href: '/tab#basic-tabs', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Square', href: '/tab#square-tabs', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Pill', href: '/tab#pill-tabs', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Dark', href: '/tab#dark-tabs', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Underline', href: '/tab#underline-tabs', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Shadow', href: '/tab#shadow-tabs', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Glass', href: '/tab#glass-tabs', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Gradient', href: '/tab#gradient-tabs', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
      ]
    },
    //     {
    //   name: 'Chart',
    //   href: '/chart',
    //   icon: <FontAwesomeIcon icon={faHandPointer} size="lg"/>,
    //   active: pathname === '/chart',
    //   position: 'top',
    //   subItems: [
      
    //     { name: 'Chart with dropdown', href: '/chart#chart-with-dropdown', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
    //     { name: 'Basic Charts', href: '/chart#basic-charts', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
    //     { name: 'Chart Variants', href: '/chart#chart-variants', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
    //     { name: 'Chart Sizes', href: '/chart#chart-sizes', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
    //     { name: 'Combining Variants', href: '/chart#combining-variants', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
    //     { name: 'Props', href: '/chart#props', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
    //     { name: 'Examples', href: '/chart#examples', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
    //   ]
    // },


    //  {
    // {
    //   name: 'Tab Tailwind CSS',
    //   href: '/tabTailwindCSSDemo',
    //   icon: <FontAwesomeIcon icon={faHandPointer} size="lg"/>,
    //   active: pathname === '/tabTailwindCSSDemo',
    //   position: 'top',
    //  },
    // },


    // {
    //   name: 'Tooltip',
    //   href: '/Tooltip',
    //   icon: <FontAwesomeIcon icon={faMessage} size="lg"/>,
    //   // icon: <FontAwesomeIcon icon={faHandPointer} size="lg"/>,
    //   active: pathname === '/navigationcomponent/',
    //   position: 'top',
    // },

    {
      name: 'Table With Tab',
      href: '/tableWithTabDemo',
      icon: <FontAwesomeIcon icon={faHandPointer} size="lg"/>,
      active: pathname === '/tableWithTabDemo',
      position: 'top',
    },

    {
      name: 'Calendar',
      href: '/calendar',
      // icon: <FontAwesomeIcon icon={faMessage} size="lg"/>,
      icon: <FontAwesomeIcon icon={faHandPointer} size="lg"/>,
      active: pathname === '/calendar',
      position: 'top',
    },
    
    
  ];
};