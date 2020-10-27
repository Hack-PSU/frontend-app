/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { StyleSheet, View, Linking } from 'react-native'
import { Text, Title, Button } from 'react-native-paper'
import Animated from 'react-native-reanimated'
import * as WebBrowser from 'expo-web-browser'

import HomeListItem from '../components/HomeListItem'
import HomeListItemSecondary from '../components/HomeListItemSecondary'
import DateCountDown from '../components/DateCountDown'
import Scaffold, { LOGO_SAFE_PADDING } from '../components/Scaffold'
import ErrorCard from '../components/ErrorCard'
import EventWorkshopListItem from '../components/EventWorkshopListItem'

import useScrollY from '../hooks/useScrollY'
import useRegistrationStatus from '../data/hooks/useRegistrationStatus'

import useEvents from '../data/hooks/useEvents'

import { TEXT_LIGHT } from '../theme'

const REGISTER_URL = 'https://app.hackpsu.org/register'

const DISCORD_URL = 'https://discord.gg/KwhzQaF'

const DEVPOST_URL = 'https://hackpsu-fall-2020.devpost.com/'

const HomeRoute: React.FC = () => {
    const registrationStatus = useRegistrationStatus()

    const { data } = useEvents()

    const { scrollY, onScroll } = useScrollY()

    function openRegisterURL() {
        return WebBrowser.openBrowserAsync(REGISTER_URL).then(() => registrationStatus.mutate())
    }

    // Disable for now.
    // const refreshControl = (
    //   <RefreshControl
    //     refreshing={registrationStatus && registrationStatus.loading}
    //     onRefresh={refresh}
    //     tintColor="white"
    //   />
    // );

    return (
        <Scaffold scrollY={scrollY}>
            <Animated.ScrollView scrollEventThrottle={1} onScroll={onScroll}>
                <Title style={styles.title}>HOME</Title>

                {registrationStatus.error && <ErrorCard error={registrationStatus.error} />}

                <DateCountDown />

                {data && data.length && (
                    <View style={styles.eventContainer}>
                        <Text style={styles.nextEvent}>Next Event</Text>
                        <EventWorkshopListItem
                            model={data[0]}
                            starEnabled={false}
                            starItem={() => {}}
                        />
                    </View>
                )}

                {!registrationStatus.error && !registrationStatus.data && (
                    <HomeListItem description="My PIN Number" onPress={openRegisterURL}>
                        <View style={styles.buttonContainer}>
                            {__DEV__ && (
                                <Text style={styles.stagingWarning}>
                                    This **only** shows in development mode. So if you're on staging
                                    (probably), you can't register since there is no staging
                                    deployment of HackPSU website lmao. Please setup frontend and
                                    register for staging hackathon there. I wish this could be
                                    fixed.
                                </Text>
                            )}
                            <Button mode="contained" dark>
                                Register
                            </Button>
                        </View>
                    </HomeListItem>
                )}

                <View style={styles.horizontalCardView}>
                    {!registrationStatus.error && (
                        <HomeListItem
                            description="My PIN Number"
                            info={
                                !registrationStatus.data
                                    ? '...'
                                    : registrationStatus.data.pin.toString()
                            }
                        />
                    )}

                    <HomeListItemSecondary
                        description="Discord"
                        onPress={() => Linking.openURL(DISCORD_URL)}
                    >
                        <Text style={styles.horizontalCardText}>
                            Request an invite by clicking here!
                        </Text>
                        <View style={styles.buttonContainer}>
                            <Button mode="contained" dark>
                                Open
                            </Button>
                        </View>
                    </HomeListItemSecondary>
                </View>

                <HomeListItemSecondary
                    description="Devpost link"
                    onPress={() => Linking.openURL(DEVPOST_URL)}
                >
                    <Text style={styles.horizontalCardText}>
                        Make sure to post your submission here!
                    </Text>
                    <View style={styles.buttonContainer}>
                        <Button mode="contained" dark>
                            Open
                        </Button>
                    </View>
                </HomeListItemSecondary>
            </Animated.ScrollView>
        </Scaffold>
    )
}

const styles = StyleSheet.create({
    title: {
        fontFamily: 'Cornerstone',
        color: TEXT_LIGHT,
        fontSize: 48,
        paddingTop: 44 + LOGO_SAFE_PADDING,
        paddingBottom: 16,
        paddingLeft: 16,
    },

    buttonContainer: {
        paddingTop: 10,
        width: '100%',
        alignItems: 'flex-start',
    },

    stagingWarning: {
        paddingBottom: 8,
    },

    horizontalCardView: {
        flexDirection: 'row',
    },

    horizontalCardText: {
        color: 'black',
    },

    nextEvent: {
        fontFamily: 'Plex-Mono',
        color: '#889BC4',
        fontSize: 18,
        paddingBottom: 5,
        paddingLeft: 13,
    },

    eventContainer: {
        paddingLeft: 2,
        paddingRight: 2,
        paddingBottom: 2,
    },
})

export default HomeRoute
