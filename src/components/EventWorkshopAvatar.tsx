import React from 'react'
import { StyleSheet } from 'react-native'
import { Avatar } from 'react-native-paper'

import { EventModel } from '../models/event-model'

import { RED, YELLOW, PURPLE } from '../theme'

const EVENT_TYPE_COLORS = {
    activity: YELLOW,
    food: RED,
    workshop: PURPLE,
}

const EVENT_TYPE_TEXT_COLORS = {
    activity: 'rgba(255,255,255,0.89)',
    food: 'rgba(255,255,255,0.89)',
    workshop: 'rgba(255,255,255,0.89)',
}

const EVENT_TYPE_ICONS = {
    activity: 'star',
    food: 'restaurant-menu',
    workshop: 'code',
}

interface Props {
    model: EventModel
}

export default function EventWorkshopAvatar({ model }: Props) {
    return (
        <Avatar.Icon
            size={55}
            icon={EVENT_TYPE_ICONS[model.event_type]}
            color={EVENT_TYPE_TEXT_COLORS[model.event_type]}
            theme={{ colors: { primary: EVENT_TYPE_COLORS[model.event_type] } }}
            style={styles.avatar}
        />
    )
}

const styles = StyleSheet.create({
    avatar: {
        borderRadius: 50,
    },
})
