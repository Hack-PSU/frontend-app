import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Appbar } from "react-native-paper";
import Animated from "react-native-reanimated";

import BigLogo from "./BigLogo";
import BigLogoAnimated from "./BigLogoAnimated";

import { ACCENT } from "../theme";

const isAndroid = Platform.OS !== "ios";

export const NOTCH_HEIGHT = isAndroid ? 0 : 44;
export const LOGO_SAFE_PADDING = (116 + 16 + 16) - 56; 

const styles = StyleSheet.create({
  scaffold: {
    flex: 1
  },
  logo: {
    position: "absolute",
    top: NOTCH_HEIGHT + 16,
    alignSelf: "center",
  },
  // Smaller logo.
  smallLogo: {
    position: "absolute",
    top: NOTCH_HEIGHT - 2 - (116 - 42) / 2,
    transform: [
      {
        scale: 42 / 116,
      }
    ],
    alignSelf: "center",
  }
});

interface Props {
  children: React.ReactNode;
  onPressProfile?: any;
  smallLogo?: boolean;
  scrollY?: Animated.Value<number>;
}

/**
 * Scaffold controls the title bar, custom styling, and link to Profile.
 */
const Scaffold: React.FC<Props> = ({ children, onPressProfile, scrollY, smallLogo }: Props) => {
  // If undefined just use system value.
  const barHeight = isAndroid ? 0 : undefined;

  const appBar = (
    <Appbar.Header style={{ backgroundColor: "white" }} statusBarHeight={barHeight}>
      {/* Expander so icon is on the righgt side. */}
      <View style={{flex: 1}} />
      <Appbar.Action icon="account-circle" onPress={onPressProfile} color={ACCENT} />
    </Appbar.Header>
  )

  return (
    <View style={styles.scaffold}>
      {appBar}
      {!smallLogo && !scrollY && (<View style={styles.logo}><BigLogo /></View>)}
      {!smallLogo && scrollY && (<View style={styles.logo}><BigLogoAnimated scrollY={scrollY} /></View>)}
      {smallLogo && (<View style={styles.smallLogo}><BigLogo /></View>)}
      {children}
    </View>
  );
};

export default Scaffold;
