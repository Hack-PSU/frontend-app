import React from 'react'
import { View, StyleSheet } from 'react-native'

import LogoSVG from '../../assets/images/logo.svg'

// Wanted size in pixels.
const SIZE = 136

const BigLogo: React.FC = () => {
    return (
        <View style={styles.container}>
            <LogoSVG width={SIZE} height={SIZE} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: SIZE,
        width: SIZE,
        marginTop: 8,
        marginBottom: 16,
        alignSelf: 'center',
        backgroundColor: 'rgb(222,222,222)',
        borderRadius: 20,
    },
})

export default BigLogo
