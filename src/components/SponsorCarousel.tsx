import React from 'react'
import { StyleSheet, View } from 'react-native'
import Slick from 'react-native-slick'
import SponsorLogo from '../components/SponsorLogo'

import MICROSOFT_SVG from '../../assets/images/sponsors/Microsoft_original.svg'
import NITTANY_AI_SVG from '../../assets/images/sponsors/nittanyai-day.svg'
import STARTUP_WEEK_SVG from '../../assets/images/sponsors/StartUpWeek-day.svg'
import ICS_SVG from '../../assets/images/sponsors/ICDS-day.svg'
import EECS_SVG from '../../assets/images/sponsors/EECS-day.svg'
import LION_LAUNCHPAD_SVG from '../../assets/images/sponsors/Lion-Launchpad.svg'
import HVC_SVG from '../../assets/images/sponsors/HVC.svg'
import ECHO_AR_SVG from '../../assets/images/sponsors/EchoAR-day.svg'

const MICROSOFT_URL = 'https://www.microsoft.com/'
const NITTANY_AI_URL = 'https://nittanyai.psu.edu/'
const STARTUP_WEEK_URL = 'https://startupweek.psu.edu/'
const ICS_URL = 'https://www.icds.psu.edu/'
const EECS_URL = 'https://www.eecs.psu.edu/'
const LION_LAUNCHPAD_URL = 'https://lionlaunchpad.psu.edu/'
const HVC_URL = 'https://www.linkedin.com/company/happy-valley-communications/'
const ECHO_AR_URL = 'https://www.echoar.xyz/'

const SponsorCarousel: React.FC = () => {
    return (
        <View style={styles.wrapper}>
            <Slick
                height={110}
                dot={<View style={styles.dot} />}
                activeDot={<View style={styles.activeDot} />}
                paginationStyle={styles.pagination}
                autoplay
                autoplayTimeout={2}
                horizontal
                loop
            >
                <SponsorLogo sponsorURL={MICROSOFT_URL}>
                    <MICROSOFT_SVG style={styles.logo} />
                </SponsorLogo>
                <SponsorLogo sponsorURL={NITTANY_AI_URL}>
                    <NITTANY_AI_SVG style={styles.smallLogo} />
                </SponsorLogo>
                <SponsorLogo sponsorURL={STARTUP_WEEK_URL}>
                    <STARTUP_WEEK_SVG style={styles.smallLogo} />
                </SponsorLogo>
                <SponsorLogo sponsorURL={ICS_URL}>
                    <ICS_SVG style={{ ...styles.logo, ...styles.icsLogo }} />
                </SponsorLogo>
                <SponsorLogo sponsorURL={EECS_URL}>
                    <EECS_SVG style={styles.logo} />
                </SponsorLogo>
                <SponsorLogo sponsorURL={LION_LAUNCHPAD_URL}>
                    <LION_LAUNCHPAD_SVG style={styles.logo} />
                </SponsorLogo>
                <SponsorLogo sponsorURL={HVC_URL}>
                    <HVC_SVG style={{ ...styles.hvcLogo, ...styles.logo }} />
                </SponsorLogo>
                <SponsorLogo sponsorURL={ECHO_AR_URL}>
                    <ECHO_AR_SVG style={styles.smallLogo} />
                </SponsorLogo>
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
        top: 10,
        height: 320,
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icsLogo: {
        top: 0,
    },
    hvcLogo: {
        margin: 10,
    },
    smallLogo: {
        flex: 1,
        top: 10,
        height: 10,
        width: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default SponsorCarousel
