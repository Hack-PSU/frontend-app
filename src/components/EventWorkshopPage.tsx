import React, { useCallback, useMemo, useState } from 'react'
import { View, StyleSheet, SectionList, ActivityIndicator,ImageBackground } from 'react-native'
import { Title } from 'react-native-paper'
import AsyncStorage from '@react-native-community/async-storage'
import Animated from 'react-native-reanimated'
import { useBottomSheetModal, BottomSheetOverlay } from '@gorhom/bottom-sheet'

import Scaffold, { LOGO_SAFE_PADDING } from '../components/Scaffold'
import Subtitle from '../components/Subtitle'
import SegmentedControl from '../components/SegmentedControl'
import ErrorCard from '../components/ErrorCard'
import EventWorkshopListItem from '../components/EventWorkshopListItem'
import { EventModelJSON, EventModel } from '../models/event-model'
import * as Utils from '../utils'

import useScrollY from '../hooks/useScrollY'
import useEvents from '../data/hooks/useEvents'

import { BACKGROUND, PRIMARY, TEXT_LIGHT } from '../theme'
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
    //****************** STATE DECLARATIONS ******************//

    const [filter, setFilter] = useState<'All' | 'Starred'>(ALL)

    // This is needed to ensure that offline data and online data isn't combined
    // on every rerender.
    const [loadedBothOfflineOnline, setLoadedBothOfflineOnline] = useState<boolean>(false)
    // This is so that the page is rerendered when offlineData is loaded with
    // actual data from storage. Events that are stored offline were starred
    // previously.
    const [offlineData, setOfflineData] = useState<EventModel[]>([])

    const { scrollY, onScroll } = useScrollY()

    const onlineData = useEvents()

    // This is the actual data shown on the page. This is a combination and
    // onlineData and offlineData (if they both exist).
    const [data, setData] = useState<EventModel[]>([])

    //****************** HELPER METHODS ******************//

    // Stores the events specified in the parameter.
    // We don't specificy the parameter type becaues we change the type of event_start/end_time from a Date to a number,
    // but we pass in EventModel[]
    const storeList = useCallback(
        async (events: any[]): Promise<void> => {
            try {
                // Change the dates format to match with what comes in with the server.
                const valWithModifiedDate = events.map((event) => {
                    // Change from Date to number so it's "JSON-ifiable"
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

    // Sets offlineData from events in device storage.
    const readStoredList = async (): Promise<void> => {
        try {
            // Separated data for workshops and actual events so they don't conflict
            // from the 2 EventWorkshopPage instances (one on EventsRoute, other on
            // WorkshopsRoute).
            const value = await AsyncStorage.getItem(props.eventType)

            if (value !== null) {
                // Update state when offline data is loaded for a rerender.
                // Parse json in an array and make sure it's EventModel, not EventModelJSON.
                const convertedOfflineData = (JSON.parse(
                    value
                ) as EventModelJSON[]).map((eventModelJson) => EventModel.parseJSON(eventModelJson))
                setOfflineData(convertedOfflineData)
            }
        } catch (e) {
            console.log(e)
        }
    }

    // Called when an event gets starred or updated from online data on initialization
    const setEventWorkshopNotification = useCallback(
        (item: EventModel): void => {
            // 600000 is 10 mins in milliseconds
            const notifTime = new Date(Number(item.event_start_time) - 600000)

            // To remove the "s" at the end of "events" and "workshops".
            const eventTypeString = props.eventType.slice(0, -1)

            Utils.setNotification(
                item.uid,
                notifTime,
                item.event_title,
                eventTypeString,
                `10 mins before the ${eventTypeString} begins!`
            )
        },
        [props.eventType]
    )

    // Called when the star button is clicked on an item.
    const starItem = useCallback(
        (item: EventModel): void => {
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
        },
        [data, props.eventType, setEventWorkshopNotification, storeList]
    )

    //****************** DATA PROCESSING AND FILTERING ******************//

    // Load offlineData with actual data if it's not already full.
    if (!offlineData.length) {
        readStoredList()
    }

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
    // isn't found in online data, it is discarded. We also want to update the
    // notifications, so we apply that same logic to them too.
    if (!loadedBothOfflineOnline && offlineData.length && onlineData.data) {
        Utils.cancelAllNotifications()

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

                    setEventWorkshopNotification(onlineEvent)
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

    let correctEventList = data.filter((event) =>
        props.eventType === EVENTS
            ? event.event_type !== WORKSHOP_EVENT_TYPE
            : event.event_type === WORKSHOP_EVENT_TYPE
    )
    // If the user is in the starred section, then only show the starred items.
    if (filter === STARRED) {
        correctEventList = correctEventList.filter((event) => event.starred)
    }

    //****************** LAYOUT BUILD ******************//

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
            starEnabled={true}
        />
    )
    
    //const image = { uri: "https://reactjs.org/logo-og.png" };

    
    const listHeader = (
        <ImageBackground source={require('../../assets/images/mountain.png')} style={styles.image}>
            <View style={styles.title}>
                <Subtitle style={styles.titleText}>{props.eventType}</Subtitle>
                <View style={styles.filter}>
                    <SegmentedControl
                        values={[ALL, STARRED]}
                        value={filter}
                        onChange={(newValue) => setFilter(newValue as 'All' | 'Starred')}
                    />
                    {!onlineData.data && (
                        <ActivityIndicator animating size="large" style={styles.loading} />
                    )}
                    {onlineData.error && <ErrorCard error={onlineData.error} />}
                </View>
        </View>
        </ImageBackground>
    )

    const sections = useMemo(() => {
        type Day = { data: EventModel[]; key: string }
        const days: Day[] = []

        correctEventList.forEach((event) => {
            const weekday = event.getWeekday()

            let foundDay: Day
            for (const day of days) {
                if (day.key === weekday) {
                    foundDay = day
                    break
                }
            }

            if (foundDay) {
                foundDay.data.push(event)
            } else {
                days.push({
                    data: [event],
                    key: weekday,
                })
            }
        })

        return days
    }, [correctEventList])

    const renderSectionHeader = useMemo(() => {
        return ({ section }: any) => {
            return <Title style={styles.section}>{section.key}</Title>
        }
    }, [])

    return (
        <>
            <Scaffold scrollY={scrollY}>
                <AnimatedSectionList
                    sections={sections}
                    renderItem={renderItem}
                    scrollEventThrottle={1}
                    onScroll={onScroll}
                    renderScrollComponent={(viewProps) => <Animated.ScrollView {...viewProps} />}
                    keyExtractor={(item) => item.uid}
                    ListHeaderComponent={listHeader}
                    renderSectionHeader={renderSectionHeader}
                    stickySectionHeadersEnabled={false}
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
    filter: {
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: BACKGROUND,
    },
    section: {
        paddingLeft: 16,
        paddingTop: 8,
        paddingBottom: 16,

        backgroundColor: BACKGROUND,

        color: PRIMARY,
        fontSize: 20,
        lineHeight: 24,
        fontFamily: 'Plex-Mono',
    },
    loading: {
        margin: 20,
    },titleText: { 
        paddingBottom: 0, 
        color: TEXT_LIGHT,
    },
    image: {
      flex: 1,
      resizeMode: "center",
      justifyContent: "center",

      height:232,
    },
})
