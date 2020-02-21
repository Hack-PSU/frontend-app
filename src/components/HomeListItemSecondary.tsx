import React from "react";
import { StyleSheet } from "react-native";
import { Card, Title, Headline } from "react-native-paper";

import { TEXT, DARK_TEXT_THEME } from "../theme";

interface Props {
  description: string,
  onPress?: any,
  children: React.ReactNode
}

const HomeListItemHorizontal: React.FC<Props> = props => {
  return (
    <Card theme={DARK_TEXT_THEME} style={styles.card} onPress={props.onPress}>
      <Card.Content>
        <Title style={styles.headline}>{props.description}</Title>
        {props.children}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10
  },

  headline: {
    marginBottom: 10,
    color: "gray"
  }
});

export default HomeListItemHorizontal;
