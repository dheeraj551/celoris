import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.celoris.social',
  appName: 'Celoris Social',
  webDir: 'out',
  server: {
    url: 'https://celoris.vercel.app/social',
    cleartext: true
  }
};

export default config;
