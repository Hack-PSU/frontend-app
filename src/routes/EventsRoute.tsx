import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  SectionList,
  ActivityIndicator
} from "react-native";

import { observer } from "mobx-react";

import Scaffold from "../components/Scaffold";
import Subtitle from "../components/Subtitle";
import SegmentedControl from "../components/SegmentedControl";
import EventListItem from "../components/EventListItem";
import ErrorCard from "../components/ErrorCard";

import DataService from "../services/DataService";

import { BACKGROUND } from "../theme";

const styles = StyleSheet.create({
  section: {
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: BACKGROUND
  },
  loading: {
    margin: 20
  }
});

const ALL = "All";
const STARRED = "Starred";

const EventsRoute: React.FC = observer(() => {
  const [filter, setFilter] = useState(ALL);
  useEffect(() => {
    DataService.fetchEvents();
  }, []);

  const { events } = DataService;
  const data = events.data || [];

  const listHeader = <Subtitle>Events</Subtitle>;
  const sectionHeader = (
    <View style={styles.section}>
      <SegmentedControl
        values={[ALL, STARRED]}
        value={filter}
        onChange={newValue => setFilter(newValue)}
      />
      {(events.loading || events.error) && (
        <ActivityIndicator animating size="large" style={styles.loading} />
      )}
      {events.error && (
        <ErrorCard error={events.error.message || events.error} />
      )}
    </View>
  );

  return (
    <Scaffold title="Events">
      <SectionList
        sections={[
          // Workshops get their own section so filter them out.
          {
            data: data.filter(event => event.event_type !== "workshop")
          }
        ]}
        renderItem={({ item }) => <EventListItem key={item.uid} model={item} />}
        keyExtractor={item => item.uid}
        ListHeaderComponent={listHeader}
        stickyHeaderIndices={[0]}
        renderSectionHeader={() => sectionHeader}
        stickySectionHeadersEnabled={true}
      />
    </Scaffold>
  );
});

export default EventsRoute;
