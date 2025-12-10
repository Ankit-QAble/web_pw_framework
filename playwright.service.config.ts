import { defineConfig } from '@playwright/test';
import { createAzurePlaywrightConfig, ServiceAuth, ServiceOS } from '@azure/playwright';
import config from './playwright.config';

function buildServiceConfig() {
  const accessToken =
    process.env.PLAYWRIGHT_SERVICE_AUTH_TOKEN ||
    process.env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN;

  const serviceUrl = process.env.PLAYWRIGHT_SERVICE_URL;

  const hasAzureCreds =
    !!process.env.AZURE_TENANT_ID &&
    !!process.env.AZURE_CLIENT_ID &&
    (!!process.env.AZURE_CLIENT_SECRET || !!process.env.AZURE_CLIENT_CERTIFICATE_PATH);

  const serviceEnabled =
    process.env.CI === 'true' ||
    process.env.AZURE_PLAYWRIGHT_ENABLED === 'true' ||
    (!!accessToken && !!serviceUrl);

  if (!serviceEnabled) {
    console.warn('[playwright.service.config] Service disabled — running locally.');
    return config;
  }

  // 🔥 This is the only supported way for older Azure Playwright versions
  if (accessToken && serviceUrl) {
    console.log('[playwright.service.config] Using access-token auth for Azure Playwright Service.');

    // The SDK reads ONLY from env vars in this version
    process.env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN = accessToken;
    process.env.PLAYWRIGHT_SERVICE_URL = serviceUrl;

    return defineConfig(
      config,
      createAzurePlaywrightConfig(config, {
        serviceAuthType: ServiceAuth.ACCESS_TOKEN,
        exposeNetwork: '<loopback>',
        connectTimeout: 3 * 60 * 1000,
        os: ServiceOS.LINUX,
      })
    );
  }

  if (hasAzureCreds) {
    const { DefaultAzureCredential } = require('@azure/identity');
    console.log('[playwright.service.config] Falling back to DefaultAzureCredential.');
    return defineConfig(
      config,
      createAzurePlaywrightConfig(config, {
        credential: new DefaultAzureCredential(),
        exposeNetwork: '<loopback>',
        connectTimeout: 3 * 60 * 1000,
        os: ServiceOS.LINUX,
      })
    );
  }

  console.warn('[playwright.service.config] No credentials detected — running locally.');
  return config;
}

export default buildServiceConfig();
