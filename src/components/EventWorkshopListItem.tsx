import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Card } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'

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
    const location = model.location_name
    const name = model.ws_presenter_names
    const eventTitle = model.event_title

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
            color={model.starred ? RED : '#000'}
        />
    )

    let locationLabel = location
    // Parses location for labeling purposes
    if (location.includes('zoom')) {
        locationLabel = 'Zoom'
    } else if (location.includes('youtube') || location.includes('youtu.be')) {
        locationLabel = 'YouTube'
    } else {
        locationLabel = 'Discord'
    }

    return (
        // <View style ={styles.row}>
        <View>
            {/* Currently, it gives us "3:00p-4:00p" */}
            {/* We want: "3:00pm - 4:00pm " or "3:00pm" */}
            {/* <Text style ={styles.time}>{time}</Text>   TEMP TIME */}
            <Card style={styles.card} onPress={onPress}>
                <View style={styles.row}>
                    {/* Image on the left side */}
                    <View>{avatar}</View>

                    {/* Content in the middle */}
                    <View style={{ marginLeft: 10, width: '65%' }}>
                        <Text style={styles.subtitleTop}>{locationLabel}</Text>
                        <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>
                            {eventTitle}
                        </Text>
                        <Text style={styles.subtitle}>{name}</Text>
                        <View style={styles.centerElements}>
                            <Text style={styles.seeMoreDots}>• • •</Text>
                        </View>
                    </View>
                    {/* Heart */}
                    <View style={{ position: 'absolute', right: 25 }}>
                        {starEnabled ? star : null}
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

const styles = StyleSheet.create({
    card: {
        // marginBottom: 15, REMOVE FOR BUBBLE CARD
        marginLeft: 10, //REMOVE FOR BUBBLE CARD
        marginRight: 10, //REMOVE FOR BUBBLE CARD
        borderRadius: 0, //CHANGE TO '7' FOR BUBBLE CARD
        // elevation:4,  REMOVE FOR BUBBLE CARD
        // shadowOffset: { width: 1, height: 1 }, REMOVE FOR BUBBLE CARD
        // shadowColor: "black", REMOVE FOR BUBBLE CARD
        // shadowOpacity: 0.3, REMOVE FOR BUBBLE CARD
        // shadowRadius: 1, REMOVE FOR BUBBLE CARD
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 10,
    },
    title: {
        lineHeight: 32,
        fontSize: 22,
        color: TEXT,
        fontFamily: 'SpaceGrotesk',
        marginLeft: 10,
        paddingTop: 3,
        paddingBottom: 3,
    },
    subtitle: {
        fontFamily: 'SpaceGrotesk',
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
        alignItems: 'center',
    },
    seeMoreDots: {
        color: 'grey',
    },
    subtitleTop: {
        color: 'grey',
        marginLeft: 10,
        fontWeight: '600',
    },
    centerElements: {
        flex: 1,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
