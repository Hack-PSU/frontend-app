import React from "react";
import { View, StyleSheet } from "react-native";

import SegmentedControlIOS from "@react-native-community/segmented-control";

const styles = StyleSheet.create({
  // iOS only
  iosContainerStyle: {
    marginLeft: 32,
    marginRight: 32,
    fontSize: 14,
  },
  iosSubContainerStyle: {
    borderRadius: 8,
    backgroundColor: "white"
  },
})

interface Props {
  values: string[];
  value: string;
  onChange: (newValue: string) => any;
}

const SegmentedControl: React.FC<Props> = ({ values, value, onChange }) => {
  // Use native segmented control.
  return (
    <View style={styles.iosContainerStyle}>
      <View style={styles.iosSubContainerStyle}>
        <SegmentedControlIOS
          values={values}
          selectedIndex={values.indexOf(value)}
          onChange={event => onChange(values[event.nativeEvent.selectedSegmentIndex])}
        />
      </View>
    </View>
  );
};

export default SegmentedControl;
