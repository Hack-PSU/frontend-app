import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Appbar, Avatar } from "react-native-paper";
import Animated from "react-native-reanimated";

import BigLogo from "./BigLogo";
import BigLogoAnimated from "./BigLogoAnimated";

import { ACCENT } from "../theme";
import useStackNavigation from "../useStackNavigation";

const isAndroid = Platform.OS !== "ios";

export const NOTCH_HEIGHT = isAndroid ? 0 : 44;
export const LOGO_SAFE_PADDING = 136 + 48 - 56;

// Fix needed for Android display order.
const LOGO_ELEVATION = isAndroid ? 6 : undefined;

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: 'white',
  },
  scaffold: {
    flex: 1,
  },
  logo: {
    position: "absolute",
    top: NOTCH_HEIGHT + 16,
    alignSelf: "center",
    elevation: LOGO_ELEVATION,
  },
  // Smaller logo.
  smallLogo: {
    position: "absolute",
    top: NOTCH_HEIGHT - 2 - (140 - 42) / 2,
    transform: [
      {
        scale: 42 / 140,
      },
    ],
    alignSelf: "center",
    elevation: LOGO_ELEVATION,
  },
});

interface Props {
  children: React.ReactNode;
  smallLogo?: boolean;
  scrollY?: Animated.Value<number>;
}

/**
 * Scaffold controls the title bar, custom styling, and link to Profile.
 */
const Scaffold: React.FC<Props> = ({ children, scrollY, smallLogo }: Props) => {
  // If undefined just use system value.
  const barHeight = isAndroid ? 0 : undefined;

  const navigation = useStackNavigation();

  const appBar = (
    <Appbar.Header
      style={styles.appbar}
      statusBarHeight={barHeight}
    >
      {/* Expander so icon is on the righgt side. */}
      <View style={{ flex: 1 }} />
      {navigation && (
        <Appbar.Action
          icon="account-circle"
          onPress={() => navigation.navigate("Profile")}
          color={ACCENT}
        />
      )}
    </Appbar.Header>
  );

  return (
    <View style={styles.scaffold}>
      {appBar}
      {children}
      {!smallLogo && !scrollY && (
        <View style={styles.logo}>
          <BigLogo />
        </View>
      )}
      {!smallLogo && scrollY && (
        <View style={styles.logo}>
          <BigLogoAnimated scrollY={scrollY} />
        </View>
      )}
      {smallLogo && (
        <View style={styles.smallLogo}>
          <BigLogo />
        </View>
      )}
    </View>
  );
};

export default Scaffold;
