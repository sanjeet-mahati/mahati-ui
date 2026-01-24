// Components
// import './styles/index.css';

// Accordion
export { Accordion } from './components/accordion';
export type { AccordionProps } from './components/accordion';

export { Button as MahatiButton } from './components/Button';
export { Card as MahatiCard } from './components/card';
export { Modal as MahatiModal } from './components/Modal';
export { FormContainer as MahatiFormContainer } from './components/FormContainer';
export { Input as MahatiInput } from './components/Input';

// Filter
export {
  Filter,
  MahatiActivity,
  MahatiStatus,
  MahatiSearch,
  DEFAULT_ACTIVITY_OPTIONS,
  DEFAULT_STATUS_OPTIONS,
} from './components/Filter';
export type {
  FilterValues,
  FieldSize,
  SelectOption,
  MahatiActivityProps,
  MahatiStatusProps,
  MahatiSearchProps,
} from './components/Filter';

export { TabbedInterface as MahatiTabbedInterface } from './components/TabedInterface';
export { Dropdown as MahatiDropdown } from './components/Dropdown';
export { TableWithTab as MahatiTableWithTab } from './components/TableWithTab';
export { Table as MahatiTable } from './components/Table';
export { Tooltip as MahatiTooltip } from './components/Tooltip';
export { ToastMessage as MahatiToastMessage } from './components/ToastMessage';
export {  ConfettiExplosion as MahatiConfettiExplosion} from './components/ConfettiExplosion';
export { RealisticConfetti as MahatiRealisticConfetti } from './components/RealisticConfetti';


// Spinner
export * from './components/Spinner';

// Type Exports
export { Calendar as MahatiCalendar } from './components/Calendar';
export type { CalendarDate, CalendarTime, CalendarDateRange, CalendarProps } from './components/Calendar';
// It's a good practice to re-export types that consumers of your library might need.
//export type { CalendarDate, CalendarTime, CalendarDateRange } from './components/Calendar';

export { MahatiLocationAccessModal } from './components/notifications';
export { MahatiCameraAccessModal } from './components/notifications';
export { MahatiMicrophoneAccessModal } from './components/notifications';
export { MahatiNotificationCard  } from './components/notifications';
export { MahatiPromotionModal as MahatiPromotionModal_V1 } from './components/notifications';
export { MahatiPromotionModalV2Modal as MahatiPromotionModal_V2 } from "./components/notifications";
export { MahatiPromotionModalV3Modal as MahatiPromotionModal_V3 } from "./components/notifications";
