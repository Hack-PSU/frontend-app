import React from "react";
import { ActivityIndicator, StyleSheet, View, Linking } from "react-native";
import { Text, Title } from "react-native-paper";
import { useAsync } from "react-async";
import { observer } from "mobx-react";
import HomeListItem from "../components/HomeListItem";
import HomeListItemHorizontal from "../components/HomeListItemHorizontal";
import DateCountDown from "../components/DateCountDown";
import { TEXT_LIGHT } from "../theme";

import Scaffold from "../components/Scaffold";

import { RegistrationApiResponse } from "../models/registration";

import AuthService from "../services/AuthService";
import DataService from "../services/DataService";

async function getRegistrationStatus({
  currentUser
}: {
  currentUser: firebase.User;
}): Promise<RegistrationApiResponse> {
  return DataService.getRegistrationStatus(currentUser);
}

const HomeRoute: React.FC = observer(() => {
  const { data: registration, isPending } = useAsync({
    promiseFn: getRegistrationStatus,
    currentUser: AuthService.currentUser
  });

  const slackInviteUrl =
    "https://join.slack.com/t/hackpsu-group/shared_invite/enQtODE3Mzc5NDI1NjQ4LTJmMDkzYmQ0ODRmNGNjOTE0MzkyMGY0Y2ZiODJjYmQwNDM5MzFiODc2MTY5YzdjYWJiN2FlZmM4MTNhMzU0YmU";

  return (
    <Scaffold title="Home">
      <Title style={styles.title}>HOME</Title>

      <DateCountDown />
      <HomeListItem
        description="My PIN Number"
        info={isPending ? "..." : registration.pin.toString()}
      />

      <View style={styles.horizontalCardView}>
        <HomeListItemHorizontal description="Wi-Fi">
          <Text style={styles.horizontalCardText}>Username: hackpsu</Text>
          <Text style={styles.horizontalCardText}>Password: plz</Text>
        </HomeListItemHorizontal>
        {/* Will change URL later */}
        <HomeListItemHorizontal
          description="Slack"
          onPress={() => Linking.openURL(slackInviteUrl)}
        >
          <Text style={styles.horizontalCardText}>
            Request an invite by clicking here!
          </Text>
        </HomeListItemHorizontal>
      </View>
    </Scaffold>
  );
});

const styles = StyleSheet.create({
  title: {
    fontFamily: "Cornerstone",
    color: TEXT_LIGHT,
    fontSize: 48,
    paddingTop: 55,
    paddingBottom: 15,
    paddingLeft: 15
  },

  horizontalCardView: {
    flexDirection: "row"
  },

  horizontalCardText: {
    color: "gray"
  }
});

export default HomeRoute;
