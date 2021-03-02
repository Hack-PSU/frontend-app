import React from 'react'
import { StyleSheet, View, Linking, Text, Image } from 'react-native'
import Slick from 'react-native-slick'

import MICROSOFT_SVG from '../../assets/images/sponsors/Microsoft_original.svg'
import EECS_SVG from '../../assets/images/sponsors/EECS-day.svg'
import ICS_SVG from '../../assets/images/sponsors/ICS-day.svg'
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler'

const MICROSOFT_URL = 'https://www.microsoft.com/en-us/?ql=6&spl=3'
const EECS_URL = 'https://www.eecs.psu.edu/'
const ICS_URL = 'https://www.icds.psu.edu/'
const LION_LAUNCHPAD_URL = 'https://lionlaunchpad.psu.edu/'
const HVC_URL = 'https://www.linkedin.com/company/happy-valley-communications/'
//onPress={() => Linking.openURL(DEVPOST_URL)}
const SponsorCarousel: React.FC = () => {
    return (
        <View style={styles.wrapper}>
            <Slick
                // onMomentumScrollEnd={(e, state, context) => console.log('index:', state.index)}
                height={110}
                dot={<View style={styles.dot} />}
                activeDot={<View style={styles.activeDot} />}
                paginationStyle={styles.pagination}
                autoplay
                autoplayTimeout={2}
                horizontal
                loop
            >
                <View style={styles.logoContainer}>
                    <TouchableOpacity onPress={() => Linking.openURL(MICROSOFT_URL)}>
                        <MICROSOFT_SVG style={styles.logo} />
                    </TouchableOpacity>
                </View>
                <View style={styles.logoContainer}>
                    <TouchableOpacity onPress={() => Linking.openURL(EECS_URL)}>
                        <EECS_SVG style={styles.bigLogo} />
                    </TouchableOpacity>
                </View>
                <View style={styles.logoContainer}>
                    <TouchableOpacity onPress={() => Linking.openURL(ICS_URL)}>
                        <ICS_SVG style={styles.logo} />
                    </TouchableOpacity>
                </View>
                <View style={styles.logoContainer}>
                    <TouchableOpacity onPress={() => Linking.openURL(LION_LAUNCHPAD_URL)}>
                        <Image
                            style={styles.smallLogo}
                            source={require('../../assets/images/sponsors/Lion-Launchpad-LOGO.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.logoContainer}>
                    <TouchableOpacity onPress={() => Linking.openURL(HVC_URL)}>
                        <Image
                            style={styles.smallerLogo}
                            source={require('../../assets/images/sponsors/HVC-LOGO.png')}
                        />
                    </TouchableOpacity>
                </View>
            </Slick>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: { height: 130 },
    dot: {
        backgroundColor: 'rgba(0,0,0,.2)',
        width: 6,
        height: 3,
        borderRadius: 4,
        marginLeft: 2,
        marginRight: 2,
        marginTop: 2,
        marginBottom: 8,
    },
    activeDot: {
        backgroundColor: '#000000',
        width: 8,
        height: 5,
        borderRadius: 4,
        marginLeft: 2,
        marginRight: 2,
        marginTop: 2,
        marginBottom: 8,
    },
    pagination: {
        bottom: -15,
        marginRight: 'auto',
        marginLeft: 'auto',
    },
    logoContainer: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    smallerLogo: {
        height: 120,
        width: 250,
    },
    smallLogo: {
        height: 80,
        width: 300,
        top: 10,
    },
    logo: {
        flex: 1,
        top: 10,
        height: 280,
        width: 300,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    bigLogo: {
        flex: 1,
        height: 110,
        width: 300,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
})

export default SponsorCarousel
