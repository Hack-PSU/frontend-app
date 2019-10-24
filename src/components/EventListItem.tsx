import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Avatar, Chip, IconButton } from "react-native-paper";

import { parseISO, format } from "date-fns";

import { EventModel } from "../models/event-model";

import { TEXT, PRIMARY, DARK_TEXT_THEME, TEXT_LIGHT, ACCENT } from "../theme";

// Date formats.
// See options here: https://date-fns.org/v2.6.0/docs/format

// Displays like 12:05p
const TIME = "h:mmaaaaa";
// Displays 'Sunday', etc.
const WEEKDAY = "EEEE";

const styles = StyleSheet.create({
  card: {
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8
  },
  title: {
    lineHeight: 32,
    fontSize: 24,
    color: TEXT,
    fontWeight: "normal"
  },
  subtitle: {
    fontFamily: "Plex-Mono",
    lineHeight: 18,
    fontSize: 14,
    color: PRIMARY,
    letterSpacing: 0.2
  },
  row: {
    width: "100%",
    flexDirection: "row",
    marginLeft: 16,
    marginRight: 16,
    marginTop: 4,
    marginBottom: 12
  }
});

interface Props {
  model: EventModel;
}

const EventListItem: React.FC<Props> = ({ model }) => {
  const startDate = parseISO(model.event_start_time);
  const endDate = parseISO(model.event_end_time);

  const subtitle =
    format(startDate, `${WEEKDAY}, ${TIME}`) + " — " + format(endDate, TIME);

  const avatar = (
    <Avatar.Icon
      size={42}
      icon="event-seat"
      color={TEXT_LIGHT}
      theme={{ colors: { primary: ACCENT } }}
    />
  );

  const star = <IconButton icon="star-border" size={24} />;

  return (
    <Card theme={DARK_TEXT_THEME} style={styles.card}>
      <Card.Title
        title={model.event_title}
        titleStyle={styles.title}
        subtitle={subtitle}
        subtitleStyle={styles.subtitle}
        left={() => avatar}
        right={() => star}
      />

      <View style={styles.row}>
        <Chip icon="location-on" mode="outlined">{model.location_name}</Chip>
      </View>
    </Card>
  );
};

export default EventListItem;
