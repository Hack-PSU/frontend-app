import React from "react";
import { StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
  pageTitle: {
    fontFamily: "Cornerstone",
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 16,
    fontSize: 48,
    color: "white"
  }
});

interface Props {
  children: string;
}

const Subtitle: React.FC<Props> = ({ children }: Props) => {
  return <Text style={styles.pageTitle}>{children}</Text>;
};

export default Subtitle;