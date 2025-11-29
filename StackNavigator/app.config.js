import 'dotenv/config';

export default {
  expo: {
    name: "RunTillFun",
    slug: "RunTillFun",
    version: "1.0.0",

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/rtficon.png",
        backgroundColor: "#ffffff"
      },
      config: {
        googleMaps: {
          apiKey: process.env.MAPS_KEY
        }
    
      },
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACTIVITY_RECOGNITION"
      ],
      package: "com.yagiz0ve1.RunTillFun"
    },

    ios: {
      supportsTablet: true
    },

    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID
    }
  }
};
