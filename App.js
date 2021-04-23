import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Button, View } from 'react-native';
import * as Notifications from 'expo-notifications';


//expo-permissions has been deprecated.
// import * as Permissions from 'expo-permissions';
Notifications.setNotificationHandler({
handleNotification: () =>{
  return {
    shouldShowAlert:true,
    
  };
}
});

export default function App() {
  useEffect(() => {
    Notifications.getPresentedNotificationsAsync()
      .then((statusObj) => {
        if (statusObj.status !== 'granted') {
          return Notifications.requestPermissionsAsync()
        }
        return statusObj;
      })
      .then((statusObj) => {
        console.log(statusObj);
        if (statusObj.status !== 'granted') {
          throw new Error("Permission not granted !");
        }
      })
      .then(()=>{
        return Notifications.getExpoPushTokenAsync();
      })
      .then(responce =>{
        console.log(responce.data);
      })
      .catch((err)=>{
        console.log(err);
        return null;
      })
  }, []);

  useEffect(()=>{
    const backgroundSubscription= Notifications.addNotificationResponseReceivedListener(
       response =>{
         console.log("Response objesi",response);
       }
    );
     const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
        console.log("Notification Objesi",notification);
      });
      return () =>{
        backgroundSubscription.remove();
        foregroundSubscription.remove();

      }
  },[]);

  const triggerNotificationHandler = () => {
    //This block is local push notification

    // Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: 'My first local notification',
    //     body: 'This is the first local notification we are sending!',
    //   },
    //   trigger: {
    //     seconds: 2,
    //   },
    // });

  };

  return (
    <View style={styles.container}>
      <Button
        title="Trigger Notification"
        onPress={triggerNotificationHandler}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
