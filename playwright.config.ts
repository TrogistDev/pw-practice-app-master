import { defineConfig, devices } from "@playwright/test";
import type { TestOptions } from "./test-options";
import { createArgosReporterOptions } from "@argos-ci/playwright/reporter";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../pw-practice-app-master/.env"),
});

export default defineConfig<TestOptions>({
  // timeout: 10000,
  // globalTimeout: 60000,
  expect: {
    // timeout: 2000
  },

  retries: 1,
  reporter: [
    ["html"],
    process.env.CI ? ["dot"] : ["list"],
    [
      "@argos-ci/playwright/reporter",
      createArgosReporterOptions({
        // Upload to Argos on CI only.
        uploadToArgos: !!process.env.CI,
      }),
    ],
  ],

  use: {
    baseURL: "http://localhost:4200",
    globalsQaURL: "https://www.globalsqa.com/demo-site/draganddrop",
    trace: "on-first-retry",
    actionTimeout: 5000,
    navigationTimeout: 5000,
    screenshot: 'only-on-failure',

    video: {
      mode: "off",
      size: { width: 1920, height: 1080 },
    },
  },

  projects: [
    {
      name: "dev",
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:4200" },
    },
    {
      name: "chromium",
    },
    {
      name: "firefox",
      use: {
        browserName: "firefox",
      },
    },
    {
      name: "pageObjectFullScreen",
      testMatch: "usePageObjects.spec.ts",
      use: {
        viewport: {
          width: 1920,
          height: 1080,
        },
        video: {
          mode: "on",
        },
      },
    },
    {
      name: "mobile",
      testMatch: "testmobile.spec.ts",
      use: {
        ...devices["iPhone 8"],
      },
    },
  ],
  webServer: {
    command: "npm run start",
    url: "http://localhost:4200", // Removi o 's' para bater com o padrão do npm start
    timeout: 120 * 1000, // Aumentei para 2 minutos (Angular é lento no Docker)
    reuseExistingServer: !process.env.CI,
    stdout: "ignore", // Mude para 'pipethrough' se quiser ver o log do Angular subindo
    stderr: "pipe",
  },
});
