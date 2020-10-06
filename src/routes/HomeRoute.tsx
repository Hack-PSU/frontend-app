/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { StyleSheet, View, Linking } from 'react-native'
import { Text, Title, Button } from 'react-native-paper'
import Animated from 'react-native-reanimated'
import * as WebBrowser from 'expo-web-browser'
// TODO: Delete this import when done testing notifications
import * as Notifications from 'expo-notifications'

import HomeListItem from '../components/HomeListItem'
import HomeListItemSecondary from '../components/HomeListItemSecondary'
import DateCountDown from '../components/DateCountDown'
import Scaffold, { LOGO_SAFE_PADDING } from '../components/Scaffold'
import ErrorCard from '../components/ErrorCard'

import useScrollY from '../hooks/useScrollY'
import useRegistrationStatus from '../data/hooks/useRegistrationStatus'

import { TEXT_LIGHT, PRIMARY } from '../theme'

const REGISTER_URL = 'https://app.hackpsu.org/register'

const SLACK_URL =
    'https://join.slack.com/t/hackpsu-group/shared_invite/enQtODE3Mzc5NDI1NjQ4LTJmMDkzYmQ0ODRmNGNjOTE0MzkyMGY0Y2ZiODJjYmQwNDM5MzFiODc2MTY5YzdjYWJiN2FlZmM4MTNhMzU0YmU'

const HomeRoute: React.FC = () => {
    const registrationStatus = useRegistrationStatus()

    const { scrollY, onScroll } = useScrollY()

    function openRegisterURL() {
        return WebBrowser.openBrowserAsync(REGISTER_URL).then(() => registrationStatus.mutate())
    }

    const testNotification = async () => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        })

        let settings = await Notifications.getPermissionsAsync()
        while (settings.canAskAgain && !settings.granted) {
            await Notifications.requestPermissionsAsync()
            // Refresh settings.
            settings = await Notifications.getPermissionsAsync()
        }

        if (!settings.canAskAgain && !settings.granted) {
            // Error state, this is bad.
            return
        }

        Notifications.scheduleNotificationAsync({
            content: {
                title: 'Holy cow!/Title',
                body: 'poggers poggers poggers poggers poggers/In 10 mins',
                color: PRIMARY,
                subtitle: 'bars/workshop/event',
            },
            trigger: {
                seconds: 5,
            },
        })
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

                <DateCountDown />

                {/* TODO: Delete this when done testing */}
                <HomeListItem
                    description="Notification test"
                    info="Press here to schedule a notification 5 secs from now"
                    onPress={testNotification}
                />

                {registrationStatus.error && <ErrorCard error={registrationStatus.error} />}

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
                    <HomeListItemSecondary description="Wi-Fi">
                        <Text style={styles.horizontalCardText}>Username: hackpsu</Text>
                        <Text style={styles.horizontalCardText}>Password: plz</Text>
                    </HomeListItemSecondary>
                    <HomeListItemSecondary
                        description="Slack"
                        onPress={() => Linking.openURL(SLACK_URL)}
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
        color: 'gray',
    },
})

export default HomeRoute
