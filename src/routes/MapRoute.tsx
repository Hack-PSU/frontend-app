import React from "react";

import { Appbar } from "react-native-paper";

const MapRoute: React.FC = () => {
  return (
    <Appbar.Header>
      <Appbar.Content title="HackPSU: Map" />
      <Appbar.Action icon="person" />
    </Appbar.Header>
  );
}

export default MapRoute