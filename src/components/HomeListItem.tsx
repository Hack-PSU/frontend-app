import React from "react";
import { StyleSheet } from "react-native";
import { Card, Paragraph, Headline } from "react-native-paper";

import { TEXT, DARK_TEXT_THEME } from "../theme";

interface Props {
  description: string;
  info: string;
}

const HomeListItem: React.FC<Props> = props => {
  return (
    <Card theme={DARK_TEXT_THEME} style={styles.card}>
      <Card.Content>
        <Paragraph style={styles.description}>{props.description}</Paragraph>
        <Headline>{props.info}</Headline>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10
  },

  description: {
    fontSize: 15,
    color: "gray"
  },

  info: {
    color: TEXT,
    fontSize: 35
  }
});

export default HomeListItem;
