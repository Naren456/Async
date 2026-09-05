import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform, Linking, Alert } from 'react-native';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
      handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
      }),
  });
}

export const usePushNotifications = () => {
    const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
    const [notification, setNotification] = useState<Notifications.Notification | undefined>();
    const notificationListener = useRef<Notifications.Subscription | null>(null);
    const responseListener = useRef<Notifications.Subscription | null>(null);

    async function registerForPushNotificationsAsync() {
        let token;

        // Skip automatic registration on web to avoid immediate prompts on load
        if (Platform.OS === 'web') {
            return undefined;
        }

        if (Platform.OS === 'android') {
            try {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            } catch (error) {
                console.log('Error creating notification channel:', error);
            }
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                Alert.alert('Failed to get push token for push notification!');
                return;
            }

            // Learn more about projectId:
            // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
            // EAS projectId is used here.
            try {
                const projectId =
                    Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
                if (!projectId) {
                    // throw new Error('Project ID not found');
                }
                token = (
                    await Notifications.getExpoPushTokenAsync({
                        projectId,
                    })
                ).data;
                console.log(token);
            } catch (e) {
                token = `${e}`;
            }
        } else {
            Alert.alert('Must use physical device for Push Notifications');
        }

        return token;
    }

    useEffect(() => {
        if (Platform.OS !== 'web') {
            registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

            notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                setNotification(notification);
            });

            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                console.log(response);
                const data = response.notification.request.content.data as { url?: string };
                if (data?.url) {
                    Linking.openURL(data.url).catch((err: any) => console.error("Failed to open URL:", err));
                }
            });

            return () => {
                notificationListener.current &&
                    notificationListener.current.remove();
                responseListener.current &&
                    responseListener.current.remove();
            };
        }
    }, []);

    // Helper for explicit web push subscription
    const requestWebPushPermission = async (vapidPublicKey: string) => {
        if (Platform.OS !== 'web' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.log("Web Push not supported on this platform");
            return null;
        }
        try {
            const registration = await navigator.serviceWorker.ready;
            const existingSubscription = await registration.pushManager.getSubscription();
            if (existingSubscription) {
                return JSON.stringify(existingSubscription);
            }
            
            const permission = await window.Notification.requestPermission();
            if (permission !== 'granted') {
                console.log("Notification permission not granted");
                return null;
            }

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidPublicKey
            });
            
            const tokenStr = JSON.stringify(subscription);
            setExpoPushToken(tokenStr);
            return tokenStr;
        } catch (error) {
            console.error("Error subscribing to web push:", error);
            return null;
        }
    };

    return {
        expoPushToken,
        notification,
        requestWebPushPermission
    };
};
