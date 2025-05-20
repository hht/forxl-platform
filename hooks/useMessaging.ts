import notifee, { AndroidStyle } from '@notifee/react-native'
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { useEffect } from 'react'
import { PermissionsAndroid, Platform } from 'react-native'

import { sendFCMToken } from '~/api/account'

import { useForxlStore } from './useStore'

const requestNotificationPermission = async () => {
    const authStatus = await messaging().requestPermission()
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
    return enabled
}

export const getFCMToken = async () => {
    if (Platform.OS === 'android') {
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
        await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
        })
    }
    const enabled = await requestNotificationPermission()
    if (!enabled) {
        return
    }
    await messaging().registerDeviceForRemoteMessages()
    const token = await messaging().getToken()
    if (token && useForxlStore.getState().fcmToken !== token) {
        useForxlStore.setState({ fcmToken: token })
    }
}

const onMessage = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    await notifee.requestPermission()
    await notifee.displayNotification({
        id: remoteMessage.messageId,
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        data: remoteMessage.data,
        android: {
            channelId: 'default',
            sound: 'default',
            largeIcon: remoteMessage.notification?.android?.smallIcon ?? 'notification_icon',
            color: remoteMessage.notification?.android?.color,
        },
    }).catch(err => {
        console.log('Error displaying notification: ', err)
    })

}

// @ts-ignore
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true

// @ts-ignore
globalThis.RNFB_MODULAR_DEPRECATION_STRICT_MODE = true

messaging().setBackgroundMessageHandler(async (message) => {

})


export const useMessaging = () => {
    const { userNumber, fcmToken, language } = useForxlStore()
    useEffect(() => {
        if (Platform.OS === 'web') {
            return
        }
        getFCMToken()
        const unsubscribe = messaging().onMessage(onMessage)
        return unsubscribe
    }, [])

    useEffect(() => {
        if (userNumber && fcmToken && Platform.OS !== 'web') {
            sendFCMToken()
        }
    }, [userNumber, fcmToken, language])
}