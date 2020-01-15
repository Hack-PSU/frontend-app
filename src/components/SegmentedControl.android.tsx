import React from "react";
import { StyleSheet } from "react-native";

import SegmentedControlTab from "react-native-segmented-control-tab";

import { BACKGROUND, TEXT_LIGHT } from "../theme";

const styles = StyleSheet.create({
  // Android only
  tabsContainerStyle: {
    height: 40,
    marginLeft: 32,
    marginRight: 32,
    fontSize: 14,
  },
  tabStyle: {
    backgroundColor: BACKGROUND,
    borderColor: TEXT_LIGHT,
    borderWidth: 2,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  firstTabStyle: {
    borderLeftWidth: 2,
    borderRightWidth: 0,
  },
  lastTabStyle: {
    borderRightWidth: 2,
    borderLeftWidth: 0,
  },
  activeTabStyle: {
    backgroundColor: BACKGROUND,
  },
  tabTextStyle: {
    fontFamily: "Plex-Mono",
    fontWeight: "500",
    fontSize: 14,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.37)"
  }
})

interface Props {
  values: string[];
  value: string;
  onChange: (newValue: string) => any;
}

const SegmentedControl: React.FC<Props> = ({ values, value, onChange }) => {
  // Use custom segmented control.
  return (
    <SegmentedControlTab
      values={values}
      selectedIndex={values.indexOf(value)}
      onTabPress={index => onChange(values[index])}
      borderRadius={20}
      tabsContainerStyle={styles.tabsContainerStyle}
      tabStyle={styles.tabStyle}
      firstTabStyle={styles.firstTabStyle}
      lastTabStyle={styles.lastTabStyle}
      activeTabStyle={styles.activeTabStyle}
      tabTextStyle={styles.tabTextStyle}
    />
  );
};

export default SegmentedControl;
