import React from "react";
import { StyleSheet } from "react-native";
import { Card, Title, Paragraph, Headline } from "react-native-paper";

import { TEXT } from "../theme";

interface Props {
  description?: string;
  info?: string;
  onPress?: any;
  children?: React.ReactNode;
}

const HomeListItem: React.FC<Props> = props => {
  return (
    <Card style={styles.card} onPress={props.onPress}>
      <Card.Content>
        {props.description && <Title style={styles.description}>{props.description}</Title>}
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
    marginRight: 10,
  },

  description: {
    marginBottom: 10,
    color: "gray"
  },

  info: {
    color: TEXT
  }
});

export default HomeListItem;
