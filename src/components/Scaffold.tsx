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
      {children}
    </View>
  );
};

export default Scaffold;
