
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b6e41954301141f3809a49e9ae024251',
  appName: 'taskhub25',
  webDir: 'dist',
  server: {
    url: "https://b6e41954-3011-41f3-809a-49e9ae024251.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#f8f8f8",
    },
  },
};

export default config;
