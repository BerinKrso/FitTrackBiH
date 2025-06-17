
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.18ff374cbbc143c197075effdff119c2',
  appName: 'FitTrack',
  webDir: 'dist',
  server: {
    url: 'https://18ff374c-bbc1-43c1-9707-5effdff119c2.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3B82F6',
      showSpinner: false
    }
  }
};

export default config;
