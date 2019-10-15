import React from "react";

import { Appbar } from "react-native-paper";

const WorkshopsRoute: React.FC = () => {
  return (
    <Appbar.Header>
      <Appbar.Content title="HackPSU: Workshops" />
      <Appbar.Action icon="person" />
    </Appbar.Header>
  );
}

export default WorkshopsRoute