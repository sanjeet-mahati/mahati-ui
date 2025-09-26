import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // Adjust to your entry file
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
    external: ['react', 'react-dom'], // Important: Keep React external
  clean: true,
  minify: true,

});
