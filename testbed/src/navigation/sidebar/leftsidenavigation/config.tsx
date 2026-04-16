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
  faWindowMaximize,
  faCalendarDays,
  faLayerGroup,
  faBell,
  faCamera,
  faMicrophone,
  faLocationDot,
  faEnvelope,
  faEnvelopeOpenText,
  faPaperPlane,
  faMessage,
  faChartSimple,
  faFolderOpen,
  faPenSquare,
  faClipboardList,
  faTableCellsLarge, // Moved from regular to solid icons
} from '@fortawesome/free-solid-svg-icons';



import { HiBellAlert } from "react-icons/hi2";
import React from "react";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  position?: 'top' | 'bottom';
  active?: boolean;
  subItems?: NavItem [];

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
          name: 'Button Variants',
          href: '/button#button-variants',
          icon: <FontAwesomeIcon icon={faHandPointer} size="sm" />,
          // active: isNavItemActive(pathname, '/blogs/blog01'),
          // position: 'top',
        },       
        {
          name: 'Dotted&Pilled Buttons',
          href: '/button#dotted&pilledbuttons',
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
          name: 'Button States',
          href: '/button#button-states',
          icon: <FontAwesomeIcon icon={faHandPointer} size="sm" />,
          // active: isNavItemActive(pathname, '/blogs/blog01'),
          // position: 'top',
        },
          {
          name: 'Icon Buttons Default-Hover',
          href: '/button#icon-buttons-default-hover',
          icon: <FontAwesomeIcon icon={faHandPointer} size="sm" />,
          // active: isNavItemActive(pathname, '/blogs/blog01'),
          // position: 'top',
        },
          {
          name: 'Icon Buttons Custom-Hover',
          href: '/button#icon-buttons-custom-hover',
          icon: <FontAwesomeIcon icon={faHandPointer} size="sm" />,
          // active: isNavItemActive(pathname, '/blogs/blog01'),
          // position: 'top',
        },
          {
          name: 'Icon Buttons Intensity-Levels',
          href: '/button#iconbuttonsintensitylevels',
          icon: <FontAwesomeIcon icon={faHandPointer} size="sm" />,
          // active: isNavItemActive(pathname, '/blogs/blog01'),
          // position: 'top',
        },
           {
          name: 'Icon Buttons-Different Background Padding',
          href: '/button#iconbuttonsdifferentpadding',
          icon: <FontAwesomeIcon icon={faHandPointer} size="sm" />,
          // active: isNavItemActive(pathname, '/blogs/blog01'),
          // position: 'top',
        },
         {
          name: 'Icon Buttons-Column-Layout',
          href: '/button#iconbuttonscolumn-layout',
          icon: <FontAwesomeIcon icon={faHandPointer} size="sm" />,
          // active: isNavItemActive(pathname, '/blogs/blog01'),
          // position: 'top',
        },
          {
          name: 'Custom Colors With ClassName',
          href: '/button#Custom-colors-with-classname',
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
        
        
         
        {
          name: 'Props',
          href: '/button#props',
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
          name: 'Card Variants',
          href: '/card#card-variants',
          icon: <FontAwesomeIcon icon={faCreditCard} size="sm" />,
        },     
        {
          name: 'Collapsible',
          href: '/card#collapsible-card',
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
          name: 'Product Card',
          href: '/card#product-card',
          icon: <FontAwesomeIcon icon={faCreditCard} size="sm" />,
        },
        {
          name: 'Flippable Card',
          href: '/card#flippable-card',
          icon: <FontAwesomeIcon icon={faCreditCard} size="sm" />,
        },
          {
          name: 'Spinning Card',
          href: '/card#spinning-card',
          icon: <FontAwesomeIcon icon={faCreditCard} size="sm" />,
        },  
         {
          name: 'Card Sizes',
          href: '/card#card-sizes',
          icon: <FontAwesomeIcon icon={faCreditCard} size="sm" />,
        },  
         {
          name: 'Custom Background Color',
          href: '/card#custom-background-color',
          icon: <FontAwesomeIcon icon={faCreditCard} size="sm" />,
        },  
        {
          name: 'Props',
          href: '/card#props',
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
          name: 'Scrollable',
          href: '/modal#scrollable-modal',
          icon: <FontAwesomeIcon icon={faWindowMaximize} size="sm" />,
        },
        {
          name: 'Sizes',
          href: '/modal#modal-sizes',
          icon: <FontAwesomeIcon icon={faWindowMaximize} size="sm" />,
        },
        {
          name: 'Chatbot',
          href: '/modal#chatbot-modal',
          icon: <FontAwesomeIcon icon={faWindowMaximize} size="sm" />,
        },
        {
          name: 'Feedback',
          href: '/modal#feedback-modal',
          icon: <FontAwesomeIcon icon={faWindowMaximize} size="sm" />,
        },
        {
          name: 'Props',
          href: '/modal#props',
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
    { name: 'Basic', href: '/dropdown#dropdown-variants', icon: <FontAwesomeIcon icon={faSquareCaretDown} size="sm" /> },
    { name: 'Glass', href: '/dropdown#glass-dropdown', icon: <FontAwesomeIcon icon={faSquareCaretDown} size="sm" /> },
    { name: 'Disabled', href: '/dropdown#disabled-dropdown', icon: <FontAwesomeIcon icon={faSquareCaretDown} size="sm" /> },
   { name: 'Searchable', href: ' /dropdown#searchable', icon: <FontAwesomeIcon icon={faSquareCaretDown} size="sm" /> },
  { name: 'MultiSelect', href: '/dropdown#multiselect', icon: <FontAwesomeIcon icon={faSquareCaretDown} size="sm" /> },
  { name: 'Cascading', href: '/dropdown#cascading', icon: <FontAwesomeIcon icon={faSquareCaretDown} size="sm" /> },
  { name: 'Avatar', href: '/dropdown#avatar', icon: <FontAwesomeIcon icon={faSquareCaretDown }size="sm" /> },
  { name: 'AvatarMultiSelect', href:'/dropdown#avatarmultiselect', icon: <FontAwesomeIcon icon={faSquareCaretDown} size="sm" /> },
  { name: 'Grouped', href: '/dropdown#grouped', icon: <FontAwesomeIcon icon={faSquareCaretDown} size="sm" /> },
  { name: 'Async', href: '/dropdown#async', icon: <FontAwesomeIcon icon={faSquareCaretDown} size="sm" /> },
    
    
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
  name: 'Text To Audio',
  href: '/texttoaudio',
  icon: <FontAwesomeIcon icon={faMicrophone} size="lg" />,
  active: pathname === '/texttoaudio',
  position: 'top',
},
    {
      name: 'Form',
      href: '/form',
      icon: <FontAwesomeIcon icon={faClipboardList} size="lg" />,
      active: pathname === '/form',
      position: 'top',
      subItems: [
        { name: 'FormContainer Props', href: '/form#inputprops', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Basic Input', href: '/form#basic-input', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Inputs With Custom Styling', href: '/form#inputs-with-custom-styling', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'File Upload', href: '/form#file-upload', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Floating Label Style', href: '/form#floating-label-input', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
      ]
    },
    {
      name: 'Input',
      href: '/input',
      icon: <FontAwesomeIcon icon={faPenSquare} size="lg" />,
      active: pathname === '/input',
      position: 'top',
      subItems: [
        { name: 'Basic Input ', href: '/input#basic-input', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Input States', href: '/input#input-states', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Floating Label', href: '/input#floating-label', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Input Sizes', href: '/input#input-sizes', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Resizable Textarea', href: '/input#resizable-textarea', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'File Input', href: '/input#file-input', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Form with validation', href: '/input#form-with-validation', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Full Featured Form', href: '/input#full-featured-form', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Login Form With Background Image', href: '/input#login-form-with-background-image', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Avatar Input Variations', href: '/input#avatar-input-variations', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
        { name: 'Rounded Inputs', href: '/input#rounded-inputs', icon: <FontAwesomeIcon icon={faHandPointer} size="sm" /> },
       
      ]
    },
    {
      name: 'Spinner',
      href: '/spinner',
      icon: <FontAwesomeIcon icon={faSpinner} size="lg"/>,
      active: pathname === '/spinner',
      position: 'top',
      subItems: [
        { name: 'Ring Spinner', href: '/spinner#ring-spinner', icon: <FontAwesomeIcon icon={faSpinner} size="sm" /> },
        { name: 'Ring • Sizes', href: '/spinner#Ring-•-Sizes', icon: <FontAwesomeIcon icon={faSpinner} size="sm" /> },
        { name: 'Ring • Colors', href: '/spinner#Ring-•-Colors', icon: <FontAwesomeIcon icon={faSpinner} size="sm" /> },
        { name: 'Ring • Speeds', href: '/spinner#Ring-•-speeds', icon: <FontAwesomeIcon icon={faSpinner} size="sm" /> },
        { name: 'Ring • In Button', href: '/spinner#Ring-•-In-Button', icon: <FontAwesomeIcon icon={faSpinner} size="sm" /> },
          { name: 'Circular Spinner • Multiple Rings', href: '/spinner#Circular Spinner • Multiple Rings', icon: <FontAwesomeIcon icon={faSpinner} size="sm" /> },
        { name: 'Circular Spinner • Speeds', href: '/spinner#Circular-Spinner-•-Speeds', icon: <FontAwesomeIcon icon={faSpinner} size="sm" /> },
        { name: 'Circular Spinner • In Button', href: '/spinner#Circular-Spinner-•-In-Button', icon: <FontAwesomeIcon icon={faSpinner} size="sm" /> },
        { name: 'Dots • Default (3 dots)', href: '/spinner#Dots • Default (3 dots)', icon: <FontAwesomeIcon icon={faSpinner} size="sm" /> },
        { name: 'Dots • Sizes & Count', href: '/spinner#Dots•Sizes&Count', icon: <FontAwesomeIcon icon={faSpinner} size="sm" /> },
             { name: 'Dots • Colors & Speed', href: '/spinner#Dots • Colors & Speed', icon: <FontAwesomeIcon icon={faSpinner} size="sm" /> },
        { name: 'Dots • Gap Variations', href: '/spinner#Dots • Gap Variations', icon: <FontAwesomeIcon icon={faSpinner} size="sm" /> },
        { name: 'Dots • In Button', href: '/spinner#Dots • In Button', icon: <FontAwesomeIcon icon={faSpinner} size="sm" /> },
        { name: 'Dots • Custom Count Examples', href: '/spinner#Dots • Custom Count Examples', icon: <FontAwesomeIcon icon={faSpinner} size="sm" /> },
        { name: 'Dots • Linear Animation', href: '/spinner#Dots • Linear Animation', icon: <FontAwesomeIcon icon={faSpinner} size="sm" /> },
         { name: 'Card • Overlay Loader', href: '/spinner#', icon: <FontAwesomeIcon icon={faSpinner} size="sm" /> },
        { name: 'Card • Skeleton Loading States', href: '/spinner#', icon: <FontAwesomeIcon icon={faSpinner} size="sm" /> },
      ]
    },
    {
      name: 'Toast Message',
      href: '/toast',
      icon: <HiBellAlert size={24} />,
      active: pathname === '/ToastMessageDemo/',
      position: 'top',
      subItems: [
        { name: 'Solid Toast Types', href: '/toast#solid-toast-types', icon: <HiBellAlert size={24} /> },
        { name: 'Transparent Background - Toast Variants', href: '/toast#transparent-background-toast-variants', icon: <HiBellAlert size={14} /> },
        { name: 'Custom Toast Examples', href: '/toast#custom-toast-examples', icon: <HiBellAlert size={24} /> },
        { name: 'Toast with Action Buttons', href: '/toast#toast-with-action-buttons', icon: <HiBellAlert size={14} /> },
      ]
    },
    {
      name: 'Table',
      href: '/table',
      icon: <FontAwesomeIcon icon={faTableList} size="lg"/>,
      active: pathname === '/table',
      position: 'top',
      subItems: [
        { name: 'Basic Table', href: '/table#basic-table', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'Paginated', href: '/table#pagenated-table', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'Custom Cells & Actions', href: '/table#custom-cells&actions', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'Date & Time Sorting', href: '/table#Date&timesorting', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'Bordered Table (Visible Edges)', href: '/table#Bordered-table', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'Alignment Controls (Left / Center / Right)', href: '/table#Alignment-controls', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'Per-Column Alignment', href: '/table#Per-column-alignment', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'Column Visibility (Multi-Select)', href: '/table#column-visibility', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'All-in-One', href: '/table#All-in-one-table', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'Expandable Rows with Summary', href: '/table#Expandable-Multiple-Rows-with-Summary', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'Expandable Multiple Rows with Summary', href: '/table#all-in-one', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'Text Wrap Table (Summary Column)', href: '/table#Text-Wrap-Table-(Summary Column)', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'Multi-Column Text Wrap Table', href: '/table#Multi-Column Text Wrap Table', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
      
      
        
      ]
    },
    {
      name: 'Tab',
      href: '/tab',
      icon: <FontAwesomeIcon icon={faFolderOpen} size="lg"/>,
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
      name: 'Chart',
      href: '/chart',
      icon: <FontAwesomeIcon icon={faChartSimple} size="lg"/>,
      active: pathname === '/chart',
      position: 'top',
    },




    {
      name: 'Table With Tab',
      href: '/tableWithTab',
      icon: <FontAwesomeIcon icon={faTableCellsLarge} size="lg"/>,
      active: pathname === '/tableWithTab',
      position: 'top',
      subItems: [
        { name: 'Tabs With Header Close Icon', href: '/tableWithTab#header-close-icon', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'Vertical Tabs ', href: '/tableWithTab#vertical-tabs-right', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
        { name: 'Vertical Tabs with Custom Label', href: '/tableWithTab#vertical-tabs-right-custom-label', icon: <FontAwesomeIcon icon={faTableList} size="sm" /> },
       
      ]
    },

    {
      name: 'Calendar',
      href: '/calendar',
      icon: <FontAwesomeIcon icon={faCalendarDays} size="lg"/>,
      active: pathname === '/calendar',
      position: 'top',
      subItems: [
        { name: 'Basic Calendar', href: '/calendar#basic-calendar', icon: <FontAwesomeIcon icon={faCalendarDays} size="sm" /> },
        { name: 'With Today & Clear Buttons', href: '/calendar#with-today-&-clear-buttons', icon: <FontAwesomeIcon icon={faCalendarDays} size="sm" /> },
        { name: 'Auto Hide Calendar', href: '/calendar#auto-hide-calendar', icon: <FontAwesomeIcon icon={faCalendarDays} size="sm" /> },
        { name: 'Calendar with Time Selection', href: '/calendar#calendar-with-time-selection', icon: <FontAwesomeIcon icon={faCalendarDays} size="sm" /> },
        { name: 'Time Selection with Today & Clear Buttons', href: '/calendar#Time-selection-today&clear-buttons', icon: <FontAwesomeIcon icon={faCalendarDays} size="sm" /> },
        { name: 'Time Selection with Format Toggle (12h/24h)', href: '/calendar#time-selection-with-format-toggle-12h-24h', icon: <FontAwesomeIcon icon={faCalendarDays} size="sm" /> },
        { name: 'Custom Preview Text Styling', href: '/calendar#custom-preview-text-styling', icon: <FontAwesomeIcon icon={faCalendarDays} size="sm" /> },
        { name: 'Global Typography Styling', href: '/calendar#global-typography-styling', icon: <FontAwesomeIcon icon={faCalendarDays} size="sm" /> },
        { name: 'Year Dropdown Feature', href: '/calendar#year-dropdown-feature', icon: <FontAwesomeIcon icon={faCalendarDays} size="sm" /> },
        { name: 'Date Format & Time Zone Selection', href: '/calendar#date-format&time-zone-selection', icon: <FontAwesomeIcon icon={faCalendarDays} size="sm" /> },
        { name: 'Date Range with Today & Clear Buttons', href: '/calendar#date-range-with-today&clear-buttons', icon: <FontAwesomeIcon icon={faCalendarDays} size="sm" /> },
        { name: 'Block / Disable Dates', href: '/calendar#block-disable-dates', icon: <FontAwesomeIcon icon={faCalendarDays} size="sm" /> },
        { name: 'Calendar Size Variations', href: '/calendar#calendar-size-variations', icon: <FontAwesomeIcon icon={faCalendarDays} size="sm" /> },
        { name: 'Size Comparison (Side by Side)', href: '/calendar#size-comparison-side-by-side', icon: <FontAwesomeIcon icon={faCalendarDays} size="sm" /> },
        { name: 'Size Prop with Date Range Selection', href: '/calendar#size-prop-with-date-range-selection', icon: <FontAwesomeIcon icon={faCalendarDays} size="sm" /> },
                
      ]
    },
    {
  name: 'Accordion',
  href: '/accordion',
  icon: <FontAwesomeIcon icon={faLayerGroup} size="lg" />,
  active: pathname === '/accordion',
  position: 'top',
  subItems: [
    {
      name: 'Basic Accordion',
      href: '/accordion#basic-accordion',icon:<FontAwesomeIcon icon={faLayerGroup} size="lg" />,
    },{name: 'Multiple Items Accordion',href: '/accordion#multiple-accordion',icon:<FontAwesomeIcon icon={faLayerGroup} size='lg'/>
    },
    {
      name: 'Nested Accordion',
      href: '/accordion#nested-accordion',icon:<FontAwesomeIcon icon={faLayerGroup} size='lg'/>
    },
    {
      name:"Disabled Accordion",
      href:"/accordion#Disabled-Accordion",icon:<FontAwesomeIcon icon={faLayerGroup} size='lg'/>
    },
    {
      name:"Accordion Group",
      href:"/accordion#accordion-group",icon:<FontAwesomeIcon icon={faLayerGroup} size='lg'/>
    },
    {
      name:"Long content Accordion",
      href:"/accordion#long-content-accordion",icon:<FontAwesomeIcon icon={faLayerGroup} size='lg'/>
    }
    
  ],
},
  
{
  name: 'Filter',
  href: '/filter',
  icon: <FontAwesomeIcon icon={faAlignJustify} size="lg" />,
  active: pathname === '/filter',
  position: 'top',
  subItems: [
    {
      name: 'Basic Filter',
      href: '/filter#basic-filter',
      icon: <FontAwesomeIcon icon={faAlignJustify} size="sm" />,
    },
    {
      name: 'Date / Time Filter',
      href: '/filter#date-time-filter',
      icon: <FontAwesomeIcon icon={faCalendarDays} size="sm" />,
    },
    {
      name: 'Activity Filter',
      href: '/filter#activity-filter',
      icon: <FontAwesomeIcon icon={faSquareCaretDown} size="sm" />,
    },
    {
      name: 'Status Filter',
      href: '/filter#status-filter',
      icon: <FontAwesomeIcon icon={faSquareCaretDown} size="sm" />,
    },
    {
      name: 'Search Filter',
      href: '/filter#search-filter',
      icon: <FontAwesomeIcon icon={faMessage} size="sm" />,
    },
    {
      name: 'Props',
      href: '/filter#props',
      icon: <FontAwesomeIcon icon={faGear} size="sm" />,
    },
  ],
},

{
  name: 'Notifications',
  href: '/notifications',
  icon: <HiBellAlert size={22} />, // Main notifications section
  active: pathname === '/notifications',
  position: 'top',
  subItems: [
    /* ================= PERMISSION MODALS ================= */

    {
      name: 'Location Access Modal',
      href: '/notifications#location-modal',
      icon: <FontAwesomeIcon icon={faLocationDot} size="sm" />,
    },
    {
      name: 'Camera Access Modal',
      href: '/notifications#camera-modal',
      icon: <FontAwesomeIcon icon={faCamera} size="sm" />,
    },
    {
      name: 'Microphone Access Modal',
      href: '/notifications#mic-modal',
      icon: <FontAwesomeIcon icon={faMicrophone} size="sm" />,
    },

    /* ================= PROMOTION ================= */

    {
      name: 'Promotion Modal (V1)',
      href: '/notifications#promotion-modal-v1',
      icon: <FontAwesomeIcon icon={faEnvelopeOpenText} size="sm" />,
    },

    {
      name: 'Promotion Modal (V2)',
      href: '/notifications#promotion-modal-v2',
      icon: <FontAwesomeIcon icon={faEnvelope} size="sm" />,
    },

    {
      name: 'Promotion Modal (V3)',
      href: '/notifications#promotion-modal-v3',
      icon: <FontAwesomeIcon icon={faPaperPlane} size="sm" />,
    },

    /* ================= NOTIFICATION CARDS ================= */

    {
      name: 'Notification Cards',
      href: '/notifications#notification-cards',
      icon: <FontAwesomeIcon icon={faBell} size="sm" />,
    },

    {
      name: 'Icons',
      href: '/notifications#file-action-icons',
      icon: <FontAwesomeIcon icon={faAlignJustify} size="sm" />,
    },
  ],
}

 
  ];
};

  
