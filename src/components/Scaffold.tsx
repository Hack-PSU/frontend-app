import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Appbar } from "react-native-paper";

import AuthService from "../services/AuthService";

import { ACCENT } from "../theme";

const isAndroid = Platform.OS !== "ios";

const styles = StyleSheet.create({
  scaffold: {
    flex: 1
  },
  title: {
    alignSelf: "center",
    paddingLeft: isAndroid ? 48 : 0
  },
});

interface Props {
  title: string;
  children: React.ReactNode;
  onPressProfile?: any;
}

/**
 * Scaffold controls the title bar, custom styling, and link to Profile.
 */
const Scaffold: React.FC<Props> = ({ title, children, onPressProfile }: Props) => {
  // If undefined just use system value.
  const barHeight = isAndroid ? 0 : undefined;

  const appBar = (
    <Appbar.Header style={{ backgroundColor: "white" }} statusBarHeight={barHeight}>
      <Appbar.Content title="HackPSU" titleStyle={styles.title} />
      <Appbar.Action icon="account-circle" onPress={() => AuthService.signOut()} color={ACCENT} />
    </Appbar.Header>
  )

  return (
    <View style={styles.scaffold}>
      {appBar}
      {children}
    </View>
  );
};

export default Scaffold;
