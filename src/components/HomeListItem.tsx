import React from "react";
import { StyleSheet } from "react-native";
import { Card, Title, Paragraph, Headline } from "react-native-paper";

import { TEXT, DARK_TEXT_THEME } from "../theme";

interface Props {
  description?: string;
  info?: string;
  onPress?: any;
  children?: React.ReactNode;
}

const HomeListItem: React.FC<Props> = props => {
  return (
    <Card theme={DARK_TEXT_THEME} style={styles.card} onPress={props.onPress}>
      <Card.Content>
        {props.description && <Paragraph style={styles.description}>{props.description}</Paragraph>}
        {props.info && <Headline style={styles.info}>{props.info}</Headline>}
        {props.children}
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
    color: TEXT
  }
});

export default HomeListItem;
