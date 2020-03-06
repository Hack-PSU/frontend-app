import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Avatar, Chip, IconButton } from "react-native-paper";

import { format } from "date-fns";

import { EventModel } from "../models/event-model";

import { TEXT, PRIMARY, DARK_TEXT_THEME, RED, YELLOW, PURPLE } from "../theme";

// Date formats.
// See options here: https://date-fns.org/v2.6.0/docs/format

// Displays like 12:05p
const TIME = "h:mmaaaaa";
// Displays 'Sunday', etc.
const WEEKDAY = "EEEE";

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 16
  },
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

const EVENT_TYPE_COLORS = {
  activity: YELLOW,
  food: RED,
  workshop: PURPLE
};

const EVENT_TYPE_TEXT_COLORS = {
  activity: "rgba(255,255,255,0.89)",
  food: "rgba(255,255,255,0.89)",
  workshop: "rgba(255,255,255,0.89)"
};

const EVENT_TYPE_ICONS = {
  activity: "star",
  food: "restaurant-menu",
  workshop: "code"
};

interface Props {
  model: EventModel;
  starItem: () => void;
}

const EventWorkshopListItem: React.FC<Props> = ({ model, starItem }) => {
  const startDate = model.event_start_time;
  const endDate = model.event_end_time;

  const subtitle =
    format(startDate, `${WEEKDAY}, ${TIME}`) + " — " + format(endDate, TIME);

  const avatar = (
    <Avatar.Icon
      size={42}
      icon={EVENT_TYPE_ICONS[model.event_type]}
      color={EVENT_TYPE_TEXT_COLORS[model.event_type]}
      theme={{ colors: { primary: EVENT_TYPE_COLORS[model.event_type] } }}
      style={styles.avatar}
    />
  );

  const star = (
    <IconButton
      icon={model.starred ? "star" : "star-border"}
      size={24}
      animated
      onPress={() => starItem()}
      color={model.starred ? "#FDD835" : "#000"}
    />
  );

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
        <Chip icon="location-on" mode="outlined">
          {model.location_name}
        </Chip>
      </View>
    </Card>
  );
};

export default EventWorkshopListItem;
