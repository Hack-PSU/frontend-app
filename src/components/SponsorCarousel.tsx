import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Slick from 'react-native-slick'

import EECS_SVG from '../../assets/images/sponsors/EECS-day.svg'
import ICS_SVG from '../../assets/images/sponsors/ICS-day.svg'
import MICROSOFT_SVG from '../../assets/images/sponsors/Microsoft_original.svg'

const SponsorCarousel: React.FC = () => {
    return (
        <View>
            <Slick autoplay={true} height={110}>
                <View>
                    <MICROSOFT_SVG style={styles.logo} />
                </View>
                <View>
                    <EECS_SVG style={styles.bigLogo} />
                </View>
                <View>
                    <ICS_SVG style={styles.logo} />
                </View>
            </Slick>
        </View>
    )
}

const styles = StyleSheet.create({
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
