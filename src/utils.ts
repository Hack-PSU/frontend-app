import * as Notifications from 'expo-notifications'

import { PRIMARY } from './theme'

export async function setNotification(
    identifier: string,
    trigger: Date,
    title: string,
    subtitle: string,
    body: string
): Promise<void> {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    })

    // All this settings stuff is to get it working on iOS
    let settings = await Notifications.getPermissionsAsync()
    while (settings.canAskAgain && !settings.granted) {
        await Notifications.requestPermissionsAsync()
        // Refresh settings.
        settings = await Notifications.getPermissionsAsync()
    }

    if (!settings.canAskAgain && !settings.granted) {
        // Error state, this is bad.
        return
    }

    Notifications.scheduleNotificationAsync({
        identifier,
        content: {
            title: title,
            body: body,
            color: PRIMARY,
            subtitle: subtitle,
        },
        trigger,
    })
}

export async function cancelNotification(identifier: string) {
    Notifications.cancelScheduledNotificationAsync(identifier)
}
