/* eslint-disable react/no-unescaped-entities */

import React, { useMemo } from 'react'
import { StyleSheet, View, Linking, ImageComponent } from 'react-native'

import { Text, Title, Button } from 'react-native-paper'
import Animated from 'react-native-reanimated'
import * as WebBrowser from 'expo-web-browser'
import { MaterialCommunityIcons } from '@expo/vector-icons'

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


import Mountain from '../../assets/images/HomeMountains.svg'

import { useDimensions } from 'react-native-hooks'

import { IconButton } from 'react-native-paper'

const REGISTER_URL = 'https://hackpsu.org/register'


const DISCORD_URL = 'https://discord.gg/eyPSrNm9Cd'
const DISCORD_TEXT = `
We highly suggest joining Discord for all event updates and meeting other hackers!
`.trim()

const DEVPOST_URL = 'https://hackpsu-fall-2020.devpost.com/'
const DEVPOST_TEXT = `
We are using Devpost for all submission and scoring. Projects are due 5pm on Sunday.
`.trim()

const HomeRoute: React.FC = () => {
    const registrationStatus = useRegistrationStatus()

    const { data: events } = useEvents()

    const { scrollY, onScroll } = useScrollY()

    const { screen } = useDimensions()

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

    const isRegistered = useMemo(() => !!registrationStatus.data, [registrationStatus.data])
    const hasEvents = useMemo(() => events && events.length, [events])

    return (
        <Scaffold scrollY={scrollY}>
            <Animated.ScrollView scrollEventThrottle={1} onScroll={onScroll}>
                <View style={styles.mountain}>
                    <Mountain width={screen.width} height={screen.width + 50} />
                </View>

                <View style={{ position: 'absolute' }}>
                    <Title style={styles.countdown}>2 hours left!</Title>

                    {/* <IconButton icon="computer" color="#F3603D" style={styles.submitButton} /> */}
                    <Button mode="contained" dark style={styles.submitButton}>
                        <Text style={{ color: '#F3603D', fontFamily: 'Cornerstone' }}>Submit</Text>
                    </Button>

                    {/* <IconButton icon="mic" style={styles.discordButton} /> */}
                    <Button
                        onPress={() => Linking.openURL(DISCORD_URL)}
                        mode="contained"
                        dark
                        style={styles.discordButton}
                    >
                        <Text style={{ color: 'white', fontFamily: 'Cornerstone' }}>Discord</Text>
                    </Button>
                </View>


                <View style={{ backgroundColor: 'white' }}>
                    {registrationStatus.error && <ErrorCard error={registrationStatus.error} />}

                    <DateCountDown />

                    {isRegistered && hasEvents && (
                        <View style={styles.eventContainer}>
                            <Text style={styles.section}>Next Event</Text>
                            <EventWorkshopListItem
                                model={events[0]}
                                starEnabled={false}
                                starItem={() => {}}
                                onPress={() => {}}
                            />
                        </View>
                    )}

                    {isRegistered && (
                        <HomeListItem description="My PIN">
                            <Text>{registrationStatus.data.pin.toString()}</Text>
                        </HomeListItem>
                    )}

                    <Text style={styles.section}>Information</Text>

                    {!isRegistered && (
                        <HomeListItem description="My PIN" onPress={openRegisterURL}>
                            <View style={styles.buttonContainer}>
                                {/* {__DEV__ && (
                                        <Text style={styles.stagingWarning}>
                                            This **only** shows in development mode. So if you're on
                                            staging (probably), you can't register since there is no
                                            staging deployment of HackPSU website lmao. Please setup
                                            frontend and register for staging hackathon there. I wish
                                            this could be fixed.
                                        </Text>
                                    )} */}
                                <Button mode="contained" dark>
                                   Register
                                </Button>
                            </View>
                        </HomeListItem>
                    )}

                    <View style={styles.horizontalCardView}>
                        <HomeListItemSecondary
                           description="Discord"
                            onPress={() => WebBrowser.openBrowserAsync(DISCORD_URL)}
                        >
                            <Text style={styles.horizontalCardText}>{DISCORD_TEXT}</Text>
                            <View style={styles.buttonContainer}>
                                <Button
                                    mode="outlined"
                                    dark
                                    icon={({ size, color }) => (
                                       <MaterialCommunityIcons
                                           name="discord"
                                           size={size}
                                            color={color}
                                        />
                                    )}
                                >
                                    Open
                                </Button>
                            </View>
                        </HomeListItemSecondary>

                        <HomeListItemSecondary
                            description="Devpost"
                            onPress={() => WebBrowser.openBrowserAsync(DEVPOST_URL)}
                        >
                            <Text style={styles.horizontalCardText}>{DEVPOST_TEXT}</Text>
                            <View style={styles.buttonContainer}>
                                <Button
                                   mode="outlined"
                                    dark
                                    icon={({ size, color }) => (
                                        <MaterialCommunityIcons
                                            name="hexagon"
                                            size={size}
                                            color={color}
                                        />
                                    )}
                                >
                                    Open
                                </Button>

                        </View>
                    )}

                    {!registrationStatus.error && !registrationStatus.data && (
                        <HomeListItem description="My PIN Number" onPress={openRegisterURL}>
                            <View style={styles.buttonContainer}>
                                {__DEV__ && (
                                    <Text style={styles.stagingWarning}>
                                        This **only** shows in development mode. So if you're on
                                        staging (probably), you can't register since there is no
                                        staging deployment of HackPSU website lmao. Please setup
                                        frontend and register for staging hackathon there. I wish
                                        this could be fixed.
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
                </View>
            </Animated.ScrollView>
        </Scaffold>
    )
}

const styles = StyleSheet.create({
    title: {
        fontFamily: 'Cornerstone',
        color: TEXT_LIGHT,
        fontSize: 48,
        lineHeight: 54,
        paddingTop: 22 + LOGO_SAFE_PADDING,
        paddingBottom: 16,
        paddingLeft: 16,
    },

    buttonContainer: {
        paddingTop: 10,
        width: '100%',
        alignSelf: 'flex-end',
        alignItems: 'flex-start',
    },

    // stagingWarning: {
    //     paddingBottom: 8,
    // },

    horizontalCardView: {
        flexDirection: 'row',
        marginLeft: 5,
        marginRight: 5,
    },

    horizontalCardText: {
        color: 'black',
    },

    section: {
        paddingLeft: 16,
        paddingTop: 8,
        paddingBottom: 16,

        color: 'white',
        fontSize: 20,
        lineHeight: 24,
        fontFamily: 'Plex-Mono',
    },

    eventContainer: {
        paddingLeft: 2,
        paddingRight: 2,
        paddingBottom: 2,
    },

    mountain: {
        position: 'relative',
        bottom: 0,
    },

    countdown: {
        color: '#FFFFFF',
        fontSize: 40,
        fontFamily: 'SpaceGrotesk',
        zIndex: 5,
        top: 340,
        left: 40,
        lineHeight: 40,
    },
    submitButton: {
        backgroundColor: '#FFFFFF',
        width: 120,
        top: 350,
        left: 42,
    },

    discordButton: {
        backgroundColor: '#6A85B9',
        width: 120,
        top: 317,
        left: 190,
    },
})

export default HomeRoute
