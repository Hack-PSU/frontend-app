import React from "react";
import { StyleSheet } from "react-native";
import { Card, Avatar } from "react-native-paper";

import { parseISO, format } from "date-fns";

import { EventModel } from "../models/event-model";

import { TEXT, PRIMARY, DARK_TEXT_THEME, TEXT_LIGHT } from "../theme";

// Date formats.
// See options here: https://date-fns.org/v2.6.0/docs/format

// Displays like 12:05p 
const TIME = "h:mmaaaaa";
// Displays 'Sunday', etc.
const WEEKDAY = "EEEE";
// Displays 0-23 (24hr time).
const HR24 = "HH";

const styles = StyleSheet.create({
  card: {
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  title: {
    lineHeight: 32,
    fontSize: 24,
    color: TEXT,
    fontWeight: 'normal'
  },
  subtitle: {
    fontFamily: "Plex-Mono",
    lineHeight: 18,
    fontSize: 14,
    color: PRIMARY,
    letterSpacing: 0.2,
  },
})

interface Props {
  model: EventModel;
}

const EventListItem: React.FC<Props> = ({ model }) => {
  const startDate = parseISO(model.event_start_time);
  const endDate = parseISO(model.event_end_time);

  const subtitle = format(startDate, `${WEEKDAY}, ${TIME}`) + " — " + format(endDate, TIME);

  
  const avatarLabel = format(startDate, HR24);

  const avatar = <Avatar.Text size={42} label={avatarLabel} color={TEXT_LIGHT} />;

  return (
    <Card theme={DARK_TEXT_THEME} style={styles.card}>
      <Card.Title
        title={model.event_title}
        titleStyle={styles.title}
        subtitle={subtitle}
        subtitleStyle={styles.subtitle}
        left={() => avatar}
      />
    </Card>
  );
}

export default EventListItem;