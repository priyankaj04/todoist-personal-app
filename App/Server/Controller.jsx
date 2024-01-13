export const Dev = true;
export const NO_OTP = true;
export const URL =`https://${Dev?'dev':''}api.circle.care/v1`;
export const AMPLITUDE_KEY = 'ac06d3d62f996bfc81efa9c0c81a7503';
export const SENTRY_SECRET = 'https://427e1faad2c5451ab1dcea073b5e0029@o1200218.ingest.sentry.io/6654622';

// appcenter codepush release-react -a circlehealth/chcustomerapp -d Production
// appcenter codepush rollback -a circlehealth/chcustomerapp Production --target-release v34
// export JAVA_HOME=$(/usr/libexec/java_home -v 20.0.1)
// watchman watch-del '/Users/calvindas/Desktop/Circlehealth/CircleHealthApp-v2'
// watchman watch-project '/Users/calvindas/Desktop/Circlehealth/CircleHealthApp-v2'
