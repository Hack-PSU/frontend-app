import React, { useState } from "react";
import { View, StyleSheet, SectionList } from "react-native";

import { useAsync } from "react-async";
import { observer } from "mobx-react";

import Scaffold from "../components/Scaffold";
import Subtitle from "../components/Subtitle";
import SegmentedControl from "../components/SegmentedControl";
import EventListItem from "../components/EventListItem";

import DataService from "../services/DataService";

import { BACKGROUND } from "../theme";

const styles = StyleSheet.create({
  section: {
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: BACKGROUND
  },
});

const ALL = "All";
const STARRED = "Starred";

const EventsRoute: React.FC = observer(() => {
  const { data, isPending } = useAsync({
    promiseFn: DataService.getEvents
  });

  const [filter, setFilter] = useState(ALL);

  const listHeader = <Subtitle>Events</Subtitle>;
  const sectionHeader = (
    <View style={styles.section}>
      <SegmentedControl
        values={[ALL, STARRED]}
        value={filter}
        onChange={newValue => setFilter(newValue)}
      />
    </View>
  );

  return (
    <Scaffold title="Events">
      <SectionList
        sections={[
          // Workshops get their own section so filter them out.
          {
            data: (data || []).filter(event => event.event_type !== "workshop")
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
