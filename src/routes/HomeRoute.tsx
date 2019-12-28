import React from "react";
import { ActivityIndicator, StyleSheet, View, Linking } from "react-native";
import { Text, Title } from "react-native-paper";
import { useAsync } from "react-async";
import { observer } from "mobx-react";
import HomeListItem from "../components/HomeListItem";
import HomeListItemHorizontal from "../components/HomeListItemHorizontal";
import DateCounter from "../components/DateCounter";
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

  return (
    <Scaffold title="Home">
      <Title style={styles.title}>HOME</Title>

      <DateCounter />
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
          onPress={() => Linking.openURL("https://github.com/Hack-PSU")}
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
