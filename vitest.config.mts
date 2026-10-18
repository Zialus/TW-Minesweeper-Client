import { defineConfig } from 'vitest/config'
import codspeedPlugin from '@codspeed/vitest-plugin'

export default defineConfig({
  plugins: [codspeedPlugin()],
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.bench.ts'],
    },
  },
})
