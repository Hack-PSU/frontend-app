import React from "react";
import { FlatList } from "react-native";

import Scaffold from "../components/Scaffold";
import Subtitle from "../components/Subtitle";
import EventListItem from "../components/EventListItem";

import { EventModel } from "../models/event-model";

const FAKE_DATA: EventModel[] = [
  EventModel.parseJSON({
    uid: "abc123",
    event_title: "Yoga & LinkedIn",
    event_type: "education",
    event_description: "Google wants you to do things with it's products because it's a company and that's what it does.",
    event_start_time: "2019-11-02T12:30:00-0500",
    event_end_time: "2019-11-02T14:30:00-0500",
    location_name: "Room 103"
  })
];

const EventsRoute: React.FC = () => {
  return (
    <Scaffold title="Events">
      <FlatList
        data={FAKE_DATA}
        renderItem={({ item }) => <EventListItem key={item.uid} model={item} />}
        keyExtractor={item => item.uid}
        ListHeaderComponent={<Subtitle>Events</Subtitle>}
      />
    </Scaffold>
  );
};

export default EventsRoute;
