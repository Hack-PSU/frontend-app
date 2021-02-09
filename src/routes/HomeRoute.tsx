/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { StyleSheet, View, Linking, ImageComponent } from 'react-native'
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

import Mountain from '../../assets/images/HomeMountains.svg'

import { useDimensions } from 'react-native-hooks'

import { IconButton } from 'react-native-paper'

const REGISTER_URL = 'https://app.hackpsu.org/register'

const DISCORD_URL = 'https://discord.gg/KwhzQaF'

const HomeRoute: React.FC = () => {
    const registrationStatus = useRegistrationStatus()

    const { data } = useEvents()

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

                {/*<DateCountDown />*/}

                <View style={{ backgroundColor: 'white' }}>
                    {registrationStatus.error && <ErrorCard error={registrationStatus.error} />}

                    {data && data.length && (
                        <View style={styles.eventContainer}>
                            <Text style={styles.nextEvent}>Next Event</Text>
                            <EventWorkshopListItem
                                model={data[0]}
                                starEnabled={false}
                                starItem={() => { }}
                            />
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
        top: 315,
        left: 190,
    },
})

export default HomeRoute
