import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Card, Chip, IconButton } from 'react-native-paper'
import * as WebBrowser from 'expo-web-browser'
import { MaterialIcons } from '@expo/vector-icons'

import { EventModel } from '../models/event-model'

import { TEXT, YELLOW } from '../theme'
import EventWorkshopAvatar from './EventWorkshopAvatar'

interface Props {
    model: EventModel
    starItem: () => unknown
    starEnabled: boolean
    onPress: () => unknown
}

const EventWorkshopListItem: React.FC<Props> = ({ model, starItem, starEnabled, onPress }) => {
    const subtitle = model.formatInfo()
    const location = model.location_name

    const isZoom = location && location.includes('https://psu.zoom.us')

    const avatar = <EventWorkshopAvatar model={model} />

    const star = (
        <IconButton
            icon={model.starred ? 'star' : 'star-border'}
            size={24}
            animated
            onPress={() => starItem()}
            color={model.starred ? YELLOW : '#000'}
        />
    )

    return (
        <Card style={styles.card} onPress={onPress}>
            <Card.Title
                title={model.event_title}
                titleStyle={styles.title}
                subtitle={subtitle}
                subtitleStyle={styles.subtitle}
                left={() => avatar}
                right={() => (starEnabled ? star : null)}
            />

            <View style={styles.row}>
                {!isZoom && (
                    <Chip icon="location-on" mode="outlined" style={styles.chip}>
                        {location}
                    </Chip>
                )}
                {isZoom && (
                    <Chip
                        mode="outlined"
                        icon={({ size }) => <MaterialIcons name="link" color={ZOOM} size={size} />}
                        style={styles.zoomChip}
                        textStyle={styles.zoomTextStyle}
                        onPress={() => WebBrowser.openBrowserAsync(location)}
                    >
                        Click to join Zoom
                    </Chip>
                )}
            </View>
        </Card>
    )
}

export default EventWorkshopListItem

const ZOOM = 'rgb(41,129,255)'

const styles = StyleSheet.create({
    card: {
        marginLeft: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    title: {
        lineHeight: 32,
        fontSize: 24,
        color: TEXT,
        fontWeight: 'normal',
    },
    subtitle: {
        fontFamily: 'Plex-Mono',
        lineHeight: 18,
        fontSize: 14,
        letterSpacing: 0.2,
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        marginLeft: 16,
        marginRight: 16,
        marginTop: 4,
        marginBottom: 12,
    },
    chip: {
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.12)',
    },
    zoomChip: {
        borderRadius: 8,
        borderWidth: 2,
        borderColor: ZOOM,
    },
    zoomTextStyle: {
        color: ZOOM,
    },
})
