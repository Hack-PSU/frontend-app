import React from "react";
import { View, StyleSheet, Text, SafeAreaView, Platform } from "react-native";

import { Appbar } from "react-native-paper";

import { ACCENT } from "../theme";

const styles = StyleSheet.create({
  scaffold: {
    flex: 1
  },
  title: {
    alignSelf: "center",
    paddingLeft: Platform.OS === 'android' ? 48 : 0
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
  const barHeight = Platform.OS === 'android' ? 0 : undefined;

  return (
    <View style={styles.scaffold}>
      <Appbar.Header style={{ backgroundColor: "white" }} statusBarHeight={barHeight}>
        <Appbar.Content title="HackPSU" titleStyle={styles.title} />
        <Appbar.Action icon="account-circle" onPress={onPressProfile} color={ACCENT} />
      </Appbar.Header>
      {children}
    </View>
  );
};

export default Scaffold;
