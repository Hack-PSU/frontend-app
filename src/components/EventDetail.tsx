import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Card, Chip, IconButton, List, Paragraph } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'

import { EventModel } from '../models/event-model'
import EventWorkshopAvatar from './EventWorkshopAvatar'

import { TEXT, YELLOW } from '../theme'
import { BottomSheetScrollView, TouchableHighlight } from '@gorhom/bottom-sheet'
import { WebBrowser } from 'expo'

interface Params {
    model: EventModel
    starItem: () => unknown
}

export default function EventDetail({ model, starItem }: Params) {
    const subtitle = model.formatInfo()
    const description = model.event_description
    const location = model.location_name

    const [isStarred, setIsStarred] = useState(model.starred)
    const isZoom = location && location.includes('https://psu.zoom.us')

    const avatar = <EventWorkshopAvatar model={model} />
    const star = (
        <TouchableHighlight
            activeOpacity={0.4}
            underlayColor="#DDDDDD"
            onPress={() => {
                starItem()
                setIsStarred(!isStarred)
            }}
        >
            <IconButton
                icon={isStarred ? 'star' : 'star-border'}
                size={24}
                animated
                color={isStarred ? YELLOW : '#000'}
            />
        </TouchableHighlight>
    )

    const card = (
        <Card.Title
            title={model.event_title}
            titleStyle={styles.title}
            subtitle={subtitle}
            subtitleStyle={styles.subtitle}
            left={() => avatar}
            right={() => star}
        />
    )

    return (
        <BottomSheetScrollView contentContainerStyle={styles.root}>
            {card}
            {!!description && (
                <List.Section>
                    <Card style={styles.card}>
                        <List.Subheader>Description</List.Subheader>
                        <Paragraph style={styles.paragraph}>{model.event_description}</Paragraph>
                    </Card>
                </List.Section>
            )}
            <List.Section style={styles.row}>
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
            </List.Section>
        </BottomSheetScrollView>
    )
}

const ZOOM = 'rgb(41,129,255)'

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
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
    card: {
        margin: 16,
        paddingTop: 8,
        paddingBottom: 8,
        elevation: 0,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.12)',
    },
    paragraph: {
        margin: 16,
        marginBottom: 32,
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        marginLeft: 16,
        marginRight: 16,
        marginTop: 0,
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
