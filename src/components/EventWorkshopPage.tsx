import React, { useCallback, useState } from 'react'
import { View, StyleSheet, SectionList, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Animated from 'react-native-reanimated'
import { useBottomSheetModal, BottomSheetOverlay } from '@gorhom/bottom-sheet'

import Scaffold, { LOGO_SAFE_PADDING } from '../components/Scaffold'
import Subtitle from '../components/Subtitle'
import SegmentedControl from '../components/SegmentedControl'
import ErrorCard from '../components/ErrorCard'
import EventWorkshopListItem from '../components/EventWorkshopListItem'
import { EventModelJSON } from '../models/event-model'
import { EventModel } from '../models/event-model'

import useScrollY from '../hooks/useScrollY'
import useEvents from '../data/hooks/useEvents'

import { BACKGROUND } from '../theme'
import EventDetail from './EventDetail'

const ALL = 'All'
const STARRED = 'Starred'

export const EVENTS = 'Events'
export const WORKSHOPS = 'Workshops'
const WORKSHOP_EVENT_TYPE = 'workshop'

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList)

const SNAP_POINTS = ['50%', '90%']

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
    const storeList = useCallback(
        async (value) => {
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
        },
        [props.eventType]
    )

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

    // Load offlineData with actual data if it's not already full.
    if (!offlineData.length) {
        readStoredList()
    }

    const { scrollY, onScroll } = useScrollY()

    // Renamed to more clearly differentiate other names.
    const onlineData = useEvents()

    // This is the actual data shown on the page. This is a combination and
    // onlineData and offlineData (if they both exist).
    const [data, setData] = useState([])

    // If the data hasn't been filled yet, check to see if the offline or online
    // data loaded first and set it accordingly instead of waiting for both so
    // the user can see results more quickly.
    if (!data.length) {
        if (offlineData.length) {
            setData(EventModel.parseFromJSONArray(offlineData))
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

    // This is called when the star button is clicked on an item.
    const starItem = useCallback(
        (item) => {
            // Don't copy the pointer of the array, copy the values of the array.
            let temp = [...data]

            // Find which index the event is in with the uid.
            const index = temp.findIndex((event) => event.uid === item.uid)
            temp[index].starred = !temp[index].starred

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
        },
        [data, props.eventType, storeList]
    )

    const { present } = useBottomSheetModal()

    const setDetailItem = useCallback(
        (item: EventModel) => {
            present(<EventDetail model={item} starItem={() => starItem(item)} />, {
                snapPoints: SNAP_POINTS,
                initialSnapIndex: 0,
                animationDuration: 350,
                overlayComponent: BottomSheetOverlay,
                overlayOpacity: 0.57,
                dismissOnOverlayPress: true,
            })
        },
        [present, starItem]
    )

    const renderItem = ({ item }) => (
        <EventWorkshopListItem
            key={item.uid}
            model={item}
            starItem={() => starItem(item)}
            onPress={() => setDetailItem(item)}
        />
    )

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
        <>
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
                    renderScrollComponent={(viewProps) => <Animated.ScrollView {...viewProps} />}
                    keyExtractor={(item) => item.uid}
                    ListHeaderComponent={listHeader}
                    stickyHeaderIndices={[0]}
                    renderSectionHeader={() => sectionHeader}
                    stickySectionHeadersEnabled={true}
                />
            </Scaffold>
        </>
    )
}

export default EventWorkshopPage

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
