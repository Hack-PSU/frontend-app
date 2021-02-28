import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Card, Chip, IconButton } from 'react-native-paper'
import * as WebBrowser from 'expo-web-browser'
import { MaterialIcons } from '@expo/vector-icons'

import { EventModel } from '../models/event-model'

import { TEXT, RED } from '../theme'
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
            size={34}
            animated
            onPress={() => starItem()}
            color={model.starred ? RED : '#000'}
        />
    )

    return (
        <View style ={styles.row}>
        {/* TODO : FIX TIME IMPLEMENTATION */}
        {/* Currently, it gives us "3:00p-4:00p" */}
        {/* We want: "3:00pm - 4:00pm " or "3:00pm" */}
        <Text style ={styles.time}>{subtitle}</Text>
        {/* <Text style ={styles.time}>{"3:00"+ '\n' +"PM"}</Text> */}
        <Card style={styles.card} onPress={onPress}>
           
            <Card.Title
                title={model.event_title}
                titleStyle={styles.title}
                // NEED TO FIX THIS - Right now, "subtitle" returns a
                // time. We need the speaker/presenter under the subtitle
                // Which is why zoom is currently hardcoded
                subtitle={"Zoom"}
                subtitleStyle={styles.subtitle}
                right={() => (starEnabled ? star : null)}
            />
            <View style={styles.centerElements}><Text style={styles.seeMoreDots}>• • •</Text></View>
        </Card>
        
        </View>
    )
}

export default EventWorkshopListItem

const ZOOM = 'rgb(41,129,255)'

const styles = StyleSheet.create({
    card: {
        width: '70%',
        marginBottom: 15,
        borderRadius: 7,
        elevation:4,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "black",
        shadowOpacity: 0.3,
        shadowRadius: 2,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 10,
    },
    title: {
        lineHeight: 32,
        fontSize: 24,
        color: TEXT,
        fontWeight: 'normal',
        marginLeft: 10,
    },
    subtitle: {
        //fontFamily: '',
        lineHeight: 25,
        fontSize: 18,
        letterSpacing: 0.2,
        color: '#6A85B9',
        marginLeft: 10,
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
    time: {
        width: '20%',
        color: '#6A85B9',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: '600'
    },
    seeMoreDots: {
        color: "grey",
    },
    centerElements: {
        flex: 1,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
    }
})
