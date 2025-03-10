import { CapacitorConfig } from '@capacitor/core';

// Determine which app to build based on environment variable or config
const appToBuild = process.env.APP_TO_BUILD || 'main'; // Default to main app

// Base configuration shared by all apps
const baseConfig: Partial<CapacitorConfig> = {
  webDir: 'dist',
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
    Haptics: {
      enabled: true
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFFFFF",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP"
    }
  }
};

// Configuration for each specific app
const appConfigs: Record<string, CapacitorConfig> = {
  main: {
    ...baseConfig,
    appId: 'dev.lovable.wellcharged6553273cf8984999',
    appName: 'The Well-Charged',
    server: {
      url: 'https://6553273c-f898-4999-8828-954e9ccdbbb6.lovableproject.com?forceHideBadge=true',
      cleartext: true
    }
  },
  'mission-fresh': {
    ...baseConfig,
    appId: 'dev.lovable.missionfresh',
    appName: 'Mission Fresh',
    server: {
      // In development mode, you might use localhost
      // For production, you would use your deployed URL
      androidScheme: 'https'
    }
  },
  'easier-sleep': {
    ...baseConfig,
    appId: 'dev.lovable.easiersleep',
    appName: 'Easier Sleep',
    server: {
      androidScheme: 'https'
    }
  },
  'easier-mood': {
    ...baseConfig,
    appId: 'dev.lovable.easiermood',
    appName: 'Easier Mood',
    server: {
      androidScheme: 'https'
    }
  },
  'easier-focus': {
    ...baseConfig,
    appId: 'dev.lovable.easierfocus',
    appName: 'Easier Focus',
    server: {
      androidScheme: 'https'
    }
  },
  'noise-box': {
    ...baseConfig,
    appId: 'dev.lovable.noisebox',
    appName: 'The Noise Box',
    server: {
      androidScheme: 'https'
    }
  },
  'care-connector': {
    ...baseConfig,
    appId: 'dev.lovable.careconnector',
    appName: 'Care Connector',
    server: {
      androidScheme: 'https'
    }
  }
};

// Select the configuration based on the app being built
const config: CapacitorConfig = appConfigs[appToBuild] || appConfigs.main;

// Log which app is being built (helpful for CI/CD and debugging)
console.log(`Building Capacitor app: ${config.appName} (${appToBuild})`);

export default config;
