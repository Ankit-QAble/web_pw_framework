import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import baseConfig from './playwright.config';

dotenv.config();

const wsEndpoint = process.env.PLAYWRIGHT_SERVICE_URL;
const token = process.env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN;
const gridEnabled = !!(wsEndpoint && token && process.env.PLAYWRIGHT_GRID_MODE === '1');

export default defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    ...(gridEnabled && {
      connectOptions: {
        wsEndpoint: `${wsEndpoint}?auth=${token}`,
      },
    }),
  },
  reporter: baseConfig.reporter,
  workers: 10,
});
