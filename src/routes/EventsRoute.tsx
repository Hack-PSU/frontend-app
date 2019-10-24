import React, { useState } from "react";
import { FlatList, View, StyleSheet, SectionList } from "react-native";
import { FAB } from "react-native-paper";

import Scaffold from "../components/Scaffold";
import Subtitle from "../components/Subtitle";

import ScheduleControl, { Values } from "../components/ScheduleControl";
import EventListItem from "../components/EventListItem";

import { EventModel } from "../models/event-model";
import { BACKGROUND } from "../theme";

const FAKE_DATA: EventModel[] = [
  EventModel.parseJSON({
    uid: "yoga_linkedin",
    event_title: "Yoga & LinkedIn",
    event_type: "Entertainment",
    event_description:
      "Google wants you to do things with it's products because it's a company and that's what it does.",
    event_start_time: "2019-11-02T12:30:00-0500",
    event_end_time: "2019-11-02T14:30:00-0500",
    location_name: "Room 103"
  }),
  EventModel.parseJSON({
    uid: "food",
    event_title: "Midnight DP Dough",
    event_type: "Food",
    event_description:
      "Google wants you to do things with it's products because it's a company and that's what it does.",
    event_start_time: "2019-11-03T00:30:00-0500",
    event_end_time: "2019-11-03T02:30:00-0500",
    location_name: "Area next to lobby"
  }),
  EventModel.parseJSON({
    uid: "awards_ceremony",
    event_title: "Awards Ceremony",
    event_type: "Event",
    event_description:
      "Google wants you to do things with it's products because it's a company and that's what it does.",
    event_start_time: "2019-11-03T12:30:00-0500",
    event_end_time: "2019-11-03T14:30:00-0500",
    location_name: "Lobby"
  })
];

const styles = StyleSheet.create({
  section: {
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: BACKGROUND
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    borderRadius: 16,
  },
});

const EventsRoute: React.FC = () => {
  const [filter, setFilter] = useState<Values>("Saturday");

  const listHeader = <Subtitle>Events</Subtitle>;
  const sectionHeader = (
    <View style={styles.section}>
      <ScheduleControl
        value={filter}
        onChange={newValue => setFilter(newValue)}
      />
    </View>
  );

  return (
    <Scaffold title="Events">
      <SectionList
        sections={[
          {
            data: FAKE_DATA as any
          }
        ]}
        renderItem={({ item }) => <EventListItem key={item.uid} model={item} />}
        keyExtractor={item => item.uid}
        ListHeaderComponent={listHeader}
        stickyHeaderIndices={[0]}
        renderSectionHeader={() => sectionHeader}
        stickySectionHeadersEnabled={true}
      />
      <FAB style={styles.fab} icon="star" color="white" />
    </Scaffold>
  );
};

export default EventsRoute;
