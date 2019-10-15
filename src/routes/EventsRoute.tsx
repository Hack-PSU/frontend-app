import React from "react";

import { Appbar } from "react-native-paper";

const EventsRoute: React.FC = () => {
  return (
    <Appbar.Header>
      <Appbar.Content title="HackPSU: Events" />
      <Appbar.Action icon="person" />
    </Appbar.Header>
  );
}

export default EventsRoute