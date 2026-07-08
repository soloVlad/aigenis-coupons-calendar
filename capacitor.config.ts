import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.slvd.aigeniscouponcalendar',
  appName: 'Coupons',
  webDir: 'dist/aigenis-coupons-calendar/browser',
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
