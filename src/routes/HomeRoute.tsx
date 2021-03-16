/* eslint-disable react/no-unescaped-entities */

import React, { useMemo } from 'react'
import { StyleSheet, View, Linking, Image } from 'react-native'
import { Text, Button } from 'react-native-paper'
import { useDimensions } from 'react-native-hooks'
import Animated from 'react-native-reanimated'
import * as WebBrowser from 'expo-web-browser'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import HomeListItem from '../components/HomeListItem'
import DateCountDown from '../components/DateCountDown'
import Scaffold from '../components/Scaffold'
import ErrorCard from '../components/ErrorCard'
import EventWorkshopListItem from '../components/EventWorkshopListItem'
import SponsorCarousel from '../components/SponsorCarousel'

import useScrollY from '../hooks/useScrollY'
import useRegistrationStatus from '../data/hooks/useRegistrationStatus'
import useEvents from '../data/hooks/useEvents'

import { TEXT_LIGHT } from '../theme'

import Mountain from '../../assets/images/HomeMountains.svg'
import MLHLogo from '../../assets/images/mlh.svg'

const REGISTER_URL = 'https://app.hackpsu.org/register'

const DISCORD_URL = 'https://discord.gg/eyPSrNm9Cd'
const DEVPOST_URL = 'https://hackpsu-fall-2020.devpost.com/'

const BackgroundImage = require('../../assets/images/background.jpg')

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
                <Image
                    style={[styles.backgroundImage, { width: screen.width }]}
                    source={BackgroundImage}
                />

                <View style={styles.mountain}>
                    <Mountain width={screen.width} height={screen.width + 40} />
                </View>

                <View style={styles.heroContainer}>
                    <View style={styles.countdown}>
                        <DateCountDown />
                    </View>

                    <View style={styles.heroButtons}>
                        <Button
                            onPress={
                                isRegistered ? () => Linking.openURL(DEVPOST_URL) : openRegisterURL
                            }
                            mode="contained"
                            dark
                            style={styles.submitButton}
                            icon={({ size, color }) => (
                                <MaterialCommunityIcons
                                    name="hexagon"
                                    size={size}
                                    color={(color = styles.submitButton.color)}
                                />
                            )}
                        >
                            <Text
                                style={{
                                    color: styles.submitButton.color,
                                    fontWeight: styles.discordButton.fontWeight,
                                }}
                            >
                                {isRegistered ? 'Submit' : 'Register'}
                            </Text>
                        </Button>

                        <Button
                            onPress={() => Linking.openURL(DISCORD_URL)}
                            mode="contained"
                            dark
                            style={styles.discordButton}
                            icon={({ size, color }) => (
                                <MaterialCommunityIcons name="discord" size={size} color={color} />
                            )}
                        >
                            <Text
                                style={{
                                    color: TEXT_LIGHT,
                                    fontWeight: styles.discordButton.fontWeight,
                                }}
                            >
                                Discord
                            </Text>
                        </Button>
                    </View>
                </View>

                <View style={styles.background}>
                    <View style={styles.backgroundMask}>
                        {registrationStatus.error && <ErrorCard error={registrationStatus.error} />}

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

                        <HomeListItem description="Information">
                            <View style={styles.mlhLogo}>
                                <MLHLogo height={140} />
                            </View>
                            <Text style={styles.cardParagraph}>
                                This March 19th-21st, join us and over 900 students from across the
                                nation for 48 hours of creation, innovation, & fun. From seasoned
                                coding veterans to first-time hackers from any major or field, all
                                are welcome to join. Discover your ability to create change by
                                developing technology to solve real-world problems, working with
                                industry leaders, and collaborating with your peers.
                                {'\n\n'}Of course, we also offer swag, prizes, and much more for
                                your enjoyment!
                            </Text>
                        </HomeListItem>
                    </View>
                    <HomeListItem>
                        <Text style={styles.sponsorText}>Our Sponsors</Text>
                        <SponsorCarousel />
                    </HomeListItem>
                </View>
            </Animated.ScrollView>
        </Scaffold>
    )
}

const styles = StyleSheet.create({
    backgroundImage: {
        position: 'absolute',
        top: 0,

        width: '100%',
        height: 800,
        resizeMode: 'cover',
    },

    section: {
        paddingLeft: 16,
        paddingTop: 8,
        paddingBottom: 16,

        color: 'black',
        fontSize: 20,
        lineHeight: 24,
        fontFamily: 'SpaceGrotesk',
    },

    eventContainer: {
        paddingLeft: 2,
        paddingRight: 2,
        paddingBottom: 2,
    },

    mountain: {
        position: 'relative',
        bottom: 0,
        backgroundColor: '#113654',
    },

    heroContainer: {
        position: 'absolute',
        top: 264,
        paddingLeft: 16,
    },

    countdown: {
        color: '#FFFFFF',
        fontSize: 32,
        fontFamily: 'SpaceGrotesk',
        zIndex: 5,
        lineHeight: 40,
    },

    heroButtons: {
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: 8,
    },

    submitButton: {
        backgroundColor: '#FFFFFF',
        width: 144,
        color: '#F3603D',
        fontWeight: 'bold',
    },

    discordButton: {
        backgroundColor: '#6A85B9',
        width: 144,
        marginLeft: 16,
        fontWeight: 'bold',
    },

    background: {
        backgroundColor: '#F5F5F5',
        height: '100%',
    },

    backgroundMask: {
        marginTop: -24,
    },

    mlhLogo: {
        marginBottom: 32,
    },

    cardParagraph: {
        fontSize: 16,
        lineHeight: 20,

        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 16,

        color: 'rgba(0,0,0,0.65)',
    },
    sponsorText: {
        fontSize: 30,
        fontFamily: 'SpaceGrotesk',
        textAlign: 'center',
    },
})

export default HomeRoute
