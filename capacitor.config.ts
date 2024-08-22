import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dym.tasks.com',
  appName: 'basic-flow',
  webDir: 'dist',
  server: {
    androidScheme: "https"
  },
  plugins:{
    GoogleAuth: {
       scopes: ["profile", "email"],
       serverClientId: "243962665842-nse544h3k4mb1a5q62vjme6p9pj4jsj0.apps.googleusercontent.com",
       androidClientId: "243962665842-nse544h3k4mb1a5q62vjme6p9pj4jsj0.apps.googleusercontent.com",
       forceCodeForRefreshToken: true
    }
  }
};

export default config;
