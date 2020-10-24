import React from 'react'
import { StyleSheet } from 'react-native'
import { Surface } from 'react-native-paper'

import LogoSVG from '../../assets/images/logo.svg'

// Wanted size in pixels.
const SIZE = 136

interface Props {
    elevation?: number
}

const BigLogo: React.FC<Props> = ({ elevation = 0 }) => {
    return (
        <Surface style={[styles.container, { elevation }]}>
            <LogoSVG width={SIZE} height={SIZE} />
        </Surface>
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
