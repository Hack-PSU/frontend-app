import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Card, Chip, IconButton, Title, Paragraph, Avatar} from 'react-native-paper'
import * as WebBrowser from 'expo-web-browser'
import { MaterialIcons,MaterialCommunityIcons } from '@expo/vector-icons'

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
        // <IconButton
        //     icon={model.starred ? 'star' : 'star-border'}
        //     size={34}
        //     animated
        //     onPress={() => starItem()}
        //     color={model.starred ? RED : '#000'}
        // />
        <MaterialCommunityIcons 
            name={model.starred ? 'heart' : 'heart-outline'} 
            size={34} 
            animated
            onPress={() => starItem()}
            color={model.starred ? RED : '#000'} />
    )

    const time = (
        // Time comes in "3:00p-4:00p"
        // Format to produce 3:00pm 
        subtitle.split(" ", 1) + "m"
    )

    return (
        // <View style ={styles.row}>
        <View>
        {/* Currently, it gives us "3:00p-4:00p" */}
        {/* We want: "3:00pm - 4:00pm " or "3:00pm" */}
        <Text style ={styles.time}>{time}</Text>
        <Card style={styles.card} onPress={onPress}>

        <View style ={styles.row}>
            {/* Image on the left side */}
            <View>
                {avatar}
            </View>
            
            {/* Content in the middle */}
            <View style={{marginLeft: 10, width:'70%'}}>
                <Text style={styles.subtitleTop}>Zoom</Text>
                <Text style={styles.title}  numberOfLines = {1} ellipsizeMode={'tail'}>{model.event_title}</Text>
                <Text style={styles.subtitle}>{"Ali Malik"}</Text>
                <View style={styles.centerElements}><Text style={styles.seeMoreDots}>• • •</Text></View>
            </View>
            {/* Heart */}
            <View style={{position: 'absolute', right: 25}}>
            {(starEnabled ? star : null)}
            </View>
        </View>


            {/* <Card.Title
                title={model.event_title}
                titleStyle={styles.title}
                // NEED TO FIX THIS - Right now, "subtitle" returns a
                // time. We need the speaker/presenter under the subtitle
                // Which is why zoom is currently hardcoded
                // subtitle={" •Zoom"}
                subtitle={ "Ali Malik"}
                subtitleStyle={styles.subtitle}
                left={() => avatar}
                right={() => (starEnabled ? star : null)}
            /> */}
        </Card>

        </View>
    )
}

export default EventWorkshopListItem

const ZOOM = 'rgb(41,129,255)'

const styles = StyleSheet.create({
    card: {
        marginBottom: 15,
        margin: 10,
        borderRadius: 7,
        elevation:4,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "black",
        shadowOpacity: 0.3,
        shadowRadius: 1,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 10,
    },
    title: {
        lineHeight: 32,
        fontSize: 22,
        color: TEXT,
        fontWeight: 'normal',
        marginLeft: 10,
        paddingTop: 3,
        paddingBottom: 3,
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
        // justifyContent: 'space-between',
        alignItems:'center'
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
        color: '#6A85B9',
        marginLeft: 13,
        fontSize: 25,
        fontFamily: 'SpaceGrotesk',
        fontWeight: '600'
    },
    seeMoreDots: {
        color: "grey",
    },
    subtitleTop: {
        color: "grey",
        marginLeft: 10,
        fontWeight: '600',
    },
    centerElements: {
        flex: 1,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
    }
})
