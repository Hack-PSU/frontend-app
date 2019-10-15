import React from "react";

import { Appbar } from "react-native-paper";

const HomeRoute: React.FC = () => {
  return (
    <Appbar.Header>
      <Appbar.Content title="HackPSU: Home" />
      <Appbar.Action icon="person" />
    </Appbar.Header>
  );
}

export default HomeRoute