import React, { useState, useEffect } from "react";
import { View, StyleSheet, SectionList, ActivityIndicator } from "react-native";
import Animated from "react-native-reanimated";

import { observer } from "mobx-react";

import Scaffold, { LOGO_SAFE_PADDING } from "../components/Scaffold";
import Subtitle from "../components/Subtitle";
import SegmentedControl from "../components/SegmentedControl";
import ErrorCard from "../components/ErrorCard";

import DataService from "../services/DataService";

import useScrollY from "../useScrollY";
import { BACKGROUND } from "../theme";

const styles = StyleSheet.create({
  title: {
    paddingTop: LOGO_SAFE_PADDING
  },
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

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

interface Props {
  eventType: string;
  renderItem: ({ item }) => JSX.Element;
}

const EventWorkshopPage: React.FC<Props> = observer(props => {
  const [filter, setFilter] = useState(ALL);
  useEffect(() => {
    DataService.fetchEvents();
  }, []);

  const { scrollY, onScroll } = useScrollY();

  const { events } = DataService;
  const data = events.data || [];

  const listHeader = (
    <View style={styles.title}>
      <Subtitle>{props.eventType}</Subtitle>
    </View>
  );
  const sectionHeader = (
    <View style={styles.section}>
      <SegmentedControl
        values={[ALL, STARRED]}
        value={filter}
        onChange={newValue => setFilter(newValue)}
      />
      {events.loading && (
        <ActivityIndicator animating size="large" style={styles.loading} />
      )}
      {events.error && (
        <ErrorCard error={events.error.message || events.error} />
      )}
    </View>
  );

  return (
    <Scaffold scrollY={scrollY}>
      <AnimatedSectionList
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
        scrollEventThrottle={1}
        onScroll={onScroll}
        renderScrollComponent={props => <Animated.ScrollView {...props} />}
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
