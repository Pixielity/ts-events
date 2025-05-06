import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  treeshake: true,
  external: ['class-validator', 'class-transformer', 'reflect-metadata'],
  esbuildOptions(options) {
    options.footer = {
      js: 'if (typeof module !== "undefined") { module.exports = module.exports.default; }',
    }
  },
})
