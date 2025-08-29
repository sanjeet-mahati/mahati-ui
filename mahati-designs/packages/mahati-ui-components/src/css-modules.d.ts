// This file provides type definitions for CSS Modules.
// It tells TypeScript that any import ending in ".module.css"
// will be an object where keys and values are both strings.
// This is necessary for the DTS (declaration file) build to succeed.
declare module "*.module.css" {
  const content: Record<string, string>;
  export = content;
}
