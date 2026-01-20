// src/lib/utils.ts
/**
 * Style Props Utilities
 * Converts props like bg, px, py into CSS for Emotion components
 */

export interface StyleProps {
  bg?: string;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  
  // Spacing
  p?: number | string;
  px?: number | string;
  py?: number | string;
  pt?: number | string;
  pr?: number | string;
  pb?: number | string;
  pl?: number | string;
  m?: number | string;
  mx?: number | string;
  my?: number | string;
  mt?: number | string;
  mr?: number | string;
  mb?: number | string;
  ml?: number | string;
  
  // Sizing
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  fontSize?: string | number;
  
  // Border
  border?: string;
  borderRadius?: string | number;
  borderWidth?: string | number;
  
  // Shadow
  boxShadow?: string;
  
  // Transform
  transform?: string;
  
  // Display
  display?: string;
  
  // Position
  position?: string;
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  zIndex?: number;
}

export const parseSpacing = (value: number | string | undefined): string | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return `${value}px`;
  return value;
};

export const convertStyleProps = (props: StyleProps): Record<string, any> => {
  const styles: Record<string, any> = {};
  
  // Background
  if (props.bg || props.backgroundColor) {
    styles.background = props.bg || props.backgroundColor;
  }
  
  // Color
  if (props.color) styles.color = props.color;
  if (props.borderColor) styles.borderColor = props.borderColor;
  
  // Padding
  if (props.p) styles.padding = parseSpacing(props.p);
  if (props.px) {
    styles.paddingLeft = parseSpacing(props.px);
    styles.paddingRight = parseSpacing(props.px);
  }
  if (props.py) {
    styles.paddingTop = parseSpacing(props.py);
    styles.paddingBottom = parseSpacing(props.py);
  }
  if (props.pt) styles.paddingTop = parseSpacing(props.pt);
  if (props.pr) styles.paddingRight = parseSpacing(props.pr);
  if (props.pb) styles.paddingBottom = parseSpacing(props.pb);
  if (props.pl) styles.paddingLeft = parseSpacing(props.pl);
  
  // Margin
  if (props.m) styles.margin = parseSpacing(props.m);
  if (props.mx) {
    styles.marginLeft = parseSpacing(props.mx);
    styles.marginRight = parseSpacing(props.mx);
  }
  if (props.my) {
    styles.marginTop = parseSpacing(props.my);
    styles.marginBottom = parseSpacing(props.my);
  }
  if (props.mt) styles.marginTop = parseSpacing(props.mt);
  if (props.mr) styles.marginRight = parseSpacing(props.mr);
  if (props.mb) styles.marginBottom = parseSpacing(props.mb);
  if (props.ml) styles.marginLeft = parseSpacing(props.ml);
  
  // Size
  if (props.width) styles.width = parseSpacing(props.width);
  if (props.height) styles.height = parseSpacing(props.height);
  if (props.minWidth) styles.minWidth = parseSpacing(props.minWidth);
  if (props.maxWidth) styles.maxWidth = parseSpacing(props.maxWidth);
  if (props.minHeight) styles.minHeight = parseSpacing(props.minHeight);
  if (props.maxHeight) styles.maxHeight = parseSpacing(props.maxHeight);
  if (props.fontSize) styles.fontSize = parseSpacing(props.fontSize);
  
  // Border
  if (props.border) styles.border = props.border;
  if (props.borderRadius) styles.borderRadius = parseSpacing(props.borderRadius);
  if (props.borderWidth) styles.borderWidth = parseSpacing(props.borderWidth);
  
  // Shadow
  if (props.boxShadow) styles.boxShadow = props.boxShadow;
  
  // Transform
  if (props.transform) styles.transform = props.transform;
  
  // Display
  if (props.display) styles.display = props.display;
  
  // Position
  if (props.position) styles.position = props.position;
  if (props.top !== undefined) styles.top = parseSpacing(props.top);
  if (props.right !== undefined) styles.right = parseSpacing(props.right);
  if (props.bottom !== undefined) styles.bottom = parseSpacing(props.bottom);
  if (props.left !== undefined) styles.left = parseSpacing(props.left);
  if (props.zIndex !== undefined) styles.zIndex = props.zIndex;
  
  return styles;
};

/**
 * Combines class names, filtering out falsy values
 */
export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}