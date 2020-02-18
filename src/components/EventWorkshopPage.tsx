import React, { useState, useEffect } from "react";
import { View, StyleSheet, SectionList, ActivityIndicator } from "react-native";

import { observer } from "mobx-react";

import Scaffold from "../components/Scaffold";
import Subtitle from "../components/Subtitle";
import SegmentedControl from "../components/SegmentedControl";
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

interface Props {
  eventType: string;
  renderItem: ({ item }) => JSX.Element;
}

const EventWorkshopPage: React.FC<Props> = observer(props => {
  const [filter, setFilter] = useState(ALL);
  useEffect(() => {
    DataService.fetchEvents();
  }, []);

  const { events } = DataService;
  const data = events.data || [];

  const listHeader = <Subtitle>{props.eventType}</Subtitle>;
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
    <Scaffold title={props.eventType}>
      <SectionList
        sections={[
          // Workshops get their own section so filter them out.
          {
            data: data.filter(event =>
              props.eventType === "Events"
                ? event.event_type !== "workshop"
                : event.event_type === "workshop"
            )
          }
        ]}
        renderItem={props.renderItem}
        keyExtractor={item => item.uid}
        ListHeaderComponent={listHeader}
        stickyHeaderIndices={[0]}
        renderSectionHeader={() => sectionHeader}
        stickySectionHeadersEnabled={true}
      />
    </Scaffold>
  );
});

export default EventWorkshopPage;
