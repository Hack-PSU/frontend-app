import { useState } from 'react'
import Animated from 'react-native-reanimated'

export interface ScrollYHook {
    scrollY: Animated.Value<number>
    onScroll: any
}

// I basically copied this:
// https://callstack.com/blog/reanimating-your-react-native-experience/
//
// For use with Animated.ScrollView
export default function useScrollY(): ScrollYHook {
    const [value] = useState<Animated.Value<number>>(() => new Animated.Value(0))
    const [onScroll] = useState(() => {
        return Animated.event(
            [
                {
                    nativeEvent: {
                        contentOffset: {
                            y: value,
                        },
                    },
                },
            ],
            { useNativeDriver: true }
        )
    })

    return {
        scrollY: value,
        onScroll,
    }
}
