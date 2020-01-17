import React from "react";
import { View, StyleSheet, Platform, StatusBar } from "react-native";
import { Appbar } from "react-native-paper";

import AuthService from "../services/AuthService";

import { ACCENT } from "../theme";
import BigLogo from "./BigLogo";

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
  }
});

interface Props {
  title: string;
  children: React.ReactNode;
  onPressProfile?: any;
  smallLogo?: boolean;
}

/**
 * Scaffold controls the title bar, custom styling, and link to Profile.
 */
const Scaffold: React.FC<Props> = ({ title, children, onPressProfile, smallLogo }: Props) => {
  // If undefined just use system value.
  const barHeight = isAndroid ? 0 : undefined;

  const appBar = (
    <Appbar.Header style={{ backgroundColor: "white" }} statusBarHeight={barHeight}>
      <Appbar.Action icon="account-circle" onPress={() => AuthService.signOut()} color={ACCENT} />
    </Appbar.Header>
  )

  return (
    <View style={styles.scaffold}>
      {appBar}
      {!smallLogo && (<View style={styles.logo}><BigLogo /></View>)}
      {children}
    </View>
  );
};

export default Scaffold;
