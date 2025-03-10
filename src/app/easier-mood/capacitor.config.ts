import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wellcharged.easiermood',
  appName: 'Easier Mood',
  webDir: 'dist',
  server: {
    hostname: 'easier-mood.wellcharged.app',
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0EA5E9',
      androidSplashResourceName: 'splash_easier_mood',
      androidScaleType: 'CENTER_CROP'
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#0EA5E9"
    }
  },
  android: {
    allowMixedContent: true
  },
  ios: {
    contentInset: 'always'
  }
};

export default config; 