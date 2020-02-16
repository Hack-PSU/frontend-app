import React from "react";
import { StyleSheet, Text } from "react-native";
import { Card } from "react-native-paper";

import { DARK_TEXT_THEME, RED, ACCENT } from "../theme";

interface Props {
  error: string;
}

const ErrorCard: React.FC<Props> = props => {
  return (
    <Card theme={DARK_TEXT_THEME} style={styles.card}>
      <Card.Content>
        <Text>
          Error "{props.error}". Please screenshot this and contact the HackPSU
          team.
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: RED,
    borderColor: ACCENT,
    borderWidth: 2
  }
});

export default ErrorCard;
