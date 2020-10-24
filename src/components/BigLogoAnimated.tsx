import React, { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'

import LogoSVG from '../../assets/images/logo.svg'
import { HEADER_THRESHOLD } from './Scaffold'

const { divide, min, max, sub, add } = Animated

// Wanted size in pixels.
const SMALL_SIZE = 42
const SIZE = 136

export interface Props {
    scrollY: Animated.Value<number>
}

// Documentation:
// https://software-mansion.github.io/react-native-reanimated/index.html
const BigLogoAnimated: React.FC<Props> = ({ scrollY }: Props) => {
    const scale = useMemo(() => {
        return max(min(1.15, sub(1, divide(scrollY, HEADER_THRESHOLD))), SMALL_SIZE / SIZE)
    }, [scrollY])

    const translateY = useMemo(() => {
        return add(sub(SIZE / 2, divide(SIZE / 2, scale)), divide(-16, scale))
    }, [scale])

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [
                        {
                            scale: scale as any,
                            translateY: translateY as any,
                        },
                    ],
                },
            ]}
        >
            <LogoSVG width={SIZE} height={SIZE} />
        </Animated.View>
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
        zIndex: 10000,
    },
})

export default BigLogoAnimated
