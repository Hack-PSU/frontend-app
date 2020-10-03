import React from 'react'
import { LogBox, StatusBar, Text, StyleSheet, Platform } from 'react-native'

import { SWRConfig } from 'swr'

import { AppLoading } from 'expo'
import { MaterialIcons } from '@expo/vector-icons'
import { useFonts } from 'expo-font'

import { enableScreens } from 'react-native-screens'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

import { Provider as PaperProvider } from 'react-native-paper'

import LoginGuard from './LoginGuard'

import HomeRoute from '../routes/HomeRoute'
import EventsRoute from '../routes/EventsRoute'
import WorkshopsRoute from '../routes/WorkshopsRoute'
import MapRoute from '../routes/MapRoute'

import ProfileModal from '../routes/modals/ProfileModal'
import ReauthModal from '../routes/modals/ReauthModal'

import { StackContext } from '../hooks/useStackNavigation'
import useChangeNotifierMemo from '../hooks/useChangeNotifierMemo'

import { THEME, PRIMARY } from '../theme'
import initServices from '../initServices'

import { httpGetWithAuth } from '../httpGet'

import AuthService from '../data/AuthService'

// This is a fix for react-native-safe-view, which many libraries use
// but has a warning with React 16.9 (since, in the future, it won't work with React 17).
//
// Basically disables the warning.
LogBox.ignoreLogs([
    'Warning: componentWillReceiveProps',
    'Warning: componentWillMount',
    // https://reactnavigation.org/docs/troubleshooting/#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state
    'Non-serializable values were found in the navigation state',
    // https://github.com/firebase/firebase-js-sdk/issues/97#issuecomment-427512040
    // This helps with the warning but doesn't entirely fix it. Because we can't fix it, we'll ignore it for now.
    'Setting a timer for a long period of time',
])

// Faster stacks, according to here:
// https://reactnavigation.org/docs/en/react-native-screens.html
enableScreens()

// Initialize services.
initServices()

const BottomTabs = createMaterialBottomTabNavigator()
const Stack = Platform.OS === 'ios' ? createNativeStackNavigator() : createStackNavigator()

const stackOptions: any =
    Platform.OS === 'ios'
        ? {
              headerShown: false,
              stackPresentation: 'modal',
          }
        : {
              headerShown: false,
              cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid,
          }

const HomeModal: React.FC<any> = ({ navigator }) => {
    return (
        <StackContext.Provider value={navigator}>
            <BottomTabs.Navigator
                initialRouteName="Home"
                activeColor="white"
                inactiveColor="rgba(255,255,255,0.6)"
                shifting={false}
                style={{ backgroundColor: PRIMARY }}
                // @ts-ignore
                renderLabel={({ route, focused, color }) => (
                    <Text style={[styles.label, { color }]}>{route.name}</Text>
                )}
            >
                <BottomTabs.Screen
                    name="Home"
                    component={HomeRoute}
                    options={{ tabBarIcon: 'code-array' }}
                />
                <BottomTabs.Screen
                    name="Events"
                    component={EventsRoute}
                    options={{ tabBarIcon: 'calendar-star' }}
                />
                <BottomTabs.Screen
                    name="Workshops"
                    component={WorkshopsRoute}
                    options={{ tabBarIcon: 'brush' }}
                />
                <BottomTabs.Screen
                    name="Map"
                    component={MapRoute}
                    options={{ tabBarIcon: 'map' }}
                />
            </BottomTabs.Navigator>
        </StackContext.Provider>
    )
}

/**
 * `App` sets up the Material theme, fonts, system borders,
 * and acts as the primary navigation for the app.
 *
 * 1) Stack navigation: i.e. popup windows
 * 2) Bottom navigation bar
 * 3) Pane switching within bottom nav bar.
 */
const App: React.FC = () => {
    const [fontsLoaded] = useFonts({
        'Plex-Mono': require('../../assets/fonts/IBMPlexMono-Medium.otf'),
        Cornerstone: require('../../assets/fonts/Cornerstone.ttf'),
    })

    const currentUser = useChangeNotifierMemo(AuthService, () => AuthService.currentUser)

    if (!fontsLoaded) {
        return <AppLoading />
    }

    return (
        <PaperProvider
            theme={THEME}
            settings={{
                icon: (props) => <MaterialIcons {...props} />,
            }}
        >
            <SWRConfig
                value={{
                    shouldRetryOnError: true,
                    fetcher: (url: string, transform?: (arg1: string) => any) => {
                        if (transform) {
                            return httpGetWithAuth(url, currentUser).then(transform)
                        }

                        return httpGetWithAuth(url, currentUser)
                    },
                }}
            >
                <LoginGuard>
                    {/* This is for iOS, for Android see app.json in root of project. */}
                    <StatusBar barStyle="dark-content" />
                    <NavigationContainer theme={THEME as any}>
                        {/* Stack. */}
                        <Stack.Navigator screenOptions={stackOptions}>
                            <Stack.Screen name="Home" component={HomeModal} />
                            <Stack.Screen name="Profile" component={ProfileModal} />
                            <Stack.Screen name="Reauth" component={ReauthModal} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </LoginGuard>
            </SWRConfig>
        </PaperProvider>
    )
}

export default App

const styles = StyleSheet.create({
    label: {
        fontSize: 12,
        textAlign: 'center',
        backgroundColor: 'transparent',
        fontFamily: 'Plex-Mono',
    },
})
