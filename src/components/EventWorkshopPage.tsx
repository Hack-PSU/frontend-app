import React, { useState, useEffect } from "react";
import { View, StyleSheet, SectionList, ActivityIndicator, AsyncStorage } from "react-native";
import Animated from "react-native-reanimated";

import { observer } from "mobx-react";

import Scaffold, { LOGO_SAFE_PADDING } from "../components/Scaffold";
import Subtitle from "../components/Subtitle";
import SegmentedControl from "../components/SegmentedControl";
import ErrorCard from "../components/ErrorCard";
import EventWorkshopListItem from "../components/EventWorkshopListItem";

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

export const EVENTS = "Events";
export const WORKSHOPS = "Workshops";

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

interface Props {
  eventType: "Events" | "Workshops";
}

const EventWorkshopPage: React.FC<Props> = observer(props => {
  const [filter, setFilter] = useState(ALL);
  useEffect(() => {
    DataService.fetchEvents();
  }, []);

  const { scrollY, onScroll } = useScrollY();

  const { events } = DataService;
  const data = events.data || [];

  const [actualEventsList, setActualEventsList] = useState([]);
  const [workshopsList, setWorkshopsList] = useState([]);

  // Set the separate lists to actual data when the data from the server is loaded
  // And when the lists aren't already loaded (so the starred items aren't overridden)
  if (events.data && !actualEventsList.length && !workshopsList.length) {
    setActualEventsList(data.filter(event => event.event_type !== "workshop"));
    setWorkshopsList(data.filter(event => event.event_type === "workshop"));
  }

  const renderItem = ({ item, index }) => (
    <EventWorkshopListItem
      key={item.uid}
      model={item}
      starItem={() => starItem(index)}
    />
  );

  // This is called when the star button is clicked on an item
  const starItem = index => {
    var temp = [];
    // Make sure we're modifying the correct event
    if (props.eventType === EVENTS) {
      // Don't copy the pointer of the array, copy the values of the array
      Object.assign(temp, actualEventsList);
    } else {
      Object.assign(temp, workshopsList);
    }

    temp[index].starred = !temp[index].starred;

    if (props.eventType === EVENTS) {
      setActualEventsList(temp);
    } else {
      setWorkshopsList(temp);
    }

    storeList(props.eventType, temp.filter(event => event.starred));
  };

  // Used for storing starred items
  const storeList = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
    console.log(`Successfully saved ${JSON.stringify(value)} in ${key}`);
  }

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

  var correctEventList =
    props.eventType === EVENTS ? actualEventsList : workshopsList;
  // If the user is in the starred section, then only show the starred items
  if (filter === STARRED) {
    correctEventList = correctEventList.filter(event => event.starred);
  }

  return (
    <Scaffold scrollY={scrollY}>
      <AnimatedSectionList
        sections={[
          {
            data: correctEventList
          }
        ]}
        renderItem={renderItem}
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
