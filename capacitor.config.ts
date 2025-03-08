
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.dbab191b5d1e4a99962f77154a5429df',
  appName: 'glp1polymet',
  webDir: 'dist',
  server: {
    url: 'https://dbab191b-5d1e-4a99-962f-77154a5429df.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // Add any additional configuration options here
  plugins: {
    // Configure plugins as needed
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#ffffff"
    }
  }
};

export default config;
