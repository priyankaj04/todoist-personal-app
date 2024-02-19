//Firebase notification services
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();

  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    GetFCMToken();
  }
};

const GetFCMToken = async () => {
  const FCMToken = await AsyncStorage.getItem('fcmToken'); console.log("FCMTOKEN Token",FCMToken)
  if (!FCMToken) {
    try {
      const fcmToken = await messaging().getToken(); 
      if (fcmToken) {
        console.log('NEW GENERATED FCM TOKEN: ', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log('ERROR GET IN FCM TOKEN', error);
    }
  }
};

// export const NavigateToPage = (setSelectedTab, dispatch, navigationRef,navigateto,url,title)=>{
//   if(navigateto == 'profile') dispatch(setSelectedTab('Profile'));
//   if(navigateto == 'home') dispatch(setSelectedTab('Home'));
//   if(navigateto == 'care') dispatch(setSelectedTab('Care'));
//   if(navigateto == 'benefits') dispatch(setSelectedTab('Benefits'));

//   if(navigateto == 'webpage'){
//     navigationRef.navigate('CustomWebView', {
//       url: url,
//       title: title,
//     });
//   }
// }

const notificationListener = async (setSelectedTab, dispatch, navigationRef) => { console.log('called')
  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    console.log( 'Notification caused app to open from background state:', remoteMessage.notification );
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
  });

  messaging().onMessage(async (remoteMessage) => {
    console.log('Message handled in the foreground!', remoteMessage);
  });

  // Check whether an initial notification is available
  messaging().getInitialNotification().then((remoteMessage) => {
    if (remoteMessage) {
      console.log( 'Notification caused app to open from quit state:', remoteMessage );
    }
  });

  // messaging().onNotificationOpenedApp(remoteMessage => {
  //   NavigateToPage(setSelectedTab, dispatch, navigationRef, remoteMessage?.data?.navigateto, remoteMessage?.data?.url ?? '', remoteMessage?.data?.title ?? '')
  // });
  
  // // Also, handle the initial notification when the app is not open
  // messaging().getInitialNotification().then(remoteMessage => {
  //   if (remoteMessage) {
  //     NavigateToPage(setSelectedTab, dispatch, navigationRef, remoteMessage?.data?.navigateto, remoteMessage?.data?.url ?? '', remoteMessage?.data?.title ?? '')
  //   }
  // });

};


export { requestUserPermission, notificationListener };