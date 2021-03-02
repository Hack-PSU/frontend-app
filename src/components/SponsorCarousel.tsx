import React from 'react'
import { StyleSheet, View, Linking } from 'react-native'
import Slick from 'react-native-slick'

import MICROSOFT_SVG from '../../assets/images/sponsors/Microsoft_original.svg'
import EECS_SVG from '../../assets/images/sponsors/EECS-day.svg'
import ICS_SVG from '../../assets/images/sponsors/ICS-day.svg'

const MICROSOFT_URL = 'https://www.microsoft.com/en-us/?ql=6&spl=3'
const EECS_URL = 'https://www.eecs.psu.edu/'
const ICS_URL = 'https://www.icds.psu.edu/'
//onPress={() => Linking.openURL(DEVPOST_URL)}
const SponsorCarousel: React.FC = () => {
    return (
        <View style={styles.wrapper}>
            <Slick
                autoplay={true}
                height={110}
                // onMomentumScrollEnd={(e, state, context) => console.log('index:', state.index)}
                dot={<View style={styles.dot} />}
                activeDot={<View style={styles.activeDot} />}
                paginationStyle={styles.pagination}
                loop
                horizontal
            >
                <View>
                    <MICROSOFT_SVG
                        style={styles.logo}
                        onPress={() => Linking.openURL(MICROSOFT_URL)}
                    />
                </View>
                <View>
                    <EECS_SVG style={styles.bigLogo} onPress={() => Linking.openURL(EECS_URL)} />
                </View>
                <View>
                    <ICS_SVG style={styles.logo} onPress={() => Linking.openURL(ICS_URL)} />
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
    logo: {
        flex: 1,
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
