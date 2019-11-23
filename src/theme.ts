import { Platform } from "react-native";

export const IS_ANDROID = Platform.OS !== "ios";

// If undefined just use system value.
export const BAR_HEIGHT = IS_ANDROID ? 0 : undefined;

// Colors.
export const PRIMARY = "#6A85B9";
export const ACCENT = "#F3613D";
export const ACCENT_LIGHT = "#F99432";
export const TEXT = "#0a0a0a";
export const TEXT_LIGHT = "#FFFFFF";
export const BACKGROUND = "#113654";

export const RED = "#F24418";
export const RED_LIGHT = "#F9810C";
export const YELLOW = "#B6C767";
export const YELLOW_LIGHT = "#9FDE68";

/**
 * To use:
 *
 * import { DARK_TEXT_THEME } from "../theme";
 *
 * ... stuff you write like code ...
 * <SomePaperComponent theme={DARK_TEXT_THEME} />
 */
export const DARK_TEXT_THEME = { colors: { text: TEXT } };