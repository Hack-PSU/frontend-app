import React, { useState } from 'react'
import { View, StyleSheet, SectionList, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Animated from 'react-native-reanimated'

import Scaffold, { LOGO_SAFE_PADDING } from '../components/Scaffold'
import Subtitle from '../components/Subtitle'
import SegmentedControl from '../components/SegmentedControl'
import ErrorCard from '../components/ErrorCard'
import EventWorkshopListItem from '../components/EventWorkshopListItem'
import { EventModelJSON, EventModel } from '../models/event-model'
import * as Utils from '../utils'

import useScrollY from '../hooks/useScrollY'
import useEvents from '../data/hooks/useEvents'

import { BACKGROUND } from '../theme'

const styles = StyleSheet.create({
    title: {
        paddingTop: LOGO_SAFE_PADDING,
    },
    section: {
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: BACKGROUND,
    },
    loading: {
        margin: 20,
    },
})

const ALL = 'All'
const STARRED = 'Starred'

export const EVENTS = 'Events'
export const WORKSHOPS = 'Workshops'
const WORKSHOP_EVENT_TYPE = 'workshop'

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList)

interface Props {
    eventType: 'Events' | 'Workshops'
}

const EventWorkshopPage: React.FC<Props> = (props) => {
    const [filter, setFilter] = useState(ALL)

    // This is needed to ensure that offline data and online data isn't combined
    // on every rerender.
    const [loadedBothOfflineOnline, setLoadedBothOfflineOnline] = useState(false)
    // This is so that the page is rerendered when offlineData is loaded with
    // actual data from storage. Events that are stored offline were starred
    // previously.
    const [offlineData, setOfflineData] = useState([])

    // Used for storing starred items.
    const storeList = async (value) => {
        try {
            // Change the dates format to match with what comes in with the server.
            const valWithModifiedDate = value.map((event) => {
                event.event_start_time = new Date(event.event_start_time).getTime()
                event.event_end_time = new Date(event.event_end_time).getTime()
                return event
            })
            await AsyncStorage.setItem(props.eventType, JSON.stringify(valWithModifiedDate))
        } catch (e) {
            console.log(e)
        }
    }

    const readStoredList = async () => {
        try {
            // Separated data for workshops and actual events so they don't conflict
            // from the 2 EventWorkshopPage instances (one on EventsRoute, other on
            // WorkshopsRoute).
            const value = await AsyncStorage.getItem(props.eventType)

            if (value !== null) {
                // Update state when offline data is loaded for a rerender.
                setOfflineData(JSON.parse(value) as EventModelJSON[])
            }
        } catch (e) {
            console.log(e)
        }
    }

    const setEventWorkshopNotification = (item: EventModel) => {
        // Want to make sure we don't alter the date in EventModel, just here locally.
        const notifTime = new Date(item.event_start_time)
        // Set notification to show 10 mins before the event.
        notifTime.setMinutes(item.event_start_time.getTime() - 10)

        // To remove the "s" at the end of "events" and "workshops".
        const eventTypeString = props.eventType.slice(0, -1)

        Utils.setNotification(
            item.uid,
            notifTime,
            item.event_title,
            eventTypeString,
            `10 mins before the ${eventTypeString} begins!`
        )
    }

    // To update a notification with new info from online, it's easiest to cancel it, wait for it to be cancelled, then
    // set it again but with new details.
    const updateNotification = async (updatedEvent: EventModel) => {
        await Utils.cancelNotification(updatedEvent.uid)
        setEventWorkshopNotification(updatedEvent)
    }

    // Load offlineData with actual data if it's not already full.
    if (!offlineData.length) {
        readStoredList()
    }

    const { scrollY, onScroll } = useScrollY()

    const onlineData = useEvents()

    // This is the actual data shown on the page. This is a combination and
    // onlineData and offlineData (if they both exist).
    const [data, setData] = useState([])

    // If the data hasn't been filled yet, check to see if the offline or online
    // data loaded first and set it accordingly instead of waiting for both so
    // the user can see results more quickly.
    if (!data.length) {
        if (offlineData.length) {
            setData(offlineData)
        }
        if (onlineData.data) {
            setData(onlineData.data)
        }
    }

    // This is for when both offline and online are both loaded for the first
    // time. We combine them, which essentially means looking to see if an online
    // event shows up as an offline event and marking that event as starred.
    // If their id's match, we mark it as starred. The reason we have onlineData
    // overriding offlineData is that info (descriptions, locations, etc.) may
    // change and events could be cancelled. This means that if an offline event
    // isn't found in online data, it is discarded.
    if (!loadedBothOfflineOnline && offlineData.length && onlineData.data) {
        setData(
            onlineData.data.map((onlineEvent) => {
                // eventMatch is an event found both in both onlineData and
                // offlineData. This means it was starred in a previous session.
                const eventMatch = offlineData.find(
                    (offlineEvent) => onlineEvent.uid === offlineEvent.uid
                )
                if (eventMatch) {
                    // We mark the onlineEvent as starred instead of using the eventMatch
                    // and returning that because eventMatch is from offline data and
                    // could have updated info from the server.
                    onlineEvent.starred = true

                    updateNotification(onlineEvent)
                }
                return onlineEvent
            })
        )
        // After combining the data, we set this to true so this entire if
        // statement isn't running with every rerender. Otherwise, it would
        // decrease performance and could override stars from this session causing
        // bugs.
        setLoadedBothOfflineOnline(true)
    }

    const renderItem = ({ item }) => (
        <EventWorkshopListItem key={item.uid} model={item} starItem={() => starItem(item)} />
    )

    // This is called when the star button is clicked on an item.
    const starItem = (item: EventModel) => {
        // Don't copy the pointer of the array, copy the values of the array.
        let temp = [...data]

        // Find which index the event is in with the uid.
        const index = temp.findIndex((event) => event.uid === item.uid)
        temp[index].starred = !temp[index].starred

        // If it got starred, set it as a notification. If not, cancel it.
        // Note that we need to program this in case an event gets updated/cancelled.
        if (temp[index].starred) {
            setEventWorkshopNotification(item)
        } else {
            Utils.cancelNotification(item.uid)
        }

        setData(temp)

        // Make sure we are only storing events that are starred and are from the
        // right category.
        storeList(
            temp.filter(
                (event) =>
                    event.starred &&
                    (props.eventType === EVENTS
                        ? event.event_type !== WORKSHOP_EVENT_TYPE
                        : event.event_type === WORKSHOP_EVENT_TYPE)
            )
        )
    }

    const listHeader = (
        <View style={styles.title}>
            <Subtitle style={{ paddingBottom: 0 }}>{props.eventType}</Subtitle>
        </View>
    )
    const sectionHeader = (
        <View style={styles.section}>
            <SegmentedControl
                values={[ALL, STARRED]}
                value={filter}
                onChange={(newValue) => setFilter(newValue)}
            />
            {!onlineData.data && (
                <ActivityIndicator animating size="large" style={styles.loading} />
            )}
            {onlineData.error && <ErrorCard error={onlineData.error} />}
        </View>
    )

    let correctEventList = data.filter((event) =>
        props.eventType === EVENTS
            ? event.event_type !== WORKSHOP_EVENT_TYPE
            : event.event_type === WORKSHOP_EVENT_TYPE
    )
    // If the user is in the starred section, then only show the starred items.
    if (filter === STARRED) {
        correctEventList = correctEventList.filter((event) => event.starred)
    }

    return (
        <Scaffold scrollY={scrollY}>
            <AnimatedSectionList
                sections={[
                    {
                        data: correctEventList,
                    },
                ]}
                renderItem={renderItem}
                scrollEventThrottle={1}
                onScroll={onScroll}
                renderScrollComponent={(props) => <Animated.ScrollView {...props} />}
                keyExtractor={(item) => item.uid}
                ListHeaderComponent={listHeader}
                stickyHeaderIndices={[0]}
                renderSectionHeader={() => sectionHeader}
                stickySectionHeadersEnabled={true}
            />
        </Scaffold>
    )
}

export default EventWorkshopPage
