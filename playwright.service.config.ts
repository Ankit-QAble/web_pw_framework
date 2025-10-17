import { defineConfig } from '@playwright/test';
import { createAzurePlaywrightConfig, ServiceOS } from '@azure/playwright';
import { DefaultAzureCredential } from '@azure/identity';
import config from './playwright.config';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check if we should use Azure Playwright service or grid configuration
const useAzureService = process.env.PLAYWRIGHT_AZURE_SERVICE === 'true';
const wsEndpoint = process.env.PLAYWRIGHT_SERVICE_URL;
const token = process.env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN;
const gridEnabled = !!(wsEndpoint && token && process.env.PLAYWRIGHT_GRID_MODE === '1');

if (useAzureService) {
  /* Learn more about service configuration at https://aka.ms/pww/docs/config */
  export default defineConfig(
    config,
    createAzurePlaywrightConfig(config, {
      exposeNetwork: '<loopback>',
      connectTimeout: 3 * 60 * 1000, // 3 minutes
      os: ServiceOS.LINUX,
      credential: new DefaultAzureCredential(),
    })
  );
} else if (gridEnabled) {
  // Grid configuration using environment variables
  export default defineConfig({
    ...config,
    use: {
      ...config.use,
      connectOptions: {
        wsEndpoint: `${wsEndpoint}?auth=${token}`,
      },
    },
    workers: 1,
  });
} else {
  // Default configuration - just use the base config
  export default defineConfig(config);
}
