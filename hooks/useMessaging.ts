import notifee from '@notifee/react-native'
import messaging from '@react-native-firebase/messaging'
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

export const useMessaging = () => {
    const { userNumber, fcmToken, language } = useForxlStore()
    useEffect(() => {
        if (Platform.OS === 'web') {
            return
        }
        getFCMToken()
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            await notifee.requestPermission()
            const channelId = await notifee.createChannel({
                id: 'default',
                name: 'Default Channel',
            })
            await notifee.displayNotification({
                id: remoteMessage.messageId,
                title: remoteMessage.notification?.title,
                body: remoteMessage.notification?.body,
                data: remoteMessage.data,
                android: {
                    channelId,
                    sound: 'default',
                },
            }).catch(err => {

            })
        })

        return unsubscribe
    }, [])

    useEffect(() => {
        if (userNumber && fcmToken && Platform.OS !== 'web') {
            sendFCMToken()
        }
    }, [userNumber, fcmToken, language])
}