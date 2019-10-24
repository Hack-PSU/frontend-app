import React from "react";
import { StyleSheet } from "react-native";

import SegmentedControlTab from "react-native-segmented-control-tab";

import { BACKGROUND, TEXT_LIGHT } from "../theme";

const styles = StyleSheet.create({
  tabsContainerStyle: {
    height: 40,
    marginLeft: 16,
    marginRight: 16,
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
  },
  lastTabStyle: {
    borderRightWidth: 2,
  },
  activeTabStyle: {
    backgroundColor: BACKGROUND,
  },
  tabTextStyle: {
    fontWeight: "500",
    fontSize: 14,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.37)"
  }
})

export type Values = "All" | "Saturday" | "Sunday";
const VALUES: Values[] = ["All", "Saturday", "Sunday"];

interface Props {
  value: Values;
  onChange: (newValue: Values) => any;
}

const ScheduleControl: React.FC<Props> = ({ value, onChange }) => {
  return (
    <SegmentedControlTab
      values={VALUES}
      selectedIndex={VALUES.indexOf(value)}
      onTabPress={index => onChange(VALUES[index])}
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

export default ScheduleControl;
