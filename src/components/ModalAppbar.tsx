import React from "react";
import { Platform } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Appbar } from "react-native-paper";

const isAndroid = Platform.OS !== "ios";

const ModalAppbar: React.FC = () => {
  // If undefined just use system value.
  const barHeight = isAndroid ? 0 : undefined;

  const navigation = useNavigation();

  return (
    <Appbar.Header style={{ backgroundColor: "white", elevation: 0 }} statusBarHeight={barHeight}>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
    </Appbar.Header>
  );
};

export default ModalAppbar;
