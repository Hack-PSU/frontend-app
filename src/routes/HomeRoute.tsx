import React from "react";
import { Text, ActivityIndicator, StyleSheet } from "react-native";
import { Title } from "react-native-paper";
import { useAsync } from "react-async";
import { observer } from "mobx-react";
import HomeListItem from "../components/HomeListItem";
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
      {/* <ActivityIndicator animating={isPending} />
      {!isPending && (
        <Text style={{ color: "white", fontSize: 36 }}>
          My pin is... {registration.pin}
        </Text>
      )} */}
      <Title style={styles.title}>HOME</Title>

      <HomeListItem description="Time Left" info="2 hours, 5 minutes" />
      <HomeListItem description="My PIN Number" info="12345" />
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
  }
});

export default HomeRoute;
