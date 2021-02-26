import { Platform } from 'react-native'
import { DefaultTheme, Theme } from 'react-native-paper'

export const IS_ANDROID = Platform.OS === 'android'

// Bar height to be passed to any instance of Appbar from
// react-native-paper.
// https://callstack.github.io/react-native-paper/appbar.html
export const BAR_HEIGHT = IS_ANDROID ? 0 : undefined

// Colors.
export const PRIMARY = '#6A85B9'
export const ACCENT = '#F3613D'
export const ACCENT_LIGHT = '#F99432'
export const TEXT = '#0a0a0a'
export const TEXT_LIGHT = '#FFFFFF'
export const BACKGROUND = '#113654'

export const RED = '#F24418'
export const YELLOW = '#B6C767'
export const PURPLE = '#6200EE'

// Our customized theme for react-native-paper.
export const THEME: Theme = {
    ...DefaultTheme,
    dark: false,
    roundness: 8,
    colors: {
        ...DefaultTheme.colors,
        primary: PRIMARY,
        accent: ACCENT,
        background: BACKGROUND,
        text: TEXT,
    },
}
