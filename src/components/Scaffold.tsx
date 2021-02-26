import React, { useMemo } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { Appbar, Avatar } from 'react-native-paper'
import Animated from 'react-native-reanimated'

import BigLogo from './BigLogo'
import BigLogoAnimated from './BigLogoAnimated'

import useStackNavigation from '../hooks/useStackNavigation'
import { useValueNotifier } from 'change-notifier'
import AuthService from '../data/AuthService'
import { ACCENT } from '../theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const isAndroid = Platform.OS !== 'ios'

export const LOGO_SAFE_PADDING = 116 + 36 - 56
export const HEADER_THRESHOLD = 150

// Fix needed for Android display order.
const LOGO_ELEVATION = isAndroid ? 6 : undefined

const { min, max, divide, multiply } = Animated

interface Props {
    children: React.ReactNode
    smallLogo?: boolean
    scrollY?: Animated.Value<number>
}

/**
 * Scaffold controls the title bar, custom styling, and link to Profile.
 */
const Scaffold: React.FC<Props> = ({ children, scrollY, smallLogo }: Props) => {
    const insets = useSafeAreaInsets()

    const navigation = useStackNavigation()
    const currentUser = useValueNotifier(AuthService)

    const navigateProfile = () => navigation.navigate('Profile')

    const [appbarSizingStyle, profileSizingStyle] = useMemo(() => {
        const minHeight = insets.top + 56

        if (!scrollY) {
            return [
                {
                    minHeight: insets.top + 56,
                    paddingTop: insets.top + 8,
                },
                {},
            ]
        }

        const fullHeight = insets.top + 8 + 136 / 2
        const scale = max(0, min(1, divide(scrollY, HEADER_THRESHOLD)))

        return [
            {
                minHeight: insets.top + 56,
                height: insets.top + 8 + 136 / 2,
                paddingTop: insets.top + 8,
                transform: [
                    {
                        translateY: multiply(-1, multiply(scale, fullHeight - minHeight)),
                    },
                ],
            },
            {
                transform: [
                    {
                        translateY: multiply(scale, fullHeight - minHeight),
                    },
                ],
            },
        ]
    }, [insets, scrollY])

    const appBar = (
        <Animated.View style={[styles.appbar, appbarSizingStyle]}>
            {navigation && (
                <Animated.View style={profileSizingStyle}>
                    {currentUser && currentUser.photoURL && (
                        <Avatar.Image
                            size={32}
                            source={{ uri: currentUser.photoURL }}
                            onTouchEnd={navigateProfile}
                            style={styles.avatar}
                        />
                    )}
                    {(!currentUser || !currentUser.photoURL) && (
                        <Appbar.Action
                            icon="account-circle"
                            color={ACCENT}
                            onPress={navigateProfile}
                            style={styles.avatarIcon}
                        />
                    )}
                </Animated.View>
            )}
        </Animated.View>
    )

    const logoTop = insets.top + 16
    const smallLogoTop = insets.top - 2 - (140 - 42) / 2

    return (
        <View style={styles.scaffold}>
            <View style={{ paddingTop: insets.top + 56, flex: 1 }}>{children}</View>
            {appBar}
            {!smallLogo && !scrollY && (
                <View style={[styles.logo, { top: logoTop }]}>
                    <BigLogo />
                </View>
            )}
            {!smallLogo && scrollY && (
                <View style={[styles.logo, { top: logoTop }]}>
                    <BigLogoAnimated scrollY={scrollY} />
                </View>
            )}
            {smallLogo && (
                <View style={[styles.smallLogo, { top: smallLogoTop }]}>
                    <BigLogo />
                </View>
            )}
        </View>
    )
}

export default Scaffold

const styles = StyleSheet.create({
    appbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    avatar: {
        marginRight: 16,
    },
    avatarIcon: {
        marginRight: 8,
    },
    scaffold: {
        flex: 1,
    },
    logo: {
        position: 'absolute',
        alignSelf: 'center',
        elevation: LOGO_ELEVATION,
    },
    // Smaller logo.
    smallLogo: {
        position: 'absolute',
        transform: [
            {
                scale: 42 / 140,
            },
        ],
        alignSelf: 'center',
        elevation: LOGO_ELEVATION,
    },
})
