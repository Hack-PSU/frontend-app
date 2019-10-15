import React from "react";
import { View, StyleSheet, Text } from "react-native";

import { Appbar } from "react-native-paper";

const styles = StyleSheet.create({
  scaffold: {
    flex: 1
  },
  title: {
    alignSelf: "center",
    paddingLeft: 48
  },
  pageTitle: {
    fontFamily: "Cornerstone",
    paddingTop: 24,
    paddingLeft: 16,
    fontSize: 48,
    color: "white"
  }
});

interface Props {
  title: string;
  children: React.ReactChild;
  onPressProfile?: any;
}

/**
 * Scaffold controls the title bar, custom styling, and link to Profile.
 */
const Scaffold: React.FC<Props> = ({ title, children, onPressProfile }: Props) => {
  return (
    <View style={styles.scaffold}>
      <Appbar.Header style={{ backgroundColor: "white" }} statusBarHeight={0}>
        <Appbar.Content title="HackPSU" titleStyle={styles.title} />
        <Appbar.Action icon="account-circle" onPress={onPressProfile} />
      </Appbar.Header>
      <Text style={styles.pageTitle}>{title}</Text>
      {children}
    </View>
  );
};

export default Scaffold;
